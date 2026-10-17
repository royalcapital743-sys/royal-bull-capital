@echo off
echo ==========================================================
echo    ROYAL BULL CAPITAL - PLATFORM LAUNCHER
echo ==========================================================

echo.
echo [1/3] Starting Python FastAPI Backend on http://localhost:8050...
start cmd /k "cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8050 --reload"

timeout /t 2 /nobreak > nul

echo [2/3] Starting React Vite Frontend on http://localhost:5180...
start cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak > nul

echo [3/3] Opening Royal Bull Capital in Browser...
start http://localhost:5180

echo.
echo Services running!
echo Front-end: http://localhost:5180
echo API Docs:  http://localhost:8050/docs
pause
