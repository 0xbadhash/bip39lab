# RELEASE RUNBOOK — v0.15.1

**Date:** 2026-08-11  
**Score:** 100  
**Base:** v0.15.0  

## What ships
Classroom reliability patch: quiz dock mark Q1–Q4, Shamir Q2 mark return, viewport-bottom dock, sidebar HTML repair, Beginner what’s-next, hour step 6 auto-complete, Extra help beside Theme.

## Smoke table
| Step | Exit |
|------|------|
| pytest -q | 0 (84) |
| npm run test:e2e | 0 (84) |
| product_smoke | 0 |
| check_web_e2e | ok |
| hard_gates v0.15.0…HEAD | ok |
| pr_validator | 100 |

## Evidence pack
- hard_gates ok · secrets clean  
- CODE-REVIEW p0=0 · CROSS-REVIEW blockers=0 · BEHAVIOR B1–B7 pass  

## Rollback
```bash
git checkout v0.15.0 -- .
python3 scripts/stamp_site_version.py
```

## §9
1. Self-graded quiz  
2. Simulated entropy pad  
3. Soft level gates  
4. Dual localStorage + `?marked=` for Q2  

## Tag
`v0.15.1`
