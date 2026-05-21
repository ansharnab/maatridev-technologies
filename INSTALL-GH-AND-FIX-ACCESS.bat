@echo off
cd /d "%~dp0"
echo.
echo 1) Install GitHub CLI and log in (owner account: ansharnab)
echo 2) Check repo permissions and branch protection
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\install-gh-cli.ps1"
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\check-github-access.ps1"
echo.
echo To add a user who should push directly, run:
echo   powershell -File scripts\add-collaborator.ps1 -Username THEIR_GITHUB_USERNAME
echo.
pause
