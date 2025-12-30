package com.mindtrap.web;

import com.mindtrap.domain.AssessmentType;
import com.mindtrap.dto.AssessmentDto;
import com.mindtrap.dto.CreateAssessmentRequest;
import com.mindtrap.security.CurrentUser;
import com.mindtrap.security.UserPrincipal;
import com.mindtrap.service.AssessmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/assessments")
@RequiredArgsConstructor
@Tag(name = "Assessments", description = "Mental health assessment management")
public class AssessmentController {
	private final AssessmentService assessmentService;

	@GetMapping
	@Operation(summary = "Get user assessments")
	public Page<AssessmentDto> getAssessments(
		@CurrentUser UserPrincipal user,
		@RequestParam(required = false) AssessmentType type,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "50") int size,
		@RequestParam(defaultValue = "createdAt") String sort,
		@RequestParam(defaultValue = "DESC") Sort.Direction direction
	) {
		Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort));
		return assessmentService.getAssessments(user.getId(), type, pageable);
	}

	@GetMapping("/{id}")
	@Operation(summary = "Get assessment by ID")
	public AssessmentDto getAssessment(
		@CurrentUser UserPrincipal user,
		@PathVariable UUID id
	) {
		return assessmentService.getAssessment(user.getId(), id);
	}

	@PostMapping
	@Operation(summary = "Create new assessment")
	public AssessmentDto createAssessment(
		@CurrentUser UserPrincipal user,
		@Valid @RequestBody CreateAssessmentRequest request
	) {
		return assessmentService.createAssessment(user.getId(), request);
	}
}



