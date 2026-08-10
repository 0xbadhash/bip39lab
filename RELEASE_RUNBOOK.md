# RELEASE_RUNBOOK — v0.13.8 SLIP-39 lab B compatible core

**Tag:** `v0.13.8`  
**Spec:** `.agents/specs/2026-08-10-slip39-b-compatible-core.md`  
**Date:** 2026-08-10

## Summary

Offline SLIP-39-compatible single-group split/combine lab (2-of-3 / 3-of-5). Python `shamir-mnemonic` + npm `slip39` web bundle. Golden vector + fail-closed errors. Lab only — not Trezor Suite.

## Smoke table

| Step | Command | Exit |
|------|---------|------|
| unit | `.venv/bin/python -m pytest -q` | 0 (after version bump) |
| e2e | `npx playwright test e2e/slip39.spec.ts` | 0 (S57–S60) |
| product smoke | `python scripts/product_smoke.py --root .` | 0 |
| web_e2e | `python scripts/check_web_e2e.py --root .` | 0 |
| hard_gates | `python scripts/hard_gates.py --diff HEAD~1..HEAD` | ok |
| secrets | `python scripts/check_secrets_diff.py --base HEAD~1 --head HEAD` | clean |

## Evidence pack

- hard_gates: ok (threat tags secrets/supply-chain/xss)
- pytest: `tests/test_slip39_lab.py` + shell copy
- Playwright: S58 happy path, S59 under-threshold, S60 partial C
- product_smoke: unit + full e2e

## Infra

None (static site; no server crypto).

## Rollback

1. `git checkout v0.13.7 -- web/ src/bip39lab/slip39_lab.py tests/ e2e/slip39.spec.ts package.json package-lock.json pyproject.toml`
2. Rebuild or restore prior `web/js/slip39.bundle.js` if needed
3. Redeploy static `web/` to host
4. Tag stay: use `v0.13.7` site stamp

## §9 (≥3 notes)

1. Educational only — never use for funded-wallet restore.
2. Wrong passphrase yields different secret (SLIP-39); demo S60 teaches mismatch.
3. Multi-group designer UI still deferred to ship C; diagram is teach-only.

## Deploy

Static files under `web/` including `slip39.html` + `js/slip39.bundle.js` + `js/slip39-app.js`.
