(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  function setStatus(text, kind) {
    const el = $("msStatus");
    el.textContent = text;
    el.classList.remove("ok", "err");
    if (kind) el.classList.add(kind);
  }

  function setCopyFeedback(btn, state, detail) {
    const live = $("msCopyFeedback");
    if (btn) {
      if (!btn.dataset.copyIdle) btn.dataset.copyIdle = "Copy";
      btn.classList.remove("copied", "copy-failed", "copying");
      if (state === "ok") {
        btn.textContent = "Copied";
        btn.classList.add("copied");
      } else if (state === "err") {
        btn.textContent = "Failed";
        btn.classList.add("copy-failed");
      } else {
        btn.textContent = btn.dataset.copyIdle || "Copy";
      }
    }
    if (live) {
      if (state === "ok") {
        live.textContent = "Copied: " + (detail || "").slice(0, 80);
        live.className = "copy-feedback ok";
      } else if (state === "err") {
        live.textContent = "Copy failed.";
        live.className = "copy-feedback err";
      } else {
        live.textContent = "";
        live.className = "copy-feedback";
      }
    }
  }

  function fallbackCopySync(addr) {
    const ta = document.createElement("textarea");
    ta.value = addr;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } finally {
      document.body.removeChild(ta);
    }
    return !!ok;
  }

  function copyText(text, btn) {
    if (!text) return;
    if (btn) btn.dataset.copyIdle = btn.dataset.copyIdle || btn.textContent || "Copy";
    let wrote = false;
    try {
      wrote = fallbackCopySync(text);
    } catch (e) {
      wrote = false;
    }
    if (wrote) {
      setCopyFeedback(btn, "ok", text);
      setTimeout(() => setCopyFeedback(btn, "idle"), 2000);
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => {
          setCopyFeedback(btn, "ok", text);
          setTimeout(() => setCopyFeedback(btn, "idle"), 2000);
        },
        () => setCopyFeedback(btn, "err")
      );
      return;
    }
    setCopyFeedback(btn, "err");
  }

  function build() {
    const api = globalThis.MultisigLab;
    if (!api || !api.buildMultisigFromText) {
      setStatus("Multisig library not loaded.", "err");
      return;
    }
    try {
      const r = api.buildMultisigFromText($("msParts").value, $("msM").value, {
        bip67: $("msBip67").checked,
      });
      $("msResult").hidden = false;
      $("msSummary").textContent = r.summary;
      $("msOrderNote").textContent = r.orderNote;
      $("msP2sh").textContent = r.p2sh;
      $("msP2wsh").textContent = r.p2wsh;
      $("msScript").textContent = r.scriptHex;
      $("msKeys").textContent = r.pubkeysHex.map((h, i) => i + ": " + h).join("\n");
      setStatus("Built offline · " + r.m + "-of-" + r.n + " · no network · no private keys.", "ok");
    } catch (e) {
      $("msResult").hidden = true;
      setStatus(e && e.message ? e.message : String(e), "err");
    }
  }

  function clearAll() {
    $("msParts").value = "";
    $("msM").value = "2";
    $("msBip67").checked = true;
    $("msResult").hidden = true;
    const demo = $("msDemoList");
    if (demo) {
      demo.hidden = true;
      demo.innerHTML = "";
    }
    const warn = $("msDemoWarn");
    if (warn) {
      warn.hidden = true;
      warn.textContent = "";
    }
    setStatus("Cleared.", "");
    setCopyFeedback(null, "idle");
  }

  function genDemo() {
    const api = globalThis.MultisigLab;
    if (!api || !api.generateDemoCosigners) {
      setStatus("Demo generator not loaded.", "err");
      return;
    }
    try {
      const n = parseInt($("msDemoN").value, 10) || 3;
      const demo = api.generateDemoCosigners(n);
      $("msParts").value = demo.pubkeysText;
      // Suggest M = n-1 for 2-of-3 style when n>=3, else 2-of-2
      $("msM").value = String(n >= 3 ? n - 1 : n);

      const list = $("msDemoList");
      list.hidden = false;
      list.innerHTML = "";
      for (const c of demo.cosigners) {
        const item = document.createElement("div");
        item.className = "watch-item";
        item.innerHTML =
          "<div class=\"watch-item-title\"></div>" +
          "<div class=\"watch-item-path\"></div>" +
          "<p class=\"control-help\"><strong>Demo recovery phrase</strong> (throwaway — do not fund)</p>" +
          "<div class=\"watch-item-key ms-demo-mnemonic\"></div>" +
          "<p class=\"control-help\"><strong>Compressed public key</strong> (used in the vault)</p>" +
          "<div class=\"watch-item-key ms-demo-pub\"></div>";
        item.querySelector(".watch-item-title").textContent = c.label;
        item.querySelector(".watch-item-path").textContent = c.path;
        item.querySelector(".ms-demo-mnemonic").textContent = c.mnemonic;
        item.querySelector(".ms-demo-pub").textContent = c.pubkeyHex;
        list.appendChild(item);
      }
      const warn = $("msDemoWarn");
      warn.hidden = false;
      warn.textContent = demo.warning;
      setStatus(
        "Generated " +
          n +
          " demo cosigners offline. Public keys filled below — set M if needed, then Build.",
        "ok"
      );
    } catch (e) {
      setStatus(e && e.message ? e.message : String(e), "err");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("msBuild").addEventListener("click", build);
    $("msClear").addEventListener("click", clearAll);
    const gen = $("msGenDemo");
    if (gen) gen.addEventListener("click", genDemo);
    $("msCopyP2sh").addEventListener("click", () => copyText($("msP2sh").textContent, $("msCopyP2sh")));
    $("msCopyP2wsh").addEventListener("click", () => copyText($("msP2wsh").textContent, $("msCopyP2wsh")));
    $("msCopyScript").addEventListener("click", () => copyText($("msScript").textContent, $("msCopyScript")));
    setStatus(
      "Ready. Use “Generate demo cosigners” or paste compressed public keys (hex), set M, then Build.",
      ""
    );
  });
})();
