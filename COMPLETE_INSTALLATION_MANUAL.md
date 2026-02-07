# 🎯 COMPLETE INSTALLATION DOCUMENTATION - Mind Trap Project

**Date Generated:** February 4, 2026  
**Project:** Mind Trap - Mental Health Companion  
**Tech Stack:** React + Spring Boot + PostgreSQL  
**Current Status:** ✅ Documentation Complete, Ready for Installation

---

## 📊 Executive Summary

This project is a **full-stack mental health application** requiring three system-level software installations and automated package management. The database uses **PostgreSQL running locally on your machine** (NOT cloud-based Supabase).

### What You'll Install
| Software | Purpose | Download | Est. Size |
|----------|---------|----------|-----------|
| Java 21 JDK | Run Spring Boot backend | oracle.com | 350 MB |
| PostgreSQL 12+ | Local database | postgresql.org | 600 MB |
| Node.js 18+ | Frontend development & npm | nodejs.org | 200 MB |
| **Total** | **System software** | **Various** | **~1.2 GB** |

### Additional Project Dependencies (Automatic)
- Frontend: 100+ npm packages (installed to `node_modules/`)
- Backend: 50+ Maven packages (cached system-wide)

---

## 🚀 Quick Start Summary

1. **Install Java 21** from oracle.com
2. **Install PostgreSQL 12+** from postgresql.org (create `mindtrap` database)
3. **Install Node.js 18+** from nodejs.org
4. **Run:** `npm install` (in project root)
5. **Run:** `cd backend && ./mvnw clean install && cd ..`
6. **Run:** `.\start-all.ps1`
7. **Visit:** http://localhost:5173

**Estimated Time:** 40 minutes (including downloads)

---

## 📚 Documentation Files Created

### Main Setup Guides
| File | Purpose | Best For |
|------|---------|----------|
| [00_START_HERE.md](00_START_HERE.md) | Main entry point | First-time readers |
| [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) | Detailed step-by-step | Complete instructions |
| [INSTALLATION_CHECKLIST.md](INSTALLATION_CHECKLIST.md) | Checkbox format | Tracking progress |
| [INSTALLATION_WORKFLOW.md](INSTALLATION_WORKFLOW.md) | Visual flowcharts | Understanding process |

### Specialized Guides
| File | Purpose | Best For |
|------|---------|----------|
| [POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md) | Database configuration | Database-specific help |
| [TECH_STACK_SUMMARY.md](TECH_STACK_SUMMARY.md) | Technology overview | Understanding architecture |
| [GETTING_STARTED.md](GETTING_STARTED.md) | Quick reference | After installation |
| [HOW_TO_RUN.md](HOW_TO_RUN.md) | Running the app | Startup instructions |

### Existing Documentation
| File | Purpose |
|------|---------|
| [backend/SETUP.md](backend/SETUP.md) | Backend-specific setup |
| [backend/TROUBLESHOOTING.md](backend/TROUBLESHOOTING.md) | Backend issues |
| [TROUBLESHOOTING_AUTH.md](TROUBLESHOOTING_AUTH.md) | Authentication issues |
| [FIX_FAILED_FETCH.md](FIX_FAILED_FETCH.md) | API issues |

---

## 🎯 System Requirements

### Minimum (Will Work)
- Java: 21 JDK
- PostgreSQL: 12
- Node.js: 18
- RAM: 4 GB
- Disk: 3 GB available

### Recommended (Better)
- Java: 21 JDK (latest)
- PostgreSQL: 14+ (newer)
- Node.js: 20 LTS (latest stable)
- RAM: 8 GB
- Disk: 5 GB available

---

## 🗂️ Project Structure

### Frontend
```
d:\mind-trap\
├── src/                    # React component source code
├── public/                 # Static assets
├── components/             # React components
├── pages/                  # Page components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── package.json            # Frontend dependencies (100+ packages)
├── vite.config.ts          # Vite build configuration
├── tsconfig.json           # TypeScript configuration
└── index.html              # Entry HTML file
```

### Backend
```
d:\mind-trap\backend\
├── src/
│   ├── main/java/          # Spring Boot Java code
│   └── resources/          # Application config (application.yml)
├── target/                 # Compiled classes (created by mvnw)
├── pom.xml                 # Maven dependencies & build config
├── mvnw                    # Maven wrapper (execute ./mvnw instead of mvn)
├── mvnw.cmd                # Maven wrapper for Windows
└── README.md               # Backend documentation
```

### Database
```
d:\mind-trap\
├── supabase/               # Config files (local PostgreSQL used instead)
│   ├── config.toml
│   └── migrations/         # Database schema files
└── backend/
    └── src/main/resources/
        └── application.yml # Database connection config
```

---

## ⚙️ Installation Instructions

### Step 1: Install Java 21 JDK
```
1. Go to: https://www.oracle.com/java/technologies/downloads/#java21
2. Click "Download" for Windows x64 Installer
3. Run the .exe file
4. Accept license, use default installation path
5. Click "Install"
6. When complete, restart PowerShell/Command Prompt
7. Verify: java -version
```

**Expected Output:** `java version "21.x.x"`

### Step 2: Install PostgreSQL 12+
```
1. Go to: https://www.postgresql.org/download/windows/
2. Click PostgreSQL (latest version)
3. Run the .exe file
4. Accept license, use default path
5. Set Superuser Password: postgres (for development)
6. Set Port: 5432 (default)
7. Click "Install"
8. When complete, uncheck "Stack Builder" option
9. Click "Finish"
10. Verify: psql --version
11. Create database:
    - Open PowerShell
    - Run: psql -U postgres
    - Type: CREATE DATABASE mindtrap;
    - Type: \q
```

**Expected Output:** `psql (PostgreSQL) XX.X`

### Step 3: Install Node.js 18+ LTS
```
1. Go to: https://nodejs.org (click LTS version)
2. Download Windows Installer
3. Run the .exe file
4. Accept license, use default path
5. Click "Install"
6. When complete, restart PowerShell/Command Prompt
7. Verify:
   - node -v (should show v18.x or higher)
   - npm -v (should show 9.x or higher)
```

**Expected Output:**
- `v18.x.x` or higher
- `9.x.x` or higher

### Step 4: Install Frontend Dependencies
```powershell
cd d:\mind-trap
npm install
# Wait 2-5 minutes
```

**Creates:** `node_modules/` folder with 100+ packages

### Step 5: Install Backend Dependencies
```powershell
cd d:\mind-trap\backend
./mvnw clean install
cd ..
# Wait 3-10 minutes first time
```

**Creates:** `target/` folder with compiled code

### Step 6: Create Frontend Environment File
```powershell
# Create file: d:\mind-trap\.env
# Add this line:
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### Step 7: Verify Everything
```powershell
# Check Java
java -version

# Check PostgreSQL
psql -U postgres -d mindtrap -c "SELECT 1;"

# Check Node
node -v
npm -v

# Check installations
dir node_modules
ls backend\target\
```

---

## 🚀 Running the Application

### Option 1: Everything Together (RECOMMENDED ⭐)
```powershell
cd d:\mind-trap
.\start-all.ps1
```
- Starts backend, waits for it to be ready, then starts frontend
- Both run in same terminal
- Press Ctrl+C to stop both

### Option 2: Separate Windows
```powershell
cd d:\mind-trap
.\start-all-background.ps1
```
- Backend opens in new window
- Frontend opens in new window
- Close windows to stop

### Option 3: Manual (Separate Terminals)
**Terminal 1:**
```powershell
cd d:\mind-trap
.\start-backend.ps1
```

**Terminal 2:**
```powershell
cd d:\mind-trap
npm run dev
```

---

## ✅ Verification

### If Working Correctly
- Frontend: http://localhost:5173 ← Shows login screen
- Backend: http://localhost:8080/api/v1/health ← Returns `{"status":"UP"}`
- API Docs: http://localhost:8080/api/v1/swagger-ui.html ← Shows all endpoints
- Database: `psql -U postgres -d mindtrap -c "SELECT 1;"` ← Returns `1`

### What Each Port Does
- **5173:** Vite frontend dev server (React app)
- **8080:** Spring Boot backend API (Java REST endpoints)
- **5432:** PostgreSQL database (data storage)

---

## 🔑 Key Points About This Project

### PostgreSQL (Not Supabase)
✅ **What's True:**
- Database runs locally on your machine
- No cloud services needed
- Fully offline capable
- Perfect for development
- PostgreSQL 12+ installed

❌ **What's False:**
- NOT using Supabase cloud
- NOT in the cloud
- NOT internet-dependent
- Supabase folder exists but is unused

### Why PostgreSQL Instead of Supabase?
- Better for local development
- No external dependencies
- Faster iteration
- Full control
- Cheaper (no cloud costs)

### Technology Details
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS
- **Backend:** Spring Boot 3.3.4, Java 21, Spring Security, JWT
- **Database:** PostgreSQL 12+, locally hosted
- **Build Tools:** Maven (Java), npm (JavaScript)
- **Package Managers:** npm (frontend), Maven (backend)

---

## 🛠️ Useful Commands

### Verification Commands
```powershell
# Check installations
java -version
psql --version
node -v
npm -v

# Test database connection
psql -U postgres -d mindtrap -c "SELECT 1;"

# Check services running
Get-Service postgresql* | Select Status
```

### Development Commands
```powershell
# Frontend
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Check code style

# Backend
cd backend
./mvnw clean install # Install & compile
./mvnw spring-boot:run # Run backend
./mvnw test          # Run tests

# Database
psql -U postgres -d mindtrap  # Connect
\dt                           # List tables
\q                            # Quit
```

---

## 🆘 Common Issues & Solutions

### "Java not found"
**Cause:** Java not installed or PATH not updated  
**Solution:**
1. Download Java 21 from oracle.com
2. Install it
3. Close and reopen PowerShell
4. Try `java -version` again

### "PostgreSQL connection refused"
**Cause:** PostgreSQL not running or wrong credentials  
**Solution:**
1. Check: `Get-Service postgresql* | Select Status`
2. If stopped: `Start-Service postgresql-x64-16` (adjust version)
3. Verify password: `psql -U postgres -c "SELECT 1;"`

### "npm install fails"
**Cause:** Corrupted node_modules  
**Solution:**
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again

### "Port 8080 already in use"
**Cause:** Another app using the port  
**Solution:**
1. Change backend port: `$env:SERVER_PORT="8081"`
2. Or close the other app using port 8080

---

## 📊 Troubleshooting Resources

| Issue | Document |
|-------|----------|
| Backend problems | [backend/TROUBLESHOOTING.md](backend/TROUBLESHOOTING.md) |
| Authentication issues | [TROUBLESHOOTING_AUTH.md](TROUBLESHOOTING_AUTH.md) |
| API errors | [FIX_FAILED_FETCH.md](FIX_FAILED_FETCH.md) |
| Database issues | [POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md) |
| General help | [00_START_HERE.md](00_START_HERE.md) |

---

## 📈 Installation Checklist

```
SYSTEM INSTALLATIONS
☐ Java 21 JDK downloaded
☐ Java 21 JDK installed
☐ java -version works
☐ PostgreSQL 12+ downloaded
☐ PostgreSQL 12+ installed
☐ mindtrap database created
☐ psql --version works
☐ Node.js 18+ downloaded
☐ Node.js 18+ installed
☐ node -v works
☐ npm -v works

PROJECT SETUP
☐ npm install completed
☐ node_modules/ created
☐ ./mvnw clean install completed
☐ backend/target/ created
☐ .env file created
☐ VITE_API_BASE_URL set

VERIFICATION
☐ PostgreSQL running
☐ start-all.ps1 executes
☐ Backend starts successfully
☐ Frontend loads at http://localhost:5173
☐ API responds at http://localhost:8080/api/v1
☐ Database accessible

READY TO DEVELOP
☐ All checks passed
☐ Application running
☐ Ready to start development
```

---

## 📚 Learning Resources

### Official Documentation
- Java: https://docs.oracle.com/en/java/javase/21/
- Spring Boot: https://spring.io/projects/spring-boot
- PostgreSQL: https://www.postgresql.org/docs/
- React: https://react.dev
- Vite: https://vitejs.dev

### Project Documentation
- [00_START_HERE.md](00_START_HERE.md) - Start here!
- [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) - Detailed guide
- [GETTING_STARTED.md](GETTING_STARTED.md) - Quick reference
- [TECH_STACK_SUMMARY.md](TECH_STACK_SUMMARY.md) - Architecture overview

---

## ✨ Next Steps

### Immediate (Now)
1. Read [00_START_HERE.md](00_START_HERE.md)
2. Follow [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)
3. Install Java, PostgreSQL, Node.js
4. Run `npm install`
5. Run `./mvnw clean install`

### Short Term (After Setup)
1. Run `.\start-all.ps1`
2. Visit http://localhost:5173
3. Test the application
4. Create a test user account

### Long Term (Development)
1. Read existing code
2. Understand architecture
3. Make code changes
4. Test functionality
5. Deploy to production

---

## 🎉 Success Indicators

You'll know everything is installed correctly when:

✅ `java -version` shows "21"  
✅ `psql --version` shows PostgreSQL version  
✅ `node -v` shows "18" or higher  
✅ `npm install` completes without errors  
✅ `./mvnw clean install` completes without errors  
✅ `.\start-all.ps1` starts both services  
✅ http://localhost:5173 shows login screen  
✅ http://localhost:8080/api/v1/health shows UP  

**When all these are true, you're ready to develop!** 🚀

---

## 📞 Support

If you have questions:
1. Check the relevant documentation file (list above)
2. Review [00_START_HERE.md](00_START_HERE.md) for common issues
3. Check backend/TROUBLESHOOTING.md for backend-specific problems
4. Check logs in the terminal/console output

---

## 📋 Summary

| Aspect | Details |
|--------|---------|
| **Project Type** | Full-stack mental health application |
| **Languages** | Java, TypeScript, JavaScript, SQL |
| **Frameworks** | Spring Boot 3, React 18, Vite |
| **Database** | PostgreSQL 12+ (local) |
| **Dev Environment** | Windows with Java 21, Node.js 18+ |
| **Installation Time** | ~40 minutes |
| **Difficulty** | Beginner-friendly |
| **Documentation** | Comprehensive (you're reading it!) |
| **Status** | ✅ Ready to install |

---

**You're all set! Start with [00_START_HERE.md](00_START_HERE.md) and follow the installation guide.** 

**Good luck! 🚀**
