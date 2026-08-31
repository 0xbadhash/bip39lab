"""UC29 duress: two vaults + wipe is not the chain."""
from pathlib import Path

APP = (Path(__file__).resolve().parents[1] / "web/v2/js/v2-app.js").read_text(encoding="utf-8")


def test_uc29_two_vaults_and_wipe() -> None:
    i = APP.find("async function uc29")
    chunk = APP[i : APP.find("async function uc30")]
    assert "v2DrFund" in chunk
    assert "open" in chunk
    assert "deriveAddresses(mem.mnemonic, \"open\"" in APP
    assert "data-dr-pin" in chunk
    assert "v2DrWipe" in chunk
    assert "not legal" in chunk.lower() or "safety" in chunk.lower()
    assert "Decoy is real" not in chunk or "v2DrFund" in chunk
