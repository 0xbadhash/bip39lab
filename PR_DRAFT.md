# PR Draft: v0.16.61 V2 UC8 Network dock after inspect

**Spec:** `.agents/specs/2026-08-27-v2-uc8-paste-psbt.md`
**Plan:** `.agents/specs/2026-08-27-v2-uc8-paste-psbt-plan.md`

## What Problem This Solves

Paste/inspect is live. If a prevout txid exists, lookup must happen on Network (leak-ack), not inside V2. Classroom samples have no txid — say not found honestly.

## Why This Change Was Made

WINDOW 6 UC8 leftover only. No V2 connect-src. No Sign. Do not mix UC6. Do not reopen UC1–5.

## User Impact

Chip **v0.17.104-v2**. `#v2PsbtNet*` dock. `network.html?txid=` after `#balAck`. Classic `/` cache-bust only.

## Traceability

| AC | Test |
|----|------|
| AC-1 | V2-S34 `test_ac_1_textarea` |
| AC-2 | V2-S37 `test_ac_2_inspect_paste` |
| AC-3 | V2-S34 `test_ac_3_refuse_secret` |
| AC-4 | V2-S37 CSP `test_ac_4_classic_psbtin` |
| AC-5 | V2-S37 `test_ac_5_network_dock_no_v2_fetch` |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts -g "V2-S34|V2-S37"`

## Threat notes

- secrets: inspect refuses seed; V2 does not fetch
- xss: textContent; txid hex in query
- csrf: none

## Evidence pack

hard_gates; Playwright V2-S34 S37; pytest; CODE-REVIEW; BEHAVIOR-REPORT; CROSS-REVIEW.

## Things that look bad but are actually fine

1. Classroom sample has no txid by design
2. Dual stamp 0.16.61 vs 0.17.104-v2
3. leftover scripts stay stashed
4. UC6 not in this stamp
5. no Sign

## Cross-review

Blockers 0.
