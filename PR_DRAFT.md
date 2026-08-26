# PR Draft: v0.16.51 V2 UC20 materials, custody kit, ack overlay

**Spec:** `.agents/specs/2026-08-26-v2-uc20-kit.md`
**Plan:** `.agents/specs/2026-08-26-v2-uc20-kit-plan.md`

## What Problem This Solves

UC20 was too thin. V2 lacked the classic is/isn’t overlay. UC3 had two generate buttons and a full-width compare dump. Track pictures were photoreal slop.

## Why This Change Was Made

Operator asked UC20 materials lab, Catalyxt custody kit, ack overlay, UC3 generate/compare layout, then the ship chain.

## User Impact

Chip **v0.17.75-v2**. Ack on first visit. UC20 Next gated. Random 12-word 4-letter plate. Kit sheet at `/assets/catalyxt/custody/`. Classic `/` unchanged.

## Traceability

| AC | Test |
|----|------|
| AC-1 overlay | V2-S0 |
| AC-2 chip | V2-S0 |
| AC-3 UC3 one generate | V2-S3 |
| AC-4 classic Generate | V2-S0 |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts`

## Threat notes

- secrets: no mnemonic in sessionStorage
- xss: CSP connect-src none
- csrf: none

## Evidence pack

hard_gates; Playwright e2e/v2.spec.ts; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. leftover scripts stash
2. Dual stamp
3. lab-strip 404
4. Uncommitted photoreal PNGs not shipped
5. Hairline SVGs as `<img>` do not inherit currentColor — sheet uses `<object>`

## Cross-review

Blockers 0. Obsolete Tier A 0.
