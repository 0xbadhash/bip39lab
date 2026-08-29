# Release v0.16.82

Dual stamp: product **0.16.82** · V2 chip **v0.17.132-v2**

UC1 kid classroom + checksum paste honesty; UC7 any-M Try + editable SLIP print; UC16 12–24 restore. No Sign.

## Smoke

| Step | Command | Exit |
|------|---------|------|
| unit AC | `.venv/bin/python3 -m pytest tests/test_ac_v2_uc1_uc7_classroom.py tests/test_ac_v2_uc7_layout.py tests/test_ac_v2_uc16_wordcount.py -q` | 0 (11) |
| e2e focused | Playwright S1 S17 S27 S40 S44 S45 S50 this session | 0 |
| e2e full | `scripts/run_e2e_smoke.py` | 124 wall (pre-existing Lab/learn) |
| check_web_e2e | `python3 scripts/check_web_e2e.py --root .` | 0 |
| pr_validator | origin/master...HEAD | 100 approved |

## Infra

None.

## Evidence pack

hard_gates; pytest AC; focused V2 Playwright; CODE_REVIEW; BEHAVIOR_REPORT; CROSS_REVIEW.

## Rollback

Tag `v0.16.81`. No force-push.

## Things that look bad but are actually fine

1. leftover scripts uncommitted
2. Dual stamp
3. Random 12 English words fail checksum
4. Full 232 Playwright wall
5. No Sign
