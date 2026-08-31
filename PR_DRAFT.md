# PR Draft: v0.16.85 UC1 paste verdicts, address pad, quiz×3

**Spec:** `.agents/specs/2026-08-31-v2-uc1-paste-quiz.md`
**Plan:** `.agents/specs/2026-08-31-v2-uc1-paste-quiz-plan.md`

## What Problem This Solves

Checksum-fail paste blocked practice. Show receive addresses repeated the entropy stack. Quiz was a single item.

## Why This Change Was Made

Operator: practice pasted words with honest verdicts; drop lock/meter on the address pad; expand UC1 quiz to three. Full ship FSM.

## User Impact

Chip **v0.17.135-v2**. Product **0.16.85**. Paste: not at all / words OK checksum not / all fine. Checksum-fail fills the card, not addresses. Quiz: fund, numbered card, checksum.

## Traceability

| AC | Test |
|----|------|
| AC-1 paste verdicts | `test_ac_2_paste_checksum_copy` + Playwright V2-S27 |
| AC-2 no entropy on step 2 | `test_ac_uc1_step2_no_lock_or_entropy_meter` |
| AC-3 three quiz items | Playwright V2-S12 `.v2-quiz-q` count 3 |

## Red-proof

- red_cmd: `false`
- green_cmd: `.venv/bin/python3 -m pytest tests/test_ac_v2_uc1_card_object.py tests/test_ac_v2_uc1_uc7_classroom.py -q`

## Threat notes

- secrets: practice lists only; checksum-fail cannot derive
- xss: static teach HTML
- csrf: n/a

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | CODE_REVIEW, BEHAVIOR_REPORT, spec |
| smoke | pytest AC + Playwright V2-S12 V2-S27 |
| pytest | card_object + classroom |
| validate | compliance_engine via venv |

## Things that look bad but are actually fine

1. Dual stamp 0.16.85 vs 0.17.135-v2
2. leftover scripts uncommitted if present
3. Some random 12 dictionary words (e.g. arrow hour this…) can still checksum-pass
4. Classic 232 Playwright not this ship’s green_cmd
5. `wordlist.js` extra fetch on `/v2/`

## Cross-review

See `.agents/artifacts/CROSS_REVIEW.md`.
