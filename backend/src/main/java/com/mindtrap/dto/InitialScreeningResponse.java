package com.mindtrap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InitialScreeningResponse {
	private ScreeningResult result;
	private ProfileDto profile;
}



