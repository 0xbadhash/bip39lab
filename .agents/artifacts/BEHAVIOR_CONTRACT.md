# Behavior contract — V2 UC3 live compare

- **Product:** bip39lab
- **Target:** `/v2/?uc=3` (static lab)
- **Setup:** `python3 -m http.server` or Playwright webServer

## User tasks

1. As a user, I generate a phrase and open Compare empty vs a test secret.
   - **Expect:** three columns — key still, A/B fields, results.
   - **Anti-cheat:** A and B visible without Compare.

2. As a user, I type in B (`test`) and A (26 letters).
   - **Expect:** passphrase row updates char counts; receive cells become tb1.
   - **Anti-cheat:** do not require Compare for estimates.

3. As a user, I click Compare A vs B when addresses differ.
   - **Expect:** diverged verdict; Next can enable.
   - **Anti-cheat:** same passphrase should not claim two wallets.

## Must not

- Persist mnemonic in sessionStorage
- Fund practice addresses
- Change classic `/` generate
