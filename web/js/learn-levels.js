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

  function setLevel(level, opts) {
    if (LEVELS.indexOf(level) < 0) level = "starter";
    try {
      localStorage.setItem(LEVEL_KEY, level);
    } catch (e) {
      /* ignore */
    }
    applyLevel(level, opts || { announce: true });
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

  var LEVEL_BLURBS = {
    starter:
      "Starter: orientation + First hour checklist. Quiz / tour stay dimmed until you raise Level.",
    beginner:
      "Beginner: Guided quiz self-checks open. Next: Intermediate = three-splits tour + more tools depth.",
    intermediate:
      "Intermediate: Tour (Multisig ≠ Shamir ≠ SLIP-39) + deeper Tools (e.g. entropy pad). Next: Advanced ops.",
    advanced:
      "Advanced: BIP-85 educational shell + Knots / seed-scan ops notes. Full classroom open.",
  };

  var LEVEL_UNLOCKS = {
    starter: "Orientation + First hour",
    beginner: "Guided quiz",
    intermediate: "Three-splits tour · deeper Tools",
    advanced: "BIP-85 shell · Ops / Knots notes",
  };

  function updateLevelHint(level) {
    var hint = $("learnLevelHint");
    if (hint) hint.textContent = LEVEL_BLURBS[level] || LEVEL_BLURBS.starter;
  }

  function showLevelToast(level, prev) {
    var toast = $("learnLevelToast");
    if (!toast) return;
    var msg =
      "Level → " +
      level.charAt(0).toUpperCase() +
      level.slice(1) +
      ": " +
      (LEVEL_UNLOCKS[level] || "") +
      ". Soft gates only — not a wallet lock. See left pane for details.";
    if (prev && prev !== level) {
      var pi = LEVELS.indexOf(prev);
      var ni = LEVELS.indexOf(level);
      if (ni > pi) msg = "Unlocked for " + level + ": " + (LEVEL_UNLOCKS[level] || "") + ". Scroll Lab for newly open cards.";
      else if (ni < pi) msg = "Level lowered to " + level + ". Higher cards dim again (soft gate).";
    }
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(showLevelToast._t);
    showLevelToast._t = setTimeout(function () {
      toast.hidden = true;
    }, 6000);
  }

  function applyLevel(level, opts) {
    opts = opts || {};
    var prev = document.documentElement.getAttribute("data-level") || getLevel();
    level = level || getLevel();
    document.documentElement.setAttribute("data-level", level);
    var sel = $("learnLevel");
    if (sel && sel.value !== level) sel.value = level;
    updateLevelHint(level);
    var firstUnlocked = null;
    document.querySelectorAll("[data-level-min]").forEach(function (el) {
      var min = el.getAttribute("data-level-min") || "starter";
      var ok = LEVELS.indexOf(level) >= LEVELS.indexOf(min);
      var force = el.getAttribute("data-level-force") === "show";
      var wasGated = el.classList.contains("level-gated");
      if (!el.getAttribute("data-level-gate-msg")) {
        el.setAttribute(
          "data-level-gate-msg",
          "Needs Level ≥ " + min + " (raise in left pane Classroom). Soft gate — still readable."
        );
      }
      if (force) {
        el.hidden = false;
        el.classList.remove("level-gated");
        return;
      }
      if (ok) {
        el.hidden = false;
        el.classList.remove("level-gated");
        if (wasGated && opts.announce) {
          el.classList.remove("level-flash");
          void el.offsetWidth;
          el.classList.add("level-flash");
          if (!firstUnlocked) firstUnlocked = el;
        }
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
    if (opts.announce && prev !== level) {
      showLevelToast(level, prev);
      if (firstUnlocked) {
        setTimeout(function () {
          firstUnlocked.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 120);
      }
    }
  }

  var HOUR_RETURN_KEY = "bip39lab.hourReturn";
  var QUIZ_RETURN_KEY = "bip39lab.quizReturn";
  var QUIZ_ACTIVE_KEY = "bip39lab.quizActive";
  /** @type {"hour"|"quiz"|null} */
  var learnReturnMode = null;

  function setBodyReturnOpen(on) {
    try {
      document.body.classList.toggle("learn-return-open", !!on);
    } catch (e) {
      /* ignore */
    }
  }

  /**
   * One floating dock only — never stack hour + quiz sticky bars over content.
   * mode: "hour" | "quiz" | null (hide)
   */
  function showLearnReturn(mode, hint) {
    var bar = $("learnReturnBar");
    var btn = $("learnReturnBarBtn");
    var hintEl = $("learnReturnBarHint");
    if (!bar) return;
    if (!mode) {
      learnReturnMode = null;
      bar.hidden = true;
      bar.removeAttribute("data-return-mode");
      setBodyReturnOpen(false);
      return;
    }
    learnReturnMode = mode;
    bar.hidden = false;
    bar.setAttribute("data-return-mode", mode);
    setBodyReturnOpen(true);
    if (btn) {
      btn.textContent = mode === "quiz" ? "← Back to Guided quiz" : "← Back to First hour";
    }
    if (hintEl) {
      hintEl.textContent =
        hint ||
        (mode === "quiz"
          ? "Experiment, then mark passed only when clear."
          : "Finish, then Mark done on the checklist.");
    }
  }

  function setHourReturn() {
    try {
      sessionStorage.setItem(HOUR_RETURN_KEY, "1");
      // Prefer quiz if both somehow set — but Go hour clears quiz first
      sessionStorage.removeItem(QUIZ_RETURN_KEY);
    } catch (e) {
      /* ignore */
    }
    showLearnReturn("hour");
  }

  function clearHourReturn() {
    try {
      sessionStorage.removeItem(HOUR_RETURN_KEY);
    } catch (e) {
      /* ignore */
    }
    if (learnReturnMode === "hour") showLearnReturn(null);
  }

  function showHourBackBar(on) {
    // Compat shim for older call sites
    if (on) showLearnReturn("hour");
    else if (learnReturnMode === "hour") showLearnReturn(null);
  }

  function returnToFirstHour() {
    clearHourReturn();
    clearQuizReturn();
    showLearnReturn(null);
    goTab("lab");
    setTimeout(function () {
      var card = $("cardFirstHour");
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "start" });
        try {
          if (!card.hasAttribute("tabindex")) card.setAttribute("tabindex", "-1");
          card.focus({ preventScroll: true });
        } catch (e) {
          /* ignore */
        }
      }
    }, 80);
  }

  function markHourStep(id, done) {
    var st = loadJson(HOUR_KEY, {});
    st[id] = !!done;
    saveJson(HOUR_KEY, st);
    refreshFirstHour();
  }

  function goHourStep(li) {
    if (!li) return;
    var href = li.getAttribute("data-hour-href");
    var tab = li.getAttribute("data-hour-tab");
    var target = li.getAttribute("data-hour-target");
    var needLevel = li.querySelector(".hour-go") && li.querySelector(".hour-go").getAttribute("data-hour-level");
    if (needLevel) setLevel(needLevel);
    setHourReturn();
    if (href) {
      // Network (or external page): return via bar on index after user navigates back, or query
      try {
        sessionStorage.setItem(HOUR_RETURN_KEY, "1");
      } catch (e) {
        /* ignore */
      }
      window.location.href = href + (href.indexOf("?") >= 0 ? "&" : "?") + "from=firsthour";
      return;
    }
    if (tab) goTab(tab);
    setTimeout(function () {
      var el = target ? document.querySelector(target) : null;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        try {
          if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
          el.focus({ preventScroll: true });
        } catch (e) {
          /* ignore */
        }
      }
    }, 100);
  }

  function refreshFirstHour() {
    var st = loadJson(HOUR_KEY, {});
    document.querySelectorAll("[data-hour-step]").forEach(function (el) {
      var id = el.getAttribute("data-hour-step");
      var cb = el.querySelector(".hour-step-cb") || el.querySelector('input[type="checkbox"]');
      if (cb) {
        cb.checked = !!st[id];
        cb.onchange = function () {
          markHourStep(id, cb.checked);
        };
      }
      el.classList.toggle("hour-step-done", !!st[id]);
    });
    var done = 0;
    var total = 0;
    document.querySelectorAll("[data-hour-step]").forEach(function (el) {
      total++;
      var id = el.getAttribute("data-hour-step");
      if (st[id]) done++;
    });
    var prog = $("firstHourProgress");
    if (prog) prog.textContent = done + " / " + total + " steps done";
  }

  function wireFirstHour() {
    document.querySelectorAll("[data-hour-step]").forEach(function (li) {
      var id = li.getAttribute("data-hour-step");
      var go = li.querySelector(".hour-go");
      var doneBtn = li.querySelector(".hour-done");
      if (go) {
        go.addEventListener("click", function (ev) {
          ev.preventDefault();
          if (go.id === "hourGoBeginner") {
            setLevel("beginner");
            markHourStep(id, true);
            returnToFirstHour();
            return;
          }
          goHourStep(li);
        });
      }
      if (doneBtn) {
        doneBtn.addEventListener("click", function (ev) {
          ev.preventDefault();
          markHourStep(id, true);
          returnToFirstHour();
        });
      }
    });
    var back = $("hourScrollTop");
    if (back) back.addEventListener("click", returnToFirstHour);
    // Returning from network.html?from=firsthour — open checklist (dock not needed on return)
    if (typeof location !== "undefined" && /from=firsthour/.test(location.search || "")) {
      try {
        sessionStorage.removeItem(HOUR_RETURN_KEY);
      } catch (e) {
        /* ignore */
      }
      showLearnReturn(null);
      setTimeout(function () {
        var card = $("cardFirstHour");
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 120);
      try {
        if (window.history && history.replaceState) {
          history.replaceState(null, "", location.pathname + location.hash);
        }
      } catch (e2) {
        /* ignore */
      }
    } else {
      try {
        // Resume dock only if still mid-step (not when sitting on checklist)
        if (sessionStorage.getItem(HOUR_RETURN_KEY) === "1" && sessionStorage.getItem(QUIZ_RETURN_KEY) !== "1") {
          showLearnReturn("hour");
        }
      } catch (e3) {
        /* ignore */
      }
    }
    refreshFirstHour();
  }

  function quizHintFor(activeQ) {
    var st = loadJson(QUIZ_KEY, {});
    var q = activeQ || "";
    try {
      q = q || sessionStorage.getItem(QUIZ_ACTIVE_KEY) || "";
    } catch (e) {
      /* ignore */
    }
    if (q && st[q]) {
      return q.toUpperCase() + " already marked passed.";
    }
    if (q === "q1") {
      return "Q1: empty vs test must change first address. Keep trying, then Back → Mark passed.";
    }
    if (q === "q2") {
      return "Q2: one share alone must fail recombine. Keep trying, then Back → Mark passed.";
    }
    if (q === "q3") {
      return "Q3: few rolls = TOO LOW vs 128 bits. Keep trying, then Back → Mark passed.";
    }
    return "Experiment until clear, then Back → Mark passed. Leave Not yet if unsure.";
  }

  function setQuizReturn(activeQ) {
    try {
      sessionStorage.setItem(QUIZ_RETURN_KEY, "1");
      sessionStorage.removeItem(HOUR_RETURN_KEY);
      if (activeQ) sessionStorage.setItem(QUIZ_ACTIVE_KEY, activeQ);
    } catch (e) {
      /* ignore */
    }
    showLearnReturn("quiz", quizHintFor(activeQ));
  }

  function clearQuizReturn() {
    try {
      sessionStorage.removeItem(QUIZ_RETURN_KEY);
      sessionStorage.removeItem(QUIZ_ACTIVE_KEY);
    } catch (e) {
      /* ignore */
    }
    if (learnReturnMode === "quiz") showLearnReturn(null);
  }

  function showQuizBackBar(on, activeQ) {
    // Compat shim
    if (on) showLearnReturn("quiz", quizHintFor(activeQ));
    else if (learnReturnMode === "quiz") showLearnReturn(null);
  }

  function returnToQuiz() {
    clearQuizReturn();
    clearHourReturn();
    showLearnReturn(null);
    goTab("lab");
    setTimeout(function () {
      var card = $("cardQuiz");
      if (card) {
        card.setAttribute("data-level-force", "show");
        card.classList.remove("level-gated");
        card.hidden = false;
        card.scrollIntoView({ behavior: "smooth", block: "start" });
        try {
          if (!card.hasAttribute("tabindex")) card.setAttribute("tabindex", "-1");
          card.focus({ preventScroll: true });
        } catch (e) {
          /* ignore */
        }
      }
    }, 80);
  }

  function onLearnReturnClick() {
    if (learnReturnMode === "quiz") returnToQuiz();
    else returnToFirstHour();
  }

  function wireLearnReturnDock() {
    var btn = $("learnReturnBarBtn");
    if (btn) btn.addEventListener("click", onLearnReturnClick);
    var dismiss = $("learnReturnBarDismiss");
    if (dismiss)
      dismiss.addEventListener("click", function () {
        // Hide only; keep progress — user can use in-card Back buttons
        showLearnReturn(null);
      });
  }

  var EVIDENCE_KEY = "bip39lab.quizEvidence";

  function loadEvidence() {
    return loadJson(EVIDENCE_KEY, {});
  }

  function refreshQuiz() {
    var st = loadJson(QUIZ_KEY, {});
    var ev = loadEvidence();
    ["q1", "q2", "q3"].forEach(function (q) {
      var passed = !!st[q];
      var badge = $("quizBadge-" + q);
      if (badge) {
        badge.textContent = passed ? "Passed" : "Not yet";
        badge.className = "chip " + (passed ? "chip-ok" : "chip-warn");
      }
      var board = $("quizBoard-" + q);
      if (board) {
        board.textContent = passed ? "Passed" : "Not yet";
        board.className = "chip " + (passed ? "chip-ok" : "chip-warn");
      }
      var item = document.querySelector('[data-quiz="' + q + '"]');
      if (item) {
        item.classList.toggle("hour-step-done", passed);
        item.classList.toggle("quiz-item-passed", passed);
      }
      var hintPend = $("quizHint-" + q);
      var hintPass = $("quizHintPass-" + q);
      var hintReady = $("quizHintReady-" + q);
      var ready = q === "q2" && !passed && !!(ev.q2Fail && ev.q2Ok);
      if (hintPend) hintPend.hidden = passed || ready;
      if (hintPass) hintPass.hidden = !passed;
      if (hintReady) hintReady.hidden = !ready;
      var passBtn = $("quizPass-" + q);
      if (passBtn) {
        passBtn.textContent = passed
          ? "Q" + q.slice(1) + " passed ✓"
          : ready
            ? "Mark Q" + q.slice(1) + " passed (demo ready)"
            : "Mark Q" + q.slice(1) + " passed";
        passBtn.disabled = passed;
        passBtn.setAttribute("aria-disabled", passed ? "true" : "false");
      }
    });
    var n = (st.q1 ? 1 : 0) + (st.q2 ? 1 : 0) + (st.q3 ? 1 : 0);
    var sum = $("quizSummary");
    if (sum) {
      sum.textContent = n + " / 3 passed";
      sum.className = "chip " + (n === 3 ? "chip-ok" : n > 0 ? "chip-warn" : "");
    }
  }

  function resetFirstHour() {
    saveJson(HOUR_KEY, {});
    try {
      sessionStorage.removeItem(HOUR_RETURN_KEY);
    } catch (e) {
      /* ignore */
    }
    showLearnReturn(null);
    refreshFirstHour();
  }

  function resetQuiz() {
    saveJson(QUIZ_KEY, {});
    saveJson(EVIDENCE_KEY, {});
    try {
      sessionStorage.removeItem(QUIZ_RETURN_KEY);
      sessionStorage.removeItem(QUIZ_ACTIVE_KEY);
    } catch (e) {
      /* ignore */
    }
    showLearnReturn(null);
    refreshQuiz();
  }

  function resetClassroomProgress() {
    if (
      !window.confirm(
        "Reset first-hour checklist, quiz answers, demo evidence, and tour step in this browser?"
      )
    ) {
      return;
    }
    resetFirstHour();
    resetQuiz();
    saveJson(TOUR_KEY, { i: 0 });
    var box = $("tourBox");
    if (box) box.hidden = true;
    var toast = $("learnLevelToast");
    if (toast) {
      toast.textContent = "Progress reset (checklist + quiz + tour). Level unchanged.";
      toast.hidden = false;
      clearTimeout(showLevelToast._t);
      showLevelToast._t = setTimeout(function () {
        toast.hidden = true;
      }, 5000);
    }
  }

  function markQuiz(q) {
    var st = loadJson(QUIZ_KEY, {});
    st[q] = true;
    saveJson(QUIZ_KEY, st);
    refreshQuiz();
    returnToQuiz();
  }

  function goQuizDemo(q) {
    setQuizReturn(q);
    // Ensure quiz card level is beginner so user can return
    if (LEVELS.indexOf(getLevel()) < LEVELS.indexOf("beginner")) {
      setLevel("beginner");
    }
    if (q === "q1") {
      goTab("tools");
      setTimeout(function () {
        var t = $("cardCmpPp");
        if (t) {
          t.scrollIntoView({ behavior: "smooth", block: "start" });
          try {
            if (!t.hasAttribute("tabindex")) t.setAttribute("tabindex", "-1");
            t.focus({ preventScroll: true });
          } catch (e) {
            /* ignore */
          }
        }
      }, 100);
      return;
    }
    if (q === "q2") {
      try {
        sessionStorage.setItem(QUIZ_RETURN_KEY, "1");
        sessionStorage.setItem(QUIZ_ACTIVE_KEY, "q2");
      } catch (e) {
        /* ignore */
      }
      window.location.href = "shamir.html?from=quiz#shCardRecombine";
      return;
    }
    if (q === "q3") {
      goTab("tools");
      setTimeout(function () {
        var t = $("cardEntPad");
        if (t) {
          t.setAttribute("data-level-force", "show");
          t.classList.remove("level-gated");
          t.hidden = false;
          t.scrollIntoView({ behavior: "smooth", block: "start" });
          try {
            if (!t.hasAttribute("tabindex")) t.setAttribute("tabindex", "-1");
            t.focus({ preventScroll: true });
          } catch (e) {
            /* ignore */
          }
        }
      }, 100);
    }
  }

  function goTab(name) {
    if (typeof window.__bip39ShowTab === "function") window.__bip39ShowTab(name);
  }

  function wireQuiz() {
    document.querySelectorAll("[data-quiz-go]").forEach(function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        goQuizDemo(btn.getAttribute("data-quiz-go"));
      });
    });
    // Keep legacy ids wired too (same buttons)
    ["q1", "q2", "q3"].forEach(function (q) {
      var b = $("quizPass-" + q);
      if (b)
        b.addEventListener("click", function (ev) {
          ev.preventDefault();
          markQuiz(q);
        });
    });
    // Per-item “Back to quiz” removed — amber dock + Go try return handle navigation
    if (typeof location !== "undefined" && /from=quiz/.test(location.search || "")) {
      try {
        sessionStorage.removeItem(QUIZ_RETURN_KEY);
      } catch (e2) {
        /* ignore */
      }
      showLearnReturn(null);
      setTimeout(function () {
        returnToQuiz();
      }, 60);
      try {
        if (window.history && history.replaceState) {
          history.replaceState(null, "", location.pathname + location.hash);
        }
      } catch (e3) {
        /* ignore */
      }
    } else {
      try {
        if (sessionStorage.getItem(QUIZ_RETURN_KEY) === "1") {
          showLearnReturn("quiz", quizHintFor(sessionStorage.getItem(QUIZ_ACTIVE_KEY)));
        }
      } catch (e) {
        /* ignore */
      }
    }
    refreshQuiz();
  }

  function wire() {
    var sel = $("learnLevel");
    if (sel) {
      sel.addEventListener("change", function () {
        setLevel(sel.value, { announce: true });
      });
    }
    document.querySelectorAll("[data-level-set]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lvl = btn.getAttribute("data-level-set");
        setLevel(lvl);
        // Footer “I’m ready for Beginner” completes first-hour step 8
        if (lvl === "beginner") markHourStep("h8", true);
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

    wireQuiz();

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

    wireLearnReturnDock();
    wireFirstHour();
    var rH = $("btnResetFirstHour");
    if (rH)
      rH.addEventListener("click", function () {
        if (window.confirm("Clear all first-hour checklist ticks in this browser?")) resetFirstHour();
      });
    var rQ = $("btnResetQuiz");
    if (rQ)
      rQ.addEventListener("click", function () {
        if (window.confirm("Clear all quiz pass marks and Shamir demo evidence in this browser?"))
          resetQuiz();
      });
    var rC = $("btnResetClassroom");
    if (rC) rC.addEventListener("click", resetClassroomProgress);
    applyLevel(getLevel(), { announce: false });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }

  window.LearnLevels = { getLevel: getLevel, setLevel: setLevel, applyLevel: applyLevel };
})();
