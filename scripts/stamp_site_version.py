#!/usr/bin/env python3
"""Stamp web/js/site-version.js from VERSION (run before each release / deploy)."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VERSION_FILE = ROOT / "VERSION"
OUT = ROOT / "web" / "js" / "site-version.js"


def main() -> int:
    if not VERSION_FILE.is_file():
        print("VERSION file missing", file=sys.stderr)
        return 1
    ver = VERSION_FILE.read_text(encoding="utf-8").strip()
    if not re.fullmatch(r"\d+\.\d+\.\d+", ver):
        print(f"VERSION must be semver X.Y.Z, got {ver!r}", file=sys.stderr)
        return 1
    tag = f"v{ver}"
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        f"""/**
 * Auto-stamped from VERSION by scripts/stamp_site_version.py — do not edit by hand.
 * Release tag shown in sidebar/footer on every page.
 */
(function (g) {{
  "use strict";
  g.BIP39LAB_SITE_VERSION = "{ver}";
  g.BIP39LAB_SITE_TAG = "{tag}";
  function apply() {{
    var label = g.BIP39LAB_SITE_TAG || ("v" + (g.BIP39LAB_SITE_VERSION || ""));
    if (!label || label === "v") return;
    document.querySelectorAll("[data-site-version]").forEach(function (el) {{
      el.textContent = label;
      el.setAttribute("title", "Site release " + label);
    }});
  }}
  if (typeof document !== "undefined") {{
    if (document.readyState === "loading") {{
      document.addEventListener("DOMContentLoaded", apply);
    }} else {{
      apply();
    }}
  }}
}})(typeof globalThis !== "undefined" ? globalThis : this);
""",
        encoding="utf-8",
    )
    print(f"stamped {OUT.relative_to(ROOT)} → {tag}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
