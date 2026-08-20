# Plan: level faces 0.16.19

**Spec:** `.agents/specs/2026-08-20-level-faces.md`

## How

1. Keep existing WIP on `wip/level-faces`: `web/index.html`, `learn-levels.js`, `app.css`, `e2e/faces.spec.ts`.
2. Commit DS files under `web/assets/catalyxt/chapters/` and `web/assets/ds/faces/` already in the worktree. CSP `img-src 'self'`.
3. Do not commit `scripts/hook_ds_chapters.py` or `node_modules`.
4. Stamp `0.16.19` via `stamp_site_version.py` + `stamp_comet_header.py` on merge to master.
5. Playwright `e2e/faces.spec.ts` F1–F7 + rec-flow; comet Product + rec-flow lines.
6. Merge into `/home/debian/bip39lab` master without leftover dirty scripts/config; tag `v0.16.19`; push origin/master no `--force`.

## Risks

- Mixing leftover dirty files from main checkout: merge with path-limited add.
- Tag vs README-only sync_docs: FLAG, do not force-retag.

## Rollback

Revert tag + master commit; live nginx stays 0.16.18 until this ship deploys.
