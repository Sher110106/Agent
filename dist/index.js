var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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

// node_modules/papaparse/papaparse.min.js
var require_papaparse_min = __commonJS({
  "node_modules/papaparse/papaparse.min.js"(exports, module) {
    ((e, t) => {
      "function" == typeof define && define.amd ? define([], t) : "object" == typeof module && "undefined" != typeof exports ? module.exports = t() : e.Papa = t();
    })(exports, /* @__PURE__ */ __name(function r() {
      var n = "undefined" != typeof self ? self : "undefined" != typeof window ? window : void 0 !== n ? n : {};
      var d, s = !n.document && !!n.postMessage, a = n.IS_PAPA_WORKER || false, o = {}, h = 0, v = {};
      function u(e) {
        this._handle = null, this._finished = false, this._completed = false, this._halted = false, this._input = null, this._baseIndex = 0, this._partialLine = "", this._rowCount = 0, this._start = 0, this._nextChunk = null, this.isFirstChunk = true, this._completeResults = { data: [], errors: [], meta: {} }, function(e2) {
          var t = b(e2);
          t.chunkSize = parseInt(t.chunkSize), e2.step || e2.chunk || (t.chunkSize = null);
          this._handle = new i(t), (this._handle.streamer = this)._config = t;
        }.call(this, e), this.parseChunk = function(t, e2) {
          var i2 = parseInt(this._config.skipFirstNLines) || 0;
          if (this.isFirstChunk && 0 < i2) {
            let e3 = this._config.newline;
            e3 || (r2 = this._config.quoteChar || '"', e3 = this._handle.guessLineEndings(t, r2)), t = [...t.split(e3).slice(i2)].join(e3);
          }
          this.isFirstChunk && U(this._config.beforeFirstChunk) && void 0 !== (r2 = this._config.beforeFirstChunk(t)) && (t = r2), this.isFirstChunk = false, this._halted = false;
          var i2 = this._partialLine + t, r2 = (this._partialLine = "", this._handle.parse(i2, this._baseIndex, !this._finished));
          if (!this._handle.paused() && !this._handle.aborted()) {
            t = r2.meta.cursor, i2 = (this._finished || (this._partialLine = i2.substring(t - this._baseIndex), this._baseIndex = t), r2 && r2.data && (this._rowCount += r2.data.length), this._finished || this._config.preview && this._rowCount >= this._config.preview);
            if (a) n.postMessage({ results: r2, workerId: v.WORKER_ID, finished: i2 });
            else if (U(this._config.chunk) && !e2) {
              if (this._config.chunk(r2, this._handle), this._handle.paused() || this._handle.aborted()) return void (this._halted = true);
              this._completeResults = r2 = void 0;
            }
            return this._config.step || this._config.chunk || (this._completeResults.data = this._completeResults.data.concat(r2.data), this._completeResults.errors = this._completeResults.errors.concat(r2.errors), this._completeResults.meta = r2.meta), this._completed || !i2 || !U(this._config.complete) || r2 && r2.meta.aborted || (this._config.complete(this._completeResults, this._input), this._completed = true), i2 || r2 && r2.meta.paused || this._nextChunk(), r2;
          }
          this._halted = true;
        }, this._sendError = function(e2) {
          U(this._config.error) ? this._config.error(e2) : a && this._config.error && n.postMessage({ workerId: v.WORKER_ID, error: e2, finished: false });
        };
      }
      __name(u, "u");
      function f(e) {
        var r2;
        (e = e || {}).chunkSize || (e.chunkSize = v.RemoteChunkSize), u.call(this, e), this._nextChunk = s ? function() {
          this._readChunk(), this._chunkLoaded();
        } : function() {
          this._readChunk();
        }, this.stream = function(e2) {
          this._input = e2, this._nextChunk();
        }, this._readChunk = function() {
          if (this._finished) this._chunkLoaded();
          else {
            if (r2 = new XMLHttpRequest(), this._config.withCredentials && (r2.withCredentials = this._config.withCredentials), s || (r2.onload = y(this._chunkLoaded, this), r2.onerror = y(this._chunkError, this)), r2.open(this._config.downloadRequestBody ? "POST" : "GET", this._input, !s), this._config.downloadRequestHeaders) {
              var e2, t = this._config.downloadRequestHeaders;
              for (e2 in t) r2.setRequestHeader(e2, t[e2]);
            }
            var i2;
            this._config.chunkSize && (i2 = this._start + this._config.chunkSize - 1, r2.setRequestHeader("Range", "bytes=" + this._start + "-" + i2));
            try {
              r2.send(this._config.downloadRequestBody);
            } catch (e3) {
              this._chunkError(e3.message);
            }
            s && 0 === r2.status && this._chunkError();
          }
        }, this._chunkLoaded = function() {
          4 === r2.readyState && (r2.status < 200 || 400 <= r2.status ? this._chunkError() : (this._start += this._config.chunkSize || r2.responseText.length, this._finished = !this._config.chunkSize || this._start >= ((e2) => null !== (e2 = e2.getResponseHeader("Content-Range")) ? parseInt(e2.substring(e2.lastIndexOf("/") + 1)) : -1)(r2), this.parseChunk(r2.responseText)));
        }, this._chunkError = function(e2) {
          e2 = r2.statusText || e2;
          this._sendError(new Error(e2));
        };
      }
      __name(f, "f");
      function l(e) {
        (e = e || {}).chunkSize || (e.chunkSize = v.LocalChunkSize), u.call(this, e);
        var i2, r2, n2 = "undefined" != typeof FileReader;
        this.stream = function(e2) {
          this._input = e2, r2 = e2.slice || e2.webkitSlice || e2.mozSlice, n2 ? ((i2 = new FileReader()).onload = y(this._chunkLoaded, this), i2.onerror = y(this._chunkError, this)) : i2 = new FileReaderSync(), this._nextChunk();
        }, this._nextChunk = function() {
          this._finished || this._config.preview && !(this._rowCount < this._config.preview) || this._readChunk();
        }, this._readChunk = function() {
          var e2 = this._input, t = (this._config.chunkSize && (t = Math.min(this._start + this._config.chunkSize, this._input.size), e2 = r2.call(e2, this._start, t)), i2.readAsText(e2, this._config.encoding));
          n2 || this._chunkLoaded({ target: { result: t } });
        }, this._chunkLoaded = function(e2) {
          this._start += this._config.chunkSize, this._finished = !this._config.chunkSize || this._start >= this._input.size, this.parseChunk(e2.target.result);
        }, this._chunkError = function() {
          this._sendError(i2.error);
        };
      }
      __name(l, "l");
      function c(e) {
        var i2;
        u.call(this, e = e || {}), this.stream = function(e2) {
          return i2 = e2, this._nextChunk();
        }, this._nextChunk = function() {
          var e2, t;
          if (!this._finished) return e2 = this._config.chunkSize, i2 = e2 ? (t = i2.substring(0, e2), i2.substring(e2)) : (t = i2, ""), this._finished = !i2, this.parseChunk(t);
        };
      }
      __name(c, "c");
      function p(e) {
        u.call(this, e = e || {});
        var t = [], i2 = true, r2 = false;
        this.pause = function() {
          u.prototype.pause.apply(this, arguments), this._input.pause();
        }, this.resume = function() {
          u.prototype.resume.apply(this, arguments), this._input.resume();
        }, this.stream = function(e2) {
          this._input = e2, this._input.on("data", this._streamData), this._input.on("end", this._streamEnd), this._input.on("error", this._streamError);
        }, this._checkIsFinished = function() {
          r2 && 1 === t.length && (this._finished = true);
        }, this._nextChunk = function() {
          this._checkIsFinished(), t.length ? this.parseChunk(t.shift()) : i2 = true;
        }, this._streamData = y(function(e2) {
          try {
            t.push("string" == typeof e2 ? e2 : e2.toString(this._config.encoding)), i2 && (i2 = false, this._checkIsFinished(), this.parseChunk(t.shift()));
          } catch (e3) {
            this._streamError(e3);
          }
        }, this), this._streamError = y(function(e2) {
          this._streamCleanUp(), this._sendError(e2);
        }, this), this._streamEnd = y(function() {
          this._streamCleanUp(), r2 = true, this._streamData("");
        }, this), this._streamCleanUp = y(function() {
          this._input.removeListener("data", this._streamData), this._input.removeListener("end", this._streamEnd), this._input.removeListener("error", this._streamError);
        }, this);
      }
      __name(p, "p");
      function i(m2) {
        var n2, s2, a2, t, o2 = Math.pow(2, 53), h2 = -o2, u2 = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/, d2 = /^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/, i2 = this, r2 = 0, f2 = 0, l2 = false, e = false, c2 = [], p2 = { data: [], errors: [], meta: {} };
        function y2(e2) {
          return "greedy" === m2.skipEmptyLines ? "" === e2.join("").trim() : 1 === e2.length && 0 === e2[0].length;
        }
        __name(y2, "y");
        function g2() {
          if (p2 && a2 && (k("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + v.DefaultDelimiter + "'"), a2 = false), m2.skipEmptyLines && (p2.data = p2.data.filter(function(e3) {
            return !y2(e3);
          })), _2()) {
            let t3 = function(e3, t4) {
              U(m2.transformHeader) && (e3 = m2.transformHeader(e3, t4)), c2.push(e3);
            };
            var t2 = t3;
            __name(t3, "t");
            if (p2) if (Array.isArray(p2.data[0])) {
              for (var e2 = 0; _2() && e2 < p2.data.length; e2++) p2.data[e2].forEach(t3);
              p2.data.splice(0, 1);
            } else p2.data.forEach(t3);
          }
          function i3(e3, t3) {
            for (var i4 = m2.header ? {} : [], r4 = 0; r4 < e3.length; r4++) {
              var n3 = r4, s3 = e3[r4], s3 = ((e4, t4) => ((e5) => (m2.dynamicTypingFunction && void 0 === m2.dynamicTyping[e5] && (m2.dynamicTyping[e5] = m2.dynamicTypingFunction(e5)), true === (m2.dynamicTyping[e5] || m2.dynamicTyping)))(e4) ? "true" === t4 || "TRUE" === t4 || "false" !== t4 && "FALSE" !== t4 && (((e5) => {
                if (u2.test(e5)) {
                  e5 = parseFloat(e5);
                  if (h2 < e5 && e5 < o2) return 1;
                }
              })(t4) ? parseFloat(t4) : d2.test(t4) ? new Date(t4) : "" === t4 ? null : t4) : t4)(n3 = m2.header ? r4 >= c2.length ? "__parsed_extra" : c2[r4] : n3, s3 = m2.transform ? m2.transform(s3, n3) : s3);
              "__parsed_extra" === n3 ? (i4[n3] = i4[n3] || [], i4[n3].push(s3)) : i4[n3] = s3;
            }
            return m2.header && (r4 > c2.length ? k("FieldMismatch", "TooManyFields", "Too many fields: expected " + c2.length + " fields but parsed " + r4, f2 + t3) : r4 < c2.length && k("FieldMismatch", "TooFewFields", "Too few fields: expected " + c2.length + " fields but parsed " + r4, f2 + t3)), i4;
          }
          __name(i3, "i");
          var r3;
          p2 && (m2.header || m2.dynamicTyping || m2.transform) && (r3 = 1, !p2.data.length || Array.isArray(p2.data[0]) ? (p2.data = p2.data.map(i3), r3 = p2.data.length) : p2.data = i3(p2.data, 0), m2.header && p2.meta && (p2.meta.fields = c2), f2 += r3);
        }
        __name(g2, "g");
        function _2() {
          return m2.header && 0 === c2.length;
        }
        __name(_2, "_");
        function k(e2, t2, i3, r3) {
          e2 = { type: e2, code: t2, message: i3 };
          void 0 !== r3 && (e2.row = r3), p2.errors.push(e2);
        }
        __name(k, "k");
        U(m2.step) && (t = m2.step, m2.step = function(e2) {
          p2 = e2, _2() ? g2() : (g2(), 0 !== p2.data.length && (r2 += e2.data.length, m2.preview && r2 > m2.preview ? s2.abort() : (p2.data = p2.data[0], t(p2, i2))));
        }), this.parse = function(e2, t2, i3) {
          var r3 = m2.quoteChar || '"', r3 = (m2.newline || (m2.newline = this.guessLineEndings(e2, r3)), a2 = false, m2.delimiter ? U(m2.delimiter) && (m2.delimiter = m2.delimiter(e2), p2.meta.delimiter = m2.delimiter) : ((r3 = ((e3, t3, i4, r4, n3) => {
            var s3, a3, o3, h3;
            n3 = n3 || [",", "	", "|", ";", v.RECORD_SEP, v.UNIT_SEP];
            for (var u3 = 0; u3 < n3.length; u3++) {
              for (var d3, f3 = n3[u3], l3 = 0, c3 = 0, p3 = 0, g3 = (o3 = void 0, new E({ comments: r4, delimiter: f3, newline: t3, preview: 10 }).parse(e3)), _3 = 0; _3 < g3.data.length; _3++) i4 && y2(g3.data[_3]) ? p3++ : (d3 = g3.data[_3].length, c3 += d3, void 0 === o3 ? o3 = d3 : 0 < d3 && (l3 += Math.abs(d3 - o3), o3 = d3));
              0 < g3.data.length && (c3 /= g3.data.length - p3), (void 0 === a3 || l3 <= a3) && (void 0 === h3 || h3 < c3) && 1.99 < c3 && (a3 = l3, s3 = f3, h3 = c3);
            }
            return { successful: !!(m2.delimiter = s3), bestDelimiter: s3 };
          })(e2, m2.newline, m2.skipEmptyLines, m2.comments, m2.delimitersToGuess)).successful ? m2.delimiter = r3.bestDelimiter : (a2 = true, m2.delimiter = v.DefaultDelimiter), p2.meta.delimiter = m2.delimiter), b(m2));
          return m2.preview && m2.header && r3.preview++, n2 = e2, s2 = new E(r3), p2 = s2.parse(n2, t2, i3), g2(), l2 ? { meta: { paused: true } } : p2 || { meta: { paused: false } };
        }, this.paused = function() {
          return l2;
        }, this.pause = function() {
          l2 = true, s2.abort(), n2 = U(m2.chunk) ? "" : n2.substring(s2.getCharIndex());
        }, this.resume = function() {
          i2.streamer._halted ? (l2 = false, i2.streamer.parseChunk(n2, true)) : setTimeout(i2.resume, 3);
        }, this.aborted = function() {
          return e;
        }, this.abort = function() {
          e = true, s2.abort(), p2.meta.aborted = true, U(m2.complete) && m2.complete(p2), n2 = "";
        }, this.guessLineEndings = function(e2, t2) {
          e2 = e2.substring(0, 1048576);
          var t2 = new RegExp(P(t2) + "([^]*?)" + P(t2), "gm"), i3 = (e2 = e2.replace(t2, "")).split("\r"), t2 = e2.split("\n"), e2 = 1 < t2.length && t2[0].length < i3[0].length;
          if (1 === i3.length || e2) return "\n";
          for (var r3 = 0, n3 = 0; n3 < i3.length; n3++) "\n" === i3[n3][0] && r3++;
          return r3 >= i3.length / 2 ? "\r\n" : "\r";
        };
      }
      __name(i, "i");
      function P(e) {
        return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
      __name(P, "P");
      function E(C) {
        var S = (C = C || {}).delimiter, O = C.newline, x = C.comments, I = C.step, A = C.preview, T = C.fastMode, D = null, L = false, F = null == C.quoteChar ? '"' : C.quoteChar, j = F;
        if (void 0 !== C.escapeChar && (j = C.escapeChar), ("string" != typeof S || -1 < v.BAD_DELIMITERS.indexOf(S)) && (S = ","), x === S) throw new Error("Comment character same as delimiter");
        true === x ? x = "#" : ("string" != typeof x || -1 < v.BAD_DELIMITERS.indexOf(x)) && (x = false), "\n" !== O && "\r" !== O && "\r\n" !== O && (O = "\n");
        var z = 0, M = false;
        this.parse = function(i2, t, r2) {
          if ("string" != typeof i2) throw new Error("Input must be a string");
          var n2 = i2.length, e = S.length, s2 = O.length, a2 = x.length, o2 = U(I), h2 = [], u2 = [], d2 = [], f2 = z = 0;
          if (!i2) return w();
          if (T || false !== T && -1 === i2.indexOf(F)) {
            for (var l2 = i2.split(O), c2 = 0; c2 < l2.length; c2++) {
              if (d2 = l2[c2], z += d2.length, c2 !== l2.length - 1) z += O.length;
              else if (r2) return w();
              if (!x || d2.substring(0, a2) !== x) {
                if (o2) {
                  if (h2 = [], k(d2.split(S)), R(), M) return w();
                } else k(d2.split(S));
                if (A && A <= c2) return h2 = h2.slice(0, A), w(true);
              }
            }
            return w();
          }
          for (var p2 = i2.indexOf(S, z), g2 = i2.indexOf(O, z), _2 = new RegExp(P(j) + P(F), "g"), m2 = i2.indexOf(F, z); ; ) if (i2[z] === F) for (m2 = z, z++; ; ) {
            if (-1 === (m2 = i2.indexOf(F, m2 + 1))) return r2 || u2.push({ type: "Quotes", code: "MissingQuotes", message: "Quoted field unterminated", row: h2.length, index: z }), E2();
            if (m2 === n2 - 1) return E2(i2.substring(z, m2).replace(_2, F));
            if (F === j && i2[m2 + 1] === j) m2++;
            else if (F === j || 0 === m2 || i2[m2 - 1] !== j) {
              -1 !== p2 && p2 < m2 + 1 && (p2 = i2.indexOf(S, m2 + 1));
              var y2 = v2(-1 === (g2 = -1 !== g2 && g2 < m2 + 1 ? i2.indexOf(O, m2 + 1) : g2) ? p2 : Math.min(p2, g2));
              if (i2.substr(m2 + 1 + y2, e) === S) {
                d2.push(i2.substring(z, m2).replace(_2, F)), i2[z = m2 + 1 + y2 + e] !== F && (m2 = i2.indexOf(F, z)), p2 = i2.indexOf(S, z), g2 = i2.indexOf(O, z);
                break;
              }
              y2 = v2(g2);
              if (i2.substring(m2 + 1 + y2, m2 + 1 + y2 + s2) === O) {
                if (d2.push(i2.substring(z, m2).replace(_2, F)), b2(m2 + 1 + y2 + s2), p2 = i2.indexOf(S, z), m2 = i2.indexOf(F, z), o2 && (R(), M)) return w();
                if (A && h2.length >= A) return w(true);
                break;
              }
              u2.push({ type: "Quotes", code: "InvalidQuotes", message: "Trailing quote on quoted field is malformed", row: h2.length, index: z }), m2++;
            }
          }
          else if (x && 0 === d2.length && i2.substring(z, z + a2) === x) {
            if (-1 === g2) return w();
            z = g2 + s2, g2 = i2.indexOf(O, z), p2 = i2.indexOf(S, z);
          } else if (-1 !== p2 && (p2 < g2 || -1 === g2)) d2.push(i2.substring(z, p2)), z = p2 + e, p2 = i2.indexOf(S, z);
          else {
            if (-1 === g2) break;
            if (d2.push(i2.substring(z, g2)), b2(g2 + s2), o2 && (R(), M)) return w();
            if (A && h2.length >= A) return w(true);
          }
          return E2();
          function k(e2) {
            h2.push(e2), f2 = z;
          }
          __name(k, "k");
          function v2(e2) {
            var t2 = 0;
            return t2 = -1 !== e2 && (e2 = i2.substring(m2 + 1, e2)) && "" === e2.trim() ? e2.length : t2;
          }
          __name(v2, "v");
          function E2(e2) {
            return r2 || (void 0 === e2 && (e2 = i2.substring(z)), d2.push(e2), z = n2, k(d2), o2 && R()), w();
          }
          __name(E2, "E");
          function b2(e2) {
            z = e2, k(d2), d2 = [], g2 = i2.indexOf(O, z);
          }
          __name(b2, "b");
          function w(e2) {
            if (C.header && !t && h2.length && !L) {
              var s3 = h2[0], a3 = /* @__PURE__ */ Object.create(null), o3 = new Set(s3);
              let n3 = false;
              for (let r3 = 0; r3 < s3.length; r3++) {
                let i3 = s3[r3];
                if (a3[i3 = U(C.transformHeader) ? C.transformHeader(i3, r3) : i3]) {
                  let e3, t2 = a3[i3];
                  for (; e3 = i3 + "_" + t2, t2++, o3.has(e3); ) ;
                  o3.add(e3), s3[r3] = e3, a3[i3]++, n3 = true, (D = null === D ? {} : D)[e3] = i3;
                } else a3[i3] = 1, s3[r3] = i3;
                o3.add(i3);
              }
              n3 && console.warn("Duplicate headers found and renamed."), L = true;
            }
            return { data: h2, errors: u2, meta: { delimiter: S, linebreak: O, aborted: M, truncated: !!e2, cursor: f2 + (t || 0), renamedHeaders: D } };
          }
          __name(w, "w");
          function R() {
            I(w()), h2 = [], u2 = [];
          }
          __name(R, "R");
        }, this.abort = function() {
          M = true;
        }, this.getCharIndex = function() {
          return z;
        };
      }
      __name(E, "E");
      function g(e) {
        var t = e.data, i2 = o[t.workerId], r2 = false;
        if (t.error) i2.userError(t.error, t.file);
        else if (t.results && t.results.data) {
          var n2 = { abort: /* @__PURE__ */ __name(function() {
            r2 = true, _(t.workerId, { data: [], errors: [], meta: { aborted: true } });
          }, "abort"), pause: m, resume: m };
          if (U(i2.userStep)) {
            for (var s2 = 0; s2 < t.results.data.length && (i2.userStep({ data: t.results.data[s2], errors: t.results.errors, meta: t.results.meta }, n2), !r2); s2++) ;
            delete t.results;
          } else U(i2.userChunk) && (i2.userChunk(t.results, n2, t.file), delete t.results);
        }
        t.finished && !r2 && _(t.workerId, t.results);
      }
      __name(g, "g");
      function _(e, t) {
        var i2 = o[e];
        U(i2.userComplete) && i2.userComplete(t), i2.terminate(), delete o[e];
      }
      __name(_, "_");
      function m() {
        throw new Error("Not implemented.");
      }
      __name(m, "m");
      function b(e) {
        if ("object" != typeof e || null === e) return e;
        var t, i2 = Array.isArray(e) ? [] : {};
        for (t in e) i2[t] = b(e[t]);
        return i2;
      }
      __name(b, "b");
      function y(e, t) {
        return function() {
          e.apply(t, arguments);
        };
      }
      __name(y, "y");
      function U(e) {
        return "function" == typeof e;
      }
      __name(U, "U");
      return v.parse = function(e, t) {
        var i2 = (t = t || {}).dynamicTyping || false;
        U(i2) && (t.dynamicTypingFunction = i2, i2 = {});
        if (t.dynamicTyping = i2, t.transform = !!U(t.transform) && t.transform, !t.worker || !v.WORKERS_SUPPORTED) return i2 = null, v.NODE_STREAM_INPUT, "string" == typeof e ? (e = ((e2) => 65279 !== e2.charCodeAt(0) ? e2 : e2.slice(1))(e), i2 = new (t.download ? f : c)(t)) : true === e.readable && U(e.read) && U(e.on) ? i2 = new p(t) : (n.File && e instanceof File || e instanceof Object) && (i2 = new l(t)), i2.stream(e);
        (i2 = (() => {
          var e2;
          return !!v.WORKERS_SUPPORTED && (e2 = (() => {
            var e3 = n.URL || n.webkitURL || null, t2 = r.toString();
            return v.BLOB_URL || (v.BLOB_URL = e3.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ", "(", t2, ")();"], { type: "text/javascript" })));
          })(), (e2 = new n.Worker(e2)).onmessage = g, e2.id = h++, o[e2.id] = e2);
        })()).userStep = t.step, i2.userChunk = t.chunk, i2.userComplete = t.complete, i2.userError = t.error, t.step = U(t.step), t.chunk = U(t.chunk), t.complete = U(t.complete), t.error = U(t.error), delete t.worker, i2.postMessage({ input: e, config: t, workerId: i2.id });
      }, v.unparse = function(e, t) {
        var n2 = false, _2 = true, m2 = ",", y2 = "\r\n", s2 = '"', a2 = s2 + s2, i2 = false, r2 = null, o2 = false, h2 = ((() => {
          if ("object" == typeof t) {
            if ("string" != typeof t.delimiter || v.BAD_DELIMITERS.filter(function(e2) {
              return -1 !== t.delimiter.indexOf(e2);
            }).length || (m2 = t.delimiter), "boolean" != typeof t.quotes && "function" != typeof t.quotes && !Array.isArray(t.quotes) || (n2 = t.quotes), "boolean" != typeof t.skipEmptyLines && "string" != typeof t.skipEmptyLines || (i2 = t.skipEmptyLines), "string" == typeof t.newline && (y2 = t.newline), "string" == typeof t.quoteChar && (s2 = t.quoteChar), "boolean" == typeof t.header && (_2 = t.header), Array.isArray(t.columns)) {
              if (0 === t.columns.length) throw new Error("Option columns is empty");
              r2 = t.columns;
            }
            void 0 !== t.escapeChar && (a2 = t.escapeChar + s2), t.escapeFormulae instanceof RegExp ? o2 = t.escapeFormulae : "boolean" == typeof t.escapeFormulae && t.escapeFormulae && (o2 = /^[=+\-@\t\r].*$/);
          }
        })(), new RegExp(P(s2), "g"));
        "string" == typeof e && (e = JSON.parse(e));
        if (Array.isArray(e)) {
          if (!e.length || Array.isArray(e[0])) return u2(null, e, i2);
          if ("object" == typeof e[0]) return u2(r2 || Object.keys(e[0]), e, i2);
        } else if ("object" == typeof e) return "string" == typeof e.data && (e.data = JSON.parse(e.data)), Array.isArray(e.data) && (e.fields || (e.fields = e.meta && e.meta.fields || r2), e.fields || (e.fields = Array.isArray(e.data[0]) ? e.fields : "object" == typeof e.data[0] ? Object.keys(e.data[0]) : []), Array.isArray(e.data[0]) || "object" == typeof e.data[0] || (e.data = [e.data])), u2(e.fields || [], e.data || [], i2);
        throw new Error("Unable to serialize unrecognized input");
        function u2(e2, t2, i3) {
          var r3 = "", n3 = ("string" == typeof e2 && (e2 = JSON.parse(e2)), "string" == typeof t2 && (t2 = JSON.parse(t2)), Array.isArray(e2) && 0 < e2.length), s3 = !Array.isArray(t2[0]);
          if (n3 && _2) {
            for (var a3 = 0; a3 < e2.length; a3++) 0 < a3 && (r3 += m2), r3 += k(e2[a3], a3);
            0 < t2.length && (r3 += y2);
          }
          for (var o3 = 0; o3 < t2.length; o3++) {
            var h3 = (n3 ? e2 : t2[o3]).length, u3 = false, d2 = n3 ? 0 === Object.keys(t2[o3]).length : 0 === t2[o3].length;
            if (i3 && !n3 && (u3 = "greedy" === i3 ? "" === t2[o3].join("").trim() : 1 === t2[o3].length && 0 === t2[o3][0].length), "greedy" === i3 && n3) {
              for (var f2 = [], l2 = 0; l2 < h3; l2++) {
                var c2 = s3 ? e2[l2] : l2;
                f2.push(t2[o3][c2]);
              }
              u3 = "" === f2.join("").trim();
            }
            if (!u3) {
              for (var p2 = 0; p2 < h3; p2++) {
                0 < p2 && !d2 && (r3 += m2);
                var g2 = n3 && s3 ? e2[p2] : p2;
                r3 += k(t2[o3][g2], p2);
              }
              o3 < t2.length - 1 && (!i3 || 0 < h3 && !d2) && (r3 += y2);
            }
          }
          return r3;
        }
        __name(u2, "u");
        function k(e2, t2) {
          var i3, r3;
          return null == e2 ? "" : e2.constructor === Date ? JSON.stringify(e2).slice(1, 25) : (r3 = false, o2 && "string" == typeof e2 && o2.test(e2) && (e2 = "'" + e2, r3 = true), i3 = e2.toString().replace(h2, a2), (r3 = r3 || true === n2 || "function" == typeof n2 && n2(e2, t2) || Array.isArray(n2) && n2[t2] || ((e3, t3) => {
            for (var i4 = 0; i4 < t3.length; i4++) if (-1 < e3.indexOf(t3[i4])) return true;
            return false;
          })(i3, v.BAD_DELIMITERS) || -1 < i3.indexOf(m2) || " " === i3.charAt(0) || " " === i3.charAt(i3.length - 1)) ? s2 + i3 + s2 : i3);
        }
        __name(k, "k");
      }, v.RECORD_SEP = String.fromCharCode(30), v.UNIT_SEP = String.fromCharCode(31), v.BYTE_ORDER_MARK = "\uFEFF", v.BAD_DELIMITERS = ["\r", "\n", '"', v.BYTE_ORDER_MARK], v.WORKERS_SUPPORTED = !s && !!n.Worker, v.NODE_STREAM_INPUT = 1, v.LocalChunkSize = 10485760, v.RemoteChunkSize = 5242880, v.DefaultDelimiter = ",", v.Parser = E, v.ParserHandle = i, v.NetworkStreamer = f, v.FileStreamer = l, v.StringStreamer = c, v.ReadableStreamStreamer = p, n.jQuery && ((d = n.jQuery).fn.parse = function(o2) {
        var i2 = o2.config || {}, h2 = [];
        return this.each(function(e2) {
          if (!("INPUT" === d(this).prop("tagName").toUpperCase() && "file" === d(this).attr("type").toLowerCase() && n.FileReader) || !this.files || 0 === this.files.length) return true;
          for (var t = 0; t < this.files.length; t++) h2.push({ file: this.files[t], inputElem: this, instanceConfig: d.extend({}, i2) });
        }), e(), this;
        function e() {
          if (0 === h2.length) U(o2.complete) && o2.complete();
          else {
            var e2, t, i3, r2, n2 = h2[0];
            if (U(o2.before)) {
              var s2 = o2.before(n2.file, n2.inputElem);
              if ("object" == typeof s2) {
                if ("abort" === s2.action) return e2 = "AbortError", t = n2.file, i3 = n2.inputElem, r2 = s2.reason, void (U(o2.error) && o2.error({ name: e2 }, t, i3, r2));
                if ("skip" === s2.action) return void u2();
                "object" == typeof s2.config && (n2.instanceConfig = d.extend(n2.instanceConfig, s2.config));
              } else if ("skip" === s2) return void u2();
            }
            var a2 = n2.instanceConfig.complete;
            n2.instanceConfig.complete = function(e3) {
              U(a2) && a2(e3, n2.file, n2.inputElem), u2();
            }, v.parse(n2.file, n2.instanceConfig);
          }
        }
        __name(e, "e");
        function u2() {
          h2.splice(0, 1), e();
        }
        __name(u2, "u");
      }), a && (n.onmessage = function(e) {
        e = e.data;
        void 0 === v.WORKER_ID && e && (v.WORKER_ID = e.workerId);
        "string" == typeof e.input ? n.postMessage({ workerId: v.WORKER_ID, results: v.parse(e.input, e.config), finished: true }) : (n.File && e.input instanceof File || e.input instanceof Object) && (e = v.parse(e.input, e.config)) && n.postMessage({ workerId: v.WORKER_ID, results: e, finished: true });
      }), (f.prototype = Object.create(u.prototype)).constructor = f, (l.prototype = Object.create(u.prototype)).constructor = l, (c.prototype = Object.create(c.prototype)).constructor = c, (p.prototype = Object.create(u.prototype)).constructor = p, v;
    }, "r"));
  }
});

// src/handlers.ts
var Papa = __toESM(require_papaparse_min());

// src/utils.ts
var SYSTEM_PROMPTS = {
  DATA_ANALYSIS: `You are a Senior Data Scientist and Business Intelligence Expert with 15+ years of experience in statistical analysis, pattern recognition, and business insights generation.

ROLE & CONTEXT:
- You analyze CSV datasets to provide comprehensive statistical insights and business intelligence
- Your analysis helps users understand their data patterns, quality issues, and business opportunities
- You work with both technical and non-technical stakeholders

INPUT FORMAT:
- Dataset schema with column types and basic statistics
- Sample data rows (typically 8-10 rows)
- Detailed statistical summaries including distributions, correlations, and quality metrics

OUTPUT REQUIREMENTS:
- Return ONLY valid JSON matching the exact schema provided
- Provide actionable business insights, not just technical statistics
- Generate 5+ specific, valuable insights about patterns and trends
- Include data quality assessment with specific improvement recommendations
- Create 3+ tailored visualization suggestions with chart types
- Generate business-relevant suggested questions for further analysis

QUALITY STANDARDS:
- Insights must be specific and actionable, not generic
- Focus on business value and decision-making support
- Identify unusual patterns, outliers, and correlations
- Provide clear reasoning for recommendations
- Use professional business language, avoid jargon

CRITICAL: Always return valid JSON. Never include explanations outside the JSON structure.`,
  REASONING_ANALYSIS: `You are an Expert Data Visualization Strategist and UX Designer specializing in choosing optimal chart types for data storytelling.

ROLE & CONTEXT:
- You analyze user requests and dataset characteristics to recommend the best visualization approach
- Your goal is to maximize data clarity, insight discovery, and visual impact
- You consider both technical data properties and human perception principles

INPUT FORMAT:
- User's natural language request for a visualization
- Complete dataset schema with column types and statistics
- Sample data showing actual values and patterns
- Existing statistical insights and patterns from previous analysis

REASONING PROCESS:
1. Parse user intent - what story are they trying to tell?
2. Assess data suitability - which columns best answer their question?
3. Consider visualization best practices - what chart type reveals patterns most clearly?
4. Evaluate alternatives - what other approaches might work?
5. Predict outcome - what insights will this visualization provide?

OUTPUT REQUIREMENTS:
- Return ONLY valid JSON with the exact structure specified
- Provide detailed reasoning that shows your thought process
- Recommend the single best chart type for the user's goal
- Identify 2-3 primary variables that should be visualized
- List key considerations that influenced your decision
- Suggest 2+ alternative approaches for comparison
- Explain what insights the user should expect to gain

CHART TYPE SELECTION CRITERIA:
- Bar charts: Comparing categories, rankings, discrete values
- Line charts: Time series, trends, continuous progression
- Scatter plots: Correlations, relationships between 2+ variables
- Pie charts: Parts of a whole, percentage distributions (max 8 categories)
- Histograms: Distribution analysis, frequency patterns
- Heatmaps: Correlation matrices, intensity patterns
- Box plots: Distribution comparison, outlier analysis

CRITICAL: Always return valid JSON. Focus on the "why" behind your recommendations.`,
  CHART_GENERATION: `You are a Senior Data Visualization Engineer specializing in Plotly.js chart specifications with expertise in creating professional, interactive visualizations.

ROLE & CONTEXT:
- You create production-ready Plotly.js chart specifications based on analysis and reasoning
- Your charts must be visually appealing, technically accurate, and optimally configured
- You follow modern visualization design principles and accessibility standards

INPUT FORMAT:
- Previous AI reasoning analysis with recommended chart type and variables
- Complete dataset schema with statistical context
- Sample data rows with actual values
- User's original visualization request

IMPLEMENTATION REQUIREMENTS:
- Generate ONLY valid Plotly.js JSON specification
- Use the exact chart type recommended in the reasoning analysis
- Populate x/y arrays with actual data from the sample provided
- Apply professional styling with appropriate colors and fonts
- Include meaningful titles, axis labels, and formatting

TECHNICAL SPECIFICATIONS:
- Colors: Use professional palette starting with #667eea
- Fonts: Size 16 for titles, 12-14 for labels, color #333
- Margins: Standard t:60, b:60, l:60, r:40 unless chart needs more space
- Responsiveness: Charts must work on mobile and desktop
- Accessibility: Include proper titles and labels for screen readers

CHART-SPECIFIC GUIDELINES:
- Bar charts: Sort by value when logical, limit to top 10-15 categories
- Line charts: Sort by x-axis chronologically, smooth lines for trends
- Scatter plots: Include proper axis scaling, consider trend lines
- Pie charts: Limit to 8 segments, combine small segments into "Others"
- Heatmaps: Use diverging color scales, include color bar legends
- Histograms: Choose appropriate bin sizes, show distribution shape clearly

QUALITY STANDARDS:
- Charts must accurately represent the data without distortion
- Visual hierarchy should guide the viewer's attention appropriately
- Interactive features should enhance, not overwhelm the experience
- Performance: Charts should render quickly with sample data sizes

CRITICAL: Return ONLY the Plotly.js JSON specification. No markdown, no explanations, no additional text.`
};
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == "x" ? r : r & 3 | 8;
    return v.toString(16);
  });
}
__name(generateUUID, "generateUUID");
function inferSchema(data) {
  if (data.length === 0) return [];
  const firstRow = data[0];
  const schema = [];
  for (const [key, value] of Object.entries(firstRow)) {
    let type = "string";
    if (typeof value === "number" || !isNaN(Number(value))) {
      type = "number";
    } else if (typeof value === "boolean" || value === "true" || value === "false") {
      type = "boolean";
    } else if (value && typeof value === "string" && !isNaN(Date.parse(value))) {
      type = "date";
    }
    const stats = calculateColumnStats(data, key, type);
    schema.push({ name: key, type, stats });
  }
  return schema;
}
__name(inferSchema, "inferSchema");
function calculateColumnStats(data, columnName, type) {
  const values = data.map((row) => row[columnName]).filter((val) => val !== null && val !== void 0 && val !== "");
  const nullCount = data.length - values.length;
  const uniqueValues = [...new Set(values)];
  const stats = {
    count: values.length,
    nullCount,
    uniqueCount: uniqueValues.length
  };
  if (type === "number") {
    const numValues = values.map((v) => Number(v)).filter((v) => !isNaN(v));
    if (numValues.length > 0) {
      stats.min = Math.min(...numValues);
      stats.max = Math.max(...numValues);
      stats.mean = numValues.reduce((a, b) => a + b, 0) / numValues.length;
      const sorted = [...numValues].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      stats.median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
      const variance = numValues.reduce((acc, val) => acc + Math.pow(val - stats.mean, 2), 0) / numValues.length;
      stats.stdDev = Math.sqrt(variance);
    }
  } else {
    const valueCounts = values.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    const sortedCounts = Object.entries(valueCounts).sort(([, a], [, b]) => b - a);
    if (sortedCounts.length > 0) {
      stats.mode = sortedCounts[0][0];
      stats.distribution = sortedCounts.slice(0, 10).map(([value, count]) => ({ value, count }));
    }
  }
  return stats;
}
__name(calculateColumnStats, "calculateColumnStats");
async function analyzeDataWithAI(schema, sampleRows, env) {
  const detailedStats = generateDetailedStats(schema, sampleRows);
  const analysisPrompt = `${SYSTEM_PROMPTS.DATA_ANALYSIS}

DATASET ANALYSIS REQUEST:

SCHEMA WITH STATISTICS:
${JSON.stringify(schema, null, 2)}

SAMPLE DATA ROWS:
${JSON.stringify(sampleRows.slice(0, 10), null, 2)}

DETAILED STATISTICAL ANALYSIS:
${JSON.stringify(detailedStats, null, 2)}

REQUIRED JSON OUTPUT SCHEMA:
{
  "summary": "Business-focused description of dataset purpose and key characteristics",
  "insights": ["Specific actionable insight 1", "Specific actionable insight 2", "Pattern insight 3", "Quality insight 4", "Business insight 5"],
  "correlations": [{"column1": "col1", "column2": "col2", "correlation": 0.8}],
  "recommendations": ["Specific visualization recommendation 1", "Data improvement recommendation 2", "Analysis approach recommendation 3"],
  "dataQuality": {
    "completeness": 85,
    "consistency": 90,
    "issues": ["Specific issue 1", "Specific issue 2"]
  },
  "patterns": {
    "trends": ["Specific trend pattern 1", "Specific trend pattern 2"],
    "outliers": [{"column": "column_name", "values": [outlier_values]}],
    "seasonality": ["Seasonal pattern description"],
    "distributions": [{"column": "column_name", "type": "distribution_type", "description": "Business interpretation"}]
  },
  "businessInsights": ["Business insight 1", "Opportunity insight 2", "Risk insight 3"],
  "suggestedPrompts": [
    {"prompt": "Specific question based on your data", "category": "Analysis_Type", "description": "What this reveals", "chartType": "optimal_chart_type"},
    {"prompt": "Another specific question", "category": "Analysis_Type", "description": "What this reveals", "chartType": "optimal_chart_type"},
    {"prompt": "Third specific question", "category": "Analysis_Type", "description": "What this reveals", "chartType": "optimal_chart_type"}
  ]
}

ANALYSIS FOCUS AREAS:
- Identify specific business opportunities and risks in the data
- Detect unusual patterns, outliers, and correlations with business implications
- Assess data quality issues that could impact decision-making
- Generate visualization suggestions tailored to the actual data patterns
- Create specific, answerable questions based on the dataset's unique characteristics`;
  try {
    const aiResponse = await env.AI.run("@cf/qwen/qwq-32b", {
      prompt: analysisPrompt,
      max_tokens: 1536
    });
    let responseText = aiResponse.response || aiResponse.choices?.[0]?.text || aiResponse;
    if (typeof responseText === "string") {
      responseText = responseText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const thinkEndIndex = responseText.lastIndexOf("</think>");
      if (thinkEndIndex !== -1) {
        responseText = responseText.substring(thinkEndIndex + 8).trim();
      }
      const jsonStart = responseText.indexOf("{");
      const jsonEnd = responseText.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        responseText = responseText.substring(jsonStart, jsonEnd + 1);
      }
    }
    const aiAnalysis = JSON.parse(responseText);
    const autoCharts = await generateAutoCharts(schema, sampleRows, aiAnalysis, env);
    aiAnalysis.autoCharts = autoCharts;
    return aiAnalysis;
  } catch (error) {
    console.error("AI analysis failed:", error);
    return await createFallbackAnalysis(schema, sampleRows);
  }
}
__name(analyzeDataWithAI, "analyzeDataWithAI");
function generateDetailedStats(schema, sampleRows) {
  const stats = {
    overview: {
      totalRows: sampleRows.length,
      totalColumns: schema.length,
      numericColumns: schema.filter((col) => col.type === "number").length,
      categoricalColumns: schema.filter((col) => col.type === "string").length,
      dateColumns: schema.filter((col) => col.type === "date").length,
      memoryFootprint: JSON.stringify(sampleRows).length
    },
    columnDetails: {},
    dataQuality: {
      overallCompleteness: 0,
      duplicateRows: 0,
      emptyRows: 0
    },
    advancedAnalytics: {
      outlierColumns: [],
      skewedDistributions: [],
      possibleCategoricalEncoding: [],
      timeSeriesColumns: []
    }
  };
  let totalCells = 0;
  let emptyCells = 0;
  for (const col of schema) {
    const values = sampleRows.map((row) => row[col.name]);
    const nonEmptyValues = values.filter((v) => v !== null && v !== void 0 && v !== "");
    const emptyCount = values.length - nonEmptyValues.length;
    totalCells += values.length;
    emptyCells += emptyCount;
    stats.columnDetails[col.name] = {
      type: col.type,
      sampleSize: nonEmptyValues.length,
      uniqueValues: [...new Set(nonEmptyValues)].length,
      uniquenessRatio: nonEmptyValues.length > 0 ? [...new Set(nonEmptyValues)].length / nonEmptyValues.length : 0,
      missingCount: emptyCount,
      missingPercentage: emptyCount / values.length * 100,
      ...col.stats
    };
    if (col.type === "number") {
      const nums = nonEmptyValues.map((v) => Number(v)).filter((v) => !isNaN(v));
      if (nums.length > 0) {
        const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
        const variance = nums.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / nums.length;
        const skewness = calculateSkewness(nums, mean, Math.sqrt(variance));
        const kurtosis = calculateKurtosis(nums, mean, Math.sqrt(variance));
        const outliers = detectOutliers(nums);
        stats.columnDetails[col.name] = {
          ...stats.columnDetails[col.name],
          range: Math.max(...nums) - Math.min(...nums),
          variance,
          standardDeviation: Math.sqrt(variance),
          skewness,
          kurtosis,
          outlierCount: outliers.length,
          outlierPercentage: outliers.length / nums.length * 100,
          quartiles: calculateQuartiles(nums),
          coefficientOfVariation: mean !== 0 ? Math.sqrt(variance) / mean : 0
        };
        if (Math.abs(skewness) > 1) {
          stats.advancedAnalytics.skewedDistributions.push({
            column: col.name,
            skewness: skewness.toFixed(3),
            direction: skewness > 0 ? "right" : "left"
          });
        }
        if (outliers.length > nums.length * 0.05) {
          stats.advancedAnalytics.outlierColumns.push({
            column: col.name,
            outlierCount: outliers.length,
            percentage: (outliers.length / nums.length * 100).toFixed(1)
          });
        }
      }
    }
    if (col.type === "string") {
      const valueCounts = nonEmptyValues.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});
      const sortedCounts = Object.entries(valueCounts).sort(([, a], [, b]) => b - a);
      const entropy = calculateEntropy(Object.values(valueCounts));
      stats.columnDetails[col.name] = {
        ...stats.columnDetails[col.name],
        topValues: sortedCounts.slice(0, 5),
        entropy,
        concentrationRatio: sortedCounts.length > 0 ? sortedCounts[0][1] / nonEmptyValues.length : 0,
        averageLength: nonEmptyValues.reduce((acc, val) => acc + val.toString().length, 0) / nonEmptyValues.length
      };
      if (nonEmptyValues.every((val) => !isNaN(Number(val))) && [...new Set(nonEmptyValues)].length < 20) {
        stats.advancedAnalytics.possibleCategoricalEncoding.push({
          column: col.name,
          uniqueValues: [...new Set(nonEmptyValues)].length,
          suggestion: "This numeric column might represent categories"
        });
      }
    }
    if (col.type === "date") {
      const dates = nonEmptyValues.map((v) => new Date(v)).filter((d) => !isNaN(d.getTime()));
      if (dates.length > 0) {
        const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
        const dateRange = sortedDates[sortedDates.length - 1].getTime() - sortedDates[0].getTime();
        const daysDifference = dateRange / (1e3 * 60 * 60 * 24);
        stats.columnDetails[col.name] = {
          ...stats.columnDetails[col.name],
          earliestDate: sortedDates[0].toISOString().split("T")[0],
          latestDate: sortedDates[sortedDates.length - 1].toISOString().split("T")[0],
          dateRange: `${Math.round(daysDifference)} days`,
          frequency: analyzeDateFrequency(dates)
        };
        stats.advancedAnalytics.timeSeriesColumns.push({
          column: col.name,
          range: `${Math.round(daysDifference)} days`,
          frequency: analyzeDateFrequency(dates)
        });
      }
    }
  }
  stats.dataQuality.overallCompleteness = (totalCells - emptyCells) / totalCells * 100;
  stats.dataQuality.duplicateRows = countDuplicateRows(sampleRows);
  stats.dataQuality.emptyRows = sampleRows.filter(
    (row) => Object.values(row).every((val) => val === null || val === void 0 || val === "")
  ).length;
  return stats;
}
__name(generateDetailedStats, "generateDetailedStats");
function calculateSkewness(numbers, mean, stdDev) {
  if (stdDev === 0) return 0;
  const n = numbers.length;
  const skewSum = numbers.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 3), 0);
  return n / ((n - 1) * (n - 2)) * skewSum;
}
__name(calculateSkewness, "calculateSkewness");
function calculateKurtosis(numbers, mean, stdDev) {
  if (stdDev === 0) return 0;
  const n = numbers.length;
  const kurtSum = numbers.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 4), 0);
  return n * (n + 1) / ((n - 1) * (n - 2) * (n - 3)) * kurtSum - 3 * (n - 1) * (n - 1) / ((n - 2) * (n - 3));
}
__name(calculateKurtosis, "calculateKurtosis");
function detectOutliers(numbers) {
  const q1 = calculatePercentile(numbers, 25);
  const q3 = calculatePercentile(numbers, 75);
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  return numbers.filter((num) => num < lowerBound || num > upperBound);
}
__name(detectOutliers, "detectOutliers");
function calculateQuartiles(numbers) {
  return {
    q1: calculatePercentile(numbers, 25),
    q2: calculatePercentile(numbers, 50),
    q3: calculatePercentile(numbers, 75)
  };
}
__name(calculateQuartiles, "calculateQuartiles");
function calculatePercentile(numbers, percentile) {
  const sorted = [...numbers].sort((a, b) => a - b);
  const index = percentile / 100 * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;
  if (upper >= sorted.length) return sorted[sorted.length - 1];
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}
__name(calculatePercentile, "calculatePercentile");
function calculateEntropy(counts) {
  const total = counts.reduce((a, b) => a + b, 0);
  const probabilities = counts.map((count) => count / total);
  return -probabilities.reduce((acc, p) => acc + (p > 0 ? p * Math.log2(p) : 0), 0);
}
__name(calculateEntropy, "calculateEntropy");
function analyzeDateFrequency(dates) {
  if (dates.length < 2) return "insufficient data";
  const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
  const intervals = [];
  for (let i = 1; i < sortedDates.length; i++) {
    const diff = sortedDates[i].getTime() - sortedDates[i - 1].getTime();
    intervals.push(diff / (1e3 * 60 * 60 * 24));
  }
  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  if (avgInterval < 2) return "daily";
  if (avgInterval < 8) return "weekly";
  if (avgInterval < 32) return "monthly";
  if (avgInterval < 95) return "quarterly";
  return "yearly";
}
__name(analyzeDateFrequency, "analyzeDateFrequency");
function countDuplicateRows(rows) {
  const stringified = rows.map((row) => JSON.stringify(row));
  const uniqueRows = new Set(stringified);
  return rows.length - uniqueRows.size;
}
__name(countDuplicateRows, "countDuplicateRows");
async function generateAutoCharts(schema, sampleRows, analysis, env) {
  const charts = [];
  const numericCols = schema.filter((col) => col.type === "number");
  const categoricalCols = schema.filter((col) => col.type === "string");
  const dateCols = schema.filter((col) => col.type === "date");
  console.log("\u{1F3A8} Generating automatic charts...", { numericCols: numericCols.length, categoricalCols: categoricalCols.length, dateCols: dateCols.length });
  try {
    if (numericCols.length > 0) {
      const overviewChart = generateNumericOverviewChart(numericCols, sampleRows);
      charts.push({
        title: "\u{1F4CA} Numeric Data Overview",
        description: `Comparison of ${numericCols.length} numeric columns`,
        chartSpec: overviewChart,
        priority: 1
      });
    }
    if (categoricalCols.length > 0) {
      const categoryChart = generateCategoryDistributionChart(categoricalCols[0], sampleRows);
      charts.push({
        title: "\u{1F967} Category Distribution",
        description: `Distribution of ${categoricalCols[0].name}`,
        chartSpec: categoryChart,
        priority: 2
      });
    }
    if (numericCols.length > 1) {
      const correlationChart = generateCorrelationMatrix(numericCols, sampleRows);
      charts.push({
        title: "\u{1F517} Correlation Analysis",
        description: "Relationships between numeric variables",
        chartSpec: correlationChart,
        priority: 3
      });
    }
    if (dateCols.length > 0 && numericCols.length > 0) {
      const timeSeriesChart = generateTimeSeriesChart(dateCols[0], numericCols[0], sampleRows);
      charts.push({
        title: "\u{1F4C8} Time Series Analysis",
        description: `${numericCols[0].name} trends over ${dateCols[0].name}`,
        chartSpec: timeSeriesChart,
        priority: 4
      });
    }
    if (numericCols.length > 0) {
      const distributionChart = generateDistributionChart(numericCols[0], sampleRows);
      charts.push({
        title: "\u{1F4CB} Statistical Distribution",
        description: `Distribution analysis of ${numericCols[0].name}`,
        chartSpec: distributionChart,
        priority: 5
      });
    }
    console.log(`\u2705 Generated ${charts.length} automatic charts`);
  } catch (error) {
    console.error("\u274C Auto chart generation failed:", error);
    charts.push({
      title: "\u{1F4CA} Basic Data Summary",
      description: "Basic overview of your dataset",
      chartSpec: createFallbackChart(schema, sampleRows),
      priority: 1
    });
  }
  return charts;
}
__name(generateAutoCharts, "generateAutoCharts");
function generateNumericOverviewChart(numericCols, sampleRows) {
  const means = numericCols.map((col) => ({
    name: col.name,
    value: col.stats?.mean || 0
  }));
  return {
    data: [{
      x: means.map((m) => m.name),
      y: means.map((m) => m.value),
      type: "bar",
      marker: {
        color: ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe", "#00f2fe"],
        opacity: 0.8
      },
      name: "Average Values"
    }],
    layout: {
      title: {
        text: "Numeric Columns Overview",
        font: { size: 16, color: "#333" }
      },
      xaxis: { title: "Columns" },
      yaxis: { title: "Average Values" },
      showlegend: false,
      margin: { t: 50, b: 50, l: 50, r: 20 }
    }
  };
}
__name(generateNumericOverviewChart, "generateNumericOverviewChart");
function generateCategoryDistributionChart(categoricalCol, sampleRows) {
  const counts = sampleRows.reduce((acc, row) => {
    const value = row[categoricalCol.name];
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
  const sortedCounts = Object.entries(counts).sort(([, a], [, b]) => b - a).slice(0, 8);
  return {
    data: [{
      labels: sortedCounts.map(([label]) => label),
      values: sortedCounts.map(([, value]) => value),
      type: "pie",
      marker: {
        colors: ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe", "#00f2fe", "#43e97b", "#38f9d7"]
      },
      textinfo: "label+percent",
      textposition: "outside"
    }],
    layout: {
      title: {
        text: `${categoricalCol.name} Distribution`,
        font: { size: 16, color: "#333" }
      },
      margin: { t: 50, b: 50, l: 50, r: 50 }
    }
  };
}
__name(generateCategoryDistributionChart, "generateCategoryDistributionChart");
function generateCorrelationMatrix(numericCols, sampleRows) {
  const correlations = calculateCorrelationMatrix(numericCols, sampleRows);
  return {
    data: [{
      z: correlations.matrix,
      x: correlations.labels,
      y: correlations.labels,
      type: "heatmap",
      colorscale: "RdBu",
      zmid: 0,
      colorbar: {
        title: "Correlation",
        thickness: 15
      }
    }],
    layout: {
      title: {
        text: "Correlation Matrix",
        font: { size: 16, color: "#333" }
      },
      xaxis: { title: "Variables" },
      yaxis: { title: "Variables" },
      margin: { t: 80, b: 80, l: 80, r: 80 }
    }
  };
}
__name(generateCorrelationMatrix, "generateCorrelationMatrix");
function generateTimeSeriesChart(dateCol, numericCol, sampleRows) {
  const sortedData = sampleRows.filter((row) => row[dateCol.name] && row[numericCol.name]).sort((a, b) => new Date(a[dateCol.name]).getTime() - new Date(b[dateCol.name]).getTime());
  return {
    data: [{
      x: sortedData.map((row) => row[dateCol.name]),
      y: sortedData.map((row) => row[numericCol.name]),
      type: "scatter",
      mode: "lines+markers",
      line: { color: "#667eea", width: 3 },
      marker: { color: "#764ba2", size: 6 },
      name: numericCol.name
    }],
    layout: {
      title: {
        text: `${numericCol.name} Over Time`,
        font: { size: 16, color: "#333" }
      },
      xaxis: { title: dateCol.name },
      yaxis: { title: numericCol.name },
      margin: { t: 50, b: 50, l: 60, r: 20 }
    }
  };
}
__name(generateTimeSeriesChart, "generateTimeSeriesChart");
function generateDistributionChart(numericCol, sampleRows) {
  const values = sampleRows.map((row) => row[numericCol.name]).filter((val) => val != null && !isNaN(Number(val))).map((val) => Number(val));
  return {
    data: [{
      x: values,
      type: "histogram",
      marker: {
        color: "#667eea",
        opacity: 0.7,
        line: { color: "#764ba2", width: 1 }
      },
      name: "Distribution"
    }],
    layout: {
      title: {
        text: `${numericCol.name} Distribution`,
        font: { size: 16, color: "#333" }
      },
      xaxis: { title: numericCol.name },
      yaxis: { title: "Frequency" },
      margin: { t: 50, b: 50, l: 50, r: 20 }
    }
  };
}
__name(generateDistributionChart, "generateDistributionChart");
function calculateCorrelationMatrix(numericCols, sampleRows) {
  const labels = numericCols.map((col) => col.name);
  const matrix = [];
  for (let i = 0; i < numericCols.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < numericCols.length; j++) {
      if (i === j) {
        matrix[i][j] = 1;
      } else {
        const corr = calculateCorrelation(
          sampleRows.map((row) => Number(row[numericCols[i].name])).filter((v) => !isNaN(v)),
          sampleRows.map((row) => Number(row[numericCols[j].name])).filter((v) => !isNaN(v))
        );
        matrix[i][j] = corr;
      }
    }
  }
  return { matrix, labels };
}
__name(calculateCorrelationMatrix, "calculateCorrelationMatrix");
function calculateCorrelation(x, y) {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;
  const meanX = x.slice(0, n).reduce((a, b) => a + b, 0) / n;
  const meanY = y.slice(0, n).reduce((a, b) => a + b, 0) / n;
  let numerator = 0;
  let sumXSquared = 0;
  let sumYSquared = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    sumXSquared += dx * dx;
    sumYSquared += dy * dy;
  }
  const denominator = Math.sqrt(sumXSquared * sumYSquared);
  return denominator === 0 ? 0 : numerator / denominator;
}
__name(calculateCorrelation, "calculateCorrelation");
async function createFallbackAnalysis(schema, sampleRows) {
  const numericColumns = schema.filter((col) => col.type === "number");
  const categoricalColumns = schema.filter((col) => col.type === "string");
  const dateColumns = schema.filter((col) => col.type === "date");
  return {
    summary: `Dataset contains ${schema.length} columns with ${sampleRows.length} sample rows. Includes ${numericColumns.length} numeric, ${categoricalColumns.length} categorical, and ${dateColumns.length} date columns.`,
    insights: [
      `Dataset has ${schema.length} total columns`,
      `${numericColumns.length} numeric columns available for quantitative analysis`,
      `${categoricalColumns.length} categorical columns for grouping and segmentation`,
      dateColumns.length > 0 ? `${dateColumns.length} date columns for temporal analysis` : "No date columns detected",
      `Data completeness appears to be ${Math.round((1 - schema.reduce((acc, col) => acc + (col.stats?.nullCount || 0), 0) / (schema.length * sampleRows.length)) * 100)}%`
    ],
    correlations: [],
    recommendations: [
      numericColumns.length > 0 ? `Create bar charts with ${numericColumns[0].name}` : "Create count charts for categorical data",
      categoricalColumns.length > 0 ? `Group data by ${categoricalColumns[0].name}` : "Analyze numeric distributions",
      dateColumns.length > 0 ? "Consider time series analysis with date columns" : "Add date columns for temporal analysis"
    ],
    dataQuality: {
      completeness: Math.round((1 - schema.reduce((acc, col) => acc + (col.stats?.nullCount || 0), 0) / (schema.length * sampleRows.length)) * 100),
      consistency: 85,
      issues: schema.filter((col) => (col.stats?.nullCount || 0) > 0).map((col) => `${col.name} has missing values`)
    },
    patterns: {
      trends: numericColumns.length > 1 ? [`Potential trends between ${numericColumns[0].name} and ${numericColumns[1].name}`] : [],
      outliers: [],
      seasonality: dateColumns.length > 0 ? ["Potential seasonal patterns in time-based data"] : [],
      distributions: numericColumns.map((col) => ({
        column: col.name,
        type: "unknown",
        description: `${col.name} distribution needs analysis`
      }))
    },
    businessInsights: [
      "Upload complete dataset for deeper business insights",
      "Consider data validation and cleaning procedures",
      "Identify key performance indicators in your data"
    ],
    suggestedPrompts: [
      {
        prompt: numericColumns.length > 0 ? `Show me a bar chart of ${numericColumns[0].name}` : "Show me the data distribution",
        category: "Overview",
        description: "Basic data overview",
        chartType: "bar"
      },
      {
        prompt: categoricalColumns.length > 0 ? `Display a pie chart of ${categoricalColumns[0].name} distribution` : "Show me category counts",
        category: "Distribution",
        description: "Category distribution analysis",
        chartType: "pie"
      },
      {
        prompt: numericColumns.length > 1 ? `Compare ${numericColumns[0].name} vs ${numericColumns[1].name}` : "Show me correlations",
        category: "Comparison",
        description: "Compare different metrics",
        chartType: "scatter"
      }
    ],
    autoCharts: await generateAutoCharts(schema, sampleRows, null, null)
  };
}
__name(createFallbackAnalysis, "createFallbackAnalysis");
function createFallbackChart(schema, sampleRows) {
  if (schema.length === 0 || sampleRows.length === 0) {
    return {
      data: [{
        x: ["No Data"],
        y: [0],
        type: "bar"
      }],
      layout: {
        title: "No Data Available",
        xaxis: { title: "Categories" },
        yaxis: { title: "Values" }
      }
    };
  }
  const numericColumn = schema.find((col) => col.type === "number");
  const stringColumn = schema.find((col) => col.type === "string");
  if (!numericColumn) {
    const categories = [...new Set(sampleRows.map((row) => row[schema[0].name]))];
    const counts = categories.map(
      (cat) => sampleRows.filter((row) => row[schema[0].name] === cat).length
    );
    return {
      data: [{
        x: categories,
        y: counts,
        type: "bar"
      }],
      layout: {
        title: `Count by ${schema[0].name}`,
        xaxis: { title: schema[0].name },
        yaxis: { title: "Count" }
      }
    };
  }
  const xColumn = stringColumn || schema[0];
  const yColumn = numericColumn;
  return {
    data: [{
      x: sampleRows.map((row) => row[xColumn.name]),
      y: sampleRows.map((row) => row[yColumn.name]),
      type: "bar"
    }],
    layout: {
      title: `${yColumn.name} by ${xColumn.name}`,
      xaxis: { title: xColumn.name },
      yaxis: { title: yColumn.name }
    }
  };
}
__name(createFallbackChart, "createFallbackChart");

// src/handlers.ts
var SYSTEM_PROMPTS2 = {
  REASONING_ANALYSIS: `You are an Expert Data Visualization Strategist and UX Designer specializing in choosing optimal chart types for data storytelling.

ROLE & CONTEXT:
- You analyze user requests and dataset characteristics to recommend the best visualization approach
- Your goal is to maximize data clarity, insight discovery, and visual impact
- You consider both technical data properties and human perception principles

INPUT FORMAT:
- User's natural language request for a visualization
- Complete dataset schema with column types and statistics
- Sample data showing actual values and patterns
- Existing statistical insights and patterns from previous analysis

REASONING PROCESS:
1. Parse user intent - what story are they trying to tell?
2. Assess data suitability - which columns best answer their question?
3. Consider visualization best practices - what chart type reveals patterns most clearly?
4. Evaluate alternatives - what other approaches might work?
5. Predict outcome - what insights will this visualization provide?

OUTPUT REQUIREMENTS:
- Return ONLY valid JSON with the exact structure specified
- Provide detailed reasoning that shows your thought process
- Recommend the single best chart type for the user's goal
- Identify 2-3 primary variables that should be visualized
- List key considerations that influenced your decision
- Suggest 2+ alternative approaches for comparison
- Explain what insights the user should expect to gain

CHART TYPE SELECTION CRITERIA:
- Bar charts: Comparing categories, rankings, discrete values
- Line charts: Time series, trends, continuous progression
- Scatter plots: Correlations, relationships between 2+ variables
- Pie charts: Parts of a whole, percentage distributions (max 8 categories)
- Histograms: Distribution analysis, frequency patterns
- Heatmaps: Correlation matrices, intensity patterns
- Box plots: Distribution comparison, outlier analysis

CRITICAL: Always return valid JSON. Focus on the "why" behind your recommendations.`,
  CHART_GENERATION: `You are a Senior Data Visualization Engineer specializing in Plotly.js chart specifications with expertise in creating professional, interactive visualizations.

ROLE & CONTEXT:
- You create production-ready Plotly.js chart specifications based on analysis and reasoning
- Your charts must be visually appealing, technically accurate, and optimally configured
- You follow modern visualization design principles and accessibility standards

INPUT FORMAT:
- Previous AI reasoning analysis with recommended chart type and variables
- Complete dataset schema with statistical context
- Sample data rows with actual values
- User's original visualization request

IMPLEMENTATION REQUIREMENTS:
- Generate ONLY valid Plotly.js JSON specification
- Use the exact chart type recommended in the reasoning analysis
- Populate x/y arrays with actual data from the sample provided
- Apply professional styling with appropriate colors and fonts
- Include meaningful titles, axis labels, and formatting

TECHNICAL SPECIFICATIONS:
- Colors: Use professional palette starting with #667eea
- Fonts: Size 16 for titles, 12-14 for labels, color #333
- Margins: Standard t:60, b:60, l:60, r:40 unless chart needs more space
- Responsiveness: Charts must work on mobile and desktop
- Accessibility: Include proper titles and labels for screen readers

CHART-SPECIFIC GUIDELINES:
- Bar charts: Sort by value when logical, limit to top 10-15 categories
- Line charts: Sort by x-axis chronologically, smooth lines for trends
- Scatter plots: Include proper axis scaling, consider trend lines
- Pie charts: Limit to 8 segments, combine small segments into "Others"
- Heatmaps: Use diverging color scales, include color bar legends
- Histograms: Choose appropriate bin sizes, show distribution shape clearly

QUALITY STANDARDS:
- Charts must accurately represent the data without distortion
- Visual hierarchy should guide the viewer's attention appropriately
- Interactive features should enhance, not overwhelm the experience
- Performance: Charts should render quickly with sample data sizes

CRITICAL: Return ONLY the Plotly.js JSON specification. No markdown, no explanations, no additional text.`
};
async function uploadCsvHandler(request, env) {
  console.log("\u{1F4E5} uploadCsvHandler: received request");
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const csvText = await file.text();
    console.debug("CSV size:", csvText.length);
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    });
    if (parseResult.errors.length > 0) {
      console.error("CSV parsing errors:", parseResult.errors);
      return new Response(JSON.stringify({ error: "CSV parsing failed", details: parseResult.errors }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const data = parseResult.data;
    const schema = inferSchema(data);
    const sampleRows = data.slice(0, 10);
    console.log("\u{1F50D} Starting AI analysis of dataset...");
    const analysis = await analyzeDataWithAI(schema, sampleRows, env);
    console.log("\u2705 AI analysis completed");
    const datasetId = generateUUID();
    await Promise.all([
      env.KV.put(`${datasetId}:schema`, JSON.stringify(schema)),
      env.KV.put(`${datasetId}:sample`, JSON.stringify(sampleRows)),
      env.KV.put(`${datasetId}:analysis`, JSON.stringify(analysis)),
      env.KV.put(`${datasetId}:full`, csvText)
    ]);
    console.log("Dataset and analysis stored with ID", datasetId);
    const response = {
      datasetId,
      schema,
      sampleRows,
      analysis
    };
    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(uploadCsvHandler, "uploadCsvHandler");
async function performAIReasoning(prompt, schema, sampleRows, analysis, env) {
  const reasoningPrompt = `${SYSTEM_PROMPTS2.REASONING_ANALYSIS}

VISUALIZATION REASONING REQUEST:

USER'S REQUEST: "${prompt}"

DATASET SCHEMA & CONTEXT:
${JSON.stringify(schema.map((col) => ({ name: col.name, type: col.type, stats: col.stats })), null, 2)}

SAMPLE DATA FOR REFERENCE:
${JSON.stringify(sampleRows.slice(0, 8), null, 2)}

${analysis ? `EXISTING ANALYSIS INSIGHTS:
Summary: ${analysis.summary}
Key Patterns: ${analysis.insights.slice(0, 3).join(" | ")}
Data Quality: ${analysis.dataQuality.completeness}% complete
${analysis.patterns ? `Detected Patterns: ${analysis.patterns.trends.concat(analysis.patterns.distributions.map((d) => `${d.column} distribution`)).join(", ")}` : ""}
${analysis.businessInsights ? `Business Context: ${analysis.businessInsights.slice(0, 2).join(" | ")}` : ""}
` : ""}

REQUIRED JSON OUTPUT FORMAT:
{
  "reasoning": "Step-by-step analysis of user intent, data characteristics, and optimal visualization strategy",
  "recommendedChartType": "single_best_chart_type",
  "primaryVariables": ["most_relevant_column1", "most_relevant_column2"],
  "considerations": ["data_suitability_factor", "visualization_best_practice", "user_intent_factor"],
  "dataInsights": "how the data characteristics inform this visualization choice",
  "alternativeApproaches": ["alternative_chart_type_1", "alternative_chart_type_2"],
  "expectedOutcome": "specific insights the user will gain from this visualization"
}

ANALYSIS FRAMEWORK:
1. Parse user intent - what specific question are they trying to answer?
2. Evaluate data fitness - which columns best support this analysis?
3. Apply visualization principles - what chart type maximizes clarity and insight?
4. Consider data limitations - any quality issues or constraints?
5. Predict value - what actionable insights will this reveal?`;
  try {
    const response = await env.AI.run("@cf/qwen/qwq-32b", {
      prompt: reasoningPrompt,
      max_tokens: 800
    });
    let responseText = response.response || response.choices?.[0]?.text || response;
    if (typeof responseText === "string") {
      responseText = responseText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const thinkEndIndex = responseText.lastIndexOf("</think>");
      if (thinkEndIndex !== -1) {
        responseText = responseText.substring(thinkEndIndex + 8).trim();
      }
      const jsonStart = responseText.indexOf("{");
      const jsonEnd = responseText.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        responseText = responseText.substring(jsonStart, jsonEnd + 1);
      }
    }
    const reasoning = JSON.parse(responseText);
    console.log("\u{1F9E0} AI Reasoning:", reasoning.reasoning);
    return reasoning;
  } catch (error) {
    console.error("AI reasoning failed:", error);
    return {
      reasoning: "Analyzing user request for appropriate visualization approach",
      recommendedChartType: "bar",
      primaryVariables: schema.filter((col) => col.type === "number").slice(0, 2).map((col) => col.name),
      considerations: ["Data availability", "Chart readability", "User intent"],
      dataInsights: "Basic data overview needed",
      alternativeApproaches: ["histogram", "scatter"],
      expectedOutcome: "Visual representation of the requested data pattern"
    };
  }
}
__name(performAIReasoning, "performAIReasoning");
async function queryHandler(request, env) {
  console.log("\u{1F50D} queryHandler: request:", request.url);
  try {
    const { datasetId, prompt } = await request.json();
    console.log("Using dataset:", datasetId, "prompt:", prompt);
    const [schemaStr, sampleRowsStr, analysisStr] = await Promise.all([
      env.KV.get(`${datasetId}:schema`),
      env.KV.get(`${datasetId}:sample`),
      env.KV.get(`${datasetId}:analysis`)
    ]);
    if (!schemaStr || !sampleRowsStr) {
      return new Response(JSON.stringify({ error: "Dataset not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const schema = JSON.parse(schemaStr);
    const sampleRows = JSON.parse(sampleRowsStr);
    const analysis = analysisStr ? JSON.parse(analysisStr) : null;
    console.log("\u{1F914} AI is analyzing the request and data context...");
    const reasoningResponse = await performAIReasoning(prompt, schema, sampleRows, analysis, env);
    console.log("\u2705 AI reasoning completed:", reasoningResponse.reasoning);
    console.log("\u{1F3A8} Generating chart based on AI reasoning...");
    const structuredPrompt = `${SYSTEM_PROMPTS2.CHART_GENERATION}

CHART IMPLEMENTATION REQUEST:

USER'S ORIGINAL REQUEST: "${prompt}"

PREVIOUS AI REASONING ANALYSIS:
Reasoning: ${reasoningResponse.reasoning}
Recommended Chart Type: ${reasoningResponse.recommendedChartType}
Primary Variables: ${reasoningResponse.primaryVariables.join(", ")}
Key Considerations: ${reasoningResponse.considerations.join(", ")}
Expected Outcome: ${reasoningResponse.expectedOutcome}

DATASET SCHEMA WITH STATISTICS:
${JSON.stringify(schema.map((col) => ({ name: col.name, type: col.type, stats: col.stats })), null, 2)}

SAMPLE DATA FOR IMPLEMENTATION:
${JSON.stringify(sampleRows.slice(0, 10), null, 2)}

${analysis ? `STATISTICAL CONTEXT TO INCORPORATE:
Business Insights: ${analysis.insights.slice(0, 3).join(" | ")}
${analysis.patterns ? `
Key Patterns:
- Trends: ${analysis.patterns.trends.join(", ")}
- Distributions: ${analysis.patterns.distributions.map((d) => `${d.column} (${d.type})`).join(", ")}
` : ""}` : ""}

IMPLEMENTATION REQUIREMENTS:
- Chart Type: ${reasoningResponse.recommendedChartType}
- Primary Variables: ${reasoningResponse.primaryVariables.join(" and ")}
- Use actual sample data values to populate x/y arrays
- Apply professional styling with gradient colors starting with #667eea
- Include meaningful titles and axis labels based on the analysis context
- Ensure chart tells the story identified in the reasoning phase

RETURN ONLY PLOTLY.JS JSON SPECIFICATION - NO MARKDOWN, NO EXPLANATIONS:`;
    const aiResponse = await env.AI.run("@cf/qwen/qwq-32b", {
      prompt: structuredPrompt,
      max_tokens: 1024
    });
    console.log("LLM response received");
    let chartSpec;
    try {
      let responseText = aiResponse.response || aiResponse.choices?.[0]?.text || aiResponse;
      if (typeof responseText === "string") {
        responseText = responseText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        const thinkEndIndex = responseText.lastIndexOf("</think>");
        if (thinkEndIndex !== -1) {
          responseText = responseText.substring(thinkEndIndex + 8).trim();
        }
        const jsonStart = responseText.indexOf("{");
        const jsonEnd = responseText.lastIndexOf("}");
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          responseText = responseText.substring(jsonStart, jsonEnd + 1);
        }
      }
      console.debug("Cleaned AI response:", responseText);
      chartSpec = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Raw AI response:", aiResponse);
      console.log("Using fallback chart generation");
      chartSpec = createFallbackChart(schema, sampleRows);
    }
    console.debug("Parsed chart spec:", chartSpec);
    const response = {
      chartSpec,
      reasoning: reasoningResponse,
      logs: ["AI reasoning completed", "Chart specification generated successfully"]
    };
    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Query error:", error);
    return new Response(JSON.stringify({
      error: "Internal server error",
      logs: ["Query processing failed"]
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(queryHandler, "queryHandler");

// src/index.ts
var index_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }
    if (path === "/upload" && request.method === "POST") {
      return uploadCsvHandler(request, env);
    }
    if (path === "/query" && request.method === "POST") {
      return queryHandler(request, env);
    }
    if (path === "/" && request.method === "GET") {
      return new Response(getIndexHtml(), {
        headers: { "Content-Type": "text/html" }
      });
    }
    return new Response("Not Found", { status: 404 });
  }
};
function getIndexHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSV AI Agent - Professional Data Analytics Platform</title>
    <script src="https://cdn.plot.ly/plotly-2.32.0.min.js"><\/script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"><\/script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        :root {
            --primary-50: #f0f9ff;
            --primary-100: #e0f2fe;
            --primary-200: #bae6fd;
            --primary-300: #7dd3fc;
            --primary-400: #38bdf8;
            --primary-500: #0ea5e9;
            --primary-600: #0284c7;
            --primary-700: #0369a1;
            --primary-800: #075985;
            --primary-900: #0c4a6e;
            
            --gray-50: #f8fafc;
            --gray-100: #f1f5f9;
            --gray-200: #e2e8f0;
            --gray-300: #cbd5e1;
            --gray-400: #94a3b8;
            --gray-500: #64748b;
            --gray-600: #475569;
            --gray-700: #334155;
            --gray-800: #1e293b;
            --gray-900: #0f172a;
            
            --success-50: #f0fdf4;
            --success-200: #bbf7d0;
            --success-500: #22c55e;
            --success-600: #16a34a;
            
            --error-50: #fef2f2;
            --error-200: #fecaca;
            --error-500: #ef4444;
            --error-600: #dc2626;
            
            --warning-50: #fffbeb;
            --warning-200: #fed7aa;
            --warning-500: #f59e0b;
            --warning-600: #d97706;
            
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            
            --border-radius-sm: 0.375rem;
            --border-radius-md: 0.5rem;
            --border-radius-lg: 0.75rem;
            --border-radius-xl: 1rem;
        }
        
        body { 
            font-family: 'Inter', system-ui, -apple-system, sans-serif; 
            background: var(--gray-50);
            color: var(--gray-900);
            line-height: 1.6;
        }
        
        .header {
            background: white;
            border-bottom: 1px solid var(--gray-200);
            padding: 1.5rem 0;
            position: sticky;
            top: 0;
            z-index: 50;
            box-shadow: var(--shadow-sm);
        }
        
        .header-content {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .logo-icon {
            width: 2rem;
            height: 2rem;
            background: var(--primary-500);
            border-radius: var(--border-radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        
        .logo h1 {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--gray-900);
        }
        
        .subtitle {
            font-size: 0.875rem;
            color: var(--gray-600);
            margin-top: 0.25rem;
        }
        
        .main-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .grid-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .full-width {
            grid-column: 1 / -1;
        }
        
        .card { 
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: var(--border-radius-xl);
            padding: 1.5rem;
            box-shadow: var(--shadow-sm);
            transition: all 0.2s ease-in-out;
        }
        
        .card:hover {
            box-shadow: var(--shadow-md);
            border-color: var(--gray-300);
        }
        
        .card-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
        }
        
        .card-icon {
            width: 1.25rem;
            height: 1.25rem;
            color: var(--primary-500);
        }
        
        .card-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--gray-900);
        }
        
        .file-upload-area {
            border: 2px dashed var(--gray-300);
            border-radius: var(--border-radius-lg);
            padding: 2rem;
            text-align: center;
            transition: all 0.2s ease-in-out;
            cursor: pointer;
            background: var(--gray-50);
        }
        
        .file-upload-area:hover {
            border-color: var(--primary-400);
            background: var(--primary-50);
        }
        
        .file-upload-area.dragover {
            border-color: var(--primary-500);
            background: var(--primary-100);
        }
        
        .file-upload-area.has-file {
            border-color: var(--success-500);
            background: var(--success-50);
        }
        
        .file-selected {
            margin-top: 1rem;
            padding: 0.75rem;
            background: var(--primary-50);
            border: 1px solid var(--primary-200);
            border-radius: var(--border-radius-md);
            color: var(--primary-700);
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .upload-progress {
            margin-top: 1rem;
            padding: 1rem;
            background: var(--primary-50);
            border: 1px solid var(--primary-200);
            border-radius: var(--border-radius-md);
            display: none;
        }
        
        .upload-progress.show {
            display: block;
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: var(--gray-200);
            border-radius: 4px;
            overflow: hidden;
            margin-top: 0.5rem;
        }
        
        .progress-fill {
            height: 100%;
            background: var(--primary-500);
            border-radius: 4px;
            transition: width 0.3s ease;
            animation: pulse 2s infinite;
        }
        
        .upload-icon {
            width: 3rem;
            height: 3rem;
            color: var(--gray-400);
            margin: 0 auto 1rem;
        }
        
        .upload-text {
            font-weight: 500;
            color: var(--gray-700);
            margin-bottom: 0.5rem;
        }
        
        .upload-subtext {
            font-size: 0.875rem;
            color: var(--gray-500);
        }
        
        .file-input {
            display: none;
        }
        
        .prompt-input {
            width: 100%;
            min-height: 120px;
            padding: 1rem;
            border: 1px solid var(--gray-300);
            border-radius: var(--border-radius-lg);
            font-family: inherit;
            font-size: 0.875rem;
            resize: vertical;
            transition: all 0.2s ease-in-out;
            background: white;
        }
        
        .prompt-input:focus {
            outline: none;
            border-color: var(--primary-500);
            box-shadow: 0 0 0 3px var(--primary-100);
        }
        
        .prompt-input::placeholder {
            color: var(--gray-400);
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: var(--border-radius-md);
            font-family: inherit;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            text-decoration: none;
        }
        
        .btn-primary {
            background: var(--primary-500);
            color: white;
            box-shadow: var(--shadow-sm);
        }
        
        .btn-primary:hover {
            background: var(--primary-600);
            box-shadow: var(--shadow-md);
            transform: translateY(-1px);
        }
        
        .btn-primary:active {
            transform: translateY(0);
        }
        
        .btn-primary:disabled {
            background: var(--gray-300);
            color: var(--gray-500);
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
        
        .btn-primary:disabled:hover {
            background: var(--gray-300);
            transform: none;
            box-shadow: none;
        }
        
        .btn-secondary {
            background: var(--gray-100);
            color: var(--gray-700);
            border: 1px solid var(--gray-300);
        }
        
        .btn-secondary:hover {
            background: var(--gray-200);
            border-color: var(--gray-400);
        }
        
        .btn-icon {
            width: 1rem;
            height: 1rem;
        }
        
        .status {
            padding: 1rem;
            border-radius: var(--border-radius-md);
            margin: 1rem 0;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .status.success {
            background: var(--success-50);
            color: var(--success-600);
            border: 1px solid var(--success-200);
        }
        
        .status.error {
            background: var(--error-50);
            color: var(--error-600);
            border: 1px solid var(--error-200);
        }
        
        .status.info {
            background: var(--primary-50);
            color: var(--primary-600);
            border: 1px solid var(--primary-200);
        }
        
        .status.warning {
            background: var(--warning-50);
            color: var(--warning-600);
            border: 1px solid var(--warning-200);
        }
        
        .loading-spinner {
            width: 1rem;
            height: 1rem;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin: 1.5rem 0;
        }
        
        .metric-card {
            background: var(--gray-50);
            border: 1px solid var(--gray-200);
            border-radius: var(--border-radius-md);
            padding: 1rem;
            text-align: center;
        }
        
        .metric-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary-600);
            margin-bottom: 0.25rem;
        }
        
        .metric-label {
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--gray-600);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .insights-list {
            list-style: none;
            margin: 1rem 0;
        }
        
        .insights-list li {
            background: var(--gray-50);
            border: 1px solid var(--gray-200);
            border-radius: var(--border-radius-md);
            padding: 1rem;
            margin-bottom: 0.75rem;
            font-size: 0.875rem;
            line-height: 1.5;
            position: relative;
            padding-left: 2.5rem;
        }
        
        .insights-list li::before {
            content: '';
            position: absolute;
            left: 1rem;
            top: 1.25rem;
            width: 0.25rem;
            height: 0.25rem;
            background: var(--primary-500);
            border-radius: 50%;
        }
        
        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .chart-container {
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: var(--border-radius-xl);
            padding: 1.5rem;
            box-shadow: var(--shadow-sm);
        }
        
        .chart-title {
            font-size: 1rem;
            font-weight: 600;
            color: var(--gray-900);
            margin-bottom: 0.5rem;
        }
        
        .chart-description {
            font-size: 0.875rem;
            color: var(--gray-600);
            margin-bottom: 1.5rem;
        }
        
        .suggestions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1rem;
            margin-top: 1.5rem;
        }
        
        .suggestion-card {
            background: white;
            border: 1px solid var(--gray-200);
            border-radius: var(--border-radius-lg);
            padding: 1rem;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
        }
        
        .suggestion-card:hover {
            border-color: var(--primary-300);
            box-shadow: var(--shadow-md);
            transform: translateY(-1px);
        }
        
        .suggestion-title {
            font-weight: 600;
            color: var(--gray-900);
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
        }
        
        .suggestion-description {
            font-size: 0.75rem;
            color: var(--gray-600);
            line-height: 1.4;
            margin-bottom: 0.75rem;
        }
        
        .suggestion-category {
            display: inline-block;
            background: var(--primary-100);
            color: var(--primary-700);
            padding: 0.25rem 0.5rem;
            border-radius: var(--border-radius-sm);
            font-size: 0.625rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .reasoning-section {
            background: var(--primary-50);
            border: 1px solid var(--primary-200);
            border-radius: var(--border-radius-lg);
            padding: 1.5rem;
            margin: 1.5rem 0;
        }
        
        .reasoning-title {
            font-weight: 600;
            color: var(--primary-700);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .reasoning-content {
            font-size: 0.875rem;
            color: var(--gray-700);
            line-height: 1.5;
        }
        
        .section-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--gray-900);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .grid-layout {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            
            .main-container {
                padding: 1rem;
            }
            
            .header-content {
                padding: 0 1rem;
            }
            
            .charts-grid {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            
            .suggestions-grid {
                grid-template-columns: 1fr;
            }
            
            .metrics-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        /* Animations */
        .fade-in {
            animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
        }
        
        ::-webkit-scrollbar-track {
            background: var(--gray-100);
        }
        
        ::-webkit-scrollbar-thumb {
            background: var(--gray-400);
            border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: var(--gray-500);
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <div class="logo">
                <div class="logo-icon">
                    <i data-lucide="bar-chart-3"></i>
                </div>
                <div>
                    <h1>CSV AI Agent</h1>
                    <p class="subtitle">Professional Data Analytics Platform</p>
                </div>
            </div>
        </div>
    </div>

    <div class="main-container">
        <div class="grid-layout">
            <div class="card">
                <div class="card-header">
                    <i data-lucide="upload" class="card-icon"></i>
                    <h2 class="card-title">Upload Dataset</h2>
                </div>
                <div class="file-upload-area" id="uploadArea" onclick="document.getElementById('csvFile').click()">
                    <i data-lucide="file-plus" class="upload-icon"></i>
                    <div class="upload-text">Click to upload or drag and drop</div>
                    <div class="upload-subtext">CSV files only \u2022 Max 10MB</div>
                </div>
                <div id="fileSelected" class="file-selected" style="display: none;">
                    <i data-lucide="file-check"></i>
                    <span id="fileName"></span>
                    <button onclick="clearFile()" style="margin-left: auto; background: none; border: none; color: var(--gray-500); cursor: pointer;">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div id="uploadProgress" class="upload-progress">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <div class="loading-spinner"></div>
                        <span>Uploading and analyzing your data...</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 100%;"></div>
                    </div>
                </div>
                <input type="file" id="csvFile" accept=".csv" class="file-input">
                <button id="uploadBtn" onclick="uploadFile()" class="btn btn-primary" style="margin-top: 1rem; width: 100%;" disabled>
                    <i data-lucide="zap" class="btn-icon"></i>
                    Analyze Dataset
                </button>
                <div id="uploadStatus"></div>
            </div>

            <div class="card">
                <div class="card-header">
                    <i data-lucide="message-circle" class="card-icon"></i>
                    <h2 class="card-title">Query Interface</h2>
                </div>
                <textarea id="promptInput" class="prompt-input" placeholder="Ask questions about your data...

Examples:
\u2022 Show revenue trends over time
\u2022 Compare performance by category  
\u2022 Display top 10 products by sales
\u2022 Create a correlation analysis"></textarea>
                <button onclick="generateChart()" class="btn btn-primary" style="margin-top: 1rem; width: 100%;">
                    <i data-lucide="sparkles" class="btn-icon"></i>
                    Generate Visualization
                </button>
                <div id="queryStatus"></div>
            </div>
        </div>

        <div id="analysisResults" class="full-width" style="display: none;">
            <div class="card fade-in">
                <div class="card-header">
                    <i data-lucide="brain" class="card-icon"></i>
                    <h2 class="card-title">AI Analysis Results</h2>
                </div>
                <div id="analysisContent"></div>
            </div>
        </div>

        <div id="autoChartsSection" class="full-width" style="display: none;">
            <div class="card fade-in">
                <div class="card-header">
                    <i data-lucide="bar-chart" class="card-icon"></i>
                    <h2 class="card-title">Automatic Dashboard</h2>
                </div>
                <p style="color: var(--gray-600); margin-bottom: 1.5rem;">AI-generated visualizations based on your data characteristics</p>
                <div id="autoCharts" class="charts-grid"></div>
            </div>
        </div>

        <div id="reasoningSection" class="full-width" style="display: none;">
            <div class="card fade-in">
                <div class="card-header">
                    <i data-lucide="lightbulb" class="card-icon"></i>
                    <h2 class="card-title">AI Reasoning Process</h2>
                </div>
                <div id="reasoningContent" class="reasoning-section"></div>
            </div>
        </div>

        <div id="chartSection" class="full-width" style="display: none;">
            <div class="card fade-in">
                <div class="card-header">
                    <i data-lucide="trending-up" class="card-icon"></i>
                    <h2 class="card-title">Custom Visualization</h2>
                </div>
                <div id="chartContainer" class="chart-container"></div>
            </div>
        </div>

        <div id="suggestionsSection" class="full-width" style="display: none;">
            <div class="card fade-in">
                <div class="card-header">
                    <i data-lucide="compass" class="card-icon"></i>
                    <h2 class="card-title">Suggested Explorations</h2>
                </div>
                <p style="color: var(--gray-600); margin-bottom: 1.5rem;">AI-generated questions tailored to your specific dataset</p>
                <div id="suggestions" class="suggestions-grid"></div>
            </div>
        </div>
    </div>

    <script>
        // Initialize Lucide icons
        lucide.createIcons();
        
        let currentDatasetId = null;
        let currentAnalysis = null;

        // Upload and analyze CSV file
        async function uploadFile() {
            const fileInput = document.getElementById('csvFile');
            const statusDiv = document.getElementById('uploadStatus');
            const uploadProgress = document.getElementById('uploadProgress');
            const uploadBtn = document.getElementById('uploadBtn');

            if (!fileInput.files || fileInput.files.length === 0) {
                statusDiv.innerHTML = '<div class="status error"><i data-lucide="alert-circle"></i>Please select a CSV file first.</div>';
                lucide.createIcons();
                return;
            }

            // Show upload progress
            uploadProgress.classList.add('show');
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = '<div class="loading-spinner"></div>Processing...';
            statusDiv.innerHTML = '';

            const formData = new FormData();
            formData.append('file', fileInput.files[0]);

            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                // Hide upload progress
                uploadProgress.classList.remove('show');

                if (response.ok) {
                    currentDatasetId = result.datasetId;
                    currentAnalysis = result.analysis;
                    
                    // Show success with prominent styling
                    statusDiv.innerHTML = '<div class="status success" style="font-size: 1rem; padding: 1.5rem; margin: 1.5rem 0; background: var(--success-50); border: 2px solid var(--success-500);"><i data-lucide="check-circle"></i><strong>Success!</strong> Dataset uploaded and analyzed successfully! Scroll down to see your insights.</div>';
                    lucide.createIcons();
                    
                    // Update button state
                    uploadBtn.disabled = false;
                    uploadBtn.innerHTML = '<i data-lucide="refresh-cw" class="btn-icon"></i>Upload New Dataset';
                    
                    // Show analysis results with animation
                    setTimeout(() => {
                        showAnalysisResults(result.analysis, result.schema, result.sampleRows);
                        
                        // Show auto-generated charts  
                        if (result.analysis.autoCharts && result.analysis.autoCharts.length > 0) {
                            setTimeout(() => showAutoCharts(result.analysis.autoCharts), 300);
                        }
                        
                        // Show suggested prompts
                        if (result.analysis.suggestedPrompts) {
                            setTimeout(() => showSuggestedPrompts(result.analysis.suggestedPrompts), 600);
                        }
                        
                        // Scroll to results
                        setTimeout(() => {
                            document.getElementById('analysisResults').scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'start' 
                            });
                        }, 800);
                    }, 500);
                    
                } else {
                    statusDiv.innerHTML = '<div class="status error"><i data-lucide="x-circle"></i><strong>Upload Failed:</strong> ' + result.error + '</div>';
                    lucide.createIcons();
                    
                    // Reset button
                    uploadBtn.disabled = false;
                    uploadBtn.innerHTML = '<i data-lucide="zap" class="btn-icon"></i>Analyze Dataset';
                }
            } catch (error) {
                uploadProgress.classList.remove('show');
                statusDiv.innerHTML = '<div class="status error"><i data-lucide="x-circle"></i><strong>Network Error:</strong> ' + error.message + '</div>';
                lucide.createIcons();
                
                // Reset button
                uploadBtn.disabled = false;
                uploadBtn.innerHTML = '<i data-lucide="zap" class="btn-icon"></i>Analyze Dataset';
            }
        }
        
        // Handle file selection
        function handleFileSelect() {
            const fileInput = document.getElementById('csvFile');
            const uploadArea = document.getElementById('uploadArea');
            const fileSelected = document.getElementById('fileSelected');
            const fileName = document.getElementById('fileName');
            const uploadBtn = document.getElementById('uploadBtn');
            
            if (fileInput.files && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                uploadArea.classList.add('has-file');
                fileSelected.style.display = 'flex';
                fileName.textContent = file.name + ' (' + (file.size / 1024 / 1024).toFixed(2) + ' MB)';
                uploadBtn.disabled = false;
                lucide.createIcons();
            }
        }
        
        // Clear file selection
        function clearFile() {
            const fileInput = document.getElementById('csvFile');
            const uploadArea = document.getElementById('uploadArea');
            const fileSelected = document.getElementById('fileSelected');
            const uploadBtn = document.getElementById('uploadBtn');
            const statusDiv = document.getElementById('uploadStatus');
            
            fileInput.value = '';
            uploadArea.classList.remove('has-file');
            fileSelected.style.display = 'none';
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = '<i data-lucide="zap" class="btn-icon"></i>Analyze Dataset';
            statusDiv.innerHTML = '';
            
            // Hide all results sections
            document.getElementById('analysisResults').style.display = 'none';
            document.getElementById('autoChartsSection').style.display = 'none';
            document.getElementById('suggestionsSection').style.display = 'none';
            document.getElementById('reasoningSection').style.display = 'none';
            document.getElementById('chartSection').style.display = 'none';
            
            lucide.createIcons();
        }

        // Generate custom chart from user query
        async function generateChart() {
            const promptInput = document.getElementById('promptInput');
            const statusDiv = document.getElementById('queryStatus');

            if (!currentDatasetId) {
                statusDiv.innerHTML = '<div class="status error"><i data-lucide="alert-circle"></i>Please upload a CSV file first.</div>';
                lucide.createIcons();
                return;
            }

            if (!promptInput.value.trim()) {
                statusDiv.innerHTML = '<div class="status error"><i data-lucide="alert-circle"></i>Please enter a question about your data.</div>';
                lucide.createIcons();
                return;
            }

            statusDiv.innerHTML = '<div class="status info"><div class="loading-spinner"></div>AI is analyzing your request...</div>';

            try {
                const response = await fetch('/query', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        datasetId: currentDatasetId,
                        prompt: promptInput.value
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    statusDiv.innerHTML = '<div class="status success"><i data-lucide="check-circle"></i>AI analysis complete! Chart generated successfully!</div>';
                    lucide.createIcons();
                    
                    // Show AI reasoning if available
                    if (result.reasoning) {
                        showReasoning(result.reasoning);
                    }
                    
                    // Show the generated chart
                    showChart(result.chartSpec);
                    
                } else {
                    statusDiv.innerHTML = '<div class="status error"><i data-lucide="x-circle"></i>Query failed: ' + result.error + '</div>';
                    lucide.createIcons();
                }
            } catch (error) {
                statusDiv.innerHTML = '<div class="status error"><i data-lucide="x-circle"></i>Query error: ' + error.message + '</div>';
                lucide.createIcons();
            }
        }

        // Display analysis results
        function showAnalysisResults(analysis, schema, sampleRows) {
            const analysisSection = document.getElementById('analysisResults');
            const analysisContent = document.getElementById('analysisContent');
            
            let metricsHtml = '<div class="metrics-grid">';
            metricsHtml += '<div class="metric-card"><div class="metric-value">' + schema.length + '</div><div class="metric-label">Total Columns</div></div>';
            metricsHtml += '<div class="metric-card"><div class="metric-value">' + sampleRows.length + '</div><div class="metric-label">Sample Rows</div></div>';
            metricsHtml += '<div class="metric-card"><div class="metric-value">' + analysis.dataQuality.completeness + '%</div><div class="metric-label">Data Quality</div></div>';
            metricsHtml += '<div class="metric-card"><div class="metric-value">' + schema.filter(col => col.type === 'number').length + '</div><div class="metric-label">Numeric Columns</div></div>';
            metricsHtml += '</div>';
            
            let contentHtml = metricsHtml;
            contentHtml += '<h3 class="section-title"><i data-lucide="file-text"></i>Dataset Summary</h3>';
            contentHtml += '<p style="color: var(--gray-700); line-height: 1.6; margin-bottom: 1.5rem;">' + analysis.summary + '</p>';
            
            contentHtml += '<h3 class="section-title"><i data-lucide="eye"></i>Key Insights</h3>';
            contentHtml += '<ul class="insights-list">';
            analysis.insights.forEach(insight => {
                contentHtml += '<li>' + insight + '</li>';
            });
            contentHtml += '</ul>';
            
            if (analysis.businessInsights) {
                contentHtml += '<h3 class="section-title"><i data-lucide="target"></i>Business Insights</h3>';
                contentHtml += '<ul class="insights-list">';
                analysis.businessInsights.forEach(insight => {
                    contentHtml += '<li>' + insight + '</li>';
                });
                contentHtml += '</ul>';
            }
            
            if (analysis.dataQuality.issues.length > 0) {
                contentHtml += '<h3 class="section-title"><i data-lucide="alert-triangle"></i>Data Quality Issues</h3>';
                contentHtml += '<ul class="insights-list">';
                analysis.dataQuality.issues.forEach(issue => {
                    contentHtml += '<li>' + issue + '</li>';
                });
                contentHtml += '</ul>';
            }
            
            analysisContent.innerHTML = contentHtml;
            analysisSection.style.display = 'block';
            lucide.createIcons();
        }

        // Display auto-generated charts
        function showAutoCharts(autoCharts) {
            const autoChartsSection = document.getElementById('autoChartsSection');
            const autoChartsContainer = document.getElementById('autoCharts');
            
            autoChartsContainer.innerHTML = '';
            
            autoCharts.forEach((chart, index) => {
                const chartDiv = document.createElement('div');
                chartDiv.className = 'chart-container';
                chartDiv.innerHTML = '<h3 class="chart-title">' + chart.title + '</h3><p class="chart-description">' + chart.description + '</p><div id="autoChart' + index + '" style="height: 400px;"></div>';
                autoChartsContainer.appendChild(chartDiv);
                
                // Render the chart
                setTimeout(() => {
                    try {
                        Plotly.newPlot('autoChart' + index, chart.chartSpec.data, {
                            ...chart.chartSpec.layout,
                            font: { family: 'Inter, sans-serif', size: 12, color: '#1e293b' },
                            plot_bgcolor: 'rgba(255, 255, 255, 0.8)',
                            paper_bgcolor: 'rgba(255, 255, 255, 0.8)'
                        }, {
                            responsive: true,
                            displayModeBar: true,
                            displaylogo: false,
                            modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
                        });
                    } catch (error) {
                        console.error('Auto chart rendering error:', error);
                        document.getElementById('autoChart' + index).innerHTML = '<div style="text-align: center; color: var(--gray-500); padding: 40px;"><i data-lucide="alert-circle" style="width: 2rem; height: 2rem; margin-bottom: 1rem;"></i><p>Chart rendering failed</p><small>Chart type: ' + (chart.chartSpec.data[0]?.type || 'unknown') + '</small></div>';
                        lucide.createIcons();
                    }
                }, 100 * index);
            });
            
            autoChartsSection.style.display = 'block';
        }

        // Display AI reasoning process
        function showReasoning(reasoning) {
            const reasoningSection = document.getElementById('reasoningSection');
            const reasoningContent = document.getElementById('reasoningContent');
            
            let contentHtml = '<div class="reasoning-title"><i data-lucide="brain"></i>AI Analysis Process</div>';
            contentHtml += '<div class="reasoning-content">';
            contentHtml += '<p style="margin-bottom: 1rem;">' + reasoning.reasoning + '</p>';
            contentHtml += '<h4 style="font-weight: 600; margin-bottom: 0.5rem; color: var(--gray-800);">Chart Selection</h4>';
            contentHtml += '<p style="margin-bottom: 0.5rem;"><strong>Recommended Chart Type:</strong> ' + reasoning.recommendedChartType + '</p>';
            contentHtml += '<p style="margin-bottom: 0.5rem;"><strong>Primary Variables:</strong> ' + reasoning.primaryVariables.join(', ') + '</p>';
            contentHtml += '<p style="margin-bottom: 1rem;"><strong>Expected Outcome:</strong> ' + reasoning.expectedOutcome + '</p>';
            
            if (reasoning.considerations) {
                contentHtml += '<h4 style="font-weight: 600; margin-bottom: 0.5rem; color: var(--gray-800);">Key Considerations</h4>';
                contentHtml += '<ul style="list-style: disc; margin-left: 1.5rem;">';
                reasoning.considerations.forEach(consideration => {
                    contentHtml += '<li style="margin-bottom: 0.25rem;">' + consideration + '</li>';
                });
                contentHtml += '</ul>';
            }
            
            contentHtml += '</div>';
            reasoningContent.innerHTML = contentHtml;
            reasoningSection.style.display = 'block';
            lucide.createIcons();
        }

        // Display generated chart
        function showChart(chartSpec) {
            const chartSection = document.getElementById('chartSection');
            const chartContainer = document.getElementById('chartContainer');
            
            try {
                // Clear any existing chart
                chartContainer.innerHTML = '<div id="customChart" style="height: 500px;"></div>';
                
                // Create new chart with professional styling
                Plotly.newPlot('customChart', chartSpec.data, {
                    ...chartSpec.layout,
                    font: { family: 'Inter, sans-serif', size: 12, color: '#1e293b' },
                    plot_bgcolor: 'rgba(255, 255, 255, 0.8)',
                    paper_bgcolor: 'rgba(255, 255, 255, 0.8)',
                    margin: { l: 60, r: 40, t: 60, b: 60 }
                }, {
                    responsive: true,
                    displayModeBar: true,
                    displaylogo: false,
                    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d', 'autoScale2d']
                });
                
                chartSection.style.display = 'block';
                
                // Scroll to chart
                chartSection.scrollIntoView({ behavior: 'smooth' });
                
            } catch (plotError) {
                console.error('Plotly error:', plotError);
                chartContainer.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--gray-500); background: var(--gray-50); border-radius: var(--border-radius-lg);"><i data-lucide="alert-circle" style="width: 2rem; height: 2rem; margin-bottom: 1rem;"></i><h3>Chart Rendering Failed</h3><p>The AI generated a chart specification, but it could not be rendered properly.</p><details style="margin-top: 20px; text-align: left;"><summary style="cursor: pointer; font-weight: 600; color: var(--primary-600);">View Raw Chart Specification</summary><pre style="background: white; padding: 15px; border-radius: 8px; overflow: auto; margin-top: 10px; font-size: 12px; border: 1px solid var(--gray-200);">' + JSON.stringify(chartSpec, null, 2) + '</pre></details></div>';
                chartSection.style.display = 'block';
                lucide.createIcons();
            }
        }

        // Display suggested prompts
        function showSuggestedPrompts(suggestedPrompts) {
            const suggestionsSection = document.getElementById('suggestionsSection');
            const suggestionsContainer = document.getElementById('suggestions');
            
            let contentHtml = '';
            suggestedPrompts.forEach(prompt => {
                contentHtml += '<div class="suggestion-card" onclick="setQuery(\\'' + prompt.prompt + '\\')"><div class="suggestion-title">' + prompt.prompt + '</div><div class="suggestion-description">' + prompt.description + '</div><span class="suggestion-category">' + prompt.category + '</span></div>';
            });
            
            suggestionsContainer.innerHTML = contentHtml;
            suggestionsSection.style.display = 'block';
        }

        // Set query in prompt input
        function setQuery(query) {
            document.getElementById('promptInput').value = query;
            document.getElementById('promptInput').focus();
        }

        // Add keyboard shortcuts
        document.getElementById('promptInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                generateChart();
            }
        });

        // Add file selection event listener
        document.getElementById('csvFile').addEventListener('change', handleFileSelect);

        // Add file drag and drop functionality
        const fileInput = document.getElementById('csvFile');
        const uploadArea = document.querySelector('.file-upload-area');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });

        uploadArea.addEventListener('drop', handleDrop, false);

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function highlight() {
            uploadArea.classList.add('dragover');
        }

        function unhighlight() {
            uploadArea.classList.remove('dragover');
        }

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;

            if (files.length > 0 && files[0].name.endsWith('.csv')) {
                fileInput.files = files;
                handleFileSelect(); // Show file selected state
            } else {
                const statusDiv = document.getElementById('uploadStatus');
                statusDiv.innerHTML = '<div class="status warning"><i data-lucide="alert-triangle"></i>Please select a valid CSV file.</div>';
                lucide.createIcons();
            }
        }
    <\/script>
</body>
</html>`;
}
__name(getIndexHtml, "getIndexHtml");
export {
  index_default as default
};
/*! Bundled license information:

papaparse/papaparse.min.js:
  (* @license
  Papa Parse
  v5.5.3
  https://github.com/mholt/PapaParse
  License: MIT
  *)
*/
//# sourceMappingURL=index.js.map
