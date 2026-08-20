# Starter rail + Beginner/Advanced stills

- **Product:** bip39lab
- **Created:** 2026-08-20
- **Status:** ready-for-agent
- **Priority:** P1
- **Stamp:** **0.16.23**
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** `.agents/specs/2026-08-20-sba-stills-plan.md`
- **Tracker:** local
- **Constitution:** AGENTS.md
- **Grill-me:** complete

## Problem Statement

Starter First hour is a stacked novel, not the locked numbered rail beside the lab. Beginner equation is gold SVG. Advanced chapter art is a faint SVG.

## Solution

Ship locked stills at **v0.16.23**:
- Starter: 8-step rail beside working Mnemonic lab (not a screenshot of the page).
- Beginner: three PNGs key + dice = lock.
- Advanced: advanced-master-child.png + keep “This site is not a wallet” + A1–A4.
- Do not touch Intermediate three stills.

## User Stories

1. As Starter I see 8 short numbered steps beside Generate / Validate / Clear.
2. As Beginner I see key, dice, lock stills.
3. As Advanced I see the master→child still.

## Testing Decisions

S102 rail labels + mnemonic beside; S103 three beginner PNGs not gold SVG; S104 Intermediate stills; S105 Advanced PNG; S106 OK overlay; S107 hover; S108 rec-flow.

## Acceptance Criteria

- [ ] Starter 8-step rail beside live lab
- [ ] Beginner three stills
- [ ] Advanced PNG not faint SVG
- [ ] Intermediate three stills unchanged
- [ ] Overlay OK; Reset; hover
- [ ] Stamp 0.16.23 lockstep; PW + comet

## Out of Scope

Imagine; Intermediate HTML/PNG; leftover dirty scripts.

## Grill-me

**Status:** complete
**Date:** 2026-08-20
**Source:** `/tmp/w6-sba-ship-brief.md`

### G1 Outcome
- A: Starter rail + Beginner/Advanced stills at 0.16.23.

### G2 Non-goal / kill
- A: no Imagine; no Intermediate change; no reopen 0.16.16–0.16.22 leftovers.

### G3 Wrong product
- A: bip39lab-sba-ship from origin/master 0.16.22.

### G4 Cheapest alternative
- A: copy five PNGs + rail layout + swap figures.

### G5 Abuse / failure
- A: live lab not a static screenshot; CSP self.

### G6 Verify
- A: PW+comet+live curl 0.16.23.

### G7 Priority
- A: hold lifted; stills locked.

## Clarifications

### 2026-08-20
- Q: PNG vs live lab?
  - A: PNG is layout lock. Do not replace working lab with a screenshot.

## Handoff

- Next: follow NEXT_SKILL=
