# Plan — Gradual visual teach strip

- **Spec:** `.agents/specs/2026-08-22-gradual-visual-teach.md`
- **After:** 0.16.24 slim rail green
- **Not this stamp:** Teach-A / Teach-B / Teach-C

## Cheapest cut

1. Add `#labStrip` above the live mnemonic lab. Five stages as `cx-card` / hairline boxes. `data-paint` from `#learnLevel`.
2. CSS only: `[data-paint=starter] .stage-entropy` etc. `opacity` + `border-color: var(--cx-border)` for ghosts. Lit uses `--cx-panel` + `--cx-accent`.
3. Starter: word-card stage is the only filled box. Reuse existing practice words if present; else empty numbered cells (not a new generator).
4. Extra help Off: hide `.stage-caption`. Strip stays.
5. Do not delete the textarea yet (that is Teach-B). Strip sits **on** the existing lab.
6. Hold locked Beginner/Intermediate/Advanced stills. Do not migrate stills in this stamp.
7. Playwright: level select changes `data-paint`; Starter has no visible ENT slider / QR on strip; Extra help Off hides captions.

## Kill list

Imagine. New tokens. marketing/desk. SeedSigner orange. New nav. Stamp 0.16.24.
