# CROSS-REVIEW

**Marker:** CROSS-REVIEW
**Base:** HEAD~1
**Head:** HEAD (`fix(validate): accept --skip-hardcodes from night shift`)
**Secrets:** `check_secrets_diff.py --base HEAD~1 --head HEAD` clean

Blockers: 0. Majors: 0. Nits: 0. Tier A obsolete: 0.

## Security

None. `--skip-hardcodes` is a boolean. Default `full` and `hygiene` still run `check_hardcodes.py`. The night-shift caller runs that scanner as its own gate before validate. The diff does not read mnemonics, seeds, or env secrets, and it does not build a shell command from the flag.

## Maintainability

None. One branch in `scripts/validate.py`, covered by `tests/test_validate_skip_hardcodes.py` for help text, skip, and the default path.

### Obsolete / cleanup (scoped)

| Item | Conf | Verdict | Evidence |
|------|------|---------|----------|
| Tier A | — | none | No tracked secret, debug page, or re-export in the diff |
| Tier B | — | none | The new flag is the harness shape, not a second validator |
| `scripts/validate.py` | 0.1 | keep | Night shift and `/pr_review` call it; tests import `validate` |
| `scripts/validate.py.bak-20261009` | 0.7 | follow-up | Sibling backup, not in this diff. Out of scope — run `/sweep` before deleting |

## Domain

None. This path does not derive seeds, touch wordlists, or change the lab UI. Balance and checksum behavior are unchanged.

## Things that look bad but are actually fine

1. A large file count (7) is mostly the draft and review artifacts. Product code is the flag and the skip branch.
2. `full --skip-hardcodes` omits the hardcode section on purpose. Readiness already ran `check_hardcodes.py`.
3. The product copy of `night_shift_readiness.py` does not pass the flag. The report's source of truth is the agent-harness script, which does. Accepting the flag is what that caller needs.
