# Plan: overlay OK-only 0.16.21

**Spec:** `.agents/specs/2026-08-20-overlay-ok-only.md`

## Approach

Cherry-pick `c983024` onto current 0.16.20. Replace Cancel+Continue with a single OK that calls the existing Continue handlers. Leave Beginner 0.16.20 markup and other faces untouched.

## Architecture

`web/index.html` overlay cards (`#overlayGenerate` / `#overlayDerive` / `#overlayClear`); `web/js/app.js` show/hide + OK click; Playwright `e2e/helpers.ts` `clickLabAction` clicks `.lab-overlay-ok`. Dense body copy stays 0.16.17.

## Implementation sequence

- Cherry-pick c983024; resolve only overlay hunks if needed.
- Update comet S100/S106 for OK-only; stamp VERSION 0.16.21.
- Merge to master without leftover dirty scripts; tag and push.

## Testing

S106 one OK, no Cancel/Continue, copy intact, Reset exact. Rec-flow S108 via helper OK. S103 Beginner tiles still pass. S107 hover.

## Risks

Do not take ok-wip uncommitted CSS/learn-levels four-face rewrite. S80 native confirm still after Generate OK when a phrase exists.

## Rollback

Live stays 0.16.20 until this tag deploys.
