# Release runbook — v0.16.87 / 0.17.137-v2

**When:** 2026-09-03  
**Spec:** `.agents/specs/2026-09-03-v2-classroom-cluster-fsm.md`  
**Score:** 100 (`pr_validator` approved)

## Smoke

| Step | Command | Exit |
|------|---------|------|
| unit | `.venv/bin/python3 -m pytest tests/ -q` | 0 after chip pin AC |
| layout AC | `pytest tests/test_ac_v2_uc7_layout.py` | 0 |
| hard_gates | `hard_gates.py --diff v0.16.86...HEAD` | 0 |
| V2 e2e subset | `npx playwright test e2e/v2.spec.ts -g "V2-S0 picker|V2-S24 UC33|V2-S25 UC34"` | at stamp time |

## Evidence pack

- hard_gates ok  
- pytest layout + hardening chip  
- CODE-REVIEW / CROSS-REVIEW / BEHAVIOR_REPORT  

## Infra

N/A static nginx lab.

## Rollback

1. `git checkout v0.16.86` on deploy host  
2. Restore previous `web/` tree  
3. Do not reuse practice phrases  

## §9

1. No Sign / CSV live.  
2. No Electrum KDF.  
3. No force-push; leftover scripts uncommitted.

## Dual stamp

- Product `0.16.87` / tag `v0.16.87`  
- V2 chip `0.17.137-v2`
