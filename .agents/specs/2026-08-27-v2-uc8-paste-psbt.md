# V2 UC8 paste PSBT + same-face public lookup (self only)

- **Product:** bip39lab
- **Created:** 2026-08-27
- **Updated:** 2026-08-27 (three public example txids on UC8; classroom samples still have no prevout)
- **Status:** ready-for-agent
- **Priority:** P0
- **Plan:** `.agents/specs/2026-08-27-v2-uc8-paste-psbt-plan.md`
- **Surface:** `web/v2/` UC8 inspect + same-tab proxy lookup; `/network.html` lookup stays visible
- **Grill-me:** complete (G1 default; CEO lock `/tmp/w6-uc8-csp.md`)

## Problem Statement

Paste/inspect shipped. After Inspect, if a **txid** or input **prev_txid** exists, the learner must **inspect the live public tx on the UC8 face** after leak-ack. `/v2/` CSP was `connect-src 'none'`, which blocked that fetch. Open **`'self'` only** so UC8 can `fetch /api/mempool/tx/<txid>`. Do **not** add `https://mempool.space` to v2 CSP. Do **not** hide `/network.html` lookup. Classroom samples often have **no** on-chain id — say **not found** honestly. Never Sign. No UC6. No Imagine.

## Solution

Keep `#v2PsbtIn` + Inspect. After a successful inspect, parse prevouts from the unsigned tx if present.

- No txid → `#v2PsbtNetMsg` says this classroom blob has no on-chain id; a public lookup would honestly be not found. **No fetch** from the sample.
- Three **public example** txids (genesis coinbase, first transfer, pizza day) sit under Inspect. After leak-ack, fetch `/api/mempool/tx/<txid>`. These are real history, not the classroom PSBT.
- Txid present → leak-ack `#v2PsbtNetAck`, then this tab fetches **same-origin** `/api/mempool/tx/<txid>` and paints `#v2PsbtNetLive`. HTTP 404 → not found, not a fake confirm.
- `#v2PsbtNetOpen` still docks `../network.html?txid=<hex>` after ack. Do not hide `#txLookupCard` on Network.
- `/v2/` CSP `connect-src 'self'` (meta + nginx `location ^~ /v2/`). Classic Lab stays `'none'`. Network page still `'self' https://mempool.space`.

Chip `v0.17.105-v2`. Product stamp on ship.

## Acceptance

| ID | Criterion |
|----|-----------|
| AC-1 | `#v2PsbtIn` `#v2PsbtInspect` still work. Sample inspect still ok. |
| AC-2 | After sample inspect (no prevout), `#v2PsbtNetMsg` states no on-chain id / would not be found. No fetch from the sample. Three public example tx buttons exist. After leak-ack, example fetch uses `/api/mempool/tx/<txid>`. `#v2PsbtNetOpen` inactive until a txid exists **and** leak-ack. |
| AC-3 | Secret-looking paste still refused. No Sign. |
| AC-4 | `web/v2/index.html` CSP is `connect-src 'self'` and does **not** include `mempool.space`. After leak-ack with a prevout, UC8 fetches `/api/mempool/tx/<txid>` on that face. |
| AC-5 | Classic `/` still `#psbtIn` and `connect-src 'none'`. `network.html` `#txLookupCard` / `?txid=` after ack stays; missing tx is honest not-found. |

## Grill-me

Q: Open v2 CSP to mempool.space?
A: No. `'self'` only. Fetch `/api/mempool/tx/<txid>`.

Q: Hide Network lookup?
A: No.

Q: Sign/broadcast?
A: No.

Q: Classroom sample txid?
A: Usually none. Do not invent a funded tx. Say not found honestly. No fetch.

Q: Mix UC6 / Imagine / signer?
A: No.

## Testing Decisions

- Red: V2 fetch to `https://mempool.space`; Sign button; hide `#txLookupCard`
- Green: V2-S34 paste; V2-S37 no-txid + CSP `'self'` not mempool.space; V2-S38 leak-ack fetch mock `/api/mempool/tx/**`; network page not-found if queried
- pytest `tests/test_ac_v2_uc8_paste_psbt.py` AC-1–5
