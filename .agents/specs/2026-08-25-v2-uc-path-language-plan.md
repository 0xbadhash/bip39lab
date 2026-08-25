# Plan: V2 path language

**Spec:** `.agents/specs/2026-08-25-v2-uc-path-language.md`

## Approach

Keep classic Lab at `/` frozen. Teach custody on `/v2/` with one idea per step. Gate copy is per-track (`GATES[id].is` / `.isnt` plus `TRACKS[id].done`) so the same safety chrome is not the only sentence on every UC. Primary and pause buttons use verb+object. After Mark done, Continue uses the current path’s remaining ids, not `id+1` and not the global SUGGESTED list until that path is complete. sessionStorage stays progress-only (completed, gate flags, optional dock). No mnemonic, no passphrase, no seed.

## Architecture

- `web/v2/js/v2-app.js` owns TRACKS, PATHS, GATES, `nextInPath`, `nextSuggested`, `finishHtml`, per-UC pads.
- `web/v2/index.html` holds topbar **Hard refresh** + **Clear secrets** and `data-v2-version` (not `stamp_site_version.py`).
- Playwright `e2e/v2.spec.ts` is the behavior surface. Pytest AC stubs map AC-1–AC-4.
- Dual stamp: product VERSION for classic pages; V2 chip independent.

## Implementation sequence

1. Fill `GATES` 1–31, rewrite `TRACKS.done` without `≠`, `nextInPath` for Continue, verb+object pauses (UC3/UC4/UC7/UC8), Hard refresh in the topbar, PATHS rails.
2. Playwright `e2e/v2.spec.ts` + pytest AC stubs for AC-1–AC-4.
3. Dual stamp at release: product 0.16.50, V2 chip 0.17.62-v2, compare.md as-of.
