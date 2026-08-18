# PR Draft: publish /VERSION and PLAYWRIGHT_LAST.md

**Spec:** `.agents/specs/2026-08-18-publish-e2e-stamps.md`

## What Problem This Solves

Agents got HTTP 404 on `/VERSION` and `/PLAYWRIGHT_LAST.md` while live product was already 0.16.6.

## Why This Change Was Made

E2E lock needs live === comet === PLAYWRIGHT_LAST === /VERSION. Docs/static publish only. No product bump. No tag past v0.16.6.

## User Impact

Those two URLs 200 on bip39.catalyxt.xyz. P0 lab-safety unchanged.

## Traceability

| AC | Evidence |
|----|----------|
| web/VERSION | `test_http_version_and_playwright_last_match_sot` |
| PLAYWRIGHT_LAST | same + stamp script |
| stamp writes both | `test_stamp_site_version_invokes_comet_stamp` |

## Red-proof

- red_cmd: `.venv/bin/python -m pytest -q tests/test_stamp_comet_header.py::test_http_version_and_playwright_last_match_sot`
- green_cmd: `.venv/bin/python -m pytest -q tests/test_stamp_comet_header.py::test_http_version_and_playwright_last_match_sot`

## Evidence pack

pytest stamp tests + check_web_e2e. Product still 0.16.6 / 100 S-ids.

## Things that look bad but are actually fine

1. No new git tag — CEO: do not tag past the docs.
2. site-version.js re-stamped in place at v0.16.6 (no bump).
3. Untracked `config/` not in this ship.
