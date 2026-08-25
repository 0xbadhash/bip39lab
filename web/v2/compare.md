# Use-case compare: classic Lab (v1) vs V2 tracks

- **Deeplink:** https://bip39.catalyxt.xyz/v2/compare.md
- **Local / repo:** `/v2/compare.md` · `web/v2/compare.md`
- **As of:** 2026-08-25
- **v1:** `/` · product stamp `v0.16.46`
- **v2:** `/v2/` · chip `v0.17.46-v2` (`data-v2-version`; not the classic footer stamp)

Live compare.md lags until deploy. This repo file is source of truth.

**Missing** = classic Lab or a sibling room has a real control V2 does not yet wire **in-track**. Linking out to `/multisig.html` is Partial, not Yes.

V2 reuses `bip39lab.bundle.js` + `shamir-core.js`. Gaps are surface, not a second crypto stack. Classic `/` is unchanged.

---

## What landed since 0.16.45 / chip 0.17.44

- **UC15 first pad:** dice → **~N bits** meter → lock → **key** on the right (Lab stills).
- **UC15 passphrase:** textarea **max 128** (64+ fine); estimate table is **fixed layout** so the Estimate column does not jump while typing.
- **UC14 lock:** starts **red**; green only when pad meets **this** word count (12→128 … 24→256). Switching 12→15/18/21/24 downgrades until more rolls.
- **UC11 / UC14 quizzes:** five questions each; Continue after all five are right.
- **UC11 you-hold:** two rounded cards (one-signer | 2-of-3); huge **0.184 bitcoin**.

---

## Pedagogy / chrome (all tracks)

- Picker **UC1–UC15**.
- **Clear secrets** — red, top-right header, every view.
- **Do / Do not** then `desc()`. Blue `done` callouts. Green = Do.
- Force-exit on every Finish. Rail + concept chips jump back.
- Dual stamp: product `v0.16.x` · V2 chip `0.17.N-v2`.
- Plan / Practice / Review atoms on UC1–UC15.

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

---

## Pedestal

| Job | v1 | v2 | Still missing on v2 |
|-----|----|----|---------------------|
| Entry | Rooms + First hour | **Picker UC1–UC15** | — |
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
| **2** Paper backup | Strip + print | Card ack, two-check quiz, print not-air-gap | — |
| **3** Passphrase | `#cardCmpPp` | A/B + verdict + estimate table; key still | Masked PP strength bar |
| **4** Path | `#cardPathPlay` | Index, **change 0/1**, BIP 44/49/84/86 SVG | Live Lab table bind |
| **5 / 9** Watch / xpub | Tabs + QR | Labelled export + **copy/QR rows** | Full purpose tabs |
| **6 / 7** Multisig / Shamir | Full rooms | In-track 2-of-3 / hex 2-of-3 + **dock** | Policy builder; SLIP-39 Suite |
| **8 / 10** PSBT / Network | `#cardPsbt` / `/network.html` | Three samples, inspect-only; Open Network + **dock** | Paste arbitrary PSBT; live lookup (`connect-src`) |
| **11–13** | Glossary only | Interactive labs (five-question UC11 quiz) | — |
| **14** | `#cardEntPad` | Dice/coin, 12–24 mint, lock vs **this** length, 5-quiz | Extra RNG toys |
| **15** | PP + pad split | Dice · bits · lock · **key**; PP 128 chars; stable Estimate | Not a substitute for OS CSPRNG |

---

## Still leave on `/`

Theme, Extra help, Classroom, First-hour rail, BIP-85 (`#cardBip85`), ops wall (`#cardOps`), full address matrix, SLIP-39 Suite, Network live lookup, funded storage.

**Qualities already moved:** numbered card, word-count ENT, Test/Mainnet, Clear secrets, force-exit, offline V2, keys ≠ Shamir, inspect-not-sign, weak pad still mints words, they-hold vs you-hold, hot vs hardware vs cold.

**Do not clone** classic Lab as a second SPA. Tracks teach; rooms stay SoT.

---

## Retrieval

| URL | What |
|-----|------|
| https://bip39.catalyxt.xyz/v2/compare.md | This file (after deploy) |
| https://bip39.catalyxt.xyz/v2/ | V2 picker |
| https://bip39.catalyxt.xyz/ | Classic Lab |
