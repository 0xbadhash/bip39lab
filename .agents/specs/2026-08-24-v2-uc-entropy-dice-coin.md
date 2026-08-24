# V2 UC14: dice / coin entropy is not word count

- **Product:** bip39lab
- **Created:** 2026-08-24
- **Status:** ready-for-agent
- **Priority:** P0
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** `.agents/specs/2026-08-24-v2-uc-entropy-dice-coin-plan.md`
- **Tracker:** local
- **Constitution:** AGENTS.md
- **Grill-me:** complete (G1 default; G2–G7 logged as execute-dev defaults)
- **Surface:** `web/v2/` only

## Problem Statement

V2 Generate uses OS randomness. Learners never see that a few dice or coin flips can still mint 12 words while the pad is TOO LOW. Classic `#cardEntPad` already teaches this.

## Solution

UC14 Beginner track: simulated d6 (~2.58 bits) and coin (1 bit). Few rolls → TOO LOW. Build practice words anyway → still TOO LOW. ~50 d6 ≈ 128 bits. Coin path shows 128 flips. Simulated `Math.random`, not CSPRNG. Do not fund.

## User Stories

1. As a learner, I roll a few d6 and see TOO LOW vs 128 bits.
2. As a learner, I still get 12 practice words from a short pad, flagged TOO LOW.
3. As a learner, ~50 d6 (or +10 d6) reaches the 12-word ENT estimate.
4. As a learner, each coin flip adds 1 bit, so 128 flips is the hard path.

## Implementation Decisions

- Same estimates as classic: d6 2.58 bits, coin 1 bit, 12-word 128, 24-word 256.
- SHA-256(roll log) → `mnemonicFromEntropyBytes` like v1.
- Do not replace UC1 OS Generate. Classic pad unchanged.

## Testing Decisions

- Playwright V2-S15: 3 d6 TOO LOW; mint words still TOO LOW; +10 until ≥128; coin +1 bit.
- V2-S0 card count 14.
- `npx playwright test e2e/v2.spec.ts`

## Acceptance Criteria

- [ ] Picker has 14 cards; UC14 title mentions dice or entropy
- [ ] Three d6 → live estimate TOO LOW vs 128 bits
- [ ] Build words on a short pad shows 12 recovery words and TOO LOW
- [ ] After enough d6 (~50 / +10 helper) estimate ≥ 128
- [ ] One coin flip adds ~1 bit; copy says 128 flips for 128 bits
- [ ] Classic `/` `#btnGenerate` still Lab
- [ ] Simulated rolls; never fund

## Out of Scope

Physical RNG. Replacing UC1 Generate. Changing classic `#cardEntPad`.

## Grill-me

**Status:** complete
**Date:** 2026-08-24

### G1 Outcome
- Q: One sentence?
  - A: Operator `/execute_dev` on this spec → recommended default.
  - Recommended was: “A few dice or coin flips can still print 12 words, but the pad is TOO LOW until ~50 d6 (~128 bits) or 128 flips — word count is not entropy.”

### G2 Non-goal / kill
- Q: What not to build?
  - A: Default — no physical dice hardware; no replace UC1 CSPRNG Generate.
  - Recommended was: same.

### G3 Wrong product
- Q: V2 track vs classic pad only?
  - A: Default — V2 UC14; classic pad stays.
  - Recommended was: same.

### G4 Cheapest alternative
- Q: Smallest ship?
  - A: Default — one UC, simulated buttons, +10 d6 for 50-roll path.
  - Recommended was: same.

### G5 Abuse / failure
- Q: How does this fail?
  - A: Default — PRACTICE ONLY; TOO LOW even when words appear; Math.random labelled simulated.
  - Recommended was: fail closed, do not fund.

### G6 Verify
- Q: How prove?
  - A: Default — V2-S15 Playwright + V2 suite.
  - Recommended was: smoke + AC path.

### G7 Priority
- Q: Why now?
  - A: Operator asked then `/execute_dev` — P0.
  - Recommended was: P1 unless user said P0; user said P0 via entropy/safety.

## Clarifications

### 2026-08-24
- Q: New UC number?
  - A: UC14 (next after 13). Default.
