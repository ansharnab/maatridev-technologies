@echo off
cd /d "%~dp0"
echo Pushing MaatriDev website to GitHub...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\git-push.ps1"
echo.
if exist git-push-log.txt (
  type git-push-log.txt
) else (
  echo No log file created. Run scripts\git-push.ps1 manually in PowerShell.
)
echo.
pause
