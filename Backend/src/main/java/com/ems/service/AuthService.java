package com.ems.service;

import com.ems.config.JwtUtils;
import com.ems.dto.AuthResponse;
import com.ems.dto.LoginRequest;
import com.ems.dto.PasswordChangeRequest;
import com.ems.entity.Employee;
import com.ems.entity.User;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            EmployeeRepository employeeRepository,
            JwtUtils jwtUtils,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password."));

        if (user.getStatus() == User.Status.RESTRICTED) {
            throw new BadCredentialsException("Your account is restricted. Please contact Administrator.");
        }
        if (user.getStatus() == User.Status.INACTIVE) {
            throw new BadCredentialsException("Your account is inactive. Please contact HR or Administrator.");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        Employee emp = employeeRepository.findByUser(user).orElse(null);

        String name = emp != null ? emp.getFullName() : (user.getRole().getName().replace("ROLE_", ""));
        String employeeCode = emp != null ? emp.getEmployeeCode() : "ADMIN";
        Long employeeId = emp != null ? emp.getId() : null;
        String deptName = (emp != null && emp.getDepartment() != null) ? emp.getDepartment().getName() : "";
        String designation = emp != null ? emp.getDesignation() : "System Administrator";

        String token = jwtUtils.generateToken(
                user.getEmail(),
                user.getRole().getName(),
                user.getId(),
                employeeCode,
                name
        );

        return new AuthResponse(
                token,
                user.getId(),
                employeeId,
                employeeCode,
                name,
                user.getEmail(),
                user.getRole().getName(),
                deptName,
                designation,
                user.getStatus().name()
        );
    }

    @Transactional
    public void changePassword(String email, PasswordChangeRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Incorrect current password.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
