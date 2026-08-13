# RELEASE_RUNBOOK — v0.16.3 S0b light-theme sidebar contrast

**Marker:** RELEASE-RUNBOOK  
**Date:** 2026-08-13  
**Version:** 0.16.3  
**Tag:** v0.16.3  
**Spec waiver:** chore  
**Score:** ship S0b P1 from live Comet 89/90  

## Smoke table

| Step | Command | Exit |
|------|---------|------|
| unit | `.venv/bin/python -m pytest -q` | (run) |
| e2e | `npm run test:e2e` | (run) |
| web_e2e | `python3 scripts/check_web_e2e.py --root .` | (run) |

## What shipped

- Light theme keeps dark sidebar chrome.
- Remap `--panel-2` + `color-scheme: dark` on `.sidebar` so Level / Extra help / Reset are not white-on-white.
- Playwright S0b asserts luminance delta on those controls.
- Bot launcher `docs/E2E_AGENT_LAUNCH.md` (fetch full prompt each run).

## Infra
Static nginx root = repo `web/`. Live after push + reload optional.

## Rollback
1. `git checkout v0.16.2`
2. Restore VERSION + site-version stamps

## §9
1. Dark sidebar under light theme must stay readable.
2. Do not reopen S67 / Teach vs Extra help.
