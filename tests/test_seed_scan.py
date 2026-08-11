"""Educational Knots seed-scan helpers — hash-only, no mnemonic retention."""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from bip39lab.seed_scan import (
    ScanSummary,
    SeedScanError,
    append_hash,
    load_hash_set,
    mnemonic_sha256_hex,
    normalize_for_hash,
    preflight_rpc,
    scan_mnemonic_utxos,
    summary_to_public_dict,
)


def test_normalize_collapses_whitespace_and_case():
    assert normalize_for_hash("  Abandon  ABANDON\tabout  ") == "abandon abandon about"


def test_hash_stable_and_hex():
    h = mnemonic_sha256_hex("abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about")
    assert len(h) == 64
    assert all(c in "0123456789abcdef" for c in h)
    assert h == mnemonic_sha256_hex(
        "ABANDON abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
    )


def test_load_append_hash_roundtrip(tmp_path: Path):
    p = tmp_path / "hashes.txt"
    assert load_hash_set(p) == set()
    append_hash(p, "a" * 64)
    append_hash(p, "b" * 64)
    append_hash(p, "a" * 64)  # dup write still loads unique
    s = load_hash_set(p)
    assert s == {"a" * 64, "b" * 64}


def test_preflight_blocks_ibd_by_default():
    def rpc(method: str, params: list):
        assert method == "getblockchaininfo"
        return {
            "blocks": 100,
            "headers": 200,
            "initialblockdownload": True,
            "verificationprogress": 0.5,
        }

    with pytest.raises(SeedScanError, match="IBD|initialblockdownload"):
        preflight_rpc(rpc, allow_ibd=False)


def test_preflight_ok_when_synced():
    def rpc(method: str, params: list):
        return {
            "blocks": 900000,
            "headers": 900000,
            "initialblockdownload": False,
            "verificationprogress": 1.0,
            "pruned": True,
        }

    info = preflight_rpc(rpc, allow_ibd=False)
    assert info["blocks"] == 900000
    assert info["initialblockdownload"] is False


def test_scan_mnemonic_utxos_no_mnemonic_in_result():
    calls: list[tuple[str, list]] = []

    def rpc(method: str, params: list):
        calls.append((method, params))
        if method == "scantxoutset":
            return {"total_amount": "0.00000000", "success": True}
        raise AssertionError(method)

    # Valid 12-word abandon...about
    mn = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
    r = scan_mnemonic_utxos(mn, rpc_call=rpc)
    assert r.hit is False
    assert r.total_satoshis == 0
    assert r.address_count >= 1
    blob = json.dumps(r.as_public_dict())
    assert "abandon" not in blob.lower()
    assert "mnemonic" not in blob.lower() or "mnemonic_hash" in blob
    # one scantxoutset batch
    assert any(m == "scantxoutset" for m, _ in calls)


def test_summary_public_dict_has_no_secrets():
    s = ScanSummary(scanned_new=3, skipped_dup=1, hits=0, rpc_errors=0, target=2000, hash_file_lines=503)
    d = summary_to_public_dict(s)
    text = json.dumps(d)
    assert "scanned_new" in d
    assert "abandon" not in text
    assert d["hits"] == 0
