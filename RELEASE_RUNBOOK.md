# RELEASE RUNBOOK — v0.13.3

**Date:** 2026-08-09  
**Tag:** `v0.13.3`  
**Task:** Shamir teach + E2E align (chore)  
**Spec waiver:** chore · `.agents/specs/2026-08-08-shamir-recombine.md` (prior crypto)  
**Live:** https://bip39.catalyxt.xyz/ (nginx root → `web/`)

## What shipped

- Clearer Shamir teach table (threshold shares ≠ multisig keys ≠ BIP-39 phrase)
- E2E Comet MD: score total **67**, Network map **S13b–d / S32–S35**, product/contract stamp
- No crypto / retention path change (copy + docs chore after v0.13.2 recombine)

## Version stamp

```bash
echo 0.13.3 > VERSION
python3 scripts/stamp_site_version.py
# package.json + pyproject.toml match
```

## Smoke (this release)

| Step | Exit |
|------|------|
| `python3 scripts/product_smoke.py --root .` (unit + e2e) | 0 |
| `python3 scripts/check_web_e2e.py --root .` | 0 (67 Playwright S-ids; surfaces ok) |
| `python3 scripts/stamp_site_version.py` | 0 → v0.13.3 |
| Open PRs (`gh pr list --state open`) | empty / n/a |
| Infra | skip (no INFRA_RUNBOOK) |

## Evidence pack (B5)

- **smoke:** product_smoke unit + e2e exit 0
- **web_e2e:** check_web_e2e ok (strict, 7 specs, 67 S-ids)
- **hard_gates / secrets:** PR_DRAFT evidence pack; secrets diff clean on chore range
- **validate:** `validate.py full` system-python missing ruff/mypy/pytest (known); product `.venv` smoke is green

## Rollback

1. `git checkout v0.13.2 -- web/ docs/ VERSION package.json pyproject.toml`
2. Redeploy `web/` to nginx root; `python3 scripts/stamp_site_version.py` if needed
3. Confirm https://bip39.catalyxt.xyz/ loads prior teach copy

## §9 (≥3)

1. Teach table is educational only — still **not SLIP-39**, not a funds path.
2. Plugin coarse S13 IDs remain; exhaustive map lives in `docs/E2E_COMET_SCENARIOS.md`.
3. Deploy is static `web/` copy; tag does not auto-push live until operator deploys.
4. Portfolio harness reinstall N/A (product ship, not agent-harness SoT).
