package com.mindtrap.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "vital_readings")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VitalReading {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(name = "heart_rate")
	private Integer heartRate;

	@Column(name = "blood_pressure_systolic")
	private Integer bloodPressureSystolic;

	@Column(name = "blood_pressure_diastolic")
	private Integer bloodPressureDiastolic;

	@Column(name = "oxygen_saturation", precision = 5, scale = 2)
	private BigDecimal oxygenSaturation;

	@Column(precision = 5, scale = 2)
	private BigDecimal temperature;

	@Column(name = "is_emergency")
	@Builder.Default
	private Boolean isEmergency = false;

	@CreatedDate
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;
}


