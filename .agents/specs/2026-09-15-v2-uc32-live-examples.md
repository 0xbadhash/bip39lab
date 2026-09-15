# V2 UC32 SeedXOR live examples (N-word + lab results)

- **Product:** bip39lab
- **Created:** 2026-09-15
- **Status:** ready-for-agent
- **Priority:** P0
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** `.agents/specs/2026-09-15-v2-uc32-live-examples-plan.md`
- **Tracker:** local
- **Constitution:** AGENTS.md
- **Grill-me:** complete
- **Brief:** `/opt/second-brain/vault/agent-tasks/BRIEF-W6-BIP39-UC32-LIVE-EXAMPLES-2026-09-15.md`

## Problem Statement

On UC32 SeedXOR classroom, advancing to split does not clearly show where the live seed phrase is. Split is 12-hardcoded (button copy + `xorCanSplit` length===12). Recover / Hide-one / Combine only update control-help messages — learners do not see word grids or match-fail on screen.

## Solution

When the pad advances to split, the live source mnemonic is visible as a word grid. Split accepts true BIP-39 lengths 12/15/18/21/24 (no silent truncate). Hide-one fails with a visible lab result; Combine-all restores matching source words on screen (not stubs only).

## User Stories

1. As a learner, when I tap "Next: split this phrase", I see the source words clearly so I know what is being split.
2. As a learner with a 15–24 word practice card, I can split that full length without the pad forcing or cutting to 12.
3. As a learner, Hide one part shows a visible fail (lab result / bad state), not only a help line.
4. As a learner, Combine all parts shows the recovered source words matching the original on screen.

## Implementation Decisions

- Surface: `web/v2/js/v2-app.js` `uc32()` steps 0–3 + xor handlers (~3324+, ~9648+); picker/job copy that still says "12-word" where it means N-word; `web/v2/compare.md` UC32 row; e2e `V2-S23` / `V2-S52` (+ extend for non-12 proof).
- Classroom N-of-N SeedXOR only — not Shamir, not SeedXOR.com, no QR/fund.
- Do not reopen P0 isolation / closed PASSes unless this UI touches those walls.
- VERSION bump past 0.16.89; lockstep VERSION === site-version.js === comet Product === PLAYWRIGHT_LAST === visible chip.
- Desk-board one row ship-start → ready; scorecard Boss when READY; never brief Bob.

## Testing Decisions

- Red first: Playwright assertions for (a) visible source on split step, (b) ≥1 non-12 length splits, (c) hide-one visible fail, (d) combine-all matching source words on screen — must fail before impl.
- Green: same Playwright + targeted pytest if any; product smoke at release.
- Same-ship Playwright + E2E comet updates.

## Acceptance Criteria

- [ ] AC-1: On split step ("Next: split this phrase" / step 1), source mnemonic is visibly shown (word grid / locked card), not only a status message.
- [ ] AC-2: Split works for at least one non-12 length in {12,15,18,21,24}; no silent truncate; UI no longer hardcodes "12-word" as the only allowed length.
- [ ] AC-3: Hide-one fails with a visible lab result (msg-bad + visible fail presentation beyond stub-only help).
- [ ] AC-4: Combine-all restores matching source words on screen (visible word grid equals source).
- [ ] AC-5: VERSION bumped past 0.16.89; lockstep stamps; Playwright V2-S23/V2-S52 (extended) + comet aligned.
- [ ] AC-6: compare.md UC32 row updated; no secrets; classroom locks held.

## Out of Scope

- Shamir / SLIP-39 / SeedXOR.com calculator
- QR / fund / Network for XOR parts
- Reopen P0 isolation or closed QA PASSes unless walls touched
- w4 / w7 windows
- Briefing Bob (READY-FOR-E2E Boss only)

## Grill-me

**Status:** complete
**Date:** 2026-09-15
**Mode:** `--from-conversation` (BRIEF-W6-BIP39-UC32-LIVE-EXAMPLES-2026-09-15 + CEO verified gaps)

### G1 Outcome
- Q: What does done look like?
  - A: Split step shows live source words; N-word 12–24 split works; hide-one visible fail; combine-all shows matching recovered words; VERSION lockstep + scorecard READY-FOR-E2E.
  - Recommended was: same (brief proof a–d).

### G2 Non-goal / kill
- Q: What must we not build?
  - A: Not Shamir, not SeedXOR.com, no QR/fund, do not reopen closed P0 PASSes, never brief Bob.
  - Recommended was: classroom N-of-N only.

### G3 Wrong product
- Q: Which surface?
  - A: `/home/debian/bip39lab` window 6 only — `web/v2/` UC32.
  - Recommended was: this product.

### G4 Cheapest alternative
- Q: Smallest ship?
  - A: Fix uc32() + handlers + e2e/comet/compare + VERSION bump; no new atoms unless required for visibility.
  - Recommended was: single vertical slice.

### G5 Abuse / failure
- Q: How does this fail or get misused?
  - A: Silent truncate of 24→12 would teach the wrong lesson — forbidden. Fail closed on invalid length. Do not fund practice parts.
  - Recommended was: fail closed; no silent data loss.

### G6 Verify
- Q: How prove before READY?
  - A: Playwright proofs (a)–(d); VERSION lockstep; scorecard five lines; product smoke.
  - Recommended was: smoke + AC path.

### G7 Priority
- Q: Why now?
  - A: CEO verified classroom gaps 2026-09-15; P0 teach correctness.
  - Recommended was: P0.

## Clarifications

- "Make a 12-word practice card" may become length picker or "Make an N-word practice card" covering 12/15/18/21/24; live First-wallet card of valid BIP-39 length may be used as source without cutting.
- Hide-one visible lab result: at minimum msg-bad class + recovered/fail region that is not only a one-line stub (prefer empty/fail grid or explicit fail panel with id for e2e).
- Combine-all: render recovered phrase via `wordGridHtml` (or equivalent) with id stable for Playwright match to source.
