@echo off
title MaatriDev Website + Website Builder API
cd /d "%~dp0"

echo.
echo === MaatriDev - Site + Password-Protected Website Builder ===
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Install Node.js from https://nodejs.org/
  pause
  exit /b 1
)

if not exist "node_modules\@measured\puck\" (
  echo Installing dependencies including Puck page builder...
  call npm install
  if errorlevel 1 (
    echo npm install failed. Run INSTALL-DEPS.bat manually.
    pause
    exit /b 1
  )
)

echo.
echo Website:        http://localhost:5173/
echo Website Builder: http://localhost:5173/admin
echo Admin password:  see ADMIN_PASSWORD in .env
echo.
echo Keep this window OPEN. Press Ctrl+C to stop.
echo.

call npm run dev

pause
