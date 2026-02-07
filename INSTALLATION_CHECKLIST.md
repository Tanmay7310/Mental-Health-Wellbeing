# ⚡ Quick Installation Checklist

## 🎯 What You Need to Install (DO THIS FIRST)

### System-Level Requirements (Must Download & Install)

- [ ] **Java 21 JDK**
  - Download: https://www.oracle.com/java/technologies/downloads/#java21
  - Verify: `java -version` (should show "21")
  
- [ ] **PostgreSQL 12+**
  - Download: https://www.postgresql.org/download/windows/
  - Verify: `psql --version`
  - Create database: `CREATE DATABASE mindtrap;` (in psql)
  
- [ ] **Node.js 18+ (includes npm)**
  - Download: https://nodejs.org (LTS version)
  - Verify: `node -v` && `npm -v`

---

## 📦 Project-Level Dependencies (Auto-Install)

### Frontend Dependencies
```powershell
cd d:\mind-trap
npm install
```
- Installs 100+ npm packages
- Takes 2-5 minutes
- Creates `node_modules` folder

### Backend Dependencies
```powershell
cd d:\mind-trap\backend
./mvnw clean install
```
- Downloads Maven dependencies
- Compiles Java code
- Takes 3-10 minutes first time
- Uses Maven Wrapper (mvnw) - included in repo

---

## 🚀 Quick Start (After All Installs)

### Run Everything Together
```powershell
cd d:\mind-trap
.\start-all.ps1
```

### Or Run Separately
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

## ✅ Access the App

- Frontend: http://localhost:5173
- Backend: http://localhost:8080/api/v1
- Swagger: http://localhost:8080/api/v1/swagger-ui.html

---

## 🔑 Key Points

✅ **PostgreSQL is LOCAL** - Not cloud-based, runs on your machine
✅ **Supabase files exist** - But not used; PostgreSQL handles the database
✅ **Maven included** - Don't need to install separately
✅ **Everything runs on localhost** - Perfect for development

---

## ❌ Known Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Java not found" | Restart terminal after Java install |
| "Database connection failed" | Check PostgreSQL running + database exists |
| "Port 8080 already in use" | Set `$env:SERVER_PORT="8081"` before running |
| "npm install fails" | Delete `node_modules`, run again |

---

## 🆘 Need Help?

Check these files in order:
1. [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) - Detailed instructions
2. [GETTING_STARTED.md](GETTING_STARTED.md) - Quick reference
3. [HOW_TO_RUN.md](HOW_TO_RUN.md) - Running the app
4. [backend/TROUBLESHOOTING.md](backend/TROUBLESHOOTING.md) - Backend issues

---

**Current Status: Ready to Install** ✨
