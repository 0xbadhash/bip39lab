# PR Draft: v0.16.24 slim Starter First-hour rail

**Spec:** `.agents/specs/2026-08-21-slim-rail.md`
**Plan:** `.agents/specs/2026-08-21-slim-rail-plan.md`

## What Problem This Solves

Starter First hour was a fat 8-card rail with Go/Mark done on every step. CEO locked slim numbered labels plus one action pair for the selected step.

## Why This Change Was Made

Hold lifted. Slim still is composition lock only — not a screenshot. Stamp 0.16.24. Do not Imagine. Do not copy CATALYSTS.

## User Impact

Eight short numbered labels beside the live Mnemonic lab. Click a step, then Go / Mark done for that step. Clear secrets stays filled red.

## Traceability

| AC | Test / smoke |
|----|----------------|
| AC slim labels no per-step Go | Playwright S102 |
| AC selected-step Go/Mark done loop | Playwright learn first-hour / S102 |
| AC Mnemonic title | Playwright S102 |
| AC Clear secrets filled danger | Playwright S102 |
| AC Intermediate stills | Playwright S104 |
| AC Beginner stills | Playwright S103 |
| AC Advanced PNG | Playwright S105 |
| AC Overlay OK | Playwright S106 S100 |
| AC Hover | Playwright S107 |
| AC rec-flow | Playwright S108 |
| AC stamp 0.16.24 | Playwright S0 |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/faces.spec.ts -g S102`

## Threat notes

- secrets: none
- xss: none
- csrf: none

## Evidence pack

- hard_gates / pr_validator (this ship)
- Playwright S0 S100 S102–S108 + learn first-hour
- pytest via compliance_engine on /pr_review --validate

## Things that look bad but are actually fine

1. Live lab is not the PNG screenshot.
2. Do not copy CATALYSTS from the still.
3. Dirty harness scripts not in this ship.

## Cross-review

blockers=0.

### Obsolete / cleanup (scoped)
Tier A: 0.
