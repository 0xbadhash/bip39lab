# Release v0.16.20 — Beginner visual (locked mock)

**Date:** 2026-08-20
**Tag:** v0.16.20
**Commit:** 76a9c89 (feat 03394b5)

## Smoke

| Step | Exit |
|------|------|
| Playwright S102–S108 S0 | 0 (S103/S108 after tile CSS + Mark passed) |
| check_web_e2e | 0 |
| hard_gates / pr_validator | 100 |

## Infra

No vps_infra_ops. nginx deploy independent.

## Evidence pack

- hard_gates ok
- Playwright faces S103 mock + S102/S104/S105/S106/S107 kept

## Rollback

Live 0.16.19 until this tag deploys.

## §9

1. quizSummary visually-hidden inventory.
2. Hairline beginner-seed.svg unused on this face.
3. Tag may precede README-only `/sync_docs` (FLAG, no force-retag).
