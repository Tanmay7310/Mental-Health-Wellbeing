package com.mindtrap.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.mindtrap.domain.Assessment;
import com.mindtrap.domain.AssessmentType;
import com.mindtrap.domain.User;
import com.mindtrap.domain.Profile;
import com.mindtrap.dto.InitialScreeningRequest;
import com.mindtrap.dto.InitialScreeningResponse;
import com.mindtrap.dto.ProfileDto;
import com.mindtrap.dto.ScreeningResult;
import com.mindtrap.repository.AssessmentRepository;
import com.mindtrap.repository.ProfileRepository;
import com.mindtrap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.Instant;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InitialScreeningService {
	private final UserRepository userRepository;
	private final AssessmentRepository assessmentRepository;
	private final ProfileRepository profileRepository;
	private static final String AGENT_LOG_PATH = "c:\\Users\\tanma\\mind-trap\\.cursor\\debug.log";
	private static final String AGENT_SESSION_ID = "debug-session";
	private static final String AGENT_RUN_ID = "pre-fix";
	private final ObjectMapper agentObjectMapper = new ObjectMapper();

	// #region agent log
	private void agentLog(String hypothesisId, String location, String message, Map<String, Object> data) {
		try {
			Map<String, Object> payload = Map.of(
				"sessionId", AGENT_SESSION_ID,
				"runId", AGENT_RUN_ID,
				"hypothesisId", hypothesisId,
				"location", location,
				"message", message,
				"data", data,
				"timestamp", Instant.now().toEpochMilli()
			);
			String json = agentObjectMapper.writeValueAsString(payload) + System.lineSeparator();
			Files.writeString(
				Paths.get(AGENT_LOG_PATH),
				json,
				StandardCharsets.UTF_8,
				StandardOpenOption.CREATE,
				StandardOpenOption.APPEND
			);
		} catch (Exception ignored) {
		}
	}
	// #endregion

	@PostConstruct
	private void logBeanInitialization() {
		Map<String, Object> data = new HashMap<>();
		data.put("userRepoNull", userRepository == null);
		data.put("assessmentRepoNull", assessmentRepository == null);
		data.put("profileRepoNull", profileRepository == null);
		agentLog("H1", "InitialScreeningService:postConstruct", "Bean initialized", data);
	}

	@Transactional
	public InitialScreeningResponse processScreening(UUID userId, InitialScreeningRequest request) {
		Map<String, Object> entryData = new HashMap<>();
		entryData.put("userId", userId);
		entryData.put("responsesType", request.getResponses() != null ? request.getResponses().getNodeType().toString() : "null");
		entryData.put("responsesSize", request.getResponses() != null && request.getResponses().isObject() ? request.getResponses().size() : null);
		agentLog("H2", "InitialScreeningService:processScreening", "Begin screening", entryData);

		User user = userRepository.findById(userId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

		ScreeningResult result = analyzeResponses(request.getResponses());

		Assessment assessment = Assessment.builder()
			.user(user)
			.assessmentType(AssessmentType.PHQ9)
			.score(result.getScore())
			.severity(result.getSeverity())
			.diagnosis(result.getDiagnosis())
			.responses(request.getResponses())
			.build();
		assessmentRepository.save(assessment);

		Map<String, Object> assessmentData = new HashMap<>();
		assessmentData.put("assessmentId", assessment.getId());
		assessmentData.put("score", result.getScore());
		assessmentData.put("severity", result.getSeverity());
		agentLog("H3", "InitialScreeningService:processScreening", "Assessment persisted", assessmentData);

		// Mark screening as completed
		Profile profile = profileRepository.findByUserId(userId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
		profile.setInitialScreeningCompleted(true);
		profile = profileRepository.save(profile);

		Map<String, Object> profileData = new HashMap<>();
		profileData.put("profileId", profile.getId());
		profileData.put("initialScreeningCompleted", profile.getInitialScreeningCompleted());
		agentLog("H3", "InitialScreeningService:processScreening", "Profile updated", profileData);

		ProfileDto profileDto = ProfileDto.builder()
			.id(profile.getId())
			.fullName(profile.getFullName())
			.email(profile.getEmail())
			.phone(profile.getPhone())
			.homeAddress(profile.getHomeAddress())
			.country(profile.getCountry())
			.pincode(profile.getPincode())
			.initialScreeningCompleted(profile.getInitialScreeningCompleted())
			.createdAt(profile.getCreatedAt())
			.updatedAt(profile.getUpdatedAt())
			.build();

		return InitialScreeningResponse.builder()
			.result(result)
			.profile(profileDto)
			.build();
	}

	private ScreeningResult analyzeResponses(JsonNode responses) {
		Map<String, Integer> categoryScores = new HashMap<>();
		final int[] totalScore = {0};

		// Map question IDs to categories (must stay in sync with frontend InitialScreening questions)
		Map<Integer, String> questionCategory = Map.ofEntries(
			Map.entry(1, "depression"),
			Map.entry(2, "anxiety"),
			Map.entry(3, "anxiety"),
			Map.entry(4, "depression"),
			Map.entry(5, "sleep"),
			Map.entry(6, "depression"),
			Map.entry(7, "anxiety"),
			Map.entry(8, "adhd"),
			Map.entry(9, "ocd"),
			Map.entry(10, "ocd"),
			Map.entry(11, "bipolar"),
			Map.entry(12, "adhd"),
			Map.entry(13, "ptsd"),
			Map.entry(14, "ptsd"),
			Map.entry(15, "depression")
		);

		// Parse responses and calculate scores
		if (responses != null && responses.isObject()) {
			responses.fields().forEachRemaining(entry -> {
				try {
					int questionId = Integer.parseInt(entry.getKey());
					int score = entry.getValue().asInt(0);
					totalScore[0] += score;

					String category = questionCategory.get(questionId);
					if (category != null) {
						categoryScores.merge(category, score, Integer::sum);
					}
				} catch (Exception ignored) {
					// Skip invalid entries
				}
			});
		}

		String severity;
		String diagnosis = "";

		if (totalScore[0] < 10) {
			severity = "Minimal symptoms";
			diagnosis = "Low risk - General wellness recommended";
		} else if (totalScore[0] < 15) {
			severity = "Mild symptoms";
		} else if (totalScore[0] < 20) {
			severity = "Moderate symptoms";
		} else {
			severity = "Severe symptoms";
		}

		// Provide a more specific diagnosis based on the strongest category score
		if (totalScore[0] >= 10 && !categoryScores.isEmpty()) {
			String primaryCategory = categoryScores.entrySet().stream()
				.max(java.util.Map.Entry.comparingByValue())
				.map(java.util.Map.Entry::getKey)
				.orElse(null);
			int primaryScore = primaryCategory != null ? categoryScores.getOrDefault(primaryCategory, 0) : 0;

			int bipolarScore = categoryScores.getOrDefault("bipolar", 0);
			int ptsdScore = categoryScores.getOrDefault("ptsd", 0);

			if ("depression".equals(primaryCategory)) {
				if (bipolarScore >= 3) {
					diagnosis = "Possible Bipolar Disorder - Further evaluation recommended";
				} else {
					diagnosis = primaryScore >= 6 ? "Possible Major Depressive Disorder" : "Mild depressive symptoms";
				}
			} else if ("anxiety".equals(primaryCategory)) {
				if (ptsdScore >= 4) {
					diagnosis = "Possible Post-Traumatic Stress Disorder (PTSD)";
				} else {
					diagnosis = primaryScore >= 6 ? "Possible Generalized Anxiety Disorder" : "Mild anxiety symptoms";
				}
			} else if ("ocd".equals(primaryCategory)) {
				diagnosis = primaryScore >= 4 ? "Possible Obsessive-Compulsive Disorder (OCD)" : "Mild OCD symptoms";
			} else if ("adhd".equals(primaryCategory)) {
				diagnosis = primaryScore >= 4 ? "Possible Attention-Deficit/Hyperactivity Disorder (ADHD)" : "Mild attention-related concerns";
			} else if ("ptsd".equals(primaryCategory)) {
				diagnosis = primaryScore >= 4 ? "Possible Post-Traumatic Stress Disorder (PTSD)" : "Mild trauma-related symptoms";
			} else if ("bipolar".equals(primaryCategory)) {
				diagnosis = primaryScore >= 3 ? "Possible Bipolar Disorder - Further evaluation recommended" : "Mild mood-related concerns";
			} else if ("sleep".equals(primaryCategory)) {
				diagnosis = "Sleep disorder screening recommended";
			}
		}

		// If diagnosis is still empty for any reason, fall back to a non-empty message
		if (diagnosis == null || diagnosis.isBlank()) {
			if (totalScore[0] < 10) {
				diagnosis = "Low risk - General wellness recommended";
			} else if (totalScore[0] < 15) {
				diagnosis = "Mild symptoms detected - Consider professional consultation";
			} else if (totalScore[0] < 20) {
				diagnosis = "Moderate symptoms - Professional evaluation recommended";
			} else {
				diagnosis = "Severe symptoms - Immediate professional help recommended";
			}
		}

		// Check for suicidal ideation (question 15, if present)
		if (responses != null && responses.has("15") && responses.get("15").asInt(0) >= 2) {
			severity = "Severe symptoms - Immediate attention required";
			diagnosis = "URGENT: Please seek immediate professional help or contact emergency services";
		}

		Map<String, Object> resultData = new HashMap<>();
		resultData.put("totalScore", totalScore[0]);
		resultData.put("severity", severity);
		resultData.put("diagnosis", diagnosis);
		agentLog("H2", "InitialScreeningService:analyzeResponses", "Responses analyzed", resultData);

		return ScreeningResult.builder()
			.score(totalScore[0])
			.severity(severity)
			.diagnosis(diagnosis)
			.build();
	}
}



