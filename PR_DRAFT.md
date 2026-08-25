# PR Draft: v0.16.48 V2 path picker + visual sprint

**Spec:** `.agents/specs/2026-08-25-v2-picker-visual.md`
**Plan:** `.agents/specs/2026-08-25-v2-picker-visual-plan.md`

## What Problem This Solves

The UC16–31 catalog was a wall of equal cards. Forensic reviews asked for a path product, then visual hierarchy (hero Start here, atoms on picker, progress dots, no blank first paint) without leaving App Shell.

## Why This Change Was Made

Operator asked for `/code-review` through `/sync-docs` and a compare.md refresh after the visual sprint (chip 0.17.53-v2).

## User Impact

Chip **v0.17.53-v2**. First paint shows Start here (3 cards + ghost Keys teasers). Finish UC1 marks done and Continue becomes Next up · UC2. Hard refresh under About V2 wipes progress. Clear secrets stays. Classic `/` unchanged.

## Traceability

| AC | Test |
|----|------|
| AC-1: Start here 3 / All 31 | V2-S0 |
| AC-2: done + Next up UC2 + Hard refresh | V2-S2 |
| AC-3: chip + About Hard refresh + Clear secrets | V2-S0 |
| AC-4: UC1 Copy and QR | V2-S1 |
| AC-5: N/A — compare.md docs stamp |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S0"`

TDD: picker count and chip assertions updated with the chrome; green V2-S0/S1/S2.

## Threat notes

- secrets: Hard refresh only drops progress store `bip39lab.v2`, not a funded phrase
- xss: CSP `connect-src 'none'`
- csrf: none

## Evidence pack

hard_gates; Playwright V2; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. leftover `scripts/*.py` stash — not this ship
2. Dual stamp 0.16.48 vs 0.17.53-v2
3. `/v2/js/lab-strip.js` 404
4. Hard refresh under About, not the top bar
5. Ghost Keys cards are teasers (`uc-ghost`), not extra `.uc-card` count

## Cross-review

Blockers 0. Obsolete Tier A 0.
