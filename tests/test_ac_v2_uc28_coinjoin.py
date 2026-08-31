"""UC28 is UTXO combine + obfuscation practice, not slogans."""
from pathlib import Path

APP = (Path(__file__).resolve().parents[1] / "web/v2/js/v2-app.js").read_text(encoding="utf-8")


def test_uc28_utxo_combine_join() -> None:
    i = APP.find("function uc28")
    chunk = APP[i : APP.find("async function duressPack")]
    assert "data-cj-piece" in chunk
    assert "data-cj-spend" in chunk
    assert "data-cj-join" in chunk
    assert "Mixing is not custody" not in chunk or "data-cj-join" in chunk
    assert "UTXO" in chunk
    assert "common-input" in chunk.lower() or "one owner" in chunk
