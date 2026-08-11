/**
 * Leveled classroom: E0 orientation/first-hour, E1 levels, E2 quiz, E4 tour, E5 BIP-85 hook, E6 ops.
 * No secrets; localStorage only for prefs/progress.
 */
(function () {
  "use strict";

  var LEVEL_KEY = "bip39lab.level";
  var HOUR_KEY = "bip39lab.firstHour";
  var QUIZ_KEY = "bip39lab.quiz";
  var TOUR_KEY = "bip39lab.tour";
  var LEVELS = ["starter", "beginner", "intermediate", "advanced"];

  function $(id) {
    return document.getElementById(id);
  }

  function getLevel() {
    try {
      var v = localStorage.getItem(LEVEL_KEY);
      if (LEVELS.indexOf(v) >= 0) return v;
    } catch (e) {
      /* ignore */
    }
    return "starter";
  }

  function setLevel(level) {
    if (LEVELS.indexOf(level) < 0) level = "starter";
    try {
      localStorage.setItem(LEVEL_KEY, level);
    } catch (e) {
      /* ignore */
    }
    applyLevel(level);
  }

  function loadJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var o = JSON.parse(raw);
      return o && typeof o === "object" ? o : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function saveJson(key, obj) {
    try {
      localStorage.setItem(key, JSON.stringify(obj));
    } catch (e) {
      /* ignore */
    }
  }

  function applyLevel(level) {
    level = level || getLevel();
    document.documentElement.setAttribute("data-level", level);
    var sel = $("learnLevel");
    if (sel && sel.value !== level) sel.value = level;
    document.querySelectorAll("[data-level-min]").forEach(function (el) {
      var min = el.getAttribute("data-level-min") || "starter";
      var ok = LEVELS.indexOf(level) >= LEVELS.indexOf(min);
      var force = el.getAttribute("data-level-force") === "show";
      if (force) {
        el.hidden = false;
        el.classList.remove("level-gated");
        return;
      }
      if (ok) {
        el.hidden = false;
        el.classList.remove("level-gated");
      } else {
        // Soft gate: keep in DOM for skip, mark gated
        el.classList.add("level-gated");
        if (el.getAttribute("data-level-hide") === "1") el.hidden = true;
        else el.hidden = false;
      }
    });
    var gates = document.querySelectorAll("[data-level-gate-banner]");
    gates.forEach(function (b) {
      var min = b.getAttribute("data-level-gate-banner") || "intermediate";
      b.hidden = LEVELS.indexOf(level) >= LEVELS.indexOf(min);
    });
  }

  function refreshFirstHour() {
    var st = loadJson(HOUR_KEY, {});
    document.querySelectorAll("[data-hour-step]").forEach(function (el) {
      var id = el.getAttribute("data-hour-step");
      var cb = el.querySelector('input[type="checkbox"]');
      if (cb) {
        cb.checked = !!st[id];
        cb.onchange = function () {
          st[id] = !!cb.checked;
          saveJson(HOUR_KEY, st);
          refreshFirstHour();
        };
      }
    });
    var done = 0;
    var total = 0;
    document.querySelectorAll("[data-hour-step]").forEach(function (el) {
      total++;
      var id = el.getAttribute("data-hour-step");
      if (st[id]) done++;
    });
    var prog = $("firstHourProgress");
    if (prog) prog.textContent = done + " / " + total + " steps checked";
  }

  function refreshQuiz() {
    var st = loadJson(QUIZ_KEY, {});
    ["q1", "q2", "q3"].forEach(function (q) {
      var badge = $("quizBadge-" + q);
      if (badge) {
        badge.textContent = st[q] ? "Passed" : "Not yet";
        badge.className = "chip " + (st[q] ? "chip-ok" : "chip-warn");
      }
    });
    var n = (st.q1 ? 1 : 0) + (st.q2 ? 1 : 0) + (st.q3 ? 1 : 0);
    var sum = $("quizSummary");
    if (sum) sum.textContent = n + " / 3 quiz items marked passed (self-check).";
  }

  function markQuiz(q) {
    var st = loadJson(QUIZ_KEY, {});
    st[q] = true;
    saveJson(QUIZ_KEY, st);
    refreshQuiz();
  }

  function goTab(name) {
    if (typeof window.__bip39ShowTab === "function") window.__bip39ShowTab(name);
  }

  function wire() {
    var sel = $("learnLevel");
    if (sel) {
      sel.addEventListener("change", function () {
        setLevel(sel.value);
      });
    }
    document.querySelectorAll("[data-level-set]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLevel(btn.getAttribute("data-level-set"));
      });
    });
    document.querySelectorAll("[data-level-skip]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var el = btn.closest("[data-level-min]");
        if (el) {
          el.setAttribute("data-level-force", "show");
          el.classList.remove("level-gated");
          el.hidden = false;
        }
      });
    });

    // Quiz open demos
    var q1 = $("quizOpenPp");
    if (q1)
      q1.addEventListener("click", function () {
        goTab("tools");
        setTimeout(function () {
          var t = $("cardCmpPp");
          if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      });
    var q2 = $("quizOpenShamir");
    if (q2)
      q2.addEventListener("click", function () {
        window.location.href = "shamir.html#shCardRecombine";
      });
    var q3 = $("quizOpenEnt");
    if (q3)
      q3.addEventListener("click", function () {
        goTab("tools");
        setTimeout(function () {
          var t = $("cardEntPad");
          if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      });
    ["q1", "q2", "q3"].forEach(function (q) {
      var b = $("quizPass-" + q);
      if (b)
        b.addEventListener("click", function () {
          markQuiz(q);
        });
    });

    // Tour
    var tourSteps = [
      {
        title: "Stop 1 — Multisig (many keys)",
        body: "Several people each hold a key. Spend needs M of N signatures. Keys are not “shares of one secret blob.”",
        href: "multisig.html",
      },
      {
        title: "Stop 2 — Shamir educational (hex shares)",
        body: "One practice secret split into hex shares. Not BIP-39 words, not SLIP-39. Under-threshold recombine must fail.",
        href: "shamir.html",
      },
      {
        title: "Stop 3 — SLIP-39 lab (Trezor-shaped words)",
        body: "Share mnemonics in a Trezor-shaped format. Lab only — not Suite, not for funded wallets. Deep-link from Shamir, not a 7th nav item.",
        href: "slip39.html",
      },
    ];
    var tourIdx = loadJson(TOUR_KEY, { i: 0 }).i || 0;
    function renderTour() {
      var title = $("tourTitle");
      var body = $("tourBody");
      var step = tourSteps[tourIdx] || tourSteps[0];
      if (title) title.textContent = step.title;
      if (body) body.textContent = step.body;
      var meta = $("tourMeta");
      if (meta) meta.textContent = "Step " + (tourIdx + 1) + " / " + tourSteps.length;
    }
    var tStart = $("tourStart");
    if (tStart)
      tStart.addEventListener("click", function () {
        tourIdx = 0;
        saveJson(TOUR_KEY, { i: 0 });
        renderTour();
        var box = $("tourBox");
        if (box) box.hidden = false;
      });
    var tNext = $("tourNext");
    if (tNext)
      tNext.addEventListener("click", function () {
        if (tourIdx < tourSteps.length - 1) {
          tourIdx++;
          saveJson(TOUR_KEY, { i: tourIdx });
          renderTour();
        }
      });
    var tOpen = $("tourOpen");
    if (tOpen)
      tOpen.addEventListener("click", function () {
        var step = tourSteps[tourIdx] || tourSteps[0];
        window.location.href = step.href;
      });
    renderTour();

    // BIP-85 educational demo: derive display-only child label from hash (not full BIP-85 crypto)
    var b85 = $("btnBip85Demo");
    if (b85)
      b85.addEventListener("click", function () {
        var out = $("bip85Out");
        var parent = ($("mnemonic") && $("mnemonic").value.trim()) || "";
        if (!out) return;
        if (!parent) {
          out.textContent =
            "Put a PRACTICE phrase on Lab first (Generate). BIP-85 demos never use funded seeds here.";
          return;
        }
        // Educational illustration only: show that an index selects a child application seed.
        // Full BIP-85 HMAC derivation can be added later; this teaches the mental model.
        out.textContent =
          "PRACTICE ONLY — not BIP-85-compliant derivation yet.\n" +
          "Idea: master mnemonic + app index (e.g. 0 = “app A”) → a child mnemonic for that app only.\n" +
          "Parent word count: " +
          parent.split(/\s+/).filter(Boolean).length +
          "\n" +
          "Example index: 0 → child seed would be derived offline for one app; index 1 for another.\n" +
          "Never fund educational parents or children. Prefer hardware/vendor tools for real BIP-85.";
      });

    refreshFirstHour();
    refreshQuiz();
    applyLevel(getLevel());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }

  window.LearnLevels = { getLevel: getLevel, setLevel: setLevel, applyLevel: applyLevel };
})();
