# 🏨 Hostel Management System

A web-based hostel management platform built for **AVM Secondary School**. The system provides role-based dashboards for students, receptionists, and administrators to manage rooms, bookings, payments, visitors, attendance, and more.

Built with vanilla HTML5, CSS3, and JavaScript on the front-end, with a PHP/MySQL backend — no frameworks, no CMS.

---

## ✨ Features

**Three Role-Based Dashboards**

- **Student** — View bookings, make payments, submit requests & complaints, read notices, update profile, change password
- **Receptionist** — Process check-in/check-out, manage visitors, record attendance, view room status, search students
- **Owner / Admin** — Analytics & charts, room management, student CRUD, payment tracking, approve/reject requests, post notices

**Technical Highlights**

- Dual-mode data architecture — works offline with localStorage, syncs to MySQL when the server is available
- Dark/light theme toggle with CSS custom properties (persisted in localStorage)
- Single-page navigation within each dashboard (no page reloads)
- Reusable modal system and floating notification toasts
- CSV export for data tables (bookings, payments, students, attendance)
- Chart.js integration for revenue, occupancy, and payment analytics
- Secure authentication with bcrypt password hashing (server-side)
- PDO prepared statements on all database queries (no SQL injection)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Front-End | HTML5, CSS3, Vanilla JavaScript |
| Back-End | PHP 8 with PDO |
| Database | MySQL |
| Charts | Chart.js |
| Version Control | Git / GitHub |

---

## 📁 Project Structure

```
Hostel-Management-System/
├── login.html                    # Login page with role selector
├── student-dashboard.html        # Student portal (6 pages)
├── receptionist-dashboard.html   # Receptionist portal (6 pages)
├── owner-dashboard.html          # Admin portal (7 pages)
├── index.html                    # Redirect to login
├── styles.css                    # Global stylesheet (750+ lines)
├── script.js                     # Core logic (1280+ lines)
├── logo.png                      # AVM school logo
├── database.sql                  # MySQL schema (8 tables)
└── api/
    ├── db.php                    # Database connection (PDO)
    ├── login.php                 # Authentication endpoint
    ├── sync.php                  # Fetch all data from DB
    ├── data.php                  # Generic CRUD endpoint
    ├── change-password.php       # Password change endpoint
    ├── setup.php                 # Data seeder (60+ records)
    └── migrate.php               # DB recreation script
```

---

## 🗄️ Database Schema

The system uses **8 MySQL tables**:

| Table | Purpose |
|-------|---------|
| `users` | All users (students, receptionist, admin) with bcrypt-hashed passwords |
| `rooms` | Room details, capacity, rent, status, amenities (stored as JSON) |
| `bookings` | Student room bookings with check-in/out dates and status |
| `payments` | Payment records linked to bookings with transaction IDs |
| `requests` | Student maintenance requests and complaints |
| `visitors` | Visitor log with check-in/out timestamps |
| `attendance` | Daily student attendance records |
| `notices` | Admin announcements and notice board posts |

---

## 🚀 Getting Started

### Prerequisites

- [XAMPP](https://www.apachefriends.org/) (or any Apache + PHP + MySQL stack)
- A modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Hostel-Management-System.git
   ```

2. **Move to your web server directory**
   ```bash
   # For XAMPP on Windows:
   cp -r Hostel-Management-System/ C:/xampp/htdocs/hms/

   # For XAMPP on macOS:
   cp -r Hostel-Management-System/ /Applications/XAMPP/htdocs/hms/
   ```

3. **Start Apache and MySQL** in the XAMPP Control Panel.

4. **Create the database and tables**

   Open your browser and navigate to:
   ```
   http://localhost/hms/api/migrate.php
   ```
   This will create the `hostel_management` database and all 8 tables.

5. **Seed the sample data**

   Navigate to:
   ```
   http://localhost/hms/api/setup.php
   ```
   This inserts 13 users, 8 rooms, 12 bookings, 21 payments, and sample data for all other tables.

6. **Open the application**
   ```
   http://localhost/hms/login.html
   ```

### Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin / Owner | `admin` | `admin123` |
| Student | `student123` | `pass123` |
| Receptionist | `reception` | `rec123` |

> **Tip:** Click the demo credential cards on the login page to auto-fill.

---

## 🔄 How the Sync System Works

The application uses a **dual-mode data architecture**:

1. **On login**, the front-end calls `api/sync.php` to pull all data from MySQL into localStorage.
2. **On every add/update/delete**, the front-end updates localStorage immediately, then sends a POST to `api/data.php` to persist the change to MySQL.
3. **If the server is unreachable** (no XAMPP running), the front-end falls back to default data hardcoded in `script.js` — the application remains fully functional offline.

This means you can demo the front-end by simply opening `login.html` in a browser without any server setup. The MySQL backend adds real persistence and secure authentication.

---

## 📸 Screenshots

### Login Page
- Split-screen layout with AVM branding
- Animated role selector (Student / Receptionist / Owner)
- Password visibility toggle and dark/light theme toggle

### Student Dashboard
- Booking overview, payment history, request submission
- Notice board, profile management, password change

### Receptionist Dashboard
- Check-in/out processing, visitor management
- Attendance log, room status grid, student search

### Owner Dashboard
- Analytics charts (revenue, occupancy, payment status)
- Room and student CRUD, payment tracking
- Request approval/rejection, notice board management

---

## 👥 Team

| Member | Role | Key Contributions |
|--------|------|-------------------|
| Arbin Maharjan | Group Leader / Full-Stack | Login page, script.js, all PHP APIs, project coordination |
| Prena Khadka | Front-End Developer | Student dashboard, styles.css, change password integration |
| Swayam Shrestha | Front-End Developer | Receptionist dashboard, Chart.js analytics |
| Saurav Niraula | UI/UX & DB Designer | Owner dashboard, database schema, data seeder |

---

## 📝 License

This project was built as part of **ICT308 Capstone Project 2** at CIHE Australia, Semester 1, 2026.

---

## 🙏 Acknowledgements

- **Lecturer:** Dr Arman Sharififar
- **Institution:** Crown Institute of Higher Education (CIHE), Australia
- [Chart.js](https://www.chartjs.org/) for analytics visualisations
