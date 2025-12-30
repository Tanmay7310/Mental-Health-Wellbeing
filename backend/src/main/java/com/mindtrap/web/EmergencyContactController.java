package com.mindtrap.web;

import com.mindtrap.dto.CreateContactRequest;
import com.mindtrap.dto.EmergencyContactDto;
import com.mindtrap.security.CurrentUser;
import com.mindtrap.security.UserPrincipal;
import com.mindtrap.service.EmergencyContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/contacts")
@RequiredArgsConstructor
@Tag(name = "Emergency Contacts", description = "Emergency contact management")
public class EmergencyContactController {
	private final EmergencyContactService contactService;

	@GetMapping
	@Operation(summary = "Get user emergency contacts")
	public List<EmergencyContactDto> getContacts(@CurrentUser UserPrincipal user) {
		return contactService.getContacts(user.getId());
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create new emergency contact")
	public EmergencyContactDto createContact(
		@CurrentUser UserPrincipal user,
		@Valid @RequestBody CreateContactRequest request
	) {
		return contactService.createContact(user.getId(), request);
	}

	@PutMapping("/{id}")
	@Operation(summary = "Update emergency contact")
	public EmergencyContactDto updateContact(
		@CurrentUser UserPrincipal user,
		@PathVariable UUID id,
		@Valid @RequestBody CreateContactRequest request
	) {
		return contactService.updateContact(user.getId(), id, request);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Delete emergency contact")
	public void deleteContact(
		@CurrentUser UserPrincipal user,
		@PathVariable UUID id
	) {
		contactService.deleteContact(user.getId(), id);
	}

	@PostMapping("/{id}/alert")
	@Operation(summary = "Send emergency alert to contact")
	public void sendEmergencyAlert(
		@CurrentUser UserPrincipal user,
		@PathVariable UUID id
	) {
		contactService.sendEmergencyAlert(user.getId(), id);
	}
}



