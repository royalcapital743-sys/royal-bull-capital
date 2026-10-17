# Royal Bull Capital — Local Full-Stack Launch Script
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "   ROYAL BULL CAPITAL — PLATFORM LAUNCHER                 " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Yellow

$BackendDir = Join-Path $PSScriptRoot "backend"
$FrontendDir = Join-Path $PSScriptRoot "frontend"

Write-Host "`n[1/3] Starting Python FastAPI Backend on http://localhost:8050..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BackendDir'; python -m uvicorn main:app --host 0.0.0.0 --port 8050 --reload"

Start-Sleep -Seconds 2

Write-Host "[2/3] Starting React Vite Frontend on http://localhost:5180..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$FrontendDir'; npm run dev"

Start-Sleep -Seconds 3

Write-Host "[3/3] Opening Royal Bull Capital in Browser..." -ForegroundColor Green
Start-Process "http://localhost:5180"

Write-Host "`n[✓] Services launched successfully!" -ForegroundColor Green
Write-Host "    - Public Website & Customer Portal: http://localhost:5180"
Write-Host "    - Backend OpenAPI Swagger Docs:     http://localhost:8050/docs"
Write-Host "`nSeed Demo Accounts:" -ForegroundColor Yellow
Write-Host "    - Admin:    admin@royalbull.com / Admin123!"
Write-Host "    - Leader:   alex@royalbull.com / Demo123! (Code: ALEX100)"
Write-Host "    - Member:   jamie@royalbull.com / Demo123!"
Write-Host "    - Member:   taylor@royalbull.com / Demo123!"
