# Behavior contract — 0.16.46 UC15 layout + PP

- **Target:** `/v2/?uc=15`

## User tasks

1. First pad: dice, ~bits, lock, key on the right
2. Type 64 characters; field keeps them; counter 64/128
3. Estimate header does not require table rebuild (cells update)

## Must not

- Persist passphrase
- Treat PP as pad bits

## Evidence

- [x] V2-S16
