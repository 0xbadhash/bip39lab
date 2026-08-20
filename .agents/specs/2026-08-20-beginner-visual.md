# Beginner visual (locked mock)

- **Product:** bip39lab
- **Created:** 2026-08-20
- **Status:** ready-for-agent
- **Priority:** P1
- **Stamp:** **0.16.20**
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** `.agents/specs/2026-08-20-beginner-visual-plan.md`
- **Tracker:** local
- **Constitution:** AGENTS.md
- **Grill-me:** complete

## Problem Statement

Beginner still shows heading novels (Guided quiz, Go to Guided quiz, 0/4 chip heading, hidden placeholder SVG). CEO locked a four-tile face with a visible key + dice = seed visual.

## Solution

Ship Beginner-only restyle at **v0.16.20**:
- Chapter “Passphrase and entropy”
- Visible composed visual: key + dice = stronger seed; labels; bar Too few dice → 128 bits
- Four Q1–Q4 tiles with Go try / Mark passed
- No Guided quiz headings on the face
- Intermediate hidden; Starter collapsed; 6 nav unchanged
- Do not reopen S/I/A, hover, overlays Continue/Cancel, Reset, P0/S85/S98
- Do not merge ok-wip

## User Stories

1. As a Beginner, I see tiles and the mock visual, not a quiz novel.
2. As a Starter, my face is unchanged except the lab stays collapsed when I pick Beginner.
3. As Intermediate/Advanced, my face is unchanged.

## Testing Decisions

Playwright S103 + S108 updated; S102/S104/S105/S106/S107 stay passing. Comet rec-flow Beginner mock.

## Acceptance Criteria

- [ ] No “Guided quiz (self-check)” or “0 / 4” heading novel on Beginner
- [ ] Q1–Q4 tiles visible as a grid
- [ ] Visual key+dice=seed visible, not hidden hook, not beginner-seed placeholder
- [ ] Intermediate hidden; Starter collapsed
- [ ] Overlay Cancel+Continue; hover kept; Reset exact intro
- [ ] Stamp 0.16.20 lockstep; PW + comet same ship

## Out of Scope

ok-wip OK-only overlays; restyling S/I/A; leftover dirty scripts; other windows.

## Grill-me

**Status:** complete
**Date:** 2026-08-20
**Source:** `/tmp/w6-beginner-visual-brief.md` — Do NOT grill.

### G1 Outcome
- Q: Done?
  - A: Beginner face matches locked mock at next stamp (tiles + key/dice/seed visual; no Guided quiz heading).
  - Recommended was: that outcome.

### G2 Non-goal / kill
- Q: Not build?
  - A: no reopen 0.16.19 S/I/A, 0.16.18 hover, 0.16.17 overlays Continue/Cancel, 0.16.16 Reset, P0/S85/S98.
  - Recommended was: no reopen those leftovers.

### G3 Wrong product
- Q: Surface?
  - A: bip39lab-beginner-wip only; ok-wip not shipped.
  - Recommended was: beginner-wip only.

### G4 Cheapest alternative
- Q: Smallest?
  - A: index + learn-levels + CSS + composed Beginner visual + PW/comet/stamps.
  - Recommended was: that set.

### G5 Abuse / failure
- Q: Fail?
  - A: Intermediate hidden; Starter collapsed; 6 nav unchanged.
  - Recommended was: that.

### G6 Verify
- Q: Prove?
  - A: PW+comet+live curl lockstep 0.16.20.
  - Recommended was: that.

### G7 Priority
- Q: Why now?
  - A: this leftover now.
  - Recommended was: this leftover now.

## Clarifications

### 2026-08-20
- Q: SVG vs CSS?
  - A: Compose local self-hosted SVG and/or CSS matching the mock. CSP img-src 'self'. Do not hook beginner-seed.svg as-is.

## Handoff

- Next: follow NEXT_SKILL=
