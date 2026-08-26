# PR Draft: v0.16.54 V2 tracks polish

**Spec:** `.agents/specs/2026-08-26-v2-tracks-polish.md`
**Plan:** `.agents/specs/2026-08-26-v2-tracks-polish-plan.md`

## What Problem This Solves

V2 cards that the operator walked still hid teaching (compare click, far-right mint, 4-letter-only plate, first-option quizzes, slogan UC22, folders without visible amounts).

## Why This Change Was Made

Operator asked live compare, mint beside word count, full-word plate stamps, shuffled plain quizzes, firmware examples, laptop seed stays hot, and visible folder amounts beside addresses.

## User Impact

Chip **v0.17.88-v2**. Classic `/` cache-bust only.

## Traceability

| AC | Test |
|----|------|
| AC-1 compare/mint | V2-S3, V2-S15 |
| AC-2 plate | V2-S21 |
| AC-3 quizzes | V2-S2/S14 (data-quiz not position) |
| AC-4 UC22 | V2-S22 |
| AC-5 UC4 amounts | V2-S10 |
| AC-6 chip | V2-S0 |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts`

## Threat notes

- secrets: no mnemonic in sessionStorage
- xss: quiz copy is author-controlled; estimates use textContent
- csrf: none

## Evidence pack

hard_gates; Playwright e2e/v2.spec.ts; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. leftover scripts stash
2. Dual stamp 0.16.54 vs 0.17.88-v2
3. lab-strip 404
4. Teaching BTC amounts are not chain lookups
5. Photoreal atoms remain unshipped

## Cross-review

Blockers 0. Obsolete Tier A 0 remaining.
