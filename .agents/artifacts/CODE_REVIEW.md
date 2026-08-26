# CODE-REVIEW

- **command:** `/code_review` vs origin/master
- **base:** origin/master
- **head:** working tree (V2 UC20 kit, ack, UC3)
- **secrets:** `check_secrets_diff` clean. sessionStorage: progress + `ack` only.
- **engine:** same session

## Accepted P0

**none**

Hard refresh now `location.replace(pathname)` so `?uc=` does not reopen a gated track after wipe.

## Follow-ups

- leftover scripts stash
- unused local `web/v2/assets/uc16-atom-*.png` / `uc20-atom-*.png` not shipped (photoreal ban)
- lab-strip 404 under /v2/js

p0=0 follow_ups=3

## Smoke

Playwright `e2e/v2.spec.ts` (S2/S13 re-run after ack + hard-refresh URL fix).
