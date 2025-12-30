package com.mindtrap.service;

import com.mindtrap.domain.Profile;
import com.mindtrap.domain.RefreshToken;
import com.mindtrap.domain.User;
import com.mindtrap.dto.*;
import com.mindtrap.repository.ProfileRepository;
import com.mindtrap.repository.RefreshTokenRepository;
import com.mindtrap.repository.UserRepository;
import com.mindtrap.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
	private final UserRepository userRepository;
	private final ProfileRepository profileRepository;
	private final RefreshTokenRepository refreshTokenRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;
	private final ProfileService profileService;

	@Transactional
	public AuthResponse register(RegisterRequest request) {
		if (userRepository.existsByEmail(request.getEmail())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
		}

		User user = User.builder()
			.email(request.getEmail())
			.passwordHash(passwordEncoder.encode(request.getPassword()))
			.enabled(true)
			.build();
		user = userRepository.save(user);

		Profile profile = Profile.builder()
			.user(user)
			.fullName(request.getFullName())
			.email(request.getEmail())
			.initialScreeningCompleted(false)
			.build();
		profile = profileRepository.save(profile);

		String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail());
		String refreshToken = jwtUtil.generateRefreshToken(user.getId());

		// Delete any existing refresh tokens for this user to prevent duplicates
		refreshTokenRepository.deleteByUserId(user.getId());

		RefreshToken refreshTokenEntity = RefreshToken.builder()
			.user(user)
			.token(refreshToken)
			.expiresAt(Instant.now().plus(jwtUtil.getRefreshTokenTtl()))
			.build();
		refreshTokenRepository.save(refreshTokenEntity);

		return AuthResponse.builder()
			.userId(user.getId())
			.profile(profileService.toDto(profile))
			.tokens(TokenResponse.builder()
				.accessToken(accessToken)
				.refreshToken(refreshToken)
				.expiresIn(jwtUtil.getAccessTokenTtl().getSeconds())
				.build())
			.build();
	}

	@Transactional
	public AuthResponse login(AuthRequest request) {
		User user = userRepository.findByEmail(request.getEmail())
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

		if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
		}

		if (!user.getEnabled()) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is disabled");
		}

		Profile profile = profileRepository.findByUserId(user.getId())
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));

		String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail());
		String refreshToken = jwtUtil.generateRefreshToken(user.getId());

		// Delete any existing refresh tokens for this user to prevent duplicates
		refreshTokenRepository.deleteByUserId(user.getId());

		RefreshToken refreshTokenEntity = RefreshToken.builder()
			.user(user)
			.token(refreshToken)
			.expiresAt(Instant.now().plus(jwtUtil.getRefreshTokenTtl()))
			.build();
		refreshTokenRepository.save(refreshTokenEntity);

		return AuthResponse.builder()
			.userId(user.getId())
			.profile(profileService.toDto(profile))
			.tokens(TokenResponse.builder()
				.accessToken(accessToken)
				.refreshToken(refreshToken)
				.expiresIn(jwtUtil.getAccessTokenTtl().getSeconds())
				.build())
			.build();
	}

	@Transactional
	public TokenResponse refreshToken(RefreshTokenRequest request) {
		RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

		if (refreshToken.getExpiresAt().isBefore(Instant.now())) {
			refreshTokenRepository.delete(refreshToken);
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired");
		}

		User user = refreshToken.getUser();
		String newAccessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail());

		return TokenResponse.builder()
			.accessToken(newAccessToken)
			.refreshToken(request.getRefreshToken())
			.expiresIn(jwtUtil.getAccessTokenTtl().getSeconds())
			.build();
	}

	@Transactional
	public void logout(RefreshTokenRequest request) {
		refreshTokenRepository.deleteByToken(request.getRefreshToken());
	}
}



