# RELEASE RUNBOOK — v0.13.2

**Date:** 2026-08-09  
**Tag:** `v0.13.2`  
**Task:** Shamir recombine (educational, non-SLIP-39)  
**Spec:** `.agents/specs/2026-08-08-shamir-recombine.md`  
**Live:** https://bip39.catalyxt.xyz/ (nginx root → `web/`)

## What shipped

- Close educational Shamir recombine loop: Verify recombine + Fill M from cards
- Step rail step 4 · Recombine; match/mismatch vs practice secret
- Unit edges: under-threshold, duplicate index, malformed parse
- E2E S53–S56 + Comet/ROADMAP alignment (still **not SLIP-39**)
- Site version stamp remains `v0.13.2` via `scripts/stamp_site_version.py`

## Version stamp

```bash
echo 0.13.2 > VERSION
python3 scripts/stamp_site_version.py
# package.json + pyproject.toml match
```

## Smoke (this release)

| Step | Exit |
|------|------|
| `python3 scripts/product_smoke.py --root .` (unit + e2e) | 0 |
| `python3 scripts/check_web_e2e.py --root .` | 0 (67 Playwright S-ids; surfaces ok) |
| `python3 scripts/stamp_site_version.py` | 0 → v0.13.2 |
| Open PRs (`gh pr list --state open`) | empty / n/a on this branch |

## Evidence pack (B5)

- **smoke:** product_smoke unit + e2e exit 0
- **hard_gates / pytest:** PR_DRAFT evidence pack; `tests/test_shamir.py` recombine cases
- **web_e2e:** check_web_e2e ok (strict, 7 specs)
- **Note:** `validate.py full` system-python missing ruff/mypy/pytest; product smoke uses `.venv` and is green

## Infra

- No product INFRA_RUNBOOK surface → skipped

## Rollback

1. Redeploy previous tag: `git checkout v0.13.1` → sync `web/` to nginx root  
2. Or revert merge commits for Shamir recombine gap-check + release closeout  
3. Confirm live `data-site-version` / footer shows expected tag after deploy  

## §9 operator checks (≥3)

1. Offline CSP on Shamir page still `connect-src 'none'` (no share leak path)  
2. Recombine under-threshold / bad input fails closed (no silent wrong secret)  
3. Educational banner / not-for-real-funds copy present  
4. Version chip shows `v0.13.2` after deploy  

## Post-release

1. Tag `v0.13.2` on release commit  
2. Push `master` + tags to `buzz/main` (or product remote) when operator approves  
3. Deploy `web/` to bip39.catalyxt.xyz  
4. `/sync_docs` → pipeline `init`  
