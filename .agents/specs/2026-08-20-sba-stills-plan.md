# Plan: SBA stills 0.16.23

**Spec:** `.agents/specs/2026-08-20-sba-stills.md`

## Approach

Copy five locked PNGs into `web/assets/ds/faces/`. Place `#cardFirstHour` as a compact numbered rail beside `#card-mnemonic` via a CSS grid wrapper. Shorten hour-step labels. Swap Beginner equation imgs to key/dice/lock PNGs. Swap Advanced figure to one visible PNG (no hook hide). Leave `#intStills` alone.

## Architecture

`starter-split` grid; hour-rail CSS accent `#3d8bfd` borders `#3a4a60`. Hour handlers keep `data-hour-step` / Go / Mark done / Set Beginner. Playwright S102–S108.

## Implementation sequence

- Copy assets; rail + Beginner + Advanced markup/CSS.
- Update PW/comet; stamp 0.16.23.
- Merge to master without leftover dirty scripts; tag and push.

## Testing

S102 rail beside lab; S103 three beginner PNGs; S104 Intermediate unchanged; S105 Advanced PNG; overlay OK.

## Risks

Moving mnemonic in DOM must not break hour targets `#card-mnemonic`. Do not hide Advanced img via hookChapterVisuals.

## Rollback

Live 0.16.22 until this tag deploys.
