<!DOCTYPE html>
<html><head><title>HMS Setup</title>
<style>body{font-family:Arial,sans-serif;max-width:700px;margin:40px auto;padding:0 20px}
h2{color:#4338ca}.ok{color:#10b981}.err{color:#ef4444}pre{background:#f1f5f9;padding:12px;border-radius:8px}</style>
</head><body>
<h2>Hostel Management System – Database Seeder</h2>
<?php
require_once __DIR__ . '/db.php';

$pdo = getDB();

$users = [
    ['u1',  'admin',      'admin123',  'admin',        'Rajesh Kumar',   'admin@hostelpro.com',     '9876543210', null,     null,  null,  null,         null,             null,         null,           null],
    ['u3',  'reception',  'rec123',    'receptionist', 'Priya Patel',    'priya@hostelpro.com',     '9876543213', null,     null,  null,  null,         null,             null,         null,           null],
    ['u2',  'student123', 'pass123',   'student',      'Arjun Sharma',   'arjun@student.com',       '9811001001', 'STU001', 'r1',  'O+',  '9811001002', 'B.Tech CSE',     '2nd Year',   'Ramesh Sharma','12 Rajouri Garden, Delhi'],
    ['u4',  'rahul456',   'rahul123',  'student',      'Rahul Verma',    'rahul@student.com',       '9811002001', 'STU002', 'r2',  'A+',  '9811002002', 'B.Tech ECE',     '3rd Year',   'Suresh Verma', '45 Andheri West, Mumbai'],
    ['u5',  'sneha789',   'sneha123',  'student',      'Sneha Singh',    'sneha@student.com',       '9811003001', 'STU003', 'r3',  'B+',  '9811003002', 'MCA',            '1st Year',   'Deepak Singh', '78 Whitefield, Bangalore'],
    ['u6',  'priya.k',    'priya123',  'student',      'Priya Kapoor',   'priya.k@student.com',     '9811004001', 'STU004', 'r2',  'AB+', '9811004002', 'B.Sc IT',        '2nd Year',   'Rakesh Kapoor','22 Salt Lake, Kolkata'],
    ['u7',  'ankit.y',    'ankit123',  'student',      'Ankit Yadav',    'ankit.y@student.com',     '9811005001', 'STU005', 'r3',  'O-',  '9811005002', 'B.Tech ME',      '4th Year',   'Ramkesh Yadav','33 Civil Lines, Allahabad'],
    ['u8',  'kavya.r',    'kavya123',  'student',      'Kavya Reddy',    'kavya.r@student.com',     '9811006001', 'STU006', 'r3',  'B-',  '9811006002', 'MBA',            '1st Year',   'Venkat Reddy', '56 Banjara Hills, Hyderabad'],
    ['u9',  'rohit.m',    'rohit123',  'student',      'Rohit Mehta',    'rohit.m@student.com',     '9811007001', 'STU007', 'r4',  'A-',  '9811007002', 'B.Tech Civil',   '3rd Year',   'Anil Mehta',   '67 Navrangpura, Ahmedabad'],
    ['u10', 'pooja.g',    'pooja123',  'student',      'Pooja Gupta',    'pooja.g@student.com',     '9811008001', 'STU008', 'r4',  'AB-', '9811008002', 'BCA',            '2nd Year',   'Sanjay Gupta', '89 Hazratganj, Lucknow'],
    ['u11', 'sanjay.j',   'sanjay123', 'student',      'Sanjay Joshi',   'sanjay.j@student.com',    '9811009001', 'STU009', 'r5',  'O+',  '9811009002', 'M.Tech CSE',     '1st Year',   'Mohan Joshi',  '101 Koregaon Park, Pune'],
    ['u12', 'meera.k',    'meera123',  'student',      'Meera Krishnan', 'meera.k@student.com',     '9811010001', 'STU010', 'r6',  'B+',  '9811010002', 'BBA',            '3rd Year',   'Krishnan Pillai','14 T Nagar, Chennai'],
    ['u13', 'aditya.p',   'aditya123', 'student',      'Aditya Patil',   'aditya.p@student.com',    '9811011001', 'STU011', 'r6',  'A+',  '9811011002', 'B.Tech CSE',     '2nd Year',   'Ramesh Patil', '55 FC Road, Pune'],
];

$rooms = [
    ['r1','A-101','Ground Floor','Single',1,1,'Shared',  5000,'occupied', json_encode(['AC','WiFi','Study Table','Wardrobe'])],
    ['r2','A-102','Ground Floor','Double',2,2,'Shared',  4000,'occupied', json_encode(['Fan','WiFi','Study Table'])],
    ['r3','B-201','2nd Floor',   'Triple',3,3,'Attached',3500,'occupied', json_encode(['AC','WiFi','Attached Bath','Balcony'])],
    ['r4','B-202','2nd Floor',   'Double',2,2,'Shared',  4000,'occupied', json_encode(['Fan','WiFi'])],
    ['r5','C-301','3rd Floor',   'Single',1,1,'Attached',6000,'occupied', json_encode(['AC','WiFi','Attached Bath','TV'])],
    ['r6','C-302','3rd Floor',   'Triple',3,2,'Attached',3500,'partial',  json_encode(['Fan','WiFi','Attached Bath'])],
    ['r7','D-401','4th Floor',   'Double',2,0,'Attached',4500,'available',json_encode(['AC','WiFi','Attached Bath','Study Table'])],
    ['r8','D-402','4th Floor',   'Single',1,0,'Attached',6500,'available',json_encode(['AC','WiFi','Attached Bath','TV','Mini Fridge'])],
];

$bookings = [
    ['b1', 'u2', 'r1','2024-07-01',null,         5000,'active'],
    ['b2', 'u4', 'r2','2024-08-01',null,         4000,'active'],
    ['b3', 'u5', 'r3','2024-09-01',null,         3500,'active'],
    ['b5', 'u6', 'r2','2024-08-01',null,         4000,'active'],
    ['b6', 'u7', 'r3','2024-07-15',null,         3500,'active'],
    ['b7', 'u8', 'r3','2024-10-01',null,         3500,'active'],
    ['b8', 'u9', 'r4','2024-09-01',null,         4000,'active'],
    ['b9', 'u10','r4','2024-11-01',null,         4000,'active'],
    ['b10','u11','r5','2025-01-01',null,         6000,'active'],
    ['b11','u12','r6','2024-08-01',null,         3500,'active'],
    ['b12','u13','r6','2024-09-01',null,         3500,'active'],
    ['b4', 'u2', 'r1','2023-07-01','2024-06-30', 4500,'completed'],
];

$payments = [
    ['p1', 'b1','u2', 5000,'UPI',         '2025-04-01','paid',   'Monthly Rent','TXN2504010001'],
    ['p2', 'b1','u2', 5000,'Net Banking', '2025-03-01','paid',   'Monthly Rent','TXN2503010002'],
    ['p3', 'b1','u2', 5000,'UPI',         '2025-02-01','paid',   'Monthly Rent','TXN2502010003'],
    ['p6', 'b1','u2', 5000,'',            '2025-05-01','pending','Monthly Rent',''],
    ['p4', 'b2','u4', 4000,'Debit Card',  '2025-04-01','paid',   'Monthly Rent','TXN2504010004'],
    ['p7', 'b2','u4', 4000,'UPI',         '2025-03-01','paid',   'Monthly Rent','TXN2503010007'],
    ['p17','b2','u4', 4000,'',            '2025-05-01','pending','Monthly Rent',''],
    ['p5', 'b3','u5', 3500,'UPI',         '2025-04-01','paid',   'Monthly Rent','TXN2504010005'],
    ['p8', 'b3','u5', 3500,'Net Banking', '2025-03-01','paid',   'Monthly Rent','TXN2503010008'],
    ['p9', 'b5','u6', 4000,'UPI',         '2025-04-01','paid',   'Monthly Rent','TXN2504010009'],
    ['p18','b5','u6', 4000,'',            '2025-05-01','pending','Monthly Rent',''],
    ['p10','b6','u7', 3500,'Credit Card', '2025-04-01','paid',   'Monthly Rent','TXN2504010010'],
    ['p11','b7','u8', 3500,'UPI',         '2025-04-01','paid',   'Monthly Rent','TXN2504010011'],
    ['p19','b7','u8', 3500,'',            '2025-05-01','pending','Monthly Rent',''],
    ['p12','b8','u9', 4000,'Net Banking', '2025-04-01','paid',   'Monthly Rent','TXN2504010012'],
    ['p13','b9','u10',4000,'UPI',         '2025-04-01','paid',   'Monthly Rent','TXN2504010013'],
    ['p20','b9','u10',4000,'',            '2025-05-01','pending','Monthly Rent',''],
    ['p14','b10','u11',6000,'Debit Card', '2025-04-01','paid',   'Monthly Rent','TXN2504010014'],
    ['p15','b11','u12',3500,'UPI',         '2025-04-01','paid',   'Monthly Rent','TXN2504010015'],
    ['p16','b12','u13',3500,'UPI',         '2025-04-01','paid',   'Monthly Rent','TXN2504010016'],
    ['p21','b12','u13',3500,'',            '2025-05-01','pending','Monthly Rent',''],
];

$requests = [
    ['req1','u2','Maintenance','Light bulb not working in room',                           '2025-04-08','pending', ''],
    ['req2','u4','Room Change', 'Requesting room change to 3rd floor',                     '2025-04-05','approved','Request approved. Room change will be processed next month.'],
    ['req3','u5','Complaint',   'Noise issue from neighboring room after 11 PM',           '2025-04-07','resolved','Issue has been addressed. Students counseled.'],
    ['req4','u2','Other',       'Need extra blanket and pillow',                           '2025-04-09','pending', ''],
];

$visitors = [
    ['v1','Meena Sharma','u2','9876543220','2025-04-10 10:30',null,                 'active',      'Family Visit'],
    ['v2','Ramesh Verma','u4','9876543221','2025-04-10 09:15','2025-04-10 11:00', 'checked-out', 'Family Visit'],
    ['v3','Anita Singh', 'u5','9876543222','2025-04-09 14:00','2025-04-09 16:30', 'checked-out', 'Friend'],
];

$notices = [
    ['n1','Monthly Fee Due – May 2025','Monthly hostel fee for May 2025 is due by 10th May. Please pay on time to avoid ₹500 late fee charges.',  '2025-04-01','warning','Admin'],
    ['n2','Water Supply Interruption', 'Water supply will be interrupted on April 12th from 10 AM to 2 PM for annual pipe maintenance.',           '2025-04-08','info',   'Admin'],
    ['n3','Annual Sports Day – April 20','Annual hostel sports day will be held on April 20th. Events: cricket, badminton, chess.',               '2025-04-05','success','Admin'],
    ['n4','Hostel Gate Closing Time Updated','Effective immediately, hostel gate will close at 10:00 PM on weekdays and 11:00 PM on weekends.',  '2025-04-03','danger', 'Admin'],
];

$errors = [];

function tryInsert(PDO $pdo, string $sql, array $params, string $label): void {
    global $errors;
    try {
        $pdo->prepare($sql)->execute($params);
        echo "<p class='ok'>✓ $label</p>";
    } catch (Exception $e) {
        $msg = $e->getMessage();
        // Skip duplicate key errors quietly
        if (strpos($msg, 'Duplicate entry') !== false) {
            echo "<p style='color:#888'>– $label (already exists, skipped)</p>";
        } else {
            $errors[] = "$label: $msg";
            echo "<p class='err'>✗ $label – $msg</p>";
        }
    }
}

echo "<h3>Inserting Users…</h3>";
$uSql = 'INSERT IGNORE INTO users (id,username,password_hash,role,name,email,phone,student_id,room_id,blood_group,emergency_contact,course,year_of_study,father_name,address) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
foreach ($users as $u) {
    $hash = password_hash($u[2], PASSWORD_DEFAULT);
    tryInsert($pdo, $uSql, [$u[0],$u[1],$hash,$u[3],$u[4],$u[5],$u[6],$u[7],$u[8],$u[9],$u[10],$u[11],$u[12],$u[13],$u[14]], "User: {$u[4]} ({$u[3]})");
}

echo "<h3>Inserting Rooms…</h3>";
$rSql = 'INSERT IGNORE INTO rooms (id,number,floor,type,beds,occupied,bathrooms,rent,status,amenities) VALUES (?,?,?,?,?,?,?,?,?,?)';
foreach ($rooms as $r) { tryInsert($pdo, $rSql, $r, "Room: {$r[1]}"); }

echo "<h3>Inserting Bookings…</h3>";
$bSql = 'INSERT IGNORE INTO bookings (id,student_id,room_id,check_in,check_out,amount,status) VALUES (?,?,?,?,?,?,?)';
foreach ($bookings as $b) { tryInsert($pdo, $bSql, $b, "Booking: {$b[0]}"); }

echo "<h3>Inserting Payments…</h3>";
$pSql = 'INSERT IGNORE INTO payments (id,booking_id,student_id,amount,method,pay_date,status,pay_type,txn_id) VALUES (?,?,?,?,?,?,?,?,?)';
foreach ($payments as $p) { tryInsert($pdo, $pSql, $p, "Payment: {$p[0]}"); }

// ADDED: After seeding, back-fill student_name and student_sid from the users table into
//        payments and bookings. The INSERT statements use internal IDs only, so this JOIN
//        ensures phpMyAdmin and any direct DB queries show readable names and STU-format IDs.
$pdo->exec("UPDATE payments p JOIN users u ON u.id = p.student_id SET p.student_name = u.name, p.student_sid = u.student_id WHERE p.student_name IS NULL OR p.student_sid IS NULL");
$pdo->exec("UPDATE bookings b JOIN users u ON u.id = b.student_id SET b.student_name = u.name, b.student_sid = u.student_id WHERE b.student_name IS NULL OR b.student_sid IS NULL");

echo "<h3>Inserting Requests…</h3>";
$reqSql = 'INSERT IGNORE INTO requests (id,student_id,req_type,description,req_date,status,response) VALUES (?,?,?,?,?,?,?)';
foreach ($requests as $req) { tryInsert($pdo, $reqSql, $req, "Request: {$req[0]}"); }

echo "<h3>Inserting Visitors…</h3>";
$vSql = 'INSERT IGNORE INTO visitors (id,name,student_id,phone,check_in,check_out,status,purpose) VALUES (?,?,?,?,?,?,?,?)';
foreach ($visitors as $v) { tryInsert($pdo, $vSql, $v, "Visitor: {$v[1]}"); }

echo "<h3>Inserting Notices…</h3>";
$nSql = 'INSERT IGNORE INTO notices (id,title,body,notice_date,type,author) VALUES (?,?,?,?,?,?)';
foreach ($notices as $n) { tryInsert($pdo, $nSql, $n, "Notice: {$n[1]}"); }

if (empty($errors)) {
    echo "<h3 class='ok'>✅ Setup complete! <a href='../login.html'>Go to Login →</a></h3>";
    echo "<p>Demo credentials: <code>admin / admin123</code> | <code>student123 / pass123</code> | <code>reception / rec123</code></p>";
} else {
    echo "<h3 class='err'>Setup finished with " . count($errors) . " error(s). See above.</h3>";
}
?>
</body></html>
