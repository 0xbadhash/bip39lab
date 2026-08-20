# Hover-(i) tips — no click required

- **Product:** bip39lab
- **Created:** 2026-08-20
- **Status:** ready-for-agent
- **Priority:** P1
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** `.agents/specs/2026-08-20-hover-info-tips-plan.md`
- **Tracker:** local
- **Constitution:** AGENTS.md
- **Grill-me:** complete

## Problem Statement

ⓘ tips only open on click. Learners should see the tip on mouseover. Click must not be required.

## Solution

Every `.help-tip` / `.help-tip-btn` / `.help-tip-panel` shows on hover and keyboard focus-within. Hide on mouseleave, blur, Escape. Extra help Off still hides non-safety tips. Action overlays (Generate/Derive/Clear) stay click + Continue.

## User Stories

1. As a learner, I hover any (i) and read the tip without clicking.
2. As a keyboard user, I Tab to (i) and see the tip; Escape hides it.
3. As a learner, I still click Generate and Continue on the action overlay.

## Implementation Decisions

- `web/js/help-ui.js` + `web/css/app.css`; HTML tips keep title/aria.
- Do not use `hidden` as a click-only gate.
- Do not change overlay ids or 0.16.17 copy.

## Testing Decisions

- Playwright: hover instead of click on tips (S43, S45–S47, glossary). Prove no prior click.
- Sample Multisig/Network/Shamir/SLIP-39. Rec-flow includes hover-(i) + overlays still click/Continue.

## Acceptance Criteria

- [ ] All 59 `.help-tip-btn` use hover/focus, not click-required.
- [ ] Extra help Off still hides non-safety (S42). Safety (i) hover.
- [ ] S80/S100 overlays still click + Continue.
- [ ] Stamp 0.16.18 lockstep; Playwright + comet same ship.

## Out of Scope

- Other windows; force-retag; dirty scripts; reopening locked PASSes.

## Grill-me

**Status:** complete
**Date:** 2026-08-20

### G1 Outcome
- Q: Done?
  - A: hover-(i) live, click not required.
  - Recommended was: hover-(i) live, click not required.

### G2 Non-goal / kill
- Q: Not build?
  - A: no reopen/no other windows.
  - Recommended was: no reopen/no other windows.

### G3 Wrong product
- Q: Surface?
  - A: bip39lab only.
  - Recommended was: bip39lab only.

### G4 Cheapest alternative
- Q: Smallest?
  - A: help-ui.js + CSS + HTML tips + PW/comet/stamps.
  - Recommended was: help-ui.js + CSS + HTML tips + PW/comet/stamps.

### G5 Abuse / failure
- Q: Fail?
  - A: action overlays unchanged; Cancel no-op; S80 after Generate.
  - Recommended was: action overlays unchanged; Cancel no-op; S80 after Generate.

### G6 Verify
- Q: Prove?
  - A: PW+comet+live curl.
  - Recommended was: PW+comet+live curl.

### G7 Priority
- Q: Why now?
  - A: this leftover now.
  - Recommended was: this leftover now.

## Clarifications

### 2026-08-20
- Q: Esc while hovered?
  - A: Hide on Escape even if pointer is over the (i); resume on next mouseenter.

## Handoff

- Next: follow NEXT_SKILL=
