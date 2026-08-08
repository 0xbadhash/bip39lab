# bip39.catalyxt.xyz — host ops runbook

**Public URL:** https://bip39.catalyxt.xyz/  
**Backend:** static files under `web/` (no app server).  
**Edge:** nginx TLS (same Catalyxt pattern as `card.catalyxt.xyz`).

**Brand:** use **`catalyxt.xyz` only**. Do not deploy new products on `catalyxt.ltd` (retired for new work).

---

## Architecture

```text
Internet
   │  HTTPS :443
   ▼
nginx (bip39.catalyxt.xyz)
   │  · TLS (Let's Encrypt)
   │  · CSP + probe deny
   ▼
static  /home/debian/bip39lab/web
```

| Item | Value |
|------|--------|
| DNS A | `bip39` → VPS public IPv4 |
| nginx template | `deploy/nginx-bip39.catalyxt.xyz.conf` |
| TLS setup | `deploy/setup_bip39_tls.sh` |

**UFW:** allow **80/443** only.

---

## Install / reinstall

```bash
cd /home/debian/bip39lab
bash deploy/setup_bip39_tls.sh
```

## Release deploy (static — nginx root is this repo’s `web/`)

Live files are served from **`/home/debian/bip39lab/web`** (see nginx `root`).
A tagged release is therefore “in place” once `VERSION` is stamped and files are on disk:

```bash
cd /home/debian/bip39lab
# 1. Bump VERSION (semver X.Y.Z)
echo 0.13.1 > VERSION
# 2. Stamp site chrome (sidebar + footer show vX.Y.Z)
python3 scripts/stamp_site_version.py
# 3. Align package.json / pyproject.toml version fields
# 4. Smoke + tag + push
npm run test:e2e
git tag -a v0.13.1 -m "v0.13.1 …"
git push origin master --tags
# 5. No separate rsync when nginx already points at this tree.
#    Optional: sudo nginx -t && sudo systemctl reload nginx
```

Confirm live: open https://bip39.catalyxt.xyz/ — sidebar/footer must show **`v0.13.1`**.

## Smoke

```bash
curl -sI https://bip39.catalyxt.xyz/ | head -8
curl -s -o /dev/null -w '%{http_code}\n' https://bip39.catalyxt.xyz/
# expect 404 on scanner probes
curl -s -o /dev/null -w '%{http_code}\n' https://bip39.catalyxt.xyz/package.json
# Network page same-origin mempool proxy (Option C) — must be 200 JSON
curl -sS -m 15 https://bip39.catalyxt.xyz/api/mempool/v1/fees/recommended
curl -sI https://bip39.catalyxt.xyz/network.html | grep -i content-security
# expect: connect-src 'self' https://mempool.space
```

**Note:** nginx resolves mempool.space with `ipv6=off` (AAAA is often unreachable from this VPS). The Network page uses `/api/mempool/…` first so browsers avoid third-party fetch failures.

## Free balance review (CLI, not the page)

```bash
python -m bip39lab balance <address> \
  --backend mempool \
  --i-understand-address-leak
```

Prefer local bitcoind when available (`--backend bitcoind --rpc-cookie …`).
