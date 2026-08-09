# PR Draft: Shamir recombine (educational, non-SLIP-39)

**Range:** `buzz/main...HEAD`  
**Spec:** `.agents/specs/2026-08-08-shamir-recombine.md`  
**Plan:** none

## What Problem This Solves

v1 Shamir taught split but learners could not close the loop: any M shares rebuild the practice secret. Without recombine, the threshold demo is incomplete and easy to mistrust.

## Why This Change Was Made

Ship educational recombine on the existing Shamir page (gap-check on Comet polish + step rail, Fill M e2e, Comet/ROADMAP alignment). Still **not SLIP-39**.

## User Impact

- **Verify recombine** + **Fill M shares from cards** on `shamir.html`
- Step rail step **4 · Recombine**
- Match / mismatch vs practice secret field; clear errors on bad input
- Banner remains educational / not for real funds

## Evidence

- Unit: `pytest` `tests/test_shamir.py` (any-M, under-threshold, duplicate index, malformed parse, JS core)
- E2E: S53–S56 (S56 Fill M + recombine match)
- Comet: Page 5 description + S56 scenario
- Smoke: `python scripts/product_smoke.py --root .` (plugin unit + e2e)

## Traceability

| AC | Test / smoke |
|----|----------------|
| AC-1 Verify recombine offline | `tests/test_shamir.py` + e2e S56 `combine_shares` / UI recombine |
| AC-2 Fill M from cards | e2e S56 clears textarea → `#btnShFillM` → recombine |
| AC-3 Errors empty/bad/under-threshold | e2e S55; unit under-threshold + malformed + duplicate index |
| AC-4 Educational banner / not SLIP-39 | e2e S53 copy assertions |
| AC-5 Offline CSP | e2e S53 `labCspOffline` |
| AC-6 Step rail recombine | e2e S56 `#shStepRail [data-step-target="#shCardRecombine"]` |
| AC-7 No secrets committed | secrets diff clean; no retention paths |

## Red-proof

- `red_cmd`: new unit cases for duplicate index / malformed parse (contract already enforced)
- `green_cmd`: `.venv/bin/python -m pytest tests/test_shamir.py -q`

## Threat notes

- **Assets:** practice secret + share strings stay in page memory only; offline CSP `connect-src 'none'` must not leak shares.
- **Abuse:** under-threshold / duplicate index / malformed share lines must fail closed (no silent wrong secret).
- **Non-goals:** no Lab mnemonic auto-import; not SLIP-39; not for real funds; no retention of shares/secrets.

## Evidence pack

- **hard_gates:** `python3 scripts/hard_gates.py --diff buzz/main...HEAD`
- **pytest:** `.venv/bin/python -m pytest tests/test_shamir.py -q` (9 passed)
- **smoke / product_smoke:** plugin unit + Playwright e2e via `python3 scripts/product_smoke.py --root .`
- **validate:** `python3 scripts/validate.py full` at release when harness available

## Things that look bad but are actually fine

1. **Recombine UI existed before this ship** — gap-check only adds step rail 4, Fill-M e2e, unit edges, docs/ROADMAP; core combine already on page.
2. **Not SLIP-39** — educational byte-share format by design; multi-word SLIP-39 is explicit non-goal.
3. **Harness path scripts in the same range** — chore commit `4375433` is adjacent hygiene, not crypto surface risk for recombine.
4. **BEHAVIOR uses e2e evidence** — source-blind clauses validated via Playwright S53–S56 on the running page surface.
