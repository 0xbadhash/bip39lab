# G — Coordinator vs signer one-liner

- **Product:** bip39lab
- **Created:** 2026-08-13
- **Status:** ready-for-agent
- **Priority:** P2
- **Constitution:** AGENTS.md

## Problem Statement

Banner says calculator-only. Learners still miss: receive/watch does not need devices; spend does.

## Solution

Strengthen `#msCoordNote` (or banner): this pane is a coordinator; it cannot spend; receive/watch does not require the keys to be present.

## Acceptance Criteria

- [ ] Visible sentence contains coordinator and cannot spend
- [ ] Mentions receive/watch without devices
- [ ] Playwright **S78**
- [ ] Extra help Off still keeps this as safety copy (not teach-only)

## Out of Scope

New page, hardware.
