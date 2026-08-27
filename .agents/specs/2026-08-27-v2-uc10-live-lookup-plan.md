# Plan: V2 UC10 in-tab `/api/mempool`

**Spec:** `.agents/specs/2026-08-27-v2-uc10-live-lookup.md`

## Approach

Do not load `network.bundle.js` (it falls back to mempool.space). `fetch('/api/mempool/...')` after leak-ack. Playwright mocks the proxy.

## Architecture

- `web/v2/js/v2-app.js` — `uc10` live pad `#v2Net*`
- e2e V2-S42 S43
- CSP unchanged `'self'`
