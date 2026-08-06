# Security policy — bip39lab

## Threat model (product)

| Asset | Handling |
|-------|----------|
| Entropy / mnemonic / seed / xprv / private keys | Process memory only; never logged; never written by `bip39lab` or web UI |
| Derived addresses | Safe to display; optional network leak only with explicit user action |
| Wordlist | Vendored with SHA-256 integrity (Python); bundled in web offline pack |

## Non-negotiables

1. **No retention** of seed material (disk, telemetry, default storage APIs).
2. **Offline-first** crypto; web CSP `connect-src 'none'`.
3. **No third-party runtime CDNs** for crypto scripts.
4. **No `eval` of config** for balance extractors.
5. **Balance** is address-only; API failure is `unknown`, never silent `0`.
6. **Legacy scanner** under `legacy/` is unsafe and not the product path.

## Reporting

Treat this as personal/self-hosted software. If you find a derivation bug, open an issue with **test vectors only** (never real seed phrases).

## Dependencies

- Python 3.11+ stdlib for CLI crypto path + vendored English wordlist.
- Web: vendored offline bundle (`web/js/bip39lab.bundle.js`) built from `@scure/*` and `@noble/*` via `web/js/build-entry.mjs` (rebuild offline after `npm install` of those packages).
