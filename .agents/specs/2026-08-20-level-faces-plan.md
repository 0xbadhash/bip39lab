# Plan: level faces 0.16.19

**Spec:** `.agents/specs/2026-08-20-level-faces.md`

## Approach

Keep the existing `wip/level-faces` product WIP. Gate later cards with `data-level-hide` plus learn-levels face ranks. Serve chapter SVGs from `'self'` under `web/assets/catalyxt/chapters/` (canonical starter-info, beginner-seed, intermediate-keys-shares, advanced-master-child) and local aliases `web/assets/ds/faces/`. Do not hotlink ui.catalyxt.xyz. Do not invent a fifth face or a seventh nav item.

## Architecture

Lab index plus `web/js/learn-levels.js` owns level, collapse, and chapter hooks. CSS `.chapter-visual` / `.face-collapsed` is presentation only. Playwright `e2e/faces.spec.ts` S102–S108 is the public contract. Comet Product stamp lockstep via `stamp_site_version.py`. Hover, overlays, Reset remain untouched modules (`help-ui.js`, overlay ids, resetClassroomProgress).

## Implementation sequence

1. Spec + plan + PLAN_REVIEW already in tree.
2. Consume DS files already copied; do not run hook_ds_chapters.py in the ship.
3. Stamp VERSION 0.16.19 on the product commit.
4. Merge wip into master without leftover dirty scripts/config; tag and push origin/master.

## Testing

Playwright S102–S108 local then live after deploy. Rec-flow S108. Independent lockstep VERSION/chip/site-version/PLAYWRIGHT_LAST/comet.

## Risks

Merge hygiene: leftover dirty `scripts/*.py` on `/home/debian/bip39lab` must not enter the commit. Tag vs README-only `/sync_docs` FLAG without force-retag.

## Rollback

Leave live nginx at 0.16.18 until this tag deploys.
