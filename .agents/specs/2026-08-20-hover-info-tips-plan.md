# Plan: hover-(i)

## Approach

CSS: show `.help-tip-panel` on `.help-tip:hover` and `:focus-within`. Do not rely on `[hidden]` click toggle. JS: strip `hidden` on init; pointerenter/leave + focus; Escape force-hide; no click required.

## Architecture

`help-ui.js` initTips; CSS `.help-tip-panel` display; Extra help Off rule unchanged.

## Testing

S43 hover + Esc; S45–S47 hover; glossary hover; S100 overlays still click.

## Risks

Do not reopen S42. Do not change action overlays.
