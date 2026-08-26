# V2 UC forensic leftover (unique use cases only)
Read from: ROADMAP.md, .agents/specs/2026-08-23-use-case-tracks.md, 2026-08-23-use-case-tracks-v2.md, 2026-08-24-v2-uc11-uc13.md, 2026-08-25-v2-uc14-15-stills.md, 2026-08-25-v2-p0-p2-tracks.md
Not extra features / skins / tools / nav. Practice lab: no wallet/signer/broadcast.

## Existing UCs
UC1 First wallet (safe and easy)
UC2 Paper backup discipline
UC3 Passphrase (25th word)
UC4 Path folders + BIP map
UC5 Watch-only
UC6 Shared custody multisig
UC7 Split secret Shamir
UC8 PSBT inspect / air-gap model
UC9 master to child / xpub threat
UC10 Network leak / fees / balances
UC11 Exchange IOU vs seed you hold
UC12 Hot software vs hardware signer
UC13 Hot vs cold
UC14 Dice / coin entropy
UC15 Pad + passphrase stack
UC16 Restore drill
UC17 Amount-tiered setup
UC18 Inheritance / incapacity
UC19 First receive
UC20 Metal
UC21 Collab custody
UC22 Hardware ceremony
UC23 Air-gap loop
UC24 Geographic keys
UC25 Annual rehearsal
UC26 Own node
UC27 UTXO / coin control
UC28 CoinJoin
UC29 Duress / decoy PP
UC30 BIP-85 child seeds
UC31 SLIP-39 operational inheritance

## Unique candidate UCs only
### SeedXOR N-of-N BIP39-part split
Why unique: UC7 is Shamir threshold hex; UC31 is SLIP-39 wordlist/threshold. SeedXOR is all-parts BIP39 decoy seeds, not M-of-N.
Source: https://seedxor.com/

### On-chain timelock dead-man inheritance
Why unique: UC18 is sealed packet / 2-of-3 / open-while-alive. This job is CSV inactivity unlock + refresh sweep; heir key cannot spend until the timer.
Source: https://lianawallet.com/resources/guides/inheritance/

### Descriptor / policy backup
Why unique: UC5/6 teach watch-only and multisig objects. This job is preserve the policy string so recovery is possible at all (keys alone fail).
Source: https://www.spark.money/research/bitcoin-inheritance-planning-guide

### Non-BIP39 Electrum seed recovery
Why unique: UC16 is BIP39 checksum + same address. This job is words that look like BIP39 but use Electrum KDF; BIP39 restore is empty.
Source: https://d-central.tech/bitcoin-wallet-recovery-matrix/
