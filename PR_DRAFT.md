# PR Draft: one stamp 0.16.6 + derive status

**Spec:** `.agents/specs/2026-08-18-stamp-and-derive-status.md`

## What Problem This Solves

Chip HTML was `…` until JS; Ready status used leftover `0.11.0-scure`. Empty derive stayed Ready. 11-word status said checksum.

## Why This Change Was Made

CEO stamp lock + two status bugs. Stay on 0.16.6. No P0 isolation reopen.

## Traceability

| AC | Test |
|----|------|
| Chip + Ready 0.16.6 | S0, test_html_chip_has_semver_before_js |
| Empty derive | S81 |
| 11-word length | S11b |

## Red-proof

- red_cmd: `npx playwright test e2e/lab.spec.ts -g "S81|S11b"`
- green_cmd: `npx playwright test e2e/lab.spec.ts -g "S81|S11b"`

## Evidence pack

pytest 104 + targeted Playwright. Full suite at ship.

## Things that look bad but are actually fine

1. Product stays 0.16.6 (no bump, no new tag).
2. `BIP39Lab.VERSION` 0.11.0-scure remains in the bundle as library build id — UI no longer shows it.
3. P0 banner/QR/session/testnet/leak/contrast not reopened.
