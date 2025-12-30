# Troubleshooting Guide

## Common Backend Errors and Solutions

### 1. JWT Token Errors

**Error:** `java.lang.NoSuchMethodError` or `MethodNotFoundException` related to JWT

**Solution:** Updated JWT API calls to use JJWT 0.11.5 API:
- Changed `setClaims()` → `claims()`
- Changed `setSubject()` → `subject()`
- Changed `setSigningKey()` → `verifyWith()`
- Changed `parseClaimsJws()` → `parseSignedClaims()`

### 2. Circular Dependency Errors

**Error:** `BeanCurrentlyInCreationException` or circular dependency warnings

**Solution:** Removed circular dependency between `ProfileService` and `InitialScreeningService`:
- `InitialScreeningService` now uses `ProfileRepository` directly instead of `ProfileService`
- This breaks the circular dependency chain

### 3. Missing NimbusDS Dependencies

**Error:** `ClassNotFoundException: com.nimbusds.jose...`

**Solution:** Removed unused `JwtEncoder` bean from `SecurityConfig`:
- We use JJWT for token creation (in `JwtUtil`)
- Spring Security OAuth2 Resource Server handles token validation automatically
- The `spring-boot-starter-oauth2-resource-server` dependency includes NimbusDS

### 4. Database Migration Errors

**Error:** `FlywayException` or migration failures

**Solutions:**
- Ensure PostgreSQL 12+ is installed
- Check database connection in `application.yml`
- Verify `gen_random_uuid()` is available (PostgreSQL 13+)
- If using older PostgreSQL, replace `gen_random_uuid()` with `uuid_generate_v4()` and enable extension:
  ```sql
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  ```

### 5. JWT Secret Key Errors

**Error:** `IllegalArgumentException: secret key byte array cannot be null or empty`

**Solution:** Set `JWT_SECRET` environment variable:
```bash
export JWT_SECRET=your-secret-key-minimum-256-bits-long-for-security
```

Or update `application.yml`:
```yaml
jwt:
  secret: your-secret-key-minimum-256-bits-long-for-security
```

### 6. CORS Errors

**Error:** CORS policy errors in browser console

**Solution:** Check `application.yml` CORS configuration:
```yaml
cors:
  allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:5173,http://localhost:4173}
```

Ensure frontend URL matches the allowed origins.

### 7. Port Already in Use

**Error:** `Port 8080 is already in use`

**Solution:** Change port in `application.yml`:
```yaml
server:
  port: ${SERVER_PORT:8081}
```

Or stop the process using port 8080.

### 8. Database Connection Errors

**Error:** `Connection refused` or `FATAL: database "mindtrap" does not exist`

**Solutions:**
1. Create database:
   ```sql
   CREATE DATABASE mindtrap;
   ```

2. Check connection settings in `application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/mindtrap
       username: postgres
       password: postgres
   ```

3. Verify PostgreSQL is running:
   ```bash
   # Linux/Mac
   sudo systemctl status postgresql
   
   # Windows
   # Check Services panel
   ```

### 9. Compilation Errors

**Error:** Maven compilation failures

**Solutions:**
1. Clean and rebuild:
   ```bash
   cd backend
   ./mvnw clean install
   ```

2. Check Java version (must be 21+):
   ```bash
   java -version
   ```

3. Update Maven wrapper if needed:
   ```bash
   ./mvnw wrapper:wrapper
   ```

### 10. Missing Dependencies

**Error:** `ClassNotFoundException` or `NoClassDefFoundError`

**Solution:** Ensure all dependencies are downloaded:
```bash
cd backend
./mvnw dependency:resolve
./mvnw clean install
```

## Running the Backend

1. **Set environment variables:**
   ```bash
   export DATABASE_URL=jdbc:postgresql://localhost:5432/mindtrap
   export DATABASE_USERNAME=postgres
   export DATABASE_PASSWORD=postgres
   export JWT_SECRET=your-secret-key-minimum-256-bits
   ```

2. **Start PostgreSQL** (if not running)

3. **Run the application:**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

4. **Verify it's running:**
   - Health check: http://localhost:8080/api/v1/health
   - Swagger UI: http://localhost:8080/api/v1/swagger-ui.html

## Still Having Issues?

1. Check application logs in console output
2. Verify all environment variables are set
3. Ensure database is accessible
4. Check Java version compatibility
5. Review Spring Boot version compatibility










