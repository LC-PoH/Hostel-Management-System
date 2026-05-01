<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

$input       = json_decode(file_get_contents('php://input'), true) ?? [];
$userId      = $input['userId']      ?? '';
$oldPassword = $input['oldPassword'] ?? '';
$newPassword = $input['newPassword'] ?? '';

if (!$userId || !$oldPassword || !$newPassword) {
    echo json_encode(['success' => false, 'error' => 'Missing fields']);
    exit;
}

try {
    $pdo  = getDB();
    $stmt = $pdo->prepare('SELECT password_hash FROM users WHERE id = ?');
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($oldPassword, $user['password_hash'])) {
        echo json_encode(['success' => false, 'error' => 'Current password is incorrect']);
        exit;
    }

    $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
    $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?')->execute([$newHash, $userId]);
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Server error']);
}
