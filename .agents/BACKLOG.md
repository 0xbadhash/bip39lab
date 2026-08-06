# Harness backlog (product-local)

## Done

- [x] Install agent-harness portable skills + scripts
- [x] product_plugin.yaml (python + security domain hints)
- [x] ROADMAP phases 0–3 with full FSM + `/spec` (tags v0.1.0–v0.4.0)
- [x] Phase 4 bitcoind address-only balance (`v0.5.0`)
- [x] Phase 5 Catalyxt web + bip39.catalyxt.xyz + mempool backend (`v0.6.0` lineage)
- [x] Phase 6 entropy fields (`v0.6.0`)
- [x] Phase 7 address table + Option A derivation BIP86 (`v0.7.0`)
- [x] v0.7.1 table polish (copy, optional legacy cols, plain help)
- [x] GitHub repo `0xbadhash/bip39lab` + CI + MIT LICENSE

## Next (product) — see ROADMAP.md

- [x] **Option B** — Watch-only xpub/zpub + offline QR (`v0.8.0`)
- [ ] **Option C** — Network page (fees / traffic / balances) **P0 / Next**  
  Spec: `.agents/specs/2026-08-06-option-c-network-tab.md` → `/execute_dev`
- [ ] Electrum server backend (address-only) — future
- [ ] Dice / hex / binary entropy UI — future
- [ ] Remove unused `web/js/crypto-core.js` if still unreferenced
- [ ] Optional: Python derivation parity with audited libs

## Ops hygiene

- [x] Public host bip39.catalyxt.xyz (TLS + static)
- [ ] Certbot: remove or fix expired `catalyxt.ltd` / `assetcert.xyz` renewals (host noise)
- [ ] Push tags regularly after ship
