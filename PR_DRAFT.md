# PR Draft: v0.16.21 overlay OK-only

**Spec:** `.agents/specs/2026-08-20-overlay-ok-only.md`
**Plan:** `.agents/specs/2026-08-20-overlay-ok-only-plan.md`

## What Problem This Solves

Generate / Derive / Clear used Cancel + Continue. CEO locked one OK that runs the action.

## Why This Change Was Made

Hold lifted. Cherry-pick c983024 onto 0.16.20. Stamp 0.16.21.

## User Impact

Each overlay: read dense copy, press OK, action runs. No Cancel. No Continue.

## Traceability

| AC | Test / smoke |
|----|----------------|
| One OK, no Cancel/Continue | Playwright S100 S106 lab overlay |
| OK runs generate | Playwright S108 / S80 |
| Copy 0.16.17 | Playwright S106 |
| Beginner 0.16.20 | Playwright S103 |
| Hover | Playwright S107 |
| Reset | Playwright S106 |
| Stamp 0.16.21 | Playwright S0 |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/faces.spec.ts e2e/lab.spec.ts -g "S0 smoke|S100|S106"`

## Threat notes

- secrets: overlays stay in-tab
- xss: static copy
- csrf: none

## Evidence pack

- Playwright S0 S103 S106 S107 S108
- hard_gates / e2e smoke

## Things that look bad but are actually fine

1. QR/print confirm strings still say “Continue only on…” — not overlay buttons.
2. S80 native replace confirm still after Generate OK.
3. ok-wip four-face dirty files not in this ship.
