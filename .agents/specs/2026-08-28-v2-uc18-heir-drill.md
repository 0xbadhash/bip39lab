# V2 UC18 if I cannot speak — heir object drill

- **Product:** bip39lab
- **Created:** 2026-08-28
- **Updated:** 2026-08-28
- **Status:** ready-for-agent
- **Priority:** P0
- **Plan:** `.agents/specs/2026-08-28-v2-uc18-heir-drill-plan.md`
- **Surface:** `web/v2/` UC18 only
- **Grill-me:** complete
- **CEO lock:** Operator: UC18 is AI slop — too simple, useless, poor English. Redo as a failure drill. No signer. No Imagine. Classic `/` cache-bust only. leftover `scripts/*.py` uncommitted.

## Problem Statement

UC18 was two lecture pads: sealed packet vs 2-of-3, an email scold button, and a checkbox “we opened while alive.” Copy mashed people and objects (“lawyer or safe”). Nothing failed. Nothing was built. Inheritance is not a pep talk.

## Solution

Three content pads plus quiz/finish (special-case like UC20 so quiz is not stolen at step 2):

1. **Heirs fail on objects** — four kits: chat leak, words without extra secret, one key of three, first try after you cannot speak. Next locked until all four are tapped.
2. **Build the packet** — shape (one signer / 2-of-3 keys / 2-of-3 shares). Envelope ticks: descriptor, where objects live, next drill date. Refuse live words, extra secret in the same envelope, chat screenshot. Result table in `#v2InhPackOut`.
3. **Open while alive** — fail at least once, then sit-with-them only if packet is valid. Green `#v2InhLiveOut`. No Sign. Not a will.

Teach vs result: `teachBox` vs kit/table/try lines. Chip `v0.17.127-v2`. Product stamp on ship.

## Acceptance

| ID | Criterion |
|----|-----------|
| AC-1 | Four fail kits; Next off until all four tapped. Chat / missing 25th / one key / later each print a fail line. |
| AC-2 | Packet build: need shape + desc + where + date; refuse seed / extra secret / chat. Table is lab result. |
| AC-3 | Heir try: live blocked until one fail and a valid packet; then green. No Sign. |
| AC-4 | Quiz covers missing extra secret, packet map, 2-of-3, open while alive, not a will. Chip `0.17.127-v2`. |
| AC-5 | leftover scripts uncommitted. No force-push. Classic Lab Generate unchanged except cache-bust. |

## Grill-me

**Status:** complete
**Date:** 2026-08-28

### G1 Outcome
- Q: Done in one sentence?
  - A: UC18 is a heir-object drill: fail kits, map packet, open while alive.

### G2 Non-goal
- A: No will, no lawyer UI, no signer, no Imagine, no UC21/24/25 reopen.

### G3 Wrong product
- A: Not UC33 timer. Not UC16 restore-self. People + missing objects.

### G4 Cheapest
- A: Replace `uc18` + handlers. Special-case `ucJob` like UC20.

### G5 Abuse
- A: Cannot green-tick without fail + valid packet. No mnemonic persist.

### G6 Verify
- A: Playwright V2-S51. pytest AC stubs.

### G7 Priority
- A: Operator called current UC18 slop.

## Testing Decisions

- Red: checkbox-only; Sign; packet OK with seed+pp
- Green: V2-S51
- pytest `tests/test_ac_v2_uc18_heir_drill.py`

## Out of Scope

- UC21/24/25 lecture redos. leftover scripts. Live nginx.
