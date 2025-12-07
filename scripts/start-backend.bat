@echo off
setlocal enabledelayedexpansion
echo.
echo ========================================
echo Starting Backend Server
echo ========================================
echo.

cd /d c:\Users\Tii\Desktop\newproject\Project_Cloud_App_2023\backend

if not exist "app\app.py" (
    echo Error: Backend application not found!
    echo Current directory: %cd%
    pause
    exit /b 1
)

echo Running from: %cd%
echo.
cd app
python app.py

pause