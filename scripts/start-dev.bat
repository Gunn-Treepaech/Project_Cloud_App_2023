@echo off
setlocal enabledelayedexpansion
echo.
echo ========================================
echo Starting Development Server
echo ========================================
echo.

cd /d c:\Users\Tii\Desktop\newproject\Project_Cloud_App_2023\frontend

if not exist "package.json" (
    echo Error: package.json not found!
    echo Current directory: %cd%
    pause
    exit /b 1
)

echo Running from: %cd%
echo.
call npm run dev

pause
