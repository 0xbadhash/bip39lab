# RELEASE_RUNBOOK — v0.16.2 S70 dock + S67 mobile + Comet polish

**Marker:** RELEASE-RUNBOOK  
**Date:** 2026-08-12  
**Version:** 0.16.2  
**Tag:** v0.16.2  
**Spec waiver:** chore  
**Score:** 100 · approved → shipped  

## Smoke table

| Step | Command | Exit |
|------|---------|------|
| unit | `.venv/bin/python -m pytest -q` | 0 |
| e2e | `npm run test:e2e` | 0 |
| web_e2e | `python3 scripts/check_web_e2e.py --root .` | 0 |
| compliance | `compliance_engine.py` | 0 |
| secrets | v0.16.1…HEAD | clean |
| hard_gates | ok | 0 |

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | ok score 100 |
| CODE-REVIEW | p0=0 |
| CROSS-REVIEW | blockers=0 |
| BEHAVIOR | B1–B6 pass |
| Live Comet | 89/90 then S67 fix |

## Infra
Static nginx root = repo `web/`. Reload optional after stamp.

## Rollback
1. `git checkout v0.16.1`  
2. Restore VERSION + site-version stamps  

## §9
1. Self-graded Mark buttons.  
2. Network opt-in chip (not Offline).  
3. Dark sidebar under light theme.  
4. Soft level gates.  
