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

- Unit: `tests/test_shamir.py` (any-M, under-threshold, duplicate index, malformed parse, JS core)
- E2E: S53–S56 (S56 Fill M + recombine match)
- Comet: Page 5 description + S56 scenario

## Traceability

| AC | Test |
|----|------|
| Verify recombine offline | S56 + `combine_shares` / `combineShares` |
| Fill M from cards | S56 clears textarea → Fill M → recombine |
| Errors empty/bad/under-threshold | S55; unit under-threshold + malformed + duplicate |
| Educational banner / not SLIP-39 | S53 |
| Offline CSP | S53 `labCspOffline` |
| Step rail recombine | S56 step-rail selector |
| No secrets committed | secrets diff / no retention |

## Red-proof

- `red_cmd`: new unit cases for duplicate index / malformed parse (contract already enforced)
- `green_cmd`: `.venv/bin/python -m pytest tests/test_shamir.py -q`

## Threat notes

- Offline CSP `connect-src 'none'`; no network of shares; no Lab mnemonic auto-import; no retention.
