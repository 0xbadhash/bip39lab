(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  /** How many consecutive receive indices to show (0 .. N-1). */
  const RECEIVE_COUNT = 5;

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

  function formatAddressTable(result) {
    const rows = result.rows || [
      {
        index: 0,
        bip44_p2pkh: result.bip44_p2pkh,
        bip49_p2sh_p2wpkh: result.bip49_p2sh_p2wpkh,
        bip84_p2wpkh: result.bip84_p2wpkh,
      },
    ];
    const lines = [
      "Account 0 · change 0 · receive indices 0–" + (rows.length - 1),
      "",
      "idx  bip84 (native segwit)                     bip49 (nested)                          bip44 (legacy)",
      "---  ----------------------------------------  --------------------------------------  ------------------------------------",
    ];
    for (const r of rows) {
      const i = String(r.index).padStart(3, " ");
      const a84 = (r.bip84_p2wpkh || "").padEnd(42, " ");
      const a49 = (r.bip49_p2sh_p2wpkh || "").padEnd(38, " ");
      const a44 = r.bip44_p2pkh || "";
      lines.push(i + "  " + a84 + "  " + a49 + "  " + a44);
    }
    return lines.join("\n");
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

  /**
   * Derive addresses when mnemonic is valid.
   * @param {{ quiet?: boolean }} opts quiet=true for live typing (no "Working…")
   */
  async function deriveNow(opts) {
    const quiet = opts && opts.quiet;
    const m = $("mnemonic").value.trim();
    const pp = $("passphrase").value;
    if (!m) {
      $("out").textContent = "";
      return;
    }
    if (!quiet) setStatus("Working…", "");
    try {
      const ok = await BIP39Lab.validateMnemonic(m);
      if (!ok) {
        if (!quiet) setStatus("Invalid mnemonic (wordlist or checksum).", "err");
        $("out").textContent = "";
        await refreshMnemonicEntropy();
        return;
      }
      const result = await BIP39Lab.deriveAddresses(m, pp, { count: RECEIVE_COUNT });
      $("out").textContent = formatAddressTable(result);
      if (!quiet) {
        setStatus(
          "Derived offline · " +
            RECEIVE_COUNT +
            " receive addresses (indices 0–" +
            (RECEIVE_COUNT - 1) +
            "). Passphrase changes the whole set.",
          "ok"
        );
      }
      await refreshMnemonicEntropy();
      refreshPassphraseEntropy();
    } catch (e) {
      if (!quiet) setStatus("Error: " + (e && e.message ? e.message : e), "err");
      $("out").textContent = "";
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
    $("out").textContent = "";
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
    // Always derive immediately after generate (with current passphrase, if any)
    await deriveNow({ quiet: false });
    setStatus(
      "Generated offline · " +
        RECEIVE_COUNT +
        " receive addresses shown below (indices 0–" +
        (RECEIVE_COUNT - 1) +
        ").",
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
      // Recalculate the full address set when passphrase changes (BIP-39 25th word)
      scheduleDerive();
    });

    document.querySelectorAll(".nav-item[data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => showTab(btn.getAttribute("data-tab")));
    });

    const ver = typeof BIP39Lab !== "undefined" && BIP39Lab.VERSION ? BIP39Lab.VERSION : "?";
    setStatus("Ready (offline lab v" + ver + "). Generate fills addresses automatically.", "");
    clearEntropyFields();
    showTab("lab");
  });
})();
