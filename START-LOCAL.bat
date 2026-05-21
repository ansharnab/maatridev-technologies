@echo off
title MaatriDev - Local Dev
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo Install Node.js from https://nodejs.org/
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Installing dependencies...
  call npm install
)

echo.
echo  Local site:  http://localhost:5173/
echo  Local admin: http://localhost:5173/admin
echo  Password:    see ADMIN_PASSWORD in .env
echo.
echo  Freeing port 3001 if an old API is stuck...
call npm run free-port
echo.
echo  Keep this window OPEN while you use the site.
echo.

call npm run dev
pause
