# 🎯 Installation Workflow & Flowchart

## 📊 Visual Installation Process

```
START: Installation Process
│
├─────────────────────────────────────────────────────────────────┐
│ PHASE 1: System-Level Installations (One-Time Setup)          │
│                                                                 │
│  Step 1.1: Install Java 21 JDK ✅ REQUIRED                    │
│  ├─ Download: oracle.com                                      │
│  ├─ Install: Run .exe file                                    │
│  ├─ Verify: java -version                                     │
│  └─ Wait: ~5 minutes                                          │
│      │
│      ↓
│  Step 1.2: Install PostgreSQL 12+ ✅ REQUIRED                │
│  ├─ Download: postgresql.org                                  │
│  ├─ Install: Run .exe file                                    │
│  ├─ Config: Set password (use "postgres" for dev)            │
│  ├─ Create: CREATE DATABASE mindtrap;                         │
│  ├─ Verify: psql --version                                    │
│  └─ Wait: ~5 minutes                                          │
│      │
│      ↓
│  Step 1.3: Install Node.js 18+ ✅ REQUIRED                   │
│  ├─ Download: nodejs.org (LTS)                                │
│  ├─ Install: Run .exe file                                    │
│  ├─ Verify: node -v && npm -v                                │
│  └─ Wait: ~5 minutes                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
│
├─────────────────────────────────────────────────────────────────┐
│ PHASE 2: Project Dependencies Installation                     │
│                                                                 │
│  Step 2.1: Frontend Dependencies                              │
│  ├─ Command: npm install (from project root)                 │
│  ├─ Creates: node_modules/ (~200 MB)                         │
│  ├─ Installs: React, Vite, Tailwind, etc. (100+ packages)   │
│  └─ Wait: 2-5 minutes                                        │
│      │
│      ↓
│  Step 2.2: Backend Dependencies                              │
│  ├─ Command: cd backend && ./mvnw clean install             │
│  ├─ Downloads: Spring Boot, PostgreSQL driver, etc.         │
│  ├─ Caches: ~/.m2/repository (system-wide, ~500 MB)        │
│  └─ Wait: 3-10 minutes (first time)                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
│
├─────────────────────────────────────────────────────────────────┐
│ PHASE 3: Configuration                                         │
│                                                                 │
│  Step 3.1: Create Frontend .env File                         │
│  ├─ Location: d:\mind-trap\.env                             │
│  ├─ Content: VITE_API_BASE_URL=http://localhost:8080/api/v1 │
│  └─ Time: 1 minute                                           │
│                                                                 │
│  Step 3.2: Verify PostgreSQL Running                         │
│  ├─ Check: services.msc or Get-Service postgresql*          │
│  └─ Status: Should show "Running"                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
│
├─────────────────────────────────────────────────────────────────┐
│ PHASE 4: Run Application                                       │
│                                                                 │
│  Option A: Run Everything Together (EASIEST) ⭐               │
│  └─ Command: .\start-all.ps1                                 │
│     ├─ Starts Backend (port 8080)                           │
│     ├─ Waits for Backend ready                              │
│     └─ Starts Frontend (port 5173)                          │
│                                                                 │
│  Option B: Run in Separate Windows                           │
│  └─ Command: .\start-all-background.ps1                     │
│     ├─ Backend in new window                                │
│     └─ Frontend in new window                               │
│                                                                 │
│  Option C: Run Manually in Separate Terminals               │
│  ├─ Terminal 1: .\start-backend.ps1                         │
│  └─ Terminal 2: npm run dev                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
│
└─→ SUCCESS! Application Running ✨
    ├─ Frontend: http://localhost:5173
    ├─ Backend: http://localhost:8080/api/v1
    └─ Swagger: http://localhost:8080/api/v1/swagger-ui.html
```

---

## 🔄 Service Startup Sequence

When you run the application, here's what happens:

```
User Runs: .\start-all.ps1
│
├─ Step 1: Start PostgreSQL Service
│  ├─ Check if running (should be auto-running)
│  └─ Verify connection possible
│
├─ Step 2: Start Spring Boot Backend
│  ├─ Load environment variables
│  ├─ Connect to PostgreSQL
│  ├─ Initialize JPA entities
│  ├─ Create tables if needed
│  ├─ Start Tomcat server on port 8080
│  └─ Wait for "Started MindTrapApiApplication" message
│
├─ Step 3: Start Vite Frontend Dev Server
│  ├─ Load configuration
│  ├─ Start development server on port 5173
│  ├─ Open browser to http://localhost:5173
│  └─ Ready for hot-reload on file changes
│
└─ All Running! ✅
   ├─ Frontend listening: http://localhost:5173
   ├─ Backend listening: http://localhost:8080/api/v1
   ├─ Database connected: localhost:5432
   └─ Ready for development!
```

---

## ⏱️ Time Breakdown

| Step | Time | Notes |
|------|------|-------|
| Download Java 21 | 5 min | ~350 MB |
| Install Java 21 | 5 min | Straightforward |
| Download PostgreSQL | 5 min | ~600 MB |
| Install PostgreSQL | 5 min | Include creating mindtrap database |
| Download Node.js | 3 min | ~200 MB |
| Install Node.js | 3 min | Straightforward |
| npm install | 3 min | ~200 MB locally, 100+ packages |
| ./mvnw clean install | 7 min | ~500 MB cached system-wide, first time only |
| Verify & Configure | 2 min | Create .env file, verify services |
| **TOTAL** | **~40 min** | Plus download times (depends on internet) |

**Subsequent runs:** 10 seconds (just start services!)

---

## 🗂️ Directory Changes After Installation

### Before Installation
```
d:\mind-trap\
├── backend/
├── src/
├── public/
├── supabase/
└── ... (other files)
```

### After Installation
```
d:\mind-trap\
├── backend/
│   └── target/                  ← CREATED by mvnw clean install
│       ├── classes/
│       └── mind-trap-api-0.1.0-SNAPSHOT.jar
├── node_modules/                ← CREATED by npm install (200 MB)
│   ├── react/
│   ├── vite/
│   ├── ... (100+ folders)
├── src/
├── public/
├── supabase/
├── .env                          ← CREATE MANUALLY
├── package-lock.json            ← CREATED by npm install
└── ... (other files)
```

---

## 🔗 Dependency Chain

```
User Application
│
├─ Frontend Layer (React/Vite)
│  ├─ Depends on: Node.js 18+
│  ├─ Depends on: npm (included in Node.js)
│  └─ Depends on: 100+ npm packages
│
├─ Backend Layer (Spring Boot)
│  ├─ Depends on: Java 21 JDK
│  ├─ Depends on: Maven (via mvnw, included in repo)
│  └─ Depends on: 50+ Maven packages
│
└─ Database Layer (PostgreSQL)
   ├─ Depends on: PostgreSQL 12+ server
   ├─ Depends on: TCP connection on port 5432
   └─ Depends on: Database named "mindtrap"
```

---

## ✅ Installation Checklist

```
┌─ PHASE 1: System Installations ────────────────┐
│ ☐ Java 21 JDK downloaded                      │
│ ☐ Java 21 JDK installed                       │
│ ☐ java -version works ✓                       │
│ ☐ PostgreSQL 12+ downloaded                   │
│ ☐ PostgreSQL 12+ installed                    │
│ ☐ psql --version works ✓                      │
│ ☐ CREATE DATABASE mindtrap; executed          │
│ ☐ Node.js 18+ LTS downloaded                  │
│ ☐ Node.js 18+ LTS installed                   │
│ ☐ node -v works ✓                             │
│ ☐ npm -v works ✓                              │
└───────────────────────────────────────────────┘

┌─ PHASE 2: Project Dependencies ───────────────┐
│ ☐ npm install completed (from root)           │
│ ☐ node_modules/ created (~200 MB)             │
│ ☐ backend/mvnw clean install completed        │
│ ☐ target/ folder created in backend/          │
└───────────────────────────────────────────────┘

┌─ PHASE 3: Configuration ──────────────────────┐
│ ☐ .env file created in project root           │
│ ☐ VITE_API_BASE_URL set in .env              │
│ ☐ PostgreSQL service running                  │
│ ☐ PostgreSQL mindtrap database exists         │
└───────────────────────────────────────────────┘

┌─ PHASE 4: Verification ───────────────────────┐
│ ☐ Can connect to PostgreSQL                   │
│ ☐ start-all.ps1 works                         │
│ ☐ Frontend loads at http://localhost:5173    │
│ ☐ Backend responds at http://localhost:8080  │
│ ☐ Swagger UI loads                           │
└───────────────────────────────────────────────┘
```

---

## 🚨 Critical Decision Points

### Decision 1: How to Install Java?
- ✅ **Oracle JDK** (official, recommended)
- ✅ **OpenJDK** (free, open-source, also works)
- ❌ **JRE only** (insufficient - need JDK for compilation)

**Recommendation:** Oracle JDK 21 LTS (long-term support)

### Decision 2: PostgreSQL Password?
- ✅ Development: Use `postgres` (simple, easy to remember)
- ✅ Production: Use strong password 12+ characters
- ❌ Empty password: Not recommended even for dev

**Recommendation:** `postgres` for development, change for production

### Decision 3: Node.js Version?
- ✅ Latest LTS (18.x, 20.x) - recommended
- ✅ Latest Current (21.x+) - also works
- ❌ Old versions (14.x, 16.x) - avoid

**Recommendation:** LTS version from https://nodejs.org

### Decision 4: PostgreSQL Port?
- ✅ Default 5432 (recommended)
- ❌ Custom port (only if 5432 unavailable)

**Recommendation:** Keep 5432, configure other apps if needed

---

## 🎓 What Happens During Each Install

### Java 21 Installation
1. Downloads Java Runtime Environment (JRE)
2. Downloads Java Development Kit (JDK) compiler
3. Sets JAVA_HOME environment variable
4. Adds java.exe to system PATH
5. Allows Spring Boot to compile and run

### PostgreSQL Installation
1. Installs PostgreSQL database server
2. Creates default superuser "postgres"
3. Installs psql command-line client
4. Installs pgAdmin GUI management tool
5. Starts PostgreSQL service automatically

### Node.js Installation
1. Installs Node.js runtime
2. Installs npm package manager
3. Adds node.exe and npm.cmd to PATH
4. Ready to run JavaScript/React

### npm install
1. Reads package.json dependencies list
2. Downloads 100+ packages from npm registry
3. Creates node_modules folder locally
4. Generates package-lock.json for version tracking

### ./mvnw clean install
1. Runs Maven build lifecycle
2. Downloads 50+ Java packages from Maven Central
3. Compiles Java source code
4. Runs tests
5. Creates target/classes/ with compiled code

---

## 💡 Pro Tips

1. **Restart after each system install** - Ensures PATH updates
2. **Don't delete node_modules manually** - Use `npm install` again
3. **Keep PostgreSQL running** - Should auto-start on boot
4. **Use start-all.ps1** - Much easier than manual steps
5. **Monitor first startup** - Watch for "Started MindTrapApiApplication"
6. **Check ports not used** - 5173, 8080, 5432 must be free
7. **Save credentials** - Write down PostgreSQL password somewhere safe
8. **Test immediately** - Verify services after installation

---

## 🎉 You're Ready!

**Follow the checklist above and you'll have a fully functional development environment in about 40 minutes!**

Questions? Check [00_START_HERE.md](00_START_HERE.md) for a comprehensive guide.
