# PR Draft: v0.16.44 V2 UC14–UC15 stills, 12–24 pad, UC11 hold split

**Spec:** `.agents/specs/2026-08-25-v2-uc14-15-stills.md`
**Plan:** `.agents/specs/2026-08-25-v2-uc14-15-stills-plan.md`

## What Problem This Solves

UC14 hid bit totals and only minted 12 words. Learners could not see 256-bit / 24-word need, Lab stills, or pad+passphrase. UC11 buried 0.184 bitcoin and mixed one-signer with 2-of-3.

## Why This Change Was Made

Operator asked to refresh compare.md, make entropy visible (~317), reuse Lab dice/key/lock, 12–24 generate until sufficient, then a passphrase stack, then UC11 0.184 and two-column you-hold.

## User Impact

Picker UC1–UC15. Chip **v0.17.41-v2**. UC14 live bits + stills. UC15 pad+PP. UC11 huge 0.184; freeze keeps the number; one signer | co-signer columns.

## Traceability

| AC | Test |
|----|------|
| AC-1 15 tracks | V2-S0 |
| AC-2 0.184 + hold split | V2-S14 |
| AC-3 12–24 pad + lock | V2-S15 |
| AC-4 UC15 PP stack | V2-S16 |
| AC-5 classic `/` | V2-S0 |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts`

TDD N/A on green tree: V2-S15 extended in-place; V2-S16 added green.

## Threat notes

- secrets: no mnemonic in sessionStorage
- xss: CSP connect-src none
- csrf: none

## Evidence pack

hard_gates; smoke Playwright V2 16 passed; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. Fake 0.184 BTC.
2. leftover `scripts/*.py` stashed.
3. lab-strip 404 on `/v2/`.
4. Dual stamp 0.16.44 vs 0.17.41-v2.
5. Lock “red/green” is hue-rotate on the blue Lab PNG.

## Cross-review

Blockers 0. Obsolete Tier A 0.
