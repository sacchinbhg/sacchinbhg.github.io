// The street of Madurai, seen down its length: one road running from the
// foot of the picture to the temple gopuram at its end, shophouses in
// perspective down both sides, and the road alive at every depth.
var Street = new function() {
  this.WIDTH = 1800; // world units the scene spans
  var NEAR_HW = 430, FAR_HW = 58;
  function nearY() { return Layers.BOTTOM + 6; }
  function farY() { return Layers.HORIZON + 72; }
  // depth t: 0 at the foot of the picture, 1 at the temple gate
  function roadY(t) { return nearY() + (farY() - nearY()) * t; }
  function halfW(t) { return NEAR_HW + (FAR_HW - NEAR_HW) * t; }
  function scaleAt(t) { return 1.25 - 1.02 * t; }
  function tag(k, svg) { return "<g data-tag='" + k + "'>" + svg + "</g>"; }

  // a shophouse built in perspective along the road edge, from depth t0
  // (near) to t1 (far). Every horizontal converges on the temple.
  var WALLS = [Palette.cream, Palette.paleyellow, "#e8c9b0", "#d9e2c6", "#f1d9d2", "#dcd3b8"];
  var SHUT = [Palette.green, "#2d6fa8", Palette.red, Palette.darkgreen];
  var TILE = "#a0462a";
  function facade(cx, side, t0, t1, kind) {
    var x0 = cx + side * halfW(t0), y0 = roadY(t0), x1 = cx + side * halfW(t1), y1 = roadY(t1);
    var HH = 64 + Math.random() * 22; // buildings step up and down the row
    var H0 = HH * scaleAt(t0), H1 = HH * scaleAt(t1);
    var P = function(u, v) { return [x0 + (x1 - x0) * u, y0 + (y1 - y0) * u - v * (H0 + (H1 - H0) * u)]; };
    var h = function(u) { return H0 + (H1 - H0) * u; };
    var sc = scaleAt((t0 + t1) / 2);
    var out = "";
    var wall = WALLS[Math.floor(Math.random() * WALLS.length)];
    // the building has depth away from the road: an end wall at the near
    // end, and a roof with a ridge and a back slope seen from above
    var D1 = 0.5, D2 = 1.0; // ridge and back eave, as fractions of the height, outward
    var B0 = P(0, 0), T0 = P(0, 1), B1 = P(1, 0), T1 = P(1, 1);
    var o = function(q, d, hh) { return [q[0] + side * d * hh, q[1]]; };
    var endWall = [B0, T0, o(T0, D2, H0), o(B0, D2, H0)];
    out += shape(endWall, Palette.shade([200, 185, 150], 0.82), INK(), 1);
    out += shape([T0, [T0[0] + side * D1 * H0, T0[1] - 0.24 * H0], o(T0, D2, H0)], Palette.shade([200, 185, 150], 0.72), INK(), 0.9); // gable
    // wall
    out += shape([P(0, 0), P(1, 0), P(1, 1), P(0, 1)], wall, INK(), 1.1);
    // plinth
    out += shape([P(0, 0), P(1, 0), P(1, 0.08), P(0, 0.08)], "#b3a689", INK(0.8), 0.8);
    // the open shop with goods
    out += shape([P(0.1, 0.08), P(0.9, 0.08), P(0.9, 0.46), P(0.1, 0.46)], "#2e2418", INK(), 0.9);
    var cols = [Palette.red, Palette.green, "#2d6fa8", Palette.orange, Palette.yellow, "#d98aa0", Palette.white];
    var kinds = { textileshop: 0, flowershop: 1, brassshop: 2, fruitshop: 3, potshop: 4, sweetshop: 5, bangleshop: 6 };
    var kk = kinds[kind] == undefined ? Math.floor(Math.random() * 7) : kinds[kind];
    for (var r = 0; r < 3; r++) for (var i = 0; i < 5; i++) {
      var u = 0.16 + i * 0.17, v = 0.14 + r * 0.11;
      var q = P(u, v);
      var rad = 2.4 * h(u) / 74;
      if (kk == 0) out += shape([P(u - 0.06, v - 0.04), P(u + 0.06, v - 0.04), P(u + 0.06, v + 0.04), P(u - 0.06, v + 0.04)], cols[(r + i) % 7], INK(0.6), 0.5);
      else if (kk == 1) out += dot(q[0], q[1], rad, [Palette.white, Palette.orange, Palette.red][(r + i) % 3], INK(0.5), 0.3);
      else if (kk == 2) out += dot(q[0], q[1], rad, Palette.yellow, INK(0.7), 0.4);
      else if (kk == 3) out += dot(q[0], q[1], rad, [Palette.yellow, Palette.orange, Palette.green, Palette.red][i % 4], INK(0.6), 0.4);
      else if (kk == 4) out += dot(q[0], q[1], rad * 1.1, Palette.orange, INK(0.7), 0.4);
      else if (kk == 5) out += dot(q[0], q[1], rad, [Palette.orange, Palette.yellow, Palette.white][(r + i) % 3], INK(0.6), 0.4);
      else out += line([P(u - 0.04, v), P(u + 0.04, v)], cols[(r * 2 + i) % 7], 1.2 * sc);
    }
    // pilasters
    out += line([P(0.1, 0.08), P(0.1, 0.46)], Palette.darkbrown, 1.6 * sc);
    out += line([P(0.9, 0.08), P(0.9, 0.46)], Palette.darkbrown, 1.6 * sc);
    // awning, sloping out toward the road
    var ac = Math.random() < 0.5 ? [Palette.red, Palette.white] : [Palette.green, Palette.paleyellow];
    var out1 = function(u, v) { var q = P(u, v); return [q[0] + (cx - q[0]) * 0.09, q[1] + h(u) * 0.05]; };
    out += shape([P(0.04, 0.5), P(0.96, 0.5), out1(0.96, 0.44), out1(0.04, 0.44)], ac[0], INK(), 0.9);
    for (var i = 1; i < 8; i += 2) out += shape([P(0.04 + i * 0.115, 0.5), P(0.04 + (i + 1) * 0.115, 0.5), out1(0.04 + (i + 1) * 0.115, 0.44), out1(0.04 + i * 0.115, 0.44)], ac[1], "none", 0);
    // signboard with script
    out += shape([P(0.08, 0.52), P(0.92, 0.52), P(0.92, 0.6), P(0.08, 0.6)], [Palette.darkred, "#2d6fa8", Palette.darkgreen, Palette.black][Math.floor(Math.random() * 4)], INK(), 0.8);
    for (var i = 0; i < 8; i++) { var q = P(0.14 + i * 0.09, 0.56); var w = 1.6 * h(0.14 + i * 0.09) / 74; out += line([[q[0] - w, q[1] + w], [q[0], q[1] - w], [q[0] + w, q[1] + w]], Palette.yellow, 0.7); }
    // balcony rail and the upper windows
    out += line([P(0.02, 0.62), P(0.98, 0.62)], Palette.darkbrown, 1.4 * sc);
    for (var i = 0; i <= 8; i++) out += line([P(0.02 + i * 0.12, 0.62), P(0.02 + i * 0.12, 0.68)], Palette.darkbrown, 0.9 * sc);
    out += line([P(0.02, 0.68), P(0.98, 0.68)], Palette.darkbrown, 1 * sc);
    var scol = SHUT[Math.floor(Math.random() * SHUT.length)];
    for (var e = 0; e < 2; e++) {
      var ua = 0.18 + e * 0.46, ub = ua + 0.18;
      out += shape([P(ua, 0.7), P(ub, 0.7), P(ub, 0.92), P(ua, 0.92)], scol, INK(), 0.8);
      out += line([P((ua + ub) / 2, 0.7), P((ua + ub) / 2, 0.92)], INK(0.6), 0.5);
    }
    var r = Math.random();
    if (r < 0.18) { var q = P(0.73, 0.78); out += Figures.head(q[0], q[1], -side, sc * 0.8, Math.random() < 0.5); }
    else if (r < 0.3) { var q = P(0.27, 0.66); out += Fauna.parrot(q[0], q[1], { sca: sc * 0.7, dir: side }); }
    else if (r < 0.45) for (var i = 0; i < 3; i++) out += shape([P(0.3 + i * 0.14, 0.62), P(0.38 + i * 0.14, 0.62), P(0.38 + i * 0.14, 0.72), P(0.3 + i * 0.14, 0.72)], [Palette.white, Palette.red, Palette.yellow][i], INK(0.5), 0.4);
    // roof: front slope up to the ridge, back slope down behind it
    var E0 = [T0[0] + (T0[0] - cx) * 0.02, T0[1] + H0 * 0.04], E1 = [T1[0] + (T1[0] - cx) * 0.02, T1[1] + H1 * 0.04];
    var R0 = [T0[0] + side * D1 * H0, T0[1] - 0.24 * H0], R1 = [T1[0] + side * D1 * H1, T1[1] - 0.24 * H1];
    var K0 = [T0[0] + side * D2 * H0, T0[1] - 0.02 * H0], K1 = [T1[0] + side * D2 * H1, T1[1] - 0.02 * H1];
    out += shape([R0, R1, K1, K0], "#7e3620", INK(), 1);
    for (var i = 1; i < 8; i++) { var f = i / 8; out += line([[R0[0] + (R1[0] - R0[0]) * f, R0[1] + (R1[1] - R0[1]) * f], [K0[0] + (K1[0] - K0[0]) * f, K0[1] + (K1[1] - K0[1]) * f]], INK(0.25), 0.5); }
    out += shape([E0, E1, R1, R0], TILE, INK(), 1.1);
    for (var i = 1; i < 4; i++) { var f = i / 4; out += line([[E0[0] + (R0[0] - E0[0]) * f, E0[1] + (R0[1] - E0[1]) * f], [E1[0] + (R1[0] - E1[0]) * f, E1[1] + (R1[1] - E1[1]) * f]], INK(0.45), 0.6); }
    for (var i = 1; i < 10; i++) { var f = i / 10; out += line([[E0[0] + (E1[0] - E0[0]) * f, E0[1] + (E1[1] - E0[1]) * f], [R0[0] + (R1[0] - R0[0]) * f, R0[1] + (R1[1] - R0[1]) * f]], INK(0.3), 0.5); }
    out += line([R0, R1], Palette.darkbrown, 1.4 * sc); // the ridge
    if (Math.random() < 0.3) { var q = [E0[0] + (E1[0] - E0[0]) * 0.5, E0[1] + (E1[1] - E0[1]) * 0.5 - 2]; out += Fauna.crow(q[0], q[1], { sca: sc * 0.8, dir: Math.random() < 0.5 ? -1 : 1 }); }
    return out;
  }

  this.scene = function(cx, args) {
    var out = { svg: "", lamps: [] };
    var s = "";
    var L = Layers;
    var NY = nearY(), FY = farY();

    // --- the temple at the end of the road, and the quarter behind it
    var gs = 1.02;
    s += Temples.maduraiGopuram(cx - 150, FY - 6, { sca: gs * 0.6, tiers: 8 });
    s += Temples.maduraiGopuram(cx + 150, FY - 6, { sca: gs * 0.6, tiers: 8 });
    s += Arch.vimana(cx, FY - 30, { sca: 0.5, tiers: 4 });
    // compound wall either side of the gate, with the Madurai stripes
    for (var side = -1; side <= 1; side += 2) {
      var wx0 = cx + side * 52, wx1 = cx + side * 330;
      s += shape([[wx0, FY], [wx1, FY], [wx1, FY - 22], [wx0, FY - 22]], Palette.cream, INK(), 1.1);
      for (var i = 0; i < 3; i++) s += line([[wx0, FY - 3 - i * 6], [wx1, FY - 3 - i * 6]], i % 2 ? Palette.white : Palette.red, 3.5);
      for (var i = 1; i < 10; i++) s += line([[wx0 + side * i * 28, FY - 22], [wx0 + side * i * 28, FY - 26]], INK(), 1.2);
    }
    s += tag("meenakshi", Temples.maduraiGopuram(cx, FY + 2, { sca: gs, tiers: 9 }));
    s += Arch.flagpost(cx - 70, FY + 4, { sca: 0.5 });

    // --- the quarter spreading either side of the road, rooftops far to near
    var qrows = [[L.HORIZON + 62, 0.42], [L.HORIZON + 100, 0.5], [L.HORIZON + 145, 0.58], [L.HORIZON + 195, 0.66]];
    for (var r = 0; r < qrows.length; r++) {
      var ry = qrows[r][0], rs = qrows[r][1], step = 86 * rs;
      var inner = halfW((ry - NY) / (FY - NY)) + 70 * rs;
      for (var side = -1; side <= 1; side += 2) {
        for (var qx = inner + step * 0.5; qx < this.WIDTH / 2 - 30; qx += step) {
          if (Math.random() < 0.18) continue;
          var bx = cx + side * qx, by = ry + (Math.random() - 0.5) * 8;
          var ss = rs * (0.95 + Math.random() * 0.1);
          if (Math.random() < 0.12) s += Trees.coconut(bx, by, { sca: ss * 0.9 });
          else if (Math.random() < 0.08) s += Flora.neem(bx, by, { sca: ss });
          else s += tag("shop", Town.shop(bx, by, { sca: ss, upper: Math.random() < 0.7 }));
        }
      }
    }
    // the edge of town beside the near shops: palms, a few houses, a goat
    for (var side = -1; side <= 1; side += 2) {
      for (var k = 0; k < 7; k++) {
        var ey = L.SHORE + 20 + Math.random() * 150;
        var ex = cx + side * (halfW((ey - NY) / (FY - NY)) + 90 + Math.random() * (this.WIDTH / 2 - halfW((ey - NY) / (FY - NY)) - 130));
        var es = 0.7 + ((ey - L.SHORE) / 170) * 0.4;
        var rr = Math.random();
        if (rr < 0.35) s += Trees.coconut(ex, ey, { sca: es * 0.9 });
        else if (rr < 0.55) s += Palmyra.tree(ex, ey, { sca: es * 0.8 });
        else if (rr < 0.8) s += tag("shop", Town.shop(ex, ey, { sca: es * 0.8, upper: Math.random() < 0.5 }));
        else if (rr < 0.9) s += tag("goat", Figures.goat(ex, ey, { sca: es, dir: side }));
        else s += Flora.bougainvillea(ex, ey, { sca: es });
      }
    }

    // --- the road
    var road = [[cx - NEAR_HW, NY], [cx + NEAR_HW, NY], [cx + FAR_HW, FY], [cx - FAR_HW, FY]];
    s += shape(road, "#c9a86a", "none", 0);
    s += line([[cx - NEAR_HW, NY], [cx - FAR_HW, FY]], "#6b4a2b", 1.4);
    s += line([[cx + NEAR_HW, NY], [cx + FAR_HW, FY]], "#6b4a2b", 1.4);
    // flagstones: converging lines and rows spaced by perspective
    for (var i = 1; i < 6; i++) {
      var u = i / 6 - 0.5;
      s += line([[cx + u * 2 * NEAR_HW, NY], [cx + u * 2 * FAR_HW, FY]], "rgba(107,74,43,0.28)", 0.8);
    }
    for (var t = 0.04; t < 0.98; t += 0.06 * (1 - t) + 0.012) {
      s += line([[cx - halfW(t), roadY(t)], [cx + halfW(t), roadY(t)]], "rgba(107,74,43,0.3)", 0.8);
    }
    // a gutter and a kolam or two near the foot
    for (var i = 0; i < 4; i++) {
      var kx = cx + (Math.random() - 0.5) * 500, ky = NY - 10 - Math.random() * 40;
      for (var a = -1; a <= 1; a++) for (var b = 0; b < 2; b++) s += dot(kx + a * 5, ky + b * 4, 0.8, "rgba(246,239,221,0.7)");
    }

    // --- shops down both sides, far first so the near ones overlap
    var shops = [];
    for (var side = -1; side <= 1; side += 2) {
      var t = 0.0;
      while (t < 0.9) {
        var dt = 0.085 * scaleAt(t) + 0.012;
        var kind = Town.KINDS[Math.floor(Math.random() * Town.KINDS.length)];
        shops.push({ t: t, svg: tag(kind, facade(cx, side, t, Math.min(0.93, t + dt), kind)) });
        t += dt + 0.006;
      }
    }
    shops.sort(function(a, b) { return b.t - a.t; });
    var lampsT = [0.08, 0.3, 0.55, 0.78];
    for (var i = 0; i < shops.length; i++) s += shops[i].svg;
    // lamp posts and clutter at the road edges
    for (var i = 0; i < lampsT.length; i++) {
      var t = lampsT[i], sc = scaleAt(t);
      for (var side = -1; side <= 1; side += 2) {
        var lx = cx + side * (halfW(t) - 10 * sc), ly = roadY(t);
        s += tag("lamppost", Town.lamppost(lx, ly, { sca: sc * 0.9 }));
        out.lamps.push([lx, ly - 40 * sc, 22 * sc]);
      }
    }
    for (var t = 0.06; t < 0.86; t += 0.09 + Math.random() * 0.06) {
      var sc = scaleAt(t);
      var side = Math.random() < 0.5 ? -1 : 1;
      s += tag("clutter", Town.clutter(cx + side * (halfW(t) - 26 * sc), roadY(t) - 2 * sc, { sca: sc * 0.85 }));
    }
    // bunting strung across the street at several depths
    for (var t = 0.12; t < 0.9; t += 0.17) {
      var sc = scaleAt(t);
      var yb = roadY(t) - 62 * sc;
      // Visible posts give both ends a fixed physical attachment.
      var left = cx - halfW(t) + 6 * sc, right = cx + halfW(t) - 6 * sc;
      for (var side = 0; side < 2; side++) {
        var postX = side ? right : left;
        s += line([[postX, roadY(t)], [postX, yb - 4 * sc]], Palette.darkbrown, 2.5 * sc);
        s += dot(postX, yb, 2 * sc, Palette.yellow, INK(), 0.6);
      }
      s += tag("bunting", Town.bunting(left, right, yb, { leaves: Math.random() < 0.35, sca: sc * 2.2 }));
    }

    // --- life on the road, far to near
    var items = [];
    var placed = [];
    function slots(n, t0, t1, kinds, big) {
      for (var i = 0; i < n * 3 && n > 0; i++) {
        var t = t0 + Math.random() * (t1 - t0);
        var xf = (Math.random() - 0.5) * 1.7;
        var kind = kinds[Math.floor(Math.random() * kinds.length)];
        var sc = scaleAt(t);
        var fw = ((FOOT[kind] || [40, 60])[0]) * sc;
        var x = cx + xf * (halfW(t) - 20 * sc), y = roadY(t);
        var ok = true;
        for (var j = 0; j < placed.length; j++) {
          var p = placed[j];
          if (Math.abs(p.y - y) < 10 * sc + 4 && Math.abs(p.x - x) < (p.w + fw) / 2) { ok = false; break; }
        }
        if (!ok) continue;
        placed.push({ x: x, y: y, w: fw });
        items.push({ t: t, xf: xf, kind: kind });
        n--;
      }
    }
    var PILGRIMS = ["man", "woman", "womanpot", "women", "crowd", "templecow", "temple_elephant", "elder", "priest", "polecarrier", "child", "motherchild", "umbrellawalker", "crowd", "crowd"];
    var MID = ["crowd", "cart", "streetvendor", "cow", "dog", "palanquin", "horseman", "women", "man", "woman", "nadaswaram", "pigeons", "goat", "donkey", "sadhu", "elder", "child", "children"];
    var VIG = VIGNETTES;
    slots(34, 0.68, 0.97, PILGRIMS, false);
    slots(12, 0.4, 0.72, VIG, true);
    slots(28, 0.36, 0.7, MID, false);
    slots(9, 0.08, 0.38, VIG, true);
    slots(16, 0.06, 0.36, MID, false);
    slots(3, 0.2, 0.8, ["pigeons"], false);
    items.push({ t: 0.0, xf: -0.75, kind: Math.random() < 0.5 ? "elder" : "womanpot" });
    items.push({ t: 0.01, xf: 0.78, kind: Math.random() < 0.5 ? "polecarrier" : "man" });
    items.sort(function(a, b) { return b.t - a.t; });
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var sc = scaleAt(it.t);
      var x = cx + it.xf * (halfW(it.t) - 20 * sc), y = roadY(it.t);
      var dir = Math.random() < 0.5 ? -1 : 1;
      var fn = ITEMS[it.kind];
      var svg = fn ? fn(x, y, sc, dir, Tinai.weights(x)) : (makeItem(it.kind, x, y, sc, Tinai.weights(x)) || function() { return ""; })();
      if (!svg) continue;
      var cls = MOVERS[it.kind];
      if (cls && VIG.indexOf(it.kind) < 0) {
        var d = -Math.random() * 40;
        if (it.t > 0.6) svg = anim("bob", svg, d);
        else if (cls == "stroll" || cls == "roll") svg = anim((cls == "roll" ? "roll" : "stroll") + (dir < 0 ? "back" : ""), anim("bob", svg, d * 0.1), d);
        else svg = anim(cls, anim("bob", svg, d * 0.1), d);
      }
      s += tag(it.kind, svg);
    }
    out.svg = s;
    return out;
  };
}();
