# Plan — V2 classroom cluster FSM

**Spec:** `.agents/specs/2026-09-03-v2-classroom-cluster-fsm.md`

## Implementation steps

1. **Cluster CSS and help gap (layout SoT).** Keep entropy lock crop on `.v2-lock img` for the meter, but override `.v2-face-after > .v2-lock img` to `object-fit: contain` and centered so 640 SVG classroom faces are fully visible beside the blue box. Direct-child stacked buttons in `.v2-pad` (`button.btn + *`) get `margin-top: 0.85rem !important` so both `p.control-help` and `div.control-help` (UC33 Not armed, UC34 live phrase note) sit off the button. Pad help font is `0.92rem` to match `.card p`, not the global `0.8rem` muted caption. Horizontal `.row` / mint bars stay side-by-side. Record in `web/v2/uc-design.md` principle 10.

2. **Pad behavior: XOR, clock, descriptors.** UC32: distinctive SVGs for N-of-N, 12-word split, two parts, all-parts; add `[image|blue]` on Show parts. UC33: replace Tick×3 with a clock widget (owner vs heir, day 0/90 bar). Enforce order heir-too-soon → Let 90 classroom days pass (CSS width 1.6s + day counter) → heir again (practice, no sign) → owner reset. Quiz after. UC34: BIP purpose tabs then Receive `/0/*` vs Change `/1/*`; paint one `copyQr` row from `descriptorsFromWatchOnly`. UC6 spend-rule classroom uses the same cluster. No Sign, no Electrum KDF, no Suite.

3. **Verify and dual-stamp ship.** AC tests: `test_ac_button_then_help_gap`, UC7 layout, UC1 cluster. Playwright: V2-S0 chip pin, V2-S24 clock sequence, V2-S25/S53 BIP then Receive. Product `VERSION` patch + `stamp_site_version.py`; V2 chip `web/v2/VERSION` and `/v2/` cache-bust independently (`0.17.N-v2`). `finish_ship --require-push`. Leftover `scripts/*.py` and `config/` uncommitted. No force-push.

## Testing

- red_cmd: tests existed before this commit on dirty tree; layout AC asserts new CSS tokens
- green_cmd: `.venv/bin/python3 -m pytest tests/test_ac_v2_uc7_layout.py tests/test_ac_v2_uc1_card_object.py -q`
- e2e: `npx playwright test e2e/v2.spec.ts -g "V2-S0 picker|V2-S24|V2-S25 UC34"`
