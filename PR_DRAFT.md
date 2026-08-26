# PR Draft: v0.16.53 V2 compare polish + mint bar

**Spec:** `.agents/specs/2026-08-26-v2-uc3-mintbar.md`
**Plan:** `.agents/specs/2026-08-26-v2-uc3-mintbar-plan.md`

## What Problem This Solves

Compare required an extra button. Strength estimates were uncolored. Build-from-pad sat on the far right of the word-count row.

## Why This Change Was Made

Operator asked to drop Compare, color `~N bits · weak`, and put Build next to Word count.

## User Impact

Chip **v0.17.80-v2**. Live compare with colored tiers. Pad mint button beside the dropdown. Classic `/` cache-bust only.

## Traceability

| AC | Test |
|----|------|
| AC-1 no Compare | V2-S3 `#v2Cmp` count 0 |
| AC-2 colored weak | V2-S3 `#v2PpEstB` class weak |
| AC-3 mint beside count | V2-S15 bounding box gap |
| AC-4 chip | V2-S0 |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts`

## Threat notes

- secrets: no mnemonic in sessionStorage
- xss: estimate classes from ppTier; labels textContent
- csrf: none

## Evidence pack

hard_gates; Playwright e2e/v2.spec.ts; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. leftover scripts stash
2. Dual stamp 0.16.53 vs 0.17.80-v2
3. lab-strip 404
4. Photoreal atoms remain unshipped
5. Next unlocks from live derive, not a confirm click

## Cross-review

Blockers 0. Obsolete Tier A 0 remaining.
