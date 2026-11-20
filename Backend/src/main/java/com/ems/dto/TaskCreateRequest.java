package com.ems.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class TaskCreateRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Assigned employee ID is required")
    private Long assignedToEmployeeId;

    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH, URGENT

    private LocalDate dueDate;

    public TaskCreateRequest() {}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getAssignedToEmployeeId() {
        return assignedToEmployeeId;
    }

    public void setAssignedToEmployeeId(Long assignedToEmployeeId) {
        this.assignedToEmployeeId = assignedToEmployeeId;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
}
