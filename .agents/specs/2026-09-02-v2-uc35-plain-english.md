# V2 UC35 same words, wrong app (plain English)

- **Product:** bip39lab
- **Created:** 2026-09-02
- **Status:** ready-for-agent

## Problem

UC35 title “Electrum-looking words” and “stretch” copy were jargon. Learners could not tell what the exercise is.

## Solution

Plain English: same 12 English words can be Electrum, not BIP-39. Restore in the wrong app → different wallet. Illustration left of the blue classroom box. Lab still does not run Electrum.

## Approach / Architecture / Implementation

1. Rewrite UC35 title, job, gate, pad, quizzes. SVG atom + `[image][blue box]` on steps 0–1.
2. Keep button ids and e2e: wrong vault + does not run Electrum.
3. Cache-bust `v2-app.js?v=0.17.136-v2`.

## Acceptance Criteria

- AC-1: Title and classroom say same words / two apps / wrong wallet in plain English
- AC-2: Pad shows illustration left of blue teach box (`uc35-atom-same-words-two-apps.svg`)
- AC-3: Playwright V2-S26 still passes (BIP-39 tb1 + Electrum trap copy)

## Out of Scope

- Computing a real Electrum address
- Catalyxt marketing site
