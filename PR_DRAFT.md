# PR Draft: v0.16.71 UC7 SLIP-39 three lists is not the exercise

**Spec:** `.agents/specs/2026-08-27-v2-uc7-phrase-then-slip39.md`
**Plan:** `.agents/specs/2026-08-27-v2-uc7-phrase-then-slip39-plan.md`

## What Problem This Solves

Pasting all three SLIP-39 shares either errored or counted as the drill. The exercise is 2-of-3.

## Why This Change Was Made

Operator: three shares are correct but not the exercise; provide only two.

## User Impact

Chip **v0.17.114-v2**. Product **0.16.71**. Three boxes: “correct full backup, not the exercise.” Exactly two: green on match. One: red. Combine any 2 of 3 stays.

## Traceability

| AC | Test |
|----|------|
| AC-1 | V2-S39 `test_ac_1_phrase_first` |
| AC-2 | V2-S44 `test_ac_2_m_of_n_split` |
| AC-3 | V2-S40 S45 `test_ac_3_slip39_practice` |
| AC-4 | no Sign `test_ac_4_no_sign` |
| AC-5 | quiz `test_ac_5_quiz` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S45"`

## Threat notes

- secrets: practice shares
- xss: textContent
- csrf: none

## Evidence pack

hard_gates; Playwright V2-S45; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. Library refuses 3 mnemonics for 2-of-3 — we check first 2 then teach
2. Dual stamp 0.16.71 vs 0.17.114-v2
3. leftover scripts uncommitted
4. no Sign
5. Combine any 2 of 3 still auto
6. Three lists not green

## Cross-review

Blockers 0.
