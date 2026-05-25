#!/bin/bash
# Install daily blog cron on EC2 (run ONCE on server after OPENAI_API_KEY is in .env)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=load-env.sh
source "${SCRIPT_DIR}/load-env.sh"

APP="${DEPLOY_REMOTE_APP_PATH:-/home/ec2-user/maatridev-technologies}"
NODE="$(command -v node)"
CRON_SCHEDULE="${BLOG_CRON_SCHEDULE:-0 6 * * *}"
LOG="${BLOG_CRON_LOG:-/home/ec2-user/maatridev-blog-cron.log}"

if [[ ! -f "${APP}/.env" ]]; then
  echo "ERROR: ${APP}/.env not found. Set OPENAI_API_KEY there first."
  exit 1
fi

if ! grep -q '^OPENAI_API_KEY=.' "${APP}/.env" 2>/dev/null; then
  echo "ERROR: Add OPENAI_API_KEY=sk-... to ${APP}/.env"
  exit 1
fi

if ! command -v crontab >/dev/null 2>&1; then
  echo "ERROR: crontab not found — cron is not installed on this server."
  echo ""
  if command -v dnf >/dev/null 2>&1; then
    echo "Amazon Linux 2023 / Fedora (run on EC2, then re-run this script):"
    echo "  sudo dnf install -y cronie"
    echo "  sudo systemctl enable --now crond"
  elif command -v yum >/dev/null 2>&1; then
    echo "Amazon Linux 2 / CentOS:"
    echo "  sudo yum install -y cronie"
    echo "  sudo systemctl enable --now crond"
  elif command -v apt-get >/dev/null 2>&1; then
    echo "Ubuntu / Debian:"
    echo "  sudo apt-get update && sudo apt-get install -y cron"
    echo "  sudo systemctl enable --now cron"
  else
    echo "Install your OS cron package (often named cronie or cron), then re-run:"
    echo "  bash deploy/install-blog-cron.sh"
  fi
  exit 1
fi

MARKER="# maatridev-daily-blog"
LINE="${CRON_SCHEDULE} cd ${APP} && ${NODE} scripts/generate-daily-blog.mjs >> ${LOG} 2>&1 ${MARKER}"

( crontab -l 2>/dev/null | grep -v "${MARKER}" || true
  echo "${LINE}"
) | crontab -

echo "Installed cron: ${CRON_SCHEDULE} (server local time)"
echo "Log: ${LOG}"
echo ""
echo "TIP: Prefer unified automation (blog + SEO together):"
echo "  bash deploy/install-daily-automation.sh"
echo "Test now: cd ${APP} && node scripts/generate-daily-blog.mjs"
