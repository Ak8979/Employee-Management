package com.ems.repository;

import com.ems.entity.Employee;
import com.ems.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToOrderByCreatedAtDesc(Employee employee);
    List<Task> findAllByOrderByCreatedAtDesc();
    List<Task> findByStatus(Task.TaskStatus status);
    long countByStatus(Task.TaskStatus status);
}
