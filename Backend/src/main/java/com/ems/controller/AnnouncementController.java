package com.ems.controller;

import com.ems.dto.AnnouncementCreateRequest;
import com.ems.dto.AnnouncementResponseDto;
import com.ems.service.AnnouncementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<AnnouncementResponseDto> createAnnouncement(
            Authentication authentication,
            @Valid @RequestBody AnnouncementCreateRequest request
    ) {
        AnnouncementResponseDto dto = announcementService.createAnnouncement(authentication.getName(), request);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AnnouncementResponseDto>> getAnnouncements(Authentication authentication) {
        return ResponseEntity.ok(announcementService.getAnnouncementsForUser(authentication.getName()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HR')")
    public ResponseEntity<List<AnnouncementResponseDto>> getAllAnnouncements() {
        return ResponseEntity.ok(announcementService.getAllAnnouncements());
    }
}
