package com.mindtrap.dto;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InitialScreeningRequest {
	@NotNull
	private JsonNode responses;
}



