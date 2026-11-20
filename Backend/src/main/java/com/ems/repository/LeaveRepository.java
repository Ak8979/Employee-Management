package com.ems.repository;

import com.ems.entity.Employee;
import com.ems.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployeeOrderByCreatedAtDesc(Employee employee);

    List<LeaveRequest> findByStatusOrderByCreatedAtDesc(LeaveRequest.LeaveStatus status);

    List<LeaveRequest> findAllByOrderByCreatedAtDesc();

    long countByStatus(LeaveRequest.LeaveStatus status);

    @Query("SELECT COUNT(l) FROM LeaveRequest l WHERE l.status = 'APPROVED' AND :date BETWEEN l.startDate AND l.endDate")
    long countApprovedLeavesOnDate(@Param("date") LocalDate date);

    @Query("SELECT l FROM LeaveRequest l WHERE l.status = 'APPROVED' AND :date BETWEEN l.startDate AND l.endDate")
    List<LeaveRequest> findApprovedLeavesOnDate(@Param("date") LocalDate date);

    @Query("SELECT l FROM LeaveRequest l WHERE l.employee.department.id = :deptId ORDER BY l.createdAt DESC")
    List<LeaveRequest> findByDepartmentId(@Param("deptId") Long deptId);
}
