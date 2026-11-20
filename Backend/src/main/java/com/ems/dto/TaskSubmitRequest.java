package com.ems.dto;

import jakarta.validation.constraints.NotBlank;

public class TaskSubmitRequest {
    private String status; // IN_PROGRESS, SUBMITTED, COMPLETED

    @NotBlank(message = "Submission report is required")
    private String submissionReport;

    public TaskSubmitRequest() {}

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
}
