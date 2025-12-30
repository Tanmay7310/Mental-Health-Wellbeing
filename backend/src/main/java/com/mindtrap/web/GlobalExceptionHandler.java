package com.mindtrap.web;

import com.mindtrap.dto.ApiError;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ResponseStatusException.class)
	public ResponseEntity<ApiError> handleResponseStatusException(
		ResponseStatusException ex,
		WebRequest request
	) {
		ApiError error = ApiError.builder()
			.timestamp(Instant.now())
			.status(ex.getStatusCode().value())
			.error(ex.getStatusCode().toString())
			.message(ex.getReason())
			.path(request.getDescription(false).replace("uri=", ""))
			.build();
		return ResponseEntity.status(ex.getStatusCode()).body(error);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiError> handleValidationException(
		MethodArgumentNotValidException ex,
		WebRequest request
	) {
		String message = ex.getBindingResult().getFieldErrors().stream()
			.map(FieldError::getDefaultMessage)
			.collect(Collectors.joining(", "));

		ApiError error = ApiError.builder()
			.timestamp(Instant.now())
			.status(HttpStatus.BAD_REQUEST.value())
			.error("Bad Request")
			.message("Validation failed: " + message)
			.path(request.getDescription(false).replace("uri=", ""))
			.build();
		return ResponseEntity.badRequest().body(error);
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ApiError> handleConstraintViolationException(
		ConstraintViolationException ex,
		WebRequest request
	) {
		String message = ex.getConstraintViolations().stream()
			.map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
			.collect(Collectors.joining(", "));

		ApiError error = ApiError.builder()
			.timestamp(Instant.now())
			.status(HttpStatus.BAD_REQUEST.value())
			.error("Bad Request")
			.message("Validation failed: " + message)
			.path(request.getDescription(false).replace("uri=", ""))
			.build();
		return ResponseEntity.badRequest().body(error);
	}

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<ApiError> handleBadCredentialsException(
		BadCredentialsException ex,
		WebRequest request
	) {
		ApiError error = ApiError.builder()
			.timestamp(Instant.now())
			.status(HttpStatus.UNAUTHORIZED.value())
			.error("Unauthorized")
			.message("Invalid credentials")
			.path(request.getDescription(false).replace("uri=", ""))
			.build();
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ApiError> handleAccessDeniedException(
		AccessDeniedException ex,
		WebRequest request
	) {
		ApiError error = ApiError.builder()
			.timestamp(Instant.now())
			.status(HttpStatus.FORBIDDEN.value())
			.error("Forbidden")
			.message("Access denied")
			.path(request.getDescription(false).replace("uri=", ""))
			.build();
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiError> handleGenericException(
		Exception ex,
		WebRequest request
	) {
		ApiError error = ApiError.builder()
			.timestamp(Instant.now())
			.status(HttpStatus.INTERNAL_SERVER_ERROR.value())
			.error("Internal Server Error")
			.message(ex.getMessage())
			.path(request.getDescription(false).replace("uri=", ""))
			.build();
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
	}
}




