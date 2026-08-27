# PR Draft: v0.16.64 UC8 three public example txs

**Spec:** `.agents/specs/2026-08-27-v2-uc8-paste-psbt.md`
**Plan:** `.agents/specs/2026-08-27-v2-uc8-paste-psbt-plan.md`

## What Problem This Solves

Classroom PSBT samples have no on-chain prevout, so UC8 never fetched a real tx. Learners need two or three true public examples.

## Why This Change Was Made

Operator asked for 2–3 real txs as examples on UC8. Possible without faking the classroom blob.

## User Impact

Chip **v0.17.107-v2**. Product **0.16.64**. Three buttons: Genesis coinbase, First transfer, Pizza day. Leak-ack then same-origin `/api/mempool/tx/`. Samples still honest not-found. No Sign.

## Traceability

| AC | Test |
|----|------|
| AC-1 | V2-S34 `test_ac_1_textarea` |
| AC-2 | V2-S37 S41 `test_ac_2_inspect_paste` |
| AC-3 | V2-S34 `test_ac_3_refuse_secret` |
| AC-4 | V2-S38 S41 `test_ac_4_classic_psbtin` |
| AC-5 | V2-S37 `test_ac_5_network_lookup_stays` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S37|V2-S38|V2-S41"`

## Threat notes

- secrets: public txids only; leak-ack before fetch
- xss: textContent
- csrf: GET lookup

## Evidence pack

hard_gates; Playwright V2-S37 S38 S41; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. Classroom samples still have no prevout
2. Examples are famous public txs, not this lab’s PSBT
3. Dual stamp 0.16.64 vs 0.17.107-v2
4. leftover scripts uncommitted
5. no Sign
6. Playwright mocks proxy

## Cross-review

Blockers 0.
