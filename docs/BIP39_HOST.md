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

## Smoke

```bash
curl -sI https://bip39.catalyxt.xyz/ | head -8
curl -s -o /dev/null -w '%{http_code}\n' https://bip39.catalyxt.xyz/
# expect 404 on scanner probes
curl -s -o /dev/null -w '%{http_code}\n' https://bip39.catalyxt.xyz/package.json
```

## Free balance review (CLI, not the page)

```bash
python -m bip39lab balance <address> \
  --backend mempool \
  --i-understand-address-leak
```

Prefer local bitcoind when available (`--backend bitcoind --rpc-cookie …`).
