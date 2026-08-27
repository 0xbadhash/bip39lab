# V2 UC7 SLIP-39 extra secret (same two shares)

- **Product:** bip39lab
- **Created:** 2026-08-27
- **Status:** ready-for-agent
- **Surface:** `web/v2/` UC7 after 2-of-3 SLIP-39
- **Grill-me:** complete (operator: 3 split, 1 fail, 2 succeed, then passphrase with/without)

## Idea

Do not treat the extra string as a fourth share or a BIP-39 25th word. After the learner mints **3** lists, **fails with 1**, **matches with 2**, unlock those **same two lists twice**: empty extra vs practice extra `lab`. Paint both recovered hexes. They must **differ**. Extra secret = another vault, not another paper.

## Acceptance

| ID | Criterion |
|----|-----------|
| AC-1 | SLIP-39 pad checklist: 3 lists, try 1 fail, try 2 match. Pause locked until 1+2. |
| AC-2 | Next pad: Compare both unlocks. Empty extra MATCHES practice hex. `lab` DIFFERENT hex. |
| AC-3 | Copy says not BIP-39 25th, not a fourth share, not a spend. No Sign. |
