# Plan: V2 UC8 paste PSBT

**Spec:** `.agents/specs/2026-08-27-v2-uc8-paste-psbt.md`

## Approach

Copy `#psbtIn` + Inspect again. Wire to existing `inspectV2Psbt`. Samples write the textarea first.

## Architecture

- `web/v2/js/v2-app.js` — textarea + inspect
- e2e V2-S34
- `tests/test_ac_v2_uc8_paste_psbt.py`

## Sequence

1. Spec + paste box.
2. Playwright S34.
3. Stamp with UC6.
