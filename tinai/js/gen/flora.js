// More trees and plants.
var Flora = new function() {
  function A(args) { args = args || {}; return { s: args.sca || 1, dir: args.dir || 1 }; }
  function trunk(x, y, h, w, lean) {
    var tx = x + lean * h;
    return shape([[x - w, y], [x + w, y], [tx + w * 0.7, y - h], [tx - w * 0.7, y - h]], Palette.brown, INK(), 1.3) +
      line([[x - w * 0.3, y - 2], [tx - w * 0.2, y - h + 2]], Palette.darkbrown, 1);
  }
  function lobe(cx, cy, r, fil, n0, wid) {
    var pts = [];
    for (var i = 0; i < 22; i++) {
      var t = (i / 22) * Math.PI * 2;
      var rr = r * (1 + (Noise.noise(i * 0.4, n0) - 0.5) * 0.25) * (1 + 0.06 * Math.cos(t * 7));
      pts.push([cx + Math.cos(t) * rr, cy + Math.sin(t) * rr]);
    }
    return shape(pts, fil, INK(), wid || 1.3);
  }
  function leafpat(lobes, n, l, w, fil) {
    var out = "";
    for (var i = 0; i < n; i++) {
      var L = lobes[Math.floor(Math.random() * lobes.length)];
      var a = Math.random() * Math.PI * 2, r = Math.random() * L[2] * 0.8;
      var x = L[0] + Math.cos(a) * r, y = L[1] + Math.sin(a) * r, ang = Math.random() * Math.PI;
      var c = Math.cos(ang), s = Math.sin(ang);
      out += shape([[x + c * l, y + s * l], [x - s * w, y + c * w], [x - c * l, y - s * l], [x + s * w, y - c * w]], fil, INK(0.8), 0.8);
    }
    return out;
  }

  // tamarind: tall, with a wide feathery dark crown and hanging pods
  this.tamarind = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    var h = (60 + Math.random() * 20) * s;
    canv += trunk(x, y, h, 7 * s, normRand(-0.1, 0.1));
    var R = (62 + Math.random() * 20) * s;
    var n0 = Math.random() * 10;
    var lobes = [];
    for (var i = 0; i < 7; i++) {
      var u = i / 6 - 0.5;
      lobes.push([x + u * R * 1.6, y - h - R * 0.3 - Math.cos(u * Math.PI) * R * 0.3, R * (0.3 + Math.random() * 0.12)]);
    }
    lobes.push([x, y - h - R * 0.7, R * 0.4]);
    for (var i = 0; i < lobes.length; i++) canv += lobe(lobes[i][0], lobes[i][1], lobes[i][2], i % 2 ? Palette.darkgreen : "#3f5a2f", n0 + i);
    // feathery leaves as rows of tiny ticks
    for (var i = 0; i < R; i++) {
      var L = lobes[Math.floor(Math.random() * lobes.length)];
      var aa = Math.random() * Math.PI * 2, r = Math.random() * L[2] * 0.85;
      var lx = L[0] + Math.cos(aa) * r, ly = L[1] + Math.sin(aa) * r;
      for (var j = -2; j <= 2; j++) canv += line([[lx + j * 1.6 * s, ly - 1.5 * s], [lx + j * 1.6 * s, ly + 1.5 * s]], Palette.lightgreen, 0.6);
    }
    for (var i = 0; i < 8; i++) {
      var L = lobes[Math.floor(Math.random() * lobes.length)];
      var px = L[0] + (Math.random() - 0.5) * L[2], py = L[1] + L[2] * 0.7;
      canv += line(bezmh([[px, py], [px + 3 * s, py + 6 * s], [px + 1 * s, py + 12 * s]], 1), Palette.brown, 2 * s);
    }
    return canv;
  };
  this.neem = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    var h = (50 + Math.random() * 20) * s;
    canv += trunk(x, y, h, 6 * s, normRand(-0.1, 0.1));
    var R = (50 + Math.random() * 16) * s;
    var n0 = Math.random() * 10;
    var lobes = [];
    for (var i = 0; i < 5; i++) {
      var aa = Math.PI + (i / 4) * Math.PI;
      lobes.push([x + Math.cos(aa) * R * 0.5, y - h - R * 0.3 + Math.sin(aa) * R * 0.4, R * (0.4 + Math.random() * 0.15)]);
    }
    lobes.push([x, y - h - R * 0.55, R * 0.55]);
    for (var i = 0; i < lobes.length; i++) canv += lobe(lobes[i][0], lobes[i][1], lobes[i][2], i % 2 ? Palette.green : Palette.lightgreen, n0 + i);
    canv += leafpat(lobes, Math.floor(R * 0.5), 5 * s, 1.2 * s, Palette.darkgreen);
    return canv;
  };
  this.jackfruit = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    var h = (56 + Math.random() * 16) * s;
    canv += trunk(x, y, h, 8 * s, normRand(-0.08, 0.08));
    var R = (46 + Math.random() * 14) * s;
    var n0 = Math.random() * 10;
    var lobes = [[x - R * 0.5, y - h - R * 0.2, R * 0.45], [x + R * 0.5, y - h - R * 0.2, R * 0.45], [x, y - h - R * 0.6, R * 0.55]];
    for (var i = 0; i < lobes.length; i++) canv += lobe(lobes[i][0], lobes[i][1], lobes[i][2], Palette.darkgreen, n0 + i);
    canv += leafpat(lobes, Math.floor(R * 0.5), 6 * s, 2.2 * s, Palette.green);
    // the great fruit hang from the trunk itself
    for (var i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
      var fy = y - h * (0.35 + i * 0.25), fx = x + (i % 2 ? 9 : -9) * s;
      canv += line([[x, fy - 4 * s], [fx, fy]], Palette.darkbrown, 1.2 * s);
      var fr = [];
      for (var j = 0; j <= 10; j++) { var t = (j / 10) * Math.PI * 2; fr.push([fx + Math.cos(t) * 6 * s, fy + 9 * s + Math.sin(t) * 10 * s]); }
      canv += shape(fr, "#a8a040", INK(), 1);
      for (var j = 0; j < 8; j++) canv += dot(fx + (Math.random() - 0.5) * 8 * s, fy + 9 * s + (Math.random() - 0.5) * 14 * s, 0.7 * s, Palette.darkbrown);
    }
    return canv;
  };
  this.peepal = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    var h = (54 + Math.random() * 20) * s;
    canv += trunk(x, y, h, 9 * s, normRand(-0.06, 0.06));
    var R = (60 + Math.random() * 20) * s;
    var n0 = Math.random() * 10;
    var lobes = [];
    for (var i = 0; i < 6; i++) {
      var aa = Math.PI + (i / 5) * Math.PI;
      lobes.push([x + Math.cos(aa) * R * 0.6, y - h - R * 0.3 + Math.sin(aa) * R * 0.45, R * (0.38 + Math.random() * 0.12)]);
    }
    lobes.push([x, y - h - R * 0.65, R * 0.5]);
    for (var i = 0; i < lobes.length; i++) canv += lobe(lobes[i][0], lobes[i][1], lobes[i][2], i % 2 ? Palette.green : Palette.darkgreen, n0 + i);
    // heart shaped leaves with drip tips
    for (var i = 0; i < R * 0.5; i++) {
      var L = lobes[Math.floor(Math.random() * lobes.length)];
      var aa = Math.random() * Math.PI * 2, r = Math.random() * L[2] * 0.8;
      var lx = L[0] + Math.cos(aa) * r, ly = L[1] + Math.sin(aa) * r;
      canv += shape([[lx, ly - 3 * s], [lx + 3 * s, ly - 1 * s], [lx + 0.5 * s, ly + 5 * s], [lx - 3 * s, ly - 1 * s]], Palette.lightgreen, INK(0.8), 0.7);
    }
    // a platform around the base
    canv += shape([[x - 22 * s, y + 2], [x + 22 * s, y + 2], [x + 20 * s, y - 6 * s], [x - 20 * s, y - 6 * s]], "#b3a689", INK(), 1);
    return canv;
  };
  this.areca = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    var h = (150 + Math.random() * 80) * s;
    var lean = normRand(-0.08, 0.08);
    canv += shape([[x - 2.5 * s, y], [x + 2.5 * s, y], [x + lean * h + 1.8 * s, y - h], [x + lean * h - 1.8 * s, y - h]], "#8a9a6a", INK(), 1.1);
    for (var i = 1; i < 12; i++) canv += line([[x + lean * h * (i / 12) - 2.5 * s, y - h * (i / 12)], [x + lean * h * (i / 12) + 2.5 * s, y - h * (i / 12)]], INK(0.5), 0.6);
    var tx = x + lean * h, ty = y - h;
    for (var k = 0; k < 7; k++) {
      var ang = -Math.PI * 1.1 + (k / 6) * Math.PI * 1.2;
      var L = (34 + Math.random() * 10) * s;
      var mid = bezmh([[tx, ty], [tx + Math.cos(ang) * L * 0.6, ty + Math.sin(ang) * L * 0.6 - 4 * s], [tx + Math.cos(ang) * L, ty + Math.sin(ang) * L + L * 0.5]], 1);
      canv += line(mid, Palette.darkgreen, 1.1 * s);
      for (var j = 2; j < mid.length - 1; j += 2) {
        var q = mid[j + 1], o = mid[j - 1];
        var na = Math.atan2(q[1] - o[1], q[0] - o[0]) + Math.PI / 2;
        canv += line([[mid[j][0] + Math.cos(na) * 5 * s, mid[j][1] + Math.sin(na) * 5 * s], [mid[j][0] - Math.cos(na) * 5 * s, mid[j][1] - Math.sin(na) * 5 * s]], Palette.green, 1.2 * s);
      }
    }
    for (var i = 0; i < 5; i++) canv += dot(tx + (Math.random() - 0.5) * 8 * s, ty + 4 * s + Math.random() * 6 * s, 2 * s, Palette.orange, INK(), 0.6);
    return canv;
  };
  this.bamboo = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    var n = 4 + Math.floor(Math.random() * 4);
    for (var k = 0; k < n; k++) {
      var bx = x + (k - n / 2) * 6 * s, h = (70 + Math.random() * 50) * s, lean = (k - n / 2) * 0.06;
      var pts = [];
      for (var i = 0; i <= 8; i++) pts.push([bx + lean * h * Math.pow(i / 8, 2), y - h * (i / 8)]);
      canv += line(pts, "#9aa860", 3 * s);
      canv += line(pts, INK(0.7), 0.6);
      for (var i = 1; i < 8; i++) canv += line([[pts[i][0] - 2 * s, pts[i][1]], [pts[i][0] + 2 * s, pts[i][1]]], INK(), 1);
      for (var i = 3; i <= 8; i++) for (var j = 0; j < 3; j++) {
        var ang = -Math.PI / 2 + (j - 1) * 0.9 + lean * 2;
        canv += shape([[pts[i][0], pts[i][1]], [pts[i][0] + Math.cos(ang - 0.15) * 12 * s, pts[i][1] + Math.sin(ang - 0.15) * 12 * s], [pts[i][0] + Math.cos(ang) * 16 * s, pts[i][1] + Math.sin(ang) * 16 * s], [pts[i][0] + Math.cos(ang + 0.15) * 12 * s, pts[i][1] + Math.sin(ang + 0.15) * 12 * s]], Palette.lightgreen, INK(0.8), 0.6);
      }
    }
    return canv;
  };
  this.papaya = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    var h = (50 + Math.random() * 25) * s;
    canv += shape([[x - 3 * s, y], [x + 3 * s, y], [x + 2 * s, y - h], [x - 2 * s, y - h]], "#8a7a5a", INK(), 1);
    for (var i = 0; i < 5; i++) canv += dot(x + (i % 2 ? 4 : -4) * s, y - h + 8 * s + i * 3 * s, 3.2 * s, i % 2 ? Palette.yellow : Palette.green, INK(), 0.7);
    for (var k = 0; k < 7; k++) {
      var ang = -Math.PI / 2 + (k / 6 - 0.5) * 2.4;
      var L = 24 * s;
      var ex = x + Math.cos(ang) * L, ey = y - h + Math.sin(ang) * L;
      canv += line([[x, y - h], [ex, ey]], Palette.lightgreen, 1.2 * s);
      var lf = [[ex, ey]];
      for (var j = 0; j < 7; j++) { var t = ang + (j / 6 - 0.5) * 2.6; lf.push([ex + Math.cos(t) * 10 * s * (j % 2 ? 1 : 0.55), ey + Math.sin(t) * 10 * s * (j % 2 ? 1 : 0.55)]); }
      canv += shape(lf, Palette.green, INK(), 0.8);
    }
    return canv;
  };
  this.drumstick = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    var h = (50 + Math.random() * 20) * s;
    canv += line([[x, y], [x + 2 * s, y - h]], Palette.brown, 4 * s);
    canv += line([[x, y], [x + 2 * s, y - h]], INK(), 0.7);
    for (var k = 0; k < 6; k++) {
      var ang = -Math.PI / 2 + (k / 5 - 0.5) * 2.2;
      var bx = x + 2 * s * (0.6 + k * 0.06), by = y - h * (0.55 + k * 0.08);
      var ex = bx + Math.cos(ang) * 26 * s, ey = by + Math.sin(ang) * 26 * s;
      canv += line([[bx, by], [ex, ey]], Palette.brown, 1.4 * s);
      for (var j = 0; j < 12; j++) canv += dot(bx + (ex - bx) * (0.3 + 0.7 * Math.random()) + (Math.random() - 0.5) * 8 * s, by + (ey - by) * (0.3 + 0.7 * Math.random()) + (Math.random() - 0.5) * 8 * s, 1.1 * s, Palette.lightgreen);
      if (k % 2) canv += line([[ex, ey], [ex + 1 * s, ey + 22 * s]], Palette.green, 1.3 * s);
    }
    return canv;
  };
  this.hibiscus = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = lobe(x, y - 14 * s, 16 * s, Palette.green, Math.random() * 10, 1.1);
    for (var i = 0; i < 5; i++) {
      var fx = x + (Math.random() - 0.5) * 22 * s, fy = y - 14 * s + (Math.random() - 0.5) * 18 * s;
      for (var p = 0; p < 5; p++) { var t = (p / 5) * Math.PI * 2; canv += dot(fx + Math.cos(t) * 2.4 * s, fy + Math.sin(t) * 2.4 * s, 2 * s, Palette.red, INK(0.6), 0.4); }
      canv += line([[fx, fy], [fx + 3 * s, fy - 4 * s]], Palette.yellow, 1 * s);
    }
    return canv;
  };
  this.bougainvillea = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    var n0 = Math.random() * 10;
    canv += lobe(x, y - 22 * s, 24 * s, Palette.green, n0, 1.1);
    canv += lobe(x + 14 * s, y - 36 * s, 16 * s, Palette.green, n0 + 1, 1.1);
    var col = randChoice(["#c8457a", Palette.orange, "#d98aa0"]);
    for (var i = 0; i < 40; i++) {
      var fx = x + (Math.random() - 0.5) * 56 * s, fy = y - 28 * s + (Math.random() - 0.5) * 36 * s;
      if (Math.pow((fx - x) / (28 * s), 2) + Math.pow((fy - (y - 28 * s)) / (20 * s), 2) > 1) continue;
      canv += shape([[fx, fy - 2.5 * s], [fx + 2.2 * s, fy + 1.5 * s], [fx - 2.2 * s, fy + 1.5 * s]], col, INK(0.5), 0.4);
    }
    return canv;
  };
  this.tulsi = function(x, y, args) {
    // the sacred basil in its brick stand before the house
    var a = A(args), s = a.s;
    var canv = shape([[x - 7 * s, y], [x + 7 * s, y], [x + 6 * s, y - 16 * s], [x - 6 * s, y - 16 * s]], Palette.orange, INK(), 1);
    canv += line([[x - 7 * s, y - 4 * s], [x + 7 * s, y - 4 * s]], Palette.white, 1 * s);
    canv += line([[x - 6 * s, y - 15 * s], [x + 6 * s, y - 15 * s]], Palette.white, 1 * s);
    for (var i = 0; i < 7; i++) {
      var ang = -Math.PI / 2 + (i / 6 - 0.5) * 1.6;
      canv += line([[x, y - 16 * s], [x + Math.cos(ang) * 10 * s, y - 16 * s + Math.sin(ang) * 10 * s]], Palette.green, 1 * s);
      canv += dot(x + Math.cos(ang) * 11 * s, y - 16 * s + Math.sin(ang) * 11 * s, 1.6 * s, "#7a5a8a");
    }
    canv += shape([[x + 9 * s, y], [x + 13 * s, y], [x + 12 * s, y - 3 * s], [x + 10 * s, y - 3 * s]], Palette.yellow, INK(), 0.6);
    return canv;
  };
  this.pricklyPear = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    var pads = [[x, y - 10 * s, 0], [x - 9 * s, y - 24 * s, -0.5], [x + 8 * s, y - 26 * s, 0.4], [x - 2 * s, y - 38 * s, 0.1]];
    for (var i = 0; i < pads.length; i++) {
      var pd = [];
      for (var j = 0; j <= 12; j++) { var t = (j / 12) * Math.PI * 2; pd.push([pads[i][0] + Math.cos(t + pads[i][2]) * 7 * s, pads[i][1] + Math.sin(t + pads[i][2]) * 10 * s]); }
      canv += shape(pd, Palette.green, INK(), 1);
      for (var j = 0; j < 6; j++) canv += dot(pads[i][0] + (Math.random() - 0.5) * 9 * s, pads[i][1] + (Math.random() - 0.5) * 13 * s, 0.6 * s, Palette.cream);
    }
    canv += dot(x - 2 * s, y - 49 * s, 2.2 * s, Palette.yellow, INK(), 0.6);
    canv += dot(x + 8 * s, y - 37 * s, 2.2 * s, Palette.red, INK(), 0.6);
    return canv;
  };
  this.agave = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    for (var i = 0; i < 9; i++) {
      var ang = -Math.PI / 2 + (i / 8 - 0.5) * 2.6;
      var L = (16 + Math.random() * 10) * s;
      canv += shape([[x, y], [x + Math.cos(ang - 0.12) * L * 0.7, y + Math.sin(ang - 0.12) * L * 0.7], [x + Math.cos(ang) * L, y + Math.sin(ang) * L], [x + Math.cos(ang + 0.12) * L * 0.7, y + Math.sin(ang + 0.12) * L * 0.7]], i % 2 ? "#7a9a7a" : "#5a7a6a", INK(), 0.9);
    }
    if (Math.random() < 0.4) {
      canv += line([[x, y - 4 * s], [x + 2 * s, y - 70 * s]], Palette.brown, 1.6 * s);
      for (var i = 0; i < 4; i++) canv += line([[x + 1 * s, y - 40 * s - i * 8 * s], [x + (i % 2 ? 8 : -6) * s, y - 44 * s - i * 8 * s]], Palette.brown, 1 * s);
    }
    return canv;
  };
  this.reeds = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    for (var i = 0; i < 7; i++) {
      var rx = x + (i - 3) * 3.5 * s, h = (18 + Math.random() * 14) * s;
      canv += line([[rx, y], [rx + (Math.random() - 0.5) * 6 * s, y - h]], Palette.darkgreen, 1.1 * s);
      if (i % 2) canv += line([[rx + 1 * s, y - h], [rx + 1 * s, y - h - 6 * s]], Palette.brown, 2 * s);
    }
    return canv;
  };
  this.lotusClump = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    for (var i = 0; i < 4; i++) {
      var lx = x + (i - 1.5) * 12 * s, ly = y - (i % 2) * 4 * s;
      canv += dot(lx, ly, 6 * s, Palette.green, INK(), 1);
      canv += line([[lx, ly], [lx + 4 * s, ly - 3 * s]], INK(0.6), 0.8);
    }
    var fx = x + 4 * s, fy = y - 12 * s;
    for (var p = -2; p <= 2; p++) canv += shape([[fx, fy + 3 * s], [fx + p * 2.5 * s - 1.5 * s, fy - 4 * s], [fx + p * 2.5 * s, fy - 7 * s], [fx + p * 2.5 * s + 1.5 * s, fy - 4 * s]], "#d98aa0", INK(), 0.7);
    canv += line([[fx, fy + 3 * s], [fx - 2 * s, y]], Palette.darkgreen, 1);
    return canv;
  };
  this.sugarcaneField = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    var W = (60 + Math.random() * 40) * s;
    for (var i = 0; i < W / 5; i++) {
      var sx = x - W / 2 + i * 5 * s, h = (40 + Math.random() * 16) * s;
      canv += line([[sx, y], [sx + 2 * s, y - h]], "#7a4a6a", 2 * s);
      for (var j = 0; j < 3; j++) canv += line([[sx + 2 * s, y - h], [sx + (j - 1) * 7 * s, y - h - 10 * s - Math.abs(j - 1) * 2 * s]], Palette.green, 1.3 * s);
    }
    return canv;
  };
  this.milletField = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    var W = (50 + Math.random() * 40) * s;
    for (var i = 0; i < W / 4; i++) {
      var sx = x - W / 2 + i * 4 * s, h = (22 + Math.random() * 10) * s;
      canv += line([[sx, y], [sx + 1 * s, y - h]], Palette.lightgreen, 1 * s);
      canv += line([[sx + 1 * s, y - h], [sx + 1.5 * s, y - h - 7 * s]], Palette.yellow, 2.2 * s);
    }
    return canv;
  };
  this.plantainBunch = function(x, y, args) {
    // a banana plant with a hanging bunch and purple flower
    var a = A(args), s = a.s;
    var canv = Trees.banana(x, y, { sca: s });
    var bx = x + 10 * s, by = y - 34 * s;
    canv += line([[x, by - 4 * s], [bx, by + 14 * s]], Palette.darkgreen, 2 * s);
    for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) canv += line([[bx - 5 * s + j * 3.3 * s, by + i * 4 * s], [bx - 7 * s + j * 3.3 * s, by + 4 * s + i * 4 * s]], Palette.lightgreen, 2.2 * s);
    canv += shape([[bx - 3 * s, by + 18 * s], [bx + 3 * s, by + 18 * s], [bx, by + 28 * s]], "#7a3a5a", INK(), 0.8);
    return canv;
  };
  this.haystack = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    var pts = [];
    for (var i = 0; i <= 14; i++) { var t = Math.PI + (i / 14) * Math.PI; pts.push([x + Math.cos(t) * 22 * s, y + Math.sin(t) * 30 * s * (1 + 0.05 * Math.sin(i * 3))]); }
    canv += shape(pts, Palette.paleyellow, INK(), 1.1);
    for (var i = 0; i < 20; i++) canv += line([[x + (Math.random() - 0.5) * 36 * s, y - Math.random() * 26 * s], [x + (Math.random() - 0.5) * 36 * s, y - Math.random() * 26 * s]], Palette.yellow, 0.7);
    canv += line([[x, y - 30 * s], [x, y - 38 * s]], Palette.darkbrown, 1.4 * s);
    return canv;
  };
}();
