# V2 path language: gates, verb+object buttons, Continue in-path

- **Product:** bip39lab
- **Created:** 2026-08-25
- **Status:** ready-for-agent
- **Priority:** P0
- **Plan:** `.agents/specs/2026-08-25-v2-uc-path-language-plan.md`
- **Surface:** `web/v2/` UC1–UC31 gates + in-track pause/primary labels; picker Continue

## Problem Statement

Forensic path audits (Keys/Watch/Custody/Shared + leftover Over time/Advanced) found gate Done when as shorthand/`≠`, generic in-track buttons, and Continue following global SUGGESTED instead of the current path.

## Solution

Per-track `GATES` Is/Is not/Done when in full sentences. Verb+object primaries and Next pauses. Continue = next incomplete UC in the current path. Hard refresh stays in the top bar next to Clear secrets. Classic `/` unchanged. Dual stamp: product `0.16.50` vs V2 chip `0.17.62-v2`.

## Acceptance

| ID | Criterion |
|----|-----------|
| AC-1 | Chip `0.17.62-v2`; `#v2HardRefresh` visible in `.topbar-actions` without opening About |
| AC-2 | After Mark First wallet done, Continue is Paper backup (Start here path) |
| AC-3 | `GATES` exists for UC1–UC31; Done when strings do not use `≠` |
| AC-4 | Classic `/` still shows `#btnGenerate` |

## Grill-me

Q: Did we persist the mnemonic?
A: No. sessionStorage is progress only.

Q: Does UC8 sign?
A: No. Inspect sample only.

Q: Classic Lab stamp?
A: Product `0.16.50`; V2 chip is `data-v2-version`, not `stamp_site_version.py`.

## Testing Decisions

- V2-S0 chip + Hard refresh visible
- V2-S2 Mark done → Paper backup → Hard refresh → First wallet
- Pytest AC stubs AC-1–AC-4
