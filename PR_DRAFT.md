# PR Draft: v0.16.35 + V2 tracks (`0.17.0-v2`)

**Spec:** `.agents/specs/2026-08-23-v2-uc1-generate-chrome.md`
**Also:** `.agents/specs/2026-08-23-use-case-tracks-v2.md` · `.agents/specs/2026-08-23-use-case-tracks.md`
**Plan:** `.agents/specs/2026-08-23-v2-uc1-generate-chrome-plan.md`

## What Problem This Solves

Classic Lab is a room tour. Learners need a parallel V2 use-case track at `/v2/` without replacing `/`. UC1 generate chrome must match classic word counts, Clear secrets next to Generate, and plain-English BIP-39 help.

## Why This Change Was Made

CEO locked use-case IA (2026-08-23). V2 is a real scure/Lab surface. UC1 generate copy and regenerate length were v1-vs-v2 gaps.

## User Impact

- `/` stays classic Lab (stamp `0.16.35`).
- `/v2/` picker UC1–UC10; UC1 Generate 12/15/18/21/24; Clear secrets on the pad; regenerate matches length.
- Compare note: `/v2/compare.md`.

## Traceability

| AC | Test / smoke |
|----|----------------|
| AC picker + classic root | Playwright V2-S0 |
| AC generate words before addresses | Playwright V2-S1 |
| AC quiz colors + force exit | Playwright V2-S2 |
| AC deep link uc=3 | Playwright V2-S3 |
| AC word counts 12–24, Clear secrets beside Generate, regenerate 15/18/21/24 | Playwright V2-S4 |
| AC classic Generate still on `/` | Playwright V2-S0 `#btnGenerate` |
| AC no secrets on disk | Clear secrets tab-only; sessionStorage `bip39lab.v2` has no mnemonic |

## Red-proof

- red_cmd: `false`
- green_cmd: `npx playwright test e2e/v2.spec.ts`
- TDD: V2-S4 went red (overlay body stripped) then green after span-safe help HTML.

## Threat notes

- secrets: mnemonics stay in tab memory; `sessionStorage` `bip39lab.v2` is progress/gates only
- xss: static CSP `connect-src 'none'` on `/v2/`
- csrf: no forms that mutate a server
- network: V2 does not fetch balances

## Evidence pack

- hard_gates / pr_validator (this ship)
- smoke: `npx playwright test e2e/v2.spec.ts` (5 passed)
- pytest: `python -m pytest -q` (product smoke unit)

## Things that look bad but are actually fine

1. Full Playwright classic suite still has known Starter-gate / hover / Tools-timeout fails (pre-existing; not this V2 AC).
2. Harness `scripts/*.py` dirty files stay uncommitted (operator hold).
3. Pipeline was previously `approved` for 0.16.25; this PR_DRAFT is the 0.16.35 + V2 card.
4. V2 footer is `0.17.0-v2` while repo `VERSION` is `0.16.35` — parallel surface, not a root minor bump.

## Cross-review

blockers=0 (code_review this session).
