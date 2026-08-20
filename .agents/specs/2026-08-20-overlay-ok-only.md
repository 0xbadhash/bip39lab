# Overlay OK-only

- **Product:** bip39lab
- **Created:** 2026-08-20
- **Status:** ready-for-agent
- **Priority:** P1
- **Stamp:** **0.16.21**
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** `.agents/specs/2026-08-20-overlay-ok-only-plan.md`
- **Tracker:** local
- **Constitution:** AGENTS.md
- **Grill-me:** complete

## Problem Statement

Generate / Validate / Clear still use Cancel + Continue. CEO locked OK-only: one OK button that runs the action.

## Solution

Cherry-pick `c983024` onto 0.16.20 master as **v0.16.21**.
- Each overlay: one **OK**. No Cancel. No Continue.
- OK runs the same handlers as old Continue (`onGenerate` / `deriveNow` / `clearSecrets`).
- Keep 0.16.17 dense first lines.
- Do not reopen 0.16.20 Beginner tiles/visual, 0.16.19 S/I/A, hover, Reset.
- Do not merge ok-wip dirty four-face files.

## User Stories

1. As a learner, I click Generate, read the dense overlay, press OK, and the phrase is generated.
2. Cancel is gone; I do not have a no-op path on these three overlays.

## Testing Decisions

Playwright: one OK per overlay; OK runs action; Cancel/Continue absent; copy intact; S103 Beginner; S106 Reset; S107 hover. Comet + rec-flow same ship.

## Acceptance Criteria

- [ ] Three overlays each have exactly one OK button
- [ ] No Cancel / Continue on those overlays
- [ ] OK runs generate / derive / clear
- [ ] Dense 0.16.17 first lines unchanged
- [ ] Beginner 0.16.20 tiles + visual still there
- [ ] Stamp 0.16.21 lockstep; PW + comet same ship

## Out of Scope

ok-wip four-face rewrite; leftover dirty scripts; other windows; force-retag.

## Grill-me

**Status:** complete
**Date:** 2026-08-20
**Source:** `/tmp/w6-overlay-ok-ship-brief.md` — Do NOT grill.

### G1 Outcome
- Q: Done?
  - A: overlays OK-only at 0.16.21; OK runs the action.
  - Recommended was: that.

### G2 Non-goal / kill
- Q: Not build?
  - A: no reopen 0.16.20 Beginner / 0.16.19 S/I/A / hover / overlay copy / Reset.
  - Recommended was: no reopen those leftovers.

### G3 Wrong product
- Q: Surface?
  - A: bip39lab-ok-ship from origin/master; cherry-pick c983024 only.
  - Recommended was: that.

### G4 Cheapest alternative
- Q: Smallest?
  - A: overlay HTML + app.js OK wire + PW/comet/stamps.
  - Recommended was: that.

### G5 Abuse / failure
- Q: Fail?
  - A: no Cancel; OK is the only path; S80 replace confirm still after Generate OK when a phrase exists.
  - Recommended was: that.

### G6 Verify
- Q: Prove?
  - A: PW+comet+live curl lockstep 0.16.21.
  - Recommended was: that.

### G7 Priority
- Q: Why now?
  - A: hold lifted; this leftover now.
  - Recommended was: this leftover now.

## Clarifications

### 2026-08-20
- Q: Source?
  - A: cherry-pick only c983024; do not merge ok-wip dirty four-face files.

## Handoff

- Next: follow NEXT_SKILL=
