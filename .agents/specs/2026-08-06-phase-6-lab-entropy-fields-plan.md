# Plan: Phase 6 — Lab entropy fields

- **Spec:** `.agents/specs/2026-08-06-phase-6-lab-entropy-fields.md`
- **Product:** bip39lab
- **Created:** 2026-08-06
- **Status:** ready-for-agent

## Stack & constraints

- Static web: `web/index.html`, `web/js/app.js`, `web/css/app.css` (card shell).
- Existing bundle: `@scure/bip39` via `BIP39Lab.validateMnemonic` / generate.
- Offline CSP unchanged; English only; no new CDN deps.

## Approach

1. Add pure helpers in `app.js` (or small `web/js/entropy.js` if cleaner):
   - `mnemonicEntropyBits(wordCount | mnemonic)` → ENT from BIP-39 table after validate.
   - `estimatePassphraseBits(passphrase)` → offline estimate (document formula in comment).
2. Wire two read-only UI fields; refresh on generate, input, derive, clear, hide-private.
3. Minimal CSS for read-only “meter” text matching card panel.
4. Optional: expose ENT mapping in a tiny unit-testable module or pytest on Python mirror — prefer extractable pure JS tested via a small node script **or** document manual + behavior; product is pytest-primary for Python. For web-only, add a short pure-function test file if node is available; else acceptance via checklist + existing web vector tests if extended.

## Architecture decisions

| Decision | Choice |
|----------|--------|
| Mnemonic ENT | Map valid word count → {12:128,15:160,18:192,21:224,24:256}; require `validateMnemonic` true for pasted phrases |
| Passphrase estimate | Shannon entropy of code units × length, capped (e.g. at 128) for display, or charset-class pool log2; label “estimate” |
| Separate DOM | `#entropyMnemonic` and `#entropyPassphrase` (names illustrative) |
| Live update | `input`/`change` on mnemonic + passphrase |

### Passphrase estimator (indicative)

Prefer transparent formula, e.g.:

- Count unique char classes (lower/upper/digit/symbol) and length.
- Or Shannon: \( H = -\sum p_i \log_2 p_i \), bits ≈ \( H \times n \).

Show integer “~N bits (estimate)”.

## File map

| Area | Change |
|------|--------|
| `web/index.html` | Two read-only fields under mnemonic / passphrase |
| `web/js/app.js` | Compute + bind |
| `web/css/app.css` | Read-only field styling if needed |
| `tests/` | Optional: pure Python mirror of ENT map if shared; or leave web manual |

## Implementation sequence

1. HTML fields + English labels.
2. ENT map + validate gate.
3. Passphrase estimator + second field.
4. Clear / hide-private.
5. Smoke open Lab on local static + deploy path already at bip39.catalyxt.xyz.

## Testing plan

- Manual: 12-word generate → 128 bits; add passphrase → second field non-empty; clear → both reset.
- Invalid paste → mnemonic field not claiming 128.
- pytest suite still green (no Python break).

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Users think estimate is cryptographic proof | Label “estimate”; helper note |
| Confuse PBKDF2 512-bit seed with entropy | Short disclaimer under fields |
| Live typing cost | Trivial CPU; no debounce required |

## Open questions

None.
