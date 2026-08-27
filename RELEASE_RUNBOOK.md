# Release v0.16.76

Dual stamp: product **0.16.76** · V2 chip **v0.17.125-v2**

Blue classroom (`teachBox`) vs lab/chain result on payload tracks. No Sign.

## Smoke

| Step | Command | Exit |
|------|---------|------|
| unit | `python -m pytest -q` | 0 (compliance) |
| e2e | `npx playwright test e2e/v2.spec.ts -g "V2-S13\|V2-S33\|V2-S34\|V2-S39\|V2-S40"` | 0 this session |
| check_web_e2e | `python3 scripts/check_web_e2e.py --root .` | 0 |
| pr_validator | origin/master...HEAD | 100 approved |

## Infra

None new.

## Evidence pack

hard_gates; pytest; Playwright; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Rollback

Tag `v0.16.75`. No force-push.

## Things that look bad but are actually fine

1. leftover scripts uncommitted
2. Dual stamp
3. Ceremony UCs have no extra blue dump
4. No Sign
5. green_cmd is pytest (Playwright already run)
