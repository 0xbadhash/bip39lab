# Release runbook — v0.16.41

**Phase:** approved (100) → tag `v0.16.41`

## Smoke

| Step | Exit |
|------|------|
| `.venv/bin/python -m pytest -q` | 0 (105) |
| `npx playwright test e2e/v2.spec.ts` | 0 (14) |
| `python3 scripts/check_web_e2e.py --root .` | 0 |
| full classic e2e | skipped (known fails) |

## Infra

None.

## Evidence pack

hard_gates ok; pr_validator 100; CODE/CROSS/BEHAVIOR; pytest; V2 Playwright 14.

## Rollback

`git checkout v0.16.40`.

## §9

1. leftover `scripts/*.py` uncommitted.
2. Dual stamp 0.16.41 vs 0.17.23-v2.
3. Classic Playwright not all-green.
4. lab-strip 404 on `/v2/`.
5. Dice/coin UC spec remains draft (grill).
