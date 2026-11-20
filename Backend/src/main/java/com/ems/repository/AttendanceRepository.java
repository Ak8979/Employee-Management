package com.ems.repository;

import com.ems.entity.Attendance;
import com.ems.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByEmployeeAndAttendanceDate(Employee employee, LocalDate date);

    List<Attendance> findByAttendanceDate(LocalDate date);

    List<Attendance> findByEmployeeOrderByAttendanceDateDesc(Employee employee);

    @Query("SELECT a FROM Attendance a WHERE a.attendanceDate = :date AND (:deptId IS NULL OR a.employee.department.id = :deptId)")
    List<Attendance> findByDateAndDepartment(@Param("date") LocalDate date, @Param("deptId") Long deptId);

    long countByAttendanceDate(LocalDate date);

    long countByAttendanceDateAndStatus(LocalDate date, Attendance.Status status);
}
