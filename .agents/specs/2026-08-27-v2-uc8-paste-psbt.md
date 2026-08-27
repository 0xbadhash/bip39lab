# V2 UC8 paste PSBT + Network dock (opt-in)

- **Product:** bip39lab
- **Created:** 2026-08-27
- **Updated:** 2026-08-27 (Network-dock if txid/prevout)
- **Status:** ready-for-agent
- **Priority:** P0
- **Plan:** `.agents/specs/2026-08-27-v2-uc8-paste-psbt-plan.md`
- **Surface:** `web/v2/` UC8 inspect; lookup only via `/network.html` (not in-tab)
- **Grill-me:** complete (G1 default)

## Problem Statement

Paste/inspect shipped. Leftover behavior still live: after Inspect, if a **txid** or input **prev_txid** exists, offer a **public lookup** on the existing Network room (mempool proxy / mempool.space), leak-ack only. Classroom samples often have **no** on-chain id — say **not found** honestly. Never Sign. `/v2/` `connect-src` stays `'none'`. Do not open UC10 in-tab leftover.

## Solution

Keep `#v2PsbtIn` + Inspect. After a successful inspect, parse prevouts from the unsigned tx if present.

- No txid → `#v2PsbtNetMsg` says this classroom blob has no on-chain id; a public lookup would honestly be not found. No fetch from V2.
- Txid present → `#v2PsbtNetAck` then `#v2PsbtNetOpen` navigates to `../network.html?txid=<hex>`. Network page fetches `/tx/` **after** leak-ack. HTTP 404 → not found, not a fake confirm. No Sign. No broadcast from V2.

Chip `v0.17.104-v2`. Product stamp only on ship.

## Acceptance

| ID | Criterion |
|----|-----------|
| AC-1 | `#v2PsbtIn` `#v2PsbtInspect` still work. Sample inspect still ok. |
| AC-2 | After sample inspect, `#v2PsbtNetMsg` states no on-chain id / would not be found. `#v2PsbtNetOpen` stays inactive until a txid exists **and** leak-ack. |
| AC-3 | Secret-looking paste still refused. No Sign. |
| AC-4 | `web/v2/index.html` CSP still `connect-src 'none'`. Lookup is a link to `/network.html`, not a V2 fetch. |
| AC-5 | Classic `/` still `#psbtIn`. `network.html` with `?txid=` after ack: missing tx is honest not-found (not fake 0). |

## Grill-me

Q: Does V2 fetch mempool?
A: No. `connect-src 'none'`. Dock is navigation to Network.

Q: Sign/broadcast?
A: No.

Q: Classroom sample txid?
A: Usually none. Do not invent a funded tx. Say not found honestly.

## Testing Decisions

- Red: V2 fetch to mempool; Sign button
- Green: V2-S34 paste; **V2-S37** net dock no-txid; network page not-found if queried
- pytest `tests/test_ac_v2_uc8_paste_psbt.py`
