# Release runbook — v0.16.46

**Phase:** approved (100) → tag `v0.16.46`

## Smoke

| Step | Exit |
|------|------|
| `.venv/bin/python -m pytest -q` | 0 (105) |
| `npx playwright test e2e/v2.spec.ts` | 0 (16) |
| `python3 scripts/check_web_e2e.py --root .` | 0 |
| full classic e2e | skipped |

## Infra

None.

## Evidence pack

hard_gates ok (gitleaks clean after id rename); pr_validator 100; CODE/CROSS/BEHAVIOR; pytest; V2 Playwright 16.

## Rollback

`git checkout v0.16.45`.

## §9

1. leftover scripts stash
2. Dual stamp 0.16.46 vs 0.17.46-v2
3. Classic Playwright not all-green
4. lab-strip 404
5. 128-char PP cap is UI only
