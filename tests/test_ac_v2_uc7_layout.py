"""AC for 2026-08-29-v2-uc7-layout.md — HTML order in uc7 pads."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP = (ROOT / "web/v2/js/v2-app.js").read_text(encoding="utf-8")
CSS = (ROOT / "web/v2/css/v2.css").read_text(encoding="utf-8")


def _idx(s: str, needle: str) -> int:
    i = APP.find(needle)
    assert i >= 0, needle
    return i


def test_ac_1_shamir_order_and_try_colour() -> None:
    ids = [
        "v2ShStory",
        "v2ShMN",
        'id="v2Sh"',
        "v2ShTry",
        "v2ShTryHelp",
        "v2ShCombine",
    ]
    pos = [_idx(APP, x) for x in ids]
    assert pos == sorted(pos)
    assert 'class="btn btn-try" id="v2ShTry"' in APP
    assert "Paste any M of the printed shares here" in APP


def test_ac_2_slip_order_checklist() -> None:
    ids = [
        "Lab practice",
        "v2S39Story",
        "v2-share-line",
        "v2S39Try",
        "v2S39TryHelp",
        "v2S39Check",
        "v2S39Combine",
    ]
    pos = [_idx(APP, x) for x in ids]
    assert pos == sorted(pos)
    assert "Play in order: mint 3 lists" in APP
    assert "Try 1 list — must fail" in APP


def test_ac_3_css_and_one_line_shares() -> None:
    assert "button.btn.btn-try" in CSS
    assert ".v2-combine-right" in CSS
    assert ".v2-share-line" in CSS
    assert APP.count('class="v2-share-line" rows="1"') >= 3
    assert 'class="v2-combine-right"' in APP


def test_ac_4_no_sign() -> None:
    uc7 = APP[APP.find("async function uc7") : APP.find("async function uc8")]
    assert "Sign" not in uc7 or "cannot sign" in uc7.lower()
