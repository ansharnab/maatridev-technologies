#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=load-env.sh
source "${SCRIPT_DIR}/load-env.sh"

APP_DIR="${DEPLOY_REMOTE_APP_PATH:-/home/ec2-user/maatridev-technologies}"
WEB_ROOT="/var/www/maatridev"
PM2_USER="${DEPLOY_SSH_USER:-ec2-user}"
SSL_DOMAIN="${SSL_DOMAIN:-maatridev.com}"
CERT_DIR="/etc/letsencrypt/live/${SSL_DOMAIN}"

echo "==> Installing Node.js 20..."
if ! command -v node >/dev/null 2>&1 || [[ "$(node -p "process.versions.node.split('.')[0]")" -lt 20 ]]; then
  curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
  sudo dnf install -y nodejs
fi
node -v
npm -v

echo "==> Installing nginx, certbot, pm2..."
sudo dnf install -y nginx certbot python3-certbot-nginx
sudo npm install -g pm2

echo "==> Building app in ${APP_DIR}..."
cd "$APP_DIR"
npm install
npm run build

echo "==> Publishing static files..."
sudo mkdir -p "$WEB_ROOT"
sudo rsync -a --delete "${APP_DIR}/dist/" "${WEB_ROOT}/"
sudo chown -R nginx:nginx "$WEB_ROOT"

echo "==> SSL certificate..."
if [[ ! -f "${CERT_DIR}/fullchain.pem" ]]; then
  echo "    No cert yet — obtaining via certbot (one-time)..."
  sudo cp "${APP_DIR}/deploy/nginx-maatridev-http-only.conf" /etc/nginx/conf.d/maatridev.conf
  sudo rm -f /etc/nginx/conf.d/default.conf 2>/dev/null || true
  sudo nginx -t && sudo systemctl enable nginx && sudo systemctl restart nginx
  sudo certbot --nginx --non-interactive --agree-tos --redirect \
    --email "${SSL_EMAIL:-hello@maatridev.com}" \
    --domains "${SSL_DOMAIN},www.${SSL_DOMAIN}"
fi

echo "==> Configuring nginx (HTTP + HTTPS — keeps port 443 on every deploy)..."
sudo cp "${APP_DIR}/deploy/nginx-maatridev.conf" /etc/nginx/conf.d/maatridev.conf
sudo rm -f /etc/nginx/conf.d/default.conf 2>/dev/null || true
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl reload nginx

if ! ss -tln | grep -qE ':443[[:space:]]'; then
  echo ""
  echo "ERROR: port 443 not listening — Cloudflare will show 521."
  echo "Run on server: sudo certbot install --cert-name ${SSL_DOMAIN} --nginx --redirect"
  exit 1
fi

echo "==> Restarting API (pm2)..."
if pm2 describe maatridev-api >/dev/null 2>&1; then
  pm2 restart maatridev-api
else
  cd "$APP_DIR"
  pm2 start server/index.js --name maatridev-api
fi
pm2 save

STARTUP_CMD="$(pm2 startup systemd -u "$PM2_USER" --hp "/home/${PM2_USER}" 2>/dev/null | tail -1 || true)"
if [[ -n "$STARTUP_CMD" ]]; then
  eval "$STARTUP_CMD" || true
fi

sudo setsebool -P httpd_can_network_connect 1 2>/dev/null || true

SITE="${PUBLIC_URL:-${LIVE_URL:-https://${SSL_DOMAIN}}}"
echo ""
echo "==> Deploy complete."
echo "    Site:  ${SITE%/}/"
echo "    Admin: ${SITE%/}/admin"
echo "    Ports: 80 (redirect) + 443 (HTTPS) OK"
echo ""
