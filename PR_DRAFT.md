# PR Draft: v0.16.58 V2 UC4 live path table

**Spec:** `.agents/specs/2026-08-27-v2-uc4-path-table.md`
**Plan:** `.agents/specs/2026-08-27-v2-uc4-path-table-plan.md`

## What Problem This Solves

V2 UC4 had index and change folders. Classic `#cardPathPlay` still live-binds a path level table and BIP 44/49/84/86 folders. That bind was missing on v2.

## Why This Change Was Made

WINDOW 6 UC4 leftover only. Copy the live table. Do not reopen UC1 or UC3.

## User Impact

Chip **v0.17.92-v2**. `#v2PathPlayTable` + `#v2PathPurpose`. Default BIP84. Classic `/` cache-bust only.

## Traceability

| AC | Test |
|----|------|
| AC-1 table | V2-S10 V2-S30 `test_ac_1_table` |
| AC-2 index bind | V2-S10 V2-S30 `test_ac_2_index_bind` |
| AC-3 purpose tabs | V2-S30 `test_ac_3_purpose_tabs` |
| AC-4 chip + S10 | V2-S0 V2-S10 `test_ac_4_chip_s10` |
| AC-5 classic | V2-S0 `test_ac_5_classic_path_play` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S10 |V2-S30"`

## Threat notes

- secrets: phrase stays in `mem`
- xss: path cells textContent
- csrf: none

## Evidence pack

hard_gates; Playwright V2-S0/S10/S30; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. Default purpose 84 so S10 stays m/84'
2. Dual stamp 0.16.58 vs 0.17.92-v2
3. leftover scripts stay stashed
4. UC1/UC3 not reopened
5. teaching amounts stay fake

## Cross-review

Blockers 0.
