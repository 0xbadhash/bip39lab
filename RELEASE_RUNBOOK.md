# Release v0.16.73

Dual stamp: product **0.16.73** · V2 chip **0.17.116-v2**

WINDOW 6 UC14 extra RNG toys: `+10 d6 (fast)` and send practice pad to First wallet. Classic `/` `#btnDice10` / `#btnEntToLab` unchanged. No UC10 reopen. No Sign.

## Smoke

| Step | Command | Exit |
|------|---------|------|
| unit | `python -m pytest -q` | 0 (180) |
| e2e | `npx playwright test e2e/v2.spec.ts -g "V2-S15\|V2-S46"` | 0 |
| check_web_e2e | `python3 scripts/check_web_e2e.py --root .` | 0 |
| pr_validator | origin/master...HEAD | 100 approved |

## Infra

None (static web).

## Evidence pack

hard_gates; pytest; Playwright V2-S15 S46; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Rollback

Tag `v0.16.72`. No force-push.

## Things that look bad but are actually fine

1. leftover scripts uncommitted
2. Dual stamp 0.16.73 vs 0.17.116-v2
3. First wallet is the V2 Lab analog
4. dice stay Math.random classroom toys
5. UC10 fetch off-nginx not this ship
