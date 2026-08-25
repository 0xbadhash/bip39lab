# V2 Lab habits: copy/QR, path SVG, quizzes, lock vs word count

- **Product:** bip39lab
- **Created:** 2026-08-25
- **Status:** ready-for-agent
- **Priority:** P0
- **Plan:** `.agents/specs/2026-08-25-v2-lab-habits-plan.md`
- **Tracker:** local
- **Constitution:** AGENTS.md
- **Grill-me:** complete (G1 default; G2–G7 execute-dev defaults)
- **Surface:** `web/v2/` only · classic `/` unchanged

## Problem Statement

Lock colour was inverted; 12-word green stayed green on 15–24. Quizzes were three shallow items. Lab everyday habits (copy/QR, change chain, PSBT samples, compare table, room return) were still missing in-track.

## Solution

Pad lock starts red, green only when pad meets **this** word count. UC11/UC14 five-question banks. Copy+QR on addresses and watch keys. UC4 change + path SVG. UC8 three PSBT samples. UC3 A/B table. Dock back to Finish after Multisig/Shamir/Network.

## User Stories

1. Switch 12→24 after 128 bits: lock and bar drop until ~256.
2. Copy or QR a receive address without leaving the track.
3. Toggle receive vs change; see BIP 44/49/84/86 folders.
4. Answer five custody questions and five entropy questions.

## Testing Decisions

- V2-S0 chip 0.17.44-v2, 15 tracks
- V2-S1 copy/QR buttons
- V2-S10 change chain + SVG
- V2-S14 five UC11 quiz oks + one-signer card
- green_cmd: `npx playwright test e2e/v2.spec.ts`
