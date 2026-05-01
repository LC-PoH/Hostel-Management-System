<?php
// Run this once to apply the new schema. Delete after use.
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');

header('Content-Type: text/html');

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";charset=utf8mb4", DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

    // Drop and recreate the database for a clean slate
    $pdo->exec('DROP DATABASE IF EXISTS hostel_management');
    $pdo->exec('CREATE DATABASE hostel_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    $pdo->exec('USE hostel_management');
    echo "<p style='color:green'>✓ Database recreated cleanly</p>";

    $sql = file_get_contents(__DIR__ . '/../database.sql');
    $statements = array_filter(array_map('trim', explode(';', $sql)));
    $ok = 1; $err = 0;

    foreach ($statements as $stmt) {
        if (empty($stmt) || str_starts_with($stmt, '--')) continue;
        // Skip DB-level statements we already handled
        if (preg_match('/^(CREATE DATABASE|USE |DROP TABLE)/i', $stmt)) continue;
        try {
            $pdo->exec($stmt);
            echo "<p style='color:green'>✓ " . htmlspecialchars(substr($stmt, 0, 80)) . "…</p>";
            $ok++;
        } catch (PDOException $e) {
            echo "<p style='color:red'>✗ " . htmlspecialchars($e->getMessage()) . "</p>";
            $err++;
        }
    }

    echo "<h3 style='color:" . ($err ? 'red' : 'green') . "'>Done: $ok OK, $err errors.</h3>";
    if (!$err) echo "<p><a href='setup.php'>→ Now run setup.php to seed data</a></p>";
} catch (Exception $e) {
    echo "<p style='color:red'>Connection error: " . htmlspecialchars($e->getMessage()) . "</p>";
}
