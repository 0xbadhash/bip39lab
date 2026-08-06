(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const ENT_BITS_BY_WORDS = {
    12: 128,
    15: 160,
    18: 192,
    21: 224,
    24: 256,
  };

  const titles = {
    lab: {
      title: "Offline BIP-39 lab",
      sub: "Generate, validate, and derive receive addresses — English wordlist only.",
    },
    balance: {
      title: "Balance checks",
      sub: "Address-only via CLI. This page never phones home.",
    },
    about: {
      title: "About this lab",
      sub: "No retention · offline crypto · bip39.catalyxt.xyz",
    },
  };

  let deriveTimer = null;
  let lastRows = null;

  function setPrivateVisible(show) {
    document.querySelectorAll("[data-private]").forEach((el) => {
      el.classList.toggle("hidden-private", !show);
    });
  }

  function formatMnemonicEntropy(wordCount) {
    const bits = ENT_BITS_BY_WORDS[wordCount];
    if (!bits) return "—";
    return bits + " bits (" + wordCount + "-word BIP-39)";
  }

  function estimatePassphraseBits(passphrase) {
    if (!passphrase) return null;
    const n = passphrase.length;
    if (n === 0) return null;
    const counts = Object.create(null);
    for (let i = 0; i < n; i++) {
      const ch = passphrase[i];
      counts[ch] = (counts[ch] || 0) + 1;
    }
    let h = 0;
    for (const k in counts) {
      const p = counts[k] / n;
      h -= p * (Math.log(p) / Math.LN2);
    }
    return Math.min(h * n, 256);
  }

  function formatPassphraseStrength(passphrase) {
    const est = estimatePassphraseBits(passphrase);
    if (est == null) return "—";
    return "~" + Math.round(est) + " bits (estimate)";
  }

  function setEntropyMnemonic(text, invalid) {
    const el = $("entropyMnemonic");
    el.textContent = text;
    el.classList.toggle("is-invalid", !!invalid);
  }

  function setEntropyPassphrase(text) {
    $("entropyPassphrase").textContent = text;
  }

  function clearEntropyFields() {
    setEntropyMnemonic("—", false);
    setEntropyPassphrase("—");
  }

  function getDeriveOptions() {
    const account = Math.max(0, parseInt($("deriveAccount").value, 10) || 0);
    const change = $("deriveChange").value === "1" ? 1 : 0;
    let count = parseInt($("deriveCount").value, 10) || 5;
    if (![5, 10, 20].includes(count)) count = 5;
    return { account, change, count };
  }

  function showLegacy49() {
    return !!($("colBip49") && $("colBip49").checked);
  }

  function showLegacy44() {
    return !!($("colBip44") && $("colBip44").checked);
  }

  function visibleColCount() {
    return 1 + 2 + (showLegacy49() ? 1 : 0) + (showLegacy44() ? 1 : 0);
  }

  function applyColumnVisibility() {
    const leg49 = showLegacy49();
    const leg44 = showLegacy44();
    document.querySelectorAll('[data-col="bip49"]').forEach((el) => {
      el.hidden = !leg49;
    });
    document.querySelectorAll('[data-col="bip44"]').forEach((el) => {
      el.hidden = !leg44;
    });
    const scroll = $("tableScroll");
    if (scroll) {
      scroll.classList.toggle("cols-modern", !leg49 && !leg44);
      scroll.classList.toggle("cols-legacy", leg49 || leg44);
    }
  }

  function updatePathSummary(opts, rowCount) {
    const last = Math.max(0, (rowCount || opts.count) - 1);
    const chWord = opts.change === 1 ? "change (internal leftovers)" : "receive (for people paying you)";
    const types = ["BIP86 Taproot", "BIP84 native"];
    if (showLegacy49()) types.push("BIP49 nested");
    if (showLegacy44()) types.push("BIP44 legacy");

    $("derivePathSummary").textContent =
      "Showing account " +
      opts.account +
      " · " +
      chWord +
      " · address numbers 0 through " +
      last +
      " · formats: " +
      types.join(", ") +
      ". Technical path pattern: m/purpose'/0'/" +
      opts.account +
      "'/" +
      opts.change +
      "/index";
  }

  function setPlainStatus(text, kind) {
    const el = $("deriveStatusPlain");
    if (!el) return;
    el.textContent = text;
    el.classList.remove("ok", "err");
    if (kind) el.classList.add(kind);
  }

  function copyAddress(addr, btn) {
    if (!addr) return;
    const done = () => {
      if (!btn) return;
      const prev = btn.textContent;
      btn.textContent = "Copied";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = prev;
        btn.classList.remove("copied");
      }, 1200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(addr).then(done).catch(() => fallbackCopy(addr, done));
    } else {
      fallbackCopy(addr, done);
    }
  }

  function fallbackCopy(addr, done) {
    try {
      const ta = document.createElement("textarea");
      ta.value = addr;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      done();
    } catch (e) {
      setStatus("Could not copy — select the address manually.", "err");
    }
  }

  function makeAddrCell(addr, col) {
    const td = document.createElement("td");
    td.className = "addr";
    td.setAttribute("data-col", col);
    if (col === "bip49" && !showLegacy49()) td.hidden = true;
    if (col === "bip44" && !showLegacy44()) td.hidden = true;

    const wrap = document.createElement("div");
    wrap.className = "addr-cell";

    const span = document.createElement("span");
    span.className = "addr-text";
    span.textContent = addr || "";
    span.title = addr || "";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-copy";
    btn.textContent = "Copy";
    btn.setAttribute("aria-label", "Copy address to clipboard");
    btn.addEventListener("click", () => copyAddress(addr, btn));

    const btnQr = document.createElement("button");
    btnQr.type = "button";
    btnQr.className = "btn-copy";
    btnQr.textContent = "QR";
    btnQr.setAttribute("aria-label", "Show address QR code");
    btnQr.addEventListener("click", () => showQr(addr, "Receive address · " + col).catch(console.error));

    wrap.appendChild(span);
    wrap.appendChild(btn);
    wrap.appendChild(btnQr);
    td.appendChild(wrap);
    return td;
  }

  async function showQr(text, label) {
    if (!text) return;
    if (!BIP39Lab.qrDataUrl) {
      setStatus("QR not available in this build.", "err");
      return;
    }
    const url = await BIP39Lab.qrDataUrl(text, { width: 220 });
    $("qrModalLabel").textContent = label || "QR";
    $("qrModalText").textContent = text;
    $("qrModalImg").src = url;
    $("qrModal").hidden = false;
  }

  function hideQr() {
    $("qrModal").hidden = true;
    $("qrModalImg").removeAttribute("src");
  }

  async function refreshWatchOnly() {
    const list = $("watchOnlyList");
    if (!list) return;
    const m = $("mnemonic").value.trim();
    const pp = $("passphrase").value;
    const account = getDeriveOptions().account;
    if (!m) {
      list.innerHTML = "<p class=\"control-help\">Generate or paste a valid phrase, then refresh.</p>";
      return;
    }
    if (!BIP39Lab.exportWatchOnly) {
      list.innerHTML = "<p class=\"control-help\">Watch-only export not available in this build.</p>";
      return;
    }
    try {
      const ok = await BIP39Lab.validateMnemonic(m);
      if (!ok) {
        list.innerHTML = "<p class=\"control-help\">Invalid recovery phrase — cannot export watch-only keys.</p>";
        return;
      }
      const exp = await BIP39Lab.exportWatchOnly(m, pp, { account });
      list.innerHTML = "";
      for (const k of exp.keys) {
        const item = document.createElement("div");
        item.className = "watch-item";
        item.innerHTML =
          "<div class=\"watch-item-title\"></div>" +
          "<div class=\"watch-item-path\"></div>" +
          "<div class=\"watch-item-key\"></div>" +
          "<p class=\"watch-item-note\"></p>" +
          "<div class=\"row\"></div>";
        item.querySelector(".watch-item-title").textContent = k.label;
        item.querySelector(".watch-item-path").textContent = k.path + " · account " + exp.account;
        item.querySelector(".watch-item-key").textContent = k.key;
        item.querySelector(".watch-item-note").textContent = k.note;
        const row = item.querySelector(".row");
        const bCopy = document.createElement("button");
        bCopy.type = "button";
        bCopy.className = "btn-copy";
        bCopy.textContent = "Copy key";
        bCopy.addEventListener("click", () => copyAddress(k.key, bCopy));
        const bQr = document.createElement("button");
        bQr.type = "button";
        bQr.className = "btn-copy";
        bQr.textContent = "QR";
        bQr.addEventListener("click", () => showQr(k.key, k.label + " · " + k.path).catch(console.error));
        row.appendChild(bCopy);
        row.appendChild(bQr);
        list.appendChild(item);
      }
    } catch (e) {
      list.innerHTML =
        "<p class=\"control-help\">Export failed: " +
        (e && e.message ? e.message : e) +
        "</p>";
    }
  }

  function clearAddressTable(message) {
    lastRows = null;
    const tbody = $("addrTableBody");
    tbody.innerHTML = "";
    const tr = document.createElement("tr");
    tr.className = "empty-row";
    const td = document.createElement("td");
    td.colSpan = visibleColCount();
    td.textContent =
      message ||
      "Generate or paste a valid recovery phrase to list receive addresses (like printing cheque numbers from a pad).";
    tr.appendChild(td);
    tbody.appendChild(tr);
    applyColumnVisibility();
  }

  function fillAddressTable(result) {
    const tbody = $("addrTableBody");
    tbody.innerHTML = "";
    const rows = result.rows || [];
    lastRows = rows;
    if (!rows.length) {
      clearAddressTable();
      return;
    }
    for (const r of rows) {
      const tr = document.createElement("tr");

      const tdIdx = document.createElement("td");
      tdIdx.className = "idx";
      tdIdx.textContent = String(r.index);
      tr.appendChild(tdIdx);

      tr.appendChild(makeAddrCell(r.bip86_p2tr || "", "bip86"));
      tr.appendChild(makeAddrCell(r.bip84_p2wpkh || "", "bip84"));
      tr.appendChild(makeAddrCell(r.bip49_p2sh_p2wpkh || "", "bip49"));
      tr.appendChild(makeAddrCell(r.bip44_p2pkh || "", "bip44"));

      tbody.appendChild(tr);
    }
    applyColumnVisibility();
  }

  async function refreshMnemonicEntropy() {
    const m = $("mnemonic").value.trim();
    if (!m) {
      setEntropyMnemonic("—", false);
      return false;
    }
    const parts = m.split(/\s+/).filter(Boolean);
    const n = parts.length;
    if (!ENT_BITS_BY_WORDS[n]) {
      setEntropyMnemonic("Invalid length (need 12/15/18/21/24 words)", true);
      return false;
    }
    try {
      const ok = await BIP39Lab.validateMnemonic(m);
      if (!ok) {
        setEntropyMnemonic("Invalid (wordlist or checksum)", true);
        return false;
      }
      setEntropyMnemonic(formatMnemonicEntropy(n), false);
      return true;
    } catch (e) {
      setEntropyMnemonic("Invalid (wordlist or checksum)", true);
      return false;
    }
  }

  function refreshPassphraseEntropy() {
    setEntropyPassphrase(formatPassphraseStrength($("passphrase").value));
  }

  async function deriveNow(opts) {
    const quiet = opts && opts.quiet;
    const m = $("mnemonic").value.trim();
    const pp = $("passphrase").value;
    const path = getDeriveOptions();
    updatePathSummary(path, path.count);
    if (!m) {
      clearAddressTable();
      setPlainStatus("No phrase yet — generate one or paste a valid recovery phrase.", "");
      return;
    }
    if (!quiet) setStatus("Working…", "");
    try {
      const ok = await BIP39Lab.validateMnemonic(m);
      if (!ok) {
        if (!quiet) setStatus("Invalid mnemonic (wordlist or checksum).", "err");
        clearAddressTable("Invalid recovery phrase — fix words/checksum to list addresses.");
        setPlainStatus("Invalid phrase — addresses cannot be listed until it checks out.", "err");
        await refreshMnemonicEntropy();
        return;
      }
      const result = await BIP39Lab.deriveAddresses(m, pp, path);
      fillAddressTable(result);
      updatePathSummary(path, (result.rows && result.rows.length) || path.count);
      const plain =
        "Done offline. Listed " +
        path.count +
        " address numbers (0–" +
        (path.count - 1) +
        ") for account " +
        path.account +
        ", " +
        (path.change === 1 ? "change (internal)" : "receive (for payments)") +
        ". Same phrase + settings always give the same list — like a fixed chequebook. " +
        "A passphrase acts like a secret second password and changes every address. " +
        "This table does not show balances or spend coins.";
      setPlainStatus(plain, "ok");
      if (!quiet) {
        setStatus(
          "Derived offline · " +
            path.count +
            " addresses · account " +
            path.account +
            " · change " +
            path.change +
            ".",
          "ok"
        );
      }
      await refreshMnemonicEntropy();
      refreshPassphraseEntropy();
      await refreshWatchOnly();
    } catch (e) {
      if (!quiet) setStatus("Error: " + (e && e.message ? e.message : e), "err");
      clearAddressTable("Derivation failed.");
      setPlainStatus("Something went wrong while deriving addresses.", "err");
      await refreshMnemonicEntropy();
    }
  }

  function scheduleDerive() {
    if (deriveTimer) clearTimeout(deriveTimer);
    deriveTimer = setTimeout(() => {
      deriveNow({ quiet: true }).catch(console.error);
    }, 280);
  }

  function clearSecrets() {
    $("mnemonic").value = "";
    $("passphrase").value = "";
    clearAddressTable();
    clearEntropyFields();
    setPlainStatus("Cleared — nothing was saved to disk.", "");
    setStatus("Cleared (memory fields only; nothing was stored).", "");
  }

  function setStatus(text, kind) {
    const el = $("status");
    el.textContent = text;
    el.classList.remove("ok", "err");
    if (kind) el.classList.add(kind);
  }

  function showTab(name) {
    document.querySelectorAll(".panel").forEach((p) => {
      const on = p.id === "panel-" + name;
      p.classList.toggle("active", on);
      p.hidden = !on;
    });
    document.querySelectorAll(".nav-item").forEach((btn) => {
      const on = btn.getAttribute("data-tab") === name;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    const t = titles[name] || titles.lab;
    $("panel-title").textContent = t.title;
    $("panel-sub").textContent = t.sub;
  }

  async function onGenerate() {
    const n = parseInt($("wordCount").value, 10);
    const m = await BIP39Lab.generateMnemonic(n);
    $("mnemonic").value = m;
    await refreshMnemonicEntropy();
    refreshPassphraseEntropy();
    await deriveNow({ quiet: false });
    const path = getDeriveOptions();
    setStatus(
      "Generated offline · " + path.count + " receive addresses in the table below.",
      "ok"
    );
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("btnGenerate").addEventListener("click", () => onGenerate().catch(console.error));
    $("btnDerive").addEventListener("click", () => deriveNow({ quiet: false }).catch(console.error));
    $("btnClear").addEventListener("click", clearSecrets);
    $("hidePrivate").addEventListener("change", (e) => setPrivateVisible(!e.target.checked));

    $("mnemonic").addEventListener("input", () => {
      refreshMnemonicEntropy().catch(console.error);
      scheduleDerive();
    });
    $("passphrase").addEventListener("input", () => {
      refreshPassphraseEntropy();
      scheduleDerive();
    });

    ["deriveAccount", "deriveChange", "deriveCount"].forEach((id) => {
      $(id).addEventListener("change", () => scheduleDerive());
      $(id).addEventListener("input", () => scheduleDerive());
    });

    ["colBip49", "colBip44"].forEach((id) => {
      const el = $(id);
      if (!el) return;
      el.addEventListener("change", () => {
        applyColumnVisibility();
        if (lastRows && lastRows.length) {
          fillAddressTable({ rows: lastRows });
        }
        updatePathSummary(getDeriveOptions(), lastRows ? lastRows.length : getDeriveOptions().count);
      });
    });

    const btnWo = $("btnWatchOnly");
    if (btnWo) btnWo.addEventListener("click", () => refreshWatchOnly().catch(console.error));

    const btnQrClose = $("btnQrClose");
    if (btnQrClose) btnQrClose.addEventListener("click", hideQr);
    const btnQrCopy = $("btnQrCopy");
    if (btnQrCopy) {
      btnQrCopy.addEventListener("click", () => {
        const t = $("qrModalText").textContent;
        copyAddress(t, btnQrCopy);
      });
    }
    const qrModal = $("qrModal");
    if (qrModal) {
      qrModal.addEventListener("click", (e) => {
        if (e.target === qrModal) hideQr();
      });
    }

    document.querySelectorAll(".nav-item[data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => showTab(btn.getAttribute("data-tab")));
    });

    const ver = typeof BIP39Lab !== "undefined" && BIP39Lab.VERSION ? BIP39Lab.VERSION : "?";
    setStatus("Ready (offline lab v" + ver + "). Generate fills the address table automatically.", "");
    setPlainStatus(
      "Tip: Generate a phrase to fill the table. Use Copy / QR on addresses; watch-only keys appear below (no private keys).",
      ""
    );
    clearEntropyFields();
    clearAddressTable();
    applyColumnVisibility();
    updatePathSummary(getDeriveOptions(), 5);
    showTab("lab");
  });
})();
