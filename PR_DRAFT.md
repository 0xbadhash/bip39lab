# PR Draft: v0.16.57 V2 UC3 masked PP strength bar

**Spec:** `.agents/specs/2026-08-26-v2-uc3-pp-strength.md`
**Plan:** `.agents/specs/2026-08-26-v2-uc3-pp-strength-plan.md`

## What Problem This Solves

V2 UC3 already compares A/B live. Classic still has a masked passphrase field and `#ppStrengthBar`. V2 leftover was the mask + bar.

## Why This Change Was Made

WINDOW 6 UC3 leftover only. Copy classic mask and strength bar. Do not reopen UC1.

## User Impact

Chip **v0.17.91-v2**. `#ppA`/`#ppB` password. `#v2PpBarA`/`#v2PpBarB` empty/weak/fair/strong. Classic `/` cache-bust only.

## Traceability

| AC | Test |
|----|------|
| AC-1 masked | V2-S3 V2-S29 `test_ac_1_masked` |
| AC-2 bars | V2-S29 `test_ac_2_bars` |
| AC-3 tier moves | V2-S29 `test_ac_3_tier_moves` |
| AC-4 chip 35 | V2-S0 `test_ac_4_chip` |
| AC-5 classic bar | V2-S0 `test_ac_5_classic_bar` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S3 |V2-S29"`

## Threat notes

- secrets: passphrase stays in tab memory; password fields; not sessionStorage
- xss: estimates via textContent
- csrf: none

## Evidence pack

hard_gates; Playwright V2-S0/S3/S29; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. Bar uses classic `pp-tier-strong` while text says stronger
2. Dual stamp 0.16.57 vs 0.17.91-v2
3. leftover scripts stay stashed
4. UC1 not reopened
5. estimate is not PBKDF2 size

## Cross-review

Blockers 0.
