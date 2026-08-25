# CODE-REVIEW

- **command:** `/code_review` working tree vs origin/master
- **base:** origin/master
- **head:** working tree → 0.16.45
- **secrets:** no new secrets; QR/copy are addresses and xpubs, not mnemonics
- **engine:** same session

## Accepted P0

**none**

- CSP `connect-src none`. sessionStorage: progress, gates, dock `{id,step}` only.
- QR via `BIP39Lab.qrDataUrl` on addresses/xpubs. Seed QR not added on V2 pads.
- PSBT samples are synthetic inspect-only (`cHNidP8…`).
- Lock green only when `entBits >= entNeed()` for the selected word count.

## Follow-ups

- leftover `scripts/*.py` still stashed
- `/v2/js/lab-strip.js` 404
- classic full Playwright not the V2 gate

p0=0 follow_ups=3

## Smoke

`npx playwright test e2e/v2.spec.ts` — 16 passed (pre-stamp)
