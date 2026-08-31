# Release runbook — v0.16.84

Dual stamp: product **0.16.84** · V2 chip **v0.17.134-v2**

## Smoke

| Step | Exit |
|------|------|
| pytest card_object + classroom | 0 |
| Playwright V2-S1 | 0 |
| compliance_engine | 0 |
| pr_validator | 100 |

## Infra

Static nginx lab. No VPS infra skill this ship.

## Evidence pack

hard_gates ok; secrets gitleaks clean; BEHAVIOR V2-S1 pad 1; spec 2026-08-31-v2-uc1-card-object.

## Rollback

1. `git checkout v0.16.83` and redeploy `web/`.
2. Chip files still 0.17.133-v2 on that tag.
3. Pad 1 will again show entropy stack.

## Things that look bad but are actually fine

1. Dual stamp
2. leftover scripts if any still uncommitted
3. Classic 232 Playwright not the green_cmd
