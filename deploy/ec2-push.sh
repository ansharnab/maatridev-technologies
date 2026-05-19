#!/bin/bash
# Redeploy to EC2 — reads DEPLOY_* and LIVE_URL from project .env
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=load-env.sh
source "${SCRIPT_DIR}/load-env.sh"

: "${DEPLOY_SSH_USER:?Set DEPLOY_SSH_USER in .env}"
: "${DEPLOY_SSH_HOST:?Set DEPLOY_SSH_HOST in .env}"
: "${DEPLOY_SSH_KEY:?Set DEPLOY_SSH_KEY in .env}"
: "${DEPLOY_REMOTE_APP_PATH:?Set DEPLOY_REMOTE_APP_PATH in .env}"

KEY="${DEPLOY_SSH_KEY/#\~/$HOME}"
HOST="${DEPLOY_SSH_USER}@${DEPLOY_SSH_HOST}"
APP="${DEPLOY_REMOTE_APP_PATH}"
LIVE="${PUBLIC_URL:-${LIVE_URL:-}}"

rsync -avz --delete \
  -e "ssh -i \"$KEY\" -o StrictHostKeyChecking=no" \
  --exclude node_modules \
  --exclude dist \
  --exclude .git \
  --exclude .DS_Store \
  "$(cd "${SCRIPT_DIR}/.." && pwd)/" \
  "${HOST}:${APP}/"

ssh -i "$KEY" -o StrictHostKeyChecking=no "$HOST" "bash ${APP}/deploy/ec2-setup.sh"

if [[ -n "$LIVE" ]]; then
  echo "Live: ${LIVE%/}/"
else
  echo "Deploy finished. Set PUBLIC_URL or LIVE_URL in .env for the site URL."
fi
