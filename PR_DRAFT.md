# PR Draft: v0.16.16 Reset Starter intro + three Lab overlays

**Spec:** `.agents/specs/2026-08-20-reset-starter-lab-overlays.md`
**Plan:** `.agents/specs/2026-08-20-reset-starter-lab-overlays-plan.md`

## What Problem This Solves

Reset progress left Level unchanged and did not land on the lab intro. Generate / Derive / Clear fired with no distinct in-page overlay.

## Why This Change Was Made

CEO leftover Window 6. Stamp 0.16.16.

## User Impact

Reset returns to Offline BIP-39 lab at Starter with the receive-addresses subtitle. Each of Generate, Validate & derive, and Clear secrets has its own overlay; Cancel does not run the action.

## Traceability

| AC | Test / smoke |
|----|----------------|
| AC Reset Starter intro exact `#panel-sub` | Playwright S99 |
| AC three distinct overlays Continue/Cancel | Playwright S100 |
| AC S80 native replace after Generate overlay | Playwright S80 |
| AC S81 missing-data after Derive overlay Continue | Playwright S81 smoke e2e |
| AC S85 Receive heading | Playwright S85 |
| AC stamp 0.16.16 chip | Playwright S0 |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/lab.spec.ts -g "S99|S100|S80|S81|S0 smoke"`

## Threat notes

- secrets: overlays do not log phrases; S80 native confirm still gates replace.
- xss: overlay copy is static text, not innerHTML of user mnemonic.
- csrf: no new network POST; Clear/Generate stay in-tab.

## Evidence pack

- Playwright S0, S80, S81, S85, S91, S99, S100 (e2e smoke)
- pytest not required this slice (no .py product change)
- hard_gates / validate to be re-run on this draft
- coverage: overlay Continue vs Cancel + Reset path

## Things that look bad but are actually fine

1. Reset no longer uses `window.confirm` (brief: always return to Starter).
2. Dirty leftover `scripts/*.py` and `config/` are not in this commit.
3. S80 remains a native confirm after the Generate overlay by design.

## Cross-review

blocker=0. See `.agents/artifacts/CROSS_REVIEW.md`.
