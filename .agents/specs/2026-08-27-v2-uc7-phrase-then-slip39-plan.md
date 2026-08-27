# Plan: V2 UC7 phrase-first + SLIP-39 practice

**Spec:** `.agents/specs/2026-08-27-v2-uc7-phrase-then-slip39.md`

## Approach

Keep `ShamirLab` for classroom hex of UTF-8 phrase bytes. Load `slip39.bundle.js` on `/v2/` for `Slip39Lab.splitSingleGroup`. Extra UC7 step before quiz.

## Architecture

- `web/v2/index.html` — script `../js/slip39.bundle.js`
- `web/v2/js/v2-app.js` — `uc7` steps 0–3
- e2e V2-S39 S40
