<?php
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

$input  = json_decode(file_get_contents('php://input'), true) ?? [];
$jsKey  = $input['table']  ?? '';
$action = $input['action'] ?? '';
$data   = $input['data']   ?? [];

// Map JS camelCase keys → SQL table/column names
$tableMap = [
    'users' => [
        'table'   => 'users',
        'columns' => [
            'username' => 'username', 'role' => 'role', 'name' => 'name',
            'email' => 'email', 'phone' => 'phone',
            'studentId' => 'student_id', 'roomId' => 'room_id',
            'bloodGroup' => 'blood_group', 'emergencyContact' => 'emergency_contact',
            'course' => 'course', 'year' => 'year_of_study',
            'fatherName' => 'father_name', 'address' => 'address',
        ],
    ],
    'rooms' => [
        'table'   => 'rooms',
        'columns' => [
            'number' => 'number', 'floor' => 'floor', 'type' => 'type',
            'beds' => 'beds', 'occupied' => 'occupied', 'bathrooms' => 'bathrooms',
            'rent' => 'rent', 'status' => 'status',
        ],
    ],
    'bookings' => [
        'table'   => 'bookings',
        'columns' => [
            'studentId' => 'student_id', 'roomId' => 'room_id',
            'checkIn' => 'check_in', 'checkOut' => 'check_out',
            'amount' => 'amount', 'status' => 'status',
        ],
    ],
    'payments' => [
        'table'   => 'payments',
        'columns' => [
            'bookingId' => 'booking_id', 'studentId' => 'student_id',
            'studentName' => 'student_name',
            'amount' => 'amount', 'method' => 'method', 'date' => 'pay_date',
            'status' => 'status', 'type' => 'pay_type', 'txnId' => 'txn_id',
            'reference' => 'reference_no', 'collectedBy' => 'collected_by', 'collectedAt' => 'collected_at',
        ],
    ],
    'requests' => [
        'table'   => 'requests',
        'columns' => [
            'studentId' => 'student_id', 'type' => 'req_type',
            'description' => 'description', 'date' => 'req_date',
            'status' => 'status', 'response' => 'response',
            'resolvedAt' => 'resolved_at', 'resolvedBy' => 'resolved_by',
        ],
    ],
    'visitors' => [
        'table'   => 'visitors',
        'columns' => [
            'name' => 'name', 'studentId' => 'student_id', 'phone' => 'phone',
            'relation' => 'relation', 'idProof' => 'id_proof',
            'checkIn' => 'check_in', 'checkOut' => 'check_out',
            'status' => 'status', 'purpose' => 'purpose',
        ],
    ],
    'attendance' => [
        'table'   => 'attendance',
        'columns' => [
            'studentId' => 'student_id', 'date' => 'att_date',
            'status' => 'status', 'checkIn' => 'check_in', 'checkOut' => 'check_out',
        ],
    ],
    'notices' => [
        'table'   => 'notices',
        'columns' => [
            'title' => 'title', 'body' => 'body', 'date' => 'notice_date',
            'type' => 'type', 'author' => 'author',
        ],
    ],
    'outpasses' => [
        'table'   => 'outpasses',
        'columns' => [
            'studentId' => 'student_id', 'studentName' => 'student_name',
            'studentSid' => 'student_sid', 'roomId' => 'room_id',
            'reason' => 'reason', 'destination' => 'destination',
            'returnDateTime' => 'return_date_time', 'remarks' => 'remarks',
            'issuedAt' => 'issued_at', 'issuedBy' => 'issued_by',
            'status' => 'status', 'returnedAt' => 'returned_at',
        ],
    ],
];

if (!isset($tableMap[$jsKey]) || !in_array($action, ['add','update','remove'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
    exit;
}

$cfg       = $tableMap[$jsKey];
$tableName = $cfg['table'];
$colMap    = $cfg['columns'];

try {
    $pdo = getDB();

    if ($action === 'remove') {
        $pdo->prepare("DELETE FROM $tableName WHERE id = ?")->execute([$data['id']]);
        echo json_encode(['success' => true]);
        exit;
    }

    // Build db row from JS data
    $row = ['id' => $data['id']];
    foreach ($colMap as $jsCol => $dbCol) {
        if (array_key_exists($jsCol, $data)) {
            $row[$dbCol] = $data[$jsCol] === '' ? null : $data[$jsCol];
        }
    }

    // Handle amenities array → JSON
    if ($jsKey === 'rooms' && isset($data['amenities'])) {
        $row['amenities'] = json_encode($data['amenities']);
    }

    // Hash password when adding/updating users
    if ($jsKey === 'users' && isset($data['password']) && $data['password'] !== '') {
        $row['password_hash'] = password_hash($data['password'], PASSWORD_DEFAULT);
    }

    if ($action === 'add') {
        $cols  = array_keys($row);
        $ph    = implode(',', array_map(fn($c) => ":$c", $cols));
        $colsQ = implode(',', $cols);
        $pdo->prepare("INSERT IGNORE INTO $tableName ($colsQ) VALUES ($ph)")->execute($row);
    } else {
        // update – only set non-id columns
        $id = $row['id'];
        unset($row['id']);
        if (empty($row)) { echo json_encode(['success' => true]); exit; }
        $sets = implode(',', array_map(fn($c) => "$c=:$c", array_keys($row)));
        $row['id'] = $id;
        $pdo->prepare("UPDATE $tableName SET $sets WHERE id=:id")->execute($row);
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
