// Built things: gopuram, thatched hut, kattumaram, Ayyanar horse.
var Arch = new function() {
  // kudu: horseshoe arch motif on a tier
  function kudu(x, y, s) {
    var pts = [];
    for (var i = 0; i <= 10; i++) {
      var t = Math.PI + (i / 10) * Math.PI;
      pts.push([x + Math.cos(t) * 4 * s, y + Math.sin(t) * 5 * s]);
    }
    return shape(pts, Palette.darkred, INK(), 0.8);
  }

  // Dravidian gopuram: a stone base, tiers shrinking upward, a barrel
  // vaulted roof with a row of kalasam finials
  this.gopuram = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var tiers = args.tiers || 3 + Math.floor(Math.random() * 4);
    var canv = "";
    var W = 70 * s;
    var baseH = 46 * s;
    // base storey
    canv += shape([[x - W / 2, y], [x + W / 2, y], [x + W / 2 - 2 * s, y - baseH], [x - W / 2 + 2 * s, y - baseH]], Palette.cream, INK(), 1.3);
    canv += shape([[x - 7 * s, y], [x + 7 * s, y], [x + 7 * s, y - baseH * 0.7], [x - 7 * s, y - baseH * 0.7]], Palette.black, INK(), 1); // gateway
    canv += line([[x - W / 2, y - baseH * 0.22], [x + W / 2, y - baseH * 0.22]], Palette.red, 2.5 * s);
    canv += line([[x - W / 2, y - baseH * 0.5], [x + W / 2, y - baseH * 0.5]], Palette.red, 2 * s);
    for (var i = -2; i <= 2; i++) if (i != 0) canv += line([[x + i * 13 * s, y - baseH * 0.25], [x + i * 13 * s, y - baseH * 0.75]], INK(0.7), 1);
    var cy = y - baseH;
    var cw = W * 0.92;
    var th = 18 * s;
    for (var t = 0; t < tiers; t++) {
      var nw = cw * 0.86;
      canv += shape([[x - cw / 2, cy], [x + cw / 2, cy], [x + nw / 2, cy - th], [x - nw / 2, cy - th]], t % 2 ? Palette.yellow : Palette.cream, INK(), 1.2);
      canv += line([[x - cw / 2, cy - 2 * s], [x + cw / 2, cy - 2 * s]], Palette.red, 2 * s);
      var nk = Math.max(1, Math.floor(nw / (14 * s)));
      for (var k = 0; k < nk; k++) {
        var kx = x + ((k + 0.5) / nk - 0.5) * nw * 0.9;
        canv += kudu(kx, cy - th * 0.35, s * 0.9);
      }
      // painted stucco figures between the kudus
      for (var k = 0; k <= nk; k++) {
        var fx = x + (k / nk - 0.5) * nw * 0.9;
        if (Math.abs(fx - x) > nw / 2 - 3 * s) continue;
        var fc = [Palette.green, Palette.red, Palette.blue, Palette.orange][(k + t) % 4];
        canv += shape([[fx - 2 * s, cy - 3 * s], [fx + 2 * s, cy - 3 * s], [fx + 1.6 * s, cy - th * 0.7], [fx - 1.6 * s, cy - th * 0.7]], fc, INK(0.8), 0.6);
        canv += dot(fx, cy - th * 0.75, 1.5 * s, "#9a5a34", INK(0.8), 0.5);
      }
      // cornice
      canv += shape([[x - nw / 2 - 3 * s, cy - th], [x + nw / 2 + 3 * s, cy - th], [x + nw / 2, cy - th - 4 * s], [x - nw / 2, cy - th - 4 * s]], Palette.red, INK(), 1);
      cy -= th + 4 * s;
      cw = nw;
      th *= 0.92;
    }
    // sala roof: elongated barrel vault
    var rh = 16 * s;
    var pts = [];
    for (var i = 0; i <= 16; i++) {
      var t = Math.PI + (i / 16) * Math.PI;
      pts.push([x + Math.cos(t) * cw * 0.5, cy + Math.sin(t) * rh]);
    }
    canv += shape(pts, Palette.yellow, INK(), 1.3);
    canv += line([[x - cw * 0.5, cy - rh * 0.5], [x + cw * 0.5, cy - rh * 0.5]], Palette.red, 1.5 * s);
    // kalasams
    var nk = Math.max(3, Math.floor(cw / (9 * s)));
    for (var k = 0; k < nk; k++) {
      var kx = x + ((k + 0.5) / nk - 0.5) * cw * 0.85;
      var ky = cy - rh * Math.sqrt(Math.max(0, 1 - Math.pow(((k + 0.5) / nk - 0.5) * 1.7, 2)));
      canv += dot(kx, ky - 3 * s, 2.4 * s, Palette.yellow, INK(), 0.9);
      canv += line([[kx, ky - 5 * s], [kx, ky - 10 * s]], INK(), 1.2 * s);
    }
    return canv;
  };

  // mud walled hut with a steep thatched roof
  this.hut = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var canv = "";
    var W = 50 * s, H = 22 * s, R = 26 * s;
    canv += shape([[x - W / 2, y], [x + W / 2, y], [x + W / 2, y - H], [x - W / 2, y - H]], Palette.orange, INK(), 1.2);
    canv += shape([[x - 6 * s, y], [x + 6 * s, y], [x + 6 * s, y - H * 0.8], [x - 6 * s, y - H * 0.8]], Palette.black, INK(), 1);
    canv += line([[x - W / 2, y - 3 * s], [x + W / 2, y - 3 * s]], Palette.white, 1.5 * s); // lime band
    // kolam drawn at the threshold
    for (var i = -1; i <= 1; i++) for (var j = 0; j < 3; j++) canv += dot(x + i * 4 * s, y + 3 * s + j * 2.5 * s, 0.6 * s, Palette.white);
    canv += line([[x - 6 * s, y + 5.5 * s], [x, y + 1.5 * s], [x + 6 * s, y + 5.5 * s], [x, y + 9.5 * s], [x - 6 * s, y + 5.5 * s]], Palette.white, 0.8);
    // roof
    var roof = [[x - W / 2 - 8 * s, y - H + 2 * s], [x + W / 2 + 8 * s, y - H + 2 * s], [x + 4 * s, y - H - R], [x - 4 * s, y - H - R]];
    canv += shape(roof, Palette.yellow, INK(), 1.3);
    for (var i = 1; i < 5; i++) {
      var t = i / 5;
      canv += line([[x - W / 2 - 8 * s + t * 8 * s, y - H + 2 * s - t * R * 0.9], [x + W / 2 + 8 * s - t * 8 * s, y - H + 2 * s - t * R * 0.9]], Palette.brown, 1);
    }
    for (var i = 0; i < 9; i++) {
      var t = (i + 0.5) / 9;
      canv += tick(x - W / 2 - 6 * s + t * (W + 12 * s), y - H + 2 * s, 0, 5 * s, Palette.brown, 1);
    }
    return canv;
  };

  // kattumaram: three lashed logs with a raised bow, fisherman paddling
  this.kattumaram = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var dir = args.dir || 1;
    var canv = "";
    var f = function(px) { return x + px * dir; };
    for (var i = 0; i < 3; i++) {
      var oy = y - i * 3 * s;
      var pts = [[f(-30 * s), oy], [f(26 * s), oy], [f(38 * s), oy - 10 * s - i * 2 * s], [f(36 * s), oy - 13 * s - i * 2 * s], [f(22 * s), oy - 4 * s], [f(-30 * s), oy - 4 * s]];
      canv += shape(pts, i == 1 ? Palette.brown : Palette.darkbrown, INK(), 1.1);
    }
    for (var i = 0; i < 3; i++) {
      var lx = f((-20 + i * 18) * s);
      canv += line([[lx, y + 1 * s], [lx, y - 11 * s]], Palette.cream, 1.3 * s);
    }
    canv += Figures.man(f(-6 * s), y - 8 * s, { sca: s * 0.7, dir: dir, prop: "paddle" });
    return canv;
  };

  // Ayyanar's terracotta horse, the village guardian's mount
  this.horse = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var dir = args.dir || 1;
    var canv = "";
    var f = function(px) { return x + px * dir; };
    var col = Palette.orange;
    // plinth
    canv += shape([[f(-30 * s), y], [f(30 * s), y], [f(28 * s), y - 6 * s], [f(-28 * s), y - 6 * s]], Palette.cream, INK(), 1.1);
    var by = y - 6 * s;
    for (var i = 0; i < 4; i++) {
      var lx = f([-16, -10, 10, 16][i] * s);
      canv += line([[lx, by - 22 * s], [lx, by]], col, 3.5 * s);
      canv += line([[lx, by - 22 * s], [lx, by]], INK(), 0.7);
    }
    canv += shape([[f(-20 * s), by - 20 * s], [f(20 * s), by - 20 * s], [f(22 * s), by - 34 * s], [f(-22 * s), by - 32 * s]], col, INK(), 1.2);
    // arched neck and head
    canv += shape([[f(16 * s), by - 34 * s], [f(24 * s), by - 34 * s], [f(30 * s), by - 56 * s], [f(22 * s), by - 58 * s]], col, INK(), 1.2);
    canv += shape([[f(22 * s), by - 58 * s], [f(30 * s), by - 56 * s], [f(40 * s), by - 50 * s], [f(38 * s), by - 45 * s], [f(26 * s), by - 48 * s]], col, INK(), 1.2);
    canv += line([[f(23 * s), by - 58 * s], [f(19 * s), by - 64 * s]], INK(), 1.4 * s);
    canv += line([[f(27 * s), by - 58 * s], [f(26 * s), by - 65 * s]], INK(), 1.4 * s);
    canv += dot(f(32 * s), by - 52 * s, 1.4 * s, Palette.black);
    // mane, garland, and saddle cloth
    for (var i = 0; i < 5; i++) canv += line([[f((17 + i * 2) * s), by - (36 + i * 5) * s], [f((12 + i * 2) * s), by - (38 + i * 5) * s]], Palette.black, 1.6 * s);
    canv += line([[f(-14 * s), by - 24 * s], [f(14 * s), by - 24 * s]], Palette.white, 1.4 * s);
    canv += shape([[f(-8 * s), by - 32 * s], [f(8 * s), by - 32 * s], [f(8 * s), by - 24 * s], [f(-8 * s), by - 24 * s]], Palette.red, INK(), 1);
    canv += line(bezmh([[f(-22 * s), by - 32 * s], [f(-30 * s), by - 24 * s], [f(-26 * s), by - 10 * s]], 1), Palette.black, 2.5 * s);
    return canv;
  };

  // small hill shrine: stone cell with a stepped roof and a trident
  this.shrine = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var canv = "";
    canv += shape([[x - 12 * s, y], [x + 12 * s, y], [x + 12 * s, y - 16 * s], [x - 12 * s, y - 16 * s]], Palette.cream, INK(), 1.1);
    canv += shape([[x - 4 * s, y], [x + 4 * s, y], [x + 4 * s, y - 11 * s], [x - 4 * s, y - 11 * s]], Palette.black, INK(), 1);
    canv += shape([[x - 14 * s, y - 16 * s], [x + 14 * s, y - 16 * s], [x + 9 * s, y - 24 * s], [x - 9 * s, y - 24 * s]], Palette.red, INK(), 1);
    canv += shape([[x - 8 * s, y - 24 * s], [x + 8 * s, y - 24 * s], [x + 3 * s, y - 31 * s], [x - 3 * s, y - 31 * s]], Palette.red, INK(), 1);
    canv += line([[x, y - 31 * s], [x, y - 40 * s]], INK(), 1.2 * s);
    canv += line([[x - 3 * s, y - 36 * s], [x - 3 * s, y - 41 * s]], INK(), 1.2 * s);
    canv += line([[x + 3 * s, y - 36 * s], [x + 3 * s, y - 41 * s]], INK(), 1.2 * s);
    return canv;
  };

  // bullock cart with a canopy, two zebu and a driver
  this.cart = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var dir = args.dir || 1;
    var canv = "";
    var f = function(px) { return x + px * dir; };
    var wheel = function(wx, wy, r) {
      var out = dot(wx, wy, r, Palette.yellow, INK(), 1.4);
      for (var i = 0; i < 8; i++) {
        var a = (i / 8) * Math.PI;
        out += line([[wx + Math.cos(a) * r, wy + Math.sin(a) * r], [wx - Math.cos(a) * r, wy - Math.sin(a) * r]], INK(), 0.9);
      }
      out += dot(wx, wy, r * 0.2, Palette.darkbrown, INK(), 0.8);
      return out;
    };
    var R = 14 * s;
    var ay = y - R;
    // bed and canopy
    canv += shape([[f(-34 * s), ay - 6 * s], [f(10 * s), ay - 6 * s], [f(12 * s), ay - 14 * s], [f(-36 * s), ay - 14 * s]], Palette.brown, INK(), 1.2);
    var cap = [];
    for (var i = 0; i <= 12; i++) {
      var t = Math.PI + (i / 12) * Math.PI;
      cap.push([f(-12 * s + Math.cos(t) * 24 * s), ay - 14 * s + Math.sin(t) * 22 * s]);
    }
    canv += shape(cap, Palette.cream, INK(), 1.2);
    for (var i = 1; i < 4; i++) canv += line([[f(-12 * s - 24 * s * (1 - i / 4)), ay - 14 * s], [f(-12 * s - 24 * s * (1 - i / 4) * 0.4), ay - 14 * s - 20 * s * Math.sin((i / 4) * Math.PI / 2)]], INK(0.5), 0.8);
    canv += line([[f(-36 * s), ay - 16 * s], [f(12 * s), ay - 16 * s]], Palette.red, 2 * s);
    // shaft to the yoke
    canv += line([[f(10 * s), ay - 10 * s], [f(44 * s), ay - 18 * s]], Palette.darkbrown, 2.2 * s);
    canv += wheel(f(-10 * s), ay, R);
    canv += Figures.man(f(4 * s), ay - 14 * s, { sca: s * 0.6, dir: dir, prop: "stick" });
    canv += Figures.cow(f(58 * s), y, { sca: s * 0.85, dir: dir, col: Palette.white });
    canv += line([[f(44 * s), ay - 18 * s], [f(44 * s), ay - 34 * s]], Palette.darkbrown, 2 * s);
    canv += line([[f(30 * s), ay - 34 * s], [f(58 * s), ay - 34 * s]], Palette.darkbrown, 2.2 * s);
    return canv;
  };

  // temple tank: stepped stone sides, water with lotus, a mandapam
  this.tank = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var canv = "";
    var W = 170 * s, H = 44 * s;
    var steps = 3;
    for (var i = 0; i < steps; i++) {
      var inset = i * 6 * s;
      canv += shape([[x - W / 2 + inset, y - inset * 0.6], [x + W / 2 - inset, y - inset * 0.6], [x + W / 2 - inset - 8 * s, y - H + inset * 0.6], [x - W / 2 + inset + 8 * s, y - H + inset * 0.6]], i % 2 ? Palette.cream : Palette.paleyellow, INK(), 1);
    }
    var inset = steps * 6 * s;
    var water = [[x - W / 2 + inset, y - inset * 0.6], [x + W / 2 - inset, y - inset * 0.6], [x + W / 2 - inset - 8 * s, y - H + inset * 0.6], [x - W / 2 + inset + 8 * s, y - H + inset * 0.6]];
    canv += shape(water, Palette.blue, INK(), 1.2);
    for (var i = 0; i < 6; i++) {
      var wx = x - W / 2 + inset + 20 * s + Math.random() * (W - 2 * inset - 40 * s), wy = y - H + inset * 0.6 + 8 * s + Math.random() * (H - inset * 1.2 - 16 * s);
      canv += line([[wx - 8 * s, wy], [wx - 4 * s, wy - 2 * s], [wx, wy], [wx + 4 * s, wy - 2 * s], [wx + 8 * s, wy]], Palette.cream, 1);
    }
    // lotus leaves and flowers
    var nl = 4 + Math.floor(Math.random() * 4);
    for (var i = 0; i < nl; i++) {
      var lx = x - W / 2 + inset + 16 * s + Math.random() * (W - 2 * inset - 32 * s), ly = y - 6 * s - inset * 0.6 - Math.random() * (H - inset * 1.2 - 12 * s);
      canv += dot(lx, ly, 6 * s, Palette.green, INK(), 1);
      canv += line([[lx, ly], [lx + 4 * s, ly - 3 * s]], INK(0.6), 0.8);
      if (Math.random() < 0.6) {
        var fx = lx + 8 * s, fy = ly - 6 * s;
        for (var p = -2; p <= 2; p++) canv += shape([[fx, fy + 3 * s], [fx + p * 2.5 * s - 1.5 * s, fy - 4 * s], [fx + p * 2.5 * s, fy - 7 * s], [fx + p * 2.5 * s + 1.5 * s, fy - 4 * s]], "#d98aa0", INK(), 0.7);
        canv += line([[fx, fy + 3 * s], [fx - 2 * s, ly]], Palette.darkgreen, 1);
      }
    }
    // small pillared mandapam at the centre
    var mx = x, my = y - H / 2 - 2 * s;
    canv += shape([[mx - 14 * s, my + 8 * s], [mx + 14 * s, my + 8 * s], [mx + 14 * s, my + 4 * s], [mx - 14 * s, my + 4 * s]], Palette.cream, INK(), 1);
    for (var i = -1; i <= 1; i++) canv += line([[mx + i * 10 * s, my + 4 * s], [mx + i * 10 * s, my - 8 * s]], Palette.cream, 2.2 * s);
    canv += shape([[mx - 16 * s, my - 8 * s], [mx + 16 * s, my - 8 * s], [mx + 10 * s, my - 16 * s], [mx - 10 * s, my - 16 * s]], Palette.red, INK(), 1);
    canv += line([[mx, my - 16 * s], [mx, my - 22 * s]], INK(), 1.2 * s);
    return canv;
  };

  // fishing nets drying between poles
  this.nets = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var canv = "";
    var W = 50 * s, H = 34 * s;
    canv += line([[x - W / 2, y], [x - W / 2, y - H - 6 * s]], Palette.darkbrown, 2.2 * s);
    canv += line([[x + W / 2, y], [x + W / 2, y - H - 6 * s]], Palette.darkbrown, 2.2 * s);
    var sag = 8 * s;
    var top = bezmh([[x - W / 2, y - H - 4 * s], [x, y - H + sag], [x + W / 2, y - H - 4 * s]], 1);
    var bot = bezmh([[x - W / 2, y - 8 * s], [x, y - 8 * s + sag], [x + W / 2, y - 8 * s]], 1);
    canv += shape(top.concat(bot.slice().reverse()), "rgba(239,227,198,0.35)", INK(0.8), 1);
    for (var i = 1; i < 8; i++) {
      var t = i / 8;
      var j = Math.floor(t * (top.length - 1));
      canv += line([top[j], bot[j]], INK(0.6), 0.7);
    }
    for (var i = 1; i < 4; i++) {
      var pts = [];
      for (var j = 0; j < top.length; j += 3) pts.push([top[j][0] * (1 - i / 4) + bot[j][0] * (i / 4), top[j][1] * (1 - i / 4) + bot[j][1] * (i / 4)]);
      canv += line(pts, INK(0.6), 0.7);
    }
    return canv;
  };

  // parisal: the round coracle of the Kaveri, with a boatman
  this.parisal = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var dir = args.dir || 1;
    var canv = "";
    var R = 16 * s;
    var pts = [];
    for (var i = 0; i <= 14; i++) {
      var t = (i / 14) * Math.PI;
      pts.push([x + Math.cos(t) * R, y - 4 * s + Math.sin(t) * R * 0.6]);
    }
    canv += shape(pts, Palette.brown, INK(), 1.2);
    for (var i = 1; i < 4; i++) {
      var yy = y - 4 * s + i * R * 0.14;
      var hw = Math.sqrt(Math.max(0, 1 - Math.pow(i * 0.14 / 0.6, 2))) * R;
      canv += line([[x - hw, yy], [x + hw, yy]], Palette.darkbrown, 0.8);
    }
    for (var i = -2; i <= 2; i++) canv += line([[x + i * R * 0.4, y - 4 * s], [x + i * R * 0.3, y - 4 * s + R * 0.5]], Palette.darkbrown, 0.8);
    canv += line([[x - R, y - 4 * s], [x + R, y - 4 * s]], Palette.yellow, 1.5 * s);
    canv += Figures.man(x, y - 4 * s, { sca: s * 0.6, dir: dir, prop: "paddle" });
    return canv;
  };

  // stone well with a sweep for drawing water
  this.well = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var canv = "";
    var R = 13 * s;
    canv += shape([[x - R, y], [x + R, y], [x + R, y - 9 * s], [x - R, y - 9 * s]], Palette.cream, INK(), 1.1);
    var top = [];
    for (var i = 0; i <= 12; i++) {
      var t = (i / 12) * Math.PI * 2;
      top.push([x + Math.cos(t) * R, y - 9 * s + Math.sin(t) * 3.5 * s]);
    }
    canv += shape(top, Palette.black, INK(), 1);
    for (var i = -2; i <= 2; i++) canv += line([[x + i * 5 * s, y - 1 * s], [x + i * 5 * s, y - 8 * s]], INK(0.5), 0.7);
    canv += line([[x + R + 2 * s, y], [x + R + 2 * s, y - 30 * s]], Palette.darkbrown, 2 * s);
    canv += line([[x + R - 10 * s, y - 36 * s], [x + R + 16 * s, y - 24 * s]], Palette.darkbrown, 1.8 * s);
    canv += line([[x + R - 10 * s, y - 36 * s], [x + R - 10 * s, y - 14 * s]], INK(), 0.9);
    canv += dot(x + R - 10 * s, y - 12 * s, 2.5 * s, Palette.orange, INK(), 0.8);
    return canv;
  };

  // a village: huts in a row, a well, a woman at the well
  this.village = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var canv = "";
    var n = 2 + Math.floor(Math.random() * 2);
    for (var i = 0; i < n; i++) {
      canv += this.hut(x + (i - (n - 1) / 2) * 72 * s, y - (i % 2) * 10 * s, { sca: s * (0.9 + Math.random() * 0.2) });
    }
    canv += this.well(x + (n / 2 + 0.3) * 72 * s, y + 4 * s, { sca: s });
    canv += Figures.woman(x + (n / 2 + 0.3) * 72 * s - 20 * s, y + 6 * s, { sca: s * 0.9, dir: 1, prop: "pot" });
    return canv;
  };

  // shore temple: a gopuram within a low compound wall
  this.shoreTemple = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var canv = "";
    var W = 150 * s, H = 20 * s;
    canv += shape([[x - W, y], [x + W, y], [x + W, y - H], [x - W, y - H]], Palette.cream, INK(), 1.2);
    canv += line([[x - W, y - H * 0.35], [x + W, y - H * 0.35]], Palette.red, 3 * s);
    canv += line([[x - W, y - H * 0.75], [x + W, y - H * 0.75]], Palette.white, 2 * s);
    for (var i = -6; i <= 6; i++) if (i != 0) canv += line([[x + i * 22 * s, y - H], [x + i * 22 * s, y - H - 5 * s]], INK(), 1.5 * s);
    canv += this.gopuram(x, y + 1, { sca: s * 0.75, tiers: 4 + Math.floor(Math.random() * 3) });
    // a small shrine with a lamp post at each side
    canv += this.shrine(x - W * 0.6, y - H + 2, { sca: s * 0.8 });
    canv += line([[x + W * 0.6, y - H], [x + W * 0.6, y - H - 40 * s]], Palette.darkbrown, 2.5 * s);
    for (var i = 0; i < 4; i++) canv += dot(x + W * 0.6, y - H - 10 * s - i * 9 * s, 2.2 * s, Palette.yellow, INK(), 0.7);
    return canv;
  };

  var STONE = "#d6cbb0", STONE2 = "#b3a689", STONE3 = "#8d8068";

  function bigWheel(wx, wy, r) {
    var out = dot(wx, wy, r, Palette.brown, INK(), 1.5);
    for (var i = 0; i < 8; i++) {
      var a = (i / 8) * Math.PI;
      out += line([[wx + Math.cos(a) * r, wy + Math.sin(a) * r], [wx - Math.cos(a) * r, wy - Math.sin(a) * r]], Palette.darkbrown, 1.4);
    }
    out += dot(wx, wy, r * 0.22, Palette.yellow, INK(), 0.9);
    return out;
  }

  // Chola vimana: granite sanctum tower, a steep stepped pyramid of
  // shrinking tiers capped by a domed sikhara, as at Thanjavur
  this.vimana = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var tiers = args.tiers || 6 + Math.floor(Math.random() * 4);
    var canv = "";
    var W = 84 * s, H = 52 * s;
    // plinth and sanctum storey with pilasters and niches
    canv += shape([[x - W / 2 - 6 * s, y], [x + W / 2 + 6 * s, y], [x + W / 2 + 6 * s, y - 8 * s], [x - W / 2 - 6 * s, y - 8 * s]], STONE2, INK(), 1.2);
    canv += shape([[x - W / 2, y - 8 * s], [x + W / 2, y - 8 * s], [x + W / 2, y - H], [x - W / 2, y - H]], STONE, INK(), 1.3);
    for (var i = -3; i <= 3; i++) {
      var px = x + i * W / 7;
      canv += line([[px, y - 10 * s], [px, y - H + 3 * s]], STONE3, 1.6 * s);
      if (i % 2 != 0) canv += shape([[px - 4 * s, y - 14 * s], [px + 4 * s, y - 14 * s], [px + 4 * s, y - H + 10 * s], [px - 4 * s, y - H + 10 * s]], STONE3, INK(0.7), 0.8);
    }
    canv += shape([[x - 6 * s, y - 8 * s], [x + 6 * s, y - 8 * s], [x + 6 * s, y - H * 0.7], [x - 6 * s, y - H * 0.7]], Palette.black, INK(), 1);
    canv += line([[x - W / 2, y - H + 4 * s], [x + W / 2, y - H + 4 * s]], STONE3, 2.5 * s);
    var cy = y - H;
    var cw = W * 0.96;
    var th = 15 * s;
    for (var t = 0; t < tiers; t++) {
      var nw = cw * 0.86;
      canv += shape([[x - cw / 2, cy], [x + cw / 2, cy], [x + nw / 2, cy - th], [x - nw / 2, cy - th]], t % 2 ? STONE : STONE2, INK(), 1.1);
      // corner pavilions and a central niche
      canv += shape([[x - cw / 2 + 2 * s, cy - 2 * s], [x - cw / 2 + 8 * s, cy - 2 * s], [x - cw / 2 + 8 * s, cy - th + 3 * s], [x - cw / 2 + 3 * s, cy - th + 3 * s]], STONE3, INK(0.8), 0.7);
      canv += shape([[x + cw / 2 - 8 * s, cy - 2 * s], [x + cw / 2 - 2 * s, cy - 2 * s], [x + cw / 2 - 3 * s, cy - th + 3 * s], [x + cw / 2 - 8 * s, cy - th + 3 * s]], STONE3, INK(0.8), 0.7);
      canv += kudu(x, cy - th * 0.4, s * 0.8);
      cy -= th;
      cw = nw;
      th *= 0.94;
    }
    // sikhara: a rounded dome on a short neck, and the kalasam
    canv += shape([[x - cw / 2 * 0.7, cy], [x + cw / 2 * 0.7, cy], [x + cw / 2 * 0.6, cy - 6 * s], [x - cw / 2 * 0.6, cy - 6 * s]], STONE2, INK(), 1);
    var dome = [];
    var dr = cw * 0.5;
    for (var i = 0; i <= 14; i++) {
      var t = Math.PI + (i / 14) * Math.PI;
      dome.push([x + Math.cos(t) * dr, cy - 6 * s + Math.sin(t) * dr * 0.9]);
    }
    canv += shape(dome, STONE, INK(), 1.2);
    canv += line([[x, cy - 6 * s - dr * 0.9], [x, cy - 6 * s - dr * 0.9 - 14 * s]], INK(), 1.6 * s);
    canv += dot(x, cy - 6 * s - dr * 0.9 - 8 * s, 3 * s, Palette.yellow, INK(), 0.9);
    return canv;
  };

  // Nandi, the seated bull facing the sanctum
  this.nandi = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var dir = args.dir || 1;
    var canv = "";
    var f = function(px) { return x + px * dir; };
    canv += shape([[f(-22 * s), y], [f(22 * s), y], [f(20 * s), y - 7 * s], [f(-20 * s), y - 7 * s]], STONE2, INK(), 1.1);
    var by = y - 7 * s;
    var body = [[f(-18 * s), by], [f(14 * s), by], [f(16 * s), by - 10 * s], [f(8 * s), by - 16 * s], [f(2 * s), by - 20 * s], [f(-6 * s), by - 17 * s], [f(-18 * s), by - 14 * s]];
    canv += shape(body, "#2c2622", INK(), 1.2);
    canv += shape([[f(12 * s), by - 12 * s], [f(24 * s), by - 10 * s], [f(26 * s), by - 2 * s], [f(14 * s), by - 2 * s]], "#2c2622", INK(), 1.1);
    canv += line(bezmh([[f(14 * s), by - 12 * s], [f(10 * s), by - 22 * s], [f(16 * s), by - 24 * s]], 1), Palette.cream, 1.8 * s);
    canv += line(bezmh([[f(18 * s), by - 12 * s], [f(22 * s), by - 22 * s], [f(16 * s), by - 24 * s]], 1), Palette.cream, 1.8 * s);
    canv += dot(f(21 * s), by - 8 * s, 1 * s, Palette.white);
    for (var i = 0; i < 6; i++) canv += dot(f((-14 + i * 5) * s), by - 12 * s + Math.abs(i - 2.5) * 1.2 * s, 1.5 * s, Palette.yellow);
    canv += line([[f(8 * s), by - 16 * s], [f(14 * s), by - 2 * s]], Palette.red, 1.6 * s);
    return canv;
  };

  // dwajasthambam: the tall flag post before the sanctum
  this.flagpost = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var canv = "";
    var H = 110 * s;
    canv += shape([[x - 6 * s, y], [x + 6 * s, y], [x + 5 * s, y - 8 * s], [x - 5 * s, y - 8 * s]], STONE2, INK(), 1);
    canv += line([[x, y - 8 * s], [x, y - H]], Palette.yellow, 3 * s);
    canv += line([[x, y - 8 * s], [x, y - H]], INK(), 0.8);
    for (var i = 1; i <= 3; i++) canv += line([[x - 5 * s, y - H + i * 7 * s], [x + 5 * s, y - H + i * 7 * s]], Palette.yellow, 2 * s);
    canv += anim("flutter", shape([[x + 1 * s, y - H + 2 * s], [x + 18 * s, y - H + 6 * s], [x + 1 * s, y - H + 12 * s]], Palette.red, INK(), 0.9), -Math.random());
    return canv;
  };

  // a Chola temple: vimana within a prakara wall, with Nandi, flag post,
  // bali peetam and devotees
  this.cholaTemple = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var canv = "";
    var W = 190 * s, H = 22 * s;
    canv += shape([[x - W, y], [x + W, y], [x + W, y - H], [x - W, y - H]], STONE, INK(), 1.2);
    canv += line([[x - W, y - H * 0.4], [x + W, y - H * 0.4]], Palette.red, 3 * s);
    canv += line([[x - W, y - H * 0.75], [x + W, y - H * 0.75]], Palette.white, 2 * s);
    for (var i = -8; i <= 8; i++) canv += line([[x + i * 22 * s, y - H], [x + i * 22 * s, y - H - 5 * s]], INK(), 1.5 * s);
    canv += this.vimana(x - 20 * s, y + 2, { sca: s });
    // a small sub-shrine
    canv += this.shrine(x - W * 0.62, y - H + 2, { sca: s * 0.9 });
    canv += this.flagpost(x + 72 * s, y + 2, { sca: s });
    canv += shape([[x + 52 * s, y + 2], [x + 62 * s, y + 2], [x + 60 * s, y - 10 * s], [x + 54 * s, y - 10 * s]], STONE2, INK(), 1); // bali peetam
    canv += this.nandi(x + 100 * s, y + 4, { sca: s * 0.8, dir: -1 });
    canv += Figures.man(x + 130 * s, y + 6, { sca: s * 0.8, dir: -1, zari: true });
    canv += Figures.woman(x + 150 * s, y + 6, { sca: s * 0.8, dir: -1 });
    return canv;
  };

  // pillared mandapam: an open hall on a plinth with carved pillars
  this.mandapam = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var canv = "";
    var W = 64 * s, H = 34 * s;
    canv += shape([[x - W / 2 - 4 * s, y], [x + W / 2 + 4 * s, y], [x + W / 2 + 2 * s, y - 7 * s], [x - W / 2 - 2 * s, y - 7 * s]], STONE2, INK(), 1.1);
    for (var i = 0; i < 4; i++) {
      var px = x - W / 2 + 6 * s + (i / 3) * (W - 12 * s);
      canv += shape([[px - 3 * s, y - 7 * s], [px + 3 * s, y - 7 * s], [px + 3 * s, y - H], [px - 3 * s, y - H]], STONE, INK(), 1);
      canv += line([[px, y - 10 * s], [px, y - H + 3 * s]], STONE3, 0.8);
      canv += shape([[px - 5 * s, y - H], [px + 5 * s, y - H], [px + 4 * s, y - H - 4 * s], [px - 4 * s, y - H - 4 * s]], STONE2, INK(), 0.9);
    }
    canv += shape([[x - W / 2 - 6 * s, y - H - 4 * s], [x + W / 2 + 6 * s, y - H - 4 * s], [x + W / 2 + 2 * s, y - H - 12 * s], [x - W / 2 - 2 * s, y - H - 12 * s]], STONE, INK(), 1.2);
    canv += line([[x - W / 2 - 4 * s, y - H - 7 * s], [x + W / 2 + 4 * s, y - H - 7 * s]], Palette.red, 1.6 * s);
    for (var i = -3; i <= 3; i++) canv += dot(x + i * 9 * s, y - H - 13 * s, 1.6 * s, STONE2, INK(), 0.6);
    return canv;
  };

  // ther: the temple chariot, a tiered pyramid of cloth on great wheels,
  // hauled by ropes
  this.ther = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var dir = args.dir || 1;
    var canv = "";
    var f = function(px) { return x + px * dir; };
    var R = 18 * s;
    var ay = y - R;
    canv += bigWheel(f(-26 * s), ay, R);
    canv += shape([[f(-44 * s), ay - 4 * s], [f(44 * s), ay - 4 * s], [f(44 * s), ay - 22 * s], [f(-44 * s), ay - 22 * s]], Palette.brown, INK(), 1.3);
    for (var i = -3; i <= 3; i++) canv += dot(f(i * 12 * s), ay - 13 * s, 2.4 * s, Palette.yellow, INK(), 0.7);
    canv += bigWheel(f(26 * s), ay, R);
    // tiers of cloth
    var cy = ay - 22 * s;
    var cw = 84 * s;
    var cols = [Palette.red, Palette.yellow, Palette.green, Palette.orange];
    for (var t = 0; t < 4; t++) {
      var nw = cw * 0.78;
      var th = 26 * s - t * 3 * s;
      canv += shape([[f(-cw / 2), cy], [f(cw / 2), cy], [f(nw / 2), cy - th], [f(-nw / 2), cy - th]], cols[t % 4], INK(), 1.2);
      var ns = Math.floor(cw / (10 * s));
      for (var i = 0; i < ns; i++) {
        var u = (i + 0.5) / ns - 0.5;
        canv += line([[f(u * cw), cy - 2 * s], [f(u * nw), cy - th + 2 * s]], INK(0.6), 0.8);
      }
      for (var i = 0; i < ns; i++) {
        var u = (i + 0.5) / ns - 0.5;
        canv += shape([[f(u * cw - 3 * s), cy], [f(u * cw + 3 * s), cy], [f(u * cw), cy + 5 * s]], Palette.cream, INK(0.7), 0.6);
      }
      cy -= th;
      cw = nw;
    }
    var dome = [];
    for (var i = 0; i <= 12; i++) {
      var t = Math.PI + (i / 12) * Math.PI;
      dome.push([f(Math.cos(t) * cw * 0.45), cy + Math.sin(t) * cw * 0.4]);
    }
    canv += shape(dome, Palette.red, INK(), 1.2);
    canv += line([[f(0), cy - cw * 0.4], [f(0), cy - cw * 0.4 - 16 * s]], INK(), 1.5 * s);
    canv += dot(f(0), cy - cw * 0.4 - 10 * s, 3 * s, Palette.yellow, INK(), 0.9);
    for (var e = -1; e <= 1; e += 2) {
      canv += line([[f(e * cw * 0.45), cy], [f(e * cw * 0.45), cy - 26 * s]], INK(), 1.2 * s);
      canv += anim("flutter", shape([[f(e * cw * 0.45), cy - 26 * s], [f(e * cw * 0.45 + e * 12 * s), cy - 22 * s], [f(e * cw * 0.45), cy - 18 * s]], Palette.yellow, INK(), 0.8), -Math.random());
    }
    // ropes and haulers
    canv += line([[f(44 * s), ay - 14 * s], [f(130 * s), ay - 6 * s]], Palette.yellow, 2 * s);
    canv += line([[f(44 * s), ay - 14 * s], [f(130 * s), ay - 6 * s]], INK(0.7), 0.7);
    for (var i = 0; i < 4; i++) canv += Figures.man(f((70 + i * 20) * s), y + (i % 2) * 2, { sca: s * 0.85, dir: dir, prop: "haul" });
    return canv;
  };

  // nadukal: a hero stone, the carved memorial of a fallen warrior
  this.herostone = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var canv = "";
    var W = 18 * s, H = 38 * s;
    canv += shape([[x - W / 2 - 3 * s, y], [x + W / 2 + 3 * s, y], [x + W / 2 + 3 * s, y - 4 * s], [x - W / 2 - 3 * s, y - 4 * s]], STONE2, INK(), 1);
    var top = [];
    for (var i = 0; i <= 8; i++) {
      var t = Math.PI + (i / 8) * Math.PI;
      top.push([x + Math.cos(t) * W / 2, y - H + Math.sin(t) * 6 * s]);
    }
    canv += shape([[x - W / 2, y - 4 * s], [x + W / 2, y - 4 * s]].concat(top.reverse()), STONE, INK(), 1.2);
    // the warrior in relief, with spear and shield
    var cx = x, cy = y - H * 0.55;
    canv += line([[cx, cy - 7 * s], [cx, cy + 6 * s]], STONE3, 2.4 * s);
    canv += dot(cx, cy - 10 * s, 2.6 * s, STONE3, INK(0.6), 0.6);
    canv += line([[cx - 4 * s, cy + 6 * s], [cx - 2 * s, cy + 14 * s]], STONE3, 1.5 * s);
    canv += line([[cx + 4 * s, cy + 6 * s], [cx + 2 * s, cy + 14 * s]], STONE3, 1.5 * s);
    canv += line([[cx + 6 * s, cy + 4 * s], [cx + 6 * s, cy - 14 * s]], STONE3, 1.2 * s);
    canv += dot(cx - 6 * s, cy - 1 * s, 3 * s, STONE3, INK(0.6), 0.6);
    canv += line([[x - W / 2 + 2 * s, y - 9 * s], [x + W / 2 - 2 * s, y - 9 * s]], Palette.red, 1.2 * s);
    return canv;
  };

  // Pongal: the clay pot boiling over on a hearth, sugarcane beside it
  this.pongal = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var canv = "";
    for (var i = -1; i <= 1; i++) canv += dot(x + i * 7 * s, y - 2 * s, 3.5 * s, STONE3, INK(), 0.9);
    canv += shape([[x - 6 * s, y - 4 * s], [x - 2 * s, y - 14 * s], [x, y - 8 * s], [x + 3 * s, y - 15 * s], [x + 6 * s, y - 4 * s]], Palette.orange, INK(0.8), 0.7);
    canv += shape([[x - 3 * s, y - 4 * s], [x - 1 * s, y - 10 * s], [x + 2 * s, y - 4 * s]], Palette.yellow, "none", 0);
    var py = y - 8 * s;
    canv += shape([[x - 8 * s, py], [x + 8 * s, py], [x + 11 * s, py - 10 * s], [x + 7 * s, py - 18 * s], [x - 7 * s, py - 18 * s], [x - 11 * s, py - 10 * s]], Palette.orange, INK(), 1.1);
    canv += line([[x - 9 * s, py - 6 * s], [x + 9 * s, py - 6 * s]], Palette.white, 1.2 * s);
    canv += line([[x - 7 * s, py - 18 * s], [x + 7 * s, py - 18 * s]], Palette.yellow, 2 * s);
    // the froth boiling over
    for (var i = -2; i <= 2; i++) canv += dot(x + i * 3.5 * s, py - 19 * s - Math.abs(i) * 1.5 * s, 2.4 * s, Palette.white, INK(0.6), 0.6);
    canv += dot(x + 8 * s, py - 12 * s, 1.8 * s, Palette.white);
    // sugarcane stalks
    for (var i = 0; i < 3; i++) {
      var sx = x + 18 * s + i * 5 * s;
      canv += line([[sx, y], [sx + 4 * s, y - 50 * s - i * 6 * s]], "#7a4a6a", 2.4 * s);
      for (var j = 1; j < 5; j++) canv += line([[sx + j * 0.8 * s, y - j * 10 * s], [sx + j * 0.8 * s + 3 * s, y - j * 10 * s]], INK(0.6), 0.7);
      for (var j = 0; j < 3; j++) canv += line([[sx + 4 * s, y - 50 * s - i * 6 * s], [sx + (j - 1) * 10 * s, y - 64 * s - i * 6 * s - Math.abs(j - 1) * 4 * s]], Palette.green, 1.6 * s);
    }
    canv += Figures.woman(x - 22 * s, y + 2, { sca: s * 0.9, dir: 1 });
    return canv;
  };
}();
