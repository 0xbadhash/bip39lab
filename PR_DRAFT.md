# PR Draft: v0.16.19 level faces

**Spec:** `.agents/specs/2026-08-20-level-faces.md`
**Plan:** `.agents/specs/2026-08-20-level-faces-plan.md`

## What Problem This Solves

Later-level cards mixed onto earlier faces. Four CEO-locked faces need a live stamp.

## Why This Change Was Made

Window 6 leftover. 0.16.18 hover is locked. Stamp 0.16.19.

## User Impact

Starter / Beginner / Intermediate / Advanced are separate faces. 12-check stays inventory. Six nav items. Local DS chapter SVGs.

## Traceability

| AC | Test / smoke |
|----|----------------|
| Starter later hidden | Playwright S102 |
| Beginner Q1–Q4 | Playwright S103 |
| Intermediate I1–I4 | Playwright S104 |
| Advanced A1–A4 | Playwright S105 |
| Reset + overlays kept | Playwright S106 S99 S100 |
| Hover kept | Playwright S107 S101 |
| Rec-flow | Playwright S108 |
| Stamp 0.16.19 | Playwright S0 |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/faces.spec.ts`

## Threat notes

- secrets: no new network; CSP img-src self for SVGs
- xss: static SVGs from repo
- csrf: none

## Evidence pack

- Playwright S102–S108 + S0
- hard_gates / e2e smoke

## Things that look bad but are actually fine

1. Alias SVGs duplicate chapter files.
2. 12-check boards exist in DOM but are not nav pages.
3. hook_ds_chapters.py and node_modules not committed.

## Cross-review

blockers=0 major=0 nit=0. Personas: security / maintainability / domain — none.

### Obsolete / cleanup (scoped)
Tier A: 0.
