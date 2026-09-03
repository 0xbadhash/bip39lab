# V2 classroom cluster, UC33 clock, UC34 BIP tabs

- **Product:** bip39lab
- **Created:** 2026-09-03
- **Status:** ready-for-agent
- **Plan:** `.agents/specs/2026-09-03-v2-classroom-cluster-fsm-plan.md`

## Problem

V2 pads mixed teach and result, dumped Shamir/XOR/timelock on one screen, and classroom faces were cropped or generic. Learners could not see one BIP receive vs change descriptor. Button help sat flush against controls. UC33 three equal buttons felt like slop.

## Solution

Lock the `[ 8.5rem face | blue classroom ]` cluster. Progressive Shamir/XOR/timelock. UC34 BIP then Receive/Change one recipe. Stacked button then help **0.85rem**, help **0.92rem**. UC33 is a clock: heir too soon → 90-day bar → heir again → owner reset. No Sign. Practice only.

## Grill-me

**Status:** complete
**Date:** 2026-09-03
**Mode:** `--from-conversation` (operator already decided on pads)

### G1 Outcome
- Q: What does done look like in one user sentence?
  - A: I see a picture next to the blue story, I click one BIP then receive or change, and the timer is a clock I watch — not three random buttons.
  - Recommended was: same.

### G2 Non-goal / kill
- Q: What must we not build?
  - A: No Electrum KDF, no live CSV/Sign, no Suite clone, no mempool on UC19, no photoreal Imagine, no force-push.
  - Recommended was: fail closed on secrets.

### G3 Wrong product
- Q: Is this classic Lab or V2 tracks?
  - A: V2 `/v2/` tracks only; rooms stay docks.
  - Recommended was: V2.

### G4 Cheapest alternative
- Q: Smallest ship that proves it?
  - A: CSS contain + UC32/33/34 behavior + spacing AC + targeted Playwright.
  - Recommended was: single vertical slice + existing smoke.

### G5 Abuse / failure
- Q: How does this fail or leak?
  - A: Practice phrases only; descriptors public; timer never signs; unknown is not zero.
  - Recommended was: fail closed on secrets.

### G6 Verify
- Q: How do we prove it?
  - A: pytest AC layout + V2-S0/S24/S25/S39/S53; product smoke at release.
  - Recommended was: plugin smoke + one manual path.

### G7 Priority / delay
- Q: Why ship now?
  - A: Operator invoked full ship FSM on the working tree; pads already match the classroom SoT in `web/v2/uc-design.md`.
  - Recommended was: P1; operator said P0 ship now.

## Clarifications

- Face images use `object-fit: contain` in `.v2-face-after` so art is not cropped like the entropy lock.
- Dual stamp: product `0.16.x` vs V2 chip `0.17.N-v2`.
- Leftover `scripts/*.py` and `config/` stay uncommitted.

## Acceptance Criteria

- AC-1: Classroom cluster is `[image | blue box]`; `.v2-face-after img` uses contain, not lock crop.
- AC-2: UC32 Show parts has a face + classroom; XOR faces are distinctive (not the generic stub).
- AC-3: UC33 sequence is Arm → heir fail → animated 90 days → heir practice → owner reset; no Sign.
- AC-4: UC34 refresh shows BIP tabs then Receive/Change; only that public descriptor.
- AC-5: Stacked pad button then next sibling has **0.85rem**; pad `.control-help` is **0.92rem**.
- AC-6: Playwright V2-S24, V2-S25/S53, V2-S0 still express the new clicks.

## Out of Scope

- Live CSV / Sign / broadcast
- Electrum address generation
- Classic Lab redesign
- Imagine photoreal
- Force-push / leftover scripts commit

## Further Notes

Constitution: practice-only, no secret retention. Tension: none.
