# RELEASE_RUNBOOK — v0.16.1 Multisig teach + dock Mark parity

**Marker:** RELEASE-RUNBOOK  
**Date:** 2026-08-11  
**Version:** 0.16.1  
**Tag:** v0.16.1  
**Spec waiver:** chore  
**Score:** 100 · approved → shipped  

## Smoke table

| Step | Command | Exit |
|------|---------|------|
| unit | `.venv/bin/python -m pytest -q` | 0 |
| e2e | `npm run test:e2e` | 0 |
| web_e2e | `python3 scripts/check_web_e2e.py --root .` | 0 |
| secrets | `v0.16.0…HEAD` | clean |
| hard_gates | ok score 100 | 0 |

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | ok |
| CODE-REVIEW | p0=0 |
| CROSS-REVIEW | blockers=0 |
| BEHAVIOR | B1–B6 pass |
| Comet | S0–S71 auto-stamped |

## Infra
None (static web).

## Rollback
1. `git checkout v0.16.0` / redeploy  
2. Restore VERSION + site-version stamps  

## §9 Things that look bad but are fine
1. Self-graded Intermediate Mark buttons.  
2. Cosigner replace requires new vault.  
3. zpub educational only.  
4. Soft level gates.  
