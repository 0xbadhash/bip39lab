# Publish PLAYWRIGHT_LAST.md and /VERSION (no product bump)

- **Product:** bip39lab
- **Created:** 2026-08-18
- **Status:** ready-for-agent
- **Priority:** P0
- **Plan:** none
- **Constitution:** AGENTS.md

## Problem Statement

E2E lock is product 0.16.6. Live `site-version.js` and Comet Product match 0.16.6. `https://bip39.catalyxt.xyz/PLAYWRIGHT_LAST.md` and `/VERSION` 404, so agents cannot lock PLAYWRIGHT_LAST === /VERSION.

## Solution

Serve `web/VERSION` and `web/PLAYWRIGHT_LAST.md` stamped **0.16.6** from nginx root. Stamp script keeps them in lockstep with VERSION. Do **not** bump product. Do **not** create a tag past v0.16.6. Do not reopen P0 PASSes.

## Acceptance Criteria

- [ ] GET `/VERSION` is 200 and body is `0.16.6`
- [ ] GET `/PLAYWRIGHT_LAST.md` is 200 and states product 0.16.6
- [ ] Comet Product line remains 0.16.6
- [ ] `site-version.js` remains v0.16.6
- [ ] stamp_site_version writes both files
- [ ] No new semver / no tag past v0.16.6

## Out of Scope

P0 lab-safety reopen. P1 honesty. Figure, Card, window 9.

## Clarifications

### 2026-08-18
- Q: Bump?
  - A: No. Docs/static publish only.
