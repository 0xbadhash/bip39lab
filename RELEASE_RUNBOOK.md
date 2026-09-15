# Release runbook — v0.16.90 / 0.17.139-v2

## Smoke

| Step | Command | Result |
|------|---------|--------|
| unit | `.venv/bin/python3 -m pytest -q` | 242 passed |
| e2e smoke | `scripts/run_e2e_smoke.py` | ok |
| web_e2e | `check_web_e2e.py` | ok |
| Playwright UC32 | V2-S23 S52 S52b | 3 passed |
| hard_gates | `--diff d2a0e0d...HEAD` | ok |
| pr_validator | venv python | score 100 approved |

## Evidence pack

- hard_gates PASS
- pytest 242
- Playwright V2-S23/S52/S52b
- product_smoke PASS

## Tag

- Product `0.16.90` / tag `v0.16.90`
- V2 chip `0.17.139-v2`

## Rollback

`git checkout v0.16.89` on deploy host (nginx root = this `web/`).

## Infra

Static nginx; no new infra.

## Things that look bad but are actually fine

1. Dual stamp product 0.16.90 vs V2 chip 0.17.139-v2 (existing convention).
2. Empty wordGridHtml still paints 12 dash slots before MakeSrc.
3. Hide-fail recover region uses empty paragraph (0 `.ww`) for unambiguous e2e.
