package com.mindtrap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VitalReadingDto {
	private UUID id;
	private Integer heartRate;
	private Integer bloodPressureSystolic;
	private Integer bloodPressureDiastolic;
	private BigDecimal oxygenSaturation;
	private BigDecimal temperature;
	private Boolean isEmergency;
	private Instant createdAt;
}



