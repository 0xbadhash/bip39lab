"""CLI — never writes seed material to disk; balance is address-only."""

from __future__ import annotations

import argparse
import logging
import sys

from .balance import get_address_balance
from .bip39 import generate_mnemonic, validate_mnemonic
from .derive import derive_address_for_type, derive_addresses

logger = logging.getLogger("bip39lab")


def _build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="bip39lab",
        description="BIP-39 lab: generate/validate/derive offline; optional address-only balance.",
    )
    sub = p.add_subparsers(dest="cmd", required=True)

    g = sub.add_parser("generate", help="Generate a new CSPRNG mnemonic (print once; not saved)")
    g.add_argument("--words", type=int, choices=[12, 15, 18, 21, 24], default=12)

    v = sub.add_parser("validate", help="Validate BIP-39 checksum + wordlist")
    v.add_argument("mnemonic", nargs="+", help="Mnemonic words")

    d = sub.add_parser("derive", help="Derive first addresses (offline)")
    d.add_argument("mnemonic", nargs="+", help="Mnemonic words")
    d.add_argument("--passphrase", default="", help="Optional BIP-39 passphrase")
    d.add_argument(
        "--type",
        choices=["p2pkh", "p2sh", "bech32", "all"],
        default="all",
        help="Address type (default all)",
    )
    d.add_argument("--account", type=int, default=0)
    d.add_argument("--change", type=int, default=0)
    d.add_argument("--index", type=int, default=0)

    b = sub.add_parser(
        "balance",
        help="Address-only balance (never pass a mnemonic). Default offline/unknown.",
    )
    b.add_argument("address", help="Bitcoin address (not a seed phrase)")
    b.add_argument(
        "--backend",
        choices=["none", "blockstream"],
        default="none",
        help="Balance backend (default none = no network)",
    )
    b.add_argument(
        "--i-understand-address-leak",
        action="store_true",
        help="Required for network backends: explorer sees the address",
    )
    return p


def main(argv: list[str] | None = None) -> int:
    args = _build_parser().parse_args(argv)

    if args.cmd == "generate":
        print(generate_mnemonic(args.words))
        return 0

    if args.cmd == "balance":
        res = get_address_balance(
            args.address,
            backend=args.backend,
            acknowledge_leak=args.i_understand_address_leak,
        )
        if res.status == "ok":
            print(f"ok {res.satoshis} sat  ({res.detail})")
            return 0
        if res.status == "unknown":
            print(f"unknown  ({res.detail})", file=sys.stderr)
            return 2
        print(f"error  ({res.detail})", file=sys.stderr)
        return 1

    mnemonic = " ".join(args.mnemonic)

    if args.cmd == "validate":
        ok = validate_mnemonic(mnemonic)
        print("valid" if ok else "invalid")
        return 0 if ok else 1

    if args.cmd == "derive":
        if not validate_mnemonic(mnemonic):
            print("invalid mnemonic", file=sys.stderr)
            return 1
        logger.info("deriving addresses offline (mnemonic omitted from logs)")
        if args.type == "all":
            addrs = derive_addresses(
                mnemonic,
                passphrase=args.passphrase,
                account=args.account,
                change=args.change,
                index=args.index,
            )
            for k, a in addrs.items():
                print(f"{k}: {a}")
        else:
            a = derive_address_for_type(
                mnemonic,
                args.type,
                passphrase=args.passphrase,
                account=args.account,
                change=args.change,
                index=args.index,
            )
            print(a)
        return 0

    return 2


if __name__ == "__main__":
    raise SystemExit(main())
