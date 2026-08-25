# CODE-REVIEW

- **command:** `/code_review` vs origin/master (working tree)
- **secrets:** no new secrets; PP stays in memory only
- **engine:** same session

## Accepted P0

**none**

- Passphrase textarea maxlength 128; not persisted to sessionStorage.
- Estimate table updates cells in place (no outerHTML rebuild).
- CSP unchanged.

## Follow-ups

- leftover `scripts/*.py` stashed
- lab-strip 404
- classic full e2e not V2 gate

p0=0 follow_ups=3

## Smoke

Playwright V2-S0 + S16 (pre-full-suite in this pass)
