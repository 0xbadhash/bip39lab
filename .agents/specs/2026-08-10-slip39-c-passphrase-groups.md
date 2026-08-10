# SLIP-39 lab C — Passphrase + groups (teach)

- **Product:** bip39lab
- **Created:** 2026-08-10
- **Status:** done
- **Priority:** P2
- **Roadmap:** ROADMAP.md → Open work → SLIP-39 lab C
- **Plan:** none (ship from this spec)
- **Tracker:** local
- **Constitution:** AGENTS.md
- **Depends on:** lab B (`slip39_lab` / `Slip39Lab` single-group core)

## Problem Statement

SLIP-39 differs from BIP-39 on **passphrase-at-combine** and **groups**. Without demos, learners miss the main mental-model gaps.

## Solution

1. **Wrong-passphrase fail demo** on combine (scripted button + manual combine path) — recovered master ≠ expected practice secret; status is error/mismatch (no silent success).
2. **Multi-group teach diagram** (1-of-1 + 2-of-3) — static labeled policy; no full group designer.

## User Stories

1. As a learner, I want wrong passphrase to fail loudly, so I do not treat SLIP-39 like BIP-39’s optional 25th word on seed derivation alone.
2. As a learner, I want a group diagram, so multi-group SLIP-39 is not invisible.

## Implementation Decisions

- UI cards on `slip39.html` (`#s39CardGroups`); reuse B core (`splitSingleGroup` / `combineShares` / `matchExpected`).
- Prefer diagram + scripted demo over full group-policy designer (out of scope).
- Wrong passphrase often returns a **different** secret (decrypt) rather than throw — lab must **compare** to expected hex.

## Testing Decisions

- Unit: `test_wrong_passphrase_mismatches_expected` (already B); retain.
- E2E: **S60** scripted `#btnS39WrongPp`; **S60b** manual split(pp=correct) → combine(pp=wrong) → mismatch; diagram `#s39GroupDiagram` with 1-of-1 / 2-of-3 labels.
- Comet: `docs/E2E_COMET_SCENARIOS.md` S60 / S60b.

## Acceptance Criteria

- [x] Wrong passphrase combine path shows fail / mismatch (no silent wrong success) — scripted **and** manual
- [x] Multi-group diagram or labeled example on page (`#s39GroupDiagram`)
- [x] Smoke green; lab-only copy retained
- [x] Playwright S60/S60b + Comet IDs aligned

## Out of Scope

- Full group designer; hardware restore; production claims; multi-group live split

## Handoff

- Next: `/execute_dev` → reviews → `/pr_review --validate` → `/release_mgmt` → `/sync_docs` → `/qa_campaign`
