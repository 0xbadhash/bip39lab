# Plan: V2 UC18 heir object drill

## Approach

Replace the two-pad lecture with a three-pad lab that makes missing objects visible. Heirs fail because a piece is missing, not because they did not care. The sealed packet is a map (policy, locations, next drill date), never live words plus extra secret in one envelope. Open-while-alive requires a real fail first. This is not a will, not UC33, not a signer.

## Architecture

- **State:** `mem.inh` `{ kits, shape, pack, packed, failTry, liveOk }` reset in `startTrack`. No mnemonic in sessionStorage.
- **Routing:** `ucJob` special-cases `id === 18` before the generic `step === 2` quiz, same pattern as UC20, so content can occupy steps 0–2.
- **UI:** kit/shape/pack cards reuse `.v2-metal-card`. Classroom in `teachBox`. Results in `#v2InhKitOut`, `#v2InhPackOut`, `#v2InhLiveOut`.
- **Tests:** Playwright V2-S51 walks kits → keys shape → three need ticks → build → blocked live → nopass fail → live pass.

## Implementation sequence

1. Rewrite `uc18`, handlers, quiz, picker copy, atoms `forStep`, CSS for pack `<pre>`.
2. Add V2-S51 and Comet line; dual stamp `0.16.78` / `0.17.127-v2`.
3. Reviews, pytest green_cmd, pr_validator 100, tag, push, docs sync.

## Files

- `web/v2/js/v2-app.js`, `web/v2/css/v2.css`, `web/v2/index.html`, `web/v2/VERSION`, `web/v2/compare.md`
- `e2e/v2.spec.ts`, `docs/E2E_COMET_SCENARIOS.md`
- `tests/test_ac_v2_uc18_heir_drill.py`

## Risks

- `v2-app.js` already huge; keep helpers next to UC18.
- leftover `scripts/*.py` stay uncommitted.
- No Sign. No force-push.
