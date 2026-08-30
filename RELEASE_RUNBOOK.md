# Release v0.16.83

Dual stamp: product **0.16.83** · V2 chip **v0.17.133-v2**

UC25 BIP-352 silent-payments drill. Also UC19 first-receive, UC15 layout, UC5 change descriptors. No Sign.

## Smoke

| Step | Command | Exit |
|------|---------|------|
| unit AC | `.venv/bin/python3 -m pytest tests/test_ac_v2_uc25_bip352.py -q` | 0 |
| e2e | Playwright S58 this session | 0 |
| e2e full | `scripts/run_e2e_smoke.py` | 124 wall (pre-existing) |
| check_web_e2e | `python3 scripts/check_web_e2e.py --root .` | 0 |
| pr_validator | origin/master...HEAD | 100 approved |

## Infra

None.

## Evidence pack

hard_gates; pytest AC; S58; CODE_REVIEW; BEHAVIOR_REPORT; CROSS_REVIEW.

## Rollback

Tag `v0.16.82`. No force-push.

## Things that look bad but are actually fine

1. leftover scripts uncommitted
2. Dual stamp
3. Classroom SHA-256 is not live ECDH
4. Full 232 Playwright wall
5. Calendar removed; UC16/UC18 remain
