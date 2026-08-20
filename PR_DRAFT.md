# PR Draft: v0.16.22 Intermediate stills

**Spec:** `.agents/specs/2026-08-20-int-stills.md`
**Plan:** `.agents/specs/2026-08-20-int-stills-plan.md`

## What Problem This Solves

Intermediate used one faint SVG. CEO locked three app-shell stills.

## Why This Change Was Made

Hold lifted. Stamp 0.16.22. Do not Imagine again.

## User Impact

Intermediate shows Multisig keys, Shamir hex shares, SLIP-39 word tiles. I1–I4 unchanged.

## Traceability

| AC | Test / smoke |
|----|----------------|
| Three PNGs visible | Playwright S104 |
| I1–I4 | Playwright S104 |
| Beginner | Playwright S103 |
| Overlay OK | Playwright S106 |
| Hover | Playwright S107 |
| Stamp 0.16.22 | Playwright S0 |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/faces.spec.ts -g S104`

## Threat notes

- secrets: static PNGs
- xss: none
- csrf: none

## Evidence pack

- Playwright S0 S102–S108
- hard_gates / e2e smoke

## Things that look bad but are actually fine

1. Old intermediate-keys-shares.svg remains on disk unused as face art.
2. Still files are Imagine JPEGs saved as PNG.
3. Dirty harness scripts not in this ship.

## Cross-review

blockers=0 major=0 nit=0.

### Obsolete / cleanup (scoped)
Tier A: 0. Old SVG unused as face art.
