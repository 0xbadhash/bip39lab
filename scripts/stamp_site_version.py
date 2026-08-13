#!/usr/bin/env python3
"""Stamp web/js/site-version.js from VERSION (run before each release / deploy).

Also stamps ``docs/E2E_COMET_SCENARIOS.md`` header (product version + S-id range)
via ``stamp_comet_header.py`` so Comet blurb cannot lag Playwright.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VERSION_FILE = ROOT / "VERSION"
OUT = ROOT / "web" / "js" / "site-version.js"
SCRIPTS = ROOT / "scripts"


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
    # Cache-bust local script tags on static pages (src="js/...?v=X.Y.Z")
    html_files = list((ROOT / "web").glob("*.html"))
    for html in html_files:
        text = html.read_text(encoding="utf-8")
        new = re.sub(
            r'src="(js/[^"?]+)(?:\?v=[^"]*)?"',
            rf'src="\1?v={ver}"',
            text,
        )
        new = re.sub(
            r'href="(css/[^"?]+)(?:\?v=[^"]*)?"',
            rf'href="\1?v={ver}"',
            new,
        )
        if new != text:
            html.write_text(new, encoding="utf-8")
            print(f"  cache-bust assets in {html.relative_to(ROOT)}")
    # Keep Comet header in lockstep with VERSION + Playwright S-ids
    if str(SCRIPTS) not in sys.path:
        sys.path.insert(0, str(SCRIPTS))
    try:
        from stamp_comet_header import stamp_comet_doc

        print(stamp_comet_doc(ROOT))
    except Exception as e:  # noqa: BLE001 — release path must not hide stamp failure
        print(f"stamp_comet_header failed: {e}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
