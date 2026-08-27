# PR Draft: v0.16.59 V2 UC5 purpose tabs + descriptors

**Spec:** `.agents/specs/2026-08-27-v2-uc5-purpose-tabs.md`
**Plan:** `.agents/specs/2026-08-27-v2-uc5-purpose-tabs-plan.md`

## What Problem This Solves

V2 UC5 dumped every watch-only key. Classic still has BIP84/86/49/44 tabs and Refresh descriptors from Lab.

## Why This Change Was Made

WINDOW 6 UC5 leftover only. Copy purpose tabs + Lab descriptor refresh. Do not invent UC34 paste. Do not reopen UC1/UC3/UC4.

## User Impact

Chip **v0.17.98-v2**. `#v2WoType` + `#v2DescRefresh`. Classic `/` cache-bust only.

## Traceability

| AC | Test |
|----|------|
| AC-1 tabs | V2-S32 `test_ac_1_wo_tabs` |
| AC-2 prefixes | V2-S32 `test_ac_2_prefixes` |
| AC-3 desc | V2-S32 `test_ac_3_desc_refresh` |
| AC-4 chip | V2-S0 `test_ac_4_chip` |
| AC-5 classic | V2-S0 `test_ac_5_classic_descriptors` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S32"`

## Threat notes

- secrets: viewing keys only; no xprv
- xss: copyQrRowHtml attrEsc
- csrf: none

## Evidence pack

hard_gates; Playwright V2-S0/S32; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. Descriptor refresh is not UC34 paste
2. Dual stamp 0.16.59 vs 0.17.98-v2
3. leftover scripts stay stashed
4. UC1/UC3/UC4 not reopened
5. no Sign

## Cross-review

Blockers 0.
