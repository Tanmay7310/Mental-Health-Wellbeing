package com.mindtrap.web;

import com.mindtrap.dto.InitialScreeningRequest;
import com.mindtrap.dto.InitialScreeningResponse;
import com.mindtrap.dto.ProfileDto;
import com.mindtrap.dto.UpdateProfileRequest;
import com.mindtrap.security.CurrentUser;
import com.mindtrap.security.UserPrincipal;
import com.mindtrap.service.InitialScreeningService;
import com.mindtrap.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profiles")
@RequiredArgsConstructor
@Tag(name = "Profiles", description = "User profile management")
public class ProfileController {
	private final ProfileService profileService;
	private final InitialScreeningService initialScreeningService;

	@GetMapping("/me")
	@Operation(summary = "Get current user profile")
	public ProfileDto getProfile(@CurrentUser UserPrincipal user) {
		return profileService.getProfile(user.getId());
	}

	@PutMapping("/me")
	@Operation(summary = "Update current user profile")
	public ProfileDto updateProfile(
		@CurrentUser UserPrincipal user,
		@Valid @RequestBody UpdateProfileRequest request
	) {
		return profileService.updateProfile(user.getId(), request);
	}

	@PostMapping("/initial-screening")
	@Operation(summary = "Complete initial screening")
	public InitialScreeningResponse completeInitialScreening(
		@CurrentUser UserPrincipal user,
		@Valid @RequestBody InitialScreeningRequest request
	) {
		return initialScreeningService.processScreening(user.getId(), request);
	}
}


