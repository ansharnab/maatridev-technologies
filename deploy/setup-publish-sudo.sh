#!/bin/bash
# One-time on EC2: allow ec2-user to rsync dist → /var/www without password
set -euo pipefail

FILE="/etc/sudoers.d/maatridev-publish"
CONTENT='ec2-user ALL=(ALL) NOPASSWD: /usr/bin/rsync, /usr/bin/cp'

echo "Installing sudoers for static publish..."
echo "$CONTENT" | sudo tee "$FILE" >/dev/null
sudo chmod 440 "$FILE"
sudo visudo -cf "$FILE"

echo "OK. Cron can now run: node scripts/seo/sync-web-root.mjs"
echo "Add to .env: SEO_PUBLISH_WEB_ROOT=/var/www/maatridev"
