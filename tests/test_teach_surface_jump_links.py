"""Teach surface: mid-page step rails removed; classroom Extra help remains."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def _assert_no_step_rail(html: str) -> None:
    low = html.lower()
    assert "data-step-rail" not in low
    assert 'class="step-rail' not in low
    assert "labsteprail" not in low
    assert "mssteprail" not in low
    assert "netsteprail" not in low
    assert "shsteprail" not in low
    # Navigation is left nav + Go try / first-hour, not mid-page path wizard
    assert "not a locked wizard" not in low


def test_lab_no_jump_rail_has_classroom():
    html = (ROOT / "web/index.html").read_text(encoding="utf-8")
    _assert_no_step_rail(html)
    assert 'id="btnTeach"' in html
    assert "Extra help" in html or "data-teach-toggle" in html
    assert 'id="cardFirstHour"' in html
    assert 'id="cardQuiz"' in html


def test_multisig_no_jump_rail():
    html = (ROOT / "web/multisig.html").read_text(encoding="utf-8")
    _assert_no_step_rail(html)
    assert "msCardBuild" in html
    assert 'id="btnTeach"' in html


def test_network_no_jump_rail_keeps_balance_copy():
    html = (ROOT / "web/network.html").read_text(encoding="utf-8")
    _assert_no_step_rail(html)
    assert "unknown" in html.lower()
    assert "never a silent fake 0" in html.lower() or "never a silent fake 0" in html
    assert "netCardIntro" in html


def test_shamir_no_jump_rail_keeps_edu_copy():
    html = (ROOT / "web/shamir.html").read_text(encoding="utf-8")
    _assert_no_step_rail(html)
    assert "backup" in html.lower() or "inheritance" in html.lower()
    assert "not slip-39" in html.lower() or "not SLIP-39" in html
    assert "shCardRecombine" in html
