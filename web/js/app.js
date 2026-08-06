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
      sub: "Generate, validate, and derive first addresses — English wordlist only.",
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

  /**
   * Shannon-style estimate (bits) for passphrase alone. Pedagogical only.
   * Caps at 256 for display. Empty → null.
   */
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

  async function refreshMnemonicEntropy() {
    const m = $("mnemonic").value.trim();
    if (!m) {
      setEntropyMnemonic("—", false);
      return;
    }
    const parts = m.split(/\s+/).filter(Boolean);
    const n = parts.length;
    if (!ENT_BITS_BY_WORDS[n]) {
      setEntropyMnemonic("Invalid length (need 12/15/18/21/24 words)", true);
      return;
    }
    try {
      const ok = await BIP39Lab.validateMnemonic(m);
      if (!ok) {
        setEntropyMnemonic("Invalid (wordlist or checksum)", true);
        return;
      }
      setEntropyMnemonic(formatMnemonicEntropy(n), false);
    } catch (e) {
      setEntropyMnemonic("Invalid (wordlist or checksum)", true);
    }
  }

  function refreshPassphraseEntropy() {
    setEntropyPassphrase(formatPassphraseStrength($("passphrase").value));
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
    setStatus("Generated with Web Crypto CSPRNG. Not saved.", "ok");
    await refreshMnemonicEntropy();
    refreshPassphraseEntropy();
  }

  async function onDerive() {
    const m = $("mnemonic").value.trim();
    const pp = $("passphrase").value;
    setStatus("Working…", "");
    try {
      const ok = await BIP39Lab.validateMnemonic(m);
      if (!ok) {
        setStatus("Invalid mnemonic (wordlist or checksum).", "err");
        $("out").textContent = "";
        await refreshMnemonicEntropy();
        return;
      }
      const addrs = await BIP39Lab.deriveAddresses(m, pp);
      $("out").textContent = [
        "bip44  " + addrs.bip44_p2pkh,
        "bip49  " + addrs.bip49_p2sh_p2wpkh,
        "bip84  " + addrs.bip84_p2wpkh,
      ].join("\n");
      setStatus("Derived offline. Addresses only shown below.", "ok");
      await refreshMnemonicEntropy();
      refreshPassphraseEntropy();
    } catch (e) {
      setStatus("Error: " + (e && e.message ? e.message : e), "err");
      await refreshMnemonicEntropy();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("btnGenerate").addEventListener("click", () => onGenerate().catch(console.error));
    $("btnDerive").addEventListener("click", () => onDerive().catch(console.error));
    $("btnClear").addEventListener("click", clearSecrets);
    $("hidePrivate").addEventListener("change", (e) => setPrivateVisible(!e.target.checked));

    $("mnemonic").addEventListener("input", () => {
      refreshMnemonicEntropy().catch(console.error);
    });
    $("passphrase").addEventListener("input", () => {
      refreshPassphraseEntropy();
    });

    document.querySelectorAll(".nav-item[data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => showTab(btn.getAttribute("data-tab")));
    });

    const ver = typeof BIP39Lab !== "undefined" && BIP39Lab.VERSION ? BIP39Lab.VERSION : "?";
    setStatus("Ready (offline lab v" + ver + ").", "");
    clearEntropyFields();
    showTab("lab");
  });
})();
