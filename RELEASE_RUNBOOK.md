# Release v0.16.74

Dual stamp: product **0.16.74** · V2 chip **0.17.117-v2**

UC7: three filled SLIP-39 lists + Try is amber/orange (`msg-warn`), not green. Two-share drill stays green.

## Smoke

| Step | Command | Exit |
|------|---------|------|
| unit | `python -m pytest -q` | 0 (via compliance) |
| e2e | `npx playwright test e2e/v2.spec.ts -g V2-S45` | 0 |
| check_web_e2e | `python3 scripts/check_web_e2e.py --root .` | 0 |
| pr_validator | origin/master...HEAD | 100 approved |

## Infra

None (static web).

## Evidence pack

hard_gates; pytest; Playwright V2-S45; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Rollback

Tag `v0.16.73`. No force-push.

## Things that look bad but are actually fine

1. leftover scripts uncommitted
2. Dual stamp
3. `.msg-warn` uses #e08a24 not only --warn gold
4. Combining 3 still not the exercise
5. No Sign
