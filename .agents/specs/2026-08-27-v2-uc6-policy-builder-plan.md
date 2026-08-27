# Plan: V2 UC6 policy builder

**Spec:** `.agents/specs/2026-08-27-v2-uc6-policy-builder.md`

## Approach

Read out 2-of-3 + `wsh(sortedmulti(2,…))` from the three practice zpubs already on UC6. Sort keys. Do not call a signer.

## Architecture

- `web/v2/js/v2-app.js` — `#v2MsPolicy` `#v2MsDesc` after zpubs
- e2e V2-S33
- `tests/test_ac_v2_uc6_policy_builder.py`

## Sequence

1. Spec + policy readout.
2. Playwright S33.
3. Stamp with UC8.
