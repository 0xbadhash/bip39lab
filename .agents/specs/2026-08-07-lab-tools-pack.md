# Lab tools pack — offline teaching features

- **Product:** bip39lab
- **Created:** 2026-08-07
- **Status:** ready-for-agent → ship
- **Priority:** P1
- **Roadmap:** ROADMAP.md → Lab tools pack
- **Constitution:** AGENTS.md

## Problem

Users need richer offline teaching tools (paths, entropy, descriptors, PSBT literacy, backup, theme, airgap) without network or secret retention. Multisig needs clearer policy/checklist UX. Network needs UTXO/fee education and Knots guidance.

## Solution (MVP pack — one ship)

### High fit
1. Path playground — live m/purpose'/coin'/account'/change/index
2. Seed QR — offline QR of mnemonic (explicit warning)
3. Descriptor export — output descriptor text from watch-only export
4. PSBT inspector — educational parse only (no sign/broadcast)
5. Entropy quality — dice/coin pad → hex entropy preview
6. Compare two passphrases — side-by-side first address
7. Mainnet/testnet toggle — coin_type + address HRP/version
8. Printable backup sheet — print CSS + button

### Medium fit
9. My node (Knots) balance docs — CLI + tunnel notes
10. Fee estimator polish — example costs for bands
11. UTXO education card
12. Lab → Network handoff button (session addresses)

### Multisig advanced
13. BIP67 sort vs unsorted address demo
14. Policy readout (M-of-N plain English)
15. Cosigner checklist
16. Descriptor paste education (explain fields; refuse secrets)

### UX / trust
17. Threat model panel expansion
18. Airgap / online badge
19. Keyboard shortcuts (documented)
20. Light/dark theme toggle (localStorage theme only — no secrets)
21. EN only (no i18n) — explicit

## Non-goals
- Bulk seed balance farming
- Signing / broadcasting
- RPC credentials in browser
- Secret retention beyond optional theme preference

## Acceptance
- [ ] All surfaces offline CSP except Network
- [ ] Playwright S14+ for new tools
- [ ] Comet scenarios S14–S16 updated
- [ ] pytest green

## Smoke
`pytest` · `npx playwright test` · live network optional
