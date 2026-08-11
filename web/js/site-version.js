/**
 * Auto-stamped from VERSION by scripts/stamp_site_version.py — do not edit by hand.
 * Release tag shown in sidebar/footer on every page.
 */
(function (g) {
  "use strict";
  g.BIP39LAB_SITE_VERSION = "0.13.11";
  g.BIP39LAB_SITE_TAG = "v0.13.11";
  function apply() {
    var label = g.BIP39LAB_SITE_TAG || ("v" + (g.BIP39LAB_SITE_VERSION || ""));
    if (!label || label === "v") return;
    document.querySelectorAll("[data-site-version]").forEach(function (el) {
      el.textContent = label;
      el.setAttribute("title", "Site release " + label);
    });
  }
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", apply);
    } else {
      apply();
    }
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
