# One stamp number + derive status copy

- **Product:** bip39lab
- **Created:** 2026-08-18
- **Status:** ready-for-agent
- **Priority:** P0
- **Constitution:** AGENTS.md

## Problem Statement

Visible chip can show a leftover tag (HTML `…` until JS, or cache 0.16.5) while `#status` prints `BIP39Lab.VERSION` (`0.11.0-scure`). Empty Validate & derive stays Ready. 11-word phrases get a checksum/wordlist status while the field already says length.

## Solution

One product number **0.16.6** in HTML chip (before JS), site-version.js, /VERSION, comet, PLAYWRIGHT_LAST, and Ready status. Empty derive sets a missing-data status. Wrong word count status says length. Do not reopen P0 isolation PASSes. Do not bump past 0.16.6.

## Acceptance Criteria

- [ ] Chip HTML contains `v0.16.6` (not only `…`)
- [ ] Ready status uses site tag, not `0.11.0-scure`
- [ ] Empty Validate & derive: `#status` missing-data, not Ready
- [ ] 11-word: `#status` mentions length (not only wordlist/checksum)
- [ ] Stamps stay 0.16.6; no new tag
- [ ] Playwright + comet updated

## Out of Scope

P0 banner/QR/session/testnet/leak/contrast reopen. Figure/Card/other windows.
