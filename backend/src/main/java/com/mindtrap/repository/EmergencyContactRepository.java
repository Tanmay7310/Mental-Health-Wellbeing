package com.mindtrap.repository;

import com.mindtrap.domain.EmergencyContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmergencyContactRepository extends JpaRepository<EmergencyContact, UUID> {
	List<EmergencyContact> findByUserIdOrderByCreatedAtDesc(UUID userId);
	Optional<EmergencyContact> findByIdAndUserId(UUID id, UUID userId);
	Optional<EmergencyContact> findByUserIdAndIsDefaultTrue(UUID userId);
}


