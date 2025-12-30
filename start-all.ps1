# Mind Trap - Unified Startup Script
# Starts both backend and frontend together

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Mind Trap - Starting All Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Always run relative to the repo root (this script's folder)
$repoRoot = $PSScriptRoot
if (-not $repoRoot) {
    $repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
}
Set-Location $repoRoot

# Check if backend is already running
Write-Host "Checking backend status..." -ForegroundColor Yellow
try {
    $backendCheck = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($backendCheck.StatusCode -eq 200) {
        Write-Host "✅ Backend is already running" -ForegroundColor Green
        $backendRunning = $true
    }
} catch {
    $backendRunning = $false
}

# Check if frontend is already running
Write-Host "Checking frontend status..." -ForegroundColor Yellow
try {
    $frontendCheck = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    if ($frontendCheck.StatusCode -eq 200) {
        Write-Host "✅ Frontend is already running" -ForegroundColor Green
        $frontendRunning = $true
    }
} catch {
    $frontendRunning = $false
}

Write-Host ""

# Start backend if not running
if (-not $backendRunning) {
    Write-Host "Starting backend..." -ForegroundColor Yellow
    
    # Set environment variables
    $env:DATABASE_URL="jdbc:postgresql://localhost:5432/mindtrap"
    $env:DATABASE_USERNAME="postgres"
    $env:DATABASE_PASSWORD="postgres"
    $env:JWT_SECRET="PhLk0QnbUf0J9IQFHuK32K6TJRShwMs8RTWq71FzSF4="
    $env:CORS_ALLOWED_ORIGINS="http://localhost:5173,http://localhost:4173"
    
    # Start backend in background
    $backendJob = Start-Job -ScriptBlock {
        Set-Location $using:repoRoot
        Set-Location "backend"
        $env:DATABASE_URL="jdbc:postgresql://localhost:5432/mindtrap"
        $env:DATABASE_USERNAME="postgres"
        $env:DATABASE_PASSWORD="postgres"
        $env:JWT_SECRET="PhLk0QnbUf0J9IQFHuK32K6TJRShwMs8RTWq71FzSF4="
        $env:CORS_ALLOWED_ORIGINS="http://localhost:5173,http://localhost:4173"
        & .\mvnw.cmd spring-boot:run 2>&1 | Out-File -FilePath (Join-Path $using:repoRoot "backend.log") -Encoding utf8
    }
    
    Write-Host "⏳ Backend starting in background..." -ForegroundColor Yellow
    Write-Host "   (Check backend.log for output)" -ForegroundColor Gray
    
    # Wait for backend to be ready
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
                Write-Host "   ✅ Backend is ready!" -ForegroundColor Green
            }
        } catch {
            # Still starting
        }
        if ($attempt % 10 -eq 0) {
            Write-Host "   Still waiting... ($attempt seconds)" -ForegroundColor Gray
        }
    }
    
    if (-not $backendReady) {
        Write-Host "   ⚠️  Backend taking longer than expected. Check backend.log" -ForegroundColor Yellow
    }
} else {
    Write-Host "Backend already running, skipping..." -ForegroundColor Gray
}

Write-Host ""

# Start frontend if not running
if (-not $frontendRunning) {
    Write-Host "Starting frontend..." -ForegroundColor Yellow
    
    # Check if .env file has API URL
    if (Test-Path (Join-Path $repoRoot ".env")) {
        $envContent = Get-Content (Join-Path $repoRoot ".env") -Raw
        if ($envContent -notmatch "VITE_API_BASE_URL") {
            Write-Host "   Adding VITE_API_BASE_URL to .env..." -ForegroundColor Gray
            Add-Content -Path (Join-Path $repoRoot ".env") -Value "`nVITE_API_BASE_URL=http://localhost:8080/api/v1"
        }
    } else {
        Write-Host "   Creating .env file..." -ForegroundColor Gray
        "VITE_API_BASE_URL=http://localhost:8080/api/v1" | Out-File -FilePath (Join-Path $repoRoot ".env") -Encoding utf8
    }
    
    Write-Host "   Frontend starting in background..." -ForegroundColor Gray
    Write-Host "   (Check frontend.log for output)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Services Starting..." -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ Backend: http://localhost:8080/api/v1" -ForegroundColor Green
    Write-Host "✅ Frontend: http://localhost:5173" -ForegroundColor Green
    Write-Host "✅ Swagger: http://localhost:8080/api/v1/swagger-ui.html" -ForegroundColor Green
    Write-Host ""

    # Start frontend in background
    $frontendJob = Start-Job -ScriptBlock {
        Set-Location $using:repoRoot
        npm run dev 2>&1 | Out-File -FilePath (Join-Path $using:repoRoot "frontend.log") -Encoding utf8
    }

    # Wait for frontend to be ready
    Write-Host "   Waiting for frontend to be ready..." -ForegroundColor Gray
    $maxAttempts = 60
    $attempt = 0
    $frontendReady = $false

    while ($attempt -lt $maxAttempts -and -not $frontendReady) {
        Start-Sleep -Seconds 1
        $attempt++
        try {
            $check = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 1 -ErrorAction SilentlyContinue
            if ($check.StatusCode -eq 200) {
                $frontendReady = $true
                Write-Host "   ✅ Frontend is ready!" -ForegroundColor Green
            }
        } catch {
            # Still starting
        }
        if ($attempt % 10 -eq 0) {
            Write-Host "   Still waiting... ($attempt seconds)" -ForegroundColor Gray
        }
    }

    if (-not $frontendReady) {
        Write-Host "   ⚠️  Frontend taking longer than expected. Check frontend.log" -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "All services started." -ForegroundColor Green
    Write-Host "To stop: run .\\stop-all.ps1" -ForegroundColor Gray
} else {
    Write-Host "Frontend already running!" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ Backend: http://localhost:8080/api/v1" -ForegroundColor Green
    Write-Host "✅ Frontend: http://localhost:5173" -ForegroundColor Green
    Write-Host ""
    Write-Host "Both services are running!" -ForegroundColor Green
}







