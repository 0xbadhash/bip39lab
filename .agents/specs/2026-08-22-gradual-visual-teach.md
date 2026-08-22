# Gradual visual teach (Catalyxt skin)

- **Product:** bip39lab
- **Created:** 2026-08-22
- **Status:** locked brief — paint states accepted (CEO continue 2026-08-22)
- **Priority:** P1
- **Depends:** Slim Starter First-hour rail (0.16.24)
- **Stamp (this ship):** after 0.16.24 — do not steal slim-rail stamp
- **Roadmap:** ROADMAP.md → Open work
- **Plan:** `.agents/specs/2026-08-22-gradual-visual-teach-plan.md`
- **Skin:** `app-shell` only. No new `--cx-*`. No new variant.
- **Grill-me:** locked by continue (paint states as drafted)

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

Level change only changes `data-paint` + which controls are enabled. No new page chrome.

## Paint states (locked 2026-08-22)

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

- **Teach-A — Pipeline interactivity:** ENT slider paints the entropy bar; checksum bits use `--cx-ok`.
- **Teach-B — Numbered card specimen:** textarea dies; 3×4 / 4×6 cells are the mnemonic.
- **Teach-C — Air-gap actions on the card:** Seed QR + print sit on the card; no SeedSigner orange; no new palette.

This ship is the **strip + paint states only**. A/B/C stay separate roadmap rows.

## Out of scope

- marketing / desk variants
- new sidebar item
- Imagine / photo stills as the page
- replacing Intermediate/Beginner locked stills in the same stamp as the strip (hold or migrate in a named ship)
- Ian Coleman / SeedSigner / bitcoin.design chrome
- stealing 0.16.24 slim-rail stamp

## Acceptance (this spec, not A/B/C ships)

- [ ] One `#labStrip` composition; `data-paint="starter|beginner|intermediate|advanced"`
- [ ] Level change only changes paint + enabled controls
- [ ] Tokens from catalyxt-ds `app-shell` only
- [ ] Extra help Off hides captions, not the strip
- [ ] Starter has no ENT / path / QR on the strip
- [ ] Slim-rail 0.16.24 already live before this stamp

## Handoff

Slim-rail ships first. Then this spec → `/execute_dev` for the strip only.
