# BEHAVIOR-CONTRACT

**Marker:** BEHAVIOR-CONTRACT
**Surface:** CLI `python3 scripts/validate.py`
**Not in scope:** lab UI, derivation, or the separate `check_hardcodes.py` scanner body

## Clauses

1. `--help` exits 0 and the usage text lists `--skip-hardcodes`.
2. `hygiene --skip-hardcodes` exits 0 and the section list does not include `check_hardcodes`.
3. `hygiene` with no extra flags exits 0 and the section list includes `check_hardcodes`.
4. `full --skip-hardcodes` exits 0 (the night-shift argv that previously exited 2).
