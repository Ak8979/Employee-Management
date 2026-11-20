package com.ems.controller;

import com.ems.dto.AttendanceResponseDto;
import com.ems.service.AttendanceService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/check-in")
    public ResponseEntity<AttendanceResponseDto> checkIn(
            Authentication authentication,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String workMode = (body != null) ? body.get("workMode") : "OFFICE";
        String remarks = (body != null) ? body.get("remarks") : null;
        AttendanceResponseDto dto = attendanceService.checkIn(authentication.getName(), workMode, remarks);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/check-out")
    public ResponseEntity<AttendanceResponseDto> checkOut(Authentication authentication) {
        AttendanceResponseDto dto = attendanceService.checkOut(authentication.getName());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/today")
    public ResponseEntity<AttendanceResponseDto> getTodayStatus(Authentication authentication) {
        AttendanceResponseDto dto = attendanceService.getTodayStatus(authentication.getName());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/my-history")
    public ResponseEntity<List<AttendanceResponseDto>> getMyHistory(Authentication authentication) {
        return ResponseEntity.ok(attendanceService.getEmployeeHistory(authentication.getName()));
    }

    @GetMapping("/daily")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HR')")
    public ResponseEntity<List<AttendanceResponseDto>> getDailyAttendance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Long departmentId
    ) {
        return ResponseEntity.ok(attendanceService.getDailyAttendance(date, departmentId));
    }
}
