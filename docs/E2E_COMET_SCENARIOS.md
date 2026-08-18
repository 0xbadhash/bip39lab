<!-- WEB_E2E_CONTRACT
version: 2
base_url: https://bip39.catalyxt.xyz
surfaces:
  - id: lab
    path: /
    playwright: e2e/lab.spec.ts
  - id: tools
    path: /#tools
    playwright: e2e/lab.spec.ts
  - id: glossary
    path: /#glossary
    playwright: e2e/glossary.spec.ts
  - id: multisig
    path: /multisig.html
    playwright: e2e/multisig.spec.ts
  - id: shamir
    path: /shamir.html
    playwright: e2e/shamir.spec.ts
  - id: slip39
    path: /slip39.html
    playwright: e2e/slip39.spec.ts
  - id: network
    path: /network.html
    playwright: e2e/network.spec.ts
  - id: chrome
    path: /
    playwright: e2e/site-chrome.spec.ts
  - id: help
    path: /
    playwright: e2e/help-ux.spec.ts
scenarios: S0–S90 · Playwright 111 tests · auto-stamped from e2e/ + VERSION
-->

# BIP39 Lab — Exhaustive E2E (Playwright + Comet / Perplexity)

> **STALE COPY CHECK:** If this file shows Product `0.13.9`, toggle name **Teach On/Off**, or score **`/68`**, you have an outdated copy. Re-fetch **now** from:
> - Live: https://bip39.catalyxt.xyz/docs/E2E_COMET_SCENARIOS.md
> - GitHub raw: https://raw.githubusercontent.com/0xbadhash/bip39lab/master/docs/E2E_COMET_SCENARIOS.md  
> Current stamp is in the `Product:` line below (must be ≥ 0.16.1, scenarios S0–S82).

`Product: 0.16.9 · Contract: 2 · Last aligned: 2026-08-18 · Scenarios: S0–S90 · Playwright S-ids: 111`

**Canonical:** `docs/E2E_COMET_SCENARIOS.md`  
**Repo:** [0xbadhash/bip39lab](https://github.com/0xbadhash/bip39lab)  
**Live base:** https://bip39.catalyxt.xyz/

## Comet report remediation (2026-08-11)

Agents re-reading **live** bip39.catalyxt.xyz may still see older copy until deploy.
**In this repo** (stamp Product line above; post-v0.16.1 commits):

| Report issue | Status in repo |
|--------------|----------------|
| Score `/68` / template ends S56 | **Fixed** — report template S0–S82 + dynamic denominator (header Playwright count) |
| Teach vs Extra help | **Fixed** — doc uses **Extra help**; UI is Extra help |
| Tools “no rail” vs toolsStepRail | **Fixed** — no mid-page rails; S44/S44b match Playwright |
| Playwright “74 tests” | **Fixed** — header auto-stamps current S-id count (e.g. 89) |
| S57c 7th-nav regression | **Added** — Playwright S57c |
| S16 no mnemonic words | **Hardened** — address-shape tokens only |
| S61 localStorage | **Hardened** — reload asserts ticks + level |
| S38/S39/S39b / S67 | **NEEDS-DOM** in template; covered by Playwright site-chrome + S67 |

Live deploy lag is not a product FAIL if GitHub/raw doc already has Extra help + S0–S82.


| Surface | URL | Playwright |
|---------|-----|------------|
| Lab | `/` | `e2e/lab.spec.ts` |
| Tools | `/#tools` (same page as Lab) | `e2e/lab.spec.ts` |
| Glossary | `/#glossary` (same page as Lab) | `e2e/glossary.spec.ts`, lab S25 |
| Multisig | `/multisig.html` | `e2e/multisig.spec.ts` |
| Shamir | `/shamir.html` | `e2e/shamir.spec.ts` |
| **SLIP-39 lab** | `/slip39.html` (deep-link; not 7th nav) | `e2e/slip39.spec.ts` |
| Network | `/network.html` | `e2e/network.spec.ts` |
| Help / Teach | all shells | `e2e/help-ux.spec.ts` |
| Chrome parity | all shells | `e2e/site-chrome.spec.ts` |

**Playwright total:** `npm run test:e2e` → **111** S-id tests (local `http://127.0.0.1:4173`).
**Live:** `npm run test:e2e:live` (`BASE_URL=https://bip39.catalyxt.xyz`).  
**Comet/Perplexity score sheet:** **S0–S90** (scenario IDs below; Playwright titles map 1:1 where listed).

### Sidebar (every page) — **6 items**

| # | Nav | Route | Role for a human |
|---|-----|-------|------------------|
| 1 | **Lab** | `index.html` | Create/paste recovery phrase → see receive addresses |
| 2 | **Multisig** | `multisig.html` | M-of-N vault from **public keys** only |
| 3 | **Shamir** | `shamir.html` | Educational M-of-N **share split** (not SLIP-39) |
| 4 | **Network** | `network.html` | Public fees + opt-in address balances |
| 5 | **Tools** | `index.html#tools` | Offline utilities (path, entropy pad, PSBT, …) |
| 6 | **Glossary** | `index.html#glossary` | Terms + security / threat model |

There is **no** Balance nav (docs folded into Network). There is **no** separate About (merged into Glossary).

---

## Global mental model (must be coherent)

```text
Secrets stay offline ──► Lab / Multisig / Shamir / SLIP-39 lab / Tools  (CSP connect-src 'none')
Addresses only online ─► Network (opt-in mempool.space) + CLI/Knots for private checks
Words to look up ──────► Glossary (always available; Teach optional)
```

| Idea | Where humans learn it | Must not confuse with |
|------|----------------------|------------------------|
| BIP-39 recovery phrase | Lab | Multisig keys / Shamir hex shares / SLIP-39 share words |
| M-of-N **keys** (spend policy) | Multisig | Shamir M-of-N **shares** |
| M-of-N **shares** of one secret | Shamir | Multisig / BIP-39 words |
| Fees & public balance | Network | Pasting a seed |
| Path / PSBT / descriptors | Tools | Signing or broadcasting |
| Acronyms & threat model | Glossary | A “hidden” sixth product |

**Extra help On/Off (all shells):** UI label is **“Extra help: On/Off”** (`#btnTeach`, `data-teach-toggle`) — not “Teach:”.  
On = longer teach-only copy + most ⓘ. Off = compact UI; **safety ⓘ** (seed, CSP, air-gap, PSBT, leak ack, Extra help tip) remain.  
**No mid-page step rails** (removed) — navigation is left **6-nav** + First-hour / Quiz **Go try** + amber return dock.  
Preference is one `localStorage` flag across pages.

---

## PROMPT FOR COMET / PERPLEXITY

```text
You are a browser QA agent for bip39lab. Execute the FULL suite S0–S82 (all
S-ids in Playwright titles + body of this file). Also complete the HUMAN
COHERENCE checklist for EVERY page (section “Human process flows”).

SOURCE OF TRUTH: docs/E2E_COMET_SCENARIOS.md · repo 0xbadhash/bip39lab
Product version: read live sidebar (e.g. v0.16.1) AND the stamped Product line
at the top of this file — prefer live if they disagree after a deploy lag.

APPS (hard-refresh each once before testing):
  1. https://bip39.catalyxt.xyz/                 (Lab · Tools · Glossary panels)
  2. https://bip39.catalyxt.xyz/multisig.html
  3. https://bip39.catalyxt.xyz/shamir.html
  4. https://bip39.catalyxt.xyz/slip39.html      (deep-link; not a 7th nav item)
  5. https://bip39.catalyxt.xyz/network.html

SIDEBAR: exactly **6** nav items, same order on every page:
  Lab · Multisig · Shamir · Network · Tools · Glossary
FAIL if Balance or About reappear as primary nav.
UI toggle label is **Extra help: On/Off** (not “Teach:”).

RULES:
  - Lab test mnemonic ONLY:
    abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about
  - Multisig: public keys or “Generate demo cosigners” only — never fundable secrets.
  - Shamir: practice secret only — educational, NOT SLIP-39; do not use a real seed.
  - Network: addresses only — NEVER paste a mnemonic.
  - Lab / Multisig / Shamir / Tools: offline crypto (no secret network calls).

For each page section: walk the process flow as a first-time human learner would.
Mark scenarios PASS/FAIL with short evidence. Fill HUMAN COHERENCE (coherent /
makes sense / intuitive) per page. End with the Report template (score __ / N).
```

### PROMPT — UI / copy / flow consistency (always run)

```text
You are a product-UX auditor for bip39lab (https://bip39.catalyxt.xyz).
Run this pass on EVERY shell after (or with) S0–S82. Do not skip pages.

GOAL: Verify the live UI, on-page descriptions, and security guidelines stay
consistent with each other and with the product mental model in
docs/E2E_COMET_SCENARIOS.md — and that a first-time learner can follow an
intuitive flow without contradiction or dead ends.

SURFACES (hard-refresh once each):
  Lab (/) · Multisig · Shamir · Network · Tools (#tools) · Glossary (#glossary)
  plus chrome: sidebar, header/branding, Extra help On/Off, safety ⓘ tips

CHECK A — UI consistency across shells
  - Same 6-nav order/labels; current-page highlight correct
  - Shared chrome (brand, Teach toggle, footer/legal tone) feels one product
  - Step rails / panels / buttons use consistent patterns (primary vs danger,
    empty states, error vs unknown balance language)
  - Extra help Off still keeps safety-critical tips; On expands longer teach-only copy (no step rails)

CHECK B — Description & guideline alignment
  - Hero/subtitle/help copy matches what the page actually does
  - Security guidelines match reality (offline CSP vs Network opt-in only)
  - Multisig = public keys / M-of-N spend policy; Shamir = educational shares
    (not SLIP-39 / not BIP-39 words); Lab = recovery phrase; Network = addresses
  - No copy that invites pasting a seed into Network or funding demo keys
  - Glossary definitions do not contradict Lab/Multisig/Shamir labels

CHECK C — Flow intuitivity (first-time human)
  - Clear “start here → next step → result” without hunting
  - Primary action obvious; destructive/network actions gated or labeled
  - Errors are actionable; success states explain what happened next
  - Cross-links (e.g. Network→Tools, glossary tips) land where claimed
  - Mental-model traps called out (keys vs shares vs words) where users mix them

OUTPUT (per surface + overall):
  ui_consistent=Y|N  copy_aligned=Y|N  flow_intuitive=Y|N
  Evidence (1–3 bullets). List contradictions, confusing labels, or broken
  flows as FAIL blockers. End with top 3 UX fixes if any FAIL.
```

### Goldens (mainnet · account 0 · change 0 · index 0 · empty passphrase)

| Type | Address |
|------|---------|
| BIP86 | `bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr` |
| BIP84 | `bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu` |
| BIP49 | `37VucYSaXLCAsxYyAPfbSi9eh4iEcbShgf` |
| BIP44 | `1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA` |
| Testnet BIP84 | starts with `tb1` when Network=Test |

### Multisig sample pubs (2-of-2 golden P2SH)

```text
0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798
02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5
→ P2SH 33RQmypKhD6f4tMquiR5a3C6dRT7eBpaiG
```

---

# Human process flows (Perplexity / Comet — every page)

Agents **must** complete the coherence box after walking each flow. Score:

- **Coherent:** steps follow a story a beginner can narrate (“first … then …”).
- **Makes sense:** controls match the story; no dead ends or contradictory copy.
- **Intuitive:** primary action is obvious; danger is visible without hunting.

---

## Page 1 — Lab (`/`)

### Description
Offline BIP-39 lab: generate or paste an English recovery phrase, optional passphrase, derive receive addresses (BIP86/84/49/44), watch-only export, hand off addresses to Network.

### Process flow (learner)

```text
1. Land on Lab · read air-gap warn · note Offline crypto + Browser online/offline chips
2. (Extra help On) Use **First hour checklist** Go steps (or scroll): Phrase → addresses → Tools
   — **no mid-page step rail**; amber dock “← Back to First hour” while away from checklist
3. Choose word count → Generate  OR  paste abandon vector
4. See entropy line + address table fill (default Taproot bc1p…)
5. Optionally: passphrase, account/change/count, address-type tabs
6. Copy / QR one address · Refresh watch-only (zpub/xpub)
7. Optional: Send addresses → Network  OR  open Tools / Glossary from sidebar
```

### Primary controls
Generate · Validate & derive · Clear · Hide private · address-type tabs · watch-only refresh · **Extra help** · Theme

### Human coherence checklist

| Criterion | Expected | PASS/FAIL | Notes |
|-----------|----------|-----------|-------|
| Coherent | Phrase → addresses → watch-only without a mid-page wizard rail | | |
| Makes sense | “Generate” produces phrase + table without extra clicks | | |
| Intuitive | Default Taproot; goldens match when abandon pasted | | |
| Safety | Air-gap warn + mnemonic ⓘ always findable | | |
| Extra help Off | Long teach-only copy hides; chips + safety ⓘ remain | | |

### Playwright / scenarios
S0, S0b, S0c, S1, S1b, S2–S9, S11, S15, S16 · `e2e/lab.spec.ts`

---

## Page 2 — Tools (`/#tools`)

### Description
Same shell as Lab. Offline utilities: derivation path playground, dice/coin entropy pad, passphrase compare, output descriptors, PSBT inspect (no sign), descriptor explain, shortcuts.

### Process flow (learner)

```text
1. Open Tools from sidebar (or press ? on Lab when not typing)
2. Path playground: full path + table of each level (purpose/coin/account/change/index) · Open Lab path controls
3. Entropy pad: roll dice / flip coin · **Build practice seed from pad** → see bit table (pad vs 128/256) + PRACTICE ONLY words · never fund
4. Compare passphrases (3 steps): Use Lab phrase or Generate throwaway → type A/B (plain text) → Compare → table of addresses
5. Descriptors: Refresh → public descriptor text; prefix `[TEST DATA]` or `[Lab phrase]`; Phrase source blurb + TEST DATA chip on Tools intro
6. PSBT: open teach fold “When does partial make sense?” · Sample: multisig/HWW story or minimal · Inspect (structure + teach footer only — no sign)
7. Descriptor explain: public string only · refuse seeds
```

### Primary controls
Path out · Dice/Coin/Clear · Generate test phrase · Compare · Refresh descriptors · Inspect PSBT · Explain

### Human coherence checklist

| Criterion | Expected | PASS/FAIL | Notes |
|-----------|----------|-----------|-------|
| Coherent | Cards are independent tools, not a forced pipeline | | |
| Makes sense | **No mid-page step rail** (toolbox, not a recipe) — card titles are enough | | |
| Intuitive | Compare works without returning to Lab | | |
| Safety | PSBT ⓘ / copy says never signs or broadcasts | | |
| Extra help Off | Long Tools intro hides; tool cards still usable | | |

### Playwright / scenarios
S14, S17–S23, S18b, S18c · `e2e/lab.spec.ts`

---

## Page 3 — Glossary (`/#glossary`)

### Description
Searchable plain-English BIPs, scripts, acronyms. Hosts **Security model** + **Threat model** (former About). Not a crypto engine.

### Process flow (learner)

```text
1. Open Glossary from sidebar
2. Browse list or search (e.g. BIP84, Shamir, UTXO, sat/vB)
3. Read security / threat cards at bottom
4. Cross-check: on Lab, click mnemonic ⓘ → same ideas as glossary
```

### Human coherence checklist

| Criterion | Expected | PASS/FAIL | Notes |
|-----------|----------|-----------|-------|
| Coherent | “Dictionary + security” is clear | | |
| Makes sense | No Generate/Build on this panel | | |
| Intuitive | Search filters terms quickly | | |
| Safety | No retention / threat bullets always under Glossary | | |

### Playwright / scenarios
S25, S49–S52 · `e2e/lab.spec.ts`, `e2e/glossary.spec.ts`

---

## Page 4 — Multisig (`/multisig.html`)

### Description
Educational M-of-N **from public keys only**. Demo cosigner generator (throwaway). Builds P2SH + P2WSH addresses offline. Refuses WIF/xprv.

### Process flow (learner)

```text
1. Land · Offline chip · read “What is multisig?” (vs single-key wallet)
2. (Extra help On) Scroll cards Intro → Keys → Demo → Build → Result (no mid-page rail)
3. Optional: Generate demo cosigners (N, word count) → public keys + zpubs
4. Or paste compressed pubkeys (one per line)
5. Set M · BIP67 sort · Build
6. Read P2SH (3…) + P2WSH (bc1q…) · copy · if Intermediate I1: Mark I1 on amber dock
7. Clear to reset
```

### Human coherence checklist

| Criterion | Expected | PASS/FAIL | Notes |
|-----------|----------|-----------|-------|
| Coherent | Explain → keys → build → addresses | | |
| Makes sense | Distinct from Shamir (keys ≠ shares) | | |
| Intuitive | Demo generator lowers barrier | | |
| Safety | Private key paste refused; offline CSP | | |
| Extra help Off | Long folds hide; Build still works | | |

### Playwright / scenarios
S12, S12b, S26–S31 · `e2e/multisig.spec.ts`

---

## Page 5 — Shamir (`/shamir.html`)

### Description
Educational **Shamir secret sharing** over bytes (GF(256)). Demo split + **Verify recombine** — **not SLIP-39**, not BIP-39 words.

### Process flow (learner)

```text
1. Land · red educational banner (not SLIP-39 / not real funds)
2. Note banner link **#shLinkSlip39** “SLIP-39 lab” (deep-link, not 7th nav)
3. Read compare table: Shamir vs Multisig vs BIP-39
4. Generate practice secret (hex) — do not use Lab mnemonic
5. Set M and N (default 2-of-3) → Split demo
6. See N cards `share:index:hex` · Copy one
7. **Verify recombine** (or Fill M shares from cards) → matches practice secret
8. If Intermediate I2: Mark I2 on amber dock · Clear when done
```

### Human coherence checklist

| Criterion | Expected | PASS/FAIL | Notes |
|-----------|----------|-----------|-------|
| Coherent | Teach difference first, then demo split | | |
| Makes sense | Banner + “not SLIP-39” before any split | | |
| Intuitive | Generate + Split + Verify recombine close the teach loop | | |
| Safety | Empty secret errors; no fake success; not SLIP-39 | | |
| Extra help Off | Long folds hide; banner + Generate/Split/Recombine remain | | |

### Playwright / scenarios
S53–S56 · `e2e/shamir.spec.ts`

---

## Page 6 — Network (`/network.html`)

### Description
**Opt-in** public data: fee/traffic snapshot + address-only balances via mempool (or proxy). Lab seeds never belong here. CLI/Knots notes for private balances.

### Process flow (learner)

```text
1. Land · note mempool chip (this page may use network)
2. (Extra help On) Scroll Understand → Fees → Balances (no mid-page rail)
3. Read “what this is / is not”
4. Fetch fee + traffic snapshot → bands + tip height
5. Balances: tick leak-ack → paste addresses OR Load from Lab session
6. Fetch balances → table (ok / unknown / error — never silent zero)
7. Optional: read Private balance via CLI (Knots) block
```

### Human coherence checklist

| Criterion | Expected | PASS/FAIL | Notes |
|-----------|----------|-----------|-------|
| Coherent | Explain leak → fees → balances | | |
| Makes sense | Buttons disabled until ack | | |
| Intuitive | Mnemonic in address box rejected | | |
| Safety | Leak checkbox + ⓘ; never requires seed | | |
| Extra help Off | Long folds hide; ack + Fetch still work | | |

### Playwright / scenarios
S13b–d, S32–S35 · `e2e/network.spec.ts`

---

## Cross-cutting: Help / Extra help / Chrome

### Description
Shared shell: 6-nav, **Extra help** toggle + ⓘ, **no mid-page step rails**, CSP isolation Lab/Multisig/Shamir/SLIP-39 vs Network.

### Process flow

```text
1. Verify 6-nav labels identical on Lab, Multisig, Shamir, Network, SLIP-39
2. Extra help On → longer teach-only copy; Off → compact; safety ⓘ remain
3. Assert zero elements matching [data-step-rail], #labStepRail, #toolsStepRail, #msStepRail
4. Open mnemonic or PSBT ⓘ · Esc closes
5. Confirm Lab/Multisig/Shamir/SLIP-39 CSP offline; Network allows mempool/'self'
```

### Human coherence checklist

| Criterion | Expected | PASS/FAIL | Notes |
|-----------|----------|-----------|-------|
| Coherent | Same left nav story everywhere | | |
| Makes sense | Extra help ⓘ explains longer copy (not a wizard) | | |
| Intuitive | Offline pages never “phone home” for secrets | | |

### Playwright / scenarios
S10, S24, S36–S48b · `e2e/lab.spec.ts`, `site-chrome`, `help-ux`

---

# Scenario catalogue (S0–S90)

## Lab shell

### S0 — Smoke
Open Lab → title Offline BIP-39 lab; Generate visible; **6** nav (Lab…Glossary, **includes Shamir**, no About/Balance); Offline crypto + airgap chips; CSP `connect-src 'none'`.
`#labSafetyBanner`: crypto stays in this tab; progress/theme may be saved; addresses to Network only after opt-in; do not use a funded phrase. Must **not** say “nothing is written to disk or sent to a server.”
Sidebar chip HTML (before JS) and `#status` Ready line show the same product tag (not `0.11.0-scure`).

### S82 — Receive / Compare honesty
Receive lede and Compare intro (`#cmpHonestyIntro`) do **not** say “nothing is sent.”
Compare opt-in (“Addresses leave only if you opt in on Network.”) is **visible with Extra help Off**. Extra help may repeat it.

### S83 — No FIRST_HOUR.md learner links
Lab orientation + First hour must **not** link or show `docs/FIRST_HOUR.md` (live `/docs/FIRST_HOUR.md` is 500). Checklist is the guide.

### S84 — First Hour form / results / compare
Go h2 shows mnemonic + Generate. Checklist + dock Mark done **disabled** until Generate produces a valid phrase. Checkbox cannot self-tick. After Generate, Mark done enables, ticks, returns. Go h5 → compare. Same-passphrase compare: Mark done stays off. Empty vs `test` with different addresses: Mark done on.

### S85 — Go h3 before derive (error)
Go h3 with empty Receive table must land on Validate & derive (`#btnDerive`), not empty addresses. Banner: press Validate & derive so addresses fill. After derive, table has rows; Mark done enables.

### S86 — Tools Path playground spacer
Visible gap (≥8px) between the ⓘ / Extra help teach line and `#cardPathPlay`.

### S87 — Dock names unfinished action (missing-data + plain English)
Every First Hour dock names the unfinished action. Never leftover “Finish, then Mark done on the checklist.” h4: “In Path playground, use purpose, coin, account, change, and index (Lab path controls). Mark done stays off until all five have been used.” No CSS IDs in the dock. Mark done stays disabled until all five Lab path controls are used.

### S88 — Quiz 4/4 recommendation
After Guided quiz 4/4 Passed, `#quizHourNext` and the hour dock name **7 Network (optional)** then **8 Raise to Beginner**. Not blank.

### S89 — Network h7 leak-ack
Go h7 → leak-ack. `#btnHourMarkFromDockNet` disabled until `#balAck`. Tick → enable → Mark done writes h7 and returns to the checklist.

### S90 — First Hour dock mobile wrap
390px: dock Back + hint + Mark done wrap; no horizontal blowout.

### S81 — Empty Validate & derive
Clear mnemonic → Validate & derive → `#status` missing-data (not silent Ready).

### S11b — 11-word length status
11 abandon words → `#status` says length (not wordlist/checksum).

### S0b — Theme
Theme toggles dark/light; page usable. Light-theme `#labSafetyBanner` contrast ≥ 4.5:1. Sidebar classroom controls stay readable.

### S0c — Keyboard `?`
Focus body → `?` → Tools panel + path playground.

---

## Lab mnemonic & table

### S1 — Generate 12
Word count 12 → Generate → 12 words; entropy `128 bits…`; ≥5 table rows; default network Testnet → `tb1p`.

### S80 — Generate replace confirm
After a phrase exists, Generate asks confirm; dismiss keeps phrase; accept replaces.

### S1b — Generate 24
Word count 24 → Generate → 24 words; entropy `256 bits…`.

### S2 — Abandon all types
Clear → paste abandon → BIP86/84/49/44 match **all four goldens**.

### S2b — Word count follows paste
Set word-count dropdown to **24**, paste 12-word abandon → dropdown becomes **12** and entropy shows 128-bit.

### S3 — Passphrase + strength estimate
Optional passphrase changes addresses. **Passphrase strength (estimate)** (`#entropyPassphrase`) updates live:
empty → “Empty — no extra secret (not the 512-bit PBKDF2 seed size)”; typed text → “~N bits · weak|fair|stronger (estimate only…)”.
Bar `#ppStrengthBar` moves. Not the seed’s fixed 512-bit PBKDF2 output size.
BIP84 golden → passphrase `test` → address ≠ golden; clear passphrase → golden returns.

### S4 — Account / change / indices
Indices 10 → 10 rows; change 1 → path mentions change; account 1 → ≠ golden; reset 0/0/5 → golden.

### S5 — Mainnet / testnet
Default Test → `tb1…` → Main restores abandon BIP84 golden → Test again `tb1`.

### S6 — Copy
Copy first address → Copied / `#copyFeedback`.

### S7 — QR address
QR → modal image + address → Close.

### S8 — Watch-only
Refresh → BIP84 **zpub**, no xprv; BIP44 pad → **xpub**, no xprv.

### S9 — Hide + Clear
Hide private → mnemonic hidden; Clear → empty mnemonic + empty table.

### S11 — Invalid mnemonic
Garbage → no valid abandon goldens.

### S15 — Seed QR
Paste valid phrase → confirm → `#qrModal` visible with seed image + live words.

### S15b — Invalid Seed QR
Garbage words → no modal; status refuses QR.

### S16 — Send → Network
**Send addresses → Network** writes session; Load works (no mnemonic). Derive alone does not fill session.

---

## Lab Tools panel

### S14 — Path playground
Tools → path card: path string + level table (purpose/coin/account/change/index) + plain-words summary; **Open Lab path controls** jumps to Lab.

### S17 — Entropy pad
Dice + coin events; Clear → empty pad.

### S17b — Entropy pad → practice seed (low-entropy warning)
Few rolls → **Build practice seed from pad** → PRACTICE ONLY warn; bit table shows pad estimate vs **128** (12-word); gap **TOO LOW** or never-for-funds; 12 practice words shown. Optional copy into Lab is TEST DATA only.

### S18 — Compare passphrases
Tools only (no Lab visit required); B=`test` → A/B addresses; Different or Same.

### S18b — Generate test phrase then compare
Generate test phrase → Compare → Different.

### S18c — Clear secrets then compare auto-gens TEST DATA
Clear secrets (Lab empty) → Tools → cmp out notes TEST DATA/cleared → Compare with B=`test` → output has `[TEST DATA]` and Different/Same.

### S19 — Descriptors refresh
Refresh → wpkh/tr/pkh/sh descriptors.

### S20 — PSBT inspector + samples
Tools → PSBT card explains partial signing (multisig / HWW / air-gap).  
**Sample: multisig / HWW story** loads synthetic PSBT → Inspect → ok/educational + story line; never signs.

### S20b — PSBT teach fold + minimal sample
Open “When does a partial transaction make sense?” fold (Multisig, Hardware, Lifecycle).  
**Sample: minimal structure** → Inspect + story about empty global map.

### S21 — PSBT refuse secrets
Refuse seed-like paste if applicable.

### S22 — Descriptor explain
Public descriptor OK; private refused.

### S23 — Shortcuts card
G / D / Esc / ? documented.

---

## Redirects & Glossary security

### S24 — Old `#balance` deep link
`/#balance` → Network balance/CLI card (knots/mempool guidance).

### S25 — Glossary security & threat
`#glossary` or `#about` → no retention + Threat model.

### S10 — Full nav tour
Lab → Tools → Glossary → Multisig → **Shamir** → Network; **6** nav each.

---

## Multisig

### S26 — Shell
Offline CSP; 6-nav; explainer; checklist; `#msPolicy`.

### S12 — Golden 2-of-2 + refuse private
Sample pubs M=2 BIP67 → P2SH golden; WIF refused.

### S12b — Demo N=3
Generate demo → Build → of-3 policy; P2SH `3…` / P2WSH `bc1`.

### S27 — Demo 24-word pad
24-word demo cosigners mention 256 bits / 24.

### S28 — BIP67 off
Policy mentions sort OFF.

### S29 — Clear
Result hidden; keys cleared.

### S30 — Copy P2SH
Copy feedback after build.

### S31 — Nav out
Multisig → Lab; Multisig → Network.

---

## Network

### S32 — Shell + gate
Network heading; 6-nav; CSP mempool/`self`; balances gated until ack.
Leak-ack copy: addresses and IP go to this site’s mempool proxy, then mempool.space.

### S13b — Fee snapshot
Fetch → sat/vB bands, traffic, example; status OK (needs public API or proxy).

### S13c — Balances
Mnemonic rejected; golden address + ack → row status ok|unknown|error.

### S13d — Session bridge
Derive on Lab without Send → Network Load finds **no** session addresses.
(S16 is the explicit handoff.)

### S33 — No ack
Load Lab disabled without ack.

### S34 — Empty fetch
Ack + empty → need addresses.

### S35 — Network → Tools
Tools nav → Lab Tools panel.

---

## Cross-page chrome

### S36 — Nav labels identical (6)
On Lab, Multisig, **Shamir**, Network — same strong labels in order:

**Lab · Multisig · Shamir · Network · Tools · Glossary**

### S37 — CSP isolation
Lab / Multisig / Shamir: meta `connect-src 'none'`.  
Network: `mempool.space` and/or `'self'`, not offline-only.

### S38 — Multisig aria-current
`aria-current=page` on Multisig.

### S39 — Network aria-current
`aria-current=page` on Network.

### S39b — Shamir aria-current
`aria-current=page` on Shamir.

### S40 — Host branding
Version + host branding in left sidebar only (no bottom footer version strip).

### S40b — Classroom panel on every shell
On Lab, Multisig, Shamir, Network, SLIP-39: sidebar **Classroom** (`#sidebarPrefs`) with Level select `#learnLevel` and Reset `#btnResetClassroom` visible.

---

## Help UX (Extra help + ⓘ) — no mid-page step rails

### S41 — Extra help On (Lab)
**Extra help: On**; teach-only copy visible; **no** `#labStepRail` / `[data-step-rail]`.

### S42 — Extra help Off
Off hides teach-only; safety chrome + leak/PSBT/seed ⓘ remain.

### S43 — ⓘ tip
Mnemonic **i** opens; Esc closes.

### S44 — First-hour Go (replaces step rail)
First hour checklist: **Go** on a step scrolls to target (e.g. mnemonic) and shows amber **← Back to First hour** dock; Back returns to checklist. No mid-page step-rail wizard.

### S44b — Tools panel: no mid-page rails
Tools tab: **zero** mid-page rails (`#toolsStepRail` must not exist). Cards (Path · Entropy · Passphrase · Descriptors · PSBT · Explain) are independent toolbox sections. PSBT card visible when scrolled.

### S45 — Multisig Extra help + BIP67 tip
Extra help On; Build card BIP67 **i** (and checklist BIP67 **i**).

### S46 — Checklist folded
Cosigner checklist is collapsed `<details>`; open → vault-verify + replace-cosigner **i**.

### S47 — Network Extra help + leak
Leak ack always visible; fee **i**; no mid-page network step rail.

### S48 — Extra help persists
Off on Lab → still Off on Network; can turn On.

### S48b — Still 6-nav after help UX
Nav count remains 6 with Shamir.

---

## Glossary terms

### S49 — Glossary panel
Lists BIP-39/44/84/86, scripts, zpub/xpub, UTXO, sat/vB; Shamir/Teach terms present after search.

### S50 — Search
`multisig` / `BIP67` filter.

### S51 — Inline ⓘ from glossary
Lab mnemonic **i** filled from glossary.

### S52 — Address-type terms
BIP84 tab / glossary covers SegWit/BIP-84.

---

## Shamir

### S53 — Shell
Shamir heading; 6-nav; offline CSP; educational / not SLIP-39 banner; Multisig contrast present.

### S54 — Generate + split 2-of-3
Generate practice secret → Split → **3** share cards `share:n:hex`.

### S55 — Empty secret error
Empty secret → error status; **0** share cards (no fake success).

### S56 — Educational recombine
Generate practice secret → Split 2-of-3 → **Verify recombine** → recovered matches practice secret (offline).

---

## Page 7 — SLIP-39 lab (`/slip39.html`) — deep-link from Shamir (not 7th nav)

### Description
**Lab-only** Trezor-shaped SLIP-39 share mnemonics (ships A–C: shell, single-group split/combine, passphrase/groups teach). Offline CSP. **Not** Trezor Suite; **not** educational Shamir hex shares.

### Process flow (learner)

```text
1. Land via Shamir danger-banner link **#shLinkSlip39** “SLIP-39 lab” (or /slip39.html)
2. Read red lab-only banner + compare table: BIP-39 vs educational Shamir vs SLIP-39
3. (Extra help On) Read compare → demo → groups folds (no mid-page step rail)
4. Generate practice master hex → Split 2-of-3 (or 3-of-5) → see share word cards
5. Combine first M shares → Match (happy path)
6. Groups card: read multi-group diagram (1-of-1 + 2-of-3) — diagram only
7. Run wrong-passphrase demo (or manual combine with wrong pp) → mismatch, not silent Match
8. Clear practice fields when done
```

### Human coherence checklist

| Criterion | Expected | PASS/FAIL | Notes |
|-----------|----------|-----------|-------|
| Coherent | Compare → demo → groups teach | | |
| Makes sense | Distinct from Shamir hex + BIP-39 phrase | | |
| Intuitive | Generate/Split/Combine close the loop | | |
| Safety | Lab-only banner; wrong-pp mismatch; no funded-wallet claim | | |
| Extra help Off | Long folds hide; banner + demo + groups diagram remain | | |

### Scenarios

#### S57 — Shell
SLIP-39 lab heading; **6**-nav (**no 7th** SLIP-39 top item — deep-link only); Shamir nav may show active as parent entry; offline CSP `connect-src 'none'`; danger banner (lab / not funded wallets / not Trezor Suite); comparison table (wordlist, backup unit, checksum, passphrase, groups, downstream); jump rail; live demo controls (Generate / Split / Combine).

#### Human pass note (2026-08-11)
Comet-style review: S57–S60b Playwright green; live 6-nav on `/slip39.html`; Shamir→SLIP-39 deep-link present; teach copy states “not a 7th nav step.” No new P0 UX defects. Nits fixed: parent Shamir highlight + explicit 6-nav teach line.

#### S57b — Shamir → SLIP-39 deep-link
On Shamir, danger banner includes link **`#shLinkSlip39`** (“Open SLIP-39 lab”).
Click → `/slip39.html` with lab-only danger banner visible.

#### S57c — SLIP-39 is not a 7th nav item
Lab / Shamir / Multisig / SLIP-39: primary nav has **exactly 6** items and **no** “SLIP-39” nav label.
`#shLinkSlip39` remains on Shamir only (deep-link).

#### S58 — Happy 2-of-3 split + combine match
Generate practice hex → Split 2-of-3 → Combine M shares → status Match.

#### S59 — Under-threshold error
After split, paste only one share → Combine → error status (no Match).

#### S60 — Wrong passphrase + group diagram
`#btnS39WrongPp` → mismatch status; `#s39GroupDiagram` shows 1-of-1 + 2-of-3 policy with `[data-group]` labels.

#### S60b — Manual wrong passphrase combine
Generate → passphrase `correct` → Split → set `#s39PassphraseCombine` to `wrong` → Combine → mismatch / err (recovered ≠ expected). No silent success.

S57–S60b · S57c · `e2e/slip39.spec.ts`

---



## Learning levels (E0–E6)

### S61 — Orientation + first hour
Lab: What this is/isn’t table; first hour checklist 8 steps; checkbox persists.
Go on h2 shows mnemonic card + sticky Back bar; Mark done returns to checklist;
I’m ready for Beginner sets level + marks h8.
**Persistence:** after hard reload, checked steps + Beginner level remain (`localStorage`).

### S62 — Level chip
Level select starter→advanced; data-level on html; advanced shows BIP-85 + Ops cards.

### S63 — Quiz shell
Beginner+: four quiz items (incl. Q3 TOO LOW + Q4 ~128 bits) with status board;
Go try + amber return dock; Mark passed → green Passed chips; entropy pad Mark Q3/Q4.

### S64 — Three splits tour
Intermediate+: start tour; Multisig then Shamir titles.

### S65 — BIP-85 shell
Advanced: BIP-85 card; explain demo PRACTICE.

### S66 — Ops card
Advanced: Knots / seed-scan ops card.

### S68 — Intermediate I1–I4 self-check
Level Intermediate: `#cardIntQuiz` status board; Mark I1 → Passed;
I4 Go try opens PSBT + amber “Back to Intermediate quiz” dock; Mark I4.

### S70 — Intermediate I1 Multisig return dock
I1 Go try → multisig.html shows Intermediate return dock + **Mark I1 passed & return**;
marks I1 Passed on Lab Intermediate quiz.

### S71 — Intermediate I4 mark on Lab dock
I4 Go try → Tools PSBT + **Mark I4 passed & return** on amber dock → Passed.

### S72 — Vault map after Build
Multisig: 2-of-2 BIP67 golden pubs → `#msVaultMap` visible; `#msMapDesc` is `wsh(sortedmulti(2,…))` containing both compressed pubs; note says not a seed. Clear hides the map.

### S73 — Recovery drill map vs keys-only
After Build: **Rebuild from map** status matches P2WSH. **Try without map** errors (needs M/N/sort); does not invent a new address.

### S74 — Vendor-diversity Extra help
Multisig checklist `#msVendorDiversity` mentions independent vendor/firmware class.

### S75 — Demo is not multi-vendor
Generate demo → `#msDemoVendorNote` says Not multi-vendor / one browser RNG.

### S76 — M=1 warning
Build with M=1 → `#msM1Warn` singlesig warning. M=2 hides it. `#msPolicy` includes lose-map line.

### S77 — PIN / file password / passphrase
Glossary search finds Device PIN, Coordinator file password, and BIP-39 passphrase as distinct hits.

### S78 — Coordinator cannot spend
`#msCoordNote` visible without Extra help: coordinator, cannot spend, receive/watch without keys.

### S79 — PSBT 1-of-2 partial sample
Tools → **1-of-2 partial** → inspect `partial signatures: 1`; still educational / no sign.

### S69 — Advanced A1–A4 self-check
Level Advanced: `#cardAdvQuiz`; A4 Go try → orientation + Advanced return dock;
Mark A1–A4 → summary 4 / 4.

### S67 — Mobile layout
Viewport ~390px: orientation + generate visible; sidebar stacks.
After Generate: `#addrTable` may be wider than the viewport but **must stay inside** `#tableScroll` (`overflow-x: auto`); document `scrollWidth` must not grow far beyond the viewport (no full-page sideways overflow).

# Report template

```text
# BIP39 Lab E2E report (exhaustive)
Product version:
Doc contract version: 2
URLs:
  Lab:      https://bip39.catalyxt.xyz/
  Multisig: https://bip39.catalyxt.xyz/multisig.html
  Shamir:   https://bip39.catalyxt.xyz/shamir.html
  SLIP-39:  https://bip39.catalyxt.xyz/slip39.html
  Network:  https://bip39.catalyxt.xyz/network.html
Date (UTC):
Agent: Comet / Perplexity / other:
Live product version (sidebar): v__.__.__
Stamped Product line (this file header): (copy from top)

## Human coherence (required)
Lab:      coherent=Y|N  makes_sense=Y|N  intuitive=Y|N  —
Tools:    coherent=Y|N  makes_sense=Y|N  intuitive=Y|N  —
Glossary: coherent=Y|N  makes_sense=Y|N  intuitive=Y|N  —
Multisig: coherent=Y|N  makes_sense=Y|N  intuitive=Y|N  —
Shamir:   coherent=Y|N  makes_sense=Y|N  intuitive=Y|N  —
SLIP-39:  coherent=Y|N  makes_sense=Y|N  intuitive=Y|N  —
Network:  coherent=Y|N  makes_sense=Y|N  intuitive=Y|N  —
Chrome/Extra help: coherent=Y|N  makes_sense=Y|N  intuitive=Y|N  —
Cross-product story (secrets offline / addresses online / shares≠keys / Shamir≠SLIP-39): PASS|FAIL —

## Scenarios (PASS | FAIL | NEEDS-DOM | SKIP)
Use **NEEDS-DOM** only when scrape cannot see attributes/viewport (aria-current, mobile width). Prefer Playwright for those.

### Lab core
S0 Smoke (6-nav + chips): PASS|FAIL —
S0b Theme: PASS|FAIL —
S0c Keyboard ?: PASS|FAIL —
S1 Generate 12: PASS|FAIL —
S1b Generate 24: PASS|FAIL —
S2 Abandon 4 types: PASS|FAIL —
S2b Word count follows paste: PASS|FAIL —
S3 Passphrase + strength estimate: PASS|FAIL —
S4 Account/change/indices: PASS|FAIL —
S5 Mainnet/testnet: PASS|FAIL —
S6 Copy: PASS|FAIL —
S7 QR address: PASS|FAIL —
S8 Watch-only: PASS|FAIL —
S9 Hide/clear: PASS|FAIL —
S10 Full nav (incl Shamir): PASS|FAIL —
S11 Invalid: PASS|FAIL —
S15 Seed QR: PASS|FAIL —
S16 Send→Network: PASS|FAIL —

### Tools
S14 Path playground: PASS|FAIL —
S17 Entropy pad: PASS|FAIL —
S17b Pad practice seed + TOO LOW: PASS|FAIL —
S18 Compare PP: PASS|FAIL —
S18b Tools gen+compare: PASS|FAIL —
S18c Clear secrets → TEST DATA: PASS|FAIL —
S19 Descriptors: PASS|FAIL —
S20 PSBT inspect: PASS|FAIL —
S20b PSBT teach fold + sample: PASS|FAIL —
S21 PSBT refuse secrets: PASS|FAIL —
S22 Desc explain: PASS|FAIL —
S23 Shortcuts card: PASS|FAIL —

### Redirects / Multisig / Network
S24 #balance→Network CLI: PASS|FAIL —
S25 Glossary threat/security: PASS|FAIL —
S12 Multisig golden+refuse: PASS|FAIL —
S12b Demo N=3: PASS|FAIL —
S26 Multisig shell: PASS|FAIL —
S27 Demo 24w: PASS|FAIL —
S28 BIP67 off: PASS|FAIL —
S29 Multisig clear: PASS|FAIL —
S30 Copy P2SH: PASS|FAIL —
S31 Multisig nav: PASS|FAIL —
S13b Fees+bands: PASS|FAIL —
S13c Balances (never silent 0): PASS|FAIL —
S13d Lab bridge: PASS|FAIL —
S32 Network shell: PASS|FAIL —
S33 No ack: PASS|FAIL —
S34 Empty fetch: PASS|FAIL —
S35 Network→Tools: PASS|FAIL —

### Chrome (aria-current = NEEDS-DOM if scrape-only)
S36 Nav labels (6 incl Shamir): PASS|FAIL —
S37 CSP isolation: PASS|FAIL —
S38 Multisig aria-current: PASS|FAIL|NEEDS-DOM —
S39 Network aria-current: PASS|FAIL|NEEDS-DOM —
S39b Shamir aria-current: PASS|FAIL|NEEDS-DOM —
S40 Host branding (sidebar version only): PASS|FAIL —
S40b Classroom panel every shell: PASS|FAIL —

### Help / Extra help (no step rails)
S41 Extra help On + no Lab rail: PASS|FAIL —
S42 Extra help Off: PASS|FAIL —
S43 Help tip Esc: PASS|FAIL —
S44 First-hour Go + return dock: PASS|FAIL —
S44b Tools: no mid-page rails: PASS|FAIL —
S45 Multisig Extra help + BIP67 tip: PASS|FAIL —
S46 Checklist folded + vault/replace tips: PASS|FAIL —
S47 Network Extra help + leak: PASS|FAIL —
S48 Extra help persists: PASS|FAIL —
S48b Still 6-nav: PASS|FAIL —

### Glossary
S49 Glossary panel: PASS|FAIL —
S50 Glossary search: PASS|FAIL —
S51 Mnemonic glossary tip: PASS|FAIL —
S52 BIP terms: PASS|FAIL —

### Shamir / SLIP-39
S53 Shamir shell: PASS|FAIL —
S54 Shamir split 2-of-3: PASS|FAIL —
S55 Shamir empty error: PASS|FAIL —
S56 Shamir recombine: PASS|FAIL —
S57 SLIP-39 shell: PASS|FAIL —
S57b Shamir #shLinkSlip39 → SLIP-39: PASS|FAIL —
S57c SLIP-39 not 7th nav: PASS|FAIL —
S58 SLIP-39 2-of-3 match: PASS|FAIL —
S59 Under-threshold: PASS|FAIL —
S60 Wrong-pp demo: PASS|FAIL —
S60b Manual wrong-pp mismatch: PASS|FAIL —

### Learning levels
S61 First hour checklist (+ localStorage after reload): PASS|FAIL —
S62 Level chip: PASS|FAIL —
S63 Guided quiz Q1–Q4: PASS|FAIL —
S64 Three-splits tour: PASS|FAIL —
S65 BIP-85 shell: PASS|FAIL —
S66 Ops card: PASS|FAIL —
S67 Mobile ~390px: PASS|FAIL|NEEDS-DOM —
S68 Intermediate I1–I4: PASS|FAIL —
S69 Advanced A1–A4: PASS|FAIL —
S70 Mark I1 Multisig dock: PASS|FAIL —
S71 Mark I4 Lab dock: PASS|FAIL —
S83 No FIRST_HOUR.md links: PASS|FAIL —
S84 First Hour form/compare gates: PASS|FAIL —
S85 Go h3 before derive: PASS|FAIL —
S86 Tools Path spacer: PASS|FAIL —
S87 Dock unfinished action + h4: PASS|FAIL —
S88 Quiz 4/4 next 7 then 8: PASS|FAIL —
S89 Network h7 leak-ack Mark done: PASS|FAIL —
S90 First Hour dock mobile wrap: PASS|FAIL —

Score: __ / __ PASS   (denominator = stamped Playwright S-id count at file header, e.g. 88)
  Formula: count rows marked PASS only (not NEEDS-DOM unless you verified via Playwright).
Blockers:
UX / coherence notes (what confused a human learner):
Extra help vs Teach: UI must say Extra help — FAIL if only “Teach:” remains without Extra help.
Step rails: FAIL if any mid-page [data-step-rail] / *StepRail appears.
```

---

## Operator one-liner

> Read https://raw.githubusercontent.com/0xbadhash/bip39lab/master/docs/E2E_COMET_SCENARIOS.md — run PROMPT FOR COMET/PERPLEXITY (**S0–S82** + human process flows) against Lab, Multisig, Shamir, SLIP-39, Network. UI label is **Extra help** (not Teach); **no mid-page step rails**. Return the Report template including Human coherence, score with stamped S-id denominator, and ui_consistent / copy_aligned / flow_intuitive.

---

## Playwright developers

```bash
npm install && npx playwright install chromium
npm run test:e2e              # local :4173  (see stamped Playwright S-ids count in header)
npm run test:e2e:live         # production
```

| File | Covers |
|------|--------|
| `e2e/helpers.ts` | abandon goldens, 6-nav, CSP helpers |
| `e2e/lab.spec.ts` | S0–S25 Lab + Tools + nav tour |
| `e2e/multisig.spec.ts` | S12–S31 Multisig |
| `e2e/shamir.spec.ts` | S53–S56 Shamir |
| `e2e/slip39.spec.ts` | S57–S60b SLIP-39 |
| `e2e/network.spec.ts` | S13b–d, S32–S35 Network |
| `e2e/site-chrome.spec.ts` | S36–S40 chrome (aria-current) |
| `e2e/help-ux.spec.ts` | S41–S48b Extra help / tips (no rails) |
| `e2e/glossary.spec.ts` | S49–S52 Glossary |
| `e2e/learn.spec.ts` | S61–S71 learning levels + I1/I4 docks |
