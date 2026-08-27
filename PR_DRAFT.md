# PR Draft: v0.16.73 V2 UC14 extra RNG toys

**Spec:** `.agents/specs/2026-08-27-v2-uc14-rng-toys.md`

## What Problem This Solves

V2 UC14 leftover vs classic entropy pad: `+10 d6` copy and send pad to Lab.

## Why This Change Was Made

WINDOW 6 UC14 CEO lock. V2 has no Lab tab — send pad lands practice words on First wallet.

## User Impact

Chip **v0.17.116-v2**. Product **0.16.73**. `#v2Dice10` is **+10 d6 (fast)**. `#v2EntToLab` copies pad words onto UC1 after confirm. Practice only. No Sign. UC10 untouched.

## Traceability

| AC | Test |
|----|------|
| AC-1 | V2-S15 V2-S46 `test_ac_1_dice10` |
| AC-2 | V2-S46 `test_ac_2_send_pad` |
| AC-3 | V2-S46 sessionStorage `test_ac_3_practice_only` |
| AC-4 | V2-S0 classic Lab `test_ac_4_classic_toys` |
| AC-5 | no UC10 files `test_ac_5_no_uc10` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S15|V2-S46"`

## Threat notes

- secrets: mnemonic stays in memory; not sessionStorage
- xss: word grid existing path
- csrf: n/a

## Evidence pack

Playwright V2-S15 S46; pytest AC file; CODE-REVIEW.

## Things that look bad but are actually fine

1. First wallet is the Lab analog on V2
2. Dual stamp 0.16.73 vs 0.17.116-v2
3. leftover scripts uncommitted
4. no Sign
5. dice remain Math.random classroom toys
