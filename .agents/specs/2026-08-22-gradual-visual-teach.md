# Gradual visual teach (Catalyxt skin)

- **Product:** bip39lab
- **Created:** 2026-08-22
- **Status:** draft — awaiting CEO paint-state lock
- **Priority:** P1
- **Depends:** Slim Starter First-hour rail (0.16.24)
- **Roadmap:** ROADMAP.md → Open work
- **Skin:** `app-shell` only. No new `--cx-*`. No new variant.
- **Grill-me:** incomplete

## Problem

Levels already gate copy and stills. The **specimen** does not grow. Starter and Advanced look like the same card stack with more text. Teaching is verbal, not visual.

A/B/C (pipeline, numbered card, air-gap QR/print) are **content inside the skin**, not new looks.

## Rule

One strip. Four paint states. Same tokens.

```text
[entropy] → [checksum] → [word card 3×4] → [seed] → [address]
```

Unlit stages stay as `--cx-border` hairline ghosts. Lit stages use `--cx-panel` + `--cx-accent`. Status uses ok / warn / bad only.

Extra help Off = strip with no captions. Extra help On = one caption under the lit stage.

## Paint states

### Starter
- Lit: numbered word card only (12 tiles, index badge, first-4 not bold yet).
- Ghost: entropy, checksum, seed, address.
- Chrome: slim first-hour rail + Generate / Validate / Clear.
- No ENT bits, no path table, no QR.
- Caption: “This card is a practice backup. Not a wallet.”

### Beginner
- Lit: entropy bar + checksum chip + word card.
- Word hover-(i): 11-bit index 0–2047.
- Address: one BIP84 row only.
- Caption labels: Entropy · Checksum · Words · Address.
- Ghost: seed / PBKDF2.

### Intermediate
- Lit: + passphrase compare (two address chips) + keys-vs-shares row under the card.
- Hide/reveal on tiles.
- First-4 unique prefix bold.
- Ghost: master→child tree.

### Advanced
- Full strip including seed/PBKDF2 and master→child.
- Path playground and watch-only zpub/QR attach to the same card, not a new page chrome.
- “Not a wallet” stamp stays `--cx-warn`.

## Content modules (later ships, same skin)

- **A — Pipeline interactivity:** ENT slider paints the entropy bar; checksum bits use `--cx-ok`.
- **B — Numbered card specimen:** textarea dies; 3×4 / 4×6 cells are the mnemonic.
- **C — Air-gap actions on the card:** Seed QR + print sit on the card; no SeedSigner orange; no new palette.

## Out of scope

- marketing / desk variants
- new sidebar item
- Imagine / photo stills as the page
- replacing Intermediate/Beginner locked stills in the same stamp as the strip (hold or migrate in a named ship)
- Ian Coleman / SeedSigner / bitcoin.design chrome

## Acceptance (this spec, not A/B/C ships)

- [ ] One `#labStrip` composition; `data-paint="starter|beginner|intermediate|advanced"`
- [ ] Level change only changes paint + enabled controls
- [ ] Tokens from catalyxt-ds `app-shell` only
- [ ] Extra help Off hides captions, not the strip
- [ ] Grill-me lock before `/execute_dev`

## Handoff

Wait CEO yes/no on the four paint states. Then grill-me. Then `/spec` close → slim-rail must be green first.
