# Mind Trap Backend Startup Script (PowerShell)
# This script sets environment variables and starts the Spring Boot backend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Mind Trap Backend Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set environment variables
Write-Host "Setting environment variables..." -ForegroundColor Yellow
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/mindtrap"
$env:DATABASE_USERNAME="postgres"
$env:DATABASE_PASSWORD="postgres"
$env:JWT_SECRET="test-secret-key-for-development-minimum-256-bits-long"
$env:CORS_ALLOWED_ORIGINS="http://localhost:5173,http://localhost:4173"

Write-Host "✅ Environment variables set" -ForegroundColor Green
Write-Host ""

# Check if PostgreSQL is accessible
Write-Host "Checking PostgreSQL connection..." -ForegroundColor Yellow
try {
    $pgTest = & psql -U postgres -h localhost -c "SELECT 1;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL is accessible" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Warning: Could not verify PostgreSQL connection" -ForegroundColor Yellow
        Write-Host "   Make sure PostgreSQL is running and database 'mindtrap' exists" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Warning: psql not found in PATH" -ForegroundColor Yellow
    Write-Host "   Make sure PostgreSQL is running" -ForegroundColor Yellow
}
Write-Host ""

# Start Spring Boot
Write-Host "Starting Spring Boot backend..." -ForegroundColor Yellow
Write-Host "This may take 30-60 seconds on first run..." -ForegroundColor Gray
Write-Host ""
Write-Host "Once started, access:" -ForegroundColor Cyan
Write-Host "  - Health: http://localhost:8080/api/v1/health" -ForegroundColor White
Write-Host "  - Swagger: http://localhost:8080/api/v1/swagger-ui.html" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Run Spring Boot
./mvnw spring-boot:run







