# CODE-REVIEW

- **command:** `/code_review` vs origin/master (uncommitted V2 path language)
- **base:** origin/master
- **head:** working tree (`web/v2/*`, `e2e/v2.spec.ts`)
- **secrets:** `python3 scripts/check_secrets_diff.py --base origin/master --head HEAD` clean. `sessionStorage` key `bip39lab.v2` stores progress/gates/dock only — not mnemonic/PP.
- **engine:** same session as implementer (no `CODE_REVIEW_MODEL`)

## Accepted P0

**none**

- Hard refresh is in `.topbar-actions` (not nested in closed `<details>`).
- UC8 inspect-only; no Sign control.
- Classic `/` not in this diff beyond VERSION at ship.

## Rejected

- Atom caption `Child ≠ parent` (UC30 viz) — teaching chip, not gate Done when. Follow-up.

## Follow-ups

- leftover `scripts/*.py` stash (not this ship)
- UC19 quiz still uses `Unknown ≠ 0`

p0=0 follow_ups=2

## Smoke

Playwright `e2e/v2.spec.ts` (this chain).
