import { ModelBuilder, MAT, TAU, rng } from './geometry.mjs';

// Original anatomical studies. The near flank faces +z; heads usually face -x.
// Tapered limbs, layered surfaces, and species-specific profiles carry the form.
const E=(b,c,r,o={})=>b.ellipsoid(c,r,{u:18,v:28,...o});
const T=(b,path,r,o={})=>b.tube(path,r,{u:24,v:10,...o});
const L=(b,a,c,r,o={})=>b.line(a,c,r,{u:14,v:8,...o});
const blend=(a,c,t)=>a.map((n,i)=>n+(c[i]-n)*t);
const curve=(a,c,d,e)=>t=>a.map((n,i)=>(1-t)**3*n+3*(1-t)**2*t*c[i]+3*(1-t)*t*t*d[i]+t**3*e[i]);
const leg=(b,hip,knee,ankle,toe,{material=MAT.BROWN,r=.065,joint=0,foot=material}={})=>{
  T(b,curve(hip,blend(hip,knee,.6),knee,ankle),t=>r*(1-.55*t),{material,joint,u:24,v:10});
  E(b,toe,[r*1.6,r*.55,r*.85],{material:foot,joint,u:10,v:16});
};
function pointedEar(b,base,tip,width,depth,material,inside,joint=0){
  b.fin([base[0]-width,base[1],base[2]],[base[0]+width,base[1],base[2]],tip,{material,joint,curve:depth,u:14,v:12});
  b.fin([base[0]-width*.64,base[1]-.018,base[2]+.012],[base[0]+width*.64,base[1]-.018,base[2]+.012],blend(base,tip,.84).map((n,i)=>n+(i===2?.026:0)),{material:inside,joint,curve:depth*.7,u:10,v:8});
}
function hoof(b,p,r=.045){E(b,p,[r*1.6,r*.85,r],{material:MAT.INK,u:10,v:14});}
function motion(b,seed,pivot,axis=[0,1,0],amplitude=.025){
  const random=rng(seed);
  return b.joint({pivot,axis,amplitude,speed:.45+random()*.2,phase:random()*TAU});
}

function redFox(seed,quality=1){
  const b=new ModelBuilder(quality),head=motion(b,seed,[-.52,-.13,0],[0,1,0],.035);
  E(b,[.08,.02,0],[.57,.23,.22],{material:MAT.RUST,pattern:(u,v,p)=>p[1]>.09?MAT.IVORY:MAT.RUST,u:24,v:36});
  E(b,[-.34,-.02,0],[.25,.29,.24],{material:MAT.RUST,rotation:-.32});
  E(b,[-.48,.04,.055],[.18,.23,.19],{material:MAT.IVORY,rotation:-.35,u:16,v:24});
  for(const z of [-.14,.14]){
    leg(b,[-.32,.15,z],[-.35,.36,z],[-.38,.59,z],[-.43,.61,z],{r:.052,material:MAT.RUST,foot:MAT.INK});
    L(b,[-.38,.37,z],[-.38,.59,z],.032,{material:MAT.INK});
    leg(b,[.43,.14,z],[.53,.33,z],[.40,.59,z],[.34,.61,z],{r:.076,material:MAT.RUST,foot:MAT.INK});
    L(b,[.43,.43,z],[.40,.58,z],.036,{material:MAT.INK});
  }
  E(b,[-.56,-.22,0],[.22,.18,.16],{material:MAT.RUST,joint:head});
  T(b,curve([-.62,-.19,0],[-.77,-.16,0],[-.87,-.12,0],[-.92,-.15,0]),t=>.115*(1-t)+.025,{material:MAT.RUST,joint:head,u:22,v:16});
  E(b,[-.76,-.12,.055],[.18,.047,.09],{material:MAT.IVORY,joint:head,u:12,v:20});
  E(b,[-.92,-.15,0],[.045,.032,.037],{material:MAT.INK,joint:head,u:10,v:14});
  pointedEar(b,[-.53,-.35,-.09],[-.58,-.64,-.09],.09,.018,MAT.RUST,MAT.INK,head);
  pointedEar(b,[-.43,-.35,.10],[-.40,-.63,.13],.09,.024,MAT.RUST,MAT.IVORY,head);
  b.eye([-.65,-.25,.145],.028,{joint:head,iris:MAT.GOLD});
  L(b,[-.68,-.285,.135],[-.59,-.28,.15],.009,{joint:head,material:MAT.INK,u:8,v:6});
  const tail=motion(b,seed+1,[.54,.03,0],[0,1,0],.07);
  T(b,curve([.52,.04,0],[.95,.06,-.05],[1.02,.41,.08],[.82,.51,.17]),t=>.045+.15*Math.sin(Math.PI*t)**.8,{material:t=>t>.72?MAT.IVORY:MAT.RUST,joint:tail,u:44,v:22});
  return b.finish();
}

function rabbit(seed,quality=1){
  const b=new ModelBuilder(quality),head=motion(b,seed,[-.3,-.21,0],[0,0,1],.025);
  E(b,[.15,.09,0],[.43,.36,.28],{material:MAT.SAND,u:26,v:36});
  E(b,[.29,.23,.15],[.29,.27,.20],{material:MAT.SAND,rotation:.12});
  E(b,[-.16,.07,0],[.23,.28,.23],{material:MAT.SAND});
  for(const z of [-.17,.17]){
    leg(b,[-.18,.17,z],[-.26,.34,z],[-.31,.48,z],[-.39,.49,z],{r:.055,material:MAT.SAND});
    E(b,[.28,.30,z],[.23,.21,.15],{material:MAT.SAND});
    E(b,[.08,.49,z+.015],[.25,.06,.095],{material:MAT.IVORY,u:14,v:22});
    for(let i=0;i<3;i++) L(b,[-.12,.49,z-.045+i*.035],[-.06,.49,z-.045+i*.035],.006,{material:MAT.BROWN,u:6,v:5});
  }
  E(b,[-.35,-.25,0],[.235,.22,.19],{material:MAT.SAND,joint:head});
  E(b,[-.50,-.17,.03],[.13,.085,.13],{material:MAT.IVORY,joint:head,u:15,v:22});
  E(b,[-.62,-.18,.025],[.026,.024,.035],{material:MAT.CORAL,joint:head,u:9,v:12});
  for(const [x,z,angle] of [[-.39,-.10,-.14],[-.27,.08,.2]]){
    E(b,[x,-.65,z],[.075,.35,.05],{material:MAT.SAND,rotation:angle,joint:head,u:24,v:18});
    E(b,[x,-.67,z+.045],[.037,.26,.012],{material:MAT.CORAL,rotation:angle,joint:head,u:20,v:12});
  }
  b.eye([-.43,-.29,.173],.038,{joint:head,iris:MAT.BROWN});
  for(const side of [-1,1])for(let i=0;i<3;i++)L(b,[-.54,-.17,.09],[-.70,-.21+i*.04,side*.22],.0035,{material:MAT.IVORY,joint:head,u:7,v:4});
  E(b,[.57,.12,.015],[.11,.13,.12],{material:MAT.IVORY,u:18,v:24});
  return b.finish();
}

function deer(seed,quality=1){
  const b=new ModelBuilder(quality),head=motion(b,seed,[-.53,-.43,0],[0,1,0],.025);
  E(b,[.10,-.04,0],[.57,.26,.20],{material:MAT.BROWN,pattern:(u,v,p)=>p[1]>.11?MAT.SAND:MAT.BROWN,u:24,v:34});
  T(b,curve([-.37,.02,0],[-.52,-.1,0],[-.50,-.40,0],[-.60,-.55,0]),t=>.17-.075*t,{material:MAT.BROWN,u:28,v:20});
  E(b,[-.66,-.56,0],[.21,.12,.115],{material:MAT.BROWN,joint:head,rotation:.12});
  E(b,[-.81,-.53,0],[.125,.073,.08],{material:MAT.SAND,joint:head});
  E(b,[-.91,-.53,0],[.04,.045,.065],{material:MAT.INK,joint:head,u:10,v:14});
  for(const z of [-.14,.14]){
    leg(b,[-.31,.12,z],[-.32,.43,z],[-.35,.81,z],[-.38,.83,z],{r:.046,material:MAT.BROWN,foot:MAT.INK});
    leg(b,[.48,.1,z],[.56,.37,z],[.42,.81,z],[.39,.83,z],{r:.062,material:MAT.BROWN,foot:MAT.INK});
    hoof(b,[-.38,.83,z],.034);hoof(b,[.39,.83,z],.034);
  }
  pointedEar(b,[-.53,-.61,-.075],[-.43,-.83,-.26],.075,.03,MAT.BROWN,MAT.SAND,head);
  pointedEar(b,[-.52,-.60,.085],[-.32,-.72,.28],.07,.03,MAT.BROWN,MAT.SAND,head);
  b.eye([-.69,-.59,.111],.025,{joint:head,iris:MAT.INK});
  for(const z of [-.08,.08]){
    T(b,curve([-.62,-.65,z],[-.62,-.83,z*1.9],[-.48,-1.03,z*2.2],[-.34,-1.13,z*2.1]),t=>.024*(1-.7*t),{material:MAT.SAND,joint:head,u:24,v:8});
    for(let i=0;i<3;i++){
      const x=-.59+i*.075,y=-.80-i*.10;
      T(b,curve([x,y,z*2],[x-.07,y-.02,z*2.2],[x-.09,y-.12,z*2.3],[x-.08,y-.19,z*2.5]),t=>.016*(1-.82*t),{material:MAT.SAND,joint:head,u:13,v:6});
    }
  }
  T(b,curve([.59,-.11,0],[.72,-.17,0],[.72,-.02,0],[.64,.05,0]),t=>.055*(1-.7*t),{material:MAT.IVORY,u:16,v:10});
  return b.finish();
}

function elephant(seed,quality=1){
  const b=new ModelBuilder(quality),head=motion(b,seed,[-.45,-.08,0],[0,1,0],.018);
  E(b,[.15,-.04,0],[.64,.39,.33],{material:MAT.SLATE,u:27,v:38});
  E(b,[-.51,-.10,0],[.29,.34,.27],{material:MAT.SLATE,joint:head,u:22,v:30});
  for(const z of [-.23,.23])for(const x of [-.29,.53]){
    T(b,t=>[x+(x>0?.03:-.025)*t,.16+t*.51,z],t=>.13-.035*t,{material:MAT.SLATE,u:22,v:16});
    E(b,[x,.67,z],[.118,.07,.13],{material:MAT.SLATE,u:12,v:20});
    for(let i=0;i<3;i++)E(b,[x-.07+i*.065,.69,z+.11],[.026,.026,.012],{material:MAT.IVORY,u:7,v:8});
  }
  for(const z of [-.21,.21]){
    const ear=b.joint({pivot:[-.38,-.12,z],axis:[0,1,0],amplitude:.055,speed:.65,phase:z>0?0:1,parent:head});
    E(b,[-.40,-.04,z*1.65],[.235,.32,.055],{material:MAT.SLATE,joint:ear,rotation:-.12,u:22,v:28});
    for(let i=0;i<4;i++)T(b,curve([-.53,-.25,z*1.65+.05],[-.38,-.13,z*1.65+.055],[-.25,.07+i*.025,z*1.65+.055],[-.33,.20+i*.025,z*1.65+.05]),.005,{material:MAT.NAVY,joint:ear,u:12,v:4});
  }
  const trunk=b.joint({pivot:[-.74,-.09,0],axis:[0,0,1],amplitude:.045,speed:.55,phase:.5,parent:head});
  T(b,curve([-.71,-.1,0],[-.98,.14,.02],[-1.00,.74,.05],[-.75,.61,.10]),t=>.105*(1-.74*t),{material:MAT.SLATE,joint:trunk,u:52,v:22});
  for(const z of [-.13,.13])T(b,curve([-.69,.05,z],[-.9,.25,z],[-1.03,.25,z+.02],[-1.03,.12,z+.03]),t=>.038*(1-.93*t),{material:MAT.IVORY,joint:head,u:26,v:10});
  b.eye([-.67,-.16,.239],.026,{joint:head,iris:MAT.BROWN});
  T(b,curve([.75,-.07,0],[.93,.1,0],[.86,.44,0],[.95,.51,.03]),t=>.024*(1-.45*t),{material:MAT.SLATE,u:26,v:8});
  E(b,[.95,.52,.03],[.045,.08,.04],{material:MAT.INK,u:12,v:16});
  return b.finish();
}

const giraffePattern=(u,v,p)=>{
  const a=Math.sin(p[0]*31+p[1]*17),c=Math.sin(p[1]*29-p[2]*23),d=Math.sin(p[2]*37+p[0]*11);
  return Math.abs(a*c+d*.35)>.28?MAT.BROWN:MAT.SAND;
};
function giraffe(seed,quality=1){
  const b=new ModelBuilder(quality),head=motion(b,seed,[-.44,-.86,0],[0,1,0],.022);
  E(b,[.13,.04,0],[.45,.23,.18],{pattern:giraffePattern,u:23,v:34});
  T(b,t=>[-.22-.23*t,.03-.94*t,0],t=>.13-.055*t,{material:(u,v,p)=>giraffePattern(u,v,p),u:42,v:20});
  T(b,t=>[-.10-.26*t,-.05-.87*t,-.015],.020,{material:MAT.BROWN,u:30,v:7});
  for(const z of [-.12,.12]){
    leg(b,[-.20,.18,z],[-.21,.48,z],[-.25,.93,z],[-.30,.96,z],{r:.043,material:MAT.SAND,foot:MAT.INK});
    leg(b,[.43,.15,z],[.49,.47,z],[.36,.93,z],[.32,.96,z],{r:.05,material:MAT.SAND,foot:MAT.INK});
    for(const x of [-.22,.43])for(let i=0;i<4;i++)E(b,[x,.27+i*.12,z+.029],[.03,.032,.018],{material:MAT.BROWN,u:6,v:8});
  }
  E(b,[-.52,-.93,0],[.205,.105,.10],{pattern:giraffePattern,joint:head,rotation:-.06});
  E(b,[-.68,-.88,.005],[.12,.055,.077],{material:MAT.SAND,joint:head,u:14,v:20});
  E(b,[-.77,-.88,.025],[.023,.019,.025],{material:MAT.INK,joint:head,u:7,v:10});
  for(const z of [-.06,.06]){
    L(b,[-.43,-1.0,z],[-.40,-1.15,z],.021,{material:MAT.SAND,joint:head,u:14,v:9});
    E(b,[-.40,-1.15,z],[.03,.035,.028],{material:MAT.BROWN,joint:head,u:8,v:12});
  }
  pointedEar(b,[-.39,-.96,-.06],[-.25,-1.07,-.18],.045,.015,MAT.SAND,MAT.BROWN,head);
  pointedEar(b,[-.39,-.95,.07],[-.23,-1.01,.2],.045,.015,MAT.SAND,MAT.BROWN,head);
  b.eye([-.53,-.96,.099],.023,{joint:head,iris:MAT.INK});
  T(b,curve([.54,-.02,0],[.74,.12,0],[.71,.4,.03],[.67,.51,.04]),t=>.022*(1-.35*t),{material:MAT.SAND,u:24,v:8});
  E(b,[.67,.53,.04],[.047,.09,.045],{material:MAT.BROWN,u:12,v:14});
  return b.finish();
}

function chameleon(seed,quality=1){
  const b=new ModelBuilder(quality),head=motion(b,seed,[-.40,-.02,0],[0,1,0],.035);
  E(b,[.10,.02,0],[.48,.24,.15],{material:MAT.GREEN,pattern:(u,v,p)=>Math.sin(p[0]*44+p[1]*8)>.65?MAT.GOLD:MAT.GREEN,u:24,v:36});
  E(b,[-.41,-.02,0],[.22,.18,.14],{material:MAT.GREEN,joint:head});
  b.fin([-.58,-.12,-.03],[-.25,-.14,-.03],[-.29,-.34,-.03],{material:MAT.GREEN,curve:.08,joint:head,u:18,v:18});
  E(b,[-.57,.035,.015],[.14,.055,.105],{material:MAT.GREEN,joint:head,u:14,v:22});
  L(b,[-.70,.046,.04],[-.41,.08,.13],.008,{material:MAT.NAVY,joint:head,u:18,v:5});
  E(b,[-.47,-.075,.135],[.088,.085,.070],{material:MAT.GOLD,joint:head,u:16,v:24});
  b.eye([-.49,-.08,.198],.035,{joint:head,iris:MAT.GREEN});
  for(let i=0;i<15;i++){
    const x=-.16+i*.047,y=-Math.sqrt(Math.max(0,1-((x-.10)/.5)**2))*.24+.015;
    b.fin([x-.023,y,0],[x+.023,y,0],[x,y-.055,0],{material:MAT.GOLD,curve:.004,u:4,v:4});
  }
  for(const z of [-.11,.11])for(const x of [-.19,.35]){
    const joint=motion(b,seed+Math.round((x+1)*10),[x,.08,z],[0,0,1],.012);
    const bend=x<0?-.13:.13;
    T(b,curve([x,.08,z],[x+bend,.15,z*1.5],[x+bend,.25,z*1.9],[x-.01,.39,z*1.7]),t=>.045*(1-.4*t),{material:MAT.GREEN,joint,u:24,v:10});
    for(const side of [-1,1])T(b,curve([x-.01,.37,z*1.7],[x+side*.07,.43,z*1.8],[x+side*.08,.46,z*1.5],[x+side*.035,.46,z]),t=>.018*(1-.4*t),{material:MAT.GREEN,joint,u:15,v:7});
  }
  const tail=motion(b,seed+9,[.49,.03,0],[0,1,0],.03);
  T(b,t=>{const a=-Math.PI/2+t*TAU*1.25,r=.27*(1-t)+.025;return[.70+Math.cos(a)*r,.23+Math.sin(a)*r,0];},t=>.065*(1-t)+.008,{material:MAT.GREEN,joint:tail,u:64,v:14});
  T(b,curve([.48,.03,0],[.59,-.04,0],[.68,-.07,0],[.70,-.04,0]),t=>.075-.01*t,{material:MAT.GREEN,joint:tail,u:18,v:14});
  return b.finish();
}

function frog(seed,quality=1){
  const b=new ModelBuilder(quality),breath=motion(b,seed,[0,.04,0],[1,0,0],.012);
  E(b,[.02,.07,0],[.38,.24,.33],{material:MAT.GREEN,joint:breath,pattern:(u,v,p)=>p[1]>.1?MAT.IVORY:(Math.sin(p[0]*38)*Math.cos(p[2]*31)>.65?MAT.BROWN:MAT.GREEN),u:25,v:36});
  E(b,[-.30,.0,.02],[.27,.15,.29],{material:MAT.GREEN,joint:breath,u:22,v:34});
  E(b,[-.43,.085,.03],[.17,.045,.255],{material:MAT.IVORY,joint:breath,u:14,v:24});
  for(const z of [-.21,.21]){
    E(b,[-.29,-.12,z],[.11,.12,.095],{material:MAT.GREEN,joint:breath,u:16,v:22});
    b.eye([-.33,-.15,z+.065],.06,{joint:breath,iris:MAT.GOLD});
    E(b,[.32,.12,z],[.26,.16,.17],{material:MAT.GREEN,rotation:-.33,u:20,v:28});
    T(b,curve([.47,.18,z],[.65,.26,z*1.2],[.33,.35,z*1.55],[.22,.33,z*1.75]),t=>.065*(1-.5*t),{material:MAT.GREEN,u:25,v:12});
    T(b,curve([-.18,.10,z],[-.36,.26,z*1.15],[-.28,.34,z*1.6],[-.44,.36,z*1.7]),t=>.055*(1-.55*t),{material:MAT.GREEN,u:23,v:11});
    for(const back of [false,true]){
      const root=back?[.22,.33,z*1.75]:[-.44,.36,z*1.7];
      const ends=[];
      for(let i=0;i<3;i++){
        const end=[root[0]-.13+(back?.20:0)+(i-1)*.065,root[1]+.02,root[2]+(z>0?1:-1)*(.13-Math.abs(i-1)*.03)];ends.push(end);
        T(b,curve(root,blend(root,end,.35),blend(root,end,.7),end),t=>.017*(1-.45*t),{material:MAT.GREEN,u:13,v:7});
        E(b,end,[.024,.014,.023],{material:MAT.GOLD,u:7,v:9});
      }
      for(let i=0;i<2;i++)b.fin(ends[i],ends[i+1],root,{material:MAT.GREEN,curve:.01,u:8,v:8});
    }
  }
  for(let i=0;i<8;i++)E(b,[.02+(i%4)*.09,-.15,Math.floor(i/4)*.16-.08],[.025,.014,.025],{material:MAT.BROWN,joint:breath,u:6,v:8});
  return b.finish();
}

function beetle(seed,quality=1){
  const b=new ModelBuilder(quality),head=motion(b,seed,[-.52,-.02,0],[0,1,0],.04);
  E(b,[.16,.01,0],[.53,.19,.34],{material:MAT.INK,u:20,v:30});
  for(const side of [-1,1]){
    // Split, convex wing cases; the narrow dorsal seam stays readable in ASCII.
    b.surface((u,v)=>{const a=u*Math.PI,angle=(side>0?0:Math.PI)+v*Math.PI;return[.13+.52*Math.cos(a),-.035-.22*Math.sin(a)*Math.sin(v*Math.PI),side*(.018+.30*Math.sin(a)*Math.abs(Math.cos(v*Math.PI/2)))];},{material:MAT.NAVY,u:28,v:22,twoSided:true});
    for(let i=0;i<4;i++)T(b,t=>{const a=.2+t*2.7;return[.13+.51*Math.cos(a),-.04-.21*Math.sin(a)*Math.sin((i+1)/5*Math.PI/2),side*(.025+.29*Math.sin(a)*Math.cos((i+1)/5*Math.PI/2))];},.006,{material:MAT.CYAN,u:28,v:5});
  }
  E(b,[-.40,-.015,0],[.20,.17,.25],{material:MAT.GREEN,u:22,v:30});
  E(b,[-.62,-.02,0],[.16,.12,.18],{material:MAT.NAVY,joint:head,u:18,v:26});
  for(const side of [-1,1]){
    E(b,[-.68,-.035,side*.155],[.06,.065,.035],{material:MAT.INK,joint:head,u:12,v:16});
    T(b,curve([-.73,.01,side*.07],[-.91,.06,side*.19],[-.94,.02,side*.08],[-.85,.0,side*.025]),t=>.037*(1-.7*t),{material:MAT.INK,joint:head,u:20,v:10});
    T(b,curve([-.63,-.07,side*.13],[-.73,-.26,side*.28],[-.95,-.27,side*.30],[-1.04,-.33,side*.34]),t=>.014*(1-.5*t),{material:MAT.BROWN,joint:head,u:26,v:7});
    for(let i=0;i<3;i++)E(b,[-1.0-i*.025,-.30-i*.018,side*(.32+i*.012)],[.023,.017,.021],{material:MAT.GOLD,joint:head,u:6,v:8});
    for(let i=0;i<3;i++){
      const x=-.29+i*.27,root=[x,.075,side*.20],knee=[x+(i-1)*.16,.12,side*.46],end=[x+(i-1)*.24,.33,side*.61];
      const joint=motion(b,seed+i+side+10,root,[0,1,0],.018);
      T(b,curve(root,blend(root,knee,.6),knee,knee),t=>.041-.019*t,{material:MAT.BROWN,joint,u:15,v:8});
      T(b,curve(knee,blend(knee,end,.3),blend(knee,end,.8),end),t=>.025-.012*t,{material:MAT.BROWN,joint,u:20,v:8});
      L(b,end,[end[0]-.06,end[1],end[2]+side*.07],.010,{material:MAT.INK,joint,u:9,v:6});
      for(let j=1;j<4;j++){const p=blend(knee,end,j/4);L(b,p,[p[0]+.04,p[1]-.02,p[2]+side*.04],.006,{material:MAT.BROWN,joint,u:5,v:4});}
    }
  }
  return b.finish();
}

function cobra(seed,quality=1){
  const b=new ModelBuilder(quality),head=motion(b,seed,[0,.10,0],[0,1,0],.05);
  T(b,t=>{const a=t*TAU*2.05,r=.52-.27*t;return[Math.cos(a)*r,.49-.05*t,Math.sin(a)*r];},t=>.095-.025*t,{material:(u,v)=>Math.sin(u*TAU*26)>.6?MAT.BROWN:MAT.GOLD,u:116,v:18});
  T(b,curve([.25,.44,.03],[.12,.37,-.02],[.03,-.08,.06],[0,-.57,.11]),t=>.080+.015*t,{material:MAT.GOLD,joint:head,u:44,v:20});
  // Flattened hood with a narrow neck and shoulders widening just below the skull.
  b.surface((u,v)=>{const y=.16-u*.76,w=.07+.22*Math.sin(u*Math.PI)**.85,a=v*TAU;return[Math.cos(a)*w,y,.09+Math.sin(a)*(.04+.026*Math.sin(u*Math.PI))];},{material:(u,v)=>Math.sin(v*TAU)>.1?MAT.SAND:MAT.BROWN,joint:head,u:34,v:32});
  for(let i=0;i<11;i++){
    const u=.1+i*.067,y=.16-u*.76,w=.07+.22*Math.sin(u*Math.PI)**.85;
    T(b,t=>[(t-.5)*w*1.8,y,.143+Math.sin(t*Math.PI)*.013],.006,{material:MAT.GOLD,joint:head,u:16,v:5});
  }
  E(b,[0,-.61,.12],[.12,.13,.14],{material:MAT.BROWN,joint:head,u:22,v:28});
  E(b,[0,-.60,.225],[.10,.055,.08],{material:MAT.SAND,joint:head,u:14,v:20});
  b.eye([-.088,-.65,.205],.024,{joint:head,iris:MAT.GOLD});
  b.eye([.088,-.65,.205],.024,{joint:head,iris:MAT.GOLD});
  for(const side of [-1,1])E(b,[side*.039,-.615,.29],[.009,.008,.006],{material:MAT.INK,joint:head,u:6,v:8});
  T(b,t=>[0,-.57,.285+t*.16],.009,{material:MAT.CORAL,joint:head,u:12,v:6});
  for(const side of [-1,1])L(b,[0,-.57,.44],[side*.035,-.57,.50],.005,{material:MAT.CORAL,joint:head,u:8,v:5});
  T(b,curve([.48,.49,0],[.67,.49,-.13],[.76,.48,-.25],[.80,.48,-.18]),t=>.065*(1-.96*t),{material:MAT.BROWN,u:30,v:12});
  return b.finish();
}

function pangolin(seed,quality=1){
  const b=new ModelBuilder(quality),head=motion(b,seed,[-.47,.03,0],[0,1,0],.02);
  E(b,[.07,.035,0],[.51,.29,.25],{material:MAT.BROWN,u:23,v:34});
  E(b,[-.45,.08,0],[.23,.16,.15],{material:MAT.BROWN,joint:head,u:18,v:26});
  T(b,curve([-.51,.08,0],[-.67,.12,0],[-.75,.20,0],[-.82,.22,0]),t=>.10*(1-.84*t),{material:MAT.SAND,joint:head,u:25,v:15});
  E(b,[-.82,.22,0],[.025,.02,.027],{material:MAT.INK,joint:head,u:8,v:12});
  b.eye([-.55,.045,.13],.023,{joint:head,iris:MAT.INK});
  const tail=motion(b,seed+2,[.47,.07,0],[0,1,0],.035);
  T(b,curve([.46,.07,0],[.73,.13,0],[.94,.41,.07],[1.12,.37,.12]),t=>.16*(1-t)+.009,{material:MAT.BROWN,joint:tail,u:40,v:18});
  // Staggered, overlapping pointed keratin shields, each individually domed.
  for(let row=0;row<11;row++)for(let j=0;j<13;j++){
    const x=-.37+row*.086,angle=(j+(row%2)*.5)/13*TAU;
    const taper=Math.sqrt(Math.max(.12,1-((x-.06)/.55)**2));
    // The unarmoured underside remains distinct from the scaled upper flank.
    if(Math.cos(angle)>.45)continue;
    const center=[x,.035+Math.cos(angle)*.287*taper,Math.sin(angle)*.25*taper];
    b.surface((u,v)=>{
      const width=.075*Math.sin(Math.PI*u)**.55,lateral=(v-.5)*width*2,relief=.032*Math.sin(Math.PI*u)*Math.sin(Math.PI*v);
      return[center[0]+(u-.35)*.13,center[1]-Math.sin(angle)*lateral+Math.cos(angle)*relief,center[2]+Math.cos(angle)*lateral+Math.sin(angle)*relief];
    },{material:(u,v)=>(v<.08||v>.92||u>.86)?MAT.SAND:MAT.BROWN,u:5,v:5,twoSided:true});
  }
  for(let row=0;row<9;row++)for(let j=0;j<7;j++){
    const t=row/9,center=curve([.46,.07,0],[.73,.13,0],[.94,.41,.07],[1.12,.37,.12])(t),a=(j/7)*TAU,r=.16*(1-t)+.009;
    b.fin([center[0]-.035,center[1]+Math.cos(a)*r,center[2]+Math.sin(a)*r],[center[0]-.02,center[1]+Math.cos(a+.65)*r,center[2]+Math.sin(a+.65)*r],[center[0]+.09*(1-t*.7),center[1]+Math.cos(a+.3)*(r+.014),center[2]+Math.sin(a+.3)*(r+.014)],{material:MAT.SAND,joint:tail,curve:.008,u:4,v:4});
  }
  for(const z of [-.15,.15])for(const x of [-.26,.36]){
    leg(b,[x,.16,z],[x+.025,.30,z*1.2],[x-.035,.42,z*1.4],[x-.08,.43,z*1.4],{r:.064,material:MAT.BROWN});
    for(let i=0;i<3;i++)T(b,curve([x-.08,.42,z*1.4+(i-1)*.035],[x-.13,.44,z*1.4+(i-1)*.035],[x-.18,.45,z*1.4+(i-1)*.035],[x-.19,.46,z*1.4+(i-1)*.035]),t=>.015*(1-.85*t),{material:MAT.IVORY,u:10,v:6});
  }
  return b.finish();
}

export const LAND_MODELS = [
  {id:'red-fox',name:'Red fox',category:'Land',orientation:[-.08,-.38,-.02],build:redFox},
  {id:'rabbit',name:'Rabbit',category:'Land',orientation:[-.06,-.34,0],build:rabbit},
  {id:'deer',name:'Deer',category:'Land',orientation:[-.04,-.36,0],build:deer},
  {id:'elephant',name:'Elephant',category:'Land',orientation:[-.06,-.33,0],build:elephant},
  {id:'giraffe',name:'Giraffe',category:'Land',orientation:[-.04,-.33,0],build:giraffe},
  {id:'chameleon',name:'Chameleon',category:'Land',orientation:[-.08,-.30,0],build:chameleon},
  {id:'frog',name:'Frog',category:'Land',orientation:[-.31,-.40,0],build:frog},
  {id:'beetle',name:'Beetle',category:'Land',orientation:[-.68,-.27,0],build:beetle},
  {id:'cobra',name:'Cobra',category:'Land',orientation:[-.10,-.25,0],build:cobra},
  {id:'pangolin',name:'Pangolin',category:'Land',orientation:[-.08,-.36,0],build:pangolin}
];
