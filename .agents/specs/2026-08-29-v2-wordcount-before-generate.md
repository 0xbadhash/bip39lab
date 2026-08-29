# V2: 12–24 word-count select immediately before every BIP-39 generate

- **Product:** bip39lab
- **Created:** 2026-08-29
- **Status:** ready-for-agent
- **Priority:** P1
- **Surface:** `/v2/` generate-phrase pads
- **Grill-me:** complete (operator: dropdown just before Generate)

## Problem

Word count must sit **immediately above** the generate control (12 / 15 / 18 / 21 / 24), then the button. UC7 already does this (`#v2ShWc` then `#v2ShPhrase`). One user-facing BIP-39 mint does not.

## Assessment (live `v2-app.js`)

| UC | Control | Dropdown immediately before button? | Action |
|----|---------|--------------------------------------|--------|
| **1** s0 | `#v2Generate` Make practice words | Yes (`wordCountSelectHtml` then bar) | none |
| **1** s3 | `#v2Regen` Generate N-word phrase | Yes | none |
| **2** s0 | `#v2Generate` Make practice card | Yes | none |
| **3** s0 | `#v2Generate` Generate N-word phrase | Yes | none |
| **6** | per-cosigner Make practice words | Yes (`#v2CsWc0..2`) | none |
| **7** s0 | `#v2ShPhrase` Generate practice phrase | Yes (`#v2ShWc`) | none |
| **14/15** | `#v2EntMint` Build N words from pad | Yes (`#v2EntWc`) | none (pad entropy, not OS generate) |
| **16** s0 | `#v2Generate` Make practice words | **No** | **change first** |
| **16** s1 | restore cells | hardcoded **12** inputs | must follow s0 count |
| **32** | `#v2XorMake12` Make a **12-word** card | N/A — drill is 12-only XOR | **do not** add 15–24 |
| **7** SLIP | Make practice SLIP-39 shares | N/A — SLIP-39 list, not BIP-39 length | **do not** |
| **20** | four-letter stamps | hidden 12-word mint | not a generate button |
| **30 / 34** | silent throwaway parent/phrase if missing | no generate button | out of scope |

## First change: UC16

Only gap that matches the operator rule (visible BIP-39 generate, no 12–24 select).

Restore is still `for (i = 0; i < 12)`. If s0 can mint 24 words, s1 must render that many cells or the drill is a lie.

## Solution (UC16 only this ship)

1. `wordCountSelectHtml()` immediately before `#v2Generate` on UC16 step 0 (same pattern as UC1/UC7).
2. Generate uses `mem.wordCount` (existing `#v2WordCount` / `v2Generate` handler).
3. Restore pad: `N = mnemonic word count` (fallback 12). Hide/check/fill loops use `N`, not 12.
4. Copy: drop hard-coded “twelve” where the card can be another length.
5. No Sign. No UC32 24-word XOR. No SLIP-39 length dropdown.

## Acceptance

| ID | Criterion |
|----|-----------|
| AC-1 | UC16 s0 HTML order: `v2WordCount` (or shared select) then `#v2Generate`. |
| AC-2 | Default 12 still fills 12 cells. Select 24 + generate → 24-word card. |
| AC-3 | Restore pad has the same N inputs; Check/Fill iterate N. 12-word path unchanged. |
| AC-4 | UC32 remains 12-only. UC7 SLIP button unchanged. |

## Grill-me

**Status:** complete
**Date:** 2026-08-29

### G1 Outcome
- Q: Done?
  - A: UC16 generate has 12–24 immediately above the button; type-back matches that length.

### G2 Non-goal
- Q: Kill?
  - A: Do not add 15–24 to SeedXOR. Do not put BIP-39 length on SLIP-39 mint. Do not restack UC1–3/6/7 that already have the select.

## Later (not this spec)

Optional copy-only: rename UC1/2/16 buttons to “Generate practice phrase” so the label matches UC7. Not required for the dropdown rule.
