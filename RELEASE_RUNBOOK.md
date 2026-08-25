# Release v0.16.48

Dual stamp: product **0.16.48** · V2 chip **0.17.53-v2**

## Smoke

| Step | Exit |
|------|------|
| `.venv/bin/pytest -q` | 0 (114) |
| `npx playwright test e2e/v2.spec.ts` | 0 (20) |
| `check_web_e2e.py` | 0 |
| `hard_gates` / `pr_validator` | 100 |

Infra: none (static lab). Classic full e2e not the V2 gate.

## Evidence pack

hard_gates ok; Playwright V2; pytest 114; CODE-REVIEW p0=0; BEHAVIOR fail=0.

## Rollback

Tag `v0.16.47`. Revert picker HTML/JS/CSS. Dual stamp must stay paired.

## §9

1. leftover scripts stash
2. lab-strip 404
3. Hard refresh under About
4. Ghost cards excluded from `.uc-card` count
5. Cookie wipe best-effort
