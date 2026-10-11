// More creatures of the Tamil country.
var Fauna = new function() {
  function A(args) { args = args || {}; return { s: args.sca || 1, dir: args.dir || 1 }; }

  this.hen = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = "";
    var col = args && args.rooster ? Palette.red : randChoice([Palette.cream, Palette.brown, "#4a3a30"]);
    canv += line([[f(-2), y - 6 * s], [f(-3), y]], Palette.yellow, 1.2 * s);
    canv += line([[f(2), y - 6 * s], [f(3), y]], Palette.yellow, 1.2 * s);
    canv += shape([[f(-9), y - 8 * s], [f(-4), y - 13 * s], [f(5), y - 12 * s], [f(8), y - 7 * s], [f(2), y - 4 * s], [f(-6), y - 4 * s]], col, INK(), 1);
    if (args && args.rooster) {
      for (var i = 0; i < 4; i++) canv += line(bezmh([[f(-8), y - 9 * s], [f(-16 - i * 2), y - 16 * s - i * 3 * s], [f(-20 - i * 3), y - 8 * s - i * 2 * s]], 1), [Palette.green, Palette.indigo, Palette.darkgreen, Palette.black][i], 1.6 * s);
    } else canv += line([[f(-9), y - 8 * s], [f(-13), y - 12 * s]], INK(), 1 * s);
    canv += line([[f(6), y - 11 * s], [f(8), y - 17 * s]], col, 3 * s);
    canv += dot(f(9), y - 18 * s, 3 * s, col, INK(), 0.9);
    canv += line([[f(11), y - 18 * s], [f(15), y - 17 * s]], Palette.yellow, 1.4 * s);
    canv += dot(f(9), y - 21 * s, 1.5 * s, Palette.red);
    canv += dot(f(10), y - 19 * s, 0.7 * s, Palette.black);
    return canv;
  };
  this.chicks = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = this.hen(x, y, { sca: s, dir: a.dir });
    for (var i = 0; i < 4; i++) {
      var cx = x - (12 + i * 8) * s * a.dir, cy = y - (i % 2) * 2 * s;
      canv += dot(cx, cy - 3 * s, 2.5 * s, Palette.yellow, INK(), 0.7);
      canv += dot(cx + 2 * s * a.dir, cy - 5.5 * s, 1.8 * s, Palette.yellow, INK(), 0.7);
      canv += dot(cx + 2.5 * s * a.dir, cy - 6 * s, 0.5 * s, Palette.black);
    }
    return canv;
  };
  this.dog = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = "";
    var col = randChoice([Palette.brown, Palette.cream, "#4a3a30"]);
    for (var i = 0; i < 4; i++) canv += line([[f([-10, -6, 7, 11][i]), y - 10 * s], [f([-11, -6, 7, 12][i]), y]], col, 2 * s);
    canv += shape([[f(-13), y - 9 * s], [f(12), y - 9 * s], [f(13), y - 17 * s], [f(-12), y - 15 * s]], col, INK(), 1);
    canv += shape([[f(11), y - 17 * s], [f(17), y - 24 * s], [f(26), y - 21 * s], [f(24), y - 15 * s], [f(14), y - 12 * s]], col, INK(), 1);
    canv += line([[f(16), y - 24 * s], [f(14), y - 29 * s]], INK(), 1.2 * s);
    canv += dot(f(20), y - 21 * s, 0.8 * s, Palette.black);
    canv += line(bezmh([[f(-13), y - 15 * s], [f(-20), y - 24 * s], [f(-16), y - 28 * s]], 1), col, 1.8 * s);
    return canv;
  };
  this.monkey = function(x, y, args) {
    // a langur sitting, long tail curled
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = "";
    var col = "#8c8478";
    canv += line(bezmh([[f(-6), y - 4 * s], [f(-22), y - 2 * s], [f(-20), y - 24 * s]], 1), col, 1.8 * s);
    canv += shape([[f(-8), y], [f(8), y], [f(7), y - 8 * s], [f(3), y - 18 * s], [f(-5), y - 18 * s], [f(-8), y - 8 * s]], col, INK(), 1);
    canv += line([[f(4), y - 14 * s], [f(12), y - 8 * s], [f(10), y - 2 * s]], col, 2 * s);
    canv += dot(f(1), y - 22 * s, 5 * s, col, INK(), 1);
    canv += dot(f(2), y - 22 * s, 3.2 * s, Palette.black, "none", 0);
    canv += dot(f(1), y - 23 * s, 0.6 * s, Palette.white);
    canv += dot(f(3.5), y - 23 * s, 0.6 * s, Palette.white);
    return canv;
  };
  this.squirrel = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = "";
    canv += shape([[f(-6), y], [f(4), y], [f(6), y - 5 * s], [f(2), y - 8 * s], [f(-5), y - 6 * s]], Palette.brown, INK(), 0.8);
    canv += dot(f(6), y - 7 * s, 2.5 * s, Palette.brown, INK(), 0.8);
    canv += line(bezmh([[f(-6), y - 3 * s], [f(-12), y - 12 * s], [f(-4), y - 14 * s]], 1), Palette.brown, 3 * s);
    for (var i = -1; i <= 1; i++) canv += line([[f(-5), y - 3 * s + i * 1.5 * s], [f(3), y - 4 * s + i * 1.5 * s]], Palette.cream, 0.6 * s);
    canv += dot(f(7), y - 8 * s, 0.5 * s, Palette.black);
    return canv;
  };
  this.parrot = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = "";
    canv += shape([[f(-3), y], [f(3), y], [f(4), y - 8 * s], [f(2), y - 12 * s], [f(-3), y - 11 * s], [f(-4), y - 6 * s]], Palette.green, INK(), 0.8);
    canv += line([[f(-2), y], [f(-6), y + 10 * s]], Palette.darkgreen, 2 * s);
    canv += dot(f(1), y - 13 * s, 3 * s, Palette.green, INK(), 0.8);
    canv += shape([[f(3), y - 14 * s], [f(7), y - 12 * s], [f(3), y - 10 * s]], Palette.red, INK(), 0.6);
    canv += dot(f(1.5), y - 14 * s, 0.6 * s, Palette.black);
    canv += line([[f(-2), y - 11 * s], [f(4), y - 11 * s]], Palette.red, 0.8 * s);
    return canv;
  };
  this.crow = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = "";
    canv += shape([[f(-8), y - 2 * s], [f(2), y - 7 * s], [f(8), y - 5 * s], [f(5), y], [f(-3), y]], Palette.black, INK(), 0.8);
    canv += dot(f(8), y - 8 * s, 2.5 * s, Palette.black, INK(), 0.8);
    canv += line([[f(10), y - 8 * s], [f(15), y - 7 * s]], Palette.black, 1.4 * s);
    canv += dot(f(8.5), y - 8.5 * s, 0.6 * s, Palette.white);
    canv += line([[f(-8), y - 2 * s], [f(-14), y]], Palette.black, 1.6 * s);
    canv += line([[f(0), y], [f(0), y + 4 * s]], Palette.black, 1 * s);
    return canv;
  };
  this.kingfisher = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = line([[x, y], [x, y - 22 * s]], Palette.darkbrown, 1.4 * s);
    var by = y - 22 * s;
    canv += shape([[f(-6), by - 2 * s], [f(2), by - 7 * s], [f(6), by - 4 * s], [f(4), by + 1 * s], [f(-2), by + 1 * s]], "#2d6fa8", INK(), 0.8);
    canv += shape([[f(-2), by - 2 * s], [f(4), by - 2 * s], [f(4), by + 1 * s], [f(-1), by + 1 * s]], Palette.orange, "none", 0);
    canv += dot(f(6), by - 8 * s, 2.5 * s, "#2d6fa8", INK(), 0.8);
    canv += line([[f(8), by - 8 * s], [f(16), by - 6 * s]], Palette.red, 1.4 * s);
    canv += dot(f(6.5), by - 8.5 * s, 0.6 * s, Palette.white);
    return canv;
  };
  this.eagle = function(x, y, args) {
    // a kite soaring, seen from below
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = "";
    canv += shape([[f(-3), y], [f(-30), y - 10 * s], [f(-26), y - 2 * s], [f(-8), y + 4 * s], [f(8), y + 4 * s], [f(26), y - 2 * s], [f(30), y - 10 * s], [f(3), y]], "#5a4030", INK(), 0.9);
    canv += shape([[f(-4), y + 3 * s], [f(4), y + 3 * s], [f(5), y + 9 * s], [f(-5), y + 9 * s]], "#5a4030", INK(), 0.8);
    canv += dot(f(0), y, 2 * s, Palette.cream, INK(), 0.7);
    return canv;
  };
  this.cobra = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = "";
    var body = [];
    for (var i = 0; i <= 12; i++) body.push([f(-20 + i * 2.2), y - Math.abs(Math.sin(i * 0.9)) * 3 * s]);
    canv += line(body, "#4a4a3a", 2.6 * s);
    canv += line([[f(6), y - 2 * s], [f(8), y - 16 * s]], "#4a4a3a", 2.6 * s);
    canv += shape([[f(2), y - 16 * s], [f(14), y - 16 * s], [f(12), y - 26 * s], [f(8), y - 30 * s], [f(4), y - 26 * s]], "#4a4a3a", INK(), 0.9);
    canv += dot(f(8), y - 20 * s, 1.5 * s, Palette.cream, INK(0.7), 0.5);
    canv += line([[f(8), y - 29 * s], [f(10), y - 33 * s]], Palette.red, 0.8 * s);
    return canv;
  };
  this.tortoise = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = "";
    var sh = [];
    for (var i = 0; i <= 10; i++) { var t = Math.PI + (i / 10) * Math.PI; sh.push([f(Math.cos(t) * 10), y - 2 * s + Math.sin(t) * 7 * s]); }
    canv += shape(sh, Palette.darkgreen, INK(), 0.9);
    for (var i = -1; i <= 1; i++) canv += line([[f(i * 5), y - 2 * s], [f(i * 4), y - 8 * s]], INK(0.5), 0.5);
    canv += line([[f(-8), y - 2 * s], [f(-9), y]], Palette.green, 2 * s);
    canv += line([[f(7), y - 2 * s], [f(8), y]], Palette.green, 2 * s);
    canv += dot(f(12), y - 3 * s, 2.2 * s, Palette.green, INK(), 0.7);
    return canv;
  };
  this.frog = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = shape([[f(-6), y], [f(5), y], [f(6), y - 4 * s], [f(2), y - 7 * s], [f(-5), y - 5 * s]], Palette.lightgreen, INK(), 0.8);
    canv += dot(f(3), y - 7 * s, 1.3 * s, Palette.lightgreen, INK(), 0.6);
    canv += dot(f(3.3), y - 7.3 * s, 0.5 * s, Palette.black);
    canv += line([[f(-6), y - 1 * s], [f(-10), y - 4 * s], [f(-9), y]], Palette.lightgreen, 1.4 * s);
    return canv;
  };
  this.butterfly = function(x, y, args) {
    var a = A(args), s = a.s;
    var col = randChoice([Palette.yellow, Palette.orange, "#2d6fa8", Palette.white]);
    var canv = "";
    for (var e = -1; e <= 1; e += 2) {
      canv += shape([[x, y], [x + e * 7 * s, y - 6 * s], [x + e * 6 * s, y + 1 * s]], col, INK(), 0.6);
      canv += shape([[x, y], [x + e * 5 * s, y + 5 * s], [x + e * 1 * s, y + 4 * s]], col, INK(), 0.6);
      canv += dot(x + e * 4 * s, y - 3 * s, 0.8 * s, Palette.black);
    }
    canv += line([[x, y - 3 * s], [x, y + 4 * s]], INK(), 1 * s);
    return canv;
  };
  this.bear = function(x, y, args) {
    // sloth bear of the hills
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = "";
    for (var i = 0; i < 4; i++) canv += line([[f([-14, -8, 8, 14][i]), y - 12 * s], [f([-15, -8, 8, 15][i]), y]], Palette.black, 4 * s);
    canv += shape([[f(-20), y - 10 * s], [f(16), y - 10 * s], [f(18), y - 22 * s], [f(6), y - 30 * s], [f(-12), y - 28 * s], [f(-20), y - 18 * s]], Palette.black, INK(), 1.1);
    canv += shape([[f(16), y - 22 * s], [f(30), y - 20 * s], [f(32), y - 16 * s], [f(20), y - 12 * s]], Palette.black, INK(), 1);
    canv += dot(f(32), y - 17 * s, 1.6 * s, Palette.cream);
    canv += shape([[f(-2), y - 20 * s], [f(8), y - 18 * s], [f(6), y - 14 * s], [f(-4), y - 15 * s]], Palette.cream, "none", 0);
    canv += dot(f(26), y - 20 * s, 0.7 * s, Palette.white);
    return canv;
  };
  this.tiger = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = "";
    var col = Palette.orange;
    for (var i = 0; i < 4; i++) { canv += line([[f([-18, -11, 10, 17][i]), y - 10 * s], [f([-20, -11, 10, 19][i]), y]], col, 3.4 * s); canv += line([[f([-18, -11, 10, 17][i]), y - 10 * s], [f([-20, -11, 10, 19][i]), y]], INK(), 0.6); }
    canv += shape([[f(-24), y - 9 * s], [f(18), y - 9 * s], [f(22), y - 20 * s], [f(10), y - 26 * s], [f(-16), y - 25 * s], [f(-24), y - 18 * s]], col, INK(), 1.1);
    canv += shape([[f(20), y - 24 * s], [f(34), y - 24 * s], [f(36), y - 16 * s], [f(24), y - 13 * s]], col, INK(), 1);
    canv += shape([[f(-2), y - 10 * s], [f(14), y - 10 * s], [f(14), y - 14 * s], [f(-2), y - 14 * s]], Palette.white, "none", 0);
    for (var i = 0; i < 8; i++) canv += line([[f(-18 + i * 4.5), y - 24 * s + (i % 2) * 2 * s], [f(-16 + i * 4.5), y - 13 * s]], Palette.black, 1.6 * s);
    canv += line([[f(28), y - 20 * s], [f(30), y - 15 * s]], Palette.black, 1.2 * s);
    canv += dot(f(30), y - 20 * s, 0.9 * s, Palette.black);
    canv += dot(f(36), y - 17 * s, 1 * s, Palette.black);
    canv += line([[f(22), y - 25 * s], [f(21), y - 29 * s]], INK(), 1.3 * s);
    canv += line([[f(30), y - 25 * s], [f(31), y - 29 * s]], INK(), 1.3 * s);
    canv += line(bezmh([[f(-24), y - 16 * s], [f(-36), y - 22 * s], [f(-38), y - 10 * s]], 1), col, 2.2 * s);
    return canv;
  };
  this.boar = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = "";
    for (var i = 0; i < 4; i++) canv += line([[f([-10, -5, 6, 10][i]), y - 8 * s], [f([-11, -5, 6, 11][i]), y]], "#3a3028", 2.2 * s);
    canv += shape([[f(-14), y - 7 * s], [f(12), y - 7 * s], [f(14), y - 16 * s], [f(2), y - 22 * s], [f(-12), y - 20 * s]], "#3a3028", INK(), 1);
    canv += shape([[f(12), y - 16 * s], [f(26), y - 11 * s], [f(24), y - 7 * s], [f(14), y - 8 * s]], "#3a3028", INK(), 1);
    canv += line([[f(22), y - 9 * s], [f(26), y - 13 * s]], Palette.cream, 1.3 * s);
    for (var i = 0; i < 5; i++) canv += line([[f(-10 + i * 5), y - 21 * s], [f(-9 + i * 5), y - 25 * s]], "#3a3028", 1.2 * s);
    canv += dot(f(18), y - 13 * s, 0.7 * s, Palette.white);
    return canv;
  };
  this.jackal = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = "";
    var col = "#b08a52";
    for (var i = 0; i < 4; i++) canv += line([[f([-10, -6, 7, 11][i]), y - 10 * s], [f([-12, -6, 7, 13][i]), y]], col, 1.8 * s);
    canv += shape([[f(-13), y - 9 * s], [f(12), y - 9 * s], [f(13), y - 16 * s], [f(-12), y - 15 * s]], col, INK(), 1);
    canv += shape([[f(11), y - 16 * s], [f(16), y - 22 * s], [f(28), y - 18 * s], [f(14), y - 12 * s]], col, INK(), 1);
    canv += line([[f(15), y - 22 * s], [f(12), y - 28 * s]], col, 1.6 * s);
    canv += line([[f(19), y - 21 * s], [f(18), y - 27 * s]], col, 1.6 * s);
    canv += line(bezmh([[f(-13), y - 13 * s], [f(-22), y - 12 * s], [f(-24), y - 2 * s]], 1), col, 3 * s);
    canv += dot(f(21), y - 19 * s, 0.7 * s, Palette.black);
    return canv;
  };
  this.crocodile = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = shape([[f(-30), y], [f(-6), y - 5 * s], [f(10), y - 5 * s], [f(30), y - 2 * s], [f(28), y + 1 * s], [f(-28), y + 2 * s]], Palette.darkgreen, INK(), 0.9);
    for (var i = 0; i < 7; i++) canv += line([[f(-20 + i * 5), y - 5 * s], [f(-19 + i * 5), y - 8 * s]], Palette.darkgreen, 1.3 * s);
    canv += dot(f(8), y - 6 * s, 1.2 * s, Palette.yellow, INK(), 0.5);
    for (var i = 0; i < 5; i++) canv += line([[f(14 + i * 3), y - 2 * s], [f(14 + i * 3), y]], Palette.white, 0.7 * s);
    return canv;
  };
  this.elephantCalf = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var canv = Figures.elephant(x, y, { sca: s, dir: dir });
    canv += Figures.elephant(x - 60 * s * dir, y + 2, { sca: s * 0.5, dir: dir });
    return canv;
  };
  this.horse = function(x, y, args) {
    // a live horse, optionally with a rider
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = "";
    var col = (args && args.col) || randChoice([Palette.brown, "#4a3a30", Palette.cream]);
    for (var i = 0; i < 4; i++) { canv += line([[f([-16, -10, 10, 16][i]), y - 22 * s], [f([-19, -10, 10, 19][i]), y]], col, 3 * s); canv += line([[f([-16, -10, 10, 16][i]), y - 22 * s], [f([-19, -10, 10, 19][i]), y]], INK(), 0.6); }
    canv += shape([[f(-22), y - 20 * s], [f(18), y - 20 * s], [f(22), y - 34 * s], [f(-22), y - 34 * s]], col, INK(), 1.2);
    canv += shape([[f(16), y - 34 * s], [f(24), y - 34 * s], [f(32), y - 56 * s], [f(24), y - 58 * s]], col, INK(), 1.2);
    canv += shape([[f(24), y - 58 * s], [f(32), y - 56 * s], [f(44), y - 50 * s], [f(42), y - 45 * s], [f(28), y - 48 * s]], col, INK(), 1.2);
    canv += line([[f(26), y - 58 * s], [f(22), y - 64 * s]], INK(), 1.4 * s);
    canv += line([[f(30), y - 58 * s], [f(29), y - 65 * s]], INK(), 1.4 * s);
    canv += dot(f(35), y - 52 * s, 1.4 * s, Palette.black);
    for (var i = 0; i < 6; i++) canv += line([[f(19 + i * 2), y - (36 + i * 4) * s], [f(13 + i * 2), y - (38 + i * 4) * s]], Palette.black, 1.8 * s);
    canv += line(bezmh([[f(-22), y - 32 * s], [f(-32), y - 28 * s], [f(-28), y - 8 * s]], 1), Palette.black, 2.6 * s);
    if (args && args.rider) {
      canv += shape([[f(-10), y - 34 * s], [f(10), y - 34 * s], [f(9), y - 38 * s], [f(-9), y - 38 * s]], Palette.red, INK(), 1);
      var r = People.rig(f(0), y - 38 * s + 20 * s, s * 0.85, dir, { pose: "sit", armF: [[8, 2], [16, -6]], armB: [[-6, 6], [-4, 12]], zari: true });
      canv += r.canv;
      canv += line([[r.hand[0], r.hand[1]], [f(36), y - 50 * s]], INK(), 0.8);
      canv += line([[r.hand[0], r.hand[1]], [r.hand[0] + 2 * s * dir, r.hand[1] - 40 * s]], Palette.darkbrown, 1.4 * s);
      canv += shape([[r.hand[0] + 2 * s * dir, r.hand[1] - 48 * s], [r.hand[0] + 5 * s * dir, r.hand[1] - 40 * s], [r.hand[0] - 1 * s * dir, r.hand[1] - 40 * s]], Palette.cream, INK(), 0.7);
    }
    return canv;
  };
  this.donkey = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = "";
    var col = "#8c8478";
    for (var i = 0; i < 4; i++) canv += line([[f([-11, -6, 7, 12][i]), y - 14 * s], [f([-12, -6, 7, 13][i]), y]], col, 2.2 * s);
    canv += shape([[f(-15), y - 12 * s], [f(12), y - 12 * s], [f(14), y - 24 * s], [f(-14), y - 24 * s]], col, INK(), 1);
    canv += shape([[f(12), y - 24 * s], [f(18), y - 26 * s], [f(28), y - 20 * s], [f(27), y - 16 * s], [f(16), y - 16 * s]], col, INK(), 1);
    canv += line([[f(16), y - 26 * s], [f(13), y - 35 * s]], col, 2 * s);
    canv += line([[f(20), y - 26 * s], [f(19), y - 35 * s]], col, 2 * s);
    // bundles of washing on its back
    canv += shape([[f(-10), y - 24 * s], [f(8), y - 24 * s], [f(6), y - 34 * s], [f(-8), y - 34 * s]], Palette.white, INK(), 0.9);
    canv += line([[f(-10), y - 28 * s], [f(8), y - 28 * s]], Palette.red, 1 * s);
    canv += dot(f(24), y - 21 * s, 0.7 * s, Palette.black);
    return canv;
  };
  this.bats = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    for (var i = 0; i < 5; i++) {
      var bx = x + (Math.random() - 0.5) * 80 * s, by = y + (Math.random() - 0.5) * 40 * s;
      canv += line([[bx - 8 * s, by - 3 * s], [bx - 4 * s, by], [bx, by - 3 * s], [bx + 4 * s, by], [bx + 8 * s, by - 3 * s]], Palette.black, 1.4 * s);
    }
    return canv;
  };
  this.ducks = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var canv = "";
    for (var i = 0; i < 3; i++) {
      var dx = x + i * 16 * s * dir, dy = y + (i % 2) * 3 * s;
      var f = function(px) { return dx + px * s * dir; };
      canv += shape([[f(-7), dy], [f(5), dy], [f(7), dy - 4 * s], [f(2), dy - 6 * s], [f(-8), dy - 4 * s]], Palette.white, INK(), 0.8);
      canv += line([[f(5), dy - 5 * s], [f(7), dy - 11 * s]], Palette.white, 2.2 * s);
      canv += dot(f(7), dy - 12 * s, 2.2 * s, Palette.white, INK(), 0.7);
      canv += line([[f(9), dy - 12 * s], [f(13), dy - 11 * s]], Palette.orange, 1.2 * s);
    }
    return canv;
  };
}();
