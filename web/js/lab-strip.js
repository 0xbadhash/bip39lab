/**
 * Gradual visual teach strip — injects #labStrip and paints by Classroom level.
 * Spec: .agents/specs/2026-08-22-gradual-visual-teach.md
 * Stamp: 0.16.26 (strip inside #card-mnemonic). Teach-A/B/C are later ships.
 */
(function () {
  "use strict";

  var STRIP_CSS_V = "0.16.26";

  function $(id) {
    return document.getElementById(id);
  }

  function ensureCss() {
    if ($("labStripCssLink")) return;
    var link = document.createElement("link");
    link.id = "labStripCssLink";
    link.rel = "stylesheet";
    link.href = "css/lab-strip.css?v=" + STRIP_CSS_V;
    document.head.appendChild(link);
  }

  function ensureStrip() {
    ensureCss();
    if ($("labStrip")) return $("labStrip");
    var host = $("card-mnemonic");
    if (!host) return null;
    var wrap = document.createElement("div");
    wrap.innerHTML =
      '<div id="labStrip" class="lab-strip" data-paint="starter" aria-label="BIP-39 pipeline">' +
      '<div class="lab-strip-stages">' +
      '<div class="lab-stage stage-entropy"><span class="stage-label">entropy</span><span class="stage-detail" id="stripEnt">—</span><span class="stage-caption">Entropy · random bits</span></div>' +
      '<span class="lab-strip-arrow" aria-hidden="true">→</span>' +
      '<div class="lab-stage stage-checksum"><span class="stage-label">checksum</span><span class="stage-detail" id="stripCs">—</span><span class="stage-caption">Checksum · SHA-256 n bits</span></div>' +
      '<span class="lab-strip-arrow" aria-hidden="true">→</span>' +
      '<div class="lab-stage stage-words lit"><span class="stage-label">words</span><ol class="word-grid" id="stripWordGrid"></ol><span class="stamp-warn">This card is a practice backup. Not a wallet.</span><span class="stage-caption">Numbered card · the mnemonic object</span></div>' +
      '<span class="lab-strip-arrow" aria-hidden="true">→</span>' +
      '<div class="lab-stage stage-seed"><span class="stage-label">seed</span><span class="stage-detail">PBKDF2 · 2048</span><span class="stage-caption">Seed · mnemonic + optional passphrase</span></div>' +
      '<span class="lab-strip-arrow" aria-hidden="true">→</span>' +
      '<div class="lab-stage stage-address"><span class="stage-label">address</span><span class="stage-detail" id="stripAddr">—</span><span class="stage-caption">Address · BIP84 receive</span></div>' +
      "</div>" +
      '<div class="lab-strip-extra int-only" id="stripIntExtra">' +
      '<div class="ks-row">' +
      '<div class="ks-box"><strong>Passphrase A / B</strong><span class="stage-detail">Same words · different passphrase · different addresses</span></div>' +
      '<div class="ks-box"><strong>Keys ≠ shares</strong><span class="stage-detail">HD key is not a Shamir share · Multisig / Shamir are other rooms</span></div>' +
      "</div></div>" +
      '<div class="lab-strip-extra adv-only" id="stripAdvExtra">' +
      '<div class="ks-box"><strong>master → child</strong><span class="stage-detail">m/84h/0h/0h/0/0 and /0/1 derive from one seed · this site is not a wallet</span></div>' +
      "</div>" +
      "</div>";
    var node = wrap.firstChild;
    node.classList.add("face-keep");
    var gen = $("btnGenerate");
    var genRow = gen && gen.closest ? gen.closest(".row") : null;
    if (genRow && genRow.parentNode === host) {
      if (genRow.nextSibling) host.insertBefore(node, genRow.nextSibling);
      else host.appendChild(node);
    } else {
      var head = host.querySelector(".card-head");
      if (head && head.nextSibling) host.insertBefore(node, head.nextSibling);
      else host.insertBefore(node, host.firstChild);
    }
    return node;
  }

  function paintFromLab() {
    var grid = $("stripWordGrid");
    var ta = $("mnemonic");
    if (grid) {
      var words = ta && ta.value ? ta.value.trim().split(/\s+/).filter(Boolean) : [];
      if (!words.length) {
        grid.style.gridTemplateColumns = "1fr";
        grid.innerHTML =
          '<li class="strip-empty" id="stripEmptyHint">Generate to fill this backup</li>';
      } else {
        var n = words.length >= 24 ? 24 : words.length > 12 ? 24 : 12;
        if (words.length === 15 || words.length === 18 || words.length === 21) n = words.length;
        grid.style.gridTemplateColumns =
          n >= 24 ? "repeat(6, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))";
        var html = "";
        for (var i = 0; i < n; i++) {
          var w = words[i] || "—";
          html +=
            '<li title="word ' +
            (i + 1) +
            '"><span class="wi">' +
            (i + 1) +
            '</span><span class="ww">' +
            w +
            "</span></li>";
        }
        grid.innerHTML = html;
      }
    }
    var ent = $("entropyMnemonic");
    var stripEnt = $("stripEnt");
    var stripCs = $("stripCs");
    if (stripEnt && ent && ent.textContent) {
      var e = ent.textContent.trim();
      stripEnt.textContent = e.slice(0, 32) || "—";
      if (stripCs) {
        var m = e.match(/(\d+)\s*bit/i);
        if (m) {
          var bits = parseInt(m[1], 10);
          if (bits === 128 || bits === 160 || bits === 192 || bits === 224 || bits === 256) {
            stripCs.textContent = bits / 32 + " bits";
          }
        }
      }
    }
    var addrCell = document.querySelector("#addrTableBody tr:not(.empty-row) .addr-text");
    var stripAddr = $("stripAddr");
    if (stripAddr) stripAddr.textContent = addrCell ? addrCell.textContent.trim() : "—";
  }

  function applyPaint(level) {
    var strip = ensureStrip();
    if (!level) {
      level =
        document.documentElement.getAttribute("data-level") ||
        ($("learnLevel") && $("learnLevel").value) ||
        "starter";
    }
    document.documentElement.setAttribute("data-paint", level);
    if (strip) strip.setAttribute("data-paint", level);
    paintFromLab();
  }

  function hookLevel() {
    applyPaint();
    var sel = $("learnLevel");
    if (sel && !sel.getAttribute("data-strip-wired")) {
      sel.setAttribute("data-strip-wired", "1");
      sel.addEventListener("change", function () {
        applyPaint(sel.value);
      });
    }
    if (window.LearnLevels && LearnLevels.setLevel && !LearnLevels._stripHooked) {
      var orig = LearnLevels.setLevel;
      LearnLevels.setLevel = function (level, opts) {
        var r = orig.apply(this, arguments);
        applyPaint(level);
        return r;
      };
      LearnLevels._stripHooked = true;
    }
    var mn = $("mnemonic");
    if (mn && !mn.getAttribute("data-strip-wired")) {
      mn.setAttribute("data-strip-wired", "1");
      mn.addEventListener("input", paintFromLab);
    }
    document.addEventListener("click", function (ev) {
      var t = ev.target;
      var id = t && t.id;
      if (
        id === "btnGenerate" ||
        id === "btnDerive" ||
        id === "btnClear" ||
        (t && t.closest && t.closest("#btnGenerate, #btnDerive, #btnClear"))
      ) {
        setTimeout(paintFromLab, 80);
        setTimeout(paintFromLab, 450);
      }
    });
  }

  function boot() {
    hookLevel();
    setTimeout(hookLevel, 0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
