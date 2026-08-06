# RELEASE RUNBOOK — v0.10.1 Option C Network

Opt-in Network page: fee/traffic snapshot + address-only balances via mempool.space.
Lab & Multisig remain `connect-src 'none'`. Network page CSP: `connect-src https://mempool.space`
(meta + nginx `location = /network.html`; v0.10.1 fixed dual CSP AND blocking live fetches).

Smoke: pytest 45 · e2e 16 local · live S13/S13b PASS

URLs:
- https://bip39.catalyxt.xyz/
- https://bip39.catalyxt.xyz/multisig.html
- https://bip39.catalyxt.xyz/network.html
