@echo off
cd /d "%~dp0"
echo Restarting API to repair logo settings...
echo.
echo 1. Stop the running "npm run dev" window (Ctrl+C)
echo 2. Start again: npm run dev
echo 3. Hard refresh browser: Ctrl+F5
echo.
echo Open http://localhost:5173/logo-maatridev.svg — you should see the MaatriDev logo.
pause
