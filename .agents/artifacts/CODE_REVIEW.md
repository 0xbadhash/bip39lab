# CODE-REVIEW — GapFix Tools phrase source + teach clarity

**Marker:** CODE-REVIEW  
**Date:** 2026-08-09  
**Base:** HEAD (working tree ship)  
**Scope:** `web/index.html`, `web/js/app.js`, `tests/test_tools_teach_copy.py`, `e2e/lab.spec.ts`, spec/roadmap/PR_DRAFT/Comet

## Secrets

`python3 scripts/check_secrets_diff.py --base HEAD` — clean (no real seed material; educational public zpub shape only).

## Scope governor

In-scope teach/copy + provenance labels only. No CSP/crypto/API. LOC small, same owner boundary.

## Findings

| # | Severity | Class | Finding | Disposition |
|---|----------|-------|---------|-------------|
| — | — | — | No P0 blockers | accepted empty |

### Notes (not P0)

- Load-example zpub may fail BIP380 checksum on Explain — intentional; out text warns educational shape.
- `ensureLabMnemonic` still writes auto-gen into Lab `#mnemonic` (pre-existing); copy now makes that explicit.

## Tests / smoke

- `.venv/bin/python -m pytest -q` → 63 passed  
- `npx playwright test e2e/lab.spec.ts -g "S17|S18|S19|S22|S23"` → 7 passed (incl S18c clear→TEST DATA)

## P0 count

**p0=0** · follow_ups=0 material

## Verdict

Accept for `/pr_review --validate`.
