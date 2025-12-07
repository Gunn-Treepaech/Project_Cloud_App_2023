@echo off
setlocal enabledelayedexpansion
echo.
echo ========================================
echo Starting Full Stack Development
echo ========================================
echo.

echo Starting Backend Server...
start "Backend" cmd /k "cd /d c:\Users\Tii\Desktop\newproject\Project_Cloud_App_2023\backend\app && python app.py"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend" cmd /k "cd /d c:\Users\Tii\Desktop\newproject\Project_Cloud_App_2023\frontend && npm run dev"

echo.
echo ========================================
echo Both servers started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo ========================================
echo.

pause