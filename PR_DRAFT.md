# PR Draft: v0.16.8 Compare opt-in always visible

**Spec:** `.agents/specs/2026-08-18-compare-optin-visible.md`

## What Problem This Solves

Compare opt-in was Extra-help-only.

## Why This Change Was Made

CEO leftover. Bump 0.16.8. Do not reopen P0 or rec-flow.

## Traceability

| AC | Evidence |
|----|----------|
| Opt-in Extra help Off | S82 `#cmpHonestyIntro` |
| nothing is sent banned | S82 |
| Stamp 0.16.8 | S0 chip HTML |

## Red-proof

- red_cmd: `npx playwright test e2e/lab.spec.ts -g S82`
- green_cmd: `npx playwright test e2e/lab.spec.ts -g S82`

## Evidence pack

pytest 105 · Playwright 103

## Things that look bad but are actually fine

1. Step 1 Extra help still repeats opt-in.
2. S81/S11b unchanged.
3. Lab CSP still connect-src none.
