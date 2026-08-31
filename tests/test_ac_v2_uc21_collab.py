"""UC21: company holds one key — sign, not steal, not freeze-if-you-have-2."""
from pathlib import Path

APP = (Path(__file__).resolve().parents[1] / "web/v2/js/v2-app.js").read_text(encoding="utf-8")


def test_uc21_policy_not_old_freeze_slogan() -> None:
    i = APP.find("function uc21")
    chunk = APP[i : APP.find("function uc22")]
    assert "data-co-pol" in chunk
    assert "data-co-q" in chunk
    assert "Service can freeze" not in chunk
    assert "cannot steal" in chunk.lower() or "cannot steal" in APP.lower()
