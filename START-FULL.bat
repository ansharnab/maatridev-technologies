@echo off
title MaatriDev Website + API
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo Install Node.js from https://nodejs.org/
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

echo Starting frontend (5173) + API (3001)...
echo Website Builder: http://localhost:5173/admin
echo Default password: maatridev2026 (change in .env)
echo.
call npm run dev

pause
