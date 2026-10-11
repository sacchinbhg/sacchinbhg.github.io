// Palmyra palm (panai, Borassus flabellifer), the state tree of Tamil Nadu,
// in flat mural pigment: brown ringed trunk, green fan fronds with black
// outlines, a skirt of dry yellow fronds, sometimes a cluster of black fruit.
var Palmyra = new function() {
  function frond(x0, y0, ang, args) {
    var len = args.len, fan = args.fan, spread = args.spread, droop = args.droop;
    var ns = args.ns;
    var canv = "";
    var ex = x0 + Math.cos(ang) * len;
    var ey = y0 + Math.sin(ang) * len + droop * len * 0.25;
    var cxp = x0 + Math.cos(ang) * len * 0.55;
    var cyp = y0 + Math.sin(ang) * len * 0.55 - droop * len * 0.1;
    var stalk = bezmh([[x0, y0], [cxp, cyp], [ex, ey]], 1);
    var s1 = stalk[stalk.length - 1];
    var s0 = stalk[stalk.length - 4];
    var fang = Math.atan2(s1[1] - s0[1], s1[0] - s0[0]);
    var tips = [];
    for (var j = 0; j < ns; j++) {
      var u = j / (ns - 1) - 0.5;
      var a = fang + u * spread;
      var l = fan * (0.72 + 0.28 * Math.cos(u * Math.PI));
      tips.push([ex + Math.cos(a) * l, ey + Math.sin(a) * l + droop * l * 0.6 * Math.abs(u)]);
    }
    // fan as a filled wedge with a notched outer edge
    var wedge = [[ex, ey]];
    for (var j = 0; j < tips.length; j++) {
      wedge.push(tips[j]);
      if (j < tips.length - 1) {
        wedge.push([
          (tips[j][0] + tips[j + 1][0]) / 2 - Math.cos(fang) * 3,
          (tips[j][1] + tips[j + 1][1]) / 2 - Math.sin(fang) * 3,
        ]);
      }
    }
    canv += shape(wedge, args.fil, INK(0.9), args.wid);
    // pleat lines
    for (var j = 0; j < tips.length; j++) {
      canv += line([[ex, ey], tips[j]], args.vein, args.wid * 0.7);
    }
    canv += line(stalk, INK(0.9), args.wid * 1.3);
    return canv;
  }

  this.tree = function(x, y, args) {
    var args = args != undefined ? args : {};
    var sca = args.sca != undefined ? args.sca : 1;
    var hei = args.hei != undefined ? args.hei : 220 + Math.random() * 130;
    var lean = args.lean != undefined ? args.lean : normRand(-0.12, 0.12);
    var fronds = args.fronds != undefined ? args.fronds : 8 + Math.floor(Math.random() * 5);
    var dead = args.dead != undefined ? args.dead : 2 + Math.floor(Math.random() * 4);
    var fruit = args.fruit != undefined ? args.fruit : Math.random() < 0.45;

    var canv = "";
    var h = hei * sca;
    var n0 = Math.random() * 10;
    var N = 28;
    var pts = [];
    for (var i = 0; i <= N; i++) {
      var t = i / N;
      pts.push([x + lean * h * t + (Noise.noise(t * 2.5, n0) - 0.5) * h * 0.06 * t, y - h * t]);
    }
    var wid = function(t) {
      return sca * (9.5 - 3 * t + 2.5 * Math.pow(t, 8));
    };
    var left = [], right = [];
    for (var i = 0; i <= N; i++) {
      var p = pts[i], q = pts[Math.min(N, i + 1)], o = pts[Math.max(0, i - 1)];
      var a = Math.atan2(q[1] - o[1], q[0] - o[0]) + Math.PI / 2;
      var w = wid(i / N);
      left.push([p[0] + Math.cos(a) * w, p[1] + Math.sin(a) * w]);
      right.push([p[0] - Math.cos(a) * w, p[1] - Math.sin(a) * w]);
    }
    var top = pts[N];
    var crownR = sca * (46 + Math.random() * 18);

    var list = [];
    for (var k = 0; k < fronds; k++) {
      list.push({ ang: -Math.PI * 1.12 + ((k + 0.5) / fronds) * Math.PI * 1.24 + (Math.random() - 0.5) * 0.2, depth: Math.random(), dead: false });
    }
    for (var k = 0; k < dead; k++) {
      list.push({ ang: Math.PI * 0.2 + Math.random() * Math.PI * 0.6, depth: Math.random(), dead: true });
    }
    list.sort(function(a, b) { return a.depth - b.depth; });

    var drawFrond = function(f) {
      var front = f.depth > 0.5;
      var fore = 0.7 + 0.3 * f.depth;
      if (f.dead) {
        return frond(top[0], top[1] + sca * 4, f.ang, {
          len: crownR * 0.45 * fore, fan: crownR * 0.8 * fore, spread: 0.7, droop: 1.1, ns: 8,
          fil: front ? Palette.yellow : Palette.brown, vein: Palette.darkbrown, wid: 1 * sca,
        });
      }
      return frond(top[0], top[1], f.ang, {
        len: crownR * 0.95 * fore, fan: crownR * 0.8 * fore,
        spread: 1.5 + Math.random() * 0.4,
        droop: 0.2 + 0.35 * Math.max(0, Math.cos(f.ang)),
        ns: 11 + Math.floor(Math.random() * 4),
        fil: front ? Palette.green : Palette.darkgreen, vein: Palette.darkgreen, wid: 1.1 * sca,
      });
    };

    var back = "", front = "";
    for (var k = 0; k < list.length; k++) if (list[k].depth <= 0.5) back += drawFrond(list[k]);
    canv += anim("sway", back, -Math.random() * 6);
    // trunk
    var trunk = left.concat(right.slice().reverse());
    canv += shape(trunk, Palette.brown, INK(), 1.5 * sca);
    for (var i = 1; i < N; i++) {
      var L = left[i], R = right[i];
      var ring = [];
      var bow = wid(i / N) * 0.45;
      for (var j = 0; j <= 4; j++) {
        var u = j / 4;
        ring.push([L[0] * (1 - u) + R[0] * u, L[1] * (1 - u) + R[1] * u + bow * (1 - Math.pow(2 * u - 1, 2))]);
      }
      canv += line(ring, i % 2 ? Palette.darkbrown : INK(0.6), 1 * sca);
    }
    for (var k = 0; k < list.length; k++) if (list[k].depth > 0.5) front += drawFrond(list[k]);
    if (fruit) {
      var side = Math.random() < 0.5 ? -1 : 1;
      var fx = top[0] + side * sca * 9, fy = top[1] + sca * 8;
      canv += line([[top[0], top[1]], [fx, fy]], INK(), 1.5 * sca);
      var nf = 3 + Math.floor(Math.random() * 5);
      for (var k = 0; k < nf; k++) {
        canv += dot(fx + (Math.random() - 0.5) * sca * 12, fy + Math.random() * sca * 12, sca * (3.5 + Math.random() * 1.5), Palette.black, Palette.darkbrown, 0.8);
      }
    }
    canv += anim("sway", front, -Math.random() * 6);
    return canv;
  };
}();
