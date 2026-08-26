# V2 UC3 live compare (3-column)

- **Product:** bip39lab
- **Created:** 2026-08-26
- **Status:** ready-for-agent
- **Priority:** P0
- **Plan:** `.agents/specs/2026-08-26-v2-uc3-live-compare-plan.md`
- **Surface:** `web/v2/` UC3 step “Compare empty vs a test secret”

## Problem Statement

Compare A vs B only painted after a button click. The passphrase estimate row and Receive #0 addresses stayed stale while the operator typed. Fields sat beside the key still, so A and B did not line up.

## Solution

Keep a live table and story as the operator types. Three columns: beginner-key still, stacked A/B fields, story + table. Dual stamp: product `0.16.52` vs chip `0.17.78-v2`. Classic `/` unchanged.

## Acceptance

| ID | Criterion |
|----|-----------|
| AC-1 | Typing in A or B updates `#v2CmpPpA` / `#v2CmpPpB` without Compare |
| AC-2 | Receive `#0` cells become `tb1…` after debounce; Compare still unlocks pause when addresses differ |
| AC-3 | Layout is face | fields | results; A and B inputs share one stacked column |
| AC-4 | Chip `0.17.78-v2`; classic `/` still `#btnGenerate` |

## Grill-me

Q: Does live derive persist the mnemonic?
A: No. Memory only. sessionStorage is still progress + ack.

Q: Does the story use innerHTML for the typed secret?
A: No. `textContent` on labels and addresses.

Q: Does Compare still matter?
A: Yes. It is the explicit confirm that unlocks Next when A and B diverge.

## Testing Decisions

- V2-S3: fill B `test` → 4 chars; fill A 26 letters → 26 chars and `tb1` without requiring Compare first
- V2-S0 chip 0.17.78-v2
