<?php
// Shared helpers for the Al Zubair API: config, database, JSON I/O, auth, rate limits, mail.

declare(strict_types=1);

const COLLECTIONS = ['orders', 'kyc', 'feedback', 'messages'];
const CODE_PREFIX = ['orders' => 'ZB', 'kyc' => 'KYC', 'feedback' => 'FB', 'messages' => 'MSG'];
const SECTIONS = ['orders', 'kyc', 'feedback', 'contact'];
// Fields the public tracking endpoint may reveal (no names, phones, emails or notes).
const TRACK_FIELDS = ['code', 'status', 'history', 'createdAt', 'updatedAt', 'services', 'type'];

const STORAGE_DIR = __DIR__ . '/storage';
// Works on Apache 2.2 and 2.4.
const DENY_ALL = "<IfModule mod_authz_core.c>
  Require all denied
</IfModule>
<IfModule !mod_authz_core.c>
  Deny from all
</IfModule>
";
const UPLOAD_DIR = __DIR__ . '/../uploads';

function config(): array
{
    static $config = null;
    if ($config === null) {
        $file = __DIR__ . '/config.php';
        if (!is_file($file)) fail(500, 'not-configured');
        $config = require $file;
    }
    return $config;
}

// ---------- HTTP ----------

function respond($payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(int $status, string $error): void
{
    respond(['error' => $error], $status);
}

function body(): array
{
    static $body = null;
    if ($body === null) {
        $raw = file_get_contents('php://input') ?: '';
        if (strlen($raw) > 300000) fail(413, 'too-large');
        $body = $raw === '' ? [] : json_decode($raw, true);
        if (!is_array($body)) fail(400, 'bad-json');
    }
    return $body;
}

function cors(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin && in_array($origin, config()['allowed_origins'] ?? [], true)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Vary: Origin');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    }
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') exit;
}

function client_ip(): string
{
    return substr($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0', 0, 45);
}

// ---------- Database ----------

function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $c = config()['db'];
        try {
            $pdo = new PDO($c['dsn'], $c['user'] ?? null, $c['pass'] ?? null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        } catch (PDOException $e) {
            fail(500, 'db-connect');
        }
        migrate($pdo);
    }
    return $pdo;
}

// Creates the tables on first use (portable SQL: works on MySQL/MariaDB and SQLite).
function migrate(PDO $pdo): void
{
    $flag = STORAGE_DIR . '/.migrated-v1';
    if (is_file($flag)) return;
    ensure_dir(STORAGE_DIR, DENY_ALL);
    $text = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql' ? 'LONGTEXT' : 'TEXT';
    $pdo->exec("CREATE TABLE IF NOT EXISTS records (
        code VARCHAR(24) NOT NULL PRIMARY KEY,
        collection VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL,
        data $text NOT NULL,
        history $text NOT NULL,
        created_at VARCHAR(32) NOT NULL,
        updated_at VARCHAR(32) NULL
    )");
    $pdo->exec('CREATE TABLE IF NOT EXISTS sessions (token_hash CHAR(64) NOT NULL PRIMARY KEY, expires_at INTEGER NOT NULL)');
    $pdo->exec('CREATE TABLE IF NOT EXISTS hits (ip VARCHAR(45) NOT NULL, action VARCHAR(20) NOT NULL, at INTEGER NOT NULL)');
    // MySQL has no CREATE INDEX IF NOT EXISTS, so ignore "already exists" on re-runs.
    foreach (['CREATE INDEX idx_records_collection ON records (collection, created_at)', 'CREATE INDEX idx_hits ON hits (ip, action, at)'] as $sql) {
        try {
            $pdo->exec($sql);
        } catch (PDOException $e) {
        }
    }
    file_put_contents($flag, date('c'));
}

function ensure_dir(string $dir, string $htaccess): void
{
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    if (!is_file("$dir/.htaccess")) file_put_contents("$dir/.htaccess", $htaccess);
}

function now_iso(): string
{
    return gmdate('Y-m-d\TH:i:s.v\Z');
}

function row_to_record(array $row): array
{
    $data = json_decode($row['data'], true) ?: [];
    return array_merge($data, [
        'code' => $row['code'],
        'status' => $row['status'],
        'history' => json_decode($row['history'], true) ?: [],
        'createdAt' => $row['created_at'],
        'updatedAt' => $row['updated_at'],
    ]);
}

function find_record(string $collection, string $code): ?array
{
    $st = db()->prepare('SELECT * FROM records WHERE collection = ? AND code = ?');
    $st->execute([$collection, strtoupper(trim($code))]);
    $row = $st->fetch();
    return $row ? row_to_record($row) : null;
}

function new_code(string $collection): string
{
    $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    do {
        $s = '';
        for ($i = 0; $i < 6; $i++) $s .= $alphabet[random_int(0, strlen($alphabet) - 1)];
        $code = CODE_PREFIX[$collection] . '-' . $s;
        $st = db()->prepare('SELECT 1 FROM records WHERE code = ?');
        $st->execute([$code]);
    } while ($st->fetch());
    return $code;
}

function collection_param(?string $value): string
{
    if (!in_array($value, COLLECTIONS, true)) fail(400, 'bad-collection');
    return $value;
}

// ---------- Auth ----------

function bearer_token(): string
{
    $h = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (!$h && function_exists('getallheaders')) {
        foreach (getallheaders() as $k => $v) if (strtolower($k) === 'authorization') $h = $v;
    }
    return preg_match('/^Bearer\s+([a-f0-9]{64})$/i', trim($h), $m) ? strtolower($m[1]) : '';
}

function is_admin(): bool
{
    static $ok = null;
    if ($ok === null) {
        $token = bearer_token();
        $ok = false;
        if ($token) {
            $st = db()->prepare('SELECT expires_at FROM sessions WHERE token_hash = ?');
            $st->execute([hash('sha256', $token)]);
            $exp = $st->fetchColumn();
            $ok = $exp && (int) $exp > time();
        }
    }
    return $ok;
}

function require_admin(): void
{
    if (!is_admin()) fail(401, 'unauthorized');
}

// ---------- Rate limiting (admins are exempt) ----------

function rate_limit(string $action, int $max, int $windowSeconds): void
{
    if (is_admin()) return;
    $pdo = db();
    $since = time() - $windowSeconds;
    $pdo->prepare('DELETE FROM hits WHERE at < ?')->execute([time() - 86400]);
    $st = $pdo->prepare('SELECT COUNT(*) FROM hits WHERE ip = ? AND action = ? AND at >= ?');
    $st->execute([client_ip(), $action, $since]);
    if ((int) $st->fetchColumn() >= $max) fail(429, 'too-many-requests');
    $pdo->prepare('INSERT INTO hits (ip, action, at) VALUES (?, ?, ?)')->execute([client_ip(), $action, time()]);
}

// ---------- Settings & mail ----------

function settings_file(): string
{
    return STORAGE_DIR . '/settings.json';
}

function read_settings(): ?array
{
    $f = settings_file();
    return is_file($f) ? json_decode((string) file_get_contents($f), true) : null;
}

// The email a section's notifications go to: per-section override → main email → mail_from.
function section_email(?string $section): string
{
    $s = read_settings() ?? [];
    $routed = $section && in_array($section, SECTIONS, true) ? ($s['routing'][$section]['email'] ?? '') : '';
    $email = $routed ?: ($s['contact']['email'] ?? '') ?: config()['mail_from'];
    return filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : config()['mail_from'];
}

function send_mail(string $to, string $subject, string $message, string $replyTo = ''): bool
{
    $from = config()['mail_from'];
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'From: =?UTF-8?B?' . base64_encode('شركة الزبير') . "?= <$from>",
    ];
    if ($replyTo && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) $headers[] = "Reply-To: $replyTo";
    $subject = '=?UTF-8?B?' . base64_encode(mb_substr(str_replace(["\r", "\n"], ' ', $subject), 0, 150)) . '?=';
    return @mail($to, $subject, $message, implode("\r\n", $headers), "-f$from");
}
