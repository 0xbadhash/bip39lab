# Plan: V2 Clear secrets + Network select

**Spec:** `.agents/specs/2026-08-24-v2-clear-net.md`

## Approach

Move `#v2Clear` to `index.html` topbar; bind once in `boot`. UC1 Validate row: `#v2Derive` + `#v2Net`. `mem.network` test|main; `deriveNow()` uses BIP39Lab.deriveAddresses.

## Implementation

1. Topbar Clear secrets; remove per-pad `#v2Clear` duplicates.
2. `#v2Net` Test/Mainnet beside Validate & Derive; re-derive on change; V2 `0.17.23-v2`.
3. e2e V2-S0 topbar clear; V2-S4 tb1 then bc1; Comet blurb.
