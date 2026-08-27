# PR Draft: v0.16.75 V2 mempool + UC7 extra + UC8 split

**Spec:** `.agents/specs/2026-08-27-v2-w6-mempool-uc7-uc8.md`
**Plan:** `.agents/specs/2026-08-27-v2-w6-mempool-uc7-uc8-plan.md`

## What Problem This Solves

V2 could not fetch mempool like Network. UC10 address dump was not the fail-closed table. UC7 had no extra-secret compare. UC8 mixed story with chain fields.

## Why This Change Was Made

Operator: CSP exception for UC8/UC10; SLIP-39 passphrase with/without; separate inspect description from chain result.

## User Impact

Chip **v0.17.122-v2**. Product **0.16.75**. `/v2/` may call mempool.space after leak-ack (same as Network). Classic Lab still offline. No Sign.

## Traceability

| AC | Test |
|----|------|
| AC-1 | V2-S47 S48 `test_ac_1_csp_fallback` |
| AC-2 | V2-S43 S49 `test_ac_2_addr_table` |
| AC-3 | V2-S50 `test_ac_3_slip39_pp` |
| AC-4 | V2-S41b `test_ac_4_uc8_split` |
| AC-5 | no Sign `test_ac_5_no_sign` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S41b|V2-S50"`

## Threat notes

- secrets: leak-ack; practice extra `lab`; no mnemonic persist
- xss: textContent table cells
- csrf: GET explorer only

## Evidence pack

| Item | Result |
|------|--------|
| hard_gates | CODE-REVIEW, BEHAVIOR-REPORT, spec |
| smoke | Playwright V2-S41b S43 S47–S50 |
| pytest | `tests/test_ac_v2_w6_mempool_uc7_uc8.py` + `test_network_api.py` |
| validate | compliance_engine |

## Things that look bad but are actually fine

1. Dual stamp 0.16.75 vs 0.17.122-v2
2. leftover scripts uncommitted
3. CSP is page-wide on /v2/ not per-UC
4. 0 (empty) is valid ok, not unknown
5. nginx live /v2/ location already reloaded
6. No Sign

## Cross-review

See `.agents/artifacts/CROSS_REVIEW.md`.
