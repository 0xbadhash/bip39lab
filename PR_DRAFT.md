# PR Draft — v0.16.91 Sovereign Sessions UC stamp (UC14 / UC6+A/B/C / UC21 / UC36)

**Spec:** `.agents/specs/2026-09-16-v2-sovereign-uc-stamp.md`
**Brief:** `/opt/second-brain/vault/agent-tasks/briefs/BRIEF-W6-BIP39-SOVEREIGN-UC-STAMP-2026-09-16.md`
**Learn SoT:** `/opt/second-brain/vault/raw/2026-09-16_learn-SovereignSessions-BIP39-UCs.md`

## What Problem This Solves

CEO-stamped Sovereign Sessions classroom gaps: UC14 offline-verify / online-bip39 wall; UC6 vault-map + recovery-drill + vendor-diversity; UC21 phone/hardware/server + cloud vs BIP-39 paper; missing trusted-helper practice UC36.

## Why This Change Was Made

BRIEF-W6-BIP39-SOVEREIGN-UC-STAMP-2026-09-16. Prefer finishing OPEN A/B/C over inventing a map UC#. Practice lab only.

## User Impact

- UC14: SeedSigner-shaped offline verify storyboard; Do-not funded words into online bip39 tools; weak-pad stays.
- UC6: classroom vault map / rebuild / vendor beats; Multisig S72–S74 remain; ROADMAP A/B/C DONE.
- UC21: phone·hardware·server 2-of-3; cloud kit ≠ BIP-39 paper; this tab does not run BitKey/Casa.
- UC36: trusted helper practice (adjacent UC18); no real social recovery.

## Evidence

- Playwright V2-S0 S11 S15 S35 S188 S189 S190 PASS
- Multisig S72 S73 S74 PASS
- pytest 242 PASS
- VERSION 0.16.91 · V2 0.17.140-v2 lockstep

## Red-proof / TDD

- red: deep-link `n <= 35` blocked UC36; S190 failed gate; green after `n <= 36`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S0|V2-S11|V2-S15|V2-S35|V2-S188|V2-S189|V2-S190"`

## Traceability

| AC | Evidence |
|----|----------|
| UC14 offline verify + Do-not | V2-S188 `#v2Uc14Story` |
| UC6 map/vendor classroom + A/B/C | V2-S11/S35 + S72–S74 |
| UC21 phone/hw/server + cloud | V2-S189 |
| UC36 helper practice | V2-S190 picker 36 |
| VERSION lockstep | 0.16.91 + 0.17.140-v2 + comet + PLAYWRIGHT_LAST |

## Threat notes

- secrets: practice only; no funded phrases on website
- FROST: teach contrast only — not claimed
- UC32: not reopened

## Evidence pack

- smoke/web_e2e: check_web_e2e + targeted Playwright
- pytest: 242 passed

## Cross-review

Blockers: 0 (small classroom polish; CEO stamp).

## Things that look bad but are actually fine

Classic Multisig A/B/C already shipped earlier; this ship marks ROADMAP DONE and teaches the same beats in V2 UC6.
