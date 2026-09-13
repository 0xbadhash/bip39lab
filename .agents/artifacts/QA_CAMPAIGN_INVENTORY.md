# QA-CAMPAIGN-INVENTORY

**Marker:** QA-CAMPAIGN-INVENTORY  
**Date:** 2026-09-13  
**Product:** bip39lab v0.16.88 / V2 chip 0.17.137-v2  
**Host:** bip39.catalyxt.xyz (nginx from this tree)  
**Phase:** init (QA does not advance FSM)

## Baseline

| Suite | Result |
|-------|--------|
| pytest | 240 passed (pre-fix) → 242 after new asserts |
| Playwright / comet | **deferred** (campaign did not bump VERSION; Boss gates Bob) |
| Held PASSes 2026-09-02 QA-1…14 | **not reopened** (no new FAIL evidence) |

## Tally

| Metric | Count |
|--------|-------|
| found | 4 (this wave) + 14 held closed |
| fixed | 4 this wave |
| residual | 0 product defects in this wave; ops: uncommitted help-tip CSS already served live |
| stop reason | **exhausted** (static lab; not ≥200 unique defects) |

## Category matrix

| # | Category | Status |
|---|----------|--------|
| 1 Unit | pytest 242 |
| 2 Integration | N/A — no DB/API product |
| 3 E2E | deferred (no VERSION bump) |
| 4 Contract | web_e2e S-ids unchanged |
| 5–8 Stress/chaos/concurrency | out_of_scope static files |
| 9 Security | copy/addr/tip HTML escape |
| 10 Edge | help-tip wrap CSS (unit assert) |
| 11 Regression | tests/test_qa_v2_hardening.py |
| 12 Compatibility | runbook/roadmap stamp 0.16.88 |
| 13 Observability | N/A |
| 14 Resource leak | out_of_scope |

## Bug table (2026-09-13 wave only)

| ID | Category | Severity | Root cause | Fix |
|----|----------|----------|------------|-----|
| QA-2026-09-13-1 | Security | P2 | `copyQrRowHtml` put label/value in innerHTML; only attrs used `attrEsc` | `escapeHtml(label/value)` |
| QA-2026-09-13-2 | Security | P2 | `addrHtml` wrote `addr` into `.addr-text` unescaped | `escapeHtml(addr)` |
| QA-2026-09-13-3 | Security | P3 | `termI`/`inlineI` interpolated glossary title/short/body without escape | `attrEsc` + `escapeHtml` |
| QA-2026-09-13-4 | Compatibility | P3 | RELEASE_RUNBOOK / ROADMAP still 0.16.87 after 0.16.88 ship | stamp 0.16.88 |

## Held closed (2026-09-02)

QA-2026-09-02-1 … 14 remain PASS. No reopen.

## Out of scope this wave

- Full Playwright wall (E2E deferred).
- UC19 P3 live mempool, Sign, Imagine, leftover `scripts/*.py` uncommitted.
- Help-tip 1.25rem glyph: already in working tree + live CSS; unit-locked this campaign; E2E S186/V2-S1 exercised earlier, not re-run as campaign E2E.
