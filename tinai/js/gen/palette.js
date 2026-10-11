// Mineral pigment palette of the Nayak murals (Thanjavur, Srirangam,
// Thiruvarur): red and yellow ochre, terre verte, lime white, lamp black,
// with a little indigo. Per-tinai tables follow the Sangam time of day.
var Palette = new function() {
  this.black = "#241a12";
  this.cream = "#efe3c6";
  this.white = "#f6efdd";
  this.red = "#9e3a24";
  this.darkred = "#6e2415";
  this.orange = "#c4552d";
  this.yellow = "#d9a441";
  this.paleyellow = "#e8c477";
  this.green = "#4f6b3a";
  this.darkgreen = "#34492a";
  this.lightgreen = "#7d9a5a";
  this.indigo = "#2e3a5c";
  this.blue = "#4a6a86";
  this.brown = "#6b4a2b";
  this.darkbrown = "#3f2a16";

  // kurinji midnight, mullai evening, marutham dawn, neithal sunset, paalai midday
  this.sky = [[43, 51, 80], [141, 59, 42], [226, 185, 106], [196, 85, 45], [233, 215, 163]];
  this.skyLow = [[70, 80, 115], [190, 110, 60], [240, 215, 150], [230, 150, 70], [245, 235, 200]];
  this.ground = [[94, 112, 70], [111, 138, 68], [143, 160, 74], [217, 181, 106], [184, 102, 58]];
  this.far = [[60, 78, 60], [80, 105, 55], [120, 140, 70], [74, 106, 134], [205, 130, 75]];

  this.css = function(c) {
    return "rgb(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + ")";
  };
  this.mixArr = function(x, table) {
    var w = Tinai.weights(x);
    var c = [0, 0, 0];
    for (var k = 0; k < 5; k++) for (var i = 0; i < 3; i++) c[i] += w[k] * table[k][i];
    return c;
  };
  this.mix = function(x, table) {
    return this.css(this.mixArr(x, table));
  };
  // darken (f<1) or lighten (f>1) an rgb array
  this.shade = function(c, f) {
    return this.css([Math.min(255, c[0] * f), Math.min(255, c[1] * f), Math.min(255, c[2] * f)]);
  };
}();
