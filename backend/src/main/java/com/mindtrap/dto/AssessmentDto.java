package com.mindtrap.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.mindtrap.domain.AssessmentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentDto {
	private UUID id;
	private AssessmentType type;
	private Integer score;
	private String severity;
	private String diagnosis;
	private JsonNode responses;
	private Instant createdAt;
}



