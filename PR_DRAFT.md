# PR Draft: v0.16.56 V2 UC1 paste + 44/49/84/86

**Spec:** `.agents/specs/2026-08-26-v2-uc1-portage.md`
**Plan:** `.agents/specs/2026-08-26-v2-uc1-portage-plan.md`

## What Problem This Solves

V2 UC1 could generate a phrase and show BIP84 rows only. Classic Lab still has paste (`#mnemonic`) and purpose tabs BIP44/49/84/86 (`#card-addresses`).

## Why This Change Was Made

WINDOW 6 leftover port: UC1 only. Copy those two jobs into the existing track. Practice lab. No signer. No broadcast.

## User Impact

Chip **v0.17.90-v2**. `#v2PasteMn` + `#v2PasteApply`. `#v2AddrType` four tabs. Classic `/` cache-bust only.

## Traceability

| AC | Test |
|----|------|
| AC-1 paste | V2-S27 `test_ac_1_paste` |
| AC-2 tabs | V2-S28 `test_ac_2_addr_tabs` |
| AC-3 prefixes | V2-S1 / V2-S28 `test_ac_3_prefixes` |
| AC-4 picker 35 + chip | V2-S0 `test_ac_4_picker_chip` |
| AC-5 classic mnemonic | V2-S0 `test_ac_5_classic_mnemonic` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S1 |V2-S27|V2-S28"`

## Threat notes

- secrets: paste stays in `mem`; not sessionStorage
- xss: addresses via textContent/attrEsc copy; paste is validated BIP-39 then wordGridHtml
- csrf: none

## Evidence pack

hard_gates; Playwright V2-S0/S1/S27/S28; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. Default tab is BIP84 so existing tb1q checks hold
2. Dual stamp 0.16.56 vs 0.17.90-v2
3. leftover scripts stay stashed
4. UC1 quiz unchanged
5. no Imagine stills on live v2

## Cross-review

Blockers 0.
