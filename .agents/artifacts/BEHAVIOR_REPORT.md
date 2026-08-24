# BEHAVIOR-REPORT

- **surface:** `/v2/` via Playwright `e2e/v2.spec.ts`
- **date:** 2026-08-24
- **source-blind:** judged by test output and user-visible selectors only

| Clause | Result | Evidence |
|--------|--------|----------|
| UC1 quiz why | pass | V2-S12 `#v2QuizMsg` contains Wrong / refund; not “Not that one” |
| UC1 concept back | pass | V2-S12 chips → Generate, card ack, Derive |
| UC4 index | pass | V2-S10 path 0→1→2 then 0 |
| UC6 three zpubs | pass | V2-S11 `#v2CsZpub{i}` `/^zpub/`; rail to M-of-N |
| Secret wall | pass | V2-S6 sessionStorage no mnemonic |
| Picker + classic | pass | V2-S0 |
| Compact card | pass | V2-S9 |

**fails:** 0  
**blocked:** 0  

`npx playwright test e2e/v2.spec.ts` → 12 passed (11.9s).
