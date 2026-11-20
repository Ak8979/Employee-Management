package com.ems.dto;

import jakarta.validation.constraints.NotBlank;

public class LeaveReviewRequest {
    @NotBlank(message = "Status must be APPROVED or REJECTED")
    private String status; // APPROVED or REJECTED

    private String reviewComment;

    public LeaveReviewRequest() {}

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReviewComment() {
        return reviewComment;
    }

    public void setReviewComment(String reviewComment) {
        this.reviewComment = reviewComment;
    }
}
