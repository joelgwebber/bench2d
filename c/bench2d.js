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
      for (; Sa <= Ra; ) Sa = Math.ceil(1.25 * Sa / Ua) * Ua;
      c = b;
      Ya = b = new Int32Array(Sa);
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

var s = 1, t = 2;

Module.ALLOC_NORMAL = 0;

Module.ALLOC_STACK = s;

Module.ALLOC_STATIC = t;

function A(c, f, d) {
  var e, g;
  "number" === typeof c ? (e = ca, g = c) : (e = ea, g = c.length);
  for (var d = [ kb, Ma.U, Ma.D ][d === ba ? t : d](Math.max(g, 1)), i = "string" === typeof f ? f : da, h = 0, j; h < g; ) {
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

var mb, Ua = 4096, Ya, b, Za, o, a, nb, Ra, Sa = Module.TOTAL_MEMORY || 15e7;

Int32Array && Float64Array && (new Int32Array(1)).subarray && (new Int32Array(1)).set || Qa("Assertion failed: Cannot fallback to non-typed array case: Code is too specialized");

Ya = b = new Int32Array(Sa);

Za = new Uint32Array(b.buffer);

o = new Float64Array(Sa);

for (var ub = ob("(null)"), vb = 0; vb < ub.length; vb++) b[vb] = ub[vb];

Module.HEAP = Ya;

Module.IHEAP = b;

Module.FHEAP = o;

nb = (a = Math.ceil(10 / Ua) * Ua) + 1048576;

Ra = Math.ceil(nb / Ua) * Ua;

function yb(c, f) {
  return Array.prototype.slice.call(b.subarray(c, c + f));
}

Module.Array_copy = yb;

function zb(c) {
  for (var f = 0; b[c + f]; ) f++;
  return f;
}

Module.String_len = zb;

function Fb(c, f) {
  var d = zb(c);
  f && d++;
  var e = yb(c, d);
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

function Jb(c, f) {
  return 0 <= c ? c : 32 >= f ? 2 * Math.abs(1 << f - 1) + c : Math.pow(2, f) + c;
}

function Kb(c, f) {
  if (0 >= c) return c;
  var d = 32 >= f ? Math.abs(1 << f - 1) : Math.pow(2, f - 1);
  if (c >= d && (32 >= f || c > d)) c = -2 * d + c;
  return c;
}

function Lb() {
  Mb();
  return 0;
}

Module._main = Lb;

function Nb(c, f) {
  o[c] += o[f];
  o[c + 1] += o[f + 1];
}

function Vb(c) {
  b[c] = Wb + 2;
  b[c] = bc + 2;
  b[c + 1] = 2;
  o[c + 2] = .009999999776482582;
  b[c + 37] = 0;
  cc(c + 3);
}

Vb.X = 1;

function cc(c) {
  o[c] = 0;
  o[c + 1] = 0;
}

function dc(c) {
  b[c] = Wb + 2;
  b[c] = lc + 2;
  b[c + 1] = 1;
  o[c + 2] = .009999999776482582;
  o[c + 7] = 0;
  o[c + 8] = 0;
  o[c + 9] = 0;
  o[c + 10] = 0;
  b[c + 11] = 0;
  b[c + 12] = 0;
}

function mc(c) {
  b[c + 14] = 0;
  nc(c + 1, 0, 0);
  o[c + 3] = 0;
  nc(c + 4, 0, 0);
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

function nc(c, f, d) {
  o[c] = f;
  o[c + 1] = d;
}

function oc(c, f, d) {
  o[c] = f;
  o[c + 1] = d;
}

function Mb() {
  var c = a;
  a += 102913;
  var f = c + 2, d = c + 102562, e = c + 102578, g = c + 102591, i = c + 102593, h = c + 102595, j = c + 102633, k = c + 102635, l = c + 102637, m = c + 102639, n = c + 102641, p = c + 102657;
  oc(c, 0, -10);
  pc(f, c);
  var u, r;
  u = 0 == (b[f + 102544] & 1) ? 4 : 1;
  a : do if (1 == u) if (b[f + 102544] = 0, 0 != (b[f + 102544] & 1)) u = 4; else if (r = b[f + 102538], 0 == b[f + 102538]) u = 4; else for (;;) {
    qc(r, 1);
    var q = b[r + 24];
    r = q;
    if (0 == q) break a;
  } while (0);
  mc(d);
  d = rc(f, d);
  dc(e);
  oc(g, -40, 0);
  oc(i, 40, 0);
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
  uc(d, e, 0);
  Vb(h);
  b[h + 37] = 4;
  nc(h + 5, -.5, -.5);
  nc(h + 7, .5, -.5);
  nc(h + 9, .5, .5);
  nc(h + 11, -.5, .5);
  nc(h + 21, 0, -1);
  nc(h + 23, 1, 0);
  nc(h + 25, 0, 1);
  nc(h + 27, -1, 0);
  cc(h + 3);
  oc(j, -7, .75);
  oc(l, .5625, 1);
  oc(m, 1.125, 0);
  e = 0;
  i = n + 1;
  for (g = 0; 40 > g; ) {
    b[k] = b[j];
    o[k] = o[j];
    b[k + 1] = b[j + 1];
    o[k + 1] = o[j + 1];
    for (d = g = e; 40 > d; ) {
      mc(n);
      b[n] = 2;
      b[i] = b[k];
      o[i] = o[k];
      b[i + 1] = b[k + 1];
      o[i + 1] = o[k + 1];
      d = rc(f, n);
      uc(d, h, 5);
      Nb(k, m);
      g = d = g + 1;
    }
    Nb(j, l);
    e = g = e + 1;
  }
  for (j = h = 0; 64 > j; ) {
    vc(f, .01666666753590107, 3, 3);
    h = j = h + 1;
  }
  for (j = h = 0; 256 > j; ) {
    j = wc();
    vc(f, .01666666753590107, 3, 3);
    k = wc();
    b[p + h] = k - j;
    xc(yc, A([ 1e3 * ((k - j) / 1e3) ], "double", s));
    h = j = h + 1;
  }
  h = b[zc];
  b[Hc] = Jb(10);
  if (-1 == Ic(h, Hc, 1) && h in Jc) Jc[h].error = ca;
  for (j = h = 0; !(h += b[p + j], j = k = j + 1, 256 <= k); ) ;
  xc(yc, A([ 1e3 * (h / 256 / 1e3) ], "double", s));
  Kc(f);
  a = c;
}

Mb.X = 1;

function Lc(c) {
  Mc(c);
  b[c + 7] = 0;
  b[c + 12] = 16;
  b[c + 13] = 0;
  var f = kb(12 * b[c + 12]);
  b[c + 11] = f;
  b[c + 9] = 16;
  b[c + 10] = 0;
  f = kb(b[c + 9] << 2);
  b[c + 8] = f;
}

function Nc(c, f) {
  var d;
  if (1 == (b[c + 10] == b[c + 9] ? 1 : 2)) {
    d = b[c + 8];
    b[c + 9] <<= 1;
    var e = kb(b[c + 9] << 2);
    b[c + 8] = e;
    e = d;
    d += 1 * ((b[c + 10] << 2) / 4);
    for (var g = b[c + 8]; e < d; e++, g++) b[g] = b[e], o[g] = o[e];
  }
  b[b[c + 8] + b[c + 10]] = f;
  b[c + 10] += 1;
}

Nc.X = 1;

function Oc(c, f) {
  var d, e;
  d = f == b[c + 14] ? 1 : 2;
  if (1 == d) e = 1; else if (2 == d) {
    d = b[c + 13] == b[c + 12] ? 3 : 4;
    if (3 == d) {
      e = b[c + 11];
      b[c + 12] <<= 1;
      d = kb(12 * b[c + 12]);
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

Oc.X = 1;

function Pc(c, f, d) {
  oc(c, o[f + 3] * o[d] - o[f + 2] * o[d + 1] + o[f], o[f + 2] * o[d] + o[f + 3] * o[d + 1] + o[f + 1]);
}

Pc.X = 1;

function C(c, f, d) {
  oc(c, o[f] - o[d], o[f + 1] - o[d + 1]);
}

function J(c, f) {
  return o[c] * o[f] + o[c + 1] * o[f + 1];
}

function Tc(c, f, d) {
  var e;
  e = o[d] - o[f];
  d = o[d + 1] - o[f + 1];
  oc(c, o[f + 3] * e + o[f + 2] * d, -o[f + 2] * e + o[f + 3] * d);
}

Tc.X = 1;

function K(c, f, d) {
  oc(c, f * o[d], f * o[d + 1]);
}

function N(c, f, d) {
  oc(c, o[f] + o[d], o[f + 1] + o[d + 1]);
}

function Uc(c, f, d, e, g) {
  var i = a;
  a += 6;
  var h = i + 2, j = i + 4;
  b[c + 15] = 0;
  Pc(i, d, f + 3);
  Pc(h, g, e + 3);
  C(j, h, i);
  d = J(j, j);
  g = o[f + 2] + o[e + 2];
  if (1 == (d > g * g ? 2 : 1)) b[c + 14] = 0, d = c + 12, f += 3, b[d] = b[f], o[d] = o[f], b[d + 1] = b[f + 1], o[d + 1] = o[f + 1], cc(c + 10), b[c + 15] = 1, e += 3, b[c] = b[e], o[c] = o[e], b[c + 1] = b[e + 1], o[c + 1] = o[e + 1], b[c + 4] = 0;
  a = i;
}

Uc.X = 1;

function Vc(c, f, d, e, g) {
  var i = a;
  a += 32;
  var h, j = i + 2, k, l, m, n, p, u = i + 4, r = i + 6, q = i + 8, v = i + 10, x = i + 12, w = i + 14, y = i + 16, z = i + 18, B = i + 20, E = i + 22, D = i + 24, H = i + 26, I = i + 28, M = i + 30;
  b[c + 15] = 0;
  Pc(i, g, e + 3);
  Tc(j, d, i);
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
    C(u, j, m + (n << 1));
    p = J(h, u);
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
    n = r;
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
    if (9 == h) b[c + 15] = 1, b[c + 14] = 1, u = c + 10, n = f + (d << 1), b[u] = b[n], o[u] = o[n], b[u + 1] = b[n + 1], o[u + 1] = o[n + 1], u = c + 12, N(x, r, q), K(v, .5, x), n = v, b[u] = b[n], o[u] = o[n], b[u + 1] = b[n + 1], o[u + 1] = o[n + 1], u = c, n = e + 3, b[u] = b[n], o[u] = o[n], b[u + 1] = b[n + 1], o[u + 1] = o[n + 1], b[c + 4] = 0; else if (10 == h) if (C(w, j, r), C(y, q, r), h = J(w, y), C(z, j, q), C(B, r, q), n = J(z, B), h = 0 >= h ? 11 : 13, 11 == h) {
      if (Wc(j, r) > k * k) break a;
      b[c + 15] = 1;
      b[c + 14] = 1;
      u = c + 10;
      C(E, j, r);
      n = E;
      b[u] = b[n];
      o[u] = o[n];
      b[u + 1] = b[n + 1];
      o[u + 1] = o[n + 1];
      Xc(c + 10);
      u = c + 12;
      n = r;
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
      if (Wc(j, q) > k * k) break a;
      b[c + 15] = 1;
      b[c + 14] = 1;
      u = c + 10;
      C(D, j, q);
      n = D;
      b[u] = b[n];
      o[u] = o[n];
      b[u + 1] = b[n + 1];
      o[u + 1] = o[n + 1];
      Xc(c + 10);
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
      N(I, r, q);
      K(H, .5, I);
      C(M, j, H);
      n = J(M, f + (u << 1));
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

Vc.X = 1;

function Wc(c, f) {
  var d = a;
  a += 2;
  C(d, c, f);
  var e = J(d, d);
  a = d;
  return e;
}

function Xc(c) {
  var f, d, e;
  e = Yc(c);
  f = 1.1920928955078125e-7 > e ? 1 : 2;
  1 == f ? d = 0 : 2 == f && (f = 1 / e, o[c] *= f, o[c + 1] *= f, d = e);
  return d;
}

function Yc(c) {
  return Zc(o[c] * o[c] + o[c + 1] * o[c + 1]);
}

function $c(c, f, d, e, g) {
  var i = a;
  a += 56;
  var h = i + 2, j = i + 4, k = i + 6, l = i + 8, m;
  m = i + 10;
  var n;
  n = i + 12;
  var p = i + 14, u = i + 18, r = i + 20, q = i + 22, v = i + 24, x = i + 26, w = i + 28, y = i + 30, z = i + 32, B = i + 34, E = i + 36, D = i + 38, H = i + 40, I = i + 42, M = i + 44, G = i + 46, R = i + 48, P = i + 50, L = i + 52, T = i + 54;
  b[c + 15] = 0;
  Pc(h, g, e + 3);
  Tc(i, d, h);
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
  C(l, k, j);
  C(m, k, i);
  m = J(l, m);
  C(n, i, j);
  n = J(l, n);
  d = o[f + 2] + o[e + 2];
  b[p + 1] = 0;
  b[p + 3] = 0;
  g = 0 >= n ? 1 : 5;
  a : do if (1 == g) if (g = u, h = j, b[g] = b[h], o[g] = o[h], b[g + 1] = b[h + 1], o[g + 1] = o[h + 1], C(r, i, u), g = J(r, r), g > d * d) g = 16; else {
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
      C(x, v, q);
      C(w, v, i);
      h = J(x, w);
      if (0 < h) break a;
    }
    b[p] = 0;
    b[p + 2] = 0;
    b[c + 15] = 1;
    b[c + 14] = 0;
    cc(c + 10);
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
    C(z, i, y);
    g = J(z, z);
    if (g > d * d) break a;
    g = b[f + 12] & 1 ? 8 : 9;
    if (8 == g && (h = B, F = f + 9, b[h] = b[F], o[h] = o[F], b[h + 1] = b[F + 1], o[h + 1] = o[F + 1], h = E, F = k, b[h] = b[F], o[h] = o[F], b[h + 1] = b[F + 1], o[h + 1] = o[F + 1], C(D, B, E), C(H, i, E), h = J(D, H), 0 < h)) break a;
    b[p] = 1;
    b[p + 2] = 0;
    b[c + 15] = 1;
    b[c + 14] = 0;
    cc(c + 10);
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
    h = J(l, l);
    g = 0 < h ? 12 : 11;
    11 == g && O(ad, 127, bd, cd);
    g = 1 / h;
    K(G, m, j);
    K(R, n, k);
    N(M, G, R);
    K(I, g, M);
    C(P, i, I);
    g = J(P, P);
    if (g > d * d) break a;
    oc(L, -o[l + 1], o[l]);
    C(T, i, j);
    g = 0 > J(L, T) ? 14 : 15;
    14 == g && nc(L, -o[L], -o[L + 1]);
    Xc(L);
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

$c.X = 1;

function dd(c, f, d, e, g, i) {
  var h = a;
  a += 125;
  var j, k = h + 4, l, m, n = h + 6, p, u = h + 8, r, q, v, x, w = h + 10, y = h + 12, z = h + 14, B = h + 16, E = h + 18, D = h + 20, H = h + 22, I = h + 24, M = h + 26, G = h + 28, R = h + 30, P = h + 32, L = h + 34, T = h + 36, F = h + 38, X = h + 40, Z = h + 42, V = h + 44, aa = h + 46, ja = h + 48, Y = h + 50, W = h + 52, $ = h + 54, ga = h + 56, la = h + 58, fa = h + 60, ka = h + 62, oa = h + 64, ua = h + 66, Da = h + 68, Ja = h + 70, Aa, Ta = h + 72, pb = h + 74, Fa = h + 76, Va = h + 79, Na = h + 82, pa = h + 85, ha = h + 91, Ba, za, va, Ka, ma, La, Ga = h + 105, ya = h + 107, Oa = h + 109, Ea = h + 115, Gb, Ob, Pa, ec, Pb = h + 121, Wa, fc = h + 123, wb = c + 33, Xa = a;
  a += 6;
  var Qb = Xa + 2, Hb = Xa + 4, Ab = h + 2, Bb = e + 2, db = i + 2;
  o[Xa] = o[Bb + 1] * o[db] - o[Bb] * o[db + 1];
  o[Xa + 1] = o[Bb + 1] * o[db + 1] + o[Bb] * o[db];
  b[Ab] = b[Xa];
  o[Ab] = o[Xa];
  b[Ab + 1] = b[Xa + 1];
  o[Ab + 1] = o[Xa + 1];
  var Xb = e + 2;
  C(Hb, i, e);
  Od(Qb, Xb, Hb);
  b[h] = b[Qb];
  o[h] = o[Qb];
  b[h + 1] = b[Qb + 1];
  o[h + 1] = o[Qb + 1];
  a = Xa;
  b[wb] = b[h];
  o[wb] = o[h];
  b[wb + 1] = b[h + 1];
  o[wb + 1] = o[h + 1];
  b[wb + 2] = b[h + 2];
  o[wb + 2] = o[h + 2];
  b[wb + 3] = b[h + 3];
  o[wb + 3] = o[h + 3];
  var Yb = c + 37;
  Pc(k, c + 33, g + 3);
  b[Yb] = b[k];
  o[Yb] = o[k];
  b[Yb + 1] = b[k + 1];
  o[Yb + 1] = o[k + 1];
  var eb = c + 39, xb = d + 7;
  b[eb] = b[xb];
  o[eb] = o[xb];
  b[eb + 1] = b[xb + 1];
  o[eb + 1] = o[xb + 1];
  var fb = c + 41, Ia = d + 3;
  b[fb] = b[Ia];
  o[fb] = o[Ia];
  b[fb + 1] = b[Ia + 1];
  o[fb + 1] = o[Ia + 1];
  var Zb = c + 43, gb = d + 5;
  b[Zb] = b[gb];
  o[Zb] = o[gb];
  b[Zb + 1] = b[gb + 1];
  o[Zb + 1] = o[gb + 1];
  var Cb = c + 45, hb = d + 9;
  b[Cb] = b[hb];
  o[Cb] = o[hb];
  b[Cb + 1] = b[hb + 1];
  o[Cb + 1] = o[hb + 1];
  l = b[d + 11] & 1;
  m = b[d + 12] & 1;
  C(n, c + 43, c + 41);
  Xc(n);
  nc(c + 49, o[n + 1], -o[n]);
  var Db = c + 49;
  C(u, c + 37, c + 41);
  p = J(Db, u);
  x = v = q = r = 0;
  j = l & 1 ? 1 : 2;
  if (1 == j) {
    C(w, c + 41, c + 39);
    Xc(w);
    nc(c + 47, o[w + 1], -o[w]);
    v = 0 <= Q(w, n);
    var gc = c + 47;
    C(y, c + 37, c + 39);
    r = J(gc, y);
  }
  j = m & 1 ? 3 : 4;
  if (3 == j) {
    C(z, c + 45, c + 43);
    Xc(z);
    nc(c + 51, o[z + 1], -o[z]);
    x = 0 < Q(n, z);
    var hc = c + 51;
    C(B, c + 37, c + 43);
    q = J(hc, B);
  }
  j = l & 1 ? 5 : 34;
  a : do if (5 == j) if (m & 1) {
    j = v & 1 ? 7 : 14;
    do if (7 == j) if (x & 1) {
      if (0 <= r) {
        var qb = 1;
        j = 11;
      } else j = 9;
      9 == j && (0 <= p ? (qb = 1, j = 11) : qb = 0 <= q);
      b[c + 62] = qb;
      var Rb = c + 53, Sb = c + 49;
      j = b[c + 62] & 1 ? 12 : 13;
      if (12 == j) {
        var rb = Rb, $b = Sb;
        b[rb] = b[$b];
        o[rb] = o[$b];
        b[rb + 1] = b[$b + 1];
        o[rb + 1] = o[$b + 1];
        var Eb = c + 57, ic = c + 47;
        b[Eb] = b[ic];
        o[Eb] = o[ic];
        b[Eb + 1] = b[ic + 1];
        o[Eb + 1] = o[ic + 1];
        var sb = c + 59, Ib = c + 51;
        b[sb] = b[Ib];
        o[sb] = o[Ib];
        b[sb + 1] = b[Ib + 1];
        o[sb + 1] = o[Ib + 1];
        j = 61;
        break a;
      } else if (13 == j) {
        Pd(E, Sb);
        var tb = Rb, ib = E;
        b[tb] = b[ib];
        o[tb] = o[ib];
        b[tb + 1] = b[ib + 1];
        o[tb + 1] = o[ib + 1];
        var ac = c + 57;
        Pd(D, c + 49);
        var jc = ac, Tb = D;
        b[jc] = b[Tb];
        o[jc] = o[Tb];
        b[jc + 1] = b[Tb + 1];
        o[jc + 1] = o[Tb + 1];
        var Ac = c + 59;
        Pd(H, c + 49);
        var kc = Ac, jb = H;
        b[kc] = b[jb];
        o[kc] = o[jb];
        b[kc + 1] = b[jb + 1];
        o[kc + 1] = o[jb + 1];
        j = 61;
        break a;
      }
    } else j = 14; while (0);
    j = v & 1 ? 15 : 21;
    if (15 == j) {
      if (0 <= r) {
        var $d = 1;
        j = 18;
      } else j = 16;
      16 == j && (0 <= p ? $d = 0 <= q : ($d = 0, j = 18));
      b[c + 62] = $d;
      var Ue = c + 53, Ve = c + 49;
      j = b[c + 62] & 1 ? 19 : 20;
      if (19 == j) {
        var ed = Ue, fd = Ve;
        b[ed] = b[fd];
        o[ed] = o[fd];
        b[ed + 1] = b[fd + 1];
        o[ed + 1] = o[fd + 1];
        var gd = c + 57, hd = c + 47;
        b[gd] = b[hd];
        o[gd] = o[hd];
        b[gd + 1] = b[hd + 1];
        o[gd + 1] = o[hd + 1];
        var id = c + 59, jd = c + 49;
        b[id] = b[jd];
        o[id] = o[jd];
        b[id + 1] = b[jd + 1];
        o[id + 1] = o[jd + 1];
        j = 61;
        break a;
      } else if (20 == j) {
        Pd(I, Ve);
        var kd = Ue, ld = I;
        b[kd] = b[ld];
        o[kd] = o[ld];
        b[kd + 1] = b[ld + 1];
        o[kd + 1] = o[ld + 1];
        var Ah = c + 57;
        Pd(M, c + 51);
        var md = Ah, nd = M;
        b[md] = b[nd];
        o[md] = o[nd];
        b[md + 1] = b[nd + 1];
        o[md + 1] = o[nd + 1];
        var Bh = c + 59;
        Pd(G, c + 49);
        var od = Bh, pd = G;
        b[od] = b[pd];
        o[od] = o[pd];
        b[od + 1] = b[pd + 1];
        o[od + 1] = o[pd + 1];
        j = 61;
        break a;
      }
    } else if (21 == j) if (j = x & 1 ? 22 : 28, 22 == j) {
      if (0 <= q) {
        var ae = 1;
        j = 25;
      } else j = 23;
      23 == j && (0 <= r ? ae = 0 <= p : (ae = 0, j = 25));
      b[c + 62] = ae;
      var We = c + 53, Xe = c + 49;
      j = b[c + 62] & 1 ? 26 : 27;
      if (26 == j) {
        var qd = We, rd = Xe;
        b[qd] = b[rd];
        o[qd] = o[rd];
        b[qd + 1] = b[rd + 1];
        o[qd + 1] = o[rd + 1];
        var sd = c + 57, td = c + 49;
        b[sd] = b[td];
        o[sd] = o[td];
        b[sd + 1] = b[td + 1];
        o[sd + 1] = o[td + 1];
        var ud = c + 59, vd = c + 51;
        b[ud] = b[vd];
        o[ud] = o[vd];
        b[ud + 1] = b[vd + 1];
        o[ud + 1] = o[vd + 1];
        j = 61;
        break a;
      } else if (27 == j) {
        Pd(R, Xe);
        var wd = We, xd = R;
        b[wd] = b[xd];
        o[wd] = o[xd];
        b[wd + 1] = b[xd + 1];
        o[wd + 1] = o[xd + 1];
        var Ch = c + 57;
        Pd(P, c + 49);
        var yd = Ch, zd = P;
        b[yd] = b[zd];
        o[yd] = o[zd];
        b[yd + 1] = b[zd + 1];
        o[yd + 1] = o[zd + 1];
        var Dh = c + 59;
        Pd(L, c + 47);
        var Ad = Dh, sc = L;
        b[Ad] = b[sc];
        o[Ad] = o[sc];
        b[Ad + 1] = b[sc + 1];
        o[Ad + 1] = o[sc + 1];
        j = 61;
        break a;
      }
    } else if (28 == j) {
      if (0 <= r) j = 29; else {
        var Bc = 0;
        j = 31;
      }
      29 == j && (0 <= p ? Bc = 0 <= q : (Bc = 0, j = 31));
      b[c + 62] = Bc;
      var Qc = c + 53, be = c + 49;
      j = b[c + 62] & 1 ? 32 : 33;
      if (32 == j) {
        var Rc = Qc, Sc = be;
        b[Rc] = b[Sc];
        o[Rc] = o[Sc];
        b[Rc + 1] = b[Sc + 1];
        o[Rc + 1] = o[Sc + 1];
        var Bd = c + 57, Cd = c + 49;
        b[Bd] = b[Cd];
        o[Bd] = o[Cd];
        b[Bd + 1] = b[Cd + 1];
        o[Bd + 1] = o[Cd + 1];
        var Dd = c + 59, Ed = c + 49;
        b[Dd] = b[Ed];
        o[Dd] = o[Ed];
        b[Dd + 1] = b[Ed + 1];
        o[Dd + 1] = o[Ed + 1];
        j = 61;
        break a;
      } else if (33 == j) {
        Pd(T, be);
        var Fd = Qc, Gd = T;
        b[Fd] = b[Gd];
        o[Fd] = o[Gd];
        b[Fd + 1] = b[Gd + 1];
        o[Fd + 1] = o[Gd + 1];
        var Ye = c + 57;
        Pd(F, c + 51);
        var Hd = Ye, Id = F;
        b[Hd] = b[Id];
        o[Hd] = o[Id];
        b[Hd + 1] = b[Id + 1];
        o[Hd + 1] = o[Id + 1];
        var Jd = c + 59;
        Pd(X, c + 47);
        var tc = Jd, Ze = X;
        b[tc] = b[Ze];
        o[tc] = o[Ze];
        b[tc + 1] = b[Ze + 1];
        o[tc + 1] = o[Ze + 1];
        j = 61;
        break a;
      }
    }
  } else j = 34; while (0);
  if (34 == j) if (j = l & 1 ? 35 : 46, 35 == j) {
    var qk = 0 <= r;
    j = v & 1 ? 36 : 41;
    if (36 == j) {
      if (qk) {
        var rk = 1;
        j = 38;
      } else j = 37;
      37 == j && (rk = 0 <= p);
      b[c + 62] = rk;
      var Cc = c + 53, ce = c + 49;
      j = b[c + 62] & 1 ? 39 : 40;
      if (39 == j) {
        b[Cc] = b[ce];
        o[Cc] = o[ce];
        b[Cc + 1] = b[ce + 1];
        o[Cc + 1] = o[ce + 1];
        var $e = c + 57, af = c + 47;
        b[$e] = b[af];
        o[$e] = o[af];
        b[$e + 1] = b[af + 1];
        o[$e + 1] = o[af + 1];
        var bf = c + 59;
        Pd(Z, c + 49);
        b[bf] = b[Z];
        o[bf] = o[Z];
        b[bf + 1] = b[Z + 1];
        o[bf + 1] = o[Z + 1];
      } else if (40 == j) {
        Pd(V, ce);
        b[Cc] = b[V];
        o[Cc] = o[V];
        b[Cc + 1] = b[V + 1];
        o[Cc + 1] = o[V + 1];
        var cf = c + 57, df = c + 49;
        b[cf] = b[df];
        o[cf] = o[df];
        b[cf + 1] = b[df + 1];
        o[cf + 1] = o[df + 1];
        var ef = c + 59;
        Pd(aa, c + 49);
        b[ef] = b[aa];
        o[ef] = o[aa];
        b[ef + 1] = b[aa + 1];
        o[ef + 1] = o[aa + 1];
      }
    } else if (41 == j) {
      if (qk) j = 42; else {
        var sk = 0;
        j = 43;
      }
      42 == j && (sk = 0 <= p);
      b[c + 62] = sk;
      var Dc = c + 53, de = c + 49;
      j = b[c + 62] & 1 ? 44 : 45;
      if (44 == j) {
        b[Dc] = b[de];
        o[Dc] = o[de];
        b[Dc + 1] = b[de + 1];
        o[Dc + 1] = o[de + 1];
        var ff = c + 57, gf = c + 49;
        b[ff] = b[gf];
        o[ff] = o[gf];
        b[ff + 1] = b[gf + 1];
        o[ff + 1] = o[gf + 1];
        var hf = c + 59;
        Pd(ja, c + 49);
        b[hf] = b[ja];
        o[hf] = o[ja];
        b[hf + 1] = b[ja + 1];
        o[hf + 1] = o[ja + 1];
      } else if (45 == j) {
        Pd(Y, de);
        b[Dc] = b[Y];
        o[Dc] = o[Y];
        b[Dc + 1] = b[Y + 1];
        o[Dc + 1] = o[Y + 1];
        var jf = c + 57, kf = c + 49;
        b[jf] = b[kf];
        o[jf] = o[kf];
        b[jf + 1] = b[kf + 1];
        o[jf + 1] = o[kf + 1];
        var lf = c + 59;
        Pd(W, c + 47);
        b[lf] = b[W];
        o[lf] = o[W];
        b[lf + 1] = b[W + 1];
        o[lf + 1] = o[W + 1];
      }
    }
  } else if (46 == j) if (j = m & 1 ? 47 : 58, 47 == j) {
    var tk = 0 <= p;
    j = x & 1 ? 48 : 53;
    if (48 == j) {
      if (tk) {
        var uk = 1;
        j = 50;
      } else j = 49;
      49 == j && (uk = 0 <= q);
      b[c + 62] = uk;
      var Ec = c + 53, ee = c + 49;
      j = b[c + 62] & 1 ? 51 : 52;
      if (51 == j) {
        b[Ec] = b[ee];
        o[Ec] = o[ee];
        b[Ec + 1] = b[ee + 1];
        o[Ec + 1] = o[ee + 1];
        var mf = c + 57;
        Pd($, c + 49);
        b[mf] = b[$];
        o[mf] = o[$];
        b[mf + 1] = b[$ + 1];
        o[mf + 1] = o[$ + 1];
        var nf = c + 59, of = c + 51;
        b[nf] = b[of];
        o[nf] = o[of];
        b[nf + 1] = b[of + 1];
        o[nf + 1] = o[of + 1];
      } else if (52 == j) {
        Pd(ga, ee);
        b[Ec] = b[ga];
        o[Ec] = o[ga];
        b[Ec + 1] = b[ga + 1];
        o[Ec + 1] = o[ga + 1];
        var pf = c + 57;
        Pd(la, c + 49);
        b[pf] = b[la];
        o[pf] = o[la];
        b[pf + 1] = b[la + 1];
        o[pf + 1] = o[la + 1];
        var qf = c + 59, rf = c + 49;
        b[qf] = b[rf];
        o[qf] = o[rf];
        b[qf + 1] = b[rf + 1];
        o[qf + 1] = o[rf + 1];
      }
    } else if (53 == j) {
      if (tk) j = 54; else {
        var vk = 0;
        j = 55;
      }
      54 == j && (vk = 0 <= q);
      b[c + 62] = vk;
      var Fc = c + 53, fe = c + 49;
      j = b[c + 62] & 1 ? 56 : 57;
      if (56 == j) {
        b[Fc] = b[fe];
        o[Fc] = o[fe];
        b[Fc + 1] = b[fe + 1];
        o[Fc + 1] = o[fe + 1];
        var sf = c + 57;
        Pd(fa, c + 49);
        b[sf] = b[fa];
        o[sf] = o[fa];
        b[sf + 1] = b[fa + 1];
        o[sf + 1] = o[fa + 1];
        var tf = c + 59, uf = c + 49;
        b[tf] = b[uf];
        o[tf] = o[uf];
        b[tf + 1] = b[uf + 1];
        o[tf + 1] = o[uf + 1];
      } else if (57 == j) {
        Pd(ka, fe);
        b[Fc] = b[ka];
        o[Fc] = o[ka];
        b[Fc + 1] = b[ka + 1];
        o[Fc + 1] = o[ka + 1];
        var vf = c + 57;
        Pd(oa, c + 51);
        b[vf] = b[oa];
        o[vf] = o[oa];
        b[vf + 1] = b[oa + 1];
        o[vf + 1] = o[oa + 1];
        var wf = c + 59, xf = c + 49;
        b[wf] = b[xf];
        o[wf] = o[xf];
        b[wf + 1] = b[xf + 1];
        o[wf + 1] = o[xf + 1];
      }
    }
  } else if (58 == j) {
    b[c + 62] = 0 <= p;
    var Gc = c + 53, ge = c + 49;
    j = b[c + 62] & 1 ? 59 : 60;
    if (59 == j) {
      b[Gc] = b[ge];
      o[Gc] = o[ge];
      b[Gc + 1] = b[ge + 1];
      o[Gc + 1] = o[ge + 1];
      var yf = c + 57;
      Pd(ua, c + 49);
      b[yf] = b[ua];
      o[yf] = o[ua];
      b[yf + 1] = b[ua + 1];
      o[yf + 1] = o[ua + 1];
      var zf = c + 59;
      Pd(Da, c + 49);
      b[zf] = b[Da];
      o[zf] = o[Da];
      b[zf + 1] = b[Da + 1];
      o[zf + 1] = o[Da + 1];
    } else if (60 == j) {
      Pd(Ja, ge);
      b[Gc] = b[Ja];
      o[Gc] = o[Ja];
      b[Gc + 1] = b[Ja + 1];
      o[Gc + 1] = o[Ja + 1];
      var Af = c + 57, Bf = c + 49;
      b[Af] = b[Bf];
      o[Af] = o[Bf];
      b[Af + 1] = b[Bf + 1];
      o[Af + 1] = o[Bf + 1];
      var Cf = c + 59, Df = c + 49;
      b[Cf] = b[Df];
      o[Cf] = o[Df];
      b[Cf + 1] = b[Df + 1];
      o[Cf + 1] = o[Df + 1];
    }
  }
  b[c + 32] = b[g + 37];
  Aa = 0;
  j = Aa < b[g + 37] ? 62 : 64;
  a : do if (62 == j) for (var iq = c, jq = c + 33, Ef = Ta, kq = c + 16, lq = c + 35, Ff = pb; ; ) {
    var mq = iq + (Aa << 1);
    Pc(Ta, jq, g + 5 + (Aa << 1));
    var Gf = mq;
    b[Gf] = b[Ef];
    o[Gf] = o[Ef];
    b[Gf + 1] = b[Ef + 1];
    o[Gf + 1] = o[Ef + 1];
    var nq = kq + (Aa << 1);
    S(pb, lq, g + 21 + (Aa << 1));
    var Hf = nq;
    b[Hf] = b[Ff];
    o[Hf] = o[Ff];
    b[Hf + 1] = b[Ff + 1];
    o[Hf + 1] = o[Ff + 1];
    Aa += 1;
    if (Aa >= b[g + 37]) {
      j = 64;
      break a;
    }
  } while (0);
  o[c + 61] = .019999999552965164;
  b[f + 15] = 0;
  Qd(Fa, c);
  j = 0 == b[Fa] ? 100 : 65;
  a : do if (65 == j) if (o[Fa + 2] > o[c + 61]) j = 100; else {
    Rd(Va, c);
    j = 0 != b[Va] ? 67 : 68;
    if (67 == j && o[Va + 2] > o[c + 61]) {
      j = 100;
      break a;
    }
    j = 0 == b[Va] ? 69 : 70;
    if (69 == j) {
      var Kd = Na, Ld = Fa;
      b[Kd] = b[Ld];
      o[Kd] = o[Ld];
      b[Kd + 1] = b[Ld + 1];
      o[Kd + 1] = o[Ld + 1];
      b[Kd + 2] = b[Ld + 2];
      o[Kd + 2] = o[Ld + 2];
    } else if (70 == j) {
      var Ub = Na;
      j = o[Va + 2] > .9800000190734863 * o[Fa + 2] + .0010000000474974513 ? 71 : 72;
      if (71 == j) {
        var Md = Va;
        b[Ub] = b[Md];
        o[Ub] = o[Md];
        b[Ub + 1] = b[Md + 1];
        o[Ub + 1] = o[Md + 1];
        b[Ub + 2] = b[Md + 2];
        o[Ub + 2] = o[Md + 2];
      } else if (72 == j) {
        var Nd = Fa;
        b[Ub] = b[Nd];
        o[Ub] = o[Nd];
        b[Ub + 1] = b[Nd + 1];
        o[Ub + 1] = o[Nd + 1];
        b[Ub + 2] = b[Nd + 2];
        o[Ub + 2] = o[Nd + 2];
      }
    }
    var yk = f + 14;
    j = 1 == b[Na] ? 74 : 84;
    if (74 == j) {
      b[yk] = 1;
      Ba = 0;
      za = J(c + 53, c + 16);
      va = 1;
      var zk = c + 32;
      j = va < b[zk] ? 75 : 79;
      b : do if (75 == j) for (var oq = c + 53, pq = c + 16; ; ) if (Ka = J(oq, pq + (va << 1)), j = Ka < za ? 77 : 78, 77 == j && (za = Ka, Ba = va), va += 1, va >= b[zk]) {
        j = 79;
        break b;
      } while (0);
      ma = Ba;
      if (ma + 1 < b[c + 32]) j = 80; else {
        var Ak = 0;
        j = 81;
      }
      80 == j && (Ak = ma + 1);
      La = Ak;
      var If = pa, Jf = c + (ma << 1);
      b[If] = b[Jf];
      o[If] = o[Jf];
      b[If + 1] = b[Jf + 1];
      o[If + 1] = o[Jf + 1];
      b[pa + 2] = 0;
      b[pa + 3] = ma & 255;
      b[pa + 4] = 1;
      b[pa + 5] = 0;
      var Kf = pa + 3, Lf = c + (La << 1);
      b[Kf] = b[Lf];
      o[Kf] = o[Lf];
      b[Kf + 1] = b[Lf + 1];
      o[Kf + 1] = o[Lf + 1];
      b[pa + 5] = 0;
      b[pa + 6] = La & 255;
      b[pa + 7] = 1;
      b[pa + 8] = 0;
      var Bk = ha;
      j = b[c + 62] & 1 ? 82 : 83;
      if (82 == j) {
        b[Bk] = 0;
        b[ha + 1] = 1;
        var Mf = ha + 2, Nf = c + 41;
        b[Mf] = b[Nf];
        o[Mf] = o[Nf];
        b[Mf + 1] = b[Nf + 1];
        o[Mf + 1] = o[Nf + 1];
        var Of = ha + 4, Pf = c + 43;
        b[Of] = b[Pf];
        o[Of] = o[Pf];
        b[Of + 1] = b[Pf + 1];
        o[Of + 1] = o[Pf + 1];
        var Qf = ha + 6, Rf = c + 49;
        b[Qf] = b[Rf];
        o[Qf] = o[Rf];
        b[Qf + 1] = b[Rf + 1];
        o[Qf + 1] = o[Rf + 1];
      } else if (83 == j) {
        b[Bk] = 1;
        b[ha + 1] = 0;
        var Sf = ha + 2, Tf = c + 43;
        b[Sf] = b[Tf];
        o[Sf] = o[Tf];
        b[Sf + 1] = b[Tf + 1];
        o[Sf + 1] = o[Tf + 1];
        var Uf = ha + 4, Vf = c + 41;
        b[Uf] = b[Vf];
        o[Uf] = o[Vf];
        b[Uf + 1] = b[Vf + 1];
        o[Uf + 1] = o[Vf + 1];
        var qq = ha + 6;
        Pd(Ga, c + 49);
        var Wf = qq, Xf = Ga;
        b[Wf] = b[Xf];
        o[Wf] = o[Xf];
        b[Wf + 1] = b[Xf + 1];
        o[Wf + 1] = o[Xf + 1];
      }
    } else if (84 == j) {
      b[yk] = 2;
      var Yf = pa, Zf = c + 41;
      b[Yf] = b[Zf];
      o[Yf] = o[Zf];
      b[Yf + 1] = b[Zf + 1];
      o[Yf + 1] = o[Zf + 1];
      b[pa + 2] = 0;
      b[pa + 3] = b[Na + 1] & 255;
      b[pa + 4] = 0;
      b[pa + 5] = 1;
      var $f = pa + 3, ag = c + 43;
      b[$f] = b[ag];
      o[$f] = o[ag];
      b[$f + 1] = b[ag + 1];
      o[$f + 1] = o[ag + 1];
      b[pa + 5] = 0;
      b[pa + 6] = b[Na + 1] & 255;
      b[pa + 7] = 0;
      b[pa + 8] = 1;
      b[ha] = b[Na + 1];
      if (b[ha] + 1 < b[c + 32]) j = 85; else {
        var Ck = 0;
        j = 86;
      }
      85 == j && (Ck = b[ha] + 1);
      b[ha + 1] = Ck;
      var bg = ha + 2, cg = c + (b[ha] << 1);
      b[bg] = b[cg];
      o[bg] = o[cg];
      b[bg + 1] = b[cg + 1];
      o[bg + 1] = o[cg + 1];
      var dg = ha + 4, eg = c + (b[ha + 1] << 1);
      b[dg] = b[eg];
      o[dg] = o[eg];
      b[dg + 1] = b[eg + 1];
      o[dg + 1] = o[eg + 1];
      var fg = ha + 6, gg = c + 16 + (b[ha] << 1);
      b[fg] = b[gg];
      o[fg] = o[gg];
      b[fg + 1] = b[gg + 1];
      o[fg + 1] = o[gg + 1];
    }
    nc(ha + 8, o[ha + 7], -o[ha + 6]);
    var rq = ha + 11;
    Pd(ya, ha + 8);
    var hg = rq, ig = ya;
    b[hg] = b[ig];
    o[hg] = o[ig];
    b[hg + 1] = b[ig + 1];
    o[hg + 1] = o[ig + 1];
    o[ha + 10] = J(ha + 8, ha + 2);
    o[ha + 13] = J(ha + 11, ha + 4);
    var Dk = Sd(Oa, pa, ha + 8, o[ha + 10], b[ha]);
    Gb = Dk;
    if (2 > Dk) j = 100; else if (Gb = Sd(Ea, Oa, ha + 11, o[ha + 13], b[ha + 1]), 2 > Gb) j = 100; else {
      j = 1 == b[Na] ? 90 : 91;
      if (90 == j) {
        var jg = f + 10, kg = ha + 6;
        b[jg] = b[kg];
        o[jg] = o[kg];
        b[jg + 1] = b[kg + 1];
        o[jg + 1] = o[kg + 1];
        var lg = f + 12, mg = ha + 2;
        b[lg] = b[mg];
        o[lg] = o[mg];
        b[lg + 1] = b[mg + 1];
        o[lg + 1] = o[mg + 1];
      } else if (91 == j) {
        var ng = f + 10, og = g + 21 + (b[ha] << 1);
        b[ng] = b[og];
        o[ng] = o[og];
        b[ng + 1] = b[og + 1];
        o[ng + 1] = o[og + 1];
        var pg = f + 12, qg = g + 5 + (b[ha] << 1);
        b[pg] = b[qg];
        o[pg] = o[qg];
        b[pg + 1] = b[qg + 1];
        o[pg + 1] = o[qg + 1];
      }
      Pa = Ob = 0;
      for (var sq = ha + 6, tq = ha + 2, uq = c + 61, vq = Na, wq = c + 33, rg = fc; ; ) {
        C(Pb, Ea + 3 * Pa, tq);
        ec = J(sq, Pb);
        j = ec <= o[uq] ? 94 : 98;
        if (94 == j) {
          var Ek = Wa = f + 5 * Ob, Fk = Ea + 3 * Pa;
          j = 1 == b[vq] ? 95 : 96;
          if (95 == j) {
            Tc(fc, wq, Fk);
            var sg = Ek;
            b[sg] = b[rg];
            o[sg] = o[rg];
            b[sg + 1] = b[rg + 1];
            o[sg + 1] = o[rg + 1];
            b[Wa + 4] = b[Ea + 3 * Pa + 2];
            o[Wa + 4] = o[Ea + 3 * Pa + 2];
          } else if (96 == j) {
            var tg = Ek, ug = Fk;
            b[tg] = b[ug];
            o[tg] = o[ug];
            b[tg + 1] = b[ug + 1];
            o[tg + 1] = o[ug + 1];
            b[Wa + 6] = b[Ea + 3 * Pa + 5];
            b[Wa + 7] = b[Ea + 3 * Pa + 4];
            b[Wa + 4] = b[Ea + 3 * Pa + 3];
            b[Wa + 5] = b[Ea + 3 * Pa + 2];
          }
          Ob += 1;
        }
        var Gk = Pa + 1;
        Pa = Gk;
        if (2 <= Gk) {
          j = 99;
          break;
        }
      }
      b[f + 15] = Ob;
    }
  } while (0);
  a = h;
}

dd.X = 1;

function Q(c, f) {
  return o[c] * o[f + 1] - o[c + 1] * o[f];
}

function Pd(c, f) {
  nc(c, -o[f], -o[f + 1]);
}

function S(c, f, d) {
  oc(c, o[f + 1] * o[d] - o[f] * o[d + 1], o[f] * o[d] + o[f + 1] * o[d + 1]);
}

function Od(c, f, d) {
  oc(c, o[f + 1] * o[d] + o[f] * o[d + 1], -o[f] * o[d] + o[f + 1] * o[d + 1]);
}

function Qd(c, f) {
  var d = a;
  a += 2;
  var e, g, i;
  b[c] = 1;
  b[c + 1] = b[f + 62] & 1 ? 0 : 1;
  o[c + 2] = 3.4028234663852886e+38;
  g = 0;
  var h = f + 32;
  e = g < b[h] ? 1 : 5;
  a : do if (1 == e) for (var j = f + 53, k = f, l = f + 41, m = c + 2, n = c + 2; ; ) if (C(d, k + (g << 1), l), i = J(j, d), e = i < o[m] ? 3 : 4, 3 == e && (o[n] = i), g += 1, g >= b[h]) break a; while (0);
  a = d;
}

Qd.X = 1;

function Rd(c, f) {
  var d = a;
  a += 12;
  var e, g, i = d + 2, h = d + 4, j, k = d + 6, l = d + 8, m = d + 10;
  b[c] = 0;
  b[c + 1] = -1;
  o[c + 2] = -3.4028234663852886e+38;
  oc(d, -o[f + 54], o[f + 53]);
  g = 0;
  for (var n = f + 32, p = f + 16, u = f + 41, r = f + 43, q = f + 61, v = f + 59, x = f + 53, w = c + 2, y = c + 1, z = c + 2, B = f + 57, E = f + 53; ; ) {
    if (g >= b[n]) {
      e = 10;
      break;
    }
    Pd(i, p + (g << 1));
    C(h, f + (g << 1), u);
    e = J(i, h);
    C(k, f + (g << 1), r);
    j = J(i, k);
    j = e < j ? e : j;
    if (j > o[q]) {
      e = 3;
      break;
    }
    e = 0 <= J(i, d) ? 5 : 6;
    5 == e ? (C(l, i, v), e = -.03490658849477768 > J(l, x) ? 9 : 7) : 6 == e && (C(m, i, B), e = -.03490658849477768 > J(m, E) ? 9 : 7);
    7 == e && (j > o[w] ? (b[c] = 2, b[y] = g, o[z] = j) : e = 9);
    g += 1;
  }
  3 == e && (b[c] = 2, b[c + 1] = g, o[c + 2] = j);
  a = d;
}

Rd.X = 1;

function Td(c, f, d, e, g) {
  var i = a;
  a += 56;
  var h, j, k, l = i + 1, m, n, p = i + 2, u = i + 6, r, q, v = i + 10, x, w, y, z = i + 16, B = i + 18, E = i + 20, D = i + 22, H = i + 24, I = i + 26, M = i + 28, G = i + 30, R = i + 32, P = i + 34, L, T, F = i + 36, X = i + 42, Z = i + 48, V, aa = i + 50, ja = i + 52;
  b[c + 15] = 0;
  j = o[f + 2] + o[e + 2];
  b[i] = 0;
  k = Ud(i, f, d, e, g);
  h = k > j ? 16 : 1;
  do if (1 == h) if (b[l] = 0, h = Ud(l, e, g, f, d), h > j) h = 16; else {
    h = h > .9800000190734863 * k + .0010000000474974513 ? 3 : 4;
    3 == h ? (m = e, n = f, r = p, q = g, b[r] = b[q], o[r] = o[q], b[r + 1] = b[q + 1], o[r + 1] = o[q + 1], b[r + 2] = b[q + 2], o[r + 2] = o[q + 2], b[r + 3] = b[q + 3], o[r + 3] = o[q + 3], r = u, q = d, b[r] = b[q], o[r] = o[q], b[r + 1] = b[q + 1], o[r + 1] = o[q + 1], b[r + 2] = b[q + 2], o[r + 2] = o[q + 2], b[r + 3] = b[q + 3], o[r + 3] = o[q + 3], r = b[l], b[c + 14] = 2, q = 1) : 4 == h && (m = f, n = e, r = p, q = d, b[r] = b[q], o[r] = o[q], b[r + 1] = b[q + 1], o[r + 1] = o[q + 1], b[r + 2] = b[q + 2], o[r + 2] = o[q + 2], b[r + 3] = b[q + 3], o[r + 3] = o[q + 3], r = u, q = g, b[r] = b[q], o[r] = o[q], b[r + 1] = b[q + 1], o[r + 1] = o[q + 1], b[r + 2] = b[q + 2], o[r + 2] = o[q + 2], b[r + 3] = b[q + 3], o[r + 3] = o[q + 3], r = b[i], b[c + 14] = 1, q = 0);
    Vd(v, m, p, r, n, u);
    h = b[m + 37];
    x = m + 5;
    w = r;
    if (r + 1 < h) h = 6; else {
      var Y = 0;
      h = 7;
    }
    6 == h && (Y = r + 1);
    y = Y;
    L = z;
    T = x + (w << 1);
    b[L] = b[T];
    o[L] = o[T];
    b[L + 1] = b[T + 1];
    o[L + 1] = o[T + 1];
    L = B;
    x += y << 1;
    b[L] = b[x];
    o[L] = o[x];
    b[L + 1] = b[x + 1];
    o[L + 1] = o[x + 1];
    C(E, B, z);
    Xc(E);
    Wd(D, E);
    N(I, z, B);
    K(H, .5, I);
    S(M, p + 2, E);
    Wd(G, M);
    Pc(R, p, z);
    x = z;
    L = R;
    b[x] = b[L];
    o[x] = o[L];
    b[x + 1] = b[L + 1];
    o[x + 1] = o[L + 1];
    Pc(P, p, B);
    x = B;
    L = P;
    b[x] = b[L];
    o[x] = o[L];
    b[x + 1] = b[L + 1];
    o[x + 1] = o[L + 1];
    x = J(G, z);
    L = -J(M, z) + j;
    T = J(M, B) + j;
    var W = F, $ = v;
    Pd(Z, M);
    if (2 > Sd(W, $, Z, L, w)) h = 16; else if (w = Sd(X, F, M, T, y), 2 > w) h = 16; else {
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
      T = ja;
      for (var W = ja + 1, $ = ja, ga = ja + 3, la = ja + 2; ; ) {
        h = J(G, X + 3 * y) - x;
        h = h <= j ? 11 : 14;
        if (11 == h) {
          h = V = c + 5 * w;
          Tc(aa, u, X + 3 * y);
          b[h] = b[L];
          o[h] = o[L];
          b[h + 1] = b[L + 1];
          o[h + 1] = o[L + 1];
          b[V + 4] = b[X + 3 * y + 2];
          o[V + 4] = o[X + 3 * y + 2];
          h = 0 != q ? 12 : 13;
          if (12 == h) {
            var fa = V + 4;
            b[T] = b[fa];
            o[T] = o[fa];
            b[T + 1] = b[fa + 1];
            o[T + 1] = o[fa + 1];
            b[T + 2] = b[fa + 2];
            o[T + 2] = o[fa + 2];
            b[T + 3] = b[fa + 3];
            o[T + 3] = o[fa + 3];
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

Td.X = 1;

function Wd(c, f) {
  oc(c, 1 * o[f + 1], -1 * o[f]);
}

function Ud(c, f, d, e, g) {
  var i = a;
  a += 8;
  var h, j, k, l;
  h = i + 2;
  var m = i + 4, n = i + 6, p, u, r, q, v, x, w, y;
  k = b[f + 37];
  l = f + 21;
  Pc(h, g, e + 3);
  Pc(m, d, f + 3);
  C(i, h, m);
  Od(n, d + 2, i);
  m = 0;
  p = -3.4028234663852886e+38;
  u = 0;
  h = u < k ? 1 : 4;
  a : do if (1 == h) for (;;) if (r = J(l + (u << 1), n), h = r > p ? 2 : 3, 2 == h && (p = r, m = u), u += 1, u >= k) break a; while (0);
  l = Xd(f, d, m, e, g);
  h = 0 <= m - 1 ? 5 : 6;
  5 == h ? q = m - 1 : 6 == h && (q = k - 1);
  n = Xd(f, d, q, e, g);
  m + 1 < k ? h = 8 : (v = 0, h = 9);
  8 == h && (v = m + 1);
  p = Xd(f, d, v, e, g);
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
      l = Xd(f, d, m, e, g);
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

Ud.X = 1;

function Vd(c, f, d, e, g, i) {
  var h = a;
  a += 8;
  var j, k, l, m, n = h + 2, p = h + 4, u = h + 6;
  j = f + 21;
  k = b[g + 37];
  l = g + 5;
  m = g + 21;
  g = 0 <= e ? 1 : 2;
  1 == g && (g = e < b[f + 37] ? 3 : 2);
  2 == g && O(Yd, 151, Zd, he);
  g = i + 2;
  S(n, d + 2, j + (e << 1));
  Od(h, g, n);
  d = 0;
  j = 3.4028234663852886e+38;
  n = 0;
  g = n < k ? 4 : 7;
  a : do if (4 == g) for (;;) if (f = J(h, m + (n << 1)), g = f < j ? 5 : 6, 5 == g && (j = f, d = n), n += 1, n >= k) break a; while (0);
  m = d;
  if (m + 1 < k) g = 8; else var r = 0, g = 9;
  8 == g && (r = m + 1);
  k = r;
  Pc(p, i, l + (m << 1));
  b[c] = b[p];
  o[c] = o[p];
  b[c + 1] = b[p + 1];
  o[c + 1] = o[p + 1];
  b[c + 2] = e & 255;
  b[c + 3] = m & 255;
  b[c + 4] = 1;
  b[c + 5] = 0;
  p = c + 3;
  Pc(u, i, l + (k << 1));
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

Vd.X = 1;

function Xd(c, f, d, e, g) {
  var i = a;
  a += 10;
  var h, j, k, l, m = i + 2, n, p, u = i + 4, r = i + 6, q = i + 8;
  h = c + 5;
  j = c + 21;
  k = b[e + 37];
  l = e + 5;
  e = 0 <= d ? 1 : 2;
  1 == e && (e = d < b[c + 37] ? 3 : 2);
  2 == e && O(Yd, 32, ie, he);
  S(i, f + 2, j + (d << 1));
  Od(m, g + 2, i);
  c = 0;
  j = 3.4028234663852886e+38;
  n = 0;
  e = n < k ? 4 : 7;
  a : do if (4 == e) for (;;) if (p = J(l + (n << 1), m), e = p < j ? 5 : 6, 5 == e && (j = p, c = n), n += 1, n >= k) break a; while (0);
  Pc(u, f, h + (d << 1));
  Pc(r, g, l + (c << 1));
  C(q, r, u);
  f = J(q, i);
  a = i;
  return f;
}

Xd.X = 1;

function je(c, f, d, e, g, i) {
  var h = a;
  a += 60;
  var j, k = h + 2, l = h + 4, m = h + 6, n = h + 8, p = h + 10, u = h + 12, r = h + 14, q = h + 16, v = h + 18, x = h + 20, w, y = h + 22, z = h + 24, B = h + 26, E = h + 28, D = h + 30, H = h + 32, I = h + 34, M = h + 36, G = h + 38, R = h + 40, P = h + 42, L = h + 44, T = h + 46, F = h + 48, X = h + 50, Z = h + 52, V = h + 54, aa = h + 56, ja = h + 58;
  j = 0 == b[f + 15] ? 12 : 1;
  a : do if (1 == j) {
    j = b[f + 14];
    if (0 == j) j = 2; else if (1 == j) j = 5; else if (2 == j) j = 8; else break;
    if (2 == j) {
      nc(c, 1, 0);
      Pc(h, d, f + 12);
      Pc(k, g, f);
      j = 1.4210854715202004e-14 < Wc(h, k) ? 3 : 4;
      if (3 == j) {
        w = c;
        C(l, k, h);
        var Y = l;
        b[w] = b[Y];
        o[w] = o[Y];
        b[w + 1] = b[Y + 1];
        o[w + 1] = o[Y + 1];
        Xc(c);
      }
      K(n, e, c);
      N(m, h, n);
      K(u, i, c);
      C(p, k, u);
      w = c + 2;
      N(q, m, p);
      K(r, .5, q);
      Y = r;
      b[w] = b[Y];
      o[w] = o[Y];
      b[w + 1] = b[Y + 1];
      o[w + 1] = o[Y + 1];
    } else if (5 == j) {
      w = c;
      S(v, d + 2, f + 10);
      Y = v;
      b[w] = b[Y];
      o[w] = o[Y];
      b[w + 1] = b[Y + 1];
      o[w + 1] = o[Y + 1];
      Pc(x, d, f + 12);
      w = 0;
      if (w >= b[f + 15]) break a;
      for (var W = Y = c, $ = c, ga = c + 2, la = I; ; ) {
        Pc(y, g, f + 5 * w);
        var fa = e;
        C(E, y, x);
        K(B, fa - J(E, Y), W);
        N(z, y, B);
        K(H, i, $);
        C(D, y, H);
        fa = ga + (w << 1);
        N(M, z, D);
        K(I, .5, M);
        b[fa] = b[la];
        o[fa] = o[la];
        b[fa + 1] = b[la + 1];
        o[fa + 1] = o[la + 1];
        w += 1;
        if (w >= b[f + 15]) break a;
      }
    } else if (8 == j) {
      j = c;
      S(G, g + 2, f + 10);
      w = G;
      b[j] = b[w];
      o[j] = o[w];
      b[j + 1] = b[w + 1];
      o[j + 1] = o[w + 1];
      Pc(R, g, f + 12);
      w = 0;
      j = w < b[f + 15] ? 9 : 11;
      b : do if (9 == j) {
        $ = W = Y = c;
        ga = c + 2;
        for (la = V; ; ) if (Pc(P, d, f + 5 * w), fa = i, C(F, P, R), K(T, fa - J(F, Y), W), N(L, P, T), K(Z, e, $), C(X, P, Z), fa = ga + (w << 1), N(aa, X, L), K(V, .5, aa), b[fa] = b[la], o[fa] = o[la], b[fa + 1] = b[la + 1], o[fa + 1] = o[la + 1], w += 1, w >= b[f + 15]) {
          j = 11;
          break b;
        }
      } while (0);
      w = c;
      Pd(ja, c);
      Y = ja;
      b[w] = b[Y];
      o[w] = o[Y];
      b[w + 1] = b[Y + 1];
      o[w + 1] = o[Y + 1];
    }
  } while (0);
  a = h;
}

je.X = 1;

function ke(c) {
  var f;
  if (0 < c) {
    var d = c;
    f = 2;
  } else f = 1;
  1 == f && (d = -c);
  return d;
}

function le(c) {
  b[c + 4] = 0;
  b[c + 5] = 0;
  o[c + 6] = 0;
}

function Sd(c, f, d, e, g) {
  var i = a;
  a += 6;
  var h, j, k = i + 2, l = i + 4;
  h = 0;
  j = J(d, f) - e;
  d = J(d, f + 3) - e;
  if (0 >= j) e = 1; else var m = d, e = 2;
  1 == e && (m = h, h = m + 1, m = c + 3 * m, b[m] = b[f], o[m] = o[f], b[m + 1] = b[f + 1], o[m + 1] = o[f + 1], b[m + 2] = b[f + 2], o[m + 2] = o[f + 2], m = d);
  if (3 == (0 >= m ? 3 : 4)) m = h, h = m + 1, m = c + 3 * m, e = f + 3, b[m] = b[e], o[m] = o[e], b[m + 1] = b[e + 1], o[m + 1] = o[e + 1], b[m + 2] = b[e + 2], o[m + 2] = o[e + 2];
  if (5 == (0 > j * d ? 5 : 6)) j /= j - d, d = c + 3 * h, C(l, f + 3, f), K(k, j, l), N(i, f, k), b[d] = b[i], o[d] = o[i], b[d + 1] = b[i + 1], o[d + 1] = o[i + 1], b[c + 3 * h + 2] = g & 255, b[c + 3 * h + 3] = b[f + 3], b[c + 3 * h + 4] = 0, b[c + 3 * h + 5] = 1, h += 1;
  a = i;
  return h;
}

Sd.X = 1;

function me(c, f, d) {
  var e;
  e = b[f + 1];
  e = 0 == e ? 1 : 2 == e ? 2 : 3 == e ? 3 : 1 == e ? 10 : 11;
  11 == e ? O(ne, 81, oe, pe) : 1 == e ? (b[c + 4] = f + 3, b[c + 5] = 1, o[c + 6] = o[f + 2]) : 2 == e ? (b[c + 4] = f + 5, b[c + 5] = b[f + 37], o[c + 6] = o[f + 2]) : 3 == e ? (e = 0 <= d ? 4 : 5, 4 == e && (e = d < b[f + 4] ? 6 : 5), 5 == e && O(ne, 53, oe, qe), e = b[f + 3] + (d << 1), b[c] = b[e], o[c] = o[e], b[c + 1] = b[e + 1], o[c + 1] = o[e + 1], e = d + 1 < b[f + 4] ? 7 : 8, 7 == e ? (e = c + 2, d = b[f + 3] + (d + 1 << 1), b[e] = b[d], o[e] = o[d], b[e + 1] = b[d + 1], o[e + 1] = o[d + 1]) : 8 == e && (d = c + 2, e = b[f + 3], b[d] = b[e], o[d] = o[e], b[d + 1] = b[e + 1], o[d + 1] = o[e + 1]), b[c + 4] = c, b[c + 5] = 2, o[c + 6] = o[f + 2]) : 10 == e && (b[c + 4] = f + 3, b[c + 5] = 2, o[c + 6] = o[f + 2]);
}

me.X = 1;

function re(c) {
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
  C(g, e, f);
  i = -J(f, g);
  d = 0 >= i ? 1 : 2;
  if (1 == d) o[c + 6] = 1, b[c + 27] = 1; else if (2 == d) if (e = J(e, g), d = 0 >= e ? 3 : 4, 3 == d) {
    o[c + 15] = 1;
    b[c + 27] = 1;
    e = g = c + 9;
    for (g += 9; e < g; e++, c++) b[c] = b[e], o[c] = o[e];
  } else 4 == d && (g = 1 / (e + i), o[c + 6] = e * g, o[c + 15] = i * g, b[c + 27] = 2);
  a = f;
}

re.X = 1;

function se(c, f) {
  var d = a;
  a += 4;
  var e, g = d + 2;
  e = b[f + 27];
  e = 0 == e ? 1 : 1 == e ? 2 : 2 == e ? 3 : 3 == e ? 4 : 5;
  5 == e ? (O(ne, 207, te, pe), b[c] = b[ue], o[c] = o[ue], b[c + 1] = b[ue + 1], o[c + 1] = o[ue + 1]) : 1 == e ? (O(ne, 194, te, pe), b[c] = b[ue], o[c] = o[ue], b[c + 1] = b[ue + 1], o[c + 1] = o[ue + 1]) : 2 == e ? (g = f + 4, b[c] = b[g], o[c] = o[g], b[c + 1] = b[g + 1], o[c + 1] = o[g + 1]) : 3 == e ? (K(d, o[f + 6], f + 4), K(g, o[f + 15], f + 13), N(c, d, g)) : 4 == e && (b[c] = b[ue], o[c] = o[ue], b[c + 1] = b[ue + 1], o[c + 1] = o[ue + 1]);
  a = d;
}

function ve(c) {
  return o[c] * o[c] + o[c + 1] * o[c + 1];
}

function we(c) {
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
  C(i, e, f);
  h = J(f, i);
  j = J(e, i);
  h = -h;
  C(d, g, f);
  k = J(f, d);
  l = J(g, d);
  k = -k;
  C(m, g, e);
  n = J(e, m);
  m = J(g, m);
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
      for (var e = j = c + 18, u = j + 9, r = c + 9; e < u; e++, r++) b[r] = b[e], o[r] = o[e];
      break a;
    } else d = 11; else d = 11; while (0);
    d = 0 >= j ? 12 : 14;
    do if (12 == d) if (0 >= n) {
      o[c + 15] = 1;
      b[c + 27] = 1;
      j = c;
      e = c += 9;
      u = c + 9;
      for (r = j; e < u; e++, r++) b[r] = b[e], o[r] = o[e];
      break a;
    } else d = 14; while (0);
    d = 0 >= l & 0 >= m ? 15 : 16;
    if (15 == d) {
      o[c + 24] = 1;
      b[c + 27] = 1;
      r = c;
      e = u = c + 18;
      for (u += 9; e < u; e++, r++) b[r] = b[e], o[r] = o[e];
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
        for (r = j; e < u; e++, r++) b[r] = b[e], o[r] = o[e];
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

we.X = 1;

function xe(c, f, d) {
  var e = a;
  a += 72;
  var g, i, h = e + 4, j = e + 8, k = e + 36, l = e + 39, m;
  g = e + 42;
  var n, p, u = e + 44, r = e + 46, q = e + 48, v = e + 50, x = e + 52, w = e + 56, y = e + 58, z = e + 60, B, E, D = e + 62, H = e + 64, I = e + 66, M = e + 68, G = e + 70;
  b[ye] += 1;
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
  ze(j, f, d, e, i, h);
  se(g, j);
  n = 0;
  var R = j + 27, P = j + 27, L = j + 27, T = j + 27, F = e + 2, X = h + 2, Z = j + 27;
  g = 0;
  a : for (; 20 > g; ) {
    m = b[R];
    p = 0;
    g = p < m ? 3 : 4;
    b : do if (3 == g) for (;;) if (b[k + p] = b[j + 9 * p + 7], b[l + p] = b[j + 9 * p + 8], p += 1, p >= m) break b; while (0);
    g = b[P];
    g = 1 == g ? 9 : 2 == g ? 5 : 3 == g ? 6 : 7;
    7 == g ? (O(ne, 498, Ae, pe), g = 8) : 5 == g ? (re(j), g = 8) : 6 == g && (we(j), g = 8);
    if (8 == g && 3 == b[L]) break a;
    se(u, j);
    p = r;
    B = j;
    E = a;
    a += 4;
    var V = ba, aa = ba, aa = E + 2, V = b[B + 27], V = 1 == V ? 1 : 2 == V ? 2 : 5;
    5 == V ? (O(ne, 184, Be, pe), b[p] = b[ue], o[p] = o[ue], b[p + 1] = b[ue + 1], o[p + 1] = o[ue + 1]) : 1 == V ? Pd(p, B + 4) : 2 == V && (C(E, B + 13, B + 4), Pd(aa, B + 4), aa = Q(E, aa), V = 0 < aa ? 3 : 4, 3 == V ? Ce(p, 1, E) : 4 == V && Wd(p, E));
    a = E;
    if (1.4210854715202004e-14 > ve(r)) break;
    p = j + 9 * b[T];
    B = d;
    Pd(v, r);
    Od(q, F, v);
    b[p + 7] = De(B, q);
    B = p;
    E = Ee(d, b[p + 7]);
    Pc(x, e, E);
    b[B] = b[x];
    o[B] = o[x];
    b[B + 1] = b[x + 1];
    o[B + 1] = o[x + 1];
    B = i;
    Od(w, X, r);
    b[p + 8] = De(B, w);
    B = p + 2;
    E = Ee(i, b[p + 8]);
    Pc(y, h, E);
    b[B] = b[y];
    o[B] = o[y];
    b[B + 1] = b[y + 1];
    o[B + 1] = o[y + 1];
    B = p + 4;
    C(z, p + 2, p);
    b[B] = b[z];
    o[B] = o[z];
    b[B + 1] = b[z + 1];
    o[B + 1] = o[z + 1];
    n += 1;
    b[Fe] += 1;
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
  b[Ge] = b[Ge] > n ? b[Ge] : n;
  He(j, c, c + 2);
  g = Ie(c, c + 2);
  o[c + 4] = g;
  b[c + 5] = n;
  Je(j, f);
  g = b[d + 22] & 1 ? 19 : 23;
  a : do if (19 == g) {
    j = o[d + 6];
    f = o[i + 6];
    g = o[c + 4] > j + f ? 20 : 22;
    do if (20 == g) if (1.1920928955078125e-7 < o[c + 4]) {
      o[c + 4] -= j + f;
      C(D, c + 2, c);
      Xc(D);
      d = c;
      K(H, j, D);
      Nb(d, H);
      c += 2;
      K(I, f, D);
      Ke(c, I);
      break a;
    } else g = 22; while (0);
    N(G, c, c + 2);
    K(M, .5, G);
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

xe.X = 1;

function ze(c, f, d, e, g, i) {
  var h = a;
  a += 20;
  var j, k, l, m = h + 2, n = h + 4, p = h + 6, u = h + 8, r = h + 10, q = h + 12, v = h + 14, x = h + 16, w = h + 18;
  j = 3 >= b[f + 1] ? 2 : 1;
  1 == j && O(ne, 102, Le, Me);
  b[c + 27] = b[f + 1];
  k = 0;
  var y = c + 27;
  j = k < b[y] ? 3 : 5;
  a : do if (3 == j) for (var z = h, B = m, E = n, D = p, H = u; ; ) {
    l = c + 9 * k;
    b[l + 7] = b[k + (f + 2)];
    b[l + 8] = b[k + (f + 5)];
    var I = Ee(d, b[l + 7]);
    b[z] = b[I];
    o[z] = o[I];
    b[z + 1] = b[I + 1];
    o[z + 1] = o[I + 1];
    I = Ee(g, b[l + 8]);
    b[B] = b[I];
    o[B] = o[I];
    b[B + 1] = b[I + 1];
    o[B + 1] = o[I + 1];
    I = l;
    Pc(n, e, h);
    b[I] = b[E];
    o[I] = o[E];
    b[I + 1] = b[E + 1];
    o[I + 1] = o[E + 1];
    I = l + 2;
    Pc(p, i, m);
    b[I] = b[D];
    o[I] = o[D];
    b[I + 1] = b[D + 1];
    o[I + 1] = o[D + 1];
    I = l + 4;
    C(u, l + 2, l);
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
    l = Ne(c);
    j = l < .5 * k ? 8 : 7;
    if (7 == j && !(2 * k < l | 1.1920928955078125e-7 > l)) break a;
    b[c + 27] = 0;
  } while (0);
  j = 0 == b[c + 27] ? 10 : 11;
  10 == j && (b[c + 7] = 0, b[c + 8] = 0, f = Ee(d, 0), b[r] = b[f], o[r] = o[f], b[r + 1] = b[f + 1], o[r + 1] = o[f + 1], g = Ee(g, 0), b[q] = b[g], o[q] = o[g], b[q + 1] = b[g + 1], o[q + 1] = o[g + 1], Pc(v, e, r), b[c] = b[v], o[c] = o[v], b[c + 1] = b[v + 1], o[c + 1] = o[v + 1], e = c + 2, Pc(x, i, q), b[e] = b[x], o[e] = o[x], b[e + 1] = b[x + 1], o[e + 1] = o[x + 1], i = c + 4, C(w, c + 2, c), b[i] = b[w], o[i] = o[w], b[i + 1] = b[w + 1], o[i + 1] = o[w + 1], b[c + 27] = 1);
  a = h;
}

ze.X = 1;

function Ee(c, f) {
  var d;
  d = 0 <= f ? 1 : 2;
  1 == d && (d = f < b[c + 5] ? 3 : 2);
  2 == d && O(Oe, 103, Pe, Qe);
  return b[c + 4] + (f << 1);
}

function He(c, f, d) {
  var e = a;
  a += 22;
  var g, i = e + 2, h = e + 4, j = e + 6, k = e + 8, l = e + 10, m = e + 12, n = e + 14, p = e + 16, u = e + 18, r = e + 20;
  g = b[c + 27];
  g = 0 == g ? 1 : 1 == g ? 2 : 2 == g ? 3 : 3 == g ? 4 : 5;
  5 == g ? O(ne, 236, Re, pe) : 1 == g ? O(ne, 217, Re, pe) : 2 == g ? (b[f] = b[c], o[f] = o[c], b[f + 1] = b[c + 1], o[f + 1] = o[c + 1], c += 2, b[d] = b[c], o[d] = o[c], b[d + 1] = b[c + 1], o[d + 1] = o[c + 1]) : 3 == g ? (K(i, o[c + 6], c), K(h, o[c + 15], c + 9), N(e, i, h), b[f] = b[e], o[f] = o[e], b[f + 1] = b[e + 1], o[f + 1] = o[e + 1], K(k, o[c + 6], c + 2), K(l, o[c + 15], c + 11), N(j, k, l), b[d] = b[j], o[d] = o[j], b[d + 1] = b[j + 1], o[d + 1] = o[j + 1]) : 4 == g && (K(p, o[c + 6], c), K(u, o[c + 15], c + 9), N(n, p, u), K(r, o[c + 24], c + 18), N(m, n, r), b[f] = b[m], o[f] = o[m], b[f + 1] = b[m + 1], o[f + 1] = o[m + 1], b[d] = b[f], o[d] = o[f], b[d + 1] = b[f + 1], o[d + 1] = o[f + 1]);
  a = e;
}

He.X = 1;

function Ke(c, f) {
  o[c] -= o[f];
  o[c + 1] -= o[f + 1];
}

function Ce(c, f, d) {
  oc(c, -f * o[d + 1], f * o[d]);
}

function Se(c, f) {
  var d;
  d = 0 <= f ? 1 : 2;
  1 == d && (d = f < b[c + 3] ? 3 : 2);
  2 == d && O(Te, 97, vg, wg);
  d = 0 < b[c + 2] ? 5 : 4;
  4 == d && O(Te, 98, vg, xg);
  b[b[c + 1] + 9 * f + 5] = b[c + 4];
  b[b[c + 1] + 9 * f + 8] = -1;
  b[c + 4] = f;
  b[c + 2] -= 1;
}

function De(c, f) {
  var d, e, g, i, h;
  e = 0;
  g = J(b[c + 4], f);
  i = 1;
  var j = c + 5;
  d = i < b[j] ? 1 : 5;
  a : do if (1 == d) for (var k = c + 4; ; ) if (h = J(b[k] + (i << 1), f), d = h > g ? 3 : 4, 3 == d && (e = i, g = h), i += 1, i >= b[j]) break a; while (0);
  return e;
}

function Ie(c, f) {
  var d = a;
  a += 2;
  C(d, c, f);
  var e = Yc(d);
  a = d;
  return e;
}

function Je(c, f) {
  var d, e;
  d = Ne(c);
  o[f] = d;
  b[f + 1] = b[c + 27] & 65535;
  e = 0;
  var g = c + 27;
  d = e < b[g] ? 1 : 2;
  a : do if (1 == d) for (;;) if (b[e + (f + 2)] = b[c + 9 * e + 7] & 255, b[e + (f + 5)] = b[c + 9 * e + 8] & 255, e += 1, e >= b[g]) break a; while (0);
}

Je.X = 1;

function Ne(c) {
  var f = a;
  a += 4;
  var d, e, g = f + 2;
  d = b[c + 27];
  d = 0 == d ? 1 : 1 == d ? 2 : 2 == d ? 3 : 3 == d ? 4 : 5;
  5 == d ? (O(ne, 259, yg, pe), e = 0) : 1 == d ? (O(ne, 246, yg, pe), e = 0) : 2 == d ? e = 0 : 3 == d ? e = Ie(c + 4, c + 13) : 4 == d && (C(f, c + 13, c + 4), C(g, c + 22, c + 4), e = Q(f, g));
  a = f;
  return e;
}

function Mc(c) {
  var f, d;
  b[c] = -1;
  b[c + 3] = 16;
  b[c + 2] = 0;
  f = kb(36 * b[c + 3]);
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

Mc.X = 1;

function zg(c) {
  var f, d;
  f = -1 == b[c + 4] ? 1 : 7;
  if (1 == f) {
    f = b[c + 2] == b[c + 3] ? 3 : 2;
    2 == f && O(Te, 61, Ag, Bg);
    d = b[c + 1];
    b[c + 3] <<= 1;
    f = kb(36 * b[c + 3]);
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

zg.X = 1;

function Cg(c, f, d) {
  var e = a;
  a += 6;
  var g, i = e + 2, h = e + 4;
  g = zg(c);
  oc(e, .10000000149011612, .10000000149011612);
  var j = b[c + 1] + 9 * g;
  C(i, f, e);
  b[j] = b[i];
  o[j] = o[i];
  b[j + 1] = b[i + 1];
  o[j + 1] = o[i + 1];
  i = b[c + 1] + 9 * g + 2;
  N(h, f + 2, e);
  b[i] = b[h];
  o[i] = o[h];
  b[i + 1] = b[h + 1];
  o[i + 1] = o[h + 1];
  b[b[c + 1] + 9 * g + 4] = d;
  b[b[c + 1] + 9 * g + 8] = 0;
  Dg(c, g);
  a = e;
  return g;
}

Cg.X = 1;

function Eg(c, f) {
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

Eg.X = 1;

function Dg(c, f) {
  var d = a;
  a += 24;
  var e, g, i, h, j = d + 4, k, l, m, n = d + 8, p = d + 12, u, r = d + 16, q = d + 20, v, x;
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
    var H = c + 1, I = c + 1, M = c + 1, G = c + 1, R = c + 1;
    b : for (; 0 == (-1 == b[b[w] + 9 * g + 6]); ) {
      i = b[b[y] + 9 * g + 6];
      h = b[b[z] + 9 * g + 7];
      e = Fg(b[B] + 9 * g);
      Gg(j, b[E] + 9 * g, d);
      k = Fg(j);
      l = 2 * k;
      k = 2 * (k - e);
      e = -1 == b[b[D] + 9 * i + 6] ? 5 : 6;
      5 == e ? (Gg(n, d, b[v] + 9 * i), m = Fg(n) + k) : 6 == e && (Gg(p, d, b[G] + 9 * i), m = Fg(b[R] + 9 * i), e = Fg(p), m = e - m + k);
      e = -1 == b[b[x] + 9 * h + 6] ? 8 : 9;
      8 == e ? (Gg(r, d, b[H] + 9 * h), u = Fg(r) + k) : 9 == e && (Gg(q, d, b[I] + 9 * h), u = Fg(b[M] + 9 * h), e = Fg(q), u = e - u + k);
      e = l < m ? 11 : 12;
      if (11 == e && l < u) break b;
      e = m < u ? 13 : 14;
      13 == e ? g = i : 14 == e && (g = h);
    }
    i = b[b[c + 1] + 9 * g + 5];
    h = zg(c);
    b[b[c + 1] + 9 * h + 5] = i;
    b[b[c + 1] + 9 * h + 4] = 0;
    Gg(b[c + 1] + 9 * h, d, b[c + 1] + 9 * g);
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
        g = Hg(c, g);
        v = b[b[i] + 9 * g + 6];
        x = b[b[h] + 9 * g + 7];
        if (-1 != v) {
          var P = b[b[h] + 9 * g + 7];
          e = 25;
        } else e = 24;
        24 == e && (O(Te, 307, Ig, Jg), P = x);
        e = -1 != P ? 27 : 26;
        26 == e && O(Te, 308, Ig, Kg);
        b[b[y] + 9 * g + 8] = (b[b[l] + 9 * v + 8] > b[b[w] + 9 * x + 8] ? b[b[l] + 9 * v + 8] : b[b[w] + 9 * x + 8]) + 1;
        Gg(b[z] + 9 * g, b[B] + 9 * v, b[E] + 9 * x);
        g = v = b[b[D] + 9 * g + 5];
        if (-1 == v) break a;
      }
    }
  } while (0);
  a = d;
}

Dg.X = 1;

function Lg(c, f) {
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
      Se(c, e);
      e = g;
      if (-1 == g) break a;
      g = c + 1;
      for (var k = c + 1, l = c + 1, m = c + 1, n = c + 1, p = c + 1, u = c + 1, r = c + 1, q = c + 1; ; ) if (e = Hg(c, e), h = b[b[g] + 9 * e + 6], j = b[b[k] + 9 * e + 7], Gg(b[l] + 9 * e, b[m] + 9 * h, b[n] + 9 * j), b[b[r] + 9 * e + 8] = (b[b[p] + 9 * h + 8] > b[b[u] + 9 * j + 8] ? b[b[p] + 9 * h + 8] : b[b[u] + 9 * j + 8]) + 1, e = h = b[b[q] + 9 * e + 5], -1 == h) break a;
    } else 12 == d && (b[c] = i, b[b[c + 1] + 9 * i + 5] = -1, Se(c, e));
  } while (0);
}

Lg.X = 1;

function Mg(c, f, d, e) {
  var g = a;
  a += 12;
  var i, h, j = g + 4, k = g + 6, l = g + 8, m = g + 10;
  i = 0 <= f ? 1 : 2;
  1 == i && (i = f < b[c + 3] ? 3 : 2);
  2 == i && O(Te, 135, Ng, Og);
  i = -1 == b[b[c + 1] + 9 * f + 6] ? 5 : 4;
  4 == i && O(Te, 137, Ng, Pg);
  i = Eg(b[c + 1] + 9 * f, d) ? 6 : 7;
  6 == i ? h = 0 : 7 == i && (Lg(c, f), b[g] = b[d], o[g] = o[d], b[g + 1] = b[d + 1], o[g + 1] = o[d + 1], b[g + 2] = b[d + 2], o[g + 2] = o[d + 2], b[g + 3] = b[d + 3], o[g + 3] = o[d + 3], oc(j, .10000000149011612, .10000000149011612), C(k, g, j), b[g] = b[k], o[g] = o[k], b[g + 1] = b[k + 1], o[g + 1] = o[k + 1], i = g + 2, N(l, g + 2, j), b[i] = b[l], o[i] = o[l], b[i + 1] = b[l + 1], o[i + 1] = o[l + 1], K(m, 2, e), e = o[m], i = 0 > o[m] ? 8 : 9, 8 == i ? o[g] += e : 9 == i && (o[g + 2] += e), e = o[m + 1], i = 0 > o[m + 1] ? 11 : 12, 11 == i ? o[g + 1] += e : 12 == i && (o[g + 3] += e), m = b[c + 1] + 9 * f, b[m] = b[g], o[m] = o[g], b[m + 1] = b[g + 1], o[m + 1] = o[g + 1], b[m + 2] = b[g + 2], o[m + 2] = o[g + 2], b[m + 3] = b[g + 3], o[m + 3] = o[g + 3], Dg(c, f), h = 1);
  a = g;
  return h;
}

Mg.X = 1;

function Fg(c) {
  return 2 * (o[c + 2] - o[c] + (o[c + 3] - o[c + 1]));
}

function Gg(c, f, d) {
  var e = a;
  a += 4;
  var g = e + 2;
  Qg(e, f, d);
  b[c] = b[e];
  o[c] = o[e];
  b[c + 1] = b[e + 1];
  o[c + 1] = o[e + 1];
  c += 2;
  Rg(g, f + 2, d + 2);
  b[c] = b[g];
  o[c] = o[g];
  b[c + 1] = b[g + 1];
  o[c + 1] = o[g + 1];
  a = e;
}

function Hg(c, f) {
  var d, e, g, i, h, j, k, l, m;
  1 == (-1 != f ? 2 : 1) && O(Te, 382, Sg, Tg);
  g = b[c + 1] + 9 * f;
  d = -1 == b[g + 6] ? 4 : 3;
  a : do if (3 == d) if (2 > b[g + 8]) d = 4; else if (i = b[g + 6], h = b[g + 7], d = 0 <= i ? 6 : 7, 6 == d && (d = i < b[c + 3] ? 8 : 7), 7 == d && O(Te, 392, Sg, Ug), d = 0 <= h ? 9 : 10, 9 == d && (d = h < b[c + 3] ? 11 : 10), 10 == d && O(Te, 393, Sg, Vg), j = b[c + 1] + 9 * i, k = b[c + 1] + 9 * h, l = b[k + 8] - b[j + 8], d = 1 < b[k + 8] - b[j + 8] ? 12 : 29, 12 == d) {
    i = b[k + 6];
    e = b[k + 7];
    l = b[c + 1] + 9 * i;
    m = b[c + 1] + 9 * e;
    d = 0 <= i ? 13 : 14;
    13 == d && (d = i < b[c + 3] ? 15 : 14);
    14 == d && O(Te, 407, Sg, Wg);
    d = 0 <= e ? 16 : 17;
    16 == d && (d = e < b[c + 3] ? 18 : 17);
    17 == d && O(Te, 408, Sg, Xg);
    b[k + 6] = f;
    b[k + 5] = b[g + 5];
    b[g + 5] = h;
    d = -1 != b[k + 5] ? 19 : 24;
    19 == d ? (d = b[b[c + 1] + 9 * b[k + 5] + 6] == f ? 20 : 21, 20 == d ? b[b[c + 1] + 9 * b[k + 5] + 6] = h : 21 == d && (d = b[b[c + 1] + 9 * b[k + 5] + 7] == f ? 23 : 22, 22 == d && O(Te, 424, Sg, Yg), b[b[c + 1] + 9 * b[k + 5] + 7] = h)) : 24 == d && (b[c] = h);
    d = b[l + 8] > b[m + 8] ? 26 : 27;
    26 == d ? (b[k + 7] = i, b[g + 7] = e, b[m + 5] = f, Gg(g, j, m), Gg(k, g, l), b[g + 8] = (b[j + 8] > b[m + 8] ? b[j + 8] : b[m + 8]) + 1, b[k + 8] = (b[g + 8] > b[l + 8] ? b[g + 8] : b[l + 8]) + 1) : 27 == d && (b[k + 7] = e, b[g + 7] = i, b[l + 5] = f, Gg(g, j, l), Gg(k, g, m), b[g + 8] = (b[j + 8] > b[l + 8] ? b[j + 8] : b[l + 8]) + 1, b[k + 8] = (b[g + 8] > b[m + 8] ? b[g + 8] : b[m + 8]) + 1);
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
    32 == d && O(Te, 467, Sg, Zg);
    d = 0 <= e ? 34 : 35;
    34 == d && (d = e < b[c + 3] ? 36 : 35);
    35 == d && O(Te, 468, Sg, $g);
    b[j + 6] = f;
    b[j + 5] = b[g + 5];
    b[g + 5] = i;
    d = -1 != b[j + 5] ? 37 : 42;
    37 == d ? (d = b[b[c + 1] + 9 * b[j + 5] + 6] == f ? 38 : 39, 38 == d ? b[b[c + 1] + 9 * b[j + 5] + 6] = i : 39 == d && (d = b[b[c + 1] + 9 * b[j + 5] + 7] == f ? 41 : 40, 40 == d && O(Te, 484, Sg, ah), b[b[c + 1] + 9 * b[j + 5] + 7] = i)) : 42 == d && (b[c] = i);
    d = b[l + 8] > b[m + 8] ? 44 : 45;
    44 == d ? (b[j + 7] = h, b[g + 6] = e, b[m + 5] = f, Gg(g, k, m), Gg(j, g, l), b[g + 8] = (b[k + 8] > b[m + 8] ? b[k + 8] : b[m + 8]) + 1, b[j + 8] = (b[g + 8] > b[l + 8] ? b[g + 8] : b[l + 8]) + 1) : 45 == d && (b[j + 7] = e, b[g + 6] = h, b[l + 5] = f, Gg(g, k, l), Gg(j, g, m), b[g + 8] = (b[k + 8] > b[l + 8] ? b[k + 8] : b[l + 8]) + 1, b[j + 8] = (b[g + 8] > b[m + 8] ? b[g + 8] : b[m + 8]) + 1);
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

Hg.X = 1;

function Qg(c, f, d) {
  oc(c, o[f] < o[d] ? o[f] : o[d], o[f + 1] < o[d + 1] ? o[f + 1] : o[d + 1]);
}

function Rg(c, f, d) {
  oc(c, o[f] > o[d] ? o[f] : o[d], o[f + 1] > o[d + 1] ? o[f + 1] : o[d + 1]);
}

function bh(c, f, d) {
  var e = a;
  a += 8;
  var g = e + 2, i = e + 4, h = e + 6;
  K(g, 1 - d, c + 2);
  K(i, d, c + 4);
  N(e, g, i);
  b[f] = b[e];
  o[f] = o[e];
  b[f + 1] = b[e + 1];
  o[f + 1] = o[e + 1];
  ch(f + 2, (1 - d) * o[c + 6] + d * o[c + 7]);
  S(h, f + 2, c);
  Ke(f, h);
  a = e;
}

function dh(c, f) {
  var d = a;
  a += 90;
  var e, g, i = d + 9, h, j, k, l, m = d + 18, n = d + 26, p = d + 49, u = d + 53, r = d + 57, q = d + 63, v, x, w, y = d + 88, z = d + 89, B, E, D, H, I, M, G;
  b[eh] += 1;
  b[c] = 0;
  o[c + 1] = o[f + 32];
  g = f + 7;
  v = e = f + 14;
  x = e + 9;
  for (w = d; v < x; v++, w++) b[w] = b[v], o[w] = o[v];
  v = e = f + 23;
  x = e + 9;
  for (w = i; v < x; v++, w++) b[w] = b[v], o[w] = o[v];
  fh(d);
  fh(i);
  h = o[f + 32];
  j = .004999999888241291 > o[f + 6] + o[g + 6] - .014999999664723873 ? .004999999888241291 : o[f + 6] + o[g + 6] - .014999999664723873;
  e = .0012499999720603228 < j ? 2 : 1;
  1 == e && O(gh, 280, hh, ih);
  l = k = 0;
  b[m + 1] = 0;
  le(n);
  le(n + 7);
  v = f;
  x = f + 7;
  for (w = n; v < x; v++, w++) b[w] = b[v], o[w] = o[v];
  v = x = f + 7;
  x += 7;
  for (w = n + 7; v < x; v++, w++) b[w] = b[v], o[w] = o[v];
  b[n + 22] = 0;
  for (var R = n + 14, P = n + 18, L = r + 4, T = r + 4; ; ) {
    bh(d, p, k);
    bh(i, u, k);
    b[R] = b[p];
    o[R] = o[p];
    b[R + 1] = b[p + 1];
    o[R + 1] = o[p + 1];
    b[R + 2] = b[p + 2];
    o[R + 2] = o[p + 2];
    b[R + 3] = b[p + 3];
    o[R + 3] = o[p + 3];
    b[P] = b[u];
    o[P] = o[u];
    b[P + 1] = b[u + 1];
    o[P + 1] = o[u + 1];
    b[P + 2] = b[u + 2];
    o[P + 2] = o[u + 2];
    b[P + 3] = b[u + 3];
    o[P + 3] = o[u + 3];
    xe(r, m, n);
    if (0 >= o[L]) {
      e = 4;
      break;
    }
    if (o[T] < j + .0012499999720603228) {
      e = 6;
      break;
    }
    jh(q, m, f, d, g, i, k);
    v = 0;
    x = h;
    for (w = 0; ; ) {
      B = kh(q, y, z, x);
      if (B > j + .0012499999720603228) {
        e = 9;
        break;
      }
      if (B > j - .0012499999720603228) {
        e = 11;
        break;
      }
      E = lh(q, b[y], b[z], k);
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
        G = lh(q, b[y], b[z], M);
        if (.0012499999720603228 > ke(G - j)) {
          e = 21;
          break;
        }
        e = G > j ? 23 : 24;
        23 == e ? (H = M, E = G) : 24 == e && (I = M, B = G);
        D = G = D + 1;
        b[mh] += 1;
        if (50 == G) {
          e = 26;
          break;
        }
      }
      21 == e && (x = M);
      b[nh] = b[nh] > D ? b[nh] : D;
      w = B = w + 1;
      if (8 == B) {
        e = 27;
        break;
      }
    }
    9 == e ? (b[c] = 4, o[c + 1] = h, v = 1) : 11 == e ? k = x : 13 == e ? (b[c] = 1, o[c + 1] = k, v = 1) : 15 == e && (b[c] = 3, o[c + 1] = k, v = 1);
    l += 1;
    b[oh] += 1;
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
  b[ph] = b[ph] > l ? b[ph] : l;
  a = d;
}

dh.X = 1;

function fh(c) {
  var f;
  f = 6.2831854820251465 * qh(o[c + 6] / 6.2831854820251465);
  o[c + 6] -= f;
  o[c + 7] -= f;
}

function jh(c, f, d, e, g, i, h) {
  var j = a;
  a += 66;
  var k, l, m = j + 4, n = j + 8, p = j + 10, u = j + 12, r = j + 14, q = j + 16, v = j + 18, x = j + 20, w = j + 22, y = j + 24, z = j + 26, B = j + 28, E = j + 30, D = j + 32, H = j + 34, I = j + 36, M = j + 38, G = j + 40, R = j + 42, P = j + 44, L = j + 46, T = j + 48, F = j + 50, X = j + 52, Z = j + 54, V = j + 56, aa = j + 58, ja = j + 60, Y = j + 62, W = j + 64;
  b[c] = d;
  b[c + 1] = g;
  l = b[f + 1];
  1 == (0 < l & 3 > l ? 2 : 1) && O(gh, 50, rh, sh);
  for (var $ = e, e = e + 9, ga = c + 2; $ < e; $++, ga++) b[ga] = b[$], o[ga] = o[$];
  $ = i;
  e = i + 9;
  for (ga = c + 11; $ < e; $++, ga++) b[ga] = b[$], o[ga] = o[$];
  bh(c + 2, j, h);
  bh(c + 11, m, h);
  i = 1 == l ? 3 : 4;
  if (3 == i) b[c + 20] = 0, G = Ee(b[c], b[f + 2]), b[n] = b[G], o[n] = o[G], b[n + 1] = b[G + 1], o[n + 1] = o[G + 1], f = Ee(b[c + 1], b[f + 5]), b[p] = b[f], o[p] = o[f], b[p + 1] = b[f + 1], o[p + 1] = o[f + 1], Pc(u, j, n), Pc(r, m, p), m = c + 23, C(q, r, u), b[m] = b[q], o[m] = o[q], b[m + 1] = b[q + 1], o[m + 1] = o[q + 1], k = c = Xc(c + 23); else if (4 == i) if (u = c + 20, i = b[f + 2] == b[f + 3] ? 5 : 8, 5 == i) {
    b[u] = 2;
    W = Ee(g, b[f + 5]);
    b[v] = b[W];
    o[v] = o[W];
    b[v + 1] = b[W + 1];
    o[v + 1] = o[W + 1];
    W = Ee(g, b[f + 6]);
    b[x] = b[W];
    o[x] = o[W];
    b[x + 1] = b[W + 1];
    o[x + 1] = o[W + 1];
    W = c + 23;
    C(y, x, v);
    Wd(w, y);
    b[W] = b[w];
    o[W] = o[w];
    b[W + 1] = b[w + 1];
    o[W + 1] = o[w + 1];
    Xc(c + 23);
    S(z, m + 2, c + 23);
    W = c + 21;
    N(E, v, x);
    K(B, .5, E);
    b[W] = b[B];
    o[W] = o[B];
    b[W + 1] = b[B + 1];
    o[W + 1] = o[B + 1];
    Pc(D, m, c + 21);
    m = Ee(d, b[f + 2]);
    b[H] = b[m];
    o[H] = o[m];
    b[H + 1] = b[m + 1];
    o[H + 1] = o[m + 1];
    Pc(I, j, H);
    C(M, I, D);
    m = J(M, z);
    if (6 == (0 > m ? 6 : 7)) f = c + 23, Pd(G, c + 23), b[f] = b[G], o[f] = o[G], b[f + 1] = b[G + 1], o[f + 1] = o[G + 1], m = -m;
    k = m;
  } else if (8 == i) {
    b[u] = 1;
    G = Ee(b[c], b[f + 2]);
    b[R] = b[G];
    o[R] = o[G];
    b[R + 1] = b[G + 1];
    o[R + 1] = o[G + 1];
    G = Ee(b[c], b[f + 3]);
    b[P] = b[G];
    o[P] = o[G];
    b[P + 1] = b[G + 1];
    o[P + 1] = o[G + 1];
    G = c + 23;
    C(T, P, R);
    Wd(L, T);
    b[G] = b[L];
    o[G] = o[L];
    b[G + 1] = b[L + 1];
    o[G + 1] = o[L + 1];
    Xc(c + 23);
    S(F, j + 2, c + 23);
    G = c + 21;
    N(Z, R, P);
    K(X, .5, Z);
    b[G] = b[X];
    o[G] = o[X];
    b[G + 1] = b[X + 1];
    o[G + 1] = o[X + 1];
    Pc(V, j, c + 21);
    f = Ee(b[c + 1], b[f + 5]);
    b[aa] = b[f];
    o[aa] = o[f];
    b[aa + 1] = b[f + 1];
    o[aa + 1] = o[f + 1];
    Pc(ja, m, aa);
    C(Y, ja, V);
    m = J(Y, F);
    if (9 == (0 > m ? 9 : 10)) f = c + 23, Pd(W, c + 23), b[f] = b[W], o[f] = o[W], b[f + 1] = b[W + 1], o[f + 1] = o[W + 1], m = -m;
    k = m;
  }
  a = j;
  return k;
}

jh.X = 1;

function kh(c, f, d, e) {
  var g = a;
  a += 52;
  var i, h = g + 4, j = g + 8, k = g + 10, l = g + 12, m = g + 14, n = g + 16, p = g + 18, u = g + 20, r = g + 22, q = g + 24, v = g + 26, x = g + 28, w = g + 30, y = g + 32, z = g + 34, B = g + 36, E = g + 38, D = g + 40, H = g + 42, I = g + 44, M = g + 46, G = g + 48, R = g + 50;
  bh(c + 2, g, e);
  bh(c + 11, h, e);
  e = b[c + 20];
  e = 0 == e ? 1 : 1 == e ? 2 : 2 == e ? 3 : 4;
  4 == e ? (O(gh, 183, th, pe), b[f] = -1, b[d] = -1, i = 0) : 1 == e ? (Od(j, g + 2, c + 23), q = h + 2, Pd(l, c + 23), Od(k, q, l), b[f] = De(b[c], j), b[d] = De(b[c + 1], k), f = Ee(b[c], b[f]), b[m] = b[f], o[m] = o[f], b[m + 1] = b[f + 1], o[m + 1] = o[f + 1], d = Ee(b[c + 1], b[d]), b[n] = b[d], o[n] = o[d], b[n + 1] = b[d + 1], o[n + 1] = o[d + 1], Pc(p, g, m), Pc(u, h, n), C(r, u, p), i = c = J(r, c + 23)) : 2 == e ? (S(q, g + 2, c + 23), Pc(v, g, c + 21), m = h + 2, Pd(w, q), Od(x, m, w), b[f] = -1, b[d] = De(b[c + 1], x), c = Ee(b[c + 1], b[d]), b[y] = b[c], o[y] = o[c], b[y + 1] = b[c + 1], o[y + 1] = o[c + 1], Pc(z, h, y), C(B, z, v), i = c = J(B, q)) : 3 == e && (S(E, h + 2, c + 23), Pc(D, h, c + 21), h = g + 2, Pd(I, E), Od(H, h, I), b[d] = -1, b[f] = De(b[c], H), c = Ee(b[c], b[f]), b[M] = b[c], o[M] = o[c], b[M + 1] = b[c + 1], o[M + 1] = o[c + 1], Pc(G, g, M), C(R, G, D), i = c = J(R, E));
  a = g;
  return i;
}

kh.X = 1;

function uh(c) {
  b[c] = vh + 2;
  b[c + 3] = 0;
  b[c + 4] = 0;
}

function wh(c, f, d) {
  var e;
  e = 0 <= d ? 1 : 2;
  1 == e && (e = d < b[c + 4] - 1 ? 3 : 2);
  2 == e && O(xh, 89, yh, zh);
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

wh.X = 1;

function Eh(c, f, d, e) {
  var g = a;
  a += 8;
  var i, h, j = g + 2, k = g + 4, l = g + 6;
  i = e < b[c + 4] ? 2 : 1;
  1 == i && O(xh, 148, Fh, Gh);
  h = e + 1;
  i = h == b[c + 4] ? 3 : 4;
  3 == i && (h = 0);
  Pc(g, d, b[c + 3] + (e << 1));
  Pc(j, d, b[c + 3] + (h << 1));
  Qg(k, g, j);
  b[f] = b[k];
  o[f] = o[k];
  b[f + 1] = b[k + 1];
  o[f + 1] = o[k + 1];
  c = f + 2;
  Rg(l, g, j);
  b[c] = b[l];
  o[c] = o[l];
  b[c + 1] = b[l + 1];
  o[c + 1] = o[l + 1];
  a = g;
}

Eh.X = 1;

function lh(c, f, d, e) {
  var g = a;
  a += 52;
  var i, h = g + 4, j = g + 8, k = g + 10, l = g + 12, m = g + 14, n = g + 16, p = g + 18, u = g + 20, r = g + 22, q = g + 24, v = g + 26, x = g + 28, w = g + 30, y = g + 32, z = g + 34, B = g + 36, E = g + 38, D = g + 40, H = g + 42, I = g + 44, M = g + 46, G = g + 48, R = g + 50;
  bh(c + 2, g, e);
  bh(c + 11, h, e);
  e = b[c + 20];
  e = 0 == e ? 1 : 1 == e ? 2 : 2 == e ? 3 : 4;
  4 == e ? (O(gh, 242, Hh, pe), i = 0) : 1 == e ? (Od(j, g + 2, c + 23), q = h + 2, Pd(l, c + 23), Od(k, q, l), f = Ee(b[c], f), b[m] = b[f], o[m] = o[f], b[m + 1] = b[f + 1], o[m + 1] = o[f + 1], d = Ee(b[c + 1], d), b[n] = b[d], o[n] = o[d], b[n + 1] = b[d + 1], o[n + 1] = o[d + 1], Pc(p, g, m), Pc(u, h, n), C(r, u, p), i = c = J(r, c + 23)) : 2 == e ? (S(q, g + 2, c + 23), Pc(v, g, c + 21), m = h + 2, Pd(w, q), Od(x, m, w), c = Ee(b[c + 1], d), b[y] = b[c], o[y] = o[c], b[y + 1] = b[c + 1], o[y + 1] = o[c + 1], Pc(z, h, y), C(B, z, v), i = c = J(B, q)) : 3 == e && (S(E, h + 2, c + 23), Pc(D, h, c + 21), h = g + 2, Pd(I, E), Od(H, h, I), c = Ee(b[c], f), b[M] = b[c], o[M] = o[c], b[M + 1] = b[c + 1], o[M + 1] = o[c + 1], Pc(G, g, M), C(R, G, D), i = c = J(R, E));
  a = g;
  return i;
}

lh.X = 1;

function ch(c, f) {
  var d = Ih(f);
  o[c] = d;
  d = Jh(f);
  o[c + 1] = d;
}

function Kh(c, f) {
  var d, e;
  e = Lh(f, 40);
  if (0 == e) {
    var g = 0;
    d = 2;
  } else d = 1;
  1 == d && (b[e] = Wb + 2, b[e] = vh + 2, b[e + 1] = 3, o[e + 2] = .009999999776482582, b[e + 3] = 0, b[e + 4] = 0, b[e + 9] = 0, b[e + 10] = 0, g = e);
  d = g;
  e = b[c + 3];
  var g = b[c + 4], i;
  i = 0 == b[d + 3] ? 1 : 2;
  1 == i && (i = 0 == b[d + 4] ? 3 : 2);
  2 == i && O(xh, 48, Mh, Nh);
  4 == (2 <= g ? 5 : 4) && O(xh, 49, Mh, Oh);
  b[d + 4] = g;
  g = kb(g << 3);
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

Kh.X = 1;

function Ph(c, f, d, e, g) {
  var i = a;
  a += 13;
  var h, j;
  h = g < b[c + 4] ? 2 : 1;
  1 == h && O(xh, 129, Qh, Gh);
  dc(i);
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
  f = Rh(i, f, d, e);
  a = i;
  return f;
}

Ph.X = 1;

function Sh(c, f) {
  b[c + 1] = b[f + 1];
  o[c + 2] = o[f + 2];
}

function Th(c, f, d, e) {
  var g = a;
  a += 12;
  var i, h, j = g + 2, k = g + 4, l = g + 6, m = g + 8, n = g + 10;
  S(j, e + 2, c + 3);
  N(g, e, j);
  C(k, d, g);
  j = J(k, k) - o[c + 2] * o[c + 2];
  C(l, d + 2, d);
  c = J(k, l);
  e = J(l, l);
  j = c * c - e * j;
  i = 0 > j ? 2 : 1;
  a : do if (1 == i) if (1.1920928955078125e-7 > e) i = 2; else {
    h = c;
    i = j;
    i = Zc(i);
    h = -(h + i);
    i = 0 <= h ? 4 : 6;
    do if (4 == i) if (h <= o[d + 4] * e) {
      h /= e;
      o[f + 2] = h;
      d = f;
      K(n, h, l);
      N(m, k, n);
      k = d;
      b[k] = b[m];
      o[k] = o[m];
      b[k + 1] = b[m + 1];
      o[k + 1] = o[m + 1];
      Xc(f);
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

Th.X = 1;

function Rh(c, f, d, e) {
  var g = a;
  a += 30;
  var i, h, j = g + 2, k = g + 4, l = g + 6, m = g + 8, n = g + 10, p = g + 12, u = g + 14, r = g + 16;
  i = g + 18;
  var q = g + 20, v = g + 22, x = g + 24, w = g + 26, y = g + 28, z = e + 2;
  C(j, d, e);
  Od(g, z, j);
  j = e + 2;
  C(l, d + 2, e);
  Od(k, j, l);
  C(m, k, g);
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
  C(u, p, n);
  oc(r, o[u + 1], -o[u]);
  Xc(r);
  C(i, n, g);
  u = J(r, i);
  c = J(r, m);
  i = 0 == c ? 1 : 2;
  a : do if (1 == i) h = 0; else if (2 == i) {
    h = u / c;
    i = 0 > h ? 4 : 3;
    do if (3 == i) if (o[d + 4] < h) i = 4; else if (K(v, h, m), N(q, g, v), C(x, p, n), e = J(x, x), i = 0 == e ? 6 : 7, 6 == i) {
      h = 0;
      break a;
    } else if (7 == i) if (C(w, q, n), i = J(w, x) / e, i = 0 > i | 1 < i ? 8 : 9, 8 == i) {
      h = 0;
      break a;
    } else if (9 == i) {
      o[f + 2] = h;
      i = 0 < u ? 10 : 11;
      10 == i ? (Pd(y, r), r = f, b[r] = b[y], o[r] = o[y], b[r + 1] = b[y + 1], o[r + 1] = o[y + 1]) : 11 == i && (y = f, b[y] = b[r], o[y] = o[r], b[y + 1] = b[r + 1], o[y + 1] = o[r + 1]);
      h = 1;
      break a;
    } while (0);
    h = 0;
  } while (0);
  a = g;
  return h;
}

Rh.X = 1;

function Uh(c, f, d) {
  var e = a;
  a += 16;
  var g, i = e + 2, h, j = e + 4, k = e + 6, l = e + 8, m = e + 10, n = e + 12, p = e + 14;
  Pc(e, d, c + 5);
  b[i] = b[e];
  o[i] = o[e];
  b[i + 1] = b[e + 1];
  o[i + 1] = o[e + 1];
  h = 1;
  var u = c + 37;
  g = h < b[u] ? 1 : 3;
  a : do if (1 == g) for (var r = c + 5, q = e, v = k, x = i, w = l; ; ) if (Pc(j, d, r + (h << 1)), Qg(k, e, j), b[q] = b[v], o[q] = o[v], b[q + 1] = b[v + 1], o[q + 1] = o[v + 1], Rg(l, i, j), b[x] = b[w], o[x] = o[w], b[x + 1] = b[w + 1], o[x + 1] = o[w + 1], h += 1, h >= b[u]) break a; while (0);
  oc(m, o[c + 2], o[c + 2]);
  C(n, e, m);
  b[f] = b[n];
  o[f] = o[n];
  b[f + 1] = b[n + 1];
  o[f + 1] = o[n + 1];
  c = f + 2;
  N(p, i, m);
  b[c] = b[p];
  o[c] = o[p];
  b[c + 1] = b[p + 1];
  o[c + 1] = o[p + 1];
  a = e;
}

Uh.X = 1;

function Vh(c, f) {
  o[c] *= f;
  o[c + 1] *= f;
}

function Wh(c, f, d, e) {
  var g = a;
  a += 14;
  var i, h, j = g + 2, k = g + 4, l = g + 6, m = g + 8, n, p, u = g + 10, r, q = g + 12;
  n = e + 2;
  C(j, d, e);
  Od(g, n, j);
  j = e + 2;
  C(l, d + 2, e);
  Od(k, j, l);
  C(m, k, g);
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
    C(u, w + (n << 1), g);
    p = J(i, u);
    r = J(y + (n << 1), m);
    i = 0 == r ? 3 : 5;
    b : do if (3 == i) {
      if (0 > p) {
        i = 4;
        break a;
      }
    } else if (5 == i) {
      if (0 > r) i = 6; else {
        var z = r;
        i = 8;
      }
      do if (6 == i) if (p < k * r) {
        k = p / r;
        j = n;
        i = 11;
        break b;
      } else z = r, i = 8; while (0);
      0 < z ? p < l * r ? l = p / r : i = 11 : i = 11;
    } while (0);
    if (l < k) {
      i = 12;
      break;
    }
    n += 1;
  }
  14 == i ? (i = 0 <= k ? 15 : 16, 15 == i && (i = k <= o[d + 4] ? 17 : 16), 16 == i && O(Xh, 249, Yh, Zh), i = 0 <= j ? 18 : 19, 18 == i ? (o[f + 2] = k, S(q, e + 2, c + 21 + (j << 1)), b[f] = b[q], o[f] = o[q], b[f + 1] = b[q + 1], o[f + 1] = o[q + 1], h = 1) : 19 == i && (h = 0)) : 4 == i ? h = 0 : 12 == i && (h = 0);
  a = g;
  return h;
}

Wh.X = 1;

function $h(c, f, d) {
  var e = a;
  a += 14;
  var g, i, h, j = e + 2, k, l = e + 4, m = e + 6, n, p, u = e + 8, r = e + 10, q, v, x, w = e + 12;
  g = 3 <= b[c + 37] ? 2 : 1;
  1 == g && O(Xh, 306, ai, bi);
  nc(e, 0, 0);
  h = i = 0;
  oc(j, 0, 0);
  k = 0;
  n = c + 37;
  g = k < b[n] ? 3 : 5;
  a : do if (3 == g) for (var y = c + 5; ; ) if (Nb(j, y + (k << 1)), k += 1, k >= b[n]) break a; while (0);
  Vh(j, 1 / b[c + 37]);
  k = 0;
  y = c + 37;
  g = k < b[y] ? 6 : 11;
  a : do if (6 == g) for (var z = c + 5, B = c + 37, E = c + 5, D = l, H = l + 1, I = m, M = m + 1, G = c + 5; ; ) if (C(l, z + (k << 1), j), g = k + 1 < b[B] ? 8 : 9, 8 == g ? C(m, E + (k + 1 << 1), j) : 9 == g && C(m, G, j), n = Q(l, m), p = .5 * n, i += p, p *= .3333333432674408, N(r, l, m), K(u, p, r), Nb(e, u), q = o[D], p = o[H], v = o[I], x = o[M], q = q * q + v * q + v * v, p = p * p + x * p + x * x, h += .0833333358168602 * n * (q + p), k += 1, k >= b[y]) break a; while (0);
  o[f] = d * i;
  12 == (1.1920928955078125e-7 < i ? 13 : 12) && O(Xh, 352, ai, ci);
  Vh(e, 1 / i);
  c = f + 1;
  N(w, e, j);
  b[c] = b[w];
  o[c] = o[w];
  b[c + 1] = b[w + 1];
  o[c + 1] = o[w + 1];
  o[f + 3] = d * h;
  o[f + 3] += o[f] * (J(f + 1, f + 1) - J(e, e));
  a = e;
}

$h.X = 1;

function di(c) {
  var f, d;
  b[c + 2] = 128;
  b[c + 1] = 0;
  d = kb(b[c + 2] << 3);
  b[c] = d;
  f = b[c];
  var e = b[c + 2] << 3;
  for (d = 0; d < 2 * (e / 8); d++) b[f + d] = 0, o[f + d] = 0;
  c += 3;
  for (d = 0; 14 > d; d++) b[c + d] = 0, o[c + d] = 0;
  f = 0 == (b[ei] & 1) ? 1 : 10;
  if (1 == f) {
    c = 0;
    d = 1;
    for (f = 0; ; ) {
      f = 14 > f ? 5 : 4;
      4 == f && O(fi, 73, gi, hi);
      f = d <= b[ii + c] ? 6 : 7;
      6 == f ? b[ji + d] = c & 255 : 7 == f && (c += 1, b[ji + d] = c & 255);
      d = f = d + 1;
      if (!(640 >= f)) break;
      f = c;
    }
    b[ei] = 1;
  }
}

di.X = 1;

function ki(c, f, d) {
  var e;
  if (1 == (0 == d ? 8 : 1)) {
    if (0 < d) {
      var g = d;
      e = 3;
    } else e = 2;
    2 == e && (O(fi, 164, li, mi), g = d);
    e = 640 < g ? 4 : 5;
    4 != e && 5 == e && (d = b[ji + d], 6 == (0 <= d & 14 > d ? 7 : 6) && O(fi, 173, li, ni), b[f] = b[d + (c + 3)], b[d + (c + 3)] = f);
  }
}

ki.X = 1;

function oi(c, f) {
  return o[c] * o[f] + o[c + 1] * o[f + 1] + o[c + 2] * o[f + 2];
}

function pi(c, f, d) {
  qi(c, o[f + 1] * o[d + 2] - o[f + 2] * o[d + 1], o[f + 2] * o[d] - o[f] * o[d + 2], o[f] * o[d + 1] - o[f + 1] * o[d]);
}

pi.X = 1;

function ri(c, f, d) {
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

ri.X = 1;

function si(c, f) {
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

si.X = 1;

function qi(c, f, d, e) {
  o[c] = f;
  o[c + 1] = d;
  o[c + 2] = e;
}

function Lh(c, f) {
  var d, e, g, i, h, j, k, l, m;
  d = 0 == f ? 1 : 2;
  if (1 == d) e = 0; else if (2 == d) if (0 < f ? (g = f, d = 4) : d = 3, 3 == d && (O(fi, 104, ti, mi), g = f), d = 640 < g ? 5 : 6, 5 == d) e = kb(f); else if (6 == d) if (g = b[ji + f], 7 == (0 <= g & 14 > g ? 8 : 7) && O(fi, 112, ti, ni), d = 0 != b[g + (c + 3)] ? 9 : 10, 9 == d) i = b[g + (c + 3)], b[g + (c + 3)] = b[i], e = i; else if (10 == d) {
    d = b[c + 1] == b[c + 2] ? 11 : 12;
    if (11 == d) {
      e = b[c];
      b[c + 2] += 128;
      d = kb(b[c + 2] << 3);
      b[c] = d;
      d = e;
      e += 2 * ((b[c + 1] << 3) / 8);
      for (h = b[c]; d < e; d++, h++) b[h] = b[d], o[h] = o[d];
      d = b[c] + (b[c + 1] << 1);
      for (e = 0; 256 > e; e++) b[d + e] = 0, o[d + e] = 0;
    }
    e = b[c] + (b[c + 1] << 1);
    d = kb(16384);
    b[e + 1] = d;
    h = b[ii + g];
    b[e] = h;
    j = 16384 / h | 0;
    13 == (16384 >= h * j ? 14 : 13) && O(fi, 140, ti, ui);
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

Lh.X = 1;

function vi(c, f, d) {
  var e = a;
  a += 12;
  var g, i = e + 3, h = e + 6, j = e + 9;
  pi(e, f + 3, f + 6);
  g = oi(f, e);
  if (1 == (0 != g ? 1 : 2)) g = 1 / g;
  var k = g;
  pi(i, f + 3, f + 6);
  o[c] = k * oi(d, i);
  i = g;
  pi(h, d, f + 6);
  o[c + 1] = i * oi(f, h);
  pi(j, f + 3, d);
  o[c + 2] = g * oi(f, j);
  a = e;
}

vi.X = 1;

function wi(c, f) {
  var d = a;
  a += 3;
  var e, g, i, h, j, k, l;
  pi(d, c + 3, c + 6);
  e = oi(c, d);
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

wi.X = 1;

function xi(c) {
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

function yi(c) {
  b[c + 102400] = 0;
  b[c + 102401] = 0;
  b[c + 102402] = 0;
  b[c + 102499] = 0;
}

function zi(c) {
  var f;
  f = 0 == b[c + 102400] ? 2 : 1;
  1 == f && O(Ai, 32, Bi, Ci);
  f = 0 == b[c + 102499] ? 4 : 3;
  3 == f && O(Ai, 33, Bi, Di);
}

function Ei(c, f) {
  var d, e;
  d = 0 < b[c + 102499] ? 2 : 1;
  1 == d && O(Ai, 63, Fi, Gi);
  e = c + 102403 + 3 * b[c + 102499] - 3;
  d = f == b[e] ? 4 : 3;
  3 == d && O(Ai, 65, Fi, Hi);
  d = b[e + 2] & 1 ? 5 : 6;
  5 != d && 6 == d && (b[c + 102400] -= b[e + 1]);
  b[c + 102401] -= b[e + 1];
  b[c + 102499] -= 1;
}

Ei.X = 1;

function Ii(c) {
  return 2 == (b[c + 102517] & 2);
}

function U(c) {
  var f = a;
  a += 1;
  b[f] = arguments[U.length];
  Ji(c, b[f]);
  a = f;
}

function Ki(c, f) {
  var d, e;
  d = 32 > b[c + 102499] ? 2 : 1;
  1 == d && O(Ai, 38, Li, Mi);
  e = c + 102403 + 3 * b[c + 102499];
  b[e + 1] = f;
  d = 102400 < f + b[c + 102400] ? 3 : 4;
  3 == d ? (d = kb(f), b[e] = d, b[e + 2] = 1) : 4 == d && (b[e] = c + b[c + 102400], b[e + 2] = 0, b[c + 102400] += f);
  b[c + 102401] += f;
  b[c + 102402] = b[c + 102402] > b[c + 102401] ? b[c + 102402] : b[c + 102401];
  b[c + 102499] += 1;
  return b[e];
}

Ki.X = 1;

function Ni(c) {
  var f = a;
  a += 2;
  Oi(f);
  b[c] = b[f];
  b[c + 1] = Math.floor(.0010000000474974513 * b[f + 1]);
  a = f;
}

function Pi(c) {
  var f = a;
  a += 2;
  Oi(f);
  c = 1e3 * (b[f] - b[c]) + .0010000000474974513 * b[f + 1] - b[c + 1];
  a = f;
  return c;
}

function Qi(c, f, d) {
  var e;
  e = Ri(f + 1) ? 2 : 1;
  1 == e && O(Si, 27, Ti, Ui);
  e = Ri(f + 4) ? 4 : 3;
  3 == e && O(Si, 28, Ti, Vi);
  e = xi(o[f + 3]) ? 6 : 5;
  5 == e && O(Si, 29, Ti, Wi);
  e = xi(o[f + 6]) ? 8 : 7;
  7 == e && O(Si, 30, Ti, Xi);
  e = xi(o[f + 8]) ? 9 : 10;
  9 == e && (e = 0 <= o[f + 8] ? 11 : 10);
  10 == e && O(Si, 31, Ti, Yi);
  e = xi(o[f + 7]) ? 12 : 13;
  12 == e && (e = 0 <= o[f + 7] ? 14 : 13);
  13 == e && O(Si, 32, Ti, Zi);
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
  ch(c + 5, o[f + 3]);
  cc(c + 7);
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
  cc(c + 19);
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

Qi.X = 1;

function Ri(c) {
  var f;
  if (xi(o[c])) f = 1; else {
    var d = 0;
    f = 2;
  }
  1 == f && (d = xi(o[c + 1]));
  return d;
}

function $i(c) {
  var f = a;
  a += 16;
  var d, e, g = f + 2, i = f + 6, h = f + 8, j = f + 10, k = f + 12, l = f + 14;
  o[c + 29] = 0;
  o[c + 30] = 0;
  o[c + 31] = 0;
  o[c + 32] = 0;
  cc(c + 7);
  d = 0 == b[c] ? 2 : 1;
  do if (1 == d) if (1 == b[c]) d = 2; else {
    d = 2 == b[c] ? 5 : 4;
    4 == d && O(Si, 284, aj, bj);
    d = f;
    b[d] = b[ue];
    o[d] = o[ue];
    b[d + 1] = b[ue + 1];
    o[d + 1] = o[ue + 1];
    e = b[c + 25];
    d = 0 != b[c + 25] ? 6 : 10;
    a : do if (6 == d) for (var m = g, n = c + 29, p = g, u = g + 1, r = g + 3, q = c + 31; ; ) {
      d = 0 == o[e] ? 9 : 8;
      if (8 == d) {
        var v = b[e + 3];
        mb[b[b[v] + 7]](v, g, o[e]);
        o[n] += o[m];
        K(i, o[p], u);
        Nb(f, i);
        o[q] += o[r];
      }
      e = v = b[e + 1];
      if (0 == v) break a;
    } while (0);
    e = c + 29;
    d = 0 < o[c + 29] ? 11 : 12;
    11 == d ? (o[c + 30] = 1 / o[e], Vh(f, o[c + 30])) : 12 == d && (o[e] = 1, o[c + 30] = 1);
    d = 0 < o[c + 31] ? 14 : 18;
    14 == d && (0 != (b[c + 1] & 16) ? d = 18 : (o[c + 31] -= o[c + 29] * J(f, f), d = 0 < o[c + 31] ? 17 : 16, 16 == d && O(Si, 319, aj, cj), o[c + 32] = 1 / o[c + 31], d = 19));
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
    Pc(j, c + 3, c + 7);
    m = e;
    e = j;
    b[m] = b[e];
    o[m] = o[e];
    b[m + 1] = b[e + 1];
    o[m + 1] = o[e + 1];
    m = kb(2);
    dj(m, e);
    dj(d, m);
    d = c + 16;
    e = o[c + 18];
    C(l, c + 11, h);
    Ce(k, e, l);
    Nb(d, k);
    d = 20;
  } while (0);
  2 == d && (g = c + 9, i = c + 3, b[g] = b[i], o[g] = o[i], b[g + 1] = b[i + 1], o[g + 1] = o[i + 1], g = c + 11, i = c + 3, b[g] = b[i], o[g] = o[i], b[g + 1] = b[i + 1], o[g + 1] = o[i + 1], o[c + 13] = o[c + 14]);
  a = f;
}

$i.X = 1;

function ej(c) {
  var f = a;
  a += 8;
  var d;
  d = f + 4;
  var e = f + 6, g;
  ch(f + 2, o[c + 13]);
  g = c + 9;
  S(e, f + 2, c + 7);
  C(d, g, e);
  b[f] = b[d];
  o[f] = o[d];
  b[f + 1] = b[d + 1];
  o[f + 1] = o[d + 1];
  e = b[c + 22] + 102518;
  g = b[c + 25];
  d = 0 != b[c + 25] ? 1 : 3;
  a : do if (1 == d) for (var i = c + 3; ; ) {
    fj(g, e, f, i);
    var h = b[g + 1];
    g = h;
    if (0 == h) break a;
  } while (0);
  a = f;
}

function qc(c, f) {
  var d, e = c + 1, g = b[e];
  d = f & 1 ? 1 : 3;
  1 == d ? 0 == (g & 2) && (b[c + 1] = (b[c + 1] | 2) & 65535, o[c + 36] = 0) : 3 == d && (b[e] = g & 65533, o[c + 36] = 0, cc(c + 16), o[c + 18] = 0, cc(c + 19), o[c + 21] = 0);
}

function gj(c, f) {
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

gj.X = 1;

function hj(c, f) {
  var d, e, g, i;
  d = 0 == Ii(b[c + 22]) ? 2 : 1;
  1 == d && O(Si, 153, ij, jj);
  d = 1 == Ii(b[c + 22]) ? 3 : 4;
  3 == d ? e = 0 : 4 == d && (e = b[c + 22], g = Lh(e, 44), 0 == g ? (i = 0, d = 6) : d = 5, 5 == d && (kj(g), i = g), lj(i, e, c, f), d = 0 != (b[c + 1] & 32) ? 7 : 8, 7 == d && (d = b[c + 22] + 102518, mj(i, d, c + 3)), b[i + 1] = b[c + 25], b[c + 25] = i, b[c + 26] += 1, b[i + 2] = c, d = 0 < o[i] ? 9 : 10, 9 == d && $i(c), d = b[c + 22] + 102517, b[d] |= 1, e = i);
  return e;
}

hj.X = 1;

function uc(c, f, d) {
  var e = a;
  a += 9;
  nj(e + 6);
  b[e] = 0;
  b[e + 1] = 0;
  o[e + 2] = .20000000298023224;
  o[e + 3] = 0;
  o[e + 4] = 0;
  b[e + 5] = 0;
  b[e] = f;
  o[e + 4] = d;
  hj(c, e);
  a = e;
}

function nj(c) {
  b[c] = 1;
  b[c + 1] = -1;
  b[c + 2] = 0;
}

function oj(c) {
  Lc(c);
  b[c + 15] = 0;
  b[c + 16] = 0;
  b[c + 17] = pj;
  b[c + 18] = qj;
  b[c + 19] = 0;
}

function rj(c) {
  return b[c + 2];
}

function sj(c) {
  return 2 == (b[c + 1] & 2);
}

function tj(c, f) {
  var d, e, g;
  e = b[f + 12];
  g = b[f + 13];
  e = rj(e);
  g = rj(g);
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
  uj(f, b[c + 19]);
  b[c + 16] -= 1;
}

tj.X = 1;

function vj(c) {
  var f, d, e, g, i, h, j, k, l, m;
  d = b[c + 15];
  f = 0 != b[c + 15] ? 1 : 21;
  a : do if (1 == f) for (var n = c + 17, p = c + 17, u = c, r = c + 18; ; ) {
    e = b[d + 12];
    g = b[d + 13];
    i = b[d + 14];
    h = b[d + 15];
    j = rj(e);
    k = rj(g);
    f = 0 != (b[d + 1] & 8) ? 4 : 10;
    b : do if (4 == f) if (f = 0 == gj(k, j) ? 5 : 6, 5 == f) {
      f = d;
      d = b[f + 3];
      tj(c, f);
      f = 2;
      break b;
    } else if (6 == f) {
      f = 0 != b[n] ? 7 : 9;
      do if (7 == f) if (f = b[p], 0 != mb[b[b[f] + 2]](f, e, g)) f = 9; else {
        f = d;
        d = b[f + 3];
        tj(c, f);
        f = 2;
        break b;
      } while (0);
      b[d + 1] &= -9;
      f = 10;
      break b;
    } while (0);
    b : do if (10 == f) {
      if (sj(j)) f = 11; else {
        var q = 0;
        f = 12;
      }
      11 == f && (q = 0 != b[j]);
      l = q;
      if (sj(k)) f = 13; else {
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
      m = wj(l, f);
      f = wj(l, w);
      f = xj(m, f);
      l = d;
      f = 0 == (f & 1) ? 19 : 20;
      if (19 == f) {
        e = l;
        d = b[e + 3];
        tj(c, e);
        f = 2;
        break b;
      } else if (20 == f) {
        yj(l, b[r]);
        d = x = b[d + 3];
        f = 17;
        break b;
      }
    } while (0);
    2 == f && (x = d);
    if (0 == x) break a;
  } while (0);
}

vj.X = 1;

function zj(c, f) {
  var d = a;
  a += 1;
  var e, g, i, h, j, k;
  g = b[c + 13] = 0;
  h = c + 10;
  e = g < b[h] ? 1 : 5;
  a : do if (1 == e) for (var l = c + 8, m = c + 14, n = c, p = c + 14, u = c; ; ) if (e = b[b[l] + g], b[m] = e, e = -1 == e ? 4 : 3, 3 == e && (i = wj(n, b[p]), Aj(u, c, i)), g += 1, g >= b[h]) break a; while (0);
  b[c + 10] = 0;
  g = b[c + 11] + 3 * b[c + 13];
  e = b[c + 11];
  b[d] = 2;
  Bj(e, g, d);
  g = 0;
  l = c + 13;
  e = g < b[l] ? 6 : 13;
  a : do if (6 == e) {
    m = c + 11;
    p = n = c;
    u = c + 11;
    for (i = c + 13; ; ) {
      h = b[m] + 3 * g;
      j = Cj(n, b[h]);
      k = Cj(p, b[h + 1]);
      Dj(f, j, k);
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

zj.X = 1;

function wj(c, f) {
  var d;
  d = 0 <= f ? 1 : 2;
  1 == d && (d = f < b[c + 3] ? 3 : 2);
  2 == d && O(Ej, 159, Fj, Og);
  return b[c + 1] + 9 * f;
}

function Cj(c, f) {
  var d;
  d = 0 <= f ? 1 : 2;
  1 == d && (d = f < b[c + 3] ? 3 : 2);
  2 == d && O(Ej, 153, Gj, Og);
  return b[b[c + 1] + 9 * f + 4];
}

function Dj(c, f, d) {
  var e, g, i, h, j, k, l, m, n, p;
  g = b[f + 4];
  i = b[d + 4];
  f = b[f + 5];
  d = b[d + 5];
  h = rj(g);
  j = rj(i);
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
    if (0 == gj(j, h)) e = 24; else {
      e = 0 != b[c + 17] ? 15 : 16;
      if (15 == e && (k = b[c + 17], 0 == mb[b[b[k] + 2]](k, g, i))) break a;
      k = e = Hj(g, f, i, d, b[c + 19]);
      0 == e ? e = 24 : (g = b[k + 12], i = b[k + 13], f = b[k + 14], d = b[k + 15], h = rj(g), j = rj(i), b[k + 2] = 0, b[k + 3] = b[c + 15], e = 0 != b[c + 15] ? 18 : 19, 18 == e && (b[b[c + 15] + 2] = k), b[c + 15] = k, b[k + 5] = k, b[k + 4] = j, b[k + 6] = 0, b[k + 7] = b[h + 28], e = 0 != b[h + 28] ? 20 : 21, 20 == e && (b[b[h + 28] + 2] = k + 4), b[h + 28] = k + 4, b[k + 9] = k, b[k + 8] = h, b[k + 10] = 0, b[k + 11] = b[j + 28], e = 0 != b[j + 28] ? 22 : 23, 22 == e && (b[b[j + 28] + 2] = k + 8), b[j + 28] = k + 8, qc(h, 1), qc(j, 1), b[c + 16] += 1);
    }
  } while (0);
}

Dj.X = 1;

function Aj(c, f, d) {
  var e = a;
  a += 259;
  var g, i, h;
  b[e] = e + 1;
  b[e + 257] = 0;
  b[e + 258] = 256;
  Ij(e, c);
  c += 1;
  a : for (; 0 < b[e + 257]; ) {
    g = e;
    1 == (0 < b[g + 257] ? 2 : 1) && O(Jj, 67, Kj, Lj);
    b[g + 257] -= 1;
    i = b[b[g] + b[g + 257]];
    if (-1 != i && (h = b[c] + 9 * i, xj(h, d))) if (g = -1 == b[h + 6] ? 7 : 9, 7 == g) {
      if (g = Oc(f, i), 0 == (g & 1)) break a;
    } else 9 == g && (Ij(e, h + 6), Ij(e, h + 7));
  }
  if (1 == (b[e] != e + 1 ? 1 : 2)) b[e] = 0;
  a = e;
}

Aj.X = 1;

function Bj(c, f, d) {
  var e = a;
  a += 18;
  var g, i, h, j, k, l, m = e + 3, n = e + 6, p = e + 9, u = e + 12, r = e + 15, q, v;
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
    10 == g ? (l = l / 2 | 0, v = Mj(c, c + 3 * l, i, i + 3 * l, h, d)) : 11 == g && (v = Nj(c, i, h, d));
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
    b : do if (41 == g) if (i = Oj(c, q, d), h = Oj(q + 3, f, d), i &= 1, g = h ? 42 : 44, 42 == g) {
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
    47 == g ? (Bj(c, q, d), c = q + 3) : 48 == g && (Bj(q + 3, f, d), f = q);
  }
  2 == g ? (d = b[d], f = m = f - 3, mb[d](m, c) && (b[r] = b[c], o[r] = o[c], b[r + 1] = b[c + 1], o[r + 1] = o[c + 1], b[r + 2] = b[c + 2], o[r + 2] = o[c + 2], b[c] = b[f], o[c] = o[f], b[c + 1] = b[f + 1], o[c + 1] = o[f + 1], b[c + 2] = b[f + 2], o[c + 2] = o[f + 2], b[f] = b[r], o[f] = o[r], b[f + 1] = b[r + 1], o[f + 1] = o[r + 1], b[f + 2] = b[r + 2], o[f + 2] = o[r + 2])) : 4 == g ? Nj(c, c + 3, f - 3, d) : 5 == g ? Pj(c, c + 3, c + 6, f - 3, d) : 6 == g ? Mj(c, c + 3, c + 6, c + 9, f - 3, d) : 8 == g && Qj(x, f, d);
  a = e;
}

Bj.X = 1;

function Nj(c, f, d, e) {
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

Nj.X = 1;

function Pj(c, f, d, e, g) {
  var i = a;
  a += 9;
  var h = i + 3, j = i + 6, k;
  k = Nj(c, f, d, g);
  if (1 == (mb[b[g]](e, d) ? 1 : 4)) b[j] = b[d], o[j] = o[d], b[j + 1] = b[d + 1], o[j + 1] = o[d + 1], b[j + 2] = b[d + 2], o[j + 2] = o[d + 2], b[d] = b[e], o[d] = o[e], b[d + 1] = b[e + 1], o[d + 1] = o[e + 1], b[d + 2] = b[e + 2], o[d + 2] = o[e + 2], b[e] = b[j], o[e] = o[j], b[e + 1] = b[j + 1], o[e + 1] = o[j + 1], b[e + 2] = b[j + 2], o[e + 2] = o[j + 2], k += 1, mb[b[g]](d, f) && (b[i] = b[f], o[i] = o[f], b[i + 1] = b[f + 1], o[i + 1] = o[f + 1], b[i + 2] = b[f + 2], o[i + 2] = o[f + 2], b[f] = b[d], o[f] = o[d], b[f + 1] = b[d + 1], o[f + 1] = o[d + 1], b[f + 2] = b[d + 2], o[f + 2] = o[d + 2], b[d] = b[i], o[d] = o[i], b[d + 1] = b[i + 1], o[d + 1] = o[i + 1], b[d + 2] = b[i + 2], o[d + 2] = o[i + 2], k += 1, mb[b[g]](f, c) && (b[h] = b[c], o[h] = o[c], b[h + 1] = b[c + 1], o[h + 1] = o[c + 1], b[h + 2] = b[c + 2], o[h + 2] = o[c + 2], b[c] = b[f], o[c] = o[f], b[c + 1] = b[f + 1], o[c + 1] = o[f + 1], b[c + 2] = b[f + 2], o[c + 2] = o[f + 2], b[f] = b[h], o[f] = o[h], b[f + 1] = b[h + 1], o[f + 1] = o[h + 1], b[f + 2] = b[h + 2], o[f + 2] = o[h + 2], k += 1));
  a = i;
  return k;
}

Pj.X = 1;

function Mj(c, f, d, e, g, i) {
  var h = a;
  a += 12;
  var j = h + 3, k = h + 6, l = h + 9, m;
  m = Pj(c, f, d, e, i);
  if (1 == (mb[b[i]](g, e) ? 1 : 5)) b[l] = b[e], o[l] = o[e], b[l + 1] = b[e + 1], o[l + 1] = o[e + 1], b[l + 2] = b[e + 2], o[l + 2] = o[e + 2], b[e] = b[g], o[e] = o[g], b[e + 1] = b[g + 1], o[e + 1] = o[g + 1], b[e + 2] = b[g + 2], o[e + 2] = o[g + 2], b[g] = b[l], o[g] = o[l], b[g + 1] = b[l + 1], o[g + 1] = o[l + 1], b[g + 2] = b[l + 2], o[g + 2] = o[l + 2], m += 1, mb[b[i]](e, d) && (b[j] = b[d], o[j] = o[d], b[j + 1] = b[d + 1], o[j + 1] = o[d + 1], b[j + 2] = b[d + 2], o[j + 2] = o[d + 2], b[d] = b[e], o[d] = o[e], b[d + 1] = b[e + 1], o[d + 1] = o[e + 1], b[d + 2] = b[e + 2], o[d + 2] = o[e + 2], b[e] = b[j], o[e] = o[j], b[e + 1] = b[j + 1], o[e + 1] = o[j + 1], b[e + 2] = b[j + 2], o[e + 2] = o[j + 2], m += 1, mb[b[i]](d, f) && (b[h] = b[f], o[h] = o[f], b[h + 1] = b[f + 1], o[h + 1] = o[f + 1], b[h + 2] = b[f + 2], o[h + 2] = o[f + 2], b[f] = b[d], o[f] = o[d], b[f + 1] = b[d + 1], o[f + 1] = o[d + 1], b[f + 2] = b[d + 2], o[f + 2] = o[d + 2], b[d] = b[h], o[d] = o[h], b[d + 1] = b[h + 1], o[d + 1] = o[h + 1], b[d + 2] = b[h + 2], o[d + 2] = o[h + 2], m += 1, mb[b[i]](f, c) && (b[k] = b[c], o[k] = o[c], b[k + 1] = b[c + 1], o[k + 1] = o[c + 1], b[k + 2] = b[c + 2], o[k + 2] = o[c + 2], b[c] = b[f], o[c] = o[f], b[c + 1] = b[f + 1], o[c + 1] = o[f + 1], b[c + 2] = b[f + 2], o[c + 2] = o[f + 2], b[f] = b[k], o[f] = o[k], b[f + 1] = b[k + 1], o[f + 1] = o[k + 1], b[f + 2] = b[k + 2], o[f + 2] = o[k + 2], m += 1)));
  a = h;
  return m;
}

Mj.X = 1;

function Qj(c, f, d) {
  var e = a;
  a += 3;
  var g, i, h, j, k;
  j = c + 6;
  Nj(c, c + 3, j, d);
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

Qj.X = 1;

function xj(c, f) {
  var d = a;
  a += 8;
  var e, g, i = d + 2;
  e = d + 4;
  var h = d + 6;
  C(e, f, c + 2);
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  C(h, c, f + 2);
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

xj.X = 1;

function kj(c) {
  nj(c + 8);
  b[c + 12] = 0;
  b[c + 2] = 0;
  b[c + 1] = 0;
  b[c + 6] = 0;
  b[c + 7] = 0;
  b[c + 3] = 0;
  o[c] = 0;
}

function Oj(c, f, d) {
  var e = a;
  a += 6;
  var g, i, h, j, k, l, m, n = e + 3;
  g = (f - c) / 12 | 0;
  g = 0 == g ? 1 : 1 == g ? 1 : 2 == g ? 2 : 3 == g ? 5 : 4 == g ? 6 : 5 == g ? 7 : 8;
  if (8 == g) {
    k = c + 6;
    Nj(c, c + 3, k, d);
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
  } else 1 == g ? j = 1 : 2 == g ? (d = b[d], f = j = f - 3, g = mb[d](j, c) ? 3 : 4, 3 == g && (b[e] = b[c], o[e] = o[c], b[e + 1] = b[c + 1], o[e + 1] = o[c + 1], b[e + 2] = b[c + 2], o[e + 2] = o[c + 2], b[c] = b[f], o[c] = o[f], b[c + 1] = b[f + 1], o[c + 1] = o[f + 1], b[c + 2] = b[f + 2], o[c + 2] = o[f + 2], b[f] = b[e], o[f] = o[e], b[f + 1] = b[e + 1], o[f + 1] = o[e + 1], b[f + 2] = b[e + 2], o[f + 2] = o[e + 2]), j = 1) : 5 == g ? (Nj(c, c + 3, f - 3, d), j = 1) : 6 == g ? (Pj(c, c + 3, c + 6, f - 3, d), j = 1) : 7 == g && (Mj(c, c + 3, c + 6, c + 9, f - 3, d), j = 1);
  a = e;
  return j;
}

Oj.X = 1;

function Ij(c, f) {
  var d;
  if (1 == (b[c + 257] == b[c + 258] ? 1 : 3)) {
    d = b[c];
    b[c + 258] <<= 1;
    var e = kb(b[c + 258] << 2);
    b[c] = e;
    e = d;
    d += 1 * ((b[c + 257] << 2) / 4);
    for (var g = b[c]; e < d; e++, g++) b[g] = b[e], o[g] = o[e];
  }
  b[b[c] + b[c + 257]] = b[f];
  b[c + 257] += 1;
}

Ij.X = 1;

function lj(c, f, d, e) {
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
  f = Lh(f, 28 * d);
  b[c + 6] = f;
  g = 0;
  f = g < d ? 1 : 3;
  a : do if (1 == f) for (var i = c + 6, h = c + 6; ; ) if (b[b[i] + 7 * g + 4] = 0, b[b[h] + 7 * g + 6] = -1, g += 1, g >= d) break a; while (0);
  b[c + 7] = 0;
  o[c] = o[e + 4];
}

lj.X = 1;

function Rj(c, f) {
  var d;
  d = 0 == b[c + 7] ? 2 : 1;
  1 == d && O(Sj, 72, Tj, Uj);
  d = b[c + 3];
  d = mb[b[b[d] + 3]](d);
  ki(f, b[c + 6], 28 * d);
  b[c + 6] = 0;
  d = b[b[c + 3] + 1];
  d = 0 == d ? 3 : 1 == d ? 4 : 2 == d ? 5 : 3 == d ? 6 : 7;
  7 == d ? O(Sj, 115, Tj, pe) : 3 == d ? (d = b[c + 3], mb[b[b[d]]](d), ki(f, d, 20)) : 4 == d ? (d = b[c + 3], mb[b[b[d]]](d), ki(f, d, 48)) : 5 == d ? (d = b[c + 3], mb[b[b[d]]](d), ki(f, d, 152)) : 6 == d && (d = b[c + 3], mb[b[b[d]]](d), ki(f, d, 40));
  b[c + 3] = 0;
}

Rj.X = 1;

function mj(c, f, d) {
  var e, g, i;
  e = 0 == b[c + 7] ? 2 : 1;
  1 == e && O(Sj, 124, Vj, Uj);
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
    var l = f, m = ba, m = Cg(l, i, i);
    b[l + 7] += 1;
    Nc(l, m);
    b[i + 6] = m;
    b[i + 4] = c;
    b[i + 5] = g;
    g += 1;
    if (g >= b[h]) break a;
  } while (0);
}

mj.X = 1;

function fj(c, f, d, e) {
  var g = a;
  a += 10;
  var i, h, j, k = g + 4, l = g + 8;
  i = 0 == b[c + 7] ? 4 : 1;
  a : do if (1 == i) {
    h = 0;
    var m = c + 7;
    if (h < b[m]) for (var n = c + 6, p = c + 3, u = c + 3; ; ) {
      j = b[n] + 7 * h;
      var r = b[p];
      mb[b[b[r] + 6]](r, g, d, b[j + 5]);
      r = b[u];
      mb[b[b[r] + 6]](r, k, e, b[j + 5]);
      Gg(j, g, k);
      C(l, e, d);
      var r = f, q = b[j + 6];
      1 == (Mg(r, q, j, l) & 1 ? 1 : 2) && Nc(r, q);
      h += 1;
      if (h >= b[m]) break a;
    } else i = 4;
  } while (0);
  a = g;
}

fj.X = 1;

function Wj(c) {
  Ei(b[c], b[c + 5]);
  Ei(b[c], b[c + 6]);
  Ei(b[c], b[c + 4]);
  Ei(b[c], b[c + 3]);
  Ei(b[c], b[c + 2]);
}

function Xj(c, f, d, e, g, i) {
  b[c + 10] = f;
  b[c + 11] = d;
  b[c + 12] = e;
  b[c + 7] = 0;
  b[c + 9] = 0;
  b[c + 8] = 0;
  b[c] = g;
  b[c + 1] = i;
  f = Ki(b[c], f << 2);
  b[c + 2] = f;
  d = Ki(b[c], d << 2);
  b[c + 3] = d;
  e = Ki(b[c], e << 2);
  b[c + 4] = e;
  e = Ki(b[c], 12 * b[c + 10]);
  b[c + 6] = e;
  e = Ki(b[c], 12 * b[c + 10]);
  b[c + 5] = e;
}

Xj.X = 1;

function Yj(c) {
  var f = a;
  a += 4;
  var d = f + 2;
  ch(c + 5, o[c + 14]);
  var e = c + 3, g = c + 11;
  S(d, c + 5, c + 7);
  C(f, g, d);
  b[e] = b[f];
  o[e] = o[f];
  b[e + 1] = b[f + 1];
  o[e + 1] = o[f + 1];
  a = f;
}

function Zj(c, f, d, e, g) {
  var i = a;
  a += 54;
  var h, j, k, l, m = i + 2, n, p = i + 4, u, r = i + 6, q = i + 8, v = i + 10, x = i + 12, w = i + 14, y = i + 22, z = i + 33, B, E, D, H, I = i + 46, M, G = i + 48, R, P = i + 50, L, T, F, X = i + 52, Z, V, aa, ja, Y, W, $, ga, la, fa, ka, oa, ua;
  Ni(i);
  j = o[d];
  k = 0;
  var Da = c + 7;
  h = k < b[Da] ? 1 : 5;
  a : do if (1 == h) for (var Ja = c + 2, Aa = m, Ta = p, pb = c + 5, Fa = m, Va = c + 5, Na = c + 6, pa = p, ha = c + 6; ; ) {
    l = b[b[Ja] + k];
    var Ba = l + 11;
    b[Aa] = b[Ba];
    o[Aa] = o[Ba];
    b[Aa + 1] = b[Ba + 1];
    o[Aa + 1] = o[Ba + 1];
    n = o[l + 14];
    var za = l + 16;
    b[Ta] = b[za];
    o[Ta] = o[za];
    b[Ta + 1] = b[za + 1];
    o[Ta + 1] = o[za + 1];
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
      K(v, o[l + 35], e);
      K(x, o[l + 30], l + 19);
      N(q, v, x);
      K(r, ma, q);
      Nb(p, r);
      u += j * o[l + 32] * o[l + 21];
      Vh(p, $j(1 - j * o[l + 33], 0, 1));
      u *= $j(1 - j * o[l + 34], 0, 1);
    }
    var La = b[pb] + 3 * k;
    b[La] = b[Fa];
    o[La] = o[Fa];
    b[La + 1] = b[Fa + 1];
    o[La + 1] = o[Fa + 1];
    o[b[Va] + 3 * k + 2] = n;
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
  Ni(i);
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
  ak(z, y);
  bk(z);
  h = b[d + 5] & 1 ? 7 : 16;
  7 == h && ck(z);
  B = 0;
  for (var Gb = c + 8, Ob = c + 4; ; ) {
    if (B >= b[Gb]) {
      h = 20;
      break;
    }
    var Pa = b[b[Ob] + B];
    mb[b[b[Pa] + 7]](Pa, w);
    B += 1;
  }
  var ec = Pi(i);
  o[f + 3] = ec;
  Ni(i);
  E = 0;
  for (var Pb = c + 8, Wa = c + 4; ; ) {
    if (E >= b[d + 3]) {
      h = 30;
      break;
    }
    for (D = 0; ; ) {
      if (D >= b[Pb]) {
        h = 28;
        break;
      }
      var fc = b[b[Wa] + D];
      mb[b[b[fc] + 8]](fc, w);
      D += 1;
    }
    dk(z);
    E += 1;
  }
  ek(z);
  var wb = Pi(i);
  o[f + 4] = wb;
  H = 0;
  var Xa = c + 7;
  h = H < b[Xa] ? 33 : 39;
  a : do if (33 == h) for (var Qb = c + 5, Hb = I, Ab = c + 5, Bb = c + 6, db = G, Xb = c + 6, Yb = c + 5, eb = I, xb = c + 5, fb = c + 6, Ia = G, Zb = c + 6; ; ) {
    var gb = b[Qb] + 3 * H;
    b[Hb] = b[gb];
    o[Hb] = o[gb];
    b[Hb + 1] = b[gb + 1];
    o[Hb + 1] = o[gb + 1];
    M = o[b[Ab] + 3 * H + 2];
    var Cb = b[Bb] + 3 * H;
    b[db] = b[Cb];
    o[db] = o[Cb];
    b[db + 1] = b[Cb + 1];
    o[db + 1] = o[Cb + 1];
    R = o[b[Xb] + 3 * H + 2];
    K(P, j, G);
    h = 4 < J(P, P) ? 35 : 36;
    35 == h && (L = 2 / Yc(P), Vh(G, L));
    T = j * R;
    h = 2.4674012660980225 < T * T ? 37 : 38;
    37 == h && (F = 1.5707963705062866 / ke(T), R *= F);
    K(X, j, G);
    Nb(I, X);
    M += j * R;
    var hb = b[Yb] + 3 * H;
    b[hb] = b[eb];
    o[hb] = o[eb];
    b[hb + 1] = b[eb + 1];
    o[hb + 1] = o[eb + 1];
    o[b[xb] + 3 * H + 2] = M;
    var Db = b[fb] + 3 * H;
    b[Db] = b[Ia];
    o[Db] = o[Ia];
    b[Db + 1] = b[Ia + 1];
    o[Db + 1] = o[Ia + 1];
    o[b[Zb] + 3 * H + 2] = R;
    H += 1;
    if (H >= b[Xa]) {
      h = 39;
      break a;
    }
  } while (0);
  Ni(i);
  V = Z = 0;
  var gc = c + 8, hc = c + 4;
  a : for (;;) {
    if (V >= b[d + 4]) {
      h = 53;
      break;
    }
    aa = fk(z);
    ja = 1;
    for (Y = 0; ; ) {
      if (Y >= b[gc]) {
        h = 49;
        break;
      }
      var qb = b[b[hc] + Y];
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
  var Sb = c + 7;
  h = $ < b[Sb] ? 54 : 56;
  a : do if (54 == h) for (var rb = c + 2, $b = c + 5, Eb = c + 5, ic = c + 6, sb = c + 6; ; ) {
    ga = b[b[rb] + $];
    var Ib = ga + 11, tb = b[$b] + 3 * $;
    b[Ib] = b[tb];
    o[Ib] = o[tb];
    b[Ib + 1] = b[tb + 1];
    o[Ib + 1] = o[tb + 1];
    o[ga + 14] = o[b[Eb] + 3 * $ + 2];
    var ib = ga + 16, ac = b[ic] + 3 * $;
    b[ib] = b[ac];
    o[ib] = o[ac];
    b[ib + 1] = b[ac + 1];
    o[ib + 1] = o[ac + 1];
    o[ga + 18] = o[b[sb] + 3 * $ + 2];
    Yj(ga);
    $ += 1;
    if ($ >= b[Sb]) {
      h = 56;
      break a;
    }
  } while (0);
  var jc = Pi(i);
  o[f + 5] = jc;
  gk(c, b[z + 10]);
  h = g & 1 ? 59 : 74;
  a : do if (59 == h) {
    la = 3.4028234663852886e+38;
    fa = 0;
    var Tb = c + 7;
    h = fa < b[Tb] ? 60 : 68;
    b : do if (60 == h) for (var Ac = c + 2; ; ) {
      ka = b[b[Ac] + fa];
      h = 0 == b[ka] ? 67 : 62;
      c : do if (62 == h) {
        h = 0 == (b[ka + 1] & 4) ? 65 : 63;
        do if (63 == h) if (.001218469929881394 < o[ka + 18] * o[ka + 18]) h = 65; else if (9999999747378752e-20 < J(ka + 16, ka + 16)) h = 65; else {
          o[ka + 36] += j;
          la = la < o[ka + 36] ? la : o[ka + 36];
          h = 67;
          break c;
        } while (0);
        la = o[ka + 36] = 0;
      } while (0);
      fa += 1;
      if (fa >= b[Tb]) {
        h = 68;
        break b;
      }
    } while (0);
    if (.5 <= la) if (Z & 1) {
      oa = 0;
      for (var kc = c + 7, jb = c + 2; ; ) {
        if (oa >= b[kc]) {
          h = 74;
          break a;
        }
        ua = b[b[jb] + oa];
        qc(ua, 0);
        oa += 1;
      }
    } else h = 74; else h = 74;
  } while (0);
  hk(z);
  a = i;
}

Zj.X = 1;

function $j(c, f, d) {
  return f > (c < d ? c : d) ? f : c < d ? c : d;
}

function gk(c, f) {
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

gk.X = 1;

function pc(c, f) {
  di(c);
  yi(c + 17);
  oj(c + 102518);
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

pc.X = 1;

function Kc(c) {
  var f, d, e;
  f = b[c + 102538];
  for (d = b[c + 102538]; 0 != d; ) {
    d = b[f + 24];
    e = b[f + 25];
    for (f = b[f + 25]; 0 != f; ) {
      f = b[e + 1];
      b[e + 7] = 0;
      Rj(e, c);
      e = f;
    }
    f = d;
  }
  zi(c + 17);
}

Kc.X = 1;

function ik(c, f, d, e) {
  var g = a;
  a += 32;
  var i, h, j, k = g + 11, l = g + 24, m, n = g + 26, p, u = g + 28, r, q = g + 30;
  i = d < b[c + 7] ? 2 : 1;
  1 == i && O(jk, 386, kk, lk);
  i = e < b[c + 7] ? 4 : 3;
  3 == i && O(jk, 387, kk, mk);
  h = 0;
  var v = c + 7;
  i = h < b[v] ? 5 : 7;
  a : do if (5 == i) for (var x = c + 2, w = c + 5, y = c + 5, z = c + 6, B = c + 6; ; ) {
    j = b[b[x] + h];
    var E = b[w] + 3 * h, D = j + 11;
    b[E] = b[D];
    o[E] = o[D];
    b[E + 1] = b[D + 1];
    o[E + 1] = o[D + 1];
    o[b[y] + 3 * h + 2] = o[j + 14];
    E = b[z] + 3 * h;
    D = j + 16;
    b[E] = b[D];
    o[E] = o[D];
    b[E + 1] = b[D + 1];
    o[E + 1] = o[D + 1];
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
  ak(k, g);
  for (i = 0; i < b[f + 4]; ) {
    h = nk(k, d, e);
    if (h & 1) break;
    i += 1;
  }
  i = b[b[c + 2] + d] + 9;
  h = b[c + 5] + 3 * d;
  b[i] = b[h];
  o[i] = o[h];
  b[i + 1] = b[h + 1];
  o[i + 1] = o[h + 1];
  o[b[b[c + 2] + d] + 13] = o[b[c + 5] + 3 * d + 2];
  i = b[b[c + 2] + e] + 9;
  d = b[c + 5] + 3 * e;
  b[i] = b[d];
  o[i] = o[d];
  b[i + 1] = b[d + 1];
  o[i + 1] = o[d + 1];
  o[b[b[c + 2] + e] + 13] = o[b[c + 5] + 3 * e + 2];
  bk(k);
  for (i = 0; i < b[f + 3]; ) {
    dk(k);
    i += 1;
  }
  f = o[f];
  e = 0;
  d = c + 7;
  i = e < b[d] ? 22 : 28;
  a : do if (22 == i) {
    h = c + 5;
    j = l;
    for (var v = c + 5, x = c + 6, w = n, y = c + 6, z = c + 5, B = l, E = c + 5, D = c + 6, H = n, I = c + 6, M = c + 2, G = l, R = n; ; ) {
      i = b[h] + 3 * e;
      b[j] = b[i];
      o[j] = o[i];
      b[j + 1] = b[i + 1];
      o[j + 1] = o[i + 1];
      m = o[b[v] + 3 * e + 2];
      i = b[x] + 3 * e;
      b[w] = b[i];
      o[w] = o[i];
      b[w + 1] = b[i + 1];
      o[w + 1] = o[i + 1];
      p = o[b[y] + 3 * e + 2];
      K(u, f, n);
      i = 4 < J(u, u) ? 24 : 25;
      24 == i && (i = 2 / Yc(u), Vh(n, i));
      r = f * p;
      i = 2.4674012660980225 < r * r ? 26 : 27;
      26 == i && (r = 1.5707963705062866 / ke(r), p *= r);
      K(q, f, n);
      Nb(l, q);
      m += f * p;
      r = b[z] + 3 * e;
      b[r] = b[B];
      o[r] = o[B];
      b[r + 1] = b[B + 1];
      o[r + 1] = o[B + 1];
      o[b[E] + 3 * e + 2] = m;
      r = b[D] + 3 * e;
      b[r] = b[H];
      o[r] = o[H];
      b[r + 1] = b[H + 1];
      o[r + 1] = o[H + 1];
      o[b[I] + 3 * e + 2] = p;
      r = b[b[M] + e];
      var P = r + 11;
      b[P] = b[G];
      o[P] = o[G];
      b[P + 1] = b[G + 1];
      o[P + 1] = o[G + 1];
      o[r + 14] = m;
      m = r + 16;
      b[m] = b[R];
      o[m] = o[R];
      b[m + 1] = b[R + 1];
      o[m + 1] = o[R + 1];
      o[r + 18] = p;
      Yj(r);
      e += 1;
      if (e >= b[d]) break a;
    }
  } while (0);
  gk(c, b[k + 10]);
  hk(k);
  a = g;
}

ik.X = 1;

function rc(c, f) {
  var d, e, g;
  d = 0 == Ii(c) ? 2 : 1;
  1 == d && O(ok, 109, pk, wk);
  d = Ii(c) ? 3 : 4;
  3 == d ? e = 0 : 4 == d && (e = Lh(c, 152), 0 == e ? (g = 0, d = 6) : d = 5, 5 == d && (Qi(e, f, c), g = e), b[g + 23] = 0, b[g + 24] = b[c + 102538], d = 0 != b[c + 102538] ? 7 : 8, 7 == d && (b[b[c + 102538] + 23] = g), b[c + 102538] = g, b[c + 102540] += 1, e = g);
  return e;
}

rc.X = 1;

function xk(c) {
  b[c + 7] = 0;
  b[c + 9] = 0;
  b[c + 8] = 0;
}

function Hk(c, f) {
  1 == (b[c + 7] < b[c + 10] ? 2 : 1) && O(Ik, 54, Jk, Kk);
  b[f + 2] = b[c + 7];
  b[b[c + 2] + b[c + 7]] = f;
  b[c + 7] += 1;
}

function Lk(c, f) {
  1 == (b[c + 9] < b[c + 11] ? 2 : 1) && O(Ik, 62, Mk, Nk);
  var d = b[c + 9];
  b[c + 9] = d + 1;
  b[b[c + 3] + d] = f;
}

function Ok(c, f) {
  var d = a;
  a += 23;
  var e, g, i, h, j, k, l, m, n, p = d + 13, u = d + 21;
  o[c + 102555] = 0;
  o[c + 102556] = 0;
  o[c + 102557] = 0;
  Xj(d, b[c + 102540], b[c + 102534], b[c + 102541], c + 17, b[c + 102536]);
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
  i = Ki(c + 17, g << 2);
  h = b[c + 102538];
  var r = c + 102542, q = c + 102544, v = p + 3, x = c + 102555, w = p + 4, y = c + 102556, z = p + 5, B = c + 102557, E = d + 7, D = d + 2;
  for (e = b[c + 102538]; 0 != e; ) {
    e = 0 != (b[h + 1] & 1) ? 65 : 18;
    a : do if (18 == e) if (0 == sj(h)) e = 65; else if (0 == (32 == (b[h + 1] & 32))) e = 65; else if (0 == b[h]) e = 65; else {
      xk(d);
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
        28 == e && O(ok, 445, Pk, Qk);
        Hk(d, k);
        qc(k, 1);
        if (0 == b[k]) e = 25; else {
          l = b[k + 28];
          for (m = b[k + 28]; ; ) {
            if (0 == m) {
              e = 47;
              break;
            }
            m = b[l + 1];
            e = 0 != (b[m + 1] & 1) ? 46 : 36;
            36 == e && (0 == (4 == (b[m + 1] & 4)) ? e = 46 : 0 == (2 == (b[m + 1] & 2)) ? e = 46 : (e = b[b[m + 12] + 11] & 1, n = b[b[m + 13] + 11] & 1, e & 1 ? e = 46 : n & 1 ? e = 46 : (Lk(d, m), b[m + 1] |= 1, m = b[l], 0 != (b[m + 1] & 1) ? e = 46 : (e = j < g ? 45 : 44, 44 == e && O(ok, 495, Pk, Rk), n = j, j = n + 1, b[i + n] = m, b[m + 1] = (b[m + 1] | 1) & 65535))));
            l = m = b[l + 3];
          }
          l = b[k + 27];
          for (k = b[k + 27]; ; ) {
            if (0 == k) {
              e = 25;
              continue b;
            }
            e = 1 == (b[b[l + 1] + 15] & 1) ? 57 : 50;
            50 == e && (k = b[l], 0 == (32 == (b[k + 1] & 32)) ? e = 57 : (e = d, m = b[l + 1], 1 == (b[e + 8] < b[e + 12] ? 2 : 1) && O(Ik, 68, Sk, Tk), n = b[e + 8], b[e + 8] = n + 1, b[b[e + 4] + n] = m, b[b[l + 1] + 15] = 1, 0 != (b[k + 1] & 1) ? e = 57 : (e = j < g ? 56 : 55, 55 == e && O(ok, 524, Pk, Rk), m = j, j = m + 1, b[i + m] = k, b[k + 1] = (b[k + 1] | 1) & 65535)));
            l = k = b[l + 3];
          }
        }
      }
      Zj(d, p, f, r, b[q] & 1);
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
  Ei(c + 17, i);
  Ni(u);
  p = b[c + 102538];
  for (g = b[c + 102538]; 0 != g; ) {
    e = 0 == (b[p + 1] & 1) ? 74 : 71;
    71 == e && (0 == b[p] || ej(p));
    p = g = b[p + 24];
  }
  p = c + 102518;
  zj(p, p);
  u = Pi(u);
  o[c + 102558] = u;
  Wj(d);
  a = d;
}

Ok.X = 1;

function Uk(c, f) {
  var d = a;
  a += 83;
  var e, g, i, h, j, k, l, m, n, p, u, r, q, v, x = d + 13, w = d + 46, y = d + 48, z = d + 57, B = d + 66, E = d + 68, D = d + 77;
  Xj(d, 64, 32, 0, c + 17, b[c + 102536]);
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
  var H = x + 7, I = x + 14, M = x + 23, G = x + 32, R = w + 1, P = c + 102536, L = B + 1, T = d + 7, F = d + 10, X = d + 9, Z = d + 11, V = c + 102536, aa = D + 1, ja = D + 2, Y = D + 4, W = D + 3, $ = D + 5, ga = d + 7, la = d + 2, fa = c + 102518, ka = c + 102550;
  a : for (;;) {
    i = 0;
    h = 1;
    j = b[g];
    for (e = b[g]; 0 != e; ) {
      e = 0 == (4 == (b[j + 1] & 4)) ? 57 : 14;
      b : do if (14 == e) if (8 < b[j + 32]) e = 57; else {
        k = 1;
        e = 0 != (b[j + 1] & 32) ? 16 : 17;
        if (16 == e) k = o[j + 33]; else if (17 == e) {
          l = b[j + 12];
          m = b[j + 13];
          if (b[l + 11] & 1) break b;
          if (b[m + 11] & 1) break b;
          n = rj(l);
          p = rj(m);
          u = b[n];
          r = b[p];
          e = 2 == u ? 26 : 24;
          24 == e && (2 == r || O(ok, 641, Vk, Wk));
          if (sj(n)) e = 28; else {
            var oa = 0;
            e = 29;
          }
          28 == e && (oa = 0 != u);
          q = oa;
          if (sj(p)) e = 31; else {
            var ua = 0;
            e = 32;
          }
          31 == e && (ua = 0 != r);
          v = ua;
          e = 0 == (q & 1) ? 33 : 34;
          if (33 == e && 0 == (v & 1)) break b;
          if (8 == (b[n + 1] & 8)) {
            var Da = 1;
            e = 36;
          } else e = 35;
          35 == e && (Da = 2 != u);
          u = Da;
          if (8 == (b[p + 1] & 8)) {
            var Ja = 1;
            e = 38;
          } else e = 37;
          37 == e && (Ja = 2 != r);
          r = Ja;
          e = 0 == (u & 1) ? 39 : 40;
          if (39 == e && 0 == (r & 1)) break b;
          r = o[n + 15];
          u = o[p + 15];
          e = o[n + 15] < o[p + 15] ? 41 : 42;
          41 == e ? (r = u, Xk(n + 7, r)) : 42 == e && u < o[n + 15] && (r = o[n + 15], Xk(p + 7, r));
          e = 1 > r ? 46 : 45;
          45 == e && O(ok, 676, Vk, Yk);
          e = b[j + 14];
          u = b[j + 15];
          q = x;
          le(q);
          le(q + 7);
          me(x, Zk(l), e);
          me(H, Zk(m), u);
          l = e = n + 7;
          m = e + 9;
          for (q = I; l < m; l++, q++) b[q] = b[l], o[q] = o[l];
          l = e = p + 7;
          m = e + 9;
          for (q = M; l < m; l++, q++) b[q] = b[l], o[q] = o[l];
          o[G] = 1;
          dh(w, x);
          l = o[R];
          e = 3 == b[w] ? 52 : 53;
          52 == e ? k = 1 > r + (1 - r) * l ? r + (1 - r) * l : 1 : 53 == e && (k = 1);
          o[j + 33] = k;
          b[j + 1] |= 32;
        }
        k < h ? (i = j, h = k) : e = 57;
      } while (0);
      j = e = b[j + 3];
    }
    if (0 == i) {
      e = 60;
      break;
    }
    if (.9999988079071045 < h) {
      e = 60;
      break;
    }
    j = b[i + 12];
    e = b[i + 13];
    j = rj(j);
    k = rj(e);
    l = e = j + 7;
    m = e + 9;
    for (q = y; l < m; l++, q++) b[q] = b[l], o[q] = o[l];
    l = e = k + 7;
    m = e + 9;
    for (q = z; l < m; l++, q++) b[q] = b[l], o[q] = o[l];
    $k(j, h);
    $k(k, h);
    yj(i, b[P]);
    b[i + 1] &= -33;
    b[i + 32] += 1;
    e = 0 == (4 == (b[i + 1] & 4)) ? 71 : 69;
    do if (69 == e) if (0 == (2 == (b[i + 1] & 2))) e = 71; else {
      qc(j, 1);
      qc(k, 1);
      xk(d);
      Hk(d, j);
      Hk(d, k);
      Lk(d, i);
      b[j + 1] = (b[j + 1] | 1) & 65535;
      b[k + 1] = (b[k + 1] | 1) & 65535;
      b[i + 1] |= 1;
      b[B] = j;
      b[L] = k;
      for (e = i = 0; 2 > e; ) {
        p = b[B + i];
        e = 2 == b[p] ? 81 : 105;
        b : do if (81 == e) {
          n = b[p + 28];
          for (l = b[p + 28]; ; ) {
            if (0 == l) break b;
            if (b[T] == b[F]) break b;
            if (b[X] == b[Z]) break b;
            r = b[n + 1];
            e = 0 != (b[r + 1] & 1) ? 104 : 86;
            c : do if (86 == e) {
              u = b[n];
              e = 2 == b[u] ? 87 : 89;
              do if (87 == e) if (0 != (8 == (b[p + 1] & 8))) e = 89; else if (0 == (8 == (b[u + 1] & 8))) {
                e = 104;
                break c;
              } while (0);
              e = b[b[r + 12] + 11] & 1;
              l = b[b[r + 13] + 11] & 1;
              if (e & 1) e = 104; else if (l & 1) e = 104; else {
                l = e = u + 7;
                m = e + 9;
                for (q = E; l < m; l++, q++) b[q] = b[l], o[q] = o[l];
                e = 0 == (b[u + 1] & 1) ? 92 : 93;
                92 == e && $k(u, h);
                yj(r, b[V]);
                e = 0 == (4 == (b[r + 1] & 4)) ? 95 : 96;
                if (95 == e) {
                  q = u + 7;
                  l = E;
                  for (m = E + 9; l < m; l++, q++) b[q] = b[l], o[q] = o[l];
                  Yj(u);
                } else if (96 == e) if (e = 0 == (2 == (b[r + 1] & 2)) ? 98 : 99, 98 == e) {
                  q = u + 7;
                  l = E;
                  for (m = E + 9; l < m; l++, q++) b[q] = b[l], o[q] = o[l];
                  Yj(u);
                } else if (99 == e) {
                  b[r + 1] |= 1;
                  Lk(d, r);
                  if (0 != (b[u + 1] & 1)) {
                    e = 104;
                    break c;
                  }
                  b[u + 1] = (b[u + 1] | 1) & 65535;
                  e = 0 != b[u] ? 102 : 103;
                  102 == e && qc(u, 1);
                  Hk(d, u);
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
      ik(d, D, b[j + 2], b[k + 2]);
      for (h = 0; h < b[ga]; ) {
        i = b[b[la] + h];
        b[i + 1] &= 65534;
        e = 2 != b[i] ? 113 : 110;
        b : do if (110 == e) if (ej(i), j = b[i + 28], 0 == b[i + 28]) e = 113; else for (;;) if (k = b[j + 1] + 1, b[k] &= -34, j = k = b[j + 3], 0 == k) break b; while (0);
        h += 1;
      }
      zj(fa, fa);
      if (b[ka] & 1) {
        e = 116;
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
    Yj(j);
    Yj(k);
  }
  60 == e ? b[c + 102551] = 1 : 116 == e && (b[c + 102551] = 0);
  Wj(d);
  a = d;
}

Uk.X = 1;

function Xk(c, f) {
  var d = a;
  a += 6;
  var e, g = d + 2, i = d + 4;
  1 == (1 > o[c + 8] ? 2 : 1) && O(al, 715, bl, Yk);
  e = (f - o[c + 8]) / (1 - o[c + 8]);
  var h = c + 2;
  K(g, 1 - e, c + 2);
  K(i, e, c + 4);
  N(d, g, i);
  b[h] = b[d];
  o[h] = o[d];
  b[h + 1] = b[d + 1];
  o[h + 1] = o[d + 1];
  o[c + 6] = (1 - e) * o[c + 6] + e * o[c + 7];
  o[c + 8] = f;
  a = d;
}

Xk.X = 1;

function Zk(c) {
  return b[c + 3];
}

function $k(c, f) {
  var d = a;
  a += 4;
  var e = d + 2;
  Xk(c + 7, f);
  var g = c + 11, i = c + 9;
  b[g] = b[i];
  o[g] = o[i];
  b[g + 1] = b[i + 1];
  o[g + 1] = o[i + 1];
  o[c + 14] = o[c + 13];
  ch(c + 5, o[c + 14]);
  g = c + 3;
  i = c + 11;
  S(e, c + 5, c + 7);
  C(d, i, e);
  b[g] = b[d];
  o[g] = o[d];
  b[g + 1] = b[d + 1];
  o[g + 1] = o[d + 1];
  a = d;
}

function vc(c, f, d, e) {
  var g = a;
  a += 14;
  var i, h = g + 2, j = g + 8, k = g + 10, l = g + 12;
  Ni(g);
  i = 0 != (b[c + 102517] & 1) ? 1 : 2;
  1 == i && (i = c + 102518, zj(i, i), b[c + 102517] &= -2);
  b[c + 102517] |= 2;
  o[h] = f;
  b[h + 3] = d;
  b[h + 4] = e;
  i = 0 < f ? 3 : 4;
  3 == i ? o[h + 1] = 1 / f : 4 == i && (o[h + 1] = 0);
  o[h + 2] = o[c + 102547] * f;
  b[h + 5] = b[c + 102548] & 1;
  Ni(j);
  vj(c + 102518);
  f = Pi(j);
  o[c + 102553] = f;
  i = b[c + 102551] & 1 ? 6 : 8;
  6 == i && 0 < o[h] && (Ni(k), Ok(c, h), k = Pi(k), o[c + 102554] = k);
  i = b[c + 102549] & 1 ? 9 : 11;
  9 == i && 0 < o[h] && (Ni(l), Uk(c, h), l = Pi(l), o[c + 102559] = l);
  i = 0 < o[h] ? 12 : 13;
  12 == i && (o[c + 102547] = o[h + 1]);
  i = 0 != (b[c + 102517] & 4) ? 14 : 15;
  if (14 == i) {
    l = b[c + 102538];
    h = 0 != b[c + 102538] ? 1 : 2;
    a : do if (1 == h) for (;;) if (cc(l + 19), o[l + 21] = 0, l = k = b[l + 24], 0 == k) break a; while (0);
  }
  b[c + 102517] &= -3;
  h = Pi(g);
  o[c + 102552] = h;
  a = g;
}

vc.X = 1;

function cl(c) {
  return b[b[c + 3] + 1];
}

function dl(c, f, d) {
  var e, c = f + 8, f = d + 8, d = b[c + 2] == b[f + 2] ? 1 : 3;
  1 == d && (0 == b[c + 2] ? d = 3 : (e = 0 < b[c + 2], d = 6));
  if (3 == d) {
    if (0 != (b[f] & b[c + 1])) d = 4; else var g = 0, d = 5;
    4 == d && (g = 0 != (b[f + 1] & b[c]));
    e = g & 1;
  }
  return e;
}

dl.X = 1;

function el(c, f, d, e, g) {
  fl(c, f, d, e, g);
  b[c] = gl + 2;
  f = 3 == cl(b[c + 12]) ? 2 : 1;
  1 == f && O(hl, 43, il, jl);
  f = 0 == cl(b[c + 13]) ? 4 : 3;
  3 == f && O(hl, 44, il, kl);
}

el.X = 1;

function ll(c, f, d, e) {
  var g = a;
  a += 13;
  var i;
  i = Zk(b[c + 12]);
  dc(g);
  wh(i, g, b[c + 14]);
  $c(f, g, d, Zk(b[c + 13]), e);
  a = g;
}

ll.X = 1;

function ml(c, f, d, e, g) {
  fl(c, f, d, e, g);
  b[c] = nl + 2;
  f = 3 == cl(b[c + 12]) ? 2 : 1;
  1 == f && O(ol, 43, pl, jl);
  f = 2 == cl(b[c + 13]) ? 4 : 3;
  3 == f && O(ol, 44, pl, ql);
}

ml.X = 1;

function rl(c, f, d, e) {
  var g = a;
  a += 13;
  var i;
  i = Zk(b[c + 12]);
  dc(g);
  wh(i, g, b[c + 14]);
  c = Zk(b[c + 13]);
  i = a;
  a += 63;
  dd(i, f, g, d, c, e);
  a = i;
  a = g;
}

rl.X = 1;

function sl(c, f, d) {
  fl(c, f, 0, d, 0);
  b[c] = tl + 2;
  f = 0 == cl(b[c + 12]) ? 2 : 1;
  1 == f && O(ul, 44, vl, wl);
  f = 0 == cl(b[c + 13]) ? 4 : 3;
  3 == f && O(ul, 45, vl, kl);
}

function xl(c, f, d, e) {
  1 == (0 <= d & 4 > d ? 2 : 1) && O(yl, 54, zl, Al);
  3 == (0 <= e & 4 > e ? 4 : 3) && O(yl, 55, zl, Bl);
  b[Cl + 12 * d + 3 * e] = c;
  b[Cl + 12 * d + 3 * e + 1] = f;
  b[Cl + 12 * d + 3 * e + 2] = 1;
  if (5 == (d != e ? 5 : 6)) b[Cl + 12 * e + 3 * d] = c, b[Cl + 12 * e + 3 * d + 1] = f, b[Cl + 12 * e + 3 * d + 2] = 0;
}

xl.X = 1;

function Hj(c, f, d, e, g) {
  var i, h, j, k, l;
  i = 0 == (b[Dl] & 1) ? 1 : 2;
  1 == i && (xl(8, 10, 0, 0), xl(12, 14, 2, 0), xl(16, 18, 2, 2), xl(20, 22, 1, 0), xl(24, 26, 1, 2), xl(28, 30, 3, 0), xl(32, 34, 3, 2), b[Dl] = 1);
  j = cl(c);
  k = cl(d);
  3 == (0 <= j & 4 > j ? 4 : 3) && O(yl, 80, El, Al);
  5 == (0 <= k & 4 > k ? 6 : 5) && O(yl, 81, El, Bl);
  l = b[Cl + 12 * j + 3 * k];
  i = 0 != b[Cl + 12 * j + 3 * k] ? 7 : 10;
  7 == i ? (i = b[Cl + 12 * j + 3 * k + 2] & 1 ? 8 : 9, 8 == i ? h = mb[l](c, f, d, e, g) : 9 == i && (h = mb[l](d, e, c, f, g))) : 10 == i && (h = 0);
  return h;
}

Hj.X = 1;

function uj(c, f) {
  var d, e, g;
  d = 1 == (b[Dl] & 1) ? 2 : 1;
  1 == d && O(yl, 103, Fl, Gl);
  d = 0 < b[c + 31] ? 3 : 4;
  3 == d && (qc(rj(b[c + 12]), 1), qc(rj(b[c + 13]), 1));
  e = cl(b[c + 12]);
  g = cl(b[c + 13]);
  d = 0 <= e ? 5 : 6;
  5 == d && (d = 4 > g ? 7 : 6);
  6 == d && O(yl, 114, Fl, Hl);
  d = 0 <= e ? 8 : 9;
  8 == d && (d = 4 > g ? 10 : 9);
  9 == d && O(yl, 115, Fl, Hl);
  mb[b[Cl + 12 * e + 3 * g + 1]](c, f);
}

uj.X = 1;

function fl(c, f, d, e, g) {
  b[c] = Il + 2;
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
  f = Zc(o[b[c + 12] + 4] * o[b[c + 13] + 4]);
  o[c + 34] = f;
  o[c + 35] = o[b[c + 12] + 5] > o[b[c + 13] + 5] ? o[b[c + 12] + 5] : o[b[c + 13] + 5];
}

fl.X = 1;

function yj(c, f) {
  var d = a;
  a += 17;
  var e, g, i, h, j, k, l, m, n, p, u = d + 16, r, q;
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
  h = rj(b[c + 12]);
  k = rj(b[c + 13]);
  l = h + 3;
  m = k + 3;
  e = j & 1 ? 3 : 4;
  do if (3 == e) {
    n = Zk(b[c + 12]);
    g = Zk(b[c + 13]);
    var v = n, x = b[c + 14], w = g, y = b[c + 15], z = l;
    n = m;
    g = a;
    a += 37;
    p = g + 23;
    r = g + 31;
    var B = g;
    le(B);
    le(B + 7);
    me(g, v, x);
    me(g + 7, w, y);
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
    xe(r, p, g);
    n = 11920928955078125e-22 > o[r + 4];
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
        for (r = 0; ; ) {
          if (r >= b[w]) {
            e = 11;
            break;
          }
          q = y + 5 * r;
          if (b[q + 4] == b[B]) {
            e = 9;
            break;
          }
          r += 1;
        }
        9 == e && (o[p + 2] = o[q + 2], o[p + 3] = o[q + 3]);
        n += 1;
        if (n >= b[v]) {
          e = 12;
          break a;
        }
      }
    } while (0);
    (g & 1) == (i & 1) ? e = 14 : (qc(h, 1), qc(k, 1));
  } while (0);
  u = b[c + 1];
  e = g & 1 ? 15 : 16;
  15 == e ? b[c + 1] = u | 2 : 16 == e && (b[c + 1] = u & -3);
  if (18 == (0 == (i & 1) ? 18 : 21) && 1 == (g & 1) && 0 != f) mb[b[b[f] + 2]](f, c);
  if (22 == (1 == (i & 1) ? 22 : 25) && 0 == (g & 1) && 0 != f) mb[b[b[f] + 3]](f, c);
  if (26 == (0 == (j & 1) ? 26 : 29) && g & 1 && 0 != f) mb[b[b[f] + 4]](f, c, d);
  a = d;
}

yj.X = 1;

function Jl(c) {
  o[c] = 0;
  o[c + 2] = 0;
  o[c + 1] = 0;
  o[c + 3] = 0;
}

function hk(c) {
  Ei(b[c + 8], b[c + 10]);
  Ei(b[c + 8], b[c + 9]);
}

function ak(c, f) {
  var d, e, g, i, h, j, k, l, m, n;
  e = f;
  for (var p = f + 6, u = c; e < p; e++, u++) b[u] = b[e], o[u] = o[e];
  b[c + 8] = b[f + 10];
  b[c + 12] = b[f + 7];
  e = Ki(b[c + 8], 88 * b[c + 12]);
  b[c + 9] = e;
  e = Ki(b[c + 8], 152 * b[c + 12]);
  b[c + 10] = e;
  b[c + 6] = b[f + 8];
  b[c + 7] = b[f + 9];
  b[c + 11] = b[f + 6];
  e = 0;
  p = c + 12;
  d = e < b[p] ? 1 : 10;
  a : do if (1 == d) for (var u = c + 11, r = c + 10, q = c + 9, v = c + 5, x = c + 2, w = c + 2; ; ) {
    g = b[b[u] + e];
    i = b[g + 12];
    h = b[g + 13];
    j = Zk(i);
    k = Zk(h);
    j = o[j + 2];
    l = o[k + 2];
    m = rj(i);
    n = rj(h);
    h = g + 16;
    i = b[h + 15];
    d = 0 < b[h + 15] ? 4 : 3;
    3 == d && O(Kl, 71, Ll, Ml);
    k = b[r] + 38 * e;
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
    Jl(k + 24);
    Jl(k + 20);
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
    b : do if (5 == d) for (;;) if (l = h + 5 * j, m = k + 9 * j, d = b[v] & 1 ? 6 : 7, 6 == d ? (o[m + 4] = o[x] * o[l + 2], o[m + 5] = o[w] * o[l + 3]) : 7 == d && (o[m + 4] = 0, o[m + 5] = 0), cc(m), cc(m + 2), o[m + 6] = 0, o[m + 7] = 0, o[m + 8] = 0, m = g + (j << 1), b[m] = b[l], o[m] = o[l], b[m + 1] = b[l + 1], o[m + 1] = o[l + 1], j += 1, j >= i) {
      d = 9;
      break b;
    } while (0);
    e += 1;
    if (e >= b[p]) break a;
  } while (0);
}

ak.X = 1;

function bk(c) {
  var f = a;
  a += 54;
  var d, e, g, i, h, j, k, l, m, n, p, u, r, q = f + 2, v = f + 4, x, w = f + 6, y, z = f + 8, B, E = f + 10, D, H = f + 12, I = f + 16, M = f + 20, G = f + 22, R = f + 24, P = f + 26, L = f + 28, T, F, X, Z = f + 34, V = f + 36, aa, ja, Y, W = f + 38, $, ga, la, fa, ka = f + 40, oa = f + 42, ua = f + 44, Da = f + 46, Ja = f + 48, Aa, Ta, pb, Fa, Va, Na, pa, ha, Ba, za = f + 50;
  e = 0;
  var va = c + 12;
  d = e < b[va] ? 1 : 17;
  a : do if (1 == d) for (var Ka = c + 10, ma = c + 9, La = c + 11, Ga = f, ya = q, Oa = c + 6, Ea = v, Gb = c + 6, Ob = c + 7, Pa = w, ec = c + 7, Pb = c + 6, Wa = z, fc = c + 6, wb = c + 7, Xa = E, Qb = c + 7, Hb = H + 2, Ab = I + 2, Bb = H + 2, db = H, Xb = M, Yb = I + 2, eb = I, xb = R, fb = L, Ia = za, Zb = L + 2, gb = Z, Cb = L + 2, hb = V; ; ) {
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
    r = o[g + 33];
    var Db = i + 12;
    b[Ga] = b[Db];
    o[Ga] = o[Db];
    b[Ga + 1] = b[Db + 1];
    o[Ga + 1] = o[Db + 1];
    var gc = i + 14;
    b[ya] = b[gc];
    o[ya] = o[gc];
    b[ya + 1] = b[gc + 1];
    o[ya + 1] = o[gc + 1];
    var hc = b[Oa] + 3 * l;
    b[Ea] = b[hc];
    o[Ea] = o[hc];
    b[Ea + 1] = b[hc + 1];
    o[Ea + 1] = o[hc + 1];
    x = o[b[Gb] + 3 * l + 2];
    var qb = b[Ob] + 3 * l;
    b[Pa] = b[qb];
    o[Pa] = o[qb];
    b[Pa + 1] = b[qb + 1];
    o[Pa + 1] = o[qb + 1];
    y = o[b[ec] + 3 * l + 2];
    var Rb = b[Pb] + 3 * m;
    b[Wa] = b[Rb];
    o[Wa] = o[Rb];
    b[Wa + 1] = b[Rb + 1];
    o[Wa + 1] = o[Rb + 1];
    B = o[b[fc] + 3 * m + 2];
    var Sb = b[wb] + 3 * m;
    b[Xa] = b[Sb];
    o[Xa] = o[Sb];
    b[Xa + 1] = b[Sb + 1];
    o[Xa + 1] = o[Sb + 1];
    D = o[b[Qb] + 3 * m + 2];
    d = 0 < b[k + 15] ? 4 : 3;
    3 == d && O(Kl, 168, Nl, Ol);
    ch(Hb, x);
    ch(Ab, B);
    S(G, Bb, f);
    C(M, v, G);
    b[db] = b[Xb];
    o[db] = o[Xb];
    b[db + 1] = b[Xb + 1];
    o[db + 1] = o[Xb + 1];
    S(P, Yb, q);
    C(R, z, P);
    b[eb] = b[xb];
    o[eb] = o[xb];
    b[eb + 1] = b[xb + 1];
    o[eb + 1] = o[xb + 1];
    je(L, k, H, h, I, j);
    var rb = g + 18;
    b[rb] = b[fb];
    o[rb] = o[fb];
    b[rb + 1] = b[fb + 1];
    o[rb + 1] = o[fb + 1];
    T = b[g + 36];
    F = 0;
    if (F < T) {
      var $b = g;
      d = 5;
    } else {
      var Eb = g;
      d = 12;
    }
    b : do if (5 == d) for (;;) {
      var ic = X = $b + 9 * F;
      C(Z, Zb + (F << 1), v);
      var sb = ic;
      b[sb] = b[gb];
      o[sb] = o[gb];
      b[sb + 1] = b[gb + 1];
      o[sb + 1] = o[gb + 1];
      var Ib = X + 2;
      C(V, Cb + (F << 1), z);
      var tb = Ib;
      b[tb] = b[hb];
      o[tb] = o[hb];
      b[tb + 1] = b[hb + 1];
      o[tb + 1] = o[hb + 1];
      aa = Q(X, g + 18);
      ja = Q(X + 2, g + 18);
      Y = n + p + u * aa * aa + r * ja * ja;
      if (0 < n + p + u * aa * aa + r * ja * ja) d = 6; else {
        var ib = 0;
        d = 7;
      }
      6 == d && (ib = 1 / Y);
      o[X + 6] = ib;
      Wd(W, g + 18);
      $ = Q(X, W);
      ga = Q(X + 2, W);
      la = n + p + u * $ * $ + r * ga * ga;
      if (0 < n + p + u * $ * $ + r * ga * ga) d = 8; else {
        var ac = 0;
        d = 9;
      }
      8 == d && (ac = 1 / la);
      o[X + 7] = ac;
      o[X + 8] = 0;
      var jc = g + 18;
      Ce(Da, D, X + 2);
      N(ua, E, Da);
      C(oa, ua, w);
      Ce(Ja, y, X);
      C(ka, oa, Ja);
      var Tb = J(jc, ka);
      fa = Tb;
      d = -1 > Tb ? 10 : 11;
      10 == d && (o[X + 8] = -o[g + 35] * fa);
      F += 1;
      if (F < T) $b = g; else {
        Eb = g;
        d = 12;
        break b;
      }
    } while (0);
    d = 2 == b[Eb + 36] ? 13 : 16;
    if (13 == d) {
      Aa = g;
      Ta = g + 9;
      pb = Q(Aa, g + 18);
      Fa = Q(Aa + 2, g + 18);
      Va = Q(Ta, g + 18);
      Na = Q(Ta + 2, g + 18);
      pa = n + p + u * pb * pb + r * Fa * Fa;
      ha = n + p + u * Va * Va + r * Na * Na;
      Ba = n + p + u * pb * Va + r * Fa * Na;
      var Ac = g;
      d = pa * pa < 1e3 * (pa * ha - Ba * Ba) ? 14 : 15;
      if (14 == d) {
        nc(Ac + 24, pa, Ba);
        nc(g + 26, Ba, ha);
        var kc = g + 20;
        Pl(za, g + 24);
        var jb = kc;
        b[jb] = b[Ia];
        o[jb] = o[Ia];
        b[jb + 1] = b[Ia + 1];
        o[jb + 1] = o[Ia + 1];
        b[jb + 2] = b[Ia + 2];
        o[jb + 2] = o[Ia + 2];
        b[jb + 3] = b[Ia + 3];
        o[jb + 3] = o[Ia + 3];
      } else 15 == d && (b[Ac + 36] = 1);
    }
    e += 1;
    if (e >= b[va]) {
      d = 17;
      break a;
    }
  } while (0);
  a = f;
}

bk.X = 1;

function Pl(c, f) {
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

Pl.X = 1;

function ck(c) {
  var f = a;
  a += 18;
  var d, e, g, i, h, j, k, l, m, n, p, u = f + 2, r, q = f + 4, v = f + 6, x, w, y = f + 8, z = f + 10, B = f + 12, E = f + 14, D = f + 16;
  e = 0;
  var H = c + 12;
  d = e < b[H] ? 1 : 5;
  a : do if (1 == d) for (var I = c + 10, M = c + 7, G = f, R = c + 7, P = c + 7, L = u, T = c + 7, F = q, X = c + 7, Z = f, V = c + 7, aa = c + 7, ja = u, Y = c + 7; ; ) {
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
    p = o[b[R] + 3 * i + 2];
    r = b[P] + 3 * h;
    b[L] = b[r];
    o[L] = o[r];
    b[L + 1] = b[r + 1];
    o[L + 1] = o[r + 1];
    r = o[b[T] + 3 * h + 2];
    d = g + 18;
    b[F] = b[d];
    o[F] = o[d];
    b[F + 1] = b[d + 1];
    o[F + 1] = o[d + 1];
    Wd(v, q);
    x = 0;
    d = x < n ? 3 : 4;
    b : do if (3 == d) for (;;) if (w = g + 9 * x, K(z, o[w + 4], q), K(B, o[w + 5], v), N(y, z, B), p -= k * Q(w, y), K(E, j, y), Ke(f, E), r += m * Q(w + 2, y), K(D, l, y), Nb(u, D), x += 1, x >= n) {
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
    o[b[Y] + 3 * h + 2] = r;
    e += 1;
    if (e >= b[H]) break a;
  } while (0);
  a = f;
}

ck.X = 1;

function Ql(c, f, d) {
  oc(c, o[f] * o[d] + o[f + 2] * o[d + 1], o[f + 1] * o[d] + o[f + 3] * o[d + 1]);
}

function dk(c) {
  var f = a;
  a += 126;
  var d, e, g, i, h, j, k, l, m, n, p, u = f + 2, r, q = f + 4, v = f + 6, x, w, y, z = f + 8, B = f + 10, E = f + 12, D = f + 14, H = f + 16, I, M, G, R, P = f + 18, L = f + 20, T = f + 22, F, X = f + 24, Z = f + 26, V = f + 28, aa = f + 30, ja = f + 32, Y, W, $, ga = f + 34, la = f + 36, fa = f + 38, ka, oa, ua = f + 40, Da = f + 42, Ja = f + 44, Aa = f + 46, Ta = f + 48, pb = f + 50, Fa = f + 52, Va = f + 54, Na = f + 56, pa = f + 58, ha = f + 60, Ba, za, va = f + 62, Ka = f + 64, ma = f + 66, La = f + 68, Ga = f + 70, ya = f + 72, Oa = f + 74, Ea = f + 76, Gb = f + 78, Ob = f + 80, Pa = f + 82, ec = f + 84, Pb = f + 86, Wa = f + 88, fc = f + 90, wb = f + 92, Xa = f + 94, Qb = f + 96, Hb = f + 98, Ab = f + 100, Bb = f + 102, db = f + 104, Xb = f + 106, Yb = f + 108, eb = f + 110, xb = f + 112, fb = f + 114, Ia = f + 116, Zb = f + 118, gb = f + 120, Cb = f + 122, hb = f + 124;
  e = 0;
  var Db = c + 12;
  d = e < b[Db] ? 1 : 24;
  a : do if (1 == d) for (var gc = c + 10, hc = c + 7, qb = f, Rb = c + 7, Sb = c + 7, rb = u, $b = c + 7, Eb = q, ic = c + 7, sb = f, Ib = c + 7, tb = c + 7, ib = u, ac = c + 7, jc = ua, Tb = ua + 1, Ac = va, kc = va + 1, jb = ma, $d = ma + 1, Ue = Ga, Ve = Ga + 1, ed = ma, fd = ma + 1, gd = va, hd = ma, id = ma + 1, jd = ma, kd = va + 1, ld = ma, Ah = ec, md = ec + 1, nd = ma, Bh = ma + 1, od = ma, pd = va + 1, ae = ma + 1, We = ma + 1, Xe = va, qd = ma + 1, rd = Hb, sd = Hb + 1, td = ma, ud = ma + 1, vd = ma, wd = ma + 1, xd = va, Ch = va + 1, yd = xb, zd = xb + 1, Dh = ma, Ad = ma + 1; ; ) {
    g = b[gc] + 38 * e;
    i = b[g + 28];
    h = b[g + 29];
    j = o[g + 30];
    k = o[g + 32];
    l = o[g + 31];
    m = o[g + 33];
    n = b[g + 36];
    var sc = b[hc] + 3 * i;
    b[qb] = b[sc];
    o[qb] = o[sc];
    b[qb + 1] = b[sc + 1];
    o[qb + 1] = o[sc + 1];
    p = o[b[Rb] + 3 * i + 2];
    var Bc = b[Sb] + 3 * h;
    b[rb] = b[Bc];
    o[rb] = o[Bc];
    b[rb + 1] = b[Bc + 1];
    o[rb + 1] = o[Bc + 1];
    r = o[b[$b] + 3 * h + 2];
    var Qc = g + 18;
    b[Eb] = b[Qc];
    o[Eb] = o[Qc];
    b[Eb + 1] = b[Qc + 1];
    o[Eb + 1] = o[Qc + 1];
    Wd(v, q);
    x = o[g + 34];
    d = 1 == n | 2 == n ? 4 : 3;
    3 == d && O(Kl, 311, Rl, Sl);
    w = 0;
    if (w < n) {
      var be = g;
      d = 5;
    } else {
      var Rc = g;
      d = 6;
    }
    b : do if (5 == d) for (;;) if (y = be + 9 * w, Ce(D, r, y + 2), N(E, u, D), C(B, E, f), Ce(H, p, y), C(z, B, H), I = J(z, v), M = o[y + 7] * -I, G = x * o[y + 4], R = $j(o[y + 5] + M, -G, G), M = R - o[y + 5], o[y + 5] = R, K(P, M, v), K(L, j, P), Ke(f, L), p -= k * Q(y, P), K(T, l, P), Nb(u, T), r += m * Q(y + 2, P), w += 1, w < n) be = g; else {
      Rc = g;
      d = 6;
      break b;
    } while (0);
    var Sc = g;
    d = 1 == b[Rc + 36] ? 7 : 8;
    b : do if (7 == d) F = Sc, Ce(aa, r, F + 2), N(V, u, aa), C(Z, V, f), Ce(ja, p, F), C(X, Z, ja), Y = J(X, q), W = -o[F + 6] * (Y - o[F + 8]), $ = 0 < o[F + 4] + W ? o[F + 4] + W : 0, W = $ - o[F + 4], o[F + 4] = $, K(ga, W, q), K(la, j, ga), Ke(f, la), p -= k * Q(F, ga), K(fa, l, ga), Nb(u, fa), r += m * Q(F + 2, ga); else if (8 == d) {
      ka = Sc;
      oa = g + 9;
      oc(ua, o[ka + 4], o[oa + 4]);
      d = 0 <= o[jc] ? 9 : 10;
      9 == d && (d = 0 <= o[Tb] ? 11 : 10);
      10 == d && O(Kl, 406, Rl, Tl);
      Ce(Ta, r, ka + 2);
      N(Aa, u, Ta);
      C(Ja, Aa, f);
      Ce(pb, p, ka);
      C(Da, Ja, pb);
      Ce(pa, r, oa + 2);
      N(Na, u, pa);
      C(Va, Na, f);
      Ce(ha, p, oa);
      C(Fa, Va, ha);
      Ba = J(Da, q);
      za = J(Fa, q);
      o[Ac] = Ba - o[ka + 8];
      o[kc] = za - o[oa + 8];
      Ql(Ka, g + 24, ua);
      Ke(va, Ka);
      Ql(La, g + 20, va);
      Pd(ma, La);
      d = 0 <= o[jb] ? 12 : 14;
      do if (12 == d) if (0 <= o[$d]) {
        C(Ga, ma, ua);
        K(ya, o[Ue], q);
        K(Oa, o[Ve], q);
        var Bd = j;
        N(Gb, ya, Oa);
        K(Ea, Bd, Gb);
        Ke(f, Ea);
        p -= k * (Q(ka, ya) + Q(oa, Oa));
        var Cd = l;
        N(Pa, ya, Oa);
        K(Ob, Cd, Pa);
        Nb(u, Ob);
        r += m * (Q(ka + 2, ya) + Q(oa + 2, Oa));
        o[ka + 4] = o[ed];
        o[oa + 4] = o[fd];
        d = 23;
        break b;
      } else d = 14; while (0);
      o[hd] = -o[ka + 6] * o[gd];
      Ba = o[id] = 0;
      za = o[g + 25] * o[jd] + o[kd];
      d = 0 <= o[ld] ? 15 : 17;
      do if (15 == d) if (0 <= za) {
        C(ec, ma, ua);
        K(Pb, o[Ah], q);
        K(Wa, o[md], q);
        var Dd = j;
        N(wb, Pb, Wa);
        K(fc, Dd, wb);
        Ke(f, fc);
        p -= k * (Q(ka, Pb) + Q(oa, Wa));
        var Ed = l;
        N(Qb, Pb, Wa);
        K(Xa, Ed, Qb);
        Nb(u, Xa);
        r += m * (Q(ka + 2, Pb) + Q(oa + 2, Wa));
        o[ka + 4] = o[nd];
        o[oa + 4] = o[Bh];
        d = 23;
        break b;
      } else d = 17; while (0);
      o[od] = 0;
      o[ae] = -o[oa + 6] * o[pd];
      Ba = o[g + 26] * o[We] + o[Xe];
      za = 0;
      d = 0 <= o[qd] ? 18 : 20;
      do if (18 == d) if (0 <= Ba) {
        C(Hb, ma, ua);
        K(Ab, o[rd], q);
        K(Bb, o[sd], q);
        var Fd = j;
        N(Xb, Ab, Bb);
        K(db, Fd, Xb);
        Ke(f, db);
        p -= k * (Q(ka, Ab) + Q(oa, Bb));
        var Gd = l;
        N(eb, Ab, Bb);
        K(Yb, Gd, eb);
        Nb(u, Yb);
        r += m * (Q(ka + 2, Ab) + Q(oa + 2, Bb));
        o[ka + 4] = o[td];
        o[oa + 4] = o[ud];
        d = 23;
        break b;
      } else d = 20; while (0);
      o[vd] = 0;
      o[wd] = 0;
      var Ye = o[xd];
      Ba = Ye;
      za = o[Ch];
      if (0 <= Ye) if (0 <= za) {
        C(xb, ma, ua);
        K(fb, o[yd], q);
        K(Ia, o[zd], q);
        var Hd = j;
        N(gb, fb, Ia);
        K(Zb, Hd, gb);
        Ke(f, Zb);
        p -= k * (Q(ka, fb) + Q(oa, Ia));
        var Id = l;
        N(hb, fb, Ia);
        K(Cb, Id, hb);
        Nb(u, Cb);
        r += m * (Q(ka + 2, fb) + Q(oa + 2, Ia));
        o[ka + 4] = o[Dh];
        o[oa + 4] = o[Ad];
      } else d = 23; else d = 23;
    } while (0);
    var Jd = b[ic] + 3 * i;
    b[Jd] = b[sb];
    o[Jd] = o[sb];
    b[Jd + 1] = b[sb + 1];
    o[Jd + 1] = o[sb + 1];
    o[b[Ib] + 3 * i + 2] = p;
    var tc = b[tb] + 3 * h;
    b[tc] = b[ib];
    o[tc] = o[ib];
    b[tc + 1] = b[ib + 1];
    o[tc + 1] = o[ib + 1];
    o[b[ac] + 3 * h + 2] = r;
    e += 1;
    if (e >= b[Db]) {
      d = 24;
      break a;
    }
  } while (0);
  a = f;
}

dk.X = 1;

function ek(c) {
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

ek.X = 1;

function fk(c) {
  var f = a;
  a += 43;
  var d, e, g, i, h, j, k, l, m = f + 2, n, p, u, r = f + 4, q, v = f + 6, x, w, y = f + 8, z = f + 12, B = f + 16, E = f + 18, D = f + 20, H = f + 22, I = f + 24, M = f + 29, G = f + 31, R = f + 33, P = f + 35, L, T, F, X = f + 37, Z = f + 39, V = f + 41;
  g = e = 0;
  var aa = c + 12;
  d = g < b[aa] ? 1 : 7;
  a : do if (1 == d) for (var ja = c + 9, Y = f, W = m, $ = c + 6, ga = r, la = c + 6, fa = c + 6, ka = v, oa = c + 6, ua = c + 6, Da = r, Ja = c + 6, Aa = c + 6, Ta = v, pb = c + 6, Fa = y + 2, Va = z + 2, Na = y + 2, pa = y, ha = B, Ba = z + 2, za = z, va = D, Ka = M, ma = I, La = G, Ga = I + 2, ya = I + 4; ; ) {
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
      ch(Fa, q);
      ch(Va, x);
      S(E, Na, f);
      C(B, r, E);
      b[pa] = b[ha];
      o[pa] = o[ha];
      b[pa + 1] = b[ha + 1];
      o[pa + 1] = o[ha + 1];
      S(H, Ba, m);
      C(D, v, H);
      b[za] = b[va];
      o[za] = o[va];
      b[za + 1] = b[va + 1];
      o[za + 1] = o[va + 1];
      Ul(I, i, y, z, w);
      b[Ka] = b[ma];
      o[Ka] = o[ma];
      b[Ka + 1] = b[ma + 1];
      o[Ka + 1] = o[ma + 1];
      b[La] = b[Ga];
      o[La] = o[Ga];
      b[La + 1] = b[Ga + 1];
      o[La + 1] = o[Ga + 1];
      d = o[ya];
      C(R, G, r);
      C(P, G, v);
      e = e < d ? e : d;
      L = $j(.20000000298023224 * (d + .004999999888241291), -.20000000298023224, 0);
      d = Q(R, M);
      T = Q(P, M);
      F = k + n + l * d * d + p * T * T;
      if (0 < k + n + l * d * d + p * T * T) d = 4; else {
        var Oa = 0;
        d = 5;
      }
      4 == d && (Oa = -L / F);
      L = Oa;
      K(X, L, M);
      K(Z, k, X);
      Ke(r, Z);
      q -= l * Q(R, X);
      K(V, n, X);
      Nb(v, V);
      x += p * Q(P, X);
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
    b[h] = b[Ta];
    o[h] = o[Ta];
    b[h + 1] = b[Ta + 1];
    o[h + 1] = o[Ta + 1];
    o[b[pb] + 3 * j + 2] = x;
    g += 1;
    if (g >= b[aa]) break a;
  } while (0);
  a = f;
  return -.014999999664723873 <= e;
}

fk.X = 1;

function Ul(c, f, d, e, g) {
  var i = a;
  a += 30;
  var h, j = i + 2, k = i + 4, l = i + 6, m = i + 8, n = i + 10, p = i + 12, u = i + 14, r = i + 16, q = i + 18, v = i + 20, x = i + 22, w = i + 24, y = i + 26, z = i + 28;
  h = 0 < b[f + 21] ? 2 : 1;
  1 == h && O(Kl, 617, Vl, Wl);
  h = b[f + 18];
  h = 0 == h ? 3 : 1 == h ? 4 : 2 == h ? 5 : 6;
  3 == h ? (Pc(i, d, f + 6), Pc(j, e, f), C(k, j, i), b[c] = b[k], o[c] = o[k], b[c + 1] = b[k + 1], o[c + 1] = o[k + 1], Xc(c), r = c + 2, N(m, i, j), K(l, .5, m), b[r] = b[l], o[r] = o[l], b[r + 1] = b[l + 1], o[r + 1] = o[l + 1], C(n, j, i), o[c + 4] = J(n, c) - o[f + 19] - o[f + 20]) : 4 == h ? (S(p, d + 2, f + 4), b[c] = b[p], o[c] = o[p], b[c + 1] = b[p + 1], o[c + 1] = o[p + 1], Pc(u, d, f + 6), Pc(r, e, f + (g << 1)), C(q, r, u), o[c + 4] = J(q, c) - o[f + 19] - o[f + 20], c += 2, b[c] = b[r], o[c] = o[r], b[c + 1] = b[r + 1], o[c + 1] = o[r + 1]) : 5 == h && (S(v, e + 2, f + 4), b[c] = b[v], o[c] = o[v], b[c + 1] = b[v + 1], o[c + 1] = o[v + 1], Pc(x, e, f + 6), Pc(w, d, f + (g << 1)), C(y, w, x), o[c + 4] = J(y, c) - o[f + 19] - o[f + 20], f = c + 2, b[f] = b[w], o[f] = o[w], b[f + 1] = b[w + 1], o[f + 1] = o[w + 1], Pd(z, c), b[c] = b[z], o[c] = o[z], b[c + 1] = b[z + 1], o[c + 1] = o[z + 1]);
  a = i;
}

Ul.X = 1;

function nk(c, f, d) {
  var e = a;
  a += 43;
  var g, i, h, j, k, l, m = e + 2, n, p, u, r, q, v = e + 4, x, w = e + 6, y, z, B = e + 8, E = e + 12, D = e + 16, H = e + 18, I = e + 20, M = e + 22, G = e + 24, R = e + 29, P = e + 31, L = e + 33, T = e + 35, F, X, Z, V = e + 37, aa = e + 39, ja = e + 41;
  h = i = 0;
  var Y = c + 12;
  g = h < b[Y] ? 1 : 13;
  a : do if (1 == g) for (var W = c + 9, $ = e, ga = m, la = c + 6, fa = v, ka = c + 6, oa = c + 6, ua = w, Da = c + 6, Ja = c + 6, Aa = v, Ta = c + 6, pb = c + 6, Fa = w, Va = c + 6, Na = B + 2, pa = E + 2, ha = B + 2, Ba = B, za = D, va = E + 2, Ka = E, ma = I, La = R, Ga = G, ya = P, Oa = G + 2, Ea = G + 4; ; ) {
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
    r = o[j + 11];
    q = o[j + 17];
    g = l == f ? 7 : 6;
    6 == g && (g = l == d ? 7 : 8);
    7 == g && (r = o[j + 11], q = o[j + 17]);
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
      ch(Na, x);
      ch(pa, y);
      S(H, ha, e);
      C(D, v, H);
      b[Ba] = b[za];
      o[Ba] = o[za];
      b[Ba + 1] = b[za + 1];
      o[Ba + 1] = o[za + 1];
      S(M, va, m);
      C(I, w, M);
      b[Ka] = b[ma];
      o[Ka] = o[ma];
      b[Ka + 1] = b[ma + 1];
      o[Ka + 1] = o[ma + 1];
      Ul(G, j, B, E, z);
      b[La] = b[Ga];
      o[La] = o[Ga];
      b[La + 1] = b[Ga + 1];
      o[La + 1] = o[Ga + 1];
      b[ya] = b[Oa];
      o[ya] = o[Oa];
      b[ya + 1] = b[Oa + 1];
      o[ya + 1] = o[Oa + 1];
      g = o[Ea];
      C(L, P, v);
      C(T, P, w);
      i = i < g ? i : g;
      F = $j(.75 * (g + .004999999888241291), -.20000000298023224, 0);
      g = Q(L, R);
      X = Q(T, R);
      Z = p + r + u * g * g + q * X * X;
      if (0 < p + r + u * g * g + q * X * X) g = 10; else {
        var Gb = 0;
        g = 11;
      }
      10 == g && (Gb = -F / Z);
      F = Gb;
      K(V, F, R);
      K(aa, p, V);
      Ke(v, aa);
      x -= u * Q(L, V);
      K(ja, r, V);
      Nb(w, ja);
      y += q * Q(T, V);
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
    o[b[Ta] + 3 * k + 2] = x;
    k = b[pb] + 3 * l;
    b[k] = b[Fa];
    o[k] = o[Fa];
    b[k + 1] = b[Fa + 1];
    o[k + 1] = o[Fa + 1];
    o[b[Va] + 3 * l + 2] = y;
    h += 1;
    if (h >= b[Y]) break a;
  } while (0);
  a = e;
  return -.007499999832361937 <= i;
}

nk.X = 1;

function Xl(c, f, d) {
  fl(c, f, 0, d, 0);
  b[c] = Yl + 2;
  f = 1 == cl(b[c + 12]) ? 2 : 1;
  1 == f && O(Zl, 41, $l, am);
  f = 0 == cl(b[c + 13]) ? 4 : 3;
  3 == f && O(Zl, 42, $l, kl);
}

function bm(c, f) {
  cm(c, f);
  b[c] = dm + 2;
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

bm.X = 1;

function em(c, f, d) {
  fl(c, f, 0, d, 0);
  b[c] = fm + 2;
  f = 1 == cl(b[c + 12]) ? 2 : 1;
  1 == f && O(gm, 41, hm, am);
  f = 2 == cl(b[c + 13]) ? 4 : 3;
  3 == f && O(gm, 42, hm, ql);
}

function im(c, f, d) {
  fl(c, f, 0, d, 0);
  b[c] = jm + 2;
  f = 2 == cl(b[c + 12]) ? 2 : 1;
  1 == f && O(km, 41, lm, mm);
  f = 0 == cl(b[c + 13]) ? 4 : 3;
  3 == f && O(km, 42, lm, kl);
}

function nm(c, f, d) {
  fl(c, f, 0, d, 0);
  b[c] = om + 2;
  f = 2 == cl(b[c + 12]) ? 2 : 1;
  1 == f && O(pm, 44, qm, mm);
  f = 2 == cl(b[c + 13]) ? 4 : 3;
  3 == f && O(pm, 45, qm, ql);
}

function rm(c, f, d) {
  Pc(c, f + 3, d);
}

function sm(c) {
  var f, d;
  f = b[b[c + 12] + 2];
  d = b[b[c + 13] + 2];
  U(tm, A(1, "i32", s));
  U(um, A([ f ], "i32", s));
  U(vm, A([ d ], "i32", s));
  U(wm, A([ b[c + 16] & 1 ], "i32", s));
  U(xm, A([ o[c + 21], o[c + 22] ], "double", s));
  U(ym, A([ o[c + 23], o[c + 24] ], "double", s));
  U(zm, A([ o[c + 27] ], "double", s));
  U(Am, A([ o[c + 18] ], "double", s));
  U(Bm, A([ o[c + 19] ], "double", s));
  U(Cm, A([ b[c + 14] ], "i32", s));
}

sm.X = 1;

function Dm(c, f) {
  var d = a;
  a += 32;
  var e, g, i = d + 2, h, j = d + 4, k, l = d + 6, m, n = d + 8, p = d + 10, u = d + 12, r = d + 14, q = d + 16, v = d + 18;
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
  Em(n, g);
  Em(p, k);
  g = c + 32;
  C(r, c + 21, c + 36);
  S(u, n, r);
  b[g] = b[u];
  o[g] = o[u];
  b[g + 1] = b[u + 1];
  o[g + 1] = o[u + 1];
  n = c + 34;
  C(v, c + 23, c + 38);
  S(q, p, v);
  b[n] = b[q];
  o[n] = o[q];
  b[n + 1] = b[q + 1];
  o[n + 1] = o[q + 1];
  p = c + 30;
  N(w, j, c + 34);
  C(x, w, d);
  C(e, x, c + 32);
  b[p] = b[e];
  o[p] = o[e];
  b[p + 1] = b[e + 1];
  o[p + 1] = o[e + 1];
  x = Yc(c + 30);
  e = .004999999888241291 < x ? 1 : 2;
  1 == e ? Vh(c + 30, 1 / x) : 2 == e && nc(c + 30, 0, 0);
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
  13 == e ? (o[c + 26] *= o[f + 2], K(z, o[c + 26], c + 30), K(B, o[c + 40], z), Ke(i, B), h -= o[c + 42] * Q(c + 32, z), K(E, o[c + 41], z), Nb(l, E), m += o[c + 43] * Q(c + 34, z)) : 14 == e && (o[c + 26] = 0);
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

Dm.X = 1;

function Fm(c, f) {
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
  Ce(j, e, c + 32);
  N(h, d, j);
  Ce(l, i, c + 34);
  N(k, g, l);
  j = c + 30;
  C(m, k, h);
  h = -o[c + 44] * (J(j, m) + o[c + 20] + o[c + 25] * o[c + 26]);
  o[c + 26] += h;
  K(n, h, c + 30);
  K(p, o[c + 40], n);
  Ke(d, p);
  e -= o[c + 42] * Q(c + 32, n);
  K(u, o[c + 41], n);
  Nb(g, u);
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

Fm.X = 1;

function Gm(c, f) {
  var d = a;
  a += 28;
  var e, g, i = d + 2, h = d + 4, j = d + 6, k = d + 8, l = d + 10, m = d + 12, n = d + 14, p = d + 16, u = d + 18, r = d + 20, q = d + 22, v = d + 24, x = d + 26;
  e = 0 < o[c + 18] ? 1 : 2;
  1 == e ? g = 1 : 2 == e && (e = b[f + 6] + 3 * b[c + 28], b[d] = b[e], o[d] = o[e], b[d + 1] = b[e + 1], o[d + 1] = o[e + 1], e = o[b[f + 6] + 3 * b[c + 28] + 2], g = b[f + 6] + 3 * b[c + 29], b[i] = b[g], o[i] = o[g], b[i + 1] = b[g + 1], o[i + 1] = o[g + 1], g = o[b[f + 6] + 3 * b[c + 29] + 2], Em(h, e), Em(j, g), C(l, c + 21, c + 36), S(k, h, l), C(n, c + 23, c + 38), S(m, j, n), N(r, i, m), C(u, r, d), C(p, u, k), h = Xc(p), h -= o[c + 27], h = $j(h, -.20000000298023224, .20000000298023224), j = -o[c + 44] * h, K(q, j, p), K(v, o[c + 40], q), Ke(d, v), e -= o[c + 42] * Q(k, q), K(x, o[c + 41], q), Nb(i, x), g += o[c + 43] * Q(m, q), k = b[f + 6] + 3 * b[c + 28], b[k] = b[d], o[k] = o[d], b[k + 1] = b[d + 1], o[k + 1] = o[d + 1], o[b[f + 6] + 3 * b[c + 28] + 2] = e, k = b[f + 6] + 3 * b[c + 29], b[k] = b[i], o[k] = o[i], b[k + 1] = b[i + 1], o[k + 1] = o[i + 1], o[b[f + 6] + 3 * b[c + 29] + 2] = g, g = .004999999888241291 > ke(h));
  a = d;
  return g;
}

Gm.X = 1;

function Em(c, f) {
  var d = Ih(f);
  o[c] = d;
  d = Jh(f);
  o[c + 1] = d;
}

function Hm(c, f) {
  cm(c, f);
  b[c] = Im + 2;
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
  cc(c + 22);
  o[c + 24] = 0;
  o[c + 25] = o[f + 9];
  o[c + 26] = o[f + 10];
}

Hm.X = 1;

function Jm(c) {
  var f, d;
  f = b[b[c + 12] + 2];
  d = b[b[c + 13] + 2];
  U(Km, A(1, "i32", s));
  U(um, A([ f ], "i32", s));
  U(vm, A([ d ], "i32", s));
  U(wm, A([ b[c + 16] & 1 ], "i32", s));
  U(xm, A([ o[c + 18], o[c + 19] ], "double", s));
  U(ym, A([ o[c + 20], o[c + 21] ], "double", s));
  U(Lm, A([ o[c + 25] ], "double", s));
  U(Mm, A([ o[c + 26] ], "double", s));
  U(Cm, A([ b[c + 14] ], "i32", s));
}

Jm.X = 1;

function Nm(c, f) {
  var d = a;
  a += 30;
  var e, g, i, h, j = d + 2, k, l = d + 4, m = d + 6, n = d + 8, p = d + 10, u = d + 12, r = d + 14;
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
  Em(l, g);
  Em(m, h);
  g = c + 29;
  C(p, c + 18, c + 33);
  S(n, l, p);
  b[g] = b[n];
  o[g] = o[n];
  b[g + 1] = b[n + 1];
  o[g + 1] = o[n + 1];
  l = c + 31;
  C(r, c + 20, c + 35);
  S(u, m, r);
  b[l] = b[u];
  o[l] = o[u];
  b[l + 1] = b[u + 1];
  o[l + 1] = o[u + 1];
  m = o[c + 37];
  u = o[c + 38];
  r = o[c + 39];
  l = o[c + 40];
  o[e] = m + u + r * o[c + 30] * o[c + 30] + l * o[c + 32] * o[c + 32];
  o[e + 1] = -r * o[c + 29] * o[c + 30] - l * o[c + 31] * o[c + 32];
  o[e + 2] = o[e + 1];
  o[e + 3] = m + u + r * o[c + 29] * o[c + 29] + l * o[c + 31] * o[c + 31];
  n = c + 41;
  Pl(q, e);
  b[n] = b[q];
  o[n] = o[q];
  b[n + 1] = b[q + 1];
  o[n + 1] = o[q + 1];
  b[n + 2] = b[q + 2];
  o[n + 2] = o[q + 2];
  b[n + 3] = b[q + 3];
  o[n + 3] = o[q + 3];
  o[c + 45] = r + l;
  e = 0 < o[c + 45] ? 1 : 2;
  1 == e && (o[c + 45] = 1 / o[c + 45]);
  q = c + 22;
  e = b[f + 5] & 1 ? 3 : 4;
  3 == e ? (Vh(q, o[f + 2]), o[c + 24] *= o[f + 2], oc(v, o[c + 22], o[c + 23]), K(x, m, v), Ke(d, x), i -= r * (Q(c + 29, v) + o[c + 24]), K(w, u, v), Nb(j, w), k += l * (Q(c + 31, v) + o[c + 24])) : 4 == e && (cc(q), o[c + 24] = 0);
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

Nm.X = 1;

function Om(c, f) {
  var d = a;
  a += 26;
  var e, g = d + 2, i, h, j, k, l, m, n, p, u, r = d + 4, q = d + 6, v = d + 8, x = d + 10, w = d + 12, y = d + 14, z = d + 16, B = d + 18, E = d + 20, D = d + 22, H = d + 24;
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
  o[c + 24] = $j(o[c + 24] + n, -u, u);
  n = o[c + 24] - p;
  e -= k * n;
  i += l * n;
  Ce(x, i, c + 31);
  N(v, g, x);
  C(q, v, d);
  Ce(w, e, c + 29);
  C(r, q, w);
  Ql(z, c + 41, r);
  Pd(y, z);
  r = c + 22;
  b[B] = b[r];
  o[B] = o[r];
  b[B + 1] = b[r + 1];
  o[B + 1] = o[r + 1];
  Nb(c + 22, y);
  r = m * o[c + 25];
  if (1 == (ve(c + 22) > r * r ? 1 : 2)) Xc(c + 22), Vh(c + 22, r);
  C(E, c + 22, B);
  b[y] = b[E];
  o[y] = o[E];
  b[y + 1] = b[E + 1];
  o[y + 1] = o[E + 1];
  K(D, h, y);
  Ke(d, D);
  e -= k * Q(c + 29, y);
  K(H, j, y);
  Nb(g, H);
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

Om.X = 1;

function Pm(c, f) {
  var d = a;
  a += 40;
  var e, g, i, h, j = d + 4, k, l = d + 8, m = d + 10, n = d + 12, p = d + 14, u = d + 16, r = d + 18, q = d + 20, v = d + 24, x = d + 28, w = d + 30, y = d + 32, z = d + 34, B = d + 36, E = d + 38;
  cm(c, f);
  b[c] = Qm + 2;
  b[c + 18] = b[f + 5];
  b[c + 19] = b[f + 6];
  b[c + 20] = b[b[c + 18] + 1];
  b[c + 21] = b[b[c + 19] + 1];
  e = 1 == b[c + 20] ? 5 : 3;
  3 == e && (2 == b[c + 20] || O(Rm, 53, Sm, Tm));
  e = 1 == b[c + 21] ? 8 : 6;
  6 == e && (2 == b[c + 21] || O(Rm, 54, Sm, Um));
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
  h = o[b[c + 12] + 14];
  D = b[c + 22] + 3;
  b[j] = b[D];
  o[j] = o[D];
  b[j + 1] = b[D + 1];
  o[j + 1] = o[D + 1];
  b[j + 2] = b[D + 2];
  o[j + 2] = o[D + 2];
  b[j + 3] = b[D + 3];
  o[j + 3] = o[D + 3];
  k = o[b[c + 22] + 14];
  D = b[f + 5];
  e = 1 == b[c + 20] ? 11 : 13;
  11 == e ? (g = c + 28, j = D + 18, b[g] = b[j], o[g] = o[j], b[g + 1] = b[j + 1], o[g + 1] = o[j + 1], g = c + 24, j = D + 20, b[g] = b[j], o[g] = o[j], b[g + 1] = b[j + 1], o[g + 1] = o[j + 1], o[c + 36] = o[D + 30], cc(c + 32), g = h - k - o[c + 36]) : 13 == e && (g = c + 28, h = D + 18, b[g] = b[h], o[g] = o[h], b[g + 1] = b[h + 1], o[g + 1] = o[h + 1], g = c + 24, h = D + 20, b[g] = b[h], o[g] = o[h], b[g + 1] = b[h + 1], o[g + 1] = o[h + 1], o[c + 36] = o[D + 26], g = c + 32, D += 22, b[g] = b[D], o[g] = o[D], b[g + 1] = b[D + 1], o[g + 1] = o[D + 1], g = c + 28, b[l] = b[g], o[l] = o[g], b[l + 1] = b[g + 1], o[l + 1] = o[g + 1], g = j + 2, S(p, d + 2, c + 24), C(u, d, j), N(n, p, u), Od(m, g, n), C(r, m, l), g = J(r, c + 32));
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
  l = o[b[c + 13] + 14];
  j = b[c + 23] + 3;
  b[v] = b[j];
  o[v] = o[j];
  b[v + 1] = b[j + 1];
  o[v + 1] = o[j + 1];
  b[v + 2] = b[j + 2];
  o[v + 2] = o[j + 2];
  b[v + 3] = b[j + 3];
  o[v + 3] = o[j + 3];
  m = o[b[c + 23] + 14];
  j = b[f + 6];
  e = 1 == b[c + 21] ? 17 : 18;
  17 == e ? (q = c + 30, v = j + 18, b[q] = b[v], o[q] = o[v], b[q + 1] = b[v + 1], o[q + 1] = o[v + 1], q = c + 26, v = j + 20, b[q] = b[v], o[q] = o[v], b[q + 1] = b[v + 1], o[q + 1] = o[v + 1], o[c + 37] = o[j + 30], cc(c + 34), i = l - m - o[c + 37]) : 18 == e && (i = c + 30, l = j + 18, b[i] = b[l], o[i] = o[l], b[i + 1] = b[l + 1], o[i + 1] = o[l + 1], i = c + 26, l = j + 20, b[i] = b[l], o[i] = o[l], b[i + 1] = b[l + 1], o[i + 1] = o[l + 1], o[c + 37] = o[j + 26], i = c + 34, j += 22, b[i] = b[j], o[i] = o[j], b[i + 1] = b[j + 1], o[i + 1] = o[j + 1], i = c + 30, b[x] = b[i], o[x] = o[i], b[x + 1] = b[i + 1], o[x + 1] = o[i + 1], i = v + 2, S(z, q + 2, c + 26), C(B, q, v), N(y, z, B), Od(w, i, y), C(E, w, x), i = J(E, c + 34));
  o[c + 39] = o[f + 7];
  o[c + 38] = g + o[c + 39] * i;
  o[c + 40] = 0;
  a = d;
}

Pm.X = 1;

function Vm(c, f) {
  var d = a;
  a += 54;
  var e, g = d + 2, i, h = d + 4, j, k = d + 6, l = d + 8, m, n = d + 10, p = d + 12, u, r = d + 14, q = d + 16, v = d + 18, x = d + 20, w = d + 22, y = d + 24, z = d + 26, B = d + 28, E = d + 30, D = d + 32, H = d + 34, I = d + 36, M = d + 38, G = d + 40, R = d + 42, P = d + 44, L = d + 46, T = d + 48, F = d + 50, X = d + 52;
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
  b[r] = b[p];
  o[r] = o[p];
  b[r + 1] = b[p + 1];
  o[r + 1] = o[p + 1];
  p = o[b[f + 7] + 3 * b[c + 44] + 2];
  Em(q, e);
  Em(v, j);
  Em(x, m);
  Em(w, u);
  o[c + 69] = 0;
  e = 1 == b[c + 20] ? 1 : 2;
  1 == e ? (cc(c + 61), o[c + 65] = 1, o[c + 67] = 1, o[c + 69] += o[c + 57] + o[c + 59]) : 2 == e && (S(y, x, c + 32), C(B, c + 28, c + 49), S(z, x, B), C(D, c + 24, c + 45), S(E, q, D), q = c + 61, b[q] = b[y], o[q] = o[y], b[q + 1] = b[y + 1], o[q + 1] = o[y + 1], o[c + 67] = Q(z, y), o[c + 65] = Q(E, y), o[c + 69] += o[c + 55] + o[c + 53] + o[c + 59] * o[c + 67] * o[c + 67] + o[c + 57] * o[c + 65] * o[c + 65]);
  e = 1 == b[c + 21] ? 4 : 5;
  4 == e ? (cc(c + 63), o[c + 66] = o[c + 39], o[c + 68] = o[c + 39], o[c + 69] += o[c + 39] * o[c + 39] * (o[c + 58] + o[c + 60])) : 5 == e && (S(H, w, c + 34), C(M, c + 30, c + 51), S(I, w, M), C(R, c + 26, c + 47), S(G, v, R), v = c + 63, K(P, o[c + 39], H), b[v] = b[P], o[v] = o[P], b[v + 1] = b[P + 1], o[v + 1] = o[P + 1], o[c + 68] = o[c + 39] * Q(I, H), o[c + 66] = o[c + 39] * Q(G, H), o[c + 69] += o[c + 39] * o[c + 39] * (o[c + 56] + o[c + 54]) + o[c + 60] * o[c + 68] * o[c + 68] + o[c + 58] * o[c + 66] * o[c + 66]);
  if (0 < o[c + 69]) e = 7; else {
    var Z = 0;
    e = 8;
  }
  7 == e && (Z = 1 / o[c + 69]);
  o[c + 69] = Z;
  e = b[f + 5] & 1 ? 9 : 10;
  9 == e ? (K(L, o[c + 53] * o[c + 40], c + 61), Nb(g, L), i += o[c + 57] * o[c + 40] * o[c + 65], K(T, o[c + 54] * o[c + 40], c + 63), Nb(k, T), h += o[c + 58] * o[c + 40] * o[c + 66], K(F, o[c + 55] * o[c + 40], c + 61), Ke(n, F), l -= o[c + 59] * o[c + 40] * o[c + 67], K(X, o[c + 56] * o[c + 40], c + 63), Ke(r, X), p -= o[c + 60] * o[c + 40] * o[c + 68]) : 10 == e && (o[c + 40] = 0);
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
  b[n] = b[r];
  o[n] = o[r];
  b[n + 1] = b[r + 1];
  o[n + 1] = o[r + 1];
  o[b[f + 7] + 3 * b[c + 44] + 2] = p;
  a = d;
}

Vm.X = 1;

function Wm(c, f) {
  var d = a;
  a += 20;
  var e, g = d + 2, i, h = d + 4, j, k = d + 6, l, m, n = d + 8;
  m = d + 10;
  var p = d + 12, u = d + 14, r = d + 16, q = d + 18;
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
  C(n, d, h);
  n = J(v, n);
  v = c + 63;
  C(m, g, k);
  m = n + J(v, m);
  m += o[c + 65] * e - o[c + 67] * j + (o[c + 66] * i - o[c + 68] * l);
  m *= -o[c + 69];
  o[c + 40] += m;
  K(p, o[c + 53] * m, c + 61);
  Nb(d, p);
  e += o[c + 57] * m * o[c + 65];
  K(u, o[c + 54] * m, c + 63);
  Nb(g, u);
  i += o[c + 58] * m * o[c + 66];
  K(r, o[c + 55] * m, c + 61);
  Ke(h, r);
  j -= o[c + 59] * m * o[c + 67];
  K(q, o[c + 56] * m, c + 63);
  Ke(k, q);
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

Wm.X = 1;

function Xm(c) {
  var f, d, e, g;
  f = b[b[c + 12] + 2];
  d = b[b[c + 13] + 2];
  e = b[b[c + 18] + 14];
  g = b[b[c + 19] + 14];
  U(Ym, A(1, "i32", s));
  U(um, A([ f ], "i32", s));
  U(vm, A([ d ], "i32", s));
  U(wm, A([ b[c + 16] & 1 ], "i32", s));
  U(Zm, A([ e ], "i32", s));
  U($m, A([ g ], "i32", s));
  U(an, A([ o[c + 39] ], "double", s));
  U(Cm, A([ b[c + 14] ], "i32", s));
}

Xm.X = 1;

function bn(c, f) {
  var d = a;
  a += 70;
  var e, g, i = d + 2, h, j = d + 4, k, l = d + 6, m, n = d + 8, p = d + 10, u = d + 12, r = d + 14, q, v, x = d + 16, w = d + 18, y, z, B, E, D, H = d + 20, I = d + 22, M = d + 24, G = d + 26, R = d + 28, P = d + 30, L = d + 32, T = d + 34, F = d + 36, X = d + 38, Z = d + 40, V = d + 42, aa = d + 44, ja = d + 46, Y = d + 48, W = d + 50, $ = d + 52, ga = d + 54, la = d + 56, fa = d + 58, ka = d + 60, oa = d + 62, ua = d + 64, Da = d + 66, Ja = d + 68;
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
  Em(n, g);
  Em(p, h);
  Em(u, k);
  Em(r, m);
  D = 0;
  e = 1 == b[c + 20] ? 1 : 2;
  1 == e ? (cc(x), B = y = 1, D += o[c + 57] + o[c + 59], q = g - k - o[c + 36]) : 2 == e && (S(H, u, c + 32), C(M, c + 28, c + 49), S(I, u, M), C(R, c + 24, c + 45), S(G, n, R), b[x] = b[H], o[x] = o[H], b[x + 1] = b[H + 1], o[x + 1] = o[H + 1], B = Q(I, H), y = Q(G, H), D += o[c + 55] + o[c + 53] + o[c + 59] * B * B + o[c + 57] * y * y, C(P, c + 28, c + 49), C(F, d, j), N(T, G, F), Od(L, u, T), C(X, L, P), q = J(X, c + 32));
  e = 1 == b[c + 21] ? 4 : 5;
  4 == e ? (cc(w), z = o[c + 39], E = o[c + 39], D += o[c + 39] * o[c + 39] * (o[c + 58] + o[c + 60]), v = h - m - o[c + 37]) : 5 == e && (S(Z, r, c + 34), C(aa, c + 30, c + 51), S(V, r, aa), C(Y, c + 26, c + 47), S(ja, p, Y), K(W, o[c + 39], Z), b[w] = b[W], o[w] = o[W], b[w + 1] = b[W + 1], o[w + 1] = o[W + 1], E = o[c + 39] * Q(V, Z), z = o[c + 39] * Q(ja, Z), D += o[c + 39] * o[c + 39] * (o[c + 56] + o[c + 54]) + o[c + 60] * E * E + o[c + 58] * z * z, C($, c + 30, c + 51), C(fa, i, l), N(la, ja, fa), Od(ga, r, la), C(ka, ga, $), v = J(ka, c + 34));
  n = q + o[c + 39] * v - o[c + 38];
  p = 0;
  7 == (0 < D ? 7 : 8) && (p = -n / D);
  K(oa, o[c + 53] * p, x);
  Nb(d, oa);
  g += o[c + 57] * p * y;
  K(ua, o[c + 54] * p, w);
  Nb(i, ua);
  h += o[c + 58] * p * z;
  K(Da, o[c + 55] * p, x);
  Ke(j, Da);
  k -= o[c + 59] * p * B;
  K(Ja, o[c + 56] * p, w);
  Ke(l, Ja);
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

bn.X = 1;

function cm(c, f) {
  b[c] = cn + 2;
  1 == (b[f + 2] != b[f + 3] ? 2 : 1) && O(dn, 173, en, fn);
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

cm.X = 1;

function gn(c, f) {
  var d = a;
  a += 2;
  var e;
  cm(c, f);
  b[c] = hn + 2;
  e = Ri(f + 5) ? 2 : 1;
  1 == e && O(jn, 34, kn, ln);
  e = xi(o[f + 7]) ? 3 : 4;
  3 == e && (e = 0 <= o[f + 7] ? 5 : 4);
  4 == e && O(jn, 35, kn, mn);
  e = xi(o[f + 8]) ? 6 : 7;
  6 == e && (e = 0 <= o[f + 8] ? 8 : 7);
  7 == e && O(jn, 36, kn, nn);
  e = xi(o[f + 9]) ? 9 : 10;
  9 == e && (e = 0 <= o[f + 9] ? 11 : 10);
  10 == e && O(jn, 37, kn, on);
  e = c + 20;
  var g = f + 5;
  b[e] = b[g];
  o[e] = o[g];
  b[e + 1] = b[g + 1];
  o[e + 1] = o[g + 1];
  e = c + 18;
  Tc(d, b[c + 13] + 3, c + 20);
  b[e] = b[d];
  o[e] = o[d];
  b[e + 1] = b[d + 1];
  o[e + 1] = o[d + 1];
  o[c + 27] = o[f + 7];
  cc(c + 25);
  o[c + 22] = o[f + 8];
  o[c + 23] = o[f + 9];
  o[c + 24] = 0;
  o[c + 28] = 0;
  a = d;
}

gn.X = 1;

function pn(c, f) {
  var d = a;
  a += 24;
  var e, g = d + 2, i, h = d + 4, j, k, l = d + 6, m = d + 8, n = d + 10, p = d + 14, u = d + 18, r = d + 20, q = d + 22;
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
  Em(h, e);
  j = o[b[c + 13] + 29];
  k = 6.2831854820251465 * o[c + 22];
  e = 2 * j * o[c + 23] * k;
  j = j * k * k;
  k = o[f];
  1 == (1.1920928955078125e-7 < e + k * j ? 2 : 1) && O(jn, 125, qn, rn);
  o[c + 28] = k * (e + k * j);
  e = 0 != o[c + 28] ? 3 : 4;
  3 == e && (o[c + 28] = 1 / o[c + 28]);
  o[c + 24] = k * j * o[c + 28];
  e = c + 31;
  C(m, c + 18, c + 33);
  S(l, h, m);
  b[e] = b[l];
  o[e] = o[l];
  b[e + 1] = b[l + 1];
  o[e + 1] = o[l + 1];
  o[n] = o[c + 35] + o[c + 36] * o[c + 32] * o[c + 32] + o[c + 28];
  o[n + 1] = -o[c + 36] * o[c + 31] * o[c + 32];
  o[n + 2] = o[n + 1];
  o[n + 3] = o[c + 35] + o[c + 36] * o[c + 31] * o[c + 31] + o[c + 28];
  h = c + 37;
  Pl(p, n);
  b[h] = b[p];
  o[h] = o[p];
  b[h + 1] = b[p + 1];
  o[h + 1] = o[p + 1];
  b[h + 2] = b[p + 2];
  o[h + 2] = o[p + 2];
  b[h + 3] = b[p + 3];
  o[h + 3] = o[p + 3];
  n = c + 41;
  N(r, d, c + 31);
  C(u, r, c + 20);
  b[n] = b[u];
  o[n] = o[u];
  b[n + 1] = b[u + 1];
  o[n + 1] = o[u + 1];
  Vh(c + 41, o[c + 24]);
  i *= .9800000190734863;
  u = c + 25;
  e = b[f + 5] & 1 ? 5 : 6;
  5 == e ? (Vh(u, o[f + 2]), K(q, o[c + 35], c + 25), Nb(g, q), i += o[c + 36] * Q(c + 31, c + 25)) : 6 == e && cc(u);
  q = b[f + 7] + 3 * b[c + 30];
  b[q] = b[g];
  o[q] = o[g];
  b[q + 1] = b[g + 1];
  o[q + 1] = o[g + 1];
  o[b[f + 7] + 3 * b[c + 30] + 2] = i;
  a = d;
}

pn.X = 1;

function sn(c, f) {
  var d = a;
  a += 22;
  var e, g = d + 2, i = d + 4, h = d + 6, j = d + 8, k = d + 10, l = d + 12, m = d + 14, n = d + 16, p = d + 18, u = d + 20;
  e = b[f + 7] + 3 * b[c + 30];
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  e = o[b[f + 7] + 3 * b[c + 30] + 2];
  Ce(i, e, c + 31);
  N(g, d, i);
  i = c + 37;
  N(k, g, c + 41);
  K(l, o[c + 28], c + 25);
  N(m, k, l);
  Pd(j, m);
  Ql(h, i, j);
  g = c + 25;
  b[n] = b[g];
  o[n] = o[g];
  b[n + 1] = b[g + 1];
  o[n + 1] = o[g + 1];
  Nb(c + 25, h);
  g = o[f] * o[c + 27];
  if (1 == (ve(c + 25) > g * g ? 1 : 2)) j = c + 25, k = Yc(c + 25), Vh(j, g / k);
  C(p, c + 25, n);
  b[h] = b[p];
  o[h] = o[p];
  b[h + 1] = b[p + 1];
  o[h + 1] = o[p + 1];
  K(u, o[c + 35], h);
  Nb(d, u);
  e += o[c + 36] * Q(c + 31, h);
  h = b[f + 7] + 3 * b[c + 30];
  b[h] = b[d];
  o[h] = o[d];
  b[h + 1] = b[d + 1];
  o[h + 1] = o[d + 1];
  o[b[f + 7] + 3 * b[c + 30] + 2] = e;
  a = d;
}

sn.X = 1;

function tn(c) {
  o[c] = 0;
  o[c + 1] = 0;
  o[c + 2] = 0;
}

function un(c, f, d, e) {
  o[c] = f;
  o[c + 1] = d;
  o[c + 2] = e;
}

function vn(c, f) {
  o[c] *= f;
  o[c + 1] *= f;
  o[c + 2] *= f;
}

function wn(c, f) {
  var d = a;
  a += 2;
  cm(c, f);
  b[c] = xn + 2;
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
  Xc(c + 22);
  e = c + 24;
  Ce(d, 1, c + 22);
  b[e] = b[d];
  o[e] = o[d];
  b[e + 1] = b[d + 1];
  o[e + 1] = o[d + 1];
  o[c + 26] = o[f + 11];
  tn(c + 27);
  o[c + 65] = 0;
  o[c + 30] = 0;
  o[c + 31] = o[f + 13];
  o[c + 32] = o[f + 14];
  o[c + 33] = o[f + 16];
  o[c + 34] = o[f + 17];
  b[c + 35] = b[f + 12] & 1;
  b[c + 36] = b[f + 15] & 1;
  b[c + 37] = 0;
  cc(c + 48);
  cc(c + 50);
  a = d;
}

wn.X = 1;

function yn(c, f) {
  var d = a;
  a += 44;
  var e, g, i = d + 2, h, j = d + 4, k, l = d + 6, m, n = d + 8, p = d + 10, u = d + 12, r = d + 14, q = d + 16, v = d + 18, x = d + 20, w = d + 22, y = d + 24;
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
  Em(n, g);
  Em(p, k);
  C(r, c + 18, c + 40);
  S(u, n, r);
  C(v, c + 20, c + 42);
  S(q, p, v);
  C(y, j, d);
  N(w, y, q);
  C(x, w, u);
  j = o[c + 44];
  p = o[c + 45];
  r = o[c + 46];
  v = o[c + 47];
  w = c + 48;
  S(e, n, c + 22);
  b[w] = b[e];
  o[w] = o[e];
  b[w + 1] = b[e + 1];
  o[w + 1] = o[e + 1];
  N(z, x, u);
  o[c + 54] = Q(z, c + 48);
  o[c + 55] = Q(q, c + 48);
  o[c + 65] = j + p + r * o[c + 54] * o[c + 54] + v * o[c + 55] * o[c + 55];
  e = 0 < o[c + 65] ? 1 : 2;
  1 == e && (o[c + 65] = 1 / o[c + 65]);
  e = c + 50;
  S(B, n, c + 24);
  b[e] = b[B];
  o[e] = o[B];
  b[e + 1] = b[B + 1];
  o[e + 1] = o[B + 1];
  N(E, x, u);
  o[c + 52] = Q(E, c + 50);
  o[c + 53] = Q(q, c + 50);
  n = j + p + r * o[c + 52] * o[c + 52] + v * o[c + 53] * o[c + 53];
  u = r * o[c + 52] + v * o[c + 53];
  q = r * o[c + 52] * o[c + 54] + v * o[c + 53] * o[c + 55];
  B = r + v;
  3 == (0 == r + v ? 3 : 4) && (B = 1);
  E = r * o[c + 54] + v * o[c + 55];
  e = j + p + r * o[c + 54] * o[c + 54] + v * o[c + 55] * o[c + 55];
  un(c + 56, n, u, q);
  un(c + 59, u, B, E);
  un(c + 62, q, E, e);
  e = b[c + 35] & 1 ? 5 : 14;
  a : do if (5 == e) if (n = J(c + 48, x), e = .009999999776482582 > ke(o[c + 32] - o[c + 31]) ? 6 : 7, 6 == e) b[c + 37] = 3; else {
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
  18 == e ? (vn(x, o[f + 2]), o[c + 30] *= o[f + 2], K(H, o[c + 27], c + 50), K(I, o[c + 30] + o[c + 29], c + 48), N(D, H, I), H = o[c + 27] * o[c + 52] + o[c + 28] + (o[c + 30] + o[c + 29]) * o[c + 54], I = o[c + 27] * o[c + 53] + o[c + 28] + (o[c + 30] + o[c + 29]) * o[c + 55], K(M, j, D), Ke(i, M), h -= r * H, K(G, p, D), Nb(l, G), m += v * I) : 19 == e && (tn(x), o[c + 30] = 0);
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

yn.X = 1;

function zn(c, f) {
  un(c, -o[f], -o[f + 1], -o[f + 2]);
}

function An(c, f) {
  o[c] += o[f];
  o[c + 1] += o[f + 1];
  o[c + 2] += o[f + 2];
}

function Bn(c, f, d) {
  oc(c, o[f] * o[d] + o[f + 3] * o[d + 1], o[f + 1] * o[d] + o[f + 4] * o[d + 1]);
}

function Cn(c, f) {
  var d = a;
  a += 73;
  var e, g, i = d + 2, h, j, k, l, m, n;
  n = d + 4;
  var p, u = d + 6, r = d + 8, q = d + 10, v = d + 12, x = d + 14, w;
  w = d + 16;
  var y = d + 18, z = d + 21, B = d + 24, E = d + 27, D = d + 30, H = d + 32, I = d + 34, M = d + 36, G = d + 38, R = d + 40, P = d + 42, L = d + 44, T = d + 47, F = d + 49, X = d + 51, Z = d + 53, V = d + 55, aa = d + 57, ja = d + 59, Y = d + 61, W = d + 63, $ = d + 65, ga = d + 67, la = d + 69, fa = d + 71;
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
  1 == e && 3 != b[c + 37] && (e = c + 48, C(n, i, d), n = J(e, n) + o[c + 55] * h - o[c + 54] * g, n = o[c + 65] * (o[c + 34] - n), e = o[c + 30], p = o[f] * o[c + 33], o[c + 30] = $j(o[c + 30] + n, -p, p), n = o[c + 30] - e, K(u, n, c + 48), e = n * o[c + 54], n *= o[c + 55], K(r, j, u), Ke(d, r), g -= l * e, K(q, k, u), Nb(i, q), h += m * n);
  u = c + 50;
  C(x, i, d);
  o[v] = J(u, x) + o[c + 53] * h - o[c + 52] * g;
  o[v + 1] = h - g;
  e = b[c + 35] & 1 ? 4 : 10;
  4 == e && (0 == b[c + 37] ? e = 10 : (x = c + 48, C(w, i, d), w = J(x, w) + o[c + 55] * h - o[c + 54] * g, qi(y, o[v], o[v + 1], w), w = c + 27, b[z] = b[w], o[z] = o[w], b[z + 1] = b[w + 1], o[z + 1] = o[w + 1], b[z + 2] = b[w + 2], o[z + 2] = o[w + 2], w = c + 56, zn(E, y), vi(B, w, E), An(c + 27, B), e = 1 == b[c + 37] ? 6 : 7, 6 == e ? o[c + 29] = 0 < o[c + 29] ? o[c + 29] : 0 : 7 == e && (2 != b[c + 37] || (o[c + 29] = 0 > o[c + 29] ? o[c + 29] : 0)), Pd(H, v), y = o[c + 29] - o[z + 2], oc(M, o[c + 62], o[c + 63]), K(I, y, M), C(D, H, I), ri(R, c + 56, D), oc(P, o[z], o[z + 1]), N(G, R, P), o[c + 27] = o[G], o[c + 28] = o[G + 1], D = c + 27, qi(L, o[D] - o[z], o[D + 1] - o[z + 1], o[D + 2] - o[z + 2]), b[B] = b[L], o[B] = o[L], b[B + 1] = b[L + 1], o[B + 1] = o[L + 1], b[B + 2] = b[L + 2], o[B + 2] = o[L + 2], K(F, o[B], c + 50), K(X, o[B + 2], c + 48), N(T, F, X), z = o[B] * o[c + 52] + o[B + 1] + o[B + 2] * o[c + 54], B = o[B] * o[c + 53] + o[B + 1] + o[B + 2] * o[c + 55], K(Z, j, T), Ke(d, Z), g -= l * z, K(V, k, T), Nb(i, V), h += m * B, e = 13));
  a : do if (10 == e) {
    T = c + 56;
    Pd(ja, v);
    ri(aa, T, ja);
    o[c + 27] += o[aa];
    o[c + 28] += o[aa + 1];
    K(Y, o[aa], c + 50);
    T = o[aa] * o[c + 52] + o[aa + 1];
    Z = o[aa] * o[c + 53] + o[aa + 1];
    K(W, j, Y);
    Ke(d, W);
    g -= l * T;
    K($, k, Y);
    Nb(i, $);
    h += m * Z;
    T = ga;
    Z = v;
    b[T] = b[Z];
    o[T] = o[Z];
    b[T + 1] = b[Z + 1];
    o[T + 1] = o[Z + 1];
    T = c + 50;
    C(la, i, d);
    o[v] = J(T, la) + o[c + 53] * h - o[c + 52] * g;
    o[v + 1] = h - g;
    e = .009999999776482582 < ke(o[v]) ? 12 : 11;
    if (11 == e && .009999999776482582 >= ke(o[v + 1])) break a;
    Bn(fa, c + 56, aa);
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

Cn.X = 1;

function Dn(c, f, d) {
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

Dn.X = 1;

function En(c, f) {
  var d = a;
  a += 71;
  var e, g, i = d + 2, h, j = d + 4, k = d + 6, l, m, n, p, u = d + 8, r = d + 10, q = d + 12, v = d + 14, x = d + 16;
  e = d + 18;
  var w = d + 20, y = d + 22, z = d + 24, B = d + 26, E = d + 28, D = d + 30, H = d + 33, I, M, G, R = d + 35, P = d + 44, L = d + 47, T = d + 50;
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
  Em(j, g);
  Em(k, h);
  l = o[c + 44];
  m = o[c + 45];
  n = o[c + 46];
  p = o[c + 47];
  C(r, c + 18, c + 40);
  S(u, j, r);
  C(v, c + 20, c + 42);
  S(q, k, v);
  N(w, i, q);
  C(e, w, d);
  C(x, e, u);
  S(y, j, c + 22);
  N(z, x, u);
  r = Q(z, y);
  k = Q(q, y);
  S(B, j, c + 24);
  N(E, x, u);
  u = Q(E, B);
  E = Q(q, B);
  o[H] = J(B, x);
  o[H + 1] = h - g - o[c + 26];
  q = ke(o[H]);
  j = ke(o[H + 1]);
  v = w = 0;
  e = b[c + 35] & 1 ? 1 : 7;
  a : do if (1 == e) {
    var ja = z = J(y, x);
    e = .009999999776482582 > ke(o[c + 32] - o[c + 31]) ? 2 : 3;
    if (2 == e) v = $j(ja, -.20000000298023224, .20000000298023224), q = q > ke(z) ? q : ke(z), w = 1; else if (3 == e) {
      var Y = z;
      e = ja <= o[c + 31] ? 4 : 5;
      if (4 == e) v = $j(Y - o[c + 31] + .004999999888241291, -.20000000298023224, 0), q = q > o[c + 31] - z ? q : o[c + 31] - z, w = 1; else if (5 == e) {
        if (!(Y >= o[c + 32])) break a;
        v = $j(z - o[c + 32] - .004999999888241291, 0, .20000000298023224);
        q = q > z - o[c + 32] ? q : z - o[c + 32];
        w = 1;
      }
    }
  } while (0);
  x = l + m + n * u * u + p * E * E;
  e = w & 1 ? 8 : 11;
  8 == e ? (I = n * u + p * E, M = n * u * r + p * E * k, G = n + p, 9 == (0 == G ? 9 : 10) && (G = 1), e = n * r + p * k, w = l + m + n * r * r + p * k * k, un(R, x, I, M), un(R + 3, I, G, e), un(R + 6, M, e, w), o[P] = o[H], o[P + 1] = o[H + 1], o[P + 2] = v, zn(T, P), vi(L, R, T), b[D] = b[L], o[D] = o[L], b[D + 1] = b[L + 1], o[D + 1] = o[L + 1], b[D + 2] = b[L + 2], o[D + 2] = o[L + 2]) : 11 == e && (R = n * u + p * E, P = n + p, 12 == (0 == P ? 12 : 13) && (P = 1), nc(I, x, R), nc(I + 2, R, P), Pd(G, H), Dn(M, I, G), o[D] = o[M], o[D + 1] = o[M + 1], o[D + 2] = 0);
  K(X, o[D], B);
  K(Z, o[D + 2], y);
  N(F, X, Z);
  y = o[D] * u + o[D + 1] + o[D + 2] * r;
  D = o[D] * E + o[D + 1] + o[D + 2] * k;
  K(V, l, F);
  Ke(d, V);
  g -= n * y;
  K(aa, m, F);
  Nb(i, aa);
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

En.X = 1;

function Fn(c) {
  var f, d;
  f = b[b[c + 12] + 2];
  d = b[b[c + 13] + 2];
  U(Gn, A(1, "i32", s));
  U(um, A([ f ], "i32", s));
  U(vm, A([ d ], "i32", s));
  U(wm, A([ b[c + 16] & 1 ], "i32", s));
  U(xm, A([ o[c + 18], o[c + 19] ], "double", s));
  U(ym, A([ o[c + 20], o[c + 21] ], "double", s));
  U(Hn, A([ o[c + 22], o[c + 23] ], "double", s));
  U(In, A([ o[c + 26] ], "double", s));
  U(Jn, A([ b[c + 35] & 1 ], "i32", s));
  U(Kn, A([ o[c + 31] ], "double", s));
  U(Ln, A([ o[c + 32] ], "double", s));
  U(Mn, A([ b[c + 36] & 1 ], "i32", s));
  U(Nn, A([ o[c + 34] ], "double", s));
  U(On, A([ o[c + 33] ], "double", s));
  U(Cm, A([ b[c + 14] ], "i32", s));
}

Fn.X = 1;

function Pn(c, f) {
  cm(c, f);
  b[c] = Qn + 2;
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
  1 == (0 != o[f + 15] ? 2 : 1) && O(Rn, 65, Sn, Tn);
  o[c + 29] = o[f + 15];
  o[c + 28] = o[f + 13] + o[c + 29] * o[f + 14];
  o[c + 30] = 0;
}

Pn.X = 1;

function Un(c, f) {
  var d = a;
  a += 36;
  var e, g, i = d + 2, h;
  e = d + 4;
  var j, k = d + 6, l, m = d + 8, n = d + 10, p = d + 12, u = d + 14, r = d + 16, q = d + 18, v = d + 20, x = d + 22, w = d + 24, y = d + 26, z = d + 28, B = d + 30, E = d + 32, D = d + 34;
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
  Em(m, g);
  Em(n, j);
  g = c + 37;
  C(u, c + 24, c + 41);
  S(p, m, u);
  b[g] = b[p];
  o[g] = o[p];
  b[g + 1] = b[p + 1];
  o[g + 1] = o[p + 1];
  m = c + 39;
  C(q, c + 26, c + 43);
  S(r, n, q);
  b[m] = b[r];
  o[m] = o[r];
  b[m + 1] = b[r + 1];
  o[m + 1] = o[r + 1];
  n = c + 33;
  N(x, d, c + 37);
  C(v, x, c + 18);
  b[n] = b[v];
  o[n] = o[v];
  b[n + 1] = b[v + 1];
  o[n + 1] = o[v + 1];
  v = c + 35;
  N(y, e, c + 39);
  C(w, y, c + 20);
  b[v] = b[w];
  o[v] = o[w];
  b[v + 1] = b[w + 1];
  o[v + 1] = o[w + 1];
  w = Yc(c + 33);
  y = Yc(c + 35);
  e = .04999999701976776 < w ? 1 : 2;
  1 == e ? Vh(c + 33, 1 / w) : 2 == e && cc(c + 33);
  e = .04999999701976776 < y ? 4 : 5;
  4 == e ? Vh(c + 35, 1 / y) : 5 == e && cc(c + 35);
  e = Q(c + 37, c + 33);
  w = Q(c + 39, c + 35);
  o[c + 49] = o[c + 45] + o[c + 47] * e * e + o[c + 29] * o[c + 29] * (o[c + 46] + o[c + 48] * w * w);
  e = 0 < o[c + 49] ? 7 : 8;
  7 == e && (o[c + 49] = 1 / o[c + 49]);
  e = b[f + 5] & 1 ? 9 : 10;
  9 == e ? (o[c + 30] *= o[f + 2], K(z, -o[c + 30], c + 33), K(B, -o[c + 29] * o[c + 30], c + 35), K(E, o[c + 45], z), Nb(i, E), h += o[c + 47] * Q(c + 37, z), K(D, o[c + 46], B), Nb(k, D), l += o[c + 48] * Q(c + 39, B)) : 10 == e && (o[c + 30] = 0);
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

Un.X = 1;

function Vn(c, f) {
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
  Ce(j, e, c + 37);
  N(h, d, j);
  Ce(l, i, c + 39);
  N(k, g, l);
  h = -o[c + 49] * (-J(c + 33, h) - o[c + 29] * J(c + 35, k));
  o[c + 30] += h;
  K(m, -h, c + 33);
  K(n, -o[c + 29] * h, c + 35);
  K(p, o[c + 45], m);
  Nb(d, p);
  e += o[c + 47] * Q(c + 37, m);
  K(u, o[c + 46], n);
  Nb(g, u);
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

Vn.X = 1;

function Wn(c) {
  var f, d;
  f = b[b[c + 12] + 2];
  d = b[b[c + 13] + 2];
  U(Xn, A(1, "i32", s));
  U(um, A([ f ], "i32", s));
  U(vm, A([ d ], "i32", s));
  U(wm, A([ b[c + 16] & 1 ], "i32", s));
  U(Yn, A([ o[c + 18], o[c + 19] ], "double", s));
  U(Zn, A([ o[c + 20], o[c + 21] ], "double", s));
  U(xm, A([ o[c + 24], o[c + 25] ], "double", s));
  U(ym, A([ o[c + 26], o[c + 27] ], "double", s));
  U($n, A([ o[c + 22] ], "double", s));
  U(ao, A([ o[c + 23] ], "double", s));
  U(an, A([ o[c + 29] ], "double", s));
  U(Cm, A([ b[c + 14] ], "i32", s));
}

Wn.X = 1;

function bo(c, f) {
  cm(c, f);
  b[c] = co + 2;
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
  tn(c + 22);
  o[c + 25] = 0;
  o[c + 31] = o[f + 11];
  o[c + 32] = o[f + 12];
  o[c + 27] = o[f + 15];
  o[c + 28] = o[f + 14];
  b[c + 29] = b[f + 10] & 1;
  b[c + 26] = b[f + 13] & 1;
  b[c + 57] = 0;
}

bo.X = 1;

function eo(c, f) {
  var d = a;
  a += 32;
  var e, g, i = d + 2, h, j = d + 4, k = d + 6, l = d + 8, m = d + 10, n = d + 12;
  e = d + 14;
  var p = d + 16, u = d + 18, r = d + 20, q = d + 22, v = d + 24, x = d + 26, w = d + 28, y = d + 30;
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
  Em(j, g);
  Em(k, h);
  C(m, c + 24, c + 41);
  S(l, j, m);
  C(e, c + 26, c + 43);
  S(n, k, e);
  N(u, d, l);
  C(p, u, c + 18);
  N(q, i, n);
  C(r, q, c + 20);
  j = Yc(p);
  k = Yc(r);
  e = .04999999701976776 < j ? 1 : 2;
  1 == e ? Vh(p, 1 / j) : 2 == e && cc(p);
  e = .04999999701976776 < k ? 4 : 5;
  4 == e ? Vh(r, 1 / k) : 5 == e && cc(r);
  e = Q(l, p);
  m = Q(n, r);
  e = o[c + 45] + o[c + 47] * e * e;
  u = o[c + 46] + o[c + 48] * m * m;
  m = e + o[c + 29] * o[c + 29] * u;
  e = 0 < e + o[c + 29] * o[c + 29] * u ? 7 : 8;
  7 == e && (m = 1 / m);
  k = o[c + 28] - j - o[c + 29] * k;
  j = ke(k);
  k *= -m;
  K(v, -k, p);
  K(x, -o[c + 29] * k, r);
  K(w, o[c + 45], v);
  Nb(d, w);
  g += o[c + 47] * Q(l, v);
  K(y, o[c + 46], x);
  Nb(i, y);
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

eo.X = 1;

function fo(c, f) {
  var d = a;
  a += 26;
  var e, g, i = d + 2, h, j = d + 4, k, l = d + 6, m = d + 8;
  e = d + 10;
  var n = d + 12, p = d + 14, u = d + 16, r = d + 18, q, v = d + 20, x = d + 22, w = d + 24;
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
  Em(m, g);
  Em(e, k);
  q = c + 35;
  C(p, c + 18, c + 39);
  S(n, m, p);
  b[q] = b[n];
  o[q] = o[n];
  b[q + 1] = b[n + 1];
  o[q + 1] = o[n + 1];
  m = c + 37;
  C(r, c + 20, c + 41);
  S(u, e, r);
  b[m] = b[u];
  o[m] = o[u];
  b[m + 1] = b[u + 1];
  o[m + 1] = o[u + 1];
  u = o[c + 43];
  r = o[c + 44];
  m = o[c + 45];
  n = o[c + 46];
  p = 0 == m + n;
  o[c + 47] = u + r + o[c + 36] * o[c + 36] * m + o[c + 38] * o[c + 38] * n;
  o[c + 50] = -o[c + 36] * o[c + 35] * m - o[c + 38] * o[c + 37] * n;
  o[c + 53] = -o[c + 36] * m - o[c + 38] * n;
  o[c + 48] = o[c + 50];
  o[c + 51] = u + r + o[c + 35] * o[c + 35] * m + o[c + 37] * o[c + 37] * n;
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
  a : do if (6 == e) if (0 != (p & 1)) e = 18; else if (q = k - g - o[c + 30], e = .06981317698955536 > ke(o[c + 32] - o[c + 31]) ? 8 : 9, 8 == e) {
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
  20 == e ? (vn(g, o[f + 2]), o[c + 25] *= o[f + 2], oc(v, o[c + 22], o[c + 23]), K(x, u, v), Ke(i, x), h -= m * (Q(c + 35, v) + o[c + 25] + o[c + 24]), K(w, r, v), Nb(l, w), j += n * (Q(c + 37, v) + o[c + 25] + o[c + 24])) : 21 == e && (tn(g), o[c + 25] = 0);
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

fo.X = 1;

function go(c, f) {
  var d = a;
  a += 67;
  var e, g, i = d + 2, h, j, k, l, m, n, p, u, r = d + 4, q = d + 6, v = d + 8, x = d + 10, w = d + 12, y = d + 14, z = d + 17, B = d + 20, E = d + 23, D = d + 25, H = d + 27, I = d + 29, M = d + 31, G = d + 33, R = d + 35, P = d + 37, L = d + 39, T = d + 41, F = d + 43, X = d + 45, Z = d + 47, V = d + 49, aa = d + 51, ja = d + 53, Y = d + 55, W = d + 57, $ = d + 59, ga = d + 61, la = d + 63, fa = d + 65;
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
  1 == e && 3 != b[c + 57] && 0 == (n & 1) && (e = h - g - o[c + 28], e *= -o[c + 56], p = o[c + 25], u = o[f] * o[c + 27], o[c + 25] = $j(o[c + 25] + e, -u, u), e = o[c + 25] - p, g -= l * e, h += m * e);
  e = b[c + 29] & 1 ? 5 : 18;
  do if (5 == e) if (0 == b[c + 57]) e = 18; else if (0 != (n & 1)) e = 18; else {
    Ce(x, h, c + 37);
    N(v, i, x);
    C(q, v, d);
    Ce(w, g, c + 35);
    C(r, q, w);
    e = h - g;
    qi(y, o[r], o[r + 1], e);
    vi(B, c + 47, y);
    zn(z, B);
    e = 3 == b[c + 57] ? 8 : 9;
    a : do if (8 == e) An(c + 22, z); else if (9 == e) if (e = 1 == b[c + 57] ? 10 : 13, 10 == e) e = o[c + 24] + o[z + 2], e = 0 > e ? 11 : 12, 11 == e ? (Pd(D, r), p = o[c + 24], oc(I, o[c + 53], o[c + 54]), K(H, p, I), N(E, D, H), ri(M, c + 47, E), o[z] = o[M], o[z + 1] = o[M + 1], o[z + 2] = -o[c + 24], o[c + 22] += o[M], o[c + 23] += o[M + 1], o[c + 24] = 0) : 12 == e && An(c + 22, z); else if (13 == e) {
      if (2 != b[c + 57]) break a;
      e = o[c + 24] + o[z + 2];
      e = 0 < e ? 15 : 16;
      15 == e ? (Pd(R, r), p = o[c + 24], oc(L, o[c + 53], o[c + 54]), K(P, p, L), N(G, R, P), ri(T, c + 47, G), o[z] = o[T], o[z + 1] = o[T + 1], o[z + 2] = -o[c + 24], o[c + 22] += o[T], o[c + 23] += o[T + 1], o[c + 24] = 0) : 16 == e && An(c + 22, z);
    } while (0);
    oc(F, o[z], o[z + 1]);
    K(X, j, F);
    Ke(d, X);
    g -= l * (Q(c + 35, F) + o[z + 2]);
    K(Z, k, F);
    Nb(i, Z);
    h += m * (Q(c + 37, F) + o[z + 2]);
    e = 19;
  } while (0);
  18 == e && (Ce(Y, h, c + 37), N(ja, i, Y), C(aa, ja, d), Ce(W, g, c + 35), C(V, aa, W), r = c + 47, Pd(ga, V), ri($, r, ga), o[c + 22] += o[$], o[c + 23] += o[$ + 1], K(la, j, $), Ke(d, la), g -= l * Q(c + 35, $), K(fa, k, $), Nb(i, fa), h += m * Q(c + 37, $));
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

go.X = 1;

function ho(c, f) {
  var d = a;
  a += 34;
  var e, g, i = d + 2, h, j = d + 4, k = d + 6, l, m, n, p, u = d + 8, r = d + 10, q = d + 12, v = d + 14, x = d + 16, w = d + 18, y = d + 20, z = d + 22, B = d + 26, E = d + 28, D = d + 30, H = d + 32;
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
  Em(j, g);
  Em(k, h);
  l = 0;
  m = 0 == o[c + 45] + o[c + 46];
  e = b[c + 29] & 1 ? 1 : 10;
  do if (1 == e) if (0 == b[c + 57]) e = 10; else if (0 != (m & 1)) e = 10; else {
    n = h - g - o[c + 30];
    p = 0;
    e = 3 == b[c + 57] ? 4 : 5;
    a : do if (4 == e) l = $j(n - o[c + 31], -.13962635397911072, .13962635397911072), p = -o[c + 56] * l, l = ke(l); else if (5 == e) if (e = 1 == b[c + 57] ? 6 : 7, 6 == e) p = n - o[c + 31], l = -p, p = $j(p + .03490658849477768, -.13962635397911072, 0), p *= -o[c + 56]; else if (7 == e) {
      if (2 != b[c + 57]) {
        e = 9;
        break a;
      }
      l = p = n - o[c + 32];
      p = $j(p - .03490658849477768, 0, .13962635397911072);
      p *= -o[c + 56];
    } while (0);
    g -= o[c + 45] * p;
    h += o[c + 46] * p;
  } while (0);
  ch(j, g);
  ch(k, h);
  C(r, c + 18, c + 39);
  S(u, j, r);
  C(v, c + 20, c + 41);
  S(q, k, v);
  N(y, i, q);
  C(w, y, d);
  C(x, w, u);
  j = Yc(x);
  k = o[c + 43];
  r = o[c + 44];
  v = o[c + 45];
  w = o[c + 46];
  o[z] = k + r + v * o[u + 1] * o[u + 1] + w * o[q + 1] * o[q + 1];
  o[z + 1] = -v * o[u] * o[u + 1] - w * o[q] * o[q + 1];
  o[z + 2] = o[z + 1];
  o[z + 3] = k + r + v * o[u] * o[u] + w * o[q] * o[q];
  Dn(E, z, x);
  Pd(B, E);
  K(D, k, B);
  Ke(d, D);
  g -= v * Q(u, B);
  K(H, r, B);
  Nb(i, H);
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

ho.X = 1;

function io(c) {
  var f, d;
  f = b[b[c + 12] + 2];
  d = b[b[c + 13] + 2];
  U(jo, A(1, "i32", s));
  U(um, A([ f ], "i32", s));
  U(vm, A([ d ], "i32", s));
  U(wm, A([ b[c + 16] & 1 ], "i32", s));
  U(xm, A([ o[c + 18], o[c + 19] ], "double", s));
  U(ym, A([ o[c + 20], o[c + 21] ], "double", s));
  U(In, A([ o[c + 30] ], "double", s));
  U(Jn, A([ b[c + 29] & 1 ], "i32", s));
  U(ko, A([ o[c + 31] ], "double", s));
  U(lo, A([ o[c + 32] ], "double", s));
  U(Mn, A([ b[c + 26] & 1 ], "i32", s));
  U(Nn, A([ o[c + 28] ], "double", s));
  U(mo, A([ o[c + 27] ], "double", s));
  U(Cm, A([ b[c + 14] ], "i32", s));
}

io.X = 1;

function no(c, f) {
  cm(c, f);
  b[c] = oo + 2;
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

no.X = 1;

function po(c, f) {
  var d = a;
  a += 32;
  var e, g, i = d + 2, h;
  e = d + 4;
  var j, k = d + 6, l, m = d + 8, n = d + 10, p = d + 12, u = d + 14, r = d + 16, q = d + 18, v = d + 20, x = d + 22, w = d + 24, y = d + 26, z = d + 28, B = d + 30;
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
  Em(m, g);
  Em(n, j);
  g = c + 29;
  C(u, c + 18, c + 33);
  S(p, m, u);
  b[g] = b[p];
  o[g] = o[p];
  b[g + 1] = b[p + 1];
  o[g + 1] = o[p + 1];
  m = c + 31;
  C(q, c + 20, c + 35);
  S(r, n, q);
  b[m] = b[r];
  o[m] = o[r];
  b[m + 1] = b[r + 1];
  o[m + 1] = o[r + 1];
  n = c + 27;
  N(w, e, c + 31);
  C(x, w, d);
  C(v, x, c + 29);
  b[n] = b[v];
  o[n] = o[v];
  b[n + 1] = b[v + 1];
  o[n + 1] = o[v + 1];
  e = Yc(c + 27);
  o[c + 23] = e;
  e = 0 < o[c + 23] - o[c + 22] ? 1 : 2;
  1 == e ? b[c + 42] = 2 : 2 == e && (b[c + 42] = 0);
  v = c + 27;
  e = .004999999888241291 < o[c + 23] ? 4 : 5;
  if (4 == e) {
    Vh(v, 1 / o[c + 23]);
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
    8 == e ? (o[c + 24] *= o[f + 2], K(y, o[c + 24], c + 27), K(z, o[c + 37], y), Ke(i, z), h -= o[c + 39] * Q(c + 29, y), K(B, o[c + 38], y), Nb(k, B), l += o[c + 40] * Q(c + 31, y)) : 9 == e && (o[c + 24] = 0);
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
  } else 5 == e && (cc(v), o[c + 41] = 0, o[c + 24] = 0);
  a = d;
}

po.X = 1;

function qo(c, f) {
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
  Ce(j, e, c + 29);
  N(h, d, j);
  Ce(l, i, c + 31);
  N(k, g, l);
  j = o[c + 23] - o[c + 22];
  l = c + 27;
  C(m, k, h);
  h = J(l, m);
  if (1 == (0 > j ? 1 : 2)) h += o[f + 1] * j;
  h *= -o[c + 41];
  k = o[c + 24];
  o[c + 24] = 0 < o[c + 24] + h ? 0 : o[c + 24] + h;
  h = o[c + 24] - k;
  K(n, h, c + 27);
  K(p, o[c + 37], n);
  Ke(d, p);
  e -= o[c + 39] * Q(c + 29, n);
  K(u, o[c + 38], n);
  Nb(g, u);
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

qo.X = 1;

function ro(c) {
  var f, d;
  f = b[b[c + 12] + 2];
  d = b[b[c + 13] + 2];
  U(so, A(1, "i32", s));
  U(um, A([ f ], "i32", s));
  U(vm, A([ d ], "i32", s));
  U(wm, A([ b[c + 16] & 1 ], "i32", s));
  U(xm, A([ o[c + 18], o[c + 19] ], "double", s));
  U(ym, A([ o[c + 20], o[c + 21] ], "double", s));
  U(to, A([ o[c + 22] ], "double", s));
  U(Cm, A([ b[c + 14] ], "i32", s));
}

ro.X = 1;

function uo(c, f) {
  cm(c, f);
  b[c] = vo + 2;
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
  tn(c + 27);
}

uo.X = 1;

function wo(c, f) {
  var d = a;
  a += 28;
  var e, g = d + 2, i, h = d + 4, j = d + 6, k = d + 8, l = d + 10, m = d + 12, n = d + 14, p = d + 16, u = d + 18, r = d + 20, q = d + 22, v = d + 24, x = d + 26;
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
  Em(h, e);
  Em(j, i);
  C(l, c + 18, c + 33);
  S(k, h, l);
  C(n, c + 20, c + 35);
  S(m, j, n);
  N(r, g, m);
  C(u, r, d);
  C(p, u, k);
  h = Xc(p);
  j = h - o[c + 22];
  j = $j(j, 0, .20000000298023224);
  K(q, -o[c + 41] * j, p);
  K(v, o[c + 37], q);
  Ke(d, v);
  e -= o[c + 39] * Q(k, q);
  K(x, o[c + 38], q);
  Nb(g, x);
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

wo.X = 1;

function xo(c, f) {
  var d = a;
  a += 35;
  var e, g, i = d + 2, h, j = d + 4, k, l = d + 6, m = d + 8, n = d + 10;
  e = d + 12;
  var p = d + 14, u = d + 16, r = d + 18, q = d + 20, v, x = d + 29, w = d + 31, y = d + 33;
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
  Em(m, g);
  Em(n, k);
  var z = c + 32;
  C(p, c + 21, c + 36);
  S(e, m, p);
  b[z] = b[e];
  o[z] = o[e];
  b[z + 1] = b[e + 1];
  o[z + 1] = o[e + 1];
  m = c + 34;
  C(r, c + 23, c + 38);
  S(u, n, r);
  b[m] = b[u];
  o[m] = o[u];
  b[m + 1] = b[u + 1];
  o[m + 1] = o[u + 1];
  n = o[c + 40];
  u = o[c + 41];
  r = o[c + 42];
  m = o[c + 43];
  o[q] = n + u + o[c + 33] * o[c + 33] * r + o[c + 35] * o[c + 35] * m;
  o[q + 3] = -o[c + 33] * o[c + 32] * r - o[c + 35] * o[c + 34] * m;
  o[q + 6] = -o[c + 33] * r - o[c + 35] * m;
  o[q + 1] = o[q + 3];
  o[q + 4] = n + u + o[c + 32] * o[c + 32] * r + o[c + 34] * o[c + 34] * m;
  o[q + 7] = o[c + 32] * r + o[c + 34] * m;
  o[q + 2] = o[q + 6];
  o[q + 5] = o[q + 7];
  o[q + 8] = r + m;
  e = 0 < o[c + 18] ? 1 : 8;
  if (1 == e) {
    si(q, c + 44);
    q = r + m;
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
  } else 8 == e && (wi(q, c + 44), o[c + 26] = 0, o[c + 20] = 0);
  E = c + 27;
  e = b[f + 5] & 1 ? 10 : 11;
  10 == e ? (vn(E, o[f + 2]), oc(x, o[c + 27], o[c + 28]), K(w, n, x), Ke(i, w), h -= r * (Q(c + 32, x) + o[c + 29]), K(y, u, x), Nb(l, y), j += m * (Q(c + 34, x) + o[c + 29])) : 11 == e && tn(E);
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

xo.X = 1;

function yo(c) {
  var f, d;
  f = b[b[c + 12] + 2];
  d = b[b[c + 13] + 2];
  U(zo, A(1, "i32", s));
  U(um, A([ f ], "i32", s));
  U(vm, A([ d ], "i32", s));
  U(wm, A([ b[c + 16] & 1 ], "i32", s));
  U(xm, A([ o[c + 21], o[c + 22] ], "double", s));
  U(ym, A([ o[c + 23], o[c + 24] ], "double", s));
  U(In, A([ o[c + 25] ], "double", s));
  U(Am, A([ o[c + 18] ], "double", s));
  U(Bm, A([ o[c + 19] ], "double", s));
  U(Cm, A([ b[c + 14] ], "i32", s));
}

yo.X = 1;

function Ao(c, f, d) {
  qi(c, o[f] + o[d], o[f + 1] + o[d + 1], o[f + 2] + o[d + 2]);
}

function Bo(c, f, d) {
  qi(c, f * o[d], f * o[d + 1], f * o[d + 2]);
}

function Co(c, f) {
  var d = a;
  a += 49;
  var e, g, i = d + 2, h, j, k, l, m, n, p = d + 4, u = d + 6, r = d + 8, q = d + 10, v = d + 12, x = d + 14, w = d + 16, y = d + 18, z = d + 20, B = d + 22, E = d + 24, D = d + 26, H = d + 28, I = d + 30, M = d + 32;
  n = d + 34;
  var G = d + 37, R = d + 40, P = d + 43, L = d + 45, T = d + 47;
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
  1 == e ? (n = -o[c + 52] * (F - g + o[c + 20] + o[c + 26] * o[c + 29]), o[c + 29] += n, g -= l * n, h += m * n, Ce(q, h, c + 34), N(r, i, q), C(u, r, d), Ce(v, g, c + 32), C(p, u, v), Bn(w, c + 44, p), Pd(x, w), o[c + 27] += o[x], o[c + 28] += o[x + 1], b[y] = b[x], o[y] = o[x], b[y + 1] = b[x + 1], o[y + 1] = o[x + 1], K(z, j, y), Ke(d, z), g -= l * Q(c + 32, y), K(B, k, y), Nb(i, B), h += m * Q(c + 34, y)) : 2 == e && (Ce(I, F, c + 34), N(H, i, I), C(D, H, d), Ce(M, g, c + 32), C(E, D, M), qi(n, o[E], o[E + 1], h - g), p = c + 44, u = a, a += 12, r = u + 3, q = u + 6, v = u + 9, Bo(r, o[n], p), Bo(q, o[n + 1], p + 3), Ao(u, r, q), Bo(v, o[n + 2], p + 6), Ao(R, u, v), a = u, zn(G, R), An(c + 27, G), oc(P, o[G], o[G + 1]), K(L, j, P), Ke(d, L), g -= l * (Q(c + 32, P) + o[G + 2]), K(T, k, P), Nb(i, T), h += m * (Q(c + 34, P) + o[G + 2]));
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

Co.X = 1;

function Do(c, f) {
  var d = a;
  a += 60;
  var e, g, i = d + 2, h;
  e = d + 4;
  var j = d + 6, k, l, m, n, p = d + 8, u = d + 10, r = d + 12, q = d + 14, v, x, w = d + 16, y = d + 25, z = d + 27, B = d + 29, E = d + 31, D = d + 33, H = d + 35, I = d + 37, M = d + 39, G = d + 41, R = d + 43, P = d + 45, L = d + 48, T = d + 51, F = d + 54, X = d + 56, Z = d + 58;
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
  Em(e, g);
  Em(j, h);
  k = o[c + 40];
  l = o[c + 41];
  m = o[c + 42];
  n = o[c + 43];
  C(u, c + 21, c + 36);
  S(p, e, u);
  C(q, c + 23, c + 38);
  S(r, j, q);
  o[w] = k + l + o[p + 1] * o[p + 1] * m + o[r + 1] * o[r + 1] * n;
  o[w + 3] = -o[p + 1] * o[p] * m - o[r + 1] * o[r] * n;
  o[w + 6] = -o[p + 1] * m - o[r + 1] * n;
  o[w + 1] = o[w + 3];
  o[w + 4] = k + l + o[p] * o[p] * m + o[r] * o[r] * n;
  o[w + 7] = o[p] * m + o[r] * n;
  o[w + 2] = o[w + 6];
  o[w + 5] = o[w + 7];
  o[w + 8] = m + n;
  e = 0 < o[c + 18] ? 1 : 2;
  1 == e ? (N(B, i, r), C(z, B, d), C(y, z, p), v = Yc(y), x = 0, ri(D, w, y), Pd(E, D), K(H, k, E), Ke(d, H), g -= m * Q(p, E), K(I, l, E), Nb(i, I), h += n * Q(r, E)) : 2 == e && (N(R, i, r), C(G, R, d), C(M, G, p), y = h - g - o[c + 25], v = Yc(M), x = ke(y), qi(P, o[M], o[M + 1], y), vi(T, w, P), zn(L, T), oc(F, o[L], o[L + 1]), K(X, k, F), Ke(d, X), g -= m * (Q(p, F) + o[L + 2]), K(Z, l, F), Nb(i, Z), h += n * (Q(r, F) + o[L + 2]));
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

Do.X = 1;

function Eo(c, f) {
  var d = a;
  a += 2;
  cm(c, f);
  b[c] = Fo + 2;
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
  Ce(d, 1, c + 24);
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
  cc(c + 44);
  cc(c + 46);
  a = d;
}

Eo.X = 1;

function Go(c, f) {
  var d = a;
  a += 44;
  var e, g, i, h, j, k, l = d + 2, m, n = d + 4, p, u = d + 6, r, q = d + 8, v = d + 10, x = d + 12, w = d + 14, y = d + 16, z = d + 18, B = d + 20, E = d + 22, D = d + 24;
  e = d + 26;
  var H = d + 28, I = d + 30, M = d + 32, G = d + 34, R = d + 36, P = d + 38, L = d + 40, T = d + 42;
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
  r = b[f + 6] + 3 * b[c + 35];
  b[n] = b[r];
  o[n] = o[r];
  b[n + 1] = b[r + 1];
  o[n + 1] = o[r + 1];
  p = o[b[f + 6] + 3 * b[c + 35] + 2];
  r = b[f + 7] + 3 * b[c + 35];
  b[u] = b[r];
  o[u] = o[r];
  b[u + 1] = b[r + 1];
  o[u + 1] = o[r + 1];
  r = o[b[f + 7] + 3 * b[c + 35] + 2];
  Em(q, k);
  Em(v, p);
  C(w, c + 20, c + 36);
  S(x, q, w);
  C(z, c + 22, c + 38);
  S(y, v, z);
  N(D, n, y);
  C(E, D, d);
  C(B, E, x);
  n = c + 46;
  S(e, q, c + 26);
  b[n] = b[e];
  o[n] = o[e];
  b[n + 1] = b[e + 1];
  o[n + 1] = o[e + 1];
  N(H, B, x);
  o[c + 50] = Q(H, c + 46);
  o[c + 51] = Q(y, c + 46);
  o[c + 52] = g + i + h * o[c + 50] * o[c + 50] + j * o[c + 51] * o[c + 51];
  e = 0 < o[c + 52] ? 1 : 2;
  1 == e && (o[c + 52] = 1 / o[c + 52]);
  o[c + 54] = 0;
  o[c + 55] = 0;
  o[c + 56] = 0;
  e = 0 < o[c + 18] ? 3 : 8;
  3 == e ? (e = c + 44, S(I, q, c + 24), b[e] = b[I], o[e] = o[I], b[e + 1] = b[I + 1], o[e + 1] = o[I + 1], N(M, B, x), o[c + 48] = Q(M, c + 44), o[c + 49] = Q(y, c + 44), q = g + i + h * o[c + 48] * o[c + 48] + j * o[c + 49] * o[c + 49], 0 < q && (o[c + 54] = 1 / q, B = J(B, c + 44), y = 6.2831854820251465 * o[c + 18], x = 2 * o[c + 54] * o[c + 19] * y, y *= o[c + 54] * y, I = o[f], o[c + 56] = I * (x + I * y), e = 0 < o[c + 56] ? 5 : 6, 5 == e && (o[c + 56] = 1 / o[c + 56]), o[c + 55] = B * I * y * o[c + 56], o[c + 54] = q + o[c + 56], 0 < o[c + 54] && (o[c + 54] = 1 / o[c + 54]))) : 8 == e && (o[c + 30] = 0);
  e = b[c + 33] & 1 ? 10 : 12;
  10 == e ? (o[c + 53] = h + j, 0 < o[c + 53] && (o[c + 53] = 1 / o[c + 53])) : 12 == e && (o[c + 53] = 0, o[c + 29] = 0);
  e = b[f + 5] & 1 ? 14 : 15;
  14 == e ? (o[c + 28] *= o[f + 2], o[c + 30] *= o[f + 2], o[c + 29] *= o[f + 2], K(R, o[c + 28], c + 46), K(P, o[c + 30], c + 44), N(G, R, P), R = o[c + 28] * o[c + 50] + o[c + 30] * o[c + 48] + o[c + 29], P = o[c + 28] * o[c + 51] + o[c + 30] * o[c + 49] + o[c + 29], K(L, o[c + 40], G), Ke(l, L), m -= o[c + 42] * R, K(T, o[c + 41], G), Nb(u, T), r += o[c + 43] * P) : 15 == e && (o[c + 28] = 0, o[c + 30] = 0, o[c + 29] = 0);
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
  o[b[f + 7] + 3 * b[c + 35] + 2] = r;
  a = d;
}

Go.X = 1;

function Ho(c, f) {
  var d = a;
  a += 20;
  var e, g, i, h, j, k = d + 2, l, m = d + 4, n, p = d + 6, u = d + 8, r = d + 10, q = d + 12, v = d + 14, x = d + 16, w = d + 18;
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
  C(m, k, d);
  n = -o[c + 54] * (J(n, m) + o[c + 49] * l - o[c + 48] * j + o[c + 55] + o[c + 56] * o[c + 30]);
  o[c + 30] += n;
  K(p, n, c + 44);
  m = n * o[c + 48];
  n *= o[c + 49];
  K(u, e, p);
  Ke(d, u);
  j -= i * m;
  K(r, g, p);
  Nb(k, r);
  l += h * n;
  p = -o[c + 53] * (l - j - o[c + 32]);
  u = o[c + 29];
  r = o[f] * o[c + 31];
  o[c + 29] = $j(o[c + 29] + p, -r, r);
  p = o[c + 29] - u;
  j -= i * p;
  l += h * p;
  p = c + 46;
  C(q, k, d);
  q = -o[c + 52] * (J(p, q) + o[c + 51] * l - o[c + 50] * j);
  o[c + 28] += q;
  K(v, q, c + 46);
  p = q * o[c + 50];
  q *= o[c + 51];
  K(x, e, v);
  Ke(d, x);
  j -= i * p;
  K(w, g, v);
  Nb(k, w);
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

Ho.X = 1;

function Io(c) {
  var f, d;
  f = b[b[c + 12] + 2];
  d = b[b[c + 13] + 2];
  U(Jo, A(1, "i32", s));
  U(um, A([ f ], "i32", s));
  U(vm, A([ d ], "i32", s));
  U(wm, A([ b[c + 16] & 1 ], "i32", s));
  U(xm, A([ o[c + 20], o[c + 21] ], "double", s));
  U(ym, A([ o[c + 22], o[c + 23] ], "double", s));
  U(Hn, A([ o[c + 24], o[c + 25] ], "double", s));
  U(Mn, A([ b[c + 33] & 1 ], "i32", s));
  U(Nn, A([ o[c + 32] ], "double", s));
  U(mo, A([ o[c + 31] ], "double", s));
  U(Am, A([ o[c + 18] ], "double", s));
  U(Bm, A([ o[c + 19] ], "double", s));
  U(Cm, A([ b[c + 14] ], "i32", s));
}

Io.X = 1;

function Ko(c, f) {
  var d = a;
  a += 32;
  var e, g, i = d + 2, h, j = d + 4;
  e = d + 6;
  var k = d + 8, l = d + 10, m = d + 12, n = d + 14, p = d + 16, u = d + 18, r = d + 20, q = d + 22, v = d + 24, x, w = d + 26, y = d + 28, z = d + 30;
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
  Em(j, g);
  Em(e, h);
  C(l, c + 20, c + 36);
  S(k, j, l);
  C(n, c + 22, c + 38);
  S(m, e, n);
  C(r, i, d);
  N(u, r, m);
  C(p, u, k);
  S(q, j, c + 26);
  N(v, p, k);
  j = Q(v, q);
  m = Q(m, q);
  p = J(p, q);
  k = o[c + 40] + o[c + 41] + o[c + 42] * o[c + 50] * o[c + 50] + o[c + 43] * o[c + 51] * o[c + 51];
  e = 0 != k ? 1 : 2;
  1 == e ? x = -p / k : 2 == e && (x = 0);
  K(w, x, q);
  q = x * j;
  x *= m;
  K(y, o[c + 40], w);
  Ke(d, y);
  g -= o[c + 42] * q;
  K(z, o[c + 41], w);
  Nb(i, z);
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
  i = .004999999888241291 >= ke(p);
  a = d;
  return i;
}

Ko.X = 1;

function dj(c, f) {
  for (var d = f, e = f + 2, g = c; d < e; d++, g++) b[g] = b[d], o[g] = o[d];
}

function wc() {
  Lo === ba && (Lo = Date.now());
  return Math.floor(1 * (Date.now() - Lo));
}

var Lo, Mo = 13, No = 9, Oo = 22, Po = 5, Qo = 21, Ro = 6;

function So(c) {
  To || (To = A([ 0 ], "i32", t));
  b[To] = c;
}

var To, Uo = 0, zc = 0, Vo = 0, Wo = 2, Jc = [ da ], Xo = ca;

function Yo(c, f) {
  if ("string" !== typeof c) return da;
  f === ba && (f = "/");
  c && "/" == c[0] && (f = "");
  for (var d = (f + "/" + c).split("/").reverse(), e = [ "" ]; d.length; ) {
    var g = d.pop();
    "" == g || "." == g || (".." == g ? 1 < e.length && e.pop() : e.push(g));
  }
  return 1 == e.length ? "/" : e.join("/");
}

function Zo(c, f, d) {
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
  }, c = Yo(c);
  if ("/" == c) e.Q = ca, e.m = e.w = ca, e.name = "/", e.path = e.A = "/", e.object = e.z = $o; else if (c !== da) for (var d = d || 0, c = c.slice(1).split("/"), g = $o, i = [ "" ]; c.length; ) {
    if (1 == c.length && g.c) e.w = ca, e.A = 1 == i.length ? "/" : i.join("/"), e.z = g, e.name = c[0];
    var h = c.shift();
    if (g.c) if (g.C) {
      if (!g.a.hasOwnProperty(h)) {
        e.error = 2;
        break;
      }
    } else {
      e.error = Mo;
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
      e = Yo(g.link, i.join("/"));
      return Zo([ e ].concat(c).join("/"), f, d + 1);
    }
    i.push(h);
    if (0 == c.length) e.m = ca, e.path = i.join("/"), e.object = g;
  }
  return e;
}

function ap(c, f, d, e, g) {
  c || (c = "/");
  if ("string" === typeof c) bp(), c = Zo(c, ba), c.m ? c = c.object : (So(c.error), c = da);
  if (!c) throw So(Mo), Error("Parent path must exist.");
  if (!c.c) throw So(20), Error("Parent must be a folder.");
  if (!c.write && !Xo) throw So(Mo), Error("Parent folder must be writeable.");
  if (!f || "." == f || ".." == f) throw So(2), Error("Name must not be empty.");
  if (c.a.hasOwnProperty(f)) throw So(17), Error("Can't overwrite object.");
  c.a[f] = {
    C: e === ba ? ca : e,
    write: g === ba ? ea : g,
    timestamp: Date.now(),
    N: Wo++
  };
  for (var i in d) d.hasOwnProperty(i) && (c.a[f][i] = d[i]);
  return c.a[f];
}

function cp(c, f) {
  return ap("/", c, {
    c: ca,
    h: ea,
    a: {}
  }, ca, f);
}

function dp(c, f, d, e) {
  if (!d && !e) throw Error("A device must have at least one callback defined.");
  var g = {
    h: ca,
    input: d,
    d: e
  };
  g.c = ea;
  return ap(c, f, g, Boolean(d), Boolean(e));
}

function bp() {
  $o || ($o = {
    C: ca,
    write: ea,
    c: ca,
    h: ea,
    timestamp: Date.now(),
    N: 1,
    a: {}
  });
}

var ep, $o;

function Ic(c, f, d) {
  var e = Jc[c];
  if (e) {
    if (e.i) {
      if (0 > d) return So(Oo), -1;
      if (e.object.h) {
        if (e.object.d) {
          for (var g = 0; g < d; g++) try {
            e.object.d(b[f + g]);
          } catch (i) {
            return So(Po), -1;
          }
          e.object.timestamp = Date.now();
          return g;
        }
        So(Ro);
        return -1;
      }
      g = e.position;
      c = Jc[c];
      if (!c || c.object.h) So(No), f = -1; else if (c.i) if (c.object.c) So(Qo), f = -1; else if (0 > d || 0 > g) So(Oo), f = -1; else {
        for (var h = c.object.a; h.length < g; ) h.push(0);
        for (var j = 0; j < d; j++) h[g + j] = Za[f + j];
        c.object.timestamp = Date.now();
        f = j;
      } else So(Mo), f = -1;
      -1 != f && (e.position += f);
      return f;
    }
    So(Mo);
    return -1;
  }
  So(No);
  return -1;
}

function fp(c, f) {
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
      var r = ea;
      if (46 == j) {
        var q = 0, r = ca;
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
        4 >= v && (h = (k ? Kb : Jb)(h & Math.pow(256, v) - 1, 8 * v));
        var x = Math.abs(h), w, k = "";
        if (100 == j || 105 == j) w = Kb(h, 8 * v).toString(10); else if (117 == j) w = Jb(h, 8 * v).toString(10), h = Math.abs(h); else if (111 == j) w = (n ? "0" : "") + x.toString(8); else if (120 == j || 88 == j) {
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
        if (r) for (; w.length < q; ) w = "0" + w;
        for (l && (k = 0 > h ? "-" + k : "+" + k); k.length + w.length < u; ) m ? w += " " : p ? w = "0" + w : k = " " + k;
        w = k + w;
        w.split("").forEach((function(c) {
          i.push(c.charCodeAt(0));
        }));
      } else if (-1 != "f,F,e,E,g,G".split(",").indexOf(String.fromCharCode(j))) {
        h = d(4 === v ? "float" : "double");
        if (isNaN(h)) w = "nan", p = ea; else if (isFinite(h)) {
          r = ea;
          v = Math.min(q, 20);
          if (103 == j || 71 == j) r = ca, q = q || 1, v = parseInt(h.toExponential(v).split("e")[1], 10), q > v && -4 <= v ? (j = (103 == j ? "f" : "F").charCodeAt(0), q -= v + 1) : (j = (103 == j ? "e" : "E").charCodeAt(0), q--), v = Math.min(q, 20);
          if (101 == j || 69 == j) w = h.toExponential(v), /[eE][-+]\d$/.test(w) && (w = w.slice(0, -1) + "0" + w.slice(-1)); else if (102 == j || 70 == j) w = h.toFixed(v);
          k = w.split("e");
          if (r && !n) for (; 1 < k[0].length && -1 != k[0].indexOf(".") && ("0" == k[0].slice(-1) || "." == k[0].slice(-1)); ) k[0] = k[0].slice(0, -1); else for (n && -1 == w.indexOf(".") && (k[0] += "."); q > v++; ) k[0] += "0";
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
        (l = d("i8*")) ? (l = Fb(l), r && l.length > q && (l = l.slice(0, q))) : l = ob("(null)", ca);
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

function xc(c, f) {
  var d = b[zc], e = fp(c, f), g = Ma.W();
  var i = A(e, "i8", s), e = 1 * e.length;
  if (0 == e) d = 0; else if (i = Ic(d, i, e), -1 == i) {
    if (Jc[d]) Jc[d].error = ca;
    d = -1;
  } else d = Math.floor(i / 1);
  Ma.V(g);
  return d;
}

var Zc = Math.sqrt;

function O(c, f, d, e) {
  throw "Assertion failed: " + lb(e) + ", at: " + [ lb(c), f, lb(d) ];
}

var Ih = Math.sin, Jh = Math.cos, qh = Math.floor;

function kb(c) {
  return Ma.D(c || 1);
}

var Ji = xc;

function Oi(c) {
  var f = Ma.q({
    g: [ "i32", "i32" ]
  }), d = Date.now();
  b[c + f[0]] = Math.floor(d / 1e3);
  b[c + f[1]] = Math.floor(1e3 * (d - 1e3 * Math.floor(d / 1e3)));
}

((function(c, f, d) {
  if (!ep) {
    ep = ca;
    bp();
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
    cp("tmp", ca);
    var e = cp("dev", ea), g = dp(e, "stdin", c), i = dp(e, "stdout", da, f), d = dp(e, "stderr", da, d);
    dp(e, "tty", c, f);
    Jc[1] = {
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
    Jc[2] = {
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
    Jc[3] = {
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
    Uo = A([ 1 ], "void*", t);
    zc = A([ 2 ], "void*", t);
    Vo = A([ 3 ], "void*", t);
    Jc[Uo] = Jc[1];
    Jc[zc] = Jc[2];
    Jc[Vo] = Jc[3];
    A([ A([ 0, Uo, zc, Vo ], "void*", t) ], "void*", t);
  }
}))();

bb.push({
  n: (function() {
    ep && (0 < Jc[2].object.d.buffer.length && Jc[2].object.d(10), 0 < Jc[3].object.d.buffer.length && Jc[3].object.d(10));
  })
});

So(0);

var Hc = A([ 0 ], "i8", t);

Module.I = (function(c) {
  function f() {
    for (var c = 0; 0 > c; c++) e.push(0);
  }
  var d = c.length + 1, e = [ A(ob("/bin/this.program"), "i8", t) ];
  f();
  for (var g = 0; g < d - 1; g += 1) e.push(A(ob(c[g]), "i8", t)), f();
  e.push(0);
  e = A(e, "i32", t);
  return Lb();
});

var yc, Wb, gp, hp, ip, ad, bd, cd, Yd, Zd, he, ie, ye, Fe, Ge, ne, oe, qe, Ae, yg, Re, Oe, Pe, Qe, Be, te, Le, Me, Te, Ag, Bg, vg, wg, xg, Pg, Ng, Ig, Jg, Kg, Sg, Tg, Ug, Vg, Wg, Xg, Yg, Zg, $g, ah, eh, oh, ph, mh, nh, gh, hh, ih, Hh, th, rh, sh, vh, xh, Nh, Mh, Oh, yh, zh, Qh, Gh, Fh, jp, kp, lp, mp, np, op, lc, pp, qp, Xh, Yh, Zh, ai, bi, ci, bc, rp, sp, ii, ji, ei, fi, gi, hi, ti, mi, ni, ui, li, tp, up, vp, ue, ab = (function() {
  b[pj] = wp + 2;
  bb.push({
    n: 4,
    k: pj
  });
  b[qj] = xp + 2;
  bb.push({
    n: 6,
    k: qj
  });
}), Ai, Bi, Ci, Di, Li, Mi, Fi, Gi, Hi, Si, Ti, Ui, Vi, Wi, Xi, Yi, Zi, jj, ij, aj, bj, cj, pj, qj, Gj, Og, Jj, Kj, Lj, Fj, xp, yp, zp, Sj, Tj, Uj, Vj, jk, kk, lk, mk, ok, pk, wk, Pk, Qk, Rk, Vk, Wk, Yk, Ej, al, bl, Ik, Sk, Tk, Mk, Nk, Jk, Kk, wp, Ap, Bp, gl, hl, il, Cp, Dp, Ep, Fp, nl, ol, pl, jl, Gp, Hp, tl, ul, vl, wl, Ip, Jp, Cl, Dl, yl, zl, Al, Bl, El, Fl, Gl, Hl, Il, Kl, Ll, Ml, Nl, Ol, Rl, Sl, Tl, Vl, Wl, Yl, Zl, $l, Kp, Lp, fm, gm, hm, am, Mp, Np, jm, km, lm, kl, Op, Pp, om, pm, qm, mm, ql, Qp, Rp, dm, tm, zm, Sp, Tp, Up, Vp, Im, Km, Lm, Mm, Wp, Xp, Qm, Rm, Sm, Tm, Um, Ym, Zm, $m, Yp, Zp, dn, pe, cn, en, fn, $p, hn, jn, kn, ln, mn, nn, on, qn, rn, aq, bq, cq, xn, Gn, Kn, Ln, On, dq, eq, Rn, Qn, Sn, Tn, Xn, Yn, Zn, $n, ao, an, fq, gq, co, jo, Jn, ko, lo, hq, xq, oo, so, to, yq, zq, vo, zo, In, Aq, Bq, Fo, Jo, um, vm, wm, xm, ym, Hn, Mn, Nn, mo, Am, Bm, Cm, Cq, Dq;

yc = A([ 37, 102, 10, 0 ], "i8", t);

Wb = A([ 0, 0, 36, 38, 40, 40, 40, 40, 40, 40 ], "i8*", t);

A(1, "void*", t);

hp = A([ 55, 98, 50, 83, 104, 97, 112, 101, 0 ], "i8", t);

ip = A(2, "i8*", t);

ad = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 108, 108, 105, 115, 105, 111, 110, 47, 98, 50, 67, 111, 108, 108, 105, 100, 101, 69, 100, 103, 101, 46, 99, 112, 112, 0 ], "i8", t);

bd = A([ 118, 111, 105, 100, 32, 98, 50, 67, 111, 108, 108, 105, 100, 101, 69, 100, 103, 101, 65, 110, 100, 67, 105, 114, 99, 108, 101, 40, 98, 50, 77, 97, 110, 105, 102, 111, 108, 100, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 69, 100, 103, 101, 83, 104, 97, 112, 101, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 67, 105, 114, 99, 108, 101, 83, 104, 97, 112, 101, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 41, 0 ], "i8", t);

cd = A([ 100, 101, 110, 32, 62, 32, 48, 46, 48, 102, 0 ], "i8", t);

Yd = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 108, 108, 105, 115, 105, 111, 110, 47, 98, 50, 67, 111, 108, 108, 105, 100, 101, 80, 111, 108, 121, 103, 111, 110, 46, 99, 112, 112, 0 ], "i8", t);

Zd = A([ 118, 111, 105, 100, 32, 98, 50, 70, 105, 110, 100, 73, 110, 99, 105, 100, 101, 110, 116, 69, 100, 103, 101, 40, 98, 50, 67, 108, 105, 112, 86, 101, 114, 116, 101, 120, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 80, 111, 108, 121, 103, 111, 110, 83, 104, 97, 112, 101, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 44, 32, 105, 110, 116, 51, 50, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 80, 111, 108, 121, 103, 111, 110, 83, 104, 97, 112, 101, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 41, 0 ], "i8", t);

he = A([ 48, 32, 60, 61, 32, 101, 100, 103, 101, 49, 32, 38, 38, 32, 101, 100, 103, 101, 49, 32, 60, 32, 112, 111, 108, 121, 49, 45, 62, 109, 95, 118, 101, 114, 116, 101, 120, 67, 111, 117, 110, 116, 0 ], "i8", t);

ie = A([ 102, 108, 111, 97, 116, 51, 50, 32, 98, 50, 69, 100, 103, 101, 83, 101, 112, 97, 114, 97, 116, 105, 111, 110, 40, 99, 111, 110, 115, 116, 32, 98, 50, 80, 111, 108, 121, 103, 111, 110, 83, 104, 97, 112, 101, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 44, 32, 105, 110, 116, 51, 50, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 80, 111, 108, 121, 103, 111, 110, 83, 104, 97, 112, 101, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 41, 0 ], "i8", t);

ye = A(1, "i32", t);

Fe = A(1, "i32", t);

Ge = A(1, "i32", t);

ne = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 108, 108, 105, 115, 105, 111, 110, 47, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 46, 99, 112, 112, 0 ], "i8", t);

oe = A([ 118, 111, 105, 100, 32, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 80, 114, 111, 120, 121, 58, 58, 83, 101, 116, 40, 99, 111, 110, 115, 116, 32, 98, 50, 83, 104, 97, 112, 101, 32, 42, 44, 32, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

qe = A([ 48, 32, 60, 61, 32, 105, 110, 100, 101, 120, 32, 38, 38, 32, 105, 110, 100, 101, 120, 32, 60, 32, 99, 104, 97, 105, 110, 45, 62, 109, 95, 99, 111, 117, 110, 116, 0 ], "i8", t);

Ae = A([ 118, 111, 105, 100, 32, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 40, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 79, 117, 116, 112, 117, 116, 32, 42, 44, 32, 98, 50, 83, 105, 109, 112, 108, 101, 120, 67, 97, 99, 104, 101, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 73, 110, 112, 117, 116, 32, 42, 41, 0 ], "i8", t);

yg = A([ 102, 108, 111, 97, 116, 51, 50, 32, 98, 50, 83, 105, 109, 112, 108, 101, 120, 58, 58, 71, 101, 116, 77, 101, 116, 114, 105, 99, 40, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

Re = A([ 118, 111, 105, 100, 32, 98, 50, 83, 105, 109, 112, 108, 101, 120, 58, 58, 71, 101, 116, 87, 105, 116, 110, 101, 115, 115, 80, 111, 105, 110, 116, 115, 40, 98, 50, 86, 101, 99, 50, 32, 42, 44, 32, 98, 50, 86, 101, 99, 50, 32, 42, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

Oe = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 108, 108, 105, 115, 105, 111, 110, 47, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 46, 104, 0 ], "i8", t);

Pe = A([ 99, 111, 110, 115, 116, 32, 98, 50, 86, 101, 99, 50, 32, 38, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 80, 114, 111, 120, 121, 58, 58, 71, 101, 116, 86, 101, 114, 116, 101, 120, 40, 105, 110, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

Qe = A([ 48, 32, 60, 61, 32, 105, 110, 100, 101, 120, 32, 38, 38, 32, 105, 110, 100, 101, 120, 32, 60, 32, 109, 95, 99, 111, 117, 110, 116, 0 ], "i8", t);

Be = A([ 98, 50, 86, 101, 99, 50, 32, 98, 50, 83, 105, 109, 112, 108, 101, 120, 58, 58, 71, 101, 116, 83, 101, 97, 114, 99, 104, 68, 105, 114, 101, 99, 116, 105, 111, 110, 40, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

te = A([ 98, 50, 86, 101, 99, 50, 32, 98, 50, 83, 105, 109, 112, 108, 101, 120, 58, 58, 71, 101, 116, 67, 108, 111, 115, 101, 115, 116, 80, 111, 105, 110, 116, 40, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

Le = A([ 118, 111, 105, 100, 32, 98, 50, 83, 105, 109, 112, 108, 101, 120, 58, 58, 82, 101, 97, 100, 67, 97, 99, 104, 101, 40, 99, 111, 110, 115, 116, 32, 98, 50, 83, 105, 109, 112, 108, 101, 120, 67, 97, 99, 104, 101, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 80, 114, 111, 120, 121, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 80, 114, 111, 120, 121, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 41, 0 ], "i8", t);

Me = A([ 99, 97, 99, 104, 101, 45, 62, 99, 111, 117, 110, 116, 32, 60, 61, 32, 51, 0 ], "i8", t);

Te = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 108, 108, 105, 115, 105, 111, 110, 47, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 46, 99, 112, 112, 0 ], "i8", t);

Ag = A([ 105, 110, 116, 51, 50, 32, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 65, 108, 108, 111, 99, 97, 116, 101, 78, 111, 100, 101, 40, 41, 0 ], "i8", t);

Bg = A([ 109, 95, 110, 111, 100, 101, 67, 111, 117, 110, 116, 32, 61, 61, 32, 109, 95, 110, 111, 100, 101, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

vg = A([ 118, 111, 105, 100, 32, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 70, 114, 101, 101, 78, 111, 100, 101, 40, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

wg = A([ 48, 32, 60, 61, 32, 110, 111, 100, 101, 73, 100, 32, 38, 38, 32, 110, 111, 100, 101, 73, 100, 32, 60, 32, 109, 95, 110, 111, 100, 101, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

xg = A([ 48, 32, 60, 32, 109, 95, 110, 111, 100, 101, 67, 111, 117, 110, 116, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 68, 101, 115, 116, 114, 111, 121, 80, 114, 111, 120, 121, 40, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

Pg = A([ 109, 95, 110, 111, 100, 101, 115, 91, 112, 114, 111, 120, 121, 73, 100, 93, 46, 73, 115, 76, 101, 97, 102, 40, 41, 0 ], "i8", t);

Ng = A([ 98, 111, 111, 108, 32, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 77, 111, 118, 101, 80, 114, 111, 120, 121, 40, 105, 110, 116, 51, 50, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 65, 65, 66, 66, 32, 38, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 86, 101, 99, 50, 32, 38, 41, 0 ], "i8", t);

Ig = A([ 118, 111, 105, 100, 32, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 73, 110, 115, 101, 114, 116, 76, 101, 97, 102, 40, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

Jg = A([ 99, 104, 105, 108, 100, 49, 32, 33, 61, 32, 40, 45, 49, 41, 0 ], "i8", t);

Kg = A([ 99, 104, 105, 108, 100, 50, 32, 33, 61, 32, 40, 45, 49, 41, 0 ], "i8", t);

Sg = A([ 105, 110, 116, 51, 50, 32, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 66, 97, 108, 97, 110, 99, 101, 40, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

Tg = A([ 105, 65, 32, 33, 61, 32, 40, 45, 49, 41, 0 ], "i8", t);

Ug = A([ 48, 32, 60, 61, 32, 105, 66, 32, 38, 38, 32, 105, 66, 32, 60, 32, 109, 95, 110, 111, 100, 101, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

Vg = A([ 48, 32, 60, 61, 32, 105, 67, 32, 38, 38, 32, 105, 67, 32, 60, 32, 109, 95, 110, 111, 100, 101, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

Wg = A([ 48, 32, 60, 61, 32, 105, 70, 32, 38, 38, 32, 105, 70, 32, 60, 32, 109, 95, 110, 111, 100, 101, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

Xg = A([ 48, 32, 60, 61, 32, 105, 71, 32, 38, 38, 32, 105, 71, 32, 60, 32, 109, 95, 110, 111, 100, 101, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

Yg = A([ 109, 95, 110, 111, 100, 101, 115, 91, 67, 45, 62, 112, 97, 114, 101, 110, 116, 93, 46, 99, 104, 105, 108, 100, 50, 32, 61, 61, 32, 105, 65, 0 ], "i8", t);

Zg = A([ 48, 32, 60, 61, 32, 105, 68, 32, 38, 38, 32, 105, 68, 32, 60, 32, 109, 95, 110, 111, 100, 101, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

$g = A([ 48, 32, 60, 61, 32, 105, 69, 32, 38, 38, 32, 105, 69, 32, 60, 32, 109, 95, 110, 111, 100, 101, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

ah = A([ 109, 95, 110, 111, 100, 101, 115, 91, 66, 45, 62, 112, 97, 114, 101, 110, 116, 93, 46, 99, 104, 105, 108, 100, 50, 32, 61, 61, 32, 105, 65, 0 ], "i8", t);

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

eh = A(1, "i32", t);

oh = A(1, "i32", t);

ph = A(1, "i32", t);

mh = A(1, "i32", t);

nh = A(1, "i32", t);

gh = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 108, 108, 105, 115, 105, 111, 110, 47, 98, 50, 84, 105, 109, 101, 79, 102, 73, 109, 112, 97, 99, 116, 46, 99, 112, 112, 0 ], "i8", t);

hh = A([ 118, 111, 105, 100, 32, 98, 50, 84, 105, 109, 101, 79, 102, 73, 109, 112, 97, 99, 116, 40, 98, 50, 84, 79, 73, 79, 117, 116, 112, 117, 116, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 79, 73, 73, 110, 112, 117, 116, 32, 42, 41, 0 ], "i8", t);

ih = A([ 116, 97, 114, 103, 101, 116, 32, 62, 32, 116, 111, 108, 101, 114, 97, 110, 99, 101, 0 ], "i8", t);

Hh = A([ 102, 108, 111, 97, 116, 51, 50, 32, 98, 50, 83, 101, 112, 97, 114, 97, 116, 105, 111, 110, 70, 117, 110, 99, 116, 105, 111, 110, 58, 58, 69, 118, 97, 108, 117, 97, 116, 101, 40, 105, 110, 116, 51, 50, 44, 32, 105, 110, 116, 51, 50, 44, 32, 102, 108, 111, 97, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

th = A([ 102, 108, 111, 97, 116, 51, 50, 32, 98, 50, 83, 101, 112, 97, 114, 97, 116, 105, 111, 110, 70, 117, 110, 99, 116, 105, 111, 110, 58, 58, 70, 105, 110, 100, 77, 105, 110, 83, 101, 112, 97, 114, 97, 116, 105, 111, 110, 40, 105, 110, 116, 51, 50, 32, 42, 44, 32, 105, 110, 116, 51, 50, 32, 42, 44, 32, 102, 108, 111, 97, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

rh = A([ 102, 108, 111, 97, 116, 51, 50, 32, 98, 50, 83, 101, 112, 97, 114, 97, 116, 105, 111, 110, 70, 117, 110, 99, 116, 105, 111, 110, 58, 58, 73, 110, 105, 116, 105, 97, 108, 105, 122, 101, 40, 99, 111, 110, 115, 116, 32, 98, 50, 83, 105, 109, 112, 108, 101, 120, 67, 97, 99, 104, 101, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 80, 114, 111, 120, 121, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 83, 119, 101, 101, 112, 32, 38, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 80, 114, 111, 120, 121, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 83, 119, 101, 101, 112, 32, 38, 44, 32, 102, 108, 111, 97, 116, 51, 50, 41, 0 ], "i8", t);

sh = A([ 48, 32, 60, 32, 99, 111, 117, 110, 116, 32, 38, 38, 32, 99, 111, 117, 110, 116, 32, 60, 32, 51, 0 ], "i8", t);

vh = A([ 0, 0, 42, 44, 46, 48, 50, 52, 54, 56 ], "i8*", t);

A(1, "void*", t);

xh = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 108, 108, 105, 115, 105, 111, 110, 47, 83, 104, 97, 112, 101, 115, 47, 98, 50, 67, 104, 97, 105, 110, 83, 104, 97, 112, 101, 46, 99, 112, 112, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 67, 104, 97, 105, 110, 83, 104, 97, 112, 101, 58, 58, 67, 114, 101, 97, 116, 101, 76, 111, 111, 112, 40, 99, 111, 110, 115, 116, 32, 98, 50, 86, 101, 99, 50, 32, 42, 44, 32, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

Nh = A([ 109, 95, 118, 101, 114, 116, 105, 99, 101, 115, 32, 61, 61, 32, 95, 95, 110, 117, 108, 108, 32, 38, 38, 32, 109, 95, 99, 111, 117, 110, 116, 32, 61, 61, 32, 48, 0 ], "i8", t);

Mh = A([ 118, 111, 105, 100, 32, 98, 50, 67, 104, 97, 105, 110, 83, 104, 97, 112, 101, 58, 58, 67, 114, 101, 97, 116, 101, 67, 104, 97, 105, 110, 40, 99, 111, 110, 115, 116, 32, 98, 50, 86, 101, 99, 50, 32, 42, 44, 32, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

Oh = A([ 99, 111, 117, 110, 116, 32, 62, 61, 32, 50, 0 ], "i8", t);

yh = A([ 118, 111, 105, 100, 32, 98, 50, 67, 104, 97, 105, 110, 83, 104, 97, 112, 101, 58, 58, 71, 101, 116, 67, 104, 105, 108, 100, 69, 100, 103, 101, 40, 98, 50, 69, 100, 103, 101, 83, 104, 97, 112, 101, 32, 42, 44, 32, 105, 110, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

zh = A([ 48, 32, 60, 61, 32, 105, 110, 100, 101, 120, 32, 38, 38, 32, 105, 110, 100, 101, 120, 32, 60, 32, 109, 95, 99, 111, 117, 110, 116, 32, 45, 32, 49, 0 ], "i8", t);

Qh = A([ 118, 105, 114, 116, 117, 97, 108, 32, 98, 111, 111, 108, 32, 98, 50, 67, 104, 97, 105, 110, 83, 104, 97, 112, 101, 58, 58, 82, 97, 121, 67, 97, 115, 116, 40, 98, 50, 82, 97, 121, 67, 97, 115, 116, 79, 117, 116, 112, 117, 116, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 82, 97, 121, 67, 97, 115, 116, 73, 110, 112, 117, 116, 32, 38, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 44, 32, 105, 110, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

Gh = A([ 99, 104, 105, 108, 100, 73, 110, 100, 101, 120, 32, 60, 32, 109, 95, 99, 111, 117, 110, 116, 0 ], "i8", t);

Fh = A([ 118, 105, 114, 116, 117, 97, 108, 32, 118, 111, 105, 100, 32, 98, 50, 67, 104, 97, 105, 110, 83, 104, 97, 112, 101, 58, 58, 67, 111, 109, 112, 117, 116, 101, 65, 65, 66, 66, 40, 98, 50, 65, 65, 66, 66, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 44, 32, 105, 110, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

kp = A([ 49, 50, 98, 50, 67, 104, 97, 105, 110, 83, 104, 97, 112, 101, 0 ], "i8", t);

lp = A(3, "i8*", t);

mp = A([ 0, 0, 58, 60, 62, 64, 66, 68, 70, 72 ], "i8*", t);

A(1, "void*", t);

np = A([ 49, 51, 98, 50, 67, 105, 114, 99, 108, 101, 83, 104, 97, 112, 101, 0 ], "i8", t);

op = A(3, "i8*", t);

lc = A([ 0, 0, 74, 76, 78, 80, 82, 84, 86, 88 ], "i8*", t);

A(1, "void*", t);

pp = A([ 49, 49, 98, 50, 69, 100, 103, 101, 83, 104, 97, 112, 101, 0 ], "i8", t);

qp = A(3, "i8*", t);

Xh = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 108, 108, 105, 115, 105, 111, 110, 47, 83, 104, 97, 112, 101, 115, 47, 98, 50, 80, 111, 108, 121, 103, 111, 110, 83, 104, 97, 112, 101, 46, 99, 112, 112, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 80, 111, 108, 121, 103, 111, 110, 83, 104, 97, 112, 101, 58, 58, 83, 101, 116, 40, 99, 111, 110, 115, 116, 32, 98, 50, 86, 101, 99, 50, 32, 42, 44, 32, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

A([ 51, 32, 60, 61, 32, 99, 111, 117, 110, 116, 32, 38, 38, 32, 99, 111, 117, 110, 116, 32, 60, 61, 32, 56, 0 ], "i8", t);

A([ 101, 100, 103, 101, 46, 76, 101, 110, 103, 116, 104, 83, 113, 117, 97, 114, 101, 100, 40, 41, 32, 62, 32, 49, 46, 49, 57, 50, 48, 57, 50, 57, 48, 69, 45, 48, 55, 70, 32, 42, 32, 49, 46, 49, 57, 50, 48, 57, 50, 57, 48, 69, 45, 48, 55, 70, 0 ], "i8", t);

Yh = A([ 118, 105, 114, 116, 117, 97, 108, 32, 98, 111, 111, 108, 32, 98, 50, 80, 111, 108, 121, 103, 111, 110, 83, 104, 97, 112, 101, 58, 58, 82, 97, 121, 67, 97, 115, 116, 40, 98, 50, 82, 97, 121, 67, 97, 115, 116, 79, 117, 116, 112, 117, 116, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 82, 97, 121, 67, 97, 115, 116, 73, 110, 112, 117, 116, 32, 38, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 44, 32, 105, 110, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

Zh = A([ 48, 46, 48, 102, 32, 60, 61, 32, 108, 111, 119, 101, 114, 32, 38, 38, 32, 108, 111, 119, 101, 114, 32, 60, 61, 32, 105, 110, 112, 117, 116, 46, 109, 97, 120, 70, 114, 97, 99, 116, 105, 111, 110, 0 ], "i8", t);

ai = A([ 118, 105, 114, 116, 117, 97, 108, 32, 118, 111, 105, 100, 32, 98, 50, 80, 111, 108, 121, 103, 111, 110, 83, 104, 97, 112, 101, 58, 58, 67, 111, 109, 112, 117, 116, 101, 77, 97, 115, 115, 40, 98, 50, 77, 97, 115, 115, 68, 97, 116, 97, 32, 42, 44, 32, 102, 108, 111, 97, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

bi = A([ 109, 95, 118, 101, 114, 116, 101, 120, 67, 111, 117, 110, 116, 32, 62, 61, 32, 51, 0 ], "i8", t);

ci = A([ 97, 114, 101, 97, 32, 62, 32, 49, 46, 49, 57, 50, 48, 57, 50, 57, 48, 69, 45, 48, 55, 70, 0 ], "i8", t);

bc = A([ 0, 0, 90, 92, 94, 96, 98, 100, 102, 104 ], "i8*", t);

A(1, "void*", t);

rp = A([ 49, 52, 98, 50, 80, 111, 108, 121, 103, 111, 110, 83, 104, 97, 112, 101, 0 ], "i8", t);

sp = A(3, "i8*", t);

A([ 98, 50, 86, 101, 99, 50, 32, 67, 111, 109, 112, 117, 116, 101, 67, 101, 110, 116, 114, 111, 105, 100, 40, 99, 111, 110, 115, 116, 32, 98, 50, 86, 101, 99, 50, 32, 42, 44, 32, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

A([ 99, 111, 117, 110, 116, 32, 62, 61, 32, 51, 0 ], "i8", t);

ii = A([ 16, 32, 64, 96, 128, 160, 192, 224, 256, 320, 384, 448, 512, 640 ], "i32", t);

ji = A(641, "i8", t);

ei = A(1, "i8", t);

fi = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 109, 109, 111, 110, 47, 98, 50, 66, 108, 111, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 46, 99, 112, 112, 0 ], "i8", t);

gi = A([ 98, 50, 66, 108, 111, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 58, 58, 98, 50, 66, 108, 111, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 40, 41, 0 ], "i8", t);

hi = A([ 106, 32, 60, 32, 98, 50, 95, 98, 108, 111, 99, 107, 83, 105, 122, 101, 115, 0 ], "i8", t);

ti = A([ 118, 111, 105, 100, 32, 42, 98, 50, 66, 108, 111, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 58, 58, 65, 108, 108, 111, 99, 97, 116, 101, 40, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

mi = A([ 48, 32, 60, 32, 115, 105, 122, 101, 0 ], "i8", t);

ni = A([ 48, 32, 60, 61, 32, 105, 110, 100, 101, 120, 32, 38, 38, 32, 105, 110, 100, 101, 120, 32, 60, 32, 98, 50, 95, 98, 108, 111, 99, 107, 83, 105, 122, 101, 115, 0 ], "i8", t);

ui = A([ 98, 108, 111, 99, 107, 67, 111, 117, 110, 116, 32, 42, 32, 98, 108, 111, 99, 107, 83, 105, 122, 101, 32, 60, 61, 32, 98, 50, 95, 99, 104, 117, 110, 107, 83, 105, 122, 101, 0 ], "i8", t);

li = A([ 118, 111, 105, 100, 32, 98, 50, 66, 108, 111, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 58, 58, 70, 114, 101, 101, 40, 118, 111, 105, 100, 32, 42, 44, 32, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

tp = A([ 0, 0, 106, 108, 40, 40, 40, 40, 40, 40 ], "i8*", t);

A(1, "void*", t);

up = A([ 54, 98, 50, 68, 114, 97, 119, 0 ], "i8", t);

vp = A(2, "i8*", t);

ue = A(2, "float", t);

A([ 2, 2, 1 ], "i32", t);

Ai = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 109, 109, 111, 110, 47, 98, 50, 83, 116, 97, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 46, 99, 112, 112, 0 ], "i8", t);

Bi = A([ 98, 50, 83, 116, 97, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 58, 58, 126, 98, 50, 83, 116, 97, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 40, 41, 0 ], "i8", t);

Ci = A([ 109, 95, 105, 110, 100, 101, 120, 32, 61, 61, 32, 48, 0 ], "i8", t);

Di = A([ 109, 95, 101, 110, 116, 114, 121, 67, 111, 117, 110, 116, 32, 61, 61, 32, 48, 0 ], "i8", t);

Li = A([ 118, 111, 105, 100, 32, 42, 98, 50, 83, 116, 97, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 58, 58, 65, 108, 108, 111, 99, 97, 116, 101, 40, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

Mi = A([ 109, 95, 101, 110, 116, 114, 121, 67, 111, 117, 110, 116, 32, 60, 32, 98, 50, 95, 109, 97, 120, 83, 116, 97, 99, 107, 69, 110, 116, 114, 105, 101, 115, 0 ], "i8", t);

Fi = A([ 118, 111, 105, 100, 32, 98, 50, 83, 116, 97, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 58, 58, 70, 114, 101, 101, 40, 118, 111, 105, 100, 32, 42, 41, 0 ], "i8", t);

Gi = A([ 109, 95, 101, 110, 116, 114, 121, 67, 111, 117, 110, 116, 32, 62, 32, 48, 0 ], "i8", t);

Hi = A([ 112, 32, 61, 61, 32, 101, 110, 116, 114, 121, 45, 62, 100, 97, 116, 97, 0 ], "i8", t);

Si = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 98, 50, 66, 111, 100, 121, 46, 99, 112, 112, 0 ], "i8", t);

Ti = A([ 98, 50, 66, 111, 100, 121, 58, 58, 98, 50, 66, 111, 100, 121, 40, 99, 111, 110, 115, 116, 32, 98, 50, 66, 111, 100, 121, 68, 101, 102, 32, 42, 44, 32, 98, 50, 87, 111, 114, 108, 100, 32, 42, 41, 0 ], "i8", t);

Ui = A([ 98, 100, 45, 62, 112, 111, 115, 105, 116, 105, 111, 110, 46, 73, 115, 86, 97, 108, 105, 100, 40, 41, 0 ], "i8", t);

Vi = A([ 98, 100, 45, 62, 108, 105, 110, 101, 97, 114, 86, 101, 108, 111, 99, 105, 116, 121, 46, 73, 115, 86, 97, 108, 105, 100, 40, 41, 0 ], "i8", t);

Wi = A([ 98, 50, 73, 115, 86, 97, 108, 105, 100, 40, 98, 100, 45, 62, 97, 110, 103, 108, 101, 41, 0 ], "i8", t);

Xi = A([ 98, 50, 73, 115, 86, 97, 108, 105, 100, 40, 98, 100, 45, 62, 97, 110, 103, 117, 108, 97, 114, 86, 101, 108, 111, 99, 105, 116, 121, 41, 0 ], "i8", t);

Yi = A([ 98, 50, 73, 115, 86, 97, 108, 105, 100, 40, 98, 100, 45, 62, 97, 110, 103, 117, 108, 97, 114, 68, 97, 109, 112, 105, 110, 103, 41, 32, 38, 38, 32, 98, 100, 45, 62, 97, 110, 103, 117, 108, 97, 114, 68, 97, 109, 112, 105, 110, 103, 32, 62, 61, 32, 48, 46, 48, 102, 0 ], "i8", t);

Zi = A([ 98, 50, 73, 115, 86, 97, 108, 105, 100, 40, 98, 100, 45, 62, 108, 105, 110, 101, 97, 114, 68, 97, 109, 112, 105, 110, 103, 41, 32, 38, 38, 32, 98, 100, 45, 62, 108, 105, 110, 101, 97, 114, 68, 97, 109, 112, 105, 110, 103, 32, 62, 61, 32, 48, 46, 48, 102, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 66, 111, 100, 121, 58, 58, 83, 101, 116, 84, 121, 112, 101, 40, 98, 50, 66, 111, 100, 121, 84, 121, 112, 101, 41, 0 ], "i8", t);

jj = A([ 109, 95, 119, 111, 114, 108, 100, 45, 62, 73, 115, 76, 111, 99, 107, 101, 100, 40, 41, 32, 61, 61, 32, 102, 97, 108, 115, 101, 0 ], "i8", t);

ij = A([ 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 98, 50, 66, 111, 100, 121, 58, 58, 67, 114, 101, 97, 116, 101, 70, 105, 120, 116, 117, 114, 101, 40, 99, 111, 110, 115, 116, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 68, 101, 102, 32, 42, 41, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 66, 111, 100, 121, 58, 58, 68, 101, 115, 116, 114, 111, 121, 70, 105, 120, 116, 117, 114, 101, 40, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 41, 0 ], "i8", t);

A([ 102, 105, 120, 116, 117, 114, 101, 45, 62, 109, 95, 98, 111, 100, 121, 32, 61, 61, 32, 116, 104, 105, 115, 0 ], "i8", t);

A([ 109, 95, 102, 105, 120, 116, 117, 114, 101, 67, 111, 117, 110, 116, 32, 62, 32, 48, 0 ], "i8", t);

A([ 102, 111, 117, 110, 100, 0 ], "i8", t);

aj = A([ 118, 111, 105, 100, 32, 98, 50, 66, 111, 100, 121, 58, 58, 82, 101, 115, 101, 116, 77, 97, 115, 115, 68, 97, 116, 97, 40, 41, 0 ], "i8", t);

bj = A([ 109, 95, 116, 121, 112, 101, 32, 61, 61, 32, 98, 50, 95, 100, 121, 110, 97, 109, 105, 99, 66, 111, 100, 121, 0 ], "i8", t);

cj = A([ 109, 95, 73, 32, 62, 32, 48, 46, 48, 102, 0 ], "i8", t);

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

pj = A(1, "i32 (...)**", t);

qj = A(1, "i32 (...)**", t);

Gj = A([ 118, 111, 105, 100, 32, 42, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 71, 101, 116, 85, 115, 101, 114, 68, 97, 116, 97, 40, 105, 110, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

Og = A([ 48, 32, 60, 61, 32, 112, 114, 111, 120, 121, 73, 100, 32, 38, 38, 32, 112, 114, 111, 120, 121, 73, 100, 32, 60, 32, 109, 95, 110, 111, 100, 101, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

Jj = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 109, 109, 111, 110, 47, 98, 50, 71, 114, 111, 119, 97, 98, 108, 101, 83, 116, 97, 99, 107, 46, 104, 0 ], "i8", t);

Kj = A([ 105, 110, 116, 32, 98, 50, 71, 114, 111, 119, 97, 98, 108, 101, 83, 116, 97, 99, 107, 60, 105, 110, 116, 44, 32, 50, 53, 54, 62, 58, 58, 80, 111, 112, 40, 41, 0 ], "i8", t);

Lj = A([ 109, 95, 99, 111, 117, 110, 116, 32, 62, 32, 48, 0 ], "i8", t);

Fj = A([ 99, 111, 110, 115, 116, 32, 98, 50, 65, 65, 66, 66, 32, 38, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 71, 101, 116, 70, 97, 116, 65, 65, 66, 66, 40, 105, 110, 116, 51, 50, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

xp = A([ 0, 0, 6, 110, 112, 114, 116, 118 ], "i8*", t);

A(1, "void*", t);

yp = A([ 49, 55, 98, 50, 67, 111, 110, 116, 97, 99, 116, 76, 105, 115, 116, 101, 110, 101, 114, 0 ], "i8", t);

zp = A(2, "i8*", t);

Sj = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 98, 50, 70, 105, 120, 116, 117, 114, 101, 46, 99, 112, 112, 0 ], "i8", t);

Tj = A([ 118, 111, 105, 100, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 58, 58, 68, 101, 115, 116, 114, 111, 121, 40, 98, 50, 66, 108, 111, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 32, 42, 41, 0 ], "i8", t);

Uj = A([ 109, 95, 112, 114, 111, 120, 121, 67, 111, 117, 110, 116, 32, 61, 61, 32, 48, 0 ], "i8", t);

Vj = A([ 118, 111, 105, 100, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 58, 58, 67, 114, 101, 97, 116, 101, 80, 114, 111, 120, 105, 101, 115, 40, 98, 50, 66, 114, 111, 97, 100, 80, 104, 97, 115, 101, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 41, 0 ], "i8", t);

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

jk = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 98, 50, 73, 115, 108, 97, 110, 100, 46, 99, 112, 112, 0 ], "i8", t);

kk = A([ 118, 111, 105, 100, 32, 98, 50, 73, 115, 108, 97, 110, 100, 58, 58, 83, 111, 108, 118, 101, 84, 79, 73, 40, 99, 111, 110, 115, 116, 32, 98, 50, 84, 105, 109, 101, 83, 116, 101, 112, 32, 38, 44, 32, 105, 110, 116, 51, 50, 44, 32, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

lk = A([ 116, 111, 105, 73, 110, 100, 101, 120, 65, 32, 60, 32, 109, 95, 98, 111, 100, 121, 67, 111, 117, 110, 116, 0 ], "i8", t);

mk = A([ 116, 111, 105, 73, 110, 100, 101, 120, 66, 32, 60, 32, 109, 95, 98, 111, 100, 121, 67, 111, 117, 110, 116, 0 ], "i8", t);

ok = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 98, 50, 87, 111, 114, 108, 100, 46, 99, 112, 112, 0 ], "i8", t);

pk = A([ 98, 50, 66, 111, 100, 121, 32, 42, 98, 50, 87, 111, 114, 108, 100, 58, 58, 67, 114, 101, 97, 116, 101, 66, 111, 100, 121, 40, 99, 111, 110, 115, 116, 32, 98, 50, 66, 111, 100, 121, 68, 101, 102, 32, 42, 41, 0 ], "i8", t);

wk = A([ 73, 115, 76, 111, 99, 107, 101, 100, 40, 41, 32, 61, 61, 32, 102, 97, 108, 115, 101, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 87, 111, 114, 108, 100, 58, 58, 68, 101, 115, 116, 114, 111, 121, 66, 111, 100, 121, 40, 98, 50, 66, 111, 100, 121, 32, 42, 41, 0 ], "i8", t);

A([ 109, 95, 98, 111, 100, 121, 67, 111, 117, 110, 116, 32, 62, 32, 48, 0 ], "i8", t);

A([ 98, 50, 74, 111, 105, 110, 116, 32, 42, 98, 50, 87, 111, 114, 108, 100, 58, 58, 67, 114, 101, 97, 116, 101, 74, 111, 105, 110, 116, 40, 99, 111, 110, 115, 116, 32, 98, 50, 74, 111, 105, 110, 116, 68, 101, 102, 32, 42, 41, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 87, 111, 114, 108, 100, 58, 58, 68, 101, 115, 116, 114, 111, 121, 74, 111, 105, 110, 116, 40, 98, 50, 74, 111, 105, 110, 116, 32, 42, 41, 0 ], "i8", t);

A([ 109, 95, 106, 111, 105, 110, 116, 67, 111, 117, 110, 116, 32, 62, 32, 48, 0 ], "i8", t);

Pk = A([ 118, 111, 105, 100, 32, 98, 50, 87, 111, 114, 108, 100, 58, 58, 83, 111, 108, 118, 101, 40, 99, 111, 110, 115, 116, 32, 98, 50, 84, 105, 109, 101, 83, 116, 101, 112, 32, 38, 41, 0 ], "i8", t);

Qk = A([ 98, 45, 62, 73, 115, 65, 99, 116, 105, 118, 101, 40, 41, 32, 61, 61, 32, 116, 114, 117, 101, 0 ], "i8", t);

Rk = A([ 115, 116, 97, 99, 107, 67, 111, 117, 110, 116, 32, 60, 32, 115, 116, 97, 99, 107, 83, 105, 122, 101, 0 ], "i8", t);

Vk = A([ 118, 111, 105, 100, 32, 98, 50, 87, 111, 114, 108, 100, 58, 58, 83, 111, 108, 118, 101, 84, 79, 73, 40, 99, 111, 110, 115, 116, 32, 98, 50, 84, 105, 109, 101, 83, 116, 101, 112, 32, 38, 41, 0 ], "i8", t);

Wk = A([ 116, 121, 112, 101, 65, 32, 61, 61, 32, 98, 50, 95, 100, 121, 110, 97, 109, 105, 99, 66, 111, 100, 121, 32, 124, 124, 32, 116, 121, 112, 101, 66, 32, 61, 61, 32, 98, 50, 95, 100, 121, 110, 97, 109, 105, 99, 66, 111, 100, 121, 0 ], "i8", t);

Yk = A([ 97, 108, 112, 104, 97, 48, 32, 60, 32, 49, 46, 48, 102, 0 ], "i8", t);

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

Ej = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 108, 108, 105, 115, 105, 111, 110, 47, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 46, 104, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 68, 121, 110, 97, 109, 105, 99, 84, 114, 101, 101, 58, 58, 82, 97, 121, 67, 97, 115, 116, 40, 98, 50, 87, 111, 114, 108, 100, 82, 97, 121, 67, 97, 115, 116, 87, 114, 97, 112, 112, 101, 114, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 82, 97, 121, 67, 97, 115, 116, 73, 110, 112, 117, 116, 32, 38, 41, 32, 99, 111, 110, 115, 116, 0 ], "i8", t);

A([ 114, 46, 76, 101, 110, 103, 116, 104, 83, 113, 117, 97, 114, 101, 100, 40, 41, 32, 62, 32, 48, 46, 48, 102, 0 ], "i8", t);

al = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 67, 111, 109, 109, 111, 110, 47, 98, 50, 77, 97, 116, 104, 46, 104, 0 ], "i8", t);

bl = A([ 118, 111, 105, 100, 32, 98, 50, 83, 119, 101, 101, 112, 58, 58, 65, 100, 118, 97, 110, 99, 101, 40, 102, 108, 111, 97, 116, 51, 50, 41, 0 ], "i8", t);

Ik = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 98, 50, 73, 115, 108, 97, 110, 100, 46, 104, 0 ], "i8", t);

Sk = A([ 118, 111, 105, 100, 32, 98, 50, 73, 115, 108, 97, 110, 100, 58, 58, 65, 100, 100, 40, 98, 50, 74, 111, 105, 110, 116, 32, 42, 41, 0 ], "i8", t);

Tk = A([ 109, 95, 106, 111, 105, 110, 116, 67, 111, 117, 110, 116, 32, 60, 32, 109, 95, 106, 111, 105, 110, 116, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

Mk = A([ 118, 111, 105, 100, 32, 98, 50, 73, 115, 108, 97, 110, 100, 58, 58, 65, 100, 100, 40, 98, 50, 67, 111, 110, 116, 97, 99, 116, 32, 42, 41, 0 ], "i8", t);

Nk = A([ 109, 95, 99, 111, 110, 116, 97, 99, 116, 67, 111, 117, 110, 116, 32, 60, 32, 109, 95, 99, 111, 110, 116, 97, 99, 116, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

Jk = A([ 118, 111, 105, 100, 32, 98, 50, 73, 115, 108, 97, 110, 100, 58, 58, 65, 100, 100, 40, 98, 50, 66, 111, 100, 121, 32, 42, 41, 0 ], "i8", t);

Kk = A([ 109, 95, 98, 111, 100, 121, 67, 111, 117, 110, 116, 32, 60, 32, 109, 95, 98, 111, 100, 121, 67, 97, 112, 97, 99, 105, 116, 121, 0 ], "i8", t);

wp = A([ 0, 0, 4, 120, 122 ], "i8*", t);

A(1, "void*", t);

Ap = A([ 49, 53, 98, 50, 67, 111, 110, 116, 97, 99, 116, 70, 105, 108, 116, 101, 114, 0 ], "i8", t);

Bp = A(2, "i8*", t);

gl = A([ 0, 0, 124, 126, 128 ], "i8*", t);

A(1, "void*", t);

hl = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 67, 111, 110, 116, 97, 99, 116, 115, 47, 98, 50, 67, 104, 97, 105, 110, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 46, 99, 112, 112, 0 ], "i8", t);

il = A([ 98, 50, 67, 104, 97, 105, 110, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 58, 58, 98, 50, 67, 104, 97, 105, 110, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 40, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 105, 110, 116, 51, 50, 44, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

Cp = A([ 50, 51, 98, 50, 67, 104, 97, 105, 110, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 0 ], "i8", t);

Dp = A([ 57, 98, 50, 67, 111, 110, 116, 97, 99, 116, 0 ], "i8", t);

Ep = A(2, "i8*", t);

Fp = A(3, "i8*", t);

nl = A([ 0, 0, 130, 132, 134 ], "i8*", t);

A(1, "void*", t);

ol = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 67, 111, 110, 116, 97, 99, 116, 115, 47, 98, 50, 67, 104, 97, 105, 110, 65, 110, 100, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 46, 99, 112, 112, 0 ], "i8", t);

pl = A([ 98, 50, 67, 104, 97, 105, 110, 65, 110, 100, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 58, 58, 98, 50, 67, 104, 97, 105, 110, 65, 110, 100, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 40, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 105, 110, 116, 51, 50, 44, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

jl = A([ 109, 95, 102, 105, 120, 116, 117, 114, 101, 65, 45, 62, 71, 101, 116, 84, 121, 112, 101, 40, 41, 32, 61, 61, 32, 98, 50, 83, 104, 97, 112, 101, 58, 58, 101, 95, 99, 104, 97, 105, 110, 0 ], "i8", t);

Gp = A([ 50, 52, 98, 50, 67, 104, 97, 105, 110, 65, 110, 100, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 0 ], "i8", t);

Hp = A(3, "i8*", t);

tl = A([ 0, 0, 136, 138, 140 ], "i8*", t);

A(1, "void*", t);

ul = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 67, 111, 110, 116, 97, 99, 116, 115, 47, 98, 50, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 46, 99, 112, 112, 0 ], "i8", t);

vl = A([ 98, 50, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 58, 58, 98, 50, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 40, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 41, 0 ], "i8", t);

wl = A([ 109, 95, 102, 105, 120, 116, 117, 114, 101, 65, 45, 62, 71, 101, 116, 84, 121, 112, 101, 40, 41, 32, 61, 61, 32, 98, 50, 83, 104, 97, 112, 101, 58, 58, 101, 95, 99, 105, 114, 99, 108, 101, 0 ], "i8", t);

Ip = A([ 49, 53, 98, 50, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 0 ], "i8", t);

Jp = A(3, "i8*", t);

Cl = A(48, "%class.b2Contact.289* (%class.b2Fixture.281*, i32, %class.b2Fixture.281*, i32, %class.b2BlockAllocator.74*)*;void (%class.b2Contact.289*, %class.b2BlockAllocator.74*)*;i8;%class.b2Contact.289* (%class.b2Fixture.281*, i32, %class.b2Fixture.281*, i32, %class.b2BlockAllocator.74*)*;void (%class.b2Contact.289*, %class.b2BlockAllocator.74*)*;i8;%class.b2Contact.289* (%class.b2Fixture.281*, i32, %class.b2Fixture.281*, i32, %class.b2BlockAllocator.74*)*;void (%class.b2Contact.289*, %class.b2BlockAllocator.74*)*;i8;%class.b2Contact.289* (%class.b2Fixture.281*, i32, %class.b2Fixture.281*, i32, %class.b2BlockAllocator.74*)*;void (%class.b2Contact.289*, %class.b2BlockAllocator.74*)*;i8;%class.b2Contact.289* (%class.b2Fixture.281*, i32, %class.b2Fixture.281*, i32, %class.b2BlockAllocator.74*)*;void (%class.b2Contact.289*, %class.b2BlockAllocator.74*)*;i8;%class.b2Contact.289* (%class.b2Fixture.281*, i32, %class.b2Fixture.281*, i32, %class.b2BlockAllocator.74*)*;void (%class.b2Contact.289*, %class.b2BlockAllocator.74*)*;i8;%class.b2Contact.289* (%class.b2Fixture.281*, i32, %class.b2Fixture.281*, i32, %class.b2BlockAllocator.74*)*;void (%class.b2Contact.289*, %class.b2BlockAllocator.74*)*;i8;%class.b2Contact.289* (%class.b2Fixture.281*, i32, %class.b2Fixture.281*, i32, %class.b2BlockAllocator.74*)*;void (%class.b2Contact.289*, %class.b2BlockAllocator.74*)*;i8;%class.b2Contact.289* (%class.b2Fixture.281*, i32, %class.b2Fixture.281*, i32, %class.b2BlockAllocator.74*)*;void (%class.b2Contact.289*, %class.b2BlockAllocator.74*)*;i8;%class.b2Contact.289* (%class.b2Fixture.281*, i32, %class.b2Fixture.281*, i32, %class.b2BlockAllocator.74*)*;void (%class.b2Contact.289*, %class.b2BlockAllocator.74*)*;i8;%class.b2Contact.289* (%class.b2Fixture.281*, i32, %class.b2Fixture.281*, i32, %class.b2BlockAllocator.74*)*;void (%class.b2Contact.289*, %class.b2BlockAllocator.74*)*;i8;%class.b2Contact.289* (%class.b2Fixture.281*, i32, %class.b2Fixture.281*, i32, %class.b2BlockAllocator.74*)*;void (%class.b2Contact.289*, %class.b2BlockAllocator.74*)*;i8;%class.b2Contact.289* (%class.b2Fixture.281*, i32, %class.b2Fixture.281*, i32, %class.b2BlockAllocator.74*)*;void (%class.b2Contact.289*, %class.b2BlockAllocator.74*)*;i8;%class.b2Contact.289* (%class.b2Fixture.281*, i32, %class.b2Fixture.281*, i32, %class.b2BlockAllocator.74*)*;void (%class.b2Contact.289*, %class.b2BlockAllocator.74*)*;i8;%class.b2Contact.289* (%class.b2Fixture.281*, i32, %class.b2Fixture.281*, i32, %class.b2BlockAllocator.74*)*;void (%class.b2Contact.289*, %class.b2BlockAllocator.74*)*;i8;%class.b2Contact.289* (%class.b2Fixture.281*, i32, %class.b2Fixture.281*, i32, %class.b2BlockAllocator.74*)*;void (%class.b2Contact.289*, %class.b2BlockAllocator.74*)*;i8".split(";"), t);

Dl = A(1, "i8", t);

yl = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 67, 111, 110, 116, 97, 99, 116, 115, 47, 98, 50, 67, 111, 110, 116, 97, 99, 116, 46, 99, 112, 112, 0 ], "i8", t);

zl = A([ 115, 116, 97, 116, 105, 99, 32, 118, 111, 105, 100, 32, 98, 50, 67, 111, 110, 116, 97, 99, 116, 58, 58, 65, 100, 100, 84, 121, 112, 101, 40, 98, 50, 67, 111, 110, 116, 97, 99, 116, 67, 114, 101, 97, 116, 101, 70, 99, 110, 32, 42, 44, 32, 98, 50, 67, 111, 110, 116, 97, 99, 116, 68, 101, 115, 116, 114, 111, 121, 70, 99, 110, 32, 42, 44, 32, 98, 50, 83, 104, 97, 112, 101, 58, 58, 84, 121, 112, 101, 44, 32, 98, 50, 83, 104, 97, 112, 101, 58, 58, 84, 121, 112, 101, 41, 0 ], "i8", t);

Al = A([ 48, 32, 60, 61, 32, 116, 121, 112, 101, 49, 32, 38, 38, 32, 116, 121, 112, 101, 49, 32, 60, 32, 98, 50, 83, 104, 97, 112, 101, 58, 58, 101, 95, 116, 121, 112, 101, 67, 111, 117, 110, 116, 0 ], "i8", t);

Bl = A([ 48, 32, 60, 61, 32, 116, 121, 112, 101, 50, 32, 38, 38, 32, 116, 121, 112, 101, 50, 32, 60, 32, 98, 50, 83, 104, 97, 112, 101, 58, 58, 101, 95, 116, 121, 112, 101, 67, 111, 117, 110, 116, 0 ], "i8", t);

El = A([ 115, 116, 97, 116, 105, 99, 32, 98, 50, 67, 111, 110, 116, 97, 99, 116, 32, 42, 98, 50, 67, 111, 110, 116, 97, 99, 116, 58, 58, 67, 114, 101, 97, 116, 101, 40, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 105, 110, 116, 51, 50, 44, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 105, 110, 116, 51, 50, 44, 32, 98, 50, 66, 108, 111, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 32, 42, 41, 0 ], "i8", t);

Fl = A([ 115, 116, 97, 116, 105, 99, 32, 118, 111, 105, 100, 32, 98, 50, 67, 111, 110, 116, 97, 99, 116, 58, 58, 68, 101, 115, 116, 114, 111, 121, 40, 98, 50, 67, 111, 110, 116, 97, 99, 116, 32, 42, 44, 32, 98, 50, 66, 108, 111, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 32, 42, 41, 0 ], "i8", t);

Gl = A([ 115, 95, 105, 110, 105, 116, 105, 97, 108, 105, 122, 101, 100, 32, 61, 61, 32, 116, 114, 117, 101, 0 ], "i8", t);

Hl = A([ 48, 32, 60, 61, 32, 116, 121, 112, 101, 65, 32, 38, 38, 32, 116, 121, 112, 101, 66, 32, 60, 32, 98, 50, 83, 104, 97, 112, 101, 58, 58, 101, 95, 116, 121, 112, 101, 67, 111, 117, 110, 116, 0 ], "i8", t);

Il = A([ 0, 0, 40, 142, 144 ], "i8*", t);

A(1, "void*", t);

Kl = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 67, 111, 110, 116, 97, 99, 116, 115, 47, 98, 50, 67, 111, 110, 116, 97, 99, 116, 83, 111, 108, 118, 101, 114, 46, 99, 112, 112, 0 ], "i8", t);

Ll = A([ 98, 50, 67, 111, 110, 116, 97, 99, 116, 83, 111, 108, 118, 101, 114, 58, 58, 98, 50, 67, 111, 110, 116, 97, 99, 116, 83, 111, 108, 118, 101, 114, 40, 98, 50, 67, 111, 110, 116, 97, 99, 116, 83, 111, 108, 118, 101, 114, 68, 101, 102, 32, 42, 41, 0 ], "i8", t);

Ml = A([ 112, 111, 105, 110, 116, 67, 111, 117, 110, 116, 32, 62, 32, 48, 0 ], "i8", t);

Nl = A([ 118, 111, 105, 100, 32, 98, 50, 67, 111, 110, 116, 97, 99, 116, 83, 111, 108, 118, 101, 114, 58, 58, 73, 110, 105, 116, 105, 97, 108, 105, 122, 101, 86, 101, 108, 111, 99, 105, 116, 121, 67, 111, 110, 115, 116, 114, 97, 105, 110, 116, 115, 40, 41, 0 ], "i8", t);

Ol = A([ 109, 97, 110, 105, 102, 111, 108, 100, 45, 62, 112, 111, 105, 110, 116, 67, 111, 117, 110, 116, 32, 62, 32, 48, 0 ], "i8", t);

Rl = A([ 118, 111, 105, 100, 32, 98, 50, 67, 111, 110, 116, 97, 99, 116, 83, 111, 108, 118, 101, 114, 58, 58, 83, 111, 108, 118, 101, 86, 101, 108, 111, 99, 105, 116, 121, 67, 111, 110, 115, 116, 114, 97, 105, 110, 116, 115, 40, 41, 0 ], "i8", t);

Sl = A([ 112, 111, 105, 110, 116, 67, 111, 117, 110, 116, 32, 61, 61, 32, 49, 32, 124, 124, 32, 112, 111, 105, 110, 116, 67, 111, 117, 110, 116, 32, 61, 61, 32, 50, 0 ], "i8", t);

Tl = A([ 97, 46, 120, 32, 62, 61, 32, 48, 46, 48, 102, 32, 38, 38, 32, 97, 46, 121, 32, 62, 61, 32, 48, 46, 48, 102, 0 ], "i8", t);

Vl = A([ 118, 111, 105, 100, 32, 98, 50, 80, 111, 115, 105, 116, 105, 111, 110, 83, 111, 108, 118, 101, 114, 77, 97, 110, 105, 102, 111, 108, 100, 58, 58, 73, 110, 105, 116, 105, 97, 108, 105, 122, 101, 40, 98, 50, 67, 111, 110, 116, 97, 99, 116, 80, 111, 115, 105, 116, 105, 111, 110, 67, 111, 110, 115, 116, 114, 97, 105, 110, 116, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 84, 114, 97, 110, 115, 102, 111, 114, 109, 32, 38, 44, 32, 105, 110, 116, 51, 50, 41, 0 ], "i8", t);

Wl = A([ 112, 99, 45, 62, 112, 111, 105, 110, 116, 67, 111, 117, 110, 116, 32, 62, 32, 48, 0 ], "i8", t);

Yl = A([ 0, 0, 146, 148, 150 ], "i8*", t);

A(1, "void*", t);

Zl = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 67, 111, 110, 116, 97, 99, 116, 115, 47, 98, 50, 69, 100, 103, 101, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 46, 99, 112, 112, 0 ], "i8", t);

$l = A([ 98, 50, 69, 100, 103, 101, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 58, 58, 98, 50, 69, 100, 103, 101, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 40, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 41, 0 ], "i8", t);

Kp = A([ 50, 50, 98, 50, 69, 100, 103, 101, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 0 ], "i8", t);

Lp = A(3, "i8*", t);

fm = A([ 0, 0, 152, 154, 156 ], "i8*", t);

A(1, "void*", t);

gm = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 67, 111, 110, 116, 97, 99, 116, 115, 47, 98, 50, 69, 100, 103, 101, 65, 110, 100, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 46, 99, 112, 112, 0 ], "i8", t);

hm = A([ 98, 50, 69, 100, 103, 101, 65, 110, 100, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 58, 58, 98, 50, 69, 100, 103, 101, 65, 110, 100, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 40, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 41, 0 ], "i8", t);

am = A([ 109, 95, 102, 105, 120, 116, 117, 114, 101, 65, 45, 62, 71, 101, 116, 84, 121, 112, 101, 40, 41, 32, 61, 61, 32, 98, 50, 83, 104, 97, 112, 101, 58, 58, 101, 95, 101, 100, 103, 101, 0 ], "i8", t);

Mp = A([ 50, 51, 98, 50, 69, 100, 103, 101, 65, 110, 100, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 0 ], "i8", t);

Np = A(3, "i8*", t);

jm = A([ 0, 0, 158, 160, 162 ], "i8*", t);

A(1, "void*", t);

km = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 67, 111, 110, 116, 97, 99, 116, 115, 47, 98, 50, 80, 111, 108, 121, 103, 111, 110, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 46, 99, 112, 112, 0 ], "i8", t);

lm = A([ 98, 50, 80, 111, 108, 121, 103, 111, 110, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 58, 58, 98, 50, 80, 111, 108, 121, 103, 111, 110, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 40, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 41, 0 ], "i8", t);

kl = A([ 109, 95, 102, 105, 120, 116, 117, 114, 101, 66, 45, 62, 71, 101, 116, 84, 121, 112, 101, 40, 41, 32, 61, 61, 32, 98, 50, 83, 104, 97, 112, 101, 58, 58, 101, 95, 99, 105, 114, 99, 108, 101, 0 ], "i8", t);

Op = A([ 50, 53, 98, 50, 80, 111, 108, 121, 103, 111, 110, 65, 110, 100, 67, 105, 114, 99, 108, 101, 67, 111, 110, 116, 97, 99, 116, 0 ], "i8", t);

Pp = A(3, "i8*", t);

om = A([ 0, 0, 164, 166, 168 ], "i8*", t);

A(1, "void*", t);

pm = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 67, 111, 110, 116, 97, 99, 116, 115, 47, 98, 50, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 46, 99, 112, 112, 0 ], "i8", t);

qm = A([ 98, 50, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 58, 58, 98, 50, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 40, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 44, 32, 98, 50, 70, 105, 120, 116, 117, 114, 101, 32, 42, 41, 0 ], "i8", t);

mm = A([ 109, 95, 102, 105, 120, 116, 117, 114, 101, 65, 45, 62, 71, 101, 116, 84, 121, 112, 101, 40, 41, 32, 61, 61, 32, 98, 50, 83, 104, 97, 112, 101, 58, 58, 101, 95, 112, 111, 108, 121, 103, 111, 110, 0 ], "i8", t);

ql = A([ 109, 95, 102, 105, 120, 116, 117, 114, 101, 66, 45, 62, 71, 101, 116, 84, 121, 112, 101, 40, 41, 32, 61, 61, 32, 98, 50, 83, 104, 97, 112, 101, 58, 58, 101, 95, 112, 111, 108, 121, 103, 111, 110, 0 ], "i8", t);

Qp = A([ 49, 54, 98, 50, 80, 111, 108, 121, 103, 111, 110, 67, 111, 110, 116, 97, 99, 116, 0 ], "i8", t);

Rp = A(3, "i8*", t);

dm = A([ 0, 0, 170, 172, 174, 176, 178, 180, 182, 184, 186, 188 ], "i8*", t);

A(1, "void*", t);

tm = A([ 32, 32, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 74, 111, 105, 110, 116, 68, 101, 102, 32, 106, 100, 59, 10, 0 ], "i8", t);

zm = A([ 32, 32, 106, 100, 46, 108, 101, 110, 103, 116, 104, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

Sp = A([ 49, 53, 98, 50, 68, 105, 115, 116, 97, 110, 99, 101, 74, 111, 105, 110, 116, 0 ], "i8", t);

Tp = A([ 55, 98, 50, 74, 111, 105, 110, 116, 0 ], "i8", t);

Up = A(2, "i8*", t);

Vp = A(3, "i8*", t);

Im = A([ 0, 0, 190, 192, 194, 196, 198, 200, 202, 204, 206, 208 ], "i8*", t);

A(1, "void*", t);

A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 74, 111, 105, 110, 116, 115, 47, 98, 50, 70, 114, 105, 99, 116, 105, 111, 110, 74, 111, 105, 110, 116, 46, 99, 112, 112, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 70, 114, 105, 99, 116, 105, 111, 110, 74, 111, 105, 110, 116, 58, 58, 83, 101, 116, 77, 97, 120, 70, 111, 114, 99, 101, 40, 102, 108, 111, 97, 116, 51, 50, 41, 0 ], "i8", t);

A([ 98, 50, 73, 115, 86, 97, 108, 105, 100, 40, 102, 111, 114, 99, 101, 41, 32, 38, 38, 32, 102, 111, 114, 99, 101, 32, 62, 61, 32, 48, 46, 48, 102, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 70, 114, 105, 99, 116, 105, 111, 110, 74, 111, 105, 110, 116, 58, 58, 83, 101, 116, 77, 97, 120, 84, 111, 114, 113, 117, 101, 40, 102, 108, 111, 97, 116, 51, 50, 41, 0 ], "i8", t);

A([ 98, 50, 73, 115, 86, 97, 108, 105, 100, 40, 116, 111, 114, 113, 117, 101, 41, 32, 38, 38, 32, 116, 111, 114, 113, 117, 101, 32, 62, 61, 32, 48, 46, 48, 102, 0 ], "i8", t);

Km = A([ 32, 32, 98, 50, 70, 114, 105, 99, 116, 105, 111, 110, 74, 111, 105, 110, 116, 68, 101, 102, 32, 106, 100, 59, 10, 0 ], "i8", t);

Lm = A([ 32, 32, 106, 100, 46, 109, 97, 120, 70, 111, 114, 99, 101, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

Mm = A([ 32, 32, 106, 100, 46, 109, 97, 120, 84, 111, 114, 113, 117, 101, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

Wp = A([ 49, 53, 98, 50, 70, 114, 105, 99, 116, 105, 111, 110, 74, 111, 105, 110, 116, 0 ], "i8", t);

Xp = A(3, "i8*", t);

Qm = A([ 0, 0, 210, 212, 214, 216, 218, 220, 222, 224, 226, 228 ], "i8*", t);

A(1, "void*", t);

Rm = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 74, 111, 105, 110, 116, 115, 47, 98, 50, 71, 101, 97, 114, 74, 111, 105, 110, 116, 46, 99, 112, 112, 0 ], "i8", t);

Sm = A([ 98, 50, 71, 101, 97, 114, 74, 111, 105, 110, 116, 58, 58, 98, 50, 71, 101, 97, 114, 74, 111, 105, 110, 116, 40, 99, 111, 110, 115, 116, 32, 98, 50, 71, 101, 97, 114, 74, 111, 105, 110, 116, 68, 101, 102, 32, 42, 41, 0 ], "i8", t);

Tm = A([ 109, 95, 116, 121, 112, 101, 65, 32, 61, 61, 32, 101, 95, 114, 101, 118, 111, 108, 117, 116, 101, 74, 111, 105, 110, 116, 32, 124, 124, 32, 109, 95, 116, 121, 112, 101, 65, 32, 61, 61, 32, 101, 95, 112, 114, 105, 115, 109, 97, 116, 105, 99, 74, 111, 105, 110, 116, 0 ], "i8", t);

Um = A([ 109, 95, 116, 121, 112, 101, 66, 32, 61, 61, 32, 101, 95, 114, 101, 118, 111, 108, 117, 116, 101, 74, 111, 105, 110, 116, 32, 124, 124, 32, 109, 95, 116, 121, 112, 101, 66, 32, 61, 61, 32, 101, 95, 112, 114, 105, 115, 109, 97, 116, 105, 99, 74, 111, 105, 110, 116, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 71, 101, 97, 114, 74, 111, 105, 110, 116, 58, 58, 83, 101, 116, 82, 97, 116, 105, 111, 40, 102, 108, 111, 97, 116, 51, 50, 41, 0 ], "i8", t);

A([ 98, 50, 73, 115, 86, 97, 108, 105, 100, 40, 114, 97, 116, 105, 111, 41, 0 ], "i8", t);

Ym = A([ 32, 32, 98, 50, 71, 101, 97, 114, 74, 111, 105, 110, 116, 68, 101, 102, 32, 106, 100, 59, 10, 0 ], "i8", t);

Zm = A([ 32, 32, 106, 100, 46, 106, 111, 105, 110, 116, 49, 32, 61, 32, 106, 111, 105, 110, 116, 115, 91, 37, 100, 93, 59, 10, 0 ], "i8", t);

$m = A([ 32, 32, 106, 100, 46, 106, 111, 105, 110, 116, 50, 32, 61, 32, 106, 111, 105, 110, 116, 115, 91, 37, 100, 93, 59, 10, 0 ], "i8", t);

Yp = A([ 49, 49, 98, 50, 71, 101, 97, 114, 74, 111, 105, 110, 116, 0 ], "i8", t);

Zp = A(3, "i8*", t);

dn = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 74, 111, 105, 110, 116, 115, 47, 98, 50, 74, 111, 105, 110, 116, 46, 99, 112, 112, 0 ], "i8", t);

A([ 115, 116, 97, 116, 105, 99, 32, 98, 50, 74, 111, 105, 110, 116, 32, 42, 98, 50, 74, 111, 105, 110, 116, 58, 58, 67, 114, 101, 97, 116, 101, 40, 99, 111, 110, 115, 116, 32, 98, 50, 74, 111, 105, 110, 116, 68, 101, 102, 32, 42, 44, 32, 98, 50, 66, 108, 111, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 32, 42, 41, 0 ], "i8", t);

pe = A([ 102, 97, 108, 115, 101, 0 ], "i8", t);

A([ 115, 116, 97, 116, 105, 99, 32, 118, 111, 105, 100, 32, 98, 50, 74, 111, 105, 110, 116, 58, 58, 68, 101, 115, 116, 114, 111, 121, 40, 98, 50, 74, 111, 105, 110, 116, 32, 42, 44, 32, 98, 50, 66, 108, 111, 99, 107, 65, 108, 108, 111, 99, 97, 116, 111, 114, 32, 42, 41, 0 ], "i8", t);

cn = A([ 0, 0, 40, 40, 40, 40, 230, 232, 234, 40, 40, 40 ], "i8*", t);

A(1, "void*", t);

en = A([ 98, 50, 74, 111, 105, 110, 116, 58, 58, 98, 50, 74, 111, 105, 110, 116, 40, 99, 111, 110, 115, 116, 32, 98, 50, 74, 111, 105, 110, 116, 68, 101, 102, 32, 42, 41, 0 ], "i8", t);

fn = A([ 100, 101, 102, 45, 62, 98, 111, 100, 121, 65, 32, 33, 61, 32, 100, 101, 102, 45, 62, 98, 111, 100, 121, 66, 0 ], "i8", t);

$p = A([ 47, 47, 32, 68, 117, 109, 112, 32, 105, 115, 32, 110, 111, 116, 32, 115, 117, 112, 112, 111, 114, 116, 101, 100, 32, 102, 111, 114, 32, 116, 104, 105, 115, 32, 106, 111, 105, 110, 116, 32, 116, 121, 112, 101, 46, 10, 0 ], "i8", t);

hn = A([ 0, 0, 236, 238, 240, 242, 244, 246, 248, 250, 252, 254 ], "i8*", t);

A(1, "void*", t);

jn = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 74, 111, 105, 110, 116, 115, 47, 98, 50, 77, 111, 117, 115, 101, 74, 111, 105, 110, 116, 46, 99, 112, 112, 0 ], "i8", t);

kn = A([ 98, 50, 77, 111, 117, 115, 101, 74, 111, 105, 110, 116, 58, 58, 98, 50, 77, 111, 117, 115, 101, 74, 111, 105, 110, 116, 40, 99, 111, 110, 115, 116, 32, 98, 50, 77, 111, 117, 115, 101, 74, 111, 105, 110, 116, 68, 101, 102, 32, 42, 41, 0 ], "i8", t);

ln = A([ 100, 101, 102, 45, 62, 116, 97, 114, 103, 101, 116, 46, 73, 115, 86, 97, 108, 105, 100, 40, 41, 0 ], "i8", t);

mn = A([ 98, 50, 73, 115, 86, 97, 108, 105, 100, 40, 100, 101, 102, 45, 62, 109, 97, 120, 70, 111, 114, 99, 101, 41, 32, 38, 38, 32, 100, 101, 102, 45, 62, 109, 97, 120, 70, 111, 114, 99, 101, 32, 62, 61, 32, 48, 46, 48, 102, 0 ], "i8", t);

nn = A([ 98, 50, 73, 115, 86, 97, 108, 105, 100, 40, 100, 101, 102, 45, 62, 102, 114, 101, 113, 117, 101, 110, 99, 121, 72, 122, 41, 32, 38, 38, 32, 100, 101, 102, 45, 62, 102, 114, 101, 113, 117, 101, 110, 99, 121, 72, 122, 32, 62, 61, 32, 48, 46, 48, 102, 0 ], "i8", t);

on = A([ 98, 50, 73, 115, 86, 97, 108, 105, 100, 40, 100, 101, 102, 45, 62, 100, 97, 109, 112, 105, 110, 103, 82, 97, 116, 105, 111, 41, 32, 38, 38, 32, 100, 101, 102, 45, 62, 100, 97, 109, 112, 105, 110, 103, 82, 97, 116, 105, 111, 32, 62, 61, 32, 48, 46, 48, 102, 0 ], "i8", t);

qn = A([ 118, 105, 114, 116, 117, 97, 108, 32, 118, 111, 105, 100, 32, 98, 50, 77, 111, 117, 115, 101, 74, 111, 105, 110, 116, 58, 58, 73, 110, 105, 116, 86, 101, 108, 111, 99, 105, 116, 121, 67, 111, 110, 115, 116, 114, 97, 105, 110, 116, 115, 40, 99, 111, 110, 115, 116, 32, 98, 50, 83, 111, 108, 118, 101, 114, 68, 97, 116, 97, 32, 38, 41, 0 ], "i8", t);

rn = A([ 100, 32, 43, 32, 104, 32, 42, 32, 107, 32, 62, 32, 49, 46, 49, 57, 50, 48, 57, 50, 57, 48, 69, 45, 48, 55, 70, 0 ], "i8", t);

aq = A([ 49, 50, 98, 50, 77, 111, 117, 115, 101, 74, 111, 105, 110, 116, 0 ], "i8", t);

bq = A(3, "i8*", t);

cq = A([ 77, 111, 117, 115, 101, 32, 106, 111, 105, 110, 116, 32, 100, 117, 109, 112, 105, 110, 103, 32, 105, 115, 32, 110, 111, 116, 32, 115, 117, 112, 112, 111, 114, 116, 101, 100, 46, 10, 0 ], "i8", t);

xn = A([ 0, 0, 256, 258, 260, 262, 264, 266, 268, 270, 272, 274 ], "i8*", t);

A(1, "void*", t);

A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 74, 111, 105, 110, 116, 115, 47, 98, 50, 80, 114, 105, 115, 109, 97, 116, 105, 99, 74, 111, 105, 110, 116, 46, 99, 112, 112, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 80, 114, 105, 115, 109, 97, 116, 105, 99, 74, 111, 105, 110, 116, 58, 58, 83, 101, 116, 76, 105, 109, 105, 116, 115, 40, 102, 108, 111, 97, 116, 51, 50, 44, 32, 102, 108, 111, 97, 116, 51, 50, 41, 0 ], "i8", t);

Gn = A([ 32, 32, 98, 50, 80, 114, 105, 115, 109, 97, 116, 105, 99, 74, 111, 105, 110, 116, 68, 101, 102, 32, 106, 100, 59, 10, 0 ], "i8", t);

Kn = A([ 32, 32, 106, 100, 46, 108, 111, 119, 101, 114, 84, 114, 97, 110, 115, 108, 97, 116, 105, 111, 110, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

Ln = A([ 32, 32, 106, 100, 46, 117, 112, 112, 101, 114, 84, 114, 97, 110, 115, 108, 97, 116, 105, 111, 110, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

On = A([ 32, 32, 106, 100, 46, 109, 97, 120, 77, 111, 116, 111, 114, 70, 111, 114, 99, 101, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

dq = A([ 49, 54, 98, 50, 80, 114, 105, 115, 109, 97, 116, 105, 99, 74, 111, 105, 110, 116, 0 ], "i8", t);

eq = A(3, "i8*", t);

Rn = A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 74, 111, 105, 110, 116, 115, 47, 98, 50, 80, 117, 108, 108, 101, 121, 74, 111, 105, 110, 116, 46, 99, 112, 112, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 80, 117, 108, 108, 101, 121, 74, 111, 105, 110, 116, 68, 101, 102, 58, 58, 73, 110, 105, 116, 105, 97, 108, 105, 122, 101, 40, 98, 50, 66, 111, 100, 121, 32, 42, 44, 32, 98, 50, 66, 111, 100, 121, 32, 42, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 86, 101, 99, 50, 32, 38, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 86, 101, 99, 50, 32, 38, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 86, 101, 99, 50, 32, 38, 44, 32, 99, 111, 110, 115, 116, 32, 98, 50, 86, 101, 99, 50, 32, 38, 44, 32, 102, 108, 111, 97, 116, 51, 50, 41, 0 ], "i8", t);

A([ 114, 97, 116, 105, 111, 32, 62, 32, 49, 46, 49, 57, 50, 48, 57, 50, 57, 48, 69, 45, 48, 55, 70, 0 ], "i8", t);

Qn = A([ 0, 0, 276, 278, 280, 282, 284, 286, 288, 290, 292, 294 ], "i8*", t);

A(1, "void*", t);

Sn = A([ 98, 50, 80, 117, 108, 108, 101, 121, 74, 111, 105, 110, 116, 58, 58, 98, 50, 80, 117, 108, 108, 101, 121, 74, 111, 105, 110, 116, 40, 99, 111, 110, 115, 116, 32, 98, 50, 80, 117, 108, 108, 101, 121, 74, 111, 105, 110, 116, 68, 101, 102, 32, 42, 41, 0 ], "i8", t);

Tn = A([ 100, 101, 102, 45, 62, 114, 97, 116, 105, 111, 32, 33, 61, 32, 48, 46, 48, 102, 0 ], "i8", t);

Xn = A([ 32, 32, 98, 50, 80, 117, 108, 108, 101, 121, 74, 111, 105, 110, 116, 68, 101, 102, 32, 106, 100, 59, 10, 0 ], "i8", t);

Yn = A([ 32, 32, 106, 100, 46, 103, 114, 111, 117, 110, 100, 65, 110, 99, 104, 111, 114, 65, 46, 83, 101, 116, 40, 37, 46, 49, 53, 108, 101, 102, 44, 32, 37, 46, 49, 53, 108, 101, 102, 41, 59, 10, 0 ], "i8", t);

Zn = A([ 32, 32, 106, 100, 46, 103, 114, 111, 117, 110, 100, 65, 110, 99, 104, 111, 114, 66, 46, 83, 101, 116, 40, 37, 46, 49, 53, 108, 101, 102, 44, 32, 37, 46, 49, 53, 108, 101, 102, 41, 59, 10, 0 ], "i8", t);

$n = A([ 32, 32, 106, 100, 46, 108, 101, 110, 103, 116, 104, 65, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

ao = A([ 32, 32, 106, 100, 46, 108, 101, 110, 103, 116, 104, 66, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

an = A([ 32, 32, 106, 100, 46, 114, 97, 116, 105, 111, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

fq = A([ 49, 51, 98, 50, 80, 117, 108, 108, 101, 121, 74, 111, 105, 110, 116, 0 ], "i8", t);

gq = A(3, "i8*", t);

co = A([ 0, 0, 296, 298, 300, 302, 304, 306, 308, 310, 312, 314 ], "i8*", t);

A(1, "void*", t);

A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 68, 121, 110, 97, 109, 105, 99, 115, 47, 74, 111, 105, 110, 116, 115, 47, 98, 50, 82, 101, 118, 111, 108, 117, 116, 101, 74, 111, 105, 110, 116, 46, 99, 112, 112, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 82, 101, 118, 111, 108, 117, 116, 101, 74, 111, 105, 110, 116, 58, 58, 83, 101, 116, 76, 105, 109, 105, 116, 115, 40, 102, 108, 111, 97, 116, 51, 50, 44, 32, 102, 108, 111, 97, 116, 51, 50, 41, 0 ], "i8", t);

A([ 108, 111, 119, 101, 114, 32, 60, 61, 32, 117, 112, 112, 101, 114, 0 ], "i8", t);

jo = A([ 32, 32, 98, 50, 82, 101, 118, 111, 108, 117, 116, 101, 74, 111, 105, 110, 116, 68, 101, 102, 32, 106, 100, 59, 10, 0 ], "i8", t);

Jn = A([ 32, 32, 106, 100, 46, 101, 110, 97, 98, 108, 101, 76, 105, 109, 105, 116, 32, 61, 32, 98, 111, 111, 108, 40, 37, 100, 41, 59, 10, 0 ], "i8", t);

ko = A([ 32, 32, 106, 100, 46, 108, 111, 119, 101, 114, 65, 110, 103, 108, 101, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

lo = A([ 32, 32, 106, 100, 46, 117, 112, 112, 101, 114, 65, 110, 103, 108, 101, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

hq = A([ 49, 53, 98, 50, 82, 101, 118, 111, 108, 117, 116, 101, 74, 111, 105, 110, 116, 0 ], "i8", t);

xq = A(3, "i8*", t);

oo = A([ 0, 0, 316, 318, 320, 322, 324, 326, 328, 330, 332, 334 ], "i8*", t);

A(1, "void*", t);

so = A([ 32, 32, 98, 50, 82, 111, 112, 101, 74, 111, 105, 110, 116, 68, 101, 102, 32, 106, 100, 59, 10, 0 ], "i8", t);

to = A([ 32, 32, 106, 100, 46, 109, 97, 120, 76, 101, 110, 103, 116, 104, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

yq = A([ 49, 49, 98, 50, 82, 111, 112, 101, 74, 111, 105, 110, 116, 0 ], "i8", t);

zq = A(3, "i8*", t);

vo = A([ 0, 0, 336, 338, 340, 342, 344, 346, 348, 350, 352, 354 ], "i8*", t);

A(1, "void*", t);

zo = A([ 32, 32, 98, 50, 87, 101, 108, 100, 74, 111, 105, 110, 116, 68, 101, 102, 32, 106, 100, 59, 10, 0 ], "i8", t);

In = A([ 32, 32, 106, 100, 46, 114, 101, 102, 101, 114, 101, 110, 99, 101, 65, 110, 103, 108, 101, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

Aq = A([ 49, 49, 98, 50, 87, 101, 108, 100, 74, 111, 105, 110, 116, 0 ], "i8", t);

Bq = A(3, "i8*", t);

Fo = A([ 0, 0, 356, 358, 360, 362, 364, 366, 368, 370, 372, 374 ], "i8*", t);

A(1, "void*", t);

Jo = A([ 32, 32, 98, 50, 87, 104, 101, 101, 108, 74, 111, 105, 110, 116, 68, 101, 102, 32, 106, 100, 59, 10, 0 ], "i8", t);

um = A([ 32, 32, 106, 100, 46, 98, 111, 100, 121, 65, 32, 61, 32, 98, 111, 100, 105, 101, 115, 91, 37, 100, 93, 59, 10, 0 ], "i8", t);

vm = A([ 32, 32, 106, 100, 46, 98, 111, 100, 121, 66, 32, 61, 32, 98, 111, 100, 105, 101, 115, 91, 37, 100, 93, 59, 10, 0 ], "i8", t);

wm = A([ 32, 32, 106, 100, 46, 99, 111, 108, 108, 105, 100, 101, 67, 111, 110, 110, 101, 99, 116, 101, 100, 32, 61, 32, 98, 111, 111, 108, 40, 37, 100, 41, 59, 10, 0 ], "i8", t);

xm = A([ 32, 32, 106, 100, 46, 108, 111, 99, 97, 108, 65, 110, 99, 104, 111, 114, 65, 46, 83, 101, 116, 40, 37, 46, 49, 53, 108, 101, 102, 44, 32, 37, 46, 49, 53, 108, 101, 102, 41, 59, 10, 0 ], "i8", t);

ym = A([ 32, 32, 106, 100, 46, 108, 111, 99, 97, 108, 65, 110, 99, 104, 111, 114, 66, 46, 83, 101, 116, 40, 37, 46, 49, 53, 108, 101, 102, 44, 32, 37, 46, 49, 53, 108, 101, 102, 41, 59, 10, 0 ], "i8", t);

Hn = A([ 32, 32, 106, 100, 46, 108, 111, 99, 97, 108, 65, 120, 105, 115, 65, 46, 83, 101, 116, 40, 37, 46, 49, 53, 108, 101, 102, 44, 32, 37, 46, 49, 53, 108, 101, 102, 41, 59, 10, 0 ], "i8", t);

Mn = A([ 32, 32, 106, 100, 46, 101, 110, 97, 98, 108, 101, 77, 111, 116, 111, 114, 32, 61, 32, 98, 111, 111, 108, 40, 37, 100, 41, 59, 10, 0 ], "i8", t);

Nn = A([ 32, 32, 106, 100, 46, 109, 111, 116, 111, 114, 83, 112, 101, 101, 100, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

mo = A([ 32, 32, 106, 100, 46, 109, 97, 120, 77, 111, 116, 111, 114, 84, 111, 114, 113, 117, 101, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

Am = A([ 32, 32, 106, 100, 46, 102, 114, 101, 113, 117, 101, 110, 99, 121, 72, 122, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

Bm = A([ 32, 32, 106, 100, 46, 100, 97, 109, 112, 105, 110, 103, 82, 97, 116, 105, 111, 32, 61, 32, 37, 46, 49, 53, 108, 101, 102, 59, 10, 0 ], "i8", t);

Cm = A([ 32, 32, 106, 111, 105, 110, 116, 115, 91, 37, 100, 93, 32, 61, 32, 109, 95, 119, 111, 114, 108, 100, 45, 62, 67, 114, 101, 97, 116, 101, 74, 111, 105, 110, 116, 40, 38, 106, 100, 41, 59, 10, 0 ], "i8", t);

Cq = A([ 49, 50, 98, 50, 87, 104, 101, 101, 108, 74, 111, 105, 110, 116, 0 ], "i8", t);

Dq = A(3, "i8*", t);

A([ 66, 111, 120, 50, 68, 95, 118, 50, 46, 50, 46, 49, 47, 66, 111, 120, 50, 68, 47, 82, 111, 112, 101, 47, 98, 50, 82, 111, 112, 101, 46, 99, 112, 112, 0 ], "i8", t);

A([ 118, 111, 105, 100, 32, 98, 50, 82, 111, 112, 101, 58, 58, 73, 110, 105, 116, 105, 97, 108, 105, 122, 101, 40, 99, 111, 110, 115, 116, 32, 98, 50, 82, 111, 112, 101, 68, 101, 102, 32, 42, 41, 0 ], "i8", t);

A([ 100, 101, 102, 45, 62, 99, 111, 117, 110, 116, 32, 62, 61, 32, 51, 0 ], "i8", t);

b[Wb + 1] = ip;

gp = A([ 1, 0 ], [ "i8*", 0 ], t);

b[ip] = gp + 2;

b[ip + 1] = hp;

b[vh + 1] = lp;

jp = A([ 2, 0 ], [ "i8*", 0 ], t);

b[lp] = jp + 2;

b[lp + 1] = kp;

b[lp + 2] = ip;

b[mp + 1] = op;

b[op] = jp + 2;

b[op + 1] = np;

b[op + 2] = ip;

b[lc + 1] = qp;

b[qp] = jp + 2;

b[qp + 1] = pp;

b[qp + 2] = ip;

b[bc + 1] = sp;

b[sp] = jp + 2;

b[sp + 1] = rp;

b[sp + 2] = ip;

b[tp + 1] = vp;

b[vp] = gp + 2;

b[vp + 1] = up;

b[xp + 1] = zp;

b[zp] = gp + 2;

b[zp + 1] = yp;

b[wp + 1] = Bp;

b[Bp] = gp + 2;

b[Bp + 1] = Ap;

b[gl + 1] = Fp;

b[Ep] = gp + 2;

b[Ep + 1] = Dp;

b[Fp] = jp + 2;

b[Fp + 1] = Cp;

b[Fp + 2] = Ep;

b[nl + 1] = Hp;

b[Hp] = jp + 2;

b[Hp + 1] = Gp;

b[Hp + 2] = Ep;

b[tl + 1] = Jp;

b[Jp] = jp + 2;

b[Jp + 1] = Ip;

b[Jp + 2] = Ep;

b[Il + 1] = Ep;

b[Yl + 1] = Lp;

b[Lp] = jp + 2;

b[Lp + 1] = Kp;

b[Lp + 2] = Ep;

b[fm + 1] = Np;

b[Np] = jp + 2;

b[Np + 1] = Mp;

b[Np + 2] = Ep;

b[jm + 1] = Pp;

b[Pp] = jp + 2;

b[Pp + 1] = Op;

b[Pp + 2] = Ep;

b[om + 1] = Rp;

b[Rp] = jp + 2;

b[Rp + 1] = Qp;

b[Rp + 2] = Ep;

b[dm + 1] = Vp;

b[Up] = gp + 2;

b[Up + 1] = Tp;

b[Vp] = jp + 2;

b[Vp + 1] = Sp;

b[Vp + 2] = Up;

b[Im + 1] = Xp;

b[Xp] = jp + 2;

b[Xp + 1] = Wp;

b[Xp + 2] = Up;

b[Qm + 1] = Zp;

b[Zp] = jp + 2;

b[Zp + 1] = Yp;

b[Zp + 2] = Up;

b[cn + 1] = Up;

b[hn + 1] = bq;

b[bq] = jp + 2;

b[bq + 1] = aq;

b[bq + 2] = Up;

b[xn + 1] = eq;

b[eq] = jp + 2;

b[eq + 1] = dq;

b[eq + 2] = Up;

b[Qn + 1] = gq;

b[gq] = jp + 2;

b[gq + 1] = fq;

b[gq + 2] = Up;

b[co + 1] = xq;

b[xq] = jp + 2;

b[xq + 1] = hq;

b[xq + 2] = Up;

b[oo + 1] = zq;

b[zq] = jp + 2;

b[zq + 1] = yq;

b[zq + 2] = Up;

b[vo + 1] = Bq;

b[Bq] = jp + 2;

b[Bq + 1] = Aq;

b[Bq + 2] = Up;

b[Fo + 1] = Dq;

b[Dq] = jp + 2;

b[Dq + 1] = Cq;

b[Dq + 2] = Up;

mb = [ 0, 0, (function(c, f) {
  var d, e;
  d = b[c] < b[f] ? 1 : 2;
  1 == d ? e = 1 : 2 == d && (d = b[c] == b[f] ? 3 : 4, 3 == d ? e = b[c + 1] < b[f + 1] : 4 == d && (e = 0));
  return e;
}), 0, ia(), 0, ia(), 0, (function(c, f, d, e, g) {
  e = Lh(g, 144);
  if (0 == e) var i = 0, f = 2; else f = 1;
  1 == f && (sl(e, c, d), i = e);
  return i;
}), 0, (function(c, f) {
  mb[b[b[c] + 1]](c);
  ki(f, c, 144);
}), 0, (function(c, f, d, e, g) {
  e = Lh(g, 144);
  if (0 == e) var i = 0, f = 2; else f = 1;
  1 == f && (im(e, c, d), i = e);
  return i;
}), 0, (function(c, f) {
  mb[b[b[c] + 1]](c);
  ki(f, c, 144);
}), 0, (function(c, f, d, e, g) {
  e = Lh(g, 144);
  if (0 == e) var i = 0, f = 2; else f = 1;
  1 == f && (nm(e, c, d), i = e);
  return i;
}), 0, (function(c, f) {
  mb[b[b[c] + 1]](c);
  ki(f, c, 144);
}), 0, (function(c, f, d, e, g) {
  e = Lh(g, 144);
  if (0 == e) var i = 0, f = 2; else f = 1;
  1 == f && (Xl(e, c, d), i = e);
  return i;
}), 0, (function(c, f) {
  mb[b[b[c] + 1]](c);
  ki(f, c, 144);
}), 0, (function(c, f, d, e, g) {
  e = Lh(g, 144);
  if (0 == e) var i = 0, f = 2; else f = 1;
  1 == f && (em(e, c, d), i = e);
  return i;
}), 0, (function(c, f) {
  mb[b[b[c] + 1]](c);
  ki(f, c, 144);
}), 0, (function(c, f, d, e, g) {
  var i;
  i = Lh(g, 144);
  if (0 == i) var h = 0, g = 2; else g = 1;
  1 == g && (el(i, c, f, d, e), h = i);
  return h;
}), 0, (function(c, f) {
  mb[b[b[c] + 1]](c);
  ki(f, c, 144);
}), 0, (function(c, f, d, e, g) {
  var i;
  i = Lh(g, 144);
  if (0 == i) var h = 0, g = 2; else g = 1;
  1 == g && (ml(i, c, f, d, e), h = i);
  return h;
}), 0, (function(c, f) {
  mb[b[b[c] + 1]](c);
  ki(f, c, 144);
}), 0, ia(), 0, ia(), 0, (function() {
  throw "Pure virtual function called!";
}), 0, uh, 0, (function(c) {
  uh(c);
}), 0, Kh, 0, (function(c) {
  return b[c + 4] - 1;
}), 0, na(0), 0, Ph, 0, Eh, 0, (function(c, f) {
  o[f] = 0;
  cc(f + 1);
  o[f + 3] = 0;
}), 0, ia(), 0, ia(), 0, (function(c, f) {
  var d, e;
  e = Lh(f, 20);
  if (0 == e) {
    var g = 0;
    d = 2;
  } else d = 1;
  1 == d && (b[e] = Wb + 2, b[e] = mp + 2, b[e + 1] = 0, o[e + 2] = 0, cc(e + 3), g = e);
  d = g;
  Sh(d, c);
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
  S(g, f + 2, c + 3);
  N(e, f, g);
  C(i, d, e);
  c = J(i, i) <= o[c + 2] * o[c + 2];
  a = e;
  return c;
}), 0, Th, 0, (function(c, f, d) {
  var e = a;
  a += 4;
  var g = e + 2;
  S(g, d + 2, c + 3);
  N(e, d, g);
  nc(f, o[e] - o[c + 2], o[e + 1] - o[c + 2]);
  nc(f + 2, o[e] + o[c + 2], o[e + 1] + o[c + 2]);
  a = e;
}), 0, (function(c, f, d) {
  o[f] = 3.1415927410125732 * d * o[c + 2] * o[c + 2];
  var d = f + 1, e = c + 3;
  b[d] = b[e];
  o[d] = o[e];
  b[d + 1] = b[e + 1];
  o[d + 1] = o[e + 1];
  o[f + 3] = o[f] * (.5 * o[c + 2] * o[c + 2] + J(c + 3, c + 3));
}), 0, ia(), 0, ia(), 0, (function(c, f) {
  var d, e;
  e = Lh(f, 48);
  if (0 == e) {
    var g = 0;
    d = 2;
  } else d = 1;
  1 == d && (dc(e), g = e);
  d = g;
  Sh(d, c);
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
}), 0, na(1), 0, na(0), 0, Rh, 0, (function(c, f, d) {
  var e = a;
  a += 14;
  var g = e + 2, i = e + 4, h = e + 6, j = e + 8, k = e + 10, l = e + 12;
  Pc(e, d, c + 3);
  Pc(g, d, c + 5);
  Qg(i, e, g);
  Rg(h, e, g);
  oc(j, o[c + 2], o[c + 2]);
  C(k, i, j);
  b[f] = b[k];
  o[f] = o[k];
  b[f + 1] = b[k + 1];
  o[f + 1] = o[k + 1];
  c = f + 2;
  N(l, h, j);
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
  N(e, c + 3, c + 5);
  K(d, .5, e);
  b[g] = b[d];
  o[g] = o[d];
  b[g + 1] = b[d + 1];
  o[g + 1] = o[d + 1];
  o[f + 3] = 0;
  a = d;
}), 0, ia(), 0, ia(), 0, (function(c, f) {
  var d, e;
  e = Lh(f, 152);
  if (0 == e) {
    var g = 0;
    d = 2;
  } else d = 1;
  1 == d && (Vb(e), g = e);
  d = g;
  Sh(d, c);
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
  C(h, d, f);
  Od(e, j, h);
  f = 0;
  d = c + 37;
  h = c + 21;
  for (c += 5; ; ) {
    if (f >= b[d]) {
      g = 5;
      break;
    }
    j = h + (f << 1);
    C(k, e, c + (f << 1));
    j = J(j, k);
    if (0 < j) {
      g = 3;
      break;
    }
    f += 1;
  }
  5 == g ? i = 1 : 3 == g && (i = 0);
  a = e;
  return i;
}), 0, Wh, 0, Uh, 0, $h, 0, ia(), 0, ia(), 0, ia(), 0, ia(), 0, ia(), 0, ia(), 0, ia(), 0, ia(), 0, dl, 0, ll, 0, ia(), 0, ia(), 0, rl, 0, ia(), 0, ia(), 0, (function(c, f, d, e) {
  Uc(f, Zk(b[c + 12]), d, Zk(b[c + 13]), e);
}), 0, ia(), 0, ia(), 0, ia(), 0, ia(), 0, (function(c, f, d, e) {
  $c(f, Zk(b[c + 12]), d, Zk(b[c + 13]), e);
}), 0, ia(), 0, ia(), 0, (function(c, f, d, e) {
  var g = Zk(b[c + 12]), c = Zk(b[c + 13]), i = a;
  a += 63;
  dd(i, f, g, d, c, e);
  a = i;
}), 0, ia(), 0, ia(), 0, (function(c, f, d, e) {
  Vc(f, Zk(b[c + 12]), d, Zk(b[c + 13]), e);
}), 0, ia(), 0, ia(), 0, (function(c, f, d, e) {
  Td(f, Zk(b[c + 12]), d, Zk(b[c + 13]), e);
}), 0, ia(), 0, ia(), 0, (function(c, f) {
  rm(c, b[f + 12], f + 21);
}), 0, (function(c, f) {
  rm(c, b[f + 13], f + 23);
}), 0, (function(c, f, d) {
  K(c, d * o[f + 26], f + 30);
}), 0, na(0), 0, sm, 0, ia(), 0, ia(), 0, Dm, 0, Fm, 0, Gm, 0, (function(c, f) {
  rm(c, b[f + 12], f + 18);
}), 0, (function(c, f) {
  rm(c, b[f + 13], f + 20);
}), 0, (function(c, f, d) {
  K(c, d, f + 22);
}), 0, (function(c, f) {
  return f * o[c + 24];
}), 0, Jm, 0, ia(), 0, ia(), 0, Nm, 0, Om, 0, na(1), 0, (function(c, f) {
  rm(c, b[f + 12], f + 24);
}), 0, (function(c, f) {
  rm(c, b[f + 13], f + 26);
}), 0, (function(c, f, d) {
  var e = a;
  a += 2;
  K(e, o[f + 40], f + 61);
  K(c, d, e);
  a = e;
}), 0, (function(c, f) {
  return f * o[c + 40] * o[c + 65];
}), 0, Xm, 0, ia(), 0, ia(), 0, Vm, 0, Wm, 0, bn, 0, (function() {
  U($p, A(1, "i32", s));
}), 0, ia(), 0, ia(), 0, (function(c, f) {
  var d = f + 20;
  b[c] = b[d];
  o[c] = o[d];
  b[c + 1] = b[d + 1];
  o[c + 1] = o[d + 1];
}), 0, (function(c, f) {
  rm(c, b[f + 13], f + 18);
}), 0, (function(c, f, d) {
  K(c, d, f + 25);
}), 0, na(0), 0, (function() {
  U(cq, A(1, "i32", s));
}), 0, ia(), 0, ia(), 0, pn, 0, sn, 0, na(1), 0, (function(c, f) {
  rm(c, b[f + 12], f + 18);
}), 0, (function(c, f) {
  rm(c, b[f + 13], f + 20);
}), 0, (function(c, f, d) {
  var e = a;
  a += 6;
  var g = e + 2, i = e + 4;
  K(g, o[f + 27], f + 50);
  K(i, o[f + 30] + o[f + 29], f + 48);
  N(e, g, i);
  K(c, d, e);
  a = e;
}), 0, (function(c, f) {
  return f * o[c + 28];
}), 0, Fn, 0, ia(), 0, ia(), 0, yn, 0, Cn, 0, En, 0, (function(c, f) {
  rm(c, b[f + 12], f + 24);
}), 0, (function(c, f) {
  rm(c, b[f + 13], f + 26);
}), 0, (function(c, f, d) {
  var e = a;
  a += 2;
  K(e, o[f + 30], f + 35);
  K(c, d, e);
  a = e;
}), 0, na(0), 0, Wn, 0, ia(), 0, ia(), 0, Un, 0, Vn, 0, eo, 0, (function(c, f) {
  rm(c, b[f + 12], f + 18);
}), 0, (function(c, f) {
  rm(c, b[f + 13], f + 20);
}), 0, (function(c, f, d) {
  var e = a;
  a += 2;
  oc(e, o[f + 22], o[f + 23]);
  K(c, d, e);
  a = e;
}), 0, (function(c, f) {
  return f * o[c + 24];
}), 0, io, 0, ia(), 0, ia(), 0, fo, 0, go, 0, ho, 0, (function(c, f) {
  rm(c, b[f + 12], f + 18);
}), 0, (function(c, f) {
  rm(c, b[f + 13], f + 20);
}), 0, (function(c, f, d) {
  K(c, d * o[f + 24], f + 27);
}), 0, na(0), 0, ro, 0, ia(), 0, ia(), 0, po, 0, qo, 0, wo, 0, (function(c, f) {
  rm(c, b[f + 12], f + 21);
}), 0, (function(c, f) {
  rm(c, b[f + 13], f + 23);
}), 0, (function(c, f, d) {
  var e = a;
  a += 2;
  oc(e, o[f + 27], o[f + 28]);
  K(c, d, e);
  a = e;
}), 0, (function(c, f) {
  return f * o[c + 29];
}), 0, yo, 0, ia(), 0, ia(), 0, xo, 0, Co, 0, Do, 0, (function(c, f) {
  rm(c, b[f + 12], f + 20);
}), 0, (function(c, f) {
  rm(c, b[f + 13], f + 22);
}), 0, (function(c, f, d) {
  var e = a;
  a += 6;
  var g = e + 2, i = e + 4;
  K(g, o[f + 28], f + 46);
  K(i, o[f + 30], f + 44);
  N(e, g, i);
  K(c, d, e);
  a = e;
}), 0, (function(c, f) {
  return f * o[c + 29];
}), 0, Io, 0, ia(), 0, ia(), 0, Go, 0, Ho, 0, Ko, 0, Lc, 0, ia(), 0, Mc, 0, ia(), 0, di, 0, (function(c) {
  var f;
  f = 0;
  var d = c + 1, c = f < b[d] ? 1 : 3;
  a : do if (1 == c) for (;;) if (f += 1, f >= b[d]) break a; while (0);
}), 0, yi, 0, zi, 0, (function(c) {
  Ni(c);
}), 0, Qi, 0, ia(), 0, oj, 0, kj, 0, Xj, 0, Wj, 0, pc, 0, Kc, 0, el, 0, ml, 0, sl, 0, ak, 0, hk, 0, Xl, 0, em, 0, im, 0, nm, 0, bm, 0, Hm, 0, Pm, 0, gn, 0, wn, 0, Pn, 0, bo, 0, no, 0, uo, 0, Eo, 0, (function(c) {
  b[c] = 0;
  b[c + 1] = 0;
  b[c + 2] = 0;
  b[c + 3] = 0;
  b[c + 4] = 0;
  b[c + 5] = 0;
  b[c + 6] = 0;
  cc(c + 7);
  o[c + 10] = 1;
  o[c + 11] = .10000000149011612;
}), 0, ia(), 0 ];

Module.FUNCTION_TABLE = mb;

function Eq(c) {
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

Module.run = Eq;

try {
  Xo = ea;
} catch (Fq) {}

Module.noInitialRun || Eq();
