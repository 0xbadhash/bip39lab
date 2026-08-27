# PR Draft: v0.16.66 V2 UC10 live lookup in-tab

**Spec:** `.agents/specs/2026-08-27-v2-uc10-live-lookup.md`
**Plan:** `.agents/specs/2026-08-27-v2-uc10-live-lookup-plan.md`

## What Problem This Solves

UC10 leftover: live fees/traffic/address lookup existed only on `/network.html`. V2 only docked.

## Why This Change Was Made

WINDOW 6 UC10 only. Copy Network job onto the UC10 pad via `/api/mempool` after leak-ack. CSP stays `'self'`. Do not reopen UC8. No Sign.

## User Impact

Chip **v0.17.109-v2**. Product **0.16.66**. Tick leak-ack, Fetch fee + traffic, optional address. Failures unknown. Network room stays. Classic `/` cache-bust only.

## Traceability

| AC | Test |
|----|------|
| AC-1 | V2-S42 `test_ac_1_unknown_not_zero` |
| AC-2 | V2-S42 CSP `test_ac_2_fees_self` |
| AC-3 | V2-S43 `test_ac_3_address_unknown` |
| AC-4 | V2-S42 ack gate `test_ac_4_ack_gate` |
| AC-5 | V2-S43 Open Network `test_ac_5_network_room_stays` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S42|V2-S43"`

## Threat notes

- secrets: address-only; refuse seed-looking paste
- xss: textContent
- csrf: GET lookup

## Evidence pack

hard_gates; Playwright V2-S42 S43; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. python http.server has no proxy — e2e mocks
2. Dual stamp 0.16.66 vs 0.17.109-v2
3. leftover scripts uncommitted
4. UC8 not in this stamp
5. no Sign
6. Network page still allowlists mempool.space; V2 does not

## Cross-review

Blockers 0.
