# Plan: V2 UC6/UC7 FSM

**Spec:** `.agents/specs/2026-08-24-v2-uc6-uc7-fsm.md`

## Approach

Keep classic `/` frozen. Teach on `/v2/` only. UC6 is M-of-N **keys** (three independent practice phrases → BIP-84 SLIP-132 **zpub**). UC7 is Shamir **shares** of one secret; the Shamir room is a footer deep link, not the lesson. Quizzes never say “Not that one”; wrong clicks carry a why span. Step rail and concept chips jump only to `step <= mem.maxStep`. Do/Do not is the first block under every teaching `h2`. Receive indexes use Catalyxt `nav-step` chips stacked above `tb1q` strings.

## Architecture

- State: `mem.cosigners[]` RAM-only; `sessionStorage bip39lab.v2` progress/gates only.
- Crypto: existing `BIP39Lab.generateMnemonic` + `exportWatchOnly(..., {network:"main"})` purpose 84.
- Nav: `jumpTo(i)` from `#trackRail .rail-jump` and `#conceptStrip [data-concept-step]`.
- Quiz: `.v2-quiz-why` hidden child; `#v2QuizMsg` copies that text.
- CSS: `web/v2/css/v2.css` tokens only (`--ok/--bad/--accent`). Glossary + help-ui loaded from `../js/`.

## Implementation

1. `web/v2/js/v2-app.js` + `web/v2/css/v2.css` — pads, `doDont` first, three cosigner zpubs, path index, quiz why, `jumpTo` rail/chips, nav-step address indexes.
2. `e2e/v2.spec.ts` V2-S10–S12 plus Comet/`product_plugin.yaml` S-id sync.
3. Stamp `VERSION` 0.16.37 lockstep; V2 footer stays `0.17.0-v2`.
