# CODE-REVIEW

**Marker:** CODE-REVIEW
**Base:** `HEAD` (before this hotfix)
**Head:** `scripts/validate.py` plus `tests/test_validate_skip_hardcodes.py`

## Command

Review of the working diff against HEAD for `scripts/validate.py` and `tests/test_validate_skip_hardcodes.py` only. Pre-existing dirty files were out of scope.

## Secrets scan

The diff adds an argparse `store_true` and tests that monkeypatch `_run`. No credentials, URLs, or home paths. `check_secrets_diff` runs at `/pr_review` on the committed range.

## Findings

No accepted P0.

- Rejected as a blocker: callers who pass `--skip-hardcodes` will not scan hardcodes inside `validate.py`. The help text says this is for a caller that already ran the gate. Night shift does that. Default mode still scans. Tests lock both paths.
- Follow-up: the product copy of `scripts/night_shift_readiness.py` does not append `--skip-hardcodes`. The readiness report's source of truth is the agent-harness script, which does. Syncing the product copy is a separate harness update, not required to accept the flag.

## Verdict

Approve. P0 count: 0. Follow-ups: 1.

## Tests

- Red: `tests/test_validate_skip_hardcodes.py` — 2 failed, 1 passed (`SystemExit: 2` on `--skip-hardcodes`).
- Green: same file — 3 passed.
- CLI: `--help`, `hygiene`, `hygiene --skip-hardcodes`, and `full --skip-hardcodes` matched the behavior contract.
- `scripts/validate.py full` — 6/6 gates passed.
