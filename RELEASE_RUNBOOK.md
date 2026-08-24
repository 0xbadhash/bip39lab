# Release runbook — v0.16.39

**Phase:** approved (100) → tag `v0.16.39`

## Smoke

| Step | Exit |
|------|------|
| `.venv/bin/python -m pytest -q` | 0 (105) |
| `npx playwright test e2e/v2.spec.ts` | 0 (13) |
| `python3 scripts/check_web_e2e.py` | at ship |
| full classic e2e | skipped (known fails) |

## Infra

None.

## Evidence pack

hard_gates ok; pr_validator 100; CODE/CROSS/BEHAVIOR; pytest; V2 Playwright 13.

## Rollback

`git checkout v0.16.38`.

## §9

1. scripts/*.py uncommitted.
2. V2 footer 0.17.0-v2.
3. Classic Playwright not all-green.
4. lab-strip 404 on /v2/.
