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

1. Fill `GATES` 1–31 and rewrite `TRACKS.done` without `≠`.
2. `nextInPath(pickerFilter)` for picker Continue; `finishHtml` next title from remaining path ids (treat current as done).
3. Relabel pause/primaries. UC3 compare empty vs test. UC4 `mem.pathTouched`. UC7 split then combine. UC8 inspect enables pause; never Sign.
4. Relocate `#v2HardRefresh` to `.topbar-actions`.
5. Rails on every PATHS section. Shared blurb `1 Multisig keys · 2 Shamir shares · 3 PSBT air-gap`.
6. Tests + compare.md as-of product 0.16.50 / chip 0.17.62-v2 at release stamp.
