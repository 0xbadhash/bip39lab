/**
 * V2 use-case tracks — real BIP-39 via BIP39Lab bundle. No seed persistence.
 */
(function () {
  "use strict";
  var STORE = "bip39lab.v2";
  var mem = { mnemonic: "", lastRows: null, cardAck: false, wordCount: 12, cosigners: null, maxStep: 0, network: "test", entEvents: [], entMnemonic: "", entWordCount: 12, entPp: "" };
  var D6_BITS = 2.58;
  var ENT_PAD_MAX = 200;
  var lastEntDelta = 0;
  function emptyCosigners() {
    return [0, 1, 2].map(function () {
      return { mnemonic: "", wordCount: 12, zpub: "" };
    });
  }
  function emptyTax() {
    return {
      restore: false,
      freeze: false,
      seedAsk: false,
      spend: false,
      lose: false,
      msAlone: false,
      msSend: false,
      msPaper: false,
      who: {},
      phone: false,
      malware: false,
      hw: false,
      usb: false,
      typed: false,
      sort: { exchange: "", phone: "", hardware: "", watch: "" },
      trap: ""
    };
  }
  var ENT_BITS = { 12: 128, 15: 160, 18: 192, 21: 224, 24: 256 };
  var ENT_BYTES = { 12: 16, 15: 20, 18: 24, 21: 28, 24: 32 };
  var PSBT_MIN = "cHNidP8A";

  var TRACKS = [
    { id: 1, level: "Starter", title: "First wallet", job: "Make a practice phrase and one receive address.", done: "Phrase, numbered card, address ≠ phrase; will not fund practice." },
    { id: 2, level: "Starter", title: "Paper backup", job: "Treat the numbered card as the backup object.", done: "Card = backup; no photo/cloud of a funded phrase." },
    { id: 3, level: "Beginner", title: "Passphrase (25th word)", job: "Same words + different passphrase = different wallet.", done: "Compare A vs B; forgotten PP = loss of that vault." },
    { id: 4, level: "Beginner", title: "Path folders", job: "A path is a folder; words do not change.", done: "Toggle receive/change or index; words stay." },
    { id: 5, level: "Beginner", title: "Watch-only", job: "Export public descriptors / zpub — never the seed.", done: "Never paste seed into a watch-only app." },
    { id: 6, level: "Intermediate", title: "Shared custody multisig", job: "M-of-N from public keys.", done: "Keys ≠ BIP-39 word shares." },
    { id: 7, level: "Intermediate", title: "Split secret Shamir", job: "Educational GF(256) shares — not SLIP-39 Suite.", done: "Shares ≠ multisig cosigners." },
    { id: 8, level: "Intermediate", title: "PSBT / air-gap", job: "Inspect a partial transaction offline.", done: "Inspect → offline sign (elsewhere) → online broadcast; never paste seed." },
    { id: 9, level: "Intermediate", title: "xpub privacy", job: "Account xpub is watch-only and privacy-sensitive.", done: "xpub ≠ spend; do not publish casually." },
    { id: 10, level: "Advanced", title: "Network leak", job: "Default offline; balances only after opt-in.", done: "Unknown ≠ 0; explicit Network page only." },
    { id: 11, level: "Beginner", title: "They hold the keys", job: "An exchange or login-only app keeps the keys. You only have an account.", done: "If you never got recovery words, a company can freeze or lose the coins. If you have the words, you can spend and you can lose them." },
    { id: 12, level: "Beginner", title: "Hot wallet vs hardware signer", job: "Same words, different where they live.", done: "Phone keys = hot wallet. Hardware keeps the seed on the device. USB is not an air-gap. Typing the seed into a computer still kills the vault." },
    { id: 13, level: "Beginner", title: "Hot vs cold", job: "Online keys vs offline keys. Brand is not the split.", done: "Daily spend can be hot. Savings stay cold or watch-only. Sort exchange, phone, hardware, watch-only." },
    { id: 14, level: "Beginner", title: "Dice and coin entropy", job: "Word count is not entropy. A few rolls can still print 12 or 24 words.", done: "Few d6 = TOO LOW. Minted words can still be weak. 12-word wants ~128 bits (~50 d6). 24-word wants ~256 (~100 d6). Coin = 1 bit." },
    { id: 15, level: "Beginner", title: "Pad plus passphrase", job: "Dice pad + phrase length + passphrase estimate. A longer 25th word does not fix a short pad.", done: "Pad bits are the source. 12-word wants 128; 24-word wants 256. Passphrase is an extra secret (weak / fair / stronger) — not a substitute for rolling." }
  ];

  function $(id) { return document.getElementById(id); }
  function loadState() {
    try { return JSON.parse(sessionStorage.getItem(STORE) || "{}") || {}; } catch (e) { return {}; }
  }
  function saveState(s) {
    try { sessionStorage.setItem(STORE, JSON.stringify(s)); } catch (e) { /* ignore */ }
  }
  function completedSet() {
    var s = loadState();
    return s.completed || [];
  }
  function markComplete(id) {
    var s = loadState();
    s.completed = s.completed || [];
    if (s.completed.indexOf(id) < 0) s.completed.push(id);
    s["gate" + id] = true;
    saveState(s);
  }
  function gated(id) {
    var s = loadState();
    return !!s["gate" + id];
  }
  function setGated(id) {
    var s = loadState();
    s["gate" + id] = true;
    saveState(s);
  }

  function show(which) {
    ["viewPicker", "viewGate", "viewTrack"].forEach(function (id) {
      var el = $(id);
      if (el) el.classList.toggle("v2-hidden", id !== which);
    });
  }

  function renderPicker() {
    var grid = $("pickerGrid");
    if (!grid) return;
    var done = completedSet();
    grid.innerHTML = TRACKS.map(function (t) {
      var isDone = done.indexOf(t.id) >= 0;
      return (
        '<button type="button" class="uc-card' + (isDone ? " done" : "") + '" data-uc="' + t.id + '">' +
        '<div class="uc-id">UC' + t.id + " · " + t.level + (isDone ? " · done" : "") + "</div>" +
        "<h3>" + t.title + "</h3>" +
        '<p class="uc-job">' + t.job + "</p>" +
        '<p class="uc-done"><strong>Done when:</strong> ' + t.done + "</p>" +
        "</button>"
      );
    }).join("");
    grid.querySelectorAll("[data-uc]").forEach(function (btn) {
      btn.addEventListener("click", function () { openUc(parseInt(btn.getAttribute("data-uc"), 10)); });
    });
    show("viewPicker");
    $("panelTitle").textContent = "Use-case tracks";
    $("panelSub").textContent = "Pick a job. Tracks teach; rooms stay in the sidebar.";
  }

  function openUc(id) {
    var t = TRACKS.filter(function (x) { return x.id === id; })[0];
    if (!t) return;
    if (!gated(id)) {
      $("gateTitle").textContent = "UC" + t.id + " — " + t.title;
      $("gateScope").innerHTML =
        '<div class="v2-callout is" id="gateIs"><strong>What this is</strong>' +
        "An offline practice track. Not a funded wallet, not a signer, not a broadcaster.</div>" +
        '<div class="v2-callout isnt" id="gateIsnt"><strong>What this is not</strong>' +
        "Do not import these words into a real wallet. Do not send coins to practice addresses.</div>" +
        '<div class="v2-callout done" id="gateDone"><strong>Done when</strong>' +
        t.done +
        "</div>";
      $("btnGateStart").onclick = function () {
        setGated(id);
        startTrack(id);
      };
      show("viewGate");
      return;
    }
    startTrack(id);
  }

  var current = { id: 1, step: 0 };

  function stepsFor(id) {
    var map = {
      1: ["Generate", "Backup card", "Validate", "Exercise", "Quiz", "Finish"],
      2: ["Card is backup", "Do and do not", "Print sheet", "Quiz", "Finish"],
      3: ["Same words", "Compare A/B", "Quiz", "Finish"],
      4: ["Folders", "Toggle path", "Quiz", "Finish"],
      5: ["Public only", "Export", "Quiz", "Finish"],
      6: ["M-of-N", "Three cosigners", "Quiz", "Finish"],
      7: ["What a share is", "Split / combine", "Quiz", "Finish"],
      8: ["Air-gap model", "Inspect PSBT", "Quiz", "Finish"],
      9: ["xpub ≠ spend", "Export xpub", "Quiz", "Finish"],
      10: ["Offline default", "Opt-in Network", "Quiz", "Finish"],
      11: ["Who is they", "Company app", "You hold", "Quiz", "Finish"],
      12: ["Hot wallet on phone", "Hardware signer", "Quiz", "Finish"],
      13: ["Hot vs cold", "Daily vs savings", "Quiz", "Finish"],
      14: ["Few dice", "Words still weak", "Roll until enough", "Quiz", "Finish"],
      15: ["Pad + words", "Add passphrase", "Quiz", "Finish"]
    };
    return map[id] || ["Start", "Finish"];
  }

  function conceptsFor(id) {
    var c = {
      1: ["Entropy → words", "Backup card", "Address ≠ phrase"],
      2: ["Card object", "Hand copy only", "Passphrase stored apart"],
      3: ["Optional 25th", "New wallet", "Forgotten = loss"],
      4: ["Path = folder", "BIP purpose", "Index / change"],
      5: ["Watch-only", "zpub/xpub", "Never the seed"],
      6: ["M-of-N", "Public keys", "Not Shamir"],
      7: ["Threshold shares", "Not cosigners", "Edu hex only"],
      8: ["PSBT package", "Never sign here", "Broadcast elsewhere"],
      9: ["Account xpub", "Privacy leak", "Cannot spend"],
      10: ["connect-src none", "Address only", "unknown ≠ 0"],
      11: ["They hold", "You hold", "Not BIP-39"],
      12: ["Hot software", "Hardware", "USB ≠ air-gap"],
      13: ["Hot vs cold", "Daily vs savings", "Four objects"],
      14: ["Few dice TOO LOW", "Words still weak", "Roll until enough"],
      15: ["Pad is the source", "Passphrase extra", "Does not fix pad"]
    };
    return c[id] || ["A", "B", "C"];
  }

  function startTrack(id) {
    current = { id: id, step: 0 };
    mem.cardAck = false;
    mem.maxStep = 0;
    if (id === 6) mem.cosigners = emptyCosigners();
    if (id === 14) {
      mem.entEvents = [];
      mem.entMnemonic = "";
      mem.entWordCount = 12;
      mem.entPp = "";
      lastEntDelta = 0;
    }
    if (id === 11 || id === 12 || id === 13) {
      if (mem.exLockTimer) {
        clearInterval(mem.exLockTimer);
        mem.exLockTimer = 0;
      }
      if (mem.drainTimer) {
        clearInterval(mem.drainTimer);
        mem.drainTimer = 0;
      }
      mem.tax = emptyTax();
    }
    renderTrack();
    show("viewTrack");
  }

  function conceptTarget(id, chipIndex) {
    var map = {
      1: [0, 2, 3],
      2: [0, 1, 2],
      3: [0, 1, 2],
      4: [0, 1, 2],
      5: [0, 1, 2],
      6: [0, 1, 2],
      7: [0, 1, 2],
      8: [0, 1, 2],
      9: [0, 1, 2],
      10: [0, 1, 2],
      11: [0, 2, 3],
      12: [0, 1, 2],
      13: [0, 1, 2],
      14: [0, 1, 2]
    };
    var row = map[id] || [0, 1, 2];
    return row[chipIndex] != null ? row[chipIndex] : 0;
  }

  function jumpTo(i) {
    var names = stepsFor(current.id);
    i = i | 0;
    if (i < 0 || i >= names.length) return;
    if (i > (mem.maxStep || 0)) return;
    if (i === current.step) return;
    current.step = i;
    renderTrack();
  }

  function renderRail(names, step) {
    var html = "";
    var maxS = Math.max(0, mem.maxStep || 0);
    names.forEach(function (n, i) {
      if (i) html += '<li class="arr" aria-hidden="true">→</li>';
      var cls = i === step ? "is-current" : i < step ? "is-done" : "";
      var can = i <= maxS;
      html += '<li class="' + cls + (can ? " is-jump" : "") + '">';
      if (can) {
        html +=
          '<button type="button" class="rail-jump" data-step="' +
          i +
          '"' +
          (i === step ? ' aria-current="step"' : "") +
          '><span class="num">' +
          (i + 1) +
          '</span><span class="name">' +
          n +
          "</span></button>";
      } else {
        html += '<span class="num">' + (i + 1) + '</span><span class="name">' + n + "</span>";
      }
      html += "</li>";
    });
    return html;
  }

  function atom(n, jump, src, alt, cap) {
    return { n: n, jump: jump, src: src, alt: alt, cap: cap };
  }
  var VIZ = {
    1: {
      forStep: function (s) { if (s <= 1) return 1; if (s === 3) return 3; return 2; },
      atoms: [
        atom(1, 0, "assets/uc1-atom-entropy-words.svg", "Random bits become numbered recovery words", "<strong>Plan · Entropy to words</strong><br/>Random bits become a numbered recovery phrase. That phrase is the secret."),
        atom(2, 2, "assets/uc1-atom-phrase-ne-address.svg", "Recovery phrase is not the same as a receive address", "<strong>Practice · Phrase is not address</strong><br/>The words stay secret. The receive address is public and safe to share."),
        atom(3, 3, "assets/uc1-atom-one-to-many.svg", "One recovery phrase can derive many receive addresses", "<strong>Review · One phrase, many addresses</strong><br/>The same phrase can derive many receive addresses (different path index).")
      ]
    },
    2: {
      forStep: function (s) { if (s <= 0) return 1; if (s === 2) return 3; return 2; },
      atoms: [
        atom(1, 0, "assets/uc2-atom-card-object.svg", "The numbered card is the backup object", "<strong>Plan · Card is the backup</strong><br/>The numbered cells are the backup object. A textarea on a screen is not."),
        atom(2, 1, "assets/uc2-atom-hand-not-photo.svg", "Hand copy is not the same as a photo or a print", "<strong>Practice · Hand copy is not a photo</strong><br/>Write the cells by hand while the computer is offline. Photograph and print are not an air-gap."),
        atom(3, 2, "assets/uc2-atom-passphrase-apart.svg", "Keep the passphrase in a different place from the word sheet", "<strong>Review · Passphrase stored apart</strong><br/>If there is a passphrase, store it in a different place from this sheet.")
      ]
    },
    3: {
      atoms: [
        atom(1, 0, "assets/uc3-atom-same-words.svg", "Same recovery words on both sides", "<strong>Plan · Same words</strong><br/>Both vaults start from the same numbered card."),
        atom(2, 1, "assets/uc3-atom-new-vault.svg", "A different passphrase makes a different vault", "<strong>Practice · 25th word, new vault</strong><br/>Same words plus a different passphrase derive a different receive address."),
        atom(3, 2, "assets/uc3-atom-forgotten-loss.svg", "A forgotten passphrase cannot be reset", "<strong>Review · Forgotten is loss</strong><br/>The lab cannot reset a forgotten passphrase. That vault is gone.")
      ]
    },
    4: {
      atoms: [
        atom(1, 0, "assets/uc4-atom-path-folder.svg", "A derivation path is a folder in the seed tree", "<strong>Plan · Path is a folder</strong><br/>Change the folder and the address changes. The recovery words do not."),
        atom(2, 1, "assets/uc4-atom-index.svg", "The last number is which receive address", "<strong>Practice · Index is the last number</strong><br/>Wallets ask for a new address so you do not reuse the first one."),
        atom(3, 2, "assets/uc4-atom-words-stay.svg", "Changing path does not rewrite the recovery words", "<strong>Review · Words stay</strong><br/>Only the last path number changes. The phrase is not rewritten.")
      ]
    },
    5: {
      atoms: [
        atom(1, 0, "assets/uc5-atom-vault-stays.svg", "The twelve words stay in the vault", "<strong>Plan · Vault stays</strong><br/>The recovery words stay on paper or a hardware signer."),
        atom(2, 1, "assets/uc5-atom-viewing-key.svg", "Export a public viewing key to the hot screen", "<strong>Practice · Viewing key leaves</strong><br/>A zpub or xpub is enough to list addresses. It cannot spend."),
        atom(3, 2, "assets/uc5-atom-never-words.svg", "Never paste the twelve words into a watch app", "<strong>Review · Never the twelve words</strong><br/>Pasting the mnemonic makes a hot wallet, not watch-only.")
      ]
    },
    6: {
      atoms: [
        atom(1, 0, "assets/uc6-atom-mofn.svg", "Two of three signatures spend", "<strong>Plan · M-of-N signatures</strong><br/>N is how many keys. M is how many signatures move coins."),
        atom(2, 1, "assets/uc6-atom-three-phrases.svg", "Each cosigner has a whole recovery phrase", "<strong>Practice · Three whole phrases</strong><br/>Each cosigner keeps a full seed and shares only a zpub."),
        atom(3, 2, "assets/uc6-atom-not-shamir.svg", "Cosigner keys are not pieces of one mnemonic", "<strong>Review · Not Shamir pieces</strong><br/>These are independent keys, not shares of one secret.")
      ]
    },
    7: {
      atoms: [
        atom(1, 0, "assets/uc7-atom-one-secret.svg", "Shamir starts from one secret", "<strong>Plan · One secret</strong><br/>Shares are pieces of one blob, not cosigner keys."),
        atom(2, 1, "assets/uc7-atom-m-pieces.svg", "Any M shares rebuild the same secret", "<strong>Practice · M pieces rebuild</strong><br/>Any two of three practice shares rebuild the same hex secret."),
        atom(3, 2, "assets/uc7-atom-share-no-sign.svg", "A share cannot sign a bitcoin spend", "<strong>Review · A share cannot sign</strong><br/>Combining shares is recovery. It is not a two-person spend.")
      ]
    },
    8: {
      atoms: [
        atom(1, 0, "assets/uc8-atom-package.svg", "A PSBT is a portable unsigned package", "<strong>Plan · Package</strong><br/>A PSBT carries an incomplete spend between devices."),
        atom(2, 1, "assets/uc8-atom-no-seed.svg", "Inspect never needs the recovery phrase", "<strong>Practice · No seed</strong><br/>This card parses structure. It never asks for the twelve words."),
        atom(3, 2, "assets/uc8-atom-sign-elsewhere.svg", "Sign on a cold device and broadcast elsewhere", "<strong>Review · Sign elsewhere</strong><br/>Inspect here. Sign on a cold device you trust. Broadcast from a hot coordinator.")
      ]
    },
    9: {
      atoms: [
        atom(1, 0, "assets/uc9-atom-watch-only.svg", "An xpub is watch-only", "<strong>Plan · Watch-only</strong><br/>An account xpub or zpub derives receive addresses without spending."),
        atom(2, 1, "assets/uc9-atom-cannot-spend.svg", "An xpub cannot sign or steal coins", "<strong>Practice · Cannot spend</strong><br/>Publishing an xpub does not let anyone steal coins immediately."),
        atom(3, 2, "assets/uc9-atom-leaks-history.svg", "Publishing an xpub leaks future addresses", "<strong>Review · Leaks history</strong><br/>It still leaks future addresses and activity. Do not publish it casually.")
      ]
    },
    10: {
      atoms: [
        atom(1, 0, "assets/uc10-atom-offline.svg", "This V2 page stays offline", "<strong>Plan · Page offline</strong><br/>Crypto stays in this tab. CSP connect-src is none."),
        atom(2, 1, "assets/uc10-atom-address-only.svg", "Lookups are address-only after opt-in", "<strong>Practice · Address only</strong><br/>Network lookups use addresses you chose. Never the mnemonic."),
        atom(3, 2, "assets/uc10-atom-unknown-not-zero.svg", "A failed lookup is unknown not zero", "<strong>Review · Unknown is not zero</strong><br/>A failed balance lookup must show unknown, never silent 0.")
      ]
    },
    11: {
      forStep: function (s) { if (s <= 1) return 1; if (s === 2) return 2; return 3; },
      atoms: [
        atom(1, 0, "assets/uc11-atom-they-hold.svg", "A company holds the keys", "<strong>Plan · They hold</strong><br/>They is a company: an exchange, a login-only app, sometimes a bank bitcoin balance."),
        atom(2, 2, "assets/uc11-atom-you-hold.svg", "You hold the recovery words", "<strong>Practice · You hold</strong><br/>If you have the words, you can spend. You can also lose them."),
        atom(3, 3, "assets/uc11-atom-not-a-wallet.svg", "A company app is not your wallet", "<strong>Review · Not your wallet</strong><br/>A login is not 12 words. You cannot open that balance in another wallet.")
      ]
    },
    12: {
      atoms: [
        atom(1, 0, "assets/uc12-atom-hot-phone.svg", "A phone app is a hot wallet", "<strong>Plan · Hot wallet on phone</strong><br/>Seed, private key, and public key sit on a phone that goes online."),
        atom(2, 1, "assets/uc12-atom-hardware.svg", "A hardware signer keeps keys on a dedicated device", "<strong>Practice · Hardware signer</strong><br/>The device signs. The words should never be typed into the computer."),
        atom(3, 2, "assets/uc12-atom-usb-not-airgap.svg", "USB to a laptop is not automatically air-gap", "<strong>Review · USB is not air-gap</strong><br/>A cable to a laptop is not the same as an air-gap. Typing the seed into a computer still kills the vault.")
      ]
    },
    13: {
      atoms: [
        atom(1, 0, "assets/uc13-atom-hot-cold.svg", "Hot versus cold is about whether keys are online", "<strong>Plan · Hot versus cold</strong><br/>Hot means the keys sit on a machine that talks to the internet. Cold means they do not. Brand is not the split."),
        atom(2, 1, "assets/uc13-atom-daily-savings.svg", "Daily spend can be hot. Savings stay cold or watch-only", "<strong>Practice · Daily versus savings</strong><br/>A small hot balance for spending is a choice. Savings belong on cold keys or watch-only."),
        atom(3, 2, "assets/uc13-atom-four-objects.svg", "Exchange, phone, hardware, watch-only are four different objects", "<strong>Review · Four objects</strong><br/>Exchange account, phone app, hardware signer, watch-only xpub. Four jobs. Do not mix them.")
      ]
    },
    14: {
      atoms: [
        atom(1, 0, "assets/uc14-atom-few-dice.svg", "A few dice rolls are too little randomness", "<strong>Plan · Few dice</strong><br/>Each d6 is about 2.58 bits. Three rolls are nowhere near 128 bits, let alone 256."),
        atom(2, 1, "assets/uc14-atom-words-weak.svg", "12 or 24 words from a short pad are still TOO LOW", "<strong>Practice · Words still weak</strong><br/>Hashing a short roll log can still print 12 or 24 words. Word count is not entropy."),
        atom(3, 2, "assets/uc14-atom-coin-tedious.svg", "Keep rolling until the pad meets 128 or 256 bits", "<strong>Review · Until enough</strong><br/>12-word wants ~128 bits (~50 d6 or 128 flips). 24-word wants ~256 (~100 d6 or 256 flips). Coin = 1 bit.")
      ]
    },
    15: {
      atoms: [
        atom(1, 0, "assets/uc14-atom-few-dice.svg", "The dice pad is the entropy source", "<strong>Plan · Pad first</strong><br/>Roll until the pad meets the phrase length. The 25th word comes after."),
        atom(2, 1, "assets/uc3-atom-same-words.svg", "A passphrase is an extra secret on the same words", "<strong>Practice · Extra secret</strong><br/>Same pad words + different passphrase = different vault. Estimate is teaching-only."),
        atom(3, 2, "assets/uc3-atom-forgotten-loss.svg", "A longer passphrase does not fix a short pad", "<strong>Review · Does not fix pad</strong><br/>Weak pad + strong-looking passphrase is still a weak source. Forgotten PP still loses that vault.")
      ]
    }
  };

  function defaultVizStep(s) {
    if (s <= 0) return 1;
    if (s === 1) return 2;
    return 3;
  }

  function vizHtml(id) {
    var spec = VIZ[id];
    if (!spec) return "";
    var maxS = Math.max(0, mem.maxStep || 0);
    return (
      '<div class="uc-viz" id="uc' +
      id +
      'Viz">' +
      spec.atoms
        .map(function (a) {
          var can = a.jump <= maxS;
          return (
            '<button type="button" class="atom dim" data-atom="' +
            a.n +
            '" data-concept-step="' +
            a.jump +
            '"' +
            (can ? "" : " disabled") +
            '><img src="' +
            a.src +
            '" alt="' +
            a.alt +
            '"><p class="cap">' +
            a.cap +
            "</p></button>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function applyViz(id, step) {
    var spec = VIZ[id];
    if (!spec) return;
    var n = String((spec.forStep || defaultVizStep)(step));
    var fn = function (k) {
      k = String(k | 0);
      document.querySelectorAll("#uc" + id + "Viz [data-atom]").forEach(function (el) {
        var on = el.getAttribute("data-atom") === k;
        el.classList.toggle("hi", on);
        el.classList.toggle("dim", !on);
      });
    };
    window["uc" + id + "SetViz"] = fn;
    fn(n);
  }

  function renderConcepts(id, step, nSteps) {
    if (VIZ[id]) return vizHtml(id);
    var cs = conceptsFor(id);
    var maxS = Math.max(0, mem.maxStep || 0);
    return cs
      .map(function (t, i) {
        var target = conceptTarget(id, i);
        var can = target <= maxS;
        var nextT = i < 2 ? conceptTarget(id, i + 1) : 99;
        var here = target === step || (target < step && step < nextT) || (i === 2 && step > target);
        var cls = "c" + (here ? " hi" : "") + (can ? " is-jump" : "");
        return (
          '<button type="button" class="' +
          cls +
          '" data-concept-step="' +
          target +
          '"' +
          (can ? "" : " disabled") +
          (here ? ' aria-current="step"' : "") +
          ">" +
          t +
          "</button>"
        );
      })
      .join("");
  }

  function entropyHtml() {
    var n = mem.wordCount || 12;
    if (mem.mnemonic) {
      var wn = mem.mnemonic.trim().split(/\s+/).filter(Boolean).length;
      if (wn) n = wn;
    }
    var bits = ENT_BITS[n] || 128;
    return (
      '<div class="v2-os-ent" id="v2OsEnt">' +
      lockHtml("os") +
      '<p class="v2-entropy" id="v2Entropy">' +
      "<strong>Entropy</strong>" +
      '<span class="bits">' +
      bits +
      " bits</span>" +
      "<span> · " +
      n +
      "-word BIP-39 English. Longer phrase = more random bits from the operating system. Practice only. Do not fund it.</span>" +
      "</p></div>"
    );
  }

  function replaceOsEntropy() {
    var wrap = $("v2OsEnt");
    var html = entropyHtml();
    if (wrap) wrap.outerHTML = html;
    else if ($("v2Entropy")) $("v2Entropy").outerHTML = html;
  }

  function wordGridHtml(m, gridId) {
    var words = (m || "").trim().split(/\s+/).filter(Boolean);
    if (!words.length) return '<p class="control-help">Generate to fill this backup.</p>';
    var n = words.length;
    if (gridId === undefined) gridId = "v2WordGrid";
    var html = '<ol class="word-grid"' + (gridId ? ' id="' + gridId + '"' : "") + ">";
    for (var i = 0; i < n; i++) {
      html += '<li><span class="wi">' + (i + 1) + '</span><span class="ww">' + words[i] + "</span></li>";
    }
    html += "</ol>";
    html += '<span class="stamp-warn">This card is a practice backup. Not a wallet.</span>';
    return html;
  }

  async function ensurePhrase(n) {
    n = n || mem.wordCount || 12;
    if (!mem.mnemonic && window.BIP39Lab) {
      mem.mnemonic = await BIP39Lab.generateMnemonic(n);
    }
    return mem.mnemonic;
  }

  async function renderTrack() {
    var t = TRACKS.filter(function (x) { return x.id === current.id; })[0];
    var names = stepsFor(current.id);
    var step = current.step;
    mem.maxStep = Math.max(mem.maxStep || 0, step);
    $("panelTitle").textContent = "UC" + t.id + " · " + t.title;
    $("panelSub").textContent = t.job;
    $("trackRail").innerHTML = renderRail(names, step);
    $("trackProgress").textContent = (step + 1) + " / " + names.length;
    $("conceptStrip").innerHTML = renderConcepts(current.id, step, names.length);
    var body = $("trackBody");
    body.innerHTML = "<p class=\"control-help\">Loading…</p>";
    try {
      body.innerHTML = await stepHtml(current.id, step);
    } catch (e) {
      body.innerHTML = '<p class="msg-bad">' + (e && e.message ? e.message : e) + "</p>";
    }
    wireStep();
    if (window.Bip39Glossary && typeof Bip39Glossary.enhance === "function") {
      Bip39Glossary.enhance();
    }
    applyViz(current.id, current.step);
  }

  async function stepHtml(id, step) {
    if (id === 1) return uc1(step);
    if (id === 2) return uc2(step);
    if (id === 3) return uc3(step);
    if (id === 4) return uc4(step);
    if (id === 5) return uc5(step);
    if (id === 6) return uc6(step);
    if (id === 7) return uc7(step);
    if (id === 8) return uc8(step);
    if (id === 9) return uc9(step);
    if (id === 10) return uc10(step);
    if (id === 11) return uc11(step);
    if (id === 12) return uc12(step);
    if (id === 13) return uc13(step);
    if (id === 14) return uc14(step);
    if (id === 15) return uc15(step);
    return "";
  }

  async function uc1(step) {
    if (step === 0) {
      return pad(
        "<h2>Generate a practice phrase</h2>" +
        doDont(
          "Generate a practice phrase in this tab and look at the numbered card first.",
          "Do not import these words into a funded wallet. Do not send coins to addresses from this phrase."
        ) +
        generateExplainerHtml() +
        entropyHtml() +
        wordCountSelectHtml() +
        '<div class="row v2-gen-bar" id="v2GenRow">' +
        '<div class="v2-gen-left">' +
        '<button type="button" class="btn" id="v2Generate">Generate</button>' +
        mnemonicHelpHtml(true) +
        "</div>" +
        "</div>" +
        '<div id="v2Card">' + wordGridHtml(mem.mnemonic) + "</div>" +
        '<div id="v2AddrWrap" class="v2-hidden"></div>' +
        pauseBtn("I generated a practice phrase", !mem.mnemonic)
      );
    }
    if (step === 1) {
      await ensurePhrase();
      return pad(
        "<h2>Look at the numbered backup card</h2>" +
        doDont(
          "Read the numbered cells. The card is the backup object.",
          "Do not treat the receive address as the backup. The address is not the words."
        ) +
        desc(
          "This screen is only about looking at the numbered cells. Each cell has a number and a word. That grid is what you would write on paper as a backup. It is practice. It is not a funded wallet."
        ) +
        entropyHtml() +
        wordGridHtml(mem.mnemonic) +
        '<label class="check"><input type="checkbox" id="v2CardAck" ' + (mem.cardAck ? "checked" : "") + "/> I looked at the backup card (indexes + words).</label>" +
        pauseBtn("Continue to Validate", !mem.cardAck)
      );
    }
    if (step === 2) {
      await ensurePhrase();
      var gated = !mem.cardAck;
      var derived = !!(mem.lastRows && mem.lastRows.length);
      return pad(
        "<h2>Validate &amp; derive</h2>" +
        doDont(
          "Keep the numbered card in view so you see the source of the addresses.",
          "Do not send coins to these practice addresses."
        ) +
        desc(
          "The numbered list of words is your backup. The computer turns those words into a hidden number called a seed. From that seed it can make payment addresses. Test uses tb1… strings. Mainnet uses bc1… strings. The words are not the seed. The seed is not the address. They are three different things. Click Validate and derive to see addresses. This is not a wallet you should fund.",
          "v2DeriveHelp"
        ) +
        entropyHtml() +
        pipeHtml(true, derived, derived) +
        '<div id="v2Card">' +
        wordGridHtml(mem.mnemonic) +
        "</div>" +
        (gated
          ? '<p class="msg-bad">Validate is locked until you ack the backup card (previous step).</p>'
          : "") +
        '<div class="row v2-gen-bar" id="v2DeriveRow">' +
        '<div class="v2-gen-left">' +
        '<button type="button" class="btn" id="v2Derive" ' +
        (gated ? "disabled" : "") +
        ">Validate &amp; derive</button>" +
        netSelectHtml() +
        "</div>" +
        "</div>" +
        '<div id="v2AddrWrap">' +
        (derived ? addrHtml() : '<p class="control-help">Addresses stay hidden until you click Validate and derive.</p>') +
        "</div>" +
        pauseBtn("I see an address that is not the phrase", !derived)
      );
    }
    if (step === 3) {
      var n = mem.wordCount || 12;
      return pad(
        "<h2>Exercise</h2>" +
        doDont(
          "Try another word count. Entropy bits change with length.",
          "Do not fund any of these practice phrases or their addresses."
        ) +
        desc(
          "Try a different length: 12, 15, 18, 21, or 24 words. A longer phrase uses more random bits from the operating system. Each new phrase is still practice. Do not send money to it or to addresses that come from it."
        ) +
        entropyHtml() +
        wordCountSelectHtml() +
        '<div class="row v2-gen-bar">' +
        '<div class="v2-gen-left">' +
        '<button type="button" class="btn secondary" id="v2Regen">Regenerate ' +
        n +
        "-word phrase</button>" +
        mnemonicHelpHtml(true) +
        "</div>" +
        "</div>" +
        '<div id="v2Card">' + wordGridHtml(mem.mnemonic) + "</div>" +
        pauseBtn("I tried regenerating", false)
      );
    }
    if (step === 4) {
      return quiz(
        "If you send coins to an address from this Lab phrase, what is true?",
        [
          {
            k: "bad",
            t: "The lab will refund me.",
            why: "Wrong. This tab never holds your coins and has no refund desk. A practice address that receives real bitcoin is at risk."
          },
          {
            k: "ok",
            t: "Those coins are at risk. This is not a wallet you should fund.",
            okwhy: "Correct. Practice phrases and addresses are not a funded wallet."
          },
          {
            k: "bad",
            t: "The address is the same as the recovery words.",
            why: "Wrong. The receive string (tb1q / bc1q) is not the numbered word list. Same seed, different objects."
          }
        ]
      );
    }
    return finishHtml(1);
  }

  async function uc2(step) {
    if (step === 0) {
      return pad(
        "<h2>The numbered card is the backup</h2>" +
        doDont(
          "Treat the numbered cells as the backup object.",
          "Do not treat a textarea on a screen as the backup."
        ) +
        desc(
          "A backup is the numbered cells: each number next to a word. That is what you would write by hand. A box of text on a computer is not the backup. This card is practice only."
        ) +
        wordCountSelectHtml() +
        '<div class="row v2-gen-bar" id="v2GenRow">' +
        '<div class="v2-gen-left">' +
        '<button type="button" class="btn" id="v2Generate">Generate practice card</button>' +
        mnemonicHelpHtml(true) +
        "</div>" +
        "</div>" +
        '<div id="v2Card">' +
        wordGridHtml(mem.mnemonic) +
        "</div>" +
        '<label class="check"><input type="checkbox" id="v2CardAck" ' +
        (mem.cardAck ? "checked" : "") +
        "/> I looked at the backup card (indexes and words). The card is the backup.</label>" +
        pauseBtn("The card is the backup", !mem.mnemonic || !mem.cardAck)
      );
    }
    if (step === 1) {
      await ensurePhrase();
      return pad(
        "<h2>Do this. Do not do that.</h2>" +
        doDont(
          "Copy the numbered cells by hand onto paper you control. Keep any passphrase in a different place from this sheet.",
          "Do not photograph the sheet. Do not store it in a cloud drive, chat, or email. Do not keep it on a networked phone if the phrase is funded.",
          "v2DoNotList"
        ) +
        desc(
          "If these words were real money, you would copy them by hand while the computer is offline. Do not photograph the sheet. Do not keep a passphrase on the same paper as the words."
        ) +
        ppKeyHeroHtml(
          '<p class="control-help" style="margin:0">The key is the optional extra secret (passphrase). Store it in a different place from this word sheet.</p>',
          "v2PpKeyUc2"
        ) +
        mnemonicHelpHtml(true) +
        '<p class="control-help">These rules apply to a funded recovery phrase. This lab card is practice.</p>' +
        pauseBtn("I can state what to do and what not to do", false)
      );
    }
    if (step === 2) {
      await ensurePhrase();
      return pad(
        "<h2>Print is optional, after you confirm</h2>" +
        doDont(
          "If you print, treat it as classroom layout only.",
          "Do not use a printed practice sheet for real funds. Print is not an air-gap."
        ) +
        '<p class="control-help" id="v2PrintHelp">Print from this lab is not an air-gap. Prefer a hand copy offline, and not to print, if the phrase is funded.</p>' +
        '<label class="check"><input type="checkbox" id="v2PrintAck"/> I am printing a practice sheet only. I will not photograph a funded phrase on a networked phone.</label>' +
        '<div class="row" style="margin-top:0.65rem">' +
        '<button type="button" class="btn secondary" id="v2Print" disabled>Print practice sheet</button>' +
        "</div>" +
        pauseBtn("Print is optional after I confirm", false)
      );
    }
    if (step === 3) {
      return pad(
        "<h2>Quiz</h2>" +
        "<p>Four sentences. Choose the two that are right. Both right sentences must be selected to continue.</p>" +
        '<div class="quiz-opts" id="v2Uc2Quiz">' +
        '<button type="button" class="btn secondary" data-quiz="bad">1 · Photograph the sheet, or print it from this computer.<span class="v2-quiz-why" hidden>Wrong. Photograph and print from this computer put the words on a camera or a printer path. That is not the backup discipline.</span></button>' +
        '<button type="button" class="btn secondary" data-quiz="ok" id="v2Qhand">2 · Write the numbered cells by hand while the computer is offline.<span class="v2-quiz-why" hidden>Correct. Hand copy offline is the backup discipline.</span></button>' +
        '<button type="button" class="btn secondary" data-quiz="ok" id="v2Qprint">3 · Photograph and print from this lab are not the most secure, because the words are on the computer (not an air-gap).<span class="v2-quiz-why" hidden>Correct. Print and photos are not an air-gap.</span></button>' +
        '<button type="button" class="btn secondary" data-quiz="bad">4 · Print is as secure as an air-gapped handwritten copy.<span class="v2-quiz-why" hidden>Wrong. Print is not an air-gap: the words were already on the computer.</span></button>' +
        "</div>" +
        '<div id="v2QuizMsg"></div>' +
        pauseBtn("Continue", true)
      );
    }
    return finishHtml(2);
  }

  async function uc3(step) {
    if (step === 0) {
      var n = mem.wordCount || 12;
      return pad(
        "<h2>Same words</h2>" +
        doDont(
          "Leave passphrase A empty and put a practice word in B (for example test) to see two wallets from one card.",
          "Do not treat the passphrase as a PIN on the same wallet. Forgotten passphrase means that vault is gone."
        ) +
        desc(
          "The optional extra secret (sometimes called the 25th word) is mixed with the recovery words. Same words plus a different extra secret make a different wallet. Forgetting that extra secret means that wallet cannot be opened from the words alone."
        ) +
        ppKeyHtml("v2PpKeyUc3a") +
        entropyHtml() +
        wordCountSelectHtml() +
        '<div class="row v2-gen-bar">' +
        '<div class="v2-gen-left">' +
        '<button type="button" class="btn" id="v2Generate">Generate</button>' +
        '<button type="button" class="btn secondary" id="v2Regen">Regenerate ' + n + "-word phrase</button>" +
        mnemonicHelpHtml(true) +
        "</div>" +
        "</div>" +
        '<div id="v2Card">' + wordGridHtml(mem.mnemonic) + "</div>" +
        pauseBtn("Same words, two vaults", !mem.mnemonic)
      );
    }
    if (step === 1) {
      await ensurePhrase();
      return pad(
        "<h2>Compare A vs B</h2>" +
        doDont(
          "Compare two passphrases against the same words. Read the verdict.",
          "Do not fund either practice address."
        ) +
        desc(
          "Type two extra secrets (A and B) against the same words. Compare the first receive address. If the addresses differ, you have two wallets. If they match, you typed the same extra secret twice."
        ) +
        callout("is", "What you are comparing", "Same BIP-39 words. Different optional passphrase. Different receive addresses. Public addresses only.") +
        ppKeyHeroHtml(
          '<label class="field">Passphrase A <input id="ppA" type="text" placeholder="(empty = no passphrase)" autocomplete="off"/></label>' +
          '<label class="field">Passphrase B <input id="ppB" type="text" value="test" autocomplete="off"/></label>' +
          '<button type="button" class="btn" id="v2Cmp">Compare A vs B at index 0</button>' +
          '<div id="v2CmpOut" class="control-help">Click Compare. The verdict names the passphrases you typed. It does not say empty when a field has text.</div>',
          "v2PpKeyUc3b"
        ) +
        pauseBtn("I compared two passphrases", true)
      );
    }
    if (step === 2) {
      return quiz("If you forget the passphrase for a vault:", [
        {
          k: "ok",
          t: "That vault’s coins are not recoverable from the recovery words alone.",
          okwhy: "Correct. Same words without that passphrase open a different vault."
        },
        {
          k: "bad",
          t: "Lab can reset it.",
          why: "Wrong. The lab cannot recover a forgotten passphrase. There is no reset desk."
        },
        {
          k: "bad",
          t: "The addresses stay the same.",
          why: "Wrong. A different passphrase derives different addresses. They do not stay the same."
        }
      ]);
    }
    return finishHtml(3);
  }

  async function uc4(step) {
    await ensurePhrase();
    if (step === 0) {
      return pad(
        "<h2>Path = folder</h2>" +
        doDont(
          "A derivation path is a folder inside the seed tree. Change the folder, the address changes. The recovery words do not change.",
          "Do not think a new path makes a new recovery phrase. The path is not the seed."
        ) +
        desc(
          "Think of a path as a folder inside the backup. The words stay the same. Changing the folder changes which payment address you get. The path is not a new backup."
        ) +
        callout(
          "done",
          "What each piece means (this lab, BIP84 test)",
          "<code>m</code> = master (from the words). " +
          "<code>84'</code> = native segwit purpose (addresses start with tb1q / bc1q). " +
          "<code>1'</code> = test network coin type (0' would be mainnet). " +
          "<code>0'</code> = first account slot. " +
          "<code>0</code> = receive (1 would be change). " +
          "<code>0</code> at the end = first address in that folder (index)."
        ) +
        '<p class="v2-path-big" id="v2PathDemo">m/84\'/1\'/0\'/0/0</p>' +
        "<p class=\"control-help\">Hardened levels use an apostrophe (purpose, coin, account). Same words. Different BIP purpose = different address shape. This track uses BIP84.</p>" +
        pauseBtn("Path is a folder", false)
      );
    }
    if (step === 1) {
      var p0 = window.BIP39Lab ? BIP39Lab.formatPath(84, "test", 0, 0, 0) : "m/84'/1'/0'/0/0";
      return pad(
        "<h2>Why toggle the index?</h2>" +
        doDont(
          "Click to raise the last path number so you see the next receive address.",
          "Do not think a new index is a new recovery phrase. The words stay the same."
        ) +
        desc(
          "Index 0 is the first payment address in this folder. Index 1 is the next. Wallets ask for a new address so you do not reuse the first one. The words stay the same. Only the last number in the path changes."
        ) +
        callout(
          "done",
          "Index is which receive address in this folder",
          "Wallets ask for a new address so you do not reuse the first one. Index 0 is the first receive address. Index 1 is the next. The words stay the same. Only the last number in the path changes. Click to see the address string change while the card does not."
        ) +
        '<p class="v2-path-big" id="v2PathLine">' + p0 + "</p>" +
        '<div class="row" style="flex-wrap:wrap;gap:0.5rem">' +
        '<button type="button" class="btn" id="v2Idx">Show index 1 (next receive address)</button>' +
        '<button type="button" class="btn secondary" id="v2IdxZero">Back to index 0</button>' +
        "</div>" +
        '<p class="control-help">Full receive address at this index (BIP84 test)</p>' +
        '<code class="v2-preview-big" id="v2Tail">Index 0 loads first. Each Next click adds 1 to the last path number.</code>' +
        pauseBtn("I changed the folder index", true)
      );
    }
    if (step === 2) {
      return quiz("Changing the derivation path:", [
        {
          k: "ok",
          t: "Changes the address; the words stay the same.",
          okwhy: "Correct. Only the folder index in the path changes."
        },
        {
          k: "bad",
          t: "Rewrites the mnemonic.",
          why: "Wrong. The recovery words stay put. Only the last numbers in the path change."
        },
        {
          k: "bad",
          t: "Broadcasts a transaction.",
          why: "Wrong. Changing a folder path is local math. Nothing is sent to the network."
        }
      ]);
    }
    return finishHtml(4);
  }

  async function uc5(step) {
    if (step === 0) {
      return pad(
        "<h2>Watch-only is public material. " + termI("WATCHONLY") + "</h2>" +
        doDont(
          "Give a watch-only app an xpub, zpub, or descriptor (click i on those words on the next pad).",
          "Do not paste the recovery phrase or seed into a watch-only app."
        ) +
        desc(
          "A watch-only app can list payment addresses and incoming payments. It should receive a public viewing key, not the recovery words. If you type the words into that app, it becomes a full wallet that can spend."
        ) +
        pauseBtn("Seed stays out of watch apps", false)
      );
    }
    if (step === 1) {
      await ensurePhrase();
      return pad(
        "<h2>Export. " + termI("WATCHONLY") + "</h2>" +
        doDont(
          "Export a public viewing key so a phone or desktop can list addresses and incoming payments while the twelve words stay on paper or a hardware signer.",
          "Do not export by typing the recovery phrase into the watch app. That is a full wallet, not watch-only."
        ) +
        desc(
          "Refresh to see public account keys from this practice phrase (xpub, zpub, ypub). You should not see the recovery words. A zpub is the usual native-segwit viewing key. An xpub is a different prefix (often older wallets)."
        ) +
        callout(
          "done",
          "Why you need this (not obvious)",
          "A watch-only app cannot derive the next receive address from nothing. Export is the hand-off: the vault gives the hot screen a public viewing key, not the seed. Without this, people paste the twelve words into every app that “just wants to show a balance.”"
        ) +
        '<p class="control-help">Jargon on this pad: ' +
        "xpub " + termI("XPUB") +
        " · zpub " + termI("ZPUB") +
        " · ypub " + termI("YPUB") +
        " · descriptor " + termI("DESCRIPTOR") +
        " · watch-only " + termI("WATCHONLY") +
        "</p>" +
        callout(
          "done",
          "Public only",
          "Refresh to show watch-only keys from this practice phrase. You should see xpub or zpub, not the twelve words. Lines under --- output descriptors --- are the same public material as an import string (wpkh / tr / sh / pkh) — click (i) on descriptor."
        ) +
        '<button type="button" class="btn" id="v2Wo">Refresh watch-only</button>' +
        '<pre class="out" id="v2WoOut">Click refresh — public keys only.</pre>' +
        pauseBtn("I saw a zpub/xpub, not the seed", false)
      );
    }
    if (step === 2) {
      return quiz("A watch-only wallet should receive:", [
        {
          k: "ok",
          t: "An xpub/zpub or descriptor — never the mnemonic.",
          okwhy: "Correct. That is a public viewing key, not spend authority."
        },
        {
          k: "bad",
          t: "The recovery words so it can “just work”.",
          why: "Wrong. Pasting the mnemonic makes a hot spend wallet, not watch-only."
        },
        {
          k: "bad",
          t: "Your passphrase in the same photo.",
          why: "Wrong. The passphrase is a spend secret. Watch-only gets a public key, never the 25th word."
        }
      ]);
    }
    return finishHtml(5);
  }

  function cosignerCardHtml(i) {
    if (!mem.cosigners) mem.cosigners = emptyCosigners();
    var c = mem.cosigners[i];
    var letter = ["A", "B", "C"][i];
    return (
      '<div class="v2-cosigner" data-cs="' +
      i +
      '">' +
      "<h3>Cosigner " +
      letter +
      " — own phrase</h3>" +
      wordCountSelectHtml("v2CsWc" + i, c.wordCount || 12) +
      '<div class="row" style="flex-wrap:wrap;gap:0.45rem">' +
      '<button type="button" class="btn" data-cs-gen="' +
      i +
      '">Generate phrase</button>' +
      '<button type="button" class="btn secondary" data-cs-zpub="' +
      i +
      '"' +
      (c.mnemonic ? "" : " disabled") +
      ">Show BIP84 zpub</button>" +
      '<button type="button" class="btn danger" data-cs-clear="' +
      i +
      '">Clear this</button>' +
      "</div>" +
      '<div class="v2-cs-card">' +
      wordGridHtml(c.mnemonic, "v2CsGrid" + i) +
      "</div>" +
      '<pre class="out" id="v2CsZpub' +
      i +
      '">' +
      (c.zpub || "Generate first. The shared string is a zpub (BIP-84 native segwit), not xpub and not the words.") +
      "</pre>" +
      "</div>"
    );
  }

  async function uc6(step) {
    if (step === 0) {
      return pad(
        "<h2>M-of-N is a spend rule</h2>" +
        doDont(
          "Read M as how many signatures are required, N as how many independent keys exist. 2-of-3 means any two of three people can spend. Each person keeps a full recovery phrase.",
          "Do not read M-of-N as cutting one BIP-39 phrase into N pieces. That is Shamir (UC7), not this track."
        ) +
        desc(
          "Here N is how many people have a key (three). M is how many of them must sign to move coins (two). Each person keeps a full recovery phrase. You share public keys, not the words."
        ) +
        callout(
          "done",
          "M and N in one sentence",
          "N = number of cosigners, here 3. " +
            termI("COSIGNER") +
            "<br />M = signatures needed to move coins, here 2." +
            "<br />Multisig " +
            termI("MULTISIG") +
            " " +
            termI("MOFN") +
            " builds one vault address from N public keys. Two signatures required. One lost seed is painful, not always fatal."
        ) +
        '<div class="v2-mofn" id="v2MofnPic" aria-label="2 of 3">' +
        "<span><strong>N = 3</strong> keys (A, B, C)</span>" +
        "<span><strong>M = 2</strong> signatures to spend</span>" +
        "<span>A+B · A+C · B+C all work. A alone does not.</span>" +
        "</div>" +
        callout(
          "isnt",
          "Not BIP-39 shares",
          "A share " +
            termI("SHARE") +
            " cannot sign. Combining Shamir " +
            termI("SHAMIR") +
            " pieces rebuilds one secret. This pad is many keys, not pieces of one mnemonic " +
            termI("BIP39") +
            "."
        ) +
        '<p class="control-help">Next pad: three practice phrases so you see where the three public keys come from.</p>' +
        pauseBtn("I can say what M and N are", false)
      );
    }
    if (step === 1) {
      if (!mem.cosigners) mem.cosigners = emptyCosigners();
      var ready = mem.cosigners.every(function (c) {
        return c && c.zpub;
      });
      return pad(
        "<h2>Three cosigners, three phrases</h2>" +
        doDont(
          "Generate three different practice phrases. Keep the words. Share only the zpub from each phrase.",
          "Do not paste any of the three seeds into chat, Discord, or a coordinator. Do not treat the three zpubs as slices of one mnemonic."
        ) +
        desc(
          "Make three different practice phrases, one per cosigner. Keep the words. Show the zpub for each phrase. That zpub is what a coordinator would see. It is not a slice of one mnemonic."
        ) +
        callout(
          "done",
          "Where the public key comes from",
          "Each cosigner is a whole BIP-39 phrase. Show BIP84 zpub " +
            termI("ZPUB") +
            " derives the account public key at m/84'/0'/0'." +
            "<br />The string starts with zpub, not xpub " +
            termI("XPUB") +
            ". xpub is a different prefix (often legacy). You would hand the zpub to a coordinator. You keep the words."
        ) +
        callout(
          "warn",
          "Practice only",
          "These three phrases are throwaway. This is not a funded 2-of-3 policy. 2-of-3 would use these three public keys — not three pieces of one mnemonic."
        ) +
        '<div class="v2-cosigners">' +
        cosignerCardHtml(0) +
        cosignerCardHtml(1) +
        cosignerCardHtml(2) +
        "</div>" +
        '<div class="row" style="flex-wrap:wrap;gap:0.45rem">' +
        '<button type="button" class="btn danger" id="v2CsClearAll">Clear all three secrets</button>' +
        '<a class="btn secondary" href="../multisig.html">Open Multisig room (full M-of-N build)</a>' +
        "</div>" +
        (ready
          ? '<p class="msg-ok" id="v2CsReady">Three zpubs ready. Those are what a 2-of-3 coordinator would see — not the words.</p>'
          : '<p class="control-help">Pause stays locked until each cosigner shows a zpub.</p>') +
        pauseBtn("I saw three zpubs from three phrases", !ready)
      );
    }
    if (step === 2) {
      return quiz("2-of-3 multisig keys are:", [
        {
          k: "ok",
          t: "Independent public keys / cosigners — not Shamir word shares.",
          okwhy: "Correct. Each key is a whole wallet. M signatures of N keys, not M pieces of one secret."
        },
        {
          k: "bad",
          t: "Three pieces of one mnemonic.",
          why: "Wrong. Those would be Shamir shares of one secret (UC7). 2-of-3 here is three independent keys; any two signatures spend."
        },
        {
          k: "bad",
          t: "A reason to paste the seed into Discord.",
          why: "Wrong. You share public keys or zpubs to build the vault. The seed never goes in chat."
        }
      ]);
    }
    return finishHtml(6);
  }

  async function uc7(step) {
    if (step === 0) {
      return pad(
        "<h2>What a share is</h2>" +
        doDont(
          "Treat this demo as an educational split of one secret into hex shares. M shares rebuild that same secret.",
          "Do not treat these shares as Trezor Suite / SLIP-39 word lists. Do not treat them as multisig cosigner keys (that was UC6)."
        ) +
        desc(
          "This is one secret cut into pieces. Any two of three pieces rebuild the same secret. A piece cannot sign a bitcoin spend. That is different from UC6, where each person has a whole key."
        ) +
        callout(
          "done",
          "One secret, many pieces",
          "Shamir " +
            termI("SHAMIR") +
            " takes one blob and makes N shares " +
            termI("SHARE") +
            ".<br />Any M of them rebuild the blob. A share cannot sign a bitcoin spend. Combining shares is recovery, not a 2-person signature."
        ) +
        callout(
          "isnt",
          "Not the Shamir room yet",
          "The next pad splits a practice secret in this track. The Shamir room is a longer GF(256) lab — optional, after you have seen split/combine here. It is not SLIP-39 " +
            termI("SLIP39") +
            "."
        ) +
        pauseBtn("Shares are not multisig keys", false)
      );
    }
    if (step === 1) {
      var did = !!(mem.shamirDone);
      return pad(
        "<h2>Split / combine</h2>" +
        doDont(
          "Split a practice hex secret 2-of-3 and recombine two shares here.",
          "Do not fund these shares. They are not Trezor SLIP-39."
        ) +
        desc(
          "Click to split a throwaway hex secret into three pieces and rebuild it from two of them. These hex shares are educational. They are not Trezor Suite word shares. Do not fund them."
        ) +
        callout("warn", "Never fund", "Hex shares in this lab are practice. Do not use them for real funds. They are not Trezor SLIP-39.") +
        '<button type="button" class="btn" id="v2Sh">Split practice secret 2-of-3</button>' +
        '<pre class="out" id="v2ShOut">' +
        (did ? "Already split once this session. Click again to make a new practice secret." : "Hex shares — never fund.") +
        "</pre>" +
        '<p class="control-help">Optional deeper lab (same idea, more controls): ' +
        '<a href="../shamir.html">Open Shamir room</a>' +
        " — educational GF(256) only, not Suite, not UC6 keys.</p>" +
        pauseBtn("I split and recombined", !did)
      );
    }
    if (step === 2) {
      return quiz("Shamir shares in this lab:", [
        {
          k: "ok",
          t: "Are an educational split of one secret — not SLIP-39 production.",
          okwhy: "Correct. Hex shares here teach threshold recovery, not a Trezor backup."
        },
        {
          k: "bad",
          t: "Are Trezor Suite compatible by default.",
          why: "Wrong. This lab’s hex shares are educational GF(256). They are not SLIP-39 / Trezor Suite words."
        },
        {
          k: "bad",
          t: "Replace multisig on mainnet.",
          why: "Wrong. Combining shares rebuilds one secret. It does not replace M-of-N signatures from separate keys (UC6)."
        }
      ]);
    }
    return finishHtml(7);
  }

  async function uc8(step) {
    if (step === 0) {
      return pad(
        "<h2>Air-gap model</h2>" +
        doDont(
          "Inspect the package here. Sign on a cold device you trust. Broadcast from a hot coordinator you choose.",
          "Do not paste a seed to help a PSBT. This card never signs and never broadcasts."
        ) +
        desc(
          "A PSBT is a package for an incomplete payment. You can inspect it here. You would sign it on a cold device you trust and broadcast it from a hot computer you choose. This page never signs and never sends it to the network."
        ) +
        pauseBtn("I will not paste a seed to help a PSBT", false)
      );
    }
    if (step === 1) {
      return pad(
        "<h2>Inspect</h2>" +
        doDont(
          "Inspect the sample package offline.",
          "Do not paste a seed. This card never signs and never broadcasts."
        ) +
        desc(
          "Click inspect to read the sample package: magic bytes, maps, inputs, outputs. No signature is added. The recovery words are not needed."
        ) +
        callout("done", "Structure only", "A sample PSBT is parsed offline. No signature is added.") +
        '<button type="button" class="btn" id="v2Psbt">Inspect sample PSBT</button>' +
        '<pre class="out" id="v2PsbtOut">Structure only.</pre>' +
        pauseBtn("Inspected structure, no sign", false)
      );
    }
    if (step === 2) {
      return quiz("This lab’s PSBT tool:", [
        {
          k: "ok",
          t: "Parses structure offline and never signs or broadcasts.",
          okwhy: "Correct. Inspect is structure only."
        },
        {
          k: "bad",
          t: "Sends the seed to a coordinator.",
          why: "Wrong. Inspect never uploads a seed. A PSBT is a transaction package, not a mnemonic."
        },
        {
          k: "bad",
          t: "Finalizes mainnet spends.",
          why: "Wrong. This card parses framing offline. It does not finalize or broadcast."
        }
      ]);
    }
    return finishHtml(8);
  }

  async function uc9(step) {
    if (step === 0) {
      return pad(
        "<h2>xpub is not spend</h2>" +
        doDont(
          "Treat an account xpub as watch-only: software can derive receive addresses.",
          "Do not publish an xpub casually. It cannot sign, but it leaks future addresses and history. It is not the recovery phrase."
        ) +
        desc(
          "An account xpub or zpub can list future payment addresses. It cannot move coins. It is still private in another way: anyone with it can see activity. It is not the recovery words."
        ) +
        pauseBtn("xpub is watch-only and leaky", false)
      );
    }
    if (step === 1) {
      await ensurePhrase();
      return pad(
        "<h2>Export account xpub. " + termI("XPUB") + " " + termI("ZPUB") + "</h2>" +
        doDont(
          "Show the BIP-84 watch key. You should see a zpub or xpub.",
          "Do not expect an xprv or the twelve words on this pad."
        ) +
        desc(
          "Show the BIP-84 watch key for this practice phrase. You should see a zpub (or xpub). You should not see an xprv or the recovery words."
        ) +
        callout("is", "Public extended key", "You should see an xpub or zpub. You should not see an xprv " + termI("XPRV") + ", or the recovery words.") +
        '<button type="button" class="btn" id="v2Xpub">Show BIP84 watch key</button>' +
        '<pre class="out" id="v2XpubOut">Public extended key only.</pre>' +
        pauseBtn("I did not see an xprv", false)
      );
    }
    if (step === 2) {
      return quiz("Publishing an xpub:", [
        {
          k: "ok",
          t: "Does not spend coins but leaks future addresses / activity.",
          okwhy: "Correct. Watch-only and leaky, not spend."
        },
        {
          k: "bad",
          t: "Lets anyone steal funds immediately.",
          why: "Wrong. An xpub cannot sign. It can leak future addresses and history."
        },
        {
          k: "bad",
          t: "Is the same as the recovery words.",
          why: "Wrong. The xpub is a public account key. The recovery words can spend."
        }
      ]);
    }
    return finishHtml(9);
  }

  async function uc10(step) {
    if (step === 0) {
      return pad(
        "<h2>Lab stays offline</h2>" +
        doDont(
          "Keep this V2 page offline (CSP connect-src none). If a balance is unknown, treat it as unknown.",
          "Do not read a missing lookup as zero coins."
        ) +
        desc(
          "This V2 page does not call the internet for balances. Crypto stays in this tab. If a later lookup fails, the honest answer is unknown, not zero coins."
        ) +
        pauseBtn("Default is offline", false)
      );
    }
    if (step === 1) {
      return pad(
        "<h2>Explicit opt-in</h2>" +
        doDont(
          "Look up only addresses you chose, after opt-in on Network.",
          "Do not send the mnemonic. Lookups are address-only."
        ) +
        desc(
          "Fees and balances live on the Network page after you opt in. Lookups use payment addresses you chose. Never send the recovery words to a balance site."
        ) +
        callout(
          "warn",
          "Network room",
          "Live fees and balances live on the Network page after you opt in. Lookups are address-only. Never send the mnemonic."
        ) +
        '<a class="btn" href="../network.html">Open Network (opt-in)</a>' +
        pauseBtn("I will only look up addresses I chose", false)
      );
    }
    if (step === 2) {
      return quiz("If a balance API fails, the honest display is:", [
        {
          k: "ok",
          t: "unknown — never silent 0.",
          okwhy: "Correct. A failed lookup is unknown, not an empty wallet."
        },
        {
          k: "bad",
          t: "0.00000000 BTC.",
          why: "Wrong. A failed lookup is unknown, not zero. Zero looks like an empty wallet."
        },
        {
          k: "bad",
          t: "Retry forever with the seed.",
          why: "Wrong. Lookups are address-only. Never send the mnemonic to a balance API."
        }
      ]);
    }
    return finishHtml(10);
  }

  function tax() {
    if (!mem.tax) mem.tax = emptyTax();
    return mem.tax;
  }

  function sortSelect(obj, label) {
    var v = (tax().sort && tax().sort[obj]) || "";
    function opt(val, t) {
      return '<option value="' + val + '"' + (v === val ? " selected" : "") + ">" + t + "</option>";
    }
    return (
      '<label class="v2-sort-row" data-sort-row="' +
      obj +
      '"><span>' +
      label +
      "</span>" +
      '<select id="v2Sort-' +
      obj +
      '" data-sort="' +
      obj +
      '">' +
      opt("", "Place…") +
      opt("custodial", "Custodial — they hold") +
      opt("hot", "Hot — keys online") +
      opt("cold", "Cold — seed stays on device") +
      opt("watch", "Watch-only — cannot spend") +
      "</select></label>"
    );
  }

  function sortAllOk() {
    var s = tax().sort || {};
    return s.exchange === "custodial" && s.phone === "hot" && s.hardware === "cold" && s.watch === "watch";
  }

  function whoAllOk() {
    var w = tax().who || {};
    return w.ex === "they" && w.app === "they" && w.paper === "you" && w.bank === "they";
  }

  function whoRow(id, ans, label) {
    var got = (tax().who || {})[id];
    function b(pick, txt) {
      var cls = "btn secondary btn-sm";
      if (got === pick && pick === ans) cls = "btn btn-sm v2-who-ok";
      if (got === pick && pick !== ans) cls = "btn btn-sm v2-who-bad";
      return (
        '<button type="button" class="' +
        cls +
        '" id="v2Who-' +
        id +
        "-" +
        pick +
        '" data-who="' +
        id +
        '" data-pick="' +
        pick +
        '" data-ans="' +
        ans +
        '">' +
        txt +
        "</button>"
      );
    }
    return (
      '<div class="v2-who-row" data-who-row="' +
      id +
      '"><span>' +
      label +
      "</span><span class=\"v2-who-picks\">" +
      b("they", "They") +
      b("you", "You") +
      "</span></div>"
    );
  }

  var TEACH_BTC = "0.184";

  function btcFaceHtml(opts) {
    opts = opts || {};
    var frozen = !!opts.frozen;
    var note =
      opts.note ||
      (frozen
        ? "Locked out. They still hold this " + TEACH_BTC + " bitcoin. You cannot send it."
        : "On their books · practice only");
    return (
      '<div class="v2-btc' +
      (frozen ? " is-frozen" : "") +
      '" id="' +
      (opts.id || "v2ExBal") +
      '">' +
      '<p class="v2-btc-label">' +
      (opts.label || "Practice balance") +
      "</p>" +
      '<p class="v2-btc-amt"><span class="v2-btc-num">' +
      TEACH_BTC +
      '</span> <span class="v2-btc-unit">bitcoin</span></p>' +
      '<p class="v2-btc-note">' +
      note +
      "</p></div>"
    );
  }

  async function uc11(step) {
    var t = tax();
    if (step === 0) {
      return pad(
        "<h2>Who is they?</h2>" +
        doDont(
          "Tap each row. They means a company that never gave you 12 words.",
          "Do not mix this up with paper words you wrote yourself."
        ) +
        desc(
          "They is usually an exchange (Coinbase, Binance, Kraken), or a phone app that only has email and a password. Sometimes a bank or PayPal-style bitcoin number. You have a login. They have the keys."
        ) +
        '<p class="control-help">Who holds the keys? Tap They or You on each line.</p>' +
        '<div class="v2-who" id="v2Who">' +
        whoRow("ex", "they", "Coinbase, Binance, or Kraken account") +
        whoRow("app", "they", "Phone app with only email and a password") +
        whoRow("paper", "you", "Paper with 12 words I wrote down") +
        whoRow("bank", "they", "Bank or PayPal bitcoin number") +
        "</div>" +
        '<p class="control-help" id="v2WhoOut">' +
        (whoAllOk() ? "Yes. They is the company. You is only when you have the words." : "Tap all four. Wrong taps stay red until you pick the other button.") +
        "</p>" +
        pauseBtn("They is a company", !whoAllOk())
      );
    }
    if (step === 1) {
      var frozen = t.freeze;
      var asked = t.seedAsk;
      return pad(
        "<h2>The company app</h2>" +
        doDont(
          "Ask for the seed phrase. Then try to open the same coins in another wallet.",
          "Do not call a login your wallet. You cannot move this to Sparrow or Electrum without the phrase."
        ) +
        '<div class="v2-ex' +
        (frozen ? " is-locked" : "") +
        '" id="v2Ex">' +
        '<p class="v2-ex-bar">Practice company app · email login</p>' +
        btcFaceHtml({
          frozen: frozen,
          label: "What the app shows you",
          note: "On their books — not a seed you hold"
        }) +
        '<div class="row v2-gen-left">' +
        '<button type="button" class="btn' +
        (asked || frozen ? " secondary" : "") +
        '" id="v2ExExport"' +
        (frozen ? " disabled" : "") +
        ">Give me my seed phrase</button>" +
        '<button type="button" class="btn" id="v2ExRestore"' +
        (frozen ? " disabled" : "") +
        ">Open this in another wallet</button>" +
        "</div>" +
        (asked
          ? '<div class="v2-callout done" id="v2ExExportNote">They never gave you a seed phrase. There is nothing to copy.</div>'
          : '<p class="control-help" id="v2ExExportNote">Try it. A real wallet would show a seed phrase here.</p>') +
        (t.restore
          ? '<div class="v2-callout done" id="v2ExRestoreOut">You cannot open it somewhere else. You do not have the seed phrase.</div>'
          : '<p class="control-help" id="v2ExRestoreOut" hidden></p>') +
        '<p class="control-help' +
        (frozen ? " v2-who-bad-msg" : "") +
        '" id="v2ExTimer">' +
        (frozen
          ? "You are locked out. You cannot do anything. The company still has the keys."
          : "") +
        "</p>" +
        "</div>" +
        pauseBtn("I have no seed on the exchange", !frozen)
      );
    }
    if (step === 2) {
      await ensurePhrase();
      function box(id, on, text) {
        return on
          ? '<div class="v2-callout done" id="' + id + '">' + text + "</div>"
          : '<div id="' + id + '" hidden></div>';
      }
      return pad(
        "<h2>You hold the recovery words</h2>" +
        doDont(
          "This is not the exchange. You withdrew to a wallet that showed a seed phrase. Try one signer, then a co-signer.",
          "Do not think the company can reset a seed you hold. They never had it."
        ) +
        desc(
          "One signer means you alone can send, and you alone can lose everything. Multisig means two people must sign. Losing one paper is not the end if the others still have their keys."
        ) +
        btcFaceHtml({
          id: "v2HoldBal",
          frozen: !!t.lose,
          label: "Same " + TEACH_BTC + " bitcoin — now you hold the keys",
          note: t.lose
            ? "One-signer paper gone. This " + TEACH_BTC + " bitcoin cannot move on the left. 2-of-3 on the right can still send."
            : "You withdrew it. The company does not have this seed."
        }) +
        '<div class="v2-hold-split">' +
        '<section class="v2-hold-col" aria-labelledby="v2HoldOneH">' +
        '<h3 id="v2HoldOneH">One signer</h3>' +
        '<p class="control-help">You alone hold the seed. You can send. You can also lose everything.</p>' +
        '<div id="v2HoldCard">' +
        (t.lose
          ? '<p class="msg-bad">Your only paper is gone. With one signer there is no reset. The coins are stuck.</p>'
          : wordGridHtml(mem.mnemonic)) +
        "</div>" +
        '<div class="v2-hold-act">' +
        '<p class="control-help">1. Send yourself. No company. ' +
        inlineI(
          "One signer",
          "One seed, one person. You can send without asking anyone. If that seed is gone, nobody else can sign."
        ) +
        "</p>" +
        '<div class="v2-hold-act-row">' +
        '<button type="button" class="btn" id="v2HoldSpend">Send bitcoin myself</button>' +
        inlineI(
          "Send myself",
          "No company. No second signer. Your seed is enough to move the coins."
        ) +
        "</div>" +
        box("v2HoldSpendOut", t.spend, "It sent. No support ticket. No freeze. You held the keys.") +
        "</div>" +
        '<div class="v2-hold-act">' +
        '<p class="control-help">2. Lose the only paper. No-one can help. ' +
        inlineI(
          "Lost paper",
          "The company never had this phrase. A friend cannot sign for you. There is no forgot-password."
        ) +
        "</p>" +
        '<div class="v2-hold-act-row">' +
        '<button type="button" class="btn danger" id="v2HoldLose">I lost the paper</button>' +
        inlineI(
          "I lost the paper",
          "With one signer, losing the only copy of the seed means the coins cannot move."
        ) +
        "</div>" +
        box("v2HoldLoseOut", t.lose, "Nobody can reset this. That is the cost of holding the keys yourself.") +
        "</div>" +
        "</section>" +
        '<section class="v2-hold-col v2-hold-col-ms" aria-labelledby="v2HoldMsH">' +
        '<h3 id="v2HoldMsH">Co-signer · 2-of-3 ' +
        termI("MULTISIG") +
        " " +
        termI("COSIGNER") +
        "</h3>" +
        '<p class="control-help">Two signatures to send. You are one signer. Two friends hold the other keys. You cannot send alone. If you lose only your paper, the other two can still send.</p>' +
        '<div class="v2-hold-act">' +
        '<div class="v2-hold-act-row"><button type="button" class="btn secondary" id="v2HoldMsAlone">Try to send alone</button></div>' +
        box("v2HoldMsAloneOut", t.msAlone, "Need a second signature. One signer is not enough.") +
        "</div>" +
        '<div class="v2-hold-act">' +
        '<div class="v2-hold-act-row"><button type="button" class="btn secondary" id="v2HoldMsPaper">Lose only my paper</button></div>' +
        box("v2HoldMsPaperOut", t.msPaper, "2-of-3 still works. The other two keys can send. Your lost paper did not kill the vault.") +
        "</div>" +
        '<div class="v2-hold-act">' +
        '<div class="v2-hold-act-row"><button type="button" class="btn" id="v2HoldMsSend">Send with a co-signer</button></div>' +
        box("v2HoldMsSendOut", t.msSend, "Sent. Two people signed. No company in the middle.") +
        "</div>" +
        "</section></div>" +
        pauseBtn(
          "I can spend and I can lose it",
          !(t.spend && t.lose && t.msAlone && t.msPaper && t.msSend)
        )
      );
    }
    if (step === 3) {
      return quiz("Who usually holds the keys on Coinbase, Binance, or a login-only bitcoin app?", [
        {
          k: "ok",
          t: "The company. You only have a login. You never got a seed phrase.",
          okwhy: "Correct. They can freeze or lose it. That is not your wallet."
        },
        {
          k: "bad",
          t: "You, because you have a password and an extra login code.",
          why: "Wrong. A password opens their website. It is not a seed phrase."
        },
        {
          k: "bad",
          t: "You, because you can open the same balance in any other wallet.",
          why: "Wrong. There are no words to type into another wallet."
        }
      ]);
    }
    return finishHtml(11);
  }

  async function uc12(step) {
    var t = tax();
    await ensurePhrase();
    if (step === 0) {
      return pad(
        "<h2>Hot wallet on phone</h2>" +
        doDont(
          "Put the practice phrase on the phone. Watch the balance appear. Then run malware.",
          "Do not keep a funded seed on a phone that goes online."
        ) +
        '<div id="v2PlaceCard">' +
        wordGridHtml(mem.mnemonic) +
        "</div>" +
        '<button type="button" class="btn' +
        (t.phone ? " secondary" : "") +
        '" id="v2PlacePhone">Place on phone</button>' +
        '<div class="v2-hotface' +
        (t.phone ? "" : " v2-hidden") +
        '" id="v2PhoneFace">' +
        '<p class="v2-ex-bar">Phone hot wallet · internet on</p>' +
        '<p class="v2-ex-bal" id="v2PhoneAmt">' +
        (t.malware ? "0.000 BTC" : "0.184 BTC") +
        "</p>" +
        '<div class="v2-drain" id="v2PhoneDrainWrap"' +
        (t.phone ? "" : " hidden") +
        '><span class="v2-drain-bar" id="v2PhoneDrain" style="width:' +
        (t.malware ? "0" : "100") +
        '%"></span></div>' +
        '<p class="control-help" id="v2PlacePhoneOut">' +
        (t.phone
          ? "Seed phrase, private key, and public key all live on this phone. The phone talks to the internet. All of that can leak."
          : "") +
        "</p>" +
        '<p class="v2-leak" id="v2PhoneLeak"' +
        (t.phone ? "" : " hidden") +
        ">On this phone: seed phrase · private key · public key · receive address</p>" +
        "</div>" +
        '<button type="button" class="btn danger" id="v2Malware"' +
        (t.phone && !t.malware ? "" : " disabled") +
        ">Malware on the phone</button>" +
        '<p class="control-help" id="v2MalwareOut">' +
        (t.malware ? "Malware copied the seed and the private key. Balance went to 0." : "") +
        "</p>" +
        pauseBtn("Phone keys = Hot wallet", !t.malware)
      );
    }
    if (step === 1) {
      return pad(
        "<h2>Hardware signer</h2>" +
        doDont(
          "Put the same phrase on the device. Plug USB. Then type the seed into the laptop — that is the kill.",
          "Do not treat a USB cable as an air-gap."
        ) +
        '<div class="v2-hw-grid">' +
        '<div class="v2-hotface" id="v2HwDevice">' +
        '<p class="v2-ex-bar">Hardware device</p>' +
        '<p class="v2-ex-bal" id="v2HwAmt">' +
        (t.typed ? "0.000 BTC" : t.hw ? "0.184 BTC" : "—") +
        "</p>" +
        '<p class="control-help" id="v2PlaceHwOut">' +
        (t.hw
          ? "Seed stays in the chip. The laptop should only see a public key or a PSBT to sign."
          : "Empty until you place the phrase here.") +
        "</p>" +
        "</div>" +
        '<div class="v2-hotface" id="v2HwLaptop">' +
        '<p class="v2-ex-bar">Laptop</p>' +
        '<p class="v2-ex-bal" id="v2LaptopAmt">' +
        (t.typed ? "0.000 BTC stolen" : t.usb ? "watch-only · 0.184 BTC seen" : "not connected") +
        "</p>" +
        '<div class="v2-drain" id="v2LaptopDrainWrap"' +
        (t.typed ? "" : " hidden") +
        '><span class="v2-drain-bar" id="v2LaptopDrain" style="width:' +
        (t.typed ? "0" : "100") +
        '%"></span></div>' +
        '<p class="control-help" id="v2UsbOut">' +
        (t.typed
          ? "You typed the seed into the laptop. The laptop is hot. The vault is dead."
          : t.usb
            ? "USB is a cable to an online machine. That is not an air-gap. Laptop still should not have the words."
            : "No cable yet.") +
        "</p>" +
        "</div>" +
        "</div>" +
        '<div class="row v2-slots">' +
        '<button type="button" class="btn' +
        (t.hw ? " secondary" : "") +
        '" id="v2PlaceHw">Place on hardware device</button>' +
        '<button type="button" class="btn secondary" id="v2Usb"' +
        (t.hw && !t.typed ? "" : " disabled") +
        ">USB to laptop</button>" +
        '<button type="button" class="btn danger" id="v2TypeSeed"' +
        (t.usb && !t.typed ? "" : " disabled") +
        ">Type seed into computer</button>" +
        "</div>" +
        '<p class="control-help" id="v2TypeSeedOut">' +
        (t.typed ? "Vault killed. Typing the seed into a computer still kills the vault." : "") +
        "</p>" +
        pauseBtn("Keys stay on the device", !t.typed)
      );
    }
    if (step === 2) {
      return quiz("Same recovery words on a phone app versus a hardware signer:", [
        {
          k: "ok",
          t: "Same words, different where they live — phone is hot; hardware should keep keys on the device.",
          okwhy: "Correct. Placement is the lesson. USB is not an air-gap."
        },
        {
          k: "bad",
          t: "USB to a laptop is automatically an air-gap.",
          why: "Wrong. A cable to an online computer is not an air-gap."
        },
        {
          k: "bad",
          t: "Typing the seed into the computer is the safe way to set up hardware.",
          why: "Wrong. Typing the seed into a computer still kills the vault."
        }
      ]);
    }
    return finishHtml(12);
  }

  async function uc13(step) {
    var t = tax();
    if (step === 0) {
      return pad(
        "<h2>Hot versus cold</h2>" +
        doDont(
          "Sort each object. Brand is not a bin.",
          "Do not put a hardware app on a phone in Cold."
        ) +
        '<div class="v2-sort" id="v2Sort">' +
        sortSelect("exchange", "Exchange account") +
        sortSelect("phone", "Phone app") +
        sortSelect("hardware", "Hardware signer (seed never typed into the computer)") +
        sortSelect("watch", "Watch-only xpub") +
        "</div>" +
        '<p class="control-help" id="v2SortOut">' +
        (sortAllOk() ? "All four sit in different bins. Do not mix them." : "Place all four. Continue unlocks when they match.") +
        "</p>" +
        pauseBtn("Hot is online keys", !sortAllOk())
      );
    }
    if (step === 1) {
      return pad(
        "<h2>Daily spend versus savings</h2>" +
        doDont(
          "A small hot balance for coffee can be a choice. Savings stay cold or watch-only.",
          "Do not call a hardware app on a phone cold."
        ) +
        callout(
          "done",
          "Four objects",
          "Exchange · phone · hardware · watch-only. You just sorted them."
        ) +
        '<p class="control-help">Trap: where do you put “hardware wallet” software running on a phone?</p>' +
        '<div class="row v2-slots">' +
        '<button type="button" class="btn secondary" id="v2TrapHot" data-trap="hot">Hot — keys on the phone</button>' +
        '<button type="button" class="btn secondary" id="v2TrapCold" data-trap="cold">Cold — the box said hardware</button>' +
        "</div>" +
        '<p class="control-help" id="v2TrapOut">' +
        (t.trap === "hot"
          ? "Correct. Brand is not the split. Keys on a phone are hot."
          : t.trap === "cold"
            ? "Wrong. Brand is not the split. Try Hot."
            : "") +
        "</p>" +
        pauseBtn("Daily can be hot; savings stay cold", t.trap !== "hot")
      );
    }
    if (step === 2) {
      return quiz("Hot versus cold is:", [
        {
          k: "ok",
          t: "Whether keys are on a machine that talks to the internet — brand is not the split.",
          okwhy: "Correct. Daily spend can be hot. Savings stay cold or watch-only."
        },
        {
          k: "bad",
          t: "Whatever the box says “hardware”, even if you typed the seed into a laptop.",
          why: "Wrong. Brand is not the split. Keys on an online machine are hot."
        },
        {
          k: "bad",
          t: "The same as custodial versus self-custody.",
          why: "Wrong. An exchange is custodial. Hot vs cold is about whether *your* keys are online."
        }
      ]);
    }
    return finishHtml(13);
  }

  function entBits() {
    var b = 0;
    (mem.entEvents || []).forEach(function (e) {
      if (String(e).indexOf("d6:") === 0) b += D6_BITS;
      else if (String(e).indexOf("coin:") === 0) b += 1;
    });
    return b;
  }

  function countEnt(prefix) {
    var n = 0;
    (mem.entEvents || []).forEach(function (e) {
      if (String(e).indexOf(prefix) === 0) n++;
    });
    return n;
  }

  function pushEnt(ev) {
    mem.entEvents = mem.entEvents || [];
    lastEntDelta = String(ev).indexOf("d6:") === 0 ? D6_BITS : 1;
    mem.entEvents.push(ev);
    if (mem.entEvents.length > ENT_PAD_MAX) mem.entEvents.shift();
  }

  function entNeed() {
    return ENT_BITS[mem.entWordCount || 12] || 128;
  }

  function padIsLow() {
    return entBits() + 0.001 < entNeed();
  }

  function entLockRatio() {
    if (!(mem.entEvents || []).length) return null;
    var need = entNeed();
    if (!need) return null;
    return Math.max(0, Math.min(1, entBits() / need));
  }

  function lockHue(ratio) {
    if (ratio == null) return 0;
    if (ratio <= 0.5) return -145 * (1 - ratio / 0.5);
    return 100 * ((ratio - 0.5) / 0.5);
  }

  function lockFilter(ratio) {
    if (ratio == null) return "";
    return "hue-rotate(" + lockHue(ratio).toFixed(1) + "deg) saturate(1.25)";
  }

  function lockCap(ratio) {
    if (ratio == null) return "Seed strength";
    if (ratio < 0.35) return "Weak seed";
    if (ratio < 0.85) return "Building strength";
    return "Stronger seed";
  }

  function lockToneClass(ratio) {
    if (ratio == null) return "idle";
    if (ratio < 0.35) return "low";
    if (ratio < 0.85) return "mid";
    return "ok";
  }

  function lockHtml(kind) {
    var ratio = kind === "os" ? (mem.mnemonic ? 1 : null) : entLockRatio();
    var id = kind === "os" ? "v2OsLock" : "v2EntLock";
    var filt = lockFilter(ratio);
    return (
      '<figure class="v2-lock ' +
      lockToneClass(ratio) +
      '" id="' +
      id +
      '" data-lock="' +
      kind +
      '">' +
      '<img class="v2-lock-img" src="../assets/ds/faces/beginner-lock.png" width="640" height="640" alt="Seed strength" style="' +
      (filt ? "filter:" + filt : "") +
      '" />' +
      "<figcaption>" +
      lockCap(ratio) +
      "</figcaption>" +
      "</figure>"
    );
  }

  function applyLockTint() {
    document.querySelectorAll(".v2-lock").forEach(function (el) {
      var kind = el.getAttribute("data-lock");
      var ratio = kind === "os" ? (mem.mnemonic ? 1 : null) : entLockRatio();
      el.className = "v2-lock " + lockToneClass(ratio);
      var img = el.querySelector("img");
      if (img) img.style.filter = lockFilter(ratio);
      var cap = el.querySelector("figcaption");
      if (cap) cap.textContent = lockCap(ratio);
    });
  }

  function entVerdictText(bits) {
    var n = mem.entWordCount || 12;
    var need = entNeed();
    if (!(mem.entEvents || []).length) return "No rolls yet · 12-word wants 128 · 24-word wants 256";
    if (bits + 0.001 < need) {
      return "TOO LOW for " + n + "-word ENT (needs ~" + need + "). 12-word = 128 · 24-word = 256.";
    }
    if (need < 256) {
      return "enough on paper for " + n + "-word (~" + need + "). 24-word still wants ~256.";
    }
    return "enough on paper for 24-word ENT (~256). Keep going — the total still climbs.";
  }

  function entMetaInner() {
    var bits = entBits();
    var d6n = countEnt("d6:");
    var cn = countEnt("coin:");
    var low = bits + 0.001 < 128;
    var verdict = low ? "TOO LOW" : "enough on paper for 12-word ENT (~128 bits)";
    return (
      (mem.entEvents || []).length +
      " events · ~" +
      Math.round(bits) +
      " bits (d6≈2.58, coin = 1 bit each; simulated, not CSPRNG). " +
      d6n +
      " d6 · " +
      cn +
      " coin. 12-word wants 128 ≈ 50 d6 or 128 flips. 24-word wants 256 ≈ 100 d6 or 256 flips. " +
      verdict
    );
  }

  function entFaceHtml() {
    var bits = entBits();
    var rounded = Math.round(bits);
    var scale = Math.max(256, bits);
    var fill = scale ? Math.min(100, (bits / scale) * 100) : 0;
    var t128 = (128 / scale) * 100;
    var t256 = (256 / scale) * 100;
    var low = bits + 0.001 < 128;
    var delta =
      lastEntDelta > 0
        ? "Last event +" + (lastEntDelta === 1 ? "1" : "2.58") + " bit" + (lastEntDelta === 1 ? "" : "s")
        : "Each d6 ≈ +2.58 bits · each coin = +1 bit";
    return (
      '<div class="v2-ent-face' +
      (low ? " low" : " ok") +
      '" id="v2EntFace" role="status" aria-live="polite">' +
      '<div class="v2-ent-bits-row">' +
      '<span class="v2-ent-tilde">~</span>' +
      '<span class="v2-ent-bits" id="v2EntBits">' +
      rounded +
      "</span>" +
      '<span class="v2-ent-unit">bits</span>' +
      '<span class="v2-ent-verdict" id="v2EntVerdict">' +
      entVerdictText(bits) +
      "</span>" +
      "</div>" +
      '<div class="v2-ent-bar" id="v2EntBar" aria-hidden="true">' +
      '<div class="v2-ent-bar-fill" id="v2EntFill" style="width:' +
      fill.toFixed(2) +
      '%"></div>' +
      '<span class="v2-ent-tick t128" id="v2EntTick128" style="left:' +
      t128.toFixed(2) +
      '%" title="128 bits · 12-word"></span>' +
      '<span class="v2-ent-tick t256" id="v2EntTick256" style="left:' +
      t256.toFixed(2) +
      '%" title="256 bits · 24-word"></span>' +
      "</div>" +
      '<p class="v2-ent-scale" id="v2EntScale">' +
      delta +
      " · markers at <strong>128</strong> (12-word) and <strong>256</strong> (24-word). The big number is the running estimate — it can pass 256 (for example ~317).</p>" +
      "</div>"
    );
  }

  function refreshEntDom() {
    var bits = entBits();
    var rounded = Math.round(bits);
    var scale = Math.max(256, bits);
    var fill = scale ? Math.min(100, (bits / scale) * 100) : 0;
    var t128 = (128 / scale) * 100;
    var t256 = (256 / scale) * 100;
    var low = bits + 0.001 < 128;
    var face = $("v2EntFace");
    if (face) {
      face.classList.toggle("low", low);
      face.classList.toggle("ok", !low);
    }
    if ($("v2EntBits")) $("v2EntBits").textContent = String(rounded);
    if ($("v2EntVerdict")) $("v2EntVerdict").textContent = entVerdictText(bits);
    if ($("v2EntFill")) $("v2EntFill").style.width = fill.toFixed(2) + "%";
    if ($("v2EntTick128")) $("v2EntTick128").style.left = t128.toFixed(2) + "%";
    if ($("v2EntTick256")) $("v2EntTick256").style.left = t256.toFixed(2) + "%";
    if ($("v2EntScale")) {
      var delta =
        lastEntDelta > 0
          ? "Last event +" + (lastEntDelta === 1 ? "1" : "2.58") + " bit" + (lastEntDelta === 1 ? "" : "s")
          : "Each d6 ≈ +2.58 bits · each coin = +1 bit";
      $("v2EntScale").innerHTML =
        delta +
        " · markers at <strong>128</strong> (12-word) and <strong>256</strong> (24-word). The big number is the running estimate — it can pass 256 (for example ~317).";
    }
    var meta = $("v2EntMeta");
    if (meta) meta.textContent = entMetaInner();
    var log = $("v2EntLog");
    if (log) log.textContent = (mem.entEvents || []).length ? mem.entEvents.join(" ") : "—";
    var pause = $("v2Pause");
    if (pause && current.id === 14 && current.step === 0 && countEnt("d6:") >= 3) pause.disabled = false;
    if (pause && current.id === 14 && current.step === 2 && !padIsLow()) pause.disabled = false;
    applyLockTint();
    var suff = $("v2EntSuff");
    if (suff) {
      suff.className = "v2-ent-suff " + (padIsLow() ? "low" : "ok");
      suff.textContent = entSuffText();
    }
  }

  function entSuffText() {
    var bits = Math.round(entBits());
    var need = entNeed();
    var n = mem.entWordCount || 12;
    if (!(mem.entEvents || []).length) {
      return "Roll first. Then generate " + n + " words. The indicator turns green only when the pad meets ~" + need + " bits.";
    }
    if (padIsLow()) {
      return (
        "TOO LOW — pad ~" +
        bits +
        " bits vs " +
        need +
        " wanted for " +
        n +
        " words. Keep rolling, then generate again. A " +
        n +
        "-word phrase can still look complete."
      );
    }
    return (
      "Sufficient on paper — pad ~" +
      bits +
      " bits meets " +
      n +
      "-word ENT (" +
      need +
      "). Still simulated Math.random. Do not fund."
    );
  }

  function entSuffHtml() {
    return (
      '<p class="v2-ent-suff ' +
      (padIsLow() ? "low" : "ok") +
      '" id="v2EntSuff" role="status" aria-live="polite">' +
      entSuffText() +
      "</p>"
    );
  }

  function entMintBarHtml() {
    var n = mem.entWordCount || 12;
    return (
      '<div class="row v2-gen-bar v2-ent-mintbar">' +
      wordCountSelectHtml("v2EntWc", n) +
      '<button type="button" class="btn" id="v2EntMint">Build ' +
      n +
      " practice words from this pad</button>" +
      "</div>" +
      entSuffHtml() +
      '<p class="control-help" id="v2EntMintNote">' +
      (mem.entMnemonic
        ? (padIsLow() ? "TOO LOW — " : "") +
          mem.entMnemonic.trim().split(/\s+/).length +
          " practice words from the pad. Do not fund."
        : "Pick 12–24, generate from the roll log, then keep rolling until the indicator is sufficient.") +
      "</p>" +
      '<div id="v2EntWords">' +
      (mem.entMnemonic ? wordGridHtml(mem.entMnemonic) : "") +
      "</div>"
    );
  }

  function entDieHtml() {
    return (
      '<figure class="v2-ent-die" id="v2EntDie">' +
      '<img id="v2EntDice" src="../assets/ds/faces/beginner-dice.png" width="640" height="640" alt="Randomness (entropy) — six-sided die" />' +
      "<figcaption>Randomness (entropy)</figcaption>" +
      "</figure>"
    );
  }

  function ppKeyHtml(figId) {
    return (
      '<figure class="v2-pp-key" id="' +
      (figId || "v2PpKey") +
      '">' +
      '<img class="v2-pp-key-img" src="../assets/ds/faces/beginner-key.png" width="640" height="640" alt="Something you know — optional passphrase" />' +
      "<figcaption>Something you know</figcaption>" +
      "</figure>"
    );
  }

  function ppKeyHeroHtml(inner, figId) {
    return (
      '<div class="v2-pp-hero">' +
      ppKeyHtml(figId) +
      '<div class="v2-pp-hero-body">' +
      inner +
      "</div></div>"
    );
  }

  function entHeroHtml() {
    return '<div class="v2-ent-hero">' + entDieHtml() + entFaceHtml() + lockHtml("pad") + "</div>";
  }

  function entButtonsHtml() {
    return (
      entHeroHtml() +
      '<div class="row v2-gen-bar">' +
      '<div class="v2-gen-left">' +
      '<button type="button" class="btn" id="v2Dice">Roll d6 (simulated)</button>' +
      '<button type="button" class="btn secondary" id="v2Dice10">+10 d6</button>' +
      '<button type="button" class="btn secondary" id="v2Coin">Flip coin (simulated)</button>' +
      "</div></div>" +
      '<pre class="out" id="v2EntLog">' +
      ((mem.entEvents || []).length ? mem.entEvents.join(" ") : "—") +
      "</pre>" +
      '<p class="control-help" id="v2EntMeta">' +
      entMetaInner() +
      "</p>"
    );
  }

  async function uc14(step) {
    if (step === 0) {
      var few = countEnt("d6:") >= 3;
      return pad(
        "<h2>A few dice rolls</h2>" +
        doDont(
          "Roll a simulated d6 a few times and read the bit estimate against 128 and 256.",
          "Do not treat three rolls as a wallet. Buttons use Math.random. They are not physical dice and not OS CSPRNG."
        ) +
        desc(
          "Each six-sided die is about 2.58 bits. A 12-word BIP-39 phrase wants 128 bits of good randomness (~50 d6). A 24-word phrase wants 256 bits (~100 d6). Three rolls are still TOO LOW. This pad is a classroom demo — not a strong algorithm."
        ) +
        callout("done", "Word count is not entropy", "You can print 12 or 24 words from a short pad. That does not mean you had 128 or 256 bits.") +
        entButtonsHtml() +
        pauseBtn("I saw TOO LOW after a few rolls", !few)
      );
    }
    if (step === 1) {
      return pad(
        "<h2>Words from a short pad</h2>" +
        doDont(
          "Pick 12 to 24 words, generate from the roll log, and read TOO LOW next to a complete-looking phrase.",
          "Do not fund these words. A 24-word phrase can still be weak if the pad is short."
        ) +
        desc(
          "The lab hashes the roll log and turns that hash into BIP-39 words so you can see a phrase. That is not the same as having real entropy. 12 words want 128 bits; 24 words want 256 bits. If the estimate is TOO LOW, an attacker has a smaller guess space than a proper wallet of that length."
        ) +
        entButtonsHtml() +
        entMintBarHtml() +
        pauseBtn("I saw words that were still TOO LOW", !mem.entMnemonic)
      );
    }
    if (step === 2) {
      return pad(
        "<h2>Roll until the pad is enough</h2>" +
        doDont(
          "Keep rolling (use +10) and generate again until the indicator is sufficient for the length you picked. Flip a coin to see 1 bit each.",
          "Do not treat a coin as an easy 24-word wallet. One flip is one bit. 24 words want about 256 flips."
        ) +
        desc(
          "Without a cryptographically strong generator (Lab Generate uses the OS), you practise rolling until the pad estimate meets the phrase. ~50 d6 ≈ 128 bits (12-word). ~100 d6 ≈ 256 bits (24-word). Coin = 1 bit. These buttons stay simulated. Never fund pad words."
        ) +
        callout("done", "Coin is 1 bit", "128 flips for 12-word. 256 flips for 24-word. Dice reach it faster. Brand of RNG theatre does not skip the bits.") +
        entButtonsHtml() +
        entMintBarHtml() +
        pauseBtn("The indicator is sufficient for this length", padIsLow())
      );
    }
    if (step === 3) {
      return quiz("A few dice rolls that still print 12 or 24 recovery words mean:", [
        {
          k: "ok",
          t: "The pad can be TOO LOW — word count is not entropy.",
          okwhy: "Correct. 12-word wants ~128 bits (~50 d6). 24-word wants ~256 (~100 d6). Words from a short pad are still weak."
        },
        {
          k: "bad",
          t: "Twenty-four words always means 256 bits of good randomness.",
          why: "Wrong. The format can look complete while the pad estimate is still TOO LOW versus 256."
        },
        {
          k: "bad",
          t: "Three coin flips are enough because each flip is 128 bits.",
          why: "Wrong. Each coin flip is 1 bit. You would need about 128 flips for 12-word, 256 for 24-word."
        }
      ]);
    }
    return finishHtml(14);
  }

  function charsetPoolSize(pp) {
    var pool = 0;
    if (/[a-z]/.test(pp)) pool += 26;
    if (/[A-Z]/.test(pp)) pool += 26;
    if (/[0-9]/.test(pp)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(pp)) pool += 33;
    return Math.max(pool, 2);
  }

  function estimatePassphraseBits(pp) {
    if (!pp) return null;
    var n = pp.length;
    if (!n) return null;
    var counts = Object.create(null);
    var i;
    for (i = 0; i < n; i++) counts[pp[i]] = (counts[pp[i]] || 0) + 1;
    var h = 0;
    Object.keys(counts).forEach(function (k) {
      var p = counts[k] / n;
      h -= p * (Math.log(p) / Math.LN2);
    });
    var charsetBits = (Math.log(charsetPoolSize(pp)) / Math.LN2) * n;
    return Math.min(h * n, charsetBits, 256);
  }

  function ppTier(bits) {
    if (bits == null) return "empty";
    if (bits < 40) return "weak";
    if (bits < 80) return "fair";
    return "stronger";
  }

  function ppBitsLabel(pp) {
    var est = estimatePassphraseBits(pp);
    if (est == null) return "Empty — 0 extra bits (not the 512-bit PBKDF2 seed size)";
    var shown = est < 0.5 ? "<1" : String(Math.round(est));
    return "~" + shown + " bits · " + ppTier(est) + " (estimate only)";
  }

  function entStackHtml() {
    var bits = Math.round(entBits());
    var n = mem.entWordCount || 12;
    var need = entNeed();
    var low = padIsLow();
    var pp = mem.entPp || "";
    var pest = estimatePassphraseBits(pp);
    var whole = low
      ? "Whole picture: pad is still TOO LOW. A longer passphrase does not fix a short pad."
      : pest == null
        ? "Whole picture: pad meets " + n + "-word ENT on paper. Empty passphrase adds no extra secret."
        : "Whole picture: pad meets " +
          n +
          "-word on paper; passphrase is an extra vault secret (~" +
          (pest < 0.5 ? "<1" : Math.round(pest)) +
          " bits estimate). Still do not fund.";
    return (
      '<table class="v2-ent-stack" id="v2EntStack">' +
      "<tr><th>Layer</th><th>Estimate</th></tr>" +
      "<tr><td>Dice / coin pad</td><td>~" +
      bits +
      " bits" +
      (low ? ' <strong class="v2-ent-stack-low">TOO LOW</strong>' : ' <strong class="v2-ent-stack-ok">meets ' + n + "-word</strong>") +
      "</td></tr>" +
      "<tr><td>" +
      n +
      "-word BIP-39 wants</td><td>" +
      need +
      " bits (12→128 · 24→256)</td></tr>" +
      "<tr><td>Passphrase (25th)</td><td>" +
      ppBitsLabel(pp) +
      "</td></tr>" +
      '<tr><td colspan="2">' +
      whole +
      "</td></tr>" +
      "</table>"
    );
  }

  async function uc15(step) {
    if (step === 0) {
      return pad(
        "<h2>Same pad, then a passphrase</h2>" +
        doDont(
          "Bring the UC14 pad forward. Roll and generate 12–24 until you remember the indicator.",
          "Do not add a passphrase to paper over a TOO LOW pad."
        ) +
        desc(
          "This track stacks three numbers: pad bits from dice or coin, BIP-39 ENT for the word count you pick, and a teaching estimate of the optional 25th word. They are not one magic total. The pad is the source."
        ) +
        ppKeyHtml("v2PpKeyUc15a") +
        entButtonsHtml() +
        entMintBarHtml() +
        pauseBtn("I have pad words in view", !mem.entMnemonic)
      );
    }
    if (step === 1) {
      return pad(
        "<h2>Add a passphrase of a different length</h2>" +
        doDont(
          "Type a short passphrase, then a longer one. Watch weak / fair / stronger next to the pad.",
          "Do not treat a long passphrase as extra dice. Forgotten PP still loses that vault."
        ) +
        desc(
          "Same recovery words + a different passphrase = a different wallet. The Lab estimate uses character mix and length (capped, teaching-only). PBKDF2 always outputs 512 bits — that is not “your passphrase has 512 bits of entropy.”"
        ) +
        entHeroHtml() +
        entStackHtml() +
        ppKeyHeroHtml(
          '<label class="field" for="v2EntPp"><span class="label-row">Practice passphrase</span>' +
          '<input id="v2EntPp" type="text" autocomplete="off" spellcheck="false" value="' +
          attrEsc(mem.entPp) +
          '" placeholder="try 1 character, then a longer phrase" /></label>' +
          '<p class="control-help" id="v2EntPpHint">Try a single letter (weak), then several mixed characters (fair / stronger).</p>',
          "v2PpKeyUc15"
        ) +
        pauseBtn("I saw the stack change with length", !(mem.entPp && mem.entPp.length))
      );
    }
    if (step === 2) {
      return quiz("A strong-looking passphrase on a TOO LOW dice pad means:", [
        {
          k: "ok",
          t: "The pad is still the weak source. The 25th word does not replace rolling.",
          okwhy: "Correct. Pad bits must meet 128 (12-word) or 256 (24-word). Passphrase is an extra secret, not extra dice."
        },
        {
          k: "bad",
          t: "Add the passphrase bits to the pad and you have a 24-word wallet.",
          why: "Wrong. You do not add estimates into one BIP-39 ENT. A short pad stays a short pad."
        },
        {
          k: "bad",
          t: "PBKDF2 outputs 512 bits so the pad no longer matters.",
          why: "Wrong. 512 bits is the seed output size, not the entropy of a short roll log."
        }
      ]);
    }
    return finishHtml(15);
  }

  function attrEsc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function wordCountSelectHtml(selectId, nForce) {
    var n = nForce || mem.wordCount || 12;
    var id = selectId || "v2WordCount";
    var opts = [12, 15, 18, 21, 24]
      .map(function (v) {
        return '<option value="' + v + '"' + (v === n ? " selected" : "") + ">" + v + "</option>";
      })
      .join("");
    return (
      '<label class="field" for="' +
      id +
      '"><span class="label-row">Word count</span>' +
      '<select id="' +
      id +
      '">' +
      opts +
      "</select></label>"
    );
  }

  function inlineI(title, body) {
    return (
      '<span class="help-tip help-tip-safety">' +
      '<button type="button" class="help-tip-btn" aria-label="' +
      attrEsc(title) +
      '">i</button>' +
      '<span class="help-tip-panel" hidden><strong>' +
      title +
      "</strong> " +
      body +
      "</span></span>"
    );
  }

  function termI(id) {
    var t = window.Bip39Glossary && Bip39Glossary.byId && Bip39Glossary.byId[id];
    var title = (t && t.title) || id;
    var short = (t && t.short) || "";
    var body = (t && t.body) || "";
    return (
      '<span class="help-tip help-tip-safety" data-term="' +
      id +
      '">' +
      '<button type="button" class="help-tip-btn" aria-label="About ' +
      title +
      '">i</button>' +
      '<span class="help-tip-panel" hidden><strong>' +
      title +
      "</strong>" +
      (short ? " — " + short : "") +
      ". " +
      (body
        ? '<span class="control-help" style="display:block;margin-top:0.35rem">' + body + "</span>"
        : "") +
      "</span></span>"
    );
  }

  function mnemonicHelpHtml(inline) {
    var tag = inline ? "span" : "p";
    return (
      "<" +
      tag +
      ' class="label-row' +
      (inline ? " v2-mn-inline" : "") +
      '" id="v2MnemonicLine">This phrase is a BIP-39 mnemonic. English wordlist words only. ' +
      '<span class="help-tip action-hover" id="wrapMnemonicI">' +
      '<button type="button" class="help-tip-btn" aria-label="About the BIP-39 mnemonic">i</button>' +
      '<span class="help-tip-panel action-hover-panel" id="overlayMnemonic" hidden>' +
      "<strong>BIP-39 mnemonic (English words only)</strong>. " +
      '<span class="control-help" style="display:block;margin-top:0.35rem">' +
      "A mnemonic in this lab is a BIP-39 recovery phrase: a checksummed list of words from the official English wordlist " +
      "(12, 15, 18, 21, or 24 words). The list is English only. This is practice material in this browser tab. " +
      "It is not a funded wallet. Do not import these words into a wallet you use for real money." +
      "</span></span></span></" +
      tag +
      ">"
    );
  }

  function desc(text, id) {
    return (
      '<p class="control-help v2-step-desc"' +
      (id ? ' id="' + id + '"' : "") +
      ">" +
      text +
      "</p>"
    );
  }

  function generateExplainerHtml() {
    return (
      '<p class="control-help v2-step-desc" id="v2GenHelp">' +
      "This tab asks the operating system for random bits (a cryptographically strong random number generator), " +
      "then turns those bits into a BIP-39 practice recovery phrase. " +
      "Do not send money to these words or to addresses that come from them. " +
      "Nothing leaves this browser tab." +
      "</p>"
    );
  }

  function currentNet() {
    return mem.network === "main" ? "main" : "test";
  }

  function netSelectHtml() {
    var net = currentNet();
    return (
      '<label class="v2-net" for="v2Net">Network' +
      '<select id="v2Net" aria-label="Bitcoin network">' +
      '<option value="test"' +
      (net === "test" ? " selected" : "") +
      ">Test · tb1…</option>" +
      '<option value="main"' +
      (net === "main" ? " selected" : "") +
      ">Mainnet · bc1…</option>" +
      "</select></label>"
    );
  }

  async function deriveNow() {
    if (!mem.mnemonic || !window.BIP39Lab) return;
    var r = await BIP39Lab.deriveAddresses(mem.mnemonic, "", {
      network: currentNet(),
      count: 5,
      account: 0,
      change: 0
    });
    mem.lastRows = r.rows || [];
    var wrap = $("v2AddrWrap");
    if (wrap) {
      wrap.innerHTML = addrHtml();
      wrap.classList.remove("v2-hidden");
    }
    var pipe = $("v2Pipe");
    if (pipe) {
      var seedSt = pipe.querySelector('[data-pipe="seed"]');
      var addrSt = pipe.querySelector('[data-pipe="addr"]');
      if (seedSt) seedSt.classList.add("hi");
      if (addrSt) addrSt.classList.add("hi");
    }
  }

  function pipeHtml(litWords, litSeed, litAddr) {
    function st(id, title, detail, on) {
      return (
        '<div class="st' +
        (on ? " hi" : "") +
        '" data-pipe="' +
        id +
        '"><span class="k">' +
        title +
        '</span><span class="d">' +
        detail +
        "</span></div>"
      );
    }
    return (
      '<div class="v2-pipe" id="v2Pipe" aria-label="Words to seed to address">' +
      st("words", "words", "Numbered backup card", !!litWords) +
      '<span class="arr" aria-hidden="true">→</span>' +
      st("seed", "seed", "Phrase stretched into a seed (not the address)", !!litSeed) +
      '<span class="arr" aria-hidden="true">→</span>' +
      st("addr", "address", "Receive string from that seed", !!litAddr) +
      "</div>"
    );
  }

  function callout(kind, title, body) {
    return (
      '<div class="v2-callout ' +
      kind +
      '"><strong>' +
      title +
      "</strong>" +
      body +
      "</div>"
    );
  }
  function doDont(doBody, dontBody, wrapId) {
    return (
      '<div class="v2-donot"' +
      (wrapId ? ' id="' + wrapId + '"' : "") +
      ">" +
      '<div class="v2-callout is do"><strong>Do</strong>' +
      doBody +
      "</div>" +
      '<div class="v2-callout isnt dont"><strong>Do not</strong>' +
      dontBody +
      "</div>" +
      "</div>"
    );
  }
  function pad(inner) {
    return '<div class="card v2-pad">' + inner + "</div>";
  }
  function pauseBtn(label, disabled) {
    return '<div class="row" style="margin-top:0.85rem"><button type="button" class="btn" id="v2Pause"' +
      (disabled ? " disabled" : "") + ">" + label + "</button></div>";
  }
  function quiz(q, opts) {
    return pad(
      "<h2>Quiz</h2><p>" +
        q +
        "</p><div class=\"quiz-opts\">" +
        opts
          .map(function (o, i) {
            return (
              '<button type="button" class="btn secondary" data-quiz="' +
              o.k +
              '">' +
              (i + 1) +
              " · " +
              o.t +
              '<span class="v2-quiz-why" hidden>' +
              (o.k === "ok" ? o.okwhy || "Correct." : o.why || "Wrong. That is not what this track teaches.") +
              "</span></button>"
            );
          })
          .join("") +
        '</div><div id="v2QuizMsg"></div>' +
        pauseBtn("Continue", true)
    );
  }
  function finishHtml(id) {
    var next = TRACKS.filter(function (x) { return x.id === id + 1; })[0];
    return pad(
      "<h2>Finish</h2>" +
      callout("isnt", "Force exit", "Confirm you will not fund the practice phrase or practice addresses. Then you may open the next track.") +
      '<label class="check"><input type="checkbox" id="v2Exit"/> I will not fund practice addresses / practice phrase.</label>' +
      '<div class="row"><button type="button" class="btn" id="v2Finish" disabled>Finish track</button></div>' +
      (next ? '<p class="control-help">Next tease: UC' + next.id + " — " + next.title + "</p>" : "<p>All listed tracks done.</p>")
    );
  }
  function addrHtml() {
    if (!mem.lastRows || !mem.lastRows.length) {
      return '<p class="control-help">No addresses yet.</p>';
    }
    var cells = mem.lastRows.map(function (r) {
      return (
        '<div class="cell">' +
        '<span class="idx nav-step" aria-label="index ' +
        r.index +
        '">#' +
        r.index +
        "</span>" +
        '<span class="addr-text">' +
        (r.bip84_p2wpkh || r.bip86_p2tr || "") +
        "</span></div>"
      );
    }).join("");
    return (
      '<p class="v2-addr-kicker" id="v2AddrKicker">Receive addresses from this seed (BIP84 ' +
      (currentNet() === "main" ? "mainnet · bc1…" : "test · tb1…") +
      ").</p>" +
      '<div class="v2-addr-grid" id="v2AddrGrid">' +
      cells +
      "</div>"
    );
  }

  function wireStep() {
    var pause = $("v2Pause");
    if (pause) pause.addEventListener("click", function () {
      if (pause.disabled) return;
      var names = stepsFor(current.id);
      if (current.step < names.length - 1) {
        current.step += 1;
        mem.maxStep = Math.max(mem.maxStep || 0, current.step);
        renderTrack();
      }
    });
    document.querySelectorAll(".rail-jump").forEach(function (btn) {
      btn.addEventListener("click", function () {
        jumpTo(parseInt(btn.getAttribute("data-step"), 10));
      });
    });
    document.querySelectorAll("[data-concept-step]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        jumpTo(parseInt(btn.getAttribute("data-concept-step"), 10));
      });
    });
    var wc = $("v2WordCount");
    if (wc) {
      wc.addEventListener("change", function () {
        mem.wordCount = parseInt(wc.value, 10) || 12;
        var regenBtn = $("v2Regen");
        if (regenBtn) regenBtn.textContent = "Regenerate " + mem.wordCount + "-word phrase";
        if (!mem.mnemonic && ($("v2OsEnt") || $("v2Entropy"))) replaceOsEntropy();
      });
    }
    var gen = $("v2Generate");
    if (gen) gen.addEventListener("click", async function () {
      var n = parseInt(($("v2WordCount") && $("v2WordCount").value) || String(mem.wordCount || 12), 10);
      mem.wordCount = n;
      mem.mnemonic = await BIP39Lab.generateMnemonic(n);
      mem.lastRows = null;
      mem.cardAck = false;
      $("v2Card").innerHTML = wordGridHtml(mem.mnemonic);
      replaceOsEntropy();
      var aw = $("v2AddrWrap");
      if (aw) {
        aw.innerHTML = "";
        aw.classList.add("v2-hidden");
      }
      if (current.id === 2 || current.id === 3) {
        mem.cardAck = false;
        renderTrack();
        return;
      }
      if (pause) pause.disabled = false;
    });
    var ack = $("v2CardAck");
    if (ack) ack.addEventListener("change", function () {
      mem.cardAck = !!ack.checked;
      if (pause) pause.disabled = !mem.cardAck;
    });
    var der = $("v2Derive");
    if (der) der.addEventListener("click", async function () {
      if (!mem.cardAck) return;
      await deriveNow();
      if (pause) pause.disabled = false;
    });
    var netSel = $("v2Net");
    if (netSel) {
      netSel.addEventListener("change", async function () {
        mem.network = netSel.value === "main" ? "main" : "test";
        if (mem.mnemonic && mem.lastRows && mem.lastRows.length) {
          await deriveNow();
        }
      });
    }
    function rollD6() {
      pushEnt("d6:" + (1 + Math.floor(Math.random() * 6)));
      refreshEntDom();
    }
    if ($("v2Dice")) $("v2Dice").addEventListener("click", rollD6);
    if ($("v2Dice10")) {
      $("v2Dice10").addEventListener("click", function () {
        for (var i = 0; i < 10; i++) pushEnt("d6:" + (1 + Math.floor(Math.random() * 6)));
        refreshEntDom();
      });
    }
    if ($("v2Coin")) {
      $("v2Coin").addEventListener("click", function () {
        pushEnt("coin:" + (Math.random() < 0.5 ? "H" : "T"));
        refreshEntDom();
      });
    }
    function pauseOn(ok) {
      if (pause) pause.disabled = !ok;
    }
    document.querySelectorAll("[data-who][data-pick]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-who");
        var pick = btn.getAttribute("data-pick");
        var ans = btn.getAttribute("data-ans");
        tax().who[id] = pick;
        var row = btn.closest("[data-who-row]");
        if (row) {
          row.querySelectorAll("[data-pick]").forEach(function (b) {
            var p = b.getAttribute("data-pick");
            b.className = "btn secondary btn-sm";
            if (p === pick && pick === ans) b.className = "btn btn-sm v2-who-ok";
            if (p === pick && pick !== ans) b.className = "btn btn-sm v2-who-bad";
          });
        }
        var out = $("v2WhoOut");
        if (out) {
          out.textContent = whoAllOk()
            ? "Yes. They is the company. You is only when you have the words."
            : pick === ans
              ? "Right for this line. Finish the other lines."
              : "Not that one. They is the company. You is the paper words.";
        }
        pauseOn(whoAllOk());
      });
    });
    if ($("v2ExExport")) {
      $("v2ExExport").addEventListener("click", function () {
        if (tax().freeze) return;
        tax().seedAsk = true;
        var note = $("v2ExExportNote");
        if (note) {
          note.className = "v2-callout done";
          note.textContent = "They never gave you a seed phrase. There is nothing to copy.";
          note.hidden = false;
        }
        $("v2ExExport").className = "btn secondary";
      });
    }
    if ($("v2ExRestore")) {
      $("v2ExRestore").addEventListener("click", function () {
        if (tax().freeze) return;
        tax().restore = true;
        var rest = $("v2ExRestoreOut");
        if (rest) {
          rest.className = "v2-callout done";
          rest.hidden = false;
          rest.textContent = "You cannot open it somewhere else. You do not have the seed phrase.";
        }
        var box = $("v2ExTimer");
        if (box && !mem.exLockTimer && !tax().freeze) {
          var n = 5;
          box.textContent = "Company can lock you out in " + n + " seconds…";
          mem.exLockTimer = setInterval(function () {
            if (!$("v2ExTimer")) {
              clearInterval(mem.exLockTimer);
              mem.exLockTimer = 0;
              return;
            }
            n -= 1;
            if (n > 0) {
              $("v2ExTimer").textContent = "Company can lock you out in " + n + " seconds…";
              return;
            }
            clearInterval(mem.exLockTimer);
            mem.exLockTimer = 0;
            tax().freeze = true;
            var bal = $("v2ExBal");
            if (bal) {
              bal.classList.add("is-frozen");
              var note = bal.querySelector(".v2-btc-note");
              if (note) {
                note.textContent =
                  "Locked out. They still hold this " + TEACH_BTC + " bitcoin. You cannot send it.";
              }
            }
            var ex = $("v2Ex");
            if (ex) ex.classList.add("is-locked");
            if ($("v2ExExport")) $("v2ExExport").disabled = true;
            if ($("v2ExRestore")) $("v2ExRestore").disabled = true;
            $("v2ExTimer").textContent =
              "You are locked out. You cannot do anything. The company still has the keys.";
            pauseOn(true);
          }, 1000);
        }
      });
    }
    function holdReady() {
      var x = tax();
      return !!(x.spend && x.lose && x.msAlone && x.msPaper && x.msSend);
    }
    function showBlue(id, text) {
      var el = $(id);
      if (!el) return;
      el.className = "v2-callout done";
      el.hidden = false;
      el.textContent = text;
    }
    if ($("v2HoldSpend")) {
      $("v2HoldSpend").addEventListener("click", function () {
        tax().spend = true;
        showBlue("v2HoldSpendOut", "It sent. No support ticket. No freeze. You held the keys.");
        pauseOn(holdReady());
      });
    }
    if ($("v2HoldLose")) {
      $("v2HoldLose").addEventListener("click", function () {
        tax().lose = true;
        showBlue("v2HoldLoseOut", "Nobody can reset this. That is the cost of holding the keys yourself.");
        var card = $("v2HoldCard");
        if (card) {
          card.innerHTML =
            '<p class="msg-bad">Your only paper is gone. With one signer there is no reset. The coins are stuck.</p>';
        }
        var holdBal = $("v2HoldBal");
        if (holdBal) {
          holdBal.classList.add("is-frozen");
          var hn = holdBal.querySelector(".v2-btc-note");
          if (hn) {
            hn.textContent =
              "Paper gone. This " + TEACH_BTC + " bitcoin cannot move. No company reset.";
          }
        }
        pauseOn(holdReady());
      });
    }
    if ($("v2HoldMsAlone")) {
      $("v2HoldMsAlone").addEventListener("click", function () {
        tax().msAlone = true;
        showBlue("v2HoldMsAloneOut", "Need a second signature. One signer is not enough.");
        pauseOn(holdReady());
      });
    }
    if ($("v2HoldMsPaper")) {
      $("v2HoldMsPaper").addEventListener("click", function () {
        tax().msPaper = true;
        showBlue("v2HoldMsPaperOut", "2-of-3 still works. The other two keys can send. Your lost paper did not kill the vault.");
        pauseOn(holdReady());
      });
    }
    if ($("v2HoldMsSend")) {
      $("v2HoldMsSend").addEventListener("click", function () {
        tax().msSend = true;
        showBlue("v2HoldMsSendOut", "Sent. Two people signed. No company in the middle.");
        pauseOn(holdReady());
      });
    }
    function drainToZero(bar, amt, labelZero, onDone) {
      if (mem.drainTimer) clearInterval(mem.drainTimer);
      var pct = 100;
      var btc = 0.184;
      mem.drainTimer = setInterval(function () {
        pct -= 20;
        btc = Math.max(0, +(btc - 0.037).toFixed(3));
        if (pct <= 0) {
          pct = 0;
          btc = 0;
          clearInterval(mem.drainTimer);
          mem.drainTimer = 0;
          if (typeof onDone === "function") onDone();
        }
        if (bar) bar.style.width = pct + "%";
        if (amt) amt.textContent = btc.toFixed(3) + (labelZero && btc === 0 ? " BTC" : " BTC");
      }, 160);
    }
    if ($("v2PlacePhone")) {
      $("v2PlacePhone").addEventListener("click", function () {
        tax().phone = true;
        var face = $("v2PhoneFace");
        if (face) face.classList.remove("v2-hidden");
        var amt = $("v2PhoneAmt");
        if (amt) amt.textContent = "0.184 BTC";
        var leak = $("v2PhoneLeak");
        if (leak) leak.hidden = false;
        $("v2PlacePhoneOut").textContent =
          "Seed phrase, private key, and public key all live on this phone. The phone talks to the internet. All of that can leak.";
        if ($("v2Malware")) $("v2Malware").disabled = false;
        var dw = $("v2PhoneDrainWrap");
        if (dw) dw.hidden = false;
        $("v2PlacePhone").className = "btn secondary";
      });
    }
    if ($("v2Malware")) {
      $("v2Malware").addEventListener("click", function () {
        if (!tax().phone || tax().malware) return;
        $("v2Malware").disabled = true;
        var bar = $("v2PhoneDrain");
        if (bar) bar.style.background = "var(--bad)";
        var amt = $("v2PhoneAmt");
        $("v2MalwareOut").textContent = "Malware is copying the seed and the private key…";
        drainToZero(bar, amt, true, function () {
          tax().malware = true;
          if (amt) amt.textContent = "0.000 BTC";
          $("v2MalwareOut").textContent = "Malware copied the seed and the private key. Balance went to 0.";
          pauseOn(true);
        });
      });
    }
    if ($("v2PlaceHw")) {
      $("v2PlaceHw").addEventListener("click", function () {
        tax().hw = true;
        $("v2HwAmt").textContent = "0.184 BTC";
        $("v2PlaceHwOut").textContent =
          "Seed stays in the chip. The laptop should only see a public key or a PSBT to sign.";
        if ($("v2Usb")) $("v2Usb").disabled = false;
        $("v2PlaceHw").className = "btn secondary";
      });
    }
    if ($("v2Usb")) {
      $("v2Usb").addEventListener("click", function () {
        if (!tax().hw) return;
        tax().usb = true;
        $("v2LaptopAmt").textContent = "watch-only · 0.184 BTC seen";
        $("v2UsbOut").textContent =
          "USB is a cable to an online machine. That is not an air-gap. Laptop still should not have the words.";
        if ($("v2TypeSeed")) $("v2TypeSeed").disabled = false;
      });
    }
    if ($("v2TypeSeed")) {
      $("v2TypeSeed").addEventListener("click", function () {
        if (!tax().usb || tax().typed) return;
        $("v2TypeSeed").disabled = true;
        var wrap = $("v2LaptopDrainWrap");
        if (wrap) wrap.hidden = false;
        var lbar = $("v2LaptopDrain");
        if (lbar) lbar.style.background = "var(--bad)";
        $("v2UsbOut").textContent = "The seed is on the laptop now. The laptop is a hot wallet.";
        $("v2TypeSeedOut").textContent = "Thief on the laptop can spend…";
        drainToZero($("v2LaptopDrain"), $("v2HwAmt"), true, function () {
          tax().typed = true;
          if ($("v2HwAmt")) $("v2HwAmt").textContent = "0.000 BTC";
          if ($("v2LaptopAmt")) $("v2LaptopAmt").textContent = "0.000 BTC stolen";
          $("v2TypeSeedOut").textContent =
            "Vault killed. Typing the seed into a computer still kills the vault.";
          pauseOn(true);
        });
      });
    }
    document.querySelectorAll("[data-sort]").forEach(function (sel) {
      sel.addEventListener("change", function () {
        var k = sel.getAttribute("data-sort");
        tax().sort[k] = sel.value;
        var out = $("v2SortOut");
        var ok = sortAllOk();
        if (out) {
          out.textContent = ok
            ? "All four sit in different bins. Do not mix them."
            : "Place all four. Continue unlocks when they match.";
        }
        pauseOn(ok);
      });
    });
    function trapPick(which) {
      tax().trap = which;
      var out = $("v2TrapOut");
      if (out) {
        out.textContent =
          which === "hot"
            ? "Correct. Brand is not the split. Keys on a phone are hot."
            : "Wrong. Brand is not the split. Try Hot.";
      }
      pauseOn(which === "hot");
    }
    if ($("v2TrapHot")) $("v2TrapHot").addEventListener("click", function () { trapPick("hot"); });
    if ($("v2TrapCold")) $("v2TrapCold").addEventListener("click", function () { trapPick("cold"); });
    async function mintFromPad() {
      var note = $("v2EntMintNote");
      if (!(mem.entEvents && mem.entEvents.length)) {
        if (note) note.textContent = "Roll first, then generate. A short pad stays TOO LOW.";
        return false;
      }
      var B = window.BIP39Lab;
      if (!B || typeof B.mnemonicFromEntropyBytes !== "function") {
        if (note) note.textContent = "Could not build pad words. Hard-refresh this page.";
        return false;
      }
      var n = mem.entWordCount || 12;
      var bytes = ENT_BYTES[n] || 16;
      var data = new TextEncoder().encode(mem.entEvents.join("|"));
      var dig = await crypto.subtle.digest("SHA-256", data);
      var ent = new Uint8Array(dig).slice(0, bytes);
      mem.entMnemonic = B.mnemonicFromEntropyBytes(ent);
      var wc = mem.entMnemonic.trim().split(/\s+/).filter(Boolean).length;
      if (note) {
        note.textContent = padIsLow()
          ? "TOO LOW — ~" +
            Math.round(entBits()) +
            " bits from the pad, but these " +
            wc +
            " words look complete. Do not fund."
          : wc +
            " practice words from the pad. Sufficient on paper for " +
            n +
            "-word ENT. Still do not fund.";
      }
      if ($("v2EntWords")) $("v2EntWords").innerHTML = wordGridHtml(mem.entMnemonic);
      var mintBtn = $("v2EntMint");
      if (mintBtn) mintBtn.textContent = "Build " + n + " practice words from this pad";
      refreshEntDom();
      if (pause && current.id === 14 && current.step === 1) pause.disabled = false;
      if (pause && current.id === 14 && current.step === 2) pause.disabled = padIsLow();
      if (pause && current.id === 15 && current.step === 0) pause.disabled = !mem.entMnemonic;
      return true;
    }
    if ($("v2EntMint")) $("v2EntMint").addEventListener("click", function () { mintFromPad(); });
    var entWc = $("v2EntWc");
    if (entWc) {
      entWc.addEventListener("change", function () {
        mem.entWordCount = parseInt(entWc.value, 10) || 12;
        var mintBtn = $("v2EntMint");
        if (mintBtn) mintBtn.textContent = "Build " + mem.entWordCount + " practice words from this pad";
        refreshEntDom();
        if (mem.entEvents && mem.entEvents.length && mem.entMnemonic) mintFromPad();
        else if (pause && current.id === 14 && current.step === 2) pause.disabled = padIsLow();
      });
    }
    var ppIn = $("v2EntPp");
    if (ppIn) {
      ppIn.addEventListener("input", function () {
        mem.entPp = ppIn.value || "";
        var stack = $("v2EntStack");
        if (stack) stack.outerHTML = entStackHtml();
        if (pause) pause.disabled = !mem.entPp.length;
      });
    }
    var regen = $("v2Regen");
    if (regen) regen.addEventListener("click", async function () {
      var n = parseInt(($("v2WordCount") && $("v2WordCount").value) || String(mem.wordCount || 12), 10);
      mem.wordCount = n;
      mem.mnemonic = await BIP39Lab.generateMnemonic(n);
      mem.lastRows = null;
      mem.cardAck = false;
      $("v2Card").innerHTML = wordGridHtml(mem.mnemonic);
      replaceOsEntropy();
      regen.textContent = "Regenerate " + n + "-word phrase";
    });

    var pack = $("v2PrintAck");
    var pr = $("v2Print");
    if (pack && pr) {
      pack.addEventListener("change", function () {
        pr.disabled = !pack.checked;
        if (pack.checked) fillPrintSheet(true);
      });
    }
    if (pr) {
      pr.addEventListener("click", function () {
        if (pack && !pack.checked) return;
        fillPrintSheet(false);
        window.print();
        var sheet = $("printBackup");
        if (sheet) {
          sheet.hidden = true;
          sheet.setAttribute("aria-hidden", "true");
        }
      });
    }
    var cmp = $("v2Cmp");
    if (cmp) cmp.addEventListener("click", async function () {
      var a = ($("ppA") && $("ppA").value) || "";
      var b = ($("ppB") && $("ppB").value) || "";
      var labA = a === "" ? "A has no passphrase" : "A = “" + a + "”";
      var labB = b === "" ? "B has no passphrase" : "B = “" + b + "”";
      var ra = await BIP39Lab.deriveAddresses(mem.mnemonic, a, { network: "test", count: 1 });
      var rb = await BIP39Lab.deriveAddresses(mem.mnemonic, b, { network: "test", count: 1 });
      var addrA = ra.rows[0].bip84_p2wpkh;
      var addrB = rb.rows[0].bip84_p2wpkh;
      var same = addrA === addrB;
      var verdict;
      if (same) {
        if (a === "" && b === "") {
          verdict = "Same receive address. Both sides have no passphrase, so this is one vault.";
        } else if (a === b) {
          verdict = "Same receive address. Passphrase A and passphrase B are the same, so this is one vault.";
        } else {
          verdict = "Same receive address with these two passphrases.";
        }
      } else {
        verdict = "Diverged — two wallets. Same words, different passphrases, different addresses.";
      }
      $("v2CmpOut").innerHTML =
        '<div class="v2-callout is"><strong>' + labA + "</strong><code class=\"v2-preview-big\">" + addrA + "</code></div>" +
        '<div class="v2-callout done"><strong>' + labB + "</strong><code class=\"v2-preview-big\">" + addrB + "</code></div>" +
        '<div class="v2-verdict ' + (same ? "same" : "split") + '">' + verdict + "</div>";
      if (pause) pause.disabled = false;
    });
    var idx = $("v2Idx");
    var idxZero = $("v2IdxZero");
    if (idx) {
      idx.setAttribute("data-i", "0");
      async function applyPathIndex(i) {
        i = Math.max(0, Math.min(19, i | 0));
        idx.setAttribute("data-i", String(i));
        var path = BIP39Lab.formatPath(84, "test", 0, 0, i);
        $("v2PathLine").textContent = path;
        idx.textContent =
          i >= 19
            ? "Index 19 is the last in this demo"
            : "Show index " + (i + 1) + " (next receive address)";
        var r = await BIP39Lab.deriveAddresses(mem.mnemonic, "", { network: "test", count: i + 1, change: 0 });
        var row = r.rows[i] || r.rows[r.rows.length - 1];
        var a = (row && row.bip84_p2wpkh) || "";
        $("v2Tail").textContent = "Index " + i + "  ·  " + a;
        if (pause && i > 0) pause.disabled = false;
      }
      applyPathIndex(0).catch(console.error);
      idx.addEventListener("click", function () {
        var cur = parseInt(idx.getAttribute("data-i") || "0", 10);
        applyPathIndex(cur + 1).catch(console.error);
      });
      if (idxZero) {
        idxZero.addEventListener("click", function () {
          applyPathIndex(0).catch(console.error);
        });
      }
    }
    var wo = $("v2Wo");
    if (wo) wo.addEventListener("click", async function () {
      var pack = await BIP39Lab.exportWatchOnly(mem.mnemonic, "", { network: "main", account: 0 });
      var desc = BIP39Lab.descriptorsFromWatchOnly(pack, "main");
      var keyBlock = (pack.keys || []).map(function (k) { return k.label + "\n" + k.key; }).join("\n\n");
      var descBlock = ((desc && desc.descriptors) || []).map(function (d) {
        return d.label + "\n" + d.descriptor + (d.note ? "\n(" + d.note + ")" : "");
      }).join("\n\n");
      $("v2WoOut").textContent = keyBlock + (descBlock ? "\n\n--- output descriptors ---\n\n" + descBlock : "");
    });
    var xp = $("v2Xpub");
    if (xp) xp.addEventListener("click", async function () {
      var pack = await BIP39Lab.exportWatchOnly(mem.mnemonic, "", { network: "main" });
      var k = (pack.keys || []).filter(function (x) { return x.purpose === 84; })[0] || pack.keys[0];
      $("v2XpubOut").textContent = k.label + "\n" + k.key + "\n(no xprv)";
    });
    document.querySelectorAll("[data-cs-gen]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        var i = parseInt(btn.getAttribute("data-cs-gen"), 10);
        if (!mem.cosigners) mem.cosigners = emptyCosigners();
        var sel = $("v2CsWc" + i);
        var n = parseInt(sel && sel.value ? sel.value : "12", 10) || 12;
        mem.cosigners[i].wordCount = n;
        mem.cosigners[i].mnemonic = await BIP39Lab.generateMnemonic(n);
        mem.cosigners[i].zpub = "";
        renderTrack();
      });
    });
    document.querySelectorAll("[data-cs-zpub]").forEach(function (btn) {
      btn.addEventListener("click", async function () {
        var i = parseInt(btn.getAttribute("data-cs-zpub"), 10);
        var c = mem.cosigners && mem.cosigners[i];
        if (!c || !c.mnemonic) return;
        var pack = await BIP39Lab.exportWatchOnly(c.mnemonic, "", { network: "main" });
        var k = (pack.keys || []).filter(function (x) { return x.purpose === 84; })[0];
        c.zpub = (k && k.key) || "";
        renderTrack();
      });
    });
    document.querySelectorAll("[data-cs-clear]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var i = parseInt(btn.getAttribute("data-cs-clear"), 10);
        if (!mem.cosigners) return;
        mem.cosigners[i] = { mnemonic: "", wordCount: 12, zpub: "" };
        renderTrack();
      });
    });
    var csAll = $("v2CsClearAll");
    if (csAll) {
      csAll.addEventListener("click", function () {
        mem.cosigners = emptyCosigners();
        renderTrack();
      });
    }
    [0, 1, 2].forEach(function (i) {
      var sel = $("v2CsWc" + i);
      if (sel) {
        sel.addEventListener("change", function () {
          if (!mem.cosigners) mem.cosigners = emptyCosigners();
          mem.cosigners[i].wordCount = parseInt(sel.value, 10) || 12;
        });
      }
    });
    var sh = $("v2Sh");
    if (sh) sh.addEventListener("click", function () {
      if (!window.ShamirLab) {
        $("v2ShOut").textContent = "ShamirLab missing.";
        return;
      }
      var secret = ShamirLab.generatePracticeSecret(16);
      var u8 = ShamirLab.fromHex(secret);
      var shares = ShamirLab.splitSecret(u8, 2, 3);
      var rec = ShamirLab.combineShares(shares.slice(0, 2));
      $("v2ShOut").textContent =
        "secret (practice hex): " + secret + "\n" +
        shares.map(ShamirLab.encodeShare).join("\n") +
        "\nrecombined: " + ShamirLab.toHex(rec) +
        "\nmatch: " + (ShamirLab.toHex(rec) === secret);
      mem.shamirDone = true;
      if (pause) pause.disabled = false;
    });
    var pb = $("v2Psbt");
    if (pb) pb.addEventListener("click", function () {
      var r = BIP39Lab.inspectPsbt(PSBT_MIN);
      var lines = [
        "What this is: a sample PSBT package (educational). No signature is added.",
        "Status: " + (r.status || "unknown"),
        r.magic ? "Magic: " + r.magic : "",
        r.globalKeys != null ? "Global map keys: " + r.globalKeys : "",
        r.inputCount != null ? "Inputs: " + r.inputCount : "",
        r.outputCount != null ? "Outputs: " + r.outputCount : "",
        r.detail ? "Note: " + r.detail : "",
        "This tab does not sign and does not broadcast."
      ].filter(Boolean);
      $("v2PsbtOut").textContent = lines.join("\n");
    });
    var uc2q = $("v2Uc2Quiz");
    if (uc2q) {
      uc2q.querySelectorAll("[data-quiz]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var box = $("v2QuizMsg");
          if (btn.getAttribute("data-quiz") === "bad") {
            btn.classList.remove("is-picked");
            box.className = "msg-bad";
            var whyEl = btn.querySelector(".v2-quiz-why");
            box.textContent =
              (whyEl && whyEl.textContent) ||
              btn.getAttribute("data-why") ||
              "Wrong.";
            if (pause) pause.disabled = true;
            return;
          }
          btn.classList.toggle("is-picked");
          var nOk = uc2q.querySelectorAll('[data-quiz="ok"].is-picked').length;
          if (nOk === 2) {
            box.className = "msg-ok";
            box.textContent = "Correct. Both right sentences are selected.";
            if (pause) pause.disabled = false;
          } else {
            box.className = "";
            box.textContent = "";
            if (pause) pause.disabled = true;
          }
        });
      });
    } else {
      document.querySelectorAll("[data-quiz]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var ok = btn.getAttribute("data-quiz") === "ok";
          var box = $("v2QuizMsg");
          var whyEl = btn.querySelector(".v2-quiz-why");
          box.className = ok ? "msg-ok" : "msg-bad";
          box.textContent = whyEl && whyEl.textContent
            ? whyEl.textContent
            : ok
              ? "Correct."
              : "Wrong. That is not what this track teaches.";
          if (ok && pause) pause.disabled = false;
        });
      });
    }
    var ex = $("v2Exit");
    var fin = $("v2Finish");
    if (ex && fin) {
      ex.addEventListener("change", function () { fin.disabled = !ex.checked; });
      fin.addEventListener("click", function () {
        if (!ex.checked) return;
        markComplete(current.id);
        renderPicker();
      });
    }
  }

  function fillPrintSheet(keepHidden) {
    var m = (mem.mnemonic || "").trim();
    var ol = $("printWordList");
    if (!ol) return;
    ol.innerHTML = "";
    var words = m.split(/\s+/).filter(Boolean);
    var n = words.length || 12;
    for (var i = 0; i < n; i++) {
      var li = document.createElement("li");
      li.textContent = words[i] || "________";
      ol.appendChild(li);
    }
    var sheet = $("printBackup");
    if (sheet && !keepHidden) {
      sheet.hidden = false;
      sheet.setAttribute("aria-hidden", "false");
    }
  }

  function clearSecrets() {
    mem.mnemonic = "";
    mem.lastRows = null;
    mem.cardAck = false;
    mem.cosigners = emptyCosigners();
    mem.shamirDone = false;
    mem.entEvents = [];
    mem.entMnemonic = "";
    mem.entWordCount = 12;
    mem.entPp = "";
    lastEntDelta = 0;
    if (current && (current.id === 1 || current.id === 2 || current.id === 6 || current.id === 14)) {
      if (current.id === 1 || current.id === 2 || current.id === 14) current.step = 0;
      renderTrack();
    } else {
      renderPicker();
    }
  }

  function boot() {
    if ($("v2Clear")) $("v2Clear").addEventListener("click", clearSecrets);
    if ($("btnBackPicker")) $("btnBackPicker").addEventListener("click", renderPicker);
    var rail = $("trackRail");
    if (rail) {
      rail.addEventListener("click", function (ev) {
        var b = ev.target.closest && ev.target.closest(".rail-jump");
        if (!b) return;
        jumpTo(parseInt(b.getAttribute("data-step"), 10));
      });
    }
    var strip = $("conceptStrip");
    if (strip) {
      strip.addEventListener("click", function (ev) {
        var b = ev.target.closest && ev.target.closest("[data-concept-step]");
        if (!b || b.disabled) return;
        jumpTo(parseInt(b.getAttribute("data-concept-step"), 10));
      });
    }
    var q = new URLSearchParams(location.search).get("uc");
    renderPicker();
    if (q) {
      var n = parseInt(q, 10);
      if (n >= 1 && n <= 15) openUc(n);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
