# Behavior contract — V2 UC14–UC15 stills + UC11 hold

- **Product:** bip39lab
- **Target:** `http://127.0.0.1:4173/v2/`
- **Setup:** `python3 -m http.server 4173 --directory web`

## User tasks

1. Picker shows 15 tracks; classic `/` still Lab Generate.
   - **Expect:** 15 cards, chip 0.17.41-v2, `#btnGenerate` on `/`
2. UC14: few d6 TOO LOW; mint 12 then 24; roll until sufficient; lock tints.
3. UC15: pad words + passphrase stack; key still; long PP does not clear TOO LOW pad.
4. UC11: 0.184 bitcoin visible; freeze keeps 0.184; you-hold two columns.

## Must not

- Persist mnemonic in sessionStorage
- `connect-src` on `/v2/`
- Fund practice words

## Evidence

- [x] Playwright e2e/v2.spec.ts 16 passed
