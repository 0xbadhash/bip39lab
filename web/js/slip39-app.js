/**
 * SLIP-39 lab UI: single-group split/combine + passphrase/groups teach (B+C).
 * Crypto: Slip39Lab from slip39.bundle.js (npm slip39 wrap). Offline only.
 */
(function () {
  "use strict";

  document.documentElement.setAttribute("data-slip39-shell", "c");

  var $ = function (id) {
    return document.getElementById(id);
  };

  function setStatus(el, text, kind) {
    if (!el) return;
    el.textContent = text;
    el.classList.remove("ok", "err");
    if (kind) el.classList.add(kind);
  }

  function readMN() {
    var preset = ($("s39Preset") && $("s39Preset").value) || "2of3";
    if (preset === "3of5") return { m: 3, n: 5 };
    return { m: 2, n: 3 };
  }

  function requireApi() {
    if (!globalThis.Slip39Lab) {
      throw new Error("Slip39Lab not loaded — is slip39.bundle.js missing?");
    }
    return globalThis.Slip39Lab;
  }

  function renderShares(mnemonics) {
    var host = $("s39Shares");
    if (!host) return;
    host.innerHTML = "";
    mnemonics.forEach(function (line, i) {
      var card = document.createElement("div");
      card.className = "card-sub shamir-share-card";
      card.setAttribute("data-share-index", String(i + 1));
      var title = document.createElement("h3");
      title.textContent = "Share " + (i + 1);
      var pre = document.createElement("pre");
      pre.className = "out share-line";
      pre.textContent = line;
      card.appendChild(title);
      card.appendChild(pre);
      host.appendChild(card);
    });
  }

  function onGenerate() {
    try {
      var api = requireApi();
      var hex = api.randomMasterHex(16);
      if ($("s39Secret")) $("s39Secret").value = hex;
      setStatus($("s39Status"), "Generated 16-byte practice master secret (hex). Not a BIP-39 phrase.", "ok");
    } catch (e) {
      setStatus($("s39Status"), String(e.message || e), "err");
    }
  }

  function onClear() {
    if ($("s39Secret")) $("s39Secret").value = "";
    if ($("s39Passphrase")) $("s39Passphrase").value = "";
    if ($("s39CombineIn")) $("s39CombineIn").value = "";
    if ($("s39Expected")) $("s39Expected").value = "";
    if ($("s39Shares")) $("s39Shares").innerHTML = "";
    if ($("s39Recovered")) $("s39Recovered").textContent = "—";
    setStatus($("s39Status"), "Cleared practice fields (nothing written to disk).", "ok");
    setStatus($("s39CombineStatus"), "—", null);
  }

  function onSplit() {
    try {
      var api = requireApi();
      var hex = (($("s39Secret") && $("s39Secret").value) || "").trim();
      var pp = (($("s39Passphrase") && $("s39Passphrase").value) || "");
      var mn = readMN();
      var shares = api.splitSingleGroup(hex, mn.m, mn.n, pp);
      renderShares(shares);
      // Prefill combine with first M shares for happy path demo
      if ($("s39CombineIn")) {
        $("s39CombineIn").value = shares.slice(0, mn.m).join("\n");
      }
      // Mirror split passphrase into combine so happy-path match uses the same value;
      // wrong-pp demos overwrite #s39PassphraseCombine after split.
      if ($("s39PassphraseCombine")) {
        $("s39PassphraseCombine").value = pp;
      }
      if ($("s39Expected")) $("s39Expected").value = hex;
      setStatus(
        $("s39Status"),
        "Split OK — " + mn.m + "-of-" + mn.n + " SLIP-39 share mnemonics (lab only).",
        "ok"
      );
    } catch (e) {
      if ($("s39Shares")) $("s39Shares").innerHTML = "";
      setStatus($("s39Status"), String(e.message || e), "err");
    }
  }

  function parseShareLines(raw) {
    // One mnemonic per non-empty line (20 words typical).
    return String(raw || "")
      .split(/\n+/)
      .map(function (l) {
        return l.trim().replace(/\s+/g, " ");
      })
      .filter(Boolean);
  }

  function onCombine() {
    try {
      var api = requireApi();
      var lines = parseShareLines($("s39CombineIn") && $("s39CombineIn").value);
      // Prefer combine field (split mirrors passphrase into it; wrong-pp demos overwrite it)
      var pp = (($("s39PassphraseCombine") && $("s39PassphraseCombine").value) || "");
      if (!pp && $("s39Passphrase")) pp = $("s39Passphrase").value || "";
      var recovered = api.combineShares(lines, pp);
      if ($("s39Recovered")) $("s39Recovered").textContent = recovered;
      var expected = (($("s39Expected") && $("s39Expected").value) || "").trim();
      if (expected) {
        if (api.matchExpected(recovered, expected)) {
          setStatus($("s39CombineStatus"), "Match — recovered master secret equals expected practice hex.", "ok");
        } else {
          setStatus(
            $("s39CombineStatus"),
            "Mismatch — recovered secret ≠ expected (wrong passphrase, wrong shares, or different secret). Not a silent success.",
            "err"
          );
        }
      } else {
        setStatus(
          $("s39CombineStatus"),
          "Recovered master secret hex (no expected value to compare). Lab only.",
          "ok"
        );
      }
    } catch (e) {
      if ($("s39Recovered")) $("s39Recovered").textContent = "—";
      setStatus($("s39CombineStatus"), String(e.message || e), "err");
    }
  }

  function onWrongPassphraseDemo() {
    // Scripted teach: split with passphrase "correct", combine with "wrong"
    try {
      var api = requireApi();
      var hex = api.randomMasterHex(16);
      if ($("s39Secret")) $("s39Secret").value = hex;
      if ($("s39Expected")) $("s39Expected").value = hex;
      if ($("s39Passphrase")) $("s39Passphrase").value = "correct";
      var shares = api.splitSingleGroup(hex, 2, 3, "correct");
      renderShares(shares);
      if ($("s39CombineIn")) $("s39CombineIn").value = shares.slice(0, 2).join("\n");
      if ($("s39PassphraseCombine")) $("s39PassphraseCombine").value = "wrong";
      var recovered = api.combineShares(shares.slice(0, 2), "wrong");
      if ($("s39Recovered")) $("s39Recovered").textContent = recovered;
      var mismatched = !api.matchExpected(recovered, hex);
      setStatus(
        $("s39CombineStatus"),
        mismatched
          ? "Wrong-passphrase demo: recovered hex does not match practice secret (SLIP-39 differs from BIP-39 optional 25th word)."
          : "Unexpected: wrong passphrase matched practice secret — report as lab bug.",
        mismatched ? "err" : "err"
      );
      setStatus($("s39Status"), "Demo split with passphrase “correct”; combine used “wrong”.", "ok");
    } catch (e) {
      setStatus($("s39CombineStatus"), String(e.message || e), "err");
    }
  }

  function wire() {
    var g = $("btnS39Gen");
    var c = $("btnS39Clear");
    var s = $("btnS39Split");
    var b = $("btnS39Combine");
    var w = $("btnS39WrongPp");
    if (g) g.addEventListener("click", onGenerate);
    if (c) c.addEventListener("click", onClear);
    if (s) s.addEventListener("click", onSplit);
    if (b) b.addEventListener("click", onCombine);
    if (w) w.addEventListener("click", onWrongPassphraseDemo);
    try {
      if (/from=intquiz/.test(location.search || "")) {
        var dock = $("learnReturnDockS39");
        if (dock) {
          if (dock.parentNode !== document.body) {
            try {
              document.body.appendChild(dock);
            } catch (eMove) {
              /* ignore */
            }
          }
          dock.hidden = false;
          document.body.classList.add("learn-return-open");
        }
        try {
          sessionStorage.setItem("bip39lab.quizReturn", "intquiz");
          sessionStorage.setItem("bip39lab.quizActive", "i3");
        } catch (eS) {
          /* ignore */
        }
        var dismiss = $("learnReturnDockS39Dismiss");
        if (dismiss && dock) {
          dismiss.addEventListener("click", function () {
            dock.hidden = true;
            document.body.classList.remove("learn-return-open");
          });
        }
        document.body.addEventListener("click", function (ev) {
          var t = ev.target && ev.target.closest ? ev.target.closest("#btnMarkI3FromS39") : null;
          if (!t) return;
          ev.preventDefault();
          try {
            var st = {};
            try {
              st = JSON.parse(localStorage.getItem("bip39lab.intQuiz") || "{}") || {};
            } catch (eJ) {
              st = {};
            }
            st.i3 = true;
            localStorage.setItem("bip39lab.intQuiz", JSON.stringify(st));
            sessionStorage.setItem("bip39lab.quizReturn", "intquiz");
            sessionStorage.setItem("bip39lab.quizActive", "i3");
            sessionStorage.setItem("bip39lab.quizJustMarked", "i3");
          } catch (eM) {
            console.error("mark I3 failed", eM);
          }
          var dest = "index.html?from=intquiz&marked=i3&_=" + Date.now();
          try {
            window.location.assign(dest);
          } catch (eNav) {
            window.location.href = dest;
          }
        });
      }
    } catch (eDock) {
      /* ignore */
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})();
