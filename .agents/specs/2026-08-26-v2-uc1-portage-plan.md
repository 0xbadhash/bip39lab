# Plan: V2 UC1 portage

**Spec:** `.agents/specs/2026-08-26-v2-uc1-portage.md`

## Approach

Copy classic jobs only: textarea paste (`#mnemonic`) and one-at-a-time purpose tabs (`#card-addresses` `data-addr-type`). Keep UC1 generate, card ack, derive, length, quiz. Reuse `BIP39Lab.validateMnemonic` and existing `deriveAddresses` row fields.

## Architecture

- `web/v2/js/v2-app.js` — paste controls on `uc1` step 0; `mem.addrType`; `addrTypeTabsHtml`; `addrHtml` field map; wire `#v2PasteApply` / `#v2AddrType`
- `web/v2/css/v2.css` — `.v2-addr-tabs`
- `web/v2/index.html` — chip `0.17.90-v2` + `?v=`
- `e2e/v2.spec.ts` — describe chip; S27; S28
- `tests/test_ac_v2_uc1_portage.py`

## Sequence

1. Spec written; paste + tabs + CSS in UC1.
2. Playwright S27/S28 + AC stubs.
3. Product stamp only at `/release_mgmt`.
