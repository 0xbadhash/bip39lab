# Help UX hybrid (P0–P4) — clean teaching UI

- **Product:** bip39lab
- **Created:** 2026-08-07
- **Status:** ready-for-agent
- **Priority:** P0

## Problem
Comprehensive teaching copy is always visible → visually messy.

## Solution (Hybrid F)
| Phase | Work |
|-------|------|
| P0 | CSS + `help-ui.js`: ⓘ tips, help-fold, teach attribute |
| P1 | Lab: move long help into tips/`details` |
| P2 | Step rail Lab + Multisig |
| P3 | Teach On/Off (localStorage `bip39lab.teach`) |
| P4 | Multisig + Network same patterns |
| Tests | Playwright S41–S48 + Comet |

## Safety
Leak warnings, seed QR confirm, refuse-private messaging stay always visible (not hover-only).

## Acceptance
- [ ] Teach Off collapses `.teach-only` / tip panels
- [ ] ⓘ opens/closes on click; Escape closes
- [ ] Step rail navigates focus/scroll to sections
- [ ] Lab CSP unchanged offline
- [ ] e2e green; Comet updated
