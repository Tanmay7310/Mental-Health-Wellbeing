package com.mindtrap.service;

import com.mindtrap.domain.Profile;
import com.mindtrap.dto.ProfileDto;
import com.mindtrap.dto.UpdateProfileRequest;
import com.mindtrap.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {
	private final ProfileRepository profileRepository;

	public ProfileDto getProfile(UUID userId) {
		Profile profile = profileRepository.findByUserId(userId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
		return toDto(profile);
	}

	@Transactional
	public ProfileDto updateProfile(UUID userId, UpdateProfileRequest request) {
		Profile profile = profileRepository.findByUserId(userId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));

		if (request.getPhone() != null) {
			profile.setPhone(request.getPhone());
		}
		if (request.getHomeAddress() != null) {
			profile.setHomeAddress(request.getHomeAddress());
		}
		if (request.getCountry() != null) {
			profile.setCountry(request.getCountry());
		}
		if (request.getPincode() != null) {
			profile.setPincode(request.getPincode());
		}

		profile = profileRepository.save(profile);
		return toDto(profile);
	}

	@Transactional
	public ProfileDto markScreeningCompleted(UUID userId) {
		Profile profile = profileRepository.findByUserId(userId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
		profile.setInitialScreeningCompleted(true);
		profile = profileRepository.save(profile);
		return toDto(profile);
	}

	public ProfileDto toDto(Profile profile) {
		return ProfileDto.builder()
			.id(profile.getId())
			.fullName(profile.getFullName())
			.email(profile.getEmail())
			.phone(profile.getPhone())
			.homeAddress(profile.getHomeAddress())
			.country(profile.getCountry())
			.pincode(profile.getPincode())
			.initialScreeningCompleted(profile.getInitialScreeningCompleted())
			.createdAt(profile.getCreatedAt())
			.updatedAt(profile.getUpdatedAt())
			.build();
	}
}

