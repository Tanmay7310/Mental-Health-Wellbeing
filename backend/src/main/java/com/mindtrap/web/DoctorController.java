package com.mindtrap.web;

import com.mindtrap.dto.DoctorDto;
import com.mindtrap.service.DoctorSearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors")
@RequiredArgsConstructor
@Tag(name = "Doctor Search", description = "Find mental health professionals")
public class DoctorController {
	private final DoctorSearchService doctorSearchService;

	@GetMapping("/search")
	@Operation(summary = "Search for doctors")
	public List<DoctorDto> searchDoctors(
		@RequestParam(required = false) String term,
		@RequestParam(required = false) Double lat,
		@RequestParam(required = false) Double lng
	) {
		return doctorSearchService.searchDoctors(term, lat, lng);
	}

	@GetMapping("/suggestions")
	@Operation(summary = "Get specialty suggestions")
	public List<String> getSpecialties() {
		return doctorSearchService.getSpecialties();
	}
}




