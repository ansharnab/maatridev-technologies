# Deploy MaatriDev website to EC2 (run from this folder on your PC)
# Usage: .\DEPLOY-LIVE.ps1 -ServerUser ubuntu -ServerHost 13.126.237.163 -RemotePath /home/ubuntu/maatridev

param(
  [string]$ServerUser = "ubuntu",
  [string]$ServerHost = "13.126.237.163",
  [string]$RemotePath = "/home/ubuntu/maatridev",
  [string]$KeyFile = ""
)

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

Write-Host "Building production bundle..." -ForegroundColor Cyan
Set-Location $Root
npm run build
if ($LASTEXITCODE -ne 0) { throw "Build failed" }

$sshTarget = "${ServerUser}@${ServerHost}"
$scpArgs = @()
if ($KeyFile) { $scpArgs += "-i", $KeyFile }

Write-Host "Uploading to $sshTarget:$RemotePath ..." -ForegroundColor Cyan
Write-Host "(You will be prompted for SSH key/password if needed)" -ForegroundColor Yellow

# Sync project (exclude node_modules — install on server)
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
  pm2 restart maatridev 2>/dev/null || pm2 start server/index.js --name maatridev
else
  echo 'Install pm2 or restart your Node service manually: node server/index.js'
fi
echo Done. Site: http://$ServerHost/
"@

ssh @scpArgs $sshTarget $remote

Write-Host "`nDeployed. Open http://$ServerHost/ and hard-refresh (Ctrl+F5)." -ForegroundColor Green
