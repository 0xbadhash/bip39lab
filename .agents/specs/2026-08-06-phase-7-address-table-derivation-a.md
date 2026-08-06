# Phase 7 — HTML address table + Option A derivation UX

- **Product:** bip39lab
- **Created:** 2026-08-06
- **Status:** ready-for-agent
- **Priority:** P0
- **Roadmap:** ROADMAP.md
- **Plan:** `.agents/specs/2026-08-06-phase-7-address-table-derivation-a-plan.md`
- **Constitution:** AGENTS.md

## Problem Statement

Receive addresses render as monospace ASCII that wraps and is hard to scan. Derivation is fixed to account 0 / change 0 / BIP44+49+84 only; users need a real table and Option A controls (account, change, count, Taproot BIP86).

## Solution

1. Replace ASCII table with a proper **HTML `<table>`**, wide layout, **no mid-address wrap** (`white-space: nowrap` + horizontal scroll container).
2. **Option A — Derivation UX:** account, change (0/1), index count (5/10/20), columns BIP86 (Taproot) + BIP84 + BIP49 + BIP44; auto-derive still on generate / passphrase / control change.
3. Park **Option B** (watch-only xpub/QR) and **Option C** (network tab fees/mempool) as ROADMAP OPEN items only.

## Acceptance Criteria

- [ ] AC7.1 Address output is an HTML table (not ASCII art dashes).
- [ ] AC7.2 Address cells do not soft-wrap; container may scroll horizontally on narrow viewports.
- [ ] AC7.3 Columns: idx, BIP86 (taproot), BIP84, BIP49, BIP44.
- [ ] AC7.4 Controls: account (≥0), change 0|1, count 5|10|20; re-derive offline when changed.
- [ ] AC7.5 BIP86 path `m/86'/0'/account'/change/index`; abandon…about vector for m/86'/0'/0'/0/0 matches known test address.
- [ ] AC7.6 Auto-derive on generate + passphrase still works; English only; offline CSP.
- [ ] AC7.7 Options B and C listed OPEN on ROADMAP (not implemented).
- [ ] AC7.8 Tests + smoke green.

## Out of Scope

- Option B (xpub/QR), Option C (network/fees)
- Custom free-form path string (may follow later)
- Spending / PSBT

## Clarifications

### 2026-08-06
- Q: Full FSM scope?
  - A: Table polish + Option A only; B/C roadmap stubs.
- Q: Default count?
  - A: Keep 5; allow 10 and 20.

## Handoff

Next: `/execute_dev`
