# Intermediate + Advanced learning paths (I1–I4, A1–A4)

- **Status:** done (implement; ship via /pr_review)  
- **Priority:** P1  
- **Level soft-gate:** `localStorage bip39lab.level` (`intermediate` | `advanced`)

## Problem

Starter has First hour; Beginner has Guided quiz (Q1–Q4). Intermediate/Advanced unlock Tour, BIP-85, Ops, PSBT, but have no self-check path parallel to Beginner — users raise Level and get no “what to do next.”

## Solution

Two self-graded quiz shells (same UX as Guided quiz: Go try → amber return dock → Mark passed):

### Intermediate — “Three splits + Tools depth”

| Id | Topic | Demo target |
|----|--------|-------------|
| **I1** | Multisig = **keys** (not shares of one blob) | `multisig.html` |
| **I2** | Shamir edu = **hex shares** (not BIP-39 words) | `shamir.html` |
| **I3** | SLIP-39 lab = **share words** (not Suite / not funded) | `slip39.html` |
| **I4** | PSBT **inspect-only** (no sign / no broadcast) | Tools `#cardPsbt` |

Progress: `localStorage bip39lab.intQuiz` `{ i1..i4: bool }`.

### Advanced — “Ops mind offline”

| Id | Topic | Demo target |
|----|--------|-------------|
| **A1** | BIP-85 **idea** (master → app child seeds; practice only) | `#cardBip85` |
| **A2** | **Watch-only** export (no xprv / no private keys on page) | Lab watch-only |
| **A3** | **Knots limits** (local node / seed-scan edu; not public farm) | `#cardOps` |
| **A4** | Lab **is / isn’t** (orientation table — not a wallet/scanner) | `#cardOrientation` |

Progress: `localStorage bip39lab.advQuiz` `{ a1..a4: bool }`.

## Acceptance criteria

- [ ] **AC-1** Intermediate: card `#cardIntQuiz` gated `data-level-min="intermediate"` with status board + I1–I4 Go try / Mark passed  
- [ ] **AC-2** Advanced: card `#cardAdvQuiz` gated `data-level-min="advanced"` with A1–A4 same pattern  
- [ ] **AC-3** Mark passed → green Passed chips; summary `n / 4`; browser-only localStorage; Reset buttons  
- [ ] **AC-4** Go try shows amber dock (in-page) or return link on external pages (`from=intquiz` / `from=advquiz`)  
- [ ] **AC-5** After Intermediate all-pass, offer raise Level to Advanced (soft); no auto wallet locks  
- [ ] **AC-6** Playwright **S68** Intermediate quiz shell; **S69** Advanced quiz shell  
- [ ] **AC-7** Comet scenarios S68/S69 documented in `docs/E2E_COMET_SCENARIOS.md`  
- [ ] **AC-8** Unit: HTML contains card ids + I/A copy anchors  

## Out of scope

- Auto-grading from crypto success  
- Full BIP-85 derivation  
- Server progress / accounts  
- Changing Beginner Q1–Q4 behavior  

## Traceability

| AC | Test |
|----|------|
| AC-1–3 | `tests/test_int_adv_paths.py` + e2e S68/S69 |
| AC-4 | e2e S68 Go try dock / return |
| AC-5 | e2e S68 raise Advanced control present when all passed (or button always) |
| AC-6–7 | `e2e/learn.spec.ts` + Comet |
| AC-8 | unit file exists + asserts |
