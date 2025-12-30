# Quick Start Guide

## Step 1: Create PostgreSQL Database

Open PostgreSQL (psql or pgAdmin) and run:
```sql
CREATE DATABASE mindtrap;
```

## Step 2: Set Environment Variables (PowerShell)

In PowerShell, run these commands:

```powershell
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/mindtrap"
$env:DATABASE_USERNAME="postgres"
$env:DATABASE_PASSWORD="postgres"
$env:JWT_SECRET="your-super-secret-key-minimum-256-bits-long-for-production-use-change-this-immediately"
```

**Important:** Replace `your-super-secret-key-minimum-256-bits-long-for-production-use-change-this-immediately` with a secure random string (at least 32 characters).

## Step 3: Run the Backend

```powershell
cd backend
./mvnw spring-boot:run
```

## Step 4: Verify It's Running

Once you see "Started MindTrapApiApplication", test:

1. **Health Check:**
   - Open browser: http://localhost:8080/api/v1/health
   - Should return: `{"status":"UP","timestamp":"..."}`

2. **Swagger UI (API Documentation):**
   - Open browser: http://localhost:8080/api/v1/swagger-ui.html
   - You can test all API endpoints here!

## Troubleshooting

### Database Connection Error?
- Make sure PostgreSQL is running
- Check database name is `mindtrap` (lowercase)
- Verify username/password are correct

### Port Already in Use?
- Change port: `$env:SERVER_PORT="8081"`
- Or stop the process using port 8080

### JWT Secret Error?
- Make sure `JWT_SECRET` is set and is at least 32 characters long










