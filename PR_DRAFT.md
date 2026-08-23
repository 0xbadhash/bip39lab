# PR Draft: v0.16.36 V2 UC1 compact/entropy + UC2 colour callouts

**Spec:** `.agents/specs/2026-08-23-v2-uc1-compact-entropy.md`
**Plan:** `.agents/specs/2026-08-23-v2-uc1-generate-chrome-plan.md`
**Also:** UC2 paper-backup readability (gate + do/do-not colour; print is not air-gap)

## What Problem This Solves

UC1 24-word cards and stacked addresses forced scroll on 1920px laptops, and entropy bits were invisible. UC2 gate and Do/Do-not were a grey wall of text; print looked as safe as an air-gap.

## Why This Change Was Made

Operator asked compact grids, entropy by word count, coloured UC2 callouts, and a quiz that print+photo are not the most secure.

## User Impact

V2 UC1: 8 words per line at laptop width (24 = 3 lines), 3 addresses per row, entropy 128–256 bits. UC2: green/red/blue callouts; print warning; quiz prefers handwritten offline copy.

## Traceability

| AC | Test |
|----|------|
| Compact 24-word 3 lines, 3 addresses, entropy | V2-S9 |
| UC2 colour gate + do/do-not + print not air-gap + quiz | V2-S8 |
| Classic `/` still Lab | V2-S0 |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts`
- TDD: V2-S9 and V2-S8 went green after layout and callout HTML.

## Threat notes

- secrets: no mnemonic in sessionStorage
- xss: CSP connect-src none on /v2/
- csrf: none

## Evidence pack

- hard_gates / pr_validator
- smoke: `npx playwright test e2e/v2.spec.ts` (9 passed)
- pytest: `python -m pytest -q`

## Things that look bad but are actually fine

1. Full classic Playwright suite is still not all-green (pre-existing).
2. Harness `scripts/*.py` stay uncommitted.
3. Tag is `v0.16.36` because `v0.16.35` already shipped.
4. V2 footer remains `0.17.0-v2` (parallel surface stamp).
