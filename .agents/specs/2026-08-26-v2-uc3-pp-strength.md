# V2 UC3 masked passphrase strength bar

- **Product:** bip39lab
- **Created:** 2026-08-26
- **Status:** ready-for-agent
- **Priority:** P0
- **Plan:** `.agents/specs/2026-08-26-v2-uc3-pp-strength-plan.md`
- **Surface:** `web/v2/` UC3 only (classic `/` unchanged except cache-bust at ship)
- **Grill-me:** complete (G1 default)

## Problem Statement

Classic Lab `#passphrase` is `type=password` with `#ppStrengthBar` tiers empty / weak / fair / stronger. V2 UC3 already compares A/B live and colors estimate text. Leftover in `web/v2/compare.md`: the **masked strength bar**.

## Solution

Port the bar + mask into **existing UC3 step 1** only. Do not add tracks. Do not add a signer.

1. `#ppA` and `#ppB` are `type="password"` (masked), same job as `#passphrase`.
2. Each field gets a fill bar `#v2PpBarA` / `#v2PpBarB` with `pp-tier-empty|weak|fair|strong` and width from the existing estimate (`est/128`, cap 100%). Text estimate `#v2PpEstA/B` stays.
3. Live update while typing (existing `paintCmpEstimates`). Estimate is teaching-only, not PBKDF2 seed size.

Chip `v0.17.91-v2`. Product stamp only on ship. No Imagine. No UC1 edits.

## Acceptance

| ID | Criterion |
|----|-----------|
| AC-1 | UC3 compare: `#ppA` and `#ppB` have `type=password`. |
| AC-2 | `#v2PpBarA` and `#v2PpBarB` exist. Empty A is `pp-tier-empty`. B default `test` is `pp-tier-weak`. |
| AC-3 | Typing a longer mixed secret on A moves `#v2PpBarA` to `pp-tier-fair` or `pp-tier-strong` and increases `aria-valuenow`. |
| AC-4 | Chip `0.17.91-v2`. Picker still 35. UC1 files not required to change. |
| AC-5 | Classic `/` still `#ppStrengthBar` and `#cardCmpPp`. No Sign/Broadcast on UC3. |

## Grill-me

Q: Does the bar mean the passphrase is a funded-wallet guarantee?
A: No. Teaching estimate only. Not the 512-bit PBKDF2 output size.

Q: sessionStorage mnemonic or passphrase?
A: No.

## Testing Decisions

- Red: `#ppA` is `type=text`; no `#v2PpBarA`
- Green: Playwright V2-S3 still compare; **V2-S29** mask + bar tiers
- pytest `tests/test_ac_v2_uc3_pp_strength.py`
