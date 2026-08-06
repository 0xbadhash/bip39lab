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
    setStatus("Cleared.", "");
    setCopyFeedback(null, "idle");
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("msBuild").addEventListener("click", build);
    $("msClear").addEventListener("click", clearAll);
    $("msCopyP2sh").addEventListener("click", () => copyText($("msP2sh").textContent, $("msCopyP2sh")));
    $("msCopyP2wsh").addEventListener("click", () => copyText($("msP2wsh").textContent, $("msCopyP2wsh")));
    $("msCopyScript").addEventListener("click", () => copyText($("msScript").textContent, $("msCopyScript")));
    setStatus("Ready. Paste compressed public keys (hex), set M, then Build.", "");
  });
})();
