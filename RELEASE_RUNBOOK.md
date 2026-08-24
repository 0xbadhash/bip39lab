# Release runbook — v0.16.42

**Phase:** approved (100) → tag `v0.16.42`

## Smoke

| Step | Exit |
|------|------|
| `.venv/bin/python -m pytest -q` | 0 (105) |
| `npx playwright test e2e/v2.spec.ts` | 0 (15) |
| `python3 scripts/check_web_e2e.py --root .` | 0 |
| full classic e2e | skipped |

## Infra

None.

## Evidence pack

hard_gates ok; pr_validator 100; CODE/CROSS/BEHAVIOR; pytest; V2 Playwright 15 including V2-S15.

## Rollback

`git checkout v0.16.41`.

## §9

1. leftover `scripts/*.py` uncommitted.
2. Dual stamp 0.16.42 vs 0.17.24-v2.
3. Classic Playwright not all-green.
4. lab-strip 404 on `/v2/`.
5. Pad uses Math.random on purpose (simulated).
