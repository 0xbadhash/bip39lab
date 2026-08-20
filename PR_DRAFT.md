# PR Draft: v0.16.20 Beginner visual

**Spec:** `.agents/specs/2026-08-20-beginner-visual.md`
**Plan:** `.agents/specs/2026-08-20-beginner-visual-plan.md`

## What Problem This Solves

Beginner still showed Guided quiz heading novels and a hidden placeholder SVG. The locked mock is four tiles plus a visible key + dice = seed visual.

## Why This Change Was Made

Window 6 leftover. 0.16.19 S/I/A locked. Stamp 0.16.20.

## User Impact

Beginner learners see Passphrase and entropy, the mock visual, and Q1–Q4 tiles. Overlays stay Cancel + Continue. Starter/Intermediate/Advanced faces unchanged.

## Traceability

| AC | Test / smoke |
|----|----------------|
| No Guided quiz heading | Playwright S103 |
| Q1–Q4 tiles | Playwright S103 |
| Visible key/dice visual | Playwright S103 |
| Intermediate hidden; Starter collapsed | Playwright S103 |
| Rec-flow | Playwright S108 |
| S/I/A not reopened | Playwright S102 S104 S105 |
| Overlays Continue/Cancel | Playwright S106 |
| Hover | Playwright S107 |
| Stamp 0.16.20 | Playwright S0 |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/faces.spec.ts`

## Threat notes

- secrets: local SVG only
- xss: static asset
- csrf: none

## Evidence pack

- Playwright S102–S108 S0
- hard_gates / e2e smoke

## Things that look bad but are actually fine

1. quizStatusBoard still exists as visually-hidden inventory, not a heading.
2. quizSummary chip is visually-hidden for JS counters.
3. ok-wip OK-only overlays were not merged.

## Cross-review

blockers=0 major=0 nit=0. Personas: security / maintainability / domain — none.

### Obsolete / cleanup (scoped)
Tier A: 0.
