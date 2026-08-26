# Plan: V2 UC4 live path table

**Spec:** `.agents/specs/2026-08-27-v2-uc4-path-table.md`

## Approach

Copy classic `#pathPlayTable` cells into UC4. Bind them from `applyPathIndex`. Add purpose tabs; default BIP84. Reuse `deriveAddresses` row fields. Do not edit UC1 or UC3.

## Architecture

- `web/v2/js/v2-app.js` — table HTML, purpose tabs, paint in `applyPathIndex`
- `web/v2/css/v2.css` — compact table
- `web/v2/index.html` — chip `0.17.92-v2`
- `e2e/v2.spec.ts` — S30
- `tests/test_ac_v2_uc4_path_table.py`

## Sequence

1. Spec + table + purpose tabs on UC4.
2. Playwright S30 + AC stubs.
3. Product stamp only at `/release_mgmt`.
