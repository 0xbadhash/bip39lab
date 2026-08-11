# PR Draft: v0.16.1 Multisig teach + quiz dock Mark parity + Comet stamp

**Spec:** `.agents/specs/2026-08-11-intermediate-advanced-paths.md`  
**Spec waiver:** chore  

## What Problem This Solves
After v0.16.0 Intermediate/Advanced paths: Comet header lagged S-ids; Multisig teach copy was jargon-heavy; I1–I3 only had Back without Mark-on-dock; QA found quizReturn key drift and fee edge cases.

## Why This Change Was Made
Patch release bundling post-ship QA fixes + Multisig classroom clarity + site-wide Mark passed & return on Intermediate docks + auto-stamp Comet blurb.

## User Impact
- Multisig checklist: vault-verify + cosigner-replace ⓘ; zpub vs compressed pubkey teach  
- Dock: **Mark I1/I2/I3** on Multisig/Shamir/SLIP-39; **Mark I4/A*** on Lab dock  
- Comet header auto-stamped S0–S71 from VERSION + Playwright  
- quizReturn accepts `1|quiz|intquiz|advquiz`; safer fee math; entropy dock less noisy  

## Evidence pack
- hard_gates / product_smoke / check_web_e2e / pytest  
- CODE-REVIEW / CROSS-REVIEW / BEHAVIOR_REPORT  

## Evidence
| Check | Result |
|-------|--------|
| secrets v0.16.0…HEAD | clean |
| hard_gates | (at pr_review) |
| pytest + e2e | S70/S71 + suite |

## Traceability
| AC | Test |
|----|------|
| Multisig teach BIP67/vault/replace/zpub | e2e S46, S12b · test_multisig |
| Mark I1 dock | e2e S70 |
| Mark I4 Lab dock | e2e S71 |
| Comet stamp S0–Smax | stamp_comet_header · test_stamp_comet_header |
| quizReturn keys | test_quiz_return_keys |
| Fee guards | test_network_api |

## Red-proof / TDD
| Phase | Command |
|-------|---------|
| red_cmd | pytest tests/test_stamp_comet_header.py tests/test_quiz_return_keys.py (added first, then green) |
| green_cmd | `.venv/bin/python -m pytest -q` + `npx playwright test e2e/learn.spec.ts -g "S70\|S71"` |

## Untested paths
| Path | Reason |
|------|--------|
| Live Multisig after deploy | needs push/deploy |
| web/js/glossary.js | covered by e2e S46/S12b tip panels + terms present in HTML data-term; static TERMS load only |

## Threat notes
- **secrets** — progress localStorage only  
- **xss** — glossary escapeHtml on tips  
- **integrity** — educational self-check  

## Things that look bad but are actually fine
1. Self-graded Intermediate marks (no auto crypto pass).  
2. Cosigner replace = new vault + move, not edit-in-place (Bitcoin).  
3. zpub shown but not used in M-of-N script (intentional teach).  
4. Soft level gates.  

## Cross-review
See `.agents/artifacts/CROSS_REVIEW.md`.
