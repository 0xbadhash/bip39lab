# Plan — Phase 0 correctness lab

## Architecture

```text
src/bip39lab/
  __init__.py
  __main__.py      # python -m bip39lab
  wordlist.py      # load + SHA-256
  bip39.py         # entropy, checksum, generate, validate, to_seed
  bip32.py         # HMAC master + CKD
  secp256k1.py     # scalar mult for pubkey
  address.py       # p2pkh / p2sh-p2wpkh / bech32
  derive.py        # path helpers BIP44/49/84
  cli.py
  data/english.txt
legacy/
  README.md
  brute-force-btc.py  # moved
  bitcoin_scanner.conf
tests/
  test_bip39_vectors.py
  test_no_retention.py
```

## Dependencies

- Python 3.11+ stdlib only for Phase 0 runtime.

## Verify

```bash
python -m pytest -q
python -m bip39lab validate "abandon abandon ..."
python -m bip39lab derive "abandon abandon ..." --paths all
```
