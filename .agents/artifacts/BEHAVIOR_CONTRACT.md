# Behavior contract — V2 UC4–UC7 curriculum + quiz why + rail

- **Product:** bip39lab
- **Target:** `http://127.0.0.1:4173/v2/` (Playwright webServer `python3 -m http.server 4173 --directory web`)
- **Setup:** no credentials

## User tasks

1. As a user on UC1 Validate, I see Do/Do not first, then a **plain** “Where addresses come from” line, then “What is not the same.”
   - **Expect:** no green box on the where-addresses sentence.
2. As a user on UC1 quiz, a wrong answer explains why.
   - **Expect:** text starts with “Wrong.” not “Not that one.”
   - **Anti-cheat:** concept chips Entropy / Backup card / Address ≠ phrase jump to those pads after visit.
3. As a user on UC4, each Next click increments path index; Back to index 0 resets.
4. As a user on UC6, I generate three phrases and show BIP84 **zpub** (not silent xpub dump).
5. As a user, numbered rail and concept chips go **back** to visited steps only.

## Must not

- Persist mnemonic in sessionStorage
- Treat Shamir shares as cosigner keys on UC6
- Fund practice addresses (force-exit still required)

## Evidence

- [x] Playwright V2-S0–S12 (12 passed)
