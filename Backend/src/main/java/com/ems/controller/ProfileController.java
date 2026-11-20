package com.ems.controller;

import com.ems.dto.EmployeeResponseDto;
import com.ems.dto.EmployeeUpdateRequest;
import com.ems.dto.PasswordChangeRequest;
import com.ems.service.AuthService;
import com.ems.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final EmployeeService employeeService;
    private final AuthService authService;

    public ProfileController(EmployeeService employeeService, AuthService authService) {
        this.employeeService = employeeService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<EmployeeResponseDto> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(employeeService.getByUserEmail(authentication.getName()));
    }

    @PutMapping
    public ResponseEntity<EmployeeResponseDto> updateMyProfile(
            Authentication authentication,
            @RequestBody EmployeeUpdateRequest request
    ) {
        EmployeeResponseDto current = employeeService.getByUserEmail(authentication.getName());
        // Do not allow employees to modify their own salary, status or role
        request.setSalary(null);
        request.setStatus(null);
        request.setRole(null);
        request.setDepartmentId(null);
        return ResponseEntity.ok(employeeService.updateEmployee(current.getId(), request));
    }

    @PutMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            Authentication authentication,
            @Valid @RequestBody PasswordChangeRequest request
    ) {
        authService.changePassword(authentication.getName(), request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully."));
    }
}
