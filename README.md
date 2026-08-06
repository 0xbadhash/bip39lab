# bip39lab — offline BIP-39 / entropy lab

<!-- CURRENT_RELEASE -->
**Current release:** `v0.4.0` (docs synced via `/sync_docs`)
<!-- /CURRENT_RELEASE -->

**Repo:** [github.com/0xbadhash/bip39lab](https://github.com/0xbadhash/bip39lab)

Self-hosted, **no-retention** BIP-39 tooling (CLI + static web), inspired by public converters but without third-party trust for seed material.

**Not** a funded-wallet brute-force scanner. Legacy unsafe scanner is under `legacy/` only.

**Balance lookups:** prefer a **local Bitcoin node** you control (planned `--backend bitcoind`). Public explorers are opt-in only and leak address interest.

## Quick start (CLI)

```bash
# Windows PowerShell
$env:PYTHONPATH = "src"
python -m pip install -e .
python -m bip39lab generate --words 12
python -m bip39lab validate abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about
python -m bip39lab derive abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about
# Optional network (address only — never pass a mnemonic):
python -m bip39lab balance bc1q... --backend none
python -m bip39lab balance bc1q... --backend blockstream --i-understand-address-leak
```

## Quick start (web)

1. Open `web/index.html` in a browser (prefer airgapped machine).
2. Or serve static files: `python -m http.server 8080 --directory web`
3. Generate / paste mnemonic, derive first BIP44/49/84 addresses.
4. Use **Clear secrets** when done. Nothing is stored.

Rebuild offline bundle (after cloning scure/noble deps):

```bash
npx esbuild web/js/build-entry.mjs --bundle --format=iife --outfile=web/js/bip39lab.bundle.js
```

## Tests

```bash
python -m pytest -q
```

## Agent harness

This repo installs **agent-harness** under `.agents/`. Each ROADMAP phase ships via full FSM:

`/spec` → `/execute_dev` → reviews → `/pr_review --validate` → `/release_mgmt` → `/sync_docs`

See `AGENTS.md`, `ROADMAP.md`, `.agents/docs/ship-flow.md`.

## Security

See [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) — software provided as-is for self-custody education and offline labs.
