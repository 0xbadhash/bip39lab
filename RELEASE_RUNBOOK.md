# RELEASE RUNBOOK — v0.15.0

**Date:** 2026-08-11  
**Score:** 100 (pr_validator)  
**Phase:** approved → shipped  

## What ships
Classroom UX polish post v0.14.0: first-hour Go/Back, guided quiz Q1–Q4 (entropy TOO LOW + ~50 d6), amber return dock, slim Classroom pane, Extra help (no mid-page step rails), green Passed chips.

## Smoke table

| Step | Command | Exit |
|------|---------|------|
| unit | `.venv/bin/python -m pytest -q` | 0 |
| e2e | `npm run test:e2e` | 0 |
| product_smoke | `python3 scripts/product_smoke.py --root .` | 0 |
| web_e2e | `python3 scripts/check_web_e2e.py --root .` | 0 |
| hard_gates | `python3 scripts/hard_gates.py --diff f668e6e...HEAD` | ok |
| pr_validator | `python3 scripts/pr_validator.py --diff f668e6e...HEAD` | 100 |

## Evidence pack
- hard_gates ok (secrets clean, TDD N/A, path_tests waived/covered)
- product_smoke 2/2
- Playwright full suite green after rail-test updates
- CODE-REVIEW p0=0 · CROSS-REVIEW blockers=0 · BEHAVIOR C1–C8 pass

## Infra
No separate INFRA_RUNBOOK for this static site ship.

## Rollback
```bash
git checkout v0.14.0 -- VERSION web/ pyproject.toml package.json
python3 scripts/stamp_site_version.py
# redeploy web/
```

## §9 Intentional oddities
1. Self-graded quiz.  
2. Math.random entropy pad (simulated).  
3. Soft level gates.  
4. Amber dock single-mode return.  

## Tag
`v0.15.0` on `master` after commit of release stamps.
