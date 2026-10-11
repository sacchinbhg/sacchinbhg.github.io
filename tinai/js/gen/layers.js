// Register bands of the mural: top border, sky, far band, ground, sea,
// bottom kolam border. Each is drawn per chunk and blends with neighbours.
var Layers = new function() {
  this.TOP = 34; // bottom of the top border
  this.HORIZON = 340;
  this.SHORE = 580; // sea meets sand here in neithal
  this.BOTTOM = 745; // top of the bottom border

  // --- sky with sun or moon ------------------------------------------------
  this.sky = function(x0, x1) {
    var canv = "";
    var H = this.HORIZON;
    canv += gradRect(x0, x1, this.TOP, H, Palette.mix(x0, Palette.sky), Palette.mix(x1, Palette.sky));
    // warmer glow near the horizon, as a translucent lower band
    canv += gradRectVFade(x0, x1, H - 200, H, Palette.mix(x0, Palette.skyLow), Palette.mix(x1, Palette.skyLow), 0.7);
    // one celestial body every 4096 units, matched to the time of day
    if (((x0 % 4096) + 4096) % 4096 == 2048) {
      var cx = x0 + 256;
      var k = Tinai.dominant(cx);
      var w = Tinai.weights(cx)[k];
      if (w > 0.5) {
        if (k == 0) {
          // kurinji: crescent moon and stars
          var mx = cx, my = 120;
          canv += dot(mx, my, 34, Palette.cream, INK(), 1.5);
          canv += dot(mx + 14, my - 8, 30, Palette.mix(cx, Palette.sky), "none", 0);

        } else if (k == 4 || k == 2) {
          // paalai: blazing midday sun; marutham: dawn sun, lower and softer
          var sy = k == 4 ? 120 : 250;
          var r = k == 4 ? 46 : 36;
          if (k == 4) {
            for (var i = 0; i < 24; i++) {
              var a = (i / 24) * Math.PI * 2;
              canv += line([[cx + Math.cos(a) * (r + 8), sy + Math.sin(a) * (r + 8)], [cx + Math.cos(a) * (r + 26 + (i % 2) * 12), sy + Math.sin(a) * (r + 26 + (i % 2) * 12)]], Palette.yellow, 2.2);
            }
          }
          canv += dot(cx, sy, r, k == 4 ? Palette.paleyellow : Palette.yellow, Palette.red, 2);
        } else if (k == 3) {
          // neithal: sunset, the sun low behind the hills
          canv += dot(cx, H - 30, 44, Palette.yellow, Palette.darkred, 2);
        }
      }
    }
    // stars fade in with the kurinji weight, so night arrives gradually
    var wk = Tinai.weights(x0 + 256)[0];
    if (wk > 0.12) {
      var ns = Math.floor(70 * wk);
      for (var i = 0; i < ns; i++) {
        canv += dot(x0 + Math.random() * 512, this.TOP + 10 + Math.random() * 220, 0.8 + Math.random() * 1.4, "rgba(246,239,221," + Math.min(1, wk * 1.3).toFixed(2) + ")");
      }
    }
    canv += this.clouds(x0, x1);
    canv += this.birds(x0, x1);
    // a kite soaring over hills and waste; bats at dusk in the groves
    var wd = Tinai.weights(x0 + 256);
    if ((wd[0] + wd[4]) > 0.4 && Math.random() < 0.3) canv += Fauna.eagle(x0 + 100 + Math.random() * 300, this.TOP + 40 + Math.random() * 120, { sca: 1 + Math.random() * 0.6, dir: Math.random() < 0.5 ? -1 : 1 });
    if ((wd[1] + wd[3]) > 0.5 && Math.random() < 0.25) canv += Fauna.bats(x0 + 100 + Math.random() * 300, this.TOP + 60 + Math.random() * 120, { sca: 1 });
    return canv;
  };

  // stylised mural clouds: a chain of scalloped lobes with a flat base
  // and curled ends, cream on the coloured sky
  this.clouds = function(x0, x1) {
    var canv = "";
    var one = "";
    var n = Math.random() < 0.7 ? 1 + Math.floor(Math.random() * 2) : 0;
    if (Tinai.dominant(x0 + 256) == 1) n += 1; // the rains of mullai
    for (var c = 0; c < n; c++) {
      var cx = x0 + Math.random() * 512;
      var cy = this.TOP + 40 + Math.random() * 140;
      var W = 70 + Math.random() * 110;
      var k = Tinai.dominant(cx);
      var rain = k == 1 && Math.random() < 0.7;
      var fil = k == 0 ? Palette.blue : rain ? Palette.indigo : Palette.cream;
      if (rain) {
        // the rains of the mullai season fall in slanting cream strokes
        var rs = "";
        for (var r = 0; r < W / 6; r++) {
          var rx = cx - W / 2 + 6 + r * 6 + (Math.random() - 0.5) * 3;
          var ry = cy + 8 + Math.random() * 10;
          var rl = 18 + Math.random() * 30;
          rs += line([[rx, ry], [rx - rl * 0.18, ry + rl]], "rgba(239,227,198,0.7)", 1);
        }
        canv += anim("rain", rs, -Math.random());
      }
      // bumps of varying width along the top edge, flat base
      var pts = [[cx - W / 2, cy]];
      var bx = cx - W / 2;
      while (bx < cx + W / 2 - 6) {
        var bw = 14 + Math.random() * 22;
        if (bx + bw > cx + W / 2) bw = cx + W / 2 - bx;
        var mid = (bx + bw / 2 - cx) / (W / 2);
        var r = bw * (0.35 + Math.random() * 0.3) * (1.25 - 0.6 * mid * mid);
        for (var j = 1; j < 8; j++) {
          var t = Math.PI + (j / 8) * Math.PI;
          pts.push([bx + bw / 2 + Math.cos(t) * bw / 2, cy - 2 + Math.sin(t) * r]);
        }
        bx += bw;
      }
      pts.push([cx + W / 2, cy]);
      canv += shape(pts, fil, INK(0.85), 1.2);
      // inner spiral curls at both ends, as in Nayak cloud forms
      for (var e = -1; e <= 1; e += 2) {
        var sp = [];
        for (var j = 0; j <= 12; j++) {
          var t = (j / 12) * Math.PI * 2;
          var r = 6 * (1 - j / 16);
          sp.push([cx + e * (W / 2 - 12) + Math.cos(t) * r, cy - 9 + Math.sin(t) * r]);
        }
        canv += line(sp, INK(0.7), 1);
      }
      canv += line([[cx - W / 2 + 4, cy + 4], [cx + W / 2 - 4, cy + 4]], fil, 2.2);
      canv += line([[cx - W / 2 + 4, cy + 4], [cx + W / 2 - 4, cy + 4]], INK(0.6), 0.8);
      one += anim("drift", canv, -Math.random() * 40);
      canv = "";
    }
    return one;
  };

  // flocks: cranes in a line, or a pair of parrots
  this.birds = function(x0, x1) {
    var canv = "";
    if (Math.random() > 0.55) return canv;
    var flock = "";
    var bx = x0 + Math.random() * 512;
    var by = this.TOP + 30 + Math.random() * 180;
    var dir = Math.random() < 0.5 ? -1 : 1;
    var n = 3 + Math.floor(Math.random() * 6);
    var parrot = Math.random() < 0.35;
    for (var i = 0; i < n; i++) {
      var px = bx + i * 26 * dir + (Math.random() - 0.5) * 6;
      var py = by + i * 7 + (Math.random() - 0.5) * 8;
      var s = 1 + Math.random() * 0.4;
      var fil = parrot ? Palette.green : Palette.white;
      // body
      canv += shape([[px - 8 * s * dir, py], [px + 6 * s * dir, py - 2 * s], [px + 12 * s * dir, py - 1 * s], [px + 5 * s * dir, py + 2 * s]], fil, INK(), 1);
      // wings up and down, flapping
      canv += anim("flap", shape([[px - 1 * s * dir, py - 1 * s], [px - 6 * s * dir, py - 12 * s], [px + 4 * s * dir, py - 9 * s], [px + 3 * s * dir, py - 1 * s]], fil, INK(), 1) +
        shape([[px - 1 * s * dir, py + 1 * s], [px - 7 * s * dir, py + 8 * s], [px + 2 * s * dir, py + 7 * s], [px + 3 * s * dir, py + 1 * s]], fil, INK(), 1), -i * 0.13);
      if (!parrot) {
        canv += line([[px + 12 * s * dir, py - 1 * s], [px + 18 * s * dir, py - 3 * s]], Palette.yellow, 1.5 * s);
        canv += line([[px - 8 * s * dir, py], [px - 16 * s * dir, py + 3 * s]], INK(), 1 * s);
      } else {
        canv += line([[px + 12 * s * dir, py - 1 * s], [px + 15 * s * dir, py + 1 * s]], Palette.red, 1.6 * s);
      }
    }
    return anim(dir > 0 ? "fly" : "flyback", canv, -Math.random() * 30);
  };

  // --- ground plane ---------------------------------------------------------
  this.ground = function(x0, x1) {
    var canv = "";
    canv += gradRect(x0, x1, this.HORIZON, this.BOTTOM, Palette.mix(x0, Palette.ground), Palette.mix(x1, Palette.ground));
    canv += fadeRectV(x0, x1, this.HORIZON, this.BOTTOM, "#3a2a10", 0.16);
    canv += line([[x0, this.HORIZON], [x1, this.HORIZON]], INK(0.5), 1.2);
    // soft patches of lighter and darker earth
    for (var k = 0; k < 7; k++) {
      var bp = blob(x0 + Math.random() * 512, this.HORIZON + 30 + Math.random() * (this.BOTTOM - this.HORIZON - 60), {
        len: 200 + Math.random() * 320, wid: 30 + Math.random() * 70, ang: (Math.random() - 0.5) * 0.2, noi: 0.7, ret: 1,
      });
      canv += poly(bp, { fil: k % 3 == 0 ? "rgba(255,245,200,0.11)" : k % 3 == 1 ? "rgba(40,30,10,0.09)" : "rgba(120,140,40,0.10)", str: "none", wid: 0 });
    }
    // the town street: a paved dust band across the near band, following the town weight
    var tstops = [], tany = false;
    for (var x = x0; x <= x1; x += 64) { var tw = Tinai.town(x); if (tw > 0.02) tany = true; tstops.push([x, Math.min(0.85, tw * 0.9)]); }
    if (false) {
      canv += opacityRect(x0, x1, this.SHORE + 36, this.BOTTOM, "#c9a86a", tstops);
      canv += opacityRect(x0, x1, this.SHORE + 36, this.SHORE + 39, "#6b4a2b", tstops);
      // flagstone joints
      var fs = "";
      for (var y = this.SHORE + 60; y < this.BOTTOM; y += 22) for (var x = x0 + ((y / 22) % 2) * 20; x < x1; x += 40) if (Tinai.town(x) > 0.4) fs += line([[x, y], [x + 30, y]], "rgba(107,74,43,0.35)", 0.8);
      canv += fs;
    }
    // texture, denser and larger in the near band
    for (var x = x0; x < x1; x += 4.5) {
      var w = Tinai.weights(x);
      if (Math.random() < Tinai.town(x)) continue;
      var g = Palette.mixArr(x, Palette.ground);
      var dark = Palette.shade(g, 0.6);
      var light = Palette.shade(g, 1.35);
      var r = Math.random();
      var y = this.HORIZON + 10 + Math.random() * (this.BOTTOM - this.HORIZON - 20);
      var near = (y - this.HORIZON) / (this.BOTTOM - this.HORIZON);
      var s = 0.6 + near * 0.8;

      // kurinji: rocks
      if (r < w[0] * 0.22) {
        var bp = blob(x, y, { len: 12 * s, wid: 7 * s, ang: Math.random() * 0.6 - 0.3, noi: 0.5, ret: 1 });
        canv += shape(bp, Palette.shade(g, 0.85), INK(0.8), 1);
      }
      // mullai: grass tufts
      if (r < w[1] * 0.5) {
        var nb = 3 + Math.floor(Math.random() * 3);
        for (var j = 0; j < nb; j++) {
          var ang = -Math.PI / 2 + (j / (nb - 1) - 0.5) * 1.3;
          var l = (7 + Math.random() * 6) * s;
          canv += line([[x, y], [x + Math.cos(ang) * l * 0.5, y + Math.sin(ang) * l * 0.6], [x + Math.cos(ang) * l, y + Math.sin(ang) * l]], dark, 1.1);
        }
      }
      // marutham: paddy in rows
      if (w[2] > 0.15 && Math.random() < w[2] * 0.6) {
        var ry = this.HORIZON + 20 + Math.floor((y - this.HORIZON) / 22) * 22;
        var rn = (ry - this.HORIZON) / (this.BOTTOM - this.HORIZON);
        var rs = 0.5 + rn;
        canv += line([[x - 3 * rs, ry], [x, ry - 8 * rs], [x + 3 * rs, ry]], Palette.darkgreen, 1.2);
        canv += line([[x, ry], [x, ry - 9 * rs]], Palette.darkgreen, 1.2);
      }
      // neithal: shells and sand dots
      if (r < w[3] * 0.4 && y > this.SHORE) {
        canv += dot(x, y, 1.1 * s, dark);
      }
      // paalai: cracks and pebbles
      if (r < w[4] * 0.16) {
        var cp = [[x, y]];
        for (var j = 0; j < 3; j++) {
          var last = cp[cp.length - 1];
          cp.push([last[0] + (6 + Math.random() * 10) * s, last[1] + (Math.random() - 0.5) * 10 * s]);
        }
        canv += line(cp, dark, 1.1);
      } else if (r < w[4] * 0.28) {
        canv += dot(x, y, 1.4 * s, dark, INK(0.6), 0.6);
      }
    }
    return canv;
  };

  // --- sea (neithal) ---------------------------------------------------------
  this.sea = function(x0, x1) {
    return ""; // the sea is gone: every scene is river, hill and land
    var canv = "";
    var sub = 64;
    var stops = [];
    var any = false;
    for (var x = x0; x <= x1; x += sub) {
      var o = Math.max(0, Math.min(1, (Tinai.weights(x)[3] - 0.1) * 1.7));
      if (o > 0.02) any = true;
      stops.push([x, o]);
    }
    if (!any) return canv;
    canv += opacityRect(x0, x1, this.HORIZON, this.SHORE, Palette.blue, stops);
    for (var x = x0; x < x1; x += sub) {
      var w3 = Tinai.weights(x + sub / 2)[3];
      var op = Math.max(0, Math.min(1, (w3 - 0.1) * 1.7));
      if (op < 0.04) continue;
      // wave marks in cream and dark blue, mural style repeated curls
      for (var y = this.HORIZON + 18; y < this.SHORE - 8; y += 16) {
        for (var wx = x + ((y / 16) % 2) * 14; wx < x + sub; wx += 30) {
          if (op < 0.35 || Math.random() > op * op) continue;
          var wp = [];
          for (var i = 0; i <= 6; i++) {
            var t = i / 6;
            wp.push([wx + t * 20, y + Math.sin(t * Math.PI * 2) * 2.2]);
          }
          canv += line(wp, Math.random() < 0.6 ? Palette.cream : Palette.indigo, 1.3);
        }
      }
      // a fish or two leaping
      if (op > 0.6 && Math.random() < 0.25) {
        var fx = x + Math.random() * sub, fy = this.HORIZON + 30 + Math.random() * (this.SHORE - this.HORIZON - 60);
        var fd = Math.random() < 0.5 ? -1 : 1;
        canv += shape([[fx - 7 * fd, fy], [fx, fy - 3], [fx + 6 * fd, fy], [fx, fy + 3]], Palette.cream, INK(), 0.9);
        canv += shape([[fx - 7 * fd, fy], [fx - 11 * fd, fy - 3], [fx - 11 * fd, fy + 3]], Palette.cream, INK(), 0.9);
        canv += dot(fx + 3 * fd, fy - 0.5, 0.8, Palette.black);
      }
      // shoreline foam
      var sp = [];
      for (var i = 0; i <= 8; i++) {
        var t = i / 8;
        sp.push([x + t * sub, this.SHORE + Math.sin((x + t * sub) * 0.05) * 3]);
      }
      canv += stroke(sp, { col: "rgba(246,239,221," + op.toFixed(2) + ")", wid: 3.5, noi: 0.5, fun: function() { return 1; } });
    }
    return canv;
  };

  // --- far band: things on the horizon line ---------------------------------
  this.far = function(x0, x1) {
    var canv = "";
    var w = Tinai.weights((x0 + x1) / 2);
    var H = this.HORIZON;
    // marutham: paddy plots with bunds, as lighter green parallelograms
    if (w[2] > 0.3) {
      var n = 2 + Math.floor(Math.random() * 3);
      for (var k = 0; k < n; k++) {
        var px = x0 + Math.random() * (x1 - x0);
        var py = H + 20 + Math.random() * (this.SHORE - H - 80);
        var pw = 120 + Math.random() * 160, ph = 28 + Math.random() * 30;
        if (Tinai.weights(px)[3] > 0.1 || Tinai.weights(px + pw)[3] > 0.1) continue; // not on the sea
        var sk = 20 + Math.random() * 20;
        var pts = [[px, py], [px + pw, py], [px + pw - sk, py + ph], [px - sk, py + ph]];
        canv += shape(pts, k % 2 ? "#9db35a" : "#86a04c", INK(0.8), 1.2);
        for (var r = 6; r < ph - 3; r += 7) {
          var u = r / ph;
          canv += line([[px - sk * u + 4, py + r], [px + pw - sk * u - 4, py + r]], Palette.darkgreen, 0.9);
        }
        canv += line([[px - sk, py + ph], [px + pw - sk, py + ph]], Palette.yellow, 2);
      }
    }
    // paalai: low dunes
    if (w[4] > 0.2) {
      for (var k = 0; k < 3; k++) {
        var cx = x0 + Math.random() * (x1 - x0);
        var R = 160 + Math.random() * 200;
        var Hh = R * 0.12 * Math.min(1, w[4] * 1.5);
        var pts = [];
        for (var i = 0; i <= 20; i++) {
          var t = Math.PI + (i / 20) * Math.PI;
          pts.push([cx + R * Math.cos(t), H + 2 + Hh * Math.sin(t)]);
        }
        canv += shape(pts, Palette.css(Palette.far[4]), INK(0.7), 1.2);
      }
    }
    return canv;
  };

  // --- borders -----------------------------------------------------------------
  // top: temple zigzag (reku) border from Kanchipuram sarees
  this.topBorder = function(x0, x1) {
    var canv = "";
    var T = this.TOP;
    canv += "<rect x='" + x0 + "' y='0' width='" + (x1 - x0) + "' height='" + T + "' fill='" + Palette.darkred + "'/>";
    var pts = [];
    var step = 32;
    var s0 = Math.floor(x0 / step) * step;
    for (var x = s0; x <= x1 + step; x += step) {
      pts.push([x, T - 4]);
      pts.push([x + step / 2, 8]);
    }
    pts.push([x1 + step, T - 4]);
    pts.push([s0, T - 4]);
    canv += shape(pts, Palette.yellow, INK(0.9), 1.2);
    for (var x = s0; x <= x1 + step; x += step) {
      canv += dot(x + step / 2, T - 11, 2.2, Palette.darkred);
    }
    canv += line([[x0, T], [x1, T]], INK(), 2);
    canv += line([[x0, T + 3], [x1, T + 3]], Palette.cream, 1);
    return canv;
  };

  // bottom: pulli kolam band, cream on deep red
  this.bottomBorder = function(x0, x1) {
    var canv = "";
    var B = this.BOTTOM;
    canv += "<rect x='" + x0 + "' y='" + B + "' width='" + (x1 - x0) + "' height='" + (800 - B) + "' fill='" + Palette.darkred + "'/>";
    canv += line([[x0, B], [x1, B]], INK(), 2);
    canv += line([[x0, B + 4], [x1, B + 4]], Palette.yellow, 1.2);
    var cell = 32;
    var rows = [B + 16, B + 28, B + 40];
    var s0 = Math.floor(x0 / cell) * cell;
    // dots
    for (var x = s0; x < x1; x += cell) {
      canv += dot(x + cell / 2, rows[1], 2, Palette.cream);
      canv += dot(x, rows[0], 2, Palette.cream);
      canv += dot(x, rows[2], 2, Palette.cream);
    }
    // two interlaced looping lines around the dots
    var a = [], b = [];
    for (var x = s0; x <= x1 + cell; x += 4) {
      var t = ((x - s0) / cell) * Math.PI;
      a.push([x, rows[1] + Math.sin(t) * 15]);
      b.push([x, rows[1] - Math.sin(t) * 15]);
    }
    canv += line(a, Palette.cream, 1.8);
    canv += line(b, Palette.cream, 1.8);
    // small loops around the middle dots
    for (var x = s0; x < x1; x += cell) {
      var lp = [];
      for (var i = 0; i <= 16; i++) {
        var t = (i / 16) * Math.PI * 2;
        lp.push([x + cell / 2 + Math.cos(t) * 6, rows[1] + Math.sin(t) * 6]);
      }
      canv += line(lp, Palette.cream, 1.4);
    }
    return canv;
  };
}();
