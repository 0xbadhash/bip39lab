# Release v0.16.77

Dual stamp: product **0.16.77** · V2 chip **v0.17.126-v2**

UC8 extra named txs: OP_RETURN note, Inscription 0, Runestone etch. No Sign.

## Smoke

| Step | Command | Exit |
|------|---------|------|
| unit | `python -m pytest -q` | 0 |
| e2e | `npx playwright test e2e/v2.spec.ts -g "V2-S41"` | 0 this session |
| check_web_e2e | `python3 scripts/check_web_e2e.py --root .` | 0 |
| pr_validator | origin/master...HEAD | 100 approved |

## Infra

None new. Live `/v2/` CSP already `'self' https://mempool.space`.

## Evidence pack

hard_gates; pytest; Playwright; CODE_REVIEW; BEHAVIOR_REPORT; CROSS_REVIEW.

## Rollback

Tag `v0.16.76`. No force-push.

## Things that look bad but are actually fine

1. leftover scripts uncommitted
2. Dual stamp
3. green_cmd is pytest (Playwright already run)
4. No Sign
