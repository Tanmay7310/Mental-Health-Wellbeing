# Quick Start - Backend Setup

## ✅ Backend Compiled Successfully!

Now you need to set up PostgreSQL and start the backend.

## Step-by-Step Instructions

### 1. Start PostgreSQL

**Option A: Using Windows Services**
- Press `Windows + R`
- Type `services.msc` and press Enter
- Find `postgresql-x64-XX` (or similar PostgreSQL service)
- Right-click → **Start** (if stopped)

**Option B: Using Command Line**
```powershell
# If PostgreSQL is installed as a service
net start postgresql-x64-14  # Adjust version number
```

**Option C: Using pgAdmin**
- Open pgAdmin
- Connect to your PostgreSQL server

### 2. Create the Database

Open PostgreSQL client (psql, pgAdmin, or any SQL tool) and run:

```sql
CREATE DATABASE mindtrap;
```

**Using psql:**
```powershell
psql -U postgres
CREATE DATABASE mindtrap;
\q
```

**Using pgAdmin:**
- Right-click "Databases" → Create → Database
- Name: `mindtrap`
- Click Save

### 3. Start the Backend

Open PowerShell in the `backend` directory and run:

```powershell
cd backend

# Set environment variables
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/mindtrap"
$env:DATABASE_USERNAME="postgres"
$env:DATABASE_PASSWORD="postgres"
$env:JWT_SECRET="test-secret-key-for-development-minimum-256-bits-long"

# Start the backend
./mvnw spring-boot:run
```

### 4. Wait for Startup

You should see output like:
```
Started MindTrapApiApplication in X.XXX seconds
```

**First run takes longer** (30-60 seconds) because Flyway runs database migrations.

### 5. Verify It's Working

Once you see "Started MindTrapApiApplication", test:

- **Health Check:** http://localhost:8080/api/v1/health
  - Should return: `{"status":"UP","timestamp":"..."}`

- **Swagger UI:** http://localhost:8080/api/v1/swagger-ui.html
  - Interactive API documentation and testing

## Troubleshooting

### "Connection refused" Error
- ✅ PostgreSQL is not running → Start PostgreSQL service
- ✅ Database doesn't exist → Create `mindtrap` database
- ✅ Wrong port → Check PostgreSQL is on port 5432
- ✅ Wrong credentials → Verify username/password

### "Database does not exist" Error
```sql
CREATE DATABASE mindtrap;
```

### Port 8080 Already in Use
Change the port:
```powershell
$env:SERVER_PORT="8081"
```

### Check PostgreSQL Connection
Test if PostgreSQL is accessible:
```powershell
psql -U postgres -h localhost -c "SELECT version();"
```

## Success Indicators

✅ You'll know it's working when:
1. You see "Started MindTrapApiApplication" in the console
2. http://localhost:8080/api/v1/health returns `{"status":"UP"}`
3. Swagger UI loads at http://localhost:8080/api/v1/swagger-ui.html

## Next Steps

Once the backend is running:
1. Test API endpoints using Swagger UI
2. Start the frontend (see main README.md)
3. Connect frontend to backend using `VITE_API_BASE_URL=http://localhost:8080/api/v1`










