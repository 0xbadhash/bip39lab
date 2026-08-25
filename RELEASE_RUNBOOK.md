# Release v0.16.50

Dual stamp: product **0.16.50** · V2 chip **0.17.62-v2**

V2 path language: per-track gates, verb+object buttons, Continue in-path, Hard refresh beside Clear secrets. Classic `/` unchanged.

## Smoke

| Step | Command | Exit |
|------|---------|------|
| unit | `python -m pytest -q` | 0 after pyproject stamp |
| e2e | `npx playwright test e2e/v2.spec.ts` | 0 |
| hard_gates | origin/master...HEAD | ok |
| pr_validator | score 100 | approved |

## Infra

None (static web + nginx). No INFRA_RUNBOOK this product.

## Evidence pack

hard_gates; Playwright v2.spec; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Rollback

Checkout previous tag `v0.16.49`. Do not force-push.

## Things that look bad but are actually fine

1. leftover scripts stash
2. Dual stamp
3. lab-strip 404 under /v2/js
4. Finish “will not send coins” on non-address tracks
5. `wantRail = true` on All paths
