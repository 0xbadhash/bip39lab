# CODE-REVIEW

command: `/code_review` 0.16.78 UC18 heir drill
base: origin/master
secrets: clean

## Findings accepted
None.

## Findings rejected
- **v2-app.js ≫ 1k lines.** Pre-existing. UC18 helpers sit next to the track. Extract later.

## P0 count
0

## Follow-ups
UC21 / UC24 / UC25 still lecture-thin (out of this ship).

## Smoke
V2-S51 passed this session.

## Things that look bad but are actually fine
1. Dual stamp 0.16.78 vs 0.17.127-v2
2. leftover scripts uncommitted
3. `ucJob` special-case like UC20
4. innerHTML static teach strings
