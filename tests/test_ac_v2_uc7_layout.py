"""AC for 2026-08-29-v2-uc7-layout.md — HTML order in uc7 pads."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP = (ROOT / "web/v2/js/v2-app.js").read_text(encoding="utf-8")
CSS = (ROOT / "web/v2/css/v2.css").read_text(encoding="utf-8")


def _uc7() -> str:
    i = APP.find("async function uc7")
    j = APP.find("async function uc8")
    assert i >= 0 and j > i
    return APP[i:j]


def _idx(s: str, needle: str) -> int:
    i = s.find(needle)
    assert i >= 0, needle
    return i


def test_ac_0_shamir_progressive_pads() -> None:
    chunk = _uc7()
    s0 = chunk[chunk.find("if (step === 0)") : chunk.find("if (step === 1)")]
    s1 = chunk[chunk.find("if (step === 1)") : chunk.find("if (step === 2)")]
    s2 = chunk[chunk.find("if (step === 2)") : chunk.find("if (step === 3)")]
    assert "v2ShPhrase" in s0 and "v2ShTry" not in s0 and "v2ShMN" not in s0
    assert "v2ShMN" in s1 and 'id="v2Sh"' in s1 and "v2ShTry" not in s1
    assert "v2ShTry" in s2 and "v2ShCombine" in s2 and "v2ShPhrase" not in s2


def test_ac_1_shamir_order_and_try_colour() -> None:
    ids = [
        "v2ShWc",
        "v2ShPhrase",
        "v2ShStory",
        "v2ShMN",
        'id="v2Sh"',
        "v2ShTry",
        "v2ShCombine",
        "v2ShTryHelp",
    ]
    chunk = _uc7()
    pos = [_idx(chunk, x) for x in ids]
    assert pos == sorted(pos)
    assert 'class="btn btn-try" id="v2ShTry"' in APP
    assert "Paste any M of the printed shares here" in APP


def test_ac_2_slip_order_checklist() -> None:
    ids = [
        "Lab practice",
        "v2S39Story",
        'id="v2S39"',
        "v2-share-line",
        "v2S39Try",
        "v2S39Combine",
        "v2S39TryHelp",
        "v2S39Check",
    ]
    chunk = _uc7()
    pos = [_idx(chunk, x) for x in ids]
    assert pos == sorted(pos)
    assert "Play in order: mint 3 lists" in APP
    assert "Try 1 list — must fail" in APP


def test_ac_button_then_help_gap() -> None:
    assert ".v2-pad > button.btn + *" in CSS
    assert "0.85rem !important" in CSS
    assert ".v2-pad .control-help" in CSS
    assert "font-size: 0.92rem" in CSS
    assert 'id="v2TlArm"' in APP
    assert "v2TlArmOut" in APP
    i = APP.find('id="v2TlArm"')
    j = APP.find("v2TlArmOut", i)
    assert 0 < j - i < 400
    k = APP.find('id="v2DescRefreshLab"')
    n = APP.find("v2DescSrcNote", k)
    assert 0 < n - k < 400


def test_ac_3_css_and_one_line_shares() -> None:
    assert "button.btn.btn-try" in CSS
    assert ".v2-try-row" in CSS
    assert ".v2-combine-right" in CSS
    assert ".v2-share-line" in CSS
    assert APP.count('class="v2-share-line" rows="1"') >= 3
    assert 'class="v2-combine-right"' in APP


def test_ac_4_no_sign() -> None:
    uc7 = APP[APP.find("async function uc7") : APP.find("async function uc8")]
    assert "Sign" not in uc7 or "cannot sign" in uc7.lower()
