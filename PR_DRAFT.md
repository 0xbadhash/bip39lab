# PR Draft — accept night-shift `--skip-hardcodes`

**Spec waiver:** hotfix

## What Problem This Solves

Night-shift readiness runs `scripts/validate.py full --skip-hardcodes` because `check_hardcodes.py` is already its own gate. This product's `validate.py` rejected that flag (`unrecognized arguments`, exit 2), so `validate_full` failed before type, lint, or tests ran.

## Why This Change Was Made

The harness source of truth already accepts `--skip-hardcodes` and skips only the hardcodes section. This checkout was behind that flag. Default `full` and `hygiene` still run `check_hardcodes.py`.

## User Impact

Operators and the night-shift runner can pass `--skip-hardcodes` without an argparse error. A plain `python3 scripts/validate.py full` still includes the hardcode scan. No lab page, mnemonic, or derivation path changes.

## Evidence

- Red: `tests/test_validate_skip_hardcodes.py` — 2 failed, 1 passed. Help text lacked `--skip-hardcodes`. `hygiene --skip-hardcodes` raised `SystemExit: 2` (`unrecognized arguments: --skip-hardcodes`).
- Green: the same file — 3 passed.
- `.venv/bin/python scripts/validate.py full` → 6/6 gates passed.
- `.venv/bin/python scripts/validate.py full --skip-hardcodes` → 5/5 gates passed (no `check_hardcodes` section).
- `.venv/bin/python scripts/validate.py hygiene` still prints `── check_hardcodes ──`.

## Red-proof

The new tests went red then green. Before the flag, help omitted `--skip-hardcodes` and `validate.py hygiene --skip-hardcodes` exited 2. After the flag, `tests/test_validate_skip_hardcodes.py` passes (3 tests). The live red command is not re-run here: the gate would execute it against the fixed tree and see exit 0.

## Traceability

| AC | Evidence |
|----|----------|
| `--help` lists `--skip-hardcodes` | `tests/test_validate_skip_hardcodes.py::test_validate_help_lists_skip_hardcodes` |
| Flag skips only the hardcodes gate | `test_skip_hardcodes_omits_hardcode_gate` |
| Default hygiene still runs hardcodes | `test_default_hygiene_still_runs_hardcodes` |
| Night argv `full --skip-hardcodes` exits 0 | CLI behavior clause 4 |

## Threat notes

- secrets: `--skip-hardcodes` must not hide a credential. Night shift still runs `check_hardcodes.py` as its own gate. Default `validate.py full` and `hygiene` still run that scan. This diff adds no secret and does not log env values.
- injection: the flag is `store_true`. It is not interpolated into a shell command. `mode` stays an argparse choice (`full`, `hygiene`, `compliance`).

## Evidence pack

- pytest: `tests/test_validate_skip_hardcodes.py` 3 passed
- validate: `.venv/bin/python scripts/validate.py full` passed 6/6; `full --skip-hardcodes` passed 5/5
- hard_gates: hardcode scan still clean on the working tree when the flag is absent
- smoke: product UI smoke not re-run; this diff does not change `web/` or `e2e/`

## Cross-review

**Marker:** CROSS-REVIEW
Blockers: 0. Majors: 0. Nits: 0. Tier A obsolete: 0.

Security: none. The flag is boolean. Default validate still runs the hardcode scan. Night shift runs that scan as its own gate.

Maintainability: none. `tests/test_validate_skip_hardcodes.py` covers help, skip, and the default path.

Domain: none. No mnemonic, seed, wordlist, or lab UI change.

### Obsolete / cleanup (scoped)

| Item | Conf | Verdict | Evidence |
|------|------|---------|----------|
| Tier A | — | none | No tracked secret, debug page, or re-export in the diff |
| Tier B | — | none | Flag matches the harness validator; not a second tool |
| `scripts/validate.py` | 0.1 | keep | Night shift and the new tests call it |
| `scripts/validate.py.bak-20261009` | 0.7 | follow-up | Not in this diff. Out of scope — run `/sweep` |

Out of scope for a whole-repo cruft pass — run `/sweep`.

## Things that look bad but are actually fine

1. `full --skip-hardcodes` reports 5/5 gates and never prints `check_hardcodes`. That is the night-shift split: readiness already ran `check_hardcodes.py` and it passed on its own.
2. Hygiene still warns `using legacy /opt/second-brain/vault`. That warning predates this flag. Vault schema lint and the dev-log contract still pass.
3. Pre-existing dirty files outside this hotfix (plugin vault flag, CI, bip32 rename, comet test skips, and others) were not staged.
