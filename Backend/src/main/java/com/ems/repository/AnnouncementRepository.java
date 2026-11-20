package com.ems.repository;

import com.ems.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findAllByOrderByCreatedAtDesc();

    @Query("SELECT a FROM Announcement a WHERE a.targetDepartment IS NULL OR a.targetDepartment.id = :deptId ORDER BY a.createdAt DESC")
    List<Announcement> findForDepartment(@Param("deptId") Long deptId);
}
