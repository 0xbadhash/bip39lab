# V2 UC10 live Network lookup in-tab (self only)

- **Product:** bip39lab
- **Created:** 2026-08-27
- **Status:** ready-for-agent
- **Priority:** P0
- **Plan:** `.agents/specs/2026-08-27-v2-uc10-live-lookup-plan.md`
- **Surface:** `web/v2/` UC10 only. Dock `/network.html`. `/v2/` `connect-src 'self'`.
- **Grill-me:** complete (CEO lock `/tmp/w6-uc10.md`)

## Problem Statement

UC10 leftover: classic `/network.html` has live fees, mempool traffic, and optional address lookup after leak-ack. V2 UC10 only docks Network. WINDOW 6: copy that job **in-tab** via same-origin `/api/mempool`. Do not add `mempool.space` to v2 CSP. Do not reopen UC8. No Sign. No broadcast. No UC6.

## Solution

Keep teach: unknown is not zero; address-only; never the words.

On the live pad, after `#v2NetAck`:

- **Fetch fee + traffic** → `GET /api/mempool/v1/fees/recommended`, `/api/mempool/blocks/tip/height`, `/api/mempool/mempool`
- Optional **address** → `GET /api/mempool/address/<addr>` after ack. Failures stay **unknown**, never a fake 0. True empty from a valid payload may be 0 sats with status ok.
- Dock `/network.html` stays. No mnemonic load. No mempool.space from the V2 tab.

Chip `v0.17.109-v2`. Product stamp on ship.

## Acceptance

| ID | Criterion |
|----|-----------|
| AC-1 | UC10 still teaches unknown ≠ zero and address-only. No Sign. |
| AC-2 | After leak-ack, **Fetch fee + traffic** uses `/api/mempool/…` only. CSP remains `connect-src 'self'` (no `mempool.space`). |
| AC-3 | Address fetch after ack: 404/error → unknown, not fake zero. |
| AC-4 | `#v2NetAck` required; buttons inactive until ticked. Never paste/send mnemonic. |
| AC-5 | Classic `/network.html` lookup not hidden. UC8 not changed this stamp. |

## Grill-me

Q: Widen CSP to mempool.space?
A: No. `'self'` only.

Q: Reopen UC8?
A: No.

Q: Sign/broadcast?
A: No.

Q: Fake zero on failure?
A: No. Unknown.

## Testing Decisions

- Green: V2-S42 snap after ack (mocked `/api/mempool/**`); V2-S43 address 404 → unknown
- pytest `tests/test_ac_v2_uc10_live_lookup.py`
