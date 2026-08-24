# Behavior contract — V2 UC11–UC13

- **Product:** bip39lab
- **Target:** `http://127.0.0.1:4173/v2/`
- **Setup:** `python3 -m http.server 4173 --directory web`

## User tasks

1. As a user, I see 13 use-case cards on `/v2/`.
   - **Expect:** UC11–UC13 titles visible; chip `0.17.22-v2`
   - **Anti-cheat:** `/` still shows Generate (classic Lab)

2. As a user, I can start UC11, walk two teaching pads, pass the quiz, force-exit.
   - **Expect:** Do/Do not present; quiz Wrong. on bad; Finish gated on checkbox
   - **Anti-cheat:** Finish disabled until checkbox

3. As a user, UC12/UC13 show three concept atoms; USB/air-gap and four objects appear in copy.
   - **Expect:** `#uc12Viz .atom` count 3; UC13 daily/savings callout
   - **Anti-cheat:** empty quiz Continue stays disabled until correct answer

## Must not

- Persist mnemonic in sessionStorage
- Change classic `/` Generate flow
- Treat exchange login as a BIP-39 wallet
