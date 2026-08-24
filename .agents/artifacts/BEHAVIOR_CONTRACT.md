# Behavior contract — V2 UC1/UC2 viz + toolbar

- **Product:** bip39lab
- **Target:** `http://127.0.0.1:4173/v2/`

## User tasks

1. UC1 strip shows three atoms; after Validate, phrase≠address is `hi`.
2. Addresses: `#n` beside `tb1q`, three pairs on first row.
3. Generate: BIP-39 (i) beside Generate; Clear secrets on the right.
4. UC2 strip three atoms; Print pad atom 3 `hi`.
5. UC2 quiz: one right click does not say “Select both right sentences (2 and 3)”; wrong still explains.

## Must not

- Persist mnemonic in sessionStorage
- Replace the numbered word grid with atoms
