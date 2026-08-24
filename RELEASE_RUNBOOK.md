# Release runbook — v0.16.37

**Phase:** approved (score 100) → tag `v0.16.37`

## Smoke

| Step | Command | Exit |
|------|---------|------|
| unit | `.venv/bin/python -m pytest -q` | 0 (105 passed) |
| v2 e2e | `npx playwright test e2e/v2.spec.ts` | 0 (12 passed, earlier this ship) |
| web_e2e gate | `python3 scripts/check_web_e2e.py --root .` | 0 |
| plugin `npm run test:e2e` | full classic suite | **not re-run to green** — known pre-existing fails; V2 gated instead |

## Infra

No INFRA_RUNBOOK. Skip.

## Evidence pack

- hard_gates ok (venv python)
- pr_validator 100 → approved
- CODE-REVIEW / CROSS-REVIEW / BEHAVIOR-REPORT
- pytest 105; V2 Playwright 12

## Rollback

`git checkout v0.16.36` on deploy. No DB.

## §9

1. `scripts/*.py` uncommitted (stash `harness-scripts-uncommitted`).
2. V2 footer `0.17.0-v2`.
3. Classic Playwright not all-green.
4. `/v2/js/lab-strip.js` 404 follow-up.
