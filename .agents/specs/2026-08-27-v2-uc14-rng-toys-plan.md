# Plan: V2 UC14 extra RNG toys

**Spec:** `.agents/specs/2026-08-27-v2-uc14-rng-toys.md`

## Approach

Keep existing `#v2Dice10` (ten simulated d6). Match classic label `+10 d6 (fast)`. After mint, `#v2EntToLab` copies `mem.entMnemonic` to `mem.mnemonic` and `startTrack(1)` (First wallet). Confirm overwrite. No sessionStorage of the phrase. Classic `#btnDice10` / `#btnEntToLab` unchanged.

## Architecture

- `web/v2/js/v2-app.js` — `entButtonsHtml`, `entMintBarHtml`, click handler
- `e2e/v2.spec.ts` — V2-S15 / V2-S46
- compare leftover row 14 Ported

## Sequence

1. Spec (done).
2. UI + confirm copy.
3. Playwright + dual stamp 0.16.73 / 0.17.116-v2.
