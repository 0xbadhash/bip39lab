# SLIP-39 lab A — Spec + teach shell

- **Product:** bip39lab
- **Created:** 2026-08-10
- **Status:** ready-for-agent
- **Priority:** P1
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** none (shell/copy first)
- **Tracker:** local
- **Constitution:** AGENTS.md

## Problem Statement

Learners confuse educational Shamir (`share:index:hex`) with Trezor SLIP-39 share words. Without a named, offline SLIP-39 lab surface and comparison table, the “not SLIP-39” Shamir banner is a dead end.

## Solution

Ship an offline `web/slip39.html` teach shell: danger banner (lab only · not for funded wallets · not Trezor Suite substitute), BIP-39 / educational Shamir / SLIP-39 comparison table, jump-link rail, empty demo placeholders, link from Shamir. **No split/combine crypto in this ship** (B owns that). Keep existing 6-nav; deep-link from Shamir only.

## User Stories

1. As a learner, I want a dedicated SLIP-39 page with hard lab-only copy, so I never think this restores hardware wallets.
2. As a learner, I want a comparison table vs BIP-39 and educational Shamir, so the three models stay distinct.
3. As a Shamir-page visitor, I want a clear link to the SLIP-39 lab, so I can continue after the “not SLIP-39” banner.

## Implementation Decisions

- Surfaces: `web/slip39.html`, small `web/js/slip39-app.js` (chrome only), Shamir link, optional CSS.
- CSP: `connect-src 'none'`; no third-party scripts.
- Non-goals: library crypto, nav renumber, Lab mnemonic auto-use.

## Testing Decisions

- Unit: static copy contract (banner phrases, comparison headers, Shamir→SLIP link).
- Playwright: S57 shell (CSP offline, danger banner, table, link).
- TDD: red then green on copy contract.

## Acceptance Criteria

- [x] `web/slip39.html` exists with danger banner (lab / not for real funds / not Trezor Suite)
- [x] Comparison table covers wordlist, backup unit, checksum, passphrase, groups, downstream
- [x] Jump-link rail + placeholder demo cards (disabled or “coming in B”)
- [x] Shamir page links to SLIP-39 lab; educational Shamir still “not SLIP-39”
- [x] CSP offline; unit + S57; no secrets committed

## Traceability

| AC | Test / smoke |
|----|----------------|
| Danger banner + CSP | `tests/test_slip39_shell_copy.py` · e2e S57 |
| Compare table topics | unit copy contract |
| Jump rail + placeholders | unit + S57 |
| Shamir → SLIP-39 | unit + e2e S57b |
| 6-nav only | unit `test_slip39_keeps_six_nav` |

## Out of Scope

- Split/combine, vectors, CLI, passphrase/group demos (B/C)
- Production safety claims; 7th top-level nav item

## Clarifications

### 2026-08-10
- Q: Separate FSM ships A–D?
  - A: Yes; this file is A only. B/C/D have their own specs.
- Q: 7-nav?
  - A: No — deep-link from Shamir to keep 6-nav contracts.

## Handoff

- Next: `/execute_dev` then `/code_review`
