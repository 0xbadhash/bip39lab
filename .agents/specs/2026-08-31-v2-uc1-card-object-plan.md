# Plan: UC1 pad 1 Option A

## Approach

Pad 0 already makes the list (Option 1). Pad 1 must not repeat the entropy lock stack or teach mailboxes. The learner only looks at numbered cells as the backup object, then Pause to pad 2 (addresses).

## Architecture

- `uc1(step === 1)` in `web/v2/js/v2-app.js` renders Do/Do not, `teachBox` `#v2CardWhat`, `entropyChipHtml()` (`#v2EntChip`), `#v2Card` grid, `#v2CardAck`.
- No `entropyHtml()` / `#v2OsEnt` on this step.
- CSS: `.v2-uc1-chip` for the one-line bits reminder.
- Playwright V2-S1 asserts classroom + chip after first Pause; pytest `tests/test_ac_v2_uc1_card_object.py` freezes HTML contracts.

## Implementation sequence

1. Replace step-1 entropy stack with classroom + chip + same card; Do not photograph; ack gates pad 2.
2. Playwright V2-S1 + pytest AC.
3. Dual stamp 0.16.84 / 0.17.134-v2.
