# Use-case compare: classic Lab (v1) vs V2 tracks

- **Deeplink:** https://bip39.catalyxt.xyz/v2/compare.md
- **Local / repo:** `/v2/compare.md` · `web/v2/compare.md`
- **As of:** 2026-08-28
- **v1:** `/` · product stamp `v0.16.80`
- **v2:** `/v2/` · chip `v0.17.130-v2` · `/v2/VERSION` `0.17.130-v2`

Live compare.md lags until deploy. This repo file is source of truth.

**How to read this file.** Tracks teach. Rooms stay source of truth. Do not clone Lab as a second SPA. V2 reuses `bip39lab.bundle.js`. This page lists **only**:

1. **V2 stronger or unique** — a job v1 never had as a track, or a drill that is stricter than the Lab card.
2. **Still only on classic Lab / rooms** — instruments we will not port into `/v2/`.
3. **Honest remaining gap** — v1 still has a richer *in-room* control for the same job, and V2 only docks or skips.

Do not list a control as missing if it is already in-track. Do not list a hard-no as a leftover port. Linking out to `/slip39.html` or `/network.html` is a dock, not a clone.

---

## V2 stronger or unique

These jobs either did not exist as a Lab card, or the track is a tighter drill than the room.

| UC | Why V2 is stronger or unique |
|----|------------------------------|
| Picker | **Start here** path (UC1 → UC2 → UC16). All 35 cards sit behind All paths. Classic Lab is rooms, not a path. |
| Gate / Finish | Per-track Is / Is not / Done when. Force-exit checkbox on every Finish. |
| Chrome | **Clear secrets** on the top bar every view. **Hard refresh** wipes `bip39lab.v2` and returns to the picker. |
| Teach vs result | Blue `teachBox` is classroom. Hex, table, txid, kit fail line are lab objects. |
| **3** | Live A/B extra-secret compare (no Compare button). Masked strength bars. Forget-B beat. |
| **5** | One BIP tab at a time: viewing key + descriptor, copy/QR. Never the words. |
| **6** | Three full practice phrases + `wsh(sortedmulti` recipe. Not Shamir. |
| **7** | Phrase then hex split/combine, then practice SLIP-39 2-of-3, then extra-secret pad. Amber if you try the full three-share backup as the exercise. |
| **8** | Inspect-only PSBT **plus** six named public txs (Genesis, First transfer, Pizza, OP_RETURN note, Inscription 0, Runestone). Classroom snapshot if live miss. No Sign. Classic Lab has samples, not this named-tx rail. |
| **9** | **Leak drill, not a second export.** Forum / support / “cannot steal so public” fail. One invoice is a smaller leak. Five future receive addresses. Spend with the viewing key fails. UC5 already exported the key. |
| **10** | In-track leak-ack: `/api/mempool` then `mempool.space`. Unknown is not zero. Classroom fee snap if both miss. Classic Lab CSP stays `connect-src 'none'` (Network room is the v1 live lookup). |
| **11–13** | Interactive they-hold / hot vs hardware / hot vs cold. Glossary on `/` does not run these drills. |
| **14–15** | Weak pad still mints words. `+10 d6`. Send pad to First wallet. Extra secret does not fix a short pad. |
| **16** | Hide the card, type from paper, checksum + same address. |
| **17** | Place 0.001 / 0.184 / 2.0. Exchange and all-phone traps. |
| **18** | Heir object drill. Four fail kits. Map-only packet. Fail, then open while alive. Not a will. Classic Lab had no inheritance card. |
| **19** | Practice receive + watch second view + **simulated** 0.000184 tBTC. Never fund practice mainnet. |
| **20** | Paper fails · aluminium reject · stainless/titanium · 4-letter uniqueness · solid vs tiles vs photo. No shop grid. |
| **21–25** | Collab freeze vs steal, unbox ceremony, air-gap loop (tab never signs), geo keys, annual rehearsal. |
| **27** | Thin UTXO demo: two fake coins, spend 0.05, change to path …/1/0. Words unchanged. Not Lab coin-control tools. |
| **30** | One BIP-85 practice child (child number 0). Parent still required. Full matrix stays on `#cardBip85`. |
| **32** | Live 12-word SeedXOR. Hide one part fails. Combine restores the same words. Classic Lab has no SeedXOR card. |
| **33** | Classroom dead-man timer. No Sign. Not legal counsel. Classic Lab has no CSV card. |
| **35** | English words can still be Electrum. BIP-39 restore is the wrong vault. This tab does not run Electrum. |

CSP: `/v2/` may talk to `https://mempool.space` after leak-ack (UC8 / UC10). Classic Lab `/` stays `connect-src 'none'`. That is intentional, not a V2 gap.

---

## Still only on classic Lab / rooms (do not port)

Leave these on `/` or the sibling room. They are not leftover track work.

| Surface | Why it stays |
|---------|----------------|
| Theme, Extra help, Classroom, First-hour rail | Lab chrome. Tracks use Do/Do not + atoms. |
| `#cardOps` | Ops wall. Not a use-case track. |
| Vendor USB / firmware apps | UC22 names the job. It does not run Ledger Live, Suite, or a USB driver. |
| Bitcoin node in-tab | UC26 says so. Lookups stay opt-in Network. |
| SLIP-39 Suite clone inside `/v2/` | SoT is `/slip39.html`. UC31 docks. UC7 practice is educational, not Suite. |
| Full BIP-85 application/index matrix | SoT is `/#cardBip85`. UC30 mints **one** practice child only. |
| Electrum KDF | Forbidden. UC35 teaches the wrong-vault trap only. |
| Live CSV / signer / broadcast | Forbidden. UC8 / UC23 / UC33 never Sign. |
| A will / legal counsel | Forbidden. UC18 is objects. |
| SeedXOR.com calculator | Forbidden. UC32 is classroom N-of-N. |
| Photograph a plate / fund practice mainnet / paste a funded seed | Hard no on both faces. |

---

## Honest remaining gaps

v1 (or a room) is still the richer **instrument**. V2 teaches the job and docks. This is not a leftover “port the room into the track” list.

| Job | v1 / room | V2 today | Honest gap |
|-----|-----------|----------|------------|
| SLIP-39 Suite | `/slip39.html` | UC31 dock; UC7 practice shares | No Suite clone in the track. Dock, not a gap to port. |
| First-receive **live** lookup | Network room | UC19 sim credit + Network dock. Live fetch is **UC10**. | **P3 skipped:** UC19 does not leak-ack in-track. Use UC10 or Network. |
| Own node | Not in Lab either | UC26 honesty + Network dock | Nobody runs bitcoind in this product. |

If a row is not in this table, do not treat it as unported. UC27 thin UTXO demo and UC30 one-child mint are **in-track**. The full BIP-85 matrix and Lab coin-control toys stay rooms (section 2), not remaining ports.

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
