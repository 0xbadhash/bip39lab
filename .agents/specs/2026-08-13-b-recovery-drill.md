# B — Recovery drill (map vs keys-only)

- **Product:** bip39lab
- **Created:** 2026-08-13
- **Status:** ready-for-agent
- **Priority:** P1
- **Depends on:** A (vault map string exists)
- **Plan:** none
- **Constitution:** AGENTS.md

## Problem Statement

Learners do not feel the failure “2 keys without the map cannot uniquely rebuild the vault.”

## Solution

On Multisig, after a map exists: **Rebuild from map** parses the displayed `wsh(sortedmulti|multi(…))` and restates the same P2WSH. **Try without map** (only two raw pubs, no M/sort) shows an explicit error — not a fake address.

## Acceptance Criteria

- [ ] Rebuild from last map matches `#msP2wsh`
- [ ] Without-map path errors; does not invent an address
- [ ] Playwright **S73**
- [ ] Public material only

## Out of Scope

Importing foreign wallet files, spending.

## Clarifications

### 2026-08-13
- Q: Parse any descriptor?
  - A: Only the lab’s emitted `wsh((sorted)?multi(M,hex,…))`.
