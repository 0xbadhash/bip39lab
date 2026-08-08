# RELEASE RUNBOOK — v0.13.1

**Date:** 2026-08-08  
**Tag:** `v0.13.1`  
**Live:** https://bip39.catalyxt.xyz/ (nginx root → `web/`)

## What shipped

- Comet UX feedback: word-count sync on paste (S2b), sticky Multisig word tabs, Shamir educational recombine (S56)
- **Site release tag on every page** — sidebar chip + footer (`data-site-version` via `web/js/site-version.js`)
- `scripts/stamp_site_version.py` stamps version from `VERSION` on each release

## Version stamp (always on release)

```bash
echo X.Y.Z > VERSION
python3 scripts/stamp_site_version.py   # → web/js/site-version.js + DOM labels
# bump package.json + pyproject.toml to match
```

Visible as **`vX.Y.Z`** in sidebar foot and page footer on Lab, Multisig, Shamir, Network.

## Smoke

| Step | Exit |
|------|------|
| `python3 scripts/stamp_site_version.py` | 0 |
| `npm run test:e2e` (S0 version chip, S2b, S56, …) | 0 |
| `python3 scripts/check_web_e2e.py` | ok |
| Live curl/html version string | v0.13.1 |

## Deploy

Nginx `root /home/debian/bip39lab/web` — commit + tag on this host **is** the deploy. Reload nginx only if conf changed.

## Rollback

```bash
git checkout v0.13.0 -- web/ VERSION package.json pyproject.toml
python3 scripts/stamp_site_version.py
```

## §9

1. Site version (`VERSION`) is the product release tag, separate from `BIP39Lab.VERSION` in the crypto bundle.  
2. stamp script is intentional for offline CSP (no fetch of version.json).  
3. Live host and git tree are the same path — no extra CDN step.
