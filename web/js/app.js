(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  /** BIP-39 ENT bits by word count (valid English mnemonics only). */
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

  function updatePathSummary(opts, rowCount) {
    const last = Math.max(0, (rowCount || opts.count) - 1);
    const chLabel = opts.change === 1 ? "1 · change" : "0 · receive";
    $("derivePathSummary").textContent =
      "Account " +
      opts.account +
      " · change " +
      chLabel +
      " · indices 0–" +
      last +
      " · BIP86 / BIP84 / BIP49 / BIP44 · m/purpose'/0'/" +
      opts.account +
      "'/" +
      opts.change +
      "/i";
  }

  function clearAddressTable(message) {
    const tbody = $("addrTableBody");
    tbody.innerHTML = "";
    const tr = document.createElement("tr");
    tr.className = "empty-row";
    const td = document.createElement("td");
    td.colSpan = 5;
    td.textContent = message || "Generate or paste a valid mnemonic to fill addresses.";
    tr.appendChild(td);
    tbody.appendChild(tr);
  }

  function fillAddressTable(result) {
    const tbody = $("addrTableBody");
    tbody.innerHTML = "";
    const rows = result.rows || [];
    if (!rows.length) {
      clearAddressTable();
      return;
    }
    for (const r of rows) {
      const tr = document.createElement("tr");
      const cells = [
        { cls: "idx", text: String(r.index) },
        { cls: "addr", text: r.bip86_p2tr || "" },
        { cls: "addr", text: r.bip84_p2wpkh || "" },
        { cls: "addr", text: r.bip49_p2sh_p2wpkh || "" },
        { cls: "addr", text: r.bip44_p2pkh || "" },
      ];
      for (const c of cells) {
        const td = document.createElement("td");
        td.className = c.cls;
        td.textContent = c.text;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
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
      return;
    }
    if (!quiet) setStatus("Working…", "");
    try {
      const ok = await BIP39Lab.validateMnemonic(m);
      if (!ok) {
        if (!quiet) setStatus("Invalid mnemonic (wordlist or checksum).", "err");
        clearAddressTable("Invalid mnemonic — fix the phrase to derive addresses.");
        await refreshMnemonicEntropy();
        return;
      }
      const result = await BIP39Lab.deriveAddresses(m, pp, path);
      fillAddressTable(result);
      updatePathSummary(path, (result.rows && result.rows.length) || path.count);
      if (!quiet) {
        setStatus(
          "Derived offline · " +
            path.count +
            " addresses (indices 0–" +
            (path.count - 1) +
            ") · account " +
            path.account +
            " · change " +
            path.change +
            ".",
          "ok"
        );
      }
      await refreshMnemonicEntropy();
      refreshPassphraseEntropy();
    } catch (e) {
      if (!quiet) setStatus("Error: " + (e && e.message ? e.message : e), "err");
      clearAddressTable("Derivation failed.");
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

    document.querySelectorAll(".nav-item[data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => showTab(btn.getAttribute("data-tab")));
    });

    const ver = typeof BIP39Lab !== "undefined" && BIP39Lab.VERSION ? BIP39Lab.VERSION : "?";
    setStatus("Ready (offline lab v" + ver + "). Generate fills the address table automatically.", "");
    clearEntropyFields();
    clearAddressTable();
    updatePathSummary(getDeriveOptions(), 5);
    showTab("lab");
  });
})();
