package com.mindtrap.dto;

import lombok.Data;

@Data
public class DoctorSearchRequest {
	private String term;
	private Double lat;
	private Double lng;
}



