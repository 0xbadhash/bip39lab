# V2 UC1 generate chrome (Clear secrets, word counts, plain copy)

- **Product:** bip39lab
- **Created:** 2026-08-23
- **Status:** ready-for-agent
- **Priority:** P0
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** none
- **Tracker:** local
- **Constitution:** AGENTS.md
- **Grill-me:** complete
- **Surface:** `web/v2/` only (classic `/` unchanged)

## Problem Statement

On V2, **Clear secrets** sits in the left sidebar footer where it does no work next to Generate. Word count is only 12/24. Generate copy says “OS CSPRNG via Lab’s scure path,” which is not plain English. There is no BIP-39 mnemonic (i) explanation. **Regenerate 12-word** ignores 15/18/21 and does not match a 24-word card.

## Solution

UC1 (and the regenerate exercise) match classic Lab generate chrome: Clear secrets beside Generate, word counts **12, 15, 18, 21, 24**, full-sentence copy with hover (i), regenerate using the **selected** length.

## User Stories

1. As a learner on UC1, I want Clear secrets next to Generate, so I empty this tab without hunting the sidebar.
2. As a learner, I want the same word-count list as classic Lab.
3. As a learner, I want Generate explained in full sentences, not jargon.
4. As a learner, I want (i) on “BIP-39 mnemonic, English words only.”
5. As a learner, I want Regenerate to emit the length I picked (including 15, 18, 21, 24).

## Implementation Decisions

- Remove `#btnClearV2` from the V2 sidebar. Place `.btn.danger` Clear secrets on the UC1 Generate row (and the regenerate exercise row).
- `#v2WordCount` options: 12, 15, 18, 21, 24 (same as v1 `#wordCount`).
- Replace CSPRNG jargon with full sentences (no contractions on V2 UC1 copy).
- Help-tip (i) next to BIP-39 / mnemonic / English wordlist — OK-only hover panel; Catalyxt tokens; no new `--cx-*`.
- Regenerate reads the same select; button label names that length (example: “Regenerate 24-word phrase”).
- Classic `web/index.html` unchanged.

## Testing Decisions

- Playwright `e2e/v2.spec.ts`:
  - Clear secrets not in `.sidebar`; visible next to `#v2Generate`
  - Word count five values
  - Generate help has no “CSPRNG” / “scure”
  - (i) panel visible on hover
  - Select 24 → regenerate → 24 word tiles; 15 → 15 tiles

## Acceptance Criteria

- [ ] V2 sidebar has no Clear secrets control
- [ ] UC1 Generate row: word count · Generate · Clear secrets (red `.btn.danger`)
- [ ] Word count options are 12, 15, 18, 21, 24
- [ ] Generate explainer is plain English full sentences; no “OS CSPRNG via Lab’s scure path”
- [ ] BIP-39 mnemonic English-words (i) hover explains the phrase in full (no contractions)
- [ ] Regenerate uses the selected count for 12, 15, 18, 21, and 24
- [ ] Classic `/` unchanged
- [ ] `e2e/v2.spec.ts` covers the above
- [ ] Product smoke for touched V2 path

## Out of Scope

- Classic Lab chrome
- New token families
- Storing mnemonics
- Replacing `/` with V2

## Grill-me

**Status:** complete  
**Date:** 2026-08-23  

Operator supplied G1–G7 in the `/spec` request (not agent-invented P0 outcomes).

### G1 Outcome
- Q: What does the learner say when this is done?
  - A: Clear secrets is beside Generate. I can pick 12 through 24 words. The copy explains randomness in plain English. (i) explains BIP-39 English words. Regenerate matches the length I picked.
  - Recommended was: same (operator locked).

### G2 Non-goal / kill
- Q: What must we not build?
  - A: Do not leave Clear secrets only in the left pane. Do not keep 12/24-only. Do not keep scure/CSPRNG jargon as the only explainer. Do not change classic `/`.
  - Recommended was: V2-only chrome; no new skins.

### G3 Wrong product
- Q: Is this classic Lab or V2?
  - A: V2 UC1 generate/regenerate. Classic already has 12–24 and Clear secrets on the mnemonic row.

### G4 Cheapest alternative
- Q: Smallest ship?
  - A: Move the button, expand the select, rewrite copy, fix regenerate — one V2 JS/HTML pass.

### G5 Abuse / failure
- Q: How does Clear secrets fail?
  - A: It must empty this-tab practice phrase and hide addresses. It must not claim to delete a real wallet. Fail closed: no disk write of words.

### G6 Verify
- Q: How do we prove it?
  - A: Playwright on `/v2/` UC1: select lengths, tile counts, button placement, hover (i), no sidebar Clear.

### G7 Priority
- Q: Why now?
  - A: Operator compared v1 vs v2; these are blocking UC1 fidelity items. P0.

## Clarifications

### 2026-08-23
- Q: Should Clear secrets appear on later UC1 steps (backup card, quiz)?
  - A: Required on Generate and Regenerate rows. Optional repeat on other UC1 pads is allowed; sidebar must not have it. (Recommended default: Generate + Regenerate rows only.)
- Q: Word-count control on regenerate — same select as Generate?
  - A: Yes, one shared length in tab memory; regenerate reads it.

## Handoff

- Next: `/execute_dev`
- Then: `/code_review` → `/pr_review --validate` (pipeline currently `approved` for a prior stamp — do not overwrite that phase blindly)
