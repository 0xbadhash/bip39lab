# PR Draft: v0.16.65 UC7 same-pad split; UC8 named true txs

**Spec:** `.agents/specs/2026-08-27-v2-uc7-phrase-then-slip39.md`
**Plan:** `.agents/specs/2026-08-27-v2-uc7-phrase-then-slip39-plan.md`

## What Problem This Solves

UC7 left the phrase pad before split, so shares looked like they came from nowhere. UC8 buried true txs; learners need to select named history then inspect.

## Why This Change Was Made

Operator: stay on the same UC7 screen after generate and split those words. UC8: propose Genesis coinbase, First transfer, Pizza day — select then inspect.

## User Impact

Chip **v0.17.108-v2**. Product **0.16.65**. UC7 word grid + split on one pad. UC8 select named tx → leak-ack → Inspect this transaction. No Sign.

## Traceability

| AC | Test |
|----|------|
| AC-1 | V2-S39 same pad `test_ac_1_phrase_first` |
| AC-2 | V2-S39 split/combine `test_ac_2_m_of_n_split` |
| AC-3 | V2-S40 `test_ac_3_slip39_practice` |
| AC-4 | V2-S34 S41 no Sign `test_ac_4_no_sign` |
| AC-5 | V2-S41 named txs `test_ac_5_quiz` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S39|V2-S40|V2-S41"`

## Threat notes

- secrets: practice phrase in tab; public txids only
- xss: textContent
- csrf: GET lookup

## Evidence pack

hard_gates; Playwright V2-S39 S40 S41; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. Classroom PSBT still has no prevout
2. Dual stamp 0.16.65 vs 0.17.108-v2
3. leftover scripts uncommitted
4. no Sign
5. SLIP-39 still next pad after hex
6. Playwright mocks proxy

## Cross-review

Blockers 0.
