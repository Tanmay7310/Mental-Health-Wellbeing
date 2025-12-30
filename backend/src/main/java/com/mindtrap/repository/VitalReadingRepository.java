package com.mindtrap.repository;

import com.mindtrap.domain.VitalReading;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface VitalReadingRepository extends JpaRepository<VitalReading, UUID> {
	Page<VitalReading> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
}


