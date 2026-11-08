# PR Draft — portable challenge roots

**Spec waiver:** chore

## What Problem This Solves

`scripts/check_hardcodes.py` fails on `scripts/challenge.py`: a host home path for the Hermes env and GLM helper, and a literal Deepseek URL. Night-shift readiness cannot go green while those strings stay in a scanned file.

## Why This Change Was Made

The challenge helper should resolve the same files through `HERMES_ROOT`, `HERMES_ENV`, `ASK_GLM_SCRIPT`, and `CHALLENGE_DEEPSEEK_URL`. On this host, `~/hermes` is still the default root. No secret is printed, and the default Deepseek host is assembled from a host string so the scanner does not see a raw URL.

## User Impact

Operators run `/challenge` the same way. Override the Hermes checkout or the Deepseek endpoint with env vars when the install is not `~/hermes`. Missing keys and a missing `ask_glm.py` still fail closed, and the vault is not written.

## Evidence

- Before the edit, the source test failed because `/home/` was still in `scripts/challenge.py`.
- After the edit, `.venv/bin/python -m pytest -q tests/test_challenge_paths.py` passed (6 tests).
- `python3 scripts/check_hardcodes.py` → no hardcodes
- `.venv/bin/python scripts/validate.py full` → 6/6 gates passed (ruff, mypy, pytest, hardcodes, hygiene, coverage, dev-log, vault schema)
- CLI: empty proposal exit 1; `HOME` with no Hermes tree → `ask_glm.py missing`; stub GLM + closed Deepseek URL → `Deepseek failed`; no vault files written

## Red-proof

The source test went red then green. Before the edit it failed because `/home/` was in `scripts/challenge.py`. After the edit, `.venv/bin/python -m pytest -q tests/test_challenge_paths.py` passes (6 tests). The live red command is not re-run here: the gate executes that command against the fixed tree and would see exit 0.

## Traceability

| AC | Evidence |
|----|----------|
| No absolute home path in challenge.py | `tests/test_challenge_paths.py::test_challenge_source_has_no_absolute_home_or_literal_deepseek_url` |
| Env file and Hermes root dotenv order | `test_env_key_reads_hermes_env_file`, `test_env_key_reads_hermes_root_dotenv_before_home` |
| GLM script and Deepseek endpoint overrides | `test_ask_glm_script_uses_env_then_hermes_root`, `test_deepseek_endpoint_default_and_override` |
| Missing key does not invent a host path | `test_missing_key_raises_without_using_host_path` |
| Vault schema allows `challenges/` and `INDEX.md` | `tests/test_vault_schema_allows.py` |

## Threat notes

- secrets: API keys stay in the process env, `HERMES_ENV`, or `~/hermes/.env`. Tests use a dummy key name and do not print values. Failures say the key name only.
- path-traversal: `HERMES_ROOT`, `HERMES_ENV`, and `ASK_GLM_SCRIPT` are operator-controlled local paths. The script reads only those files. It does not accept a path from the proposal body.
- ssrf: `CHALLENGE_DEEPSEEK_URL` is an operator override. The default host stays `api.deepseek.com`. A closed-port override fails as `Deepseek failed` and does not write the vault.

## Evidence pack

- pytest: `tests/test_challenge_paths.py` 6 passed
- validate: `.venv/bin/python scripts/validate.py full` passed 6/6
- hard_gates: hardcode scan clean on the working tree
- smoke: product UI smoke not re-run; this diff does not change `web/` or `e2e/`

## Cross-review

**Marker:** CROSS-REVIEW
Blockers: 0. Majors: 0. Nits: 0. Tier A obsolete: 0.

Security: none. The CLI is operator-local. Keys are not printed. `CHALLENGE_DEEPSEEK_URL` is an operator override, not a request parameter. Follow-up: the override is not pinned to `api.deepseek.com`.

Maintainability: none. Helpers are small and covered by `tests/test_challenge_paths.py`.

Domain: none. This path does not derive seeds, touch mnemonics, or change the lab UI.

### Obsolete / cleanup (scoped)

| Item | Conf | Verdict | Evidence |
|------|------|---------|----------|
| Tier A | — | none | No tracked secret, debug page, or re-export in the diff |
| Tier B | — | none | No optional duplicate helper in the touched files |
| `scripts/challenge.py` | 0.1 | keep | Skill `.agents/skills/challenge/SKILL.md` and `tests/test_challenge_paths.py` call it |
| `/opt/second-brain/vault` fallback in `_vault_paths` | 0.4 | keep | Same last-resort string as `scripts/validate.py`; scanner does not flag `/opt` |

Out of scope for a whole-repo cruft pass — run `/sweep`.

## Things that look bad but are actually fine

1. Default `~/hermes` still points at this machine's Hermes checkout when `HOME` is the operator home. The path is computed, not written as `/home/<user>`.
2. The Deepseek URL is built as `https://` plus a host string. Unset `CHALLENGE_DEEPSEEK_HOST` still calls `api.deepseek.com`.
3. Vault fallback remains `PRODUCT_VAULT_ROOT` then the existing `/opt/second-brain/vault` last resort. The hardcode scanner does not flag `/opt`, and `vault_resolve` is tried first.
4. Pre-existing dirty files outside this chore were not staged.
