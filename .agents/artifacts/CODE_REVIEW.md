# CODE-REVIEW

command: `/code_review` 0.16.75 bundle
base: origin/master
head: working tree → HEAD
secrets: clean

## Findings accepted
None.

## Findings rejected
None.

## P0 count
0

## Follow-ups
Live nginx sites-available was missing `/v2/` (fixed on host). Keep deploy conf and live conf in sync.

## Smoke
V2-S41b S43 S47 S48 S49 S50 previously green this session.

## Things that look bad but are actually fine
1. Dual stamp
2. leftover scripts
3. mempool.space on V2 CSP by operator request
