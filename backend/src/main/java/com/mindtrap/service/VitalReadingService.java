package com.mindtrap.service;

import com.mindtrap.domain.User;
import com.mindtrap.domain.VitalReading;
import com.mindtrap.dto.CreateVitalReadingRequest;
import com.mindtrap.dto.VitalReadingDto;
import com.mindtrap.repository.UserRepository;
import com.mindtrap.repository.VitalReadingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VitalReadingService {
	private final VitalReadingRepository vitalReadingRepository;
	private final UserRepository userRepository;

	public Page<VitalReadingDto> getReadings(UUID userId, Pageable pageable) {
		return vitalReadingRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
			.map(this::toDto);
	}

	public VitalReadingDto getReading(UUID userId, UUID readingId) {
		VitalReading reading = vitalReadingRepository.findById(readingId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reading not found"));

		if (!reading.getUser().getId().equals(userId)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
		}

		return toDto(reading);
	}

	@Transactional
	public VitalReadingDto createReading(UUID userId, CreateVitalReadingRequest request) {
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

		// Determine if this is an emergency based on vital thresholds
		boolean isEmergency = isEmergencyReading(request);

		VitalReading reading = VitalReading.builder()
			.user(user)
			.heartRate(request.getHeartRate())
			.bloodPressureSystolic(request.getBloodPressureSystolic())
			.bloodPressureDiastolic(request.getBloodPressureDiastolic())
			.oxygenSaturation(request.getOxygenSaturation())
			.temperature(request.getTemperature())
			.isEmergency(isEmergency)
			.build();

		reading = vitalReadingRepository.save(reading);
		return toDto(reading);
	}

	private boolean isEmergencyReading(CreateVitalReadingRequest request) {
		// Basic emergency thresholds
		return (request.getHeartRate() != null && (request.getHeartRate() < 50 || request.getHeartRate() > 120))
			|| (request.getBloodPressureSystolic() != null && request.getBloodPressureSystolic() > 180)
			|| (request.getBloodPressureDiastolic() != null && request.getBloodPressureDiastolic() > 120)
			|| (request.getOxygenSaturation() != null && request.getOxygenSaturation().doubleValue() < 90)
			|| (request.getTemperature() != null && (request.getTemperature().doubleValue() < 95 || request.getTemperature().doubleValue() > 104));
	}

	private VitalReadingDto toDto(VitalReading reading) {
		return VitalReadingDto.builder()
			.id(reading.getId())
			.heartRate(reading.getHeartRate())
			.bloodPressureSystolic(reading.getBloodPressureSystolic())
			.bloodPressureDiastolic(reading.getBloodPressureDiastolic())
			.oxygenSaturation(reading.getOxygenSaturation())
			.temperature(reading.getTemperature())
			.isEmergency(reading.getIsEmergency())
			.createdAt(reading.getCreatedAt())
			.build();
	}
}



