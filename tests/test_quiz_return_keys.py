"""Regression: bip39lab.quizReturn must stay consistent across Lab/Tools/Shamir."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def _read(rel: str) -> str:
    return (ROOT / rel).read_text(encoding="utf-8")


def test_learn_levels_accepts_mode_strings_and_legacy_one():
    js = _read("web/js/learn-levels.js")
    assert "function isQuizReturnValue" in js
    assert 'v === "1"' in js
    assert 'v === "quiz"' in js
    assert 'v === "intquiz"' in js
    assert 'v === "advquiz"' in js
    # Hour dock must not open while any quiz return is active
    assert "isQuizReturnValue(sessionStorage.getItem(QUIZ_RETURN_KEY))" in js
    # Writes use mode strings (not only legacy "1")
    assert 'sessionStorage.setItem(QUIZ_RETURN_KEY, "quiz")' in js or 'setItem(QUIZ_RETURN_KEY, "quiz")' in js
    assert 'setItem(QUIZ_RETURN_KEY, mode)' in js or 'sessionStorage.setItem(QUIZ_RETURN_KEY, mode)' in js


def test_app_js_accepts_quiz_string_not_only_one():
    js = _read("web/js/app.js")
    # Entropy / Q1 dock paths must treat "quiz" as return-active
    assert 'retQ === "quiz"' in js or '=== "quiz"' in js
    # Fallback navigate still sets quiz mode string
    assert 'setItem("bip39lab.quizReturn", "quiz")' in js
    # Must not be the only check hard-coded to "1" for dock show
    assert "bip39lab.quizReturn" in js


def test_shamir_mark_q2_sets_quiz_mode_string():
    js = _read("web/js/shamir-app.js")
    assert 'setItem("bip39lab.quizReturn", "quiz")' in js
    assert 'retKey === "1" || retKey === "quiz"' in js


def test_lab_index_guards_from_query_handlers():
    """from=intquiz on Multisig must not be stripped by Lab return handlers (S70)."""
    js = _read("web/js/learn-levels.js")
    assert "function isLabIndexPage" in js
    assert "isLabIndexPage()" in js
    assert "from=intquiz" in js
