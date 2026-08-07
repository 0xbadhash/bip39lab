# RELEASE RUNBOOK — v0.13.0 Shamir educational tab

**Score:** 100 · **Spec:** `.agents/specs/2026-08-07-shamir-share-tab.md`

## Shipped

- Left-nav **Shamir** (step 3): offline educational GF(256) secret split (not SLIP-39)
- 6-nav: Lab · Multisig · Shamir · Network · Tools · Glossary
- Unit + Playwright S53–S55; glossary terms

## Smoke

| Step | Exit |
|------|------|
| pytest | 0 |
| npm run test:e2e | 0 |
| hard_gates | ok |
| pr_validator | 100 approved |

## Evidence pack

CODE-REVIEW, BEHAVIOR-REPORT, PR_DRAFT Red-proof, product_smoke

## Rollback

`git checkout v0.12.3 -- web/ src/ e2e/` and redeploy web/

## §9

1. Hand-rolled SSS is educational — banner + tests.  
2. No recombine UI by design (v1).  
3. 6-nav restored with a real feature after Balance removal.

## URLs

https://bip39.catalyxt.xyz/shamir.html
