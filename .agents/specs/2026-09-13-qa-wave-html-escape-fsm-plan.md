# Plan — QA wave HTML escape FSM

**Spec:** `.agents/specs/2026-09-13-qa-wave-html-escape-fsm.md`

## Approach

Ship the already-fixed QA campaign sinks and the card-sized help-tip through one product-ship cycle. No new hunt. Dual stamp: product patch `0.16.89` and V2 chip `0.17.138-v2` because `v2-app.js` and `v2.css` change. Lockstep VERSION, site-version.js, comet Product, PLAYWRIGHT_LAST, and the visible chip.

## Architecture

Display HTML for copy rows, receive addresses, and glossary tips goes through `escapeHtml` (text) and `attrEsc` (attributes). Visual (i) is 1.25rem on `.help-tip-btn`; 44px hit lives on `.help-tip`. Overlay panels set `white-space: normal` so V2 callout `nowrap` cannot stretch the description. Unit tests lock those strings; Playwright V2-S1 and S186 lock geometry.

## Implementation sequence

1. **Escape sinks and glyph CSS.** Keep `copyQrRowHtml` / `addrHtml` / `termI` / `inlineI` on `escapeHtml`/`attrEsc`. Keep `.help-tip-btn` at 1.25rem and `.help-tip` min 44px. Override `.v2-callout .help-tip-panel` to wrap. Pytest `test_qa_copy_row_and_addr_escape_html` and `test_qa_help_tip_glyph_is_card_size`. Update S186 to measure host not painted disc; V2-S1 glyph ≤24px and panel wrap.

2. **Stamp lockstep.** Bump `VERSION` 0.16.88→0.16.89 and `web/v2/VERSION` to 0.17.138-v2. Run `stamp_site_version.py` (site-version.js, html cache-bust, comet header, PLAYWRIGHT_LAST). Pin `web/v2/index.html` chip/query and `test_qa_v2_chip_matches_script_query` plus V2-S0 chip text. Comet S186 text: 44px host, 1.25rem glyph.

3. **Review, tag, origin, scorecard.** CODE-REVIEW, PLAN-REVIEW, BEHAVIOR-REPORT, PR_DRAFT with red_cmd/green_cmd. `/pr_review --validate`. `/release_mgmt` smoke + tag `v0.16.89` + `finish_ship --require-push`. `/sync_docs --skip-vault`. Five-line scorecard to `evidence/SCORECARD-W6-QA-FULL-SHIP-2026-09-13.md`. Do not call Bob. Leftover scripts uncommitted. No force-push.

## Testing

- red_cmd: `/bin/false`
- green_cmd: `.venv/bin/python3 -m pytest -q`
- e2e: `npx playwright test e2e/v2.spec.ts e2e/w6a-normalize.spec.ts -g "V2-S1 UC1|S186"`
