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

  function focusStepTarget(el) {
    if (!el) return;
    // Make section focusable without permanent tab stop, then move focus for a11y + :focus-visible ring
    if (!el.hasAttribute("tabindex")) {
      el.setAttribute("tabindex", "-1");
    }
    try {
      el.focus({ preventScroll: true });
    } catch (e) {
      try {
        el.focus();
      } catch (e2) {
        /* ignore */
      }
    }
  }

  function flashStepTarget(el) {
    if (!el) return;
    el.classList.remove("step-flash");
    // reflow so re-click restarts animation
    void el.offsetWidth;
    el.classList.add("step-flash");
    el.setAttribute("data-step-focused", "true");
    window.setTimeout(function () {
      el.classList.remove("step-flash");
      // keep data-step-focused until next jump so tests can assert focus target
    }, 1600);
  }

  function initStepRails() {
    document.querySelectorAll("[data-step-rail]").forEach(function (rail) {
      const steps = rail.querySelectorAll("[data-step-target]");
      steps.forEach(function (btn) {
        btn.addEventListener("click", function (ev) {
          if (ev && ev.preventDefault) ev.preventDefault();
          const sel = btn.getAttribute("data-step-target");
          if (!sel) return;
          const el = document.querySelector(sel);
          if (!el) return;

          // Lab tab switch first if needed (so target is visible)
          if (sel.indexOf("#panel-") === 0 && typeof window.__bip39ShowTab === "function") {
            const name = sel.replace("#panel-", "");
            window.__bip39ShowTab(name);
          }

          steps.forEach(function (s) {
            s.classList.remove("is-active");
            s.setAttribute("aria-current", "false");
          });
          btn.classList.add("is-active");
          btn.setAttribute("aria-current", "step");

          // Clear prior jump markers on this page
          document.querySelectorAll("[data-step-focused]").forEach(function (prev) {
            if (prev !== el) prev.removeAttribute("data-step-focused");
          });

          el.scrollIntoView({ behavior: "smooth", block: "start" });
          flashStepTarget(el);
          // Focus after scroll starts so keyboard users land in the section
          window.requestAnimationFrame(function () {
            focusStepTarget(el);
          });
          // Second pass after smooth scroll settles (layout / sticky header)
          window.setTimeout(function () {
            focusStepTarget(el);
            flashStepTarget(el);
          }, 400);
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
