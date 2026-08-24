# Behavior contract — V2 Clear secrets + Network

- **Product:** bip39lab
- **Target:** `/v2/`
- **Setup:** `python3 -m http.server 4173 --directory web`

## User tasks

1. Clear secrets is visible in the top-right on picker and tracks, not in the sidebar.
2. Validate & Derive has Test / Mainnet. Default addresses start `tb1`. Mainnet starts `bc1`.
3. Classic `/` still has Generate.

## Must not

- Persist mnemonic in sessionStorage
- Put Clear secrets in the left nav
