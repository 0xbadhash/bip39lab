# Release runbook — v0.16.91 / 0.17.140-v2

## Smoke

| Step | Command | Result |
|------|---------|--------|
| pytest | `.venv/bin/python -m pytest -q` | 242 passed |
| V2 targeted | `npx playwright test e2e/v2.spec.ts -g "V2-S0|V2-S11|V2-S15|V2-S35|V2-S188|V2-S189|V2-S190"` | 7 passed |
| Multisig A/B/C | `npx playwright test e2e/multisig.spec.ts -g "S72|S73|S74"` | 3 passed |
| stamp | `python3 scripts/stamp_site_version.py` | 0.16.91 |

## Evidence pack

- hard_gates / web_e2e: product check_web_e2e
- pytest 242
- Playwright S-ids include V2-S188–S190; comet Product 0.16.91 S0–S190

## Rollback

1. `git checkout v0.16.90 -- VERSION web/ package.json pyproject.toml`
2. `python3 scripts/stamp_site_version.py`
3. Restore `web/v2/VERSION` to prior chip; reload nginx if needed

## §9 notes

1. nginx root already `/home/debian/bip39lab/web` — tag = live.
2. Pilot does not message Boss/Bob; scorecard READY-FOR-E2E only.
3. FROST/SeedXOR/SLIP not claimed; UC32 untouched.
