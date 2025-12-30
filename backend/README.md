# Mind Trap API - Spring Boot Backend

Mental Health Companion backend API built with Spring Boot.

## Features

- JWT-based authentication (access + refresh tokens)
- User profile management
- Mental health assessments (PHQ-9, GAD-7, etc.)
- Initial screening questionnaire
- Emergency contact management
- Vital signs monitoring
- Doctor search integration
- RESTful API with OpenAPI documentation

## Tech Stack

- Java 21
- Spring Boot 3.3.4
- Spring Security (OAuth2 Resource Server)
- Spring Data JPA
- PostgreSQL
- Flyway (database migrations)
- JWT (JJWT)
- Lombok
- MapStruct
- OpenAPI/Swagger

## Setup

### Prerequisites

- Java 21+
- Maven 3.8+
- PostgreSQL 12+

### Configuration

1. Create a PostgreSQL database:
```sql
CREATE DATABASE mindtrap;
```

2. Set environment variables or update `application.yml`:
```bash
export DATABASE_URL=jdbc:postgresql://localhost:5432/mindtrap
export DATABASE_USERNAME=postgres
export DATABASE_PASSWORD=postgres
export JWT_SECRET=your-secret-key-min-256-bits
export CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173
```

3. Build and run:
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080/api/v1`

## API Documentation

Once running, access:
- Swagger UI: http://localhost:8080/api/v1/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/api/v1/v3/api-docs

## API Endpoints

See `API_CONTRACT.md` for detailed API documentation.

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout

### Profiles
- `GET /profiles/me` - Get current profile
- `PUT /profiles/me` - Update profile
- `POST /profiles/initial-screening` - Complete initial screening

### Assessments
- `GET /assessments` - List assessments
- `GET /assessments/{id}` - Get assessment details
- `POST /assessments` - Create assessment

### Emergency Contacts
- `GET /contacts` - List contacts
- `POST /contacts` - Create contact
- `PUT /contacts/{id}` - Update contact
- `DELETE /contacts/{id}` - Delete contact
- `POST /contacts/{id}/alert` - Send emergency alert

### Vital Readings
- `GET /vitals` - List readings
- `GET /vitals/{id}` - Get reading details
- `POST /vitals` - Create reading

### Doctor Search
- `GET /doctors/search` - Search doctors
- `GET /doctors/suggestions` - Get specialty suggestions

## Database Migrations

Flyway automatically runs migrations from `src/main/resources/db/migration/` on startup.

## Testing

```bash
./mvnw test
```

## Security

- JWT tokens with configurable TTL
- BCrypt password hashing
- CORS configuration
- Role-based access control (ready for expansion)




