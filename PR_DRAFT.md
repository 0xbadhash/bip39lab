# PR Draft: v0.16.49 UC2 passphrase pad copy + example

**Spec:** `.agents/specs/2026-08-25-v2-uc2-pp-example.md`
**Plan:** `.agents/specs/2026-08-25-v2-uc2-pp-example-plan.md`

## What Problem This Solves

UC2 stacked the same backup lesson three times in mismatched type, with no passphrase example.

## Why This Change Was Made

Operator asked to align fonts, drop repetition, and provide a generated practice example.

## User Impact

Chip **v0.17.54-v2**. Do / Do not stay. Example four-word PP + Generate another. Classic `/` unchanged.

## Traceability

| AC | Test |
|----|------|
| AC-1: example + generate | V2-S8 |
| AC-2: no real-money repeat, no mnemonic line | V2-S8 |
| AC-3: N/A — chip + compare.md docs |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S8"`

## Threat notes

- secrets: example is practice words in DOM/`mem.ppExample` only; not sessionStorage
- xss: CSP connect-src none
- csrf: none

## Evidence pack

hard_gates; Playwright V2-S8; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. leftover scripts stash
2. Dual stamp 0.16.49 vs 0.17.54-v2
3. lab-strip 404
4. Example uses first four words of a generated mnemonic joined with `-`
5. (i) BIP-39 help remains on Generate, not this pad

## Cross-review

Blockers 0. Obsolete Tier A 0.
