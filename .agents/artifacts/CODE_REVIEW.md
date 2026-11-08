# CODE-REVIEW

**Marker:** CODE-REVIEW
**Base:** working tree vs `scripts/challenge.py` before the path edit
**Head:** portable env roots in `scripts/challenge.py`, `tests/test_challenge_paths.py`, skill sentence in `.agents/skills/challenge/SKILL.md`

## Secrets scan

Targeted tests use `CHALLENGE_TEST_ONLY_KEY` only. The implementation does not log env values. `check_secrets_diff` runs at `/pr_review` on the committed range.

## Findings

No accepted P0.

- Rejected as a blocker: operator-set `CHALLENGE_DEEPSEEK_URL` can point at any host. That is the override the hardcode gate asked for. Default host stays `api.deepseek.com`. Failure does not write the vault. Tagged `ssrf` in the PR draft.
- Rejected as a blocker: `HERMES_ENV` / `ASK_GLM_SCRIPT` are local paths chosen by the operator who already runs the script. Tagged `path-traversal`. The proposal body is not used as a path.
- Follow-up: `_vault_paths` still falls back to `/opt/second-brain/vault` when vault resolution returns nothing. The hardcode scanner does not flag `/opt`. Left in place so this diff stays on the failing hits.
- Follow-up: pre-existing dirty files in the worktree (vault lint allowlist, comet skip, bip32 rename, and others) are outside this chore and were not reviewed as part of this change.

## Verdict

Approve. P0 count: 0. Follow-ups: 2.

## Tests

- Red: source test failed while `/home/` was still in `scripts/challenge.py`.
- Green: `tests/test_challenge_paths.py` 6 passed.
- CLI behavior: empty proposal, missing GLM under a temp HOME, and Deepseek failure on a closed port. No vault write.
