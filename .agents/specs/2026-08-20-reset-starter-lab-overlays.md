# Reset to Starter intro + three Lab action overlays

- **Product:** bip39lab
- **Created:** 2026-08-20
- **Status:** ready-for-agent
- **Priority:** P1
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** none
- **Tracker:** local
- **Constitution:** AGENTS.md
- **Grill-me:** complete

## Problem Statement

Reset progress does not return the learner to the lab intro at Starter. Generate, Validate & derive, and Clear secrets fire immediately with no distinct in-page overlay, so the click is easy to miss or confuse with native confirms.

## Solution

Reset classroom progress sets Level to Starter, lands on the Offline BIP-39 lab intro with the exact receive-addresses subtitle, and toasts that level is Starter. Generate / Validate & derive / Clear secrets each open their own overlay; Continue runs the existing action; Cancel does not. P0 Generate-replace native confirm still runs after the Generate overlay when a phrase already exists.

## User Stories

1. As a learner who finished Intermediate, I Reset progress so I am back on the Offline BIP-39 lab intro at Starter.
2. As a learner, I press Generate and see a Generate-only overlay about a practice phrase before anything is minted.
3. As a learner, I press Validate & derive and see a Derive-only overlay about filling receive addresses offline.
4. As a learner, I press Clear secrets and see a Clear-only overlay that says Lab memory is emptied, not a wallet wipe.

## Implementation Decisions

- Surfaces: Lab `index.html` intro (`#panel-title`, `#panel-sub`), `#btnResetClassroom`, `#btnGenerate`, `#btnDerive`, `#btnClear`.
- Three overlays: `#overlayGenerate`, `#overlayDerive`, `#overlayClear` — not one generic modal, not native `confirm` for these three.
- P0 walls stay after Generate overlay (S80).
- Do not reopen 0.16.6–0.16.15 locked PASSes listed in the ship brief.

## Testing Decisions

- Playwright + comet same ship; rec-flow: form, results, missing-data, next-step, plain English, mobile, errors.
- Helper: click button → Continue on **its** overlay so existing generate/clear/derive tests keep working.
- Commands: `npm run test:e2e` (focused S-ids) + stamp scripts.

## Acceptance Criteria

- [ ] `#panel-sub` HTML is exactly: `Generate, validate, and derive receive addresses — English wordlist only.`
- [ ] Reset from Intermediate (or leftover level) sets `#learnLevel` and `data-level` to `starter`, lands `#panel-title` + `#panel-sub` in view, toast does not say Level unchanged.
- [ ] Three overlays with unique ids and obviously different copy matching Generate / derive / clear intents.
- [ ] Continue runs the existing action; Cancel/Dismiss does not.
- [ ] S80: native “Generate will replace the current phrase in this tab. Continue?” still after Generate overlay Continue when mnemonic is non-empty.
- [ ] S81 empty derive still missing-data after overlay Continue.
- [ ] S85/S89/P0 still hold; mempool fail-fast still holds.
- [ ] Stamps lockstep 0.16.16: `/VERSION` === `js/site-version.js` === HTML chip === PLAYWRIGHT_LAST === comet Product.

## Out of Scope

- Other products / windows
- Replacing S80/QR/Print walls with overlays
- Reopening First Hour leftover PASSes, I1 unless live-broken, Compare/isolation/empty-length Validate
- Dirty leftover `scripts/*.py` and `config/` not part of this ship
- Force-push; `origin/main`

## Grill-me

**Status:** complete
**Date:** 2026-08-20
**Note:** Operator forbade grill/interview (`Do NOT grill`). Brief treated as complete answers; recommended defaults applied and logged.

### G1 Outcome
- Q: What does done look like?
  - A: Reset returns to Offline BIP-39 lab intro at Starter with the exact receive-addresses subtitle; three distinct overlays gate Generate / Derive / Clear.
  - Recommended was: that same outcome from the brief.

### G2 Non-goal / kill
- Q: What must we not build?
  - A: No generic shared modal; no replacing P0 native walls; no other products; no reopening locked PASSes.
  - Recommended was: G2 default + brief out-of-scope.

### G3 Wrong product
- Q: Wrong surface?
  - A: Window 6 / bip39lab / live catalyxt only. Practice lab.
  - Recommended was: bip39lab only.

### G4 Cheapest alternative
- Q: Smallest ship?
  - A: Reset + three overlays + Playwright/comet/stamp 0.16.16 as specified. No extra chrome.
  - Recommended was: single vertical slice.

### G5 Abuse / failure
- Q: Failure modes?
  - A: Cancel must not run the action. Clear overlay must say Lab memory only, not wallet wipe. P0 replace-confirm still after Generate overlay. Fail closed on secrets.
  - Recommended was: fail closed; no silent data loss.

### G6 Verify
- Q: How prove?
  - A: Playwright Reset-from-Intermediate; three overlay ids/copy; Continue vs Cancel; S80 after overlay; S81 after overlay Continue; S85/S89/P0 still pass; comet same ship.
  - Recommended was: smoke + one manual path.

### G7 Priority
- Q: Why now?
  - A: Operator ship leftover now; stamp 0.16.16.
  - Recommended was: P1 unless user said P0 — brief is this leftover ship (treat as current P1 ship).

## Clarifications

### 2026-08-20
- Q: Native confirm for Reset?
  - A: Brief only forbids native confirm for the three button overlays. Reset may drop native confirm or keep it; required behavior is setLevel starter + land on intro. Default: no native confirm on Reset; run reset immediately after click (Reset is the intent). If existing confirm remains, after OK still must setLevel starter. **Chosen:** remove `window.confirm` from Reset so it always returns to Starter intro.
- Q: Overlay Continue vs S80 order?
  - A: Overlay first, then existing onGenerate including S80 native confirm if mnemonic non-empty.

## Further Notes

- `site-version.js` lives at `js/site-version.js`.
- Release branch `origin/master`. No `--force`. Do not stage leftover dirty scripts.

## Handoff

- Next: `/execute_dev`
```
