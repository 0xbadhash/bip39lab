# Phase 0 — Offline correctness lab (no secret retention)

- **Product:** bitcoin-scripts
- **Created:** 2026-08-06
- **Status:** ready-for-agent
- **Priority:** P0
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** `.agents/specs/2026-08-06-phase-0-correctness-lab-plan.md`
- **Tracker:** local
- **Constitution:** AGENTS.md (security non-negotiables)

## Problem Statement

Operators cannot safely derive BIP-39 material offline with this repo today: the legacy CLI retains mnemonics, logs seeds, uses `eval`, fetches wordlists over the network, and treats balance API failures as zero. That is the opposite of a no-retention entropy/derivation lab.

## Solution

A **stdlib + vendored wordlist** Python package and CLI that generate/validate mnemonics, derive BIP44/49/84 first addresses offline, never write seed material to disk, and quarantine the legacy scanner.

## User Stories

1. As an operator, I want to validate a BIP-39 mnemonic offline (including checksum), so that I know phrases are well-formed before trusting derivation.
2. As an operator, I want to derive the first BIP44/49/84 Bitcoin addresses from a mnemonic without network access, so that I can verify wallet paths offline.
3. As an operator, I want generate-from-CSPRNG mnemonics with 12/24 words, so that I can practice entropy→phrase flows safely.
4. As a maintainer, I want golden BIP fixtures in CI, so that derivation regressions are caught.
5. As a security-conscious operator, I want zero mnemonic files and no seed logging from the new CLI.

## Implementation Decisions

- Surface: `src/bip39lab/` + `python -m bip39lab` CLI
- Legacy `brute-force-btc.py` moves under `legacy/` and is documented as unsafe / non-default
- Remove product use of `tested_mnemonics.json` from default paths; keep gitignored
- Wordlist vendored under `src/bip39lab/data/english.txt` with SHA-256 check
- Crypto: Python stdlib (`hashlib`, `hmac`, `secrets`) + pure BIP32/secp256k1 sufficient for fixtures; no network at import
- External APIs and mnemonic retention are **not** part of this phase’s CLI

## Testing Decisions

- Public contract: `validate_mnemonic`, `mnemonic_to_seed`, `derive_address`, CLI exit codes
- Golden: BIP-39 `abandon…about` → known BIP44/49/84 addresses
- Commands: `python -m pytest -q`, `python scripts/product_smoke.py --root .`
- Red before green for derivation/validation modules

## Acceptance Criteria

- [ ] AC0.1 Vendored English wordlist (2048 words) loads offline; SHA-256 verified at load
- [ ] AC0.2 Invalid checksum mnemonics rejected; valid ones accepted
- [ ] AC0.3 Known vector: `abandon…about` derives correct BIP44 P2PKH, BIP49 P2SH-P2WPKH, BIP84 bech32 addresses (account 0, change 0, index 0)
- [ ] AC0.4 CLI `validate` / `derive` / `generate` work with no network
- [ ] AC0.5 No function in `bip39lab` writes mnemonics/seeds/xprv to disk; no logging of full mnemonics at INFO
- [ ] AC0.6 Legacy scanner quarantined under `legacy/` with README warning; product default path is `bip39lab`
- [ ] AC0.7 Config `eval` path not used by new code; external APIs not invoked by new CLI
- [ ] AC0.8 Product smoke + unit tests pass
- [ ] AC0.9 No secrets committed

## Out of Scope

- Web UI (Phase 1)
- Balance / explorer APIs (Phase 2)
- Multi-index address tables, passphrase UI polish beyond API support
- Multi-language wordlists beyond English

## Clarifications

### 2026-08-06
- Q: Use pure Python vs bip-utils?
  - A: Prefer stdlib + pure implementation with golden vectors for Phase 0 (minimal deps, offline trust).
- Q: Passphrase?
  - A: Support BIP-39 passphrase in API/CLI optional flag; default empty.
- Q: What about existing tested_mnemonics.json?
  - A: Remain gitignored; do not load in new CLI; optional delete not required if untracked.

## Further Notes

- Threat: silent wrong derivation → always fixture-test addresses.
- Threat: log leakage → never log mnemonic/seed/privkey.

## Handoff

- Next: `/execute_dev`
- Then: `/code_review` → … → `/pr_review` → `/release_mgmt` → `/sync_docs`
