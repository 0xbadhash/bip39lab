/**
 * Leveled classroom: E0 orientation/first-hour, E1 levels, E2 quiz, E4 tour, E5 BIP-85 hook, E6 ops.
 * No secrets; localStorage only for prefs/progress.
 */
(function () {
  "use strict";

  var LEVEL_KEY = "bip39lab.level";
  var HOUR_KEY = "bip39lab.firstHour";
  var QUIZ_KEY = "bip39lab.quiz";
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
      "Starter: orientation + First hour checklist. Quiz stays dimmed until you raise Level.",
    beginner:
      "Beginner: Guided quiz is open (Q1–Q4). Do that next, then raise Level to Intermediate for I1–I4.",
    intermediate:
      "Intermediate: I1–I4 self-check (keys vs shares vs words + PSBT inspect). Next: Advanced.",
    advanced:
      "Advanced: BIP-85 + Ops + A1–A4 self-check (watch-only, Knots limits, is-not).",
  };

  var LEVEL_UNLOCKS = {
    starter: "Orientation + First hour",
    beginner: "Guided quiz (Q1–Q4)",
    intermediate: "I1–I4 three splits + inspect-only",
    advanced: "BIP-85 · Ops · A1–A4 ops mind",
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
      ". Soft gates only — not a wallet lock.";
    if (prev && prev !== level) {
      var pi = LEVELS.indexOf(prev);
      var ni = LEVELS.indexOf(level);
      if (ni > pi) {
        if (level === "beginner") {
          msg =
            "Beginner unlocked: Guided quiz is next. Scroll to the green “what’s next” box or open the quiz below.";
        } else if (level === "intermediate") {
          msg = "Intermediate unlocked: I1–I4 self-check (keys vs shares vs words + PSBT).";
        } else if (level === "advanced") {
          msg = "Advanced unlocked: BIP-85, Ops, and A1–A4 self-check are open.";
        } else {
          msg = "Unlocked for " + level + ": " + (LEVEL_UNLOCKS[level] || "") + ".";
        }
      } else if (ni < pi) msg = "Level lowered to " + level + ". Higher cards dim again (soft gate).";
    }
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(showLevelToast._t);
    showLevelToast._t = setTimeout(function () {
      toast.hidden = true;
    }, 9000);
  }

  function updateFirstHourNext() {
    var box = $("firstHourNext");
    if (!box) return;
    var level = getLevel();
    var hour = loadJson(HOUR_KEY, {});
    // Show path after user reaches Beginner (especially after first-hour step 8)
    var show = LEVELS.indexOf(level) >= LEVELS.indexOf("beginner");
    box.hidden = !show;
  }

  function graduateToBeginner() {
    setLevel("beginner", { announce: true });
    markHourStep("h8", true);
    updateFirstHourNext();
    setTimeout(function () {
      var next = $("firstHourNext");
      var quiz = $("cardQuiz");
      if (next) {
        next.hidden = false;
        next.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else if (quiz) {
        quiz.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  }

  /** h1–h6 apply; h7 is optional. No extra Set Beginner click. */
  function maybeAutoBeginner() {
    if (getLevel() !== "starter") return;
    var st = loadJson(HOUR_KEY, {});
    if (st.h1 && st.h2 && st.h3 && st.h4 && st.h5 && st.h6) {
      graduateToBeginner();
    }
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
    updateFirstHourNext();
    refreshBeginnerChrome();
    if (opts.announce && prev !== level) {
      showLevelToast(level, prev);
      // For beginner, prefer the “what’s next” box over a random unlocked card jump
      if (level === "beginner") {
        setTimeout(function () {
          var next = $("firstHourNext");
          if (next && !next.hidden) next.scrollIntoView({ behavior: "smooth", block: "nearest" });
          else if (firstUnlocked) firstUnlocked.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 120);
      } else if (level === "intermediate") {
        setTimeout(function () {
          var t = $("cardIntQuiz");
          if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      } else if (firstUnlocked) {
        setTimeout(function () {
          firstUnlocked.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 120);
      }
    }
  }

  var HOUR_RETURN_KEY = "bip39lab.hourReturn";
  var HOUR_ACTIVE_KEY = "bip39lab.hourActive";
  var HOUR_EVIDENCE_KEY = "bip39lab.hourEvidence";
  var QUIZ_RETURN_KEY = "bip39lab.quizReturn";
  var QUIZ_ACTIVE_KEY = "bip39lab.quizActive";
  var INT_QUIZ_KEY = "bip39lab.intQuiz";
  var ADV_QUIZ_KEY = "bip39lab.advQuiz";
  /** @type {"hour"|"quiz"|"intquiz"|"advquiz"|null} */
  var learnReturnMode = null;

  /**
   * Lab index only (`/` or index.html). On Multisig/Shamir/Network/SLIP-39,
   * ?from=intquiz|quiz|firsthour means “demo visit” — those pages own the dock.
   * Lab-index handlers must not strip the query before page apps run (S70).
   */
  function isLabIndexPage() {
    try {
      var base = (location.pathname || "").split("/").pop() || "";
      return base === "" || base === "index.html";
    } catch (eP) {
      return true;
    }
  }

  /** Truthy quiz-return markers: legacy "1" + mode strings used after I/A paths. */
  function isQuizReturnValue(v) {
    return v === "1" || v === "quiz" || v === "intquiz" || v === "advquiz";
  }

  function setBodyReturnOpen(on) {
    try {
      document.body.classList.toggle("learn-return-open", !!on);
    } catch (e) {
      /* ignore */
    }
  }

  /**
   * One floating dock only — never stack hour + quiz sticky bars over content.
   * mode: "hour" | "quiz" | "intquiz" | "advquiz" | null (hide)
   */
  function loadHourEvidence() {
    try {
      var raw = sessionStorage.getItem(HOUR_EVIDENCE_KEY);
      if (!raw) return {};
      var ev = JSON.parse(raw);
      return ev && typeof ev === "object" ? ev : {};
    } catch (e) {
      return {};
    }
  }

  function saveHourEvidence(ev) {
    try {
      sessionStorage.setItem(HOUR_EVIDENCE_KEY, JSON.stringify(ev || {}));
    } catch (e) {
      /* ignore */
    }
  }

  function getHourActive() {
    try {
      return sessionStorage.getItem(HOUR_ACTIVE_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function setHourActive(id) {
    try {
      if (id) sessionStorage.setItem(HOUR_ACTIVE_KEY, id);
      else sessionStorage.removeItem(HOUR_ACTIVE_KEY);
    } catch (e) {
      /* ignore */
    }
  }

  function addressesFilled() {
    var body = $("addrTableBody");
    if (!body) return false;
    var rows = body.querySelectorAll("tr:not(.empty-row)");
    return rows.length >= 1;
  }

  function scrollPageToEl(el) {
    if (!el) return;
    try {
      var top = el.getBoundingClientRect().top + (window.pageYOffset || 0) - 8;
      window.scrollTo(0, Math.max(0, top));
    } catch (e) {
      try {
        el.scrollIntoView({ behavior: "auto", block: "start" });
      } catch (e2) {
        /* ignore */
      }
    }
  }

  function scrollToReceiveHeading() {
    if (typeof window.__bip39ShowTab === "function") window.__bip39ShowTab("lab");
    var head = $("headingReceive") || $("card-addresses");
    scrollPageToEl(head);
    try {
      var ops = $("cardOps");
      if (head && ops) {
        var ht = head.getBoundingClientRect().top;
        var ot = ops.getBoundingClientRect().top;
        if (Math.abs(ot) < 120 && ht > 80) scrollPageToEl(head);
      }
    } catch (e3) {
      /* ignore */
    }
  }

  function refreshBeginnerChrome() {
    var risen = LEVELS.indexOf(getLevel()) >= LEVELS.indexOf("beginner");
    var h8 = document.querySelector('[data-hour-step="h8"]');
    if (h8) h8.hidden = risen;
    ["hourGoBeginner", "btnReadyBeginner", "quizHourNextBeginner"].forEach(function (id) {
      var el = $(id);
      if (el) el.hidden = risen;
    });
  }

  function quizPassedCount() {
    var st = loadJson(QUIZ_KEY, {});
    return (st.q1 ? 1 : 0) + (st.q2 ? 1 : 0) + (st.q3 ? 1 : 0) + (st.q4 ? 1 : 0);
  }

  function hourStepReady(id) {
    var ev = loadHourEvidence();
    if (id === "h1") return !!ev.h1SeenOrientation;
    if (id === "h2") return !!ev.h2Generated;
    if (id === "h3") return !!ev.h3Derived || addressesFilled();
    if (id === "h4") {
      return !!(ev.h4Purpose && ev.h4Coin && ev.h4Account && ev.h4Change && ev.h4Index);
    }
    if (id === "h5") return !!ev.h5ComparedDiff;
    if (id === "h6") {
      var q = loadJson(QUIZ_KEY, {});
      return !!(q.q1 && q.q2 && q.q3 && q.q4);
    }
    if (id === "h7") return !!(ev.h7Ack && ev.h7Loaded && ev.h7Fetched);
    if (id === "h8") return false;
    return false;
  }

  function hourNeedCopy(id) {
    var ready = hourStepReady(id);
    var n = quizPassedCount();
    if (id === "h1") {
      return ready
        ? "You saw the table. Mark done to check step 1 and return."
        : "Read the air-gap note and the What this is / isn’t table. Mark done turns on after that table is on screen.";
    }
    if (id === "h2") {
      return ready
        ? "Practice phrase generated. Mark done to check step 2 and return."
        : "Press Generate for a practice phrase (not funded). Mark done stays off until Generate succeeds.";
    }
    if (id === "h3") {
      if (!ready) {
        return "Press Validate & derive so addresses fill. Then we will take you to Receive addresses.";
      }
      return "Addresses are filled. Mark done to check step 3 and return.";
    }
    if (id === "h4") {
      return ready
        ? "You used purpose / coin / account / change / index. Mark done to check step 4 and return."
        : "In Path playground, use purpose, coin, account, change, and index (Lab path controls). Mark done stays off until all five have been used.";
    }
    if (id === "h5") {
      return ready
        ? "Empty vs test produced different addresses. Mark done to check step 5 and return."
        : "Compare empty vs test. Mark done stays off until the two sides show different addresses.";
    }
    if (id === "h6") {
      if (n < 4) {
        return "Mark Q1–Q4 Passed when each idea is clear (" + n + " / 4). Step 6 checks itself at 4/4.";
      }
      return "Guided quiz 4/4 Passed. Next: 7 Network (optional) — fees and leak-ack — then 8 Raise to Beginner.";
    }
    if (id === "h7") {
      var ev7 = loadHourEvidence();
      if (ev7.h7Ack) {
        return "Leak-ack accepted. Mark done to check step 7 and return to the checklist.";
      }
      return "Tick leak-ack, load addresses, then fetch info. Mark done stays off until that flow is done.";
    }
    if (id === "h8") {
      return "Level raises on its own when the First Hour steps that apply are done.";
    }
    return "";
  }

  function snapshotH4IfNeeded() {
    var ev = loadHourEvidence();
    if (ev.h4Snap) return;
    ev.h4Snap = {
      network: ($("deriveNetwork") && $("deriveNetwork").value) || "",
      account: ($("deriveAccount") && $("deriveAccount").value) || "",
      change: ($("deriveChange") && $("deriveChange").value) || "",
      count: ($("deriveCount") && $("deriveCount").value) || "",
    };
    saveHourEvidence(ev);
  }

  function noteHour(key, val) {
    if (val === undefined) val = true;
    var ev = loadHourEvidence();
    ev[key] = val;
    saveHourEvidence(ev);
    refreshHourGates();
    if (key === "h3Derived" && getHourActive() === "h3" && addressesFilled()) {
      scrollToReceiveHeading();
    }
    return ev;
  }

  function watchOrientationTable() {
    var table = $("orientationTable");
    if (!table || typeof IntersectionObserver === "undefined") {
      if (table) noteHour("h1SeenOrientation", true);
      return;
    }
    try {
      var io = new IntersectionObserver(
        function (ents) {
          for (var i = 0; i < ents.length; i++) {
            if (ents[i].isIntersecting && ents[i].intersectionRatio > 0) {
              noteHour("h1SeenOrientation", true);
              try {
                io.disconnect();
              } catch (eD) {
                /* ignore */
              }
              break;
            }
          }
        },
        { threshold: [0.01, 0.2] }
      );
      io.observe(table);
    } catch (e) {
      noteHour("h1SeenOrientation", true);
    }
  }

  function setHourMarkEnabled(btn, on) {
    if (!btn) return;
    btn.disabled = !on;
    btn.setAttribute("aria-disabled", on ? "false" : "true");
  }

  function refreshHourGates() {
    var active = getHourActive();
    document.querySelectorAll("[data-hour-step]").forEach(function (el) {
      var id = el.getAttribute("data-hour-step");
      var ready = hourStepReady(id);
      var doneBtn = el.querySelector(".hour-done");
      var cb = el.querySelector(".hour-step-cb") || el.querySelector('input[type="checkbox"]');
      if (cb) {
        cb.disabled = true;
        cb.setAttribute("aria-disabled", "true");
        cb.onchange = null;
      }
      if (doneBtn) {
        if (id === "h6") {
          doneBtn.hidden = true;
          doneBtn.disabled = true;
        } else {
          doneBtn.hidden = false;
          setHourMarkEnabled(doneBtn, ready && id !== "h8");
        }
      }
    });
    var dockMark = $("btnHourMarkFromDock");
    if (dockMark) {
      var showDockMark = /^(h1|h2|h3|h4|h5|h7)$/.test(active);
      dockMark.hidden = !showDockMark;
      setHourMarkEnabled(dockMark, showDockMark && hourStepReady(active));
    }
    var hintEl = $("learnReturnBarHint");
    if (hintEl && learnReturnMode === "hour") {
      hintEl.textContent = hourNeedCopy(active) || "";
    }
    var qn = $("quizHourNext");
    if (qn) qn.hidden = quizPassedCount() < 4;
    var netMark = $("btnHourMarkFromDockNet");
    if (netMark) {
      var ev = loadHourEvidence();
      netMark.hidden = false;
      setHourMarkEnabled(netMark, hourStepReady("h7"));
      var netHint = $("learnReturnDockNetHint");
      if (netHint) netHint.textContent = hourNeedCopy("h7");
    }
  }

  function hideAllQuizMarkBtns() {
    ["btnMarkQ1FromTools", "btnMarkQ3FromEnt", "btnMarkQ4FromEnt", "btnMarkPathFromDock"].forEach(
      function (id) {
        var el = $(id);
        if (el) el.hidden = true;
      }
    );
  }

  function updateQuizMarkButtonsOnDock() {
    var st = loadJson(QUIZ_KEY, {});
    var active = "";
    try {
      active = sessionStorage.getItem(QUIZ_ACTIVE_KEY) || "";
    } catch (e) {
      active = "";
    }
    var m1 = $("btnMarkQ1FromTools");
    var m3 = $("btnMarkQ3FromEnt");
    var m4 = $("btnMarkQ4FromEnt");
    // Q1: always offer mark while Q1 is the active demo and not yet passed
    if (m1) m1.hidden = !(active === "q1" && !st.q1);
    // Q3/Q4: controlled by entropy pad (app.js) — only hide here if wrong active quiz
    if (m3 && active && active !== "q3" && active !== "q4") m3.hidden = true;
    if (m4 && active && active !== "q3" && active !== "q4") m4.hidden = true;
    // Path quizzes (I4, A1–A4) use btnMarkPathFromDock when active
    updatePathQuizMarkOnDock(active);
  }

  function updatePathQuizMarkOnDock(activeOpt) {
    var btn = $("btnMarkPathFromDock");
    if (!btn) return;
    var active = activeOpt || "";
    try {
      active = active || sessionStorage.getItem(QUIZ_ACTIVE_KEY) || "";
    } catch (e) {
      /* ignore */
    }
    var mode = learnReturnMode;
    try {
      if (!mode) {
        var ret = sessionStorage.getItem(QUIZ_RETURN_KEY) || "";
        if (ret === "intquiz") mode = "intquiz";
        else if (ret === "advquiz") mode = "advquiz";
      }
    } catch (e2) {
      /* ignore */
    }
    var isPath = /^i[1-4]$/.test(active) || /^a[1-4]$/.test(active);
    // I1–I3 are marked on external pages; Lab dock is for I4 + A1–A4
    var onLabPath =
      active === "i4" || active === "a1" || active === "a2" || active === "a3" || active === "a4";
    if (!isPath || !onLabPath || (mode !== "intquiz" && mode !== "advquiz")) {
      btn.hidden = true;
      return;
    }
    var st = loadJson(quizStorageFor(active), {});
    if (st[active]) {
      btn.hidden = true;
      return;
    }
    btn.hidden = false;
    btn.textContent = "Mark " + labelForQuizId(active) + " passed & return";
  }

  function returnBtnLabel(mode) {
    if (mode === "quiz") return "← Back to Guided quiz";
    if (mode === "intquiz") return "← Back to Intermediate quiz";
    if (mode === "advquiz") return "← Back to Advanced quiz";
    return "← Back to First hour";
  }

  function returnDefaultHint(mode) {
    if (mode === "quiz") return "Experiment, then mark passed only when clear.";
    if (mode === "intquiz") return "Keys ≠ shares ≠ share-words. Mark when clear.";
    if (mode === "advquiz") return "Ops mind offline. Mark when clear.";
    return hourNeedCopy(getHourActive()) || "Read the next First Hour step, then press Go.";
  }

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
      hideAllQuizMarkBtns();
      return;
    }
    learnReturnMode = mode;
    bar.hidden = false;
    bar.setAttribute("data-return-mode", mode);
    setBodyReturnOpen(true);
    if (btn) btn.textContent = returnBtnLabel(mode);
    if (hintEl) {
      hintEl.textContent =
        hint ||
        (mode === "hour" ? hourNeedCopy(getHourActive()) : returnDefaultHint(mode));
    }
    if (mode === "quiz") updateQuizMarkButtonsOnDock();
    else if (mode === "intquiz" || mode === "advquiz") {
      hideAllQuizMarkBtns();
      updatePathQuizMarkOnDock();
    } else hideAllQuizMarkBtns();
    if (mode === "hour") refreshHourGates();
    else {
      var hm = $("btnHourMarkFromDock");
      if (hm) hm.hidden = true;
    }
  }

  function markQuizFromDock(q) {
    markQuiz(q);
  }

  // Used by entropy pad (app.js) so dock stays single bottom chrome
  window.LearnReturnDock = {
    showQuiz: function (hint) {
      showLearnReturn("quiz", hint || "");
    },
    hideMarkButtons: function () {
      var m3 = $("btnMarkQ3FromEnt");
      var m4 = $("btnMarkQ4FromEnt");
      if (m3) m3.hidden = true;
      if (m4) m4.hidden = true;
    },
  };

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
    if (done) {
      if (id === "h6") return;
      if (id !== "h8" && !hourStepReady(id)) return;
    }
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
    var stepId = li.getAttribute("data-hour-step") || "";
    var needLevel = li.querySelector(".hour-go") && li.querySelector(".hour-go").getAttribute("data-hour-level");
    if (needLevel) setLevel(needLevel);
    setHourActive(stepId);
    if (stepId === "h4") snapshotH4IfNeeded();
    setHourReturn();
    if (stepId === "h3" && !addressesFilled()) {
      goTab("lab");
      setTimeout(function () {
        var btn = $("btnDerive");
        scrollPageToEl(btn);
        try {
          if (btn) btn.focus({ preventScroll: true });
        } catch (eF) {
          /* ignore */
        }
        refreshHourGates();
      }, 80);
      return;
    }
    if (stepId === "h3" && addressesFilled()) {
      goTab("lab");
      setTimeout(function () {
        scrollToReceiveHeading();
        refreshHourGates();
      }, 80);
      return;
    }
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
        cb.disabled = true;
        cb.setAttribute("aria-disabled", "true");
        cb.onchange = null;
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
    refreshHourGates();
    refreshBeginnerChrome();
    maybeAutoBeginner();
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
            graduateToBeginner();
            return;
          }
          goHourStep(li);
        });
      }
      if (doneBtn) {
        doneBtn.addEventListener("click", function (ev) {
          ev.preventDefault();
          // Step 8 has no Mark done — only Set Beginner
          if (id === "h8") {
            graduateToBeginner();
            return;
          }
          markHourStep(id, true);
          if (hourStepReady(id) || id === "h8") returnToFirstHour();
        });
      }
    });
    var back = $("hourScrollTop");
    if (back) back.addEventListener("click", returnToFirstHour);
    var nextQuiz = $("btnNextGoQuiz");
    if (nextQuiz)
      nextQuiz.addEventListener("click", function () {
        if (LEVELS.indexOf(getLevel()) < LEVELS.indexOf("beginner")) setLevel("beginner", { announce: false });
        goTab("lab");
        setTimeout(function () {
          var q = $("cardQuiz");
          if (q) {
            q.setAttribute("data-level-force", "show");
            q.classList.remove("level-gated");
            q.hidden = false;
            q.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 80);
      });
    var nextInt = $("btnNextGoIntermediate");
    if (nextInt)
      nextInt.addEventListener("click", function () {
        setLevel("intermediate", { announce: true });
        setTimeout(function () {
          var t = $("cardIntQuiz");
          if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      });
    // Returning to Lab from network.html?from=firsthour — open checklist
    // (only on Lab index; Network page uses its own dock)
    if (
      typeof location !== "undefined" &&
      isLabIndexPage() &&
      /from=firsthour/.test(location.search || "")
    ) {
      var hourSt = loadJson(HOUR_KEY, {});
      var act = getHourActive();
      if (act === "h7" && !hourSt.h7) {
        setHourReturn();
        showLearnReturn("hour");
      } else {
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
      }
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
        // Any quiz-return marker (legacy "1" or quiz|intquiz|advquiz) suppresses hour dock
        if (
          sessionStorage.getItem(HOUR_RETURN_KEY) === "1" &&
          !isQuizReturnValue(sessionStorage.getItem(QUIZ_RETURN_KEY))
        ) {
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
      return "Q1: empty vs test must change first address. When clear, use Mark Q1 passed & return (bottom bar).";
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
      sessionStorage.setItem(QUIZ_RETURN_KEY, "quiz");
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
    if (LEVELS.indexOf(getLevel()) < LEVELS.indexOf("beginner")) {
      setLevel("beginner", { announce: false });
    }
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
      refreshQuiz();
    }, 80);
  }

  function onLearnReturnClick() {
    if (learnReturnMode === "quiz") returnToQuiz();
    else if (learnReturnMode === "intquiz") returnToIntQuiz();
    else if (learnReturnMode === "advquiz") returnToAdvQuiz();
    else returnToFirstHour();
  }

  function wireLearnReturnDock() {
    // Pin dock to <body> so position:fixed is always viewport-bottom (never mid-page)
    var bar = $("learnReturnBar");
    if (bar && bar.parentNode !== document.body) {
      try {
        document.body.appendChild(bar);
      } catch (e) {
        /* ignore */
      }
    }
    var btn = $("learnReturnBarBtn");
    if (btn) btn.addEventListener("click", onLearnReturnClick);
    var dismiss = $("learnReturnBarDismiss");
    if (dismiss)
      dismiss.addEventListener("click", function () {
        // Hide only; keep progress — user can use in-card Back buttons
        showLearnReturn(null);
      });
    // Event delegation: survives re-parenting / late DOM moves
    document.body.addEventListener("click", function (ev) {
      var t = ev.target && ev.target.closest ? ev.target.closest("button") : null;
      if (!t || !t.id) return;
      if (t.id === "btnMarkQ1FromTools") {
        ev.preventDefault();
        markQuiz("q1");
      } else if (t.id === "btnMarkQ3FromEnt") {
        ev.preventDefault();
        markQuiz("q3");
      } else if (t.id === "btnMarkQ4FromEnt") {
        ev.preventDefault();
        markQuiz("q4");
      } else if (t.id === "btnMarkPathFromDock") {
        ev.preventDefault();
        var act = "";
        try {
          act = sessionStorage.getItem(QUIZ_ACTIVE_KEY) || "";
        } catch (eA) {
          act = "";
        }
        if (/^i[1-4]$/.test(act) || /^a[1-4]$/.test(act)) markPathQuiz(act);
      } else if (t.id === "btnHourMarkFromDock" || t.id === "btnHourMarkFromDockNet") {
        ev.preventDefault();
        var hid = getHourActive() || "h7";
        if (t.id === "btnHourMarkFromDockNet") hid = "h7";
        if (hid === "h7") noteHour("h7Ack", true);
        markHourStep(hid, true);
        if (t.id === "btnHourMarkFromDockNet") {
          window.location.href = "index.html?from=firsthour";
        } else if (hourStepReady(hid) || (hid === "h7" && loadJson(HOUR_KEY, {}).h7)) {
          returnToFirstHour();
        }
      }
    });
    var qNet = $("quizHourNextNet");
    if (qNet) {
      qNet.addEventListener("click", function () {
        var li = document.querySelector('[data-hour-step="h7"]');
        if (li) goHourStep(li);
      });
    }
    var qBeg = $("quizHourNextBeginner");
    if (qBeg) {
      qBeg.addEventListener("click", function () {
        var h8 = $("hourGoBeginner") || $("btnReadyBeginner");
        if (h8) h8.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  }

  var EVIDENCE_KEY = "bip39lab.quizEvidence";

  function loadEvidence() {
    return loadJson(EVIDENCE_KEY, {});
  }

  function refreshQuiz() {
    var st = loadJson(QUIZ_KEY, {});
    var ev = loadEvidence();
    ["q1", "q2", "q3", "q4"].forEach(function (q) {
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
      var ready = false;
      if (q === "q1" && !passed && !!ev.q1Diff) ready = true;
      if (q === "q2" && !passed && !!(ev.q2Fail && ev.q2Ok)) ready = true;
      if (q === "q3" && !passed && !!ev.q3Low) ready = true;
      if (q === "q4" && !passed && !!ev.q4Enough) ready = true;
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
        if (ready && !passed) {
          passBtn.classList.remove("secondary");
          passBtn.classList.add("btn");
        }
      }
    });
    var n = (st.q1 ? 1 : 0) + (st.q2 ? 1 : 0) + (st.q3 ? 1 : 0) + (st.q4 ? 1 : 0);
    var sum = $("quizSummary");
    if (sum) {
      sum.textContent = n + " / 4 passed";
      sum.className = "chip " + (n === 4 ? "chip-ok" : n > 0 ? "chip-warn" : "");
    }
    // First-hour step 6 tracks the quiz self-checks
    syncHourQuizStep(n === 4);
    var qn = $("quizHourNext");
    if (qn) qn.hidden = n < 4;
    if (n === 4 && getHourActive() === "h6") refreshHourGates();
    maybeAutoBeginner();
  }

  function syncHourQuizStep(allPassed) {
    var st = loadJson(HOUR_KEY, {});
    var was = !!st.h6;
    if (allPassed && !was) {
      st.h6 = true;
      saveJson(HOUR_KEY, st);
      refreshFirstHour();
      maybeAutoBeginner();
      return;
    }
    if (!allPassed && was) {
      // Keep h6 only while all four quiz items remain passed
      st.h6 = false;
      saveJson(HOUR_KEY, st);
      refreshFirstHour();
      return;
    }
    // Ensure checkbox UI matches even if already stored
    if (allPassed) {
      var li = document.querySelector('[data-hour-step="h6"]');
      var cb = li && (li.querySelector(".hour-step-cb") || li.querySelector('input[type="checkbox"]'));
      if (cb && !cb.checked) {
        cb.checked = true;
        if (li) li.classList.add("hour-step-done");
      }
    }
  }

  function resetFirstHour() {
    saveJson(HOUR_KEY, {});
    try {
      sessionStorage.removeItem(HOUR_RETURN_KEY);
      sessionStorage.removeItem(HOUR_ACTIVE_KEY);
      sessionStorage.removeItem(HOUR_EVIDENCE_KEY);
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
        "Reset first-hour checklist, quiz answers (incl. Intermediate/Advanced), and demo evidence in this browser?"
      )
    ) {
      return;
    }
    resetFirstHour();
    resetQuiz();
    resetIntQuiz();
    resetAdvQuiz();
    var toast = $("learnLevelToast");
    if (toast) {
      toast.textContent = "Progress reset (checklist + quizzes). Level unchanged.";
      toast.hidden = false;
      clearTimeout(showLevelToast._t);
      showLevelToast._t = setTimeout(function () {
        toast.hidden = true;
      }, 5000);
    }
  }

  function markQuiz(q) {
    if (!q) return;
    var st = loadJson(QUIZ_KEY, {});
    st[q] = true;
    saveJson(QUIZ_KEY, st);
    // Sync first-hour step 6 when all four done
    if (st.q1 && st.q2 && st.q3 && st.q4) {
      var hour = loadJson(HOUR_KEY, {});
      hour.h6 = true;
      saveJson(HOUR_KEY, hour);
    }
    try {
      sessionStorage.removeItem(QUIZ_RETURN_KEY);
      sessionStorage.removeItem(QUIZ_ACTIVE_KEY);
    } catch (e) {
      /* ignore */
    }
    hideAllQuizMarkBtns();
    showLearnReturn(null);
    refreshQuiz();
    refreshFirstHour();
    returnToQuiz();
  }

  /** Public: mark quiz item passed and jump back to quiz card (used by entropy dock). */
  function passQuiz(q) {
    markQuiz(q);
  }

  function quizStorageFor(id) {
    if (/^i[1-4]$/.test(id)) return INT_QUIZ_KEY;
    if (/^a[1-4]$/.test(id)) return ADV_QUIZ_KEY;
    return QUIZ_KEY;
  }

  function returnModeFor(id) {
    if (/^i[1-4]$/.test(id)) return "intquiz";
    if (/^a[1-4]$/.test(id)) return "advquiz";
    return "quiz";
  }

  function returnCardIdFor(id) {
    if (/^i[1-4]$/.test(id)) return "cardIntQuiz";
    if (/^a[1-4]$/.test(id)) return "cardAdvQuiz";
    return "cardQuiz";
  }

  function minLevelForQuiz(id) {
    if (/^i[1-4]$/.test(id)) return "intermediate";
    if (/^a[1-4]$/.test(id)) return "advanced";
    return "beginner";
  }

  function labelForQuizId(id) {
    if (!id) return "";
    return id.charAt(0).toUpperCase() + id.slice(1);
  }

  function refreshPathQuiz(ids, storageKey, summaryId, nextId) {
    var st = loadJson(storageKey, {});
    ids.forEach(function (q) {
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
      if (hintPend) hintPend.hidden = passed;
      if (hintPass) hintPass.hidden = !passed;
      var passBtn = $("quizPass-" + q);
      if (passBtn) {
        passBtn.textContent = passed
          ? labelForQuizId(q) + " passed ✓"
          : "Mark " + labelForQuizId(q) + " passed";
        passBtn.disabled = passed;
        passBtn.setAttribute("aria-disabled", passed ? "true" : "false");
      }
    });
    var n = 0;
    ids.forEach(function (q) {
      if (st[q]) n++;
    });
    var sum = $(summaryId);
    if (sum) {
      sum.textContent = n + " / 4 passed";
      sum.className = "chip " + (n === 4 ? "chip-ok" : n > 0 ? "chip-warn" : "");
    }
    if (nextId) {
      var next = $(nextId);
      if (next) next.hidden = n !== 4;
    }
  }

  function refreshIntQuiz() {
    refreshPathQuiz(["i1", "i2", "i3", "i4"], INT_QUIZ_KEY, "intQuizSummary", "intQuizNext");
  }

  function refreshAdvQuiz() {
    refreshPathQuiz(["a1", "a2", "a3", "a4"], ADV_QUIZ_KEY, "advQuizSummary", null);
  }

  function setPathQuizReturn(activeQ) {
    var mode = returnModeFor(activeQ);
    try {
      sessionStorage.setItem(QUIZ_RETURN_KEY, mode);
      sessionStorage.removeItem(HOUR_RETURN_KEY);
      if (activeQ) sessionStorage.setItem(QUIZ_ACTIVE_KEY, activeQ);
    } catch (e) {
      /* ignore */
    }
    showLearnReturn(mode, pathQuizHint(activeQ));
  }

  function pathQuizHint(activeQ) {
    var st = loadJson(quizStorageFor(activeQ), {});
    if (activeQ && st[activeQ]) {
      return labelForQuizId(activeQ) + " already marked passed.";
    }
    var hints = {
      i1: "I1: Multisig = keys (not shares). Read Multisig, then Mark I1.",
      i2: "I2: Shamir = hex shares (not BIP-39 words).",
      i3: "I3: SLIP-39 lab = share words — lab only, not funded.",
      i4: "I4: PSBT inspect-only — never signs or broadcasts.",
      a1: "A1: BIP-85 idea — master → app children (practice only).",
      a2: "A2: Watch-only export has no xprv / private keys.",
      a3: "A3: Knots/local node for private ops — not public seed farm.",
      a4: "A4: Orientation — what this lab is and is not.",
    };
    return hints[activeQ] || returnDefaultHint(returnModeFor(activeQ));
  }

  function returnToPathQuiz(mode, cardId, minLevel) {
    try {
      sessionStorage.removeItem(QUIZ_RETURN_KEY);
      sessionStorage.removeItem(QUIZ_ACTIVE_KEY);
    } catch (e) {
      /* ignore */
    }
    showLearnReturn(null);
    if (LEVELS.indexOf(getLevel()) < LEVELS.indexOf(minLevel)) {
      setLevel(minLevel, { announce: false });
    }
    goTab("lab");
    setTimeout(function () {
      var card = $(cardId);
      if (card) {
        card.setAttribute("data-level-force", "show");
        card.classList.remove("level-gated");
        card.hidden = false;
        card.scrollIntoView({ behavior: "smooth", block: "start" });
        try {
          if (!card.hasAttribute("tabindex")) card.setAttribute("tabindex", "-1");
          card.focus({ preventScroll: true });
        } catch (e2) {
          /* ignore */
        }
      }
      refreshIntQuiz();
      refreshAdvQuiz();
    }, 80);
  }

  function returnToIntQuiz() {
    returnToPathQuiz("intquiz", "cardIntQuiz", "intermediate");
  }

  function returnToAdvQuiz() {
    returnToPathQuiz("advquiz", "cardAdvQuiz", "advanced");
  }

  function markPathQuiz(q) {
    if (!q) return;
    var key = quizStorageFor(q);
    var st = loadJson(key, {});
    st[q] = true;
    saveJson(key, st);
    try {
      sessionStorage.removeItem(QUIZ_RETURN_KEY);
      sessionStorage.removeItem(QUIZ_ACTIVE_KEY);
    } catch (e) {
      /* ignore */
    }
    hideAllQuizMarkBtns();
    showLearnReturn(null);
    if (/^i[1-4]$/.test(q)) {
      refreshIntQuiz();
      returnToIntQuiz();
    } else if (/^a[1-4]$/.test(q)) {
      refreshAdvQuiz();
      returnToAdvQuiz();
    } else {
      refreshQuiz();
      returnToQuiz();
    }
  }

  function scrollToTarget(sel) {
    setTimeout(function () {
      var el = typeof sel === "string" ? document.querySelector(sel) : sel;
      if (!el) return;
      el.setAttribute("data-level-force", "show");
      el.classList.remove("level-gated");
      el.hidden = false;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      try {
        if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
      } catch (e) {
        /* ignore */
      }
    }, 100);
  }

  function goPathQuizDemo(q) {
    var min = minLevelForQuiz(q);
    if (LEVELS.indexOf(getLevel()) < LEVELS.indexOf(min)) {
      setLevel(min, { announce: false });
    }
    setPathQuizReturn(q);
    if (q === "i1") {
      window.location.href = "multisig.html?from=intquiz";
      return;
    }
    if (q === "i2") {
      window.location.href = "shamir.html?from=intquiz";
      return;
    }
    if (q === "i3") {
      window.location.href = "slip39.html?from=intquiz";
      return;
    }
    if (q === "i4") {
      goTab("tools");
      scrollToTarget("#cardPsbt");
      return;
    }
    if (q === "a1") {
      goTab("lab");
      scrollToTarget("#cardBip85");
      return;
    }
    if (q === "a2") {
      goTab("lab");
      scrollToTarget("#watchOnlyPanel");
      return;
    }
    if (q === "a3") {
      goTab("lab");
      scrollToTarget("#cardOps");
      return;
    }
    if (q === "a4") {
      goTab("lab");
      scrollToTarget("#cardOrientation");
      return;
    }
  }

  function resetIntQuiz() {
    saveJson(INT_QUIZ_KEY, {});
    try {
      if ((sessionStorage.getItem(QUIZ_RETURN_KEY) || "") === "intquiz") {
        sessionStorage.removeItem(QUIZ_RETURN_KEY);
        sessionStorage.removeItem(QUIZ_ACTIVE_KEY);
        showLearnReturn(null);
      }
    } catch (e) {
      /* ignore */
    }
    refreshIntQuiz();
  }

  function resetAdvQuiz() {
    saveJson(ADV_QUIZ_KEY, {});
    try {
      if ((sessionStorage.getItem(QUIZ_RETURN_KEY) || "") === "advquiz") {
        sessionStorage.removeItem(QUIZ_RETURN_KEY);
        sessionStorage.removeItem(QUIZ_ACTIVE_KEY);
        showLearnReturn(null);
      }
    } catch (e) {
      /* ignore */
    }
    refreshAdvQuiz();
  }

  function goQuizDemo(q) {
    setQuizReturn(q);
    // Ensure quiz card level is beginner so user can return
    if (LEVELS.indexOf(getLevel()) < LEVELS.indexOf("beginner")) {
      setLevel("beginner");
    }
    if (q === "q1") {
      goTab("tools");
      // Bottom dock: Back + Mark Q1 (same pattern as entropy Q3/Q4)
      showLearnReturn(
        "quiz",
        "Q1: empty vs test must change first address. When clear, Mark Q1 passed & return (or Back only)."
      );
      updateQuizMarkButtonsOnDock();
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
        sessionStorage.setItem(QUIZ_RETURN_KEY, "quiz");
        sessionStorage.setItem(QUIZ_ACTIVE_KEY, "q2");
      } catch (e) {
        /* ignore */
      }
      window.location.href = "shamir.html?from=quiz#headingPracticeSecret";
      return;
    }
    if (q === "q3" || q === "q4") {
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
        // Prefer live verdict + quiz action bar
        var live = $("entPadLiveVerdict");
        if (live && q === "q4") {
          live.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
        var id = btn.getAttribute("data-quiz-go");
        if (/^i[1-4]$/.test(id) || /^a[1-4]$/.test(id)) goPathQuizDemo(id);
        else goQuizDemo(id);
      });
    });
    // Keep legacy ids wired too (same buttons)
    ["q1", "q2", "q3", "q4"].forEach(function (q) {
      var b = $("quizPass-" + q);
      if (b)
        b.addEventListener("click", function (ev) {
          ev.preventDefault();
          markQuiz(q);
        });
    });
    ["i1", "i2", "i3", "i4"].forEach(function (q) {
      var b = $("quizPass-" + q);
      if (b)
        b.addEventListener("click", function (ev) {
          ev.preventDefault();
          markPathQuiz(q);
        });
    });
    ["a1", "a2", "a3", "a4"].forEach(function (q) {
      var b = $("quizPass-" + q);
      if (b)
        b.addEventListener("click", function (ev) {
          ev.preventDefault();
          markPathQuiz(q);
        });
    });
    var rI = $("btnResetIntQuiz");
    if (rI)
      rI.addEventListener("click", function () {
        if (window.confirm("Clear Intermediate self-check marks in this browser?")) resetIntQuiz();
      });
    var rA = $("btnResetAdvQuiz");
    if (rA)
      rA.addEventListener("click", function () {
        if (window.confirm("Clear Advanced self-check marks in this browser?")) resetAdvQuiz();
      });
    var goAdv = $("btnIntGoAdvanced");
    if (goAdv)
      goAdv.addEventListener("click", function () {
        setLevel("advanced", { announce: true });
        setTimeout(function () {
          var c = $("cardAdvQuiz");
          if (c) c.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      });
      // Per-item “Back to quiz” removed — amber dock + Go try return handle navigation
    if (
      typeof location !== "undefined" &&
      isLabIndexPage() &&
      /from=intquiz/.test(location.search || "")
    ) {
      try {
        var mI = /[?&]marked=(i[1-4])/.exec(location.search || "");
        if (mI && mI[1]) {
          var stI = loadJson(INT_QUIZ_KEY, {});
          stI[mI[1]] = true;
          saveJson(INT_QUIZ_KEY, stI);
        }
        var justI = sessionStorage.getItem("bip39lab.quizJustMarked");
        if (justI && /^i[1-4]$/.test(justI)) {
          var stJI = loadJson(INT_QUIZ_KEY, {});
          stJI[justI] = true;
          saveJson(INT_QUIZ_KEY, stJI);
          sessionStorage.removeItem("bip39lab.quizJustMarked");
        }
      } catch (eMarkI) {
        /* ignore */
      }
      try {
        sessionStorage.removeItem(QUIZ_RETURN_KEY);
      } catch (eI) {
        /* ignore */
      }
      showLearnReturn(null);
      setTimeout(function () {
        returnToIntQuiz();
      }, 60);
      try {
        if (window.history && history.replaceState) {
          history.replaceState(null, "", location.pathname + location.hash);
        }
      } catch (eIh) {
        /* ignore */
      }
    } else if (
      typeof location !== "undefined" &&
      isLabIndexPage() &&
      /from=advquiz/.test(location.search || "")
    ) {
      try {
        var mA = /[?&]marked=(a[1-4])/.exec(location.search || "");
        if (mA && mA[1]) {
          var stA = loadJson(ADV_QUIZ_KEY, {});
          stA[mA[1]] = true;
          saveJson(ADV_QUIZ_KEY, stA);
        }
        var justA = sessionStorage.getItem("bip39lab.quizJustMarked");
        if (justA && /^a[1-4]$/.test(justA)) {
          var stJA = loadJson(ADV_QUIZ_KEY, {});
          stJA[justA] = true;
          saveJson(ADV_QUIZ_KEY, stJA);
          sessionStorage.removeItem("bip39lab.quizJustMarked");
        }
      } catch (eMarkA) {
        /* ignore */
      }
      try {
        sessionStorage.removeItem(QUIZ_RETURN_KEY);
      } catch (eA) {
        /* ignore */
      }
      showLearnReturn(null);
      setTimeout(function () {
        returnToAdvQuiz();
      }, 60);
      try {
        if (window.history && history.replaceState) {
          history.replaceState(null, "", location.pathname + location.hash);
        }
      } catch (eAh) {
        /* ignore */
      }
    } else if (
      typeof location !== "undefined" &&
      isLabIndexPage() &&
      /from=quiz/.test(location.search || "")
    ) {
      // Shamir (or other page) may pass ?marked=q2 so we never lose the pass on return
      try {
        var m = /[?&]marked=(q[1-4])/.exec(location.search || "");
        if (m && m[1]) {
          var stM = loadJson(QUIZ_KEY, {});
          stM[m[1]] = true;
          saveJson(QUIZ_KEY, stM);
          if (stM.q1 && stM.q2 && stM.q3 && stM.q4) {
            var hourM = loadJson(HOUR_KEY, {});
            hourM.h6 = true;
            saveJson(HOUR_KEY, hourM);
          }
        }
        var just = sessionStorage.getItem("bip39lab.quizJustMarked");
        if (just && /^q[1-4]$/.test(just)) {
          var stJ = loadJson(QUIZ_KEY, {});
          stJ[just] = true;
          saveJson(QUIZ_KEY, stJ);
          sessionStorage.removeItem("bip39lab.quizJustMarked");
        }
      } catch (eMark) {
        /* ignore */
      }
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
        var ret = sessionStorage.getItem(QUIZ_RETURN_KEY);
        var act = sessionStorage.getItem(QUIZ_ACTIVE_KEY);
        if (ret === "1" || ret === "quiz") {
          showLearnReturn("quiz", quizHintFor(act));
        } else if (ret === "intquiz") {
          showLearnReturn("intquiz", pathQuizHint(act));
        } else if (ret === "advquiz") {
          showLearnReturn("advquiz", pathQuizHint(act));
        }
      } catch (e) {
        /* ignore */
      }
    }
    refreshQuiz();
    refreshIntQuiz();
    refreshAdvQuiz();
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
        if (lvl === "beginner") {
          graduateToBeginner();
          return;
        }
        setLevel(lvl, { announce: true });
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
        if (window.confirm("Clear all first-hour checklist ticks in this browser?")) {
          resetFirstHour();
          updateFirstHourNext();
        }
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
    updateFirstHourNext();
    watchOrientationTable();
    refreshHourGates();
    window.addEventListener("pageshow", function () {
      refreshHourGates();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }

  window.LearnLevels = {
    getLevel: getLevel,
    setLevel: setLevel,
    applyLevel: applyLevel,
    passQuiz: passQuiz,
    markQuiz: markQuiz,
    returnToQuiz: returnToQuiz,
    noteHour: noteHour,
    hourStepReady: hourStepReady,
    markHourStep: markHourStep,
  };
})();
