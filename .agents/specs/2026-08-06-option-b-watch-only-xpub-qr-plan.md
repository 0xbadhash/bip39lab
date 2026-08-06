# Plan: Option B — Watch-only xpub/zpub + QR

- **Spec:** `.agents/specs/2026-08-06-option-b-watch-only-xpub-qr.md`
- **Status:** ready-for-agent

## Approach

1. Extend `build-entry.mjs` / bundle: derive account node `m/purpose'/0'/account'`, export public extended key; apply SLIP-132 version bytes for zpub/ypub where applicable.
2. UI panel “Watch-only”: list exports + Copy; QR modal/canvas for selected address.
3. Vendor QR encoder (e.g. minimal qrcode lib) under `web/js/vendor/`.
4. Vectors + tests; docs on About/help fold.

## Risks

| Risk | Mitigation |
|------|------------|
| Wrong SLIP-132 version | Test vectors; label path always |
| QR lib size | Prefer small pure JS |
| User confuses xpub with seed | Strong English copy |
