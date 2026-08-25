# Release runbook — v0.16.44

**Phase:** approved (100) → tag `v0.16.44`

## Smoke

| Step | Exit |
|------|------|
| `.venv/bin/python -m pytest -q` | 0 (after pyproject bump) |
| `npx playwright test e2e/v2.spec.ts` | 0 (16) |
| `python3 scripts/check_web_e2e.py --root .` | 0 |
| full classic e2e | skipped (not all-green; V2 is ship gate) |

## Infra

None.

## Evidence pack

hard_gates ok; pr_validator 100; CODE/CROSS/BEHAVIOR; pytest; V2 Playwright 16.

## Rollback

`git checkout v0.16.43`.

## §9

1. leftover `scripts/*.py` stashed.
2. Dual stamp 0.16.44 vs 0.17.41-v2.
3. Classic Playwright not all-green.
4. Fake 0.184 BTC is teaching only.
5. lab-strip 404 on `/v2/`.
