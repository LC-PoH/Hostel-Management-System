<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';
$role     = $input['role'] ?? '';

if (!$username || !$password || !$role) {
    echo json_encode(['success' => false, 'error' => 'Missing credentials']);
    exit;
}

try {
    $pdo  = getDB();
    $stmt = $pdo->prepare('SELECT id, username, password_hash, role, name FROM users WHERE username = ? AND role = ?');
    $stmt->execute([$username, $role]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        echo json_encode([
            'success' => true,
            'user'    => [
                'id'       => $user['id'],
                'role'     => $user['role'],
                'name'     => $user['name'],
                'username' => $user['username'],
            ],
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Server error']);
}
