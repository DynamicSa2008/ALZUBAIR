<?php
// Copy this file to config.php (same folder) on the server and fill in your values.
// config.php is never part of the site build, so deploying a new version won't overwrite it.

return [
    // cPanel → MySQL Databases: create a database + user, give the user ALL PRIVILEGES on it.
    'db' => [
        'dsn'  => 'mysql:host=localhost;dbname=CPANELUSER_alzubair;charset=utf8mb4',
        'user' => 'CPANELUSER_alzubair',
        'pass' => 'CHANGE-ME',
    ],

    // Dashboard password (letters and numbers, 8+ characters recommended).
    'admin_password' => 'CHANGE-ME',

    // Sender address for notification emails. Create it in cPanel → Email Accounts
    // (or use any address on this domain) so mail is not flagged as spam.
    'mail_from' => 'no-reply@trademarks-sa.com',

    // Only needed if the site is opened from another origin (e.g. local development).
    'allowed_origins' => ['https://trademarks-sa.com', 'https://www.trademarks-sa.com'],

    // Largest file the dashboard may upload (also bounded by PHP's upload_max_filesize / post_max_size).
    'max_upload_mb' => 50,
];
