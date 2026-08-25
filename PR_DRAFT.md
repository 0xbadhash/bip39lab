# PR Draft: v0.16.50 V2 path language (gates, buttons, Continue in-path)

**Spec:** `.agents/specs/2026-08-25-v2-uc-path-language.md`
**Plan:** `.agents/specs/2026-08-25-v2-uc-path-language-plan.md`

## What Problem This Solves

Path audits found shorthand/`≠` Done when, generic in-track buttons, Hard refresh hidden in About, and Continue following global SUGGESTED instead of the current path.

## Why This Change Was Made

Operator asked a systematic UC pass (Keys → Watch → Custody → Shared → remaining) then `/code-review` … `/sync-docs` and compare.md refresh.

## User Impact

Chip **v0.17.62-v2**. Per-track gates; verb+object buttons; Continue next in path; Hard refresh beside Clear secrets. Classic `/` unchanged.

## Traceability

| AC | Test |
|----|------|
| AC-1: chip + Hard refresh | V2-S0 |
| AC-2: Continue Paper backup | V2-S2 |
| AC-3: GATES plain English | `tests/test_ac_v2_path_language.py` |
| AC-4: classic generate | V2-S0 |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts`

## Threat notes

- secrets: mnemonic not in sessionStorage
- xss: CSP connect-src none
- csrf: none

## Evidence pack

hard_gates; Playwright e2e/v2.spec.ts; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. leftover scripts stash not this ship
2. Dual stamp 0.16.50 vs 0.17.62-v2
3. lab-strip 404 under /v2/js
4. Finish checkbox still “will not send coins” on non-address tracks
5. `wantRail = true` on all PATHS including All paths view

## Cross-review

Blockers 0. Obsolete Tier A 0.
