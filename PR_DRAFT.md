# PR Draft: v0.16.52 V2 UC3 live compare

**Spec:** `.agents/specs/2026-08-26-v2-uc3-live-compare.md`
**Plan:** `.agents/specs/2026-08-26-v2-uc3-live-compare-plan.md`

## What Problem This Solves

UC3 compare only refreshed after Compare. Typing a passphrase left estimates and receive addresses stale. The key still shared the fields column so A and B did not align.

## Why This Change Was Made

Operator asked the passphrase table to be dynamic while typing, then a three-column card: beginner-key, stacked A/B, live story + table.

## User Impact

Chip **v0.17.78-v2**. Compare empty vs a test secret updates as you type. Classic `/` unchanged.

## Traceability

| AC | Test |
|----|------|
| AC-1 live estimates | V2-S3 `#v2CmpPpB` 4 chars, `#v2CmpPpA` 26 chars |
| AC-2 live addresses | V2-S3 `#v2CmpAddrA` `tb1` |
| AC-3 three columns | V2-S3 `.v2-cmp-face` + fields |
| AC-4 chip / classic | V2-S0 |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts`

## Threat notes

- secrets: no mnemonic in sessionStorage; passphrase only in RAM fields
- xss: story and table use textContent, not innerHTML
- csrf: none (static offline lab)

## Evidence pack

hard_gates; Playwright e2e/v2.spec.ts; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. leftover scripts stash still not this ship
2. Dual stamp product 0.16.52 vs chip 0.17.78-v2
3. Compare still required to unlock Next even though the table is live
4. lab-strip 404 under /v2/js
5. Photoreal PNGs remain untracked and unshipped

## Cross-review

Blockers 0. Obsolete Tier A 0 remaining (old innerHTML dump removed).
