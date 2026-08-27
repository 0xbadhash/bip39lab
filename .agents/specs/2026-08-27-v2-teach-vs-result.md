# V2 blue classroom vs lab/chain result

- **Product:** bip39lab
- **Created:** 2026-08-27
- **Status:** ready-for-agent
- **Priority:** P0
- **Plan:** `.agents/specs/2026-08-27-v2-teach-vs-result-plan.md`
- **Surface:** `web/v2/` payload tracks
- **Grill-me:** complete (operator: apply split everywhere that dumps an object)

## Problem Statement

Teaching copy (what / why / when / how) was mixed with lab objects (hex, keys, tables, tx fields). Learners could not tell story from chain or computed result.

## Solution

`teachBox()` = blue `.v2-callout.done`. Result = pre/table/code. UC7 Shamir + SLIP-39, UC8 PSBT + named txs, UC6 recipe, UC5/9 export, UC3–4, UC10 fees/address, UC1/15/16/19/26/27/29–32/34/35. Sort/ceremony UCs unchanged.

Chip `v0.17.125-v2`. Product **0.16.76**.

## Acceptance

| ID | Criterion |
|----|-----------|
| AC-1 | UC7 `#v2ShStory` blue; `#v2ShOut` share lines only. |
| AC-2 | UC8 `#v2PsbtTeach` / `#v2TxStory` blue; parser/chain in result. |
| AC-3 | UC6 `#v2MsPolicy` blue; `#v2MsDesc` is `wsh(sortedmulti`. |
| AC-4 | UC7 SLIP `#v2S39Story` vs master hex in `#v2S39Out`. |
| AC-5 | No Sign. Classic `/` unchanged except cache-bust. |

## Grill-me

**Status:** complete  
**Date:** 2026-08-27

### G1–G7
Operator: implement all listed splits. Blue = classroom. Result = object. No Sign.

## Testing Decisions

- Green: V2-S13 S33 S34 S39 S40
- pytest `tests/test_ac_v2_teach_vs_result.py`
