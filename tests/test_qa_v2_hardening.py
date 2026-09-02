"""QA campaign regressions: V2 path, XSS, leftover chip."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
V2_APP = (ROOT / "web" / "v2" / "js" / "v2-app.js").read_text(encoding="utf-8")
HELP = (ROOT / "web" / "js" / "help-ui.js").read_text(encoding="utf-8")
INDEX = (ROOT / "web" / "v2" / "index.html").read_text(encoding="utf-8")


def test_qa_lab_strip_loads_from_v2_nested_path() -> None:
    assert "../js/" in HELP
    assert "lab-strip.js" in HELP
    assert "/v2" in HELP


def test_qa_wordgrid_escapes_html() -> None:
    assert "function escapeHtml" in V2_APP
    assert "escapeHtml(words[i])" in V2_APP


def test_qa_step_error_escaped() -> None:
    assert "escapeHtml(e && e.message" in V2_APP


def test_qa_lab_strip_css_loads_from_v2() -> None:
    js = (ROOT / "web" / "js" / "lab-strip.js").read_text(encoding="utf-8")
    assert "../css/" in js
    assert "lab-strip.css" in js


def test_qa_v2_chip_matches_script_query() -> None:
    assert "v2-app.js?v=0.17.136-v2" in INDEX
    assert "data-v2-version>v0.17.136-v2" in INDEX
    assert "v0.17.135-v2" not in INDEX
