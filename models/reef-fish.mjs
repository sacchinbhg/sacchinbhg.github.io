// Original aquarium fish surfaces: recognizable profiles, articulated tails, no imported meshes.
import {ModelBuilder, MAT, TAU, STRIDE, lerp3} from './geometry.mjs';

const E=(b,c,r,m=MAT.CYAN,o={})=>b.ellipsoid(c,r,{material:m,u:19,v:30,...o});
const L=(b,a,c,r=.012,m=MAT.SLATE,o={})=>b.line(a,c,r,{material:m,u:16,v:5,...o});

const fract=n=>n-Math.floor(n);
// Ordered overlapping scale edges and radial fin ribs are baked into existing samples.
function scaleShade(u,v,columns=14,rows=11){
  const row=Math.floor(v*rows),x=fract(u*columns+(row%2)*.5),y=fract(v*rows);
  const arc=.18+.63*Math.sqrt(Math.max(0,1-(x*2-1)**2));
  return Math.abs(y-arc)<.105?.68:.91+.09*Math.sin(x*Math.PI);
}
const rayShade=(u,v,count=12)=>.72+.28*Math.abs(Math.cos(v*Math.PI*count))**10;
function spot(u,v,columns=7,rows=8){
  const row=Math.floor(v*rows),x=fract(u*columns+(row%2)*.5)-.5,y=fract(v*rows)-.5;
  return x*x+y*y;
}
function eye(b,c,r,{iris=MAT.GOLD,mirror=true}={}){
  const start=b.data.length;
  b.eye(c,r,{iris:iris===MAT.INK?MAT.SAND:iris});
  b.tube(t=>{const a=t*TAU;return[c[0]+Math.cos(a)*r*.81,c[1]+Math.sin(a)*r*.89,c[2]+r*.39];},r*.055,{u:19,v:4,material:MAT.IVORY});
  E(b,[c[0]-r*.17,c[1]-r*.25,c[2]+r*.79],[r*.25,r*.19,r*.075],MAT.WHITE,{u:6,v:8});
  // Profile fish have an eye on each flank; reflect the complete eye, including its outward normal.
  const end=b.data.length;
  if(mirror&&c[2]>0)for(let i=start;i<end;i+=STRIDE){
    b.data.push(b.data[i],b.data[i+1],-b.data[i+2],b.data[i+3],b.data[i+4],-b.data[i+5],b.data[i+6],b.data[i+7],b.data[i+8],b.data[i+9]);
  }
}
function body(b,{length=1.15,height=.26,depth=.15,center=0,material=MAT.CYAN,shape=.65,pattern,scales=true,scaleColumns=14}={}){
  b.surface((u,v)=>{const a=v*TAU,r=Math.sin(Math.PI*u)**shape;return[center+(u-.5)*length,Math.sin(a)*height*r,Math.cos(a)*depth*r];},{u:37,v:32,material:pattern||material,shade:scales?(u,v)=>scaleShade(u,v,scaleColumns):.94});
}
function lateralLine(b,{length,height,depth,center=0,shape=.65,material=MAT.IVORY}){
  b.tube(t=>{const u=.16+.64*t,r=Math.sin(Math.PI*u)**shape,y=-height*.08;return[center+(u-.5)*length,y,depth*r*Math.sqrt(1-(y/(height*r))**2)+.003];},.005,{u:32,v:4,material});
}

function tailJoint(b,x,amplitude=.23,speed=2.3){return b.joint({pivot:[x,0,0],axis:[0,1,0],amplitude,speed});}

function forkTail(b,x,joint,{length=.35,height=.3,material=MAT.CYAN,round=false}={}){
  for(const s of [-1,1])b.surface((u,v)=>{
    const far=x-length*u,spread=height*u,scoop=(round?.06:.2)*Math.sin(Math.PI*v)*u;
    return[far+scoop,s*spread*(.06+.94*v),.035*Math.sin(u*Math.PI)*Math.sin(v*Math.PI)];
  },{u:23,v:18,joint,material,shade:(u,v)=>rayShade(u,v,8),twoSided:true});
  for(const s of [-1,1])for(let i=1;i<5;i++)L(b,[x,0,.006],[x-length+.12*Math.sin(i/5*Math.PI),s*height*i/5,.01],.004,MAT.SLATE,{joint,u:17,v:4});
  for(const s of [-1,1])b.tube(t=>[x-length+(round?.06:.2)*Math.sin(Math.PI*t),s*height*(.06+.94*t),.006],.004,{u:22,v:4,material:MAT.IVORY,joint});
}

function fanTail(b,x,joint,{length=.46,height=.43,material=MAT.CORAL,lobes=0,spotted=false}={}){
  b.surface((u,v)=>{
    const a=(v-.5)*Math.PI*.83,edge=length*(1+.035*Math.sin(v*TAU*lobes));
    return[x-u*edge*Math.cos(a),u*height*Math.sin(a)/.965,.055*Math.sin(u*Math.PI)*Math.sin(v*Math.PI)];
  },{u:25,v:31,joint,material:(u,v)=>spotted&&u>.36&&u<.87&&spot(u,v,5,9)<.075?MAT.NAVY:u>.95?MAT.IVORY:material,shade:(u,v)=>rayShade(u,v,10),twoSided:true});
  for(let i=0;i<11;i++){
    const a=(i/10-.5)*Math.PI*.83;
    L(b,[x,0,.007],[x-length*Math.cos(a),height*Math.sin(a)/.965,.01],.004,MAT.GOLD,{u:17,v:4,joint});
  }
}

function pectoral(b,x,y,z,{size=.22,material=MAT.CYAN,joint=0}={}){
  const point=(u,v,offset=0)=>[x-size*u,y+size*.65*u*(v*2-1),z+size*.7*u+.03*Math.sin(u*Math.PI)*Math.sin(v*Math.PI)+offset];
  b.surface((u,v)=>point(u,v),{u:19,v:15,material,shade:(u,v)=>rayShade(u,v,6),joint,twoSided:true});
  for(let i=1;i<5;i++)b.tube(t=>point(t,i/5,.004),.003,{u:13,v:4,material:MAT.IVORY,joint});
}

function gill(b,x,height,depth){
  b.tube(t=>[x-.045*Math.sin(t*Math.PI),-height*.64+height*1.28*t,depth*.86+.018*Math.sin(t*Math.PI)],.008,{u:22,v:5,material:MAT.SLATE});
  b.tube(t=>[x+.016-.045*Math.sin(t*Math.PI),-height*.59+height*1.18*t,depth*.88+.018*Math.sin(t*Math.PI)],.004,{u:20,v:4,material:MAT.IVORY});
}

function dorsal(b,a,c,tip,{material=MAT.CYAN,joint=0,u=25,v=19,curve=.045}={}){
  const point=(s,t,offset=0)=>{const p=lerp3(lerp3(a,c,t),tip,s);p[2]+=Math.sin(s*Math.PI)*Math.sin(t*Math.PI)*curve+offset;return p;};
  b.surface((s,t)=>point(s,t),{material,shade:(s,t)=>rayShade(s,t,8),joint,u,v,twoSided:true});
  for(let k=1;k<5;k++)b.tube(t=>point(t,k/5,.004),.0035,{u:14,v:4,material:MAT.IVORY,joint});
}

function moorishIdol(seed,q){
  const b=new ModelBuilder(q);
  E(b,[.04,.02,0],[.35,.43,.125],MAT.IVORY,{u:28,v:38,pattern:(u,v,p)=>{const band=p[0]+.035*Math.sin(p[1]*7);return band<-.13||band>.1?MAT.NAVY:Math.abs(band+.11)<.018?MAT.IVORY:MAT.GOLD;},shade:(u,v)=>scaleShade(u,v,10,9)});
  E(b,[.36,.08,0],[.17,.09,.08],MAT.IVORY,{rotation:.22,u:15,v:22});
  E(b,[.485,.108,.005],[.047,.028,.04],MAT.SAND,{u:8,v:12});
  eye(b,[.257,-.09,.106],.035,{iris:MAT.GOLD});gill(b,.13,.33,.13);
  L(b,[.449,.108,.035],[.505,.12,.035],.004,MAT.NAVY,{u:8,v:4});
  dorsal(b,[-.26,-.19,0],[.14,-.33,0],[-.06,-.72,0],{material:MAT.GOLD});
  b.tube(t=>[-.06-.75*t+.11*Math.sin(t*Math.PI),-.7-.13*Math.sin(t*Math.PI)+.22*t,0],t=>.034*(1-t)+.004,{u:38,v:7,material:MAT.IVORY});
  dorsal(b,[-.27,.2,0],[.14,.35,0],[-.37,.59,0],{material:MAT.GOLD});
  const j=tailJoint(b,-.29,.18,2);forkTail(b,-.29,j,{length:.36,height:.27,material:MAT.NAVY});
  pectoral(b,.12,.07,.12,{size:.22,material:MAT.IVORY});
  return b.finish();
}

function goldfish(seed,q){
  const b=new ModelBuilder(q);
  E(b,[.04,0,0],[.43,.35,.28],MAT.GOLD,{u:28,v:38,shade:(u,v)=>scaleShade(u,v,12,10)});
  E(b,[.36,-.055,.015],[.24,.23,.21],MAT.CORAL,{u:22,v:30,shade:(u,v)=>.78+.22*Math.sin(u*Math.PI)});
  for(let i=0;i<9;i++){
    const a=i*2.4;
    E(b,[.36+.13*Math.cos(a),-.16+.07*Math.sin(a),.13+.035*(i%3)],[.065,.057,.052],MAT.CORAL,{u:8,v:12,shade:(u,v)=>.72+.28*Math.sin(u*Math.PI)});
  }
  eye(b,[.455,-.04,.185],.043,{iris:MAT.INK});E(b,[.567,.07,.005],[.035,.045,.065],MAT.GOLD,{u:9,v:13});
  gill(b,.23,.26,.255);
  b.tube(t=>[.574+.02*Math.cos(t*TAU),.07+.029*Math.sin(t*TAU),.057],.004,{u:16,v:4,material:MAT.IVORY});
  const j=tailJoint(b,-.29,.23,1.8);fanTail(b,-.29,j,{length:.65,height:.5,material:MAT.GOLD,lobes:5});
  pectoral(b,.19,.17,.22,{size:.27,material:MAT.CORAL});
  dorsal(b,[-.04,.28,.02],[.21,.24,.03],[-.13,.53,.05],{material:MAT.GOLD});
  return b.finish();
}

function koi(seed,q){
  const b=new ModelBuilder(q);
  body(b,{length:1.5,height:.27,depth:.24,shape:.57,material:MAT.IVORY,scaleColumns:12,pattern:(u,v)=>{const patch=Math.sin(u*18+Math.cos(v*TAU)*3);return patch>.35?MAT.CORAL:patch>.23?MAT.BROWN:MAT.IVORY;}});
  E(b,[.6,.015,0],[.22,.19,.19],MAT.IVORY,{u:16,v:26});
  E(b,[.78,.065,0],[.052,.067,.1],MAT.CORAL,{u:8,v:14});
  eye(b,[.615,-.07,.18],.035,{iris:MAT.INK});gill(b,.4,.25,.23);
  lateralLine(b,{length:1.5,height:.27,depth:.24,shape:.57,material:MAT.SAND});
  for(const s of [-1,1])b.tube(t=>[.78+.07*t,.09+.13*t,s*(.07+.17*t)],t=>.012*(1-t)+.003,{u:17,v:5,material:MAT.SAND});
  const j=tailJoint(b,-.65,.24,1.7);forkTail(b,-.65,j,{height:.36,length:.45,material:MAT.IVORY});
  dorsal(b,[-.45,-.17,0],[.25,-.24,0],[-.3,-.45,0],{material:MAT.CORAL,u:30});
  for(const s of [-1,1])pectoral(b,.35,.07,s*.2,{size:.32,material:MAT.IVORY});
  return b.finish();
}

function butterflyfish(seed,q){
  const b=new ModelBuilder(q);
  E(b,[0,0,0],[.39,.45,.14],MAT.GOLD,{u:28,v:38,pattern:(u,v,p)=>Math.abs(p[0]-.27)<.035?MAT.NAVY:Math.abs(Math.sin((p[0]+Math.abs(p[1])*.48)*36))<.16?MAT.BROWN:MAT.GOLD,shade:(u,v)=>scaleShade(u,v,10,9)});
  b.tube(t=>[.3+.3*t,.02+.08*t,0],t=>.115*(1-t)+.024,{u:20,v:14,material:MAT.GOLD});
  eye(b,[.286,-.11,.11],.034,{iris:MAT.INK});gill(b,.15,.38,.14);
  dorsal(b,[-.3,-.21,0],[.19,-.36,0],[-.25,-.57,0],{material:MAT.IVORY});
  dorsal(b,[-.3,.21,0],[.19,.36,0],[-.25,.57,0],{material:MAT.IVORY});
  const j=tailJoint(b,-.31,.18,2);fanTail(b,-.31,j,{length:.36,height:.25,material:MAT.GOLD});
  pectoral(b,.1,.04,.14,{size:.21,material:MAT.IVORY});
  E(b,[-.2,-.1,.134],[.073,.085,.012],MAT.NAVY,{u:10,v:14});
  b.tube(t=>[-.2+.073*Math.cos(t*TAU),-.1+.085*Math.sin(t*TAU),.139],.005,{u:24,v:4,material:MAT.IVORY});
  return b.finish();
}

function triggerfish(seed,q){
  const b=new ModelBuilder(q);
  // A deep, angular diamond section, with a blunt pointed head and pinched peduncle.
  b.surface((u,v)=>{
    const x=-.61+1.19*u,a=v*TAU,r=Math.sin(Math.PI*u)**.9;
    const angular=Math.sign(Math.sin(a))*Math.abs(Math.sin(a))**.52;
    return[x,.36*r*angular,.19*r*Math.cos(a)];
  },{u:36,v:36,material:(u,v,p)=>Math.abs(p[0]+p[1]*.65-.19)<.044?MAT.NAVY:spot(u,v,9,10)<.035?MAT.IVORY:MAT.CYAN,shade:(u,v)=>scaleShade(u,v,12,10)});
  E(b,[.565,.015,0],[.055,.045,.06],MAT.SAND,{u:9,v:13});
  eye(b,[.32,-.16,.14],.043,{iris:MAT.GOLD});gill(b,.24,.28,.18);
  L(b,[.535,.025,.042],[.603,.025,.034],.004,MAT.NAVY,{u:8,v:4});
  dorsal(b,[.04,-.32,0],[.25,-.24,0],[.12,-.65,0],{material:MAT.NAVY,u:20,v:14});
  dorsal(b,[-.45,-.22,0],[-.02,-.34,0],[-.35,-.57,0],{material:MAT.CYAN});
  dorsal(b,[-.45,.22,0],[.09,.32,0],[-.32,.58,0],{material:MAT.CYAN});
  const j=tailJoint(b,-.52,.23,2.5);forkTail(b,-.52,j,{length:.36,height:.29,material:MAT.CYAN,round:true});
  pectoral(b,.17,.09,.18,{size:.2,material:MAT.GOLD});
  return b.finish();
}

function parrotfish(seed,q){
  const b=new ModelBuilder(q);
  body(b,{length:1.38,height:.33,depth:.24,shape:.53,material:MAT.GREEN,scaleColumns:10});
  E(b,[.5,-.025,.01],[.27,.29,.22],MAT.CYAN,{u:21,v:30,pattern:(u,v,p)=>Math.abs(Math.sin(p[1]*32+Math.sin(p[0]*17)*.8))<.16?MAT.IVORY:MAT.CYAN});
  E(b,[.734,.06,.02],[.075,.088,.115],MAT.IVORY,{u:13,v:18});
  L(b,[.69,.065,.105],[.79,.065,.1],.007,MAT.NAVY,{u:8});
  eye(b,[.53,-.13,.21],.041,{iris:MAT.GOLD});gill(b,.28,.3,.24);
  E(b,[.665,-.064,.17],[.013,.01,.007],MAT.NAVY,{u:6,v:8});
  lateralLine(b,{length:1.38,height:.33,depth:.24,shape:.53,material:MAT.GOLD});
  dorsal(b,[-.49,-.2,0],[.36,-.27,0],[-.24,-.47,0],{material:MAT.CORAL,u:34});
  dorsal(b,[-.48,.18,0],[.16,.3,0],[-.33,.44,0],{material:MAT.CYAN,u:28});
  const j=tailJoint(b,-.59,.24,2);forkTail(b,-.59,j,{height:.34,length:.36,material:MAT.CYAN,round:true});
  pectoral(b,.23,.1,.23,{size:.32,material:MAT.CORAL});
  return b.finish();
}

function discus(seed,q){
  const b=new ModelBuilder(q);
  E(b,[0,0,0],[.43,.51,.135],MAT.CORAL,{u:32,v:42,pattern:(u,v,p)=>Math.cos(p[0]*43)>.87?MAT.NAVY:Math.abs(Math.sin(p[1]*36+Math.sin(p[0]*23)*.9))<.22?MAT.IVORY:MAT.CORAL,shade:(u,v)=>scaleShade(u,v,13,11)});
  E(b,[.421,.025,0],[.047,.049,.044],MAT.GOLD,{u:8,v:12});
  eye(b,[.29,-.1,.109],.036,{iris:MAT.CORAL});gill(b,.18,.43,.135);
  for(const s of [-1,1])b.surface((u,v)=>{
    const a=Math.PI*.08+u*Math.PI*.79,r=1+v*.22;
    return[-.02+.42*Math.cos(a)*r,s*.5*Math.sin(a)*r,.016*Math.sin(v*Math.PI)];
  },{u:30,v:11,material:(u,v)=>v>.91?MAT.IVORY:MAT.CYAN,shade:(u,v)=>rayShade(v,u,18),twoSided:true});
  const j=tailJoint(b,-.34,.15,1.8);fanTail(b,-.34,j,{length:.29,height:.25,material:MAT.CORAL});
  pectoral(b,.19,.08,.13,{size:.22,material:MAT.IVORY});
  for(const z of [-.06,.06])b.tube(t=>[.12-.22*t,.38+.37*t,z],t=>.012*(1-t)+.003,{u:23,v:5,material:MAT.CYAN});
  return b.finish();
}

function guppy(seed,q){
  const b=new ModelBuilder(q);
  body(b,{length:.9,height:.145,depth:.11,center:.2,shape:.67,material:MAT.CYAN,scaleColumns:9,pattern:(u,v)=>u<.53&&spot(u,v,5,7)<.065?MAT.NAVY:MAT.CYAN});
  E(b,[.58,-.014,0],[.12,.105,.09],MAT.GOLD,{u:13,v:20});
  eye(b,[.605,-.034,.083],.027,{iris:MAT.INK});gill(b,.47,.13,.11);
  const j=tailJoint(b,-.2,.27,3);fanTail(b,-.2,j,{length:.74,height:.57,material:MAT.CORAL,lobes:8,spotted:true});
  dorsal(b,[-.04,-.1,0],[.3,-.13,0],[-.27,-.47,0],{material:MAT.CORAL,u:25,v:21});
  pectoral(b,.39,.07,.1,{size:.18,material:MAT.IVORY});
  dorsal(b,[.04,.11,0],[.19,.13,0],[-.12,.33,0],{material:MAT.CYAN,u:17,v:13});
  return b.finish();
}

function neonTetra(seed,q){
  const b=new ModelBuilder(q);
  body(b,{length:1.38,height:.22,depth:.13,material:MAT.CYAN,pattern:(u,v,p)=>p[1]>.025&&u<.65?MAT.CORAL:MAT.CYAN});
  E(b,[.59,-.018,0],[.13,.14,.12],MAT.CYAN,{u:14,v:22});
  eye(b,[.6,-.03,.112],.037,{iris:MAT.GOLD});gill(b,.42,.19,.13);
  b.tube(t=>[-.52+1.12*t,-.005,.135*Math.sin(Math.PI*(.08+.84*t))],.014,{u:34,v:5,material:MAT.IVORY});
  lateralLine(b,{length:1.38,height:.22,depth:.13,material:MAT.WHITE});
  dorsal(b,[-.23,-.18,0],[.15,-.21,0],[-.18,-.45,0],{material:MAT.IVORY,u:22,v:16});
  dorsal(b,[-.47,.14,0],[.06,.2,0],[-.36,.37,0],{material:MAT.CORAL,u:24,v:15});
  dorsal(b,[-.5,-.1,0],[-.37,-.15,0],[-.48,-.23,0],{material:MAT.IVORY,u:10,v:8});
  const j=tailJoint(b,-.59,.26,3.1);forkTail(b,-.59,j,{length:.34,height:.29,material:MAT.IVORY});
  pectoral(b,.34,.08,.12,{size:.21,material:MAT.IVORY});
  return b.finish();
}

function zebrafish(seed,q){
  const b=new ModelBuilder(q);
  body(b,{length:1.6,height:.19,depth:.135,shape:.74,material:MAT.SAND,pattern:(u,v,p)=>Math.sin(p[1]*76)>0?MAT.NAVY:MAT.SAND});
  E(b,[.69,-.015,0],[.12,.12,.105],MAT.SAND,{u:13,v:20});
  eye(b,[.69,-.035,.1],.032,{iris:MAT.GOLD});gill(b,.49,.16,.13);
  lateralLine(b,{length:1.6,height:.19,depth:.135,shape:.74,material:MAT.IVORY});
  for(const s of [-1,1])b.tube(t=>[.78+.09*t,.025+.07*t,s*(.03+.08*t)],.004,{u:12,v:4,material:MAT.SAND});
  dorsal(b,[-.45,-.12,0],[.02,-.19,0],[-.3,-.39,0],{material:MAT.IVORY});
  dorsal(b,[-.44,.13,0],[.13,.18,0],[-.35,.36,0],{material:MAT.IVORY});
  const j=tailJoint(b,-.68,.27,3);forkTail(b,-.68,j,{length:.33,height:.29,material:MAT.IVORY});
  pectoral(b,.35,.08,.12,{size:.23,material:MAT.IVORY});
  return b.finish();
}

function flyingGurnard(seed,q){
  const b=new ModelBuilder(q);
  body(b,{length:1.45,height:.17,depth:.2,shape:.72,material:MAT.RUST,scaleColumns:11});
  E(b,[.48,0,.02],[.3,.23,.23],MAT.SAND,{u:22,v:30,shade:(u,v)=>Math.abs(Math.sin(v*TAU*5+u*3))<.17?.66:.96});
  eye(b,[.54,-.13,.2],.041,{iris:MAT.GOLD,mirror:false});eye(b,[.54,.13,.2],.041,{iris:MAT.GOLD,mirror:false});
  for(const s of [-1,1]){
    const j=b.joint({pivot:[.26,s*.12,0],axis:[1,0,0],amplitude:s*.09,speed:1.2});
    b.surface((u,v)=>{
      const a=-.12+v*1.37,r=.95*u*(.9+.1*Math.sin(v*Math.PI));
      return[.27-r*Math.sin(a),s*(.12+r*Math.cos(a)),.035+.09*Math.sin(u*Math.PI)*Math.sin(v*Math.PI)];
    },{u:31,v:29,material:(u,v)=>u>.94?MAT.IVORY:u>.86?MAT.CYAN:u>.25&&spot(u,v,6,10)<.055?MAT.IVORY:MAT.SLATE,shade:(u,v)=>rayShade(u,v,12),joint:j,twoSided:true});
    for(let i=0;i<13;i++){
      const a=-.12+i/12*1.37;
      L(b,[.27,s*.12,.045],[.27-.94*Math.sin(a),s*(.12+.94*Math.cos(a)),.045],.005,MAT.CYAN,{joint:j,u:26,v:4});
    }
    for(let i=0;i<3;i++)L(b,[.23,s*.17,.02],[.03-i*.12,s*(.38+i*.09),.02],.013,MAT.SAND,{u:18});
    b.tube(t=>[.34-.06*Math.sin(t*Math.PI),s*(.08+.13*t),.22-.035*t],.007,{u:17,v:4,material:MAT.BROWN});
  }
  const j=tailJoint(b,-.65,.22,1.7);forkTail(b,-.65,j,{length:.32,height:.24,material:MAT.RUST});
  dorsal(b,[-.36,-.04,.16],[.26,-.04,.18],[-.12,-.03,.46],{material:MAT.RUST});
  return b.finish();
}

function cowfish(seed,q){
  const b=new ModelBuilder(q);
  // Squared, rounded carapace: a superellipsoid instead of an ordinary fish body.
  const power=(x,p)=>Math.sign(x)*Math.abs(x)**p;
  b.surface((u,v)=>{
    const lat=(u-.5)*Math.PI,a=v*TAU,c=power(Math.cos(lat),.42);
    return[power(Math.sin(lat),.62)*.55,.27*c*power(Math.sin(a),.42),.25*c*power(Math.cos(a),.42)];
  },{u:33,v:38,material:(u,v)=>spot(u,v,8,9)<.045?MAT.NAVY:MAT.GOLD,shade:(u,v)=>{const row=Math.floor(v*9),x=Math.abs(fract(u*8+(row%2)*.5)-.5),y=Math.abs(fract(v*9)-.5);return Math.max(x*.866+y*.5,y)>.38?.67:.98;}});
  E(b,[.53,.08,0],[.08,.055,.07],MAT.GOLD,{u:10,v:16});
  eye(b,[.4,-.14,.23],.045,{iris:MAT.CYAN});
  gill(b,.2,.19,.27);
  L(b,[.55,.09,.054],[.596,.09,.031],.004,MAT.NAVY,{u:8,v:4});
  for(const s of [-1,1]){
    b.tube(t=>[.36+.27*t,-.2-.32*t,s*(.15+.05*t)],t=>.048*(1-t)+.002,{u:20,v:9,material:MAT.SAND,shade:(u,v)=>.74+.26*u});
    b.tube(t=>[-.39-.22*t,.18+.2*t,s*.15],t=>.038*(1-t)+.002,{u:18,v:8,material:MAT.SAND,shade:(u,v)=>.74+.26*u});
  }
  const j=tailJoint(b,-.49,.28,2.2);fanTail(b,-.49,j,{length:.42,height:.25,material:MAT.CYAN});
  pectoral(b,.18,.04,.25,{size:.27,material:MAT.IVORY});
  dorsal(b,[-.36,-.22,0],[-.1,-.27,0],[-.4,-.48,0],{material:MAT.IVORY,u:20,v:15});
  return b.finish();
}

function pipefish(seed,q){
  const b=new ModelBuilder(q);
  b.tube(t=>[-1.05+1.56*t,.025*Math.sin(t*Math.PI*2),0],t=>.025+.045*Math.sin(t*Math.PI*.8),{u:60,v:20,material:MAT.SAND,shade:(u,v)=>Math.abs(Math.sin(v*TAU*3))<.15?.68:.98});
  for(let i=0;i<16;i++){
    const x=-.95+i*.088,r=.026+.045*Math.sin((x+1.05)/1.56*Math.PI*.8),y=.025*Math.sin((x+1.05)/1.56*TAU);
    b.tube(t=>[x,y+r*Math.cos(t*TAU),r*Math.sin(t*TAU)],.005,{u:15,v:4,material:MAT.BROWN});
  }
  for(let k=0;k<4;k++){
    const a=k*TAU/4;
    b.tube(t=>{const r=.027+.045*Math.sin(t*Math.PI*.8);return[-1.05+1.56*t,.025*Math.sin(t*TAU)+r*Math.cos(a),r*Math.sin(a)];},.003,{u:38,v:4,material:MAT.IVORY});
  }
  E(b,[.51,-.025,0],[.14,.1,.075],MAT.SAND,{u:15,v:22,shade:(u,v)=>Math.abs(Math.sin(v*TAU*3+u*2))<.17?.72:.97});
  eye(b,[.55,-.06,.071],.026,{iris:MAT.GOLD});
  b.tube(t=>[.6+.53*t,-.015+.012*t,0],t=>.037-.017*t,{u:30,v:10,material:MAT.SAND});
  L(b,[.64,-.013,.036],[1.11,-.003,.021],.003,MAT.IVORY,{u:25,v:4});
  E(b,[1.122,-.003,.014],[.012,.013,.008],MAT.NAVY,{u:6,v:8});
  const j=tailJoint(b,-.99,.24,1.8);fanTail(b,-.99,j,{length:.2,height:.13,material:MAT.IVORY});
  dorsal(b,[-.55,-.045,0],[.05,-.065,0],[-.38,-.21,0],{material:MAT.IVORY,u:28,v:12});
  pectoral(b,.4,.025,.06,{size:.14,material:MAT.IVORY});
  return b.finish();
}

function sawfish(seed,q){
  const b=new ModelBuilder(q);
  body(b,{length:1.57,height:.21,depth:.115,center:-.34,shape:.75,material:MAT.SLATE,scales:false});
  E(b,[.36,0,.005],[.36,.29,.115],MAT.SLATE,{u:21,v:30,shade:(u,v)=>.88+.12*Math.sin(u*Math.PI)});
  b.tube(t=>[.57+1.01*t,0,.015],t=>.087-.045*t,{u:38,v:12,material:MAT.SAND});
  for(const s of [-1,1]){
    for(let i=0;i<12;i++){
      const x=.65+i*.076,y=s*(.078-i*.0026);
      b.tube(t=>[x-.024*t,y+s*.11*t,.017],t=>.022*(1-t)+.001,{u:8,v:6,material:MAT.IVORY});
    }
    eye(b,[.4,s*.17,.109],.035,{iris:MAT.GOLD,mirror:false});
    E(b,[.27,s*.15,.112],[.052,.026,.012],MAT.NAVY,{u:8,v:12});
    b.tube(t=>{const r=.087-.045*t,y=s*.027;return[.57+1.01*t,y,.018+Math.sqrt(Math.max(0,r*r-y*y))];},.004,{u:30,v:4,material:MAT.BROWN});
    dorsal(b,[.21,s*.18,0],[-.45,s*.17,0],[-.15,s*.68,-.025],{material:MAT.SLATE,u:26,v:20});
    dorsal(b,[-.52,s*.1,0],[-.85,s*.09,0],[-.79,s*.31,-.035],{material:MAT.SLATE,u:19,v:15});
  }
  dorsal(b,[-.76,0,.07],[-.47,0,.12],[-.7,0,.4],{material:MAT.SLATE});
  const j=tailJoint(b,-1.02,.18,1.5);forkTail(b,-1.02,j,{length:.42,height:.3,material:MAT.SLATE});
  return b.finish();
}

function guitarfish(seed,q){
  const b=new ModelBuilder(q);
  body(b,{length:1.72,height:.18,depth:.12,center:-.21,shape:.72,material:MAT.BROWN,scales:false});
  // Broad pectoral disc tapers continuously to a pointed snout; tail remains sharklike.
  for(const s of [-1,1])b.surface((u,v)=>{
    const root=lerp3([.73,0,.02],[-.53,0,0],u),w=.61*Math.sin(Math.PI*u)**1.35;
    return[root[0],s*w*v,.095*(1-v*v)*Math.sin(u*Math.PI)-.027*v];
  },{u:38,v:24,material:(u,v)=>u>.17&&u<.86&&v>.23&&spot(u,v,6,6)<.052?MAT.BROWN:v>.94?MAT.IVORY:MAT.SAND,shade:(u,v)=>.84+.16*Math.cos(v*Math.PI/2),twoSided:true});
  E(b,[.3,0,.045],[.35,.17,.095],MAT.SAND,{u:20,v:28,shade:(u,v)=>Math.abs(Math.sin(v*TAU*3))<.13?.75:.97});
  for(const s of [-1,1]){
    eye(b,[.33,s*.11,.13],.037,{iris:MAT.GOLD,mirror:false});
    E(b,[.17,s*.1,.135],[.05,.028,.01],MAT.NAVY,{u:8,v:12});
    b.tube(t=>{const u=.19+.57*t,v=.46,w=.61*Math.sin(Math.PI*u)**1.35;return[.73-1.26*u,s*w*v,.095*(1-v*v)*Math.sin(u*Math.PI)-.027*v+.005];},.004,{u:28,v:4,material:MAT.IVORY});
    dorsal(b,[-.46,s*.09,0],[-.75,s*.07,0],[-.67,s*.28,-.025],{material:MAT.BROWN,u:20,v:15});
  }
  b.tube(t=>[-.83+.91*t,0,.12*Math.sin(Math.PI*(.14+.63*t))**.72+.003],.004,{u:25,v:4,material:MAT.SAND});
  dorsal(b,[-.69,0,.08],[-.39,0,.11],[-.61,0,.39],{material:MAT.BROWN});
  dorsal(b,[-.96,0,.045],[-.76,0,.07],[-.92,0,.25],{material:MAT.BROWN,u:17,v:13});
  const j=tailJoint(b,-1,.18,1.6);forkTail(b,-1,j,{length:.37,height:.28,material:MAT.BROWN});
  return b.finish();
}

export const REEF_FISH_MODELS=[
  {id:'moorish-idol',name:'Moorish idol',category:'Reef',orientation:[.06,-.22,0],minSize:.11,build:moorishIdol},
  {id:'lionhead-goldfish',name:'Lionhead goldfish',category:'Reef',orientation:[.1,-.2,-.04],minSize:.11,build:goldfish},
  {id:'koi',name:'Koi',category:'Reef',orientation:[.14,-.25,-.06],minSize:.11,build:koi},
  {id:'butterflyfish',name:'Butterflyfish',category:'Reef',orientation:[.05,-.2,0],minSize:.1,build:butterflyfish},
  {id:'triggerfish',name:'Triggerfish',category:'Reef',orientation:[.08,-.23,0],minSize:.11,build:triggerfish},
  {id:'parrotfish',name:'Parrotfish',category:'Reef',orientation:[.08,-.23,-.03],minSize:.11,build:parrotfish},
  {id:'discus',name:'Discus',category:'Reef',orientation:[.05,-.18,0],minSize:.11,build:discus},
  {id:'guppy',name:'Guppy',category:'Reef',orientation:[.05,-.18,-.05],minSize:.11,build:guppy},
  {id:'neon-tetra',name:'Neon tetra',category:'Reef',orientation:[.1,-.2,0],minSize:.1,build:neonTetra},
  {id:'zebrafish',name:'Zebrafish',category:'Reef',orientation:[.09,-.2,-.03],minSize:.1,build:zebrafish},
  {id:'flying-gurnard',name:'Flying gurnard',category:'Reef',orientation:[.16,-.15,-.28],minSize:.13,build:flyingGurnard},
  {id:'longhorn-cowfish',name:'Longhorn cowfish',category:'Reef',orientation:[.1,-.24,-.03],minSize:.12,build:cowfish},
  {id:'pipefish',name:'Pipefish',category:'Reef',orientation:[.1,-.2,-.08],minSize:.13,build:pipefish},
  {id:'sawfish',name:'Sawfish',category:'Reef',orientation:[.15,-.13,-.25],minSize:.13,build:sawfish},
  {id:'guitarfish',name:'Guitarfish',category:'Reef',orientation:[.17,-.13,-.25],minSize:.13,build:guitarfish}
];
