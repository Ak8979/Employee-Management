package com.ems.service;

import com.ems.dto.AttendanceResponseDto;
import com.ems.entity.Attendance;
import com.ems.entity.Employee;
import com.ems.repository.AttendanceRepository;
import com.ems.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public AttendanceService(AttendanceRepository attendanceRepository, EmployeeRepository employeeRepository) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
    }

    @Transactional
    public AttendanceResponseDto checkIn(String userEmail, String workModeStr, String remarks) {
        Employee employee = employeeRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Employee record not found for " + userEmail));

        LocalDate today = LocalDate.now();
        Optional<Attendance> existing = attendanceRepository.findByEmployeeAndAttendanceDate(employee, today);

        if (existing.isPresent()) {
            throw new IllegalStateException("Already checked in today at " + existing.get().getCheckInTime());
        }

        LocalTime now = LocalTime.now();
        Attendance.Status status = Attendance.Status.PRESENT;
        // If check-in is after 10:30 AM, mark as LATE
        if (now.isAfter(LocalTime.of(10, 30))) {
            status = Attendance.Status.LATE;
        }

        Attendance.WorkMode workMode = Attendance.WorkMode.OFFICE;
        if (workModeStr != null) {
            try {
                workMode = Attendance.WorkMode.valueOf(workModeStr.toUpperCase());
            } catch (Exception ignored) {}
        }

        Attendance attendance = new Attendance();
        attendance.setEmployee(employee);
        attendance.setAttendanceDate(today);
        attendance.setCheckInTime(now);
        attendance.setStatus(status);
        attendance.setWorkMode(workMode);
        attendance.setRemarks(remarks);

        attendance = attendanceRepository.save(attendance);
        return mapToDto(attendance);
    }

    @Transactional
    public AttendanceResponseDto checkOut(String userEmail) {
        Employee employee = employeeRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Employee record not found for " + userEmail));

        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeAndAttendanceDate(employee, today)
                .orElseThrow(() -> new IllegalStateException("No check-in record found for today. Please check in first."));

        if (attendance.getCheckOutTime() != null) {
            throw new IllegalStateException("Already checked out today at " + attendance.getCheckOutTime());
        }

        attendance.setCheckOutTime(LocalTime.now());
        attendance = attendanceRepository.save(attendance);
        return mapToDto(attendance);
    }

    public AttendanceResponseDto getTodayStatus(String userEmail) {
        Employee employee = employeeRepository.findByUserEmail(userEmail).orElse(null);
        if (employee == null) return null;

        return attendanceRepository.findByEmployeeAndAttendanceDate(employee, LocalDate.now())
                .map(this::mapToDto)
                .orElse(null);
    }

    public List<AttendanceResponseDto> getEmployeeHistory(String userEmail) {
        Employee employee = employeeRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Employee record not found."));

        return attendanceRepository.findByEmployeeOrderByAttendanceDateDesc(employee)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<AttendanceResponseDto> getDailyAttendance(LocalDate date, Long departmentId) {
        LocalDate queryDate = (date != null) ? date : LocalDate.now();
        return attendanceRepository.findByDateAndDepartment(queryDate, departmentId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public AttendanceResponseDto mapToDto(Attendance a) {
        AttendanceResponseDto dto = new AttendanceResponseDto();
        dto.setId(a.getId());
        dto.setEmployeeId(a.getEmployee().getId());
        dto.setEmployeeCode(a.getEmployee().getEmployeeCode());
        dto.setEmployeeName(a.getEmployee().getFullName());
        dto.setDepartmentName(a.getEmployee().getDepartment() != null ? a.getEmployee().getDepartment().getName() : "");
        dto.setAttendanceDate(a.getAttendanceDate());
        dto.setCheckInTime(a.getCheckInTime());
        dto.setCheckOutTime(a.getCheckOutTime());
        dto.setStatus(a.getStatus().name());
        dto.setWorkMode(a.getWorkMode().name());
        dto.setRemarks(a.getRemarks());
        return dto;
    }
}
