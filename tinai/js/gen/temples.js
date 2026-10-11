// Great temples: the Meenakshi temple of Madurai with its four towering
// painted gopurams, and a Shiva temple with the lingam in its sanctum.
var Temples = new function() {
  var STONE = "#d6cbb0", STONE2 = "#b3a689", STONE3 = "#8d8068";

  // a Madurai gopuram: very tall, slightly concave sides, every tier
  // crowded with painted stucco figures, a long barrel roof with many
  // kalasams and horned ends
  this.maduraiGopuram = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var tiers = args.tiers || 9;
    var canv = "";
    var W = 110 * s, baseH = 60 * s;
    canv += shape([[x - W / 2 - 6 * s, y], [x + W / 2 + 6 * s, y], [x + W / 2 + 6 * s, y - 10 * s], [x - W / 2 - 6 * s, y - 10 * s]], STONE2, INK(), 1.2);
    canv += shape([[x - W / 2, y - 10 * s], [x + W / 2, y - 10 * s], [x + W / 2 - 2 * s, y - baseH], [x - W / 2 + 2 * s, y - baseH]], STONE, INK(), 1.3);
    canv += shape([[x - 9 * s, y - 10 * s], [x + 9 * s, y - 10 * s], [x + 9 * s, y - baseH * 0.78], [x - 9 * s, y - baseH * 0.78]], Palette.black, INK(), 1);
    canv += shape([[x - 11 * s, y - baseH * 0.78], [x + 11 * s, y - baseH * 0.78], [x + 11 * s, y - baseH * 0.86], [x - 11 * s, y - baseH * 0.86]], Palette.yellow, INK(), 0.8);
    for (var i = -3; i <= 3; i++) if (i != 0) {
      var px = x + i * W / 7.5;
      canv += line([[px, y - 14 * s], [px, y - baseH + 4 * s]], STONE3, 2 * s);
      if (Math.abs(i) == 2) canv += shape([[px - 5 * s, y - 20 * s], [px + 5 * s, y - 20 * s], [px + 5 * s, y - baseH + 12 * s], [px - 5 * s, y - baseH + 12 * s]], STONE3, INK(0.7), 0.8);
    }
    canv += line([[x - W / 2, y - baseH * 0.3], [x + W / 2, y - baseH * 0.3]], Palette.red, 3 * s);
    canv += line([[x - W / 2, y - baseH * 0.6], [x + W / 2, y - baseH * 0.6]], Palette.white, 2 * s);
    var cy = y - baseH;
    var cw = W * 0.96;
    var th = 22 * s;
    var cols = [Palette.green, Palette.red, "#2d6fa8", Palette.orange, Palette.yellow, "#d98aa0", Palette.white];
    for (var t = 0; t < tiers; t++) {
      // concave taper: shrinks faster at the bottom
      var nw = cw * (0.90 - 0.03 * Math.exp(-t * 0.5));
      canv += shape([[x - cw / 2, cy], [x + cw / 2, cy], [x + nw / 2, cy - th], [x - nw / 2, cy - th]], t % 2 ? Palette.paleyellow : Palette.cream, INK(), 1.1);
      // crowded stucco figures: a row across each tier, bigger ones at the corners
      var nk = Math.max(3, Math.floor(nw / (8 * s)));
      for (var k = 0; k < nk; k++) {
        var fx = x + ((k + 0.5) / nk - 0.5) * nw * 0.94;
        var fc = cols[(k * 3 + t) % cols.length];
        var fh = th * (k == 0 || k == nk - 1 ? 0.8 : 0.62);
        canv += shape([[fx - 2.6 * s, cy - 3 * s], [fx + 2.6 * s, cy - 3 * s], [fx + 2 * s, cy - fh], [fx - 2 * s, cy - fh]], fc, INK(0.8), 0.6);
        canv += dot(fx, cy - fh - 1.6 * s, 1.7 * s, "#9a5a34", INK(0.8), 0.5);
        if (k % 2 == 0) canv += dot(fx, cy - fh - 3.8 * s, 1.2 * s, Palette.yellow); // crown
      }
      // small kudu arches above the figures
      var na = Math.max(2, Math.floor(nw / (16 * s)));
      for (var k = 0; k < na; k++) {
        var ax = x + ((k + 0.5) / na - 0.5) * nw * 0.85;
        var arc = [];
        for (var j = 0; j <= 8; j++) { var a = Math.PI + (j / 8) * Math.PI; arc.push([ax + Math.cos(a) * 3.2 * s, cy - th + 7 * s + Math.sin(a) * 3.6 * s]); }
        canv += shape(arc, Palette.darkred, INK(0.6), 0.5);
      }
      // cornice
      canv += shape([[x - nw / 2 - 4 * s, cy - th], [x + nw / 2 + 4 * s, cy - th], [x + nw / 2 + 1 * s, cy - th - 4 * s], [x - nw / 2 - 1 * s, cy - th - 4 * s]], Palette.red, INK(), 0.9);
      canv += line([[x - nw / 2 - 3 * s, cy - th - 1.5 * s], [x + nw / 2 + 3 * s, cy - th - 1.5 * s]], Palette.yellow, 1 * s);
      cy -= th + 4 * s;
      cw = nw;
      th *= 0.95;
    }
    // sala roof with upturned horned ends
    var rh = 20 * s;
    var pts = [[x - cw * 0.58, cy + 2 * s], [x - cw * 0.62, cy - rh * 0.6]];
    for (var i = 0; i <= 16; i++) { var t = Math.PI + (i / 16) * Math.PI; pts.push([x + Math.cos(t) * cw * 0.5, cy - rh * 0.2 + Math.sin(t) * rh]); }
    pts.push([x + cw * 0.62, cy - rh * 0.6]);
    pts.push([x + cw * 0.58, cy + 2 * s]);
    canv += shape(pts, Palette.yellow, INK(), 1.3);
    canv += line([[x - cw * 0.5, cy - rh * 0.55], [x + cw * 0.5, cy - rh * 0.55]], Palette.red, 2 * s);
    for (var e = -1; e <= 1; e += 2) {
      canv += shape([[x + e * cw * 0.56, cy - rh * 0.5], [x + e * cw * 0.66, cy - rh * 0.95], [x + e * cw * 0.6, cy - rh * 0.55]], Palette.red, INK(), 0.9);
      canv += dot(x + e * cw * 0.66, cy - rh * 0.95, 2.4 * s, Palette.yellow, INK(), 0.7);
    }
    var nk = Math.max(5, Math.floor(cw / (7 * s)));
    for (var k = 0; k < nk; k++) {
      var kx = x + ((k + 0.5) / nk - 0.5) * cw * 0.9;
      var ky = cy - rh * 0.2 - rh * Math.sqrt(Math.max(0, 1 - Math.pow(((k + 0.5) / nk - 0.5) * 1.8, 2)));
      canv += dot(kx, ky - 3 * s, 2.4 * s, Palette.yellow, INK(), 0.9);
      canv += line([[kx, ky - 5 * s], [kx, ky - 11 * s]], INK(), 1.2 * s);
    }
    return canv;
  };

  // the Meenakshi temple: four gopurams around a walled compound, the
  // golden vimana and the lotus tank within, elephants and pilgrims at the gate
  this.meenakshi = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var canv = "";
    var W = 300 * s, H = 26 * s;
    // back gopurams, slightly smaller and paler, behind the wall
    canv += this.maduraiGopuram(x - W * 0.22, y - H - 16 * s, { sca: s * 0.78, tiers: 8 });
    canv += this.maduraiGopuram(x + W * 0.22, y - H - 16 * s, { sca: s * 0.78, tiers: 8 });
    // the golden vimana of Meenakshi, the thousand-pillared hall, and the tank
    canv += Arch.vimana(x, y - H - 4 * s, { sca: s * 0.6, tiers: 4 });
    canv += Arch.mandapam(x - 110 * s, y - H + 1, { sca: s * 0.7 });
    canv += Arch.tank(x + 110 * s, y - H + 2, { sca: s * 0.55 });
    // compound wall with the painted stripes of Madurai
    canv += shape([[x - W, y], [x + W, y], [x + W, y - H], [x - W, y - H]], Palette.cream, INK(), 1.3);
    for (var i = 0; i < 4; i++) canv += line([[x - W, y - 3 * s - i * 6 * s], [x + W, y - 3 * s - i * 6 * s]], i % 2 ? Palette.white : Palette.red, 4 * s);
    for (var i = -13; i <= 13; i++) canv += line([[x + i * 22 * s, y - H], [x + i * 22 * s, y - H - 5 * s]], INK(), 1.5 * s);
    // the two front gopurams, east and west, taller
    canv += this.maduraiGopuram(x - W * 0.62, y + 2, { sca: s, tiers: 9 });
    canv += this.maduraiGopuram(x + W * 0.62, y + 2, { sca: s, tiers: 9 });
    // flag post and bali peetam at the east gate, the temple elephant, pilgrims
    canv += Arch.flagpost(x - W * 0.3, y + 2, { sca: s * 0.9 });
    canv += shape([[x - W * 0.36, y + 2], [x - W * 0.33, y + 2], [x - W * 0.335, y - 10 * s], [x - W * 0.355, y - 10 * s]], STONE2, INK(), 1);
    canv += Figures.elephant(x + 30 * s, y + 6, { sca: s * 0.8, dir: -1, temple: true });
    canv += Figures.woman(x - 120 * s, y + 6, { sca: s * 0.8, dir: 1, prop: "pot" });
    canv += Figures.woman(x - 100 * s, y + 8, { sca: s * 0.8, dir: 1 });
    canv += Figures.man(x - 80 * s, y + 6, { sca: s * 0.8, dir: 1, zari: true });
    canv += People.garlandSeller(x + 120 * s, y + 6, { sca: s * 0.8, dir: -1 });
    canv += People.priest(x - 10 * s, y + 8, { sca: s * 0.8, dir: 1 });
    return canv;
  };

  // Shiva temple: a sanctum open at the front showing the lingam under a
  // dripping pot, a vimana above, Nandi facing it, a bathing ghat
  this.shivaTemple = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var canv = "";
    var W = 90 * s, H = 50 * s;
    canv += shape([[x - W / 2 - 8 * s, y], [x + W / 2 + 8 * s, y], [x + W / 2 + 8 * s, y - 8 * s], [x - W / 2 - 8 * s, y - 8 * s]], STONE2, INK(), 1.2);
    canv += shape([[x - W / 2, y - 8 * s], [x + W / 2, y - 8 * s], [x + W / 2, y - H], [x - W / 2, y - H]], STONE, INK(), 1.3);
    // open sanctum
    canv += shape([[x - 18 * s, y - 8 * s], [x + 18 * s, y - 8 * s], [x + 18 * s, y - H + 10 * s], [x - 18 * s, y - H + 10 * s]], "#3a3028", INK(), 1);
    canv += People.lingam(x, y - 10 * s, { sca: s * 0.7 });
    // the pot dripping water over the lingam
    canv += line([[x, y - H + 10 * s], [x, y - H + 16 * s]], INK(), 1 * s);
    canv += shape([[x - 4 * s, y - H + 16 * s], [x + 4 * s, y - H + 16 * s], [x + 3 * s, y - H + 22 * s], [x - 3 * s, y - H + 22 * s]], Palette.orange, INK(), 0.8);
    canv += line([[x, y - H + 22 * s], [x, y - 24 * s]], "rgba(140,170,200,0.8)", 0.8);
    for (var i = 0; i < 4; i++) canv += dot(x + (i % 2 ? 2 : -2) * s, y - H + 24 * s + i * 4 * s, 0.6 * s, Palette.white);
    // lamps either side of the door, pilasters, a red and white band
    for (var e = -1; e <= 1; e += 2) {
      canv += line([[x + e * 32 * s, y - 10 * s], [x + e * 32 * s, y - H + 4 * s]], STONE3, 2 * s);
      canv += dot(x + e * 22 * s, y - 20 * s, 2 * s, Palette.yellow, INK(), 0.6);
      canv += dot(x + e * 22 * s, y - 23 * s, 1.1 * s, Palette.orange);
    }
    canv += line([[x - W / 2, y - 12 * s], [x + W / 2, y - 12 * s]], Palette.red, 2.5 * s);
    canv += line([[x - W / 2, y - 15 * s], [x + W / 2, y - 15 * s]], Palette.white, 1.5 * s);
    canv += Arch.vimana(x, y - H + 2, { sca: s * 0.7, tiers: 4 });
    // trident banner on the roof corner and the bull before the door
    canv += line([[x + W / 2 - 4 * s, y - H], [x + W / 2 - 4 * s, y - H - 22 * s]], INK(), 1.2 * s);
    for (var i = -1; i <= 1; i++) canv += line([[x + W / 2 - 4 * s + i * 3 * s, y - H - 18 * s], [x + W / 2 - 4 * s + i * 3 * s, y - H - 25 * s]], INK(), 1.2 * s);
    canv += Arch.nandi(x + 46 * s, y + 4, { sca: s * 0.8, dir: -1 });
    canv += Built.lampTower(x - 58 * s, y + 2, { sca: s * 0.7 });
    canv += People.priest(x - 36 * s, y + 6, { sca: s * 0.75, dir: 1 });
    canv += Figures.woman(x + 80 * s, y + 6, { sca: s * 0.75, dir: -1 });
    return canv;
  };

  // small roadside Shiva shrine: lingam under a stone canopy with Nandi
  this.lingaShrine = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var canv = "";
    for (var e = -1; e <= 1; e += 2) canv += shape([[x + e * 14 * s - 2.5 * s, y], [x + e * 14 * s + 2.5 * s, y], [x + e * 14 * s + 2 * s, y - 26 * s], [x + e * 14 * s - 2 * s, y - 26 * s]], STONE, INK(), 1);
    canv += shape([[x - 20 * s, y - 26 * s], [x + 20 * s, y - 26 * s], [x + 16 * s, y - 33 * s], [x - 16 * s, y - 33 * s]], STONE2, INK(), 1);
    canv += shape([[x - 10 * s, y - 33 * s], [x + 10 * s, y - 33 * s], [x + 4 * s, y - 42 * s], [x - 4 * s, y - 42 * s]], Palette.red, INK(), 0.9);
    canv += line([[x, y - 42 * s], [x, y - 48 * s]], INK(), 1.1 * s);
    canv += People.lingam(x, y + 1, { sca: s * 0.7 });
    canv += Arch.nandi(x + 32 * s, y + 3, { sca: s * 0.5, dir: -1 });
    for (var i = 0; i < 4; i++) canv += dot(x - 8 * s + i * 5 * s, y - 15 * s, 1.1 * s, i % 2 ? Palette.white : Palette.orange);
    return canv;
  };
}();
