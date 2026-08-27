# Release v0.16.75

Dual stamp: product **0.16.75** · V2 chip **0.17.122-v2**

V2 CSP like Network (`'self' https://mempool.space`). UC10 proxy then public, classroom fees if both miss, Network address table. UC7 SLIP-39 extra secret A/B. UC8 story vs chain inspect.

## Smoke

| Step | Command | Exit |
|------|---------|------|
| unit | `python -m pytest -q` | 0 (compliance) |
| e2e | `npx playwright test e2e/v2.spec.ts -g "V2-S41b\|V2-S43\|V2-S47\|V2-S48\|V2-S49\|V2-S50"` | 0 this session |
| check_web_e2e | `python3 scripts/check_web_e2e.py --root .` | 0 |
| pr_validator | origin/master...HEAD | 100 approved |

## Infra

nginx `location ^~ /v2/` on bip39.catalyxt.xyz reloaded with same CSP.

## Evidence pack

hard_gates; pytest; Playwright; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Rollback

Tag `v0.16.74`. No force-push.

## Things that look bad but are actually fine

1. leftover scripts uncommitted
2. Dual stamp
3. CSP page-wide on /v2/
4. Classroom fees not live rates
5. No Sign
