"""Address-only balance — fail closed, no mnemonic."""

from bip39lab.balance import BalanceResult, get_address_balance, looks_like_mnemonic
from bip39lab.cli import main


def test_rejects_mnemonic_like():
    m = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
    assert looks_like_mnemonic(m)
    r = get_address_balance(m, backend="blockstream", acknowledge_leak=True)
    assert r.status == "error"
    assert r.satoshis is None


def test_offline_default_unknown():
    r = get_address_balance("bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu")
    assert r.status == "unknown"
    assert r.satoshis is None


def test_blockstream_requires_ack():
    r = get_address_balance(
        "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu",
        backend="blockstream",
        acknowledge_leak=False,
    )
    assert r.status == "error"


def test_blockstream_http_failure_unknown():
    def boom(*_a, **_k):
        raise TimeoutError("nope")

    r = get_address_balance(
        "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu",
        backend="blockstream",
        acknowledge_leak=True,
        opener=boom,
    )
    assert r.status == "unknown"
    assert r.satoshis is None


def test_blockstream_ok_mocked():
    class Resp:
        def read(self):
            return b'{"chain_stats":{"funded_txo_sum":100,"spent_txo_sum":40}}'

        def __enter__(self):
            return self

        def __exit__(self, *a):
            return False

    def opener(*_a, **_k):
        return Resp()

    r = get_address_balance(
        "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu",
        backend="blockstream",
        acknowledge_leak=True,
        opener=opener,
    )
    assert r == BalanceResult("ok", 60, "blockstream")


def test_cli_balance_offline(capsys):
    rc = main(["balance", "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu"])
    assert rc == 2
    assert "unknown" in capsys.readouterr().err
