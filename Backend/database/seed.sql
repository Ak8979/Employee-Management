-- ====================================================================
-- Initial Seed Data for Employee Management System (EMS)
-- ====================================================================

USE ems_db;

-- 1. Insert Initial Roles
INSERT IGNORE INTO roles (id, name) VALUES
(1, 'ROLE_ADMIN'),
(2, 'ROLE_HR'),
(3, 'ROLE_EMPLOYEE');

-- 2. Insert Departments
INSERT IGNORE INTO departments (id, code, name, description) VALUES
(1, 'ENG', 'Engineering', 'Software Development, QA, and DevOps'),
(2, 'HR', 'Human Resources', 'Recruitment, Culture, and Employee Relations'),
(3, 'FIN', 'Finance', 'Accounting, Payroll, and Budgeting'),
(4, 'MKT', 'Marketing', 'Digital Marketing, Branding, and Content'),
(5, 'OPS', 'Operations', 'Business Operations and Logistics'),
(6, 'IT', 'IT Support', 'Internal IT Infrastructure and Hardware Support');

-- 3. Default Admin User (Password is 'admin123' hashed with BCrypt)
-- BCrypt hash for 'admin123': $2a$10$7Zz33Jc4kYwS3s0u.8w8r.1Dq31i2r17K0uHqZgD7Q1cT4fR6Wz9i (or will be seeded by Spring Boot CommandLineRunner)
