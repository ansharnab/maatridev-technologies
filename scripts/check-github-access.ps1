# Diagnose GitHub repo access and branch protection (run locally)
$ErrorActionPreference = "Continue"
$repo = "ansharnab/maatridev-technologies"
$log = Join-Path $PSScriptRoot "..\github-access-log.txt"
"" | Set-Content $log
function Log($m) { Add-Content $log $m; Write-Host $m }

Log "=== gh version ==="
gh --version 2>&1 | ForEach-Object { Log $_ }

Log "=== gh auth status ==="
gh auth status 2>&1 | ForEach-Object { Log $_ }

Log "=== repo view ==="
gh repo view $repo --json name,isPrivate,visibility,defaultBranchRef,viewerPermission,hasIssuesEnabled,hasWikiEnabled 2>&1 | ForEach-Object { Log $_ }

Log "=== collaborators (requires admin) ==="
gh api "repos/$repo/collaborators" --jq '.[].login' 2>&1 | ForEach-Object { Log $_ }

Log "=== branch protection on main ==="
gh api "repos/$repo/branches/main/protection" 2>&1 | ForEach-Object { Log $_ }

Log "=== repo actions permissions (sample) ==="
gh api "repos/$repo" --jq '{private, visibility, permissions: .permissions, allow_forking, allow_squash_merge}' 2>&1 | ForEach-Object { Log $_ }

Log "=== done ==="
Write-Host "Full log: $log"
