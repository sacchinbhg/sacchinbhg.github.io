// Rivers. Each river is a world-level feature decided deterministically
// from the seed for a slot of the x axis, so every chunk it crosses draws
// the same river. A river enters at the horizon (or at the shore in
// neithal), meanders across the land, and leaves at the bottom border.
// In paalai it is a dry sandy bed.
var River = new function() {
  this.SLOT = 2000;
  this.cache = {};

  this.get = function(n) {
    if (n in this.cache) return this.cache[n];
    var saved = Prng.s;
    seedFrom(SEED + "|river|" + n);
    var cx = n * this.SLOT + this.SLOT / 2;
    var k = Tinai.dominant(cx);
    var prob = [0.7, 0.65, 0.95, 0.9, 0.5][k];
    var r = null;
    if (Math.random() < prob) {
      var dry = k == 4;
      var stream = k == 0;
      var sx = n * this.SLOT + 400 + Math.random() * (this.SLOT - 800);
      var n0 = Math.random() * 100;
      var amp = 260 + Math.random() * 420;
      var drift = (Math.random() - 0.5) * 900;
      var y1 = Layers.BOTTOM + 10;
      var pts = [];
      var minx = 1e9, maxx = -1e9;
      // rise on a hill when one stands nearby
      var hs = Hills.near(sx - 700, sx + 700);
      var hill = null;
      var cand = [];
      for (var i = 0; i < hs.length; i++) if (hs[i].layer > 0 && hs[i].H > 50) cand.push(hs[i]);
      if (cand.length) hill = cand[Math.floor(Math.random() * cand.length)];
      var y0 = Layers.HORIZON;
      var hillN = 0;
      if (hill) {
        var t0 = (Math.random() - 0.5) * 0.7;
        sx = hill.cx + t0 * hill.R;
        y0 = Hills.surfaceY(hill, sx) + 6;
        hill.waterfall = [sx, y0];
        // down the hill face, drifting away from the summit
        hillN = 14;
        var side = sx >= hill.cx ? 1 : -1;
        for (var i = 0; i < hillN; i++) {
          var t = i / hillN;
          var y = y0 + (Layers.HORIZON + 4 - y0) * t;
          var x = sx + side * (y - y0) * (0.25 + 0.2 * Noise.noise(t * 4 + n0)) + (Noise.noise(t * 8 + n0 + 20) - 0.5) * 10;
          var w = (stream ? 6 : 8) + t * 8;
          pts.push([x, y, w]);
          minx = Math.min(minx, x - w);
          maxx = Math.max(maxx, x + w);
        }
      }
      var px0 = hillN ? pts[hillN - 1][0] : sx;
      var N = 56;
      var base = Noise.noise(n0);
      for (var i = 0; i <= N; i++) {
        var t = i / N;
        var x = px0 + drift * t + (Noise.noise(t * 1.9 + n0) - base) * 2 * amp * Math.sin(Math.min(1, t * 1.6) * Math.PI / 2) +
          (Noise.noise(t * 7 + n0 + 30) - 0.5) * 24 * t;
        var y = Layers.HORIZON + 4 + t * (y1 - Layers.HORIZON - 4) + (Noise.noise(t * 4 + n0 + 50) - 0.5) * 30 * Math.sin(t * Math.PI);
        var w = ((stream ? 10 : 18) + t * (stream ? 20 : 48)) * (0.85 + 0.3 * Noise.noise(t * 3 + n0 + 90));
        pts.push([x, y, w]);
        minx = Math.min(minx, x - w);
        maxx = Math.max(maxx, x + w);
      }
      for (var pass = 0; pass < 3; pass++) {
        for (var i = 1; i < pts.length - 1; i++) {
          pts[i][0] = (pts[i - 1][0] + 2 * pts[i][0] + pts[i + 1][0]) / 4;
          pts[i][1] = (pts[i - 1][1] + 2 * pts[i][1] + pts[i + 1][1]) / 4;
        }
      }
      r = { pts: pts, dry: dry, stream: stream, k: k, minx: minx, maxx: maxx, hillN: hillN };
    }
    this.cache[n] = r;
    Prng.s = saved;
    return r;
  };

  this.near = function(x0, x1) {
    var list = [];
    var a = Math.floor((x0 - 1600) / this.SLOT), b = Math.floor((x1 + 1600) / this.SLOT);
    for (var n = a; n <= b; n++) {
      var r = this.get(n);
      if (r && r.minx <= x1 && r.maxx >= x0) list.push(r);
    }
    return list;
  };

  // distance from (x,y) to the river centreline, and the width there
  function nearest(r, x, y) {
    var best = 1e9, bw = 0;
    var p = r.pts;
    for (var i = 0; i < p.length - 1; i++) {
      var ax = p[i][0], ay = p[i][1], bx = p[i + 1][0], by = p[i + 1][1];
      var dx = bx - ax, dy = by - ay;
      var l2 = dx * dx + dy * dy;
      var t = l2 == 0 ? 0 : Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / l2));
      var px = ax + t * dx, py = ay + t * dy;
      var d = Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
      if (d < best) {
        best = d;
        bw = p[i][2] * (1 - t) + p[i + 1][2] * t;
      }
    }
    return [best, bw];
  }

  this.inside = function(x, y, margin) {
    var rs = this.near(x, x);
    for (var i = 0; i < rs.length; i++) {
      var d = nearest(rs[i], x, y);
      if (d[0] < d[1] / 2 + (margin || 0)) return true;
    }
    return false;
  };

  // bank offsets for point i
  function banks(p, i) {
    var o = p[Math.max(0, i - 1)], q = p[Math.min(p.length - 1, i + 1)];
    var a = Math.atan2(q[1] - o[1], q[0] - o[0]) + Math.PI / 2;
    var w = p[i][2] / 2;
    return [[p[i][0] + Math.cos(a) * w, p[i][1] + Math.sin(a) * w], [p[i][0] - Math.cos(a) * w, p[i][1] - Math.sin(a) * w]];
  }

  this.draw = function(x0, x1) {
    var canv = "";
    var rs = this.near(x0, x1);
    for (var ri = 0; ri < rs.length; ri++) {
      var r = rs[ri];
      var p = r.pts;
      // contiguous runs of points inside this chunk (with one neighbour each side)
      var runs = [], run = null;
      for (var i = 0; i < p.length; i++) {
        var inr = p[i][0] >= x0 - 80 && p[i][0] < x1 + 80;
        if (inr) {
          if (!run) run = [Math.max(0, i - 1), i];
          run[1] = Math.min(p.length - 1, i + 1);
        } else if (run) {
          runs.push(run);
          run = null;
        }
      }
      if (run) runs.push(run);
      var water = r.dry ? Palette.paleyellow : Palette.blue;
      for (var k = 0; k < runs.length; k++) {
        var L = [], R = [];
        for (var i = runs[k][0]; i <= runs[k][1]; i++) {
          var b = banks(p, i);
          var q = p[Math.min(p.length - 1, i + 1)], o = p[Math.max(0, i - 1)];
          var dx = q[0] - o[0], dy = q[1] - o[1];
          var lp = L[L.length - 1], rp = R[R.length - 1];
          if (!lp || (b[0][0] - lp[0]) * dx + (b[0][1] - lp[1]) * dy > 0) L.push(b[0]);
          if (!rp || (b[1][0] - rp[0]) * dx + (b[1][1] - rp[1]) * dy > 0) R.push(b[1]);
        }
        if (L.length < 2 || R.length < 2) continue;
        canv += poly(L.concat(R.slice().reverse()), { fil: water, str: "none", wid: 0 });
        // banks: a sand line and an ink line
        canv += line(L, r.dry ? Palette.brown : Palette.yellow, r.stream ? 1.5 : 2.6);
        canv += line(R, r.dry ? Palette.brown : Palette.yellow, r.stream ? 1.5 : 2.6);
        canv += line(L, INK(0.85), 1.1);
        canv += line(R, INK(0.85), 1.1);
        // the torrent down the hill face: white water over the blue
        if (!r.dry && runs[k][0] < r.hillN) {
          var tp = [];
          for (var i = runs[k][0]; i <= Math.min(runs[k][1], r.hillN); i++) tp.push([p[i][0], p[i][1]]);
          if (tp.length > 1) {
            canv += line(tp, "rgba(246,239,221,0.85)", 3.5);
            for (var i = 0; i < tp.length; i += 2) canv += dot(tp[i][0] + (Math.random() - 0.5) * 6, tp[i][1], 1.3, Palette.white);
          }
        }
        var marks = "";
        for (var i = runs[k][0]; i <= runs[k][1]; i++) {
          if (p[i][0] < x0 || p[i][0] >= x1) continue;
          var o = p[Math.max(0, i - 1)], q = p[Math.min(p.length - 1, i + 1)];
          var a = Math.atan2(q[1] - o[1], q[0] - o[0]);
          var w = p[i][2];
          if (r.dry) {
            // pebbles and a thin dotted line of remaining water
            for (var j = 0; j < 3; j++) canv += dot(p[i][0] + (Math.random() - 0.5) * w * 0.8, p[i][1] + (Math.random() - 0.5) * 6, 1.2, Palette.brown, INK(0.5), 0.5);
            if (i % 2 == 0) canv += line([[p[i][0] - Math.cos(a) * 6, p[i][1] - Math.sin(a) * 6], [p[i][0] + Math.cos(a) * 6, p[i][1] + Math.sin(a) * 6]], Palette.blue, 1);
          } else {
            // flow marks along the current, cream curls
            var nm = 1 + Math.floor(w / 18);
            for (var j = 0; j < nm; j++) {
              var off = (Math.random() - 0.5) * w * 0.7;
              var mx = p[i][0] - Math.sin(a) * off, my = p[i][1] + Math.cos(a) * off;
              var wp = [];
              for (var u = 0; u <= 5; u++) {
                var t = u / 5 - 0.5;
                wp.push([mx + Math.cos(a) * t * 16 - Math.sin(a) * Math.sin(u * 2) * 1.6, my + Math.sin(a) * t * 16 + Math.cos(a) * Math.sin(u * 2) * 1.6]);
              }
              marks += line(wp, Math.random() < 0.7 ? Palette.cream : Palette.indigo, 1.2);
            }
            // reeds on the bank
            if (Math.random() < 0.5) {
              var b = banks(p, i);
              var e = Math.random() < 0.5 ? b[0] : b[1];
              for (var j = -1; j <= 1; j++) canv += line([[e[0], e[1]], [e[0] + j * 3, e[1] - 9 - Math.abs(j) * -2]], Palette.darkgreen, 1.1);
            }
          }
        }
        canv += anim("flow", marks, -Math.random() * 3);
      }
    }
    return canv;
  };

  // sample points of rivers inside a chunk, for placing things along them
  this.samples = function(x0, x1) {
    var out = [];
    var rs = this.near(x0, x1);
    for (var ri = 0; ri < rs.length; ri++) {
      var p = rs[ri].pts;
      for (var i = rs[ri].hillN + 2; i < p.length - 2; i += 5) {
        if (p[i][0] < x0 || p[i][0] >= x1) continue;
        var b = banks(p, i);
        out.push({ x: p[i][0], y: p[i][1], w: p[i][2], t: i / (p.length - 1), left: b[0], right: b[1], river: rs[ri] });
      }
    }
    return out;
  };
}();
