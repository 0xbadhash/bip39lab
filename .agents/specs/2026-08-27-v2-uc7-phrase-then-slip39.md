# V2 UC7 phrase-first Shamir + practice SLIP-39

- **Product:** bip39lab
- **Created:** 2026-08-27
- **Status:** ready-for-agent
- **Priority:** P0
- **Plan:** `.agents/specs/2026-08-27-v2-uc7-phrase-then-slip39-plan.md`
- **Surface:** `web/v2/` UC7 only. Dock `/shamir.html` and `/slip39.html`. No Sign. No UC6/UC8.
- **Grill-me:** complete (operator brief)

## Problem Statement

UC7 currently splits a random **hex** blob. Learners never see a seed phrase first, cannot choose M-of-N, and never touch **SLIP-39 word shares** (the format Trezor uses). They click Split and get hex with little story.

## Solution

1. **Mint a practice BIP-39 phrase** (Generate). That is the one secret.
2. **Choose M-of-N** (2-of-3 default, 3-of-5). **Split into shares** one click: Shamir of the phrase bytes (edu hex). The readout explains what / why / how. Then **Combine any M**.
3. **Practice SLIP-39:** one click makes Trezor-shaped **word** shares via `Slip39Lab` (same lib as `/slip39.html`). Combine. Copy: lab practice, never fund, not Suite. Dock the SLIP-39 room.

Edu hex ≠ SLIP-39. A share cannot sign. Never fund.

Chip `v0.17.106-v2`. Product stamp on ship.

## Acceptance

| ID | Criterion |
|----|-----------|
| AC-1 | UC7 step 0: Generate practice 12-word phrase before split. Pause locked until generated. |
| AC-2 | Step 1: M-of-N select 2-of-3 / 3-of-5. Split explains; Combine any M rebuilds the same words. Not Trezor hex. |
| AC-3 | Step 2: Practice SLIP-39 word shares (2-of-3). Combine recovers. Dock `/slip39.html`. Practice / never fund. |
| AC-4 | No Sign. UC6/UC8 unchanged. Classic `/` unchanged except cache-bust. |
| AC-5 | Quiz still teaches hex ≠ SLIP-39 / share cannot sign. |

## Grill-me

Q: Phrase first then split?
A: Yes.

Q: M-of-N?
A: 2-of-3 default, 3-of-5.

Q: One-click then explain?
A: Yes.

Q: True SLIP-39 Trezor-shaped?
A: Yes, in-tab practice via Slip39Lab + dock. Never fund. Not Suite clone.

Q: Mix UC6/UC8?
A: No.

## Testing Decisions

- Green: V2-S39 phrase+split+combine; V2-S40 SLIP-39 practice
- pytest `tests/test_ac_v2_uc7_phrase_slip39.py`
