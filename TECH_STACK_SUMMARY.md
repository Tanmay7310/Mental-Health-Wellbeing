# 🏗️ Mind Trap - Technology Stack & Installation Summary

## 📊 Complete Dependency Map

```
MIND TRAP PROJECT
│
├─── 🖥️ FRONTEND LAYER (Port 5173)
│    ├─ Runtime: Node.js 18+
│    ├─ Package Manager: npm (included with Node.js)
│    ├─ Build Tool: Vite
│    ├─ Framework: React 18 + TypeScript
│    ├─ Styling: Tailwind CSS
│    ├─ UI Components: Shadcn UI (Radix UI)
│    ├─ State Management: TanStack Query
│    ├─ Routing: React Router
│    ├─ Forms: React Hook Form
│    ├─ API Client: Axios + Supabase SDK
│    └─ Dependencies: 100+ packages in node_modules/
│
├─── 🔌 API LAYER (Port 8080)
│    ├─ Runtime: Java 21 JDK
│    ├─ Framework: Spring Boot 3.3.4
│    ├─ Build Tool: Maven (via mvnw wrapper - no install needed)
│    ├─ Security: Spring Security + JWT
│    ├─ Data Access: Spring Data JPA
│    ├─ ORM: Hibernate
│    ├─ API Documentation: SpringDoc OpenAPI (Swagger)
│    ├─ Mapping: MapStruct
│    ├─ Utilities: Lombok
│    └─ Dependencies: 50+ Maven packages
│
└─── 💾 DATABASE LAYER (Port 5432)
     ├─ Type: PostgreSQL 12+ (LOCAL)
     ├─ Database Name: mindtrap
     ├─ User: postgres
     ├─ Host: localhost
     ├─ Connection: JDBC via Spring Data JPA
     └─ Note: NOT Supabase - purely local development
```

---

## 🎯 Installation Priority (DO IN THIS ORDER)

### Priority 1️⃣ - SYSTEM LEVEL (Manual Download & Install)
These are installed on your Windows machine globally:

1. **Java 21 JDK** ← MUST HAVE FIRST
   - Download: https://www.oracle.com/java/technologies/downloads/#java21
   - Size: ~350 MB
   - Installation time: ~5 minutes
   - Verify: `java -version`

2. **PostgreSQL 12+** ← MUST HAVE SECOND
   - Download: https://www.postgresql.org/download/windows/
   - Size: ~600 MB
   - Installation time: ~5 minutes
   - Verify: `psql --version`
   - Post-install: Create database `mindtrap`

3. **Node.js 18+ LTS** ← MUST HAVE THIRD
   - Download: https://nodejs.org
   - Size: ~200 MB
   - Installation time: ~5 minutes
   - Verify: `node -v` && `npm -v`

---

### Priority 2️⃣ - PROJECT DEPENDENCIES (Automatic Install)
These are installed into project folders automatically:

**Frontend Dependencies**
```powershell
cd d:\mind-trap
npm install
```
- Location: `node_modules/` (200+ MB)
- Time: 2-5 minutes
- ~100 packages including React, Vite, Tailwind, etc.

**Backend Dependencies**
```powershell
cd d:\mind-trap\backend
./mvnw clean install
```
- Location: `~/.m2/repository/` (system-wide cache)
- Time: 3-10 minutes first time
- ~50 packages including Spring Boot, Spring Data, etc.

---

## 📋 What Each Tool Does

| Tool | Type | Purpose | Install Method |
|------|------|---------|-----------------|
| **Java 21** | System | Run Spring Boot backend | Download JDK |
| **PostgreSQL** | System | Store app data locally | Download installer |
| **Node.js** | System | Run frontend build & dev server | Download installer |
| **npm** | Tool | Manage frontend packages | Included in Node.js |
| **Maven (mvnw)** | Tool | Manage backend packages | Already in `/backend` |
| **Vite** | Package | Build & dev server for React | `npm install` |
| **React** | Package | Frontend UI library | `npm install` |
| **Spring Boot** | Package | Backend web framework | `./mvnw clean install` |
| **Tailwind** | Package | CSS utility framework | `npm install` |
| **TypeScript** | Package | Type-safe JavaScript | `npm install` |

---

## 🗂️ File Structure After Installation

```
d:\mind-trap\
├── node_modules/                    (Created by: npm install)
│   ├── react/
│   ├── vite/
│   ├── tailwindcss/
│   └── ... (100+ folders)
│
├── backend/
│   ├── target/                      (Created by: mvnw clean install)
│   │   ├── classes/                 (Compiled Java classes)
│   │   └── mind-trap-api-0.1.0-SNAPSHOT.jar
│   └── src/
│
├── src/                             (Frontend source code)
├── public/                          (Static assets)
├── components.json
├── package.json                     (Frontend dependencies list)
├── tsconfig.json
├── vite.config.ts
└── start-all.ps1                    (Quick start script)
```

---

## 🚀 Complete Installation Steps

### Step 1: Install Java 21
```powershell
# 1. Download from https://www.oracle.com/java/technologies/downloads/#java21
# 2. Run installer, use default settings
# 3. Verify:
java -version
# Expected output: java version "21.x.x"
```

### Step 2: Install PostgreSQL
```powershell
# 1. Download from https://www.postgresql.org/download/windows/
# 2. Run installer
#    - Username: postgres (default)
#    - Password: postgres (for dev only!)
#    - Port: 5432 (default)
# 3. After install, create database:
psql -U postgres
# Then in psql:
CREATE DATABASE mindtrap;
\q
# 4. Verify:
psql --version
```

### Step 3: Install Node.js
```powershell
# 1. Download from https://nodejs.org (LTS version)
# 2. Run installer with default settings
# 3. Verify:
node -v
npm -v
```

### Step 4: Install Project Dependencies
```powershell
# Frontend dependencies
cd d:\mind-trap
npm install

# Backend dependencies (takes longer first time)
cd backend
./mvnw clean install
cd ..
```

### Step 5: Create Frontend Environment File
```powershell
# Create .env file in d:\mind-trap\
# Add this line:
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### Step 6: Run the Application
```powershell
# From d:\mind-trap directory:
.\start-all.ps1

# Or manually in separate terminals:
# Terminal 1: .\start-backend.ps1
# Terminal 2: npm run dev
```

---

## 🔗 Environment Setup Reference

### Backend Environment Variables
These are set automatically by `start-backend.ps1`:
```powershell
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/mindtrap"
$env:DATABASE_USERNAME="postgres"
$env:DATABASE_PASSWORD="postgres"
$env:JWT_SECRET="test-secret-key-for-development-minimum-256-bits-long"
```

### Frontend Environment Variables
Create `.env` in project root:
```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

---

## 📡 Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Backend (Spring) | 8080 | http://localhost:8080 |
| Database (PostgreSQL) | 5432 | localhost:5432 |
| Swagger UI | 8080 | http://localhost:8080/api/v1/swagger-ui.html |

---

## ✨ Important: About Supabase

### What Exists:
- ✅ `/supabase` folder with config files
- ✅ `@supabase/supabase-js` in dependencies

### What's Actually Used:
- ✅ **PostgreSQL running locally on your machine**
- ❌ NO Supabase cloud service
- ❌ NO internet-based database
- ❌ NO Supabase authentication service

### Why Both Exist:
The project was set up to potentially use Supabase, but was adapted to use local PostgreSQL instead. This is actually better for development because:
- No cloud service needed
- Faster development
- No internet dependency
- Full control over database
- Can work offline

---

## 🎓 Technology Summary

**Frontend Stack:**
- React 18 with TypeScript
- Vite (ultra-fast build tool)
- Tailwind CSS + Shadcn UI
- Modern React patterns (hooks, React Query)

**Backend Stack:**
- Java 21 (latest LTS)
- Spring Boot 3 (latest major version)
- JWT authentication
- REST API with Swagger documentation

**Database:**
- PostgreSQL (trusted, open-source)
- Running locally for development
- JPA/Hibernate for ORM

**Overall:** Modern, scalable, production-ready tech stack! 🚀

---

## ⚠️ Troubleshooting Quick Links

See [TROUBLESHOOTING_AUTH.md](TROUBLESHOOTING_AUTH.md) for auth issues
See [backend/TROUBLESHOOTING.md](backend/TROUBLESHOOTING.md) for backend issues
See [FIX_FAILED_FETCH.md](FIX_FAILED_FETCH.md) for API issues

---

**Ready to start installing? Follow the Installation Checklist!** ✨
