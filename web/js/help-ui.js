/**
 * Shared help UX: ⓘ tips, Teach mode, step rail (P0–P4).
 * No secrets; theme/teach prefs only in localStorage.
 */
(function () {
  "use strict";

  const TEACH_KEY = "bip39lab.teach";

  function $(id) {
    return document.getElementById(id);
  }

  function getTeach() {
    try {
      const v = localStorage.getItem(TEACH_KEY);
      if (v === "off" || v === "on") return v;
    } catch (e) {
      /* ignore */
    }
    return "on";
  }

  function applyTeach(mode) {
    const m = mode === "off" ? "off" : "on";
    document.documentElement.setAttribute("data-teach", m);
    try {
      localStorage.setItem(TEACH_KEY, m);
    } catch (e) {
      /* ignore */
    }
    document.querySelectorAll("[data-teach-toggle]").forEach(function (btn) {
      btn.textContent = m === "on" ? "Teach: On" : "Teach: Off";
      btn.setAttribute("aria-pressed", m === "on" ? "true" : "false");
      btn.title =
        m === "on"
          ? "Teaching copy visible — click to hide tips and long help"
          : "Compact UI — click to show teaching tips";
    });
    if (m === "off") closeAllTips();
  }

  function closeAllTips(except) {
    document.querySelectorAll(".help-tip.is-open").forEach(function (tip) {
      if (except && tip === except) return;
      tip.classList.remove("is-open");
      const btn = tip.querySelector(".help-tip-btn");
      const panel = tip.querySelector(".help-tip-panel");
      if (btn) btn.setAttribute("aria-expanded", "false");
      if (panel) panel.hidden = true;
    });
  }

  function initTips() {
    document.querySelectorAll(".help-tip").forEach(function (tip, idx) {
      const btn = tip.querySelector(".help-tip-btn");
      const panel = tip.querySelector(".help-tip-panel");
      if (!btn || !panel) return;
      if (!btn.id) btn.id = "help-tip-btn-" + idx;
      panel.setAttribute("role", "tooltip");
      panel.id = panel.id || "help-tip-panel-" + idx;
      btn.setAttribute("aria-controls", panel.id);
      btn.setAttribute("aria-expanded", "false");
      if (!btn.getAttribute("aria-label")) btn.setAttribute("aria-label", "More information");

      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        const open = tip.classList.contains("is-open");
        closeAllTips();
        if (!open) {
          tip.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
          panel.hidden = false;
        }
      });
    });

    document.addEventListener("click", function (ev) {
      if (ev.target.closest && ev.target.closest(".help-tip")) return;
      closeAllTips();
    });

    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") closeAllTips();
    });
  }

  function initTeachToggles() {
    document.querySelectorAll("[data-teach-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const cur = document.documentElement.getAttribute("data-teach") || "on";
        applyTeach(cur === "on" ? "off" : "on");
      });
    });
    applyTeach(getTeach());
  }

  function initStepRails() {
    document.querySelectorAll("[data-step-rail]").forEach(function (rail) {
      const steps = rail.querySelectorAll("[data-step-target]");
      steps.forEach(function (btn) {
        btn.addEventListener("click", function () {
          const sel = btn.getAttribute("data-step-target");
          if (!sel) return;
          const el = document.querySelector(sel);
          if (!el) return;
          steps.forEach(function (s) {
            s.classList.remove("is-active");
            s.setAttribute("aria-current", "false");
          });
          btn.classList.add("is-active");
          btn.setAttribute("aria-current", "step");
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          // brief highlight
          el.classList.add("step-flash");
          window.setTimeout(function () {
            el.classList.remove("step-flash");
          }, 1200);
          // Lab tab switch if needed
          if (sel.indexOf("#panel-") === 0 && typeof window.__bip39ShowTab === "function") {
            const name = sel.replace("#panel-", "");
            window.__bip39ShowTab(name);
          }
        });
      });
    });
  }

  function init() {
    initTips();
    initTeachToggles();
    initStepRails();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.HelpUI = { applyTeach: applyTeach, getTeach: getTeach, closeAllTips: closeAllTips };
})();
