# PR Draft: v0.16.60 V2 UC6 policy builder + UC8 paste PSBT

**Spec:** `.agents/specs/2026-08-27-v2-uc6-policy-builder.md`
**Spec:** `.agents/specs/2026-08-27-v2-uc8-paste-psbt.md`
**Plan:** `.agents/specs/2026-08-27-v2-uc6-policy-builder-plan.md`
**Plan:** `.agents/specs/2026-08-27-v2-uc8-paste-psbt-plan.md`

## What Problem This Solves

UC6 showed three zpubs without a `wsh(sortedmulti…)` policy readout. UC8 could only inspect canned samples, not a paste.

## Why This Change Was Made

WINDOW 6 leftovers only. No signer. No Suite clone. Do not reopen UC1/UC3/UC4/UC5.

## User Impact

Chip **v0.17.100-v2**. `#v2MsPolicy` / `#v2MsDesc`. `#v2PsbtIn` / `#v2PsbtInspect`. Classic `/` cache-bust only.

## Traceability

| AC | Test |
|----|------|
| UC6 AC-1–4 | V2-S11 V2-S33 `test_ac_v2_uc6_policy_builder` |
| UC8 AC-1–4 | V2-S34 `test_ac_v2_uc8_paste_psbt` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S33|V2-S34"`

## Threat notes

- secrets: inspectPsbt refuses xprv/mnemonic; policy uses zpubs only
- xss: textContent on policy and inspect out
- csrf: none

## Evidence pack

hard_gates; Playwright V2-S0/S11/S33/S34; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. sortedmulti uses zpub strings (classroom), not hex compressed pubs from MultisigLab
2. Dual stamp 0.16.60 vs 0.17.100-v2
3. leftover scripts stay stashed
4. UC1–UC5 not reopened
5. no Sign

## Cross-review

Blockers 0.
