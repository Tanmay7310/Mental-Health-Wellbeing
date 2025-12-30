package com.mindtrap.repository;

import com.mindtrap.domain.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
	Optional<RefreshToken> findByToken(String token);
	void deleteByToken(String token);
	void deleteByUserId(UUID userId);
	
	@Modifying
	@Query("DELETE FROM RefreshToken rt WHERE rt.expiresAt < ?1")
	void deleteExpiredTokens(Instant now);
}


