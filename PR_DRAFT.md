# PR Draft: v0.16.2 post-Comet polish + S70 dock + S67 mobile

**Spec:** `.agents/specs/2026-08-11-intermediate-advanced-paths.md`  
**Spec waiver:** chore  

## What Problem This Solves
After v0.16.1 live Comet (89/90): Multisig I1 dock broke when Classroom loaded `learn-levels` on shell pages; mobile address table overflowed the page; status chips inconsistent; Comet doc/S-id drift; passphrase strength UX; CI daytime green path.

## Why This Change Was Made
Patch ship bundling QA-201 S70 fix, S67 table scroll, chip parity, Comet SoT (Extra help, S0–S71, live `/docs/`), passphrase strength, and CI smoke helpers without changing crypto safety model.

## User Impact
- I1 Multisig **Mark passed & return** dock works again  
- ~390px: address table scrolls inside `#tableScroll` (no page sideways overflow)  
- Offline / Network / airgap chips on Shamir, SLIP-39, Network  
- Live Comet URL: `/docs/E2E_COMET_SCENARIOS.md` + stale-copy banner  
- Passphrase strength tiers + bar; clearer empty copy  

## Evidence pack
- hard_gates / product_smoke / check_web_e2e / pytest  
- CODE-REVIEW / CROSS-REVIEW / BEHAVIOR_REPORT  
- Live Comet 89/90 (S67 PARTIAL → fixed)  

## Evidence
| Check | Result |
|-------|--------|
| secrets v0.16.1…HEAD | (pr_review) |
| hard_gates | (pr_review) |
| smoke unit+e2e | (release) |

## Traceability
| AC | Test |
|----|------|
| S70 Multisig I1 dock | e2e learn S70 · isLabIndexPage |
| S67 mobile table | e2e learn S67 metrics |
| S40b Classroom shells | e2e site-chrome S40b |
| Comet S-ids | check_web_e2e · stamp_comet_header |
| Passphrase strength | S3 · test_entropy_ui |

## Red-proof / TDD
| Phase | Command |
|-------|---------|
| red_cmd | S70 failed dock hidden; check_web_e2e missing S40b |
| green_cmd | `npx playwright test e2e/learn.spec.ts -g S70` · `check_web_e2e` · `pytest -q` |

## Untested paths
| Path | Reason |
|------|--------|
| .github/workflows/* | CI-only; smoke_ci path |
| config/ | untracked local; not in ship |
| scripts/ops_dashboard.py | harness portfolio tooling; not product runtime surface for this ship |
| scripts/product_plugin.py | harness load path; exercised via product_smoke / hard_gates |
| scripts/product_smoke.py | meta runner; exercised as release smoke |
| scripts/hard_gates.py | harness gate; exercised by pr_validator |
| scripts/check_property_tests.py | harness; optional property_tests |
| scripts/zap_baseline.sh | security CI helper; not unit-tested in-product |

## Threat notes
- **secrets** — progress/localStorage only  
- **xss** — static teach; glossary escapeHtml  
- **csp** — offline shells connect-src none  

## Things that look bad but are actually fine
1. Self-graded Intermediate Mark buttons.  
2. Network “Network opt-in” chip (not Offline crypto).  
3. Table may scroll horizontally inside container on mobile.  
4. Soft level gates.  

## Cross-review
See `.agents/artifacts/CROSS_REVIEW.md`.
