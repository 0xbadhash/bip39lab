# SLIP-39 lab C — Passphrase + groups (teach)

- **Product:** bip39lab
- **Created:** 2026-08-10
- **Status:** ready-for-agent
- **Priority:** P2
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** none
- **Tracker:** local
- **Constitution:** AGENTS.md

## Problem Statement

SLIP-39 differs from BIP-39 on **passphrase-at-combine** and **groups**. Without demos, learners miss the main mental-model gaps.

## Solution

Add (1) wrong-passphrase fail demo on combine, (2) one multi-group teach diagram (e.g. 1-of-1 + 2-of-3) with optional simple split if library supports cheaply — else static diagram + copy only.

## User Stories

1. As a learner, I want wrong passphrase to fail loudly, so I do not treat SLIP-39 like BIP-39’s optional 25th word on seed derivation alone.
2. As a learner, I want a group diagram, so multi-group SLIP-39 is not invisible.

## Implementation Decisions

- UI cards on `slip39.html`; reuse B core.
- Prefer diagram + one scripted demo over full group-policy designer.

## Testing Decisions

- Unit/e2e: wrong passphrase does not match master secret; diagram present.

## Acceptance Criteria

- [ ] Wrong passphrase combine path shows fail / mismatch (no silent wrong success)
- [ ] Multi-group diagram or labeled example on page
- [ ] Smoke green; lab-only copy retained

## Out of Scope

- Full group designer; hardware restore; production claims

## Handoff

- Next: `/execute_dev` then `/code_review`
