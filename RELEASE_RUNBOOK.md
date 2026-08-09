# RELEASE_RUNBOOK — v0.13.5 Teach-surface jump-link consistency

**Date:** 2026-08-09  
**Version:** 0.13.5  
**Spec:** `.agents/specs/2026-08-09-teach-surface-jump-links.md`  
**Pipeline score:** 100 (approved)

## Summary

Lab, Network, and Shamir step rails aligned with Multisig jump-link teach pattern (“On this page — jump links (not a locked wizard)”); Network unknown-not-zero + Shamir use-case copy; HTML/teach only.

## Smoke table

| Step | Command | Exit |
|------|---------|------|
| unit | `python -m pytest -q` (product_smoke) | 0 |
| e2e | `npm run test:e2e` (product_smoke) | 0 |
| web_e2e | `python scripts/check_web_e2e.py --root .` | 0 |
| validate full | `python scripts/validate.py full` | 0 (5/5) |
| hard_gates | `python scripts/hard_gates.py --diff b32f07b...HEAD` | ok |
| pr_validator | score 100 → approved | 0 |

## Evidence pack

- hard_gates ok (runtime; secrets/web_e2e skip-ok)
- smoke unit + e2e green
- pytest 59 passed (full suite via compliance)
- BEHAVIOR_REPORT PASS (jump-link clauses)
- CODE_REVIEW APPROVE

## Infra

- No separate INFRA_RUNBOOK for this HTML teach ship.
- Live site: deploy static `web/` for bip39.catalyxt.xyz when ready (operator).

## Rollback

1. `git checkout v0.13.4 -- web/index.html web/network.html web/shamir.html tests/test_teach_surface_jump_links.py`
2. Or `git revert` the feat + release commits; retag if needed.
3. Redeploy previous static assets.

## Things that look bad but are actually fine

1. Jump-link rails still show a suggested order — not a locked wizard.
2. Network CSP still allows opt-in balance APIs — by design.
3. Shamir “not SLIP-39” repetition — educational safety.
4. Version patch only (0.13.5) — no crypto surface change.

## Tag

- `v0.13.5` on release commit after VERSION/package/pyproject/site-version stamp.
