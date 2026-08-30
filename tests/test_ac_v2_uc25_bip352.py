"""UC25 is BIP-352 silent payments, not a calendar."""
from pathlib import Path

APP = (Path(__file__).resolve().parents[1] / "web/v2/js/v2-app.js").read_text(encoding="utf-8")


def test_uc25_is_bip352_not_calendar() -> None:
    assert 'title: "Silent payments (BIP-352)"' in APP
    assert 'id="v2SpReuse"' in APP
    assert 'id="v2SpSend"' in APP
    assert "lab-sp1q:" in APP
    assert "data-cal=" not in APP
    assert "Annual rehearsal" not in APP
    i = APP.find("async function uc25")
    chunk = APP[i : APP.find("async function uc26")]
    assert "data-cal" not in chunk
