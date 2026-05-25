#!/bin/bash
# One cron job: daily blog + SEO + static publish (run ONCE on EC2)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=load-env.sh
source "${SCRIPT_DIR}/load-env.sh"

APP="${DEPLOY_REMOTE_APP_PATH:-/home/ec2-user/maatridev-technologies}"
NODE="$(command -v node)"
CRON_SCHEDULE="${DAILY_CRON_SCHEDULE:-0 6 * * *}"
LOG="${DAILY_CRON_LOG:-/home/ec2-user/maatridev-daily.log}"

MARKER_BLOG="# maatridev-daily-blog"
MARKER_SEO="# maatridev-daily-seo"
MARKER_ALL="# maatridev-daily-all"

if [[ ! -f "${APP}/.env" ]]; then
  echo "ERROR: ${APP}/.env not found."
  exit 1
fi

if ! grep -q '^OPENAI_API_KEY=.' "${APP}/.env" 2>/dev/null; then
  echo "ERROR: Add OPENAI_API_KEY to ${APP}/.env"
  exit 1
fi

if ! command -v crontab >/dev/null 2>&1; then
  echo "ERROR: Install cronie first: sudo dnf install -y cronie && sudo systemctl enable --now crond"
  exit 1
fi

LINE="${CRON_SCHEDULE} cd ${APP} && ${NODE} scripts/seo-daily.mjs --with-blog >> ${LOG} 2>&1 ${MARKER_ALL}"

( crontab -l 2>/dev/null | grep -v "${MARKER_BLOG}" | grep -v "${MARKER_SEO}" | grep -v "${MARKER_ALL}" || true
  echo "${LINE}"
) | crontab -

echo "Installed unified daily automation: ${CRON_SCHEDULE}"
echo "Log: ${LOG}"
echo ""
echo "Runs: blog → retroactive links → sitemap pings (Bing/Yandex/RSS) → IndexNow"
echo "      → social drafts + Gmail email → health audit → web sync"
echo "Schedule: Mon keywords | Tue PageSpeed | Wed backlinks | Thu competitors | Sat links | Sun report"
echo ""
echo "One-time on server:"
echo "  bash deploy/setup-publish-sudo.sh"
echo ""
echo "Test now:"
echo "  cd ${APP} && ${NODE} scripts/seo-daily.mjs --with-blog"
