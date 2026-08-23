# Use-case tracks (mission-aligned IA)

- **Product:** bip39lab
- **Created:** 2026-08-23
- **Status:** locked brief — decisions (1)–(4) accepted
- **Priority:** P0
- **Mission:** Practice the custody decision offline, then do the real thing in a wallet you trust.

This is the website mission. Every page, First-hour flow, and Classroom level must serve it. This lab is not a funded wallet, not a signer, not a broadcaster.

## Locked decisions (2026-08-23)

1. **PRIMARY ENTRY** = Use-case picker (not “feature tour of Lab first”).
2. **UC1 exit** = FORCE ACK (“I will not fund practice addresses / practice phrase”).
3. After Starter UC1–UC2 are clean, **next pedagogy track = UC3 Passphrase** (existing Compare card — amend, do not clone).
4. **KEEP sidebar rooms** (Lab / Multisig / Shamir / Network / Tools / Glossary) as deep links and implementation surfaces. Tracks drive teaching; rooms stay.

## Entry

Use-case picker on first meaningful Lab visit (after or combined with is/isn’t ack as product chooses in the UC1 spec). Options map to UC1–UC10; unavailable levels soft-gate with “Needs Beginner+” etc.

## UC1 (next implementation — NOT this lock task)

Process:

1. Ack is/isn’t
2. Generate practice phrase
3. Numbered card visible
4. Validate & derive
5. Existing address table visible
6. **FORCE ACK exit:** user confirms they will not fund the practice phrase / practice addresses
7. Only then optional links to UC3 / UC4

### Non-goals UC1

Network, Multisig, Shamir, PSBT, descriptor essays, sticky tour of the whole product.

## Design principles (for upcoming UC1 execute)

1. Amend existing `#card-mnemonic` + address table — do not clone.
2. Generate must show words; never jump to addresses-only.
3. Validate must show address table, not essay blocks.
4. One work pad width = air-gap banner width.
5. Sidebar rooms kept; tracks open rooms when needed.
6. Catalyxt app-shell only; no new `--cx-*` tokens.

## Track map (ship later)

| ID | Slice | Level | Surface |
|----|--------|-------|---------|
| UC1 | First wallet (safe & easy) | Starter | `#card-mnemonic` + `#addrTable` |
| UC2 | Paper backup discipline | Starter | Same card; print optional after confirm |
| UC3 | Passphrase (25th word) | Beginner | Existing `#cardCmpPp` |
| UC4 | Path folders + BIP map | Beginner | Existing `#cardPathPlay` + BIP SVG |
| UC5 | Watch-only | Beginner | Existing descriptor tools |
| UC6 | Shared custody multisig | Intermediate | Existing Multisig room; keys ≠ shares |
| UC7 | Split secret Shamir | Intermediate | Existing Shamir; not SLIP-39 unless that page |
| UC8 | PSBT inspect / air-gap model | Intermediate | Existing PSBT inspector; never sign |
| UC9 | master → child / xpub threat | Advanced | Strip + existing advanced face |
| UC10 | Network leak / fees / balances | Advanced | Existing Network; unknown ≠ 0 |

## Out of scope (epic)

Reinventing pads, SeedSigner chrome, new tokens, merging rooms into an SPA, funded wallet onboarding that stores keys.

## Next

After this roadmap/spec lock: separate `/spec` + `/execute_dev` for **UC1 only** with visual principles in that stamp. Do not implement UC1 UI in this lock.
