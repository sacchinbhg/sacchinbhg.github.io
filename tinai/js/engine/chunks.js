// Chunk engine. Generated SVG lives in 512 world-unit wide chunks that are
// planned and drawn on demand as the view scrolls. World space is 800 units
// tall; the visible world width follows the window aspect ratio.
var MEM = {
  canv: "",
  chunks: [],
  xmin: 0,
  xmax: 0,
  cwid: 512,
  cursx: 0,
  windx: 1200,
  windy: 800,
  vw: 1200, // visible world width
  rmin: 0, // world range currently rendered into the SVG
  rmax: 0,
  planner: null, // function(x0, x1) -> [{tag, x, y, draw}]
};

// --- deterministic per-chunk seeding -------------------------------------
// The original PRNG hashes seeds through btoa and loses precision on long
// strings, so chunks get a proper 32-bit string hash and set the state
// directly. This makes a chunk identical no matter which direction you
// scrolled to reach it.
function hashStr(str) {
  var h = 2166136261;
  for (var i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}
function seedFrom(str) {
  var y = hashStr(str) % Prng.m;
  var z = 1;
  while (y % Prng.p == 0 || y % Prng.q == 0 || y < 2) {
    y = hashStr(str + "#" + z) % Prng.m;
    z++;
  }
  Prng.s = y;
  for (var i = 0; i < 10; i++) Prng.next();
}

// --- chunk storage ---------------------------------------------------------
function addChunk(nch) {
  if (nch.canv.indexOf("NaN") != -1) {
    console.log("NaN in chunk", nch.tag, nch.x);
    nch.canv = nch.canv.replace(/NaN/g, -1000);
  }
  // keep sorted by y so lower (nearer) things draw in front
  var i = MEM.chunks.length;
  while (i > 0 && MEM.chunks[i - 1].y > nch.y) i--;
  MEM.chunks.splice(i, 0, nch);
}

function chunkloader(xmin, xmax) {
  while (xmax > MEM.xmax - MEM.cwid || xmin < MEM.xmin + MEM.cwid) {
    var x0, x1;
    if (xmax > MEM.xmax - MEM.cwid) {
      x0 = MEM.xmax;
      x1 = MEM.xmax + MEM.cwid;
      MEM.xmax = x1;
    } else {
      x0 = MEM.xmin - MEM.cwid;
      x1 = MEM.xmin;
      MEM.xmin = x0;
    }
    seedFrom(SEED + "|" + x0);
    var plan = MEM.planner(x0, x1);
    for (var i = 0; i < plan.length; i++) {
      var c = plan[i].draw();
      if (c && MEM.named && MEM.named(plan[i].tag)) c = "<g data-tag='" + plan[i].tag + "'>" + c + "</g>";
      addChunk({
        tag: plan[i].tag,
        x: plan[i].x,
        y: plan[i].y,
        w: plan[i].w,
        canv: c,
      });
    }
  }
}

function chunkrender(xmin, xmax) {
  MEM.canv = "";
  for (var i = 0; i < MEM.chunks.length; i++) {
    var c = MEM.chunks[i];
    // Background tiles span a full chunk, rather than a point at their left edge.
    var hw = c.w || (c.tag == "sky" || c.tag == "ground" || c.tag == "top" || c.tag == "bottom" ? MEM.cwid : 0);
    if (xmin - MEM.cwid < c.x + hw && c.x - hw < xmax + MEM.cwid) {
      MEM.canv += c.canv;
    }
  }
  MEM.rmin = Math.floor(xmin / MEM.cwid) * MEM.cwid;
  MEM.rmax = Math.ceil(xmax / MEM.cwid) * MEM.cwid;
}

// --- view ------------------------------------------------------------------
function fitWindow() {
  MEM.windx = Math.max(1, window.innerWidth);
  MEM.windy = Math.max(1, window.innerHeight);
  MEM.vw = (MEM.windx * 800) / MEM.windy;
}

function calcViewBox() {
  return MEM.cursx + " 0 " + MEM.vw + " 800";
}

function viewupdate() {
  var svg = document.getElementById("SVG");
  if (svg) svg.setAttribute("viewBox", calcViewBox());
  if (typeof onViewChange == "function") onViewChange();
}

function update() {
  chunkloader(MEM.cursx, MEM.cursx + MEM.vw);
  chunkrender(MEM.cursx, MEM.cursx + MEM.vw);
  document.getElementById("BG").innerHTML =
    "<svg id='SVG' xmlns='http://www.w3.org/2000/svg' width='" + MEM.windx +
    "' height='" + MEM.windy + "' viewBox='" + calcViewBox() + "'>" +
    "<g style='stroke-linecap:round;stroke-linejoin:round'>" + MEM.canv +
    "</g></svg>";
  if (typeof onViewChange == "function") onViewChange();
}

function xcroll(v) {
  MEM.cursx += v;
  // only rebuild the SVG when the view leaves what is already rendered
  if (MEM.cursx < MEM.rmin || MEM.cursx + MEM.vw > MEM.rmax) {
    update();
  } else {
    viewupdate();
  }
}

function autoxcroll(v) {
  if (document.getElementById("AUTO_SCROLL").checked) {
    xcroll(v);
    setTimeout(function() {
      autoxcroll(v);
    }, 2000);
  }
}

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:image/svg+xml;charset=utf-8," + encodeURIComponent(text),
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function parseArgs(key2f) {
  var par = window.location.href.split("?")[1];
  if (par == undefined) return;
  par = par.split("&");
  for (var i = 0; i < par.length; i++) {
    var e = par[i].split("=");
    try {
      key2f[e[0]](decodeURIComponent(e[1]));
    } catch (err) {
      console.log(err);
    }
  }
}
