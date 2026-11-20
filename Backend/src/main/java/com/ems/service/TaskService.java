package com.ems.service;

import com.ems.dto.TaskCreateRequest;
import com.ems.dto.TaskResponseDto;
import com.ems.dto.TaskSubmitRequest;
import com.ems.entity.Employee;
import com.ems.entity.Task;
import com.ems.entity.User;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.TaskRepository;
import com.ems.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, EmployeeRepository employeeRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TaskResponseDto createTask(String creatorEmail, TaskCreateRequest request) {
        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new IllegalArgumentException("Creator user not found."));

        Employee assignee = employeeRepository.findById(request.getAssignedToEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with ID: " + request.getAssignedToEmployeeId()));

        Task.Priority priority = Task.Priority.MEDIUM;
        if (request.getPriority() != null) {
            try {
                priority = Task.Priority.valueOf(request.getPriority().toUpperCase());
            } catch (Exception ignored) {}
        }

        Task task = new Task();
        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription());
        task.setAssignedTo(assignee);
        task.setAssignedBy(creator);
        task.setPriority(priority);
        task.setDueDate(request.getDueDate());
        task.setStatus(Task.TaskStatus.PENDING);

        task = taskRepository.save(task);
        return mapToDto(task);
    }

    @Transactional
    public TaskResponseDto submitTask(Long taskId, String employeeEmail, TaskSubmitRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + taskId));

        if (!task.getAssignedTo().getUser().getEmail().equalsIgnoreCase(employeeEmail)) {
            throw new IllegalStateException("You are not authorized to submit this task.");
        }

        if (request.getStatus() != null) {
            try {
                task.setStatus(Task.TaskStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (Exception ignored) {
                task.setStatus(Task.TaskStatus.SUBMITTED);
            }
        } else {
            task.setStatus(Task.TaskStatus.SUBMITTED);
        }

        task.setSubmissionReport(request.getSubmissionReport());
        task = taskRepository.save(task);
        return mapToDto(task);
    }

    @Transactional
    public TaskResponseDto updateTaskStatus(Long taskId, String statusStr) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + taskId));

        task.setStatus(Task.TaskStatus.valueOf(statusStr.toUpperCase()));
        task = taskRepository.save(task);
        return mapToDto(task);
    }

    public List<TaskResponseDto> getEmployeeTasks(String employeeEmail) {
        Employee employee = employeeRepository.findByUserEmail(employeeEmail)
                .orElseThrow(() -> new IllegalArgumentException("Employee record not found."));

        return taskRepository.findByAssignedToOrderByCreatedAtDesc(employee)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<TaskResponseDto> getAllTasks() {
        return taskRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public TaskResponseDto mapToDto(Task t) {
        TaskResponseDto dto = new TaskResponseDto();
        dto.setId(t.getId());
        dto.setTitle(t.getTitle());
        dto.setDescription(t.getDescription());
        dto.setAssignedToEmployeeId(t.getAssignedTo().getId());
        dto.setAssignedToName(t.getAssignedTo().getFullName());
        dto.setAssignedToCode(t.getAssignedTo().getEmployeeCode());
        dto.setAssignedByName(t.getAssignedBy().getEmail());
        dto.setPriority(t.getPriority().name());
        dto.setDueDate(t.getDueDate());
        dto.setStatus(t.getStatus().name());
        dto.setSubmissionReport(t.getSubmissionReport());
        dto.setCreatedAt(t.getCreatedAt());
        dto.setUpdatedAt(t.getUpdatedAt());
        return dto;
    }
}
