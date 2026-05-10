# Hostel Management System

A web-based hostel management platform built for **Aastha Vidhya Mandir (AVM) Secondary School**. The system provides role-based dashboards for students, receptionists, and administrators to manage rooms, bookings, payments, visitors, attendance, and more.

Built with vanilla HTML5, CSS3, and JavaScript on the front-end, with a PHP 8 / MySQL back-end — no frameworks, no CMS.

---

## Features

### Three Role-Based Dashboards

| Role | Capabilities |
|------|-------------|
| **Student** | View bookings, make payments, submit maintenance requests & complaints, read notices, manage profile, change password |
| **Receptionist** | Process check-in / check-out, manage visitors, record attendance, view room status grid, search students |
| **Owner / Admin** | Analytics & charts, room CRUD, student CRUD, payment tracking, approve/reject requests, post notices |

### Technical Highlights

- **Dual-mode data architecture** — works fully offline with `localStorage`; syncs to MySQL when the server is available
- **Dark / light theme toggle** with CSS custom properties, persisted in `localStorage`
- **Single-page navigation** within each dashboard (no full page reloads)
- **Reusable modal system** and floating notification toasts
- **CSV export** for bookings, payments, students, and attendance tables
- **Chart.js** integration for revenue, occupancy, and payment-status analytics
- **bcrypt** password hashing on all user accounts (server-side, via `password_hash` / `password_verify`)
- **PDO prepared statements** on every database query — no raw SQL concatenation

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Front-End | HTML5, CSS3, Vanilla JavaScript |
| Back-End | PHP 8 with PDO |
| Database | MySQL |
| Charts | Chart.js |
| Version Control | Git / GitHub |

---

## Project Structure

```
Hostel_Management_System/
├── index.html                    # Auto-redirects to login.html
├── login.html                    # Login page with animated role selector
├── student-dashboard.html        # Student portal
├── receptionist-dashboard.html   # Receptionist portal
├── owner-dashboard.html          # Admin / Owner portal
├── styles.css                    # Global stylesheet
├── script.js                     # Core application logic
├── database.sql                  # MySQL schema (9 tables)
├── security-audit.md             # Security review findings
└── api/
    ├── db.php                    # PDO database connection
    ├── login.php                 # Authentication endpoint (bcrypt)
    ├── sync.php                  # Bulk data fetch from DB → localStorage
    ├── data.php                  # Generic CRUD endpoint (add / edit / delete)
    ├── change-password.php       # Password change endpoint
    ├── setup.php                 # Data seeder (13 users, 8 rooms, 12 bookings, 21+ payments)
    └── migrate.php               # DB schema recreation script
```

---

## Database Schema

The system uses **9 MySQL tables**:

| Table | Purpose |
|-------|---------|
| `users` | All users (student, receptionist, admin) — bcrypt-hashed passwords |
| `rooms` | Room number, floor, type, beds, rent, status, amenities (JSON) |
| `bookings` | Student room bookings with check-in / check-out dates and status |
| `payments` | Payment records linked to bookings, with method and transaction ID |
| `requests` | Student maintenance requests and complaints |
| `visitors` | Visitor log with check-in / check-out timestamps |
| `attendance` | Daily student attendance records |
| `notices` | Admin announcements and notice board posts |
| `outpasses` | Student outpass / leave requests |

---

## Getting Started

### Prerequisites

- [XAMPP](https://www.apachefriends.org/) (Apache + PHP 8 + MySQL) or any equivalent stack
- A modern web browser (Chrome, Firefox, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Hostel_Management_System.git
   ```

2. **Place it in your web server root**

   ```
   # XAMPP on Windows
   C:\xampp\htdocs\Hostel_Management_System\

   # XAMPP on macOS / Linux
   /Applications/XAMPP/htdocs/Hostel_Management_System/
   ```

3. **Start Apache and MySQL** in the XAMPP Control Panel.

4. **Create the database schema**

   Open a browser and visit:
   ```
   http://localhost/Hostel_Management_System/api/migrate.php
   ```
   This creates the `hostel_management` database and all 9 tables.

5. **Seed sample data**

   ```
   http://localhost/Hostel_Management_System/api/setup.php
   ```
   Inserts 13 users, 8 rooms, 12 bookings, 21 payments, and sample records across all other tables.

6. **Open the application**
   ```
   http://localhost/Hostel_Management_System/login.html
   ```

### Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin / Owner | `admin` | `admin123` |
| Student | `student123` | `pass123` |
| Receptionist | `reception` | `rec123` |

> **Tip:** The login page includes quick-fill cards for each demo account.

---

## How the Sync System Works

The application uses a **dual-mode data architecture**:

1. **On login** — the front-end calls `api/sync.php` to pull all data from MySQL into `localStorage`.
2. **On every write** — `localStorage` is updated immediately, then a POST is sent to `api/data.php` to persist the change to MySQL.
3. **If the server is unreachable** — the front-end falls back to hardcoded default data in `script.js`. The application remains fully usable offline.

This means you can open `login.html` directly in a browser (without XAMPP) to demo the front-end. The MySQL back-end adds real persistence and secure authentication.

---

## Dashboard Overview

### Login Page
- Split-screen layout with AVM branding and school logo
- Animated role selector (Student / Receptionist / Owner)
- Password visibility toggle and dark / light theme toggle

### Student Dashboard
- Booking overview and payment history
- Maintenance request and complaint submission
- Notice board, outpass requests, profile management, password change

### Receptionist Dashboard
- Check-in / check-out processing
- Visitor management and attendance log
- Room status grid and student search

### Owner / Admin Dashboard
- Analytics charts — revenue trends, occupancy rate, payment status breakdown
- Room and student CRUD with inline editing
- Payment tracking, request approval / rejection, notice board management

---

## Team

| Member | Role | Key Contributions |
|--------|------|-------------------|
| Arbin Maharjan | Group Leader / Full-Stack | Login system, `script.js`, all PHP APIs, project coordination |
| Prena Khadka | Front-End Developer | Student dashboard, `styles.css`, change-password integration |
| Swayam Shrestha | Front-End Developer | Receptionist dashboard, Chart.js analytics |
| Saurav Niraula | UI/UX & Database Designer | Owner dashboard, database schema, data seeder |

---

## License

This project was developed as part of **ICT308 Capstone Project 2** at Crown Institute of Higher Education (CIHE), Australia — Semester 1, 2026.

---

## Acknowledgements

- **Lecturer:** Dr Arman Sharififar
- **Institution:** Crown Institute of Higher Education (CIHE), Australia
- [Chart.js](https://www.chartjs.org/) — analytics visualisations
- [XAMPP](https://www.apachefriends.org/) — local development stack
