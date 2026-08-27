# PR Draft: v0.16.68 UC7 try two SLIP-39 lists

**Spec:** `.agents/specs/2026-08-27-v2-uc7-phrase-then-slip39.md`
**Plan:** `.agents/specs/2026-08-27-v2-uc7-phrase-then-slip39-plan.md`

## What Problem This Solves

SLIP-39 combine was only automatic. Learners should paste any two of three people-share lists and rebuild the practice hex themselves.

## Why This Change Was Made

Operator: create three word-share lists, reconstruct hex by hand; keep Combine any 2 of 3.

## User Impact

Chip **v0.17.111-v2**. Product **0.16.68**. Three boxes after Make practice SLIP-39 shares. **Try these 2 shares**. Auto combine stays. Lists are SLIP-39, not BIP-39 seeds.

## Traceability

| AC | Test |
|----|------|
| AC-1 | V2-S39 `test_ac_1_phrase_first` |
| AC-2 | V2-S39 S44 `test_ac_2_m_of_n_split` |
| AC-3 | V2-S40 S45 `test_ac_3_slip39_practice` |
| AC-4 | no Sign `test_ac_4_no_sign` |
| AC-5 | quiz `test_ac_5_quiz` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S40|V2-S45"`

## Threat notes

- secrets: practice shares in tab
- xss: textContent
- csrf: none

## Evidence pack

hard_gates; Playwright V2-S40 S45; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. Share lists look like BIP-39 — they are SLIP-39
2. Dual stamp 0.16.68 vs 0.17.111-v2
3. leftover scripts uncommitted
4. no Sign
5. Combine any 2 of 3 kept
6. One filled box fails honestly

## Cross-review

Blockers 0.
