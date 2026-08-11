# QA-CAMPAIGN-INVENTORY

**Marker:** QA-CAMPAIGN-INVENTORY  
**Started:** 2026-08-11  
**Product:** bip39lab v0.16.0 (+ QA fixes)  
**Phase note:** post-ship (`pipeline` init) — campaign does not advance FSM  

## Baseline

| Suite | Result | Notes |
|-------|--------|-------|
| pytest | **88 → 91 passed** | +quiz return + fee edges |
| playwright e2e | **86 → 87 S-ids** (S70 added); learn 10/10 | full suite green before commit |
| product_smoke / check_web_e2e | ok | 87 playwright S-ids |

## Tally

| Metric | Count |
|--------|-------|
| found | 6 |
| fixed | 6 |
| residual | 0 open in-scope |
| invented filler | 0 |
| stop reason | **codebase exhausted** for this surface (static offline lab; ~30k LOC web+tests) — not ≥200 scale |

## Category matrix (applicable)

| # | Category | Status |
|---|----------|--------|
| 1 | Unit | exercised + new regressions |
| 2 | Integration | N/A no service mesh; network parsers via Node |
| 3 | E2E | full Playwright + S70 |
| 4 | Contract | N/A no OpenAPI; Comet S-id contract checked |
| 5 | Stress/load | out_of_scope (static client; no server queue) |
| 6 | Performance | smoke only; no hotspot P0 |
| 7 | Concurrency | out_of_scope (single-tab localStorage; no races shipped) |
| 8 | Chaos | out_of_scope (no cluster) |
| 9 | Security | CSP audit; glossary escapeHtml; fee null-safety; connect-src lab `none` |
| 10 | Edge/boundary | fee NaN/neg; satsToBtc null; address list rejects words |
| 11 | Regression | tests for each fix |
| 12 | Compatibility | quizReturn legacy `"1"` still accepted |
| 13 | Observability | out_of_scope (no metrics pipeline) |
| 14 | Resource leak | dock reparent to body; no listener leaks found |

## Bug table

| ID | Category | Severity | Summary | Root cause | Fix | Regression | Status |
|----|----------|----------|---------|------------|-----|------------|--------|
| QA-001 | Functional / compat | **P1** | After I/A paths, `quizReturn` became `"quiz"` but Tools/Shamir still required `"1"` | Mode string change incomplete across modules | Accept `"1"\|"quiz"\|intquiz\|advquiz`; writers use `"quiz"` | `tests/test_quiz_return_keys.py` | **fixed** |
| QA-002 | Functional | **P1** | First-hour dock could resume while Intermediate/Advanced return active | Hour resume only suppressed when return `!== "1"` | `isQuizReturnValue()` | same unit | **fixed** |
| QA-003 | Correctness | **P2** | `exampleFeeSats(NaN/neg)` → `NaN` / misleading 0 | No finite check | return `null` if non-finite/neg | `tests/test_network_api.py` | **fixed** |
| QA-004 | Correctness | **P2** | `satsToBtc(null)` → `0.00000000` (`Number(null)===0`) | Coercion of null | null/empty → `"—"` | network_api test | **fixed** |
| QA-005 | UX | **P2** | Entropy pad showed amber dock on every roll, forcing Guided-quiz chrome | `showDock \|\| n > 0` | Show dock for quiz return or Q3/Q4 ready/active only | e2e learn S63 still green | **fixed** |
| QA-006 | Coverage | **P2** | I1 Multisig return dock untested | Missing e2e | S70 + Comet | e2e S70 | **fixed** |
