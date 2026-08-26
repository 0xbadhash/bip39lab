# CODE-REVIEW

- **command:** `/code_review` vs origin/master (working tree UC3 live compare)
- **base:** origin/master
- **head:** working tree then release commit
- **secrets:** `check_secrets_diff` (see run)
- **engine:** same session (no CODE_REVIEW_MODEL)

## Accepted P0

1. **in_scope_blocker (fixed):** V2-S0 asserted chip `0.17.76-v2` while `index.html` is `0.17.78-v2`. Corrected the Playwright regex so S0 matches the chip.

## Rejected

- innerHTML for labels: not present; painters use `textContent`.
- Delegated input on document: intended so re-renders do not drop listeners.

## Follow-ups

- leftover `scripts/*.py` stash
- untracked photoreal `web/v2/assets/uc*-atom-*.png`
- lab-strip 404

p0=0 follow_ups=3

## Smoke

Playwright `e2e/v2.spec.ts` after chip fix.
