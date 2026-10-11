// Hills. Like rivers, they are world-level features decided from the seed
// for slots of the x axis, so rivers can rise on them. Three layers: a pale
// distant range, a middle range, and near hills with rocks, forest,
// terraces, flowers, forts and temples.
var Hills = new function() {
  this.SLOT = 1000;
  this.cache = {};

  this.colour = function(x, layer) {
    var table = [[62, 82, 62], [78, 104, 56], [88, 114, 70], [84, 110, 70], [166, 100, 64]];
    var c = Palette.mixArr(x, table);
    var sk = Palette.mixArr(x, Palette.skyLow);
    if (layer == 0) return Palette.css([c[0] * 0.35 + sk[0] * 0.65, c[1] * 0.35 + sk[1] * 0.65, c[2] * 0.35 + sk[2] * 0.65]);
    if (layer == 1) return Palette.css([c[0] * 0.72 + sk[0] * 0.28, c[1] * 0.72 + sk[1] * 0.28, c[2] * 0.72 + sk[2] * 0.28]);
    return Palette.shade(c, 0.95);
  };

  function makeHill(cx, R, H, layer, w, n0) {
    var pointy = w[0] > 0.45 ? 1.6 : 1.0;
    var N = 56;
    var peaks = [];
    var np = 1 + Math.floor(Math.random() * 3);
    for (var p = 0; p < np; p++) peaks.push([(Math.random() - 0.5) * 1.2, 0.25 + Math.random() * 0.75, 0.12 + Math.random() * 0.25]);
    var prof = [];
    var mx = 0;
    for (var i = 0; i <= N; i++) {
      var t = (i / N) * 2 - 1;
      var dome = Math.pow(Math.max(0, 1 - t * t), 1.3);
      var hv = dome * (0.55 + 0.25 * Noise.noise(t * 2.5 + n0));
      for (var p = 0; p < np; p++) hv += dome * peaks[p][1] * Math.exp(-Math.pow((t - peaks[p][0]) / peaks[p][2], 2) * pointy);
      hv += dome * (Noise.noise(t * 9 + n0 + 7) - 0.5) * 0.12;
      prof.push(hv);
      mx = Math.max(mx, hv);
    }
    var pts = [];
    var base = Layers.HORIZON + 2;
    for (var i = 0; i <= N; i++) {
      var t = (i / N) * 2 - 1;
      pts.push([cx + t * R, base - H * (prof[i] / mx)]);
    }
    pts[0][1] = base;
    pts[N][1] = base;
    var top = 0;
    for (var i = 1; i < N; i++) if (pts[i][1] < pts[top][1]) top = i;
    return {
      cx: cx, R: R, H: H, layer: layer, base: base, pts: pts, summit: pts[top], n0: n0,
      forest: layer > 0 && Math.random() < 0.35 + 0.4 * (w[0] + w[1]),
      rocks: layer > 0 && Math.random() < 0.3 + 0.5 * w[0],
      terraces: layer > 0 && Math.random() < 0.45 * w[0],
      flowers: layer > 0 && w[0] > 0.3 && Math.random() < 0.7,
      fort: layer > 0 && H > 70 && R > 150 && Math.random() < 0.14,
      temple: layer > 0 && H > 60 && Math.random() < 0.16,
      waterfall: false,
    };
  }

  this.get = function(n) {
    if (n in this.cache) return this.cache[n];
    var saved = Prng.s;
    seedFrom(SEED + "|hills|" + n);
    var x0 = n * this.SLOT;
    var list = [];
    var cxm = x0 + this.SLOT / 2;
    var w = Tinai.weights(cxm);
    var amt = Math.min(1, w[0] * 1.6 + w[1] * 0.6 + w[2] * 0.5 + w[3] * 0.4 + w[4] * 0.55);
    var tall = w[0] > 0.45 ? 1.35 : 1;
    if (amt > 0.2) {
      // far range
      var cx = x0 + Math.random() * this.SLOT, R = 280 + Math.random() * 160;
      list.push(makeHill(cx, R, R * (0.3 + Math.random() * 0.3) * amt * tall, 0, w, Math.random() * 100));
      // middle range
      var nm = 1 + Math.floor(Math.random() * 2);
      for (var i = 0; i < nm; i++) {
        cx = x0 + Math.random() * this.SLOT; R = 150 + Math.random() * 120;
        list.push(makeHill(cx, R, R * (0.38 + Math.random() * 0.35) * amt * tall, 1, w, Math.random() * 100));
      }
      // near hills
      for (var i = 0; i < 2; i++) {
        if (Math.random() > 0.55) continue;
        cx = x0 + Math.random() * this.SLOT; R = 90 + Math.random() * 90;
        list.push(makeHill(cx, R, R * (0.32 + Math.random() * 0.3) * amt * tall, 2, w, Math.random() * 100));
      }
    }
    this.cache[n] = list;
    Prng.s = saved;
    return list;
  };

  this.near = function(x0, x1) {
    var out = [];
    var a = Math.floor((x0 - 500) / this.SLOT), b = Math.floor((x1 + 500) / this.SLOT);
    for (var n = a; n <= b; n++) {
      var l = this.get(n);
      for (var i = 0; i < l.length; i++) if (l[i].cx + l[i].R >= x0 && l[i].cx - l[i].R <= x1) out.push(l[i]);
    }
    return out;
  };

  // height of the hill surface at x (the base line if outside)
  this.surfaceY = function(h, x) {
    var t = (x - h.cx) / h.R;
    if (t <= -1 || t >= 1) return h.base;
    var i = (t + 1) / 2 * (h.pts.length - 1);
    var a = Math.floor(i), b = Math.min(h.pts.length - 1, a + 1), f = i - a;
    return h.pts[a][1] * (1 - f) + h.pts[b][1] * f;
  };

  // a veil of haze across the foot of the ranges, drawn after the far layers
  this.haze = function(x0, x1) {
    var c = "#f0dcb8";
    var out = "";
    var H = Layers.HORIZON;
    // thick low band and a thinner one higher up, both fading upward
    out += fadeRectV(x0, x1, H - 90, H + 1, c, 0.42);
    out += fadeRectV(x0, x1, H - 200, H - 60, c, 0.16);
    return out;
  };

  this.drawOne = function(h) {
    var canv = "";
    var col = this.colour(h.cx, h.layer);
    var sc = h.layer == 0 ? 0.6 : h.layer == 1 ? 0.85 : 1.1;
    canv += shape(h.pts, col, INK(h.layer == 0 ? 0.18 : h.layer == 1 ? 0.55 : 0.85), h.layer == 0 ? 0.8 : h.layer == 1 ? 1.1 : 1.4);
    if (h.layer == 0) {
      // a ridge line or two in the haze
      var rp = [];
      for (var i = 0; i <= 10; i++) {
        var t = -0.6 + (i / 10) * 0.5;
        var x = h.cx + t * h.R;
        rp.push([x, h.base - (h.base - this.surfaceY(h, x)) * 0.75]);
      }
      canv += line(rp, "rgba(246,239,221,0.18)", 1);
      return canv;
    }
    var hz = h.layer == 1 ? 0.45 : 1; // detail strength by distance
    var self = this;
    var surf = function(x) { return self.surfaceY(h, x); };
    // soft contour highlights
    for (var j = 0; j < 2; j++) {
      var lp = [];
      var f = 0.7 - j * 0.25;
      for (var i = 0; i <= 12; i++) {
        var t = -0.85 + (i / 12) * 0.5;
        var x = h.cx + t * h.R;
        lp.push([x, h.base - (h.base - surf(x)) * f]);
      }
      canv += line(lp, "rgba(125,154,90," + (0.9 * hz).toFixed(2) + ")", 1.1);
    }
    // terraces on the lower flank
    if (h.terraces) {
      for (var j = 0; j < 5; j++) {
        var f = 0.12 + j * 0.11;
        var tp = [];
        for (var i = 0; i <= 10; i++) {
          var t = -0.95 + (i / 10) * 0.55;
          var x = h.cx + t * h.R;
          tp.push([x, h.base - (h.base - surf(x)) * f]);
        }
        canv += line(tp, "#9db35a", 2.2 * sc);
        canv += line(tp, INK(0.6), 0.7);
        var e = tp[tp.length - 1];
        canv += line([[e[0], e[1]], [e[0] + 3, e[1] + 6]], INK(0.6), 0.7);
      }
    }
    // rock outcrops near the summit
    if (h.rocks) {
      var nr = 2 + Math.floor(Math.random() * 4);
      for (var k = 0; k < nr; k++) {
        var t = (Math.random() - 0.5) * 1.1;
        var x = h.cx + t * h.R;
        var sy = surf(x);
        var y = sy + (h.base - sy) * (0.05 + Math.random() * 0.35);
        var rw = (10 + Math.random() * 16) * sc, rh = (8 + Math.random() * 12) * sc;
        var rp = [[x - rw / 2, y], [x + rw / 2, y], [x + rw * 0.35, y - rh * 0.7], [x + rw * 0.05, y - rh], [x - rw * 0.3, y - rh * 0.6]];
        canv += shape(rp, "#8d8068", INK(hz), 1.1);
        canv += line([[x - rw * 0.3, y - rh * 0.6], [x + rw * 0.05, y - rh], [x + rw * 0.35, y - rh * 0.7]], "#c9bda0", 1.4);
      }
    }
    // forest: clusters of small canopies along the slopes
    if (h.forest) {
      var nf = Math.floor(h.R / 9);
      for (var k = 0; k < nf; k++) {
        var t = (Math.random() - 0.5) * 1.7;
        var x = h.cx + t * h.R;
        var sy = surf(x);
        if (h.base - sy < 12) continue;
        var y = sy + (h.base - sy) * (0.1 + Math.random() * 0.8);
        var r = (4 + Math.random() * 5) * sc;
        var cp = [];
        for (var i = 0; i < 9; i++) { var a = (i / 9) * Math.PI * 2; cp.push([x + Math.cos(a) * r * (1 + 0.15 * (i % 2)), y - r * 0.6 + Math.sin(a) * r * 0.8]); }
        canv += shape(cp, k % 3 ? Palette.darkgreen : Palette.green, INK(0.8 * hz), 0.8);
        canv += line([[x, y - r * 0.2], [x, y + r * 0.5]], Palette.darkbrown, 1);
        if (hz > 0.5) canv += dot(x - r * 0.3, y - r * 0.9, 1, Palette.lightgreen);
      }
    }
    // kurinji in bloom
    if (h.flowers) {
      var nfl = Math.floor(h.R / 5);
      for (var k = 0; k < nfl; k++) {
        var t = (Math.random() - 0.5) * 1.5;
        var x = h.cx + t * h.R;
        var sy = surf(x);
        var y = sy + (h.base - sy) * (0.05 + Math.random() * 0.5);
        canv += dot(x, y, 1.7 * sc, "#8a78b8");
      }
    }
    // a spring and foam where a river rises
    if (h.waterfall) {
      for (var i = 0; i < 6; i++) canv += dot(h.waterfall[0] + (Math.random() - 0.5) * 12, h.waterfall[1] + Math.random() * 5, 1.6, Palette.white);
    }
    // a fort on the crest, or a temple
    if (h.fort) {
      var t0 = -0.3, t1 = 0.3;
      var fw = [], fw2 = [];
      for (var i = 0; i <= 10; i++) {
        var x = h.cx + (t0 + (i / 10) * (t1 - t0)) * h.R;
        fw.push([x, surf(x) - 2]);
        fw2.push([x, surf(x) + 6]);
      }
      var stone = "#bfb39a";
      canv += shape(fw.concat(fw2.reverse()), stone, INK(), 1.1);
      for (var i = 0; i < fw.length; i++) canv += shape([[fw[i][0] - 2, fw[i][1] + 1], [fw[i][0] + 2, fw[i][1] + 1], [fw[i][0] + 2, fw[i][1] - 3], [fw[i][0] - 2, fw[i][1] - 3]], stone, INK(), 0.8);
      for (var e = 0; e <= 10; e += 5) {
        var tx = fw[e][0], ty2 = fw[e][1];
        var tw = e == 5 ? 9 : 6, thh = e == 5 ? 22 : 13;
        canv += shape([[tx - tw, ty2 + 7], [tx + tw, ty2 + 7], [tx + tw, ty2 - thh], [tx - tw, ty2 - thh]], stone, INK(), 1.1);
        for (var j = -1; j <= 1; j++) canv += shape([[tx + j * (tw * 0.7) - 1.5, ty2 - thh], [tx + j * (tw * 0.7) + 1.5, ty2 - thh], [tx + j * (tw * 0.7) + 1.5, ty2 - thh - 3], [tx + j * (tw * 0.7) - 1.5, ty2 - thh - 3]], stone, INK(), 0.7);
      }
      var bx = fw[5][0], by = fw[5][1] - 25;
      canv += shape([[bx - 9, by + 3], [bx + 9, by + 3], [bx + 9, by], [bx - 9, by]], Palette.red, INK(), 0.8);
      canv += line([[bx, by], [bx, by - 20]], INK(), 1.5);
      canv += anim("flutter", shape([[bx, by - 20], [bx + 16, by - 16], [bx, by - 11]], Palette.orange, INK(), 0.9) + dot(bx + 7, by - 16, 1.6, Palette.black), -Math.random());
    } else if (h.temple) {
      var ap = h.summit;
      var st = [];
      for (var i = 0; i <= 8; i++) {
        var t = i / 8;
        var x = ap[0] - h.R * 0.5 * (1 - t);
        st.push([x + Math.sin(t * 9) * 4, surf(x) + 3]);
      }
      canv += line(st, Palette.cream, 2.5);
      canv += line(st, INK(0.6), 0.8);
      canv += Arch.gopuram(ap[0], ap[1] + 6, { sca: 0.4 * sc, tiers: 2 });
    }
    return canv;
  };
}();
