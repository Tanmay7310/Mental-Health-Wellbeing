package com.mindtrap.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.mindtrap.domain.AssessmentType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateAssessmentRequest {
	@NotNull
	private AssessmentType type;

	@NotNull
	private JsonNode responses;

	@NotNull
	private Integer score;

	private String severity;
	private String diagnosis;
}



