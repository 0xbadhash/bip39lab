# Plan: Phase 7 — table + Option A

- **Spec:** `.agents/specs/2026-08-06-phase-7-address-table-derivation-a.md`
- **Status:** ready-for-agent

## Approach

1. `build-entry.mjs`: bech32m + BIP86 p2tr; derive rows with bip86; options account/change/count (max 20).
2. Rebuild `bip39lab.bundle.js`.
3. `index.html`: table shell + controls; CSS nowrap + min-width columns.
4. `app.js`: fill `<tbody>`; wire controls; drop ASCII formatter.
5. Tests: web vector BIP86 + table markup present.
6. ROADMAP: DONE phase 7; OPEN B and C.

## BIP86 note

Key-path only tweak: tagged hash `TapTweak` over x-only internal key; bech32m HRP `bc` witver 1.
