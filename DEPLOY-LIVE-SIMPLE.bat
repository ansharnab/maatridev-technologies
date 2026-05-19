@echo off
title Deploy MaatriDev to live server
cd /d "%~dp0"

echo === Step 1: Build ===
call npm run build
if errorlevel 1 (
  echo Build failed.
  pause
  exit /b 1
)

echo.
echo === Step 2: Push logo settings to live API ===
call node scripts/push-live-content.js
if errorlevel 1 (
  echo Content push failed. Check ADMIN_PASSWORD in .env matches live server.
)

echo.
echo === Step 3: Upload code to EC2 (manual) ===
echo You must copy this folder to your server, then on EC2 run:
echo   cd /path/to/website
echo   npm install --omit=dev
echo   npm run build
echo   pm2 restart all
echo.
echo Or run DEPLOY-LIVE.ps1 with your SSH key if you have OpenSSH.
echo.
echo Live URLs: see LIVE_URL / PUBLIC_URL in .env (admin: /admin)
echo.
pause
