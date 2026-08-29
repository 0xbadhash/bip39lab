# PR Draft: v0.16.82 UC1 classroom, UC7 Try honesty, UC16 length

**Spec:** `.agents/specs/2026-08-29-v2-uc1-uc7-classroom.md`
**Plan:** `.agents/specs/2026-08-29-v2-uc1-uc7-classroom-plan.md`

## What Problem This Solves

UC1 copy was unreadable; paste of 12 dictionary words looked like a lab bug. UC7 Try died on one odd-hex line; SLIP printout was locked. UC16 generate had no 12–24 select.

## Why This Change Was Made

Operator: 11-year-old language; merge blues; no stray (i) line-breaks; Shamir any-M with a bad extra; SLIP pad editable but one-row shares; UC16 length before generate.

## User Impact

Chip **v0.17.132-v2**. Product **0.16.82**. Checksum still fail-closed. No Sign.

## Traceability

| AC | Test |
|----|------|
| AC-1 | `test_ac_1_uc1_one_bip39_box_and_entropy` |
| AC-2 | `test_ac_2_paste_checksum_copy` |
| AC-3 | `test_ac_3_shamir_skips_bad_lines` |
| AC-4 | `test_ac_4_uc16_and_xor` |

## Red-proof

- red_cmd: `false`
- green_cmd: `.venv/bin/python3 -m pytest tests/test_ac_v2_uc1_uc7_classroom.py tests/test_ac_v2_uc7_layout.py tests/test_ac_v2_uc16_wordcount.py -q`

## Threat notes

- secrets: practice only; invalid paste does not load a card
- xss: static teach HTML + inlineI titles escaped via attrEsc
- csrf: n/a

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | CODE_REVIEW, BEHAVIOR_REPORT, spec |
| smoke | pytest AC |
| pytest | three AC modules |
| validate | compliance_engine via venv |

## Things that look bad but are actually fine

1. Dual stamp 0.16.82 vs 0.17.132-v2
2. leftover scripts uncommitted
3. Full Lab Playwright 232 still walls at 780s
4. Random 12 English words fail checksum on purpose
5. SLIP share boxes one row with sideways scroll

## Cross-review

See `.agents/artifacts/CROSS_REVIEW.md`.
