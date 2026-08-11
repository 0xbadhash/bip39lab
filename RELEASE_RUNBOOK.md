# RELEASE_RUNBOOK — v0.13.10 SLIP-39 lab D docs

**Tag:** `v0.13.10`  
**Spec:** `.agents/specs/2026-08-10-slip39-d-docs-release.md`  
**Waiver:** docs-only  
**Date:** 2026-08-11  
**Score:** 100 (pr_validator approved)

## Summary

Docs/Comet hygiene for SLIP-39 lab after A–C: README pages table, Comet S0–S60b + Page 7 process flow, ROADMAP A–D done. **No runtime crypto change.**

## Smoke table

| Step | Command | Exit |
|------|---------|------|
| unit | `.venv/bin/python -m pytest -q` | 0 |
| e2e | `npm run test:e2e` | 0 |
| web_e2e | `python3 scripts/check_web_e2e.py --root .` | 0 |

## Infra

- Static site nginx root `/home/debian/bip39lab/web` — version via `site-version.js` stamp only  
- No separate infra skill / INFRA_RUNBOOK  

## Evidence pack

- hard_gates ok (docs-only waiver, threat tags, red/green)  
- pr_validator **100** → approved  
- product_smoke unit + e2e  
- check_web_e2e (74 Playwright S-ids)  

## Tag

```bash
git tag -a v0.13.10 -m "v0.13.10 SLIP-39 lab D docs / Comet hygiene"
git push origin master v0.13.10
git push buzz master:main v0.13.10
```

## Rollback

```bash
# Restore prior stamp
git checkout v0.13.9 -- VERSION web/js/site-version.js package.json pyproject.toml
```

## Things that look bad but are actually fine

1. **Patch bump for docs-only** — site badge should match “current release” after sync_docs.  
2. **Unrelated dirty harness scripts** on working tree — **not** part of this tag; left unstaged.  
3. **No SLIP-39 crypto in this release** — A–C already on v0.13.9; this is documentation closeout.  
