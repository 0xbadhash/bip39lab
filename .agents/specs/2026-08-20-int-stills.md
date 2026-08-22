# Intermediate app-shell stills

- **Product:** bip39lab
- **Created:** 2026-08-20
- **Status:** ready-for-agent
- **Priority:** P1
- **Stamp:** **0.16.22**
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** `.agents/specs/2026-08-20-int-stills-plan.md`
- **Tracker:** local
- **Constitution:** AGENTS.md
- **Grill-me:** complete

## Problem Statement

Intermediate face shows one faint line-art SVG. CEO locked three app-shell stills (keys / hex-shares / share-words).

## Solution

Ship the three locked PNGs as visible Intermediate chapter art at **v0.16.22**. Copy into `web/assets/` (`img-src 'self'`). Keep I1–I4, heading, overlay OK, Beginner visual, Reset, hover.

## User Stories

1. As Intermediate, I see three stills: Multisig keys, Shamir hex shares, SLIP-39 word tiles.
2. As Beginner/Starter/Advanced, my face is unchanged.

## Testing Decisions

Playwright S104: three PNGs visible; old SVG not the visible face art; I1–I4 present. S102/S103/S105–S108 still pass. Comet + rec-flow.

## Acceptance Criteria

- [ ] Three stills on Intermediate, local self-hosted PNG
- [ ] I1–I4 still present
- [ ] Borders readable on dark (#3a4a60 / #3d8bfd)
- [ ] Overlay OK; Beginner visual; Reset; hover kept
- [ ] Stamp 0.16.22 lockstep; PW + comet same ship

## Out of Scope

Imagine again; ok-wip four-face rewrite; leftover dirty scripts; other windows.

## Grill-me

**Status:** complete
**Date:** 2026-08-20
**Source:** `/tmp/w6-int-stills-ship-brief.md` — Do NOT grill.

### G1 Outcome
- Q: Done?
  - A: three locked Intermediate stills live at 0.16.22.
  - Recommended was: that.

### G2 Non-goal / kill
- Q: Not build?
  - A: no reopen 0.16.16–0.16.21 leftovers; do not Imagine again.
  - Recommended was: that.

### G3 Wrong product
- Q: Surface?
  - A: bip39lab-int-stills-ship from origin/master 0.16.21.
  - Recommended was: that.

### G4 Cheapest alternative
- Q: Smallest?
  - A: copy three PNGs + replace Intermediate figure + CSS borders + PW/comet/stamps.
  - Recommended was: that.

### G5 Abuse / failure
- Q: Fail?
  - A: CSP self only; I1–I4 stay; later Advanced hidden.
  - Recommended was: that.

### G6 Verify
- Q: Prove?
  - A: PW+comet+live curl 0.16.22.
  - Recommended was: that.

### G7 Priority
- Q: Why now?
  - A: hold lifted; stills locked.
  - Recommended was: this leftover now.

## Clarifications

### 2026-08-20
- Q: Source files?
  - A: `/home/debian/bip39-imagine-stills/app-shell/intermediate-{keys,hex-shares,share-words}.png` — do not regenerate.

## Handoff

- Next: follow NEXT_SKILL=
