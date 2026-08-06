#!/usr/bin/env bash
# Issue/renew TLS for bip39.catalyxt.xyz and enable nginx static site.
# Prerequisites:
#   1. DNS A: bip39 → this VPS public IPv4 (same pattern as card.catalyxt.xyz)
#   2. dig +short bip39.catalyxt.xyz  →  VPS IP
#   3. Static files at /home/debian/bip39lab/web
set -euo pipefail

DOMAIN="${DOMAIN:-bip39.catalyxt.xyz}"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NGINX_SRC="${REPO_ROOT}/deploy/nginx-bip39.catalyxt.xyz.conf"
SITE_AVAIL="/etc/nginx/sites-available/${DOMAIN}"
SITE_EN="/etc/nginx/sites-enabled/${DOMAIN}"
EXPECTED_IP="${EXPECTED_IP:-15.235.193.237}"
WEB_ROOT="${REPO_ROOT}/web"

echo "==> DNS check for ${DOMAIN}"
RESOLVED="$(dig +short "${DOMAIN}" A | head -1 || true)"
if [[ -z "${RESOLVED}" ]]; then
  echo "FAIL: ${DOMAIN} does not resolve yet. Add A record and wait for TTL."
  exit 1
fi
echo "    resolved: ${RESOLVED}"
if [[ "${RESOLVED}" != "${EXPECTED_IP}" ]]; then
  echo "WARN: expected ${EXPECTED_IP}, got ${RESOLVED} — continue only if intentional"
fi

if [[ ! -f "${WEB_ROOT}/index.html" ]]; then
  echo "FAIL: missing ${WEB_ROOT}/index.html"
  exit 1
fi

echo "==> Install nginx site (HTTP first if no cert)"
if [[ ! -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]]; then
  sudo tee "${SITE_AVAIL}" >/dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};
    root ${WEB_ROOT};
    index index.html;
    location /.well-known/acme-challenge/ { root /var/www/html; }
    location / { try_files \$uri \$uri/ =404; }
}
EOF
  sudo ln -sfn "${SITE_AVAIL}" "${SITE_EN}"
  sudo nginx -t
  sudo systemctl reload nginx
  echo "==> Obtaining Let's Encrypt cert (certbot --nginx)"
  sudo certbot --nginx -d "${DOMAIN}" --non-interactive --agree-tos \
    --register-unsafely-without-email --redirect || \
  sudo certbot --nginx -d "${DOMAIN}" --non-interactive --agree-tos --redirect
fi

echo "==> Install full static TLS config"
sudo cp "${NGINX_SRC}" "${SITE_AVAIL}"
# Ensure cert lines exist (certbot may have written them; inject if missing)
if ! grep -q "ssl_certificate" "${SITE_AVAIL}"; then
  sudo sed -i "/listen 443 ssl;/a\\    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;\\n    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;\\n    include /etc/letsencrypt/options-ssl-nginx.conf;\\n    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;" "${SITE_AVAIL}"
fi
# Prefer managed cert paths from live directory
if [[ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]]; then
  if ! grep -q "ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem" "${SITE_AVAIL}"; then
    sudo sed -i "/listen 443 ssl;/a\\    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;\\n    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;\\n    include /etc/letsencrypt/options-ssl-nginx.conf;\\n    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;" "${SITE_AVAIL}"
  fi
fi

sudo ln -sfn "${SITE_AVAIL}" "${SITE_EN}"
sudo nginx -t
sudo systemctl reload nginx

echo "==> Smoke"
curl -sI "https://${DOMAIN}/" | head -12
curl -s -o /dev/null -w "html %{http_code}\n" "https://${DOMAIN}/"
curl -s -o /dev/null -w "probe package.json %{http_code}\n" "https://${DOMAIN}/package.json" || true
echo "OK: open https://${DOMAIN}/"
