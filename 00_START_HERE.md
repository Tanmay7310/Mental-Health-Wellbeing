# 📋 INSTALLATION SUMMARY - What You Need to Know

## ⚡ TL;DR (Too Long; Didn't Read)

**What you must install:**
1. Java 21 JDK
2. PostgreSQL 12+
3. Node.js 18+

**Then run:**
```powershell
cd d:\mind-trap
npm install
cd backend
./mvnw clean install
cd ..
.\start-all.ps1
```

**Visit:** http://localhost:5173

Done! 🎉

---

## 📦 System Requirements (Download & Install These)

### 1. Java 21 JDK ✅ REQUIRED
- **Download:** https://www.oracle.com/java/technologies/downloads/#java21
- **Why:** Run the Spring Boot backend API
- **Check:** `java -version`
- **Status:** ❌ NOT INSTALLED (shown by your system)

### 2. PostgreSQL 12+ ✅ REQUIRED
- **Download:** https://www.postgresql.org/download/windows/
- **Why:** Database to store all application data (LOCAL, not cloud)
- **After Install:** Create database named `mindtrap`
- **Check:** `psql --version`
- **Status:** ❌ NOT INSTALLED (shown by your system)

### 3. Node.js 18+ ✅ REQUIRED
- **Download:** https://nodejs.org (LTS version)
- **Why:** Runtime for frontend development and npm package manager
- **Check:** `node -v` and `npm -v`
- **Status:** ❌ NOT INSTALLED (shown by your system)

---

## 🗂️ Project Structure Explained

```
d:\mind-trap\
│
├── Frontend Source Code (React)
│   ├── src/
│   ├── public/
│   ├── package.json          ← Frontend dependencies list
│   ├── vite.config.ts        ← Frontend build config
│   └── tsconfig.json         ← TypeScript config
│
├── Backend Source Code (Java/Spring Boot)
│   ├── backend/
│   ├── pom.xml               ← Backend dependencies list
│   ├── mvnw                  ← Maven wrapper (no install needed!)
│   └── mvnw.cmd              ← Windows Maven wrapper
│
├── Database Configuration
│   ├── supabase/             ← Config files (using local PostgreSQL instead)
│   └── application.yml       ← Spring Boot config
│
├── Quick Start Scripts
│   ├── start-all.ps1         ← Starts both frontend & backend
│   ├── start-backend.ps1     ← Starts just backend
│   └── npm run dev           ← Starts just frontend
│
└── Documentation
    ├── INSTALLATION_GUIDE.md        ← You're here!
    ├── GETTING_STARTED.md           ← Quick guide
    ├── POSTGRESQL_SETUP.md          ← Database setup
    ├── TECH_STACK_SUMMARY.md        ← Technology overview
    └── INSTALLATION_CHECKLIST.md    ← Step-by-step checklist
```

---

## 🎯 Installation Sequence

### Phase 1: System-Level Installs (Do in this order)
These are one-time installations on your Windows machine.

**Step 1A: Install Java 21**
1. Go to: https://www.oracle.com/java/technologies/downloads/#java21
2. Download Windows x64 installer
3. Run the installer
4. Follow default options
5. Restart your terminal/PowerShell

**Step 1B: Install PostgreSQL**
1. Go to: https://www.postgresql.org/download/windows/
2. Download Windows installer
3. Run installer, note the password you set (use `postgres` for dev)
4. Keep default port 5432
5. When finished, create the database:
   ```powershell
   psql -U postgres
   CREATE DATABASE mindtrap;
   \q
   ```

**Step 1C: Install Node.js**
1. Go to: https://nodejs.org (LTS recommended)
2. Download Windows installer
3. Run installer with default options
4. Restart terminal

### Phase 2: Project Dependencies (Automatic)
These are installed into the project folder.

**Step 2A: Install Frontend Dependencies**
```powershell
cd d:\mind-trap
npm install
```
Takes 2-5 minutes. Creates `node_modules` folder (~200 MB).

**Step 2B: Install Backend Dependencies**
```powershell
cd backend
./mvnw clean install
```
Takes 3-10 minutes first time. Downloads to system cache (~500 MB).

### Phase 3: Configuration
These are small setup steps.

**Step 3A: Create Environment File**
```powershell
# In d:\mind-trap, create file: .env
# Add this line:
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

---

## 🚀 Running the Application

### Easiest Way (Recommended)
```powershell
cd d:\mind-trap
.\start-all.ps1
```
- Starts backend in background
- Starts frontend in foreground
- Both run in same terminal
- Press Ctrl+C to stop both

### Alternative: Separate Windows
```powershell
cd d:\mind-trap
.\start-all-background.ps1
```
- Backend in new window
- Frontend in new window
- Close windows to stop

### Manual: Separate Terminals
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

## ✅ Verify Everything Works

### Frontend
- Open: http://localhost:5173
- Should see login screen

### Backend
- Open: http://localhost:8080/api/v1/swagger-ui.html
- Should see API documentation

### Database
```powershell
psql -U postgres -d mindtrap -c "SELECT 1;"
# Should output: 1
```

---

## 🔑 Important Concepts

### About PostgreSQL (The Database)
- ✅ **It's local** - Runs on your computer, no cloud needed
- ✅ **It's included** - Download from postgresql.org
- ✅ **It's required** - Must be running for backend to work
- ❌ **Not Supabase** - Even though supabase/ folder exists, we use local PostgreSQL

### About Maven (Backend Package Manager)
- ✅ **It's included** - `mvnw` file in backend/ handles it
- ✅ **No separate install** - Just run `./mvnw clean install`
- ✅ **It's smart** - Downloads dependencies automatically

### About npm (Frontend Package Manager)
- ✅ **It's included** - Comes with Node.js
- ✅ **Easy to use** - Just run `npm install`
- ✅ **Installs locally** - Creates node_modules in project

---

## 📊 What Gets Installed Where

| Component | Installs To | Size | Time |
|-----------|-------------|------|------|
| Java 21 JDK | C:\Program Files\Java | 350 MB | 5 min |
| PostgreSQL | C:\Program Files\PostgreSQL | 600 MB | 5 min |
| Node.js | C:\Program Files\nodejs | 200 MB | 5 min |
| Frontend packages | node_modules/ | 200 MB | 2-5 min |
| Backend packages | ~/.m2/repository (system) | 500 MB | 3-10 min |
| **Total** | **Various** | **~2 GB** | **~30 min** |

---

## 🆘 If Something Goes Wrong

### "Java not found" or "Java not recognized"
- Java 21 not installed OR
- PATH not updated yet (restart terminal after installing)

**Fix:**
1. Download Java 21 from oracle.com
2. Run installer
3. Close and reopen PowerShell
4. Try `java -version` again

### "PostgreSQL connection refused"
- PostgreSQL not running OR
- Wrong credentials

**Fix:**
1. Verify running: `Get-Service postgresql* | Select Status`
2. If stopped: `Start-Service postgresql-x64-16` (adjust version)
3. Try: `psql -U postgres -c "SELECT 1;"`

### "npm ERR! or npm WARN"
- Corrupted node_modules

**Fix:**
1. Delete `node_modules` folder
2. Delete `package-lock.json` file
3. Run: `npm install` again

### "Port 8080 already in use"
- Another application using the port

**Fix:**
```powershell
# Change backend port before running:
$env:SERVER_PORT="8081"
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/mindtrap"
$env:DATABASE_USERNAME="postgres"
$env:DATABASE_PASSWORD="postgres"
$env:JWT_SECRET="test-secret-key-for-development-minimum-256-bits-long"
# Then run backend
```

---

## 📚 Additional Resources

| Document | Purpose |
|----------|---------|
| [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) | Detailed step-by-step guide |
| [GETTING_STARTED.md](GETTING_STARTED.md) | Quick reference |
| [POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md) | Database-specific setup |
| [TECH_STACK_SUMMARY.md](TECH_STACK_SUMMARY.md) | Technology overview |
| [INSTALLATION_CHECKLIST.md](INSTALLATION_CHECKLIST.md) | Checklist format |
| [HOW_TO_RUN.md](HOW_TO_RUN.md) | How to run the app |
| [backend/TROUBLESHOOTING.md](backend/TROUBLESHOOTING.md) | Backend issues |
| [TROUBLESHOOTING_AUTH.md](TROUBLESHOOTING_AUTH.md) | Authentication issues |

---

## 🎓 Quick Reference

### Commands to Remember
```powershell
# Check Java
java -version

# Check PostgreSQL
psql --version

# Check Node
node -v

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && ./mvnw clean install && cd ..

# Run everything
.\start-all.ps1

# Run backend only
.\start-backend.ps1

# Run frontend only
npm run dev
```

### URLs to Visit
- Frontend: http://localhost:5173
- Backend: http://localhost:8080/api/v1
- API Docs: http://localhost:8080/api/v1/swagger-ui.html
- Health Check: http://localhost:8080/api/v1/health

### Database Credentials
- Host: localhost
- Port: 5432
- Database: mindtrap
- User: postgres
- Password: postgres

---

## ✨ You're All Set!

**Next Steps:**
1. ✅ Read this document (you are here!)
2. ⏭️ Follow [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) to install Java, PostgreSQL, Node.js
3. ⏭️ Run `npm install` to install frontend dependencies
4. ⏭️ Run `./mvnw clean install` in backend/ to install backend dependencies
5. ⏭️ Run `.\start-all.ps1` to start the application
6. ⏭️ Visit http://localhost:5173

**Estimated Total Time:** ~30-45 minutes (including downloads)

Good luck! 🚀
