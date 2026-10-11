// Trees of the Tamil country in the mural manner: a short trunk and a
// canopy built from overlapping leaf lobes, each outlined, with a pattern
// of small leaves and fruit laid over it.
var Trees = new function() {
  function lobe(cx, cy, r, fil, n0) {
    var pts = [];
    var n = 22;
    for (var i = 0; i < n; i++) {
      var t = (i / n) * Math.PI * 2;
      var rr = r * (1 + (Noise.noise(i * 0.4, n0) - 0.5) * 0.25) * (1 + 0.06 * Math.cos(t * 7));
      pts.push([cx + Math.cos(t) * rr, cy + Math.sin(t) * rr]);
    }
    return shape(pts, fil, INK(), 1.3);
  }
  function leaf(x, y, ang, l, w, fil) {
    var c = Math.cos(ang), s = Math.sin(ang);
    return shape(
      [[x + c * l, y + s * l], [x - s * w, y + c * w], [x - c * l, y - s * l], [x + s * w, y - c * w]],
      fil, INK(0.8), 0.8,
    );
  }
  function trunk(x, y, h, w, lean, canv) {
    var tx = x + lean * h;
    var pts = [[x - w, y], [x + w, y], [tx + w * 0.7, y - h], [tx - w * 0.7, y - h]];
    canv.s += shape(pts, Palette.brown, INK(), 1.4);
    canv.s += line([[x - w * 0.3, y - 2], [tx - w * 0.2, y - h + 2]], Palette.darkbrown, 1);
    return [tx, y - h];
  }

  // mango: broad dome of dark lobes, hanging yellow fruit
  this.mango = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var flower = args.flower;
    var c = { s: "" };
    var h = (40 + Math.random() * 20) * s;
    var top = trunk(x, y, h, 6 * s, normRand(-0.15, 0.15), c);
    var R = (48 + Math.random() * 22) * s;
    var n0 = Math.random() * 10;
    var lobes = [];
    var n = 5 + Math.floor(Math.random() * 3);
    for (var i = 0; i < n; i++) {
      var a = Math.PI + (i / (n - 1)) * Math.PI;
      lobes.push([top[0] + Math.cos(a) * R * 0.55, top[1] - R * 0.35 + Math.sin(a) * R * 0.45, R * (0.45 + Math.random() * 0.2)]);
    }
    lobes.push([top[0], top[1] - R * 0.55, R * 0.6]);
    for (var i = 0; i < lobes.length; i++) c.s += lobe(lobes[i][0], lobes[i][1], lobes[i][2], flower ? (i % 2 ? Palette.lightgreen : Palette.green) : (i % 2 ? Palette.green : Palette.darkgreen), n0 + i);
    var nl = Math.floor(R * 0.6);
    for (var i = 0; i < nl; i++) {
      var L = lobes[Math.floor(Math.random() * lobes.length)];
      var a = Math.random() * Math.PI * 2, r = Math.random() * L[2] * 0.8;
      c.s += leaf(L[0] + Math.cos(a) * r, L[1] + Math.sin(a) * r, Math.random() * Math.PI, 4.5 * s, 1.6 * s, flower ? Palette.green : Palette.lightgreen);
    }
    if (flower) {
      // flame of the forest: clusters of red-orange blossom over the crown
      var nb = Math.floor(R * 0.5);
      for (var i = 0; i < nb; i++) {
        var L = lobes[Math.floor(Math.random() * lobes.length)];
        var a = Math.random() * Math.PI * 2, r = Math.random() * L[2] * 0.85;
        var bx = L[0] + Math.cos(a) * r, by = L[1] + Math.sin(a) * r;
        c.s += dot(bx, by, 2.6 * s, i % 3 ? Palette.orange : Palette.red, INK(0.7), 0.6);
        c.s += dot(bx + 2 * s, by - 2 * s, 1.6 * s, Palette.yellow);
      }
    }
    var nf = flower ? 0 : Math.floor(Math.random() * 7);
    for (var i = 0; i < nf; i++) {
      var L = lobes[Math.floor(Math.random() * lobes.length)];
      var fx = L[0] + (Math.random() - 0.5) * L[2], fy = L[1] + L[2] * (0.5 + Math.random() * 0.5);
      c.s += line([[fx, fy - 6 * s], [fx, fy]], INK(), 1);
      c.s += dot(fx, fy + 2 * s, 2.6 * s, Palette.yellow, INK(), 0.8);
    }
    return c.s;
  };

  // banyan or neem: wide flat crown of several lobes, two or three trunks
  this.banyan = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var c = { s: "" };
    var h = (55 + Math.random() * 20) * s;
    var top = trunk(x, y, h, 9 * s, normRand(-0.1, 0.1), c);
    var R = (70 + Math.random() * 30) * s;
    var n0 = Math.random() * 10;
    // aerial roots
    var nr = 2 + Math.floor(Math.random() * 3);
    for (var i = 0; i < nr; i++) {
      var rx = x + (Math.random() - 0.5) * R * 1.2;
      c.s += line([[rx + (Math.random() - 0.5) * 10 * s, top[1] + 4 * s], [rx, y]], Palette.darkbrown, 2 * s);
    }
    var lobes = [];
    var n = 6;
    for (var i = 0; i < n; i++) {
      var u = i / (n - 1) - 0.5;
      lobes.push([top[0] + u * R * 1.5, top[1] - R * 0.25 - Math.cos(u * Math.PI) * R * 0.25, R * (0.32 + Math.random() * 0.12)]);
    }
    lobes.push([top[0] - R * 0.3, top[1] - R * 0.55, R * 0.4]);
    lobes.push([top[0] + R * 0.3, top[1] - R * 0.55, R * 0.4]);
    for (var i = 0; i < lobes.length; i++) c.s += lobe(lobes[i][0], lobes[i][1], lobes[i][2], i % 3 == 0 ? Palette.darkgreen : Palette.green, n0 + i);
    var nl = Math.floor(R * 0.9);
    for (var i = 0; i < nl; i++) {
      var L = lobes[Math.floor(Math.random() * lobes.length)];
      var a = Math.random() * Math.PI * 2, r = Math.random() * L[2] * 0.8;
      c.s += leaf(L[0] + Math.cos(a) * r, L[1] + Math.sin(a) * r, Math.random() * Math.PI, 4 * s, 1.4 * s, Palette.lightgreen);
    }
    return c.s;
  };

  // banana: a short pseudo-stem and a few long torn leaves
  this.banana = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var canv = "";
    var h = (30 + Math.random() * 15) * s;
    canv += shape([[x - 4 * s, y], [x + 4 * s, y], [x + 3 * s, y - h], [x - 3 * s, y - h]], Palette.lightgreen, INK(), 1.2);
    var n = 5 + Math.floor(Math.random() * 3);
    for (var i = 0; i < n; i++) {
      var a = -Math.PI / 2 + (i / (n - 1) - 0.5) * 2.4 + (Math.random() - 0.5) * 0.3;
      var L = (45 + Math.random() * 20) * s;
      var W = 9 * s;
      var ex = x + Math.cos(a) * L, ey = y - h + Math.sin(a) * L + 12 * s * Math.abs(Math.cos(a));
      var mid = bezmh([[x, y - h], [x + Math.cos(a) * L * 0.6, y - h + Math.sin(a) * L * 0.6 - 4 * s], [ex, ey]], 1);
      var l = [], r = [];
      for (var j = 0; j < mid.length; j++) {
        var t = j / (mid.length - 1);
        var w = W * Math.sin(Math.min(1, t * 1.4) * Math.PI) * 0.9 + 0.5;
        var q = mid[Math.min(mid.length - 1, j + 1)], o = mid[Math.max(0, j - 1)];
        var na = Math.atan2(q[1] - o[1], q[0] - o[0]) + Math.PI / 2;
        var tear = (j % 7 == 3) ? 0.55 : 1;
        l.push([mid[j][0] + Math.cos(na) * w * tear, mid[j][1] + Math.sin(na) * w * tear]);
        r.push([mid[j][0] - Math.cos(na) * w, mid[j][1] - Math.sin(na) * w]);
      }
      canv += shape(l.concat(r.reverse()), i % 2 ? Palette.green : Palette.lightgreen, INK(), 1.1);
      canv += line(mid, Palette.darkgreen, 1.2);
    }
    return canv;
  };

  // thorn tree of the paalai: bare forking branches
  this.thorn = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var canv = "";
    function branch(px, py, ang, len, w, d) {
      var ex = px + Math.cos(ang) * len, ey = py + Math.sin(ang) * len;
      canv += line([[px, py], [ex, ey]], d == 0 ? INK() : Palette.darkbrown, w);
      if (d >= 4 || len < 5) return;
      var n = 2 + (Math.random() < 0.3 ? 1 : 0);
      for (var i = 0; i < n; i++) {
        branch(ex, ey, ang + (Math.random() - 0.5) * 1.3, len * (0.55 + Math.random() * 0.25), w * 0.65, d + 1);
      }
      if (d >= 2) for (var i = 0; i < 2; i++) canv += tick(ex, ey, (Math.random() - 0.5) * 6, -3 * s, INK(0.7), 0.8);
    }
    branch(x, y, -Math.PI / 2 + normRand(-0.25, 0.25), (28 + Math.random() * 14) * s, 3.5 * s, 0);
    return canv;
  };

  // kurinji shrub: low bush covered in violet bells, flowers once in 12 years
  this.kurinji = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var white = args.white; // jasmine (mullai) instead of kurinji
    var canv = "";
    var R = (12 + Math.random() * 8) * s;
    canv += lobe(x, y - R * 0.6, R, white ? Palette.green : Palette.darkgreen, Math.random() * 10);
    var n = 6 + Math.floor(Math.random() * 8);
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, r = Math.random() * R * 0.8;
      var fx = x + Math.cos(a) * r, fy = y - R * 0.6 + Math.sin(a) * r;
      if (white) {
        for (var k = 0; k < 5; k++) canv += dot(fx + Math.cos(k * 1.26) * 1.8 * s, fy + Math.sin(k * 1.26) * 1.8 * s, 1.1 * s, Palette.white);
        canv += dot(fx, fy, 0.8 * s, Palette.yellow);
      } else {
        canv += dot(fx, fy, 2 * s, "#8a78b8", INK(0.7), 0.6);
      }
    }
    return canv;
  };

  // coconut palm: slender curving trunk, arching pinnate fronds, nuts
  this.coconut = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var canv = "";
    var h = (170 + Math.random() * 110) * s;
    var lean = normRand(-0.25, 0.25);
    var N = 20;
    var pts = [];
    for (var i = 0; i <= N; i++) {
      var t = i / N;
      pts.push([x + lean * h * t * t, y - h * t]);
    }
    var left = [], right = [];
    for (var i = 0; i <= N; i++) {
      var w = s * (6 - 2 * (i / N));
      var q = pts[Math.min(N, i + 1)], o = pts[Math.max(0, i - 1)];
      var a = Math.atan2(q[1] - o[1], q[0] - o[0]) + Math.PI / 2;
      left.push([pts[i][0] + Math.cos(a) * w, pts[i][1] + Math.sin(a) * w]);
      right.push([pts[i][0] - Math.cos(a) * w, pts[i][1] - Math.sin(a) * w]);
    }
    var top = pts[N];
    var n = 7 + Math.floor(Math.random() * 4);
    var fr = [];
    for (var k = 0; k < n; k++) fr.push({ ang: -Math.PI * 1.1 + ((k + 0.5) / n) * Math.PI * 1.2 + (Math.random() - 0.5) * 0.3, d: Math.random() });
    fr.sort(function(a, b) { return a.d - b.d; });
    var frond = function(f, front) {
      var L = (55 + Math.random() * 25) * s;
      var ex = top[0] + Math.cos(f.ang) * L, ey = top[1] + Math.sin(f.ang) * L + L * 0.55;
      var mid = bezmh([[top[0], top[1]], [top[0] + Math.cos(f.ang) * L * 0.6, top[1] + Math.sin(f.ang) * L * 0.6 - L * 0.05], [ex, ey]], 1);
      var l = [], r = [];
      for (var j = 0; j < mid.length; j++) {
        var t = j / (mid.length - 1);
        var w = 9 * s * Math.sin(Math.min(1, t * 1.3) * Math.PI) * (1 - t * 0.3) + 0.5;
        var q = mid[Math.min(mid.length - 1, j + 1)], o = mid[Math.max(0, j - 1)];
        var na = Math.atan2(q[1] - o[1], q[0] - o[0]) + Math.PI / 2;
        var ser = j % 2 ? 1 : 0.7;
        l.push([mid[j][0] + Math.cos(na) * w * ser, mid[j][1] + Math.sin(na) * w * ser]);
        r.push([mid[j][0] - Math.cos(na) * w * ser, mid[j][1] - Math.sin(na) * w * ser]);
      }
      var out = shape(l.concat(r.reverse()), front ? Palette.green : Palette.darkgreen, INK(), 1);
      out += line(mid, front ? Palette.darkgreen : INK(0.7), 1.1 * s);
      return out;
    };
    for (var k = 0; k < fr.length; k++) if (fr[k].d <= 0.5) canv += frond(fr[k], false);
    canv += shape(left.concat(right.slice().reverse()), Palette.brown, INK(), 1.3 * s);
    for (var i = 2; i < N; i += 2) canv += line([left[i], right[i]], Palette.darkbrown, 0.9 * s);
    for (var k = 0; k < fr.length; k++) if (fr[k].d > 0.5) canv += frond(fr[k], true);
    var nn = 3 + Math.floor(Math.random() * 4);
    for (var i = 0; i < nn; i++) canv += dot(top[0] + (Math.random() - 0.5) * 14 * s, top[1] + 4 * s + Math.random() * 8 * s, 3.5 * s, i % 2 ? Palette.yellow : Palette.lightgreen, INK(), 0.9);
    return canv;
  };
}();
