# Behavior contract — V2 path language 0.17.62-v2

- **Product:** bip39lab
- **Target:** `http://127.0.0.1:4173/v2/`
- **Setup:** `python3 -m http.server 4173 --directory web`

## User tasks

1. As a user, I see Hard refresh next to Clear secrets without opening About.
   - **Expect:** `#v2HardRefresh` visible in top bar; chip `0.17.62-v2`
   - **Anti-cheat:** not hidden inside closed About `<details>`

2. As a user, I finish First wallet and Continue is Paper backup.
   - **Expect:** after Mark First wallet done, `#v2Continue` contains Paper backup
   - **Anti-cheat:** Hard refresh restores First wallet CTA

3. As a user, classic Lab still generates.
   - **Expect:** `/index.html` `#btnGenerate` visible
   - **Anti-cheat:** not the V2 page

## Must not

- Persist mnemonic in sessionStorage
- Offer Sign on UC8
- Force-push origin
