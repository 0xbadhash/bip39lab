# PR Draft: v0.16.42 V2 UC14 dice / coin entropy

**Spec:** `.agents/specs/2026-08-24-v2-uc-entropy-dice-coin.md`
**Plan:** `.agents/specs/2026-08-24-v2-uc-entropy-dice-coin-plan.md`

## What Problem This Solves

V2 could generate a proper OS phrase but never showed that a few dice or coin flips can still print 12 words while entropy is TOO LOW.

## Why This Change Was Made

Operator asked for the classic entropy-pad lesson as a V2 use case, then `/execute_dev` on the spec.

## User Impact

UC14: few d6 → TOO LOW; mint words still weak; ~50 d6 ≈ 128 bits; coin = 1 bit (128 flips). Chip v0.17.24-v2. Classic `/` unchanged.

## Traceability

| AC | Test |
|----|------|
| AC-1 14 cards | V2-S0 |
| AC-2 TOO LOW / words / 50 d6 / coin | V2-S15 |
| AC-3 classic `/` | V2-S0 |
| AC-4 pytest | `.venv/bin/python -m pytest -q` |

## Red-proof

- red_cmd: `npx playwright test e2e/v2.spec.ts -g V2-S15` (failed before UC14)
- green_cmd: `npx playwright test e2e/v2.spec.ts`

## Threat notes

- secrets: pad events in memory only
- xss: CSP connect-src none
- csrf: none

## Evidence pack

CODE-REVIEW / CROSS-REVIEW / BEHAVIOR-REPORT; Playwright 15; pytest; hard_gates.

## Things that look bad but are actually fine

1. Buttons use Math.random — labelled simulated, same as classic pad.
2. leftover `scripts/*.py` uncommitted.
3. lab-strip 404 on `/v2/`.
4. Dual stamp 0.16.42 vs 0.17.24-v2.
5. Hashing a short log still yields 12 checksummed words — that is the lesson.

## Cross-review

Blockers 0. Obsolete Tier A 0.
