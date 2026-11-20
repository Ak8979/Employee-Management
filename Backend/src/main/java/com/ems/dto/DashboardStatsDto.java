package com.ems.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private long totalEmployees;
    private long activeEmployees;
    private long inactiveEmployees;   // Ex-employees
    private long restrictedEmployees; // Restricted / Suspended
    private long checkedInToday;      // Checked in today
    private long notCheckedInToday;   // Absent or pending checkin
    private long onLeaveToday;        // On approved leave today
    private long pendingLeaves;       // Leave requests awaiting review
    private long openTasks;           // Pending / In progress tasks
    private long activeWarnings;      // Active disciplinary warnings
    private Map<String, Long> departmentCounts;
    private List<AttendanceResponseDto> todayCheckIns;

    public DashboardStatsDto() {}

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public long getActiveEmployees() {
        return activeEmployees;
    }

    public void setActiveEmployees(long activeEmployees) {
        this.activeEmployees = activeEmployees;
    }

    public long getInactiveEmployees() {
        return inactiveEmployees;
    }

    public void setInactiveEmployees(long inactiveEmployees) {
        this.inactiveEmployees = inactiveEmployees;
    }

    public long getRestrictedEmployees() {
        return restrictedEmployees;
    }

    public void setRestrictedEmployees(long restrictedEmployees) {
        this.restrictedEmployees = restrictedEmployees;
    }

    public long getCheckedInToday() {
        return checkedInToday;
    }

    public void setCheckedInToday(long checkedInToday) {
        this.checkedInToday = checkedInToday;
    }

    public long getNotCheckedInToday() {
        return notCheckedInToday;
    }

    public void setNotCheckedInToday(long notCheckedInToday) {
        this.notCheckedInToday = notCheckedInToday;
    }

    public long getOnLeaveToday() {
        return onLeaveToday;
    }

    public void setOnLeaveToday(long onLeaveToday) {
        this.onLeaveToday = onLeaveToday;
    }

    public long getPendingLeaves() {
        return pendingLeaves;
    }

    public void setPendingLeaves(long pendingLeaves) {
        this.pendingLeaves = pendingLeaves;
    }

    public long getOpenTasks() {
        return openTasks;
    }

    public void setOpenTasks(long openTasks) {
        this.openTasks = openTasks;
    }

    public long getActiveWarnings() {
        return activeWarnings;
    }

    public void setActiveWarnings(long activeWarnings) {
        this.activeWarnings = activeWarnings;
    }

    public Map<String, Long> getDepartmentCounts() {
        return departmentCounts;
    }

    public void setDepartmentCounts(Map<String, Long> departmentCounts) {
        this.departmentCounts = departmentCounts;
    }

    public List<AttendanceResponseDto> getTodayCheckIns() {
        return todayCheckIns;
    }

    public void setTodayCheckIns(List<AttendanceResponseDto> todayCheckIns) {
        this.todayCheckIns = todayCheckIns;
    }
}
