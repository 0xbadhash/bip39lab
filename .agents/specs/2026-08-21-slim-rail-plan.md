# Plan: slim Starter rail 0.16.24

**Spec:** `.agents/specs/2026-08-21-slim-rail.md`

## Approach

Remove per-row `.hour-step-actions` from `#firstHourList` h1–h7. Keep `data-hour-step` / tab / target / href. Add `#hourRailActions` with one Go and one Mark done. Clicking a rail `li` selects it. Shared Go calls existing `goHourStep(selectedLi)`. Shared Mark done calls `markHourStep(id)`. h8 selection shows `#hourGoBeginner`. Store `data-hour-level` on the h6 `li`. Update `refreshHourGates` to enable `#hourRailDone` from the selected step.

## Architecture

HTML/CSS in `hour-rail`; JS `learn-levels.js` `wireFirstHour` / `refreshHourGates`. Playwright S102 + learn.spec locators.

## Implementation sequence

- Slim markup + select JS + CSS.
- Update PW/comet; stamp 0.16.24.
- Merge without leftover dirty scripts; tag and push.

## Testing

S102: 0 `.hour-go` inside list; `#hourRailGo` visible after select. S103–S108 leftovers. Rec-flow.

## Risks

learn.spec / network.spec / help-ux click `.hour-go` inside step — update those to select then `#hourRailGo`.

## Rollback

Live 0.16.23 until this tag deploys.
