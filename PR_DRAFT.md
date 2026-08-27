# PR Draft: v0.16.76 V2 teach vs result

**Spec:** `.agents/specs/2026-08-27-v2-teach-vs-result.md`
**Plan:** `.agents/specs/2026-08-27-v2-teach-vs-result-plan.md`

## What Problem This Solves

Classroom what/why/when/how was mixed with lab objects and chain fields.

## Why This Change Was Made

Operator: same split as UC8/UC7 Shamir on every payload track.

## User Impact

Chip **v0.17.125-v2**. Product **0.16.76**. Blue box = teaching. Result = hex/key/table/txid. No Sign.

## Traceability

| AC | Test |
|----|------|
| AC-1 | V2-S39 `test_ac_1_uc7_shamir` |
| AC-2 | V2-S34 `test_ac_2_uc8` |
| AC-3 | V2-S33 `test_ac_3_uc6` |
| AC-4 | V2-S40 `test_ac_4_slip39` |
| AC-5 | V2-S13 no Sign `test_ac_5_no_sign` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S39|V2-S40"`

## Threat notes

- secrets: practice only, no persist
- xss: teachBox static HTML; objects textContent
- csrf: n/a

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | CODE-REVIEW, BEHAVIOR-REPORT, spec |
| smoke | Playwright V2-S13 S33 S34 S39 S40 |
| pytest | `tests/test_ac_v2_teach_vs_result.py` |
| validate | compliance_engine |

## Things that look bad but are actually fine

1. Dual stamp 0.16.76 vs 0.17.125-v2
2. leftover scripts uncommitted
3. Sort/ceremony UCs have no extra blue dump
4. `teachBox` uses `.v2-callout.done` (accent blue)
5. No Sign

## Cross-review

See `.agents/artifacts/CROSS_REVIEW.md`.
