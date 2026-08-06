"""Run web bip39lab.bundle.js vectors under Node if available."""

from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
ABANDON = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
ADDR44 = "1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA"
ADDR49 = "37VucYSaXLCAsxYyAPfbSi9eh4iEcbShgf"
ADDR84 = "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu"


@pytest.mark.skipif(shutil.which("node") is None, reason="node not installed")
def test_web_js_abandon_vectors():
    script = r"""
const fs = require('fs');
const path = require('path');
const root = process.argv[1];
const { webcrypto } = require('crypto');
Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });
eval(fs.readFileSync(path.join(root, 'web/js/bip39lab.bundle.js'), 'utf8'));
(async () => {
  const m = process.argv[2];
  const api = globalThis.BIP39Lab || globalThis.BIP39LabBundle;
  const ok = await api.validateMnemonic(m);
  const a = await api.deriveAddresses(m, '');
  console.log(JSON.stringify({ ok, a }));
})().catch((e) => { console.error(e); process.exit(1); });
"""
    r = subprocess.run(
        ["node", "-e", script, str(ROOT), ABANDON],
        capture_output=True,
        text=True,
        check=False,
    )
    assert r.returncode == 0, r.stderr + r.stdout
    data = json.loads(r.stdout.strip().splitlines()[-1])
    assert data["ok"] is True
    assert data["a"]["bip44_p2pkh"] == ADDR44
    assert data["a"]["bip49_p2sh_p2wpkh"] == ADDR49
    assert data["a"]["bip84_p2wpkh"] == ADDR84


def test_web_static_assets_present():
    assert (ROOT / "web/index.html").is_file()
    assert (ROOT / "web/js/bip39lab.bundle.js").is_file()
    html = (ROOT / "web/index.html").read_text(encoding="utf-8")
    assert "Content-Security-Policy" in html
    assert "cdn." not in html.lower()
    assert "Clear secrets" in html
    assert "bip39lab.bundle.js" in html
