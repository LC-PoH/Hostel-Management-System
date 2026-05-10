-- ============================================================
-- Hostel Management System – Complete Schema
-- AVM Secondary School
-- ============================================================
-- HOW TO USE
--   Option A (phpMyAdmin): Select your target database first, then
--     import this file.  Do NOT uncomment CREATE DATABASE/USE below
--     if your host does not allow database creation.
--   Option B (migrate.php): Visit /api/migrate.php — it runs this
--     file automatically after creating a fresh database.
--
-- After the schema is in place, visit /api/setup.php to seed demo data.
--
-- TABLE OVERVIEW
--   users       — All accounts (students, receptionist, admin).
--                 Passwords stored as bcrypt hashes (never plaintext).
--   rooms       — Room inventory: number, floor, type, beds, rent, status.
--                 amenities stored as a JSON array.
--   bookings    — Room bookings linking a student to a room with dates.
--                 student_name / student_sid duplicated here for readability.
--   payments    — Monthly rent and ad-hoc payment records per booking.
--                 student_name / student_sid duplicated for readability.
--   requests    — Student maintenance requests and complaints.
--   visitors    — Visitor log with check-in / check-out timestamps.
--   attendance  — Daily student attendance records.
--   notices     — Admin announcements shown on the notice board.
--   outpasses   — Student leave / outpass requests with return tracking.
--
-- DROP ORDER matters: child tables referencing other tables are dropped first
-- to avoid foreign-key constraint errors (even though FKs are not enforced here).
-- ============================================================

-- CREATE DATABASE IF NOT EXISTS hostel_management;
-- USE hostel_management;

-- Drop old tables if they exist (order matters: child tables first)
DROP TABLE IF EXISTS outpasses;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS visitors;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS notices;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS rooms;

-- ── users ──────────────────────────────────────────────────────────────────
-- Stores all system accounts. role determines which dashboard the user sees.
-- password_hash: bcrypt output from PHP password_hash() — never plaintext.
-- student_id (e.g. STU001) and room_id are only populated for student accounts.
CREATE TABLE IF NOT EXISTS users (
    id                VARCHAR(30)  PRIMARY KEY,
    username          VARCHAR(50)  NOT NULL UNIQUE,
    password_hash     VARCHAR(255) NOT NULL,
    role              ENUM('student','receptionist','admin') NOT NULL,
    name              VARCHAR(100) NOT NULL,
    email             VARCHAR(100) NOT NULL,
    phone             VARCHAR(20),
    student_id        VARCHAR(20),
    room_id           VARCHAR(30),
    status            ENUM('active','inactive') DEFAULT 'active',
    blood_group       VARCHAR(5),
    emergency_contact VARCHAR(20),
    course            VARCHAR(100),
    year_of_study     VARCHAR(30),
    father_name       VARCHAR(100),
    address           TEXT,
    created_at        DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── rooms ──────────────────────────────────────────────────────────────────
-- Room inventory. occupied tracks how many beds are currently in use.
-- amenities is stored as a JSON array (e.g. ["AC","WiFi"]).
-- status: available | occupied | partial | maintenance
CREATE TABLE IF NOT EXISTS rooms (
    id         VARCHAR(30) PRIMARY KEY,
    number     VARCHAR(10) NOT NULL UNIQUE,
    floor      VARCHAR(50) NOT NULL,
    type       ENUM('Single','Double','Triple') NOT NULL,
    beds       INT NOT NULL,
    occupied   INT DEFAULT 0,
    bathrooms  VARCHAR(20),
    rent       DECIMAL(10,2) NOT NULL,
    status     ENUM('available','occupied','partial','maintenance') DEFAULT 'available',
    amenities  TEXT
);

-- ── bookings ────────────────────────────────────────────────────────────────
-- Links a student to a room for a date range.
-- student_name and student_sid are denormalised copies for easy reading in
-- phpMyAdmin and reports without needing a JOIN every time.
-- status: pending | active | rejected | completed
CREATE TABLE IF NOT EXISTS bookings (
    id           VARCHAR(30) PRIMARY KEY,
    student_id   VARCHAR(30) NOT NULL,
    student_name VARCHAR(100),
    student_sid  VARCHAR(20),
    room_id      VARCHAR(30) NOT NULL,
    check_in     DATE NOT NULL,
    check_out    DATE,
    amount       DECIMAL(10,2) NOT NULL,
    status       ENUM('pending','active','rejected','completed') DEFAULT 'pending',
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── payments ────────────────────────────────────────────────────────────────
-- Payment records per booking. Each month generates a pending row; when the
-- student pays it is updated to paid with method, txn_id, and pay_date.
-- student_name / student_sid are denormalised for readable reports.
-- status: paid | pending | overdue
CREATE TABLE IF NOT EXISTS payments (
    id           VARCHAR(30) PRIMARY KEY,
    booking_id   VARCHAR(30),
    student_id   VARCHAR(30) NOT NULL,
    student_name VARCHAR(100),
    student_sid  VARCHAR(20),
    amount       DECIMAL(10,2) NOT NULL,
    method       VARCHAR(50),
    pay_date     DATE NOT NULL,
    status       ENUM('paid','pending','overdue') DEFAULT 'pending',
    pay_type     VARCHAR(50),
    txn_id       VARCHAR(60),
    reference_no VARCHAR(100),
    collected_by VARCHAR(100),
    collected_at DATETIME
);

-- ── requests ────────────────────────────────────────────────────────────────
-- Student maintenance requests and complaints submitted from the student dashboard.
-- Admin reviews and updates status / response; resolved_at and resolved_by are
-- set when the admin marks a request resolved.
-- status: pending | approved | rejected | resolved
CREATE TABLE IF NOT EXISTS requests (
    id          VARCHAR(30) PRIMARY KEY,
    student_id  VARCHAR(30) NOT NULL,
    req_type    VARCHAR(50),
    description TEXT,
    req_date    DATE NOT NULL,
    status      ENUM('pending','approved','rejected','resolved') DEFAULT 'pending',
    response    TEXT,
    resolved_at DATETIME,
    resolved_by VARCHAR(100)
);

-- ── visitors ────────────────────────────────────────────────────────────────
-- Visitor log managed by the receptionist. check_in / check_out store
-- datetime strings (VARCHAR) for flexibility with partial times.
-- status: active (still inside) | checked-out
CREATE TABLE IF NOT EXISTS visitors (
    id         VARCHAR(30) PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    student_id VARCHAR(30) NOT NULL,
    phone      VARCHAR(20),
    relation   VARCHAR(50),
    id_proof   VARCHAR(100),
    check_in   VARCHAR(60),
    check_out  VARCHAR(60),
    status     ENUM('active','checked-out') DEFAULT 'active',
    purpose    VARCHAR(100)
);

-- ── attendance ──────────────────────────────────────────────────────────────
-- Daily attendance records per student, recorded by the receptionist.
-- check_in / check_out store time strings (e.g. "21:30").
-- status: present | absent | out | out-pass
CREATE TABLE IF NOT EXISTS attendance (
    id         VARCHAR(30) PRIMARY KEY,
    student_id VARCHAR(30) NOT NULL,
    att_date   DATE NOT NULL,
    status     ENUM('present','absent','out','out-pass') DEFAULT 'absent',
    check_in   VARCHAR(10),
    check_out  VARCHAR(10)
);

-- ── notices ─────────────────────────────────────────────────────────────────
-- Admin announcements shown on the notice board in all dashboards.
-- type controls the colour badge: info | warning | success | danger
CREATE TABLE IF NOT EXISTS notices (
    id          VARCHAR(30) PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    body        TEXT NOT NULL,
    notice_date DATE NOT NULL,
    type        ENUM('info','warning','success','danger') DEFAULT 'info',
    author      VARCHAR(100),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── outpasses ───────────────────────────────────────────────────────────────
-- Student outpass / leave requests. Issued by the receptionist; returned_at
-- is set when the student checks back in.
-- status: active | returned | overdue
CREATE TABLE IF NOT EXISTS outpasses (
    id               VARCHAR(30)  PRIMARY KEY,
    student_id       VARCHAR(30)  NOT NULL,
    student_name     VARCHAR(100),
    student_sid      VARCHAR(20),
    room_id          VARCHAR(30),
    reason           VARCHAR(200),
    destination      VARCHAR(200),
    return_date_time DATETIME,
    remarks          TEXT,
    issued_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
    issued_by        VARCHAR(100),
    status           ENUM('active','returned','overdue') DEFAULT 'active',
    returned_at      DATETIME
);
