# Use-case compare: classic Lab (v1) vs V2 tracks

- **Deeplink:** https://bip39.catalyxt.xyz/v2/compare.md
- **Local:** `/v2/compare.md`
- **Repo:** `web/v2/compare.md`
- **As of:** 2026-08-23 (after UC1 generate-chrome ship on V2)
- **v1:** `/` · `web/index.html` + rooms (`v0.16.35`)
- **v2:** `/v2/` · `web/v2/` (`0.17.0-v2`)

This rewrite is **by use-case (UC1–UC10)**, using the operator highlights from the live V2 pass (Clear secrets placement, word-count list, plain-English generate copy, BIP-39 (i), regenerate length). **Missing** means classic Lab (or a sibling room) has a real control V2 does not yet wire in-track.

| Mark | Meaning |
|------|---------|
| Yes | In that surface |
| Partial | Subset, dump, or **link out** to v1 |
| **Missing** | v1 has it; V2 track does not |
| Shipped | Highlighted gap that V2 now covers |

V2 reuses `bip39lab.bundle.js` + `shamir-core.js`. Gaps are UX/surface, not a second crypto stack.

---

## Operator highlights (the list you called out)

These were **not all** in the first compare.md. Status after the UC1 chrome pass:

| Highlight | Was in first compare.md? | v1 | v2 now | Still missing? |
|-----------|--------------------------|----|--------|----------------|
| **Clear secrets** on bottom-left pane; should sit next to Generate | No (treated as “has Clear secrets”) | Mnemonic **row**: Generate · Validate · **Clear secrets** (red) | **Shipped:** `#v2Clear` on UC1 Generate row and Regenerate row. **Not** in the sidebar. | Yes on **UC2–UC10** pads (no Clear secrets on those steps). Picker/sidebar still has none (intentional). |
| Generate **word count 12, 15, 18, 21, 24** (same as v1) | Yes (v2 “12 or 24 only”) | `#wordCount` five values | **Shipped:** `#v2WordCount` same five values | No on UC1. Other UCs do not expose a length control. |
| Replace jargon **“OS CSPRNG via Lab’s scure path”** with plain English | No (only “plain-English derive copy”) | Hover overlay: “practice recovery phrase… English words only… nothing leaves this tab” | **Shipped on UC1 Generate:** operating-system random bits → BIP-39 practice phrase; do not send money. No CSPRNG/scure on `#v2GenHelp`. | Other UC steps still use short jargon (zpub, GF(256), PSBT) without a matching (i). |
| **BIP-39 mnemonic (i) — English words only**, full sentences, **no contractions** | Partial (global “almost no ⓘ”) | `#mnemonic` label + glossary `data-term="MNEMONIC"` hover | **Shipped on UC1 Generate + exercise:** `#wrapMnemonicI` / `#overlayMnemonic` | **Missing** on UC2–UC10. UC2 still uses contractions (“Don’t”). Validate/Clear on V2 have no (i). |
| **Regenerate 12-word** did not follow 15/18/21; 24 was missing | No (only Generate length) | No separate “Regenerate” button (Generate again + confirm) | **Shipped:** button reads **Regenerate N-word phrase** from the select; 15/18/21/24 tile counts match | None for that bug. v1 still has no labelled regenerate; v1 Generate-again confirm (S80) is its own mess. |

**Read this table first** if you only care what you circled on the screen.

---

## Pedestal (entry / chrome) — not a numbered UC in v1

| Job | v1 | v2 | Missing on v2 |
|-----|----|----|----------------|
| How you start | Feature rooms + First-hour rail | **Use-case picker** UC1–UC10 | — (v2 ahead) |
| Scope gate | One Lab ack overlay (`lab:ack-v1`) | Per-track is / is not + Done when + Start | Collapse not required (ok) |
| Mission sentence | README | Always in V2 sidebar | — |
| Clear secrets | On Lab mnemonic **row** | UC1 Generate / Regenerate only | **Missing** beside later UC actions |
| Theme, Extra help, air-gap chip, Classroom level | Yes | No | **Missing** (power chrome) |
| Hover-(i) on Generate / Validate / Clear | Yes | UC1 mnemonic (i) only | **Missing** Validate (i), Clear (i), Tools (i) |
| Glossary in-page | Yes | Link to `/#glossary` | **Missing** in-track terms |

---

## UC1 — First wallet (Starter)

**v1 home:** Lab `#card-mnemonic`, `#labStrip`, `#addrTable`, `#btnGenerate`, `#btnDerive`, `#btnClear`.

| Capability | v1 | v2 UC1 | Missing on v2 |
|------------|----|--------|----------------|
| Generate practice phrase | Yes | Yes | — |
| Word count 12 / 15 / 18 / 21 / 24 | Yes | **Yes (shipped)** | — |
| Words first; no address jump | Yes | Yes | — |
| Numbered card + practice stamp | Yes (`#labStrip`) | Yes | Gradual **ENT → checksum → seed → address** strip paint |
| BIP-39 (i) English words only | Glossary tip | **Yes (shipped)** | — |
| Plain-English randomness copy | Hover overlay | **Yes (shipped)** | — |
| Clear secrets next to Generate | Yes | **Yes (shipped)** | — |
| Validate gated on “I looked at the card” | No | Yes | — |
| Receive table after Validate | BIP44/49/84/86 tabs, main/test, account/change/count, copy, QR | BIP84 **testnet**, 5 rows, no copy/QR | **Missing:** type tabs, mainnet, path controls, copy, QR, hide-private |
| Paste / edit raw `#mnemonic` | Yes | No | **Missing** |
| Entropy bit line | Yes | No | **Missing** |
| Passphrase on this derive | Masked + strength | No (UC3) | **Missing** on UC1 |
| Seed QR / print / send → Network | Beginner+ | No | **Missing** |
| Force-exit “will not fund” | Banner only | Yes checkbox | — |

---

## UC2 — Paper backup (Starter)

**v1 home:** numbered strip + `#btnPrintBackup` + `#printBackup` print sheet.

| Capability | v1 | v2 UC2 | Missing on v2 |
|------------|----|--------|----------------|
| Card = backup object | Strip in Lab | Numbered grid + card-ack (shipped) | — |
| Print practice sheet | Dedicated print CSS + word list | **Shipped:** `#printBackup` sheet, confirm before print | — |
| Clear secrets on this pad | Lab row (always) | **Shipped** on UC2 steps | — |
| Full sentences, no contractions | Mixed | **Shipped:** “Do not” (no Don’t) | — |
| BIP-39 (i) | Lab | **Shipped** on card + do-not steps | — |
| Photo/cloud warning | Teach copy | **Shipped** full-sentence list | — |

---

## UC3 — Passphrase / 25th word (Beginner)

**v1 home:** Lab `#passphrase` (password) + `#ppStrengthBlock` + Tools `#cardCmpPp`.

| Capability | v1 | v2 UC3 | Missing on v2 |
|------------|----|--------|----------------|
| Compare A vs B addresses | Full table + verdict + Lab phrase source + TEST DATA | Two BIP84 lines in `<pre>` | **Missing:** table, honesty banner, TEST DATA chip, “use Lab phrase” |
| Masked Lab passphrase + strength bar | Yes | Plain-text A/B | **Missing** strength; shoulder-surf warning is weak |
| Empty A vs `test` in B | Yes | Yes (default B=`test`) | — |
| (i) PASSPHRASE | Yes | No | **Missing** |
| No contractions / full explain | Mixed | Short lines; “25th factor” | **Missing** full Lab-style overlay |

---

## UC4 — Path folders (Beginner)

**v1 home:** Tools `#cardPathPlay` + BIP SVG 44/49/84/86 + toggle receive/change + index.

| Capability | v1 | v2 UC4 | Missing on v2 |
|------------|----|--------|----------------|
| Path = folder, words unchanged | Yes | Yes (text) | — |
| BIP map SVG (44/49/84/86) | Yes | No | **Missing** |
| Toggle **change** (receive vs change) | Yes | No | **Missing** (index 0/1 only) |
| Purpose / coin / account why-table | Yes | No | **Missing** |
| Open Lab path controls | Removed in v1 | n/a | — |
| (i) PATH | Yes | No | **Missing** |

---

## UC5 — Watch-only (Beginner)

**v1 home:** Lab watch-only panel + Tools descriptors.

| Capability | v1 | v2 UC5 | Missing on v2 |
|------------|----|--------|----------------|
| Export zpub/xpub/ypub | Purpose **tabs**, copy, QR | One `<pre>` dump | **Missing:** tabs, copy, QR |
| Output descriptors | Dedicated card + explain | Dump lines | **Missing:** `#cardDescExplain`, refuse-private UX |
| Never paste seed into watch app | Copy + quiz elsewhere | Quiz yes | — |
| (i) WATCHONLY / DESCRIPTOR | Yes | No | **Missing** |

---

## UC6 — Multisig (Intermediate)

**v1 home:** `/multisig.html` (M-of-N, BIP67, build, copy).

| Capability | v1 | v2 UC6 | Missing on v2 |
|------------|----|--------|----------------|
| Keys ≠ BIP-39 shares | Teach + stills | Text + quiz | **Missing** intermediate stills |
| Real M-of-N builder | Yes | 3 throwaway xpubs in `<pre>` + **link** | **Missing:** policy, BIP67, P2SH/P2WSH, copy/QR |
| Clear / rebuild | Yes | No | **Missing** |

---

## UC7 — Shamir (Intermediate)

**v1 home:** `/shamir.html` + `/slip39.html` (lab-only).

| Capability | v1 | v2 UC7 | Missing on v2 |
|------------|----|--------|----------------|
| GF(256) split/combine | Share **cards**, fail then M-of-N | One-shot 2-of-3 `<pre>` + **link** | **Missing:** cards, under-threshold error UX |
| SLIP-39 lab | `/slip39.html` | Explicitly not Suite; **no page** | **Missing** as a room (by spec: no Suite claim; v1 still has the lab) |
| Shares ≠ cosigners | Stills + copy | Quiz | **Missing** stills |

---

## UC8 — PSBT / air-gap (Intermediate)

**v1 home:** Tools `#cardPsbt` (samples 1, 2, 1-of-2 partial, paste, inspect, never sign).

| Capability | v1 | v2 UC8 | Missing on v2 |
|------------|----|--------|----------------|
| Inspect structure only | Yes | Yes (minimal `cHNidP8A`) | **Missing:** sample 2, partial, **paste box**, teach fold |
| Never sign / broadcast | Yes | Quiz + copy | — |
| (i) PSBT / BIP174 | Yes | No | **Missing** |

---

## UC9 — xpub privacy (Intermediate / Advanced in v1)

**v1 home:** watch-only export + advanced master→child face.

| Capability | v1 | v2 UC9 | Missing on v2 |
|------------|----|--------|----------------|
| Show account xpub / zpub | Tabs + copy + QR | One BIP84 key in `<pre>` | **Missing:** copy, QR, other purposes |
| xpub ≠ spend + privacy | Copy | Quiz | **Missing** master→child strip/face |
| Hide xprv | Yes | Claims “no xprv” | — |

---

## UC10 — Network leak (Advanced)

**v1 home:** `/network.html` fees, leak ack, address balances, Lab session bridge.

| Capability | v1 | v2 UC10 | Missing on v2 |
|------------|----|--------|----------------|
| Default Lab offline | CSP `connect-src 'none'` | Same on `/v2/` | — |
| Opt-in lookup | Full Network UI | **Link only** | **Missing:** fees, bands, leak checkbox, fetch, unknown ≠ 0 live display |
| Send addresses from Lab | `#btnSendNetwork` | No | **Missing** session handoff |
| unknown ≠ 0 | Fail-closed UI | Quiz only | **Missing** live fail display |

---

## What V2 has that v1 does not (do not treat as gaps)

- Use-case picker + Done-when cards
- Per-track force gate
- Horizontal track rail + 3-card concept strip + pause-before-advance
- UC1 card-ack before Validate
- Force-exit checkbox
- Mission in chrome
- Deep link `?uc=N`

---

## If you promoted V2 to `/` tomorrow — still missing (priority)

1. **Your highlights leftover:** (i) + full no-contraction copy on **every** UC, not only UC1 Generate; Clear secrets on later pads.
2. **UC1 power derive:** paste mnemonic, BIP44/49/86, mainnet, copy/QR, hide-private.
3. **UC3** full Compare card + masked strength.
4. **UC4** Path SVG + receive/change.
5. **UC5/UC9** watch-only tabs + copy/QR + descriptor explain.
6. **UC6/UC7** real Multisig / Shamir rooms (not `<pre>` + link).
7. **UC8** PSBT paste + extra samples.
8. **UC10** live Network opt-in, not a link.
9. **SLIP-39 lab**, glossary, Extra help, theme, Classroom levels.

Classic `/` stays the power lab until an explicit promote.

---

## Retrieval

| URL | What |
|-----|------|
| https://bip39.catalyxt.xyz/v2/compare.md | This file (after deploy) |
| https://bip39.catalyxt.xyz/v2/ | V2 picker |
| https://bip39.catalyxt.xyz/ | Classic Lab |
