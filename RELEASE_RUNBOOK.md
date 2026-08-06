# RELEASE RUNBOOK — v0.8.0 (Option B watch-only + QR)

Watch-only zpub/ypub/xpub export (no xprv). Offline SVG QR for addresses and public keys.
CSP img-src allows data: for QR only. Lab remains connect-src none.

Smoke: pytest 41 · validate 5/5

Rollback: git checkout v0.7.1
