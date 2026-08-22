/* Site version stamp — single source for sidebar chip + S0. */
(function (g) {
  "use strict";
  g.BIP39LAB_SITE_VERSION = "0.16.25";
  g.BIP39LAB_SITE_TAG = "v0.16.25";
  function paint() {
    var v = g.BIP39LAB_SITE_VERSION;
    var tag = g.BIP39LAB_SITE_TAG;
    document.querySelectorAll("[data-site-version]").forEach(function (el) {
      el.setAttribute("data-site-version", v);
      if (el.classList.contains("site-version-chip") || el.getAttribute("data-site-version-text") === "1") {
        el.textContent = tag;
      }
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", paint);
  } else {
    paint();
  }
})(typeof window !== "undefined" ? window : this);
