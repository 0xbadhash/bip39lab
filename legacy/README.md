# Legacy / unsafe scanner (quarantine)

**Do not use for real seed material.**

The former root `brute-force-btc.py` and `bitcoin_scanner.conf` live here for historical reference only.

## Why quarantined

- Persists mnemonics to disk (`tested_mnemonics.json`)
- Logs full mnemonics
- Uses `eval` on config extractors
- Fetches BIP-39 wordlist over the network
- Calls third-party balance APIs by default
- Treats balance check failure as zero

## Safe path

```bash
# from repo root
set PYTHONPATH=src   # Windows PowerShell: $env:PYTHONPATH="src"
python -m bip39lab --help
python -m bip39lab validate <words...>
python -m bip39lab derive <words...>
python -m bip39lab generate --words 12
```

See repo root `AGENTS.md` and `ROADMAP.md`.
