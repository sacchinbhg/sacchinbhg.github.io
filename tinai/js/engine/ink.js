// Nayak temple-mural idiom: flat mineral pigment fills with black outlines.
var INK = function(a) {
  return "rgba(36,26,18," + (a == undefined ? 0.9 : a) + ")";
};

// Stroke-only polyline.
function line(pts, col, wid) {
  if (pts.length < 2) return "";
  return poly(pts, { fil: "none", str: col || INK(), wid: wid || 1.2 });
}

// Filled, outlined shape. Points are closed automatically.
function shape(pts, fil, str, wid) {
  if (pts.length < 3) return "";
  var p = pts.concat([pts[0]]);
  return poly(p, { fil: fil, str: str == undefined ? INK() : str, wid: wid == undefined ? 1.3 : wid });
}

function tick(x, y, dx, dy, col, wid) {
  return line([[x, y], [x + dx, y + dy]], col, wid);
}

function dot(x, y, r, col, str, wid) {
  return (
    "<circle cx='" + x.toFixed(1) + "' cy='" + y.toFixed(1) + "' r='" + r.toFixed(1) +
    "' style='fill:" + (col || INK()) + ";stroke:" + (str || "none") +
    ";stroke-width:" + (wid || 0) + "'/>"
  );
}

// Axis aligned rectangle with a horizontal gradient between two colours,
// used for sky and ground bands so chunks blend into each other.
var gradN = 0;
function gradRect(x0, x1, y0, y1, c0, c1, opacity) {
  var id = "g" + (gradN++) + "_" + Math.abs(Math.round(x0));
  return (
    "<defs><linearGradient id='" + id + "' gradientUnits='userSpaceOnUse' x1='" + x0 +
    "' y1='0' x2='" + x1 + "' y2='0'><stop offset='0' stop-color='" + c0 +
    "'/><stop offset='1' stop-color='" + c1 + "'/></linearGradient></defs>" +
    "<rect x='" + x0 + "' y='" + y0 + "' width='" + (x1 - x0) + "' height='" + (y1 - y0) +
    "' fill='url(#" + id + ")'" + (opacity != undefined ? " fill-opacity='" + opacity + "'" : "") + "/>"
  );
}

// Rectangle with a vertical fade from transparent (top) to opacity (bottom).
function fadeRectV(x0, x1, y0, y1, col, opacity) {
  var id = "v" + (gradN++) + "_" + Math.abs(Math.round(x0));
  return (
    "<defs><linearGradient id='" + id + "' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='" + col +
    "' stop-opacity='0'/><stop offset='1' stop-color='" + col + "' stop-opacity='" + opacity + "'/></linearGradient></defs>" +
    "<rect x='" + x0 + "' y='" + y0 + "' width='" + (x1 - x0) + "' height='" + (y1 - y0) + "' fill='url(#" + id + ")'/>"
  );
}

// Rectangle whose opacity varies along x through a list of [x, opacity] stops.
function opacityRect(x0, x1, y0, y1, col, stops) {
  var id = "o" + (gradN++) + "_" + Math.abs(Math.round(x0));
  var s = "";
  for (var i = 0; i < stops.length; i++) {
    s += "<stop offset='" + ((stops[i][0] - x0) / (x1 - x0)).toFixed(3) + "' stop-color='" + col +
      "' stop-opacity='" + stops[i][1].toFixed(2) + "'/>";
  }
  return (
    "<defs><linearGradient id='" + id + "' gradientUnits='userSpaceOnUse' x1='" + x0 + "' y1='0' x2='" + x1 +
    "' y2='0'>" + s + "</linearGradient></defs><rect x='" + x0 + "' y='" + y0 + "' width='" + (x1 - x0) +
    "' height='" + (y1 - y0) + "' fill='url(#" + id + ")'/>"
  );
}

// Soft glow disc, for lamps at night.
function glow(x, y, r, col, opacity) {
  var id = "gl" + (gradN++) + "_" + Math.abs(Math.round(x));
  return (
    "<defs><radialGradient id='" + id + "'><stop offset='0' stop-color='" + col + "' stop-opacity='" + opacity +
    "'/><stop offset='1' stop-color='" + col + "' stop-opacity='0'/></radialGradient></defs>" +
    "<circle cx='" + x.toFixed(1) + "' cy='" + y.toFixed(1) + "' r='" + r.toFixed(1) + "' fill='url(#" + id + ")'/>"
  );
}

// Wrap SVG in an animated group. Classes are defined in the page CSS.
function anim(cls, svg, delay) {
  if (!svg) return "";
  return "<g class='" + cls + "'" + (delay != undefined ? " style='animation-delay:" + delay.toFixed(2) + "s'" : "") + ">" + svg + "</g>";
}

// Rectangle whose colour runs horizontally from c0 to c1 (continuous across
// chunks) and whose opacity fades vertically from 0 at the top to `opacity`
// at the bottom, via a luminance mask.
function gradRectVFade(x0, x1, y0, y1, c0, c1, opacity) {
  var id = "gv" + (gradN++) + "_" + Math.abs(Math.round(x0));
  return (
    "<defs><linearGradient id='" + id + "c' gradientUnits='userSpaceOnUse' x1='" + x0 + "' y1='0' x2='" + x1 + "' y2='0'>" +
    "<stop offset='0' stop-color='" + c0 + "'/><stop offset='1' stop-color='" + c1 + "'/></linearGradient>" +
    "<linearGradient id='" + id + "m' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#000'/><stop offset='1' stop-color='#fff'/></linearGradient>" +
    "<mask id='" + id + "k' maskUnits='userSpaceOnUse' x='" + x0 + "' y='" + y0 + "' width='" + (x1 - x0) + "' height='" + (y1 - y0) + "'>" +
    "<rect x='" + x0 + "' y='" + y0 + "' width='" + (x1 - x0) + "' height='" + (y1 - y0) + "' fill='url(#" + id + "m)'/></mask></defs>" +
    "<rect x='" + x0 + "' y='" + y0 + "' width='" + (x1 - x0) + "' height='" + (y1 - y0) + "' fill='url(#" + id + "c)' fill-opacity='" + opacity + "' mask='url(#" + id + "k)'/>"
  );
}
