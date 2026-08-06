# Harness backlog (product-local)

## Done

- [x] Install agent-harness portable skills + scripts
- [x] product_plugin.yaml (python + security domain hints)
- [x] ROADMAP phases 0–3 with full FSM + `/spec` (tags v0.1.0–v0.4.0)
- [x] Git init + `.gitignore`
- [x] GitHub repo `0xbadhash/bip39lab` + push + tags
- [x] CI workflow (pytest, ruff, mypy, hardcodes, web vectors)
- [x] MIT LICENSE

## Next (product)

- [ ] **Local Bitcoin node backend** for address-only balance (`--backend bitcoind` / RPC `scantxoutset` or equivalent) — prefer over public explorers
- [ ] Optional Electrum server backend (address-only)
- [ ] Entropy UI (dice/hex/binary) + multi-index path table (Phase 4 candidate — needs `/spec`)
- [ ] Remove unused educational `web/js/crypto-core.js` if still unreferenced
- [ ] Optional: Python path parity with audited libs (today: fixtures + stdlib)

## Ops hygiene

- [ ] Rename local folder `bitcoin-scripts` → `bip39lab` when convenient (remote is already `bip39lab`)
- [ ] Document node RPC setup in README once backend lands
