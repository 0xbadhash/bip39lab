# RELEASE_RUNBOOK — v0.16.0 Intermediate I1–I4 + Advanced A1–A4

**Marker:** RELEASE-RUNBOOK  
**Date:** 2026-08-11  
**Version:** 0.16.0  
**Tag:** v0.16.0  
**Spec:** `.agents/specs/2026-08-11-intermediate-advanced-paths.md`  
**Score:** 100 · phase approved → shipped  

## Smoke table

| Step | Command | Exit |
|------|---------|------|
| unit | `.venv/bin/python -m pytest -q` | 0 |
| e2e | `npm run test:e2e` | 0 |
| web_e2e | `python3 scripts/check_web_e2e.py --root .` | 0 |
| secrets | `check_secrets_diff` e82fabe…HEAD | clean |
| hard_gates | `hard_gates.py --diff e82fabe...HEAD` | ok |

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | ok · pr_validator score 100 |
| CODE-REVIEW | p0=0 |
| CROSS-REVIEW | blockers=0 |
| BEHAVIOR-REPORT | B1–B7 pass |
| pytest | test_int_adv_paths + full unit suite |
| Playwright | S68/S69 + full e2e suite |
| Comet | S68 Intermediate · S69 Advanced |

## Infra

None required (static web + offline lab).

## Rollback

1. `git checkout v0.15.1` / redeploy prior tree  
2. Restore `VERSION` + stamped `web/js/site-version.js` and `?v=` cache-busts  
3. Level gates still soft — no data migration  

## §9 Things that look bad but are fine

1. Self-graded Intermediate/Advanced quizzes (no server).  
2. BIP-85 demo is idea-only, not full derivation.  
3. I1–I3 Mark on Lab after external page visit (Back dock only).  
4. Soft level gates dim higher cards but remain readable.  
