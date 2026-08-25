# Release runbook — v0.16.43

**Phase:** approved (100) → tag `v0.16.43`

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

hard_gates ok; pr_validator 100; CODE/CROSS/BEHAVIOR; pytest; V2 Playwright 15.

## Rollback

`git checkout v0.16.42`.

## §9

1. leftover `scripts/*.py` uncommitted.
2. Dual stamp 0.16.43 vs 0.17.30-v2.
3. Classic Playwright not all-green.
4. Fake BTC drains are teaching only.
5. lab-strip 404 on `/v2/`.
