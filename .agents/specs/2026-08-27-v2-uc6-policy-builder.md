# V2 UC6 policy builder from keys

- **Product:** bip39lab
- **Created:** 2026-08-27
- **Status:** ready-for-agent
- **Priority:** P0
- **Plan:** `.agents/specs/2026-08-27-v2-uc6-policy-builder-plan.md`
- **Surface:** `web/v2/` UC6 only (classic `/` cache-bust at ship)
- **Grill-me:** complete (G1 default)

## Problem Statement

Classic Multisig `#msPolicy` plus `wsh(sortedmulti(M,keys…))` is the spend rule from public keys. V2 UC6 shows three zpubs and docks the room. Leftover in `web/v2/compare.md`: **policy builder**. Not SLIP-39 Suite. No signer.

## Solution

On existing UC6 step 1, after three zpubs: `#v2MsPolicy` states 2-of-3; `#v2MsDesc` shows `wsh(sortedmulti(2,<zpub>,…))` with the three viewing keys **sorted** (BIP67 classroom). No Sign. No Suite.

Chip with UC8: `v0.17.100-v2`. Product stamp only on ship.

## Acceptance

| ID | Criterion |
|----|-----------|
| AC-1 | After three zpubs, `#v2MsPolicy` contains `2-of-3`. |
| AC-2 | `#v2MsDesc` contains `wsh(sortedmulti(2,` and three `zpub` strings. |
| AC-3 | No Sign button. No SLIP-39 / Suite claim on this pad. |
| AC-4 | Classic `/multisig.html` still `#msPolicy`. |

## Grill-me

Q: Does this sign a spend?
A: No. Policy string from public zpubs only.

Q: Suite clone?
A: No.

## Testing Decisions

- Red: three zpubs, no wsh line
- Green: V2-S11 still; **V2-S33** policy line
- pytest `tests/test_ac_v2_uc6_policy_builder.py`
