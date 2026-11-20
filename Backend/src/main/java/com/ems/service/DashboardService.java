package com.ems.service;

import com.ems.dto.DashboardStatsDto;
import com.ems.entity.Attendance;
import com.ems.entity.Department;
import com.ems.entity.LeaveRequest;
import com.ems.entity.Task;
import com.ems.entity.User;
import com.ems.entity.Warning;
import com.ems.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRepository leaveRepository;
    private final TaskRepository taskRepository;
    private final WarningRepository warningRepository;
    private final DepartmentRepository departmentRepository;
    private final AttendanceService attendanceService;

    public DashboardService(
            EmployeeRepository employeeRepository,
            UserRepository userRepository,
            AttendanceRepository attendanceRepository,
            LeaveRepository leaveRepository,
            TaskRepository taskRepository,
            WarningRepository warningRepository,
            DepartmentRepository departmentRepository,
            AttendanceService attendanceService
    ) {
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRepository = leaveRepository;
        this.taskRepository = taskRepository;
        this.warningRepository = warningRepository;
        this.departmentRepository = departmentRepository;
        this.attendanceService = attendanceService;
    }

    public DashboardStatsDto getDashboardStats() {
        LocalDate today = LocalDate.now();

        long totalEmployees = employeeRepository.count();
        long activeEmployees = userRepository.countByStatus(User.Status.ACTIVE);
        long inactiveEmployees = userRepository.countByStatus(User.Status.INACTIVE);
        long restrictedEmployees = userRepository.countByStatus(User.Status.RESTRICTED);

        long checkedInToday = attendanceRepository.countByAttendanceDate(today);
        long onLeaveToday = leaveRepository.countApprovedLeavesOnDate(today);

        // Not checked in = active employees who have neither checked in nor are on approved leave
        long notCheckedInToday = Math.max(0, activeEmployees - checkedInToday - onLeaveToday);

        long pendingLeaves = leaveRepository.countByStatus(LeaveRequest.LeaveStatus.PENDING);
        long openTasks = taskRepository.countByStatus(Task.TaskStatus.PENDING) + taskRepository.countByStatus(Task.TaskStatus.IN_PROGRESS);
        long activeWarnings = warningRepository.countByStatus(Warning.WarningStatus.ACTIVE);

        Map<String, Long> deptCounts = new HashMap<>();
        List<Department> departments = departmentRepository.findAll();
        for (Department dept : departments) {
            deptCounts.put(dept.getName(), employeeRepository.countByDepartmentId(dept.getId()));
        }

        DashboardStatsDto dto = new DashboardStatsDto();
        dto.setTotalEmployees(totalEmployees);
        dto.setActiveEmployees(activeEmployees);
        dto.setInactiveEmployees(inactiveEmployees);
        dto.setRestrictedEmployees(restrictedEmployees);
        dto.setCheckedInToday(checkedInToday);
        dto.setNotCheckedInToday(notCheckedInToday);
        dto.setOnLeaveToday(onLeaveToday);
        dto.setPendingLeaves(pendingLeaves);
        dto.setOpenTasks(openTasks);
        dto.setActiveWarnings(activeWarnings);
        dto.setDepartmentCounts(deptCounts);
        dto.setTodayCheckIns(attendanceService.getDailyAttendance(today, null));

        return dto;
    }
}
