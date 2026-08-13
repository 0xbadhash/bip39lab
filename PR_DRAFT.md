# PR Draft: v0.16.3 S0b light-theme sidebar + E2E launcher

Live Comet on v0.16.2 scored 89/90. Only P1: Level / Extra help / Reset white-on-white in light theme because sidebar remapped `--text` but not `--panel-2`, and `color-scheme: light` leaked into native controls.

## Changes
- `web/css/app.css` — sidebar `--panel-2`, `color-scheme: dark`, explicit select/secondary colors
- `e2e/lab.spec.ts` — S0b contrast check
- `docs/E2E_AGENT_LAUNCH.md` — short fetch-only bot instruction
- Stamp `0.16.3`

## Non-goals
S67, Extra help rename, SLIP-39 nav, Network chip prominence.
