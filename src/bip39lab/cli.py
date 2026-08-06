"""CLI — offline only; never writes seed material to disk."""

from __future__ import annotations

import argparse
import logging
import sys

from .bip39 import generate_mnemonic, validate_mnemonic
from .derive import derive_addresses, derive_address_for_type

# Never attach handlers that might capture secrets at DEBUG with full mnemonic dumps.
logger = logging.getLogger("bip39lab")


def _build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="bip39lab",
        description="Offline BIP-39 lab: generate, validate, derive (no network, no retention).",
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
    return p


def main(argv: list[str] | None = None) -> int:
    args = _build_parser().parse_args(argv)

    if args.cmd == "generate":
        print(generate_mnemonic(args.words))
        return 0

    mnemonic = " ".join(args.mnemonic)

    if args.cmd == "validate":
        ok = validate_mnemonic(mnemonic)
        print("valid" if ok else "invalid")
        return 0 if ok else 1

    if args.cmd == "derive":
        if not validate_mnemonic(mnemonic):
            print("invalid mnemonic", file=sys.stderr)
            return 1
        # Do not log the mnemonic.
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
