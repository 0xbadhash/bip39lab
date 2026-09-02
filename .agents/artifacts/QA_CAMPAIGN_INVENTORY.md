# QA-CAMPAIGN-INVENTORY

**Marker:** QA-CAMPAIGN-INVENTORY  
**Date:** 2026-09-02  
**Product:** bip39lab v0.16.86  
**Phase:** init (QA does not advance FSM)

## Baseline

| Suite | Result |
|-------|--------|
| pytest | 227 passed (pre-fix) → 232+ after |
| Playwright V2-S26 | PASS |
| check_web_e2e | ok |

## Tally

| Metric | Count |
|--------|-------|
| found | 4 |
| fixed | 4 |
| residual | 0 in this wave |
| stop reason | **exhausted this wave** (honest; not ≥200 unique defects in static lab) |

## Category matrix

| # | Category | Status |
|---|----------|--------|
| 1 Unit | pytest + new QA regressions |
| 2 Integration | N/A — no DB/API product |
| 3 E2E | V2-S26 + existing suite |
| 4 Contract | web_e2e S-ids |
| 5–8 Stress/chaos/concurrency | out_of_scope static files |
| 9 Security | XSS escape + asset paths |
| 10 Edge | HTML-special paste words |
| 11 Regression | tests/test_qa_v2_hardening.py |
| 12 Compatibility | leftover v2 chip vs script query |
| 13 Observability | N/A |
| 14 Resource leak | out_of_scope (killed 4173 outside) |

## Bug table

| ID | Category | Severity | Root cause | Fix |
|----|----------|----------|------------|-----|
| QA-2026-09-02-1 | E2E / assets | P1 | `help-ui.js` loaded `js/lab-strip.js` relative to `/v2/` → 404 | Nested pages use `../js/lab-strip.js` |
| QA-2026-09-02-2 | E2E / assets | P2 | `lab-strip.js` loaded `css/lab-strip.css` under `/v2/` → 404 | Nested pages use `../css/lab-strip.css` |
| QA-2026-09-02-3 | Security | P1 | `wordGridHtml` concatenated paste words into innerHTML unescaped | `escapeHtml(words[i])` |
| QA-2026-09-02-4 | Compatibility | P2 | V2 chip/CSS still `0.17.135-v2` while script was `0.17.136-v2` | Align chip + css query to 0.17.136-v2 |

Golden BIP-39 derive / V2-S26 unchanged.
