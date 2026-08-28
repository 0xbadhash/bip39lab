# PR Draft: v0.16.77 V2 UC8 extra named txs

**Spec:** `.agents/specs/2026-08-28-v2-uc8-data-txs.md`
**Plan:** `.agents/specs/2026-08-28-v2-uc8-data-txs-plan.md`

## What Problem This Solves

Genesis / Hal / Pizza do not show OP_RETURN, inscriptions, or runes.

## Why This Change Was Made

Operator: find 3 txs with more on-chain data; inspect them in UC8.

## User Impact

Chip **v0.17.126-v2**. Product **0.16.77**. Three extra named buttons. Classroom snaps if fetch fails. No Sign.

## Traceability

| AC | Test |
|----|------|
| AC-1 | V2-S41 `test_ac_1_six_named` |
| AC-2 | V2-S41c `test_ac_2_op_return_snap` |
| AC-3 | V2-S41c `test_ac_3_ord_rune` |
| AC-4 | no Sign `test_ac_4_no_sign_chip` |
| AC-5 | leftover scripts `test_ac_5_no_leftover_scripts` |

## Red-proof

- red_cmd: `false`
- green_cmd: `python3 -m pytest tests/test_ac_v2_uc8_data_txs.py -q`

## Threat notes

- secrets: practice only
- xss: decoded ASCII via textContent in inspect dump
- csrf: n/a

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | CODE_REVIEW, BEHAVIOR_REPORT, spec |
| smoke | Playwright V2-S41 S41b S41c |
| pytest | `tests/test_ac_v2_uc8_data_txs.py` |
| validate | compliance_engine |

## Things that look bad but are actually fine

1. Dual stamp 0.16.77 vs 0.17.126-v2
2. leftover scripts uncommitted
3. v2-app.js already huge
4. No Sign

## Cross-review

See `.agents/artifacts/CROSS_REVIEW.md`.
