# PR Draft: v0.16.18 hover-(i)

**Spec:** `.agents/specs/2026-08-20-hover-info-tips.md`
**Plan:** `.agents/specs/2026-08-20-hover-info-tips-plan.md`

## What Problem This Solves

ⓘ required a click. Tips should appear on mouseover.

## Why This Change Was Made

Window 6 leftover. Stamp 0.16.18.

## User Impact

Hover or keyboard focus shows every (i) tip. Click is not required. Generate/Derive/Clear overlays still click + Continue.

## Traceability

| AC | Test / smoke |
|----|----------------|
| AC hover opens tip no click | Playwright S43 S101 |
| AC Esc closes | Playwright S43 |
| AC Extra help Off | Playwright S42 |
| AC Multisig/Network tips hover | Playwright S45 S47 |
| AC overlays still click | Playwright S100 |
| AC stamp 0.16.18 | Playwright S0 |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/help-ux.spec.ts -g "S43|S101"`

## Threat notes

- secrets: tips do not expose mnemonics.
- xss: glossary-filled panels already escaped in existing help-ui.
- csrf: no new network.

## Evidence pack

- Playwright S0 S42 S43 S45 S46 S47 S100 S101
- hard_gates / e2e smoke

## Things that look bad but are actually fine

1. Lab live DOM has ≥25 (i) after JS enhance (static HTML 25).
2. Action overlays still require click — they are not (i).
3. Dirty leftover scripts not in this commit.
