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

| AC | Test / smoke |
|----|----------------|
| AC Starter 8-step rail beside live lab | Playwright S102 |
| AC Beginner three stills not gold SVG | Playwright S103 |
| AC Intermediate three stills unchanged | Playwright S104 |
| AC Advanced PNG not faint SVG | Playwright S105 |
| AC Overlay OK; Reset exact | Playwright S106 S100 |
| AC Hover | Playwright S107 |
| AC rec-flow | Playwright S108 |
| AC stamp 0.16.23 | Playwright S0 |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/faces.spec.ts`

## Threat notes

- secrets: static PNGs
- xss: none
- csrf: none

## Evidence pack

- hard_gates / pr_validator (this ship)
- Playwright S0 S100 S102–S108 local smoke
- pytest via compliance_engine on /pr_review --validate

## Things that look bad but are actually fine

1. Live lab is not the PNG screenshot.
2. Intermediate PNGs unchanged.
3. Dirty harness scripts not in this ship.

## Cross-review

blockers=0.

### Obsolete / cleanup (scoped)
Tier A: 0.
