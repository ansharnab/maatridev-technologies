@echo off
title MaatriDev - Header theme tests
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo Install Node.js from https://nodejs.org/
  pause
  exit /b 1
)

echo Running header tests in:
echo   %CD%
echo.

call npm run test:header
echo.
if errorlevel 1 (
  echo Tests FAILED.
) else (
  echo Done.
)
pause
