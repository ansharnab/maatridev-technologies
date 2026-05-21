# Install GitHub CLI on Windows (winget), then sign in
$ErrorActionPreference = "Continue"

Write-Host "Checking for gh..."
if (Get-Command gh -ErrorAction SilentlyContinue) {
  gh --version
  Write-Host "GitHub CLI already installed."
} else {
  Write-Host "Installing GitHub CLI via winget..."
  winget install --id GitHub.cli -e --accept-source-agreements --accept-package-agreements
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
    [System.Environment]::GetEnvironmentVariable("Path", "User")
}

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Host "Install finished but gh not in PATH. Close and reopen PowerShell, or download from:"
  Write-Host "https://github.com/cli/cli/releases"
  exit 1
}

Write-Host ""
Write-Host "Log in to GitHub (browser):"
gh auth login -h github.com -p https -w

Write-Host ""
Write-Host "Auth status:"
gh auth status
