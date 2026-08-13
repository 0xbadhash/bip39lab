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
      setTimeout(() => setCopyFeedback(btn, "idle"), 3500);
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => {
          setCopyFeedback(btn, "ok", text);
          setTimeout(() => setCopyFeedback(btn, "idle"), 3500);
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
      const pol = $("msPolicy");
      if (pol) {
        const m = parseInt($("msM").value, 10) || 0;
        const lines = ($("msParts").value || "").split(/\n/).map((s) => s.trim()).filter(Boolean);
        const n = lines.length;
        pol.textContent =
          "Policy: " +
          m +
          "-of-" +
          n +
          " — any " +
          m +
          " of the " +
          n +
          " cosigners must sign to spend. " +
          ($("msBip67").checked
            ? "BIP67 sort ON: keys ordered so every wallet builds the same address."
            : "BIP67 sort OFF: different key order can produce a different address — usually a mistake.");
      }
      $("msSummary").textContent = r.summary;
      $("msOrderNote").textContent = r.orderNote;
      $("msP2sh").textContent = r.p2sh;
      $("msP2wsh").textContent = r.p2wsh;
      $("msScript").textContent = r.scriptHex;
      $("msKeys").textContent = r.pubkeysHex.map((h, i) => i + ": " + h).join("\n");
      const mapBox = $("msVaultMap");
      if (mapBox) {
        mapBox.hidden = false;
        if ($("msMapDesc")) $("msMapDesc").textContent = r.descriptor || "";
        if ($("msMapNote")) $("msMapNote").textContent = r.vaultMapNote || "";
        if ($("msMapIds")) {
          $("msMapIds").textContent =
            "Key ids (first 8 hex, educational): " + (r.keyIds || []).join(" · ");
        }
      }
      setStatus("Built offline · " + r.m + "-of-" + r.n + " · no network · no private keys.", "ok");
    } catch (e) {
      $("msResult").hidden = true;
      if ($("msVaultMap")) $("msVaultMap").hidden = true;
      setStatus(e && e.message ? e.message : String(e), "err");
    }
  }

  function clearAll() {
    $("msParts").value = "";
    if ($("msPartsSource")) {
      $("msPartsSource").textContent =
        "Active source: paste compressed pubkeys below, or use Generate demo cosigners (warns before overwrite).";
    }
    $("msM").value = "2";
    $("msBip67").checked = true;
    $("msResult").hidden = true;
    if ($("msVaultMap")) $("msVaultMap").hidden = true;
    if ($("msMapDesc")) $("msMapDesc").textContent = "";
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
      const existing = ($("msParts") && $("msParts").value || "").trim();
      if (existing) {
        const ok = window.confirm(
          "Public keys box already has text.\n\n" +
            "Generate demo cosigners will REPLACE what you typed/pasted with throwaway demo keys.\n\n" +
            "Continue and overwrite?"
        );
        if (!ok) {
          setStatus("Generate cancelled — your pasted keys were kept.", "");
          return;
        }
      }
      const n = parseInt($("msDemoN").value, 10) || 3;
      const words = getDemoWords();
      const passphrase = ($("msDemoPass") && $("msDemoPass").value) || "";
      const demo = api.generateDemoCosigners(n, { words, passphrase });
      $("msParts").value = demo.pubkeysText;
      if ($("msPartsSource")) {
        $("msPartsSource").textContent =
          "Active source: demo generator (throwaway). Paste your own keys to replace, or Clear.";
      }
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
          "<p class=\"control-help label-row\"><strong>BIP-84 zpub</strong> — account watch-only export " +
          "<span class=\"help-tip\" data-term=\"ZPUB\">" +
          "<button type=\"button\" class=\"help-tip-btn\" aria-label=\"About zpub\">i</button>" +
          "<span class=\"help-tip-panel\" hidden></span></span>" +
          "<br /><span class=\"control-help\" style=\"font-weight:400\">Path <code>m/84'/0'/0'</code> · prefix <code>zpub…</code> (SLIP-132). " +
          "<strong>Not</strong> a BIP-44 xpub string — wrong prefix breaks imports. " +
          "Why show it? So you recognize what Sparrow/hardware export. " +
          "It is <em>not</em> what Build pastes into the vault script.</span></p>" +
          "<div class=\"watch-item-key ms-demo-zpub\"></div>" +
          "<div class=\"row ms-demo-zpub-row\"></div>" +
          "<p class=\"control-help label-row\"><strong>Compressed pubkey</strong> — what Build actually uses " +
          "<span class=\"help-tip\" data-term=\"PUBKEY\">" +
          "<button type=\"button\" class=\"help-tip-btn\" aria-label=\"About compressed pubkey\">i</button>" +
          "<span class=\"help-tip-panel\" hidden></span></span>" +
          "<br /><span class=\"control-help\" style=\"font-weight:400\">Path <code>m/84'/0'/0'/0/0</code> (first receive under that account). " +
          "This hex (02…/03…) is filled into the public-keys box for the M-of-N vault. " +
          "N of these keys → one shared multisig address after Build.</span></p>" +
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
      // Fill ⓘ tips on newly injected demo cards
      try {
        if (window.Bip39Glossary && typeof window.Bip39Glossary.enhance === "function") {
          window.Bip39Glossary.enhance();
        }
      } catch (eEnh) {
        /* ignore */
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

  function updateAirgapChip() {
    const el = $("chipAirgap");
    if (!el) return;
    const on = typeof navigator !== "undefined" && navigator.onLine;
    el.textContent = on ? "Browser online" : "Browser offline";
    el.classList.toggle("chip-ok", !!on);
    el.classList.toggle("chip-bad", !on);
    el.classList.remove("chip-warn");
    el.title = on
      ? "Browser reports online. Multisig crypto still stays on-page via CSP."
      : "Browser reports offline. Extra air-gap signal, not a guarantee.";
  }

  function syncBip67Warn() {
    const box = $("msBip67");
    const warn = $("msBip67Warn");
    if (!box || !warn) return;
    warn.hidden = !!box.checked;
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("msBuild").addEventListener("click", build);
    $("msClear").addEventListener("click", clearAll);
    const gen = $("msGenDemo");
    if (gen) gen.addEventListener("click", genDemo);
    if ($("msParts")) {
      $("msParts").addEventListener("input", () => {
        if ($("msPartsSource") && ($("msParts").value || "").trim()) {
          $("msPartsSource").textContent =
            "Active source: textarea (paste/edit). Generate demo will ask before overwriting.";
        }
      });
    }

    const bip67 = $("msBip67");
    if (bip67) {
      bip67.addEventListener("change", syncBip67Warn);
      syncBip67Warn();
    }

    updateAirgapChip();
    window.addEventListener("online", updateAirgapChip);
    window.addEventListener("offline", updateAirgapChip);

    document.querySelectorAll("#msWordTabs .seg-tab").forEach((btn) => {
      // pointerdown: select before layout reflow from later generate; avoid mis-hit on 24-word tab
      btn.addEventListener("pointerdown", (ev) => {
        if (ev.button != null && ev.button !== 0) return;
        ev.preventDefault();
        document.querySelectorAll("#msWordTabs .seg-tab").forEach((b) => {
          const on = b === btn;
          b.classList.toggle("active", on);
          b.setAttribute("aria-selected", on ? "true" : "false");
        });
      });
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
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
    if ($("msCopyMap")) {
      $("msCopyMap").addEventListener("click", () => copyText($("msMapDesc").textContent, $("msCopyMap")));
    }
    setStatus(
      "Ready. Choose N + BIP39 word count (12–24), optional passphrase → Generate N cosigners (BIP84), then Build.",
      ""
    );

    // Intermediate I1 return dock — Back + Mark passed & return (same pattern as Q1/Q2/Q3/Q4)
    try {
      if (/from=intquiz/.test(location.search || "")) {
        var dock = $("learnReturnDockMs");
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
          sessionStorage.setItem("bip39lab.quizActive", "i1");
        } catch (eS) {
          /* ignore */
        }
        var dismiss = $("learnReturnDockMsDismiss");
        if (dismiss && dock) {
          dismiss.addEventListener("click", function () {
            dock.hidden = true;
            document.body.classList.remove("learn-return-open");
          });
        }
        document.body.addEventListener("click", function (ev) {
          var t = ev.target && ev.target.closest ? ev.target.closest("#btnMarkI1FromMs") : null;
          if (!t) return;
          ev.preventDefault();
          try {
            var st = {};
            try {
              st = JSON.parse(localStorage.getItem("bip39lab.intQuiz") || "{}") || {};
            } catch (eJ) {
              st = {};
            }
            st.i1 = true;
            localStorage.setItem("bip39lab.intQuiz", JSON.stringify(st));
            sessionStorage.setItem("bip39lab.quizReturn", "intquiz");
            sessionStorage.setItem("bip39lab.quizActive", "i1");
            sessionStorage.setItem("bip39lab.quizJustMarked", "i1");
          } catch (eM) {
            console.error("mark I1 failed", eM);
          }
          var dest = "index.html?from=intquiz&marked=i1&_=" + Date.now();
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
  });
})();
