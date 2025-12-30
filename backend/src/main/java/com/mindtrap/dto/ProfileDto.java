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
public class ProfileDto {
	private UUID id;
	private String fullName;
	private String email;
	private String phone;
	private String homeAddress;
	private String country;
	private String pincode;
	private Boolean initialScreeningCompleted;
	private Instant createdAt;
	private Instant updatedAt;
}



