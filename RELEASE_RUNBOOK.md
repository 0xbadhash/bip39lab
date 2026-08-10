# RELEASE_RUNBOOK — v0.13.9 SLIP-39 lab C

**Tag:** `v0.13.9`  
**Spec:** `.agents/specs/2026-08-10-slip39-c-passphrase-groups.md`  
**Date:** 2026-08-10  
**Score:** 100  

## Summary

Passphrase-at-combine mismatch teach (scripted S60 + manual S60b) and multi-group policy diagram (1-of-1 + 2-of-3, diagram-only). Lab only.

## Smoke table

| Step | Command | Exit |
|------|---------|------|
| unit | `.venv/bin/python -m pytest -q` | 0 |
| e2e | `npm run test:e2e` | 0 |
| web_e2e | `python3 scripts/check_web_e2e.py --root .` | 0 |
| compliance | ruff/mypy/pytest | 0 |
| secrets | `check_secrets_diff 68f47b8...HEAD` | clean |

## Evidence pack

- hard_gates ok · pr_validator 100  
- CODE-REVIEW / CROSS-REVIEW / BEHAVIOR-REPORT  
- product_smoke unit + e2e  

## Infra

- Static nginx root `/home/debian/bip39lab/web` — no rebuild beyond VERSION stamp  
- Live: `https://bip39.catalyxt.xyz/slip39.html` + `js/site-version.js` → v0.13.9  

## Tag

```bash
git tag -a v0.13.9 -m "v0.13.9 SLIP-39 lab C passphrase + multi-group teach"
git push origin master v0.13.9
git push buzz master:main v0.13.9
```

## Rollback

Checkout prior tag `v0.13.8` web assets under nginx root.

## Things that look bad but are actually fine

1. Multi-group is diagram-only — intentional scope.  
2. Wrong passphrase may return a hex — mismatch vs expected is the teach signal.  
3. Harness `check_hardcodes.py` syntax fix included — was blocking pr_validator.  
