# RELEASE RUNBOOK — v0.12.3 Tools self-serve · 5-nav · online chip

**Phase:** approved → shipped  
**Score:** 100 (`origin/master...e519de6` + version bump)  
**Date:** 2026-08-07

## What shipped

1. **Tools Compare / descriptors** auto-generate a test mnemonic when Lab is empty; **Generate test phrase** button.
2. **Balance nav removed** (was CLI docs only). CLI + Knots guidance on **Network**; `#balance` → `network.html#netCardBal`.
3. **Online chip:** green = Browser online, red = Browser offline; permanent **(i)** tip (CSP vs air-gap).
4. **E2E / Comet:** 5-nav parity; S18/S18b/S24 updated.

## Smoke table

| Step | Command | Exit |
|------|---------|------|
| unit | `.venv/bin/python -m pytest -q` | 0 (46 passed) |
| e2e | `npm run test:e2e` | 0 (product_smoke) |
| hard_gates | `python3 scripts/hard_gates.py --diff origin/master...HEAD` | ok |
| secrets | `check_secrets_diff origin/master...HEAD` | clean |
| web_e2e contract | `python3 scripts/check_web_e2e.py --root .` | ok |
| compliance | `.venv/bin/python scripts/compliance_engine.py --diff origin/master...HEAD` | ok |
| pr_validator | `.venv/bin/python scripts/pr_validator.py --diff origin/master...HEAD --update-pipeline` | 100 → approved |

## Evidence pack (B5)

- hard_gates ok (CODE-REVIEW, BEHAVIOR-REPORT, Spec, Red-proof, Evidence pack)
- product smoke unit + e2e exit 0
- pytest 46 passed
- CODE-REVIEW / CROSS-REVIEW / BEHAVIOR artifacts under `.agents/artifacts/`

## Infra

- No new infra. Lab CSP unchanged (`connect-src 'none'`). Network still mempool.space / optional `/api/mempool` on Catalyxt.
- Live deploy: rsync/static host for `web/` as usual (see `docs/BIP39_HOST.md`).

## Rollback

```bash
git checkout v0.12.2 -- web/ e2e/ docs/E2E_COMET_SCENARIOS.md
# redeploy web/
```

Or `git revert` the v0.12.3 commit range.

## §9 — look bad but fine

1. Online=green / offline=red is connectivity semantics; (i) still explains air-gap caution.
2. Tools auto-generate fills shared Lab `#mnemonic` — intentional.
3. Removing Balance nav is not loss of balance feature (Network + CLI).

## URLs

- https://bip39.catalyxt.xyz/
- https://bip39.catalyxt.xyz/multisig.html
- https://bip39.catalyxt.xyz/network.html

## Version

- Tag: **v0.12.3**
- `package.json` → 0.12.3  
- `pyproject.toml` → 0.12.3  
