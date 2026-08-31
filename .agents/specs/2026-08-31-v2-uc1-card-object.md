# V2 UC1 pad 1 — look at the numbered card (Option A)

- **Product:** bip39lab
- **Created:** 2026-08-31
- **Status:** ready-for-agent
- **Priority:** P0
- **Plan:** `.agents/specs/2026-08-31-v2-uc1-card-object-plan.md`
- **Surface:** `/v2/` UC1 step 1
- **Grill-me:** complete

## Problem Statement

Pad 0 now makes the list. Pad 1 still repeated entropy lock+meter and warned about receive addresses before any address existed.

## Solution

Pad 1 is the object pad: numbered cells = backup. One classroom, a bits chip, the same card, checkbox. Address lesson stays on pad 2. No second entropy stack.

## User Stories

1. As a learner, I look at the numbered grid I just made, so I know the card is the backup.
2. As a learner, I am not shown mailboxes yet, so I do not mix locker combo and address.

## Implementation Decisions

- Keep Do / Do not.
- Chip `N words · B bits` only — not lock + orange + entropy classroom.
- Last word = checksum (i). Not UC16 type-back.

## Testing Decisions

- pytest AC: step 1 HTML has `v2CardWhat`, chip, no `entropyHtml`.
- Playwright S1: after first Pause, `#v2CardWhat` visible; `#v2OsEnt` absent.

## Acceptance Criteria

- [ ] AC-1 `#v2CardWhat` three-line classroom; last word checksum (i).
- [ ] AC-2 `#v2EntChip` shows word count and bits; no `#v2OsEnt` / `#v2EntropyWhat` on this pad.
- [ ] AC-3 Do not: photograph/screenshot; mailbox comes next. Checkbox “I have looked at the numbered cells”.
- [ ] Product smoke commands succeed
- [ ] No secrets committed

## Out of Scope

- UC16 restore typing
- Merge/delete pad 1 (Option B)
- Hide/uncover (Option C)
- Sign / Imagine / Suite

## Grill-me

**Status:** complete  
**Date:** 2026-08-31

### G1 Outcome
- Q: Done?
  - A: Learner looks at numbered cells as the backup object, then may go to addresses.

### G2 Non-goal / kill
- Q: Kill?
  - A: Do not type-back restore. Do not teach mailbox on this pad.

### G3 Wrong product
- Q: Wrong product?
  - A: No — V2 First wallet track.

### G4 Cheapest alternative
- Q: Cheapest?
  - A: Delete the pad (Option B). Operator chose A.

### G5 Abuse / failure
- Q: Abuse?
  - A: Still practice words. Do not photograph a funded backup.

### G6 Verify
- Q: Verify?
  - A: S1 after Pause: classroom + chip; no entropy stack.

### G7 Priority
- Q: Why now?
  - A: Pad 0 Option 1 shipped in tree; pad 1 was leftover lecture.

## Handoff

- Next: `/execute_dev` then full ship FSM
