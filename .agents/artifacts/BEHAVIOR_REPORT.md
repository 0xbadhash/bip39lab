# BEHAVIOR-REPORT

**Stamp:** 0.16.35 + V2 `0.17.0-v2`
**Contract:** `.agents/specs/2026-08-23-v2-uc1-generate-chrome.md`

| Clause | Result | Evidence |
|--------|--------|----------|
| Classic `/` still Lab Generate | pass | V2-S0 `#btnGenerate` |
| V2 picker 10 cards | pass | V2-S0 |
| UC1 generate words, table hidden | pass | V2-S1 |
| Validate after card ack | pass | V2-S1 |
| Quiz msg-ok / msg-bad + force exit | pass | V2-S2 |
| Word count 12–24; Clear secrets not in sidebar | pass | V2-S4 |
| Regenerate 15/18/21/24 tile counts | pass | V2-S4 |
| No CSPRNG/scure jargon on generate help | pass | V2-S4 `#v2GenHelp` |
| BIP-39 (i) hover English wordlist | pass | V2-S4 `#overlayMnemonic` |

Runtime: `npx playwright test e2e/v2.spec.ts` — 5 passed.

✅ BEHAVIOR VALIDATED
