package com.ems.repository;

import com.ems.entity.Employee;
import com.ems.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByUser(User user);
    Optional<Employee> findByEmployeeCode(String employeeCode);
    Optional<Employee> findByUserEmail(String email);
    boolean existsByEmployeeCode(String employeeCode);

    Optional<Employee> findTopByOrderByIdDesc();

    @Query("SELECT e FROM Employee e WHERE " +
           "(:query IS NULL OR LOWER(e.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(e.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(e.user.email) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:departmentId IS NULL OR e.department.id = :departmentId) AND " +
           "(:status IS NULL OR e.user.status = :status)")
    List<Employee> searchEmployees(
            @Param("query") String query,
            @Param("departmentId") Long departmentId,
            @Param("status") User.Status status
    );

    long countByDepartmentId(Long departmentId);
}
