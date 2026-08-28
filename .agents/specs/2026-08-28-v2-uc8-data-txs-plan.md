# Plan: V2 UC8 extra named txs

## Files

- `web/v2/js/v2-app.js` — `PSBT_EX_TX` +3; `opReturnNotes`; `witnessNotes` MIME
- `e2e/v2.spec.ts` — S41 count 6; S41c
- `docs/E2E_COMET_SCENARIOS.md` — S41c line
- `web/v2/VERSION` / `web/v2/index.html` — 0.17.126-v2
- `VERSION` / `pyproject.toml` — 0.16.77

## Tests

- Playwright `-g V2-S41`
- pytest `tests/test_ac_v2_uc8_data_txs.py`

## Risks

- File already ≫ 1k lines; no new module this ship (decode stays next to inspect).
- Runestone snap is not rune 0 (UNCOMMON•GOODS has zero txid).
