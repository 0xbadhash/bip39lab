"""SLIP-39 lab — static copy contract (banner, compare table, demo, Shamir link)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_slip39_html_danger_banner():
    html = (ROOT / "web/slip39.html").read_text(encoding="utf-8")
    low = html.lower()
    assert 'id="s39Danger"' in html
    assert "lab" in low
    assert "funded" in low or "real funds" in low or "not for funded" in low
    assert "trezor suite" in low
    assert "connect-src 'none'" in html or 'connect-src "none"' in html


def test_slip39_comparison_table_topics():
    html = (ROOT / "web/slip39.html").read_text(encoding="utf-8")
    low = html.lower()
    for topic in ("wordlist", "backup unit", "checksum", "passphrase", "groups", "downstream"):
        assert topic in low, f"missing topic: {topic}"
    assert "bip-39" in low
    assert "educational shamir" in low
    assert "slip-39" in low
    assert "compare-table" in html or 'id="s39CompareTable"' in html


def test_slip39_demo_controls_no_step_rail():
    html = (ROOT / "web/slip39.html").read_text(encoding="utf-8")
    low = html.lower()
    assert "data-step-rail" not in low
    assert 'id="s39StepRail"' not in html
    assert 'id="btnS39Split"' in html
    assert 'id="btnS39Combine"' in html
    assert "slip39.bundle.js" in html
    assert 'id="s39GroupDiagram"' in html
    assert 'id="btnS39WrongPp"' in html


def test_shamir_links_to_slip39_lab():
    html = (ROOT / "web/shamir.html").read_text(encoding="utf-8")
    assert 'id="shLinkSlip39"' in html
    assert 'href="slip39.html"' in html
    assert "not SLIP-39" in html or "not slip-39" in html.lower()


def test_slip39_keeps_six_nav():
    html = (ROOT / "web/slip39.html").read_text(encoding="utf-8")
    import re

    # class may include "active" and/or trailing spaces from template
    nav_items = re.findall(r'class="nav-item[^"]*"', html)
    assert len(nav_items) == 6
    assert 'data-nav="slip39"' not in html  # deep-link only, no 7th top-level nav
    assert 'data-nav="shamir"' in html
    assert "active" in html


def test_slip39_bundle_present():
    bundle = ROOT / "web/js/slip39.bundle.js"
    assert bundle.is_file()
    assert bundle.stat().st_size > 10_000
