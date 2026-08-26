# Plan: V2 UC3 live compare

**Spec:** `.agents/specs/2026-08-26-v2-uc3-live-compare.md`

## Approach

The compare card is a teaching instrument: same numbered words, two extra secrets, two receive addresses. The operator must see entropy estimates and testnet addresses move as they type, not only after Compare. The key still stays a separate column so A and B fields share one vertical rhythm. Classic Lab stays frozen. V2 chip is independent of product VERSION.

This plan is the implementation sequence for product 0.16.52 / chip 0.17.78-v2. Painters live at module scope so a single document input listener can update estimates immediately and debounce address derivation. A generation counter drops stale BIP39Lab results. Compare remains the gate that enables Next when the two addresses differ.

## Architecture

- Tracks: `web/v2/js/v2-app.js`, `web/v2/css/v2.css`, `web/v2/index.html`
- Tests: `e2e/v2.spec.ts` V2-S0 chip, V2-S3 live table
- Face asset already shipped: `web/assets/ds/faces/beginner-key.png`

## Implementation sequence

1. Hoist live painters (`paintCmpEstimates`, `paintCmpAddresses`, `scheduleCmpAddresses`) and wire `input`/`keyup` so the table and story update while typing; keep Compare as the unlock for pause.
2. Restyle `.v2-cmp-split` as three columns (face, stacked fields, story+table) and keep A/B inputs full width in the middle column.
3. Stamp chip `0.17.78-v2`, extend Playwright V2-S3, then product patch `0.16.52` with classic stamp + ship chain.
