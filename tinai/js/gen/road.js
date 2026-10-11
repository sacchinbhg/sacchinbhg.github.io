// A dirt road winding through the near band, continuous along the whole
// scroll, with travellers on it. Fainter in the dry waste.
var Road = new function() {
  this.y = function(x) {
    return Layers.SHORE + 58 + (Noise.noise(x * 0.0017 + 300) - 0.5) * 110 + (Noise.noise(x * 0.008 + 400) - 0.5) * 14;
  };
  this.draw = function(x0, x1) {
    var canv = "";
    var top = [], bot = [];
    for (var x = x0; x <= x1; x += 10) {
      var y = this.y(x);
      top.push([x, y - 7]);
      bot.push([x, y + 7]);
    }
    var w = Tinai.weights((x0 + x1) / 2);
    var sg = Town.segment((x0 + x1) / 2);
    var near = sg ? Math.max(0, 1 - Math.abs((x0 + x1) / 2 - sg.center) / (Street.WIDTH / 2 + 200)) : 0;
    var op = (0.55 + 0.4 * (1 - w[4])) * (1 - Math.min(1, near * 1.6));
    if (op < 0.03) return "";
    canv += poly(top.concat(bot.slice().reverse()), { fil: "rgba(201,168,106," + op.toFixed(2) + ")", str: "none", wid: 0 });
    canv += line(top, "rgba(120,85,45,0.7)", 1);
    canv += line(bot, "rgba(120,85,45,0.7)", 1);
    // wheel ruts
    for (var x = x0; x < x1; x += 26) {
      var y = this.y(x + 8);
      canv += line([[x, y - 2.5], [x + 14, this.y(x + 22) - 2.5]], "rgba(120,85,45,0.5)", 0.8);
      canv += line([[x, y + 2.5], [x + 14, this.y(x + 22) + 2.5]], "rgba(120,85,45,0.5)", 0.8);
    }
    return canv;
  };
}();
