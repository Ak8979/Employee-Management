package com.ems.repository;

import com.ems.entity.Employee;
import com.ems.entity.Warning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WarningRepository extends JpaRepository<Warning, Long> {
    List<Warning> findByEmployeeOrderByCreatedAtDesc(Employee employee);
    List<Warning> findAllByOrderByCreatedAtDesc();
    long countByStatus(Warning.WarningStatus status);
    long countByEmployeeAndStatus(Employee employee, Warning.WarningStatus status);
}
