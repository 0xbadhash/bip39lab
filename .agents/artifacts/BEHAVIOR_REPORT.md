# BEHAVIOR-REPORT

**Marker:** BEHAVIOR-REPORT
**Contract:** .agents/artifacts/BEHAVIOR_CONTRACT.md
**Target:** CLI `.venv/bin/python scripts/validate.py`

## Results

| Clause | Status | Evidence |
|--------|--------|----------|
| 1 `--help` lists `--skip-hardcodes` | pass | exit 0; usage line includes `--skip-hardcodes` |
| 2 `hygiene --skip-hardcodes` omits hardcodes | pass | exit 0; sections were repo hygiene, coverage, dev-log, vault schema only |
| 3 default `hygiene` still scans hardcodes | pass | exit 0; first section was `── check_hardcodes ──` |
| 4 `full --skip-hardcodes` | pass | exit 0; `5/5 gates passed`; no `check_hardcodes` section |

## Summary

- pass: 4 · fail: 0 · blocked: 0
- The flag changes which gate sections run. It does not print secrets.
- NEXT_SKILL=/pr_review --validate
