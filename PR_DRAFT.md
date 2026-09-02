# PR Draft — v0.16.86 UC35 plain English + illustration

**Range:** `v0.16.85...HEAD`  
**Spec:** `.agents/specs/2026-09-02-v2-uc35-plain-english.md`  
**Plan:** `.agents/specs/2026-09-02-v2-uc35-plain-english.md`

## What Problem This Solves

UC35 read as AI slop. Learners could not tell the exercise is “same 12 words, Electrum vs BIP-39, wrong wallet.”

## Why This Change Was Made

Operator: true English, image left of the blue classroom box.

## User Impact

Title **Same words, wrong app**. Pad: illustration | blue story. Quiz in plain English. Lab still does not run Electrum.

## Evidence

- `pytest tests/test_ac_v2_uc35.py`  
- Playwright V2-S26 PASS  

## Red-proof / TDD

- red_cmd: `false`  
- green_cmd: `.venv/bin/python3 -m pytest tests/test_ac_v2_uc35.py -q`

## Traceability

| AC | Evidence |
|----|----------|
| AC-1 | `test_ac_1_plain_english_title_and_classroom` |
| AC-2 | `test_ac_2_image_left_of_blue_box` |
| AC-3 | `test_ac_3_e2e_trap_copy` + V2-S26 |

## Threat notes

- **secrets:** practice phrase only; no Electrum KDF  
- **xss:** static SVG + teach HTML  
- **csrf:** n/a offline lab  

## Evidence pack

- hard_gates + unittest test_ac_v2_uc35 + Playwright V2-S26  
- smoke at `/release_mgmt`  

## Untested paths

| Path | Reason |
|------|--------|
| web/v2/js/v2-app.js | covered by AC tests + V2-S26 |

## Things that look bad but are actually fine

1. v2-app.js large diff in the UC35 commit may include nearby pad copy — ship is UC35.  
2. No Electrum address is generated — by design.  
3. Chip cache `0.17.136-v2` is not product VERSION.

## §9

1. Does not compute Electrum KDF.  
2. Does not fund practice phrases.  
3. Does not reopen catalyxt.xyz EmailJS.

## Things that look bad but are actually fine

Wait no duplicate - section 9 is Things that look bad. I already have that with 3 items. Good.
