# Plan: Reset Starter intro + three Lab overlays

## Approach

Keep existing `onGenerate` / `deriveNow` / `clearSecrets`. Intercept button clicks with three independent overlay dialogs. Reset calls `setLevel("starter")`, `goTab("lab")`, scroll `#panel-title`.

## Architecture

- HTML: `#overlayGenerate`, `#overlayDerive`, `#overlayClear`
- CSS: `.lab-overlay` (not `.qr-modal`)
- JS: `showLabOverlay` / Continue handlers in `app.js`; `resetClassroomProgress` in `learn-levels.js`
- Tests: `clickLabAction` helper

## Testing

Playwright S99–S100 plus existing S80/S81 via helper.

## Risks

Do not replace P0 walls. Do not stage leftover dirty scripts.
