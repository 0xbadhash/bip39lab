# RELEASE_RUNBOOK — v0.16.7 comet range + honesty

**Marker:** RELEASE-RUNBOOK  
**Date:** 2026-08-18  
**Version:** 0.16.7  
**Tag:** v0.16.7  
**Spec:** `.agents/specs/2026-08-18-comet-range-honesty.md`

## Smoke

| Step | Exit |
|------|------|
| pytest | 0 (105) |
| Playwright | 0 (103) |
| check_web_e2e | 0 |

## Stamp
live === comet === PLAYWRIGHT_LAST === /VERSION === chip HTML === **0.16.7**

## Rollback
`git checkout v0.16.6`

## §9
1. Historical comet table now shows current range after auto-replace.
2. P0 walls not reopened.
3. S81/S11b rec-flow unchanged.
