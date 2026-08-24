# BEHAVIOR-REPORT

- **surface:** `/v2/` Playwright `e2e/v2.spec.ts`
- **date:** 2026-08-24

| Clause | Result | Evidence |
|--------|--------|----------|
| UC1 atoms + back-nav | pass | V2-S12 `#uc1Viz` count 3, atom 1/2 hi |
| Address 3-up | pass | V2-S9 |
| Generate toolbar (i) | pass | V2-S4 `#wrapMnemonicI` |
| UC2 atoms + print | pass | V2-S8 `#uc2Viz` atom 1 then 3 hi |
| Quiz no nag | pass | V2-S8 not “Select both right sentences” |
| Secret wall | pass | V2-S6 |

`npx playwright test e2e/v2.spec.ts` → **12 passed** (14.3s).
