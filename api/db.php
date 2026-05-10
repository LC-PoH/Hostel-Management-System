<?php
/**
 * db.php — Database Connection
 *
 * Provides a single shared PDO instance for all API endpoints via getDB().
 * Uses a static variable so only one connection is opened per request.
 *
 * Configuration:
 *   DB_HOST — MySQL hostname (default: localhost for XAMPP)
 *   DB_NAME — Target database (hostel_management)
 *   DB_USER — MySQL username (default: root for XAMPP)
 *   DB_PASS — MySQL password (empty by default for XAMPP)
 *
 * PDO options set:
 *   ERRMODE_EXCEPTION        — all DB errors throw PDOException (caught by callers)
 *   FETCH_ASSOC              — rows returned as associative arrays
 *   EMULATE_PREPARES = false — forces real prepared statements (prevents SQL injection)
 */
define('DB_HOST', 'localhost');
define('DB_NAME', 'hostel_management');
define('DB_USER', 'root');
define('DB_PASS', '');

function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO(
                'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
                DB_USER, DB_PASS,
                [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ]
            );
        } catch (PDOException $e) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'error' => 'DB connection failed: ' . $e->getMessage()]);
            exit;
        }
    }
    return $pdo;
}
