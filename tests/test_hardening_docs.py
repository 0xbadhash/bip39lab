from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_security_and_readme():
    sec = (ROOT / "SECURITY.md").read_text(encoding="utf-8")
    assert "No retention" in sec or "no retention" in sec.lower()
    assert "Offline" in sec or "offline" in sec.lower()
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    assert "bip39lab" in readme
    assert "web/index.html" in readme
    assert (ROOT / "VERSION").read_text(encoding="utf-8").strip() == "0.4.0"
    assert (ROOT / "web/REBUILD.md").is_file()
