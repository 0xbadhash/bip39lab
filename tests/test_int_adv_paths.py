"""Intermediate I1–I4 + Advanced A1–A4 learning path shells."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_lab_has_intermediate_quiz_shell():
    html = (ROOT / "web/index.html").read_text(encoding="utf-8")
    assert 'id="cardIntQuiz"' in html
    assert 'data-level-min="intermediate"' in html
    assert 'data-quiz="i1"' in html
    assert 'data-quiz="i2"' in html
    assert 'data-quiz="i3"' in html
    assert 'data-quiz="i4"' in html
    assert "Three splits" in html or "keys vs shares" in html.lower()
    assert "quizPass-i1" in html or 'id="quizPass-i1"' in html
    assert "intQuizSummary" in html or "quizSummaryInt" in html


def test_lab_has_advanced_quiz_shell():
    html = (ROOT / "web/index.html").read_text(encoding="utf-8")
    assert 'id="cardAdvQuiz"' in html
    assert 'data-level-min="advanced"' in html
    assert 'data-quiz="a1"' in html
    assert 'data-quiz="a2"' in html
    assert 'data-quiz="a3"' in html
    assert 'data-quiz="a4"' in html
    assert "BIP-85" in html
    assert "watch-only" in html.lower() or "Watch-only" in html
    assert "Knots" in html
    assert "is" in html.lower() and "isn" in html.lower()


def test_learn_levels_stores_int_adv_keys():
    js = (ROOT / "web/js/learn-levels.js").read_text(encoding="utf-8")
    assert "bip39lab.intQuiz" in js
    assert "bip39lab.advQuiz" in js
    assert "cardIntQuiz" in js
    assert "cardAdvQuiz" in js
    assert "intquiz" in js or "from=intquiz" in js


def test_comet_has_s68_s69():
    comet = (ROOT / "docs/E2E_COMET_SCENARIOS.md").read_text(encoding="utf-8")
    assert "S68" in comet
    assert "S69" in comet
