# PR Draft: P0 lab-safety

**Spec:** `.agents/specs/2026-08-18-p0-lab-safety.md`

## What Problem This Solves

Over-claimed “no disk / no server,” silent session leak of addresses, Seed QR/print without a valid live phrase, Mainnet default, leak-ack missing proxy, light-theme banner contrast.

## Why This Change Was Made

CEO P0 lab-safety for window 6 / bip39lab only. No P1 honesty pass. No visual redesign.

## User Impact

Honest banner; Testnet default; QR/print walls; opt-in Network handoff; proxy-named leak-ack; readable light banner.

## Traceability

| AC | Evidence |
|----|----------|
| Banner | S0 |
| Contrast | S0b |
| Testnet default | S1 tb1p, S5 |
| Goldens | S2–S4 select main |
| No silent session | S13d |
| Seed QR | S15, S15b |
| Handoff | S16 |
| Leak-ack | S32 |
| Generate wall | S80 |

## Red-proof

- red_cmd: `npx playwright test e2e/lab.spec.ts -g "S0 smoke"`
- green_cmd: `npx playwright test e2e/lab.spec.ts -g "S0 smoke"`

## Evidence pack

Playwright + pytest + check_web_e2e at ship.

## Things that look bad but are actually fine

1. Goldens still mainnet — testers select Main. Default is Testnet on purpose.
2. sessionStorage still used for quiz docks and explicit address handoff.
3. Progress/theme localStorage is disclosed in the banner.
