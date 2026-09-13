# Release runbook — v0.16.89 / 0.17.138-v2

## Smoke

| Step | Command | Result |
|------|---------|--------|
| unit | `.venv/bin/python3 -m pytest -q` | 242 passed |
| e2e subset | Playwright V2-S0 S1 S186 | 3 passed |
| web_e2e | `check_web_e2e.py` | ok |
| hard_gates | `--diff origin/master...HEAD` | ok |
| pr_validator | venv python | score 100 approved |

## Evidence pack

- hard_gates PASS
- pytest 242
- Playwright V2-S0/S1/S186
- product_smoke at tag time

## Tag

- Product `0.16.89` / tag `v0.16.89`
- V2 chip `0.17.138-v2`

## Rollback

`git checkout v0.16.88` on deploy host.

## Infra

Static nginx; no new infra.

## §9

1. Does not add Sign or live CSV.
2. Does not compute Electrum KDF.
3. Does not force-push or commit leftover scripts.
