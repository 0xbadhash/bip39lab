# QA wave HTML escape + help-tip glyph lockstep

- **Product:** bip39lab
- **Created:** 2026-09-13
- **Status:** ready-for-agent
- **Priority:** P0
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** `.agents/specs/2026-09-13-qa-wave-html-escape-fsm-plan.md`
- **Tracker:** local
- **Constitution:** AGENTS.md
- **Grill-me:** complete

## Problem Statement

The 2026-09-13 QA campaign found display HTML sinks that skipped `escapeHtml` (copy rows, addresses, glossary tips) and docs still saying 0.16.87. The (i) glyph must stay card-sized with wrapping overlay. These fixes must ship lockstep on live bip39.catalyxt.xyz.

## Solution

Public copy/address/tip text is escaped. Product VERSION patch + V2 chip bump. Help-tip visual 1.25rem, host ≥44px, panel wraps. Live chip matches VERSION.

## User Stories

1. As a learner, I hover (i) and the description wraps in a small circle, not a 44px disc.
2. As a practitioner, pasted/derived strings cannot break the pad HTML.
3. As an operator, the visible chip equals VERSION after deploy.

## Implementation Decisions

- Dual stamp: product `0.16.x` vs V2 `0.17.N-v2`.
- No new bug hunt. No reopen held PASSes.
- Leftover `scripts/*.py` uncommitted. No force-push. Do not call Bob.

## Testing Decisions

- pytest `test_qa_v2_hardening.py` (escape + glyph CSS)
- Playwright V2-S1 glyph/wrap + S186 host ≥44px (same ship)
- green_cmd pytest; product smoke at release

## Acceptance Criteria

- [ ] AC-1: `copyQrRowHtml` uses `escapeHtml` for label and value text nodes
- [ ] AC-2: `addrHtml` uses `escapeHtml(addr)` in `.addr-text`
- [ ] AC-3: `termI`/`inlineI` escape title/short/body; aria uses `attrEsc`
- [ ] AC-4: `.help-tip-btn` visual `1.25rem`; `.help-tip` min 44px; panel `white-space: normal`
- [ ] AC-5: VERSION === site-version.js === comet Product === PLAYWRIGHT_LAST === visible chip
- [ ] AC-6: pytest + V2-S1/S186; no secrets; no VERSION skip of Playwright

## Out of Scope

- New QA hunt; reopen 2026-09-02 PASSes
- Call Bob / live rec-flow
- Sign, Electrum KDF, UC19 P3 mempool, Imagine
- Force-push; leftover scripts commit
- w8 Card / w0 residuals / Family PIN

## Grill-me

**Status:** complete
**Date:** 2026-09-13
**Mode:** `--from-conversation` (CEO STAMP 2026-09-13 FULL SHIP FSM + BRIEF-W6-QA-FULL-SHIP)

### G1 Outcome
- Q: What does done look like?
  - A: QA HTML escapes and card-sized (i) are on live bip39.catalyxt.xyz; chip equals bumped VERSION; scorecard five lines; Bob not called.
  - Recommended was: same (CEO stamp).

### G2 Non-goal / kill
- Q: What must we not build?
  - A: No new hunt, no reopen held residuals, no Bob, no force-push, no secrets, no Sign.
  - Recommended was: fail closed on secrets.

### G3 Wrong product
- Q: Which repo?
  - A: `/home/debian/bip39lab` only (window 6).
  - Recommended was: this product.

### G4 Cheapest alternative
- Q: Smallest ship?
  - A: Commit QA + help-tip, patch VERSION, stamp comet/Playwright, deploy, scorecard.
  - Recommended was: single vertical slice + smoke.

### G5 Abuse / failure
- Q: How does this fail?
  - A: Unescaped innerHTML XSS; oversized (i); chip/VERSION mismatch. Fail closed; practice only.
  - Recommended was: fail closed on secrets.

### G6 Verify
- Q: How prove?
  - A: pytest QA tests; Playwright V2-S1 and S186; lockstep files; live chip curl.
  - Recommended was: plugin smoke + one path.

### G7 Priority / delay
- Q: Why now?
  - A: CEO stamp FULL SHIP FSM for QA wave; Boss scorecard after live chip green.
  - Recommended was: P0 (operator stamp).

## Clarifications

- Dual stamp product vs V2 chip is intentional.
- E2E was deferred during QA; this ship bumps VERSION so Playwright + comet update together.
- Help-tip CSS was already in the working tree from the card-size request.

## Further Notes

Constitution: no retention; no eval; no force-push.

## Handoff

- Next: `/execute_dev`
- Then: `/code_review` → `/pr_review --validate` → `/release_mgmt` → `/sync_docs`
