# Run from website folder: powershell -ExecutionPolicy Bypass -File scripts\commit-push.ps1
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

$log = Join-Path $PWD "_git-agent-report.txt"
function Log($msg) { Add-Content -Path $log -Value $msg; Write-Host $msg }

Remove-Item $log -ErrorAction SilentlyContinue
$url = "https://github.com/ansharnab/maatridev-technologies.git"

Log "=== STATUS BEFORE ==="
git status 2>&1 | ForEach-Object { Log $_ }

Log "`n=== DIFF STAT ==="
git diff --stat 2>&1 | ForEach-Object { Log $_ }

$originUrl = git remote get-url origin 2>$null
if (-not $?) { git remote add origin $url; Log "Added origin" }
elseif ($originUrl -ne $url) { git remote set-url origin $url; Log "Updated origin" }

git add -A
git reset HEAD -- .env .env.* node_modules 2>$null
Get-ChildItem -Filter "_git-*.txt" -ErrorAction SilentlyContinue | ForEach-Object { git reset HEAD -- $_.Name }

Log "`n=== STAGED ==="
git diff --cached --name-only 2>&1 | ForEach-Object { Log $_ }

if (git diff --cached --quiet) {
  Log "`nNOTHING TO COMMIT"
} else {
  git commit -m @"
Fix Page Builder mobile menu and header preview.

Show hamburger drawer in-flow without clipping, fix hideBrandText and logo URLs, and improve editor header navigation.
"@
  Log "`nCOMMIT: $(git rev-parse HEAD)"
  $upstream = git rev-parse --abbrev-ref --symbolic-full-name "@{u}" 2>$null
  if ($upstream) { git push 2>&1 | ForEach-Object { Log $_ } }
  else { git push -u origin HEAD 2>&1 | ForEach-Object { Log $_ } }
}

Log "`n=== STATUS AFTER ==="
git status 2>&1 | ForEach-Object { Log $_ }

Log "`nReport: $log"
