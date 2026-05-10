<?php
/**
 * sync.php — Full Data Sync Endpoint
 *
 * Called by the front-end once after a successful login to pull all data
 * from MySQL into the browser's localStorage.  This powers the "dual-mode"
 * architecture: the app works offline from localStorage and syncs to MySQL
 * whenever the server is reachable.
 *
 * Returns a JSON object:
 *   { success: true, data: { users, rooms, bookings, payments, requests,
 *                            visitors, attendance, notices, outpasses } }
 *
 * Column aliases:  SQL snake_case → JS camelCase (e.g. student_id → studentId)
 * so the front-end can use the same key names as its localStorage objects.
 *
 * The outpasses query is wrapped in a try/catch so the endpoint still succeeds
 * if that table has not been created yet (e.g. on a fresh install before migrate.php).
 *
 * Note: password_hash is intentionally excluded from the users SELECT.
 */
header('Content-Type: application/json');
require_once __DIR__ . '/db.php';

try {
    $pdo = getDB();

    // ADDED: Include users.status (active/inactive) so the frontend can show and toggle student account status
    $users = $pdo->query(
        'SELECT id, username, role, name, email, phone,
                student_id AS studentId, room_id AS roomId, status,
                blood_group AS bloodGroup, emergency_contact AS emergencyContact,
                course, year_of_study AS year, father_name AS fatherName, address
         FROM users'
    )->fetchAll();

    $rooms = $pdo->query(
        'SELECT id, number, floor, type, beds, occupied, bathrooms, rent, status, amenities FROM rooms'
    )->fetchAll();
    foreach ($rooms as &$r) {
        $r['amenities'] = json_decode($r['amenities'] ?? '[]', true) ?: [];
        $r['rent']      = (float)$r['rent'];
        $r['beds']      = (int)$r['beds'];
        $r['occupied']  = (int)$r['occupied'];
    }
    unset($r);

    // ADDED: Include student_name and student_sid in bookings so phpMyAdmin and the frontend
    //        show readable names/STU-codes instead of raw internal IDs (u2, u4, etc.)
    $bookings = $pdo->query(
        'SELECT id, student_id AS studentId, student_name AS studentName,
                student_sid AS studentSid, room_id AS roomId,
                check_in AS checkIn, check_out AS checkOut, amount, status
         FROM bookings'
    )->fetchAll();
    foreach ($bookings as &$b) { $b['amount'] = (float)$b['amount']; }
    unset($b);

    // ADDED: Include student_sid in payments so the JS fallback p.studentSid shows STU001
    //        instead of the internal user ID when a direct user lookup fails
    $payments = $pdo->query(
        'SELECT id, booking_id AS bookingId, student_id AS studentId,
                student_name AS studentName, student_sid AS studentSid,
                amount, method, pay_date AS date, status, pay_type AS type, txn_id AS txnId,
                reference_no AS reference, collected_by AS collectedBy, collected_at AS collectedAt
         FROM payments'
    )->fetchAll();
    foreach ($payments as &$p) { $p['amount'] = (float)$p['amount']; }
    unset($p);

    $requests = $pdo->query(
        'SELECT id, student_id AS studentId, req_type AS type,
                description, req_date AS date, status, response,
                resolved_at AS resolvedAt, resolved_by AS resolvedBy
         FROM requests'
    )->fetchAll();

    $visitors = $pdo->query(
        'SELECT id, name, student_id AS studentId, phone,
                relation, id_proof AS idProof,
                check_in AS checkIn, check_out AS checkOut, status, purpose
         FROM visitors'
    )->fetchAll();

    $attendance = $pdo->query(
        'SELECT id, student_id AS studentId, att_date AS date,
                status, check_in AS checkIn, check_out AS checkOut
         FROM attendance'
    )->fetchAll();

    $notices = $pdo->query(
        'SELECT id, title, body, notice_date AS date, type, author FROM notices'
    )->fetchAll();

    // Outpasses
    $outpasses = [];
    try {
        $outpasses = $pdo->query(
            'SELECT id, student_id AS studentId, student_name AS studentName,
                    student_sid AS studentSid, room_id AS roomId,
                    reason, destination, return_date_time AS returnDateTime,
                    remarks, issued_at AS issuedAt, issued_by AS issuedBy,
                    status, returned_at AS returnedAt
             FROM outpasses'
        )->fetchAll();
    } catch (Exception $e) { /* Table may not exist yet – safe to skip */ }

    echo json_encode([
        'success' => true,
        'data'    => compact('users','rooms','bookings','payments','requests','visitors','attendance','notices','outpasses'),
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
