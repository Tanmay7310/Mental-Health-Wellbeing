package com.mindtrap.service;

import com.mindtrap.dto.DoctorDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorSearchService {
	private static final List<String> SPECIALTIES = Arrays.asList(
		"Psychiatrist",
		"Psychologist",
		"Therapist",
		"Counselor",
		"Mental Health Clinic",
		"Crisis Center"
	);

	public List<DoctorDto> searchDoctors(String term, Double lat, Double lng) {
		// In a real implementation, this would integrate with Google Maps API
		// or a healthcare provider directory API
		// For now, return placeholder data
		return SPECIALTIES.stream()
			.filter(specialty -> term == null || specialty.toLowerCase().contains(term.toLowerCase()))
			.map(specialty -> DoctorDto.builder()
				.name("Sample " + specialty)
				.specialty(specialty)
				.address("Address not available - Use Google Maps search")
				.phone("Contact not available")
				.rating(4.5)
				.distance(null)
				.build())
			.collect(Collectors.toList());
	}

	public List<String> getSpecialties() {
		return SPECIALTIES;
	}
}



