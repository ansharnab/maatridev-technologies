#!/bin/bash
# Install daily SEO automation on EC2 (run ONCE after cronie + OPENAI_API_KEY in .env)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=load-env.sh
source "${SCRIPT_DIR}/load-env.sh"

APP="${DEPLOY_REMOTE_APP_PATH:-/home/ec2-user/maatridev-technologies}"
NODE="$(command -v node)"
CRON_SCHEDULE="${SEO_CRON_SCHEDULE:-30 6 * * *}"
LOG="${SEO_CRON_LOG:-/home/ec2-user/maatridev-seo-cron.log}"

if [[ ! -f "${APP}/.env" ]]; then
  echo "ERROR: ${APP}/.env not found."
  exit 1
fi

if ! command -v crontab >/dev/null 2>&1; then
  echo "ERROR: crontab not found. Install cronie first:"
  echo "  sudo dnf install -y cronie && sudo systemctl enable --now crond"
  exit 1
fi

MARKER="# maatridev-daily-seo"
# Runs health audit, sitemap refresh, IndexNow; blog cron can stay separate at 6:00
LINE="${CRON_SCHEDULE} cd ${APP} && ${NODE} scripts/seo-daily.mjs >> ${LOG} 2>&1 ${MARKER}"

( crontab -l 2>/dev/null | grep -v "${MARKER}" || true
  echo "${LINE}"
) | crontab -

echo "Installed SEO cron: ${CRON_SCHEDULE}"
echo "Log: ${LOG}"
echo ""
echo "Recommended server .env:"
echo "  INDEXNOW_KEY=<random-32-char-hex>"
echo "  (SEO_WEB_ROOT not needed if nginx proxies /sitemap.xml to API)"
echo "  VITE_GA_MEASUREMENT_ID=G-XXXXXXXX"
echo ""
echo "Prefer unified cron (recommended):"
echo "  bash deploy/install-daily-automation.sh"
