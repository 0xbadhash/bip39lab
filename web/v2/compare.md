# Use-case compare: classic Lab (v1) vs V2 tracks

- **Deeplink:** https://bip39.catalyxt.xyz/v2/compare.md
- **Local / repo:** `/v2/compare.md` · `web/v2/compare.md`
- **As of:** 2026-08-24 (after UC11–UC13, topbar Clear secrets, Test/Mainnet derive)
- **v1:** `/` · stamp `v0.16.41`
- **v2:** `/v2/` · chip `v0.17.23-v2` (`data-v2-version`; not the classic footer stamp)

**Missing** = classic Lab or a sibling room has a real control V2 does not yet wire **in-track**. Linking out to `/multisig.html` is Partial, not Yes.

V2 reuses `bip39lab.bundle.js` + `shamir-core.js`. Gaps are surface, not a second crypto stack. Classic `/` is unchanged.

---

## What we added since the last compare.md (was 2026-08-23 / 0.17.17-v2)

The previous file stopped at UC1–UC10 chrome, said Clear secrets lived only on UC1/UC2 pads, and treated UC3–UC10 as thin `<pre>` + room links.

### Pedagogy / chrome (all tracks)

- Picker is **UC1–UC13** (was UC1–UC10).
- **Clear secrets** is one red button in the **top-right header** on picker, gate, and every step. Not in the sidebar. Not only next to Generate.
- Teaching pads: **Do / Do not** then a **`desc()`** paragraph (full sentences). Quiz and Finish skip extra desc.
- Blue **`done`** callouts for lock phrases (M-of-N, zpub source, Shamir, Structure, Why you need this). Green stays **Do**.
- **Force-exit** on every Finish.
- **Rail + concept chips** jump back (`data-step` / `data-concept-step`).
- Quizzes: **Wrong.** reasons (not “Not that one”). Copy says **recovery words**, not “12 words” as the only length.
- Plan / Practice / Review **atoms** (three SVGs) on UC1–UC13.
- V2 chip **increments** with `/v2/` (`0.17.N-v2`). Product tag on classic pages is `v0.16.x`.

### UC1 — First wallet

- Word counts 12 / 15 / 18 / 21 / 24; regenerate follows the select.
- Entropy bits by length (128…256). Compact 8 words/line at 1920px (24 words = 3 lines).
- Validate: numbered card + words → seed → address pipe. Addresses stay hidden until Validate.
- **Network** dropdown beside Validate & Derive: **Test · tb1…** (default) / **Mainnet · bc1…**. Changing it re-derives the same phrase.
- Five receive addresses, index chip + address on one row. No “last 8” jargon.
- Validate (i) removed; the split is in prose.

### UC2 — Paper backup

- Card = backup; hand copy vs photo/cloud; print is **not** air-gap.
- Quiz still **two right sentences**, both required.

### UC3 — Passphrase

- Same words; compare A vs B with named verdicts (empty vs typed). Forgotten PP = that vault is gone.
- Atoms: same words / new vault / forgotten = loss.

### UC4 — Path folders

- Path is a folder; words stay. **Index increment** + **Back to index 0**. Path line `m/84'/1'/0'/0/i`.
- Atoms: folder / index / words stay.

### UC5 — Watch-only · UC9 — xpub

- Export public zpub/xpub + descriptors as **labelled lines** (no `[object Object]`).
- Why-you-need-this is a **blue** callout. Never paste recovery words into a watch app.
- UC9: xpub cannot spend; publishing leaks future addresses.

### UC6 — Multisig · UC7 — Shamir

- UC6: **M = 2, N = 3** picture; **three** whole practice phrases; each **zpub** visible; keys ≠ Shamir shares.
- UC7: one secret, M pieces rebuild; a share cannot sign. Edu hex, not SLIP-39 Suite. Shamir **room** stays the deep lab.

### UC8 — PSBT · UC10 — Network

- UC8: inspect structure as **prose**, not a JSON dump. Never sign here. Sign elsewhere / broadcast elsewhere.
- UC10: page stays offline (`connect-src none`). Failed lookup = **unknown**, not 0. Opt-in is `/network.html`.

### UC11–UC13 — custody objects (new)

| UC | Job | Lock |
|----|-----|------|
| **11** Custodial vs you hold | Exchange app is not a BIP-39 wallet | No seed = IOU; they can freeze or lose it. Seed you hold = you can spend and you can lose it. |
| **12** Hot software vs hardware | Same words, different where they live | Phone is hot. Hardware keeps keys on the device. USB is not automatically air-gap. Typing the seed into a computer still kills the vault. |
| **13** Hot vs cold | Online keys vs offline keys. Brand is not the split | Daily spend can be hot. Savings stay cold or watch-only. Four objects: exchange, phone, hardware, watch-only. |

### Still not on V2 (classic still has it)

- Classic still has `#cardEntPad`. V2 **UC14** now teaches the same lesson in-track.
- Paste mnemonic, address QR/copy wall, purpose 44/49/84/86 table, theme / Extra help / Classroom chip.
- Full Multisig / Shamir / SLIP-39 / Network **rooms** (intentional deep links).

---

## Operator highlights — current status

| Highlight | v2 now |
|-----------|--------|
| Clear secrets | **Shipped** — topbar, all views. Not sidebar. |
| Word count 12–24 | **Shipped** UC1. |
| Test / Mainnet addresses | **Shipped** UC1 Validate (`#v2Net`). |
| Entropy by word count | **Shipped** UC1 (OS generate). **Not** dice/coin pad. |
| Compact 24-word + 3 addresses/row | **Shipped** UC1. |
| Atoms UC1–UC13 | **Shipped**. |
| `desc()` on teaching pads | **Shipped**. |
| UC6 three zpubs + M-of-N | **Shipped**. |
| UC8 PSBT prose | **Shipped**. |
| UC11–UC13 taxonomy | **Shipped**. |
| Dice / coin weak-entropy track | **Shipped UC14**. |

---

## How to bring most of v1 into V2 (do it differently)

Do **not** clone classic Lab into `/v2/` as a second SPA. Tracks teach; rooms stay the power surface.

**Rule:** for each UC, **amend the v1 card the track already names** (or embed that card). V2 chrome (gate, rail, Do/Do-not, force-exit) wraps it.

| Priority | Bring into the track | Leave in the v1 room (deep link) |
|----------|----------------------|----------------------------------|
| P0 | Controls the learner **must operate** to hit Done-when | Full policy builders, fee APIs, SLIP-39 Suite-shaped lab |
| P1 | Copy/QR, type tabs, path SVG | Theme, Extra help, Classroom chip, First-hour rail |
| P2 | Glossary (i) on remaining jargon | Marketing chrome |

**Next P0 (operator `/spec` in flight):** V2 **dice / coin entropy** track — few rolls still mint 12 words and stay TOO LOW; ~50 d6 reaches 128-bit estimate; coin flips show 1 bit each. Do not replace UC1 OS Generate.

---

## Pedestal

| Job | v1 | v2 | Still missing on v2 |
|-----|----|----|---------------------|
| Entry | Rooms + First hour | **Picker UC1–UC13** | Dice/coin UC |
| Gate | One ack overlay | **Coloured is / is not / Done when** | — |
| Mission | README | Sidebar | — |
| Clear secrets | Lab mnemonic row | **Topbar all tracks** | — |
| Network on derive | Lab select | **UC1 Test / Mainnet** | Other UCs still default test (UC4 path) or main (watch zpub) on purpose |
| Theme / Extra help / Classroom | Yes | No | **Missing** (ok to leave on `/`) |
| Glossary in-page | Yes | (i) on many later pads + `/#glossary` | Not every Starter sentence |
| Force-exit will-not-fund | Banner | **Yes every track** | — |

---

## UC1 — First wallet

**v1 home:** `#card-mnemonic`, `#labStrip`, `#addrTable`.

| Capability | v1 | v2 now | Bring next (differently) |
|------------|----|--------|--------------------------|
| Generate + 12–24 + entropy bits | Yes | **Yes** | — |
| Words first | Yes | **Yes** | — |
| Numbered card | Strip | Compact 8×3 at 1920 | — |
| Seed on Validate | Strip | **Pipe + prose** | — |
| Addresses | BIP44/49/84/86, main/test, copy, QR | 5× BIP84, **Test or Mainnet** | Copy/QR on `#v2AddrGrid` cells; do not clone the full table |
| Paste mnemonic | Yes | No | Optional |
| Passphrase on derive | Masked + strength | UC3 | Keep on UC3 |
| Dice / coin pad | `#cardEntPad` | **No** | New UC (spec in grill) |

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
| Path = folder | Yes | **Index + reset; words stay** | Optional Path SVG / change toggle |
| Purpose 44/49/84/86 | Yes | BIP84 demo | Same Lab card, do not clone |

---

## UC5 — Watch-only · UC9 — xpub

| Capability | v1 | v2 now | Bring next |
|------------|----|--------|------------|
| Export zpub/xpub | Tabs + copy + QR | **Labelled dump** | Reuse `#watchOnlyList` |
| Never paste seed | Copy | Do/Do-not + quiz | — |
| xpub leak | Copy | **UC9 quiz** | — |

---

## UC6 — Multisig · UC7 — Shamir

| Capability | v1 | v2 now | Bring next |
|------------|----|--------|------------|
| M-of-N / shares | Full pages | **In-track 2-of-3 + three zpubs / hex shares** + room links | Keep rooms as SoT |
| SLIP-39 | `/slip39.html` | Explicitly not Suite | Deep-link only |

---

## UC8 — PSBT · UC10 — Network

| Capability | v1 | v2 now | Bring next |
|------------|----|--------|------------|
| Inspect PSBT | Samples + paste | **One sample, prose fields** | Optional mount `#cardPsbt` |
| Opt-in lookup | `/network.html` | **Quiz + Open Network** | Never `connect-src` on `/v2/` |

---

## UC11–UC13 — no v1 track equivalent

Classic Lab does not have custodial / hot-software / hot-cold **tracks**. Glossary and copy mention hardware and air-gap. V2 is the curriculum for those objects.

| Object | Teach in V2 | Do not |
|--------|-------------|--------|
| Exchange account | UC11 IOU | Call it a BIP-39 wallet |
| Phone / laptop app | UC12 hot | Treat USB as air-gap |
| Hardware signer | UC12 keys on device | Type seed into the computer |
| Watch-only | UC13 / UC5 | Paste the recovery words |
| Hot vs cold | UC13 online keys | Use brand as the split |

---

## Suggested ship order (remaining)

1. **Dice / coin entropy UC** (after `/spec` grill) — port `#cardEntPad` lesson, not the whole Tools wall.  
2. UC1 copy/QR on address cells; optional paste.  
3. UC4 Path SVG / change if learners still miss “folder”.  
4. UC5/UC9 watch-only list + copy.  
5. UC8 extra PSBT samples.  
6. UC6/UC7/UC10 return-dock into rooms, not clones.

What **not** to bring: Classroom levels as a second curriculum, First-hour 6-step rail, theme fork, funded-wallet storage.

---

## Retrieval

| URL | What |
|-----|------|
| https://bip39.catalyxt.xyz/v2/compare.md | This file (after deploy) |
| https://bip39.catalyxt.xyz/v2/ | V2 picker |
| https://bip39.catalyxt.xyz/ | Classic Lab |
