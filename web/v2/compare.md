# Classic Lab (v1) vs V2 tracks — feature compare

- **Deeplink (hosted):** https://bip39.catalyxt.xyz/v2/compare.md
- **Local:** `/v2/compare.md` (same origin as the V2 app)
- **Date:** 2026-08-23
- **V1:** `web/index.html` + rooms (`/` · stamp currently `v0.16.x`)
- **V2:** `web/v2/` (`0.17.0-v2`) — parallel surface, **not** a root replace

**Mission (V2 only, always visible):** Practice the custody decision offline, then do the real thing in a wallet you trust.

This note is for CEO / product compare. **Bold “gap” rows** are capabilities that exist in classic Lab (or sibling rooms) and are **missing or only linked-out** on V2.

---

## How to read this

| Mark | Meaning |
|------|---------|
| Yes | Implemented on that surface |
| Partial | Subset / demo / deep-link to the other surface |
| **Gap** | Classic has it; V2 does not (likely missing if V2 were promoted to root) |
| n/a | Intentionally not on that surface |

V2 **reuses** `bip39lab.bundle.js` + `shamir-core.js`. It is not a second crypto stack. Gaps are **product/UX surface**, not a different BIP-39 library.

---

## Navigation & chrome

| Feature | v1 classic | v2 tracks | Notes |
|---------|------------|-----------|--------|
| Use-case picker UC1–UC10 | No | Yes | V2 primary entry |
| Per-track is/isn’t + Done-when gate | No (one Lab ack overlay) | Yes | |
| Mission sentence in chrome | README only | Yes (sidebar) | |
| Sidebar rooms Lab / Multisig / Shamir / Network / Tools / Glossary | Yes (in-page + pages) | Partial — **links out** to v1 URLs | V2 is not a 6-room SPA |
| Classroom level (Starter→Advanced) | Yes `#learnLevel` | **Gap** | No soft-gates by classroom chip |
| First-hour 6-step sticky rail | Yes | n/a (per-track rails) | Different pedagogy |
| Theme dark/light | Yes | **Gap** | |
| Extra help On/Off (`data-teach`) | Yes | **Gap** | Teach-only copy not toggled |
| Hover-(i) / OK-only overlays | Yes (Generate/Derive/Clear + glossary tips) | **Gap** | V2 has almost no ⓘ |
| Air-gap / `navigator.onLine` chip | Yes | **Gap** | |
| Offline-crypto CSP chip | Yes | Partial (CSP on page, no chip) | |
| Site version chip (prod stamp) | `web/VERSION` | Separate `0.17.0-v2` | By design |

---

## BIP-39 generate / derive (Lab core)

| Feature | v1 | v2 | Notes |
|---------|----|----|--------|
| Generate practice mnemonic (scure) | Yes 12/15/18/21/24 | Partial **12 or 24 only** | **Gap:** 15/18/21 |
| Generate stays on words (no address jump) | Yes (after 0.16.34+) | Yes (UC1) | |
| Numbered word card (index + word) | Yes `#labStrip` | Yes (UC1/UC2) | |
| Practice-backup stamp | Yes | Yes | |
| Raw mnemonic textarea (paste/edit) | Yes `#mnemonic` | **Gap** | V2 memory-only; no paste pad |
| Validate & derive | Yes | Yes (UC1, gated on card ack) | |
| Card-ack before Validate | No | Yes (UC1/UC2 intent) | V2-only |
| Address table: BIP44 / 49 / 84 / 86 tabs | Yes | **Gap** — BIP84 **testnet** rows only | No Taproot/legacy/nested switch |
| Mainnet + testnet network control | Yes `#deriveNetwork` | **Gap** — hardcoded `network: "test"` | |
| Account / change / count controls | Yes | **Gap** (UC4 toggles index 0/1 only) | |
| Copy address + per-row QR | Yes | **Gap** | |
| Hide private fields | Yes | **Gap** | |
| Passphrase on Lab derive (masked + strength bar) | Yes | **Gap** on UC1; UC3 has **plain-text** A/B | No strength meter, no Lab `#passphrase` |
| Entropy / checksum bit readout | Yes `#entropyMnemonic` | **Gap** | Strip ENT/CS stages not painted |
| Status / plain-English derive copy | Yes | Partial (short track copy) | |
| Clear secrets (red) | Yes (mnemonic row) | Yes on UC1 Generate / Regenerate rows (not sidebar) | Empties this-tab practice phrase only |
| Replace-phrase confirm dialog | Intended (S80) | **Gap** | Neither is reliable; v1 test fails |
| Keyboard G / D / Esc / ? | Yes | **Gap** | |

---

## Tools pack (classic Tools tab)

| Feature | v1 | v2 | Notes |
|---------|----|----|--------|
| Path playground + BIP SVG (44/49/84/86) | Yes `#cardPathPlay` | **Gap** — UC4 text + index toggle, **no SVG** | |
| Path purpose table / coin / account why | Yes | **Gap** | |
| Toggle receive **and** change | Yes | **Gap** — index 0/1 only | |
| Entropy pad (dice/coin, bit table, practice seed) | Yes `#cardEntPad` | **Gap** | Beginner quiz Q3/Q4 live here |
| Compare two passphrases (full table + verdict) | Yes `#cardCmpPp` | Partial UC3 (two lines of BIP84) | **Gap:** honesty banner, Lab-source preview, TEST DATA chip |
| Output descriptors refresh | Yes | Partial (dumped in UC5 pre) | **Gap:** no dedicated card / copy |
| Descriptor **explain** (refuse secrets) | Yes `#cardDescExplain` | **Gap** | |
| PSBT inspect: samples 1, 2, 1-of-2 partial, paste | Yes | Partial — **one** `cHNidP8A` sample | **Gap:** story sample, paste box, never-sign essay fold |
| Tools “phrase source” / auto TEST DATA | Yes | **Gap** | |

---

## Advanced Lab surfaces

| Feature | v1 | v2 | Notes |
|---------|----|----|--------|
| Seed QR (offline, confirm) | Yes (Beginner+) | **Gap** | |
| Print backup sheet (formatted `#printBackup`) | Yes | Partial UC2 `window.print()` | **Gap:** dedicated print stylesheet / word list sheet |
| Send addresses → Network session bridge | Yes | **Gap** | UC10 only **links** to `network.html` |
| Watch-only UI (purpose tabs, copy, QR) | Yes | Partial dump in `<pre>` | **Gap:** zpub/ypub/xpub **tabs**, copy, QR |
| BIP-85 educational demo | Yes `#btnBip85Demo` | **Gap** | |
| Beginner stills (key / dice / lock) | Yes | **Gap** | |
| Intermediate stills (keys ≠ shares ≠ SLIP-39) | Yes | **Gap** | |
| Advanced master→child face | Yes | **Gap** | |
| `#labStrip` gradual paint by level | Yes | **Gap** | |
| In-page Glossary + search | Yes | **Gap** — link to v1 `#glossary` | |
| Guided Q1–Q4 + I1–I4 + A1–A4 boards | Yes | Partial — one quiz **per track** | Different item bank; no “Go try” docks |

---

## Sibling rooms (full pages)

| Feature | v1 | v2 | Notes |
|---------|----|----|--------|
| Multisig page (M-of-N, BIP67, public keys, build) | Yes `/multisig.html` | Partial UC6: 3 throwaway xpubs + **link** | **Gap:** real M-of-N builder, script, QR |
| Shamir GF(256) split/recombine UI | Yes `/shamir.html` | Partial UC7: one-shot 2-of-3 in `<pre>` + **link** | **Gap:** full share cards, fail-then-M-of-N drill |
| **SLIP-39 lab** `/slip39.html` | Yes (lab-only) | **Gap** | Spec: do not claim Suite; still a v1 room |
| Network fees + opt-in address balances | Yes `/network.html` | Partial UC10 **link only** | **Gap:** no fee bands, no lookup, no leak ack UI on V2 |
| Fee API / mempool proxy | Yes (Network CSP) | n/a (V2 CSP `connect-src 'none'`) | Correct for V2 Lab pages |

---

## Pedagogy / state

| Feature | v1 | v2 |
|---------|----|----|
| First-visit ack overlay | Yes `lab:ack-v1` | Per-track gate (`bip39lab.v2.gateN`) |
| Force-exit “will not fund practice” | No (banner only) | Yes checkbox before Finish |
| Pause-before-advance | Partial (hour Go) | Yes explicit pause buttons |
| Concept strip (3 cards, current `hi`) | No | Yes |
| Progress persistence | `localStorage` first-hour / quiz / level | `sessionStorage` `bip39lab.v2` (tab-scoped) |
| Deep link into a lesson | Hash tabs `#tools` | `?uc=3` |
| Learn-return dock / quiz evidence | Yes | **Gap** |

---

## Likely missing on V2 if you promoted it to root tomorrow

These are the **high-impact gaps** (not “nice-to-have copy”):

1. **Power Lab controls** — paste mnemonic, 15/18/21 words, mainnet, BIP44/49/86 tabs, account/change/count.
2. **Address actions** — copy, QR, hide-private, seed QR, send-to-Network handoff.
3. **Passphrase-on-derive** — masked field + strength; UC3 is compare-only.
4. **Path playground fidelity** — BIP SVG, change-chain toggle, purpose table.
5. **Entropy pad + bit verdicts** (classroom Q3/Q4).
6. **PSBT paste + extra samples**; descriptor explain.
7. **Full Multisig / Shamir / SLIP-39 / Network UIs** (V2 only deep-links).
8. **Glossary, Extra help, theme, air-gap chip, hover-(i).**
9. **Classroom levels + First-hour sticky rail + chapter stills.**
10. **Watch-only chrome** (tabs, copy, QR) vs a text dump.

V2 **ahead of v1:** use-case picker, per-track gate + Done when, generate→card→ack→derive, force-exit, mission in chrome, concept strip, pause rails.

---

## What V2 is for (so gaps are not all bugs)

V2 is a **guided custody curriculum** beside classic rooms. Rooms stay as implementation surfaces. Promoting V2 to `/` without porting the gap list would **drop** the power-user lab.

Classic stays canonical until an explicit promote ship.

---

## Retrieval

| URL | What |
|-----|------|
| https://bip39.catalyxt.xyz/v2/compare.md | This file (after deploy) |
| https://bip39.catalyxt.xyz/v2/ | V2 picker |
| https://bip39.catalyxt.xyz/ | Classic Lab |
| Repo path | `web/v2/compare.md` |
