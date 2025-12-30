# 🚀 How to Run the Project

Simple step-by-step guide to run your Mind Trap application.

---

## 🎯 EASIEST WAY: Start Everything Together!

**One command to start both backend and frontend:**

```powershell
.\start-all.ps1
```

This will:
- ✅ Start backend in background
- ✅ Wait for backend to be ready
- ✅ Start frontend in foreground
- ✅ Keep both running together

**To stop:** Press `Ctrl+C` in the terminal

---

## 🤔 Why Are They Separate?

**Short answer:** They're different technologies that need to run as separate processes:
- **Backend:** Java/Spring Boot (runs on port 8080)
- **Frontend:** Node.js/Vite (runs on port 5173)

**But now you can start them together!** See options below.

---

## 🚀 Startup Options

### Option 1: Start Everything Together (Recommended) ⭐

**Single command:**
```powershell
.\start-all.ps1
```

**What happens:**
- Backend starts in background
- Script waits for backend to be ready
- Frontend starts in foreground
- Both run in same terminal
- Press `Ctrl+C` to stop both

### Option 2: Start in Separate Windows

**If you want separate windows:**
```powershell
.\start-all-background.ps1
```

**What happens:**
- Backend opens in new window
- Frontend opens in new window
- You can see logs from both
- Close windows to stop

### Option 3: Start Separately (Manual)

**Terminal 1 - Backend:**
```powershell
.\start-backend.ps1
```

**Terminal 2 - Frontend:**
```powershell
npm run dev
```

---

## ✅ Current Status

- ✅ **Backend:** Running at http://localhost:8080/api/v1
- ❌ **Frontend:** Not running

---

## 🎯 Quick Start (Old Method - 2 Steps)

### Step 1: Start Backend (if not running)

**Easiest way:**
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

### Step 2: Start Frontend

**Open a NEW terminal window** (keep backend running in the first one)

**Navigate to project root:**
```powershell
cd C:\Users\tanma\mind-trap
```

**Make sure .env file exists** (should already be created):
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**Start frontend:**
```bash
npm run dev
```

**Wait for:** `Local: http://localhost:5173`

---

## 🌐 Access Your Application

Once both are running:

1. **Open browser:** http://localhost:5173
2. **Register a new user** or login
3. **Start using the app!**

---

## 📋 Complete Run Instructions

### Terminal 1: Backend

```powershell
# From project root
.\start-backend.ps1
```

**Keep this terminal open!** The backend needs to keep running.

### Terminal 2: Frontend

```powershell
# From project root
npm run dev
```

**Keep this terminal open too!** The frontend needs to keep running.

---

## ✅ Verify Everything Works

### Check Backend
Open: http://localhost:8080/api/v1/health
Should show: `{"status":"UP"}`

### Check Frontend
Open: http://localhost:5173
Should show: Login/Register page

### Test API
Open: http://localhost:8080/api/v1/swagger-ui.html
Try the `/auth/register` endpoint

---

## 🛑 Stopping the Application

### If Using `start-all.ps1`:
- Press `Ctrl+C` in the terminal (stops both)

### If Using `start-all-background.ps1`:
- Close the backend window
- Close the frontend window

### If Started Separately:
**To stop backend:**
- Go to Terminal 1
- Press `Ctrl+C`

**To stop frontend:**
- Go to Terminal 2
- Press `Ctrl+C`

### Or Use Stop Script:
```powershell
.\stop-all.ps1
```
This automatically stops both services.

---

## 🔧 Troubleshooting

### Backend won't start?

**Check PostgreSQL:**
```powershell
# Check if PostgreSQL service is running
Get-Service | Where-Object {$_.Name -like "*postgres*"}
```

**Check database exists:**
```sql
-- Connect to PostgreSQL and run:
SELECT datname FROM pg_database WHERE datname = 'mindtrap';
```

### Frontend won't start?

**Check if .env file exists:**
```powershell
# Should be in project root
Get-Content .env
```

**Reinstall dependencies:**
```bash
npm install
```

### Port already in use?

**Backend (port 8080):**
- Stop other application using port 8080
- Or change port: `$env:SERVER_PORT="8081"`

**Frontend (port 5173):**
- Vite will automatically use next available port

---

## 📝 Summary

**To run the project:**

1. **Terminal 1:** `.\start-backend.ps1` (backend)
2. **Terminal 2:** `npm run dev` (frontend)
3. **Browser:** http://localhost:5173

**That's it!** 🎉

