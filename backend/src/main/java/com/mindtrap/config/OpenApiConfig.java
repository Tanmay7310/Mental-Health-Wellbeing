package com.mindtrap.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

	@Bean
	public OpenAPI mindTrapOpenAPI() {
		return new OpenAPI()
			.info(new Info()
				.title("Mind Trap API")
				.description("Backend services for the Mental Health Companion platform")
				.version("v1")
				.contact(new Contact().name("Mind Trap Team").email("support@mindtrap.com"))
				.license(new License().name("Apache 2.0").url("https://www.apache.org/licenses/LICENSE-2.0"))
			)
			.externalDocs(new ExternalDocumentation()
				.description("Frontend repo")
				.url("https://github.com/your-org/mind-trap"));
	}
}


