# V2 UC1 compact card + entropy by word count

- **Product:** bip39lab
- **Created:** 2026-08-23
- **Status:** ready-for-agent
- **Priority:** P0
- **Roadmap:** ROADMAP.md
- **Plan:** none
- **Tracker:** local
- **Constitution:** AGENTS.md
- **Grill-me:** complete
- **Surface:** `web/v2/` UC1 (classic `/` unchanged)

## Problem Statement

On a 1920-pixel-wide laptop, UC1 24-word cards are too tall/wide, Validate and derive hides addresses below the fold, addresses stack one per line, and the learner never sees entropy bits for 12 vs 15 vs 18 vs 21 vs 24 words — so they do not know why length changed.

## Solution

Four words per line on the numbered card; on a 1920-class laptop 24 words occupy three lines (eight cells per row). After Validate, at least three receive addresses sit on one row so they appear without scrolling. Show BIP-39 entropy bits for the selected length in full sentences.

## User Stories

1. As a learner on 1920px, I want a compact 24-word card (three lines) so Validate still shows addresses.
2. As a learner, I want at least three addresses on one row after derive.
3. As a learner, I want to see that 12 words are 128 bits and 24 words are 256 bits.

## Implementation Decisions

- Word grid: 4 columns as the minimum row; from ~1100px width use 8 columns so 24 words = 3 rows.
- Address layout: CSS grid min 3 columns after derive (still 5 addresses total unless already 5).
- Entropy line: `128/160/192/224/256 bits (N-word BIP-39)` matching classic Lab, shown on Generate, card, Validate, regenerate. No contractions.
- Compact Validate stack: keep words + seed strip + addresses in one laptop viewport (no extra essay).
- Classic `/` unchanged.

## Testing Decisions

Playwright V2-S9: 24-word grid computed columns 8 at 1920×1080; 3 rows; after derive address cells ≥3 in first row (same y); entropy contains 256 bits; 12-word shows 128 bits.

## Acceptance Criteria

- [ ] Numbered card: 4 words per line on narrow; 24 words = 3 lines at 1920px
- [ ] Validate and derive: addresses visible without vertical scroll at 1920×1080
- [ ] At least 3 addresses on one line
- [ ] Entropy bits visible and change with 12/15/18/21/24
- [ ] Words + seed strip still on Validate
- [ ] e2e V2-S9 + existing V2-S1/S4

## Out of Scope

Classic Lab strip paint; BIP44/86 tables; new tokens.

## Grill-me

**Status:** complete  
**Date:** 2026-08-23  
Operator `/spec` text locked G1–G7.

### G1 Outcome
- Q: Done when?
  - A: 24-word card is three lines on a 1920 laptop; addresses appear without scroll, three on a line; entropy bits show for each length.
### G2 Non-goal
- Q: Not build?
  - A: Do not drop the seed strip. Do not change classic `/`.
### G3 Wrong product
- A: V2 UC1 only.
### G4 Cheapest
- A: CSS grid + entropy line in v2-app.js.
### G5 Abuse
- A: Still practice-only; no funded claims.
### G6 Verify
- A: Playwright 1920×1080 V2-S9.
### G7 Priority
- A: P0 — learner cannot see addresses or entropy now.

## Clarifications

- Q: 4 per line vs 24 words / 3 lines?
  - A: Four per line on small screens; eight per line at laptop width so 24 words = 3 rows.

## Handoff

Next: `/execute_dev`
