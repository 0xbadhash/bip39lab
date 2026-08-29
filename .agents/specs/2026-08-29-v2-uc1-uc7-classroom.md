# V2 UC1 classroom + UC7 Try honesty + UC16 word count

- **Product:** bip39lab
- **Created:** 2026-08-29
- **Status:** ready-for-agent
- **Priority:** P0
- **Plan:** `.agents/specs/2026-08-29-v2-uc1-uc7-classroom-plan.md`
- **Surface:** `/v2/` UC1, UC7, UC16
- **Grill-me:** complete

## Problem

UC1 BIP-39/entropy copy was adult jargon and two stacked blues; paste of 12 dictionary words without checksum looked like a bug. UC7 Try aborted on one odd-hex line; SLIP printout was a locked `<pre>`. UC16 generate had no 12–24 select; restore was hardcoded 12.

## Solution

Kid-readable merged UC1 classroom + (i) tips; entropy meter explained. Paste distinguishes count vs checksum. Shamir Try skips unreadable lines and uses any M-subset. SLIP printout is an editable textarea; share 1–3 are one-row editable. UC16 word count before generate; restore N matches.

Chip `v0.17.132-v2`. Product `0.16.82`. No Sign. XOR stays 12-only.

## Acceptance

| ID | Criterion |
|----|-----------|
| AC-1 | UC1 `#v2Bip39What` one box; BIP-39 spec link; entropy classroom `#v2EntropyWhat`. |
| AC-2 | Paste 12 random dictionary words → checksum fail copy, card empty. Golden abandon…about still works. |
| AC-3 | Shamir Try: odd-hex extra line still matches on two good shares. |
| AC-4 | UC16: `wordCountSelectHtml` before `#v2Generate`; restore uses `restoreWordCount()`. UC32 still 12-only. |

## Grill-me

**Status:** complete  
**Date:** 2026-08-29

### G1 Outcome
- Q: Done?
  - A: An 11-year-old can read the card vs mailbox and entropy meter; paste explains checksum; UC7 Try uses any working M; UC16 length matches restore.

### G2 Non-goal
- Q: Kill?
  - A: Do not accept invalid checksums. Do not 24-word XOR. Do not clone Suite.
