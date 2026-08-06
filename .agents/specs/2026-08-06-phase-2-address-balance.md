# Phase 2 — Opt-in address-only balance

- **Product:** bitcoin-scripts
- **Created:** 2026-08-06
- **Status:** ready-for-agent
- **Priority:** P1
- **Constitution:** AGENTS.md

## Problem Statement

Users may want UTXO balance for an address without leaking seed material to explorers.

## Solution

CLI `python -m bip39lab balance <address>` that only accepts addresses, never mnemonics; explicit opt-in backends; fail-closed (`unknown` ≠ 0).

## Acceptance Criteria

- [ ] AC2.1 Command rejects mnemonic-looking input (≥8 space-separated words)
- [ ] AC2.2 Balance result is `BalanceResult(status=ok|unknown|error, satoshis=Optional[int])` — never invents 0 on HTTP failure
- [ ] AC2.3 Default backend is `none` (offline); `blockstream` only with `--backend blockstream --i-understand-address-leak`
- [ ] AC2.4 No mnemonic parameters on balance path
- [ ] AC2.5 Unit tests with mocked HTTP
- [ ] AC2.6 Product smoke still green

## Out of Scope

- Random mnemonic scanning
- Multi-address batch without explicit list
- Electrum protocol (future)

## Clarifications

### 2026-08-06
- Q: Auto-check after derive in web?
  - A: No. Balance stays CLI-only Phase 2 (web remains offline CSP connect-src none).

## Handoff

Next: `/execute_dev`
