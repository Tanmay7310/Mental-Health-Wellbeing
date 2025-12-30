package com.mindtrap.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
	private String phone;
	private String homeAddress;
	private String country;
	private String pincode;
}



