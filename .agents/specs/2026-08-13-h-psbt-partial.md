# H — Canned PSBT 1-of-2 partial inspect

- **Product:** bip39lab
- **Created:** 2026-08-13
- **Status:** ready-for-agent
- **Priority:** P2
- **Constitution:** AGENTS.md

## Problem Statement

I4 teaches inspect-only. The 0/2 → 1/2 → 2/2 spend story is prose only.

## Solution

Inspector counts partial-sig keys (type 0x02). Button loads a canned educational PSBT with **one** partial-sig key. Output says `partial signatures: 1` and still “never signs.” No real UTXOs or spendable keys.

## Acceptance Criteria

- [ ] `inspectPsbt` reports `partialSigs`
- [ ] Tools button “Load 1-of-2 partial” fills sample and inspects
- [ ] Playwright **S79**
- [ ] Sample is not a funded wallet; no xprv

## Out of Scope

Signing, combining, broadcast, real UTXO fetch.
