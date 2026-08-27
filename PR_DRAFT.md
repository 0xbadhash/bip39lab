# PR Draft: v0.16.74 UC7 amber three-share warning

**Spec:** `.agents/specs/2026-08-27-v2-uc7-amber-three-shares.md`
**Plan:** `.agents/specs/2026-08-27-v2-uc7-amber-three-shares-plan.md`

## What Problem This Solves

The “three lists are the full backup, not the exercise” note was not visually a warning.

## Why This Change Was Made

Operator: amber/orange when that message occurs.

## User Impact

Chip **v0.17.117-v2**. Product **0.16.74**. Three filled SLIP-39 boxes + Try paints `#v2S39TryOut` amber (`msg-warn`). Two matching shares stay green. Under two stay red. No Sign.

## Traceability

| AC | Test |
|----|------|
| AC-1 | V2-S45 `test_ac_1_warn` |
| AC-2 | V2-S45 `test_ac_2_two_ok` |
| AC-3 | V2-S45 `test_ac_3_under_bad` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g V2-S45`

## Threat notes

- secrets: practice hex in classroom copy
- xss: textContent
- csrf: n/a

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | CODE-REVIEW, BEHAVIOR-REPORT, spec |
| smoke | Playwright V2-S45 |
| pytest | `tests/test_ac_v2_uc7_amber.py` |
| validate | compliance_engine |

## Things that look bad but are actually fine

1. Dual stamp 0.16.74 vs 0.17.117-v2
2. leftover scripts uncommitted
3. Combining 3 still refused as the drill
4. Amber is CSS, not a new product token in :root
5. No Sign

## Cross-review

See `.agents/artifacts/CROSS_REVIEW.md`.
