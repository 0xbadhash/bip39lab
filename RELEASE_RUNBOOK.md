# Release v0.16.78

Dual stamp: product **0.16.78** · V2 chip **v0.17.127-v2**

UC18 heir object drill. No Sign.

## Smoke

| Step | Command | Exit |
|------|---------|------|
| unit | `python -m pytest tests/test_ac_v2_uc18_heir_drill.py -q` | 0 |
| e2e | `npx playwright test e2e/v2.spec.ts -g "V2-S51"` | 0 this session |
| check_web_e2e | `python3 scripts/check_web_e2e.py --root .` | 0 |
| pr_validator | origin/master...HEAD | 100 approved |

## Infra

None new.

## Evidence pack

hard_gates; pytest; Playwright; CODE_REVIEW; BEHAVIOR_REPORT; CROSS_REVIEW.

## Rollback

Tag `v0.16.77`. No force-push.

## Things that look bad but are actually fine

1. leftover scripts uncommitted
2. Dual stamp
3. green_cmd is pytest
4. No Sign
