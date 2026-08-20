# Plan: Beginner visual 0.16.20

**Spec:** `.agents/specs/2026-08-20-beginner-visual.md`

## Approach

Restyle only `#cardQuiz` / Beginner chapter chrome. Replace hidden placeholder `<img>` + hook caption with a visible composed equation (key + dice = lock) and entropy bar. Convert stacked `.quiz-item.hour-step` into a four-tile CSS grid. Kill Guided-quiz heading copy in HTML and dock strings that appear on the Beginner face. Leave Starter, Intermediate, Advanced markup and overlay ids untouched.

## Architecture

`web/index.html` Beginner card; `web/css/app.css` tile grid + visual; `web/js/learn-levels.js` and `app.js` dock label “Back to Beginner” when mode is quiz; new `web/assets/ds/faces/beginner-entropy-eq.svg` (not the 1631-byte hairline). Playwright `e2e/faces.spec.ts` S103/S108. Stamp 0.16.20.

## Implementation sequence

- Rewrite Beginner chapter + tiles; hide/remove Guided quiz headings and Go to Guided quiz.
- Compose local SVG/CSS visual; keep quiz ids and Go try / Mark passed behavior.
- Update PW/comet and stamp; merge to master without leftover dirty scripts.

## Testing

S103 tiles + visible visual + no Guided quiz heading. S102/S104/S105/S106/S107 must still pass.

## Risks

Dock copy on Shamir/Tools still saying Guided quiz — change quiz-mode strings only. Overlay OK-only in ok-wip must not merge.

## Rollback

Live stays 0.16.19 until this tag deploys.
