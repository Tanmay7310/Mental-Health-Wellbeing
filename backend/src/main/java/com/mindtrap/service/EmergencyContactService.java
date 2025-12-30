package com.mindtrap.service;

import com.mindtrap.domain.EmergencyContact;
import com.mindtrap.domain.User;
import com.mindtrap.dto.CreateContactRequest;
import com.mindtrap.dto.EmergencyContactDto;
import com.mindtrap.repository.EmergencyContactRepository;
import com.mindtrap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmergencyContactService {
	private final EmergencyContactRepository contactRepository;
	private final UserRepository userRepository;

	public List<EmergencyContactDto> getContacts(UUID userId) {
		return contactRepository.findByUserIdOrderByCreatedAtDesc(userId)
			.stream()
			.map(this::toDto)
			.collect(Collectors.toList());
	}

	@Transactional
	public EmergencyContactDto createContact(UUID userId, CreateContactRequest request) {
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

		// If this is set as default, unset other defaults
		if (Boolean.TRUE.equals(request.getIsDefault())) {
			contactRepository.findByUserIdAndIsDefaultTrue(userId)
				.ifPresent(existing -> {
					existing.setIsDefault(false);
					contactRepository.save(existing);
				});
		}

		EmergencyContact contact = EmergencyContact.builder()
			.user(user)
			.name(request.getName())
			.phone(request.getPhone())
			.relationship(request.getRelationship())
			.isDefault(Boolean.TRUE.equals(request.getIsDefault()))
			.build();

		contact = contactRepository.save(contact);
		return toDto(contact);
	}

	@Transactional
	public EmergencyContactDto updateContact(UUID userId, UUID contactId, CreateContactRequest request) {
		EmergencyContact contact = contactRepository.findByIdAndUserId(contactId, userId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found"));

		if (request.getName() != null) {
			contact.setName(request.getName());
		}
		if (request.getPhone() != null) {
			contact.setPhone(request.getPhone());
		}
		if (request.getRelationship() != null) {
			contact.setRelationship(request.getRelationship());
		}
		if (request.getIsDefault() != null) {
			if (Boolean.TRUE.equals(request.getIsDefault())) {
				contactRepository.findByUserIdAndIsDefaultTrue(userId)
					.ifPresent(existing -> {
						existing.setIsDefault(false);
						contactRepository.save(existing);
					});
			}
			contact.setIsDefault(request.getIsDefault());
		}

		contact = contactRepository.save(contact);
		return toDto(contact);
	}

	@Transactional
	public void deleteContact(UUID userId, UUID contactId) {
		EmergencyContact contact = contactRepository.findByIdAndUserId(contactId, userId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found"));

		if (Boolean.TRUE.equals(contact.getIsDefault())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete default contact");
		}

		contactRepository.delete(contact);
	}

	@Transactional
	public void sendEmergencyAlert(UUID userId, UUID contactId) {
		EmergencyContact contact = contactRepository.findByIdAndUserId(contactId, userId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact not found"));

		// In a real implementation, this would trigger SMS/push notifications
		// For now, this is a placeholder
	}

	private EmergencyContactDto toDto(EmergencyContact contact) {
		return EmergencyContactDto.builder()
			.id(contact.getId())
			.name(contact.getName())
			.phone(contact.getPhone())
			.relationship(contact.getRelationship())
			.isDefault(contact.getIsDefault())
			.createdAt(contact.getCreatedAt())
			.build();
	}
}



