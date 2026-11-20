package com.ems.dto;

import jakarta.validation.constraints.NotBlank;

public class AnnouncementCreateRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    private String priority = "NORMAL"; // NORMAL, IMPORTANT, URGENT

    private Long targetDepartmentId; // null = all departments

    public AnnouncementCreateRequest() {}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public Long getTargetDepartmentId() {
        return targetDepartmentId;
    }

    public void setTargetDepartmentId(Long targetDepartmentId) {
        this.targetDepartmentId = targetDepartmentId;
    }
}
