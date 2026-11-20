package com.ems.dto;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long userId;
    private Long employeeId;
    private String employeeCode;
    private String name;
    private String email;
    private String role;
    private String department;
    private String designation;
    private String status;

    public AuthResponse() {}

    public AuthResponse(String token, Long userId, Long employeeId, String employeeCode, String name, String email, String role, String department, String designation, String status) {
        this.token = token;
        this.userId = userId;
        this.employeeId = employeeId;
        this.employeeCode = employeeCode;
        this.name = name;
        this.email = email;
        this.role = role;
        this.department = department;
        this.designation = designation;
        this.status = status;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
