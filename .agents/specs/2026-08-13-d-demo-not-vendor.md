# D — Generate demo ≠ multi-vendor

- **Product:** bip39lab
- **Created:** 2026-08-13
- **Status:** ready-for-agent
- **Priority:** P2
- **Constitution:** AGENTS.md

## Problem Statement

Generate demo cosigners uses one browser RNG. Learners may treat it as a real multi-vendor quorum.

## Solution

Visible PRACTICE chip + Extra help: demo keys share one browser; real vaults export **xpub/pubkey only** from independent entropy (dice/hardware). Tie to entropy pad in one sentence.

## Acceptance Criteria

- [ ] After Generate demo, `#msDemoVendorNote` (or existing warn) states not multi-vendor
- [ ] Playwright **S75**
- [ ] Demo still works for address math

## Out of Scope

Changing demo RNG, SeedSigner QR.
