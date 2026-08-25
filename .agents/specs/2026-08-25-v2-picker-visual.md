# V2 picker path chrome + visual sprint

- **Product:** bip39lab
- **Created:** 2026-08-25
- **Status:** ready-for-agent
- **Priority:** P0
- **Plan:** `.agents/specs/2026-08-25-v2-picker-visual-plan.md`
- **Surface:** `web/v2/` only (classic `/` unchanged)

## Problem Statement

After UC16–31 shipped, the picker was a flat catalog. Forensic reviews asked for a path product, then visual hierarchy (hero Start here, atoms on cards, progress dots, no blank first paint) without leaving App Shell.

## Solution

Path IA: default **Start here** (UC1, 2, 16). Hero cards with step index + Gap-kit atoms. Progress dots 0 of 3. Continue / Next up. Hard refresh under About V2. First-paint HTML skeleton. Ghost teasers for Keys. Lock caption “Stronger seed” only. UC1 address Copy + QR.

## Acceptance

| ID | Criterion |
|----|-----------|
| AC-1 | Default picker shows 3 Start here cards; All paths shows 31 |
| AC-2 | Finish UC1 → done check; Continue becomes UC2; Hard refresh clears marks |
| AC-3 | Chip `0.17.53-v2`; Hard refresh under About; Clear secrets stays |
| AC-4 | UC1 derive rows have Copy and QR |
| AC-5 | compare.md as-of product 0.16.48 / chip 0.17.53-v2 |

## Grill-me

Q: Does Hard refresh delete a real seed from disk?
A: No. It only wipes `bip39lab.v2` session/local progress and in-tab mem.

Q: Is the picker a 31-card wall on first paint?
A: No. HTML skeleton and default filter are Start here (3 cards).

Q: Does this change classic `/`?
A: No. Dual stamp; classic Lab unchanged.

## Testing Decisions

- V2-S0: 3 cards, Start here, atoms, dots, ghosts, All paths 31, chip
- V2-S1: Copy+QR count 5
- V2-S2: done + Next up UC2 + Hard refresh
- green_cmd: `npx playwright test e2e/v2.spec.ts`
