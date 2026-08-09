"""Teach-surface jump-link consistency (Lab · Network · Shamir)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def _assert_jump_rail(html: str, rail_id: str) -> None:
    low = html.lower()
    assert "on this page" in low
    assert "jump links" in low
    assert "not a locked wizard" in low
    assert f'id="{rail_id}"' in html
    assert "page sections (jump links)" in html
    # Multisig-aligned: no forced "1 ·" numbering on rails
    assert "1 ·" not in html.split(f'id="{rail_id}"', 1)[1][:800]


def test_lab_jump_link_rail():
    html = (ROOT / "web/index.html").read_text(encoding="utf-8")
    _assert_jump_rail(html, "labStepRail")
    assert 'data-step-target="#card-mnemonic"' in html
    assert 'data-step-target="#card-addresses"' in html
    assert 'data-step-target="#addrTable"' in html
    assert 'data-step-target="#watchOnlyPanel"' in html


def test_network_jump_link_rail():
    html = (ROOT / "web/network.html").read_text(encoding="utf-8")
    _assert_jump_rail(html, "netStepRail")
    assert "unknown" in html.lower()
    assert "never a silent fake 0" in html.lower() or "never a silent fake 0" in html
    assert 'data-step-target="#netCardIntro"' in html
    assert 'data-step-target="#netCardFees"' in html
    assert 'data-step-target="#netCardBal"' in html


def test_shamir_jump_link_rail():
    html = (ROOT / "web/shamir.html").read_text(encoding="utf-8")
    _assert_jump_rail(html, "shStepRail")
    assert "backup" in html.lower() or "inheritance" in html.lower()
    assert "not slip-39" in html.lower() or "not SLIP-39" in html
    assert 'data-step-target="#shCardTeach"' in html
    assert 'data-step-target="#shCardDemo"' in html
    assert 'data-step-target="#shCardSplit"' in html
    assert 'data-step-target="#shCardRecombine"' in html
