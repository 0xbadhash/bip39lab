# Behavior contract — UC32–35

- **Product:** bip39lab
- **Target:** `/v2/?uc=32` … `35`

## User tasks

1. Picker all-paths shows 35 cards.
2. XOR: one part fails; all parts succeed.
3. Timelock: heir locked until ticks; refresh resets; no Sign.
4. Descriptor: wpkh line; ack unlocks.
5. Electrum: BIP-39 tb1; Electrum note is wrong vault; no invented Electrum address.

## Must not

- Sign or broadcast
- Fund practice parts
