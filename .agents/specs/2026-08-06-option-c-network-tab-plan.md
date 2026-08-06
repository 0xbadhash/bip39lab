# Plan: Option C — Network page

- **Spec:** `.agents/specs/2026-08-06-option-c-network-tab.md`
- **Product:** bip39lab
- **Status:** ready-for-agent
- **Updated:** 2026-08-06

## Stack

- Static HTML/JS/CSS (same as Lab/Multisig).
- Browser `fetch` only on Network page.
- Reuse `web/css/app.css` shell.
- Python CLI mempool already documents REST shape — mirror in JS parsers for tests.

## File map

| Path | Role |
|------|------|
| `web/network.html` | UI: fees, traffic, balances + help |
| `web/js/network-api.mjs` | Pure parse + URL builders (testable) |
| `web/js/network-app.js` | DOM, opt-in, sessionStorage bridge |
| `web/js/network.bundle.js` | esbuild bundle if modules needed |
| `web/index.html` / `multisig.html` | Nav link → network.html |
| `tests/test_network_api.py` or node tests | JSON parse / fail-closed |
| `e2e/network.spec.ts` | S13 smoke |
| `docs/E2E_COMET_SCENARIOS.md` | S13 steps |
| `deploy/nginx-*.conf` | Optional path CSP note (meta CSP primary) |

## API (mempool.space)

| Use | Method |
|-----|--------|
| Fees | `GET https://mempool.space/api/v1/fees/recommended` |
| Tip | `GET https://mempool.space/api/blocks/tip/height` |
| Mempool | `GET https://mempool.space/api/mempool` |
| Address | `GET https://mempool.space/api/address/{addr}` |

## Implementation sequence

1. Pure parse helpers + unit tests (red/green).
2. `network.html` shell + nav from Lab/Multisig.
3. Fee + traffic fetch with opt-in.
4. Balances + leak ack + sessionStorage import.
5. Lab index: optional write of derived addresses to sessionStorage on successful derive (addresses only).
6. E2E S13 + Comet update.
7. Ship FSM → v0.10.0.

## Lab bridge (minimal)

In `app.js` after successful `deriveAddresses`:

```js
sessionStorage.setItem(
  "bip39lab.derivedAddresses",
  JSON.stringify(rows.map(/* bip84 or all visible */))
);
```

Prefer storing **BIP84** list by default (or all visible address types flattened unique). Document in UI.

## Risks

| Risk | Mitigation |
|------|------------|
| Accidental open Lab CSP | Automated test asserts Lab meta CSP still `connect-src 'none'` |
| Rate limit | User click only; batch size ≤ 20; show error |
| User pastes seed on Network | No mnemonic field; warn “addresses only” |
| Fake zero balance | status field ok/unknown/error |

## Open questions

None — ready for `/execute_dev`.
