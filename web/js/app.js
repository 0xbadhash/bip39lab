(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

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

  function clearSecrets() {
    $("mnemonic").value = "";
    $("passphrase").value = "";
    $("out").textContent = "";
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
        return;
      }
      const addrs = await BIP39Lab.deriveAddresses(m, pp);
      $("out").textContent = [
        "bip44  " + addrs.bip44_p2pkh,
        "bip49  " + addrs.bip49_p2sh_p2wpkh,
        "bip84  " + addrs.bip84_p2wpkh,
      ].join("\n");
      setStatus("Derived offline. Addresses only shown below.", "ok");
    } catch (e) {
      setStatus("Error: " + (e && e.message ? e.message : e), "err");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("btnGenerate").addEventListener("click", () => onGenerate().catch(console.error));
    $("btnDerive").addEventListener("click", () => onDerive().catch(console.error));
    $("btnClear").addEventListener("click", clearSecrets);
    $("hidePrivate").addEventListener("change", (e) => setPrivateVisible(!e.target.checked));

    document.querySelectorAll(".nav-item[data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => showTab(btn.getAttribute("data-tab")));
    });

    const ver = typeof BIP39Lab !== "undefined" && BIP39Lab.VERSION ? BIP39Lab.VERSION : "?";
    setStatus("Ready (offline lab v" + ver + ").", "");
    showTab("lab");
  });
})();
