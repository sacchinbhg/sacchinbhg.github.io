// Planner for one chunk. Returns plan entries with draw functions; the
// loader keeps them sorted by y so nearer things are drawn in front.
// Two registers hold the content: a far band just below the horizon with
// small things, and a near band in front with large ones.

// what each landscape is populated with, and how often
// order: kurinji, mullai, marutham, neithal, paalai
var NEAR_ITEMS = [
  // kurinji
  [["palm", 0.6], ["kurinji", 5], ["goat", 2], ["hunter", 1.2], ["banyan", 0.8], ["woman", 0.5], ["elephant", 1], ["elephantcalf", 0.5], ["deer", 0.8], ["flame", 0.6],
   ["bear", 0.5], ["tiger", 0.5], ["boar", 0.6], ["monkey", 0.8], ["milletfield", 1.5], ["bamboo", 1.2], ["dolmen", 0.4], ["jackfruit", 0.6], ["tamarind", 0.4], ["warrior", 0.4],
   ["inscription", 0.2], ["firewood", 0.5], ["sitting", 0.3], ["child", 0.3], ["cobra", 0.2], ["squirrel", 0.3], ["hibiscus", 0.4],
   ["peacockdisplay", 1.2], ["peacockpair", 0.8], ["peahens", 0.6], ["peacock", 0.8], ["sadhu", 0.5], ["silambam", 0.4], ["snakecharmer", 0.2], ["lingashrine", 0.5]],
  // mullai
  [["palm", 0.4], ["mango", 2], ["banyan", 1], ["cow", 1.5], ["herd", 1.6], ["cowherd", 1], ["hut", 0.4], ["village", 0.5], ["woman", 0.6], ["women", 0.6], ["peacock", 1.4], ["deer", 1],
   ["flame", 1.2], ["jasmine", 2], ["herostone", 0.4], ["mandapam", 0.3], ["dog", 0.8], ["monkey", 0.5], ["hen", 1], ["chicks", 0.6], ["squirrel", 0.3], ["parrot", 0.4], ["crow", 0.5],
   ["neem", 1.5], ["tamarind", 1.2], ["jackfruit", 0.8], ["peepal", 0.8], ["hibiscus", 1], ["bougainvillea", 0.6], ["cattleshed", 0.6], ["granary", 0.6], ["haystack", 0.8],
   ["ploughman", 0.6], ["haycarrier", 0.6], ["milkmaid", 0.6], ["feedinghens", 0.6], ["pounding", 0.4], ["child", 0.6], ["children", 0.4], ["kiteflyer", 0.4], ["elder", 0.4],
   ["pillaiyar", 0.5], ["nagakal", 0.3], ["fence", 0.6], ["vinehut", 0.5], ["flautist", 0.4], ["sitting", 0.5], ["firewood", 0.5], ["motherchild", 0.5], ["horse", 0.3],
   ["butterfly", 0.8], ["tulsi", 0.3], ["muruganshrine", 0.2], ["peacockdisplay", 1.2], ["peacockpair", 1], ["peahens", 0.6], ["kolattam", 0.4],
   ["karagattam", 0.3], ["oilpress", 0.3], ["threshing", 0.5], ["school", 0.3], ["pallanguzhi", 0.3], ["cockfight", 0.3], ["umbrellawalker", 0.5], ["lampwoman", 0.3],
   ["silambam", 0.3], ["barber", 0.2], ["wedding", 0.15], ["lingashrine", 0.4]],
  // marutham
  [["palm", 0.6], ["banana", 2.5], ["plantainbunch", 1.2], ["mango", 1.5], ["womanpot", 1.2], ["women", 1], ["farmer", 1], ["leafcarrier", 0.9], ["cow", 1], ["hut", 0.4], ["village", 0.4],
   ["cart", 0.8], ["heron", 1], ["buffalo", 1], ["tank", 0.5], ["temple_elephant", 0.4], ["coconut", 1.5], ["peacock", 0.5], ["flame", 0.8], ["mandapam", 0.5], ["pongal", 0.7],
   ["ploughman", 0.9], ["kamalai", 0.4], ["granary", 0.6], ["haystack", 0.8], ["sugarcanefield", 1], ["papaya", 0.6], ["drumstick", 0.6], ["tamarind", 0.6], ["neem", 0.8],
   ["peepal", 0.6], ["areca", 0.8], ["hibiscus", 0.6], ["tulsi", 0.4], ["agraharam", 0.4], ["marketstall", 0.5], ["vendor", 0.5], ["garlandseller", 0.4], ["potter", 0.4],
   ["weaver", 0.4], ["kiln", 0.3], ["priest", 0.5], ["lamptower", 0.3], ["gate", 0.4], ["pillaiyar", 0.6], ["lingam", 0.3], ["winnower", 0.6], ["pounding", 0.5], ["grinder", 0.4],
   ["kolamdrawer", 0.6], ["motherchild", 0.5], ["dancer", 0.3], ["nadaswaram", 0.3], ["hen", 0.8], ["chicks", 0.5], ["dog", 0.5], ["crow", 0.4], ["parrot", 0.3], ["child", 0.6],
   ["children", 0.4], ["elder", 0.4], ["palanquin", 0.2], ["horseman", 0.3], ["inscription", 0.3], ["fence", 0.5], ["vinehut", 0.5], ["polecarrier", 0.5], ["fortuneteller", 0.2],
   ["butterfly", 0.5], ["spinner", 0.3], ["peacockdisplay", 0.7], ["peacockpair", 0.5], ["threshing", 0.6], ["oilpress", 0.4], ["school", 0.3], ["kolattam", 0.4],
   ["karagattam", 0.4], ["pallanguzhi", 0.3], ["lampwoman", 0.4], ["wedding", 0.2], ["barber", 0.2], ["snakecharmer", 0.15], ["sadhu", 0.2]],
  // neithal (backwaters)
  [["palm", 3.5], ["coconut", 3], ["banana", 1.2], ["plantainbunch", 0.8], ["hut", 0.8], ["village", 0.4], ["womanhip", 1], ["man", 0.6], ["fish", 1], ["crab", 0.8], ["nets", 1], ["heron", 0.8],
   ["mango", 0.6], ["netcaster", 1], ["toddytapper", 0.8], ["areca", 1], ["papaya", 0.5], ["drumstick", 0.4], ["hen", 0.6], ["dog", 0.5], ["crow", 0.6], ["vinehut", 0.5],
   ["marketstall", 0.3], ["vendor", 0.4], ["child", 0.5], ["kiteflyer", 0.5], ["tortoise", 0.4], ["frog", 0.3], ["bougainvillea", 0.4], ["hibiscus", 0.5], ["granary", 0.3],
   ["fence", 0.4], ["motherchild", 0.4], ["firewood", 0.4], ["spinner", 0.3], ["pillaiyar", 0.3], ["coconutclimber", 0.8], ["peacock", 0.4], ["peahens", 0.3],
   ["pallanguzhi", 0.2], ["lampwoman", 0.3], ["kolattam", 0.2]],
  // paalai
  [["palm", 1.2], ["thorn", 4], ["goat", 2.5], ["wayfarer", 1.6], ["horse", 0.7], ["village", 0.3], ["herostone", 0.7], ["pricklypear", 2], ["agave", 1.5], ["jackal", 0.8],
   ["boar", 0.3], ["dolmen", 0.4], ["donkey", 0.6], ["elder", 0.4], ["polecarrier", 0.4], ["warrior", 0.3], ["inscription", 0.2], ["fortuneteller", 0.2], ["cobra", 0.3],
   ["haycarrier", 0.3], ["horseman", 0.3], ["tamarind", 0.3], ["neem", 0.5], ["crow", 0.5], ["dog", 0.4], ["sadhu", 0.4], ["umbrellawalker", 0.2], ["peahens", 0.2], ["snakecharmer", 0.2]],
];
var NEAR_SPACING = [40, 32, 32, 32, 50];
var FAR_ITEMS = [
  [["kurinji", 6], ["shrine", 0.8], ["goat", 1.5], ["hunter", 0.5], ["elephant", 0.6], ["herostone", 0.3], ["bamboo", 0.8], ["milletfield", 1], ["tiger", 0.2], ["bear", 0.2], ["dolmen", 0.3]],
  [["mango", 3], ["banyan", 1.5], ["cow", 2], ["herd", 1], ["hut", 1], ["cowherd", 0.6], ["peacock", 0.5], ["deer", 0.8], ["flame", 1], ["jasmine", 1.5], ["neem", 1.5], ["tamarind", 1], ["haystack", 0.6], ["granary", 0.4], ["cattleshed", 0.3], ["fence", 0.5]],
  [["banana", 2], ["mango", 2], ["hut", 1.2], ["palm", 1], ["coconut", 1.5], ["womanpot", 1], ["cow", 1], ["heron", 1], ["buffalo", 0.6], ["tank", 0.4], ["cart", 0.4], ["areca", 1], ["sugarcanefield", 0.8], ["neem", 0.8], ["haystack", 0.6], ["granary", 0.4], ["agraharam", 0.3], ["ploughman", 0.5], ["lamptower", 0.2]],
  [["palm", 2], ["coconut", 2], ["banana", 1], ["hut", 0.8], ["heron", 0.6], ["mango", 0.8], ["areca", 1], ["nets", 0.4]],
  [["thorn", 4], ["goat", 1.5], ["horse", 0.4], ["wayfarer", 0.7], ["herostone", 0.3], ["pricklypear", 1.2], ["agave", 1], ["jackal", 0.4], ["dolmen", 0.3]],
];
var FAR_SPACING = [28, 22, 26, 28, 40];

// registry of the newer subjects: name -> draw(x, y, s, dir, w)
var ITEMS = {
  // people
  sitting: function(x, y, s, d) { return People.sitting(x, y, { sca: s, dir: d }); },
  elder: function(x, y, s, d) { return People.elder(x, y, { sca: s, dir: d }); },
  priest: function(x, y, s, d) { return People.priest(x, y, { sca: s, dir: d }); },
  netcaster: function(x, y, s, d) { return People.netCaster(x, y, { sca: s, dir: d }); },
  ploughman: function(x, y, s, d) { return People.ploughman(x, y, { sca: s, dir: d }); },
  polecarrier: function(x, y, s, d) { return People.poleCarrier(x, y, { sca: s, dir: d }); },
  nadaswaram: function(x, y, s, d) { return People.nadaswaram(x, y, { sca: s, dir: d }) + People.thavil(x + 24 * s * d, y + 2, { sca: s, dir: d }); },
  flautist: function(x, y, s, d) { return People.flautist(x, y, { sca: s, dir: d }); },
  potter: function(x, y, s, d) { return People.potter(x, y, { sca: s, dir: d }); },
  weaver: function(x, y, s, d) { return People.weaver(x, y, { sca: s, dir: d }); },
  vendor: function(x, y, s, d) { return People.vendor(x, y, { sca: s, dir: d }); },
  kiteflyer: function(x, y, s, d) { return People.kiteFlyer(x, y, { sca: s, dir: d }); },
  child: function(x, y, s, d) { return People.child(x, y, { sca: s, dir: d, girl: Math.random() < 0.5 }); },
  children: function(x, y, s, d) { return People.child(x, y, { sca: s, dir: d }) + People.child(x + 18 * s * d, y + 3, { sca: s, dir: -d, girl: true }); },
  warrior: function(x, y, s, d) { return People.warrior(x, y, { sca: s, dir: d }); },
  haycarrier: function(x, y, s, d) { return People.hayCarrier(x, y, { sca: s, dir: d }); },
  fortuneteller: function(x, y, s, d) { return People.fortuneTeller(x, y, { sca: s, dir: d }); },
  toddytapper: function(x, y, s, d) { return People.toddyTapper(x, y, { sca: s, dir: d }); },
  winnower: function(x, y, s, d) { return People.winnower(x, y, { sca: s, dir: d }); },
  pounding: function(x, y, s, d) { return People.pounding(x, y, { sca: s, dir: d }); },
  grinder: function(x, y, s, d) { return People.grinder(x, y, { sca: s, dir: d }); },
  firewood: function(x, y, s, d) { return People.firewood(x, y, { sca: s, dir: d }); },
  kolamdrawer: function(x, y, s, d) { return People.kolamDrawer(x, y, { sca: s, dir: d }); },
  motherchild: function(x, y, s, d) { return People.motherChild(x, y, { sca: s, dir: d }); },
  garlandseller: function(x, y, s, d) { return People.garlandSeller(x, y, { sca: s, dir: d }); },
  dancer: function(x, y, s, d) { return People.dancer(x, y, { sca: s, dir: d }); },
  milkmaid: function(x, y, s, d) { return People.milkmaid(x, y, { sca: s, dir: d }); },
  feedinghens: function(x, y, s, d) { return People.feedingHens(x, y, { sca: s, dir: d }); },
  spinner: function(x, y, s, d) { return People.spinner(x, y, { sca: s, dir: d }); },
  pillaiyar: function(x, y, s, d) { return People.pillaiyar(x, y, { sca: s }); },
  lingam: function(x, y, s, d) { return People.lingam(x, y, { sca: s }); },
  muruganshrine: function(x, y, s, d) { return People.murugan(x, y, { sca: s, dir: d }); },
  nagakal: function(x, y, s, d) { return People.nagakal(x, y, { sca: s }); },
  silambam: function(x, y, s, d) { return People.silambam(x, y, { sca: s }); },
  kolattam: function(x, y, s, d) { return People.kolattam(x, y, { sca: s }); },
  karagattam: function(x, y, s, d) { return People.karagattam(x, y, { sca: s, dir: d }); },
  oilpress: function(x, y, s, d) { return People.oilPress(x, y, { sca: s, dir: d }); },
  threshing: function(x, y, s, d) { return People.threshing(x, y, { sca: s, dir: d }); },
  school: function(x, y, s, d) { return People.school(x, y, { sca: s, dir: d }); },
  sadhu: function(x, y, s, d) { return People.sadhu(x, y, { sca: s, dir: d }); },
  lampwoman: function(x, y, s, d) { return People.lampWoman(x, y, { sca: s, dir: d }); },
  umbrellawalker: function(x, y, s, d) { return People.umbrellaWalker(x, y, { sca: s, dir: d }); },
  pallanguzhi: function(x, y, s, d) { return People.pallanguzhi(x, y, { sca: s }); },
  snakecharmer: function(x, y, s, d) { return People.snakeCharmer(x, y, { sca: s, dir: d }); },
  barber: function(x, y, s, d) { return People.barber(x, y, { sca: s, dir: d }); },
  cockfight: function(x, y, s, d) { return People.cockfight(x, y, { sca: s }); },
  wedding: function(x, y, s, d) { return People.wedding(x, y, { sca: s }); },
  coconutclimber: function(x, y, s, d) { return People.coconutClimber(x, y, { sca: s, dir: d }); },
  peacockdisplay: function(x, y, s, d) { return Figures.peacockDisplay(x, y, { sca: s, dir: d }); },
  peacockpair: function(x, y, s, d) { return Figures.peacockDisplay(x, y, { sca: s, dir: d }) + Figures.peahen(x - 40 * s * d, y + 3, { sca: s, dir: -d }); },
  peahens: function(x, y, s, d) { return Figures.peahen(x, y, { sca: s, dir: d }) + Figures.peahen(x + 22 * s * d, y - 4, { sca: s * 0.9, dir: d }); },
  // fauna
  hen: function(x, y, s, d) { return Fauna.hen(x, y, { sca: s, dir: d, rooster: Math.random() < 0.3 }); },
  chicks: function(x, y, s, d) { return Fauna.chicks(x, y, { sca: s, dir: d }); },
  dog: function(x, y, s, d) { return Fauna.dog(x, y, { sca: s, dir: d }); },
  monkey: function(x, y, s, d) { return Fauna.monkey(x, y, { sca: s, dir: d }); },
  squirrel: function(x, y, s, d) { return Fauna.squirrel(x, y, { sca: s, dir: d }); },
  parrot: function(x, y, s, d) { return Fauna.parrot(x, y - 30 * s, { sca: s, dir: d }); },
  crow: function(x, y, s, d) { return Fauna.crow(x, y, { sca: s, dir: d }); },
  cobra: function(x, y, s, d) { return Fauna.cobra(x, y, { sca: s, dir: d }); },
  tortoise: function(x, y, s, d) { return Fauna.tortoise(x, y, { sca: s, dir: d }); },
  frog: function(x, y, s, d) { return Fauna.frog(x, y, { sca: s, dir: d }); },
  butterfly: function(x, y, s, d) { return Fauna.butterfly(x, y - 20 * s, { sca: s }) + Fauna.butterfly(x + 14 * s, y - 32 * s, { sca: s * 0.8 }); },
  bear: function(x, y, s, d) { return Fauna.bear(x, y, { sca: s, dir: d }); },
  tiger: function(x, y, s, d) { return Fauna.tiger(x, y, { sca: s, dir: d }); },
  boar: function(x, y, s, d) { return Fauna.boar(x, y, { sca: s, dir: d }); },
  jackal: function(x, y, s, d) { return Fauna.jackal(x, y, { sca: s, dir: d }); },
  elephantcalf: function(x, y, s, d) { return Fauna.elephantCalf(x, y, { sca: s, dir: d }); },
  horse: function(x, y, s, d) { return Fauna.horse(x, y, { sca: s, dir: d }); },
  horseman: function(x, y, s, d) { return Fauna.horse(x, y, { sca: s, dir: d, rider: true }); },
  donkey: function(x, y, s, d) { return Fauna.donkey(x, y, { sca: s, dir: d }) + Figures.man(x - 30 * s * d, y + 2, { sca: s * 0.9, dir: d, prop: "stick" }); },
  // flora
  tamarind: function(x, y, s) { return Flora.tamarind(x, y, { sca: s }); },
  neem: function(x, y, s) { return Flora.neem(x, y, { sca: s }); },
  jackfruit: function(x, y, s) { return Flora.jackfruit(x, y, { sca: s }); },
  peepal: function(x, y, s) { return Flora.peepal(x, y, { sca: s }); },
  areca: function(x, y, s) { return Flora.areca(x, y, { sca: s }); },
  bamboo: function(x, y, s) { return Flora.bamboo(x, y, { sca: s }); },
  papaya: function(x, y, s) { return Flora.papaya(x, y, { sca: s }); },
  drumstick: function(x, y, s) { return Flora.drumstick(x, y, { sca: s }); },
  hibiscus: function(x, y, s) { return Flora.hibiscus(x, y, { sca: s }); },
  bougainvillea: function(x, y, s) { return Flora.bougainvillea(x, y, { sca: s }); },
  tulsi: function(x, y, s) { return Flora.tulsi(x, y, { sca: s }); },
  pricklypear: function(x, y, s) { return Flora.pricklyPear(x, y, { sca: s }); },
  agave: function(x, y, s) { return Flora.agave(x, y, { sca: s }); },
  sugarcanefield: function(x, y, s) { return Flora.sugarcaneField(x, y, { sca: s }); },
  milletfield: function(x, y, s) { return Flora.milletField(x, y, { sca: s }); },
  plantainbunch: function(x, y, s) { return Flora.plantainBunch(x, y, { sca: s }); },
  haystack: function(x, y, s) { return Flora.haystack(x, y, { sca: s }); },
  // built
  mansion: function(x, y, s) { return Built.mansion(x, y, { sca: s }); },
  agraharam: function(x, y, s) { return Built.agraharam(x, y, { sca: s }); },
  inscription: function(x, y, s) { return Built.inscription(x, y, { sca: s }); },
  granary: function(x, y, s) { return Built.granary(x, y, { sca: s }); },
  cattleshed: function(x, y, s) { return Built.cattleShed(x, y, { sca: s }); },
  kiln: function(x, y, s) { return Built.kiln(x, y, { sca: s }); },
  kamalai: function(x, y, s) { return Built.kamalai(x, y, { sca: s }); },
  palanquin: function(x, y, s, d) { return Built.palanquin(x, y, { sca: s, dir: d }); },
  lamptower: function(x, y, s) { return Built.lampTower(x, y, { sca: s }); },
  dolmen: function(x, y, s) { return Built.dolmen(x, y, { sca: s }); },
  marketstall: function(x, y, s) { return Built.marketStall(x, y, { sca: s }); },
  fence: function(x, y, s) { return Built.fence(x, y, { sca: s, width: (50 + Math.random() * 60) * s }); },
  gate: function(x, y, s) { return Built.gate(x, y, { sca: s }); },
  ratha: function(x, y, s) { return Built.ratha(x, y, { sca: s }); },
  vinehut: function(x, y, s) { return Built.vineHut(x, y, { sca: s }); },
};

function pickItem(w, table) {
  // choose a tinai by weight, then an item from its table
  var r = Math.random();
  var k = 0;
  for (; k < 4; k++) {
    r -= w[k];
    if (r <= 0) break;
  }
  var items = table[k];
  var tot = 0;
  for (var i = 0; i < items.length; i++) tot += items[i][1];
  r = Math.random() * tot;
  for (var i = 0; i < items.length; i++) {
    r -= items[i][1];
    if (r <= 0) return items[i][0];
  }
  return items[items.length - 1][0];
}

function makeItem(kind, x, y, s, w) {
  var dir = Math.random() < 0.5 ? -1 : 1;
  if (ITEMS[kind]) return function() { return ITEMS[kind](x, y, s, dir, w); };
  switch (kind) {
    case "palm":
      var o = {
        sca: s, hei: 210 + Math.random() * 130 - w[4] * 80,
        lean: normRand(-0.1, 0.1) + w[3] * normRand(-0.2, 0.2),
        dead: 1 + Math.floor(Math.random() * 3) + Math.floor(w[4] * 4),
        fronds: 8 + Math.floor(Math.random() * 5) - Math.floor(w[4] * 3),
      };
      return function() { return Palmyra.tree(x, y, o); };
    case "mango": return function() { return Trees.mango(x, y, { sca: s }); };
    case "banyan": return function() { return Trees.banyan(x, y, { sca: s }); };
    case "banana": return function() { return Trees.banana(x, y, { sca: s }); };
    case "thorn": return function() { return Trees.thorn(x, y, { sca: s }); };
    case "kurinji": return function() { return Trees.kurinji(x, y, { sca: s }); };
    case "cow": return function() { return Figures.cow(x, y, { sca: s, dir: dir }); };
    case "goat": return function() { return Figures.goat(x, y, { sca: s, dir: dir }); };
    case "man": return function() { return Figures.man(x, y, { sca: s, dir: dir }); };
    case "hunter": return function() { return Figures.man(x, y, { sca: s, dir: dir, prop: "bow" }); };
    case "cowherd": return function() { return Figures.man(x, y, { sca: s, dir: dir, prop: "stick" }); };
    case "wayfarer": return function() { return Figures.man(x, y, { sca: s, dir: dir, prop: "stick" }); };
    case "farmer": return function() { return Figures.man(x, y, { sca: s, dir: dir, prop: "stick" }); };
    case "woman": return function() { return Figures.woman(x, y, { sca: s, dir: dir }); };
    case "womanpot": return function() { return Figures.woman(x, y, { sca: s, dir: dir, prop: "pot" }); };
    case "womanhip": return function() { return Figures.woman(x, y, { sca: s, dir: dir, prop: "hippot" }); };
    case "hut": return function() { return Arch.hut(x, y, { sca: s }); };
    case "horse": return function() { return Arch.horse(x, y, { sca: s, dir: dir }); };
    case "shrine": return function() { return Arch.shrine(x, y, { sca: s }); };
    case "elephant": return function() { return Figures.elephant(x, y, { sca: s, dir: dir }); };
    case "temple_elephant": return function() { return Figures.elephant(x, y, { sca: s, dir: dir, temple: true }); };
    case "peacock": return function() { return Figures.peacock(x, y, { sca: s, dir: dir }); };
    case "deer": return function() { return Figures.deer(x, y, { sca: s, dir: dir }); };
    case "heron": return function() { return Figures.heron(x, y, { sca: s, dir: dir }); };
    case "buffalo": return function() { return Figures.cow(x, y, { sca: s, dir: dir, buffalo: true }); };
    case "coconut": return function() { return Trees.coconut(x, y, { sca: s }); };
    case "cart": return function() { return Arch.cart(x, y, { sca: s, dir: dir }); };
    case "tank": return function() { return Arch.tank(x, y, { sca: s }); };
    case "fish": return function() { return Figures.fish(x, y, { sca: s, dir: dir }); };
    case "crab": return function() { return Figures.crab(x, y, { sca: s }); };
    case "nets": return function() { return Arch.nets(x, y, { sca: s }); };
    case "flame": return function() { return Trees.mango(x, y, { sca: s, flower: true }); };
    case "jasmine": return function() { return Trees.kurinji(x, y, { sca: s, white: true }); };
    case "village": return function() { return Arch.village(x, y, { sca: s }); };
    case "mandapam": return function() { return Arch.mandapam(x, y, { sca: s }); };
    case "herostone": return function() { return Arch.herostone(x, y, { sca: s }); };
    case "pongal": return function() { return Arch.pongal(x, y, { sca: s }); };
    case "leafcarrier": return function() { return Figures.man(x, y, { sca: s, dir: dir, prop: "leaves" }); };
    case "herd":
      return function() {
        var out = "";
        var n = 3 + Math.floor(Math.random() * 3);
        for (var i = 0; i < n; i++) out += Figures.cow(x + i * 36 * s * dir + (Math.random() - 0.5) * 8, y - (i % 2) * 7 * s, { sca: s * (0.9 + Math.random() * 0.2), dir: dir });
        out += Figures.man(x - 28 * s * dir, y + 2, { sca: s, dir: dir, prop: "stick" });
        return out;
      };
    case "women":
      return function() {
        var out = "";
        var n = 2 + Math.floor(Math.random() * 2);
        for (var i = 0; i < n; i++) out += Figures.woman(x + i * 24 * s * dir, y + (i % 2) * 3, { sca: s, dir: dir, prop: i == 1 ? "hippot" : "pot" });
        return out;
      };
  }
  return null;
}


// approximate footprints [width, height] at scale 1, anchored at the feet
var FOOT = {
  palm: [70, 320], coconut: [90, 260], mango: [120, 120], banyan: [180, 150], banana: [60, 70], thorn: [50, 60], kurinji: [30, 25], flame: [120, 120],
  jasmine: [30, 25], tamarind: [200, 170], neem: [130, 130], jackfruit: [110, 130], peepal: [180, 170], areca: [60, 230], bamboo: [70, 130], papaya: [50, 80],
  drumstick: [60, 80], hibiscus: [40, 35], bougainvillea: [70, 50], tulsi: [20, 25], pricklypear: [30, 50], agave: [50, 40], sugarcanefield: [120, 70],
  milletfield: [100, 40], plantainbunch: [70, 80], haystack: [50, 45], herd: [180, 70], women: [80, 70], kolattam: [120, 70], silambam: [80, 80],
  jallikattu: [200, 80], oilpress: [140, 60], threshing: [160, 60], school: [180, 90], pounding: [60, 70], wedding: [200, 80], cockfight: [110, 50],
  dhobi: [120, 50], ploughman: [160, 60], cart: [220, 80], village: [280, 80], hut: [70, 60], vinehut: [90, 70], mansion: [170, 120], agraharam: [180, 70],
  marketstall: [90, 60], tank: [220, 60], cattleshed: [180, 60], granary: [50, 55], kiln: [120, 40], kamalai: [180, 70], fence: [100, 20], gate: [60, 60],
  inscription: [30, 80], lamptower: [30, 80], mandapam: [90, 60], herostone: [30, 45], dolmen: [50, 35], pongal: [110, 80], horse: [80, 70], horseman: [80, 90],
  elephant: [140, 90], temple_elephant: [140, 120], elephantcalf: [200, 90], cow: [60, 45], buffalo: [70, 50], goat: [40, 30], deer: [60, 55], peacock: [80, 45],
  peacockdisplay: [100, 70], peacockpair: [150, 70], peahens: [60, 35], tiger: [90, 40], bear: [70, 40], boar: [50, 30], jackal: [60, 35], dog: [50, 35],
  monkey: [40, 35], hen: [20, 25], chicks: [60, 25], crow: [20, 15], squirrel: [20, 15], parrot: [15, 40], cobra: [40, 35], tortoise: [30, 15], frog: [20, 10],
  butterfly: [30, 40], pillaiyar: [45, 45], lingam: [35, 30], muruganshrine: [40, 70], nagakal: [50, 35], donkey: [90, 40], palanquin: [160, 60],
  toddytapper: [70, 240], coconutclimber: [90, 260], potter: [110, 50], weaver: [110, 50], vendor: [110, 50], fortuneteller: [90, 50], garlandseller: [110, 60],
  spinner: [90, 50], grinder: [90, 50], milkmaid: [120, 50], feedinghens: [120, 60], kiteflyer: [100, 110], barber: [80, 60], snakecharmer: [110, 50],
  pallanguzhi: [90, 50], sadhu: [80, 70], netcaster: [90, 70], polecarrier: [80, 80], karagattam: [70, 100], lampwoman: [40, 70], umbrellawalker: [60, 80],
  pond: [140, 40],
};
var SOLID = {
  hut: 1, village: 1, vinehut: 1, mansion: 1, agraharam: 1, marketstall: 1, tank: 1, cattleshed: 1, granary: 1, kiln: 1, kamalai: 1, gate: 1, mandapam: 1,
  lamptower: 1, inscription: 1, pongal: 1, school: 1, wedding: 1, threshing: 1, oilpress: 1, pillaiyar: 1, lingam: 1, muruganshrine: 1, nagakal: 1,
  herostone: 1, dolmen: 1, pond: 1, cart: 1, palanquin: 1, jallikattu: 1, kolattam: 1, silambam: 1, cockfight: 1, ploughman: 1,
};
// things with a lamp or hearth: they glow at night
var LIT = {
  hut: [0, -14, 26], vinehut: [0, -14, 26], village: [0, -14, 60], mansion: [0, -30, 50], agraharam: [0, -16, 60], lamptower: [0, -50, 34], pongal: [0, -8, 30],
  shrine: [0, -10, 22], pillaiyar: [18, -4, 16], lampwoman: [10, -28, 18], gopuram: [0, -30, 50], cholatemple: [60, -20, 70], natarajashrine: [0, -30, 60],
  marketstall: [0, -24, 30], wedding: [0, -8, 50], festival: [0, -60, 90], templestreet: [0, -30, 90], hamlet: [0, -14, 80], kiln: [0, -6, 30], lingam: [0, -6, 16],
};

// scene clusters: related things laid out together
var CLUSTERS = {
  hamlet: function(s) {
    var items = [["hut", -70, -12, 1], ["hut", 10, 0, 1.05], ["vinehut", 92, -6, 0.95], ["well", 150, 6, 0.9], ["tulsi", 44, 10, 0.8], ["kolamdrawer", -20, 14, 0.85],
      ["hen", -100, 12, 0.9], ["chicks", 60, 20, 0.8], ["dog", 120, 22, 0.9], ["haystack", 200, 0, 0.9], ["neem", -150, -10, 0.9], ["women", -60, 30, 0.9], ["child", 100, 30, 1]];
    return items;
  },
  templestreet: function(s) {
    return [["gopuram", 0, -40, 0.6], ["tank", 170, 0, 0.7], ["lamptower", -60, 0, 0.8], ["gate", -110, 6, 0.9], ["garlandseller", -160, 16, 0.9], ["priest", 30, 14, 0.95],
      ["women", 80, 24, 0.9], ["pillaiyar", -200, 4, 0.9], ["peepal", -250, -10, 0.9], ["cart", 120, 36, 0.8], ["elder", -40, 28, 0.9], ["vendor", 230, 26, 0.9]];
  },
  grove: function(s) {
    var t = ["mango", "tamarind", "jackfruit", "neem", "flame", "peepal"];
    return [[t[Math.floor(Math.random() * 6)], -90, -10, 1], [t[Math.floor(Math.random() * 6)], 20, -4, 1.05], [t[Math.floor(Math.random() * 6)], 120, -12, 0.95],
      ["peacockpair", -30, 24, 0.9], ["deer", 90, 26, 0.9], ["monkey", -120, 20, 0.9], ["squirrel", 60, 20, 1], ["jasmine", 160, 22, 1], ["sitting", -60, 30, 0.9]];
  },
  pasture: function(s) {
    return [["herd", -40, 10, 1], ["flautist", 120, 20, 0.9], ["banyan", 160, -14, 0.95], ["haystack", -150, 0, 0.9], ["fence", 60, 30, 1], ["cow", -160, 24, 0.9], ["crow", 180, 26, 1]];
  },
  market: function(s) {
    return [["marketstall", -70, -6, 1], ["marketstall", 50, 0, 0.95], ["vendor", 150, 10, 0.95], ["garlandseller", -170, 8, 0.9], ["women", 0, 26, 0.9], ["man", 100, 30, 0.9],
      ["donkey", 220, 14, 0.9], ["child", -110, 32, 1], ["dog", 190, 32, 0.9], ["fortuneteller", -230, 20, 0.9]];
  },
  threshingyard: function(s) {
    return [["threshing", 0, 0, 1], ["haystack", 120, -8, 1], ["haystack", 150, 14, 0.8], ["granary", -120, -6, 1], ["cart", -200, 10, 0.85], ["winnower", 90, 26, 0.9], ["pounding", -60, 30, 0.9], ["hen", 40, 34, 0.9]];
  },
  weavers: function(s) {
    return [["agraharam", 0, -16, 1], ["weaver", -120, 14, 0.95], ["potter", 120, 16, 0.95], ["spinner", -40, 30, 0.9], ["kiln", 220, 4, 0.9], ["dog", 60, 34, 0.9]];
  },
  shrineTree: function(s) {
    return [["banyan", 0, -6, 1.1], ["pillaiyar", 50, 14, 1], ["nagakal", -50, 14, 1], ["sadhu", 110, 24, 0.9], ["lampwoman", -100, 24, 0.9], ["monkey", 30, 28, 0.9]];
  },
  shivaStreet: function(s) {
    return [["shivatemple", 0, -30, 1], ["lamptower", -110, 0, 0.9], ["gate", 140, 6, 0.9], ["priest", -60, 14, 0.9], ["women", 90, 26, 0.9], ["sadhu", -150, 20, 0.9], ["garlandseller", 190, 20, 0.9], ["peepal", -220, -10, 0.9], ["cow", 40, 30, 0.9]];
  },
};
var CLUSTER_FOOT = { shivaStreet: [480, 140], hamlet: [420, 90], templestreet: [520, 110], grove: [330, 100], pasture: [380, 70], market: [500, 70], threshingyard: [420, 70], weavers: [440, 70], shrineTree: [260, 110] };
var CLUSTER_W = [
  [["grove", 1], ["shrineTree", 0.4], ["hamlet", 0.3]],
  [["hamlet", 1.4], ["pasture", 1.4], ["grove", 1.2], ["shrineTree", 0.6], ["threshingyard", 0.4], ["shivaStreet", 0.3]],
  [["hamlet", 1.2], ["templestreet", 1], ["shivaStreet", 0.6], ["market", 0.8], ["threshingyard", 1], ["weavers", 0.6], ["grove", 0.6], ["shrineTree", 0.5]],
  [["hamlet", 1], ["grove", 0.5], ["market", 0.4]],
  [["hamlet", 0.4], ["shrineTree", 0.3]],
];
var CLUSTER_SPACING = [700, 520, 480, 600, 900];
ITEMS.well = function(x, y, s) { return Arch.well(x, y, { sca: s }); };
var VIGNETTES = ["confession", "beggarPhilosopher", "pickpocket", "laddu", "dogVada", "monkeyBanana", "gossip", "sleeper", "chase", "kiteStuck", "cowGarlands", "bargain",
  "bullBlock", "lostChild", "blessing", "dancingChild", "ladderBunting", "astrologer", "marbles", "drunkard", "spilledPots", "elephantCoin", "argument", "waterSpill",
  "townCrier", "monkeyShow", "silambamRing", "oldFriends"];
for (var vi = 0; vi < VIGNETTES.length; vi++) (function(k) {
  ITEMS[k] = function(x, y, s, d) { return Vignettes[k](x, y, { sca: s, dir: d }); };
  FOOT[k] = [110, 70];
  SOLID[k] = 1;
})(VIGNETTES[vi]);
FOOT.bullBlock = [200, 70]; FOOT.elephantCoin = [190, 90]; FOOT.chase = [130, 70]; FOOT.sleeper = [110, 40]; FOOT.ladderBunting = [120, 80]; FOOT.silambamRing = [160, 80];
ITEMS.pigeons = function(x, y, s) { return Town.pigeons(x, y, { sca: s }); };
ITEMS.clutter = function(x, y, s) { return Town.clutter(x, y, { sca: s }); };
FOOT.pigeons = [60, 20]; FOOT.clutter = [60, 40];
// in the street, people move: strollers cross and fade, groups mill, carts roll
var MOVERS = { crowd: "mill", man: "stroll", woman: "stroll", womanpot: "stroll", women: "stroll", elder: "stroll", child: "stroll", children: "mill", polecarrier: "stroll",
  priest: "stroll", cart: "roll", templecow: "stroll", cow: "stroll", dog: "stroll", goat: "stroll", horseman: "roll", palanquin: "roll", temple_elephant: "roll", donkey: "stroll",
  umbrellawalker: "stroll", motherchild: "stroll", lampwoman: "stroll", sadhu: "stroll", streetvendor: "bob", nadaswaram: "bob", kolattam: "bob", dancer: "bob", barber: "bob",
  kolamdrawer: "bob", garlandseller: "bob", snakecharmer: "bob", fortuneteller: "bob", pallanguzhi: "bob", pigeons: "bob" };
ITEMS.crowd = function(x, y, s, d) { return Town.crowd(x, y, { sca: s, dir: d }); };
ITEMS.streetvendor = function(x, y, s, d) { return Town.streetVendor(x, y, { sca: s, dir: d }); };
ITEMS.lamppost = function(x, y, s) { return Town.lamppost(x, y, { sca: s }); };
ITEMS.choultry = function(x, y, s) { return Town.choultry(x, y, { sca: s }); };
ITEMS.templecow = function(x, y, s, d) { return Figures.cow(x, y, { sca: s, dir: d, col: Palette.white }) + line([[x + 20 * s * d, y - 52 * s], [x + 26 * s * d, y - 58 * s]], Palette.red, 1.4 * s); };
FOOT.crowd = [110, 70]; FOOT.streetvendor = [110, 60]; FOOT.lamppost = [16, 50]; FOOT.choultry = [110, 70]; FOOT.templecow = [60, 50];
SOLID.lamppost = 1; SOLID.choultry = 1; LIT.lamppost = [0, -42, 22]; LIT.shop = [0, -24, 40]; LIT.choultry = [0, -30, 30];
var TOWN_ITEMS = [["confession", 0.5], ["beggarPhilosopher", 0.5], ["pickpocket", 0.6], ["laddu", 0.6], ["dogVada", 0.5], ["monkeyBanana", 0.5], ["gossip", 0.6], ["sleeper", 0.4],
  ["chase", 0.5], ["kiteStuck", 0.4], ["cowGarlands", 0.5], ["bargain", 0.6], ["bullBlock", 0.4], ["lostChild", 0.4], ["blessing", 0.4], ["dancingChild", 0.5], ["ladderBunting", 0.3],
  ["astrologer", 0.4], ["marbles", 0.5], ["drunkard", 0.4], ["spilledPots", 0.4], ["elephantCoin", 0.4], ["argument", 0.5], ["waterSpill", 0.4], ["townCrier", 0.4], ["monkeyShow", 0.4],
  ["silambamRing", 0.3], ["oldFriends", 0.5],
  ["crowd", 5], ["streetvendor", 2.5], ["women", 1.5], ["man", 1], ["woman", 1], ["child", 1], ["children", 0.8], ["elder", 0.8], ["priest", 0.6], ["cart", 1.2],
  ["templecow", 1.5], ["cow", 0.6], ["dog", 1.2], ["hen", 0.6], ["goat", 0.5], ["horseman", 0.5], ["palanquin", 0.5], ["temple_elephant", 0.5], ["donkey", 0.6], ["polecarrier", 1],
  ["nadaswaram", 0.5], ["dancer", 0.3], ["kolattam", 0.3], ["pallanguzhi", 0.3], ["barber", 0.4], ["sadhu", 0.5], ["umbrellawalker", 0.6], ["lamppost", 0.8], ["choultry", 0.3],
  ["kolamdrawer", 0.5], ["motherchild", 0.6], ["garlandseller", 0.6], ["snakecharmer", 0.3], ["fortuneteller", 0.4], ["pillaiyar", 0.4], ["lingashrine", 0.3], ["lampwoman", 0.5]];
function pickTown() {
  var tot = 0;
  for (var i = 0; i < TOWN_ITEMS.length; i++) tot += TOWN_ITEMS[i][1];
  var r = Math.random() * tot;
  for (var i = 0; i < TOWN_ITEMS.length; i++) { r -= TOWN_ITEMS[i][1]; if (r <= 0) return TOWN_ITEMS[i][0]; }
  return "crowd";
}
ITEMS.gopuram = function(x, y, s) { return Arch.gopuram(x, y, { sca: s, tiers: 3 + Math.floor(Math.random() * 3) }); };
ITEMS.lingashrine = function(x, y, s) { return Temples.lingaShrine(x, y, { sca: s }); };
ITEMS.shivatemple = function(x, y, s) { return Temples.shivaTemple(x, y, { sca: s * 0.8 }); };
FOOT.lingashrine = [60, 50]; FOOT.shivatemple = [170, 110]; SOLID.lingashrine = 1; SOLID.shivatemple = 1;
LIT.lingashrine = [0, -15, 20]; LIT.shivatemple = [0, -30, 50]; LIT.meenakshi = [0, -60, 160];
ITEMS.pond = function(x, y, s) {
  var out = "";
  var pts = [];
  for (var i = 0; i <= 16; i++) { var t = (i / 16) * Math.PI * 2; pts.push([x + Math.cos(t) * 70 * s * (1 + 0.1 * Math.sin(t * 3)), y - 14 * s + Math.sin(t) * 18 * s]); }
  out += shape(pts, Palette.blue, INK(0.8), 1.2);
  out += line(pts.slice(0, 9), Palette.yellow, 2);
  for (var i = 0; i < 4; i++) out += line([[x - 40 * s + i * 22 * s, y - 14 * s + (i % 2) * 6 * s], [x - 28 * s + i * 22 * s, y - 14 * s + (i % 2) * 6 * s]], Palette.cream, 1);
  out += Flora.lotusClump(x + 20 * s, y - 10 * s, { sca: s * 0.8 });
  out += Flora.reeds(x - 60 * s, y - 4 * s, { sca: s });
  out += Fauna.ducks(x - 30 * s, y - 16 * s, { sca: s * 0.8, dir: 1 });
  return out;
};

// ---- collision boxes --------------------------------------------------------
function footOf(kind, s) {
  var f = FOOT[kind] || CLUSTER_FOOT[kind] || [36, 60];
  return [f[0] * s, f[1] * s];
}
function boxFor(kind, x, y, s) {
  var f = footOf(kind, s);
  return { x0: x - f[0] / 2, x1: x + f[0] / 2, y0: y - f[1], y1: y, y: y, solid: !!(SOLID[kind] || CLUSTER_FOOT[kind]) };
}
function collides(b, boxes, tol) {
  // two things clash when they share a ground line, or when a tall thing
  // in front would hide the one behind it
  tol = tol == undefined ? 24 : tol;
  var bh = b.y1 - b.y0;
  for (var i = 0; i < boxes.length; i++) {
    var p = boxes[i];
    if (!(b.x0 < p.x1 && b.x1 > p.x0)) continue;
    if (Math.abs(b.y - p.y) < tol) return true;
    var near = b.y > p.y ? b : p, far = b.y > p.y ? p : b;
    if ((near.y1 - near.y0) > 90 && near.y0 < far.y1 && near.y1 > far.y0) return true;
  }
  return false;
}
MEM.boxes = {};

function tinaiPlanner(x0, x1) {
  var plan = [];
  var L = Layers;
  var boxes = [];
  var bigBoxes = [];
  MEM.boxes[x0] = boxes;
  var nb = (MEM.boxes[x0 - 512] || []).concat(MEM.boxes[x0 + 512] || []);
  var allBoxes = function() { return boxes.concat(nb); };
  var wk = Tinai.weights(x0 + 256)[0];
  var glows = [];

  plan.push({ tag: "sky", x: x0, y: -100, draw: function() { return L.sky(x0, x1); } });
  plan.push({ tag: "ground", x: x0, y: -90, draw: function() { return L.ground(x0, x1); } });
  var hl = Hills.near(x0, x1);
  for (var i = 0; i < hl.length; i++) {
    if (hl[i].cx < x0 || hl[i].cx >= x1) continue;
    plan.push({ tag: "hill", x: hl[i].cx, y: -88 + hl[i].layer, draw: (function(h) { return function() { return Hills.drawOne(h); }; })(hl[i]) });
  }
  plan.push({ tag: "haze", x: x0, y: -88 + 1.5, draw: function() { return Hills.haze(x0, x1); } });
  plan.push({ tag: "far", x: x0, y: -80, draw: function() { return L.far(x0, x1); } });
  plan.push({ tag: "road", x: x0, y: -78, draw: function() { return Road.draw(x0, x1); } });
  // aerial perspective over the far band: distant ground pales toward the sky
  plan.push({ tag: "aerial", x: x0, y: L.SHORE - 1, draw: function() {
    var c = "#f0dcb8";
    return "<defs><linearGradient id='ae" + Math.abs(Math.round(x0)) + "' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='" + c + "' stop-opacity='0.34'/><stop offset='1' stop-color='" + c + "' stop-opacity='0'/></linearGradient></defs>" +
      "<rect x='" + x0 + "' y='" + L.HORIZON + "' width='512' height='" + (L.SHORE - L.HORIZON) + "' fill='url(#ae" + Math.abs(Math.round(x0)) + ")'/>";
  } });
  plan.push({ tag: "river", x: x0, y: -75, draw: function() { return River.draw(x0, x1); } });
  plan.push({ tag: "top", x: x0, y: 10000, draw: function() { return L.topBorder(x0, x1); } });
  plan.push({ tag: "bottom", x: x0, y: 10001, draw: function() { return L.bottomBorder(x0, x1); } });
  // night: a blue tint that follows the kurinji weight, lamps glowing through it
  var stops = [], anyNight = false;
  for (var x = x0; x <= x1; x += 64) { var op = Math.max(0, Math.min(0.42, (Tinai.weights(x)[0] - 0.12) * 0.6)); if (op > 0.002) anyNight = true; stops.push([x, op]); }
  if (anyNight) {
    plan.push({ tag: "night", x: x0, y: 9000, draw: function() { return opacityRect(x0, x1, L.TOP, L.BOTTOM, "#1a2448", stops); } });
    plan.push({ tag: "glows", x: x0, y: 9500, draw: function() {
      var out = "";
      for (var i = 0; i < glows.length; i++) out += glow(glows[i][0], glows[i][1], glows[i][2] * 0.75, "#ffb84a", Math.min(0.6, wk * 0.9));
      return out;
    } });
  }
  function lit(kind, x, y, s) {
    if (LIT[kind] && wk > 0.15) glows.push([x + LIT[kind][0] * s, y + LIT[kind][1] * s, LIT[kind][2] * s]);
  }
  function addItem(kind, x, y, s, w, dir, moving) {
    var fn = makeItem(kind, x, y, s, w);
    if (!fn) return false;
    if (moving && MOVERS[kind]) {
      var cls = MOVERS[kind];
      if (cls == "stroll" || cls == "roll") cls += Math.random() < 0.5 ? "" : "back";
      var inner = fn, delay = -Math.random() * 40;
      fn = function() { var out = inner(); return cls.indexOf("bob") == 0 ? anim("bob", out, delay) : anim(cls, anim("bob", out, delay * 0.1), delay); };
    }
    plan.push({ tag: kind, x: x, y: y, draw: fn });
    lit(kind, x, y, s);
    return true;
  }
  // keep things off the road
  function offRoad(x, y) {
    var ry = Road.y(x);
    if (Math.abs(y - ry) < 14) return y < ry ? ry - 16 : ry + 16;
    return y;
  }

  // landmarks, one kind per chunk in rotation, when the landscape suits
  var wc = Tinai.weights(x0 + 256);
  var slot = ((Math.round(x0 / 512) % 8) + 8) % 8;
  var lx = x0 + 120 + Math.random() * 270;
  var kdom = Tinai.dominant(x0 + 256);
  var tw = Tinai.town(x0 + 256);
  var inTown = tw > 0.35;
  if (inTown) {
    // in the town the great temple stands at the heart, the chariot in the street
    if (slot % 4 == 2 && tw > 0.5) slot = 2;
    else slot = -1;
  }
  function landmark(tag, y, margin, fn, fw, fh) {
    if (River.inside(lx, y, margin)) return;
    var b = { x0: lx - fw / 2, x1: lx + fw / 2, y0: y - fh, y1: y, y: y, solid: true };
    if (collides(b, allBoxes())) return;
    boxes.push(b);
    bigBoxes.push(b);
    plan.push({ tag: tag, x: lx, y: y, draw: fn });
    lit(tag, lx, y, 1);
  }
  if (slot == 0 && wc[2] > 0.45) {
    var gy = L.HORIZON + 24 + Math.random() * 20, gs = 0.9 + Math.random() * 0.4, gt = 3 + Math.floor(Math.random() * 4);
    landmark("gopuram", gy, 60, function() { return Arch.gopuram(lx, gy, { sca: gs, tiers: gt }); }, 100 * gs, 200 * gs);
  } else if (slot == 1 && wc[1] + wc[2] + wc[3] > 0.5 && Math.random() < 0.6) {
    var ty = L.HORIZON + 30 + Math.random() * 30, ts = 0.75 + Math.random() * 0.3;
    landmark("cholatemple", ty, 90, function() { return Arch.cholaTemple(lx, ty, { sca: ts }); }, 400 * ts, 230 * ts);
  } else if (slot == 2 && wc[2] > 0.45 && Math.random() < 0.5) {
    var cy = offRoad(lx, L.SHORE + 60 + Math.random() * 60), cd = Math.random() < 0.5 ? -1 : 1;
    if (Math.random() < 0.5) landmark("festival", cy, 260, function() { return Built.festival(lx, cy, { sca: 1, dir: cd }); }, 480, 230);
    else landmark("ther", cy, 90, function() { return Arch.ther(lx, cy, { sca: 1.1, dir: cd }); }, 120, 240);
  } else if (slot == 3 && wc[4] < 0.5 && Math.random() < 0.5) {
    var py = offRoad(lx, L.SHORE + 50 + Math.random() * 70), pd = Math.random() < 0.5 ? -1 : 1;
    if (Math.random() < 0.6) landmark("procession", py, 220, function() { return Figures.procession(lx, py, { sca: 1.25, dir: pd }); }, 380, 180);
    else landmark("jallikattu", py, 120, function() { return People.jallikattu(lx, py, { sca: 1.1, dir: pd }); }, 220, 90);
  } else if (slot == 4 && Math.random() < 0.5) {
    var fy = L.HORIZON + 30 + Math.random() * 40;
    if (kdom == 0) landmark("cavetemple", fy, 90, function() { return Built.caveTemple(lx, fy, { sca: 0.9 }); }, 140, 90);
    else if (kdom == 3) landmark("ratha", fy, 60, function() { return Built.ratha(lx, fy, { sca: 1.1 }) + Built.ratha(lx + 70, fy + 6, { sca: 0.8 }); }, 140, 80);
    else if (kdom == 2) landmark("mansion", fy, 110, function() { return Built.mansion(lx, fy, { sca: 0.9 }); }, 160, 110);
    else if (kdom == 1) landmark("agraharam", fy, 110, function() { return Built.agraharam(lx, fy, { sca: 0.9 }); }, 170, 70);
  } else if (slot == 6 && (inTown || wc[2] + wc[1] > 0.5)) {
    // the great temple of Madurai, wide on the plain just below the horizon.
    // It is wider than a chunk, so it only checks the rivers and then claims
    // its ground; later items keep clear of it.
    lx = x0 + 256;
    var my = L.HORIZON + 40 + Math.random() * 30, ms = 0.9 + Math.random() * 0.2;
    var clear = true;
    for (var qx = lx - 400 * ms; qx <= lx + 400 * ms; qx += 80) if (River.inside(qx, my - 40, 30) || River.inside(qx, my - 160, 30)) clear = false;
    if (clear) {
      var mb = { x0: lx - 400 * ms, x1: lx + 400 * ms, y0: my - 330 * ms, y1: my + 10, y: my, solid: true };
      boxes.push(mb);
      bigBoxes.push(mb);
      plan.push({ tag: "meenakshi", x: lx, y: my, draw: function() { return Temples.meenakshi(lx, my, { sca: ms }); } });
      lit("meenakshi", lx, my, ms);
    }
  } else if (slot == 7 && wc[4] < 0.6 && Math.random() < 0.6) {
    var sy = L.HORIZON + 30 + Math.random() * 40, ss = 0.9 + Math.random() * 0.3;
    landmark("shivatemple", sy, 100, function() { return Temples.shivaTemple(lx, sy, { sca: ss }); }, 220 * ss, 150 * ss);
  } else if (slot == 5 && Math.random() < 0.5) {
    var ny = offRoad(lx, L.SHORE + 40 + Math.random() * 60);
    if (kdom == 2) landmark("transplanting", ny, 110, function() { return Built.transplanting(lx, ny, { sca: 1 }); }, 190, 60);
    else if (kdom == 1 || kdom == 3) landmark("natarajashrine", ny, 90, function() { return Built.natarajaShrine(lx, ny, { sca: 0.9 }); }, 170, 100);
    else if (kdom == 0) landmark("muruganhill", ny, 60, function() { return People.murugan(lx, ny, { sca: 1.2, dir: 1 }) + Built.lampTower(lx + 40, ny + 2, { sca: 0.7 }); }, 90, 90);
  }

  // the town: one street seen down its length toward the temple. The scene
  // is wider than a chunk; the chunk holding its centre draws it, and every
  // chunk it covers keeps its own people off the road.
  var seg = Town.segment(x0 + 256) || Town.segment(x0) || Town.segment(x1);
  var sceneCx = seg ? seg.center : null;
  var inScene = function(x) { return sceneCx != null && Math.abs(x - sceneCx) < Street.WIDTH / 2; };
  if (seg) {
    var sb = { x0: sceneCx - Street.WIDTH / 2, x1: sceneCx + Street.WIDTH / 2, y0: L.HORIZON - 300, y1: L.BOTTOM + 10, y: L.BOTTOM, solid: true };
    if (sb.x1 > x0 && sb.x0 < x1) { boxes.push(sb); bigBoxes.push(sb); }
    if (sceneCx >= x0 && sceneCx < x1) {
      var sc = Street.scene(sceneCx, {});
      plan.push({ tag: "street", x: sceneCx, y: L.SHORE + 1, w: Street.WIDTH / 2, draw: function() { return sc.svg; } });
      for (var i = 0; i < sc.lamps.length; i++) if (wk > 0.15) glows.push(sc.lamps[i]);
    }
  }

  // the street's stories: a vignette every so often, placed before the crowd
  if (false) {
    for (var vx = x0 + Math.random() * 60; vx < x1; vx += 110 + Math.random() * 90) {
      if (Tinai.town(vx) < 0.35) continue;
      var vk = VIGNETTES[Math.floor(Math.random() * VIGNETTES.length)];
      for (var vt = 0; vt < 8; vt++) {
        var vtt = 0.3 + Math.random() * 0.7;
        var vy = L.SHORE + 12 + vtt * (L.BOTTOM - L.SHORE - 24);
        var vs = 0.8 + vtt * 0.4;
        if (River.inside(vx, vy, 40)) continue;
        var vb = boxFor(vk, vx, vy, vs);
        if (collides(vb, allBoxes())) continue;
        if (addItem(vk, vx, vy, vs, wc)) { boxes.push(vb); break; }
      }
    }
  }

  // scene clusters in the near band, with open ground between them
  var x = x0 + Math.random() * 200;
  while (x < x1) {
    if (inScene(x)) { x += 150; continue; }
    var w = Tinai.weights(x);
    var d = 0;
    for (var k = 0; k < 5; k++) d += w[k] / CLUSTER_SPACING[k];
    x += (0.6 + 0.8 * Math.random()) / d;
    if (x >= x1) break;
    var ck = pickItem(w, CLUSTER_W);
    var cs = 0.85 + Math.random() * 0.25;
    var cyy = offRoad(x, L.SHORE + 40 + Math.random() * (L.BOTTOM - L.SHORE - 90));
    var cf = CLUSTER_FOOT[ck];
    var cb = { x0: x - cf[0] * cs / 2, x1: x + cf[0] * cs / 2, y0: cyy - cf[1] * cs, y1: cyy + 30, y: cyy, solid: true };
    if (River.inside(x, cyy, cf[0] * cs / 2) || collides(cb, allBoxes())) continue;
    boxes.push(cb);
    var sub = CLUSTERS[ck](cs);
    var flip = Math.random() < 0.5 ? -1 : 1;
    for (var i = 0; i < sub.length; i++) {
      var sx = x + sub[i][1] * cs * flip + (Math.random() - 0.5) * 8, sy = cyy + sub[i][2] * cs + (Math.random() - 0.5) * 4;
      if (River.inside(sx, sy, 12)) continue;
      addItem(sub[i][0], sx, sy, sub[i][3] * cs, w);
    }
  }

  // far band
  x = x0 + Math.random() * 40;
  while (x < x1) {
    var w = Tinai.weights(x);
    var d = 0;
    for (var k = 0; k < 5; k++) d += w[k] / FAR_SPACING[k];
    x += (0.5 + Math.random()) / d;
    if (x >= x1) break;
    if (inScene(x)) continue;
    var t = Math.random();
    var y = L.HORIZON + 12 + t * (L.SHORE - L.HORIZON - 24);
    var s = 0.36 + t * 0.34;
    if (River.inside(x, y, 14 * s)) continue;
    var kind = pickItem(w, FAR_ITEMS);
    var b = boxFor(kind, x, y, s);
    if (collides(b, allBoxes())) continue;
    if (addItem(kind, x, y, s, w)) boxes.push(b);
  }

  // near band
  x = x0 + Math.random() * 40;
  while (x < x1) {
    var w = Tinai.weights(x);
    var d = 0;
    for (var k = 0; k < 5; k++) d += w[k] / NEAR_SPACING[k];
    x += (0.5 + Math.random()) / d;
    if (Math.random() < 0.06) x += 90; // a stretch of open ground
    if (x >= x1) break;
    if (inScene(x)) continue;
    var twx = 0;
    var kind = pickItem(w, NEAR_ITEMS);
    // big beasts keep to the deep hills
    if ((kind == "tiger" || kind == "bear") && w[0] < 0.55) continue;
    var placed = false;
    for (var tries = 0; tries < (twx > 0.3 ? 8 : 5) && !placed; tries++) {
      var t = Math.random();
      var y = offRoad(x, L.SHORE + 12 + t * (L.BOTTOM - L.SHORE - 24));
      if (twx > 0.3) { t = 0.25 + Math.random() * 0.75; y = L.SHORE + 12 + t * (L.BOTTOM - L.SHORE - 24); }
      var s = 0.8 + t * 0.4;
      if (River.inside(x, y, 16 * s)) continue;
      var b = boxFor(kind, x, y, s);
      if (collides(b, allBoxes(), twx > 0.3 ? 9 : 24)) continue;
      if (addItem(kind, x, y, s, w, 1, twx > 0.4)) { boxes.push(b); placed = true; }
    }
  }

  // travellers on the road
  var nt = 1 + Math.floor(Math.random() * 3);
  for (var i = 0; i < nt; i++) {
    var tx = x0 + Math.random() * 512;
    var tvy = Road.y(tx) + 5;
    if (River.inside(tx, tvy, 20) || inScene(tx)) continue;
    var w = Tinai.weights(tx);
    var kinds = ["wayfarer", "womanpot", "women", "elder", "cart", "donkey", "polecarrier", "horseman", "palanquin", "umbrellawalker", "haycarrier", "herd", "leafcarrier"];
    var kind = kinds[Math.floor(Math.random() * kinds.length)];
    if (w[1] < 0.3 && kind == "umbrellawalker") kind = "wayfarer";
    var s = 0.9 + Math.random() * 0.2;
    var b = boxFor(kind, tx, tvy, s);
    if (collides(b, allBoxes())) continue;
    if (addItem(kind, tx, tvy, s, w)) boxes.push(b);
  }

  // ponds now and then in the wetter country
  if (wc[1] + wc[2] > 0.6 && Math.random() < 0.3) {
    var pdx = x0 + 60 + Math.random() * 390, pdy = offRoad(pdx, L.SHORE + 40 + Math.random() * 120);
    var b = boxFor("pond", pdx, pdy, 1);
    if (!River.inside(pdx, pdy, 90) && !collides(b, allBoxes())) { boxes.push(b); addItem("pond", pdx, pdy, 1, wc); }
  }
  // life along the rivers: bridges, boats, birds, washerwomen, beasts
  var rs = River.samples(x0, x1);
  for (var i = 0; i < rs.length; i++) {
    var sp = rs[i];
    var s = 0.45 + sp.t * 0.7;
    var r = Math.random();
    var dir = Math.random() < 0.5 ? -1 : 1;
    var w3 = Tinai.weights(sp.x)[3];
    var mk = function(tag, x, y, fn) { plan.push({ tag: tag, x: x, y: y, draw: fn }); boxes.push({ x0: x - 40, x1: x + 40, y0: y - 50, y1: y, y: y, solid: false }); };
    if (sp.river.dry) {
      if (r < 0.15) mk("goat", sp.x, sp.y + 2, (function(x, y, s, d) { return function() { return Figures.goat(x, y, { sca: s, dir: d }); }; })(sp.x, sp.y + 2, s, dir));
      continue;
    }
    var bankE = Math.random() < 0.5 ? sp.left : sp.right;
    var side = bankE == sp.left ? -1 : 1;
    if (sp.t > 0.25 && sp.t < 0.85 && r < 0.07) {
      // a bridge across, with someone crossing
      var bw = sp.w + 24 * s;
      mk("bridge", sp.x, sp.y + 2, (function(x, y, s, bw) { return function() { return Built.bridge(x, y, { sca: s, width: bw }) + Figures.woman(x - bw * 0.2, y - 14 * s, { sca: s * 0.8, dir: 1, prop: "pot" }); }; })(sp.x, sp.y + 2, s, bw));
    } else if (sp.river.stream && r < 0.2) {
      mk("stones", sp.x, sp.y + 1, (function(x, y, s, bw) { return function() { return Built.steppingStones(x, y, { sca: s, width: bw }); }; })(sp.x, sp.y + 1, s, sp.w + 10 * s));
    } else if (!sp.river.stream && sp.w > 44 && (w3 > 0.3 || Tinai.weights(sp.x)[2] > 0.4) && r < 0.14) {
      mk("sailboat", sp.x, sp.y + 4, (function(x, y, s, d) { return function() { return Built.sailboat(x, y, { sca: s * 0.7, dir: d }); }; })(sp.x, sp.y, s, dir));
    } else if (!sp.river.stream && sp.w > 36 && w3 > 0.35 && r < 0.22) {
      mk("boat", sp.x, sp.y + 4, (function(x, y, s, d) { return function() { return Arch.kattumaram(x, y, { sca: s * 0.8, dir: d }); }; })(sp.x, sp.y, s, dir));
    } else if (!sp.river.stream && sp.w > 30 && r < 0.3) {
      mk("parisal", sp.x, sp.y + 4, (function(x, y, s, d) { return function() { return Arch.parisal(x, y, { sca: s, dir: d }); }; })(sp.x, sp.y, s, dir));
    } else if (r < 0.34) {
      var ex = bankE[0] + side * 10 * s, ey = bankE[1] + 3;
      var pick = Math.random();
      if (pick < 0.3) mk("fisherman", ex, ey, (function(x, y, s, d) { return function() { return People.fisherman(x, y, { sca: s, dir: d }); }; })(ex, ey, s, -side));
      else if (pick < 0.55) mk("dhobi", ex, ey, (function(x, y, s, d) { return function() { return People.dhobi(x, y, { sca: s, dir: d }); }; })(ex, ey, s, -side));
      else if (pick < 0.75 && !sp.river.stream && sp.w > 34) mk("swimmers", sp.x, sp.y + 3, (function(x, y, s) { return function() { return People.swimmers(x, y, { sca: s }); }; })(sp.x, sp.y + 3, s));
      else if (pick < 0.88 && !sp.river.stream && sp.w > 40) mk("punter", sp.x, sp.y + 4, (function(x, y, s, d) { return function() { return People.punter(x, y, { sca: s, dir: d }); }; })(sp.x, sp.y, s, dir));
      else if (!sp.river.stream && sp.w > 48) mk("elephantbath", sp.x, sp.y + 4, (function(x, y, s, d) { return function() { return People.mahoutBath(x, y, { sca: s * 0.8, dir: d }); }; })(sp.x, sp.y + 4, s, dir));
      else mk("heron", bankE[0], bankE[1] + 2, (function(x, y, s, d) { return function() { return Figures.heron(x, y, { sca: s, dir: d }); }; })(bankE[0], bankE[1] + 2, s, dir));
    } else if (r < 0.42) {
      mk("heron", bankE[0], bankE[1] + 2, (function(x, y, s, d) { return function() { return Figures.heron(x, y, { sca: s, dir: d }); }; })(bankE[0], bankE[1] + 2, s, dir));
    } else if (r < 0.56) {
      var ex = bankE[0] + side * 8 * s, ey = bankE[1] + 3;
      mk("washer", ex, ey, (function(x, y, s, d) { return function() { return Figures.woman(x, y, { sca: s, dir: d, prop: "hippot" }); }; })(ex, ey, s, -side));
    } else if (r < 0.64 && !sp.river.stream) {
      mk("buffalo", sp.x, sp.y + 6, (function(x, y, s, d) { return function() { return Figures.cow(x, y - 8 * s, { sca: s, dir: d, buffalo: true }); }; })(sp.x, sp.y + 6, s, dir));
    } else if (r < 0.72) {
      mk("kingfisher", bankE[0], bankE[1] + 1, (function(x, y, s, d) { return function() { return Fauna.kingfisher(x, y, { sca: s, dir: d }); }; })(bankE[0], bankE[1] + 1, s, dir));
    } else if (r < 0.8 && !sp.river.stream) {
      mk("ducks", sp.x, sp.y + 3, (function(x, y, s, d) { return function() { return Fauna.ducks(x, y, { sca: s, dir: d }); }; })(sp.x, sp.y + 3, s, dir));
    } else if (r < 0.88) {
      mk("reeds", bankE[0], bankE[1] + 2, (function(x, y, s) { return function() { return Flora.reeds(x, y, { sca: s }); }; })(bankE[0], bankE[1] + 2, s));
    } else if (r < 0.92 && !sp.river.stream && sp.w > 40) {
      mk("lotus", sp.x, sp.y + 3, (function(x, y, s) { return function() { return Flora.lotusClump(x, y, { sca: s }); }; })(sp.x, sp.y + 3, s));
    } else if (r < 0.95 && !sp.river.stream && sp.w > 40) {
      mk("crocodile", sp.x, sp.y + 3, (function(x, y, s, d) { return function() { return Fauna.crocodile(x, y, { sca: s, dir: d }); }; })(sp.x, sp.y + 3, s, dir));
    } else if (r < 1) {
      var ex = bankE[0] + side * 6 * s;
      mk("frog", ex, bankE[1] + 2, (function(x, y, s, d) { return function() { return Math.random() < 0.5 ? Fauna.frog(x, y, { sca: s, dir: d }) : Fauna.tortoise(x, y, { sca: s, dir: d }); }; })(ex, bankE[1] + 2, s, dir));
    }
  }
  return plan;
}
