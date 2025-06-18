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

// src/prompts.ts
var SYSTEM_PROMPTS = {
  DATA_ANALYSIS: `You are a Senior Data Scientist and Business Intelligence Expert specializing in automated data discovery and insight generation.

CORE EXPERTISE:
- Statistical pattern recognition and anomaly detection
- Business metric identification and KPI analysis  
- Data quality assessment and improvement recommendations
- Automated insight generation for non-technical stakeholders

ANALYSIS FRAMEWORK:
1. DATA CHARACTERIZATION: Identify data types, distributions, and structural patterns
2. BUSINESS CONTEXT DETECTION: Recognize business metrics, KPIs, and operational data
3. STATISTICAL SIGNIFICANCE: Calculate correlations, trends, and outliers with confidence intervals
4. ACTIONABLE INSIGHTS: Generate specific, implementable business recommendations
5. VISUALIZATION STRATEGY: Recommend optimal chart types based on data characteristics and user intent

INPUT ANALYSIS PRIORITIES:
- Identify primary business metrics (revenue, sales, profit, costs, performance indicators)
- Detect temporal patterns and seasonality in time-series data
- Recognize categorical segments and their performance variations
- Calculate statistical significance of patterns and relationships
- Assess data completeness, consistency, and potential quality issues

OUTPUT REQUIREMENTS:
- Return ONLY valid JSON with precise statistical measurements
- Provide quantified insights with specific metrics and percentages
- Identify top 3-5 most significant patterns with business impact
- Generate contextually relevant visualization recommendations
- Create actionable suggested questions based on actual data patterns

CRITICAL: Focus on data-driven insights, not generic observations. All insights must be verifiable from the provided data.`,
  REASONING_ANALYSIS: `You are an Expert Data Visualization Strategist specializing in evidence-based chart selection and statistical storytelling.

VISUALIZATION SELECTION METHODOLOGY:
1. INTENT ANALYSIS: Decode user's analytical objective (comparison, distribution, correlation, trend, composition)
2. DATA SUITABILITY: Assess statistical properties, sample size, and data quality constraints
3. PERCEPTUAL EFFECTIVENESS: Apply Cleveland-McGill hierarchy and gestalt principles
4. CONTEXT OPTIMIZATION: Consider audience, complexity, and actionability requirements

CHART TYPE DECISION MATRIX:
- COMPARISON (categorical): Bar charts (vertical for <7 categories, horizontal for >7), dot plots for precision
- TEMPORAL (time-series): Line charts for continuous trends, step charts for discrete events
- CORRELATION (numeric pairs): Scatter plots with trend lines, bubble charts for 3D relationships  
- DISTRIBUTION (single variable): Histograms for continuous, box plots for quartile analysis
- COMPOSITION (part-to-whole): Pie charts for <6 segments, stacked bars for temporal composition
- RANKING (ordered categories): Horizontal bar charts sorted by value
- MULTIDIMENSIONAL: Heatmaps for matrices, small multiples for faceted analysis

STATISTICAL VALIDATION CRITERIA:
- Minimum sample size: 5+ data points for meaningful visualization
- Category limits: 2-12 categories for optimal cognitive processing
- Correlation threshold: |r| > 0.3 for scatter plot recommendations
- Distribution analysis: Test for normality, skewness, and outlier presence
- Temporal requirements: Chronological ordering and consistent intervals

OUTPUT REQUIREMENTS:
- Provide quantitative reasoning with statistical justification
- Recommend primary chart type with confidence scoring
- Identify optimal variables based on statistical significance
- Explain expected insights with specificity and measurability
- Include alternative approaches with comparative analysis

CRITICAL: Base all recommendations on statistical evidence and visualization research principles.`,
  CHART_GENERATION: `You are a Senior Data Visualization Engineer specializing in production-ready Plotly.js implementations with expertise in statistical graphics and interactive design.

TECHNICAL IMPLEMENTATION STANDARDS:
- Generate statistically accurate, publication-quality visualizations
- Apply evidence-based design principles (Tufte, Cleveland, Few)
- Ensure accessibility compliance (WCAG 2.1 AA) with proper contrast and labeling
- Optimize for both desktop and mobile rendering performance

PLOTLY.JS SPECIFICATION REQUIREMENTS:
- Create complete, valid JSON specifications with proper data binding
- Use actual sample data values with appropriate data transformations
- Implement responsive layouts with intelligent margin calculations
- Apply consistent color palettes with semantic meaning

VISUAL DESIGN PRINCIPLES:
- HIGH DATA-INK RATIO: Minimize chartjunk, maximize information density
- PERCEPTUAL ACCURACY: Use position/length encodings over color/area when possible
- CLEAR HIERARCHY: Guide attention through size, contrast, and positioning
- CONTEXTUAL ANNOTATIONS: Include statistical summaries (mean, median, trends) when relevant

CHART-SPECIFIC OPTIMIZATION:
- BAR CHARTS: Sort by value, highlight key insights, use consistent baselines
- LINE CHARTS: Show confidence intervals, trend lines, and seasonal patterns
- SCATTER PLOTS: Include correlation coefficients, regression lines, density overlays
- HISTOGRAMS: Optimize bin width using Freedman-Diaconis rule, show distribution statistics
- PIE CHARTS: Limit to 5-6 segments, order by size, highlight largest segment
- HEATMAPS: Use perceptually uniform color scales, include correlation values

INTERACTIVITY & PERFORMANCE:
- Implement hover tooltips with contextual statistics
- Enable zoom/pan for dense datasets
- Optimize rendering for sample sizes up to 10,000 points
- Include download/export capabilities

CRITICAL: Return ONLY complete Plotly.js JSON specification. Ensure mathematical accuracy and visual clarity.`
};

// src/utils.ts
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
  console.log("\u{1F3A8} Generating intelligent automatic charts...", { numericCols: numericCols.length, categoricalCols: categoricalCols.length, dateCols: dateCols.length });
  try {
    const chartRecommendations = generateSmartChartRecommendations(schema, sampleRows, analysis);
    for (const recommendation of chartRecommendations) {
      const chart = await generateOptimalChart(recommendation, schema, sampleRows, analysis);
      if (chart) {
        charts.push(chart);
      }
    }
    console.log(`\u2705 Generated ${charts.length} intelligent automatic charts`);
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
function generateSmartChartRecommendations(schema, sampleRows, analysis) {
  const recommendations = [];
  const numericCols = schema.filter((col) => col.type === "number");
  const categoricalCols = schema.filter((col) => col.type === "string");
  const dateCols = schema.filter((col) => col.type === "date");
  if (dateCols.length > 0 && numericCols.length > 0) {
    const timeCol = dateCols[0];
    const valueCol = findMostVariableNumericColumn(numericCols, sampleRows);
    if (valueCol && hasTemporalTrend(timeCol, valueCol, sampleRows)) {
      recommendations.push({
        type: "timeseries",
        priority: 1,
        title: `\u{1F4C8} ${valueCol.name} Trends Over Time`,
        description: `Temporal analysis showing how ${valueCol.name} changes over ${timeCol.name}`,
        columns: [timeCol, valueCol],
        reason: "Strong temporal patterns detected"
      });
    }
  }
  if (categoricalCols.length > 0 && numericCols.length > 0) {
    const categoryCol = findMostBalancedCategoricalColumn(categoricalCols, sampleRows);
    const metricCol = findBusinessMetricColumn(numericCols, sampleRows);
    if (categoryCol && metricCol && hasSignificantVariation(categoryCol, metricCol, sampleRows)) {
      recommendations.push({
        type: "comparison",
        priority: 2,
        title: `\u{1F4CA} ${metricCol.name} Performance by ${categoryCol.name}`,
        description: `Compare ${metricCol.name} across different ${categoryCol.name} segments`,
        columns: [categoryCol, metricCol],
        reason: "Significant performance variations detected"
      });
    }
  }
  if (numericCols.length > 0) {
    const keyMetric = findKeyMetricColumn(numericCols, sampleRows);
    if (keyMetric && hasInterestingDistribution(keyMetric, sampleRows)) {
      recommendations.push({
        type: "distribution",
        priority: 3,
        title: `\u{1F4CB} ${keyMetric.name} Distribution Analysis`,
        description: `Statistical distribution showing the spread and frequency of ${keyMetric.name} values`,
        columns: [keyMetric],
        reason: "Interesting distribution patterns detected"
      });
    }
  }
  if (numericCols.length >= 2) {
    const correlationPairs = findStrongCorrelations(numericCols, sampleRows);
    if (correlationPairs.length > 0) {
      const topPair = correlationPairs[0];
      recommendations.push({
        type: "correlation",
        priority: 4,
        title: `\u{1F517} ${topPair.col1.name} vs ${topPair.col2.name} Relationship`,
        description: `Scatter plot showing correlation between ${topPair.col1.name} and ${topPair.col2.name}`,
        columns: [topPair.col1, topPair.col2],
        reason: `Strong correlation detected (${topPair.correlation.toFixed(2)})`
      });
    }
  }
  if (categoricalCols.length > 0) {
    const meaningfulCategory = findMeaningfulCategoryColumn(categoricalCols, sampleRows);
    if (meaningfulCategory && hasBalancedDistribution(meaningfulCategory, sampleRows)) {
      recommendations.push({
        type: "composition",
        priority: 5,
        title: `\u{1F967} ${meaningfulCategory.name} Composition`,
        description: `Breakdown showing the proportion of each ${meaningfulCategory.name} category`,
        columns: [meaningfulCategory],
        reason: "Balanced category distribution suitable for comparison"
      });
    }
  }
  return recommendations.sort((a, b) => a.priority - b.priority).slice(0, 4);
}
__name(generateSmartChartRecommendations, "generateSmartChartRecommendations");
function findMostVariableNumericColumn(numericCols, sampleRows) {
  if (numericCols.length === 0) return null;
  return numericCols.reduce((prev, curr) => {
    const prevVariation = curr.stats?.stdDev || 0;
    const currVariation = prev.stats?.stdDev || 0;
    return prevVariation > currVariation ? curr : prev;
  });
}
__name(findMostVariableNumericColumn, "findMostVariableNumericColumn");
function findBusinessMetricColumn(numericCols, sampleRows) {
  const businessKeywords = ["revenue", "sales", "profit", "cost", "price", "amount", "value", "total", "count"];
  const businessCol = numericCols.find(
    (col) => businessKeywords.some((keyword) => col.name.toLowerCase().includes(keyword))
  );
  return businessCol || findMostVariableNumericColumn(numericCols, sampleRows);
}
__name(findBusinessMetricColumn, "findBusinessMetricColumn");
function findMostBalancedCategoricalColumn(categoricalCols, sampleRows) {
  if (categoricalCols.length === 0) return null;
  return categoricalCols.reduce((prev, curr) => {
    const prevBalance = calculateCategoryBalance(prev, sampleRows);
    const currBalance = calculateCategoryBalance(curr, sampleRows);
    return currBalance > prevBalance ? curr : prev;
  });
}
__name(findMostBalancedCategoricalColumn, "findMostBalancedCategoricalColumn");
function calculateCategoryBalance(col, sampleRows) {
  const values = sampleRows.map((row) => row[col.name]).filter((v) => v != null);
  const uniqueValues = [...new Set(values)];
  if (uniqueValues.length < 2 || uniqueValues.length > 8) return 0;
  const counts = uniqueValues.map((val) => values.filter((v) => v === val).length);
  const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
  const variance = counts.reduce((acc, count) => acc + Math.pow(count - mean, 2), 0) / counts.length;
  return mean > 0 ? 1 / (1 + variance / mean) : 0;
}
__name(calculateCategoryBalance, "calculateCategoryBalance");
function hasTemporalTrend(dateCol, numericCol, sampleRows) {
  const sortedData = sampleRows.filter((row) => row[dateCol.name] && row[numericCol.name]).sort((a, b) => new Date(a[dateCol.name]).getTime() - new Date(b[dateCol.name]).getTime());
  if (sortedData.length < 3) return false;
  const values = sortedData.map((row) => Number(row[numericCol.name]));
  const n = values.length;
  const slope = (n * values.reduce((acc, val, i) => acc + i * val, 0) - n * (n - 1) / 2 * values.reduce((a, b) => a + b, 0)) / (n * (n * (n - 1) * (2 * n - 1) / 6) - Math.pow(n * (n - 1) / 2, 2));
  return Math.abs(slope) > 0.1;
}
__name(hasTemporalTrend, "hasTemporalTrend");
function hasSignificantVariation(categoryCol, numericCol, sampleRows) {
  const groups = sampleRows.reduce((acc, row) => {
    const category = row[categoryCol.name];
    const value = Number(row[numericCol.name]);
    if (category && !isNaN(value)) {
      if (!acc[category]) acc[category] = [];
      acc[category].push(value);
    }
    return acc;
  }, {});
  const groupMeans = Object.values(groups).map(
    (values) => values.reduce((a, b) => a + b, 0) / values.length
  );
  if (groupMeans.length < 2) return false;
  const overallMean = groupMeans.reduce((a, b) => a + b, 0) / groupMeans.length;
  const variance = groupMeans.reduce((acc, mean) => acc + Math.pow(mean - overallMean, 2), 0) / groupMeans.length;
  return variance > Math.pow(overallMean * 0.1, 2);
}
__name(hasSignificantVariation, "hasSignificantVariation");
function hasInterestingDistribution(numericCol, sampleRows) {
  const values = sampleRows.map((row) => Number(row[numericCol.name])).filter((v) => !isNaN(v));
  if (values.length < 5) return false;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  const skewness = Math.abs(numericCol.stats?.stdDev || 0) > mean * 0.1;
  return skewness || variance > Math.pow(mean * 0.2, 2);
}
__name(hasInterestingDistribution, "hasInterestingDistribution");
function findStrongCorrelations(numericCols, sampleRows) {
  const correlations = [];
  for (let i = 0; i < numericCols.length; i++) {
    for (let j = i + 1; j < numericCols.length; j++) {
      const col1 = numericCols[i];
      const col2 = numericCols[j];
      const values1 = sampleRows.map((row) => Number(row[col1.name])).filter((v) => !isNaN(v));
      const values2 = sampleRows.map((row) => Number(row[col2.name])).filter((v) => !isNaN(v));
      const correlation = calculateCorrelation(values1, values2);
      if (Math.abs(correlation) > 0.5) {
        correlations.push({ col1, col2, correlation });
      }
    }
  }
  return correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
}
__name(findStrongCorrelations, "findStrongCorrelations");
function findKeyMetricColumn(numericCols, sampleRows) {
  return findBusinessMetricColumn(numericCols, sampleRows) || findMostVariableNumericColumn(numericCols, sampleRows);
}
__name(findKeyMetricColumn, "findKeyMetricColumn");
function findMeaningfulCategoryColumn(categoricalCols, sampleRows) {
  return categoricalCols.find((col) => {
    const values = sampleRows.map((row) => row[col.name]).filter((v) => v != null);
    const uniqueValues = [...new Set(values)];
    return uniqueValues.length >= 2 && uniqueValues.length <= 8;
  }) || null;
}
__name(findMeaningfulCategoryColumn, "findMeaningfulCategoryColumn");
function hasBalancedDistribution(categoryCol, sampleRows) {
  return calculateCategoryBalance(categoryCol, sampleRows) > 0.5;
}
__name(hasBalancedDistribution, "hasBalancedDistribution");
async function generateOptimalChart(recommendation, schema, sampleRows, analysis) {
  try {
    switch (recommendation.type) {
      case "timeseries":
        return {
          title: recommendation.title,
          description: recommendation.description,
          chartSpec: generateAdvancedTimeSeriesChart(recommendation.columns[0], recommendation.columns[1], sampleRows),
          priority: recommendation.priority
        };
      case "comparison":
        return {
          title: recommendation.title,
          description: recommendation.description,
          chartSpec: generateAdvancedComparisonChart(recommendation.columns[0], recommendation.columns[1], sampleRows),
          priority: recommendation.priority
        };
      case "distribution":
        return {
          title: recommendation.title,
          description: recommendation.description,
          chartSpec: generateAdvancedDistributionChart(recommendation.columns[0], sampleRows),
          priority: recommendation.priority
        };
      case "correlation":
        return {
          title: recommendation.title,
          description: recommendation.description,
          chartSpec: generateAdvancedCorrelationChart(recommendation.columns[0], recommendation.columns[1], sampleRows),
          priority: recommendation.priority
        };
      case "composition":
        return {
          title: recommendation.title,
          description: recommendation.description,
          chartSpec: generateAdvancedCompositionChart(recommendation.columns[0], sampleRows),
          priority: recommendation.priority
        };
      default:
        return null;
    }
  } catch (error) {
    console.error(`Failed to generate ${recommendation.type} chart:`, error);
    return null;
  }
}
__name(generateOptimalChart, "generateOptimalChart");
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
function generateAdvancedTimeSeriesChart(dateCol, numericCol, sampleRows) {
  const sortedData = sampleRows.filter((row) => row[dateCol.name] && row[numericCol.name] != null).sort((a, b) => new Date(a[dateCol.name]).getTime() - new Date(b[dateCol.name]).getTime());
  const dates = sortedData.map((row) => row[dateCol.name]);
  const values = sortedData.map((row) => Number(row[numericCol.name]));
  const trendLine = calculateTrendLine(dates, values);
  return {
    data: [
      {
        x: dates,
        y: values,
        type: "scatter",
        mode: "lines+markers",
        line: {
          color: "#667eea",
          width: 3,
          shape: "spline"
        },
        marker: {
          color: "#764ba2",
          size: 8,
          symbol: "circle"
        },
        name: numericCol.name,
        hovertemplate: `<b>${dateCol.name}</b>: %{x}<br><b>${numericCol.name}</b>: %{y:,.0f}<extra></extra>`
      },
      {
        x: dates,
        y: trendLine,
        type: "scatter",
        mode: "lines",
        line: {
          color: "#ff7b7b",
          width: 2,
          dash: "dot"
        },
        name: "Trend",
        hovertemplate: `<b>Trend</b>: %{y:,.0f}<extra></extra>`
      }
    ],
    layout: {
      title: {
        text: `${numericCol.name} Trends Over Time`,
        font: { size: 18, color: "#2d3748", weight: 600 }
      },
      xaxis: {
        title: { text: dateCol.name, font: { size: 14, color: "#4a5568" } },
        showgrid: true,
        gridcolor: "#e2e8f0"
      },
      yaxis: {
        title: { text: numericCol.name, font: { size: 14, color: "#4a5568" } },
        showgrid: true,
        gridcolor: "#e2e8f0"
      },
      plot_bgcolor: "rgba(0,0,0,0)",
      paper_bgcolor: "rgba(0,0,0,0)",
      margin: { t: 60, b: 60, l: 80, r: 40 },
      hovermode: "x unified",
      legend: {
        orientation: "h",
        yanchor: "bottom",
        y: 1.02,
        xanchor: "right",
        x: 1
      }
    }
  };
}
__name(generateAdvancedTimeSeriesChart, "generateAdvancedTimeSeriesChart");
function generateAdvancedComparisonChart(categoryCol, numericCol, sampleRows) {
  const groupedData = sampleRows.reduce((acc, row) => {
    const category = row[categoryCol.name];
    const value = Number(row[numericCol.name]);
    if (category && !isNaN(value)) {
      if (!acc[category]) acc[category] = [];
      acc[category].push(value);
    }
    return acc;
  }, {});
  const chartData = Object.entries(groupedData).map(([category, values]) => ({
    category,
    mean: values.reduce((a, b) => a + b, 0) / values.length,
    count: values.length,
    values
  })).sort((a, b) => b.mean - a.mean).slice(0, 10);
  return {
    data: [{
      x: chartData.map((d) => d.category),
      y: chartData.map((d) => d.mean),
      type: "bar",
      marker: {
        color: chartData.map((_, i) => `hsl(${220 + i * 25}, 70%, ${60 + i % 3 * 10}%)`),
        opacity: 0.8,
        line: { color: "#2d3748", width: 1 }
      },
      text: chartData.map((d) => `${d.mean.toLocaleString()}`),
      textposition: "outside",
      hovertemplate: `<b>%{x}</b><br>${numericCol.name}: %{y:,.0f}<br>Sample Count: %{customdata}<extra></extra>`,
      customdata: chartData.map((d) => d.count)
    }],
    layout: {
      title: {
        text: `${numericCol.name} Performance by ${categoryCol.name}`,
        font: { size: 18, color: "#2d3748", weight: 600 }
      },
      xaxis: {
        title: { text: categoryCol.name, font: { size: 14, color: "#4a5568" } },
        tickangle: -45
      },
      yaxis: {
        title: { text: `Average ${numericCol.name}`, font: { size: 14, color: "#4a5568" } },
        showgrid: true,
        gridcolor: "#e2e8f0"
      },
      plot_bgcolor: "rgba(0,0,0,0)",
      paper_bgcolor: "rgba(0,0,0,0)",
      margin: { t: 60, b: 100, l: 80, r: 40 },
      showlegend: false
    }
  };
}
__name(generateAdvancedComparisonChart, "generateAdvancedComparisonChart");
function generateAdvancedDistributionChart(numericCol, sampleRows) {
  const values = sampleRows.map((row) => Number(row[numericCol.name])).filter((val) => !isNaN(val));
  if (values.length === 0) return createFallbackChart([], []);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const median = sorted[Math.floor(sorted.length * 0.5)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  return {
    data: [
      {
        x: values,
        type: "histogram",
        nbinsx: Math.min(30, Math.max(10, Math.floor(Math.sqrt(values.length)))),
        marker: {
          color: "#667eea",
          opacity: 0.7,
          line: { color: "#2d3748", width: 1 }
        },
        name: "Distribution",
        hovertemplate: `Range: %{x}<br>Count: %{y}<extra></extra>`
      }
    ],
    layout: {
      title: {
        text: `${numericCol.name} Distribution Analysis`,
        font: { size: 18, color: "#2d3748", weight: 600 }
      },
      xaxis: {
        title: { text: numericCol.name, font: { size: 14, color: "#4a5568" } },
        showgrid: true,
        gridcolor: "#e2e8f0"
      },
      yaxis: {
        title: { text: "Frequency", font: { size: 14, color: "#4a5568" } },
        showgrid: true,
        gridcolor: "#e2e8f0"
      },
      plot_bgcolor: "rgba(0,0,0,0)",
      paper_bgcolor: "rgba(0,0,0,0)",
      margin: { t: 60, b: 60, l: 60, r: 40 },
      shapes: [
        // Mean line
        {
          type: "line",
          x0: mean,
          y0: 0,
          x1: mean,
          y1: 1,
          yref: "paper",
          line: { color: "#e53e3e", width: 2, dash: "dash" }
        },
        // Median line
        {
          type: "line",
          x0: median,
          y0: 0,
          x1: median,
          y1: 1,
          yref: "paper",
          line: { color: "#38a169", width: 2, dash: "dot" }
        }
      ],
      annotations: [
        {
          x: mean,
          y: 0.9,
          yref: "paper",
          text: `Mean: ${mean.toFixed(1)}`,
          showarrow: true,
          arrowhead: 2,
          arrowcolor: "#e53e3e",
          font: { color: "#e53e3e", size: 12 }
        },
        {
          x: median,
          y: 0.8,
          yref: "paper",
          text: `Median: ${median.toFixed(1)}`,
          showarrow: true,
          arrowhead: 2,
          arrowcolor: "#38a169",
          font: { color: "#38a169", size: 12 }
        }
      ]
    }
  };
}
__name(generateAdvancedDistributionChart, "generateAdvancedDistributionChart");
function generateAdvancedCorrelationChart(col1, col2, sampleRows) {
  const data = sampleRows.filter((row) => row[col1.name] != null && row[col2.name] != null).map((row) => ({
    x: Number(row[col1.name]),
    y: Number(row[col2.name])
  })).filter((point) => !isNaN(point.x) && !isNaN(point.y));
  if (data.length === 0) return createFallbackChart([], []);
  const correlation = calculateCorrelation(
    data.map((d) => d.x),
    data.map((d) => d.y)
  );
  const xValues = data.map((d) => d.x);
  const yValues = data.map((d) => d.y);
  const trendLine = calculateLinearTrendLine(xValues, yValues);
  return {
    data: [
      {
        x: data.map((d) => d.x),
        y: data.map((d) => d.y),
        type: "scatter",
        mode: "markers",
        marker: {
          color: "#667eea",
          size: 10,
          opacity: 0.7,
          line: { color: "#2d3748", width: 1 }
        },
        name: "Data Points",
        hovertemplate: `<b>${col1.name}</b>: %{x:,.1f}<br><b>${col2.name}</b>: %{y:,.1f}<extra></extra>`
      },
      {
        x: [Math.min(...xValues), Math.max(...xValues)],
        y: trendLine,
        type: "scatter",
        mode: "lines",
        line: { color: "#e53e3e", width: 3 },
        name: `Trend (r=${correlation.toFixed(3)})`,
        hovertemplate: `<b>Correlation</b>: ${correlation.toFixed(3)}<extra></extra>`
      }
    ],
    layout: {
      title: {
        text: `${col1.name} vs ${col2.name} Relationship`,
        font: { size: 18, color: "#2d3748", weight: 600 }
      },
      xaxis: {
        title: { text: col1.name, font: { size: 14, color: "#4a5568" } },
        showgrid: true,
        gridcolor: "#e2e8f0"
      },
      yaxis: {
        title: { text: col2.name, font: { size: 14, color: "#4a5568" } },
        showgrid: true,
        gridcolor: "#e2e8f0"
      },
      plot_bgcolor: "rgba(0,0,0,0)",
      paper_bgcolor: "rgba(0,0,0,0)",
      margin: { t: 80, b: 60, l: 80, r: 40 },
      annotations: [{
        x: 0.02,
        y: 0.98,
        xref: "paper",
        yref: "paper",
        text: `Correlation: ${correlation.toFixed(3)}<br>Strength: ${getCorrelationStrength(correlation)}`,
        showarrow: false,
        bgcolor: "rgba(255,255,255,0.8)",
        bordercolor: "#e2e8f0",
        borderwidth: 1,
        font: { size: 12, color: "#2d3748" }
      }]
    }
  };
}
__name(generateAdvancedCorrelationChart, "generateAdvancedCorrelationChart");
function generateAdvancedCompositionChart(categoryCol, sampleRows) {
  const counts = sampleRows.reduce((acc, row) => {
    const value = row[categoryCol.name];
    if (value != null) {
      acc[value] = (acc[value] || 0) + 1;
    }
    return acc;
  }, {});
  const sortedCounts = Object.entries(counts).sort(([, a], [, b]) => b - a).slice(0, 8);
  const total = sortedCounts.reduce((sum, [, count]) => sum + count, 0);
  const colors = [
    "#667eea",
    "#764ba2",
    "#f093fb",
    "#f5576c",
    "#4facfe",
    "#00f2fe",
    "#43e97b",
    "#38f9d7"
  ];
  return {
    data: [{
      labels: sortedCounts.map(([label]) => label),
      values: sortedCounts.map(([, value]) => value),
      type: "pie",
      marker: {
        colors: colors.slice(0, sortedCounts.length),
        line: { color: "#ffffff", width: 2 }
      },
      textinfo: "label+percent+value",
      textposition: "auto",
      textfont: { size: 12, color: "#2d3748" },
      hovertemplate: `<b>%{label}</b><br>Count: %{value}<br>Percentage: %{percent}<extra></extra>`,
      pull: sortedCounts.map((_, i) => i === 0 ? 0.1 : 0)
      // Highlight largest segment
    }],
    layout: {
      title: {
        text: `${categoryCol.name} Distribution`,
        font: { size: 18, color: "#2d3748", weight: 600 }
      },
      plot_bgcolor: "rgba(0,0,0,0)",
      paper_bgcolor: "rgba(0,0,0,0)",
      margin: { t: 60, b: 60, l: 60, r: 60 },
      showlegend: true,
      legend: {
        orientation: "v",
        yanchor: "middle",
        y: 0.5,
        x: 1.05
      },
      annotations: [{
        text: `Total: ${total}`,
        x: 0.5,
        y: 0.5,
        xref: "paper",
        yref: "paper",
        showarrow: false,
        font: { size: 16, color: "#2d3748", weight: 600 }
      }]
    }
  };
}
__name(generateAdvancedCompositionChart, "generateAdvancedCompositionChart");
function calculateTrendLine(dates, values) {
  const n = dates.length;
  if (n < 2) return values;
  const timeValues = dates.map((date) => new Date(date).getTime());
  const meanTime = timeValues.reduce((a, b) => a + b, 0) / n;
  const meanValue = values.reduce((a, b) => a + b, 0) / n;
  const numerator = timeValues.reduce((acc, time, i) => acc + (time - meanTime) * (values[i] - meanValue), 0);
  const denominator = timeValues.reduce((acc, time) => acc + Math.pow(time - meanTime, 2), 0);
  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = meanValue - slope * meanTime;
  return timeValues.map((time) => slope * time + intercept);
}
__name(calculateTrendLine, "calculateTrendLine");
function calculateLinearTrendLine(xValues, yValues) {
  const n = xValues.length;
  if (n < 2) return yValues;
  const meanX = xValues.reduce((a, b) => a + b, 0) / n;
  const meanY = yValues.reduce((a, b) => a + b, 0) / n;
  const numerator = xValues.reduce((acc, x, i) => acc + (x - meanX) * (yValues[i] - meanY), 0);
  const denominator = xValues.reduce((acc, x) => acc + Math.pow(x - meanX, 2), 0);
  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = meanY - slope * meanX;
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  return [slope * minX + intercept, slope * maxX + intercept];
}
__name(calculateLinearTrendLine, "calculateLinearTrendLine");
function getCorrelationStrength(correlation) {
  const abs = Math.abs(correlation);
  if (abs >= 0.9) return "Very Strong";
  if (abs >= 0.7) return "Strong";
  if (abs >= 0.5) return "Moderate";
  if (abs >= 0.3) return "Weak";
  return "Very Weak";
}
__name(getCorrelationStrength, "getCorrelationStrength");
async function analyzeWithDuckDB(jsonData, env) {
  console.log("\u{1F4CA} Starting enhanced statistical analysis...");
  const start = Date.now();
  try {
    const schema = inferSchema(jsonData);
    const rowCount = jsonData.length;
    const columnCount = schema.length;
    const summary = schema.map((col) => {
      const values = jsonData.map((row) => row[col.name]).filter((v) => v != null);
      const nonNullCount = values.length;
      const nullCount = rowCount - nonNullCount;
      let stats = {
        column_name: col.name,
        column_type: col.type,
        count: nonNullCount,
        nulls: nullCount,
        unique: [...new Set(values)].length
      };
      if (col.type === "number") {
        const numValues = values.map((v) => Number(v)).filter((v) => !isNaN(v));
        if (numValues.length > 0) {
          const sorted = [...numValues].sort((a, b) => a - b);
          const mean = numValues.reduce((a, b) => a + b, 0) / numValues.length;
          const variance = numValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numValues.length;
          stats.min = Math.min(...numValues);
          stats.max = Math.max(...numValues);
          stats.mean = mean;
          stats.std = Math.sqrt(variance);
          stats.q25 = sorted[Math.floor(sorted.length * 0.25)];
          stats.q50 = sorted[Math.floor(sorted.length * 0.5)];
          stats.q75 = sorted[Math.floor(sorted.length * 0.75)];
        }
      } else if (col.type === "string") {
        const frequencies = values.reduce((acc, val) => {
          acc[val] = (acc[val] || 0) + 1;
          return acc;
        }, {});
        const topCategories = Object.entries(frequencies).sort(([, a], [, b]) => b - a).slice(0, 10);
        stats.top_categories = topCategories;
        stats.category_count = Object.keys(frequencies).length;
      }
      return stats;
    });
    const numericColumns = schema.filter((col) => col.type === "number");
    const correlations = {};
    for (let i = 0; i < numericColumns.length; i++) {
      for (let j = i + 1; j < numericColumns.length; j++) {
        const col1 = numericColumns[i];
        const col2 = numericColumns[j];
        const values1 = jsonData.map((row) => Number(row[col1.name])).filter((v) => !isNaN(v));
        const values2 = jsonData.map((row) => Number(row[col2.name])).filter((v) => !isNaN(v));
        const correlation = calculateCorrelation(values1, values2);
        if (Math.abs(correlation) > 0.1) {
          correlations[`${col1.name}_${col2.name}`] = correlation;
        }
      }
    }
    const patterns = {
      strongCorrelations: Object.entries(correlations).filter(([, corr]) => Math.abs(corr) > 0.7),
      highVariability: numericColumns.map((col) => ({
        column: col.name,
        cv: (col.stats?.stdDev || 0) / (col.stats?.mean || 1)
      })).filter((item) => item.cv > 0.5).sort((a, b) => b.cv - a.cv).slice(0, 5),
      categoricalDominance: schema.filter((col) => col.type === "string").map((col) => {
        const values = jsonData.map((row) => row[col.name]).filter((v) => v != null);
        const frequencies = values.reduce((acc, val) => {
          acc[val] = (acc[val] || 0) + 1;
          return acc;
        }, {});
        const maxFreq = Math.max(...Object.values(frequencies));
        return {
          column: col.name,
          dominance: maxFreq / values.length,
          topValue: Object.entries(frequencies).find(([, freq]) => freq === maxFreq)?.[0]
        };
      }).filter((item) => item.dominance > 0.7).sort((a, b) => b.dominance - a.dominance)
    };
    const duration = Date.now() - start;
    console.log(`\u2705 Enhanced statistical analysis completed in ${duration}ms`);
    console.log(`\u{1F4CA} Processed ${rowCount} rows, ${columnCount} columns`);
    console.log(`\u{1F50D} Found ${Object.keys(correlations).length} correlations, ${patterns.highVariability.length} high-variability columns`);
    return {
      summary,
      rowCount,
      columnCount,
      dataTypes: schema.reduce((acc, col) => {
        acc[col.name] = col.type;
        return acc;
      }, {}),
      correlations,
      patterns,
      processingTime: duration
    };
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`\u274C Enhanced analysis failed after ${duration}ms:`, error);
    return {
      summary: [],
      rowCount: jsonData.length,
      columnCount: 0,
      dataTypes: {},
      error: error.message
    };
  }
}
__name(analyzeWithDuckDB, "analyzeWithDuckDB");
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

// src/agents.ts
var NVIDIA_MODEL = "nvidia/llama-3.1-nemotron-ultra-253b-v1";
function createNvidiaClient(apiKey) {
  return {
    chat: {
      completions: {
        create: /* @__PURE__ */ __name(async (params) => {
          const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: params.model,
              messages: params.messages,
              temperature: params.temperature || 0.2,
              max_tokens: params.max_tokens || 1024,
              stream: params.stream || false
            })
          });
          if (!response.ok) {
            throw new Error(`NVIDIA API error: ${response.status} ${response.statusText}`);
          }
          return await response.json();
        }, "create")
      }
    }
  };
}
__name(createNvidiaClient, "createNvidiaClient");
async function QueryUnderstandingTool(query, client) {
  try {
    const messages = [
      {
        role: "system",
        content: "detailed thinking off. You are an assistant that determines if a query is requesting a data visualization. Respond with only 'true' if the query is asking for a plot, chart, graph, or any visual representation of data. Otherwise, respond with 'false'."
      },
      {
        role: "user",
        content: query
      }
    ];
    const response = await client.chat.completions.create({
      model: NVIDIA_MODEL,
      messages,
      temperature: 0.1,
      max_tokens: 5
    });
    const intent_response = response.choices[0].message.content.strip().toLowerCase();
    return intent_response === "true";
  } catch (error) {
    console.error("QueryUnderstandingTool error:", error);
    return true;
  }
}
__name(QueryUnderstandingTool, "QueryUnderstandingTool");
function PlotCodeGeneratorTool(cols, query) {
  return `Given DataFrame \`df\` with columns: ${cols.join(", ")}
Write Python code using pandas **and matplotlib** (as plt) to answer:
"${query}"

Rules
-----
1. Use pandas for data manipulation and matplotlib.pyplot (as plt) for plotting.
2. Assign the final result (DataFrame, Series, scalar *or* matplotlib Figure) to a variable named \`result\`.
3. Create only ONE relevant plot. Set \`figsize=(6,4)\`, add title/labels.
4. Return your answer inside a single markdown fence that starts with \`\`\`python and ends with \`\`\`.`;
}
__name(PlotCodeGeneratorTool, "PlotCodeGeneratorTool");
function CodeWritingTool(cols, query) {
  return `Given DataFrame \`df\` with columns: ${cols.join(", ")}
Write Python code (pandas **only**, no plotting) to answer:
"${query}"

Rules
-----
1. Use pandas operations on \`df\` only.
2. Assign the final result to \`result\`.
3. Wrap the snippet in a single \`\`\`python code fence (no extra prose).`;
}
__name(CodeWritingTool, "CodeWritingTool");
async function CodeGenerationAgent(query, schema, client) {
  try {
    const shouldPlot = await QueryUnderstandingTool(query, client);
    const cols = schema.map((col) => col.name);
    const prompt = shouldPlot ? PlotCodeGeneratorTool(cols, query) : CodeWritingTool(cols, query);
    const messages = [
      {
        role: "system",
        content: "detailed thinking off. You are a Python data-analysis expert who writes clean, efficient code. Solve the given problem with optimal pandas operations. Be concise and focused. Your response must contain ONLY a properly-closed ```python code block with no explanations before or after. Ensure your solution is correct, handles edge cases, and follows best practices for data analysis."
      },
      {
        role: "user",
        content: prompt
      }
    ];
    const response = await client.chat.completions.create({
      model: NVIDIA_MODEL,
      messages,
      temperature: 0.2,
      max_tokens: 1024
    });
    const fullResponse = response.choices[0].message.content;
    const code = extractFirstCodeBlock(fullResponse);
    return {
      code,
      shouldPlot,
      error: code ? void 0 : "Failed to extract code from response"
    };
  } catch (error) {
    console.error("CodeGenerationAgent error:", error);
    return {
      code: "",
      shouldPlot: false,
      error: error.message
    };
  }
}
__name(CodeGenerationAgent, "CodeGenerationAgent");
function ExecutionAgent(code, data, shouldPlot) {
  try {
    console.log("Executing code:", code);
    console.log("Data rows:", data.length);
    console.log("Should plot:", shouldPlot);
    if (shouldPlot && code.includes("plt.")) {
      const plotlySpec = convertMatplotlibToPlotly(code, data);
      if (plotlySpec) {
        return {
          result: {
            type: "plot",
            chartSpec: plotlySpec,
            description: "Interactive visualization generated from Python code",
            code,
            dataPoints: data.length
          }
        };
      } else {
        const fallbackChart = generateIntelligentFallbackChart(code, data);
        return {
          result: {
            type: "plot",
            chartSpec: fallbackChart,
            description: "Generated visualization based on code analysis",
            code,
            dataPoints: data.length
          }
        };
      }
    } else {
      const dataResult = executeDataOperations(code, data);
      return {
        result: {
          type: "data",
          value: dataResult,
          description: "Data analysis result",
          code,
          dataPoints: data.length
        }
      };
    }
  } catch (error) {
    return {
      result: null,
      error: `Error executing code: ${error.message}`
    };
  }
}
__name(ExecutionAgent, "ExecutionAgent");
function convertMatplotlibToPlotly(code, data) {
  try {
    const codeAnalysis = analyzePythonCode(code);
    if (codeAnalysis.chartType === "bar") {
      return generateBarChartFromCode(codeAnalysis, data);
    } else if (codeAnalysis.chartType === "line" || codeAnalysis.chartType === "plot") {
      return generateLineChartFromCode(codeAnalysis, data);
    } else if (codeAnalysis.chartType === "scatter") {
      return generateScatterChartFromCode(codeAnalysis, data);
    } else if (codeAnalysis.chartType === "hist" || codeAnalysis.chartType === "histogram") {
      return generateHistogramFromCode(codeAnalysis, data);
    } else if (codeAnalysis.chartType === "pie") {
      return generatePieChartFromCode(codeAnalysis, data);
    } else if (codeAnalysis.chartType === "dual_axis") {
      return generateDualAxisChartFromCode(codeAnalysis, data);
    }
    return null;
  } catch (error) {
    console.error("Error converting matplotlib to Plotly:", error);
    return null;
  }
}
__name(convertMatplotlibToPlotly, "convertMatplotlibToPlotly");
function analyzePythonCode(code) {
  const analysis = {
    chartType: "unknown",
    columns: [],
    operations: [],
    title: "",
    xlabel: "",
    ylabel: "",
    groupBy: null,
    aggregation: null
  };
  if (code.includes(".plot(kind='bar')") || code.includes(".plot.bar(") || code.includes("plt.bar(") || code.includes(".value_counts().plot(kind='bar')")) {
    analysis.chartType = "bar";
  } else if (code.includes(".plot(kind='line')") || code.includes(".plot(") || code.includes("plt.plot(") || code.includes("mode='lines")) {
    analysis.chartType = "line";
  } else if (code.includes("plt.scatter(") || code.includes("kind='scatter'") || code.includes("mode='markers'")) {
    analysis.chartType = "scatter";
  } else if (code.includes("plt.hist(") || code.includes("kind='hist'") || code.includes(".hist(")) {
    analysis.chartType = "hist";
  } else if (code.includes("plt.pie(") || code.includes("kind='pie'")) {
    analysis.chartType = "pie";
  } else if (code.includes("ax2") || code.includes("twinx()")) {
    analysis.chartType = "dual_axis";
  }
  const titleMatches = [
    code.match(/title=['"]([^'"]+)['"]/),
    code.match(/plt\.title\(['"]([^'"]+)['"]\)/),
    code.match(/\.set_title\(['"]([^'"]+)['"]\)/)
  ];
  const titleMatch = titleMatches.find((match) => match !== null);
  if (titleMatch) analysis.title = titleMatch[1];
  const xlabelMatches = [
    code.match(/xlabel=['"]([^'"]+)['"]/),
    code.match(/plt\.xlabel\(['"]([^'"]+)['"]\)/),
    code.match(/\.set_xlabel\(['"]([^'"]+)['"]\)/)
  ];
  const xlabelMatch = xlabelMatches.find((match) => match !== null);
  if (xlabelMatch) analysis.xlabel = xlabelMatch[1];
  const ylabelMatches = [
    code.match(/ylabel=['"]([^'"]+)['"]/),
    code.match(/plt\.ylabel\(['"]([^'"]+)['"]\)/),
    code.match(/\.set_ylabel\(['"]([^'"]+)['"]\)/)
  ];
  const ylabelMatch = ylabelMatches.find((match) => match !== null);
  if (ylabelMatch) analysis.ylabel = ylabelMatch[1];
  const columnMatches = code.match(/df\[['"]([^'"]+)['"]\]/g);
  if (columnMatches) {
    analysis.columns = [...new Set(columnMatches.map((match) => match.match(/['"]([^'"]+)['"]/)[1]))];
  }
  const functionColumnMatches = code.match(/(?:plt\.\w+|\.plot)\([^)]*df\[['"]([^'"]+)['"]\][^)]*(?:,\s*df\[['"]([^'"]+)['"]\])?/);
  if (functionColumnMatches) {
    if (functionColumnMatches[1]) analysis.columns.push(functionColumnMatches[1]);
    if (functionColumnMatches[2]) analysis.columns.push(functionColumnMatches[2]);
  }
  analysis.columns = [...new Set(analysis.columns)];
  const groupByMatch = code.match(/\.groupby\(['"]([^'"]+)['"]\)/);
  if (groupByMatch) analysis.groupBy = groupByMatch[1];
  if (code.includes(".mean()")) analysis.aggregation = "mean";
  else if (code.includes(".sum()")) analysis.aggregation = "sum";
  else if (code.includes(".count()")) analysis.aggregation = "count";
  else if (code.includes(".value_counts()")) analysis.aggregation = "value_counts";
  else if (code.includes(".median()")) analysis.aggregation = "median";
  else if (code.includes(".std()")) analysis.aggregation = "std";
  console.log("\u{1F4CA} Code analysis result:", analysis);
  return analysis;
}
__name(analyzePythonCode, "analyzePythonCode");
function generateBarChartFromCode(analysis, data) {
  try {
    let chartData;
    if (analysis.groupBy && analysis.aggregation && analysis.columns.length >= 1) {
      const groups = data.reduce((acc, row) => {
        const key = row[analysis.groupBy];
        if (!acc[key]) acc[key] = [];
        acc[key].push(row);
        return acc;
      }, {});
      const xValues = Object.keys(groups);
      const yValues = xValues.map((key) => {
        const groupData = groups[key];
        const values = groupData.map((row) => Number(row[analysis.columns[0]])).filter((v) => !isNaN(v));
        if (analysis.aggregation === "mean") return values.reduce((a, b) => a + b, 0) / values.length;
        if (analysis.aggregation === "sum") return values.reduce((a, b) => a + b, 0);
        return values.length;
      });
      chartData = [{
        x: xValues,
        y: yValues,
        type: "bar",
        marker: {
          color: "#667eea",
          line: { color: "#2d3748", width: 1 }
        },
        text: yValues.map((v) => v.toLocaleString()),
        textposition: "outside"
      }];
    } else if (analysis.columns.length >= 2) {
      chartData = [{
        x: data.map((row) => row[analysis.columns[0]]),
        y: data.map((row) => Number(row[analysis.columns[1]])),
        type: "bar",
        marker: {
          color: "#667eea",
          line: { color: "#2d3748", width: 1 }
        }
      }];
    } else {
      return null;
    }
    return {
      data: chartData,
      layout: {
        title: { text: analysis.title || "Bar Chart", font: { size: 16, color: "#2d3748" } },
        xaxis: { title: analysis.xlabel || analysis.groupBy || analysis.columns[0] },
        yaxis: { title: analysis.ylabel || analysis.columns[1] || "Values" },
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        margin: { t: 60, b: 60, l: 60, r: 40 }
      }
    };
  } catch (error) {
    console.error("Error generating bar chart:", error);
    return null;
  }
}
__name(generateBarChartFromCode, "generateBarChartFromCode");
function generateLineChartFromCode(analysis, data) {
  try {
    if (analysis.columns.length < 2) return null;
    const chartData = [{
      x: data.map((row) => row[analysis.columns[0]]),
      y: data.map((row) => Number(row[analysis.columns[1]])),
      type: "scatter",
      mode: "lines+markers",
      line: { color: "#667eea", width: 3 },
      marker: { color: "#764ba2", size: 6 }
    }];
    return {
      data: chartData,
      layout: {
        title: { text: analysis.title || "Line Chart", font: { size: 16, color: "#2d3748" } },
        xaxis: { title: analysis.xlabel || analysis.columns[0] },
        yaxis: { title: analysis.ylabel || analysis.columns[1] },
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        margin: { t: 60, b: 60, l: 60, r: 40 }
      }
    };
  } catch (error) {
    console.error("Error generating line chart:", error);
    return null;
  }
}
__name(generateLineChartFromCode, "generateLineChartFromCode");
function generateScatterChartFromCode(analysis, data) {
  try {
    if (analysis.columns.length < 2) return null;
    const chartData = [{
      x: data.map((row) => Number(row[analysis.columns[0]])),
      y: data.map((row) => Number(row[analysis.columns[1]])),
      type: "scatter",
      mode: "markers",
      marker: {
        color: "#667eea",
        size: 8,
        line: { color: "#2d3748", width: 1 }
      }
    }];
    return {
      data: chartData,
      layout: {
        title: { text: analysis.title || "Scatter Plot", font: { size: 16, color: "#2d3748" } },
        xaxis: { title: analysis.xlabel || analysis.columns[0] },
        yaxis: { title: analysis.ylabel || analysis.columns[1] },
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        margin: { t: 60, b: 60, l: 60, r: 40 }
      }
    };
  } catch (error) {
    console.error("Error generating scatter chart:", error);
    return null;
  }
}
__name(generateScatterChartFromCode, "generateScatterChartFromCode");
function generateHistogramFromCode(analysis, data) {
  try {
    if (analysis.columns.length < 1) return null;
    const values = data.map((row) => Number(row[analysis.columns[0]])).filter((v) => !isNaN(v));
    const chartData = [{
      x: values,
      type: "histogram",
      nbinsx: Math.min(30, Math.max(10, Math.floor(Math.sqrt(values.length)))),
      marker: {
        color: "#667eea",
        opacity: 0.7,
        line: { color: "#2d3748", width: 1 }
      }
    }];
    return {
      data: chartData,
      layout: {
        title: { text: analysis.title || "Distribution", font: { size: 16, color: "#2d3748" } },
        xaxis: { title: analysis.xlabel || analysis.columns[0] },
        yaxis: { title: "Frequency" },
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        margin: { t: 60, b: 60, l: 60, r: 40 }
      }
    };
  } catch (error) {
    console.error("Error generating histogram:", error);
    return null;
  }
}
__name(generateHistogramFromCode, "generateHistogramFromCode");
function generatePieChartFromCode(analysis, data) {
  try {
    if (analysis.columns.length < 1) return null;
    const counts = data.reduce((acc, row) => {
      const value = row[analysis.columns[0]];
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
    const labels = Object.keys(counts);
    const values = Object.values(counts);
    const chartData = [{
      labels,
      values,
      type: "pie",
      marker: {
        colors: ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe", "#00f2fe"],
        line: { color: "#ffffff", width: 2 }
      },
      textinfo: "label+percent",
      textposition: "auto"
    }];
    return {
      data: chartData,
      layout: {
        title: { text: analysis.title || "Distribution", font: { size: 16, color: "#2d3748" } },
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        margin: { t: 60, b: 60, l: 60, r: 60 }
      }
    };
  } catch (error) {
    console.error("Error generating pie chart:", error);
    return null;
  }
}
__name(generatePieChartFromCode, "generatePieChartFromCode");
function generateDualAxisChartFromCode(analysis, data) {
  try {
    if (analysis.columns.length < 3) return null;
    const chartData = [
      {
        x: data.map((row) => row[analysis.columns[0]]),
        y: data.map((row) => Number(row[analysis.columns[1]])),
        type: "scatter",
        mode: "lines+markers",
        name: analysis.columns[1],
        line: { color: "#667eea", width: 3 },
        yaxis: "y"
      },
      {
        x: data.map((row) => row[analysis.columns[0]]),
        y: data.map((row) => Number(row[analysis.columns[2]])),
        type: "scatter",
        mode: "lines+markers",
        name: analysis.columns[2],
        line: { color: "#f093fb", width: 3 },
        yaxis: "y2"
      }
    ];
    return {
      data: chartData,
      layout: {
        title: { text: analysis.title || "Dual Axis Chart", font: { size: 16, color: "#2d3748" } },
        xaxis: { title: analysis.xlabel || analysis.columns[0] },
        yaxis: {
          title: analysis.columns[1],
          side: "left",
          color: "#667eea"
        },
        yaxis2: {
          title: analysis.columns[2],
          side: "right",
          overlaying: "y",
          color: "#f093fb"
        },
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        margin: { t: 60, b: 60, l: 60, r: 60 }
      }
    };
  } catch (error) {
    console.error("Error generating dual axis chart:", error);
    return null;
  }
}
__name(generateDualAxisChartFromCode, "generateDualAxisChartFromCode");
function generateIntelligentFallbackChart(code, data) {
  if (data.length === 0) {
    return {
      data: [{ x: ["No Data"], y: [0], type: "bar" }],
      layout: { title: "No Data Available" }
    };
  }
  const keys = Object.keys(data[0]);
  const numericColumns = keys.filter(
    (key) => !isNaN(Number(data[0][key])) && data[0][key] !== null && data[0][key] !== ""
  );
  const stringColumns = keys.filter(
    (key) => isNaN(Number(data[0][key])) || data[0][key] === null || data[0][key] === ""
  );
  if (numericColumns.length >= 2) {
    return {
      data: [{
        x: data.map((row) => Number(row[numericColumns[0]])),
        y: data.map((row) => Number(row[numericColumns[1]])),
        type: "scatter",
        mode: "markers",
        marker: { color: "#667eea", size: 8 }
      }],
      layout: {
        title: `${numericColumns[1]} vs ${numericColumns[0]}`,
        xaxis: { title: numericColumns[0] },
        yaxis: { title: numericColumns[1] },
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        margin: { t: 60, b: 60, l: 60, r: 40 }
      }
    };
  } else if (numericColumns.length >= 1 && stringColumns.length >= 1) {
    return {
      data: [{
        x: data.map((row) => row[stringColumns[0]]),
        y: data.map((row) => Number(row[numericColumns[0]])),
        type: "bar",
        marker: { color: "#667eea" }
      }],
      layout: {
        title: `${numericColumns[0]} by ${stringColumns[0]}`,
        xaxis: { title: stringColumns[0] },
        yaxis: { title: numericColumns[0] },
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        margin: { t: 60, b: 60, l: 60, r: 40 }
      }
    };
  }
  return {
    data: [{ x: keys, y: keys.map(() => 1), type: "bar" }],
    layout: { title: "Data Overview" }
  };
}
__name(generateIntelligentFallbackChart, "generateIntelligentFallbackChart");
function executeDataOperations(code, data) {
  if (code.includes(".describe()")) {
    const numericColumns = Object.keys(data[0]).filter(
      (key) => !isNaN(Number(data[0][key]))
    );
    const stats = {};
    numericColumns.forEach((col) => {
      const values = data.map((row) => Number(row[col])).filter((v) => !isNaN(v));
      if (values.length > 0) {
        stats[col] = {
          count: values.length,
          mean: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values)
        };
      }
    });
    return { type: "statistics", data: stats };
  } else if (code.includes(".head()")) {
    return { type: "preview", data: data.slice(0, 5) };
  } else if (code.includes(".shape")) {
    return { type: "shape", data: [data.length, Object.keys(data[0]).length] };
  } else if (code.includes(".info()")) {
    return {
      type: "info",
      data: {
        rows: data.length,
        columns: Object.keys(data[0]).length,
        columns_list: Object.keys(data[0])
      }
    };
  }
  return { type: "result", data: "Analysis complete" };
}
__name(executeDataOperations, "executeDataOperations");
function ReasoningCurator(query, result) {
  const isError = result?.error;
  const isPlot = result?.type === "plot";
  if (isError) {
    return `The user asked: "${query}".
There was an error: ${result.error}
Explain what went wrong and suggest alternatives.`;
  } else if (isPlot) {
    return `The user asked: "${query}".
Below is a description of the plot result:
${result.description || "Chart created"}
Explain in 2\u20133 concise sentences what the chart shows (no code talk).`;
  } else {
    return `The user asked: "${query}".
The result value is: ${result?.value || result?.description || "Analysis complete"}
Explain in 2\u20133 concise sentences what this tells about the data (no mention of charts).`;
  }
}
__name(ReasoningCurator, "ReasoningCurator");
async function ReasoningAgent(query, result, client) {
  try {
    const prompt = ReasoningCurator(query, result);
    const response = await client.chat.completions.create({
      model: NVIDIA_MODEL,
      messages: [
        {
          role: "system",
          content: "detailed thinking on. You are an insightful data analyst."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 1024
    });
    const fullResponse = response.choices[0].message.content;
    const { thinking, explanation } = extractThinkingAndExplanation(fullResponse);
    return {
      thinking,
      explanation
    };
  } catch (error) {
    console.error("ReasoningAgent error:", error);
    return {
      thinking: "",
      explanation: "Unable to generate reasoning due to an error.",
      error: error.message
    };
  }
}
__name(ReasoningAgent, "ReasoningAgent");
async function DataInsightAgent(schema, data, client) {
  try {
    const prompt = `Given a dataset with ${data.length} rows and ${schema.length} columns:
Columns: ${schema.map((col) => col.name).join(", ")}
Data types: ${schema.map((col) => `${col.name}: ${col.type}`).join(", ")}

Provide:
1. A brief description of what this dataset contains
2. 3-4 possible data analysis questions that could be explored
Keep it concise and focused.`;
    const response = await client.chat.completions.create({
      model: NVIDIA_MODEL,
      messages: [
        {
          role: "system",
          content: "detailed thinking off. You are a data analyst providing brief, focused insights."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 512
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("DataInsightAgent error:", error);
    return `Error generating dataset insights: ${error.message}`;
  }
}
__name(DataInsightAgent, "DataInsightAgent");
function extractFirstCodeBlock(text) {
  const start = text.indexOf("```python");
  if (start === -1) {
    return "";
  }
  const codeStart = start + "```python".length;
  const end = text.indexOf("```", codeStart);
  if (end === -1) {
    return "";
  }
  return text.substring(codeStart, end).trim();
}
__name(extractFirstCodeBlock, "extractFirstCodeBlock");
function extractThinkingAndExplanation(text) {
  const thinkStart = text.indexOf("<think>");
  const thinkEnd = text.indexOf("</think>");
  let thinking = "";
  let explanation = text;
  if (thinkStart !== -1 && thinkEnd !== -1) {
    thinking = text.substring(thinkStart + 7, thinkEnd).trim();
    explanation = text.replace(/<think>.*?<\/think>/s, "").trim();
  }
  return { thinking, explanation };
}
__name(extractThinkingAndExplanation, "extractThinkingAndExplanation");
String.prototype.strip = function() {
  return this.trim();
};
async function DashboardGenerationAgent(schema, data, analysis, client) {
  try {
    console.log("\u{1F3A8} DashboardGenerationAgent: Creating intelligent dashboard...");
    const dashboardPrompt = createDashboardPrompt(schema, data, analysis);
    const response = await client.chat.completions.create({
      model: NVIDIA_MODEL,
      messages: [
        {
          role: "system",
          content: "detailed thinking off. You are a data visualization expert who creates optimal dashboard layouts. You MUST respond with ONLY valid JSON that starts with { and ends with }. No explanations, no additional text. Focus on the most valuable and insightful visualizations based on the data characteristics and business context."
        },
        {
          role: "user",
          content: dashboardPrompt
        }
      ],
      temperature: 0.1,
      max_tokens: 1024
    });
    let dashboardRecommendations;
    try {
      const responseText = response.choices[0].message.content;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : responseText;
      dashboardRecommendations = JSON.parse(jsonText);
    } catch (jsonError) {
      console.error("Failed to parse NVIDIA response as JSON:", jsonError);
      throw new Error("Invalid JSON response from NVIDIA API");
    }
    const charts = [];
    if (dashboardRecommendations?.charts && Array.isArray(dashboardRecommendations.charts)) {
      for (const recommendation of dashboardRecommendations.charts.slice(0, 5)) {
        const chart = await generateDashboardChart(recommendation, schema, data, client);
        if (chart) {
          const formattedChart = {
            title: chart.metadata?.title || recommendation.title,
            description: chart.metadata?.businessInsight || recommendation.business_insight || "Data visualization",
            chartSpec: {
              data: chart.data,
              layout: chart.layout
            },
            priority: chart.metadata?.priority || recommendation.priority || 1
          };
          charts.push(formattedChart);
        }
      }
    }
    console.log(`\u2705 Generated ${charts.length} intelligent dashboard charts`);
    return charts.length > 0 ? charts : generateEnhancedAutoCharts(schema, data, analysis);
  } catch (error) {
    console.error("DashboardGenerationAgent error:", error);
    return generateEnhancedAutoCharts(schema, data, analysis);
  }
}
__name(DashboardGenerationAgent, "DashboardGenerationAgent");
function createDashboardPrompt(schema, data, analysis) {
  const numericCols = schema.filter((col) => col.type === "number").map((col) => col.name);
  const categoricalCols = schema.filter((col) => col.type === "string").map((col) => col.name);
  const dateCols = schema.filter((col) => col.type === "date").map((col) => col.name);
  return `Based on this dataset analysis, recommend the 5 most valuable visualizations for a comprehensive dashboard:

DATASET CHARACTERISTICS:
- Rows: ${data.length}
- Numeric columns: ${numericCols.join(", ")}
- Categorical columns: ${categoricalCols.join(", ")}
- Date columns: ${dateCols.join(", ")}

BUSINESS INSIGHTS:
${JSON.stringify(analysis?.businessInsights || analysis?.insights || [], null, 2)}

CORRELATIONS FOUND:
${JSON.stringify(analysis?.correlations || [], null, 2)}

PATTERNS DETECTED:
${JSON.stringify(analysis?.patterns || {}, null, 2)}

Respond with exactly this JSON structure:
{
  "charts": [
    {
      "title": "Specific descriptive title",
      "type": "bar|line|scatter|pie|histogram|dual_axis",
      "primary_column": "column_name",
      "secondary_column": "column_name_if_needed",
      "groupby_column": "column_name_if_grouping",
      "aggregation": "mean|sum|count|none",
      "business_insight": "What business value this chart provides",
      "priority": 1-5
    }
  ]
}

Focus on:
1. Key performance indicators and metrics
2. Trends and patterns over time (if date columns exist)
3. Distributions and outliers
4. Relationships and correlations
5. Category performance comparisons

Prioritize charts that provide actionable business insights.`;
}
__name(createDashboardPrompt, "createDashboardPrompt");
async function generateDashboardChart(recommendation, schema, data, client) {
  try {
    const chartCode = generateChartCode(recommendation, schema);
    const plotlySpec = convertMatplotlibToPlotly(chartCode, data);
    if (plotlySpec) {
      return {
        ...plotlySpec,
        metadata: {
          title: recommendation.title,
          type: recommendation.type,
          businessInsight: recommendation.business_insight,
          priority: recommendation.priority
        }
      };
    }
    return null;
  } catch (error) {
    console.error("Error generating dashboard chart:", error);
    return null;
  }
}
__name(generateDashboardChart, "generateDashboardChart");
function generateChartCode(recommendation, schema) {
  const { type, primary_column, secondary_column, groupby_column, aggregation } = recommendation;
  let code = "import pandas as pd\nimport matplotlib.pyplot as plt\n\n";
  switch (type) {
    case "bar":
      if (groupby_column && aggregation && aggregation !== "none") {
        code += `result = df.groupby('${groupby_column}')['${primary_column}'].${aggregation}()
`;
        code += `plt.bar(result.index, result.values)
`;
        code += `plt.title('${recommendation.title}')
`;
        code += `plt.xlabel('${groupby_column}')
`;
        code += `plt.ylabel('${primary_column} (${aggregation})')
`;
      } else if (primary_column && secondary_column) {
        code += `plt.bar(df['${primary_column}'], df['${secondary_column}'])
`;
        code += `plt.title('${recommendation.title}')
`;
        code += `plt.xlabel('${primary_column}')
`;
        code += `plt.ylabel('${secondary_column}')
`;
      }
      break;
    case "line":
      if (primary_column && secondary_column) {
        code += `plt.plot(df['${primary_column}'], df['${secondary_column}'])
`;
        code += `plt.title('${recommendation.title}')
`;
        code += `plt.xlabel('${primary_column}')
`;
        code += `plt.ylabel('${secondary_column}')
`;
      }
      break;
    case "scatter":
      if (primary_column && secondary_column) {
        code += `plt.scatter(df['${primary_column}'], df['${secondary_column}'])
`;
        code += `plt.title('${recommendation.title}')
`;
        code += `plt.xlabel('${primary_column}')
`;
        code += `plt.ylabel('${secondary_column}')
`;
      }
      break;
    case "histogram":
      code += `plt.hist(df['${primary_column}'])
`;
      code += `plt.title('${recommendation.title}')
`;
      code += `plt.xlabel('${primary_column}')
`;
      code += `plt.ylabel('Frequency')
`;
      break;
    case "pie":
      code += `counts = df['${primary_column}'].value_counts()
`;
      code += `plt.pie(counts.values, labels=counts.index)
`;
      code += `plt.title('${recommendation.title}')
`;
      break;
    case "dual_axis":
      if (primary_column && secondary_column) {
        code += `fig, ax1 = plt.subplots()
`;
        code += `ax1.plot(df.index, df['${primary_column}'], 'b-')
`;
        code += `ax1.set_ylabel('${primary_column}', color='b')
`;
        code += `ax2 = ax1.twinx()
`;
        code += `ax2.plot(df.index, df['${secondary_column}'], 'r-')
`;
        code += `ax2.set_ylabel('${secondary_column}', color='r')
`;
        code += `plt.title('${recommendation.title}')
`;
      }
      break;
  }
  code += "result = plt.gcf()";
  return code;
}
__name(generateChartCode, "generateChartCode");
function generateEnhancedAutoCharts(schema, data, analysis) {
  const charts = [];
  const numericCols = schema.filter((col) => col.type === "number");
  const categoricalCols = schema.filter((col) => col.type === "string");
  const dateCols = schema.filter((col) => col.type === "date");
  console.log("\u{1F3A8} Generating intelligent automatic charts...", {
    numericCols: numericCols.length,
    categoricalCols: categoricalCols.length,
    dateCols: dateCols.length
  });
  if (dateCols.length > 0 && numericCols.length > 0 && data.length > 1) {
    try {
      const keyNumericCol = findKeyMetric(numericCols, data) || numericCols[0];
      const chart = generateTimeSeriesChart(dateCols[0], keyNumericCol, data);
      if (chart) charts.push(chart);
    } catch (error) {
      console.warn("Failed to generate time series chart:", error);
    }
  }
  if (categoricalCols.length > 0 && numericCols.length > 0 && data.length > 1) {
    try {
      const balancedCategory = findBalancedCategory(categoricalCols, data);
      const keyMetric = findKeyMetric(numericCols, data);
      if (balancedCategory && keyMetric) {
        const chart = generateKPIChart(keyMetric, balancedCategory, data);
        if (chart) charts.push(chart);
      } else if (categoricalCols.length > 0 && numericCols.length > 0) {
        const chart = generateKPIChart(numericCols[0], categoricalCols[0], data);
        if (chart) charts.push(chart);
      }
    } catch (error) {
      console.warn("Failed to generate KPI chart:", error);
    }
  }
  if (numericCols.length > 0 && data.length > 5) {
    try {
      const variableCol = findMostVariableColumn(numericCols, data);
      if (variableCol) {
        const chart = generateDistributionChart(variableCol, data);
        if (chart) charts.push(chart);
      }
    } catch (error) {
      console.warn("Failed to generate distribution chart:", error);
    }
  }
  if (numericCols.length >= 2 && data.length > 5) {
    try {
      const strongCorrelation = findStrongestCorrelation(numericCols, data);
      if (strongCorrelation) {
        const chart = generateCorrelationChart(strongCorrelation.col1, strongCorrelation.col2, data);
        if (chart) charts.push(chart);
      } else {
        const chart = generateCorrelationChart(numericCols[0], numericCols[1], data);
        if (chart) charts.push(chart);
      }
    } catch (error) {
      console.warn("Failed to generate correlation chart:", error);
    }
  }
  if (categoricalCols.length > 0 && data.length > 2) {
    try {
      const categoryCol = findBalancedCategory(categoricalCols, data);
      if (categoryCol) {
        const chart = generateCategoryChart(categoryCol, data);
        if (chart) charts.push(chart);
      }
    } catch (error) {
      console.warn("Failed to generate category chart:", error);
    }
  }
  if (numericCols.length >= 3 && categoricalCols.length >= 1 && data.length > 5) {
    try {
      const topMetrics = numericCols.slice(0, 2);
      const categoryCol = categoricalCols[0];
      const chart = generateMultiMetricChart(topMetrics, categoryCol, data);
      if (chart) charts.push(chart);
    } catch (error) {
      console.warn("Failed to generate multi-metric chart:", error);
    }
  }
  const validCharts = charts.filter((chart) => chart !== null);
  console.log(`\u2705 Generated ${validCharts.length} intelligent automatic charts`);
  return validCharts;
}
__name(generateEnhancedAutoCharts, "generateEnhancedAutoCharts");
function findKeyMetric(numericCols, data) {
  const businessKeywords = ["revenue", "profit", "sales", "income", "amount", "value", "price"];
  for (const keyword of businessKeywords) {
    const match = numericCols.find(
      (col) => col.name.toLowerCase().includes(keyword)
    );
    if (match) return match;
  }
  return findMostVariableColumn(numericCols, data);
}
__name(findKeyMetric, "findKeyMetric");
function findMostVariableColumn(numericCols, data) {
  let maxVariation = 0;
  let mostVariable = null;
  numericCols.forEach((col) => {
    const values = data.map((row) => Number(row[col.name])).filter((v) => !isNaN(v));
    if (values.length > 0) {
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
      const cv = Math.sqrt(variance) / mean;
      if (cv > maxVariation) {
        maxVariation = cv;
        mostVariable = col;
      }
    }
  });
  return mostVariable;
}
__name(findMostVariableColumn, "findMostVariableColumn");
function findStrongestCorrelation(numericCols, data) {
  let strongest = null;
  let maxCorrelation = 0;
  for (let i = 0; i < numericCols.length; i++) {
    for (let j = i + 1; j < numericCols.length; j++) {
      const col1 = numericCols[i];
      const col2 = numericCols[j];
      const values1 = data.map((row) => Number(row[col1.name])).filter((v) => !isNaN(v));
      const values2 = data.map((row) => Number(row[col2.name])).filter((v) => !isNaN(v));
      if (values1.length === values2.length && values1.length > 5) {
        const correlation = Math.abs(calculateCorrelation(values1, values2));
        if (correlation > maxCorrelation && correlation > 0.5) {
          maxCorrelation = correlation;
          strongest = { col1, col2, correlation };
        }
      }
    }
  }
  return strongest;
}
__name(findStrongestCorrelation, "findStrongestCorrelation");
function findBalancedCategory(categoricalCols, data) {
  for (const col of categoricalCols) {
    const counts = data.reduce((acc, row) => {
      const value = row[col.name];
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
    const uniqueCount = Object.keys(counts).length;
    if (uniqueCount >= 3 && uniqueCount <= 10) {
      return col;
    }
  }
  return categoricalCols[0] || null;
}
__name(findBalancedCategory, "findBalancedCategory");
function generateKPIChart(numericCol, categoryCol, data) {
  if (!data || data.length === 0 || !numericCol || !categoryCol) {
    return null;
  }
  const groups = data.reduce((acc, row) => {
    const key = row[categoryCol.name];
    const value = Number(row[numericCol.name]);
    if (key && !isNaN(value)) {
      if (!acc[key]) acc[key] = [];
      acc[key].push(value);
    }
    return acc;
  }, {});
  if (Object.keys(groups).length === 0) {
    return null;
  }
  const chartData = Object.entries(groups).map(([key, values]) => ({
    category: key,
    value: values.reduce((a, b) => a + b, 0) / values.length
  })).sort((a, b) => b.value - a.value).slice(0, 10);
  return {
    title: `${numericCol.name} Performance by ${categoryCol.name}`,
    description: `Shows performance distribution across different ${categoryCol.name} categories`,
    chartSpec: {
      data: [{
        x: chartData.map((d) => d.category),
        y: chartData.map((d) => d.value),
        type: "bar",
        marker: {
          color: "#667eea",
          line: { color: "#2d3748", width: 1 }
        }
      }],
      layout: {
        title: `${numericCol.name} Performance by ${categoryCol.name}`,
        xaxis: { title: categoryCol.name },
        yaxis: { title: `Average ${numericCol.name}` },
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        margin: { t: 60, b: 60, l: 60, r: 40 }
      }
    },
    priority: 1
  };
}
__name(generateKPIChart, "generateKPIChart");
function generateDistributionChart(numericCol, data) {
  if (!data || data.length === 0 || !numericCol) {
    return null;
  }
  const values = data.map((row) => Number(row[numericCol.name])).filter((v) => !isNaN(v));
  return {
    title: `${numericCol.name} Distribution Analysis`,
    description: `Reveals the distribution pattern and potential outliers in ${numericCol.name}`,
    chartSpec: {
      data: [{
        x: values,
        type: "histogram",
        nbinsx: Math.min(20, Math.max(8, Math.floor(Math.sqrt(values.length)))),
        marker: {
          color: "#764ba2",
          opacity: 0.7,
          line: { color: "#2d3748", width: 1 }
        }
      }],
      layout: {
        title: `${numericCol.name} Distribution Analysis`,
        xaxis: { title: numericCol.name },
        yaxis: { title: "Frequency" },
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        margin: { t: 60, b: 60, l: 60, r: 40 }
      }
    },
    priority: 2
  };
}
__name(generateDistributionChart, "generateDistributionChart");
function generateCorrelationChart(col1, col2, data) {
  if (!data || data.length === 0 || !col1 || !col2) {
    return null;
  }
  const points = data.map((row) => ({
    x: Number(row[col1.name]),
    y: Number(row[col2.name])
  })).filter((point) => !isNaN(point.x) && !isNaN(point.y));
  return {
    title: `${col1.name} vs ${col2.name} Relationship`,
    description: `Shows the relationship strength between ${col1.name} and ${col2.name}`,
    chartSpec: {
      data: [{
        x: points.map((p) => p.x),
        y: points.map((p) => p.y),
        type: "scatter",
        mode: "markers",
        marker: {
          color: "#f093fb",
          size: 8,
          opacity: 0.7,
          line: { color: "#2d3748", width: 1 }
        }
      }],
      layout: {
        title: `${col1.name} vs ${col2.name} Relationship`,
        xaxis: { title: col1.name },
        yaxis: { title: col2.name },
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        margin: { t: 60, b: 60, l: 60, r: 40 }
      }
    },
    priority: 3
  };
}
__name(generateCorrelationChart, "generateCorrelationChart");
function generateTimeSeriesChart(dateCol, numericCol, data) {
  if (!data || data.length === 0 || !dateCol || !numericCol) {
    return null;
  }
  const timeData = data.filter((row) => row[dateCol.name] && !isNaN(Number(row[numericCol.name]))).sort((a, b) => new Date(a[dateCol.name]).getTime() - new Date(b[dateCol.name]).getTime());
  return {
    title: `${numericCol.name} Trends Over Time`,
    description: `Reveals temporal patterns and trends in ${numericCol.name}`,
    chartSpec: {
      data: [{
        x: timeData.map((row) => row[dateCol.name]),
        y: timeData.map((row) => Number(row[numericCol.name])),
        type: "scatter",
        mode: "lines+markers",
        line: { color: "#4facfe", width: 3 },
        marker: { color: "#00f2fe", size: 6 }
      }],
      layout: {
        title: `${numericCol.name} Trends Over Time`,
        xaxis: { title: dateCol.name },
        yaxis: { title: numericCol.name },
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        margin: { t: 60, b: 60, l: 60, r: 40 }
      }
    },
    priority: 1
  };
}
__name(generateTimeSeriesChart, "generateTimeSeriesChart");
function generateCategoryChart(categoryCol, data) {
  if (!data || data.length === 0 || !categoryCol) {
    return null;
  }
  const counts = data.reduce((acc, row) => {
    const value = row[categoryCol.name];
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
  const sortedCounts = Object.entries(counts).sort(([, a], [, b]) => b - a).slice(0, 8);
  return {
    title: `${categoryCol.name} Distribution`,
    description: `Shows the composition and distribution of ${categoryCol.name} categories`,
    chartSpec: {
      data: [{
        labels: sortedCounts.map(([label]) => label),
        values: sortedCounts.map(([, value]) => value),
        type: "pie",
        marker: {
          colors: ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe", "#00f2fe", "#43e97b", "#38f9d7"],
          line: { color: "#ffffff", width: 2 }
        },
        textinfo: "label+percent",
        textposition: "auto"
      }],
      layout: {
        title: `${categoryCol.name} Distribution`,
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        margin: { t: 60, b: 60, l: 60, r: 60 }
      }
    },
    priority: 4
  };
}
__name(generateCategoryChart, "generateCategoryChart");
function generateMultiMetricChart(topMetrics, categoryCol, data) {
  if (!data || data.length === 0 || !topMetrics || topMetrics.length < 2 || !categoryCol) {
    return null;
  }
  const groups = data.reduce((acc, row) => {
    const key = row[categoryCol.name];
    if (!acc[key]) acc[key] = [];
    acc[key].push(Number(row[topMetrics[0].name]));
    acc[key].push(Number(row[topMetrics[1].name]));
    return acc;
  }, {});
  const chartData = Object.entries(groups).map(([key, values]) => ({
    category: key,
    value: values.reduce((a, b) => a + b, 0) / values.length
  })).sort((a, b) => b.value - a.value).slice(0, 10);
  return {
    title: `${topMetrics.map((col) => col.name).join(" & ")} Performance by ${categoryCol.name}`,
    description: `Multi-metric performance analysis across different ${categoryCol.name} categories`,
    chartSpec: {
      data: [{
        x: chartData.map((d) => d.category),
        y: chartData.map((d) => d.value),
        type: "bar",
        marker: {
          color: "#667eea",
          line: { color: "#2d3748", width: 1 }
        }
      }],
      layout: {
        title: `${topMetrics.map((col) => col.name).join(" & ")} Performance by ${categoryCol.name}`,
        xaxis: { title: categoryCol.name },
        yaxis: { title: "Average Performance" },
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",
        margin: { t: 60, b: 60, l: 60, r: 40 }
      }
    },
    priority: 5
  };
}
__name(generateMultiMetricChart, "generateMultiMetricChart");

// src/handlers.ts
async function uploadCsvHandler(request, env) {
  console.log("\u{1F4E5} uploadCsvHandler v2: Phase 1 upgrade with DuckDB and R2 storage");
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      console.error("\u274C No file provided in request");
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log("\u{1F4C1} Processing uploaded file:", file.name, "Size:", file.size, "bytes");
    const fileBuffer = await file.arrayBuffer();
    const csvText = new TextDecoder().decode(fileBuffer);
    console.log("\u{1F4C4} CSV text length:", csvText.length, "characters");
    console.log("\u{1F527} Parsing CSV data...");
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    });
    if (parseResult.errors.length > 0) {
      console.error("\u274C CSV parsing errors:", parseResult.errors);
      return new Response(JSON.stringify({
        error: "CSV parsing failed",
        details: parseResult.errors.slice(0, 5)
        // Limit error details
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const data = parseResult.data;
    const schema = inferSchema(data);
    const sampleRows = data.slice(0, 10);
    const datasetId = generateUUID();
    console.log(`\u{1F4CA} Parsed data: ${data.length} rows, ${schema.length} columns`);
    console.log(`\u{1F511} Generated dataset ID: ${datasetId}`);
    console.log("\u{1F4E6} Preparing data for R2 storage...");
    const jsonBuffer = new TextEncoder().encode(JSON.stringify(data));
    console.log(`\u{1F4E6} JSON buffer created, size: ${jsonBuffer.byteLength} bytes`);
    console.log(`\u2601\uFE0F Uploading JSON data to R2 with ID: ${datasetId}`);
    await env.R2_BUCKET.put(datasetId, jsonBuffer, {
      httpMetadata: {
        contentType: "application/json"
      },
      customMetadata: {
        originalFileName: file.name,
        rowCount: data.length.toString(),
        columnCount: schema.length.toString(),
        uploadTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
        compressionRatio: (csvText.length / jsonBuffer.byteLength).toFixed(2)
      }
    });
    console.log("\u2705 Data successfully stored in R2");
    console.log("\u{1F4CA} Starting enhanced statistical analysis on full dataset...");
    const duckDbAnalysis = await analyzeWithDuckDB(data, env);
    console.log("\u2705 Enhanced statistical analysis completed");
    console.log("\u{1F50D} Starting NVIDIA AI analysis with enhanced statistical context...");
    let analysis;
    if (env.NVIDIA_API_KEY) {
      try {
        console.log(`\u{1F511} Using NVIDIA API for enhanced dataset analysis`);
        const nvidiaClient = createNvidiaClient(env.NVIDIA_API_KEY);
        const insights = await DataInsightAgent(schema, sampleRows, nvidiaClient);
        analysis = await analyzeDataWithAI(schema, sampleRows, env);
        analysis.summary = insights;
        analysis.duckDbAnalysis = duckDbAnalysis;
        console.log("\u{1F3A8} Generating NVIDIA-powered intelligent dashboard...");
        const intelligentCharts = await DashboardGenerationAgent(schema, data, analysis, nvidiaClient);
        analysis.autoCharts = intelligentCharts;
        console.log("\u2705 NVIDIA-enhanced AI analysis completed");
      } catch (error) {
        console.error("\u26A0\uFE0F NVIDIA API failed, falling back to Cloudflare AI:", error);
        analysis = await analyzeDataWithAI(schema, sampleRows, env);
        analysis.duckDbAnalysis = duckDbAnalysis;
        if (analysis.autoCharts && analysis.autoCharts.length > 0) {
          analysis.autoCharts = analysis.autoCharts.map((chart) => {
            if (!chart.title && chart.chartSpec) {
              return {
                title: "Data Visualization",
                description: "Chart generated from your data",
                chartSpec: chart.chartSpec,
                priority: chart.priority || 1
              };
            }
            return chart;
          });
        }
      }
    } else {
      console.log("\u26A0\uFE0F No NVIDIA API key found, using Cloudflare AI");
      analysis = await analyzeDataWithAI(schema, sampleRows, env);
      analysis.duckDbAnalysis = duckDbAnalysis;
      if (analysis.autoCharts && analysis.autoCharts.length > 0) {
        analysis.autoCharts = analysis.autoCharts.map((chart) => {
          if (!chart.title && chart.chartSpec) {
            return {
              title: "Data Visualization",
              description: "Chart generated from your data",
              chartSpec: chart.chartSpec,
              priority: chart.priority || 1
            };
          }
          return chart;
        });
      }
    }
    console.log("\u{1F4BE} Storing metadata in KV...");
    await Promise.all([
      env.KV.put(`${datasetId}:schema`, JSON.stringify(schema)),
      env.KV.put(`${datasetId}:sample`, JSON.stringify(sampleRows)),
      env.KV.put(`${datasetId}:analysis`, JSON.stringify(analysis))
      // We no longer store the full CSV in KV - it's efficiently stored in R2 as JSON
    ]);
    console.log(`\u2705 Metadata stored in KV with dataset ID: ${datasetId}`);
    const response = {
      datasetId,
      schema,
      sampleRows,
      analysis,
      duckDbAnalysis
    };
    console.log(`\u{1F389} Upload process completed successfully for dataset ${datasetId}`);
    console.log(`\u{1F4C8} Enhanced with ${duckDbAnalysis.summary.length} statistical summaries`);
    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("\u274C Upload error:", error);
    console.error("\u274C Error stack:", error instanceof Error ? error.stack : "No stack trace available");
    return new Response(JSON.stringify({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(uploadCsvHandler, "uploadCsvHandler");
async function queryHandler(request, env) {
  console.log("\u{1F50D} queryHandler: NVIDIA Agent-based processing");
  try {
    const requestData = await request.json();
    const { datasetId, prompt } = requestData;
    console.log("Using dataset:", datasetId, "prompt:", prompt);
    const [schemaStr, sampleRowsStr, dataStr] = await Promise.all([
      env.KV.get(`${datasetId}:schema`),
      env.KV.get(`${datasetId}:sample`),
      env.R2_BUCKET.get(datasetId)
    ]);
    if (!schemaStr || !sampleRowsStr) {
      return new Response(JSON.stringify({ error: "Dataset not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const schema = JSON.parse(schemaStr);
    const sampleRows = JSON.parse(sampleRowsStr);
    let fullData = sampleRows;
    if (dataStr) {
      try {
        const dataText = await dataStr.text();
        fullData = JSON.parse(dataText);
        console.log(`\u{1F4CA} Loaded full dataset: ${fullData.length} rows`);
      } catch (error) {
        console.warn("\u26A0\uFE0F Could not load full dataset, using sample data");
      }
    }
    if (env.NVIDIA_API_KEY) {
      try {
        console.log("\u{1F916} Starting NVIDIA agent workflow...");
        console.log(`\u{1F511} Using NVIDIA API for enhanced analysis`);
        const nvidiaClient = createNvidiaClient(env.NVIDIA_API_KEY);
        console.log("\u{1F527} CodeGenerationAgent: Generating code...");
        const codeResult = await CodeGenerationAgent(prompt, schema, nvidiaClient);
        if (codeResult.error) {
          throw new Error(`Code generation failed: ${codeResult.error}`);
        }
        console.log("\u26A1 ExecutionAgent: Executing code...");
        const executionResult = ExecutionAgent(codeResult.code, fullData, codeResult.shouldPlot);
        if (executionResult.error) {
          throw new Error(`Code execution failed: ${executionResult.error}`);
        }
        console.log("\u{1F9E0} ReasoningAgent: Generating insights...");
        const reasoningResult = await ReasoningAgent(prompt, executionResult.result, nvidiaClient);
        const response2 = {
          code: codeResult.code,
          result: executionResult.result,
          shouldPlot: codeResult.shouldPlot,
          thinking: reasoningResult.thinking,
          explanation: reasoningResult.explanation,
          logs: [
            "NVIDIA agents workflow completed successfully",
            "Code generated and executed",
            "Reasoning and insights generated"
          ]
        };
        console.log("\u2705 NVIDIA agent workflow completed successfully");
        return new Response(JSON.stringify(response2), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (nvidiaError) {
        console.error("\u274C NVIDIA agent workflow failed:", nvidiaError);
        console.log("\u{1F504} Falling back to traditional chart generation...");
      }
    }
    console.log("\u{1F4CA} Using traditional chart generation as fallback...");
    const chartSpec = createFallbackChart(schema, sampleRows);
    const response = {
      chartSpec,
      logs: ["Used fallback chart generation due to NVIDIA API unavailability"]
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
    <title>Business Analysis HR Agent - Professional Data Analytics Platform</title>
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
            /* Primary brand colors - refined blue palette */
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
            
            /* Neutral colors - warmer grays */
            --gray-25: #fefefe;
            --gray-50: #fafbfc;
            --gray-100: #f4f6f8;
            --gray-200: #e6eaee;
            --gray-300: #d0d7de;
            --gray-400: #9ca3af;
            --gray-500: #6b7280;
            --gray-600: #4b5563;
            --gray-700: #374151;
            --gray-800: #1f2937;
            --gray-900: #111827;
            
            /* Status colors */
            --success-50: #f0fdf4;
            --success-100: #dcfce7;
            --success-200: #bbf7d0;
            --success-500: #22c55e;
            --success-600: #16a34a;
            --success-700: #15803d;
            
            --error-50: #fef2f2;
            --error-100: #fee2e2;
            --error-200: #fecaca;
            --error-500: #ef4444;
            --error-600: #dc2626;
            --error-700: #b91c1c;
            
            --warning-50: #fffbeb;
            --warning-100: #fef3c7;
            --warning-200: #fed7aa;
            --warning-500: #f59e0b;
            --warning-600: #d97706;
            --warning-700: #b45309;
            
            /* Enhanced shadows */
            --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.02);
            --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.04);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
            --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
            --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.12);
            
            /* Border radius scale */
            --radius-xs: 0.25rem;
            --radius-sm: 0.375rem;
            --radius-md: 0.5rem;
            --radius-lg: 0.75rem;
            --radius-xl: 1rem;
            --radius-2xl: 1.5rem;
            
            /* Spacing scale */
            --space-1: 0.25rem;
            --space-2: 0.5rem;
            --space-3: 0.75rem;
            --space-4: 1rem;
            --space-5: 1.25rem;
            --space-6: 1.5rem;
            --space-8: 2rem;
            --space-10: 2.5rem;
            --space-12: 3rem;
            --space-16: 4rem;
            
            /* Typography */
            --font-size-xs: 0.75rem;
            --font-size-sm: 0.875rem;
            --font-size-base: 1rem;
            --font-size-lg: 1.125rem;
            --font-size-xl: 1.25rem;
            --font-size-2xl: 1.5rem;
            --font-size-3xl: 1.875rem;
            
            /* Line heights */
            --leading-none: 1;
            --leading-tight: 1.25;
            --leading-snug: 1.375;
            --leading-normal: 1.5;
            --leading-relaxed: 1.625;
            --leading-loose: 2;
        }
        
        /* Base styles */
        body { 
            font-family: 'Inter', system-ui, -apple-system, sans-serif; 
            background: linear-gradient(135deg, var(--gray-25) 0%, var(--gray-50) 100%);
            color: var(--gray-900);
            line-height: var(--leading-normal);
            min-height: 100vh;
            font-feature-settings: 'cv11', 'ss01';
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        /* Header styles */
        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px) saturate(180%);
            border-bottom: 1px solid var(--gray-200);
            padding: var(--space-6) 0;
            position: sticky;
            top: 0;
            z-index: 50;
            box-shadow: var(--shadow-sm);
        }
        
        .header-content {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 var(--space-8);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: var(--space-4);
        }
        
        .logo-icon {
            width: 2.75rem;
            height: 2.75rem;
            background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
            border-radius: var(--radius-lg);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            box-shadow: var(--shadow-md);
            position: relative;
        }
        
        .logo-icon::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%);
            border-radius: var(--radius-lg);
            pointer-events: none;
        }
        
        .logo h1 {
            font-size: var(--font-size-2xl);
            font-weight: 700;
            color: var(--gray-900);
            letter-spacing: -0.025em;
        }
        
        .subtitle {
            font-size: var(--font-size-sm);
            color: var(--gray-600);
            margin-top: var(--space-1);
            font-weight: 500;
        }
        
        /* Main layout */
        .main-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: var(--space-8);
        }
        
        .grid-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-8);
            margin-bottom: var(--space-8);
        }
        
        .full-width {
            grid-column: 1 / -1;
        }
        
        /* Enhanced card styles */
        .card { 
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid var(--gray-200);
            border-radius: var(--radius-2xl);
            padding: var(--space-8);
            box-shadow: var(--shadow-sm);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        
        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, var(--primary-200) 50%, transparent 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .card:hover {
            box-shadow: var(--shadow-lg);
            border-color: var(--gray-300);
            transform: translateY(-2px);
        }
        
        .card:hover::before {
            opacity: 1;
        }
        
        .card-header {
            display: flex;
            align-items: center;
            gap: var(--space-3);
            margin-bottom: var(--space-6);
        }
        
        .card-icon {
            width: 1.5rem;
            height: 1.5rem;
            color: var(--primary-600);
            transition: color 0.2s ease;
        }
        
        .card:hover .card-icon {
            color: var(--primary-700);
        }
        
        .card-title {
            font-size: var(--font-size-xl);
            font-weight: 600;
            color: var(--gray-900);
            letter-spacing: -0.025em;
        }
        
        /* Enhanced file upload area */
        .file-upload-area {
            border: 2px dashed var(--gray-300);
            border-radius: var(--radius-xl);
            padding: var(--space-10);
            text-align: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            background: linear-gradient(135deg, var(--gray-50) 0%, var(--gray-25) 100%);
            position: relative;
            overflow: hidden;
        }
        
        .file-upload-area::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-25) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .file-upload-area:hover {
            border-color: var(--primary-400);
            transform: translateY(-1px);
        }
        
        .file-upload-area:hover::before {
            opacity: 1;
        }
        
        .file-upload-area.dragover {
            border-color: var(--primary-500);
            background: var(--primary-50);
            transform: scale(1.02);
            box-shadow: var(--shadow-lg);
        }
        
        .file-upload-area.has-file {
            border-color: var(--success-500);
            background: linear-gradient(135deg, var(--success-50) 0%, var(--success-25) 100%);
        }
        
        .upload-icon {
            width: 4rem;
            height: 4rem;
            color: var(--gray-400);
            margin: 0 auto var(--space-4);
            transition: all 0.3s ease;
        }
        
        .file-upload-area:hover .upload-icon {
            color: var(--primary-500);
            transform: scale(1.1);
        }
        
        .upload-text {
            font-weight: 600;
            color: var(--gray-700);
            margin-bottom: var(--space-2);
            font-size: var(--font-size-lg);
        }
        
        .upload-subtext {
            font-size: var(--font-size-sm);
            color: var(--gray-500);
        }
        
        /* File selected state */
        .file-selected {
            margin-top: var(--space-4);
            padding: var(--space-4);
            background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-25) 100%);
            border: 1px solid var(--primary-200);
            border-radius: var(--radius-lg);
            color: var(--primary-700);
            font-size: var(--font-size-sm);
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: var(--space-3);
            animation: slideInUp 0.3s ease-out;
        }
        
        /* Progress styles */
        .upload-progress {
            margin-top: var(--space-4);
            padding: var(--space-5);
            background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-25) 100%);
            border: 1px solid var(--primary-200);
            border-radius: var(--radius-lg);
            display: none;
            animation: slideInUp 0.3s ease-out;
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
            margin-top: var(--space-3);
            position: relative;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-500) 0%, var(--primary-600) 100%);
            border-radius: 4px;
            transition: width 0.3s ease;
            animation: shimmer 2s infinite;
        }
        
        /* Enhanced input styles */
        .file-input {
            display: none;
        }
        
        .prompt-input {
            width: 100%;
            min-height: 140px;
            padding: var(--space-5);
            border: 1.5px solid var(--gray-300);
            border-radius: var(--radius-xl);
            font-family: inherit;
            font-size: var(--font-size-sm);
            resize: vertical;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            line-height: var(--leading-relaxed);
        }
        
        .prompt-input:focus {
            outline: none;
            border-color: var(--primary-500);
            box-shadow: 0 0 0 4px var(--primary-100);
            transform: translateY(-1px);
        }
        
        .prompt-input::placeholder {
            color: var(--gray-400);
            line-height: var(--leading-relaxed);
        }
        
        /* Enhanced button styles */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: var(--space-2);
            padding: var(--space-4) var(--space-6);
            border: none;
            border-radius: var(--radius-lg);
            font-family: inherit;
            font-size: var(--font-size-sm);
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            text-decoration: none;
            position: relative;
            overflow: hidden;
            letter-spacing: 0.025em;
        }
        
        .btn::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%);
            opacity: 0;
            transition: opacity 0.2s ease;
        }
        
        .btn:hover::before {
            opacity: 1;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
            color: white;
            box-shadow: var(--shadow-md);
        }
        
        .btn-primary:hover {
            background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
            box-shadow: var(--shadow-lg);
            transform: translateY(-2px);
        }
        
        .btn-primary:active {
            transform: translateY(0);
            box-shadow: var(--shadow-sm);
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
        
        .btn-primary:disabled::before {
            opacity: 0;
        }
        
        .btn-secondary {
            background: rgba(255, 255, 255, 0.8);
            color: var(--gray-700);
            border: 1.5px solid var(--gray-300);
            backdrop-filter: blur(10px);
        }
        
        .btn-secondary:hover {
            background: var(--gray-50);
            border-color: var(--gray-400);
            transform: translateY(-1px);
        }
        
        .btn-icon {
            width: 1.125rem;
            height: 1.125rem;
        }
        
        /* Enhanced status messages */
        .status {
            padding: var(--space-5);
            border-radius: var(--radius-lg);
            margin: var(--space-4) 0;
            display: flex;
            align-items: center;
            gap: var(--space-3);
            font-size: var(--font-size-sm);
            font-weight: 500;
            animation: slideInUp 0.3s ease-out;
            backdrop-filter: blur(20px);
        }
        
        .status.success {
            background: linear-gradient(135deg, var(--success-50) 0%, rgba(255,255,255,0.8) 100%);
            color: var(--success-700);
            border: 1px solid var(--success-200);
        }
        
        .status.error {
            background: linear-gradient(135deg, var(--error-50) 0%, rgba(255,255,255,0.8) 100%);
            color: var(--error-700);
            border: 1px solid var(--error-200);
        }
        
        .status.info {
            background: linear-gradient(135deg, var(--primary-50) 0%, rgba(255,255,255,0.8) 100%);
            color: var(--primary-700);
            border: 1px solid var(--primary-200);
        }
        
        .status.warning {
            background: linear-gradient(135deg, var(--warning-50) 0%, rgba(255,255,255,0.8) 100%);
            color: var(--warning-700);
            border: 1px solid var(--warning-200);
        }
        
        /* Loading animations */
        .loading-spinner {
            width: 1.125rem;
            height: 1.125rem;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        /* Metrics grid */
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: var(--space-4);
            margin: var(--space-6) 0;
        }
        
        .metric-card {
            background: linear-gradient(135deg, var(--gray-50) 0%, rgba(255,255,255,0.8) 100%);
            border: 1px solid var(--gray-200);
            border-radius: var(--radius-lg);
            padding: var(--space-5);
            text-align: center;
            transition: all 0.2s ease;
            backdrop-filter: blur(10px);
        }
        
        .metric-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }
        
        .metric-value {
            font-size: var(--font-size-2xl);
            font-weight: 700;
            color: var(--primary-600);
            margin-bottom: var(--space-1);
            line-height: var(--leading-tight);
        }
        
        .metric-label {
            font-size: var(--font-size-xs);
            font-weight: 600;
            color: var(--gray-600);
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
        
        /* Insights list */
        .insights-list {
            list-style: none;
            margin: var(--space-4) 0;
        }
        
        .insights-list li {
            background: linear-gradient(135deg, var(--gray-50) 0%, rgba(255,255,255,0.8) 100%);
            border: 1px solid var(--gray-200);
            border-radius: var(--radius-lg);
            padding: var(--space-4) var(--space-5);
            margin-bottom: var(--space-3);
            font-size: var(--font-size-sm);
            line-height: var(--leading-relaxed);
            position: relative;
            padding-left: var(--space-10);
            transition: all 0.2s ease;
            backdrop-filter: blur(10px);
        }
        
        .insights-list li:hover {
            transform: translateX(4px);
            box-shadow: var(--shadow-sm);
        }
        
        .insights-list li::before {
            content: '';
            position: absolute;
            left: var(--space-4);
            top: 1.125rem;
            width: 0.375rem;
            height: 0.375rem;
            background: var(--primary-500);
            border-radius: 50%;
            box-shadow: 0 0 0 3px var(--primary-100);
        }
        
        /* Charts grid */
        .charts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
            gap: var(--space-8);
            margin-top: var(--space-8);
        }
        
        .chart-container {
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid var(--gray-200);
            border-radius: var(--radius-2xl);
            padding: var(--space-6);
            box-shadow: var(--shadow-sm);
            transition: all 0.3s ease;
            backdrop-filter: blur(20px);
        }
        
        .chart-container:hover {
            box-shadow: var(--shadow-lg);
            transform: translateY(-2px);
        }
        
        .chart-title {
            font-size: var(--font-size-lg);
            font-weight: 600;
            color: var(--gray-900);
            margin-bottom: var(--space-2);
            letter-spacing: -0.025em;
        }
        
        .chart-description {
            font-size: var(--font-size-sm);
            color: var(--gray-600);
            margin-bottom: var(--space-6);
            line-height: var(--leading-relaxed);
        }
        
        /* Suggestions grid */
        .suggestions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: var(--space-4);
            margin-top: var(--space-6);
        }
        
        .suggestion-card {
            background: rgba(255, 255, 255, 0.8);
            border: 1px solid var(--gray-200);
            border-radius: var(--radius-xl);
            padding: var(--space-5);
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
            position: relative;
            overflow: hidden;
        }
        
        .suggestion-card::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, var(--primary-50) 0%, transparent 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .suggestion-card:hover {
            border-color: var(--primary-300);
            box-shadow: var(--shadow-lg);
            transform: translateY(-3px);
        }
        
        .suggestion-card:hover::before {
            opacity: 1;
        }
        
        .suggestion-title {
            font-weight: 600;
            color: var(--gray-900);
            margin-bottom: var(--space-2);
            font-size: var(--font-size-sm);
            position: relative;
            z-index: 1;
        }
        
        .suggestion-description {
            font-size: var(--font-size-xs);
            color: var(--gray-600);
            line-height: var(--leading-relaxed);
            margin-bottom: var(--space-3);
            position: relative;
            z-index: 1;
        }
        
        .suggestion-category {
            display: inline-block;
            background: linear-gradient(135deg, var(--primary-100) 0%, var(--primary-50) 100%);
            color: var(--primary-700);
            padding: var(--space-1) var(--space-3);
            border-radius: var(--radius-md);
            font-size: var(--font-size-xs);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            position: relative;
            z-index: 1;
        }
        
        /* Reasoning section */
        .reasoning-section {
            background: linear-gradient(135deg, var(--primary-50) 0%, rgba(255,255,255,0.8) 100%);
            border: 1px solid var(--primary-200);
            border-radius: var(--radius-xl);
            padding: var(--space-6);
            margin: var(--space-6) 0;
            backdrop-filter: blur(20px);
        }
        
        .reasoning-title {
            font-weight: 600;
            color: var(--primary-700);
            margin-bottom: var(--space-4);
            display: flex;
            align-items: center;
            gap: var(--space-2);
            font-size: var(--font-size-lg);
        }
        
        .reasoning-content {
            font-size: var(--font-size-sm);
            color: var(--gray-700);
            line-height: var(--leading-relaxed);
        }
        
        .section-title {
            font-size: var(--font-size-xl);
            font-weight: 600;
            color: var(--gray-900);
            margin-bottom: var(--space-4);
            display: flex;
            align-items: center;
            gap: var(--space-3);
            letter-spacing: -0.025em;
        }
        
        /* Animations */
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        @keyframes shimmer {
            0% { background-position: -200px 0; }
            100% { background-position: calc(200px + 100%) 0; }
        }
        
        @keyframes slideInUp {
            from { 
                opacity: 0; 
                transform: translateY(20px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in {
            animation: fadeIn 0.6s ease-out;
        }
        
        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: var(--gray-100);
            border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, var(--gray-400) 0%, var(--gray-500) 100%);
            border-radius: 4px;
            transition: background 0.2s ease;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, var(--gray-500) 0%, var(--gray-600) 100%);
        }
        
        /* Responsive Design */
        @media (max-width: 1200px) {
            .charts-grid {
                grid-template-columns: 1fr;
            }
        }
        
        @media (max-width: 768px) {
            .grid-layout {
                grid-template-columns: 1fr;
                gap: var(--space-6);
            }
            
            .main-container {
                padding: var(--space-4);
            }
            
            .header-content {
                padding: 0 var(--space-4);
            }
            
            .card {
                padding: var(--space-6);
            }
            
            .charts-grid {
                grid-template-columns: 1fr;
                gap: var(--space-6);
            }
            
            .suggestions-grid {
                grid-template-columns: 1fr;
            }
            
            .metrics-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .upload-icon {
                width: 3rem;
                height: 3rem;
            }
            
            .file-upload-area {
                padding: var(--space-8);
            }
            
            .logo h1 {
                font-size: var(--font-size-xl);
            }
        }
        
        @media (max-width: 480px) {
            .main-container {
                padding: var(--space-3);
            }
            
            .header-content {
                padding: 0 var(--space-3);
            }
            
            .card {
                padding: var(--space-4);
                border-radius: var(--radius-xl);
            }
            
            .metrics-grid {
                grid-template-columns: 1fr;
            }
            
            .logo h1 {
                font-size: var(--font-size-lg);
            }
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
            .card {
                border-width: 2px;
            }
            
            .btn {
                border-width: 2px;
            }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
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
                    <h1>Business Analysis HR Agent</h1>
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
                    <button onclick="clearFile()" style="margin-left: auto; background: none; border: none; color: var(--gray-500); cursor: pointer; padding: var(--space-1); border-radius: var(--radius-sm); transition: all 0.2s ease;">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div id="uploadProgress" class="upload-progress">
                    <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2);">
                        <div class="loading-spinner"></div>
                        <span>Uploading and analyzing your data...</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 100%;"></div>
                    </div>
                </div>
                <input type="file" id="csvFile" accept=".csv" class="file-input">
                <button id="uploadBtn" onclick="uploadFile()" class="btn btn-primary" style="margin-top: var(--space-4); width: 100%;" disabled>
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
                <textarea id="promptInput" class="prompt-input" placeholder="Ask questions about your HR data...

Examples:
\u2022 Show employee satisfaction trends over time
\u2022 Compare performance by department  
\u2022 Display top 10 employees by performance rating
\u2022 Analyze salary distribution by position level
\u2022 Show hiring trends and retention rates"></textarea>
                <button onclick="generateChart()" class="btn btn-primary" style="margin-top: var(--space-4); width: 100%;">
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
                <p style="color: var(--gray-600); margin-bottom: var(--space-6); line-height: var(--leading-relaxed);">AI-generated visualizations based on your data characteristics</p>
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
                <p style="color: var(--gray-600); margin-bottom: var(--space-6); line-height: var(--leading-relaxed);">AI-generated questions tailored to your specific dataset</p>
                <div id="suggestions" class="suggestions-grid"></div>
            </div>
        </div>
    </div>

    <script>
        // Initialize Lucide icons
        lucide.createIcons();
        
        let currentDatasetId = null;
        let currentAnalysis = null;
        let queryHistory = [];
        let chartHistory = [];

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
        
        // Enhanced dataset clearing with complete state reset
        function clearFile() {
            const fileInput = document.getElementById('csvFile');
            const uploadArea = document.getElementById('uploadArea');
            const fileSelected = document.getElementById('fileSelected');
            const uploadBtn = document.getElementById('uploadBtn');
            const statusDiv = document.getElementById('uploadStatus');
            const queryStatus = document.getElementById('queryStatus');
            const promptInput = document.getElementById('promptInput');
            
            // Show confirmation dialog for better UX
            if (currentDatasetId && (queryHistory.length > 0 || chartHistory.length > 0)) {
                if (!confirm('This will clear all your current analysis and charts. Are you sure you want to continue?')) {
                    return;
                }
            }
            
            // Reset file input and UI
            fileInput.value = '';
            uploadArea.classList.remove('has-file');
            fileSelected.style.display = 'none';
            uploadBtn.disabled = true;
            uploadBtn.innerHTML = '<i data-lucide="zap" class="btn-icon"></i>Analyze Dataset';
            statusDiv.innerHTML = '';
            queryStatus.innerHTML = '';
            promptInput.value = '';
            promptInput.placeholder = "Ask questions about your data...

Examples:
\u2022 Show trends over time
\u2022 Compare performance by category
\u2022 Display top 10 items by value
\u2022 Analyze distribution by key metrics
\u2022 Show correlations between variables";
            
            // Clear global state completely
            currentDatasetId = null;
            currentAnalysis = null;
            queryHistory = [];
            chartHistory = [];
            
            // Hide all results sections with fade out animation
            const sectionsToHide = [
                'analysisResults', 'autoChartsSection', 'suggestionsSection', 
                'reasoningSection', 'chartSection', 'queryHistorySection'
            ];
            
            sectionsToHide.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                if (section) {
                    section.style.opacity = '0';
                    section.style.transform = 'translateY(-10px)';
                    setTimeout(() => {
                        section.style.display = 'none';
                        section.style.opacity = '';
                        section.style.transform = '';
                    }, 300);
                }
            });
            
            // Remove all dynamically created sections
            const dynamicSections = document.querySelectorAll('[id$="Section"]:not([id^="auto"]):not([id^="suggestions"]):not([id^="analysis"]):not([id^="reasoning"]):not([id^="chart"])');
            dynamicSections.forEach(section => {
                if (section.id.includes('code') || section.id.includes('query') || section.id.includes('result')) {
                    section.remove();
                }
            });
            
            // Remove dynamically created code section if exists
            const codeSection = document.getElementById('codeSection');
            if (codeSection) {
                codeSection.remove();
            }
            
            // Clear any stored chart containers
            const chartContainers = document.querySelectorAll('[id*="Chart"], [id*="chart"]');
            chartContainers.forEach(container => {
                if (container.id !== 'chartSection' && container.id !== 'chartContainer') {
                    container.innerHTML = '';
                }
            });
            
            // Reset scroll position
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 400);
            
            // Show success message
            statusDiv.innerHTML = '<div class="status success" style="opacity: 0; animation: fadeIn 0.5s ease-out forwards;"><i data-lucide="check-circle"></i>Dataset cleared successfully. Upload a new file to begin analysis.</div>';
            
            setTimeout(() => {
                statusDiv.innerHTML = '';
            }, 3000);
            
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
                    statusDiv.innerHTML = '<div class="status success"><i data-lucide="check-circle"></i>AI analysis complete! Results generated successfully!</div>';
                    lucide.createIcons();
                    
                    // Store query in history for better UX
                    const queryData = {
                        query: promptInput.value,
                        timestamp: new Date().toISOString(),
                        result: result
                    };
                    queryHistory.push(queryData);
                    
                    // Handle NVIDIA agent workflow results
                    if (result.thinking || result.explanation) {
                        showNvidiaReasoning(result.thinking, result.explanation);
                    } else if (result.reasoning) {
                        // Fallback to traditional reasoning display
                        showReasoning(result.reasoning);
                    }
                    
                    // Show code if available
                    if (result.code) {
                        showGeneratedCode(result.code, result.shouldPlot);
                    }
                    
                    // Show execution result or chart
                    if (result.result) {
                        showExecutionResult(result.result);
                        if (result.result.type === 'plot') {
                            chartHistory.push({
                                title: result.result.description || 'Custom Chart',
                                query: promptInput.value,
                                timestamp: new Date().toISOString(),
                                chartSpec: result.result.chartSpec
                            });
                        }
                    } else if (result.chartSpec) {
                        showChart(result.chartSpec);
                        chartHistory.push({
                            title: 'Custom Visualization',
                            query: promptInput.value,
                            timestamp: new Date().toISOString(),
                            chartSpec: result.chartSpec
                        });
                    }
                    
                    // Show query history if multiple queries exist
                    if (queryHistory.length > 1) {
                        showQueryHistory();
                    }
                    
                    // Clear the input after successful query
                    promptInput.value = '';
                    
                    // Scroll to custom visualization section
                    setTimeout(() => {
                        const chartSection = document.getElementById('chartSection');
                        if (chartSection && chartSection.style.display !== 'none') {
                            chartSection.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'start' 
                            });
                        }
                    }, 500);
                    
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
                // Handle different chart title/description formats
                const title = chart.title || chart.metadata?.title || ('Chart ' + (index + 1));
                const description = chart.description || chart.metadata?.businessInsight || 'Data visualization';
                
                chartDiv.innerHTML = '<h3 class="chart-title">' + title + '</h3><p class="chart-description">' + description + '</p><div id="autoChart' + index + '" style="height: 400px;"></div>';
                autoChartsContainer.appendChild(chartDiv);
                
                // Render the chart with improved error handling
                setTimeout(() => {
                    try {
                        // Handle different chart structure formats
                        let chartData, chartLayout;
                        
                        if (chart.chartSpec && chart.chartSpec.data) {
                            // Traditional format: { chartSpec: { data: [...], layout: {...} } }
                            chartData = chart.chartSpec.data;
                            chartLayout = chart.chartSpec.layout;
                        } else if (chart.data) {
                            // Direct format: { data: [...], layout: {...} }
                            chartData = chart.data;
                            chartLayout = chart.layout;
                        } else {
                            throw new Error('Invalid chart structure - no data found');
                        }
                        
                        if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
                            throw new Error('Chart data is empty or invalid');
                        }
                        
                        Plotly.newPlot('autoChart' + index, chartData, {
                            ...(chartLayout || {}),
                            font: { family: 'Inter, sans-serif', size: 12, color: '#1e293b' },
                            plot_bgcolor: 'rgba(255, 255, 255, 0.8)',
                            paper_bgcolor: 'rgba(255, 255, 255, 0.8)'
                        }, {
                            responsive: true,
                            displayModeBar: true,
                            displaylogo: false,
                            modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
                        });
                        
                        console.log('\u2705 Auto chart ' + index + ' rendered successfully');
                    } catch (error) {
                        console.error('\u274C Auto chart rendering error:', error);
                        console.log('\u{1F41B} Chart object structure:', chart);
                        
                        const errorDetails = {
                            hasChartSpec: !!chart.chartSpec,
                            hasData: !!chart.data,
                            hasTitle: !!chart.title,
                            chartSpecKeys: chart.chartSpec ? Object.keys(chart.chartSpec) : 'none',
                            error: error.message
                        };
                        
                        document.getElementById('autoChart' + index).innerHTML = '<div style="text-align: center; color: var(--error-600); padding: 40px; background: var(--error-50); border-radius: 8px; border: 1px solid var(--error-200);"><i data-lucide="alert-circle" style="width: 2rem; height: 2rem; margin-bottom: 1rem;"></i><h4>Chart Rendering Failed</h4><p style="margin: 8px 0; font-size: 0.9rem;">' + error.message + '</p><details style="margin-top: 12px; font-size: 0.8rem; text-align: left;"><summary style="cursor: pointer; color: var(--primary-600);">Debug Info</summary><pre style="background: white; padding: 8px; border-radius: 4px; margin-top: 8px; overflow: auto;">' + JSON.stringify(errorDetails, null, 2) + '</pre></details></div>';
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

        // Display NVIDIA agent reasoning with thinking
        function showNvidiaReasoning(thinking, explanation) {
            const reasoningSection = document.getElementById('reasoningSection');
            const reasoningContent = document.getElementById('reasoningContent');
            
            let contentHtml = '<div class="reasoning-title"><i data-lucide="brain"></i>NVIDIA AI Agent Analysis</div>';
            contentHtml += '<div class="reasoning-content">';
            
            if (thinking) {
                contentHtml += '<details class="thinking" open>';
                contentHtml += '<summary style="font-weight: 600; margin-bottom: 0.5rem; color: var(--primary-600); cursor: pointer;">\u{1F914} Model Thinking Process</summary>';
                contentHtml += '<pre style="background: var(--gray-50); padding: 1rem; border-radius: 0.5rem; font-size: 0.85rem; color: var(--gray-700); white-space: pre-wrap; margin: 0.5rem 0;">' + thinking + '</pre>';
                contentHtml += '</details>';
            }
            
            if (explanation) {
                contentHtml += '<h4 style="font-weight: 600; margin: 1rem 0 0.5rem 0; color: var(--gray-800);">\u{1F9E0} Analysis Explanation</h4>';
                contentHtml += '<p style="margin-bottom: 1rem; line-height: 1.6; color: var(--gray-700);">' + explanation + '</p>';
            }
            
            contentHtml += '</div>';
            reasoningContent.innerHTML = contentHtml;
            reasoningSection.style.display = 'block';
            lucide.createIcons();
        }

        // Display generated Python code
        function showGeneratedCode(code, shouldPlot) {
            // Create or update code section
            let codeSection = document.getElementById('codeSection');
            if (!codeSection) {
                codeSection = document.createElement('div');
                codeSection.id = 'codeSection';
                codeSection.className = 'full-width';
                codeSection.innerHTML = '<div class="card fade-in"><div class="card-header"><i data-lucide="code" class="card-icon"></i><h2 class="card-title">Generated Python Code</h2></div><div id="codeContent"></div></div>';
                document.querySelector('.main-container').appendChild(codeSection);
            }
            
            const codeContent = document.getElementById('codeContent');
            let contentHtml = '<details class="code" open>';
            contentHtml += '<summary style="font-weight: 600; margin-bottom: 0.5rem; color: var(--primary-600); cursor: pointer;">\u{1F4DD} Python Code ' + (shouldPlot ? '(with visualization)' : '(data analysis)') + '</summary>';
            contentHtml += '<pre style="background: var(--gray-900); color: var(--gray-100); padding: 1rem; border-radius: 0.5rem; font-size: 0.85rem; overflow-x: auto; margin: 0.5rem 0;"><code class="language-python">' + code + '</code></pre>';
            contentHtml += '</details>';
            
            codeContent.innerHTML = contentHtml;
            codeSection.style.display = 'block';
            lucide.createIcons();
        }

        // Simplified markdown formatting for compatibility
        function formatMarkdownLikeText(text) {
            if (!text || typeof text !== 'string') return text;
            
            // Clean up the text first
            text = text.trim();
            
            // Simple formatting without complex regex
            let formatted = text;
            
            // Bold formatting
            formatted = formatted.replace(/**(.*?)**/g, '<strong>$1</strong>');
            formatted = formatted.replace(/*(.*?)*/g, '<em>$1</em>');
            
            // Simple line breaks
            formatted = formatted.replace(/

/g, '</p><p style="margin: 1rem 0; line-height: 1.6; color: var(--gray-700);">');
            formatted = formatted.replace(/
/g, '<br>');
            
            // Wrap in paragraph if needed
            if (!formatted.includes('<p>')) {
                formatted = '<p style="margin: 1rem 0; line-height: 1.6; color: var(--gray-700);">' + formatted + '</p>';
            }
            
            return formatted;
        }

        // Enhanced data result formatting with improved styling
        function formatDataResult(data) {
            if (typeof data === 'string') {
                // Enhanced string formatting with markdown support
                if (data.includes('**') || data.includes('*') || data.includes('#')) {
                    return formatMarkdownLikeText(data);
                }
                
                // Handle multi-line strings nicely
                if (data.includes('
')) {
                    return '<div style="background: var(--gray-50); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--primary-400); line-height: 1.6; color: var(--gray-700);">' + 
                           data.replace(/
/g, '<br>') + '</div>';
                }
                
                return '<p style="color: var(--gray-700); line-height: 1.6; margin: 0.5rem 0;">' + data + '</p>';
            }
            
            if (Array.isArray(data)) {
                if (data.length === 0) {
                    return '<div style="text-align: center; padding: 2rem; background: var(--gray-50); border-radius: 8px; color: var(--gray-500);"><i data-lucide="search-x" style="width: 2rem; height: 2rem; margin-bottom: 0.5rem;"></i><p>No data found matching the criteria.</p></div>';
                }
                
                // Enhanced list formatting for simple arrays
                if (data.every(item => typeof item === 'string' || typeof item === 'number')) {
                    const listItems = data.map((item, index) => 
                        '<li style="margin-bottom: 0.5rem; padding: 0.25rem 0; border-bottom: 1px solid var(--gray-100); color: var(--gray-700);">' + 
                        '<span style="color: var(--primary-600); font-weight: 500; margin-right: 0.5rem;">' + (index + 1) + '.</span>' + 
                        item + '</li>'
                    ).join('');
                    
                    return '<ul style="margin: 1rem 0; padding: 0; list-style: none; background: white; border-radius: 8px; border: 1px solid var(--gray-200); overflow: hidden;">' + 
                           listItems + '</ul>';
                }
                
                // Enhanced table format for complex arrays
                if (data.length > 0 && typeof data[0] === 'object') {
                    return formatArrayAsTable(data);
                }
                
                // Fallback to JSON with better styling
                return '<details style="margin: 1rem 0; background: white; border-radius: 8px; border: 1px solid var(--gray-200); overflow: hidden;">' +
                       '<summary style="padding: 1rem; background: var(--gray-50); cursor: pointer; font-weight: 600; color: var(--primary-700);">View Data Array (' + data.length + ' items)</summary>' +
                       '<pre style="padding: 1rem; margin: 0; font-size: 0.9rem; overflow-x: auto; white-space: pre-wrap; color: var(--gray-700);">' + 
                       JSON.stringify(data, null, 2) + '</pre></details>';
            }
            
            if (typeof data === 'object' && data !== null) {
                const keys = Object.keys(data);
                
                // Enhanced key-value display for simple objects
                if (keys.length <= 10 && keys.every(key => 
                    typeof data[key] === 'string' || typeof data[key] === 'number' || typeof data[key] === 'boolean'
                )) {
                    const keyValuePairs = keys.map(key => 
                        '<div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border-bottom: 1px solid var(--gray-100); last:border-bottom: none;">' +
                        '<span style="font-weight: 600; color: var(--primary-700);">' + key + ':</span>' +
                        '<span style="color: var(--gray-700); text-align: right;">' + data[key] + '</span>' +
                        '</div>'
                    ).join('');
                    
                    return '<div style="background: white; border-radius: 8px; border: 1px solid var(--gray-200); overflow: hidden; margin: 1rem 0;">' +
                           keyValuePairs + '</div>';
                }
                
                // Complex object with collapsible JSON
                return '<details style="margin: 1rem 0; background: white; border-radius: 8px; border: 1px solid var(--gray-200); overflow: hidden;">' +
                       '<summary style="padding: 1rem; background: var(--gray-50); cursor: pointer; font-weight: 600; color: var(--primary-700);">View Object Data</summary>' +
                       '<pre style="padding: 1rem; margin: 0; font-size: 0.9rem; overflow-x: auto; white-space: pre-wrap; color: var(--gray-700);">' + 
                       JSON.stringify(data, null, 2) + '</pre></details>';
            }
            
            return '<p style="color: var(--gray-700); line-height: 1.6; margin: 0.5rem 0;">' + String(data) + '</p>';
        }
        
        // Helper function to format arrays as tables
        function formatArrayAsTable(data) {
            if (!data || data.length === 0) return '<p>No data available</p>';
            
            const keys = Object.keys(data[0]);
            const maxRows = Math.min(data.length, 10); // Limit to 10 rows for performance
            
            let html = '<div style="overflow-x: auto; margin: 1rem 0; border-radius: 8px; border: 1px solid var(--gray-200); background: white;">';
            html += '<table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">';
            
            // Header
            html += '<thead><tr style="background: var(--primary-50); border-bottom: 2px solid var(--primary-200);">';
            keys.forEach(key => {
                html += '<th style="padding: 0.75rem; text-align: left; font-weight: 600; color: var(--primary-700); border-right: 1px solid var(--gray-200);">' + key + '</th>';
            });
            html += '</tr></thead>';
            
            // Body
            html += '<tbody>';
            for (let i = 0; i < maxRows; i++) {
                const row = data[i];
                html += '<tr style="border-bottom: 1px solid var(--gray-100); hover:background-color: var(--gray-50);">';
                keys.forEach(key => {
                    const value = row[key];
                    const displayValue = value !== null && value !== undefined ? String(value) : '-';
                    html += '<td style="padding: 0.75rem; border-right: 1px solid var(--gray-100); color: var(--gray-700);">' + displayValue + '</td>';
                });
                html += '</tr>';
            }
            html += '</tbody></table>';
            
            if (data.length > maxRows) {
                html += '<div style="padding: 0.75rem; background: var(--gray-50); text-align: center; color: var(--gray-600); font-size: 0.875rem; border-top: 1px solid var(--gray-200);">Showing first ' + maxRows + ' rows of ' + data.length + ' total rows</div>';
            }
            
            html += '</div>';
            return html;
        }

        // Display execution result
        function showExecutionResult(result) {
            const chartSection = document.getElementById('chartSection');
            const chartContainer = document.getElementById('chartContainer');
            
            if (result.type === 'plot' && result.chartSpec) {
                // For plot results with chart spec, render the actual Plotly chart
                try {
                    chartContainer.innerHTML = '<div id="nvidiaChart" style="height: 500px;"></div><div style="text-align: center; margin-top: 1rem; color: var(--gray-600); font-size: 0.875rem;"><i data-lucide="zap" style="width: 16px; height: 16px; margin-right: 4px;"></i>Generated from Python code \u2022 ' + (result.dataPoints || 0) + ' data points</div>';
                    
                    // Render the actual Plotly chart
                    Plotly.newPlot('nvidiaChart', result.chartSpec.data, {
                        ...result.chartSpec.layout,
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
                    
                    console.log('\u2705 NVIDIA chart rendered successfully');
                } catch (error) {
                    console.error('\u274C Error rendering NVIDIA chart:', error);
                    chartContainer.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--error-600); background: var(--error-50); border-radius: var(--radius-lg); border: 2px dashed var(--error-300);"><i data-lucide="alert-triangle" style="width: 3rem; height: 3rem; margin-bottom: 1rem;"></i><h3>Chart Rendering Error</h3><p>Failed to render the generated visualization</p><small style="color: var(--gray-600);">Error: ' + error.message + '</small></div>';
                }
            } else if (result.type === 'plot') {
                // For plot results without chart spec, show placeholder
                chartContainer.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--primary-600); background: var(--primary-50); border-radius: var(--radius-lg); border: 2px dashed var(--primary-300);"><i data-lucide="image" style="width: 3rem; height: 3rem; margin-bottom: 1rem;"></i><h3>Visualization Generated</h3><p>' + (result.description || 'Python matplotlib chart generated successfully') + '</p><small style="color: var(--gray-600);">Interactive visualization ready</small></div>';
            } else {
                // For data results, format them nicely
                const dataToShow = result.value || result.data || result;
                const formattedData = formatDataResult(dataToShow);
                
                chartContainer.innerHTML = '<div style="padding: 20px; background: var(--gray-50); border-radius: var(--radius-lg);"><h4 style="color: var(--gray-800); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;"><i data-lucide="table" style="width: 20px; height: 20px;"></i>Analysis Result</h4><div style="color: var(--gray-700); line-height: 1.6;">' + formattedData + '</div></div>';
            }
            
            chartSection.style.display = 'block';
            lucide.createIcons();
        }



        // Format statistics data nicely
        function formatStatistics(stats) {
            let html = '<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">';
            html += '<thead><tr style="background: var(--gray-100); border-bottom: 2px solid var(--gray-300);">';
            html += '<th style="padding: 8px; text-align: left; border: 1px solid var(--gray-300);">Column</th>';
            html += '<th style="padding: 8px; text-align: right; border: 1px solid var(--gray-300);">Count</th>';
            html += '<th style="padding: 8px; text-align: right; border: 1px solid var(--gray-300);">Mean</th>';
            html += '<th style="padding: 8px; text-align: right; border: 1px solid var(--gray-300);">Min</th>';
            html += '<th style="padding: 8px; text-align: right; border: 1px solid var(--gray-300);">Max</th>';
            html += '</tr></thead><tbody>';
            
            Object.entries(stats).forEach(([column, data]) => {
                html += '<tr style="border-bottom: 1px solid var(--gray-200);">';
                html += '<td style="padding: 8px; border: 1px solid var(--gray-300); font-weight: 500;">' + column + '</td>';
                html += '<td style="padding: 8px; text-align: right; border: 1px solid var(--gray-300);">' + (data.count || '-') + '</td>';
                html += '<td style="padding: 8px; text-align: right; border: 1px solid var(--gray-300);">' + (data.mean ? data.mean.toFixed(2) : '-') + '</td>';
                html += '<td style="padding: 8px; text-align: right; border: 1px solid var(--gray-300);">' + (data.min !== undefined ? data.min : '-') + '</td>';
                html += '<td style="padding: 8px; text-align: right; border: 1px solid var(--gray-300);">' + (data.max !== undefined ? data.max : '-') + '</td>';
                html += '</tr>';
            });
            
            html += '</tbody></table></div>';
            return html;
        }

        // Format table preview nicely
        function formatTablePreview(data) {
            if (!Array.isArray(data) || data.length === 0) return '<p>No preview data available</p>';
            
            const headers = Object.keys(data[0]);
            let html = '<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">';
            html += '<thead><tr style="background: var(--gray-100); border-bottom: 2px solid var(--gray-300);">';
            
            headers.forEach(header => {
                html += '<th style="padding: 8px; text-align: left; border: 1px solid var(--gray-300);">' + header + '</th>';
            });
            
            html += '</tr></thead><tbody>';
            
            data.slice(0, 5).forEach(row => {  // Show first 5 rows
                html += '<tr style="border-bottom: 1px solid var(--gray-200);">';
                headers.forEach(header => {
                    const value = row[header];
                    html += '<td style="padding: 8px; border: 1px solid var(--gray-300);">' + (value !== null && value !== undefined ? value : '-') + '</td>';
                });
                html += '</tr>';
            });
            
            html += '</tbody></table></div>';
            if (data.length > 5) {
                html += '<p style="margin-top: 0.5rem; color: var(--gray-600); font-size: 0.85em;">Showing first 5 rows of ' + data.length + ' total rows</p>';
            }
            return html;
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
                chartContainer.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--gray-500); background: var(--gray-50); border-radius: var(--radius-lg);"><i data-lucide="alert-circle" style="width: 2rem; height: 2rem; margin-bottom: 1rem;"></i><h3>Chart Rendering Failed</h3><p>The AI generated a chart specification, but it could not be rendered properly.</p><details style="margin-top: 20px; text-align: left;"><summary style="cursor: pointer; font-weight: 600; color: var(--primary-600);">View Raw Chart Specification</summary><pre style="background: white; padding: 15px; border-radius: 8px; overflow: auto; margin-top: 10px; font-size: 12px; border: 1px solid var(--gray-200);">' + JSON.stringify(chartSpec, null, 2) + '</pre></details></div>';
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
                contentHtml += '<div class="suggestion-card" onclick="setQuery('' + prompt.prompt.replace(/'/g, '&apos;') + '')"><div class="suggestion-title">' + prompt.prompt + '</div><div class="suggestion-description">' + prompt.description + '</div><span class="suggestion-category">' + prompt.category + '</span></div>';
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
        
        // Add query history display function
        function showQueryHistory() {
            let historySection = document.getElementById('queryHistorySection');
            
            if (!historySection) {
                historySection = document.createElement('div');
                historySection.id = 'queryHistorySection';
                historySection.className = 'full-width';
                historySection.innerHTML = '<div class="card fade-in"><div class="card-header"><i data-lucide="history" class="card-icon"></i><h2 class="card-title">Query History</h2></div><div id="queryHistoryContent"></div></div>';
                
                // Insert before the chart section
                const chartSection = document.getElementById('chartSection');
                const container = chartSection.parentNode;
                container.insertBefore(historySection, chartSection);
            }
            
            const historyContent = document.getElementById('queryHistoryContent');
            
            let historyHtml = '<div style="margin-bottom: 1rem; color: var(--gray-600); font-size: 0.9rem;">Your recent queries and results:</div>';
            
            queryHistory.slice(-5).reverse().forEach((item, index) => {
                const timeAgo = getTimeAgo(new Date(item.timestamp));
                const isLatest = index === 0;
                
                historyHtml += '<div style="' + (isLatest ? 'background: var(--primary-50); border: 2px solid var(--primary-200);' : 'background: white; border: 1px solid var(--gray-200);') + ' border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem; position: relative;">';
                
                if (isLatest) {
                    historyHtml += '<div style="position: absolute; top: -8px; right: 1rem; background: var(--primary-500); color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">Latest</div>';
                }
                
                historyHtml += '<div style="font-weight: 600; color: var(--gray-800); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">';
                historyHtml += '<i data-lucide="message-circle" style="width: 16px; height: 16px; color: var(--primary-600);"></i>';
                historyHtml += 'Query ' + (queryHistory.length - index);
                historyHtml += '<span style="margin-left: auto; font-size: 0.8rem; color: var(--gray-500); font-weight: 400;">' + timeAgo + '</span>';
                historyHtml += '</div>';
                
                historyHtml += '<div style="color: var(--gray-700); font-style: italic; margin-bottom: 0.75rem; padding: 0.5rem; background: var(--gray-50); border-radius: 4px; border-left: 3px solid var(--primary-400);">';
                historyHtml += '"' + item.query + '"';
                historyHtml += '</div>';
                
                if (item.result) {
                    if (item.result.result && item.result.result.type === 'plot') {
                        historyHtml += '<div style="color: var(--success-700); font-size: 0.9rem;"><i data-lucide="chart-bar" style="width: 14px; height: 14px; margin-right: 0.25rem;"></i>Generated interactive chart</div>';
                    } else if (item.result.chartSpec) {
                        historyHtml += '<div style="color: var(--success-700); font-size: 0.9rem;"><i data-lucide="chart-line" style="width: 14px; height: 14px; margin-right: 0.25rem;"></i>Generated custom visualization</div>';
                    } else {
                        historyHtml += '<div style="color: var(--info-700); font-size: 0.9rem;"><i data-lucide="table" style="width: 14px; height: 14px; margin-right: 0.25rem;"></i>Returned data analysis</div>';
                    }
                }
                
                historyHtml += '</div>';
            });
            
            if (queryHistory.length > 5) {
                historyHtml += '<div style="text-align: center; color: var(--gray-500); font-size: 0.875rem; margin-top: 1rem;">Showing 5 most recent queries out of ' + queryHistory.length + ' total</div>';
            }
            
            historyContent.innerHTML = historyHtml;
            historySection.style.display = 'block';
            lucide.createIcons();
        }
        
        // Helper function to format time ago
        function getTimeAgo(date) {
            const now = new Date();
            const diffMs = now - date;
            const diffSecs = Math.floor(diffMs / 1000);
            const diffMins = Math.floor(diffSecs / 60);
            const diffHours = Math.floor(diffMins / 60);
            
            if (diffSecs < 60) return 'Just now';
            if (diffMins < 60) return diffMins + 'm ago';
            if (diffHours < 24) return diffHours + 'h ago';
            return Math.floor(diffHours / 24) + 'd ago';
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
