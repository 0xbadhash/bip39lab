# Plan: V2 UC8 same-face `/api/mempool/tx/` (connect-src self)

**Spec:** `.agents/specs/2026-08-27-v2-uc8-paste-psbt.md`

## Approach

Keep inspect offline. Extract prev_txid when present. After leak-ack, `fetch('/api/mempool/tx/'+txid)` on UC8. CSP `'self'` only (HTML + nginx `/v2/`). Keep Network dock. Samples without prevout: honest empty id, no fetch. Playwright mocks `**/api/mempool/tx/**` (python http.server has no proxy).

## Architecture

- `web/v2/index.html` — `connect-src 'self'`
- `deploy/nginx-bip39.catalyxt.xyz.conf` — `/v2/` CSP `'self'` (not mempool.space)
- `web/v2/js/v2-app.js` — `#v2PsbtNetLive` fetch after ack
- `web/network.html` — do not hide lookup
- e2e V2-S37 / V2-S38

## Sequence

1. Amend spec (this).
2. CSP + fetch UI.
3. Playwright + stamp.
