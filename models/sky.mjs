// Original hand-built bird and insect surfaces. No imported meshes or traced artwork.
import {ModelBuilder, MAT, TAU, lerp3} from './geometry.mjs';

const E=(b,c,r,m,o={})=>b.ellipsoid(c,r,{material:m,u:18,v:28,...o});
const L=(b,a,c,r,m,o={})=>b.line(a,c,r,{material:m,u:13,v:6,...o});
const bez=(a,c,d,e,t)=>a.map((x,k)=>(1-t)**3*x+3*(1-t)**2*t*c[k]+3*(1-t)*t*t*d[k]+t**3*e[k]);

// A curved, tapered feather, with a raised central shaft and a narrow pointed tip.
function feather(b,start,end,width,material,joint=0,bend=.035){
  const dx=end[0]-start[0],dy=end[1]-start[1],length=Math.hypot(dx,dy)||1;
  b.surface((s,t)=>{
    const p=lerp3(start,end,s),w=width*Math.sin(Math.PI*s)**.65*(t*2-1);
    return [p[0]-dy/length*w,p[1]+dx/length*w,p[2]+Math.sin(Math.PI*s)*(bend+.014*(1-Math.abs(t*2-1)))];
  },{u:15,v:6,material,joint,twoSided:true});
}

function feet(b,ankle,material=MAT.SAND,scale=1){
  const [x,y,z]=ankle;
  for(const s of [-1,0,1])L(b,ankle,[x+.12*scale,y+.025*scale,z+s*.06*scale],.009*scale,material,{u:9});
  L(b,ankle,[x-.07*scale,y+.02*scale,z],.008*scale,material,{u:8});
}

function flightWing(b,side,{span=1.35,chord=.43,sweep=.2,material=MAT.WHITE,tip=MAT.INK,feathers=8,joint=0,broad=false}={}){
  b.surface((s,t)=>{
    const lead=.12-sweep*s-.1*s*s;
    const width=chord*(.9+.3*Math.sin(s*Math.PI))*(1-.73*s);
    return [lead-width*t,side*(.08+span*s),.015+.12*Math.sin(Math.PI*s)+.07*Math.sin(Math.PI*t)];
  },{u:30,v:15,joint,twoSided:true,material:(s,t)=>s>.77||t>.83?tip:material});
  for(let i=0;i<feathers;i++){
    const t=i/(feathers-1),s=.53+t*.46,lead=.12-sweep*s-.1*s*s;
    const start=[lead-.09,side*(.08+span*s),.035+.075*Math.sin(Math.PI*s)];
    const end=[lead-(broad?.28:.18)-.17*Math.sin(t*Math.PI),side*(.08+span*s+.12+.1*t),.02];
    feather(b,start,end,broad?.052:.035,tip,joint);
  }
}

function albatross(seed,q){
  const b=new ModelBuilder(q);
  E(b,[.05,0,0],[.53,.14,.16],MAT.WHITE);
  E(b,[.48,-.015,.025],[.19,.105,.115],MAT.IVORY);
  b.tube(t=>[.6+.29*t,-.015+.035*t*t,.025],t=>.041*(1-t)+.009,{u:18,v:10,material:MAT.SAND});
  E(b,[.86,.028,.025],[.035,.035,.026],MAT.SAND,{u:8,v:12});
  b.eye([.55,-.055,.115],.024,{iris:MAT.INK});
  for(const s of [-1,1]){
    const joint=b.joint({pivot:[0,s*.1,0],axis:[1,0,0],amplitude:s*.07,speed:.7,phase:s*.3});
    flightWing(b,s,{span:1.75,chord:.33,sweep:.26,joint,feathers:9});
  }
  for(let i=0;i<5;i++)feather(b,[-.35,(i-2)*.025,.025],[-.81,(i-2)*.055,0],.039,MAT.WHITE);
  return b.finish();
}

function hummingbird(seed,q){
  const b=new ModelBuilder(q);
  E(b,[-.03,.16,0],[.32,.14,.14],MAT.GREEN,{rotation:-.44,pattern:(u,v,p)=>p[1]>.025?MAT.IVORY:MAT.GREEN});
  E(b,[.23,-.06,.018],[.145,.13,.13],MAT.GREEN);
  E(b,[.25,.035,.07],[.105,.085,.085],MAT.CORAL,{u:14,v:20});
  b.tube(t=>[.33+.47*t,-.075-.018*t,.02],t=>.024*(1-t)+.0025,{u:26,v:8,material:MAT.NAVY});
  b.eye([.285,-.097,.13],.029,{iris:MAT.INK});
  for(const s of [-1,1]){
    const j=b.joint({pivot:[-.02,.08,0],axis:[1,.15,0],amplitude:s*.33,speed:12,phase:s<0?Math.PI:0});
    const z=s<0?-.08:.13;
    b.surface((u,v)=>[-.015-.51*u+.16*v*u,.06-.86*u+.27*v*u,z+.15*Math.sin(u*Math.PI)*Math.sin(v*Math.PI)],{u:28,v:20,material:(u,v)=>v>.82?MAT.NAVY:MAT.SLATE,joint:j,twoSided:true});
    for(let i=0;i<7;i++)feather(b,[-.12,.0,z],[-.62+i*.032,-.82+i*.048,z+.02],.025,MAT.SLATE,j);
  }
  for(let i=0;i<5;i++)feather(b,[-.23,.25,.01],[-.62+(i%2)*.06,.55+(i-2)*.025,(i-2)*.025],.026,MAT.NAVY);
  L(b,[.03,.26,.05],[.08,.34,.05],.009,MAT.INK);feet(b,[.08,.34,.05],MAT.INK,.45);
  return b.finish();
}

function owl(seed,q){
  const b=new ModelBuilder(q);
  E(b,[0,.19,0],[.35,.54,.25],MAT.SAND,{pattern:(u,v,p)=>p[2]>.12?MAT.IVORY:MAT.BROWN});
  for(const s of [-1,1]){
    E(b,[s*.255,.17,.025],[.13,.43,.19],MAT.BROWN,{rotation:-s*.15,pattern:(u,v)=>Math.sin(u*37+v*8)>.66?MAT.SAND:MAT.BROWN});
    for(let i=0;i<6;i++)feather(b,[s*(.19+i*.023),.15,.16],[s*(.22+i*.018),.61-i*.015,.1],.026,i%2?MAT.BROWN:MAT.SAND);
  }
  E(b,[0,-.35,.06],[.33,.3,.245],MAT.SAND);
  // The two lobes and the taper below them make the barn owl's heart-shaped facial disc.
  for(const s of [-1,1]){
    E(b,[s*.118,-.38,.245],[.153,.185,.075],MAT.IVORY,{rotation:s*.18});
    E(b,[s*.064,-.225,.236],[.1,.133,.061],MAT.IVORY,{rotation:-s*.36,u:14,v:20});
    b.eye([s*.124,-.39,.316],.06,{iris:MAT.INK});
    L(b,[s*.11,.62,.06],[s*.11,.73,.08],.025,MAT.SAND);feet(b,[s*.11,.73,.08],MAT.SAND,.9);
  }
  b.tube(t=>[0,-.3+.16*t,.315+.06*Math.sin(t*Math.PI)],t=>.035*(1-t)+.002,{u:14,v:10,material:MAT.SAND});
  for(let i=0;i<4;i++)feather(b,[(i-1.5)*.055,.54,-.08],[(i-1.5)*.07,.83,-.09],.045,MAT.BROWN);
  return b.finish();
}

function swallow(seed,q){
  const b=new ModelBuilder(q);
  E(b,[.06,0,0],[.37,.105,.14],MAT.NAVY,{pattern:(u,v,p)=>p[2]>.075?MAT.IVORY:MAT.NAVY});
  E(b,[.36,-.015,.02],[.135,.11,.13],MAT.NAVY);
  E(b,[.4,.045,.1],[.065,.07,.05],MAT.RUST,{u:10,v:16});
  b.tube(t=>[.45+.16*t,-.005,.04],t=>.037*(1-t)+.001,{u:14,v:8,material:MAT.INK});
  b.eye([.39,-.045,.133],.024,{iris:MAT.INK});
  for(const s of [-1,1]){
    const j=b.joint({pivot:[.04,s*.07,0],axis:[1,0,0],amplitude:s*.19,speed:3.5});
    b.surface((u,v)=>{
      const x=.11-.71*u*u;
      return [x-(.34*(1-u)+.012)*v,s*(.06+1.09*u),.13*Math.sin(u*Math.PI)+.04*Math.sin(v*Math.PI)];
    },{u:32,v:18,material:(u,v)=>v>.76?MAT.SLATE:MAT.NAVY,joint:j,twoSided:true});
    for(let i=0;i<5;i++)feather(b,[-.2,s*.1,0],[-.93+i*.085,s*(.3-i*.035),.01],.028,MAT.NAVY);
  }
  return b.finish();
}

function heron(seed,q){
  const b=new ModelBuilder(q);
  E(b,[-.14,.16,0],[.32,.24,.18],MAT.SLATE,{rotation:-.18});
  E(b,[-.19,.11,.12],[.28,.18,.085],MAT.SLATE,{rotation:-.2,pattern:(u,v)=>Math.sin(v*45+u*17)>.55?MAT.IVORY:MAT.SLATE});
  // Double-curved folded neck, distinct from a straight tube.
  b.tube(t=>bez([.06,.15,0],[.43,-.09,0],[-.18,-.49,0],[.21,-.65,.01],t),t=>.07+.025*Math.sin(t*Math.PI),{u:46,v:14,material:MAT.IVORY});
  E(b,[.28,-.67,.01],[.16,.09,.095],MAT.IVORY);
  E(b,[.28,-.709,.03],[.15,.034,.078],MAT.NAVY,{u:10,v:18});
  b.tube(t=>[.39+.35*t,-.657+.025*t,.01],t=>.037*(1-t)+.001,{u:24,v:8,material:MAT.GOLD});
  b.eye([.335,-.677,.1],.026,{iris:MAT.GOLD});
  for(let i=0;i<3;i++)feather(b,[.18,-.7,-.005],[-.08-i*.035,-.75+i*.015,-.01],.009,MAT.NAVY);
  for(let i=0;i<7;i++)feather(b,[-.03,.08,.15],[-.49+i*.018,.37-i*.025,.09],.026,i%2?MAT.SLATE:MAT.IVORY);
  for(const s of [-1,1]){
    const z=s*.067;
    L(b,[-.1,.33,z],[-.13,.62,z],.019,MAT.BROWN);
    E(b,[-.13,.62,z],[.025,.029,.025],MAT.BROWN,{u:8,v:10});
    L(b,[-.13,.62,z],[-.075,.99,z],.012,MAT.BROWN);feet(b,[-.075,.99,z],MAT.BROWN,1.1);
  }
  for(let i=0;i<4;i++)feather(b,[-.34,.21,-.03],[-.61,.35+(i-1.5)*.025,-.04],.022,MAT.SLATE);
  return b.finish();
}

function eagle(seed,q){
  const b=new ModelBuilder(q);
  E(b,[.015,0,0],[.43,.19,.2],MAT.BROWN);
  E(b,[.42,-.01,.03],[.21,.14,.15],MAT.IVORY);
  b.tube(t=>[.56+.2*t,-.005+.09*t*t,.035],t=>.056*(1-t)+.012,{u:22,v:12,material:MAT.GOLD});
  b.eye([.495,-.055,.16],.027,{iris:MAT.GOLD});
  L(b,[.44,-.089,.167],[.54,-.065,.17],.013,MAT.BROWN,{u:8});
  for(const s of [-1,1]){
    const j=b.joint({pivot:[0,s*.14,0],axis:[1,0,0],amplitude:s*.11,speed:.85});
    flightWing(b,s,{span:1.25,chord:.57,sweep:.14,material:MAT.BROWN,tip:MAT.INK,feathers:8,joint:j,broad:true});
    for(let i=0;i<7;i++)feather(b,[.015,s*(.22+i*.12),.11],[-.31,s*(.28+i*.12),.12],.048,MAT.BROWN,j);
    L(b,[-.19,s*.1,.05],[-.36,s*.16,.13],.031,MAT.GOLD);
    for(let i=0;i<3;i++)L(b,[-.36,s*.16,.13],[-.43,s*(.12+i*.04),.17],.013,MAT.GOLD,{u:7});
  }
  for(let i=0;i<7;i++)feather(b,[-.28,(i-3)*.035,.01],[-.78,(i-3)*.072,.025],.056,MAT.IVORY);
  return b.finish();
}

function kingfisher(seed,q){
  const b=new ModelBuilder(q);
  E(b,[-.09,.15,0],[.24,.32,.19],MAT.CYAN,{rotation:.25,pattern:(u,v,p)=>p[0]>.005?MAT.RUST:MAT.CYAN});
  E(b,[.04,-.16,.01],[.225,.19,.17],MAT.CYAN,{pattern:(u,v)=>u<.45&&Math.sin(v*64)>0?MAT.SLATE:MAT.CYAN});
  E(b,[.13,-.055,.1],[.12,.09,.076],MAT.IVORY,{u:13,v:20});
  b.tube(t=>[.21+.47*t,-.135+.017*t,0],t=>.047*(1-t)+.001,{u:25,v:10,material:MAT.NAVY});
  b.eye([.128,-.18,.168],.036,{iris:MAT.INK});
  L(b,[.015,-.145,.17],[.16,-.153,.175],.018,MAT.INK,{u:10});
  E(b,[-.18,.14,.15],[.14,.24,.07],MAT.CYAN,{rotation:.18});
  for(let i=0;i<7;i++)feather(b,[-.2+i*.023,.035,.185],[-.25+i*.022,.39,.14],.018,i%2?MAT.NAVY:MAT.CYAN);
  for(let i=0;i<4;i++)feather(b,[-.17,.34,0],[-.34+(i-1.5)*.035,.59,-.02],.034,MAT.CYAN);
  for(const z of [-.08,.09]){L(b,[0,.37,z],[.02,.48,z],.019,MAT.CORAL);feet(b,[.02,.48,z],MAT.CORAL,.7);}
  L(b,[-.52,.52,.01],[.44,.52,.01],.035,MAT.BROWN,{u:28,v:10});
  return b.finish();
}

function toucan(seed,q){
  const b=new ModelBuilder(q);
  E(b,[-.25,.16,0],[.25,.37,.23],MAT.NAVY,{rotation:.16});
  E(b,[-.13,-.2,.015],[.22,.22,.2],MAT.NAVY);
  E(b,[-.045,.015,.18],[.15,.26,.09],MAT.IVORY,{rotation:-.19});
  // Deep keel and curved top form a large hollow-looking bill, rather than a cone.
  b.surface((u,v)=>{
    const a=v*TAU,ry=.18*Math.sin(Math.PI*(.12+.88*u))+.008;
    return [.025+.65*u,-.22-.095*Math.sin(Math.PI*u)+Math.cos(a)*ry,Math.sin(a)*ry*.57];
  },{u:34,v:24,material:(u,v)=>u>.79?MAT.INK:v>.5?MAT.GOLD:MAT.CORAL});
  L(b,[.04,-.21,.105],[.65,-.21,.04],.008,MAT.INK,{u:25});
  E(b,[-.005,-.238,.183],[.063,.06,.026],MAT.CYAN,{u:11,v:16});
  b.eye([.008,-.244,.208],.03,{iris:MAT.INK});
  E(b,[-.37,.16,.15],[.12,.3,.09],MAT.NAVY,{rotation:.14});
  for(let i=0;i<6;i++)feather(b,[-.38+i*.025,.12,.21],[-.45+i*.025,.46,.15],.022,i%2?MAT.SLATE:MAT.NAVY);
  for(let i=0;i<5;i++)feather(b,[-.36,.39,0],[-.58+(i-2)*.025,.83,-.04],.037,MAT.NAVY);
  for(const z of [-.09,.1]){L(b,[-.17,.46,z],[-.13,.61,z],.022,MAT.SLATE);feet(b,[-.13,.61,z],MAT.SLATE,.9);}
  L(b,[-.64,.66,0],[.5,.66,0],.037,MAT.BROWN,{u:30,v:10});
  return b.finish();
}

function butterfly(seed,q){
  const b=new ModelBuilder(q);
  E(b,[0,.08,.02],[.043,.32,.053],MAT.INK,{u:24,v:12});
  E(b,[0,-.25,.03],[.066,.068,.06],MAT.INK,{u:12,v:16});
  for(const s of [-1,1]){
    const j=b.joint({pivot:[s*.035,-.03,0],axis:[0,1,0],amplitude:s*.19,speed:1.25});
    const patches=[{base:[s*.025,-.12,0],tip:[s*.78,-.71,0],bottom:[s*.71,.06,0],upper:true},{base:[s*.02,.015,0],tip:[s*.69,.14,0],bottom:[s*.42,.63,0],upper:false}];
    for(const p of patches){
      b.surface((u,v)=>{
        const edge=bez(p.tip,[p.tip[0]*1.18,p.tip[1]+.17,0],[p.bottom[0]*1.13,p.bottom[1]-.1,0],p.bottom,v);
        const pt=lerp3(p.base,edge,u);pt[2]=.035+.15*Math.sin(u*Math.PI)*Math.sin(v*Math.PI);return pt;
      },{u:32,v:28,joint:j,twoSided:true,material:(u,v)=>{
        if(u>.84){return u>.9&&Math.sin(v*67)>.35&&u<.97?MAT.IVORY:MAT.INK;}
        if(Math.abs(Math.sin(v*5*Math.PI+u*.25))<.12||u<.12||Math.abs(u-.62)<.014)return MAT.INK;
        return MAT.RUST;
      }});
      for(let i=1;i<5;i++){
        const v=i/5,end=bez(p.tip,[p.tip[0]*1.18,p.tip[1]+.17,0],[p.bottom[0]*1.13,p.bottom[1]-.1,0],p.bottom,v);
        b.tube(t=>{const pt=lerp3(p.base,end,t);pt[2]=.047+.15*Math.sin(t*Math.PI)*Math.sin(v*Math.PI);return pt;},.005,{u:16,v:4,material:MAT.INK,joint:j});
      }
    }
    b.tube(t=>[s*(.025+.13*t),-.29-.26*t,.04+.04*Math.sin(t*Math.PI)],t=>.006-.003*t,{u:16,v:5,material:MAT.IVORY});
    E(b,[s*.155,-.55,.04],[.014,.026,.012],MAT.IVORY,{u:6,v:8});
  }
  return b.finish();
}

function dragonfly(seed,q){
  const b=new ModelBuilder(q);
  for(let i=0;i<11;i++){
    const radius=.053*(1-i*.05);
    E(b,[0,.08+i*.067,.02],[radius,.049,radius],i%3===0?MAT.NAVY:MAT.CYAN,{u:8,v:12});
  }
  E(b,[0,-.09,.015],[.09,.16,.08],MAT.SLATE,{u:16,v:20});
  E(b,[0,-.26,.025],[.12,.08,.075],MAT.SLATE,{u:12,v:18});
  for(const s of [-1,1]){
    E(b,[s*.072,-.272,.06],[.065,.072,.055],MAT.CYAN,{u:12,v:18});
    for(let k=0;k<2;k++){
      const root=[s*.04,-.13+k*.13,.01],tip=[s*(k?.81:.91),-.38+k*.55,.015];
      const j=b.joint({pivot:root,axis:[0,1,0],amplitude:s*.12,speed:8,phase:k*Math.PI});
      b.surface((u,v)=>{
        const p=lerp3(root,tip,u),width=(k?.13:.105)*Math.sin(Math.PI*u)**.6;
        return [p[0],p[1]+(v*2-1)*width,.015+.075*Math.sin(u*Math.PI)*Math.sin(v*Math.PI)];
      },{u:36,v:16,joint:j,twoSided:true,shade:.63,material:(u,v)=>Math.abs(v-.5)<.04||v<.07||v>.93||Math.sin(u*72)> .88?MAT.SLATE:MAT.IVORY});
      L(b,root,tip,.006,MAT.CYAN,{u:34,joint:j});
      for(let i=1;i<8;i++){
        const u=i/9,p=lerp3(root,tip,u),w=(k?.13:.105)*Math.sin(Math.PI*u)**.6;
        L(b,[p[0],p[1]-w,.021],[p[0]+s*.015,p[1]+w,.021],.0035,MAT.SLATE,{u:7,v:4,joint:j});
      }
      E(b,[tip[0]*.87,tip[1]*.87,.024],[.038,.013,.007],MAT.INK,{u:6,v:10,joint:j});
    }
    for(let i=0;i<3;i++){
      L(b,[s*.04,-.18+i*.065,.05],[s*.17,-.1+i*.075,.09],.007,MAT.NAVY,{u:8});
      L(b,[s*.17,-.1+i*.075,.09],[s*.11,.02+i*.075,.09],.006,MAT.NAVY,{u:8});
    }
  }
  return b.finish();
}

export const SKY_MODELS=[
  {id:'albatross',name:'Albatross',category:'Sky',orientation:[.24,-.21,-.47],build:albatross},
  {id:'hummingbird',name:'Hummingbird',category:'Sky',orientation:[.08,-.17,0],build:hummingbird},
  {id:'barn-owl',name:'Barn owl',category:'Sky',orientation:[.03,-.13,0],build:owl},
  {id:'swallow',name:'Swallow',category:'Sky',orientation:[.2,-.16,-.4],build:swallow},
  {id:'heron',name:'Heron',category:'Sky',orientation:[.02,-.14,0],build:heron},
  {id:'eagle',name:'Eagle',category:'Sky',orientation:[.22,-.15,-.38],build:eagle},
  {id:'kingfisher',name:'Kingfisher',category:'Sky',orientation:[.02,-.16,0],build:kingfisher},
  {id:'toucan',name:'Toucan',category:'Sky',orientation:[.05,-.16,0],build:toucan},
  {id:'monarch-butterfly',name:'Monarch butterfly',category:'Sky',orientation:[.13,-.22,-.13],build:butterfly},
  {id:'dragonfly',name:'Dragonfly',category:'Sky',orientation:[.2,-.18,-.27],build:dragonfly}
];
