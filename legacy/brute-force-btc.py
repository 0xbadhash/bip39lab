#!/usr/bin/env python3
"""REMOVED — unsafe historical scanner.

This file intentionally no longer contains network URLs, eval(), or mnemonic
retention logic. See legacy/README.md and use:

    python -m bip39lab

Original behavior is not supported.
"""

from __future__ import annotations

import sys


def main() -> int:
    print(
        "legacy scanner removed. Use: python -m bip39lab\n"
        "See legacy/README.md",
        file=sys.stderr,
    )
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
