"""Option C network parsers — pure logic via Node bundle."""

from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]


@pytest.mark.skipif(shutil.which("node") is None, reason="node not installed")
def test_network_parsers():
    script = r"""
const fs = require('fs');
const path = require('path');
const root = process.argv[1];
eval(fs.readFileSync(path.join(root, 'web/js/network.bundle.js'), 'utf8'));
const api = globalThis.NetworkApi;
const fees = api.parseFeesJson({
  fastestFee: 10, halfHourFee: 5, hourFee: 2, economyFee: 1, minimumFee: 1
});
const bad = api.parseFeesJson({});
const tip = api.parseTipHeight('800000');
const tipBad = api.parseTipHeight('nope');
const bal = api.parseAddressBalanceJson({
  chain_stats: { funded_txo_sum: 100, spent_txo_sum: 40 }
});
const balFail = api.parseAddressBalanceJson(null);
const zero = api.parseAddressBalanceJson({
  chain_stats: { funded_txo_sum: 0, spent_txo_sum: 0 }
});
const a1 = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq';
const a2 = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4';
const list = api.parseAddressList(a1 + '  abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about\n' + a2);
const listJunk = api.parseAddressList('hello world not-an-address xprvABC');
console.log(JSON.stringify({
  feesOk: fees.status === 'ok' && fees.bands.fastestFee === 10,
  feesBad: bad.status === 'error',
  tipOk: tip.status === 'ok' && tip.height === 800000,
  tipBad: tipBad.status === 'error',
  balOk: bal.status === 'ok' && bal.satoshis === 60,
  balFail: balFail.status === 'unknown' && balFail.satoshis === null,
  zeroOk: zero.status === 'ok' && zero.satoshis === 0,
  list: list,
  listJunk: listJunk,
  ex: api.exampleFeeSats(5, 140),
}));
"""
    r = subprocess.run(
        ["node", "-e", script, str(ROOT)],
        capture_output=True,
        text=True,
        check=False,
    )
    assert r.returncode == 0, r.stderr + r.stdout
    data = json.loads(r.stdout.strip().splitlines()[-1])
    assert data["feesOk"] and data["feesBad"]
    assert data["tipOk"] and data["tipBad"]
    assert data["balOk"] and data["balFail"] and data["zeroOk"]
    assert data["list"] == [
        "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
        "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4",
    ]
    assert data["listJunk"] == []
    assert data["ex"] == 700


def test_network_static_and_lab_csp():
    net = (ROOT / "web/network.html").read_text(encoding="utf-8")
    assert "mempool.space" in net
    # same-origin proxy + direct fallback
    assert "connect-src 'self' https://mempool.space" in net or (
        "connect-src" in net and "mempool.space" in net and "'self'" in net
    )
    assert "network.bundle.js" in net
    conf = (ROOT / "deploy/nginx-bip39.catalyxt.xyz.conf").read_text(encoding="utf-8")
    assert "location /api/mempool/" in conf
    assert "mempool.space" in conf
    assert "ipv6=off" in conf  # AAAA to mempool.space often blackholes from this host
    lab = (ROOT / "web/index.html").read_text(encoding="utf-8")
    assert "connect-src 'none'" in lab
    assert "network.html" in lab
    multi = (ROOT / "web/multisig.html").read_text(encoding="utf-8")
    assert "connect-src 'none'" in multi
    assert "network.html" in multi
