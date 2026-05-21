#!/bin/bash
# Install Let's Encrypt SSL on EC2 (run on server as ec2-user with sudo).
set -euo pipefail

DOMAIN="${SSL_DOMAIN:-maatridev.com}"
EMAIL="${SSL_EMAIL:-hello@maatridev.com}"
APP_DIR="${DEPLOY_REMOTE_APP_PATH:-/home/ec2-user/maatridev-technologies}"

echo "==> Installing certbot..."
sudo dnf install -y certbot python3-certbot-nginx

echo "==> Updating nginx site config..."
sudo cp "${APP_DIR}/deploy/nginx-maatridev.conf" /etc/nginx/conf.d/maatridev.conf
sudo rm -f /etc/nginx/conf.d/default.conf 2>/dev/null || true
sudo nginx -t
sudo systemctl reload nginx

echo "==> Opening HTTPS in firewall (if firewalld is active)..."
if systemctl is-active --quiet firewalld 2>/dev/null; then
  sudo firewall-cmd --permanent --add-service=http
  sudo firewall-cmd --permanent --add-service=https
  sudo firewall-cmd --reload
fi

echo "==> Requesting certificate for ${DOMAIN} and www.${DOMAIN}..."
sudo certbot --nginx \
  --non-interactive \
  --agree-tos \
  --email "$EMAIL" \
  --domains "${DOMAIN},www.${DOMAIN}" \
  --redirect

echo "==> Enabling automatic renewal (certbot timer + daily cron backup)..."
sudo systemctl enable certbot-renew.timer 2>/dev/null || true
sudo systemctl start certbot-renew.timer 2>/dev/null || true

RENEW_HOOK="/etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh"
sudo mkdir -p "$(dirname "$RENEW_HOOK")"
sudo tee "$RENEW_HOOK" >/dev/null <<'HOOK'
#!/bin/bash
nginx -t && systemctl reload nginx
HOOK
sudo chmod +x "$RENEW_HOOK"

# Backup cron: twice daily (Let's Encrypt recommends checking often)
CRON_LINE='0 3,15 * * * root certbot renew --quiet --deploy-hook /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh'
sudo mkdir -p /etc/cron.d
if ! sudo grep -qF "certbot renew" /etc/cron.d/certbot-maatridev 2>/dev/null; then
  echo "$CRON_LINE" | sudo tee /etc/cron.d/certbot-maatridev >/dev/null
  sudo chmod 644 /etc/cron.d/certbot-maatridev
fi

echo ""
echo "==> SSL installed."
sudo certbot certificates
echo ""
echo "  https://${DOMAIN}/"
echo "  https://www.${DOMAIN}/"
echo "  Auto-renew: certbot-renew.timer + /etc/cron.d/certbot-maatridev"
echo ""
