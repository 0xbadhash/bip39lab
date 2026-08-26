# V2 tracks polish (UC3/4/14/20/22 + quizzes)

- **Product:** bip39lab
- **Created:** 2026-08-26
- **Status:** ready-for-agent
- **Priority:** P0
- **Plan:** `.agents/specs/2026-08-26-v2-tracks-polish-plan.md`
- **Surface:** `web/v2/`

## Problem Statement

Compare still needed a button; pad mint sat far right; UC20 plate showed only four letters; quizzes always put the right answer first and used jargon; UC22 unbox and “refuse laptop seed” were slogans; UC4 folders did not show that receive and change carry different teaching amounts.

## Solution

Live compare without Compare; colored passphrase estimates; mint button beside Word count; plate cells full word → four-letter stamp; shuffled plain-English quizzes; UC22 firmware examples (Ledger/Trezor/Coldcard/Tangem) then notes-file vault stays hot; UC4 green amount chips beside addresses; receive vs change pair. Dual stamp product `0.16.54` / chip `0.17.88-v2`. Classic `/` cache-bust only.

## Acceptance

| ID | Criterion |
|----|-----------|
| AC-1 | No `#v2Cmp`; live estimates; mint beside `#v2EntWc` |
| AC-2 | UC20 `#v2StampPlate` 12 cells with full word and stamp |
| AC-3 | Quizzes shuffle; options are full sentences |
| AC-4 | UC22 authenticity cards + notes-file vault stays hot |
| AC-5 | UC4 `#v2FolderAmt` chip changes with folder; receive ≠ change amounts |
| AC-6 | Chip `0.17.88-v2`; classic `#btnGenerate` remains |

## Grill-me

Q: Are teaching BTC amounts on-chain?
A: No. Labeled not a chain lookup.

Q: Does importing a laptop seed become cold?
A: No. Same secret stays hot.

Q: Photoreal atoms?
A: No. Existing kit / faces only.

## Testing Decisions

V2-S0 chip; S3 live compare; S10 folder amounts; S15 mint group; S21 plate; S22 UC22; pytest.
