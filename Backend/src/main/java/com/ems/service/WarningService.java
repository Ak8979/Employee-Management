package com.ems.service;

import com.ems.dto.WarningCreateRequest;
import com.ems.dto.WarningResponseDto;
import com.ems.entity.Employee;
import com.ems.entity.User;
import com.ems.entity.Warning;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.UserRepository;
import com.ems.repository.WarningRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WarningService {

    private final WarningRepository warningRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    public WarningService(WarningRepository warningRepository, EmployeeRepository employeeRepository, UserRepository userRepository) {
        this.warningRepository = warningRepository;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public WarningResponseDto issueWarning(String issuerEmail, WarningCreateRequest request) {
        User issuer = userRepository.findByEmail(issuerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Issuer user not found."));

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + request.getEmployeeId()));

        Warning.Severity severity = Warning.Severity.MEDIUM;
        if (request.getSeverity() != null) {
            try {
                severity = Warning.Severity.valueOf(request.getSeverity().toUpperCase());
            } catch (Exception ignored) {}
        }

        Warning warning = new Warning();
        warning.setEmployee(employee);
        warning.setIssuedBy(issuer);
        warning.setSeverity(severity);
        warning.setTitle(request.getTitle().trim());
        warning.setReason(request.getReason());
        warning.setStatus(Warning.WarningStatus.ACTIVE);

        warning = warningRepository.save(warning);
        return mapToDto(warning);
    }

    @Transactional
    public WarningResponseDto resolveWarning(Long warningId) {
        Warning warning = warningRepository.findById(warningId)
                .orElseThrow(() -> new IllegalArgumentException("Warning not found with ID: " + warningId));

        warning.setStatus(Warning.WarningStatus.RESOLVED);
        warning = warningRepository.save(warning);
        return mapToDto(warning);
    }

    public List<WarningResponseDto> getEmployeeWarnings(String employeeEmail) {
        Employee employee = employeeRepository.findByUserEmail(employeeEmail)
                .orElseThrow(() -> new IllegalArgumentException("Employee record not found."));

        return warningRepository.findByEmployeeOrderByCreatedAtDesc(employee)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<WarningResponseDto> getAllWarnings() {
        return warningRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public WarningResponseDto mapToDto(Warning w) {
        WarningResponseDto dto = new WarningResponseDto();
        dto.setId(w.getId());
        dto.setEmployeeId(w.getEmployee().getId());
        dto.setEmployeeName(w.getEmployee().getFullName());
        dto.setEmployeeCode(w.getEmployee().getEmployeeCode());
        dto.setDepartmentName(w.getEmployee().getDepartment() != null ? w.getEmployee().getDepartment().getName() : "");
        dto.setIssuedByName(w.getIssuedBy().getEmail());
        dto.setSeverity(w.getSeverity().name());
        dto.setTitle(w.getTitle());
        dto.setReason(w.getReason());
        dto.setStatus(w.getStatus().name());
        dto.setCreatedAt(w.getCreatedAt());
        return dto;
    }
}
