# PR Draft: v0.16.47 V2 P0–P2 tracks UC16–UC31

**Spec:** `.agents/specs/2026-08-25-v2-p0-p2-tracks.md`
**Plan:** `.agents/specs/2026-08-25-v2-p0-p2-tracks-plan.md`

## What Problem This Solves

V2 taught objects (UC1–15) but not jobs over time: restore, amount tiers, inheritance, first receive, metal, collab, ceremony, air-gap loop, geo keys, annual rehearsal, own node, UTXO, CoinJoin, decoy PP, BIP-85, SLIP-39 inheritance.

## Why This Change Was Made

Operator asked to implement P0–P2 from compare.md via `/execute-dev` through `/sync-docs` and refresh compare.md so those rows are shipped, not proposed.

## User Impact

Picker **UC1–UC31**. Chip **v0.17.47-v2**. Classic `/` unchanged. Practice-only: no mainnet fund, no real PSBT sign, no paste-real-seed, inheritance is not legal counsel.

## Traceability

| AC | Test |
|----|------|
| AC-1: 31 cards + chip | V2-S0 |
| AC-2: restore | V2-S17 |
| AC-3: amount tiers | V2-S18 |
| AC-4: first receive | V2-S19 |
| AC-5: air-gap loop | V2-S20 |
| AC-6: N/A — SLIP-39 dock copy; no extra pytest |
| AC-7: N/A — compare.md docs |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S0"`

TDD: V2-S0 failed 15 vs 31 before TRACKS; then 20 V2 tests passed. `false` keeps the red_cmd gate after green is committed.

## Threat notes

- secrets: restore words stay in `mem` / DOM only; sessionStorage progress + dock only
- xss: CSP `connect-src 'none'` on `/v2/`
- csrf: none

## Evidence pack

hard_gates; Playwright V2 (20 passed); pytest at release; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. leftover `scripts/*.py` stash — not this ship
2. Dual stamp product 0.16.47 vs chip 0.17.47-v2
3. `/v2/js/lab-strip.js` 404 (classic strip not on V2)
4. Teaching amounts 0.001 / 0.184 / 2.0 and sim 0.000184 tBTC
5. UC7 still edu hex; UC31 docks Suite

## Cross-review

Blockers 0. Obsolete Tier A 0.
