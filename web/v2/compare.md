# Use-case compare: classic Lab (v1) vs V2 tracks

- **Deeplink:** https://bip39.catalyxt.xyz/v2/compare.md
- **Local / repo:** `/v2/compare.md` · `web/v2/compare.md`
- **As of:** 2026-08-23 (after UC1 compact/entropy, UC2 colour + two-check quiz, all-track Do/Do-not)
- **v1:** `/` · stamp `v0.16.36`
- **v2:** `/v2/` · footer `0.17.0-v2`

**Missing** = classic Lab or a sibling room has a real control V2 does not yet wire **in-track**. Linking out to `/multisig.html` is Partial, not Yes.

V2 reuses `bip39lab.bundle.js` + `shamir-core.js`. Gaps are surface, not a second crypto stack.

---

## What we added since the last compare.md

These are **qualities V2 now has** that the previous compare did not credit (or listed as missing).

### Pedagogy / chrome (all UCs)
- Coloured **gate**: green What this is · red What this is not · blue Done when (UC1–UC10).
- Coloured **Do / Do not** two-column callouts on every track’s teaching steps (same tokens as UC2: `--ok` / `--bad` / `--accent` / `--warn`).
- Amber **warn** callouts where print, Network, or throwaway keys are the risk.
- Finish **force-exit** in a red callout on every track.
- Mission sentence still always in the V2 sidebar.

### UC1 — First wallet
- Word counts **12 / 15 / 18 / 21 / 24**; regenerate follows the select.
- Clear secrets on Generate / Validate / regenerate rows (not the left pane).
- Plain-English generate copy; BIP-39 (i) English wordlist.
- **Entropy bar** (green bits on amber strip, one line): 128 / 160 / 192 / 224 / 256 bits by length.
- Compact card: 4 words/line narrow, **8/line at 1920px** so **24 words = 3 lines**.
- Validate keeps the **numbered card** + **words → seed → address** strip.
- “Where addresses come from” split into **two columns**.
- Five receive addresses in a **3-column** grid; `#n` and `tb1q…` on the **same line**.
- Card-ack before Validate; force-exit.

### UC2 — Paper backup
- Numbered card + card-ack; BIP-39 (i); Clear secrets on pads.
- Do / Do not colour panels; no “Don’t”.
- **Print is not air-gap** amber warning; dedicated `#printBackup` sheet after confirm.
- Quiz is **two sentences, two checks** (hand-copy offline **and** photo/print are not the most secure). Both required.

### UC3–UC10
- Do/Do-not + callouts (passphrase two-vaults, path folder, watch-only public-only, keys ≠ shares, Shamir ≠ Suite, PSBT never sign, xpub leak, Network unknown ≠ 0).
- Crypto still the **thin** in-track demos from before (compare two lines, path index toggle, `<pre>` dumps, links to v1 rooms).

---

## Operator highlights — current status

| Highlight | v2 now |
|-----------|--------|
| Clear secrets next to Generate, not left pane | **Shipped** UC1 + UC2 pads. Still absent on UC3–UC10 action rows. |
| Word count 12–24 | **Shipped** UC1. |
| No “OS CSPRNG / scure” jargon on Generate | **Shipped** UC1. Other UCs still say zpub / GF(256) / PSBT without (i). |
| BIP-39 (i) English words, no contractions | **Shipped** UC1 + UC2. Not on every later pad. |
| Regenerate matches 15/18/21/24 | **Shipped**. |
| Entropy by word count | **Shipped** UC1 (was missing in last compare). |
| Compact 24-word + 3 addresses/row on 1920 laptop | **Shipped** UC1. |
| Seed visible on Validate | **Shipped** (strip + copy). |
| UC2 print + photo not most secure | **Shipped** (two-check quiz). |

---

## How to bring most of v1 into V2 (do it differently)

Do **not** clone classic Lab into `/v2/` as a second SPA. Tracks stay the teacher; rooms stay the power surface.

**Rule:** for each UC, **amend the v1 card the track already names** (or embed that card), instead of a new pad. V2 chrome (gate, rail, Do/Do-not, force-exit) wraps it.

| Priority | Bring into the track | Leave in the v1 room (deep link) |
|----------|----------------------|----------------------------------|
| P0 | Controls the learner **must operate** to hit Done-when | Full policy builders, fee APIs, SLIP-39 Suite-shaped lab |
| P1 | Copy/QR, type tabs, path SVG, Compare table | Theme, Extra help, Classroom chip, First-hour rail |
| P2 | Glossary (i) on every jargon word | Marketing chrome |

**Pattern that already works:** UC1 Generate/Validate uses the same BIP-39 API as Lab. Next: **mount** `#cardCmpPp`, `#cardPathPlay`, watch-only list, `#cardPsbt` **inside** UC3/4/5/8 instead of `<pre>` + “open room”.

---

## Pedestal

| Job | v1 | v2 | Still missing on v2 |
|-----|----|----|---------------------|
| Entry | Rooms + First hour | **Picker UC1–UC10** | — |
| Gate | One ack overlay | **Coloured is / is not / Done when** | — |
| Mission | README | Sidebar | — |
| Clear secrets | Lab mnemonic row | UC1 + UC2 | **UC3–UC10 action rows** |
| Theme / Extra help / air-gap chip / Classroom | Yes | No | **Missing** (ok to leave on `/`) |
| Glossary in-page | Yes | Link `/#glossary` | **(i) on zpub, PSBT, GF(256), xpub** |
| Force-exit will-not-fund | Banner | **Yes every track** | — |

---

## UC1 — First wallet

**v1 home:** `#card-mnemonic`, `#labStrip`, `#addrTable`.

| Capability | v1 | v2 now | Bring next (differently) |
|------------|----|--------|--------------------------|
| Generate + 12–24 + entropy bits | Yes | **Yes** | — |
| Words first | Yes | **Yes** | — |
| Numbered card + stamp | Strip | Compact 8×3 at 1920 | Optional: light classic strip stages instead of a third grid |
| Seed on Validate | Strip “seed” stage | **Two-column + pipe** | — |
| Addresses | BIP44/49/84/86, main/test, copy, QR, hide-private | 5× BIP84 **test**, 3-up grid | **Embed** type tabs + copy/QR from Lab table; do not invent a new table |
| Paste mnemonic | Yes | No | Optional paste on Generate (same `#mnemonic` semantics) |
| Passphrase on derive | Masked + strength | UC3 | Keep on UC3 |
| Seed QR / send Network | Beginner+ | No | Link UC10; do not put QR on Starter UC1 |

**Do differently:** keep compact layout; **reuse** Lab address-row actions (copy/QR) on the existing `#v2AddrGrid` cells rather than the full derive-controls wall.

---

## UC2 — Paper backup

| Capability | v1 | v2 now | Bring next |
|------------|----|--------|------------|
| Card = backup | Strip | **Yes** + ack | — |
| Do / Do not | Teach copy | **Colour panels** | — |
| Print sheet | `#printBackup` | **Yes** + not-air-gap warning | — |
| Quiz photo/print | Weak | **Two checks** | — |
| (i) + Clear secrets | Lab | **Yes** | — |

**Do differently:** UC2 is **ahead of v1** on print-risk teaching. Do not port v1’s weak “print optional” without the amber warning. v1 could **adopt** this quiz.

---

## UC3 — Passphrase

**v1 home:** `#passphrase` + strength + `#cardCmpPp`.

| Capability | v1 | v2 now | Bring next |
|------------|----|--------|------------|
| Two-vault idea | Copy + compare table | **Do/Do-not + A/B two lines** | **Mount `#cardCmpPp`** (table, verdict, TEST DATA, Lab phrase source) inside the track |
| Masked field + strength | Yes | Plain A/B | Show strength **after** compare, or link Lab field |
| Fork SVG (one card, two vaults) | No | No | **New** (recommended earlier); do not reuse key+dice=lock |

**Do differently:** do not rewrite Compare. `iframe` or extract the compare card into UC3 step 2.

---

## UC4 — Path folders

**v1 home:** `#cardPathPlay` + BIP SVG.

| Capability | v1 | v2 now | Bring next |
|------------|----|--------|------------|
| Path = folder | Yes | Text + index 0/1 | **Mount Path playground + SVG**; add **change** toggle |
| Purpose table 44/49/84/86 | Yes | No | Same card, do not clone |

---

## UC5 — Watch-only · UC9 — xpub

**v1 home:** watch-only tabs, copy, QR, descriptor explain.

| Capability | v1 | v2 now | Bring next |
|------------|----|--------|------------|
| Export zpub/xpub | Tabs + copy + QR | `<pre>` dump | **Reuse** `#watchOnlyList` UI in UC5; UC9 is the privacy quiz on the same export |
| Descriptor explain | `#cardDescExplain` | Dump lines | UC5 step “explain one line”; refuse secrets (already in API) |
| Never paste seed | Copy | Do/Do-not + quiz | — |

**Do differently:** one export widget, two tracks (UC5 = what to paste, UC9 = why not to publish).

---

## UC6 — Multisig · UC7 — Shamir

| Capability | v1 | v2 now | Bring next |
|------------|----|--------|------------|
| Real M-of-N / share cards | Full pages | 3 xpubs / 2-of-3 hex + **link** | Keep **rooms** as SoT. Track stays the **story** (keys ≠ shares). Add stills + one successful build **or** deep-link with return dock (v1 already has docks). |
| SLIP-39 lab | `/slip39.html` | Explicitly not Suite | Do not merge into UC7; keep deep-link from Shamir |

**Do differently:** do not rebuild Multisig/Shamir inside V2. Teach, then **Open room** with a yellow “return to UC6” bar.

---

## UC8 — PSBT

| Capability | v1 | v2 now | Bring next |
|------------|----|--------|------------|
| Inspect | Samples 1, 2, partial, paste | One `cHNidP8A` | **Mount `#cardPsbt`** in the track |
| Never sign | Yes | Do/Do-not + quiz | — |

---

## UC10 — Network

| Capability | v1 | v2 now | Bring next |
|------------|----|--------|------------|
| Opt-in lookup, fees, unknown ≠ 0 | Full `/network.html` | Quiz + **link** | Keep Network **off** V2 CSP. Track teaches leak; **Open Network** after force-exit. Optional: session handoff of UC1 addresses (`#btnSendNetwork`). |

**Do differently:** never `connect-src` mempool on `/v2/`.

---

## Suggested ship order (v1 features → V2 tracks)

1. **UC3** embed Compare card + (optional) two-vault SVG.  
2. **UC4** embed Path playground + SVG + change.  
3. **UC5/UC9** embed watch-only list + copy; descriptor explain.  
4. **UC8** embed PSBT inspector (paste + samples).  
5. **UC1** copy/QR on address cells; optional paste.  
6. **UC6/UC7/UC10** return-dock into existing rooms, not clones.  
7. **(i)** on remaining jargon (zpub, PSBT, GF(256)) from glossary.js — load the same tip engine, do not rewrite terms.

What **not** to bring: Classroom levels as a second curriculum, First-hour 6-step rail, theme fork, new `--cx-*` tokens, SeedSigner chrome, funded-wallet storage.

---

## Retrieval

| URL | What |
|-----|------|
| https://bip39.catalyxt.xyz/v2/compare.md | This file (after deploy) |
| https://bip39.catalyxt.xyz/v2/ | V2 picker |
| https://bip39.catalyxt.xyz/ | Classic Lab |
