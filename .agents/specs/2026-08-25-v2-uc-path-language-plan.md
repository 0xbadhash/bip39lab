# Plan: V2 path language

Technical how (not a new public contract).

1. Add `GATES[id]` {is, isnt} and plain `TRACKS[id].done` for UC1–UC31. `openUc` renders them.
2. `nextInPath(pickerFilter)` for Continue; `finishHtml` next title from path ids.
3. Relabel pause/primary buttons verb+object. UC4 `mem.pathTouched` gates pause. UC7 split then `#v2ShCombine`. UC8 inspect enables pause; no Sign.
4. Move `#v2HardRefresh` into `.topbar-actions` beside `#v2Clear`.
5. Dual stamp: product bump in `/release_mgmt`; V2 `data-v2-version` 0.17.62-v2 only.
6. Tests: `e2e/v2.spec.ts` + `tests/test_ac_v2_path_language.py`.
