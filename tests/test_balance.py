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


ADDR = "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu"


def test_bitcoind_ok_mocked_rpc():
    def rpc(method, params):
        assert method == "scantxoutset"
        assert params[0] == "start"
        assert any(ADDR in str(p) for p in params[1])
        return {"total_amount": 0.00000100}  # 100 sat

    r = get_address_balance(ADDR, backend="bitcoind", rpc_call=rpc)
    assert r.status == "ok"
    assert r.satoshis == 100
    assert "bitcoind" in r.detail


def test_bitcoind_rpc_failure_unknown():
    def rpc(_m, _p):
        raise TimeoutError("node down")

    r = get_address_balance(ADDR, backend="bitcoind", rpc_call=rpc)
    assert r.status == "unknown"
    assert r.satoshis is None


def test_bitcoind_rpc_error_object_unknown():
    def rpc(_m, _p):
        raise RuntimeError("RPC error -28: Loading block index")

    r = get_address_balance(ADDR, backend="bitcoind", rpc_call=rpc)
    assert r.status == "unknown"
    assert r.satoshis is None


def test_bitcoind_rejects_mnemonic():
    m = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
    r = get_address_balance(m, backend="bitcoind", rpc_call=lambda *_: {"total_amount": 1})
    assert r.status == "error"
    assert r.satoshis is None


def test_bitcoind_zero_balance_ok():
    """Legitimate zero UTXOs is ok with satoshis=0; failure path stays unknown."""

    def rpc(_m, _p):
        return {"total_amount": 0}

    r = get_address_balance(ADDR, backend="bitcoind", rpc_call=rpc)
    assert r == BalanceResult("ok", 0, "bitcoind")


def test_cli_balance_bitcoind_backend(monkeypatch, capsys):
    def fake(address, **kw):
        assert address == ADDR
        assert kw.get("backend") == "bitcoind"
        assert kw.get("rpc_url") == "http://127.0.0.1:18443"
        assert kw.get("acknowledge_leak") is False
        return BalanceResult("ok", 50, "bitcoind")

    monkeypatch.setattr("bip39lab.cli.get_address_balance", fake)
    rc = main(
        [
            "balance",
            ADDR,
            "--backend",
            "bitcoind",
            "--rpc-url",
            "http://127.0.0.1:18443",
        ]
    )
    assert rc == 0
    assert "50" in capsys.readouterr().out


def test_btc_to_sats_decimal_safe():
    from bip39lab.balance import btc_to_satoshis

    assert btc_to_satoshis(0.00000100) == 100
    assert btc_to_satoshis("1.00000001") == 100_000_001
    assert btc_to_satoshis(0) == 0


def test_mempool_requires_ack():
    r = get_address_balance(ADDR, backend="mempool", acknowledge_leak=False)
    assert r.status == "error"


def test_mempool_ok_mocked():
    class Resp:
        def read(self):
            return b'{"chain_stats":{"funded_txo_sum":200,"spent_txo_sum":50}}'

        def __enter__(self):
            return self

        def __exit__(self, *a):
            return False

    def opener(*_a, **_k):
        return Resp()

    r = get_address_balance(ADDR, backend="mempool", acknowledge_leak=True, opener=opener)
    assert r == BalanceResult("ok", 150, "mempool")


def test_mempool_http_failure_unknown():
    def boom(*_a, **_k):
        raise TimeoutError("nope")

    r = get_address_balance(ADDR, backend="mempool", acknowledge_leak=True, opener=boom)
    assert r.status == "unknown"
    assert r.satoshis is None
