package com.mindtrap.service;

import com.mindtrap.domain.Assessment;
import com.mindtrap.domain.AssessmentType;
import com.mindtrap.domain.User;
import com.mindtrap.dto.AssessmentDto;
import com.mindtrap.dto.CreateAssessmentRequest;
import com.mindtrap.repository.AssessmentRepository;
import com.mindtrap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AssessmentService {
	private final AssessmentRepository assessmentRepository;
	private final UserRepository userRepository;

	public Page<AssessmentDto> getAssessments(UUID userId, AssessmentType type, Pageable pageable) {
		Page<Assessment> assessments = type != null
			? assessmentRepository.findByUserIdAndAssessmentType(userId, type, pageable)
			: assessmentRepository.findByUserId(userId, pageable);

		return assessments.map(this::toDto);
	}

	public AssessmentDto getAssessment(UUID userId, UUID assessmentId) {
		Assessment assessment = assessmentRepository.findById(assessmentId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assessment not found"));

		if (!assessment.getUser().getId().equals(userId)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
		}

		return toDto(assessment);
	}

	@Transactional
	public AssessmentDto createAssessment(UUID userId, CreateAssessmentRequest request) {
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

		Assessment assessment = Assessment.builder()
			.user(user)
			.assessmentType(request.getType())
			.responses(request.getResponses())
			.score(request.getScore())
			.severity(request.getSeverity())
			.diagnosis(request.getDiagnosis())
			.build();

		assessment = assessmentRepository.save(assessment);
		return toDto(assessment);
	}

	private AssessmentDto toDto(Assessment assessment) {
		return AssessmentDto.builder()
			.id(assessment.getId())
			.type(assessment.getAssessmentType())
			.score(assessment.getScore())
			.severity(assessment.getSeverity())
			.diagnosis(assessment.getDiagnosis())
			.responses(assessment.getResponses())
			.createdAt(assessment.getCreatedAt())
			.build();
	}
}



