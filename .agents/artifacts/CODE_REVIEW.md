# CODE-REVIEW

- **command:** `/code_review` vs origin/master (working tree → 0.16.48)
- **secrets:** Hard refresh removes `bip39lab.v2` progress only; no mnemonic in sessionStorage
- **engine:** same session

## Accepted P0

**none**

- CSP unchanged (`connect-src 'none'`).
- Progress store vs Clear secrets are separate controls.
- Copy on practice addresses is in-tab only (execCommand), not a network leak.

## Follow-ups

- leftover `scripts/*.py` stashed
- lab-strip 404
- classic full e2e not V2 gate
- cookie wipe on Hard refresh is best-effort path=/ and /v2/

p0=0 follow_ups=4

## Smoke

`npx playwright test e2e/v2.spec.ts -g "V2-S0|V2-S1|V2-S2"`
