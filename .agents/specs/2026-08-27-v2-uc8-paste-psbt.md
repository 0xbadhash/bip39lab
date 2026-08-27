# V2 UC8 paste arbitrary PSBT (inspect-only)

- **Product:** bip39lab
- **Created:** 2026-08-27
- **Status:** ready-for-agent
- **Priority:** P0
- **Plan:** `.agents/specs/2026-08-27-v2-uc8-paste-psbt-plan.md`
- **Surface:** `web/v2/` UC8 only
- **Grill-me:** complete (G1 default)

## Problem Statement

Classic `#cardPsbt` `#psbtIn` lets you paste then **Inspect again**. V2 UC8 only has sample buttons. Leftover: paste arbitrary PSBT. Never Sign. Never broadcast. Samples may stay.

## Solution

Add `#v2PsbtIn` + `#v2PsbtInspect`. Samples fill the box then inspect. Paste uses `BIP39Lab.inspectPsbt` (already refuses seed-looking payloads). No Sign.

Chip with UC6: `v0.17.100-v2`. Product stamp only on ship.

## Acceptance

| ID | Criterion |
|----|-----------|
| AC-1 | UC8 inspect pad has `#v2PsbtIn` and `#v2PsbtInspect`. |
| AC-2 | Paste `cHNidP8A` then Inspect writes `#v2PsbtOut` with status/magic and does not Sign. |
| AC-3 | Secret-looking paste (`xprv` / mnemonic) is refused in `#v2PsbtOut`. |
| AC-4 | No Sign button. Samples still inspect. Classic `/` still `#psbtIn`. |

## Grill-me

Q: Does paste sign or broadcast?
A: No. Inspect only.

## Testing Decisions

- Red: no textarea
- Green: **V2-S34** paste + refuse
- pytest `tests/test_ac_v2_uc8_paste_psbt.py`
