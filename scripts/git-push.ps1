$ErrorActionPreference = "Continue"
$root = "C:\Users\arnab\.cursor\projects\empty-window\website"
$log = Join-Path $root "git-push-log.txt"
Set-Location $root
"" | Set-Content $log
function Log($msg) { Add-Content $log $msg }

Log "=== git version ==="
git --version 2>&1 | ForEach-Object { Log $_ }

Log "=== toplevel ==="
git rev-parse --show-toplevel 2>&1 | ForEach-Object { Log $_ }

if (-not (Test-Path ".git")) {
  Log "=== git init ==="
  git init 2>&1 | ForEach-Object { Log $_ }
  git branch -M main 2>&1 | ForEach-Object { Log $_ }
}

Log "=== remote ==="
git remote -v 2>&1 | ForEach-Object { Log $_ }

if (-not (git remote 2>$null)) {
  git remote add origin "https://github.com/ansharnab/maatridev-technologies.git" 2>&1 | ForEach-Object { Log $_ }
}

Log "=== status ==="
git status 2>&1 | ForEach-Object { Log $_ }

git add -A 2>&1 | ForEach-Object { Log $_ }

Log "=== staged (check no .env) ==="
git diff --cached --name-only 2>&1 | ForEach-Object { Log $_ }

$hasCommit = git rev-parse HEAD 2>$null
if (-not $hasCommit) {
  Log "=== commit ==="
  git commit -m @"
Improve page builder: mobile preview, drag-drop, scroll, and save fixes.

- Click-to-edit sections with design panel (themes, colors, spacing)
- Mobile header uses hamburger menu only; responsive service cards
- Fix drag-and-drop unique IDs and canvas scrolling
- Persist header settings and section styles on save
"@ 2>&1 | ForEach-Object { Log $_ }
} else {
  Log "=== commit ==="
  git commit -m @"
Improve page builder: mobile preview, drag-drop, scroll, and save fixes.

- Click-to-edit sections with design panel (themes, colors, spacing)
- Mobile header uses hamburger menu only; responsive service cards
- Fix drag-and-drop unique IDs and canvas scrolling
- Persist header settings and section styles on save
"@ 2>&1 | ForEach-Object { Log $_ }
}

Log "=== push ==="
git push -u origin main 2>&1 | ForEach-Object { Log $_ }

if ($LASTEXITCODE -ne 0) {
  Log "=== push failed; trying gh repo create ==="
  gh repo create ansharnab/maatridev-technologies --public --source=. --remote=origin --push 2>&1 | ForEach-Object { Log $_ }
}

Log "=== done exit $LASTEXITCODE ==="
Write-Host "Log written to: $log"
Get-Content $log
