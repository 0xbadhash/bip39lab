# Release v0.16.81

Dual stamp: product **0.16.81** · V2 chip **v0.17.131-v2**

UC7 Try-first layout (amber Try, Combine right-aligned). Absorbs untagged 0.16.79/80 tree. No Sign.

## Smoke

| Step | Command | Exit |
|------|---------|------|
| unit | `.venv/bin/python3 -m pytest tests/test_ac_v2_uc7_layout.py -q` | 0 |
| pytest full | product_smoke unit | 0 (206+ AC) |
| e2e V2 | `npx playwright test e2e/v2.spec.ts --reporter=line` | 0 (60/60) |
| e2e full | `scripts/run_e2e_smoke.py` | 124 wall (pre-existing Lab/learn timeout; not this UC) |
| check_web_e2e | `python3 scripts/check_web_e2e.py --root .` | 0 |
| pr_validator | origin/master...HEAD | 100 approved |

## Infra

None.

## Evidence pack

hard_gates; pytest AC; V2 Playwright 60/60; CODE_REVIEW; BEHAVIOR_REPORT; CROSS_REVIEW.

## Rollback

Tag `v0.16.78` on origin (0.16.79/80 never tagged). No force-push.

## Things that look bad but are actually fine

1. leftover scripts uncommitted
2. Dual stamp
3. Full 232 Playwright wall-clock 124 — V2 60/60 is the ship surface
4. No Sign
5. Combine sits under help; Try result below
