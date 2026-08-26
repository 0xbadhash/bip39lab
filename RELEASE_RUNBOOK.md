# Release v0.16.51

Dual stamp: product **0.16.51** · V2 chip **0.17.75-v2**

UC20 materials lab, Catalyxt custody kit, V2 ack overlay, UC3 generate/compare. Classic `/` unchanged.

## Smoke

| Step | Command | Exit |
|------|---------|------|
| unit | `python -m pytest -q` | 0 (124) |
| e2e | `npx playwright test e2e/v2.spec.ts` | 0 after S2 pathname fix |
| check_web_e2e | `python3 scripts/check_web_e2e.py --root .` | 0 |
| pr_validator | origin/master...HEAD | 100 approved |

## Infra

None (static web).

## Evidence pack

hard_gates; Playwright v2; pytest 124; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Rollback

Tag `v0.16.50`. No force-push.

## Things that look bad but are actually fine

1. leftover scripts stash
2. Dual stamp
3. lab-strip 404
4. Photoreal PNGs not in git
5. Hairline `<img>` vs `<object>` on the kit sheet
