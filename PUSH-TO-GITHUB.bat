@echo off
title Push MaatriDev to GitHub
cd /d "%~dp0"

where git >nul 2>&1
if errorlevel 1 (
  echo Install Git from https://git-scm.com/
  pause
  exit /b 1
)

if not exist ".git" (
  echo Initializing git repository...
  git init
  git branch -M main
)

git remote remove origin 2>nul
git remote add origin https://github.com/ansharnab/maatridev-technologies.git

if exist ".env" git rm --cached --ignore-unmatch .env 2>nul

git add -A
git status

git diff --cached --quiet
if errorlevel 1 (
  git commit -m "Add full logo CMS, video upload, admin zoom/crop, header and deploy fixes"
) else (
  echo No new changes to commit.
)

echo.
echo Pushing to GitHub...
git push -u origin main
if errorlevel 1 (
  echo.
  echo If push failed: create repo at https://github.com/ansharnab/maatridev-technologies
  echo Then sign in: gh auth login   OR use Git Credential Manager when prompted.
  echo.
)

git remote -v
git log -1 --oneline
pause
