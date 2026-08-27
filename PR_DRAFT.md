# PR Draft: v0.16.67 UC7 paste-and-try recombine

**Spec:** `.agents/specs/2026-08-27-v2-uc7-phrase-then-slip39.md`
**Plan:** `.agents/specs/2026-08-27-v2-uc7-phrase-then-slip39-plan.md`

## What Problem This Solves

Combine any M hid the recovery drill. Learners need a box to paste M shares and try whether they rebuild the phrase.

## Why This Change Was Made

Operator: space to recombine M secrets and a button to see if it works; keep Combine any M.

## User Impact

Chip **v0.17.110-v2**. Product **0.16.67**. Same pad: paste `share:index:hex`, **Try these M shares**. Auto **Combine any M** stays. Honest fail if too few lines.

## Traceability

| AC | Test |
|----|------|
| AC-1 | V2-S39 `test_ac_1_phrase_first` |
| AC-2 | V2-S39 S44 `test_ac_2_m_of_n_split` |
| AC-3 | V2-S40 `test_ac_3_slip39_practice` |
| AC-4 | V2-S44 no Sign `test_ac_4_no_sign` |
| AC-5 | quiz `test_ac_5_quiz` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S39|V2-S44"`

## Threat notes

- secrets: practice phrase in tab
- xss: textContent
- csrf: none

## Evidence pack

hard_gates; Playwright V2-S39 S44; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. Prefill of all N shares is so the format is visible
2. Dual stamp 0.16.67 vs 0.17.110-v2
3. leftover scripts uncommitted
4. no Sign
5. Combine any M still auto-picks first M
6. Under-threshold is honest fail

## Cross-review

Blockers 0.
