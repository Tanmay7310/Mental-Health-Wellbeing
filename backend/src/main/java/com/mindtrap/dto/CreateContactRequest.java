package com.mindtrap.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateContactRequest {
	@NotBlank
	private String name;

	@NotBlank
	private String phone;

	private String relationship;
	private Boolean isDefault;
}



