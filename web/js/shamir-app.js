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
          " educational shares (not SLIP-39). Recombine UI is not in v1.",
        "ok"
      );
    } catch (e) {
      if ($("shShares")) $("shShares").innerHTML = "";
      setStatus(String(e && e.message ? e.message : e), "err");
    }
  }

  function onClear() {
    if ($("shSecret")) $("shSecret").value = "";
    if ($("shShares")) $("shShares").innerHTML = "";
    setStatus("Cleared practice secret and shares from this page.", "");
  }

  document.addEventListener("DOMContentLoaded", function () {
    if ($("btnShGen")) $("btnShGen").addEventListener("click", onGenerate);
    if ($("btnShSplit")) $("btnShSplit").addEventListener("click", onSplit);
    if ($("btnShClear")) $("btnShClear").addEventListener("click", onClear);
    setStatus("Ready — educational Shamir only. Generate a practice secret, then Split demo.", "");
  });
})();
