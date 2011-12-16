var ba = void 0, ca = !0, da = null, ea = !1;

function ia() {
  return (function() {});
}

function na(c) {
  return (function() {
    return c;
  });
}

var qa = [], ra = "object" === typeof process, sa = "object" === typeof window, ta = "function" === typeof importScripts, wa = !sa && !ra && !ta;

if (ra) {
  print = (function(c) {
    process.stdout.write(c + "\n");
  });
  printErr = (function(c) {
    process.stderr.write(c + "\n");
  });
  var xa = require("fs");
  read = (function(c) {
    var f = xa.readFileSync(c).toString();
    !f && "/" != c[0] && (c = __dirname.split("/").slice(0, -1).join("/") + "/src/" + c, f = xa.readFileSync(c).toString());
    return f;
  });
  qa = process.argv.slice(2);
} else if (wa) this.read || (read = (function(c) {
  snarf(c);
})), qa = this.arguments ? arguments : scriptArgs; else if (sa) printErr = (function(c) {
  console.log(c);
}), read = (function(c) {
  var f = new XMLHttpRequest;
  f.open("GET", c, ea);
  f.send(da);
  return f.responseText;
}), this.arguments && (qa = arguments); else if (ta) load = importScripts; else throw "Unknown runtime environment. Where are we?";

function Ca(c) {
  eval.call(da, c);
}

"undefined" == typeof load && "undefined" != typeof read && (load = (function(c) {
  Ca(read(c));
}));

"undefined" === typeof printErr && (printErr = ia());

"undefined" === typeof print && (print = printErr);

try {
  this.Module = Module;
} catch (Ha) {
  this.Module = Module = {};
}

if (!Module.arguments) Module.arguments = qa;

var Ma = {
  W: (function() {
    return a;
  }),
  V: (function(c) {
    a = c;
  }),
  aa: (function(c, f) {
    f = f || 1;
    return isNumber(c) && isNumber(f) ? Math.ceil(c / f) * f : "Math.ceil((" + c + ")/" + f + ")*" + f;
  }),
  O: (function(c) {
    return c in Ma.H || c in Ma.G;
  }),
  P: (function(c) {
    return "*" == c[c.length - 1];
  }),
  R: (function(c) {
    return isPointerType(c) ? ea : /^\[\d+\ x\ (.*)\]/.test(c) || /<?{ [^}]* }>?/.test(c) ? ca : "%" == c[0];
  }),
  H: {
    i1: 0,
    i8: 0,
    i16: 0,
    i32: 0,
    i64: 0
  },
  G: {
    "float": 0,
    "double": 0
  },
  da: (function(c, f) {
    return (c | 0 | f | 0) + 4294967296 * (Math.round(c / 4294967296) | Math.round(f / 4294967296));
  }),
  $: (function(c, f) {
    return ((c | 0) & (f | 0)) + 4294967296 * (Math.round(c / 4294967296) & Math.round(f / 4294967296));
  }),
  ia: (function(c, f) {
    return ((c | 0) ^ (f | 0)) + 4294967296 * (Math.round(c / 4294967296) ^ Math.round(f / 4294967296));
  }),
  o: (function(c) {
    if (1 == Ma.e) return 1;
    var f = {
      "%i1": 1,
      "%i8": 1,
      "%i16": 2,
      "%i32": 4,
      "%i64": 8,
      "%float": 4,
      "%double": 8
    }["%" + c];
    if (!f && "*" == c[c.length - 1]) f = Ma.e;
    return f;
  }),
  M: (function(c) {
    return Math.max(Ma.o(c), Ma.e);
  }),
  J: (function(c, f) {
    var d = {};
    return f ? c.filter((function(c) {
      return d[c[f]] ? ea : d[c[f]] = ca;
    })) : c.filter((function(c) {
      return d[c] ? ea : d[c] = ca;
    }));
  }),
  set: (function() {
    for (var c = "object" === typeof arguments[0] ? arguments[0] : arguments, f = {}, d = 0; d < c.length; d++) f[c[d]] = 0;
    return f;
  }),
  q: (function(c) {
    c.b = 0;
    c.f = 0;
    var f = [], d = -1;
    c.t = c.g.map((function(e) {
      var g;
      if (Ma.O(e) || Ma.P(e)) e = g = Ma.o(e); else if (Ma.R(e)) g = Types.types[e].b, e = Types.types[e].f; else throw "Unclear type in struct: " + e + ", in " + c.S + " :: " + dump(Types.types[c.S]);
      e = c.ea ? 1 : Math.min(e, Ma.e);
      c.f = Math.max(c.f, e);
      e = Ma.p(c.b, e);
      c.b = e + g;
      0 <= d && f.push(e - d);
      return d = e;
    }));
    c.b = Ma.p(c.b, c.f);
    if (0 == f.length) c.s = c.b; else if (1 == Ma.J(f).length) c.s = f[0];
    c.ca = 1 != c.s;
    return c.t;
  }),
  L: (function(c, f, d) {
    var e, g;
    if (f) {
      d = d || 0;
      e = ("undefined" === typeof Types ? Ma.ha : Types.types)[f];
      if (!e) return da;
      c || (c = ("undefined" === typeof Types ? Ma : Types).fa[f.replace(/.*\./, "")]);
      if (!c) return da;
      e.g.length === c.length || Qa("Assertion failed: " + ("Number of named fields must match the type for " + f + ". Perhaps due to inheritance, which is not supported yet?"));
      g = e.t;
    } else e = {
      g: c.map((function(c) {
        return c[0];
      }))
    }, g = Ma.q(e);
    var i = {
      Z: e.b
    };
    f ? c.forEach((function(c, f) {
      if ("string" === typeof c) i[c] = g[f] + d; else {
        var k, l;
        for (l in c) k = l;
        i[k] = Ma.L(c[k], e.g[f], g[f]);
      }
    })) : c.forEach((function(c, d) {
      i[c[1]] = g[d];
    }));
    return i;
  }),
  U: (function(c) {
    var f = a;
    a += c;
    return f;
  }),
  D: (function(c) {
    var f = Ra;
    Ra += c;
    if (Ra >= Sa) {
      for (; Sa <= Ra; ) Sa = Math.ceil(1.25 * Sa / Ta) * Ta;
      c = b;
      Va = b = new Int32Array(Sa);
      b.set(c);
      Za = new Uint32Array(b.buffer);
      c = o;
      o = new Float64Array(Sa);
      o.set(c);
    }
    return f;
  }),
  p: (function(c, f) {
    return Math.ceil(c / (f ? f : 1)) * (f ? f : 1);
  }),
  e: 1,
  Y: 0
};

function $a() {
  var c = [], f;
  for (f in this.j) c.push({
    T: f,
    K: this.j[f][0],
    ga: this.j[f][1],
    total: this.j[f][0] + this.j[f][1]
  });
  c.sort((function(c, d) {
    return d.total - c.total;
  }));
  for (f = 0; f < c.length; f++) {
    var d = c[f];
    print(d.T + " : " + d.total + " hits, %" + Math.ceil(100 * d.K / d.total) + " failures");
  }
}

function ab() {}

var bb = [];

function Qa(c) {
  print(c + ":\n" + Error().stack);
  throw "Assertion: " + c;
}

function cb(c, f, d) {
  d = d || "i8";
  "*" === d[d.length - 1] && (d = "i32");
  switch (d) {
   case "i1":
    b[c] = f;
    break;
   case "i8":
    b[c] = f;
    break;
   case "i16":
    b[c] = f;
    break;
   case "i32":
    b[c] = f;
    break;
   case "i64":
    b[c] = f;
    break;
   case "float":
    o[c] = f;
    break;
   case "double":
    o[c] = f;
    break;
   default:
    Qa("invalid type for setValue: " + d);
  }
}

Module.setValue = cb;

Module.getValue = (function(c, f) {
  f = f || "i8";
  "*" === f[f.length - 1] && (f = "i32");
  switch (f) {
   case "i1":
    return b[c];
   case "i8":
    return b[c];
   case "i16":
    return b[c];
   case "i32":
    return b[c];
   case "i64":
    return b[c];
   case "float":
    return o[c];
   case "double":
    return o[c];
   default:
    Qa("invalid type for setValue: " + f);
  }
  return da;
});

var r = 1, t = 2;

Module.ALLOC_NORMAL = 0;

Module.ALLOC_STACK = r;

Module.ALLOC_STATIC = t;

function A(c, f, d) {
  var e, g;
  "number" === typeof c ? (e = ca, g = c) : (e = ea, g = c.length);
  for (var d = [ db, Ma.U, Ma.D ][d === ba ? t : d](Math.max(g, 1)), i = "string" === typeof f ? f : da, h = 0, j; h < g; ) {
    var k = e ? 0 : c[h];
    "function" === typeof k && (k = Ma.ba(k));
    j = i || f[h];
    0 === j ? h++ : (cb(d + h, k, j), h += Ma.o(j));
  }
  return d;
}

Module.allocate = A;

function lb(c) {
  for (var f = "", d = 0, e, g = String.fromCharCode(0); ; ) {
    e = String.fromCharCode(Za[c + d]);
    if (e == g) break;
    f += e;
    d += 1;
  }
  return f;
}

Module.Pointer_stringify = lb;

Module.Array_stringify = (function(c) {
  for (var f = "", d = 0; d < c.length; d++) f += String.fromCharCode(c[d]);
  return f;
});

var mb, Ta = 4096, Va, b, Za, o, a, nb, Ra, Sa = Module.TOTAL_MEMORY || 15e7;

Int32Array && Float64Array && (new Int32Array(1)).subarray && (new Int32Array(1)).set || Qa("Assertion failed: Cannot fallback to non-typed array case: Code is too specialized");

Va = b = new Int32Array(Sa);

Za = new Uint32Array(b.buffer);

o = new Float64Array(Sa);

for (var ub = ob("(null)"), vb = 0; vb < ub.length; vb++) b[vb] = ub[vb];

Module.HEAP = Va;

Module.IHEAP = b;

Module.FHEAP = o;

nb = (a = Math.ceil(10 / Ta) * Ta) + 1048576;

Ra = Math.ceil(nb / Ta) * Ta;

function wb(c, f) {
  return Array.prototype.slice.call(b.subarray(c, c + f));
}

Module.Array_copy = wb;

function zb(c) {
  for (var f = 0; b[c + f]; ) f++;
  return f;
}

Module.String_len = zb;

function Fb(c, f) {
  var d = zb(c);
  f && d++;
  var e = wb(c, d);
  f && (e[d - 1] = 0);
  return e;
}

Module.String_copy = Fb;

function ob(c, f) {
  for (var d = [], e = 0; e < c.length; ) {
    var g = c.charCodeAt(e);
    255 < g && (g &= 255);
    d.push(g);
    e += 1;
  }
  f || d.push(0);
  return d;
}

Module.intArrayFromString = ob;

Module.intArrayToString = (function(c) {
  for (var f = [], d = 0; d < c.length; d++) {
    var e = c[d];
    255 < e && (e &= 255);
    f.push(String.fromCharCode(e));
  }
  return f.join("");
});

function Gb(c, f) {
  return 0 <= c ? c : 32 >= f ? 2 * Math.abs(1 << f - 1) + c : Math.pow(2, f) + c;
}

function Hb(c, f) {
  if (0 >= c) return c;
  var d = 32 >= f ? Math.abs(1 << f - 1) : Math.pow(2, f - 1);
  if (c >= d && (32 >= f || c > d)) c = -2 * d + c;
  return c;
}

function Lb(c) {
  var f, d;
  f = c != c ? 1 : 2;
  if (1 == f) d = 0; else if (2 == f) {
    if (-Infinity < c) f = 3; else {
      var e = 0;
      f = 4;
    }
    3 == f && (e = Infinity > c);
    d = e;
  }
  return d;
}

function Mb(c, f, d) {
  var e;
  if (1 == (0 == d ? 8 : 1)) {
    if (0 < d) {
      var g = d;
      e = 3;
    } else e = 2;
    2 == e && (C(Nb, 164, Ub, Vb), g = d);
    e = 640 < g ? 4 : 5;
    4 != e && 5 == e && (d = b[bc + d], 6 == (0 <= d & 14 > d ? 7 : 6) && C(Nb, 173, Ub, cc), b[f] = b[d + (c + 3)], b[d + (c + 3)] = f);
  }
}

Mb.X = 1;

function dc(c) {
  o[c] = 0;
  o[c + 1] = 0;
}

function ec(c) {
  var f, d;
  b[c + 2] = 128;
  b[c + 1] = 0;
  d = db(b[c + 2] << 3);
  b[c] = d;
  f = b[c];
  var e = b[c + 2] << 3;
  for (d = 0; d < 2 * (e / 8); d++) b[f + d] = 0, o[f + d] = 0;
  c += 3;
  for (d = 0; 14 > d; d++) b[c + d] = 0, o[c + d] = 0;
  f = 0 == (b[mc] & 1) ? 1 : 10;
  if (1 == f) {
    c = 0;
    d = 1;
    for (f = 0; ; ) {
      f = 14 > f ? 5 : 4;
      4 == f && C(Nb, 73, nc, oc);
      f = d <= b[pc + c] ? 6 : 7;
      6 == f ? b[bc + d] = c & 255 : 7 == f && (c += 1, b[bc + d] = c & 255);
      d = f = d + 1;
      if (!(640 >= f)) break;
      f = c;
    }
    b[mc] = 1;
  }
}

ec.X = 1;

function qc(c, f) {
  var d, e, g, i, h, j, k, l, m;
  d = 0 == f ? 1 : 2;
  if (1 == d) e = 0; else if (2 == d) if (0 < f ? (g = f, d = 4) : d = 3, 3 == d && (C(Nb, 104, rc, Vb), g = f), d = 640 < g ? 5 : 6, 5 == d) e = db(f); else if (6 == d) if (g = b[bc + f], 7 == (0 <= g & 14 > g ? 8 : 7) && C(Nb, 112, rc, cc), d = 0 != b[g + (c + 3)] ? 9 : 10, 9 == d) i = b[g + (c + 3)], b[g + (c + 3)] = b[i], e = i; else if (10 == d) {
    d = b[c + 1] == b[c + 2] ? 11 : 12;
    if (11 == d) {
      e = b[c];
      b[c + 2] += 128;
      d = db(b[c + 2] << 3);
      b[c] = d;
      d = e;
      e += 2 * ((b[c + 1] << 3) / 8);
      for (h = b[c]; d < e; d++, h++) b[h] = b[d], o[h] = o[d];
      d = b[c] + (b[c + 1] << 1);
      for (e = 0; 256 > e; e++) b[d + e] = 0, o[d + e] = 0;
    }
    e = b[c] + (b[c + 1] << 1);
    d = db(16384);
    b[e + 1] = d;
    h = b[pc + g];
    b[e] = h;
    j = 16384 / h | 0;
    13 == (16384 >= h * j ? 14 : 13) && C(Nb, 140, rc, sc);
    k = 0;
    d = b[e + 1];
    if (k < j - 1) l = d, m = h, d = 15; else {
      i = d;
      var n = h;
      d = 16;
    }
    a : do if (15 == d) for (;;) if (l += k * m, m = b[e + 1] + (k + 1) * h, b[l] = m, k += 1, k < j - 1) l = b[e + 1], m = h; else {
      i = b[e + 1];
      n = h;
      break a;
    } while (0);
    b[i + (j - 1) * n] = 0;
    b[g + (c + 3)] = b[b[e + 1]];
    b[c + 1] += 1;
    e = b[e + 1];
  }
  return e;
}

qc.X = 1;

function vc(c, f, d) {
  var e;
  e = wc(f + 1) ? 2 : 1;
  1 == e && C(xc, 27, yc, zc);
  e = wc(f + 4) ? 4 : 3;
  3 == e && C(xc, 28, yc, Ac);
  e = Lb(o[f + 3]) ? 6 : 5;
  5 == e && C(xc, 29, yc, Ic);
  e = Lb(o[f + 6]) ? 8 : 7;
  7 == e && C(xc, 30, yc, Jc);
  e = Lb(o[f + 8]) ? 9 : 10;
  9 == e && (e = 0 <= o[f + 8] ? 11 : 10);
  10 == e && C(xc, 31, yc, Kc);
  e = Lb(o[f + 7]) ? 12 : 13;
  12 == e && (e = 0 <= o[f + 7] ? 14 : 13);
  13 == e && C(xc, 32, yc, Lc);
  b[c + 1] = 0;
  e = b[f + 12] & 1 ? 15 : 16;
  15 == e && (b[c + 1] = (b[c + 1] | 8) & 65535);
  e = b[f + 11] & 1 ? 17 : 18;
  17 == e && (b[c + 1] = (b[c + 1] | 16) & 65535);
  e = b[f + 9] & 1 ? 19 : 20;
  19 == e && (b[c + 1] = (b[c + 1] | 4) & 65535);
  e = b[f + 10] & 1 ? 21 : 22;
  21 == e && (b[c + 1] = (b[c + 1] | 2) & 65535);
  e = b[f + 13] & 1 ? 23 : 24;
  23 == e && (b[c + 1] = (b[c + 1] | 32) & 65535);
  b[c + 22] = d;
  d = c + 3;
  e = f + 1;
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  Mc(c + 5, o[f + 3]);
  dc(c + 7);
  d = c + 9;
  e = c + 3;
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  d = c + 11;
  e = c + 3;
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  o[c + 13] = o[f + 3];
  o[c + 14] = o[f + 3];
  o[c + 15] = 0;
  b[c + 27] = 0;
  b[c + 28] = 0;
  b[c + 23] = 0;
  b[c + 24] = 0;
  d = c + 16;
  e = f + 4;
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  o[c + 18] = o[f + 6];
  o[c + 33] = o[f + 7];
  o[c + 34] = o[f + 8];
  o[c + 35] = o[f + 15];
  dc(c + 19);
  o[c + 21] = 0;
  o[c + 36] = 0;
  b[c] = b[f];
  e = 2 == b[c] ? 25 : 26;
  25 == e ? (o[c + 29] = 1, o[c + 30] = 1) : 26 == e && (o[c + 29] = 0, o[c + 30] = 0);
  o[c + 31] = 0;
  o[c + 32] = 0;
  b[c + 37] = b[f + 14];
  b[c + 25] = 0;
  b[c + 26] = 0;
}

vc.X = 1;

function wc(c) {
  var f;
  if (Lb(o[c])) f = 1; else {
    var d = 0;
    f = 2;
  }
  1 == f && (d = Lb(o[c + 1]));
  return d;
}

function Mc(c, f) {
  var d = Nc(f);
  o[c] = d;
  d = Oc(f);
  o[c + 1] = d;
}

function Pc(c) {
  return 2 == (b[c + 102517] & 2);
}

function Qc(c) {
  var f = a;
  a += 8;
  var d;
  d = f + 4;
  var e = f + 6, g;
  Mc(f + 2, o[c + 13]);
  g = c + 9;
  J(e, f + 2, c + 7);
  K(d, g, e);
  b[f] = b[d];
  o[f] = o[d];
  b[f + 1] = b[d + 1];
  o[f + 1] = o[d + 1];
  e = b[c + 22] + 102518;
  g = b[c + 25];
  d = 0 != b[c + 25] ? 1 : 3;
  a : do if (1 == d) for (var i = c + 3; ; ) {
    Rc(g, e, f, i);
    var h = b[g + 1];
    g = h;
    if (0 == h) break a;
  } while (0);
  a = f;
}

function Vc(c, f) {
  var d, e = c + 1, g = b[e];
  d = f & 1 ? 1 : 3;
  1 == d ? 0 == (g & 2) && (b[c + 1] = (b[c + 1] | 2) & 65535, o[c + 36] = 0) : 3 == d && (b[e] = g & 65533, o[c + 36] = 0, dc(c + 16), o[c + 18] = 0, dc(c + 19), o[c + 21] = 0);
}

function Wc(c, f) {
  o[c] += o[f];
  o[c + 1] += o[f + 1];
}

function N(c, f, d) {
  Xc(c, f * o[d], f * o[d + 1]);
}

function Yc(c, f) {
  o[c] *= f;
  o[c + 1] *= f;
}

function O(c, f) {
  return o[c] * o[f] + o[c + 1] * o[f + 1];
}

function Zc(c, f, d) {
  Xc(c, o[f + 3] * o[d] - o[f + 2] * o[d + 1] + o[f], o[f + 2] * o[d] + o[f + 3] * o[d + 1] + o[f + 1]);
}

Zc.X = 1;

function $c(c, f, d) {
  Xc(c, -f * o[d + 1], f * o[d]);
}

function ad(c) {
  var f = a;
  a += 16;
  var d, e, g = f + 2, i = f + 6, h = f + 8, j = f + 10, k = f + 12, l = f + 14;
  o[c + 29] = 0;
  o[c + 30] = 0;
  o[c + 31] = 0;
  o[c + 32] = 0;
  dc(c + 7);
  d = 0 == b[c] ? 2 : 1;
  do if (1 == d) if (1 == b[c]) d = 2; else {
    d = 2 == b[c] ? 5 : 4;
    4 == d && C(xc, 284, bd, cd);
    d = f;
    b[d] = b[dd];
    o[d] = o[dd];
    b[d + 1] = b[dd + 1];
    o[d + 1] = o[dd + 1];
    e = b[c + 25];
    d = 0 != b[c + 25] ? 6 : 10;
    a : do if (6 == d) for (var m = g, n = c + 29, p = g, u = g + 1, s = g + 3, q = c + 31; ; ) {
      d = 0 == o[e] ? 9 : 8;
      if (8 == d) {
        var v = b[e + 3];
        mb[b[b[v] + 7]](v, g, o[e]);
        o[n] += o[m];
        N(i, o[p], u);
        Wc(f, i);
        o[q] += o[s];
      }
      e = v = b[e + 1];
      if (0 == v) break a;
    } while (0);
    e = c + 29;
    d = 0 < o[c + 29] ? 11 : 12;
    11 == d ? (o[c + 30] = 1 / o[e], Yc(f, o[c + 30])) : 12 == d && (o[e] = 1, o[c + 30] = 1);
    d = 0 < o[c + 31] ? 14 : 18;
    14 == d && (0 != (b[c + 1] & 16) ? d = 18 : (o[c + 31] -= o[c + 29] * O(f, f), d = 0 < o[c + 31] ? 17 : 16, 16 == d && C(xc, 319, bd, ed), o[c + 32] = 1 / o[c + 31], d = 19));
    18 == d && (o[c + 31] = 0, o[c + 32] = 0);
    d = h;
    e = c + 11;
    b[d] = b[e];
    o[d] = o[e];
    b[d + 1] = b[e + 1];
    o[d + 1] = o[e + 1];
    d = c + 7;
    e = f;
    b[d] = b[e];
    o[d] = o[e];
    b[d + 1] = b[e + 1];
    o[d + 1] = o[e + 1];
    d = c + 9;
    e = c + 11;
    Zc(j, c + 3, c + 7);
    m = e;
    e = j;
    b[m] = b[e];
    o[m] = o[e];
    b[m + 1] = b[e + 1];
    o[m + 1] = o[e + 1];
    m = db(2);
    Pd(m, e);
    Pd(d, m);
    d = c + 16;
    e = o[c + 18];
    K(l, c + 11, h);
    $c(k, e, l);
    Wc(d, k);
    d = 20;
  } while (0);
  2 == d && (g = c + 9, i = c + 3, b[g] = b[i], o[g] = o[i], b[g + 1] = b[i + 1], o[g + 1] = o[i + 1], g = c + 11, i = c + 3, b[g] = b[i], o[g] = o[i], b[g + 1] = b[i + 1], o[g + 1] = o[i + 1], o[c + 13] = o[c + 14]);
  a = f;
}

ad.X = 1;

function Qd(c, f) {
  var d, e, g, i;
  d = 0 == Pc(b[c + 22]) ? 2 : 1;
  1 == d && C(xc, 153, Rd, Sd);
  d = 1 == Pc(b[c + 22]) ? 3 : 4;
  3 == d ? e = 0 : 4 == d && (e = b[c + 22], g = qc(e, 44), 0 == g ? (i = 0, d = 6) : d = 5, 5 == d && (Td(g), i = g), Ud(i, e, c, f), d = 0 != (b[c + 1] & 32) ? 7 : 8, 7 == d && (d = b[c + 22] + 102518, Vd(i, d, c + 3)), b[i + 1] = b[c + 25], b[c + 25] = i, b[c + 26] += 1, b[i + 2] = c, d = 0 < o[i] ? 9 : 10, 9 == d && ad(c), d = b[c + 22] + 102517, b[d] |= 1, e = i);
  return e;
}

Qd.X = 1;

function Wd(c, f, d) {
  var e = a;
  a += 9;
  Xd(e + 6);
  b[e] = 0;
  b[e + 1] = 0;
  o[e + 2] = .20000000298023224;
  o[e + 3] = 0;
  o[e + 4] = 0;
  b[e + 5] = 0;
  b[e] = f;
  o[e + 4] = d;
  Qd(c, e);
  a = e;
}

function K(c, f, d) {
  Xc(c, o[f] - o[d], o[f + 1] - o[d + 1]);
}

function Yd(c, f) {
  var d, e, g;
  d = 2 != b[c] ? 1 : 3;
  1 == d && (2 == b[f] ? d = 3 : (e = 0, d = 10));
  if (3 == d) {
    g = b[c + 27];
    var i = b[c + 27];
    a : for (;;) {
      if (0 == i) {
        d = 9;
        break;
      }
      d = b[g] == f ? 6 : 8;
      if (6 == d && 0 == (b[b[g + 1] + 16] & 1)) {
        d = 7;
        break a;
      }
      g = i = b[g + 3];
    }
    9 == d ? e = 1 : 7 == d && (e = 0);
  }
  return e;
}

Yd.X = 1;

function J(c, f, d) {
  Xc(c, o[f + 1] * o[d] - o[f] * o[d + 1], o[f] * o[d] + o[f + 1] * o[d + 1]);
}

function Xc(c, f, d) {
  o[c] = f;
  o[c + 1] = d;
}

function Xd(c) {
  b[c] = 1;
  b[c + 1] = -1;
  b[c + 2] = 0;
}

function Zd(c) {
  $d(c);
  b[c + 7] = 0;
  b[c + 12] = 16;
  b[c + 13] = 0;
  var f = db(12 * b[c + 12]);
  b[c + 11] = f;
  b[c + 9] = 16;
  b[c + 10] = 0;
  f = db(b[c + 9] << 2);
  b[c + 8] = f;
}

function ie(c, f) {
  var d;
  if (1 == (b[c + 10] == b[c + 9] ? 1 : 2)) {
    d = b[c + 8];
    b[c + 9] <<= 1;
    var e = db(b[c + 9] << 2);
    b[c + 8] = e;
    e = d;
    d += 1 * ((b[c + 10] << 2) / 4);
    for (var g = b[c + 8]; e < d; e++, g++) b[g] = b[e], o[g] = o[e];
  }
  b[b[c + 8] + b[c + 10]] = f;
  b[c + 10] += 1;
}

ie.X = 1;

function je(c) {
  return b[c + 3];
}

function ke(c) {
  b[c] = le + 2;
  b[c] = me + 2;
  b[c + 1] = 1;
  o[c + 2] = .009999999776482582;
  o[c + 7] = 0;
  o[c + 8] = 0;
  o[c + 9] = 0;
  o[c + 10] = 0;
  b[c + 11] = 0;
  b[c + 12] = 0;
}

function ne(c) {
  b[c] = oe + 2;
  b[c + 3] = 0;
  b[c + 4] = 0;
}

function pe(c, f) {
  var d, e;
  d = f == b[c + 14] ? 1 : 2;
  if (1 == d) e = 1; else if (2 == d) {
    d = b[c + 13] == b[c + 12] ? 3 : 4;
    if (3 == d) {
      e = b[c + 11];
      b[c + 12] <<= 1;
      d = db(12 * b[c + 12]);
      b[c + 11] = d;
      d = e;
      e += 3 * (12 * b[c + 13] / 12);
      for (var g = b[c + 11]; d < e; d++, g++) b[g] = b[d], o[g] = o[d];
    }
    b[b[c + 11] + 3 * b[c + 13]] = f < b[c + 14] ? f : b[c + 14];
    b[b[c + 11] + 3 * b[c + 13] + 1] = f > b[c + 14] ? f : b[c + 14];
    b[c + 13] += 1;
    e = 1;
  }
  return e;
}

pe.X = 1;

function qe(c, f, d, e, g) {
  re(c, f, d, e, g);
  b[c] = se + 2;
  f = 3 == te(b[c + 12]) ? 2 : 1;
  1 == f && C(ue, 43, ve, we);
  f = 0 == te(b[c + 13]) ? 4 : 3;
  3 == f && C(ue, 44, ve, xe);
}

qe.X = 1;

function te(c) {
  return b[b[c + 3] + 1];
}

function ye(c, f, d, e, g) {
  re(c, f, d, e, g);
  b[c] = ze + 2;
  f = 3 == te(b[c + 12]) ? 2 : 1;
  1 == f && C(Ae, 43, Be, we);
  f = 2 == te(b[c + 13]) ? 4 : 3;
  3 == f && C(Ae, 44, Be, Ce);
}

ye.X = 1;

function De(c, f) {
  var d, e;
  e = qc(f, 40);
  if (0 == e) {
    var g = 0;
    d = 2;
  } else d = 1;
  1 == d && (b[e] = le + 2, b[e] = oe + 2, b[e + 1] = 3, o[e + 2] = .009999999776482582, b[e + 3] = 0, b[e + 4] = 0, b[e + 9] = 0, b[e + 10] = 0, g = e);
  d = g;
  e = b[c + 3];
  var g = b[c + 4], i;
  i = 0 == b[d + 3] ? 1 : 2;
  1 == i && (i = 0 == b[d + 4] ? 3 : 2);
  2 == i && C(Ee, 48, Fe, Ge);
  4 == (2 <= g ? 5 : 4) && C(Ee, 49, Fe, He);
  b[d + 4] = g;
  g = db(g << 3);
  b[d + 3] = g;
  g = e;
  e += 2 * ((b[d + 4] << 3) / 8);
  for (i = b[d + 3]; g < e; g++, i++) b[i] = b[g], o[i] = o[g];
  b[d + 9] = 0;
  b[d + 10] = 0;
  e = d + 5;
  g = c + 5;
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  e = d + 7;
  g = c + 7;
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  b[d + 9] = b[c + 9] & 1;
  b[d + 10] = b[c + 10] & 1;
  return d;
}

De.X = 1;

function Ie(c, f, d) {
  var e;
  e = 0 <= d ? 1 : 2;
  1 == e && (e = d < b[c + 4] - 1 ? 3 : 2);
  2 == e && C(Ee, 89, Je, Ke);
  b[f + 1] = 1;
  o[f + 2] = o[c + 2];
  e = f + 3;
  var g = b[c + 3] + (d << 1);
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  e = f + 5;
  g = b[c + 3] + (d + 1 << 1);
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  e = 0 < d ? 4 : 5;
  4 == e ? (e = f + 7, g = b[c + 3] + (d - 1 << 1), b[e] = b[g], o[e] = o[g], b[e + 1] = b[g + 1], o[e + 1] = o[g + 1], b[f + 11] = 1) : 5 == e && (e = f + 7, g = c + 5, b[e] = b[g], o[e] = o[g], b[e + 1] = b[g + 1], o[e + 1] = o[g + 1], b[f + 11] = b[c + 9] & 1);
  e = d < b[c + 4] - 2 ? 7 : 8;
  7 == e ? (e = f + 9, c = b[c + 3] + (d + 2 << 1), b[e] = b[c], o[e] = o[c], b[e + 1] = b[c + 1], o[e + 1] = o[c + 1], b[f + 12] = 1) : 8 == e && (d = f + 9, e = c + 7, b[d] = b[e], o[d] = o[e], b[d + 1] = b[e + 1], o[d + 1] = o[e + 1], b[f + 12] = b[c + 10] & 1);
}

Ie.X = 1;

function Le(c, f, d, e) {
  var g = a;
  a += 8;
  var i, h, j = g + 2, k = g + 4, l = g + 6;
  i = e < b[c + 4] ? 2 : 1;
  1 == i && C(Ee, 148, Me, Ne);
  h = e + 1;
  i = h == b[c + 4] ? 3 : 4;
  3 == i && (h = 0);
  Zc(g, d, b[c + 3] + (e << 1));
  Zc(j, d, b[c + 3] + (h << 1));
  Oe(k, g, j);
  b[f] = b[k];
  o[f] = o[k];
  b[f + 1] = b[k + 1];
  o[f + 1] = o[k + 1];
  c = f + 2;
  Pe(l, g, j);
  b[c] = b[l];
  o[c] = o[l];
  b[c + 1] = b[l + 1];
  o[c + 1] = o[l + 1];
  a = g;
}

Le.X = 1;

function P(c, f, d) {
  Xc(c, o[f] + o[d], o[f + 1] + o[d + 1]);
}

function Qe(c, f, d) {
  o[c] = f;
  o[c + 1] = d;
}

function Re(c, f, d, e, g) {
  var i = a;
  a += 13;
  var h, j;
  h = g < b[c + 4] ? 2 : 1;
  1 == h && C(Ee, 129, Se, Ne);
  ke(i);
  j = g + 1;
  h = j == b[c + 4] ? 3 : 4;
  3 == h && (j = 0);
  h = i + 3;
  g = b[c + 3] + (g << 1);
  b[h] = b[g];
  o[h] = o[g];
  b[h + 1] = b[g + 1];
  o[h + 1] = o[g + 1];
  g = i + 5;
  c = b[c + 3] + (j << 1);
  b[g] = b[c];
  o[g] = o[c];
  b[g + 1] = b[c + 1];
  o[g + 1] = o[c + 1];
  f = Te(i, f, d, e);
  a = i;
  return f;
}

Re.X = 1;

function Oe(c, f, d) {
  Xc(c, o[f] < o[d] ? o[f] : o[d], o[f + 1] < o[d + 1] ? o[f + 1] : o[d + 1]);
}

function Pe(c, f, d) {
  Xc(c, o[f] > o[d] ? o[f] : o[d], o[f + 1] > o[d + 1] ? o[f + 1] : o[d + 1]);
}

function Ue(c, f, d) {
  re(c, f, 0, d, 0);
  b[c] = Ve + 2;
  f = 0 == te(b[c + 12]) ? 2 : 1;
  1 == f && C(We, 44, Xe, Ye);
  f = 0 == te(b[c + 13]) ? 4 : 3;
  3 == f && C(We, 45, Xe, xe);
}

function Ze(c, f, d, e) {
  var g = a;
  a += 12;
  var i, h, j = g + 2, k = g + 4, l = g + 6, m = g + 8, n = g + 10;
  J(j, e + 2, c + 3);
  P(g, e, j);
  K(k, d, g);
  j = O(k, k) - o[c + 2] * o[c + 2];
  K(l, d + 2, d);
  c = O(k, l);
  e = O(l, l);
  j = c * c - e * j;
  i = 0 > j ? 2 : 1;
  a : do if (1 == i) if (1.1920928955078125e-7 > e) i = 2; else {
    h = c;
    i = j;
    i = Bg(i);
    h = -(h + i);
    i = 0 <= h ? 4 : 6;
    do if (4 == i) if (h <= o[d + 4] * e) {
      h /= e;
      o[f + 2] = h;
      d = f;
      N(n, h, l);
      P(m, k, n);
      k = d;
      b[k] = b[m];
      o[k] = o[m];
      b[k + 1] = b[m + 1];
      o[k + 1] = o[m + 1];
      Cg(f);
      h = 1;
      i = 7;
      break a;
    } else i = 6; while (0);
    h = 0;
    i = 7;
  } while (0);
  2 == i && (h = 0);
  a = g;
  return h;
}

Ze.X = 1;

function Cg(c) {
  var f, d, e;
  e = Dg(c);
  f = 1.1920928955078125e-7 > e ? 1 : 2;
  1 == f ? d = 0 : 2 == f && (f = 1 / e, o[c] *= f, o[c + 1] *= f, d = e);
  return d;
}

function Eg(c, f) {
  b[c + 1] = b[f + 1];
  o[c + 2] = o[f + 2];
}

function Fg(c, f, d) {
  var e;
  e = o[d] - o[f];
  d = o[d + 1] - o[f + 1];
  Xc(c, o[f + 3] * e + o[f + 2] * d, -o[f + 2] * e + o[f + 3] * d);
}

Fg.X = 1;

function Dg(c) {
  return Bg(o[c] * o[c] + o[c + 1] * o[c + 1]);
}

function Gg(c, f, d, e, g) {
  var i = a;
  a += 6;
  var h = i + 2, j = i + 4;
  b[c + 15] = 0;
  Zc(i, d, f + 3);
  Zc(h, g, e + 3);
  K(j, h, i);
  d = O(j, j);
  g = o[f + 2] + o[e + 2];
  if (1 == (d > g * g ? 2 : 1)) b[c + 14] = 0, d = c + 12, f += 3, b[d] = b[f], o[d] = o[f], b[d + 1] = b[f + 1], o[d + 1] = o[f + 1], dc(c + 10), b[c + 15] = 1, e += 3, b[c] = b[e], o[c] = o[e], b[c + 1] = b[e + 1], o[c + 1] = o[e + 1], b[c + 4] = 0;
  a = i;
}

Gg.X = 1;

function Hg(c, f, d, e, g) {
  var i = a;
  a += 32;
  var h, j = i + 2, k, l, m, n, p, u = i + 4, s = i + 6, q = i + 8, v = i + 10, x = i + 12, w = i + 14, y = i + 16, z = i + 18, B = i + 20, E = i + 22, D = i + 24, H = i + 26, I = i + 28, M = i + 30;
  b[c + 15] = 0;
  Zc(i, g, e + 3);
  Fg(j, d, i);
  d = 0;
  g = -3.4028234663852886e+38;
  k = o[f + 2] + o[e + 2];
  l = b[f + 37];
  m = f + 5;
  f += 21;
  for (n = 0; ; ) {
    if (n >= l) {
      h = 6;
      break;
    }
    h = f + (n << 1);
    K(u, j, m + (n << 1));
    p = O(h, u);
    if (p > k) {
      h = 18;
      break;
    }
    h = p > g ? 4 : 5;
    4 == h && (g = p, d = n);
    n += 1;
  }
  a : do if (6 == h) {
    u = d;
    if (u + 1 < l) h = 7; else {
      var G = 0;
      h = 8;
    }
    7 == h && (G = u + 1);
    h = G;
    n = s;
    p = m + (u << 1);
    b[n] = b[p];
    o[n] = o[p];
    b[n + 1] = b[p + 1];
    o[n + 1] = o[p + 1];
    n = q;
    h = m + (h << 1);
    b[n] = b[h];
    o[n] = o[h];
    b[n + 1] = b[h + 1];
    o[n + 1] = o[h + 1];
    h = 1.1920928955078125e-7 > g ? 9 : 10;
    if (9 == h) b[c + 15] = 1, b[c + 14] = 1, u = c + 10, n = f + (d << 1), b[u] = b[n], o[u] = o[n], b[u + 1] = b[n + 1], o[u + 1] = o[n + 1], u = c + 12, P(x, s, q), N(v, .5, x), n = v, b[u] = b[n], o[u] = o[n], b[u + 1] = b[n + 1], o[u + 1] = o[n + 1], u = c, n = e + 3, b[u] = b[n], o[u] = o[n], b[u + 1] = b[n + 1], o[u + 1] = o[n + 1], b[c + 4] = 0; else if (10 == h) if (K(w, j, s), K(y, q, s), h = O(w, y), K(z, j, q), K(B, s, q), n = O(z, B), h = 0 >= h ? 11 : 13, 11 == h) {
      if (Ig(j, s) > k * k) break a;
      b[c + 15] = 1;
      b[c + 14] = 1;
      u = c + 10;
      K(E, j, s);
      n = E;
      b[u] = b[n];
      o[u] = o[n];
      b[u + 1] = b[n + 1];
      o[u + 1] = o[n + 1];
      Cg(c + 10);
      u = c + 12;
      n = s;
      b[u] = b[n];
      o[u] = o[n];
      b[u + 1] = b[n + 1];
      o[u + 1] = o[n + 1];
      u = c;
      n = e + 3;
      b[u] = b[n];
      o[u] = o[n];
      b[u + 1] = b[n + 1];
      o[u + 1] = o[n + 1];
      b[c + 4] = 0;
    } else if (13 == h) if (h = 0 >= n ? 14 : 16, 14 == h) {
      if (Ig(j, q) > k * k) break a;
      b[c + 15] = 1;
      b[c + 14] = 1;
      u = c + 10;
      K(D, j, q);
      n = D;
      b[u] = b[n];
      o[u] = o[n];
      b[u + 1] = b[n + 1];
      o[u + 1] = o[n + 1];
      Cg(c + 10);
      u = c + 12;
      n = q;
      b[u] = b[n];
      o[u] = o[n];
      b[u + 1] = b[n + 1];
      o[u + 1] = o[n + 1];
      u = c;
      n = e + 3;
      b[u] = b[n];
      o[u] = o[n];
      b[u + 1] = b[n + 1];
      o[u + 1] = o[n + 1];
      b[c + 4] = 0;
    } else if (16 == h) {
      P(I, s, q);
      N(H, .5, I);
      K(M, j, H);
      n = O(M, f + (u << 1));
      if (n > k) break a;
      b[c + 15] = 1;
      b[c + 14] = 1;
      n = c + 10;
      u = f + (u << 1);
      b[n] = b[u];
      o[n] = o[u];
      b[n + 1] = b[u + 1];
      o[n + 1] = o[u + 1];
      u = c + 12;
      n = H;
      b[u] = b[n];
      o[u] = o[n];
      b[u + 1] = b[n + 1];
      o[u + 1] = o[n + 1];
      u = c;
      n = e + 3;
      b[u] = b[n];
      o[u] = o[n];
      b[u + 1] = b[n + 1];
      o[u + 1] = o[n + 1];
      b[c + 4] = 0;
    }
  } while (0);
  a = i;
}

Hg.X = 1;

function Ig(c, f) {
  var d = a;
  a += 2;
  K(d, c, f);
  var e = O(d, d);
  a = d;
  return e;
}

function Jg(c, f, d, e, g) {
  var i = a;
  a += 56;
  var h = i + 2, j = i + 4, k = i + 6, l = i + 8, m;
  m = i + 10;
  var n;
  n = i + 12;
  var p = i + 14, u = i + 18, s = i + 20, q = i + 22, v = i + 24, x = i + 26, w = i + 28, y = i + 30, z = i + 32, B = i + 34, E = i + 36, D = i + 38, H = i + 40, I = i + 42, M = i + 44, G = i + 46, T = i + 48, R = i + 50, L = i + 52, S = i + 54;
  b[c + 15] = 0;
  Zc(h, g, e + 3);
  Fg(i, d, h);
  d = f + 3;
  b[j] = b[d];
  o[j] = o[d];
  b[j + 1] = b[d + 1];
  o[j + 1] = o[d + 1];
  d = f + 5;
  b[k] = b[d];
  o[k] = o[d];
  b[k + 1] = b[d + 1];
  o[k + 1] = o[d + 1];
  K(l, k, j);
  K(m, k, i);
  m = O(l, m);
  K(n, i, j);
  n = O(l, n);
  d = o[f + 2] + o[e + 2];
  b[p + 1] = 0;
  b[p + 3] = 0;
  g = 0 >= n ? 1 : 5;
  a : do if (1 == g) if (g = u, h = j, b[g] = b[h], o[g] = o[h], b[g + 1] = b[h + 1], o[g + 1] = o[h + 1], K(s, i, u), g = O(s, s), g > d * d) g = 16; else {
    g = b[f + 11] & 1 ? 3 : 4;
    if (3 == g) {
      var h = q, F = f + 7;
      b[h] = b[F];
      o[h] = o[F];
      b[h + 1] = b[F + 1];
      o[h + 1] = o[F + 1];
      h = v;
      F = j;
      b[h] = b[F];
      o[h] = o[F];
      b[h + 1] = b[F + 1];
      o[h + 1] = o[F + 1];
      K(x, v, q);
      K(w, v, i);
      h = O(x, w);
      if (0 < h) break a;
    }
    b[p] = 0;
    b[p + 2] = 0;
    b[c + 15] = 1;
    b[c + 14] = 0;
    dc(c + 10);
    h = c + 12;
    F = u;
    b[h] = b[F];
    o[h] = o[F];
    b[h + 1] = b[F + 1];
    o[h + 1] = o[F + 1];
    b[c + 4] = 0;
    h = c + 4;
    F = p;
    b[h] = b[F];
    o[h] = o[F];
    b[h + 1] = b[F + 1];
    o[h + 1] = o[F + 1];
    b[h + 2] = b[F + 2];
    o[h + 2] = o[F + 2];
    b[h + 3] = b[F + 3];
    o[h + 3] = o[F + 3];
    h = c;
    F = e + 3;
    b[h] = b[F];
    o[h] = o[F];
    b[h + 1] = b[F + 1];
    o[h + 1] = o[F + 1];
  } else if (5 == g) if (g = 0 >= m ? 6 : 10, 6 == g) {
    g = y;
    h = k;
    b[g] = b[h];
    o[g] = o[h];
    b[g + 1] = b[h + 1];
    o[g + 1] = o[h + 1];
    K(z, i, y);
    g = O(z, z);
    if (g > d * d) break a;
    g = b[f + 12] & 1 ? 8 : 9;
    if (8 == g && (h = B, F = f + 9, b[h] = b[F], o[h] = o[F], b[h + 1] = b[F + 1], o[h + 1] = o[F + 1], h = E, F = k, b[h] = b[F], o[h] = o[F], b[h + 1] = b[F + 1], o[h + 1] = o[F + 1], K(D, B, E), K(H, i, E), h = O(D, H), 0 < h)) break a;
    b[p] = 1;
    b[p + 2] = 0;
    b[c + 15] = 1;
    b[c + 14] = 0;
    dc(c + 10);
    h = c + 12;
    F = y;
    b[h] = b[F];
    o[h] = o[F];
    b[h + 1] = b[F + 1];
    o[h + 1] = o[F + 1];
    b[c + 4] = 0;
    h = c + 4;
    F = p;
    b[h] = b[F];
    o[h] = o[F];
    b[h + 1] = b[F + 1];
    o[h + 1] = o[F + 1];
    b[h + 2] = b[F + 2];
    o[h + 2] = o[F + 2];
    b[h + 3] = b[F + 3];
    o[h + 3] = o[F + 3];
    h = c;
    F = e + 3;
    b[h] = b[F];
    o[h] = o[F];
    b[h + 1] = b[F + 1];
    o[h + 1] = o[F + 1];
  } else if (10 == g) {
    h = O(l, l);
    g = 0 < h ? 12 : 11;
    11 == g && C(Kg, 127, Lg, Mg);
    g = 1 / h;
    N(G, m, j);
    N(T, n, k);
    P(M, G, T);
    N(I, g, M);
    K(R, i, I);
    g = O(R, R);
    if (g > d * d) break a;
    Xc(L, -o[l + 1], o[l]);
    K(S, i, j);
    g = 0 > O(L, S) ? 14 : 15;
    14 == g && Qe(L, -o[L], -o[L + 1]);
    Cg(L);
    b[p] = 0;
    b[p + 2] = 1;
    b[c + 15] = 1;
    b[c + 14] = 1;
    h = c + 10;
    F = L;
    b[h] = b[F];
    o[h] = o[F];
    b[h + 1] = b[F + 1];
    o[h + 1] = o[F + 1];
    h = c + 12;
    F = j;
    b[h] = b[F];
    o[h] = o[F];
    b[h + 1] = b[F + 1];
    o[h + 1] = o[F + 1];
    b[c + 4] = 0;
    h = c + 4;
    F = p;
    b[h] = b[F];
    o[h] = o[F];
    b[h + 1] = b[F + 1];
    o[h + 1] = o[F + 1];
    b[h + 2] = b[F + 2];
    o[h + 2] = o[F + 2];
    b[h + 3] = b[F + 3];
    o[h + 3] = o[F + 3];
    h = c;
    F = e + 3;
    b[h] = b[F];
    o[h] = o[F];
    b[h + 1] = b[F + 1];
    o[h + 1] = o[F + 1];
  } while (0);
  a = i;
}

Jg.X = 1;

function Ng(c, f, d, e, g, i) {
  var h = a;
  a += 125;
  var j, k = h + 4, l, m, n = h + 6, p, u = h + 8, s, q, v, x, w = h + 10, y = h + 12, z = h + 14, B = h + 16, E = h + 18, D = h + 20, H = h + 22, I = h + 24, M = h + 26, G = h + 28, T = h + 30, R = h + 32, L = h + 34, S = h + 36, F = h + 38, X = h + 40, Z = h + 42, V = h + 44, aa = h + 46, ja = h + 48, Y = h + 50, W = h + 52, $ = h + 54, ga = h + 56, la = h + 58, fa = h + 60, ka = h + 62, oa = h + 64, ua = h + 66, Da = h + 68, Ja = h + 70, Aa, Ua = h + 72, pb = h + 74, Fa = h + 76, Wa = h + 79, Na = h + 82, pa = h + 85, ha = h + 91, Ba, za, va, Ka, ma, La, Ga = h + 105, ya = h + 107, Oa = h + 109, Ea = h + 115, Ib, Ob, Pa, fc, Pb = h + 121, Xa, gc = h + 123, xb = c + 33, Ya = a;
  a += 6;
  var Qb = Ya + 2, Jb = Ya + 4, Ab = h + 2, Bb = e + 2, eb = i + 2;
  o[Ya] = o[Bb + 1] * o[eb] - o[Bb] * o[eb + 1];
  o[Ya + 1] = o[Bb + 1] * o[eb + 1] + o[Bb] * o[eb];
  b[Ab] = b[Ya];
  o[Ab] = o[Ya];
  b[Ab + 1] = b[Ya + 1];
  o[Ab + 1] = o[Ya + 1];
  var Wb = e + 2;
  K(Jb, i, e);
  Og(Qb, Wb, Jb);
  b[h] = b[Qb];
  o[h] = o[Qb];
  b[h + 1] = b[Qb + 1];
  o[h + 1] = o[Qb + 1];
  a = Ya;
  b[xb] = b[h];
  o[xb] = o[h];
  b[xb + 1] = b[h + 1];
  o[xb + 1] = o[h + 1];
  b[xb + 2] = b[h + 2];
  o[xb + 2] = o[h + 2];
  b[xb + 3] = b[h + 3];
  o[xb + 3] = o[h + 3];
  var Xb = c + 37;
  Zc(k, c + 33, g + 3);
  b[Xb] = b[k];
  o[Xb] = o[k];
  b[Xb + 1] = b[k + 1];
  o[Xb + 1] = o[k + 1];
  var fb = c + 39, yb = d + 7;
  b[fb] = b[yb];
  o[fb] = o[yb];
  b[fb + 1] = b[yb + 1];
  o[fb + 1] = o[yb + 1];
  var gb = c + 41, Ia = d + 3;
  b[gb] = b[Ia];
  o[gb] = o[Ia];
  b[gb + 1] = b[Ia + 1];
  o[gb + 1] = o[Ia + 1];
  var Yb = c + 43, hb = d + 5;
  b[Yb] = b[hb];
  o[Yb] = o[hb];
  b[Yb + 1] = b[hb + 1];
  o[Yb + 1] = o[hb + 1];
  var Cb = c + 45, ib = d + 9;
  b[Cb] = b[ib];
  o[Cb] = o[ib];
  b[Cb + 1] = b[ib + 1];
  o[Cb + 1] = o[ib + 1];
  l = b[d + 11] & 1;
  m = b[d + 12] & 1;
  K(n, c + 43, c + 41);
  Cg(n);
  Qe(c + 49, o[n + 1], -o[n]);
  var Db = c + 49;
  K(u, c + 37, c + 41);
  p = O(Db, u);
  x = v = q = s = 0;
  j = l & 1 ? 1 : 2;
  if (1 == j) {
    K(w, c + 41, c + 39);
    Cg(w);
    Qe(c + 47, o[w + 1], -o[w]);
    v = 0 <= Q(w, n);
    var hc = c + 47;
    K(y, c + 37, c + 39);
    s = O(hc, y);
  }
  j = m & 1 ? 3 : 4;
  if (3 == j) {
    K(z, c + 45, c + 43);
    Cg(z);
    Qe(c + 51, o[z + 1], -o[z]);
    x = 0 < Q(n, z);
    var ic = c + 51;
    K(B, c + 37, c + 43);
    q = O(ic, B);
  }
  j = l & 1 ? 5 : 34;
  a : do if (5 == j) if (m & 1) {
    j = v & 1 ? 7 : 14;
    do if (7 == j) if (x & 1) {
      if (0 <= s) {
        var qb = 1;
        j = 11;
      } else j = 9;
      9 == j && (0 <= p ? (qb = 1, j = 11) : qb = 0 <= q);
      b[c + 62] = qb;
      var Rb = c + 53, Zb = c + 49;
      j = b[c + 62] & 1 ? 12 : 13;
      if (12 == j) {
        var rb = Rb, $b = Zb;
        b[rb] = b[$b];
        o[rb] = o[$b];
        b[rb + 1] = b[$b + 1];
        o[rb + 1] = o[$b + 1];
        var Eb = c + 57, jc = c + 47;
        b[Eb] = b[jc];
        o[Eb] = o[jc];
        b[Eb + 1] = b[jc + 1];
        o[Eb + 1] = o[jc + 1];
        var sb = c + 59, Kb = c + 51;
        b[sb] = b[Kb];
        o[sb] = o[Kb];
        b[sb + 1] = b[Kb + 1];
        o[sb + 1] = o[Kb + 1];
        j = 61;
        break a;
      } else if (13 == j) {
        Pg(E, Zb);
        var tb = Rb, jb = E;
        b[tb] = b[jb];
        o[tb] = o[jb];
        b[tb + 1] = b[jb + 1];
        o[tb + 1] = o[jb + 1];
        var ac = c + 57;
        Pg(D, c + 49);
        var kc = ac, Sb = D;
        b[kc] = b[Sb];
        o[kc] = o[Sb];
        b[kc + 1] = b[Sb + 1];
        o[kc + 1] = o[Sb + 1];
        var Bc = c + 59;
        Pg(H, c + 49);
        var lc = Bc, kb = H;
        b[lc] = b[kb];
        o[lc] = o[kb];
        b[lc + 1] = b[kb + 1];
        o[lc + 1] = o[kb + 1];
        j = 61;
        break a;
      }
    } else j = 14; while (0);
    j = v & 1 ? 15 : 21;
    if (15 == j) {
      if (0 <= s) {
        var ae = 1;
        j = 18;
      } else j = 16;
      16 == j && (0 <= p ? ae = 0 <= q : (ae = 0, j = 18));
      b[c + 62] = ae;
      var $e = c + 53, af = c + 49;
      j = b[c + 62] & 1 ? 19 : 20;
      if (19 == j) {
        var fd = $e, gd = af;
        b[fd] = b[gd];
        o[fd] = o[gd];
        b[fd + 1] = b[gd + 1];
        o[fd + 1] = o[gd + 1];
        var hd = c + 57, id = c + 47;
        b[hd] = b[id];
        o[hd] = o[id];
        b[hd + 1] = b[id + 1];
        o[hd + 1] = o[id + 1];
        var jd = c + 59, kd = c + 49;
        b[jd] = b[kd];
        o[jd] = o[kd];
        b[jd + 1] = b[kd + 1];
        o[jd + 1] = o[kd + 1];
        j = 61;
        break a;
      } else if (20 == j) {
        Pg(I, af);
        var ld = $e, md = I;
        b[ld] = b[md];
        o[ld] = o[md];
        b[ld + 1] = b[md + 1];
        o[ld + 1] = o[md + 1];
        var Th = c + 57;
        Pg(M, c + 51);
        var nd = Th, od = M;
        b[nd] = b[od];
        o[nd] = o[od];
        b[nd + 1] = b[od + 1];
        o[nd + 1] = o[od + 1];
        var Uh = c + 59;
        Pg(G, c + 49);
        var pd = Uh, qd = G;
        b[pd] = b[qd];
        o[pd] = o[qd];
        b[pd + 1] = b[qd + 1];
        o[pd + 1] = o[qd + 1];
        j = 61;
        break a;
      }
    } else if (21 == j) if (j = x & 1 ? 22 : 28, 22 == j) {
      if (0 <= q) {
        var be = 1;
        j = 25;
      } else j = 23;
      23 == j && (0 <= s ? be = 0 <= p : (be = 0, j = 25));
      b[c + 62] = be;
      var bf = c + 53, cf = c + 49;
      j = b[c + 62] & 1 ? 26 : 27;
      if (26 == j) {
        var rd = bf, sd = cf;
        b[rd] = b[sd];
        o[rd] = o[sd];
        b[rd + 1] = b[sd + 1];
        o[rd + 1] = o[sd + 1];
        var td = c + 57, ud = c + 49;
        b[td] = b[ud];
        o[td] = o[ud];
        b[td + 1] = b[ud + 1];
        o[td + 1] = o[ud + 1];
        var vd = c + 59, wd = c + 51;
        b[vd] = b[wd];
        o[vd] = o[wd];
        b[vd + 1] = b[wd + 1];
        o[vd + 1] = o[wd + 1];
        j = 61;
        break a;
      } else if (27 == j) {
        Pg(T, cf);
        var xd = bf, yd = T;
        b[xd] = b[yd];
        o[xd] = o[yd];
        b[xd + 1] = b[yd + 1];
        o[xd + 1] = o[yd + 1];
        var Vh = c + 57;
        Pg(R, c + 49);
        var zd = Vh, Ad = R;
        b[zd] = b[Ad];
        o[zd] = o[Ad];
        b[zd + 1] = b[Ad + 1];
        o[zd + 1] = o[Ad + 1];
        var Wh = c + 59;
        Pg(L, c + 47);
        var Bd = Wh, tc = L;
        b[Bd] = b[tc];
        o[Bd] = o[tc];
        b[Bd + 1] = b[tc + 1];
        o[Bd + 1] = o[tc + 1];
        j = 61;
        break a;
      }
    } else if (28 == j) {
      if (0 <= s) j = 29; else {
        var Cc = 0;
        j = 31;
      }
      29 == j && (0 <= p ? Cc = 0 <= q : (Cc = 0, j = 31));
      b[c + 62] = Cc;
      var Sc = c + 53, ce = c + 49;
      j = b[c + 62] & 1 ? 32 : 33;
      if (32 == j) {
        var Tc = Sc, Uc = ce;
        b[Tc] = b[Uc];
        o[Tc] = o[Uc];
        b[Tc + 1] = b[Uc + 1];
        o[Tc + 1] = o[Uc + 1];
        var Cd = c + 57, Dd = c + 49;
        b[Cd] = b[Dd];
        o[Cd] = o[Dd];
        b[Cd + 1] = b[Dd + 1];
        o[Cd + 1] = o[Dd + 1];
        var Ed = c + 59, Fd = c + 49;
        b[Ed] = b[Fd];
        o[Ed] = o[Fd];
        b[Ed + 1] = b[Fd + 1];
        o[Ed + 1] = o[Fd + 1];
        j = 61;
        break a;
      } else if (33 == j) {
        Pg(S, ce);
        var Gd = Sc, Hd = S;
        b[Gd] = b[Hd];
        o[Gd] = o[Hd];
        b[Gd + 1] = b[Hd + 1];
        o[Gd + 1] = o[Hd + 1];
        var df = c + 57;
        Pg(F, c + 51);
        var Id = df, Jd = F;
        b[Id] = b[Jd];
        o[Id] = o[Jd];
        b[Id + 1] = b[Jd + 1];
        o[Id + 1] = o[Jd + 1];
        var Kd = c + 59;
        Pg(X, c + 47);
        var uc = Kd, ef = X;
        b[uc] = b[ef];
        o[uc] = o[ef];
        b[uc + 1] = b[ef + 1];
        o[uc + 1] = o[ef + 1];
        j = 61;
        break a;
      }
    }
  } else j = 34; while (0);
  if (34 == j) if (j = l & 1 ? 35 : 46, 35 == j) {
    var Vk = 0 <= s;
    j = v & 1 ? 36 : 41;
    if (36 == j) {
      if (Vk) {
        var Wk = 1;
        j = 38;
      } else j = 37;
      37 == j && (Wk = 0 <= p);
      b[c + 62] = Wk;
      var Dc = c + 53, de = c + 49;
      j = b[c + 62] & 1 ? 39 : 40;
      if (39 == j) {
        b[Dc] = b[de];
        o[Dc] = o[de];
        b[Dc + 1] = b[de + 1];
        o[Dc + 1] = o[de + 1];
        var ff = c + 57, gf = c + 47;
        b[ff] = b[gf];
        o[ff] = o[gf];
        b[ff + 1] = b[gf + 1];
        o[ff + 1] = o[gf + 1];
        var hf = c + 59;
        Pg(Z, c + 49);
        b[hf] = b[Z];
        o[hf] = o[Z];
        b[hf + 1] = b[Z + 1];
        o[hf + 1] = o[Z + 1];
      } else if (40 == j) {
        Pg(V, de);
        b[Dc] = b[V];
        o[Dc] = o[V];
        b[Dc + 1] = b[V + 1];
        o[Dc + 1] = o[V + 1];
        var jf = c + 57, kf = c + 49;
        b[jf] = b[kf];
        o[jf] = o[kf];
        b[jf + 1] = b[kf + 1];
        o[jf + 1] = o[kf + 1];
        var lf = c + 59;
        Pg(aa, c + 49);
        b[lf] = b[aa];
        o[lf] = o[aa];
        b[lf + 1] = b[aa + 1];
        o[lf + 1] = o[aa + 1];
      }
    } else if (41 == j) {
      if (Vk) j = 42; else {
        var Xk = 0;
        j = 43;
      }
      42 == j && (Xk = 0 <= p);
      b[c + 62] = Xk;
      var Ec = c + 53, ee = c + 49;
      j = b[c + 62] & 1 ? 44 : 45;
      if (44 == j) {
        b[Ec] = b[ee];
        o[Ec] = o[ee];
        b[Ec + 1] = b[ee + 1];
        o[Ec + 1] = o[ee + 1];
        var mf = c + 57, nf = c + 49;
        b[mf] = b[nf];
        o[mf] = o[nf];
        b[mf + 1] = b[nf + 1];
        o[mf + 1] = o[nf + 1];
        var of = c + 59;
        Pg(ja, c + 49);
        b[of] = b[ja];
        o[of] = o[ja];
        b[of + 1] = b[ja + 1];
        o[of + 1] = o[ja + 1];
      } else if (45 == j) {
        Pg(Y, ee);
        b[Ec] = b[Y];
        o[Ec] = o[Y];
        b[Ec + 1] = b[Y + 1];
        o[Ec + 1] = o[Y + 1];
        var pf = c + 57, qf = c + 49;
        b[pf] = b[qf];
        o[pf] = o[qf];
        b[pf + 1] = b[qf + 1];
        o[pf + 1] = o[qf + 1];
        var rf = c + 59;
        Pg(W, c + 47);
        b[rf] = b[W];
        o[rf] = o[W];
        b[rf + 1] = b[W + 1];
        o[rf + 1] = o[W + 1];
      }
    }
  } else if (46 == j) if (j = m & 1 ? 47 : 58, 47 == j) {
    var Yk = 0 <= p;
    j = x & 1 ? 48 : 53;
    if (48 == j) {
      if (Yk) {
        var Zk = 1;
        j = 50;
      } else j = 49;
      49 == j && (Zk = 0 <= q);
      b[c + 62] = Zk;
      var Fc = c + 53, fe = c + 49;
      j = b[c + 62] & 1 ? 51 : 52;
      if (51 == j) {
        b[Fc] = b[fe];
        o[Fc] = o[fe];
        b[Fc + 1] = b[fe + 1];
        o[Fc + 1] = o[fe + 1];
        var sf = c + 57;
        Pg($, c + 49);
        b[sf] = b[$];
        o[sf] = o[$];
        b[sf + 1] = b[$ + 1];
        o[sf + 1] = o[$ + 1];
        var tf = c + 59, uf = c + 51;
        b[tf] = b[uf];
        o[tf] = o[uf];
        b[tf + 1] = b[uf + 1];
        o[tf + 1] = o[uf + 1];
      } else if (52 == j) {
        Pg(ga, fe);
        b[Fc] = b[ga];
        o[Fc] = o[ga];
        b[Fc + 1] = b[ga + 1];
        o[Fc + 1] = o[ga + 1];
        var vf = c + 57;
        Pg(la, c + 49);
        b[vf] = b[la];
        o[vf] = o[la];
        b[vf + 1] = b[la + 1];
        o[vf + 1] = o[la + 1];
        var wf = c + 59, xf = c + 49;
        b[wf] = b[xf];
        o[wf] = o[xf];
        b[wf + 1] = b[xf + 1];
        o[wf + 1] = o[xf + 1];
      }
    } else if (53 == j) {
      if (Yk) j = 54; else {
        var $k = 0;
        j = 55;
      }
      54 == j && ($k = 0 <= q);
      b[c + 62] = $k;
      var Gc = c + 53, ge = c + 49;
      j = b[c + 62] & 1 ? 56 : 57;
      if (56 == j) {
        b[Gc] = b[ge];
        o[Gc] = o[ge];
        b[Gc + 1] = b[ge + 1];
        o[Gc + 1] = o[ge + 1];
        var yf = c + 57;
        Pg(fa, c + 49);
        b[yf] = b[fa];
        o[yf] = o[fa];
        b[yf + 1] = b[fa + 1];
        o[yf + 1] = o[fa + 1];
        var zf = c + 59, Af = c + 49;
        b[zf] = b[Af];
        o[zf] = o[Af];
        b[zf + 1] = b[Af + 1];
        o[zf + 1] = o[Af + 1];
      } else if (57 == j) {
        Pg(ka, ge);
        b[Gc] = b[ka];
        o[Gc] = o[ka];
        b[Gc + 1] = b[ka + 1];
        o[Gc + 1] = o[ka + 1];
        var Bf = c + 57;
        Pg(oa, c + 51);
        b[Bf] = b[oa];
        o[Bf] = o[oa];
        b[Bf + 1] = b[oa + 1];
        o[Bf + 1] = o[oa + 1];
        var Cf = c + 59, Df = c + 49;
        b[Cf] = b[Df];
        o[Cf] = o[Df];
        b[Cf + 1] = b[Df + 1];
        o[Cf + 1] = o[Df + 1];
      }
    }
  } else if (58 == j) {
    b[c + 62] = 0 <= p;
    var Hc = c + 53, he = c + 49;
    j = b[c + 62] & 1 ? 59 : 60;
    if (59 == j) {
      b[Hc] = b[he];
      o[Hc] = o[he];
      b[Hc + 1] = b[he + 1];
      o[Hc + 1] = o[he + 1];
      var Ef = c + 57;
      Pg(ua, c + 49);
      b[Ef] = b[ua];
      o[Ef] = o[ua];
      b[Ef + 1] = b[ua + 1];
      o[Ef + 1] = o[ua + 1];
      var Ff = c + 59;
      Pg(Da, c + 49);
      b[Ff] = b[Da];
      o[Ff] = o[Da];
      b[Ff + 1] = b[Da + 1];
      o[Ff + 1] = o[Da + 1];
    } else if (60 == j) {
      Pg(Ja, he);
      b[Hc] = b[Ja];
      o[Hc] = o[Ja];
      b[Hc + 1] = b[Ja + 1];
      o[Hc + 1] = o[Ja + 1];
      var Gf = c + 57, Hf = c + 49;
      b[Gf] = b[Hf];
      o[Gf] = o[Hf];
      b[Gf + 1] = b[Hf + 1];
      o[Gf + 1] = o[Hf + 1];
      var If = c + 59, Jf = c + 49;
      b[If] = b[Jf];
      o[If] = o[Jf];
      b[If + 1] = b[Jf + 1];
      o[If + 1] = o[Jf + 1];
    }
  }
  b[c + 32] = b[g + 37];
  Aa = 0;
  j = Aa < b[g + 37] ? 62 : 64;
  a : do if (62 == j) for (var gq = c, hq = c + 33, Kf = Ua, iq = c + 16, jq = c + 35, Lf = pb; ; ) {
    var kq = gq + (Aa << 1);
    Zc(Ua, hq, g + 5 + (Aa << 1));
    var Mf = kq;
    b[Mf] = b[Kf];
    o[Mf] = o[Kf];
    b[Mf + 1] = b[Kf + 1];
    o[Mf + 1] = o[Kf + 1];
    var lq = iq + (Aa << 1);
    J(pb, jq, g + 21 + (Aa << 1));
    var Nf = lq;
    b[Nf] = b[Lf];
    o[Nf] = o[Lf];
    b[Nf + 1] = b[Lf + 1];
    o[Nf + 1] = o[Lf + 1];
    Aa += 1;
    if (Aa >= b[g + 37]) {
      j = 64;
      break a;
    }
  } while (0);
  o[c + 61] = .019999999552965164;
  b[f + 15] = 0;
  Qg(Fa, c);
  j = 0 == b[Fa] ? 100 : 65;
  a : do if (65 == j) if (o[Fa + 2] > o[c + 61]) j = 100; else {
    Rg(Wa, c);
    j = 0 != b[Wa] ? 67 : 68;
    if (67 == j && o[Wa + 2] > o[c + 61]) {
      j = 100;
      break a;
    }
    j = 0 == b[Wa] ? 69 : 70;
    if (69 == j) {
      var Ld = Na, Md = Fa;
      b[Ld] = b[Md];
      o[Ld] = o[Md];
      b[Ld + 1] = b[Md + 1];
      o[Ld + 1] = o[Md + 1];
      b[Ld + 2] = b[Md + 2];
      o[Ld + 2] = o[Md + 2];
    } else if (70 == j) {
      var Tb = Na;
      j = o[Wa + 2] > .9800000190734863 * o[Fa + 2] + .0010000000474974513 ? 71 : 72;
      if (71 == j) {
        var Nd = Wa;
        b[Tb] = b[Nd];
        o[Tb] = o[Nd];
        b[Tb + 1] = b[Nd + 1];
        o[Tb + 1] = o[Nd + 1];
        b[Tb + 2] = b[Nd + 2];
        o[Tb + 2] = o[Nd + 2];
      } else if (72 == j) {
        var Od = Fa;
        b[Tb] = b[Od];
        o[Tb] = o[Od];
        b[Tb + 1] = b[Od + 1];
        o[Tb + 1] = o[Od + 1];
        b[Tb + 2] = b[Od + 2];
        o[Tb + 2] = o[Od + 2];
      }
    }
    var cl = f + 14;
    j = 1 == b[Na] ? 74 : 84;
    if (74 == j) {
      b[cl] = 1;
      Ba = 0;
      za = O(c + 53, c + 16);
      va = 1;
      var dl = c + 32;
      j = va < b[dl] ? 75 : 79;
      b : do if (75 == j) for (var mq = c + 53, nq = c + 16; ; ) if (Ka = O(mq, nq + (va << 1)), j = Ka < za ? 77 : 78, 77 == j && (za = Ka, Ba = va), va += 1, va >= b[dl]) {
        j = 79;
        break b;
      } while (0);
      ma = Ba;
      if (ma + 1 < b[c + 32]) j = 80; else {
        var el = 0;
        j = 81;
      }
      80 == j && (el = ma + 1);
      La = el;
      var Of = pa, Pf = c + (ma << 1);
      b[Of] = b[Pf];
      o[Of] = o[Pf];
      b[Of + 1] = b[Pf + 1];
      o[Of + 1] = o[Pf + 1];
      b[pa + 2] = 0;
      b[pa + 3] = ma & 255;
      b[pa + 4] = 1;
      b[pa + 5] = 0;
      var Qf = pa + 3, Rf = c + (La << 1);
      b[Qf] = b[Rf];
      o[Qf] = o[Rf];
      b[Qf + 1] = b[Rf + 1];
      o[Qf + 1] = o[Rf + 1];
      b[pa + 5] = 0;
      b[pa + 6] = La & 255;
      b[pa + 7] = 1;
      b[pa + 8] = 0;
      var fl = ha;
      j = b[c + 62] & 1 ? 82 : 83;
      if (82 == j) {
        b[fl] = 0;
        b[ha + 1] = 1;
        var Sf = ha + 2, Tf = c + 41;
        b[Sf] = b[Tf];
        o[Sf] = o[Tf];
        b[Sf + 1] = b[Tf + 1];
        o[Sf + 1] = o[Tf + 1];
        var Uf = ha + 4, Vf = c + 43;
        b[Uf] = b[Vf];
        o[Uf] = o[Vf];
        b[Uf + 1] = b[Vf + 1];
        o[Uf + 1] = o[Vf + 1];
        var Wf = ha + 6, Xf = c + 49;
        b[Wf] = b[Xf];
        o[Wf] = o[Xf];
        b[Wf + 1] = b[Xf + 1];
        o[Wf + 1] = o[Xf + 1];
      } else if (83 == j) {
        b[fl] = 1;
        b[ha + 1] = 0;
        var Yf = ha + 2, Zf = c + 43;
        b[Yf] = b[Zf];
        o[Yf] = o[Zf];
        b[Yf + 1] = b[Zf + 1];
        o[Yf + 1] = o[Zf + 1];
        var $f = ha + 4, ag = c + 41;
        b[$f] = b[ag];
        o[$f] = o[ag];
        b[$f + 1] = b[ag + 1];
        o[$f + 1] = o[ag + 1];
        var oq = ha + 6;
        Pg(Ga, c + 49);
        var bg = oq, cg = Ga;
        b[bg] = b[cg];
        o[bg] = o[cg];
        b[bg + 1] = b[cg + 1];
        o[bg + 1] = o[cg + 1];
      }
    } else if (84 == j) {
      b[cl] = 2;
      var dg = pa, eg = c + 41;
      b[dg] = b[eg];
      o[dg] = o[eg];
      b[dg + 1] = b[eg + 1];
      o[dg + 1] = o[eg + 1];
      b[pa + 2] = 0;
      b[pa + 3] = b[Na + 1] & 255;
      b[pa + 4] = 0;
      b[pa + 5] = 1;
      var fg = pa + 3, gg = c + 43;
      b[fg] = b[gg];
      o[fg] = o[gg];
      b[fg + 1] = b[gg + 1];
      o[fg + 1] = o[gg + 1];
      b[pa + 5] = 0;
      b[pa + 6] = b[Na + 1] & 255;
      b[pa + 7] = 0;
      b[pa + 8] = 1;
      b[ha] = b[Na + 1];
      if (b[ha] + 1 < b[c + 32]) j = 85; else {
        var gl = 0;
        j = 86;
      }
      85 == j && (gl = b[ha] + 1);
      b[ha + 1] = gl;
      var hg = ha + 2, ig = c + (b[ha] << 1);
      b[hg] = b[ig];
      o[hg] = o[ig];
      b[hg + 1] = b[ig + 1];
      o[hg + 1] = o[ig + 1];
      var jg = ha + 4, kg = c + (b[ha + 1] << 1);
      b[jg] = b[kg];
      o[jg] = o[kg];
      b[jg + 1] = b[kg + 1];
      o[jg + 1] = o[kg + 1];
      var lg = ha + 6, mg = c + 16 + (b[ha] << 1);
      b[lg] = b[mg];
      o[lg] = o[mg];
      b[lg + 1] = b[mg + 1];
      o[lg + 1] = o[mg + 1];
    }
    Qe(ha + 8, o[ha + 7], -o[ha + 6]);
    var pq = ha + 11;
    Pg(ya, ha + 8);
    var ng = pq, og = ya;
    b[ng] = b[og];
    o[ng] = o[og];
    b[ng + 1] = b[og + 1];
    o[ng + 1] = o[og + 1];
    o[ha + 10] = O(ha + 8, ha + 2);
    o[ha + 13] = O(ha + 11, ha + 4);
    var hl = Sg(Oa, pa, ha + 8, o[ha + 10], b[ha]);
    Ib = hl;
    if (2 > hl) j = 100; else if (Ib = Sg(Ea, Oa, ha + 11, o[ha + 13], b[ha + 1]), 2 > Ib) j = 100; else {
      j = 1 == b[Na] ? 90 : 91;
      if (90 == j) {
        var pg = f + 10, qg = ha + 6;
        b[pg] = b[qg];
        o[pg] = o[qg];
        b[pg + 1] = b[qg + 1];
        o[pg + 1] = o[qg + 1];
        var rg = f + 12, sg = ha + 2;
        b[rg] = b[sg];
        o[rg] = o[sg];
        b[rg + 1] = b[sg + 1];
        o[rg + 1] = o[sg + 1];
      } else if (91 == j) {
        var tg = f + 10, ug = g + 21 + (b[ha] << 1);
        b[tg] = b[ug];
        o[tg] = o[ug];
        b[tg + 1] = b[ug + 1];
        o[tg + 1] = o[ug + 1];
        var vg = f + 12, wg = g + 5 + (b[ha] << 1);
        b[vg] = b[wg];
        o[vg] = o[wg];
        b[vg + 1] = b[wg + 1];
        o[vg + 1] = o[wg + 1];
      }
      Pa = Ob = 0;
      for (var qq = ha + 6, rq = ha + 2, sq = c + 61, tq = Na, uq = c + 33, xg = gc; ; ) {
        K(Pb, Ea + 3 * Pa, rq);
        fc = O(qq, Pb);
        j = fc <= o[sq] ? 94 : 98;
        if (94 == j) {
          var il = Xa = f + 5 * Ob, jl = Ea + 3 * Pa;
          j = 1 == b[tq] ? 95 : 96;
          if (95 == j) {
            Fg(gc, uq, jl);
            var yg = il;
            b[yg] = b[xg];
            o[yg] = o[xg];
            b[yg + 1] = b[xg + 1];
            o[yg + 1] = o[xg + 1];
            b[Xa + 4] = b[Ea + 3 * Pa + 2];
            o[Xa + 4] = o[Ea + 3 * Pa + 2];
          } else if (96 == j) {
            var zg = il, Ag = jl;
            b[zg] = b[Ag];
            o[zg] = o[Ag];
            b[zg + 1] = b[Ag + 1];
            o[zg + 1] = o[Ag + 1];
            b[Xa + 6] = b[Ea + 3 * Pa + 2 + 3];
            b[Xa + 7] = b[Ea + 3 * Pa + 2 + 2];
            b[Xa + 4] = b[Ea + 3 * Pa + 2 + 1];
            b[Xa + 5] = b[Ea + 3 * Pa + 2];
          }
          Ob += 1;
        }
        var kl = Pa + 1;
        Pa = kl;
        if (2 <= kl) {
          j = 99;
          break;
        }
      }
      b[f + 15] = Ob;
    }
  } while (0);
  a = h;
}

Ng.X = 1;

function Q(c, f) {
  return o[c] * o[f + 1] - o[c + 1] * o[f];
}

function Pg(c, f) {
  Qe(c, -o[f], -o[f + 1]);
}

function Og(c, f, d) {
  Xc(c, o[f + 1] * o[d] + o[f] * o[d + 1], -o[f] * o[d] + o[f + 1] * o[d + 1]);
}

function Qg(c, f) {
  var d = a;
  a += 2;
  var e, g, i;
  b[c] = 1;
  b[c + 1] = b[f + 62] & 1 ? 0 : 1;
  o[c + 2] = 3.4028234663852886e+38;
  g = 0;
  var h = f + 32;
  e = g < b[h] ? 1 : 5;
  a : do if (1 == e) for (var j = f + 53, k = f, l = f + 41, m = c + 2, n = c + 2; ; ) if (K(d, k + (g << 1), l), i = O(j, d), e = i < o[m] ? 3 : 4, 3 == e && (o[n] = i), g += 1, g >= b[h]) break a; while (0);
  a = d;
}

Qg.X = 1;

function Rg(c, f) {
  var d = a;
  a += 12;
  var e, g, i = d + 2, h = d + 4, j, k = d + 6, l = d + 8, m = d + 10;
  b[c] = 0;
  b[c + 1] = -1;
  o[c + 2] = -3.4028234663852886e+38;
  Xc(d, -o[f + 54], o[f + 53]);
  g = 0;
  for (var n = f + 32, p = f + 16, u = f + 41, s = f + 43, q = f + 61, v = f + 59, x = f + 53, w = c + 2, y = c + 1, z = c + 2, B = f + 57, E = f + 53; ; ) {
    if (g >= b[n]) {
      e = 10;
      break;
    }
    Pg(i, p + (g << 1));
    K(h, f + (g << 1), u);
    e = O(i, h);
    K(k, f + (g << 1), s);
    j = O(i, k);
    j = e < j ? e : j;
    if (j > o[q]) {
      e = 3;
      break;
    }
    e = 0 <= O(i, d) ? 5 : 6;
    5 == e ? (K(l, i, v), e = -.03490658849477768 > O(l, x) ? 9 : 7) : 6 == e && (K(m, i, B), e = -.03490658849477768 > O(m, E) ? 9 : 7);
    7 == e && (j > o[w] ? (b[c] = 2, b[y] = g, o[z] = j) : e = 9);
    g += 1;
  }
  3 == e && (b[c] = 2, b[c + 1] = g, o[c + 2] = j);
  a = d;
}

Rg.X = 1;

function Tg(c, f, d, e, g) {
  var i = a;
  a += 56;
  var h, j, k, l = i + 1, m, n, p = i + 2, u = i + 6, s, q, v = i + 10, x, w, y, z = i + 16, B = i + 18, E = i + 20, D = i + 22, H = i + 24, I = i + 26, M = i + 28, G = i + 30, T = i + 32, R = i + 34, L, S, F = i + 36, X = i + 42, Z = i + 48, V, aa = i + 50, ja = i + 52;
  b[c + 15] = 0;
  j = o[f + 2] + o[e + 2];
  b[i] = 0;
  k = Ug(i, f, d, e, g);
  h = k > j ? 16 : 1;
  do if (1 == h) if (b[l] = 0, h = Ug(l, e, g, f, d), h > j) h = 16; else {
    h = h > .9800000190734863 * k + .0010000000474974513 ? 3 : 4;
    3 == h ? (m = e, n = f, s = p, q = g, b[s] = b[q], o[s] = o[q], b[s + 1] = b[q + 1], o[s + 1] = o[q + 1], b[s + 2] = b[q + 2], o[s + 2] = o[q + 2], b[s + 3] = b[q + 3], o[s + 3] = o[q + 3], s = u, q = d, b[s] = b[q], o[s] = o[q], b[s + 1] = b[q + 1], o[s + 1] = o[q + 1], b[s + 2] = b[q + 2], o[s + 2] = o[q + 2], b[s + 3] = b[q + 3], o[s + 3] = o[q + 3], s = b[l], b[c + 14] = 2, q = 1) : 4 == h && (m = f, n = e, s = p, q = d, b[s] = b[q], o[s] = o[q], b[s + 1] = b[q + 1], o[s + 1] = o[q + 1], b[s + 2] = b[q + 2], o[s + 2] = o[q + 2], b[s + 3] = b[q + 3], o[s + 3] = o[q + 3], s = u, q = g, b[s] = b[q], o[s] = o[q], b[s + 1] = b[q + 1], o[s + 1] = o[q + 1], b[s + 2] = b[q + 2], o[s + 2] = o[q + 2], b[s + 3] = b[q + 3], o[s + 3] = o[q + 3], s = b[i], b[c + 14] = 1, q = 0);
    Vg(v, m, p, s, n, u);
    h = b[m + 37];
    x = m + 5;
    w = s;
    if (s + 1 < h) h = 6; else {
      var Y = 0;
      h = 7;
    }
    6 == h && (Y = s + 1);
    y = Y;
    L = z;
    S = x + (w << 1);
    b[L] = b[S];
    o[L] = o[S];
    b[L + 1] = b[S + 1];
    o[L + 1] = o[S + 1];
    L = B;
    x += y << 1;
    b[L] = b[x];
    o[L] = o[x];
    b[L + 1] = b[x + 1];
    o[L + 1] = o[x + 1];
    K(E, B, z);
    Cg(E);
    Wg(D, E);
    P(I, z, B);
    N(H, .5, I);
    J(M, p + 2, E);
    Wg(G, M);
    Zc(T, p, z);
    x = z;
    L = T;
    b[x] = b[L];
    o[x] = o[L];
    b[x + 1] = b[L + 1];
    o[x + 1] = o[L + 1];
    Zc(R, p, B);
    x = B;
    L = R;
    b[x] = b[L];
    o[x] = o[L];
    b[x + 1] = b[L + 1];
    o[x + 1] = o[L + 1];
    x = O(G, z);
    L = -O(M, z) + j;
    S = O(M, B) + j;
    var W = F, $ = v;
    Pg(Z, M);
    if (2 > Sg(W, $, Z, L, w)) h = 16; else if (w = Sg(X, F, M, S, y), 2 > w) h = 16; else {
      w = c + 10;
      y = D;
      b[w] = b[y];
      o[w] = o[y];
      b[w + 1] = b[y + 1];
      o[w + 1] = o[y + 1];
      w = c + 12;
      y = H;
      b[w] = b[y];
      o[w] = o[y];
      b[w + 1] = b[y + 1];
      o[w + 1] = o[y + 1];
      y = w = 0;
      L = aa;
      S = ja;
      for (var W = ja + 1, $ = ja, ga = ja + 3, la = ja + 2; ; ) {
        h = O(G, X + 3 * y) - x;
        h = h <= j ? 11 : 14;
        if (11 == h) {
          h = V = c + 5 * w;
          Fg(aa, u, X + 3 * y);
          b[h] = b[L];
          o[h] = o[L];
          b[h + 1] = b[L + 1];
          o[h + 1] = o[L + 1];
          b[V + 4] = b[X + 3 * y + 2];
          o[V + 4] = o[X + 3 * y + 2];
          h = 0 != q ? 12 : 13;
          if (12 == h) {
            var fa = V + 4;
            b[S] = b[fa];
            o[S] = o[fa];
            b[S + 1] = b[fa + 1];
            o[S + 1] = o[fa + 1];
            b[S + 2] = b[fa + 2];
            o[S + 2] = o[fa + 2];
            b[S + 3] = b[fa + 3];
            o[S + 3] = o[fa + 3];
            b[V + 4] = b[W];
            b[V + 5] = b[$];
            b[V + 6] = b[ga];
            b[V + 7] = b[la];
          }
          w += 1;
        }
        y = V = y + 1;
        if (2 <= V) {
          h = 15;
          break;
        }
      }
      b[c + 15] = w;
    }
  } while (0);
  a = i;
}

Tg.X = 1;

function Wg(c, f) {
  Xc(c, 1 * o[f + 1], -1 * o[f]);
}

function Ug(c, f, d, e, g) {
  var i = a;
  a += 8;
  var h, j, k, l;
  h = i + 2;
  var m = i + 4, n = i + 6, p, u, s, q, v, x, w, y;
  k = b[f + 37];
  l = f + 21;
  Zc(h, g, e + 3);
  Zc(m, d, f + 3);
  K(i, h, m);
  Og(n, d + 2, i);
  m = 0;
  p = -3.4028234663852886e+38;
  u = 0;
  h = u < k ? 1 : 4;
  a : do if (1 == h) for (;;) if (s = O(l + (u << 1), n), h = s > p ? 2 : 3, 2 == h && (p = s, m = u), u += 1, u >= k) break a; while (0);
  l = Xg(f, d, m, e, g);
  h = 0 <= m - 1 ? 5 : 6;
  5 == h ? q = m - 1 : 6 == h && (q = k - 1);
  n = Xg(f, d, q, e, g);
  m + 1 < k ? h = 8 : (v = 0, h = 9);
  8 == h && (v = m + 1);
  p = Xg(f, d, v, e, g);
  h = n > l ? 10 : 12;
  if (10 == h) if (n > p) {
    y = -1;
    x = q;
    w = n;
    var z = -1;
    h = 15;
  } else h = 12;
  a : do if (12 == h) if (h = p > l ? 13 : 14, 13 == h) {
    y = 1;
    x = v;
    w = p;
    z = 1;
    h = 15;
    break a;
  } else if (14 == h) {
    b[c] = m;
    j = l;
    h = 26;
    break a;
  } while (0);
  if (15 == h) {
    for (;;) {
      h = -1 == z ? 16 : 20;
      if (16 == h) {
        h = 0 <= x - 1 ? 17 : 18;
        if (17 == h) var B = x - 1; else 18 == h && (B = k - 1);
        m = B;
      } else if (20 == h) {
        if (x + 1 < k) h = 21; else {
          var E = 0;
          h = 22;
        }
        21 == h && (E = x + 1);
        m = E;
      }
      l = Xg(f, d, m, e, g);
      if (l <= w) break;
      x = m;
      w = l;
      z = y;
    }
    b[c] = x;
    j = w;
  }
  a = i;
  return j;
}

Ug.X = 1;

function Vg(c, f, d, e, g, i) {
  var h = a;
  a += 8;
  var j, k, l, m, n = h + 2, p = h + 4, u = h + 6;
  j = f + 21;
  k = b[g + 37];
  l = g + 5;
  m = g + 21;
  g = 0 <= e ? 1 : 2;
  1 == g && (g = e < b[f + 37] ? 3 : 2);
  2 == g && C(Yg, 151, Zg, $g);
  g = i + 2;
  J(n, d + 2, j + (e << 1));
  Og(h, g, n);
  d = 0;
  j = 3.4028234663852886e+38;
  n = 0;
  g = n < k ? 4 : 7;
  a : do if (4 == g) for (;;) if (f = O(h, m + (n << 1)), g = f < j ? 5 : 6, 5 == g && (j = f, d = n), n += 1, n >= k) break a; while (0);
  m = d;
  if (m + 1 < k) g = 8; else var s = 0, g = 9;
  8 == g && (s = m + 1);
  k = s;
  Zc(p, i, l + (m << 1));
  b[c] = b[p];
  o[c] = o[p];
  b[c + 1] = b[p + 1];
  o[c + 1] = o[p + 1];
  b[c + 2] = e & 255;
  b[c + 3] = m & 255;
  b[c + 4] = 1;
  b[c + 5] = 0;
  p = c + 3;
  Zc(u, i, l + (k << 1));
  b[p] = b[u];
  o[p] = o[u];
  b[p + 1] = b[u + 1];
  o[p + 1] = o[u + 1];
  b[c + 5] = e & 255;
  b[c + 6] = k & 255;
  b[c + 7] = 1;
  b[c + 8] = 0;
  a = h;
}

Vg.X = 1;

function Xg(c, f, d, e, g) {
  var i = a;
  a += 10;
  var h, j, k, l, m = i + 2, n, p, u = i + 4, s = i + 6, q = i + 8;
  h = c + 5;
  j = c + 21;
  k = b[e + 37];
  l = e + 5;
  e = 0 <= d ? 1 : 2;
  1 == e && (e = d < b[c + 37] ? 3 : 2);
  2 == e && C(Yg, 32, ah, $g);
  J(i, f + 2, j + (d << 1));
  Og(m, g + 2, i);
  c = 0;
  j = 3.4028234663852886e+38;
  n = 0;
  e = n < k ? 4 : 7;
  a : do if (4 == e) for (;;) if (p = O(l + (n << 1), m), e = p < j ? 5 : 6, 5 == e && (j = p, c = n), n += 1, n >= k) break a; while (0);
  Zc(u, f, h + (d << 1));
  Zc(s, g, l + (c << 1));
  K(q, s, u);
  f = O(q, i);
  a = i;
  return f;
}

Xg.X = 1;

function bh(c, f, d, e, g, i) {
  var h = a;
  a += 60;
  var j, k = h + 2, l = h + 4, m = h + 6, n = h + 8, p = h + 10, u = h + 12, s = h + 14, q = h + 16, v = h + 18, x = h + 20, w, y = h + 22, z = h + 24, B = h + 26, E = h + 28, D = h + 30, H = h + 32, I = h + 34, M = h + 36, G = h + 38, T = h + 40, R = h + 42, L = h + 44, S = h + 46, F = h + 48, X = h + 50, Z = h + 52, V = h + 54, aa = h + 56, ja = h + 58;
  j = 0 == b[f + 15] ? 12 : 1;
  a : do if (1 == j) {
    j = b[f + 14];
    if (0 == j) j = 2; else if (1 == j) j = 5; else if (2 == j) j = 8; else break;
    if (2 == j) {
      Qe(c, 1, 0);
      Zc(h, d, f + 12);
      Zc(k, g, f);
      j = 1.4210854715202004e-14 < Ig(h, k) ? 3 : 4;
      if (3 == j) {
        w = c;
        K(l, k, h);
        var Y = l;
        b[w] = b[Y];
        o[w] = o[Y];
        b[w + 1] = b[Y + 1];
        o[w + 1] = o[Y + 1];
        Cg(c);
      }
      N(n, e, c);
      P(m, h, n);
      N(u, i, c);
      K(p, k, u);
      w = c + 2;
      P(q, m, p);
      N(s, .5, q);
      Y = s;
      b[w] = b[Y];
      o[w] = o[Y];
      b[w + 1] = b[Y + 1];
      o[w + 1] = o[Y + 1];
    } else if (5 == j) {
      w = c;
      J(v, d + 2, f + 10);
      Y = v;
      b[w] = b[Y];
      o[w] = o[Y];
      b[w + 1] = b[Y + 1];
      o[w + 1] = o[Y + 1];
      Zc(x, d, f + 12);
      w = 0;
      if (w >= b[f + 15]) break a;
      for (var W = Y = c, $ = c, ga = c + 2, la = I; ; ) {
        Zc(y, g, f + 5 * w);
        var fa = e;
        K(E, y, x);
        N(B, fa - O(E, Y), W);
        P(z, y, B);
        N(H, i, $);
        K(D, y, H);
        fa = ga + (w << 1);
        P(M, z, D);
        N(I, .5, M);
        b[fa] = b[la];
        o[fa] = o[la];
        b[fa + 1] = b[la + 1];
        o[fa + 1] = o[la + 1];
        w += 1;
        if (w >= b[f + 15]) break a;
      }
    } else if (8 == j) {
      j = c;
      J(G, g + 2, f + 10);
      w = G;
      b[j] = b[w];
      o[j] = o[w];
      b[j + 1] = b[w + 1];
      o[j + 1] = o[w + 1];
      Zc(T, g, f + 12);
      w = 0;
      j = w < b[f + 15] ? 9 : 11;
      b : do if (9 == j) {
        $ = W = Y = c;
        ga = c + 2;
        for (la = V; ; ) if (Zc(R, d, f + 5 * w), fa = i, K(F, R, T), N(S, fa - O(F, Y), W), P(L, R, S), N(Z, e, $), K(X, R, Z), fa = ga + (w << 1), P(aa, X, L), N(V, .5, aa), b[fa] = b[la], o[fa] = o[la], b[fa + 1] = b[la + 1], o[fa + 1] = o[la + 1], w += 1, w >= b[f + 15]) {
          j = 11;
          break b;
        }
      } while (0);
      w = c;
      Pg(ja, c);
      Y = ja;
      b[w] = b[Y];
      o[w] = o[Y];
      b[w + 1] = b[Y + 1];
      o[w + 1] = o[Y + 1];
    }
  } while (0);
  a = h;
}

bh.X = 1;

function ch(c) {
  var f;
  if (0 < c) {
    var d = c;
    f = 2;
  } else f = 1;
  1 == f && (d = -c);
  return d;
}

function dh(c) {
  b[c + 4] = 0;
  b[c + 5] = 0;
  o[c + 6] = 0;
}

function eh(c, f, d, e) {
  1 == (0 <= d & 4 > d ? 2 : 1) && C(fh, 54, gh, hh);
  3 == (0 <= e & 4 > e ? 4 : 3) && C(fh, 55, gh, ih);
  b[jh + 12 * d + 3 * e] = c;
  b[jh + 12 * d + 3 * e + 1] = f;
  b[jh + 12 * d + 3 * e + 2] = 1;
  if (5 == (d != e ? 5 : 6)) b[jh + 12 * e + 3 * d] = c, b[jh + 12 * e + 3 * d + 1] = f, b[jh + 12 * e + 3 * d + 2] = 0;
}

eh.X = 1;

function Sg(c, f, d, e, g) {
  var i = a;
  a += 6;
  var h, j, k = i + 2, l = i + 4;
  h = 0;
  j = O(d, f) - e;
  d = O(d, f + 3) - e;
  if (0 >= j) e = 1; else var m = d, e = 2;
  1 == e && (m = h, h = m + 1, m = c + 3 * m, b[m] = b[f], o[m] = o[f], b[m + 1] = b[f + 1], o[m + 1] = o[f + 1], b[m + 2] = b[f + 2], o[m + 2] = o[f + 2], m = d);
  if (3 == (0 >= m ? 3 : 4)) m = h, h = m + 1, m = c + 3 * m, e = f + 3, b[m] = b[e], o[m] = o[e], b[m + 1] = b[e + 1], o[m + 1] = o[e + 1], b[m + 2] = b[e + 2], o[m + 2] = o[e + 2];
  if (5 == (0 > j * d ? 5 : 6)) j /= j - d, d = c + 3 * h, K(l, f + 3, f), N(k, j, l), P(i, f, k), b[d] = b[i], o[d] = o[i], b[d + 1] = b[i + 1], o[d + 1] = o[i + 1], b[c + 3 * h + 2] = g & 255, b[c + 3 * h + 2 + 1] = b[f + 3], b[c + 3 * h + 2 + 2] = 0, b[c + 3 * h + 2 + 3] = 1, h += 1;
  a = i;
  return h;
}

Sg.X = 1;

function kh(c, f, d, e, g) {
  var i, h, j, k, l;
  i = 0 == (b[lh] & 1) ? 1 : 2;
  1 == i && (eh(2, 4, 0, 0), eh(6, 8, 2, 0), eh(10, 12, 2, 2), eh(14, 16, 1, 0), eh(18, 20, 1, 2), eh(22, 24, 3, 0), eh(26, 28, 3, 2), b[lh] = 1);
  j = te(c);
  k = te(d);
  3 == (0 <= j & 4 > j ? 4 : 3) && C(fh, 80, mh, hh);
  5 == (0 <= k & 4 > k ? 6 : 5) && C(fh, 81, mh, ih);
  l = b[jh + 12 * j + 3 * k];
  i = 0 != b[jh + 12 * j + 3 * k] ? 7 : 10;
  7 == i ? (i = b[jh + 12 * j + 3 * k + 2] & 1 ? 8 : 9, 8 == i ? h = mb[l](c, f, d, e, g) : 9 == i && (h = mb[l](d, e, c, f, g))) : 10 == i && (h = 0);
  return h;
}

kh.X = 1;

function nh(c, f) {
  var d, e, g;
  d = 1 == (b[lh] & 1) ? 2 : 1;
  1 == d && C(fh, 103, oh, ph);
  d = 0 < b[c + 31] ? 3 : 4;
  3 == d && (Vc(qh(b[c + 12]), 1), Vc(qh(b[c + 13]), 1));
  e = te(b[c + 12]);
  g = te(b[c + 13]);
  d = 0 <= e ? 5 : 6;
  5 == d && (d = 4 > g ? 7 : 6);
  6 == d && C(fh, 114, oh, rh);
  d = 0 <= e ? 8 : 9;
  8 == d && (d = 4 > g ? 10 : 9);
  9 == d && C(fh, 115, oh, rh);
  mb[b[jh + 12 * e + 3 * g + 1]](c, f);
}

nh.X = 1;

function qh(c) {
  return b[c + 2];
}

function sh(c) {
  Zd(c);
  b[c + 15] = 0;
  b[c + 16] = 0;
  b[c + 17] = th;
  b[c + 18] = uh;
  b[c + 19] = 0;
}

function re(c, f, d, e, g) {
  b[c] = vh + 2;
  b[c + 1] = 4;
  b[c + 12] = f;
  b[c + 13] = e;
  b[c + 14] = d;
  b[c + 15] = g;
  b[c + 31] = 0;
  b[c + 2] = 0;
  b[c + 3] = 0;
  b[c + 5] = 0;
  b[c + 6] = 0;
  b[c + 7] = 0;
  b[c + 4] = 0;
  b[c + 9] = 0;
  b[c + 10] = 0;
  b[c + 11] = 0;
  b[c + 8] = 0;
  b[c + 32] = 0;
  f = Bg(o[b[c + 12] + 4] * o[b[c + 13] + 4]);
  o[c + 34] = f;
  o[c + 35] = o[b[c + 12] + 5] > o[b[c + 13] + 5] ? o[b[c + 12] + 5] : o[b[c + 13] + 5];
}

re.X = 1;

function wh(c, f) {
  var d = a;
  a += 17;
  var e, g, i, h, j, k, l, m, n, p, u = d + 16, s, q;
  i = e = c + 16;
  e += 16;
  for (h = d; i < e; i++, h++) b[h] = b[i], o[h] = o[i];
  b[c + 1] |= 4;
  g = 0;
  i = 2 == (b[c + 1] & 2);
  e = b[b[c + 12] + 11] & 1;
  h = b[b[c + 13] + 11] & 1;
  e & 1 ? (j = 1, e = 2) : e = 1;
  1 == e && (j = h & 1);
  h = qh(b[c + 12]);
  k = qh(b[c + 13]);
  l = h + 3;
  m = k + 3;
  e = j & 1 ? 3 : 4;
  do if (3 == e) {
    n = je(b[c + 12]);
    g = je(b[c + 13]);
    var v = n, x = b[c + 14], w = g, y = b[c + 15], z = l;
    n = m;
    g = a;
    a += 37;
    p = g + 23;
    s = g + 31;
    var B = g;
    dh(B);
    dh(B + 7);
    xh(g, v, x);
    xh(g + 7, w, y);
    v = g + 14;
    b[v] = b[z];
    o[v] = o[z];
    b[v + 1] = b[z + 1];
    o[v + 1] = o[z + 1];
    b[v + 2] = b[z + 2];
    o[v + 2] = o[z + 2];
    b[v + 3] = b[z + 3];
    o[v + 3] = o[z + 3];
    v = g + 18;
    b[v] = b[n];
    o[v] = o[n];
    b[v + 1] = b[n + 1];
    o[v + 1] = o[n + 1];
    b[v + 2] = b[n + 2];
    o[v + 2] = o[n + 2];
    b[v + 3] = b[n + 3];
    o[v + 3] = o[n + 3];
    b[g + 22] = 1;
    b[p + 1] = 0;
    yh(s, p, g);
    n = 11920928955078125e-22 > o[s + 4];
    a = g;
    g = n;
    b[c + 31] = 0;
  } else if (4 == e) {
    mb[b[b[c]]](c, c + 16, l, m);
    g = 0 < b[c + 31];
    n = 0;
    v = c + 31;
    e = n < b[v] ? 5 : 12;
    a : do if (5 == e) {
      x = c + 16;
      z = u;
      w = d + 15;
      y = d;
      for (B = u; ; ) {
        p = x + 5 * n;
        o[p + 2] = 0;
        o[p + 3] = 0;
        b[z] = b[p + 4];
        o[z] = o[p + 4];
        for (s = 0; ; ) {
          if (s >= b[w]) {
            e = 11;
            break;
          }
          q = y + 5 * s;
          if (b[q + 4] == b[B]) {
            e = 9;
            break;
          }
          s += 1;
        }
        9 == e && (o[p + 2] = o[q + 2], o[p + 3] = o[q + 3]);
        n += 1;
        if (n >= b[v]) {
          e = 12;
          break a;
        }
      }
    } while (0);
    (g & 1) == (i & 1) ? e = 14 : (Vc(h, 1), Vc(k, 1));
  } while (0);
  u = b[c + 1];
  e = g & 1 ? 15 : 16;
  15 == e ? b[c + 1] = u | 2 : 16 == e && (b[c + 1] = u & -3);
  if (18 == (0 == (i & 1) ? 18 : 21) && 1 == (g & 1) && 0 != f) mb[b[b[f] + 2]](f, c);
  if (22 == (1 == (i & 1) ? 22 : 25) && 0 == (g & 1) && 0 != f) mb[b[b[f] + 3]](f, c);
  if (26 == (0 == (j & 1) ? 26 : 29) && g & 1 && 0 != f) mb[b[b[f] + 4]](f, c, d);
  a = d;
}

wh.X = 1;

function zh(c, f) {
  var d, e, g;
  e = b[f + 12];
  g = b[f + 13];
  e = qh(e);
  g = qh(g);
  d = 0 != b[c + 18] ? 1 : 3;
  1 == d && 2 == (b[f + 1] & 2) && (d = b[c + 18], mb[b[b[d] + 3]](d, f));
  d = 0 != b[f + 2] ? 4 : 5;
  4 == d && (b[b[f + 2] + 3] = b[f + 3]);
  d = 0 != b[f + 3] ? 6 : 7;
  6 == d && (b[b[f + 3] + 2] = b[f + 2]);
  d = f == b[c + 15] ? 8 : 9;
  8 == d && (b[c + 15] = b[f + 3]);
  d = 0 != b[f + 6] ? 10 : 11;
  10 == d && (b[b[f + 6] + 3] = b[f + 7]);
  d = 0 != b[f + 7] ? 12 : 13;
  12 == d && (b[b[f + 7] + 2] = b[f + 6]);
  d = f + 4 == b[e + 28] ? 14 : 15;
  14 == d && (b[e + 28] = b[f + 7]);
  d = 0 != b[f + 10] ? 16 : 17;
  16 == d && (b[b[f + 10] + 3] = b[f + 11]);
  d = 0 != b[f + 11] ? 18 : 19;
  18 == d && (b[b[f + 11] + 2] = b[f + 10]);
  d = f + 8 == b[g + 28] ? 20 : 21;
  20 == d && (b[g + 28] = b[f + 11]);
  nh(f, b[c + 19]);
  b[c + 16] -= 1;
}

zh.X = 1;

function Ah(c) {
  return 2 == (b[c + 1] & 2);
}

function Bh(c, f) {
  var d;
  d = 0 <= f ? 1 : 2;
  1 == d && (d = f < b[c + 3] ? 3 : 2);
  2 == d && C(Ch, 159, Dh, Eh);
  return b[c + 1] + 9 * f;
}

function Fh(c) {
  var f, d, e, g, i, h, j, k, l, m;
  d = b[c + 15];
  f = 0 != b[c + 15] ? 1 : 21;
  a : do if (1 == f) for (var n = c + 17, p = c + 17, u = c, s = c + 18; ; ) {
    e = b[d + 12];
    g = b[d + 13];
    i = b[d + 14];
    h = b[d + 15];
    j = qh(e);
    k = qh(g);
    f = 0 != (b[d + 1] & 8) ? 4 : 10;
    b : do if (4 == f) if (f = 0 == Yd(k, j) ? 5 : 6, 5 == f) {
      f = d;
      d = b[f + 3];
      zh(c, f);
      f = 2;
      break b;
    } else if (6 == f) {
      f = 0 != b[n] ? 7 : 9;
      do if (7 == f) if (f = b[p], 0 != mb[b[b[f] + 2]](f, e, g)) f = 9; else {
        f = d;
        d = b[f + 3];
        zh(c, f);
        f = 2;
        break b;
      } while (0);
      b[d + 1] &= -9;
      f = 10;
      break b;
    } while (0);
    b : do if (10 == f) {
      if (Ah(j)) f = 11; else {
        var q = 0;
        f = 12;
      }
      11 == f && (q = 0 != b[j]);
      l = q;
      if (Ah(k)) f = 13; else {
        var v = 0;
        f = 14;
      }
      13 == f && (v = 0 != b[k]);
      m = v;
      f = 0 == (l & 1) ? 15 : 18;
      do if (15 == f) if (0 != (m & 1)) f = 18; else {
        var x = b[d + 3];
        d = x;
        f = 17;
        break b;
      } while (0);
      f = b[b[e + 6] + 7 * i + 6];
      m = b[b[g + 6] + 7 * h + 6];
      l = u;
      var w = m;
      m = ba;
      m = Bh(l, f);
      f = Bh(l, w);
      f = Gh(m, f);
      l = d;
      f = 0 == (f & 1) ? 19 : 20;
      if (19 == f) {
        e = l;
        d = b[e + 3];
        zh(c, e);
        f = 2;
        break b;
      } else if (20 == f) {
        wh(l, b[s]);
        d = x = b[d + 3];
        f = 17;
        break b;
      }
    } while (0);
    2 == f && (x = d);
    if (0 == x) break a;
  } while (0);
}

Fh.X = 1;

function Hh(c, f) {
  var d = a;
  a += 1;
  var e, g, i, h, j, k;
  g = b[c + 13] = 0;
  h = c + 10;
  e = g < b[h] ? 1 : 5;
  a : do if (1 == e) for (var l = c + 8, m = c + 14, n = c, p = c + 14, u = c; ; ) if (e = b[b[l] + g], b[m] = e, e = -1 == e ? 4 : 3, 3 == e && (i = Bh(n, b[p]), Ih(u, c, i)), g += 1, g >= b[h]) break a; while (0);
  b[c + 10] = 0;
  g = b[c + 11] + 3 * b[c + 13];
  e = b[c + 11];
  b[d] = 34;
  Jh(e, g, d);
  g = 0;
  l = c + 13;
  e = g < b[l] ? 6 : 13;
  a : do if (6 == e) {
    m = c + 11;
    p = n = c;
    u = c + 11;
    for (i = c + 13; ; ) {
      h = b[m] + 3 * g;
      j = Kh(n, b[h]);
      k = Kh(p, b[h + 1]);
      Lh(f, j, k);
      for (g += 1; ; ) {
        if (g >= b[i]) {
          e = 7;
          break;
        }
        j = b[u] + 3 * g;
        if (b[j] != b[h]) {
          e = 7;
          break;
        }
        if (b[j + 1] != b[h + 1]) {
          e = 7;
          break;
        }
        g += 1;
      }
      if (g >= b[l]) break a;
    }
  } while (0);
  a = d;
}

Hh.X = 1;

function Lh(c, f, d) {
  var e, g, i, h, j, k, l, m, n, p;
  g = b[f + 4];
  i = b[d + 4];
  f = b[f + 5];
  d = b[d + 5];
  h = qh(g);
  j = qh(i);
  e = h == j ? 24 : 1;
  a : do if (1 == e) {
    for (k = e = b[j + 28]; 0 != e; ) {
      e = b[k] == h ? 4 : 12;
      do if (4 == e) {
        l = b[b[k + 1] + 12];
        m = b[b[k + 1] + 13];
        n = b[b[k + 1] + 14];
        p = b[b[k + 1] + 15];
        e = l == g ? 5 : 8;
        do if (5 == e) if (m != i) e = 8; else if (n != f) e = 8; else if (p == d) break a; while (0);
        if (l != i) e = 12; else if (m != g) e = 12; else if (n != d) e = 12; else if (p == f) break a;
      } while (0);
      k = e = b[k + 3];
    }
    if (0 == Yd(j, h)) e = 24; else {
      e = 0 != b[c + 17] ? 15 : 16;
      if (15 == e && (k = b[c + 17], 0 == mb[b[b[k] + 2]](k, g, i))) break a;
      k = e = kh(g, f, i, d, b[c + 19]);
      0 == e ? e = 24 : (g = b[k + 12], i = b[k + 13], f = b[k + 14], d = b[k + 15], h = qh(g), j = qh(i), b[k + 2] = 0, b[k + 3] = b[c + 15], e = 0 != b[c + 15] ? 18 : 19, 18 == e && (b[b[c + 15] + 2] = k), b[c + 15] = k, b[k + 5] = k, b[k + 4] = j, b[k + 6] = 0, b[k + 7] = b[h + 28], e = 0 != b[h + 28] ? 20 : 21, 20 == e && (b[b[h + 28] + 2] = k + 4), b[h + 28] = k + 4, b[k + 9] = k, b[k + 8] = h, b[k + 10] = 0, b[k + 11] = b[j + 28], e = 0 != b[j + 28] ? 22 : 23, 22 == e && (b[b[j + 28] + 2] = k + 8), b[j + 28] = k + 8, Vc(h, 1), Vc(j, 1), b[c + 16] += 1);
    }
  } while (0);
}

Lh.X = 1;

function Ih(c, f, d) {
  var e = a;
  a += 259;
  var g, i, h;
  b[e] = e + 1;
  b[e + 257] = 0;
  b[e + 258] = 256;
  Mh(e, c);
  c += 1;
  a : for (; 0 < b[e + 257]; ) {
    g = e;
    1 == (0 < b[g + 257] ? 2 : 1) && C(Nh, 67, Oh, Ph);
    b[g + 257] -= 1;
    i = b[b[g] + b[g + 257]];
    if (-1 != i && (h = b[c] + 9 * i, Gh(h, d))) if (g = -1 == b[h + 6] ? 7 : 9, 7 == g) {
      if (g = pe(f, i), 0 == (g & 1)) break a;
    } else 9 == g && (Mh(e, h + 6), Mh(e, h + 7));
  }
  if (1 == (b[e] != e + 1 ? 1 : 2)) b[e] = 0;
  a = e;
}

Ih.X = 1;

function Kh(c, f) {
  var d;
  d = 0 <= f ? 1 : 2;
  1 == d && (d = f < b[c + 3] ? 3 : 2);
  2 == d && C(Ch, 153, Qh, Eh);
  return b[b[c + 1] + 9 * f + 4];
}

function Jh(c, f, d) {
  var e = a;
  a += 18;
  var g, i, h, j, k, l, m = e + 3, n = e + 6, p = e + 9, u = e + 12, s = e + 15, q, v;
  a : for (;;) {
    q = h = (f - c) / 12 | 0;
    if (0 == h) {
      g = 49;
      break;
    } else if (1 == h) {
      g = 49;
      break;
    } else if (2 == h) {
      g = 2;
      break;
    } else if (3 == h) {
      g = 4;
      break;
    } else if (4 == h) {
      g = 5;
      break;
    } else if (5 == h) {
      g = 6;
      break;
    }
    var x = c;
    if (30 >= q) {
      g = 8;
      break;
    }
    i = x;
    h = f;
    h -= 3;
    l = q / 2 | 0;
    i += 3 * l;
    g = 1e3 <= q ? 10 : 11;
    10 == g ? (l = l / 2 | 0, v = Rh(c, c + 3 * l, i, i + 3 * l, h, d)) : 11 == g && (v = Sh(c, i, h, d));
    q = c;
    g = mb[b[d]](q, i) ? 28 : 13;
    if (13 == g) {
      for (;;) {
        h = l = h - 3;
        if (q == l) {
          g = 14;
          break;
        }
        if (mb[b[d]](h, i)) {
          g = 27;
          break;
        }
      }
      if (14 == g) {
        q += 3;
        h = f;
        i = b[d];
        h = g = h - 3;
        g = mb[i](c, g) ? 19 : 15;
        if (15 == g) {
          for (;;) {
            if (q == h) {
              g = 49;
              break a;
            }
            i = mb[b[d]](c, q);
            var w = q;
            if (i) break;
            q = w + 3;
          }
          g = w;
          i = h;
          l = g;
          b[u] = b[l];
          o[u] = o[l];
          b[u + 1] = b[l + 1];
          o[u + 1] = o[l + 1];
          b[u + 2] = b[l + 2];
          o[u + 2] = o[l + 2];
          l = i;
          b[g] = b[l];
          o[g] = o[l];
          b[g + 1] = b[l + 1];
          o[g + 1] = o[l + 1];
          b[g + 2] = b[l + 2];
          o[g + 2] = o[l + 2];
          g = u;
          b[i] = b[g];
          o[i] = o[g];
          b[i + 1] = b[g + 1];
          o[i + 1] = o[g + 1];
          b[i + 2] = b[g + 2];
          o[i + 2] = o[g + 2];
          v += 1;
          q += 3;
        }
        if (q == h) {
          g = 49;
          break a;
        }
        b : for (;;) if (g = mb[b[d]](c, q) ^ 1 ? 21 : 22, 21 == g) q += 3; else if (22 == g) {
          for (;;) {
            var y = b[d];
            h = i = h - 3;
            if (!mb[y](c, i)) break;
          }
          y = q;
          if (q >= h) break b;
          g = y;
          i = h;
          l = g;
          b[p] = b[l];
          o[p] = o[l];
          b[p + 1] = b[l + 1];
          o[p + 1] = o[l + 1];
          b[p + 2] = b[l + 2];
          o[p + 2] = o[l + 2];
          l = i;
          b[g] = b[l];
          o[g] = o[l];
          b[g + 1] = b[l + 1];
          o[g + 1] = o[l + 1];
          b[g + 2] = b[l + 2];
          o[g + 2] = o[l + 2];
          g = p;
          b[i] = b[g];
          o[i] = o[g];
          b[i + 1] = b[g + 1];
          o[i + 1] = o[g + 1];
          b[i + 2] = b[g + 2];
          o[i + 2] = o[g + 2];
          v += 1;
          q += 3;
        }
        c = y;
        g = 1;
        continue a;
      } else 27 == g && (l = q, g = h, k = l, b[n] = b[k], o[n] = o[k], b[n + 1] = b[k + 1], o[n + 1] = o[k + 1], b[n + 2] = b[k + 2], o[n + 2] = o[k + 2], k = g, b[l] = b[k], o[l] = o[k], b[l + 1] = b[k + 1], o[l + 1] = o[k + 1], b[l + 2] = b[k + 2], o[l + 2] = o[k + 2], l = n, b[g] = b[l], o[g] = o[l], b[g + 1] = b[l + 1], o[g + 1] = o[l + 1], b[g + 2] = b[l + 2], o[g + 2] = o[l + 2], v += 1);
    }
    q += 3;
    g = q < h ? 29 : 36;
    b : do if (29 == g) for (;;) if (g = mb[b[d]](q, i) ? 30 : 31, 30 == g) q += 3; else if (31 == g) {
      for (; !(g = b[d], h = l = h - 3, !(mb[g](l, i) ^ 1)); ) ;
      if (q > h) break b;
      l = q;
      g = h;
      k = l;
      b[m] = b[k];
      o[m] = o[k];
      b[m + 1] = b[k + 1];
      o[m + 1] = o[k + 1];
      b[m + 2] = b[k + 2];
      o[m + 2] = o[k + 2];
      k = g;
      b[l] = b[k];
      o[l] = o[k];
      b[l + 1] = b[k + 1];
      o[l + 1] = o[k + 1];
      b[l + 2] = b[k + 2];
      o[l + 2] = o[k + 2];
      l = m;
      b[g] = b[l];
      o[g] = o[l];
      b[g + 1] = b[l + 1];
      o[g + 1] = o[l + 1];
      b[g + 2] = b[l + 2];
      o[g + 2] = o[l + 2];
      v += 1;
      g = i == q ? 34 : 35;
      34 == g && (i = h);
      q += 3;
    } while (0);
    g = q != i ? 37 : 39;
    37 == g && (mb[b[d]](i, q) ? (h = q, j = i, i = h, b[e] = b[i], o[e] = o[i], b[e + 1] = b[i + 1], o[e + 1] = o[i + 1], b[e + 2] = b[i + 2], o[e + 2] = o[i + 2], i = j, b[h] = b[i], o[h] = o[i], b[h + 1] = b[i + 1], o[h + 1] = o[i + 1], b[h + 2] = b[i + 2], o[h + 2] = o[i + 2], h = e, b[j] = b[h], o[j] = o[h], b[j + 1] = b[h + 1], o[j + 1] = o[h + 1], b[j + 2] = b[h + 2], o[j + 2] = o[h + 2], v = j = v + 1, g = 40) : g = 39);
    39 == g && (j = v);
    g = 0 == j ? 41 : 46;
    b : do if (41 == g) if (i = Xh(c, q, d), h = Xh(q + 3, f, d), i &= 1, g = h ? 42 : 44, 42 == g) {
      if (i) {
        g = 49;
        break a;
      }
      f = q;
      g = 1;
      continue a;
    } else if (44 == g) {
      if (!i) break b;
      c = q + 3;
      g = 1;
      continue a;
    } while (0);
    g = ((q - c) / 12 | 0) < ((f - q) / 12 | 0) ? 47 : 48;
    47 == g ? (Jh(c, q, d), c = q + 3) : 48 == g && (Jh(q + 3, f, d), f = q);
  }
  2 == g ? (d = b[d], f = m = f - 3, mb[d](m, c) && (b[s] = b[c], o[s] = o[c], b[s + 1] = b[c + 1], o[s + 1] = o[c + 1], b[s + 2] = b[c + 2], o[s + 2] = o[c + 2], b[c] = b[f], o[c] = o[f], b[c + 1] = b[f + 1], o[c + 1] = o[f + 1], b[c + 2] = b[f + 2], o[c + 2] = o[f + 2], b[f] = b[s], o[f] = o[s], b[f + 1] = b[s + 1], o[f + 1] = o[s + 1], b[f + 2] = b[s + 2], o[f + 2] = o[s + 2])) : 4 == g ? Sh(c, c + 3, f - 3, d) : 5 == g ? Yh(c, c + 3, c + 6, f - 3, d) : 6 == g ? Rh(c, c + 3, c + 6, c + 9, f - 3, d) : 8 == g && Zh(x, f, d);
  a = e;
}

Jh.X = 1;

function Sh(c, f, d, e) {
  var g = a;
  a += 15;
  var i, h = g + 3, j = g + 6, k = g + 9, l = g + 12, m, n;
  n = 0;
  i = mb[b[e]](f, c);
  var p = mb[b[e]](d, f);
  i = i ? 6 : 1;
  6 == i ? (i = p ? 7 : 8, 7 == i ? (b[g] = b[c], o[g] = o[c], b[g + 1] = b[c + 1], o[g + 1] = o[c + 1], b[g + 2] = b[c + 2], o[g + 2] = o[c + 2], b[c] = b[d], o[c] = o[d], b[c + 1] = b[d + 1], o[c + 1] = o[d + 1], b[c + 2] = b[d + 2], o[c + 2] = o[d + 2], b[d] = b[g], o[d] = o[g], b[d + 1] = b[g + 1], o[d + 1] = o[g + 1], b[d + 2] = b[g + 2], o[d + 2] = o[g + 2], m = 1) : 8 == i && (b[h] = b[c], o[h] = o[c], b[h + 1] = b[c + 1], o[h + 1] = o[c + 1], b[h + 2] = b[c + 2], o[h + 2] = o[c + 2], b[c] = b[f], o[c] = o[f], b[c + 1] = b[f + 1], o[c + 1] = o[f + 1], b[c + 2] = b[f + 2], o[c + 2] = o[f + 2], b[f] = b[h], o[f] = o[h], b[f + 1] = b[h + 1], o[f + 1] = o[h + 1], b[f + 2] = b[h + 2], o[f + 2] = o[h + 2], n = 1, i = mb[b[e]](d, f) ? 9 : 10, 9 == i && (b[k] = b[f], o[k] = o[f], b[k + 1] = b[f + 1], o[k + 1] = o[f + 1], b[k + 2] = b[f + 2], o[k + 2] = o[f + 2], b[f] = b[d], o[f] = o[d], b[f + 1] = b[d + 1], o[f + 1] = o[d + 1], b[f + 2] = b[d + 2], o[f + 2] = o[d + 2], b[d] = b[k], o[d] = o[k], b[d + 1] = b[k + 1], o[d + 1] = o[k + 1], b[d + 2] = b[k + 2], o[d + 2] = o[k + 2], n = 2), m = n)) : 1 == i && (i = p ? 3 : 2, 3 == i ? (b[l] = b[f], o[l] = o[f], b[l + 1] = b[f + 1], o[l + 1] = o[f + 1], b[l + 2] = b[f + 2], o[l + 2] = o[f + 2], b[f] = b[d], o[f] = o[d], b[f + 1] = b[d + 1], o[f + 1] = o[d + 1], b[f + 2] = b[d + 2], o[f + 2] = o[d + 2], b[d] = b[l], o[d] = o[l], b[d + 1] = b[l + 1], o[d + 1] = o[l + 1], b[d + 2] = b[l + 2], o[d + 2] = o[l + 2], n = 1, i = mb[b[e]](f, c) ? 4 : 5, 4 == i && (b[j] = b[c], o[j] = o[c], b[j + 1] = b[c + 1], o[j + 1] = o[c + 1], b[j + 2] = b[c + 2], o[j + 2] = o[c + 2], b[c] = b[f], o[c] = o[f], b[c + 1] = b[f + 1], o[c + 1] = o[f + 1], b[c + 2] = b[f + 2], o[c + 2] = o[f + 2], b[f] = b[j], o[f] = o[j], b[f + 1] = b[j + 1], o[f + 1] = o[j + 1], b[f + 2] = b[j + 2], o[f + 2] = o[j + 2], n = 2), m = n) : 2 == i && (m = n));
  a = g;
  return m;
}

Sh.X = 1;

function Yh(c, f, d, e, g) {
  var i = a;
  a += 9;
  var h = i + 3, j = i + 6, k;
  k = Sh(c, f, d, g);
  if (1 == (mb[b[g]](e, d) ? 1 : 4)) b[j] = b[d], o[j] = o[d], b[j + 1] = b[d + 1], o[j + 1] = o[d + 1], b[j + 2] = b[d + 2], o[j + 2] = o[d + 2], b[d] = b[e], o[d] = o[e], b[d + 1] = b[e + 1], o[d + 1] = o[e + 1], b[d + 2] = b[e + 2], o[d + 2] = o[e + 2], b[e] = b[j], o[e] = o[j], b[e + 1] = b[j + 1], o[e + 1] = o[j + 1], b[e + 2] = b[j + 2], o[e + 2] = o[j + 2], k += 1, mb[b[g]](d, f) && (b[i] = b[f], o[i] = o[f], b[i + 1] = b[f + 1], o[i + 1] = o[f + 1], b[i + 2] = b[f + 2], o[i + 2] = o[f + 2], b[f] = b[d], o[f] = o[d], b[f + 1] = b[d + 1], o[f + 1] = o[d + 1], b[f + 2] = b[d + 2], o[f + 2] = o[d + 2], b[d] = b[i], o[d] = o[i], b[d + 1] = b[i + 1], o[d + 1] = o[i + 1], b[d + 2] = b[i + 2], o[d + 2] = o[i + 2], k += 1, mb[b[g]](f, c) && (b[h] = b[c], o[h] = o[c], b[h + 1] = b[c + 1], o[h + 1] = o[c + 1], b[h + 2] = b[c + 2], o[h + 2] = o[c + 2], b[c] = b[f], o[c] = o[f], b[c + 1] = b[f + 1], o[c + 1] = o[f + 1], b[c + 2] = b[f + 2], o[c + 2] = o[f + 2], b[f] = b[h], o[f] = o[h], b[f + 1] = b[h + 1], o[f + 1] = o[h + 1], b[f + 2] = b[h + 2], o[f + 2] = o[h + 2], k += 1));
  a = i;
  return k;
}

Yh.X = 1;

function Rh(c, f, d, e, g, i) {
  var h = a;
  a += 12;
  var j = h + 3, k = h + 6, l = h + 9, m;
  m = Yh(c, f, d, e, i);
  if (1 == (mb[b[i]](g, e) ? 1 : 5)) b[l] = b[e], o[l] = o[e], b[l + 1] = b[e + 1], o[l + 1] = o[e + 1], b[l + 2] = b[e + 2], o[l + 2] = o[e + 2], b[e] = b[g], o[e] = o[g], b[e + 1] = b[g + 1], o[e + 1] = o[g + 1], b[e + 2] = b[g + 2], o[e + 2] = o[g + 2], b[g] = b[l], o[g] = o[l], b[g + 1] = b[l + 1], o[g + 1] = o[l + 1], b[g + 2] = b[l + 2], o[g + 2] = o[l + 2], m += 1, mb[b[i]](e, d) && (b[j] = b[d], o[j] = o[d], b[j + 1] = b[d + 1], o[j + 1] = o[d + 1], b[j + 2] = b[d + 2], o[j + 2] = o[d + 2], b[d] = b[e], o[d] = o[e], b[d + 1] = b[e + 1], o[d + 1] = o[e + 1], b[d + 2] = b[e + 2], o[d + 2] = o[e + 2], b[e] = b[j], o[e] = o[j], b[e + 1] = b[j + 1], o[e + 1] = o[j + 1], b[e + 2] = b[j + 2], o[e + 2] = o[j + 2], m += 1, mb[b[i]](d, f) && (b[h] = b[f], o[h] = o[f], b[h + 1] = b[f + 1], o[h + 1] = o[f + 1], b[h + 2] = b[f + 2], o[h + 2] = o[f + 2], b[f] = b[d], o[f] = o[d], b[f + 1] = b[d + 1], o[f + 1] = o[d + 1], b[f + 2] = b[d + 2], o[f + 2] = o[d + 2], b[d] = b[h], o[d] = o[h], b[d + 1] = b[h + 1], o[d + 1] = o[h + 1], b[d + 2] = b[h + 2], o[d + 2] = o[h + 2], m += 1, mb[b[i]](f, c) && (b[k] = b[c], o[k] = o[c], b[k + 1] = b[c + 1], o[k + 1] = o[c + 1], b[k + 2] = b[c + 2], o[k + 2] = o[c + 2], b[c] = b[f], o[c] = o[f], b[c + 1] = b[f + 1], o[c + 1] = o[f + 1], b[c + 2] = b[f + 2], o[c + 2] = o[f + 2], b[f] = b[k], o[f] = o[k], b[f + 1] = b[k + 1], o[f + 1] = o[k + 1], b[f + 2] = b[k + 2], o[f + 2] = o[k + 2], m += 1)));
  a = h;
  return m;
}

Rh.X = 1;

function Zh(c, f, d) {
  var e = a;
  a += 3;
  var g, i, h, j, k;
  j = c + 6;
  Sh(c, c + 3, j, d);
  k = j + 3;
  g = k != f ? 1 : 8;
  a : do if (1 == g) for (var l = e; ; ) {
    g = mb[b[d]](k, j) ? 3 : 7;
    if (3 == g) {
      h = k;
      b[l] = b[h];
      o[l] = o[h];
      b[l + 1] = b[h + 1];
      o[l + 1] = o[h + 1];
      b[l + 2] = b[h + 2];
      o[l + 2] = o[h + 2];
      h = j;
      for (j = k; ; ) {
        i = h;
        b[j] = b[i];
        o[j] = o[i];
        b[j + 1] = b[i + 1];
        o[j + 1] = o[i + 1];
        b[j + 2] = b[i + 2];
        o[j + 2] = o[i + 2];
        j = h;
        if (j == c) {
          g = 6;
          break;
        }
        i = b[d];
        var m = h - 3;
        h = m;
        if (!mb[i](e, m)) {
          g = 6;
          break;
        }
      }
      h = e;
      b[j] = b[h];
      o[j] = o[h];
      b[j + 1] = b[h + 1];
      o[j + 1] = o[h + 1];
      b[j + 2] = b[h + 2];
      o[j + 2] = o[h + 2];
    }
    j = k;
    k += 3;
    if (k == f) break a;
  } while (0);
  a = e;
}

Zh.X = 1;

function Gh(c, f) {
  var d = a;
  a += 8;
  var e, g, i = d + 2;
  e = d + 4;
  var h = d + 6;
  K(e, f, c + 2);
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  K(h, c, f + 2);
  b[i] = b[h];
  o[i] = o[h];
  b[i + 1] = b[h + 1];
  o[i + 1] = o[h + 1];
  e = 0 < o[d] ? 2 : 1;
  a : do if (1 == e) if (0 < o[d + 1]) e = 2; else {
    e = 0 < o[i] ? 5 : 4;
    do if (4 == e) if (0 < o[i + 1]) e = 5; else {
      g = 1;
      e = 7;
      break a;
    } while (0);
    g = 0;
    e = 7;
  } while (0);
  2 == e && (g = 0);
  a = d;
  return g;
}

Gh.X = 1;

function $h(c) {
  o[c] = 0;
  o[c + 2] = 0;
  o[c + 1] = 0;
  o[c + 3] = 0;
}

function ai(c) {
  bi(b[c + 8], b[c + 10]);
  bi(b[c + 8], b[c + 9]);
}

function Xh(c, f, d) {
  var e = a;
  a += 6;
  var g, i, h, j, k, l, m, n = e + 3;
  g = (f - c) / 12 | 0;
  g = 0 == g ? 1 : 1 == g ? 1 : 2 == g ? 2 : 3 == g ? 5 : 4 == g ? 6 : 5 == g ? 7 : 8;
  if (8 == g) {
    k = c + 6;
    Sh(c, c + 3, k, d);
    l = 0;
    m = k + 3;
    a : for (;;) {
      if (m == f) {
        g = 17;
        break;
      }
      g = mb[b[d]](m, k) ? 11 : 16;
      if (11 == g) {
        h = m;
        b[n] = b[h];
        o[n] = o[h];
        b[n + 1] = b[h + 1];
        o[n + 1] = o[h + 1];
        b[n + 2] = b[h + 2];
        o[n + 2] = o[h + 2];
        h = k;
        for (k = m; ; ) {
          i = h;
          b[k] = b[i];
          o[k] = o[i];
          b[k + 1] = b[i + 1];
          o[k + 1] = o[i + 1];
          b[k + 2] = b[i + 2];
          o[k + 2] = o[i + 2];
          k = h;
          if (k == c) {
            g = 14;
            break;
          }
          i = b[d];
          var p = h - 3;
          h = p;
          if (!mb[i](n, p)) {
            g = 14;
            break;
          }
        }
        h = n;
        b[k] = b[h];
        o[k] = o[h];
        b[k + 1] = b[h + 1];
        o[k + 1] = o[h + 1];
        b[k + 2] = b[h + 2];
        o[k + 2] = o[h + 2];
        l = k = l + 1;
        if (8 == k) {
          g = 15;
          break a;
        }
      }
      k = m;
      m += 3;
    }
    17 == g ? j = 1 : 15 == g && (j = m + 3 == f);
  } else 1 == g ? j = 1 : 2 == g ? (d = b[d], f = j = f - 3, g = mb[d](j, c) ? 3 : 4, 3 == g && (b[e] = b[c], o[e] = o[c], b[e + 1] = b[c + 1], o[e + 1] = o[c + 1], b[e + 2] = b[c + 2], o[e + 2] = o[c + 2], b[c] = b[f], o[c] = o[f], b[c + 1] = b[f + 1], o[c + 1] = o[f + 1], b[c + 2] = b[f + 2], o[c + 2] = o[f + 2], b[f] = b[e], o[f] = o[e], b[f + 1] = b[e + 1], o[f + 1] = o[e + 1], b[f + 2] = b[e + 2], o[f + 2] = o[e + 2]), j = 1) : 5 == g ? (Sh(c, c + 3, f - 3, d), j = 1) : 6 == g ? (Yh(c, c + 3, c + 6, f - 3, d), j = 1) : 7 == g && (Rh(c, c + 3, c + 6, c + 9, f - 3, d), j = 1);
  a = e;
  return j;
}

Xh.X = 1;

function Mh(c, f) {
  var d;
  if (1 == (b[c + 257] == b[c + 258] ? 1 : 3)) {
    d = b[c];
    b[c + 258] <<= 1;
    var e = db(b[c + 258] << 2);
    b[c] = e;
    e = d;
    d += 1 * ((b[c + 257] << 2) / 4);
    for (var g = b[c]; e < d; e++, g++) b[g] = b[e], o[g] = o[e];
  }
  b[b[c] + b[c + 257]] = b[f];
  b[c + 257] += 1;
}

Mh.X = 1;

function ci(c, f) {
  var d, e, g, i, h, j, k, l, m, n;
  e = f;
  for (var p = f + 6, u = c; e < p; e++, u++) b[u] = b[e], o[u] = o[e];
  b[c + 8] = b[f + 10];
  b[c + 12] = b[f + 7];
  e = di(b[c + 8], 88 * b[c + 12]);
  b[c + 9] = e;
  e = di(b[c + 8], 152 * b[c + 12]);
  b[c + 10] = e;
  b[c + 6] = b[f + 8];
  b[c + 7] = b[f + 9];
  b[c + 11] = b[f + 6];
  e = 0;
  p = c + 12;
  d = e < b[p] ? 1 : 10;
  a : do if (1 == d) for (var u = c + 11, s = c + 10, q = c + 9, v = c + 5, x = c + 2, w = c + 2; ; ) {
    g = b[b[u] + e];
    i = b[g + 12];
    h = b[g + 13];
    j = je(i);
    k = je(h);
    j = o[j + 2];
    l = o[k + 2];
    m = qh(i);
    n = qh(h);
    h = g + 16;
    i = b[h + 15];
    d = 0 < b[h + 15] ? 4 : 3;
    3 == d && C(ei, 71, fi, gi);
    k = b[s] + 38 * e;
    o[k + 34] = o[g + 34];
    o[k + 35] = o[g + 35];
    b[k + 28] = b[m + 2];
    b[k + 29] = b[n + 2];
    o[k + 30] = o[m + 30];
    o[k + 31] = o[n + 30];
    o[k + 32] = o[m + 32];
    o[k + 33] = o[n + 32];
    b[k + 37] = e;
    b[k + 36] = i;
    $h(k + 24);
    $h(k + 20);
    g = b[q] + 22 * e;
    b[g + 8] = b[m + 2];
    b[g + 9] = b[n + 2];
    o[g + 10] = o[m + 30];
    o[g + 11] = o[n + 30];
    d = g + 12;
    var y = m + 7;
    b[d] = b[y];
    o[d] = o[y];
    b[d + 1] = b[y + 1];
    o[d + 1] = o[y + 1];
    d = g + 14;
    y = n + 7;
    b[d] = b[y];
    o[d] = o[y];
    b[d + 1] = b[y + 1];
    o[d + 1] = o[y + 1];
    o[g + 16] = o[m + 32];
    o[g + 17] = o[n + 32];
    d = g + 4;
    m = h + 10;
    b[d] = b[m];
    o[d] = o[m];
    b[d + 1] = b[m + 1];
    o[d + 1] = o[m + 1];
    d = g + 6;
    m = h + 12;
    b[d] = b[m];
    o[d] = o[m];
    b[d + 1] = b[m + 1];
    o[d + 1] = o[m + 1];
    b[g + 21] = i;
    o[g + 19] = j;
    o[g + 20] = l;
    b[g + 18] = b[h + 14];
    j = 0;
    d = j < i ? 5 : 9;
    b : do if (5 == d) for (;;) if (l = h + 5 * j, m = k + 9 * j, d = b[v] & 1 ? 6 : 7, 6 == d ? (o[m + 4] = o[x] * o[l + 2], o[m + 5] = o[w] * o[l + 3]) : 7 == d && (o[m + 4] = 0, o[m + 5] = 0), dc(m), dc(m + 2), o[m + 6] = 0, o[m + 7] = 0, o[m + 8] = 0, m = g + (j << 1), b[m] = b[l], o[m] = o[l], b[m + 1] = b[l + 1], o[m + 1] = o[l + 1], j += 1, j >= i) {
      d = 9;
      break b;
    } while (0);
    e += 1;
    if (e >= b[p]) break a;
  } while (0);
}

ci.X = 1;

function hi(c, f) {
  var d, e, g, i, h;
  d = o[f];
  e = o[f + 2];
  g = o[f + 1];
  i = o[f + 3];
  h = d * i - e * g;
  if (1 == (0 != h ? 1 : 2)) h = 1 / h;
  o[c] = h * i;
  o[c + 2] = -h * e;
  o[c + 1] = -h * g;
  o[c + 3] = h * d;
}

hi.X = 1;

function ii(c, f) {
  o[c] -= o[f];
  o[c + 1] -= o[f + 1];
}

function ji(c) {
  var f = a;
  a += 54;
  var d, e, g, i, h, j, k, l, m, n, p, u, s, q = f + 2, v = f + 4, x, w = f + 6, y, z = f + 8, B, E = f + 10, D, H = f + 12, I = f + 16, M = f + 20, G = f + 22, T = f + 24, R = f + 26, L = f + 28, S, F, X, Z = f + 34, V = f + 36, aa, ja, Y, W = f + 38, $, ga, la, fa, ka = f + 40, oa = f + 42, ua = f + 44, Da = f + 46, Ja = f + 48, Aa, Ua, pb, Fa, Wa, Na, pa, ha, Ba, za = f + 50;
  e = 0;
  var va = c + 12;
  d = e < b[va] ? 1 : 17;
  a : do if (1 == d) for (var Ka = c + 10, ma = c + 9, La = c + 11, Ga = f, ya = q, Oa = c + 6, Ea = v, Ib = c + 6, Ob = c + 7, Pa = w, fc = c + 7, Pb = c + 6, Xa = z, gc = c + 6, xb = c + 7, Ya = E, Qb = c + 7, Jb = H + 2, Ab = I + 2, Bb = H + 2, eb = H, Wb = M, Xb = I + 2, fb = I, yb = T, gb = L, Ia = za, Yb = L + 2, hb = Z, Cb = L + 2, ib = V; ; ) {
    g = b[Ka] + 38 * e;
    i = b[ma] + 22 * e;
    h = o[i + 19];
    j = o[i + 20];
    k = b[b[La] + b[g + 37]] + 16;
    l = b[g + 28];
    m = b[g + 29];
    n = o[g + 30];
    p = o[g + 31];
    u = o[g + 32];
    s = o[g + 33];
    var Db = i + 12;
    b[Ga] = b[Db];
    o[Ga] = o[Db];
    b[Ga + 1] = b[Db + 1];
    o[Ga + 1] = o[Db + 1];
    var hc = i + 14;
    b[ya] = b[hc];
    o[ya] = o[hc];
    b[ya + 1] = b[hc + 1];
    o[ya + 1] = o[hc + 1];
    var ic = b[Oa] + 3 * l;
    b[Ea] = b[ic];
    o[Ea] = o[ic];
    b[Ea + 1] = b[ic + 1];
    o[Ea + 1] = o[ic + 1];
    x = o[b[Ib] + 3 * l + 2];
    var qb = b[Ob] + 3 * l;
    b[Pa] = b[qb];
    o[Pa] = o[qb];
    b[Pa + 1] = b[qb + 1];
    o[Pa + 1] = o[qb + 1];
    y = o[b[fc] + 3 * l + 2];
    var Rb = b[Pb] + 3 * m;
    b[Xa] = b[Rb];
    o[Xa] = o[Rb];
    b[Xa + 1] = b[Rb + 1];
    o[Xa + 1] = o[Rb + 1];
    B = o[b[gc] + 3 * m + 2];
    var Zb = b[xb] + 3 * m;
    b[Ya] = b[Zb];
    o[Ya] = o[Zb];
    b[Ya + 1] = b[Zb + 1];
    o[Ya + 1] = o[Zb + 1];
    D = o[b[Qb] + 3 * m + 2];
    d = 0 < b[k + 15] ? 4 : 3;
    3 == d && C(ei, 168, ki, li);
    Mc(Jb, x);
    Mc(Ab, B);
    J(G, Bb, f);
    K(M, v, G);
    b[eb] = b[Wb];
    o[eb] = o[Wb];
    b[eb + 1] = b[Wb + 1];
    o[eb + 1] = o[Wb + 1];
    J(R, Xb, q);
    K(T, z, R);
    b[fb] = b[yb];
    o[fb] = o[yb];
    b[fb + 1] = b[yb + 1];
    o[fb + 1] = o[yb + 1];
    bh(L, k, H, h, I, j);
    var rb = g + 18;
    b[rb] = b[gb];
    o[rb] = o[gb];
    b[rb + 1] = b[gb + 1];
    o[rb + 1] = o[gb + 1];
    S = b[g + 36];
    F = 0;
    if (F < S) {
      var $b = g;
      d = 5;
    } else {
      var Eb = g;
      d = 12;
    }
    b : do if (5 == d) for (;;) {
      var jc = X = $b + 9 * F;
      K(Z, Yb + (F << 1), v);
      var sb = jc;
      b[sb] = b[hb];
      o[sb] = o[hb];
      b[sb + 1] = b[hb + 1];
      o[sb + 1] = o[hb + 1];
      var Kb = X + 2;
      K(V, Cb + (F << 1), z);
      var tb = Kb;
      b[tb] = b[ib];
      o[tb] = o[ib];
      b[tb + 1] = b[ib + 1];
      o[tb + 1] = o[ib + 1];
      aa = Q(X, g + 18);
      ja = Q(X + 2, g + 18);
      Y = n + p + u * aa * aa + s * ja * ja;
      if (0 < n + p + u * aa * aa + s * ja * ja) d = 6; else {
        var jb = 0;
        d = 7;
      }
      6 == d && (jb = 1 / Y);
      o[X + 6] = jb;
      Wg(W, g + 18);
      $ = Q(X, W);
      ga = Q(X + 2, W);
      la = n + p + u * $ * $ + s * ga * ga;
      if (0 < n + p + u * $ * $ + s * ga * ga) d = 8; else {
        var ac = 0;
        d = 9;
      }
      8 == d && (ac = 1 / la);
      o[X + 7] = ac;
      o[X + 8] = 0;
      var kc = g + 18;
      $c(Da, D, X + 2);
      P(ua, E, Da);
      K(oa, ua, w);
      $c(Ja, y, X);
      K(ka, oa, Ja);
      var Sb = O(kc, ka);
      fa = Sb;
      d = -1 > Sb ? 10 : 11;
      10 == d && (o[X + 8] = -o[g + 35] * fa);
      F += 1;
      if (F < S) $b = g; else {
        Eb = g;
        d = 12;
        break b;
      }
    } while (0);
    d = 2 == b[Eb + 36] ? 13 : 16;
    if (13 == d) {
      Aa = g;
      Ua = g + 9;
      pb = Q(Aa, g + 18);
      Fa = Q(Aa + 2, g + 18);
      Wa = Q(Ua, g + 18);
      Na = Q(Ua + 2, g + 18);
      pa = n + p + u * pb * pb + s * Fa * Fa;
      ha = n + p + u * Wa * Wa + s * Na * Na;
      Ba = n + p + u * pb * Wa + s * Fa * Na;
      var Bc = g;
      d = pa * pa < 1e3 * (pa * ha - Ba * Ba) ? 14 : 15;
      if (14 == d) {
        Qe(Bc + 24, pa, Ba);
        Qe(g + 26, Ba, ha);
        var lc = g + 20;
        hi(za, g + 24);
        var kb = lc;
        b[kb] = b[Ia];
        o[kb] = o[Ia];
        b[kb + 1] = b[Ia + 1];
        o[kb + 1] = o[Ia + 1];
        b[kb + 2] = b[Ia + 2];
        o[kb + 2] = o[Ia + 2];
        b[kb + 3] = b[Ia + 3];
        o[kb + 3] = o[Ia + 3];
      } else 15 == d && (b[Bc + 36] = 1);
    }
    e += 1;
    if (e >= b[va]) {
      d = 17;
      break a;
    }
  } while (0);
  a = f;
}

ji.X = 1;

function mi(c) {
  var f = a;
  a += 18;
  var d, e, g, i, h, j, k, l, m, n, p, u = f + 2, s, q = f + 4, v = f + 6, x, w, y = f + 8, z = f + 10, B = f + 12, E = f + 14, D = f + 16;
  e = 0;
  var H = c + 12;
  d = e < b[H] ? 1 : 5;
  a : do if (1 == d) for (var I = c + 10, M = c + 7, G = f, T = c + 7, R = c + 7, L = u, S = c + 7, F = q, X = c + 7, Z = f, V = c + 7, aa = c + 7, ja = u, Y = c + 7; ; ) {
    g = b[I] + 38 * e;
    i = b[g + 28];
    h = b[g + 29];
    j = o[g + 30];
    k = o[g + 32];
    l = o[g + 31];
    m = o[g + 33];
    n = b[g + 36];
    p = b[M] + 3 * i;
    b[G] = b[p];
    o[G] = o[p];
    b[G + 1] = b[p + 1];
    o[G + 1] = o[p + 1];
    p = o[b[T] + 3 * i + 2];
    s = b[R] + 3 * h;
    b[L] = b[s];
    o[L] = o[s];
    b[L + 1] = b[s + 1];
    o[L + 1] = o[s + 1];
    s = o[b[S] + 3 * h + 2];
    d = g + 18;
    b[F] = b[d];
    o[F] = o[d];
    b[F + 1] = b[d + 1];
    o[F + 1] = o[d + 1];
    Wg(v, q);
    x = 0;
    d = x < n ? 3 : 4;
    b : do if (3 == d) for (;;) if (w = g + 9 * x, N(z, o[w + 4], q), N(B, o[w + 5], v), P(y, z, B), p -= k * Q(w, y), N(E, j, y), ii(f, E), s += m * Q(w + 2, y), N(D, l, y), Wc(u, D), x += 1, x >= n) {
      d = 4;
      break b;
    } while (0);
    g = b[X] + 3 * i;
    b[g] = b[Z];
    o[g] = o[Z];
    b[g + 1] = b[Z + 1];
    o[g + 1] = o[Z + 1];
    o[b[V] + 3 * i + 2] = p;
    i = b[aa] + 3 * h;
    b[i] = b[ja];
    o[i] = o[ja];
    b[i + 1] = b[ja + 1];
    o[i + 1] = o[ja + 1];
    o[b[Y] + 3 * h + 2] = s;
    e += 1;
    if (e >= b[H]) break a;
  } while (0);
  a = f;
}

mi.X = 1;

function ni(c, f, d) {
  Xc(c, o[f] * o[d] + o[f + 2] * o[d + 1], o[f + 1] * o[d] + o[f + 3] * o[d + 1]);
}

function oi(c) {
  var f = a;
  a += 126;
  var d, e, g, i, h, j, k, l, m, n, p, u = f + 2, s, q = f + 4, v = f + 6, x, w, y, z = f + 8, B = f + 10, E = f + 12, D = f + 14, H = f + 16, I, M, G, T, R = f + 18, L = f + 20, S = f + 22, F, X = f + 24, Z = f + 26, V = f + 28, aa = f + 30, ja = f + 32, Y, W, $, ga = f + 34, la = f + 36, fa = f + 38, ka, oa, ua = f + 40, Da = f + 42, Ja = f + 44, Aa = f + 46, Ua = f + 48, pb = f + 50, Fa = f + 52, Wa = f + 54, Na = f + 56, pa = f + 58, ha = f + 60, Ba, za, va = f + 62, Ka = f + 64, ma = f + 66, La = f + 68, Ga = f + 70, ya = f + 72, Oa = f + 74, Ea = f + 76, Ib = f + 78, Ob = f + 80, Pa = f + 82, fc = f + 84, Pb = f + 86, Xa = f + 88, gc = f + 90, xb = f + 92, Ya = f + 94, Qb = f + 96, Jb = f + 98, Ab = f + 100, Bb = f + 102, eb = f + 104, Wb = f + 106, Xb = f + 108, fb = f + 110, yb = f + 112, gb = f + 114, Ia = f + 116, Yb = f + 118, hb = f + 120, Cb = f + 122, ib = f + 124;
  e = 0;
  var Db = c + 12;
  d = e < b[Db] ? 1 : 24;
  a : do if (1 == d) for (var hc = c + 10, ic = c + 7, qb = f, Rb = c + 7, Zb = c + 7, rb = u, $b = c + 7, Eb = q, jc = c + 7, sb = f, Kb = c + 7, tb = c + 7, jb = u, ac = c + 7, kc = ua, Sb = ua + 1, Bc = va, lc = va + 1, kb = ma, ae = ma + 1, $e = Ga, af = Ga + 1, fd = ma, gd = ma + 1, hd = va, id = ma, jd = ma + 1, kd = ma, ld = va + 1, md = ma, Th = fc, nd = fc + 1, od = ma, Uh = ma + 1, pd = ma, qd = va + 1, be = ma + 1, bf = ma + 1, cf = va, rd = ma + 1, sd = Jb, td = Jb + 1, ud = ma, vd = ma + 1, wd = ma, xd = ma + 1, yd = va, Vh = va + 1, zd = yb, Ad = yb + 1, Wh = ma, Bd = ma + 1; ; ) {
    g = b[hc] + 38 * e;
    i = b[g + 28];
    h = b[g + 29];
    j = o[g + 30];
    k = o[g + 32];
    l = o[g + 31];
    m = o[g + 33];
    n = b[g + 36];
    var tc = b[ic] + 3 * i;
    b[qb] = b[tc];
    o[qb] = o[tc];
    b[qb + 1] = b[tc + 1];
    o[qb + 1] = o[tc + 1];
    p = o[b[Rb] + 3 * i + 2];
    var Cc = b[Zb] + 3 * h;
    b[rb] = b[Cc];
    o[rb] = o[Cc];
    b[rb + 1] = b[Cc + 1];
    o[rb + 1] = o[Cc + 1];
    s = o[b[$b] + 3 * h + 2];
    var Sc = g + 18;
    b[Eb] = b[Sc];
    o[Eb] = o[Sc];
    b[Eb + 1] = b[Sc + 1];
    o[Eb + 1] = o[Sc + 1];
    Wg(v, q);
    x = o[g + 34];
    d = 1 == n | 2 == n ? 4 : 3;
    3 == d && C(ei, 311, pi, qi);
    w = 0;
    if (w < n) {
      var ce = g;
      d = 5;
    } else {
      var Tc = g;
      d = 6;
    }
    b : do if (5 == d) for (;;) if (y = ce + 9 * w, $c(D, s, y + 2), P(E, u, D), K(B, E, f), $c(H, p, y), K(z, B, H), I = O(z, v), M = o[y + 7] * -I, G = x * o[y + 4], T = ri(o[y + 5] + M, -G, G), M = T - o[y + 5], o[y + 5] = T, N(R, M, v), N(L, j, R), ii(f, L), p -= k * Q(y, R), N(S, l, R), Wc(u, S), s += m * Q(y + 2, R), w += 1, w < n) ce = g; else {
      Tc = g;
      d = 6;
      break b;
    } while (0);
    var Uc = g;
    d = 1 == b[Tc + 36] ? 7 : 8;
    b : do if (7 == d) F = Uc, $c(aa, s, F + 2), P(V, u, aa), K(Z, V, f), $c(ja, p, F), K(X, Z, ja), Y = O(X, q), W = -o[F + 6] * (Y - o[F + 8]), $ = 0 < o[F + 4] + W ? o[F + 4] + W : 0, W = $ - o[F + 4], o[F + 4] = $, N(ga, W, q), N(la, j, ga), ii(f, la), p -= k * Q(F, ga), N(fa, l, ga), Wc(u, fa), s += m * Q(F + 2, ga); else if (8 == d) {
      ka = Uc;
      oa = g + 9;
      Xc(ua, o[ka + 4], o[oa + 4]);
      d = 0 <= o[kc] ? 9 : 10;
      9 == d && (d = 0 <= o[Sb] ? 11 : 10);
      10 == d && C(ei, 406, pi, si);
      $c(Ua, s, ka + 2);
      P(Aa, u, Ua);
      K(Ja, Aa, f);
      $c(pb, p, ka);
      K(Da, Ja, pb);
      $c(pa, s, oa + 2);
      P(Na, u, pa);
      K(Wa, Na, f);
      $c(ha, p, oa);
      K(Fa, Wa, ha);
      Ba = O(Da, q);
      za = O(Fa, q);
      o[Bc] = Ba - o[ka + 8];
      o[lc] = za - o[oa + 8];
      ni(Ka, g + 24, ua);
      ii(va, Ka);
      ni(La, g + 20, va);
      Pg(ma, La);
      d = 0 <= o[kb] ? 12 : 14;
      do if (12 == d) if (0 <= o[ae]) {
        K(Ga, ma, ua);
        N(ya, o[$e], q);
        N(Oa, o[af], q);
        var Cd = j;
        P(Ib, ya, Oa);
        N(Ea, Cd, Ib);
        ii(f, Ea);
        p -= k * (Q(ka, ya) + Q(oa, Oa));
        var Dd = l;
        P(Pa, ya, Oa);
        N(Ob, Dd, Pa);
        Wc(u, Ob);
        s += m * (Q(ka + 2, ya) + Q(oa + 2, Oa));
        o[ka + 4] = o[fd];
        o[oa + 4] = o[gd];
        d = 23;
        break b;
      } else d = 14; while (0);
      o[id] = -o[ka + 6] * o[hd];
      Ba = o[jd] = 0;
      za = o[g + 25] * o[kd] + o[ld];
      d = 0 <= o[md] ? 15 : 17;
      do if (15 == d) if (0 <= za) {
        K(fc, ma, ua);
        N(Pb, o[Th], q);
        N(Xa, o[nd], q);
        var Ed = j;
        P(xb, Pb, Xa);
        N(gc, Ed, xb);
        ii(f, gc);
        p -= k * (Q(ka, Pb) + Q(oa, Xa));
        var Fd = l;
        P(Qb, Pb, Xa);
        N(Ya, Fd, Qb);
        Wc(u, Ya);
        s += m * (Q(ka + 2, Pb) + Q(oa + 2, Xa));
        o[ka + 4] = o[od];
        o[oa + 4] = o[Uh];
        d = 23;
        break b;
      } else d = 17; while (0);
      o[pd] = 0;
      o[be] = -o[oa + 6] * o[qd];
      Ba = o[g + 26] * o[bf] + o[cf];
      za = 0;
      d = 0 <= o[rd] ? 18 : 20;
      do if (18 == d) if (0 <= Ba) {
        K(Jb, ma, ua);
        N(Ab, o[sd], q);
        N(Bb, o[td], q);
        var Gd = j;
        P(Wb, Ab, Bb);
        N(eb, Gd, Wb);
        ii(f, eb);
        p -= k * (Q(ka, Ab) + Q(oa, Bb));
        var Hd = l;
        P(fb, Ab, Bb);
        N(Xb, Hd, fb);
        Wc(u, Xb);
        s += m * (Q(ka + 2, Ab) + Q(oa + 2, Bb));
        o[ka + 4] = o[ud];
        o[oa + 4] = o[vd];
        d = 23;
        break b;
      } else d = 20; while (0);
      o[wd] = 0;
      o[xd] = 0;
      var df = o[yd];
      Ba = df;
      za = o[Vh];
      if (0 <= df) if (0 <= za) {
        K(yb, ma, ua);
        N(gb, o[zd], q);
        N(Ia, o[Ad], q);
        var Id = j;
        P(hb, gb, Ia);
        N(Yb, Id, hb);
        ii(f, Yb);
        p -= k * (Q(ka, gb) + Q(oa, Ia));
        var Jd = l;
        P(ib, gb, Ia);
        N(Cb, Jd, ib);
        Wc(u, Cb);
        s += m * (Q(ka + 2, gb) + Q(oa + 2, Ia));
        o[ka + 4] = o[Wh];
        o[oa + 4] = o[Bd];
      } else d = 23; else d = 23;
    } while (0);
    var Kd = b[jc] + 3 * i;
    b[Kd] = b[sb];
    o[Kd] = o[sb];
    b[Kd + 1] = b[sb + 1];
    o[Kd + 1] = o[sb + 1];
    o[b[Kb] + 3 * i + 2] = p;
    var uc = b[tb] + 3 * h;
    b[uc] = b[jb];
    o[uc] = o[jb];
    b[uc + 1] = b[jb + 1];
    o[uc + 1] = o[jb + 1];
    o[b[ac] + 3 * h + 2] = s;
    e += 1;
    if (e >= b[Db]) {
      d = 24;
      break a;
    }
  } while (0);
  a = f;
}

oi.X = 1;

function ri(c, f, d) {
  return f > (c < d ? c : d) ? f : c < d ? c : d;
}

function ti(c) {
  var f, d, e, g, i;
  d = 0;
  var h = c + 12;
  f = d < b[h] ? 1 : 5;
  a : do if (1 == f) for (var j = c + 10, k = c + 11; ; ) {
    e = b[j] + 38 * d;
    g = b[b[k] + b[e + 37]] + 16;
    i = 0;
    f = i < b[e + 36] ? 3 : 4;
    b : do if (3 == f) for (;;) if (o[g + 5 * i + 2] = o[e + 9 * i + 4], o[g + 5 * i + 3] = o[e + 9 * i + 5], i += 1, i >= b[e + 36]) {
      f = 4;
      break b;
    } while (0);
    d += 1;
    if (d >= b[h]) break a;
  } while (0);
}

ti.X = 1;

function ui(c) {
  var f = a;
  a += 43;
  var d, e, g, i, h, j, k, l, m = f + 2, n, p, u, s = f + 4, q, v = f + 6, x, w, y = f + 8, z = f + 12, B = f + 16, E = f + 18, D = f + 20, H = f + 22, I = f + 24, M = f + 29, G = f + 31, T = f + 33, R = f + 35, L, S, F, X = f + 37, Z = f + 39, V = f + 41;
  g = e = 0;
  var aa = c + 12;
  d = g < b[aa] ? 1 : 7;
  a : do if (1 == d) for (var ja = c + 9, Y = f, W = m, $ = c + 6, ga = s, la = c + 6, fa = c + 6, ka = v, oa = c + 6, ua = c + 6, Da = s, Ja = c + 6, Aa = c + 6, Ua = v, pb = c + 6, Fa = y + 2, Wa = z + 2, Na = y + 2, pa = y, ha = B, Ba = z + 2, za = z, va = D, Ka = M, ma = I, La = G, Ga = I + 2, ya = I + 4; ; ) {
    i = b[ja] + 22 * g;
    h = b[i + 8];
    j = b[i + 9];
    k = i + 12;
    b[Y] = b[k];
    o[Y] = o[k];
    b[Y + 1] = b[k + 1];
    o[Y + 1] = o[k + 1];
    k = o[i + 10];
    l = o[i + 16];
    n = i + 14;
    b[W] = b[n];
    o[W] = o[n];
    b[W + 1] = b[n + 1];
    o[W + 1] = o[n + 1];
    n = o[i + 11];
    p = o[i + 17];
    u = b[i + 21];
    q = b[$] + 3 * h;
    b[ga] = b[q];
    o[ga] = o[q];
    b[ga + 1] = b[q + 1];
    o[ga + 1] = o[q + 1];
    q = o[b[la] + 3 * h + 2];
    x = b[fa] + 3 * j;
    b[ka] = b[x];
    o[ka] = o[x];
    b[ka + 1] = b[x + 1];
    o[ka + 1] = o[x + 1];
    x = o[b[oa] + 3 * j + 2];
    w = 0;
    d = w < u ? 3 : 6;
    b : do if (3 == d) for (;;) {
      Mc(Fa, q);
      Mc(Wa, x);
      J(E, Na, f);
      K(B, s, E);
      b[pa] = b[ha];
      o[pa] = o[ha];
      b[pa + 1] = b[ha + 1];
      o[pa + 1] = o[ha + 1];
      J(H, Ba, m);
      K(D, v, H);
      b[za] = b[va];
      o[za] = o[va];
      b[za + 1] = b[va + 1];
      o[za + 1] = o[va + 1];
      vi(I, i, y, z, w);
      b[Ka] = b[ma];
      o[Ka] = o[ma];
      b[Ka + 1] = b[ma + 1];
      o[Ka + 1] = o[ma + 1];
      b[La] = b[Ga];
      o[La] = o[Ga];
      b[La + 1] = b[Ga + 1];
      o[La + 1] = o[Ga + 1];
      d = o[ya];
      K(T, G, s);
      K(R, G, v);
      e = e < d ? e : d;
      L = ri(.20000000298023224 * (d + .004999999888241291), -.20000000298023224, 0);
      d = Q(T, M);
      S = Q(R, M);
      F = k + n + l * d * d + p * S * S;
      if (0 < k + n + l * d * d + p * S * S) d = 4; else {
        var Oa = 0;
        d = 5;
      }
      4 == d && (Oa = -L / F);
      L = Oa;
      N(X, L, M);
      N(Z, k, X);
      ii(s, Z);
      q -= l * Q(T, X);
      N(V, n, X);
      Wc(v, V);
      x += p * Q(R, X);
      w += 1;
      if (w >= u) {
        d = 6;
        break b;
      }
    } while (0);
    i = b[ua] + 3 * h;
    b[i] = b[Da];
    o[i] = o[Da];
    b[i + 1] = b[Da + 1];
    o[i + 1] = o[Da + 1];
    o[b[Ja] + 3 * h + 2] = q;
    h = b[Aa] + 3 * j;
    b[h] = b[Ua];
    o[h] = o[Ua];
    b[h + 1] = b[Ua + 1];
    o[h + 1] = o[Ua + 1];
    o[b[pb] + 3 * j + 2] = x;
    g += 1;
    if (g >= b[aa]) break a;
  } while (0);
  a = f;
  return -.014999999664723873 <= e;
}

ui.X = 1;

function vi(c, f, d, e, g) {
  var i = a;
  a += 30;
  var h, j = i + 2, k = i + 4, l = i + 6, m = i + 8, n = i + 10, p = i + 12, u = i + 14, s = i + 16, q = i + 18, v = i + 20, x = i + 22, w = i + 24, y = i + 26, z = i + 28;
  h = 0 < b[f + 21] ? 2 : 1;
  1 == h && C(ei, 617, wi, xi);
  h = b[f + 18];
  h = 0 == h ? 3 : 1 == h ? 4 : 2 == h ? 5 : 6;
  3 == h ? (Zc(i, d, f + 6), Zc(j, e, f), K(k, j, i), b[c] = b[k], o[c] = o[k], b[c + 1] = b[k + 1], o[c + 1] = o[k + 1], Cg(c), s = c + 2, P(m, i, j), N(l, .5, m), b[s] = b[l], o[s] = o[l], b[s + 1] = b[l + 1], o[s + 1] = o[l + 1], K(n, j, i), o[c + 4] = O(n, c) - o[f + 19] - o[f + 20]) : 4 == h ? (J(p, d + 2, f + 4), b[c] = b[p], o[c] = o[p], b[c + 1] = b[p + 1], o[c + 1] = o[p + 1], Zc(u, d, f + 6), Zc(s, e, f + (g << 1)), K(q, s, u), o[c + 4] = O(q, c) - o[f + 19] - o[f + 20], c += 2, b[c] = b[s], o[c] = o[s], b[c + 1] = b[s + 1], o[c + 1] = o[s + 1]) : 5 == h && (J(v, e + 2, f + 4), b[c] = b[v], o[c] = o[v], b[c + 1] = b[v + 1], o[c + 1] = o[v + 1], Zc(x, e, f + 6), Zc(w, d, f + (g << 1)), K(y, w, x), o[c + 4] = O(y, c) - o[f + 19] - o[f + 20], f = c + 2, b[f] = b[w], o[f] = o[w], b[f + 1] = b[w + 1], o[f + 1] = o[w + 1], Pg(z, c), b[c] = b[z], o[c] = o[z], b[c + 1] = b[z + 1], o[c + 1] = o[z + 1]);
  a = i;
}

vi.X = 1;

function yi(c, f, d) {
  var e = a;
  a += 43;
  var g, i, h, j, k, l, m = e + 2, n, p, u, s, q, v = e + 4, x, w = e + 6, y, z, B = e + 8, E = e + 12, D = e + 16, H = e + 18, I = e + 20, M = e + 22, G = e + 24, T = e + 29, R = e + 31, L = e + 33, S = e + 35, F, X, Z, V = e + 37, aa = e + 39, ja = e + 41;
  h = i = 0;
  var Y = c + 12;
  g = h < b[Y] ? 1 : 13;
  a : do if (1 == g) for (var W = c + 9, $ = e, ga = m, la = c + 6, fa = v, ka = c + 6, oa = c + 6, ua = w, Da = c + 6, Ja = c + 6, Aa = v, Ua = c + 6, pb = c + 6, Fa = w, Wa = c + 6, Na = B + 2, pa = E + 2, ha = B + 2, Ba = B, za = D, va = E + 2, Ka = E, ma = I, La = T, Ga = G, ya = R, Oa = G + 2, Ea = G + 4; ; ) {
    j = b[W] + 22 * h;
    k = b[j + 8];
    l = b[j + 9];
    n = j + 12;
    b[$] = b[n];
    o[$] = o[n];
    b[$ + 1] = b[n + 1];
    o[$ + 1] = o[n + 1];
    n = j + 14;
    b[ga] = b[n];
    o[ga] = o[n];
    b[ga + 1] = b[n + 1];
    o[ga + 1] = o[n + 1];
    n = b[j + 21];
    u = p = 0;
    g = k == f ? 4 : 3;
    3 == g && (g = k == d ? 4 : 5);
    4 == g && (p = o[j + 10], u = o[j + 16]);
    s = o[j + 11];
    q = o[j + 17];
    g = l == f ? 7 : 6;
    6 == g && (g = l == d ? 7 : 8);
    7 == g && (s = o[j + 11], q = o[j + 17]);
    x = b[la] + 3 * k;
    b[fa] = b[x];
    o[fa] = o[x];
    b[fa + 1] = b[x + 1];
    o[fa + 1] = o[x + 1];
    x = o[b[ka] + 3 * k + 2];
    y = b[oa] + 3 * l;
    b[ua] = b[y];
    o[ua] = o[y];
    b[ua + 1] = b[y + 1];
    o[ua + 1] = o[y + 1];
    y = o[b[Da] + 3 * l + 2];
    z = 0;
    g = z < n ? 9 : 12;
    b : do if (9 == g) for (;;) {
      Mc(Na, x);
      Mc(pa, y);
      J(H, ha, e);
      K(D, v, H);
      b[Ba] = b[za];
      o[Ba] = o[za];
      b[Ba + 1] = b[za + 1];
      o[Ba + 1] = o[za + 1];
      J(M, va, m);
      K(I, w, M);
      b[Ka] = b[ma];
      o[Ka] = o[ma];
      b[Ka + 1] = b[ma + 1];
      o[Ka + 1] = o[ma + 1];
      vi(G, j, B, E, z);
      b[La] = b[Ga];
      o[La] = o[Ga];
      b[La + 1] = b[Ga + 1];
      o[La + 1] = o[Ga + 1];
      b[ya] = b[Oa];
      o[ya] = o[Oa];
      b[ya + 1] = b[Oa + 1];
      o[ya + 1] = o[Oa + 1];
      g = o[Ea];
      K(L, R, v);
      K(S, R, w);
      i = i < g ? i : g;
      F = ri(.75 * (g + .004999999888241291), -.20000000298023224, 0);
      g = Q(L, T);
      X = Q(S, T);
      Z = p + s + u * g * g + q * X * X;
      if (0 < p + s + u * g * g + q * X * X) g = 10; else {
        var Ib = 0;
        g = 11;
      }
      10 == g && (Ib = -F / Z);
      F = Ib;
      N(V, F, T);
      N(aa, p, V);
      ii(v, aa);
      x -= u * Q(L, V);
      N(ja, s, V);
      Wc(w, ja);
      y += q * Q(S, V);
      z += 1;
      if (z >= n) {
        g = 12;
        break b;
      }
    } while (0);
    j = b[Ja] + 3 * k;
    b[j] = b[Aa];
    o[j] = o[Aa];
    b[j + 1] = b[Aa + 1];
    o[j + 1] = o[Aa + 1];
    o[b[Ua] + 3 * k + 2] = x;
    k = b[pb] + 3 * l;
    b[k] = b[Fa];
    o[k] = o[Fa];
    b[k + 1] = b[Fa + 1];
    o[k + 1] = o[Fa + 1];
    o[b[Wa] + 3 * l + 2] = y;
    h += 1;
    if (h >= b[Y]) break a;
  } while (0);
  a = e;
  return -.007499999832361937 <= i;
}

yi.X = 1;

function xh(c, f, d) {
  var e;
  e = b[f + 1];
  e = 0 == e ? 1 : 2 == e ? 2 : 3 == e ? 3 : 1 == e ? 10 : 11;
  11 == e ? C(zi, 81, Ai, Bi) : 1 == e ? (b[c + 4] = f + 3, b[c + 5] = 1, o[c + 6] = o[f + 2]) : 2 == e ? (b[c + 4] = f + 5, b[c + 5] = b[f + 37], o[c + 6] = o[f + 2]) : 3 == e ? (e = 0 <= d ? 4 : 5, 4 == e && (e = d < b[f + 4] ? 6 : 5), 5 == e && C(zi, 53, Ai, Ci), e = b[f + 3] + (d << 1), b[c] = b[e], o[c] = o[e], b[c + 1] = b[e + 1], o[c + 1] = o[e + 1], e = d + 1 < b[f + 4] ? 7 : 8, 7 == e ? (e = c + 2, d = b[f + 3] + (d + 1 << 1), b[e] = b[d], o[e] = o[d], b[e + 1] = b[d + 1], o[e + 1] = o[d + 1]) : 8 == e && (d = c + 2, e = b[f + 3], b[d] = b[e], o[d] = o[e], b[d + 1] = b[e + 1], o[d + 1] = o[e + 1]), b[c + 4] = c, b[c + 5] = 2, o[c + 6] = o[f + 2]) : 10 == e && (b[c + 4] = f + 3, b[c + 5] = 2, o[c + 6] = o[f + 2]);
}

xh.X = 1;

function Di(c) {
  var f = a;
  a += 6;
  var d, e = f + 2, g = f + 4, i;
  i = c + 4;
  b[f] = b[i];
  o[f] = o[i];
  b[f + 1] = b[i + 1];
  o[f + 1] = o[i + 1];
  i = c + 13;
  b[e] = b[i];
  o[e] = o[i];
  b[e + 1] = b[i + 1];
  o[e + 1] = o[i + 1];
  K(g, e, f);
  i = -O(f, g);
  d = 0 >= i ? 1 : 2;
  if (1 == d) o[c + 6] = 1, b[c + 27] = 1; else if (2 == d) if (e = O(e, g), d = 0 >= e ? 3 : 4, 3 == d) {
    o[c + 15] = 1;
    b[c + 27] = 1;
    e = g = c + 9;
    for (g += 9; e < g; e++, c++) b[c] = b[e], o[c] = o[e];
  } else 4 == d && (g = 1 / (e + i), o[c + 6] = e * g, o[c + 15] = i * g, b[c + 27] = 2);
  a = f;
}

Di.X = 1;

function Ei(c) {
  var f = a;
  a += 12;
  var d, e = f + 2, g = f + 4, i = f + 6, h, j;
  d = f + 8;
  var k, l, m = f + 10, n, p;
  j = c + 4;
  b[f] = b[j];
  o[f] = o[j];
  b[f + 1] = b[j + 1];
  o[f + 1] = o[j + 1];
  j = c + 13;
  b[e] = b[j];
  o[e] = o[j];
  b[e + 1] = b[j + 1];
  o[e + 1] = o[j + 1];
  j = c + 22;
  b[g] = b[j];
  o[g] = o[j];
  b[g + 1] = b[j + 1];
  o[g + 1] = o[j + 1];
  K(i, e, f);
  h = O(f, i);
  j = O(e, i);
  h = -h;
  K(d, g, f);
  k = O(f, d);
  l = O(g, d);
  k = -k;
  K(m, g, e);
  n = O(e, m);
  m = O(g, m);
  n = -n;
  d = Q(i, d);
  i = d * Q(e, g);
  g = d * Q(g, f);
  p = d * Q(f, e);
  d = 0 >= h ? 1 : 3;
  1 == d && (0 >= k ? (o[c + 6] = 1, b[c + 27] = 1, d = 21) : d = 3);
  a : do if (3 == d) {
    d = 0 < j ? 4 : 7;
    do if (4 == d) if (0 < h) if (0 >= p) {
      l = 1 / (j + h);
      o[c + 6] = j * l;
      o[c + 15] = h * l;
      b[c + 27] = 2;
      break a;
    } else d = 7; else d = 7; while (0);
    d = 0 < l ? 8 : 11;
    do if (8 == d) if (0 < k) if (0 >= g) {
      j = 1 / (l + k);
      o[c + 6] = l * j;
      o[c + 24] = k * j;
      b[c + 27] = 2;
      for (var e = j = c + 18, u = j + 9, s = c + 9; e < u; e++, s++) b[s] = b[e], o[s] = o[e];
      break a;
    } else d = 11; else d = 11; while (0);
    d = 0 >= j ? 12 : 14;
    do if (12 == d) if (0 >= n) {
      o[c + 15] = 1;
      b[c + 27] = 1;
      j = c;
      e = c += 9;
      u = c + 9;
      for (s = j; e < u; e++, s++) b[s] = b[e], o[s] = o[e];
      break a;
    } else d = 14; while (0);
    d = 0 >= l & 0 >= m ? 15 : 16;
    if (15 == d) {
      o[c + 24] = 1;
      b[c + 27] = 1;
      s = c;
      e = u = c + 18;
      for (u += 9; e < u; e++, s++) b[s] = b[e], o[s] = o[e];
    } else if (16 == d) {
      d = 0 < m ? 17 : 20;
      do if (17 == d) if (0 < n) if (0 >= i) {
        j = 1 / (m + n);
        o[c + 15] = m * j;
        o[c + 24] = n * j;
        b[c + 27] = 2;
        j = c;
        e = c += 18;
        u = c + 9;
        for (s = j; e < u; e++, s++) b[s] = b[e], o[s] = o[e];
        break a;
      } else d = 20; else d = 20; while (0);
      e = 1 / (i + g + p);
      o[c + 6] = i * e;
      o[c + 15] = g * e;
      o[c + 24] = p * e;
      b[c + 27] = 3;
    }
  } while (0);
  a = f;
}

Ei.X = 1;

function yh(c, f, d) {
  var e = a;
  a += 72;
  var g, i, h = e + 4, j = e + 8, k = e + 36, l = e + 39, m;
  g = e + 42;
  var n, p, u = e + 44, s = e + 46, q = e + 48, v = e + 50, x = e + 52, w = e + 56, y = e + 58, z = e + 60, B, E, D = e + 62, H = e + 64, I = e + 66, M = e + 68, G = e + 70;
  b[Fi] += 1;
  i = d + 7;
  n = d + 14;
  b[e] = b[n];
  o[e] = o[n];
  b[e + 1] = b[n + 1];
  o[e + 1] = o[n + 1];
  b[e + 2] = b[n + 2];
  o[e + 2] = o[n + 2];
  b[e + 3] = b[n + 3];
  o[e + 3] = o[n + 3];
  n = d + 18;
  b[h] = b[n];
  o[h] = o[n];
  b[h + 1] = b[n + 1];
  o[h + 1] = o[n + 1];
  b[h + 2] = b[n + 2];
  o[h + 2] = o[n + 2];
  b[h + 3] = b[n + 3];
  o[h + 3] = o[n + 3];
  Gi(j, f, d, e, i, h);
  Hi(g, j);
  n = 0;
  var T = j + 27, R = j + 27, L = j + 27, S = j + 27, F = e + 2, X = h + 2, Z = j + 27;
  g = 0;
  a : for (; 20 > g; ) {
    m = b[T];
    p = 0;
    g = p < m ? 3 : 4;
    b : do if (3 == g) for (;;) if (b[k + p] = b[j + 9 * p + 7], b[l + p] = b[j + 9 * p + 8], p += 1, p >= m) break b; while (0);
    g = b[R];
    g = 1 == g ? 9 : 2 == g ? 5 : 3 == g ? 6 : 7;
    7 == g ? (C(zi, 498, Ii, Bi), g = 8) : 5 == g ? (Di(j), g = 8) : 6 == g && (Ei(j), g = 8);
    if (8 == g && 3 == b[L]) break a;
    Hi(u, j);
    p = s;
    B = j;
    E = a;
    a += 4;
    var V = ba, aa = ba, aa = E + 2, V = b[B + 27], V = 1 == V ? 1 : 2 == V ? 2 : 5;
    5 == V ? (C(zi, 184, Ji, Bi), b[p] = b[dd], o[p] = o[dd], b[p + 1] = b[dd + 1], o[p + 1] = o[dd + 1]) : 1 == V ? Pg(p, B + 4) : 2 == V && (K(E, B + 13, B + 4), Pg(aa, B + 4), aa = Q(E, aa), V = 0 < aa ? 3 : 4, 3 == V ? $c(p, 1, E) : 4 == V && Wg(p, E));
    a = E;
    if (1.4210854715202004e-14 > Ki(s)) break;
    p = j + 9 * b[S];
    B = d;
    Pg(v, s);
    Og(q, F, v);
    b[p + 7] = Li(B, q);
    B = p;
    E = Mi(d, b[p + 7]);
    Zc(x, e, E);
    b[B] = b[x];
    o[B] = o[x];
    b[B + 1] = b[x + 1];
    o[B + 1] = o[x + 1];
    B = i;
    Og(w, X, s);
    b[p + 8] = Li(B, w);
    B = p + 2;
    E = Mi(i, b[p + 8]);
    Zc(y, h, E);
    b[B] = b[y];
    o[B] = o[y];
    b[B + 1] = b[y + 1];
    o[B + 1] = o[y + 1];
    B = p + 4;
    K(z, p + 2, p);
    b[B] = b[z];
    o[B] = o[z];
    b[B + 1] = b[z + 1];
    o[B + 1] = o[z + 1];
    n += 1;
    b[Ni] += 1;
    E = B = 0;
    b : for (;;) {
      if (E >= m) {
        g = 16;
        break;
      }
      g = b[p + 7] == b[k + E] ? 13 : 15;
      if (13 == g && b[p + 8] == b[l + E]) {
        g = 14;
        break b;
      }
      E += 1;
    }
    14 == g && (B = 1);
    if (B & 1) break;
    b[Z] += 1;
    g = n;
  }
  b[Oi] = b[Oi] > n ? b[Oi] : n;
  Pi(j, c, c + 2);
  g = Qi(c, c + 2);
  o[c + 4] = g;
  b[c + 5] = n;
  Ri(j, f);
  g = b[d + 22] & 1 ? 19 : 23;
  a : do if (19 == g) {
    j = o[d + 6];
    f = o[i + 6];
    g = o[c + 4] > j + f ? 20 : 22;
    do if (20 == g) if (1.1920928955078125e-7 < o[c + 4]) {
      o[c + 4] -= j + f;
      K(D, c + 2, c);
      Cg(D);
      d = c;
      N(H, j, D);
      Wc(d, H);
      c += 2;
      N(I, f, D);
      ii(c, I);
      break a;
    } else g = 22; while (0);
    P(G, c, c + 2);
    N(M, .5, G);
    f = c;
    j = M;
    b[f] = b[j];
    o[f] = o[j];
    b[f + 1] = b[j + 1];
    o[f + 1] = o[j + 1];
    f = c + 2;
    j = M;
    b[f] = b[j];
    o[f] = o[j];
    b[f + 1] = b[j + 1];
    o[f + 1] = o[j + 1];
    o[c + 4] = 0;
  } while (0);
  a = e;
}

yh.X = 1;

function Hi(c, f) {
  var d = a;
  a += 4;
  var e, g = d + 2;
  e = b[f + 27];
  e = 0 == e ? 1 : 1 == e ? 2 : 2 == e ? 3 : 3 == e ? 4 : 5;
  5 == e ? (C(zi, 207, Si, Bi), b[c] = b[dd], o[c] = o[dd], b[c + 1] = b[dd + 1], o[c + 1] = o[dd + 1]) : 1 == e ? (C(zi, 194, Si, Bi), b[c] = b[dd], o[c] = o[dd], b[c + 1] = b[dd + 1], o[c + 1] = o[dd + 1]) : 2 == e ? (g = f + 4, b[c] = b[g], o[c] = o[g], b[c + 1] = b[g + 1], o[c + 1] = o[g + 1]) : 3 == e ? (N(d, o[f + 6], f + 4), N(g, o[f + 15], f + 13), P(c, d, g)) : 4 == e && (b[c] = b[dd], o[c] = o[dd], b[c + 1] = b[dd + 1], o[c + 1] = o[dd + 1]);
  a = d;
}

function Ki(c) {
  return o[c] * o[c] + o[c + 1] * o[c + 1];
}

function Mi(c, f) {
  var d;
  d = 0 <= f ? 1 : 2;
  1 == d && (d = f < b[c + 5] ? 3 : 2);
  2 == d && C(Ti, 103, Ui, Vi);
  return b[c + 4] + (f << 1);
}

function Pi(c, f, d) {
  var e = a;
  a += 22;
  var g, i = e + 2, h = e + 4, j = e + 6, k = e + 8, l = e + 10, m = e + 12, n = e + 14, p = e + 16, u = e + 18, s = e + 20;
  g = b[c + 27];
  g = 0 == g ? 1 : 1 == g ? 2 : 2 == g ? 3 : 3 == g ? 4 : 5;
  5 == g ? C(zi, 236, Wi, Bi) : 1 == g ? C(zi, 217, Wi, Bi) : 2 == g ? (b[f] = b[c], o[f] = o[c], b[f + 1] = b[c + 1], o[f + 1] = o[c + 1], c += 2, b[d] = b[c], o[d] = o[c], b[d + 1] = b[c + 1], o[d + 1] = o[c + 1]) : 3 == g ? (N(i, o[c + 6], c), N(h, o[c + 15], c + 9), P(e, i, h), b[f] = b[e], o[f] = o[e], b[f + 1] = b[e + 1], o[f + 1] = o[e + 1], N(k, o[c + 6], c + 2), N(l, o[c + 15], c + 11), P(j, k, l), b[d] = b[j], o[d] = o[j], b[d + 1] = b[j + 1], o[d + 1] = o[j + 1]) : 4 == g && (N(p, o[c + 6], c), N(u, o[c + 15], c + 9), P(n, p, u), N(s, o[c + 24], c + 18), P(m, n, s), b[f] = b[m], o[f] = o[m], b[f + 1] = b[m + 1], o[f + 1] = o[m + 1], b[d] = b[f], o[d] = o[f], b[d + 1] = b[f + 1], o[d + 1] = o[f + 1]);
  a = e;
}

Pi.X = 1;

function Xi(c, f) {
  Yi(c, f);
  b[c] = Zi + 2;
  var d = c + 21, e = f + 5;
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  d = c + 23;
  e = f + 7;
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  o[c + 27] = o[f + 9];
  o[c + 18] = o[f + 10];
  o[c + 19] = o[f + 11];
  o[c + 26] = 0;
  o[c + 25] = 0;
  o[c + 20] = 0;
}

Xi.X = 1;

function Gi(c, f, d, e, g, i) {
  var h = a;
  a += 20;
  var j, k, l, m = h + 2, n = h + 4, p = h + 6, u = h + 8, s = h + 10, q = h + 12, v = h + 14, x = h + 16, w = h + 18;
  j = 3 >= b[f + 1] ? 2 : 1;
  1 == j && C(zi, 102, $i, aj);
  b[c + 27] = b[f + 1];
  k = 0;
  var y = c + 27;
  j = k < b[y] ? 3 : 5;
  a : do if (3 == j) for (var z = h, B = m, E = n, D = p, H = u; ; ) {
    l = c + 9 * k;
    b[l + 7] = b[k + (f + 2)];
    b[l + 8] = b[k + (f + 5)];
    var I = Mi(d, b[l + 7]);
    b[z] = b[I];
    o[z] = o[I];
    b[z + 1] = b[I + 1];
    o[z + 1] = o[I + 1];
    I = Mi(g, b[l + 8]);
    b[B] = b[I];
    o[B] = o[I];
    b[B + 1] = b[I + 1];
    o[B + 1] = o[I + 1];
    I = l;
    Zc(n, e, h);
    b[I] = b[E];
    o[I] = o[E];
    b[I + 1] = b[E + 1];
    o[I + 1] = o[E + 1];
    I = l + 2;
    Zc(p, i, m);
    b[I] = b[D];
    o[I] = o[D];
    b[I + 1] = b[D + 1];
    o[I + 1] = o[D + 1];
    I = l + 4;
    K(u, l + 2, l);
    b[I] = b[H];
    o[I] = o[H];
    b[I + 1] = b[H + 1];
    o[I + 1] = o[H + 1];
    o[l + 6] = 0;
    k += 1;
    if (k >= b[y]) break a;
  } while (0);
  j = 1 < b[c + 27] ? 6 : 9;
  a : do if (6 == j) {
    k = o[f];
    l = bj(c);
    j = l < .5 * k ? 8 : 7;
    if (7 == j && !(2 * k < l | 1.1920928955078125e-7 > l)) break a;
    b[c + 27] = 0;
  } while (0);
  j = 0 == b[c + 27] ? 10 : 11;
  10 == j && (b[c + 7] = 0, b[c + 8] = 0, f = Mi(d, 0), b[s] = b[f], o[s] = o[f], b[s + 1] = b[f + 1], o[s + 1] = o[f + 1], g = Mi(g, 0), b[q] = b[g], o[q] = o[g], b[q + 1] = b[g + 1], o[q + 1] = o[g + 1], Zc(v, e, s), b[c] = b[v], o[c] = o[v], b[c + 1] = b[v + 1], o[c + 1] = o[v + 1], e = c + 2, Zc(x, i, q), b[e] = b[x], o[e] = o[x], b[e + 1] = b[x + 1], o[e + 1] = o[x + 1], i = c + 4, K(w, c + 2, c), b[i] = b[w], o[i] = o[w], b[i + 1] = b[w + 1], o[i + 1] = o[w + 1], b[c + 27] = 1);
  a = h;
}

Gi.X = 1;

function Li(c, f) {
  var d, e, g, i, h;
  e = 0;
  g = O(b[c + 4], f);
  i = 1;
  var j = c + 5;
  d = i < b[j] ? 1 : 5;
  a : do if (1 == d) for (var k = c + 4; ; ) if (h = O(b[k] + (i << 1), f), d = h > g ? 3 : 4, 3 == d && (e = i, g = h), i += 1, i >= b[j]) break a; while (0);
  return e;
}

function Qi(c, f) {
  var d = a;
  a += 2;
  K(d, c, f);
  var e = Dg(d);
  a = d;
  return e;
}

function Ri(c, f) {
  var d, e;
  d = bj(c);
  o[f] = d;
  b[f + 1] = b[c + 27] & 65535;
  e = 0;
  var g = c + 27;
  d = e < b[g] ? 1 : 2;
  a : do if (1 == d) for (;;) if (b[e + (f + 2)] = b[c + 9 * e + 7] & 255, b[e + (f + 5)] = b[c + 9 * e + 8] & 255, e += 1, e >= b[g]) break a; while (0);
}

Ri.X = 1;

function bj(c) {
  var f = a;
  a += 4;
  var d, e, g = f + 2;
  d = b[c + 27];
  d = 0 == d ? 1 : 1 == d ? 2 : 2 == d ? 3 : 3 == d ? 4 : 5;
  5 == d ? (C(zi, 259, cj, Bi), e = 0) : 1 == d ? (C(zi, 246, cj, Bi), e = 0) : 2 == d ? e = 0 : 3 == d ? e = Qi(c + 4, c + 13) : 4 == d && (K(f, c + 13, c + 4), K(g, c + 22, c + 4), e = Q(f, g));
  a = f;
  return e;
}

function dj(c, f, d) {
  Zc(c, f + 3, d);
}

function ej(c) {
  var f, d;
  f = b[b[c + 12] + 2];
  d = b[b[c + 13] + 2];
  U(fj, A(1, "i32", r));
  U(gj, A([ f ], "i32", r));
  U(hj, A([ d ], "i32", r));
  U(ij, A([ b[c + 16] & 1 ], "i32", r));
  U(jj, A([ o[c + 21], o[c + 22] ], "double", r));
  U(kj, A([ o[c + 23], o[c + 24] ], "double", r));
  U(lj, A([ o[c + 27] ], "double", r));
  U(mj, A([ o[c + 18] ], "double", r));
  U(nj, A([ o[c + 19] ], "double", r));
  U(oj, A([ b[c + 14] ], "i32", r));
}

ej.X = 1;

function pj(c, f) {
  var d = a;
  a += 32;
  var e, g, i = d + 2, h, j = d + 4, k, l = d + 6, m, n = d + 8, p = d + 10, u = d + 12, s = d + 14, q = d + 16, v = d + 18;
  e = d + 20;
  var x = d + 22, w = d + 24, y, z = d + 26, B = d + 28, E = d + 30;
  b[c + 28] = b[b[c + 12] + 2];
  b[c + 29] = b[b[c + 13] + 2];
  h = c + 36;
  m = b[c + 12] + 7;
  b[h] = b[m];
  o[h] = o[m];
  b[h + 1] = b[m + 1];
  o[h + 1] = o[m + 1];
  h = c + 38;
  m = b[c + 13] + 7;
  b[h] = b[m];
  o[h] = o[m];
  b[h + 1] = b[m + 1];
  o[h + 1] = o[m + 1];
  o[c + 40] = o[b[c + 12] + 30];
  o[c + 41] = o[b[c + 13] + 30];
  o[c + 42] = o[b[c + 12] + 32];
  o[c + 43] = o[b[c + 13] + 32];
  h = b[f + 6] + 3 * b[c + 28];
  b[d] = b[h];
  o[d] = o[h];
  b[d + 1] = b[h + 1];
  o[d + 1] = o[h + 1];
  g = o[b[f + 6] + 3 * b[c + 28] + 2];
  h = b[f + 7] + 3 * b[c + 28];
  b[i] = b[h];
  o[i] = o[h];
  b[i + 1] = b[h + 1];
  o[i + 1] = o[h + 1];
  h = o[b[f + 7] + 3 * b[c + 28] + 2];
  m = b[f + 6] + 3 * b[c + 29];
  b[j] = b[m];
  o[j] = o[m];
  b[j + 1] = b[m + 1];
  o[j + 1] = o[m + 1];
  k = o[b[f + 6] + 3 * b[c + 29] + 2];
  m = b[f + 7] + 3 * b[c + 29];
  b[l] = b[m];
  o[l] = o[m];
  b[l + 1] = b[m + 1];
  o[l + 1] = o[m + 1];
  m = o[b[f + 7] + 3 * b[c + 29] + 2];
  qj(n, g);
  qj(p, k);
  g = c + 32;
  K(s, c + 21, c + 36);
  J(u, n, s);
  b[g] = b[u];
  o[g] = o[u];
  b[g + 1] = b[u + 1];
  o[g + 1] = o[u + 1];
  n = c + 34;
  K(v, c + 23, c + 38);
  J(q, p, v);
  b[n] = b[q];
  o[n] = o[q];
  b[n + 1] = b[q + 1];
  o[n + 1] = o[q + 1];
  p = c + 30;
  P(w, j, c + 34);
  K(x, w, d);
  K(e, x, c + 32);
  b[p] = b[e];
  o[p] = o[e];
  b[p + 1] = b[e + 1];
  o[p + 1] = o[e + 1];
  x = Dg(c + 30);
  e = .004999999888241291 < x ? 1 : 2;
  1 == e ? Yc(c + 30, 1 / x) : 2 == e && Qe(c + 30, 0, 0);
  e = Q(c + 32, c + 30);
  w = Q(c + 34, c + 30);
  j = o[c + 40] + o[c + 42] * e * e + o[c + 41] + o[c + 43] * w * w;
  0 != o[c + 40] + o[c + 42] * e * e + o[c + 41] + o[c + 43] * w * w ? e = 4 : (y = 0, e = 5);
  4 == e && (y = 1 / j);
  o[c + 44] = y;
  e = 0 < o[c + 18] ? 6 : 11;
  if (6 == e) {
    y = x - o[c + 27];
    x = 6.2831854820251465 * o[c + 18];
    e = 2 * o[c + 44] * o[c + 19] * x;
    x *= o[c + 44] * x;
    w = o[f];
    o[c + 25] = w * (e + w * x);
    if (0 != o[c + 25]) e = 7; else {
      var D = 0;
      e = 8;
    }
    7 == e && (D = 1 / o[c + 25]);
    o[c + 25] = D;
    o[c + 20] = y * w * x * o[c + 25];
    D = j + o[c + 25];
    if (0 != D) e = 9; else {
      var H = 0;
      e = 10;
    }
    9 == e && (H = 1 / D);
    o[c + 44] = H;
  } else 11 == e && (o[c + 25] = 0, o[c + 20] = 0);
  e = b[f + 5] & 1 ? 13 : 14;
  13 == e ? (o[c + 26] *= o[f + 2], N(z, o[c + 26], c + 30), N(B, o[c + 40], z), ii(i, B), h -= o[c + 42] * Q(c + 32, z), N(E, o[c + 41], z), Wc(l, E), m += o[c + 43] * Q(c + 34, z)) : 14 == e && (o[c + 26] = 0);
  z = b[f + 7] + 3 * b[c + 28];
  b[z] = b[i];
  o[z] = o[i];
  b[z + 1] = b[i + 1];
  o[z + 1] = o[i + 1];
  o[b[f + 7] + 3 * b[c + 28] + 2] = h;
  i = b[f + 7] + 3 * b[c + 29];
  b[i] = b[l];
  o[i] = o[l];
  b[i + 1] = b[l + 1];
  o[i + 1] = o[l + 1];
  o[b[f + 7] + 3 * b[c + 29] + 2] = m;
  a = d;
}

pj.X = 1;

function rj(c, f) {
  var d = a;
  a += 20;
  var e, g = d + 2, i, h = d + 4, j = d + 6, k = d + 8, l = d + 10, m = d + 12, n = d + 14, p = d + 16, u = d + 18;
  e = b[f + 7] + 3 * b[c + 28];
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  e = o[b[f + 7] + 3 * b[c + 28] + 2];
  i = b[f + 7] + 3 * b[c + 29];
  b[g] = b[i];
  o[g] = o[i];
  b[g + 1] = b[i + 1];
  o[g + 1] = o[i + 1];
  i = o[b[f + 7] + 3 * b[c + 29] + 2];
  $c(j, e, c + 32);
  P(h, d, j);
  $c(l, i, c + 34);
  P(k, g, l);
  j = c + 30;
  K(m, k, h);
  h = -o[c + 44] * (O(j, m) + o[c + 20] + o[c + 25] * o[c + 26]);
  o[c + 26] += h;
  N(n, h, c + 30);
  N(p, o[c + 40], n);
  ii(d, p);
  e -= o[c + 42] * Q(c + 32, n);
  N(u, o[c + 41], n);
  Wc(g, u);
  i += o[c + 43] * Q(c + 34, n);
  n = b[f + 7] + 3 * b[c + 28];
  b[n] = b[d];
  o[n] = o[d];
  b[n + 1] = b[d + 1];
  o[n + 1] = o[d + 1];
  o[b[f + 7] + 3 * b[c + 28] + 2] = e;
  e = b[f + 7] + 3 * b[c + 29];
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  o[b[f + 7] + 3 * b[c + 29] + 2] = i;
  a = d;
}

rj.X = 1;

function sj(c, f) {
  var d = a;
  a += 28;
  var e, g, i = d + 2, h = d + 4, j = d + 6, k = d + 8, l = d + 10, m = d + 12, n = d + 14, p = d + 16, u = d + 18, s = d + 20, q = d + 22, v = d + 24, x = d + 26;
  e = 0 < o[c + 18] ? 1 : 2;
  1 == e ? g = 1 : 2 == e && (e = b[f + 6] + 3 * b[c + 28], b[d] = b[e], o[d] = o[e], b[d + 1] = b[e + 1], o[d + 1] = o[e + 1], e = o[b[f + 6] + 3 * b[c + 28] + 2], g = b[f + 6] + 3 * b[c + 29], b[i] = b[g], o[i] = o[g], b[i + 1] = b[g + 1], o[i + 1] = o[g + 1], g = o[b[f + 6] + 3 * b[c + 29] + 2], qj(h, e), qj(j, g), K(l, c + 21, c + 36), J(k, h, l), K(n, c + 23, c + 38), J(m, j, n), P(s, i, m), K(u, s, d), K(p, u, k), h = Cg(p), h -= o[c + 27], h = ri(h, -.20000000298023224, .20000000298023224), j = -o[c + 44] * h, N(q, j, p), N(v, o[c + 40], q), ii(d, v), e -= o[c + 42] * Q(k, q), N(x, o[c + 41], q), Wc(i, x), g += o[c + 43] * Q(m, q), k = b[f + 6] + 3 * b[c + 28], b[k] = b[d], o[k] = o[d], b[k + 1] = b[d + 1], o[k + 1] = o[d + 1], o[b[f + 6] + 3 * b[c + 28] + 2] = e, k = b[f + 6] + 3 * b[c + 29], b[k] = b[i], o[k] = o[i], b[k + 1] = b[i + 1], o[k + 1] = o[i + 1], o[b[f + 6] + 3 * b[c + 29] + 2] = g, g = .004999999888241291 > ch(h));
  a = d;
  return g;
}

sj.X = 1;

function qj(c, f) {
  var d = Nc(f);
  o[c] = d;
  d = Oc(f);
  o[c + 1] = d;
}

function tj(c, f) {
  var d;
  d = 0 <= f ? 1 : 2;
  1 == d && (d = f < b[c + 3] ? 3 : 2);
  2 == d && C(uj, 97, vj, wj);
  d = 0 < b[c + 2] ? 5 : 4;
  4 == d && C(uj, 98, vj, xj);
  b[b[c + 1] + 9 * f + 5] = b[c + 4];
  b[b[c + 1] + 9 * f + 8] = -1;
  b[c + 4] = f;
  b[c + 2] -= 1;
}

function $d(c) {
  var f, d;
  b[c] = -1;
  b[c + 3] = 16;
  b[c + 2] = 0;
  f = db(36 * b[c + 3]);
  b[c + 1] = f;
  f = b[c + 1];
  d = 36 * b[c + 3];
  for (var e = 0; e < 9 * (d / 36); e++) b[f + e] = 0, o[f + e] = 0;
  d = 0;
  e = c + 3;
  f = d < b[e] - 1 ? 1 : 3;
  a : do if (1 == f) for (var g = c + 1, i = c + 1; ; ) if (b[b[g] + 9 * d + 5] = d + 1, b[b[i] + 9 * d + 8] = -1, d += 1, d >= b[e] - 1) break a; while (0);
  b[b[c + 1] + 9 * (b[c + 3] - 1) + 5] = -1;
  b[b[c + 1] + 9 * (b[c + 3] - 1) + 8] = -1;
  b[c + 4] = 0;
  b[c + 5] = 0;
  b[c + 6] = 0;
}

$d.X = 1;

function yj(c) {
  var f, d;
  f = -1 == b[c + 4] ? 1 : 7;
  if (1 == f) {
    f = b[c + 2] == b[c + 3] ? 3 : 2;
    2 == f && C(uj, 61, zj, Aj);
    d = b[c + 1];
    b[c + 3] <<= 1;
    f = db(36 * b[c + 3]);
    b[c + 1] = f;
    f = d;
    d += 9 * (36 * b[c + 2] / 36);
    for (var e = b[c + 1]; f < d; f++, e++) b[e] = b[f], o[e] = o[f];
    d = b[c + 2];
    e = c + 3;
    f = d < b[e] - 1 ? 4 : 6;
    a : do if (4 == f) for (var g = c + 1, i = c + 1; ; ) if (b[b[g] + 9 * d + 5] = d + 1, b[b[i] + 9 * d + 8] = -1, d += 1, d >= b[e] - 1) break a; while (0);
    b[b[c + 1] + 9 * (b[c + 3] - 1) + 5] = -1;
    b[b[c + 1] + 9 * (b[c + 3] - 1) + 8] = -1;
    b[c + 4] = b[c + 2];
  }
  f = b[c + 4];
  b[c + 4] = b[b[c + 1] + 9 * f + 5];
  b[b[c + 1] + 9 * f + 5] = -1;
  b[b[c + 1] + 9 * f + 6] = -1;
  b[b[c + 1] + 9 * f + 7] = -1;
  b[b[c + 1] + 9 * f + 8] = 0;
  b[b[c + 1] + 9 * f + 4] = 0;
  b[c + 2] += 1;
  return f;
}

yj.X = 1;

function Bj(c, f, d) {
  var e = a;
  a += 6;
  var g, i = e + 2, h = e + 4;
  g = yj(c);
  Xc(e, .10000000149011612, .10000000149011612);
  var j = b[c + 1] + 9 * g;
  K(i, f, e);
  b[j] = b[i];
  o[j] = o[i];
  b[j + 1] = b[i + 1];
  o[j + 1] = o[i + 1];
  i = b[c + 1] + 9 * g + 2;
  P(h, f + 2, e);
  b[i] = b[h];
  o[i] = o[h];
  b[i + 1] = b[h + 1];
  o[i + 1] = o[h + 1];
  b[b[c + 1] + 9 * g + 4] = d;
  b[b[c + 1] + 9 * g + 8] = 0;
  Cj(c, g);
  a = e;
  return g;
}

Bj.X = 1;

function Cj(c, f) {
  var d = a;
  a += 24;
  var e, g, i, h, j = d + 4, k, l, m, n = d + 8, p = d + 12, u, s = d + 16, q = d + 20, v, x;
  b[c + 6] += 1;
  e = -1 == b[c] ? 1 : 2;
  a : do if (1 == e) b[c] = f, b[b[c + 1] + 9 * b[c] + 5] = -1; else if (2 == e) {
    g = d;
    e = b[c + 1] + 9 * f;
    b[g] = b[e];
    o[g] = o[e];
    b[g + 1] = b[e + 1];
    o[g + 1] = o[e + 1];
    b[g + 2] = b[e + 2];
    o[g + 2] = o[e + 2];
    b[g + 3] = b[e + 3];
    o[g + 3] = o[e + 3];
    g = b[c];
    var w = c + 1, y = c + 1, z = c + 1, B = c + 1, E = c + 1, D = c + 1;
    v = c + 1;
    x = c + 1;
    var H = c + 1, I = c + 1, M = c + 1, G = c + 1, T = c + 1;
    b : for (; 0 == (-1 == b[b[w] + 9 * g + 6]); ) {
      i = b[b[y] + 9 * g + 6];
      h = b[b[z] + 9 * g + 7];
      e = Dj(b[B] + 9 * g);
      Ej(j, b[E] + 9 * g, d);
      k = Dj(j);
      l = 2 * k;
      k = 2 * (k - e);
      e = -1 == b[b[D] + 9 * i + 6] ? 5 : 6;
      5 == e ? (Ej(n, d, b[v] + 9 * i), m = Dj(n) + k) : 6 == e && (Ej(p, d, b[G] + 9 * i), m = Dj(b[T] + 9 * i), e = Dj(p), m = e - m + k);
      e = -1 == b[b[x] + 9 * h + 6] ? 8 : 9;
      8 == e ? (Ej(s, d, b[H] + 9 * h), u = Dj(s) + k) : 9 == e && (Ej(q, d, b[I] + 9 * h), u = Dj(b[M] + 9 * h), e = Dj(q), u = e - u + k);
      e = l < m ? 11 : 12;
      if (11 == e && l < u) break b;
      e = m < u ? 13 : 14;
      13 == e ? g = i : 14 == e && (g = h);
    }
    i = b[b[c + 1] + 9 * g + 5];
    h = yj(c);
    b[b[c + 1] + 9 * h + 5] = i;
    b[b[c + 1] + 9 * h + 4] = 0;
    Ej(b[c + 1] + 9 * h, d, b[c + 1] + 9 * g);
    b[b[c + 1] + 9 * h + 8] = b[b[c + 1] + 9 * g + 8] + 1;
    e = -1 != i ? 16 : 20;
    16 == e ? (l = b[c + 1] + 9 * i, e = b[b[c + 1] + 9 * i + 6] == g ? 17 : 18, 17 == e ? b[l + 6] = h : 18 == e && (b[l + 7] = h), b[b[c + 1] + 9 * h + 6] = g, b[b[c + 1] + 9 * h + 7] = f, b[b[c + 1] + 9 * g + 5] = h, b[b[c + 1] + 9 * f + 5] = h) : 20 == e && (b[b[c + 1] + 9 * h + 6] = g, b[b[c + 1] + 9 * h + 7] = f, b[b[c + 1] + 9 * g + 5] = h, b[b[c + 1] + 9 * f + 5] = h, b[c] = h);
    g = b[b[c + 1] + 9 * f + 5];
    if (-1 == b[b[c + 1] + 9 * f + 5]) e = 28; else {
      i = c + 1;
      h = c + 1;
      l = c + 1;
      w = c + 1;
      y = c + 1;
      z = c + 1;
      B = c + 1;
      E = c + 1;
      for (D = c + 1; ; ) {
        g = Fj(c, g);
        v = b[b[i] + 9 * g + 6];
        x = b[b[h] + 9 * g + 7];
        if (-1 != v) {
          var R = b[b[h] + 9 * g + 7];
          e = 25;
        } else e = 24;
        24 == e && (C(uj, 307, Gj, Hj), R = x);
        e = -1 != R ? 27 : 26;
        26 == e && C(uj, 308, Gj, Ij);
        b[b[y] + 9 * g + 8] = (b[b[l] + 9 * v + 8] > b[b[w] + 9 * x + 8] ? b[b[l] + 9 * v + 8] : b[b[w] + 9 * x + 8]) + 1;
        Ej(b[z] + 9 * g, b[B] + 9 * v, b[E] + 9 * x);
        g = v = b[b[D] + 9 * g + 5];
        if (-1 == v) break a;
      }
    }
  } while (0);
  a = d;
}

Cj.X = 1;

function Jj(c, f) {
  var d, e;
  e = 1;
  1 == e && (d = o[c] <= o[f]);
  if (d & 1) e = 3; else {
    var g = 0;
    e = 4;
  }
  3 == e && (g = o[c + 1] <= o[f + 1]);
  if (g & 1) e = 5; else {
    var i = 0;
    e = 6;
  }
  5 == e && (i = o[f + 2] <= o[c + 2]);
  if (i & 1) e = 7; else {
    var h = 0;
    e = 8;
  }
  7 == e && (h = o[f + 3] <= o[c + 3]);
  return h & 1;
}

Jj.X = 1;

function Dj(c) {
  return 2 * (o[c + 2] - o[c] + (o[c + 3] - o[c + 1]));
}

function Ej(c, f, d) {
  var e = a;
  a += 4;
  var g = e + 2;
  Oe(e, f, d);
  b[c] = b[e];
  o[c] = o[e];
  b[c + 1] = b[e + 1];
  o[c + 1] = o[e + 1];
  c += 2;
  Pe(g, f + 2, d + 2);
  b[c] = b[g];
  o[c] = o[g];
  b[c + 1] = b[g + 1];
  o[c + 1] = o[g + 1];
  a = e;
}

function Kj(c, f) {
  var d, e, g, i, h, j;
  d = f == b[c] ? 1 : 2;
  a : do if (1 == d) b[c] = -1; else if (2 == d) {
    e = b[b[c + 1] + 9 * f + 5];
    g = b[b[c + 1] + 9 * e + 5];
    var k = b[c + 1] + 9 * e;
    d = b[b[c + 1] + 9 * e + 6] == f ? 3 : 4;
    3 == d ? i = b[k + 7] : 4 == d && (i = b[k + 6]);
    d = -1 != g ? 6 : 12;
    if (6 == d) {
      k = b[c + 1] + 9 * g;
      d = b[b[c + 1] + 9 * g + 6] == e ? 7 : 8;
      7 == d ? b[k + 6] = i : 8 == d && (b[k + 7] = i);
      b[b[c + 1] + 9 * i + 5] = g;
      tj(c, e);
      e = g;
      if (-1 == g) break a;
      g = c + 1;
      for (var k = c + 1, l = c + 1, m = c + 1, n = c + 1, p = c + 1, u = c + 1, s = c + 1, q = c + 1; ; ) if (e = Fj(c, e), h = b[b[g] + 9 * e + 6], j = b[b[k] + 9 * e + 7], Ej(b[l] + 9 * e, b[m] + 9 * h, b[n] + 9 * j), b[b[s] + 9 * e + 8] = (b[b[p] + 9 * h + 8] > b[b[u] + 9 * j + 8] ? b[b[p] + 9 * h + 8] : b[b[u] + 9 * j + 8]) + 1, e = h = b[b[q] + 9 * e + 5], -1 == h) break a;
    } else 12 == d && (b[c] = i, b[b[c + 1] + 9 * i + 5] = -1, tj(c, e));
  } while (0);
}

Kj.X = 1;

function Lj(c, f, d, e) {
  var g = a;
  a += 12;
  var i, h, j = g + 4, k = g + 6, l = g + 8, m = g + 10;
  i = 0 <= f ? 1 : 2;
  1 == i && (i = f < b[c + 3] ? 3 : 2);
  2 == i && C(uj, 135, Mj, Eh);
  i = -1 == b[b[c + 1] + 9 * f + 6] ? 5 : 4;
  4 == i && C(uj, 137, Mj, Nj);
  i = Jj(b[c + 1] + 9 * f, d) ? 6 : 7;
  6 == i ? h = 0 : 7 == i && (Kj(c, f), b[g] = b[d], o[g] = o[d], b[g + 1] = b[d + 1], o[g + 1] = o[d + 1], b[g + 2] = b[d + 2], o[g + 2] = o[d + 2], b[g + 3] = b[d + 3], o[g + 3] = o[d + 3], Xc(j, .10000000149011612, .10000000149011612), K(k, g, j), b[g] = b[k], o[g] = o[k], b[g + 1] = b[k + 1], o[g + 1] = o[k + 1], i = g + 2, P(l, g + 2, j), b[i] = b[l], o[i] = o[l], b[i + 1] = b[l + 1], o[i + 1] = o[l + 1], N(m, 2, e), e = o[m], i = 0 > o[m] ? 8 : 9, 8 == i ? o[g] += e : 9 == i && (o[g + 2] += e), e = o[m + 1], i = 0 > o[m + 1] ? 11 : 12, 11 == i ? o[g + 1] += e : 12 == i && (o[g + 3] += e), m = b[c + 1] + 9 * f, b[m] = b[g], o[m] = o[g], b[m + 1] = b[g + 1], o[m + 1] = o[g + 1], b[m + 2] = b[g + 2], o[m + 2] = o[g + 2], b[m + 3] = b[g + 3], o[m + 3] = o[g + 3], Cj(c, f), h = 1);
  a = g;
  return h;
}

Lj.X = 1;

function Fj(c, f) {
  var d, e, g, i, h, j, k, l, m;
  1 == (-1 != f ? 2 : 1) && C(uj, 382, Oj, Pj);
  g = b[c + 1] + 9 * f;
  d = -1 == b[g + 6] ? 4 : 3;
  a : do if (3 == d) if (2 > b[g + 8]) d = 4; else if (i = b[g + 6], h = b[g + 7], d = 0 <= i ? 6 : 7, 6 == d && (d = i < b[c + 3] ? 8 : 7), 7 == d && C(uj, 392, Oj, Qj), d = 0 <= h ? 9 : 10, 9 == d && (d = h < b[c + 3] ? 11 : 10), 10 == d && C(uj, 393, Oj, Rj), j = b[c + 1] + 9 * i, k = b[c + 1] + 9 * h, l = b[k + 8] - b[j + 8], d = 1 < b[k + 8] - b[j + 8] ? 12 : 29, 12 == d) {
    i = b[k + 6];
    e = b[k + 7];
    l = b[c + 1] + 9 * i;
    m = b[c + 1] + 9 * e;
    d = 0 <= i ? 13 : 14;
    13 == d && (d = i < b[c + 3] ? 15 : 14);
    14 == d && C(uj, 407, Oj, Sj);
    d = 0 <= e ? 16 : 17;
    16 == d && (d = e < b[c + 3] ? 18 : 17);
    17 == d && C(uj, 408, Oj, Tj);
    b[k + 6] = f;
    b[k + 5] = b[g + 5];
    b[g + 5] = h;
    d = -1 != b[k + 5] ? 19 : 24;
    19 == d ? (d = b[b[c + 1] + 9 * b[k + 5] + 6] == f ? 20 : 21, 20 == d ? b[b[c + 1] + 9 * b[k + 5] + 6] = h : 21 == d && (d = b[b[c + 1] + 9 * b[k + 5] + 7] == f ? 23 : 22, 22 == d && C(uj, 424, Oj, Uj), b[b[c + 1] + 9 * b[k + 5] + 7] = h)) : 24 == d && (b[c] = h);
    d = b[l + 8] > b[m + 8] ? 26 : 27;
    26 == d ? (b[k + 7] = i, b[g + 7] = e, b[m + 5] = f, Ej(g, j, m), Ej(k, g, l), b[g + 8] = (b[j + 8] > b[m + 8] ? b[j + 8] : b[m + 8]) + 1, b[k + 8] = (b[g + 8] > b[l + 8] ? b[g + 8] : b[l + 8]) + 1) : 27 == d && (b[k + 7] = e, b[g + 7] = i, b[l + 5] = f, Ej(g, j, l), Ej(k, g, m), b[g + 8] = (b[j + 8] > b[l + 8] ? b[j + 8] : b[l + 8]) + 1, b[k + 8] = (b[g + 8] > b[m + 8] ? b[g + 8] : b[m + 8]) + 1);
    e = h;
    d = 48;
    break a;
  } else if (29 == d) if (d = -1 > l ? 30 : 47, 30 == d) {
    h = b[j + 6];
    e = b[j + 7];
    l = b[c + 1] + 9 * h;
    m = b[c + 1] + 9 * e;
    d = 0 <= h ? 31 : 32;
    31 == d && (d = h < b[c + 3] ? 33 : 32);
    32 == d && C(uj, 467, Oj, Vj);
    d = 0 <= e ? 34 : 35;
    34 == d && (d = e < b[c + 3] ? 36 : 35);
    35 == d && C(uj, 468, Oj, Wj);
    b[j + 6] = f;
    b[j + 5] = b[g + 5];
    b[g + 5] = i;
    d = -1 != b[j + 5] ? 37 : 42;
    37 == d ? (d = b[b[c + 1] + 9 * b[j + 5] + 6] == f ? 38 : 39, 38 == d ? b[b[c + 1] + 9 * b[j + 5] + 6] = i : 39 == d && (d = b[b[c + 1] + 9 * b[j + 5] + 7] == f ? 41 : 40, 40 == d && C(uj, 484, Oj, Xj), b[b[c + 1] + 9 * b[j + 5] + 7] = i)) : 42 == d && (b[c] = i);
    d = b[l + 8] > b[m + 8] ? 44 : 45;
    44 == d ? (b[j + 7] = h, b[g + 6] = e, b[m + 5] = f, Ej(g, k, m), Ej(j, g, l), b[g + 8] = (b[k + 8] > b[m + 8] ? b[k + 8] : b[m + 8]) + 1, b[j + 8] = (b[g + 8] > b[l + 8] ? b[g + 8] : b[l + 8]) + 1) : 45 == d && (b[j + 7] = e, b[g + 6] = h, b[l + 5] = f, Ej(g, k, l), Ej(j, g, m), b[g + 8] = (b[k + 8] > b[l + 8] ? b[k + 8] : b[l + 8]) + 1, b[j + 8] = (b[g + 8] > b[m + 8] ? b[g + 8] : b[m + 8]) + 1);
    e = i;
    d = 48;
    break a;
  } else if (47 == d) {
    e = f;
    d = 48;
    break a;
  } while (0);
  4 == d && (e = f);
  return e;
}

Fj.X = 1;

function Yj(c, f, d) {
  re(c, f, 0, d, 0);
  b[c] = Zj + 2;
  f = 1 == te(b[c + 12]) ? 2 : 1;
  1 == f && C($j, 41, ak, bk);
  f = 0 == te(b[c + 13]) ? 4 : 3;
  3 == f && C($j, 42, ak, xe);
}

function ck(c, f, d) {
  re(c, f, 0, d, 0);
  b[c] = dk + 2;
  f = 1 == te(b[c + 12]) ? 2 : 1;
  1 == f && C(ek, 41, fk, bk);
  f = 2 == te(b[c + 13]) ? 4 : 3;
  3 == f && C(ek, 42, fk, Ce);
}

function Td(c) {
  Xd(c + 8);
  b[c + 12] = 0;
  b[c + 2] = 0;
  b[c + 1] = 0;
  b[c + 6] = 0;
  b[c + 7] = 0;
  b[c + 3] = 0;
  o[c] = 0;
}

function Rc(c, f, d, e) {
  var g = a;
  a += 10;
  var i, h, j, k = g + 4, l = g + 8;
  i = 0 == b[c + 7] ? 4 : 1;
  a : do if (1 == i) {
    h = 0;
    var m = c + 7;
    if (h < b[m]) for (var n = c + 6, p = c + 3, u = c + 3; ; ) {
      j = b[n] + 7 * h;
      var s = b[p];
      mb[b[b[s] + 6]](s, g, d, b[j + 5]);
      s = b[u];
      mb[b[b[s] + 6]](s, k, e, b[j + 5]);
      Ej(j, g, k);
      K(l, e, d);
      var s = f, q = b[j + 6];
      1 == (Lj(s, q, j, l) & 1 ? 1 : 2) && ie(s, q);
      h += 1;
      if (h >= b[m]) break a;
    } else i = 4;
  } while (0);
  a = g;
}

Rc.X = 1;

function Te(c, f, d, e) {
  var g = a;
  a += 30;
  var i, h, j = g + 2, k = g + 4, l = g + 6, m = g + 8, n = g + 10, p = g + 12, u = g + 14, s = g + 16;
  i = g + 18;
  var q = g + 20, v = g + 22, x = g + 24, w = g + 26, y = g + 28, z = e + 2;
  K(j, d, e);
  Og(g, z, j);
  j = e + 2;
  K(l, d + 2, e);
  Og(k, j, l);
  K(m, k, g);
  e = c + 3;
  b[n] = b[e];
  o[n] = o[e];
  b[n + 1] = b[e + 1];
  o[n + 1] = o[e + 1];
  c += 5;
  b[p] = b[c];
  o[p] = o[c];
  b[p + 1] = b[c + 1];
  o[p + 1] = o[c + 1];
  K(u, p, n);
  Xc(s, o[u + 1], -o[u]);
  Cg(s);
  K(i, n, g);
  u = O(s, i);
  c = O(s, m);
  i = 0 == c ? 1 : 2;
  a : do if (1 == i) h = 0; else if (2 == i) {
    h = u / c;
    i = 0 > h ? 4 : 3;
    do if (3 == i) if (o[d + 4] < h) i = 4; else if (N(v, h, m), P(q, g, v), K(x, p, n), e = O(x, x), i = 0 == e ? 6 : 7, 6 == i) {
      h = 0;
      break a;
    } else if (7 == i) if (K(w, q, n), i = O(w, x) / e, i = 0 > i | 1 < i ? 8 : 9, 8 == i) {
      h = 0;
      break a;
    } else if (9 == i) {
      o[f + 2] = h;
      i = 0 < u ? 10 : 11;
      10 == i ? (Pg(y, s), s = f, b[s] = b[y], o[s] = o[y], b[s + 1] = b[y + 1], o[s + 1] = o[y + 1]) : 11 == i && (y = f, b[y] = b[s], o[y] = o[s], b[y + 1] = b[s + 1], o[y + 1] = o[s + 1]);
      h = 1;
      break a;
    } while (0);
    h = 0;
  } while (0);
  a = g;
  return h;
}

Te.X = 1;

function Ud(c, f, d, e) {
  var g;
  b[c + 12] = b[e + 1];
  o[c + 4] = o[e + 2];
  o[c + 5] = o[e + 3];
  b[c + 2] = d;
  b[c + 1] = 0;
  d = c + 8;
  g = e + 6;
  b[d] = b[g];
  o[d] = o[g];
  b[d + 1] = b[g + 1];
  o[d + 1] = o[g + 1];
  b[d + 2] = b[g + 2];
  o[d + 2] = o[g + 2];
  b[c + 11] = b[e + 5] & 1;
  d = b[e];
  d = mb[b[b[d] + 2]](d, f);
  b[c + 3] = d;
  d = b[c + 3];
  d = mb[b[b[d] + 3]](d);
  f = qc(f, 28 * d);
  b[c + 6] = f;
  g = 0;
  f = g < d ? 1 : 3;
  a : do if (1 == f) for (var i = c + 6, h = c + 6; ; ) if (b[b[i] + 7 * g + 4] = 0, b[b[h] + 7 * g + 6] = -1, g += 1, g >= d) break a; while (0);
  b[c + 7] = 0;
  o[c] = o[e + 4];
}

Ud.X = 1;

function gk(c, f) {
  var d;
  d = 0 == b[c + 7] ? 2 : 1;
  1 == d && C(hk, 72, ik, jk);
  d = b[c + 3];
  d = mb[b[b[d] + 3]](d);
  Mb(f, b[c + 6], 28 * d);
  b[c + 6] = 0;
  d = b[b[c + 3] + 1];
  d = 0 == d ? 3 : 1 == d ? 4 : 2 == d ? 5 : 3 == d ? 6 : 7;
  7 == d ? C(hk, 115, ik, Bi) : 3 == d ? (d = b[c + 3], mb[b[b[d]]](d), Mb(f, d, 20)) : 4 == d ? (d = b[c + 3], mb[b[b[d]]](d), Mb(f, d, 48)) : 5 == d ? (d = b[c + 3], mb[b[b[d]]](d), Mb(f, d, 152)) : 6 == d && (d = b[c + 3], mb[b[b[d]]](d), Mb(f, d, 40));
  b[c + 3] = 0;
}

gk.X = 1;

function Vd(c, f, d) {
  var e, g, i;
  e = 0 == b[c + 7] ? 2 : 1;
  1 == e && C(hk, 124, kk, jk);
  e = b[c + 3];
  e = mb[b[b[e] + 3]](e);
  b[c + 7] = e;
  g = 0;
  var h = c + 7;
  e = g < b[h] ? 3 : 5;
  a : do if (3 == e) for (var j = c + 6, k = c + 3; ; ) {
    i = b[j] + 7 * g;
    var l = b[k];
    mb[b[b[l] + 6]](l, i, d, g);
    var l = f, m = ba, m = Bj(l, i, i);
    b[l + 7] += 1;
    ie(l, m);
    b[i + 6] = m;
    b[i + 4] = c;
    b[i + 5] = g;
    g += 1;
    if (g >= b[h]) break a;
  } while (0);
}

Vd.X = 1;

function lk(c, f) {
  Yi(c, f);
  b[c] = mk + 2;
  var d = c + 18, e = f + 5;
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  d = c + 20;
  e = f + 7;
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  dc(c + 22);
  o[c + 24] = 0;
  o[c + 25] = o[f + 9];
  o[c + 26] = o[f + 10];
}

lk.X = 1;

function nk(c, f) {
  var d = a;
  a += 30;
  var e, g, i, h, j = d + 2, k, l = d + 4, m = d + 6, n = d + 8, p = d + 10, u = d + 12, s = d + 14;
  e = d + 16;
  var q = d + 20, v = d + 24, x = d + 26, w = d + 28;
  b[c + 27] = b[b[c + 12] + 2];
  b[c + 28] = b[b[c + 13] + 2];
  i = c + 33;
  k = b[c + 12] + 7;
  b[i] = b[k];
  o[i] = o[k];
  b[i + 1] = b[k + 1];
  o[i + 1] = o[k + 1];
  i = c + 35;
  k = b[c + 13] + 7;
  b[i] = b[k];
  o[i] = o[k];
  b[i + 1] = b[k + 1];
  o[i + 1] = o[k + 1];
  o[c + 37] = o[b[c + 12] + 30];
  o[c + 38] = o[b[c + 13] + 30];
  o[c + 39] = o[b[c + 12] + 32];
  o[c + 40] = o[b[c + 13] + 32];
  g = o[b[f + 6] + 3 * b[c + 27] + 2];
  i = b[f + 7] + 3 * b[c + 27];
  b[d] = b[i];
  o[d] = o[i];
  b[d + 1] = b[i + 1];
  o[d + 1] = o[i + 1];
  i = o[b[f + 7] + 3 * b[c + 27] + 2];
  h = o[b[f + 6] + 3 * b[c + 28] + 2];
  k = b[f + 7] + 3 * b[c + 28];
  b[j] = b[k];
  o[j] = o[k];
  b[j + 1] = b[k + 1];
  o[j + 1] = o[k + 1];
  k = o[b[f + 7] + 3 * b[c + 28] + 2];
  qj(l, g);
  qj(m, h);
  g = c + 29;
  K(p, c + 18, c + 33);
  J(n, l, p);
  b[g] = b[n];
  o[g] = o[n];
  b[g + 1] = b[n + 1];
  o[g + 1] = o[n + 1];
  l = c + 31;
  K(s, c + 20, c + 35);
  J(u, m, s);
  b[l] = b[u];
  o[l] = o[u];
  b[l + 1] = b[u + 1];
  o[l + 1] = o[u + 1];
  m = o[c + 37];
  u = o[c + 38];
  s = o[c + 39];
  l = o[c + 40];
  o[e] = m + u + s * o[c + 30] * o[c + 30] + l * o[c + 32] * o[c + 32];
  o[e + 1] = -s * o[c + 29] * o[c + 30] - l * o[c + 31] * o[c + 32];
  o[e + 2] = o[e + 1];
  o[e + 3] = m + u + s * o[c + 29] * o[c + 29] + l * o[c + 31] * o[c + 31];
  n = c + 41;
  hi(q, e);
  b[n] = b[q];
  o[n] = o[q];
  b[n + 1] = b[q + 1];
  o[n + 1] = o[q + 1];
  b[n + 2] = b[q + 2];
  o[n + 2] = o[q + 2];
  b[n + 3] = b[q + 3];
  o[n + 3] = o[q + 3];
  o[c + 45] = s + l;
  e = 0 < o[c + 45] ? 1 : 2;
  1 == e && (o[c + 45] = 1 / o[c + 45]);
  q = c + 22;
  e = b[f + 5] & 1 ? 3 : 4;
  3 == e ? (Yc(q, o[f + 2]), o[c + 24] *= o[f + 2], Xc(v, o[c + 22], o[c + 23]), N(x, m, v), ii(d, x), i -= s * (Q(c + 29, v) + o[c + 24]), N(w, u, v), Wc(j, w), k += l * (Q(c + 31, v) + o[c + 24])) : 4 == e && (dc(q), o[c + 24] = 0);
  v = b[f + 7] + 3 * b[c + 27];
  b[v] = b[d];
  o[v] = o[d];
  b[v + 1] = b[d + 1];
  o[v + 1] = o[d + 1];
  o[b[f + 7] + 3 * b[c + 27] + 2] = i;
  v = b[f + 7] + 3 * b[c + 28];
  b[v] = b[j];
  o[v] = o[j];
  b[v + 1] = b[j + 1];
  o[v + 1] = o[j + 1];
  o[b[f + 7] + 3 * b[c + 28] + 2] = k;
  a = d;
}

nk.X = 1;

function ok(c) {
  var f, d;
  f = b[b[c + 12] + 2];
  d = b[b[c + 13] + 2];
  U(pk, A(1, "i32", r));
  U(gj, A([ f ], "i32", r));
  U(hj, A([ d ], "i32", r));
  U(ij, A([ b[c + 16] & 1 ], "i32", r));
  U(jj, A([ o[c + 18], o[c + 19] ], "double", r));
  U(kj, A([ o[c + 20], o[c + 21] ], "double", r));
  U(qk, A([ o[c + 25] ], "double", r));
  U(rk, A([ o[c + 26] ], "double", r));
  U(oj, A([ b[c + 14] ], "i32", r));
}

ok.X = 1;

function sk(c, f) {
  var d = a;
  a += 26;
  var e, g = d + 2, i, h, j, k, l, m, n, p, u, s = d + 4, q = d + 6, v = d + 8, x = d + 10, w = d + 12, y = d + 14, z = d + 16, B = d + 18, E = d + 20, D = d + 22, H = d + 24;
  e = b[f + 7] + 3 * b[c + 27];
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  e = o[b[f + 7] + 3 * b[c + 27] + 2];
  i = b[f + 7] + 3 * b[c + 28];
  b[g] = b[i];
  o[g] = o[i];
  b[g + 1] = b[i + 1];
  o[g + 1] = o[i + 1];
  i = o[b[f + 7] + 3 * b[c + 28] + 2];
  h = o[c + 37];
  j = o[c + 38];
  k = o[c + 39];
  l = o[c + 40];
  m = o[f];
  n = -o[c + 45] * (i - e);
  p = o[c + 24];
  u = m * o[c + 26];
  o[c + 24] = ri(o[c + 24] + n, -u, u);
  n = o[c + 24] - p;
  e -= k * n;
  i += l * n;
  $c(x, i, c + 31);
  P(v, g, x);
  K(q, v, d);
  $c(w, e, c + 29);
  K(s, q, w);
  ni(z, c + 41, s);
  Pg(y, z);
  s = c + 22;
  b[B] = b[s];
  o[B] = o[s];
  b[B + 1] = b[s + 1];
  o[B + 1] = o[s + 1];
  Wc(c + 22, y);
  s = m * o[c + 25];
  if (1 == (Ki(c + 22) > s * s ? 1 : 2)) Cg(c + 22), Yc(c + 22, s);
  K(E, c + 22, B);
  b[y] = b[E];
  o[y] = o[E];
  b[y + 1] = b[E + 1];
  o[y + 1] = o[E + 1];
  N(D, h, y);
  ii(d, D);
  e -= k * Q(c + 29, y);
  N(H, j, y);
  Wc(g, H);
  i += l * Q(c + 31, y);
  y = b[f + 7] + 3 * b[c + 27];
  b[y] = b[d];
  o[y] = o[d];
  b[y + 1] = b[d + 1];
  o[y + 1] = o[d + 1];
  o[b[f + 7] + 3 * b[c + 27] + 2] = e;
  e = b[f + 7] + 3 * b[c + 28];
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  o[b[f + 7] + 3 * b[c + 28] + 2] = i;
  a = d;
}

sk.X = 1;

function tk(c, f) {
  var d = a;
  a += 40;
  var e, g, i, h, j = d + 4, k, l = d + 8, m = d + 10, n = d + 12, p = d + 14, u = d + 16, s = d + 18, q = d + 20, v = d + 24, x = d + 28, w = d + 30, y = d + 32, z = d + 34, B = d + 36, E = d + 38;
  Yi(c, f);
  b[c] = uk + 2;
  b[c + 18] = b[f + 5];
  b[c + 19] = b[f + 6];
  b[c + 20] = b[b[c + 18] + 1];
  b[c + 21] = b[b[c + 19] + 1];
  e = 1 == b[c + 20] ? 3 : 1;
  1 == e && (2 == b[c + 20] || C(vk, 53, wk, xk));
  e = 1 == b[c + 21] ? 6 : 4;
  4 == e && (2 == b[c + 21] || C(vk, 54, wk, yk));
  b[c + 22] = b[b[c + 18] + 12];
  b[c + 12] = b[b[c + 18] + 13];
  var D = b[c + 12] + 3;
  b[d] = b[D];
  o[d] = o[D];
  b[d + 1] = b[D + 1];
  o[d + 1] = o[D + 1];
  b[d + 2] = b[D + 2];
  o[d + 2] = o[D + 2];
  b[d + 3] = b[D + 3];
  o[d + 3] = o[D + 3];
  h = o[b[c + 12] + 7 + 7];
  D = b[c + 22] + 3;
  b[j] = b[D];
  o[j] = o[D];
  b[j + 1] = b[D + 1];
  o[j + 1] = o[D + 1];
  b[j + 2] = b[D + 2];
  o[j + 2] = o[D + 2];
  b[j + 3] = b[D + 3];
  o[j + 3] = o[D + 3];
  k = o[b[c + 22] + 7 + 7];
  D = b[f + 5];
  e = 1 == b[c + 20] ? 7 : 9;
  7 == e ? (g = c + 28, j = D + 18, b[g] = b[j], o[g] = o[j], b[g + 1] = b[j + 1], o[g + 1] = o[j + 1], g = c + 24, j = D + 20, b[g] = b[j], o[g] = o[j], b[g + 1] = b[j + 1], o[g + 1] = o[j + 1], o[c + 36] = o[D + 30], dc(c + 32), g = h - k - o[c + 36]) : 9 == e && (g = c + 28, h = D + 18, b[g] = b[h], o[g] = o[h], b[g + 1] = b[h + 1], o[g + 1] = o[h + 1], g = c + 24, h = D + 20, b[g] = b[h], o[g] = o[h], b[g + 1] = b[h + 1], o[g + 1] = o[h + 1], o[c + 36] = o[D + 26], g = c + 32, D += 22, b[g] = b[D], o[g] = o[D], b[g + 1] = b[D + 1], o[g + 1] = o[D + 1], g = c + 28, b[l] = b[g], o[l] = o[g], b[l + 1] = b[g + 1], o[l + 1] = o[g + 1], g = j + 2, J(p, d + 2, c + 24), K(u, d, j), P(n, p, u), Og(m, g, n), K(s, m, l), g = O(s, c + 32));
  b[c + 23] = b[b[c + 19] + 12];
  b[c + 13] = b[b[c + 19] + 13];
  j = b[c + 13] + 3;
  b[q] = b[j];
  o[q] = o[j];
  b[q + 1] = b[j + 1];
  o[q + 1] = o[j + 1];
  b[q + 2] = b[j + 2];
  o[q + 2] = o[j + 2];
  b[q + 3] = b[j + 3];
  o[q + 3] = o[j + 3];
  l = o[b[c + 13] + 7 + 7];
  j = b[c + 23] + 3;
  b[v] = b[j];
  o[v] = o[j];
  b[v + 1] = b[j + 1];
  o[v + 1] = o[j + 1];
  b[v + 2] = b[j + 2];
  o[v + 2] = o[j + 2];
  b[v + 3] = b[j + 3];
  o[v + 3] = o[j + 3];
  m = o[b[c + 23] + 7 + 7];
  j = b[f + 6];
  e = 1 == b[c + 21] ? 12 : 13;
  12 == e ? (q = c + 30, v = j + 18, b[q] = b[v], o[q] = o[v], b[q + 1] = b[v + 1], o[q + 1] = o[v + 1], q = c + 26, v = j + 20, b[q] = b[v], o[q] = o[v], b[q + 1] = b[v + 1], o[q + 1] = o[v + 1], o[c + 37] = o[j + 30], dc(c + 34), i = l - m - o[c + 37]) : 13 == e && (i = c + 30, l = j + 18, b[i] = b[l], o[i] = o[l], b[i + 1] = b[l + 1], o[i + 1] = o[l + 1], i = c + 26, l = j + 20, b[i] = b[l], o[i] = o[l], b[i + 1] = b[l + 1], o[i + 1] = o[l + 1], o[c + 37] = o[j + 26], i = c + 34, j += 22, b[i] = b[j], o[i] = o[j], b[i + 1] = b[j + 1], o[i + 1] = o[j + 1], i = c + 30, b[x] = b[i], o[x] = o[i], b[x + 1] = b[i + 1], o[x + 1] = o[i + 1], i = v + 2, J(z, q + 2, c + 26), K(B, q, v), P(y, z, B), Og(w, i, y), K(E, w, x), i = O(E, c + 34));
  o[c + 39] = o[f + 7];
  o[c + 38] = g + o[c + 39] * i;
  o[c + 40] = 0;
  a = d;
}

tk.X = 1;

function zk(c, f) {
  var d = a;
  a += 54;
  var e, g = d + 2, i, h = d + 4, j, k = d + 6, l = d + 8, m, n = d + 10, p = d + 12, u, s = d + 14, q = d + 16, v = d + 18, x = d + 20, w = d + 22, y = d + 24, z = d + 26, B = d + 28, E = d + 30, D = d + 32, H = d + 34, I = d + 36, M = d + 38, G = d + 40, T = d + 42, R = d + 44, L = d + 46, S = d + 48, F = d + 50, X = d + 52;
  b[c + 41] = b[b[c + 12] + 2];
  b[c + 42] = b[b[c + 13] + 2];
  b[c + 43] = b[b[c + 22] + 2];
  b[c + 44] = b[b[c + 23] + 2];
  i = c + 45;
  e = b[c + 12] + 7;
  b[i] = b[e];
  o[i] = o[e];
  b[i + 1] = b[e + 1];
  o[i + 1] = o[e + 1];
  i = c + 47;
  e = b[c + 13] + 7;
  b[i] = b[e];
  o[i] = o[e];
  b[i + 1] = b[e + 1];
  o[i + 1] = o[e + 1];
  i = c + 49;
  e = b[c + 22] + 7;
  b[i] = b[e];
  o[i] = o[e];
  b[i + 1] = b[e + 1];
  o[i + 1] = o[e + 1];
  i = c + 51;
  e = b[c + 23] + 7;
  b[i] = b[e];
  o[i] = o[e];
  b[i + 1] = b[e + 1];
  o[i + 1] = o[e + 1];
  o[c + 53] = o[b[c + 12] + 30];
  o[c + 54] = o[b[c + 13] + 30];
  o[c + 55] = o[b[c + 22] + 30];
  o[c + 56] = o[b[c + 23] + 30];
  o[c + 57] = o[b[c + 12] + 32];
  o[c + 58] = o[b[c + 13] + 32];
  o[c + 59] = o[b[c + 22] + 32];
  o[c + 60] = o[b[c + 23] + 32];
  i = b[f + 6] + 3 * b[c + 41];
  b[d] = b[i];
  o[d] = o[i];
  b[d + 1] = b[i + 1];
  o[d + 1] = o[i + 1];
  e = o[b[f + 6] + 3 * b[c + 41] + 2];
  i = b[f + 7] + 3 * b[c + 41];
  b[g] = b[i];
  o[g] = o[i];
  b[g + 1] = b[i + 1];
  o[g + 1] = o[i + 1];
  i = o[b[f + 7] + 3 * b[c + 41] + 2];
  j = b[f + 6] + 3 * b[c + 42];
  b[h] = b[j];
  o[h] = o[j];
  b[h + 1] = b[j + 1];
  o[h + 1] = o[j + 1];
  j = o[b[f + 6] + 3 * b[c + 42] + 2];
  h = b[f + 7] + 3 * b[c + 42];
  b[k] = b[h];
  o[k] = o[h];
  b[k + 1] = b[h + 1];
  o[k + 1] = o[h + 1];
  h = o[b[f + 7] + 3 * b[c + 42] + 2];
  m = b[f + 6] + 3 * b[c + 43];
  b[l] = b[m];
  o[l] = o[m];
  b[l + 1] = b[m + 1];
  o[l + 1] = o[m + 1];
  m = o[b[f + 6] + 3 * b[c + 43] + 2];
  l = b[f + 7] + 3 * b[c + 43];
  b[n] = b[l];
  o[n] = o[l];
  b[n + 1] = b[l + 1];
  o[n + 1] = o[l + 1];
  l = o[b[f + 7] + 3 * b[c + 43] + 2];
  u = b[f + 6] + 3 * b[c + 44];
  b[p] = b[u];
  o[p] = o[u];
  b[p + 1] = b[u + 1];
  o[p + 1] = o[u + 1];
  u = o[b[f + 6] + 3 * b[c + 44] + 2];
  p = b[f + 7] + 3 * b[c + 44];
  b[s] = b[p];
  o[s] = o[p];
  b[s + 1] = b[p + 1];
  o[s + 1] = o[p + 1];
  p = o[b[f + 7] + 3 * b[c + 44] + 2];
  qj(q, e);
  qj(v, j);
  qj(x, m);
  qj(w, u);
  o[c + 69] = 0;
  e = 1 == b[c + 20] ? 1 : 2;
  1 == e ? (dc(c + 61), o[c + 65] = 1, o[c + 67] = 1, o[c + 69] += o[c + 57] + o[c + 59]) : 2 == e && (J(y, x, c + 32), K(B, c + 28, c + 49), J(z, x, B), K(D, c + 24, c + 45), J(E, q, D), q = c + 61, b[q] = b[y], o[q] = o[y], b[q + 1] = b[y + 1], o[q + 1] = o[y + 1], o[c + 67] = Q(z, y), o[c + 65] = Q(E, y), o[c + 69] += o[c + 55] + o[c + 53] + o[c + 59] * o[c + 67] * o[c + 67] + o[c + 57] * o[c + 65] * o[c + 65]);
  e = 1 == b[c + 21] ? 4 : 5;
  4 == e ? (dc(c + 63), o[c + 66] = o[c + 39], o[c + 68] = o[c + 39], o[c + 69] += o[c + 39] * o[c + 39] * (o[c + 58] + o[c + 60])) : 5 == e && (J(H, w, c + 34), K(M, c + 30, c + 51), J(I, w, M), K(T, c + 26, c + 47), J(G, v, T), v = c + 63, N(R, o[c + 39], H), b[v] = b[R], o[v] = o[R], b[v + 1] = b[R + 1], o[v + 1] = o[R + 1], o[c + 68] = o[c + 39] * Q(I, H), o[c + 66] = o[c + 39] * Q(G, H), o[c + 69] += o[c + 39] * o[c + 39] * (o[c + 56] + o[c + 54]) + o[c + 60] * o[c + 68] * o[c + 68] + o[c + 58] * o[c + 66] * o[c + 66]);
  if (0 < o[c + 69]) e = 7; else {
    var Z = 0;
    e = 8;
  }
  7 == e && (Z = 1 / o[c + 69]);
  o[c + 69] = Z;
  e = b[f + 5] & 1 ? 9 : 10;
  9 == e ? (N(L, o[c + 53] * o[c + 40], c + 61), Wc(g, L), i += o[c + 57] * o[c + 40] * o[c + 65], N(S, o[c + 54] * o[c + 40], c + 63), Wc(k, S), h += o[c + 58] * o[c + 40] * o[c + 66], N(F, o[c + 55] * o[c + 40], c + 61), ii(n, F), l -= o[c + 59] * o[c + 40] * o[c + 67], N(X, o[c + 56] * o[c + 40], c + 63), ii(s, X), p -= o[c + 60] * o[c + 40] * o[c + 68]) : 10 == e && (o[c + 40] = 0);
  H = b[f + 7] + 3 * b[c + 41];
  b[H] = b[g];
  o[H] = o[g];
  b[H + 1] = b[g + 1];
  o[H + 1] = o[g + 1];
  o[b[f + 7] + 3 * b[c + 41] + 2] = i;
  g = b[f + 7] + 3 * b[c + 42];
  b[g] = b[k];
  o[g] = o[k];
  b[g + 1] = b[k + 1];
  o[g + 1] = o[k + 1];
  o[b[f + 7] + 3 * b[c + 42] + 2] = h;
  k = b[f + 7] + 3 * b[c + 43];
  b[k] = b[n];
  o[k] = o[n];
  b[k + 1] = b[n + 1];
  o[k + 1] = o[n + 1];
  o[b[f + 7] + 3 * b[c + 43] + 2] = l;
  n = b[f + 7] + 3 * b[c + 44];
  b[n] = b[s];
  o[n] = o[s];
  b[n + 1] = b[s + 1];
  o[n + 1] = o[s + 1];
  o[b[f + 7] + 3 * b[c + 44] + 2] = p;
  a = d;
}

zk.X = 1;

function Ak(c, f) {
  var d = a;
  a += 20;
  var e, g = d + 2, i, h = d + 4, j, k = d + 6, l, m, n = d + 8;
  m = d + 10;
  var p = d + 12, u = d + 14, s = d + 16, q = d + 18;
  e = b[f + 7] + 3 * b[c + 41];
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  e = o[b[f + 7] + 3 * b[c + 41] + 2];
  i = b[f + 7] + 3 * b[c + 42];
  b[g] = b[i];
  o[g] = o[i];
  b[g + 1] = b[i + 1];
  o[g + 1] = o[i + 1];
  i = o[b[f + 7] + 3 * b[c + 42] + 2];
  j = b[f + 7] + 3 * b[c + 43];
  b[h] = b[j];
  o[h] = o[j];
  b[h + 1] = b[j + 1];
  o[h + 1] = o[j + 1];
  j = o[b[f + 7] + 3 * b[c + 43] + 2];
  l = b[f + 7] + 3 * b[c + 44];
  b[k] = b[l];
  o[k] = o[l];
  b[k + 1] = b[l + 1];
  o[k + 1] = o[l + 1];
  l = o[b[f + 7] + 3 * b[c + 44] + 2];
  var v = c + 61;
  K(n, d, h);
  n = O(v, n);
  v = c + 63;
  K(m, g, k);
  m = n + O(v, m);
  m += o[c + 65] * e - o[c + 67] * j + (o[c + 66] * i - o[c + 68] * l);
  m *= -o[c + 69];
  o[c + 40] += m;
  N(p, o[c + 53] * m, c + 61);
  Wc(d, p);
  e += o[c + 57] * m * o[c + 65];
  N(u, o[c + 54] * m, c + 63);
  Wc(g, u);
  i += o[c + 58] * m * o[c + 66];
  N(s, o[c + 55] * m, c + 61);
  ii(h, s);
  j -= o[c + 59] * m * o[c + 67];
  N(q, o[c + 56] * m, c + 63);
  ii(k, q);
  l -= o[c + 60] * m * o[c + 68];
  p = b[f + 7] + 3 * b[c + 41];
  b[p] = b[d];
  o[p] = o[d];
  b[p + 1] = b[d + 1];
  o[p + 1] = o[d + 1];
  o[b[f + 7] + 3 * b[c + 41] + 2] = e;
  e = b[f + 7] + 3 * b[c + 42];
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  o[b[f + 7] + 3 * b[c + 42] + 2] = i;
  g = b[f + 7] + 3 * b[c + 43];
  b[g] = b[h];
  o[g] = o[h];
  b[g + 1] = b[h + 1];
  o[g + 1] = o[h + 1];
  o[b[f + 7] + 3 * b[c + 43] + 2] = j;
  h = b[f + 7] + 3 * b[c + 44];
  b[h] = b[k];
  o[h] = o[k];
  b[h + 1] = b[k + 1];
  o[h + 1] = o[k + 1];
  o[b[f + 7] + 3 * b[c + 44] + 2] = l;
  a = d;
}

Ak.X = 1;

function Bk(c) {
  var f, d, e, g;
  f = b[b[c + 12] + 2];
  d = b[b[c + 13] + 2];
  e = b[b[c + 18] + 14];
  g = b[b[c + 19] + 14];
  U(Ck, A(1, "i32", r));
  U(gj, A([ f ], "i32", r));
  U(hj, A([ d ], "i32", r));
  U(ij, A([ b[c + 16] & 1 ], "i32", r));
  U(Dk, A([ e ], "i32", r));
  U(Ek, A([ g ], "i32", r));
  U(Fk, A([ o[c + 39] ], "double", r));
  U(oj, A([ b[c + 14] ], "i32", r));
}

Bk.X = 1;

function Gk(c) {
  bi(b[c], b[c + 5]);
  bi(b[c], b[c + 6]);
  bi(b[c], b[c + 4]);
  bi(b[c], b[c + 3]);
  bi(b[c], b[c + 2]);
}

function Hk(c, f) {
  var d = a;
  a += 70;
  var e, g, i = d + 2, h, j = d + 4, k, l = d + 6, m, n = d + 8, p = d + 10, u = d + 12, s = d + 14, q, v, x = d + 16, w = d + 18, y, z, B, E, D, H = d + 20, I = d + 22, M = d + 24, G = d + 26, T = d + 28, R = d + 30, L = d + 32, S = d + 34, F = d + 36, X = d + 38, Z = d + 40, V = d + 42, aa = d + 44, ja = d + 46, Y = d + 48, W = d + 50, $ = d + 52, ga = d + 54, la = d + 56, fa = d + 58, ka = d + 60, oa = d + 62, ua = d + 64, Da = d + 66, Ja = d + 68;
  g = b[f + 6] + 3 * b[c + 41];
  b[d] = b[g];
  o[d] = o[g];
  b[d + 1] = b[g + 1];
  o[d + 1] = o[g + 1];
  g = o[b[f + 6] + 3 * b[c + 41] + 2];
  h = b[f + 6] + 3 * b[c + 42];
  b[i] = b[h];
  o[i] = o[h];
  b[i + 1] = b[h + 1];
  o[i + 1] = o[h + 1];
  h = o[b[f + 6] + 3 * b[c + 42] + 2];
  k = b[f + 6] + 3 * b[c + 43];
  b[j] = b[k];
  o[j] = o[k];
  b[j + 1] = b[k + 1];
  o[j + 1] = o[k + 1];
  k = o[b[f + 6] + 3 * b[c + 43] + 2];
  m = b[f + 6] + 3 * b[c + 44];
  b[l] = b[m];
  o[l] = o[m];
  b[l + 1] = b[m + 1];
  o[l + 1] = o[m + 1];
  m = o[b[f + 6] + 3 * b[c + 44] + 2];
  qj(n, g);
  qj(p, h);
  qj(u, k);
  qj(s, m);
  D = 0;
  e = 1 == b[c + 20] ? 1 : 2;
  1 == e ? (dc(x), B = y = 1, D += o[c + 57] + o[c + 59], q = g - k - o[c + 36]) : 2 == e && (J(H, u, c + 32), K(M, c + 28, c + 49), J(I, u, M), K(T, c + 24, c + 45), J(G, n, T), b[x] = b[H], o[x] = o[H], b[x + 1] = b[H + 1], o[x + 1] = o[H + 1], B = Q(I, H), y = Q(G, H), D += o[c + 55] + o[c + 53] + o[c + 59] * B * B + o[c + 57] * y * y, K(R, c + 28, c + 49), K(F, d, j), P(S, G, F), Og(L, u, S), K(X, L, R), q = O(X, c + 32));
  e = 1 == b[c + 21] ? 4 : 5;
  4 == e ? (dc(w), z = o[c + 39], E = o[c + 39], D += o[c + 39] * o[c + 39] * (o[c + 58] + o[c + 60]), v = h - m - o[c + 37]) : 5 == e && (J(Z, s, c + 34), K(aa, c + 30, c + 51), J(V, s, aa), K(Y, c + 26, c + 47), J(ja, p, Y), N(W, o[c + 39], Z), b[w] = b[W], o[w] = o[W], b[w + 1] = b[W + 1], o[w + 1] = o[W + 1], E = o[c + 39] * Q(V, Z), z = o[c + 39] * Q(ja, Z), D += o[c + 39] * o[c + 39] * (o[c + 56] + o[c + 54]) + o[c + 60] * E * E + o[c + 58] * z * z, K($, c + 30, c + 51), K(fa, i, l), P(la, ja, fa), Og(ga, s, la), K(ka, ga, $), v = O(ka, c + 34));
  n = q + o[c + 39] * v - o[c + 38];
  p = 0;
  7 == (0 < D ? 7 : 8) && (p = -n / D);
  N(oa, o[c + 53] * p, x);
  Wc(d, oa);
  g += o[c + 57] * p * y;
  N(ua, o[c + 54] * p, w);
  Wc(i, ua);
  h += o[c + 58] * p * z;
  N(Da, o[c + 55] * p, x);
  ii(j, Da);
  k -= o[c + 59] * p * B;
  N(Ja, o[c + 56] * p, w);
  ii(l, Ja);
  m -= o[c + 60] * p * E;
  x = b[f + 6] + 3 * b[c + 41];
  b[x] = b[d];
  o[x] = o[d];
  b[x + 1] = b[d + 1];
  o[x + 1] = o[d + 1];
  o[b[f + 6] + 3 * b[c + 41] + 2] = g;
  g = b[f + 6] + 3 * b[c + 42];
  b[g] = b[i];
  o[g] = o[i];
  b[g + 1] = b[i + 1];
  o[g + 1] = o[i + 1];
  o[b[f + 6] + 3 * b[c + 42] + 2] = h;
  i = b[f + 6] + 3 * b[c + 43];
  b[i] = b[j];
  o[i] = o[j];
  b[i + 1] = b[j + 1];
  o[i + 1] = o[j + 1];
  o[b[f + 6] + 3 * b[c + 43] + 2] = k;
  j = b[f + 6] + 3 * b[c + 44];
  b[j] = b[l];
  o[j] = o[l];
  b[j + 1] = b[l + 1];
  o[j + 1] = o[l + 1];
  o[b[f + 6] + 3 * b[c + 44] + 2] = m;
  a = d;
  return ca;
}

Hk.X = 1;

function Ik(c, f, d, e, g, i) {
  b[c + 10] = f;
  b[c + 11] = d;
  b[c + 12] = e;
  b[c + 7] = 0;
  b[c + 9] = 0;
  b[c + 8] = 0;
  b[c] = g;
  b[c + 1] = i;
  f = di(b[c], f << 2);
  b[c + 2] = f;
  d = di(b[c], d << 2);
  b[c + 3] = d;
  e = di(b[c], e << 2);
  b[c + 4] = e;
  e = di(b[c], 12 * b[c + 10]);
  b[c + 6] = e;
  e = di(b[c], 12 * b[c + 10]);
  b[c + 5] = e;
}

Ik.X = 1;

function Jk(c) {
  var f = a;
  a += 4;
  var d = f + 2;
  Mc(c + 5, o[c + 14]);
  var e = c + 3, g = c + 11;
  J(d, c + 5, c + 7);
  K(f, g, d);
  b[e] = b[f];
  o[e] = o[f];
  b[e + 1] = b[f + 1];
  o[e + 1] = o[f + 1];
  a = f;
}

function Kk(c, f) {
  var d = a;
  a += 5;
  var e, g, i, h, j;
  e = 0 == b[c + 1] ? 6 : 1;
  a : do if (1 == e) {
    g = 0;
    var k = c + 9;
    if (g < b[k]) for (var l = c + 3, m = d + 4, n = c + 1, p = d, u = d + 2; ; ) {
      i = b[b[l] + g];
      h = f + 38 * g;
      b[m] = b[h + 36];
      j = 0;
      e = j < b[h + 36] ? 4 : 5;
      b : do if (4 == e) for (;;) if (o[p + j] = o[h + 9 * j + 4], o[u + j] = o[h + 9 * j + 5], j += 1, j >= b[h + 36]) {
        e = 5;
        break b;
      } while (0);
      h = b[n];
      mb[b[b[h] + 5]](h, i, d);
      g += 1;
      if (g >= b[k]) break a;
    } else e = 6;
  } while (0);
  a = d;
}

Kk.X = 1;

function Lk(c, f, d, e, g) {
  var i = a;
  a += 54;
  var h, j, k, l, m = i + 2, n, p = i + 4, u, s = i + 6, q = i + 8, v = i + 10, x = i + 12, w = i + 14, y = i + 22, z = i + 33, B, E, D, H, I = i + 46, M, G = i + 48, T, R = i + 50, L, S, F, X = i + 52, Z, V, aa, ja, Y, W, $, ga, la, fa, ka, oa, ua;
  Mk(i);
  j = o[d];
  k = 0;
  var Da = c + 7;
  h = k < b[Da] ? 1 : 5;
  a : do if (1 == h) for (var Ja = c + 2, Aa = m, Ua = p, pb = c + 5, Fa = m, Wa = c + 5, Na = c + 6, pa = p, ha = c + 6; ; ) {
    l = b[b[Ja] + k];
    var Ba = l + 11;
    b[Aa] = b[Ba];
    o[Aa] = o[Ba];
    b[Aa + 1] = b[Ba + 1];
    o[Aa + 1] = o[Ba + 1];
    n = o[l + 14];
    var za = l + 16;
    b[Ua] = b[za];
    o[Ua] = o[za];
    b[Ua + 1] = b[za + 1];
    o[Ua + 1] = o[za + 1];
    u = o[l + 18];
    var va = l + 9, Ka = l + 11;
    b[va] = b[Ka];
    o[va] = o[Ka];
    b[va + 1] = b[Ka + 1];
    o[va + 1] = o[Ka + 1];
    o[l + 13] = o[l + 14];
    h = 2 == b[l] ? 3 : 4;
    if (3 == h) {
      var ma = j;
      N(v, o[l + 35], e);
      N(x, o[l + 30], l + 19);
      P(q, v, x);
      N(s, ma, q);
      Wc(p, s);
      u += j * o[l + 32] * o[l + 21];
      Yc(p, ri(1 - j * o[l + 33], 0, 1));
      u *= ri(1 - j * o[l + 34], 0, 1);
    }
    var La = b[pb] + 3 * k;
    b[La] = b[Fa];
    o[La] = o[Fa];
    b[La + 1] = b[Fa + 1];
    o[La + 1] = o[Fa + 1];
    o[b[Wa] + 3 * k + 2] = n;
    var Ga = b[Na] + 3 * k;
    b[Ga] = b[pa];
    o[Ga] = o[pa];
    b[Ga + 1] = b[pa + 1];
    o[Ga + 1] = o[pa + 1];
    o[b[ha] + 3 * k + 2] = u;
    k += 1;
    if (k >= b[Da]) {
      h = 5;
      break a;
    }
  } while (0);
  Mk(i);
  for (var ya = d, Oa = d + 6, Ea = w; ya < Oa; ya++, Ea++) b[Ea] = b[ya], o[Ea] = o[ya];
  b[w + 6] = b[c + 5];
  b[w + 7] = b[c + 6];
  ya = d;
  Oa = d + 6;
  for (Ea = y; ya < Oa; ya++, Ea++) b[Ea] = b[ya], o[Ea] = o[ya];
  b[y + 6] = b[c + 3];
  b[y + 7] = b[c + 9];
  b[y + 8] = b[c + 5];
  b[y + 9] = b[c + 6];
  b[y + 10] = b[c];
  ci(z, y);
  ji(z);
  h = b[d + 5] & 1 ? 7 : 17;
  7 == h && mi(z);
  B = 0;
  for (var Ib = c + 8, Ob = c + 4; ; ) {
    if (B >= b[Ib]) {
      h = 21;
      break;
    }
    var Pa = b[b[Ob] + B];
    mb[b[b[Pa] + 7]](Pa, w);
    B += 1;
  }
  var fc = Nk(i);
  o[f + 3] = fc;
  Mk(i);
  E = 0;
  for (var Pb = c + 8, Xa = c + 4; ; ) {
    if (E >= b[d + 3]) {
      h = 31;
      break;
    }
    for (D = 0; ; ) {
      if (D >= b[Pb]) {
        h = 29;
        break;
      }
      var gc = b[b[Xa] + D];
      mb[b[b[gc] + 8]](gc, w);
      D += 1;
    }
    oi(z);
    E += 1;
  }
  ti(z);
  var xb = Nk(i);
  o[f + 4] = xb;
  H = 0;
  var Ya = c + 7;
  h = H < b[Ya] ? 33 : 39;
  a : do if (33 == h) for (var Qb = c + 5, Jb = I, Ab = c + 5, Bb = c + 6, eb = G, Wb = c + 6, Xb = c + 5, fb = I, yb = c + 5, gb = c + 6, Ia = G, Yb = c + 6; ; ) {
    var hb = b[Qb] + 3 * H;
    b[Jb] = b[hb];
    o[Jb] = o[hb];
    b[Jb + 1] = b[hb + 1];
    o[Jb + 1] = o[hb + 1];
    M = o[b[Ab] + 3 * H + 2];
    var Cb = b[Bb] + 3 * H;
    b[eb] = b[Cb];
    o[eb] = o[Cb];
    b[eb + 1] = b[Cb + 1];
    o[eb + 1] = o[Cb + 1];
    T = o[b[Wb] + 3 * H + 2];
    N(R, j, G);
    h = 4 < O(R, R) ? 35 : 36;
    35 == h && (L = 2 / Dg(R), Yc(G, L));
    S = j * T;
    h = 2.4674012660980225 < S * S ? 37 : 38;
    37 == h && (F = 1.5707963705062866 / ch(S), T *= F);
    N(X, j, G);
    Wc(I, X);
    M += j * T;
    var ib = b[Xb] + 3 * H;
    b[ib] = b[fb];
    o[ib] = o[fb];
    b[ib + 1] = b[fb + 1];
    o[ib + 1] = o[fb + 1];
    o[b[yb] + 3 * H + 2] = M;
    var Db = b[gb] + 3 * H;
    b[Db] = b[Ia];
    o[Db] = o[Ia];
    b[Db + 1] = b[Ia + 1];
    o[Db + 1] = o[Ia + 1];
    o[b[Yb] + 3 * H + 2] = T;
    H += 1;
    if (H >= b[Ya]) {
      h = 39;
      break a;
    }
  } while (0);
  Mk(i);
  V = Z = 0;
  var hc = c + 8, ic = c + 4;
  a : for (;;) {
    if (V >= b[d + 4]) {
      h = 53;
      break;
    }
    aa = ui(z);
    ja = 1;
    for (Y = 0; ; ) {
      if (Y >= b[hc]) {
        h = 49;
        break;
      }
      var qb = b[b[ic] + Y];
      W = mb[b[b[qb] + 9]](qb, w);
      if (ja & 1) h = 47; else {
        var Rb = 0;
        h = 48;
      }
      47 == h && (Rb = W & 1);
      ja = Rb;
      Y += 1;
    }
    h = aa & 1 ? 50 : 52;
    if (50 == h && ja & 1) {
      h = 51;
      break a;
    }
    V += 1;
  }
  51 == h && (Z = 1);
  $ = 0;
  for (var Zb = c + 7, rb = c + 2, $b = c + 5, Eb = c + 5, jc = c + 6, sb = c + 6; ; ) {
    if ($ >= b[Zb]) {
      h = 57;
      break;
    }
    ga = b[b[rb] + $];
    var Kb = ga + 11, tb = b[$b] + 3 * $;
    b[Kb] = b[tb];
    o[Kb] = o[tb];
    b[Kb + 1] = b[tb + 1];
    o[Kb + 1] = o[tb + 1];
    o[ga + 14] = o[b[Eb] + 3 * $ + 2];
    var jb = ga + 16, ac = b[jc] + 3 * $;
    b[jb] = b[ac];
    o[jb] = o[ac];
    b[jb + 1] = b[ac + 1];
    o[jb + 1] = o[ac + 1];
    o[ga + 18] = o[b[sb] + 3 * $ + 2];
    Jk(ga);
    $ += 1;
  }
  var kc = Nk(i);
  o[f + 5] = kc;
  Kk(c, b[z + 10]);
  h = g & 1 ? 60 : 75;
  a : do if (60 == h) {
    la = 3.4028234663852886e+38;
    fa = 0;
    var Sb = c + 7;
    h = fa < b[Sb] ? 61 : 69;
    b : do if (61 == h) for (var Bc = c + 2; ; ) {
      ka = b[b[Bc] + fa];
      h = 0 == b[ka] ? 68 : 63;
      c : do if (63 == h) {
        h = 0 == (b[ka + 1] & 4) ? 66 : 64;
        do if (64 == h) if (.001218469929881394 < o[ka + 18] * o[ka + 18]) h = 66; else if (9999999747378752e-20 < O(ka + 16, ka + 16)) h = 66; else {
          o[ka + 36] += j;
          la = la < o[ka + 36] ? la : o[ka + 36];
          h = 68;
          break c;
        } while (0);
        la = o[ka + 36] = 0;
      } while (0);
      fa += 1;
      if (fa >= b[Sb]) {
        h = 69;
        break b;
      }
    } while (0);
    if (.5 <= la) if (Z & 1) {
      oa = 0;
      for (var lc = c + 7, kb = c + 2; ; ) {
        if (oa >= b[lc]) {
          h = 75;
          break a;
        }
        ua = b[b[kb] + oa];
        Vc(ua, 0);
        oa += 1;
      }
    } else h = 75; else h = 75;
  } while (0);
  ai(z);
  a = i;
}

Lk.X = 1;

function Yi(c, f) {
  b[c] = Ok + 2;
  1 == (b[f + 2] != b[f + 3] ? 2 : 1) && C(Pk, 173, Qk, Rk);
  b[c + 1] = b[f];
  b[c + 2] = 0;
  b[c + 3] = 0;
  b[c + 12] = b[f + 2];
  b[c + 13] = b[f + 3];
  b[c + 14] = 0;
  b[c + 16] = b[f + 4] & 1;
  b[c + 15] = 0;
  b[c + 17] = b[f + 1];
  b[c + 5] = 0;
  b[c + 4] = 0;
  b[c + 6] = 0;
  b[c + 7] = 0;
  b[c + 9] = 0;
  b[c + 8] = 0;
  b[c + 10] = 0;
  b[c + 11] = 0;
}

Yi.X = 1;

function Sk(c, f, d, e) {
  var g = a;
  a += 32;
  var i, h, j, k = g + 11, l = g + 24, m, n = g + 26, p, u = g + 28, s, q = g + 30;
  i = d < b[c + 7] ? 2 : 1;
  1 == i && C(Tk, 386, Uk, al);
  i = e < b[c + 7] ? 4 : 3;
  3 == i && C(Tk, 387, Uk, bl);
  h = 0;
  var v = c + 7;
  i = h < b[v] ? 5 : 7;
  a : do if (5 == i) for (var x = c + 2, w = c + 5, y = c + 5, z = c + 6, B = c + 6; ; ) {
    j = b[b[x] + h];
    var E = b[w] + 3 * h;
    m = j + 11;
    b[E] = b[m];
    o[E] = o[m];
    b[E + 1] = b[m + 1];
    o[E + 1] = o[m + 1];
    o[b[y] + 3 * h + 2] = o[j + 14];
    E = b[z] + 3 * h;
    m = j + 16;
    b[E] = b[m];
    o[E] = o[m];
    b[E + 1] = b[m + 1];
    o[E + 1] = o[m + 1];
    o[b[B] + 3 * h + 2] = o[j + 18];
    h += 1;
    if (h >= b[v]) break a;
  } while (0);
  b[g + 6] = b[c + 3];
  b[g + 7] = b[c + 9];
  b[g + 10] = b[c];
  i = f;
  h = f + 6;
  for (j = g; i < h; i++, j++) b[j] = b[i], o[j] = o[i];
  b[g + 8] = b[c + 5];
  b[g + 9] = b[c + 6];
  ci(k, g);
  for (i = 0; i < b[f + 4]; ) {
    h = yi(k, d, e);
    if (h & 1) break;
    i += 1;
  }
  i = b[b[c + 2] + d] + 7 + 2;
  h = b[c + 5] + 3 * d;
  b[i] = b[h];
  o[i] = o[h];
  b[i + 1] = b[h + 1];
  o[i + 1] = o[h + 1];
  o[b[b[c + 2] + d] + 7 + 6] = o[b[c + 5] + 3 * d + 2];
  i = b[b[c + 2] + e] + 7 + 2;
  d = b[c + 5] + 3 * e;
  b[i] = b[d];
  o[i] = o[d];
  b[i + 1] = b[d + 1];
  o[i + 1] = o[d + 1];
  o[b[b[c + 2] + e] + 7 + 6] = o[b[c + 5] + 3 * e + 2];
  ji(k);
  for (i = 0; i < b[f + 3]; ) {
    oi(k);
    i += 1;
  }
  f = o[f];
  e = 0;
  d = c + 7;
  h = c + 5;
  j = c + 5;
  v = c + 6;
  x = c + 6;
  w = c + 5;
  y = c + 5;
  z = c + 6;
  B = c + 6;
  for (E = c + 2; e < b[d]; ) {
    i = b[h] + 3 * e;
    b[l] = b[i];
    o[l] = o[i];
    b[l + 1] = b[i + 1];
    o[l + 1] = o[i + 1];
    m = o[b[j] + 3 * e + 2];
    i = b[v] + 3 * e;
    b[n] = b[i];
    o[n] = o[i];
    b[n + 1] = b[i + 1];
    o[n + 1] = o[i + 1];
    p = o[b[x] + 3 * e + 2];
    N(u, f, n);
    i = 4 < O(u, u) ? 25 : 26;
    25 == i && (i = 2 / Dg(u), Yc(n, i));
    s = f * p;
    i = 2.4674012660980225 < s * s ? 27 : 28;
    27 == i && (i = 1.5707963705062866 / ch(s), p *= i);
    N(q, f, n);
    Wc(l, q);
    m += f * p;
    i = b[w] + 3 * e;
    b[i] = b[l];
    o[i] = o[l];
    b[i + 1] = b[l + 1];
    o[i + 1] = o[l + 1];
    o[b[y] + 3 * e + 2] = m;
    i = b[z] + 3 * e;
    b[i] = b[n];
    o[i] = o[n];
    b[i + 1] = b[n + 1];
    o[i + 1] = o[n + 1];
    o[b[B] + 3 * e + 2] = p;
    i = b[b[E] + e];
    s = i + 11;
    b[s] = b[l];
    o[s] = o[l];
    b[s + 1] = b[l + 1];
    o[s + 1] = o[l + 1];
    o[i + 14] = m;
    m = i + 16;
    b[m] = b[n];
    o[m] = o[n];
    b[m + 1] = b[n + 1];
    o[m + 1] = o[n + 1];
    o[i + 18] = p;
    Jk(i);
    e += 1;
  }
  Kk(c, b[k + 10]);
  ai(k);
  a = g;
}

Sk.X = 1;

function ll(c, f) {
  return o[c] * o[f] + o[c + 1] * o[f + 1] + o[c + 2] * o[f + 2];
}

function ml(c, f, d) {
  nl(c, o[f + 1] * o[d + 2] - o[f + 2] * o[d + 1], o[f + 2] * o[d] - o[f] * o[d + 2], o[f] * o[d + 1] - o[f + 1] * o[d]);
}

ml.X = 1;

function ol(c, f, d) {
  var e, g, i, h;
  e = o[f];
  g = o[f + 3];
  i = o[f + 1];
  f = o[f + 4];
  h = e * f - g * i;
  if (1 == (0 != h ? 1 : 2)) h = 1 / h;
  o[c] = h * (f * o[d] - g * o[d + 1]);
  o[c + 1] = h * (e * o[d + 1] - i * o[d]);
}

ol.X = 1;

function pl(c, f) {
  var d, e, g, i, h;
  d = o[c];
  e = o[c + 3];
  g = o[c + 1];
  i = o[c + 4];
  h = d * i - e * g;
  if (1 == (0 != h ? 1 : 2)) h = 1 / h;
  o[f] = h * i;
  o[f + 3] = -h * e;
  o[f + 2] = 0;
  o[f + 1] = -h * g;
  o[f + 4] = h * d;
  o[f + 5] = 0;
  o[f + 6] = 0;
  o[f + 7] = 0;
  o[f + 8] = 0;
}

pl.X = 1;

function nl(c, f, d, e) {
  o[c] = f;
  o[c + 1] = d;
  o[c + 2] = e;
}

function ql(c, f, d) {
  var e = a;
  a += 12;
  var g, i = e + 3, h = e + 6, j = e + 9;
  ml(e, f + 3, f + 6);
  g = ll(f, e);
  if (1 == (0 != g ? 1 : 2)) g = 1 / g;
  var k = g;
  ml(i, f + 3, f + 6);
  o[c] = k * ll(d, i);
  i = g;
  ml(h, d, f + 6);
  o[c + 1] = i * ll(f, h);
  ml(j, f + 3, d);
  o[c + 2] = g * ll(f, j);
  a = e;
}

ql.X = 1;

function rl(c, f) {
  var d = a;
  a += 3;
  var e, g, i, h, j, k, l;
  ml(d, c + 3, c + 6);
  e = ll(c, d);
  if (1 == (0 != e ? 1 : 2)) e = 1 / e;
  g = o[c];
  i = o[c + 3];
  h = o[c + 6];
  j = o[c + 4];
  k = o[c + 7];
  l = o[c + 8];
  o[f] = e * (j * l - k * k);
  o[f + 1] = e * (h * k - i * l);
  o[f + 2] = e * (i * k - h * j);
  o[f + 3] = o[f + 1];
  o[f + 4] = e * (g * l - h * h);
  o[f + 5] = e * (h * i - g * k);
  o[f + 6] = o[f + 2];
  o[f + 7] = o[f + 5];
  o[f + 8] = e * (g * j - i * i);
  a = d;
}

rl.X = 1;

function sl(c, f) {
  var d = a;
  a += 2;
  var e;
  Yi(c, f);
  b[c] = tl + 2;
  e = wc(f + 5) ? 2 : 1;
  1 == e && C(ul, 34, vl, wl);
  e = Lb(o[f + 7]) ? 3 : 4;
  3 == e && (e = 0 <= o[f + 7] ? 5 : 4);
  4 == e && C(ul, 35, vl, xl);
  e = Lb(o[f + 8]) ? 6 : 7;
  6 == e && (e = 0 <= o[f + 8] ? 8 : 7);
  7 == e && C(ul, 36, vl, yl);
  e = Lb(o[f + 9]) ? 9 : 10;
  9 == e && (e = 0 <= o[f + 9] ? 11 : 10);
  10 == e && C(ul, 37, vl, zl);
  e = c + 20;
  var g = f + 5;
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  e = c + 18;
  Fg(d, b[c + 13] + 3, c + 20);
  b[e] = b[d];
  o[e] = o[d];
  b[e + 1] = b[d + 1];
  o[e + 1] = o[d + 1];
  o[c + 27] = o[f + 7];
  dc(c + 25);
  o[c + 22] = o[f + 8];
  o[c + 23] = o[f + 9];
  o[c + 24] = 0;
  o[c + 28] = 0;
  a = d;
}

sl.X = 1;

function Al(c, f) {
  var d = a;
  a += 24;
  var e, g = d + 2, i, h = d + 4, j, k, l = d + 6, m = d + 8, n = d + 10, p = d + 14, u = d + 18, s = d + 20, q = d + 22;
  b[c + 30] = b[b[c + 13] + 2];
  i = c + 33;
  e = b[c + 13] + 7;
  b[i] = b[e];
  o[i] = o[e];
  b[i + 1] = b[e + 1];
  o[i + 1] = o[e + 1];
  o[c + 35] = o[b[c + 13] + 30];
  o[c + 36] = o[b[c + 13] + 32];
  i = b[f + 6] + 3 * b[c + 30];
  b[d] = b[i];
  o[d] = o[i];
  b[d + 1] = b[i + 1];
  o[d + 1] = o[i + 1];
  e = o[b[f + 6] + 3 * b[c + 30] + 2];
  i = b[f + 7] + 3 * b[c + 30];
  b[g] = b[i];
  o[g] = o[i];
  b[g + 1] = b[i + 1];
  o[g + 1] = o[i + 1];
  i = o[b[f + 7] + 3 * b[c + 30] + 2];
  qj(h, e);
  j = o[b[c + 13] + 29];
  k = 6.2831854820251465 * o[c + 22];
  e = 2 * j * o[c + 23] * k;
  j = j * k * k;
  k = o[f];
  1 == (1.1920928955078125e-7 < e + k * j ? 2 : 1) && C(ul, 125, Bl, Cl);
  o[c + 28] = k * (e + k * j);
  e = 0 != o[c + 28] ? 3 : 4;
  3 == e && (o[c + 28] = 1 / o[c + 28]);
  o[c + 24] = k * j * o[c + 28];
  e = c + 31;
  K(m, c + 18, c + 33);
  J(l, h, m);
  b[e] = b[l];
  o[e] = o[l];
  b[e + 1] = b[l + 1];
  o[e + 1] = o[l + 1];
  o[n] = o[c + 35] + o[c + 36] * o[c + 32] * o[c + 32] + o[c + 28];
  o[n + 1] = -o[c + 36] * o[c + 31] * o[c + 32];
  o[n + 2] = o[n + 1];
  o[n + 3] = o[c + 35] + o[c + 36] * o[c + 31] * o[c + 31] + o[c + 28];
  h = c + 37;
  hi(p, n);
  b[h] = b[p];
  o[h] = o[p];
  b[h + 1] = b[p + 1];
  o[h + 1] = o[p + 1];
  b[h + 2] = b[p + 2];
  o[h + 2] = o[p + 2];
  b[h + 3] = b[p + 3];
  o[h + 3] = o[p + 3];
  n = c + 41;
  P(s, d, c + 31);
  K(u, s, c + 20);
  b[n] = b[u];
  o[n] = o[u];
  b[n + 1] = b[u + 1];
  o[n + 1] = o[u + 1];
  Yc(c + 41, o[c + 24]);
  i *= .9800000190734863;
  u = c + 25;
  e = b[f + 5] & 1 ? 5 : 6;
  5 == e ? (Yc(u, o[f + 2]), N(q, o[c + 35], c + 25), Wc(g, q), i += o[c + 36] * Q(c + 31, c + 25)) : 6 == e && dc(u);
  q = b[f + 7] + 3 * b[c + 30];
  b[q] = b[g];
  o[q] = o[g];
  b[q + 1] = b[g + 1];
  o[q + 1] = o[g + 1];
  o[b[f + 7] + 3 * b[c + 30] + 2] = i;
  a = d;
}

Al.X = 1;

function Dl(c, f) {
  var d = a;
  a += 22;
  var e, g = d + 2, i = d + 4, h = d + 6, j = d + 8, k = d + 10, l = d + 12, m = d + 14, n = d + 16, p = d + 18, u = d + 20;
  e = b[f + 7] + 3 * b[c + 30];
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  e = o[b[f + 7] + 3 * b[c + 30] + 2];
  $c(i, e, c + 31);
  P(g, d, i);
  i = c + 37;
  P(k, g, c + 41);
  N(l, o[c + 28], c + 25);
  P(m, k, l);
  Pg(j, m);
  ni(h, i, j);
  g = c + 25;
  b[n] = b[g];
  o[n] = o[g];
  b[n + 1] = b[g + 1];
  o[n + 1] = o[g + 1];
  Wc(c + 25, h);
  g = o[f] * o[c + 27];
  if (1 == (Ki(c + 25) > g * g ? 1 : 2)) j = c + 25, k = Dg(c + 25), Yc(j, g / k);
  K(p, c + 25, n);
  b[h] = b[p];
  o[h] = o[p];
  b[h + 1] = b[p + 1];
  o[h + 1] = o[p + 1];
  N(u, o[c + 35], h);
  Wc(d, u);
  e += o[c + 36] * Q(c + 31, h);
  h = b[f + 7] + 3 * b[c + 30];
  b[h] = b[d];
  o[h] = o[d];
  b[h + 1] = b[d + 1];
  o[h + 1] = o[d + 1];
  o[b[f + 7] + 3 * b[c + 30] + 2] = e;
  a = d;
}

Dl.X = 1;

function El(c, f, d) {
  re(c, f, 0, d, 0);
  b[c] = Fl + 2;
  f = 2 == te(b[c + 12]) ? 2 : 1;
  1 == f && C(Gl, 41, Hl, Il);
  f = 0 == te(b[c + 13]) ? 4 : 3;
  3 == f && C(Gl, 42, Hl, xe);
}

function Jl(c, f, d) {
  re(c, f, 0, d, 0);
  b[c] = Kl + 2;
  f = 2 == te(b[c + 12]) ? 2 : 1;
  1 == f && C(Ll, 44, Ml, Il);
  f = 2 == te(b[c + 13]) ? 4 : 3;
  3 == f && C(Ll, 45, Ml, Ce);
}

function Nl(c, f, d) {
  var e = a;
  a += 16;
  var g, i = e + 2, h, j = e + 4, k = e + 6, l = e + 8, m = e + 10, n = e + 12, p = e + 14;
  Zc(e, d, c + 5);
  b[i] = b[e];
  o[i] = o[e];
  b[i + 1] = b[e + 1];
  o[i + 1] = o[e + 1];
  h = 1;
  var u = c + 37;
  g = h < b[u] ? 1 : 3;
  a : do if (1 == g) for (var s = c + 5, q = e, v = k, x = i, w = l; ; ) if (Zc(j, d, s + (h << 1)), Oe(k, e, j), b[q] = b[v], o[q] = o[v], b[q + 1] = b[v + 1], o[q + 1] = o[v + 1], Pe(l, i, j), b[x] = b[w], o[x] = o[w], b[x + 1] = b[w + 1], o[x + 1] = o[w + 1], h += 1, h >= b[u]) break a; while (0);
  Xc(m, o[c + 2], o[c + 2]);
  K(n, e, m);
  b[f] = b[n];
  o[f] = o[n];
  b[f + 1] = b[n + 1];
  o[f + 1] = o[n + 1];
  c = f + 2;
  P(p, i, m);
  b[c] = b[p];
  o[c] = o[p];
  b[c + 1] = b[p + 1];
  o[c + 1] = o[p + 1];
  a = e;
}

Nl.X = 1;

function Ol(c, f, d, e) {
  var g = a;
  a += 14;
  var i, h, j = g + 2, k = g + 4, l = g + 6, m = g + 8, n, p, u = g + 10, s, q = g + 12;
  n = e + 2;
  K(j, d, e);
  Og(g, n, j);
  j = e + 2;
  K(l, d + 2, e);
  Og(k, j, l);
  K(m, k, g);
  k = 0;
  l = o[d + 4];
  j = -1;
  n = 0;
  var v = c + 37, x = c + 21, w = c + 5, y = c + 21;
  a : for (;;) {
    if (n >= b[v]) {
      i = 14;
      break;
    }
    i = x + (n << 1);
    K(u, w + (n << 1), g);
    p = O(i, u);
    s = O(y + (n << 1), m);
    i = 0 == s ? 3 : 5;
    b : do if (3 == i) {
      if (0 > p) {
        i = 4;
        break a;
      }
    } else if (5 == i) {
      if (0 > s) i = 6; else {
        var z = s;
        i = 8;
      }
      do if (6 == i) if (p < k * s) {
        k = p / s;
        j = n;
        i = 11;
        break b;
      } else z = s, i = 8; while (0);
      0 < z ? p < l * s ? l = p / s : i = 11 : i = 11;
    } while (0);
    if (l < k) {
      i = 12;
      break;
    }
    n += 1;
  }
  14 == i ? (i = 0 <= k ? 15 : 16, 15 == i && (i = k <= o[d + 4] ? 17 : 16), 16 == i && C(Pl, 249, Ql, Rl), i = 0 <= j ? 18 : 19, 18 == i ? (o[f + 2] = k, J(q, e + 2, c + 21 + (j << 1)), b[f] = b[q], o[f] = o[q], b[f + 1] = b[q + 1], o[f + 1] = o[q + 1], h = 1) : 19 == i && (h = 0)) : 4 == i ? h = 0 : 12 == i && (h = 0);
  a = g;
  return h;
}

Ol.X = 1;

function Sl(c, f, d) {
  var e = a;
  a += 14;
  var g, i, h, j = e + 2, k, l = e + 4, m = e + 6, n, p, u = e + 8, s = e + 10, q, v, x, w = e + 12;
  g = 3 <= b[c + 37] ? 2 : 1;
  1 == g && C(Pl, 306, Tl, Ul);
  Qe(e, 0, 0);
  h = i = 0;
  Xc(j, 0, 0);
  k = 0;
  n = c + 37;
  g = k < b[n] ? 3 : 5;
  a : do if (3 == g) for (var y = c + 5; ; ) if (Wc(j, y + (k << 1)), k += 1, k >= b[n]) break a; while (0);
  Yc(j, 1 / b[c + 37]);
  k = 0;
  y = c + 37;
  g = k < b[y] ? 6 : 11;
  a : do if (6 == g) for (var z = c + 5, B = c + 37, E = c + 5, D = l, H = l + 1, I = m, M = m + 1, G = c + 5; ; ) if (K(l, z + (k << 1), j), g = k + 1 < b[B] ? 8 : 9, 8 == g ? K(m, E + (k + 1 << 1), j) : 9 == g && K(m, G, j), n = Q(l, m), p = .5 * n, i += p, p *= .3333333432674408, P(s, l, m), N(u, p, s), Wc(e, u), q = o[D], p = o[H], v = o[I], x = o[M], q = q * q + v * q + v * v, p = p * p + x * p + x * x, h += .0833333358168602 * n * (q + p), k += 1, k >= b[y]) break a; while (0);
  o[f] = d * i;
  12 == (1.1920928955078125e-7 < i ? 13 : 12) && C(Pl, 352, Tl, Vl);
  Yc(e, 1 / i);
  c = f + 1;
  P(w, e, j);
  b[c] = b[w];
  o[c] = o[w];
  b[c + 1] = b[w + 1];
  o[c + 1] = o[w + 1];
  o[f + 3] = d * h;
  o[f + 3] += o[f] * (O(f + 1, f + 1) - O(e, e));
  a = e;
}

Sl.X = 1;

function Wl(c) {
  b[c] = le + 2;
  b[c] = Xl + 2;
  b[c + 1] = 2;
  o[c + 2] = .009999999776482582;
  b[c + 37] = 0;
  dc(c + 3);
}

Wl.X = 1;

function Yl(c) {
  o[c] = 0;
  o[c + 1] = 0;
  o[c + 2] = 0;
}

function Zl(c, f, d, e) {
  o[c] = f;
  o[c + 1] = d;
  o[c + 2] = e;
}

function $l(c, f) {
  o[c] *= f;
  o[c + 1] *= f;
  o[c + 2] *= f;
}

function am(c, f) {
  var d = a;
  a += 2;
  Yi(c, f);
  b[c] = bm + 2;
  var e = c + 18, g = f + 5;
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  e = c + 20;
  g = f + 7;
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  e = c + 22;
  g = f + 9;
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  Cg(c + 22);
  e = c + 24;
  $c(d, 1, c + 22);
  b[e] = b[d];
  o[e] = o[d];
  b[e + 1] = b[d + 1];
  o[e + 1] = o[d + 1];
  o[c + 26] = o[f + 11];
  Yl(c + 27);
  o[c + 65] = 0;
  o[c + 30] = 0;
  o[c + 31] = o[f + 13];
  o[c + 32] = o[f + 14];
  o[c + 33] = o[f + 16];
  o[c + 34] = o[f + 17];
  b[c + 35] = b[f + 12] & 1;
  b[c + 36] = b[f + 15] & 1;
  b[c + 37] = 0;
  dc(c + 48);
  dc(c + 50);
  a = d;
}

am.X = 1;

function cm(c, f) {
  var d = a;
  a += 44;
  var e, g, i = d + 2, h, j = d + 4, k, l = d + 6, m, n = d + 8, p = d + 10, u = d + 12, s = d + 14, q = d + 16, v = d + 18, x = d + 20, w = d + 22, y = d + 24;
  e = d + 26;
  var z = d + 28, B = d + 30, E = d + 32, D = d + 34, H = d + 36, I = d + 38, M = d + 40, G = d + 42;
  b[c + 38] = b[b[c + 12] + 2];
  b[c + 39] = b[b[c + 13] + 2];
  h = c + 40;
  m = b[c + 12] + 7;
  b[h] = b[m];
  o[h] = o[m];
  b[h + 1] = b[m + 1];
  o[h + 1] = o[m + 1];
  h = c + 42;
  m = b[c + 13] + 7;
  b[h] = b[m];
  o[h] = o[m];
  b[h + 1] = b[m + 1];
  o[h + 1] = o[m + 1];
  o[c + 44] = o[b[c + 12] + 30];
  o[c + 45] = o[b[c + 13] + 30];
  o[c + 46] = o[b[c + 12] + 32];
  o[c + 47] = o[b[c + 13] + 32];
  h = b[f + 6] + 3 * b[c + 38];
  b[d] = b[h];
  o[d] = o[h];
  b[d + 1] = b[h + 1];
  o[d + 1] = o[h + 1];
  g = o[b[f + 6] + 3 * b[c + 38] + 2];
  h = b[f + 7] + 3 * b[c + 38];
  b[i] = b[h];
  o[i] = o[h];
  b[i + 1] = b[h + 1];
  o[i + 1] = o[h + 1];
  h = o[b[f + 7] + 3 * b[c + 38] + 2];
  m = b[f + 6] + 3 * b[c + 39];
  b[j] = b[m];
  o[j] = o[m];
  b[j + 1] = b[m + 1];
  o[j + 1] = o[m + 1];
  k = o[b[f + 6] + 3 * b[c + 39] + 2];
  m = b[f + 7] + 3 * b[c + 39];
  b[l] = b[m];
  o[l] = o[m];
  b[l + 1] = b[m + 1];
  o[l + 1] = o[m + 1];
  m = o[b[f + 7] + 3 * b[c + 39] + 2];
  qj(n, g);
  qj(p, k);
  K(s, c + 18, c + 40);
  J(u, n, s);
  K(v, c + 20, c + 42);
  J(q, p, v);
  K(y, j, d);
  P(w, y, q);
  K(x, w, u);
  j = o[c + 44];
  p = o[c + 45];
  s = o[c + 46];
  v = o[c + 47];
  w = c + 48;
  J(e, n, c + 22);
  b[w] = b[e];
  o[w] = o[e];
  b[w + 1] = b[e + 1];
  o[w + 1] = o[e + 1];
  P(z, x, u);
  o[c + 54] = Q(z, c + 48);
  o[c + 55] = Q(q, c + 48);
  o[c + 65] = j + p + s * o[c + 54] * o[c + 54] + v * o[c + 55] * o[c + 55];
  e = 0 < o[c + 65] ? 1 : 2;
  1 == e && (o[c + 65] = 1 / o[c + 65]);
  e = c + 50;
  J(B, n, c + 24);
  b[e] = b[B];
  o[e] = o[B];
  b[e + 1] = b[B + 1];
  o[e + 1] = o[B + 1];
  P(E, x, u);
  o[c + 52] = Q(E, c + 50);
  o[c + 53] = Q(q, c + 50);
  n = j + p + s * o[c + 52] * o[c + 52] + v * o[c + 53] * o[c + 53];
  u = s * o[c + 52] + v * o[c + 53];
  q = s * o[c + 52] * o[c + 54] + v * o[c + 53] * o[c + 55];
  B = s + v;
  3 == (0 == s + v ? 3 : 4) && (B = 1);
  E = s * o[c + 54] + v * o[c + 55];
  e = j + p + s * o[c + 54] * o[c + 54] + v * o[c + 55] * o[c + 55];
  Zl(c + 56, n, u, q);
  Zl(c + 59, u, B, E);
  Zl(c + 62, q, E, e);
  e = b[c + 35] & 1 ? 5 : 14;
  a : do if (5 == e) if (n = O(c + 48, x), e = .009999999776482582 > ch(o[c + 32] - o[c + 31]) ? 6 : 7, 6 == e) b[c + 37] = 3; else {
    if (7 == e) if (e = n <= o[c + 31] ? 8 : 10, 8 == e) {
      if (1 == b[c + 37]) break a;
      b[c + 37] = 1;
      o[c + 29] = 0;
    } else if (10 == e) if (u = c + 37, e = n >= o[c + 32] ? 11 : 13, 11 == e) {
      if (2 == b[u]) break a;
      b[c + 37] = 2;
      o[c + 29] = 0;
    } else 13 == e && (b[u] = 0, o[c + 29] = 0);
  } else 14 == e && (b[c + 37] = 0, o[c + 29] = 0); while (0);
  e = 0 == (b[c + 36] & 1) ? 16 : 17;
  16 == e && (o[c + 30] = 0);
  x = c + 27;
  e = b[f + 5] & 1 ? 18 : 19;
  18 == e ? ($l(x, o[f + 2]), o[c + 30] *= o[f + 2], N(H, o[c + 27], c + 50), N(I, o[c + 30] + o[c + 29], c + 48), P(D, H, I), H = o[c + 27] * o[c + 52] + o[c + 28] + (o[c + 30] + o[c + 29]) * o[c + 54], I = o[c + 27] * o[c + 53] + o[c + 28] + (o[c + 30] + o[c + 29]) * o[c + 55], N(M, j, D), ii(i, M), h -= s * H, N(G, p, D), Wc(l, G), m += v * I) : 19 == e && (Yl(x), o[c + 30] = 0);
  D = b[f + 7] + 3 * b[c + 38];
  b[D] = b[i];
  o[D] = o[i];
  b[D + 1] = b[i + 1];
  o[D + 1] = o[i + 1];
  o[b[f + 7] + 3 * b[c + 38] + 2] = h;
  i = b[f + 7] + 3 * b[c + 39];
  b[i] = b[l];
  o[i] = o[l];
  b[i + 1] = b[l + 1];
  o[i + 1] = o[l + 1];
  o[b[f + 7] + 3 * b[c + 39] + 2] = m;
  a = d;
}

cm.X = 1;

function dm(c, f) {
  Zl(c, -o[f], -o[f + 1], -o[f + 2]);
}

function em(c, f) {
  o[c] += o[f];
  o[c + 1] += o[f + 1];
  o[c + 2] += o[f + 2];
}

function fm(c, f, d) {
  Xc(c, o[f] * o[d] + o[f + 3] * o[d + 1], o[f + 1] * o[d] + o[f + 4] * o[d + 1]);
}

function gm(c, f) {
  var d = a;
  a += 73;
  var e, g, i = d + 2, h, j, k, l, m, n;
  n = d + 4;
  var p, u = d + 6, s = d + 8, q = d + 10, v = d + 12, x = d + 14, w;
  w = d + 16;
  var y = d + 18, z = d + 21, B = d + 24, E = d + 27, D = d + 30, H = d + 32, I = d + 34, M = d + 36, G = d + 38, T = d + 40, R = d + 42, L = d + 44, S = d + 47, F = d + 49, X = d + 51, Z = d + 53, V = d + 55, aa = d + 57, ja = d + 59, Y = d + 61, W = d + 63, $ = d + 65, ga = d + 67, la = d + 69, fa = d + 71;
  g = b[f + 7] + 3 * b[c + 38];
  b[d] = b[g];
  o[d] = o[g];
  b[d + 1] = b[g + 1];
  o[d + 1] = o[g + 1];
  g = o[b[f + 7] + 3 * b[c + 38] + 2];
  h = b[f + 7] + 3 * b[c + 39];
  b[i] = b[h];
  o[i] = o[h];
  b[i + 1] = b[h + 1];
  o[i + 1] = o[h + 1];
  h = o[b[f + 7] + 3 * b[c + 39] + 2];
  j = o[c + 44];
  k = o[c + 45];
  l = o[c + 46];
  m = o[c + 47];
  e = b[c + 36] & 1 ? 1 : 3;
  1 == e && 3 != b[c + 37] && (e = c + 48, K(n, i, d), n = O(e, n) + o[c + 55] * h - o[c + 54] * g, n = o[c + 65] * (o[c + 34] - n), e = o[c + 30], p = o[f] * o[c + 33], o[c + 30] = ri(o[c + 30] + n, -p, p), n = o[c + 30] - e, N(u, n, c + 48), e = n * o[c + 54], n *= o[c + 55], N(s, j, u), ii(d, s), g -= l * e, N(q, k, u), Wc(i, q), h += m * n);
  u = c + 50;
  K(x, i, d);
  o[v] = O(u, x) + o[c + 53] * h - o[c + 52] * g;
  o[v + 1] = h - g;
  e = b[c + 35] & 1 ? 4 : 10;
  4 == e && (0 == b[c + 37] ? e = 10 : (x = c + 48, K(w, i, d), w = O(x, w) + o[c + 55] * h - o[c + 54] * g, nl(y, o[v], o[v + 1], w), w = c + 27, b[z] = b[w], o[z] = o[w], b[z + 1] = b[w + 1], o[z + 1] = o[w + 1], b[z + 2] = b[w + 2], o[z + 2] = o[w + 2], w = c + 56, dm(E, y), ql(B, w, E), em(c + 27, B), e = 1 == b[c + 37] ? 6 : 7, 6 == e ? o[c + 29] = 0 < o[c + 29] ? o[c + 29] : 0 : 7 == e && (2 != b[c + 37] || (o[c + 29] = 0 > o[c + 29] ? o[c + 29] : 0)), Pg(H, v), y = o[c + 29] - o[z + 2], Xc(M, o[c + 62], o[c + 63]), N(I, y, M), K(D, H, I), ol(T, c + 56, D), Xc(R, o[z], o[z + 1]), P(G, T, R), o[c + 27] = o[G], o[c + 28] = o[G + 1], D = c + 27, nl(L, o[D] - o[z], o[D + 1] - o[z + 1], o[D + 2] - o[z + 2]), b[B] = b[L], o[B] = o[L], b[B + 1] = b[L + 1], o[B + 1] = o[L + 1], b[B + 2] = b[L + 2], o[B + 2] = o[L + 2], N(F, o[B], c + 50), N(X, o[B + 2], c + 48), P(S, F, X), z = o[B] * o[c + 52] + o[B + 1] + o[B + 2] * o[c + 54], B = o[B] * o[c + 53] + o[B + 1] + o[B + 2] * o[c + 55], N(Z, j, S), ii(d, Z), g -= l * z, N(V, k, S), Wc(i, V), h += m * B, e = 13));
  a : do if (10 == e) {
    S = c + 56;
    Pg(ja, v);
    ol(aa, S, ja);
    o[c + 27] += o[aa];
    o[c + 28] += o[aa + 1];
    N(Y, o[aa], c + 50);
    S = o[aa] * o[c + 52] + o[aa + 1];
    Z = o[aa] * o[c + 53] + o[aa + 1];
    N(W, j, Y);
    ii(d, W);
    g -= l * S;
    N($, k, Y);
    Wc(i, $);
    h += m * Z;
    S = ga;
    Z = v;
    b[S] = b[Z];
    o[S] = o[Z];
    b[S + 1] = b[Z + 1];
    o[S + 1] = o[Z + 1];
    S = c + 50;
    K(la, i, d);
    o[v] = O(S, la) + o[c + 53] * h - o[c + 52] * g;
    o[v + 1] = h - g;
    e = .009999999776482582 < ch(o[v]) ? 12 : 11;
    if (11 == e && .009999999776482582 >= ch(o[v + 1])) break a;
    fm(fa, c + 56, aa);
    o[v] = o[v];
  } while (0);
  v = b[f + 7] + 3 * b[c + 38];
  b[v] = b[d];
  o[v] = o[d];
  b[v + 1] = b[d + 1];
  o[v + 1] = o[d + 1];
  o[b[f + 7] + 3 * b[c + 38] + 2] = g;
  g = b[f + 7] + 3 * b[c + 39];
  b[g] = b[i];
  o[g] = o[i];
  b[g + 1] = b[i + 1];
  o[g + 1] = o[i + 1];
  o[b[f + 7] + 3 * b[c + 39] + 2] = h;
  a = d;
}

gm.X = 1;

function hm(c, f, d) {
  var e, g, i, h;
  e = o[f];
  g = o[f + 2];
  i = o[f + 1];
  f = o[f + 3];
  h = e * f - g * i;
  if (1 == (0 != h ? 1 : 2)) h = 1 / h;
  o[c] = h * (f * o[d] - g * o[d + 1]);
  o[c + 1] = h * (e * o[d + 1] - i * o[d]);
}

hm.X = 1;

function im(c, f) {
  var d = a;
  a += 71;
  var e, g, i = d + 2, h, j = d + 4, k = d + 6, l, m, n, p, u = d + 8, s = d + 10, q = d + 12, v = d + 14, x = d + 16;
  e = d + 18;
  var w = d + 20, y = d + 22, z = d + 24, B = d + 26, E = d + 28, D = d + 30, H = d + 33, I, M, G, T = d + 35, R = d + 44, L = d + 47, S = d + 50;
  I = d + 53;
  M = d + 57;
  G = d + 59;
  var F = d + 61, X = d + 63, Z = d + 65, V = d + 67, aa = d + 69;
  g = b[f + 6] + 3 * b[c + 38];
  b[d] = b[g];
  o[d] = o[g];
  b[d + 1] = b[g + 1];
  o[d + 1] = o[g + 1];
  g = o[b[f + 6] + 3 * b[c + 38] + 2];
  h = b[f + 6] + 3 * b[c + 39];
  b[i] = b[h];
  o[i] = o[h];
  b[i + 1] = b[h + 1];
  o[i + 1] = o[h + 1];
  h = o[b[f + 6] + 3 * b[c + 39] + 2];
  qj(j, g);
  qj(k, h);
  l = o[c + 44];
  m = o[c + 45];
  n = o[c + 46];
  p = o[c + 47];
  K(s, c + 18, c + 40);
  J(u, j, s);
  K(v, c + 20, c + 42);
  J(q, k, v);
  P(w, i, q);
  K(e, w, d);
  K(x, e, u);
  J(y, j, c + 22);
  P(z, x, u);
  s = Q(z, y);
  k = Q(q, y);
  J(B, j, c + 24);
  P(E, x, u);
  u = Q(E, B);
  E = Q(q, B);
  o[H] = O(B, x);
  o[H + 1] = h - g - o[c + 26];
  q = ch(o[H]);
  j = ch(o[H + 1]);
  v = w = 0;
  e = b[c + 35] & 1 ? 1 : 7;
  a : do if (1 == e) {
    var ja = z = O(y, x);
    e = .009999999776482582 > ch(o[c + 32] - o[c + 31]) ? 2 : 3;
    if (2 == e) v = ri(ja, -.20000000298023224, .20000000298023224), q = q > ch(z) ? q : ch(z), w = 1; else if (3 == e) {
      var Y = z;
      e = ja <= o[c + 31] ? 4 : 5;
      if (4 == e) v = ri(Y - o[c + 31] + .004999999888241291, -.20000000298023224, 0), q = q > o[c + 31] - z ? q : o[c + 31] - z, w = 1; else if (5 == e) {
        if (!(Y >= o[c + 32])) break a;
        v = ri(z - o[c + 32] - .004999999888241291, 0, .20000000298023224);
        q = q > z - o[c + 32] ? q : z - o[c + 32];
        w = 1;
      }
    }
  } while (0);
  x = l + m + n * u * u + p * E * E;
  e = w & 1 ? 8 : 11;
  8 == e ? (I = n * u + p * E, M = n * u * s + p * E * k, G = n + p, 9 == (0 == G ? 9 : 10) && (G = 1), e = n * s + p * k, w = l + m + n * s * s + p * k * k, Zl(T, x, I, M), Zl(T + 3, I, G, e), Zl(T + 6, M, e, w), o[R] = o[H], o[R + 1] = o[H + 1], o[R + 2] = v, dm(S, R), ql(L, T, S), b[D] = b[L], o[D] = o[L], b[D + 1] = b[L + 1], o[D + 1] = o[L + 1], b[D + 2] = b[L + 2], o[D + 2] = o[L + 2]) : 11 == e && (T = n * u + p * E, R = n + p, 12 == (0 == R ? 12 : 13) && (R = 1), Qe(I, x, T), Qe(I + 2, T, R), Pg(G, H), hm(M, I, G), o[D] = o[M], o[D + 1] = o[M + 1], o[D + 2] = 0);
  N(X, o[D], B);
  N(Z, o[D + 2], y);
  P(F, X, Z);
  y = o[D] * u + o[D + 1] + o[D + 2] * s;
  D = o[D] * E + o[D + 1] + o[D + 2] * k;
  N(V, l, F);
  ii(d, V);
  g -= n * y;
  N(aa, m, F);
  Wc(i, aa);
  F = b[f + 6] + 3 * b[c + 38];
  b[F] = b[d];
  o[F] = o[d];
  b[F + 1] = b[d + 1];
  o[F + 1] = o[d + 1];
  o[b[f + 6] + 3 * b[c + 38] + 2] = g;
  g = b[f + 6] + 3 * b[c + 39];
  b[g] = b[i];
  o[g] = o[i];
  b[g + 1] = b[i + 1];
  o[g + 1] = o[i + 1];
  o[b[f + 6] + 3 * b[c + 39] + 2] = h + p * D;
  if (.004999999888241291 >= q) e = 15; else {
    var W = 0;
    e = 16;
  }
  15 == e && (W = .03490658849477768 >= j);
  a = d;
  return W;
}

im.X = 1;

function jm(c) {
  var f, d;
  f = b[b[c + 12] + 2];
  d = b[b[c + 13] + 2];
  U(km, A(1, "i32", r));
  U(gj, A([ f ], "i32", r));
  U(hj, A([ d ], "i32", r));
  U(ij, A([ b[c + 16] & 1 ], "i32", r));
  U(jj, A([ o[c + 18], o[c + 19] ], "double", r));
  U(kj, A([ o[c + 20], o[c + 21] ], "double", r));
  U(lm, A([ o[c + 22], o[c + 23] ], "double", r));
  U(mm, A([ o[c + 26] ], "double", r));
  U(nm, A([ b[c + 35] & 1 ], "i32", r));
  U(om, A([ o[c + 31] ], "double", r));
  U(pm, A([ o[c + 32] ], "double", r));
  U(qm, A([ b[c + 36] & 1 ], "i32", r));
  U(rm, A([ o[c + 34] ], "double", r));
  U(sm, A([ o[c + 33] ], "double", r));
  U(oj, A([ b[c + 14] ], "i32", r));
}

jm.X = 1;

function tm(c, f) {
  Yi(c, f);
  b[c] = um + 2;
  var d = c + 18, e = f + 5;
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  d = c + 20;
  e = f + 7;
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  d = c + 24;
  e = f + 9;
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  d = c + 26;
  e = f + 11;
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  o[c + 22] = o[f + 13];
  o[c + 23] = o[f + 14];
  1 == (0 != o[f + 15] ? 2 : 1) && C(vm, 65, wm, xm);
  o[c + 29] = o[f + 15];
  o[c + 28] = o[f + 13] + o[c + 29] * o[f + 14];
  o[c + 30] = 0;
}

tm.X = 1;

function ym(c, f) {
  var d = a;
  a += 36;
  var e, g, i = d + 2, h;
  e = d + 4;
  var j, k = d + 6, l, m = d + 8, n = d + 10, p = d + 12, u = d + 14, s = d + 16, q = d + 18, v = d + 20, x = d + 22, w = d + 24, y = d + 26, z = d + 28, B = d + 30, E = d + 32, D = d + 34;
  b[c + 31] = b[b[c + 12] + 2];
  b[c + 32] = b[b[c + 13] + 2];
  h = c + 41;
  l = b[c + 12] + 7;
  b[h] = b[l];
  o[h] = o[l];
  b[h + 1] = b[l + 1];
  o[h + 1] = o[l + 1];
  h = c + 43;
  l = b[c + 13] + 7;
  b[h] = b[l];
  o[h] = o[l];
  b[h + 1] = b[l + 1];
  o[h + 1] = o[l + 1];
  o[c + 45] = o[b[c + 12] + 30];
  o[c + 46] = o[b[c + 13] + 30];
  o[c + 47] = o[b[c + 12] + 32];
  o[c + 48] = o[b[c + 13] + 32];
  h = b[f + 6] + 3 * b[c + 31];
  b[d] = b[h];
  o[d] = o[h];
  b[d + 1] = b[h + 1];
  o[d + 1] = o[h + 1];
  g = o[b[f + 6] + 3 * b[c + 31] + 2];
  h = b[f + 7] + 3 * b[c + 31];
  b[i] = b[h];
  o[i] = o[h];
  b[i + 1] = b[h + 1];
  o[i + 1] = o[h + 1];
  h = o[b[f + 7] + 3 * b[c + 31] + 2];
  l = b[f + 6] + 3 * b[c + 32];
  b[e] = b[l];
  o[e] = o[l];
  b[e + 1] = b[l + 1];
  o[e + 1] = o[l + 1];
  j = o[b[f + 6] + 3 * b[c + 32] + 2];
  l = b[f + 7] + 3 * b[c + 32];
  b[k] = b[l];
  o[k] = o[l];
  b[k + 1] = b[l + 1];
  o[k + 1] = o[l + 1];
  l = o[b[f + 7] + 3 * b[c + 32] + 2];
  qj(m, g);
  qj(n, j);
  g = c + 37;
  K(u, c + 24, c + 41);
  J(p, m, u);
  b[g] = b[p];
  o[g] = o[p];
  b[g + 1] = b[p + 1];
  o[g + 1] = o[p + 1];
  m = c + 39;
  K(q, c + 26, c + 43);
  J(s, n, q);
  b[m] = b[s];
  o[m] = o[s];
  b[m + 1] = b[s + 1];
  o[m + 1] = o[s + 1];
  n = c + 33;
  P(x, d, c + 37);
  K(v, x, c + 18);
  b[n] = b[v];
  o[n] = o[v];
  b[n + 1] = b[v + 1];
  o[n + 1] = o[v + 1];
  v = c + 35;
  P(y, e, c + 39);
  K(w, y, c + 20);
  b[v] = b[w];
  o[v] = o[w];
  b[v + 1] = b[w + 1];
  o[v + 1] = o[w + 1];
  w = Dg(c + 33);
  y = Dg(c + 35);
  e = .04999999701976776 < w ? 1 : 2;
  1 == e ? Yc(c + 33, 1 / w) : 2 == e && dc(c + 33);
  e = .04999999701976776 < y ? 4 : 5;
  4 == e ? Yc(c + 35, 1 / y) : 5 == e && dc(c + 35);
  e = Q(c + 37, c + 33);
  w = Q(c + 39, c + 35);
  o[c + 49] = o[c + 45] + o[c + 47] * e * e + o[c + 29] * o[c + 29] * (o[c + 46] + o[c + 48] * w * w);
  e = 0 < o[c + 49] ? 7 : 8;
  7 == e && (o[c + 49] = 1 / o[c + 49]);
  e = b[f + 5] & 1 ? 9 : 10;
  9 == e ? (o[c + 30] *= o[f + 2], N(z, -o[c + 30], c + 33), N(B, -o[c + 29] * o[c + 30], c + 35), N(E, o[c + 45], z), Wc(i, E), h += o[c + 47] * Q(c + 37, z), N(D, o[c + 46], B), Wc(k, D), l += o[c + 48] * Q(c + 39, B)) : 10 == e && (o[c + 30] = 0);
  z = b[f + 7] + 3 * b[c + 31];
  b[z] = b[i];
  o[z] = o[i];
  b[z + 1] = b[i + 1];
  o[z + 1] = o[i + 1];
  o[b[f + 7] + 3 * b[c + 31] + 2] = h;
  i = b[f + 7] + 3 * b[c + 32];
  b[i] = b[k];
  o[i] = o[k];
  b[i + 1] = b[k + 1];
  o[i + 1] = o[k + 1];
  o[b[f + 7] + 3 * b[c + 32] + 2] = l;
  a = d;
}

ym.X = 1;

function zm(c, f) {
  var d = a;
  a += 20;
  var e, g = d + 2, i, h = d + 4, j = d + 6, k = d + 8, l = d + 10, m = d + 12, n = d + 14, p = d + 16, u = d + 18;
  e = b[f + 7] + 3 * b[c + 31];
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  e = o[b[f + 7] + 3 * b[c + 31] + 2];
  i = b[f + 7] + 3 * b[c + 32];
  b[g] = b[i];
  o[g] = o[i];
  b[g + 1] = b[i + 1];
  o[g + 1] = o[i + 1];
  i = o[b[f + 7] + 3 * b[c + 32] + 2];
  $c(j, e, c + 37);
  P(h, d, j);
  $c(l, i, c + 39);
  P(k, g, l);
  h = -o[c + 49] * (-O(c + 33, h) - o[c + 29] * O(c + 35, k));
  o[c + 30] += h;
  N(m, -h, c + 33);
  N(n, -o[c + 29] * h, c + 35);
  N(p, o[c + 45], m);
  Wc(d, p);
  e += o[c + 47] * Q(c + 37, m);
  N(u, o[c + 46], n);
  Wc(g, u);
  i += o[c + 48] * Q(c + 39, n);
  m = b[f + 7] + 3 * b[c + 31];
  b[m] = b[d];
  o[m] = o[d];
  b[m + 1] = b[d + 1];
  o[m + 1] = o[d + 1];
  o[b[f + 7] + 3 * b[c + 31] + 2] = e;
  e = b[f + 7] + 3 * b[c + 32];
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  o[b[f + 7] + 3 * b[c + 32] + 2] = i;
  a = d;
}

zm.X = 1;

function Am(c) {
  var f, d;
  f = b[b[c + 12] + 2];
  d = b[b[c + 13] + 2];
  U(Bm, A(1, "i32", r));
  U(gj, A([ f ], "i32", r));
  U(hj, A([ d ], "i32", r));
  U(ij, A([ b[c + 16] & 1 ], "i32", r));
  U(Cm, A([ o[c + 18], o[c + 19] ], "double", r));
  U(Dm, A([ o[c + 20], o[c + 21] ], "double", r));
  U(jj, A([ o[c + 24], o[c + 25] ], "double", r));
  U(kj, A([ o[c + 26], o[c + 27] ], "double", r));
  U(Em, A([ o[c + 22] ], "double", r));
  U(Fm, A([ o[c + 23] ], "double", r));
  U(Fk, A([ o[c + 29] ], "double", r));
  U(oj, A([ b[c + 14] ], "i32", r));
}

Am.X = 1;

function Gm(c, f) {
  Yi(c, f);
  b[c] = Hm + 2;
  var d = c + 18, e = f + 5;
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  d = c + 20;
  e = f + 7;
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  o[c + 30] = o[f + 9];
  Yl(c + 22);
  o[c + 25] = 0;
  o[c + 31] = o[f + 11];
  o[c + 32] = o[f + 12];
  o[c + 27] = o[f + 15];
  o[c + 28] = o[f + 14];
  b[c + 29] = b[f + 10] & 1;
  b[c + 26] = b[f + 13] & 1;
  b[c + 57] = 0;
}

Gm.X = 1;

function Im(c, f) {
  var d = a;
  a += 32;
  var e, g, i = d + 2, h, j = d + 4, k = d + 6, l = d + 8, m = d + 10, n = d + 12;
  e = d + 14;
  var p = d + 16, u = d + 18, s = d + 20, q = d + 22, v = d + 24, x = d + 26, w = d + 28, y = d + 30;
  g = b[f + 6] + 3 * b[c + 31];
  b[d] = b[g];
  o[d] = o[g];
  b[d + 1] = b[g + 1];
  o[d + 1] = o[g + 1];
  g = o[b[f + 6] + 3 * b[c + 31] + 2];
  h = b[f + 6] + 3 * b[c + 32];
  b[i] = b[h];
  o[i] = o[h];
  b[i + 1] = b[h + 1];
  o[i + 1] = o[h + 1];
  h = o[b[f + 6] + 3 * b[c + 32] + 2];
  qj(j, g);
  qj(k, h);
  K(m, c + 24, c + 41);
  J(l, j, m);
  K(e, c + 26, c + 43);
  J(n, k, e);
  P(u, d, l);
  K(p, u, c + 18);
  P(q, i, n);
  K(s, q, c + 20);
  j = Dg(p);
  k = Dg(s);
  e = .04999999701976776 < j ? 1 : 2;
  1 == e ? Yc(p, 1 / j) : 2 == e && dc(p);
  e = .04999999701976776 < k ? 4 : 5;
  4 == e ? Yc(s, 1 / k) : 5 == e && dc(s);
  e = Q(l, p);
  m = Q(n, s);
  e = o[c + 45] + o[c + 47] * e * e;
  u = o[c + 46] + o[c + 48] * m * m;
  m = e + o[c + 29] * o[c + 29] * u;
  e = 0 < e + o[c + 29] * o[c + 29] * u ? 7 : 8;
  7 == e && (m = 1 / m);
  k = o[c + 28] - j - o[c + 29] * k;
  j = ch(k);
  k *= -m;
  N(v, -k, p);
  N(x, -o[c + 29] * k, s);
  N(w, o[c + 45], v);
  Wc(d, w);
  g += o[c + 47] * Q(l, v);
  N(y, o[c + 46], x);
  Wc(i, y);
  h += o[c + 48] * Q(n, x);
  l = b[f + 6] + 3 * b[c + 31];
  b[l] = b[d];
  o[l] = o[d];
  b[l + 1] = b[d + 1];
  o[l + 1] = o[d + 1];
  o[b[f + 6] + 3 * b[c + 31] + 2] = g;
  g = b[f + 6] + 3 * b[c + 32];
  b[g] = b[i];
  o[g] = o[i];
  b[g + 1] = b[i + 1];
  o[g + 1] = o[i + 1];
  o[b[f + 6] + 3 * b[c + 32] + 2] = h;
  a = d;
  return .004999999888241291 > j;
}

Im.X = 1;

function Jm(c, f) {
  var d = a;
  a += 26;
  var e, g, i = d + 2, h, j = d + 4, k, l = d + 6, m = d + 8;
  e = d + 10;
  var n = d + 12, p = d + 14, u = d + 16, s = d + 18, q, v = d + 20, x = d + 22, w = d + 24;
  b[c + 33] = b[b[c + 12] + 2];
  b[c + 34] = b[b[c + 13] + 2];
  h = c + 39;
  g = b[c + 12] + 7;
  b[h] = b[g];
  o[h] = o[g];
  b[h + 1] = b[g + 1];
  o[h + 1] = o[g + 1];
  h = c + 41;
  g = b[c + 13] + 7;
  b[h] = b[g];
  o[h] = o[g];
  b[h + 1] = b[g + 1];
  o[h + 1] = o[g + 1];
  o[c + 43] = o[b[c + 12] + 30];
  o[c + 44] = o[b[c + 13] + 30];
  o[c + 45] = o[b[c + 12] + 32];
  o[c + 46] = o[b[c + 13] + 32];
  h = b[f + 6] + 3 * b[c + 33];
  b[d] = b[h];
  o[d] = o[h];
  b[d + 1] = b[h + 1];
  o[d + 1] = o[h + 1];
  g = o[b[f + 6] + 3 * b[c + 33] + 2];
  h = b[f + 7] + 3 * b[c + 33];
  b[i] = b[h];
  o[i] = o[h];
  b[i + 1] = b[h + 1];
  o[i + 1] = o[h + 1];
  h = o[b[f + 7] + 3 * b[c + 33] + 2];
  k = b[f + 6] + 3 * b[c + 34];
  b[j] = b[k];
  o[j] = o[k];
  b[j + 1] = b[k + 1];
  o[j + 1] = o[k + 1];
  k = o[b[f + 6] + 3 * b[c + 34] + 2];
  j = b[f + 7] + 3 * b[c + 34];
  b[l] = b[j];
  o[l] = o[j];
  b[l + 1] = b[j + 1];
  o[l + 1] = o[j + 1];
  j = o[b[f + 7] + 3 * b[c + 34] + 2];
  qj(m, g);
  qj(e, k);
  q = c + 35;
  K(p, c + 18, c + 39);
  J(n, m, p);
  b[q] = b[n];
  o[q] = o[n];
  b[q + 1] = b[n + 1];
  o[q + 1] = o[n + 1];
  m = c + 37;
  K(s, c + 20, c + 41);
  J(u, e, s);
  b[m] = b[u];
  o[m] = o[u];
  b[m + 1] = b[u + 1];
  o[m + 1] = o[u + 1];
  u = o[c + 43];
  s = o[c + 44];
  m = o[c + 45];
  n = o[c + 46];
  p = 0 == m + n;
  o[c + 47] = u + s + o[c + 36] * o[c + 36] * m + o[c + 38] * o[c + 38] * n;
  o[c + 50] = -o[c + 36] * o[c + 35] * m - o[c + 38] * o[c + 37] * n;
  o[c + 53] = -o[c + 36] * m - o[c + 38] * n;
  o[c + 48] = o[c + 50];
  o[c + 51] = u + s + o[c + 35] * o[c + 35] * m + o[c + 37] * o[c + 37] * n;
  o[c + 54] = o[c + 35] * m + o[c + 37] * n;
  o[c + 49] = o[c + 53];
  o[c + 52] = o[c + 54];
  o[c + 55] = m + n;
  o[c + 56] = m + n;
  e = 0 < o[c + 56] ? 1 : 2;
  1 == e && (o[c + 56] = 1 / o[c + 56]);
  e = 0 == (b[c + 26] & 1) ? 4 : 3;
  3 == e && (e = p & 1 ? 4 : 5);
  4 == e && (o[c + 25] = 0);
  e = b[c + 29] & 1 ? 6 : 18;
  a : do if (6 == e) if (0 != (p & 1)) e = 18; else if (q = k - g - o[c + 30], e = .06981317698955536 > ch(o[c + 32] - o[c + 31]) ? 8 : 9, 8 == e) {
    b[c + 57] = 3;
    e = 19;
    break a;
  } else if (9 == e) if (e = q <= o[c + 31] ? 10 : 13, 10 == e) {
    e = 1 != b[c + 57] ? 11 : 12;
    11 == e && (o[c + 24] = 0);
    b[c + 57] = 1;
    e = 19;
    break a;
  } else if (13 == e) {
    var y = c + 57;
    e = q >= o[c + 32] ? 14 : 17;
    if (14 == e) {
      e = 2 != b[y] ? 15 : 16;
      15 == e && (o[c + 24] = 0);
      b[c + 57] = 2;
      e = 19;
      break a;
    } else if (17 == e) {
      b[y] = 0;
      o[c + 24] = 0;
      e = 19;
      break a;
    }
  } while (0);
  18 == e && (b[c + 57] = 0);
  g = c + 22;
  e = b[f + 5] & 1 ? 20 : 21;
  20 == e ? ($l(g, o[f + 2]), o[c + 25] *= o[f + 2], Xc(v, o[c + 22], o[c + 23]), N(x, u, v), ii(i, x), h -= m * (Q(c + 35, v) + o[c + 25] + o[c + 24]), N(w, s, v), Wc(l, w), j += n * (Q(c + 37, v) + o[c + 25] + o[c + 24])) : 21 == e && (Yl(g), o[c + 25] = 0);
  v = b[f + 7] + 3 * b[c + 33];
  b[v] = b[i];
  o[v] = o[i];
  b[v + 1] = b[i + 1];
  o[v + 1] = o[i + 1];
  o[b[f + 7] + 3 * b[c + 33] + 2] = h;
  i = b[f + 7] + 3 * b[c + 34];
  b[i] = b[l];
  o[i] = o[l];
  b[i + 1] = b[l + 1];
  o[i + 1] = o[l + 1];
  o[b[f + 7] + 3 * b[c + 34] + 2] = j;
  a = d;
}

Jm.X = 1;

function Km(c, f) {
  var d = a;
  a += 67;
  var e, g, i = d + 2, h, j, k, l, m, n, p, u, s = d + 4, q = d + 6, v = d + 8, x = d + 10, w = d + 12, y = d + 14, z = d + 17, B = d + 20, E = d + 23, D = d + 25, H = d + 27, I = d + 29, M = d + 31, G = d + 33, T = d + 35, R = d + 37, L = d + 39, S = d + 41, F = d + 43, X = d + 45, Z = d + 47, V = d + 49, aa = d + 51, ja = d + 53, Y = d + 55, W = d + 57, $ = d + 59, ga = d + 61, la = d + 63, fa = d + 65;
  g = b[f + 7] + 3 * b[c + 33];
  b[d] = b[g];
  o[d] = o[g];
  b[d + 1] = b[g + 1];
  o[d + 1] = o[g + 1];
  g = o[b[f + 7] + 3 * b[c + 33] + 2];
  h = b[f + 7] + 3 * b[c + 34];
  b[i] = b[h];
  o[i] = o[h];
  b[i + 1] = b[h + 1];
  o[i + 1] = o[h + 1];
  h = o[b[f + 7] + 3 * b[c + 34] + 2];
  j = o[c + 43];
  k = o[c + 44];
  l = o[c + 45];
  m = o[c + 46];
  n = 0 == l + m;
  e = b[c + 26] & 1 ? 1 : 4;
  1 == e && 3 != b[c + 57] && 0 == (n & 1) && (e = h - g - o[c + 28], e *= -o[c + 56], p = o[c + 25], u = o[f] * o[c + 27], o[c + 25] = ri(o[c + 25] + e, -u, u), e = o[c + 25] - p, g -= l * e, h += m * e);
  e = b[c + 29] & 1 ? 5 : 18;
  do if (5 == e) if (0 == b[c + 57]) e = 18; else if (0 != (n & 1)) e = 18; else {
    $c(x, h, c + 37);
    P(v, i, x);
    K(q, v, d);
    $c(w, g, c + 35);
    K(s, q, w);
    e = h - g;
    nl(y, o[s], o[s + 1], e);
    ql(B, c + 47, y);
    dm(z, B);
    e = 3 == b[c + 57] ? 8 : 9;
    a : do if (8 == e) em(c + 22, z); else if (9 == e) if (e = 1 == b[c + 57] ? 10 : 13, 10 == e) e = o[c + 24] + o[z + 2], e = 0 > e ? 11 : 12, 11 == e ? (Pg(D, s), p = o[c + 24], Xc(I, o[c + 53], o[c + 54]), N(H, p, I), P(E, D, H), ol(M, c + 47, E), o[z] = o[M], o[z + 1] = o[M + 1], o[z + 2] = -o[c + 24], o[c + 22] += o[M], o[c + 23] += o[M + 1], o[c + 24] = 0) : 12 == e && em(c + 22, z); else if (13 == e) {
      if (2 != b[c + 57]) break a;
      e = o[c + 24] + o[z + 2];
      e = 0 < e ? 15 : 16;
      15 == e ? (Pg(T, s), p = o[c + 24], Xc(L, o[c + 53], o[c + 54]), N(R, p, L), P(G, T, R), ol(S, c + 47, G), o[z] = o[S], o[z + 1] = o[S + 1], o[z + 2] = -o[c + 24], o[c + 22] += o[S], o[c + 23] += o[S + 1], o[c + 24] = 0) : 16 == e && em(c + 22, z);
    } while (0);
    Xc(F, o[z], o[z + 1]);
    N(X, j, F);
    ii(d, X);
    g -= l * (Q(c + 35, F) + o[z + 2]);
    N(Z, k, F);
    Wc(i, Z);
    h += m * (Q(c + 37, F) + o[z + 2]);
    e = 19;
  } while (0);
  18 == e && ($c(Y, h, c + 37), P(ja, i, Y), K(aa, ja, d), $c(W, g, c + 35), K(V, aa, W), s = c + 47, Pg(ga, V), ol($, s, ga), o[c + 22] += o[$], o[c + 23] += o[$ + 1], N(la, j, $), ii(d, la), g -= l * Q(c + 35, $), N(fa, k, $), Wc(i, fa), h += m * Q(c + 37, $));
  V = b[f + 7] + 3 * b[c + 33];
  b[V] = b[d];
  o[V] = o[d];
  b[V + 1] = b[d + 1];
  o[V + 1] = o[d + 1];
  o[b[f + 7] + 3 * b[c + 33] + 2] = g;
  g = b[f + 7] + 3 * b[c + 34];
  b[g] = b[i];
  o[g] = o[i];
  b[g + 1] = b[i + 1];
  o[g + 1] = o[i + 1];
  o[b[f + 7] + 3 * b[c + 34] + 2] = h;
  a = d;
}

Km.X = 1;

function Lm(c, f) {
  var d = a;
  a += 34;
  var e, g, i = d + 2, h, j = d + 4, k = d + 6, l, m, n, p, u = d + 8, s = d + 10, q = d + 12, v = d + 14, x = d + 16, w = d + 18, y = d + 20, z = d + 22, B = d + 26, E = d + 28, D = d + 30, H = d + 32;
  g = b[f + 6] + 3 * b[c + 33];
  b[d] = b[g];
  o[d] = o[g];
  b[d + 1] = b[g + 1];
  o[d + 1] = o[g + 1];
  g = o[b[f + 6] + 3 * b[c + 33] + 2];
  h = b[f + 6] + 3 * b[c + 34];
  b[i] = b[h];
  o[i] = o[h];
  b[i + 1] = b[h + 1];
  o[i + 1] = o[h + 1];
  h = o[b[f + 6] + 3 * b[c + 34] + 2];
  qj(j, g);
  qj(k, h);
  l = 0;
  m = 0 == o[c + 45] + o[c + 46];
  e = b[c + 29] & 1 ? 1 : 10;
  do if (1 == e) if (0 == b[c + 57]) e = 10; else if (0 != (m & 1)) e = 10; else {
    n = h - g - o[c + 30];
    p = 0;
    e = 3 == b[c + 57] ? 4 : 5;
    a : do if (4 == e) l = ri(n - o[c + 31], -.13962635397911072, .13962635397911072), p = -o[c + 56] * l, l = ch(l); else if (5 == e) if (e = 1 == b[c + 57] ? 6 : 7, 6 == e) p = n - o[c + 31], l = -p, p = ri(p + .03490658849477768, -.13962635397911072, 0), p *= -o[c + 56]; else if (7 == e) {
      if (2 != b[c + 57]) {
        e = 9;
        break a;
      }
      l = p = n - o[c + 32];
      p = ri(p - .03490658849477768, 0, .13962635397911072);
      p *= -o[c + 56];
    } while (0);
    g -= o[c + 45] * p;
    h += o[c + 46] * p;
  } while (0);
  Mc(j, g);
  Mc(k, h);
  K(s, c + 18, c + 39);
  J(u, j, s);
  K(v, c + 20, c + 41);
  J(q, k, v);
  P(y, i, q);
  K(w, y, d);
  K(x, w, u);
  j = Dg(x);
  k = o[c + 43];
  s = o[c + 44];
  v = o[c + 45];
  w = o[c + 46];
  o[z] = k + s + v * o[u + 1] * o[u + 1] + w * o[q + 1] * o[q + 1];
  o[z + 1] = -v * o[u] * o[u + 1] - w * o[q] * o[q + 1];
  o[z + 2] = o[z + 1];
  o[z + 3] = k + s + v * o[u] * o[u] + w * o[q] * o[q];
  hm(E, z, x);
  Pg(B, E);
  N(D, k, B);
  ii(d, D);
  g -= v * Q(u, B);
  N(H, s, B);
  Wc(i, H);
  h += w * Q(q, B);
  u = b[f + 6] + 3 * b[c + 33];
  b[u] = b[d];
  o[u] = o[d];
  b[u + 1] = b[d + 1];
  o[u + 1] = o[d + 1];
  o[b[f + 6] + 3 * b[c + 33] + 2] = g;
  g = b[f + 6] + 3 * b[c + 34];
  b[g] = b[i];
  o[g] = o[i];
  b[g + 1] = b[i + 1];
  o[g + 1] = o[i + 1];
  o[b[f + 6] + 3 * b[c + 34] + 2] = h;
  if (.004999999888241291 >= j) e = 11; else {
    var I = 0;
    e = 12;
  }
  11 == e && (I = .03490658849477768 >= l);
  a = d;
  return I;
}

Lm.X = 1;

function Mm(c) {
  var f, d;
  f = b[b[c + 12] + 2];
  d = b[b[c + 13] + 2];
  U(Nm, A(1, "i32", r));
  U(gj, A([ f ], "i32", r));
  U(hj, A([ d ], "i32", r));
  U(ij, A([ b[c + 16] & 1 ], "i32", r));
  U(jj, A([ o[c + 18], o[c + 19] ], "double", r));
  U(kj, A([ o[c + 20], o[c + 21] ], "double", r));
  U(mm, A([ o[c + 30] ], "double", r));
  U(nm, A([ b[c + 29] & 1 ], "i32", r));
  U(Om, A([ o[c + 31] ], "double", r));
  U(Pm, A([ o[c + 32] ], "double", r));
  U(qm, A([ b[c + 26] & 1 ], "i32", r));
  U(rm, A([ o[c + 28] ], "double", r));
  U(Qm, A([ o[c + 27] ], "double", r));
  U(oj, A([ b[c + 14] ], "i32", r));
}

Mm.X = 1;

function Rm(c, f) {
  Yi(c, f);
  b[c] = Sm + 2;
  var d = c + 18, e = f + 5;
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  d = c + 20;
  e = f + 7;
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  o[c + 22] = o[f + 9];
  o[c + 41] = 0;
  o[c + 24] = 0;
  b[c + 42] = 0;
  o[c + 23] = 0;
}

Rm.X = 1;

function Tm(c, f) {
  var d = a;
  a += 32;
  var e, g, i = d + 2, h;
  e = d + 4;
  var j, k = d + 6, l, m = d + 8, n = d + 10, p = d + 12, u = d + 14, s = d + 16, q = d + 18, v = d + 20, x = d + 22, w = d + 24, y = d + 26, z = d + 28, B = d + 30;
  b[c + 25] = b[b[c + 12] + 2];
  b[c + 26] = b[b[c + 13] + 2];
  h = c + 33;
  l = b[c + 12] + 7;
  b[h] = b[l];
  o[h] = o[l];
  b[h + 1] = b[l + 1];
  o[h + 1] = o[l + 1];
  h = c + 35;
  l = b[c + 13] + 7;
  b[h] = b[l];
  o[h] = o[l];
  b[h + 1] = b[l + 1];
  o[h + 1] = o[l + 1];
  o[c + 37] = o[b[c + 12] + 30];
  o[c + 38] = o[b[c + 13] + 30];
  o[c + 39] = o[b[c + 12] + 32];
  o[c + 40] = o[b[c + 13] + 32];
  h = b[f + 6] + 3 * b[c + 25];
  b[d] = b[h];
  o[d] = o[h];
  b[d + 1] = b[h + 1];
  o[d + 1] = o[h + 1];
  g = o[b[f + 6] + 3 * b[c + 25] + 2];
  h = b[f + 7] + 3 * b[c + 25];
  b[i] = b[h];
  o[i] = o[h];
  b[i + 1] = b[h + 1];
  o[i + 1] = o[h + 1];
  h = o[b[f + 7] + 3 * b[c + 25] + 2];
  l = b[f + 6] + 3 * b[c + 26];
  b[e] = b[l];
  o[e] = o[l];
  b[e + 1] = b[l + 1];
  o[e + 1] = o[l + 1];
  j = o[b[f + 6] + 3 * b[c + 26] + 2];
  l = b[f + 7] + 3 * b[c + 26];
  b[k] = b[l];
  o[k] = o[l];
  b[k + 1] = b[l + 1];
  o[k + 1] = o[l + 1];
  l = o[b[f + 7] + 3 * b[c + 26] + 2];
  qj(m, g);
  qj(n, j);
  g = c + 29;
  K(u, c + 18, c + 33);
  J(p, m, u);
  b[g] = b[p];
  o[g] = o[p];
  b[g + 1] = b[p + 1];
  o[g + 1] = o[p + 1];
  m = c + 31;
  K(q, c + 20, c + 35);
  J(s, n, q);
  b[m] = b[s];
  o[m] = o[s];
  b[m + 1] = b[s + 1];
  o[m + 1] = o[s + 1];
  n = c + 27;
  P(w, e, c + 31);
  K(x, w, d);
  K(v, x, c + 29);
  b[n] = b[v];
  o[n] = o[v];
  b[n + 1] = b[v + 1];
  o[n + 1] = o[v + 1];
  e = Dg(c + 27);
  o[c + 23] = e;
  e = 0 < o[c + 23] - o[c + 22] ? 1 : 2;
  1 == e ? b[c + 42] = 2 : 2 == e && (b[c + 42] = 0);
  v = c + 27;
  e = .004999999888241291 < o[c + 23] ? 4 : 5;
  if (4 == e) {
    Yc(v, 1 / o[c + 23]);
    e = Q(c + 29, c + 27);
    v = Q(c + 31, c + 27);
    v = o[c + 37] + o[c + 39] * e * e + o[c + 38] + o[c + 40] * v * v;
    if (0 != v) e = 6; else {
      var E = 0;
      e = 7;
    }
    6 == e && (E = 1 / v);
    o[c + 41] = E;
    e = b[f + 5] & 1 ? 8 : 9;
    8 == e ? (o[c + 24] *= o[f + 2], N(y, o[c + 24], c + 27), N(z, o[c + 37], y), ii(i, z), h -= o[c + 39] * Q(c + 29, y), N(B, o[c + 38], y), Wc(k, B), l += o[c + 40] * Q(c + 31, y)) : 9 == e && (o[c + 24] = 0);
    y = b[f + 7] + 3 * b[c + 25];
    b[y] = b[i];
    o[y] = o[i];
    b[y + 1] = b[i + 1];
    o[y + 1] = o[i + 1];
    o[b[f + 7] + 3 * b[c + 25] + 2] = h;
    i = b[f + 7] + 3 * b[c + 26];
    b[i] = b[k];
    o[i] = o[k];
    b[i + 1] = b[k + 1];
    o[i + 1] = o[k + 1];
    o[b[f + 7] + 3 * b[c + 26] + 2] = l;
  } else 5 == e && (dc(v), o[c + 41] = 0, o[c + 24] = 0);
  a = d;
}

Tm.X = 1;

function Um(c) {
  var f, d;
  f = b[b[c + 12] + 2];
  d = b[b[c + 13] + 2];
  U(Vm, A(1, "i32", r));
  U(gj, A([ f ], "i32", r));
  U(hj, A([ d ], "i32", r));
  U(ij, A([ b[c + 16] & 1 ], "i32", r));
  U(jj, A([ o[c + 18], o[c + 19] ], "double", r));
  U(kj, A([ o[c + 20], o[c + 21] ], "double", r));
  U(Wm, A([ o[c + 22] ], "double", r));
  U(oj, A([ b[c + 14] ], "i32", r));
}

Um.X = 1;

function Xm(c) {
  b[c + 102400] = 0;
  b[c + 102401] = 0;
  b[c + 102402] = 0;
  b[c + 102499] = 0;
}

function Ym(c) {
  var f;
  f = 0 == b[c + 102400] ? 2 : 1;
  1 == f && C(Zm, 32, $m, an);
  f = 0 == b[c + 102499] ? 4 : 3;
  3 == f && C(Zm, 33, $m, bn);
}

function bi(c, f) {
  var d, e;
  d = 0 < b[c + 102499] ? 2 : 1;
  1 == d && C(Zm, 63, cn, dn);
  e = c + 102403 + 3 * b[c + 102499] - 3;
  d = f == b[e] ? 4 : 3;
  3 == d && C(Zm, 65, cn, en);
  d = b[e + 2] & 1 ? 5 : 6;
  5 != d && 6 == d && (b[c + 102400] -= b[e + 1]);
  b[c + 102401] -= b[e + 1];
  b[c + 102499] -= 1;
}

bi.X = 1;

function fn(c, f) {
  var d = a;
  a += 20;
  var e, g = d + 2, i, h = d + 4, j = d + 6, k = d + 8, l = d + 10, m = d + 12, n = d + 14, p = d + 16, u = d + 18;
  e = b[f + 7] + 3 * b[c + 25];
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  e = o[b[f + 7] + 3 * b[c + 25] + 2];
  i = b[f + 7] + 3 * b[c + 26];
  b[g] = b[i];
  o[g] = o[i];
  b[g + 1] = b[i + 1];
  o[g + 1] = o[i + 1];
  i = o[b[f + 7] + 3 * b[c + 26] + 2];
  $c(j, e, c + 29);
  P(h, d, j);
  $c(l, i, c + 31);
  P(k, g, l);
  j = o[c + 23] - o[c + 22];
  l = c + 27;
  K(m, k, h);
  h = O(l, m);
  if (1 == (0 > j ? 1 : 2)) h += o[f + 1] * j;
  h *= -o[c + 41];
  k = o[c + 24];
  o[c + 24] = 0 < o[c + 24] + h ? 0 : o[c + 24] + h;
  h = o[c + 24] - k;
  N(n, h, c + 27);
  N(p, o[c + 37], n);
  ii(d, p);
  e -= o[c + 39] * Q(c + 29, n);
  N(u, o[c + 38], n);
  Wc(g, u);
  i += o[c + 40] * Q(c + 31, n);
  n = b[f + 7] + 3 * b[c + 25];
  b[n] = b[d];
  o[n] = o[d];
  b[n + 1] = b[d + 1];
  o[n + 1] = o[d + 1];
  o[b[f + 7] + 3 * b[c + 25] + 2] = e;
  e = b[f + 7] + 3 * b[c + 26];
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  o[b[f + 7] + 3 * b[c + 26] + 2] = i;
  a = d;
}

fn.X = 1;

function gn(c, f) {
  var d = a;
  a += 28;
  var e, g = d + 2, i, h = d + 4, j = d + 6, k = d + 8, l = d + 10, m = d + 12, n = d + 14, p = d + 16, u = d + 18, s = d + 20, q = d + 22, v = d + 24, x = d + 26;
  e = b[f + 6] + 3 * b[c + 25];
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  e = o[b[f + 6] + 3 * b[c + 25] + 2];
  i = b[f + 6] + 3 * b[c + 26];
  b[g] = b[i];
  o[g] = o[i];
  b[g + 1] = b[i + 1];
  o[g + 1] = o[i + 1];
  i = o[b[f + 6] + 3 * b[c + 26] + 2];
  qj(h, e);
  qj(j, i);
  K(l, c + 18, c + 33);
  J(k, h, l);
  K(n, c + 20, c + 35);
  J(m, j, n);
  P(s, g, m);
  K(u, s, d);
  K(p, u, k);
  h = Cg(p);
  j = h - o[c + 22];
  j = ri(j, 0, .20000000298023224);
  N(q, -o[c + 41] * j, p);
  N(v, o[c + 37], q);
  ii(d, v);
  e -= o[c + 39] * Q(k, q);
  N(x, o[c + 38], q);
  Wc(g, x);
  i += o[c + 40] * Q(m, q);
  k = b[f + 6] + 3 * b[c + 25];
  b[k] = b[d];
  o[k] = o[d];
  b[k + 1] = b[d + 1];
  o[k + 1] = o[d + 1];
  o[b[f + 6] + 3 * b[c + 25] + 2] = e;
  e = b[f + 6] + 3 * b[c + 26];
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  o[b[f + 6] + 3 * b[c + 26] + 2] = i;
  g = .004999999888241291 > h - o[c + 22];
  a = d;
  return g;
}

gn.X = 1;

function U(c) {
  var f = a;
  a += 1;
  b[f] = arguments[U.length];
  hn(c, b[f]);
  a = f;
}

function di(c, f) {
  var d, e;
  d = 32 > b[c + 102499] ? 2 : 1;
  1 == d && C(Zm, 38, jn, kn);
  e = c + 102403 + 3 * b[c + 102499];
  b[e + 1] = f;
  d = 102400 < f + b[c + 102400] ? 3 : 4;
  3 == d ? (d = db(f), b[e] = d, b[e + 2] = 1) : 4 == d && (b[e] = c + b[c + 102400], b[e + 2] = 0, b[c + 102400] += f);
  b[c + 102401] += f;
  b[c + 102402] = b[c + 102402] > b[c + 102401] ? b[c + 102402] : b[c + 102401];
  b[c + 102499] += 1;
  return b[e];
}

di.X = 1;

function ln(c, f, d) {
  var e = a;
  a += 8;
  var g = e + 2, i = e + 4, h = e + 6;
  N(g, 1 - d, c + 2);
  N(i, d, c + 4);
  P(e, g, i);
  b[f] = b[e];
  o[f] = o[e];
  b[f + 1] = b[e + 1];
  o[f + 1] = o[e + 1];
  Mc(f + 2, (1 - d) * o[c + 6] + d * o[c + 7]);
  J(h, f + 2, c);
  ii(f, h);
  a = e;
}

function mn(c, f) {
  var d = a;
  a += 90;
  var e, g, i = d + 9, h, j, k, l, m = d + 18, n = d + 26, p = d + 49, u = d + 53, s = d + 57, q = d + 63, v, x, w, y = d + 88, z = d + 89, B, E, D, H, I, M, G;
  b[nn] += 1;
  b[c] = 0;
  o[c + 1] = o[f + 32];
  g = f + 7;
  v = e = f + 14;
  x = e + 9;
  for (w = d; v < x; v++, w++) b[w] = b[v], o[w] = o[v];
  v = e = f + 23;
  x = e + 9;
  for (w = i; v < x; v++, w++) b[w] = b[v], o[w] = o[v];
  on(d);
  on(i);
  h = o[f + 32];
  j = .004999999888241291 > o[f + 6] + o[g + 6] - .014999999664723873 ? .004999999888241291 : o[f + 6] + o[g + 6] - .014999999664723873;
  e = .0012499999720603228 < j ? 2 : 1;
  1 == e && C(pn, 280, qn, rn);
  l = k = 0;
  b[m + 1] = 0;
  dh(n);
  dh(n + 7);
  v = f;
  x = f + 7;
  for (w = n; v < x; v++, w++) b[w] = b[v], o[w] = o[v];
  v = x = f + 7;
  x += 7;
  for (w = n + 7; v < x; v++, w++) b[w] = b[v], o[w] = o[v];
  b[n + 22] = 0;
  for (var T = n + 14, R = n + 18, L = s + 4, S = s + 4; ; ) {
    ln(d, p, k);
    ln(i, u, k);
    b[T] = b[p];
    o[T] = o[p];
    b[T + 1] = b[p + 1];
    o[T + 1] = o[p + 1];
    b[T + 2] = b[p + 2];
    o[T + 2] = o[p + 2];
    b[T + 3] = b[p + 3];
    o[T + 3] = o[p + 3];
    b[R] = b[u];
    o[R] = o[u];
    b[R + 1] = b[u + 1];
    o[R + 1] = o[u + 1];
    b[R + 2] = b[u + 2];
    o[R + 2] = o[u + 2];
    b[R + 3] = b[u + 3];
    o[R + 3] = o[u + 3];
    yh(s, m, n);
    if (0 >= o[L]) {
      e = 4;
      break;
    }
    if (o[S] < j + .0012499999720603228) {
      e = 6;
      break;
    }
    sn(q, m, f, d, g, i, k);
    v = 0;
    x = h;
    for (w = 0; ; ) {
      B = tn(q, y, z, x);
      if (B > j + .0012499999720603228) {
        e = 9;
        break;
      }
      if (B > j - .0012499999720603228) {
        e = 11;
        break;
      }
      E = un(q, b[y], b[z], k);
      if (E < j - .0012499999720603228) {
        e = 13;
        break;
      }
      if (E <= j + .0012499999720603228) {
        e = 15;
        break;
      }
      D = 0;
      H = k;
      for (I = x; ; ) {
        e = 0 != (D & 1) ? 18 : 19;
        18 == e ? M = H + (j - E) * (I - H) / (B - E) : 19 == e && (M = .5 * (H + I));
        G = un(q, b[y], b[z], M);
        if (.0012499999720603228 > ch(G - j)) {
          e = 21;
          break;
        }
        e = G > j ? 23 : 24;
        23 == e ? (H = M, E = G) : 24 == e && (I = M, B = G);
        D = G = D + 1;
        b[vn] += 1;
        if (50 == G) {
          e = 26;
          break;
        }
      }
      21 == e && (x = M);
      b[wn] = b[wn] > D ? b[wn] : D;
      w = B = w + 1;
      if (8 == B) {
        e = 27;
        break;
      }
    }
    9 == e ? (b[c] = 4, o[c + 1] = h, v = 1) : 11 == e ? k = x : 13 == e ? (b[c] = 1, o[c + 1] = k, v = 1) : 15 == e && (b[c] = 3, o[c + 1] = k, v = 1);
    l += 1;
    b[xn] += 1;
    if (v & 1) {
      e = 30;
      break;
    }
    if (20 == l) {
      e = 29;
      break;
    }
  }
  4 == e ? (b[c] = 2, o[c + 1] = 0) : 6 == e ? (b[c] = 3, o[c + 1] = k) : 29 == e && (b[c] = 1, o[c + 1] = k);
  b[yn] = b[yn] > l ? b[yn] : l;
  a = d;
}

mn.X = 1;

function on(c) {
  var f;
  f = 6.2831854820251465 * zn(o[c + 6] / 6.2831854820251465);
  o[c + 6] -= f;
  o[c + 7] -= f;
}

function sn(c, f, d, e, g, i, h) {
  var j = a;
  a += 66;
  var k, l, m = j + 4, n = j + 8, p = j + 10, u = j + 12, s = j + 14, q = j + 16, v = j + 18, x = j + 20, w = j + 22, y = j + 24, z = j + 26, B = j + 28, E = j + 30, D = j + 32, H = j + 34, I = j + 36, M = j + 38, G = j + 40, T = j + 42, R = j + 44, L = j + 46, S = j + 48, F = j + 50, X = j + 52, Z = j + 54, V = j + 56, aa = j + 58, ja = j + 60, Y = j + 62, W = j + 64;
  b[c] = d;
  b[c + 1] = g;
  l = b[f + 1];
  1 == (0 < l & 3 > l ? 2 : 1) && C(pn, 50, An, Bn);
  for (var $ = e, e = e + 9, ga = c + 2; $ < e; $++, ga++) b[ga] = b[$], o[ga] = o[$];
  $ = i;
  e = i + 9;
  for (ga = c + 11; $ < e; $++, ga++) b[ga] = b[$], o[ga] = o[$];
  ln(c + 2, j, h);
  ln(c + 11, m, h);
  i = 1 == l ? 3 : 4;
  if (3 == i) b[c + 20] = 0, G = Mi(b[c], b[f + 2]), b[n] = b[G], o[n] = o[G], b[n + 1] = b[G + 1], o[n + 1] = o[G + 1], f = Mi(b[c + 1], b[f + 5]), b[p] = b[f], o[p] = o[f], b[p + 1] = b[f + 1], o[p + 1] = o[f + 1], Zc(u, j, n), Zc(s, m, p), m = c + 23, K(q, s, u), b[m] = b[q], o[m] = o[q], b[m + 1] = b[q + 1], o[m + 1] = o[q + 1], k = c = Cg(c + 23); else if (4 == i) if (u = c + 20, i = b[f + 2] == b[f + 3] ? 5 : 8, 5 == i) {
    b[u] = 2;
    W = Mi(g, b[f + 5]);
    b[v] = b[W];
    o[v] = o[W];
    b[v + 1] = b[W + 1];
    o[v + 1] = o[W + 1];
    W = Mi(g, b[f + 6]);
    b[x] = b[W];
    o[x] = o[W];
    b[x + 1] = b[W + 1];
    o[x + 1] = o[W + 1];
    W = c + 23;
    K(y, x, v);
    Wg(w, y);
    b[W] = b[w];
    o[W] = o[w];
    b[W + 1] = b[w + 1];
    o[W + 1] = o[w + 1];
    Cg(c + 23);
    J(z, m + 2, c + 23);
    W = c + 21;
    P(E, v, x);
    N(B, .5, E);
    b[W] = b[B];
    o[W] = o[B];
    b[W + 1] = b[B + 1];
    o[W + 1] = o[B + 1];
    Zc(D, m, c + 21);
    m = Mi(d, b[f + 2]);
    b[H] = b[m];
    o[H] = o[m];
    b[H + 1] = b[m + 1];
    o[H + 1] = o[m + 1];
    Zc(I, j, H);
    K(M, I, D);
    m = O(M, z);
    if (6 == (0 > m ? 6 : 7)) f = c + 23, Pg(G, c + 23), b[f] = b[G], o[f] = o[G], b[f + 1] = b[G + 1], o[f + 1] = o[G + 1], m = -m;
    k = m;
  } else if (8 == i) {
    b[u] = 1;
    G = Mi(b[c], b[f + 2]);
    b[T] = b[G];
    o[T] = o[G];
    b[T + 1] = b[G + 1];
    o[T + 1] = o[G + 1];
    G = Mi(b[c], b[f + 3]);
    b[R] = b[G];
    o[R] = o[G];
    b[R + 1] = b[G + 1];
    o[R + 1] = o[G + 1];
    G = c + 23;
    K(S, R, T);
    Wg(L, S);
    b[G] = b[L];
    o[G] = o[L];
    b[G + 1] = b[L + 1];
    o[G + 1] = o[L + 1];
    Cg(c + 23);
    J(F, j + 2, c + 23);
    G = c + 21;
    P(Z, T, R);
    N(X, .5, Z);
    b[G] = b[X];
    o[G] = o[X];
    b[G + 1] = b[X + 1];
    o[G + 1] = o[X + 1];
    Zc(V, j, c + 21);
    f = Mi(b[c + 1], b[f + 5]);
    b[aa] = b[f];
    o[aa] = o[f];
    b[aa + 1] = b[f + 1];
    o[aa + 1] = o[f + 1];
    Zc(ja, m, aa);
    K(Y, ja, V);
    m = O(Y, F);
    if (9 == (0 > m ? 9 : 10)) f = c + 23, Pg(W, c + 23), b[f] = b[W], o[f] = o[W], b[f + 1] = b[W + 1], o[f + 1] = o[W + 1], m = -m;
    k = m;
  }
  a = j;
  return k;
}

sn.X = 1;

function tn(c, f, d, e) {
  var g = a;
  a += 52;
  var i, h = g + 4, j = g + 8, k = g + 10, l = g + 12, m = g + 14, n = g + 16, p = g + 18, u = g + 20, s = g + 22, q = g + 24, v = g + 26, x = g + 28, w = g + 30, y = g + 32, z = g + 34, B = g + 36, E = g + 38, D = g + 40, H = g + 42, I = g + 44, M = g + 46, G = g + 48, T = g + 50;
  ln(c + 2, g, e);
  ln(c + 11, h, e);
  e = b[c + 20];
  e = 0 == e ? 1 : 1 == e ? 2 : 2 == e ? 3 : 4;
  4 == e ? (C(pn, 183, Cn, Bi), b[f] = -1, b[d] = -1, i = 0) : 1 == e ? (Og(j, g + 2, c + 23), q = h + 2, Pg(l, c + 23), Og(k, q, l), b[f] = Li(b[c], j), b[d] = Li(b[c + 1], k), f = Mi(b[c], b[f]), b[m] = b[f], o[m] = o[f], b[m + 1] = b[f + 1], o[m + 1] = o[f + 1], d = Mi(b[c + 1], b[d]), b[n] = b[d], o[n] = o[d], b[n + 1] = b[d + 1], o[n + 1] = o[d + 1], Zc(p, g, m), Zc(u, h, n), K(s, u, p), i = c = O(s, c + 23)) : 2 == e ? (J(q, g + 2, c + 23), Zc(v, g, c + 21), m = h + 2, Pg(w, q), Og(x, m, w), b[f] = -1, b[d] = Li(b[c + 1], x), c = Mi(b[c + 1], b[d]), b[y] = b[c], o[y] = o[c], b[y + 1] = b[c + 1], o[y + 1] = o[c + 1], Zc(z, h, y), K(B, z, v), i = c = O(B, q)) : 3 == e && (J(E, h + 2, c + 23), Zc(D, h, c + 21), h = g + 2, Pg(I, E), Og(H, h, I), b[d] = -1, b[f] = Li(b[c], H), c = Mi(b[c], b[f]), b[M] = b[c], o[M] = o[c], b[M + 1] = b[c + 1], o[M + 1] = o[c + 1], Zc(G, g, M), K(T, G, D), i = c = O(T, E));
  a = g;
  return i;
}

tn.X = 1;

function Dn(c, f) {
  Yi(c, f);
  b[c] = En + 2;
  var d = c + 21, e = f + 5;
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  d = c + 23;
  e = f + 7;
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  o[c + 25] = o[f + 9];
  o[c + 18] = o[f + 10];
  o[c + 19] = o[f + 11];
  Yl(c + 27);
}

Dn.X = 1;

function un(c, f, d, e) {
  var g = a;
  a += 52;
  var i, h = g + 4, j = g + 8, k = g + 10, l = g + 12, m = g + 14, n = g + 16, p = g + 18, u = g + 20, s = g + 22, q = g + 24, v = g + 26, x = g + 28, w = g + 30, y = g + 32, z = g + 34, B = g + 36, E = g + 38, D = g + 40, H = g + 42, I = g + 44, M = g + 46, G = g + 48, T = g + 50;
  ln(c + 2, g, e);
  ln(c + 11, h, e);
  e = b[c + 20];
  e = 0 == e ? 1 : 1 == e ? 2 : 2 == e ? 3 : 4;
  4 == e ? (C(pn, 242, Fn, Bi), i = 0) : 1 == e ? (Og(j, g + 2, c + 23), q = h + 2, Pg(l, c + 23), Og(k, q, l), f = Mi(b[c], f), b[m] = b[f], o[m] = o[f], b[m + 1] = b[f + 1], o[m + 1] = o[f + 1], d = Mi(b[c + 1], d), b[n] = b[d], o[n] = o[d], b[n + 1] = b[d + 1], o[n + 1] = o[d + 1], Zc(p, g, m), Zc(u, h, n), K(s, u, p), i = c = O(s, c + 23)) : 2 == e ? (J(q, g + 2, c + 23), Zc(v, g, c + 21), m = h + 2, Pg(w, q), Og(x, m, w), c = Mi(b[c + 1], d), b[y] = b[c], o[y] = o[c], b[y + 1] = b[c + 1], o[y + 1] = o[c + 1], Zc(z, h, y), K(B, z, v), i = c = O(B, q)) : 3 == e && (J(E, h + 2, c + 23), Zc(D, h, c + 21), h = g + 2, Pg(I, E), Og(H, h, I), c = Mi(b[c], f), b[M] = b[c], o[M] = o[c], b[M + 1] = b[c + 1], o[M + 1] = o[c + 1], Zc(G, g, M), K(T, G, D), i = c = O(T, E));
  a = g;
  return i;
}

un.X = 1;

function Mk(c) {
  var f = a;
  a += 2;
  Gn(f);
  b[c] = b[f];
  b[c + 1] = Math.floor(.0010000000474974513 * b[f + 1]);
  a = f;
}

function Nk(c) {
  var f = a;
  a += 2;
  Gn(f);
  c = 1e3 * (b[f] - b[c]) + .0010000000474974513 * b[f + 1] - b[c + 1];
  a = f;
  return c;
}

function Hn(c, f) {
  var d = a;
  a += 35;
  var e, g, i = d + 2, h, j = d + 4, k, l = d + 6, m = d + 8, n = d + 10;
  e = d + 12;
  var p = d + 14, u = d + 16, s = d + 18, q = d + 20, v, x = d + 29, w = d + 31, y = d + 33;
  b[c + 30] = b[b[c + 12] + 2];
  b[c + 31] = b[b[c + 13] + 2];
  h = c + 36;
  g = b[c + 12] + 7;
  b[h] = b[g];
  o[h] = o[g];
  b[h + 1] = b[g + 1];
  o[h + 1] = o[g + 1];
  h = c + 38;
  g = b[c + 13] + 7;
  b[h] = b[g];
  o[h] = o[g];
  b[h + 1] = b[g + 1];
  o[h + 1] = o[g + 1];
  o[c + 40] = o[b[c + 12] + 30];
  o[c + 41] = o[b[c + 13] + 30];
  o[c + 42] = o[b[c + 12] + 32];
  o[c + 43] = o[b[c + 13] + 32];
  h = b[f + 6] + 3 * b[c + 30];
  b[d] = b[h];
  o[d] = o[h];
  b[d + 1] = b[h + 1];
  o[d + 1] = o[h + 1];
  g = o[b[f + 6] + 3 * b[c + 30] + 2];
  h = b[f + 7] + 3 * b[c + 30];
  b[i] = b[h];
  o[i] = o[h];
  b[i + 1] = b[h + 1];
  o[i + 1] = o[h + 1];
  h = o[b[f + 7] + 3 * b[c + 30] + 2];
  k = b[f + 6] + 3 * b[c + 31];
  b[j] = b[k];
  o[j] = o[k];
  b[j + 1] = b[k + 1];
  o[j + 1] = o[k + 1];
  k = o[b[f + 6] + 3 * b[c + 31] + 2];
  j = b[f + 7] + 3 * b[c + 31];
  b[l] = b[j];
  o[l] = o[j];
  b[l + 1] = b[j + 1];
  o[l + 1] = o[j + 1];
  j = o[b[f + 7] + 3 * b[c + 31] + 2];
  qj(m, g);
  qj(n, k);
  var z = c + 32;
  K(p, c + 21, c + 36);
  J(e, m, p);
  b[z] = b[e];
  o[z] = o[e];
  b[z + 1] = b[e + 1];
  o[z + 1] = o[e + 1];
  m = c + 34;
  K(s, c + 23, c + 38);
  J(u, n, s);
  b[m] = b[u];
  o[m] = o[u];
  b[m + 1] = b[u + 1];
  o[m + 1] = o[u + 1];
  n = o[c + 40];
  u = o[c + 41];
  s = o[c + 42];
  m = o[c + 43];
  o[q] = n + u + o[c + 33] * o[c + 33] * s + o[c + 35] * o[c + 35] * m;
  o[q + 3] = -o[c + 33] * o[c + 32] * s - o[c + 35] * o[c + 34] * m;
  o[q + 6] = -o[c + 33] * s - o[c + 35] * m;
  o[q + 1] = o[q + 3];
  o[q + 4] = n + u + o[c + 32] * o[c + 32] * s + o[c + 34] * o[c + 34] * m;
  o[q + 7] = o[c + 32] * s + o[c + 34] * m;
  o[q + 2] = o[q + 6];
  o[q + 5] = o[q + 7];
  o[q + 8] = s + m;
  e = 0 < o[c + 18] ? 1 : 8;
  if (1 == e) {
    pl(q, c + 44);
    q = s + m;
    0 < q ? e = 2 : (v = 0, e = 3);
    2 == e && (v = 1 / q);
    e = v;
    v = k - g - o[c + 25];
    k = 6.2831854820251465 * o[c + 18];
    g = 2 * e * o[c + 19] * k;
    k *= e * k;
    p = o[f];
    o[c + 26] = p * (g + p * k);
    if (0 != o[c + 26]) e = 4; else {
      var B = 0;
      e = 5;
    }
    4 == e && (B = 1 / o[c + 26]);
    o[c + 26] = B;
    o[c + 20] = v * p * k * o[c + 26];
    B = q + o[c + 26];
    if (0 != B) e = 6; else {
      var E = 0;
      e = 7;
    }
    6 == e && (E = 1 / B);
    o[c + 52] = E;
  } else 8 == e && (rl(q, c + 44), o[c + 26] = 0, o[c + 20] = 0);
  E = c + 27;
  e = b[f + 5] & 1 ? 10 : 11;
  10 == e ? ($l(E, o[f + 2]), Xc(x, o[c + 27], o[c + 28]), N(w, n, x), ii(i, w), h -= s * (Q(c + 32, x) + o[c + 29]), N(y, u, x), Wc(l, y), j += m * (Q(c + 34, x) + o[c + 29])) : 11 == e && Yl(E);
  x = b[f + 7] + 3 * b[c + 30];
  b[x] = b[i];
  o[x] = o[i];
  b[x + 1] = b[i + 1];
  o[x + 1] = o[i + 1];
  o[b[f + 7] + 3 * b[c + 30] + 2] = h;
  i = b[f + 7] + 3 * b[c + 31];
  b[i] = b[l];
  o[i] = o[l];
  b[i + 1] = b[l + 1];
  o[i + 1] = o[l + 1];
  o[b[f + 7] + 3 * b[c + 31] + 2] = j;
  a = d;
}

Hn.X = 1;

function In(c) {
  var f, d;
  f = b[b[c + 12] + 2];
  d = b[b[c + 13] + 2];
  U(Jn, A(1, "i32", r));
  U(gj, A([ f ], "i32", r));
  U(hj, A([ d ], "i32", r));
  U(ij, A([ b[c + 16] & 1 ], "i32", r));
  U(jj, A([ o[c + 21], o[c + 22] ], "double", r));
  U(kj, A([ o[c + 23], o[c + 24] ], "double", r));
  U(mm, A([ o[c + 25] ], "double", r));
  U(mj, A([ o[c + 18] ], "double", r));
  U(nj, A([ o[c + 19] ], "double", r));
  U(oj, A([ b[c + 14] ], "i32", r));
}

In.X = 1;

function Kn(c, f, d) {
  nl(c, o[f] + o[d], o[f + 1] + o[d + 1], o[f + 2] + o[d + 2]);
}

function Ln(c, f, d) {
  nl(c, f * o[d], f * o[d + 1], f * o[d + 2]);
}

function Mn(c, f) {
  var d = a;
  a += 49;
  var e, g, i = d + 2, h, j, k, l, m, n, p = d + 4, u = d + 6, s = d + 8, q = d + 10, v = d + 12, x = d + 14, w = d + 16, y = d + 18, z = d + 20, B = d + 22, E = d + 24, D = d + 26, H = d + 28, I = d + 30, M = d + 32;
  n = d + 34;
  var G = d + 37, T = d + 40, R = d + 43, L = d + 45, S = d + 47;
  g = b[f + 7] + 3 * b[c + 30];
  b[d] = b[g];
  o[d] = o[g];
  b[d + 1] = b[g + 1];
  o[d + 1] = o[g + 1];
  g = o[b[f + 7] + 3 * b[c + 30] + 2];
  h = b[f + 7] + 3 * b[c + 31];
  b[i] = b[h];
  o[i] = o[h];
  b[i + 1] = b[h + 1];
  o[i + 1] = o[h + 1];
  h = o[b[f + 7] + 3 * b[c + 31] + 2];
  j = o[c + 40];
  k = o[c + 41];
  l = o[c + 42];
  m = o[c + 43];
  var F = h;
  e = 0 < o[c + 18] ? 1 : 2;
  1 == e ? (n = -o[c + 52] * (F - g + o[c + 20] + o[c + 26] * o[c + 29]), o[c + 29] += n, g -= l * n, h += m * n, $c(q, h, c + 34), P(s, i, q), K(u, s, d), $c(v, g, c + 32), K(p, u, v), fm(w, c + 44, p), Pg(x, w), o[c + 27] += o[x], o[c + 28] += o[x + 1], b[y] = b[x], o[y] = o[x], b[y + 1] = b[x + 1], o[y + 1] = o[x + 1], N(z, j, y), ii(d, z), g -= l * Q(c + 32, y), N(B, k, y), Wc(i, B), h += m * Q(c + 34, y)) : 2 == e && ($c(I, F, c + 34), P(H, i, I), K(D, H, d), $c(M, g, c + 32), K(E, D, M), nl(n, o[E], o[E + 1], h - g), p = c + 44, u = a, a += 12, s = u + 3, q = u + 6, v = u + 9, Ln(s, o[n], p), Ln(q, o[n + 1], p + 3), Kn(u, s, q), Ln(v, o[n + 2], p + 6), Kn(T, u, v), a = u, dm(G, T), em(c + 27, G), Xc(R, o[G], o[G + 1]), N(L, j, R), ii(d, L), g -= l * (Q(c + 32, R) + o[G + 2]), N(S, k, R), Wc(i, S), h += m * (Q(c + 34, R) + o[G + 2]));
  n = b[f + 7] + 3 * b[c + 30];
  b[n] = b[d];
  o[n] = o[d];
  b[n + 1] = b[d + 1];
  o[n + 1] = o[d + 1];
  o[b[f + 7] + 3 * b[c + 30] + 2] = g;
  g = b[f + 7] + 3 * b[c + 31];
  b[g] = b[i];
  o[g] = o[i];
  b[g + 1] = b[i + 1];
  o[g + 1] = o[i + 1];
  o[b[f + 7] + 3 * b[c + 31] + 2] = h;
  a = d;
}

Mn.X = 1;

function Nn(c, f) {
  var d = a;
  a += 60;
  var e, g, i = d + 2, h;
  e = d + 4;
  var j = d + 6, k, l, m, n, p = d + 8, u = d + 10, s = d + 12, q = d + 14, v, x, w = d + 16, y = d + 25, z = d + 27, B = d + 29, E = d + 31, D = d + 33, H = d + 35, I = d + 37, M = d + 39, G = d + 41, T = d + 43, R = d + 45, L = d + 48, S = d + 51, F = d + 54, X = d + 56, Z = d + 58;
  g = b[f + 6] + 3 * b[c + 30];
  b[d] = b[g];
  o[d] = o[g];
  b[d + 1] = b[g + 1];
  o[d + 1] = o[g + 1];
  g = o[b[f + 6] + 3 * b[c + 30] + 2];
  h = b[f + 6] + 3 * b[c + 31];
  b[i] = b[h];
  o[i] = o[h];
  b[i + 1] = b[h + 1];
  o[i + 1] = o[h + 1];
  h = o[b[f + 6] + 3 * b[c + 31] + 2];
  qj(e, g);
  qj(j, h);
  k = o[c + 40];
  l = o[c + 41];
  m = o[c + 42];
  n = o[c + 43];
  K(u, c + 21, c + 36);
  J(p, e, u);
  K(q, c + 23, c + 38);
  J(s, j, q);
  o[w] = k + l + o[p + 1] * o[p + 1] * m + o[s + 1] * o[s + 1] * n;
  o[w + 3] = -o[p + 1] * o[p] * m - o[s + 1] * o[s] * n;
  o[w + 6] = -o[p + 1] * m - o[s + 1] * n;
  o[w + 1] = o[w + 3];
  o[w + 4] = k + l + o[p] * o[p] * m + o[s] * o[s] * n;
  o[w + 7] = o[p] * m + o[s] * n;
  o[w + 2] = o[w + 6];
  o[w + 5] = o[w + 7];
  o[w + 8] = m + n;
  e = 0 < o[c + 18] ? 1 : 2;
  1 == e ? (P(B, i, s), K(z, B, d), K(y, z, p), v = Dg(y), x = 0, ol(D, w, y), Pg(E, D), N(H, k, E), ii(d, H), g -= m * Q(p, E), N(I, l, E), Wc(i, I), h += n * Q(s, E)) : 2 == e && (P(T, i, s), K(G, T, d), K(M, G, p), y = h - g - o[c + 25], v = Dg(M), x = ch(y), nl(R, o[M], o[M + 1], y), ql(S, w, R), dm(L, S), Xc(F, o[L], o[L + 1]), N(X, k, F), ii(d, X), g -= m * (Q(p, F) + o[L + 2]), N(Z, l, F), Wc(i, Z), h += n * (Q(s, F) + o[L + 2]));
  p = b[f + 6] + 3 * b[c + 30];
  b[p] = b[d];
  o[p] = o[d];
  b[p + 1] = b[d + 1];
  o[p + 1] = o[d + 1];
  o[b[f + 6] + 3 * b[c + 30] + 2] = g;
  g = b[f + 6] + 3 * b[c + 31];
  b[g] = b[i];
  o[g] = o[i];
  b[g + 1] = b[i + 1];
  o[g + 1] = o[i + 1];
  o[b[f + 6] + 3 * b[c + 31] + 2] = h;
  if (.004999999888241291 >= v) e = 4; else {
    var V = 0;
    e = 5;
  }
  4 == e && (V = .03490658849477768 >= x);
  a = d;
  return V;
}

Nn.X = 1;

function On(c, f) {
  var d = a;
  a += 2;
  Yi(c, f);
  b[c] = Pn + 2;
  var e = c + 20, g = f + 5;
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  e = c + 22;
  g = f + 7;
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  e = c + 24;
  g = f + 9;
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  e = c + 26;
  $c(d, 1, c + 24);
  b[e] = b[d];
  o[e] = o[d];
  b[e + 1] = b[d + 1];
  o[e + 1] = o[d + 1];
  o[c + 52] = 0;
  o[c + 28] = 0;
  o[c + 53] = 0;
  o[c + 29] = 0;
  o[c + 54] = 0;
  o[c + 30] = 0;
  o[c + 31] = o[f + 12];
  o[c + 32] = o[f + 13];
  b[c + 33] = b[f + 11] & 1;
  o[c + 18] = o[f + 14];
  o[c + 19] = o[f + 15];
  o[c + 55] = 0;
  o[c + 56] = 0;
  dc(c + 44);
  dc(c + 46);
  a = d;
}

On.X = 1;

function Qn(c, f) {
  var d = a;
  a += 44;
  var e, g, i, h, j, k, l = d + 2, m, n = d + 4, p, u = d + 6, s, q = d + 8, v = d + 10, x = d + 12, w = d + 14, y = d + 16, z = d + 18, B = d + 20, E = d + 22, D = d + 24;
  e = d + 26;
  var H = d + 28, I = d + 30, M = d + 32, G = d + 34, T = d + 36, R = d + 38, L = d + 40, S = d + 42;
  b[c + 34] = b[b[c + 12] + 2];
  b[c + 35] = b[b[c + 13] + 2];
  m = c + 36;
  h = b[c + 12] + 7;
  b[m] = b[h];
  o[m] = o[h];
  b[m + 1] = b[h + 1];
  o[m + 1] = o[h + 1];
  m = c + 38;
  h = b[c + 13] + 7;
  b[m] = b[h];
  o[m] = o[h];
  b[m + 1] = b[h + 1];
  o[m + 1] = o[h + 1];
  o[c + 40] = o[b[c + 12] + 30];
  o[c + 41] = o[b[c + 13] + 30];
  o[c + 42] = o[b[c + 12] + 32];
  o[c + 43] = o[b[c + 13] + 32];
  g = o[c + 40];
  i = o[c + 41];
  h = o[c + 42];
  j = o[c + 43];
  m = b[f + 6] + 3 * b[c + 34];
  b[d] = b[m];
  o[d] = o[m];
  b[d + 1] = b[m + 1];
  o[d + 1] = o[m + 1];
  k = o[b[f + 6] + 3 * b[c + 34] + 2];
  m = b[f + 7] + 3 * b[c + 34];
  b[l] = b[m];
  o[l] = o[m];
  b[l + 1] = b[m + 1];
  o[l + 1] = o[m + 1];
  m = o[b[f + 7] + 3 * b[c + 34] + 2];
  s = b[f + 6] + 3 * b[c + 35];
  b[n] = b[s];
  o[n] = o[s];
  b[n + 1] = b[s + 1];
  o[n + 1] = o[s + 1];
  p = o[b[f + 6] + 3 * b[c + 35] + 2];
  s = b[f + 7] + 3 * b[c + 35];
  b[u] = b[s];
  o[u] = o[s];
  b[u + 1] = b[s + 1];
  o[u + 1] = o[s + 1];
  s = o[b[f + 7] + 3 * b[c + 35] + 2];
  qj(q, k);
  qj(v, p);
  K(w, c + 20, c + 36);
  J(x, q, w);
  K(z, c + 22, c + 38);
  J(y, v, z);
  P(D, n, y);
  K(E, D, d);
  K(B, E, x);
  n = c + 46;
  J(e, q, c + 26);
  b[n] = b[e];
  o[n] = o[e];
  b[n + 1] = b[e + 1];
  o[n + 1] = o[e + 1];
  P(H, B, x);
  o[c + 50] = Q(H, c + 46);
  o[c + 51] = Q(y, c + 46);
  o[c + 52] = g + i + h * o[c + 50] * o[c + 50] + j * o[c + 51] * o[c + 51];
  e = 0 < o[c + 52] ? 1 : 2;
  1 == e && (o[c + 52] = 1 / o[c + 52]);
  o[c + 54] = 0;
  o[c + 55] = 0;
  o[c + 56] = 0;
  e = 0 < o[c + 18] ? 3 : 8;
  3 == e ? (e = c + 44, J(I, q, c + 24), b[e] = b[I], o[e] = o[I], b[e + 1] = b[I + 1], o[e + 1] = o[I + 1], P(M, B, x), o[c + 48] = Q(M, c + 44), o[c + 49] = Q(y, c + 44), q = g + i + h * o[c + 48] * o[c + 48] + j * o[c + 49] * o[c + 49], 0 < q && (o[c + 54] = 1 / q, B = O(B, c + 44), y = 6.2831854820251465 * o[c + 18], x = 2 * o[c + 54] * o[c + 19] * y, y *= o[c + 54] * y, I = o[f], o[c + 56] = I * (x + I * y), e = 0 < o[c + 56] ? 5 : 6, 5 == e && (o[c + 56] = 1 / o[c + 56]), o[c + 55] = B * I * y * o[c + 56], o[c + 54] = q + o[c + 56], 0 < o[c + 54] && (o[c + 54] = 1 / o[c + 54]))) : 8 == e && (o[c + 30] = 0);
  e = b[c + 33] & 1 ? 10 : 12;
  10 == e ? (o[c + 53] = h + j, 0 < o[c + 53] && (o[c + 53] = 1 / o[c + 53])) : 12 == e && (o[c + 53] = 0, o[c + 29] = 0);
  e = b[f + 5] & 1 ? 14 : 15;
  14 == e ? (o[c + 28] *= o[f + 2], o[c + 30] *= o[f + 2], o[c + 29] *= o[f + 2], N(T, o[c + 28], c + 46), N(R, o[c + 30], c + 44), P(G, T, R), T = o[c + 28] * o[c + 50] + o[c + 30] * o[c + 48] + o[c + 29], R = o[c + 28] * o[c + 51] + o[c + 30] * o[c + 49] + o[c + 29], N(L, o[c + 40], G), ii(l, L), m -= o[c + 42] * T, N(S, o[c + 41], G), Wc(u, S), s += o[c + 43] * R) : 15 == e && (o[c + 28] = 0, o[c + 30] = 0, o[c + 29] = 0);
  G = b[f + 7] + 3 * b[c + 34];
  b[G] = b[l];
  o[G] = o[l];
  b[G + 1] = b[l + 1];
  o[G + 1] = o[l + 1];
  o[b[f + 7] + 3 * b[c + 34] + 2] = m;
  l = b[f + 7] + 3 * b[c + 35];
  b[l] = b[u];
  o[l] = o[u];
  b[l + 1] = b[u + 1];
  o[l + 1] = o[u + 1];
  o[b[f + 7] + 3 * b[c + 35] + 2] = s;
  a = d;
}

Qn.X = 1;

function Rn(c, f) {
  var d = a;
  a += 20;
  var e, g, i, h, j, k = d + 2, l, m = d + 4, n, p = d + 6, u = d + 8, s = d + 10, q = d + 12, v = d + 14, x = d + 16, w = d + 18;
  e = o[c + 40];
  g = o[c + 41];
  i = o[c + 42];
  h = o[c + 43];
  j = b[f + 7] + 3 * b[c + 34];
  b[d] = b[j];
  o[d] = o[j];
  b[d + 1] = b[j + 1];
  o[d + 1] = o[j + 1];
  j = o[b[f + 7] + 3 * b[c + 34] + 2];
  l = b[f + 7] + 3 * b[c + 35];
  b[k] = b[l];
  o[k] = o[l];
  b[k + 1] = b[l + 1];
  o[k + 1] = o[l + 1];
  l = o[b[f + 7] + 3 * b[c + 35] + 2];
  n = c + 44;
  K(m, k, d);
  n = -o[c + 54] * (O(n, m) + o[c + 49] * l - o[c + 48] * j + o[c + 55] + o[c + 56] * o[c + 30]);
  o[c + 30] += n;
  N(p, n, c + 44);
  m = n * o[c + 48];
  n *= o[c + 49];
  N(u, e, p);
  ii(d, u);
  j -= i * m;
  N(s, g, p);
  Wc(k, s);
  l += h * n;
  p = -o[c + 53] * (l - j - o[c + 32]);
  u = o[c + 29];
  s = o[f] * o[c + 31];
  o[c + 29] = ri(o[c + 29] + p, -s, s);
  p = o[c + 29] - u;
  j -= i * p;
  l += h * p;
  p = c + 46;
  K(q, k, d);
  q = -o[c + 52] * (O(p, q) + o[c + 51] * l - o[c + 50] * j);
  o[c + 28] += q;
  N(v, q, c + 46);
  p = q * o[c + 50];
  q *= o[c + 51];
  N(x, e, v);
  ii(d, x);
  j -= i * p;
  N(w, g, v);
  Wc(k, w);
  e = b[f + 7] + 3 * b[c + 34];
  b[e] = b[d];
  o[e] = o[d];
  b[e + 1] = b[d + 1];
  o[e + 1] = o[d + 1];
  o[b[f + 7] + 3 * b[c + 34] + 2] = j;
  e = b[f + 7] + 3 * b[c + 35];
  b[e] = b[k];
  o[e] = o[k];
  b[e + 1] = b[k + 1];
  o[e + 1] = o[k + 1];
  o[b[f + 7] + 3 * b[c + 35] + 2] = l + h * q;
  a = d;
}

Rn.X = 1;

function Sn(c) {
  var f, d;
  f = b[b[c + 12] + 2];
  d = b[b[c + 13] + 2];
  U(Tn, A(1, "i32", r));
  U(gj, A([ f ], "i32", r));
  U(hj, A([ d ], "i32", r));
  U(ij, A([ b[c + 16] & 1 ], "i32", r));
  U(jj, A([ o[c + 20], o[c + 21] ], "double", r));
  U(kj, A([ o[c + 22], o[c + 23] ], "double", r));
  U(lm, A([ o[c + 24], o[c + 25] ], "double", r));
  U(qm, A([ b[c + 33] & 1 ], "i32", r));
  U(rm, A([ o[c + 32] ], "double", r));
  U(Qm, A([ o[c + 31] ], "double", r));
  U(mj, A([ o[c + 18] ], "double", r));
  U(nj, A([ o[c + 19] ], "double", r));
  U(oj, A([ b[c + 14] ], "i32", r));
}

Sn.X = 1;

function Un(c, f) {
  ec(c);
  Xm(c + 17);
  sh(c + 102518);
  b[c + 102545] = 0;
  b[c + 102546] = 0;
  b[c + 102538] = 0;
  b[c + 102539] = 0;
  b[c + 102540] = 0;
  b[c + 102541] = 0;
  b[c + 102548] = 1;
  b[c + 102549] = 1;
  b[c + 102550] = 0;
  b[c + 102551] = 1;
  b[c + 102544] = 1;
  var d = c + 102542;
  b[d] = b[f];
  o[d] = o[f];
  b[d + 1] = b[f + 1];
  o[d + 1] = o[f + 1];
  b[c + 102517] = 4;
  o[c + 102547] = 0;
  b[c + 102537] = c;
  for (var d = c + 102552, e = 0; 8 > e; e++) b[d + e] = 0, o[d + e] = 0;
}

Un.X = 1;

function Vn(c) {
  var f, d, e;
  f = b[c + 102538];
  for (d = b[c + 102538]; 0 != d; ) {
    d = b[f + 24];
    e = b[f + 25];
    for (f = b[f + 25]; 0 != f; ) {
      f = b[e + 1];
      b[e + 7] = 0;
      gk(e, c);
      e = f;
    }
    f = d;
  }
  Ym(c + 17);
}

Vn.X = 1;

function Wn(c, f) {
  var d = a;
  a += 32;
  var e, g, i = d + 2, h, j = d + 4;
  e = d + 6;
  var k = d + 8, l = d + 10, m = d + 12, n = d + 14, p = d + 16, u = d + 18, s = d + 20, q = d + 22, v = d + 24, x, w = d + 26, y = d + 28, z = d + 30;
  g = b[f + 6] + 3 * b[c + 34];
  b[d] = b[g];
  o[d] = o[g];
  b[d + 1] = b[g + 1];
  o[d + 1] = o[g + 1];
  g = o[b[f + 6] + 3 * b[c + 34] + 2];
  h = b[f + 6] + 3 * b[c + 35];
  b[i] = b[h];
  o[i] = o[h];
  b[i + 1] = b[h + 1];
  o[i + 1] = o[h + 1];
  h = o[b[f + 6] + 3 * b[c + 35] + 2];
  qj(j, g);
  qj(e, h);
  K(l, c + 20, c + 36);
  J(k, j, l);
  K(n, c + 22, c + 38);
  J(m, e, n);
  K(s, i, d);
  P(u, s, m);
  K(p, u, k);
  J(q, j, c + 26);
  P(v, p, k);
  j = Q(v, q);
  m = Q(m, q);
  p = O(p, q);
  k = o[c + 40] + o[c + 41] + o[c + 42] * o[c + 50] * o[c + 50] + o[c + 43] * o[c + 51] * o[c + 51];
  e = 0 != k ? 1 : 2;
  1 == e ? x = -p / k : 2 == e && (x = 0);
  N(w, x, q);
  q = x * j;
  x *= m;
  N(y, o[c + 40], w);
  ii(d, y);
  g -= o[c + 42] * q;
  N(z, o[c + 41], w);
  Wc(i, z);
  h += o[c + 43] * x;
  w = b[f + 6] + 3 * b[c + 34];
  b[w] = b[d];
  o[w] = o[d];
  b[w + 1] = b[d + 1];
  o[w + 1] = o[d + 1];
  o[b[f + 6] + 3 * b[c + 34] + 2] = g;
  g = b[f + 6] + 3 * b[c + 35];
  b[g] = b[i];
  o[g] = o[i];
  b[g + 1] = b[i + 1];
  o[g + 1] = o[i + 1];
  o[b[f + 6] + 3 * b[c + 35] + 2] = h;
  i = .004999999888241291 >= ch(p);
  a = d;
  return i;
}

Wn.X = 1;

function Xn(c, f) {
  var d, e, g;
  d = 0 == Pc(c) ? 2 : 1;
  1 == d && C(Yn, 109, Zn, $n);
  d = Pc(c) ? 3 : 4;
  3 == d ? e = 0 : 4 == d && (e = qc(c, 152), 0 == e ? (g = 0, d = 6) : d = 5, 5 == d && (vc(e, f, c), g = e), b[g + 23] = 0, b[g + 24] = b[c + 102538], d = 0 != b[c + 102538] ? 7 : 8, 7 == d && (b[b[c + 102538] + 23] = g), b[c + 102538] = g, b[c + 102540] += 1, e = g);
  return e;
}

Xn.X = 1;

function ao(c) {
  b[c + 7] = 0;
  b[c + 9] = 0;
  b[c + 8] = 0;
}

function bo(c, f) {
  1 == (b[c + 7] < b[c + 10] ? 2 : 1) && C(co, 54, eo, fo);
  b[f + 2] = b[c + 7];
  b[b[c + 2] + b[c + 7]] = f;
  b[c + 7] += 1;
}

function go(c, f) {
  1 == (b[c + 9] < b[c + 11] ? 2 : 1) && C(co, 62, ho, io);
  var d = b[c + 9];
  b[c + 9] = d + 1;
  b[b[c + 3] + d] = f;
}

function jo(c, f) {
  var d = a;
  a += 23;
  var e, g, i, h, j, k, l, m, n, p = d + 13, u = d + 21;
  o[c + 102555] = 0;
  o[c + 102556] = 0;
  o[c + 102557] = 0;
  Ik(d, b[c + 102540], b[c + 102534], b[c + 102541], c + 17, b[c + 102536]);
  g = b[c + 102538];
  e = 0 != b[c + 102538] ? 1 : 2;
  a : do if (1 == e) for (;;) if (b[g + 1] &= 65534, g = i = b[g + 24], 0 == i) break a; while (0);
  g = b[c + 102533];
  e = 0 != b[c + 102533] ? 3 : 4;
  a : do if (3 == e) for (;;) if (b[g + 1] &= -2, g = i = b[g + 3], 0 == i) break a; while (0);
  g = b[c + 102539];
  e = 0 != b[c + 102539] ? 5 : 6;
  a : do if (5 == e) for (;;) if (b[g + 15] = 0, g = i = b[g + 3], 0 == i) break a; while (0);
  g = b[c + 102540];
  i = di(c + 17, g << 2);
  h = b[c + 102538];
  var s = c + 102542, q = c + 102544, v = p + 3, x = c + 102555, w = p + 4, y = c + 102556, z = p + 5, B = c + 102557, E = d + 7, D = d + 2;
  for (e = b[c + 102538]; 0 != e; ) {
    e = 0 != (b[h + 1] & 1) ? 65 : 18;
    a : do if (18 == e) if (0 == Ah(h)) e = 65; else if (0 == (32 == (b[h + 1] & 32))) e = 65; else if (0 == b[h]) e = 65; else {
      ao(d);
      k = j = 0;
      j = k + 1;
      b[i + k] = h;
      b[h + 1] = (b[h + 1] | 1) & 65535;
      b : for (;;) {
        if (0 >= j) {
          e = 58;
          break;
        }
        j = e = j - 1;
        k = b[i + e];
        e = 1 == (32 == (b[k + 1] & 32)) ? 29 : 28;
        28 == e && C(Yn, 445, ko, lo);
        bo(d, k);
        Vc(k, 1);
        if (0 == b[k]) e = 25; else {
          l = b[k + 28];
          for (m = b[k + 28]; ; ) {
            if (0 == m) {
              e = 47;
              break;
            }
            m = b[l + 1];
            e = 0 != (b[m + 1] & 1) ? 46 : 36;
            36 == e && (0 == (4 == (b[m + 1] & 4)) ? e = 46 : 0 == (2 == (b[m + 1] & 2)) ? e = 46 : (e = b[b[m + 12] + 11] & 1, n = b[b[m + 13] + 11] & 1, e & 1 ? e = 46 : n & 1 ? e = 46 : (go(d, m), b[m + 1] |= 1, m = b[l], 0 != (b[m + 1] & 1) ? e = 46 : (e = j < g ? 45 : 44, 44 == e && C(Yn, 495, ko, mo), n = j, j = n + 1, b[i + n] = m, b[m + 1] = (b[m + 1] | 1) & 65535))));
            l = m = b[l + 3];
          }
          l = b[k + 27];
          for (k = b[k + 27]; ; ) {
            if (0 == k) {
              e = 25;
              continue b;
            }
            e = 1 == (b[b[l + 1] + 15] & 1) ? 57 : 50;
            50 == e && (k = b[l], 0 == (32 == (b[k + 1] & 32)) ? e = 57 : (e = d, m = b[l + 1], 1 == (b[e + 8] < b[e + 12] ? 2 : 1) && C(co, 68, no, oo), n = b[e + 8], b[e + 8] = n + 1, b[b[e + 4] + n] = m, b[b[l + 1] + 15] = 1, 0 != (b[k + 1] & 1) ? e = 57 : (e = j < g ? 56 : 55, 55 == e && C(Yn, 524, ko, mo), m = j, j = m + 1, b[i + m] = k, b[k + 1] = (b[k + 1] | 1) & 65535)));
            l = k = b[l + 3];
          }
        }
      }
      Lk(d, p, f, s, b[q] & 1);
      o[x] += o[v];
      o[y] += o[w];
      o[B] += o[z];
      for (j = 0; ; ) {
        if (j >= b[E]) break a;
        k = b[b[D] + j];
        e = 0 == b[k] ? 63 : 64;
        63 == e && (b[k + 1] &= 65534);
        j += 1;
      }
    } while (0);
    h = e = b[h + 24];
  }
  bi(c + 17, i);
  Mk(u);
  p = b[c + 102538];
  for (g = b[c + 102538]; 0 != g; ) {
    e = 0 == (b[p + 1] & 1) ? 74 : 71;
    71 == e && (0 == b[p] || Qc(p));
    p = g = b[p + 24];
  }
  p = c + 102518;
  Hh(p, p);
  u = Nk(u);
  o[c + 102558] = u;
  Gk(d);
  a = d;
}

jo.X = 1;

function po(c, f) {
  var d = a;
  a += 83;
  var e, g, i, h, j, k, l, m, n, p, u, s, q, v, x = d + 13, w = d + 46, y = d + 48, z = d + 57, B = d + 66, E = d + 68, D = d + 77;
  Ik(d, 64, 32, 0, c + 17, b[c + 102536]);
  e = b[c + 102551] & 1 ? 2 : 1;
  a : do if (2 == e) {
    g = b[c + 102538];
    e = 0 != b[c + 102538] ? 3 : 4;
    b : do if (3 == e) for (;;) {
      b[g + 1] &= 65534;
      o[g + 15] = 0;
      var H = b[g + 24];
      g = H;
      if (0 == H) {
        e = 4;
        break b;
      }
    } while (0);
    g = b[c + 102533];
    if (0 == b[c + 102533]) e = 1; else for (;;) if (b[g + 1] &= -34, b[g + 32] = 0, o[g + 33] = 1, g = H = b[g + 3], 0 == H) {
      e = 1;
      break a;
    }
  } while (0);
  g = c + 102533;
  var H = x + 7, I = x + 14, M = x + 23, G = x + 32, T = w + 1, R = c + 102536, L = B + 1, S = d + 7, F = d + 10, X = d + 9, Z = d + 11, V = c + 102536, aa = D + 1, ja = D + 2, Y = D + 4, W = D + 3, $ = D + 5, ga = d + 7, la = d + 2, fa = c + 102518, ka = c + 102550;
  a : for (;;) {
    i = 0;
    h = 1;
    j = b[g];
    for (e = b[g]; 0 != e; ) {
      e = 0 == (4 == (b[j + 1] & 4)) ? 61 : 14;
      b : do if (14 == e) if (8 < b[j + 32]) e = 61; else {
        k = 1;
        e = 0 != (b[j + 1] & 32) ? 16 : 17;
        if (16 == e) k = o[j + 33]; else if (17 == e) {
          l = b[j + 12];
          m = b[j + 13];
          if (b[l + 11] & 1) break b;
          if (b[m + 11] & 1) break b;
          n = qh(l);
          p = qh(m);
          u = b[n];
          s = b[p];
          e = 2 == u ? 28 : 26;
          26 == e && (2 == s || C(Yn, 641, qo, ro));
          if (Ah(n)) e = 30; else {
            var oa = 0;
            e = 31;
          }
          30 == e && (oa = 0 != u);
          q = oa;
          if (Ah(p)) e = 33; else {
            var ua = 0;
            e = 34;
          }
          33 == e && (ua = 0 != s);
          v = ua;
          e = 0 == (q & 1) ? 35 : 36;
          if (35 == e && 0 == (v & 1)) break b;
          if (8 == (b[n + 1] & 8)) {
            var Da = 1;
            e = 38;
          } else e = 37;
          37 == e && (Da = 2 != u);
          u = Da;
          if (8 == (b[p + 1] & 8)) {
            var Ja = 1;
            e = 40;
          } else e = 39;
          39 == e && (Ja = 2 != s);
          s = Ja;
          e = 0 == (u & 1) ? 41 : 42;
          if (41 == e && 0 == (s & 1)) break b;
          s = o[n + 15];
          u = o[p + 15];
          e = o[n + 15] < o[p + 15] ? 43 : 44;
          43 == e ? (s = u, so(n + 7, s)) : 44 == e && u < o[n + 15] && (s = o[n + 15], so(p + 7, s));
          e = 1 > s ? 48 : 47;
          47 == e && C(Yn, 676, qo, to);
          e = b[j + 14];
          u = b[j + 15];
          q = x;
          dh(q);
          dh(q + 7);
          xh(x, je(l), e);
          xh(H, je(m), u);
          l = e = n + 7;
          m = e + 9;
          for (q = I; l < m; l++, q++) b[q] = b[l], o[q] = o[l];
          l = e = p + 7;
          m = e + 9;
          for (q = M; l < m; l++, q++) b[q] = b[l], o[q] = o[l];
          o[G] = 1;
          mn(w, x);
          l = o[T];
          e = 3 == b[w] ? 56 : 57;
          56 == e ? k = 1 > s + (1 - s) * l ? s + (1 - s) * l : 1 : 57 == e && (k = 1);
          o[j + 33] = k;
          b[j + 1] |= 32;
        }
        k < h ? (i = j, h = k) : e = 61;
      } while (0);
      j = e = b[j + 3];
    }
    if (0 == i) {
      e = 64;
      break;
    }
    if (.9999988079071045 < h) {
      e = 64;
      break;
    }
    j = b[i + 12];
    e = b[i + 13];
    j = qh(j);
    k = qh(e);
    l = e = j + 7;
    m = e + 9;
    for (q = y; l < m; l++, q++) b[q] = b[l], o[q] = o[l];
    l = e = k + 7;
    m = e + 9;
    for (q = z; l < m; l++, q++) b[q] = b[l], o[q] = o[l];
    uo(j, h);
    uo(k, h);
    wh(i, b[R]);
    b[i + 1] &= -33;
    b[i + 32] += 1;
    e = 0 == (4 == (b[i + 1] & 4)) ? 75 : 73;
    do if (73 == e) if (0 == (2 == (b[i + 1] & 2))) e = 75; else {
      Vc(j, 1);
      Vc(k, 1);
      ao(d);
      bo(d, j);
      bo(d, k);
      go(d, i);
      b[j + 1] = (b[j + 1] | 1) & 65535;
      b[k + 1] = (b[k + 1] | 1) & 65535;
      b[i + 1] |= 1;
      b[B] = j;
      b[L] = k;
      for (e = i = 0; 2 > e; ) {
        p = b[B + i];
        e = 2 == b[p] ? 85 : 109;
        b : do if (85 == e) {
          n = b[p + 28];
          for (l = b[p + 28]; ; ) {
            if (0 == l) break b;
            if (b[S] == b[F]) break b;
            if (b[X] == b[Z]) break b;
            s = b[n + 1];
            e = 0 != (b[s + 1] & 1) ? 108 : 90;
            c : do if (90 == e) {
              u = b[n];
              e = 2 == b[u] ? 91 : 93;
              do if (91 == e) if (0 != (8 == (b[p + 1] & 8))) e = 93; else if (0 == (8 == (b[u + 1] & 8))) {
                e = 108;
                break c;
              } while (0);
              e = b[b[s + 12] + 11] & 1;
              l = b[b[s + 13] + 11] & 1;
              if (e & 1) e = 108; else if (l & 1) e = 108; else {
                l = e = u + 7;
                m = e + 9;
                for (q = E; l < m; l++, q++) b[q] = b[l], o[q] = o[l];
                e = 0 == (b[u + 1] & 1) ? 96 : 97;
                96 == e && uo(u, h);
                wh(s, b[V]);
                e = 0 == (4 == (b[s + 1] & 4)) ? 99 : 100;
                if (99 == e) {
                  q = u + 7;
                  l = E;
                  for (m = E + 9; l < m; l++, q++) b[q] = b[l], o[q] = o[l];
                  Jk(u);
                } else if (100 == e) if (e = 0 == (2 == (b[s + 1] & 2)) ? 102 : 103, 102 == e) {
                  q = u + 7;
                  l = E;
                  for (m = E + 9; l < m; l++, q++) b[q] = b[l], o[q] = o[l];
                  Jk(u);
                } else if (103 == e) {
                  b[s + 1] |= 1;
                  go(d, s);
                  if (0 != (b[u + 1] & 1)) {
                    e = 108;
                    break c;
                  }
                  b[u + 1] = (b[u + 1] | 1) & 65535;
                  e = 0 != b[u] ? 106 : 107;
                  106 == e && Vc(u, 1);
                  bo(d, u);
                }
              }
            } while (0);
            n = l = b[n + 3];
          }
        } while (0);
        i = e = i + 1;
      }
      o[D] = (1 - h) * o[f];
      o[aa] = 1 / o[D];
      o[ja] = 1;
      b[Y] = 20;
      b[W] = b[f + 3];
      b[$] = 0;
      Sk(d, D, b[j + 2], b[k + 2]);
      for (h = 0; h < b[ga]; ) {
        i = b[b[la] + h];
        b[i + 1] &= 65534;
        e = 2 != b[i] ? 117 : 114;
        b : do if (114 == e) if (Qc(i), j = b[i + 28], 0 == b[i + 28]) e = 117; else for (;;) if (k = b[j + 1] + 1, b[k] &= -34, j = k = b[j + 3], 0 == k) break b; while (0);
        h += 1;
      }
      Hh(fa, fa);
      if (b[ka] & 1) {
        e = 120;
        break a;
      } else {
        e = 6;
        continue a;
      }
    } while (0);
    h = i;
    i = ba;
    l = b[h + 1];
    i = 2;
    1 == i ? b[h + 1] = l | 4 : 2 == i && (b[h + 1] = l & -5);
    h = j + 7;
    l = y;
    m = y + 9;
    for (q = h; l < m; l++, q++) b[q] = b[l], o[q] = o[l];
    h = k + 7;
    l = z;
    m = z + 9;
    for (q = h; l < m; l++, q++) b[q] = b[l], o[q] = o[l];
    Jk(j);
    Jk(k);
  }
  64 == e ? b[c + 102551] = 1 : 120 == e && (b[c + 102551] = 0);
  Gk(d);
  a = d;
}

po.X = 1;

function so(c, f) {
  var d = a;
  a += 6;
  var e, g = d + 2, i = d + 4;
  1 == (1 > o[c + 8] ? 2 : 1) && C(vo, 715, wo, to);
  e = (f - o[c + 8]) / (1 - o[c + 8]);
  var h = c + 2;
  N(g, 1 - e, c + 2);
  N(i, e, c + 4);
  P(d, g, i);
  b[h] = b[d];
  o[h] = o[d];
  b[h + 1] = b[d + 1];
  o[h + 1] = o[d + 1];
  o[c + 6] = (1 - e) * o[c + 6] + e * o[c + 7];
  o[c + 8] = f;
  a = d;
}

so.X = 1;

function uo(c, f) {
  var d = a;
  a += 4;
  var e = d + 2;
  so(c + 7, f);
  var g = c + 11, i = c + 9;
  b[g] = b[i];
  o[g] = o[i];
  b[g + 1] = b[i + 1];
  o[g + 1] = o[i + 1];
  o[c + 14] = o[c + 13];
  Mc(c + 5, o[c + 14]);
  g = c + 3;
  i = c + 11;
  J(e, c + 5, c + 7);
  K(d, i, e);
  b[g] = b[d];
  o[g] = o[d];
  b[g + 1] = b[d + 1];
  o[g + 1] = o[d + 1];
  a = d;
}

function xo(c, f, d, e) {
  var g = a;
  a += 14;
  var i, h = g + 2, j = g + 8, k = g + 10, l = g + 12;
  Mk(g);
  i = 0 != (b[c + 102517] & 1) ? 1 : 2;
  1 == i && (i = c + 102518, Hh(i, i), b[c + 102517] &= -2);
  b[c + 102517] |= 2;
  o[h] = f;
  b[h + 3] = d;
  b[h + 4] = e;
  i = 0 < f ? 3 : 4;
  3 == i ? o[h + 1] = 1 / f : 4 == i && (o[h + 1] = 0);
  o[h + 2] = o[c + 102547] * f;
  b[h + 5] = b[c + 102548] & 1;
  Mk(j);
  Fh(c + 102518);
  f = Nk(j);
  o[c + 102553] = f;
  i = b[c + 102551] & 1 ? 6 : 8;
  6 == i && 0 < o[h] && (Mk(k), jo(c, h), k = Nk(k), o[c + 102554] = k);
  i = b[c + 102549] & 1 ? 9 : 11;
  9 == i && 0 < o[h] && (Mk(l), po(c, h), l = Nk(l), o[c + 102559] = l);
  i = 0 < o[h] ? 12 : 13;
  12 == i && (o[c + 102547] = o[h + 1]);
  i = 0 != (b[c + 102517] & 4) ? 14 : 15;
  if (14 == i) {
    l = b[c + 102538];
    h = 0 != b[c + 102538] ? 1 : 2;
    a : do if (1 == h) for (;;) if (dc(l + 19), o[l + 21] = 0, l = k = b[l + 24], 0 == k) break a; while (0);
  }
  b[c + 102517] &= -3;
  h = Nk(g);
  o[c + 102552] = h;
  a = g;
}

xo.X = 1;

function yo() {
  zo();
  return 0;
}

Module._main = yo;

function Ao(c) {
  b[c + 14] = 0;
  Qe(c + 1, 0, 0);
  o[c + 3] = 0;
  Qe(c + 4, 0, 0);
  o[c + 6] = 0;
  o[c + 7] = 0;
  o[c + 8] = 0;
  b[c + 9] = 1;
  b[c + 10] = 1;
  b[c + 11] = 0;
  b[c + 12] = 0;
  b[c] = 0;
  b[c + 13] = 1;
  o[c + 15] = 1;
}

function Bo(c, f, d) {
  var e, c = f + 8, f = d + 8, d = b[c + 2] == b[f + 2] ? 1 : 3;
  1 == d && (0 == b[c + 2] ? d = 3 : (e = 0 < b[c + 2], d = 6));
  if (3 == d) {
    if (0 != (b[f] & b[c + 1])) d = 4; else var g = 0, d = 5;
    4 == d && (g = 0 != (b[f + 1] & b[c]));
    e = g & 1;
  }
  return e;
}

Bo.X = 1;

function zo() {
  var c = a;
  a += 102913;
  var f = c + 2, d = c + 102562, e = c + 102578, g = c + 102591, i = c + 102593, h = c + 102595, j = c + 102633, k = c + 102635, l = c + 102637, m = c + 102639, n = c + 102641, p = c + 102657;
  Xc(c, 0, -10);
  Un(f, c);
  var u, s;
  u = 0 == (b[f + 102544] & 1) ? 4 : 1;
  a : do if (1 == u) if (b[f + 102544] = 0, 0 != (b[f + 102544] & 1)) u = 4; else if (s = b[f + 102538], 0 == b[f + 102538]) u = 4; else for (;;) {
    Vc(s, 1);
    var q = b[s + 24];
    s = q;
    if (0 == q) break a;
  } while (0);
  Ao(d);
  d = Xn(f, d);
  ke(e);
  Xc(g, -40, 0);
  Xc(i, 40, 0);
  u = e + 3;
  b[u] = b[g];
  o[u] = o[g];
  b[u + 1] = b[g + 1];
  o[u + 1] = o[g + 1];
  g = e + 5;
  b[g] = b[i];
  o[g] = o[i];
  b[g + 1] = b[i + 1];
  o[g + 1] = o[i + 1];
  b[e + 11] = 0;
  b[e + 12] = 0;
  Wd(d, e, 0);
  Wl(h);
  b[h + 37] = 4;
  Qe(h + 5, -.5, -.5);
  Qe(h + 7, .5, -.5);
  Qe(h + 9, .5, .5);
  Qe(h + 11, -.5, .5);
  Qe(h + 21, 0, -1);
  Qe(h + 23, 1, 0);
  Qe(h + 25, 0, 1);
  Qe(h + 27, -1, 0);
  dc(h + 3);
  Xc(j, -7, .75);
  Xc(l, .5625, 1);
  Xc(m, 1.125, 0);
  e = 0;
  i = n + 1;
  for (g = 0; 40 > g; ) {
    b[k] = b[j];
    o[k] = o[j];
    b[k + 1] = b[j + 1];
    o[k + 1] = o[j + 1];
    for (d = g = e; 40 > d; ) {
      Ao(n);
      b[n] = 2;
      b[i] = b[k];
      o[i] = o[k];
      b[i + 1] = b[k + 1];
      o[i + 1] = o[k + 1];
      d = Xn(f, n);
      Wd(d, h, 5);
      Wc(k, m);
      g = d = g + 1;
    }
    Wc(j, l);
    e = g = e + 1;
  }
  for (j = h = 0; 64 > j; ) {
    xo(f, .01666666753590107, 3, 3);
    h = j = h + 1;
  }
  for (j = h = 0; 256 > j; ) {
    j = Co();
    xo(f, .01666666753590107, 3, 3);
    k = Co();
    b[p + h] = k - j;
    Do(Eo, A([ 1e3 * ((k - j) / 1e3) ], "double", r));
    h = j = h + 1;
  }
  h = b[Fo];
  b[Go] = Gb(10);
  if (-1 == Ho(h, Go, 1) && h in Io) Io[h].error = ca;
  for (j = h = 0; !(h += b[p + j], j = k = j + 1, 256 <= k); ) ;
  Do(Eo, A([ 1e3 * (h / 256 / 1e3) ], "double", r));
  Vn(f);
  a = c;
}

zo.X = 1;

function C(c, f, d, e) {
  throw "Assertion failed: " + lb(e) + ", at: " + [ lb(c), f, lb(d) ];
}

function Pd(c, f) {
  for (var d = f, e = f + 2, g = c; d < e; d++, g++) b[g] = b[d], o[g] = o[d];
}

var Nc = Math.sin, Oc = Math.cos, Bg = Math.sqrt;

function db(c) {
  return Ma.D(c || 1);
}

var Jo = 13, Ko = 9, Lo = 22, Mo = 5, No = 21, Oo = 6;

function Po(c) {
  Qo || (Qo = A([ 0 ], "i32", t));
  b[Qo] = c;
}

var Qo, Ro = 0, Fo = 0, So = 0, To = 2, Io = [ da ], Uo = ca;

function Vo(c, f) {
  if ("string" !== typeof c) return da;
  f === ba && (f = "/");
  c && "/" == c[0] && (f = "");
  for (var d = (f + "/" + c).split("/").reverse(), e = [ "" ]; d.length; ) {
    var g = d.pop();
    "" == g || "." == g || (".." == g ? 1 < e.length && e.pop() : e.push(g));
  }
  return 1 == e.length ? "/" : e.join("/");
}

function Wo(c, f, d) {
  var e = {
    Q: ea,
    m: ea,
    error: 0,
    name: da,
    path: da,
    object: da,
    w: ea,
    A: da,
    z: da
  }, c = Vo(c);
  if ("/" == c) e.Q = ca, e.m = e.w = ca, e.name = "/", e.path = e.A = "/", e.object = e.z = Xo; else if (c !== da) for (var d = d || 0, c = c.slice(1).split("/"), g = Xo, i = [ "" ]; c.length; ) {
    if (1 == c.length && g.c) e.w = ca, e.A = 1 == i.length ? "/" : i.join("/"), e.z = g, e.name = c[0];
    var h = c.shift();
    if (g.c) if (g.C) {
      if (!g.a.hasOwnProperty(h)) {
        e.error = 2;
        break;
      }
    } else {
      e.error = Jo;
      break;
    } else {
      e.error = 20;
      break;
    }
    g = g.a[h];
    if (g.link && !(f && 0 == c.length)) {
      if (40 < d) {
        e.error = 40;
        break;
      }
      e = Vo(g.link, i.join("/"));
      return Wo([ e ].concat(c).join("/"), f, d + 1);
    }
    i.push(h);
    if (0 == c.length) e.m = ca, e.path = i.join("/"), e.object = g;
  }
  return e;
}

function Yo(c, f, d, e, g) {
  c || (c = "/");
  if ("string" === typeof c) Zo(), c = Wo(c, ba), c.m ? c = c.object : (Po(c.error), c = da);
  if (!c) throw Po(Jo), Error("Parent path must exist.");
  if (!c.c) throw Po(20), Error("Parent must be a folder.");
  if (!c.write && !Uo) throw Po(Jo), Error("Parent folder must be writeable.");
  if (!f || "." == f || ".." == f) throw Po(2), Error("Name must not be empty.");
  if (c.a.hasOwnProperty(f)) throw Po(17), Error("Can't overwrite object.");
  c.a[f] = {
    C: e === ba ? ca : e,
    write: g === ba ? ea : g,
    timestamp: Date.now(),
    N: To++
  };
  for (var i in d) d.hasOwnProperty(i) && (c.a[f][i] = d[i]);
  return c.a[f];
}

function $o(c, f) {
  return Yo("/", c, {
    c: ca,
    h: ea,
    a: {}
  }, ca, f);
}

function ap(c, f, d, e) {
  if (!d && !e) throw Error("A device must have at least one callback defined.");
  var g = {
    h: ca,
    input: d,
    d: e
  };
  g.c = ea;
  return Yo(c, f, g, Boolean(d), Boolean(e));
}

function Zo() {
  Xo || (Xo = {
    C: ca,
    write: ea,
    c: ca,
    h: ea,
    timestamp: Date.now(),
    N: 1,
    a: {}
  });
}

var bp, Xo;

function Ho(c, f, d) {
  var e = Io[c];
  if (e) {
    if (e.i) {
      if (0 > d) return Po(Lo), -1;
      if (e.object.h) {
        if (e.object.d) {
          for (var g = 0; g < d; g++) try {
            e.object.d(b[f + g]);
          } catch (i) {
            return Po(Mo), -1;
          }
          e.object.timestamp = Date.now();
          return g;
        }
        Po(Oo);
        return -1;
      }
      g = e.position;
      c = Io[c];
      if (!c || c.object.h) Po(Ko), f = -1; else if (c.i) if (c.object.c) Po(No), f = -1; else if (0 > d || 0 > g) Po(Lo), f = -1; else {
        for (var h = c.object.a; h.length < g; ) h.push(0);
        for (var j = 0; j < d; j++) h[g + j] = Za[f + j];
        c.object.timestamp = Date.now();
        f = j;
      } else Po(Jo), f = -1;
      -1 != f && (e.position += f);
      return f;
    }
    Po(Jo);
    return -1;
  }
  Po(Ko);
  return -1;
}

function cp(c, f) {
  function d(c) {
    var d;
    d = "float" === c || "double" === c ? o[f + g] : b[f + g];
    g += Ma.M(c);
    return Number(d);
  }
  for (var e = c, g = 0, i = [], h, j; ; ) {
    var k = e;
    h = b[e];
    if (0 === h) break;
    j = b[e + 1];
    if (37 == h) {
      var l = ea, m = ea, n = ea, p = ea;
      a : for (;;) {
        switch (j) {
         case 43:
          l = ca;
          break;
         case 45:
          m = ca;
          break;
         case 35:
          n = ca;
          break;
         case 48:
          if (p) break a; else {
            p = ca;
            break;
          }
         default:
          break a;
        }
        e++;
        j = b[e + 1];
      }
      var u = 0;
      if (42 == j) u = d("i32"), e++, j = b[e + 1]; else for (; 48 <= j && 57 >= j; ) u = 10 * u + (j - 48), e++, j = b[e + 1];
      var s = ea;
      if (46 == j) {
        var q = 0, s = ca;
        e++;
        j = b[e + 1];
        if (42 == j) q = d("i32"), e++; else for (;;) {
          j = b[e + 1];
          if (48 > j || 57 < j) break;
          q = 10 * q + (j - 48);
          e++;
        }
        j = b[e + 1];
      } else q = 6;
      var v;
      switch (String.fromCharCode(j)) {
       case "h":
        j = b[e + 2];
        104 == j ? (e++, v = 1) : v = 2;
        break;
       case "l":
        j = b[e + 2];
        108 == j ? (e++, v = 8) : v = 4;
        break;
       case "L":
       case "q":
       case "j":
        v = 8;
        break;
       case "z":
       case "t":
       case "I":
        v = 4;
        break;
       default:
        v = da;
      }
      v && e++;
      j = b[e + 1];
      if (-1 != "d,i,u,o,x,X,p".split(",").indexOf(String.fromCharCode(j))) {
        k = 100 == j || 105 == j;
        v = v || 4;
        h = d("i" + 8 * v);
        4 >= v && (h = (k ? Hb : Gb)(h & Math.pow(256, v) - 1, 8 * v));
        var x = Math.abs(h), w, k = "";
        if (100 == j || 105 == j) w = Hb(h, 8 * v).toString(10); else if (117 == j) w = Gb(h, 8 * v).toString(10), h = Math.abs(h); else if (111 == j) w = (n ? "0" : "") + x.toString(8); else if (120 == j || 88 == j) {
          k = n ? "0x" : "";
          if (0 > h) {
            h = -h;
            w = (x - 1).toString(16);
            n = [];
            for (x = 0; x < w.length; x++) n.push((15 - parseInt(w[x], 16)).toString(16));
            for (w = n.join(""); w.length < 2 * v; ) w = "f" + w;
          } else w = x.toString(16);
          88 == j && (k = k.toUpperCase(), w = w.toUpperCase());
        } else 112 == j && (0 === x ? w = "(nil)" : (k = "0x", w = x.toString(16)));
        if (s) for (; w.length < q; ) w = "0" + w;
        for (l && (k = 0 > h ? "-" + k : "+" + k); k.length + w.length < u; ) m ? w += " " : p ? w = "0" + w : k = " " + k;
        w = k + w;
        w.split("").forEach((function(c) {
          i.push(c.charCodeAt(0));
        }));
      } else if (-1 != "f,F,e,E,g,G".split(",").indexOf(String.fromCharCode(j))) {
        h = d(4 === v ? "float" : "double");
        if (isNaN(h)) w = "nan", p = ea; else if (isFinite(h)) {
          s = ea;
          v = Math.min(q, 20);
          if (103 == j || 71 == j) s = ca, q = q || 1, v = parseInt(h.toExponential(v).split("e")[1], 10), q > v && -4 <= v ? (j = (103 == j ? "f" : "F").charCodeAt(0), q -= v + 1) : (j = (103 == j ? "e" : "E").charCodeAt(0), q--), v = Math.min(q, 20);
          if (101 == j || 69 == j) w = h.toExponential(v), /[eE][-+]\d$/.test(w) && (w = w.slice(0, -1) + "0" + w.slice(-1)); else if (102 == j || 70 == j) w = h.toFixed(v);
          k = w.split("e");
          if (s && !n) for (; 1 < k[0].length && -1 != k[0].indexOf(".") && ("0" == k[0].slice(-1) || "." == k[0].slice(-1)); ) k[0] = k[0].slice(0, -1); else for (n && -1 == w.indexOf(".") && (k[0] += "."); q > v++; ) k[0] += "0";
          w = k[0] + (1 < k.length ? "e" + k[1] : "");
          69 == j && (w = w.toUpperCase());
          l && 0 <= h && (w = "+" + w);
        } else w = (0 > h ? "-" : "") + "inf", p = ea;
        for (; w.length < u; ) w = m ? w + " " : p && ("-" == w[0] || "+" == w[0]) ? w[0] + "0" + w.slice(1) : (p ? "0" : " ") + w;
        97 > j && (w = w.toUpperCase());
        w.split("").forEach((function(c) {
          i.push(c.charCodeAt(0));
        }));
      } else if (115 == j) {
        (l = d("i8*")) ? (l = Fb(l), s && l.length > q && (l = l.slice(0, q))) : l = ob("(null)", ca);
        if (!m) for (; l.length < u--; ) i.push(32);
        i = i.concat(l);
        if (m) for (; l.length < u--; ) i.push(32);
      } else if (99 == j) {
        for (m && i.push(d("i8")); 0 < --u; ) i.push(32);
        m || i.push(d("i8"));
      } else if (110 == j) m = d("i32*"), b[m] = i.length; else if (37 == j) i.push(h); else for (x = k; x < e + 2; x++) i.push(b[x]);
      e += 2;
    } else i.push(h), e += 1;
  }
  return i;
}

function Do(c, f) {
  var d = b[Fo], e = cp(c, f), g = Ma.W();
  var i = A(e, "i8", r), e = 1 * e.length;
  if (0 == e) d = 0; else if (i = Ho(d, i, e), -1 == i) {
    if (Io[d]) Io[d].error = ca;
    d = -1;
  } else d = Math.floor(i / 1);
  Ma.V(g);
  return d;
}

var hn = Do, zn = Math.floor;

function Gn(c) {
  var f = Ma.q({
    g: [ "i32", "i32" ]
  }), d = Date.now();
  b[c + f[0]] = Math.floor(d / 1e3);
  b[c + f[1]] = Math.floor(1e3 * (d - 1e3 * Math.floor(d / 1e3)));
}

function Co() {
  dp === ba && (dp = Date.now());
  return Math.floor(1 * (Date.now() - dp));
}

var dp;

((function(c, f, d) {
  if (!bp) {
    bp = ca;
    Zo();
    c || (c = (function() {
      if (!c.l || !c.l.length) {
        var d;
        "undefined" != typeof window && "function" == typeof window.prompt ? d = window.prompt("Input: ") : "function" == typeof readline && (d = readline());
        d || (d = "");
        c.l = ob(d + "\n", ca);
      }
      return c.l.shift();
    }));
    f || (f = (function(c) {
      c === da || 10 === c ? (f.B(f.buffer.join("")), f.buffer = []) : f.buffer.push(String.fromCharCode(c));
    }));
    if (!f.B) f.B = (function(c) {
      console && console.log ? console.log(c) : print(c);
    });
    if (!f.buffer) f.buffer = [];
    d || (d = f);
    $o("tmp", ca);
    var e = $o("dev", ea), g = ap(e, "stdin", c), i = ap(e, "stdout", da, f), d = ap(e, "stderr", da, d);
    ap(e, "tty", c, f);
    Io[1] = {
      path: "/dev/stdin",
      object: g,
      position: 0,
      v: ca,
      i: ea,
      u: ea,
      error: ea,
      r: ea,
      F: []
    };
    Io[2] = {
      path: "/dev/stdout",
      object: i,
      position: 0,
      v: ea,
      i: ca,
      u: ea,
      error: ea,
      r: ea,
      F: []
    };
    Io[3] = {
      path: "/dev/stderr",
      object: d,
      position: 0,
      v: ea,
      i: ca,
      u: ea,
      error: ea,
      r: ea,
      F: []
    };
    Ro = A([ 1 ], "void*", t);
    Fo = A([ 2 ], "void*", t);
    So = A([ 3 ], "void*", t);
    Io[Ro] = Io[1];
    Io[Fo] = Io[2];
    Io[So] = Io[3];
    A([ A([ 0, Ro, Fo, So ], "void*", t) ], "void*", t);
  }
}))();

bb.push({
  n: (function() {
    bp && (0 < Io[2].object.d.buffer.length && Io[2].object.d(10), 0 < Io[3].object.d.buffer.length && Io[3].object.d(10));
  })
});

Po(0);

var Go = A([ 0 ], "i8", t);

Module.I = (function(c) {
  function f() {
    for (var c = 0; 0 > c; c++) e.push(0);
  }
  var d = c.length + 1, e = [ A(ob("/bin/this.program"), "i8", t) ];
  f();
  for (var g = 0; g < d - 1; g += 1) e.push(A(ob(c[g]), "i8", t)), f();
  e.push(0);
  e = A(e, "i32", t);
  return yo();
});

var pc, bc, mc, Nb, nc, oc, rc, Vb, cc, sc, Ub, xc, yc, zc, Ac, Ic, Jc, Kc, Lc, Sd, Rd, bd, cd, ed, se, ue, ve, ep, fp, gp, hp, ip, jp, le, kp, lp, ze, Ae, Be, we, mp, np, oe, Ee, Ge, Fe, He, Je, Ke, Se, Ne, Me, op, pp, Ve, We, Xe, Ye, qp, rp, sp, tp, up, Kg, Lg, Mg, Yg, Zg, $g, ah, jh, lh, fh, gh, hh, ih, mh, oh, ph, rh, vh, th, uh, Qh, Nh, Oh, Ph, Dh, vp, wp, xp, ab = (function() {
  b[th] = yp + 2;
  bb.push({
    n: 30,
    k: th
  });
  b[uh] = vp + 2;
  bb.push({
    n: 32,
    k: uh
  });
}), ei, fi, gi, ki, li, pi, qi, si, wi, xi, Fi, Ni, Oi, zi, Ai, Ci, Ii, cj, Wi, Ti, Ui, Vi, Ji, Si, $i, aj, Zi, fj, lj, zp, Ap, Bp, Cp, Dp, Ep, Fp, uj, zj, Aj, vj, wj, xj, Eh, Nj, Mj, Gj, Hj, Ij, Oj, Pj, Qj, Rj, Sj, Tj, Uj, Vj, Wj, Xj, Zj, $j, ak, Gp, Hp, dk, ek, fk, bk, Ip, Jp, me, Kp, Lp, hk, ik, jk, kk, mk, pk, qk, rk, Mp, Np, uk, vk, wk, xk, yk, Ck, Dk, Ek, Op, Pp, Tk, Uk, al, bl, Pk, Ok, Qk, Rk, Qp, dd, tl, ul, vl, wl, xl, yl, zl, Bl, Cl, Rp, Sp, Tp, Fl, Gl, Hl, xe, Up, Vp, Kl, Ll, Ml, Il, Ce, Wp, Xp, Pl, Ql, Rl, Tl, Ul, Vl, Xl, Yp, Zp, bm, km, om, pm, sm, $p, aq, vm, um, wm, xm, Bm, Cm, Dm, Em, Fm, Fk, bq, cq, Hm, Nm, nm, Om, Pm, dq, eq, Sm, Vm, Wm, fq, vq, Zm, $m, an, bn, jn, kn, cn, dn, en, nn, xn, yn, vn, wn, pn, qn, rn, Fn, Bi, Cn, An, Bn, En, Jn, mm, wq, xq, Pn, Tn, gj, hj, ij, jj, kj, lm, qm, rm, Qm, mj, nj, oj, yq, zq, Yn, Zn, $n, ko, lo, mo, qo, ro, to, Ch, vo, wo, co, no, oo, ho, io, eo, fo, yp, Aq, Bq, Eo;

pc = A([ 16, 32, 64, 96, 128, 160, 192, 224, 256, 320, 384, 448, 512, 640 ], "i32", t);

bc = A(641, "i8", t);

mc = A(1, "i8", t);

Nb = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 109, 109, 111, 110, 47, 98, 50, 66, 108, 111, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 46, 99, 112, 112, 0 ], "i8", t);

nc = A([ 98, 50, 66, 108, 111, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 58, 58, 98, 50, 66, 108, 111, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 40, 41, 0 ], "i8", t);

oc = A([ 106, 32, 60, 32, 98, 50, 95, 98, 108, 111, 99, 107, 83, 105, 122, 101, 115, 0 ], "i8", t);

rc = A([ 118, 111, 105, 100, 32, 42, 98, 50, 66, 108, 111, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 58, 58, 65, 108, 108, 111, 99, 97, 116, 101, 40, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

Vb = A([ 48, 32, 60, 32, 115, 105, 122, 101, 0 ], "i8", t);

cc = A([ 48, 32, 60, 61, 32, 105, 110, 100, 101, 120, 32, 38, 38, 32, 105, 110, 100, 101, 120, 32, 60, 32, 98, 50, 95, 98, 108, 111, 99, 107, 83, 105, 122, 101, 115, 0 ], "i8", t);

sc = A([ 98, 108, 111, 99, 107, 67, 111, 117, 110, 116, 32, 42, 32, 98, 108, 111, 99, 107, 83, 105, 122, 101, 32, 60, 61, 32, 98, 50, 95, 99, 104, 117, 110, 107, 83, 105, 122, 101, 0 ], "i8", t);

Ub = A([ 118, 111, 105, 100, 32, 98, 50, 66, 108, 111, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 58, 58, 70, 114, 101, 101, 40, 118, 111, 105, 100, 32, 42, 44, 32, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

xc = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 98, 50, 66, 111, 100, 121, 46, 99, 112, 112, 0 ], "i8", t);

yc = A([ 98, 50, 66, 111, 100, 121, 58, 58, 98, 50, 66, 111, 100, 121, 40, 99, 111, 110, 115, 116, 32, 98, 50, 66, 111, 100, 121, 68, 101, 102, 32, 42, 44, 32, 98, 50, 87, 111, 114, 108, 100, 32, 42, 41, 0 ], "i8", t);

zc = A([ 98, 100, 45, 62, 112, 111, 115, 105, 116, 105, 111, 110, 46, 73, 115, 86, 97, 108, 105, 100, 40, 41, 0 ], "i8", t);

Ac = A([ 98, 100, 45, 62, 108, 105, 110, 101, 97, 114, 86, 101, 108, 111, 99, 105, 116, 121, 46, 73, 115, 86, 97, 108, 105, 100, 40, 41, 0 ], "i8", t);

Ic = A([ 98, 50, 73, 115, 86, 97, 108, 105, 100, 40, 98, 100, 45, 62, 97, 110, 103, 108, 101, 41, 0 ], "i8", t);

Jc = A([ 98, 50, 73, 115, 86, 97, 108, 105, 100, 40, 98, 100, 45, 62, 97, 110, 103, 117, 108, 97, 114, 86, 101, 108, 111, 99, 105, 116, 121, 41, 0 ], "i8", t);

Kc = A([ 98, 50, 73, 115, 86, 97, 108, 105, 100, 40, 98, 100, 45, 62, 97, 110, 103, 117, 108, 97, 114, 68, 97, 109, 112, 105, 110, 103, 41, 32, 38, 38, 32, 98, 100, 45, 62, 97, 110, 103, 117, 108, 97, 114, 68, 97, 109, 112, 105, 110, 103, 32, 62, 61, 32, 48, 46, 48, 102, 0 ], "i8", t);

Lc = A([ 98, 50, 73, 115, 86, 97, 108, 105, 100, 40, 98, 100, 45, 62, 108, 105, 110, 101, 97, 114, 68, 97, 109, 112, 105, 110, 103, 41, 32, 38, 38, 32, 98, 100, 45, 62, 108, 105, 110, 101, 97, 114, 68, 97, 109, 112, 105, 110, 103, 32, 62, 61, 32, 48, 46, 48, 102, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 66, 111, 100, 121, 58, 58, 83, 101, 116, 84, 121, 112, 101, 40, 98, 50, 66, 111, 100, 121, 84, 121, 112, 101, 41, 0 ], "i8", t);

Sd = A([ 109, 95, 119, 111, 114, 108, 100, 45, 62, 73, 115, 76, 111, 99, 107, 101, 100, 40, 41, 32, 61, 61, 32, 102, 97, 108, 115, 101, 0 ], "i8", t);

Rd = A([ 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 98, 50, 66, 111, 100, 121, 58, 58, 67, 114, 101, 97, 116, 101, 70, 105, 120, 116, 117, 114, 101, 40, 99, 111, 110, 115, 116, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 68, 101, 102, 32, 42, 41, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 66, 111, 100, 121, 58, 58, 68, 101, 115, 116, 114, 111, 121, 70, 105, 120, 116, 117, 114, 101, 40, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 41, 0 ], "i8", t);

A([ 102, 105, 120, 116, 117, 114, 101, 45, 62, 109, 95, 98, 111, 100, 121, 32, 61, 61, 32, 116, 104, 105, 115, 0 ], "i8", t);

A([ 109, 95, 102, 105, 120, 116, 117, 114, 101, 67, 111, 117, 110, 116, 32, 62, 32, 48, 0 ], "i8", t);

A([ 102, 111, 117, 110, 100, 0 ], "i8", t);

bd = A([ 118, 111, 105, 100, 32, 98, 50, 66, 111, 100, 121, 58, 58, 82, 101, 115, 101, 116, 77, 97, 115, 115, 68, 97, 116, 97, 40, 41, 0 ], "i8", t);

cd = A([ 109, 95, 116, 121, 112, 101, 32, 61, 61, 32, 98, 50, 95, 100, 121, 110, 97, 109, 105, 99, 66, 111, 100, 121, 0 ], "i8", t);

ed = A([ 109, 95, 73, 32, 62, 32, 48, 46, 48, 102, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 66, 111, 100, 121, 58, 58, 83, 101, 116, 77, 97, 115, 115, 68, 97, 116, 97, 40, 99, 111, 110, 115, 116, 32, 98, 50, 77, 97, 115, 115, 68, 97, 116, 97, 32, 42, 41, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 66, 111, 100, 121, 58, 58, 83, 101, 116, 84, 114, 97, 110, 115, 102, 111, 114, 109, 40, 99, 111, 110, 115, 116, 32, 98, 50, 86, 101, 99, 50, 32, 38, 44, 32, 102, 108, 111, 97, 116, 51, 50, 41, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 66, 111, 100, 121, 58, 58, 83, 101, 116, 65, 99, 116, 105, 118, 101, 40, 98, 111, 111, 108, 41, 0 ], "i8", t);

A([ 32, 32, 98, 50, 66, 111, 100, 121, 68, 101, 102, 32, 98, 100, 59, 10, 0 ], "i8", t);

A([ 32, 32, 98, 100, 46, 116, 121, 112, 101, 32, 61, 32, 98, 50, 66, 111, 100, 121, 84, 121, 112, 101, 40, 37, 100, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 98, 100, 46, 112, 111, 115, 105, 116, 105, 111, 110, 46, 83, 101, 116, 40, 37, 46, 49, 53, 108, 101, 102, 44, 32, 37, 46, 49, 53, 108, 101, 102, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 98, 100, 46, 97, 110, 103, 108, 101, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

A([ 32, 32, 98, 100, 46, 108, 105, 110, 101, 97, 114, 86, 101, 108, 111, 99, 105, 116, 121, 46, 83, 101, 116, 40, 37, 46, 49, 53, 108, 101, 102, 44, 32, 37, 46, 49, 53, 108, 101, 102, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 98, 100, 46, 97, 110, 103, 117, 108, 97, 114, 86, 101, 108, 111, 99, 105, 116, 121, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

A([ 32, 32, 98, 100, 46, 108, 105, 110, 101, 97, 114, 68, 97, 109, 112, 105, 110, 103, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

A([ 32, 32, 98, 100, 46, 97, 110, 103, 117, 108, 97, 114, 68, 97, 109, 112, 105, 110, 103, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

A([ 32, 32, 98, 100, 46, 97, 108, 108, 111, 119, 83, 108, 101, 101, 112, 32, 61, 32, 98, 111, 111, 108, 40, 37, 100, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 98, 100, 46, 97, 119, 97, 107, 101, 32, 61, 32, 98, 111, 111, 108, 40, 37, 100, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 98, 100, 46, 102, 105, 120, 101, 100, 82, 111, 116, 97, 116, 105, 111, 110, 32, 61, 32, 98, 111, 111, 108, 40, 37, 100, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 98, 100, 46, 98, 117, 108, 108, 101, 116, 32, 61, 32, 98, 111, 111, 108, 40, 37, 100, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 98, 100, 46, 97, 99, 116, 105, 118, 101, 32, 61, 32, 98, 111, 111, 108, 40, 37, 100, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 98, 100, 46, 103, 114, 97, 118, 105, 116, 121, 83, 99, 97, 108, 101, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

A([ 32, 32, 98, 111, 100, 105, 101, 115, 91, 37, 100, 93, 32, 61, 32, 109, 95, 119, 111, 114, 108, 100, 45, 62, 67, 114, 101, 97, 116, 101, 66, 111, 100, 121, 40, 38, 98, 100, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 123, 10, 0 ], "i8", t);

A([ 32, 32, 125, 10, 0 ], "i8", t);

se = A([ 0, 0, 36, 38, 40 ], "i8*", t);

A(1, "void*", t);

ue = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 67, 111, 110, 116, 97, 99, 116, 115, 47, 98, 50, 67, 104, 97, 105, 110, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 46, 99, 112, 112, 0 ], "i8", t);

ve = A([ 98, 50, 67, 104, 97, 105, 110, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 58, 58, 98, 50, 67, 104, 97, 105, 110, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 40, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 105, 110, 116, 51, 50, 44, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

fp = A([ 50, 51, 98, 50, 67, 104, 97, 105, 110, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 0 ], "i8", t);

hp = A([ 57, 98, 50, 67, 111, 110, 116, 97, 99, 116, 0 ], "i8", t);

ip = A(2, "i8*", t);

jp = A(3, "i8*", t);

le = A([ 0, 0, 42, 44, 46, 46, 46, 46, 46, 46 ], "i8*", t);

A(1, "void*", t);

kp = A([ 55, 98, 50, 83, 104, 97, 112, 101, 0 ], "i8", t);

lp = A(2, "i8*", t);

ze = A([ 0, 0, 48, 50, 52 ], "i8*", t);

A(1, "void*", t);

Ae = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 67, 111, 110, 116, 97, 99, 116, 115, 47, 98, 50, 67, 104, 97, 105, 110, 65, 110, 100, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 46, 99, 112, 112, 0 ], "i8", t);

Be = A([ 98, 50, 67, 104, 97, 105, 110, 65, 110, 100, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 58, 58, 98, 50, 67, 104, 97, 105, 110, 65, 110, 100, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 40, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 105, 110, 116, 51, 50, 44, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

we = A([ 109, 95, 102, 105, 120, 116, 117, 114, 101, 65, 45, 62, 71, 101, 116, 84, 121, 112, 101, 40, 41, 32, 61, 61, 32, 98, 50, 83, 104, 97, 112, 101, 58, 58, 101, 95, 99, 104, 97, 105, 110, 0 ], "i8", t);

mp = A([ 50, 52, 98, 50, 67, 104, 97, 105, 110, 65, 110, 100, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 0 ], "i8", t);

np = A(3, "i8*", t);

oe = A([ 0, 0, 54, 56, 58, 60, 62, 64, 66, 68 ], "i8*", t);

A(1, "void*", t);

Ee = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 108, 108, 105, 115, 105, 111, 110, 47, 83, 104, 97, 112, 101, 115, 47, 98, 50, 67, 104, 97, 105, 110, 83, 104, 97, 112, 101, 46, 99, 112, 112, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 67, 104, 97, 105, 110, 83, 104, 97, 112, 101, 58, 58, 67, 114, 101, 97, 116, 101, 76, 111, 111, 112, 40, 99, 111, 110, 115, 116, 32, 98, 50, 86, 101, 99, 50, 32, 42, 44, 32, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

Ge = A([ 109, 95, 118, 101, 114, 116, 105, 99, 101, 115, 32, 61, 61, 32, 95, 95, 110, 117, 108, 108, 32, 38, 38, 32, 109, 95, 99, 111, 117, 110, 116, 32, 61, 61, 32, 48, 0 ], "i8", t);

Fe = A([ 118, 111, 105, 100, 32, 98, 50, 67, 104, 97, 105, 110, 83, 104, 97, 112, 101, 58, 58, 67, 114, 101, 97, 116, 101, 67, 104, 97, 105, 110, 40, 99, 111, 110, 115, 116, 32, 98, 50, 86, 101, 99, 50, 32, 42, 44, 32, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

He = A([ 99, 111, 117, 110, 116, 32, 62, 61, 32, 50, 0 ], "i8", t);

Je = A([ 118, 111, 105, 100, 32, 98, 50, 67, 104, 97, 105, 110, 83, 104, 97, 112, 101, 58, 58, 71, 101, 116, 67, 104, 105, 108, 100, 69, 100, 103, 101, 40, 98, 50, 69, 100, 103, 101, 83, 104, 97, 112, 101, 32, 42, 44, 32, 105, 110, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

Ke = A([ 48, 32, 60, 61, 32, 105, 110, 100, 101, 120, 32, 38, 38, 32, 105, 110, 100, 101, 120, 32, 60, 32, 109, 95, 99, 111, 117, 110, 116, 32, 45, 32, 49, 0 ], "i8", t);

Se = A([ 118, 105, 114, 116, 117, 97, 108, 32, 98, 111, 111, 108, 32, 98, 50, 67, 104, 97, 105, 110, 83, 104, 97, 112, 101, 58, 58, 82, 97, 121, 67, 97, 115, 116, 40, 98, 50, 82, 97, 121, 67, 97, 115, 116, 79, 117, 116, 112, 117, 116, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 82, 97, 121, 67, 97, 115, 116, 73, 110, 112, 117, 116, 32, 38, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 44, 32, 105, 110, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

Ne = A([ 99, 104, 105, 108, 100, 73, 110, 100, 101, 120, 32, 60, 32, 109, 95, 99, 111, 117, 110, 116, 0 ], "i8", t);

Me = A([ 118, 105, 114, 116, 117, 97, 108, 32, 118, 111, 105, 100, 32, 98, 50, 67, 104, 97, 105, 110, 83, 104, 97, 112, 101, 58, 58, 67, 111, 109, 112, 117, 116, 101, 65, 65, 66, 66, 40, 98, 50, 65, 65, 66, 66, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 44, 32, 105, 110, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

op = A([ 49, 50, 98, 50, 67, 104, 97, 105, 110, 83, 104, 97, 112, 101, 0 ], "i8", t);

pp = A(3, "i8*", t);

Ve = A([ 0, 0, 70, 72, 74 ], "i8*", t);

A(1, "void*", t);

We = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 67, 111, 110, 116, 97, 99, 116, 115, 47, 98, 50, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 46, 99, 112, 112, 0 ], "i8", t);

Xe = A([ 98, 50, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 58, 58, 98, 50, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 40, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 41, 0 ], "i8", t);

Ye = A([ 109, 95, 102, 105, 120, 116, 117, 114, 101, 65, 45, 62, 71, 101, 116, 84, 121, 112, 101, 40, 41, 32, 61, 61, 32, 98, 50, 83, 104, 97, 112, 101, 58, 58, 101, 95, 99, 105, 114, 99, 108, 101, 0 ], "i8", t);

qp = A([ 49, 53, 98, 50, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 0 ], "i8", t);

rp = A(3, "i8*", t);

sp = A([ 0, 0, 76, 78, 80, 82, 84, 86, 88, 90 ], "i8*", t);

A(1, "void*", t);

tp = A([ 49, 51, 98, 50, 67, 105, 114, 99, 108, 101, 83, 104, 97, 112, 101, 0 ], "i8", t);

up = A(3, "i8*", t);

Kg = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 108, 108, 105, 115, 105, 111, 110, 47, 98, 50, 67, 111, 108, 108, 105, 100, 101, 69, 100, 103, 101, 46, 99, 112, 112, 0 ], "i8", t);

Lg = A([ 118, 111, 105, 100, 32, 98, 50, 67, 111, 108, 108, 105, 100, 101, 69, 100, 103, 101, 65, 110, 100, 67, 105, 114, 99, 108, 101, 40, 98, 50, 77, 97, 110, 105, 102, 111, 108, 100, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 69, 100, 103, 101, 83, 104, 97, 112, 101, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 67, 105, 114, 99, 108, 101, 83, 104, 97, 112, 101, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 41, 0 ], "i8", t);

Mg = A([ 100, 101, 110, 32, 62, 32, 48, 46, 48, 102, 0 ], "i8", t);

Yg = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 108, 108, 105, 115, 105, 111, 110, 47, 98, 50, 67, 111, 108, 108, 105, 100, 101, 80, 111, 108, 121, 103, 111, 110, 46, 99, 112, 112, 0 ], "i8", t);

Zg = A([ 118, 111, 105, 100, 32, 98, 50, 70, 105, 110, 100, 73, 110, 99, 105, 100, 101, 110, 116, 69, 100, 103, 101, 40, 98, 50, 67, 108, 105, 112, 86, 101, 114, 116, 101, 120, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 80, 111, 108, 121, 103, 111, 110, 83, 104, 97, 112, 101, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 44, 32, 105, 110, 116, 51, 50, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 80, 111, 108, 121, 103, 111, 110, 83, 104, 97, 112, 101, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 41, 0 ], "i8", t);

$g = A([ 48, 32, 60, 61, 32, 101, 100, 103, 101, 49, 32, 38, 38, 32, 101, 100, 103, 101, 49, 32, 60, 32, 112, 111, 108, 121, 49, 45, 62, 109, 95, 118, 101, 114, 116, 101, 120, 67, 111, 117, 110, 116, 0 ], "i8", t);

ah = A([ 102, 108, 111, 97, 116, 51, 50, 32, 98, 50, 69, 100, 103, 101, 83, 101, 112, 97, 114, 97, 116, 105, 111, 110, 40, 99, 111, 110, 115, 116, 32, 98, 50, 80, 111, 108, 121, 103, 111, 110, 83, 104, 97, 112, 101, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 44, 32, 105, 110, 116, 51, 50, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 80, 111, 108, 121, 103, 111, 110, 83, 104, 97, 112, 101, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 41, 0 ], "i8", t);

jh = A(48, "%class.b2Contact.26* (%class.b2Fixture.19*, i32, %class.b2Fixture.19*, i32, %class.b2BlockAllocator*)*;void (%class.b2Contact.26*, %class.b2BlockAllocator*)*;i8;%class.b2Contact.26* (%class.b2Fixture.19*, i32, %class.b2Fixture.19*, i32, %class.b2BlockAllocator*)*;void (%class.b2Contact.26*, %class.b2BlockAllocator*)*;i8;%class.b2Contact.26* (%class.b2Fixture.19*, i32, %class.b2Fixture.19*, i32, %class.b2BlockAllocator*)*;void (%class.b2Contact.26*, %class.b2BlockAllocator*)*;i8;%class.b2Contact.26* (%class.b2Fixture.19*, i32, %class.b2Fixture.19*, i32, %class.b2BlockAllocator*)*;void (%class.b2Contact.26*, %class.b2BlockAllocator*)*;i8;%class.b2Contact.26* (%class.b2Fixture.19*, i32, %class.b2Fixture.19*, i32, %class.b2BlockAllocator*)*;void (%class.b2Contact.26*, %class.b2BlockAllocator*)*;i8;%class.b2Contact.26* (%class.b2Fixture.19*, i32, %class.b2Fixture.19*, i32, %class.b2BlockAllocator*)*;void (%class.b2Contact.26*, %class.b2BlockAllocator*)*;i8;%class.b2Contact.26* (%class.b2Fixture.19*, i32, %class.b2Fixture.19*, i32, %class.b2BlockAllocator*)*;void (%class.b2Contact.26*, %class.b2BlockAllocator*)*;i8;%class.b2Contact.26* (%class.b2Fixture.19*, i32, %class.b2Fixture.19*, i32, %class.b2BlockAllocator*)*;void (%class.b2Contact.26*, %class.b2BlockAllocator*)*;i8;%class.b2Contact.26* (%class.b2Fixture.19*, i32, %class.b2Fixture.19*, i32, %class.b2BlockAllocator*)*;void (%class.b2Contact.26*, %class.b2BlockAllocator*)*;i8;%class.b2Contact.26* (%class.b2Fixture.19*, i32, %class.b2Fixture.19*, i32, %class.b2BlockAllocator*)*;void (%class.b2Contact.26*, %class.b2BlockAllocator*)*;i8;%class.b2Contact.26* (%class.b2Fixture.19*, i32, %class.b2Fixture.19*, i32, %class.b2BlockAllocator*)*;void (%class.b2Contact.26*, %class.b2BlockAllocator*)*;i8;%class.b2Contact.26* (%class.b2Fixture.19*, i32, %class.b2Fixture.19*, i32, %class.b2BlockAllocator*)*;void (%class.b2Contact.26*, %class.b2BlockAllocator*)*;i8;%class.b2Contact.26* (%class.b2Fixture.19*, i32, %class.b2Fixture.19*, i32, %class.b2BlockAllocator*)*;void (%class.b2Contact.26*, %class.b2BlockAllocator*)*;i8;%class.b2Contact.26* (%class.b2Fixture.19*, i32, %class.b2Fixture.19*, i32, %class.b2BlockAllocator*)*;void (%class.b2Contact.26*, %class.b2BlockAllocator*)*;i8;%class.b2Contact.26* (%class.b2Fixture.19*, i32, %class.b2Fixture.19*, i32, %class.b2BlockAllocator*)*;void (%class.b2Contact.26*, %class.b2BlockAllocator*)*;i8;%class.b2Contact.26* (%class.b2Fixture.19*, i32, %class.b2Fixture.19*, i32, %class.b2BlockAllocator*)*;void (%class.b2Contact.26*, %class.b2BlockAllocator*)*;i8".split(";"), t);

lh = A(1, "i8", t);

fh = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 67, 111, 110, 116, 97, 99, 116, 115, 47, 98, 50, 67, 111, 110, 116, 97, 99, 116, 46, 99, 112, 112, 0 ], "i8", t);

gh = A([ 115, 116, 97, 116, 105, 99, 32, 118, 111, 105, 100, 32, 98, 50, 67, 111, 110, 116, 97, 99, 116, 58, 58, 65, 100, 100, 84, 121, 112, 101, 40, 98, 50, 67, 111, 110, 116, 97, 99, 116, 67, 114, 101, 97, 116, 101, 70, 99, 110, 32, 42, 44, 32, 98, 50, 67, 111, 110, 116, 97, 99, 116, 68, 101, 115, 116, 114, 111, 121, 70, 99, 110, 32, 42, 44, 32, 98, 50, 83, 104, 97, 112, 101, 58, 58, 84, 121, 112, 101, 44, 32, 98, 50, 83, 104, 97, 112, 101, 58, 58, 84, 121, 112, 101, 41, 0 ], "i8", t);

hh = A([ 48, 32, 60, 61, 32, 116, 121, 112, 101, 49, 32, 38, 38, 32, 116, 121, 112, 101, 49, 32, 60, 32, 98, 50, 83, 104, 97, 112, 101, 58, 58, 101, 95, 116, 121, 112, 101, 67, 111, 117, 110, 116, 0 ], "i8", t);

ih = A([ 48, 32, 60, 61, 32, 116, 121, 112, 101, 50, 32, 38, 38, 32, 116, 121, 112, 101, 50, 32, 60, 32, 98, 50, 83, 104, 97, 112, 101, 58, 58, 101, 95, 116, 121, 112, 101, 67, 111, 117, 110, 116, 0 ], "i8", t);

mh = A([ 115, 116, 97, 116, 105, 99, 32, 98, 50, 67, 111, 110, 116, 97, 99, 116, 32, 42, 98, 50, 67, 111, 110, 116, 97, 99, 116, 58, 58, 67, 114, 101, 97, 116, 101, 40, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 105, 110, 116, 51, 50, 44, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 105, 110, 116, 51, 50, 44, 32, 98, 50, 66, 108, 111, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 32, 42, 41, 0 ], "i8", t);

oh = A([ 115, 116, 97, 116, 105, 99, 32, 118, 111, 105, 100, 32, 98, 50, 67, 111, 110, 116, 97, 99, 116, 58, 58, 68, 101, 115, 116, 114, 111, 121, 40, 98, 50, 67, 111, 110, 116, 97, 99, 116, 32, 42, 44, 32, 98, 50, 66, 108, 111, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 32, 42, 41, 0 ], "i8", t);

ph = A([ 115, 95, 105, 110, 105, 116, 105, 97, 108, 105, 122, 101, 100, 32, 61, 61, 32, 116, 114, 117, 101, 0 ], "i8", t);

rh = A([ 48, 32, 60, 61, 32, 116, 121, 112, 101, 65, 32, 38, 38, 32, 116, 121, 112, 101, 66, 32, 60, 32, 98, 50, 83, 104, 97, 112, 101, 58, 58, 101, 95, 116, 121, 112, 101, 67, 111, 117, 110, 116, 0 ], "i8", t);

vh = A([ 0, 0, 46, 92, 94 ], "i8*", t);

A(1, "void*", t);

th = A(1, "i32 (...)**", t);

uh = A(1, "i32 (...)**", t);

Qh = A([ 118, 111, 105, 100, 32, 42, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 71, 101, 116, 85, 115, 101, 114, 68, 97, 116, 97, 40, 105, 110, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

Nh = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 109, 109, 111, 110, 47, 98, 50, 71, 114, 111, 119, 97, 98, 108, 101, 83, 116, 97, 99, 107, 46, 104, 0 ], "i8", t);

Oh = A([ 105, 110, 116, 32, 98, 50, 71, 114, 111, 119, 97, 98, 108, 101, 83, 116, 97, 99, 107, 60, 105, 110, 116, 44, 32, 50, 53, 54, 62, 58, 58, 80, 111, 112, 40, 41, 0 ], "i8", t);

Ph = A([ 109, 95, 99, 111, 117, 110, 116, 32, 62, 32, 48, 0 ], "i8", t);

Dh = A([ 99, 111, 110, 115, 116, 32, 98, 50, 65, 65, 66, 66, 32, 38, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 71, 101, 116, 70, 97, 116, 65, 65, 66, 66, 40, 105, 110, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

vp = A([ 0, 0, 32, 96, 98, 100, 102, 104 ], "i8*", t);

A(1, "void*", t);

wp = A([ 49, 55, 98, 50, 67, 111, 110, 116, 97, 99, 116, 76, 105, 115, 116, 101, 110, 101, 114, 0 ], "i8", t);

xp = A(2, "i8*", t);

ei = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 67, 111, 110, 116, 97, 99, 116, 115, 47, 98, 50, 67, 111, 110, 116, 97, 99, 116, 83, 111, 108, 118, 101, 114, 46, 99, 112, 112, 0 ], "i8", t);

fi = A([ 98, 50, 67, 111, 110, 116, 97, 99, 116, 83, 111, 108, 118, 101, 114, 58, 58, 98, 50, 67, 111, 110, 116, 97, 99, 116, 83, 111, 108, 118, 101, 114, 40, 98, 50, 67, 111, 110, 116, 97, 99, 116, 83, 111, 108, 118, 101, 114, 68, 101, 102, 32, 42, 41, 0 ], "i8", t);

gi = A([ 112, 111, 105, 110, 116, 67, 111, 117, 110, 116, 32, 62, 32, 48, 0 ], "i8", t);

ki = A([ 118, 111, 105, 100, 32, 98, 50, 67, 111, 110, 116, 97, 99, 116, 83, 111, 108, 118, 101, 114, 58, 58, 73, 110, 105, 116, 105, 97, 108, 105, 122, 101, 86, 101, 108, 111, 99, 105, 116, 121, 67, 111, 110, 115, 116, 114, 97, 105, 110, 116, 115, 40, 41, 0 ], "i8", t);

li = A([ 109, 97, 110, 105, 102, 111, 108, 100, 45, 62, 112, 111, 105, 110, 116, 67, 111, 117, 110, 116, 32, 62, 32, 48, 0 ], "i8", t);

pi = A([ 118, 111, 105, 100, 32, 98, 50, 67, 111, 110, 116, 97, 99, 116, 83, 111, 108, 118, 101, 114, 58, 58, 83, 111, 108, 118, 101, 86, 101, 108, 111, 99, 105, 116, 121, 67, 111, 110, 115, 116, 114, 97, 105, 110, 116, 115, 40, 41, 0 ], "i8", t);

qi = A([ 112, 111, 105, 110, 116, 67, 111, 117, 110, 116, 32, 61, 61, 32, 49, 32, 124, 124, 32, 112, 111, 105, 110, 116, 67, 111, 117, 110, 116, 32, 61, 61, 32, 50, 0 ], "i8", t);

si = A([ 97, 46, 120, 32, 62, 61, 32, 48, 46, 48, 102, 32, 38, 38, 32, 97, 46, 121, 32, 62, 61, 32, 48, 46, 48, 102, 0 ], "i8", t);

wi = A([ 118, 111, 105, 100, 32, 98, 50, 80, 111, 115, 105, 116, 105, 111, 110, 83, 111, 108, 118, 101, 114, 77, 97, 110, 105, 102, 111, 108, 100, 58, 58, 73, 110, 105, 116, 105, 97, 108, 105, 122, 101, 40, 98, 50, 67, 111, 110, 116, 97, 99, 116, 80, 111, 115, 105, 116, 105, 111, 110, 67, 111, 110, 115, 116, 114, 97, 105, 110, 116, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 44, 32, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

xi = A([ 112, 99, 45, 62, 112, 111, 105, 110, 116, 67, 111, 117, 110, 116, 32, 62, 32, 48, 0 ], "i8", t);

Fi = A(1, "i32", t);

Ni = A(1, "i32", t);

Oi = A(1, "i32", t);

zi = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 108, 108, 105, 115, 105, 111, 110, 47, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 46, 99, 112, 112, 0 ], "i8", t);

Ai = A([ 118, 111, 105, 100, 32, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 80, 114, 111, 120, 121, 58, 58, 83, 101, 116, 40, 99, 111, 110, 115, 116, 32, 98, 50, 83, 104, 97, 112, 101, 32, 42, 44, 32, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

Ci = A([ 48, 32, 60, 61, 32, 105, 110, 100, 101, 120, 32, 38, 38, 32, 105, 110, 100, 101, 120, 32, 60, 32, 99, 104, 97, 105, 110, 45, 62, 109, 95, 99, 111, 117, 110, 116, 0 ], "i8", t);

Ii = A([ 118, 111, 105, 100, 32, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 40, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 79, 117, 116, 112, 117, 116, 32, 42, 44, 32, 98, 50, 83, 105, 109, 112, 108, 101, 120, 67, 97, 99, 104, 101, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 73, 110, 112, 117, 116, 32, 42, 41, 0 ], "i8", t);

cj = A([ 102, 108, 111, 97, 116, 51, 50, 32, 98, 50, 83, 105, 109, 112, 108, 101, 120, 58, 58, 71, 101, 116, 77, 101, 116, 114, 105, 99, 40, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

Wi = A([ 118, 111, 105, 100, 32, 98, 50, 83, 105, 109, 112, 108, 101, 120, 58, 58, 71, 101, 116, 87, 105, 116, 110, 101, 115, 115, 80, 111, 105, 110, 116, 115, 40, 98, 50, 86, 101, 99, 50, 32, 42, 44, 32, 98, 50, 86, 101, 99, 50, 32, 42, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

Ti = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 108, 108, 105, 115, 105, 111, 110, 47, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 46, 104, 0 ], "i8", t);

Ui = A([ 99, 111, 110, 115, 116, 32, 98, 50, 86, 101, 99, 50, 32, 38, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 80, 114, 111, 120, 121, 58, 58, 71, 101, 116, 86, 101, 114, 116, 101, 120, 40, 105, 110, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

Vi = A([ 48, 32, 60, 61, 32, 105, 110, 100, 101, 120, 32, 38, 38, 32, 105, 110, 100, 101, 120, 32, 60, 32, 109, 95, 99, 111, 117, 110, 116, 0 ], "i8", t);

Ji = A([ 98, 50, 86, 101, 99, 50, 32, 98, 50, 83, 105, 109, 112, 108, 101, 120, 58, 58, 71, 101, 116, 83, 101, 97, 114, 99, 104, 68, 105, 114, 101, 99, 116, 105, 111, 110, 40, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

Si = A([ 98, 50, 86, 101, 99, 50, 32, 98, 50, 83, 105, 109, 112, 108, 101, 120, 58, 58, 71, 101, 116, 67, 108, 111, 115, 101, 115, 116, 80, 111, 105, 110, 116, 40, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

$i = A([ 118, 111, 105, 100, 32, 98, 50, 83, 105, 109, 112, 108, 101, 120, 58, 58, 82, 101, 97, 100, 67, 97, 99, 104, 101, 40, 99, 111, 110, 115, 116, 32, 98, 50, 83, 105, 109, 112, 108, 101, 120, 67, 97, 99, 104, 101, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 80, 114, 111, 120, 121, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 80, 114, 111, 120, 121, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 41, 0 ], "i8", t);

aj = A([ 99, 97, 99, 104, 101, 45, 62, 99, 111, 117, 110, 116, 32, 60, 61, 32, 51, 0 ], "i8", t);

Zi = A([ 0, 0, 106, 108, 110, 112, 114, 116, 118, 120, 122, 124 ], "i8*", t);

A(1, "void*", t);

fj = A([ 32, 32, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 74, 111, 105, 110, 116, 68, 101, 102, 32, 106, 100, 59, 10, 0 ], "i8", t);

lj = A([ 32, 32, 106, 100, 46, 108, 101, 110, 103, 116, 104, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

zp = A([ 49, 53, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 74, 111, 105, 110, 116, 0 ], "i8", t);

Ap = A([ 55, 98, 50, 74, 111, 105, 110, 116, 0 ], "i8", t);

Bp = A(2, "i8*", t);

Cp = A(3, "i8*", t);

Dp = A([ 0, 0, 126, 128, 46, 46, 46, 46, 46, 46 ], "i8*", t);

A(1, "void*", t);

Ep = A([ 54, 98, 50, 68, 114, 97, 119, 0 ], "i8", t);

Fp = A(2, "i8*", t);

uj = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 108, 108, 105, 115, 105, 111, 110, 47, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 46, 99, 112, 112, 0 ], "i8", t);

zj = A([ 105, 110, 116, 51, 50, 32, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 65, 108, 108, 111, 99, 97, 116, 101, 78, 111, 100, 101, 40, 41, 0 ], "i8", t);

Aj = A([ 109, 95, 110, 111, 100, 101, 67, 111, 117, 110, 116, 32, 61, 61, 32, 109, 95, 110, 111, 100, 101, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

vj = A([ 118, 111, 105, 100, 32, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 70, 114, 101, 101, 78, 111, 100, 101, 40, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

wj = A([ 48, 32, 60, 61, 32, 110, 111, 100, 101, 73, 100, 32, 38, 38, 32, 110, 111, 100, 101, 73, 100, 32, 60, 32, 109, 95, 110, 111, 100, 101, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

xj = A([ 48, 32, 60, 32, 109, 95, 110, 111, 100, 101, 67, 111, 117, 110, 116, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 68, 101, 115, 116, 114, 111, 121, 80, 114, 111, 120, 121, 40, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

Eh = A([ 48, 32, 60, 61, 32, 112, 114, 111, 120, 121, 73, 100, 32, 38, 38, 32, 112, 114, 111, 120, 121, 73, 100, 32, 60, 32, 109, 95, 110, 111, 100, 101, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

Nj = A([ 109, 95, 110, 111, 100, 101, 115, 91, 112, 114, 111, 120, 121, 73, 100, 93, 46, 73, 115, 76, 101, 97, 102, 40, 41, 0 ], "i8", t);

Mj = A([ 98, 111, 111, 108, 32, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 77, 111, 118, 101, 80, 114, 111, 120, 121, 40, 105, 110, 116, 51, 50, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 65, 65, 66, 66, 32, 38, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 86, 101, 99, 50, 32, 38, 41, 0 ], "i8", t);

Gj = A([ 118, 111, 105, 100, 32, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 73, 110, 115, 101, 114, 116, 76, 101, 97, 102, 40, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

Hj = A([ 99, 104, 105, 108, 100, 49, 32, 33, 61, 32, 40, 45, 49, 41, 0 ], "i8", t);

Ij = A([ 99, 104, 105, 108, 100, 50, 32, 33, 61, 32, 40, 45, 49, 41, 0 ], "i8", t);

Oj = A([ 105, 110, 116, 51, 50, 32, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 66, 97, 108, 97, 110, 99, 101, 40, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

Pj = A([ 105, 65, 32, 33, 61, 32, 40, 45, 49, 41, 0 ], "i8", t);

Qj = A([ 48, 32, 60, 61, 32, 105, 66, 32, 38, 38, 32, 105, 66, 32, 60, 32, 109, 95, 110, 111, 100, 101, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

Rj = A([ 48, 32, 60, 61, 32, 105, 67, 32, 38, 38, 32, 105, 67, 32, 60, 32, 109, 95, 110, 111, 100, 101, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

Sj = A([ 48, 32, 60, 61, 32, 105, 70, 32, 38, 38, 32, 105, 70, 32, 60, 32, 109, 95, 110, 111, 100, 101, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

Tj = A([ 48, 32, 60, 61, 32, 105, 71, 32, 38, 38, 32, 105, 71, 32, 60, 32, 109, 95, 110, 111, 100, 101, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

Uj = A([ 109, 95, 110, 111, 100, 101, 115, 91, 67, 45, 62, 112, 97, 114, 101, 110, 116, 93, 46, 99, 104, 105, 108, 100, 50, 32, 61, 61, 32, 105, 65, 0 ], "i8", t);

Vj = A([ 48, 32, 60, 61, 32, 105, 68, 32, 38, 38, 32, 105, 68, 32, 60, 32, 109, 95, 110, 111, 100, 101, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

Wj = A([ 48, 32, 60, 61, 32, 105, 69, 32, 38, 38, 32, 105, 69, 32, 60, 32, 109, 95, 110, 111, 100, 101, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

Xj = A([ 109, 95, 110, 111, 100, 101, 115, 91, 66, 45, 62, 112, 97, 114, 101, 110, 116, 93, 46, 99, 104, 105, 108, 100, 50, 32, 61, 61, 32, 105, 65, 0 ], "i8", t);

A([ 105, 110, 116, 51, 50, 32, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 67, 111, 109, 112, 117, 116, 101, 72, 101, 105, 103, 104, 116, 40, 105, 110, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 86, 97, 108, 105, 100, 97, 116, 101, 83, 116, 114, 117, 99, 116, 117, 114, 101, 40, 105, 110, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

A([ 109, 95, 110, 111, 100, 101, 115, 91, 105, 110, 100, 101, 120, 93, 46, 112, 97, 114, 101, 110, 116, 32, 61, 61, 32, 40, 45, 49, 41, 0 ], "i8", t);

A([ 99, 104, 105, 108, 100, 49, 32, 61, 61, 32, 40, 45, 49, 41, 0 ], "i8", t);

A([ 99, 104, 105, 108, 100, 50, 32, 61, 61, 32, 40, 45, 49, 41, 0 ], "i8", t);

A([ 110, 111, 100, 101, 45, 62, 104, 101, 105, 103, 104, 116, 32, 61, 61, 32, 48, 0 ], "i8", t);

A([ 48, 32, 60, 61, 32, 99, 104, 105, 108, 100, 49, 32, 38, 38, 32, 99, 104, 105, 108, 100, 49, 32, 60, 32, 109, 95, 110, 111, 100, 101, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

A([ 48, 32, 60, 61, 32, 99, 104, 105, 108, 100, 50, 32, 38, 38, 32, 99, 104, 105, 108, 100, 50, 32, 60, 32, 109, 95, 110, 111, 100, 101, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

A([ 109, 95, 110, 111, 100, 101, 115, 91, 99, 104, 105, 108, 100, 49, 93, 46, 112, 97, 114, 101, 110, 116, 32, 61, 61, 32, 105, 110, 100, 101, 120, 0 ], "i8", t);

A([ 109, 95, 110, 111, 100, 101, 115, 91, 99, 104, 105, 108, 100, 50, 93, 46, 112, 97, 114, 101, 110, 116, 32, 61, 61, 32, 105, 110, 100, 101, 120, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 86, 97, 108, 105, 100, 97, 116, 101, 77, 101, 116, 114, 105, 99, 115, 40, 105, 110, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

A([ 110, 111, 100, 101, 45, 62, 104, 101, 105, 103, 104, 116, 32, 61, 61, 32, 104, 101, 105, 103, 104, 116, 0 ], "i8", t);

A([ 97, 97, 98, 98, 46, 108, 111, 119, 101, 114, 66, 111, 117, 110, 100, 32, 61, 61, 32, 110, 111, 100, 101, 45, 62, 97, 97, 98, 98, 46, 108, 111, 119, 101, 114, 66, 111, 117, 110, 100, 0 ], "i8", t);

A([ 97, 97, 98, 98, 46, 117, 112, 112, 101, 114, 66, 111, 117, 110, 100, 32, 61, 61, 32, 110, 111, 100, 101, 45, 62, 97, 97, 98, 98, 46, 117, 112, 112, 101, 114, 66, 111, 117, 110, 100, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 86, 97, 108, 105, 100, 97, 116, 101, 40, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

A([ 48, 32, 60, 61, 32, 102, 114, 101, 101, 73, 110, 100, 101, 120, 32, 38, 38, 32, 102, 114, 101, 101, 73, 110, 100, 101, 120, 32, 60, 32, 109, 95, 110, 111, 100, 101, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

A([ 71, 101, 116, 72, 101, 105, 103, 104, 116, 40, 41, 32, 61, 61, 32, 67, 111, 109, 112, 117, 116, 101, 72, 101, 105, 103, 104, 116, 40, 41, 0 ], "i8", t);

A([ 109, 95, 110, 111, 100, 101, 67, 111, 117, 110, 116, 32, 43, 32, 102, 114, 101, 101, 67, 111, 117, 110, 116, 32, 61, 61, 32, 109, 95, 110, 111, 100, 101, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

A([ 105, 110, 116, 51, 50, 32, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 71, 101, 116, 77, 97, 120, 66, 97, 108, 97, 110, 99, 101, 40, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

A([ 110, 111, 100, 101, 45, 62, 73, 115, 76, 101, 97, 102, 40, 41, 32, 61, 61, 32, 102, 97, 108, 115, 101, 0 ], "i8", t);

Zj = A([ 0, 0, 130, 132, 134 ], "i8*", t);

A(1, "void*", t);

$j = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 67, 111, 110, 116, 97, 99, 116, 115, 47, 98, 50, 69, 100, 103, 101, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 46, 99, 112, 112, 0 ], "i8", t);

ak = A([ 98, 50, 69, 100, 103, 101, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 58, 58, 98, 50, 69, 100, 103, 101, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 40, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 41, 0 ], "i8", t);

Gp = A([ 50, 50, 98, 50, 69, 100, 103, 101, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 0 ], "i8", t);

Hp = A(3, "i8*", t);

dk = A([ 0, 0, 136, 138, 140 ], "i8*", t);

A(1, "void*", t);

ek = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 67, 111, 110, 116, 97, 99, 116, 115, 47, 98, 50, 69, 100, 103, 101, 65, 110, 100, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 46, 99, 112, 112, 0 ], "i8", t);

fk = A([ 98, 50, 69, 100, 103, 101, 65, 110, 100, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 58, 58, 98, 50, 69, 100, 103, 101, 65, 110, 100, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 40, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 41, 0 ], "i8", t);

bk = A([ 109, 95, 102, 105, 120, 116, 117, 114, 101, 65, 45, 62, 71, 101, 116, 84, 121, 112, 101, 40, 41, 32, 61, 61, 32, 98, 50, 83, 104, 97, 112, 101, 58, 58, 101, 95, 101, 100, 103, 101, 0 ], "i8", t);

Ip = A([ 50, 51, 98, 50, 69, 100, 103, 101, 65, 110, 100, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 0 ], "i8", t);

Jp = A(3, "i8*", t);

me = A([ 0, 0, 142, 144, 146, 148, 150, 152, 154, 156 ], "i8*", t);

A(1, "void*", t);

Kp = A([ 49, 49, 98, 50, 69, 100, 103, 101, 83, 104, 97, 112, 101, 0 ], "i8", t);

Lp = A(3, "i8*", t);

hk = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 98, 50, 70, 105, 120, 116, 117, 114, 101, 46, 99, 112, 112, 0 ], "i8", t);

ik = A([ 118, 111, 105, 100, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 58, 58, 68, 101, 115, 116, 114, 111, 121, 40, 98, 50, 66, 108, 111, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 32, 42, 41, 0 ], "i8", t);

jk = A([ 109, 95, 112, 114, 111, 120, 121, 67, 111, 117, 110, 116, 32, 61, 61, 32, 48, 0 ], "i8", t);

kk = A([ 118, 111, 105, 100, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 58, 58, 67, 114, 101, 97, 116, 101, 80, 114, 111, 120, 105, 101, 115, 40, 98, 50, 66, 114, 111, 97, 100, 80, 104, 97, 115, 101, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 41, 0 ], "i8", t);

A([ 32, 32, 32, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 68, 101, 102, 32, 102, 100, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 102, 100, 46, 102, 114, 105, 99, 116, 105, 111, 110, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 102, 100, 46, 114, 101, 115, 116, 105, 116, 117, 116, 105, 111, 110, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 102, 100, 46, 100, 101, 110, 115, 105, 116, 121, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 102, 100, 46, 105, 115, 83, 101, 110, 115, 111, 114, 32, 61, 32, 98, 111, 111, 108, 40, 37, 100, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 102, 100, 46, 102, 105, 108, 116, 101, 114, 46, 99, 97, 116, 101, 103, 111, 114, 121, 66, 105, 116, 115, 32, 61, 32, 117, 105, 110, 116, 49, 54, 40, 37, 100, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 102, 100, 46, 102, 105, 108, 116, 101, 114, 46, 109, 97, 115, 107, 66, 105, 116, 115, 32, 61, 32, 117, 105, 110, 116, 49, 54, 40, 37, 100, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 102, 100, 46, 102, 105, 108, 116, 101, 114, 46, 103, 114, 111, 117, 112, 73, 110, 100, 101, 120, 32, 61, 32, 105, 110, 116, 49, 54, 40, 37, 100, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 98, 50, 67, 105, 114, 99, 108, 101, 83, 104, 97, 112, 101, 32, 115, 104, 97, 112, 101, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 115, 104, 97, 112, 101, 46, 109, 95, 114, 97, 100, 105, 117, 115, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 115, 104, 97, 112, 101, 46, 109, 95, 112, 46, 83, 101, 116, 40, 37, 46, 49, 53, 108, 101, 102, 44, 32, 37, 46, 49, 53, 108, 101, 102, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 98, 50, 69, 100, 103, 101, 83, 104, 97, 112, 101, 32, 115, 104, 97, 112, 101, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 115, 104, 97, 112, 101, 46, 109, 95, 118, 101, 114, 116, 101, 120, 48, 46, 83, 101, 116, 40, 37, 46, 49, 53, 108, 101, 102, 44, 32, 37, 46, 49, 53, 108, 101, 102, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 115, 104, 97, 112, 101, 46, 109, 95, 118, 101, 114, 116, 101, 120, 49, 46, 83, 101, 116, 40, 37, 46, 49, 53, 108, 101, 102, 44, 32, 37, 46, 49, 53, 108, 101, 102, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 115, 104, 97, 112, 101, 46, 109, 95, 118, 101, 114, 116, 101, 120, 50, 46, 83, 101, 116, 40, 37, 46, 49, 53, 108, 101, 102, 44, 32, 37, 46, 49, 53, 108, 101, 102, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 115, 104, 97, 112, 101, 46, 109, 95, 118, 101, 114, 116, 101, 120, 51, 46, 83, 101, 116, 40, 37, 46, 49, 53, 108, 101, 102, 44, 32, 37, 46, 49, 53, 108, 101, 102, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 115, 104, 97, 112, 101, 46, 109, 95, 104, 97, 115, 86, 101, 114, 116, 101, 120, 48, 32, 61, 32, 98, 111, 111, 108, 40, 37, 100, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 115, 104, 97, 112, 101, 46, 109, 95, 104, 97, 115, 86, 101, 114, 116, 101, 120, 51, 32, 61, 32, 98, 111, 111, 108, 40, 37, 100, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 98, 50, 80, 111, 108, 121, 103, 111, 110, 83, 104, 97, 112, 101, 32, 115, 104, 97, 112, 101, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 98, 50, 86, 101, 99, 50, 32, 118, 115, 91, 37, 100, 93, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 118, 115, 91, 37, 100, 93, 46, 83, 101, 116, 40, 37, 46, 49, 53, 108, 101, 102, 44, 32, 37, 46, 49, 53, 108, 101, 102, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 115, 104, 97, 112, 101, 46, 83, 101, 116, 40, 118, 115, 44, 32, 37, 100, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 98, 50, 67, 104, 97, 105, 110, 83, 104, 97, 112, 101, 32, 115, 104, 97, 112, 101, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 115, 104, 97, 112, 101, 46, 67, 114, 101, 97, 116, 101, 67, 104, 97, 105, 110, 40, 118, 115, 44, 32, 37, 100, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 115, 104, 97, 112, 101, 46, 109, 95, 112, 114, 101, 118, 86, 101, 114, 116, 101, 120, 46, 83, 101, 116, 40, 37, 46, 49, 53, 108, 101, 102, 44, 32, 37, 46, 49, 53, 108, 101, 102, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 115, 104, 97, 112, 101, 46, 109, 95, 110, 101, 120, 116, 86, 101, 114, 116, 101, 120, 46, 83, 101, 116, 40, 37, 46, 49, 53, 108, 101, 102, 44, 32, 37, 46, 49, 53, 108, 101, 102, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 115, 104, 97, 112, 101, 46, 109, 95, 104, 97, 115, 80, 114, 101, 118, 86, 101, 114, 116, 101, 120, 32, 61, 32, 98, 111, 111, 108, 40, 37, 100, 41, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 115, 104, 97, 112, 101, 46, 109, 95, 104, 97, 115, 78, 101, 120, 116, 86, 101, 114, 116, 101, 120, 32, 61, 32, 98, 111, 111, 108, 40, 37, 100, 41, 59, 10, 0 ], "i8", t);

A([ 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 102, 100, 46, 115, 104, 97, 112, 101, 32, 61, 32, 38, 115, 104, 97, 112, 101, 59, 10, 0 ], "i8", t);

A([ 32, 32, 32, 32, 98, 111, 100, 105, 101, 115, 91, 37, 100, 93, 45, 62, 67, 114, 101, 97, 116, 101, 70, 105, 120, 116, 117, 114, 101, 40, 38, 102, 100, 41, 59, 10, 0 ], "i8", t);

mk = A([ 0, 0, 158, 160, 162, 164, 166, 168, 170, 172, 174, 176 ], "i8*", t);

A(1, "void*", t);

A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 74, 111, 105, 110, 116, 115, 47, 98, 50, 70, 114, 105, 99, 116, 105, 111, 110, 74, 111, 105, 110, 116, 46, 99, 112, 112, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 70, 114, 105, 99, 116, 105, 111, 110, 74, 111, 105, 110, 116, 58, 58, 83, 101, 116, 77, 97, 120, 70, 111, 114, 99, 101, 40, 102, 108, 111, 97, 116, 51, 50, 41, 0 ], "i8", t);

A([ 98, 50, 73, 115, 86, 97, 108, 105, 100, 40, 102, 111, 114, 99, 101, 41, 32, 38, 38, 32, 102, 111, 114, 99, 101, 32, 62, 61, 32, 48, 46, 48, 102, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 70, 114, 105, 99, 116, 105, 111, 110, 74, 111, 105, 110, 116, 58, 58, 83, 101, 116, 77, 97, 120, 84, 111, 114, 113, 117, 101, 40, 102, 108, 111, 97, 116, 51, 50, 41, 0 ], "i8", t);

A([ 98, 50, 73, 115, 86, 97, 108, 105, 100, 40, 116, 111, 114, 113, 117, 101, 41, 32, 38, 38, 32, 116, 111, 114, 113, 117, 101, 32, 62, 61, 32, 48, 46, 48, 102, 0 ], "i8", t);

pk = A([ 32, 32, 98, 50, 70, 114, 105, 99, 116, 105, 111, 110, 74, 111, 105, 110, 116, 68, 101, 102, 32, 106, 100, 59, 10, 0 ], "i8", t);

qk = A([ 32, 32, 106, 100, 46, 109, 97, 120, 70, 111, 114, 99, 101, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

rk = A([ 32, 32, 106, 100, 46, 109, 97, 120, 84, 111, 114, 113, 117, 101, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

Mp = A([ 49, 53, 98, 50, 70, 114, 105, 99, 116, 105, 111, 110, 74, 111, 105, 110, 116, 0 ], "i8", t);

Np = A(3, "i8*", t);

uk = A([ 0, 0, 178, 180, 182, 184, 186, 188, 190, 192, 194, 196 ], "i8*", t);

A(1, "void*", t);

vk = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 74, 111, 105, 110, 116, 115, 47, 98, 50, 71, 101, 97, 114, 74, 111, 105, 110, 116, 46, 99, 112, 112, 0 ], "i8", t);

wk = A([ 98, 50, 71, 101, 97, 114, 74, 111, 105, 110, 116, 58, 58, 98, 50, 71, 101, 97, 114, 74, 111, 105, 110, 116, 40, 99, 111, 110, 115, 116, 32, 98, 50, 71, 101, 97, 114, 74, 111, 105, 110, 116, 68, 101, 102, 32, 42, 41, 0 ], "i8", t);

xk = A([ 109, 95, 116, 121, 112, 101, 65, 32, 61, 61, 32, 101, 95, 114, 101, 118, 111, 108, 117, 116, 101, 74, 111, 105, 110, 116, 32, 124, 124, 32, 109, 95, 116, 121, 112, 101, 65, 32, 61, 61, 32, 101, 95, 112, 114, 105, 115, 109, 97, 116, 105, 99, 74, 111, 105, 110, 116, 0 ], "i8", t);

yk = A([ 109, 95, 116, 121, 112, 101, 66, 32, 61, 61, 32, 101, 95, 114, 101, 118, 111, 108, 117, 116, 101, 74, 111, 105, 110, 116, 32, 124, 124, 32, 109, 95, 116, 121, 112, 101, 66, 32, 61, 61, 32, 101, 95, 112, 114, 105, 115, 109, 97, 116, 105, 99, 74, 111, 105, 110, 116, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 71, 101, 97, 114, 74, 111, 105, 110, 116, 58, 58, 83, 101, 116, 82, 97, 116, 105, 111, 40, 102, 108, 111, 97, 116, 51, 50, 41, 0 ], "i8", t);

A([ 98, 50, 73, 115, 86, 97, 108, 105, 100, 40, 114, 97, 116, 105, 111, 41, 0 ], "i8", t);

Ck = A([ 32, 32, 98, 50, 71, 101, 97, 114, 74, 111, 105, 110, 116, 68, 101, 102, 32, 106, 100, 59, 10, 0 ], "i8", t);

Dk = A([ 32, 32, 106, 100, 46, 106, 111, 105, 110, 116, 49, 32, 61, 32, 106, 111, 105, 110, 116, 115, 91, 37, 100, 93, 59, 10, 0 ], "i8", t);

Ek = A([ 32, 32, 106, 100, 46, 106, 111, 105, 110, 116, 50, 32, 61, 32, 106, 111, 105, 110, 116, 115, 91, 37, 100, 93, 59, 10, 0 ], "i8", t);

Op = A([ 49, 49, 98, 50, 71, 101, 97, 114, 74, 111, 105, 110, 116, 0 ], "i8", t);

Pp = A(3, "i8*", t);

Tk = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 98, 50, 73, 115, 108, 97, 110, 100, 46, 99, 112, 112, 0 ], "i8", t);

Uk = A([ 118, 111, 105, 100, 32, 98, 50, 73, 115, 108, 97, 110, 100, 58, 58, 83, 111, 108, 118, 101, 84, 79, 73, 40, 99, 111, 110, 115, 116, 32, 98, 50, 84, 105, 109, 101, 83, 116, 101, 112, 32, 38, 44, 32, 105, 110, 116, 51, 50, 44, 32, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

al = A([ 116, 111, 105, 73, 110, 100, 101, 120, 65, 32, 60, 32, 109, 95, 98, 111, 100, 121, 67, 111, 117, 110, 116, 0 ], "i8", t);

bl = A([ 116, 111, 105, 73, 110, 100, 101, 120, 66, 32, 60, 32, 109, 95, 98, 111, 100, 121, 67, 111, 117, 110, 116, 0 ], "i8", t);

Pk = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 74, 111, 105, 110, 116, 115, 47, 98, 50, 74, 111, 105, 110, 116, 46, 99, 112, 112, 0 ], "i8", t);

A([ 115, 116, 97, 116, 105, 99, 32, 98, 50, 74, 111, 105, 110, 116, 32, 42, 98, 50, 74, 111, 105, 110, 116, 58, 58, 67, 114, 101, 97, 116, 101, 40, 99, 111, 110, 115, 116, 32, 98, 50, 74, 111, 105, 110, 116, 68, 101, 102, 32, 42, 44, 32, 98, 50, 66, 108, 111, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 32, 42, 41, 0 ], "i8", t);

A([ 115, 116, 97, 116, 105, 99, 32, 118, 111, 105, 100, 32, 98, 50, 74, 111, 105, 110, 116, 58, 58, 68, 101, 115, 116, 114, 111, 121, 40, 98, 50, 74, 111, 105, 110, 116, 32, 42, 44, 32, 98, 50, 66, 108, 111, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 32, 42, 41, 0 ], "i8", t);

Ok = A([ 0, 0, 46, 46, 46, 46, 198, 200, 202, 46, 46, 46 ], "i8*", t);

A(1, "void*", t);

Qk = A([ 98, 50, 74, 111, 105, 110, 116, 58, 58, 98, 50, 74, 111, 105, 110, 116, 40, 99, 111, 110, 115, 116, 32, 98, 50, 74, 111, 105, 110, 116, 68, 101, 102, 32, 42, 41, 0 ], "i8", t);

Rk = A([ 100, 101, 102, 45, 62, 98, 111, 100, 121, 65, 32, 33, 61, 32, 100, 101, 102, 45, 62, 98, 111, 100, 121, 66, 0 ], "i8", t);

Qp = A([ 47, 47, 32, 68, 117, 109, 112, 32, 105, 115, 32, 110, 111, 116, 32, 115, 117, 112, 112, 111, 114, 116, 101, 100, 32, 102, 111, 114, 32, 116, 104, 105, 115, 32, 106, 111, 105, 110, 116, 32, 116, 121, 112, 101, 46, 10, 0 ], "i8", t);

dd = A(2, "float", t);

tl = A([ 0, 0, 204, 206, 208, 210, 212, 214, 216, 218, 220, 222 ], "i8*", t);

A(1, "void*", t);

ul = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 74, 111, 105, 110, 116, 115, 47, 98, 50, 77, 111, 117, 115, 101, 74, 111, 105, 110, 116, 46, 99, 112, 112, 0 ], "i8", t);

vl = A([ 98, 50, 77, 111, 117, 115, 101, 74, 111, 105, 110, 116, 58, 58, 98, 50, 77, 111, 117, 115, 101, 74, 111, 105, 110, 116, 40, 99, 111, 110, 115, 116, 32, 98, 50, 77, 111, 117, 115, 101, 74, 111, 105, 110, 116, 68, 101, 102, 32, 42, 41, 0 ], "i8", t);

wl = A([ 100, 101, 102, 45, 62, 116, 97, 114, 103, 101, 116, 46, 73, 115, 86, 97, 108, 105, 100, 40, 41, 0 ], "i8", t);

xl = A([ 98, 50, 73, 115, 86, 97, 108, 105, 100, 40, 100, 101, 102, 45, 62, 109, 97, 120, 70, 111, 114, 99, 101, 41, 32, 38, 38, 32, 100, 101, 102, 45, 62, 109, 97, 120, 70, 111, 114, 99, 101, 32, 62, 61, 32, 48, 46, 48, 102, 0 ], "i8", t);

yl = A([ 98, 50, 73, 115, 86, 97, 108, 105, 100, 40, 100, 101, 102, 45, 62, 102, 114, 101, 113, 117, 101, 110, 99, 121, 72, 122, 41, 32, 38, 38, 32, 100, 101, 102, 45, 62, 102, 114, 101, 113, 117, 101, 110, 99, 121, 72, 122, 32, 62, 61, 32, 48, 46, 48, 102, 0 ], "i8", t);

zl = A([ 98, 50, 73, 115, 86, 97, 108, 105, 100, 40, 100, 101, 102, 45, 62, 100, 97, 109, 112, 105, 110, 103, 82, 97, 116, 105, 111, 41, 32, 38, 38, 32, 100, 101, 102, 45, 62, 100, 97, 109, 112, 105, 110, 103, 82, 97, 116, 105, 111, 32, 62, 61, 32, 48, 46, 48, 102, 0 ], "i8", t);

Bl = A([ 118, 105, 114, 116, 117, 97, 108, 32, 118, 111, 105, 100, 32, 98, 50, 77, 111, 117, 115, 101, 74, 111, 105, 110, 116, 58, 58, 73, 110, 105, 116, 86, 101, 108, 111, 99, 105, 116, 121, 67, 111, 110, 115, 116, 114, 97, 105, 110, 116, 115, 40, 99, 111, 110, 115, 116, 32, 98, 50, 83, 111, 108, 118, 101, 114, 68, 97, 116, 97, 32, 38, 41, 0 ], "i8", t);

Cl = A([ 100, 32, 43, 32, 104, 32, 42, 32, 107, 32, 62, 32, 49, 46, 49, 57, 50, 48, 57, 50, 57, 48, 69, 45, 48, 55, 70, 0 ], "i8", t);

Rp = A([ 49, 50, 98, 50, 77, 111, 117, 115, 101, 74, 111, 105, 110, 116, 0 ], "i8", t);

Sp = A(3, "i8*", t);

Tp = A([ 77, 111, 117, 115, 101, 32, 106, 111, 105, 110, 116, 32, 100, 117, 109, 112, 105, 110, 103, 32, 105, 115, 32, 110, 111, 116, 32, 115, 117, 112, 112, 111, 114, 116, 101, 100, 46, 10, 0 ], "i8", t);

Fl = A([ 0, 0, 224, 226, 228 ], "i8*", t);

A(1, "void*", t);

Gl = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 67, 111, 110, 116, 97, 99, 116, 115, 47, 98, 50, 80, 111, 108, 121, 103, 111, 110, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 46, 99, 112, 112, 0 ], "i8", t);

Hl = A([ 98, 50, 80, 111, 108, 121, 103, 111, 110, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 58, 58, 98, 50, 80, 111, 108, 121, 103, 111, 110, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 40, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 41, 0 ], "i8", t);

xe = A([ 109, 95, 102, 105, 120, 116, 117, 114, 101, 66, 45, 62, 71, 101, 116, 84, 121, 112, 101, 40, 41, 32, 61, 61, 32, 98, 50, 83, 104, 97, 112, 101, 58, 58, 101, 95, 99, 105, 114, 99, 108, 101, 0 ], "i8", t);

Up = A([ 50, 53, 98, 50, 80, 111, 108, 121, 103, 111, 110, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 0 ], "i8", t);

Vp = A(3, "i8*", t);

Kl = A([ 0, 0, 230, 232, 234 ], "i8*", t);

A(1, "void*", t);

Ll = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 67, 111, 110, 116, 97, 99, 116, 115, 47, 98, 50, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 46, 99, 112, 112, 0 ], "i8", t);

Ml = A([ 98, 50, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 58, 58, 98, 50, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 40, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 41, 0 ], "i8", t);

Il = A([ 109, 95, 102, 105, 120, 116, 117, 114, 101, 65, 45, 62, 71, 101, 116, 84, 121, 112, 101, 40, 41, 32, 61, 61, 32, 98, 50, 83, 104, 97, 112, 101, 58, 58, 101, 95, 112, 111, 108, 121, 103, 111, 110, 0 ], "i8", t);

Ce = A([ 109, 95, 102, 105, 120, 116, 117, 114, 101, 66, 45, 62, 71, 101, 116, 84, 121, 112, 101, 40, 41, 32, 61, 61, 32, 98, 50, 83, 104, 97, 112, 101, 58, 58, 101, 95, 112, 111, 108, 121, 103, 111, 110, 0 ], "i8", t);

Wp = A([ 49, 54, 98, 50, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 0 ], "i8", t);

Xp = A(3, "i8*", t);

Pl = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 108, 108, 105, 115, 105, 111, 110, 47, 83, 104, 97, 112, 101, 115, 47, 98, 50, 80, 111, 108, 121, 103, 111, 110, 83, 104, 97, 112, 101, 46, 99, 112, 112, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 80, 111, 108, 121, 103, 111, 110, 83, 104, 97, 112, 101, 58, 58, 83, 101, 116, 40, 99, 111, 110, 115, 116, 32, 98, 50, 86, 101, 99, 50, 32, 42, 44, 32, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

A([ 51, 32, 60, 61, 32, 99, 111, 117, 110, 116, 32, 38, 38, 32, 99, 111, 117, 110, 116, 32, 60, 61, 32, 56, 0 ], "i8", t);

A([ 101, 100, 103, 101, 46, 76, 101, 110, 103, 116, 104, 83, 113, 117, 97, 114, 101, 100, 40, 41, 32, 62, 32, 49, 46, 49, 57, 50, 48, 57, 50, 57, 48, 69, 45, 48, 55, 70, 32, 42, 32, 49, 46, 49, 57, 50, 48, 57, 50, 57, 48, 69, 45, 48, 55, 70, 0 ], "i8", t);

Ql = A([ 118, 105, 114, 116, 117, 97, 108, 32, 98, 111, 111, 108, 32, 98, 50, 80, 111, 108, 121, 103, 111, 110, 83, 104, 97, 112, 101, 58, 58, 82, 97, 121, 67, 97, 115, 116, 40, 98, 50, 82, 97, 121, 67, 97, 115, 116, 79, 117, 116, 112, 117, 116, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 82, 97, 121, 67, 97, 115, 116, 73, 110, 112, 117, 116, 32, 38, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 44, 32, 105, 110, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

Rl = A([ 48, 46, 48, 102, 32, 60, 61, 32, 108, 111, 119, 101, 114, 32, 38, 38, 32, 108, 111, 119, 101, 114, 32, 60, 61, 32, 105, 110, 112, 117, 116, 46, 109, 97, 120, 70, 114, 97, 99, 116, 105, 111, 110, 0 ], "i8", t);

Tl = A([ 118, 105, 114, 116, 117, 97, 108, 32, 118, 111, 105, 100, 32, 98, 50, 80, 111, 108, 121, 103, 111, 110, 83, 104, 97, 112, 101, 58, 58, 67, 111, 109, 112, 117, 116, 101, 77, 97, 115, 115, 40, 98, 50, 77, 97, 115, 115, 68, 97, 116, 97, 32, 42, 44, 32, 102, 108, 111, 97, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

Ul = A([ 109, 95, 118, 101, 114, 116, 101, 120, 67, 111, 117, 110, 116, 32, 62, 61, 32, 51, 0 ], "i8", t);

Vl = A([ 97, 114, 101, 97, 32, 62, 32, 49, 46, 49, 57, 50, 48, 57, 50, 57, 48, 69, 45, 48, 55, 70, 0 ], "i8", t);

Xl = A([ 0, 0, 236, 238, 240, 242, 244, 246, 248, 250 ], "i8*", t);

A(1, "void*", t);

Yp = A([ 49, 52, 98, 50, 80, 111, 108, 121, 103, 111, 110, 83, 104, 97, 112, 101, 0 ], "i8", t);

Zp = A(3, "i8*", t);

A([ 98, 50, 86, 101, 99, 50, 32, 67, 111, 109, 112, 117, 116, 101, 67, 101, 110, 116, 114, 111, 105, 100, 40, 99, 111, 110, 115, 116, 32, 98, 50, 86, 101, 99, 50, 32, 42, 44, 32, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

A([ 99, 111, 117, 110, 116, 32, 62, 61, 32, 51, 0 ], "i8", t);

bm = A([ 0, 0, 252, 254, 256, 258, 260, 262, 264, 266, 268, 270 ], "i8*", t);

A(1, "void*", t);

A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 74, 111, 105, 110, 116, 115, 47, 98, 50, 80, 114, 105, 115, 109, 97, 116, 105, 99, 74, 111, 105, 110, 116, 46, 99, 112, 112, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 80, 114, 105, 115, 109, 97, 116, 105, 99, 74, 111, 105, 110, 116, 58, 58, 83, 101, 116, 76, 105, 109, 105, 116, 115, 40, 102, 108, 111, 97, 116, 51, 50, 44, 32, 102, 108, 111, 97, 116, 51, 50, 41, 0 ], "i8", t);

km = A([ 32, 32, 98, 50, 80, 114, 105, 115, 109, 97, 116, 105, 99, 74, 111, 105, 110, 116, 68, 101, 102, 32, 106, 100, 59, 10, 0 ], "i8", t);

om = A([ 32, 32, 106, 100, 46, 108, 111, 119, 101, 114, 84, 114, 97, 110, 115, 108, 97, 116, 105, 111, 110, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

pm = A([ 32, 32, 106, 100, 46, 117, 112, 112, 101, 114, 84, 114, 97, 110, 115, 108, 97, 116, 105, 111, 110, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

sm = A([ 32, 32, 106, 100, 46, 109, 97, 120, 77, 111, 116, 111, 114, 70, 111, 114, 99, 101, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

$p = A([ 49, 54, 98, 50, 80, 114, 105, 115, 109, 97, 116, 105, 99, 74, 111, 105, 110, 116, 0 ], "i8", t);

aq = A(3, "i8*", t);

vm = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 74, 111, 105, 110, 116, 115, 47, 98, 50, 80, 117, 108, 108, 101, 121, 74, 111, 105, 110, 116, 46, 99, 112, 112, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 80, 117, 108, 108, 101, 121, 74, 111, 105, 110, 116, 68, 101, 102, 58, 58, 73, 110, 105, 116, 105, 97, 108, 105, 122, 101, 40, 98, 50, 66, 111, 100, 121, 32, 42, 44, 32, 98, 50, 66, 111, 100, 121, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 86, 101, 99, 50, 32, 38, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 86, 101, 99, 50, 32, 38, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 86, 101, 99, 50, 32, 38, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 86, 101, 99, 50, 32, 38, 44, 32, 102, 108, 111, 97, 116, 51, 50, 41, 0 ], "i8", t);

A([ 114, 97, 116, 105, 111, 32, 62, 32, 49, 46, 49, 57, 50, 48, 57, 50, 57, 48, 69, 45, 48, 55, 70, 0 ], "i8", t);

um = A([ 0, 0, 272, 274, 276, 278, 280, 282, 284, 286, 288, 290 ], "i8*", t);

A(1, "void*", t);

wm = A([ 98, 50, 80, 117, 108, 108, 101, 121, 74, 111, 105, 110, 116, 58, 58, 98, 50, 80, 117, 108, 108, 101, 121, 74, 111, 105, 110, 116, 40, 99, 111, 110, 115, 116, 32, 98, 50, 80, 117, 108, 108, 101, 121, 74, 111, 105, 110, 116, 68, 101, 102, 32, 42, 41, 0 ], "i8", t);

xm = A([ 100, 101, 102, 45, 62, 114, 97, 116, 105, 111, 32, 33, 61, 32, 48, 46, 48, 102, 0 ], "i8", t);

Bm = A([ 32, 32, 98, 50, 80, 117, 108, 108, 101, 121, 74, 111, 105, 110, 116, 68, 101, 102, 32, 106, 100, 59, 10, 0 ], "i8", t);

Cm = A([ 32, 32, 106, 100, 46, 103, 114, 111, 117, 110, 100, 65, 110, 99, 104, 111, 114, 65, 46, 83, 101, 116, 40, 37, 46, 49, 53, 108, 101, 102, 44, 32, 37, 46, 49, 53, 108, 101, 102, 41, 59, 10, 0 ], "i8", t);

Dm = A([ 32, 32, 106, 100, 46, 103, 114, 111, 117, 110, 100, 65, 110, 99, 104, 111, 114, 66, 46, 83, 101, 116, 40, 37, 46, 49, 53, 108, 101, 102, 44, 32, 37, 46, 49, 53, 108, 101, 102, 41, 59, 10, 0 ], "i8", t);

Em = A([ 32, 32, 106, 100, 46, 108, 101, 110, 103, 116, 104, 65, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

Fm = A([ 32, 32, 106, 100, 46, 108, 101, 110, 103, 116, 104, 66, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

Fk = A([ 32, 32, 106, 100, 46, 114, 97, 116, 105, 111, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

bq = A([ 49, 51, 98, 50, 80, 117, 108, 108, 101, 121, 74, 111, 105, 110, 116, 0 ], "i8", t);

cq = A(3, "i8*", t);

Hm = A([ 0, 0, 292, 294, 296, 298, 300, 302, 304, 306, 308, 310 ], "i8*", t);

A(1, "void*", t);

A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 74, 111, 105, 110, 116, 115, 47, 98, 50, 82, 101, 118, 111, 108, 117, 116, 101, 74, 111, 105, 110, 116, 46, 99, 112, 112, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 82, 101, 118, 111, 108, 117, 116, 101, 74, 111, 105, 110, 116, 58, 58, 83, 101, 116, 76, 105, 109, 105, 116, 115, 40, 102, 108, 111, 97, 116, 51, 50, 44, 32, 102, 108, 111, 97, 116, 51, 50, 41, 0 ], "i8", t);

A([ 108, 111, 119, 101, 114, 32, 60, 61, 32, 117, 112, 112, 101, 114, 0 ], "i8", t);

Nm = A([ 32, 32, 98, 50, 82, 101, 118, 111, 108, 117, 116, 101, 74, 111, 105, 110, 116, 68, 101, 102, 32, 106, 100, 59, 10, 0 ], "i8", t);

nm = A([ 32, 32, 106, 100, 46, 101, 110, 97, 98, 108, 101, 76, 105, 109, 105, 116, 32, 61, 32, 98, 111, 111, 108, 40, 37, 100, 41, 59, 10, 0 ], "i8", t);

Om = A([ 32, 32, 106, 100, 46, 108, 111, 119, 101, 114, 65, 110, 103, 108, 101, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

Pm = A([ 32, 32, 106, 100, 46, 117, 112, 112, 101, 114, 65, 110, 103, 108, 101, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

dq = A([ 49, 53, 98, 50, 82, 101, 118, 111, 108, 117, 116, 101, 74, 111, 105, 110, 116, 0 ], "i8", t);

eq = A(3, "i8*", t);

A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 82, 111, 112, 101, 47, 98, 50, 82, 111, 112, 101, 46, 99, 112, 112, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 82, 111, 112, 101, 58, 58, 73, 110, 105, 116, 105, 97, 108, 105, 122, 101, 40, 99, 111, 110, 115, 116, 32, 98, 50, 82, 111, 112, 101, 68, 101, 102, 32, 42, 41, 0 ], "i8", t);

A([ 100, 101, 102, 45, 62, 99, 111, 117, 110, 116, 32, 62, 61, 32, 51, 0 ], "i8", t);

Sm = A([ 0, 0, 312, 314, 316, 318, 320, 322, 324, 326, 328, 330 ], "i8*", t);

A(1, "void*", t);

Vm = A([ 32, 32, 98, 50, 82, 111, 112, 101, 74, 111, 105, 110, 116, 68, 101, 102, 32, 106, 100, 59, 10, 0 ], "i8", t);

Wm = A([ 32, 32, 106, 100, 46, 109, 97, 120, 76, 101, 110, 103, 116, 104, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

fq = A([ 49, 49, 98, 50, 82, 111, 112, 101, 74, 111, 105, 110, 116, 0 ], "i8", t);

vq = A(3, "i8*", t);

A([ 2, 2, 1 ], "i32", t);

Zm = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 109, 109, 111, 110, 47, 98, 50, 83, 116, 97, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 46, 99, 112, 112, 0 ], "i8", t);

$m = A([ 98, 50, 83, 116, 97, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 58, 58, 126, 98, 50, 83, 116, 97, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 40, 41, 0 ], "i8", t);

an = A([ 109, 95, 105, 110, 100, 101, 120, 32, 61, 61, 32, 48, 0 ], "i8", t);

bn = A([ 109, 95, 101, 110, 116, 114, 121, 67, 111, 117, 110, 116, 32, 61, 61, 32, 48, 0 ], "i8", t);

jn = A([ 118, 111, 105, 100, 32, 42, 98, 50, 83, 116, 97, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 58, 58, 65, 108, 108, 111, 99, 97, 116, 101, 40, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

kn = A([ 109, 95, 101, 110, 116, 114, 121, 67, 111, 117, 110, 116, 32, 60, 32, 98, 50, 95, 109, 97, 120, 83, 116, 97, 99, 107, 69, 110, 116, 114, 105, 101, 115, 0 ], "i8", t);

cn = A([ 118, 111, 105, 100, 32, 98, 50, 83, 116, 97, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 58, 58, 70, 114, 101, 101, 40, 118, 111, 105, 100, 32, 42, 41, 0 ], "i8", t);

dn = A([ 109, 95, 101, 110, 116, 114, 121, 67, 111, 117, 110, 116, 32, 62, 32, 48, 0 ], "i8", t);

en = A([ 112, 32, 61, 61, 32, 101, 110, 116, 114, 121, 45, 62, 100, 97, 116, 97, 0 ], "i8", t);

nn = A(1, "i32", t);

xn = A(1, "i32", t);

yn = A(1, "i32", t);

vn = A(1, "i32", t);

wn = A(1, "i32", t);

pn = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 108, 108, 105, 115, 105, 111, 110, 47, 98, 50, 84, 105, 109, 101, 79, 102, 73, 109, 112, 97, 99, 116, 46, 99, 112, 112, 0 ], "i8", t);

qn = A([ 118, 111, 105, 100, 32, 98, 50, 84, 105, 109, 101, 79, 102, 73, 109, 112, 97, 99, 116, 40, 98, 50, 84, 79, 73, 79, 117, 116, 112, 117, 116, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 79, 73, 73, 110, 112, 117, 116, 32, 42, 41, 0 ], "i8", t);

rn = A([ 116, 97, 114, 103, 101, 116, 32, 62, 32, 116, 111, 108, 101, 114, 97, 110, 99, 101, 0 ], "i8", t);

Fn = A([ 102, 108, 111, 97, 116, 51, 50, 32, 98, 50, 83, 101, 112, 97, 114, 97, 116, 105, 111, 110, 70, 117, 110, 99, 116, 105, 111, 110, 58, 58, 69, 118, 97, 108, 117, 97, 116, 101, 40, 105, 110, 116, 51, 50, 44, 32, 105, 110, 116, 51, 50, 44, 32, 102, 108, 111, 97, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

Bi = A([ 102, 97, 108, 115, 101, 0 ], "i8", t);

Cn = A([ 102, 108, 111, 97, 116, 51, 50, 32, 98, 50, 83, 101, 112, 97, 114, 97, 116, 105, 111, 110, 70, 117, 110, 99, 116, 105, 111, 110, 58, 58, 70, 105, 110, 100, 77, 105, 110, 83, 101, 112, 97, 114, 97, 116, 105, 111, 110, 40, 105, 110, 116, 51, 50, 32, 42, 44, 32, 105, 110, 116, 51, 50, 32, 42, 44, 32, 102, 108, 111, 97, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

An = A([ 102, 108, 111, 97, 116, 51, 50, 32, 98, 50, 83, 101, 112, 97, 114, 97, 116, 105, 111, 110, 70, 117, 110, 99, 116, 105, 111, 110, 58, 58, 73, 110, 105, 116, 105, 97, 108, 105, 122, 101, 40, 99, 111, 110, 115, 116, 32, 98, 50, 83, 105, 109, 112, 108, 101, 120, 67, 97, 99, 104, 101, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 80, 114, 111, 120, 121, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 83, 119, 101, 101, 112, 32, 38, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 80, 114, 111, 120, 121, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 83, 119, 101, 101, 112, 32, 38, 44, 32, 102, 108, 111, 97, 116, 51, 50, 41, 0 ], "i8", t);

Bn = A([ 48, 32, 60, 32, 99, 111, 117, 110, 116, 32, 38, 38, 32, 99, 111, 117, 110, 116, 32, 60, 32, 51, 0 ], "i8", t);

En = A([ 0, 0, 332, 334, 336, 338, 340, 342, 344, 346, 348, 350 ], "i8*", t);

A(1, "void*", t);

Jn = A([ 32, 32, 98, 50, 87, 101, 108, 100, 74, 111, 105, 110, 116, 68, 101, 102, 32, 106, 100, 59, 10, 0 ], "i8", t);

mm = A([ 32, 32, 106, 100, 46, 114, 101, 102, 101, 114, 101, 110, 99, 101, 65, 110, 103, 108, 101, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

wq = A([ 49, 49, 98, 50, 87, 101, 108, 100, 74, 111, 105, 110, 116, 0 ], "i8", t);

xq = A(3, "i8*", t);

Pn = A([ 0, 0, 352, 354, 356, 358, 360, 362, 364, 366, 368, 370 ], "i8*", t);

A(1, "void*", t);

Tn = A([ 32, 32, 98, 50, 87, 104, 101, 101, 108, 74, 111, 105, 110, 116, 68, 101, 102, 32, 106, 100, 59, 10, 0 ], "i8", t);

gj = A([ 32, 32, 106, 100, 46, 98, 111, 100, 121, 65, 32, 61, 32, 98, 111, 100, 105, 101, 115, 91, 37, 100, 93, 59, 10, 0 ], "i8", t);

hj = A([ 32, 32, 106, 100, 46, 98, 111, 100, 121, 66, 32, 61, 32, 98, 111, 100, 105, 101, 115, 91, 37, 100, 93, 59, 10, 0 ], "i8", t);

ij = A([ 32, 32, 106, 100, 46, 99, 111, 108, 108, 105, 100, 101, 67, 111, 110, 110, 101, 99, 116, 101, 100, 32, 61, 32, 98, 111, 111, 108, 40, 37, 100, 41, 59, 10, 0 ], "i8", t);

jj = A([ 32, 32, 106, 100, 46, 108, 111, 99, 97, 108, 65, 110, 99, 104, 111, 114, 65, 46, 83, 101, 116, 40, 37, 46, 49, 53, 108, 101, 102, 44, 32, 37, 46, 49, 53, 108, 101, 102, 41, 59, 10, 0 ], "i8", t);

kj = A([ 32, 32, 106, 100, 46, 108, 111, 99, 97, 108, 65, 110, 99, 104, 111, 114, 66, 46, 83, 101, 116, 40, 37, 46, 49, 53, 108, 101, 102, 44, 32, 37, 46, 49, 53, 108, 101, 102, 41, 59, 10, 0 ], "i8", t);

lm = A([ 32, 32, 106, 100, 46, 108, 111, 99, 97, 108, 65, 120, 105, 115, 65, 46, 83, 101, 116, 40, 37, 46, 49, 53, 108, 101, 102, 44, 32, 37, 46, 49, 53, 108, 101, 102, 41, 59, 10, 0 ], "i8", t);

qm = A([ 32, 32, 106, 100, 46, 101, 110, 97, 98, 108, 101, 77, 111, 116, 111, 114, 32, 61, 32, 98, 111, 111, 108, 40, 37, 100, 41, 59, 10, 0 ], "i8", t);

rm = A([ 32, 32, 106, 100, 46, 109, 111, 116, 111, 114, 83, 112, 101, 101, 100, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

Qm = A([ 32, 32, 106, 100, 46, 109, 97, 120, 77, 111, 116, 111, 114, 84, 111, 114, 113, 117, 101, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

mj = A([ 32, 32, 106, 100, 46, 102, 114, 101, 113, 117, 101, 110, 99, 121, 72, 122, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

nj = A([ 32, 32, 106, 100, 46, 100, 97, 109, 112, 105, 110, 103, 82, 97, 116, 105, 111, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

oj = A([ 32, 32, 106, 111, 105, 110, 116, 115, 91, 37, 100, 93, 32, 61, 32, 109, 95, 119, 111, 114, 108, 100, 45, 62, 67, 114, 101, 97, 116, 101, 74, 111, 105, 110, 116, 40, 38, 106, 100, 41, 59, 10, 0 ], "i8", t);

yq = A([ 49, 50, 98, 50, 87, 104, 101, 101, 108, 74, 111, 105, 110, 116, 0 ], "i8", t);

zq = A(3, "i8*", t);

Yn = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 98, 50, 87, 111, 114, 108, 100, 46, 99, 112, 112, 0 ], "i8", t);

Zn = A([ 98, 50, 66, 111, 100, 121, 32, 42, 98, 50, 87, 111, 114, 108, 100, 58, 58, 67, 114, 101, 97, 116, 101, 66, 111, 100, 121, 40, 99, 111, 110, 115, 116, 32, 98, 50, 66, 111, 100, 121, 68, 101, 102, 32, 42, 41, 0 ], "i8", t);

$n = A([ 73, 115, 76, 111, 99, 107, 101, 100, 40, 41, 32, 61, 61, 32, 102, 97, 108, 115, 101, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 87, 111, 114, 108, 100, 58, 58, 68, 101, 115, 116, 114, 111, 121, 66, 111, 100, 121, 40, 98, 50, 66, 111, 100, 121, 32, 42, 41, 0 ], "i8", t);

A([ 109, 95, 98, 111, 100, 121, 67, 111, 117, 110, 116, 32, 62, 32, 48, 0 ], "i8", t);

A([ 98, 50, 74, 111, 105, 110, 116, 32, 42, 98, 50, 87, 111, 114, 108, 100, 58, 58, 67, 114, 101, 97, 116, 101, 74, 111, 105, 110, 116, 40, 99, 111, 110, 115, 116, 32, 98, 50, 74, 111, 105, 110, 116, 68, 101, 102, 32, 42, 41, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 87, 111, 114, 108, 100, 58, 58, 68, 101, 115, 116, 114, 111, 121, 74, 111, 105, 110, 116, 40, 98, 50, 74, 111, 105, 110, 116, 32, 42, 41, 0 ], "i8", t);

A([ 109, 95, 106, 111, 105, 110, 116, 67, 111, 117, 110, 116, 32, 62, 32, 48, 0 ], "i8", t);

ko = A([ 118, 111, 105, 100, 32, 98, 50, 87, 111, 114, 108, 100, 58, 58, 83, 111, 108, 118, 101, 40, 99, 111, 110, 115, 116, 32, 98, 50, 84, 105, 109, 101, 83, 116, 101, 112, 32, 38, 41, 0 ], "i8", t);

lo = A([ 98, 45, 62, 73, 115, 65, 99, 116, 105, 118, 101, 40, 41, 32, 61, 61, 32, 116, 114, 117, 101, 0 ], "i8", t);

mo = A([ 115, 116, 97, 99, 107, 67, 111, 117, 110, 116, 32, 60, 32, 115, 116, 97, 99, 107, 83, 105, 122, 101, 0 ], "i8", t);

qo = A([ 118, 111, 105, 100, 32, 98, 50, 87, 111, 114, 108, 100, 58, 58, 83, 111, 108, 118, 101, 84, 79, 73, 40, 99, 111, 110, 115, 116, 32, 98, 50, 84, 105, 109, 101, 83, 116, 101, 112, 32, 38, 41, 0 ], "i8", t);

ro = A([ 116, 121, 112, 101, 65, 32, 61, 61, 32, 98, 50, 95, 100, 121, 110, 97, 109, 105, 99, 66, 111, 100, 121, 32, 124, 124, 32, 116, 121, 112, 101, 66, 32, 61, 61, 32, 98, 50, 95, 100, 121, 110, 97, 109, 105, 99, 66, 111, 100, 121, 0 ], "i8", t);

to = A([ 97, 108, 112, 104, 97, 48, 32, 60, 32, 49, 46, 48, 102, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 87, 111, 114, 108, 100, 58, 58, 68, 114, 97, 119, 83, 104, 97, 112, 101, 40, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 67, 111, 108, 111, 114, 32, 38, 41, 0 ], "i8", t);

A([ 118, 101, 114, 116, 101, 120, 67, 111, 117, 110, 116, 32, 60, 61, 32, 56, 0 ], "i8", t);

A([ 98, 50, 86, 101, 99, 50, 32, 103, 40, 37, 46, 49, 53, 108, 101, 102, 44, 32, 37, 46, 49, 53, 108, 101, 102, 41, 59, 10, 0 ], "i8", t);

A([ 109, 95, 119, 111, 114, 108, 100, 45, 62, 83, 101, 116, 71, 114, 97, 118, 105, 116, 121, 40, 103, 41, 59, 10, 0 ], "i8", t);

A([ 98, 50, 66, 111, 100, 121, 42, 42, 32, 98, 111, 100, 105, 101, 115, 32, 61, 32, 40, 98, 50, 66, 111, 100, 121, 42, 42, 41, 98, 50, 65, 108, 108, 111, 99, 40, 37, 100, 32, 42, 32, 115, 105, 122, 101, 111, 102, 40, 98, 50, 66, 111, 100, 121, 42, 41, 41, 59, 10, 0 ], "i8", t);

A([ 98, 50, 74, 111, 105, 110, 116, 42, 42, 32, 106, 111, 105, 110, 116, 115, 32, 61, 32, 40, 98, 50, 74, 111, 105, 110, 116, 42, 42, 41, 98, 50, 65, 108, 108, 111, 99, 40, 37, 100, 32, 42, 32, 115, 105, 122, 101, 111, 102, 40, 98, 50, 74, 111, 105, 110, 116, 42, 41, 41, 59, 10, 0 ], "i8", t);

A([ 123, 10, 0 ], "i8", t);

A([ 125, 10, 0 ], "i8", t);

A([ 98, 50, 70, 114, 101, 101, 40, 106, 111, 105, 110, 116, 115, 41, 59, 10, 0 ], "i8", t);

A([ 98, 50, 70, 114, 101, 101, 40, 98, 111, 100, 105, 101, 115, 41, 59, 10, 0 ], "i8", t);

A([ 106, 111, 105, 110, 116, 115, 32, 61, 32, 78, 85, 76, 76, 59, 10, 0 ], "i8", t);

A([ 98, 111, 100, 105, 101, 115, 32, 61, 32, 78, 85, 76, 76, 59, 10, 0 ], "i8", t);

Ch = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 108, 108, 105, 115, 105, 111, 110, 47, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 46, 104, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 82, 97, 121, 67, 97, 115, 116, 40, 98, 50, 87, 111, 114, 108, 100, 82, 97, 121, 67, 97, 115, 116, 87, 114, 97, 112, 112, 101, 114, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 82, 97, 121, 67, 97, 115, 116, 73, 110, 112, 117, 116, 32, 38, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

A([ 114, 46, 76, 101, 110, 103, 116, 104, 83, 113, 117, 97, 114, 101, 100, 40, 41, 32, 62, 32, 48, 46, 48, 102, 0 ], "i8", t);

vo = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 109, 109, 111, 110, 47, 98, 50, 77, 97, 116, 104, 46, 104, 0 ], "i8", t);

wo = A([ 118, 111, 105, 100, 32, 98, 50, 83, 119, 101, 101, 112, 58, 58, 65, 100, 118, 97, 110, 99, 101, 40, 102, 108, 111, 97, 116, 51, 50, 41, 0 ], "i8", t);

co = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 98, 50, 73, 115, 108, 97, 110, 100, 46, 104, 0 ], "i8", t);

no = A([ 118, 111, 105, 100, 32, 98, 50, 73, 115, 108, 97, 110, 100, 58, 58, 65, 100, 100, 40, 98, 50, 74, 111, 105, 110, 116, 32, 42, 41, 0 ], "i8", t);

oo = A([ 109, 95, 106, 111, 105, 110, 116, 67, 111, 117, 110, 116, 32, 60, 32, 109, 95, 106, 111, 105, 110, 116, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

ho = A([ 118, 111, 105, 100, 32, 98, 50, 73, 115, 108, 97, 110, 100, 58, 58, 65, 100, 100, 40, 98, 50, 67, 111, 110, 116, 97, 99, 116, 32, 42, 41, 0 ], "i8", t);

io = A([ 109, 95, 99, 111, 110, 116, 97, 99, 116, 67, 111, 117, 110, 116, 32, 60, 32, 109, 95, 99, 111, 110, 116, 97, 99, 116, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

eo = A([ 118, 111, 105, 100, 32, 98, 50, 73, 115, 108, 97, 110, 100, 58, 58, 65, 100, 100, 40, 98, 50, 66, 111, 100, 121, 32, 42, 41, 0 ], "i8", t);

fo = A([ 109, 95, 98, 111, 100, 121, 67, 111, 117, 110, 116, 32, 60, 32, 109, 95, 98, 111, 100, 121, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

yp = A([ 0, 0, 30, 372, 374 ], "i8*", t);

A(1, "void*", t);

Aq = A([ 49, 53, 98, 50, 67, 111, 110, 116, 97, 99, 116, 70, 105, 108, 116, 101, 114, 0 ], "i8", t);

Bq = A(2, "i8*", t);

Eo = A([ 37, 102, 10, 0 ], "i8", t);

b[se + 1] = jp;

ep = A([ 2, 0 ], [ "i8*", 0 ], t);

gp = A([ 1, 0 ], [ "i8*", 0 ], t);

b[ip] = gp + 2;

b[ip + 1] = hp;

b[jp] = ep + 2;

b[jp + 1] = fp;

b[jp + 2] = ip;

b[le + 1] = lp;

b[lp] = gp + 2;

b[lp + 1] = kp;

b[ze + 1] = np;

b[np] = ep + 2;

b[np + 1] = mp;

b[np + 2] = ip;

b[oe + 1] = pp;

b[pp] = ep + 2;

b[pp + 1] = op;

b[pp + 2] = lp;

b[Ve + 1] = rp;

b[rp] = ep + 2;

b[rp + 1] = qp;

b[rp + 2] = ip;

b[sp + 1] = up;

b[up] = ep + 2;

b[up + 1] = tp;

b[up + 2] = lp;

b[vh + 1] = ip;

b[vp + 1] = xp;

b[xp] = gp + 2;

b[xp + 1] = wp;

b[Zi + 1] = Cp;

b[Bp] = gp + 2;

b[Bp + 1] = Ap;

b[Cp] = ep + 2;

b[Cp + 1] = zp;

b[Cp + 2] = Bp;

b[Dp + 1] = Fp;

b[Fp] = gp + 2;

b[Fp + 1] = Ep;

b[Zj + 1] = Hp;

b[Hp] = ep + 2;

b[Hp + 1] = Gp;

b[Hp + 2] = ip;

b[dk + 1] = Jp;

b[Jp] = ep + 2;

b[Jp + 1] = Ip;

b[Jp + 2] = ip;

b[me + 1] = Lp;

b[Lp] = ep + 2;

b[Lp + 1] = Kp;

b[Lp + 2] = lp;

b[mk + 1] = Np;

b[Np] = ep + 2;

b[Np + 1] = Mp;

b[Np + 2] = Bp;

b[uk + 1] = Pp;

b[Pp] = ep + 2;

b[Pp + 1] = Op;

b[Pp + 2] = Bp;

b[Ok + 1] = Bp;

b[tl + 1] = Sp;

b[Sp] = ep + 2;

b[Sp + 1] = Rp;

b[Sp + 2] = Bp;

b[Fl + 1] = Vp;

b[Vp] = ep + 2;

b[Vp + 1] = Up;

b[Vp + 2] = ip;

b[Kl + 1] = Xp;

b[Xp] = ep + 2;

b[Xp + 1] = Wp;

b[Xp + 2] = ip;

b[Xl + 1] = Zp;

b[Zp] = ep + 2;

b[Zp + 1] = Yp;

b[Zp + 2] = lp;

b[bm + 1] = aq;

b[aq] = ep + 2;

b[aq + 1] = $p;

b[aq + 2] = Bp;

b[um + 1] = cq;

b[cq] = ep + 2;

b[cq + 1] = bq;

b[cq + 2] = Bp;

b[Hm + 1] = eq;

b[eq] = ep + 2;

b[eq + 1] = dq;

b[eq + 2] = Bp;

b[Sm + 1] = vq;

b[vq] = ep + 2;

b[vq + 1] = fq;

b[vq + 2] = Bp;

b[En + 1] = xq;

b[xq] = ep + 2;

b[xq + 1] = wq;

b[xq + 2] = Bp;

b[Pn + 1] = zq;

b[zq] = ep + 2;

b[zq + 1] = yq;

b[zq + 2] = Bp;

b[yp + 1] = Bq;

b[Bq] = gp + 2;

b[Bq + 1] = Aq;

mb = [ 0, 0, (function(c, f, d, e, g) {
  e = qc(g, 144);
  if (0 == e) var i = 0, f = 2; else f = 1;
  1 == f && (Ue(e, c, d), i = e);
  return i;
}), 0, (function(c, f) {
  mb[b[b[c] + 1]](c);
  Mb(f, c, 144);
}), 0, (function(c, f, d, e, g) {
  e = qc(g, 144);
  if (0 == e) var i = 0, f = 2; else f = 1;
  1 == f && (El(e, c, d), i = e);
  return i;
}), 0, (function(c, f) {
  mb[b[b[c] + 1]](c);
  Mb(f, c, 144);
}), 0, (function(c, f, d, e, g) {
  e = qc(g, 144);
  if (0 == e) var i = 0, f = 2; else f = 1;
  1 == f && (Jl(e, c, d), i = e);
  return i;
}), 0, (function(c, f) {
  mb[b[b[c] + 1]](c);
  Mb(f, c, 144);
}), 0, (function(c, f, d, e, g) {
  e = qc(g, 144);
  if (0 == e) var i = 0, f = 2; else f = 1;
  1 == f && (Yj(e, c, d), i = e);
  return i;
}), 0, (function(c, f) {
  mb[b[b[c] + 1]](c);
  Mb(f, c, 144);
}), 0, (function(c, f, d, e, g) {
  e = qc(g, 144);
  if (0 == e) var i = 0, f = 2; else f = 1;
  1 == f && (ck(e, c, d), i = e);
  return i;
}), 0, (function(c, f) {
  mb[b[b[c] + 1]](c);
  Mb(f, c, 144);
}), 0, (function(c, f, d, e, g) {
  var i;
  i = qc(g, 144);
  if (0 == i) var h = 0, g = 2; else g = 1;
  1 == g && (qe(i, c, f, d, e), h = i);
  return h;
}), 0, (function(c, f) {
  mb[b[b[c] + 1]](c);
  Mb(f, c, 144);
}), 0, (function(c, f, d, e, g) {
  var i;
  i = qc(g, 144);
  if (0 == i) var h = 0, g = 2; else g = 1;
  1 == g && (ye(i, c, f, d, e), h = i);
  return h;
}), 0, (function(c, f) {
  mb[b[b[c] + 1]](c);
  Mb(f, c, 144);
}), 0, ia(), 0, ia(), 0, (function(c, f) {
  var d, e;
  d = b[c] < b[f] ? 1 : 2;
  1 == d ? e = 1 : 2 == d && (d = b[c] == b[f] ? 3 : 4, 3 == d ? e = b[c + 1] < b[f + 1] : 4 == d && (e = 0));
  return e;
}), 0, (function(c, f, d, e) {
  var g = a;
  a += 13;
  var i;
  i = je(b[c + 12]);
  ke(g);
  Ie(i, g, b[c + 14]);
  Jg(f, g, d, je(b[c + 13]), e);
  a = g;
}), 0, ia(), 0, ia(), 0, ia(), 0, ia(), 0, (function() {
  throw "Pure virtual function called!";
}), 0, (function(c, f, d, e) {
  var g = a;
  a += 13;
  var i;
  i = je(b[c + 12]);
  ke(g);
  Ie(i, g, b[c + 14]);
  c = je(b[c + 13]);
  i = a;
  a += 63;
  Ng(i, f, g, d, c, e);
  a = i;
  a = g;
}), 0, ia(), 0, ia(), 0, ne, 0, (function(c) {
  ne(c);
}), 0, De, 0, (function(c) {
  return b[c + 4] - 1;
}), 0, na(0), 0, Re, 0, Le, 0, (function(c, f) {
  o[f] = 0;
  dc(f + 1);
  o[f + 3] = 0;
}), 0, (function(c, f, d, e) {
  Gg(f, je(b[c + 12]), d, je(b[c + 13]), e);
}), 0, ia(), 0, ia(), 0, ia(), 0, ia(), 0, (function(c, f) {
  var d, e;
  e = qc(f, 20);
  if (0 == e) {
    var g = 0;
    d = 2;
  } else d = 1;
  1 == d && (b[e] = le + 2, b[e] = sp + 2, b[e + 1] = 0, o[e + 2] = 0, dc(e + 3), g = e);
  d = g;
  Eg(d, c);
  e = d + 3;
  g = c + 3;
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  return d;
}), 0, na(1), 0, (function(c, f, d) {
  var e = a;
  a += 6;
  var g = e + 2, i = e + 4;
  J(g, f + 2, c + 3);
  P(e, f, g);
  K(i, d, e);
  c = O(i, i) <= o[c + 2] * o[c + 2];
  a = e;
  return c;
}), 0, Ze, 0, (function(c, f, d) {
  var e = a;
  a += 4;
  var g = e + 2;
  J(g, d + 2, c + 3);
  P(e, d, g);
  Qe(f, o[e] - o[c + 2], o[e + 1] - o[c + 2]);
  Qe(f + 2, o[e] + o[c + 2], o[e + 1] + o[c + 2]);
  a = e;
}), 0, (function(c, f, d) {
  o[f] = 3.1415927410125732 * d * o[c + 2] * o[c + 2];
  var d = f + 1, e = c + 3;
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  o[f + 3] = o[f] * (.5 * o[c + 2] * o[c + 2] + O(c + 3, c + 3));
}), 0, ia(), 0, ia(), 0, ia(), 0, ia(), 0, ia(), 0, ia(), 0, ia(), 0, (function(c, f) {
  dj(c, b[f + 12], f + 21);
}), 0, (function(c, f) {
  dj(c, b[f + 13], f + 23);
}), 0, (function(c, f, d) {
  N(c, d * o[f + 26], f + 30);
}), 0, na(0), 0, ej, 0, ia(), 0, ia(), 0, pj, 0, rj, 0, sj, 0, ia(), 0, ia(), 0, (function(c, f, d, e) {
  Jg(f, je(b[c + 12]), d, je(b[c + 13]), e);
}), 0, ia(), 0, ia(), 0, (function(c, f, d, e) {
  var g = je(b[c + 12]), c = je(b[c + 13]), i = a;
  a += 63;
  Ng(i, f, g, d, c, e);
  a = i;
}), 0, ia(), 0, ia(), 0, ia(), 0, ia(), 0, (function(c, f) {
  var d, e;
  e = qc(f, 48);
  if (0 == e) {
    var g = 0;
    d = 2;
  } else d = 1;
  1 == d && (ke(e), g = e);
  d = g;
  Eg(d, c);
  e = d + 3;
  g = c + 3;
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  e = d + 5;
  g = c + 5;
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  e = d + 7;
  g = c + 7;
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  e = d + 9;
  g = c + 9;
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  b[d + 11] = b[c + 11] & 1;
  b[d + 12] = b[c + 12] & 1;
  return d;
}), 0, na(1), 0, na(0), 0, Te, 0, (function(c, f, d) {
  var e = a;
  a += 14;
  var g = e + 2, i = e + 4, h = e + 6, j = e + 8, k = e + 10, l = e + 12;
  Zc(e, d, c + 3);
  Zc(g, d, c + 5);
  Oe(i, e, g);
  Pe(h, e, g);
  Xc(j, o[c + 2], o[c + 2]);
  K(k, i, j);
  b[f] = b[k];
  o[f] = o[k];
  b[f + 1] = b[k + 1];
  o[f + 1] = o[k + 1];
  c = f + 2;
  P(l, h, j);
  b[c] = b[l];
  o[c] = o[l];
  b[c + 1] = b[l + 1];
  o[c + 1] = o[l + 1];
  a = e;
}), 0, (function(c, f) {
  var d = a;
  a += 4;
  var e = d + 2;
  o[f] = 0;
  var g = f + 1;
  P(e, c + 3, c + 5);
  N(d, .5, e);
  b[g] = b[d];
  o[g] = o[d];
  b[g + 1] = b[d + 1];
  o[g + 1] = o[d + 1];
  o[f + 3] = 0;
  a = d;
}), 0, (function(c, f) {
  dj(c, b[f + 12], f + 18);
}), 0, (function(c, f) {
  dj(c, b[f + 13], f + 20);
}), 0, (function(c, f, d) {
  N(c, d, f + 22);
}), 0, (function(c, f) {
  return f * o[c + 24];
}), 0, ok, 0, ia(), 0, ia(), 0, nk, 0, sk, 0, na(1), 0, (function(c, f) {
  dj(c, b[f + 12], f + 24);
}), 0, (function(c, f) {
  dj(c, b[f + 13], f + 26);
}), 0, (function(c, f, d) {
  var e = a;
  a += 2;
  N(e, o[f + 40], f + 61);
  N(c, d, e);
  a = e;
}), 0, (function(c, f) {
  return f * o[c + 40] * o[c + 65];
}), 0, Bk, 0, ia(), 0, ia(), 0, zk, 0, Ak, 0, Hk, 0, (function() {
  U(Qp, A(1, "i32", r));
}), 0, ia(), 0, ia(), 0, (function(c, f) {
  var d = f + 20;
  b[c] = b[d];
  o[c] = o[d];
  b[c + 1] = b[d + 1];
  o[c + 1] = o[d + 1];
}), 0, (function(c, f) {
  dj(c, b[f + 13], f + 18);
}), 0, (function(c, f, d) {
  N(c, d, f + 25);
}), 0, na(0), 0, (function() {
  U(Tp, A(1, "i32", r));
}), 0, ia(), 0, ia(), 0, Al, 0, Dl, 0, na(1), 0, (function(c, f, d, e) {
  Hg(f, je(b[c + 12]), d, je(b[c + 13]), e);
}), 0, ia(), 0, ia(), 0, (function(c, f, d, e) {
  Tg(f, je(b[c + 12]), d, je(b[c + 13]), e);
}), 0, ia(), 0, ia(), 0, ia(), 0, ia(), 0, (function(c, f) {
  var d, e;
  e = qc(f, 152);
  if (0 == e) {
    var g = 0;
    d = 2;
  } else d = 1;
  1 == d && (Wl(e), g = e);
  d = g;
  Eg(d, c);
  e = d + 3;
  g = c + 3;
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  e = g = c + 5;
  for (var g = g + 16, i = d + 5; e < g; e++, i++) b[i] = b[e], o[i] = o[e];
  e = g = c + 21;
  g += 16;
  for (i = d + 21; e < g; e++, i++) b[i] = b[e], o[i] = o[e];
  b[d + 37] = b[c + 37];
  return d;
}), 0, na(1), 0, (function(c, f, d) {
  var e = a;
  a += 6;
  var g, i, h = e + 2, j, k = e + 4;
  j = f + 2;
  K(h, d, f);
  Og(e, j, h);
  f = 0;
  d = c + 37;
  h = c + 21;
  for (c += 5; ; ) {
    if (f >= b[d]) {
      g = 5;
      break;
    }
    j = h + (f << 1);
    K(k, e, c + (f << 1));
    j = O(j, k);
    if (0 < j) {
      g = 3;
      break;
    }
    f += 1;
  }
  5 == g ? i = 1 : 3 == g && (i = 0);
  a = e;
  return i;
}), 0, Ol, 0, Nl, 0, Sl, 0, (function(c, f) {
  dj(c, b[f + 12], f + 18);
}), 0, (function(c, f) {
  dj(c, b[f + 13], f + 20);
}), 0, (function(c, f, d) {
  var e = a;
  a += 6;
  var g = e + 2, i = e + 4;
  N(g, o[f + 27], f + 50);
  N(i, o[f + 30] + o[f + 29], f + 48);
  P(e, g, i);
  N(c, d, e);
  a = e;
}), 0, (function(c, f) {
  return f * o[c + 28];
}), 0, jm, 0, ia(), 0, ia(), 0, cm, 0, gm, 0, im, 0, (function(c, f) {
  dj(c, b[f + 12], f + 24);
}), 0, (function(c, f) {
  dj(c, b[f + 13], f + 26);
}), 0, (function(c, f, d) {
  var e = a;
  a += 2;
  N(e, o[f + 30], f + 35);
  N(c, d, e);
  a = e;
}), 0, na(0), 0, Am, 0, ia(), 0, ia(), 0, ym, 0, zm, 0, Im, 0, (function(c, f) {
  dj(c, b[f + 12], f + 18);
}), 0, (function(c, f) {
  dj(c, b[f + 13], f + 20);
}), 0, (function(c, f, d) {
  var e = a;
  a += 2;
  Xc(e, o[f + 22], o[f + 23]);
  N(c, d, e);
  a = e;
}), 0, (function(c, f) {
  return f * o[c + 24];
}), 0, Mm, 0, ia(), 0, ia(), 0, Jm, 0, Km, 0, Lm, 0, (function(c, f) {
  dj(c, b[f + 12], f + 18);
}), 0, (function(c, f) {
  dj(c, b[f + 13], f + 20);
}), 0, (function(c, f, d) {
  N(c, d * o[f + 24], f + 27);
}), 0, na(0), 0, Um, 0, ia(), 0, ia(), 0, Tm, 0, fn, 0, gn, 0, (function(c, f) {
  dj(c, b[f + 12], f + 21);
}), 0, (function(c, f) {
  dj(c, b[f + 13], f + 23);
}), 0, (function(c, f, d) {
  var e = a;
  a += 2;
  Xc(e, o[f + 27], o[f + 28]);
  N(c, d, e);
  a = e;
}), 0, (function(c, f) {
  return f * o[c + 29];
}), 0, In, 0, ia(), 0, ia(), 0, Hn, 0, Mn, 0, Nn, 0, (function(c, f) {
  dj(c, b[f + 12], f + 20);
}), 0, (function(c, f) {
  dj(c, b[f + 13], f + 22);
}), 0, (function(c, f, d) {
  var e = a;
  a += 6;
  var g = e + 2, i = e + 4;
  N(g, o[f + 28], f + 46);
  N(i, o[f + 30], f + 44);
  P(e, g, i);
  N(c, d, e);
  a = e;
}), 0, (function(c, f) {
  return f * o[c + 29];
}), 0, Sn, 0, ia(), 0, ia(), 0, Qn, 0, Rn, 0, Wn, 0, ia(), 0, Bo, 0, ec, 0, (function(c) {
  var f;
  f = 0;
  var d = c + 1, c = f < b[d] ? 1 : 3;
  a : do if (1 == c) for (;;) if (f += 1, f >= b[d]) break a; while (0);
}), 0, vc, 0, ia(), 0, Zd, 0, ia(), 0, qe, 0, ye, 0, Ue, 0, sh, 0, ci, 0, ai, 0, Xi, 0, $d, 0, ia(), 0, Yj, 0, ck, 0, Td, 0, lk, 0, tk, 0, Ik, 0, Gk, 0, sl, 0, El, 0, Jl, 0, am, 0, tm, 0, Gm, 0, (function(c) {
  b[c] = 0;
  b[c + 1] = 0;
  b[c + 2] = 0;
  b[c + 3] = 0;
  b[c + 4] = 0;
  b[c + 5] = 0;
  b[c + 6] = 0;
  dc(c + 7);
  o[c + 10] = 1;
  o[c + 11] = .10000000149011612;
}), 0, ia(), 0, Rm, 0, Xm, 0, Ym, 0, (function(c) {
  Mk(c);
}), 0, Dn, 0, On, 0, Un, 0, Vn, 0 ];

Module.FUNCTION_TABLE = mb;

function Cq(c) {
  c = c || Module.arguments;
  ab();
  var f = da;
  if (Module._main) {
    for (f = Module.I(c); 0 < bb.length; ) {
      var c = bb.pop(), d = c.n;
      "number" === typeof d && (d = mb[d]);
      d(c.k === ba ? da : c.k);
    }
    $a();
  }
  return f;
}

Module.run = Cq;

try {
  Uo = ea;
} catch (Dq) {}

Module.noInitialRun || Cq();
