# Plan: Multisig explainer

- **Spec:** `.agents/specs/2026-08-06-multisig-explainer.md`

## Approach

1. `web/js/multisig-core.mjs` — pure functions: parse pubs, sort BIP67, redeem script, p2sh, p2wsh.
2. Bundle `web/js/multisig.bundle.js` via esbuild (reuse hash160/bech32 from small shared or duplicate minimal).
3. `web/multisig.html` + `web/js/multisig-app.js` + shared CSS; Lab sidebar link Multisig.
4. Lab `index.html` nav + About cross-link.
5. Tests: node pure vectors + static asset checks.
6. ROADMAP DONE entry; release notes.
