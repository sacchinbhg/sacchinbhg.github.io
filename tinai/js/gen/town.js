// Nagaram: the busy streets of Madurai. Shophouses, awnings, signboards,
// bunting, crowds. A town weight from its own slow noise says how much of
// the street is present at any x.
var Town = new function() {
  var STONE2 = "#b3a689", STONE3 = "#8d8068", TILE = "#a0462a";
  var WALLS = [Palette.cream, Palette.paleyellow, "#e8c9b0", "#d9e2c6", "#f1d9d2", "#dcd3b8"];
  var SHUT = [Palette.green, "#2d6fa8", Palette.red, Palette.darkgreen];
  // the contiguous stretch of town around x, as [start, end], cached
  this.segCache = {};
  this.segment = function(x) {
    if (Tinai.town(x) < 0.25) return null;
    var a = x, b = x;
    while (Tinai.town(a - 32) >= 0.25 && x - a < 12000) a -= 32;
    while (Tinai.town(b + 32) >= 0.25 && b - x < 12000) b += 32;
    var key = "" + a;
    if (!this.segCache[key]) {
      // only a real town gets its temple: long enough, and strong somewhere
      var peak = 0;
      for (var q = a; q <= b; q += 64) peak = Math.max(peak, Tinai.town(q));
      if (b - a < 1400 || peak < 0.6) { this.segCache[key] = null; return null; }
      var saved = Prng.s;
      seedFrom(SEED + "|street|" + a);
      // the temple closes the street at one end; which end is decided here
      var east = Math.random() < 0.5;
      this.segCache[key] = { start: a, end: b, center: Math.round((a + b) / 2), templeX: east ? b - 470 : a + 470, templeDir: east ? -1 : 1, sca: 1.05 + Math.random() * 0.15 };
      Prng.s = saved;
    }
    return this.segCache[key];
  };

  this.KINDS = ["textileshop", "flowershop", "brassshop", "teastall", "sweetshop", "bangleshop", "fruitshop", "potshop", "tailor", "riceshop"];

  function roof(x0, x1, y, h) {
    var out = shape([[x0 - 6, y], [x1 + 6, y], [x1 - 3, y - h], [x0 + 3, y - h]], TILE, INK(), 1.1);
    for (var i = 1; i < 4; i++) out += line([[x0 - 6 + (i / 4) * 9, y - (i / 4) * h], [x1 + 6 - (i / 4) * 9, y - (i / 4) * h]], INK(0.45), 0.6);
    for (var xx = x0; xx < x1; xx += 7) out += line([[xx, y], [xx + 2, y - h]], INK(0.3), 0.5);
    return out;
  }
  function script(x, y, w, col) {
    // a signboard's lettering as a wiggle of short strokes
    var out = "";
    var n = Math.floor(w / 5);
    for (var i = 0; i < n; i++) {
      var sx = x - w / 2 + i * 5 + 1;
      var r = Math.random();
      if (r < 0.4) out += line([[sx, y - 2], [sx + 1.5, y + 1], [sx + 3, y - 2]], col, 0.8);
      else if (r < 0.7) out += line([[sx, y + 1], [sx + 1.5, y - 2], [sx + 3, y + 1]], col, 0.8);
      else out += line([[sx, y - 1.5], [sx + 3, y - 1.5], [sx + 1.5, y + 1.5]], col, 0.8);
    }
    return out;
  }
  function goods(kind, x, y, s, w) {
    var out = "";
    var cols = [Palette.red, Palette.green, "#2d6fa8", Palette.orange, Palette.yellow, "#d98aa0", Palette.white, "#7a5a8a"];
    if (kind == "textileshop") {
      for (var r = 0; r < 4; r++) for (var i = 0; i < 3; i++) out += shape([[x - w / 2 + 3 * s + i * (w / 3), y - 4 * s - r * 6 * s], [x - w / 2 + i * (w / 3) + w / 3 - 1 * s, y - 4 * s - r * 6 * s], [x - w / 2 + i * (w / 3) + w / 3 - 1 * s, y - 9 * s - r * 6 * s], [x - w / 2 + 3 * s + i * (w / 3), y - 9 * s - r * 6 * s]], cols[(r * 3 + i) % 8], INK(0.7), 0.6);
      out += shape([[x + w / 2 - 2 * s, y - 2 * s], [x + w / 2 + 10 * s, y - 2 * s], [x + w / 2 + 10 * s, y - 30 * s], [x + w / 2 - 2 * s, y - 30 * s]], cols[Math.floor(Math.random() * 8)], INK(), 0.8); // a hanging sari
      out += line([[x + w / 2 - 2 * s, y - 26 * s], [x + w / 2 + 10 * s, y - 26 * s]], Palette.yellow, 1.5 * s);
    } else if (kind == "flowershop") {
      for (var i = 0; i < 6; i++) { var gx = x - w / 2 + 4 * s + i * (w - 8 * s) / 5; for (var j = 0; j < 7; j++) out += dot(gx, y - 28 * s + j * 3.6 * s, 1.6 * s, [Palette.white, Palette.orange, Palette.red, Palette.yellow][(i + j) % 4], INK(0.5), 0.3); }
      for (var i = 0; i < 12; i++) out += dot(x - w / 2 + 3 * s + Math.random() * (w - 6 * s), y - 2 * s - Math.random() * 4 * s, 1.6 * s, [Palette.white, Palette.orange, "#d98aa0"][i % 3]);
    } else if (kind == "brassshop") {
      for (var r = 0; r < 3; r++) for (var i = 0; i < 4; i++) { var px = x - w / 2 + 6 * s + i * (w - 12 * s) / 3, py = y - 3 * s - r * 8 * s; out += shape([[px - 3 * s, py], [px + 3 * s, py], [px + 3.6 * s, py - 4 * s], [px + 2 * s, py - 6.5 * s], [px - 2 * s, py - 6.5 * s], [px - 3.6 * s, py - 4 * s]], Palette.yellow, INK(0.8), 0.6); }
      for (var i = 0; i < 3; i++) out += dot(x - w / 2 + 8 * s + i * 10 * s, y - 30 * s, 3 * s, Palette.yellow, INK(0.8), 0.6);
    } else if (kind == "teastall") {
      out += shape([[x - w / 2 + 2 * s, y], [x + w / 2 - 2 * s, y], [x + w / 2 - 2 * s, y - 10 * s], [x - w / 2 + 2 * s, y - 10 * s]], Palette.darkbrown, INK(), 0.8);
      for (var i = 0; i < 5; i++) out += shape([[x - w / 2 + 5 * s + i * 6 * s, y - 10 * s], [x - w / 2 + 8 * s + i * 6 * s, y - 10 * s], [x - w / 2 + 7.5 * s + i * 6 * s, y - 13 * s], [x - w / 2 + 5.5 * s + i * 6 * s, y - 13 * s]], Palette.cream, INK(0.7), 0.5);
      out += shape([[x + w / 2 - 14 * s, y - 10 * s], [x + w / 2 - 6 * s, y - 10 * s], [x + w / 2 - 7 * s, y - 20 * s], [x + w / 2 - 13 * s, y - 20 * s]], Palette.yellow, INK(), 0.7); // samovar
      out += anim("smoke", line([[x + w / 2 - 10 * s, y - 20 * s], [x + w / 2 - 9 * s, y - 28 * s]], "rgba(200,200,200,0.6)", 1.5 * s), -Math.random() * 4);
      out += Figures.man(x, y - 10 * s, { sca: s * 0.5, dir: 1 });
    } else if (kind == "sweetshop") {
      for (var r = 0; r < 2; r++) for (var i = 0; i < 5; i++) { var px = x - w / 2 + 5 * s + i * (w - 10 * s) / 4, py = y - 3 * s - r * 11 * s; out += shape([[px - 3 * s, py], [px + 3 * s, py], [px + 3 * s, py - 8 * s], [px - 3 * s, py - 8 * s]], "rgba(240,230,200,0.7)", INK(0.8), 0.6); out += dot(px, py - 4 * s, 2 * s, [Palette.orange, Palette.yellow, Palette.red, Palette.white, Palette.brown][(i + r) % 5]); }
    } else if (kind == "bangleshop") {
      for (var i = 0; i < 7; i++) { var bx = x - w / 2 + 4 * s + i * (w - 8 * s) / 6; for (var j = 0; j < 9; j++) out += line([[bx - 2 * s, y - 26 * s + j * 2.8 * s], [bx + 2 * s, y - 26 * s + j * 2.8 * s]], cols[(i * 2 + j) % 8], 1.4 * s); }
    } else if (kind == "fruitshop") {
      for (var i = 0; i < 4; i++) { var px = x - w / 2 + 6 * s + i * (w - 12 * s) / 3; for (var j = 0; j < 6; j++) out += dot(px + (j % 3 - 1) * 3 * s, y - 2 * s - Math.floor(j / 3) * 3 * s, 2.2 * s, [Palette.yellow, Palette.orange, Palette.green, Palette.red][i], INK(0.6), 0.4); }
      for (var i = 0; i < 3; i++) for (var j = 0; j < 4; j++) out += line([[x - w / 2 + 8 * s + i * 14 * s + j * 2 * s, y - 30 * s], [x - w / 2 + 6 * s + i * 14 * s + j * 2 * s, y - 20 * s]], Palette.yellow, 2 * s);
    } else if (kind == "potshop") {
      for (var r = 0; r < 3; r++) for (var i = 0; i < 4 - r; i++) { var px = x - w / 2 + 8 * s + i * 9 * s + r * 4.5 * s, py = y - 2 * s - r * 7 * s; out += shape([[px - 3.5 * s, py], [px + 3.5 * s, py], [px + 4 * s, py - 4 * s], [px + 2.5 * s, py - 7 * s], [px - 2.5 * s, py - 7 * s], [px - 4 * s, py - 4 * s]], Palette.orange, INK(0.8), 0.6); }
    } else if (kind == "tailor") {
      out += shape([[x - w / 2 + 4 * s, y - 8 * s], [x + w / 2 - 4 * s, y - 8 * s], [x + w / 2 - 4 * s, y - 11 * s], [x - w / 2 + 4 * s, y - 11 * s]], Palette.darkbrown, INK(), 0.7);
      out += shape([[x - 6 * s, y - 11 * s], [x + 6 * s, y - 11 * s], [x + 5 * s, y - 17 * s], [x - 5 * s, y - 17 * s]], Palette.black, INK(), 0.6); // sewing machine
      out += Figures.man(x + 12 * s, y, { sca: s * 0.5, dir: -1 });
      for (var i = 0; i < 4; i++) out += shape([[x - w / 2 + 4 * s + i * 7 * s, y - 30 * s], [x - w / 2 + 9 * s + i * 7 * s, y - 30 * s], [x - w / 2 + 9 * s + i * 7 * s, y - 18 * s], [x - w / 2 + 4 * s + i * 7 * s, y - 18 * s]], cols[i % 8], INK(0.7), 0.5);
    } else if (kind == "riceshop") {
      for (var i = 0; i < 5; i++) { var px = x - w / 2 + 6 * s + i * (w - 12 * s) / 4; out += shape([[px - 4 * s, y], [px + 4 * s, y], [px + 3 * s, y - 9 * s], [px - 3 * s, y - 9 * s]], "#c9b48a", INK(), 0.7); out += dot(px, y - 9 * s, 3 * s, [Palette.white, Palette.paleyellow, "#c9a86a", "#8a6a3a", Palette.yellow][i], INK(0.6), 0.4); }
      out += shape([[x - 6 * s, y - 20 * s], [x + 6 * s, y - 20 * s], [x + 6 * s, y - 24 * s], [x - 6 * s, y - 24 * s]], Palette.yellow, INK(0.7), 0.5); // scales
      out += line([[x, y - 24 * s], [x, y - 30 * s]], INK(), 0.8);
    }
    return out;
  }

  // a shophouse: open shop below, living floor above, tiled roof
  this.shop = function(x, y, args) {
    var args = args || {};
    var s = args.sca || 1;
    var kind = args.kind || this.KINDS[Math.floor(Math.random() * this.KINDS.length)];
    if (args.scene == undefined && args.upper != false) { var rs = Math.random(); args.scene = rs < 0.1 ? "lover" : rs < 0.18 ? "grandmother" : rs < 0.28 ? "cat" : null; }
    var W = (args.width || 80) * s, H1 = 40 * s, H2 = (args.upper == false ? 0 : 28 * s);
    var wall = args.wall || WALLS[Math.floor(Math.random() * WALLS.length)];
    var canv = "";
    canv += shape([[x - W / 2, y], [x + W / 2, y], [x + W / 2, y - 8 * s], [x - W / 2, y - 8 * s]], STONE2, INK(), 1);
    canv += shape([[x - W / 2, y - 8 * s], [x + W / 2, y - 8 * s], [x + W / 2, y - H1], [x - W / 2, y - H1]], wall, INK(), 1.2);
    var ow = W * 0.6;
    canv += shape([[x - ow / 2, y - 8 * s], [x + ow / 2, y - 8 * s], [x + ow / 2, y - H1 + 5 * s], [x - ow / 2, y - H1 + 5 * s]], "#2e2418", INK(), 1);
    canv += goods(kind, x, y - 8 * s, s, ow);
    for (var e = -1; e <= 1; e += 2) canv += shape([[x + e * ow / 2 - 2 * s, y - 8 * s], [x + e * ow / 2 + 2 * s, y - 8 * s], [x + e * ow / 2 + 2 * s, y - H1 + 4 * s], [x + e * ow / 2 - 2 * s, y - H1 + 4 * s]], Palette.darkbrown, INK(), 0.8);
    // awning
    var ac = Math.random() < 0.5 ? [Palette.red, Palette.white] : [Palette.green, Palette.paleyellow];
    var aw = [[x - ow / 2 - 4 * s, y - H1 + 6 * s], [x + ow / 2 + 4 * s, y - H1 + 6 * s], [x + ow / 2 + 10 * s, y - H1 + 14 * s], [x - ow / 2 - 10 * s, y - H1 + 14 * s]];
    canv += shape(aw, ac[0], INK(), 1);
    for (var i = 1; i < 6; i += 2) canv += shape([[aw[0][0] + (i / 6) * (ow + 8 * s), aw[0][1]], [aw[0][0] + ((i + 1) / 6) * (ow + 8 * s), aw[0][1]], [aw[3][0] + ((i + 1) / 6) * (ow + 20 * s), aw[3][1]], [aw[3][0] + (i / 6) * (ow + 20 * s), aw[3][1]]], ac[1], "none", 0);
    for (var i = 0; i <= 6; i++) canv += shape([[aw[3][0] + (i / 6) * (ow + 20 * s) - 1.5 * s, aw[3][1]], [aw[3][0] + (i / 6) * (ow + 20 * s) + 1.5 * s, aw[3][1]], [aw[3][0] + (i / 6) * (ow + 20 * s), aw[3][1] + 3 * s]], ac[0], INK(0.5), 0.4);
    // signboard
    canv += shape([[x - W / 2 + 4 * s, y - H1 + 5 * s], [x + W / 2 - 4 * s, y - H1 + 5 * s], [x + W / 2 - 4 * s, y - H1 - 3 * s], [x - W / 2 + 4 * s, y - H1 - 3 * s]], [Palette.darkred, "#2d6fa8", Palette.darkgreen, Palette.black][Math.floor(Math.random() * 4)], INK(), 0.9);
    canv += script(x, y - H1 + 1 * s, W - 14 * s, Palette.yellow);
    if (H2) {
      canv += shape([[x - W / 2, y - H1], [x + W / 2, y - H1], [x + W / 2, y - H1 - H2], [x - W / 2, y - H1 - H2]], wall, INK(), 1.2);
      var sc = SHUT[Math.floor(Math.random() * SHUT.length)];
      for (var e = -1; e <= 1; e += 2) {
        canv += shape([[x + e * W * 0.24 - 6 * s, y - H1 - 6 * s], [x + e * W * 0.24 + 6 * s, y - H1 - 6 * s], [x + e * W * 0.24 + 6 * s, y - H1 - H2 + 5 * s], [x + e * W * 0.24 - 6 * s, y - H1 - H2 + 5 * s]], sc, INK(), 0.8);
        canv += line([[x + e * W * 0.24, y - H1 - 6 * s], [x + e * W * 0.24, y - H1 - H2 + 5 * s]], INK(0.6), 0.6);
      }
      // balcony rail
      canv += line([[x - W / 2 + 2 * s, y - H1 - 2 * s], [x + W / 2 - 2 * s, y - H1 - 2 * s]], Palette.darkbrown, 1.5 * s);
      for (var i = 0; i < 9; i++) canv += line([[x - W / 2 + 4 * s + i * (W - 8 * s) / 8, y - H1 - 2 * s], [x - W / 2 + 4 * s + i * (W - 8 * s) / 8, y - H1 - 8 * s]], Palette.darkbrown, 1 * s);
      canv += line([[x - W / 2 + 2 * s, y - H1 - 8 * s], [x + W / 2 - 2 * s, y - H1 - 8 * s]], Palette.darkbrown, 1.2 * s);
      // washing or a parrot cage or a person at the window now and then,
      // and sometimes a small story
      var r = Math.random();
      if (args.scene == "lover") {
        // she drops a flower from the balcony; he waits below with clasped hands
        canv += Figures.head(x + W * 0.24, y - H1 - H2 + 12 * s, -1, s * 0.8, true);
        canv += line([[x + W * 0.24 - 6 * s, y - H1 - 4 * s], [x + W * 0.24 - 10 * s, y - H1 + 2 * s]], Figures.SKIN, 2.4 * s);
        for (var i = 0; i < 4; i++) canv += dot(x + W * 0.24 - 10 * s - i * 2 * s, y - H1 + 6 * s + i * 7 * s, 1.5 * s, i % 2 ? Palette.white : "#d98aa0");
        var lv = People.rig(x + W * 0.24 - 14 * s, y + 4, s * 0.9, 1, { pose: "stand", armF: [[6, -8], [2, -14]], armB: [[-6, -8], [-2, -14]], zari: true });
        canv += lv.canv;
        canv += Figures.head(lv.head[0], lv.head[1], 1, s * 0.9, false);
      } else if (args.scene == "grandmother") {
        // the grandmother on the balcony, scolding the street below
        canv += Figures.head(x - W * 0.24, y - H1 - H2 + 12 * s, 1, s * 0.8, true);
        canv += dot(x - W * 0.24 - 6 * s, y - H1 - H2 + 13 * s, 3 * s, Palette.white);
        canv += line([[x - W * 0.24 + 6 * s, y - H1 - 4 * s], [x - W * 0.24 + 14 * s, y - H1 - 10 * s]], Figures.SKIN, 2.4 * s);
      } else if (args.scene == "cat") {
        // a cat on the roof edge and the crow it is watching
        var cx = x - W * 0.3, cy = y - H1 - H2 - 16 * s;
        canv += shape([[cx - 6 * s, cy], [cx + 4 * s, cy], [cx + 5 * s, cy - 5 * s], [cx - 5 * s, cy - 5 * s]], "#8c8478", INK(), 0.7);
        canv += dot(cx + 5 * s, cy - 6 * s, 2.5 * s, "#8c8478", INK(), 0.7);
        canv += line([[cx + 3 * s, cy - 8 * s], [cx + 2 * s, cy - 10 * s]], INK(), 0.8); canv += line([[cx + 7 * s, cy - 8 * s], [cx + 8 * s, cy - 10 * s]], INK(), 0.8);
        canv += line(bezmh([[cx - 6 * s, cy - 2 * s], [cx - 14 * s, cy - 6 * s], [cx - 12 * s, cy + 2 * s]], 1), "#8c8478", 1.6 * s);
        canv += Fauna.crow(x + W * 0.3, y - H1 - H2 - 16 * s, { sca: s * 0.8, dir: -1 });
      } else if (r < 0.3) { canv += line([[x - W * 0.3, y - H1 - 12 * s], [x + W * 0.3, y - H1 - 11 * s]], INK(0.6), 0.6); for (var i = 0; i < 3; i++) canv += shape([[x - W * 0.25 + i * W * 0.2, y - H1 - 12 * s], [x - W * 0.17 + i * W * 0.2, y - H1 - 12 * s], [x - W * 0.17 + i * W * 0.2, y - H1 - 3 * s], [x - W * 0.25 + i * W * 0.2, y - H1 - 3 * s]], [Palette.white, Palette.red, Palette.yellow][i], INK(0.5), 0.4); }
      else if (r < 0.45) canv += Fauna.parrot(x, y - H1 - 10 * s, { sca: s * 0.7, dir: 1 });
      else if (r < 0.6) canv += Figures.head(x + W * 0.24, y - H1 - H2 + 12 * s, 1, s * 0.8, Math.random() < 0.5);
    }
    canv += roof(x - W / 2, x + W / 2, y - H1 - H2, 16 * s);
    if (Math.random() < 0.3) canv += Fauna.crow(x + (Math.random() - 0.5) * W * 0.6, y - H1 - H2 - 16 * s, { sca: s * 0.8, dir: Math.random() < 0.5 ? -1 : 1 });
    else if (Math.random() < 0.15) canv += Fauna.monkey(x + (Math.random() - 0.5) * W * 0.6, y - H1 - H2 - 16 * s, { sca: s * 0.7, dir: 1 });
    // kolam at the step
    for (var i = -1; i <= 1; i++) for (var j = 0; j < 2; j++) canv += dot(x + i * 3 * s, y + 3 * s + j * 3 * s, 0.6 * s, Palette.white);
    return canv;
  };

  // bunting of flags and mango leaves slung across the street
  this.bunting = function(x0, x1, y, args) {
    var s = (args && args.sca) || 1;
    var canv = "";
    var cols = [Palette.red, Palette.yellow, Palette.green, Palette.orange, Palette.white, "#2d6fa8"];
    var sag = 6 * s;
    var pts = bezmh([[x0, y], [(x0 + x1) / 2, y + sag * 2], [x1, y]], 1);
    canv += line(pts, INK(0.9), 1.3);
    // Keep the rope and attachment points fixed; only its pendants catch the wind.
    var delay = -Math.random() * 3.6;
    for (var i = 2; i < pts.length - 2; i += 3) {
      var p = pts[i];
      var pendant;
      if (args && args.leaves) pendant = shape([[p[0] - 2 * s, p[1]], [p[0] + 2 * s, p[1]], [p[0] + 1 * s, p[1] + 7 * s], [p[0] - 1 * s, p[1] + 7 * s]], Palette.green, INK(0.7), 0.5);
      else pendant = shape([[p[0] - 3 * s, p[1]], [p[0] + 3 * s, p[1]], [p[0], p[1] + 7 * s]], cols[(i / 3) % 6], INK(0.7), 0.5);
      canv += anim("bunting-flutter", pendant, delay - i * 0.08);
    }
    return canv;
  };

  this.lamppost = function(x, y, args) {
    var s = (args && args.sca) || 1;
    var canv = shape([[x - 4 * s, y], [x + 4 * s, y], [x + 3 * s, y - 36 * s], [x - 3 * s, y - 36 * s]], STONE2, INK(), 1);
    canv += shape([[x - 5 * s, y - 36 * s], [x + 5 * s, y - 36 * s], [x + 4 * s, y - 40 * s], [x - 4 * s, y - 40 * s]], STONE3, INK(), 0.8);
    canv += dot(x, y - 42 * s, 2.4 * s, Palette.yellow, INK(), 0.7);
    canv += dot(x, y - 45 * s, 1.3 * s, Palette.orange);
    return canv;
  };

  // a crowd: several figures close together, walking the same way
  this.crowd = function(x, y, args) {
    var s = (args && args.sca) || 1, dir = (args && args.dir) || 1;
    var canv = "";
    var n = 6 + Math.floor(Math.random() * 5);
    var kinds = ["man", "woman", "womanpot", "elder", "child", "polecarrier", "priest", "woman", "man", "leafcarrier", "haycarrier", "motherchild"];
    var list = [];
    for (var i = 0; i < n; i++) list.push({ x: x + (i - n / 2) * 10 * s + (Math.random() - 0.5) * 6, y: y + (Math.random() - 0.5) * 14, k: kinds[Math.floor(Math.random() * kinds.length)], d: Math.random() < 0.75 ? dir : -dir });
    list.sort(function(a, b) { return a.y - b.y; });
    for (var i = 0; i < n; i++) {
      var it = list[i], o = { sca: s * (0.85 + Math.random() * 0.2), dir: it.d };
      if (it.k == "man") canv += Figures.man(it.x, it.y, o);
      else if (it.k == "woman") canv += Figures.woman(it.x, it.y, o);
      else if (it.k == "womanpot") { o.prop = "pot"; canv += Figures.woman(it.x, it.y, o); }
      else if (it.k == "leafcarrier") { o.prop = "leaves"; canv += Figures.man(it.x, it.y, o); }
      else if (it.k == "elder") canv += People.elder(it.x, it.y, o);
      else if (it.k == "child") canv += People.child(it.x, it.y, { sca: o.sca, dir: o.dir, girl: Math.random() < 0.5 });
      else if (it.k == "polecarrier") canv += People.poleCarrier(it.x, it.y, o);
      else if (it.k == "priest") canv += People.priest(it.x, it.y, o);
      else if (it.k == "haycarrier") canv += People.hayCarrier(it.x, it.y, o);
      else if (it.k == "motherchild") canv += People.motherChild(it.x, it.y, o);
    }
    return canv;
  };

  // street vendors with their wares on the ground or on a head
  this.streetVendor = function(x, y, args) {
    var s = (args && args.sca) || 1, dir = (args && args.dir) || 1;
    var r = Math.random();
    if (r < 0.25) return People.vendor(x, y, { sca: s, dir: dir });
    if (r < 0.45) return People.garlandSeller(x, y, { sca: s, dir: dir });
    if (r < 0.6) return People.fortuneTeller(x, y, { sca: s, dir: dir });
    if (r < 0.75) {
      // basket seller: a stack of baskets on the head
      var rg = People.rig(x, y, s, dir, { pose: "stand", female: true, armF: [[6, -8], [4, -14]], armB: [[-6, 6], [-4, 12]] });
      var out = rg.canv;
      for (var i = 0; i < 4; i++) out += shape([[rg.head[0] - 10 * s + i * s, rg.head[1] - 10 * s - i * 4 * s], [rg.head[0] + 10 * s - i * s, rg.head[1] - 10 * s - i * 4 * s], [rg.head[0] + 8 * s - i * s, rg.head[1] - 14 * s - i * 4 * s], [rg.head[0] - 8 * s + i * s, rg.head[1] - 14 * s - i * 4 * s]], i % 2 ? "#c9b48a" : Palette.brown, INK(), 0.7);
      return out;
    }
    if (r < 0.88) {
      // sugarcane juice: a man at a hand press with a stack of cane
      var out = shape([[x + 8 * s * dir, y], [x + 28 * s * dir, y], [x + 26 * s * dir, y - 18 * s], [x + 10 * s * dir, y - 18 * s]], Palette.darkbrown, INK(), 0.9);
      out += dot(x + 18 * s * dir, y - 18 * s, 5 * s, Palette.yellow, INK(), 0.8);
      out += line([[x + 18 * s * dir, y - 18 * s], [x + 30 * s * dir, y - 30 * s]], Palette.darkbrown, 1.5 * s);
      for (var i = 0; i < 4; i++) out += line([[x + 32 * s * dir + i * 2 * s, y], [x + 36 * s * dir + i * 2 * s, y - 40 * s]], "#7a4a6a", 2 * s);
      out += Figures.man(x, y, { sca: s, dir: dir });
      return out;
    }
    return People.snakeCharmer(x, y, { sca: s, dir: dir });
  };

  // a choultry: pillared rest house with travellers asleep and seated
  this.choultry = function(x, y, args) {
    var s = (args && args.sca) || 1;
    var canv = Arch.mandapam(x, y, { sca: s * 1.1 });
    canv += People.sitting(x - 14 * s, y + 2, { sca: s * 0.75, dir: 1 });
    canv += People.sadhu(x + 16 * s, y + 2, { sca: s * 0.75, dir: -1 });
    return canv;
  };

  // clutter in front of the shops: sacks, baskets, heaps, a tethered goat,
  // a parked cart, a water trough, a lantern pole, a hanging line of saris
  this.clutter = function(x, y, args) {
    var s = (args && args.sca) || 1;
    var r = Math.random();
    var out = "";
    if (r < 0.16) {
      for (var i = 0; i < 5; i++) { var sx = x + (i % 3) * 11 * s - 11 * s + Math.floor(i / 3) * 5 * s, sy = y - Math.floor(i / 3) * 9 * s; out += shape([[sx - 6 * s, sy], [sx + 6 * s, sy], [sx + 5 * s, sy - 9 * s], [sx - 5 * s, sy - 9 * s]], "#c9b48a", INK(), 0.8); out += line([[sx - 4 * s, sy - 9 * s], [sx + 4 * s, sy - 9 * s]], Palette.darkbrown, 1.2 * s); }
    } else if (r < 0.3) {
      for (var i = 0; i < 4; i++) out += shape([[x - 9 * s + i * s, y - i * 5 * s], [x + 9 * s - i * s, y - i * 5 * s], [x + 7 * s - i * s, y - 5 * s - i * 5 * s], [x - 7 * s + i * s, y - 5 * s - i * 5 * s]], i % 2 ? "#c9b48a" : Palette.brown, INK(), 0.7);
      for (var i = 0; i < 5; i++) out += dot(x - 6 * s + i * 3 * s, y - 21 * s, 2 * s, [Palette.orange, Palette.yellow, Palette.green][i % 3], INK(0.5), 0.4);
    } else if (r < 0.42) {
      for (var row = 0; row < 3; row++) for (var i = 0; i < 5 - row; i++) out += dot(x - 10 * s + i * 5 * s + row * 2.5 * s, y - 3 * s - row * 4 * s, 3 * s, Palette.lightgreen, INK(), 0.7);
    } else if (r < 0.54) {
      out += line([[x, y], [x, y - 20 * s]], Palette.darkbrown, 1.5 * s);
      out += line([[x, y - 18 * s], [x + 14 * s, y - 12 * s]], INK(0.6), 0.6);
      out += Figures.goat(x + 20 * s, y, { sca: s * 0.9, dir: 1 });
    } else if (r < 0.64) {
      out += shape([[x - 30 * s, y - 12 * s], [x + 24 * s, y - 12 * s], [x + 26 * s, y - 22 * s], [x - 32 * s, y - 22 * s]], Palette.brown, INK(), 1);
      out += line([[x + 24 * s, y - 16 * s], [x + 50 * s, y - 24 * s]], Palette.darkbrown, 2 * s);
      out += dot(x - 10 * s, y - 7 * s, 9 * s, Palette.yellow, INK(), 1.1);
      for (var i = 0; i < 6; i++) { var t = (i / 6) * Math.PI; out += line([[x - 10 * s + Math.cos(t) * 9 * s, y - 7 * s + Math.sin(t) * 9 * s], [x - 10 * s - Math.cos(t) * 9 * s, y - 7 * s - Math.sin(t) * 9 * s]], INK(), 0.7); }
      for (var i = 0; i < 3; i++) out += shape([[x - 24 * s + i * 14 * s, y - 22 * s], [x - 14 * s + i * 14 * s, y - 22 * s], [x - 15 * s + i * 14 * s, y - 30 * s], [x - 23 * s + i * 14 * s, y - 30 * s]], "#c9b48a", INK(), 0.7);
    } else if (r < 0.74) {
      out += shape([[x - 20 * s, y], [x + 20 * s, y], [x + 18 * s, y - 8 * s], [x - 18 * s, y - 8 * s]], STONE2, INK(), 1);
      out += shape([[x - 17 * s, y - 8 * s], [x + 17 * s, y - 8 * s], [x + 17 * s, y - 6 * s], [x - 17 * s, y - 6 * s]], Palette.blue, "none", 0);
      out += Figures.cow(x + 34 * s, y + 2, { sca: s * 0.8, dir: -1, col: Palette.cream });
    } else if (r < 0.84) {
      out += line([[x, y], [x, y - 60 * s]], Palette.darkbrown, 1.6 * s);
      out += line([[x, y - 58 * s], [x + 10 * s, y - 52 * s]], Palette.darkbrown, 1.2 * s);
      out += shape([[x + 7 * s, y - 50 * s], [x + 13 * s, y - 50 * s], [x + 12 * s, y - 42 * s], [x + 8 * s, y - 42 * s]], Palette.yellow, INK(), 0.8);
      out += dot(x + 10 * s, y - 46 * s, 1.5 * s, Palette.orange);
      out += anim("flutter", shape([[x, y - 60 * s], [x + 14 * s, y - 56 * s], [x, y - 51 * s]], Palette.red, INK(), 0.8), -Math.random());
    } else {
      // a line of saris hung out before a textile shop
      out += line([[x - 30 * s, y - 44 * s], [x + 30 * s, y - 42 * s]], INK(0.8), 0.9);
      var cols = [Palette.red, Palette.green, "#2d6fa8", Palette.orange, "#7a5a8a"];
      for (var i = 0; i < 5; i++) { var sx = x - 26 * s + i * 13 * s; out += shape([[sx - 5 * s, y - 44 * s + i * 0.4 * s], [sx + 5 * s, y - 44 * s + i * 0.4 * s], [sx + 4 * s, y - 10 * s], [sx - 4 * s, y - 10 * s]], cols[i], INK(), 0.7); out += line([[sx - 4 * s, y - 14 * s], [sx + 4 * s, y - 14 * s]], Palette.yellow, 1.2 * s); }
    }
    return out;
  };

  // pigeons pecking on the street, some rising in a flutter
  this.pigeons = function(x, y, args) {
    var s = (args && args.sca) || 1;
    var out = "";
    var n = 5 + Math.floor(Math.random() * 6);
    for (var i = 0; i < n; i++) {
      var px = x + (Math.random() - 0.5) * 60 * s, py = y + (Math.random() - 0.5) * 10 * s, d = Math.random() < 0.5 ? -1 : 1;
      out += shape([[px - 5 * s * d, py - 1 * s], [px + 3 * s * d, py - 4 * s], [px + 5 * s * d, py - 1 * s], [px, py + 1 * s]], "#8c8a90", INK(0.8), 0.6);
      out += dot(px + 5 * s * d, py - 4 * s, 1.6 * s, "#8c8a90", INK(0.8), 0.5);
    }
    var fl = "";
    for (var i = 0; i < 3; i++) {
      var px = x + (Math.random() - 0.5) * 40 * s, py = y - 14 * s - i * 10 * s, d = Math.random() < 0.5 ? -1 : 1;
      fl += anim("flap", shape([[px - 1 * s, py], [px - 7 * s, py - 7 * s], [px + 7 * s, py - 7 * s], [px + 1 * s, py]], "#8c8a90", INK(0.8), 0.6), -i * 0.15) + dot(px, py, 2 * s, "#8c8a90", INK(0.8), 0.5);
    }
    out += anim("rise", fl, -Math.random() * 6);
    return out;
  };
}();
