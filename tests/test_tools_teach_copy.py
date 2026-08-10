"""Tools panel human-intuitiveness copy contracts (static HTML + app.js)."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = (ROOT / "web" / "index.html").read_text(encoding="utf-8")
APP_JS = (ROOT / "web" / "js" / "app.js").read_text(encoding="utf-8")


def test_tools_phrase_source_and_test_data_banner():
    assert "Toolbox, not a pipeline" in INDEX
    assert "Phrase source:" in INDEX
    assert "TEST DATA" in INDEX
    assert "Clear secrets" in INDEX
    assert "[TEST DATA]" in APP_JS
    assert "[Lab phrase]" in APP_JS


def test_entropy_pad_bit_method_documented():
    assert "d6" in INDEX.lower() and "2.58" in INDEX
    assert "coin" in INDEX.lower() and "1 bit" in INDEX.lower()
    assert "d6≈2.58" in APP_JS or "2.58" in APP_JS


def test_descriptor_framing_and_example():
    assert "output descriptor" in INDEX.lower()
    assert "btnDescExample" in INDEX
    assert "btnDescExample" in APP_JS
    assert "wpkh(" in INDEX


def test_lab_surfaces_keyboard_shortcuts():
    assert "<kbd>G</kbd>" in INDEX
    assert "tools-shortcuts" in INDEX
    # Lab card teaches G/D as well as Tools list
    assert INDEX.count("<kbd>G</kbd>") >= 2
