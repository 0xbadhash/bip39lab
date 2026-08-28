/**
 * V2 use-case tracks — real BIP-39 via BIP39Lab bundle. No seed persistence.
 */
(function () {
  "use strict";
  var STORE = "bip39lab.v2";
  var mem = { mnemonic: "", lastRows: null, cardAck: false, wordCount: 12, cosigners: null, maxStep: 0, network: "test", addrType: "bip84", pathPurpose: 84, woPurpose: 86, woPack: null, entEvents: [], entMnemonic: "", entWordCount: 12, entPp: "", slip39TriedOne: false, slip39TriedTwo: false, slip39PpDone: false };
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
  var PSBT_STORY = "cHNidP8BAAoCAAAAAA==";
  var PSBT_PARTIAL = "cHNidP8AIgICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAA";
  var PSBT_EX_TX = [
    {
      id: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
      label: "Genesis coinbase",
      why: "Block 0. The first bitcoin output. Public history.",
      snap: {
        txid: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
        status: { confirmed: true, block_height: 0 },
        vin: [{}],
        vout: [{ value: 5000000000 }],
        story:
          "Coinbase — no previous tx. One output: 50 BTC (5,000,000,000 sats). This is the first bitcoin output. The genesis coinbase is not a normal spendable UTXO."
      }
    },
    {
      id: "f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16",
      label: "First transfer",
      why: "Block 170. Ten BTC, Satoshi to Hal Finney. Public history.",
      snap: {
        txid: "f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16",
        status: { confirmed: true, block_height: 170 },
        vin: [{}],
        vout: [{}, {}],
        story: "First non-coinbase transfer: 10 BTC from Satoshi to Hal Finney. 1 input, 2 outputs. Confirmed in block 170."
      }
    },
    {
      id: "cca7507897abc89628f450e8b1e0c6fca4ec3f7b34cccf55f3f531c659ff4d79",
      label: "Pizza day",
      why: "Block 57044. Ten thousand BTC for two pizzas. Public history.",
      snap: {
        txid: "cca7507897abc89628f450e8b1e0c6fca4ec3f7b34cccf55f3f531c659ff4d79",
        status: { confirmed: true, block_height: 57044 },
        vin: [{}],
        vout: [{}, {}],
        story: "Pizza day: 10,000 BTC paid for two pizzas. 1 input, 2 outputs. Confirmed in block 57044. Public history, not a classroom fake."
      }
    },
    {
      id: "8bae12b5f4c088d940733dcd1455efc6a3a69cf9340e17a981286d3778615684",
      label: "OP_RETURN note",
      why: "Block 308570. A nulldata output stores ASCII on every full node. Not a payment to a person.",
      snap: {
        txid: "8bae12b5f4c088d940733dcd1455efc6a3a69cf9340e17a981286d3778615684",
        status: { confirmed: true, block_height: 308570 },
        vin: [{}],
        vout: [
          {
            value: 0,
            scriptpubkey_type: "op_return",
            scriptpubkey_asm: "OP_RETURN OP_PUSHBYTES_19 636861726c6579206c6f766573206865696469"
          },
          { value: 200000, scriptpubkey_type: "p2pkh" }
        ],
        story:
          "Classic OP_RETURN example. Output 0 is unspendable (0 sats) and carries the ASCII string “charley loves heidi”. Nodes may prune the UTXO; the bytes stay in the block forever. Not a token. Not a signature."
      }
    },
    {
      id: "6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799",
      label: "Inscription 0",
      why: "Block 767430. First Ordinal inscription — a PNG in Taproot witness, not OP_RETURN.",
      snap: {
        txid: "6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799",
        status: { confirmed: true, block_height: 767430 },
        vin: [{ witness: ["00", "0063036f7264010109696d6167652f706e67"] }],
        vout: [{ value: 9678, scriptpubkey_type: "v0_p2wpkh" }],
        story:
          "Casey Rodarmor, 14 Dec 2022. Inscription 0 is a 793-byte image/png (sugar skull) in an OP_FALSE OP_IF “ord” envelope in the input witness. The output is a normal P2WPKH of 9,678 sats. The file is on every node that keeps witness data. Not a BIP-39 backup."
      }
    },
    {
      id: "f03cba9cbfb76889ad7c2cb1e0c8a6f9178bc3331d1e8fa861eb90e4c3f4b744",
      label: "Runestone etch",
      why: "Block 840000 (4th halving). Runes protocol: OP_RETURN OP_13 runestone.",
      snap: {
        txid: "f03cba9cbfb76889ad7c2cb1e0c8a6f9178bc3331d1e8fa861eb90e4c3f4b744",
        status: { confirmed: true, block_height: 840000 },
        vin: [{}],
        vout: [
          { value: 546, scriptpubkey_type: "v1_p2tr" },
          { value: 546, scriptpubkey_type: "v1_p2tr" },
          {
            value: 0,
            scriptpubkey_type: "op_return",
            scriptpubkey_asm: "OP_RETURN OP_PUSHNUM_13 OP_PUSHBYTES_45 020704ec8fc781e9e694a2e8b3b09094e5930701"
          }
        ],
        story:
          "Halving block 840000. This etch is UNCOMMON•GOODS•ARE•NOT•RARE (rune id 840000:1619). Output 2 is a 0-sat OP_RETURN with OP_13 — that prefix marks a Runestone, not ASCII love-notes and not an ordinal envelope. Practice inspect only. This tab does not mint runes."
      }
    }
  ];

  function psbtB64ToBytes(raw) {
    var s = String(raw || "").trim();
    if (!s) return null;
    var bytes;
    var i2;
    if (/^[0-9a-fA-F]+$/.test(s) && s.length % 2 === 0) {
      bytes = new Uint8Array(s.length / 2);
      for (i2 = 0; i2 < bytes.length; i2++) bytes[i2] = parseInt(s.slice(i2 * 2, i2 * 2 + 2), 16);
      return bytes;
    }
    try {
      var bin = atob(s.replace(/\s+/g, ""));
      bytes = new Uint8Array(bin.length);
      for (i2 = 0; i2 < bytes.length; i2++) bytes[i2] = bin.charCodeAt(i2);
      return bytes;
    } catch (e) {
      return null;
    }
  }

  function psbtReadCompact(bytes, i) {
    if (i >= bytes.length) return [0, i];
    var n = bytes[i++];
    if (n < 253) return [n, i];
    if (n === 253 && i + 1 < bytes.length) return [bytes[i] | (bytes[i + 1] << 8), i + 2];
    if (n === 254 && i + 3 < bytes.length) {
      return [
        (bytes[i] | (bytes[i + 1] << 8) | (bytes[i + 2] << 16) | (bytes[i + 3] << 24)) >>> 0,
        i + 4
      ];
    }
    return [0, bytes.length];
  }

  function parseTxPrevTxids(tx) {
    var out = [];
    if (!tx || tx.length < 10) return out;
    var i = 4;
    if (tx[4] === 0 && tx[5] === 1) i = 6;
    var vin;
    var pair = psbtReadCompact(tx, i);
    vin = pair[0];
    i = pair[1];
    var n;
    var j;
    var k;
    var hex;
    for (n = 0; n < vin && n < 16 && i + 36 <= tx.length; n++) {
      hex = "";
      for (j = 31; j >= 0; j--) {
        k = tx[i + j].toString(16);
        hex += k.length < 2 ? "0" + k : k;
      }
      if (/[1-9a-f]/i.test(hex)) out.push(hex);
      i += 32;
      i += 4;
      pair = psbtReadCompact(tx, i);
      i = pair[1] + pair[0] + 4;
    }
    return out;
  }

  function extractPsbtPrevTxids(raw) {
    var bytes = psbtB64ToBytes(raw);
    var ids = [];
    if (!bytes || bytes.length < 5) return ids;
    if (bytes[0] !== 112 || bytes[1] !== 115 || bytes[2] !== 98 || bytes[3] !== 116 || bytes[4] !== 255) {
      return ids;
    }
    var i = 5;
    var maps = 0;
    var keyLen;
    var valLen;
    var keyType;
    var pair;
    var slice;
    while (i < bytes.length) {
      if (bytes[i] === 0) {
        maps++;
        i++;
        continue;
      }
      pair = psbtReadCompact(bytes, i);
      keyLen = pair[0];
      i = pair[1];
      keyType = keyLen > 0 && i < bytes.length ? bytes[i] : -1;
      i += keyLen;
      if (i >= bytes.length) break;
      pair = psbtReadCompact(bytes, i);
      valLen = pair[0];
      i = pair[1];
      if (maps === 0 && keyType === 0 && valLen > 0 && i + valLen <= bytes.length) {
        slice = bytes.subarray(i, i + valLen);
        parseTxPrevTxids(slice).forEach(function (id) {
          if (ids.indexOf(id) < 0) ids.push(id);
        });
      }
      i += valLen;
    }
    return ids;
  }

  var psbtNetIds = [];

  function paintPsbtNet(ids, note) {
    var msg = $("v2PsbtNetMsg");
    var ack = $("v2PsbtNetAck");
    var open = $("v2PsbtNetOpen");
    var live = $("v2PsbtNetLive");
    psbtNetIds = ids && ids.length ? ids.slice() : [];
    if (!msg || !open) return;
    if (!psbtNetIds.length) {
      msg.textContent =
        "This classroom blob has no on-chain txid or input prevout. A public lookup would honestly say not found. Use a public example below, or paste a package that has a prevout. This tab did not fetch anything.";
      open.hidden = true;
      open.removeAttribute("href");
      if (live) live.textContent = "No fetch. Missing txs stay not found — never a fake confirm.";
      return;
    }
    msg.textContent = note
      ? String(note)
      : "Inspect found a prevout txid. Tick leak-ack to look it up on this tab via the same-origin mempool proxy. This tab does not call mempool.space. Network room stays available.";
    open.href = "../network.html?txid=" + encodeURIComponent(psbtNetIds[0]);
    open.hidden = !(ack && ack.checked);
    maybeFetchPsbtNet();
  }

  function findExTx(txid) {
    var i;
    for (i = 0; i < PSBT_EX_TX.length; i++) {
      if (PSBT_EX_TX[i].id === txid) return PSBT_EX_TX[i];
    }
    return null;
  }

  function hexToAsciiPrintable(hex) {
    var h = String(hex || "").replace(/[^0-9a-f]/gi, "");
    if (h.length < 2 || h.length % 2) return "";
    var s = "";
    var i;
    for (i = 0; i < h.length; i += 2) {
      var c = parseInt(h.slice(i, i + 2), 16);
      if (c >= 32 && c <= 126) s += String.fromCharCode(c);
      else s += "·";
    }
    return s;
  }
  function opReturnNotes(vout) {
    var notes = [];
    var i;
    for (i = 0; i < (vout || []).length; i++) {
      var o = vout[i] || {};
      var typ = String(o.scriptpubkey_type || o.type || "");
      var asm = String(o.scriptpubkey_asm || (o.scriptPubKey && o.scriptPubKey.asm) || "");
      if (typ !== "op_return" && typ !== "nulldata" && asm.indexOf("OP_RETURN") < 0) continue;
      var hexParts = [];
      var bits = asm.split(/\s+/);
      var b;
      for (b = 0; b < bits.length; b++) {
        if (/^[0-9a-f]+$/i.test(bits[b]) && bits[b].length >= 8 && bits[b].length % 2 === 0) hexParts.push(bits[b]);
      }
      var hex = hexParts.join("");
      var ascii = hexToAsciiPrintable(hex);
      var rune = /\bOP_PUSHNUM_13\b|\bOP_13\b/.test(asm);
      if (rune) {
        notes.push("output " + i + ": OP_RETURN OP_13 runestone (Runes protocol payload, not ASCII). hex " + (hex.slice(0, 24) || "…") + (hex.length > 24 ? "…" : ""));
      } else if (ascii && /[a-zA-Z]/.test(ascii)) {
        notes.push("output " + i + ": OP_RETURN ASCII “" + ascii.replace(/·+$/g, "") + "” (nulldata, 0 sats, unspendable)");
      } else {
        notes.push("output " + i + ": OP_RETURN data" + (hex ? " hex " + hex.slice(0, 32) + (hex.length > 32 ? "…" : "") : ""));
      }
    }
    return notes;
  }
  function witnessNotes(vin) {
    var notes = [];
    var i;
    for (i = 0; i < (vin || []).length; i++) {
      var w = (vin[i] && vin[i].witness) || [];
      var blob = Array.isArray(w) ? w.join("") : String(w || "");
      var asm = String((vin[i] && (vin[i].inner_witnessscript_asm || vin[i].witnessscript_asm)) || "");
      var hay = (blob + " " + asm).toLowerCase();
      if (hay.indexOf("6f7264") < 0 && hay.indexOf(" op_if ") < 0) continue;
      var mime = "";
      var bits = asm.split(/\s+/);
      var b;
      for (b = 0; b < bits.length; b++) {
        if (/^[0-9a-f]+$/i.test(bits[b]) && bits[b].length >= 8 && bits[b].length % 2 === 0 && bits[b] !== "6f7264") {
          var a = hexToAsciiPrintable(bits[b]);
          if (/^(text|image|application)\//i.test(a)) mime = a.replace(/·/g, "");
        }
      }
      notes.push(
        "input " +
          i +
          " witness: ordinal envelope (OP_FALSE OP_IF “ord”)." +
          (mime ? " content-type " + mime + "." : "") +
          " File lives in witness, not OP_RETURN."
      );
    }
    return notes;
  }
  function paintTxInspect(live, data, how, story) {
    var storyEl = $("v2TxStory");
    if (storyEl) {
      var body = story
        ? String(story).replace(/\n/g, " ")
        : "Classroom description of why this tx is famous. The box on the right is only what the explorer returned.";
      storyEl.innerHTML = "<strong>What this is (classroom)</strong>" + body;
    }
    if (!live) return;
    var st = (data && data.status) || {};
    var vin = (data && data.vin) || [];
    var vout = (data && data.vout) || [];
    var vinN = vin.length != null ? vin.length : "";
    var voutN = vout.length != null ? vout.length : "";
    var outLines = [];
    var oi;
    for (oi = 0; oi < vout.length; oi++) {
      var sat = vout[oi] && vout[oi].value != null ? Number(vout[oi].value) : NaN;
      var typ = (vout[oi] && (vout[oi].scriptpubkey_type || vout[oi].type)) || "";
      if (isFinite(sat)) {
        outLines.push(
          "output " +
            oi +
            ": " +
            sat +
            " sats (" +
            (sat / 1e8).toFixed(8) +
            " BTC)" +
            (typ ? " type=" + typ : "")
        );
      }
    }
    var extra = opReturnNotes(vout).concat(witnessNotes(vin));
    var via = how === "live" ? (v2LastMempoolVia || "public explorer") : "classroom snapshot";
    var lines = [
      how === "live"
        ? "On the chain (live " + via + ")."
        : "On the chain (classroom snapshot — live lookup missed). Real mainnet facts, not a fake confirm.",
      "txid " + ((data && data.txid) || ""),
      st.confirmed != null ? "confirmed: " + st.confirmed : "",
      st.block_height != null ? "block height: " + st.block_height : "",
      vinN !== "" ? "inputs: " + vinN : "",
      voutN !== "" ? "outputs: " + voutN : "",
      outLines.join("\n"),
      extra.length ? "On-chain data:\n" + extra.join("\n") : "",
      "This is not a signature and not a broadcast."
    ];
    live.textContent = lines.filter(Boolean).join("\n");
  }

  var MEMPOOL_PUBLIC = "https://mempool.space/api";
  var v2LastMempoolVia = "";
  function v2FetchMempool(path, asText) {
    function once(base) {
      var cred = base.indexOf("https://") === 0 ? "omit" : "same-origin";
      var via = base.indexOf("https://") === 0 ? "mempool.space" : "/api/mempool";
      return fetch(base + path, { credentials: cred }).then(function (res) {
        if (!res.ok) {
          var err = new Error("HTTP " + res.status);
          err.status = res.status;
          throw err;
        }
        v2LastMempoolVia = via;
        return asText ? res.text() : res.json();
      });
    }
    return once("/api/mempool").catch(function () {
      return once(MEMPOOL_PUBLIC);
    });
  }

  function maybeFetchPsbtNet() {
    var live = $("v2PsbtNetLive");
    var ack = $("v2PsbtNetAck");
    if (!live) return;
    if (!psbtNetIds.length) return;
    var txid = psbtNetIds[0];
    var ex = findExTx(txid);
    if (!ack || !ack.checked) {
      live.textContent =
        "Tick leak-ack, then Inspect this transaction. Live lookup via /api/mempool, then mempool.space; classroom snapshot if both miss.";
      return;
    }
    live.textContent = "Looking up " + txid + " (proxy, then mempool.space)…";
    v2FetchMempool("/tx/" + encodeURIComponent(txid), false)
      .then(function (data) {
        if (!data) return;
        var story = ex ? ex.label + " — " + ex.why + (ex.snap && ex.snap.story ? "\n" + ex.snap.story : "") : "";
        paintTxInspect(live, data, "live", story);
      })
      .catch(function (e) {
        if (ex && ex.snap) {
          paintTxInspect(live, ex.snap, "snap", ex.label + " — " + ex.why + "\n" + (ex.snap.story || ""));
          return;
        }
        var m = e && e.message ? String(e.message) : String(e);
        if (/HTTP 404/.test(m)) {
          live.textContent =
            "Not found. That is honest — this id is not on the public chain (classroom samples often 404). Not a fake confirm.";
          return;
        }
        live.textContent =
          "Lookup unavailable. Unknown is not a fake zero or a fake confirm. Pick a named example (Genesis, OP_RETURN, Inscription 0, Runestone…) for a classroom snapshot.";
      });
  }

  var TRACKS = [
    { id: 1, level: "Starter", title: "First wallet", job: "Make a practice phrase and one receive address.", done: "You made words, saw the card, and know the address is not the secret. You will not send coins here." },
    { id: 2, level: "Starter", title: "Paper backup", job: "Write it on paper. Do not photo it.", done: "The numbered card is the backup. No photo or cloud of a funded phrase." },
    { id: 3, level: "Beginner", title: "Add a hidden 25th word", job: "Same words + a different extra secret = a different wallet.", done: "Empty extra secret and a test secret make two addresses. Forget the test secret and that vault is gone." },
    { id: 4, level: "Beginner", title: "Path folders", job: "A path is a folder; words do not change.", done: "You changed folder or index. The words stayed the same." },
    { id: 5, level: "Beginner", title: "Watch-only", job: "Show a public viewing key. Never paste the words.", done: "You saw a viewing key, not the words. Watch apps never get the seed." },
    { id: 6, level: "Intermediate", title: "Shared custody multisig", job: "Two of three people can spend. Each keeps their own words.", done: "These are separate keys. They are not pieces of one phrase." },
    { id: 7, level: "Intermediate", title: "Split secret Shamir", job: "Cut one secret into pieces. Pieces are not cosigners.", done: "Shares rebuild one secret. They are not cosigner keys." },
    { id: 8, level: "Intermediate", title: "PSBT / air-gap", job: "Read a half-built payment here. Sign and send elsewhere.", done: "You inspect the package here. You sign offline elsewhere. You broadcast from a hot machine. Never paste the seed." },
    { id: 9, level: "Intermediate", title: "xpub privacy", job: "A viewing key cannot spend. It can still leak history.", done: "You saw a public key, not spend words. Do not post it casually." },
    { id: 10, level: "Advanced", title: "Network leak", job: "Opt-in public lookup here. Unknown is not zero.", done: "You fetched fees or an address after leak-ack. Address-only. Never the words." },
    { id: 11, level: "Beginner", title: "They hold the keys", job: "A company keeps the keys. You only have a login.", done: "You sorted who holds the keys. A login is not recovery words." },
    { id: 12, level: "Beginner", title: "Hot wallet vs hardware signer", job: "Same words, different where they live.", done: "Phone keys are hot. Hardware keeps the seed on the device. Typing the seed into a computer still kills the vault." },
    { id: 13, level: "Beginner", title: "Hot vs cold", job: "Online keys vs offline keys. Brand is not the split.", done: "Daily spend can be hot. Savings stay cold or watch-only. Sort exchange, phone, hardware, watch-only." },
    { id: 14, level: "Beginner", title: "Weak dice still make words", job: "A short pad can still print 12 or 24 words. Word count is not enough randomness.", done: "A few rolls can still print words. Those words can still be too weak. Word count is not enough." },
    { id: 15, level: "Beginner", title: "Pad then a 25th word", job: "Roll the pad first. A longer extra secret does not fix a short pad.", done: "You rolled the pad first, then added a 25th word. A longer extra secret does not fix a weak pad." },
    { id: 16, level: "Starter", title: "Prove the backup works", job: "Hide the card. Type from paper. Same receive address.", done: "Same receive address from typed words. No photo. Practice phrase only." },
    { id: 17, level: "Beginner", title: "Choose setup by amount", job: "Match daily, mid, and large to different objects.", done: "Daily on a hot spend. Mid on hardware. Large as 2-of-3. Not all on an exchange." },
    { id: 18, level: "Intermediate", title: "If I cannot speak", job: "Watch an heir fail on missing objects while you can still fix it.", done: "You saw chat, a missing extra secret, and one-of-three keys fail. The packet holds a map, not the live seed. Not a will." },
    { id: 19, level: "Beginner", title: "See a first receive", job: "Show a practice receive, then a second watch view.", done: "Same address on two views. Unknown is not zero. Never fund this practice phrase." },
    { id: 20, level: "Beginner", title: "Metal backup", job: "Paper burns. Pick a metal that survives fire and flood — and know which metals fail.", done: "You can name a safe metal, reject aluminium, accept 4-letter stamps, and still refuse any photo of the plate." },
    { id: 21, level: "Intermediate", title: "Collaborative custody", job: "You hold two keys. A partner holds one.", done: "You can say who can freeze, who can steal, and how that differs from friends 2-of-3." },
    { id: 22, level: "Beginner", title: "Hardware ceremony", job: "Check the device before a seed is born. Do not type words into the laptop.", done: "Seed stays on the device. A USB cable is not an air-gap." },
    { id: 23, level: "Intermediate", title: "Air-gap signing loop", job: "Build online, sign offline, send from hot.", done: "Four steps in order. This tab never signs." },
    { id: 24, level: "Intermediate", title: "Geographic keys", job: "Home, elsewhere, a person — not two keys in one building.", done: "Three keys not clustered in one building." },
    { id: 25, level: "Beginner", title: "Annual rehearsal", job: "Put restore and inheritance drills on a calendar.", done: "Prove-the-backup and open-while-alive are scheduled this year." },
    { id: 26, level: "Advanced", title: "Own node", job: "A public explorer is someone else’s view, not your node.", done: "This tab does not run a node. Lookups stay opt-in Network." },
    { id: 27, level: "Advanced", title: "UTXO / coin control", job: "Coins are pieces. Change is another folder.", done: "You can point at receive vs change and say why mixing pieces leaks." },
    { id: 28, level: "Advanced", title: "CoinJoin / privacy", job: "Mixing is optional. It does not replace backup.", done: "You know mixing is extra privacy, not a custody substitute." },
    { id: 29, level: "Advanced", title: "Duress / decoy passphrase", job: "A second extra secret opens a real second vault.", done: "Decoy is another real vault. This is not legal or personal-safety advice." },
    { id: 30, level: "Advanced", title: "BIP-85 child seeds", job: "One master can mint child phrases. Classic Lab is the full card.", done: "A child is not a backup of the parent. Do not fund practice children." },
    { id: 31, level: "Advanced", title: "SLIP-39 for people", job: "People hold word shares. UC7 hex stays educational.", done: "Suite lives in the SLIP-39 room. Combine is recovery, not a cosign." },
    { id: 32, level: "Advanced", title: "SeedXOR all-parts split", job: "Every part is a full 12-word list. You need all of them.", done: "N-of-N, not Shamir 2-of-3, not SLIP-39. Each part looks like a backup." },
    { id: 33, level: "Advanced", title: "Timelock dead-man (practice)", job: "Heir cannot spend until a timer expires. Owner refresh resets it.", done: "Educational timer only. This tab never signs. Not legal counsel." },
    { id: 34, level: "Advanced", title: "Descriptor / policy backup", job: "Save the policy string with the keys. Words alone can fail.", done: "You saw a practice wpkh/wsh line. Keys without policy can be unspendable." },
    { id: 35, level: "Advanced", title: "Electrum-looking words", job: "English words can still be Electrum, not BIP-39.", done: "BIP-39 restore is the wrong vault. This tab does not run Electrum." }
  ];

  var PATHS = [
    { id: "start", title: "Start here", blurb: "1 Make words · 2 The card is the backup · 3 Prove it works.", ids: [1, 2, 16] },
    { id: "keys", title: "Keys and backup", blurb: "1 Add a hidden 25th word · 2 Weak dice still make words · 3 Pad then a 25th word.", ids: [3, 14, 15, 20, 22] },
    { id: "watch", title: "Addresses and watch", blurb: "1 Folders · 2 Watch only · 3 Viewing-key privacy · 4 First receive.", ids: [4, 5, 9, 19] },
    { id: "custody", title: "Who holds the keys", blurb: "1 They hold · 2 Hot vs hardware · 3 Hot vs cold · 4 How much.", ids: [11, 12, 13, 17] },
    { id: "shared", title: "Shared and air-gap", blurb: "1 Multisig keys · 2 Shamir shares · 3 PSBT air-gap.", ids: [6, 7, 8, 10, 21, 23] },
    { id: "life", title: "Over time", blurb: "1 If I cannot speak · 2 Places for keys · 3 Yearly drill.", ids: [18, 24, 25] },
    { id: "adv", title: "Advanced", blurb: "1 Own node · 2 Coin pieces · 3 Mixing · 4 Child seeds.", ids: [26, 27, 28, 29, 30, 31] },
    { id: "odd", title: "Odd recoveries", blurb: "1 All-parts XOR · 2 Timelock FSM · 3 Policy string · 4 Electrum words.", ids: [32, 33, 34, 35] }
  ];
  var SUGGESTED = [1, 2, 16, 3, 4, 5, 19, 11, 12, 13, 17, 14, 15, 20, 6, 7, 8, 10, 18, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
  var pickerFilter = "start";
  var GATES = {
    1: { is: "Make practice words and look at the numbered card before any address.", isnt: "Do not import these words. Do not send coins here." },
    2: { is: "The numbered card is the backup. Write it by hand.", isnt: "A photo, print, or cloud copy is not the backup discipline." },
    3: { is: "Same words plus a different extra secret make a different wallet.", isnt: "The extra secret is not a PIN. Forgetting it is not a reset." },
    4: { is: "A path is a folder. The words stay put.", isnt: "A new folder is not a new backup." },
    5: { is: "Give a watch app a public viewing key.", isnt: "Do not paste the recovery words into a watch-only app." },
    6: { is: "Two of three people sign. Each has a full phrase.", isnt: "This is not cutting one phrase into pieces (that is Shamir)." },
    7: { is: "One secret cut into practice pieces. Combine to recover.", isnt: "Not Trezor Suite words. A piece cannot sign a spend." },
    8: { is: "Read a half-built payment package offline.", isnt: "This tab never signs and never broadcasts. Never paste the seed." },
    9: { is: "A viewing key lists addresses. It cannot spend.", isnt: "Do not publish it casually. It is not the recovery words." },
    10: { is: "After leak-ack this tab may fetch same-origin /api/mempool. Address-only.", isnt: "A missing lookup is unknown, not zero coins. Never the words." },
    11: { is: "A company keeps the keys. You have a login.", isnt: "If you never got recovery words, you cannot spend on your own." },
    12: { is: "Same words. Phone keys vs a hardware device.", isnt: "USB is not an air-gap. Typing the seed into a computer still kills the vault." },
    13: { is: "Hot means keys can touch the internet. Cold means they do not.", isnt: "Brand name is not the split. Sort the four objects." },
    14: { is: "Few dice can still print 12 or 24 words. Word count is not enough.", isnt: "Minted words can still be weak. Do not fund a short pad." },
    15: { is: "Roll the pad first. Then maybe an extra secret.", isnt: "A longer extra secret does not fix a short pad." },
    16: { is: "Hide the card. Type from paper. Same receive address.", isnt: "Do not photograph the card. Do not use a funded phrase." },
    17: { is: "Match how much to which object.", isnt: "Do not put daily, mid, and large all on an exchange." },
    18: { is: "Rehearse the objects an heir needs. Fail in front of you.", isnt: "Do not put a seed in chat. This is not a will or legal counsel." },
    19: { is: "A practice receive, then a second watch view.", isnt: "Do not fund this practice phrase on mainnet." },
    20: { is: "Practice choosing a fire- and flood-resistant object for a funded seed.", isnt: "A shop, a product review site, or permission to photograph any plate." },
    21: { is: "You hold two keys. A partner or service holds one.", isnt: "Not the same threat model as three friends DIY." },
    22: { is: "Check firmware before a seed is born. A seed that lived on a laptop stays a hot wallet.", isnt: "Do not import a laptop phrase into hardware and call it cold." },
    23: { is: "Build online, sign offline, broadcast from hot.", isnt: "This tab never signs." },
    24: { is: "Home, elsewhere, a person — three sites.", isnt: "Do not put two keys in one building." },
    25: { is: "Schedule restore and inheritance drills this year.", isnt: "A document you never run is a hope." },
    26: { is: "A public explorer is someone else’s view.", isnt: "This tab does not run your node." },
    27: { is: "Coins are pieces. Change is another folder.", isnt: "The total is not one coin." },
    28: { is: "Inputs spent together can look like one owner.", isnt: "Mixing does not replace backup. No mixer brand here." },
    29: { is: "A second extra secret opens a real second vault.", isnt: "Not legal or personal-safety advice." },
    30: { is: "One master can mint child phrases. Classic Lab is the full card.", isnt: "A child is not a backup of the parent. Do not fund practice children." },
    31: { is: "People hold product word shares. Dock the SLIP-39 room.", isnt: "UC7 hex is educational, not Suite." },
    32: { is: "Every XOR part is a full 12-word list. You need all of them.", isnt: "Not Shamir 2-of-3. Not SLIP-39. Not the SeedXOR.com calculator." },
    33: { is: "A practice timer. Heir spend stays locked until it expires. Refresh resets.", isnt: "This tab never signs or broadcasts. Not a live CSV wallet. Not legal counsel." },
    34: { is: "Back up the policy string with the keys.", isnt: "Words alone can fail for multisig and script paths. Not UC5 export." },
    35: { is: "English words can still be Electrum’s stretch, not BIP-39.", isnt: "BIP-39 restore is the wrong vault. This tab does not compute Electrum addresses." }
  };

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
  function hasAck() {
    return !!loadState().ack;
  }
  function setAck() {
    var s = loadState();
    s.ack = true;
    saveState(s);
  }

  function show(which) {
    ["viewPicker", "viewGate", "viewTrack"].forEach(function (id) {
      var el = $(id);
      if (el) el.classList.toggle("v2-hidden", id !== which);
    });
  }

  function pathFor(id) {
    var i;
    for (i = 0; i < PATHS.length; i++) {
      if (PATHS[i].ids.indexOf(id) >= 0) return PATHS[i].id;
    }
    return "all";
  }

  function nextInPath(pid) {
    var p = PATHS.filter(function (x) { return x.id === pid; })[0];
    var done = completedSet();
    var i;
    if (!p) return null;
    for (i = 0; i < p.ids.length; i++) {
      if (done.indexOf(p.ids[i]) < 0) return p.ids[i];
    }
    return null;
  }
  function nextSuggested() {
    var done = completedSet();
    var i;
    if (pickerFilter && pickerFilter !== "all") {
      var n = nextInPath(pickerFilter);
      if (n != null) return n;
    }
    for (i = 0; i < SUGGESTED.length; i++) {
      if (done.indexOf(SUGGESTED[i]) < 0) return SUGGESTED[i];
    }
    return null;
  }

  function starterReady() {
    var done = completedSet();
    return [1, 2, 16].every(function (id) { return done.indexOf(id) >= 0; });
  }

  var START_IDS = [1, 2, 16];
  var CARD_ATOM = {
    1: "assets/uc1-atom-entropy-words.svg",
    2: "assets/uc2-atom-card-object.svg",
    16: "assets/uc1-atom-phrase-ne-address.svg"
  };

  function startDotClass(id, done, currentId) {
    if (done.indexOf(id) >= 0) return "done";
    if (id === currentId) return "current";
    var ci = START_IDS.indexOf(currentId);
    var ii = START_IDS.indexOf(id);
    if (ci >= 0 && ii > ci) return "locked";
    return "empty";
  }

  function cardHtml(t, done, later, opts) {
    opts = opts || {};
    var isDone = done.indexOf(t.id) >= 0;
    var first = !!opts.current && !isDone;
    var atom = opts.atom || CARD_ATOM[t.id];
    var step = opts.step;
    return (
      '<button type="button" class="uc-card lvl-' +
      t.level +
      (isDone ? " done" : "") +
      (later && !isDone ? " later" : "") +
      (first ? " first-step" : "") +
      (step ? " uc-chapter" : "") +
      (step ? " step-" + step : "") +
      '" data-uc="' +
      t.id +
      '">' +
      (atom
        ? '<img class="uc-atom" src="' + atom + '" alt="" width="96" height="96">'
        : "") +
      '<div class="uc-card-body">' +
      (step
        ? '<span class="uc-step' +
          (isDone ? " is-done" : first ? " is-now" : "") +
          '">' +
          (isDone ? "✓" : step) +
          "</span>"
        : "") +
      (first ? '<span class="uc-first">Start</span>' : "") +
      "<h3>" +
      t.title +
      "</h3>" +
      '<p class="uc-job">' +
      t.job +
      "</p>" +
      '<div class="uc-id"><span class="uc-num">UC' +
      t.id +
      "</span><span class=\"uc-lvl\">" +
      t.level +
      "</span></div></div>" +
      "</button>"
    );
  }

  function renderPicker() {
    var grid = $("pickerGrid");
    var head = $("pickerHead");
    if (!grid) return;
    var done = completedSet();
    var nxt = nextSuggested();
    var nxtT = nxt ? TRACKS.filter(function (x) { return x.id === nxt; })[0] : null;
    var laterAdv = !starterReady();
    var startDoneN = START_IDS.filter(function (id) { return done.indexOf(id) >= 0; }).length;
    var startCurrent = null;
    START_IDS.forEach(function (id) {
      if (startCurrent == null && done.indexOf(id) < 0) startCurrent = id;
    });
    if (head) {
      var filters = [
        { id: "all", lab: "All paths" },
        { id: "start", lab: "Start here" },
        { id: "keys", lab: "Keys" },
        { id: "watch", lab: "Watch" },
        { id: "custody", lab: "Custody" },
        { id: "shared", lab: "Shared" },
        { id: "life", lab: "Over time" },
        { id: "adv", lab: "Advanced" }
      ];
      head.innerHTML =
        '<div class="v2-picker-lead">' +
        (nxtT
          ? '<button type="button" class="btn v2-continue' +
            (done.length ? "" : " pulse") +
            '" id="v2Continue" data-uc="' +
            nxtT.id +
            '">' +
            (done.length ? "Continue · " : "Start · ") +
            nxtT.title +
            "</button>"
          : '<p class="v2-picker-done-all">All listed tracks marked done.</p>') +
        '<div class="v2-start-prog">' +
        '<ol class="v2-start-dots" aria-label="Start here progress">' +
        START_IDS.map(function (id) {
          return '<li class="' + startDotClass(id, done, startCurrent) + '"></li>';
        }).join("") +
        "</ol>" +
        '<p class="v2-start-frac">' +
        startDoneN +
        " of 3 in Start here</p>" +
        '<p class="control-help v2-picker-count">' +
        done.length +
        " / " +
        TRACKS.length +
        " all paths</p></div></div>" +
        '<div class="v2-path-filters" role="tablist">' +
        filters
          .map(function (f) {
            return (
              '<button type="button" class="v2-filter' +
              (pickerFilter === f.id ? " is-on" : "") +
              '" data-path-filter="' +
              f.id +
              '" aria-pressed="' +
              (pickerFilter === f.id ? "true" : "false") +
              '">' +
              f.lab +
              "</button>"
            );
          })
          .join("") +
        "</div>";
    }
    var showPaths = PATHS.filter(function (p) {
      return pickerFilter === "all" || pickerFilter === p.id;
    });
    grid.innerHTML = showPaths
      .map(function (p) {
        var cards = p.ids
          .map(function (id, ix) {
            var t = TRACKS.filter(function (x) { return x.id === id; })[0];
            if (!t) return "";
            var startish = p.id === "start";
            return cardHtml(t, done, p.id === "adv" && laterAdv, {
              step: startish ? ix + 1 : 0,
              current: startish && id === startCurrent,
              atom: startish ? CARD_ATOM[id] : ""
            });
          })
          .join("");
        var pathCurrent = null;
        p.ids.forEach(function (id) {
          if (pathCurrent == null && done.indexOf(id) < 0) pathCurrent = id;
        });
        var wantRail = true;
        var rail = wantRail
          ? '<ol class="v2-step-path" aria-hidden="true">' +
            p.ids.map(function (id, ix) {
              return (
                '<li class="' +
                startDotClass(id, done, pathCurrent) +
                '"><span>' +
                (done.indexOf(id) >= 0 ? "✓" : ix + 1) +
                "</span></li>"
              );
            }).join("") +
            "</ol>"
          : "";
        return (
          '<section class="v2-path' +
          (p.id === "start" ? " v2-path-hero" : "") +
          '" data-path="' +
          p.id +
          '"><header class="v2-path-h"><h2>' +
          p.title +
          "</h2><p>" +
          p.blurb +
          "</p></header>" +
          rail +
          '<div class="v2-picker-grid">' +
          cards +
          "</div></section>"
        );
      })
      .join("");
    if (pickerFilter === "start") {
      var keys = PATHS.filter(function (p) { return p.id === "keys"; })[0];
      var ghosts = (keys ? keys.ids : []).slice(0, 3).map(function (id) {
        var t = TRACKS.filter(function (x) { return x.id === id; })[0];
        if (!t) return "";
        return (
          '<button type="button" class="uc-ghost" data-path-filter="keys">' +
          '<span class="uc-next-lab">Next</span><strong>' +
          t.title +
          "</strong></button>"
        );
      }).join("");
      grid.innerHTML +=
        '<div class="v2-path-next">' +
        "<p>Next · Keys and backup</p>" +
        '<div class="v2-ghost-row">' +
        ghosts +
        "</div></div>";
    }
    function bindOpen(root) {
      if (!root) return;
      root.querySelectorAll("[data-uc]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          openUc(parseInt(btn.getAttribute("data-uc"), 10));
        });
      });
    }
    bindOpen(grid);
    bindOpen(head);
    document.querySelectorAll("[data-path-filter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        pickerFilter = btn.getAttribute("data-path-filter") || "all";
        renderPicker();
      });
    });
    show("viewPicker");
    $("panelTitle").textContent = "Use-case tracks";
    $("panelSub").textContent = "Follow the path. Tracks teach; rooms stay in the sidebar.";
  }

  function openUc(id) {
    var t = TRACKS.filter(function (x) { return x.id === id; })[0];
    if (!t) return;
    if (!gated(id)) {
      var g = GATES[id] || {
        is: "Offline practice. Not a funded wallet or a signer.",
        isnt: "Do not import these words. Do not send coins here."
      };
      $("gateTitle").textContent = "UC" + t.id + " — " + t.title;
      $("gateScope").innerHTML =
        '<div class="v2-gate-tight">' +
        '<div class="v2-callout is" id="gateIs"><strong>Is</strong> ' + g.is + "</div>" +
        '<div class="v2-callout isnt" id="gateIsnt"><strong>Is not</strong> ' + g.isnt + "</div>" +
        "</div>" +
        '<div class="v2-callout done" id="gateDone"><strong>Done when</strong> ' +
        t.done +
        "</div>";
      var gv = $("gateViz");
      if (gv) gv.innerHTML = vizHtml(id, { allDim: true, suffix: "Gate" });
      $("btnGateStart").onclick = function () {
        setGated(id);
        startTrack(id);
      };
      show("viewGate");
      applyViz(id, 0, "Gate");
      return;
    }
    startTrack(id);
  }

  var current = { id: 1, step: 0 };

  function stepsFor(id) {
    var map = {
      1: ["Generate", "Numbered card", "Receive address", "Try length", "Quiz", "Finish"],
      2: ["Card is backup", "Hand copy", "Print optional", "Quiz", "Finish"],
      3: ["Same words", "Compare A/B", "Quiz", "Finish"],
      4: ["Folders", "Toggle path", "Quiz", "Finish"],
      5: ["Public only", "Export", "Quiz", "Finish"],
      6: ["Show 2-of-3", "Three full seeds", "Quiz", "Finish"],
      7: ["Phrase + hex", "SLIP-39 2-of-3", "Extra secret", "Quiz", "Finish"],
      8: ["Air-gap model", "Inspect sample", "Quiz", "Finish"],
      9: ["Cannot spend", "Export viewing key", "Quiz", "Finish"],
      10: ["Stay offline", "Opt-in Network", "Quiz", "Finish"],
      11: ["Who is they", "Company app", "You hold", "Quiz", "Finish"],
      12: ["Hot wallet on phone", "Hardware signer", "Quiz", "Finish"],
      13: ["Hot vs cold", "Daily vs savings", "Quiz", "Finish"],
      14: ["Few dice", "Words still weak", "Roll until enough", "Quiz", "Finish"],
      15: ["Pad + words", "Add passphrase", "Quiz", "Finish"],
      16: ["Hide the card", "Type from paper", "Quiz", "Finish"],
      17: ["How much", "Place amounts", "Quiz", "Finish"],
      18: ["Heirs fail on objects", "Build the packet", "Open while alive", "Quiz", "Finish"],
      19: ["Receive address", "Watch + credit", "Quiz", "Finish"],
      20: ["Paper fails", "Metals compared", "4 letters are enough", "Solid plate rules", "Quiz", "Finish"],
      21: ["You hold two", "Name freeze vs steal", "Quiz", "Finish"],
      22: ["Check firmware", "Laptop seed stays hot", "Quiz", "Finish"],
      23: ["Four steps", "Tap the loop", "Quiz", "Finish"],
      24: ["Three sites", "Place three keys", "Quiz", "Finish"],
      25: ["Plans go stale", "Schedule drills", "Quiz", "Finish"],
      26: ["Not your node", "Opt-in lookup", "Quiz", "Finish"],
      27: ["Coins are pieces", "Change folder", "Quiz", "Finish"],
      28: ["Common input", "Mixing is not custody", "Quiz", "Finish"],
      29: ["Second vault", "Decoy is real", "Quiz", "Finish"],
      30: ["Parent vs child", "Classic BIP-85", "Quiz", "Finish"],
      31: ["People + threshold", "Dock Suite", "Quiz", "Finish"],
      32: ["All parts look like seeds", "Need every part", "Quiz", "Finish"],
      33: ["Arm the timer", "Tick / refresh / heir", "Quiz", "Finish"],
      34: ["Policy is an object", "Save the descriptor", "Quiz", "Finish"],
      35: ["Looks like BIP-39", "Wrong restore", "Quiz", "Finish"]
    };
    return map[id] || ["Start", "Finish"];
  }

  function conceptsFor(id) {
    var c = {
      1: ["Random bits → words", "Backup card", "Address is not the secret"],
      2: ["Card object", "Hand copy only", "Passphrase stored apart"],
      3: ["Optional 25th", "New wallet", "Forgotten = loss"],
      4: ["Path = folder", "BIP purpose", "Index / change"],
      5: ["Watch-only", "zpub/xpub", "Never the seed"],
      6: ["M-of-N", "Public keys", "Not Shamir"],
      7: ["Threshold shares", "2-of-3 lists", "Extra secret ≠ 25th"],
      8: ["PSBT package", "Never sign here", "Broadcast elsewhere"],
      9: ["Viewing key", "Cannot spend", "Still leaks history"],
      10: ["Page stays offline", "Address only", "Unknown is not zero"],
      11: ["They hold", "You hold", "Not BIP-39"],
      12: ["Hot software", "Hardware", "USB is not air-gap"],
      13: ["Hot vs cold", "Daily vs savings", "Four objects"],
      14: ["Few dice TOO LOW", "Words still weak", "Roll until enough"],
      15: ["Pad is the source", "Passphrase extra", "Does not fix pad"],
      16: ["Hide the screen", "Checksum", "Same address"],
      17: ["Daily hot", "Mid hardware", "Large 2-of-3"],
      18: ["Missing objects", "Packet is a map", "Open while alive"],
      19: ["Test address", "Second view", "Unknown is not zero"],
      20: ["Paper fails", "Aluminium bad · stainless good", "Plate is still secret"],
      21: ["You hold 2", "Service can freeze", "Not DIY same threat"],
      22: ["Firmware", "Notes-file vault", "New seed on device"],
      23: ["Build PSBT", "Offline sign", "Broadcast elsewhere"],
      24: ["Home", "Elsewhere", "Not one building"],
      25: ["Calendar", "UC16 restore", "UC18 open-alive"],
      26: ["No node in this tab", "Unknown is not zero", "Network dock"],
      27: ["UTXO pieces", "Change chain", "Do not mix casually"],
      28: ["Heuristics", "Optional mix", "Still need keys"],
      29: ["Two vaults", "Duress copy", "Not advice"],
      30: ["Child mnemonic", "Parent stays", "Lab #cardBip85"],
      31: ["SLIP-39 words", "Not UC7 hex", "Room dock"],
      32: ["Full-phrase parts", "N-of-N", "Not Shamir"],
      33: ["Arm", "Expire", "Refresh"],
      34: ["Policy string", "With the keys", "Not words only"],
      35: ["Same English", "BIP-39 restore", "Wrong vault"]
    };
    return c[id] || ["A", "B", "C"];
  }

  function startTrack(id) {
    var gv = $("gateViz");
    if (gv) gv.innerHTML = "";
    current = { id: id, step: 0 };
    mem.cardAck = false;
    mem.maxStep = 0;
    mem.restoreHidden = false;
    mem.restoreOk = false;
    mem.restoreAddr = "";
    mem.tier = {};
    mem.simRecv = false;
    mem.loopClicks = [];
    mem.pathTouched = false;
    mem.shamirShares = null;
    mem.shamirSecret = "";
    mem.shamirDone = false;
    mem.shamirMnemonic = "";
    mem.shamirMN = { m: 2, n: 3 };
    mem.slip39Shares = null;
    mem.slip39Hex = "";
    mem.slip39Done = false;
    mem.slip39TriedOne = false;
    mem.slip39TriedTwo = false;
    mem.slip39PpDone = false;
    mem.psbtExI = null;
    mem.netSnap = false;
    mem.metalSeen = {};
    mem.metalPick = "";
    mem.fourOk = false;
    mem.fourWords = null;
    mem.plateKind = "";
    mem.geo = {};
    mem.xorA = "";
    mem.xorB = "";
    mem.xorOrig = "";
    mem.xorAll = false;
    mem.tl = { armed: false, ticks: 0, expired: false };
    mem.tlHeirTried = false;
    mem.inh = null;
    mem.descAck = false;
    mem.elBip = false;
    mem.elNote = "";
    mem.elAddr = "";
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
      14: [0, 1, 2],
      15: [0, 1, 2],
      16: [0, 1, 2],
      17: [0, 1, 2],
      18: [0, 1, 2],
      19: [0, 1, 2],
      20: [0, 1, 3],
      21: [0, 1, 2],
      22: [0, 1, 2],
      23: [0, 1, 2],
      24: [0, 1, 2],
      25: [0, 1, 2],
      26: [0, 1, 2],
      27: [0, 1, 2],
      28: [0, 1, 2],
      29: [0, 1, 2],
      30: [0, 1, 2],
      31: [0, 1, 2],
      32: [0, 1, 2],
      33: [0, 1, 2],
      34: [0, 1, 2],
      35: [0, 1, 2]
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
      forStep: function (s) { if (s <= 0) return 1; if (s === 1) return 2; return 3; },
      atoms: [
        atom(1, 0, "assets/uc1-atom-entropy-words.svg", "Random bits become numbered recovery words", "<strong>Plan · Random bits to words</strong><br/>Random bits become a numbered recovery phrase. That phrase is the secret."),
        atom(2, 1, "assets/uc1-atom-phrase-ne-address.svg", "Recovery phrase is not the same as a receive address", "<strong>Practice · Words are not the address</strong><br/>The words stay secret. The receive address is public and safe to share."),
        atom(3, 2, "assets/uc1-atom-one-to-many.svg", "One recovery phrase can make many receive addresses", "<strong>Review · One phrase, many addresses</strong><br/>The same words can make many receive addresses (different folder numbers).")
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
        atom(2, 1, "assets/uc3-atom-new-vault.svg", "A different extra secret makes a different vault", "<strong>Practice · Empty vs a test secret</strong><br/>Same words plus a different extra secret make a different receive address."),
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
        atom(1, 0, "assets/uc10-atom-offline.svg", "Crypto stays here until you opt in", "<strong>Plan · Opt-in</strong><br/>No lookup until leak-ack. Then same-origin /api/mempool only."),
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
        atom(1, 0, "assets/uc14-atom-few-dice.svg", "A few dice rolls are too little randomness", "<strong>Plan · Few dice</strong><br/>Roll a few times. You can still get words. Those words can still be too weak."),
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
    },
    16: {
      atoms: [
        atom(1, 0, "assets/uc2-atom-card-object.svg", "The numbered card is what you restore from", "<strong>Plan · Card object</strong><br/>Hide the screen. The paper (or metal) is the only copy you type from."),
        atom(2, 1, "../assets/catalyxt/custody/atom/hand-pen.svg", "Hand writing numbered words on a paper backup", "<strong>Practice · Type from paper</strong><br/>Checksum and the same receive address prove the backup works."),
        atom(3, 2, "assets/uc1-atom-phrase-ne-address.svg", "Same words must yield the same address", "<strong>Review · Same address</strong><br/>A photo of the screen is not a restore drill.")
      ]
    },
    17: {
      atoms: [
        atom(1, 0, "assets/uc13-atom-daily-savings.svg", "Daily spend can be hot", "<strong>Plan · How much</strong><br/>Coffee money is not a 2-of-3 ceremony."),
        atom(2, 1, "assets/uc13-atom-four-objects.svg", "Four objects for three amounts", "<strong>Practice · Place amounts</strong><br/>0.001 phone · 0.184 hardware · 2.0 2-of-3. Exchange is a trap for savings."),
        atom(3, 2, "assets/uc11-atom-they-hold.svg", "Exchange is they-hold", "<strong>Review · Not all on exchange</strong><br/>Putting every stack on a login is not amount-tiered setup.")
      ]
    },
    18: {
      forStep: function (s) { if (s <= 0) return 1; if (s <= 2) return 2; return 3; },
      atoms: [
        atom(1, 0, "assets/uc6-atom-three-phrases.svg", "Heirs fail on missing objects", "<strong>Plan · Missing kit</strong><br/>Words without the extra secret. One key of three. A chat screenshot. Fail now, not later."),
        atom(2, 1, "assets/uc6-atom-mofn.svg", "The packet is a map, not a second seed", "<strong>Practice · Packet</strong><br/>Descriptor, where keys live, next drill date. Never the live words plus the extra secret in the same envelope."),
        atom(3, 3, "assets/uc11-atom-not-a-wallet.svg", "Open it while you can still talk", "<strong>Review · Alive</strong><br/>This tab is not a will. UC16 restores. UC6 is keys. UC7 is shares. UC33 is a timer.")
      ]
    },
    19: {
      atoms: [
        atom(1, 0, "assets/uc1-atom-phrase-ne-address.svg", "A receive address you can show", "<strong>Plan · Test address</strong><br/>QR and text of a practice tb1 address."),
        atom(2, 1, "assets/uc5-atom-viewing-key.svg", "Watch-only second view", "<strong>Practice · Same address twice</strong><br/>Simulated 0.000184 tBTC. Unknown is not zero."),
        atom(3, 2, "assets/uc10-atom-unknown-not-zero.svg", "Never fund practice mainnet", "<strong>Review · Practice only</strong><br/>Real lookup is the Network room after opt-in. This tab stays offline.")
      ]
    },
    20: {
      forStep: function (s) { if (s <= 0) return 1; if (s <= 2) return 2; return 3; },
      atoms: [
        atom(1, 0, "../assets/catalyxt/custody/atom/paper-fail.svg", "Paper burns and floods", "<strong>Plan · Paper fails</strong><br/>Fire and flood destroy paper. A funded seed wants a metal object."),
        atom(2, 1, "../assets/catalyxt/custody/atom/metals.svg", "Compare metals: aluminium fails, stainless survives", "<strong>Practice · Metals</strong><br/>Aluminium melts in a house fire. Stainless is the default. Titanium is premium. Still no photo."),
        atom(3, 3, "../assets/catalyxt/custody/atom/camera-slash.svg", "The plate is still a secret", "<strong>Review · Still secret</strong><br/>Four letters per word are enough. A photo of steel is not a backup. Solid plate, not loose tiles.")
      ]
    },
    21: {
      atoms: [
        atom(1, 0, "assets/uc6-atom-mofn.svg", "You keep two keys", "<strong>Plan · You hold 2</strong><br/>A partner or service holds the third."),
        atom(2, 1, "assets/uc6-atom-three-phrases.svg", "Freeze vs steal", "<strong>Practice · Different threat</strong><br/>The service can often freeze. They should not spend alone."),
        atom(3, 2, "assets/uc6-atom-not-shamir.svg", "Not the same as DIY 2-of-3", "<strong>Review · Not DIY</strong><br/>Collaborative custody is a product. DIY is three people you named.")
      ]
    },
    22: {
      atoms: [
        atom(1, 0, "assets/uc12-atom-hardware.svg", "Check firmware before a seed", "<strong>Plan · Unbox</strong><br/>Supply chain and firmware are the ceremony, not a USB driver in this tab."),
        atom(2, 1, "assets/uc12-atom-usb-not-airgap.svg", "Laptop seed stays hot", "<strong>Practice · Same words</strong><br/>Words that lived on a computer stay a software vault. Hardware does not un-steal them."),
        atom(3, 2, "assets/uc12-atom-hot-phone.svg", "New seed on the device", "<strong>Review · Separate vaults</strong><br/>Savings get a seed born on hardware. The laptop phrase stays hot.")
      ]
    },
    23: {
      atoms: [
        atom(1, 0, "assets/uc8-atom-package.svg", "Hot coordinator builds a PSBT", "<strong>Plan · Build</strong><br/>Online machine never sees the seed."),
        atom(2, 1, "assets/uc8-atom-no-seed.svg", "QR or SD to the offline signer", "<strong>Practice · Hand-off</strong><br/>This tab may show a fake QR. It does not sign."),
        atom(3, 2, "assets/uc8-atom-sign-elsewhere.svg", "Signed PSBT back, broadcast elsewhere", "<strong>Review · Broadcast</strong><br/>Inspect here. Sign cold. Broadcast hot. Four steps.")
      ]
    },
    24: {
      atoms: [
        atom(1, 0, "assets/uc6-atom-three-phrases.svg", "Three keys, three places", "<strong>Plan · Sites</strong><br/>Home, elsewhere, a person or institution."),
        atom(2, 1, "assets/uc6-atom-mofn.svg", "Do not cluster", "<strong>Practice · Map</strong><br/>Two keys in one building is a fire."),
        atom(3, 2, "assets/uc13-atom-four-objects.svg", "Ops, not M-of-N math", "<strong>Review · Geography</strong><br/>The threshold already exists. This track places the objects.")
      ]
    },
    25: {
      atoms: [
        atom(1, 0, "assets/uc2-atom-card-object.svg", "Plans go stale", "<strong>Plan · Calendar</strong><br/>A restore you never run is a hope."),
        atom(2, 1, "assets/uc2-atom-hand-not-photo.svg", "Schedule UC16", "<strong>Practice · Restore drill</strong><br/>Pick a month. Hide the screen. Type from paper."),
        atom(3, 2, "assets/uc6-atom-mofn.svg", "Schedule UC18 open-while-alive", "<strong>Review · Inheritance dry-run</strong><br/>Heirs should fail in front of you, not after.")
      ]
    },
    26: {
      atoms: [
        atom(1, 0, "assets/uc10-atom-offline.svg", "This tab does not run a node", "<strong>Plan · No node in-tab</strong><br/>A public explorer is someone else's view."),
        atom(2, 1, "assets/uc10-atom-address-only.svg", "Lookups are opt-in", "<strong>Practice · Network dock</strong><br/>Address-only after you leave /v2/."),
        atom(3, 2, "assets/uc10-atom-unknown-not-zero.svg", "Unknown is not zero", "<strong>Review · Honesty</strong><br/>Failed lookup must not print 0.")
      ]
    },
    27: {
      atoms: [
        atom(1, 0, "assets/uc4-atom-path-folder.svg", "UTXOs are pieces", "<strong>Plan · Pieces</strong><br/>A wallet total hides which coins you spend."),
        atom(2, 1, "assets/uc4-atom-index.svg", "Change is a folder", "<strong>Practice · Change chain</strong><br/>Path …/1/n is change. Mixing inputs links history."),
        atom(3, 2, "assets/uc4-atom-words-stay.svg", "Deep coin control stays in Lab", "<strong>Review · Thin pad</strong><br/>This track names the job. Full UTXO toys stay on /.")
      ]
    },
    28: {
      atoms: [
        atom(1, 0, "assets/uc9-atom-leaks-history.svg", "Common-input heuristics", "<strong>Plan · Heuristics</strong><br/>Inputs spent together are often assumed same owner."),
        atom(2, 1, "assets/uc9-atom-watch-only.svg", "Mixing is optional", "<strong>Practice · Brand-agnostic</strong><br/>No vendor name. Mixing does not replace a seed backup."),
        atom(3, 2, "assets/uc9-atom-cannot-spend.svg", "Still need keys", "<strong>Review · Custody first</strong><br/>Privacy tools sit on top of keys you already control.")
      ]
    },
    29: {
      atoms: [
        atom(1, 0, "assets/uc3-atom-same-words.svg", "Same words, second passphrase", "<strong>Plan · Second vault</strong><br/>A decoy passphrase opens a real smaller vault."),
        atom(2, 1, "assets/uc3-atom-new-vault.svg", "Both vaults are real", "<strong>Practice · Real decoy</strong><br/>Empty decoy is obvious. This is not personal-safety training."),
        atom(3, 2, "assets/uc3-atom-forgotten-loss.svg", "Not legal advice", "<strong>Review · Copy bar</strong><br/>Duress is a threat model, not a recommendation.")
      ]
    },
    30: {
      atoms: [
        atom(1, 0, "assets/uc1-atom-entropy-words.svg", "Parent can mint children", "<strong>Plan · BIP-85</strong><br/>One master, many child mnemonics. Classic Lab #cardBip85."),
        atom(2, 1, "assets/uc1-atom-one-to-many.svg", "Child is not the parent backup", "<strong>Practice · Child ≠ parent</strong><br/>Losing the parent loses the children."),
        atom(3, 2, "assets/uc1-atom-phrase-ne-address.svg", "Do not fund practice children", "<strong>Review · Practice</strong><br/>SoT remains the classic card, not this track.")
      ]
    },
    31: {
      atoms: [
        atom(1, 0, "assets/uc7-atom-one-secret.svg", "SLIP-39 is a product format", "<strong>Plan · Suite words</strong><br/>Operational inheritance uses SLIP-39 shares, not edu hex."),
        atom(2, 1, "assets/uc7-atom-m-pieces.svg", "Threshold people", "<strong>Practice · People</strong><br/>M of N human holders. Combine is recovery."),
        atom(3, 2, "assets/uc7-atom-share-no-sign.svg", "UC7 stays hex; dock the room", "<strong>Review · Dock</strong><br/>Open /slip39.html. This tab does not replace Suite.")
      ]
    },
    32: {
      atoms: [
        atom(1, 0, "assets/uc7-atom-one-secret.svg", "Each part looks like a full backup", "<strong>Plan · Full lists</strong><br/>SeedXOR-style N-of-N: every part is twelve words."),
        atom(2, 1, "assets/uc7-atom-m-pieces.svg", "You need every part", "<strong>Practice · All parts</strong><br/>One missing list and the secret does not come back."),
        atom(3, 2, "assets/uc7-atom-share-no-sign.svg", "Not Shamir, not SLIP-39", "<strong>Review · Different job</strong><br/>UC7 is threshold hex. UC31 is Suite words. This is all-parts.")
      ]
    },
    33: {
      atoms: [
        atom(1, 0, "assets/uc8-atom-package.svg", "Arm a dead-man timer", "<strong>Plan · Arm</strong><br/>CSV inactivity is the bitcoin idea. This tab is a classroom timer."),
        atom(2, 1, "assets/uc8-atom-no-seed.svg", "Heir waits; owner can refresh", "<strong>Practice · Tick</strong><br/>Advance simulated days. Refresh resets. No signature."),
        atom(3, 2, "assets/uc8-atom-sign-elsewhere.svg", "This tab never signs", "<strong>Review · No signer</strong><br/>Heir spend here is a state label, not a transaction.")
      ]
    },
    34: {
      atoms: [
        atom(1, 0, "assets/uc5-atom-viewing-key.svg", "Policy is a string you can lose", "<strong>Plan · Descriptor</strong><br/>wpkh / wsh / sortedmulti. Keys without the script can fail."),
        atom(2, 1, "assets/uc5-atom-viewing-key.svg", "Save the line with the keys", "<strong>Practice · Backup the policy</strong><br/>Not the same job as exporting a watch-only key."),
        atom(3, 2, "assets/uc6-atom-not-shamir.svg", "Not UC6 three seeds", "<strong>Review · Extra object</strong><br/>Cosigners still need the output script recorded.")
      ]
    },
    35: {
      atoms: [
        atom(1, 0, "assets/uc1-atom-entropy-words.svg", "Twelve English words", "<strong>Plan · Looks like BIP-39</strong><br/>Electrum can use the same dictionary with a different stretch."),
        atom(2, 1, "assets/uc1-atom-phrase-ne-address.svg", "BIP-39 restore is the wrong vault", "<strong>Practice · Wrong tool</strong><br/>Checksum-looking words can still not be BIP-39."),
        atom(3, 2, "assets/uc2-atom-card-object.svg", "This tab does not run Electrum", "<strong>Review · No fake address</strong><br/>We do not invent an Electrum receive string.")
      ]
    }
  };

  function defaultVizStep(s) {
    if (s <= 0) return 1;
    if (s === 1) return 2;
    return 3;
  }

  function vizHtml(id, opts) {
    var spec = VIZ[id];
    if (!spec) return "";
    opts = opts || {};
    var maxS = Math.max(0, mem.maxStep || 0);
    return (
      '<div class="uc-viz" id="uc' +
      id +
      (opts.suffix || "") +
      'Viz">' +
      spec.atoms
        .map(function (a) {
          var can = !opts.allDim && a.jump <= maxS;
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

  function applyViz(id, step, suffix) {
    var spec = VIZ[id];
    if (!spec) return;
    var n = String((spec.forStep || defaultVizStep)(step));
    var sel = "#uc" + id + (suffix || "") + "Viz [data-atom]";
    var fn = function (k) {
      k = String(k | 0);
      document.querySelectorAll(sel).forEach(function (el) {
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
    if (!words.length) {
      var empty = '<ol class="word-grid"' + (gridId === undefined ? ' id="v2WordGrid"' : gridId ? ' id="' + gridId + '"' : "") + ">";
      var e;
      for (e = 0; e < 12; e++) {
        empty += '<li><span class="wi">' + (e + 1) + '</span><span class="ww">—</span></li>';
      }
      empty += "</ol>";
      return empty;
    }
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
    if (id >= 16 && id <= 35) return ucJob(id, step);
    return "";
  }

  function qOk(t, why) { return { k: "ok", t: t, okwhy: why || "Correct." }; }
  function qBad(t, why) { return { k: "bad", t: t, why: why || "Wrong." }; }

  function shuffleQuizOpts(opts) {
    var a = (opts || []).slice();
    var i;
    var j;
    var t;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function jobQuizzes(id) {
    var m = {
      16: [
        { q: "What does a restore drill prove?", opts: [qOk("The words on paper rebuild the same receive address.", "Correct. The backup object works."), qBad("You photographed the screen, so you are safe.", "Wrong. A photo is not the numbered card.")] },
        { q: "If the checksum check fails, what is true?", opts: [qOk("A word is wrong, misspelled, or out of order. Fix the paper copy.", "Correct."), qBad("Send coins anyway to test it.", "Wrong. Never fund a broken practice restore.")] },
        { q: "This restore phrase is for practice. What should you do with real money?", opts: [qOk("Do not send real coins to it.", "Correct. The drill is practice only."), qBad("Send a little real bitcoin to prove restore works.", "Wrong. Never fund a practice phrase.")] }
      ],
      17: [
        { q: "For a coffee-size amount, what object fits?", opts: [qOk("A hot phone wallet (or similar) is enough.", "Correct. A three-person vault is overkill for coffee money."), qBad("Set up a 2-of-3 vault for a tiny amount.", "Wrong. That is more ceremony than the amount needs.")] },
        { q: "For a large amount, what object fits?", opts: [qOk("A 2-of-3 setup among people you named — not a company login.", "Correct."), qBad("Keep all of it on one exchange account.", "Wrong. Then the company holds the keys.")] },
        { q: "Should daily, mid, and large amounts all live on the same phone?", opts: [qOk("No. Different amounts should live on different objects.", "Correct. Brand on a box does not make a phone cold."), qBad("Yes, if the app’s box said hardware.", "Wrong. Keys on a phone are hot.")] }
      ],
      18: [
        { q: "They have the twelve words. You used a hidden extra secret. They do not. What happens?", opts: [qOk("They open an empty vault. The funded one stays locked.", "Correct. The extra secret is a second object. If it dies with you, so does that vault."), qBad("The twelve words are enough. The extra secret is only a PIN.", "Wrong. Empty extra secret and a real extra secret are two different wallets.")] },
        { q: "What belongs in the sealed packet?", opts: [qOk("A map: who holds which key or share, the policy string, and a date to open it while you are alive.", "Correct. The packet is instructions, not a second copy of the live seed plus extra secret."), qBad("The live recovery words and the extra secret, together, emailed to the family.", "Wrong. That is a leak, and one envelope then holds the whole vault.")] },
        { q: "Heir has one key of a 2-of-3 vault. Can they spend?", opts: [qOk("No. One key cannot meet two-of-three.", "Correct. Same trap as one Shamir share: a piece is not the vault."), qBad("Yes. Any family key should be enough in an emergency.", "Wrong. Then it was never 2-of-3.")] },
        { q: "When should someone first try to open the backup?", opts: [qOk("While you can still talk, so a missing object shows up now.", "Correct."), qBad("After you cannot speak, so it stays secret until then.", "Wrong. Then nobody can ask you which object is missing.")] },
        { q: "Is this track a will?", opts: [qOk("No. It rehearses objects. It is not legal counsel.", "Correct. A court does not follow these screens."), qBad("Yes. Screenshot these pads for probate.", "Wrong.")] }
      ],
      19: [
        { q: "Should you send real bitcoin to this practice address?", opts: [qOk("Never. This phrase is for teaching only.", "Correct."), qBad("Yes, a small amount is fine to test.", "Wrong. Do not fund a practice phrase.")] },
        { q: "The simulated 0.000184 coins on this tab mean:", opts: [qOk("A teaching credit. A failed real lookup should say unknown, not zero.", "Correct. This tab is offline."), qBad("Proof those coins exist on the real bitcoin network.", "Wrong. This tab does not look up the chain unless you opt in on Network.")] },
        { q: "What is the second view of the same receive address?", opts: [qOk("A watch-only list that sees the address, not the secret words.", "Correct."), qBad("Paste the recovery words into a phone app.", "Wrong. That makes a hot wallet, not a second view.")] }
      ],
      20: [
        { q: "For a funded seed, which backup survives fire and flood better?", opts: [qOk("A metal plate, not paper.", "Correct. Paper burns and rots."), qBad("A screenshot of the steel plate in the cloud.", "Wrong. A photo of steel is still a leak.")] },
        { q: "Should you photograph a stamped metal plate?", opts: [qOk("No. The plate is still a secret.", "Correct."), qBad("Yes. Upload the photo as a cloud backup.", "Wrong. Metal does not make a photo safe.")] },
        { q: "Is this the same lesson as the paper-backup track?", opts: [qOk("No. That track was how to copy. This track is paper versus metal as an object.", "Correct."), qBad("Yes. It is the same job twice.", "Wrong. This job is which object survives fire.")] }
      ],
      21: [
        { q: "You hold two keys and a company holds one. What can the company usually do?", opts: [qOk("It can often freeze a spend. It should not be able to steal alone.", "Correct. It lacks your two keys."), qBad("It can steal your coins whenever it wants.", "Wrong. It does not have two keys.")] },
        { q: "Is this the same as three friends each holding a key?", opts: [qOk("No. One is a product relationship. The other is three people you named.", "Correct. The threats differ."), qBad("Yes. Identical in every way.", "Wrong.")] },
        { q: "What are the keys in this setup?", opts: [qOk("Whole seeds or devices — not scraps of one phrase.", "Correct."), qBad("Word pieces of one recovery phrase.", "Wrong. Those would be Shamir shares, not cosigners.")] }
      ],
      22: [
        { q: "On a new hardware device, what comes first?", opts: [qOk("Prove it is genuine: seals, official app or published firmware hash on the device screen — then create the seed on the device.", "Correct. Do this before any coins."), qBad("Type the recovery words into the laptop to test the device.", "Wrong. Typing the seed into a computer kills the vault.")] },
        { q: "The recovery words were already on a laptop. Should you import them into a hardware wallet?", opts: [qOk("No. That vault stays a hot / software wallet. You do not know whether the laptop leaked the words.", "Correct. Hardware does not un-steal a laptop seed."), qBad("Yes. Putting the same words on hardware makes them cold.", "Wrong. Same secret, still compromised if the computer had it.")] },
        { q: "Where should a savings seed be born?", opts: [qOk("On the hardware device, after you proved firmware. Never copied from a laptop.", "Correct. A new seed is a new vault."), qBad("On the laptop first, then copied onto the device so you have a backup.", "Wrong. Then the device is holding a hot secret.")] }
      ],
      23: [
        { q: "Does this tab sign a payment?", opts: [qOk("Never. It only lets you look at a sample package.", "Correct."), qBad("Yes. Sign the sample here.", "Wrong. This tab never signs.")] },
        { q: "What is the safe order?", opts: [qOk("Build the payment, move it by hand, sign on an offline device, then send it from a hot machine.", "Correct. Four steps."), qBad("Send it to the network first, then sign.", "Wrong.")] },
        { q: "What is the fake QR on this track?", opts: [qOk("A teaching picture of a hand-off. It is not a real signed payment.", "Correct."), qBad("A real payment you should broadcast on mainnet.", "Wrong. Never broadcast teaching samples.")] }
      ],
      24: [
        { q: "If two keys live in the same house, what is the risk?", opts: [qOk("Fire or theft can take enough keys to spend or freeze you out.", "Correct. That is a cluster."), qBad("It is fine because it is convenient.", "Wrong. Convenience is not the lesson.")] },
        { q: "Is this track teaching new signature math?", opts: [qOk("No. It is about where the objects live geographically.", "Correct."), qBad("Yes. It invents a new threshold formula.", "Wrong.")] },
        { q: "What counts as a third place for a key?", opts: [qOk("Another person or institution — not the same building.", "Correct."), qBad("The garage of the same house.", "Wrong. That is still one building.")] }
      ],
      25: [
        { q: "A backup plan you never practise becomes:", opts: [qOk("Stale. Schedule a restore drill and an open-while-alive rehearsal.", "Correct."), qBad("Fine. Write it once and never run it.", "Wrong. Hope is not a rehearsal.")] },
        { q: "Should heirs first try the backup after you cannot help?", opts: [qOk("No. Practise opening it while you are alive.", "Correct."), qBad("Yes. That is when it matters.", "Wrong. Then you cannot debug it.")] },
        { q: "Is a screenshot a yearly restore?", opts: [qOk("No. Restore from paper or metal, not a photo.", "Correct."), qBad("Yes. A screenshot is a yearly backup.", "Wrong.")] }
      ],
      26: [
        { q: "Does this tracks tab run your own bitcoin node?", opts: [qOk("No. This tab stays offline. It does not run a node.", "Correct."), qBad("Yes. A full node runs inside this browser.", "Wrong.")] },
        { q: "If a public explorer shows 0, what is honest?", opts: [qOk("The lookup may have failed. Unknown is not the same as zero.", "Correct."), qBad("The wallet is definitely empty.", "Wrong. A failed lookup is unknown.")] },
        { q: "Where should you look up a balance if you opt in?", opts: [qOk("The Network room, using the address only — never the recovery words.", "Correct."), qBad("Paste the twelve words into an explorer.", "Wrong. Never send the seed to a website.")] }
      ],
      27: [
        { q: "What is a wallet balance made of?", opts: [qOk("A sum of leftover pieces (coins) from earlier payments.", "Correct. Not one giant coin."), qBad("One single coin that never splits.", "Wrong.")] },
        { q: "What is the change folder?", opts: [qOk("Another folder under the same words. The recovery phrase does not change.", "Correct."), qBad("A brand-new recovery phrase for change.", "Wrong.")] },
        { q: "Should you always mix every leftover piece into one spend?", opts: [qOk("No. Spending pieces together can link their history. Mixing is a choice.", "Correct."), qBad("Yes. Always dump every piece into one payment.", "Wrong. That can leak history.")] }
      ],
      28: [
        { q: "Does mixing coins replace a backup?", opts: [qOk("No. Mixing is extra privacy. It is not custody.", "Correct."), qBad("Yes. Mixing is a backup.", "Wrong.")] },
        { q: "Does this track name a mixer brand you must use?", opts: [qOk("No. It only explains the idea.", "Correct."), qBad("Yes. Use the named mixer on the card.", "Wrong. This lab is brand-agnostic.")] },
        { q: "If several inputs are spent together, what can an observer guess?", opts: [qOk("They often look like they belong to one owner.", "Correct."), qBad("Addresses can never be linked that way.", "Wrong. That guess exists.")] }
      ],
      29: [
        { q: "What does a second (decoy) passphrase open?", opts: [qOk("A real second vault with its own coins.", "Correct. It is not an empty fake screen."), qBad("A fake empty wallet that fools everyone.", "Wrong. An empty decoy is often obvious.")] },
        { q: "Is this track personal-safety or legal advice?", opts: [qOk("No. It only teaches that a second extra secret is a second vault.", "Correct."), qBad("Yes. Follow it if someone threatens you.", "Wrong. This is not safety counsel.")] },
        { q: "If you forget the decoy extra secret, what happens?", opts: [qOk("That second vault is gone. Same as forgetting any passphrase.", "Correct. The lab cannot reset it."), qBad("This website can reset it for you.", "Wrong. There is no reset desk.")] }
      ],
      30: [
        { q: "What is a child phrase made from a master?", opts: [qOk("A derived phrase. If the parent is lost, the children are lost too.", "Correct. A child is not a backup of the parent."), qBad("An independent backup of the parent phrase.", "Wrong.")] },
        { q: "Where is the full child-phrase tool?", opts: [qOk("On classic Lab, not as a replacement for this teaching track.", "Correct."), qBad("This V2 track replaces classic Lab.", "Wrong. Rooms stay the full instruments.")] },
        { q: "Should you fund practice child phrases?", opts: [qOk("Do not. They are practice.", "Correct."), qBad("Yes, send a tiny amount.", "Wrong.")] }
      ],
      31: [
        { q: "How do the hex shares in the Shamir track differ from SLIP-39 word shares?", opts: [qOk("The hex split is a classroom demo. SLIP-39 word shares are the product people actually hold.", "Correct. They are not the same word list."), qBad("They are the same words.", "Wrong.")] },
        { q: "For people holding shares in real life, what should you use?", opts: [qOk("Word shares that people can write. Open the SLIP-39 room for that tool.", "Correct."), qBad("Email the classroom hex from this track.", "Wrong.")] },
        { q: "Can one share sign a bitcoin payment by itself?", opts: [qOk("No. Combining shares rebuilds one secret. That is recovery, not a second signer.", "Correct."), qBad("Yes, like a cosigner in multisig.", "Wrong. A share is not a cosigner.")] }
      ],
      32: [
        { q: "How many SeedXOR-style parts do you need?", opts: [qOk("All of them. Each part looks like a complete 12-word backup.", "Correct. N-of-N, not 2-of-3."), qBad("Any two of three, like Shamir in UC7.", "Wrong. That is threshold Shamir, not all-parts XOR.")] },
        { q: "Is this the same as SLIP-39 people shares?", opts: [qOk("No. SLIP-39 is a different word product. This job is full BIP-39-looking lists, all required.", "Correct."), qBad("Yes. Same words as Trezor Suite.", "Wrong.")] },
        { q: "Does this tab replace the SeedXOR.com calculator?", opts: [qOk("No. Classroom N-of-N only. Do not fund these parts.", "Correct."), qBad("Yes. Export and fund the XOR result.", "Wrong.")] }
      ],
      33: [
        { q: "Can the heir spend before the timer expires?", opts: [qOk("No. The heir path stays locked until simulated time is up.", "Correct."), qBad("Yes. Heir key always spends.", "Wrong. That would not be a dead-man timer.")] },
        { q: "What does owner refresh do?", opts: [qOk("It resets the timer. The heir path locks again.", "Correct."), qBad("It signs a CSV transaction in this tab.", "Wrong. This tab never signs.")] },
        { q: "Is this legal inheritance advice?", opts: [qOk("No. Educational timer only. Not a live wallet.", "Correct."), qBad("Yes. Use this instead of a will.", "Wrong.")] }
      ],
      34: [
        { q: "What extra object does a scripted vault need besides keys?", opts: [qOk("The policy string (descriptor): which script, which keys, which paths.", "Correct."), qBad("Only the twelve words. Scripts are optional.", "Wrong. Without the policy, keys can be unspendable.")] },
        { q: "Is this the same as watch-only export in UC5?", opts: [qOk("No. Watch-only is a viewing key. This job is recording the spend policy.", "Correct."), qBad("Yes. Same button.", "Wrong.")] },
        { q: "Should you fund the practice descriptor?", opts: [qOk("Do not. Practice string only.", "Correct."), qBad("Yes, a small amount to test.", "Wrong.")] }
      ],
      35: [
        { q: "Twelve English words always mean BIP-39?", opts: [qOk("No. Electrum can use the same dictionary with a different stretch.", "Correct."), qBad("Yes. If they look English, BIP-39 restore is always right.", "Wrong.")] },
        { q: "If you restore Electrum words with BIP-39 rules, what happens?", opts: [qOk("You open the wrong vault, or empty. Not the Electrum wallet.", "Correct."), qBad("You get the same coins. Dictionaries match so the wallets match.", "Wrong.")] },
        { q: "Does this tab compute an Electrum address?", opts: [qOk("No. It refuses to invent Electrum’s stretch.", "Correct."), qBad("Yes. It prints a real Electrum tb1.", "Wrong.")] }
      ]
    };
    return m[id] || [];
  }

  async function ucJob(id, step) {
    if (id === 20) return uc20(step);
    if (id === 18) return uc18(step);
    if (step === 2) return quizBank(jobQuizzes(id));
    if (step === 3) return finishHtml(id);
    if (id === 16) return uc16(step);
    if (id === 17) return uc17(step);
    if (id === 19) return uc19(step);
    if (id === 21) return uc21(step);
    if (id === 22) return uc22(step);
    if (id === 23) return uc23(step);
    if (id === 24) return uc24(step);
    if (id === 25) return uc25(step);
    if (id === 26) return uc26(step);
    if (id === 27) return uc27(step);
    if (id === 28) return uc28(step);
    if (id === 29) return uc29(step);
    if (id === 30) return uc30(step);
    if (id === 31) return uc31(step);
    if (id === 32) return uc32(step);
    if (id === 33) return uc33(step);
    if (id === 34) return uc34(step);
    if (id === 35) return uc35(step);
    return "";
  }

  async function uc16(step) {
    if (step === 0) {
      return pad(
        "<h2>Look at the card, then hide it</h2>" +
        doDont("Treat the numbered card as paper. Next you will type from that paper.", "Do not photograph the card. Do not use a funded phrase.") +
        teachBox(
          "Classroom — prove the backup",
          "<em>What it is:</em> the numbered card is paper. The address is not the backup.<br/><em>Why:</em> same receive address after typing from paper means the copy works.<br/><em>When / where:</em> practice phrase only. No photo. No funded words.<br/><em>How:</em> the grid is the object. Next pad you type it back.",
          "v2Uc16Teach"
        ) +
        '<div class="row v2-gen-bar" id="v2GenRow">' +
        '<div class="v2-gen-left">' +
        '<button type="button" class="btn" id="v2Generate">Make practice words</button>' +
        inlineI(
          "Generate to fill this backup",
          "Click Make practice words to fill the numbered card. This is a throwaway phrase so you can practise typing it back. Do not fund it."
        ) +
        "</div></div>" +
        '<div id="v2Card">' + wordGridHtml(mem.mnemonic) + "</div>" +
        pauseBtn("Next: hide the card", !mem.mnemonic)
      );
    }
    var words = (mem.mnemonic || "").split(/\s+/).filter(Boolean);
    var inputs = "";
    for (var i = 0; i < 12; i++) {
      inputs += '<label class="v2-restore-cell">#' + (i + 1) + '<input id="v2RestoreW' + i + '" autocomplete="off" spellcheck="false"/></label>';
    }
    return pad(
      "<h2>Type from paper — prove it works</h2>" +
      doDont("Type the twelve words from the paper copy. Same address means the backup works.", "Do not peek at a screenshot.") +
      teachBox(
        "Classroom — same address",
        "<em>What it is:</em> checksum + receive address from typed words.<br/><em>Why:</em> same address as the card means the paper copy works.<br/><em>How:</em> the message below is the lab result. Do not peek.",
        "v2Uc16ChkTeach"
      ) +
      "<h3>Check (lab result)</h3>" +
      '<button type="button" class="btn secondary" id="v2RestoreHide">Hide the on-screen card</button>' +
      '<div id="v2Card" class="' + (mem.restoreHidden ? "v2-hidden" : "") + '">' + wordGridHtml(mem.mnemonic) + "</div>" +
      '<div class="v2-restore-grid">' + inputs + "</div>" +
      '<div class="row v2-restore-act">' +
      '<button type="button" class="btn" id="v2RestoreCheck">Check checksum and address</button>' +
      '<button type="button" class="btn secondary" id="v2RestoreFill">Fill with words</button>' +
      "</div>" +
      '<div id="v2RestoreMsg"></div>' +
      pauseBtn("Same address. The backup works.", !mem.restoreOk)
    );
  }

  function uc17(step) {
    function row(amt, label, btc) {
      return (
        '<div class="v2-tier-row" data-amt="' + amt + '"><strong>' + label + " · " + btc + ' BTC</strong>' +
        '<button type="button" class="btn secondary btn-sm" data-bin="exchange">Exchange</button>' +
        '<button type="button" class="btn secondary btn-sm" data-bin="phone">Phone</button>' +
        '<button type="button" class="btn secondary btn-sm" data-bin="hww">One HWW</button>' +
        '<button type="button" class="btn secondary btn-sm" data-bin="mofn">2-of-3</button></div>'
      );
    }
    var rows =
      row("coffee", "Daily", "0.001") +
      row("mid", "Mid", "0.184") +
      row("large", "Large", "2.0") +
      '<div id="v2TierOut"></div>';
    if (step === 0) {
      return pad(
        "<h2>How much lives where</h2>" +
        doDont("Put daily / mid / large on different objects.", "Do not put all three on an exchange or all on a phone.") +
        "<p class=\"control-help\">Teaching amounts: <strong>0.001</strong> coffee · <strong>0.184</strong> mid · <strong>2.0</strong> large. Not real balances.</p>" +
        rows +
        pauseBtn("I placed daily, mid, and large", true)
      );
    }
    return pad(
      "<h2>Place amounts</h2>" +
      doDont("Coffee → phone. Mid → hardware. Large → 2-of-3.", "2-of-3 for coffee money. All on exchange.") +
      rows +
      pauseBtn("I placed daily, mid, and large", true)
    );
  }

  function inhState() {
    if (!mem.inh) {
      mem.inh = {
        kits: {},
        shape: "",
        pack: { desc: false, where: false, date: false, seed: false, pp: false, chat: false },
        packed: false,
        failTry: false,
        liveOk: false
      };
    }
    return mem.inh;
  }

  function inhKitsDone() {
    var k = inhState().kits;
    return !!(k.chat && k.nopass && k.onekey && k.later);
  }

  function inhPackOk() {
    var st = inhState();
    var p = st.pack;
    return !!(st.shape && p.desc && p.where && p.date && !p.seed && !p.pp && !p.chat);
  }

  function uc18(step) {
    var st = inhState();
    function kitBtn(id, title, teaser) {
      var on = !!st.kits[id];
      return (
        '<button type="button" class="v2-metal-card v2-inh-kit' +
        (on ? " is-on" : "") +
        '" data-inh-kit="' +
        id +
        '"><strong>' +
        title +
        "</strong><span>" +
        teaser +
        "</span></button>"
      );
    }
    function shapeBtn(id, title, teaser) {
      return (
        '<button type="button" class="v2-metal-card' +
        (st.shape === id ? " is-on" : "") +
        '" data-inh-shape="' +
        id +
        '"><strong>' +
        title +
        "</strong><span>" +
        teaser +
        "</span></button>"
      );
    }
    function packBtn(id, title, teaser) {
      var on = !!st.pack[id];
      return (
        '<button type="button" class="v2-metal-card v2-inh-pack' +
        (on ? " is-on" : "") +
        '" data-inh-pack="' +
        id +
        '"><strong>' +
        title +
        "</strong><span>" +
        teaser +
        "</span></button>"
      );
    }
    if (step === 0) {
      return pad(
        "<h2>Heirs fail on objects</h2>" +
        doDont(
          "Tap each broken kit. Next stays off until you have seen the four failures.",
          "Do not treat this as a will. Do not put a seed in chat."
        ) +
        teachBox(
          "Classroom — if I cannot speak",
          "<em>What it is:</em> a dry-run of objects, not probate.<br/><em>Why:</em> people do not fail because they did not care. They fail because a piece is missing and you are not there to name it.<br/><em>When:</em> while you can still talk.<br/><em>How:</em> the buttons below are lab kits. The red/green line is the result.",
          "v2InhTeach"
        ) +
        "<h3>Heir kits (lab)</h3>" +
        '<div class="v2-metal-grid v2-inh-grid">' +
        kitBtn("chat", "Family chat", "Twelve words in a group thread") +
        kitBtn("nopass", "Words, no extra secret", "You used a 25th. They did not get it.") +
        kitBtn("onekey", "One key of three", "2-of-3 vault. Heir holds one.") +
        kitBtn("later", "First try later", "Nobody opens anything until you cannot speak") +
        "</div>" +
        '<div id="v2InhKitOut" class="control-help">' +
        (st.kitMsg || "Tap a kit. The result line names the missing object.") +
        "</div>" +
        pauseBtn("I saw the four failures", !inhKitsDone())
      );
    }
    if (step === 1) {
      return pad(
        "<h2>Build the packet</h2>" +
        doDont(
          "Pick a shape. Put a map in the envelope: policy, where objects live, next drill date.",
          "Do not put the live words and the extra secret in the same packet. Do not paste a chat screenshot."
        ) +
        teachBox(
          "Classroom — packet vs seed",
          "<em>What it is:</em> sealed instructions that travel with the keys, not a second copy of the vault.<br/><em>Why:</em> one envelope that holds words plus extra secret is the whole wallet in one fire or one leak.<br/><em>How:</em> shape and ticks below are lab objects. The table is the result.",
          "v2InhPackTeach"
        ) +
        "<h3>Custody shape</h3>" +
        '<div class="v2-metal-grid">' +
        shapeBtn("packet", "One signer, sealed map", "Metal / paper stays where you put it. Packet says how to find it.") +
        shapeBtn("keys", "2-of-3 keys (UC6)", "Three people. Each holds a full phrase. Packet holds the descriptor.") +
        shapeBtn("shares", "2-of-3 shares (UC7)", "Shares rebuild one secret. Packet says how to combine. Shares stay apart.") +
        "</div>" +
        "<h3>Envelope contents (toggle)</h3>" +
        '<div class="v2-metal-grid v2-inh-grid">' +
        packBtn("desc", "Policy / descriptor", "Need — which script, which keys") +
        packBtn("where", "Where each object lives", "Need — home / elsewhere / person") +
        packBtn("date", "Next open-while-alive date", "Need — a calendar, not a hope") +
        packBtn("seed", "Live recovery words", "Never — that is the vault") +
        packBtn("pp", "Extra secret (25th)", "Never in the same envelope as the words") +
        packBtn("chat", "Chat screenshot", "Never — that is a leak") +
        "</div>" +
        '<button type="button" class="btn" id="v2InhBuild">Build practice packet</button>' +
        '<pre id="v2InhPackOut" class="v2-pre">' +
        (st.packText || "Result: packet table after you build.") +
        "</pre>" +
        pauseBtn("Packet is a map", !st.packed || !inhPackOk())
      );
    }
    if (step === 2) {
      return pad(
        "<h2>Open while alive</h2>" +
        doDont(
          "Fail at least once, then sit with them and open the real kit.",
          "Do not wait until you cannot debug it. A success label is not a signed spend. Not legal counsel."
        ) +
        teachBox(
          "Classroom — watch them fail",
          "<em>What it is:</em> the heir tries incomplete kits while you can still name the missing piece.<br/><em>Why:</em> UC16 proves you can restore. This pad proves someone else can, with the objects you actually left.<br/><em>How:</em> red/green lines are lab results. UC33 is a timer. This is people.",
          "v2InhLiveTeach"
        ) +
        "<h3>Heir tries (lab)</h3>" +
        '<div class="row" style="flex-wrap:wrap;gap:0.5rem">' +
        '<button type="button" class="btn secondary" id="v2InhTryChat">Try with the chat screenshot</button>' +
        '<button type="button" class="btn secondary" id="v2InhTryNopass">Try words, no extra secret</button>' +
        '<button type="button" class="btn secondary" id="v2InhTryOne">Try with one key</button>' +
        '<button type="button" class="btn" id="v2InhTryLive">Sit with them (packet + enough objects)</button>' +
        "</div>" +
        '<div id="v2InhLiveOut" class="control-help">' +
        (st.liveMsg || "Fail first. Then open it with you in the room.") +
        "</div>" +
        pauseBtn("I watched them fail, then open it", !(st.failTry && st.liveOk))
      );
    }
    if (step === 3) return quizBank(jobQuizzes(18));
    return finishHtml(18);
  }

  async function uc19(step) {
    if (step === 0) {
      if (mem.mnemonic && !mem.lastRows) await deriveNow();
      return pad(
        "<h2>Practice receive address (test)</h2>" +
        doDont("Show a tb1 practice address and QR.", "Do not fund a practice mainnet phrase from this tab.") +
        teachBox(
          "Classroom — first receive",
          "<em>What it is:</em> a practice tb1 (or bc1 on main toggle).<br/><em>Why:</em> seeing an address is not funding it.<br/><em>When / where:</em> this tab only. Never fund this practice phrase.<br/><em>How:</em> the address and QR below are lab objects.",
          "v2Uc19Teach"
        ) +
        "<h3>Receive (lab result)</h3>" +
        '<button type="button" class="btn" id="v2Generate">Show receive address</button>' +
        netSelectHtml() +
        '<div id="v2AddrWrap">' + (mem.lastRows ? addrHtml() : "") + "</div>" +
        pauseBtn("Next: watch-only second view", !(mem.lastRows && mem.lastRows.length))
      );
    }
    var addr = "";
    if (mem.lastRows && mem.lastRows[0]) addr = mem.lastRows[0].bip84_p2wpkh || "";
    return pad(
      "<h2>Watch-only second view + simulated credit</h2>" +
      doDont("Same address on a watch list. Simulate 0.000184 tBTC if you stay offline.", "Do not fund the practice mainnet phrase. Real lookup = Network dock.") +
      teachBox(
        "Classroom — two views",
        "<em>What it is:</em> the same receive string on a watch list.<br/><em>Why:</em> unknown is not zero until you opt in to Network.<br/><em>How:</em> the watch line and simulated balance below are lab objects. Real lookup stays on Network.",
        "v2Uc19WatchTeach"
      ) +
      "<h3>Watch list (lab result)</h3>" +
      '<p id="v2WatchSame">Watch-only list: <code>' + (addr || "generate first") + "</code></p>" +
      '<p id="v2SimBal" class="control-help">Balance: unknown (not 0)</p>' +
      '<button type="button" class="btn" id="v2SimRecv">Simulate a test credit</button>' +
      '<a class="btn secondary" href="../network.html" data-v2-dock="19">Open Network (opt-in test lookup)</a>' +
      pauseBtn("Two views, no mainnet fund", !mem.simRecv)
    );
  }

  async function uc20(step) {
    if (!mem.metalSeen) mem.metalSeen = {};
    var seen = mem.metalSeen;
    var metalPick = mem.metalPick || "";
    var metalsOk = metalPick === "ss" || metalPick === "ti";
    function metalCard(id, title, teaser) {
      var on = metalPick === id;
      return (
        '<button type="button" class="v2-metal-card' +
        (on ? " is-on" : "") +
        '" data-metal="' +
        id +
        '"><strong>' +
        title +
        "</strong><span>" +
        teaser +
        "</span></button>"
      );
    }
    if (step === 0) {
      return pad(
        "<h2>Paper fails</h2>" +
        doDont(
          "A funded seed wants a metal object that survives fire and flood.",
          "Do not photograph any plate. Paper still burns. Metal does not make a photo safe."
        ) +
        desc(
          "A house fire is hot enough to destroy paper. Flood and damp rot paper too. That is why people stamp a backup into metal. The next steps are which metals fail, and which designs fail even if the metal is good."
        ) +
        pauseBtn("Next: compare metals", false)
      );
    }
    if (step === 1) {
      return pad(
        "<h2>Metals compared</h2>" +
        doDont(
          "Tap each metal. Reject aluminium. Stainless is the usual default. Titanium is premium, not required.",
          "Do not pick a metal from a shop logo. This is not a product list."
        ) +
        '<div class="v2-metal-grid">' +
        metalCard("al", "Aluminium", "Melts in a house fire") +
        metalCard("ss", "Stainless 304 / 316L", "Survives fire") +
        metalCard("ti", "Titanium", "Premium, harder to punch") +
        metalCard("pt", "Platinum", "Not a practical plate") +
        "</div>" +
        '<div id="v2MetalOut"' +
        (mem.metalMsg
          ? ' class="' + (mem.metalMsgOk ? "msg-ok" : "msg-bad") + '"'
          : "") +
        ">" +
        (mem.metalMsg || "Tap a metal. Next stays off until you pick stainless or titanium.") +
        "</div>" +
        pauseBtn("I picked a metal that survives fire", !metalsOk)
      );
    }
    if (step === 2) {
      function stamp4(w) {
        return w.length <= 4 ? w : w.slice(0, 4);
      }
      if (!mem.fourWords || mem.fourWords.length !== 12) {
        var raw = "ozone pact paddle page pair palace palm panda panel panic panther paper";
        if (window.BIP39Lab && typeof BIP39Lab.generateMnemonic === "function") {
          raw = await BIP39Lab.generateMnemonic(12);
        }
        mem.fourWords = String(raw || "").trim().split(/\s+/).filter(Boolean);
      }
      var full12 = mem.fourWords;
      var w0 = full12[0] || "";
      var s0 = stamp4(w0);
      var plate = full12
        .map(function (w, i) {
          var stamp = stamp4(w);
          return (
            '<li class="v2-stamp-cell">' +
            '<span class="v2-stamp-n">' +
            (i + 1) +
            "</span>" +
            '<span class="v2-stamp-full">' +
            w +
            "</span>" +
            '<span class="v2-stamp-cut" aria-hidden="true">→</span>' +
            '<span class="v2-stamp-4">' +
            stamp +
            "</span></li>"
          );
        })
        .join("");
      return pad(
        "<h2>Four letters are enough</h2>" +
        doDont(
          "Stamp the first four letters of each word. That is enough to look the word up later.",
          "Do not treat a 4-letter plate as broken. The rest of the word is optional on the plate."
        ) +
        desc(
          "The English list has 2048 words. No two share the same first four letters. If a word is only three letters (zoo), you stamp those three."
        ) +
        '<p class="control-help">Practice phrase (not a funded seed). Each cell shows the full word, then the four letters you would punch on a plate.</p>' +
        '<div class="row v2-gen-bar"><div class="v2-gen-left">' +
        '<button type="button" class="btn secondary" id="v2FourRand">Make another practice phrase</button>' +
        "</div></div>" +
        '<div class="v2-stamp-wrap">' +
        '<figure class="v2-stamp-fig"><figcaption>What you would stamp</figcaption><ol class="word-grid v2-stamp-plate" id="v2StampPlate">' +
        plate +
        "</ol></figure></div>" +
        '<p class="control-help">Word 1 is <strong>' +
        w0 +
        "</strong>, so cell 1 is <strong>" +
        s0 +
        "</strong> — no other English backup word starts with those letters. Restore: read each stamp, look up the full word, type all twelve in order.</p>" +
        pauseBtn("Next: solid plate rules", false)
      );
    }
    if (step === 3) {
      var pk = mem.plateKind || "";
      var plateOk = pk === "solid";
      return pad(
        "<h2>Solid plate rules</h2>" +
        doDont(
          "A thick solid plate with deep punches has no pieces to lose. Thickness (~3–5 mm) and no loose tiles matter more than a logo.",
          "Do not photograph the plate. A passphrase, if you use one, stays apart from the plate."
        ) +
        '<div class="v2-metal-grid v2-plate-grid">' +
        '<button type="button" class="v2-metal-card' +
        (pk === "solid" ? " is-on" : "") +
        '" data-plate="solid"><strong>Solid punched plate</strong><span>Best durability. No tiles to spill.</span></button>' +
        '<button type="button" class="v2-metal-card' +
        (pk === "tiles" ? " is-on" : "") +
        '" data-plate="tiles"><strong>Tile cassette</strong><span>Convenient. Heat or crush can spill tiles.</span></button>' +
        '<button type="button" class="v2-metal-card' +
        (pk === "photo" ? " is-on" : "") +
        '" data-plate="photo"><strong>Photo of the plate</strong><span>Always wrong. Metal does not make a photo safe.</span></button>' +
        "</div>" +
        '<div id="v2PlateOut"' +
        (mem.plateMsg ? ' class="' + (pk === "photo" ? "msg-bad" : "msg-ok") + '"' : "") +
        ">" +
        (mem.plateMsg || "Choose a design. Next stays off until you pick a solid punched plate.") +
        "</div>" +
        pauseBtn("I chose a solid punched plate", !plateOk)
      );
    }
    if (step === 4) {
      return quizBank([
        {
          q: "Is aluminium fine for a house fire?",
          opts: [
            qOk("No. It melts in a house fire. Do not use it for a funded seed.", "Correct. Stainless or titanium survive that heat. Aluminium does not."),
            qBad("Yes. Light metal is good enough.", "Wrong. Aluminium fails. Stainless or titanium survive.")
          ]
        },
        {
          q: "Are four letters enough on a plate?",
          opts: [
            qOk("Yes. No two English backup words share the same first four letters, so canoe can be stamped as CANO.", "Correct. You look the full word up from those four letters later."),
            qBad("No. You must stamp the whole word or the backup is invalid.", "Wrong. Four letters are enough by design.")
          ]
        },
        {
          q: "Is a photo of a steel plate a backup?",
          opts: [
            qOk("No. The plate is still a secret. A photo is never a backup.", "Correct."),
            qBad("Yes, if the plate is stainless or titanium.", "Wrong. Metal does not make a photo safe.")
          ]
        }
      ]);
    }
    return finishHtml(20);
  }

  function uc21(step) {
    if (step === 0) {
      return pad(
        "<h2>You hold 2</h2>" +
        doDont("Keep two keys. Partner or service holds one.", "Do not confuse this with DIY 2-of-3 among three friends.") +
        pauseBtn("Next: name freeze vs steal", false)
      );
    }
    return pad(
      "<h2>Freeze vs steal</h2>" +
      '<button type="button" class="btn secondary" data-collab="freeze">Service can freeze</button>' +
      '<button type="button" class="btn secondary" data-collab="steal">Service can steal alone</button>' +
      '<div id="v2CollabOut"></div>' +
      pauseBtn("I named the threat", true)
    );
  }

  function uc22(step) {
    if (step === 0) {
      function authCard(name, job) {
        return (
          '<article class="v2-auth-card"><strong>' +
          name +
          "</strong><p>" +
          job +
          "</p></article>"
        );
      }
      return pad(
        "<h2>Unbox ceremony</h2>" +
        doDont(
          "Prove the device is genuine and running the maker’s firmware before any seed is born, and before any coins go on it.",
          "Do not skip this because the box looked new. This tab has no vendor app. Do not type recovery words into the laptop."
        ) +
        desc(
          "A hardware signer is only as honest as the chip and the software on it. A swapped device or a fake update can steal the first seed you type. The job is always the same: buy from the maker or a reseller you can name, inspect the bag and seals, power on with no seed yet, then match what the device shows to what the maker published — not to a random USB stick or a chat link."
        ) +
        callout(
          "is",
          "What “firmware hash checked” means",
          "The device screen (or the official app talking to that screen) shows a version and a fingerprint. You compare that fingerprint to the one on the maker’s own website. If they do not match, stop. Do not create a seed. Do not fund it."
        ) +
        '<p class="control-help">Same job, four common objects. Menus change; the job does not. This lab does not run their software.</p>' +
        '<div class="v2-auth-grid">' +
        authCard(
          "Ledger",
          "Use Ledger’s own Live app from the maker’s site or store. Run the genuine-check. Read the firmware version on the device, then compare it to the hash Ledger publishes. A “Ledger” sticker on a marketplace listing is not that check. Only then let the device create the seed on-chip."
        ) +
        authCard(
          "Trezor",
          "Install Trezor Suite from trezor.io (or the address printed in the official docs), not a random installer. Suite talks to the device and offers the published firmware. Confirm the model and fingerprint on the device screen. Then create the seed on the Trezor — never by typing the words into the computer."
        ) +
        authCard(
          "Coldcard",
          "Coldcard is meant to be verified, not trusted. On first boot, read the firmware hash on the device screen and match it to the hash on coinkite / Coldcard’s own site. Prefer a documented air-gapped update (MicroSD), not a mystery file from the web. Only after the hashes match do you create the seed on the Coldcard."
        ) +
        authCard(
          "Tangem",
          "The seed is born on the card, not as twelve words you type. Still prove the card: sealed pack from the maker or a named reseller, official Tangem app from the store the maker names, and the in-app genuine / attestation check before you put value on it. A clone card plus a look-alike app is the failure mode."
        ) +
        "</div>" +
        '<label class="check"><input type="checkbox" id="v2Fw"/> I compared a device fingerprint to the maker’s published firmware (practice tick — this tab does not talk to any device)</label>' +
        pauseBtn("Next: a laptop seed stays hot", true)
      );
    }
    return pad(
      "<h2>Words already on a laptop</h2>" +
      doDont(
        "Keep that phrase as a software wallet. If you want hardware, let the device create a new seed.",
        "Do not copy those words onto a hardware wallet. You cannot know whether the laptop already leaked them."
      ) +
      '<p class="v2-scene">You have twelve words in a notes file on this computer. You also bought a hardware signer. Two objects. One question: what happens to the notes-file vault?</p>' +
      '<div class="v2-vault-pair">' +
      '<div class="v2-vault-col" id="v2VaultLaptop"><h3>Notes on the laptop</h3><p class="v2-btc-num">0.184 BTC</p><p>Those words already lived here. This is a hot wallet, even if you later type the same words into a device.</p></div>' +
      '<div class="v2-vault-col" id="v2VaultHw"><h3>Hardware signer</h3><p class="v2-btc-num" id="v2VaultHwAmt">no seed yet</p><p id="v2VaultHwNote">Empty until a seed is born on the chip. Importing the laptop words would put the <em>same</em> vault on the device — still hot.</p></div>' +
      "</div>" +
      '<p class="control-help">What do you do with the notes-file words?</p>' +
      '<div class="v2-metal-grid v2-laptop-seed-grid">' +
      '<button type="button" class="v2-metal-card" id="v2ImportLaptop" data-laptop-seed="hot-import"><strong>Type the notes-file words into the hardware wallet</strong><span>Same secret, new box. Still hot.</span></button>' +
      '<button type="button" class="v2-metal-card" id="v2RefuseSeed" data-laptop-seed="stay-hot"><strong>Leave the notes-file vault on software. New seed on the device</strong><span>Two vaults. Only the new one can be cold.</span></button>' +
      "</div>" +
      '<div id="v2CerOut" class="control-help">Choose one. Hardware does not wash a laptop seed.</div>' +
      pauseBtn("The notes-file vault stays hot", true)
    );
  }

  function uc23(step) {
    if (step === 0) {
      return pad(
        "<h2>Four steps</h2>" +
        doDont("Build the payment online. Move it to an offline signer. Bring the signed package back. Broadcast from a hot machine.", "This tab never signs and never broadcasts a real transaction.") +
        pauseBtn("Next: tap the four steps", false)
      );
    }
    var labels = ["1 · Build the payment online", "2 · Move it to an offline signer", "3 · Bring the signed package back", "4 · Broadcast elsewhere"];
    var btns = labels.map(function (t, i) {
      return '<button type="button" class="btn secondary" data-loop="' + i + '">' + t + "</button>";
    }).join("");
    return pad(
      "<h2>Tap the four steps in order</h2>" +
      btns +
      '<div id="v2LoopOut" class="control-help">This tab never signs.</div>' +
      pauseBtn("I tapped the loop in order", true)
    );
  }

  function uc24(step) {
    if (step === 0) {
      return pad(
        "<h2>Three sites</h2>" +
        doDont("Home, elsewhere, a person or institution.", "Do not cluster two keys in one building.") +
        pauseBtn("Next: place three keys", false)
      );
    }
    return pad(
      "<h2>Place keys</h2>" +
      '<div class="v2-map">' +
      '<button type="button" class="btn secondary" data-geo="home">Place at home</button>' +
      '<button type="button" class="btn secondary" data-geo="else">Place elsewhere</button>' +
      '<button type="button" class="btn secondary" data-geo="person">Place with a person</button>' +
      '<button type="button" class="btn secondary" data-geo="garage">Place in the garage (same building)</button>' +
      "</div>" +
      '<div id="v2GeoOut"></div>' +
      pauseBtn("Keys are not clustered", true)
    );
  }

  function uc25(step) {
    if (step === 0) {
      return pad(
        "<h2>Plans go stale</h2>" +
        doDont("Put restore and inheritance dry-run on a calendar.", "A document you never run is a hope.") +
        pauseBtn("Next: schedule the two drills", false)
      );
    }
    return pad(
      "<h2>Schedule drills</h2>" +
      '<label class="check"><input type="checkbox" data-cal="16"/> Prove the backup this year</label>' +
      '<label class="check"><input type="checkbox" data-cal="18"/> Open while alive this year</label>' +
      '<div id="v2CalOut"></div>' +
      pauseBtn("I scheduled both drills", true)
    );
  }

  function uc26(step) {
    if (step === 0) {
      return pad(
        "<h2>No node in this tab</h2>" +
        doDont("Treat a public explorer as someone else's view, not your own node.", "This tab does not run Bitcoin software in the background.") +
        pauseBtn("Next: open Network only if I opt in", false)
      );
    }
    return pad(
      "<h2>Opt-in lookup</h2>" +
      teachBox(
        "Classroom — not your node",
        "<em>What it is:</em> a public explorer is someone else’s view.<br/><em>Why:</em> this tab does not run a Bitcoin node.<br/><em>When / where:</em> Network after leak-ack. Failures stay unknown, never a silent zero.<br/><em>How:</em> the dock below is the object. No JSON dump on this pad.",
        "v2Uc26Teach"
      ) +
      "<p>If a lookup fails, show <strong>unknown</strong>. Never a silent zero.</p>" +
      '<a class="btn" href="../network.html" data-v2-dock="26">Open Network (opt-in)</a>' +
      pauseBtn("Unknown is not zero", false)
    );
  }

  function uc27(step) {
    if (step === 0) {
      return pad(
        "<h2>Coins are pieces</h2>" +
        doDont("A total hides separate coin pieces. Spending two pieces together can link them.", "Do not treat the number in the corner as one coin.") +
        pauseBtn("Next: look at the change folder", false)
      );
    }
    return pad(
      "<h2>Change folder</h2>" +
      pathBipSvgHtml() +
      teachBox(
        "Classroom — coins are pieces",
        "<em>What it is:</em> receive vs change are two folders. A total hides separate UTXOs.<br/><em>Why:</em> spending two pieces together can look like one owner.<br/><em>How:</em> the path diagram below is the object. Deep coin control stays on classic Lab.",
        "v2Uc27Teach"
      ) +
      "<p class=\"control-help\">Receive is one folder. Change is another. The words stay put. Deep coin control stays on classic Lab.</p>" +
      pauseBtn("I can name receive vs change", false)
    );
  }

  function uc28(step) {
    if (step === 0) {
      return pad(
        "<h2>Common-input heuristic</h2>" +
        doDont("Coins spent together often look like one owner.", "This lab does not recommend a mixer brand.") +
        pauseBtn("Next: mixing is not custody", false)
      );
    }
    return pad(
      "<h2>Mixing is not custody</h2>" +
      doDont("Backup and keys still come first.", "Do not skip paper backup or prove-the-backup because you mixed.") +
      pauseBtn("Backup still comes first", false)
    );
  }

  function uc29(step) {
    if (step === 0) {
      return pad(
        "<h2>Second vault</h2>" +
        doDont("A decoy extra secret opens a real (usually smaller) vault.", "This is not legal, law-enforcement, or personal-safety advice.") +
        pauseBtn("Next: both vaults are real", false)
      );
    }
    return pad(
      "<h2>Decoy is real</h2>" +
      doDont("An empty decoy is obvious. A forgotten extra secret still loses that vault.", "Do not ask this tab what to do under threat.") +
      teachBox(
        "Classroom — decoy is another vault",
        "<em>What it is:</em> a second extra secret opens a real second wallet.<br/><em>Why:</em> empty decoy is obvious. Forgotten extra still loses that vault.<br/><em>When / where:</em> objects only — not legal or personal-safety advice.<br/><em>How:</em> there is no dump here. The lesson is the two vaults, not a hex blob.",
        "v2Uc29Teach"
      ) +
      pauseBtn("Objects only — not advice", false)
    );
  }

  function uc30(step) {
    if (step === 0) {
      return pad(
        "<h2>Parent vs child</h2>" +
        doDont("One master can mint child practice phrases. The full card lives on classic Lab.", "A child is not a backup of the parent. Do not fund practice children.") +
        pauseBtn("Next: open classic BIP-85 if I need it", false)
      );
    }
    return pad(
      "<h2>Classic BIP-85</h2>" +
      teachBox(
        "Classroom — child is not parent backup",
        "<em>What it is:</em> one master can mint child practice phrases.<br/><em>Why:</em> a child is not a backup of the parent. Do not fund practice children.<br/><em>How:</em> the classic Lab card is the object. This pad does not dump a child mnemonic.",
        "v2Uc30Teach"
      ) +
      '<a class="btn" href="../index.html#cardBip85">Open classic child-seed card</a>' +
      pauseBtn("Child is not the parent backup", false)
    );
  }

  function uc31(step) {
    if (step === 0) {
      return pad(
        "<h2>People + threshold</h2>" +
        doDont("People hold product word shares at a threshold.", "Do not treat the educational hex split (UC7) as the product room.") +
        pauseBtn("Next: open the SLIP-39 room", false)
      );
    }
    return pad(
      "<h2>Open the product room</h2>" +
      teachBox(
        "Classroom — Suite vs UC7 hex",
        "<em>What it is:</em> people hold product word shares at a threshold.<br/><em>Why:</em> UC7 hex is educational, not Trezor Suite.<br/><em>How:</em> the dock below is the object. Combine in the room is recovery, not a cosign.",
        "v2Uc31Teach"
      ) +
      '<a class="btn" href="../slip39.html" data-v2-dock="31">Open SLIP-39 room</a>' +
      "<p class=\"control-help\">The hex split in UC7 stays educational. Combine is recovery, not a second signer.</p>" +
      pauseBtn("The room is the source of truth", false)
    );
  }

  async function uc32(step) {
    if (step === 0) {
      return pad(
        "<h2>All parts look like seeds</h2>" +
        doDont(
          "Make two practice 12-word parts. Each list looks like a complete backup. You will need both.",
          "Do not treat one list as a Shamir share. Do not fund these parts. This is not the SeedXOR.com calculator."
        ) +
        desc(
          "SeedXOR-style split is N-of-N: every part is a full BIP-39-looking phrase. Lose one list and the original is gone. That is not UC7 (any 2 of 3 hex) and not UC31 (SLIP-39 people shares)."
        ) +
        teachBox(
          "Classroom — what all-parts XOR is",
          "<em>What it is:</em> N-of-N. Every part looks like a complete 12-word backup.<br/><em>Why:</em> lose one list and the original is gone.<br/><em>When / where:</em> not Shamir 2-of-3 (UC7), not SLIP-39 people shares (UC31), not the SeedXOR.com calculator.<br/><em>How:</em> Part A and Part B below are the objects. You will need both.",
          "v2XorTeach"
        ) +
        "<h3>Parts (lab result)</h3>" +
        '<button type="button" class="btn" id="v2XorSplit">Make two practice parts</button>' +
        '<div class="v2-xor-grid">' +
        '<div><h3>Part A</h3><div id="v2XorA"></div></div>' +
        '<div><h3>Part B</h3><div id="v2XorB"></div></div>' +
        "</div>" +
        pauseBtn("Next: recover needs every part", !(mem.xorA && mem.xorB))
      );
    }
    if (step === 1) {
      return pad(
        "<h2>Need every part</h2>" +
        doDont(
          "Try recover with one part, then with every part.",
          "Do not expect 2-of-3. One missing list fails."
        ) +
        teachBox(
          "Classroom — why every part",
          "<em>What it is:</em> recover needs every list (N-of-N).<br/><em>Why:</em> one missing part fails. That is not Shamir any-M-of-N.<br/><em>How:</em> the line below is the lab result of the recover button you click.",
          "v2XorRecTeach"
        ) +
        "<h3>Recover (lab result)</h3>" +
        '<div class="row" style="flex-wrap:wrap;gap:0.5rem">' +
        '<button type="button" class="btn secondary" id="v2XorOne">Recover with part A only</button>' +
        '<button type="button" class="btn" id="v2XorAll">Recover with every part</button>' +
        "</div>" +
        '<div id="v2XorNeedAll" class="control-help">' +
        (mem.xorAll
          ? "All parts present. Classroom original shown. N-of-N, not Shamir."
          : "You need every part.") +
        "</div>" +
        pauseBtn("N-of-N, not Shamir", !mem.xorAll)
      );
    }
    return null;
  }

  function uc33(step) {
    if (step === 0) {
      return pad(
        "<h2>Arm the timer</h2>" +
        doDont(
          "Arm a practice dead-man timer. The heir path stays locked until simulated time expires.",
          "Do not sign. Do not broadcast. This is not a live CSV wallet and not legal counsel."
        ) +
        desc(
          "On-chain, people use relative timelocks (CSV) so an heir key cannot spend until the owner has been inactive. This tab is a classroom clock: Arm, then later Tick / Refresh / Heir try. No signature is made."
        ) +
        '<button type="button" class="btn" id="v2TlArm">Arm practice timer (90-day classroom)</button>' +
        '<div id="v2TlArmOut" class="control-help">' +
        (mem.tl && mem.tl.armed ? "Armed. Next pad ticks simulated days." : "Not armed.") +
        "</div>" +
        pauseBtn("Next: tick, refresh, heir", !(mem.tl && mem.tl.armed))
      );
    }
    if (step === 1) {
      var tl = mem.tl || { armed: false, ticks: 0, expired: false };
      return pad(
        "<h2>Tick / refresh / heir</h2>" +
        doDont(
          "Advance simulated days. Owner refresh resets. Heir try only works after expiry.",
          "There is no Sign button. A success label is not a transaction."
        ) +
        '<p id="v2TlState" class="v2-tl-state">Day ' +
        tl.ticks * 30 +
        " / 90 · " +
        (tl.expired ? "heir path unlocked (practice)" : "heir path locked") +
        "</p>" +
        '<div class="row" style="flex-wrap:wrap;gap:0.5rem">' +
        '<button type="button" class="btn" id="v2TlTick">Advance 30 simulated days</button>' +
        '<button type="button" class="btn secondary" id="v2TlRefresh">Owner refresh (reset timer)</button>' +
        '<button type="button" class="btn secondary" id="v2TlHeir">Heir try spend (practice)</button>' +
        "</div>" +
        '<div id="v2TlOut" class="control-help">No signer in this tab.</div>' +
        pauseBtn("Timer is educational only", !(mem.tlHeirTried && mem.tl && mem.tl.expired))
      );
    }
    return null;
  }

  function uc34(step) {
    if (step === 0) {
      return pad(
        "<h2>Policy is an object</h2>" +
        doDont(
          "A scripted vault needs the descriptor: which script and which keys. Record that string with the keys.",
          "Do not assume the twelve words rebuild every wallet. Multisig and miniscript can fail without the policy."
        ) +
        desc(
          "UC5 exports a viewing key. UC6 makes three full seeds. This job is the output descriptor — the policy line wallets import. Lose it and the keys may not be enough."
        ) +
        pauseBtn("Next: save a practice descriptor", false)
      );
    }
    if (step === 1) {
      var line =
        mem.descLine ||
        "wpkh([00000000/84h/1h/0h]tpubD6NzVbNrCqUK1practice00000000000000000000000000000000000000000000000/0/*)#labonly";
      return pad(
        "<h2>Save the descriptor</h2>" +
        doDont(
          "Copy the practice policy line. Tick that you would store it with the keys.",
          "Do not fund this string. It is teaching-only."
        ) +
        teachBox(
          "Classroom — what a descriptor is",
          "<em>What it is:</em> the policy string wallets import (script + keys).<br/><em>Why:</em> words alone can fail for multisig and script paths.<br/><em>When / where:</em> store this line with the keys. Lose it and the keys may not be enough.<br/><em>How:</em> the object below is a practice wpkh/wsh line. Not a funded vault.",
          "v2DescTeach"
        ) +
        "<h3>Policy line (lab result)</h3>" +
        '<code class="v2-preview-big" id="v2DescLine">' +
        line +
        "</code>" +
        '<label class="check"><input type="checkbox" id="v2DescAck"/> I would store this policy string with the keys (practice tick)</label>' +
        pauseBtn("Policy saved with keys (practice)", !mem.descAck)
      );
    }
    return null;
  }

  async function uc35(step) {
    if (step === 0) {
      await ensurePhrase();
      return pad(
        "<h2>Looks like BIP-39</h2>" +
        doDont(
          "Look at twelve English words. Electrum can use the same dictionary with a different stretch.",
          "Do not assume BIP-39 restore is always right because the words look English."
        ) +
        '<div id="v2Card">' +
        wordGridHtml(mem.mnemonic) +
        "</div>" +
        pauseBtn("Next: try the wrong restore", !mem.mnemonic)
      );
    }
    if (step === 1) {
      return pad(
        "<h2>Wrong restore</h2>" +
        doDont(
          "Restore these words as BIP-39 to see a practice tb1. Then mark them as Electrum-style: BIP-39 would be the wrong vault.",
          "This tab does not run Electrum’s stretch and will not invent an Electrum address."
        ) +
        teachBox(
          "Classroom — English is not enough",
          "<em>What it is:</em> the same dictionary can still be Electrum’s stretch, not BIP-39.<br/><em>Why:</em> restoring as BIP-39 would be the wrong vault.<br/><em>When / where:</em> this tab will not invent an Electrum address.<br/><em>How:</em> the tb1 below is a BIP-39 practice restore (lab result). The note is the lesson.",
          "v2ElTeach"
        ) +
        "<h3>BIP-39 restore (lab result)</h3>" +
        '<div class="row" style="flex-wrap:wrap;gap:0.5rem">' +
        '<button type="button" class="btn" id="v2ElBip39">Restore as BIP-39</button>' +
        '<button type="button" class="btn secondary" id="v2ElElectrum">These words were Electrum-style</button>' +
        "</div>" +
        '<code class="v2-preview-big" id="v2ElAddr">' +
        (mem.elAddr || "BIP-39 restore shows a practice address here.") +
        "</code>" +
        '<div id="v2ElOut" class="control-help">' +
        (mem.elNote || "Pick both buttons. Electrum does not get a fake address.") +
        "</div>" +
        pauseBtn("BIP-39 restore is the wrong vault", !(mem.elBip && mem.elNote))
      );
    }
    return null;
  }

  async function uc1(step) {
    if (step === 0) {
      return pad(
        "<h2>Make practice words</h2>" +
        doDont(
          "Make practice words in this tab and look at the numbered card first.",
          "Do not import these words into a funded wallet. Do not send coins to addresses from this phrase."
        ) +
        generateExplainerHtml() +
        teachBox(
          "Classroom — words vs address",
          "<em>What it is:</em> practice BIP-39 words on a numbered card.<br/><em>Why:</em> the receive address is not the backup. The card is.<br/><em>When / where:</em> this tab only. Do not import. Do not fund.<br/><em>How:</em> the grid below is the object. Addresses come later.",
          "v2Uc1Teach"
        ) +
        entropyHtml() +
        wordCountSelectHtml() +
        '<div class="row v2-gen-bar" id="v2GenRow">' +
        '<div class="v2-gen-left">' +
        '<button type="button" class="btn" id="v2Generate">Make practice words</button>' +
        mnemonicHelpHtml(true) +
        "</div>" +
        "</div>" +
        '<label class="field mnemonic-raw" for="v2PasteMn"><span class="label-row">Paste practice words</span>' +
        '<textarea id="v2PasteMn" rows="3" spellcheck="false" autocomplete="off"></textarea></label>' +
        '<div class="row" style="margin-top:0.45rem">' +
        '<button type="button" class="btn secondary" id="v2PasteApply">Use pasted practice words</button>' +
        "</div>" +
        '<p id="v2PasteMsg" class="control-help">Paste a practice BIP-39 phrase only. Do not paste a funded backup.</p>' +
        '<div id="v2Card">' + wordGridHtml(mem.mnemonic) + "</div>" +
        '<div id="v2AddrWrap" class="v2-hidden"></div>' +
        pauseBtn("I have the numbered card", !mem.mnemonic)
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
        '<label class="check"><input type="checkbox" id="v2CardAck" ' + (mem.cardAck ? "checked" : "") + "/> I have looked at the card</label>" +
        pauseBtn("Next: show receive addresses", !mem.cardAck)
      );
    }
    if (step === 2) {
      await ensurePhrase();
      var gated = !mem.cardAck;
      var derived = !!(mem.lastRows && mem.lastRows.length);
      return pad(
        "<h2>Show receive addresses</h2>" +
        doDont(
          "Keep the numbered card in view. Same words; different numbers make different addresses.",
          "Do not send coins to these practice addresses."
        ) +
        desc(
          "The numbered card is the secret. The receive string is public. They are not the same thing. Test uses tb1… Mainnet uses bc1… Click Show receive addresses. This is not a wallet you should fund.",
          "v2DeriveHelp"
        ) +
        entropyHtml() +
        pipeHtml(true, derived, derived) +
        '<div id="v2Card">' +
        wordGridHtml(mem.mnemonic) +
        "</div>" +
        (gated
          ? '<p class="msg-bad">Look at the card first (previous step).</p>'
          : "") +
        '<div class="row v2-gen-bar" id="v2DeriveRow">' +
        '<div class="v2-gen-left">' +
        '<button type="button" class="btn" id="v2Derive" ' +
        (gated ? "disabled" : "") +
        ">Show receive addresses</button>" +
        netSelectHtml() +
        "</div>" +
        "</div>" +
        addrTypeTabsHtml() +
        '<div id="v2AddrWrap">' +
        (derived ? addrHtml() : '<p class="control-help">Addresses stay hidden until you click Show receive addresses.</p>') +
        "</div>" +
        pauseBtn("I see an address that is not the secret", !derived)
      );
    }
    if (step === 3) {
      var n = mem.wordCount || 12;
      return pad(
        "<h2>Try another length</h2>" +
        doDont(
          "Try another word count. More words means more random bits.",
          "Do not fund any of these practice phrases or their addresses."
        ) +
        desc(
          "Try a different length: 12, 15, 18, 21, or 24 words. A longer phrase uses more random bits from the operating system. Each new phrase is still practice. Do not send money to it or to addresses that come from it."
        ) +
        entropyHtml() +
        wordCountSelectHtml() +
        '<div class="row v2-gen-bar">' +
        '<div class="v2-gen-left">' +
        '<button type="button" class="btn secondary" id="v2Regen">Generate ' +
        n +
        "-word phrase</button>" +
        mnemonicHelpHtml(true) +
        "</div>" +
        "</div>" +
        '<div id="v2Card">' + wordGridHtml(mem.mnemonic) + "</div>" +
        pauseBtn("I tried another length", false)
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
        '<button type="button" class="btn" id="v2Generate">Make practice card</button>' +
        mnemonicHelpHtml(true) +
        "</div>" +
        "</div>" +
        '<div id="v2Card">' +
        wordGridHtml(mem.mnemonic) +
        "</div>" +
        '<label class="check"><input type="checkbox" id="v2CardAck" ' +
        (mem.cardAck ? "checked" : "") +
        "/> I looked at the backup card (indexes and words). The card is the backup.</label>" +
        pauseBtn("Next: hand-copy the card", !mem.mnemonic || !mem.cardAck)
      );
    }
    if (step === 1) {
      await ensurePhrase();
      await ensurePpExample();
      return pad(
        "<h2>Hand copy. Keep a passphrase apart.</h2>" +
        doDont(
          "Copy the numbered cells by hand onto paper you control. Keep any passphrase in a different place from this sheet.",
          "Do not photograph the sheet. Do not store it in a cloud drive, chat, or email. Do not keep it on a networked phone if the phrase is funded.",
          "v2DoNotList"
        ) +
        ppKeyHeroHtml(ppExampleHtml(), "v2PpKeyUc2") +
        pauseBtn("Next: print is optional", false)
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
        pauseBtn("I treated print as optional", false)
      );
    }
    if (step === 3) {
      return pad(
        "<h2>Quiz</h2>" +
        "<p>Four sentences. Choose the two that are right. Both right sentences must be selected to continue.</p>" +
        '<div class="quiz-opts" id="v2Uc2Quiz">' +
        shuffleQuizOpts([
          {
            k: "bad",
            t: "Photograph the sheet, or print it from this computer.",
            why: "Wrong. A camera or a printer path is not a handwritten backup."
          },
          {
            k: "ok",
            id: "v2Qhand",
            t: "Write the numbered cells by hand while the computer is offline.",
            okwhy: "Correct. Hand copy offline is the backup you want."
          },
          {
            k: "ok",
            id: "v2Qprint",
            t: "A photo or a print from this lab is weaker, because the words were already on this computer.",
            okwhy: "Correct. Print and photos are not an offline handwritten copy."
          },
          {
            k: "bad",
            t: "Print from this lab is as safe as writing the words by hand on a machine that never went online.",
            why: "Wrong. The words were already on this computer, so print is not that safe."
          }
        ])
          .map(function (o, i) {
            return quizOptBtn(o, i);
          })
          .join("") +
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
          "Make one numbered card. Next you will keep these words and add an extra secret on one side only.",
          "Do not treat the extra secret as a PIN on the same wallet."
        ) +
        desc(
          "Both vaults start from this same numbered card. The extra secret comes on the next step."
        ) +
        entropyHtml() +
        wordCountSelectHtml() +
        '<div class="row v2-gen-bar">' +
        '<div class="v2-gen-left">' +
        '<button type="button" class="btn" id="v2Generate">Generate ' + n + "-word phrase</button>" +
        mnemonicHelpHtml(true) +
        "</div>" +
        "</div>" +
        '<div id="v2Card">' + wordGridHtml(mem.mnemonic) + "</div>" +
        pauseBtn("Next: compare empty vs a test secret", !mem.mnemonic)
      );
    }
    if (step === 1) {
      await ensurePhrase();
      return pad(
        "<h2>Compare empty vs a test secret</h2>" +
        doDont(
          "Leave A empty. Keep B as a practice secret (test). Show both receive addresses.",
          "Do not fund either practice address."
        ) +
        desc(
          "Same words. A empty vs B with a test secret. Different receive addresses are two wallets."
        ) +
        teachBox(
          "Classroom — what the extra secret is",
          "<em>What it is:</em> an optional 25th word. Same twelve words + a different extra = a different vault.<br/><em>Why:</em> empty A vs test B must show two receive addresses.<br/><em>When / where:</em> you store the extra apart from the paper card. Forget B and that vault is gone. There is no reset desk.<br/><em>How:</em> the table below is the lab result — two addresses, not a PIN.",
          "v2CmpTeach"
        ) +
        '<div class="v2-cmp-split">' +
        '<div class="v2-cmp-face">' +
        ppKeyHtml("v2PpKeyUc3b") +
        "</div>" +
        '<div class="v2-cmp-fields">' +
        '<label class="field">A · empty extra secret <input id="ppA" type="password" value="" placeholder="leave empty" autocomplete="off" spellcheck="false" name="v2PpEmpty"/><span class="v2-pp-meta"><span id="v2PpCharsA" class="v2-pp-chars">0 chars</span><span id="v2PpEstA" class="v2-pp-est v2-pp-est-empty">(empty)</span></span>' +
        '<div class="pp-strength-bar v2-pp-bar"><div id="v2PpBarA" class="pp-strength-bar-fill pp-tier-empty" role="progressbar" aria-valuemin="0" aria-valuemax="128" aria-valuenow="0" style="width:0%"></div></div></label>' +
        '<label class="field">B · test secret <input id="ppB" type="password" value="test" placeholder="test" autocomplete="off" spellcheck="false" name="v2PpTest"/><span class="v2-pp-meta"><span id="v2PpCharsB" class="v2-pp-chars">4 chars</span><span id="v2PpEstB" class="v2-pp-est v2-pp-est-weak">~6 bits · weak (estimate only)</span></span>' +
        '<div class="pp-strength-bar v2-pp-bar"><div id="v2PpBarB" class="pp-strength-bar-fill pp-tier-weak" role="progressbar" aria-valuemin="0" aria-valuemax="128" aria-valuenow="6" style="width:5%"></div></div></label>' +
        "</div>" +
        '<div id="v2CmpOut" class="v2-cmp-out">' +
        '<div id="v2CmpVerdict" class="v2-verdict split">Type in A or B. Addresses follow a moment later.</div>' +
        '<table class="v2-ent-stack" id="v2CmpTable"><tr><th></th><th>A</th><th>B</th></tr><tr><td>Receive #0</td><td><code id="v2CmpAddrA">…</code></td><td><code id="v2CmpAddrB">…</code></td></tr></table>' +
        "</div>" +
        "</div>" +
        pauseBtn("Forget B and that vault is gone", true)
      );
    }
    if (step === 2) {
      return quiz("If you forget the extra secret (passphrase) for a vault:", [
        {
          k: "ok",
          t: "The twelve words alone will not open that vault. Those coins are gone.",
          okwhy: "Correct. Same words without that extra secret open a different vault."
        },
        {
          k: "bad",
          t: "This website can reset the extra secret for you.",
          why: "Wrong. There is no reset desk. Forgotten extra secret means that vault is gone."
        },
        {
          k: "bad",
          t: "The receive addresses stay the same even if the extra secret is wrong.",
          why: "Wrong. A different extra secret makes different addresses."
        }
      ]);
    }
    return finishHtml(3);
  }

  async function uc4(step) {
    await ensurePhrase();
    if (step === 0) {
      return pad(
        "<h2>Path is a folder</h2>" +
        doDont(
          "Change the folder number. The receive address should change. The words stay put.",
          "Do not think a new folder makes a new backup."
        ) +
        desc(
          "Think of a path as a folder inside the backup. Click Change folder to see the next receive address. The numbered card does not change."
        ) +
        teachBox(
          "Classroom — what a path is",
          "<em>What it is:</em> a folder inside the same backup.<br/><em>Why:</em> a new folder is a new address, not a new recovery phrase.<br/><em>When / where:</em> receive index 0, then later indices. The numbered card stays put.<br/><em>How:</em> the path line, table, and green chip below are this folder’s objects — not a chain lookup.",
          "v2PathTeach"
        ) +
        "<h3>This folder (lab result)</h3>" +
        '<p class="v2-path-big" id="v2PathLine">m/84\'/1\'/0\'/0/0</p>' +
        pathPurposeTabsHtml() +
        pathPlayTableHtml() +
        '<div class="row" style="flex-wrap:wrap;gap:0.5rem">' +
        '<button type="button" class="btn" id="v2Idx">Change folder</button>' +
        '<button type="button" class="btn secondary" id="v2IdxZero">Back to first folder</button>' +
        "</div>" +
        '<p class="control-help">Words stay on the card below. The address and the green amount belong to this folder only.</p>' +
        '<div class="v2-addr-amt">' +
        '<code class="v2-preview-big" id="v2Tail">Click Change folder. Watch the address, not the words.</code>' +
        '<span class="v2-amt-chip" id="v2FolderAmt" title="Teaching amount — not a chain lookup">…</span>' +
        "</div>" +
        '<p class="control-help">Green chip = teaching amount for this folder (not a chain lookup).</p>' +
        '<div id="v2Card">' + wordGridHtml(mem.mnemonic) + "</div>" +
        pauseBtn("Next: receive vs change folder", !mem.pathTouched)
      );
    }
    if (step === 1) {
      var p0 = window.BIP39Lab ? BIP39Lab.formatPath(84, "test", 0, 0, 0) : "m/84'/1'/0'/0/0";
      return pad(
        "<h2>Receive vs change</h2>" +
        doDont(
          "Toggle receive vs change. The address changes. The words stay the same.",
          "Do not think a new folder is a new recovery phrase."
        ) +
        desc(
          "Receive is where new coins arrive. When you spend, the leftover does not stay on that same address — the wallet sends it to a change address in another folder. Same words. Different path. Different amount."
        ) +
        teachBox(
          "Classroom — receive vs change",
          "<em>What it is:</em> two folders on the same words.<br/><em>Why:</em> leftover from a spend goes to change, not back to the receive address.<br/><em>When / where:</em> every spend in a real wallet. This pad only shows the two paths.<br/><em>How:</em> toggle below. Address and amount are lab objects, not a chain lookup.",
          "v2PathChTeach"
        ) +
        "<h3>This folder (lab result)</h3>" +
        '<p class="v2-scene">Example: 0.184 BTC arrives on receive #0. You spend 0.181. The leftover 0.003 goes to change #0 — not back to the receive address.</p>' +
        '<p class="v2-path-big" id="v2PathLine">' + p0 + "</p>" +
        pathPurposeTabsHtml() +
        pathPlayTableHtml() +
        '<div class="row" style="flex-wrap:wrap;gap:0.5rem">' +
        '<button type="button" class="btn" id="v2Idx">Change folder</button>' +
        '<button type="button" class="btn secondary" id="v2IdxZero">Back to first folder</button>' +
        '<button type="button" class="btn secondary" id="v2Change" data-change="0">Show change folder</button>' +
        "</div>" +
        '<div class="v2-vault-pair v2-rc-pair" id="v2RcPair">' +
        '<div class="v2-vault-col is-on" id="v2RcRecv">' +
        "<h3>Receive · money in</h3>" +
        '<p class="v2-path-mini" id="v2RcPath0">m/84\'/1\'/0\'/0/0</p>' +
        '<div class="v2-addr-amt">' +
        '<code class="v2-preview-big" id="v2RcAddr0">…</code>' +
        '<span class="v2-amt-chip" id="v2RcAmt0">…</span>' +
        "</div>" +
        "<p>Incoming payments. Path ends in <code>/0/n</code>.</p></div>" +
        '<div class="v2-vault-col" id="v2RcChg">' +
        "<h3>Change · leftover after a spend</h3>" +
        '<p class="v2-path-mini" id="v2RcPath1">m/84\'/1\'/0\'/1/0</p>' +
        '<div class="v2-addr-amt">' +
        '<code class="v2-preview-big" id="v2RcAddr1">…</code>' +
        '<span class="v2-amt-chip" id="v2RcAmt1">…</span>' +
        "</div>" +
        "<p>Change folder. Path ends in <code>/1/n</code>. Not a new backup.</p></div>" +
        "</div>" +
        '<p class="v2-rc-total" id="v2RcTotalLine">Wallet total at this index <span class="v2-amt-chip v2-amt-chip-total" id="v2RcSum">…</span> <span class="control-help" style="display:inline">= receive chip + change chip (teaching only — both folders, same words)</span></p>' +
        '<div class="v2-addr-amt">' +
        '<code class="v2-preview-big" id="v2Tail">Click Show change folder. Words stay. Address and amount switch folders.</code>' +
        '<span class="v2-amt-chip" id="v2FolderAmt" title="Teaching amount — not a chain lookup">…</span>' +
        "</div>" +
        '<p class="control-help">Green chip = teaching amount for the highlighted folder (not a chain lookup).</p>' +
        '<div id="v2Card">' + wordGridHtml(mem.mnemonic) + "</div>" +
        pauseBtn("The words stayed the same", true)
      );
    }
    if (step === 2) {
      return quizBank([
        {
          q: "What does the ' after purpose', coin_type', and account' mean?",
          opts: [
            qBad("A typing mark you can ignore. The numbers work the same without it.", "Wrong. The ' is BIP-32 hardened: that folder is locked."),
            qOk("Those folders are hardened (locked). A child key cannot walk back to the parent.", "Correct. change and index have no ' because they are not hardened."),
            qBad("It means that folder is optional and can be skipped.", "Wrong. Purpose, coin, and account are required path levels.")
          ]
        },
        {
          q: "You switch BIP84 to BIP86. The receive address changes. What about the coins?",
          opts: [
            qBad("Same coins. Only the address spelling changed.", "Wrong. 84 and 86 are different folders and different piles."),
            qBad("The green chip must stay the same because the words did not change.", "Wrong. Same words, different purpose — different teaching amount too."),
            qOk("They are a different pile. Coins sent to the 84 address do not appear on the 86 address.", "Correct. Purpose is a folder, not a font for the same address.")
          ]
        },
        {
          q: "Receive shows 0.184 BTC and change shows 0.003 BTC at this index. What is the wallet total here?",
          opts: [
            qOk("0.187 BTC — the sum of coins on both folders (same words).", "Correct. A wallet spends receive plus change at this index."),
            qBad("Only 0.184. Change is leftover and cannot be spent.", "Wrong. Change UTXOs are spendable. The total is the sum."),
            qBad("Only the larger chip. Wallets keep one balance field.", "Wrong. The wallet adds every coin it controls on both folders.")
          ]
        },
        {
          q: "You click Change folder so the path ends in /0/1 instead of /0/0. What is true?",
          opts: [
            qBad("The twelve words on the card are rewritten.", "Wrong. The recovery words stay put."),
            qBad("A payment is sent on the bitcoin network.", "Wrong. Changing a folder is local math. Nothing is sent."),
            qOk("The receive address changes. The recovery words stay the same.", "Correct. Only the folder index changed.")
          ]
        },
        {
          q: "After a spend, leftover coins usually go to:",
          opts: [
            qBad("The same receive address you published, so that chip always grows.", "Wrong. The receive UTXO is spent. Leftover goes to a change address."),
            qOk("A change address in the change folder (path …/1/n), not back to the same receive address.", "Correct. Receive is money in. Change is leftover after a spend."),
            qBad("A new recovery phrase generated just for the leftover.", "Wrong. Same words. Different folder. Not a new backup.")
          ]
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
        pauseBtn("Next: show a public viewing key", false)
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
          "One BIP tab at a time — same idea as Path folders. You get that purpose’s viewing key and its descriptor. Not the recovery words."
        ) +
        '<p class="control-help">Jargon: xpub ' + termI("XPUB") + " · zpub " + termI("ZPUB") + " · ypub " + termI("YPUB") + " · descriptor " + termI("DESCRIPTOR") + " · watch-only " + termI("WATCHONLY") + "</p>" +
        woTypeTabsHtml() +
        teachBox(
          "Classroom — what you export",
          "<em>What it is:</em> a public viewing key and its descriptor for one BIP folder.<br/><em>Why:</em> a watch app can list addresses without the twelve words.<br/><em>When / where:</em> phone or desktop watch-only. Never paste the recovery phrase into that app.<br/><em>How:</em> pick one BIP tab. The objects below are that folder only.",
          "v2WoTeach"
        ) +
        '<p class="control-help" id="v2WoHelp">BIP86 xpub — Taproot account public key (watch-only where supported).</p>' +
        "<h3>Viewing key and descriptor (lab result)</h3>" +
        '<div id="v2WoList" class="v2-copy-list"></div>' +
        '<pre class="out" id="v2WoOut" hidden></pre>' +
        '<pre class="out" id="v2DescOut">Pick a BIP tab. Only that folder’s viewing key and descriptor show.</pre>' +
        pauseBtn("I saw a viewing key, not the words", false)
      );
    }
    if (step === 2) {
      return quiz("What should a watch-only wallet receive?", [
        {
          k: "ok",
          t: "A public viewing key (the long xpub or zpub string) — never the twelve recovery words.",
          okwhy: "Correct. That key can list addresses. It cannot spend."
        },
        {
          k: "bad",
          t: "The recovery words, so the watch app can “just work”.",
          why: "Wrong. Pasting the words makes a hot wallet that can spend, not watch-only."
        },
        {
          k: "bad",
          t: "Your extra secret in the same photo as the words.",
          why: "Wrong. The extra secret spends. Watch-only only gets a public key."
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
      '">Make practice words</button>' +
      '<button type="button" class="btn secondary" data-cs-zpub="' +
      i +
      '"' +
      (c.mnemonic ? "" : " disabled") +
      ">Show viewing key</button>" +
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

  function paintMsPolicy() {
    var pol = $("v2MsPolicy");
    var box = $("v2MsDesc");
    if (!pol || !box) return;
    var cs = mem.cosigners || [];
    var zs = [];
    var i;
    for (i = 0; i < 3; i++) {
      if (cs[i] && cs[i].zpub) zs.push(cs[i].zpub);
    }
    if (zs.length !== 3) {
      pol.innerHTML =
        "<strong>Classroom — what 2-of-3 is</strong>Show all three viewing keys first. Then this blue box explains the spend rule; the line below is the recipe object.";
      box.textContent = "The recipe line appears when all three viewing keys exist. This pad does not sign.";
      return;
    }
    var sorted = zs.slice().sort();
    pol.innerHTML =
      "<strong>Classroom — what 2-of-3 is</strong>" +
      "<em>What it is:</em> a 2-of-3 spend rule. Any two of these three people can move the coins. One person alone cannot. Each still keeps a full backup — not scraps of one phrase.<br/>" +
      "<em>Why:</em> a wallet cannot rebuild this vault from the three backups alone. It also needs this recipe. Lose the recipe and you can be locked out even if the words survive.<br/>" +
      "<em>When / where:</em> save it with the three viewing keys. Sorted = same A–Z key order. This pad does not sign.";
    box.textContent = "wsh(sortedmulti(2," + sorted.join(",") + "))";
  }

  async function uc6(step) {
    if (step === 0) {
      return pad(
        "<h2>M-of-N is a spend rule</h2>" +
        doDont(
          "2-of-3 means any two of three people can spend. Each person keeps a full recovery phrase.",
          "This is not Shamir. Do not cut one phrase into pieces. That is the next track (UC7)."
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
        pauseBtn("Show 2-of-3", false)
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
        '<a class="btn secondary" href="../multisig.html" data-v2-dock="6">Open Multisig room (full M-of-N build)</a>' +
        "</div>" +
        (ready
          ? '<p class="msg-ok" id="v2CsReady">Three zpubs ready. Those are what a 2-of-3 coordinator would see — not the words.</p>'
          : '<p class="control-help">Pause stays locked until each cosigner shows a zpub.</p>') +
        '<h3>The spend rule</h3>' +
        '<div class="v2-callout done" id="v2MsPolicy"><strong>Classroom — what 2-of-3 is</strong>' +
        (ready
          ? "<em>What it is:</em> a 2-of-3 spend rule. Any two of these three people can move the coins. One person alone cannot. Each still keeps a full backup — not scraps of one phrase.<br/><em>Why:</em> a wallet cannot rebuild this vault from the three backups alone. It also needs this recipe (how many must sign, and which three keys, in one agreed order).<br/><em>When / where:</em> save the recipe with the three viewing keys. You build and spend in a real wallet, not here. Sorted = A–Z key order. This pad does not sign."
          : "Show all three viewing keys first. Then this blue box explains the spend rule; the line below is the recipe object.") +
        "</div>" +
        "<h3>Recipe line (lab result)</h3>" +
        '<pre class="out" id="v2MsDesc">' +
        (ready
          ? "wsh(sortedmulti(2,…))"
          : "The recipe line appears when all three viewing keys exist. This pad does not sign.") +
        "</pre>" +
        pauseBtn("Each keeps a full seed", !ready)
      );
    }
    if (step === 2) {
      return quizBank([
        {
          q: "In a 2-of-3 setup, the three keys are:",
          opts: [
            qBad("Three scraps of one recovery phrase.", "Wrong. That would be one secret cut into pieces. Here each person has a full key."),
            qOk("Three separate wallets. Any two people can sign. They are not scraps of one phrase.", "Correct. Each person holds a whole seed. Two signatures spend."),
            qBad("A reason to paste the recovery words into chat.", "Wrong. You share public viewing keys to build the vault. The words never go in chat.")
          ]
        },
        {
          q: "What do you share to build this vault?",
          opts: [
            qOk("The public viewing key from each person (zpub). Never the twelve words.", "Correct. The coordinator sees zpubs. Each person keeps their seed."),
            qBad("All three recovery phrases, so the coordinator can “just work”.", "Wrong. Pasting the words makes hot seeds, not a 2-of-3 vault."),
            qBad("One phrase cut into three chat messages.", "Wrong. That is not multisig. Each person has a full backup.")
          ]
        },
        {
          q: "Who can move coins in this 2-of-3?",
          opts: [
            qBad("Any one of the three, because they each have a full seed.", "Wrong. One seed is one signature. You need two."),
            qBad("All three must always sign, or nothing moves.", "Wrong. That would be 3-of-3. Here any two of three is enough."),
            qOk("Any two of the three. One person alone cannot.", "Correct. That is the spend rule on the policy line.")
          ]
        },
        {
          q: "Why save the long wsh(sortedmulti…) line with the three viewing keys?",
          opts: [
            qBad("You do not. The three word lists are enough to rebuild the vault.", "Wrong. Wallets also need the recipe: how many must sign, and which keys, in one order."),
            qOk("A wallet needs that recipe to rebuild the same vault. Words alone are not enough.", "Correct. Lose the recipe and you can be locked out even if the words survive."),
            qBad("It is the password that signs spends on this page.", "Wrong. This pad does not sign. The line is a save-with-the-keys recipe.")
          ]
        },
        {
          q: "What does “sorted” mean on that recipe?",
          opts: [
            qOk("The three keys are always listed in the same order so every wallet builds the same vault.", "Correct. Different order can mean a different address."),
            qBad("The coins are mixed on the network.", "Wrong. Sorted is about key order in the recipe, not CoinJoin."),
            qBad("This page signed the spend for you.", "Wrong. This pad never signs.")
          ]
        }
      ]);
    }
    return finishHtml(6);
  }

  function slip39CheckHtml() {
    function li(ok, text) {
      return (
        '<li class="' +
        (ok ? "is-on" : "is-off") +
        '">' +
        (ok ? "Done · " : "To do · ") +
        text +
        "</li>"
      );
    }
    return (
      li(!!(mem.slip39Shares && mem.slip39Shares.length >= 3), "3 SLIP-39 lists minted") +
      li(!!mem.slip39TriedOne, "Try 1 list — must fail") +
      li(!!mem.slip39TriedTwo, "Try 2 lists — must match")
    );
  }

  async function uc7(step) {
    if (step === 0) {
      var has = !!(mem.shamirMnemonic && String(mem.shamirMnemonic).trim());
      var mn = mem.shamirMN || { m: 2, n: 3 };
      var did = !!(mem.shamirDone);
      return pad(
        "<h2>One practice phrase → Shamir shares</h2>" +
        doDont(
          "Generate the phrase on this pad. Split those same words into shares here. Watch the shares come from that grid.",
          "Do not change screens to split. Do not fund it. This is not three cosigner keys (UC6)."
        ) +
        desc(
          "Shamir starts from one secret. These twelve words are that secret. Split encodes those words as bytes and cuts them into N classroom hex shares. Any M rebuild the same words. A piece cannot sign."
        ) +
        callout(
          "done",
          "Same pad",
          "Generate, then Split, without leaving this screen. The readout names the phrase the shares were built from. SLIP-39 (Trezor-shaped words) is the next pad — a different list."
        ) +
        '<button type="button" class="btn" id="v2ShPhrase">Generate practice phrase</button>' +
        '<div id="v2ShCard">' +
        (has ? wordGridHtml(mem.shamirMnemonic, "v2ShWordGrid") : wordGridHtml("", "v2ShWordGrid")) +
        "</div>" +
        '<label class="field" for="v2ShMN">Threshold<select id="v2ShMN">' +
        '<option value="2/3"' +
        (mn.m === 2 && mn.n === 3 ? " selected" : "") +
        ">2-of-3 (any 2 rebuild)</option>" +
        '<option value="3/5"' +
        (mn.m === 3 && mn.n === 5 ? " selected" : "") +
        ">3-of-5 (any 3 rebuild)</option>" +
        "</select></label>" +
        '<div class="row" style="flex-wrap:wrap;gap:0.45rem">' +
        '<button type="button" class="btn" id="v2Sh"' +
        (has ? "" : " disabled") +
        ">Split these words into shares</button>" +
        '<button type="button" class="btn secondary" id="v2ShCombine"' +
        (mem.shamirShares ? "" : " disabled") +
        ">Combine any M</button>" +
        "</div>" +
        '<label class="field" for="v2ShRecombineIn">Paste M share lines (share:index:hex), then try' +
        '<textarea id="v2ShRecombineIn" rows="4" spellcheck="false" autocomplete="off" placeholder="share:1:…\nshare:2:…"></textarea></label>' +
        '<button type="button" class="btn secondary" id="v2ShTry"' +
        (mem.shamirShares ? "" : " disabled") +
        ">Try these M shares</button>" +
        '<pre class="out" id="v2ShTryOut">Paste any M of the printed shares here. Try these M shares checks whether they rebuild the words on this pad. Combine any M still does it for you.</pre>' +
        '<div class="v2-callout done" id="v2ShStory"><strong>Classroom — what this split is</strong>' +
        (did
          ? "Those shares were built from the twelve words on this pad. Hex pieces below. Combine already matched."
          : "Generate, then Split. This blue box stays the teaching story. Share lines appear in the result box.") +
        "</div>" +
        '<h3>Share lines (lab result)</h3>' +
        '<pre class="out" id="v2ShOut">' +
        (did
          ? "Combine already matched. Share lines are in the paste box."
          : has
            ? "The grid is the secret. Click Split these words into shares — stay here."
            : "Generate a practice phrase first. Split stays on this pad.") +
        "</pre>" +
        '<p class="control-help">Optional longer hex lab: ' +
        '<a href="../shamir.html" data-v2-dock="7">Open Shamir room</a>' +
        " — still not Suite.</p>" +
        pauseBtn("I split and combined these words", !did)
      );
    }
    if (step === 1) {
      var ready = !!(mem.slip39TriedOne && mem.slip39TriedTwo);
      return pad(
        "<h2>Practice SLIP-39 (Trezor-shaped words)</h2>" +
        doDont(
          "Mint three people lists. Try one list (must fail). Try two (must match). Then we add an extra secret on the next pad.",
          "Do not fund this lab. Do not treat it as Trezor Suite. Do not type these into a funded device."
        ) +
        desc(
          "The last pad split BIP-39 words into classroom hex. This pad mints three SLIP-39 people-share lists (a different word list than BIP-39). Play the 2-of-3: three papers, one paper is not enough, any two rebuild."
        ) +
        callout(
          "warn",
          "Lab practice",
          "These look like backup words. They are SLIP-39 shares, not a BIP-39 seed. Throwaway. Never type them into a funded Trezor."
        ) +
        '<ul class="v2-s39-check" id="v2S39Check">' +
        slip39CheckHtml() +
        "</ul>" +
        '<div class="row" style="flex-wrap:wrap;gap:0.45rem">' +
        '<button type="button" class="btn" id="v2S39">Make practice SLIP-39 shares</button>' +
        '<button type="button" class="btn secondary" id="v2S39Combine"' +
        (mem.slip39Shares ? "" : " disabled") +
        ">Combine any 2 of 3</button>" +
        '<a class="btn secondary" href="../slip39.html" data-v2-dock="7">Open SLIP-39 room</a>' +
        "</div>" +
        '<label class="field" for="v2S39s0">SLIP-39 share 1 (people words, not BIP-39)<textarea id="v2S39s0" rows="2" spellcheck="false" autocomplete="off"></textarea></label>' +
        '<label class="field" for="v2S39s1">SLIP-39 share 2<textarea id="v2S39s1" rows="2" spellcheck="false" autocomplete="off"></textarea></label>' +
        '<label class="field" for="v2S39s2">SLIP-39 share 3<textarea id="v2S39s2" rows="2" spellcheck="false" autocomplete="off"></textarea></label>' +
        '<button type="button" class="btn secondary" id="v2S39Try"' +
        (mem.slip39Shares ? "" : " disabled") +
        ">Try these 2 shares</button>" +
        '<pre class="out" id="v2S39TryOut">Play in order: mint 3 lists → try 1 (fail) → try 2 (match). Combine any 2 of 3 is the shortcut for the match. Extra secret comes after.</pre>' +
        teachBox(
          "Classroom — what SLIP-39 is",
          "<em>What it is:</em> Trezor-shaped people-share lists (2-of-3), not BIP-39 seeds.<br/><em>Why:</em> hardware wallets do not import the classroom hex from the last pad.<br/><em>When / where:</em> people hold word shares. Lab only. Never fund. Not Suite.<br/><em>How:</em> mint three lists, fail with 1, match with 2. Combine any 2 of 3 is the shortcut.",
          "v2S39Story"
        ) +
        "<h3>Share lists (lab result)</h3>" +
        '<pre class="out" id="v2S39Out">' +
        (ready
          ? "2-of-3 drill done. Next pad: same two shares, with and without an extra secret."
          : "Click Make practice SLIP-39 shares. Master hex and share lines appear here.") +
        "</pre>" +
        pauseBtn("Next: extra secret on the same two shares", !ready)
      );
    }
    if (step === 2) {
      var ppDone = !!mem.slip39PpDone;
      var have = !!(mem.slip39Shares && mem.slip39Shares.length >= 2 && mem.slip39Hex);
      return pad(
        "<h2>Same two shares, extra secret</h2>" +
        doDont(
          "Unlock the same two SLIP-39 lists twice: once with no extra secret, once with a practice extra. Read the two hexes. They must differ.",
          "Do not treat this extra string as a BIP-39 25th word. Do not fund either hex. This is lab encryption, not a new share."
        ) +
        desc(
          "BIP-39’s optional 25th word stretches a seed into another wallet. SLIP-39’s extra secret encrypts the master at split time. Same two people papers + a different extra = a different recovered hex. Empty extra is how you just rebuilt the practice master. Type lab in the extra box (practice only)."
        ) +
        callout(
          "warn",
          "Not a fourth share",
          "The extra secret is not paper share 4. One list still fails even if you know the extra. Two lists without the extra open vault A. Two lists with lab open vault B."
        ) +
        (have
          ? '<p class="control-help">Using share 1 and share 2 from the last pad. Same papers both columns.</p>' +
            '<div class="v2-s39-pp">' +
            '<div class="v2-s39-col">' +
            "<h3>Without extra secret</h3>" +
            '<p class="control-help">Empty extra — the unlock you already practised.</p>' +
            '<pre class="out" id="v2S39HexA">Click Compare both unlocks.</pre>' +
            '<p id="v2S39TagA" class="control-help">—</p>' +
            "</div>" +
            '<div class="v2-s39-col">' +
            "<h3>With extra secret</h3>" +
            '<label class="field" for="v2S39Pp">Practice extra (not a 25th word)<input id="v2S39Pp" type="text" value="lab" autocomplete="off" spellcheck="false"/></label>' +
            '<pre class="out" id="v2S39HexB">Click Compare both unlocks.</pre>' +
            '<p id="v2S39TagB" class="control-help">—</p>' +
            "</div></div>" +
            '<button type="button" class="btn" id="v2S39PpGo">Compare both unlocks</button>' +
            '<pre class="out" id="v2S39PpOut">Same two shares. Two extras. Two hexes. If they match, you typed an empty extra on the right.</pre>'
          : '<p class="msg-bad">Make three SLIP-39 lists and finish the 2-of-3 drill on the previous pad first.</p>') +
        pauseBtn("Same papers, extra secret = another vault", !ppDone)
      );
    }
    if (step === 3) {
      return quizBank([
        {
          q: "What did you split in the classroom hex pad?",
          opts: [
            qOk("One practice BIP-39 phrase, cut into pieces. Any M pieces rebuild those same words.", "Correct. One secret. Recovery, not two signers."),
            qBad("Three independent wallets, like UC6.", "Wrong. UC6 is three full keys. Here one phrase is sliced."),
            qBad("A funded Trezor backup ready to stamp.", "Wrong. Practice only. Never fund.")
          ]
        },
        {
          q: "What does M-of-N mean here?",
          opts: [
            qOk("N pieces exist. Any M of them rebuild the one secret.", "Correct."),
            qBad("M people must each sign a bitcoin spend.", "Wrong. That is multisig. A Shamir share cannot sign."),
            qBad("You need all N pieces, always.", "Wrong. That would be N-of-N. 2-of-3 means any two.")
          ]
        },
        {
          q: "Are the hex shares the same as Trezor SLIP-39?",
          opts: [
            qOk("No. Hex is the classroom split. SLIP-39 is a different word list people actually hold.", "Correct."),
            qBad("Yes. Paste the hex into Trezor Suite.", "Wrong."),
            qBad("Yes. Same English BIP-39 words.", "Wrong. SLIP-39 uses its own share words.")
          ]
        },
        {
          q: "You unlock the same two SLIP-39 lists once with no extra secret and once with lab. The two hexes:",
          opts: [
            qOk("Differ. Same people papers, extra secret = another vault. Not a BIP-39 25th word.", "Correct. SLIP-39 encrypts the master. Empty extra rebuilt the practice hex. lab did not."),
            qBad("Must match, because two of three already succeeded.", "Wrong. The extra secret is a second lock, not a fourth paper."),
            qBad("Are the BIP-39 25th word on this pad.", "Wrong. A 25th word is a different stretch. This extra is SLIP-39 encryption.")
          ]
        },
        {
          q: "Can one SLIP-39 list plus the extra secret spend bitcoin?",
          opts: [
            qOk("No. One list still fails. Combining is recovery, not a signature. Lab only.", "Correct. Threshold is still 2. Extra secret is not a missing share."),
            qBad("Yes — the extra secret counts as the second share.", "Wrong. It is not paper share 2."),
            qBad("Yes, after you open Network.", "Wrong. Lookup is not a sign.")
          ]
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
          "A payment package (PSBT) is an unfinished bitcoin send you can pass around. Hot software can build it. A cold device or a co-signer adds a signature later. A hot machine broadcasts. Nobody pastes the twelve words. This page only looks."
        ) +
        pauseBtn("Next: inspect the payment package", false)
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
          "Load a sample or paste a package. Inspect only means: does this blob look like a PSBT, not a seed. Then you sign somewhere else and broadcast somewhere else."
        ) +
        callout(
          "done",
          "Why this exists",
          "Air-gap and 2-of-3 both need a file that is not the backup. This tab checks the file. It never signs and never sends."
        ) +
        '<h3>True transactions that already happened</h3>' +
        '<p class="control-help">Select one. Tick leak-ack. Then Inspect this transaction. These are public chain history — not the classroom PSBT below.</p>' +
        '<div class="row" style="flex-wrap:wrap;gap:0.45rem" id="v2TxPick">' +
        PSBT_EX_TX.map(function (ex, i) {
          var on = mem.psbtExI === i;
          return (
            '<button type="button" class="btn' +
            (on ? "" : " secondary") +
            '" data-v2-ex-txid="' +
            ex.id +
            '" data-v2-ex-i="' +
            i +
            '">' +
            ex.label +
            "</button>"
          );
        }).join("") +
        "</div>" +
        '<p id="v2PsbtNetMsg" class="control-help">' +
        (mem.psbtExI != null && PSBT_EX_TX[mem.psbtExI]
          ? "Selected: " + PSBT_EX_TX[mem.psbtExI].label + " — " + PSBT_EX_TX[mem.psbtExI].why
          : "Select a named example. The first three are payments. The next three carry extra on-chain data (OP_RETURN, inscription, runestone).") +
        "</p>" +
        '<label class="check"><input type="checkbox" id="v2PsbtNetAck"/> I understand a public lookup sends this txid and my IP to this site’s proxy and/or mempool.space. Never a seed. Opt-in leak ack.</label>' +
        '<button type="button" class="btn" id="v2TxInspect">Inspect this transaction</button>' +
        '<div class="v2-s39-pp v2-tx-split">' +
        '<div class="v2-s39-col">' +
        '<div class="v2-callout done" id="v2TxStory"><strong>What this is (classroom)</strong>Select a named example. Payments (Genesis / Hal / Pizza) vs data (OP_RETURN / inscription / runestone). This blue box is the teaching story — not the explorer payload.</div>' +
        "</div>" +
        '<div class="v2-s39-col">' +
        "<h3>What the chain says</h3>" +
        '<pre class="out" id="v2PsbtNetLive">Tick leak-ack, then Inspect. This column is only txid / confirm / block / in / out from the explorer (or classroom snapshot if live missed).</pre>' +
        "</div></div>" +
        '<a class="btn secondary" id="v2PsbtNetOpen" hidden href="../network.html" data-v2-dock="8">Open Network (public lookup)</a>' +
        '<label class="field" for="v2PsbtIn">PSBT text (classroom sample or paste)<textarea id="v2PsbtIn" rows="3" spellcheck="false" autocomplete="off" placeholder="Click a sample, or paste cHNidP8…"></textarea></label>' +
        '<div class="row" style="flex-wrap:wrap;gap:0.45rem">' +
        '<button type="button" class="btn secondary" id="v2Psbt" data-psbt="min">Inspect sample</button>' +
        '<button type="button" class="btn secondary" id="v2PsbtStory" data-psbt="story">Inspect another sample</button>' +
        '<button type="button" class="btn secondary" id="v2PsbtPartial" data-psbt="partial">Inspect a partial sample</button>' +
        '<button type="button" class="btn secondary" id="v2PsbtInspect">Inspect again</button>' +
        "</div>" +
        '<p class="control-help" id="v2PsbtStoryLine">Classroom packages have no on-chain id. This tab never signs.</p>' +
        '<div class="v2-callout done" id="v2PsbtTeach"><strong>Classroom — what a PSBT is</strong>Inspect a sample. This blue box is the teaching story (what / why / when / how). The result box below is only what the parser saw.</div>' +
        '<h3>What the parser saw</h3>' +
        '<pre class="out" id="v2PsbtOut">Inspect a sample. Never sign here.</pre>' +
        pauseBtn("I inspected a true tx. No sign.", true)
      );
    }
    if (step === 2) {
      return quizBank([
        {
          q: "What is a PSBT here?",
          opts: [
            qBad("The twelve recovery words in another format.", "Wrong. A payment package is not a backup."),
            qOk("An unfinished bitcoin send you can pass around without the seed.", "Correct. Hot software builds it; someone else can sign later."),
            qBad("A finished payment already on the network.", "Wrong. If it were already broadcast you would not be inspecting a package.")
          ]
        },
        {
          q: "Why does this job exist?",
          opts: [
            qOk("So a hot computer can build a send and a cold device or co-signer can sign later — without pasting the words.", "Correct. Air-gap and 2-of-3 both need a file that is not the seed."),
            qBad("So this website can hold your coins.", "Wrong. This tab never holds coins."),
            qBad("So you can skip hardware and type the seed into the package.", "Wrong. Never put the seed in the package or on this page.")
          ]
        },
        {
          q: "Where do you actually sign?",
          opts: [
            qBad("On this inspect pad, after the magic line is ok.", "Wrong. Ok means the blob looks like a PSBT. This pad does not sign."),
            qBad("In chat, by pasting the twelve words next to the package.", "Wrong. The package is not a place for the backup."),
            qOk("On a cold device or with a co-signer you trust — not on this tab.", "Correct. Inspect here. Sign elsewhere.")
          ]
        },
        {
          q: "What does this lab do with the package?",
          opts: [
            qOk("It only reads the file on this computer. It never signs and never sends it.", "Correct. Inspect is look-only."),
            qBad("It uploads the recovery words to a coordinator.", "Wrong. The inspect tool never sends the words."),
            qBad("It finishes and broadcasts real mainnet payments.", "Wrong. This card does not send.")
          ]
        },
        {
          q: "After inspect says the blob looks like a PSBT, what is next?",
          opts: [
            qBad("Fund these practice samples. They are a real vault.", "Wrong. Classroom blobs. Not a funded spend."),
            qOk("Sign on a device you trust, then broadcast from a hot machine you choose. This tab already finished its job.", "Correct. Inspect → sign elsewhere → broadcast elsewhere."),
            qBad("Click Sign on this page. The magic line is the signature.", "Wrong. Magic is only the file stamp. There is no Sign here.")
          ]
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
        pauseBtn("Next: show the account viewing key", false)
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
        teachBox(
          "Classroom — what an xpub is",
          "<em>What it is:</em> an account viewing key. It can list future addresses. It cannot spend.<br/><em>Why:</em> anyone with it can see activity. It is still not the recovery words.<br/><em>When / where:</em> watch-only software. Do not publish it casually.<br/><em>How:</em> the string below should start with zpub or xpub — never xprv.",
          "v2XpubTeach"
        ) +
        '<button type="button" class="btn" id="v2Xpub">Show account viewing key</button>' +
        "<h3>Viewing key (lab result)</h3>" +
        '<div id="v2XpubList" class="v2-copy-list"></div>' +
        '<pre class="out" id="v2XpubOut">Public extended key only.</pre>' +
        pauseBtn("I did not see an xprv", false)
      );
    }
    if (step === 2) {
      return quiz("If you publish a viewing key (xpub):", [
        {
          k: "ok",
          t: "Nobody can spend with it, but they can see future addresses and activity.",
          okwhy: "Correct. Watch-only and leaky — not spend."
        },
        {
          k: "bad",
          t: "Anyone can steal the coins immediately.",
          why: "Wrong. A viewing key cannot sign. It can still leak history."
        },
        {
          k: "bad",
          t: "It is the same secret as the twelve recovery words.",
          why: "Wrong. The viewing key cannot spend. The words can."
        }
      ]);
    }
    return finishHtml(9);
  }

  async function uc10(step) {
    if (step === 0) {
      return pad(
        "<h2>Unknown is not zero</h2>" +
        doDont(
          "If a lookup fails, treat the balance as unknown.",
          "Do not read a missing lookup as zero coins. Do not send recovery words."
        ) +
        desc(
          "This tab does not look anything up until you opt in. After leak-ack it may fetch same-origin /api/mempool (fees, mempool traffic, optional address). Failures stay unknown — never a fake zero. Never the twelve words."
        ) +
        pauseBtn("Next: opt-in live lookup on this tab", false)
      );
    }
    if (step === 1) {
      var on = !!mem.netSnap;
      return pad(
        "<h2>Live lookup (same origin)</h2>" +
        doDont(
          "Tick leak-ack. Fetch fees and traffic. Optional: one address you chose.",
          "Do not paste a seed. Unknown is not zero."
        ) +
        desc(
          "Same job as the Network room. After leak-ack this tab tries /api/mempool, then mempool.space (browser, like Network). If both miss, a classroom Fees & traffic snapshot still paints. Address lookup stays unknown on error. Never fund from here."
        ) +
        callout(
          "warn",
          "Leak ack",
          "A fee snapshot still shows your IP to the host. An address lookup also shows that address. Never the mnemonic."
        ) +
        '<label class="check"><input type="checkbox" id="v2NetAck"/> I understand a public lookup sends my IP (and an address, if I type one) to this site’s proxy and/or mempool.space. Never a seed. Opt-in leak ack.</label>' +
        "<h3>Fees &amp; traffic</h3>" +
        '<p class="card-lede teach-only">Optional public snapshot via mempool proxy. Does <strong>not</strong> send any of your addresses — only general fee/mempool stats (still reveals your IP to the host). Public APIs may rate-limit or fail under load; retry later if a fetch errors.</p>' +
        '<div class="row" style="flex-wrap:wrap;gap:0.45rem">' +
        '<button type="button" class="btn" id="v2NetSnap" disabled>Fetch fee + traffic snapshot</button>' +
        "</div>" +
        '<p id="v2SnapStatus" class="status" aria-live="polite">' +
        (on ? "Snapshot already fetched this session. Fetch again if you want a refresh." : "") +
        "</p>" +
        '<div id="v2SnapResult" class="watch-list"' +
        (on ? "" : " hidden") +
        ">" +
        '<div class="watch-item"><div class="watch-item-title">Recommended fee rates (sat/vB)</div>' +
        '<div class="fee-bands" id="v2FeeBands" aria-live="polite"></div>' +
        '<pre class="out" id="v2FeeOut"></pre>' +
        '<p class="control-help" id="v2FeeExample"></p></div>' +
        teachBox(
          "Classroom — fees vs UTXOs",
          "<em>What it is:</em> public fee bands and mempool traffic. Not your addresses.<br/><em>Why:</em> fees are paid from UTXOs you spend — not from a separate fee account.<br/><em>When / where:</em> after leak-ack. Higher sat/vB competes when the mempool is full.<br/><em>How:</em> the bands, 140 vB example, and traffic pre below are the objects (live or classroom snapshot).",
          "v2FeeTeach"
        ) +
        '<div class="watch-item"><div class="watch-item-title">UTXO reminder</div>' +
        '<p class="control-help">Fees are paid from UTXOs you spend — not from a separate “fee account”. Higher sat/vB competes for block space when the mempool is full.</p></div>' +
        '<div class="watch-item"><div class="watch-item-title">Network traffic (public)</div>' +
        '<pre class="out" id="v2TrafficOut"></pre>' +
        '<p class="control-help">Educational context only — not financial advice.</p></div>' +
        "</div>" +
        '<label class="field" for="v2NetAddr">Optional address (never a seed)<input id="v2NetAddr" type="text" autocomplete="off" spellcheck="false" placeholder="bc1q… or 1… or 3…"/></label>' +
        '<button type="button" class="btn secondary" id="v2NetBal" disabled>Fetch address</button>' +
        teachBox(
          "Classroom — unknown is not zero",
          "<em>What it is:</em> an address-only lookup after leak-ack.<br/><em>Why:</em> 0 sats with status ok means empty (valid). Failures stay unknown — never a silent fake zero.<br/><em>When / where:</em> this table is the same job as Network. Never paste a seed.<br/><em>How:</em> the table below is the object: status, sats, detail.",
          "v2BalTeach"
        ) +
        '<p class="control-help teach-only"><strong>0 sats</strong> with status <code>ok</code> means empty (valid). Failures show <code>unknown</code> — never a silent fake zero.</p>' +
        '<p id="v2BalStatus" class="status" aria-live="polite"></p>' +
        '<div class="table-scroll cols-modern">' +
        '<table class="addr-table" id="v2BalTable">' +
        "<thead><tr><th>#</th><th>Address</th><th>Status</th><th>Balance (sats)</th><th>Detail</th></tr></thead>" +
        '<tbody id="v2BalTableBody"><tr class="empty-row"><td colspan="5">No balances yet — acknowledge, add an address, then Fetch.</td></tr></tbody>' +
        "</table></div>" +
        '<pre class="out" id="v2NetBalOut" hidden>Address lookup stays unknown until leak-ack and a valid address. Failures are unknown, not a fake 0.</pre>' +
        '<p class="control-help">Full Network room (same proxy): ' +
        '<a href="../network.html" data-v2-dock="10">Open Network</a></p>' +
        pauseBtn("Lookups are address-only. Unknown is not zero.", !on)
      );
    }
    if (step === 2) {
      return quizBank([
        {
          q: "If a balance lookup fails, what should the screen say?",
          opts: [
            qOk("Unknown — not a fake zero.", "Correct. A failed lookup is unknown, not an empty wallet."),
            qBad("0.00000000 bitcoin.", "Wrong. Zero looks like an empty wallet."),
            qBad("Send the recovery words to the lookup site and retry.", "Wrong. Address only. Never the words.")
          ]
        },
        {
          q: "What may this tab fetch after leak-ack?",
          opts: [
            qOk("Fees, traffic, optional address — lab proxy, then mempool.space. Never the words.", "Correct. Same exception as Network. Still no seed."),
            qBad("The twelve recovery words to a public explorer.", "Wrong."),
            qBad("A signed spend to broadcast.", "Wrong. This tab does not sign or broadcast.")
          ]
        },
        {
          q: "What does an address lookup leak?",
          opts: [
            qOk("That you care about that address, plus your IP, to the proxy host.", "Correct."),
            qBad("Nothing. Lookups are secret.", "Wrong."),
            qBad("Your seed, so the host can restore the wallet.", "Wrong. Never the words.")
          ]
        },
        {
          q: "When is 0 sats honest?",
          opts: [
            qOk("When the API returns a valid empty address (status ok).", "Correct. Failures stay unknown."),
            qBad("Whenever the request fails.", "Wrong. Failure is unknown."),
            qBad("Always. Missing data means empty.", "Wrong.")
          ]
        },
        {
          q: "Where do you sign a spend?",
          opts: [
            qOk("Not here. This pad only looks up public data after opt-in.", "Correct."),
            qBad("On Fetch address. That is a signature.", "Wrong."),
            qBad("Paste the seed into the address box.", "Wrong.")
          ]
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
  var FOLDER_RECV_BTC = [
    "0.184", "0.012", "0.001", "0.050", "0.000184",
    "0.420", "0.008", "0.091", "0.0022", "0.150",
    "0.033", "0.007", "0.210", "0.0005", "0.064",
    "0.018", "0.300", "0.0041", "0.077", "0.025"
  ];
  var FOLDER_CHANGE_BTC = [
    "0.003", "0.017", "0.0009", "0.041", "0.006",
    "0.022", "0.011", "0.0003", "0.055", "0.0088",
    "0.014", "0.029", "0.0017", "0.036", "0.0094",
    "0.002", "0.048", "0.013", "0.0006", "0.019"
  ];

  function folderTeachBtc(change, i, purpose) {
    var list = change ? FOLDER_CHANGE_BTC : FOLDER_RECV_BTC;
    var n = list.length;
    var idx = Math.max(0, i | 0) % n;
    var p = purpose | 0;
    var shift = 0;
    if (p === 86) shift = 3;
    else if (p === 49) shift = 7;
    else if (p === 44) shift = 11;
    return list[(idx + shift) % n];
  }

  function addTeachBtc(a, b) {
    var sa = String(a);
    var sb = String(b);
    var pa = ((sa.split(".")[1] || "").length);
    var pb = ((sb.split(".")[1] || "").length);
    var p = Math.max(pa, pb, 1);
    var scale = Math.pow(10, p);
    var n = Math.round(parseFloat(sa) * scale) + Math.round(parseFloat(sb) * scale);
    return (n / scale).toFixed(p).replace(/\.?0+$/, "").replace(/\.$/, "") || "0";
  }

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
        pauseBtn("Sort these four", !whoAllOk())
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
        pauseBtn("Next: you hold the words", !frozen)
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
        '<section class="v2-hold-col v2-hold-col-one" aria-labelledby="v2HoldOneH">' +
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
      return quizBank([
        {
          q: "Who usually holds the keys on Coinbase, Binance, or a login-only bitcoin app?",
          opts: [
            { k: "ok", t: "The company. You only have a login. You never got a seed phrase.", okwhy: "Correct. They can freeze or lose it. That is not your wallet." },
            { k: "bad", t: "You, because you have a password and an extra login code.", why: "Wrong. A password opens their website. It is not a seed phrase." },
            { k: "bad", t: "You, because you can open the same balance in any other wallet.", why: "Wrong. There are no words to type into another wallet." }
          ]
        },
        {
          q: "If the company locks the app, what happens to the 0.184 bitcoin it showed you?",
          opts: [
            { k: "ok", t: "You cannot send it. They still have the keys.", okwhy: "Correct. A freeze is possible because you never held the seed." },
            { k: "bad", t: "You export the seed phrase and open Sparrow.", why: "Wrong. They never gave you a seed phrase." },
            { k: "bad", t: "Support resets the twelve words.", why: "Wrong. There were no words. Support controls the account, not a BIP-39 phrase." }
          ]
        },
        {
          q: "When you self-custody with one signer and lose the only paper:",
          opts: [
            { k: "ok", t: "Nobody can reset it. The coins cannot move.", okwhy: "Correct. One seed, one person. Lost paper is loss." },
            { k: "bad", t: "The exchange can restore the wallet from your email.", why: "Wrong. You withdrew. They never had this seed." },
            { k: "bad", t: "Any password manager can rebuild the phrase.", why: "Wrong. A login is not a seed. The paper was the backup." }
          ]
        },
        {
          q: "In a 2-of-3 co-signer setup, if you lose only your paper:",
          opts: [
            { k: "ok", t: "The other two keys can still send.", okwhy: "Correct. Threshold is two signatures. One lost paper does not kill the vault." },
            { k: "bad", t: "The coins are gone, same as one signer.", why: "Wrong. That is the one-signer column. 2-of-3 still works with the other two." },
            { k: "bad", t: "You can send alone because you still remember the login.", why: "Wrong. There is no company login. You need a second signature." }
          ]
        },
        {
          q: "“I can spend and I can lose it” describes:",
          opts: [
            { k: "ok", t: "You hold the recovery words — self-custody.", okwhy: "Correct. Keys you hold can send. Keys you lose cannot be reset." },
            { k: "bad", t: "An exchange account with two-factor login.", why: "Wrong. That is they-hold. You have a login, not a seed." },
            { k: "bad", t: "Watch-only, because you can see 0.184.", why: "Wrong. Watch-only cannot spend. Seeing a balance is not holding keys." }
          ]
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
        pauseBtn("Next: hardware keeps the seed on the device", !t.malware)
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
        pauseBtn("I kept keys on the device (USB is not an air-gap)", !t.typed)
      );
    }
    if (step === 2) {
      return quiz("Same recovery words on a phone app versus a hardware signer:", [
        {
          k: "ok",
          t: "Same words, different home. A phone is hot. Hardware should keep the keys on the device.",
          okwhy: "Correct. Where the keys live is the lesson. A USB cable is not an air-gap."
        },
        {
          k: "bad",
          t: "Plugging USB into a laptop automatically makes an air-gap.",
          why: "Wrong. A cable to an online computer is not an air-gap."
        },
        {
          k: "bad",
          t: "The safe setup is to type the recovery words into the computer.",
          why: "Wrong. Typing the words into a computer still kills the vault."
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
        pauseBtn("Sort these four objects", !sortAllOk())
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
      return quiz("Hot versus cold means:", [
        {
          k: "ok",
          t: "Whether your keys live on a machine that talks to the internet. The brand on the box is not the split.",
          okwhy: "Correct. Daily spend can be hot. Savings stay cold or watch-only."
        },
        {
          k: "bad",
          t: "Whatever the box says “hardware”, even if you typed the words into a laptop.",
          why: "Wrong. Keys on an online machine are hot, whatever the box says."
        },
        {
          k: "bad",
          t: "The same as a company holding the keys versus you holding them.",
          why: "Wrong. An exchange is them-holding. Hot versus cold is about whether your keys are online."
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
    var need = entNeed() || 128;
    return Math.max(0, Math.min(1, entBits() / need));
  }

  function lockHue(ratio) {
    if (ratio == null) return 0;
    var t = Math.max(0, Math.min(1, ratio));
    // Green only when pad meets this word count. 128 bits for 12-word is green;
    // the same 128 for 15–24 stays amber/red until 160/192/224/256.
    if (t >= 0.999) return -90;
    return 155 + (35 - 155) * t;
  }

  function lockFilter(ratio) {
    if (ratio == null) return "";
    return "hue-rotate(" + lockHue(ratio).toFixed(1) + "deg) saturate(1.35)";
  }

  function lockCap(ratio) {
    if (ratio == null) return "Seed strength";
    var n = mem.entWordCount || 12;
    var need = entNeed();
    if (ratio >= 0.999) return "Stronger seed";
    if (entBits() + 0.001 >= 128 && padIsLow()) {
      return "Not enough for " + n + "-word (~" + need + ")";
    }
    if (ratio < 0.35) return "Weak seed";
    return "Building toward " + n + "-word";
  }

  function lockToneClass(ratio) {
    if (ratio == null) return "idle";
    if (ratio >= 0.999) return "ok";
    if (ratio < 0.5) return "low";
    return "mid";
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

  function entBarMetrics() {
    var bits = entBits();
    var need = entNeed() || 128;
    var fill = Math.min(100, need ? (bits / need) * 100 : 0);
    var t128 = Math.min(100, (128 / need) * 100);
    var t256 = Math.min(100, (256 / need) * 100);
    return {
      bits: bits,
      need: need,
      fill: fill,
      t128: t128,
      t256: t256,
      low: padIsLow()
    };
  }

  function entFaceHtml() {
    var m = entBarMetrics();
    var bits = m.bits;
    var rounded = Math.round(bits);
    var fill = m.fill;
    var t128 = m.t128;
    var t256 = m.t256;
    var low = m.low;
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
      " · bar fills for <strong>this</strong> word count (12→128 · 15→160 · 18→192 · 21→224 · 24→256). Markers 128 and 256.</p>" +
      "</div>"
    );
  }

  function refreshEntDom() {
    var m = entBarMetrics();
    var bits = m.bits;
    var rounded = Math.round(bits);
    var fill = m.fill;
    var t128 = m.t128;
    var t256 = m.t256;
    var low = m.low;
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
        " · bar fills for <strong>this</strong> word count (12→128 · 15→160 · 18→192 · 21→224 · 24→256). Markers 128 and 256.";
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
      '<div class="v2-ent-mint-group">' +
      wordCountSelectHtml("v2EntWc", n) +
      '<button type="button" class="btn" id="v2EntMint">Build ' +
      n +
      " practice words from this pad</button>" +
      "</div>" +
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
      "</div>" +
      '<div class="row" style="flex-wrap:wrap;gap:0.5rem;margin-top:0.5rem">' +
      '<button type="button" class="btn secondary" id="v2EntToLab" title="Optional: paste practice words into First wallet for more demos">Optional: put practice words on First wallet</button>' +
      "</div>" +
      '<p class="control-help" id="v2EntToLabNote" style="margin:0.5rem 0 0">For a proper random demo phrase, use First wallet → Generate (OS CSPRNG) instead of this pad.</p>'
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

  async function refreshPpExample() {
    var words = ["correct", "horse", "battery", "staple"];
    try {
      if (window.BIP39Lab && typeof BIP39Lab.generateMnemonic === "function") {
        var m = await BIP39Lab.generateMnemonic(12);
        var w = String(m || "").split(/\s+/).filter(Boolean);
        if (w.length >= 4) words = w.slice(0, 4);
      }
    } catch (e) { /* keep fallback */ }
    mem.ppExample = words.join("-");
    return mem.ppExample;
  }

  async function ensurePpExample() {
    if (mem.ppExample) return mem.ppExample;
    return refreshPpExample();
  }

  function ppExampleHtml() {
    return (
      '<div class="v2-pp-ex">' +
      '<p class="v2-pp-copy">Optional extra secret. Store it apart from the numbered card.</p>' +
      '<div class="v2-pp-ex-row">' +
      '<span class="v2-pp-copy">Example</span>' +
      '<code id="v2PpEx">' +
      attrEsc(mem.ppExample || "") +
      "</code>" +
      '<button type="button" class="btn secondary btn-sm" id="v2PpExGen">Make another example</button>' +
      "</div>" +
      '<p class="v2-pp-copy">Practice only. Do not reuse this on a funded wallet.</p>' +
      "</div>"
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

  function entHeroHtml(opts) {
    opts = opts || {};
    return (
      '<div class="v2-ent-hero' +
      (opts.key ? " v2-ent-hero-eq" : "") +
      '">' +
      entDieHtml() +
      entFaceHtml() +
      lockHtml("pad") +
      (opts.key ? ppKeyHtml(opts.keyId || "v2PpKey") : "") +
      "</div>"
    );
  }

  function entButtonsHtml(heroOpts) {
    return (
      entHeroHtml(heroOpts) +
      '<div class="row v2-gen-bar">' +
      '<div class="v2-gen-left">' +
      '<button type="button" class="btn" id="v2Dice">Roll d6 (simulated)</button>' +
      '<button type="button" class="btn secondary" id="v2Dice10" title="Ten simulated d6 at once — practice only">+10 d6 (fast)</button>' +
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
          "Roll a few simulated dice. Read TOO LOW. You can still get a full-looking phrase later.",
          "Do not treat three rolls as a wallet. These buttons are a classroom demo, not a real dice ceremony."
        ) +
        desc(
          "A short pad can still print words. Word count is not enough. How many rolls you need comes after you have seen TOO LOW."
        ) +
        callout("done", "Word count is not entropy", "You can print 12 or 24 words from a short pad. That does not mean you had 128 or 256 bits.") +
        entButtonsHtml() +
        pauseBtn("Next: see why the words are still weak", !few)
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
        pauseBtn("Next: how many rolls for twelve words", !mem.entMnemonic)
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
      return quizBank([
        {
          q: "A few dice rolls that still print 12 or 24 recovery words mean:",
          opts: [
            { k: "ok", t: "The pad can still be too weak. Having 12 or 24 words does not prove you rolled enough.", okwhy: "Correct. Twelve words want about 50 dice. Twenty-four want about 100." },
            { k: "bad", t: "Twenty-four words always means enough randomness.", why: "Wrong. The list can look complete while the pad is still too weak." },
            { k: "bad", t: "Three coin flips are enough because each flip is huge.", why: "Wrong. Each coin flip is one bit." }
          ]
        },
        {
          q: "You reached enough for 12 words (green), then switched the dropdown to 24. The lock should:",
          opts: [
            { k: "ok", t: "Go back toward red until you have rolled enough for 24 words.", okwhy: "Correct. Green is for this length. Twenty-four words want about twice the pad." },
            { k: "bad", t: "Stay green because you already have twelve words.", why: "Wrong. Word count is not the same as enough rolls." },
            { k: "bad", t: "Jump to enough automatically.", why: "Wrong. Changing the dropdown does not add dice. Keep rolling." }
          ]
        },
        {
          q: "About how many six-sided dice rolls reach enough for 12 words?",
          opts: [
            { k: "ok", t: "About 50 rolls.", okwhy: "Correct. A coin would need about 128 flips for the same job." },
            { k: "bad", t: "Three rolls, because the list always prints 12 words.", why: "Wrong. Three rolls still print words and stay too weak." },
            { k: "bad", t: "One roll, because a die has six faces.", why: "Wrong. Six faces is only a little randomness, not enough for 12 words." }
          ]
        },
        {
          q: "A coin flip on this pad is:",
          opts: [
            { k: "ok", t: "One bit. You would need about 128 flips for 12 words, or 256 for 24.", okwhy: "Correct. A coin is the slow path. Dice reach the same strength faster." },
            { k: "bad", t: "Huge — three flips make a wallet.", why: "Wrong. One flip is one bit." },
            { k: "bad", t: "The same as the Lab Generate button, which uses the operating system.", why: "Wrong. These pad buttons are a classroom estimate. Lab Generate uses the operating system." }
          ]
        },
        {
          q: "If the pad is too weak, a complete-looking phrase is:",
          opts: [
            { k: "ok", t: "Still weak. An attacker has fewer guesses than a well-rolled phrase.", okwhy: "Correct. A short roll log can still print twelve words. That does not make it strong." },
            { k: "bad", t: "Safe to fund because the checksum passed.", why: "Wrong. Checksum only checks the format. It does not add missing rolls." },
            { k: "bad", t: "As strong as Lab Generate because both show 12 words.", why: "Wrong. Lab Generate uses the operating system. The pad is a classroom estimate." }
          ]
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

  function ppEstClass(pp) {
    if (!pp) return "v2-pp-est-empty";
    return "v2-pp-est-" + ppTier(estimatePassphraseBits(pp));
  }

  function paintPpEst(el, pp) {
    if (!el) return;
    el.className = "v2-pp-est " + ppEstClass(pp);
    el.textContent = pp ? ppBitsLabel(pp) : "(empty)";
  }

  function paintPpBar(id, pp) {
    var bar = $(id);
    if (!bar) return;
    var est = estimatePassphraseBits(pp);
    var raw = est == null ? "empty" : ppTier(est);
    var tier = raw === "stronger" ? "strong" : raw;
    var pct = est == null ? 0 : Math.min(100, Math.round((est / 128) * 100));
    bar.style.width = pct + "%";
    bar.setAttribute("aria-valuenow", String(Math.round(est || 0)));
    bar.className = "pp-strength-bar-fill pp-tier-" + tier;
  }

  function paintPpChars(el, pp) {
    if (!el) return;
    el.textContent = pp ? pp.length + " chars" : "0 chars";
  }

  function paintCmpEstimates() {
    var aEl = $("ppA");
    var bEl = $("ppB");
    if (!aEl && !bEl) return;
    var a = (aEl && aEl.value) || "";
    var b = (bEl && bEl.value) || "";
    paintPpChars($("v2PpCharsA"), a);
    paintPpChars($("v2PpCharsB"), b);
    paintPpEst($("v2PpEstA"), a);
    paintPpEst($("v2PpEstB"), b);
    paintPpBar("v2PpBarA", a);
    paintPpBar("v2PpBarB", b);
  }

  async function paintCmpAddresses() {
    if (!$("v2CmpTable") || !mem.mnemonic || !window.BIP39Lab) return;
    var seq = (mem.cmpSeq = (mem.cmpSeq || 0) + 1);
    var a = ($("ppA") && $("ppA").value) || "";
    var b = ($("ppB") && $("ppB").value) || "";
    ["v2CmpAddrA", "v2CmpAddrB"].forEach(function (id) {
      if ($(id)) $(id).textContent = "…";
    });
    var ra = await BIP39Lab.deriveAddresses(mem.mnemonic, a, { network: "test", count: 1 });
    var rb = await BIP39Lab.deriveAddresses(mem.mnemonic, b, { network: "test", count: 1 });
    if (seq !== mem.cmpSeq) return;
    var addrA = ra.rows[0].bip84_p2wpkh;
    var addrB = rb.rows[0].bip84_p2wpkh;
    var same = addrA === addrB;
    if ($("v2CmpAddrA")) $("v2CmpAddrA").textContent = addrA;
    if ($("v2CmpAddrB")) $("v2CmpAddrB").textContent = addrB;
    var verdict;
    if (same) {
      verdict = "Same receive address. A and B match — one vault.";
    } else {
      verdict = "Diverged — two wallets. Same words, different passphrases, different addresses.";
    }
    var vEl = $("v2CmpVerdict");
    if (vEl) {
      vEl.className = "v2-verdict " + (same ? "same" : "split");
      vEl.textContent = verdict;
    }
    var pause = $("v2Pause");
    if (pause && !same) pause.disabled = false;
  }

  function scheduleCmpAddresses() {
    paintCmpEstimates();
    if (mem.cmpTimer) clearTimeout(mem.cmpTimer);
    mem.cmpTimer = setTimeout(function () {
      paintCmpAddresses();
    }, 120);
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
      "<colgroup><col class=\"v2-ent-stack-c1\" /><col class=\"v2-ent-stack-c2\" /></colgroup>" +
      "<tr><th>Layer</th><th>Estimate</th></tr>" +
      "<tr><td>Dice / coin pad</td><td id=\"v2StackPad\">~" +
      bits +
      " bits" +
      (low ? ' <strong class="v2-ent-stack-low">TOO LOW</strong>' : ' <strong class="v2-ent-stack-ok">meets ' + n + "-word</strong>") +
      "</td></tr>" +
      "<tr><td>" +
      n +
      "-word BIP-39 wants</td><td id=\"v2StackNeed\">" +
      need +
      " bits (12→128 · 24→256)</td></tr>" +
      "<tr><td>Passphrase (25th)</td><td id=\"v2StackPp\">" +
      ppBitsLabel(pp) +
      "</td></tr>" +
      '<tr><td colspan="2" id="v2StackWhole">' +
      whole +
      "</td></tr>" +
      "</table>"
    );
  }

  function refreshEntStack() {
    if (!$("v2EntStack")) return;
    var bits = Math.round(entBits());
    var n = mem.entWordCount || 12;
    var need = entNeed();
    var low = padIsLow();
    var pp = mem.entPp || "";
    var pest = estimatePassphraseBits(pp);
    if ($("v2StackPad")) {
      $("v2StackPad").innerHTML =
        "~" +
        bits +
        " bits" +
        (low
          ? ' <strong class="v2-ent-stack-low">TOO LOW</strong>'
          : ' <strong class="v2-ent-stack-ok">meets ' + n + "-word</strong>");
    }
    if ($("v2StackNeed")) {
      $("v2StackNeed").textContent = need + " bits (12→128 · 24→256)";
    }
    if ($("v2StackPp")) $("v2StackPp").textContent = ppBitsLabel(pp);
    if ($("v2StackWhole")) {
      $("v2StackWhole").textContent = low
        ? "Whole picture: pad is still TOO LOW. A longer passphrase does not fix a short pad."
        : pest == null
          ? "Whole picture: pad meets " + n + "-word ENT on paper. Empty passphrase adds no extra secret."
          : "Whole picture: pad meets " +
            n +
            "-word on paper; passphrase is an extra vault secret (~" +
            (pest < 0.5 ? "<1" : Math.round(pest)) +
            " bits estimate). Still do not fund.";
    }
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
        teachBox(
          "Classroom — pad first",
          "<em>What it is:</em> dice/coin pad bits, then BIP-39 word count, then optional 25th word.<br/><em>Why:</em> a longer extra secret does not fix a TOO LOW pad.<br/><em>How:</em> the lock, bits, and practice words below are lab objects.",
          "v2Uc15Teach"
        ) +
        entButtonsHtml({ key: true, keyId: "v2PpKeyUc15Start" }) +
        entMintBarHtml() +
        pauseBtn("Next: add a 25th word", !mem.entMnemonic)
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
          '<label class="field" for="v2EntPp"><span class="label-row">Practice passphrase (up to 128 characters)</span>' +
          '<textarea id="v2EntPp" rows="3" maxlength="128" autocomplete="off" spellcheck="false" placeholder="try 1 character, then a longer phrase (64+ is fine)">' +
          attrEsc(mem.entPp) +
          "</textarea></label>" +
          '<p class="control-help" id="v2EntPpHint">Try a single letter (weak), then several mixed characters (fair / stronger). Length can go past 64.</p>' +
          '<p class="control-help" id="v2EntPpCount">' +
          (mem.entPp ? mem.entPp.length : 0) +
          " / 128</p>",
          "v2PpKeyUc15"
        ) +
        pauseBtn("I saw length change the extra secret", !(mem.entPp && mem.entPp.length))
      );
    }
    if (step === 2) {
      return quiz("A long extra secret on a TOO LOW dice pad means:", [
        {
          k: "ok",
          t: "The dice pad is still too weak. The extra secret does not replace rolling more dice.",
          okwhy: "Correct. Twelve words want about 128 bits of pad. Twenty-four want about 256. The extra secret is another vault secret, not extra dice."
        },
        {
          k: "bad",
          t: "Add the extra-secret estimate to the pad and you now have a 24-word wallet.",
          why: "Wrong. A short pad stays a short pad. You do not add the two estimates together."
        },
        {
          k: "bad",
          t: "The computer always stretches the pad to 512 bits, so few rolls are fine.",
          why: "Wrong. That 512 number is the size of the output file, not how random your few rolls were."
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
      '" id="v2MnemonicLine">English words only. Practice only. ' +
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
      "then turns those bits into practice recovery words. " +
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
      wireCopyQr(wrap);
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
      st("seed", "hidden number", "Words stretched into a hidden number (not the address)", !!litSeed) +
      '<span class="arr" aria-hidden="true">→</span>' +
      st("addr", "address", "Receive string from that seed", !!litAddr) +
      "</div>"
    );
  }

  function teachBox(title, body, id) {
    return (
      '<div class="v2-callout done"' +
      (id ? ' id="' + id + '"' : "") +
      "><strong>" +
      title +
      "</strong>" +
      body +
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
  function quizOptBtn(o, i, qi) {
    var extra = "";
    if (o.id) extra += ' id="' + o.id + '"';
    if (qi != null) extra += ' data-qi="' + qi + '"';
    return (
      '<button type="button" class="btn secondary" data-quiz="' +
      o.k +
      '"' +
      extra +
      ">" +
      (i + 1) +
      " · " +
      o.t +
      '<span class="v2-quiz-why" hidden>' +
      (o.k === "ok" ? o.okwhy || "Correct." : o.why || "Wrong. That is not what this track teaches.") +
      "</span></button>"
    );
  }

  function quiz(q, opts) {
    return pad(
      "<h2>Quiz</h2><p>" +
        q +
        "</p><div class=\"quiz-opts\">" +
        shuffleQuizOpts(opts)
          .map(function (o, i) {
            return quizOptBtn(o, i);
          })
          .join("") +
        '</div><div id="v2QuizMsg"></div>' +
        pauseBtn("Continue", true)
    );
  }

  function pathPurposeNow() {
    var p = mem.pathPurpose | 0;
    return p === 86 || p === 49 || p === 44 ? p : 84;
  }

  function pathRowField(purpose) {
    if (purpose === 86) return "bip86_p2tr";
    if (purpose === 49) return "bip49_p2sh_p2wpkh";
    if (purpose === 44) return "bip44_p2pkh";
    return "bip84_p2wpkh";
  }

  function pathPurposeTabsHtml() {
    var cur = pathPurposeNow();
    var items = [
      [86, "BIP86 · Taproot"],
      [84, "BIP84 · native"],
      [49, "BIP49 · nested"],
      [44, "BIP44 · legacy"]
    ];
    var tabs = items
      .map(function (it) {
        var on = it[0] === cur;
        return (
          '<button type="button" class="seg-tab' +
          (on ? " active" : "") +
          '" data-purpose="' +
          it[0] +
          '" aria-selected="' +
          (on ? "true" : "false") +
          '">' +
          it[1] +
          "</button>"
        );
      })
      .join("");
    return (
      '<div class="seg-block v2-path-purpose" id="v2PathPurpose">' +
      '<div class="seg-tabs" role="tablist" aria-label="BIP purpose folder">' +
      tabs +
      "</div></div>"
    );
  }

  function pathPlayTableHtml() {
    return (
      '<table class="compare-table v2-path-play" id="v2PathPlayTable" aria-label="Path levels">' +
      "<thead><tr><th>Level</th><th>Value now</th><th>What it means</th></tr></thead>" +
      "<tbody>" +
      "<tr><th scope=\"row\"><code>m</code></th><td>master</td><td>Root of this practice phrase</td></tr>" +
      "<tr><th scope=\"row\">purpose'</th><td id=\"v2PathCellPurpose\">84'</td><td id=\"v2PathCellPurposeWhy\">The ' means hardened (locked folder). BIP-84 native (bc1q / tb1q). A different BIP is a different pile of coins.</td></tr>" +
      "<tr><th scope=\"row\">coin_type'</th><td id=\"v2PathCellCoin\">1'</td><td>The ' means hardened. 1 = testnet paths in this track (0 would be mainnet).</td></tr>" +
      "<tr><th scope=\"row\">account'</th><td id=\"v2PathCellAccount\">0'</td><td>The ' means hardened. Account 0 is the usual first wallet slot.</td></tr>" +
      "<tr><th scope=\"row\">change</th><td id=\"v2PathCellChange\">0</td><td id=\"v2PathCellChangeWhy\">0 = receive · 1 = leftover change</td></tr>" +
      "<tr><th scope=\"row\">index</th><td id=\"v2PathCellIndex\">0</td><td>Which address in this folder</td></tr>" +
      "</tbody></table>"
    );
  }

  function paintPathPlayTable(purpose, change, index) {
    var why = {
      86: "The ' means hardened (locked folder). BIP-86 Taproot (bc1p / tb1p). Coins here are not on 84/49/44.",
      84: "The ' means hardened (locked folder). BIP-84 native (bc1q / tb1q). Coins here are not on 86/49/44.",
      49: "The ' means hardened (locked folder). BIP-49 nested (3… / 2…). Coins here are not on 86/84/44.",
      44: "The ' means hardened (locked folder). BIP-44 legacy (1… / m or n). Coins here are not on 86/84/49."
    };
    if ($("v2PathCellPurpose")) $("v2PathCellPurpose").textContent = purpose + "'";
    if ($("v2PathCellPurposeWhy")) $("v2PathCellPurposeWhy").textContent = why[purpose] || why[84];
    if ($("v2PathCellCoin")) $("v2PathCellCoin").textContent = "1'";
    if ($("v2PathCellAccount")) $("v2PathCellAccount").textContent = "0'";
    if ($("v2PathCellChange")) $("v2PathCellChange").textContent = String(change);
    if ($("v2PathCellChangeWhy")) {
      $("v2PathCellChangeWhy").textContent =
        change === 1 ? "1 = leftover change folder" : "0 = receive folder";
    }
    if ($("v2PathCellIndex")) $("v2PathCellIndex").textContent = String(index);
  }

  function pathBipSvgHtml() {
    return (
      '<figure class="v2-path-fig" id="v2PathFig">' +
      '<svg viewBox="0 0 560 200" width="100%" height="180" role="img" aria-label="BIP purpose folders from one phrase">' +
      '<text x="8" y="20" fill="currentColor" font-size="13" font-weight="700">phrase</text>' +
      '<text x="78" y="20" fill="#8b9bb0" font-size="13">→ seed</text>' +
      '<line x1="28" y1="28" x2="28" y2="188" stroke="#2a3545" stroke-width="2" />' +
      '<rect x="48" y="36" width="480" height="30" rx="6" fill="#1c2533" stroke="#2a3545" />' +
      '<text x="60" y="56" fill="#8b9bb0" font-size="13">m/44h/…  1…  legacy</text>' +
      '<rect x="48" y="74" width="480" height="30" rx="6" fill="#1c2533" stroke="#2a3545" />' +
      '<text x="60" y="94" fill="#8b9bb0" font-size="13">m/49h/…  3…  nested</text>' +
      '<rect x="48" y="112" width="480" height="30" rx="6" fill="rgba(61,139,253,0.18)" stroke="#3d8bfd" />' +
      '<text x="60" y="132" fill="currentColor" font-size="13" font-weight="700">m/84h/…  bc1q / tb1q  native segwit · this track</text>' +
      '<rect x="48" y="150" width="480" height="30" rx="6" fill="#1c2533" stroke="#2a3545" />' +
      '<text x="60" y="170" fill="#8b9bb0" font-size="13">m/86h/…  bc1p  taproot</text>' +
      "</svg>" +
      '<figcaption class="control-help">Same words. Different BIP = different address shape. Receive is change=0; change chain is 1.</figcaption>' +
      "</figure>"
    );
  }

  function woPurposeNow() {
    var p = mem.woPurpose | 0;
    return [84, 86, 49, 44].indexOf(p) >= 0 ? p : 86;
  }

  function woTypeTabsHtml() {
    var cur = woPurposeNow();
    var items = [
      [86, "BIP86 · Taproot"],
      [84, "BIP84 · native"],
      [49, "BIP49 · nested"],
      [44, "BIP44 · legacy"]
    ];
    var tabs = items
      .map(function (it) {
        var on = it[0] === cur;
        return (
          '<button type="button" class="seg-tab' +
          (on ? " active" : "") +
          '" data-wo-type="' +
          it[0] +
          '" aria-selected="' +
          (on ? "true" : "false") +
          '">' +
          it[1] +
          "</button>"
        );
      })
      .join("");
    return (
      '<div class="seg-block v2-wo-type" id="v2WoType">' +
      '<div class="seg-tabs" role="tablist" aria-label="Watch-only key type one at a time">' +
      tabs +
      "</div></div>"
    );
  }

  function woHelpText(p) {
    if (p === 86) return "BIP86 xpub — Taproot account public key (watch-only where supported).";
    if (p === 49) return "BIP49 ypub — nested segwit account (older wallets).";
    if (p === 44) return "BIP44 xpub — legacy P2PKH account public key.";
    return "BIP84 zpub — usual Sparrow / mobile watch-only import for native segwit.";
  }

  function paintWoFromPack(pack) {
    if (!pack) return;
    var p = woPurposeNow();
    if ($("v2WoHelp")) $("v2WoHelp").textContent = woHelpText(p);
    var keys = (pack.keys || []).filter(function (k) { return Number(k.purpose) === p; });
    var k = keys[0];
    if ($("v2WoOut")) {
      $("v2WoOut").textContent = k ? k.key : "";
      $("v2WoOut").hidden = true;
    }
    var list = $("v2WoList");
    if (list) {
      list.innerHTML = k ? copyQrRowHtml(k.label, k.key) : "";
      wireCopyQr(list);
    }
    paintDescFromPack(pack);
  }

  function paintDescFromPack(pack) {
    if (!pack || !window.BIP39Lab || !BIP39Lab.descriptorsFromWatchOnly) return;
    var p = woPurposeNow();
    var desc = BIP39Lab.descriptorsFromWatchOnly(pack, "main");
    var rows = ((desc && desc.descriptors) || []).filter(function (d) {
      return Number(d.purpose) === p;
    });
    var block = rows.map(function (d) {
      return d.label + "\n" + d.descriptor + (d.note ? "\n(" + d.note + ")" : "");
    }).join("\n\n");
    if ($("v2DescOut")) {
      $("v2DescOut").textContent = block || "No descriptor for this BIP tab.";
    }
  }

  function copyQrRowHtml(label, value) {
    if (!value) return "";
    return (
      '<div class="v2-copy-row">' +
      '<span class="v2-copy-lab">' +
      label +
      "</span>" +
      '<code class="v2-copy-val">' +
      value +
      "</code>" +
      '<button type="button" class="btn secondary btn-sm" data-copy="' +
      attrEsc(value) +
      '">Copy viewing key</button>' +
      '<button type="button" class="btn secondary btn-sm" data-qr="' +
      attrEsc(value) +
      '" data-qr-label="' +
      attrEsc(label) +
      '">QR</button></div>'
    );
  }

  function quizBank(items) {
    return pad(
      "<h2>Quiz</h2><p class=\"control-help\">Answer every question. Continue unlocks when each has the right sentence.</p>" +
        items
          .map(function (item, qi) {
            return (
              '<div class="v2-quiz-q" data-qi="' +
              qi +
              '"><p><strong>' +
              (qi + 1) +
              " · </strong>" +
              item.q +
              "</p><div class=\"quiz-opts\">" +
              shuffleQuizOpts(item.opts)
                .map(function (o, i) {
                  return quizOptBtn(o, i, qi);
                })
                .join("") +
              "</div></div>"
            );
          })
          .join("") +
        '<div id="v2QuizMsg"></div>' +
        pauseBtn("Continue", true)
    );
  }

  function finishHtml(id) {
    var t = TRACKS.filter(function (x) { return x.id === id; })[0];
    var pid = pathFor(id);
    var nid = nextInPath(pid);
    if (nid === id) {
      var p = PATHS.filter(function (x) { return x.id === pid; })[0];
      var done = completedSet().concat([id]);
      nid = null;
      if (p) {
        var i;
        for (i = 0; i < p.ids.length; i++) {
          if (done.indexOf(p.ids[i]) < 0) {
            nid = p.ids[i];
            break;
          }
        }
      }
    }
    var next = nid ? TRACKS.filter(function (x) { return x.id === nid; })[0] : null;
    return pad(
      "<h2>Finish</h2>" +
      callout("isnt", id === 20 ? "Do not photograph the plate" : "Do not send coins", "This is practice. Then you may open the next track.") +
      '<label class="check"><input type="checkbox" id="v2Exit"/> ' +
      (id === 20 ? "I will not photograph the plate" : "I will not send coins to these addresses") +
      "</label>" +
      '<div class="row"><button type="button" class="btn" id="v2Finish" disabled>Mark ' +
      (t ? t.title : "track") +
      " done</button></div>" +
      (next ? '<p class="control-help">Next: ' + next.title + "</p>" : "<p>All listed tracks done.</p>")
    );
  }
  function addrTypeMeta() {
    return {
      bip86: { label: "BIP86 · Taproot", field: "bip86_p2tr", kicker: "BIP86 Taproot (bc1p / tb1p)" },
      bip84: { label: "BIP84 · native", field: "bip84_p2wpkh", kicker: "BIP84 native (bc1q / tb1q)" },
      bip49: { label: "BIP49 · nested", field: "bip49_p2sh_p2wpkh", kicker: "BIP49 nested (3… / 2…)" },
      bip44: { label: "BIP44 · legacy", field: "bip44_p2pkh", kicker: "BIP44 legacy (1… / m or n)" }
    };
  }

  function currentAddrType() {
    var t = mem.addrType || "bip84";
    return addrTypeMeta()[t] ? t : "bip84";
  }

  function addrTypeTabsHtml() {
    var cur = currentAddrType();
    var meta = addrTypeMeta();
    var keys = ["bip86", "bip84", "bip49", "bip44"];
    var tabs = keys
      .map(function (k) {
        var on = k === cur;
        return (
          '<button type="button" class="seg-tab' +
          (on ? " active" : "") +
          '" role="tab" aria-selected="' +
          (on ? "true" : "false") +
          '" data-addr-type="' +
          k +
          '">' +
          meta[k].label +
          "</button>"
        );
      })
      .join("");
    return (
      '<div class="seg-block v2-addr-type" id="v2AddrType">' +
      '<div class="seg-tabs" role="tablist" aria-label="Address type one at a time">' +
      tabs +
      "</div></div>"
    );
  }

  function addrHtml() {
    if (!mem.lastRows || !mem.lastRows.length) {
      return '<p class="control-help">No addresses yet.</p>';
    }
    var type = currentAddrType();
    var field = addrTypeMeta()[type].field;
    var cells = mem.lastRows.map(function (r) {
      var addr = r[field] || "";
      return (
        '<div class="cell">' +
        '<span class="idx nav-step" aria-label="index ' +
        r.index +
        '">#' +
        r.index +
        "</span>" +
        '<span class="addr-text">' +
        addr +
        "</span>" +
        '<span class="v2-cell-act">' +
        '<button type="button" class="btn secondary btn-sm" data-copy="' +
        attrEsc(addr) +
        '">Copy address</button>' +
        '<button type="button" class="btn secondary btn-sm" data-qr="' +
        attrEsc(addr) +
        '" data-qr-label="Receive #' +
        r.index +
        '">QR</button>' +
        "</span></div>"
      );
    }).join("");
    return (
      '<p class="v2-addr-kicker" id="v2AddrKicker">Receive addresses from this seed (' +
      addrTypeMeta()[type].kicker +
      " · " +
      (currentNet() === "main" ? "mainnet" : "test") +
      ").</p>" +
      '<div class="v2-addr-grid" id="v2AddrGrid">' +
      cells +
      "</div>"
    );
  }

  function copyText(text, btn) {
    if (!text) return;
    var ok = false;
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-999px";
      document.body.appendChild(ta);
      ta.select();
      ok = document.execCommand("copy");
      document.body.removeChild(ta);
    } catch (e) {
      ok = false;
    }
    if (!ok && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function () {});
      ok = true;
    }
    if (btn) {
      var idle = btn.getAttribute("data-copy-idle") || btn.textContent || "Copy";
      btn.setAttribute("data-copy-idle", idle);
      btn.textContent = ok ? "Copied" : "Failed";
      window.setTimeout(function () {
        btn.textContent = idle;
      }, 1600);
    }
  }

  function hideV2Qr() {
    var m = $("v2QrModal");
    if (!m) return;
    m.hidden = true;
    var img = $("v2QrImg");
    if (img) img.removeAttribute("src");
  }

  async function showV2Qr(text, label) {
    var m = $("v2QrModal");
    if (!m || !text) return;
    var B = window.BIP39Lab;
    if (!B || typeof B.qrDataUrl !== "function") return;
    var url = await B.qrDataUrl(text, { width: 220 });
    $("v2QrLabel").textContent = label || "QR";
    $("v2QrText").textContent = text;
    $("v2QrImg").src = url;
    m.hidden = false;
  }

  function wireCopyQr(root) {
    root = root || document;
    root.querySelectorAll("[data-copy]").forEach(function (btn) {
      if (btn.getAttribute("data-wired") === "1") return;
      btn.setAttribute("data-wired", "1");
      btn.addEventListener("click", function () {
        copyText(btn.getAttribute("data-copy") || "", btn);
      });
    });
    root.querySelectorAll("[data-qr]").forEach(function (btn) {
      if (btn.getAttribute("data-wired") === "1") return;
      btn.setAttribute("data-wired", "1");
      btn.addEventListener("click", function () {
        showV2Qr(btn.getAttribute("data-qr") || "", btn.getAttribute("data-qr-label") || "QR").catch(
          console.error
        );
      });
    });
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
        if (regenBtn) regenBtn.textContent = "Generate " + mem.wordCount + "-word phrase";
        var genLab = $("v2Generate");
        if (genLab && /word phrase/.test(genLab.textContent || "")) {
          genLab.textContent = "Generate " + mem.wordCount + "-word phrase";
        }
        if (!mem.mnemonic && ($("v2OsEnt") || $("v2Entropy"))) replaceOsEntropy();
      });
    }
    if ($("v2PpExGen")) {
      $("v2PpExGen").addEventListener("click", async function () {
        var v = await refreshPpExample();
        var el = $("v2PpEx");
        if (el) el.textContent = v;
      });
    }
    var gen = $("v2Generate");
    if (gen) gen.addEventListener("click", async function () {
      var n = parseInt(($("v2WordCount") && $("v2WordCount").value) || String(mem.wordCount || 12), 10);
      mem.wordCount = n;
      mem.mnemonic = await BIP39Lab.generateMnemonic(n);
      mem.lastRows = null;
      mem.cardAck = false;
      var cardEl = $("v2Card");
      if (cardEl) cardEl.innerHTML = wordGridHtml(mem.mnemonic);
      if (typeof replaceOsEntropy === "function") replaceOsEntropy();
      var aw = $("v2AddrWrap");
      if (aw && current.id !== 19) {
        aw.innerHTML = "";
        aw.classList.add("v2-hidden");
      }
      if (current.id === 2 || current.id === 3) {
        mem.cardAck = false;
        renderTrack();
        return;
      }
      if (current.id === 16 || current.id === 19) {
        await deriveNow();
        if (mem.lastRows && mem.lastRows[0]) {
          mem.restoreAddr = mem.lastRows[0].bip84_p2wpkh || "";
        }
        if (aw && current.id === 19) aw.classList.remove("v2-hidden");
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
    var pasteBtn = $("v2PasteApply");
    if (pasteBtn) {
      pasteBtn.addEventListener("click", async function () {
        var ta = $("v2PasteMn");
        var msg = $("v2PasteMsg");
        var raw = ((ta && ta.value) || "").trim().replace(/\s+/g, " ");
        var words = raw ? raw.split(" ") : [];
        var n = words.length;
        var okLen = n === 12 || n === 15 || n === 18 || n === 21 || n === 24;
        var valid = false;
        if (okLen && window.BIP39Lab && BIP39Lab.validateMnemonic) {
          valid = !!(await BIP39Lab.validateMnemonic(raw));
        }
        if (!valid) {
          if (msg) {
            msg.className = "msg-bad";
            msg.textContent = "That is not a valid English BIP-39 phrase. Generate practice words instead. Do not paste a funded backup.";
          }
          return;
        }
        mem.mnemonic = raw;
        mem.wordCount = n;
        mem.lastRows = null;
        mem.cardAck = false;
        var cardEl = $("v2Card");
        if (cardEl) cardEl.innerHTML = wordGridHtml(mem.mnemonic);
        if (msg) {
          msg.className = "control-help";
          msg.textContent = "Pasted practice words loaded. Do not import a funded phrase.";
        }
        if (pause) pause.disabled = false;
      });
    }
    var typeRoot = $("v2AddrType");
    if (typeRoot) {
      typeRoot.querySelectorAll("[data-addr-type]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          mem.addrType = btn.getAttribute("data-addr-type") || "bip84";
          typeRoot.querySelectorAll("[data-addr-type]").forEach(function (b) {
            var on = b.getAttribute("data-addr-type") === mem.addrType;
            b.classList.toggle("active", on);
            b.setAttribute("aria-selected", on ? "true" : "false");
          });
          var wrap = $("v2AddrWrap");
          if (wrap && mem.lastRows && mem.lastRows.length) {
            wrap.innerHTML = addrHtml();
            wrap.classList.remove("v2-hidden");
            wireCopyQr(wrap);
          }
        });
      });
    }
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
    if ($("v2EntToLab")) {
      $("v2EntToLab").addEventListener("click", function () {
        var m = (mem.entMnemonic || "").trim();
        var labNote = $("v2EntToLabNote");
        if (!m) {
          if (labNote) labNote.textContent = "Build practice words from the pad first.";
          return;
        }
        if (!confirm(
          "Put these PRACTICE words on First wallet?\n\n" +
            "• They stay TEST DATA only — never fund them\n" +
            "• Overwrites whatever is currently in First wallet\n\n" +
            "Use this only to keep experimenting offline (derive, restore drills)."
        )) {
          return;
        }
        mem.mnemonic = m;
        mem.lastRows = null;
        if (labNote) {
          labNote.textContent = "First wallet holds PRACTICE pad words (TEST DATA). Do not fund this phrase.";
        }
        setGated(1);
        startTrack(1);
      });
    }
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
        var v = ppIn.value || "";
        if (v.length > 128) {
          v = v.slice(0, 128);
          ppIn.value = v;
        }
        mem.entPp = v;
        refreshEntStack();
        var cnt = $("v2EntPpCount");
        if (cnt) cnt.textContent = v.length + " / 128";
        if (pause) pause.disabled = !v.length;
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
      regen.textContent = "Generate " + n + "-word phrase";
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
    if ($("v2CmpTable")) scheduleCmpAddresses();
    var idx = $("v2Idx");
    var idxZero = $("v2IdxZero");
    if (idx) {
      idx.setAttribute("data-i", "0");
      async function applyPathIndex(i) {
        i = Math.max(0, Math.min(19, i | 0));
        idx.setAttribute("data-i", String(i));
        var ch = $("v2Change") ? parseInt($("v2Change").getAttribute("data-change") || "0", 10) : 0;
        if (ch !== 0 && ch !== 1) ch = 0;
        var purpose = pathPurposeNow();
        var field = pathRowField(purpose);
        var path = BIP39Lab.formatPath(purpose, "test", 0, ch, i);
        $("v2PathLine").textContent = path;
        paintPathPlayTable(purpose, ch, i);
        mem.pathTouched = i > 0 || ch === 1;
        idx.textContent =
          i >= 19
            ? "Last folder in this demo"
            : "Change folder · next address";
        var r = await BIP39Lab.deriveAddresses(mem.mnemonic, "", { network: "test", count: i + 1, change: ch });
        var row = r.rows[i] || r.rows[r.rows.length - 1];
        var a = (row && row[field]) || "";
        $("v2Tail").textContent =
          (ch ? "Change" : "Receive") + " index " + i + "  ·  " + a;
        var amtEl = $("v2FolderAmt");
        if (amtEl) amtEl.textContent = folderTeachBtc(ch, i, purpose) + " BTC";
        if ($("v2RcPair")) {
          var rRecv = ch === 0 ? r : await BIP39Lab.deriveAddresses(mem.mnemonic, "", { network: "test", count: i + 1, change: 0 });
          var rChg = ch === 1 ? r : await BIP39Lab.deriveAddresses(mem.mnemonic, "", { network: "test", count: i + 1, change: 1 });
          var recvA = ((rRecv.rows[i] || rRecv.rows[rRecv.rows.length - 1]) || {})[field] || "";
          var chgA = ((rChg.rows[i] || rChg.rows[rChg.rows.length - 1]) || {})[field] || "";
          if ($("v2RcPath0")) $("v2RcPath0").textContent = BIP39Lab.formatPath(purpose, "test", 0, 0, i);
          if ($("v2RcPath1")) $("v2RcPath1").textContent = BIP39Lab.formatPath(purpose, "test", 0, 1, i);
          if ($("v2RcAddr0")) $("v2RcAddr0").textContent = recvA;
          if ($("v2RcAddr1")) $("v2RcAddr1").textContent = chgA;
          if ($("v2RcAmt0")) $("v2RcAmt0").textContent = folderTeachBtc(0, i, purpose) + " BTC";
          if ($("v2RcAmt1")) $("v2RcAmt1").textContent = folderTeachBtc(1, i, purpose) + " BTC";
          if ($("v2RcSum")) {
            $("v2RcSum").textContent =
              addTeachBtc(folderTeachBtc(0, i, purpose), folderTeachBtc(1, i, purpose)) + " BTC";
          }
          if ($("v2RcRecv")) $("v2RcRecv").classList.toggle("is-on", ch === 0);
          if ($("v2RcChg")) $("v2RcChg").classList.toggle("is-on", ch === 1);
        }
        if (pause && mem.pathTouched) pause.disabled = false;
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
      var purposeRoot = $("v2PathPurpose");
      if (purposeRoot) {
        purposeRoot.querySelectorAll("[data-purpose]").forEach(function (btn) {
          btn.addEventListener("click", function () {
            mem.pathPurpose = parseInt(btn.getAttribute("data-purpose") || "84", 10) || 84;
            purposeRoot.querySelectorAll("[data-purpose]").forEach(function (b) {
              var on = parseInt(b.getAttribute("data-purpose"), 10) === mem.pathPurpose;
              b.classList.toggle("active", on);
              b.setAttribute("aria-selected", on ? "true" : "false");
            });
            var cur = parseInt(idx.getAttribute("data-i") || "0", 10);
            applyPathIndex(cur).catch(console.error);
          });
        });
      }
      var chBtn = $("v2Change");
      if (chBtn) {
        chBtn.addEventListener("click", function () {
          var ch = parseInt(chBtn.getAttribute("data-change") || "0", 10) ? 0 : 1;
          chBtn.setAttribute("data-change", String(ch));
          chBtn.textContent = ch
            ? "Show receive folder"
            : "Show change folder";
          var cur = parseInt(idx.getAttribute("data-i") || "0", 10);
          applyPathIndex(cur).catch(console.error);
        });
      }
    }
    async function ensureWoPack() {
      if (!mem.mnemonic || !window.BIP39Lab || !BIP39Lab.exportWatchOnly) return null;
      if (!mem.woPack) {
        mem.woPack = await BIP39Lab.exportWatchOnly(mem.mnemonic, "", { network: "main", account: 0 });
      }
      return mem.woPack;
    }
    var wo = $("v2Wo");
    if (wo) wo.addEventListener("click", async function () {
      await ensureWoPack();
      paintWoFromPack(mem.woPack);
    });
    var woType = $("v2WoType");
    if (woType) {
      woType.querySelectorAll("[data-wo-type]").forEach(function (btn) {
        btn.addEventListener("click", async function () {
          mem.woPurpose = parseInt(btn.getAttribute("data-wo-type") || "86", 10) || 86;
          woType.querySelectorAll("[data-wo-type]").forEach(function (b) {
            var on = parseInt(b.getAttribute("data-wo-type"), 10) === mem.woPurpose;
            b.classList.toggle("active", on);
            b.setAttribute("aria-selected", on ? "true" : "false");
          });
          await ensureWoPack();
          paintWoFromPack(mem.woPack);
        });
      });
      ensureWoPack().then(function (pack) {
        if (pack) paintWoFromPack(pack);
      }).catch(console.error);
    }
    var descBtn = $("v2DescRefresh");
    if (descBtn) {
      descBtn.addEventListener("click", async function () {
        await ensureWoPack();
        paintDescFromPack(mem.woPack);
      });
    }
    var xp = $("v2Xpub");
    if (xp) xp.addEventListener("click", async function () {
      var pack = await BIP39Lab.exportWatchOnly(mem.mnemonic, "", { network: "main" });
      var k = (pack.keys || []).filter(function (x) { return x.purpose === 84; })[0] || pack.keys[0];
      $("v2XpubOut").textContent = k.label + "\n" + k.key + "\n(no xprv)";
      var xl = $("v2XpubList");
      if (xl) {
        xl.innerHTML = copyQrRowHtml(k.label, k.key);
        wireCopyQr(xl);
      }
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
    if ($("v2MsPolicy")) paintMsPolicy();
    [0, 1, 2].forEach(function (i) {
      var sel = $("v2CsWc" + i);
      if (sel) {
        sel.addEventListener("change", function () {
          if (!mem.cosigners) mem.cosigners = emptyCosigners();
          mem.cosigners[i].wordCount = parseInt(sel.value, 10) || 12;
        });
      }
    });
    function paintTone(el, kind) {
      if (!el) return;
      var base = String(el.className || "")
        .replace(/\bmsg-ok\b/g, "")
        .replace(/\bmsg-bad\b/g, "")
        .replace(/\bmsg-warn\b/g, "")
        .replace(/\s+/g, " ")
        .trim();
      if (kind === "ok") el.className = base + " msg-ok";
      else if (kind === "bad") el.className = base + " msg-bad";
      else if (kind === "warn") el.className = base + " msg-warn";
      else el.className = base;
    }
    function utf8DecodeU8(u8) {
      try {
        if (typeof TextDecoder !== "undefined") return new TextDecoder("utf-8").decode(u8);
      } catch (e) { /* fall through */ }
      var s = "";
      var i;
      for (i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
      return s;
    }
    function readShamirMN() {
      var sel = $("v2ShMN");
      var raw = sel && sel.value ? String(sel.value) : "2/3";
      var parts = raw.split("/");
      var m = parseInt(parts[0], 10) || 2;
      var n = parseInt(parts[1], 10) || 3;
      mem.shamirMN = { m: m, n: n };
      return mem.shamirMN;
    }
    var shp = $("v2ShPhrase");
    if (shp) {
      shp.addEventListener("click", async function () {
        mem.shamirMnemonic = await BIP39Lab.generateMnemonic(12);
        mem.shamirShares = null;
        mem.shamirDone = false;
        var card = $("v2ShCard");
        if (card) card.innerHTML = wordGridHtml(mem.shamirMnemonic, "v2ShWordGrid");
        var splitBtn = $("v2Sh");
        if (splitBtn) splitBtn.disabled = false;
        var comb0 = $("v2ShCombine");
        if (comb0) comb0.disabled = true;
        var try0 = $("v2ShTry");
        if (try0) try0.disabled = true;
        var box0 = $("v2ShRecombineIn");
        if (box0) box0.value = "";
        var story0 = $("v2ShStory");
        if (story0) {
          story0.innerHTML =
            "<strong>Classroom — what this split is</strong>These twelve words are the secret on this pad. Split will cut them into hex pieces. The result box will hold share lines only.";
        }
        var sout = $("v2ShOut");
        if (sout) {
          paintTone(sout, "");
          sout.textContent =
            "Not split yet. Click Split these words into shares — stay here.";
        }
        if (pause) pause.disabled = true;
      });
    }
    var shmn = $("v2ShMN");
    if (shmn) {
      shmn.addEventListener("change", function () {
        readShamirMN();
      });
    }
    var sh = $("v2Sh");
    if (sh) sh.addEventListener("click", function () {
      var out = $("v2ShOut");
      if (!window.ShamirLab) {
        if (out) out.textContent = "ShamirLab missing.";
        return;
      }
      var phrase = String(mem.shamirMnemonic || "").trim();
      if (!phrase) {
        if (out) out.textContent = "Generate a practice phrase first.";
        return;
      }
      var mn = readShamirMN();
      var u8 = ShamirLab.utf8Encode(phrase);
      var shares = ShamirLab.splitSecret(u8, mn.m, mn.n);
      mem.shamirSecret = ShamirLab.toHex(u8);
      mem.shamirShares = shares;
      mem.shamirDone = false;
      var story = $("v2ShStory");
      if (story) {
        story.innerHTML =
          "<strong>Classroom — what this split is</strong>" +
          "Built from the twelve words still on this pad (not a new screen).<br/>" +
          "<em>What it is:</em> one practice BIP-39 phrase cut into " +
          mn.n +
          " classroom hex shares.<br/>" +
          "<em>Why:</em> any " +
          mn.m +
          " of those " +
          mn.n +
          " rebuild the same words. Lose too many pieces and the phrase is gone.<br/>" +
          "<em>When / where:</em> recovery of ONE secret. Not UC6 (three keys). A share cannot sign a bitcoin spend.<br/>" +
          "<em>How:</em> this tab encoded the words as bytes and Shamir-split them (GF(256) lab). That is not SLIP-39.";
      }
      if (out) {
        paintTone(out, "");
        out.textContent = [
          "Phrase starts: " + phrase.split(/\s+/).slice(0, 3).join(" ") + " …",
          shares.map(ShamirLab.encodeShare).join("\n"),
          "Next: Combine any M, or paste M lines below and Try these M shares. Never fund. Not Trezor Suite."
        ].join("\n");
      }
      var box = $("v2ShRecombineIn");
      if (box) box.value = shares.map(ShamirLab.encodeShare).join("\n");
      var comb = $("v2ShCombine");
      if (comb) comb.disabled = false;
      var tryb = $("v2ShTry");
      if (tryb) tryb.disabled = false;
      if (pause) pause.disabled = true;
    });
    var shc = $("v2ShCombine");
    if (shc) shc.addEventListener("click", function () {
      var out = $("v2ShOut");
      if (!window.ShamirLab || !mem.shamirShares || !mem.shamirMnemonic) {
        if (out) out.textContent = "Split into shares first.";
        return;
      }
      var need = (mem.shamirMN && mem.shamirMN.m) || 2;
      var rec = ShamirLab.combineShares(mem.shamirShares.slice(0, need));
      var words = utf8DecodeU8(rec).trim();
      var match = words === String(mem.shamirMnemonic).trim();
      if (out) {
        paintTone(out, match ? "ok" : "bad");
        out.textContent = [
          "Combined any " + need + " of " + ((mem.shamirMN && mem.shamirMN.n) || 3) + ".",
          "Recovered words: " + words,
          "Match original phrase: " + match,
          "Educational hex. Not SLIP-39 Suite. A share cannot sign."
        ].join("\n");
      }
      mem.shamirDone = !!match;
      if (pause) pause.disabled = !mem.shamirDone;
    });
    var shTry = $("v2ShTry");
    if (shTry) {
      shTry.addEventListener("click", function () {
        var tout = $("v2ShTryOut");
        var box = $("v2ShRecombineIn");
        if (!window.ShamirLab || !mem.shamirMnemonic) {
          if (tout) tout.textContent = "Generate and split first.";
          return;
        }
        var need = (mem.shamirMN && mem.shamirMN.m) || 2;
        var raw = box && box.value ? String(box.value) : "";
        var lines = raw.split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean);
        if (lines.length < need) {
          if (tout) {
            paintTone(tout, "bad");
            tout.textContent =
              "Need at least " + need + " share lines. You pasted " + lines.length + ". Recovery failed — that is honest.";
          }
          return;
        }
        var parsed = [];
        var i;
        try {
          for (i = 0; i < lines.length; i++) parsed.push(ShamirLab.parseShare(lines[i]));
        } catch (e) {
          if (tout) {
            paintTone(tout, "bad");
            tout.textContent =
              "Could not read a share line (" +
              (e && e.message ? e.message : e) +
              "). Format is share:<index>:<hex>. Recovery failed — that is honest.";
          }
          return;
        }
        try {
          var rec = ShamirLab.combineShares(parsed.slice(0, Math.max(need, parsed.length)));
          var words = utf8DecodeU8(rec).trim();
          var match = words === String(mem.shamirMnemonic).trim();
          if (tout) {
            paintTone(tout, match ? "ok" : "bad");
            tout.textContent = [
              "Tried " + parsed.length + " pasted share(s); threshold M=" + need + ".",
              "Recovered words: " + words,
              "Match original phrase: " + match,
              match
                ? "These pieces rebuild the phrase on this pad."
                : "These pieces did not rebuild the phrase. Try a different M of the printed shares.",
              "Educational hex. Not SLIP-39. A share cannot sign."
            ].join("\n");
          }
          if (match) {
            mem.shamirDone = true;
            if (pause) pause.disabled = false;
          }
        } catch (e2) {
          if (tout) {
            paintTone(tout, "bad");
            tout.textContent =
              "Combine failed (" +
              (e2 && e2.message ? e2.message : e2) +
              "). That is honest — not a fake secret.";
          }
        }
      });
    }
    var s39b = $("v2S39");
    if (s39b) {
      s39b.addEventListener("click", function () {
        var out = $("v2S39Out");
        if (!window.Slip39Lab || typeof Slip39Lab.splitSingleGroup !== "function") {
          if (out) out.textContent = "Slip39Lab missing. Open the SLIP-39 room.";
          return;
        }
        var hex = Slip39Lab.randomMasterHex(16);
        var shares = Slip39Lab.splitSingleGroup(hex, 2, 3, "");
        mem.slip39Hex = hex;
        mem.slip39Shares = shares;
        mem.slip39Done = false;
        mem.slip39TriedOne = false;
        mem.slip39TriedTwo = false;
        mem.slip39PpDone = false;
        if (out) {
          paintTone(out, "");
          out.textContent = [
            "Master hex (practice): " + hex,
            shares.map(function (line, i) { return "share " + (i + 1) + ": " + line; }).join("\n"),
            "Copy any two into the boxes (already filled). Try 1 (fail) then 2 (match)."
          ].join("\n");
        }
        var si;
        for (si = 0; si < 3; si++) {
          var el = $("v2S39s" + si);
          if (el) el.value = shares[si] || "";
        }
        var c = $("v2S39Combine");
        if (c) c.disabled = false;
        var try39 = $("v2S39Try");
        if (try39) try39.disabled = false;
        if (pause) pause.disabled = true;
        var chk = $("v2S39Check");
        if (chk) chk.innerHTML = slip39CheckHtml();
      });
    }
    var s39c = $("v2S39Combine");
    if (s39c) {
      s39c.addEventListener("click", function () {
        var out = $("v2S39Out");
        if (!window.Slip39Lab || !mem.slip39Shares || !mem.slip39Hex) {
          if (out) out.textContent = "Make practice SLIP-39 shares first.";
          return;
        }
        var rec = Slip39Lab.combineShares(mem.slip39Shares.slice(0, 2), "");
        var ok = Slip39Lab.matchExpected(rec, mem.slip39Hex);
        if (out) {
          paintTone(out, ok ? "ok" : "bad");
          out.textContent = [
            "Combined 2 of 3 SLIP-39 word shares.",
            "Recovered master hex: " + rec,
            "Match: " + ok,
            "Practice only. Not a funded Trezor restore. Open the SLIP-39 room for passphrase/groups."
          ].join("\n");
        }
        mem.slip39Done = !!ok;
        if (ok) mem.slip39TriedTwo = true;
        var chk = $("v2S39Check");
        if (chk) chk.innerHTML = slip39CheckHtml();
        if (pause) pause.disabled = !(mem.slip39TriedOne && mem.slip39TriedTwo);
      });
    }
    var s39Try = $("v2S39Try");
    if (s39Try) {
      s39Try.addEventListener("click", function () {
        var tout = $("v2S39TryOut");
        if (!window.Slip39Lab || !mem.slip39Hex) {
          if (tout) tout.textContent = "Make practice SLIP-39 shares first.";
          return;
        }
        var picked = [];
        var j;
        for (j = 0; j < 3; j++) {
          var t = $("v2S39s" + j);
          var line = t && t.value ? String(t.value).trim().replace(/\s+/g, " ") : "";
          if (line) picked.push(line);
        }
        if (picked.length < 2) {
          mem.slip39TriedOne = true;
          if (tout) {
            paintTone(tout, "bad");
            tout.textContent =
              "Need any 2 of the 3 SLIP-39 word lists. You filled " +
              picked.length +
              ". Recovery failed — that is honest. The hex is not rebuilt. Extra secret would not save a single list.";
          }
          var chk1 = $("v2S39Check");
          if (chk1) chk1.innerHTML = slip39CheckHtml();
          if (pause) pause.disabled = !(mem.slip39TriedOne && mem.slip39TriedTwo);
          return;
        }
        try {
          if (picked.length >= 3) {
            var rec3 = Slip39Lab.combineShares(picked.slice(0, 2), "");
            var ok3 = Slip39Lab.matchExpected(rec3, mem.slip39Hex);
            if (tout) {
              paintTone(tout, ok3 ? "warn" : "bad");
              tout.textContent = ok3
                ? [
                    "These three lists are correct — they are the full 2-of-3 backup (practice hex " + rec3 + ").",
                    "That is not the exercise. The exercise is to provide only 2 shares: clear one box and Try these 2 shares.",
                    "Any two of the three should rebuild. Combine any 2 of 3 is the shortcut.",
                    "SLIP-39 shares, not BIP-39 seeds. Lab only. Never fund."
                  ].join("\n")
                : [
                    "You filled all three lists, but they are not the practice shares.",
                    "Match practice hex: false. That is honest — not a fake secret."
                  ].join("\n");
            }
            return;
          }
          var rec = Slip39Lab.combineShares(picked.slice(0, 2), "");
          var ok = Slip39Lab.matchExpected(rec, mem.slip39Hex);
          if (tout) {
            paintTone(tout, ok ? "ok" : "bad");
            tout.textContent = [
              "Tried exactly 2 SLIP-39 share lists (the 2-of-3 exercise).",
              "Recovered master hex: " + rec,
              "Match practice hex: " + ok,
              ok
                ? "Those two people-share lists rebuild the practice secret. That is the drill."
                : "Those two lists did not rebuild the practice hex. Use two of the three printed shares.",
              "SLIP-39 shares, not BIP-39 seeds. Lab only. Never fund."
            ].join("\n");
          }
          if (ok) {
            mem.slip39Done = true;
            mem.slip39TriedTwo = true;
            var chk2 = $("v2S39Check");
            if (chk2) chk2.innerHTML = slip39CheckHtml();
            if (pause) pause.disabled = !(mem.slip39TriedOne && mem.slip39TriedTwo);
          }
        } catch (e) {
          if (tout) {
            paintTone(tout, "bad");
            tout.textContent =
              "Combine failed (" +
              (e && e.message ? e.message : e) +
              "). That is honest — the practice hex was not rebuilt.";
          }
        }
      });
    }
    var s39PpGo = $("v2S39PpGo");
    if (s39PpGo) {
      s39PpGo.addEventListener("click", function () {
        var out = $("v2S39PpOut");
        var aEl = $("v2S39HexA");
        var bEl = $("v2S39HexB");
        var tagA = $("v2S39TagA");
        var tagB = $("v2S39TagB");
        if (!window.Slip39Lab || !mem.slip39Shares || !mem.slip39Hex) {
          if (out) out.textContent = "Finish the 2-of-3 SLIP-39 drill first.";
          return;
        }
        var extra = (($("v2S39Pp") && $("v2S39Pp").value) || "").trim();
        var pair = mem.slip39Shares.slice(0, 2);
        var hexA = "";
        var hexB = "";
        try {
          hexA = Slip39Lab.combineShares(pair, "");
        } catch (eA) {
          hexA = "";
        }
        try {
          hexB = Slip39Lab.combineShares(pair, extra);
        } catch (eB) {
          hexB = "";
        }
        var matchA = !!(hexA && Slip39Lab.matchExpected(hexA, mem.slip39Hex));
        var matchB = !!(hexB && Slip39Lab.matchExpected(hexB, mem.slip39Hex));
        var differ = !!(hexA && hexB && hexA !== hexB);
        if (aEl) {
          paintTone(aEl, matchA ? "ok" : "bad");
          aEl.textContent = "Recovered hex:\n" + (hexA || "(failed)");
        }
        if (bEl) {
          paintTone(bEl, matchB ? "ok" : differ ? "warn" : "bad");
          bEl.textContent = "Recovered hex:\n" + (hexB || "(failed)");
        }
        if (tagA) {
          tagA.textContent = matchA
            ? "MATCHES the practice master (empty extra)."
            : "Does not match the practice master.";
        }
        if (tagB) {
          tagB.textContent = matchB
            ? "Also matches — you probably left the extra empty. Type lab."
            : differ
              ? "DIFFERENT vault. Same two papers. Extra secret changed the hex."
              : "Did not recover a distinct hex.";
        }
        if (out) {
          var okDemo = matchA && differ && !matchB;
          paintTone(out, okDemo ? "ok" : extra ? "warn" : "bad");
          out.textContent = [
            "Same two SLIP-39 lists. Two extras. Two results.",
            "Without extra: " + (matchA ? "matches practice hex." : "no match."),
            "With extra “" + extra + "”: " + (matchB ? "matches practice (extra was empty or unused)." : differ ? "different hex — another vault." : "no distinct result."),
            "This extra is SLIP-39 encryption, not a BIP-39 25th word, not a fourth share.",
            "One list would still fail. Practice only. Never fund."
          ].join("\n");
          mem.slip39PpDone = !!okDemo;
          if (pause) pause.disabled = !mem.slip39PpDone;
        }
      });
    }
    function inspectV2Psbt(raw, story) {
      var box = $("v2PsbtIn");
      if (box && raw != null && String(raw).length) box.value = String(raw);
      var src = (box && box.value) || raw || "";
      var r = BIP39Lab.inspectPsbt(src);
      var line = $("v2PsbtStoryLine");
      if (line) {
        line.textContent = story || "This tab never signs. There is no seed field.";
      }
      var out = $("v2PsbtOut");
      var teach = $("v2PsbtTeach");
      if (teach) {
        teach.innerHTML =
          "<strong>Classroom — what a PSBT is</strong>" +
          "<em>What it is:</em> an unfinished bitcoin send (PSBT) you can pass around without the seed.<br/>" +
          "<em>Why:</em> hot software can build the send; a cold device or a co-signer adds a signature later. Nobody pastes the twelve words.<br/>" +
          "<em>When / where:</em> air-gap and 2-of-3. Inspect here. Sign on a device you trust. Broadcast from a hot machine you choose.<br/>" +
          "<em>How you proceed:</em> 1) inspect  2) sign elsewhere  3) broadcast elsewhere. This tab stops at step 1.";
      }
      if (!out) return;
      if (r.status !== "ok") {
        var refuse = /refus|secret/i.test(String(r.detail || ""));
        out.textContent = refuse
          ? "Refused. That looked like a seed or xprv. A payment package is not a backup. Paste a PSBT, not words.\nThis tab does not sign and does not broadcast."
          : "This blob is not a readable payment package. " +
            (r.detail || "unknown") +
            "\nThis tab does not sign and does not broadcast.";
        paintPsbtNet([]);
        if (pause) pause.disabled = false;
        return;
      }
      var prevs = extractPsbtPrevTxids(src);
      out.textContent = [
        "status ok — the file starts with the PSBT stamp (psbt\\xff). Classroom blob, not a funded spend.",
        "Partial signatures counted: " + (r.partialSigs != null ? r.partialSigs : 0) + ".",
        prevs.length
          ? "Prevout txid(s): " + prevs.join(" ")
          : "No on-chain txid or input prevout in this blob.",
        "This tab does not sign and does not broadcast."
      ].join("\n");
      paintPsbtNet(prevs);
      if (pause) pause.disabled = false;
    }
    function bindPsbt(id, raw, story) {
      var b = $(id);
      if (b) {
        b.addEventListener("click", function () {
          inspectV2Psbt(raw, story);
        });
      }
    }
    bindPsbt("v2Psbt", PSBT_MIN, "Empty global map after magic — package opened, no fields filled yet.");
    bindPsbt(
      "v2PsbtStory",
      PSBT_STORY,
      "Multisig / hardware story: software builds the package; a cold device or co-signer adds a partial signature elsewhere. This tab never signs."
    );
    bindPsbt("v2PsbtPartial", PSBT_PARTIAL, "Educational blob with extra map bytes — still inspect-only, not a funded spend.");
    var insp = $("v2PsbtInspect");
    if (insp) {
      insp.addEventListener("click", function () {
        inspectV2Psbt(($("v2PsbtIn") && $("v2PsbtIn").value) || "", "Inspected the box. This tab never signs.");
      });
    }
    var netAck = $("v2PsbtNetAck");
    if (netAck) {
      netAck.addEventListener("change", function () {
        var open = $("v2PsbtNetOpen");
        if (open) {
          var href = open.getAttribute("href") || "";
          open.hidden = !(netAck.checked && /txid=/.test(href));
        }
        maybeFetchPsbtNet();
      });
    }
    var netOpen = $("v2PsbtNetOpen");
    if (netOpen) {
      netOpen.addEventListener("click", function (ev) {
        var href = netOpen.getAttribute("href") || "";
        if (!netAck || !netAck.checked || !/txid=/.test(href)) ev.preventDefault();
      });
    }
    document.querySelectorAll("[data-v2-ex-txid]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var i = parseInt(btn.getAttribute("data-v2-ex-i") || "0", 10);
        mem.psbtExI = i;
        var ex = PSBT_EX_TX[i];
        document.querySelectorAll("[data-v2-ex-txid]").forEach(function (b) {
          b.classList.add("secondary");
        });
        btn.classList.remove("secondary");
        var msg = $("v2PsbtNetMsg");
        if (msg && ex) {
          msg.textContent = "Selected: " + ex.label + ". Tick leak-ack, then Inspect this transaction.";
        }
        var storyEl = $("v2TxStory");
        if (storyEl && ex) {
          var body =
            ex.label +
            " — " +
            ex.why +
            (ex.snap && ex.snap.story ? " " + ex.snap.story : "") +
            " This blue box is the classroom story. It is not the explorer payload.";
          storyEl.innerHTML = "<strong>What this is (classroom)</strong>" + body;
        }
        var live = $("v2PsbtNetLive");
        if (live && ex) {
          live.textContent =
            "Not fetched yet. Tick leak-ack, then Inspect. This column will show only chain fields (txid, confirm, block, in/out).";
        }
        var open = $("v2PsbtNetOpen");
        if (open) {
          open.hidden = true;
          open.removeAttribute("href");
        }
        psbtNetIds = [];
      });
    });
    var txInsp = $("v2TxInspect");
    if (txInsp) {
      txInsp.addEventListener("click", function () {
        var i = mem.psbtExI;
        var ex = i != null ? PSBT_EX_TX[i] : null;
        var live = $("v2PsbtNetLive");
        if (!ex) {
          if (live) live.textContent = "Select a named example first.";
          return;
        }
        paintPsbtNet(
          [ex.id],
          ex.label +
            " — " +
            ex.why +
            " Fetching /api/mempool/tx/ on this tab after leak-ack. True chain history, not the classroom PSBT."
        );
        if (pause) pause.disabled = false;
      });
    }
    function v2ApiGet(path, asText) {
      return v2FetchMempool(path, asText);
    }
    var UC10_FEE_CLASSROOM = {
      fastestFee: 8,
      halfHourFee: 4,
      hourFee: 2,
      economyFee: 1,
      minimumFee: 1,
      tip: 900000,
      count: 1234,
      vsize: 8000000
    };
    function paintUc10FeeSnap(b, tip, mp, live) {
      var vb = 140;
      function exampleSats(rate) {
        var a = Number(rate);
        if (!isFinite(a) || a < 0) return null;
        return Math.round(a * vb);
      }
      function satsToBtc(sats) {
        var n = Number(sats);
        if (!isFinite(n)) return "—";
        return (n / 1e8).toFixed(8);
      }
      var feeOut = $("v2FeeOut");
      if (feeOut) {
        feeOut.textContent = [
          "fastest     " + b.fastestFee + " sat/vB",
          "halfHour    " + b.halfHourFee + " sat/vB",
          "hour        " + b.hourFee + " sat/vB",
          "economy     " + b.economyFee + " sat/vB",
          "minimum     " + b.minimumFee + " sat/vB"
        ].join("\n");
      }
      var bandsEl = $("v2FeeBands");
      if (bandsEl) {
        var items = [
          ["fastest", b.fastestFee],
          ["½ hour", b.halfHourFee],
          ["hour", b.hourFee],
          ["economy", b.economyFee],
          ["minimum", b.minimumFee]
        ];
        bandsEl.innerHTML = items
          .map(function (pair) {
            var sats = exampleSats(pair[1]);
            var satsLabel = sats == null ? "—" : String(sats);
            return (
              '<div class="fee-band"><strong>' +
              pair[1] +
              "</strong><span>" +
              pair[0] +
              " sat/vB</span><span>~" +
              satsLabel +
              " sats @ " +
              vb +
              " vB</span></div>"
            );
          })
          .join("");
      }
      var ex = exampleSats(b.halfHourFee);
      var exFast = exampleSats(b.fastestFee);
      var feeEx = $("v2FeeExample");
      if (feeEx) {
        if (ex == null || exFast == null) {
          feeEx.textContent =
            "Example costs unavailable (invalid fee numbers). Estimates only — real txs vary.";
        } else {
          feeEx.textContent =
            "Example costs for ~" +
            vb +
            " vB: halfHour ≈ " +
            ex +
            " sats; fastest ≈ " +
            exFast +
            " sats (" +
            satsToBtc(ex) +
            " / " +
            satsToBtc(exFast) +
            " BTC). Estimates only — real txs vary." +
            (live
              ? ""
              : " Classroom sample — not today’s live mempool.");
        }
      }
      var trafficLines = [];
      if (isFinite(tip) && tip >= 0) trafficLines.push("Tip block height: " + tip);
      else trafficLines.push("Tip height: unknown");
      if (mp && mp.count != null && isFinite(Number(mp.count))) {
        trafficLines.push("Mempool tx count: " + mp.count);
        if (mp.vsize != null) trafficLines.push("Mempool vsize: " + mp.vsize + " vB");
      } else {
        trafficLines.push("Mempool: unknown");
      }
      if (!live) {
        trafficLines.push("Classroom snapshot (same layout as Network). Live proxy and mempool.space did not answer. Not a fake zero.");
      }
      var trafficOut = $("v2TrafficOut");
      if (trafficOut) trafficOut.textContent = trafficLines.join("\n");
      var resBox = $("v2SnapResult");
      if (resBox) resBox.hidden = false;
    }
    function v2NetAckOn() {
      var a = $("v2NetAck");
      return !!(a && a.checked);
    }
    function v2NetEnable() {
      var on = v2NetAckOn();
      ["v2NetSnap", "v2NetBal"].forEach(function (id) {
        var b = $(id);
        if (b) b.disabled = !on;
      });
    }
    var netAck10 = $("v2NetAck");
    if (netAck10) {
      netAck10.addEventListener("change", v2NetEnable);
      v2NetEnable();
    }
    var netSnap = $("v2NetSnap");
    if (netSnap) {
      netSnap.addEventListener("click", function () {
        var st = $("v2SnapStatus");
        var resBox = $("v2SnapResult");
        function setSnap(text, kind) {
          if (!st) return;
          st.textContent = text;
          st.className = "status" + (kind ? " " + kind : "");
        }
        if (!v2NetAckOn()) {
          setSnap("Tick leak-ack first. This tab did not fetch.", "err");
          return;
        }
        setSnap("Fetching public fee/traffic data (via lab proxy)…", "");
        if (resBox) resBox.hidden = true;
        function finishSnap(b, tip, mp, live) {
          paintUc10FeeSnap(b, tip, mp, live);
          setSnap(
            live
              ? "Snapshot OK (public API)."
              : "Classroom snapshot (live proxy did not answer). Same Fees & traffic layout as Network. Not today’s rates. Not a fake zero.",
            live ? "ok" : "warn"
          );
          mem.netSnap = true;
          if (pause) pause.disabled = false;
        }
        var feesP = v2ApiGet("/v1/fees/recommended", false);
        var tipP = v2ApiGet("/blocks/tip/height", true).catch(function () { return ""; });
        var memP = v2ApiGet("/mempool", false).catch(function () { return null; });
        Promise.all([feesP, tipP, memP])
          .then(function (parts) {
            var fees = parts[0] || {};
            var keys = ["fastestFee", "halfHourFee", "hourFee", "economyFee", "minimumFee"];
            var k;
            for (k = 0; k < keys.length; k++) {
              if (fees[keys[k]] == null || isNaN(Number(fees[keys[k]]))) {
                throw new Error("Fees unavailable (invalid payload).");
              }
            }
            var b = {
              fastestFee: Number(fees.fastestFee),
              halfHourFee: Number(fees.halfHourFee),
              hourFee: Number(fees.hourFee),
              economyFee: Number(fees.economyFee),
              minimumFee: Number(fees.minimumFee)
            };
            var tip = parseInt(String(parts[1] || "").trim(), 10);
            var mp = parts[2] || {};
            finishSnap(b, tip, mp, true);
          })
          .catch(function () {
            var c = UC10_FEE_CLASSROOM;
            finishSnap(
              {
                fastestFee: c.fastestFee,
                halfHourFee: c.halfHourFee,
                hourFee: c.hourFee,
                economyFee: c.economyFee,
                minimumFee: c.minimumFee
              },
              c.tip,
              { count: c.count, vsize: c.vsize },
              false
            );
          });
      });
    }
    function paintUc10BalRows(rows, miss) {
      var tbody = $("v2BalTableBody");
      var st = $("v2BalStatus");
      var bout = $("v2NetBalOut");
      if (tbody) {
        tbody.innerHTML = "";
        if (!rows.length) {
          tbody.innerHTML = '<tr class="empty-row"><td colspan="5">No balances yet.</td></tr>';
        } else {
          rows.forEach(function (r, i) {
            var tr = document.createElement("tr");
            var bal =
              r.satoshis == null
                ? "—"
                : r.status === "ok" && r.satoshis === 0
                  ? "0 (empty)"
                  : String(r.satoshis);
            [String(i), r.address, r.status, bal, r.detail || ""].forEach(function (text, j) {
              var td = document.createElement("td");
              td.textContent = text;
              if (j === 1) td.className = "addr";
              if (j === 3 && r.status === "ok" && r.satoshis === 0) {
                td.className = "bal-zero-ok";
                td.title = "Valid empty balance — API returned ok with 0 sats";
              }
              tr.appendChild(td);
            });
            tbody.appendChild(tr);
          });
        }
      }
      var okN = rows.filter(function (r) { return r.status === "ok"; }).length;
      var unk = rows.length - okN;
      var line = miss
        ? miss
        : "Done: " + okN + " ok, " + unk + " unknown/error (fail-closed; no fake zeros on failure).";
      if (st) {
        st.textContent = line;
        st.className = "status" + (miss ? " err" : unk ? "" : " ok");
      }
      if (bout) {
        bout.hidden = true;
        bout.textContent = line + " " + rows.map(function (r) {
          return r.address + " " + r.status + " " + (r.satoshis == null ? "—" : r.satoshis);
        }).join("; ");
      }
    }
    var netBal = $("v2NetBal");
    if (netBal) {
      netBal.addEventListener("click", function () {
        var st = $("v2BalStatus");
        var inp = $("v2NetAddr");
        var addr = inp && inp.value ? String(inp.value).trim() : "";
        if (!v2NetAckOn()) {
          if (st) {
            st.textContent = "Tick leak-ack first. This tab did not fetch.";
            st.className = "status err";
          }
          return;
        }
        if (/seed|mnemonic|xprv|abandon /i.test(addr) || (addr && addr.split(/\s+/).length >= 12)) {
          paintUc10BalRows([], "Refused. That looked like a seed. Address-only. Never the words.");
          return;
        }
        if (!/^(bc1|[13]|tb1|[mn2])[a-zA-HJ-NP-Z0-9]{14,}$/.test(addr)) {
          paintUc10BalRows([], "Need a bitcoin address (bc1… / 1… / 3…). Unknown until then — not a fake 0.");
          return;
        }
        if (st) {
          st.textContent = "Fetching 1 address…";
          st.className = "status";
        }
        v2ApiGet("/address/" + encodeURIComponent(addr), false)
          .then(function (data) {
            var chain = (data && data.chain_stats) || {};
            if (chain.funded_txo_sum == null && chain.spent_txo_sum == null) {
              paintUc10BalRows([{
                address: addr,
                status: "unknown",
                satoshis: null,
                detail: "missing chain_stats sums"
              }]);
              return;
            }
            var funded = Number(chain.funded_txo_sum || 0);
            var spent = Number(chain.spent_txo_sum || 0);
            if (!isFinite(funded) || !isFinite(spent)) {
              paintUc10BalRows([{
                address: addr,
                status: "unknown",
                satoshis: null,
                detail: "non-numeric chain_stats"
              }]);
              return;
            }
            var sats = funded - spent;
            var via = v2LastMempoolVia || "mempool.space";
            var detail = via;
            if (sats === 0) {
              detail = via + " · 0 sats is a valid empty result (not a fetch error)";
            }
            paintUc10BalRows([{
              address: addr,
              status: "ok",
              satoshis: sats,
              detail: detail
            }]);
          })
          .catch(function (e) {
            var m = e && e.message ? String(e.message) : String(e);
            paintUc10BalRows([{
              address: addr,
              status: "unknown",
              satoshis: null,
              detail: /HTTP 404/.test(m) ? "not found" : m
            }]);
          });
      });
    }
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
    } else if (document.querySelector(".v2-quiz-q")) {
      document.querySelectorAll("[data-quiz][data-qi]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var ok = btn.getAttribute("data-quiz") === "ok";
          var qi = btn.getAttribute("data-qi");
          var wrap = document.querySelector('.v2-quiz-q[data-qi="' + qi + '"]');
          var box = $("v2QuizMsg");
          var whyEl = btn.querySelector(".v2-quiz-why");
          var msg = whyEl && whyEl.textContent ? whyEl.textContent : ok ? "Correct." : "Wrong.";
          box.className = ok ? "msg-ok" : "msg-bad";
          box.textContent = msg;
          if (wrap) wrap.setAttribute("data-answered", ok ? "ok" : "bad");
          var qs = document.querySelectorAll(".v2-quiz-q");
          var all = true;
          qs.forEach(function (q) {
            if (q.getAttribute("data-answered") !== "ok") all = false;
          });
          if (pause) pause.disabled = !all;
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
    if ($("v2RestoreHide")) {
      $("v2RestoreHide").addEventListener("click", function () {
        mem.restoreHidden = true;
        var card = $("v2Card");
        if (card) card.classList.add("v2-hidden");
      });
    }
    if ($("v2RestoreFill")) {
      $("v2RestoreFill").addEventListener("click", function () {
        var w = (mem.mnemonic || "").split(/\s+/).filter(Boolean);
        var i;
        for (i = 0; i < 12; i++) {
          var inp = $("v2RestoreW" + i);
          if (inp) inp.value = w[i] || "";
        }
      });
    }
    if ($("v2RestoreCheck")) {
      $("v2RestoreCheck").addEventListener("click", async function () {
        var typed = [];
        for (var i = 0; i < 12; i++) {
          var inp = $("v2RestoreW" + i);
          typed.push(inp ? String(inp.value || "").trim().toLowerCase() : "");
        }
        var m = typed.join(" ");
        var box = $("v2RestoreMsg");
        var valid = window.BIP39Lab && (await BIP39Lab.validateMnemonic(m));
        if (!valid) {
          mem.restoreOk = false;
          if (box) {
            box.className = "msg-bad";
            box.textContent = "Checksum failed. A word is wrong or out of order. Do not fund.";
          }
          if (pause) pause.disabled = true;
          return;
        }
        var r = await BIP39Lab.deriveAddresses(m, "", { network: currentNet(), count: 1, account: 0, change: 0 });
        var addr = r.rows && r.rows[0] ? r.rows[0].bip84_p2wpkh : "";
        var match = addr && addr === mem.restoreAddr;
        mem.restoreOk = !!match;
        if (box) {
          box.className = match ? "msg-ok" : "msg-bad";
          box.textContent = match
            ? "Checksum ok. Same receive address as before. Restore from paper worked."
            : "Words checksum, but address does not match the hidden card.";
        }
        if (pause) pause.disabled = !match;
      });
    }
    document.querySelectorAll("[data-amt] [data-bin]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        mem.tier = mem.tier || {};
        var row = btn.closest("[data-amt]");
        var amt = row.getAttribute("data-amt");
        var bin = btn.getAttribute("data-bin");
        mem.tier[amt] = bin;
        row.querySelectorAll("[data-bin]").forEach(function (b) {
          b.className = "btn secondary btn-sm";
        });
        btn.className = "btn btn-sm";
        var want = { coffee: "phone", mid: "hww", large: "mofn" };
        var out = $("v2TierOut");
        if (bin === "exchange") {
          if (out) out.textContent = "Trap: savings on an exchange is they-hold, not amount-tiered self-custody.";
          if (pause) pause.disabled = true;
          return;
        }
        if (amt === "coffee" && bin === "mofn") {
          if (out) out.textContent = "Trap: 2-of-3 for coffee money. Put daily on a phone hot wallet.";
          if (pause) pause.disabled = true;
          return;
        }
        var ok =
          mem.tier.coffee === want.coffee &&
          mem.tier.mid === want.mid &&
          mem.tier.large === want.large;
        if (out) {
          out.textContent = ok
            ? "Placed: 0.001 phone · 0.184 hardware · 2.0 2-of-3."
            : "Keep placing. Coffee → phone. Mid → HWW. Large → 2-of-3.";
        }
        if (pause) pause.disabled = !ok;
      });
    });
    document.querySelectorAll("[data-inh-kit]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-inh-kit");
        var st = inhState();
        st.kits[id] = true;
        document.querySelectorAll("[data-inh-kit]").forEach(function (b) {
          b.classList.toggle("is-on", !!st.kits[b.getAttribute("data-inh-kit")]);
        });
        var lines = {
          chat: "Fail. Chat is a copy you cannot unsend. The words are now in someone else's backup of the thread.",
          nopass: "Fail. They rebuild the empty extra-secret wallet. The funded vault stays shut. The extra secret is a second object.",
          onekey: "Fail. One key cannot meet two-of-three. One Shamir share cannot rebuild the secret either.",
          later: "Fail. The first missing object shows up when you cannot name it. Debug now."
        };
        var o = $("v2InhKitOut");
        if (o) {
          o.className = "msg-bad";
          o.textContent = lines[id] || "";
        }
        st.kitMsg = lines[id] || "";
        if (pause) pause.disabled = !inhKitsDone();
      });
    });
    document.querySelectorAll("[data-inh-shape]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var st = inhState();
        st.shape = btn.getAttribute("data-inh-shape") || "";
        st.packed = false;
        document.querySelectorAll("[data-inh-shape]").forEach(function (b) {
          b.classList.toggle("is-on", b.getAttribute("data-inh-shape") === st.shape);
        });
        if (pause) pause.disabled = true;
      });
    });
    document.querySelectorAll("[data-inh-pack]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var st = inhState();
        var id = btn.getAttribute("data-inh-pack");
        st.pack[id] = !st.pack[id];
        st.packed = false;
        btn.classList.toggle("is-on", !!st.pack[id]);
        if (pause) pause.disabled = true;
      });
    });
    if ($("v2InhBuild")) {
      $("v2InhBuild").addEventListener("click", function () {
        var st = inhState();
        var p = st.pack;
        var shapeLine =
          st.shape === "keys"
            ? "Shape: 2-of-3 keys. Packet holds the descriptor. People hold keys."
            : st.shape === "shares"
              ? "Shape: 2-of-3 shares. Packet holds how to combine. Shares stay apart."
              : st.shape === "packet"
                ? "Shape: one signer. Packet is a map to the metal/paper. Not a chat copy of the words."
                : "Shape: none. Pick one.";
        var lines = [
          shapeLine,
          "Policy / descriptor: " + (p.desc ? "yes" : "missing"),
          "Where objects live: " + (p.where ? "yes" : "missing"),
          "Next open-while-alive date: " + (p.date ? "yes" : "missing"),
          "Live recovery words in envelope: " + (p.seed ? "YES — refuse" : "no (correct)"),
          "Extra secret in same envelope: " + (p.pp ? "YES — refuse" : "no (correct)"),
          "Chat screenshot: " + (p.chat ? "YES — refuse" : "no (correct)")
        ];
        if (p.seed && p.pp) {
          lines.push("Refuse: words + extra secret in one envelope is the whole vault.");
        }
        var ok = inhPackOk();
        lines.push(ok ? "Packet OK. Map only. Practice, not a will." : "Packet refused. Need shape + map ticks. Never seed, extra secret, or chat.");
        st.packText = lines.join("\n");
        st.packed = ok;
        var pre = $("v2InhPackOut");
        if (pre) pre.textContent = st.packText;
        if (pause) pause.disabled = !ok;
      });
    }
    function inhTry(kind) {
      var st = inhState();
      var o = $("v2InhLiveOut");
      var msg = "";
      var cls = "msg-bad";
      if (kind === "chat") {
        st.failTry = true;
        msg = "Fail. The thread is not a vault. Anyone with the backup of the chat has the words.";
      } else if (kind === "nopass") {
        st.failTry = true;
        msg = "Fail. They open the empty extra-secret wallet. The funded one never appears.";
      } else if (kind === "one") {
        st.failTry = true;
        msg = "Fail. One key cannot spend a 2-of-3. Sit with them and name who holds the second key.";
      } else if (kind === "live") {
        if (!st.packed || !inhPackOk()) {
          msg = "No. Build a valid packet on the previous pad first (map only, no seed in the envelope).";
        } else if (!st.failTry) {
          msg = "Fail at least once first. The lesson is the missing object, not a green tick.";
        } else {
          st.liveOk = true;
          cls = "msg-ok";
          msg = "Pass (practice). You watched them open the map while you can still name a missing object. Not a will. No Sign.";
        }
      }
      st.liveMsg = msg;
      if (o) {
        o.className = cls;
        o.textContent = msg;
      }
      if (pause) pause.disabled = !(st.failTry && st.liveOk);
    }
    if ($("v2InhTryChat")) $("v2InhTryChat").addEventListener("click", function () { inhTry("chat"); });
    if ($("v2InhTryNopass")) $("v2InhTryNopass").addEventListener("click", function () { inhTry("nopass"); });
    if ($("v2InhTryOne")) $("v2InhTryOne").addEventListener("click", function () { inhTry("one"); });
    if ($("v2InhTryLive")) $("v2InhTryLive").addEventListener("click", function () { inhTry("live"); });
    if ($("v2SimRecv")) {
      $("v2SimRecv").addEventListener("click", function () {
        mem.simRecv = true;
        var b = $("v2SimBal");
        if (b) b.textContent = "Simulated credit: 0.000184 tBTC (teaching only; this tab did not talk to a network).";
        if (pause) pause.disabled = false;
      });
    }
    document.querySelectorAll("[data-metal]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var k = btn.getAttribute("data-metal");
        mem.metalSeen = mem.metalSeen || {};
        mem.metalSeen[k] = true;
        mem.metalPick = k;
        document.querySelectorAll("[data-metal]").forEach(function (b) {
          b.classList.toggle("is-on", b.getAttribute("data-metal") === k);
        });
        var o = $("v2MetalOut");
        var copy = {
          al: { ok: false, t: "Aluminium melts around house-fire heat (~600°C). Turns to slag. Not a seed plate. Next stays off." },
          ss: { ok: true, t: "Stainless 304 / 316L melts far above a house fire (~1400°C). 304 is the common default. 316L holds up better near salt or long flood. Best balance for most people." },
          ti: { ok: true, t: "Titanium melts even higher (~1660°C) and resists corrosion well. Harder and costlier to stamp deep. Stainless is enough for a normal house." },
          pt: { ok: false, t: "Platinum is not a normal seed-backup product. Next stays off. Pick stainless or titanium." }
        };
        var row = copy[k] || { ok: false, t: "Tap a metal." };
        mem.metalMsg = row.t;
        mem.metalMsgOk = row.ok;
        if (o) {
          o.className = row.ok ? "msg-ok" : "msg-bad";
          o.textContent = row.t;
        }
        if (pause) pause.disabled = !row.ok;
      });
    });
    if ($("v2FourRand")) {
      $("v2FourRand").addEventListener("click", async function () {
        if (window.BIP39Lab && typeof BIP39Lab.generateMnemonic === "function") {
          mem.fourWords = String(await BIP39Lab.generateMnemonic(12)).trim().split(/\s+/).filter(Boolean);
        }
        renderTrack();
      });
    }
    if ($("v2XorSplit")) {
      $("v2XorSplit").addEventListener("click", async function () {
        if (!window.BIP39Lab) return;
        mem.xorOrig = await BIP39Lab.generateMnemonic(12);
        mem.xorA = await BIP39Lab.generateMnemonic(12);
        mem.xorB = await BIP39Lab.generateMnemonic(12);
        if ($("v2XorA")) $("v2XorA").innerHTML = wordGridHtml(mem.xorA);
        if ($("v2XorB")) $("v2XorB").innerHTML = wordGridHtml(mem.xorB);
        if (pause) pause.disabled = false;
      });
    }
    if ($("v2XorOne")) {
      $("v2XorOne").addEventListener("click", function () {
        var o = $("v2XorNeedAll");
        if (o) {
          o.className = "msg-bad";
          o.textContent = "Not enough parts. N-of-N needs every list. One 12-word part is not Shamir 2-of-3.";
        }
      });
    }
    if ($("v2XorAll")) {
      $("v2XorAll").addEventListener("click", function () {
        mem.xorAll = true;
        var o = $("v2XorNeedAll");
        if (o) {
          o.className = "msg-ok";
          o.id = "v2XorNeedAll";
          o.textContent =
            "All parts present. Classroom original: " +
            (mem.xorOrig || "(generate parts first)") +
            " — N-of-N, not Shamir. Do not fund.";
        }
        if (pause) pause.disabled = false;
      });
    }
    function paintTl() {
      var tl = mem.tl || { armed: false, ticks: 0, expired: false };
      var st = $("v2TlState");
      if (st) {
        st.textContent =
          "Day " +
          tl.ticks * 30 +
          " / 90 · " +
          (tl.expired ? "heir path unlocked (practice)" : "heir path locked");
      }
    }
    if ($("v2TlArm")) {
      $("v2TlArm").addEventListener("click", function () {
        mem.tl = { armed: true, ticks: 0, expired: false };
        mem.tlHeirTried = false;
        var o = $("v2TlArmOut");
        if (o) o.textContent = "Armed. Next pad ticks simulated days.";
        if (pause) pause.disabled = false;
      });
    }
    if ($("v2TlTick")) {
      $("v2TlTick").addEventListener("click", function () {
        mem.tl = mem.tl || { armed: true, ticks: 0, expired: false };
        mem.tl.ticks = Math.min(6, (mem.tl.ticks || 0) + 1);
        mem.tl.expired = mem.tl.ticks >= 3;
        paintTl();
        var o = $("v2TlOut");
        if (o) o.textContent = mem.tl.expired ? "90 simulated days reached. Heir path may try (practice)." : "Timer advanced. No signature.";
      });
    }
    if ($("v2TlRefresh")) {
      $("v2TlRefresh").addEventListener("click", function () {
        mem.tl = { armed: true, ticks: 0, expired: false };
        mem.tlHeirTried = false;
        paintTl();
        var o = $("v2TlOut");
        if (o) {
          o.className = "msg-ok";
          o.textContent = "Owner refreshed. Heir path locked again. No transaction signed.";
        }
        if (pause) pause.disabled = true;
      });
    }
    if ($("v2TlHeir")) {
      $("v2TlHeir").addEventListener("click", function () {
        var tl = mem.tl || {};
        var o = $("v2TlOut");
        if (!tl.expired) {
          if (o) {
            o.className = "msg-bad";
            o.textContent = "Locked. Heir cannot spend yet. Timer has not expired. No Sign in this tab.";
          }
          return;
        }
        mem.tlHeirTried = true;
        if (o) {
          o.className = "msg-ok";
          o.textContent = "Practice only: heir path would be allowed after inactivity. This tab did not sign or broadcast.";
        }
        if (pause) pause.disabled = false;
      });
    }
    if ($("v2DescAck")) {
      $("v2DescAck").addEventListener("change", function () {
        mem.descAck = !!$("v2DescAck").checked;
        if (pause) pause.disabled = !mem.descAck;
      });
    }
    if ($("v2ElBip39")) {
      $("v2ElBip39").addEventListener("click", async function () {
        if (!mem.mnemonic || !window.BIP39Lab) return;
        var r = await BIP39Lab.deriveAddresses(mem.mnemonic, "", { network: "test", count: 1 });
        mem.elAddr = (r.rows[0] && r.rows[0].bip84_p2wpkh) || "";
        mem.elBip = true;
        if ($("v2ElAddr")) $("v2ElAddr").textContent = mem.elAddr;
        if (pause && mem.elBip && mem.elNote) pause.disabled = false;
      });
    }
    if ($("v2ElElectrum")) {
      $("v2ElElectrum").addEventListener("click", function () {
        mem.elNote =
          "If these words were Electrum-style, BIP-39 restore is the wrong vault. This tab does not run Electrum’s stretch and will not invent an Electrum address.";
        var o = $("v2ElOut");
        if (o) {
          o.className = "msg-ok";
          o.textContent = mem.elNote;
        }
        if (pause && mem.elBip && mem.elNote) pause.disabled = false;
      });
    }
    document.querySelectorAll("[data-plate]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var k = btn.getAttribute("data-plate");
        mem.plateKind = k;
        document.querySelectorAll("[data-plate]").forEach(function (b) {
          b.classList.toggle("is-on", b.getAttribute("data-plate") === k);
        });
        var o = $("v2PlateOut");
        var msg =
          k === "solid"
            ? "Solid punched plate: best durability. Deep punch, ~3–5 mm, no pieces to lose."
            : k === "tiles"
              ? "Tile cassette: heat or crush can spill tiles. Next stays off. Pick a solid punched plate."
              : "A photo of the plate is never a backup. Next stays off.";
        mem.plateMsg = msg;
        if (o) {
          o.className = k === "solid" ? "msg-ok" : "msg-bad";
          o.textContent = msg;
        }
        if (pause) pause.disabled = k !== "solid";
      });
    });
    document.querySelectorAll("[data-collab]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var k = btn.getAttribute("data-collab");
        var o = $("v2CollabOut");
        var ok = k === "freeze";
        if (o) {
          o.className = ok ? "msg-ok" : "msg-bad";
          o.textContent = ok
            ? "Service can often freeze. They should not steal alone if you hold two keys."
            : "They lack your two keys, so they should not spend alone. Freeze is the usual lever.";
        }
        if (pause) pause.disabled = !ok;
      });
    });
    if ($("v2Fw")) {
      $("v2Fw").addEventListener("change", function () {
        if (pause) pause.disabled = !$("v2Fw").checked;
      });
    }
    document.querySelectorAll("[data-laptop-seed]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var stay = btn.getAttribute("data-laptop-seed") === "stay-hot";
        document.querySelectorAll("[data-laptop-seed]").forEach(function (b) {
          b.classList.toggle("is-on", b === btn);
        });
        var o = $("v2CerOut");
        var hwAmt = $("v2VaultHwAmt");
        var hwNote = $("v2VaultHwNote");
        if (o) {
          o.className = stay ? "msg-ok" : "msg-bad";
          o.textContent = stay
            ? "Two vaults. The notes-file coins stay a software wallet. The device starts a new seed that never touched this computer."
            : "Wrong. The device now holds the same words the laptop already saw. A thief on the laptop still has them. Not cold.";
        }
        if (hwAmt) hwAmt.textContent = stay ? "new seed · separate vault" : "0.184 BTC · same words as laptop";
        if (hwNote) {
          hwNote.textContent = stay
            ? "Savings can live here. The laptop phrase is a different wallet and stays hot."
            : "Same vault as the notes file. Putting it in a metal box did not make it cold.";
        }
        if (pause) pause.disabled = !stay;
      });
    });
    mem.loopClicks = mem.loopClicks || [];
    document.querySelectorAll("[data-loop]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var n = parseInt(btn.getAttribute("data-loop"), 10);
        mem.loopClicks = mem.loopClicks || [];
        mem.loopClicks.push(n);
        var o = $("v2LoopOut");
        var seq = mem.loopClicks.slice(-4);
        var ok = seq.length >= 4 && seq[0] === 0 && seq[1] === 1 && seq[2] === 2 && seq[3] === 3;
        if (o) {
          o.textContent = ok
            ? "Build → hand-off → sign offline → broadcast elsewhere. This tab never signs."
            : "Tap 1 then 2 then 3 then 4. This tab never signs.";
        }
        if (pause) pause.disabled = !ok;
      });
    });
    document.querySelectorAll("[data-geo]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        mem.geo = mem.geo || {};
        var k = btn.getAttribute("data-geo");
        if (k === "garage") {
          var o = $("v2GeoOut");
          if (o) {
            o.className = "msg-bad";
            o.textContent = "Garage is the same building. Cluster.";
          }
          if (pause) pause.disabled = true;
          return;
        }
        mem.geo[k] = true;
        var ok = mem.geo.home && mem.geo.else && mem.geo.person;
        var o2 = $("v2GeoOut");
        if (o2) {
          o2.className = ok ? "msg-ok" : "";
          o2.textContent = ok ? "Three sites. Not clustered." : "Place home, elsewhere, and a person/institution.";
        }
        if (pause) pause.disabled = !ok;
      });
    });
    document.querySelectorAll("[data-cal]").forEach(function (box) {
      box.addEventListener("change", function () {
        var a = document.querySelector('[data-cal="16"]');
        var b = document.querySelector('[data-cal="18"]');
        var ok = a && a.checked && b && b.checked;
        var o = $("v2CalOut");
        if (o) o.textContent = ok ? "Both drills scheduled." : "Tick UC16 and UC18.";
        if (pause) pause.disabled = !ok;
      });
    });
    wireCopyQr(document);
    document.querySelectorAll("[data-v2-dock]").forEach(function (a) {
      a.addEventListener("click", function () {
        var id = parseInt(a.getAttribute("data-v2-dock"), 10);
        var s = loadState();
        s.dock = { id: id, step: Math.max(0, stepsFor(id).length - 1) };
        saveState(s);
      });
    });
    var ex = $("v2Exit");
    var fin = $("v2Finish");
    if (ex && fin) {
      ex.addEventListener("change", function () { fin.disabled = !ex.checked; });
      fin.addEventListener("click", function () {
        if (!ex.checked) return;
        markComplete(current.id);
        pickerFilter = pathFor(current.id);
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

  function wipeProgressStore() {
    function dropKey(store, key) {
      try { store.removeItem(key); } catch (e) { /* ignore */ }
    }
    function dropPrefixed(store) {
      var i;
      var keys = [];
      try {
        for (i = 0; i < store.length; i++) keys.push(store.key(i));
      } catch (e) { return; }
      keys.forEach(function (k) {
        if (k && (k === STORE || k.indexOf("bip39") === 0 || k.indexOf("bip39lab") === 0)) dropKey(store, k);
      });
    }
    try { dropPrefixed(sessionStorage); } catch (e) { /* ignore */ }
    try { dropPrefixed(localStorage); } catch (e2) { /* ignore */ }
    dropKey(sessionStorage, STORE);
    dropKey(localStorage, STORE);
    try {
      document.cookie.split(";").forEach(function (c) {
        var n = c.split("=")[0].trim();
        if (!n) return;
        document.cookie = n + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        document.cookie = n + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/v2/";
      });
    } catch (e3) { /* ignore */ }
  }

  function hardRefresh() {
    wipeProgressStore();
    mem = { mnemonic: "", lastRows: null, cardAck: false, wordCount: 12, cosigners: emptyCosigners(), maxStep: 0, network: "test", addrType: "bip84", pathPurpose: 84, woPurpose: 86, woPack: null, entEvents: [], entMnemonic: "", entWordCount: 12, entPp: "" };
    pickerFilter = "start";
    current = { id: 1, step: 0 };
    try {
      var path = (window.location.pathname || "/v2/").split("?")[0];
      window.location.replace(path);
    } catch (e) {
      renderPicker();
      show("viewPicker");
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
    document.addEventListener("input", function (ev) {
      var t = ev.target;
      if (!t || (t.id !== "ppA" && t.id !== "ppB")) return;
      scheduleCmpAddresses();
    });
    document.addEventListener("keyup", function (ev) {
      var t = ev.target;
      if (!t || (t.id !== "ppA" && t.id !== "ppB")) return;
      paintCmpEstimates();
    });
    if ($("v2Clear")) $("v2Clear").addEventListener("click", clearSecrets);
    if ($("v2HardRefresh")) $("v2HardRefresh").addEventListener("click", hardRefresh);
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
    if ($("v2QrClose")) $("v2QrClose").addEventListener("click", hideV2Qr);
    if ($("v2QrModal")) {
      $("v2QrModal").addEventListener("click", function (ev) {
        if (ev.target === $("v2QrModal")) hideV2Qr();
      });
    }
    var pendingUc = null;
    var pendingDock = null;
    function resumeAfterAck() {
      if (pendingUc != null) {
        openUc(pendingUc);
        pendingUc = null;
        return;
      }
      if (pendingDock && pendingDock.id) {
        var d = pendingDock;
        pendingDock = null;
        setGated(d.id);
        startTrack(d.id);
        mem.maxStep = Math.max(mem.maxStep || 0, d.step || 0);
        current.step = d.step || 0;
        renderTrack();
      }
    }
    var ackOv = $("v2AckOverlay");
    var ackBtn = $("v2AckUnderstand");
    if (ackBtn) {
      ackBtn.addEventListener("click", function () {
        setAck();
        if (ackOv) ackOv.hidden = true;
        resumeAfterAck();
      });
    }
    var dock = loadState().dock;
    if (q) {
      var n = parseInt(q, 10);
      if (n >= 1 && n <= 35) pendingUc = n;
    } else if (dock && dock.id) {
      var s = loadState();
      delete s.dock;
      saveState(s);
      pendingDock = dock;
    }
    if (!hasAck()) {
      if (ackOv) ackOv.hidden = false;
    } else {
      resumeAfterAck();
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
