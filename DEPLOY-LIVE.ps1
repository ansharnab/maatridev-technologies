# Deploy MaatriDev website to EC2 (run from this folder on your PC)
# Reads DEPLOY_* and LIVE_URL from .env — see .env.example

param(
  [string]$ServerUser = "",
  [string]$ServerHost = "",
  [string]$RemotePath = "",
  [string]$KeyFile = ""
)

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot
$EnvFile = Join-Path $Root ".env"

function Read-DotEnv($path) {
  $vars = @{}
  if (-not (Test-Path $path)) { return $vars }
  Get-Content $path | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith("#")) { return }
    $i = $line.IndexOf("=")
    if ($i -lt 1) { return }
    $k = $line.Substring(0, $i).Trim()
    $v = $line.Substring($i + 1).Trim().Trim('"').Trim("'")
    $vars[$k] = $v
  }
  $vars
}

$envVars = Read-DotEnv $EnvFile
if (-not $ServerUser) { $ServerUser = $envVars["DEPLOY_SSH_USER"] }
if (-not $ServerHost) { $ServerHost = $envVars["DEPLOY_SSH_HOST"] }
if (-not $RemotePath) { $RemotePath = $envVars["DEPLOY_REMOTE_APP_PATH"] }
if (-not $KeyFile) { $KeyFile = $envVars["DEPLOY_SSH_KEY"] }

if (-not $ServerUser -or -not $ServerHost -or -not $RemotePath) {
  throw "Set DEPLOY_SSH_USER, DEPLOY_SSH_HOST, DEPLOY_REMOTE_APP_PATH in .env (see .env.example)"
}

$liveUrl = $envVars["PUBLIC_URL"]
if (-not $liveUrl) { $liveUrl = $envVars["LIVE_URL"] }
if (-not $liveUrl) { $liveUrl = "http://$ServerHost" }

Write-Host "Building production bundle..." -ForegroundColor Cyan
Set-Location $Root
npm run build
if ($LASTEXITCODE -ne 0) { throw "Build failed" }

$sshTarget = "${ServerUser}@${ServerHost}"
$scpArgs = @()
if ($KeyFile) {
  $expandedKey = $KeyFile -replace '^~', $env:USERPROFILE
  $scpArgs += "-i", $expandedKey
}

Write-Host "Uploading to ${sshTarget}:${RemotePath} ..." -ForegroundColor Cyan
Write-Host "(You will be prompted for SSH key/password if needed)" -ForegroundColor Yellow

$tar = Join-Path $env:TEMP "maatridev-deploy.tgz"
if (Test-Path $tar) { Remove-Item $tar -Force }

Push-Location $Root
tar -czf $tar --exclude=node_modules --exclude=.git dist server public package.json package-lock.json .env.example
Pop-Location

scp @scpArgs $tar "${sshTarget}:/tmp/maatridev-deploy.tgz"

$remote = @"
set -e
mkdir -p $RemotePath
cd $RemotePath
tar -xzf /tmp/maatridev-deploy.tgz
npm install --omit=dev
if command -v pm2 >/dev/null; then
  pm2 restart maatridev-api 2>/dev/null || pm2 start server/index.js --name maatridev-api
else
  echo 'Install pm2 or restart your Node service manually: node server/index.js'
fi
echo Done.
"@

ssh @scpArgs $sshTarget $remote

$base = $liveUrl.TrimEnd("/")
Write-Host "`nDeployed. Open $base/ and hard-refresh (Ctrl+F5)." -ForegroundColor Green
Write-Host "Admin: $base/admin" -ForegroundColor Green
