// Little stories of the street. Each is a small scene a passer-by might
// miss, and each has a name that explains it on hover.
var Vignettes = new function() {
  function A(args) { args = args || {}; return { s: args.sca || 1, dir: args.dir || 1 }; }
  var rig = People.rig;
  function fig(x, y, s, dir, o) { return rig(x, y, s, dir, o); }
  var STAND_IDLE = { pose: "stand", armF: [[6, 10], [6, 20]], armB: [[-4, 10], [-4, 20]] };
  function tears(h, s, dir) {
    return line([[h[0] + 2 * s * dir, h[1] + 1 * s], [h[0] + 1 * s * dir, h[1] + 7 * s]], "#7fb4d8", 1 * s) + dot(h[0] + 1 * s * dir, h[1] + 8 * s, 0.9 * s, "#7fb4d8");
  }
  function belly(r, s, dir) {
    return dot(r.hip[0] + 2 * s * dir, r.hip[1] - 8 * s, 8 * s, Figures.SKIN, INK(), 1);
  }
  function laddus(x, y, s) {
    var out = shape([[x - 12 * s, y], [x + 12 * s, y], [x + 10 * s, y - 4 * s], [x - 10 * s, y - 4 * s]], Palette.brown, INK(), 0.8);
    for (var r = 0; r < 3; r++) for (var i = 0; i < 5 - r; i++) out += dot(x - 8 * s + i * 4 * s + r * 2 * s, y - 6 * s - r * 3.4 * s, 2.2 * s, Palette.orange, INK(0.7), 0.5);
    return out;
  }

  this.confession = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r1 = fig(x - 12 * s * dir, y, s, dir, { pose: "kneel", armF: [[10, -6], [20, -14]], armB: [[-2, 8], [2, 14]], zari: true });
    var canv = r1.canv;
    // a jasmine string held out
    for (var i = 0; i < 5; i++) canv += dot(r1.hand[0] + (2 + i * 2.6) * s * dir, r1.hand[1] - 2 * s + Math.sin(i) * 1.5 * s, 1.4 * s, Palette.white, INK(0.5), 0.4);
    var r2 = fig(x + 16 * s * dir, y, s, -dir, { pose: "stand", female: true, col: Palette.red, armF: [[6, -4], [2, -14]], armB: [[-4, 10], [-2, 20]] });
    canv += r2.canv;
    canv += dot(r2.head[0] + 4 * s * -dir, r2.head[1] + 3 * s, 1.6 * s, "#d98aa0"); // a blush
    canv += Fauna.parrot(x + 34 * s * dir, y - 28 * s, { sca: s * 0.7, dir: -dir });
    canv += line([[x + 34 * s * dir, y], [x + 34 * s * dir, y - 24 * s]], Palette.darkbrown, 1.4 * s);
    return canv;
  };
  this.beggarPhilosopher = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = fig(x, y, s, dir, { pose: "sit", col: "#8a7a5a", armF: [[8, -6], [10, -18]], armB: [[-6, 6], [-2, 12]], bare: true });
    var canv = r.canv;
    canv += line([[r.hand[0], r.hand[1]], [r.hand[0] + 1 * s * dir, r.hand[1] - 6 * s]], Figures.SKIN, 1.6 * s); // finger raised
    canv += shape([[r.head[0] + 4 * s * dir, r.head[1] + 4 * s], [r.head[0] + 9 * s * dir, r.head[1] + 5 * s], [r.head[0] + 6 * s * dir, r.head[1] + 16 * s], [r.head[0] + 1 * s * dir, r.head[1] + 10 * s]], Palette.white, INK(0.7), 0.6);
    canv += dot(x - 14 * s * dir, y - 2 * s, 4 * s, Palette.darkbrown, INK(), 0.8); // the bowl
    canv += dot(x - 14 * s * dir, y - 3 * s, 1 * s, Palette.yellow); // one coin
    // palm leaf manuscripts beside him, and a crow that listens
    for (var i = 0; i < 3; i++) canv += shape([[x + 12 * s * dir, y - i * 2 * s], [x + 26 * s * dir, y - i * 2 * s], [x + 26 * s * dir, y - 1.5 * s - i * 2 * s], [x + 12 * s * dir, y - 1.5 * s - i * 2 * s]], Palette.paleyellow, INK(0.7), 0.5);
    canv += Fauna.crow(x + 22 * s * dir, y - 6 * s, { sca: s * 0.8, dir: -dir });
    return canv;
  };
  this.pickpocket = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = fig(x, y, s, dir, { pose: "stand", zari: true, armF: [[8, 4], [12, -4]], armB: [[-6, 8], [-2, 2]] });
    var canv = r.canv + belly(r, s, dir);
    for (var i = 0; i < 3; i++) canv += dot(r.hand[0] + (i - 1) * 2 * s, r.hand[1] - 2 * s, 1.2 * s, Palette.yellow); // counting coins
    canv += dot(r.head[0] - 1 * s * dir, r.head[1] - 8 * s, 6 * s, Palette.red, INK(), 1); // a rich man's turban
    // the purse at his hip, and the small hand reaching for it
    canv += shape([[r.hip[0] - 6 * s * dir, r.hip[1] - 2 * s], [r.hip[0] - 1 * s * dir, r.hip[1] - 2 * s], [r.hip[0] - 1 * s * dir, r.hip[1] + 4 * s], [r.hip[0] - 6 * s * dir, r.hip[1] + 4 * s]], Palette.brown, INK(), 0.7);
    var k = fig(x - 13 * s * dir, y + 1, s * 0.55, dir, { pose: "stand", armF: [[8, -8], [14, -14]], armB: [[-4, 8], [-2, 14]] });
    canv += k.canv;
    // and down the street, the accomplice waiting with open hands
    var k2 = fig(x - 44 * s * dir, y + 2, s * 0.55, -dir, { pose: "stand", armF: [[8, 4], [14, 2]], armB: [[4, 4], [10, 2]], girl: true });
    canv += k2.canv;
    return canv;
  };
  this.laddu = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var f = fig(x, y, s, dir, { pose: "stand", armF: [[6, 8], [0, 16]], armB: [[-6, 6], [-2, 14]] });
    var canv = f.canv;
    var c = fig(x + 12 * s * dir, y + 1, s * 0.55, dir, { pose: "stand", armF: [[10, -8], [18, -12]], armB: [[-8, -2], [-12, -6]] });
    canv += c.canv;
    canv += line([[c.handB[0], c.handB[1]], [f.hip[0] + 4 * s * dir, f.hip[1] + 6 * s]], INK(0.6), 0.7); // tugging the veshti
    canv += laddus(x + 42 * s * dir, y, s);
    canv += fig(x + 56 * s * dir, y, s * 0.9, -dir, { pose: "sit", armF: [[8, 4], [14, 8]], armB: [[-6, 6], [-4, 12]] }).canv;
    return canv;
  };
  this.dogVada = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var canv = Fauna.dog(x + 30 * s * dir, y, { sca: s, dir: dir });
    canv += dot(x + 57 * s * dir, y - 20 * s, 3 * s, Palette.brown, INK(), 0.7); // the vada in its mouth
    canv += dot(x + 57 * s * dir, y - 20 * s, 1 * s, Palette.darkbrown);
    var v = fig(x, y, s, dir, { pose: "stand", armF: [[8, -10], [12, -22]], armB: [[-6, -10], [-10, -22]] });
    canv += v.canv;
    canv += shape([[x - 14 * s * dir, y - 2 * s], [x + 2 * s * dir, y - 1 * s], [x + 4 * s * dir, y + 1 * s], [x - 16 * s * dir, y + 2 * s]], Palette.brown, INK(), 0.7); // the upset tray
    for (var i = 0; i < 5; i++) canv += dot(x - 20 * s * dir + Math.random() * 30 * s * dir, y + 2 * s + Math.random() * 3 * s, 2.4 * s, Palette.brown, INK(0.6), 0.5);
    canv += Fauna.crow(x - 24 * s * dir, y + 2, { sca: s * 0.8, dir: dir });
    return canv;
  };
  this.monkeyBanana = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = fig(x, y, s, dir, { pose: "stand", female: true, armF: [[6, -8], [4, -14]], armB: [[-6, 6], [-4, 12]] });
    var canv = r.canv;
    var bx = r.head[0], by = r.head[1] - 10 * s;
    canv += shape([[bx - 10 * s, by], [bx + 10 * s, by], [bx + 8 * s, by - 7 * s], [bx - 8 * s, by - 7 * s]], "#c9b48a", INK(), 0.8);
    for (var i = 0; i < 4; i++) canv += line([[bx - 6 * s + i * 3 * s, by - 7 * s], [bx - 7 * s + i * 3 * s, by - 13 * s]], Palette.yellow, 2 * s);
    canv += Fauna.monkey(bx + 10 * s * dir, by - 7 * s, { sca: s * 0.7, dir: -dir });
    canv += line([[bx + 10 * s * dir, by - 20 * s], [bx + 14 * s * dir, by - 28 * s]], Palette.yellow, 2 * s); // the banana, taken
    return canv;
  };
  this.gossip = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var canv = fig(x - 10 * s, y, s, 1, { pose: "stand", female: true, col: Palette.green, armF: [[8, 2], [14, -6]], armB: [[-4, 8], [-2, 16]] }).canv;
    canv += fig(x + 10 * s, y + 2, s, -1, { pose: "stand", female: true, col: Palette.indigo, armF: [[6, 6], [4, -2]], armB: [[-4, 8], [-2, 16]] }).canv;
    // the one they are talking about, walking off and looking back
    var r3 = fig(x + 50 * s, y - 2, s, 1, { pose: "stand", female: true, col: Palette.orange, armF: [[6, 10], [6, 20]], armB: [[-4, 10], [-4, 20]] });
    canv += r3.canv;
    canv += Figures.head(r3.head[0], r3.head[1], -1, s, true);
    return canv;
  };
  this.sleeper = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var canv = "";
    // a parked cart with no bullocks, a man asleep in its shade
    canv += shape([[x - 30 * s, y - 14 * s], [x + 24 * s, y - 14 * s], [x + 26 * s, y - 24 * s], [x - 32 * s, y - 24 * s]], Palette.brown, INK(), 1.1);
    canv += line([[x + 24 * s, y - 18 * s], [x + 50 * s, y - 26 * s]], Palette.darkbrown, 2 * s);
    canv += dot(x - 10 * s, y - 8 * s, 10 * s, Palette.yellow, INK(), 1.2);
    for (var i = 0; i < 6; i++) { var t = (i / 6) * Math.PI; canv += line([[x - 10 * s + Math.cos(t) * 10 * s, y - 8 * s + Math.sin(t) * 10 * s], [x - 10 * s - Math.cos(t) * 10 * s, y - 8 * s - Math.sin(t) * 10 * s]], INK(), 0.8); }
    canv += line([[x + 6 * s, y - 3 * s], [x + 30 * s, y - 3 * s]], Palette.white, 6 * s); // the sleeper, veshti
    canv += line([[x + 30 * s, y - 3 * s], [x + 40 * s, y - 3 * s]], Figures.SKIN, 4 * s);
    canv += dot(x + 44 * s, y - 4 * s, 3 * s, Figures.SKIN2, INK(), 0.6);
    canv += dot(x + 2 * s, y - 4 * s, 5 * s, Figures.SKIN, INK(), 0.8);
    canv += dot(x - 1 * s, y - 5 * s, 3.6 * s, Palette.black, "none", 0);
    for (var i = 0; i < 3; i++) canv += line([[x + 6 * s + i * 4 * s, y - 14 * s - i * 5 * s], [x + 9 * s + i * 4 * s, y - 14 * s - i * 5 * s], [x + 6 * s + i * 4 * s, y - 17 * s - i * 5 * s], [x + 9 * s + i * 4 * s, y - 17 * s - i * 5 * s]], INK(0.6), 0.6);
    canv += Fauna.hen(x - 36 * s, y + 1, { sca: s * 0.8, dir: 1 });
    return canv;
  };
  this.chase = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var t = fig(x + 30 * s * dir, y, s, dir, { pose: "bend", armF: [[10, -16], [20, -22]], armB: [[8, -14], [18, -20]], bare: true });
    var canv = t.canv;
    canv += shape([[t.hand[0] - 5 * s, t.hand[1] - 4 * s], [t.hand[0] + 6 * s, t.hand[1] - 6 * s], [t.hand[0] + 5 * s, t.hand[1] + 4 * s], [t.hand[0] - 6 * s, t.hand[1] + 5 * s]], Palette.red, INK(), 0.8); // the stolen sari
    canv += line([[t.hand[0], t.hand[1] + 4 * s], [t.hand[0] - 8 * s, t.hand[1] + 14 * s]], Palette.yellow, 1.5 * s);
    var k = fig(x - 6 * s * dir, y + 2, s, dir, { pose: "stand", armF: [[10, -10], [16, -24]], armB: [[-6, 6], [-2, 12]], zari: true });
    canv += k.canv + belly(k, s, dir);
    canv += line([[k.hand[0], k.hand[1]], [k.hand[0] + 10 * s * dir, k.hand[1] - 10 * s]], Palette.darkbrown, 1.6 * s); // his stick
    var b = fig(x - 36 * s * dir, y, s, dir, { pose: "stand", armF: [[8, -2], [18, -8]], armB: [[-4, 10], [-2, 20]] });
    canv += b.canv; // a bystander pointing the way
    for (var i = 0; i < 3; i++) canv += line([[x + 8 * s * dir + i * 6 * s * dir, y + 1], [x + 2 * s * dir + i * 6 * s * dir, y + 1]], INK(0.4), 0.7); // dust
    return canv;
  };
  this.kiteStuck = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var canv = Town.lamppost(x, y, { sca: s });
    var kx = x + 6 * s, ky = y - 46 * s;
    canv += shape([[kx, ky - 8 * s], [kx + 6 * s, ky - 1 * s], [kx + 1 * s, ky + 7 * s], [kx - 5 * s, ky]], Palette.red, INK(), 0.9);
    canv += line([[kx + 1 * s, ky + 7 * s], [kx - 2 * s, ky + 18 * s], [kx + 3 * s, ky + 26 * s]], Palette.yellow, 1 * s);
    var b = fig(x + 26 * s, y + 2, s * 0.55, -1, { pose: "stand", armF: [[8, -10], [12, -20]], armB: [[4, -10], [8, -20]] });
    canv += b.canv;
    canv += line([[b.hand[0], b.hand[1]], [kx + 1 * s, ky + 7 * s]], INK(0.5), 0.5);
    canv += fig(x + 44 * s, y + 3, s * 0.55, -1, { pose: "stand", armF: [[8, 4], [12, -2]], armB: [[-6, 6], [-4, 12]], girl: true }).canv; // a friend, laughing
    return canv;
  };
  this.cowGarlands = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var canv = line([[x + 30 * s * dir, y], [x + 30 * s * dir, y - 44 * s]], Palette.darkbrown, 1.5 * s);
    var gl = bezmh([[x + 30 * s * dir, y - 42 * s], [x + 18 * s * dir, y - 24 * s], [x + 30 * s * dir, y - 6 * s]], 1);
    for (var i = 0; i < gl.length; i += 3) canv += dot(gl[i][0], gl[i][1], 1.8 * s, i % 2 ? Palette.orange : Palette.white, INK(0.6), 0.5);
    canv += Figures.cow(x + 56 * s * dir, y + 2, { sca: s, dir: -dir, col: Palette.white });
    canv += dot(x + 32 * s * dir, y - 26 * s, 2 * s, Palette.orange); // one in its mouth
    var v = fig(x, y, s, dir, { pose: "sit", female: true, armF: [[8, -10], [10, -20]], armB: [[-6, -10], [-8, -20]] });
    canv += v.canv;
    canv += shape([[x - 16 * s * dir, y], [x + 10 * s * dir, y], [x + 8 * s * dir, y - 6 * s], [x - 14 * s * dir, y - 6 * s]], Palette.brown, INK(), 0.8);
    for (var i = 0; i < 8; i++) canv += dot(x - 12 * s * dir + i * 2.8 * s * dir, y - 7 * s, 1.5 * s, [Palette.white, Palette.orange, Palette.red][i % 3]);
    return canv;
  };
  this.bargain = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var g = fig(x, y, s * 0.9, dir, { pose: "stand", female: true, col: Palette.indigo, armF: [[10, -6], [20, -10]], armB: [[-10, -4], [-18, -8]] });
    var canv = g.canv;
    canv += dot(g.head[0] - 7 * s * 0.9 * dir, g.head[1] + 1 * s, 3.2 * s * 0.9, Palette.white); // grey hair
    var m = fig(x + 30 * s * dir, y, s, -dir, { pose: "sit", zari: true, armF: [[8, -6], [16, -8]], armB: [[-4, 6], [0, 10]] });
    canv += m.canv;
    canv += shape([[m.hand[0] - 2 * s, m.hand[1] - 4 * s], [m.hand[0] + 14 * s * -dir, m.hand[1] - 2 * s], [m.hand[0] + 12 * s * -dir, m.hand[1] + 14 * s], [m.hand[0] - 2 * s, m.hand[1] + 14 * s]], Palette.green, INK(), 0.8);
    canv += line([[m.hand[0] - 2 * s, m.hand[1] + 12 * s], [m.hand[0] + 12 * s * -dir, m.hand[1] + 12 * s]], Palette.yellow, 1.2 * s);
    for (var i = 0; i < 3; i++) canv += shape([[x + 48 * s * dir - 8 * s, y - i * 5 * s], [x + 48 * s * dir + 8 * s, y - i * 5 * s], [x + 48 * s * dir + 8 * s, y - 4 * s - i * 5 * s], [x + 48 * s * dir - 8 * s, y - 4 * s - i * 5 * s]], [Palette.red, Palette.orange, "#2d6fa8"][i], INK(0.7), 0.5);
    return canv;
  };
  this.bullBlock = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var canv = "";
    // the bull lying down in the middle of the road
    var f = function(px) { return x + px * s * dir; };
    canv += shape([[f(-24), y], [f(22), y], [f(24), y - 12 * s], [f(14), y - 22 * s], [f(-8), y - 24 * s], [f(-24), y - 14 * s]], Palette.cream, INK(), 1.2);
    canv += shape([[f(20), y - 20 * s], [f(32), y - 22 * s], [f(36), y - 12 * s], [f(24), y - 8 * s]], Palette.cream, INK(), 1);
    canv += line(bezmh([[f(26), y - 22 * s], [f(22), y - 34 * s], [f(30), y - 36 * s]], 1), Palette.black, 2 * s);
    canv += line(bezmh([[f(30), y - 22 * s], [f(36), y - 34 * s], [f(30), y - 37 * s]], 1), Palette.black, 2 * s);
    canv += dot(f(31), y - 16 * s, 0.9 * s, Palette.black);
    canv += dot(f(-2), y - 16 * s, 3 * s, Palette.brown, INK(0.5), 0.5);
    // the cart that cannot pass, its driver with his hands in the air
    canv += Arch.cart(f(-70), y + 2, { sca: s * 0.8, dir: dir });
    canv += fig(f(40), y + 2, s * 0.9, -dir, { pose: "stand", armF: [[8, -2], [16, -8]], armB: [[-4, 10], [-2, 20]] }).canv; // a man explaining to the bull
    return canv;
  };
  this.lostChild = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var c = fig(x, y, s * 0.55, dir, { pose: "stand", armF: [[6, -4], [2, -10]], armB: [[-6, -4], [-2, -10]] });
    var canv = c.canv + tears(c.head, s * 0.55, dir);
    var k = fig(x + 22 * s * dir, y, s, -dir, { pose: "stand", armF: [[8, -4], [18, -10]], armB: [[-4, 8], [-2, 16]], zari: true });
    canv += k.canv;
    canv += dot(k.head[0] - 1 * s * -dir, k.head[1] - 8 * s, 6 * s, Palette.darkred, INK(), 1); // the kotwal's turban
    canv += line([[k.handB[0], k.handB[1]], [k.handB[0], y]], Palette.darkbrown, 1.5 * s);
    // the mother, running in from the other side
    var m = fig(x - 36 * s * dir, y + 2, s, dir, { pose: "bend", female: true, armF: [[14, -12], [26, -16]], armB: [[12, -10], [24, -14]] });
    canv += m.canv;
    return canv;
  };
  this.blessing = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var sd = People.sadhu(x, y, { sca: s, dir: dir });
    var canv = sd;
    var m = fig(x + 24 * s * dir, y + 2, s * 0.9, -dir, { pose: "kneel", armF: [[8, -8], [8, -16]], armB: [[4, -8], [4, -16]] });
    canv += m.canv;
    var w = fig(x + 40 * s * dir, y + 3, s * 0.9, -dir, { pose: "kneel", female: true, armF: [[8, -8], [8, -16]], armB: [[4, -8], [4, -16]] });
    canv += w.canv;
    canv += line([[x + 8 * s * dir, y - 30 * s], [m.head[0], m.head[1] - 8 * s]], Figures.SKIN, 2.6 * s); // hand on the head
    canv += dot(x - 10 * s * dir, y - 2 * s, 3 * s, Palette.yellow, INK(), 0.6); // offerings
    return canv;
  };
  this.dancingChild = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var canv = People.flautist(x, y, { sca: s, dir: dir });
    var c = fig(x + 30 * s * dir, y - 4 * s, s * 0.55, -dir, { pose: "stand", armF: [[10, -10], [16, -20]], armB: [[-10, -8], [-14, -18]], girl: true });
    canv += c.canv;
    canv += line([[x + 30 * s * dir, y - 4 * s], [x + 38 * s * dir, y - 2 * s]], Figures.SKIN2, 2.4 * s); // one foot in the air
    canv += Fauna.dog(x + 56 * s * dir, y, { sca: s * 0.7, dir: -dir });
    return canv;
  };
  this.ladderBunting = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var canv = line([[x, y], [x, y - 70 * s]], Palette.darkbrown, 2 * s);
    canv += line([[x - 10 * s, y], [x - 4 * s, y - 56 * s]], Palette.brown, 1.6 * s);
    canv += line([[x - 18 * s, y], [x - 12 * s, y - 56 * s]], Palette.brown, 1.6 * s);
    for (var i = 1; i < 8; i++) canv += line([[x - 10 * s + i * 0.75 * s, y - i * 7 * s], [x - 18 * s + i * 0.75 * s, y - i * 7 * s]], Palette.brown, 1.2 * s);
    var m = fig(x - 10 * s, y - 42 * s, s * 0.85, 1, { pose: "stand", armF: [[8, -12], [12, -22]], armB: [[-4, -6], [-2, -14]] });
    canv += m.canv;
    canv += Town.bunting(x, x + 90 * s, y - 68 * s, { sca: s });
    canv += fig(x - 22 * s, y + 2, s * 0.85, 1, { pose: "stand", armF: [[8, -10], [10, -24]], armB: [[4, -10], [6, -24]] }).canv; // holding the ladder
    return canv;
  };
  this.astrologer = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var canv = People.fortuneTeller(x, y, { sca: s, dir: dir });
    var m = fig(x + 44 * s * dir, y, s, -dir, { pose: "sit", armF: [[6, -8], [2, -18]], armB: [[-6, 6], [-4, 12]] });
    canv += m.canv; // biting his nails
    var w = fig(x + 60 * s * dir, y + 2, s, -dir, { pose: "stand", female: true, armF: [[6, 4], [4, -2]], armB: [[-4, 10], [-2, 20]] });
    canv += w.canv;
    return canv;
  };
  this.marbles = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    for (var i = 0; i < 6; i++) canv += dot(x + (Math.random() - 0.5) * 20 * s, y - 1 * s + (Math.random() - 0.5) * 6 * s, 1.3 * s, [Palette.green, "#2d6fa8", Palette.red, Palette.white][i % 4], INK(0.5), 0.4);
    canv += line([[x - 6 * s, y - 2 * s], [x + 6 * s, y - 2 * s], [x, y + 3 * s], [x - 6 * s, y - 2 * s]], INK(0.5), 0.5);
    canv += fig(x - 18 * s, y, s * 0.55, 1, { pose: "kneel", armF: [[10, 8], [18, 16]], armB: [[2, 10], [8, 18]] }).canv;
    canv += fig(x + 18 * s, y + 2, s * 0.55, -1, { pose: "kneel", armF: [[8, 6], [10, 14]], armB: [[2, 10], [4, 18]], girl: true }).canv;
    canv += fig(x + 2 * s, y - 8 * s, s * 0.5, 1, { pose: "sit", armF: [[6, 6], [8, 12]], armB: [[-6, 6], [-4, 12]] }).canv;
    return canv;
  };
  this.drunkard = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var d = fig(x, y, s, dir, { pose: "stand", armF: [[10, -6], [18, -2]], armB: [[-8, 2], [-6, 10]] });
    var canv = "<g transform='rotate(" + (-12 * dir) + " " + x + " " + y + ")'>" + d.canv + dot(d.hand[0] + 3 * s * dir, d.hand[1] - 2 * s, 3 * s, Palette.black, INK(), 0.7) + "</g>"; // the toddy pot
    var fr = fig(x - 16 * s * dir, y + 2, s, dir, { pose: "stand", armF: [[10, -8], [18, -6]], armB: [[-4, 10], [-2, 20]] });
    canv += fr.canv; // a friend holding him up
    return canv;
  };
  this.spilledPots = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var p = fig(x, y + 2, s, dir, { pose: "bend", armF: [[10, -18], [14, -30]], armB: [[6, -16], [10, -28]] });
    var canv = p.canv;
    for (var i = 0; i < 4; i++) {
      var px = x + (12 + i * 12) * s * dir, py = y - 26 * s + i * 8 * s - (i % 2) * 14 * s;
      canv += "<g transform='rotate(" + (i * 40) + " " + px + " " + py + ")'>" + shape([[px - 4 * s, py], [px + 4 * s, py], [px + 4.5 * s, py - 4 * s], [px + 3 * s, py - 7 * s], [px - 3 * s, py - 7 * s], [px - 4.5 * s, py - 4 * s]], Palette.orange, INK(0.8), 0.6) + "</g>";
    }
    for (var i = 0; i < 6; i++) canv += shape([[x + (30 + i * 6) * s * dir, y + 1], [x + (34 + i * 6) * s * dir, y + 1], [x + (33 + i * 6) * s * dir, y - 3 * s]], Palette.orange, INK(0.7), 0.5); // shards
    canv += fig(x + 64 * s * dir, y, s, -dir, { pose: "stand", armF: [[6, 4], [4, -4]], armB: [[-4, 10], [-2, 20]] }).canv; // someone laughing behind a hand
    return canv;
  };
  this.elephantCoin = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var canv = Figures.elephant(x, y, { sca: s * 0.9, dir: dir, temple: true });
    var d = fig(x + 66 * s * dir, y + 2, s * 0.9, -dir, { pose: "bend", armF: [[12, -14], [24, -18]], armB: [[10, -12], [22, -16]] });
    canv += d.canv;
    canv += dot(d.hand[0], d.hand[1], 1.5 * s, Palette.yellow); // the coin
    canv += fig(x + 86 * s * dir, y + 4, s * 0.55, -dir, { pose: "stand", armF: [[6, -8], [2, -14]], armB: [[-6, 6], [-4, 12]] }).canv; // a child hiding behind
    return canv;
  };
  this.argument = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = fig(x - 22 * s, y, s, 1, { pose: "stand", armF: [[10, -10], [18, -18]], armB: [[-6, 4], [-10, -6]] }).canv;
    canv += fig(x + 22 * s, y + 2, s, -1, { pose: "stand", armF: [[10, -8], [16, -20]], armB: [[-6, 4], [-10, -6]], zari: true }).canv;
    var t = fig(x, y - 6 * s, s * 0.85, 1, { pose: "stand", armF: [[8, -4], [14, -8]], armB: [[-8, -4], [-14, -8]] });
    canv += t.canv; // the tea seller between them
    canv += shape([[t.hand[0] - 2 * s, t.hand[1]], [t.hand[0] + 2 * s, t.hand[1]], [t.hand[0] + 1.5 * s, t.hand[1] - 4 * s], [t.hand[0] - 1.5 * s, t.hand[1] - 4 * s]], Palette.cream, INK(0.7), 0.5);
    canv += Fauna.dog(x + 2 * s, y + 4, { sca: s * 0.6, dir: 1 });
    return canv;
  };
  this.waterSpill = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var w = fig(x, y, s, dir, { pose: "stand", female: true, armF: [[8, -2], [14, 4]], armB: [[-6, -2], [-10, 6]] });
    var canv = w.canv;
    var pts = [];
    for (var i = 0; i <= 10; i++) { var t = (i / 10) * Math.PI * 2; pts.push([x + 16 * s * dir + Math.cos(t) * 14 * s, y + 3 * s + Math.sin(t) * 4 * s]); }
    canv += shape(pts, Palette.blue, "none", 0);
    canv += "<g transform='rotate(70 " + (x + 16 * s * dir) + " " + (y - 2 * s) + ")'>" + shape([[x + 16 * s * dir - 6 * s, y - 2 * s], [x + 16 * s * dir + 6 * s, y - 2 * s], [x + 16 * s * dir + 7 * s, y - 9 * s], [x + 16 * s * dir + 4 * s, y - 14 * s], [x + 16 * s * dir - 4 * s, y - 14 * s], [x + 16 * s * dir - 7 * s, y - 9 * s]], Palette.orange, INK(), 0.9) + "</g>";
    canv += fig(x + 30 * s * dir, y + 2, s * 0.5, -dir, { pose: "stand", armF: [[8, -8], [12, -16]], armB: [[-8, -8], [-12, -16]] }).canv; // a child delighted by the puddle
    for (var i = 0; i < 4; i++) canv += dot(x + 28 * s * dir + (Math.random() - 0.5) * 12 * s, y - 2 * s - Math.random() * 6 * s, 0.8 * s, "#9fc4e0");
    return canv;
  };
  this.townCrier = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var canv = People.thavil(x, y, { sca: s, dir: dir });
    canv += fig(x - 22 * s * dir, y + 2, s * 0.9, dir, STAND_IDLE).canv;
    canv += fig(x - 36 * s * dir, y - 2, s * 0.9, dir, { pose: "stand", female: true, armF: [[6, 6], [4, -2]], armB: [[-4, 10], [-2, 20]] }).canv;
    canv += fig(x - 50 * s * dir, y + 3, s * 0.5, dir, { pose: "stand", armF: [[8, -6], [10, -14]], armB: [[-6, 6], [-4, 12]] }).canv;
    return canv;
  };
  this.monkeyShow = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var m = fig(x, y, s * 0.6, dir, { pose: "stand", armF: [[8, -2], [16, -4]], armB: [[-6, 6], [-4, 12]] });
    var canv = m.canv;
    canv += Fauna.monkey(x + 22 * s * dir, y, { sca: s * 0.7, dir: -dir });
    canv += line([[m.hand[0], m.hand[1]], [x + 22 * s * dir, y - 14 * s]], INK(0.6), 0.6); // the leash
    canv += dot(x + 22 * s * dir, y - 18 * s, 2.6 * s, Palette.red, INK(), 0.6); // a little cap
    canv += line([[x + 10 * s * dir, y - 6 * s], [x + 14 * s * dir, y - 2 * s]], INK(), 1 * s); // a tiny drum stick
    canv += fig(x + 44 * s * dir, y + 2, s * 0.5, -dir, { pose: "stand", armF: [[8, -8], [12, -14]], armB: [[-6, 6], [-4, 12]], girl: true }).canv;
    canv += fig(x + 56 * s * dir, y, s * 0.5, -dir, { pose: "stand", armF: [[6, 4], [4, -2]], armB: [[-6, 6], [-4, 12]] }).canv;
    return canv;
  };
  this.silambamRing = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = People.silambam(x, y, { sca: s });
    for (var i = 0; i < 4; i++) canv += fig(x + (i < 2 ? -46 - i * 14 : 46 + (i - 2) * 14) * s, y + 2 + (i % 2) * 4, s * 0.55, i < 2 ? 1 : -1, { pose: "sit", armF: [[6, 6], [8, 12]], armB: [[-6, 6], [-4, 12]] }).canv;
    return canv;
  };
  this.oldFriends = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = fig(x - 12 * s, y, s, 1, { pose: "stand", armF: [[8, 2], [16, 4]], armB: [[-4, 10], [-2, 20]], zari: true }).canv;
    canv += fig(x + 12 * s, y + 2, s, -1, { pose: "stand", armF: [[8, 2], [16, 4]], armB: [[-4, 10], [-2, 20]] }).canv; // two old men clasping hands
    canv += line([[x - 2 * s, y - 32 * s], [x + 2 * s, y - 32 * s]], Figures.SKIN, 3 * s);
    return canv;
  };
}();
