package com.mindtrap.repository;

import com.mindtrap.domain.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, UUID> {
	Optional<Profile> findByUserId(UUID userId);
}


