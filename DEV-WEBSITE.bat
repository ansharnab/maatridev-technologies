@echo off
title MaatriDev Website (dev server)
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo Install Node.js from https://nodejs.org/
  pause
  exit /b 1
)

echo.
echo  Folder: %CD%
echo  Site:   http://localhost:5173/
echo  Admin:  http://localhost:5173/admin
echo  Password: maatridev2026
echo.

if not exist "package.json" (
  echo ERROR: package.json not found. This file must live in the website folder.
  pause
  exit /b 1
)

if not exist "node_modules\" call npm install

echo Freeing port 3001...
call npm run free-port
echo.
call npm run dev
pause
