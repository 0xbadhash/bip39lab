# Plan: V2 UC8 paste PSBT + Network dock

**Spec:** `.agents/specs/2026-08-27-v2-uc8-paste-psbt.md`

## Approach

Inspect stays offline. Extract prev_txid from PSBT unsigned tx when present. Offer Network dock with leak-ack. Fetch only on `network.html`. Samples without prevout: honest empty id.

## Architecture

- `web/v2/js/v2-app.js` — prevout parse, `#v2PsbtNet*`
- `web/network.html` + `web/js/network-app.js` — `?txid=` after `#balAck`
- e2e V2-S37
- do not change v2 CSP

## Sequence

1. Amend spec (this).
2. Dock UI + network tx lookup.
3. Playwright + stamp.
