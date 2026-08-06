"""Ensure bip39lab does not write seed material to disk."""

from pathlib import Path
import bip39lab.bip39 as bip39
import bip39lab.derive as derive
from bip39lab.cli import main

ABANDON = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"


def test_modules_have_no_open_write_to_mnemonic_files(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    bip39.generate_mnemonic(12)
    bip39.validate_mnemonic(ABANDON)
    derive.derive_addresses(ABANDON)
    # no new files under cwd
    assert list(tmp_path.iterdir()) == []


def test_cli_derive_no_files(tmp_path, monkeypatch, capsys):
    monkeypatch.chdir(tmp_path)
    rc = main(["derive", *ABANDON.split()])
    assert rc == 0
    out = capsys.readouterr().out
    assert "bc1q" in out or "1Lq" in out
    assert list(tmp_path.iterdir()) == []


def test_cli_validate(capsys):
    assert main(["validate", *ABANDON.split()]) == 0
    assert "valid" in capsys.readouterr().out


def test_legacy_quarantined():
    root = Path(__file__).resolve().parents[1]
    assert (root / "legacy" / "brute-force-btc.py").is_file()
    assert (root / "legacy" / "README.md").is_file()
    assert not (root / "brute-force-btc.py").exists()
