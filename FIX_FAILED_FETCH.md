# 🔧 Fix "Failed to Fetch" Error

## Issues Found

1. ❌ **Frontend is NOT running** - This is the main cause
2. ⚠️ **CORS preflight blocked** - Fixed in SecurityConfig

---

## ✅ Solutions

### Solution 1: Start Frontend (REQUIRED)

**The frontend MUST be running for the app to work!**

```powershell
npm run dev
```

**Wait for:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Then open:** http://localhost:5173

---

### Solution 2: Start Everything Together

```powershell
.\start-all.ps1
```

This starts both backend and frontend together.

---

## Why "Failed to Fetch" Happens

**"Failed to fetch"** means:
- The frontend JavaScript code is trying to call the backend API
- But the frontend can't reach the backend
- Usually because:
  1. Frontend is not running ❌ (YOUR CASE)
  2. Backend is not running ❌
  3. Wrong API URL in .env ❌
  4. CORS blocking the request ⚠️

---

## Step-by-Step Fix

### Step 1: Verify Backend is Running

```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/v1/health"
```

Should return: `{"status":"UP"}`

**If not running:**
```powershell
.\start-backend.ps1
```

### Step 2: Start Frontend

```powershell
npm run dev
```

**IMPORTANT:** Keep this terminal window open! The frontend needs to keep running.

### Step 3: Open Browser

1. Go to: http://localhost:5173
2. Open DevTools (F12)
3. Go to Console tab
4. Try to sign up/login
5. Check for errors

### Step 4: Check Network Tab

1. In DevTools, go to Network tab
2. Try to sign up/login
3. Look for failed requests
4. Click on failed request to see details

---

## Common Errors in Browser Console

### "Failed to fetch"
- **Cause:** Frontend can't reach backend
- **Fix:** Make sure frontend is running (`npm run dev`)

### "CORS policy blocked"
- **Cause:** Backend blocking cross-origin requests
- **Fix:** Already fixed in SecurityConfig (OPTIONS requests now allowed)

### "Network Error"
- **Cause:** Backend not running or wrong URL
- **Fix:** Check backend is running and .env has correct URL

### "401 Unauthorized"
- **Cause:** Invalid credentials or expired token
- **Fix:** Try registering a new user

---

## Verification Checklist

✅ **Backend running**
- URL: http://localhost:8080/api/v1/health
- Returns: `{"status":"UP"}`

✅ **Frontend running**
- URL: http://localhost:5173
- Shows: Login/Register page

✅ **.env configured**
- File: `.env` in project root
- Contains: `VITE_API_BASE_URL=http://localhost:8080/api/v1`

✅ **No port conflicts**
- Port 8080: Backend
- Port 5173: Frontend

---

## Quick Test

Run this PowerShell script to test everything:

```powershell
Write-Host "Testing setup..." -ForegroundColor Cyan

# Test backend
try {
    $b = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/health" -UseBasicParsing -TimeoutSec 2
    Write-Host "✅ Backend: Running" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend: NOT running" -ForegroundColor Red
    Write-Host "   Run: .\start-backend.ps1" -ForegroundColor Yellow
}

# Test frontend
try {
    $f = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 2
    Write-Host "✅ Frontend: Running" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend: NOT running" -ForegroundColor Red
    Write-Host "   Run: npm run dev" -ForegroundColor Yellow
}

# Check .env
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "VITE_API_BASE_URL=http://localhost:8080/api/v1") {
        Write-Host "✅ .env: Configured correctly" -ForegroundColor Green
    } else {
        Write-Host "❌ .env: Missing or wrong VITE_API_BASE_URL" -ForegroundColor Red
    }
} else {
    Write-Host "❌ .env: File not found" -ForegroundColor Red
}
```

---

## Still Not Working?

1. **Check browser console** (F12 → Console tab)
   - Look for specific error messages
   - Check network requests

2. **Check backend logs**
   - If backend is running in terminal, check for errors
   - Look for stack traces

3. **Test API directly**
   ```powershell
   $body = @{
       email = "test@example.com"
       password = "test123456"
       fullName = "Test User"
   } | ConvertTo-Json
   
   Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/register" `
       -Method POST `
       -ContentType "application/json" `
       -Body $body
   ```

4. **Clear browser cache**
   - Hard refresh: Ctrl+Shift+R
   - Or clear cache and reload

---

## Summary

**The main issue:** Frontend is not running!

**The fix:** Run `npm run dev` and keep it running!

**Then:** Open http://localhost:5173 and try again.







