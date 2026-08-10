# SLIP-39 lab D — Docs / release hygiene

- **Product:** bip39lab
- **Created:** 2026-08-10
- **Status:** ready-for-agent
- **Priority:** P2
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** none
- **Tracker:** local
- **Constitution:** AGENTS.md

## Problem Statement

Without ROADMAP/README/Comet notes, the SLIP-39 lab is invisible and “not SLIP-39” Shamir copy has no sibling destination in docs.

## Solution

Document lab-only SLIP-39 in ROADMAP (DONE after A–C), README, Comet scenarios S57+, plugin web_e2e surface if needed. No production safety claim.

## Acceptance Criteria

- [ ] ROADMAP open items A–C marked done when shipped; D notes lab-only
- [ ] README mentions SLIP-39 lab offline page
- [ ] Comet doc lists S57+ for slip39
- [ ] No secret material in docs

## Out of Scope

- Version tag/release_mgmt (separate after pr_review)

## Handoff

- Next: `/execute_dev` then `/code_review` (docs-only waiver ok for pure docs if no code)
