(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/base64-js/index.js
  var require_base64_js = __commonJS({
    "node_modules/base64-js/index.js"(exports) {
      "use strict";
      init_slip39_buffer_inject();
      exports.byteLength = byteLength;
      exports.toByteArray = toByteArray;
      exports.fromByteArray = fromByteArray;
      var lookup = [];
      var revLookup = [];
      var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
      var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      for (i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i];
        revLookup[code.charCodeAt(i)] = i;
      }
      var i;
      var len;
      revLookup["-".charCodeAt(0)] = 62;
      revLookup["_".charCodeAt(0)] = 63;
      function getLens(b64) {
        var len2 = b64.length;
        if (len2 % 4 > 0) {
          throw new Error("Invalid string. Length must be a multiple of 4");
        }
        var validLen = b64.indexOf("=");
        if (validLen === -1) validLen = len2;
        var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
        return [validLen, placeHoldersLen];
      }
      function byteLength(b64) {
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function _byteLength(b64, validLen, placeHoldersLen) {
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function toByteArray(b64) {
        var tmp;
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
        var curByte = 0;
        var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
        var i2;
        for (i2 = 0; i2 < len2; i2 += 4) {
          tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
          arr[curByte++] = tmp >> 16 & 255;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 2) {
          tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 1) {
          tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        return arr;
      }
      function tripletToBase64(num) {
        return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
      }
      function encodeChunk(uint8, start, end) {
        var tmp;
        var output = [];
        for (var i2 = start; i2 < end; i2 += 3) {
          tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
          output.push(tripletToBase64(tmp));
        }
        return output.join("");
      }
      function fromByteArray(uint8) {
        var tmp;
        var len2 = uint8.length;
        var extraBytes = len2 % 3;
        var parts = [];
        var maxChunkLength = 16383;
        for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
          parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
        }
        if (extraBytes === 1) {
          tmp = uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
          );
        } else if (extraBytes === 2) {
          tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
          );
        }
        return parts.join("");
      }
    }
  });

  // node_modules/ieee754/index.js
  var require_ieee754 = __commonJS({
    "node_modules/ieee754/index.js"(exports) {
      init_slip39_buffer_inject();
      exports.read = function(buffer, offset, isLE, mLen, nBytes) {
        var e, m;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var nBits = -7;
        var i = isLE ? nBytes - 1 : 0;
        var d = isLE ? -1 : 1;
        var s = buffer[offset + i];
        i += d;
        e = s & (1 << -nBits) - 1;
        s >>= -nBits;
        nBits += eLen;
        for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        m = e & (1 << -nBits) - 1;
        e >>= -nBits;
        nBits += mLen;
        for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        if (e === 0) {
          e = 1 - eBias;
        } else if (e === eMax) {
          return m ? NaN : (s ? -1 : 1) * Infinity;
        } else {
          m = m + Math.pow(2, mLen);
          e = e - eBias;
        }
        return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
      };
      exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
        var e, m, c;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
        var i = isLE ? 0 : nBytes - 1;
        var d = isLE ? 1 : -1;
        var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
        value = Math.abs(value);
        if (isNaN(value) || value === Infinity) {
          m = isNaN(value) ? 1 : 0;
          e = eMax;
        } else {
          e = Math.floor(Math.log(value) / Math.LN2);
          if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
          }
          if (e + eBias >= 1) {
            value += rt / c;
          } else {
            value += rt * Math.pow(2, 1 - eBias);
          }
          if (value * c >= 2) {
            e++;
            c /= 2;
          }
          if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
          } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
          } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
          }
        }
        for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
        }
        e = e << mLen | m;
        eLen += mLen;
        for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
        }
        buffer[offset + i - d] |= s * 128;
      };
    }
  });

  // node_modules/buffer/index.js
  var require_buffer = __commonJS({
    "node_modules/buffer/index.js"(exports) {
      "use strict";
      init_slip39_buffer_inject();
      var base64 = require_base64_js();
      var ieee754 = require_ieee754();
      var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
      exports.Buffer = Buffer3;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;
      var K_MAX_LENGTH = 2147483647;
      exports.kMaxLength = K_MAX_LENGTH;
      Buffer3.TYPED_ARRAY_SUPPORT = typedArraySupport();
      if (!Buffer3.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
        console.error(
          "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
        );
      }
      function typedArraySupport() {
        try {
          const arr = new Uint8Array(1);
          const proto = { foo: function() {
            return 42;
          } };
          Object.setPrototypeOf(proto, Uint8Array.prototype);
          Object.setPrototypeOf(arr, proto);
          return arr.foo() === 42;
        } catch (e) {
          return false;
        }
      }
      Object.defineProperty(Buffer3.prototype, "parent", {
        enumerable: true,
        get: function() {
          if (!Buffer3.isBuffer(this)) return void 0;
          return this.buffer;
        }
      });
      Object.defineProperty(Buffer3.prototype, "offset", {
        enumerable: true,
        get: function() {
          if (!Buffer3.isBuffer(this)) return void 0;
          return this.byteOffset;
        }
      });
      function createBuffer(length) {
        if (length > K_MAX_LENGTH) {
          throw new RangeError('The value "' + length + '" is invalid for option "size"');
        }
        const buf = new Uint8Array(length);
        Object.setPrototypeOf(buf, Buffer3.prototype);
        return buf;
      }
      function Buffer3(arg, encodingOrOffset, length) {
        if (typeof arg === "number") {
          if (typeof encodingOrOffset === "string") {
            throw new TypeError(
              'The "string" argument must be of type string. Received type number'
            );
          }
          return allocUnsafe(arg);
        }
        return from(arg, encodingOrOffset, length);
      }
      Buffer3.poolSize = 8192;
      function from(value, encodingOrOffset, length) {
        if (typeof value === "string") {
          return fromString(value, encodingOrOffset);
        }
        if (ArrayBuffer.isView(value)) {
          return fromArrayView(value);
        }
        if (value == null) {
          throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
          );
        }
        if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof value === "number") {
          throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
          );
        }
        const valueOf = value.valueOf && value.valueOf();
        if (valueOf != null && valueOf !== value) {
          return Buffer3.from(valueOf, encodingOrOffset, length);
        }
        const b = fromObject(value);
        if (b) return b;
        if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
          return Buffer3.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
        }
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      Buffer3.from = function(value, encodingOrOffset, length) {
        return from(value, encodingOrOffset, length);
      };
      Object.setPrototypeOf(Buffer3.prototype, Uint8Array.prototype);
      Object.setPrototypeOf(Buffer3, Uint8Array);
      function assertSize(size) {
        if (typeof size !== "number") {
          throw new TypeError('"size" argument must be of type number');
        } else if (size < 0) {
          throw new RangeError('The value "' + size + '" is invalid for option "size"');
        }
      }
      function alloc(size, fill, encoding) {
        assertSize(size);
        if (size <= 0) {
          return createBuffer(size);
        }
        if (fill !== void 0) {
          return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
        }
        return createBuffer(size);
      }
      Buffer3.alloc = function(size, fill, encoding) {
        return alloc(size, fill, encoding);
      };
      function allocUnsafe(size) {
        assertSize(size);
        return createBuffer(size < 0 ? 0 : checked(size) | 0);
      }
      Buffer3.allocUnsafe = function(size) {
        return allocUnsafe(size);
      };
      Buffer3.allocUnsafeSlow = function(size) {
        return allocUnsafe(size);
      };
      function fromString(string, encoding) {
        if (typeof encoding !== "string" || encoding === "") {
          encoding = "utf8";
        }
        if (!Buffer3.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        const length = byteLength(string, encoding) | 0;
        let buf = createBuffer(length);
        const actual = buf.write(string, encoding);
        if (actual !== length) {
          buf = buf.slice(0, actual);
        }
        return buf;
      }
      function fromArrayLike(array) {
        const length = array.length < 0 ? 0 : checked(array.length) | 0;
        const buf = createBuffer(length);
        for (let i = 0; i < length; i += 1) {
          buf[i] = array[i] & 255;
        }
        return buf;
      }
      function fromArrayView(arrayView) {
        if (isInstance(arrayView, Uint8Array)) {
          const copy = new Uint8Array(arrayView);
          return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
        }
        return fromArrayLike(arrayView);
      }
      function fromArrayBuffer(array, byteOffset, length) {
        if (byteOffset < 0 || array.byteLength < byteOffset) {
          throw new RangeError('"offset" is outside of buffer bounds');
        }
        if (array.byteLength < byteOffset + (length || 0)) {
          throw new RangeError('"length" is outside of buffer bounds');
        }
        let buf;
        if (byteOffset === void 0 && length === void 0) {
          buf = new Uint8Array(array);
        } else if (length === void 0) {
          buf = new Uint8Array(array, byteOffset);
        } else {
          buf = new Uint8Array(array, byteOffset, length);
        }
        Object.setPrototypeOf(buf, Buffer3.prototype);
        return buf;
      }
      function fromObject(obj) {
        if (Buffer3.isBuffer(obj)) {
          const len = checked(obj.length) | 0;
          const buf = createBuffer(len);
          if (buf.length === 0) {
            return buf;
          }
          obj.copy(buf, 0, 0, len);
          return buf;
        }
        if (obj.length !== void 0) {
          if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
            return createBuffer(0);
          }
          return fromArrayLike(obj);
        }
        if (obj.type === "Buffer" && Array.isArray(obj.data)) {
          return fromArrayLike(obj.data);
        }
      }
      function checked(length) {
        if (length >= K_MAX_LENGTH) {
          throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
        }
        return length | 0;
      }
      function SlowBuffer(length) {
        if (+length != length) {
          length = 0;
        }
        return Buffer3.alloc(+length);
      }
      Buffer3.isBuffer = function isBuffer(b) {
        return b != null && b._isBuffer === true && b !== Buffer3.prototype;
      };
      Buffer3.compare = function compare(a, b) {
        if (isInstance(a, Uint8Array)) a = Buffer3.from(a, a.offset, a.byteLength);
        if (isInstance(b, Uint8Array)) b = Buffer3.from(b, b.offset, b.byteLength);
        if (!Buffer3.isBuffer(a) || !Buffer3.isBuffer(b)) {
          throw new TypeError(
            'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
          );
        }
        if (a === b) return 0;
        let x = a.length;
        let y = b.length;
        for (let i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      Buffer3.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return true;
          default:
            return false;
        }
      };
      Buffer3.concat = function concat(list, length) {
        if (!Array.isArray(list)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }
        if (list.length === 0) {
          return Buffer3.alloc(0);
        }
        let i;
        if (length === void 0) {
          length = 0;
          for (i = 0; i < list.length; ++i) {
            length += list[i].length;
          }
        }
        const buffer = Buffer3.allocUnsafe(length);
        let pos = 0;
        for (i = 0; i < list.length; ++i) {
          let buf = list[i];
          if (isInstance(buf, Uint8Array)) {
            if (pos + buf.length > buffer.length) {
              if (!Buffer3.isBuffer(buf)) buf = Buffer3.from(buf);
              buf.copy(buffer, pos);
            } else {
              Uint8Array.prototype.set.call(
                buffer,
                buf,
                pos
              );
            }
          } else if (!Buffer3.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
          } else {
            buf.copy(buffer, pos);
          }
          pos += buf.length;
        }
        return buffer;
      };
      function byteLength(string, encoding) {
        if (Buffer3.isBuffer(string)) {
          return string.length;
        }
        if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
          return string.byteLength;
        }
        if (typeof string !== "string") {
          throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
          );
        }
        const len = string.length;
        const mustMatch = arguments.length > 2 && arguments[2] === true;
        if (!mustMatch && len === 0) return 0;
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "ascii":
            case "latin1":
            case "binary":
              return len;
            case "utf8":
            case "utf-8":
              return utf8ToBytes2(string).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return len * 2;
            case "hex":
              return len >>> 1;
            case "base64":
              return base64ToBytes(string).length;
            default:
              if (loweredCase) {
                return mustMatch ? -1 : utf8ToBytes2(string).length;
              }
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer3.byteLength = byteLength;
      function slowToString(encoding, start, end) {
        let loweredCase = false;
        if (start === void 0 || start < 0) {
          start = 0;
        }
        if (start > this.length) {
          return "";
        }
        if (end === void 0 || end > this.length) {
          end = this.length;
        }
        if (end <= 0) {
          return "";
        }
        end >>>= 0;
        start >>>= 0;
        if (end <= start) {
          return "";
        }
        if (!encoding) encoding = "utf8";
        while (true) {
          switch (encoding) {
            case "hex":
              return hexSlice(this, start, end);
            case "utf8":
            case "utf-8":
              return utf8Slice(this, start, end);
            case "ascii":
              return asciiSlice(this, start, end);
            case "latin1":
            case "binary":
              return latin1Slice(this, start, end);
            case "base64":
              return base64Slice(this, start, end);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return utf16leSlice(this, start, end);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = (encoding + "").toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer3.prototype._isBuffer = true;
      function swap(b, n, m) {
        const i = b[n];
        b[n] = b[m];
        b[m] = i;
      }
      Buffer3.prototype.swap16 = function swap16() {
        const len = this.length;
        if (len % 2 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        }
        for (let i = 0; i < len; i += 2) {
          swap(this, i, i + 1);
        }
        return this;
      };
      Buffer3.prototype.swap32 = function swap32() {
        const len = this.length;
        if (len % 4 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        }
        for (let i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }
        return this;
      };
      Buffer3.prototype.swap64 = function swap64() {
        const len = this.length;
        if (len % 8 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 64-bits");
        }
        for (let i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }
        return this;
      };
      Buffer3.prototype.toString = function toString() {
        const length = this.length;
        if (length === 0) return "";
        if (arguments.length === 0) return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };
      Buffer3.prototype.toLocaleString = Buffer3.prototype.toString;
      Buffer3.prototype.equals = function equals(b) {
        if (!Buffer3.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
        if (this === b) return true;
        return Buffer3.compare(this, b) === 0;
      };
      Buffer3.prototype.inspect = function inspect() {
        let str = "";
        const max = exports.INSPECT_MAX_BYTES;
        str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
        if (this.length > max) str += " ... ";
        return "<Buffer " + str + ">";
      };
      if (customInspectSymbol) {
        Buffer3.prototype[customInspectSymbol] = Buffer3.prototype.inspect;
      }
      Buffer3.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (isInstance(target, Uint8Array)) {
          target = Buffer3.from(target, target.offset, target.byteLength);
        }
        if (!Buffer3.isBuffer(target)) {
          throw new TypeError(
            'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
          );
        }
        if (start === void 0) {
          start = 0;
        }
        if (end === void 0) {
          end = target ? target.length : 0;
        }
        if (thisStart === void 0) {
          thisStart = 0;
        }
        if (thisEnd === void 0) {
          thisEnd = this.length;
        }
        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
          throw new RangeError("out of range index");
        }
        if (thisStart >= thisEnd && start >= end) {
          return 0;
        }
        if (thisStart >= thisEnd) {
          return -1;
        }
        if (start >= end) {
          return 1;
        }
        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target) return 0;
        let x = thisEnd - thisStart;
        let y = end - start;
        const len = Math.min(x, y);
        const thisCopy = this.slice(thisStart, thisEnd);
        const targetCopy = target.slice(start, end);
        for (let i = 0; i < len; ++i) {
          if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i];
            y = targetCopy[i];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        if (buffer.length === 0) return -1;
        if (typeof byteOffset === "string") {
          encoding = byteOffset;
          byteOffset = 0;
        } else if (byteOffset > 2147483647) {
          byteOffset = 2147483647;
        } else if (byteOffset < -2147483648) {
          byteOffset = -2147483648;
        }
        byteOffset = +byteOffset;
        if (numberIsNaN(byteOffset)) {
          byteOffset = dir ? 0 : buffer.length - 1;
        }
        if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
        if (byteOffset >= buffer.length) {
          if (dir) return -1;
          else byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (dir) byteOffset = 0;
          else return -1;
        }
        if (typeof val === "string") {
          val = Buffer3.from(val, encoding);
        }
        if (Buffer3.isBuffer(val)) {
          if (val.length === 0) {
            return -1;
          }
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        } else if (typeof val === "number") {
          val = val & 255;
          if (typeof Uint8Array.prototype.indexOf === "function") {
            if (dir) {
              return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            } else {
              return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
            }
          }
          return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
        }
        throw new TypeError("val must be string, number or Buffer");
      }
      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        let indexSize = 1;
        let arrLength = arr.length;
        let valLength = val.length;
        if (encoding !== void 0) {
          encoding = String(encoding).toLowerCase();
          if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
            if (arr.length < 2 || val.length < 2) {
              return -1;
            }
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }
        function read(buf, i2) {
          if (indexSize === 1) {
            return buf[i2];
          } else {
            return buf.readUInt16BE(i2 * indexSize);
          }
        }
        let i;
        if (dir) {
          let foundIndex = -1;
          for (i = byteOffset; i < arrLength; i++) {
            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
              if (foundIndex === -1) foundIndex = i;
              if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
            } else {
              if (foundIndex !== -1) i -= i - foundIndex;
              foundIndex = -1;
            }
          }
        } else {
          if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
          for (i = byteOffset; i >= 0; i--) {
            let found = true;
            for (let j = 0; j < valLength; j++) {
              if (read(arr, i + j) !== read(val, j)) {
                found = false;
                break;
              }
            }
            if (found) return i;
          }
        }
        return -1;
      }
      Buffer3.prototype.includes = function includes(val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1;
      };
      Buffer3.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };
      Buffer3.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };
      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        const remaining = buf.length - offset;
        if (!length) {
          length = remaining;
        } else {
          length = Number(length);
          if (length > remaining) {
            length = remaining;
          }
        }
        const strLen = string.length;
        if (length > strLen / 2) {
          length = strLen / 2;
        }
        let i;
        for (i = 0; i < length; ++i) {
          const parsed = parseInt(string.substr(i * 2, 2), 16);
          if (numberIsNaN(parsed)) return i;
          buf[offset + i] = parsed;
        }
        return i;
      }
      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes2(string, buf.length - offset), buf, offset, length);
      }
      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
      }
      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
      }
      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
      }
      Buffer3.prototype.write = function write(string, offset, length, encoding) {
        if (offset === void 0) {
          encoding = "utf8";
          length = this.length;
          offset = 0;
        } else if (length === void 0 && typeof offset === "string") {
          encoding = offset;
          length = this.length;
          offset = 0;
        } else if (isFinite(offset)) {
          offset = offset >>> 0;
          if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === void 0) encoding = "utf8";
          } else {
            encoding = length;
            length = void 0;
          }
        } else {
          throw new Error(
            "Buffer.write(string, encoding, offset[, length]) is no longer supported"
          );
        }
        const remaining = this.length - offset;
        if (length === void 0 || length > remaining) length = remaining;
        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
          throw new RangeError("Attempt to write outside buffer bounds");
        }
        if (!encoding) encoding = "utf8";
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "hex":
              return hexWrite(this, string, offset, length);
            case "utf8":
            case "utf-8":
              return utf8Write(this, string, offset, length);
            case "ascii":
            case "latin1":
            case "binary":
              return asciiWrite(this, string, offset, length);
            case "base64":
              return base64Write(this, string, offset, length);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return ucs2Write(this, string, offset, length);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      };
      Buffer3.prototype.toJSON = function toJSON() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function base64Slice(buf, start, end) {
        if (start === 0 && end === buf.length) {
          return base64.fromByteArray(buf);
        } else {
          return base64.fromByteArray(buf.slice(start, end));
        }
      }
      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        const res = [];
        let i = start;
        while (i < end) {
          const firstByte = buf[i];
          let codePoint = null;
          let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
          if (i + bytesPerSequence <= end) {
            let secondByte, thirdByte, fourthByte, tempCodePoint;
            switch (bytesPerSequence) {
              case 1:
                if (firstByte < 128) {
                  codePoint = firstByte;
                }
                break;
              case 2:
                secondByte = buf[i + 1];
                if ((secondByte & 192) === 128) {
                  tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                  if (tempCodePoint > 127) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 3:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                  if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 4:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                fourthByte = buf[i + 3];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                  if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                    codePoint = tempCodePoint;
                  }
                }
            }
          }
          if (codePoint === null) {
            codePoint = 65533;
            bytesPerSequence = 1;
          } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | codePoint & 1023;
          }
          res.push(codePoint);
          i += bytesPerSequence;
        }
        return decodeCodePointsArray(res);
      }
      var MAX_ARGUMENTS_LENGTH = 4096;
      function decodeCodePointsArray(codePoints) {
        const len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) {
          return String.fromCharCode.apply(String, codePoints);
        }
        let res = "";
        let i = 0;
        while (i < len) {
          res += String.fromCharCode.apply(
            String,
            codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
          );
        }
        return res;
      }
      function asciiSlice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i] & 127);
        }
        return ret;
      }
      function latin1Slice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i]);
        }
        return ret;
      }
      function hexSlice(buf, start, end) {
        const len = buf.length;
        if (!start || start < 0) start = 0;
        if (!end || end < 0 || end > len) end = len;
        let out = "";
        for (let i = start; i < end; ++i) {
          out += hexSliceLookupTable[buf[i]];
        }
        return out;
      }
      function utf16leSlice(buf, start, end) {
        const bytes = buf.slice(start, end);
        let res = "";
        for (let i = 0; i < bytes.length - 1; i += 2) {
          res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
        }
        return res;
      }
      Buffer3.prototype.slice = function slice(start, end) {
        const len = this.length;
        start = ~~start;
        end = end === void 0 ? len : ~~end;
        if (start < 0) {
          start += len;
          if (start < 0) start = 0;
        } else if (start > len) {
          start = len;
        }
        if (end < 0) {
          end += len;
          if (end < 0) end = 0;
        } else if (end > len) {
          end = len;
        }
        if (end < start) end = start;
        const newBuf = this.subarray(start, end);
        Object.setPrototypeOf(newBuf, Buffer3.prototype);
        return newBuf;
      };
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
        if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
      }
      Buffer3.prototype.readUintLE = Buffer3.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        return val;
      };
      Buffer3.prototype.readUintBE = Buffer3.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          checkOffset(offset, byteLength2, this.length);
        }
        let val = this[offset + --byteLength2];
        let mul = 1;
        while (byteLength2 > 0 && (mul *= 256)) {
          val += this[offset + --byteLength2] * mul;
        }
        return val;
      };
      Buffer3.prototype.readUint8 = Buffer3.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        return this[offset];
      };
      Buffer3.prototype.readUint16LE = Buffer3.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };
      Buffer3.prototype.readUint16BE = Buffer3.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };
      Buffer3.prototype.readUint32LE = Buffer3.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
      };
      Buffer3.prototype.readUint32BE = Buffer3.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };
      Buffer3.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
        const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
        return BigInt(lo) + (BigInt(hi) << BigInt(32));
      });
      Buffer3.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
        return (BigInt(hi) << BigInt(32)) + BigInt(lo);
      });
      Buffer3.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer3.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let i = byteLength2;
        let mul = 1;
        let val = this[offset + --i];
        while (i > 0 && (mul *= 256)) {
          val += this[offset + --i] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer3.prototype.readInt8 = function readInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        if (!(this[offset] & 128)) return this[offset];
        return (255 - this[offset] + 1) * -1;
      };
      Buffer3.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset] | this[offset + 1] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer3.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset + 1] | this[offset] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer3.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };
      Buffer3.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };
      Buffer3.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
        return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
      });
      Buffer3.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = (first << 24) + // Overflow
        this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
      });
      Buffer3.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      };
      Buffer3.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      };
      Buffer3.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      };
      Buffer3.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      };
      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer3.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
      }
      Buffer3.prototype.writeUintLE = Buffer3.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let mul = 1;
        let i = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeUintBE = Buffer3.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeUint8 = Buffer3.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer3.prototype.writeUint16LE = Buffer3.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer3.prototype.writeUint16BE = Buffer3.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer3.prototype.writeUint32LE = Buffer3.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset + 3] = value >>> 24;
        this[offset + 2] = value >>> 16;
        this[offset + 1] = value >>> 8;
        this[offset] = value & 255;
        return offset + 4;
      };
      Buffer3.prototype.writeUint32BE = Buffer3.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      function wrtBigUInt64LE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        return offset;
      }
      function wrtBigUInt64BE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset + 7] = lo;
        lo = lo >> 8;
        buf[offset + 6] = lo;
        lo = lo >> 8;
        buf[offset + 5] = lo;
        lo = lo >> 8;
        buf[offset + 4] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset + 3] = hi;
        hi = hi >> 8;
        buf[offset + 2] = hi;
        hi = hi >> 8;
        buf[offset + 1] = hi;
        hi = hi >> 8;
        buf[offset] = hi;
        return offset + 8;
      }
      Buffer3.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer3.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer3.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = 0;
        let mul = 1;
        let sub = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        let sub = 0;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
        if (value < 0) value = 255 + value + 1;
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer3.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer3.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer3.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        this[offset + 2] = value >>> 16;
        this[offset + 3] = value >>> 24;
        return offset + 4;
      };
      Buffer3.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
        if (value < 0) value = 4294967295 + value + 1;
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      Buffer3.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      Buffer3.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
        if (offset < 0) throw new RangeError("Index out of range");
      }
      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
        }
        ieee754.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }
      Buffer3.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      };
      Buffer3.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      };
      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
        }
        ieee754.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }
      Buffer3.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      };
      Buffer3.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      };
      Buffer3.prototype.copy = function copy(target, targetStart, start, end) {
        if (!Buffer3.isBuffer(target)) throw new TypeError("argument should be a Buffer");
        if (!start) start = 0;
        if (!end && end !== 0) end = this.length;
        if (targetStart >= target.length) targetStart = target.length;
        if (!targetStart) targetStart = 0;
        if (end > 0 && end < start) end = start;
        if (end === start) return 0;
        if (target.length === 0 || this.length === 0) return 0;
        if (targetStart < 0) {
          throw new RangeError("targetStart out of bounds");
        }
        if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
        if (end < 0) throw new RangeError("sourceEnd out of bounds");
        if (end > this.length) end = this.length;
        if (target.length - targetStart < end - start) {
          end = target.length - targetStart + start;
        }
        const len = end - start;
        if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
          this.copyWithin(targetStart, start, end);
        } else {
          Uint8Array.prototype.set.call(
            target,
            this.subarray(start, end),
            targetStart
          );
        }
        return len;
      };
      Buffer3.prototype.fill = function fill(val, start, end, encoding) {
        if (typeof val === "string") {
          if (typeof start === "string") {
            encoding = start;
            start = 0;
            end = this.length;
          } else if (typeof end === "string") {
            encoding = end;
            end = this.length;
          }
          if (encoding !== void 0 && typeof encoding !== "string") {
            throw new TypeError("encoding must be a string");
          }
          if (typeof encoding === "string" && !Buffer3.isEncoding(encoding)) {
            throw new TypeError("Unknown encoding: " + encoding);
          }
          if (val.length === 1) {
            const code = val.charCodeAt(0);
            if (encoding === "utf8" && code < 128 || encoding === "latin1") {
              val = code;
            }
          }
        } else if (typeof val === "number") {
          val = val & 255;
        } else if (typeof val === "boolean") {
          val = Number(val);
        }
        if (start < 0 || this.length < start || this.length < end) {
          throw new RangeError("Out of range index");
        }
        if (end <= start) {
          return this;
        }
        start = start >>> 0;
        end = end === void 0 ? this.length : end >>> 0;
        if (!val) val = 0;
        let i;
        if (typeof val === "number") {
          for (i = start; i < end; ++i) {
            this[i] = val;
          }
        } else {
          const bytes = Buffer3.isBuffer(val) ? val : Buffer3.from(val, encoding);
          const len = bytes.length;
          if (len === 0) {
            throw new TypeError('The value "' + val + '" is invalid for argument "value"');
          }
          for (i = 0; i < end - start; ++i) {
            this[i + start] = bytes[i % len];
          }
        }
        return this;
      };
      var errors = {};
      function E(sym, getMessage, Base) {
        errors[sym] = class NodeError extends Base {
          constructor() {
            super();
            Object.defineProperty(this, "message", {
              value: getMessage.apply(this, arguments),
              writable: true,
              configurable: true
            });
            this.name = `${this.name} [${sym}]`;
            this.stack;
            delete this.name;
          }
          get code() {
            return sym;
          }
          set code(value) {
            Object.defineProperty(this, "code", {
              configurable: true,
              enumerable: true,
              value,
              writable: true
            });
          }
          toString() {
            return `${this.name} [${sym}]: ${this.message}`;
          }
        };
      }
      E(
        "ERR_BUFFER_OUT_OF_BOUNDS",
        function(name) {
          if (name) {
            return `${name} is outside of buffer bounds`;
          }
          return "Attempt to access memory outside buffer bounds";
        },
        RangeError
      );
      E(
        "ERR_INVALID_ARG_TYPE",
        function(name, actual) {
          return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
        },
        TypeError
      );
      E(
        "ERR_OUT_OF_RANGE",
        function(str, range, input) {
          let msg = `The value of "${str}" is out of range.`;
          let received = input;
          if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
            received = addNumericalSeparator(String(input));
          } else if (typeof input === "bigint") {
            received = String(input);
            if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
              received = addNumericalSeparator(received);
            }
            received += "n";
          }
          msg += ` It must be ${range}. Received ${received}`;
          return msg;
        },
        RangeError
      );
      function addNumericalSeparator(val) {
        let res = "";
        let i = val.length;
        const start = val[0] === "-" ? 1 : 0;
        for (; i >= start + 4; i -= 3) {
          res = `_${val.slice(i - 3, i)}${res}`;
        }
        return `${val.slice(0, i)}${res}`;
      }
      function checkBounds(buf, offset, byteLength2) {
        validateNumber(offset, "offset");
        if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
          boundsError(offset, buf.length - (byteLength2 + 1));
        }
      }
      function checkIntBI(value, min, max, buf, offset, byteLength2) {
        if (value > max || value < min) {
          const n = typeof min === "bigint" ? "n" : "";
          let range;
          if (byteLength2 > 3) {
            if (min === 0 || min === BigInt(0)) {
              range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
            } else {
              range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
            }
          } else {
            range = `>= ${min}${n} and <= ${max}${n}`;
          }
          throw new errors.ERR_OUT_OF_RANGE("value", range, value);
        }
        checkBounds(buf, offset, byteLength2);
      }
      function validateNumber(value, name) {
        if (typeof value !== "number") {
          throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
        }
      }
      function boundsError(value, length, type) {
        if (Math.floor(value) !== value) {
          validateNumber(value, type);
          throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
        }
        if (length < 0) {
          throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
        }
        throw new errors.ERR_OUT_OF_RANGE(
          type || "offset",
          `>= ${type ? 1 : 0} and <= ${length}`,
          value
        );
      }
      var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
      function base64clean(str) {
        str = str.split("=")[0];
        str = str.trim().replace(INVALID_BASE64_RE, "");
        if (str.length < 2) return "";
        while (str.length % 4 !== 0) {
          str = str + "=";
        }
        return str;
      }
      function utf8ToBytes2(string, units) {
        units = units || Infinity;
        let codePoint;
        const length = string.length;
        let leadSurrogate = null;
        const bytes = [];
        for (let i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i);
          if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
              if (codePoint > 56319) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              } else if (i + 1 === length) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              }
              leadSurrogate = codePoint;
              continue;
            }
            if (codePoint < 56320) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              leadSurrogate = codePoint;
              continue;
            }
            codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
          } else if (leadSurrogate) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
          }
          leadSurrogate = null;
          if (codePoint < 128) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
          } else if (codePoint < 2048) {
            if ((units -= 2) < 0) break;
            bytes.push(
              codePoint >> 6 | 192,
              codePoint & 63 | 128
            );
          } else if (codePoint < 65536) {
            if ((units -= 3) < 0) break;
            bytes.push(
              codePoint >> 12 | 224,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else if (codePoint < 1114112) {
            if ((units -= 4) < 0) break;
            bytes.push(
              codePoint >> 18 | 240,
              codePoint >> 12 & 63 | 128,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else {
            throw new Error("Invalid code point");
          }
        }
        return bytes;
      }
      function asciiToBytes(str) {
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          byteArray.push(str.charCodeAt(i) & 255);
        }
        return byteArray;
      }
      function utf16leToBytes(str, units) {
        let c, hi, lo;
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0) break;
          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }
        return byteArray;
      }
      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }
      function blitBuffer(src, dst, offset, length) {
        let i;
        for (i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length) break;
          dst[i + offset] = src[i];
        }
        return i;
      }
      function isInstance(obj, type) {
        return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
      }
      function numberIsNaN(obj) {
        return obj !== obj;
      }
      var hexSliceLookupTable = (function() {
        const alphabet = "0123456789abcdef";
        const table = new Array(256);
        for (let i = 0; i < 16; ++i) {
          const i16 = i * 16;
          for (let j = 0; j < 16; ++j) {
            table[i16 + j] = alphabet[i] + alphabet[j];
          }
        }
        return table;
      })();
      function defineBigIntMethod(fn) {
        return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
      }
      function BufferBigIntNotDefined() {
        throw new Error("BigInt not supported");
      }
    }
  });

  // web/js/slip39-buffer-inject.js
  var import_buffer;
  var init_slip39_buffer_inject = __esm({
    "web/js/slip39-buffer-inject.js"() {
      import_buffer = __toESM(require_buffer());
      if (typeof globalThis !== "undefined") {
        globalThis.Buffer = import_buffer.Buffer;
      }
    }
  });

  // node_modules/@noble/hashes/esm/utils.js
  function isBytes(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  }
  function anumber(n) {
    if (!Number.isSafeInteger(n) || n < 0)
      throw new Error("positive integer expected, got " + n);
  }
  function abytes(b, ...lengths) {
    if (!isBytes(b))
      throw new Error("Uint8Array expected");
    if (lengths.length > 0 && !lengths.includes(b.length))
      throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
  }
  function ahash(h) {
    if (typeof h !== "function" || typeof h.create !== "function")
      throw new Error("Hash should be wrapped by utils.createHasher");
    anumber(h.outputLen);
    anumber(h.blockLen);
  }
  function aexists(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function aoutput(out, instance) {
    abytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
      throw new Error("digestInto() expects output buffer of length at least " + min);
    }
  }
  function clean(...arrays) {
    for (let i = 0; i < arrays.length; i++) {
      arrays[i].fill(0);
    }
  }
  function createView(arr) {
    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
  }
  function rotr(word, shift) {
    return word << 32 - shift | word >>> shift;
  }
  function utf8ToBytes(str) {
    if (typeof str !== "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(str));
  }
  function toBytes(data) {
    if (typeof data === "string")
      data = utf8ToBytes(data);
    abytes(data);
    return data;
  }
  function kdfInputToBytes(data) {
    if (typeof data === "string")
      data = utf8ToBytes(data);
    abytes(data);
    return data;
  }
  function checkOpts(defaults, opts) {
    if (opts !== void 0 && {}.toString.call(opts) !== "[object Object]")
      throw new Error("options should be object or undefined");
    const merged = Object.assign(defaults, opts);
    return merged;
  }
  function createHasher(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
  }
  var Hash;
  var init_utils = __esm({
    "node_modules/@noble/hashes/esm/utils.js"() {
      init_slip39_buffer_inject();
      Hash = class {
      };
    }
  });

  // node_modules/@noble/hashes/esm/hmac.js
  var HMAC, hmac;
  var init_hmac = __esm({
    "node_modules/@noble/hashes/esm/hmac.js"() {
      init_slip39_buffer_inject();
      init_utils();
      HMAC = class extends Hash {
        constructor(hash, _key) {
          super();
          this.finished = false;
          this.destroyed = false;
          ahash(hash);
          const key = toBytes(_key);
          this.iHash = hash.create();
          if (typeof this.iHash.update !== "function")
            throw new Error("Expected instance of class which extends utils.Hash");
          this.blockLen = this.iHash.blockLen;
          this.outputLen = this.iHash.outputLen;
          const blockLen = this.blockLen;
          const pad = new Uint8Array(blockLen);
          pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
          for (let i = 0; i < pad.length; i++)
            pad[i] ^= 54;
          this.iHash.update(pad);
          this.oHash = hash.create();
          for (let i = 0; i < pad.length; i++)
            pad[i] ^= 54 ^ 92;
          this.oHash.update(pad);
          clean(pad);
        }
        update(buf) {
          aexists(this);
          this.iHash.update(buf);
          return this;
        }
        digestInto(out) {
          aexists(this);
          abytes(out, this.outputLen);
          this.finished = true;
          this.iHash.digestInto(out);
          this.oHash.update(out);
          this.oHash.digestInto(out);
          this.destroy();
        }
        digest() {
          const out = new Uint8Array(this.oHash.outputLen);
          this.digestInto(out);
          return out;
        }
        _cloneInto(to) {
          to || (to = Object.create(Object.getPrototypeOf(this), {}));
          const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
          to = to;
          to.finished = finished;
          to.destroyed = destroyed;
          to.blockLen = blockLen;
          to.outputLen = outputLen;
          to.oHash = oHash._cloneInto(to.oHash);
          to.iHash = iHash._cloneInto(to.iHash);
          return to;
        }
        clone() {
          return this._cloneInto();
        }
        destroy() {
          this.destroyed = true;
          this.oHash.destroy();
          this.iHash.destroy();
        }
      };
      hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
      hmac.create = (hash, key) => new HMAC(hash, key);
    }
  });

  // node_modules/@noble/hashes/esm/_md.js
  function setBigUint64(view, byteOffset, value, isLE) {
    if (typeof view.setBigUint64 === "function")
      return view.setBigUint64(byteOffset, value, isLE);
    const _32n = BigInt(32);
    const _u32_max = BigInt(4294967295);
    const wh = Number(value >> _32n & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE ? 4 : 0;
    const l = isLE ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE);
    view.setUint32(byteOffset + l, wl, isLE);
  }
  function Chi(a, b, c) {
    return a & b ^ ~a & c;
  }
  function Maj(a, b, c) {
    return a & b ^ a & c ^ b & c;
  }
  var HashMD, SHA256_IV;
  var init_md = __esm({
    "node_modules/@noble/hashes/esm/_md.js"() {
      init_slip39_buffer_inject();
      init_utils();
      HashMD = class extends Hash {
        constructor(blockLen, outputLen, padOffset, isLE) {
          super();
          this.finished = false;
          this.length = 0;
          this.pos = 0;
          this.destroyed = false;
          this.blockLen = blockLen;
          this.outputLen = outputLen;
          this.padOffset = padOffset;
          this.isLE = isLE;
          this.buffer = new Uint8Array(blockLen);
          this.view = createView(this.buffer);
        }
        update(data) {
          aexists(this);
          data = toBytes(data);
          abytes(data);
          const { view, buffer, blockLen } = this;
          const len = data.length;
          for (let pos = 0; pos < len; ) {
            const take = Math.min(blockLen - this.pos, len - pos);
            if (take === blockLen) {
              const dataView = createView(data);
              for (; blockLen <= len - pos; pos += blockLen)
                this.process(dataView, pos);
              continue;
            }
            buffer.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
              this.process(view, 0);
              this.pos = 0;
            }
          }
          this.length += data.length;
          this.roundClean();
          return this;
        }
        digestInto(out) {
          aexists(this);
          aoutput(out, this);
          this.finished = true;
          const { buffer, view, blockLen, isLE } = this;
          let { pos } = this;
          buffer[pos++] = 128;
          clean(this.buffer.subarray(pos));
          if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            pos = 0;
          }
          for (let i = pos; i < blockLen; i++)
            buffer[i] = 0;
          setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
          this.process(view, 0);
          const oview = createView(out);
          const len = this.outputLen;
          if (len % 4)
            throw new Error("_sha2: outputLen should be aligned to 32bit");
          const outLen = len / 4;
          const state = this.get();
          if (outLen > state.length)
            throw new Error("_sha2: outputLen bigger than state");
          for (let i = 0; i < outLen; i++)
            oview.setUint32(4 * i, state[i], isLE);
        }
        digest() {
          const { buffer, outputLen } = this;
          this.digestInto(buffer);
          const res = buffer.slice(0, outputLen);
          this.destroy();
          return res;
        }
        _cloneInto(to) {
          to || (to = new this.constructor());
          to.set(...this.get());
          const { blockLen, buffer, length, finished, destroyed, pos } = this;
          to.destroyed = destroyed;
          to.finished = finished;
          to.length = length;
          to.pos = pos;
          if (length % blockLen)
            to.buffer.set(buffer);
          return to;
        }
        clone() {
          return this._cloneInto();
        }
      };
      SHA256_IV = /* @__PURE__ */ Uint32Array.from([
        1779033703,
        3144134277,
        1013904242,
        2773480762,
        1359893119,
        2600822924,
        528734635,
        1541459225
      ]);
    }
  });

  // node_modules/@noble/hashes/esm/sha2.js
  var SHA256_K, SHA256_W, SHA256, sha256;
  var init_sha2 = __esm({
    "node_modules/@noble/hashes/esm/sha2.js"() {
      init_slip39_buffer_inject();
      init_md();
      init_utils();
      SHA256_K = /* @__PURE__ */ Uint32Array.from([
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
      ]);
      SHA256_W = /* @__PURE__ */ new Uint32Array(64);
      SHA256 = class extends HashMD {
        constructor(outputLen = 32) {
          super(64, outputLen, 8, false);
          this.A = SHA256_IV[0] | 0;
          this.B = SHA256_IV[1] | 0;
          this.C = SHA256_IV[2] | 0;
          this.D = SHA256_IV[3] | 0;
          this.E = SHA256_IV[4] | 0;
          this.F = SHA256_IV[5] | 0;
          this.G = SHA256_IV[6] | 0;
          this.H = SHA256_IV[7] | 0;
        }
        get() {
          const { A, B, C, D, E, F, G, H } = this;
          return [A, B, C, D, E, F, G, H];
        }
        // prettier-ignore
        set(A, B, C, D, E, F, G, H) {
          this.A = A | 0;
          this.B = B | 0;
          this.C = C | 0;
          this.D = D | 0;
          this.E = E | 0;
          this.F = F | 0;
          this.G = G | 0;
          this.H = H | 0;
        }
        process(view, offset) {
          for (let i = 0; i < 16; i++, offset += 4)
            SHA256_W[i] = view.getUint32(offset, false);
          for (let i = 16; i < 64; i++) {
            const W15 = SHA256_W[i - 15];
            const W2 = SHA256_W[i - 2];
            const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
            const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
            SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
          }
          let { A, B, C, D, E, F, G, H } = this;
          for (let i = 0; i < 64; i++) {
            const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
            const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
            const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
            const T2 = sigma0 + Maj(A, B, C) | 0;
            H = G;
            G = F;
            F = E;
            E = D + T1 | 0;
            D = C;
            C = B;
            B = A;
            A = T1 + T2 | 0;
          }
          A = A + this.A | 0;
          B = B + this.B | 0;
          C = C + this.C | 0;
          D = D + this.D | 0;
          E = E + this.E | 0;
          F = F + this.F | 0;
          G = G + this.G | 0;
          H = H + this.H | 0;
          this.set(A, B, C, D, E, F, G, H);
        }
        roundClean() {
          clean(SHA256_W);
        }
        destroy() {
          this.set(0, 0, 0, 0, 0, 0, 0, 0);
          clean(this.buffer);
        }
      };
      sha256 = /* @__PURE__ */ createHasher(() => new SHA256());
    }
  });

  // node_modules/@noble/hashes/esm/sha256.js
  var sha2562;
  var init_sha256 = __esm({
    "node_modules/@noble/hashes/esm/sha256.js"() {
      init_slip39_buffer_inject();
      init_sha2();
      sha2562 = sha256;
    }
  });

  // node_modules/@noble/hashes/esm/pbkdf2.js
  function pbkdf2Init(hash, _password, _salt, _opts) {
    ahash(hash);
    const opts = checkOpts({ dkLen: 32, asyncTick: 10 }, _opts);
    const { c, dkLen, asyncTick } = opts;
    anumber(c);
    anumber(dkLen);
    anumber(asyncTick);
    if (c < 1)
      throw new Error("iterations (c) should be >= 1");
    const password = kdfInputToBytes(_password);
    const salt = kdfInputToBytes(_salt);
    const DK = new Uint8Array(dkLen);
    const PRF = hmac.create(hash, password);
    const PRFSalt = PRF._cloneInto().update(salt);
    return { c, dkLen, asyncTick, DK, PRF, PRFSalt };
  }
  function pbkdf2Output(PRF, PRFSalt, DK, prfW, u) {
    PRF.destroy();
    PRFSalt.destroy();
    if (prfW)
      prfW.destroy();
    clean(u);
    return DK;
  }
  function pbkdf2(hash, password, salt, opts) {
    const { c, dkLen, DK, PRF, PRFSalt } = pbkdf2Init(hash, password, salt, opts);
    let prfW;
    const arr = new Uint8Array(4);
    const view = createView(arr);
    const u = new Uint8Array(PRF.outputLen);
    for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
      const Ti = DK.subarray(pos, pos + PRF.outputLen);
      view.setInt32(0, ti, false);
      (prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u);
      Ti.set(u.subarray(0, Ti.length));
      for (let ui = 1; ui < c; ui++) {
        PRF._cloneInto(prfW).update(u).digestInto(u);
        for (let i = 0; i < Ti.length; i++)
          Ti[i] ^= u[i];
      }
    }
    return pbkdf2Output(PRF, PRFSalt, DK, prfW, u);
  }
  var init_pbkdf2 = __esm({
    "node_modules/@noble/hashes/esm/pbkdf2.js"() {
      init_slip39_buffer_inject();
      init_hmac();
      init_utils();
    }
  });

  // web/js/slip39-crypto-shim.js
  var slip39_crypto_shim_exports = {};
  __export(slip39_crypto_shim_exports, {
    createHmac: () => createHmac,
    default: () => slip39_crypto_shim_default,
    pbkdf2Sync: () => pbkdf2Sync,
    randomBytes: () => randomBytes
  });
  function toU8(data) {
    if (data instanceof Uint8Array) return data;
    if (ArrayBuffer.isView(data)) {
      return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    }
    if (typeof data === "string") {
      return new TextEncoder().encode(data);
    }
    if (Array.isArray(data)) return Uint8Array.from(data);
    if (data && data.type === "Buffer" && Array.isArray(data.data)) {
      return Uint8Array.from(data.data);
    }
    return Uint8Array.from(data || []);
  }
  function randomBytes(length) {
    const out = new Uint8Array(length);
    crypto.getRandomValues(out);
    return out;
  }
  function pbkdf2Sync(password, salt, iterations, keylen, digest) {
    if (String(digest).toLowerCase() !== "sha256") {
      throw new Error("slip39-crypto-shim: only sha256 pbkdf2 supported");
    }
    return pbkdf2(sha2562, toU8(password), toU8(salt), {
      c: iterations,
      dkLen: keylen
    });
  }
  function createHmac(algorithm, key) {
    if (String(algorithm).toLowerCase() !== "sha256") {
      throw new Error("slip39-crypto-shim: only sha256 hmac supported");
    }
    const chunks = [];
    return {
      update(data) {
        chunks.push(toU8(data));
        return this;
      },
      digest() {
        let total = 0;
        for (const c of chunks) total += c.length;
        const msg = new Uint8Array(total);
        let off = 0;
        for (const c of chunks) {
          msg.set(c, off);
          off += c.length;
        }
        return hmac(sha2562, toU8(key), msg);
      }
    };
  }
  var api, slip39_crypto_shim_default;
  var init_slip39_crypto_shim = __esm({
    "web/js/slip39-crypto-shim.js"() {
      init_slip39_buffer_inject();
      init_hmac();
      init_sha256();
      init_pbkdf2();
      api = { randomBytes, pbkdf2Sync, createHmac };
      slip39_crypto_shim_default = api;
    }
  });

  // node_modules/slip39/src/slip39_helper.js
  var require_slip39_helper = __commonJS({
    "node_modules/slip39/src/slip39_helper.js"(exports, module) {
      init_slip39_buffer_inject();
      var crypto2;
      try {
        crypto2 = (init_slip39_crypto_shim(), __toCommonJS(slip39_crypto_shim_exports));
      } catch (err) {
        throw new Error("crypto support must be enabled");
      }
      var RADIX_BITS = 10;
      var ID_BITS_LENGTH = 15;
      var ITERATION_EXP_BITS_LENGTH = 4;
      var EXTENDABLE_BACKUP_FLAG_BITS_LENGTH = 1;
      var ITERATION_EXP_WORDS_LENGTH = parseInt(
        (ID_BITS_LENGTH + EXTENDABLE_BACKUP_FLAG_BITS_LENGTH + ITERATION_EXP_BITS_LENGTH + RADIX_BITS - 1) / RADIX_BITS,
        10
      );
      var MAX_ITERATION_EXP = Math.pow(2, ITERATION_EXP_BITS_LENGTH);
      var MAX_SHARE_COUNT = 16;
      var CHECKSUM_WORDS_LENGTH = 3;
      var DIGEST_LENGTH = 4;
      var CUSTOMIZATION_STRING_NON_EXTENDABLE = "shamir";
      var CUSTOMIZATION_STRING_EXTENDABLE = "shamir_extendable";
      var MIN_ENTROPY_BITS = 128;
      var METADATA_WORDS_LENGTH = ITERATION_EXP_WORDS_LENGTH + 2 + CHECKSUM_WORDS_LENGTH;
      var MNEMONICS_WORDS_LENGTH = parseInt(
        METADATA_WORDS_LENGTH + (MIN_ENTROPY_BITS + RADIX_BITS - 1) / RADIX_BITS,
        10
      );
      var ITERATION_COUNT = 1e4;
      var ROUND_COUNT = 4;
      var DIGEST_INDEX = 254;
      var SECRET_INDEX = 255;
      String.prototype.slip39EncodeHex = function() {
        let bytes = [];
        for (let i = 0; i < this.length; ++i) {
          bytes.push(this.charCodeAt(i));
        }
        return bytes;
      };
      Array.prototype.slip39DecodeHex = function() {
        let str = [];
        const hex = this.toString().split(",");
        for (let i = 0; i < hex.length; i++) {
          str.push(String.fromCharCode(hex[i]));
        }
        return str.toString().replace(/,/g, "");
      };
      Array.prototype.slip39Generate = function(m, v = (_) => _) {
        let n = m || this.length;
        for (let i = 0; i < n; i++) {
          this[i] = v(i);
        }
        return this;
      };
      Array.prototype.toHexString = function() {
        return Array.prototype.map.call(this, function(byte) {
          return ("0" + (byte & 255).toString(16)).slice(-2);
        }).join("");
      };
      Array.prototype.toByteArray = function(hexString) {
        for (let i = 0; i < hexString.length; i = i + 2) {
          this.push(parseInt(hexString.substr(i, 2), 16));
        }
        return this;
      };
      var BIGINT_WORD_BITS = BigInt(8);
      function decodeBigInt(bytes) {
        let result = BigInt(0);
        for (let i = 0; i < bytes.length; i++) {
          let b = BigInt(bytes[bytes.length - i - 1]);
          result = result + (b << BIGINT_WORD_BITS * BigInt(i));
        }
        return result;
      }
      function encodeBigInt(number, paddedLength = 0) {
        let num = number;
        const BYTE_MASK = BigInt(255);
        const BIGINT_ZERO = BigInt(0);
        let result = new Array(0);
        while (num > BIGINT_ZERO) {
          let i = parseInt(num & BYTE_MASK, 10);
          result.unshift(i);
          num = num >> BIGINT_WORD_BITS;
        }
        for (let i = result.length; i < paddedLength; i++) {
          result.unshift(0);
        }
        if (paddedLength !== 0 && result.length > paddedLength) {
          throw new Error(
            `Error in encoding BigInt value, expected less than ${paddedLength} length value, got ${result.length}`
          );
        }
        return result;
      }
      function bitsToBytes(n) {
        const res = (n + 7) / 8;
        const b = parseInt(res, RADIX_BITS);
        return b;
      }
      function bitsToWords(n) {
        const res = (n + RADIX_BITS - 1) / RADIX_BITS;
        const b = parseInt(res, RADIX_BITS);
        return b;
      }
      function randomBytes2(length = 32) {
        let randoms = crypto2.randomBytes(length);
        return Array.prototype.slice.call(randoms, 0);
      }
      function roundFunction(round, passphrase, exp, salt, secret) {
        const saltedSecret = salt.concat(secret);
        const roundedPhrase = [round].concat(passphrase);
        const count = (ITERATION_COUNT << exp) / ROUND_COUNT;
        const key = crypto2.pbkdf2Sync(
          import_buffer.Buffer.from(roundedPhrase),
          import_buffer.Buffer.from(saltedSecret),
          count,
          secret.length,
          "sha256"
        );
        return Array.prototype.slice.call(key, 0);
      }
      function crypt(masterSecret, passphrase, iterationExponent, identifier, extendableBackupFlag, encrypt = true) {
        if (iterationExponent < 0 || iterationExponent > MAX_ITERATION_EXP) {
          throw Error(
            `Invalid iteration exponent (${iterationExponent}). Expected between 0 and ${MAX_ITERATION_EXP}`
          );
        }
        let IL = masterSecret.slice().slice(0, masterSecret.length / 2);
        let IR = masterSecret.slice().slice(masterSecret.length / 2);
        const pwd = passphrase.slip39EncodeHex();
        const salt = getSalt(identifier, extendableBackupFlag);
        let range = Array().slip39Generate(ROUND_COUNT);
        range = encrypt ? range : range.reverse();
        range.forEach((round) => {
          const f = roundFunction(round, pwd, iterationExponent, salt, IR);
          const t = xor(IL, f);
          IL = IR;
          IR = t;
        });
        return IR.concat(IL);
      }
      function createDigest(randomData, sharedSecret) {
        const hmac2 = crypto2.createHmac("sha256", import_buffer.Buffer.from(randomData));
        hmac2.update(import_buffer.Buffer.from(sharedSecret));
        let result = hmac2.digest();
        result = result.slice(0, 4);
        return Array.prototype.slice.call(result, 0);
      }
      function splitSecret(threshold, shareCount, sharedSecret) {
        if (threshold <= 0) {
          throw Error(
            `The requested threshold (${threshold}) must be a positive integer.`
          );
        }
        if (threshold > shareCount) {
          throw Error(
            `The requested threshold (${threshold}) must not exceed the number of shares (${shareCount}).`
          );
        }
        if (shareCount > MAX_SHARE_COUNT) {
          throw Error(
            `The requested number of shares (${shareCount}) must not exceed ${MAX_SHARE_COUNT}.`
          );
        }
        if (threshold === 1) {
          return Array().slip39Generate(shareCount, () => sharedSecret);
        }
        const randomShareCount = threshold - 2;
        const randomPart = randomBytes2(sharedSecret.length - DIGEST_LENGTH);
        const digest = createDigest(randomPart, sharedSecret);
        let baseShares = /* @__PURE__ */ new Map();
        let shares = [];
        if (randomShareCount) {
          shares = Array().slip39Generate(
            randomShareCount,
            () => randomBytes2(sharedSecret.length)
          );
          shares.forEach((item, idx) => {
            baseShares.set(idx, item);
          });
        }
        baseShares.set(DIGEST_INDEX, digest.concat(randomPart));
        baseShares.set(SECRET_INDEX, sharedSecret);
        for (let i = randomShareCount; i < shareCount; i++) {
          const rr = interpolate(baseShares, i);
          shares.push(rr);
        }
        return shares;
      }
      function generateIdentifier() {
        const byte = bitsToBytes(ID_BITS_LENGTH);
        const bits = ID_BITS_LENGTH % 8;
        const identifier = randomBytes2(byte);
        identifier[0] = identifier[0] & (1 << bits) - 1;
        return identifier;
      }
      function xor(a, b) {
        if (a.length !== b.length) {
          throw new Error(
            `Invalid padding in mnemonic or insufficient length of mnemonics (${a.length} or ${b.length})`
          );
        }
        return Array().slip39Generate(a.length, (i) => a[i] ^ b[i]);
      }
      function getSalt(identifier, extendableBackupFlag) {
        if (extendableBackupFlag) {
          return [];
        } else {
          const salt = CUSTOMIZATION_STRING_NON_EXTENDABLE.slip39EncodeHex();
          return salt.concat(identifier);
        }
      }
      function interpolate(shares, x) {
        let xCoord = new Set(shares.keys());
        let arr = Array.from(shares.values(), (v) => v.length);
        let sharesValueLengths = new Set(arr);
        if (sharesValueLengths.size !== 1) {
          throw new Error(
            "Invalid set of shares. All share values must have the same length."
          );
        }
        if (xCoord.has(x)) {
          shares.forEach((v, k) => {
            if (k === x) {
              return v;
            }
          });
        }
        let logProd = 0;
        shares.forEach((v, k) => {
          logProd = logProd + LOG_TABLE[k ^ x];
        });
        let results = Array().slip39Generate(
          sharesValueLengths.values().next().value,
          () => 0
        );
        shares.forEach((v, k) => {
          let sum = 0;
          shares.forEach((vv, kk) => {
            sum = sum + LOG_TABLE[k ^ kk];
          });
          const basis = (logProd - LOG_TABLE[k ^ x] - sum) % 255;
          const logBasisEval = basis < 0 ? 255 + basis : basis;
          v.forEach((item, idx) => {
            const shareVal = item;
            const intermediateSum = results[idx];
            const r = shareVal !== 0 ? EXP_TABLE[(LOG_TABLE[shareVal] + logBasisEval) % 255] : 0;
            const res = intermediateSum ^ r;
            results[idx] = res;
          });
        });
        return results;
      }
      function rs1024Polymod(data) {
        const GEN = [
          14737472,
          29474944,
          58949888,
          117899776,
          235798537,
          470557714,
          940076068,
          814808136,
          565311632,
          66318624
        ];
        let chk = 1;
        data.forEach((byte) => {
          const b = chk >> 20;
          chk = (chk & 1048575) << 10 ^ byte;
          for (let i = 0; i < 10; i++) {
            let gen = (b >> i & 1) !== 0 ? GEN[i] : 0;
            chk = chk ^ gen;
          }
        });
        return chk;
      }
      function get_customization_string(extendableBackupFlag) {
        return extendableBackupFlag ? CUSTOMIZATION_STRING_EXTENDABLE : CUSTOMIZATION_STRING_NON_EXTENDABLE;
      }
      function rs1024CreateChecksum(data, extendableBackupFlag) {
        const values = get_customization_string(extendableBackupFlag).slip39EncodeHex().concat(data).concat(Array().slip39Generate(CHECKSUM_WORDS_LENGTH, () => 0));
        const polymod = rs1024Polymod(values) ^ 1;
        const result = Array().slip39Generate(CHECKSUM_WORDS_LENGTH, (i) => polymod >> 10 * i & 1023).reverse();
        return result;
      }
      function rs1024VerifyChecksum(data, extendableBackupFlag) {
        return rs1024Polymod(
          get_customization_string(extendableBackupFlag).slip39EncodeHex().concat(data)
        ) === 1;
      }
      function intFromIndices(indices) {
        let value = BigInt(0);
        const radix = BigInt(Math.pow(2, RADIX_BITS));
        indices.forEach((index) => {
          value = value * radix + BigInt(index);
        });
        return value;
      }
      function intToIndices(value, length, bits) {
        const mask = BigInt((1 << bits) - 1);
        const result = Array().slip39Generate(
          length,
          (i) => parseInt(value >> BigInt(i) * BigInt(bits) & mask, 10)
        );
        return result.reverse();
      }
      function mnemonicFromIndices(indices) {
        const result = indices.map((index) => {
          return WORD_LIST[index];
        });
        return result.toString().split(",").join(" ");
      }
      function mnemonicToIndices(mnemonic) {
        if (typeof mnemonic !== "string") {
          throw new Error(
            `Mnemonic expected to be typeof string with white space separated words. Instead found typeof ${typeof mnemonic}.`
          );
        }
        const words = mnemonic.toLowerCase().split(" ");
        const result = words.reduce((prev, item) => {
          const index = WORD_LIST_MAP[item];
          if (typeof index === "undefined") {
            throw new Error(`Invalid mnemonic word ${item}.`);
          }
          return prev.concat(index);
        }, []);
        return result;
      }
      function recoverSecret(threshold, shares) {
        if (threshold === 1) {
          return shares.values().next().value;
        }
        const sharedSecret = interpolate(shares, SECRET_INDEX);
        const digestShare = interpolate(shares, DIGEST_INDEX);
        const digest = digestShare.slice(0, DIGEST_LENGTH);
        const randomPart = digestShare.slice(DIGEST_LENGTH);
        const recoveredDigest = createDigest(randomPart, sharedSecret);
        if (!listsAreEqual(digest, recoveredDigest)) {
          throw new Error("Invalid digest of the shared secret.");
        }
        return sharedSecret;
      }
      function combineMnemonics(mnemonics, passphrase = "") {
        if (mnemonics === null || mnemonics.length === 0) {
          throw new Error("The list of mnemonics is empty.");
        }
        const decoded = decodeMnemonics(mnemonics);
        const identifier = decoded.identifier;
        const extendableBackupFlag = decoded.extendableBackupFlag;
        const iterationExponent = decoded.iterationExponent;
        const groupThreshold = decoded.groupThreshold;
        const groupCount = decoded.groupCount;
        const groups = decoded.groups;
        if (groups.size < groupThreshold) {
          throw new Error(
            `Insufficient number of mnemonic groups (${groups.size}). The required number of groups is ${groupThreshold}.`
          );
        }
        if (groups.size !== groupThreshold) {
          throw new Error(
            `Wrong number of mnemonic groups. Expected ${groupThreshold} groups, but ${groups.size} were provided.`
          );
        }
        let allShares = /* @__PURE__ */ new Map();
        groups.forEach((members, groupIndex) => {
          const threshold = members.keys().next().value;
          const shares = members.values().next().value;
          if (shares.size !== threshold) {
            const prefix = groupPrefix(
              identifier,
              extendableBackupFlag,
              iterationExponent,
              groupIndex,
              groupThreshold,
              groupCount
            );
            throw new Error(
              `Wrong number of mnemonics. Expected ${threshold} mnemonics starting with "${mnemonicFromIndices(prefix)}", 
 but ${shares.size} were provided.`
            );
          }
          const recovered = recoverSecret(threshold, shares);
          allShares.set(groupIndex, recovered);
        });
        const ems = recoverSecret(groupThreshold, allShares);
        const id = intToIndices(BigInt(identifier), ITERATION_EXP_WORDS_LENGTH, 8);
        const ms = crypt(
          ems,
          passphrase,
          iterationExponent,
          id,
          extendableBackupFlag,
          false
        );
        return ms;
      }
      function decodeMnemonics(mnemonics) {
        if (!(mnemonics instanceof Array)) {
          throw new Error("Mnemonics should be an array of strings");
        }
        const identifiers = /* @__PURE__ */ new Set();
        const extendableBackupFlags = /* @__PURE__ */ new Set();
        const iterationExponents = /* @__PURE__ */ new Set();
        const groupThresholds = /* @__PURE__ */ new Set();
        const groupCounts = /* @__PURE__ */ new Set();
        const groups = /* @__PURE__ */ new Map();
        mnemonics.forEach((mnemonic) => {
          const decoded = decodeMnemonic(mnemonic);
          identifiers.add(decoded.identifier);
          extendableBackupFlags.add(decoded.extendableBackupFlag);
          iterationExponents.add(decoded.iterationExponent);
          const groupIndex = decoded.groupIndex;
          groupThresholds.add(decoded.groupThreshold);
          groupCounts.add(decoded.groupCount);
          const memberIndex = decoded.memberIndex;
          const memberThreshold = decoded.memberThreshold;
          const share = decoded.share;
          const group = !groups.has(groupIndex) ? /* @__PURE__ */ new Map() : groups.get(groupIndex);
          const member = !group.has(memberThreshold) ? /* @__PURE__ */ new Map() : group.get(memberThreshold);
          member.set(memberIndex, share);
          group.set(memberThreshold, member);
          if (group.size !== 1) {
            throw new Error(
              "Invalid set of mnemonics. All mnemonics in a group must have the same member threshold."
            );
          }
          groups.set(groupIndex, group);
        });
        if (identifiers.size !== 1 || extendableBackupFlags.size !== 1 || iterationExponents.size !== 1) {
          throw new Error(
            `Invalid set of mnemonics. All mnemonics must begin with the same ${ITERATION_EXP_WORDS_LENGTH} words.`
          );
        }
        if (groupThresholds.size !== 1) {
          throw new Error(
            "Invalid set of mnemonics. All mnemonics must have the same group threshold."
          );
        }
        if (groupCounts.size !== 1) {
          throw new Error(
            "Invalid set of mnemonics. All mnemonics must have the same group count."
          );
        }
        return {
          identifier: identifiers.values().next().value,
          extendableBackupFlag: extendableBackupFlags.values().next().value,
          iterationExponent: iterationExponents.values().next().value,
          groupThreshold: groupThresholds.values().next().value,
          groupCount: groupCounts.values().next().value,
          groups
        };
      }
      function decodeMnemonic(mnemonic) {
        const data = mnemonicToIndices(mnemonic);
        if (data.length < MNEMONICS_WORDS_LENGTH) {
          throw new Error(
            `Invalid mnemonic length. The length of each mnemonic must be at least ${MNEMONICS_WORDS_LENGTH} words.`
          );
        }
        const paddingLen = RADIX_BITS * (data.length - METADATA_WORDS_LENGTH) % 16;
        if (paddingLen > 8) {
          throw new Error("Invalid mnemonic length.");
        }
        const idExpExtInt = parseInt(
          intFromIndices(data.slice(0, ITERATION_EXP_WORDS_LENGTH)),
          10
        );
        const identifier = idExpExtInt >> ITERATION_EXP_BITS_LENGTH + EXTENDABLE_BACKUP_FLAG_BITS_LENGTH;
        const extendableBackupFlag = idExpExtInt >> ITERATION_EXP_BITS_LENGTH & (1 << EXTENDABLE_BACKUP_FLAG_BITS_LENGTH) - 1;
        const iterationExponent = idExpExtInt & (1 << ITERATION_EXP_BITS_LENGTH) - 1;
        if (!rs1024VerifyChecksum(data, extendableBackupFlag)) {
          throw new Error("Invalid mnemonic checksum");
        }
        const tmp = intFromIndices(
          data.slice(ITERATION_EXP_WORDS_LENGTH, ITERATION_EXP_WORDS_LENGTH + 2)
        );
        const indices = intToIndices(tmp, 5, 4);
        const groupIndex = indices[0];
        const groupThreshold = indices[1];
        const groupCount = indices[2];
        const memberIndex = indices[3];
        const memberThreshold = indices[4];
        const valueData = data.slice(
          ITERATION_EXP_WORDS_LENGTH + 2,
          data.length - CHECKSUM_WORDS_LENGTH
        );
        if (groupCount < groupThreshold) {
          throw new Error(
            `Invalid mnemonic: ${mnemonic}.
 Group threshold (${groupThreshold}) cannot be greater than group count (${groupCount}).`
          );
        }
        const valueInt = intFromIndices(valueData);
        try {
          const valueByteCount = bitsToBytes(
            RADIX_BITS * valueData.length - paddingLen
          );
          const share = encodeBigInt(valueInt, valueByteCount);
          return {
            identifier,
            extendableBackupFlag,
            iterationExponent,
            groupIndex,
            groupThreshold: groupThreshold + 1,
            groupCount: groupCount + 1,
            memberIndex,
            memberThreshold: memberThreshold + 1,
            share
          };
        } catch (e) {
          throw new Error(`Invalid mnemonic padding (${e})`);
        }
      }
      function validateMnemonic(mnemonic) {
        try {
          decodeMnemonic(mnemonic);
          return true;
        } catch (error) {
          return false;
        }
      }
      function groupPrefix(identifier, extendableBackupFlag, iterationExponent, groupIndex, groupThreshold, groupCount) {
        const idExpInt = BigInt(
          (identifier << ITERATION_EXP_BITS_LENGTH + EXTENDABLE_BACKUP_FLAG_BITS_LENGTH) + (extendableBackupFlag << ITERATION_EXP_BITS_LENGTH) + iterationExponent
        );
        const indc = intToIndices(idExpInt, ITERATION_EXP_WORDS_LENGTH, RADIX_BITS);
        const indc2 = (groupIndex << 6) + (groupThreshold - 1 << 2) + (groupCount - 1 >> 2);
        indc.push(indc2);
        return indc;
      }
      function listsAreEqual(a, b) {
        if (a === null || b === null || a.length !== b.length) {
          return false;
        }
        let i = 0;
        return a.every((item) => {
          return b[i++] === item;
        });
      }
      function encodeMnemonic(identifier, extendableBackupFlag, iterationExponent, groupIndex, groupThreshold, groupCount, memberIndex, memberThreshold, value) {
        const valueWordCount = bitsToWords(value.length * 8);
        const valueInt = decodeBigInt(value);
        let newIdentifier = parseInt(decodeBigInt(identifier), 10);
        const gp = groupPrefix(
          newIdentifier,
          extendableBackupFlag,
          iterationExponent,
          groupIndex,
          groupThreshold,
          groupCount
        );
        const tp = intToIndices(valueInt, valueWordCount, RADIX_BITS);
        const calc = ((groupCount - 1 & 3) << 8) + (memberIndex << 4) + (memberThreshold - 1);
        gp.push(calc);
        const shareData = gp.concat(tp);
        const checksum = rs1024CreateChecksum(shareData, extendableBackupFlag);
        return mnemonicFromIndices(shareData.concat(checksum));
      }
      var EXP_TABLE = [
        1,
        3,
        5,
        15,
        17,
        51,
        85,
        255,
        26,
        46,
        114,
        150,
        161,
        248,
        19,
        53,
        95,
        225,
        56,
        72,
        216,
        115,
        149,
        164,
        247,
        2,
        6,
        10,
        30,
        34,
        102,
        170,
        229,
        52,
        92,
        228,
        55,
        89,
        235,
        38,
        106,
        190,
        217,
        112,
        144,
        171,
        230,
        49,
        83,
        245,
        4,
        12,
        20,
        60,
        68,
        204,
        79,
        209,
        104,
        184,
        211,
        110,
        178,
        205,
        76,
        212,
        103,
        169,
        224,
        59,
        77,
        215,
        98,
        166,
        241,
        8,
        24,
        40,
        120,
        136,
        131,
        158,
        185,
        208,
        107,
        189,
        220,
        127,
        129,
        152,
        179,
        206,
        73,
        219,
        118,
        154,
        181,
        196,
        87,
        249,
        16,
        48,
        80,
        240,
        11,
        29,
        39,
        105,
        187,
        214,
        97,
        163,
        254,
        25,
        43,
        125,
        135,
        146,
        173,
        236,
        47,
        113,
        147,
        174,
        233,
        32,
        96,
        160,
        251,
        22,
        58,
        78,
        210,
        109,
        183,
        194,
        93,
        231,
        50,
        86,
        250,
        21,
        63,
        65,
        195,
        94,
        226,
        61,
        71,
        201,
        64,
        192,
        91,
        237,
        44,
        116,
        156,
        191,
        218,
        117,
        159,
        186,
        213,
        100,
        172,
        239,
        42,
        126,
        130,
        157,
        188,
        223,
        122,
        142,
        137,
        128,
        155,
        182,
        193,
        88,
        232,
        35,
        101,
        175,
        234,
        37,
        111,
        177,
        200,
        67,
        197,
        84,
        252,
        31,
        33,
        99,
        165,
        244,
        7,
        9,
        27,
        45,
        119,
        153,
        176,
        203,
        70,
        202,
        69,
        207,
        74,
        222,
        121,
        139,
        134,
        145,
        168,
        227,
        62,
        66,
        198,
        81,
        243,
        14,
        18,
        54,
        90,
        238,
        41,
        123,
        141,
        140,
        143,
        138,
        133,
        148,
        167,
        242,
        13,
        23,
        57,
        75,
        221,
        124,
        132,
        151,
        162,
        253,
        28,
        36,
        108,
        180,
        199,
        82,
        246
      ];
      var LOG_TABLE = [
        0,
        0,
        25,
        1,
        50,
        2,
        26,
        198,
        75,
        199,
        27,
        104,
        51,
        238,
        223,
        3,
        100,
        4,
        224,
        14,
        52,
        141,
        129,
        239,
        76,
        113,
        8,
        200,
        248,
        105,
        28,
        193,
        125,
        194,
        29,
        181,
        249,
        185,
        39,
        106,
        77,
        228,
        166,
        114,
        154,
        201,
        9,
        120,
        101,
        47,
        138,
        5,
        33,
        15,
        225,
        36,
        18,
        240,
        130,
        69,
        53,
        147,
        218,
        142,
        150,
        143,
        219,
        189,
        54,
        208,
        206,
        148,
        19,
        92,
        210,
        241,
        64,
        70,
        131,
        56,
        102,
        221,
        253,
        48,
        191,
        6,
        139,
        98,
        179,
        37,
        226,
        152,
        34,
        136,
        145,
        16,
        126,
        110,
        72,
        195,
        163,
        182,
        30,
        66,
        58,
        107,
        40,
        84,
        250,
        133,
        61,
        186,
        43,
        121,
        10,
        21,
        155,
        159,
        94,
        202,
        78,
        212,
        172,
        229,
        243,
        115,
        167,
        87,
        175,
        88,
        168,
        80,
        244,
        234,
        214,
        116,
        79,
        174,
        233,
        213,
        231,
        230,
        173,
        232,
        44,
        215,
        117,
        122,
        235,
        22,
        11,
        245,
        89,
        203,
        95,
        176,
        156,
        169,
        81,
        160,
        127,
        12,
        246,
        111,
        23,
        196,
        73,
        236,
        216,
        67,
        31,
        45,
        164,
        118,
        123,
        183,
        204,
        187,
        62,
        90,
        251,
        96,
        177,
        134,
        59,
        82,
        161,
        108,
        170,
        85,
        41,
        157,
        151,
        178,
        135,
        144,
        97,
        190,
        220,
        252,
        188,
        149,
        207,
        205,
        55,
        63,
        91,
        209,
        83,
        57,
        132,
        60,
        65,
        162,
        109,
        71,
        20,
        42,
        158,
        93,
        86,
        242,
        211,
        171,
        68,
        17,
        146,
        217,
        35,
        32,
        46,
        137,
        180,
        124,
        184,
        38,
        119,
        153,
        227,
        165,
        103,
        74,
        237,
        222,
        197,
        49,
        254,
        24,
        13,
        99,
        140,
        128,
        192,
        247,
        112,
        7
      ];
      var WORD_LIST = [
        "academic",
        "acid",
        "acne",
        "acquire",
        "acrobat",
        "activity",
        "actress",
        "adapt",
        "adequate",
        "adjust",
        "admit",
        "adorn",
        "adult",
        "advance",
        "advocate",
        "afraid",
        "again",
        "agency",
        "agree",
        "aide",
        "aircraft",
        "airline",
        "airport",
        "ajar",
        "alarm",
        "album",
        "alcohol",
        "alien",
        "alive",
        "alpha",
        "already",
        "alto",
        "aluminum",
        "always",
        "amazing",
        "ambition",
        "amount",
        "amuse",
        "analysis",
        "anatomy",
        "ancestor",
        "ancient",
        "angel",
        "angry",
        "animal",
        "answer",
        "antenna",
        "anxiety",
        "apart",
        "aquatic",
        "arcade",
        "arena",
        "argue",
        "armed",
        "artist",
        "artwork",
        "aspect",
        "auction",
        "august",
        "aunt",
        "average",
        "aviation",
        "avoid",
        "award",
        "away",
        "axis",
        "axle",
        "beam",
        "beard",
        "beaver",
        "become",
        "bedroom",
        "behavior",
        "being",
        "believe",
        "belong",
        "benefit",
        "best",
        "beyond",
        "bike",
        "biology",
        "birthday",
        "bishop",
        "black",
        "blanket",
        "blessing",
        "blimp",
        "blind",
        "blue",
        "body",
        "bolt",
        "boring",
        "born",
        "both",
        "boundary",
        "bracelet",
        "branch",
        "brave",
        "breathe",
        "briefing",
        "broken",
        "brother",
        "browser",
        "bucket",
        "budget",
        "building",
        "bulb",
        "bulge",
        "bumpy",
        "bundle",
        "burden",
        "burning",
        "busy",
        "buyer",
        "cage",
        "calcium",
        "camera",
        "campus",
        "canyon",
        "capacity",
        "capital",
        "capture",
        "carbon",
        "cards",
        "careful",
        "cargo",
        "carpet",
        "carve",
        "category",
        "cause",
        "ceiling",
        "center",
        "ceramic",
        "champion",
        "change",
        "charity",
        "check",
        "chemical",
        "chest",
        "chew",
        "chubby",
        "cinema",
        "civil",
        "class",
        "clay",
        "cleanup",
        "client",
        "climate",
        "clinic",
        "clock",
        "clogs",
        "closet",
        "clothes",
        "club",
        "cluster",
        "coal",
        "coastal",
        "coding",
        "column",
        "company",
        "corner",
        "costume",
        "counter",
        "course",
        "cover",
        "cowboy",
        "cradle",
        "craft",
        "crazy",
        "credit",
        "cricket",
        "criminal",
        "crisis",
        "critical",
        "crowd",
        "crucial",
        "crunch",
        "crush",
        "crystal",
        "cubic",
        "cultural",
        "curious",
        "curly",
        "custody",
        "cylinder",
        "daisy",
        "damage",
        "dance",
        "darkness",
        "database",
        "daughter",
        "deadline",
        "deal",
        "debris",
        "debut",
        "decent",
        "decision",
        "declare",
        "decorate",
        "decrease",
        "deliver",
        "demand",
        "density",
        "deny",
        "depart",
        "depend",
        "depict",
        "deploy",
        "describe",
        "desert",
        "desire",
        "desktop",
        "destroy",
        "detailed",
        "detect",
        "device",
        "devote",
        "diagnose",
        "dictate",
        "diet",
        "dilemma",
        "diminish",
        "dining",
        "diploma",
        "disaster",
        "discuss",
        "disease",
        "dish",
        "dismiss",
        "display",
        "distance",
        "dive",
        "divorce",
        "document",
        "domain",
        "domestic",
        "dominant",
        "dough",
        "downtown",
        "dragon",
        "dramatic",
        "dream",
        "dress",
        "drift",
        "drink",
        "drove",
        "drug",
        "dryer",
        "duckling",
        "duke",
        "duration",
        "dwarf",
        "dynamic",
        "early",
        "earth",
        "easel",
        "easy",
        "echo",
        "eclipse",
        "ecology",
        "edge",
        "editor",
        "educate",
        "either",
        "elbow",
        "elder",
        "election",
        "elegant",
        "element",
        "elephant",
        "elevator",
        "elite",
        "else",
        "email",
        "emerald",
        "emission",
        "emperor",
        "emphasis",
        "employer",
        "empty",
        "ending",
        "endless",
        "endorse",
        "enemy",
        "energy",
        "enforce",
        "engage",
        "enjoy",
        "enlarge",
        "entrance",
        "envelope",
        "envy",
        "epidemic",
        "episode",
        "equation",
        "equip",
        "eraser",
        "erode",
        "escape",
        "estate",
        "estimate",
        "evaluate",
        "evening",
        "evidence",
        "evil",
        "evoke",
        "exact",
        "example",
        "exceed",
        "exchange",
        "exclude",
        "excuse",
        "execute",
        "exercise",
        "exhaust",
        "exotic",
        "expand",
        "expect",
        "explain",
        "express",
        "extend",
        "extra",
        "eyebrow",
        "facility",
        "fact",
        "failure",
        "faint",
        "fake",
        "false",
        "family",
        "famous",
        "fancy",
        "fangs",
        "fantasy",
        "fatal",
        "fatigue",
        "favorite",
        "fawn",
        "fiber",
        "fiction",
        "filter",
        "finance",
        "findings",
        "finger",
        "firefly",
        "firm",
        "fiscal",
        "fishing",
        "fitness",
        "flame",
        "flash",
        "flavor",
        "flea",
        "flexible",
        "flip",
        "float",
        "floral",
        "fluff",
        "focus",
        "forbid",
        "force",
        "forecast",
        "forget",
        "formal",
        "fortune",
        "forward",
        "founder",
        "fraction",
        "fragment",
        "frequent",
        "freshman",
        "friar",
        "fridge",
        "friendly",
        "frost",
        "froth",
        "frozen",
        "fumes",
        "funding",
        "furl",
        "fused",
        "galaxy",
        "game",
        "garbage",
        "garden",
        "garlic",
        "gasoline",
        "gather",
        "general",
        "genius",
        "genre",
        "genuine",
        "geology",
        "gesture",
        "glad",
        "glance",
        "glasses",
        "glen",
        "glimpse",
        "goat",
        "golden",
        "graduate",
        "grant",
        "grasp",
        "gravity",
        "gray",
        "greatest",
        "grief",
        "grill",
        "grin",
        "grocery",
        "gross",
        "group",
        "grownup",
        "grumpy",
        "guard",
        "guest",
        "guilt",
        "guitar",
        "gums",
        "hairy",
        "hamster",
        "hand",
        "hanger",
        "harvest",
        "have",
        "havoc",
        "hawk",
        "hazard",
        "headset",
        "health",
        "hearing",
        "heat",
        "helpful",
        "herald",
        "herd",
        "hesitate",
        "hobo",
        "holiday",
        "holy",
        "home",
        "hormone",
        "hospital",
        "hour",
        "huge",
        "human",
        "humidity",
        "hunting",
        "husband",
        "hush",
        "husky",
        "hybrid",
        "idea",
        "identify",
        "idle",
        "image",
        "impact",
        "imply",
        "improve",
        "impulse",
        "include",
        "income",
        "increase",
        "index",
        "indicate",
        "industry",
        "infant",
        "inform",
        "inherit",
        "injury",
        "inmate",
        "insect",
        "inside",
        "install",
        "intend",
        "intimate",
        "invasion",
        "involve",
        "iris",
        "island",
        "isolate",
        "item",
        "ivory",
        "jacket",
        "jerky",
        "jewelry",
        "join",
        "judicial",
        "juice",
        "jump",
        "junction",
        "junior",
        "junk",
        "jury",
        "justice",
        "kernel",
        "keyboard",
        "kidney",
        "kind",
        "kitchen",
        "knife",
        "knit",
        "laden",
        "ladle",
        "ladybug",
        "lair",
        "lamp",
        "language",
        "large",
        "laser",
        "laundry",
        "lawsuit",
        "leader",
        "leaf",
        "learn",
        "leaves",
        "lecture",
        "legal",
        "legend",
        "legs",
        "lend",
        "length",
        "level",
        "liberty",
        "library",
        "license",
        "lift",
        "likely",
        "lilac",
        "lily",
        "lips",
        "liquid",
        "listen",
        "literary",
        "living",
        "lizard",
        "loan",
        "lobe",
        "location",
        "losing",
        "loud",
        "loyalty",
        "luck",
        "lunar",
        "lunch",
        "lungs",
        "luxury",
        "lying",
        "lyrics",
        "machine",
        "magazine",
        "maiden",
        "mailman",
        "main",
        "makeup",
        "making",
        "mama",
        "manager",
        "mandate",
        "mansion",
        "manual",
        "marathon",
        "march",
        "market",
        "marvel",
        "mason",
        "material",
        "math",
        "maximum",
        "mayor",
        "meaning",
        "medal",
        "medical",
        "member",
        "memory",
        "mental",
        "merchant",
        "merit",
        "method",
        "metric",
        "midst",
        "mild",
        "military",
        "mineral",
        "minister",
        "miracle",
        "mixed",
        "mixture",
        "mobile",
        "modern",
        "modify",
        "moisture",
        "moment",
        "morning",
        "mortgage",
        "mother",
        "mountain",
        "mouse",
        "move",
        "much",
        "mule",
        "multiple",
        "muscle",
        "museum",
        "music",
        "mustang",
        "nail",
        "national",
        "necklace",
        "negative",
        "nervous",
        "network",
        "news",
        "nuclear",
        "numb",
        "numerous",
        "nylon",
        "oasis",
        "obesity",
        "object",
        "observe",
        "obtain",
        "ocean",
        "often",
        "olympic",
        "omit",
        "oral",
        "orange",
        "orbit",
        "order",
        "ordinary",
        "organize",
        "ounce",
        "oven",
        "overall",
        "owner",
        "paces",
        "pacific",
        "package",
        "paid",
        "painting",
        "pajamas",
        "pancake",
        "pants",
        "papa",
        "paper",
        "parcel",
        "parking",
        "party",
        "patent",
        "patrol",
        "payment",
        "payroll",
        "peaceful",
        "peanut",
        "peasant",
        "pecan",
        "penalty",
        "pencil",
        "percent",
        "perfect",
        "permit",
        "petition",
        "phantom",
        "pharmacy",
        "photo",
        "phrase",
        "physics",
        "pickup",
        "picture",
        "piece",
        "pile",
        "pink",
        "pipeline",
        "pistol",
        "pitch",
        "plains",
        "plan",
        "plastic",
        "platform",
        "playoff",
        "pleasure",
        "plot",
        "plunge",
        "practice",
        "prayer",
        "preach",
        "predator",
        "pregnant",
        "premium",
        "prepare",
        "presence",
        "prevent",
        "priest",
        "primary",
        "priority",
        "prisoner",
        "privacy",
        "prize",
        "problem",
        "process",
        "profile",
        "program",
        "promise",
        "prospect",
        "provide",
        "prune",
        "public",
        "pulse",
        "pumps",
        "punish",
        "puny",
        "pupal",
        "purchase",
        "purple",
        "python",
        "quantity",
        "quarter",
        "quick",
        "quiet",
        "race",
        "racism",
        "radar",
        "railroad",
        "rainbow",
        "raisin",
        "random",
        "ranked",
        "rapids",
        "raspy",
        "reaction",
        "realize",
        "rebound",
        "rebuild",
        "recall",
        "receiver",
        "recover",
        "regret",
        "regular",
        "reject",
        "relate",
        "remember",
        "remind",
        "remove",
        "render",
        "repair",
        "repeat",
        "replace",
        "require",
        "rescue",
        "research",
        "resident",
        "response",
        "result",
        "retailer",
        "retreat",
        "reunion",
        "revenue",
        "review",
        "reward",
        "rhyme",
        "rhythm",
        "rich",
        "rival",
        "river",
        "robin",
        "rocky",
        "romantic",
        "romp",
        "roster",
        "round",
        "royal",
        "ruin",
        "ruler",
        "rumor",
        "sack",
        "safari",
        "salary",
        "salon",
        "salt",
        "satisfy",
        "satoshi",
        "saver",
        "says",
        "scandal",
        "scared",
        "scatter",
        "scene",
        "scholar",
        "science",
        "scout",
        "scramble",
        "screw",
        "script",
        "scroll",
        "seafood",
        "season",
        "secret",
        "security",
        "segment",
        "senior",
        "shadow",
        "shaft",
        "shame",
        "shaped",
        "sharp",
        "shelter",
        "sheriff",
        "short",
        "should",
        "shrimp",
        "sidewalk",
        "silent",
        "silver",
        "similar",
        "simple",
        "single",
        "sister",
        "skin",
        "skunk",
        "slap",
        "slavery",
        "sled",
        "slice",
        "slim",
        "slow",
        "slush",
        "smart",
        "smear",
        "smell",
        "smirk",
        "smith",
        "smoking",
        "smug",
        "snake",
        "snapshot",
        "sniff",
        "society",
        "software",
        "soldier",
        "solution",
        "soul",
        "source",
        "space",
        "spark",
        "speak",
        "species",
        "spelling",
        "spend",
        "spew",
        "spider",
        "spill",
        "spine",
        "spirit",
        "spit",
        "spray",
        "sprinkle",
        "square",
        "squeeze",
        "stadium",
        "staff",
        "standard",
        "starting",
        "station",
        "stay",
        "steady",
        "step",
        "stick",
        "stilt",
        "story",
        "strategy",
        "strike",
        "style",
        "subject",
        "submit",
        "sugar",
        "suitable",
        "sunlight",
        "superior",
        "surface",
        "surprise",
        "survive",
        "sweater",
        "swimming",
        "swing",
        "switch",
        "symbolic",
        "sympathy",
        "syndrome",
        "system",
        "tackle",
        "tactics",
        "tadpole",
        "talent",
        "task",
        "taste",
        "taught",
        "taxi",
        "teacher",
        "teammate",
        "teaspoon",
        "temple",
        "tenant",
        "tendency",
        "tension",
        "terminal",
        "testify",
        "texture",
        "thank",
        "that",
        "theater",
        "theory",
        "therapy",
        "thorn",
        "threaten",
        "thumb",
        "thunder",
        "ticket",
        "tidy",
        "timber",
        "timely",
        "ting",
        "tofu",
        "together",
        "tolerate",
        "total",
        "toxic",
        "tracks",
        "traffic",
        "training",
        "transfer",
        "trash",
        "traveler",
        "treat",
        "trend",
        "trial",
        "tricycle",
        "trip",
        "triumph",
        "trouble",
        "true",
        "trust",
        "twice",
        "twin",
        "type",
        "typical",
        "ugly",
        "ultimate",
        "umbrella",
        "uncover",
        "undergo",
        "unfair",
        "unfold",
        "unhappy",
        "union",
        "universe",
        "unkind",
        "unknown",
        "unusual",
        "unwrap",
        "upgrade",
        "upstairs",
        "username",
        "usher",
        "usual",
        "valid",
        "valuable",
        "vampire",
        "vanish",
        "various",
        "vegan",
        "velvet",
        "venture",
        "verdict",
        "verify",
        "very",
        "veteran",
        "vexed",
        "victim",
        "video",
        "view",
        "vintage",
        "violence",
        "viral",
        "visitor",
        "visual",
        "vitamins",
        "vocal",
        "voice",
        "volume",
        "voter",
        "voting",
        "walnut",
        "warmth",
        "warn",
        "watch",
        "wavy",
        "wealthy",
        "weapon",
        "webcam",
        "welcome",
        "welfare",
        "western",
        "width",
        "wildlife",
        "window",
        "wine",
        "wireless",
        "wisdom",
        "withdraw",
        "wits",
        "wolf",
        "woman",
        "work",
        "worthy",
        "wrap",
        "wrist",
        "writing",
        "wrote",
        "year",
        "yelp",
        "yield",
        "yoga",
        "zero"
      ];
      var WORD_LIST_MAP = WORD_LIST.reduce((obj, val, idx) => {
        obj[val] = idx;
        return obj;
      }, {});
      exports = module.exports = {
        MIN_ENTROPY_BITS,
        generateIdentifier,
        encodeMnemonic,
        validateMnemonic,
        splitSecret,
        combineMnemonics,
        crypt,
        bitsToBytes,
        WORD_LIST
      };
    }
  });

  // node_modules/slip39/src/slip39.js
  var require_slip39 = __commonJS({
    "node_modules/slip39/src/slip39.js"(exports, module) {
      init_slip39_buffer_inject();
      var slipHelper = require_slip39_helper();
      var MAX_DEPTH = 2;
      var Slip39Node = class {
        constructor(index = 0, description = "", mnemonic = "", children = []) {
          this.index = index;
          this.description = description;
          this.mnemonic = mnemonic;
          this.children = children;
        }
        get mnemonics() {
          if (this.children.length === 0) {
            return [this.mnemonic];
          }
          const result = this.children.reduce((prev, item) => {
            return prev.concat(item.mnemonics);
          }, []);
          return result;
        }
      };
      var Slip39 = class _Slip39 {
        constructor({
          iterationExponent = 0,
          extendableBackupFlag = 0,
          identifier,
          groupCount,
          groupThreshold
        } = {}) {
          this.iterationExponent = iterationExponent;
          this.extendableBackupFlag = extendableBackupFlag;
          this.identifier = identifier;
          this.groupCount = groupCount;
          this.groupThreshold = groupThreshold;
        }
        static fromArray(masterSecret, {
          passphrase = "",
          threshold = 1,
          groups = [[1, 1, "Default 1-of-1 group share"]],
          iterationExponent = 0,
          extendableBackupFlag = 1,
          title = "My default slip39 shares"
        } = {}) {
          if (masterSecret.length * 8 < slipHelper.MIN_ENTROPY_BITS) {
            throw Error(
              `The length of the master secret (${masterSecret.length} bytes) must be at least ${slipHelper.bitsToBytes(slipHelper.MIN_ENTROPY_BITS)} bytes.`
            );
          }
          if (masterSecret.length % 2 !== 0) {
            throw Error(
              "The length of the master secret in bytes must be an even number."
            );
          }
          if (!/^[\x20-\x7E]*$/.test(passphrase)) {
            throw Error(
              "The passphrase must contain only printable ASCII characters (code points 32-126)."
            );
          }
          if (threshold > groups.length) {
            throw Error(
              `The requested group threshold (${threshold}) must not exceed the number of groups (${groups.length}).`
            );
          }
          groups.forEach((item) => {
            if (item[0] === 1 && item[1] > 1) {
              throw Error(
                `Creating multiple member shares with member threshold 1 is not allowed. Use 1-of-1 member sharing instead. ${groups.join()}`
              );
            }
          });
          const identifier = slipHelper.generateIdentifier();
          const slip = new _Slip39({
            iterationExponent,
            extendableBackupFlag,
            identifier,
            groupCount: groups.length,
            groupThreshold: threshold
          });
          const encryptedMasterSecret = slipHelper.crypt(
            masterSecret,
            passphrase,
            iterationExponent,
            slip.identifier,
            extendableBackupFlag
          );
          const root = slip.buildRecursive(
            new Slip39Node(0, title),
            groups,
            encryptedMasterSecret,
            threshold
          );
          slip.root = root;
          return slip;
        }
        buildRecursive(currentNode, nodes, secret, threshold, index) {
          if (nodes.length === 0) {
            const mnemonic = slipHelper.encodeMnemonic(
              this.identifier,
              this.extendableBackupFlag,
              this.iterationExponent,
              index,
              this.groupThreshold,
              this.groupCount,
              currentNode.index,
              threshold,
              secret
            );
            currentNode.mnemonic = mnemonic;
            return currentNode;
          }
          const secretShares = slipHelper.splitSecret(
            threshold,
            nodes.length,
            secret
          );
          let children = [];
          let idx = 0;
          nodes.forEach((item) => {
            const n = item[0];
            const m = item[1];
            const d = item[2] || "";
            const members = Array().slip39Generate(m, () => [n, 0, d]);
            const node = new Slip39Node(idx, d);
            const branch = this.buildRecursive(
              node,
              members,
              secretShares[idx],
              n,
              currentNode.index
            );
            children = children.concat(branch);
            idx = idx + 1;
          });
          currentNode.children = children;
          return currentNode;
        }
        static recoverSecret(mnemonics, passphrase) {
          return slipHelper.combineMnemonics(mnemonics, passphrase);
        }
        static validateMnemonic(mnemonic) {
          return slipHelper.validateMnemonic(mnemonic);
        }
        fromPath(path) {
          this.validatePath(path);
          const children = this.parseChildren(path);
          if (typeof children === "undefined" || children.length === 0) {
            return this.root;
          }
          return children.reduce((prev, childNumber) => {
            let childrenLen = prev.children.length;
            if (childNumber >= childrenLen) {
              throw new Error(
                `The path index (${childNumber}) exceeds the children index (${childrenLen - 1}).`
              );
            }
            return prev.children[childNumber];
          }, this.root);
        }
        validatePath(path) {
          if (!path.match(/(^r)(\/\d{1,2}){0,2}$/)) {
            throw new Error('Expected valid path e.g. "r/0/0".');
          }
          const depth = path.split("/");
          const pathLength = depth.length - 1;
          if (pathLength > MAX_DEPTH) {
            throw new Error(
              `Path's (${path}) max depth (${MAX_DEPTH}) is exceeded (${pathLength}).`
            );
          }
        }
        parseChildren(path) {
          const splitted = path.split("/").slice(1);
          const result = splitted.map((pathFragment) => {
            return parseInt(pathFragment);
          });
          return result;
        }
      };
      exports = module.exports = Slip39;
    }
  });

  // web/js/slip39-entry.mjs
  init_slip39_buffer_inject();
  var import_slip39 = __toESM(require_slip39(), 1);
  function hexToBytes(hex) {
    const raw = String(hex || "").trim().toLowerCase().replace(/^0x/, "");
    if (!raw) throw new Error("Master secret hex is empty.");
    if (raw.length % 2 !== 0 || /[^0-9a-f]/.test(raw)) {
      throw new Error("Master secret must be even-length hex.");
    }
    if (raw.length < 32) {
      throw new Error("Master secret must be at least 16 bytes (32 hex chars).");
    }
    const out = [];
    for (let i = 0; i < raw.length; i += 2) {
      out.push(parseInt(raw.slice(i, i + 2), 16));
    }
    return out;
  }
  function bytesToHex(bytes) {
    if (!bytes) return "";
    if (typeof bytes.slip39DecodeHex === "function") {
    }
    const arr = Array.from(bytes);
    return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  function randomMasterHex(byteLen) {
    const n = byteLen || 16;
    const buf = new Uint8Array(n);
    crypto.getRandomValues(buf);
    return bytesToHex(buf);
  }
  function splitSingleGroup(masterHex, threshold, shareCount, passphrase) {
    const secret = hexToBytes(masterHex);
    if (threshold < 1 || shareCount < 1 || threshold > shareCount) {
      throw new Error("Need 1 \u2264 threshold \u2264 shareCount.");
    }
    const slip = import_slip39.default.fromArray(secret, {
      passphrase: passphrase || "",
      threshold: 1,
      // one group required
      groups: [[threshold, shareCount]]
    });
    const mnemonics = [];
    for (let i = 0; i < shareCount; i++) {
      const m = slip.fromPath("r/0/" + i).mnemonics;
      if (!m || !m[0]) throw new Error("Missing mnemonic at index " + i);
      mnemonics.push(m[0]);
    }
    return mnemonics;
  }
  function combineShares(mnemonics, passphrase) {
    const cleaned = (mnemonics || []).map((s) => String(s || "").trim()).filter(Boolean);
    if (!cleaned.length) throw new Error("No share mnemonics provided.");
    const recovered = import_slip39.default.recoverSecret(cleaned, passphrase || "");
    return bytesToHex(recovered);
  }
  function matchExpected(recoveredHex, expectedHex) {
    const a = String(recoveredHex || "").trim().toLowerCase().replace(/^0x/, "");
    const b = String(expectedHex || "").trim().toLowerCase().replace(/^0x/, "");
    if (a.length !== b.length || !a.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
      diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return diff === 0;
  }
  var api2 = {
    splitSingleGroup,
    combineShares,
    matchExpected,
    randomMasterHex,
    hexToBytes,
    bytesToHex,
    PRESETS: { "2of3": { m: 2, n: 3 }, "3of5": { m: 3, n: 5 } }
  };
  if (typeof globalThis !== "undefined") {
    globalThis.Slip39Lab = api2;
  }
  var slip39_entry_default = api2;
})();
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
