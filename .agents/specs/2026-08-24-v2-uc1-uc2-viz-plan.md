# Plan: V2 UC1/UC2 atoms + toolbar

**Spec:** `.agents/specs/2026-08-24-v2-uc1-uc2-viz.md`

## Approach

Keep classic Lab frozen. Teach on `/v2/` with Catalyxt App Shell atoms already drawn for UC1 (`feat/gradual-visual-teach` SVGs) and three new UC2 SVGs in the same 220×88 token set. Reuse one `.uc-viz` strip: accent `hi`, others `dim`, full-sentence captions. Do not replace the numbered word grid. Quiz wrong path stays educational; do not spoil the two-correct UC2 quiz while one right option is selected.

## Architecture

- Assets: `web/v2/assets/uc1-atom-*.svg`, `uc2-atom-*.svg` (`img-src 'self'`).
- State: `uc1SetViz` / `uc2SetViz` after `renderTrack` from rail step.
- Layout: `.v2-track .hour-rail` row; `.v2-gen-bar` space-between; `.v2-addr-grid` 3 columns, `.cell` row (chip + tile).
- Quiz: `#v2Uc2Quiz` clears `#v2QuizMsg` until both `data-quiz=ok` are `.is-picked`.

## Implementation

1. `web/v2/js/v2-app.js` + `css/v2.css` — viz HTML, toolbar, rail, address cells, UC2 pads, quiz silence.
2. SVGs under `web/v2/assets/` plus `e2e/v2.spec.ts` S8/S9/S12 (atoms, no nag).
3. Stamp `VERSION` 0.16.38 lockstep; V2 query `?v=0.17.10-v2`; footer stays `0.17.0-v2`.
