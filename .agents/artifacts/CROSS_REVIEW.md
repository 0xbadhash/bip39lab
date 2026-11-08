# CROSS-REVIEW

**Marker:** CROSS-REVIEW
**Base:** HEAD~1
**Head:** HEAD (`fix(challenge): use portable roots and clear the hardcode scan`)

## Blockers

0

## Security Guru

None. `scripts/challenge.py` is an operator CLI. It does not take a URL or a filesystem path from the proposal text. API key values are not printed. `CHALLENGE_DEEPSEEK_URL` is an env override for the operator who already runs the process. Secrets scan of `HEAD~1...HEAD` was clean.

Follow-up (not a blocker): the Deepseek override is not restricted to `api.deepseek.com`.

## Maintainability Expert

None. Path resolution is three functions with unit tests. No new product package boundary.

### Obsolete / cleanup (scoped)

| Tier | Item | Conf | Verdict | Evidence |
|------|------|------|---------|----------|
| A | none | — | — | Diff has no tracked secret file, debug endpoint, or re-export-only test |
| B | none | — | — | No second copy of the path helper in the touched files |
| C | `scripts/challenge.py` | 0.1 | keep | Referenced by `.agents/skills/challenge/SKILL.md` and `tests/test_challenge_paths.py` |
| C | `/opt/second-brain/vault` fallback | 0.4 | keep | Last resort after `vault_resolve` / `PRODUCT_VAULT_ROOT`; same pattern as `scripts/validate.py` |

Whole-repo cruft is out of scope — run `/sweep`.

## Domain Specialist

None. bip39lab's no-retention rule is unchanged. This diff does not generate, log, or store mnemonics, entropy, or private keys.

## §9

See PR_DRAFT.md "Things that look bad but are actually fine" (four entries).

## Verdict

Approve. blocker=0 major=0 tier_a=0
