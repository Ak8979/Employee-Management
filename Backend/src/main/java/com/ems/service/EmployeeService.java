package com.ems.service;

import com.ems.dto.EmployeeCreateRequest;
import com.ems.dto.EmployeeResponseDto;
import com.ems.dto.EmployeeUpdateRequest;
import com.ems.entity.*;
import com.ems.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final WarningRepository warningRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeService(
            EmployeeRepository employeeRepository,
            UserRepository userRepository,
            RoleRepository roleRepository,
            DepartmentRepository departmentRepository,
            WarningRepository warningRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.departmentRepository = departmentRepository;
        this.warningRepository = warningRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private synchronized String generateNextEmployeeCode() {
        Optional<Employee> latest = employeeRepository.findTopByOrderByIdDesc();
        long nextNum = 1001;
        if (latest.isPresent()) {
            String code = latest.get().getEmployeeCode();
            try {
                if (code.startsWith("EMP-")) {
                    long currentNum = Long.parseLong(code.substring(4));
                    nextNum = Math.max(nextNum, currentNum + 1);
                } else {
                    nextNum = latest.get().getId() + 1000;
                }
            } catch (Exception ignored) {
                nextNum = latest.get().getId() + 1000;
            }
        }
        return "EMP-" + nextNum;
    }

    @Transactional
    public EmployeeResponseDto createEmployee(EmployeeCreateRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("User with email " + email + " already exists.");
        }

        String roleName = request.getRole() != null && request.getRole().equalsIgnoreCase("ROLE_HR")
                ? "ROLE_HR"
                : "ROLE_EMPLOYEE";

        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(roleName)));

        String rawPassword = (request.getPassword() != null && !request.getPassword().trim().isEmpty())
                ? request.getPassword().trim()
                : "emp123";

        User user = new User(email, passwordEncoder.encode(rawPassword), role);
        user = userRepository.save(user);

        Department dept = null;
        if (request.getDepartmentId() != null) {
            dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Department not found with ID: " + request.getDepartmentId()));
        }

        Employee emp = new Employee();
        emp.setUser(user);
        emp.setEmployeeCode(generateNextEmployeeCode());
        emp.setFirstName(request.getFirstName().trim());
        emp.setLastName(request.getLastName().trim());
        emp.setPhone(request.getPhone());
        emp.setGender(request.getGender());
        emp.setDepartment(dept);
        emp.setDesignation(request.getDesignation().trim());
        emp.setSalary(request.getSalary());
        emp.setJoiningDate(request.getJoiningDate());
        emp.setAddress(request.getAddress());
        emp.setEmergencyContact(request.getEmergencyContact());
        emp.setBloodGroup(request.getBloodGroup());
        emp.setProfileImageUrl(request.getProfileImageUrl());

        emp = employeeRepository.save(emp);
        return mapToDto(emp);
    }

    @Transactional
    public EmployeeResponseDto updateEmployee(Long id, EmployeeUpdateRequest request) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + id));

        if (request.getFirstName() != null) emp.setFirstName(request.getFirstName().trim());
        if (request.getLastName() != null) emp.setLastName(request.getLastName().trim());
        if (request.getPhone() != null) emp.setPhone(request.getPhone());
        if (request.getGender() != null) emp.setGender(request.getGender());
        if (request.getDesignation() != null) emp.setDesignation(request.getDesignation().trim());
        if (request.getSalary() != null) emp.setSalary(request.getSalary());
        if (request.getJoiningDate() != null) emp.setJoiningDate(request.getJoiningDate());
        if (request.getAddress() != null) emp.setAddress(request.getAddress());
        if (request.getEmergencyContact() != null) emp.setEmergencyContact(request.getEmergencyContact());
        if (request.getBloodGroup() != null) emp.setBloodGroup(request.getBloodGroup());
        if (request.getProfileImageUrl() != null) emp.setProfileImageUrl(request.getProfileImageUrl());

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Department not found with ID: " + request.getDepartmentId()));
            emp.setDepartment(dept);
        }

        if (request.getStatus() != null) {
            try {
                User.Status newStatus = User.Status.valueOf(request.getStatus().toUpperCase());
                emp.getUser().setStatus(newStatus);
            } catch (Exception ignored) {}
        }

        if (request.getRole() != null) {
            Role role = roleRepository.findByName(request.getRole())
                    .orElse(null);
            if (role != null) {
                emp.getUser().setRole(role);
            }
        }

        emp = employeeRepository.save(emp);
        return mapToDto(emp);
    }

    public List<EmployeeResponseDto> searchEmployees(String query, Long departmentId, String statusStr) {
        User.Status status = null;
        if (statusStr != null && !statusStr.isEmpty() && !statusStr.equalsIgnoreCase("ALL")) {
            try {
                status = User.Status.valueOf(statusStr.toUpperCase());
            } catch (Exception ignored) {}
        }

        String search = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        return employeeRepository.searchEmployees(search, departmentId, status)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public EmployeeResponseDto getById(Long id) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + id));
        return mapToDto(emp);
    }

    public EmployeeResponseDto getByEmployeeCode(String code) {
        Employee emp = employeeRepository.findByEmployeeCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with code: " + code));
        return mapToDto(emp);
    }

    public EmployeeResponseDto getByUserEmail(String email) {
        Employee emp = employeeRepository.findByUserEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Employee profile not found for email: " + email));
        return mapToDto(emp);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + id));
        employeeRepository.delete(emp);
    }

    public EmployeeResponseDto mapToDto(Employee emp) {
        EmployeeResponseDto dto = new EmployeeResponseDto();
        dto.setId(emp.getId());
        dto.setUserId(emp.getUser() != null ? emp.getUser().getId() : null);
        dto.setEmployeeCode(emp.getEmployeeCode());
        dto.setFirstName(emp.getFirstName());
        dto.setLastName(emp.getLastName());
        dto.setFullName(emp.getFullName());
        dto.setEmail(emp.getUser() != null ? emp.getUser().getEmail() : "");
        dto.setPhone(emp.getPhone());
        dto.setGender(emp.getGender());

        if (emp.getDepartment() != null) {
            dto.setDepartmentId(emp.getDepartment().getId());
            dto.setDepartmentName(emp.getDepartment().getName());
            dto.setDepartmentCode(emp.getDepartment().getCode());
        }

        dto.setDesignation(emp.getDesignation());
        dto.setSalary(emp.getSalary());
        dto.setJoiningDate(emp.getJoiningDate());
        dto.setAddress(emp.getAddress());
        dto.setEmergencyContact(emp.getEmergencyContact());
        dto.setBloodGroup(emp.getBloodGroup());
        dto.setProfileImageUrl(emp.getProfileImageUrl());

        if (emp.getUser() != null) {
            dto.setStatus(emp.getUser().getStatus().name());
            dto.setRole(emp.getUser().getRole() != null ? emp.getUser().getRole().getName() : "ROLE_EMPLOYEE");
        }

        long warnings = warningRepository.countByEmployeeAndStatus(emp, Warning.WarningStatus.ACTIVE);
        dto.setWarningCount(warnings);
        dto.setCreatedAt(emp.getCreatedAt());

        return dto;
    }
}
