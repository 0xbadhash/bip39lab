# PR Draft: SLIP-39 lab D — docs / Comet hygiene

**Range:** docs-only after `5bf5d63`  
**Spec:** `.agents/specs/2026-08-10-slip39-d-docs-release.md`  
**Spec waiver:** docs-only  

## What Problem This Solves

SLIP-39 lab A–C shipped in code, but README and Comet contract still under-documented SLIP-39 as a first-class offline page (deep-link, not 7th nav).

## Why This Change Was Made

Close roadmap item D: README pages table, Comet S0–S60b + Page 7 process flow, ROADMAP A–D done. Lab-only language only — no production claims.

## User Impact

- Operators/learners discover `/slip39.html` from README.  
- Comet/Playwright operators have aligned S57–S60b + human process flow.  
- No runtime behavior change.

## Evidence

- Diff is markdown only (README, E2E_COMET, ROADMAP, specs).  
- `python3 scripts/check_web_e2e.py --root .` still green.  
- No secrets in docs (no mnemonics, no RPC cookies).

## Traceability

| AC | Evidence |
|----|----------|
| AC-1 ROADMAP A–D done | `ROADMAP.md` SLIP-39 A–D `[DONE]` |
| AC-2 README SLIP-39 page | README “Pages” table + lab-only warning |
| AC-3 Comet S57–S60b | `docs/E2E_COMET_SCENARIOS.md` Page 7 + contract header |
| AC-4 No secrets in docs | docs review; secrets scan on range |

## Threat notes

- **secrets** — docs must not embed practice seeds, real mnemonics, or RPC cookies (none added).  
- **xss** — N/A (markdown only).  
- Docs restate lab-only / not Trezor Suite (supply-chain expectation: no production claim).

## Red-proof

```text
TDD N/A — docs-only
red_cmd: false
green_cmd: true
```

## Evidence pack

- **hard_gates** — pack ok after this PR_DRAFT (docs-only waiver, threat tags, red_cmd/green_cmd)  
- **smoke** — `python3 scripts/check_web_e2e.py --root .` exit 0 (web e2e contract; no UI change)  
- **pytest** — not re-run required for pure docs; compliance still suite_green via `pr_validator`  
- **validate** — secrets scan clean on `5bf5d63...HEAD`; no product `.py` in D range  
- CODE-REVIEW p0=0 · marker `CODE-REVIEW`

## Things that look bad but are actually fine

1. **No VERSION bump** — docs-only hygiene; site remains v0.13.9 until operator chooses a docs tag.  
2. **SLIP-39 still not a 7th nav item** — intentional deep-link design (documented).  
3. **Comet contract still version 2** — scenario range extended; contract schema unchanged.  
