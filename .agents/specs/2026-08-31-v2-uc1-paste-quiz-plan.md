# Plan: UC1 paste verdicts, address pad, quiz×3

## Approach

Paste is a drill, not a wall. Three honest verdicts. Checksum-fail still shows the numbered card and a not-BIP-39 meter. Receive-address pad stays mailbox-only. Quiz covers fund, backup object, checksum.

## Architecture

- `unknownBip39Words` + `BIP39Lab.validateMnemonic` in paste handler (`web/v2/js/v2-app.js`).
- `mem.bip39Ok`; `deriveNow` refuses false; lock ratio 0 on fail.
- `web/js/wordlist.js` loaded from `web/v2/index.html`.
- UC1 step 2: no `entropyHtml`. Step 4: `quizBank` of three `{q, opts}`.

## Implementation sequence

1. Paste three-way verdict + load card on checksum fail; strip entropy from address pad.
2. Three-question `quizBank`; Playwright S27/S12 + pytest AC.
3. Dual stamp 0.16.85 / 0.17.135-v2 on ship.
