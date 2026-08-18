#!/usr/bin/env python3
"""Stamp Comet/E2E header blurb from VERSION + Playwright S-ids.

Why this exists
---------------
``docs/E2E_COMET_SCENARIOS.md`` had a hand-written Product/scenario range
(e.g. ``S0–S60b`` / ``0.13.9``) that went stale whenever new S-ids or releases
landed. Individual S-ids still had to appear in the body (enforced by
``check_web_e2e`` / ``missing_in_comet``), but the **header** was not part of
that gate — so humans and Comet still saw outdated blurb.

Call this from ``stamp_site_version.py`` (release) and anytime Playwright
scenarios change. Idempotent.

Markers (do not remove):
  scenarios: … line inside <!-- WEB_E2E_CONTRACT … -->
  line starting with `Product: …
  **Playwright total:** …
  **Comet/Perplexity score sheet:** …
"""
from __future__ import annotations

import argparse
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

from web_e2e_contract import (
    DEFAULT_COMET,
    DEFAULT_E2E_DIR,
    extract_playwright_scenario_ids,
)


def _sid_sort_key(s: str) -> tuple[int, str]:
    m = re.fullmatch(r"S(\d+)([a-z]?)", s)
    if not m:
        return (10**9, s)
    return (int(m.group(1)), m.group(2) or "")


def scenario_range_label(ids: set[str]) -> str:
    if not ids:
        return "S?"
    ordered = sorted(ids, key=_sid_sort_key)
    if len(ordered) == 1:
        return ordered[0]
    return f"{ordered[0]}–{ordered[-1]}"


def collect_playwright_ids(root: Path) -> set[str]:
    e2e = root / DEFAULT_E2E_DIR
    specs = sorted(e2e.glob("**/*.{ts,js}")) if e2e.is_dir() else []
    # pathlib brace glob may not expand — collect manually
    if e2e.is_dir() and not specs:
        specs = sorted(list(e2e.glob("**/*.ts")) + list(e2e.glob("**/*.js")))
    return extract_playwright_scenario_ids(specs)


def stamp_comet_doc(
    root: Path,
    *,
    dry_run: bool = False,
    aligned: str | None = None,
) -> str:
    ver_path = root / "VERSION"
    if not ver_path.is_file():
        raise SystemExit("VERSION file missing")
    ver = ver_path.read_text(encoding="utf-8").strip()
    if not re.fullmatch(r"\d+\.\d+\.\d+", ver):
        raise SystemExit(f"VERSION must be semver, got {ver!r}")

    comet_path = root / DEFAULT_COMET
    if not comet_path.is_file():
        raise SystemExit(f"missing {DEFAULT_COMET}")

    pw_ids = collect_playwright_ids(root)
    rng = scenario_range_label(pw_ids)
    n = len(pw_ids)
    day = aligned or date.today().isoformat()

    text = comet_path.read_text(encoding="utf-8")
    orig = text

    # Contract comment scenarios line
    text = re.sub(
        r"(?m)^(scenarios:\s*).+$",
        rf"\1{rng} · Playwright {n} tests · auto-stamped from e2e/ + VERSION",
        text,
        count=1,
    )

    # Product line under H1 (always followed by a blank line)
    product_line = (
        f"`Product: {ver} · Contract: 2 · Last aligned: {day} · "
        f"Scenarios: {rng} · Playwright S-ids: {n}`"
    )
    if re.search(r"(?m)^`Product:.*`\s*$", text):
        text = re.sub(r"(?m)^`Product:.*`\s*\n*", product_line + "\n\n", text, count=1)
    else:
        # Insert after first H1
        text = re.sub(
            r"(?m)^(#[^\n]+\n\n)",
            rf"\1{product_line}\n\n",
            text,
            count=1,
        )

    # Playwright total line
    text = re.sub(
        r"(?m)^\*\*Playwright total:\*\*.*$",
        f"**Playwright total:** `npm run test:e2e` → **{n}** S-id tests "
        f"(local `http://127.0.0.1:4173`).",
        text,
        count=1,
    )

    # Comet score sheet line
    text = re.sub(
        r"(?m)^\*\*Comet/Perplexity score sheet:\*\*.*$",
        f"**Comet/Perplexity score sheet:** **{rng}** "
        f"(scenario IDs below; Playwright titles map 1:1 where listed).",
        text,
        count=1,
    )
    # Leftover range pins in prompts / history — must match Product line
    text = text.replace("S0–S71", rng)
    text = text.replace("S0–S56", rng)

    if text == orig:
        return f"{comet_path.relative_to(root)}: already stamped ({ver}, {rng}, n={n})"
    if dry_run:
        return f"{comet_path.relative_to(root)}: would stamp {ver} · {rng} · n={n}"
    comet_path.write_text(text, encoding="utf-8")
    return f"{comet_path.relative_to(root)}: stamped {ver} · {rng} · n={n}"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=ROOT)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--date", dest="aligned", default=None, help="Override Last aligned YYYY-MM-DD")
    args = ap.parse_args()
    msg = stamp_comet_doc(args.root.resolve(), dry_run=args.dry_run, aligned=args.aligned)
    print(msg)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
