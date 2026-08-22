(function () {
  "use strict";

  var $ = function (id) {
    return document.getElementById(id);
  };

  function setStatus(text, kind) {
    var el = $("shStatus");
    if (!el) return;
    el.textContent = text;
    el.classList.remove("ok", "err");
    if (kind) el.classList.add(kind);
  }

  function readMN() {
    var m = parseInt(($("shM") && $("shM").value) || "2", 10);
    var n = parseInt(($("shN") && $("shN").value) || "3", 10);
    return { m: m, n: n };
  }

  function secretBytesFromUi() {
    var raw = (($("shSecret") && $("shSecret").value) || "").trim();
    if (!raw) throw new Error("Practice secret is empty — generate or paste demo text.");
    // Prefer hex if looks like hex of even length; else UTF-8
    if (/^[0-9a-fA-F]+$/.test(raw) && raw.length % 2 === 0 && raw.length >= 2) {
      return ShamirLab.fromHex(raw);
    }
    return ShamirLab.utf8Encode(raw);
  }

  function renderShares(shares) {
    var host = $("shShares");
    if (!host) return;
    host.innerHTML = "";
    shares.forEach(function (sh) {
      var line = ShamirLab.encodeShare(sh);
      var card = document.createElement("div");
      card.className = "card-sub shamir-share-card";
      card.setAttribute("data-share-index", String(sh.index));
      var title = document.createElement("h3");
      title.textContent = "Share " + sh.index;
      var pre = document.createElement("pre");
      pre.className = "out share-line";
      pre.textContent = line;
      var row = document.createElement("div");
      row.className = "row";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn secondary btn-sm";
      btn.textContent = "Copy";
      btn.addEventListener("click", function () {
        copyText(line, btn);
      });
      row.appendChild(btn);
      card.appendChild(title);
      card.appendChild(pre);
      card.appendChild(row);
      host.appendChild(card);
    });
  }

  function copyText(text, btn) {
    function ok() {
      if (btn) {
        btn.textContent = "Copied";
        setTimeout(function () {
          btn.textContent = "Copy";
        }, 1200);
      }
      setStatus("Copied share to clipboard (educational only).", "ok");
    }
    function fail() {
      setStatus("Copy failed — select the share text manually.", "err");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok).catch(fail);
      return;
    }
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      var done = document.execCommand("copy");
      document.body.removeChild(ta);
      if (done) ok();
      else fail();
    } catch (e) {
      fail();
    }
  }

  function onGenerate() {
    if (!globalThis.ShamirLab) {
      setStatus("ShamirLab not loaded.", "err");
      return;
    }
    var hex = ShamirLab.generatePracticeSecret(16);
    if ($("shSecret")) $("shSecret").value = hex;
    setStatus("Generated 16-byte practice secret (hex). Not a BIP-39 phrase.", "ok");
  }

  function onSplit() {
    if (!globalThis.ShamirLab) {
      setStatus("ShamirLab not loaded.", "err");
      return;
    }
    try {
      var mn = readMN();
      var secret = secretBytesFromUi();
      var shares = ShamirLab.splitSecret(secret, mn.m, mn.n);
      renderShares(shares);
      setStatus(
        "Split OK — " +
          mn.m +
          "-of-" +
          mn.n +
          " educational shares (not SLIP-39). Use Verify recombine below to prove recovery.",
        "ok"
      );
      if ($("shRecombineIn")) {
        // Prefill first M share lines for one-click verify
        var lines = shares.slice(0, mn.m).map(function (sh) {
          return ShamirLab.encodeShare(sh);
        });
        $("shRecombineIn").value = lines.join("\n");
      }
      if ($("shRecombineOut")) $("shRecombineOut").textContent = "—";
    } catch (e) {
      if ($("shShares")) $("shShares").innerHTML = "";
      setStatus(String(e && e.message ? e.message : e), "err");
    }
  }

  function parseShareLines(text) {
    var lines = String(text || "")
      .split(/\r?\n/)
      .map(function (l) {
        return l.trim();
      })
      .filter(Boolean);
    if (!lines.length) throw new Error("Paste at least M share lines (share:index:hex).");
    return lines.map(function (line) {
      return ShamirLab.parseShare(line);
    });
  }

  var EVIDENCE_KEY = "bip39lab.quizEvidence";
  var QUIZ_KEY = "bip39lab.quiz";

  function loadEvidence() {
    try {
      var raw = localStorage.getItem(EVIDENCE_KEY);
      if (!raw) return {};
      var o = JSON.parse(raw);
      return o && typeof o === "object" ? o : {};
    } catch (e) {
      return {};
    }
  }

  function saveEvidence(patch) {
    var o = loadEvidence();
    Object.keys(patch).forEach(function (k) {
      o[k] = patch[k];
    });
    try {
      localStorage.setItem(EVIDENCE_KEY, JSON.stringify(o));
    } catch (e) {
      /* ignore */
    }
    refreshQ2Ui();
    return o;
  }

  function refreshQ2Ui() {
    var ev = loadEvidence();
    var ready = !!(ev.q2Fail && ev.q2Ok);
    var banner = $("q2EvidenceBanner");
    var markBtn = $("btnMarkQ2FromShamir");
    var dockHint = $("learnReturnDockShamirHint");
    var topHint = $("quizBackBarShamirHint");
    if (banner) banner.hidden = !ready;
    if (markBtn) {
      var intMode = false;
      try {
        intMode = sessionStorage.getItem("bip39lab.quizReturn") === "intquiz";
      } catch (eI) {
        intMode = false;
      }
      if (intMode) {
        markBtn.hidden = true;
      } else {
        markBtn.hidden = false;
        markBtn.disabled = !ready;
        markBtn.setAttribute("aria-disabled", ready ? "false" : "true");
      }
    }
    var hint = ready
      ? "Both demos done (fail + success). Mark Q2 passed & return — self-check, not auto-graded."
      : ev.q2Fail && !ev.q2Ok
        ? "Good: under-threshold failed. Now recombine with M shares until it succeeds."
        : !ev.q2Fail && ev.q2Ok
          ? "You succeeded with enough shares. Also try with only ONE share — it must fail."
          : "Q2: recombine with ONE share (must fail), then with M shares (must succeed).";
    if (dockHint) dockHint.textContent = hint;
    if (topHint) topHint.textContent = hint;
  }

  function onRecombine() {
    if (!globalThis.ShamirLab) {
      setStatus("ShamirLab not loaded.", "err");
      return;
    }
    var out = $("shRecombineOut");
    var lineCount = String(($("shRecombineIn") && $("shRecombineIn").value) || "")
      .split(/\r?\n/)
      .map(function (l) {
        return l.trim();
      })
      .filter(Boolean).length;
    try {
      var shares = parseShareLines($("shRecombineIn") && $("shRecombineIn").value);
      var recovered = ShamirLab.combineShares(shares);
      var hex = ShamirLab.toHex(recovered);
      var utf8 = "";
      try {
        if (typeof TextDecoder !== "undefined") {
          utf8 = new TextDecoder("utf-8", { fatal: false }).decode(recovered);
        }
      } catch (e2) {
        utf8 = "";
      }
      var original = (($("shSecret") && $("shSecret").value) || "").trim();
      var match = false;
      if (original) {
        if (/^[0-9a-fA-F]+$/.test(original) && original.length % 2 === 0) {
          match = original.toLowerCase() === hex;
        } else {
          match = original === utf8;
        }
      }
      var msg =
        "Recovered " +
        recovered.length +
        " bytes.\nhex: " +
        hex +
        (utf8 && /^[\x20-\x7e]*$/.test(utf8) ? "\nas UTF-8: " + utf8 : "") +
        "\n" +
        (original
          ? match
            ? "Matches practice secret field above. (Educational proof only — not SLIP-39.)"
            : "Does not match practice secret field (different secret or incomplete shares)."
          : "No practice secret in field to compare — hex above is the reconstruction.");
      if (out) out.textContent = msg;
      setStatus(
        match
          ? "Recombine OK — practice secret reconstructed offline."
          : original
            ? "Recombine ran — result does not match the secret field."
            : "Recombine OK — reconstructed " + recovered.length + " bytes.",
        match || !original ? "ok" : "err"
      );
      // Q2 evidence: enough shares recombined (threshold success)
      if (shares.length >= 2) {
        saveEvidence({ q2Ok: true });
      }
    } catch (e) {
      if (out) out.textContent = String(e && e.message ? e.message : e);
      setStatus(String(e && e.message ? e.message : e), "err");
      // Under-threshold: one share (or combine error) → fail evidence
      if (lineCount <= 1) {
        saveEvidence({ q2Fail: true });
      } else {
        saveEvidence({ q2Fail: true });
      }
    }
  }

  function onFillM() {
    var cards = document.querySelectorAll(".shamir-share-card .share-line");
    var m = parseInt(($("shM") && $("shM").value) || "2", 10) || 2;
    var lines = [];
    for (var i = 0; i < cards.length && lines.length < m; i++) {
      lines.push(cards[i].textContent.trim());
    }
    if (!lines.length) {
      setStatus("No share cards yet — Split demo first.", "err");
      return;
    }
    if ($("shRecombineIn")) $("shRecombineIn").value = lines.join("\n");
    setStatus("Filled " + lines.length + " share line(s) from cards (need M=" + m + ").", "ok");
  }

  function onClear() {
    if ($("shSecret")) $("shSecret").value = "";
    if ($("shShares")) $("shShares").innerHTML = "";
    if ($("shRecombineIn")) $("shRecombineIn").value = "";
    if ($("shRecombineOut")) $("shRecombineOut").textContent = "—";
    setStatus("Cleared practice secret and shares from this page.", "");
  }

  function showQuizReturn() {
    var fromQ = typeof location !== "undefined" && /from=quiz/.test(location.search || "");
    var fromInt =
      typeof location !== "undefined" && /from=intquiz/.test(location.search || "");
    var fromS = false;
    var retKey = "";
    try {
      retKey = sessionStorage.getItem("bip39lab.quizReturn") || "";
      fromS = retKey === "1" || retKey === "quiz";
    } catch (e) {
      /* ignore */
    }
    // Always show return dock when coming from quiz OR mid Q2 experiment OR Intermediate I2
    var show = fromQ || fromS || fromInt || retKey === "intquiz";
    try {
      // Also show if user has Q2 evidence in progress (fail or ok half-done)
      var ev = loadEvidence();
      if (ev.q2Fail || ev.q2Ok) show = true;
    } catch (e2) {
      /* ignore */
    }
    var bar = $("quizBackBarShamir");
    if (bar) bar.hidden = true; // legacy mid-page bar removed
    var dock = $("learnReturnDockShamir");
    if (dock) {
      if (dock.parentNode !== document.body) {
        try {
          document.body.appendChild(dock);
        } catch (eMove) {
          /* ignore */
        }
      }
      dock.hidden = !show;
      try {
        document.body.classList.toggle("learn-return-open", !!show);
      } catch (e3) {
        /* ignore */
      }
      // Point Back link at Intermediate or Guided quiz
      var backA = dock.querySelector("a.btn");
      var hint = $("learnReturnDockShamirHint");
      var markQ2 = $("btnMarkQ2FromShamir");
      var markI2 = $("btnMarkI2FromShamir");
      if (fromInt || retKey === "intquiz") {
        if (backA) {
          backA.href = "index.html?from=intquiz";
          backA.textContent = "← Back to Intermediate quiz";
        }
        if (hint)
          hint.textContent =
            "I2: Shamir = hex shares (not BIP-39 words). Mark I2 when clear.";
        if (markQ2) markQ2.hidden = true;
        if (markI2) markI2.hidden = false;
      } else {
        if (backA) {
          backA.href = "index.html?from=quiz";
          backA.textContent = "← Back to Beginner";
        }
        if (hint) hint.textContent = "Q2: fail with 1 share, then succeed with M.";
        if (markI2) markI2.hidden = true;
      }
    }
    if (fromInt || retKey === "intquiz") {
      try {
        sessionStorage.setItem("bip39lab.quizReturn", "intquiz");
        sessionStorage.setItem("bip39lab.quizActive", "i2");
      } catch (e4i) {
        /* ignore */
      }
    } else if (fromQ || fromS) {
      try {
        sessionStorage.setItem("bip39lab.quizReturn", "quiz");
        sessionStorage.setItem("bip39lab.quizActive", "q2");
      } catch (e4) {
        /* ignore */
      }
    }
    refreshQ2Ui();
  }

  function markQ2AndReturn(ev) {
    if (ev && ev.preventDefault) ev.preventDefault();
    if (ev && ev.stopPropagation) ev.stopPropagation();
    try {
      var st = {};
      try {
        st = JSON.parse(localStorage.getItem(QUIZ_KEY) || "{}") || {};
      } catch (e) {
        st = {};
      }
      if (!st || typeof st !== "object") st = {};
      st.q2 = true;
      localStorage.setItem(QUIZ_KEY, JSON.stringify(st));
      // First-hour step 6 when all four quiz items done
      if (st.q1 && st.q2 && st.q3 && st.q4) {
        var hour = {};
        try {
          hour = JSON.parse(localStorage.getItem("bip39lab.firstHour") || "{}") || {};
        } catch (eH) {
          hour = {};
        }
        hour.h6 = true;
        localStorage.setItem("bip39lab.firstHour", JSON.stringify(hour));
      }
      sessionStorage.setItem("bip39lab.quizReturn", "quiz");
      sessionStorage.setItem("bip39lab.quizActive", "q2");
      sessionStorage.setItem("bip39lab.quizJustMarked", "q2");
    } catch (e2) {
      console.error("markQ2AndReturn storage failed", e2);
    }
    // Cache-bust so Lab always reloads and applies q2=passed
    var dest = "index.html?from=quiz&marked=q2&_=" + Date.now();
    try {
      window.location.assign(dest);
    } catch (eNav) {
      window.location.href = dest;
    }
  }

  function markI2AndReturn(ev) {
    if (ev && ev.preventDefault) ev.preventDefault();
    if (ev && ev.stopPropagation) ev.stopPropagation();
    try {
      var st = {};
      try {
        st = JSON.parse(localStorage.getItem("bip39lab.intQuiz") || "{}") || {};
      } catch (e) {
        st = {};
      }
      st.i2 = true;
      localStorage.setItem("bip39lab.intQuiz", JSON.stringify(st));
      sessionStorage.setItem("bip39lab.quizReturn", "intquiz");
      sessionStorage.setItem("bip39lab.quizActive", "i2");
      sessionStorage.setItem("bip39lab.quizJustMarked", "i2");
    } catch (e2) {
      console.error("mark I2 failed", e2);
    }
    var dest = "index.html?from=intquiz&marked=i2&_=" + Date.now();
    try {
      window.location.assign(dest);
    } catch (eNav) {
      window.location.href = dest;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if ($("btnShGen")) $("btnShGen").addEventListener("click", onGenerate);
    if ($("btnShSplit")) $("btnShSplit").addEventListener("click", onSplit);
    if ($("btnShClear")) $("btnShClear").addEventListener("click", onClear);
    if ($("btnShRecombine")) $("btnShRecombine").addEventListener("click", onRecombine);
    if ($("btnShFillM")) $("btnShFillM").addEventListener("click", onFillM);
    // Delegation: works after dock is moved to <body>
    document.body.addEventListener("click", function (ev) {
      var t = ev.target && ev.target.closest ? ev.target.closest("#btnMarkQ2FromShamir") : null;
      if (t) {
        markQ2AndReturn(ev);
        return;
      }
      var t2 = ev.target && ev.target.closest ? ev.target.closest("#btnMarkI2FromShamir") : null;
      if (t2) markI2AndReturn(ev);
    });
    setStatus("Ready — educational Shamir only. Generate a practice secret, then Split demo.", "");
    showQuizReturn();
    function updateAirgapChip() {
      var el = $("chipAirgap");
      if (!el) return;
      var on = typeof navigator !== "undefined" && navigator.onLine;
      el.textContent = on ? "Browser online" : "Browser offline";
      el.title = on
        ? "Browser reports online — prefer air-gap for funded practice"
        : "Browser reports offline";
    }
    updateAirgapChip();
    window.addEventListener("online", updateAirgapChip);
    window.addEventListener("offline", updateAirgapChip);
  });
})();
