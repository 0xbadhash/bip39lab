# BEHAVIOR-REPORT — SLIP-39 lab A teach shell

**Marker:** BEHAVIOR-REPORT  
**Date:** 2026-08-10  
**Spec:** `.agents/specs/2026-08-10-slip39-a-teach-shell.md`  
**Surfaces:** `web/slip39.html`, Shamir deep-link — offline teach shell  
**Method:** static copy contracts + Playwright S57/S57b

## Contract clauses

| # | Clause | Result | Evidence |
|---|--------|--------|----------|
| 1 | Danger banner (lab / not funded / not Trezor Suite) | pass | #s39Danger + pytest |
| 2 | Comparison table BIP-39 / Shamir / SLIP-39 | pass | #s39CompareTable |
| 3 | Jump rail + demo placeholders | pass | #s39StepRail / Coming in |
| 4 | Shamir → slip39.html | pass | #shLinkSlip39 + S57b |
| 5 | Six-nav; CSP offline | pass | nav count + connect-src none |
| 6 | No crypto / no secret retention | pass | no slip39.bundle; chrome JS only |

## Runtime / black-box notes

- No network path (`connect-src 'none'`).
- No split/combine in this ship — demos deferred to B/C.
