# Plan: V2 UC14 dice / coin entropy

**Spec:** `.agents/specs/2026-08-24-v2-uc-entropy-dice-coin.md`

## Approach

New TRACKS id 14. mem.entEvents. Estimate 2.58 / 1 bit like classic. Mint via SHA-256 + BIP39Lab.mnemonicFromEntropyBytes. +10 d6 for the 50-roll lesson. Atoms + Do/Do not + desc + quiz + force exit.

## Implementation

1. TRACKS 14, steps, chips, VIZ, three SVGs, `uc14` pads (few dice, mint words, coin / 50 d6, quiz, finish).
2. Wire roll/flip/+10/mint; boot `n <= 14`; V2 `0.17.24-v2`.
3. e2e V2-S0 count 14; V2-S13 includes 14; V2-S15 pad; Comet S-id.
