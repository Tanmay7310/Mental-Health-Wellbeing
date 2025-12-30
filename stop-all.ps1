# Mind Trap - Stop All Services

Write-Host "Stopping all Mind Trap services..." -ForegroundColor Yellow
Write-Host ""

function Stop-ProcessByPort {
    param(
        [Parameter(Mandatory = $true)][int]$Port,
        [Parameter(Mandatory = $true)][string]$Name
    )

    try {
        $conn = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -First 1
        if (-not $conn) {
            Write-Host "   $Name not running" -ForegroundColor Gray
            return
        }

        $pid = $conn.OwningProcess
        if (-not $pid) {
            Write-Host "   Could not determine PID for $Name (port $Port)" -ForegroundColor Yellow
            return
        }

        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Write-Host "✅ $Name stopped (by port)" -ForegroundColor Green
    } catch {
        Write-Host "   Failed stopping $Name (port $Port): $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Stop backend (Java/Spring Boot)
Write-Host "Stopping backend..." -ForegroundColor Yellow
Stop-ProcessByPort -Port 8080 -Name "Backend"

# Stop frontend (Node/Vite)
Write-Host "Stopping frontend..." -ForegroundColor Yellow
Stop-ProcessByPort -Port 5173 -Name "Frontend"

Write-Host ""
Write-Host "All services stopped!" -ForegroundColor Green







