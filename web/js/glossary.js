/**
 * Educational glossary: BIPs, script types, keys, fees.
 * Renders #glossaryList and upgrades [data-term="KEY"] into help tips.
 */
(function () {
  "use strict";

  /**
   * Keys are UPPERCASE matchers used by data-term and search.
   * title = display form
   */
  const TERMS = [
    {
      id: "BIP39",
      title: "BIP-39",
      group: "BIPs",
      short: "Recovery phrase standard",
      body:
        "Bitcoin Improvement Proposal 39: turns random entropy into a human-readable recovery phrase (12–24 English words) and, with an optional passphrase, into a binary seed via PBKDF2. This lab’s mnemonic tools follow BIP-39.",
    },
    {
      id: "BIP32",
      title: "BIP-32",
      group: "BIPs",
      short: "Hierarchical deterministic (HD) keys",
      body:
        "Defines how one master seed can derive a tree of child keys (paths like m/84'/0'/0'/0/0). Parents can export an extended public key so watch-only wallets see addresses without spending keys.",
    },
    {
      id: "BIP44",
      title: "BIP-44",
      group: "BIPs",
      short: "Legacy multi-account path",
      body:
        "Path template m/44'/coin'/account'/change/index for P2PKH (“1…”) addresses. Coin type 0 = mainnet Bitcoin, 1 = testnet. Still used for older wallets.",
    },
    {
      id: "BIP49",
      title: "BIP-49",
      group: "BIPs",
      short: "Nested SegWit path",
      body:
        "Path m/49'/… for P2SH-P2WPKH addresses (often start with “3”). SegWit wrapped in Pay-to-Script-Hash for older wallet compatibility.",
    },
    {
      id: "BIP84",
      title: "BIP-84",
      group: "BIPs",
      short: "Native SegWit path",
      body:
        "Path m/84'/… for native SegWit P2WPKH addresses (bc1q…). Widely used; account keys are often exported as zpub (SLIP-132).",
    },
    {
      id: "BIP86",
      title: "BIP-86",
      group: "BIPs",
      short: "Taproot path",
      body:
        "Path m/86'/… for key-path Taproot (P2TR) addresses (bc1p…). Newest common single-sig style in this lab’s default pad.",
    },
    {
      id: "BIP67",
      title: "BIP-67",
      group: "BIPs",
      short: "Sorted multisig keys",
      body:
        "Lexicographic sort of public keys before building a multisig script so every cosigner builds the same address. Leave “Sort keys (BIP67)” on unless you deliberately need a custom order.",
    },
    {
      id: "BIP174",
      title: "BIP-174 (PSBT)",
      group: "BIPs",
      short: "Partially Signed Bitcoin Transaction",
      body:
        "Portable package for an incomplete spend that can move between software, hardware wallets, and cosigners. " +
        "Why partial? Multisig needs M signatures; hardware wallets sign offline; air-gap keeps seeds off the internet. " +
        "Lifecycle: create PSBT → each party adds partial signatures → combine → finalize → broadcast. " +
        "Tools → PSBT inspector only explains structure offline — it does not sign, finalize, or broadcast. Use the sample buttons to see framing without real funds.",
    },
    {
      id: "P2PKH",
      title: "P2PKH",
      group: "Scripts & addresses",
      short: "Pay to Public Key Hash",
      body:
        "Classic “1…” addresses (legacy). Script pays whoever can prove knowledge of the private key for a hashed public key. BIP-44 in this lab.",
    },
    {
      id: "P2SH",
      title: "P2SH",
      group: "Scripts & addresses",
      short: "Pay to Script Hash",
      body:
        "Addresses often starting with “3”. The chain stores a hash of a redeem script (e.g. multisig or nested SegWit). Multisig “classic” outputs in this lab are P2SH.",
    },
    {
      id: "P2WPKH",
      title: "P2WPKH",
      group: "Scripts & addresses",
      short: "Pay to Witness Public Key Hash",
      body:
        "Native SegWit single-sig (bc1q…). Cheaper fees than legacy; used with BIP-84 paths.",
    },
    {
      id: "P2WSH",
      title: "P2WSH",
      group: "Scripts & addresses",
      short: "Pay to Witness Script Hash",
      body:
        "Native SegWit pay-to-script (longer bc1q…). Multisig “modern” addresses in this lab are typically P2WSH with the same M-of-N policy as the P2SH form.",
    },
    {
      id: "P2TR",
      title: "P2TR",
      group: "Scripts & addresses",
      short: "Pay to Taproot",
      body:
        "Taproot outputs (bc1p…). Key-path spends look like a single key; BIP-86 covers common single-sig derivation in this lab.",
    },
    {
      id: "P2SH-P2WPKH",
      title: "P2SH-P2WPKH",
      group: "Scripts & addresses",
      short: "Nested SegWit",
      body:
        "SegWit packed inside P2SH (“3…”). BIP-49. Useful when a service only accepts “3” addresses but you still want SegWit benefits.",
    },
    {
      id: "BECH32",
      title: "Bech32 / Bech32m",
      group: "Scripts & addresses",
      short: "bc1 address encoding",
      body:
        "Bech32 encodes SegWit v0 (bc1q…). Bech32m encodes SegWit v1+ including Taproot (bc1p…). Testnet uses the tb1 prefix.",
    },
    {
      id: "SEGWIT",
      title: "SegWit",
      group: "Scripts & addresses",
      short: "Segregated Witness",
      body:
        "Transaction upgrade that moves signatures to a “witness” field, fixing malleability and usually lowering fees. Native SegWit = bc1q; nested = often “3…”.",
    },
    {
      id: "TAPROOT",
      title: "Taproot",
      group: "Scripts & addresses",
      short: "Schnorr + script trees",
      body:
        "Soft fork enabling Schnorr signatures and more private complex scripts. Single-sig Taproot addresses start with bc1p (BIP-86 in this lab).",
    },
    {
      id: "XPUB",
      title: "xpub",
      group: "Keys",
      short: "Extended public key",
      body:
        "BIP-32 account public key: can derive receive/change addresses for watch-only use. Cannot spend. Never confused with xprv (private).",
    },
    {
      id: "XPRV",
      title: "xprv",
      group: "Keys",
      short: "Extended private key",
      body:
        "BIP-32 private extended key — full spend authority for a branch of the tree. This lab refuses to show or QR xprv by default. Treat like a seed.",
    },
    {
      id: "YPUB",
      title: "ypub",
      group: "Keys",
      short: "SLIP-132 nested SegWit xpub",
      body:
        "Version-byte variant of an account public key signaling BIP-49 nested SegWit to some wallets (Sparrow, etc.). Still public-only.",
    },
    {
      id: "ZPUB",
      title: "zpub",
      group: "Keys",
      short: "SLIP-132 native SegWit xpub",
      body:
        "Version-byte variant signaling BIP-84 P2WPKH watch-only. Common mobile/desktop import format. Not a private key.",
    },
    {
      id: "SLIP132",
      title: "SLIP-132",
      group: "Keys",
      short: "Versioned xpub prefixes",
      body:
        "SatoshiLabs standard for ypub/zpub (and others) so wallets know which script type an extended public key is meant for.",
    },
    {
      id: "WIF",
      title: "WIF",
      group: "Keys",
      short: "Wallet Import Format",
      body:
        "Base58 encoding of a single private key (often starts with K, L, or 5). Multisig page rejects WIF — public keys only.",
    },
    {
      id: "PUBKEY",
      title: "Compressed public key",
      group: "Keys",
      short: "33-byte hex 02…/03…",
      body:
        "Elliptic-curve public key in compressed form (66 hex chars, starts with 02 or 03). Safe to share for building multisig vaults.",
    },
    {
      id: "MNEMONIC",
      title: "Mnemonic / recovery phrase",
      group: "Keys",
      short: "BIP-39 word list",
      body:
        "12–24 words encoding entropy + checksum. Anyone with the phrase (and passphrase, if any) can recreate all keys. Never paste a funded phrase on an untrusted machine.",
    },
    {
      id: "PASSPHRASE",
      title: "BIP-39 passphrase",
      group: "Keys",
      short: "Optional 25th word",
      body:
        "Extra secret mixed into seed derivation. Same words + different passphrase = completely different addresses. Not the same as a wallet PIN.",
    },
    {
      id: "SEED",
      title: "Seed",
      group: "Keys",
      short: "64-byte BIP-39 output",
      body:
        "Binary result of PBKDF2 over the mnemonic (+ passphrase). Fixed length 512 bits of output size — that is not the same as “512 bits of entropy.”",
    },
    {
      id: "HD",
      title: "HD wallet",
      group: "Keys",
      short: "Hierarchical deterministic",
      body:
        "One seed → many addresses via BIP-32 paths. You only need to back up the seed (and passphrase), not each address’s key.",
    },
    {
      id: "PATH",
      title: "Derivation path",
      group: "Keys",
      short: "m/purpose'/coin'/account'/change/index",
      body:
        "Folder path inside the BIP-32 HD tree to one key/address — not the seed itself. " +
        "Example m/86'/0'/0'/0/0 = Taproot (86), mainnet (0), account 0, receive (0), first address (0). " +
        "Hardened levels use ' (purpose, coin, account). Tools → Path playground shows each level live from Lab controls.",
    },
    {
      id: "BIP85",
      title: "BIP-85",
      group: "BIPs",
      short: "Deterministic entropy from a master seed",
      body:
        "Way to derive many application-specific secrets/mnemonics from one master backup (different index → different app). " +
        "Lab Advanced card teaches the idea only — not a full production BIP-85 wallet. Never fund educational demos.",
    },
    {
      id: "ACCOUNT",
      title: "Account",
      group: "Keys",
      short: "BIP path account'",
      body:
        "Like multiple bank accounts under one login. Most people use account 0. Changing it yields a new family of addresses.",
    },
    {
      id: "CHANGE",
      title: "Change chain",
      group: "Keys",
      short: "0 = receive, 1 = change",
      body:
        "Receive (0): addresses you share. Change (1): internal addresses wallets use for leftover coins after a send.",
    },
    {
      id: "INDEX",
      title: "Address index",
      group: "Keys",
      short: "0, 1, 2…",
      body:
        "Sequence number along the receive or change chain. Index 0 is usually the first address a wallet shows.",
    },
    {
      id: "WATCHONLY",
      title: "Watch-only",
      group: "Keys",
      short: "See, don’t spend",
      body:
        "Import xpub/zpub/ypub (or addresses) to monitor balances without private keys — like a statement login, not transfer rights.",
    },
    {
      id: "DESCRIPTOR",
      title: "Output descriptor",
      group: "Keys",
      short: "Script policy string",
      body:
        "A text recipe for how an address is built (e.g. wpkh(zpub…/0/*)). Wallets use descriptors for watch-only import. This lab explains public descriptors only — never paste private keys or seeds here.",
    },
    {
      id: "TEACH",
      title: "Extra help",
      group: "Security",
      short: "Show or hide longer teaching copy",
      body:
        "Extra help On shows longer explanations under cards, help folds, and most ⓘ tips. Off keeps a compact UI but still shows safety ⓘ (recovery phrase, air-gap, CSP, PSBT, educational warnings). There is no mid-page “path” wizard — left nav and First-hour/Quiz Go buttons are the jumps. Preference is stored in this browser only — not secrets.",
    },
    {
      id: "MULTISIG",
      title: "Multisig (M-of-N)",
      group: "Multisig",
      short: "Several keys to spend",
      body:
        "A script that requires M signatures out of N public keys (e.g. 2-of-3). Built from public keys in this lab; no private keys accepted.",
    },
    {
      id: "MOFN",
      title: "M-of-N",
      group: "Multisig",
      short: "Threshold policy",
      body:
        "M = required signers, N = total cosigners. Example: 2-of-3 means any two of three people can authorize a spend.",
    },
    {
      id: "COSIGNER",
      title: "Cosigner",
      group: "Multisig",
      short: "One key holder",
      body:
        "A participant who holds one of the N keys. In real life each cosigner keeps their own seed offline; only public keys are shared to build the vault address.",
    },
    {
      id: "SHAMIR",
      title: "Shamir secret sharing",
      group: "Multisig",
      short: "Threshold split of one secret",
      body:
        "Split one secret into N shares so any M shares rebuild it. Different from Multisig (M-of-N keys). This lab’s Shamir tab is educational GF(256) demo — not SLIP-39 / Trezor word shares. Do not split real funded seeds here.",
    },
    {
      id: "THRESHOLD",
      title: "Threshold (M-of-N)",
      group: "Multisig",
      short: "How many pieces unlock",
      body:
        "M is the number required; N is the total. In Shamir, M shares rebuild the secret. In Multisig, M signatures authorize a spend. Same words, different objects.",
    },
    {
      id: "SHARE",
      title: "Share (Shamir)",
      group: "Multisig",
      short: "One piece of a split secret",
      body:
        "A single Shamir piece, here encoded as share:<index>:<hex>. Alone it should not reveal the secret when M>1. Not a BIP-39 word and not a cosigner public key.",
    },
    {
      id: "SLIP39",
      title: "SLIP-39",
      group: "Multisig",
      short: "Hardware-friendly share words",
      body:
        "Trezor’s standard for recoverable Shamir-style shares as word lists. This lab does not implement SLIP-39 — use vendor tools for real threshold backups.",
    },
    {
      id: "UTXO",
      title: "UTXO",
      group: "Network & fees",
      short: "Unspent transaction output",
      body:
        "Bitcoin tracks coins as unspent outputs, not a single bank-ledger balance. Your “balance” is the sum of UTXOs that pay to addresses you control.",
    },
    {
      id: "SATVB",
      title: "sat/vB",
      group: "Network & fees",
      short: "Fee rate",
      body:
        "Satoshis per virtual byte — like postage price for a transaction. Higher rates often confirm faster when the mempool is busy. 1 BTC = 100,000,000 sats.",
    },
    {
      id: "SATOSHI",
      title: "Satoshi (sat)",
      group: "Network & fees",
      short: "Smallest unit",
      body:
        "1 bitcoin = 100 million satoshis. Fees and balances in explorers are often shown in sats.",
    },
    {
      id: "MEMPOOL",
      title: "Mempool",
      group: "Network & fees",
      short: "Waiting room for txs",
      body:
        "Set of unconfirmed transactions nodes know about. When busy, users bid higher sat/vB for block space. This lab’s Network page can show a public snapshot.",
    },
    {
      id: "PSBT",
      title: "PSBT",
      group: "Network & fees",
      short: "Partially Signed Bitcoin Transaction",
      body:
        "Short name for BIP-174. Think “shipping label for an unfinished transaction”: inputs/outputs and partial signatures travel together so different keys can sign without sharing seeds. " +
        "Common when: 2-of-3 multisig, hardware wallet signing a draft from a watch-only app, two operators in different places. " +
        "Tools → PSBT: load synthetic samples or paste an export; Inspect shows magic/maps only — no signing or broadcasting.",
    },
    {
      id: "RPC",
      title: "RPC",
      group: "Network & fees",
      short: "Remote Procedure Call",
      body:
        "How software talks to a local Bitcoin node (Core/Knots), e.g. scantxoutset for balances. Prefer loopback + cookie auth; never expose RPC to the open internet.",
    },
    {
      id: "SCANTXOUTSET",
      title: "scantxoutset",
      group: "Network & fees",
      short: "Node UTXO scan RPC",
      body:
        "Bitcoin Core/Knots RPC that scans the UTXO set for outputs matching an address/descriptor. Powers CLI --backend knots/bitcoind. Pruned nodes can still do current balances.",
    },
    {
      id: "KNOTS",
      title: "Bitcoin Knots",
      group: "Network & fees",
      short: "Core-compatible full node",
      body:
        "A Bitcoin node implementation with Core-compatible JSON-RPC. Use with bip39lab CLI for private address balances instead of public explorers.",
    },
    {
      id: "CSP",
      title: "CSP",
      group: "Security",
      short: "Content Security Policy",
      body:
        "Browser rules limiting scripts and network. Lab, Multisig, and Shamir use connect-src 'none' (offline crypto). Network page allowlists only the public fee/balance API.",
    },
    {
      id: "AIRGAP",
      title: "Air-gap",
      group: "Security",
      short: "No network for secrets",
      body:
        "Using a machine offline (or without trusted network) for recovery phrases. Recommended for real funds. This lab’s crypto pages are designed to work without network.",
    },
    {
      id: "ENTROPY",
      title: "Entropy",
      group: "Security",
      short: "Randomness for keys",
      body:
        "Unpredictable bits used to create a mnemonic. BIP-39 needs 128 bits of ENT for 12 words, 256 for 24. " +
        "Tools → Entropy pad estimates dice/coin bits and can build PRACTICE words from the pad hash so you can see low-entropy risk — never fund those words. Prefer Lab Generate (OS CSPRNG) for real wallets.",
    },
    {
      id: "CSPRNG",
      title: "CSPRNG",
      group: "Security",
      short: "Cryptographic random generator",
      body:
        "Random number generator suitable for keys (browser crypto.getRandomValues / OS). Not the same as simple Math.random or a few dice rolls for real funds.",
    },
    {
      id: "PBKDF2",
      title: "PBKDF2",
      group: "Security",
      short: "Key-stretching function",
      body:
        "Used in BIP-39 to turn mnemonic + passphrase into a seed with many hash iterations (slow down guessing).",
    },
    {
      id: "CHECKSUM",
      title: "Checksum",
      group: "Security",
      short: "Typo detection",
      body:
        "BIP-39 embeds checksum bits in the last word so many typos are caught. Invalid phrases fail validation in this lab.",
    },
    {
      id: "MAINNET",
      title: "Mainnet",
      group: "Network & fees",
      short: "Real Bitcoin",
      body:
        "The live Bitcoin network (coin type 0, addresses bc1… / 1… / 3…). Coins have real value.",
    },
    {
      id: "TESTNET",
      title: "Testnet / Signet",
      group: "Network & fees",
      short: "Practice networks",
      body:
        "Networks for testing (coin type 1, often tb1… addresses). Coins are not mainnet value. This lab can derive test paths for practice.",
    },
  ];

  const byId = Object.create(null);
  TERMS.forEach(function (t) {
    byId[t.id] = t;
  });

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderGlossaryPanel() {
    const root = document.getElementById("glossaryList");
    if (!root) return;
    const q = (document.getElementById("glossarySearch") || {}).value || "";
    const query = String(q).trim().toLowerCase();
    const groups = Object.create(null);
    TERMS.forEach(function (t) {
      if (query) {
        const hay = (t.title + " " + t.short + " " + t.body + " " + t.id).toLowerCase();
        if (hay.indexOf(query) < 0) return;
      }
      if (!groups[t.group]) groups[t.group] = [];
      groups[t.group].push(t);
    });
    const order = ["BIPs", "Scripts & addresses", "Keys", "Multisig", "Network & fees", "Security"];
    let html = "";
    order.forEach(function (g) {
      const list = groups[g];
      if (!list || !list.length) return;
      html += '<div class="glossary-group"><h3>' + escapeHtml(g) + "</h3>";
      list.forEach(function (t) {
        html +=
          '<details class="glossary-item" id="gloss-' +
          escapeHtml(t.id) +
          '"><summary><strong>' +
          escapeHtml(t.title) +
          "</strong> — " +
          escapeHtml(t.short) +
          "</summary><p class=\"control-help\">" +
          escapeHtml(t.body) +
          "</p></details>";
      });
      html += "</div>";
    });
    if (!html) html = '<p class="control-help">No terms match your search.</p>';
    root.innerHTML = html;
  }

  function enhanceDataTerms() {
    document.querySelectorAll("[data-term]").forEach(function (el, idx) {
      if (el.getAttribute("data-term-ready") === "1") return;
      const key = String(el.getAttribute("data-term") || "")
        .toUpperCase()
        .replace(/-/g, "")
        .replace(/\//g, "-");
      // normalize aliases
      const aliases = {
        BIP39: "BIP39",
        BIP32: "BIP32",
        BIP44: "BIP44",
        BIP49: "BIP49",
        BIP84: "BIP84",
        BIP86: "BIP86",
        BIP67: "BIP67",
        BIP174: "BIP174",
        PSBT: "PSBT",
        SHAMIR: "SHAMIR",
        THRESHOLD: "THRESHOLD",
        SHARE: "SHARE",
        SLIP39: "SLIP39",
        "SLIP-39": "SLIP39",
        DESCRIPTOR: "DESCRIPTOR",
        DESCRIPTORS: "DESCRIPTOR",
        TEACH: "TEACH",
        "TEACH MODE": "TEACH",
        P2PKH: "P2PKH",
        P2SH: "P2SH",
        P2WPKH: "P2WPKH",
        P2WSH: "P2WSH",
        P2TR: "P2TR",
        "P2SH-P2WPKH": "P2SH-P2WPKH",
        XPUB: "XPUB",
        XPRV: "XPRV",
        YPUB: "YPUB",
        ZPUB: "ZPUB",
        WIF: "WIF",
        UTXO: "UTXO",
        "SAT/VB": "SATVB",
        SATVB: "SATVB",
        MOFN: "MOFN",
        "M-OF-N": "MOFN",
        MULTISIG: "MULTISIG",
        SEGWIT: "SEGWIT",
        TAPROOT: "TAPROOT",
        BECH32: "BECH32",
        SLIP132: "SLIP132",
        "SLIP-132": "SLIP132",
        MNEMONIC: "MNEMONIC",
        PASSPHRASE: "PASSPHRASE",
        PATH: "PATH",
        ACCOUNT: "ACCOUNT",
        CHANGE: "CHANGE",
        WATCHONLY: "WATCHONLY",
        MEMPOOL: "MEMPOOL",
        CSP: "CSP",
        AIRGAP: "AIRGAP",
        ENTROPY: "ENTROPY",
        CSPRNG: "CSPRNG",
        PBKDF2: "PBKDF2",
        MAINNET: "MAINNET",
        TESTNET: "TESTNET",
        KNOTS: "KNOTS",
        RPC: "RPC",
        SCANTXOUTSET: "SCANTXOUTSET",
        SEED: "SEED",
        HD: "HD",
        COSIGNER: "COSIGNER",
        PUBKEY: "PUBKEY",
        CHECKSUM: "CHECKSUM",
        SATOSHI: "SATOSHI",
      };
      const raw = String(el.getAttribute("data-term") || "");
      const id =
        aliases[raw.toUpperCase()] ||
        aliases[raw.toUpperCase().replace(/-/g, "")] ||
        raw.toUpperCase().replace(/-/g, "");
      const t = byId[id];
      if (!t) return;

      // If already a help-tip, fill panel
      if (el.classList.contains("help-tip")) {
        const panel = el.querySelector(".help-tip-panel");
        if (panel && !panel.getAttribute("data-filled")) {
          panel.innerHTML =
            "<strong>" +
            escapeHtml(t.title) +
            "</strong> — " +
            escapeHtml(t.short) +
            "<br /><br />" +
            escapeHtml(t.body) +
            ' <a class="gloss-link" href="index.html#glossary">Glossary</a>';
          panel.setAttribute("data-filled", "1");
        }
        el.setAttribute("data-term-ready", "1");
        return;
      }

      // Build ⓘ tip node
      const tip = document.createElement("span");
      tip.className = "help-tip gloss-term-tip";
      tip.setAttribute("data-term", t.id);
      tip.setAttribute("data-term-ready", "1");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "help-tip-btn";
      btn.setAttribute("aria-label", "About " + t.title);
      btn.textContent = "i";
      const panel = document.createElement("span");
      panel.className = "help-tip-panel";
      panel.hidden = true;
      panel.innerHTML =
        "<strong>" +
        escapeHtml(t.title) +
        "</strong> — " +
        escapeHtml(t.short) +
        "<br /><br />" +
        escapeHtml(t.body) +
        ' <a class="gloss-link" href="index.html#glossary">Full glossary</a>';
      tip.appendChild(btn);
      tip.appendChild(panel);

      el.classList.add("gloss-term");
      el.title = t.short;
      el.setAttribute("data-term-ready", "1");
      // Never nest tip inside buttons/tabs — place after element
      if (el.parentNode) {
        if (el.nextSibling) el.parentNode.insertBefore(tip, el.nextSibling);
        else el.parentNode.appendChild(tip);
      }
    });

    // Click handlers: help-ui.js (load after this file) binds .help-tip once.
  }

  function init() {
    renderGlossaryPanel();
    const search = document.getElementById("glossarySearch");
    if (search) {
      search.addEventListener("input", renderGlossaryPanel);
    }
    enhanceDataTerms();

    // Open item from hash #gloss-BIP39
    const h = (location.hash || "").replace(/^#/, "");
    if (h.indexOf("gloss-") === 0) {
      const el = document.getElementById(h);
      if (el && el.tagName === "DETAILS") {
        el.open = true;
        el.scrollIntoView({ block: "center" });
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.Bip39Glossary = { TERMS: TERMS, render: renderGlossaryPanel, byId: byId };
})();
