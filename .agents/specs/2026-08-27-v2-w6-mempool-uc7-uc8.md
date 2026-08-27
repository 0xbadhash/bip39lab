# V2 mempool exception + UC7 extra secret + UC8 story/chain split

- **Product:** bip39lab
- **Created:** 2026-08-27
- **Status:** ready-for-agent
- **Priority:** P0
- **Plan:** `.agents/specs/2026-08-27-v2-w6-mempool-uc7-uc8-plan.md`
- **Surface:** `web/v2/` UC7, UC8, UC10; nginx `/v2/` CSP
- **Grill-me:** complete (operator: CSP exception; UC7 passphrase; UC8 separate story vs chain)

## Problem Statement

UC10 fee fetch failed because `/v2/` fell through Lab `connect-src 'none'` and V2 could not call mempool.space. Address lookup was a prose dump, not the Network fail-closed table. UC7 never showed SLIP-39 extra secret vs empty unlock. UC8 mixed classroom story with explorer fields.

## Solution

- V2 CSP `connect-src 'self' https://mempool.space` (HTML + nginx `location ^~ /v2/`). Fetch `/api/mempool` then mempool.space. Classroom fee snapshot if both miss. Address table matches Network (ok / 0 empty / unknown).
- UC7: 3 lists → try 1 fail → try 2 match → compare empty extra vs `lab` (two hexes differ).
- UC8: left classroom story, right chain fields only.
- Classic `/` still `connect-src 'none'`. No Sign.

Chip `v0.17.122-v2`. Product **0.16.75**.

## Acceptance

| ID | Criterion |
|----|-----------|
| AC-1 | V2 CSP includes mempool.space; UC10 proxy then public; classroom if both miss. |
| AC-2 | UC10 address table: 1 ok 0 empty vs unknown not fake zero. |
| AC-3 | UC7 extra secret pad: empty MATCHES, lab DIFFERENT. |
| AC-4 | UC8 `#v2TxStory` vs `#v2PsbtNetLive` chain-only. |
| AC-5 | No Sign. Classic Lab CSP none. |

## Grill-me

**Status:** complete
**Date:** 2026-08-27

### G1 Outcome
- A: Live fees like Network; address table; SLIP-39 extra vault; inspect story ≠ chain.

### G2 Non-goal
- A: No Sign. No classic Lab CSP open. No Suite.

### G3 Surface
- A: `/v2/` page-wide CSP (cannot be per-UC). Classic stays none.

### G4 Cheap
- A: Same fetch helper UC8+UC10.

### G5 Abuse
- A: Leak-ack still required. Fail-closed unknown. Practice extra `lab` only.

### G6 Verify
- A: V2-S41b S43 S47 S48 S49 S50.

### G7 Priority
- A: Operator asked ship chain now.

## Testing Decisions

- Green: Playwright S41b S43 S47–S50; pytest network CSP; `tests/test_ac_v2_w6_mempool_uc7_uc8.py`
