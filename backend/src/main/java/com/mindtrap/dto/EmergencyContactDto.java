package com.mindtrap.dto;

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
public class EmergencyContactDto {
	private UUID id;
	private String name;
	private String phone;
	private String relationship;
	private Boolean isDefault;
	private Instant createdAt;
}



