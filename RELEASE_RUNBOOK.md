# RELEASE_RUNBOOK — v0.13.11 hygiene (Comet SLIP-39 + 6-nav)

**Tag:** `v0.13.11`  
**Waiver:** chore  
**Date:** 2026-08-11  
**Score:** 100  

## Summary

Comet-style SLIP-39 pass: document no 7th nav; Shamir deep-link parent highlight; ROADMAP focus → v0.13.10 line corrected; shell test fix for `nav-item active`.

## Smoke table

| Step | Exit |
|------|------|
| product_smoke unit | 0 |
| product_smoke e2e | 0 |
| check_web_e2e | 0 |
| pr_validator | 100 |

## Infra

Static nginx root `/home/debian/bip39lab/web` — stamp `site-version.js` only.

## Evidence pack

- hard_gates ok · CODE-REVIEW p0=0  
- secrets clean · threat tags  

## Tag

```bash
git tag -a v0.13.11 -m "v0.13.11 hygiene: SLIP-39 6-nav deep-link UX + stamp"
```

## Rollback

Checkout `v0.13.10` web + VERSION.

## Things that look bad but are actually fine

1. Patch for chore UX — badge should match ship.  
2. Shamir active on SLIP-39 — parent cue, not 7th step.  
3. Spec_id still knots scan in pipeline — prior open ops; this ship is chore waiver.  
