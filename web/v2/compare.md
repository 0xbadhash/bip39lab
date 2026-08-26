# Use-case compare: classic Lab (v1) vs V2 tracks

- **Deeplink:** https://bip39.catalyxt.xyz/v2/compare.md
- **Local / repo:** `/v2/compare.md` · `web/v2/compare.md`
- **As of:** 2026-08-26
- **v1:** `/` · product stamp `v0.16.52`
- **v2:** `/v2/` · chip `v0.17.78-v2` (`data-v2-version`; not the classic footer stamp)

Live compare.md lags until deploy. This repo file is source of truth.

**Missing** = classic Lab or a sibling room has a real control V2 does not yet wire **in-track**. Linking out to `/multisig.html` is Partial, not Yes.

V2 reuses `bip39lab.bundle.js` + `shamir-core.js`. Gaps are surface, not a second crypto stack. Classic `/` is unchanged.

---

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
- **UC6/UC7/UC8:** separate keys vs Shamir shares vs inspect-only PSBT (**Inspect sample**; never Sign). Split then **Combine any 2 of 3**.
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
- **UC18** inheritance: sealed packet vs chat; open-while-alive; not legal counsel.
- **UC19** first receive: test address + watch second view + simulated **0.000184 tBTC**; Network dock; never fund practice mainnet.
- **P1** UC20 metal · UC21 collab · UC22 ceremony · UC23 air-gap loop (tab never signs) · UC24 geo keys · UC25 annual rehearsal.
- **P2** UC26 own node (no node in-tab) · UC27 UTXO/change · UC28 CoinJoin agnostic · UC29 decoy PP (not advice) · UC30 BIP-85 (classic SoT) · UC31 SLIP-39 dock (`/slip39.html`; UC7 stays hex).

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
- Dual stamp: product `v0.16.x` · V2 chip `0.17.N-v2`.
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
| PSBT samples (3) | UC8 inspect-only |
| Compare A/B table | UC3 after verdict |
| Room return-dock | UC6 / UC7 / UC10 → Finish |
| Dice / coin ENT | UC14 |
| Pad + passphrase stack | UC15 |
| They/you + 0.184 + 2-col hold | UC11 |
| Hot drain / hardware | UC12 |
| Hot vs cold sort | UC13 |
| Restore drill | UC16 |
| Amount tiers | UC17 |
| Inheritance dry-run | UC18 |
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
| **1** First wallet | `#card-mnemonic` | Generate 12–24, OS entropy, copy/QR, Test/Mainnet | Paste mnemonic; full 44/49/84/86 matrix |
| **2** Paper backup | Strip + print | Card ack, do/do-not + PP example + generate, print not-air-gap | — |
| **3** Passphrase | `#cardCmpPp` | A/B + verdict + estimate table; key still | Masked PP strength bar |
| **4** Path | `#cardPathPlay` | Index, **change 0/1**, BIP 44/49/84/86 SVG | Live Lab table bind |
| **5 / 9** Watch / xpub | Tabs + QR | Labelled export + **copy/QR rows** | Full purpose tabs |
| **6 / 7** Multisig / Shamir | Full rooms | In-track 2-of-3 / hex 2-of-3 + **dock** | Policy builder; SLIP-39 Suite |
| **8 / 10** PSBT / Network | `#cardPsbt` / `/network.html` | Three samples, inspect-only; Open Network + **dock** | Paste arbitrary PSBT; live lookup (`connect-src`) |
| **11–13** | Glossary only | Interactive labs (five-question UC11 quiz) | — |
| **14** | `#cardEntPad` | Dice/coin, 12–24 mint, lock vs **this** length, 5-quiz | Extra RNG toys |
| **15** | PP + pad split | Dice · bits · lock · **key**; PP 128 chars; stable Estimate | Not a substitute for OS CSPRNG |
| **16** | Restore (gap) | Hide card, type from paper, checksum + same address | — |
| **17** | Amount tiers (gap) | Place 0.001 / 0.184 / 2.0 | — |
| **18** | Inheritance (gap) | Sealed vs chat; 2-of-3 people; open-while-alive | Legal counsel |
| **19** | First receive (gap) | Sim tBTC + watch + Network dock | Live mempool in-tab |
| **20–25** | P1 jobs (gap) | Metal, collab, ceremony, loop, geo, calendar | Vendor drivers |
| **26–31** | P2 jobs (gap) | Node honesty, UTXO, mix, decoy, BIP-85, SLIP-39 dock | Node in-tab; Suite clone |

---

## Still leave on `/`

Theme, Extra help, Classroom, First-hour rail, full BIP-85 card, ops wall (`#cardOps`), full address matrix, SLIP-39 Suite implementation, Network live lookup, funded storage.

V2 now **points at** BIP-85 (UC30) and SLIP-39 (UC31 dock). Rooms stay SoT.

**Qualities already moved:** numbered card, word-count ENT, Test/Mainnet, Clear secrets, force-exit, offline V2, keys ≠ Shamir, inspect-not-sign, weak pad still mints words, they-hold vs you-hold, hot vs hardware vs cold.

**Do not clone** classic Lab as a second SPA. Tracks teach; rooms stay SoT.

---

## Forensic tracks (shipped)

Hard no still: fund practice mainnet; sign/broadcast real PSBT here; paste a real seed; inheritance as legal counsel.

**Spec:** `.agents/specs/2026-08-25-v2-p0-p2-tracks.md`

---

## Retrieval

| URL | What |
|-----|------|
| https://bip39.catalyxt.xyz/v2/compare.md | This file (after deploy) |
| https://bip39.catalyxt.xyz/v2/ | V2 picker |
| https://bip39.catalyxt.xyz/ | Classic Lab |
