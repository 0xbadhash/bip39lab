# PR Draft: v0.16.46 UC15 stills row, 128-char PP, compare.md

**Spec:** `.agents/specs/2026-08-25-v2-uc15-layout.md`
**Plan:** `.agents/specs/2026-08-25-v2-uc15-layout-plan.md`

## What Problem This Solves

UC15 first pad put the key in the wrong place. Typing a long passphrase felt cramped and made the Estimate column jump. compare.md was stale.

## Why This Change Was Made

Operator asked for dice → bits → lock → key, 64+ character PP, and a stable Estimate column, then a compare.md refresh with the ship chain.

## User Impact

Chip **v0.17.46-v2**. UC15 first pad matches Lab stills order. Textarea 128 chars. compare.md lists current v1 vs v2 including copy/QR, path SVG, quizzes, docks.

## Traceability

| AC | Test |
|----|------|
| AC-1 chip | V2-S0 |
| AC-2 hero + 64 chars | V2-S16 |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts`

TDD N/A: V2-S16 extended in-place.

## Threat notes

- secrets: PP not in sessionStorage
- xss: CSP connect-src none
- csrf: none

## Evidence pack

hard_gates; Playwright V2; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. leftover scripts stash
2. Dual stamp
3. lab-strip 404
4. 128-char cap is UI
5. Fake 0.184 BTC

## Cross-review

Blockers 0. Obsolete Tier A 0.
