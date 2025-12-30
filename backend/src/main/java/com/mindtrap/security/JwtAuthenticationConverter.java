package com.mindtrap.security;

import com.mindtrap.domain.User;
import com.mindtrap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationConverter implements Converter<Jwt, UsernamePasswordAuthenticationToken> {
	private final UserRepository userRepository;

	@Override
	public UsernamePasswordAuthenticationToken convert(Jwt jwt) {
		String userIdStr = jwt.getSubject();
		UUID userId = UUID.fromString(userIdStr);

		User user = userRepository.findById(userId)
			.orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));

		UserPrincipal principal = UserPrincipal.create(user);
		return new UsernamePasswordAuthenticationToken(principal, jwt, principal.getAuthorities());
	}
}



