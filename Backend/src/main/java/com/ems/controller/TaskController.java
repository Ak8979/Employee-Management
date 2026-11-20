package com.ems.controller;

import com.ems.dto.TaskCreateRequest;
import com.ems.dto.TaskResponseDto;
import com.ems.dto.TaskSubmitRequest;
import com.ems.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HR')")
    public ResponseEntity<TaskResponseDto> createTask(
            Authentication authentication,
            @Valid @RequestBody TaskCreateRequest request
    ) {
        TaskResponseDto dto = taskService.createTask(authentication.getName(), request);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping("/my-tasks")
    public ResponseEntity<List<TaskResponseDto>> getMyTasks(Authentication authentication) {
        return ResponseEntity.ok(taskService.getEmployeeTasks(authentication.getName()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HR')")
    public ResponseEntity<List<TaskResponseDto>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @PutMapping("/{id}/submit")
    public ResponseEntity<TaskResponseDto> submitTask(
            @PathVariable Long id,
            Authentication authentication,
            @Valid @RequestBody TaskSubmitRequest request
    ) {
        return ResponseEntity.ok(taskService.submitTask(id, authentication.getName(), request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_HR')")
    public ResponseEntity<TaskResponseDto> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String status = body.get("status");
        return ResponseEntity.ok(taskService.updateTaskStatus(id, status));
    }
}
