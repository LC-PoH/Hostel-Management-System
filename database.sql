-- ============================================================
-- Hostel Management System – Complete Schema
-- AVM Secondary School
-- Select your target database in phpMyAdmin first, then run this file.
-- For shared hosting, do NOT use CREATE DATABASE/USE unless your account allows it.
-- After import, visit /api/setup.php to seed data.
-- ============================================================

-- CREATE DATABASE IF NOT EXISTS hostel_management;
-- USE hostel_management;

-- Drop old tables if they exist (order matters for FK constraints)
DROP TABLE IF EXISTS outpasses;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS visitors;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS notices;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS rooms;

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
    blood_group       VARCHAR(5),
    emergency_contact VARCHAR(20),
    course            VARCHAR(100),
    year_of_study     VARCHAR(30),
    father_name       VARCHAR(100),
    address           TEXT,
    created_at        DATETIME DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS bookings (
    id         VARCHAR(30) PRIMARY KEY,
    student_id VARCHAR(30) NOT NULL,
    room_id    VARCHAR(30) NOT NULL,
    check_in   DATE NOT NULL,
    check_out  DATE,
    amount     DECIMAL(10,2) NOT NULL,
    status     ENUM('pending','active','rejected','completed') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id           VARCHAR(30) PRIMARY KEY,
    booking_id   VARCHAR(30),
    student_id   VARCHAR(30) NOT NULL,
    student_name VARCHAR(100),
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

CREATE TABLE IF NOT EXISTS attendance (
    id         VARCHAR(30) PRIMARY KEY,
    student_id VARCHAR(30) NOT NULL,
    att_date   DATE NOT NULL,
    status     ENUM('present','absent','out','out-pass') DEFAULT 'absent',
    check_in   VARCHAR(10),
    check_out  VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS notices (
    id          VARCHAR(30) PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    body        TEXT NOT NULL,
    notice_date DATE NOT NULL,
    type        ENUM('info','warning','success','danger') DEFAULT 'info',
    author      VARCHAR(100),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

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
