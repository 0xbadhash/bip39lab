# Release runbook — v0.16.38

**Phase:** approved (score 100) → tag `v0.16.38`

## Smoke

| Step | Command | Exit |
|------|---------|------|
| unit | `.venv/bin/python -m pytest -q` | 0 (105) |
| v2 e2e | `npx playwright test e2e/v2.spec.ts` | 0 (12) |
| web_e2e | `python3 scripts/check_web_e2e.py --root .` | run at ship |
| plugin full `npm run test:e2e` | classic suite | skipped (known pre-existing fails) |

## Infra

None.

## Evidence pack

hard_gates ok; pr_validator 100; CODE/CROSS/BEHAVIOR artifacts; pytest; V2 Playwright.

## Rollback

`git checkout v0.16.37`. No DB.

## §9

1. `scripts/*.py` uncommitted.
2. V2 footer `0.17.0-v2`.
3. Classic Playwright not all-green.
4. lab-strip 404 on `/v2/`.
