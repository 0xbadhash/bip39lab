# QA-CAMPAIGN-INVENTORY

**Marker:** QA-CAMPAIGN-INVENTORY  
**Date:** 2026-08-12  
**Product:** bip39lab v0.16.1  
**Phase:** init (QA does not advance FSM)  

## Baseline (pre-fix)

| Suite | Result |
|-------|--------|
| pytest | 96 passed |
| Playwright | **89 passed, 1 failed (S70)** |
| check_web_e2e | **FAIL** — missing Comet S40b |

## Tally

| Metric | Count |
|--------|-------|
| found | 4 |
| fixed | 4 |
| residual | 0 in-scope |
| stop reason | **codebase exhausted** for this surface (honest; not ≥200 scale) |

## Category matrix

| # | Category | Status |
|---|----------|--------|
| 1 Unit | exercised + new regressions |
| 2 Integration | N/A (static lab) |
| 3 E2E | full suite green after fix |
| 4 Contract | Comet S-id gate |
| 5–8 Stress/chaos/concurrency | out_of_scope |
| 9 Security | CSP headers live; mnemonic reject; no new findings |
| 10 Edge | passphrase ~0 bits display |
| 11 Regression | S70, S40b, quiz_return_keys, entropy_ui |
| 12–14 | out_of_scope / N/A |

## Bug table

| ID | Category | Sev | Summary | Root cause | Fix | Regression | Status |
|----|----------|-----|---------|------------|-----|------------|--------|
| QA-201 | Functional | **P0** | I1 Multisig dock stayed hidden (S70 red) | `learn-levels.js` treated `?from=intquiz` on Multisig as Lab return: ran before multisig-app and `history.replaceState` stripped query | `isLabIndexPage()` gates Lab-only from=* handlers | e2e S70; test_quiz_return_keys | **fixed** |
| QA-202 | Contract | **P1** | check_web_e2e fail: S40b missing from Comet | New Playwright S40b Classroom panel not documented | S40b section + scorecard row + stamp | check_web_e2e | **fixed** |
| QA-203 | UX | **P2** | Passphrase estimate showed `~0 bits` | Shannon=0 for mono-char strings; min() with charset still 0 for single unique char | Display `<1` when est&lt;0.5 | test_entropy_ui | **fixed** |
| QA-204 | UX | **P2** | Clear secrets left strength bar non-empty | clearEntropyFields skipped bar reset | Reset bar width/class on clear | clear path | **fixed** |
