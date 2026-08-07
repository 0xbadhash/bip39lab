"""Educational Shamir secret sharing — pure split/combine (not SLIP-39)."""

from __future__ import annotations

import secrets

import pytest

from bip39lab.shamir import (
    MAX_N,
    combine_shares,
    encode_share,
    parse_share,
    split_secret,
)


def test_split_rejects_bad_params():
    secret = b"demo-secret-01"
    with pytest.raises(ValueError, match="threshold|M"):
        split_secret(secret, m=1, n=3)
    with pytest.raises(ValueError, match="threshold|M|N"):
        split_secret(secret, m=3, n=2)
    with pytest.raises(ValueError, match="empty|secret"):
        split_secret(b"", m=2, n=3)
    with pytest.raises(ValueError, match="N|max"):
        split_secret(secret, m=2, n=MAX_N + 1)


def test_split_returns_n_shares_with_indices():
    secret = b"hello-shamir"
    shares = split_secret(secret, m=2, n=3, rng=secrets.SystemRandom())
    assert len(shares) == 3
    idxs = sorted(s["index"] for s in shares)
    assert idxs == [1, 2, 3]
    for s in shares:
        assert s["payload"]  # non-empty bytes
        assert encode_share(s).startswith("share:")


def test_any_m_of_n_reconstructs():
    secret = b"practice-bytes!!"  # 16 bytes
    shares = split_secret(secret, m=2, n=3, rng=secrets.SystemRandom())
    # all pairs
    for i in range(3):
        for j in range(i + 1, 3):
            got = combine_shares([shares[i], shares[j]])
            assert got == secret


def test_one_share_cannot_reconstruct_when_m_is_2():
    secret = b"need-two-shares!"
    shares = split_secret(secret, m=2, n=3, rng=secrets.SystemRandom())
    with pytest.raises(ValueError, match="need|threshold|M|shares"):
        combine_shares([shares[0]])


def test_encode_parse_roundtrip():
    secret = bytes.fromhex("00112233445566778899aabbccddeeff")
    shares = split_secret(secret, m=3, n=5, rng=secrets.SystemRandom())
    lines = [encode_share(s) for s in shares]
    parsed = [parse_share(line) for line in lines]
    got = combine_shares(parsed[:3])
    assert got == secret


def test_utf8_practice_text():
    text = "demo practice secret"
    secret = text.encode("utf-8")
    shares = split_secret(secret, m=2, n=2, rng=secrets.SystemRandom())
    assert combine_shares(shares) == secret


@pytest.mark.skipif(__import__("shutil").which("node") is None, reason="node not installed")
def test_js_core_roundtrip():
    """Browser shamir-core.js must round-trip like Python."""
    import json
    import subprocess
    from pathlib import Path

    root = Path(__file__).resolve().parents[1]
    script = r"""
const fs = require('fs');
const path = require('path');
const root = process.argv[1];
eval(fs.readFileSync(path.join(root, 'web/js/shamir-core.js'), 'utf8'));
const api = globalThis.ShamirLab;
const secret = api.utf8Encode('js-practice-secret');
const shares = api.splitSecret(secret, 2, 3);
const got = api.combineShares([shares[0], shares[2]]);
const lines = shares.map(api.encodeShare);
console.log(JSON.stringify({
  n: shares.length,
  ok: Array.from(got).join(',') === Array.from(secret).join(','),
  line0: lines[0].startsWith('share:1:'),
  maxN: api.MAX_N,
}));
"""
    r = subprocess.run(
        ["node", "-e", script, str(root)],
        capture_output=True,
        text=True,
        check=True,
    )
    data = json.loads(r.stdout.strip())
    assert data["n"] == 3
    assert data["ok"] is True
    assert data["line0"] is True
    assert data["maxN"] == 7
