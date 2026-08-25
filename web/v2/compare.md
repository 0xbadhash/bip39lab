# Use-case compare: classic Lab (v1) vs V2 tracks

- **Deeplink:** https://bip39.catalyxt.xyz/v2/compare.md
- **Local / repo:** `/v2/compare.md` · `web/v2/compare.md`
- **As of:** 2026-08-25 (local tree after UC14 + interactive UC11–UC13)
- **v1:** `/` · product stamp `v0.16.44`
- **v2:** `/v2/` · chip `v0.17.38-v2` (`data-v2-version`; not the classic footer stamp)

Live https://bip39.catalyxt.xyz/v2/compare.md may still be the **2026-08-24 / 0.17.23-v2** lecture snapshot until this file is deployed. Treat **this repo file** as source of truth.

**Missing** = classic Lab or a sibling room has a real control V2 does not yet wire **in-track**. Linking out to `/multisig.html` is Partial, not Yes.

V2 reuses `bip39lab.bundle.js` + `shamir-core.js`. Gaps are surface, not a second crypto stack. Classic `/` is unchanged.

---

## What changed since the last published compare (2026-08-24 / 0.17.23-v2)

That file stopped at **lecture** UC11–UC13, treated dice as “still missing”, and listed Clear secrets / Test-Mainnet as already shipped.

### Pedagogy / chrome (all tracks)

- Picker is **UC1–UC15**.
- **Clear secrets** — red button, **top-right header**, picker / gate / every step.
- Teaching pads: **Do / Do not** then a **`desc()`** paragraph. Quiz and Finish skip extra desc.
- Blue **`done`** callouts for lock phrases and UC11 you-hold results. Green stays **Do**.
- **Force-exit** on every Finish.
- **Rail + concept chips** jump back (`data-step` / `data-concept-step`).
- Quizzes: **Wrong.** reasons. Copy says **recovery words** / **seed phrase**, not “12 words” as the only length.
- Plan / Practice / Review **atoms** (three SVGs) on UC1–UC15.
- Dual stamp: product `v0.16.x` on classic; V2 chip `0.17.N-v2`.

### UC1 — First wallet

- Word counts 12 / 15 / 18 / 21 / 24; regenerate follows the select.
- Entropy bits by length (128…256). Compact 8 words/line at 1920px.
- Validate: numbered card + words → seed → address pipe. Addresses hidden until Validate.
- **Network** beside Validate: **Test · tb1…** (default) / **Mainnet · bc1…**. Same phrase, re-derive.
- Five receive addresses, index chip + address on one row.

### UC2–UC10

Unchanged in intent from 0.17.23: paper backup two-check quiz; passphrase A/B verdicts; path index + reset; watch-only labelled zpub/xpub; UC6 2-of-3 + three zpubs; UC7 edu Shamir hex; UC8 PSBT prose; UC9 xpub leak; UC10 offline / unknown ≠ 0.

### UC11–UC13 — lectures replaced by interactive labs

| UC | Job | What you tap |
|----|-----|----------------|
| **11** They hold vs you hold | Login is not a BIP-39 wallet | **They / You** rows (green correct / red wrong). Company pad: “Give me my seed phrase” → they never gave you one; “Open this in another wallet” → you cannot; **5s auto-lock**. You-hold: send yourself / lose the paper (blue callouts) + **2-of-3** try-alone / lose-one-paper / send-with-cosigner. Quiz: company = login, never a seed phrase. |
| **12** Hot software vs hardware | Same words, different where they live | **Hot wallet on phone**: place 0.184 BTC then malware **drains to 0.000**. **Hardware two-pane**: USB still hot-adjacent; **type seed into computer** drains. |
| **13** Hot vs cold | Online keys vs offline keys | **Sort** exchange / phone / hardware / watch-only. Traps: hardware on USB is not automatically cold; brand is not the split. |

### UC14 — Dice and coin entropy (new)

Ports the **lesson** of classic `#cardEntPad`, not the whole Tools wall.

- d6 ≈ 2.58 bits; coin = 1 bit.
- Few rolls can still **mint twelve words** and stay **TOO LOW**.
- ~50 d6 ≈ 128 bits. 128 coin flips is the hard path.
- SHA-256 log → mnemonic. Does **not** replace UC1 OS Generate.
- Live **~N bits** face (huge number + bar). Markers at **128** (12-word) and **256** (24-word). The total keeps climbing past 256 (e.g. **~317** after many d6). Last event shows **+2.58** or **+1**.
- Same Lab still as beginner chapter: **`/assets/ds/faces/beginner-dice.png`** next to the meter (not a copy).

---

## Operator highlights — current status

| Highlight | v2 now |
|-----------|--------|
| Clear secrets | **Shipped** — topbar, all views |
| Word count 12–24 | **Shipped** UC1 |
| Test / Mainnet addresses | **Shipped** UC1 `#v2Net` |
| Entropy by word count | **Shipped** UC1 (OS generate) |
| Dice / coin weak-entropy | **Shipped** UC14 |
| Compact 24-word + addresses | **Shipped** UC1 |
| Atoms UC1–UC14 | **Shipped** |
| `desc()` on teaching pads | **Shipped** |
| UC6 three zpubs + M-of-N | **Shipped** |
| UC8 PSBT prose | **Shipped** |
| UC11–UC13 interactive | **Shipped** (they/you, lock, drain, sort, 2-of-3) |

---

## How to bring remaining v1 into V2 (do it differently)

Do **not** clone classic Lab into `/v2/` as a second SPA. Tracks teach; rooms stay the power surface.

**Rule:** for each UC, **amend the v1 card the track already names** (or embed that card). V2 chrome (gate, rail, Do/Do-not, force-exit) wraps it.

| Priority | Bring into the track | Leave in the v1 room (deep link) |
|----------|----------------------|----------------------------------|
| P0 | Controls the learner **must operate** to hit Done-when | Full policy builders, fee APIs, SLIP-39 Suite-shaped lab |
| P1 | Copy/QR, type tabs, path SVG | Theme, Extra help, Classroom chip, First-hour rail |
| P2 | Glossary (i) on remaining jargon | Marketing chrome |

**Qualities of v1 to keep when moving:** offline (`connect-src none`); practice-only / will-not-fund; numbered card as backup object; addresses ≠ phrase; recovery words never pasted into watch-only; unknown ≠ 0; keys ≠ Shamir shares; inspect PSBT, never sign here.

---

## Pedestal

| Job | v1 | v2 | Still missing on v2 |
|-----|----|----|---------------------|
| Entry | Rooms + First hour | **Picker UC1–UC14** | — |
| Gate | One ack overlay | **Coloured is / is not / Done when** | — |
| Mission | README | Sidebar | — |
| Clear secrets | Lab mnemonic row | **Topbar all tracks** | — |
| Network on derive | Lab select | **UC1 Test / Mainnet** | UC4 path stays test; watch zpub main — on purpose |
| Theme / Extra help / Classroom | Yes | No | **Leave on `/`** |
| Glossary in-page | Yes | (i) on later pads + `/#glossary` | Not every Starter sentence |
| Force-exit will-not-fund | Banner | **Yes every track** | — |

---

## UC1 — First wallet

**v1 home:** `#card-mnemonic`, `#labStrip`, `#addrTable`.

| Capability | v1 | v2 now | Bring next (differently) |
|------------|----|--------|--------------------------|
| Generate + 12–24 + entropy bits | Yes | **Yes** | — |
| Numbered card | Strip | Compact 8×3 at 1920 | — |
| Seed on Validate | Strip | **Pipe + prose** | — |
| Addresses | BIP44/49/84/86, main/test, copy, QR | 5× BIP84, **Test or Mainnet** | **Copy/QR on `#v2AddrGrid` cells**; do not clone the full table |
| Paste mnemonic | Yes | No | Optional, labelled practice-only |
| Passphrase on derive | Masked + strength | UC3 | Keep on UC3 |
| Dice / coin pad | `#cardEntPad` | **UC14** | — |

---

## UC2 — Paper backup

| Capability | v1 | v2 now | Bring next |
|------------|----|--------|------------|
| Card = backup | Strip | **Yes** + ack | — |
| Do / Do not | Teach copy | **Colour panels** | — |
| Print sheet | `#printBackup` | **Yes** + not-air-gap | — |
| Quiz photo/print | Weak | **Two checks** | — |

UC2 is **ahead of v1** on print-risk teaching. v1 could adopt this quiz.

---

## UC3 — Passphrase

**v1 home:** `#passphrase` + `#cardCmpPp`.

| Capability | v1 | v2 now | Bring next |
|------------|----|--------|------------|
| Two-vault idea | Compare table | **A/B + named verdict** | Optional mount of `#cardCmpPp` |
| Masked + strength | Yes | Plain A/B | After compare, or leave on Lab |
| Atoms | No | **Yes** | — |

---

## UC4 — Path folders

**v1 home:** `#cardPathPlay` + BIP SVG.

| Capability | v1 | v2 now | Bring next |
|------------|----|--------|------------|
| Path = folder | Yes | **Index + reset; words stay** | **Change chain** toggle + path SVG |
| Purpose 44/49/84/86 | Yes | BIP84 demo | Same Lab card; do not clone |

---

## UC5 — Watch-only · UC9 — xpub

| Capability | v1 | v2 now | Bring next |
|------------|----|--------|------------|
| Export zpub/xpub | Tabs + copy + QR | **Labelled dump** | **Copy/QR list** like `#watchOnlyList` |
| Never paste seed | Copy | Do/Do-not + quiz | — |
| xpub leak | Copy | **UC9 quiz** | — |

---

## UC6 — Multisig · UC7 — Shamir

| Capability | v1 | v2 now | Bring next |
|------------|----|--------|------------|
| M-of-N / shares | Full pages | **In-track 2-of-3 + three zpubs / hex shares** + room links | Keep rooms as SoT; **return-dock** after Open room |
| SLIP-39 | `/slip39.html` | Explicitly not Suite | Deep-link only |
| You-hold 2-of-3 feel | — | **UC11 you-hold pad** (send alone / lose one paper / co-sign) | Do not duplicate the full policy builder |

---

## UC8 — PSBT · UC10 — Network

| Capability | v1 | v2 now | Bring next |
|------------|----|--------|------------|
| Inspect PSBT | Samples + paste | **One sample, prose fields** | Extra samples / mount `#cardPsbt` |
| Opt-in lookup | `/network.html` | **Quiz + Open Network** | Never `connect-src` on `/v2/` |

---

## UC11–UC13 — no v1 track equivalent (V2 is the curriculum)

Classic Lab mentions hardware and air-gap in glossary/copy. It does **not** have custodial / hot-software / hot-cold **tracks**.

| Object | Teach in V2 | Do not |
|--------|-------------|--------|
| Exchange account | UC11 they/you + company pad | Call it a BIP-39 wallet |
| Self-custody | UC11 send / lose paper + 2-of-3 | Imply support can reset a seed |
| Phone / laptop app | UC12 hot drain | Treat USB as air-gap |
| Hardware signer | UC12 two-pane | Type seed into the computer |
| Watch-only | UC13 / UC5 | Paste the recovery words |
| Hot vs cold | UC13 sort + traps | Use brand as the split |

---

## UC14 — Dice / coin (classic `#cardEntPad`)

| Capability | v1 | v2 now | Bring next |
|------------|----|--------|------------|
| Weak entropy still mints words | `#cardEntPad` | **Yes** | — |
| ~50 d6 ≈ 128 bits | Yes | **Yes** | — |
| Coin = 1 bit | Yes | **Yes** | — |
| Full Tools wall / extra RNG toys | Lab | No | Leave on `/` |

---

## Suggested ship order (remaining v1 → V2)

1. **UC1 copy + QR** on `#v2AddrGrid` (and optionally paste mnemonic, practice-only). This is the biggest everyday Lab habit still missing in-track.
2. **UC4 change addresses + path SVG** (and a 44/49/84/86 *peek*, not a second table) so “folder” is visible, not only an index chip.
3. **UC5 / UC9 copy + QR** on exported zpub/xpub/descriptor lines (reuse watch-only list pattern).
4. **UC8 extra PSBT samples** or a thin mount of `#cardPsbt` — still inspect-only, never sign.
5. **UC3 optional `#cardCmpPp`** after the A/B verdict for learners who want the Lab compare table.
6. **UC6 / UC7 / UC10 return-dock** — Open room, then land back on the track Finish, so rooms stay SoT without losing the curriculum.

**Leave on classic `/` (qualities, not clones):**

- Theme / Extra help / Classroom chip / First-hour 6-step rail
- BIP-85 child mnemonic (`#cardBip85`)
- Ops / policy wall (`#cardOps`)
- Full BIP44/49/84/86 address matrix
- SLIP-39 Suite page
- Network live lookup (`connect-src` only on `/network.html`)
- Funded-wallet storage (neither surface should keep real funds)

**Qualities that already moved (do not re-litigate):** numbered backup card, word-count entropy, Test/Mainnet derive, Clear secrets, force-exit, offline V2, M-of-N vs Shamir, inspect-not-sign PSBT, dice weak-entropy, custodial vs you-hold, hot drain vs hardware, hot vs cold sort.

---

## Retrieval

| URL | What |
|-----|------|
| https://bip39.catalyxt.xyz/v2/compare.md | This file (after deploy) |
| https://bip39.catalyxt.xyz/v2/ | V2 picker |
| https://bip39.catalyxt.xyz/ | Classic Lab |
