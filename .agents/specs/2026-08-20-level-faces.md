# Level faces (Starter / Beginner / Intermediate / Advanced)

- **Product:** bip39lab
- **Created:** 2026-08-20
- **Status:** ready-for-agent
- **Priority:** P1
- **Stamp:** **0.16.19** (next after locked 0.16.18 hover)
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** `.agents/specs/2026-08-20-level-faces-plan.md`
- **Tracker:** local
- **Constitution:** AGENTS.md
- **Grill-me:** complete

## Problem Statement

CEO locked four level-gate faces. Content existed; later-level cards still mixed onto earlier faces. DS chapter SVGs sit in the worktree unused as a live stamp. 0.16.18 hover is E2E locked — this is the next stamp.

## Solution

Ship four faces at **v0.16.19** from `wip/level-faces` / `/home/debian/bip39lab-faces-wip`:

- **Starter:** intro “Offline BIP-39 lab” + exact `#panel-sub` “Generate, validate, and derive receive addresses — English wordlist only.” + First hour + lab. Later faces `data-level-hide`.
- **Beginner:** Starter lab collapses; chapter “Passphrase and entropy”; Q1–Q4; Intermediate hidden.
- **Intermediate:** keys ≠ shares ≠ share-words; I1–I4; Advanced hidden.
- **Advanced:** master → child keys + this site is not a wallet; A1–A4.
- **12-check** is inventory (status boards), not a fifth nav. Keep 6 nav items.
- Consume local DS: `web/assets/catalyxt/chapters/{starter-info,beginner-seed,intermediate-keys-shares,advanced-master-child}.svg` (+ aliases `web/assets/ds/faces/bip39-*.svg`). CSP `img-src 'self'`.

Do not reopen 0.16.18 hover, 0.16.17 overlays, 0.16.16 Reset, P0/S85/S98.

## User Stories

1. As a Starter learner, I only see intro + First hour + lab.
2. As a Beginner, I see Passphrase and entropy + Q1–Q4, not Intermediate.
3. As Intermediate, I see keys ≠ shares ≠ share-words + I1–I4, not Advanced.
4. As Advanced, I see master → child keys, not-a-wallet, A1–A4.
5. As a navigator, I still have exactly six nav items.

## Implementation Decisions

- `web/index.html` + `web/js/learn-levels.js` + `web/css/app.css` + DS assets already in worktree.
- `e2e/faces.spec.ts` F1–F7.
- Do not commit `scripts/hook_ds_chapters.py` or `node_modules`.
- Merge into master without leftover dirty `scripts/*.py` / `config/`.
- Stamp lockstep 0.16.19.

## Testing Decisions

- Playwright `e2e/faces.spec.ts` + rec-flow; live after deploy.
- Comet Product + rec-flow faces lines.
- Independent lockstep: `/VERSION` === chip === `js/site-version.js` === PLAYWRIGHT_LAST === comet Product.

## Acceptance Criteria

- [ ] Starter face: exact intro + `#panel-sub`; later cards hidden.
- [ ] Beginner: chapter Passphrase and entropy; Q1–Q4; Intermediate hidden.
- [ ] Intermediate: keys ≠ shares ≠ share-words; I1–I4; Advanced hidden.
- [ ] Advanced: master → child keys; not a wallet; A1–A4.
- [ ] 12-check not a fifth nav page; 6 nav items.
- [ ] DS chapter SVGs served from `'self'`.
- [ ] Reset intro exact; overlay first lines; (i) hover kept.
- [ ] Stamp 0.16.19 lockstep; Playwright + comet same ship.

## Out of Scope

- Reopening locked leftovers; other windows; inventing a fifth face; committing hook helper / node_modules; force-push.

## Grill-me

**Status:** complete
**Date:** 2026-08-20
**Source:** `/tmp/w6-faces-ship-brief.md` — Do NOT grill; all decisions locked.

### G1 Outcome
- Q: Done?
  - A: four faces live at next stamp (0.16.19).
  - Recommended was: four faces live at next stamp.

### G2 Non-goal / kill
- Q: Not build?
  - A: no reopen 0.16.18 hover / 0.16.17 overlays / 0.16.16 Reset / P0 / S85 / S98.
  - Recommended was: no reopen those leftovers.

### G3 Wrong product
- Q: Surface?
  - A: bip39lab worktree only (`/home/debian/bip39lab-faces-wip`).
  - Recommended was: bip39lab worktree only.

### G4 Cheapest alternative
- Q: Smallest?
  - A: index + learn-levels + CSS + local DS SVGs + PW/comet/stamps.
  - Recommended was: that set.

### G5 Abuse / failure
- Q: Fail?
  - A: 6 nav; 12-check not a page.
  - Recommended was: 6 nav; 12-check not a page.

### G6 Verify
- Q: Prove?
  - A: PW+comet+live curl.
  - Recommended was: PW+comet+live curl.

### G7 Priority
- Q: Why now?
  - A: this leftover now.
  - Recommended was: this leftover now.

## Clarifications

### 2026-08-20
- Q: Prefer which SVG names?
  - A: long canonical already hooked: starter-info, beginner-seed, intermediate-keys-shares, advanced-master-child.

## Handoff

- Next: follow NEXT_SKILL=
