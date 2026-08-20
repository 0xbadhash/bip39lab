# Release v0.16.21 — overlay OK-only

**Date:** 2026-08-20
**Tag:** v0.16.21
**Commit:** c730cd7 (feat 51fb84c; cherry-pick c983024)

## Smoke

| Step | Exit |
|------|------|
| Playwright S0 S100 S102–S108 | 0 |
| hard_gates / pr_validator | 100 |
| check_web_e2e | ok at stamp |

## Infra

No vps_infra_ops.

## Evidence pack

- hard_gates ok
- One OK per overlay; Beginner 0.16.20 intact

## Rollback

Revert to v0.16.20.

## §9

1. Native Generate replace confirm still says Continue.
2. ok-wip four-face dirty files not shipped.
3. README-only `/sync_docs` after tag is FLAG (no force-retag).
