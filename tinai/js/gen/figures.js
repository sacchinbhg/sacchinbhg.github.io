// People and animals in the Nayak mural manner: profile bodies, large
// almond eyes, flat skin tone, white veshti with a red border, coloured
// saris. (x, y) is the point between the feet; dir is 1 facing right.
var Figures = new function() {
  var SKIN = "#9a5a34";
  var SKIN2 = "#7a4426";
  var self = this;
  Object.defineProperty(this, "SKIN", { get: function() { return SKIN; } });
  Object.defineProperty(this, "SKIN2", { get: function() { return SKIN2; } });

  // ---- identity: who this particular person is ----------------------------
  var TONES = [[196, 141, 92], [171, 114, 66], [154, 90, 52], [125, 69, 38], [95, 53, 25]];
  var TONE_W = [0.12, 0.26, 0.3, 0.22, 0.1];
  var SARIS = [Palette.red, Palette.green, Palette.indigo, Palette.orange, "#7a3a5a", "#2d6fa8", "#b8860b", "#2e6b6b", "#8a2b2b", "#d98aa0"];
  var BLOUSES = [Palette.yellow, Palette.green, Palette.red, "#2d6fa8", "#8a2b2b", Palette.cream, "#7a3a5a"];
  var BORDERS = [Palette.red, Palette.yellow, Palette.green, "#2d6fa8", "#8a2b2b", Palette.darkgreen];
  var TURBANS = [Palette.cream, Palette.red, Palette.orange, Palette.green, Palette.white, "#2d6fa8"];
  var SHIRTS = [Palette.white, Palette.cream, "#cfe0ea", "#f1d9d2", "#dcd3b8"];
  var LUNGIS = [["#2d6fa8", Palette.white], [Palette.darkgreen, Palette.yellow], ["#8a2b2b", Palette.cream], ["#2e6b6b", Palette.white]];
  function css(c, f) { f = f == undefined ? 1 : f; return "rgb(" + Math.round(c[0] * f) + "," + Math.round(c[1] * f) + "," + Math.round(c[2] * f) + ")"; }
  function pickW(w) { var r = Math.random(), a = 0; for (var i = 0; i < w.length; i++) { a += w[i]; if (r < a) return i; } return w.length - 1; }
  this.identity = function(female, o) {
    o = o || {};
    var t = TONES[pickW(TONE_W)];
    var age = o.age || (Math.random() < 0.14 ? "old" : Math.random() < 0.35 ? "middle" : "young");
    var id = { female: female, age: age, skin: css(t), skin2: css(t, 0.78), height: 0.92 + Math.random() * 0.16, stout: Math.random() < (age == "young" ? 0.08 : 0.25) };
    if (female) {
      id.hair = age == "old" ? (Math.random() < 0.6 ? "bun" : "loose") : pickW([0.42, 0.4, 0.18]) == 0 ? "bun" : Math.random() < 0.7 ? "plait" : "loose";
      id.grey = age == "old";
      id.sari = o.col || SARIS[Math.floor(Math.random() * SARIS.length)];
      id.blouse = BLOUSES[Math.floor(Math.random() * BLOUSES.length)];
      if (id.blouse == id.sari) id.blouse = Palette.yellow;
      id.border = Math.random() < 0.6 ? Palette.yellow : BORDERS[Math.floor(Math.random() * BORDERS.length)];
      id.flowers = Math.random() < 0.7;
      id.nosering = Math.random() < 0.5;
      id.pottu = Math.random() < 0.8 ? Palette.red : Palette.black;
    } else {
      var h = pickW(age == "old" ? [0.25, 0.2, 0.15, 0.3, 0.1] : [0.32, 0.22, 0.26, 0.0, 0.2]);
      id.hair = ["cap", "turban", "bare", "bald", "thundu"][h];
      id.turban = TURBANS[Math.floor(Math.random() * TURBANS.length)];
      id.grey = age == "old";
      id.must = Math.random() < (age == "young" ? 0.5 : 0.75);
      id.beard = age == "old" && Math.random() < 0.5;
      id.shirt = Math.random() < 0.3 ? SHIRTS[Math.floor(Math.random() * SHIRTS.length)] : null;
      var v = pickW([0.62, 0.18, 0.2]);
      id.veshti = v == 0 ? Palette.white : v == 1 ? Palette.cream : null;
      id.lungi = v == 2 ? LUNGIS[Math.floor(Math.random() * LUNGIS.length)] : null;
      id.border = o.zari || o.king ? Palette.yellow : BORDERS[Math.floor(Math.random() * BORDERS.length)];
      id.ang = Math.random() < 0.5 ? Palette.cream : Math.random() < 0.5 ? Palette.red : Palette.green;
    }
    return id;
  };
  var CUR = null;
  this.use = function(id) { CUR = id; SKIN = id.skin; SKIN2 = id.skin2; return id; };
  this.current = function() { return CUR; };

  function eye(x, y, dir, s) {
    var pts = [[x - 3 * s, y], [x, y - 2 * s], [x + 3.2 * s, y - 0.6 * s], [x, y + 1.6 * s]];
    return shape(pts, Palette.white, INK(), 0.8) + dot(x + 0.6 * s * dir, y - 0.3 * s, 1.2 * s, Palette.black);
  }

  function head(x, y, dir, s, female, id) {
    id = id || (CUR && CUR.female == female ? CUR : self.identity(female));
    var canv = "";
    var r = 7 * s;
    var hairCol = id.grey ? "#8c8478" : Palette.black;
    // hair mass at the back, unless bald
    if (id.hair != "bald") canv += dot(x - 2 * s * dir, y - 1 * s, r * (id.hair == "loose" ? 1.2 : 1.05), hairCol, INK(), 1);
    // a long plait down the back
    if (female && id.hair == "plait") {
      var pl = bezmh([[x - 6 * s * dir, y + 3 * s], [x - 9 * s * dir, y + 14 * s], [x - 7 * s * dir, y + 26 * s]], 1);
      canv += line(pl, hairCol, 3.2 * s);
      canv += line(pl, INK(0.6), 0.6);
      canv += dot(x - 7 * s * dir, y + 27 * s, 1.8 * s, Palette.red);
      if (id.flowers) for (var i = 2; i < 10; i += 3) canv += dot(pl[i][0], pl[i][1], 1 * s, Palette.white);
    }
    if (female && id.hair == "loose") for (var i = 0; i < 3; i++) canv += line([[x - (5 + i * 2) * s * dir, y + 4 * s], [x - (6 + i * 2) * s * dir, y + 16 * s]], hairCol, 1.6 * s);
    // face: circle with a nose bump on the facing side
    var pts = [];
    for (var i = 0; i < 18; i++) {
      var t = (i / 18) * Math.PI * 2;
      var rr = r;
      var fx = Math.cos(t) * dir;
      if (fx > 0.7 && Math.sin(t) > 0 && Math.sin(t) < 0.6) rr = r * 1.22; // nose
      pts.push([x + Math.cos(t) * rr, y + Math.sin(t) * rr]);
    }
    canv += shape(pts, id.skin, INK(), 1);
    canv += eye(x + 2 * s * dir, y - 1.5 * s, dir, s * 0.9);
    // brow and mouth
    canv += line([[x - 1 * s * dir, y - 4.5 * s], [x + 5 * s * dir, y - 3.8 * s]], INK(), 0.9);
    canv += line([[x + 3 * s * dir, y + 3.5 * s], [x + 6 * s * dir, y + 3 * s]], INK(), 0.8);
    if (!female && id.must) {
      var mc = id.grey ? "#bdb5a5" : Palette.black;
      canv += line([[x + 2.5 * s * dir, y + 2.2 * s], [x + 6.5 * s * dir, y + 1.8 * s], [x + 7.5 * s * dir, y + 0.8 * s]], mc, 1.3 * s);
    }
    if (!female && id.beard) canv += shape([[x + 4 * s * dir, y + 4 * s], [x + 9 * s * dir, y + 5 * s], [x + 6 * s * dir, y + 14 * s], [x + 1 * s * dir, y + 9 * s]], id.grey ? Palette.white : Palette.black, INK(0.7), 0.6);
    if (female) {
      if (id.hair == "bun") {
        canv += dot(x - 7 * s * dir, y + 1 * s, 3.2 * s, hairCol, INK(), 1);
        if (id.flowers) { canv += dot(x - 7 * s * dir, y + 1 * s, 1.4 * s, Palette.white); canv += dot(x - 5 * s * dir, y - 2 * s, 1 * s, Palette.white); }
      }
      canv += dot(x + 1 * s * dir, y - 7.5 * s, 1.2 * s, id.pottu); // pottu
      canv += dot(x - 4.5 * s * dir, y + 3.5 * s, 1.1 * s, Palette.yellow, INK(0.6), 0.4); // earring
      if (id.nosering) canv += dot(x + 8 * s * dir, y + 1.5 * s, 0.8 * s, Palette.yellow);
    } else if (id.hair == "cap") {
      canv += shape([[x - 7 * s, y - 4 * s], [x + 7 * s, y - 4 * s], [x + 5 * s, y - 10 * s], [x - 5 * s, y - 10 * s]], Palette.cream, INK(), 1);
    } else if (id.hair == "turban") {
      var tp = [];
      for (var i = 0; i <= 10; i++) { var t = Math.PI + (i / 10) * Math.PI; tp.push([x + Math.cos(t) * 8.5 * s, y - 4 * s + Math.sin(t) * 7.5 * s]); }
      canv += shape(tp, id.turban, INK(), 1);
      canv += line([[x - 6 * s, y - 6 * s], [x + 6 * s, y - 7.5 * s]], INK(0.5), 0.6);
      canv += dot(x - 6 * s * dir, y - 7 * s, 2 * s, id.turban, INK(), 0.8); // the knot
    } else if (id.hair == "bare") {
      canv += dot(x - 4 * s * dir, y - 7 * s, 1.8 * s, hairCol); // kudumi tuft
    } else if (id.hair == "thundu") {
      canv += shape([[x - 7.5 * s, y - 3 * s], [x + 7.5 * s, y - 3 * s], [x + 7 * s, y - 6 * s], [x - 7 * s, y - 6 * s]], Palette.white, INK(), 0.9);
      canv += line([[x - 7 * s * dir, y - 4 * s], [x - 11 * s * dir, y + 2 * s]], Palette.white, 2 * s);
    } else if (id.hair == "bald") {
      canv += line([[x - 6 * s, y - 2 * s], [x - 2 * s, y - 6 * s]], hairCol, 1.6 * s); // a fringe of hair at the back
    }
    return canv;
  }

  this.head = head;
  this.eye = eye;

  // man in a veshti, optional stick or load
  this.man = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var dir = args.dir || 1;
    var prop = args.prop || "none";
    var zari = args.zari != undefined ? args.zari : Math.random() < 0.35;
    var king = args.king;
    var id = self.use(args.id || self.identity(false, { zari: zari, king: king }));
    var canv = "";
    var H = 64 * s * id.height;
    var waist = y - H * 0.52;
    var shoulder = y - H * 0.78;
    // feet
    canv += dot(x - 4 * s, y - 1 * s, 3 * s, SKIN2, INK(), 0.8);
    canv += dot(x + 5 * s * dir, y - 1 * s, 3 * s, SKIN2, INK(), 0.8);
    // veshti: white with a red or gold zari border; silk for a king
    var vcol = king ? Palette.red : id.lungi ? id.lungi[0] : id.veshti;
    canv += shape([[x - 7 * s, waist], [x + 7 * s, waist], [x + 10 * s, y - 3 * s], [x - 9 * s, y - 3 * s]], vcol, INK(), 1.1);
    if (id.lungi && !king) { for (var i = 0; i < 3; i++) canv += line([[x - 8 * s, waist + 6 * s + i * 7 * s], [x + 9 * s, waist + 6 * s + i * 7 * s]], id.lungi[1], 0.8 * s); for (var i = -1; i <= 1; i++) canv += line([[x + i * 4 * s, waist + 2 * s], [x + i * 5 * s, y - 4 * s]], id.lungi[1], 0.8 * s); }
    canv += line([[x - 9 * s, y - 5 * s], [x + 10 * s, y - 5 * s]], zari || king ? Palette.yellow : id.border, 1.6 * s);
    if (zari || king) canv += line([[x - 9 * s, y - 8 * s], [x + 10 * s, y - 8 * s]], zari && !king ? Palette.yellow : Palette.cream, 0.7 * s);
    canv += line([[x + 1 * s, waist + 4 * s], [x + 2 * s, y - 6 * s]], INK(0.6), 0.8);
    // torso: bare, or a shirt; a stout man carries a belly
    canv += shape([[x - 7 * s, shoulder], [x + 7 * s, shoulder], [x + 6 * s, waist + 1], [x - 6 * s, waist + 1]], id.shirt && !king ? id.shirt : SKIN, INK(), 1.1);
    if (id.stout) canv += dot(x + 2 * s * dir, waist - 6 * s, 7 * s, id.shirt && !king ? id.shirt : SKIN, INK(), 1);
    // angavastram over the shoulder
    if (!id.shirt || king) canv += line([[x - 5 * s * dir, shoulder + 1], [x + 5 * s * dir, waist - 2 * s]], king ? Palette.yellow : id.ang, 1.4 * s);
    // arms
    var ax = x + 6 * s * dir;
    if (prop == "stick") {
      canv += line([[ax, shoulder + 2 * s], [ax + 8 * s * dir, waist - 6 * s]], SKIN, 3 * s);
      canv += line([[ax + 8 * s * dir, waist - 6 * s], [ax + 10 * s * dir, y - 5 * s]], Palette.darkbrown, 1.6 * s);
      canv += line([[ax + 10 * s * dir, waist - 20 * s], [ax + 10 * s * dir, y]], Palette.darkbrown, 1.6 * s);
    } else if (prop == "bow") {
      canv += line([[ax, shoulder + 2 * s], [ax + 12 * s * dir, shoulder + 2 * s]], SKIN, 3 * s);
      var bx = ax + 12 * s * dir;
      canv += line(bezmh([[bx - 2 * s * dir, shoulder - 14 * s], [bx + 6 * s * dir, shoulder + 2 * s], [bx - 2 * s * dir, shoulder + 18 * s]], 1), Palette.darkbrown, 1.5 * s);
      canv += line([[bx - 2 * s * dir, shoulder - 14 * s], [bx - 2 * s * dir, shoulder + 18 * s]], INK(), 0.8);
    } else if (prop == "paddle") {
      canv += line([[ax, shoulder + 2 * s], [ax + 6 * s * dir, waist]], SKIN, 3 * s);
      canv += line([[ax + 6 * s * dir, waist - 14 * s], [ax + 6 * s * dir, y + 8 * s]], Palette.darkbrown, 1.8 * s);
    } else if (prop == "spear") {
      canv += line([[ax, shoulder + 2 * s], [ax + 7 * s * dir, shoulder + 2 * s]], SKIN, 3 * s);
      canv += line([[ax + 7 * s * dir, y], [ax + 7 * s * dir, shoulder - 30 * s]], Palette.darkbrown, 1.5 * s);
      canv += shape([[ax + 7 * s * dir, shoulder - 40 * s], [ax + 9.5 * s * dir, shoulder - 30 * s], [ax + 4.5 * s * dir, shoulder - 30 * s]], Palette.cream, INK(), 0.8);
      canv += dot(x - 9 * s * dir, waist - 4 * s, 7 * s, Palette.red, INK(), 1.1);
      canv += dot(x - 9 * s * dir, waist - 4 * s, 2 * s, Palette.yellow);
    } else if (prop == "drum") {
      canv += shape([[x + 2 * s * dir, waist - 6 * s], [x + 16 * s * dir, waist - 4 * s], [x + 16 * s * dir, waist + 6 * s], [x + 2 * s * dir, waist + 8 * s]], Palette.brown, INK(), 1);
      canv += dot(x + 16 * s * dir, waist + 1 * s, 5 * s, Palette.cream, INK(), 0.9);
      canv += line([[ax, shoulder + 2 * s], [ax + 10 * s * dir, waist - 8 * s]], SKIN, 3 * s);
      canv += line([[ax + 10 * s * dir, waist - 8 * s], [ax + 15 * s * dir, waist - 3 * s]], INK(), 1 * s);
      canv += line([[x - 6 * s * dir, shoulder + 2 * s], [x - 10 * s * dir, waist - 2 * s]], Palette.yellow, 1.2 * s);
    } else if (prop == "flag") {
      canv += line([[ax, shoulder + 2 * s], [ax + 6 * s * dir, shoulder - 2 * s]], SKIN, 3 * s);
      canv += line([[ax + 6 * s * dir, waist], [ax + 6 * s * dir, shoulder - 44 * s]], Palette.darkbrown, 1.5 * s);
      canv += anim("flutter", shape([[ax + 6 * s * dir, shoulder - 44 * s], [ax + 26 * s * dir, shoulder - 38 * s], [ax + 6 * s * dir, shoulder - 30 * s]], Palette.orange, INK(), 0.9) + dot(ax + 13 * s * dir, shoulder - 38 * s, 2 * s, Palette.black), -Math.random());
    } else if (prop == "leaves") {
      canv += line([[ax, shoulder + 2 * s], [ax + 2 * s * dir, shoulder - 10 * s]], SKIN, 3 * s);
      for (var i = 0; i < 4; i++) canv += shape([[x - 14 * s + i * 2 * s, shoulder - 15 * s - i * 2.5 * s], [x + 14 * s + i * 2 * s, shoulder - 15 * s - i * 2.5 * s], [x + 12 * s + i * 2 * s, shoulder - 19 * s - i * 2.5 * s], [x - 12 * s + i * 2 * s, shoulder - 19 * s - i * 2.5 * s]], i % 2 ? Palette.green : Palette.lightgreen, INK(), 0.8);
    } else if (prop == "haul") {
      canv += line([[ax, shoulder + 2 * s], [ax + 12 * s * dir, shoulder - 2 * s]], SKIN, 3 * s);
      canv += line([[x - 6 * s * dir, shoulder + 2 * s], [ax + 10 * s * dir, shoulder]], SKIN2, 2.6 * s);
    } else {
      canv += line([[ax, shoulder + 2 * s], [ax + 3 * s * dir, waist + 2 * s]], SKIN, 3 * s);
    }
    if (prop != "haul") canv += line([[x - 6 * s * dir, shoulder + 2 * s], [x - 7 * s * dir, waist + 2 * s]], SKIN2, 2.6 * s);
    canv += head(x + 1 * s * dir, shoulder - 9 * s, dir, s, false);
    if (king) {
      // crown and jewels
      var hy = shoulder - 9 * s;
      canv += shape([[x - 6 * s, hy - 5 * s], [x + 8 * s, hy - 5 * s], [x + 7 * s, hy - 14 * s], [x + 2 * s, hy - 19 * s], [x - 4 * s, hy - 14 * s]], Palette.yellow, INK(), 1);
      canv += dot(x + 2 * s, hy - 12 * s, 1.6 * s, Palette.red);
      for (var i = -2; i <= 2; i++) canv += dot(x + i * 2.6 * s, shoulder + 3 * s + Math.abs(i) * 0.8 * s, 1.3 * s, Palette.yellow, INK(0.6), 0.5);
      canv += line([[x - 3 * s, shoulder - 1 * s], [x + 3 * s, shoulder - 1 * s]], Palette.yellow, 1.2 * s);
    }
    return canv;
  };

  // woman in a sari, optional pot on the head or on the hip
  this.woman = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var dir = args.dir || 1;
    var prop = args.prop || "none";
    var id = self.use(args.id || self.identity(true, { col: args.col }));
    var col = id.sari;
    var canv = "";
    var H = 62 * s * id.height;
    var waist = y - H * 0.52;
    var shoulder = y - H * 0.78;
    canv += dot(x - 3 * s, y - 1 * s, 2.6 * s, SKIN2, INK(), 0.8);
    canv += dot(x + 4 * s * dir, y - 1 * s, 2.6 * s, SKIN2, INK(), 0.8);
    // sari skirt with pleats and a yellow border
    canv += shape([[x - 7 * s, waist], [x + 7 * s, waist], [x + 11 * s, y - 2 * s], [x - 11 * s, y - 2 * s]], col, INK(), 1.1);
    canv += line([[x - 11 * s, y - 4 * s], [x + 11 * s, y - 4 * s]], id.border, 1.8 * s);
    for (var i = -1; i <= 1; i++) canv += line([[x + i * 3 * s, waist + 3 * s], [x + i * 4 * s, y - 6 * s]], INK(0.5), 0.7);
    // blouse
    canv += shape([[x - 7 * s, shoulder], [x + 7 * s, shoulder], [x + 6 * s, waist - 6 * s], [x - 6 * s, waist - 6 * s]], id.blouse, INK(), 1.1);
    // midriff
    canv += shape([[x - 6 * s, waist - 6 * s], [x + 6 * s, waist - 6 * s], [x + 6 * s, waist + 1], [x - 6 * s, waist + 1]], SKIN, INK(), 1);
    // pallu over the shoulder
    canv += shape([[x - 6 * s * dir, shoulder - 1], [x + 1 * s * dir, shoulder], [x + 6 * s * dir, waist + 2 * s], [x - 2 * s * dir, waist + 2 * s]], col, INK(), 1);
    canv += line([[x - 6 * s * dir, shoulder], [x + 6 * s * dir, waist + 2 * s]], id.border, 1.2 * s);
    // a necklace
    canv += line([[x - 3 * s * dir, shoulder + 1 * s], [x + 3 * s * dir, shoulder + 1 * s]], Palette.yellow, 1 * s);
    // arms
    var ax = x + 6 * s * dir;
    var hy = shoulder - 9 * s;
    if (prop == "pot") {
      canv += line([[ax, shoulder + 2 * s], [ax + 2 * s * dir, hy - 6 * s]], SKIN, 3 * s);
      canv += shape([[x - 6 * s, hy - 9 * s], [x + 6 * s, hy - 9 * s], [x + 8 * s, hy - 16 * s], [x + 5 * s, hy - 21 * s], [x - 5 * s, hy - 21 * s], [x - 8 * s, hy - 16 * s]], Palette.orange, INK(), 1.1);
    } else if (prop == "hippot") {
      canv += line([[ax, shoulder + 2 * s], [ax + 5 * s * dir, waist]], SKIN, 3 * s);
      canv += dot(x + 10 * s * dir, waist + 2 * s, 6 * s, Palette.orange, INK(), 1.1);
    } else {
      canv += line([[ax, shoulder + 2 * s], [ax + 3 * s * dir, waist + 2 * s]], SKIN, 3 * s);
    }
    canv += line([[x - 6 * s * dir, shoulder + 2 * s], [x - 7 * s * dir, waist + 1 * s]], SKIN2, 2.6 * s);
    // bangles
    canv += line([[ax + 2 * s * dir, waist - 2 * s], [ax + 5 * s * dir, waist - 2 * s]], Palette.yellow, 1.2 * s);
    canv += head(x + 1 * s * dir, hy, dir, s, true);
    return canv;
  };

  // zebu cow or bull: humped, long horns
  this.cow = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var dir = args.dir || 1;
    var buffalo = args.buffalo;
    var col = args.col || (buffalo ? "#2c2622" : randChoice([Palette.cream, Palette.white, Palette.brown, "#5a4030"]));
    var canv = "";
    var L = (buffalo ? 50 : 44) * s, H = (buffalo ? 24 : 22) * s;
    var by = y - 14 * s; // belly line
    var f = function(px) { return x + px * dir; };
    // legs
    var legs = [-16, -11, 11, 16];
    for (var i = 0; i < 4; i++) {
      var lx = f(legs[i] * s);
      canv += line([[lx, by - 4 * s], [lx + (i < 2 ? -1 : 1) * dir * s, y]], i % 2 ? col : Palette.shade([120, 90, 60], 0.9), 3.2 * s);
      canv += line([[lx, by - 4 * s], [lx + (i < 2 ? -1 : 1) * dir * s, y]], INK(0.8), 0.6);
      canv += dot(lx + (i < 2 ? -1 : 1) * dir * s, y, 1.8 * s, Palette.black);
    }
    // body with hump
    var body = [
      [f(-L / 2), by], [f(L / 2), by], [f(L / 2 + 2 * s), by - H * 0.6], [f(L * 0.3), by - H], [f(L * 0.2), by - H * 1.25],
      [f(L * 0.05), by - H * 1.15], [f(-L * 0.1), by - H * 0.95], [f(-L / 2 - 2 * s), by - H * 0.85],
    ];
    canv += shape(body, col, INK(), 1.2);
    // neck and head
    var nx = f(L / 2 + 2 * s), ny = by - H * 0.75;
    canv += shape([[nx - 4 * s * dir, ny - 6 * s], [nx + 8 * s * dir, ny - 9 * s], [nx + 10 * s * dir, ny + 6 * s], [nx - 2 * s * dir, ny + 6 * s]], col, INK(), 1.1);
    canv += shape([[nx + 6 * s * dir, ny - 10 * s], [nx + 16 * s * dir, ny - 6 * s], [nx + 17 * s * dir, ny + 2 * s], [nx + 8 * s * dir, ny + 2 * s]], col, INK(), 1.1);
    canv += eye(nx + 11 * s * dir, ny - 5 * s, dir, s * 0.7);
    // horns: zebu lyre shaped and pale, buffalo swept back and dark
    if (buffalo) {
      canv += line(bezmh([[nx + 7 * s * dir, ny - 10 * s], [nx - 4 * s * dir, ny - 20 * s], [nx - 10 * s * dir, ny - 12 * s]], 1), Palette.black, 2.2 * s);
      canv += line(bezmh([[nx + 7 * s * dir, ny - 10 * s], [nx - 4 * s * dir, ny - 20 * s], [nx - 10 * s * dir, ny - 12 * s]], 1), Palette.cream, 0.7 * s);
    } else {
      canv += line(bezmh([[nx + 7 * s * dir, ny - 10 * s], [nx + 4 * s * dir, ny - 22 * s], [nx + 10 * s * dir, ny - 24 * s]], 1), Palette.black, 2.4 * s);
      canv += line(bezmh([[nx + 7 * s * dir, ny - 10 * s], [nx + 4 * s * dir, ny - 22 * s], [nx + 10 * s * dir, ny - 24 * s]], 1), Palette.cream, 1.2 * s);
      canv += line(bezmh([[nx + 10 * s * dir, ny - 10 * s], [nx + 14 * s * dir, ny - 22 * s], [nx + 8 * s * dir, ny - 25 * s]], 1), Palette.black, 2.4 * s);
      canv += line(bezmh([[nx + 10 * s * dir, ny - 10 * s], [nx + 14 * s * dir, ny - 22 * s], [nx + 8 * s * dir, ny - 25 * s]], 1), Palette.cream, 1.2 * s);
    }
    // dewlap and tail
    canv += line([[nx - 2 * s * dir, ny + 6 * s], [nx + 2 * s * dir, ny + 12 * s], [nx + 8 * s * dir, ny + 4 * s]], INK(), 0.9);
    canv += line(bezmh([[f(-L / 2 - 1 * s), by - H * 0.85], [f(-L / 2 - 8 * s), by - H * 0.4], [f(-L / 2 - 6 * s), y - 3 * s]], 1), INK(), 1.4 * s);
    canv += dot(f(-L / 2 - 6 * s), y - 3 * s, 2 * s, Palette.black);
    // spots for cream animals
    if (!buffalo && (col == Palette.cream || col == Palette.white)) {
      for (var i = 0; i < 3; i++) canv += dot(f((Math.random() - 0.5) * L * 0.7), by - H * (0.2 + Math.random() * 0.6), 3 * s, Palette.brown, INK(0.5), 0.6);
    }
    return canv;
  };

  // goat for the paalai and kurinji
  this.goat = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var dir = args.dir || 1;
    var canv = "";
    var f = function(px) { return x + px * dir; };
    var by = y - 10 * s;
    for (var i = 0; i < 4; i++) {
      var lx = f([-9, -6, 6, 9][i] * s);
      canv += line([[lx, by - 2 * s], [lx, y]], Palette.black, 2 * s);
    }
    canv += shape([[f(-12 * s), by], [f(12 * s), by], [f(13 * s), by - 10 * s], [f(-11 * s), by - 9 * s]], Palette.black, INK(), 1);
    canv += shape([[f(12 * s), by - 10 * s], [f(18 * s), by - 16 * s], [f(22 * s), by - 12 * s], [f(17 * s), by - 6 * s]], Palette.black, INK(), 1);
    canv += line([[f(18 * s), by - 16 * s], [f(14 * s), by - 24 * s]], INK(), 1.4 * s);
    canv += line([[f(19 * s), by - 16 * s], [f(18 * s), by - 24 * s]], INK(), 1.4 * s);
    canv += dot(f(19 * s), by - 13 * s, 1 * s, Palette.white);
    return canv;
  };

  // elephant: wild in the hills, or caparisoned for the temple
  this.elephant = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var dir = args.dir || 1;
    var temple = args.temple;
    var canv = "";
    var f = function(px) { return x + px * dir; };
    var col = "#6a6670";
    var L = 70 * s, H = 42 * s;
    var by = y - 26 * s;
    // far legs darker, near legs lighter
    var legs = [-24, -14, 12, 22];
    for (var i = 0; i < 4; i++) {
      var lx = f(legs[i] * s);
      canv += shape([[lx - 5 * s, by - 6 * s], [lx + 5 * s, by - 6 * s], [lx + 6 * s, y], [lx - 6 * s, y]], i % 2 ? col : "#55515a", INK(), 1.1);
      for (var t = 0; t < 3; t++) canv += dot(lx - 3 * s + t * 3 * s, y - 1.5 * s, 1 * s, Palette.cream);
    }
    // body
    var body = [];
    for (var i = 0; i <= 20; i++) {
      var t = Math.PI + (i / 20) * Math.PI;
      body.push([f(Math.cos(t) * L / 2), by - 4 * s + Math.sin(t) * H]);
    }
    body.push([f(L / 2), by + 2 * s]);
    body.push([f(-L / 2), by + 2 * s]);
    canv += shape(body, col, INK(), 1.3);
    // head with domed forehead, ear, trunk, tusk
    var hx = f(L / 2 + 2 * s), hy = by - H * 0.55;
    var hd = [];
    for (var i = 0; i <= 14; i++) {
      var t = Math.PI * 0.9 + (i / 14) * Math.PI * 1.3;
      hd.push([hx + Math.cos(t) * 18 * s * dir, hy + Math.sin(t) * 19 * s]);
    }
    canv += shape(hd, col, INK(), 1.2);
    var tr = bezmh([[hx + 14 * s * dir, hy + 6 * s], [hx + 28 * s * dir, hy + 16 * s], [hx + 22 * s * dir, y - 2 * s]], 1);
    canv += line(tr, INK(), 7 * s);
    canv += line(tr, col, 5 * s);
    for (var i = 2; i < tr.length - 2; i += 4) canv += tick(tr[i][0] - 2 * s, tr[i][1], 4 * s, 0, INK(0.6), 0.7);
    canv += line(bezmh([[hx + 10 * s * dir, hy + 10 * s], [hx + 20 * s * dir, hy + 14 * s], [hx + 24 * s * dir, hy + 10 * s]], 1), Palette.cream, 2.5 * s);
    canv += shape([[hx - 4 * s * dir, hy - 10 * s], [hx - 16 * s * dir, hy - 4 * s], [hx - 14 * s * dir, hy + 12 * s], [hx - 2 * s * dir, hy + 8 * s]], "#5c5862", INK(), 1.1);
    canv += eye(hx + 8 * s * dir, hy - 4 * s, dir, s * 0.8);
    canv += line(bezmh([[f(-L / 2), by - H * 0.5], [f(-L / 2 - 8 * s), by - H * 0.2], [f(-L / 2 - 4 * s), y - 8 * s]], 1), INK(), 1.6 * s);
    if (temple) {
      canv += shape([[f(-22 * s), by - H * 0.95], [f(18 * s), by - H * 0.95], [f(20 * s), by - 2 * s], [f(-24 * s), by - 2 * s]], Palette.red, INK(), 1.1);
      canv += line([[f(-23 * s), by - 6 * s], [f(19 * s), by - 6 * s]], Palette.yellow, 2 * s);
      for (var i = 0; i < 5; i++) canv += dot(f((-18 + i * 9) * s), by - H * 0.55, 2.2 * s, Palette.yellow, INK(), 0.6);
      // nettipattam on the forehead
      canv += shape([[hx - 4 * s * dir, hy - 18 * s], [hx + 10 * s * dir, hy - 16 * s], [hx + 12 * s * dir, hy + 4 * s], [hx - 2 * s * dir, hy + 2 * s]], Palette.yellow, INK(), 1);
      for (var i = 0; i < 4; i++) canv += dot(hx + (2 + i * 2) * s * dir, hy - 12 * s + i * 4.5 * s, 1.3 * s, Palette.red);
      if (!args.noMahout) {
        canv += line([[f(-6 * s), by - H * 0.95], [f(-6 * s), by - H * 1.3]], INK(), 1.2 * s);
        canv += this.man(f(-4 * s), by - H * 0.95 + 2 * s, { sca: s * 0.55, dir: dir, prop: "stick" });
      }
    }
    return canv;
  };

  // peacock walking with its train trailing
  this.peacock = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var dir = args.dir || 1;
    var canv = "";
    var f = function(px) { return x + px * dir; };
    var blue = "#2d5a86", green = "#3e7a46";
    var by = y - 12 * s;
    // train: long feathered leaf trailing behind
    var train = [[f(-4 * s), by - 4 * s], [f(-22 * s), by - 14 * s], [f(-48 * s), by - 10 * s], [f(-56 * s), by], [f(-44 * s), by + 4 * s], [f(-20 * s), by + 2 * s]];
    canv += shape(train, green, INK(), 1.2);
    for (var i = 0; i < 7; i++) {
      var t = (i + 1) / 8;
      var ex = f((-8 - t * 44) * s), ey = by - 4 * s + Math.sin(t * Math.PI) * 2 * s * (i % 2 ? 1 : -1);
      canv += dot(ex, ey, 2.6 * s, blue, INK(), 0.7);
      canv += dot(ex, ey, 1.2 * s, Palette.yellow);
    }
    canv += line([[f(-4 * s), by - 2 * s], [f(-50 * s), by - 4 * s]], INK(0.6), 0.8);
    // legs
    canv += line([[f(0), by + 2 * s], [f(-1 * s), y]], Palette.darkbrown, 1.5 * s);
    canv += line([[f(5 * s), by + 2 * s], [f(6 * s), y]], Palette.darkbrown, 1.5 * s);
    // body and neck
    canv += shape([[f(-6 * s), by - 2 * s], [f(2 * s), by - 8 * s], [f(10 * s), by - 4 * s], [f(10 * s), by + 2 * s], [f(2 * s), by + 6 * s], [f(-6 * s), by + 3 * s]], blue, INK(), 1.2);
    var neck = bezmh([[f(8 * s), by - 4 * s], [f(14 * s), by - 16 * s], [f(12 * s), by - 26 * s]], 1);
    canv += line(neck, INK(), 5 * s);
    canv += line(neck, blue, 3.4 * s);
    canv += dot(f(12 * s), by - 27 * s, 3.5 * s, blue, INK(), 1);
    canv += line([[f(15 * s), by - 27 * s], [f(19 * s), by - 26 * s]], Palette.yellow, 1.6 * s);
    canv += dot(f(13 * s), by - 28 * s, 0.9 * s, Palette.white);
    for (var i = -1; i <= 1; i++) {
      canv += line([[f(12 * s), by - 30 * s], [f((12 + i * 3) * s), by - 36 * s]], INK(), 0.9);
      canv += dot(f((12 + i * 3) * s), by - 36 * s, 1.2 * s, blue, INK(), 0.5);
    }
    return canv;
  };

  // spotted deer
  this.deer = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var dir = args.dir || 1;
    var canv = "";
    var f = function(px) { return x + px * dir; };
    var col = "#b07a3c";
    var by = y - 16 * s;
    for (var i = 0; i < 4; i++) {
      var lx = f([-13, -8, 8, 13][i] * s);
      canv += line([[lx, by - 2 * s], [lx + (i < 2 ? -2 : 2) * s * dir, y]], col, 2.4 * s);
      canv += line([[lx, by - 2 * s], [lx + (i < 2 ? -2 : 2) * s * dir, y]], INK(), 0.6);
    }
    canv += shape([[f(-16 * s), by], [f(14 * s), by], [f(16 * s), by - 12 * s], [f(-15 * s), by - 11 * s]], col, INK(), 1.1);
    var nk = bezmh([[f(14 * s), by - 10 * s], [f(22 * s), by - 20 * s], [f(24 * s), by - 28 * s]], 1);
    canv += line(nk, INK(), 5 * s);
    canv += line(nk, col, 3.6 * s);
    canv += shape([[f(21 * s), by - 31 * s], [f(32 * s), by - 28 * s], [f(31 * s), by - 24 * s], [f(22 * s), by - 25 * s]], col, INK(), 1);
    canv += dot(f(26 * s), by - 28 * s, 1 * s, Palette.black);
    // antlers
    for (var e = 0; e < 2; e++) {
      var ax = f((22 + e * 3) * s), ay = by - 31 * s;
      canv += line([[ax, ay], [ax - 4 * s * dir, ay - 10 * s], [ax - 8 * s * dir, ay - 14 * s]], Palette.darkbrown, 1.3 * s);
      canv += line([[ax - 4 * s * dir, ay - 10 * s], [ax + 1 * s * dir, ay - 15 * s]], Palette.darkbrown, 1.1 * s);
    }
    for (var i = 0; i < 7; i++) canv += dot(f((-12 + Math.random() * 24) * s), by - (2 + Math.random() * 8) * s, 1.1 * s, Palette.white);
    canv += line([[f(-16 * s), by - 10 * s], [f(-20 * s), by - 4 * s]], INK(), 1.2 * s);
    return canv;
  };

  // heron or egret standing in water or paddy
  this.heron = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var dir = args.dir || 1;
    var canv = "";
    var f = function(px) { return x + px * dir; };
    var by = y - 20 * s;
    canv += line([[f(-2 * s), by + 2 * s], [f(-3 * s), y]], Palette.yellow, 1.4 * s);
    canv += line([[f(3 * s), by + 2 * s], [f(5 * s), y]], Palette.yellow, 1.4 * s);
    canv += shape([[f(-12 * s), by - 4 * s], [f(-2 * s), by - 8 * s], [f(8 * s), by - 4 * s], [f(6 * s), by + 4 * s], [f(-6 * s), by + 4 * s]], Palette.white, INK(), 1.1);
    var nk = bezmh([[f(6 * s), by - 6 * s], [f(14 * s), by - 14 * s], [f(10 * s), by - 28 * s]], 1);
    canv += line(nk, INK(), 3.6 * s);
    canv += line(nk, Palette.white, 2.4 * s);
    canv += dot(f(10 * s), by - 29 * s, 2.6 * s, Palette.white, INK(), 1);
    canv += line([[f(12 * s), by - 29 * s], [f(20 * s), by - 28 * s]], Palette.yellow, 1.5 * s);
    canv += dot(f(10.5 * s), by - 30 * s, 0.8 * s, Palette.black);
    canv += line([[f(-12 * s), by - 4 * s], [f(-18 * s), by - 2 * s]], INK(), 1 * s);
    return canv;
  };

  // fish laid out on the sand
  this.fish = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var canv = "";
    var n = 2 + Math.floor(Math.random() * 4);
    for (var i = 0; i < n; i++) {
      var fx = x + i * 14 * s, fy = y - 3 * s;
      var fd = i % 2 ? -1 : 1;
      canv += shape([[fx - 9 * s * fd, fy], [fx, fy - 4 * s], [fx + 8 * s * fd, fy], [fx, fy + 4 * s]], Palette.cream, INK(), 1);
      canv += shape([[fx - 9 * s * fd, fy], [fx - 13 * s * fd, fy - 4 * s], [fx - 13 * s * fd, fy + 4 * s]], Palette.cream, INK(), 1);
      canv += dot(fx + 4 * s * fd, fy - 1 * s, 1 * s, Palette.black);
      canv += line([[fx - 4 * s * fd, fy - 2 * s], [fx - 4 * s * fd, fy + 2 * s]], INK(0.6), 0.7);
    }
    return canv;
  };

  this.crab = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var canv = "";
    var cy = y - 4 * s;
    for (var e = -1; e <= 1; e += 2) {
      for (var i = 0; i < 3; i++) {
        canv += line([[x + e * 5 * s, cy - 2 * s + i * 2 * s], [x + e * (10 + i) * s, cy + 1 * s + i * 2 * s]], INK(), 1.1 * s);
      }
      canv += line([[x + e * 6 * s, cy - 3 * s], [x + e * 10 * s, cy - 8 * s]], INK(), 1.4 * s);
      canv += dot(x + e * 10 * s, cy - 8 * s, 1.8 * s, Palette.orange, INK(), 0.8);
    }
    canv += dot(x, cy, 6 * s, Palette.orange, INK(), 1);
    canv += dot(x - 2 * s, cy - 5 * s, 0.9 * s, Palette.black);
    canv += dot(x + 2 * s, cy - 5 * s, 0.9 * s, Palette.black);
    return canv;
  };

  // royal procession: the king on a caparisoned elephant under a parasol,
  // a flag bearer with the tiger banner, spearmen and drummers
  this.procession = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var dir = args.dir || 1;
    var canv = "";
    var f = function(px) { return x + px * dir; };
    canv += this.man(f(150 * s), y, { sca: s, dir: dir, prop: "flag" });
    canv += this.man(f(120 * s), y + 2, { sca: s, dir: dir, prop: "spear" });
    canv += this.man(f(100 * s), y - 2, { sca: s, dir: dir, prop: "spear" });
    // elephant with howdah cloth and the king
    canv += this.elephant(f(30 * s), y, { sca: s, dir: dir, temple: true, noMahout: true });
    var ty = y - 26 * s - 42 * s * 0.95;
    canv += shape([[f(-10 * s), ty + 2 * s], [f(22 * s), ty + 2 * s], [f(20 * s), ty - 6 * s], [f(-8 * s), ty - 6 * s]], Palette.yellow, INK(), 1);
    canv += this.man(f(6 * s), ty - 4 * s, { sca: s * 0.75, dir: dir, king: true });
    // parasol
    var px = f(6 * s), py = ty - 4 * s - 64 * s * 0.75 - 14 * s;
    canv += line([[f(-6 * s), ty - 6 * s], [px, py]], Palette.darkbrown, 1.5 * s);
    var um = [];
    for (var i = 0; i <= 12; i++) {
      var t = Math.PI + (i / 12) * Math.PI;
      um.push([px + Math.cos(t) * 24 * s, py + Math.sin(t) * 12 * s]);
    }
    canv += shape(um, Palette.red, INK(), 1.1);
    for (var i = 0; i <= 8; i++) canv += dot(px - 24 * s + (i / 8) * 48 * s, py + 2 * s, 1.5 * s, Palette.yellow);
    canv += line([[px, py - 12 * s], [px, py - 18 * s]], INK(), 1.2 * s);
    canv += dot(px, py - 18 * s, 2 * s, Palette.yellow, INK(), 0.7);
    canv += this.man(f(-50 * s), y + 2, { sca: s, dir: dir, prop: "drum" });
    canv += this.man(f(-74 * s), y - 2, { sca: s, dir: dir, prop: "drum" });
    canv += this.man(f(-100 * s), y, { sca: s, dir: dir, prop: "spear" });
    canv += this.man(f(-122 * s), y + 2, { sca: s, dir: dir, prop: "spear" });
    return canv;
  };

  // peacock with the train fanned open
  this.peacockDisplay = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var dir = args.dir || 1;
    var canv = "";
    var f = function(px) { return x + px * dir; };
    var blue = "#2d5a86", green = "#3e7a46";
    var cx = f(-4 * s), cy = y - 22 * s;
    var R = 42 * s;
    var fan = [[cx, cy]];
    for (var i = 0; i <= 24; i++) {
      var t = Math.PI * 1.05 + (i / 24) * Math.PI * 0.9;
      var rr = R * (1 + 0.06 * (i % 2));
      fan.push([cx + Math.cos(t) * rr, cy + Math.sin(t) * rr]);
    }
    canv += shape(fan, green, INK(), 1.2);
    for (var i = 0; i <= 12; i++) {
      var t = Math.PI * 1.08 + (i / 12) * Math.PI * 0.84;
      canv += line([[cx, cy], [cx + Math.cos(t) * R * 0.95, cy + Math.sin(t) * R * 0.95]], Palette.darkgreen, 0.8);
      var ex = cx + Math.cos(t) * R * 0.78, ey = cy + Math.sin(t) * R * 0.78;
      canv += dot(ex, ey, 3.2 * s, blue, INK(), 0.7);
      canv += dot(ex, ey, 1.6 * s, Palette.yellow);
      canv += dot(ex, ey, 0.7 * s, Palette.black);
      if (i < 12) {
        var t2 = t + Math.PI * 0.035;
        canv += dot(cx + Math.cos(t2) * R * 0.5, cy + Math.sin(t2) * R * 0.5, 2 * s, blue, INK(), 0.5);
        canv += dot(cx + Math.cos(t2) * R * 0.5, cy + Math.sin(t2) * R * 0.5, 0.9 * s, Palette.yellow);
      }
    }
    var by = y - 12 * s;
    canv += line([[f(0), by + 2 * s], [f(-1 * s), y]], Palette.darkbrown, 1.5 * s);
    canv += line([[f(5 * s), by + 2 * s], [f(6 * s), y]], Palette.darkbrown, 1.5 * s);
    canv += shape([[f(-6 * s), by - 2 * s], [f(2 * s), by - 8 * s], [f(10 * s), by - 4 * s], [f(10 * s), by + 2 * s], [f(2 * s), by + 6 * s], [f(-6 * s), by + 3 * s]], blue, INK(), 1.2);
    var neck = bezmh([[f(8 * s), by - 4 * s], [f(14 * s), by - 16 * s], [f(12 * s), by - 26 * s]], 1);
    canv += line(neck, INK(), 5 * s);
    canv += line(neck, blue, 3.4 * s);
    canv += dot(f(12 * s), by - 27 * s, 3.5 * s, blue, INK(), 1);
    canv += line([[f(15 * s), by - 27 * s], [f(19 * s), by - 26 * s]], Palette.yellow, 1.6 * s);
    canv += dot(f(13 * s), by - 28 * s, 0.9 * s, Palette.white);
    for (var i = -1; i <= 1; i++) {
      canv += line([[f(12 * s), by - 30 * s], [f((12 + i * 3) * s), by - 36 * s]], INK(), 0.9);
      canv += dot(f((12 + i * 3) * s), by - 36 * s, 1.2 * s, blue, INK(), 0.5);
    }
    return canv;
  };
  // a peahen, brown and plain
  this.peahen = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var dir = args.dir || 1;
    var f = function(px) { return x + px * dir; };
    var canv = "";
    var by = y - 10 * s;
    canv += line([[f(0), by + 2 * s], [f(-1 * s), y]], Palette.darkbrown, 1.4 * s);
    canv += line([[f(5 * s), by + 2 * s], [f(6 * s), y]], Palette.darkbrown, 1.4 * s);
    canv += shape([[f(-14 * s), by - 2 * s], [f(-6 * s), by - 4 * s], [f(2 * s), by - 7 * s], [f(9 * s), by - 3 * s], [f(9 * s), by + 2 * s], [f(2 * s), by + 5 * s], [f(-6 * s), by + 3 * s]], "#8a7a5a", INK(), 1.1);
    var neck = bezmh([[f(7 * s), by - 4 * s], [f(12 * s), by - 13 * s], [f(10 * s), by - 21 * s]], 1);
    canv += line(neck, INK(), 4 * s);
    canv += line(neck, "#3e7a46", 2.8 * s);
    canv += dot(f(10 * s), by - 22 * s, 3 * s, "#3e7a46", INK(), 0.9);
    canv += line([[f(13 * s), by - 22 * s], [f(16 * s), by - 21 * s]], Palette.yellow, 1.4 * s);
    canv += dot(f(11 * s), by - 23 * s, 0.8 * s, Palette.white);
    return canv;
  };
}();
