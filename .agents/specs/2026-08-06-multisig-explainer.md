# Multisig explainer lab (educational, offline)

- **Product:** bip39lab
- **Created:** 2026-08-06
- **Status:** ready-for-agent
- **Priority:** P1
- **Roadmap:** ROADMAP.md
- **Plan:** `.agents/specs/2026-08-06-multisig-explainer-plan.md`
- **Constitution:** AGENTS.md

## Context

Option A (derivation table) and Option B (watch-only) are **already shipped**. This slice adds an **explanatory multisig** surface inspired by https://iancoleman.io/multisig/ but **safer and more educational** (no private keys by default, no blockchain discovery).

## Problem Statement

Users learning Bitcoin see “2-of-3 multisig” without intuition. Coleman’s tool is powerful but dense and accepts private keys; bip39lab needs a **plain-English multisig lab** that builds a P2SH (and P2WSH) address from **public keys only**, offline.

## Solution

New **Multisig** sidebar tab (or `multisig.html` with same shell):

1. **Explain** M-of-N with bank/vault analogies (who holds keys, what “sign” means, what is not a seed).
2. **Input:** N compressed public keys (hex), one per line; M selector (1…N).
3. **Ordering:** default BIP67 lexicographic sort of pubkeys (checkbox, on by default) with explanation.
4. **Output:** M-of-N summary, P2SH address (`3…`), P2WSH address (`bc1q…` 32-byte program), redeem/witness script hex, Copy/QR.
5. **Never** accept or display WIF/xprv in this phase.
6. **Out of scope:** explorer “discover order”, transaction builder, network.

## Acceptance Criteria

- [ ] ACM.1 Multisig nav entry + English explainer (what it is / is not).
- [ ] ACM.2 Build P2SH multisig from M + compressed pubkeys offline.
- [ ] ACM.3 Also show P2WSH (same witness script) address.
- [ ] ACM.4 BIP67 sort toggle (default on).
- [ ] ACM.5 No private key fields; refuse if input looks like WIF/xprv.
- [ ] ACM.6 Copy + QR for address/scripts; CSP offline (img data: ok).
- [ ] ACM.7 Unit/vector test for known 2-of-3 or constructed fixture.
- [ ] ACM.8 Document that Options A/B remain DONE; this is new OPEN→DONE ship.

## Out of Scope

- Option C network
- PSBT / signing
- Blockchain discovery of funded combinations
- xpub cosigner expand (future)

## Handoff

`/execute_dev` → full FSM → tag (e.g. v0.9.0)
