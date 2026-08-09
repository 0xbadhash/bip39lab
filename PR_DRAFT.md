# PR Draft: Shamir teach copy + E2E doc align 0.13.2

**Range:** `buzz/main...HEAD`  
**Spec waiver:** chore

## What Problem This Solves

Shamir teach table was hard to scan (ambiguous “What is Shamir sharing?” vs Multisig vs BIP-39). E2E Comet doc had stale Playwright totals (64/60 vs 67), bare `S13` mapping, and no product/contract version stamp.

## Why This Change Was Made

Chore polish after v0.13.2 recombine ship: clearer learner copy on `shamir.html` + align exhaustive E2E MD with Playwright reality and `VERSION` 0.13.2.

## User Impact

- Clearer three-way comparison on Shamir page (threshold shares ≠ multisig keys ≠ BIP-39 phrase)
- Comet/report score sheet denominator **67**; Network map **S13b–d, S32–S35**
- Title stamp: `Product: 0.13.2 · Contract: 2 · Last aligned: 2026-08-09`

## Evidence

- `python3 scripts/check_web_e2e.py --root .` → playwright_s_ids=67 · ok
- `python3 scripts/hard_gates.py --diff buzz/main...HEAD`
- Targeted: shamir teach copy review; no crypto path change
- Smoke: product smoke when releasing

## Traceability

| AC | Test / smoke |
|----|----------------|
| AC-1 Teach table distinguishes Shamir / Multisig / BIP-39 | Manual + e2e S53 shamir surface still loads |
| AC-2 E2E MD score / total = 67 | `check_web_e2e.py` |
| AC-3 Network mapping drops bare S13 | `docs/E2E_COMET_SCENARIOS.md` developer table |
| AC-4 Product/contract stamp present | MD title block + report template |
| AC-5 No secrets / offline CSP unchanged | secrets diff; no network CSP edit |

## Threat notes

- **Assets:** practice secret / shares remain page-memory only; copy-only change on teach card.
- **Abuse:** clearer “not SLIP-39 / not multisig” reduces misuse of educational shares for funds.

## Red-proof

```text
red_cmd: n/a (chore copy + docs; behavior already covered by S53–S56)
green_cmd: python3 scripts/check_web_e2e.py --root .
```

## Things that look bad but are actually fine

1. **No VERSION bump required for this chore** if release is docs/UX only; live already on 0.13.2 crypto. Optional 0.13.3 only if deploy wants a distinct tag.
2. **Plugin still lists coarse S13** in web_e2e surface IDs — contract MD is authoritative exhaustive list.
