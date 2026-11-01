<?php
// Al Zubair API — single entry point: /api/?action=<name>
//
// Public:  settings (GET) · create · track (GET) · notify
// Admin:   login · logout · list (GET) · update · delete · save-settings · upload
// Admin calls send "Authorization: Bearer <token>" returned by login.

declare(strict_types=1);
require __DIR__ . '/lib.php';

cors();
$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function require_post(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') fail(405, 'method-not-allowed');
}

switch ($action) {
    // ---------- Public ----------

    case 'settings': {
        $s = read_settings();
        if ($s === null) fail(404, 'no-settings');
        respond($s);
    }

    case 'create': {
        require_post();
        rate_limit('create', 15, 600);
        $b = body();
        $collection = collection_param($b['collection'] ?? null);
        $data = $b['data'] ?? null;
        if (!is_array($data)) fail(400, 'bad-data');
        unset($data['code'], $data['status'], $data['history'], $data['createdAt'], $data['updatedAt']);
        $status = preg_match('/^[a-z_]{3,20}$/', (string) ($b['status'] ?? '')) ? $b['status'] : 'received';
        $now = now_iso();
        $code = new_code($collection);
        $history = [['status' => $status, 'at' => $now]];
        db()->prepare('INSERT INTO records (code, collection, status, data, history, created_at) VALUES (?, ?, ?, ?, ?, ?)')
            ->execute([$code, $collection, $status, json_encode($data, JSON_UNESCAPED_UNICODE), json_encode($history), $now]);
        respond(find_record($collection, $code), 201);
    }

    case 'track': {
        rate_limit('track', 60, 600);
        $collection = collection_param($_GET['collection'] ?? null);
        $record = find_record($collection, (string) ($_GET['code'] ?? ''));
        if (!$record) fail(404, 'not-found');
        // Admins get everything; the public only gets status information.
        respond(is_admin() ? $record : array_intersect_key($record, array_flip(TRACK_FIELDS)));
    }

    case 'notify': {
        require_post();
        rate_limit('notify', 15, 600);
        $b = body();
        $subject = trim((string) ($b['subject'] ?? ''));
        $message = trim((string) ($b['message'] ?? ''));
        if ($subject === '' || $message === '' || strlen($message) > 20000) fail(400, 'bad-message');
        $to = section_email($b['section'] ?? null);
        respond(['email' => send_mail($to, $subject, $message, (string) ($b['replyTo'] ?? ''))]);
    }

    // ---------- Admin ----------

    case 'login': {
        require_post();
        rate_limit('login', 6, 900);
        $password = (string) (body()['password'] ?? '');
        $expected = (string) (config()['admin_password'] ?? '');
        if ($expected === '' || $expected === 'CHANGE-ME' || !hash_equals($expected, $password)) fail(401, 'wrong-password');
        $token = bin2hex(random_bytes(32));
        $pdo = db();
        $pdo->prepare('DELETE FROM sessions WHERE expires_at < ?')->execute([time()]);
        $pdo->prepare('INSERT INTO sessions (token_hash, expires_at) VALUES (?, ?)')->execute([hash('sha256', $token), time() + 12 * 3600]);
        respond(['token' => $token, 'expiresIn' => 12 * 3600]);
    }

    case 'logout': {
        require_post();
        if ($t = bearer_token()) db()->prepare('DELETE FROM sessions WHERE token_hash = ?')->execute([hash('sha256', $t)]);
        respond(['ok' => true]);
    }

    case 'list': {
        require_admin();
        $collection = collection_param($_GET['collection'] ?? null);
        $st = db()->prepare('SELECT * FROM records WHERE collection = ? ORDER BY created_at DESC LIMIT 2000');
        $st->execute([$collection]);
        respond(array_map('row_to_record', $st->fetchAll()));
    }

    case 'update': {
        require_post();
        require_admin();
        $b = body();
        $collection = collection_param($b['collection'] ?? null);
        $record = find_record($collection, (string) ($b['code'] ?? ''));
        if (!$record) fail(404, 'not-found');
        $patch = is_array($b['patch'] ?? null) ? $b['patch'] : [];
        unset($patch['code'], $patch['history'], $patch['createdAt'], $patch['updatedAt']);
        $now = now_iso();
        $status = $record['status'];
        $history = $record['history'];
        if (isset($patch['status']) && preg_match('/^[a-z_]{3,20}$/', (string) $patch['status']) && $patch['status'] !== $status) {
            $status = $patch['status'];
            $entry = ['status' => $status, 'at' => $now];
            if (!empty($b['note'])) $entry['note'] = mb_substr((string) $b['note'], 0, 500);
            $history[] = $entry;
        }
        unset($patch['status']);
        $data = array_diff_key($record, array_flip(['code', 'status', 'history', 'createdAt', 'updatedAt']));
        $data = array_merge($data, $patch);
        db()->prepare('UPDATE records SET status = ?, data = ?, history = ?, updated_at = ? WHERE code = ?')
            ->execute([$status, json_encode($data, JSON_UNESCAPED_UNICODE), json_encode($history, JSON_UNESCAPED_UNICODE), $now, $record['code']]);
        respond(find_record($collection, $record['code']));
    }

    case 'delete': {
        require_post();
        require_admin();
        db()->prepare('DELETE FROM records WHERE code = ?')->execute([strtoupper((string) (body()['code'] ?? ''))]);
        respond(['ok' => true]);
    }

    case 'save-settings': {
        require_post();
        require_admin();
        $s = body()['settings'] ?? null;
        if (!is_array($s) || !isset($s['contact']) || !is_array($s['contact'])) fail(400, 'bad-settings');
        ensure_dir(STORAGE_DIR, DENY_ALL);
        $tmp = settings_file() . '.tmp';
        file_put_contents($tmp, json_encode($s, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
        rename($tmp, settings_file());
        respond(['ok' => true]);
    }

    case 'upload': {
        require_post();
        require_admin();
        $f = $_FILES['file'] ?? null;
        if (!$f || ($f['error'] ?? 1) !== UPLOAD_ERR_OK) fail(400, 'upload-failed');
        $max = (int) (config()['max_upload_mb'] ?? 50) * 1024 * 1024;
        if ($f['size'] > $max) fail(413, 'too-large');
        $allowed = [
            'image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif',
            'video/mp4' => 'mp4', 'video/webm' => 'webm', 'video/quicktime' => 'mov',
        ];
        $mime = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
        if (!isset($allowed[$mime])) fail(415, 'unsupported-type');
        // Uploaded files can never run as scripts.
        ensure_dir(UPLOAD_DIR, "Options -Indexes -ExecCGI\nRemoveHandler .php .phtml .php5 .php7 .phar .cgi .pl\n<FilesMatch \"\\.(php|phtml|php\\d|phar|cgi|pl)$\">\n" . DENY_ALL . "</FilesMatch>\n");
        $base = strtolower(preg_replace('/[^a-z0-9]+/i', '-', pathinfo((string) $f['name'], PATHINFO_FILENAME)));
        $name = time() . '-' . (trim(substr($base, 0, 40), '-') ?: 'media') . '-' . bin2hex(random_bytes(3)) . '.' . $allowed[$mime];
        if (!move_uploaded_file($f['tmp_name'], UPLOAD_DIR . '/' . $name)) fail(500, 'save-failed');
        respond(['path' => 'uploads/' . $name], 201);
    }

    case 'health': {
        db();
        respond(['ok' => true, 'php' => PHP_VERSION, 'mail' => function_exists('mail')]);
    }

    default:
        fail(404, 'unknown-action');
}
