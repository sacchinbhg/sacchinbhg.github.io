// More built things and whole scenes.
var Built = new function() {
  function A(args) { args = args || {}; return { s: args.sca || 1, dir: args.dir || 1 }; }
  var STONE = "#d6cbb0", STONE2 = "#b3a689", STONE3 = "#8d8068";
  var TILE = "#a0462a";

  function tiledRoof(x0, x1, y, h, canv) {
    var out = shape([[x0 - 6, y], [x1 + 6, y], [x1 - 4, y - h], [x0 + 4, y - h]], TILE, INK(), 1.2);
    for (var i = 1; i < 4; i++) out += line([[x0 - 6 + (i / 4) * 10, y - (i / 4) * h], [x1 + 6 - (i / 4) * 10, y - (i / 4) * h]], INK(0.5), 0.7);
    for (var xx = x0; xx < x1; xx += 8) out += line([[xx, y], [xx + 4, y - h]], INK(0.35), 0.6);
    return out;
  }

  // Chettinad mansion: a long pillared verandah under a tiled roof
  this.mansion = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    var W = 150 * s, H = 44 * s;
    canv += shape([[x - W / 2, y], [x + W / 2, y], [x + W / 2, y - H], [x - W / 2, y - H]], Palette.cream, INK(), 1.3);
    canv += shape([[x - W / 2, y], [x + W / 2, y], [x + W / 2, y - 8 * s], [x - W / 2, y - 8 * s]], STONE2, INK(), 1); // plinth / thinnai
    for (var i = 0; i < 7; i++) {
      var px = x - W / 2 + 10 * s + (i / 6) * (W - 20 * s);
      canv += shape([[px - 3 * s, y - 8 * s], [px + 3 * s, y - 8 * s], [px + 3 * s, y - H + 4 * s], [px - 3 * s, y - H + 4 * s]], Palette.darkbrown, INK(), 1);
      canv += shape([[px - 5 * s, y - H + 4 * s], [px + 5 * s, y - H + 4 * s], [px + 4 * s, y - H], [px - 4 * s, y - H]], Palette.darkbrown, INK(), 0.8);
    }
    canv += shape([[x - 10 * s, y - 8 * s], [x + 10 * s, y - 8 * s], [x + 10 * s, y - H + 6 * s], [x - 10 * s, y - H + 6 * s]], Palette.black, INK(), 1);
    canv += shape([[x - 10 * s, y - H + 6 * s], [x + 10 * s, y - H + 6 * s], [x + 9 * s, y - H + 2 * s], [x - 9 * s, y - H + 2 * s]], Palette.yellow, INK(), 0.8);
    canv += line([[x - W / 2, y - H + 2 * s], [x + W / 2, y - H + 2 * s]], Palette.red, 2.5 * s);
    canv += tiledRoof(x - W / 2, x + W / 2, y - H, 26 * s);
    // upper storey set back
    canv += shape([[x - W * 0.3, y - H - 20 * s], [x + W * 0.3, y - H - 20 * s], [x + W * 0.3, y - H - 48 * s], [x - W * 0.3, y - H - 48 * s]], Palette.cream, INK(), 1.2);
    for (var i = -1; i <= 1; i++) canv += shape([[x + i * 22 * s - 5 * s, y - H - 26 * s], [x + i * 22 * s + 5 * s, y - H - 26 * s], [x + i * 22 * s + 5 * s, y - H - 42 * s], [x + i * 22 * s - 5 * s, y - H - 42 * s]], Palette.green, INK(), 0.9);
    canv += tiledRoof(x - W * 0.3, x + W * 0.3, y - H - 48 * s, 16 * s);
    return canv;
  };
  // agraharam: a row of tiled houses with raised thinnai verandahs
  this.agraharam = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    var n = 3;
    var W = 54 * s, H = 30 * s;
    for (var k = 0; k < n; k++) {
      var hx = x + (k - 1) * (W + 4 * s);
      canv += shape([[hx - W / 2, y], [hx + W / 2, y], [hx + W / 2, y - H], [hx - W / 2, y - H]], k % 2 ? Palette.cream : Palette.paleyellow, INK(), 1.2);
      canv += shape([[hx - W / 2, y], [hx + W / 2, y], [hx + W / 2, y - 7 * s], [hx - W / 2, y - 7 * s]], STONE2, INK(), 0.9);
      canv += shape([[hx - 6 * s, y - 7 * s], [hx + 6 * s, y - 7 * s], [hx + 6 * s, y - H + 5 * s], [hx - 6 * s, y - H + 5 * s]], Palette.black, INK(), 1);
      for (var e = -1; e <= 1; e += 2) canv += line([[hx + e * 18 * s, y - 7 * s], [hx + e * 18 * s, y - H + 3 * s]], Palette.darkbrown, 2.5 * s);
      canv += line([[hx - W / 2, y - 2 * s], [hx + W / 2, y - 2 * s]], Palette.red, 1.5 * s);
      canv += line([[hx - W / 2, y - 4 * s], [hx + W / 2, y - 4 * s]], Palette.white, 1 * s);
      canv += tiledRoof(hx - W / 2, hx + W / 2, y - H, 18 * s);
      // kolam at the step
      for (var i = -1; i <= 1; i++) for (var j = 0; j < 2; j++) canv += dot(hx + i * 3 * s, y + 3 * s + j * 3 * s, 0.6 * s, Palette.white);
    }
    return canv;
  };
  // inscription pillar: a stone column cut with lines of Tamil
  this.inscription = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    canv += shape([[x - 12 * s, y], [x + 12 * s, y], [x + 10 * s, y - 6 * s], [x - 10 * s, y - 6 * s]], STONE2, INK(), 1);
    canv += shape([[x - 7 * s, y - 6 * s], [x + 7 * s, y - 6 * s], [x + 6 * s, y - 60 * s], [x - 6 * s, y - 60 * s]], STONE, INK(), 1.2);
    for (var i = 0; i < 12; i++) {
      var ly = y - 10 * s - i * 4 * s;
      for (var j = 0; j < 4; j++) canv += line([[x - 5 * s + j * 2.8 * s, ly], [x - 4 * s + j * 2.8 * s, ly - 1.5 * s * ((i + j) % 2 ? 1 : -1)]], STONE3, 0.8);
    }
    canv += shape([[x - 8 * s, y - 60 * s], [x + 8 * s, y - 60 * s], [x + 5 * s, y - 68 * s], [x - 5 * s, y - 68 * s]], STONE2, INK(), 1);
    canv += dot(x, y - 70 * s, 3 * s, STONE2, INK(), 0.9);
    return canv;
  };
  // kalanjiyam: a round mud granary with a thatched cap
  this.granary = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    var R = 16 * s, H = 30 * s;
    canv += shape([[x - R, y], [x + R, y], [x + R * 0.95, y - H], [x - R * 0.95, y - H]], Palette.orange, INK(), 1.2);
    for (var i = 1; i < 4; i++) canv += line([[x - R, y - i * 7 * s], [x + R, y - i * 7 * s]], INK(0.4), 0.7);
    canv += shape([[x - R - 4 * s, y - H], [x + R + 4 * s, y - H], [x, y - H - 16 * s]], Palette.yellow, INK(), 1.2);
    for (var i = 0; i < 6; i++) canv += tick(x - R - 2 * s + i * (2 * R + 4 * s) / 5, y - H, 0, 4 * s, Palette.brown, 1);
    canv += shape([[x - 3 * s, y - 10 * s], [x + 3 * s, y - 10 * s], [x + 3 * s, y - 18 * s], [x - 3 * s, y - 18 * s]], Palette.darkbrown, INK(), 0.8);
    return canv;
  };
  this.cattleShed = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    var W = 70 * s, H = 24 * s;
    for (var i = 0; i < 4; i++) canv += line([[x - W / 2 + (i / 3) * W, y], [x - W / 2 + (i / 3) * W, y - H]], Palette.darkbrown, 2.4 * s);
    canv += shape([[x - W / 2 - 6 * s, y - H], [x + W / 2 + 6 * s, y - H], [x + W / 2, y - H - 14 * s], [x - W / 2, y - H - 14 * s]], Palette.yellow, INK(), 1.2);
    for (var i = 0; i < 10; i++) canv += tick(x - W / 2 - 4 * s + i * (W + 8 * s) / 9, y - H, 0, 4 * s, Palette.brown, 1);
    canv += Figures.cow(x - 10 * s, y + 2, { sca: s * 0.7, dir: 1, col: Palette.cream });
    canv += Figures.cow(x + 18 * s, y + 1, { sca: s * 0.7, dir: -1, col: Palette.brown });
    canv += Flora.haystack(x + W / 2 + 18 * s, y + 2, { sca: s * 0.6 });
    return canv;
  };
  this.kiln = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    var pts = [];
    for (var i = 0; i <= 12; i++) { var t = Math.PI + (i / 12) * Math.PI; pts.push([x + Math.cos(t) * 20 * s, y + Math.sin(t) * 18 * s]); }
    canv += shape(pts, Palette.orange, INK(), 1.2);
    canv += shape([[x - 5 * s, y], [x + 5 * s, y], [x + 4 * s, y - 8 * s], [x - 4 * s, y - 8 * s]], Palette.black, INK(), 0.9);
    canv += shape([[x - 3 * s, y - 1 * s], [x + 3 * s, y - 1 * s], [x, y - 7 * s]], Palette.yellow, "none", 0);
    var sm = "";
    for (var i = 0; i < 3; i++) sm += line(bezmh([[x + (i - 1) * 6 * s, y - 18 * s], [x + (i - 1) * 8 * s + 3 * s, y - 28 * s], [x + (i - 1) * 6 * s - 2 * s, y - 38 * s]], 1), "rgba(120,110,100,0.6)", 2.2 * s);
    canv += anim("smoke", sm, -Math.random() * 4);
    for (var i = 0; i < 4; i++) canv += shape([[x + 26 * s + i * 9 * s - 4 * s, y], [x + 26 * s + i * 9 * s + 4 * s, y], [x + 26 * s + i * 9 * s + 3 * s, y - 9 * s], [x + 26 * s + i * 9 * s - 3 * s, y - 9 * s]], Palette.orange, INK(), 0.8);
    return canv;
  };
  // kamalai: bullocks drawing a leather bucket up from a well on a ramp
  this.kamalai = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = Arch.well(x, y, { sca: s });
    canv += line([[x + 15 * s, y - 36 * s], [x + 15 * s, y - 48 * s]], Palette.darkbrown, 2 * s);
    canv += dot(x + 15 * s, y - 48 * s, 4 * s, Palette.yellow, INK(), 0.9);
    canv += line([[x + 15 * s, y - 52 * s], [x + 70 * s, y - 8 * s]], INK(), 0.8);
    canv += Figures.cow(x + 84 * s, y, { sca: s * 0.8, dir: 1, col: Palette.white });
    canv += Figures.man(x + 66 * s, y + 2, { sca: s * 0.7, dir: 1, prop: "stick" });
    return canv;
  };
  // a stone bridge of arches across a river
  this.bridge = function(x, y, args) {
    var a = A(args), s = a.s;
    var W = (args && args.width) || 90 * s;
    var canv = "";
    var n = Math.max(2, Math.round(W / (30 * s)));
    canv += shape([[x - W / 2 - 8 * s, y + 2 * s], [x + W / 2 + 8 * s, y + 2 * s], [x + W / 2 + 8 * s, y - 14 * s], [x - W / 2 - 8 * s, y - 14 * s]], STONE, INK(), 1.2);
    for (var i = 0; i < n; i++) {
      var cx = x - W / 2 + ((i + 0.5) / n) * W;
      var arc = [];
      for (var j = 0; j <= 10; j++) { var t = Math.PI + (j / 10) * Math.PI; arc.push([cx + Math.cos(t) * (W / n) * 0.36, y + 2 * s + Math.sin(t) * 10 * s]); }
      canv += shape(arc, Palette.blue, INK(), 1);
    }
    canv += line([[x - W / 2 - 8 * s, y - 14 * s], [x + W / 2 + 8 * s, y - 14 * s]], STONE3, 2 * s);
    for (var i = 0; i <= n * 3; i++) canv += shape([[x - W / 2 - 8 * s + (i / (n * 3)) * (W + 16 * s) - 1.5 * s, y - 14 * s], [x - W / 2 - 8 * s + (i / (n * 3)) * (W + 16 * s) + 1.5 * s, y - 14 * s], [x - W / 2 - 8 * s + (i / (n * 3)) * (W + 16 * s) + 1.5 * s, y - 18 * s], [x - W / 2 - 8 * s + (i / (n * 3)) * (W + 16 * s) - 1.5 * s, y - 18 * s]], STONE2, INK(), 0.7);
    return canv;
  };
  this.steppingStones = function(x, y, args) {
    var a = A(args), s = a.s;
    var W = (args && args.width) || 70 * s;
    var canv = "";
    var n = Math.max(3, Math.round(W / (12 * s)));
    for (var i = 0; i < n; i++) canv += dot(x - W / 2 + ((i + 0.5) / n) * W, y + (i % 2) * 3 * s, 4.5 * s, STONE2, INK(), 0.9);
    return canv;
  };
  // palanquin carried by four bearers
  this.palanquin = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = "";
    canv += Figures.man(f(-44), y, { sca: s * 0.9, dir: dir, prop: "haul" });
    canv += Figures.man(f(-30), y + 3, { sca: s * 0.9, dir: dir, prop: "haul" });
    canv += line([[f(-50), y - 46 * s], [f(50), y - 46 * s]], Palette.darkbrown, 2.5 * s);
    canv += shape([[f(-24), y - 44 * s], [f(24), y - 44 * s], [f(24), y - 30 * s], [f(-24), y - 30 * s]], Palette.red, INK(), 1.1);
    var top = [];
    for (var i = 0; i <= 10; i++) { var t = Math.PI + (i / 10) * Math.PI; top.push([f(Math.cos(t) * 26), y - 44 * s + Math.sin(t) * 12 * s]); }
    canv += shape(top, Palette.yellow, INK(), 1.1);
    for (var i = 0; i < 7; i++) canv += dot(f(-24 + i * 8), y - 30 * s, 1.8 * s, Palette.yellow);
    canv += shape([[f(-10), y - 42 * s], [f(10), y - 42 * s], [f(10), y - 32 * s], [f(-10), y - 32 * s]], Palette.black, INK(), 0.8);
    canv += dot(f(2), y - 38 * s, 3.5 * s, Figures.SKIN, INK(), 0.8);
    canv += dot(f(0), y - 39 * s, 2.5 * s, Palette.black, "none", 0);
    canv += Figures.man(f(30), y + 3, { sca: s * 0.9, dir: dir, prop: "haul" });
    canv += Figures.man(f(44), y, { sca: s * 0.9, dir: dir, prop: "haul" });
    return canv;
  };
  // a Chola sailing vessel on the river
  this.sailboat = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = "";
    canv += shape([[f(-34), y - 10 * s], [f(34), y - 10 * s], [f(40), y - 22 * s], [f(30), y - 18 * s], [f(-30), y - 18 * s], [f(-38), y - 24 * s]], Palette.darkbrown, INK(), 1.2);
    canv += line([[f(-30), y - 14 * s], [f(30), y - 14 * s]], Palette.yellow, 1.2 * s);
    canv += line([[f(2), y - 18 * s], [f(2), y - 70 * s]], Palette.darkbrown, 2 * s);
    canv += shape([[f(4), y - 66 * s], [f(34), y - 40 * s], [f(4), y - 22 * s]], Palette.cream, INK(), 1);
    canv += line([[f(10), y - 60 * s], [f(10), y - 26 * s]], Palette.red, 1.2 * s);
    canv += line([[f(20), y - 52 * s], [f(20), y - 30 * s]], Palette.red, 1.2 * s);
    canv += shape([[f(2), y - 70 * s], [f(14), y - 67 * s], [f(2), y - 64 * s]], Palette.orange, INK(), 0.8);
    canv += Figures.man(f(-18), y - 16 * s, { sca: s * 0.6, dir: dir });
    canv += Figures.man(f(22), y - 16 * s, { sca: s * 0.6, dir: dir, prop: "paddle" });
    for (var i = 0; i < 4; i++) canv += line([[f(-30 + i * 16), y - 6 * s], [f(-22 + i * 16), y - 6 * s]], Palette.cream, 1);
    return canv;
  };
  // deepa stambham: a stone lamp tower with many lamp niches
  this.lampTower = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    canv += shape([[x - 10 * s, y], [x + 10 * s, y], [x + 8 * s, y - 6 * s], [x - 8 * s, y - 6 * s]], STONE2, INK(), 1);
    canv += shape([[x - 5 * s, y - 6 * s], [x + 5 * s, y - 6 * s], [x + 3 * s, y - 70 * s], [x - 3 * s, y - 70 * s]], STONE, INK(), 1.1);
    for (var i = 0; i < 7; i++) {
      var ly = y - 14 * s - i * 8 * s;
      for (var e = -1; e <= 1; e += 2) { canv += dot(x + e * 5 * s, ly, 1.6 * s, Palette.yellow, INK(), 0.5); canv += dot(x + e * 5 * s, ly - 2.5 * s, 1 * s, Palette.orange); }
    }
    canv += dot(x, y - 72 * s, 3 * s, Palette.yellow, INK(), 0.9);
    canv += dot(x, y - 76 * s, 1.6 * s, Palette.orange);
    return canv;
  };
  this.dolmen = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    canv += shape([[x - 14 * s, y], [x - 6 * s, y], [x - 7 * s, y - 18 * s], [x - 13 * s, y - 18 * s]], STONE3, INK(), 1);
    canv += shape([[x + 6 * s, y], [x + 14 * s, y], [x + 13 * s, y - 18 * s], [x + 7 * s, y - 18 * s]], STONE3, INK(), 1);
    canv += shape([[x - 20 * s, y - 18 * s], [x + 20 * s, y - 18 * s], [x + 18 * s, y - 26 * s], [x - 18 * s, y - 25 * s]], STONE2, INK(), 1.1);
    return canv;
  };
  this.marketStall = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    canv += shape([[x - 26 * s, y], [x + 26 * s, y], [x + 26 * s, y - 14 * s], [x - 26 * s, y - 14 * s]], Palette.brown, INK(), 1);
    for (var e = -1; e <= 1; e += 2) canv += line([[x + e * 24 * s, y], [x + e * 24 * s, y - 44 * s]], Palette.darkbrown, 2 * s);
    canv += shape([[x - 30 * s, y - 44 * s], [x + 30 * s, y - 44 * s], [x + 26 * s, y - 36 * s], [x - 26 * s, y - 36 * s]], Palette.yellow, INK(), 1.1);
    for (var i = 0; i < 8; i++) canv += tick(x - 28 * s + i * 8 * s, y - 36 * s, 0, 4 * s, Palette.brown, 1);
    var cols = [Palette.yellow, Palette.orange, Palette.green, Palette.red, "#d98aa0"];
    for (var i = 0; i < 15; i++) canv += dot(x - 22 * s + (i % 5) * 11 * s, y - 16 * s - Math.floor(i / 5) * 4 * s, 2.8 * s, cols[i % 5], INK(), 0.6);
    // bananas hanging from the roof
    for (var i = 0; i < 2; i++) for (var j = 0; j < 4; j++) canv += line([[x - 16 * s + i * 30 * s + j * 2 * s, y - 36 * s], [x - 18 * s + i * 30 * s + j * 2 * s, y - 28 * s]], Palette.yellow, 2.2 * s);
    canv += Figures.woman(x, y + 2, { sca: s * 0.8, dir: 1 });
    return canv;
  };
  this.fence = function(x, y, args) {
    var a = A(args), s = a.s;
    var W = (args && args.width) || 60 * s;
    var canv = "";
    for (var i = 0; i <= W / (8 * s); i++) canv += line([[x - W / 2 + i * 8 * s, y], [x - W / 2 + i * 8 * s + 1 * s, y - 14 * s]], Palette.darkbrown, 1.5 * s);
    canv += line([[x - W / 2, y - 5 * s], [x + W / 2, y - 6 * s]], Palette.brown, 1.4 * s);
    canv += line([[x - W / 2, y - 10 * s], [x + W / 2, y - 11 * s]], Palette.brown, 1.4 * s);
    return canv;
  };
  // temple gateway: two pillars with a lintel and a hanging bell
  this.gate = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    for (var e = -1; e <= 1; e += 2) {
      canv += shape([[x + e * 18 * s - 4 * s, y], [x + e * 18 * s + 4 * s, y], [x + e * 18 * s + 3 * s, y - 40 * s], [x + e * 18 * s - 3 * s, y - 40 * s]], STONE, INK(), 1.1);
      canv += shape([[x + e * 18 * s - 6 * s, y - 40 * s], [x + e * 18 * s + 6 * s, y - 40 * s], [x + e * 18 * s + 5 * s, y - 45 * s], [x + e * 18 * s - 5 * s, y - 45 * s]], STONE2, INK(), 0.9);
    }
    canv += shape([[x - 26 * s, y - 45 * s], [x + 26 * s, y - 45 * s], [x + 24 * s, y - 52 * s], [x - 24 * s, y - 52 * s]], STONE, INK(), 1.1);
    for (var i = -2; i <= 2; i++) canv += dot(x + i * 9 * s, y - 54 * s, 2 * s, Palette.yellow, INK(), 0.6);
    canv += line([[x, y - 45 * s], [x, y - 36 * s]], INK(), 1 * s);
    canv += shape([[x - 4 * s, y - 36 * s], [x + 4 * s, y - 36 * s], [x + 3 * s, y - 30 * s], [x - 3 * s, y - 30 * s]], Palette.yellow, INK(), 0.9);
    for (var i = 0; i < 6; i++) canv += line([[x - 26 * s + i * 10 * s, y - 52 * s], [x - 22 * s + i * 10 * s, y - 52 * s]], Palette.green, 2.5 * s); // mango leaf toran
    return canv;
  };
  // rock-cut cave temple in the Pallava manner, carved into a boulder
  this.caveTemple = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    var rock = [];
    var n0 = Math.random() * 10;
    for (var i = 0; i <= 20; i++) { var t = Math.PI + (i / 20) * Math.PI; var rr = 1 + (Noise.noise(i * 0.3, n0) - 0.5) * 0.2; rock.push([x + Math.cos(t) * 70 * s * rr, y + Math.sin(t) * 50 * s * rr]); }
    canv += shape(rock, "#9a8a70", INK(), 1.3);
    canv += shape([[x - 36 * s, y], [x + 36 * s, y], [x + 36 * s, y - 28 * s], [x - 36 * s, y - 28 * s]], "#4a4038", INK(), 1.1);
    for (var i = 0; i < 4; i++) {
      var px = x - 27 * s + i * 18 * s;
      canv += shape([[px - 3 * s, y], [px + 3 * s, y], [px + 3 * s, y - 28 * s], [px - 3 * s, y - 28 * s]], STONE2, INK(), 1);
      canv += dot(px, y - 14 * s, 4 * s, STONE2, INK(), 0.8); // lion base pillars, simplified
    }
    canv += line([[x - 36 * s, y - 28 * s], [x + 36 * s, y - 28 * s]], STONE2, 3 * s);
    for (var i = -3; i <= 3; i++) canv += shape([[x + i * 10 * s - 3 * s, y - 30 * s], [x + i * 10 * s + 3 * s, y - 30 * s], [x + i * 10 * s, y - 36 * s]], STONE2, INK(), 0.7);
    return canv;
  };
  // ratha: a monolithic shrine carved from a single rock, as at Mamallapuram
  this.ratha = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    var W = 40 * s;
    canv += shape([[x - W / 2 - 4 * s, y], [x + W / 2 + 4 * s, y], [x + W / 2 + 4 * s, y - 5 * s], [x - W / 2 - 4 * s, y - 5 * s]], STONE3, INK(), 1);
    canv += shape([[x - W / 2, y - 5 * s], [x + W / 2, y - 5 * s], [x + W / 2, y - 30 * s], [x - W / 2, y - 30 * s]], "#9a8a70", INK(), 1.2);
    canv += shape([[x - 5 * s, y - 5 * s], [x + 5 * s, y - 5 * s], [x + 5 * s, y - 22 * s], [x - 5 * s, y - 22 * s]], Palette.black, INK(), 0.9);
    for (var e = -1; e <= 1; e += 2) canv += line([[x + e * 14 * s, y - 6 * s], [x + e * 14 * s, y - 28 * s]], STONE3, 2 * s);
    var cw = W;
    var cy = y - 30 * s;
    for (var t = 0; t < 3; t++) {
      var nw = cw * 0.8;
      canv += shape([[x - cw / 2 - 2 * s, cy], [x + cw / 2 + 2 * s, cy], [x + nw / 2, cy - 9 * s], [x - nw / 2, cy - 9 * s]], t % 2 ? "#9a8a70" : STONE2, INK(), 1);
      for (var i = -1; i <= 1; i++) canv += shape([[x + i * nw * 0.35 - 2 * s, cy - 2 * s], [x + i * nw * 0.35 + 2 * s, cy - 2 * s], [x + i * nw * 0.35, cy - 6 * s]], STONE3, INK(0.6), 0.5);
      cy -= 9 * s; cw = nw;
    }
    var dome = [];
    for (var i = 0; i <= 10; i++) { var t = Math.PI + (i / 10) * Math.PI; dome.push([x + Math.cos(t) * cw * 0.45, cy + Math.sin(t) * cw * 0.45]); }
    canv += shape(dome, "#9a8a70", INK(), 1);
    canv += line([[x, cy - cw * 0.45], [x, cy - cw * 0.45 - 6 * s]], INK(), 1.2 * s);
    return canv;
  };
  // Nataraja enshrined in a pillared hall with lamps
  this.natarajaShrine = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = Arch.mandapam(x, y, { sca: s * 1.2 });
    canv += People.nataraja(x, y - 6 * s, { sca: s * 0.7 });
    canv += this.lampTower(x - 50 * s, y + 2, { sca: s * 0.6 });
    canv += People.priest(x + 36 * s, y + 4, { sca: s * 0.75, dir: -1 });
    return canv;
  };
  // the festival: the chariot in the street with musicians and a crowd
  this.festival = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = "";
    canv += Arch.ther(f(0), y, { sca: s, dir: dir });
    canv += People.nadaswaram(f(150), y - 4, { sca: s * 0.85, dir: dir });
    canv += People.thavil(f(170), y, { sca: s * 0.85, dir: dir });
    canv += Figures.man(f(190), y - 2, { sca: s * 0.85, dir: dir, prop: "flag" });
    var crowd = [[-80, 4], [-100, -2], [-120, 6], [-140, 0], [-160, 4], [-70, -8], [-110, -10]];
    for (var i = 0; i < crowd.length; i++) {
      if (i % 2) canv += Figures.woman(f(crowd[i][0]), y + crowd[i][1] * s, { sca: s * 0.8, dir: dir });
      else canv += Figures.man(f(crowd[i][0]), y + crowd[i][1] * s, { sca: s * 0.8, dir: dir, zari: i % 4 == 0 });
    }
    canv += People.child(f(-90), y + 6 * s, { sca: s, dir: dir });
    canv += People.garlandSeller(f(-200), y, { sca: s * 0.8, dir: dir });
    return canv;
  };
  // paddy transplanting: women bent in a flooded plot, a man with seedlings
  this.transplanting = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    var W = 150 * s, H = 36 * s, sk = 20 * s;
    canv += shape([[x - W / 2, y - H], [x + W / 2, y - H], [x + W / 2 - sk, y], [x - W / 2 - sk, y]], "#5c7a8a", INK(0.8), 1.2);
    canv += line([[x - W / 2 - sk, y], [x + W / 2 - sk, y]], Palette.yellow, 2.2);
    for (var i = 0; i < 12; i++) canv += line([[x - W / 2 + Math.random() * (W - sk), y - Math.random() * H], [x - W / 2 + 10 * s + Math.random() * (W - sk), y - Math.random() * H]], "rgba(239,227,198,0.5)", 0.8);
    for (var i = 0; i < 40; i++) {
      var px = x - W / 2 + 10 * s + (i % 10) * 12 * s - Math.floor(i / 10) * 4 * s, py = y - 6 * s - Math.floor(i / 10) * 8 * s;
      canv += line([[px, py], [px - 1 * s, py - 6 * s]], Palette.lightgreen, 1.1 * s);
      canv += line([[px, py], [px + 2 * s, py - 5 * s]], Palette.lightgreen, 1.1 * s);
    }
    for (var i = 0; i < 4; i++) canv += People.transplanter(x - W / 2 + 25 * s + i * 32 * s, y - 2 * s - (i % 2) * 14 * s, { sca: s * 0.85, dir: 1 });
    canv += Figures.man(x + W / 2 - sk + 6 * s, y + 2, { sca: s * 0.9, dir: -1, prop: "leaves" });
    return canv;
  };
  // a hut with a pumpkin vine climbing over the thatch
  this.vineHut = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = Arch.hut(x, y, { sca: s });
    var H = 22 * s, R = 26 * s;
    var vine = bezmh([[x - 30 * s, y], [x - 28 * s, y - H - 10 * s], [x + 10 * s, y - H - R + 4 * s]], 1);
    canv += line(vine, Palette.darkgreen, 1.3 * s);
    for (var i = 2; i < vine.length; i += 4) {
      canv += shape([[vine[i][0], vine[i][1]], [vine[i][0] + 4 * s, vine[i][1] - 5 * s], [vine[i][0] - 1 * s, vine[i][1] - 7 * s], [vine[i][0] - 5 * s, vine[i][1] - 3 * s]], Palette.green, INK(0.8), 0.7);
    }
    canv += dot(x - 10 * s, y - H - 8 * s, 5 * s, Palette.orange, INK(), 0.9);
    canv += dot(x + 6 * s, y - H - 18 * s, 4 * s, Palette.yellow, INK(), 0.9);
    canv += Flora.tulsi(x + 34 * s, y + 2, { sca: s * 0.8 });
    return canv;
  };
}();
