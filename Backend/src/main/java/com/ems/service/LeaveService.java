package com.ems.service;

import com.ems.dto.LeaveApplyRequest;
import com.ems.dto.LeaveResponseDto;
import com.ems.dto.LeaveReviewRequest;
import com.ems.entity.Employee;
import com.ems.entity.LeaveRequest;
import com.ems.entity.User;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.LeaveRepository;
import com.ems.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    public LeaveService(LeaveRepository leaveRepository, EmployeeRepository employeeRepository, UserRepository userRepository) {
        this.leaveRepository = leaveRepository;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public LeaveResponseDto applyLeave(String userEmail, LeaveApplyRequest request) {
        Employee employee = employeeRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Employee record not found for " + userEmail));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("End date cannot be before start date.");
        }

        int days = (int) ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;

        LeaveRequest.LeaveType type = LeaveRequest.LeaveType.CASUAL;
        try {
            type = LeaveRequest.LeaveType.valueOf(request.getLeaveType().toUpperCase());
        } catch (Exception ignored) {}

        LeaveRequest leave = new LeaveRequest();
        leave.setEmployee(employee);
        leave.setLeaveType(type);
        leave.setStartDate(request.getStartDate());
        leave.setEndDate(request.getEndDate());
        leave.setTotalDays(days);
        leave.setReason(request.getReason());
        leave.setStatus(LeaveRequest.LeaveStatus.PENDING);

        leave = leaveRepository.save(leave);
        return mapToDto(leave);
    }

    @Transactional
    public LeaveResponseDto reviewLeave(Long leaveId, String reviewerEmail, LeaveReviewRequest request) {
        LeaveRequest leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found with ID: " + leaveId));

        User reviewer = userRepository.findByEmail(reviewerEmail).orElse(null);

        LeaveRequest.LeaveStatus status = LeaveRequest.LeaveStatus.valueOf(request.getStatus().toUpperCase());
        leave.setStatus(status);
        leave.setReviewedBy(reviewer);
        leave.setReviewComment(request.getReviewComment());

        leave = leaveRepository.save(leave);
        return mapToDto(leave);
    }

    public List<LeaveResponseDto> getEmployeeLeaves(String userEmail) {
        Employee employee = employeeRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Employee record not found."));

        return leaveRepository.findByEmployeeOrderByCreatedAtDesc(employee)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<LeaveResponseDto> getAllLeaves() {
        return leaveRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<LeaveResponseDto> getPendingLeaves() {
        return leaveRepository.findByStatusOrderByCreatedAtDesc(LeaveRequest.LeaveStatus.PENDING)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public LeaveResponseDto mapToDto(LeaveRequest l) {
        LeaveResponseDto dto = new LeaveResponseDto();
        dto.setId(l.getId());
        dto.setEmployeeId(l.getEmployee().getId());
        dto.setEmployeeName(l.getEmployee().getFullName());
        dto.setEmployeeCode(l.getEmployee().getEmployeeCode());
        dto.setDepartmentName(l.getEmployee().getDepartment() != null ? l.getEmployee().getDepartment().getName() : "");
        dto.setLeaveType(l.getLeaveType().name());
        dto.setStartDate(l.getStartDate());
        dto.setEndDate(l.getEndDate());
        dto.setTotalDays(l.getTotalDays());
        dto.setReason(l.getReason());
        dto.setStatus(l.getStatus().name());
        dto.setReviewedByName(l.getReviewedBy() != null ? l.getReviewedBy().getEmail() : null);
        dto.setReviewComment(l.getReviewComment());
        dto.setCreatedAt(l.getCreatedAt());
        return dto;
    }
}
