# V2 use-case design principles

Anchored from operator layout work on UC1–UC3 (and classroom/paste/quiz follow-ups). Apply to every UC unless a pad’s **job** is clearly different.

## Always keep

1. **Do / Do not** (green / red) at the top of a practice pad. Two columns on wide screens; stack on narrow.
2. **Teach vs result.** Blue classroom = story. Orange meter, `pre`, tables = what this pad produced. Do not mix them into one blob.
3. **Classroom copy:** three short lines, plain English, adults and teenagers (no “grown-ups”). Name the term in the sentence, then `. (i)` — never a lone (i). **BIP-39, SLIP-39, PSBT, UTXO, BIP-352** in a blue box always get (i) and a short description. Spell ideas; do not say “UC5” inside the blue box.
4. **Entropy is a result.** The lock | blue classroom / orange meter cluster appears **after** a real BIP-39 list exists (Make practice words or a valid paste). Dropdown length is not a fake 128-bit preview.
5. **That cluster layout:**
   ```
   [ lock 8.5rem ] [ blue — what entropy means ]
                   [ orange — Entropy N bits · this list … ]
   ```
   4px between lock and stack. Orange sits **under the blue**, not under the lock. Space between “Entropy” and the bit count.
6. **Mint controls:** word-count dropdown **above** **Make practice words**. English-words (i) under the BIP-39 classroom when that classroom is on the pad.
7. **Address / look-at-card pads** do not repeat the lock + orange stack. At most a one-line chip (`12 words · 128 bits`).
8. **Paste practice (when present):** three verdicts — not at all; words in the dictionary but checksum/entropy not (still fill the card, do not derive); all fine.
9. **Quiz:** if the track had a single question, use **three**. Continue stays locked until each is right. Leave existing 4–5 question banks.
10. **Stacked field then button:** **0.85rem** gap. Direct-child stacked buttons in `.v2-pad` (`button.btn + *`) get that gap before the next line (help **div** or **p**, e.g. UC33 **Not armed.**, UC34 refresh note). Help text uses **0.92rem** (same as `.card p`), not the 0.8rem global `.control-help`. Horizontal mint rows stay side-by-side.
11. **Coins leaving are a result.** If the lesson is *someone else can spend now* (malware, seed typed into a laptop, savings on a hot phone), **animate** the teaching balance to `0.000 BTC` — red drain bar + counting number. Do not snap to zero. **Do not drain** when the coins are still there: they-hold freeze, lost paper, unknown-is-not-zero. Those keep the number and change the caption.

## Defaults (not asked as a fork)

- **Entropy cluster** on pads whose job is *mint a BIP-39 English list* (UC1 generate, UC1 try length, UC3 same words, UC16 generate, **UC7 Shamir generate**, **UC32 XOR 12-word source**). Bind the cluster to *that pad’s* phrase (`shamirMnemonic` / `xorSrc`), not a leftover First-wallet card. Not on dice (own lock+die), SLIP shares, or receive-address pads.
- **Metaphor face** (same 8.5rem | blue classroom) on pads that do *not* mint entropy: UC5 binoculars (look, cannot spend), UC7 mint (**one secret** card — reuse this file wherever that classroom title exists), UC7 split (hex shards, any 2 rebuild), UC7 try M (good pieces + a bad extra; cannot sign), UC7 SLIP-39 (three paper lists, any 2 of 3), UC12 leaking phone, UC13 hot/cold split, UC15 two vaults (same words + extra door), UC22 firmware hash (device fingerprint vs maker site), UC35 same 12 words / two apps (BIP-39 ≠ Electrum). Do not reuse the entropy lock for those stories. The generate pad still uses the entropy lock under the word grid.
- **Quiz length:** convert remaining **one-question** quizzes to three. Keep five-question quizzes (path, 2-of-3, PSBT, …).

## Do not

- Drop Do / Do not.
- Show entropy before a list exists.
- Treat checksum-fail lists as valid entropy or derive addresses from them.
- Talk down; do not hide the term behind (i).
