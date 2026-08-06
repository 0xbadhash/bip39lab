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
ADDR86 = "bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr"


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
  const a = await api.deriveAddresses(m, '', { count: 5, account: 0, change: 0 });
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
    assert data["a"]["bip86_p2tr"] == ADDR86
    assert len(data["a"]["rows"]) == 5
    assert data["a"]["rows"][0]["bip86_p2tr"] == ADDR86


@pytest.mark.skipif(shutil.which("node") is None, reason="node not installed")
def test_web_js_watch_only_and_qr():
    script = r"""
const fs = require('fs');
const path = require('path');
const root = process.argv[1];
const { webcrypto } = require('crypto');
Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });
eval(fs.readFileSync(path.join(root, 'web/js/bip39lab.bundle.js'), 'utf8'));
(async () => {
  const m = process.argv[2];
  const api = globalThis.BIP39Lab;
  const w = await api.exportWatchOnly(m, '', { account: 0 });
  const z = w.keys.find((k) => k.purpose === 84);
  let qrOk = false;
  try {
    const qr = await api.qrDataUrl('bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu');
    qrOk = typeof qr === 'string' && qr.startsWith('data:image');
  } catch (e) {
    qrOk = false;
  }
  let refused = false;
  try {
    await api.qrDataUrl('xprv9s21ZrQH143K');
  } catch (e) {
    refused = true;
  }
  const blob = JSON.stringify(w);
  console.log(JSON.stringify({
    zpub: z && z.key,
    noXprv: blob.indexOf('xprv') < 0,
    qrOk,
    refused,
    n: w.keys.length,
  }));
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
    assert data["zpub"].startswith("zpub")
    assert data["noXprv"] is True
    assert data["qrOk"] is True
    assert data["refused"] is True
    assert data["n"] >= 2


def test_web_static_assets_present():
    assert (ROOT / "web/index.html").is_file()
    assert (ROOT / "web/js/bip39lab.bundle.js").is_file()
    html = (ROOT / "web/index.html").read_text(encoding="utf-8")
    assert "Content-Security-Policy" in html
    assert "cdn." not in html.lower()
    assert "Clear secrets" in html
    assert "bip39lab.bundle.js" in html
    assert 'id="addrTable"' in html
    assert "BIP86" in html
    assert "watch-only" in html.lower() or "Watch-only" in html
    assert "qrModal" in html
    assert "img-src" in html and "data:" in html
    assert "addr-table" in (ROOT / "web/css/app.css").read_text(encoding="utf-8")
    assert "white-space: nowrap" in (ROOT / "web/css/app.css").read_text(encoding="utf-8")
