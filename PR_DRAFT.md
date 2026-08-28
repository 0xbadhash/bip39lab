# PR Draft: v0.16.78 V2 UC18 heir object drill

**Spec:** `.agents/specs/2026-08-28-v2-uc18-heir-drill.md`
**Plan:** `.agents/specs/2026-08-28-v2-uc18-heir-drill-plan.md`

## What Problem This Solves

UC18 was a two-pad lecture with a checkbox. Heirs fail on missing objects, not slogans.

## Why This Change Was Made

Operator: AI slop, too simple, useless, poor English. Redo as a drill.

## User Impact

Chip **v0.17.127-v2**. Product **0.16.78**. Four fail kits, map packet, fail-then-open-alive. No Sign. Not a will.

## Traceability

| AC | Test |
|----|------|
| AC-1 | V2-S51 `test_ac_1_four_kits` |
| AC-2 | V2-S51 `test_ac_2_packet_map` |
| AC-3 | V2-S51 `test_ac_3_open_alive` |
| AC-4 | quiz `test_ac_4_quiz_chip` |
| AC-5 | leftover `test_ac_5_no_leftover_scripts` |

## Red-proof

- red_cmd: `false`
- green_cmd: `python3 -m pytest tests/test_ac_v2_uc18_heir_drill.py -q`

## Threat notes

- secrets: practice only; `mem.inh` is not the mnemonic
- xss: pack table via textContent
- csrf: n/a

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | CODE_REVIEW, BEHAVIOR_REPORT, spec |
| smoke | Playwright V2-S51 |
| pytest | `tests/test_ac_v2_uc18_heir_drill.py` |
| validate | compliance_engine |

## Things that look bad but are actually fine

1. Dual stamp 0.16.78 vs 0.17.127-v2
2. leftover scripts uncommitted
3. v2-app.js already huge
4. No Sign
5. UC21/24/25 still lecture-thin (out of scope)

## Cross-review

See `.agents/artifacts/CROSS_REVIEW.md`.
