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

  function getDemoWords() {
    const active = document.querySelector("#msWordTabs .seg-tab.active");
    const w = active && parseInt(active.getAttribute("data-words"), 10);
    return [12, 15, 18, 21, 24].indexOf(w) >= 0 ? w : 12;
  }

  function genDemo() {
    const api = globalThis.MultisigLab;
    if (!api || !api.generateDemoCosigners) {
      setStatus("Demo generator not loaded.", "err");
      return;
    }
    try {
      const n = parseInt($("msDemoN").value, 10) || 3;
      const words = getDemoWords();
      const passphrase = ($("msDemoPass") && $("msDemoPass").value) || "";
      const demo = api.generateDemoCosigners(n, { words, passphrase });
      $("msParts").value = demo.pubkeysText;
      // Suggest M = n-1 for 2-of-3 style when n>=3, else n-of-n
      $("msM").value = String(n >= 3 ? n - 1 : n);

      const list = $("msDemoList");
      list.hidden = false;
      list.innerHTML = "";
      for (const c of demo.cosigners) {
        const item = document.createElement("div");
        item.className = "watch-item";
        item.innerHTML =
          "<div class=\"watch-item-title\"></div>" +
          "<p class=\"watch-item-note ms-demo-meta\"></p>" +
          "<p class=\"control-help\"><strong>BIP39 recovery phrase</strong> (throwaway — do not fund)</p>" +
          "<div class=\"watch-item-key ms-demo-mnemonic\"></div>" +
          "<p class=\"control-help\"><strong>Entropy</strong></p>" +
          "<div class=\"watch-item-key ms-demo-ent\"></div>" +
          "<p class=\"control-help\"><strong>BIP84 zpub</strong> (account <code>m/84'/0'/0'</code> — native segwit account public key; prefix <code>zpub</code>, not <code>xpub</code>)</p>" +
          "<div class=\"watch-item-key ms-demo-zpub\"></div>" +
          "<div class=\"row ms-demo-zpub-row\"></div>" +
          "<p class=\"control-help\"><strong>Compressed pubkey</strong> at BIP84 path <code>m/84'/0'/0'/0/0</code> (pasted into step 2 for this lab’s M-of-N script)</p>" +
          "<div class=\"watch-item-key ms-demo-pub\"></div>";
        item.querySelector(".watch-item-title").textContent = c.label;
        item.querySelector(".ms-demo-meta").textContent =
          c.words +
          "-word BIP39 · " +
          c.entropyBits +
          "-bit ENT · scheme BIP84 native segwit" +
          (c.passphraseUsed ? " · passphrase used" : " · no passphrase");
        item.querySelector(".ms-demo-mnemonic").textContent = c.mnemonic;
        item.querySelector(".ms-demo-ent").textContent =
          c.entropyBits + " bits (" + c.words + "-word BIP-39)";
        item.querySelector(".ms-demo-zpub").textContent = c.bip84Zpub;
        item.querySelector(".ms-demo-pub").textContent = c.pubkeyHex;

        const zrow = item.querySelector(".ms-demo-zpub-row");
        const bCopy = document.createElement("button");
        bCopy.type = "button";
        bCopy.className = "btn-copy";
        bCopy.textContent = "Copy BIP84 zpub";
        bCopy.dataset.copyIdle = "Copy BIP84 zpub";
        bCopy.addEventListener("click", () => copyText(c.bip84Zpub, bCopy));
        zrow.appendChild(bCopy);

        list.appendChild(item);
      }
      const warn = $("msDemoWarn");
      warn.hidden = false;
      warn.textContent = demo.warning;
      setStatus(
        "Generated " +
          n +
          " × " +
          words +
          "-word BIP84 demo cosigners offline. Compressed pubkeys filled for Build; copy BIP84 zpubs from each card if you need them.",
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

    document.querySelectorAll("#msWordTabs .seg-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#msWordTabs .seg-tab").forEach((b) => {
          const on = b === btn;
          b.classList.toggle("active", on);
          b.setAttribute("aria-selected", on ? "true" : "false");
        });
      });
    });

    $("msCopyP2sh").addEventListener("click", () => copyText($("msP2sh").textContent, $("msCopyP2sh")));
    $("msCopyP2wsh").addEventListener("click", () => copyText($("msP2wsh").textContent, $("msCopyP2wsh")));
    $("msCopyScript").addEventListener("click", () => copyText($("msScript").textContent, $("msCopyScript")));
    setStatus(
      "Ready. Choose N + BIP39 word count (12–24), optional passphrase → Generate N cosigners (BIP84), then Build.",
      ""
    );
  });
})();
