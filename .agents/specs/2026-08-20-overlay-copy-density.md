# Overlay copy density (Generate / Derive / Clear)

- **Product:** bip39lab
- **Created:** 2026-08-20
- **Status:** ready-for-agent
- **Priority:** P1
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** `.agents/specs/2026-08-20-overlay-copy-density-plan.md`
- **Tracker:** local
- **Constitution:** AGENTS.md
- **Grill-me:** complete

## Problem Statement

The three Lab overlays are too thin (one-line jargon). Learners need the space to understand Generate vs Validate & derive vs Clear secrets.

## Solution

Rewrite `#overlayGenerateBody`, `#overlayDeriveBody`, and `#overlayClearBody` to the locked dense copy. Keep three overlay ids. Cancel still no-ops; Continue still runs the existing action. S80 native replace confirm still after Generate Continue when a phrase exists. Keep `#overlayGenerateWords` inside Generate body.

## User Stories

1. As a learner, I open Generate and read that this is a practice unfunded English phrase that stays in this tab.
2. As a learner, I open Validate & derive and read that it checks BIP-39 words and fills receive addresses offline, with no send/balance/network.
3. As a learner, I open Clear secrets and read that it wipes this tab’s memory only, not a real wallet.

## Implementation Decisions

- HTML bodies in `web/index.html` only for copy; Playwright + comet same ship.
- Do not reopen 0.16.16 Reset intro, P0, S85, S98, S89 FLAG, tag-vs-HEAD README FLAG.

## Testing Decisions

- Update S100 (and comet S100) to the new prose.
- Rec-flow: form, results, missing-data, next-step, plain English, mobile, errors.
- Helper `clickLabAction` unchanged.

## Acceptance Criteria

- [ ] Generate body includes practice recovery phrase, English, `#overlayGenerateWords`, not funded, this tab, not a funded seed.
- [ ] Derive body includes valid BIP-39, receive addresses, in this tab, no send, no balance, no network; Network only after opt-in.
- [ ] Clear body includes wipe phrase/derived data from this tab, not a real wallet, cannot reach coins, TEST DATA, paper unchanged.
- [ ] Three ids stay; Cancel no-op; Continue existing action; S80 after Generate overlay.
- [ ] Stamp 0.16.17 lockstep; Playwright + comet same ship.

## Out of Scope

- Other windows; force-retag; dirty scripts/*.py and config/; reopening locked PASSes.

## Grill-me

**Status:** complete
**Date:** 2026-08-20
**Note:** Operator locked all decisions. No live grill.

### G1 Outcome
- Q: Done look like?
  - A: Dense overlay copy live.
  - Recommended was: dense overlay copy live.

### G2 Non-goal / kill
- Q: Not build?
  - A: No reopen / no other windows.
  - Recommended was: no reopen/no other windows.

### G3 Wrong product
- Q: Surface?
  - A: bip39lab only.
  - Recommended was: bip39lab only.

### G4 Cheapest alternative
- Q: Smallest ship?
  - A: HTML bodies + PW/comet/stamps.
  - Recommended was: HTML bodies + PW/comet/stamps.

### G5 Abuse / failure
- Q: Fail?
  - A: Cancel no-op; S80 after Generate.
  - Recommended was: Cancel no-op; S80 after Generate.

### G6 Verify
- Q: Prove?
  - A: PW+comet+live curl.
  - Recommended was: PW+comet+live curl.

### G7 Priority
- Q: Why now?
  - A: This leftover now.
  - Recommended was: this leftover now.

## Clarifications

### 2026-08-20
- Q: Copy exact?
  - A: Brief copy; may tighten; must not return to one-liners; each card different.

## Handoff

- Next: `/execute_dev`
