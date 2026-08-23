# CODE-REVIEW

**Scope:** V2 UC1 compact grid + entropy (`.agents/specs/2026-08-23-v2-uc1-compact-entropy.md`)
**Date:** 2026-08-23

## P0
None.

## In scope
- Word grid: 4/line narrow, 8/line ≥1100px (24 words = 3 lines at 1920)
- Address grid: 3 per line
- Entropy 128/160/192/224/256 bits by word count
- Seed strip kept on Validate

## Tests
`npx playwright test e2e/v2.spec.ts` — 9 passed (V2-S9)

p0=0 follow_ups=0
