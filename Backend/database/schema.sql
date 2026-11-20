-- ====================================================================
-- Employee Management System (EMS) - Scalable Production MySQL Schema
-- ====================================================================

CREATE DATABASE IF NOT EXISTS ems_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE ems_db;

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 2. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Users Table (Core Authentication)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id BIGINT NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'RESTRICTED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 4. Employees Table (Profile & Employment info)
CREATE TABLE IF NOT EXISTS employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    employee_code VARCHAR(30) NOT NULL UNIQUE,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    phone VARCHAR(20),
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    department_id BIGINT NULL,
    designation VARCHAR(100) NOT NULL,
    salary DECIMAL(12, 2) DEFAULT 0.00,
    joining_date DATE NOT NULL,
    address TEXT,
    emergency_contact VARCHAR(100),
    blood_group VARCHAR(10),
    profile_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_employee_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_employee_dept FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL,
    INDEX idx_emp_code (employee_code),
    INDEX idx_emp_dept (department_id)
) ENGINE=InnoDB;

-- 5. Attendance Table
CREATE TABLE IF NOT EXISTS attendances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    attendance_date DATE NOT NULL,
    check_in_time TIME NULL,
    check_out_time TIME NULL,
    status ENUM('PRESENT', 'LATE', 'HALF_DAY', 'ABSENT') DEFAULT 'PRESENT',
    work_mode ENUM('OFFICE', 'REMOTE', 'HYBRID') DEFAULT 'OFFICE',
    remarks VARCHAR(255) NULL,
    CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE,
    CONSTRAINT uq_emp_date UNIQUE (employee_id, attendance_date),
    INDEX idx_attendance_date (attendance_date)
) ENGINE=InnoDB;

-- 6. Leaves Table
CREATE TABLE IF NOT EXISTS leaves (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    leave_type ENUM('CASUAL', 'SICK', 'PAID', 'UNPAID') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL DEFAULT 1,
    reason TEXT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    reviewed_by BIGINT NULL,
    review_comment VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_leave_employee FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE,
    CONSTRAINT fk_leave_reviewer FOREIGN KEY (reviewed_by) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_leave_status (status)
) ENGINE=InnoDB;

-- 7. Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NULL,
    assigned_to BIGINT NOT NULL,
    assigned_by BIGINT NOT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
    due_date DATE NULL,
    status ENUM('PENDING', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED') DEFAULT 'PENDING',
    submission_report TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_task_assigned_to FOREIGN KEY (assigned_to) REFERENCES employees (id) ON DELETE CASCADE,
    CONSTRAINT fk_task_assigned_by FOREIGN KEY (assigned_by) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_task_status (status)
) ENGINE=InnoDB;

-- 8. Warnings / Disciplinary Notices Table
CREATE TABLE IF NOT EXISTS warnings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    issued_by BIGINT NOT NULL,
    severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    title VARCHAR(150) NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('ACTIVE', 'RESOLVED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_warning_employee FOREIGN KEY (employee_id) REFERENCES employees (id) ON DELETE CASCADE,
    CONSTRAINT fk_warning_issued_by FOREIGN KEY (issued_by) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Announcements / Broadcasts Table
CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    priority ENUM('NORMAL', 'IMPORTANT', 'URGENT') DEFAULT 'NORMAL',
    target_department_id BIGINT NULL,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_announcement_dept FOREIGN KEY (target_department_id) REFERENCES departments (id) ON DELETE SET NULL,
    CONSTRAINT fk_announcement_user FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;
