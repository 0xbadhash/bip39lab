# CODE-REVIEW

command: `/code_review` 0.16.77 UC8 extra named txs
base: origin/master
secrets: clean

## Findings accepted
None.

## Findings rejected
- **v2-app.js already ≫ 1k lines.** Pre-existing. Decode helpers sit next to `paintTxInspect` / `PSBT_EX_TX`. Splitting a module this ship would mix a refactor with curriculum. Follow-up: extract inspect helpers later, not in this dual-stamp.

## P0 count
0

## Follow-ups
Optional extract of UC8 inspect helpers.

## Smoke
V2-S41 S41b S41c this session.

## Things that look bad but are actually fine
1. Dual stamp 0.16.77 vs 0.17.126-v2
2. leftover scripts uncommitted
3. Classroom snaps are not live chain bytes
4. innerHTML teachBox unchanged
