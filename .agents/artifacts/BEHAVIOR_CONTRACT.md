# Behavior contract — V2 lab habits 0.16.45

- **Product:** bip39lab
- **Target:** `http://127.0.0.1:4173/v2/`
- **Setup:** Playwright webServer

## User tasks

1. 15 tracks, chip 0.17.44-v2, classic Generate still on `/`
2. UC1: five Copy + QR on receive addresses
3. UC4: path SVG; change chain flips last-but-one path nibble 0→1
4. UC11: one-signer rounded card; five quiz questions all required
5. UC14: 12-word green then 15/24 TOO LOW until more rolls

## Must not

- QR the recovery phrase on these pads
- Sign or broadcast PSBT
- Persist mnemonic in sessionStorage

## Evidence

- [x] Playwright e2e/v2.spec.ts 16 passed
