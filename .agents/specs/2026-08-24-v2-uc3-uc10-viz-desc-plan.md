# Plan: V2 UC3–UC10 atoms + descriptions

**Spec:** `.agents/specs/2026-08-24-v2-uc3-uc10-viz-desc.md`

## Approach

Reuse the UC1/UC2 `.uc-viz` strip. One `VIZ` catalog and `applyViz(id, step)`. Default hi: step 0→1, step 1→2, quiz/finish→3. Teaching copy is a `desc()` paragraph after Do/Do not, full sentences, no contractions. Quiz and Finish stay without extra desc.

## Architecture

- Assets: `web/v2/assets/uc3-atom-*.svg` … `uc10-atom-*.svg` (220×88, App Shell tokens).
- `VIZ[n].atoms` + optional `forStep`; `vizHtml` / `applyViz` expose `ucNSetViz`.
- `desc(text, id)` → `.v2-step-desc`.
- UC8: `inspectPsbt` rendered as lines, not JSON.

## Implementation

1. `web/v2/js/v2-app.js` — VIZ catalog UC3–10, `desc()` on teaching pads, Validate copy, recovery-words quiz, PSBT prose.
2. SVGs under `web/v2/assets/` and `e2e/v2.spec.ts` V2-S13; Comet S-id index.
3. Stamp `VERSION` 0.16.39 lockstep; V2 query `?v=0.17.13-v2`; footer stays `0.17.0-v2`.
