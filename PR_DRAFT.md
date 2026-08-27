# PR Draft: v0.16.72 UC8 inspect classroom snapshots

**Spec:** `.agents/specs/2026-08-27-v2-uc8-paste-psbt.md`
**Plan:** `.agents/specs/2026-08-27-v2-uc8-paste-psbt-plan.md`

## What Problem This Solves

Inspect this transaction failed with Failed to fetch whenever `/api/mempool` was missing.

## Why This Change Was Made

Operator: inspect must work offline as a static tx or live fetch.

## User Impact

Chip **v0.17.115-v2**. Product **0.16.72**. Genesis / First transfer / Pizza day always inspectable. Live proxy if present; else classroom snapshot of real mainnet facts. No mempool.space on v2 CSP.

## Traceability

| AC | Test |
|----|------|
| AC-1 | V2-S34 `test_ac_1_textarea` |
| AC-2 | V2-S41 S41b `test_ac_2_inspect_paste` |
| AC-3 | V2-S34 `test_ac_3_refuse_secret` |
| AC-4 | CSP self `test_ac_4_classic_psbtin` |
| AC-5 | Network dock `test_ac_5_network_lookup_stays` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S41"`

## Threat notes

- secrets: public txids
- xss: textContent
- csrf: GET

## Evidence pack

hard_gates; Playwright V2-S41 S41b; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. Snapshot is real history, not a fake confirm
2. Dual stamp 0.16.72 vs 0.17.115-v2
3. leftover scripts uncommitted
4. no Sign
5. CSP still self
6. Random pasted txids without snap still unknown if proxy down

## Cross-review

Blockers 0.
