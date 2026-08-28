# Plan: V2 UC8 extra named txs

## Approach

Keep UC8 inspect as a named-tx picker plus leak-ack fetch. Do not add a wallet explorer. Grow `PSBT_EX_TX` by three public, well-known data transactions so a classroom can see OP_RETURN ASCII, an ordinal envelope, and a Runestone without leaving `/v2/?uc=8`. Classroom snapshots remain the fail-closed path when `/api/mempool` and `mempool.space` both miss.

## Architecture

- **Data:** each example is `{ id, label, why, snap }`. `snap` is a mempool.space-shaped JSON subset: `txid`, `status.block_height`, `vin`/`vout` fields the decoder already reads (`scriptpubkey_asm`, `scriptpubkey_type`, `witness`, optional `inner_witnessscript_asm`).
- **Decode:** `opReturnNotes(vout)` walks outputs; `witnessNotes(vin)` scans witness stacks and inner scripts for `6f7264` (`ord`) and MIME hex (`text|image|application/`). Notes append to the inspect dump (`#v2PsbtNetLive`). Story copy stays in `#v2TxStory` (teach vs result).
- **Fetch:** existing `v2FetchMempool` — proxy first, public second, snap third. No new CSP. Classic Lab `connect-src 'none'` unchanged.
- **Tests:** Playwright V2-S41 (six buttons + live mock), S41b (genesis snap), S41c (three extra snaps). pytest AC stubs for traceability.

## Implementation sequence

1. Append the three named txs and MIME/OP_RETURN/ord decode; Playwright S41 / S41c.
2. Dual stamp `0.16.77` / `0.17.126-v2` via `stamp_site_version.py`.
3. Reviews, pytest green_cmd, pr_validator 100, tag, push, docs sync.

## Files

- `web/v2/js/v2-app.js`
- `e2e/v2.spec.ts`
- `docs/E2E_COMET_SCENARIOS.md`
- `web/v2/VERSION`, `web/v2/index.html`
- `VERSION`, `pyproject.toml`, `tests/test_ac_v2_uc8_data_txs.py`

## Risks

- `v2-app.js` already far past 1k lines; extract inspect helpers in a later cleanup, not this curriculum ship.
- leftover `scripts/*.py` stay uncommitted.
- No signer. No Imagine. No force-push.
