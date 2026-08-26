# Plan: UC3 polish + mint bar

**Spec:** `.agents/specs/2026-08-26-v2-uc3-mintbar.md`

## Approach

Keep classic Lab frozen. Finish the compare card as a live instrument: no extra click, colored strength under A/B and in the table, Next when addresses split. On UC14/UC15 the mint control is one job (choose count, build words) so the button must sit beside the dropdown, not at the opposite edge of a full-width `space-between` row.

This plan is the sequence for product 0.16.53 / chip 0.17.80-v2. Painters already live at module scope. Compare button and unlock-via-click go away. A small `.v2-ent-mint-group` wraps select + Build so flex cannot throw the button to the right.

## Architecture

- Tracks: `web/v2/js/v2-app.js`, `web/v2/css/v2.css`, `web/v2/index.html`
- Tests: `e2e/v2.spec.ts` V2-S0/S3/S15

## Implementation sequence

1. Remove `#v2Cmp`; color `.v2-pp-est-*`; enable pause when addresses differ.
2. Wrap Word count + Build in `.v2-ent-mint-group`; override mintbar to `flex-start`.
3. Stamp chip `0.17.80-v2`, Playwright S0/S3/S15, product `0.16.53` + ship chain.
