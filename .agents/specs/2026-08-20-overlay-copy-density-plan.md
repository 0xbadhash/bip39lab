# Plan: overlay copy density

## Approach

Replace the three overlay body paragraphs in `web/index.html`. Keep overlay chrome, JS Continue/Cancel, and `#overlayGenerateWords`. Update S100 Playwright + comet S100. Stamp 0.16.17.

## Architecture

No new components. Existing overlay dialogs.

## Testing

Playwright S100 assertions match new prose; S80 still after overlay.

## Risks

Do not collapse to one-liners. Do not commit leftover dirty scripts.
