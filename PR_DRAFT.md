# PR Draft: v0.16.55 V2 UC32–UC35

**Spec:** `.agents/specs/2026-08-26-v2-uc32-35.md`
**Plan:** `.agents/specs/2026-08-26-v2-uc32-35-plan.md`

## What Problem This Solves

Four unique leftover jobs were missing from a 31-card picker: all-parts BIP39-looking split, inactivity timelock, descriptor/policy backup, Electrum-looking words.

## Why This Change Was Made

WINDOW 6 spec-first: UC32–35 only. Practice lab. No live CSV signer.

## User Impact

Chip **v0.17.89-v2**. Picker **35**. `?uc=32`–`35`. Classic `/` cache-bust only.

## Traceability

| AC | Test |
|----|------|
| AC-1 picker 35 + chip | V2-S0 `test_ac_1` |
| AC-2 SeedXOR all parts | V2-S23 `test_ac_2` |
| AC-3 timelock FSM | V2-S24 `test_ac_3` |
| AC-4 descriptor | V2-S25 `test_ac_4` |
| AC-5 Electrum | V2-S26 `test_ac_5` |
| AC-6 classic Generate | V2-S0 `test_ac_6` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts`

## Threat notes

- secrets: no mnemonic in sessionStorage
- xss: practice descriptor is a canned string; XOR grids use wordGridHtml from generated mnemonics
- csrf: none

## Evidence pack

hard_gates; Playwright e2e/v2.spec.ts; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. SeedXOR tab is not seedxor.com
2. Timelock does not sign CSV
3. Electrum path invents no Electrum address
4. Dual stamp 0.16.55 vs 0.17.89-v2
5. leftover scripts stash

## Cross-review

Blockers 0.
