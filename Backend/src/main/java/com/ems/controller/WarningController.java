package com.ems.controller;

import com.ems.dto.WarningCreateRequest;
import com.ems.dto.WarningResponseDto;
import com.ems.service.WarningService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warnings")
public class WarningController {

    private final WarningService warningService;

    public WarningController(WarningService warningService) {
        this.warningService = warningService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<WarningResponseDto> issueWarning(
            Authentication authentication,
            @Valid @RequestBody WarningCreateRequest request
    ) {
        WarningResponseDto dto = warningService.issueWarning(authentication.getName(), request);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping("/my-warnings")
    public ResponseEntity<List<WarningResponseDto>> getMyWarnings(Authentication authentication) {
        return ResponseEntity.ok(warningService.getEmployeeWarnings(authentication.getName()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HR')")
    public ResponseEntity<List<WarningResponseDto>> getAllWarnings() {
        return ResponseEntity.ok(warningService.getAllWarnings());
    }

    @PatchMapping("/{id}/resolve")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<WarningResponseDto> resolveWarning(@PathVariable Long id) {
        return ResponseEntity.ok(warningService.resolveWarning(id));
    }
}
