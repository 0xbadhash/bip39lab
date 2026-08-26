# BEHAVIOR-REPORT

- **contract:** `.agents/artifacts/BEHAVIOR_CONTRACT.md`
- **surface:** Playwright `e2e/v2.spec.ts` against local http.server

## Clauses

| ID | Result | Evidence |
|----|--------|----------|
| 1 three columns | pass | V2-S3 `.v2-cmp-face`, `#ppA`/`#ppB` in `.v2-cmp-fields`, `#v2CmpStoryA` |
| 2 live type | pass | V2-S3 `#v2CmpPpB` 4 chars, `#v2CmpPpA` 26 chars, `#v2CmpAddrA` `tb1` without Compare first |
| 3 Compare unlock | pass | V2-S3 `.v2-verdict` /two wallets/ after Compare |
| classic generate | pass | V2-S0 `/index.html` still Lab |
| chip | pass | V2-S0 `0.17.78-v2` |

Must-not: no sessionStorage mnemonic asserted by existing V2 tests / hard refresh path (unchanged this ship).

**summary:** 20/20 V2 Playwright passed. pytest 124 passed.
