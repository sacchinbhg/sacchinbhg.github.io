// The five landscapes (aintinai) of Sangam poetics, selected by low
// frequency noise along the x axis so an infinite scroll drifts from one
// to the next with blended transitions.
var Tinai = new function() {
  this.names = ["kurinji", "mullai", "marutham", "neithal", "paalai"];
  this.tamil = ["குறிஞ்சி", "முல்லை", "மருதம்", "நெய்தல்", "பாலை"];
  this.meta = [
    { land: "hills", time: "midnight", season: "cool", flower: "kurinji" },
    { land: "forest and pasture", time: "evening", season: "rains", flower: "jasmine" },
    { land: "river farmland", time: "dawn", season: "all", flower: "marutham" },
    { land: "backwaters and palm groves", time: "sunset", season: "all", flower: "punnai" },
    { land: "dry waste", time: "midday", season: "summer", flower: "paalai" },
  ];
  this.scale = 0.00035;

  this.raw = function(x) {
    var r = [];
    for (var k = 0; k < 5; k++) {
      r.push(Noise.noise(x * this.scale + 100, 17.1 + k * 23.7));
    }
    return r;
  };

  // weights per tinai, summing to 1
  this.weights = function(x) {
    var raw = this.raw(x);
    var w = [];
    var sum = 0;
    var best = 0;
    for (var k = 0; k < 5; k++) {
      w.push(Math.pow(Math.max(0, raw[k] - 0.42), 2));
      sum += w[k];
      if (raw[k] > raw[best]) best = k;
    }
    if (sum == 0) {
      w[best] = 1;
      sum = 1;
    }
    for (var k = 0; k < 5; k++) w[k] /= sum;
    return w;
  };

  // nagaram: how much of the busy town street is present at x. Its own
  // slow noise, suppressed in the hills and the waste.
  this.town = function(x) {
    var v = Noise.noise(x * 0.0005 + 500, 77.7);
    var t = Math.max(0, Math.min(1, (v - 0.5) * 8));
    var w = this.weights(x);
    return t * Math.max(0, 1 - w[0] * 0.7 - w[4] * 1.0);
  };

  this.dominant = function(x) {
    var w = this.weights(x);
    var best = 0;
    for (var k = 1; k < 5; k++) if (w[k] > w[best]) best = k;
    return best;
  };

  // weighted blend of a per-tinai table of numbers
  this.blend = function(x, table) {
    var w = this.weights(x);
    var v = 0;
    for (var k = 0; k < 5; k++) v += w[k] * table[k];
    return v;
  };
}();
