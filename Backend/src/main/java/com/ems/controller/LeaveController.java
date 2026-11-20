package com.ems.controller;

import com.ems.dto.LeaveApplyRequest;
import com.ems.dto.LeaveResponseDto;
import com.ems.dto.LeaveReviewRequest;
import com.ems.service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping("/apply")
    public ResponseEntity<LeaveResponseDto> applyLeave(
            Authentication authentication,
            @Valid @RequestBody LeaveApplyRequest request
    ) {
        LeaveResponseDto dto = leaveService.applyLeave(authentication.getName(), request);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping("/my-leaves")
    public ResponseEntity<List<LeaveResponseDto>> getMyLeaves(Authentication authentication) {
        return ResponseEntity.ok(leaveService.getEmployeeLeaves(authentication.getName()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HR')")
    public ResponseEntity<List<LeaveResponseDto>> getAllLeaves() {
        return ResponseEntity.ok(leaveService.getAllLeaves());
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HR')")
    public ResponseEntity<List<LeaveResponseDto>> getPendingLeaves() {
        return ResponseEntity.ok(leaveService.getPendingLeaves());
    }

    @PutMapping("/{id}/review")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HR')")
    public ResponseEntity<LeaveResponseDto> reviewLeave(
            @PathVariable Long id,
            Authentication authentication,
            @Valid @RequestBody LeaveReviewRequest request
    ) {
        return ResponseEntity.ok(leaveService.reviewLeave(id, authentication.getName(), request));
    }
}
