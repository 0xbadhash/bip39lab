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
      btn.textContent = m === "on" ? "Extra help: On" : "Extra help: Off";
      btn.setAttribute("aria-pressed", m === "on" ? "true" : "false");
      btn.title =
        m === "on"
          ? "Longer explanations under cards are visible — click for a compact UI"
          : "Compact UI — click to show longer teaching explanations under cards";
    });
    var th = document.getElementById("teachModeHint");
    if (th) {
      th.textContent =
        m === "on"
          ? "On: longer explanations under cards + most ⓘ tips. Off keeps the page compact."
          : "Off: compact UI. Safety ⓘ (phrase / air-gap / CSP) stay. Turn On for more teaching text.";
    }
    if (m === "off") closeAllTips();
  }

  function closeAllTips(except) {
    document.querySelectorAll(".help-tip.is-open, .help-tip").forEach(function (tip) {
      if (except && tip === except) return;
      tip.classList.remove("is-open");
      const btn = tip.querySelector(".help-tip-btn");
      const panel = tip.querySelector(".help-tip-panel");
      if (btn) btn.setAttribute("aria-expanded", "false");
      if (panel) {
        panel.removeAttribute("hidden");
      }
    });
  }

  function decorateTip(tip, idx) {
    const btn = tip.querySelector(".help-tip-btn") || tip.querySelector("button.btn, button");
    const panel = tip.querySelector(".help-tip-panel");
    if (!panel) return;
    if (!btn) return;
    if (!btn.id) btn.id = "help-tip-btn-" + idx;
    panel.setAttribute("role", "tooltip");
    panel.id = panel.id || "help-tip-panel-" + idx;
    btn.setAttribute("aria-controls", panel.id);
    if (!btn.getAttribute("aria-label")) btn.setAttribute("aria-label", "More information");
    if (!btn.getAttribute("title")) btn.setAttribute("title", btn.getAttribute("aria-label"));
    panel.removeAttribute("hidden");
    btn.setAttribute("aria-expanded", "false");
  }

  function openTip(tip) {
    if (!tip) return;
    tip.classList.remove("tip-force-hide");
    tip.classList.add("is-open");
    const btn = tip.querySelector(".help-tip-btn");
    if (btn) btn.setAttribute("aria-expanded", "true");
  }

  function hideTip(tip) {
    if (!tip) return;
    tip.classList.remove("is-open");
    const btn = tip.querySelector(".help-tip-btn");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  function initTips() {
    document.querySelectorAll(".help-tip").forEach(function (tip, idx) {
      decorateTip(tip, idx);
    });
    document.addEventListener(
      "pointerenter",
      function (ev) {
        const tip = ev.target && ev.target.closest ? ev.target.closest(".help-tip") : null;
        if (!tip) return;
        openTip(tip);
      },
      true
    );
    document.addEventListener(
      "pointerleave",
      function (ev) {
        const tip = ev.target && ev.target.closest ? ev.target.closest(".help-tip") : null;
        if (!tip) return;
        const rel = ev.relatedTarget;
        if (rel && tip.contains(rel)) return;
        hideTip(tip);
      },
      true
    );
    document.addEventListener(
      "focusin",
      function (ev) {
        const tip = ev.target && ev.target.closest ? ev.target.closest(".help-tip") : null;
        if (tip) openTip(tip);
      },
      true
    );
    document.addEventListener(
      "focusout",
      function (ev) {
        const tip = ev.target && ev.target.closest ? ev.target.closest(".help-tip") : null;
        if (!tip) return;
        const rel = ev.relatedTarget;
        if (rel && tip.contains(rel)) return;
        hideTip(tip);
      },
      true
    );
    document.addEventListener("click", function (ev) {
      const btn = ev.target && ev.target.closest ? ev.target.closest(".help-tip-btn") : null;
      if (btn) {
        ev.preventDefault();
        ev.stopPropagation();
        return;
      }
      if (ev.target.closest && ev.target.closest(".action-hover")) return;
      if (ev.target.closest && ev.target.closest(".help-tip")) return;
      closeAllTips();
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key !== "Escape") return;
      document.querySelectorAll(".help-tip").forEach(function (tip) {
        tip.classList.add("tip-force-hide");
        hideTip(tip);
      });
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
    if (!el.hasAttribute("tabindex")) {
      el.setAttribute("tabindex", "-1");
    }
    try {
      el.focus({ preventScroll: true });
    } catch (e) {
      try {
        el.focus();
      } catch (e2) {}
    }
  }

  function flashStepTarget(el) {
    if (!el) return;
    el.classList.remove("step-flash");
    void el.offsetWidth;
    el.classList.add("step-flash");
    el.setAttribute("data-step-focused", "true");
    window.setTimeout(function () {
      el.classList.remove("step-flash");
    }, 1600);
  }

  function getScrollParent(el) {
    var node = el && el.parentElement;
    while (node && node !== document.body && node !== document.documentElement) {
      var st = window.getComputedStyle(node);
      var oy = st.overflowY || st.overflow;
      if (
        (oy === "auto" || oy === "scroll" || oy === "overlay") &&
        node.scrollHeight > node.clientHeight + 4
      ) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  }

  function scrollStepTargetIntoView(el) {
    if (!el) return;
    var parent = getScrollParent(el);
    if (parent) {
      var er = el.getBoundingClientRect();
      var pr = parent.getBoundingClientRect();
      var top = parent.scrollTop + (er.top - pr.top) - 12;
      try {
        parent.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      } catch (e) {
        parent.scrollTop = Math.max(0, top);
      }
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
          document.querySelectorAll("[data-step-focused]").forEach(function (prev) {
            if (prev !== el) prev.removeAttribute("data-step-focused");
          });
          scrollStepTargetIntoView(el);
          flashStepTarget(el);
          window.requestAnimationFrame(function () {
            focusStepTarget(el);
          });
          window.setTimeout(function () {
            scrollStepTargetIntoView(el);
            focusStepTarget(el);
            flashStepTarget(el);
          }, 400);
        });
      });
    });
  }

  function loadLabStrip() {
    if (document.getElementById("labStripSrc")) return;
    var s = document.createElement("script");
    s.id = "labStripSrc";
    var v =
      (typeof BIP39LAB_SITE_VERSION === "string" && BIP39LAB_SITE_VERSION) || "0.16.25";
    s.src = "js/lab-strip.js?v=" + v;
    document.head.appendChild(s);
  }

  function init() {
    loadLabStrip();
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
