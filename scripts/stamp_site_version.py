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
    # HTTP stamps at nginx web root (live /VERSION and /PLAYWRIGHT_LAST.md)
    n_ids = 0
    s_range = "S?"
    try:
        from stamp_comet_header import collect_playwright_ids, scenario_range_label

        ids = collect_playwright_ids(ROOT)
        n_ids = len(ids)
        s_range = scenario_range_label(ids)
    except Exception as e:  # noqa: BLE001
        print(f"playwright id collect failed: {e}", file=sys.stderr)
        return 1
    web_ver = ROOT / "web" / "VERSION"
    web_ver.write_text(ver + "\n", encoding="utf-8")
    print(f"stamped {web_ver.relative_to(ROOT)} → {ver}")
    last_body = (
        f"# PLAYWRIGHT_LAST\n\n"
        f"product: {ver}\n"
        f"tag: {tag}\n"
        f"s_ids: {n_ids}\n"
        f"scenarios: {s_range}\n"
        f"aligned: auto-stamped from VERSION + e2e/\n\n"
        f"live === comet === PLAYWRIGHT_LAST === /VERSION === {ver}\n"
    )
    last = ROOT / "web" / "PLAYWRIGHT_LAST.md"
    last.write_text(last_body, encoding="utf-8")
    print(f"stamped {last.relative_to(ROOT)} → {ver} (n={n_ids})")
    # Required live URL: /docs/PLAYWRIGHT_LAST.md (nginx root = web/)
    docs_last = ROOT / "web" / "docs" / "PLAYWRIGHT_LAST.md"
    docs_last.parent.mkdir(parents=True, exist_ok=True)
    docs_last.write_text(last_body, encoding="utf-8")
    print(f"stamped {docs_last.relative_to(ROOT)} → {ver} (n={n_ids})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
