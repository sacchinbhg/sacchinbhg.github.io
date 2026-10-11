// People at work and at rest: a small rig of poses (standing, sitting,
// bending, kneeling) dressed as men in veshtis or women in saris, with the
// arms placed per occupation. Builds on Figures.head / Figures.eye.
var People = new function() {

  // body rig. o: {female, col, pose, armF:[[ex,ey],[hx,hy]], armB:[[..],[..]], zari, bare}
  // arm points are offsets from the shoulder in units of s, x along dir.
  function rig(x, y, s, dir, o) {
    var canv = "";
    var f = function(px) { return x + px * s * dir; };
    var g = function(py) { return y + py * s; };
    var female = o.female;
    var id = Figures.use(o.id || Figures.identity(female, { col: o.col, zari: o.zari }));
    var SKIN = id.skin, SKIN2 = id.skin2;
    var col = o.col || (female ? id.sari : (id.lungi ? id.lungi[0] : id.veshti));
    var border = female ? id.border : (o.zari ? Palette.yellow : id.border);
    var pose = o.pose || "stand";
    var hip, sh, hd; // y of hips, shoulders, head centre (units)
    var shx = 0; // x of shoulders
    if (pose == "stand") { hip = -33; sh = -50; hd = -59; }
    else if (pose == "sit") { hip = -10; sh = -28; hd = -37; }
    else if (pose == "bend") { hip = -30; sh = -34; hd = -33; shx = 18; }
    else if (pose == "kneel") { hip = -14; sh = -32; hd = -41; }
    // legs and lower garment
    if (pose == "stand") {
      canv += dot(f(-4), g(-1), 3 * s, Figures.SKIN2, INK(), 0.8);
      canv += dot(f(5), g(-1), 3 * s, Figures.SKIN2, INK(), 0.8);
      canv += shape([[f(-7), g(hip)], [f(7), g(hip)], [f(female ? 11 : 10), g(-2)], [f(female ? -11 : -9), g(-2)]], col, INK(), 1.1);
      canv += line([[f(female ? -11 : -9), g(-4)], [f(female ? 11 : 10), g(-4)]], border, 1.6 * s);
      if (female) for (var i = -1; i <= 1; i++) canv += line([[f(i * 3), g(hip + 3)], [f(i * 4), g(-6)]], INK(0.5), 0.7);
    } else if (pose == "sit") {
      // cross-legged: a low rounded mass of cloth with two feet showing
      var lump = [[f(-16), g(0)], [f(16), g(0)], [f(14), g(-6)], [f(8), g(hip - 2)], [f(-8), g(hip - 2)], [f(-14), g(-6)]];
      canv += shape(lump, col, INK(), 1.1);
      canv += line([[f(-14), g(-2)], [f(14), g(-2)]], border, 1.4 * s);
      canv += dot(f(10), g(-1), 2.6 * s, Figures.SKIN2, INK(), 0.8);
      canv += dot(f(-10), g(-1), 2.6 * s, Figures.SKIN2, INK(), 0.8);
    } else if (pose == "bend") {
      canv += dot(f(-5), g(-1), 3 * s, Figures.SKIN2, INK(), 0.8);
      canv += dot(f(5), g(-1), 3 * s, Figures.SKIN2, INK(), 0.8);
      canv += shape([[f(-8), g(hip)], [f(6), g(hip + 2)], [f(9), g(-2)], [f(-9), g(-2)]], col, INK(), 1.1);
      canv += line([[f(-9), g(-4)], [f(9), g(-4)]], border, 1.6 * s);
    } else if (pose == "kneel") {
      canv += shape([[f(-8), g(0)], [f(12), g(0)], [f(12), g(-5)], [f(6), g(hip)], [f(-7), g(hip)]], col, INK(), 1.1);
      canv += line([[f(-7), g(-2)], [f(12), g(-2)]], border, 1.4 * s);
      canv += dot(f(-9), g(-1), 2.6 * s, Figures.SKIN2, INK(), 0.8);
    }
    // torso
    if (pose == "bend") {
      canv += shape([[f(-7), g(hip)], [f(7), g(hip + 1)], [f(shx + 6), g(sh)], [f(shx - 4), g(sh - 6)]], female ? id.blouse : (id.shirt && !o.bare ? id.shirt : Figures.SKIN), INK(), 1.1);
    } else {
      canv += shape([[f(-7), g(sh)], [f(7), g(sh)], [f(6), g(hip + 1)], [f(-6), g(hip + 1)]], female ? id.blouse : (id.shirt && !o.bare ? id.shirt : Figures.SKIN), INK(), 1.1);
      if (!female && id.stout) canv += dot(f(1), g(hip - 6), 6.5 * s, id.shirt && !o.bare ? id.shirt : Figures.SKIN, INK(), 1);
      if (female) {
        canv += shape([[f(-6), g(hip - 8)], [f(6), g(hip - 8)], [f(6), g(hip + 1)], [f(-6), g(hip + 1)]], Figures.SKIN, INK(), 1);
        canv += shape([[f(-6), g(sh)], [f(1), g(sh)], [f(6), g(hip + 2)], [f(-2), g(hip + 2)]], col, INK(), 1);
        canv += line([[f(-6), g(sh)], [f(6), g(hip + 2)]], Palette.yellow, 1.2 * s);
      } else if (!o.bare && !id.shirt) {
        canv += line([[f(-5), g(sh + 1)], [f(5), g(hip - 2)]], id.ang, 1.4 * s);
      }
    }
    // back arm
    var sx = f(shx - 5), sy = g(sh + 2);
    if (o.armB) canv += line([[sx, sy], [sx + o.armB[0][0] * s * dir, sy + o.armB[0][1] * s], [sx + o.armB[1][0] * s * dir, sy + o.armB[1][1] * s]], Figures.SKIN2, 2.6 * s);
    // head
    canv += Figures.head(f(shx + 1), g(hd), dir, s, female, id);
    // front arm
    sx = f(shx + 5); sy = g(sh + 2);
    if (o.armF) canv += line([[sx, sy], [sx + o.armF[0][0] * s * dir, sy + o.armF[0][1] * s], [sx + o.armF[1][0] * s * dir, sy + o.armF[1][1] * s]], Figures.SKIN, 3 * s);
    if (female) canv += line([[sx + o.armF[1][0] * s * dir - 2 * s * dir, sy + o.armF[1][1] * s - 2 * s], [sx + o.armF[1][0] * s * dir + 1 * s * dir, sy + o.armF[1][1] * s - 2 * s]], Palette.yellow, 1.2 * s);
    return {
      canv: canv,
      hand: [sx + (o.armF ? o.armF[1][0] : 0) * s * dir, sy + (o.armF ? o.armF[1][1] : 0) * s],
      handB: [f(shx - 5) + (o.armB ? o.armB[1][0] : 0) * s * dir, g(sh + 2) + (o.armB ? o.armB[1][1] : 0) * s],
      head: [f(shx + 1), g(hd)],
      shoulder: [f(shx), g(sh)],
      hip: [f(0), g(hip)],
    };
  }
  this.rig = rig;

  function A(args) {
    args = args || {};
    return { s: args.sca || 1, dir: args.dir || 1 };
  }

  // ---- men ----------------------------------------------------------------
  this.sitting = function(x, y, args) {
    var a = A(args);
    return rig(x, y, a.s, a.dir, { pose: "sit", armF: [[6, 8], [10, 12]], armB: [[-6, 8], [-2, 14]] }).canv;
  };
  this.elder = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "stand", armF: [[8, 6], [10, 20]], armB: [[-4, 10], [-2, 22]], zari: true });
    var canv = r.canv;
    // walking stick and a palm leaf umbrella
    canv += line([[r.hand[0], r.hand[1]], [r.hand[0] + 2 * s * dir, y]], Palette.darkbrown, 1.6 * s);
    var ux = r.head[0] - 2 * s * dir, uy = r.head[1] - 16 * s;
    canv += line([[r.handB[0], r.handB[1]], [ux, uy]], Palette.darkbrown, 1.2 * s);
    var um = [];
    for (var i = 0; i <= 10; i++) { var t = Math.PI + (i / 10) * Math.PI; um.push([ux + Math.cos(t) * 20 * s, uy + Math.sin(t) * 9 * s]); }
    canv += shape(um, Palette.paleyellow, INK(), 1);
    for (var i = 1; i < 5; i++) canv += line([[ux, uy - 9 * s], [ux - 20 * s + i * 8 * s, uy]], INK(0.5), 0.7);
    // white beard
    canv += shape([[r.head[0] + 4 * s * dir, r.head[1] + 4 * s], [r.head[0] + 9 * s * dir, r.head[1] + 5 * s], [r.head[0] + 6 * s * dir, r.head[1] + 13 * s], [r.head[0] + 1 * s * dir, r.head[1] + 9 * s]], Palette.white, INK(0.7), 0.6);
    return canv;
  };
  this.priest = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "stand", armF: [[8, 6], [14, -2]], armB: [[-5, 10], [2, 6]], bare: true });
    var canv = r.canv;
    // sacred thread, forehead marks, and an oil lamp held up
    canv += line([[r.shoulder[0] - 5 * s * dir, r.shoulder[1] + 1], [r.shoulder[0] + 5 * s * dir, r.hip[1] - 2 * s]], Palette.white, 1 * s);
    canv += line([[r.head[0] + 2 * s * dir, r.head[1] - 7 * s], [r.head[0] + 2 * s * dir, r.head[1] - 3 * s]], Palette.white, 2 * s);
    canv += line([[r.head[0] + 2 * s * dir, r.head[1] - 7 * s], [r.head[0] + 2 * s * dir, r.head[1] - 3 * s]], Palette.red, 0.8 * s);
    var hx = r.hand[0], hy = r.hand[1];
    canv += shape([[hx - 5 * s, hy], [hx + 5 * s, hy], [hx + 3 * s, hy - 4 * s], [hx - 3 * s, hy - 4 * s]], Palette.yellow, INK(), 0.9);
    canv += shape([[hx - 1.5 * s, hy - 4 * s], [hx + 1.5 * s, hy - 4 * s], [hx, hy - 10 * s]], Palette.orange, INK(0.6), 0.5);
    return canv;
  };
  this.toddyTapper = function(x, y, args) {
    // a man climbing a palmyra with a pot slung at his waist
    var a = A(args), s = a.s, dir = a.dir;
    var canv = "";
    var H = 230 * s;
    canv += Palmyra.tree(x, y, { sca: s, hei: 230, lean: 0, fruit: false });
    var cy = y - H * 0.6;
    var r = rig(x + 9 * s * dir, cy + 20 * s, s * 0.85, dir, { pose: "stand", armF: [[-6, -12], [-12, -22]], armB: [[-2, -12], [-8, -22]] });
    canv += r.canv;
    canv += line([[x - 10 * s, cy - 10 * s], [x + 10 * s, cy + 2 * s]], Palette.darkbrown, 1.5 * s); // climbing loop
    canv += dot(r.hip[0] - 7 * s * dir, r.hip[1] + 6 * s, 5 * s, Palette.black, INK(), 0.9);
    return canv;
  };
  this.netCaster = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "stand", armF: [[10, -6], [18, -14]], armB: [[-6, 6], [0, 12]] });
    var canv = r.canv;
    var hx = r.hand[0], hy = r.hand[1];
    var net = [];
    for (var i = 0; i <= 10; i++) { var t = (i / 10) * Math.PI; net.push([hx + Math.cos(t) * 26 * s * dir + 10 * s * dir, hy - 6 * s + Math.sin(t) * 14 * s]); }
    net.push([hx, hy]);
    canv += shape(net, "rgba(239,227,198,0.35)", INK(0.8), 0.9);
    for (var i = 1; i < 6; i++) canv += line([[hx, hy], [net[i * 2][0], net[i * 2][1]]], INK(0.5), 0.6);
    for (var i = 0; i < net.length - 1; i += 2) canv += dot(net[i][0], net[i][1], 1 * s, Palette.darkbrown);
    return canv;
  };
  this.ploughman = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var canv = "";
    var f = function(px) { return x + px * s * dir; };
    canv += Figures.cow(f(50), y, { sca: s * 0.9, dir: dir, col: Palette.white });
    canv += Figures.cow(f(44), y - 6 * s, { sca: s * 0.85, dir: dir, col: Palette.brown });
    canv += line([[f(28), y - 34 * s], [f(62), y - 34 * s]], Palette.darkbrown, 2.2 * s); // yoke
    canv += line([[f(45), y - 34 * s], [f(8), y - 10 * s]], Palette.darkbrown, 2 * s); // beam
    canv += shape([[f(2), y - 12 * s], [f(12), y - 8 * s], [f(14), y + 1 * s], [f(4), y + 1 * s]], Palette.darkbrown, INK(), 1); // share
    canv += line([[f(8), y - 10 * s], [f(2), y - 30 * s]], Palette.darkbrown, 1.8 * s); // handle
    var r = rig(f(-10), y, s, dir, { pose: "stand", armF: [[8, 2], [12, -8]], armB: [[-2, 8], [4, 14]] });
    canv += r.canv;
    for (var i = 0; i < 6; i++) canv += line([[f(-30 - i * 10), y + 3 * s], [f(-24 - i * 10), y + 1 * s]], Palette.darkbrown, 1.2);
    return canv;
  };
  this.poleCarrier = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "stand", armF: [[6, -8], [4, -12]], armB: [[-6, 8], [-4, 14]] });
    var canv = r.canv;
    var sy = r.shoulder[1] - 1 * s;
    canv += line([[x - 28 * s, sy - 2 * s], [x + 28 * s, sy - 2 * s]], Palette.darkbrown, 2 * s);
    for (var e = -1; e <= 1; e += 2) {
      canv += line([[x + e * 26 * s, sy - 2 * s], [x + e * 26 * s, sy + 14 * s]], INK(), 0.9);
      canv += shape([[x + e * 26 * s - 8 * s, sy + 14 * s], [x + e * 26 * s + 8 * s, sy + 14 * s], [x + e * 26 * s + 6 * s, sy + 22 * s], [x + e * 26 * s - 6 * s, sy + 22 * s]], Palette.yellow, INK(), 0.9);
      for (var i = 0; i < 4; i++) canv += dot(x + e * 26 * s - 5 * s + i * 3.3 * s, sy + 13 * s, 1.6 * s, i % 2 ? Palette.orange : Palette.green);
    }
    return canv;
  };
  this.nadaswaram = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "stand", armF: [[10, 4], [16, 10]], armB: [[2, 6], [10, 12]], zari: true });
    var canv = r.canv;
    var hx = r.head[0] + 7 * s * dir, hy = r.head[1] + 3 * s;
    canv += shape([[hx, hy - 1.5 * s], [hx + 30 * s * dir, hy + 8 * s], [hx + 36 * s * dir, hy + 16 * s], [hx + 28 * s * dir, hy + 16 * s], [hx, hy + 1.5 * s]], Palette.darkbrown, INK(), 1);
    canv += line([[hx + 30 * s * dir, hy + 9 * s], [hx + 34 * s * dir, hy + 15 * s]], Palette.yellow, 1.2 * s);
    return canv;
  };
  this.thavil = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "stand", armF: [[8, 2], [14, 10]], armB: [[-4, 8], [-2, 16]] });
    var canv = r.canv;
    var dx = x + 6 * s * dir, dy = r.hip[1] + 2 * s;
    canv += shape([[dx - 10 * s, dy - 9 * s], [dx + 10 * s, dy - 9 * s], [dx + 10 * s, dy + 9 * s], [dx - 10 * s, dy + 9 * s]], Palette.brown, INK(), 1);
    canv += dot(dx + 10 * s * dir, dy, 9 * s, Palette.cream, INK(), 1);
    canv += dot(dx - 10 * s * dir, dy, 9 * s, Palette.cream, INK(), 1);
    canv += line([[dx - 9 * s, dy - 9 * s], [dx + 9 * s, dy + 9 * s]], Palette.yellow, 0.8 * s);
    canv += line([[r.hand[0], r.hand[1]], [r.hand[0] + 6 * s * dir, r.hand[1] - 8 * s]], INK(), 1.2 * s);
    return canv;
  };
  this.flautist = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "sit", armF: [[8, 0], [14, -4]], armB: [[4, -2], [12, -6]] });
    var canv = r.canv;
    canv += line([[r.head[0] + 4 * s * dir, r.head[1] + 4 * s], [r.head[0] + 26 * s * dir, r.head[1] + 1 * s]], Palette.yellow, 2.2 * s);
    canv += line([[r.head[0] + 4 * s * dir, r.head[1] + 4 * s], [r.head[0] + 26 * s * dir, r.head[1] + 1 * s]], INK(), 0.7);
    return canv;
  };
  this.potter = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var canv = "";
    var wx = x + 22 * s * dir, wy = y - 6 * s;
    canv += dot(wx, wy, 14 * s, STONE_C, INK(), 1.1);
    canv += dot(wx, wy, 14 * s, "none", INK(0.4), 0.5);
    canv += shape([[wx - 6 * s, wy - 2 * s], [wx + 6 * s, wy - 2 * s], [wx + 8 * s, wy - 12 * s], [wx + 5 * s, wy - 18 * s], [wx - 5 * s, wy - 18 * s], [wx - 8 * s, wy - 12 * s]], Palette.orange, INK(), 1);
    var r = rig(x, y, s, dir, { pose: "sit", armF: [[10, 2], [18, -6]], armB: [[6, 4], [14, -2]] });
    canv += r.canv;
    for (var i = 0; i < 3; i++) canv += shape([[x - 30 * s + i * 11 * s - 5 * s, y], [x - 30 * s + i * 11 * s + 5 * s, y], [x - 30 * s + i * 11 * s + 4 * s, y - 10 * s], [x - 30 * s + i * 11 * s - 4 * s, y - 10 * s]], Palette.orange, INK(), 0.9);
    return canv;
  };
  var STONE_C = "#b3a689";
  this.weaver = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var canv = "";
    var f = function(px) { return x + px * s * dir; };
    // a pit loom: frame, warp threads, cloth
    canv += line([[f(10), y], [f(10), y - 44 * s]], Palette.darkbrown, 2 * s);
    canv += line([[f(46), y], [f(46), y - 44 * s]], Palette.darkbrown, 2 * s);
    canv += line([[f(8), y - 44 * s], [f(48), y - 44 * s]], Palette.darkbrown, 2 * s);
    for (var i = 0; i < 9; i++) canv += line([[f(14 + i * 4), y - 42 * s], [f(14 + i * 4), y - 16 * s]], Palette.cream, 0.7);
    canv += shape([[f(12), y - 16 * s], [f(44), y - 16 * s], [f(44), y - 4 * s], [f(12), y - 4 * s]], Palette.red, INK(), 1);
    canv += line([[f(12), y - 8 * s], [f(44), y - 8 * s]], Palette.yellow, 1.5 * s);
    canv += line([[f(12), y - 22 * s], [f(44), y - 22 * s]], Palette.darkbrown, 2 * s);
    var r = rig(x, y, s, dir, { pose: "sit", armF: [[8, 0], [16, 2]], armB: [[6, 2], [14, 4]] });
    canv += r.canv;
    return canv;
  };
  this.vendor = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "sit", armF: [[8, 6], [12, 12]], armB: [[-6, 6], [-4, 12]] });
    var canv = r.canv;
    var bx = x + 24 * s * dir;
    var fruits = [Palette.yellow, Palette.orange, Palette.green, Palette.red];
    for (var k = 0; k < 2; k++) {
      var cx = bx + k * 20 * s * dir;
      canv += shape([[cx - 10 * s, y], [cx + 10 * s, y], [cx + 8 * s, y - 8 * s], [cx - 8 * s, y - 8 * s]], Palette.brown, INK(), 1);
      for (var i = 0; i < 6; i++) canv += dot(cx - 6 * s + (i % 3) * 6 * s, y - 9 * s - Math.floor(i / 3) * 4 * s, 2.6 * s, fruits[(i + k) % 4], INK(), 0.6);
    }
    return canv;
  };
  this.kiteFlyer = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s * 0.7, dir, { pose: "stand", armF: [[6, -10], [10, -18]], armB: [[-4, 8], [-2, 14]] });
    var canv = r.canv;
    var kx = r.hand[0] + 50 * s * dir, ky = r.hand[1] - 80 * s;
    canv += line([[r.hand[0], r.hand[1]], [kx, ky]], INK(0.6), 0.6);
    canv += shape([[kx, ky - 12 * s], [kx + 9 * s, ky], [kx, ky + 12 * s], [kx - 9 * s, ky]], Palette.red, INK(), 1);
    canv += line([[kx, ky - 12 * s], [kx, ky + 12 * s]], INK(), 0.7);
    canv += line([[kx - 9 * s, ky], [kx + 9 * s, ky]], INK(), 0.7);
    canv += line([[kx, ky + 12 * s], [kx - 6 * s, ky + 30 * s], [kx + 2 * s, ky + 40 * s]], Palette.yellow, 1.2 * s);
    return canv;
  };
  this.child = function(x, y, args) {
    var a = A(args), s = a.s * 0.55, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "stand", armF: [[8, -4], [12, -12]], armB: [[-6, 6], [-4, 12]], female: args && args.girl });
    var canv = r.canv;
    // a spinning top on a string, or a ball
    if (args && args.girl) canv += dot(r.hand[0] + 2 * s * dir, r.hand[1] - 4 * s, 4 * s, Palette.red, INK(), 0.8);
    else {
      canv += line([[r.hand[0], r.hand[1]], [x + 18 * s * dir, y - 2 * s]], INK(0.6), 0.6);
      canv += shape([[x + 14 * s * dir, y - 8 * s], [x + 22 * s * dir, y - 8 * s], [x + 18 * s * dir, y]], Palette.orange, INK(), 0.8);
    }
    return canv;
  };
  this.warrior = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "stand", armF: [[10, -8], [14, -22]], armB: [[-8, 8], [-10, 4]], zari: true });
    var canv = r.canv;
    // curved sword raised, round shield, a warrior's turban
    canv += line(bezmh([[r.hand[0], r.hand[1]], [r.hand[0] + 10 * s * dir, r.hand[1] - 14 * s], [r.hand[0] + 4 * s * dir, r.hand[1] - 26 * s]], 1), Palette.cream, 2.4 * s);
    canv += line(bezmh([[r.hand[0], r.hand[1]], [r.hand[0] + 10 * s * dir, r.hand[1] - 14 * s], [r.hand[0] + 4 * s * dir, r.hand[1] - 26 * s]], 1), INK(), 0.7);
    canv += dot(r.handB[0], r.handB[1], 8 * s, Palette.red, INK(), 1.1);
    canv += dot(r.handB[0], r.handB[1], 2.5 * s, Palette.yellow);
    canv += dot(r.head[0] - 1 * s * dir, r.head[1] - 8 * s, 6 * s, Palette.orange, INK(), 1);
    return canv;
  };
  this.hayCarrier = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "stand", armF: [[6, -6], [4, -12]], armB: [[-6, -6], [-4, -12]] });
    var canv = r.canv;
    var hx = r.head[0], hy = r.head[1] - 10 * s;
    var hay = [];
    for (var i = 0; i <= 12; i++) { var t = (i / 12) * Math.PI * 2; hay.push([hx + Math.cos(t) * 22 * s * (1 + 0.1 * Math.sin(t * 5)), hy - 8 * s + Math.sin(t) * 12 * s]); }
    canv += shape(hay, Palette.paleyellow, INK(), 1);
    for (var i = 0; i < 12; i++) canv += line([[hx + (Math.random() - 0.5) * 36 * s, hy - 8 * s + (Math.random() - 0.5) * 18 * s], [hx + (Math.random() - 0.5) * 36 * s, hy - 8 * s + (Math.random() - 0.5) * 18 * s]], Palette.yellow, 0.7);
    return canv;
  };
  this.fortuneTeller = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "sit", armF: [[8, 4], [16, 2]], armB: [[-6, 6], [-4, 12]] });
    var canv = r.canv;
    // a parrot in a cage picking cards
    var cx = x + 26 * s * dir, cy = y - 14 * s;
    canv += shape([[cx - 8 * s, y], [cx + 8 * s, y], [cx + 8 * s, cy - 6 * s], [cx - 8 * s, cy - 6 * s]], "rgba(239,227,198,0.3)", INK(), 1);
    for (var i = -2; i <= 2; i++) canv += line([[cx + i * 3.5 * s, y], [cx + i * 3.5 * s, cy - 6 * s]], INK(0.6), 0.6);
    canv += shape([[cx - 4 * s, cy], [cx + 3 * s, cy - 3 * s], [cx + 5 * s, cy], [cx, cy + 3 * s]], Palette.green, INK(), 0.8);
    canv += line([[cx + 5 * s, cy], [cx + 7 * s, cy + 1 * s]], Palette.red, 1.2 * s);
    for (var i = 0; i < 4; i++) canv += shape([[x + 10 * s * dir + i * 5 * s * dir, y], [x + 14 * s * dir + i * 5 * s * dir, y], [x + 14 * s * dir + i * 5 * s * dir, y - 5 * s], [x + 10 * s * dir + i * 5 * s * dir, y - 5 * s]], Palette.cream, INK(), 0.6);
    return canv;
  };

  // ---- women ----------------------------------------------------------------
  this.transplanter = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "bend", female: true, armF: [[6, 14], [8, 24]], armB: [[2, 14], [4, 24]] });
    var canv = r.canv;
    for (var i = 0; i < 3; i++) canv += line([[r.hand[0] + i * 2 * s, r.hand[1] + 2 * s], [r.hand[0] + i * 2 * s - 1 * s, r.hand[1] - 6 * s]], Palette.lightgreen, 1.1 * s);
    return canv;
  };
  this.winnower = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "stand", female: true, armF: [[8, -4], [16, -12]], armB: [[-2, -4], [8, -14]] });
    var canv = r.canv;
    var hx = r.hand[0], hy = r.hand[1];
    var tray = [];
    for (var i = 0; i <= 10; i++) { var t = (i / 10) * Math.PI; tray.push([hx + Math.cos(t) * 14 * s, hy - 4 * s + Math.sin(t) * 6 * s]); }
    canv += shape(tray, Palette.yellow, INK(), 1);
    for (var i = 0; i < 10; i++) canv += dot(hx + (Math.random() - 0.5) * 20 * s, hy - 6 * s - Math.random() * 16 * s, 0.9 * s, Palette.paleyellow);
    return canv;
  };
  this.pounding = function(x, y, args) {
    // two women pounding rice in a mortar with long pestles
    var a = A(args), s = a.s;
    var canv = "";
    var mx = x;
    canv += shape([[mx - 7 * s, y], [mx + 7 * s, y], [mx + 6 * s, y - 14 * s], [mx - 6 * s, y - 14 * s]], STONE_C, INK(), 1.1);
    var r1 = rig(x - 16 * s, y, s, 1, { pose: "stand", female: true, armF: [[8, -10], [10, -20]], armB: [[4, -10], [6, -20]] });
    var r2 = rig(x + 16 * s, y, s, -1, { pose: "stand", female: true, armF: [[8, 2], [8, 8]], armB: [[4, 2], [4, 8]] });
    canv += r1.canv + r2.canv;
    canv += line([[r1.hand[0], r1.hand[1] - 16 * s], [mx - 2 * s, y - 10 * s]], Palette.darkbrown, 2.4 * s);
    canv += line([[r2.hand[0], r2.hand[1] - 26 * s], [r2.hand[0] - 4 * s, r2.hand[1] + 6 * s]], Palette.darkbrown, 2.4 * s);
    return canv;
  };
  this.grinder = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var canv = "";
    var gx = x + 20 * s * dir;
    canv += dot(gx, y - 3 * s, 11 * s, STONE_C, INK(), 1.1);
    canv += dot(gx, y - 5 * s, 7 * s, "#8d8068", INK(), 1);
    canv += line([[gx + 4 * s, y - 5 * s], [gx + 6 * s, y - 20 * s]], Palette.darkbrown, 2 * s);
    var r = rig(x, y, s, dir, { pose: "sit", female: true, armF: [[8, 0], [16, -8]], armB: [[4, 4], [12, 2]] });
    canv += r.canv;
    return canv;
  };
  this.firewood = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "stand", female: true, armF: [[6, -8], [4, -14]], armB: [[-6, 6], [-4, 12]] });
    var canv = r.canv;
    var hx = r.head[0], hy = r.head[1] - 10 * s;
    for (var i = 0; i < 5; i++) canv += line([[hx - 20 * s + i * 2 * s, hy - i * 2.2 * s], [hx + 20 * s - i * 1.5 * s, hy - 2 * s - i * 2.2 * s]], i % 2 ? Palette.darkbrown : Palette.brown, 2.4 * s);
    canv += line([[hx - 8 * s, hy - 12 * s], [hx - 6 * s, hy + 1 * s]], Palette.yellow, 1 * s);
    return canv;
  };
  this.kolamDrawer = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "kneel", female: true, armF: [[10, 10], [20, 20]], armB: [[2, 10], [8, 18]] });
    var canv = r.canv;
    var kx = x + 34 * s * dir, ky = y + 4 * s;
    for (var i = -2; i <= 2; i++) for (var j = -1; j <= 1; j++) canv += dot(kx + i * 4 * s, ky + j * 3 * s, 0.7 * s, Palette.white);
    var lp = [];
    for (var i = 0; i <= 24; i++) { var t = (i / 24) * Math.PI * 2; lp.push([kx + Math.cos(t) * 10 * s * (1 + 0.3 * Math.cos(t * 4)), ky + Math.sin(t) * 4 * s * (1 + 0.3 * Math.cos(t * 4))]); }
    canv += line(lp, Palette.white, 0.9);
    canv += dot(r.hand[0], r.hand[1], 2.2 * s, Palette.white, INK(), 0.6);
    return canv;
  };
  this.motherChild = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "stand", female: true, armF: [[8, 6], [8, 16]], armB: [[-4, 8], [-2, 18]] });
    var canv = r.canv;
    var cx = x + 11 * s * dir, cy = r.hip[1] - 6 * s;
    canv += shape([[cx - 4 * s, cy + 8 * s], [cx + 4 * s, cy + 8 * s], [cx + 3 * s, cy - 2 * s], [cx - 3 * s, cy - 2 * s]], Palette.yellow, INK(), 0.9);
    canv += dot(cx, cy - 6 * s, 4 * s, Figures.SKIN, INK(), 0.9);
    canv += dot(cx - 1.5 * s * dir, cy - 7 * s, 3.2 * s, Palette.black);
    canv += dot(cx + 1.5 * s * dir, cy - 6.5 * s, 0.8 * s, Palette.black);
    return canv;
  };
  this.garlandSeller = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "sit", female: true, armF: [[8, 2], [14, 6]], armB: [[-6, 6], [-2, 12]] });
    var canv = r.canv;
    var bx = x + 26 * s * dir;
    canv += shape([[bx - 12 * s, y], [bx + 12 * s, y], [bx + 10 * s, y - 7 * s], [bx - 10 * s, y - 7 * s]], Palette.brown, INK(), 1);
    var cols = [Palette.white, Palette.orange, Palette.red, Palette.yellow];
    for (var i = 0; i < 18; i++) canv += dot(bx - 9 * s + (i % 6) * 3.6 * s, y - 8 * s - Math.floor(i / 6) * 3 * s, 1.8 * s, cols[i % 4], INK(0.6), 0.5);
    // a garland hung from a pole
    canv += line([[bx + 14 * s, y], [bx + 14 * s, y - 40 * s]], Palette.darkbrown, 1.5 * s);
    var gl = bezmh([[bx + 14 * s, y - 38 * s], [bx + 2 * s, y - 20 * s], [bx + 14 * s, y - 4 * s]], 1);
    for (var i = 0; i < gl.length; i += 3) canv += dot(gl[i][0], gl[i][1], 1.8 * s, i % 2 ? Palette.orange : Palette.white, INK(0.6), 0.5);
    return canv;
  };
  this.dancer = function(x, y, args) {
    // bharatanatyam: bent knees, one arm out, one up, pleated fan
    var a = A(args), s = a.s, dir = a.dir;
    var canv = "";
    var f = function(px) { return x + px * s * dir; };
    var col = Palette.red;
    canv += dot(f(-9), y - 1 * s, 3 * s, Figures.SKIN2, INK(), 0.8);
    canv += dot(f(9), y - 1 * s, 3 * s, Figures.SKIN2, INK(), 0.8);
    canv += shape([[f(-7), y - 30 * s], [f(7), y - 30 * s], [f(13), y - 10 * s], [f(10), y - 3 * s], [f(-10), y - 3 * s], [f(-13), y - 10 * s]], col, INK(), 1.1);
    canv += shape([[f(-4), y - 28 * s], [f(4), y - 28 * s], [f(10), y - 6 * s], [f(-10), y - 6 * s]], Palette.yellow, INK(), 1);
    for (var i = -2; i <= 2; i++) canv += line([[f(i * 1.2), y - 27 * s], [f(i * 4.5), y - 7 * s]], INK(0.6), 0.6);
    canv += shape([[f(-6), y - 46 * s], [f(6), y - 46 * s], [f(6), y - 30 * s], [f(-6), y - 30 * s]], Palette.green, INK(), 1);
    canv += line([[f(-6), y - 45 * s], [f(6), y - 32 * s]], Palette.yellow, 1.2 * s);
    var sx = f(6), sy = y - 44 * s;
    canv += line([[sx, sy], [sx + 14 * s * dir, sy - 2 * s], [sx + 26 * s * dir, sy - 10 * s]], Figures.SKIN, 3 * s);
    canv += line([[f(-6), sy], [f(-14), sy - 10 * s], [f(-10), sy - 24 * s]], Figures.SKIN2, 2.6 * s);
    canv += Figures.head(f(1), y - 55 * s, dir, s, true);
    for (var i = 0; i < 5; i++) canv += dot(f(-3 + i * 1.5), y - 65 * s - i * 0.5 * s, 1.1 * s, Palette.yellow);
    canv += dot(sx + 26 * s * dir, sy - 10 * s, 1.5 * s, Palette.red);
    return canv;
  };
  this.milkmaid = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var canv = Figures.cow(x + 30 * s * dir, y, { sca: s, dir: dir, col: Palette.cream });
    var r = rig(x, y, s, dir, { pose: "kneel", female: true, armF: [[10, 4], [18, 8]], armB: [[4, 6], [12, 10]] });
    canv += r.canv;
    canv += shape([[x + 20 * s * dir - 4 * s, y], [x + 20 * s * dir + 4 * s, y], [x + 20 * s * dir + 3 * s, y - 7 * s], [x + 20 * s * dir - 3 * s, y - 7 * s]], Palette.orange, INK(), 0.9);
    return canv;
  };
  this.feedingHens = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "stand", female: true, armF: [[8, 6], [16, 12]], armB: [[-4, 8], [-2, 18]] });
    var canv = r.canv;
    for (var i = 0; i < 8; i++) canv += dot(x + (18 + Math.random() * 30) * s * dir, y - Math.random() * 10 * s, 0.9 * s, Palette.paleyellow);
    canv += Fauna.hen(x + 30 * s * dir, y + 2, { sca: s, dir: -dir });
    canv += Fauna.hen(x + 44 * s * dir, y, { sca: s * 0.9, dir: dir });
    return canv;
  };
  this.spinner = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "sit", female: true, armF: [[8, 0], [18, -2]], armB: [[-4, 4], [2, 10]] });
    var canv = r.canv;
    var wx = x + 28 * s * dir, wy = y - 10 * s;
    canv += dot(wx, wy, 9 * s, Palette.cream, INK(), 1);
    for (var i = 0; i < 6; i++) { var t = (i / 6) * Math.PI; canv += line([[wx + Math.cos(t) * 9 * s, wy + Math.sin(t) * 9 * s], [wx - Math.cos(t) * 9 * s, wy - Math.sin(t) * 9 * s]], INK(0.6), 0.6); }
    canv += line([[wx, wy + 9 * s], [wx, y]], Palette.darkbrown, 1.5 * s);
    canv += line([[wx, wy - 9 * s], [r.hand[0], r.hand[1]]], INK(0.5), 0.5);
    return canv;
  };

  // ---- deities and sacred images --------------------------------------------
  this.nataraja = function(x, y, args) {
    // the Chola bronze: Shiva dancing within a ring of flames
    var a = A(args), s = a.s;
    var canv = "";
    var cx = x, cy = y - 30 * s;
    var BR = "#7a5a2e", BR2 = "#5a4020";
    canv += shape([[x - 18 * s, y], [x + 18 * s, y], [x + 15 * s, y - 6 * s], [x - 15 * s, y - 6 * s]], BR2, INK(), 1);
    var ring = [];
    for (var i = 0; i <= 36; i++) { var t = (i / 36) * Math.PI * 2; var rr = 26 * s * (1 + 0.08 * (i % 2)); ring.push([cx + Math.cos(t) * rr, cy + Math.sin(t) * rr]); }
    canv += line(ring, BR, 2.2 * s);
    for (var i = 0; i < 18; i++) { var t = (i / 18) * Math.PI * 2; canv += shape([[cx + Math.cos(t - 0.1) * 26 * s, cy + Math.sin(t - 0.1) * 26 * s], [cx + Math.cos(t) * 31 * s, cy + Math.sin(t) * 31 * s], [cx + Math.cos(t + 0.1) * 26 * s, cy + Math.sin(t + 0.1) * 26 * s]], BR, INK(0.7), 0.5); }
    // the dwarf of ignorance under the foot
    canv += dot(cx, cy + 20 * s, 4 * s, BR, INK(), 0.7);
    // standing leg, raised leg, torso, four arms, head with flowing locks
    canv += line([[cx - 2 * s, cy + 16 * s], [cx - 2 * s, cy + 2 * s]], BR, 3 * s);
    canv += line([[cx - 2 * s, cy + 2 * s], [cx + 10 * s, cy + 6 * s], [cx + 14 * s, cy - 2 * s]], BR, 2.8 * s);
    canv += shape([[cx - 6 * s, cy + 3 * s], [cx + 3 * s, cy + 3 * s], [cx + 4 * s, cy - 10 * s], [cx - 7 * s, cy - 10 * s]], BR, INK(), 0.9);
    canv += line([[cx - 4 * s, cy - 8 * s], [cx - 16 * s, cy - 10 * s], [cx - 18 * s, cy - 2 * s]], BR, 2.4 * s);
    canv += line([[cx + 2 * s, cy - 8 * s], [cx + 14 * s, cy - 12 * s]], BR, 2.4 * s);
    canv += line([[cx - 4 * s, cy - 9 * s], [cx - 12 * s, cy - 18 * s]], BR, 2 * s);
    canv += line([[cx + 2 * s, cy - 9 * s], [cx + 10 * s, cy - 20 * s]], BR, 2 * s);
    canv += dot(cx - 12 * s, cy - 18 * s, 2.5 * s, BR2, INK(0.6), 0.5); // drum
    canv += shape([[cx + 10 * s, cy - 20 * s], [cx + 13 * s, cy - 26 * s], [cx + 8 * s, cy - 25 * s]], BR, INK(0.6), 0.5); // flame
    canv += dot(cx - 1.5 * s, cy - 14 * s, 4 * s, BR, INK(), 0.9);
    for (var i = 0; i < 5; i++) canv += line([[cx - 1.5 * s, cy - 16 * s], [cx - 1.5 * s + (i - 2) * 6 * s, cy - 20 * s - Math.abs(i - 2) * -1.5 * s]], BR, 1.2 * s);
    return canv;
  };
  this.pillaiyar = function(x, y, args) {
    // Ganesha under the tree, red with an oil lamp, as at every village corner
    var a = A(args), s = a.s;
    var canv = "";
    canv += shape([[x - 14 * s, y], [x + 14 * s, y], [x + 12 * s, y - 5 * s], [x - 12 * s, y - 5 * s]], STONE_C, INK(), 1);
    var cy = y - 5 * s;
    canv += shape([[x - 11 * s, cy], [x + 11 * s, cy], [x + 10 * s, cy - 12 * s], [x + 6 * s, cy - 20 * s], [x - 6 * s, cy - 20 * s], [x - 10 * s, cy - 12 * s]], Palette.orange, INK(), 1.1);
    canv += dot(x, cy - 24 * s, 7 * s, Palette.orange, INK(), 1);
    canv += dot(x - 8 * s, cy - 24 * s, 4 * s, Palette.orange, INK(), 0.9);
    canv += dot(x + 8 * s, cy - 24 * s, 4 * s, Palette.orange, INK(), 0.9);
    canv += line([[x, cy - 21 * s], [x + 2 * s, cy - 12 * s], [x - 3 * s, cy - 8 * s]], Palette.orange, 3 * s);
    canv += line([[x, cy - 21 * s], [x + 2 * s, cy - 12 * s], [x - 3 * s, cy - 8 * s]], INK(), 0.7);
    canv += dot(x - 2.5 * s, cy - 25 * s, 0.9 * s, Palette.black);
    canv += dot(x + 2.5 * s, cy - 25 * s, 0.9 * s, Palette.black);
    canv += line([[x - 3 * s, cy - 30 * s], [x + 3 * s, cy - 30 * s]], Palette.white, 1.2 * s);
    canv += line([[x - 10 * s, cy - 11 * s], [x + 10 * s, cy - 11 * s]], Palette.yellow, 1 * s);
    canv += shape([[x + 16 * s, y], [x + 22 * s, y], [x + 21 * s, y - 4 * s], [x + 17 * s, y - 4 * s]], Palette.yellow, INK(), 0.7);
    canv += shape([[x + 18 * s, y - 4 * s], [x + 20 * s, y - 4 * s], [x + 19 * s, y - 9 * s]], Palette.orange, INK(0.5), 0.4);
    return canv;
  };
  this.lingam = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = "";
    canv += shape([[x - 14 * s, y], [x + 14 * s, y], [x + 12 * s, y - 6 * s], [x - 12 * s, y - 6 * s]], STONE_C, INK(), 1);
    var av = [];
    for (var i = 0; i <= 12; i++) { var t = (i / 12) * Math.PI * 2; av.push([x + Math.cos(t) * 12 * s, y - 6 * s + Math.sin(t) * 4 * s]); }
    canv += shape(av, "#8d8068", INK(), 1);
    canv += shape([[x - 4 * s, y - 8 * s], [x + 4 * s, y - 8 * s], [x + 4 * s, y - 20 * s], [x - 4 * s, y - 20 * s]], "#5a5048", INK(), 1);
    canv += dot(x, y - 20 * s, 4 * s, "#5a5048", INK(), 1);
    for (var i = -1; i <= 1; i++) canv += line([[x - 4 * s, y - 14 * s + i * 2 * s], [x + 4 * s, y - 14 * s + i * 2 * s]], Palette.white, 0.8 * s);
    for (var i = 0; i < 4; i++) canv += dot(x - 3 * s + i * 2 * s, y - 22 * s - (i % 2) * 1.5 * s, 1.2 * s, i % 2 ? Palette.white : Palette.orange);
    canv += line([[x + 12 * s, y - 6 * s], [x + 16 * s, y - 2 * s]], INK(0.6), 0.7); // spout
    return canv;
  };
  this.murugan = function(x, y, args) {
    // Murugan with the vel, on a shrine base
    var a = A(args), s = a.s, dir = a.dir;
    var canv = "";
    canv += shape([[x - 14 * s, y], [x + 14 * s, y], [x + 12 * s, y - 6 * s], [x - 12 * s, y - 6 * s]], STONE_C, INK(), 1);
    var r = rig(x, y - 6 * s, s * 0.8, dir, { pose: "stand", armF: [[8, -4], [12, -12]], armB: [[-6, 8], [-4, 16]], col: Palette.yellow, zari: true, bare: true });
    canv += r.canv;
    canv += line([[r.hand[0], y], [r.hand[0], r.head[1] - 24 * s]], Palette.yellow, 1.6 * s);
    canv += shape([[r.hand[0], r.head[1] - 32 * s], [r.hand[0] + 3.5 * s, r.head[1] - 22 * s], [r.hand[0] - 3.5 * s, r.head[1] - 22 * s]], Palette.yellow, INK(), 0.8);
    canv += dot(r.head[0], r.head[1] - 9 * s, 5 * s, Palette.yellow, INK(), 0.9);
    for (var i = 0; i < 7; i++) { var t = Math.PI * 1.1 + (i / 6) * Math.PI * 0.8; canv += line([[r.head[0], r.head[1]], [r.head[0] + Math.cos(t) * 16 * s, r.head[1] + Math.sin(t) * 16 * s]], Palette.yellow, 1 * s); }
    return canv;
  };
  this.nagakal = function(x, y, args) {
    // serpent stones set beneath a tree
    var a = A(args), s = a.s;
    var canv = "";
    for (var k = 0; k < 3; k++) {
      var sx = x + (k - 1) * 14 * s, h = (22 + (k == 1 ? 6 : 0)) * s;
      canv += shape([[sx - 5 * s, y], [sx + 5 * s, y], [sx + 5 * s, y - h], [sx, y - h - 4 * s], [sx - 5 * s, y - h]], STONE_C, INK(), 1);
      var sn = [];
      for (var i = 0; i <= 10; i++) sn.push([sx + Math.sin(i * 1.2) * 2.5 * s, y - 3 * s - (i / 10) * (h - 8 * s)]);
      canv += line(sn, "#8d8068", 1.6 * s);
      canv += dot(sx, y - h + 3 * s, 2 * s, "#8d8068", INK(0.6), 0.5);
      canv += line([[sx - 3 * s, y - 2 * s], [sx + 3 * s, y - 2 * s]], Palette.red, 1 * s);
    }
    return canv;
  };

  // ---- more occupations and scenes ------------------------------------------
  this.fisherman = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "sit", armF: [[8, 0], [16, -6]], armB: [[4, 2], [12, 0]] });
    var canv = r.canv;
    canv += line([[r.hand[0], r.hand[1]], [r.hand[0] + 40 * s * dir, r.hand[1] - 26 * s]], Palette.darkbrown, 1.3 * s);
    canv += line([[r.hand[0] + 40 * s * dir, r.hand[1] - 26 * s], [r.hand[0] + 46 * s * dir, r.hand[1] + 10 * s]], INK(0.6), 0.6);
    canv += shape([[x - 22 * s * dir, y], [x - 14 * s * dir, y], [x - 15 * s * dir, y - 8 * s], [x - 21 * s * dir, y - 8 * s]], Palette.brown, INK(), 0.9);
    return canv;
  };
  this.punter = function(x, y, args) {
    // a flat boat poled along the river
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = shape([[f(-30), y - 6], [f(30), y - 6], [f(36), y - 14 * s], [f(26), y - 12 * s], [f(-26), y - 12 * s], [f(-34), y - 15 * s]], Palette.darkbrown, INK(), 1.1);
    canv += line([[f(-26), y - 9 * s], [f(26), y - 9 * s]], Palette.yellow, 1 * s);
    var r = rig(f(14), y - 12 * s, s * 0.8, dir, { pose: "stand", armF: [[8, -8], [10, -20]], armB: [[-4, 4], [6, 10]] });
    canv += r.canv;
    canv += line([[r.hand[0], r.hand[1] - 20 * s], [r.hand[0] + 6 * s * dir, y + 10 * s]], Palette.darkbrown, 1.6 * s);
    for (var i = 0; i < 3; i++) canv += shape([[f(-20 + i * 10), y - 12 * s], [f(-14 + i * 10), y - 12 * s], [f(-15 + i * 10), y - 20 * s], [f(-19 + i * 10), y - 20 * s]], Palette.orange, INK(), 0.7);
    return canv;
  };
  this.silambam = function(x, y, args) {
    // two men sparring with long staffs
    var a = A(args), s = a.s;
    var r1 = rig(x - 22 * s, y, s, 1, { pose: "stand", armF: [[10, -6], [18, -14]], armB: [[-4, 10], [6, 14]], bare: true });
    var r2 = rig(x + 22 * s, y + 2, s, -1, { pose: "stand", armF: [[10, -2], [18, -16]], armB: [[-4, 10], [6, 14]], bare: true });
    var canv = r1.canv + r2.canv;
    canv += line([[r1.hand[0] - 20 * s, r1.hand[1] + 26 * s], [r1.hand[0] + 24 * s, r1.hand[1] - 20 * s]], Palette.yellow, 2.2 * s);
    canv += line([[r2.hand[0] + 22 * s, r2.hand[1] + 24 * s], [r2.hand[0] - 22 * s, r2.hand[1] - 22 * s]], Palette.yellow, 2.2 * s);
    return canv;
  };
  this.kolattam = function(x, y, args) {
    // women dancing in a ring with short sticks
    var a = A(args), s = a.s;
    var canv = "";
    var cols = [Palette.red, Palette.green, Palette.indigo, Palette.orange];
    for (var i = 0; i < 4; i++) {
      var dir = i % 2 ? -1 : 1;
      var r = rig(x + (i - 1.5) * 26 * s, y + (i % 2) * 4 * s, s, dir, { pose: "stand", female: true, col: cols[i], armF: [[10, -8], [16, -18]], armB: [[-6, 6], [2, -4]] });
      canv += r.canv;
      canv += line([[r.hand[0] - 4 * s * dir, r.hand[1] + 4 * s], [r.hand[0] + 6 * s * dir, r.hand[1] - 8 * s]], Palette.red, 1.8 * s);
      canv += line([[r.handB[0] - 4 * s * dir, r.handB[1] + 4 * s], [r.handB[0] + 5 * s * dir, r.handB[1] - 8 * s]], Palette.red, 1.8 * s);
    }
    return canv;
  };
  this.karagattam = function(x, y, args) {
    // dancer balancing a decorated pot on her head
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "stand", female: true, col: Palette.green, armF: [[12, -4], [20, -16]], armB: [[-10, 2], [-18, -10]] });
    var canv = r.canv;
    var hx = r.head[0], hy = r.head[1] - 10 * s;
    canv += shape([[hx - 7 * s, hy], [hx + 7 * s, hy], [hx + 8 * s, hy - 10 * s], [hx + 5 * s, hy - 16 * s], [hx - 5 * s, hy - 16 * s], [hx - 8 * s, hy - 10 * s]], Palette.orange, INK(), 1);
    for (var i = -2; i <= 2; i++) canv += dot(hx + i * 3 * s, hy - 18 * s - Math.abs(i) * -1.5 * s, 1.8 * s, [Palette.red, Palette.white, Palette.yellow][Math.abs(i) % 3], INK(0.5), 0.4);
    var pl = [];
    for (var i = 0; i <= 10; i++) { var t = Math.PI + (i / 10) * Math.PI; pl.push([hx + Math.cos(t) * 9 * s, hy - 24 * s + Math.sin(t) * 10 * s]); }
    canv += shape(pl, Palette.green, INK(), 0.9);
    canv += dot(hx, hy - 34 * s, 2 * s, Palette.red);
    return canv;
  };
  this.jallikattu = function(x, y, args) {
    // the bull let loose, men trying for the hump
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = "";
    canv += Figures.cow(f(0), y, { sca: s * 1.15, dir: dir, col: Palette.cream });
    var r = rig(f(-34), y + 2, s, dir, { pose: "stand", armF: [[12, -12], [24, -18]], armB: [[8, -10], [20, -16]], bare: true });
    canv += r.canv;
    canv += rig(f(60), y, s, -dir, { pose: "stand", armF: [[10, -6], [18, -14]], armB: [[-6, 8], [-4, 14]], bare: true }).canv;
    canv += rig(f(-70), y + 4, s, dir, { pose: "stand", armF: [[8, -10], [10, -22]], armB: [[-6, 8], [-4, 14]], bare: true }).canv;
    for (var i = 0; i < 8; i++) canv += dot(f(-20 + Math.random() * 60), y + 2 + Math.random() * 4, 1.2 * s, Palette.paleyellow);
    canv += line([[f(26), y - 36 * s], [f(32), y - 44 * s]], Palette.red, 1.4 * s); // ribbon on the horns
    return canv;
  };
  this.oilPress = function(x, y, args) {
    // chekku: a bullock circling the wooden mortar
    var a = A(args), s = a.s, dir = a.dir;
    var canv = "";
    canv += shape([[x - 12 * s, y], [x + 12 * s, y], [x + 10 * s, y - 22 * s], [x - 10 * s, y - 22 * s]], Palette.darkbrown, INK(), 1.1);
    canv += line([[x, y - 22 * s], [x, y - 40 * s]], Palette.brown, 2.5 * s);
    canv += line([[x, y - 36 * s], [x + 44 * s * dir, y - 20 * s]], Palette.brown, 2.2 * s);
    canv += Figures.cow(x + 56 * s * dir, y + 2, { sca: s * 0.85, dir: dir, col: Palette.white });
    canv += Figures.man(x + 24 * s * dir, y + 4, { sca: s * 0.75, dir: dir, prop: "stick" });
    canv += shape([[x - 20 * s, y], [x - 14 * s, y], [x - 15 * s, y - 8 * s], [x - 19 * s, y - 8 * s]], Palette.orange, INK(), 0.8);
    return canv;
  };
  this.dhobi = function(x, y, args) {
    // washerman beating cloth on a stone, washing spread to dry
    var a = A(args), s = a.s, dir = a.dir;
    var canv = "";
    canv += shape([[x + 10 * s * dir, y], [x + 26 * s * dir, y], [x + 24 * s * dir, y - 8 * s], [x + 12 * s * dir, y - 8 * s]], STONE_C, INK(), 1);
    var r = rig(x, y, s, dir, { pose: "bend", armF: [[10, -16], [22, -22]], armB: [[8, -14], [20, -20]], bare: true });
    canv += r.canv;
    canv += shape([[r.hand[0] - 4 * s, r.hand[1]], [r.hand[0] + 4 * s, r.hand[1]], [r.hand[0] + 2 * s, r.hand[1] + 10 * s], [r.hand[0] - 6 * s, r.hand[1] + 8 * s]], Palette.white, INK(), 0.8);
    var cols = [Palette.white, Palette.red, Palette.yellow, Palette.green];
    for (var i = 0; i < 4; i++) canv += shape([[x - 20 * s * dir - i * 14 * s * dir, y + 1], [x - 32 * s * dir - i * 14 * s * dir, y + 1], [x - 30 * s * dir - i * 14 * s * dir, y - 4 * s], [x - 22 * s * dir - i * 14 * s * dir, y - 4 * s]], cols[i], INK(0.6), 0.6);
    return canv;
  };
  this.threshing = function(x, y, args) {
    // bullocks treading the harvest round a post
    var a = A(args), s = a.s, dir = a.dir;
    var canv = "";
    var pl = [];
    for (var i = 0; i <= 16; i++) { var t = (i / 16) * Math.PI * 2; pl.push([x + Math.cos(t) * 48 * s, y - 2 * s + Math.sin(t) * 14 * s]); }
    canv += shape(pl, Palette.paleyellow, INK(0.7), 1);
    for (var i = 0; i < 24; i++) canv += line([[x + (Math.random() - 0.5) * 80 * s, y - 2 * s + (Math.random() - 0.5) * 20 * s], [x + (Math.random() - 0.5) * 80 * s, y - 2 * s + (Math.random() - 0.5) * 20 * s]], Palette.yellow, 0.7);
    canv += line([[x, y], [x, y - 30 * s]], Palette.darkbrown, 2.5 * s);
    canv += Figures.cow(x + 26 * s * dir, y - 4 * s, { sca: s * 0.8, dir: dir, col: Palette.cream });
    canv += Figures.cow(x - 30 * s * dir, y + 2 * s, { sca: s * 0.85, dir: -dir, col: Palette.brown });
    canv += line([[x, y - 24 * s], [x + 26 * s * dir, y - 20 * s]], INK(), 0.8);
    canv += Figures.man(x + 54 * s * dir, y + 4, { sca: s * 0.8, dir: -dir, prop: "stick" });
    return canv;
  };
  this.school = function(x, y, args) {
    // a teacher under a tree with children seated before him
    var a = A(args), s = a.s, dir = a.dir;
    var canv = Flora.neem(x - 30 * s * dir, y - 10 * s, { sca: s * 0.9 });
    var r = rig(x, y, s, dir, { pose: "sit", armF: [[8, -4], [16, -12]], armB: [[-6, 6], [-4, 12]], zari: true });
    canv += r.canv;
    canv += line([[r.hand[0], r.hand[1]], [r.hand[0] + 4 * s * dir, r.hand[1] - 14 * s]], Palette.darkbrown, 1.2 * s);
    for (var i = 0; i < 4; i++) canv += rig(x + (24 + i * 16) * s * dir, y + (i % 2) * 4 * s, s * 0.55, -dir, { pose: "sit", female: i % 2 == 1, armF: [[6, 4], [10, 8]], armB: [[-4, 4], [0, 8]] }).canv;
    canv += shape([[x + 10 * s * dir, y - 2 * s], [x + 20 * s * dir, y - 2 * s], [x + 20 * s * dir, y + 1], [x + 10 * s * dir, y + 1]], Palette.yellow, INK(), 0.6); // palm leaf
    return canv;
  };
  this.swimmers = function(x, y, args) {
    // heads and arms above the water, splashes
    var a = A(args), s = a.s;
    var canv = "";
    for (var i = 0; i < 3; i++) {
      var sx = x + (i - 1) * 18 * s, sy = y + (i % 2) * 3 * s;
      var dir = i % 2 ? -1 : 1;
      canv += line([[sx - 8 * s * dir, sy - 2 * s], [sx - 3 * s * dir, sy - 10 * s]], Figures.SKIN, 2.6 * s);
      canv += Figures.head(sx, sy - 4 * s, dir, s * 0.8, false);
      for (var j = 0; j < 4; j++) canv += line([[sx - 12 * s + j * 7 * s, sy + 2 * s], [sx - 9 * s + j * 7 * s, sy + 1 * s]], Palette.cream, 1.2);
      canv += dot(sx + 10 * s * dir, sy - 6 * s, 1.2 * s, Palette.white);
    }
    return canv;
  };
  this.sadhu = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "sit", col: Palette.orange, armF: [[8, 8], [8, 14]], armB: [[-6, 8], [-6, 14]], bare: true });
    var canv = r.canv;
    canv += shape([[r.head[0] - 8 * s, r.head[1] - 6 * s], [r.head[0] + 6 * s, r.head[1] - 6 * s], [r.head[0] + 4 * s, r.head[1] - 18 * s], [r.head[0] - 6 * s, r.head[1] - 16 * s]], Palette.darkbrown, INK(), 0.9);
    canv += shape([[r.head[0] + 4 * s * dir, r.head[1] + 4 * s], [r.head[0] + 9 * s * dir, r.head[1] + 5 * s], [r.head[0] + 7 * s * dir, r.head[1] + 16 * s], [r.head[0] + 1 * s * dir, r.head[1] + 10 * s]], Palette.white, INK(0.7), 0.6);
    for (var i = -1; i <= 1; i++) canv += line([[r.head[0] + i * 1.6 * s, r.head[1] - 7 * s], [r.head[0] + i * 1.6 * s, r.head[1] - 3 * s]], Palette.white, 0.8 * s);
    canv += line([[x - 18 * s * dir, y], [x - 18 * s * dir, y - 40 * s]], Palette.darkbrown, 1.4 * s);
    canv += line([[x - 22 * s * dir, y - 36 * s], [x - 22 * s * dir, y - 44 * s]], INK(), 1.3 * s);
    canv += line([[x - 18 * s * dir, y - 40 * s], [x - 18 * s * dir, y - 46 * s]], INK(), 1.3 * s);
    canv += line([[x - 14 * s * dir, y - 36 * s], [x - 14 * s * dir, y - 44 * s]], INK(), 1.3 * s);
    return canv;
  };
  this.lampWoman = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "stand", female: true, armF: [[8, 6], [14, 2]], armB: [[-4, 8], [4, 4]] });
    var canv = r.canv;
    var hx = r.hand[0], hy = r.hand[1];
    canv += shape([[hx - 6 * s, hy], [hx + 6 * s, hy], [hx + 4 * s, hy - 4 * s], [hx - 4 * s, hy - 4 * s]], Palette.yellow, INK(), 0.9);
    for (var i = -1; i <= 1; i++) canv += shape([[hx + i * 3 * s - 1.2 * s, hy - 4 * s], [hx + i * 3 * s + 1.2 * s, hy - 4 * s], [hx + i * 3 * s, hy - 9 * s]], Palette.orange, INK(0.5), 0.4);
    return canv;
  };
  this.umbrellaWalker = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "stand", armF: [[8, -2], [8, -14]], armB: [[-6, 8], [-4, 16]] });
    var canv = r.canv;
    var ux = r.hand[0], uy = r.hand[1] - 20 * s;
    canv += line([[r.hand[0], r.hand[1]], [ux, uy]], Palette.darkbrown, 1.2 * s);
    var um = [];
    for (var i = 0; i <= 12; i++) { var t = Math.PI + (i / 12) * Math.PI; um.push([ux + Math.cos(t) * 22 * s, uy + Math.sin(t) * 9 * s]); }
    canv += shape(um, Palette.black, INK(), 1);
    for (var i = 1; i < 6; i++) canv += line([[ux, uy - 9 * s], [ux - 22 * s + i * 7.3 * s, uy]], INK(0.5), 0.6);
    return canv;
  };
  this.pallanguzhi = function(x, y, args) {
    // two women at the board game of pits and seeds
    var a = A(args), s = a.s;
    var canv = "";
    canv += rig(x - 18 * s, y, s, 1, { pose: "sit", female: true, armF: [[8, 6], [16, 10]], armB: [[-4, 6], [2, 10]] }).canv;
    canv += rig(x + 18 * s, y + 2, s, -1, { pose: "sit", female: true, armF: [[8, 6], [16, 10]], armB: [[-4, 6], [2, 10]] }).canv;
    canv += shape([[x - 12 * s, y - 2 * s], [x + 12 * s, y - 2 * s], [x + 12 * s, y - 7 * s], [x - 12 * s, y - 7 * s]], Palette.darkbrown, INK(), 0.9);
    for (var i = 0; i < 7; i++) for (var j = 0; j < 2; j++) canv += dot(x - 9 * s + i * 3 * s, y - 3.5 * s - j * 2 * s, 0.7 * s, Palette.yellow);
    return canv;
  };
  this.mahoutBath = function(x, y, args) {
    // an elephant lying in the river, scrubbed by its mahout
    var a = A(args), s = a.s, dir = a.dir;
    var f = function(px) { return x + px * s * dir; };
    var canv = "";
    var col = "#6a6670";
    var body = [];
    for (var i = 0; i <= 16; i++) { var t = Math.PI + (i / 16) * Math.PI; body.push([f(Math.cos(t) * 40), y - 2 * s + Math.sin(t) * 24 * s]); }
    canv += shape(body, col, INK(), 1.2);
    canv += dot(f(44), y - 10 * s, 12 * s, col, INK(), 1.1);
    canv += shape([[f(36), y - 20 * s], [f(28), y - 16 * s], [f(30), y - 4 * s], [f(40), y - 6 * s]], "#5c5862", INK(), 1);
    canv += line(bezmh([[f(54), y - 6 * s], [f(66), y - 2 * s], [f(62), y + 2 * s]], 1), col, 5 * s);
    canv += Figures.eye(f(48), y - 12 * s, dir, s * 0.8);
    for (var j = 0; j < 5; j++) canv += line([[f(-40 + j * 20), y + 2 * s], [f(-32 + j * 20), y + 1 * s]], Palette.cream, 1.3);
    var r = rig(f(-6), y - 24 * s, s * 0.75, dir, { pose: "kneel", armF: [[10, 6], [18, 12]], armB: [[4, 6], [12, 12]] });
    canv += r.canv;
    return canv;
  };
  this.snakeCharmer = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var r = rig(x, y, s, dir, { pose: "sit", col: Palette.orange, armF: [[8, 0], [14, -4]], armB: [[4, 0], [12, -4]] });
    var canv = r.canv;
    canv += dot(r.head[0] - 1 * s * dir, r.head[1] - 8 * s, 6 * s, Palette.red, INK(), 1);
    canv += line([[r.head[0] + 4 * s * dir, r.head[1] + 4 * s], [r.hand[0] + 10 * s * dir, r.hand[1] + 4 * s]], Palette.yellow, 2.4 * s);
    canv += dot(r.head[0] + 9 * s * dir, r.head[1] + 4 * s, 2.5 * s, Palette.brown, INK(), 0.7);
    var bx = x + 30 * s * dir;
    canv += shape([[bx - 9 * s, y], [bx + 9 * s, y], [bx + 8 * s, y - 7 * s], [bx - 8 * s, y - 7 * s]], Palette.brown, INK(), 0.9);
    canv += Fauna.cobra(bx - 4 * s * dir, y - 7 * s, { sca: s * 0.9, dir: -dir });
    return canv;
  };
  this.barber = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var canv = rig(x, y, s, dir, { pose: "sit", armF: [[8, 8], [8, 14]], armB: [[-6, 8], [-6, 14]] }).canv;
    var r = rig(x - 16 * s * dir, y + 2, s, dir, { pose: "stand", armF: [[8, -2], [18, -18]], armB: [[4, 4], [12, -6]] });
    canv += r.canv;
    canv += line([[r.hand[0], r.hand[1]], [r.hand[0] + 4 * s * dir, r.hand[1] - 4 * s]], Palette.cream, 1.6 * s);
    canv += dot(x + 2 * s * dir, y - 10 * s, 3 * s, Palette.cream, INK(), 0.6); // mirror
    return canv;
  };
  this.cockfight = function(x, y, args) {
    var a = A(args), s = a.s;
    var canv = Fauna.hen(x - 8 * s, y, { sca: s, dir: 1, rooster: true });
    canv += Fauna.hen(x + 8 * s, y + 1, { sca: s, dir: -1, rooster: true });
    canv += rig(x - 34 * s, y + 2, s, 1, { pose: "sit", armF: [[8, 2], [14, 6]], armB: [[-6, 6], [-4, 12]] }).canv;
    canv += rig(x + 34 * s, y + 2, s, -1, { pose: "sit", armF: [[8, 2], [14, 6]], armB: [[-6, 6], [-4, 12]] }).canv;
    canv += rig(x + 2 * s, y - 14 * s, s * 0.9, 1, { pose: "stand", armF: [[8, -6], [10, -16]], armB: [[-6, 6], [-4, 12]] }).canv;
    return canv;
  };
  this.wedding = function(x, y, args) {
    // bride and groom under a thatched pandal with a musician
    var a = A(args), s = a.s;
    var canv = "";
    for (var e = -1; e <= 1; e += 2) canv += line([[x + e * 44 * s, y], [x + e * 44 * s, y - 70 * s]], Palette.darkbrown, 2.2 * s);
    canv += shape([[x - 50 * s, y - 70 * s], [x + 50 * s, y - 70 * s], [x + 46 * s, y - 62 * s], [x - 46 * s, y - 62 * s]], Palette.yellow, INK(), 1.1);
    for (var i = 0; i < 12; i++) canv += line([[x - 46 * s + i * 8.4 * s, y - 62 * s], [x - 44 * s + i * 8.4 * s, y - 62 * s]], Palette.green, 3 * s);
    for (var i = 0; i < 2; i++) canv += line([[x - 44 * s, y - 60 * s + i * 2 * s], [x + 44 * s, y - 60 * s + i * 2 * s]], i ? Palette.red : Palette.white, 1.2 * s);
    canv += rig(x - 12 * s, y, s, 1, { pose: "sit", zari: true, armF: [[8, 4], [14, 8]], armB: [[-6, 6], [-4, 12]] }).canv;
    var r = rig(x + 12 * s, y, s, -1, { pose: "sit", female: true, col: Palette.red, armF: [[8, 4], [12, 8]], armB: [[-6, 6], [-4, 12]] });
    canv += r.canv;
    for (var i = 0; i < 6; i++) canv += dot(x - 12 * s + (i % 2) * 24 * s, y - 24 * s + Math.floor(i / 2) * 3 * s, 1.6 * s, i % 2 ? Palette.orange : Palette.white, INK(0.5), 0.4);
    canv += shape([[x - 6 * s, y - 2 * s], [x + 6 * s, y - 2 * s], [x + 5 * s, y - 8 * s], [x - 5 * s, y - 8 * s]], Palette.orange, INK(), 0.8); // fire
    canv += shape([[x - 3 * s, y - 8 * s], [x + 3 * s, y - 8 * s], [x, y - 15 * s]], Palette.yellow, INK(0.4), 0.4);
    canv += this.nadaswaram(x + 44 * s, y + 4, { sca: s * 0.85, dir: -1 });
    canv += this.thavil(x + 64 * s, y + 6, { sca: s * 0.85, dir: -1 });
    return canv;
  };
  this.coconutClimber = function(x, y, args) {
    var a = A(args), s = a.s, dir = a.dir;
    var canv = Trees.coconut(x, y, { sca: s });
    var r = rig(x + 8 * s * dir, y - 90 * s, s * 0.85, dir, { pose: "stand", armF: [[-6, -12], [-12, -22]], armB: [[-2, -12], [-8, -22]] });
    canv += r.canv;
    canv += line([[x - 8 * s, y - 118 * s], [x + 8 * s, y - 108 * s]], Palette.darkbrown, 1.4 * s);
    canv += dot(x + 20 * s * dir, y - 20 * s, 4 * s, Palette.lightgreen, INK(), 0.8);
    canv += dot(x + 28 * s * dir, y - 10 * s, 4 * s, Palette.yellow, INK(), 0.8);
    return canv;
  };
}();
