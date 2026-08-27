# PR Draft: v0.16.70 UC10 Network-matching fee snapshot

**Spec:** `.agents/specs/2026-08-27-v2-uc10-live-lookup.md`
**Plan:** `.agents/specs/2026-08-27-v2-uc10-live-lookup-plan.md`

## What Problem This Solves

UC10 dump was not the Lab Fees & traffic snapshot. Failed to fetch hid the real layout.

## Why This Change Was Made

Operator: return the same snapshot as `/network.html` (bands, example 140 vB, UTXO reminder, tip/mempool counts).

## User Impact

Chip **v0.17.113-v2**. Product **0.16.70**. Same copy and bands as Network. Still `/api/mempool` only (self). Snapshot OK on Catalyxt nginx.

## Traceability

| AC | Test |
|----|------|
| AC-1 | V2-S42 `test_ac_1_unknown_not_zero` |
| AC-2 | V2-S42 Snapshot OK bands `test_ac_2_fees_self` |
| AC-3 | V2-S43 `test_ac_3_address_unknown` |
| AC-4 | ack gate `test_ac_4_ack_gate` |
| AC-5 | Open Network `test_ac_5_network_room_stays` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S42|V2-S43"`

## Threat notes

- secrets: IP leak on snapshot; address optional
- xss: fee numbers via textContent / numeric HTML
- csrf: GET

## Evidence pack

hard_gates; Playwright V2-S42 S43; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. localhost without nginx still cannot snapshot
2. Dual stamp 0.16.70 vs 0.17.113-v2
3. leftover scripts uncommitted
4. no Sign
5. CSP still self, no mempool.space
6. 140 vB example matches Network

## Cross-review

Blockers 0.
