# Use-case compare: classic Lab (v1) vs V2 tracks

- **Deeplink:** https://bip39.catalyxt.xyz/v2/compare.md
- **Local / repo:** `/v2/compare.md` · `web/v2/compare.md`
- **As of:** 2026-08-28
- **v1:** `/` · product stamp `v0.16.79`
- **v2:** `/v2/` · chip `v0.17.128-v2` · `/v2/VERSION` `0.17.128-v2`

Live compare.md lags until deploy. This repo file is source of truth.

**Missing** = classic Lab or a sibling room has a real control V2 does not yet wire **in-track**. Linking out to `/multisig.html` is Partial, not Yes.

V2 reuses `bip39lab.bundle.js` + `shamir-core.js`. Gaps are surface, not a second crypto stack. Classic `/` is unchanged.

---

## What landed since 0.16.79 / chip 0.17.128

- **Map vs leftover:** per-track “Still Lab-only” now matches leftover ports. Ported rows are Yes, not a fake remaining list.
- **UC34** refresh from this phrase (`#v2DescRefreshLab`) + paste/explain (`#v2DescPaste` / `#v2DescExplain`). Public only. Refuse xprv / seed / WIF. Copy on each descriptor line. Playwright **V2-S25 / V2-S53**.
- **UC32** XOR of the live 12-word card. If the card is not 12 words, offer a 12-word practice card. Hide one part fails. Combine all restores the same words. Playwright **V2-S23 / V2-S52**.
- **UC20** rail already live (paper → metals → 4 letters → solid vs tiles vs photo). No shop grid. Left alone.
- **UC19 P3 skipped this loop:** default remains simulated 0.000184 tBTC + Network dock. No in-track leak-ack lookup on UC19.

## What landed since 0.16.78 / chip 0.17.127

- **UC18 if I cannot speak (redo):** not a lecture. Four failing heir kits (chat, words without extra secret, one key of three, first try later). Packet is a **map** (shape + descriptor + where objects live + next drill date). Refuse live words, extra secret in the same envelope, chat screenshot. Open-while-alive: fail once, then sit with them. Not a will. Not UC33. Playwright **V2-S51**.
- **Teach vs result:** blue `teachBox` = what/why/when/how. Hex / table / txid / kit fail line = lab object.

## What landed since 0.16.77 / chip 0.17.126

- **UC8 inspect:** six named public txs — Genesis, First transfer, Pizza, **OP_RETURN note**, **Inscription 0**, **Runestone etch**. Classroom snap if proxy + mempool.space miss. **V2-S41 / S41b / S41c**.

## What landed since 0.16.75–0.16.76 / chip 0.17.122–0.17.125

- **V2 CSP** `connect-src 'self' https://mempool.space` (page-wide; same as Network). Classic Lab stays `connect-src 'none'`.
- **UC10** fee/traffic snapshot + address table like Network; classroom snap if both fetches miss.
- **UC7** extra-secret pad after SLIP-39; amber three-share warning; Shamir story vs hex.
- Blue classroom vs result on payload tracks (UC6–UC8, UC7 SLIP-39).

## What landed since 0.16.54 / chip 0.17.88

- **UC32–35** picker count 35: SeedXOR N-of-N parts · timelock edu FSM · descriptor policy backup · Electrum-looking words.

## What landed since 0.16.53 / chip 0.17.80

- UC20 plate: full word → four-letter stamp. Quizzes shuffled, plain English.
- UC22: Ledger/Trezor/Coldcard/Tangem firmware job; notes-file vault stays hot.
- UC4: green teaching-amount chips beside addresses; receive vs change pair.

## What landed since 0.16.52 / chip 0.17.78

- **UC3:** no Compare button; live table; colored weak/fair/stronger estimates.
- **UC14/15:** Build N practice words sits next to Word count.

## What landed since 0.16.51 / chip 0.17.75

- **UC3 live compare:** type A or B and the estimate row plus Receive #0 update without waiting for Compare. Three columns: beginner-key still, stacked A/B fields, story + table. Chip `0.17.78-v2`.

## What landed since 0.16.50 / chip 0.17.62

- **What this is / isn’t** on first `/v2/` visit (tracks wording). Hard refresh wipes ack + query string so the picker returns.
- **UC20 materials lab:** paper fails · metals (Next only stainless/titanium) · random 12-word 4-letter plate · solid plate only · quiz · I will not photograph the plate.
- **Custody kit:** `web/assets/catalyxt/custody/` hairline 96×48 + atom 220×88. Photoreal forbidden in V2 tracks.
- **UC3:** one **Generate N-word phrase** button; compare split fields | results.

## What landed since 0.16.49 / chip 0.17.54

- **Path language pass (UC1–UC31):** each gate has its own Is / Is not / Done when (full sentences, no `≠`). In-track primaries are verb+object. Pause says the next job.
- **Continue** after Mark done is the next incomplete card **in the current path** (Start here: First wallet → Paper backup; Keys: UC3 → UC14).
- **Hard refresh** is in the top bar next to **Clear secrets** (not inside About).
- **UC3:** words first; **Compare empty vs test secret**; forget-B beat.
- **UC4:** **Change folder** is the action (pause until you click). Receive vs change on the next step.
- **UC5/UC9:** **Copy viewing key** on export rows.
- **UC6/UC7/UC8:** separate keys vs Shamir (phrase first, M-of-N, then practice SLIP-39) vs inspect-only PSBT (**Inspect sample**; never Sign).
- **Shared / Over time / Advanced** section rails; Shared blurb `1 Multisig keys · 2 Shamir shares · 3 PSBT air-gap`.

## What landed since 0.16.48 / chip 0.17.53

- **UC2 do/do-not pad:** one Do / Do not block. No repeated “real money” paragraph, no extra BIP-39 (i) line on that step, no third “practice” reminder.
- **Key row:** same 0.82rem type as the body; caption **Something you know**.
- **Passphrase example:** four practice words (`word-word-word-word`) + **Make another example**. Practice only.

## What landed since 0.16.47 / chip 0.17.47

- **Picker is a path, not a catalog.** Default **Start here** (UC1, UC2, UC16). All paths is one click.
- **Hero cards:** step 1/2/3, Gap-kit atoms on the picker, START pill on the current first step, hover lift.
- **Progress geometry:** three dots + “N of 3 in Start here”; global N/31 is secondary. Finish → green ✓; **Next up · UC2**.
- **First paint:** Start here HTML skeleton (no blank main while JS boots).
- **Next · Keys and backup:** three ghost title cards (not a void, not the full grid).
- **Hard refresh** sits next to **Clear secrets** in the top bar (wipes `bip39lab.v2` progress). About V2 explains it. Clear secrets stays red.
- **UC1 lock:** caption **Stronger seed** (no `· 12-word`). Receive rows **Copy + QR**.
- Rooms in the sidebar stay dim vs Tracks.

## What landed since 0.16.46 / chip 0.17.46

- **P0–P2 tracks UC16–UC31** are interactive labs (not lectures). Picker **UC1–UC31**.
- **UC16** restore drill: hide card, type words, checksum + same address.
- **UC17** amount tiers: 0.001 phone · 0.184 HWW · 2.0 2-of-3; exchange/all-phone traps.
- **UC18** if I cannot speak: four failing heir kits; packet is a map (not seed+25th); open-while-alive after a fail; not a will.
- **UC19** first receive: test address + watch second view + simulated **0.000184 tBTC**; Network dock; never fund practice mainnet.
- **P1** UC20 metal · UC21 collab · UC22 ceremony · UC23 air-gap loop (tab never signs) · UC24 geo keys · UC25 annual rehearsal.
- **P2** UC26 own node (no node in-tab) · UC27 UTXO/change · UC28 CoinJoin agnostic · UC29 decoy PP (not advice) · UC30 BIP-85 (classic SoT) · UC31 SLIP-39 dock (`/slip39.html`; UC7 also has in-tab practice SLIP-39).

## What landed since 0.16.45 / chip 0.17.44

- **UC15 first pad:** dice → **~N bits** meter → lock → **key** on the right (Lab stills).
- **UC15 passphrase:** textarea **max 128** (64+ fine); estimate table is **fixed layout** so the Estimate column does not jump while typing.
- **UC14 lock:** starts **red**; green only when pad meets **this** word count (12→128 … 24→256). Switching 12→15/18/21/24 downgrades until more rolls.
- **UC11 / UC14 quizzes:** five questions each; Continue after all five are right.
- **UC11 you-hold:** two rounded cards (one-signer | 2-of-3); huge **0.184 bitcoin**.

---

## Pedagogy / chrome (all tracks)

- Picker **path**: Start here default; filters; UC1–UC31 behind All paths.
- **Clear secrets** — red, top-right header, every view.
- **Do / Do not** then `desc()`. Blue `done` callouts. Green = Do.
- Force-exit on every Finish. Rail + concept chips jump back.
- Dual stamp: product `v0.16.79` · V2 chip `0.17.128-v2`. Blue classroom vs lab/chain result on payload tracks.
- Plan / Practice / Review atoms on UC1–UC31.

---

## Operator highlights

| Highlight | v2 |
|-----------|-----|
| Clear secrets | Topbar, all views |
| Word count 12–24 | UC1 OS generate + UC14 pad mint |
| Test / Mainnet | UC1 `#v2Net` |
| Copy + QR addresses | UC1 `#v2AddrGrid` |
| Path SVG + change chain | UC4 |
| Watch-only copy/QR | UC5 / UC9 |
| PSBT + six named txs | UC8 inspect-only |
| Compare A/B table | UC3 after verdict |
| Room return-dock | UC6 / UC7 / UC10 → Finish |
| Dice / coin ENT | UC14 |
| Pad + passphrase stack | UC15 |
| They/you + 0.184 + 2-col hold | UC11 |
| Hot drain / hardware | UC12 |
| Hot vs cold sort | UC13 |
| Restore drill | UC16 |
| Amount tiers | UC17 |
| Heir object drill (not a will) | UC18 |
| First receive (sim tBTC) | UC19 |
| P1 metal…rehearsal | UC20–25 |
| P2 node…SLIP-39 | UC26–31 |

---

## Pedestal

| Job | v1 | v2 | Still missing on v2 |
|-----|----|----|---------------------|
| Entry | Rooms + First hour | **Start here path (UC1–2–16)** | Full 31 behind All paths |
| Gate | One ack | **Is / is not / Done when** | — |
| Clear secrets | Mnemonic row | **Topbar** | — |
| Network on derive | Lab select | **UC1 Test / Mainnet** | UC4 test; watch zpub main — on purpose |
| Theme / Extra help / Classroom | Yes | No | **Leave on `/`** |
| Force-exit | Banner | **Every Finish** | — |

---

## Per-track (v1 card → v2)

| UC | v1 home | v2 now | Still Lab-only |
|----|---------|--------|----------------|
| **1** First wallet | `#card-mnemonic` | Generate 12–24, paste `#v2PasteMn`, `#v2AddrType` 44/49/84/86, copy/QR, Test/Mainnet | Theme / Extra help / Classroom (leave on `/`) |
| **2** Paper backup | Strip + print | Card ack, do/do-not + PP example + generate | — |
| **3** Passphrase | `#cardCmpPp` | A/B + `#ppA/#ppB` + `#v2PpBarA/B` | — |
| **4** Path | `#cardPathPlay` | `#v2PathPlayTable` + `#v2PathPurpose` | — |
| **5 / 9** Watch / xpub | Tabs + QR | `#v2WoType` + viewing key + descriptor copy/QR. UC9 is leak copy on the same object | — |
| **6 / 7** Multisig / Shamir | Full rooms | `#v2MsPolicy` + `wsh(sortedmulti` ; hex + practice SLIP-39 | Suite clone (UC31 dock) |
| **8 / 10** PSBT / Network | `#cardPsbt` / `/network.html` | Six named txs; inspect; leak-ack fetch | Classic Lab CSP `none`; no Sign |
| **11–13** | Glossary only | Interactive labs | — |
| **14** | `#cardEntPad` | `#v2Dice10` + `#v2EntToLab` | — |
| **15** | PP + pad split | Dice · bits · lock · key | OS CSPRNG (leave) |
| **16** | Restore (gap) | Hide card, type from paper | — |
| **17** | Amount tiers (gap) | Place 0.001 / 0.184 / 2.0 | — |
| **18** | Inheritance (gap) | Heir kits + map packet + open-while-alive | A will / legal counsel (forbidden) |
| **19** | First receive (gap) | Sim 0.000184 tBTC + Network dock | **P3 skipped:** no in-track leak-ack lookup this ship |
| **20** | Metal (gap) | Paper fails · metals · 4-letter plate · solid vs tiles vs photo | Vendor USB drivers (leave) |
| **21–25** | P1 jobs | Collab, ceremony, loop, geo, calendar | Vendor drivers |
| **26–31** | P2 jobs | Node honesty, UTXO, mix, decoy, BIP-85 dock, SLIP-39 dock | Node in-tab; Suite clone |
| **32** SeedXOR | No dedicated card | Live 12-word XOR split / hide-one fail / combine | SeedXOR.com calculator (leave) |
| **33** Timelock FSM | No dedicated card | 90-day classroom timer | Live CSV signer (forbidden) |
| **34** Descriptor policy | `#cardDescriptors` + `#cardDescExplain` | `#v2DescRefreshLab` + `#v2DescPaste` + `#v2DescExplain` | Private descriptors (refused) |
| **35** Electrum-looking | BIP-39 restore only | Wrong-vault teach | Electrum KDF (forbidden) |

---

## Still leave on `/`

Theme, Extra help, Classroom, First-hour rail, `#cardOps`, vendor USB drivers, node in-tab, SLIP-39 Suite clone, Electrum KDF, live CSV signer, a will.

V2 now **points at** BIP-85 (UC30) and SLIP-39 (UC31 dock). Rooms stay SoT.

**Qualities already moved:** numbered card, word-count ENT, Test/Mainnet, Clear secrets, force-exit, offline V2, keys ≠ Shamir, inspect-not-sign, weak pad still mints words, they-hold vs you-hold, hot vs hardware vs cold.

**Do not clone** classic Lab as a second SPA. Tracks teach; rooms stay SoT.

---

## Forensic tracks (shipped)

Hard no still: fund practice mainnet; Sign/broadcast real PSBT; paste a funded seed; legal counsel.

**Spec:** `.agents/specs/2026-08-25-v2-p0-p2-tracks.md`

---


## Leftover ports (v1 has, same UC on v2 lacks)

Do not invent new UCs. Rooms stay SoT.

| UC | v1 still has | v2 same UC lacks |
|----|--------------|------------------|
| 1 | Paste mnemonic; full 44/49/84/86 address matrix `#card-addresses` | **Ported** `#v2PasteMn` + `#v2AddrType` 44/49/84/86 |
| 3 | Masked PP strength bar on `#cardCmpPp` | **Ported** `#ppA/#ppB` password + `#v2PpBarA/B` |
| 4 | Live Lab table bind `#cardPathPlay` | **Ported** `#v2PathPlayTable` + `#v2PathPurpose` |
| 5 / 9 | Full purpose tabs + `#cardDescriptors` refresh from Lab | **Ported** `#v2WoType` + `#v2DescRefresh` |
| 6 / 7 | Policy builder; SLIP-39 Suite | **Ported** `#v2MsPolicy` + `wsh(sortedmulti` (Suite still UC31 dock) |
| 8 | Paste arbitrary PSBT `#cardPsbt` | **Ported** inspect + six named txs + `/api/mempool` then `mempool.space` after leak-ack |
| 10 | Live Network lookup (`connect-src`) | **Ported** same: proxy then mempool.space (V2 CSP allows both) |
| 14 | Extra RNG toys (`+10 d6`, send pad to Lab) | **Ported** `#v2Dice10` + `#v2EntToLab` → First wallet |
| 18 | — (job was gap) | **Ported** heir kits + map packet + open-while-alive (`#v2InhBuild` / `#v2InhTryLive`) |
| 19 | Live address lookup on Network | **Skipped P3** — sim tBTC + dock only |
| 20 | Materials lab | **Ported** paper · metals · 4-letter · solid vs tiles vs photo |
| 26–31 | `#cardBip85` full card; SLIP-39 Suite | Node in-tab; Suite clone (leave) |
| 32 | No SeedXOR card | **Ported** live 12-word XOR (`#v2XorSplit` / `#v2XorHide` / `#v2XorAll`) |
| 33 | No CSV/timelock card | Live CSV signer (forbidden) |
| 34 | `#cardDescriptors` + `#cardDescExplain` | **Ported** `#v2DescRefreshLab` + `#v2DescPaste` + `#v2DescExplain` |
| 35 | Restore is BIP-39 only | Electrum KDF (forbidden) |
| chrome | Theme, Extra help, Classroom, First-hour rail, `#cardOps` | Leave on `/` |

## Retrieval

| URL | What |
|-----|------|
| https://bip39.catalyxt.xyz/v2/compare.md | This file (after deploy) |
| https://bip39.catalyxt.xyz/v2/ | V2 picker |
| https://bip39.catalyxt.xyz/ | Classic Lab |
