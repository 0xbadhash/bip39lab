# BEHAVIOR-REPORT — Teach-surface jump-link consistency

**Date:** 2026-08-09  
**Spec:** `.agents/specs/2026-08-09-teach-surface-jump-links.md`  
**Surfaces:** static HTML (`web/index.html`, `web/network.html`, `web/shamir.html`) + Multisig parity reference  
**Method:** source-blind via pytest contracts + string presence on public HTML (no secret material)

## Contract clauses

| # | Clause | Result | Evidence |
|---|--------|--------|----------|
| 1 | Lab shows “On this page” + “jump links (not a locked wizard)” | pass | static HTML; `test_lab_jump_link_rail` |
| 2 | Network rail same pattern + `aria-label` page sections (jump links) | pass | static HTML; network test |
| 3 | Shamir rail same pattern + jump-link aria | pass | static HTML; shamir test |
| 4 | No forced `1 ·` wizard numbering on rails; targets resolve | pass | pytest jump-link suite (3 passed) |
| 5 | Network: failure is unknown/error, never silent fake zero | pass | visible copy on network.html |
| 6 | Shamir: educational not SLIP-39; use-case vs Multisig | pass | shamir.html banner/lede |
| 7 | No secret retention / no new crypto surface | pass | HTML/teach only; pytest green |

## Runtime / black-box notes

- `python -m pytest tests/test_teach_surface_jump_links.py -q` → **3 passed** (via `.venv`).
- Live site deploy not re-probed this turn; contracts are static teach HTML aligned with Multisig.

## Residual

- Full Playwright e2e still expected at `/release_mgmt` (`product_smoke` + `check_web_e2e`).

## Verdict

**PASS** — all in-scope jump-link teach clauses pass.
