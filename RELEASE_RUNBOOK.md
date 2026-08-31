# Release runbook — v0.16.85

Dual stamp: product **0.16.85** · V2 chip **v0.17.135-v2**

## Smoke

| Step | Exit |
|------|------|
| pytest card_object + classroom | 0 |
| Playwright V2-S12 V2-S27 | 0 this session |
| compliance_engine | (pr_validator) |
| pr_validator | pending |

## Infra

Static nginx lab. No VPS infra skill this ship.

## Evidence pack

hard_gates; secrets; BEHAVIOR S12/S27; spec 2026-08-31-v2-uc1-paste-quiz.

## Rollback

1. `git checkout v0.16.84` and redeploy `web/`.
2. Chip 0.17.134-v2 on that tag.
3. Paste will again block checksum-fail without filling the card.

## Things that look bad but are actually fine

1. Dual stamp
2. leftover scripts if any still uncommitted
3. Classic 232 Playwright not the green_cmd
