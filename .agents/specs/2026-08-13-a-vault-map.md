# A — Vault map as a first-class object

- **Product:** bip39lab
- **Created:** 2026-08-13
- **Status:** ready-for-agent
- **Priority:** P1
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** none
- **Tracker:** local
- **Constitution:** AGENTS.md

## Problem Statement

Learners see a P2SH/P2WSH address after Build but never a **map** (public policy string). Real wallets treat that map (descriptor / BSMS) as the object you back up with each key. Losing the map and one key can strand coins.

## Solution

After a successful Build, Multisig shows a **Vault map** block: M-of-N, BIP67 on/off, key ids (first 8 hex of each compressed pubkey), and a public `wsh(sortedmulti(…))` or `wsh(multi(…))` descriptor. Copy is public-only. Extra help names the map and the lose-map-and-one-key failure.

## User Stories

1. As a learner, I want the policy string next to the address so I know what to back up besides seeds.
2. As a teacher, I want Extra help to say the map is not a seed.

## Implementation Decisions

- Compute map in `buildMultisigFromText` (public pubs only).
- Surface `#msVaultMap` / `#msMapDesc` on Multisig result.
- Glossary `VAULTMAP`.
- Non-goals: real `.bsms` files, xpub origin fingerprints, signing.

## Testing Decisions

- Unit: 2-of-2 abandon pubs emit `wsh(sortedmulti(2,` and both key hexes.
- Playwright **S72** vault map visible after golden build.
- Comet S72.

## Acceptance Criteria

- [ ] Build 2-of-2 BIP67 shows `#msVaultMap` with `sortedmulti` and both pubs
- [ ] Map hidden after Clear
- [ ] No private keys in map
- [ ] S72 + Comet + smoke
- [ ] No secrets committed

## Out of Scope

BSMS file download, recovery drill (spec B), vendor-diversity copy (C).

## Clarifications

### 2026-08-13
- Q: Real BIP32 fingerprints?
  - A: No — first 8 hex of compressed pubkey as educational key id.
- Q: File download?
  - A: No. On-page text only.

## Handoff

- Next: `/execute_dev`
