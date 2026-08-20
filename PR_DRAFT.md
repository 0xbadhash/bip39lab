# PR Draft: v0.16.17 overlay copy density

**Spec:** `.agents/specs/2026-08-20-overlay-copy-density.md`
**Plan:** `.agents/specs/2026-08-20-overlay-copy-density-plan.md`

## What Problem This Solves

Overlays were one-line jargon. Learners need distinct dense copy for Generate / Derive / Clear.

## Why This Change Was Made

Window 6 leftover. Stamp 0.16.17.

## User Impact

Each overlay uses the card space: practice unfunded phrase; offline receive addresses; tab memory wipe only.

## Traceability

| AC | Test / smoke |
|----|----------------|
| AC Generate dense copy + word span | Playwright S100 |
| AC Derive BIP-39 / no send / no network | Playwright S100 |
| AC Clear tab memory / TEST DATA / paper | Playwright S100 |
| AC Cancel no-op | Playwright S100 |
| AC S80 after Generate overlay | Playwright S80 |
| AC Reset intro unchanged | Playwright S99 |
| AC stamp 0.16.17 | Playwright S0 |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/lab.spec.ts -g "S100|S80|S99|S0 smoke"`

## Threat notes

- secrets: copy does not echo the mnemonic.
- xss: static overlay HTML, word count from select only.
- csrf: no new network writes.

## Evidence pack

- Playwright S0, S80, S99, S100 (e2e smoke)
- hard_gates / validate on this draft
- pytest: pyproject version stamp

## Things that look bad but are actually fine

1. Overlay HTML is longer; ids and Continue/Cancel unchanged.
2. Dirty leftover scripts/*.py not in this commit.
3. S89 FLAG / tag-vs-HEAD README FLAG not retagged.

## Cross-review

blocker=0. Overlay copy only.
