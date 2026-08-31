# V2 UC1 paste verdicts, address pad, three quiz items

- **Product:** bip39lab
- **Created:** 2026-08-31
- **Status:** ready-for-agent
- **Priority:** P0
- **Plan:** `.agents/specs/2026-08-31-v2-uc1-paste-quiz-plan.md`
- **Surface:** `/v2/` UC1 paste, receive-address pad, quiz
- **Grill-me:** complete

## Problem Statement

Paste of 12 dictionary words blocked practice when the checksum failed. Show receive addresses still showed the entropy lock stack. Quiz had one question.

## Solution

Paste button reports three verdicts: not at all; words OK checksum not (card still loads); all fine. Receive-address pad has no lock/meter. Quiz has three questions. Continue still needs every correct sentence.

## User Stories

1. As a learner, I paste my own words and see whether they are junk, dictionary-but-checksum-fail, or valid BIP-39.
2. As a learner, I look at mailboxes without a second entropy lecture.
3. As a learner, I answer three quiz items on fund, backup object, and checksum.

## Implementation Decisions

- Load card on checksum fail; do not derive addresses (`mem.bip39Ok === false`).
- `wordlist.js` on `/v2/` for dictionary membership.
- `quizBank` of three items on UC1 step 4.

## Testing Decisions

- pytest: paste copy + step 2 no `entropyHtml`.
- Playwright V2-S27 three paste paths; V2-S12 three `.v2-quiz-q`.

## Acceptance Criteria

- [ ] AC-1 Paste: not at all / words+checksum fail / all fine; fail still fills the card.
- [ ] AC-2 UC1 step 2 has no `entropyHtml`.
- [ ] AC-3 Quiz bank has three questions.
- [ ] Product smoke commands succeed
- [ ] No secrets committed

## Out of Scope

- Auto-fix last word
- Funded backups
- Sign / Imagine

## Grill-me

**Status:** complete  
**Date:** 2026-08-31

### G1 Outcome
- Q: Done?
  - A: Three paste verdicts; address pad clean; three quiz items.

### G2 Non-goal / kill
- Q: Kill?
  - A: Do not treat checksum-fail lists as valid entropy or derive from them.

### G3 Wrong product
- Q: Wrong product?
  - A: No — V2 UC1.

### G4 Cheapest alternative
- Q: Cheapest?
  - A: Keep blocking checksum-fail. Operator asked to practice the card.

### G5 Abuse / failure
- Q: Abuse?
  - A: Still “do not paste a funded backup.” Derive refused on checksum fail.

### G6 Verify
- Q: Verify?
  - A: S27 + S12 + pytest AC.

### G7 Priority
- Q: Why now?
  - A: Operator paste drill + quiz expand after 0.16.84 pad layout.

## Handoff

- Next: `/execute_dev` then full ship FSM
