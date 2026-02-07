# 📦 Complete Installation Guide - Mind Trap Project

## 🎯 Overview

This is a full-stack mental health application with:
- **Frontend:** React + TypeScript + Vite
- **Backend:** Java 21 + Spring Boot
- **Database:** PostgreSQL (locally hosted - NOT Supabase)
- **Package Manager:** npm/Bun

---

## ⚙️ Required Software (System-Level Dependencies)

### 1. **Java 21 (JDK)**
**Status:** ❌ NOT INSTALLED

**Why:** Required to run Spring Boot backend

**Installation:**
1. Download from: https://www.oracle.com/java/technologies/downloads/#java21
   - Or use OpenJDK: https://adoptium.net/
2. Install to default location (or remember installation path)
3. Add to system PATH (Windows should do this automatically)

**Verify Installation:**
```powershell
java -version
```
Should output: `java version "21..."` or similar

---

### 2. **PostgreSQL 12+ (Local Database)**
**Status:** ❌ NOT INSTALLED

**Why:** Stores all application data locally. Note: Supabase files exist in this project, but the actual database uses PostgreSQL running locally on your machine.

**Installation:**
1. Download from: https://www.postgresql.org/download/windows/
   - Recommended: Latest stable version (14+)
2. Run installer
3. Set superuser password (default username: `postgres`)
   - **For development, use password:** `postgres`
4. Keep default port: `5432`
5. During installation, choose to install pgAdmin 4 (useful for database management)

**Post-Installation - Create Database:**
```powershell
# Open PowerShell and connect to PostgreSQL
psql -U postgres

# In psql terminal, run:
CREATE DATABASE mindtrap;
\q
```

**Verify Installation:**
```powershell
psql --version
# Should show: psql (PostgreSQL) XX.XX
```

---

### 3. **Node.js 18+ (Frontend Runtime)**
**Status:** ❌ NOT INSTALLED

**Why:** Required for frontend development and npm package manager

**Installation:**
1. Download from: https://nodejs.org (LTS version recommended)
2. Run installer with default settings
3. Verify npm is included

**Verify Installation:**
```powershell
node -v    # Should show: v18.x.x or higher
npm -v     # Should show: 9.x.x or higher
```

---

## 📦 Project-Level Dependencies

### Frontend Dependencies
**Location:** Root directory (`package.json`)

**Installation:**
```powershell
# From project root (D:\mind-trap)
npm install
```

This installs:
- Vite (build tool)
- React & React Router
- TypeScript
- Tailwind CSS
- Shadcn UI components
- Supabase client (for auth integration)
- TanStack Query
- Form handling
- Toast notifications
- Date utilities
- And 30+ other dependencies

---

### Backend Dependencies
**Location:** Backend directory (`backend/pom.xml`)

**Installation:**
```powershell
cd backend
./mvnw clean install
```

This downloads and installs:
- Spring Boot 3.3.4
- Spring Data JPA
- Spring Security
- PostgreSQL JDBC driver
- JWT libraries
- Lombok
- MapStruct
- SpringDoc OpenAPI (Swagger)
- And all transitive dependencies

**Note:** Maven wrapper (`mvnw`) is already included, so you don't need to install Maven separately.

---

## 🚀 Post-Installation Setup

### Step 1: Environment Variables (Backend)

Create these environment variables before running the backend:

**PowerShell:**
```powershell
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/mindtrap"
$env:DATABASE_USERNAME="postgres"
$env:DATABASE_PASSWORD="postgres"
$env:JWT_SECRET="test-secret-key-for-development-minimum-256-bits-long"
```

Or use the startup script which handles this automatically.

---

### Step 2: Frontend Environment File

Create `.env` file in project root:
```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

---

### Step 3: Verify Everything

```powershell
# Check Java
java -version

# Check PostgreSQL running
psql -U postgres -d mindtrap -c "SELECT 1;"

# Check Node
node -v
npm -v

# Check frontend dependencies installed
ls node_modules
```

---

## 🎬 Starting the Application

### Option 1: Everything Together (Easiest)
```powershell
cd d:\mind-trap
.\start-all.ps1
```

### Option 2: Separate Windows
```powershell
cd d:\mind-trap
.\start-all-background.ps1
```

### Option 3: Manual
**Terminal 1 - Backend:**
```powershell
cd d:\mind-trap
.\start-backend.ps1
```

**Terminal 2 - Frontend:**
```powershell
cd d:\mind-trap
npm run dev
```

---

## ✅ Access Points Once Running

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080/api/v1
- **Swagger UI:** http://localhost:8080/api/v1/swagger-ui.html
- **Health Check:** http://localhost:8080/api/v1/health

---

## 📝 Architecture Summary

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (React)                      │
│  http://localhost:5173 - Built with Vite               │
│  Framework: React 18 + TypeScript + Tailwind            │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP Requests
                   ▼
┌─────────────────────────────────────────────────────────┐
│        Backend (Spring Boot Java 21)                    │
│  http://localhost:8080/api/v1                           │
│  Framework: Spring Boot 3.3.4 + Spring Security         │
└──────────────────┬──────────────────────────────────────┘
                   │ JDBC Connection
                   ▼
┌─────────────────────────────────────────────────────────┐
│         Database (PostgreSQL 12+)                       │
│  localhost:5432 - Database: mindtrap                    │
│  ⚠️  LOCAL DATABASE (not Supabase)                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 Important Notes

### About Supabase Files
This project contains Supabase configuration files (`/supabase` directory), but:
- ✅ Database is **PostgreSQL locally hosted**
- ✅ No cloud services needed
- ✅ Everything runs on `localhost`
- 🔒 Good for development and testing

### Database Details
- **Type:** PostgreSQL
- **Host:** localhost
- **Port:** 5432
- **Database Name:** mindtrap
- **Default User:** postgres
- **Default Password:** postgres (for development only!)

---

## 🐛 Troubleshooting

### Java not found
- Ensure Java 21 is installed
- Check PATH environment variable includes Java bin directory
- Restart terminal after installation

### PostgreSQL connection fails
- Verify PostgreSQL service is running
  ```powershell
  Get-Service postgresql-x64* | Select Status
  ```
- Check database `mindtrap` exists
  ```powershell
  psql -U postgres -l | findstr mindtrap
  ```

### npm install fails
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again
- Ensure Node.js 18+ is installed

### Port already in use
- Backend: `$env:SERVER_PORT="8081"`
- Frontend: `npm run dev -- --port 5174`

---

## 📚 Useful Commands

```powershell
# Backend
cd backend
./mvnw clean install          # Install all dependencies
./mvnw spring-boot:run        # Run backend
./mvnw test                   # Run tests

# Frontend
npm install                   # Install dependencies
npm run dev                   # Start dev server
npm run build                 # Build for production
npm run lint                  # Check code style

# Database
psql -U postgres -d mindtrap  # Connect to database
```

---

## ✨ Summary

**Must Install (System Level):**
1. ✅ Java 21 JDK
2. ✅ PostgreSQL 12+
3. ✅ Node.js 18+

**Project Setup:**
1. ✅ `npm install` (frontend)
2. ✅ Create `mindtrap` database
3. ✅ Set environment variables
4. ✅ Run `./start-all.ps1`

That's it! You're ready to develop! 🚀
