# Plan: V2 UC1 generate chrome

- **Spec:** `.agents/specs/2026-08-23-v2-uc1-generate-chrome.md`
- **Product:** bip39lab
- **Created:** 2026-08-23
- **Status:** ready-for-agent

## Stack & constraints

Static `web/v2/`; reuse `bip39lab.bundle.js`. No new tokens. Classic `/` frozen.

## Approach

Edit `web/v2/js/v2-app.js` + `web/v2/index.html`. Word-count select 12–24. Clear secrets on Generate/Regenerate rows. Plain-English copy + hover (i). Regenerate reads select.

## File / surface map

| Area | Change |
|------|--------|
| `web/v2/index.html` | Drop sidebar Clear secrets |
| `web/v2/js/v2-app.js` | Select, copy, regenerate, clear |
| `e2e/v2.spec.ts` | V2-S4 |

## Testing plan

`npx playwright test e2e/v2.spec.ts`

## Risks

None beyond existing classic Playwright debt.
