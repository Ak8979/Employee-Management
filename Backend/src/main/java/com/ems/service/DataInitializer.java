package com.ems.service;

import com.ems.entity.*;
import com.ems.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final AnnouncementRepository announcementRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            RoleRepository roleRepository,
            DepartmentRepository departmentRepository,
            UserRepository userRepository,
            EmployeeRepository employeeRepository,
            AnnouncementRepository announcementRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.roleRepository = roleRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.announcementRepository = announcementRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // 1. Roles
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_ADMIN")));
        Role hrRole = roleRepository.findByName("ROLE_HR")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_HR")));
        Role employeeRole = roleRepository.findByName("ROLE_EMPLOYEE")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_EMPLOYEE")));

        // 2. Departments
        Department engDept = departmentRepository.findByCode("ENG")
                .orElseGet(() -> departmentRepository.save(new Department("ENG", "Engineering", "Software Architecture, Development & QA")));
        Department hrDept = departmentRepository.findByCode("HR")
                .orElseGet(() -> departmentRepository.save(new Department("HR", "Human Resources", "Recruitment, Talent, and Operations")));
        departmentRepository.findByCode("FIN")
                .orElseGet(() -> departmentRepository.save(new Department("FIN", "Finance", "Accounting and Payroll Management")));
        departmentRepository.findByCode("MKT")
                .orElseGet(() -> departmentRepository.save(new Department("MKT", "Marketing", "Brand Awareness and Marketing Campaigns")));
        departmentRepository.findByCode("IT")
                .orElseGet(() -> departmentRepository.save(new Department("IT", "IT Support", "Infrastructure, Hardware and Helpdesk")));

        // 3. Default Admin User
        if (!userRepository.existsByEmail("admin@ems.com")) {
            User adminUser = new User("admin@ems.com", passwordEncoder.encode("admin123"), adminRole);
            adminUser = userRepository.save(adminUser);

            Employee adminEmp = new Employee();
            adminEmp.setUser(adminUser);
            adminEmp.setEmployeeCode("EMP-1000");
            adminEmp.setFirstName("Super");
            adminEmp.setLastName("Admin");
            adminEmp.setPhone("+91 9876543210");
            adminEmp.setGender("Male");
            adminEmp.setDepartment(engDept);
            adminEmp.setDesignation("System Administrator");
            adminEmp.setSalary(BigDecimal.valueOf(150000));
            adminEmp.setJoiningDate(LocalDate.of(2023, 1, 1));
            adminEmp.setAddress("Cyber City, Tech Park");
            adminEmp.setEmergencyContact("+91 9876543211");
            adminEmp.setBloodGroup("O+");
            employeeRepository.save(adminEmp);

            log.info("Initialized default admin user: admin@ems.com / admin123");
        }

        // 4. Default HR User for instant testing
        if (!userRepository.existsByEmail("hr@ems.com")) {
            User hrUser = new User("hr@ems.com", passwordEncoder.encode("hr123"), hrRole);
            hrUser = userRepository.save(hrUser);

            Employee hrEmp = new Employee();
            hrEmp.setUser(hrUser);
            hrEmp.setEmployeeCode("EMP-1001");
            hrEmp.setFirstName("Priya");
            hrEmp.setLastName("Sharma");
            hrEmp.setPhone("+91 9876543220");
            hrEmp.setGender("Female");
            hrEmp.setDepartment(hrDept);
            hrEmp.setDesignation("HR Manager");
            hrEmp.setSalary(BigDecimal.valueOf(85000));
            hrEmp.setJoiningDate(LocalDate.of(2023, 6, 15));
            hrEmp.setAddress("Green Valley, Tower 3");
            hrEmp.setEmergencyContact("+91 9876543221");
            hrEmp.setBloodGroup("B+");
            employeeRepository.save(hrEmp);

            log.info("Initialized default HR user: hr@ems.com / hr123");
        }

        // 5. Default Sample Employee for instant testing
        if (!userRepository.existsByEmail("rohit@ems.com")) {
            User empUser = new User("rohit@ems.com", passwordEncoder.encode("emp123"), employeeRole);
            empUser = userRepository.save(empUser);

            Employee emp = new Employee();
            emp.setUser(empUser);
            emp.setEmployeeCode("EMP-1002");
            emp.setFirstName("Rohit");
            emp.setLastName("Verma");
            emp.setPhone("+91 9876543230");
            emp.setGender("Male");
            emp.setDepartment(engDept);
            emp.setDesignation("Senior Software Engineer");
            emp.setSalary(BigDecimal.valueOf(95000));
            emp.setJoiningDate(LocalDate.of(2024, 2, 1));
            emp.setAddress("Sector 62, Noida");
            emp.setEmergencyContact("+91 9876543231");
            emp.setBloodGroup("A+");
            employeeRepository.save(emp);

            log.info("Initialized default employee: rohit@ems.com / emp123 (EMP-1002)");
        }

        // 6. Welcome broadcast
        if (announcementRepository.count() == 0) {
            User admin = userRepository.findByEmail("admin@ems.com").orElse(null);
            if (admin != null) {
                Announcement a = new Announcement();
                a.setTitle("Welcome to EMS Portal!");
                a.setMessage("Please mark your daily check-in on time and review your tasks. Have a productive day ahead!");
                a.setPriority(Announcement.Priority.IMPORTANT);
                a.setCreatedBy(admin);
                announcementRepository.save(a);
            }
        }
    }
}
