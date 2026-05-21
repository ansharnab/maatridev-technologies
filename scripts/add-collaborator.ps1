# Repo OWNER only: grant push access to another GitHub user
param(
  [Parameter(Mandatory = $true)]
  [string]$Username,

  [ValidateSet("pull", "push", "admin", "maintain", "triage")]
  [string]$Permission = "push"
)

$repo = "ansharnab/maatridev-technologies"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Error "GitHub CLI (gh) not found. Run scripts\install-gh-cli.ps1 first."
  exit 1
}

Write-Host "Inviting @$Username to $repo with permission: $Permission"
gh api -X PUT "repos/$repo/collaborators/$Username" -f permission=$Permission

Write-Host ""
Write-Host "They must accept the email invitation before git push works."
Write-Host "List pending collaborators:"
gh api "repos/$repo/invitations" --jq '.[] | "\(.invitee.login) — \(.permissions)"' 2>$null
