# BEHAVIOR-REPORT

| ID | Result | Evidence |
|----|--------|----------|
| AC-1 | pass | V2-S51 four kits + fail lines |
| AC-2 | pass | V2-S51 Packet OK after keys+three ticks |
| AC-3 | pass | live blocked until fail; then msg-ok |
| AC-4 | pass | chip 0.17.127-v2; quiz in spec |
| AC-5 | pass | git status no leftover scripts staged |

**summary:** Playwright V2-S51 vs 4173.

## Things that look bad but are actually fine
1. Dual stamp
2. Live try needs previous pad packed flag
3. No Sign
