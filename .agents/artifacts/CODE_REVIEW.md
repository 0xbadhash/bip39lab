# CODE-REVIEW

- **command:** `/code_review`
- **head:** UC8 same-face `/api/mempool/tx/` connect-src self
- **secrets:** V2 connect-src self only; inspect refuses xprv; no mempool.space on v2
- **engine:** same session

## Accepted P0

**none**

Fetch is same-origin `/api/mempool/tx/<txid>` after leak-ack. No Sign. Network `#txLookupCard` unchanged. Samples honestly have no txid → no fetch.

## Follow-ups

- leftover scripts stash
- lab-strip 404
- unsigned-tx parser is educational, not a full bitcoin core decoder
- nginx `/v2/` CSP must match meta on live host

p0=0 follow_ups=4

## Smoke

Playwright V2-S34 S37 S38 passed.
