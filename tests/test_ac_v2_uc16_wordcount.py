"""AC for 2026-08-29-v2-wordcount-before-generate.md — UC16 first."""
from __future__ import annotations

from pathlib import Path

APP = (Path(__file__).resolve().parents[1] / "web/v2/js/v2-app.js").read_text(encoding="utf-8")


def test_ac_1_uc16_select_before_generate() -> None:
    i_fn = APP.find("async function uc16")
    chunk = APP[i_fn : APP.find("function uc17")]
    i_wc = chunk.find("wordCountSelectHtml()")
    i_gen = chunk.find('id="v2Generate"')
    assert 0 <= i_wc < i_gen


def test_ac_2_restore_uses_n_not_twelve() -> None:
    assert "function restoreWordCount" in APP
    i_fill = APP.find('$("v2RestoreFill")')
    fill = APP[i_fill : i_fill + 500]
    assert "restoreWordCount()" in fill
    assert "for (i = 0; i < 12; i++)" not in fill
    i_chk = APP.find('$("v2RestoreCheck")')
    chk = APP[i_chk : i_chk + 700]
    assert "restoreWordCount()" in chk


def test_ac_4_xor_and_slip_untouched() -> None:
    assert 'id="v2XorMake12"' in APP
    assert "Need a 12-word source first" in APP
    assert 'id="v2S39">Make practice SLIP-39 shares' in APP
