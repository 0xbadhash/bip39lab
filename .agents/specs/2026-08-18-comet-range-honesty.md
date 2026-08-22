# Comet range lock + P1 honesty (Receive/Compare)

- **Product:** bip39lab
- **Created:** 2026-08-18
- **Status:** ready-for-agent
- **Priority:** P1
- **Constitution:** AGENTS.md

## Problem Statement

Comet body still says S0–S71 while Product is S0–S81 / 102. Receive and Compare still say nothing is sent to the internet/server, which is the same over-claim P0 removed from the banner.

## Solution

Every comet/agent-prompt line uses the stamped range S0–S81 and 102 S-ids (or whatever stamp writes). Receive/Compare copy matches P0 honesty: crypto in this tab; progress/theme may persist; Network only after opt-in. Bump to 0.16.7. Do not reopen P0 isolation or S81/S11b rec-flow.

## Acceptance Criteria

- [ ] No leftover `S0–S71` or `S0–S56` in comet / agent prompt
- [ ] Receive and Compare do not say “nothing is sent”
- [ ] P0 walls unchanged
- [ ] Version 0.16.7 everywhere (chip HTML, VERSION, site-version, PLAYWRIGHT_LAST, comet)
- [ ] Playwright + comet updated

## Out of Scope

Other windows. SLIP-39 glossary, Shamir M, BIP-85, descriptor checksums, Lab reorder.
