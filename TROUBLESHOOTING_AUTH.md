# 🔧 Troubleshooting "Failed to Fetch" Error

## Common Causes

### 1. Frontend Not Running ❌
**Symptom:** "Failed to fetch" error when trying to sign in/up

**Solution:**
```powershell
# Start frontend
npm run dev
```

**Verify:** Open http://localhost:5173 in browser

---

### 2. Backend Not Running ❌
**Symptom:** "Failed to fetch" or connection refused

**Solution:**
```powershell
# Start backend
.\start-backend.ps1
```

**Verify:** Open http://localhost:8080/api/v1/health
Should return: `{"status":"UP"}`

---

### 3. Wrong API URL in .env ❌
**Symptom:** Frontend can't connect to backend

**Solution:**
1. Check `.env` file in project root
2. Should contain:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```
3. Restart frontend after changing `.env`

---

### 4. CORS Error ❌
**Symptom:** Browser console shows CORS error

**Solution:**
Backend CORS is configured for:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:4173` (Vite preview)

Make sure frontend is running on one of these ports.

---

### 5. Backend 500 Error ❌
**Symptom:** Backend returns 500 Internal Server Error

**Common Causes:**
- Database connection issue
- Missing database tables
- Invalid JWT secret

**Solution:**
1. Check PostgreSQL is running
2. Verify database `mindtrap` exists
3. Check backend logs for specific error

---

## Quick Fix Checklist

✅ **Frontend is running**
- Check: http://localhost:5173 loads
- Fix: `npm run dev`

✅ **Backend is running**
- Check: http://localhost:8080/api/v1/health returns `{"status":"UP"}`
- Fix: `.\start-backend.ps1`

✅ **.env file configured**
- Check: `.env` file has `VITE_API_BASE_URL=http://localhost:8080/api/v1`
- Fix: Add the line to `.env` file

✅ **Database is accessible**
- Check: PostgreSQL is running
- Fix: Start PostgreSQL service

✅ **No port conflicts**
- Check: Ports 8080 and 5173 are free
- Fix: Stop other applications using these ports

---

## Step-by-Step Fix

### Step 1: Start Backend
```powershell
.\start-backend.ps1
```

Wait for: `Started MindTrapApiApplication`

### Step 2: Verify Backend
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/v1/health"
```

Should return: `{"status":"UP"}`

### Step 3: Check .env File
```powershell
Get-Content .env
```

Should contain: `VITE_API_BASE_URL=http://localhost:8080/api/v1`

### Step 4: Start Frontend
```powershell
npm run dev
```

### Step 5: Test in Browser
1. Open http://localhost:5173
2. Try to register a new user
3. Check browser console (F12) for errors

---

## Still Having Issues?

### Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Check Network tab for failed requests

### Check Backend Logs
If backend is running in a terminal, check for error messages.

### Test API Directly
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

If this works, the issue is with frontend connection.
If this fails, the issue is with backend.

---

## Common Error Messages

### "Failed to fetch"
- Frontend can't reach backend
- Check both are running
- Check .env file

### "Network Error"
- Backend not running
- Wrong API URL
- CORS issue

### "401 Unauthorized"
- Invalid credentials
- Token expired
- Try logging in again

### "500 Internal Server Error"
- Backend error
- Check backend logs
- Check database connection

---

## Quick Test Script

Run this to test everything:

```powershell
# Test backend
Write-Host "Testing backend..." -ForegroundColor Cyan
try {
    $h = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/health" -UseBasicParsing
    Write-Host "✅ Backend is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is NOT running" -ForegroundColor Red
}

# Test frontend
Write-Host "Testing frontend..." -ForegroundColor Cyan
try {
    $f = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing
    Write-Host "✅ Frontend is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend is NOT running" -ForegroundColor Red
}

# Check .env
Write-Host "Checking .env..." -ForegroundColor Cyan
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "VITE_API_BASE_URL") {
        Write-Host "✅ .env file configured" -ForegroundColor Green
    } else {
        Write-Host "❌ .env missing VITE_API_BASE_URL" -ForegroundColor Red
    }
} else {
    Write-Host "❌ .env file not found" -ForegroundColor Red
}
```







