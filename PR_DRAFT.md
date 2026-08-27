# PR Draft: v0.16.62 V2 UC8 same-face `/api/mempool/tx/` (connect-src self)

**Spec:** `.agents/specs/2026-08-27-v2-uc8-paste-psbt.md`
**Plan:** `.agents/specs/2026-08-27-v2-uc8-paste-psbt-plan.md`

## What Problem This Solves

UC8 inspect is live, but the V2 tab could not fetch a public tx (`connect-src 'none'`). After leak-ack, the learner must inspect a live Bitcoin tx **on that face** via same-origin `/api/mempool/tx/<txid>`. Classroom samples with no prevout stay honest not-found with no fetch. Network lookup stays.

## Why This Change Was Made

WINDOW 6 UC8 leftover only. Open `/v2/` `connect-src` to `'self'` only. Do not add mempool.space to v2 CSP. Do not hide `/network.html`. No Sign. Do not mix UC6. Do not reopen UC1–5. No Imagine.

## User Impact

Chip **v0.17.105-v2**. Product **0.16.62**. After Inspect + leak-ack with a prevout, UC8 fetches the proxy on this tab. `#v2PsbtNetOpen` still docks Network. Classic `/` cache-bust only; Lab CSP still `'none'`.

## Traceability

| AC | Test |
|----|------|
| AC-1 | V2-S34 `test_ac_1_textarea` |
| AC-2 | V2-S37 `test_ac_2_inspect_paste` |
| AC-3 | V2-S34 `test_ac_3_refuse_secret` |
| AC-4 | V2-S37 S38 CSP `'self'` `test_ac_4_classic_psbtin` `test_network_static_and_lab_csp` |
| AC-5 | V2-S38 `test_ac_5_network_lookup_stays` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S34|V2-S37|V2-S38"`

## Threat notes

- secrets: inspect refuses seed; V2 fetches same-origin proxy only after leak-ack
- xss: textContent; txid hex in path
- csrf: GET lookup; no cookies required

## Evidence pack

hard_gates; Playwright V2-S34 S37 S38; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. Classroom sample has no txid by design
2. Dual stamp 0.16.62 vs 0.17.105-v2
3. leftover scripts stay uncommitted
4. UC6 not in this stamp
5. no Sign
6. Playwright mocks `/api/mempool/tx/**` because python http.server has no nginx proxy
7. Network page still allowlists mempool.space; V2 does not

## Cross-review

Blockers 0.
