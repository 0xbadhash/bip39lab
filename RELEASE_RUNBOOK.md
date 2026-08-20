# Release v0.16.19 — four level-gate faces

**Date:** 2026-08-20
**Tag:** v0.16.19
**Commit:** dc3b02c (after feat 5c316a9 + plan/pyproject + S0 lockstep)

## Smoke

| Step | Exit |
|------|------|
| pytest (unit) | 0 |
| Playwright S0 / S102–S108 / S13b retry | 0 |
| check_web_e2e | 0 |
| Full `npm run test:e2e` first pass | 1 (S0 pin 0.16.18 + S13b flake); fixed S0; S13b rerun pass |

## Infra

No vps_infra_ops this ship. nginx deploy is independent after origin tag.

## Evidence pack

- hard_gates ok (score 100 on wip HEAD 68251c7)
- Playwright faces 7/7
- S0 chip v0.16.19

## Rollback

Keep live at 0.16.18 until nginx deploy of this tag.

## §9

1. Duplicate DS SVG aliases for CSP `'self'`.
2. S13b can flake on local mempool proxy.
3. Tag may precede README-only `/sync_docs` (FLAG, no force-retag).
