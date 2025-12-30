package com.mindtrap.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateVitalReadingRequest {
	@NotNull
	private Integer heartRate;

	@NotNull
	private Integer bloodPressureSystolic;

	@NotNull
	private Integer bloodPressureDiastolic;

	@NotNull
	private BigDecimal oxygenSaturation;

	@NotNull
	private BigDecimal temperature;
}



