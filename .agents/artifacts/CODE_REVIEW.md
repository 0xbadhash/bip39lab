# CODE-REVIEW — SLIP-39 lab A teach shell

**Marker:** CODE-REVIEW  
**Date:** 2026-08-10  
**Base:** HEAD pre-ship (`46f3c87`) · head: working tree ship A  
**Scope:** `web/slip39.html`, `web/js/slip39-app.js`, `web/shamir.html`, tests/e2e, specs A–D stubs, ROADMAP/plugin/Comet

## Secrets

`python3 scripts/check_secrets_diff.py` — clean (no seed/mnemonic material; teach copy only).

## Scope governor

In-scope teach shell + deep-link + static contracts. No SLIP-39 crypto library, no CSP relax, no 7th nav. LOC modest, same owner boundary.

## Findings

| # | Severity | Class | Finding | Disposition |
|---|----------|-------|---------|-------------|
| — | — | — | No P0 blockers | accepted empty |

### Notes (not P0)

- B/C/D specs staged as planning stubs; implementation not claimed.
- Demo placeholders intentional for B/C handoff.

## Tests / smoke

- `.venv/bin/python -m pytest -q tests/test_slip39_shell_copy.py` → 5 passed  
- Playwright S57/S57b via e2e/slip39.spec.ts (release web_e2e)

## P0 count

**p0=0** · follow_ups=0 material

## Verdict

Accept for `/pr_review --validate`.
