@echo off
title Install MaatriDev Website Dependencies
cd /d "%~dp0"

echo Installing npm packages (including Puck WYSIWYG editor)...
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js not found. Install from https://nodejs.org/
  pause
  exit /b 1
)

call npm install
if errorlevel 1 (
  echo.
  echo [ERROR] npm install failed.
  pause
  exit /b 1
)

echo.
echo Done. @measured/puck should now be installed.
echo Run START-FULL.bat to start the site.
echo.
pause
