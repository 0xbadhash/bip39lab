/**
 * Gradual visual teach strip — injects #labStrip and paints by Classroom level.
 * Compare page: compare-paint.html uses the zoo vector (not abandon…about).
 */
(function () {
  "use strict";

  function $(id) {
    return document.getElementById(id);
  }

  function ensureCss() {
    if ($("labStripCssLink")) return;
    var link = document.createElement("link");
    link.id = "labStripCssLink";
    link.rel = "stylesheet";
    link.href = "css/lab-strip.css";
    document.head.appendChild(link);
  }

  function ensureStrip() {
    ensureCss();
    if ($("labStrip")) return $("labStrip");
    var card = $("card-mnemonic");
    if (!card) return null;
    var wrap = document.createElement("div");
    wrap.innerHTML =
      '<div id="labStrip" class="lab-strip" data-paint="starter" aria-label="BIP-39 pipeline">' +
      '<div class="lab-strip-stages">' +
      '<div class="lab-stage stage-entropy"><span class="stage-label">entropy</span><span class="stage-detail" id="stripEnt">ENT</span><span class="stage-caption">Entropy</span></div>' +
      '<span class="lab-strip-arrow" aria-hidden="true">→</span>' +
      '<div class="lab-stage stage-checksum"><span class="stage-label">checksum</span><span class="stage-detail">CS</span><span class="stage-caption">Checksum</span></div>' +
      '<span class="lab-strip-arrow" aria-hidden="true">→</span>' +
      '<div class="lab-stage stage-words lit"><span class="stage-label">words</span><ol class="word-grid" id="stripWordGrid"></ol><span class="stage-caption">This card is a practice backup. Not a wallet.</span></div>' +
      '<span class="lab-strip-arrow" aria-hidden="true">→</span>' +
      '<div class="lab-stage stage-seed"><span class="stage-label">seed</span><span class="stage-detail">PBKDF2</span><span class="stage-caption">Seed</span></div>' +
      '<span class="lab-strip-arrow" aria-hidden="true">→</span>' +
      '<div class="lab-stage stage-address"><span class="stage-label">address</span><span class="stage-detail" id="stripAddr">—</span><span class="stage-caption">Address</span></div>' +
      "</div></div>";
    var node = wrap.firstChild;
    var ta = $("mnemonic");
    if (ta && ta.closest("label")) card.insertBefore(node, ta.closest("label"));
    else card.insertBefore(node, card.firstChild);
    return node;
  }

  function paintFromLab() {
    var grid = $("stripWordGrid");
    var ta = $("mnemonic");
    if (grid) {
      var words = ta && ta.value ? ta.value.trim().split(/\s+/).filter(Boolean) : [];
      var n = words.length >= 24 ? 24 : 12;
      var html = "";
      for (var i = 0; i < n; i++) {
        html += "<li><span class=\"wi\">" + (i + 1) + "</span><span class=\"ww\">" + (words[i] || "—") + "</span></li>";
      }
      grid.innerHTML = html;
    }
    var ent = $("entropyMnemonic");
    var stripEnt = $("stripEnt");
    if (stripEnt && ent && ent.textContent) {
      stripEnt.textContent = ent.textContent.trim().slice(0, 28) || "ENT";
    }
    var addrCell = document.querySelector("#addrTableBody tr:not(.empty-row) .addr-text");
    var stripAddr = $("stripAddr");
    if (stripAddr) stripAddr.textContent = addrCell ? addrCell.textContent.trim() : "—";
  }

  function applyPaint(level) {
    var strip = ensureStrip();
    if (!level) {
      level = document.documentElement.getAttribute("data-level") || "starter";
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
        var r = orig(level, opts);
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
      var id = ev.target && ev.target.id;
      if (id === "btnGenerate" || id === "btnDerive" || id === "btnClear") {
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
