package com.mindtrap.util;

import com.mindtrap.config.security.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtUtil {
	private final JwtProperties jwtProperties;

	private SecretKey getSigningKey() {
		String secret = jwtProperties.getSecret();
		log.debug("[JWT] Signing key secret length: {} characters", secret.length());
		log.debug("[JWT] Signing key secret (first 20 chars): {}...", secret.substring(0, Math.min(20, secret.length())));
		return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
	}

	public String generateAccessToken(UUID userId, String email) {
		log.info("[JWT] Generating access token for userId: {}, email: {}", userId, email);
		Map<String, Object> claims = new HashMap<>();
		claims.put("sub", userId.toString());
		claims.put("email", email);
		
		java.time.Duration ttl = jwtProperties.getAccessTokenTtl();
		log.info("[JWT] Access token TTL: {} (minutes: {})", ttl, ttl.toMinutes());
		
		String token = createToken(claims, userId.toString(), ttl);
		log.info("[JWT] Access token generated successfully. Token length: {} chars", token.length());
		return token;
	}

	public String generateRefreshToken(UUID userId) {
		log.info("[JWT] Generating refresh token for userId: {}", userId);
		Map<String, Object> claims = new HashMap<>();
		claims.put("sub", userId.toString());
		claims.put("type", "refresh");
		// Ensure refresh tokens are always unique even if generated in the same millisecond
		claims.put("jti", UUID.randomUUID().toString());
		
		java.time.Duration ttl = jwtProperties.getRefreshTokenTtl();
		log.info("[JWT] Refresh token TTL: {} (days: {})", ttl, ttl.toDays());
		
		String token = createToken(claims, userId.toString(), ttl);
		log.info("[JWT] Refresh token generated successfully. Token length: {} chars", token.length());
		return token;
	}

	public java.time.Duration getAccessTokenTtl() {
		return jwtProperties.getAccessTokenTtl();
	}

	public java.time.Duration getRefreshTokenTtl() {
		return jwtProperties.getRefreshTokenTtl();
	}

	private String createToken(Map<String, Object> claims, String subject, java.time.Duration ttl) {
		log.debug("[JWT] Creating token with subject: {}", subject);
		Instant now = Instant.now();
		Instant expiration = now.plus(ttl);
		
		log.debug("[JWT] Token issued at: {}", new Date(now.toEpochMilli()));
		log.debug("[JWT] Token expires at: {}", new Date(expiration.toEpochMilli()));
		log.debug("[JWT] Token issuer: {}", jwtProperties.getIssuer());
		
		String token = Jwts.builder()
			.setClaims(claims)
			.setSubject(subject)
			.setIssuer(jwtProperties.getIssuer())
			.setIssuedAt(Date.from(now))
			.setExpiration(Date.from(expiration))
			// Must match SecurityConfig JwtDecoder which uses HmacSHA256 (HS256)
			.signWith(getSigningKey(), SignatureAlgorithm.HS256)
			.compact();
		
		log.debug("[JWT] Token created successfully");
		return token;
	}

	public UUID extractUserId(String token) {
		try {
			UUID userId = UUID.fromString(extractClaim(token, Claims::getSubject));
			log.debug("[JWT] Extracted userId: {}", userId);
			return userId;
		} catch (Exception e) {
			log.error("[JWT] Failed to extract userId from token", e);
			throw new JwtException("Failed to extract userId from token", e);
		}
	}

	public String extractEmail(String token) {
		try {
			String email = extractClaim(token, claims -> claims.get("email", String.class));
			log.debug("[JWT] Extracted email: {}", email);
			return email;
		} catch (Exception e) {
			log.error("[JWT] Failed to extract email from token", e);
			throw new JwtException("Failed to extract email from token", e);
		}
	}

	public Date extractExpiration(String token) {
		try {
			Date expiration = extractClaim(token, Claims::getExpiration);
			log.debug("[JWT] Extracted expiration: {}", expiration);
			return expiration;
		} catch (Exception e) {
			log.error("[JWT] Failed to extract expiration from token", e);
			throw new JwtException("Failed to extract expiration from token", e);
		}
	}

	public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
		log.debug("[JWT] Extracting claim from token");
		try {
			final Claims claims = extractAllClaims(token);
			return claimsResolver.apply(claims);
		} catch (ExpiredJwtException e) {
			log.error("[JWT] Token is expired. Expired at: {}", e.getClaims().getExpiration());
			throw e;
		} catch (JwtException e) {
			log.error("[JWT] JWT validation failed: {}", e.getMessage());
			throw e;
		} catch (Exception e) {
			log.error("[JWT] Unexpected error while extracting claim", e);
			throw new JwtException("Failed to extract claim from token", e);
		}
	}

	private Claims extractAllClaims(String token) {
		log.debug("[JWT] Parsing and validating token with signing key");
		try {
			SecretKey signingKey = getSigningKey();
			Claims claims = Jwts.parserBuilder()
				.setSigningKey(signingKey)
				.build()
				.parseClaimsJws(token)
				.getBody();
			
			log.debug("[JWT] Token successfully validated. Subject: {}, Issuer: {}", 
				claims.getSubject(), claims.getIssuer());
			return claims;
		} catch (ExpiredJwtException e) {
			log.warn("[JWT] Token is expired - issued: {}, expired: {}", 
				e.getClaims().getIssuedAt(), e.getClaims().getExpiration());
			throw e;
		} catch (io.jsonwebtoken.security.SignatureException e) {
			log.error("[JWT] Token signature validation failed - possible JWT_SECRET mismatch", e);
			throw new JwtException("Token signature validation failed - possible JWT_SECRET mismatch", e);
		} catch (io.jsonwebtoken.MalformedJwtException e) {
			log.error("[JWT] Token is malformed", e);
			throw new JwtException("Malformed token", e);
		} catch (io.jsonwebtoken.UnsupportedJwtException e) {
			log.error("[JWT] Unsupported JWT", e);
			throw new JwtException("Unsupported JWT", e);
		} catch (Exception e) {
			log.error("[JWT] Unexpected error parsing token", e);
			throw new JwtException("Failed to parse token", e);
		}
	}

	public Boolean isTokenExpired(String token) {
		try {
			Date expiration = extractExpiration(token);
			boolean expired = expiration.before(new Date());
			log.debug("[JWT] Token expiration check: expired={}, expirationTime={}", expired, expiration);
			return expired;
		} catch (ExpiredJwtException e) {
			log.warn("[JWT] Token is expired (caught ExpiredJwtException)");
			return true;
		} catch (Exception e) {
			log.error("[JWT] Error checking token expiration", e);
			return true; // Assume expired on error
		}
	}

	public Boolean validateToken(String token, UserDetails userDetails) {
		try {
			log.info("[JWT] Validating token for user: {}", userDetails.getUsername());
			final String email = extractEmail(token);
			
			if (!email.equals(userDetails.getUsername())) {
				log.warn("[JWT] Token email '{}' does not match user '{}', validation failed", 
					email, userDetails.getUsername());
				return false;
			}
			
			if (isTokenExpired(token)) {
				log.warn("[JWT] Token is expired for user: {}", userDetails.getUsername());
				return false;
			}
			
			log.info("[JWT] Token validation successful for user: {}", userDetails.getUsername());
			return true;
		} catch (Exception e) {
			log.error("[JWT] Token validation failed for user: {}", userDetails.getUsername(), e);
			return false;
		}
	}
}

