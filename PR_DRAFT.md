# PR Draft — v0.16.89 QA wave HTML escape + help-tip glyph

**Range:** `v0.16.88...HEAD`  
**Spec:** `.agents/specs/2026-09-13-qa-wave-html-escape-fsm.md`  
**Plan:** `.agents/specs/2026-09-13-qa-wave-html-escape-fsm-plan.md`

## What Problem This Solves

QA found unescaped copy/address/tip HTML. The (i) circle was a 44px disc and overlay text did not wrap. Docs lagged 0.16.87.

## Why This Change Was Made

CEO stamp 2026-09-13: ship the QA wave with lockstep VERSION, comet, Playwright, and live chip. No new hunt. Do not call Bob.

## User Impact

(i) matches card.catalyxt.xyz (1.25rem). Overlay wraps. Derived strings cannot break pad HTML. Live chip is v0.16.89.

## Evidence

- pytest `tests/test_qa_v2_hardening.py`
- Playwright V2-S1 (glyph/wrap) and S186 (host ≥44px)

## Red-proof / TDD

- red_cmd: `.venv/bin/python3 -m pytest tests/test_qa_v2_hardening.py -q` (fails without escapeHtml(label/value/addr) or 1.25rem glyph)
- green_cmd: `.venv/bin/python3 -m pytest -q`
- TDD: tests landed with the QA implementation; AC is the contract.

## Traceability

| AC | Evidence |
|----|----------|
| AC-1 | `escapeHtml(label)` `escapeHtml(value)` in `copyQrRowHtml` |
| AC-2 | `escapeHtml(addr)` in `addrHtml` |
| AC-3 | `termI`/`inlineI` escapeHtml + attrEsc |
| AC-4 | `test_qa_help_tip_glyph_is_card_size` + S186 + V2-S1 |
| AC-5 | VERSION / site-version.js / comet / PLAYWRIGHT_LAST / chip 0.16.89 |
| AC-6 | pytest + e2e V2-S1 S186 |

## Threat notes

- **secrets:** practice phrases only; no retention change
- **xss:** copy/addr/glossary tip now escaped
- **csrf:** n/a offline lab
- **sign:** none added

## Evidence pack

- hard_gates + pytest test_qa_v2_hardening + Playwright V2-S1/S186
- smoke at `/release_mgmt` (`python -m pytest -q` + `scripts/run_e2e_smoke.py`)
- validate: `scripts/validate.py full` at release

## Untested paths

| Path | Reason |
|------|--------|
| leftover scripts/*.py | uncommitted by policy |
| catalyxt-ds / figure-it-out / zk-business-card | other windows |

## Things that look bad but are actually fine

1. Dual stamp: product `0.16.89` vs V2 chip `0.17.138-v2` is intentional.
2. Held 2026-09-02 QA PASSes not reopened.
3. Bob not called; Boss gates live rec-flow.

## §9

1. Does not add Sign or live CSV.
2. Does not compute Electrum KDF.
3. Does not force-push or commit leftover scripts.
