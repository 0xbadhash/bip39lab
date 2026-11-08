# BEHAVIOR-REPORT

**Marker:** BEHAVIOR-REPORT
**Contract:** .agents/artifacts/BEHAVIOR_CONTRACT.md
**Target:** CLI `python3 scripts/challenge.py` against a temp root and temp HOME

## Results

| Clause | Status | Evidence |
|--------|--------|----------|
| 1 Empty proposal exits 1 | pass | stderr `empty proposal`, exit 1 |
| 2 Relocated HOME with no Hermes tree | pass | stderr `ask_glm.py missing`, exit 1, no model output |
| 3 Stub GLM + dummy key file + closed-port URL | pass | stderr `Deepseek failed`, exit 1 (key file was read; URL override was attempted) |
| Must not write a vault note on failure | pass | `--root` temp product had no files after all three runs |

## Summary

- pass: 4 · fail: 0 · blocked: 0
- Keys were not printed. No live Deepseek or GLM host was contacted in clause 3 (`127.0.0.1:9`).
- NEXT_SKILL=/pr_review --validate
