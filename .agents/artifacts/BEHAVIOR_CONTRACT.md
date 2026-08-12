# Behavior contract — v0.16.2 polish ship

- **Product:** bip39lab offline BIP-39 lab  
- **Target:** https://bip39.catalyxt.xyz/ and local Playwright  
- **Setup:** static `web/` · no credentials  

## User tasks

1. As Intermediate learner, I can Go try I1 Multisig and see amber **Mark I1 passed & return**.  
   - **Expect:** dock visible with `?from=intquiz`  
   - **Anti-cheat:** dock not permanently hidden  

2. As mobile user (~390px), I can Generate and read addresses without the whole page scrolling sideways.  
   - **Expect:** `#tableScroll` contains overflow  
   - **Anti-cheat:** document scrollWidth ≈ viewport  

3. As a user on Shamir/SLIP-39/Network, I see status chips (offline or network opt-in + browser online).  

4. As a Comet agent, I can open live `/docs/E2E_COMET_SCENARIOS.md` with Product ≥ 0.16.1 and Extra help language.  

## Must not

- Accept WIF/xprv on Multisig  
- Silent combine under-threshold Shamir/SLIP-39  
- Treat Network mnemonic paste as address  
