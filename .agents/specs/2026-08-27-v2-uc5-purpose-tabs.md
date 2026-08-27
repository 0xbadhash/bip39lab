# V2 UC5 purpose tabs + Lab descriptors

- **Product:** bip39lab
- **Created:** 2026-08-27
- **Status:** ready-for-agent
- **Priority:** P0
- **Plan:** `.agents/specs/2026-08-27-v2-uc5-purpose-tabs-plan.md`
- **Surface:** `web/v2/` UC5 only (classic `/` unchanged except cache-bust at ship)
- **Grill-me:** complete (G1 default)

## Problem Statement

Classic Lab has watch-only purpose tabs BIP84/86/49/44 (`data-wo-type`) with labelled zpub/ypub/xpub + copy/QR, and `#cardDescriptors` **Refresh descriptors** from Lab. V2 UC5 dumps every key into one list. Leftover in `web/v2/compare.md`: full purpose tabs + descriptor refresh. Do not invent UC34 paste/explain.

## Solution

Port into **existing UC5 step 1**. Do not add tracks. Do not reopen UC1/UC3/UC4.

1. `#v2WoType` tabs `data-wo-type` 84, 86, 49, 44. Default **84** (zpub). One type at a time. `#v2WoList` copy/QR for that purpose only. Prefix zpub / xpub / ypub match the tab.
2. `#v2DescRefresh` fills `#v2DescOut` from `descriptorsFromWatchOnly` on this practice phrase (wpkh / tr / sh / pkh). No paste box. No Sign.

Chip `v0.17.98-v2`. Product stamp only on ship. No Imagine.

## Acceptance

| ID | Criterion |
|----|-----------|
| AC-1 | UC5 export pad has `#v2WoType` with four `[data-wo-type]` 84, 86, 49, 44. Default 84 active. |
| AC-2 | After `#v2Wo`, `#v2WoList` has Copy + QR. Default key text starts with `zpub`. Tab 49 shows `ypub`. Tab 44 or 86 shows `xpub`. |
| AC-3 | `#v2DescRefresh` writes `#v2DescOut` containing `wpkh` or `tr(` or `pkh(` or `sh(`. No `#v2DescLine` paste. No Sign. |
| AC-4 | Chip `0.17.98-v2`. Picker 35. |
| AC-5 | Classic `/` still `#cardDescriptors` and `[data-wo-type]`. |

## Grill-me

Q: Does this tab paste/explain an arbitrary descriptor like UC34 leftover?
A: No. Refresh from this practice phrase only.

Q: sessionStorage mnemonic?
A: No.

## Testing Decisions

- Red: no `#v2WoType`; dump of all keys with no tabs
- Green: V2-S32 purpose tabs + desc refresh
- pytest `tests/test_ac_v2_uc5_purpose_tabs.py`
