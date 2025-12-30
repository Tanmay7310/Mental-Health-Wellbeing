package com.mindtrap.repository;

import com.mindtrap.domain.Assessment;
import com.mindtrap.domain.AssessmentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, UUID> {
	Page<Assessment> findByUserId(UUID userId, Pageable pageable);
	Page<Assessment> findByUserIdAndAssessmentType(UUID userId, AssessmentType type, Pageable pageable);
}


