# Use-case compare: classic Lab (v1) vs V2 tracks

- **Deeplink:** https://bip39.catalyxt.xyz/v2/compare.md
- **Local / repo:** `/v2/compare.md` · `web/v2/compare.md`
- **As of:** 2026-08-29
- **v1:** `/` · product stamp `v0.16.81`
- **v2:** `/v2/` · chip `v0.17.132-v2` · `/v2/VERSION` `0.17.132-v2`

Live compare.md lags until deploy. This repo file is source of truth.

**How to read this file.** Three sections only. A track that wraps a Lab card is a **port**, not a difference. Ports are omitted. “V2 stronger” means a control that does a job Lab/rooms do not do, or does it more strictly. Linking to `/slip39.html` or `/network.html` is a **dock**, not a clone.

Omitted on purpose (ports, not unique): UC1 generate, UC2 paper stamp, UC4 path folders (`#cardPathPlay`), UC5 watch-only export, UC6 recipe vs `/multisig.html`, UC10 leak-ack lookup vs Network, UC14–15 entropy vs `#cardEntPad`, UC31 dock, UC34 descriptors vs `#cardDescriptors` / `#cardDescExplain`.

---

## V2 stronger or unique

| What | Why this is not a Lab port |
|------|----------------------------|
| Picker / paths | Lab is rooms + a 6-step First hour. V2 is 35 jobs behind **Start here** and named paths. Different shape, not a second Lab SPA. |
| Gate / Finish | Per-track Is / Is not / Done when. Force-exit checkbox on Finish. Lab has first-visit orientation, not per-UC gates. |
| Chrome | **Clear secrets** + **Hard refresh** wipe `bip39lab.v2`. Session never stores the mnemonic. |
| Teach vs result | Blue `teachBox` vs hex / table / txid / fail line. Lab mixes teach into cards. |
| **UC3** | Empty vs test extra-secret **live** (no Compare click). Forget-B beat. Lab `#cardCmpPp` is a three-step Compare button. |
| **UC7 Try** | **Any M-subset** of pasted hex shares. One poisoned extra line does not cancel two good ones. `/shamir.html` interpolates **every** pasted line. In-track: phrase → hex → practice SLIP-39 2-of-3 (fail 1 / match 2) → extra-secret pad. Rooms stay SoT for Suite / long hex lab. |
| **UC8 named txs** | Genesis, first transfer, Pizza, OP_RETURN note, Inscription 0, Runestone + classroom snap. Lab `#cardPsbt` is synthetic PSBT samples only. No Sign on either face. |
| **UC9** | Leak drill **after** UC5 export: forum / support / “cannot steal so public” fail; one invoice vs five future receives; spend with viewing key fails. Lab export does not run that fail set. |
| **UC11–13, 16–17, 20–25, 28–29** | Custody drills Lab never had as cards (they-hold, hot/hardware/cold, prove-from-paper, amount, metal, collab freeze vs steal, unbox, air-gap loop, geo, annual rehearsal, CoinJoin-not-backup, decoy extra secret). Glossary on `/` does not run them. |
| **UC18** | Heir object drill: four fail kits, map-only packet, fail then open-while-alive. Not a will. No Lab inheritance card. |
| **UC19** | Simulated 0.000184 tBTC + second watch view. Never funds practice mainnet. Not Network live lookup. |
| **UC27** | Two fake coins, spend 0.05, change to `…/1/0`. Words unchanged. Lab has no coin-control pad (Network only reminds what a UTXO is). |
| **UC30** | **Real** BIP-85 child #0 (`m/83696968'/39'/0'/12'/0'`, HMAC `"bip-entropy-from-k"`). Lab `#cardBip85` is still an **idea / hash demo**, not full crypto. Parent still required. No application/index matrix on either face. |
| **UC32** | Live 12-word SeedXOR. Hide one part fails. Combine restores the same words. No Lab SeedXOR card. Not seedxor.com. |
| **UC33** | Classroom dead-man timer. No Sign. Not legal counsel. No Lab CSV card. |
| **UC35** | English words can still be Electrum. BIP-39 restore is the wrong vault. This tab does not run Electrum. |

CSP: `/v2/` may talk to `https://mempool.space` after leak-ack (UC8 / UC10). Classic Lab `/` stays `connect-src 'none'`. Intentional, not a V2 gap.

---

## Still only on classic Lab / rooms (do not port)

| Surface | Why it stays |
|---------|----------------|
| Theme, Extra help, Classroom, First-hour rail | Lab chrome. Tracks use Do/Do not + atoms. |
| `#cardOps` | Ops wall. Not a use-case track. |
| Vendor USB / firmware apps | UC22 names the job. It does not run Ledger Live, Suite, or a USB driver. |
| Bitcoin node in-tab | UC26 says so. Lookups stay opt-in Network. |
| SLIP-39 Suite clone inside `/v2/` | SoT is `/slip39.html`. UC31 docks. UC7 practice is educational, not Suite. |
| Full BIP-85 application/index matrix | Nobody has it. Lab demo is weaker than UC30’s one child. Do not clone a matrix into the track. |
| Electrum KDF | Forbidden. UC35 is the trap only. |
| Live CSV / signer / broadcast | Forbidden. UC8 / UC23 / UC33 never Sign. |
| A will / legal counsel | Forbidden. UC18 is objects. |
| SeedXOR.com calculator | Forbidden. UC32 is classroom N-of-N. |
| Photograph a plate / fund practice mainnet / paste a funded seed | Hard no on both faces. |

---

## Honest remaining gaps

v1 (or a room) is still the richer **instrument** for the same job. V2 teaches and docks. Not a leftover “port the room into the track” list.

| Job | v1 / room | V2 today | Honest gap |
|-----|-----------|----------|------------|
| SLIP-39 Suite | `/slip39.html` | UC31 dock; UC7 practice lists | No Suite clone. Dock, not a port leftover. |
| Multisig instrument | `/multisig.html` (BIP67, N, 24-word) | UC6 three phrases + `wsh(sortedmulti` | Room is richer. Track is the “not Shamir” drill. |
| Shamir hex lab | `/shamir.html` | UC7 in-track split + any-M Try | Room is the long lab. Try-subsets is V2-stronger (section 1). |
| First-receive **live** lookup | Network room | UC19 sim credit. Live fetch is **UC10**. | **P3 skipped:** UC19 does not leak-ack in-track. Use UC10 or Network. |
| Own node | Not in Lab either | UC26 honesty + Network dock | Nobody runs bitcoind in this product. |
| Path / descriptor / PSBT *structure* | `#cardPathPlay`, `#cardDescriptors`, `#cardPsbt` | UC4 / UC34 / UC8 inspect | Lab cards remain the fuller widgets. UC8’s named txs are V2-only (section 1). |

If a row is not here, do not treat it as unported.

---

## Hard no (both faces)

Fund practice mainnet. Sign or broadcast a real PSBT. Paste a funded seed. Legal counsel.

---

## Retrieval

| URL | What |
|-----|------|
| https://bip39.catalyxt.xyz/v2/compare.md | This file (after deploy) |
| https://bip39.catalyxt.xyz/v2/ | V2 picker |
| https://bip39.catalyxt.xyz/ | Classic Lab |
