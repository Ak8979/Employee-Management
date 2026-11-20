# Enterprise Employee Management System (EMS)

A full-stack, scalable **Employee Management System** built with **Spring Boot 3 (Java), MySQL, React 19, Tailwind CSS, Lucide Icons, and Axios**.

---

## 📁 Project Architecture & Structure

The repository is cleanly partitioned into two independent tiers:

```text
Employee-Management/
├── Backend/                    # Spring Boot 3 + Java 17/21 + MySQL + Spring Security + JWT
│   ├── database/
│   │   ├── schema.sql          # Scalable MySQL schema with foreign keys and indexes
│   │   └── seed.sql            # Initial seed script
│   ├── src/main/java/com/ems/
│   │   ├── config/             # SecurityConfig, JwtAuthFilter, CorsConfig, GlobalExceptionHandler
│   │   ├── controller/         # Auth, Employee, Attendance, Leave, Task, Warning, Broadcast, Profile
│   │   ├── dto/                # Request & Response DTOs
│   │   ├── entity/             # JPA Entities (User, Employee, Attendance, Leave, Task, Warning, etc.)
│   │   ├── repository/         # Spring Data JPA Repositories
│   │   └── service/            # Business Logic + DataInitializer (auto-seeds defaults)
│   ├── src/main/resources/
│   │   └── application.properties # MySQL Connection & JWT configuration
│   └── pom.xml
│
└── Frontend/                   # React 19 + Vite + Tailwind CSS + Lucide Icons + Axios
    ├── src/
    │   ├── api/                # axiosClient with auto JWT header & 401 handling
    │   ├── context/            # AuthContext (Role-based access state)
    │   ├── components/         # ProtectedRoute, Navbar, Sidebar, IdCardModal
    │   └── pages/
    │       ├── Login.jsx       # Single login portal with one-click demo credentials
    │       ├── admin/          # Admin Dashboard, Employee CRUD, Attendance Logs, Leave Approvals, Tasks, Warnings, Broadcasts
    │       ├── hr/             # HR Dashboard, Employee directory, Attendance, Leave reviews, Tasks
    │       └── employee/       # Employee Dashboard, Digital ID Card, Attendance Check-In/Out, Leaves, Tasks, Broadcasts, Profile
    ├── package.json
    └── vite.config.js
```

---

## 🗄️ Database Architecture & Schema (MySQL)

Database: `ems_db` (Engine: InnoDB, Foreign Keys with Cascade Rules & Indexes)

1. **`roles`**: `id`, `name` (`ROLE_ADMIN`, `ROLE_HR`, `ROLE_EMPLOYEE`)
2. **`departments`**: `id`, `code` (e.g. `ENG`, `HR`, `FIN`), `name`, `description`
3. **`users`**: `id`, `email` (unique), `password` (BCrypt), `role_id` (FK), `status` (`ACTIVE`, `INACTIVE`, `RESTRICTED`)
4. **`employees`**: `id`, `user_id` (FK unique), `employee_code` (unique e.g. `EMP-1001`), `first_name`, `last_name`, `phone`, `gender`, `department_id` (FK), `designation`, `salary`, `joining_date`, `address`, `emergency_contact`, `blood_group`, `profile_image_url`
5. **`attendances`**: `id`, `employee_id` (FK), `attendance_date`, `check_in_time`, `check_out_time`, `status` (`PRESENT`, `LATE`, `HALF_DAY`, `ABSENT`), `work_mode` (`OFFICE`, `REMOTE`, `HYBRID`), `remarks`, Unique key `(employee_id, attendance_date)`
6. **`leaves`**: `id`, `employee_id` (FK), `leave_type` (`CASUAL`, `SICK`, `PAID`, `UNPAID`), `start_date`, `end_date`, `total_days`, `reason`, `status` (`PENDING`, `APPROVED`, `REJECTED`), `reviewed_by` (FK), `review_comment`
7. **`tasks`**: `id`, `title`, `description`, `assigned_to` (FK), `assigned_by` (FK), `priority` (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), `due_date`, `status` (`PENDING`, `IN_PROGRESS`, `SUBMITTED`, `COMPLETED`), `submission_report`
8. **`warnings`**: `id`, `employee_id` (FK), `issued_by` (FK), `severity` (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), `title`, `reason`, `status` (`ACTIVE`, `RESOLVED`)
9. **`announcements`**: `id`, `title`, `message`, `priority` (`NORMAL`, `IMPORTANT`, `URGENT`), `target_department_id` (FK), `created_by` (FK)

---

## 🔑 Default Accounts (Auto-Seeded)

The backend's `DataInitializer` automatically creates these default accounts on first run:

| Role | Email | Password | Employee ID | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@ems.com` | `admin123` | `EMP-1000` | Full administrative control |
| **HR Manager** | `hr@ems.com` | `hr123` | `EMP-1001` | Staff oversight & leave approvals |
| **Employee** | `rohit@ems.com` | `emp123` | `EMP-1002` | Check-in, ID Card, Tasks & Leaves |

*(The Login page also features 1-click demo buttons to automatically test any role)*

---

## 🚀 How to Run

### 1. Database Setup (MySQL)
Make sure your MySQL server is running (port 3306). Update credentials in `Backend/src/main/resources/application.properties` if your password is not `root`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ems_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 2. Start Backend (Spring Boot)
Open a terminal in the `Backend` folder:
```bash
cd Backend
mvn spring-boot:run
```
*(Or open the `Backend` folder in IntelliJ IDEA / VS Code / Eclipse and run `EmployeeManagementApplication.java`)*
Backend runs on: `http://localhost:8080`

### 3. Start Frontend (React + Vite)
Open a terminal in the `Frontend` folder:
```bash
cd Frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`
