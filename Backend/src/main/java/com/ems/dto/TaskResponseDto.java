package com.ems.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskResponseDto {
    private Long id;
    private String title;
    private String description;
    private Long assignedToEmployeeId;
    private String assignedToName;
    private String assignedToCode;
    private String assignedByName;
    private String priority; // LOW, MEDIUM, HIGH, URGENT
    private LocalDate dueDate;
    private String status;   // PENDING, IN_PROGRESS, SUBMITTED, COMPLETED
    private String submissionReport;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TaskResponseDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getAssignedToName() {
        return assignedToName;
    }

    public void setAssignedToName(String assignedToName) {
        this.assignedToName = assignedToName;
    }

    public String getAssignedToCode() {
        return assignedToCode;
    }

    public void setAssignedToCode(String assignedToCode) {
        this.assignedToCode = assignedToCode;
    }

    public String getAssignedByName() {
        return assignedByName;
    }

    public void setAssignedByName(String assignedByName) {
        this.assignedByName = assignedByName;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSubmissionReport() {
        return submissionReport;
    }

    public void setSubmissionReport(String submissionReport) {
        this.submissionReport = submissionReport;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
