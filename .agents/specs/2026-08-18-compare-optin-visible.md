# Compare Network opt-in always visible

- **Product:** bip39lab
- **Created:** 2026-08-18
- **Status:** ready-for-agent
- **Priority:** P1
- **Constitution:** AGENTS.md

## Problem Statement

Compare opt-in (“Addresses leave only if you opt in on Network.”) lives in Extra-help-only Step 1. Extra help Off hides it.

## Solution

Always-visible Compare intro states the opt-in line. Extra help may repeat it. “nothing is sent” stays banned. Bump 0.16.8. Do not reopen P0 isolation or S81/S11b rec-flow.

## Acceptance Criteria

- [ ] Compare intro (not teach-only) contains opt-in on Network
- [ ] Extra help Off still shows that line
- [ ] “nothing is sent” absent
- [ ] 0.16.8 on VERSION, site-version, comet, PLAYWRIGHT_LAST, chip HTML
- [ ] Playwright S82 + comet updated
