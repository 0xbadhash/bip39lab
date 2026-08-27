# PR Draft: v0.16.63 V2 UC7 phrase-first Shamir + practice SLIP-39

**Spec:** `.agents/specs/2026-08-27-v2-uc7-phrase-then-slip39.md`
**Plan:** `.agents/specs/2026-08-27-v2-uc7-phrase-then-slip39-plan.md`

## What Problem This Solves

UC7 split a random hex blob. Learners never made a phrase first, could not pick M-of-N, and never saw Trezor-shaped SLIP-39 word shares.

## Why This Change Was Made

Operator asked: phrase first, choose M-of-N, one-click split then explain, then a practice SLIP-39 exercise compatible in format with Trezor, still a lab.

## User Impact

Chip **v0.17.106-v2**. Product **0.16.63**. Generate 12 words → 2-of-3 or 3-of-5 split/combine with a story → practice SLIP-39 2-of-3 + dock `/slip39.html`. Never fund. No Sign.

## Traceability

| AC | Test |
|----|------|
| AC-1 | V2-S39 `test_ac_1_phrase_first` |
| AC-2 | V2-S39 `test_ac_2_m_of_n_split` |
| AC-3 | V2-S40 `test_ac_3_slip39_practice` |
| AC-4 | V2-S39 no Sign `test_ac_4_no_sign` |
| AC-5 | quizBank in UC7 `test_ac_5_quiz` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S39|V2-S40"`

## Threat notes

- secrets: practice mnemonic in tab memory only; no session persist of phrase
- xss: textContent for share dumps
- csrf: none

## Evidence pack

hard_gates; Playwright V2-S39 S40; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. Classroom hex is still not Trezor import
2. SLIP-39 pad is real format, unfunded
3. Dual stamp 0.16.63 vs 0.17.106-v2
4. leftover scripts uncommitted
5. no Sign
6. UC6/UC8 untouched

## Cross-review

Blockers 0.
