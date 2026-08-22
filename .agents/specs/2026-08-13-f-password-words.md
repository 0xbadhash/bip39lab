# F — PIN vs file password vs BIP39 passphrase

- **Product:** bip39lab
- **Created:** 2026-08-13
- **Status:** ready-for-agent
- **Priority:** P2
- **Constitution:** AGENTS.md

## Problem Statement

English “password” means three objects: device PIN, coordinator file password (hides balance), BIP39 passphrase (changes the seed).

## Solution

Glossary entries + Extra help on Multisig and Lab passphrase card pointing at the three terms. No fake password UI.

## Acceptance Criteria

- [ ] Glossary ids `DEVICEPIN`, `FILEPW`, `PPSTRENGTH` or new `COORDPW` exist and are distinct
- [ ] Multisig Extra help mentions coordinator file password ≠ BIP39 passphrase
- [ ] Playwright **S77** glossary search hits
- [ ] No new password field

## Out of Scope

Encrypting anything in the lab.
