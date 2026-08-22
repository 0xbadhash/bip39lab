# P0 lab-safety (window 6 / bip39lab only)

- **Product:** bip39lab
- **Created:** 2026-08-18
- **Status:** ready-for-agent
- **Priority:** P0
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** none
- **Tracker:** local
- **Constitution:** AGENTS.md

## Problem Statement

The Lab banner over-claims “nothing is written to disk or sent to a server.” Seed QR / print can expose an invalid or unconfirmed phrase. Derive silently writes addresses to sessionStorage. Network defaults to Mainnet. Leak-ack does not name the mempool proxy. Light-theme air-gap banner fails contrast.

## Solution

Honest banner; Seed QR bound to live `#mnemonic` and only after valid checksum + confirm; Generate warns before replace; Print same wall; sessionStorage addresses only on explicit Send → Network; Lab network default Testnet; leak-ack names site proxy then mempool.space; light-theme `.warn` ≥ 4.5:1. No visual redesign. No P1 honesty pass.

## User Stories

1. As a learner I read where secrets and addresses actually go.
2. As a learner I cannot QR/print invalid words as a backup.
3. As a learner I opt in before addresses leave Lab.

## Implementation Decisions

- Surfaces: `web/index.html`, `web/js/app.js`, `web/network.html`, `web/css/app.css`, Playwright + Comet.
- Non-goals: SLIP-39 glossary, Shamir M, BIP-85, tb1/mainnet API, descriptor checksums, multisig N phrases, Lab reorder, Figure, Card.

## Testing Decisions

- Playwright S0b contrast, S1 tb1p default, S2–S4 select main for goldens, S5 default test, S13d no silent session, S15/S15b QR walls, S16 handoff only, S32 leak-ack copy, S80 generate replace.
- Product smoke + check_web_e2e.

## Acceptance Criteria

- [ ] Banner text matches CEO P0 #1; no “nothing is written to disk or sent to a server”
- [ ] Seed QR uses live mnemonic; valid paste opens `#qrModal`; invalid refused
- [ ] Generate confirms if field non-empty; QR/Print require valid mnemonic + confirm
- [ ] Default `#deriveNetwork` is test; no session write until Send → Network
- [ ] Leak-ack names mempool proxy then mempool.space
- [ ] Light-theme air-gap banner contrast ≥ 4.5:1
- [ ] Playwright + Comet updated; smoke green
- [ ] No secrets committed

## Out of Scope

P1 honesty pass. Window 7 Figure. Window 8 Card. Visual redesign.

## Clarifications

### 2026-08-18
- Q: Interview?
  - A: CEO brief is the spec. `--from-conversation`.
- Q: Validate button?
  - A: BIP-39 validate of live field is the wall (no new mid-page rail).

## Handoff

- Next: `/execute_dev`
