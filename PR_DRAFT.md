# PR Draft: v0.16.23 Starter rail + Beginner/Advanced stills

**Spec:** `.agents/specs/2026-08-20-sba-stills.md`
**Plan:** `.agents/specs/2026-08-20-sba-stills-plan.md`

## What Problem This Solves

Starter First hour was a stacked novel. Beginner equation was gold SVG. Advanced art was a faint SVG.

## Why This Change Was Made

Hold lifted. Locked stills exist. Stamp 0.16.23. Do not Imagine. Do not touch Intermediate.

## User Impact

Starter: numbered rail beside live Mnemonic lab. Beginner: key + dice = lock stills. Advanced: master→child PNG.

## Traceability

| AC | Test |
|----|------|
| Starter rail | S102 |
| Beginner three stills | S103 |
| Intermediate unchanged | S104 |
| Advanced PNG | S105 |
| Overlay OK | S106 |
| Hover | S107 |
| Stamp | S0 |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/faces.spec.ts`

## Threat notes

- secrets: static PNGs
- xss: none
- csrf: none

## Evidence pack

- Playwright S0 S100 S102–S108
- hard_gates

## Things that look bad but are actually fine

1. Live lab is not the PNG screenshot.
2. Intermediate PNGs unchanged.
3. Dirty harness scripts not in this ship.

## Cross-review

blockers=0.

### Obsolete / cleanup (scoped)
Tier A: 0.
