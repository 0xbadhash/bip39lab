# PR Draft: v0.16.16 Reset Starter intro + three Lab overlays

**Spec:** `.agents/specs/2026-08-20-reset-starter-lab-overlays.md`

## What Problem This Solves

Reset progress left Level unchanged and did not land on the lab intro. Generate / Derive / Clear fired with no distinct in-page overlay.

## Why This Change Was Made

CEO leftover Window 6. Stamp 0.16.16.

## User Impact

Reset returns to Offline BIP-39 lab at Starter with the receive-addresses subtitle. Each of Generate, Validate & derive, and Clear secrets has its own overlay; Cancel does not run the action.

## Traceability

| AC | Evidence |
|----|----------|
| Reset → Starter intro exact `#panel-sub` | S99 |
| Three distinct overlays Continue/Cancel | S100 |
| S80 native replace after Generate overlay | S80 |
| S81 missing-data after Derive overlay | S81 |
| S85 Receive heading | S85 |
| Stamp 0.16.16 | S0 |

## Red-proof

- red_cmd: `npx playwright test e2e/lab.spec.ts -g "S99|S100"`
- green_cmd: `npx playwright test e2e/lab.spec.ts e2e/learn.spec.ts -g "S99|S100|S80|S81|S0 smoke|S85"`

## Threat notes

- Overlays do not replace P0 Seed QR / Print / Generate-replace native confirm.
- Clear overlay states Lab memory only, not a wallet wipe.
- No secrets committed; mnemonics stay in-tab.

## Evidence pack

Playwright S0, S80, S81, S85, S91, S99, S100 green.

## Things that look bad but are actually fine

1. Reset no longer uses `window.confirm` (brief: three overlays not native confirm; Reset always returns to Starter).
2. Dirty leftover `scripts/*.py` and `config/` are not in this commit.
```
