# V2 UC2 passphrase pad: cut repetition, example PP

- **Product:** bip39lab
- **Created:** 2026-08-25
- **Status:** ready-for-agent
- **Priority:** P0
- **Plan:** `.agents/specs/2026-08-25-v2-uc2-pp-example-plan.md`
- **Surface:** `web/v2/` UC2 step “Do this. Do not do that.”

## Problem Statement

The UC2 do/do-not pad stacked the same lesson in three type sizes: real-money paragraph, BIP-39 (i) line, “these rules apply… practice,” plus a key caption that did not match the body. No passphrase example.

## Solution

Keep Do / Do not. Drop duplicate desc and mnemonic (i) on that step. Align key + body at 0.82rem. Show a generated four-word practice example with Generate another.

## Acceptance

| ID | Criterion |
|----|-----------|
| AC-1 | UC2 do-not pad has `#v2PpEx` four-word example and Generate another changes it |
| AC-2 | That pad does not repeat “If these words were real money” or `#v2MnemonicLine` |
| AC-3 | Chip `0.17.54-v2`; compare.md as-of 0.16.49 |

## Grill-me

Q: Is the example a funded passphrase?
A: No. Practice only; four words from a generated mnemonic. Do not reuse on a funded wallet.

Q: Did we remove Do / Do not?
A: No. Photograph / cloud / passphrase-apart stay in Do / Do not.

Q: Classic Lab?
A: Unchanged.

## Testing Decisions

- V2-S8: `#v2PpEx`, generate another, no real-money paragraph, no `#v2MnemonicLine` on that step
- V2-S0 chip
