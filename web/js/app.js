(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  function setPrivateVisible(show) {
    document.querySelectorAll("[data-private]").forEach((el) => {
      el.classList.toggle("hidden-private", !show);
    });
  }

  function clearSecrets() {
    $("mnemonic").value = "";
    $("passphrase").value = "";
    $("out").textContent = "";
    $("status").textContent = "Cleared (memory fields only; nothing was stored).";
  }

  async function onGenerate() {
    const n = parseInt($("wordCount").value, 10);
    const m = await BIP39Lab.generateMnemonic(n);
    $("mnemonic").value = m;
    $("status").textContent = "Generated with Web Crypto CSPRNG. Not saved.";
  }

  async function onDerive() {
    const m = $("mnemonic").value.trim();
    const pp = $("passphrase").value;
    $("status").textContent = "Working…";
    try {
      const ok = await BIP39Lab.validateMnemonic(m);
      if (!ok) {
        $("status").textContent = "Invalid mnemonic (wordlist or checksum).";
        $("out").textContent = "";
        return;
      }
      const addrs = await BIP39Lab.deriveAddresses(m, pp);
      $("out").textContent = [
        "bip44  " + addrs.bip44_p2pkh,
        "bip49  " + addrs.bip49_p2sh_p2wpkh,
        "bip84  " + addrs.bip84_p2wpkh,
      ].join("\n");
      $("status").textContent = "Derived offline. Addresses only shown below.";
    } catch (e) {
      $("status").textContent = "Error: " + (e && e.message ? e.message : e);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("btnGenerate").addEventListener("click", () => onGenerate().catch(console.error));
    $("btnDerive").addEventListener("click", () => onDerive().catch(console.error));
    $("btnClear").addEventListener("click", clearSecrets);
    $("hidePrivate").addEventListener("change", (e) => setPrivateVisible(!e.target.checked));
    $("status").textContent = "Ready (offline lab v" + BIP39Lab.VERSION + ").";
  });
})();
