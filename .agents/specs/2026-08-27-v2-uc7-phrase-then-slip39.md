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

1. **Same pad:** mint a practice BIP-39 phrase, keep the word grid, choose M-of-N, **Split into shares**, explain. Keep automated **Combine any M**. Also give a box to paste M share lines and **Try these M shares** to see if recovery works.
3. **Practice SLIP-39:** mint three Trezor-shaped **word share lists** (not BIP-39). Keep **Combine any 2 of 3**. Also three boxes + **Try these 2 shares** so the learner pastes any two lists and rebuilds the practice master hex (or honest fail). Dock `/slip39.html`.

Edu hex ≠ SLIP-39. A share cannot sign. Never fund.

Chip `v0.17.106-v2`. Product stamp on ship.

## Acceptance

| ID | Criterion |
|----|-----------|
| AC-1 | UC7 step 0: Generate practice 12-word phrase **and** M-of-N split/combine on the **same** pad. Word grid stays. Pause locked until combine matches. |
| AC-2 | M-of-N 2-of-3 / 3-of-5. Split explains those words became the shares. **Combine any M** still auto-picks M shares. `#v2ShRecombineIn` + **Try these M shares** rebuilds from pasted `share:index:hex` lines (or honest fail). Not Trezor hex. |
| AC-3 | Next pad: three SLIP-39 share lists. **Combine any 2 of 3** auto. **Try these 2 shares**: exactly two lists is the exercise (green on match). All three: tell the learner the lists are correct but that is not the exercise — clear one. One list: honest fail. Dock `/slip39.html`. |
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
