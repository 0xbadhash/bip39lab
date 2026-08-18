# RELEASE_RUNBOOK — v0.16.6 P0 lab-safety

**Marker:** RELEASE-RUNBOOK  
**Date:** 2026-08-18  
**Version:** 0.16.6  
**Tag:** v0.16.6  
**Spec:** `.agents/specs/2026-08-18-p0-lab-safety.md`  

## Smoke table

| Step | Exit |
|------|------|
| pytest | 0 (102) |
| Playwright | 0 (100) |
| check_web_e2e | 0 |

## Comet
`Product: 0.16.6 · Scenarios: S0–S80 · Playwright S-ids: 100`  
live === comet === PLAYWRIGHT_LAST = **100**

## Rollback
`git checkout v0.16.5`

## §9
1. Mainnet goldens still exist; default path is Testnet.  
2. Quiz/theme storage is disclosed, not removed.  
3. P1 honesty items not in this ship.
