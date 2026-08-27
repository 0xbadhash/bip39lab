# Plan: V2 mempool + UC7 extra + UC8 split

**Spec:** `.agents/specs/2026-08-27-v2-w6-mempool-uc7-uc8.md`

## Approach

`v2FetchMempool` tries `/api/mempool` then `https://mempool.space/api`. CSP meta + nginx `/v2/` match Network. UC10 paints Network-shaped fee bands and address table. UC7 new step for extra secret A/B hex. UC8 two columns story vs chain.

## Files

- `web/v2/index.html`, `web/v2/js/v2-app.js`, `web/v2/css/v2.css`
- `deploy/nginx-bip39.catalyxt.xyz.conf` (+ live sites-available already reloaded)
- `e2e/v2.spec.ts`, `tests/test_network_api.py`
