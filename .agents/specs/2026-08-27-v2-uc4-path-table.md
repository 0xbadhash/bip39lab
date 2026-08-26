# V2 UC4 live path table bind

- **Product:** bip39lab
- **Created:** 2026-08-27
- **Status:** ready-for-agent
- **Priority:** P0
- **Plan:** `.agents/specs/2026-08-27-v2-uc4-path-table-plan.md`
- **Surface:** `web/v2/` UC4 only (classic `/` unchanged except cache-bust at ship)
- **Grill-me:** complete (G1 default)

## Problem Statement

Classic `#cardPathPlay` / `#pathPlayTable` live-binds purpose, coin, account, change, and index when Lab folders change (BIP 44/49/84/86). V2 UC4 already has index, change 0/1, and a teaching amount chip. Leftover in `web/v2/compare.md`: **live Lab table bind**.

## Solution

Port the table into **existing UC4** steps 0–1. Do not add tracks. Do not reopen UC1 or UC3.

1. `#v2PathPlayTable` with cells `#v2PathCellPurpose` `#v2PathCellCoin` `#v2PathCellAccount` `#v2PathCellChange` `#v2PathCellIndex` — same levels as classic.
2. `#v2PathPurpose` tabs BIP86/84/49/44. Default **84** so existing `m/84'/1'/0'/0/0` checks hold. Switching purpose rewrites `#v2PathLine` and the table; receive string uses that row field.
3. Index / change buttons already on UC4 keep painting the table (live bind).

Chip `v0.17.92-v2`. Product stamp only on ship. No Imagine. No signer.

## Acceptance

| ID | Criterion |
|----|-----------|
| AC-1 | UC4 step 0 has `#v2PathPlayTable` and purpose cell `84'` on default. |
| AC-2 | Change folder updates `#v2PathCellIndex` and `#v2PathLine` last segment together. |
| AC-3 | `#v2PathPurpose` has `data-purpose` 86, 84, 49, 44. Click 86 → purpose cell `86'` and path starts `m/86'`. |
| AC-4 | Chip `0.17.92-v2`. Picker 35. V2-S10 still `m/84'/1'/0'/0/0` then `/0/1`. |
| AC-5 | Classic `/` still `#cardPathPlay` `#pathPlayTable`. No Sign/Broadcast. |

## Grill-me

Q: Is the table a chain lookup?
A: No. Offline path levels + practice addresses. Teaching amounts stay fake.

Q: sessionStorage mnemonic?
A: No.

## Testing Decisions

- Red: no `#v2PathPlayTable`
- Green: V2-S10 unchanged path; **V2-S30** table + purpose tabs
- pytest `tests/test_ac_v2_uc4_path_table.py`
