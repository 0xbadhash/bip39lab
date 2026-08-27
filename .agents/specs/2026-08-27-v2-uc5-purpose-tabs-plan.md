# Plan: V2 UC5 purpose tabs + descriptors

**Spec:** `.agents/specs/2026-08-27-v2-uc5-purpose-tabs.md`

## Approach

Copy classic `data-wo-type` tabs and `#btnDescRefresh` into UC5 step 1. Filter `exportWatchOnly` keys by purpose. Descriptor pre is Lab refresh only.

## Architecture

- `web/v2/js/v2-app.js` — tabs, filter, `#v2DescRefresh`
- `web/v2/css/v2.css` — compact wo tabs
- chip `0.17.98-v2`
- `e2e/v2.spec.ts` S32
- `tests/test_ac_v2_uc5_purpose_tabs.py`

## Sequence

1. Spec + tabs + descriptor refresh on UC5.
2. Playwright S32 + AC stubs.
3. Product stamp only at `/release_mgmt`.
