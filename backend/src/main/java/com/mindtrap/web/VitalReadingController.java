package com.mindtrap.web;

import com.mindtrap.dto.CreateVitalReadingRequest;
import com.mindtrap.dto.VitalReadingDto;
import com.mindtrap.security.CurrentUser;
import com.mindtrap.security.UserPrincipal;
import com.mindtrap.service.VitalReadingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/vitals")
@RequiredArgsConstructor
@Tag(name = "Vital Readings", description = "Vital signs monitoring")
public class VitalReadingController {
	private final VitalReadingService vitalReadingService;

	@GetMapping
	@Operation(summary = "Get user vital readings")
	public Page<VitalReadingDto> getReadings(
		@CurrentUser UserPrincipal user,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "50") int size
	) {
		Pageable pageable = PageRequest.of(page, size);
		return vitalReadingService.getReadings(user.getId(), pageable);
	}

	@GetMapping("/{id}")
	@Operation(summary = "Get vital reading by ID")
	public VitalReadingDto getReading(
		@CurrentUser UserPrincipal user,
		@PathVariable UUID id
	) {
		return vitalReadingService.getReading(user.getId(), id);
	}

	@PostMapping
	@Operation(summary = "Create new vital reading")
	public VitalReadingDto createReading(
		@CurrentUser UserPrincipal user,
		@Valid @RequestBody CreateVitalReadingRequest request
	) {
		return vitalReadingService.createReading(user.getId(), request);
	}
}




