# Release runbook — v0.16.40

**Phase:** approved (100) → tag `v0.16.40`

## Smoke

| Step | Exit |
|------|------|
| `.venv/bin/python -m pytest -q` | 0 (105) |
| `npx playwright test e2e/v2.spec.ts` | 0 (14) |
| `python3 scripts/check_web_e2e.py --root .` | 0 |
| full classic e2e (`npm run test:e2e`) | skipped (known fails) |

## Infra

None (static lab).

## Evidence pack

hard_gates ok; pr_validator 100 (`.venv/bin/python`); CODE-REVIEW / CROSS-REVIEW / BEHAVIOR-REPORT; pytest; V2 Playwright 14; check_web_e2e.

## Rollback

`git checkout v0.16.39`.

## §9

1. leftover `scripts/*.py` uncommitted (FEATURE LOCK).
2. Product tag `0.16.40` vs V2 chip `0.17.22-v2` is dual stamp.
3. Classic Playwright not all-green.
4. lab-strip 404 on `/v2/` is pre-existing.
