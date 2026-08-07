# PR Draft: Shamir educational left-nav tab (v1)

**Range:** `origin/master...HEAD`  
**Spec:** `.agents/specs/2026-08-07-shamir-share-tab.md`  
**Plan:** `.agents/specs/2026-08-07-shamir-share-tab-plan.md`

## What Problem This Solves

Learners had Multisig (M-of-N keys) but no first-class offline place to see **Shamir** M-of-N **shares** of a secret, safely labeled as educational.

## Why This Change Was Made

Ship the ready-for-agent Shamir spec: left-nav step 3, teach + demo split only (not SLIP-39, no recombine UI).

## User Impact

- New **Shamir** page offline: compare table, generate practice secret, M-of-N split → labeled share cards.  
- Sidebar is **6 items** again (feature, not docs-only).  
- Glossary terms for Shamir / threshold / share / SLIP-39.

## Evidence

- Unit: `tests/test_shamir.py` (split/combine + JS core round-trip)  
- E2E: S53–S55, S0/S10/S36 nav  
- product_smoke unit+e2e after VERSION sync  

## Traceability

| AC | Test |
|----|------|
| Nav step 3 Shamir | helpers NAV, S36, S10 |
| Teach + danger banner | S53 |
| M-of-N split N cards | S54 + pytest |
| Empty error | S55 |
| Offline CSP | S53 labCspOffline |
| Glossary | glossary.js SHAMIR terms |

## Threat notes

- Offline CSP `connect-src 'none'`; no network secrets.  
- Explicit non-SLIP-39 / not-for-real-funds banner.  
- No Lab mnemonic auto-import.

## Red-proof

```text
red_cmd: pytest tests/test_shamir.py → ModuleNotFoundError bip39lab.shamir
green_cmd: pytest tests/test_shamir.py → 7 passed; npx playwright test e2e/shamir.spec.ts → 3 passed
```

## Evidence pack

- hard_gates / CODE-REVIEW / BEHAVIOR-REPORT  
- product_smoke pytest + e2e  
- secrets scan on range  

## Things that look bad but are actually fine

1. **Hand-rolled GF(256) SSS** — educational only; unit round-trips; banner forbids real funds.  
2. **No recombine UI** — intentional v1; combine exists for tests.  
3. **6-nav again after v0.12.3 5-nav** — Balance was docs-only; Shamir is a real surface.  
4. **Shares look like recovery material** — format is `share:index:hex`, not BIP-39 words.  
