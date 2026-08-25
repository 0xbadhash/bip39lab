# PR Draft: v0.16.45 V2 lab habits, lock vs word count, five-question quizzes

**Spec:** `.agents/specs/2026-08-25-v2-lab-habits.md`
**Plan:** `.agents/specs/2026-08-25-v2-lab-habits-plan.md`

## What Problem This Solves

12-word green stayed green on longer phrases. Quizzes were too thin. Everyday Lab copy/QR, change path, PSBT samples, and room return were missing in V2.

## Why This Change Was Made

Operator inverted lock colour, asked length-relative green, five-question quizzes, one-signer card chrome, then the compare.md gap list.

## User Impact

Chip **v0.17.44-v2**. Lock/bar follow 12→128 … 24→256. Copy/QR on addresses and xpubs. Path SVG + change. Three PSBT samples. Dock back to Finish after rooms.

## Traceability

| AC | Test |
|----|------|
| AC-1 picker 15 + chip | V2-S0 |
| AC-2 copy/QR | V2-S1 |
| AC-3 change + SVG | V2-S10 |
| AC-4 UC11 five quiz | V2-S14 |
| AC-5 lock vs length | V2-S15 |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts`

TDD N/A on green tree: V2-S1/S10/S14 extended in-place.

## Threat notes

- secrets: no mnemonic in sessionStorage; dock is id+step
- xss: CSP connect-src none
- csrf: none

## Evidence pack

hard_gates; smoke Playwright V2 16; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. Fake 0.184 BTC.
2. leftover `scripts/*.py` stashed.
3. lab-strip 404 on `/v2/`.
4. Dual stamp 0.16.45 vs 0.17.44-v2.
5. PSBT samples are empty educational blobs.

## Cross-review

Blockers 0. Obsolete Tier A 0.
