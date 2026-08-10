# GapFix — Tools phrase source + teach clarity

- **Product:** bip39lab
- **Created:** 2026-08-09
- **Status:** ready-for-agent
- **Priority:** P1
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** none (copy/IA micro-slice)
- **Tracker:** local
- **Constitution:** AGENTS.md

## Problem Statement

Users confuse **auto-generated throwaway phrases** (Tools Compare / Descriptors when Lab is empty) with a phrase they entered on Lab. After **Clear secrets**, Tools can silently mint a new phrase and results look “real” without a clear source label. Entropy pad bit estimates lack a teach formula; Output descriptors lack a plain definition; Descriptor explain has no loadable public example; keyboard shortcuts are easy to miss (only Tools bottom) without Lab teach.

## Solution

Make phrase provenance and educational labels obvious:

1. **Phrase source** blurb + **TEST DATA** chip on Tools intro.
2. Compare / descriptors output prefixes: `[TEST DATA]` or `[Lab phrase]`.
3. **Clear secrets** resets Tools outs with notes that next Compare/Refresh auto-gens TEST DATA; status mentions same.
4. Entropy pad teach: d6 ≈ **2.58** bits, coin = **1** bit; meta string documents formula.
5. Output descriptors card: one-sentence definition + watch-only usefulness.
6. Descriptor explain: example shapes + **Load example** (public zpub-shaped string).
7. Lab mnemonic card teaches `G`/`D`/`?`/`Esc`; Tools shortcuts list clarifies Lab scope.

## User Stories

1. As a learner, I want Tools results labeled TEST DATA vs Lab phrase, so I never mistake a throwaway for my own mnemonic.
2. As a user who hit Clear secrets, I want Tools outs and status to say the next action will auto-gen TEST DATA, so silence is not confusion.
3. As a student, I want entropy bit math explained, so the estimate is not opaque.
4. As a learner, I want “what is a descriptor?” and a Load example path, so I can try Explain without inventing a string.
5. As a keyboard user, I want Lab teach of G/D/?/Esc plus a scoped Tools list, so shortcuts are discoverable.

## Implementation Decisions

- Surfaces: `web/index.html` (Tools + Lab mnemonic), `web/js/app.js` (clearSecrets, comparePassphrases, refreshDescriptors, entPad meta, btnDescExample).
- No crypto/API/CSP change; no secret retention; Load example uses a well-known public zpub shape only.
- Non-goals: change when auto-gen happens; CSPRNG claims; full descriptor checksum validation UX polish beyond existing explain.

## Testing Decisions

- Static contract: `tests/test_tools_teach_copy.py` (Phrase source, TEST DATA, 2.58, btnDescExample, Lab kbd).
- Playwright: extend Tools S17–S23 for bit formula / `[TEST DATA]` / Load example when practical.
- Smoke: `python -m pytest -q` + targeted e2e if environment allows.
- Traceability maps ACs → unit + S-ids.

## Acceptance Criteria

- [ ] Tools shows **Phrase source** copy and a visible **TEST DATA** chip in the blurb
- [ ] Compare and Refresh descriptors prefix output with `[TEST DATA]` or `[Lab phrase]`
- [ ] Clear secrets updates cmp/desc outs + status about next auto-gen TEST DATA
- [ ] Entropy teach + `entPadMeta` document d6≈2.58 and coin=1
- [ ] Output descriptors card defines descriptor + watch-only use
- [ ] Descriptor explain has example shapes + working **Load example** button
- [ ] Lab mnemonic teach shows G/D/?/Esc; Tools shortcuts clarify Lab scope
- [ ] Product unit smoke (pytest) succeeds; no secrets committed

## Out of Scope

- Changing auto-gen algorithm or where the phrase is stored
- Network/balance/PSBT signing
- Multisig/Shamir pages
- Full BIP380 checksum repair for the educational example

## Clarifications

### 2026-08-09
- Q: Spec interview or implement from message?
  - A: User supplied full GapFix list + `/execute_dev /code-review`; treat as `--from-conversation` with checkable ACs; no further interview.
- Q: Roadmap jump-link OPEN vs shipped v0.13.5?
  - A: Mark jump-link DONE if already tagged; GapFix is separate OPEN item.

## Further Notes

Aligns with no-retention + teach-first. Auto-gen still writes into Lab session memory — copy must say so so users re-check after Clear.

## Handoff

- Next: `/execute_dev`
- Then: `/code_review` → `/pr_review --validate` → `/release_mgmt` → `/sync_docs`
