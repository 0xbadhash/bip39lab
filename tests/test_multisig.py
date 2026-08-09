"""Multisig explainer — pure script vectors via Node bundle."""

from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
P1 = "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"
P2 = "02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5"


@pytest.mark.skipif(shutil.which("node") is None, reason="node not installed")
def test_multisig_2of2_and_refuse_private():
    script = r"""
const fs = require('fs');
const path = require('path');
const root = process.argv[1];
eval(fs.readFileSync(path.join(root, 'web/js/multisig.bundle.js'), 'utf8'));
const api = globalThis.MultisigLab;
const p1 = process.argv[2];
const p2 = process.argv[3];
const r = api.buildMultisigFromText(p1 + '\n' + p2, 2, { bip67: true });
let refused = false;
try { api.buildMultisigFromText('5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ', 1); }
catch (e) { refused = /private/i.test(e.message); }
console.log(JSON.stringify({
  m: r.m, n: r.n,
  p2sh: r.p2sh, p2wsh: r.p2wsh,
  script: r.scriptHex,
  refused,
  starts3: r.p2sh.startsWith('3'),
  startsBc1: r.p2wsh.startsWith('bc1'),
}));
"""
    r = subprocess.run(
        ["node", "-e", script, str(ROOT), P1, P2],
        capture_output=True,
        text=True,
        check=False,
    )
    assert r.returncode == 0, r.stderr + r.stdout
    data = json.loads(r.stdout.strip().splitlines()[-1])
    assert data["m"] == 2 and data["n"] == 2
    assert data["starts3"] is True
    assert data["startsBc1"] is True
    assert data["refused"] is True
    assert data["p2sh"] == "33RQmypKhD6f4tMquiR5a3C6dRT7eBpaiG"
    assert data["script"].startswith("5221")


def test_multisig_static_page():
    html = (ROOT / "web/multisig.html").read_text(encoding="utf-8")
    assert "Multisig" in html
    assert "connect-src 'none'" in html
    assert "public keys only" in html.lower() or "Public keys" in html
    assert (ROOT / "web/js/multisig.bundle.js").is_file()
    assert "multisig.bundle.js" in html
    # Lab links to multisig
    lab = (ROOT / "web/index.html").read_text(encoding="utf-8")
    assert "multisig.html" in lab


def test_multisig_teach_ux_contracts():
    """Teach UX polish: calculator banner, chips, BIP67 warn, zpub ≠ xpub."""
    html = (ROOT / "web/multisig.html").read_text(encoding="utf-8")
    js = (ROOT / "web/js/multisig-app.js").read_text(encoding="utf-8")
    assert "Address calculator only" in html
    assert "id=\"chipAirgap\"" in html
    assert "id=\"chipOffline\"" in html
    assert "id=\"msBip67Warn\"" in html
    assert "jump links" in html.lower()
    assert 'id="msCardIntro"' in html
    assert "This is not an xpub" in html
    assert "unsafe by nature" in html
    assert "Before funding" in html
    assert "connect-src 'none'" in html
    assert "updateAirgapChip" in js
    assert "syncBip67Warn" in js
    assert "msBip67Warn" in js
