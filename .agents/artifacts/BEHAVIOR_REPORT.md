# BEHAVIOR-REPORT

- **contract:** `.agents/artifacts/BEHAVIOR_CONTRACT.md`
- **surface:** Playwright `e2e/v2.spec.ts` vs `http://127.0.0.1:4173`

## Clauses

| # | Result | Evidence |
|---|--------|----------|
| 1 Hard refresh + chip | pass | V2-S0 `#v2HardRefresh` in `.topbar-actions`; chip `0.17.62-v2` |
| 2 Continue Paper backup | pass | V2-S2 Mark First wallet done → Continue Paper backup; Hard refresh → First wallet |
| 3 Classic generate | pass | V2-S0 `/index.html` `#btnGenerate` |

V2-S14 pause labels updated to match verb+object copy; re-run passed.

Must-not: no Sign on UC8 (V2 inspect path not in this spec; UC23 never signs V2-S20). sessionStorage not asserted byte-wise; code review: progress only.

fail=0 blocked=0
