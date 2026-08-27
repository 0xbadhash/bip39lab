# PR Draft: v0.16.69 UC7 recovery green/red

**Spec:** `.agents/specs/2026-08-27-v2-uc7-phrase-then-slip39.md`
**Plan:** `.agents/specs/2026-08-27-v2-uc7-phrase-then-slip39-plan.md`

## What Problem This Solves

Successful seed-phrase recovery and failed recovery looked the same.

## Why This Change Was Made

Operator: success green, fail red.

## User Impact

Chip **v0.17.112-v2**. Product **0.16.69**. Combine / Try boxes use msg-ok / msg-bad. Same for SLIP-39 hex match.

## Traceability

| AC | Test |
|----|------|
| AC-1 | V2-S39 `test_ac_1_phrase_first` |
| AC-2 | V2-S39 S44 msg-ok/msg-bad `test_ac_2_m_of_n_split` |
| AC-3 | V2-S40 S45 `test_ac_3_slip39_practice` |
| AC-4 | no Sign `test_ac_4_no_sign` |
| AC-5 | quiz `test_ac_5_quiz` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S39|V2-S44"`

## Threat notes

- secrets: practice only
- xss: textContent
- csrf: none

## Evidence pack

hard_gates; Playwright V2-S39 S44; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. Dual stamp 0.16.69 vs 0.17.112-v2
2. leftover scripts uncommitted
3. no Sign
4. Neutral split dump stays uncolored
5. Quiz colors already existed
6. pre.out.msg-ok overrides panel background

## Cross-review

Blockers 0.
