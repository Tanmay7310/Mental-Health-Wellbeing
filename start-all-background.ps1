# Mind Trap - Start All Services in Background
# Starts both backend and frontend in background (non-blocking)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Mind Trap - Starting All Services" -ForegroundColor Cyan
Write-Host "  (Background Mode)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set environment variables
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/mindtrap"
$env:DATABASE_USERNAME="postgres"
$env:DATABASE_PASSWORD="postgres"
$env:JWT_SECRET="test-secret-key-for-development-minimum-256-bits-long"
$env:CORS_ALLOWED_ORIGINS="http://localhost:5173,http://localhost:4173"

# Check if backend is already running
Write-Host "Checking backend..." -ForegroundColor Yellow
try {
    $backendCheck = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($backendCheck.StatusCode -eq 200) {
        Write-Host "✅ Backend already running" -ForegroundColor Green
        $backendRunning = $true
    }
} catch {
    $backendRunning = $false
}

# Start backend if not running
if (-not $backendRunning) {
    Write-Host "Starting backend in background..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; `$env:DATABASE_URL='jdbc:postgresql://localhost:5432/mindtrap'; `$env:DATABASE_USERNAME='postgres'; `$env:DATABASE_PASSWORD='postgres'; `$env:JWT_SECRET='test-secret-key-for-development-minimum-256-bits-long'; ./mvnw.cmd spring-boot:run" -WindowStyle Normal
    Write-Host "   Backend starting in new window..." -ForegroundColor Gray
    Write-Host "   Waiting for backend to be ready..." -ForegroundColor Gray
    
    $maxAttempts = 60
    $attempt = 0
    $backendReady = $false
    
    while ($attempt -lt $maxAttempts -and -not $backendReady) {
        Start-Sleep -Seconds 2
        $attempt++
        try {
            $healthCheck = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/health" -UseBasicParsing -TimeoutSec 1 -ErrorAction SilentlyContinue
            if ($healthCheck.StatusCode -eq 200) {
                $backendReady = $true
                Write-Host "   ✅ Backend ready!" -ForegroundColor Green
            }
        } catch {
            # Still starting
        }
    }
} else {
    Write-Host "✅ Backend already running" -ForegroundColor Green
}

Write-Host ""

# Check if frontend is already running
Write-Host "Checking frontend..." -ForegroundColor Yellow
try {
    $frontendCheck = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($frontendCheck.StatusCode -eq 200) {
        Write-Host "✅ Frontend already running" -ForegroundColor Green
        $frontendRunning = $true
    }
} catch {
    $frontendRunning = $false
}

# Start frontend if not running
if (-not $frontendRunning) {
    Write-Host "Starting frontend in background..." -ForegroundColor Yellow
    
    # Ensure .env file exists
    if (Test-Path ".env") {
        $envContent = Get-Content ".env" -Raw
        if ($envContent -notmatch "VITE_API_BASE_URL") {
            Add-Content -Path ".env" -Value "`nVITE_API_BASE_URL=http://localhost:8080/api/v1"
        }
    } else {
        "VITE_API_BASE_URL=http://localhost:8080/api/v1" | Out-File -FilePath ".env" -Encoding utf8
    }
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev" -WindowStyle Normal
    Write-Host "   Frontend starting in new window..." -ForegroundColor Gray
    Write-Host "   Waiting for frontend to be ready..." -ForegroundColor Gray
    
    Start-Sleep -Seconds 8
    
    Write-Host "   ✅ Frontend starting!" -ForegroundColor Green
} else {
    Write-Host "✅ Frontend already running" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  All Services Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Backend: http://localhost:8080/api/v1" -ForegroundColor Green
Write-Host "✅ Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "✅ Swagger: http://localhost:8080/api/v1/swagger-ui.html" -ForegroundColor Green
Write-Host ""
Write-Host "Both services are running in separate windows." -ForegroundColor Cyan
Write-Host "Close those windows to stop the services." -ForegroundColor Gray
Write-Host ""







