# RELEASE RUNBOOK — v0.13.4

**Date:** 2026-08-09  
**Tag:** `v0.13.4`  
**Task:** Multisig teach UX polish  
**Spec:** `.agents/specs/2026-08-09-multisig-teach-ux.md`  
**Score:** 100 (phase approved → shipped)  
**Live:** https://bip39.catalyxt.xyz/ (nginx root → `web/`)

## What shipped

- Multisig **address calculator only** banner and jump-link step rail (not a locked wizard)
- Dual chips: offline crypto + browser online/offline (Lab-aligned)
- BIP67-off warning; zpub ≠ xpub; before-fund verify copy
- Fairer Ian Coleman comparison note
- Teach/UI only — no multisig crypto path / bundle change; no secret retention

## Version stamp

```bash
echo 0.13.4 > VERSION
python3 scripts/stamp_site_version.py
# package.json + pyproject.toml match
```

## Smoke (this release)

| Step | Exit |
|------|------|
| `python3 scripts/product_smoke.py --root .` (unit + e2e) | 0 |
| `python3 scripts/check_web_e2e.py --root .` | 0 (67 Playwright S-ids; surfaces ok; strict) |
| `python3 scripts/stamp_site_version.py` | 0 → v0.13.4 |
| Open PRs (`gh pr list --state open`) | empty / n/a |
| Infra | skip (no INFRA_RUNBOOK) |

## Evidence pack (B5)

- **hard_gates:** pipeline phase approved, score 100; PR_DRAFT Evidence pack present
- **smoke:** product_smoke unit + e2e exit 0 (pytest -q; npm run test:e2e)
- **web_e2e:** check_web_e2e ok (strict, 7 specs, 67 S-ids)
- **pytest (multisig):** tests/test_multisig.py contracts + golden 2-of-2
- **playwright:** e2e/multisig.spec.ts (S26/S28 teach surfaces)
- **secrets / SBOM:** no dep change; no seed/xprv retention; CSP connect-src none

## Rollback

1. `git checkout v0.13.3 -- web/ docs/ VERSION package.json pyproject.toml RELEASE_RUNBOOK.md`
2. `python3 scripts/stamp_site_version.py` → v0.13.3
3. Redeploy `web/` to nginx root; confirm https://bip39.catalyxt.xyz/ loads prior Multisig copy

## §9 (≥3)

1. Multisig surface remains a **pubkey calculator** — not a funded-wallet or PSBT signer.
2. Dual chips can disagree (browser online vs CSP offline crypto); both signals are intentional.
3. Deploy is static `web/` copy; git tag does not auto-push live until operator deploys.
4. Demo mnemonics must never be funded; before-fund verify is teach copy only.
5. Portfolio harness reinstall N/A (product ship, not agent-harness SoT).
