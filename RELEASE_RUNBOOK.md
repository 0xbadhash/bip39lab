# RELEASE_RUNBOOK — v0.13.12 Tools teach UX pack

**Tag:** `v0.13.12`  
**Waiver:** chore  
**Date:** 2026-08-11  
**Score:** 100  

## Summary

Tools panel-scoped jump rail (Lab rail no longer on Tools); path/entropy/passphrase/PSBT teach UX; simulated rolls + TOO LOW visibility; step-rail focus/scroll; script cache-bust `?v=`.

## Smoke table

| Step | Exit |
|------|------|
| pytest -q | 0 |
| npm run test:e2e | 0 (77) |
| check_web_e2e | 0 |
| pr_validator | 100 |

## Infra

Static nginx `/home/debian/bip39lab/web` — stamp site-version + script query strings.

## Evidence pack

- hard_gates ok · CODE-REVIEW / CROSS-REVIEW  
- secrets clean · product_smoke  

## Tag

```bash
git tag -a v0.13.12 -m "v0.13.12 Tools teach UX + panel jump rails"
```

## Rollback

`git checkout v0.13.11 -- web/ VERSION package.json pyproject.toml`

## Things that look bad but are actually fine

1. Bundle large diff from rebuild.  
2. Pad weak→valid BIP-39 is educational.  
3. Tools rail is in-panel only (6 primary nav unchanged).  
