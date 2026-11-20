package com.ems.service;

import com.ems.dto.AnnouncementCreateRequest;
import com.ems.dto.AnnouncementResponseDto;
import com.ems.entity.Announcement;
import com.ems.entity.Department;
import com.ems.entity.Employee;
import com.ems.entity.User;
import com.ems.repository.AnnouncementRepository;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    public AnnouncementService(
            AnnouncementRepository announcementRepository,
            DepartmentRepository departmentRepository,
            UserRepository userRepository,
            EmployeeRepository employeeRepository
    ) {
        this.announcementRepository = announcementRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
    }

    @Transactional
    public AnnouncementResponseDto createAnnouncement(String creatorEmail, AnnouncementCreateRequest request) {
        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new IllegalArgumentException("Creator user not found."));

        Department targetDept = null;
        if (request.getTargetDepartmentId() != null) {
            targetDept = departmentRepository.findById(request.getTargetDepartmentId())
                    .orElse(null);
        }

        Announcement.Priority priority = Announcement.Priority.NORMAL;
        if (request.getPriority() != null) {
            try {
                priority = Announcement.Priority.valueOf(request.getPriority().toUpperCase());
            } catch (Exception ignored) {}
        }

        Announcement announcement = new Announcement();
        announcement.setTitle(request.getTitle().trim());
        announcement.setMessage(request.getMessage().trim());
        announcement.setPriority(priority);
        announcement.setTargetDepartment(targetDept);
        announcement.setCreatedBy(creator);

        announcement = announcementRepository.save(announcement);
        return mapToDto(announcement);
    }

    public List<AnnouncementResponseDto> getAnnouncementsForUser(String userEmail) {
        Employee emp = employeeRepository.findByUserEmail(userEmail).orElse(null);
        Long deptId = (emp != null && emp.getDepartment() != null) ? emp.getDepartment().getId() : null;

        if (deptId == null) {
            return announcementRepository.findAllByOrderByCreatedAtDesc()
                    .stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
        }

        return announcementRepository.findForDepartment(deptId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<AnnouncementResponseDto> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public AnnouncementResponseDto mapToDto(Announcement a) {
        AnnouncementResponseDto dto = new AnnouncementResponseDto();
        dto.setId(a.getId());
        dto.setTitle(a.getTitle());
        dto.setMessage(a.getMessage());
        dto.setPriority(a.getPriority().name());
        if (a.getTargetDepartment() != null) {
            dto.setTargetDepartmentId(a.getTargetDepartment().getId());
            dto.setTargetDepartmentName(a.getTargetDepartment().getName());
        } else {
            dto.setTargetDepartmentName("All Departments");
        }
        dto.setCreatedByName(a.getCreatedBy().getEmail());
        dto.setCreatedAt(a.getCreatedAt());
        return dto;
    }
}
