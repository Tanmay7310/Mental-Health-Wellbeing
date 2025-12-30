# 🚀 Getting Started - Mind Trap

Quick guide to get your project up and running.

---

## ✅ Prerequisites

- **Java 21+** - For backend
- **Maven 3.8+** - For backend (included as wrapper)
- **PostgreSQL 12+** - Database (17 installed)
- **Node.js 18+** - For frontend
- **npm** - Package manager

---

## 🎯 Quick Start (3 Steps)

### Step 1: Start PostgreSQL

Make sure PostgreSQL is running and the database exists:

```sql
CREATE DATABASE mindtrap;
```

**Check if PostgreSQL is running:**
```powershell
# Windows Services
services.msc  # Look for PostgreSQL service
```

### Step 2: Start Backend

**Easiest way (from project root):**
```powershell
.\start-backend.ps1
```

**Or manually:**
```powershell
cd backend
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/mindtrap"
$env:DATABASE_USERNAME="postgres"
$env:DATABASE_PASSWORD="postgres"
$env:JWT_SECRET="test-secret-key-for-development-minimum-256-bits-long"
./mvnw spring-boot:run
```

**Wait for:** `Started MindTrapApiApplication`

### Step 3: Start Frontend

**First time only:**
```bash
npm install
```

**Create `.env` file in project root:**
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

**Start frontend:**
```bash
npm run dev
```

---

## 🌐 Access Your Application

Once both are running:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080/api/v1
- **Swagger UI:** http://localhost:8080/api/v1/swagger-ui.html
- **Health Check:** http://localhost:8080/api/v1/health

---

## 🧪 Test the API

### Option 1: Swagger UI (Recommended)

1. Open http://localhost:8080/api/v1/swagger-ui.html
2. Click on any endpoint
3. Click "Try it out"
4. Fill in the request body
5. Click "Execute"
6. See the response

### Option 2: Test Registration

**Using PowerShell:**
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
    fullName = "Test User"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/v1/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

---

## 📝 Using Startup Scripts

### Backend Startup Scripts

**From project root:**
```powershell
.\start-backend.ps1
```

**From backend folder:**
```powershell
cd backend
.\start.ps1
```

Both scripts:
- ✅ Set all required environment variables
- ✅ Check PostgreSQL connection
- ✅ Start Spring Boot
- ✅ Display helpful URLs

**To stop:** Press `Ctrl+C` in the terminal

---

## 🔧 Environment Variables

### Backend (PowerShell)

Set these before starting backend:

```powershell
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/mindtrap"
$env:DATABASE_USERNAME="postgres"
$env:DATABASE_PASSWORD="postgres"
$env:JWT_SECRET="test-secret-key-for-development-minimum-256-bits-long"
$env:CORS_ALLOWED_ORIGINS="http://localhost:5173,http://localhost:4173"
```

**Or use the startup scripts** - they set these automatically!

### Frontend (.env file)

Create `.env` in project root:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

---

## ✅ Verify Everything Works

### 1. Backend Health Check

```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/v1/health"
```

Should return: `{"status":"UP","timestamp":"..."}`

### 2. Frontend Access

Open http://localhost:5173 in browser - should see the login page

### 3. Test Registration

1. Go to http://localhost:5173
2. Click "Register"
3. Fill in email, password, full name
4. Submit
5. Should redirect to dashboard

---

## 🐛 Troubleshooting

### Backend won't start

**"Connection refused" error:**
- ✅ Check PostgreSQL is running
- ✅ Verify database `mindtrap` exists
- ✅ Check username/password are correct

**"Port 8080 already in use":**
- ✅ Stop other application using port 8080
- ✅ Or change port: `$env:SERVER_PORT="8081"`

### Frontend won't connect

**"Network error" or CORS errors:**
- ✅ Make sure backend is running
- ✅ Check `.env` file has correct API URL
- ✅ Verify CORS_ALLOWED_ORIGINS includes frontend URL

### Database errors

**"Database does not exist":**
```sql
CREATE DATABASE mindtrap;
```

**"Migration failed":**
- ✅ Check PostgreSQL version (12+ required)
- ✅ Verify user has CREATE privileges

---

## 📚 Next Steps

1. ✅ **Test API via Swagger UI** - http://localhost:8080/api/v1/swagger-ui.html
2. ✅ **Register a user** - Use frontend or Swagger
3. ✅ **Complete initial screening** - Test the questionnaire
4. ✅ **Take an assessment** - Try PHQ-9
5. ✅ **Add emergency contacts** - Test CRUD operations
6. ✅ **Monitor vitals** - Add some readings

---

## 📖 Documentation

- **API Contract:** `backend/API_CONTRACT.md`
- **Implementation Status:** `backend/IMPLEMENTATION_STATUS.md`
- **Project Status:** `PROJECT_STATUS.md`
- **Complete Overview:** `PROJECT_COMPLETE.md`
- **Troubleshooting:** `backend/TROUBLESHOOTING.md`

---

## 🎉 You're All Set!

Your Mind Trap application is now running. Start exploring the features!

**Quick Links:**
- Frontend: http://localhost:5173
- Swagger: http://localhost:8080/api/v1/swagger-ui.html
- Health: http://localhost:8080/api/v1/health







