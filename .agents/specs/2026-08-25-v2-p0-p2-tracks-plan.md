# Plan: V2 P0–P2 tracks

**Spec:** `.agents/specs/2026-08-25-v2-p0-p2-tracks.md`

## Approach

Extend `TRACKS`, `stepsFor`, `conceptsFor`, `VIZ` (reuse UC2/6/8/3/4/5/7 atoms), `stepHtml` via `ucJob(16..31)`. sessionStorage still progress + dock only.

## Implementation

1. Spec + failing Playwright (S0 count 31, chip 0.17.47-v2, V2-S17–S20).
2. TRACKS 16–31, pads, quizzes, wire; CSS bins/restore; index picker copy; boot `n<=31`.
3. compare.md shipped table; Comet + plugin surfaces; stamp 0.16.47 / 0.17.47-v2.
