# SLIP-39 lab D — Docs / release hygiene

- **Product:** bip39lab
- **Created:** 2026-08-10
- **Status:** done
- **Priority:** P2
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** none
- **Tracker:** local
- **Constitution:** AGENTS.md

## Problem Statement

Without ROADMAP/README/Comet notes, the SLIP-39 lab is invisible and “not SLIP-39” Shamir copy has no sibling destination in docs.

## Solution

Document lab-only SLIP-39 in ROADMAP (A–D done), README pages table, Comet scenarios S57–S60b + human process flow Page 7, plugin surface already present. No production safety claim. No secret material in docs.

## User Stories

1. As a learner, I find `/slip39.html` from README without mistaking it for Shamir or Trezor Suite.
2. As a Comet/QA operator, I have S57–S60b and a process flow for the SLIP-39 page.

## Acceptance Criteria

- [x] ROADMAP open items A–C marked done when shipped; D notes lab-only and is done
- [x] README mentions SLIP-39 lab offline page
- [x] Comet doc lists S57+ for slip39 (through S60b) + process flow
- [x] No secret material in docs

## Out of Scope

- Version tag/release_mgmt (optional follow-up `/pr_review` → `/release_mgmt` if operator wants a docs stamp tag)
- Product code / crypto changes

## Handoff

- `/execute_dev` docs-only (TDD N/A) → `/code_review` → optional `/pr_review --validate`
