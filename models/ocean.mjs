// Twelve original, surface-sampled marine studies. No imported meshes or images.
import {ModelBuilder, MAT, TAU} from './geometry.mjs';

const M=MAT;
// Fine surface engraving uses a single sampled stroke, not another solid tube.
function etch(b,path,{u=64,material=M.IVORY,shade=.94,joint=0}={}){
  const steps=Math.max(12,Math.round(u*b.quality));
  for(let i=0;i<=steps;i++){const p=path(i/steps);if(p)b.point(p,[0,0,1],material,shade,joint,1);}
}
function lateralEyes(b,center,radius,options={}){
  const start=b.data.length;b.eye(center,radius,options);const end=b.data.length;
  for(let i=start;i<end;i+=10)b.point([b.data[i],b.data[i+1],-b.data[i+2]],[b.data[i+3],b.data[i+4],-b.data[i+5]],...b.data.slice(i+6,i+10));
}
function fishBody(b,{x=-.65,length=1.5,ry=.27,rz=.22,material=M.SLATE,belly=M.IVORY,u=54,v=44,shape=.68}={}) {
  b.surface((s,t)=>{const r=Math.pow(Math.sin(Math.PI*s),shape),a=t*TAU;return[x+length*s,ry*r*Math.sin(a),rz*r*Math.cos(a)];},
    {u,v,material:(s,t,p)=>p[1]>.07?belly:material,shade:(s,t)=>.91+.09*Math.cos(s*46+Math.sin(t*TAU)*2)**2});
}
function gills(b,x,y,z,count=5) {for(let k=0;k<count;k++) b.tube(t=>[x-k*.045-.035*Math.sin(t*Math.PI),y+t*.20,z+.018*Math.sin(t*Math.PI)],.006,{u:13,v:4,material:M.INK});}
function verticalTail(b,x,joint,material=M.SLATE,{height=.47,lower=.32}={}) {
  b.fin([x+.13,-.075,0],[x+.08,.08,0],[x-.34,-height,.025],{material,joint,u:22,v:16,curve:.045});
  b.fin([x+.13,-.075,0],[x+.08,.08,0],[x-.27,lower,.015],{material,joint,u:20,v:14,curve:-.025});
}
function flukes(b,x,joint,material=M.SLATE,width=.48) {
  for(const s of [-1,1]) b.surface((u,v)=>[x-.32*u+.15*Math.sin(Math.PI*u)*v,.025*Math.sin(Math.PI*u),s*width*u*(1-.28*v)],{u:24,v:16,joint,material,twoSided:true});
}

function turtle(seed,quality,leather=false) {
  const b=new ModelBuilder(quality),skin=leather?M.SLATE:M.GREEN;
  const long=leather?.72:.60,wide=leather?.40:.48;
  b.ellipsoid([0,0,-.055],[wide,long,.17],{material:leather?M.SAND:M.IVORY,u:26,v:44});
  b.ellipsoid([0,0,.035],[wide,long,.30],{u:38,v:64,pattern:(u,v,p)=>{
    if(leather) return Math.sin(v*TAU*19+u*79)>.965?M.IVORY:M.NAVY;
    const seams=Math.abs(Math.sin((p[0]/wide)*8+(Math.round(p[1]*6)%2)*1.5))<.10||Math.abs(Math.sin(p[1]*15))<.12;
    return seams?M.BROWN:Math.abs(p[0])<.16?M.GOLD:M.GREEN;
  }});
  const shellZ=(x,y)=>.035+.30*Math.sqrt(Math.max(.001,1-x*x/(wide*wide)-y*y/(long*long)))+.009;
  etch(b,t=>{const a=t*TAU,x=wide*.975*Math.cos(a),y=long*.975*Math.sin(a);return[x,y,shellZ(x,y)];},{u:150,material:M.SAND});
  if(!leather){
    // Five central scutes and paired lateral plates follow the domed shell.
    for(let row=-2;row<=2;row++)for(const side of [-1,0,1]){
      const cy=row*.205,cx=side*(.27-Math.abs(row)*.028),rx=side?.12:.14,ry=.13;
      etch(b,t=>{const segment=t*6,k=Math.min(5,Math.floor(segment)),f=segment-k,a=k*TAU/6,c=(k+1)*TAU/6;
        const x=cx+rx*(Math.cos(a)*(1-f)+Math.cos(c)*f),y=cy+ry*(Math.sin(a)*(1-f)+Math.sin(c)*f);return x*x/(wide*wide)+y*y/(long*long)>.96?null:[x,y,shellZ(x,y)];},{u:54,material:M.BROWN,shade:.76});
    }
  }
  // A leatherback's long ridges replace the green turtle's plate mosaic.
  if(leather) for(let k=-3;k<=3;k++){
    const x=k*.105;
    b.tube(t=>{const y=(t*2-1)*long*.91,z=.035+.30*Math.sqrt(Math.max(.005,1-x*x/(wide*wide)-y*y/(long*long)));return[x,y,z+.008];},.013,{u:36,v:5,material:M.SLATE});
  }
  b.ellipsoid([0,-long-.12,.01],[.15,.26,.13],{material:skin,u:24,v:26});
  b.ellipsoid([0,-long-.32,.025],[.13,.12,.105],{material:skin,u:16,v:24});
  b.eye([-.085,-long-.30,.105],.026,{iris:M.GOLD});b.eye([.085,-long-.30,.105],.026,{iris:M.GOLD});
  etch(b,t=>[(t-.5)*.17,-long-.36+.025*Math.sin(t*Math.PI),.092],{u:28,material:M.BROWN});
  for(const side of [-1,1]) {
    const front=b.joint({pivot:[side*wide*.65,-.3,0],axis:[0,1,.3],amplitude:.17,speed:1.4,phase:side*.3});
    b.surface((u,v)=>{const sweep=Math.sin(v*Math.PI);return[side*(wide*.7+u*(leather?.63:.55)), -.30+u*.45+(v-.5)*(.32*(1-u)+.025),-.02+Math.sin(u*Math.PI)*.10*sweep];},{u:30,v:22,material:skin,joint:front,twoSided:true,shade:(u,v)=>.78+.22*Math.abs(Math.sin(v*Math.PI*7+u*2))});
    for(const v of [.18,.38,.60,.82])etch(b,u=>[side*(wide*.7+u*(leather?.63:.55)),-.30+u*.45+(v-.5)*(.32*(1-u)+.025),-.012+Math.sin(u*Math.PI)*.10*Math.sin(v*Math.PI)],{u:40,joint:front,material:M.SAND,shade:.82});
    const rear=b.joint({pivot:[side*.25,.43,-.03],axis:[0,1,0],amplitude:.12,speed:1.4,phase:2+side});
    b.fin([side*.22,.3,-.03],[side*.34,.52,-.03],[side*.59,.75,-.08],{material:skin,joint:rear,u:23,v:16});
  }
  b.tube(t=>[0,long-.05+t*.25,-.04],t=>.05*(1-t)+.004,{material:skin,u:14,v:8});
  return b.finish();
}

function jelly(seed,quality,nettle=false) {
  const b=new ModelBuilder(quality),bell=nettle?M.GOLD:M.CYAN;
  b.surface((u,v)=>{const a=u*Math.PI*.5,theta=v*TAU,r=(nettle?.48:.58)*Math.sin(a);return[r*Math.cos(theta),-.56+(nettle?.42:.28)*(1-Math.cos(a)),r*Math.sin(theta)];},
    {u:32,v:64,material:(u,v)=>nettle&&Math.cos(v*TAU*16)>.68?M.RUST:bell,twoSided:true,shade:(u,v)=>.73+.18*Math.cos(v*TAU*16)**2+.06*Math.sin(u*Math.PI)});
  for(let k=0;k<16;k++)etch(b,t=>{const a=t*Math.PI*.5,theta=k*TAU/16,r=(nettle?.485:.585)*Math.sin(a);return[r*Math.cos(theta),-.568+(nettle?.42:.28)*(1-Math.cos(a)),r*Math.sin(theta)];},{u:52,material:k%2?bell:M.IVORY,shade:.94});
  // The scalloped rim is a separate curved surface, so it survives a side view.
  b.tube(t=>{const a=t*TAU,r=nettle?.48:.58;return[r*Math.cos(a),nettle?-.14:-.28+.012*Math.sin(a*24),r*Math.sin(a)];},.012,{u:100,v:5,material:bell});
  if(!nettle) for(let k=0;k<4;k++){
    const a=k*TAU/4;
    b.tube(t=>{const q=t*TAU;return[.17*Math.cos(a)+.08*Math.cos(q),-.40+.018*Math.sin(q),.17*Math.sin(a)+.08*Math.sin(q)];},.018,{u:28,v:6,material:M.CORAL});
  }
  const count=nettle?18:24;
  for(let k=0;k<count;k++){
    const a=k*TAU/count,r=nettle?.45:.54,length=nettle?.92+.27*Math.sin(k*2.3):.30+.14*Math.sin(k*2.1);
    const joint=b.joint({pivot:[r*Math.cos(a),-.2,r*Math.sin(a)],axis:[Math.sin(a),0,Math.cos(a)],amplitude:.07,speed:.8,phase:k*.8});
    b.tube(t=>[r*Math.cos(a)+.065*Math.sin(t*8+k)*t,(nettle?-.14:-.28)+t*length,r*Math.sin(a)+.07*Math.cos(t*9+k)*t],t=>(nettle?.009:.006)*(1-t*.8),{u:30,v:5,material:nettle?M.CORAL:M.IVORY,joint});
  }
  for(let k=0;k<4;k++){
    const a=k*TAU/4,joint=b.joint({pivot:[0,-.25,0],axis:[1,0,0],amplitude:.1,speed:.65,phase:k});
    b.surface((u,v)=>{const r=.08+u*.14+.035*Math.sin(u*16+k),w=(v-.5)*.10*(1-u*.7);return[r*Math.cos(a)+w*Math.cos(u*18),-.25+u*(nettle?.9:.7),r*Math.sin(a)+w*Math.sin(u*18)];},{u:38,v:10,material:nettle?M.CORAL:M.IVORY,joint,twoSided:true,shade:(u,v)=>.70+.30*Math.abs(Math.cos(u*42+v*3))});
  }
  return b.finish();
}

function shark(seed,quality,hammer=false) {
  const b=new ModelBuilder(quality);
  fishBody(b,{x:-.73,length:1.56,ry:hammer?.19:.27,rz:hammer?.17:.23,shape:.72});
  b.fin([-.27,-.17,0],[.20,-.20,0],[-.05,-.64,.01],{material:M.SLATE,u:28,v:20,curve:.02});
  for(const side of [-1,1]) b.fin([.25,.06,side*.13],[-.12,.18,side*.14],[-.36,.37,side*.57],{material:M.SLATE,u:25,v:17,curve:side*.025});
  b.fin([-.49,-.10,0],[-.32,-.14,0],[-.42,-.28,0],{material:M.SLATE,u:15,v:10});
  for(const side of [-1,1])b.fin([-.27,.12,side*.08],[-.47,.09,side*.07],[-.48,.27,side*.25],{material:M.IVORY,u:16,v:10});
  const joint=b.joint({pivot:[-.55,0,0],axis:[0,1,0],amplitude:.19,speed:1.7});
  b.tube(t=>[-.58-t*.3,0,0],t=>.07-.035*t,{material:M.SLATE,joint,u:20,v:10});
  verticalTail(b,-.85,joint,M.SLATE,{height:hammer?.48:.48,lower:hammer?.26:.37});
  if(hammer){
    b.ellipsoid([.68,-.01,0],[.17,.09,.46],{material:M.SLATE,u:22,v:44});
    for(const side of [-1,1]) b.ellipsoid([.71,-.01,side*.40],[.15,.10,.10],{material:M.SLATE,u:16,v:20});
    lateralEyes(b,[.77,-.035,.46],.024,{iris:M.SAND});
  }else{
    b.eye([.58,-.075,.158],.025,{iris:M.INK});
    b.tube(t=>[.48+t*.27,.10+.025*Math.sin(t*Math.PI),.17-.13*t],.006,{material:M.INK,u:25,v:4});
  }
  gills(b,.34,-.08,hammer?.155:.215);
  etch(b,t=>{const s=.18+t*.64,r=Math.sin(Math.PI*s)**.72;return[-.73+1.56*s,-.015,(hammer?.17:.23)*r+.006];},{u:90,material:M.CYAN,shade:.84});
  if(hammer)etch(b,t=>[.64+t*.20,.065+.015*Math.sin(t*Math.PI),.14-.08*t],{u:32,material:M.INK});
  return b.finish();
}

function manta(seed,quality) {
  const b=new ModelBuilder(quality);
  b.ellipsoid([0,0,0],[.24,.50,.105],{material:M.NAVY,u:32,v:38});
  for(const side of [-1,1]) {
    const joint=b.joint({pivot:[side*.12,0,0],axis:[0,1,0],amplitude:.16,speed:1.1,phase:side*.1});
    b.surface((u,v)=>{
      const span=u,leading=-.42+.31*u+.28*u*u,trailing=.45-.05*u-.37*u*u;
      return[side*(.12+.94*u),leading+(trailing-leading)*v, .12*Math.sin(u*Math.PI)-.07*u+.035*Math.sin(v*Math.PI)];
    },{u:42,v:34,joint,material:(u,v)=>v>.88?M.IVORY:M.NAVY,twoSided:true,shade:(u,v)=>.80+.20*Math.cos(v*Math.PI*10+u*.5)**2});
    for(let k=1;k<8;k++)etch(b,u=>{const v=k/8,leading=-.42+.31*u+.28*u*u,trailing=.45-.05*u-.37*u*u;return[side*(.12+.94*u),leading+(trailing-leading)*v,.128*Math.sin(u*Math.PI)-.07*u+.035*Math.sin(v*Math.PI)+.005];},{u:50,material:M.SLATE,joint,shade:.96});
    b.tube(t=>[side*(.12+.055*Math.sin(t*Math.PI)),-.42-t*.22,.015+.08*Math.sin(t*Math.PI)],t=>.035*(1-t*.45),{u:25,v:8,material:M.NAVY});
  }
  b.eye([-.17,-.35,.085],.021,{iris:M.SLATE});b.eye([.17,-.35,.085],.021,{iris:M.SLATE});
  for(const side of [-1,1])etch(b,t=>[side*(.12+.035*Math.cos(t*TAU)),-.20+.065*Math.sin(t*TAU),.105],{u:36,material:M.INK});
  const tail=b.joint({pivot:[0,.4,0],axis:[0,0,1],amplitude:.1,speed:1.1,phase:1});
  b.tube(t=>[.055*Math.sin(t*4),.4+t*.95,-.025-t*.04],t=>.026*(1-t)+.004,{u:44,v:7,material:M.NAVY,joint:tail});
  return b.finish();
}

function cetacean(seed,quality,whale=false) {
  const b=new ModelBuilder(quality),dark=whale?M.NAVY:M.SLATE;
  fishBody(b,{x:-.75,length:whale?1.65:1.47,ry:whale?.32:.23,rz:whale?.27:.19,material:dark,shape:whale?.48:.68,u:60,v:48});
  if(!whale){
    b.ellipsoid([.66,-.015,0],[.22,.15,.15],{material:M.SLATE,u:22,v:30});
    b.ellipsoid([.87,.055,0],[.23,.065,.073],{material:M.SLATE,u:18,v:26});
    b.tube(t=>[.70+t*.36,.069,.068-.02*t],.005,{material:M.INK,u:18,v:4});
  }else{
    b.ellipsoid([.68,.06,0],[.30,.24,.26],{material:M.NAVY,u:25,v:36});
    for(let k=0;k<7;k++) b.tube(t=>[.75-t*.65,.20+.085*Math.sin(t*Math.PI),.08+k*.023],.006,{material:M.SAND,u:27,v:4});
    for(let k=0;k<5;k++) b.ellipsoid([.56+k*.07,-.12+.03*Math.sin(k),.20],[.025,.021,.025],{material:M.SLATE,u:6,v:8});
  }
  b.eye([whale?.62:.68,whale?.01:-.02,whale?.245:.137],.022,{iris:M.INK});
  b.fin([-.29,-.16,0],[.04,-.20,0],[-.09,whale?-.42:-.48,0],{material:dark,u:25,v:16,curve:.03});
  for(const side of [-1,1]){
    const joint=b.joint({pivot:[.24,.12,side*.12],axis:[1,0,0],amplitude:.09,speed:1.0,phase:side});
    b.surface((u,v)=>[.23-u*(whale?.53:.38)+(v-.5)*.17*(1-u),.13+u*.22,side*(.13+u*(whale?.64:.36))],{u:30,v:15,joint,material:whale?M.IVORY:dark,twoSided:true});
  }
  const tail=b.joint({pivot:[-.55,0,0],axis:[0,0,1],amplitude:.13,speed:whale?.85:1.6});
  b.tube(t=>[-.60-t*.35,t*.02,0],t=>.09-t*.045,{material:dark,joint:tail,u:24,v:12});
  flukes(b,-.93,tail,dark,whale?.48:.37);
  return b.finish();
}

function octopus(seed,quality) {
  const b=new ModelBuilder(quality);
  b.ellipsoid([0,-.38,0],[.32,.44,.28],{u:34,v:44,pattern:(u,v)=>Math.sin(u*43+v*17)>.9?M.GOLD:M.CORAL,shade:(u,v)=>.80+.20*Math.cos(u*37+Math.sin(v*TAU)*9)**2});
  b.ellipsoid([0,-.03,.02],[.29,.18,.26],{material:M.CORAL,u:20,v:34});
  b.eye([-.17,-.08,.237],.052,{iris:M.GOLD});b.eye([.17,-.08,.237],.052,{iris:M.GOLD});
  for(let k=0;k<8;k++){
    const a=k*TAU/8,side=Math.cos(a),depth=Math.sin(a);
    const joint=b.joint({pivot:[side*.15,.04,depth*.15],axis:[depth,.15,-side],amplitude:.12,speed:.8,phase:k*.9});
    const path=t=>[side*(.15+.72*t)-.15*Math.sin(t*5+k)*t,.02+.55*t+.20*Math.sin(t*4.5+k*.35)*t,depth*(.16+.53*t)+.12*Math.cos(t*5+k)*t];
    b.tube(path,t=>.095*Math.pow(1-t,1.15)+.005,{u:48,v:13,material:M.CORAL,joint});
    for(let m=0;m<8;m++){
      const t=.12+m*.09,p=path(t),r=.024*(1-t*.7);
      b.ellipsoid([p[0],p[1]-.022,p[2]+.065*(1-t)],[r,r*.65,r*.5],{material:M.IVORY,joint,u:6,v:8});
      etch(b,q=>[p[0]+r*.64*Math.cos(q*TAU),p[1]-.022+r*.42*Math.sin(q*TAU),p[2]+.065*(1-t)+r*.53],{u:20,material:M.CORAL,joint,shade:.70});
    }
  }
  return b.finish();
}

function seahorse(seed,quality) {
  const b=new ModelBuilder(quality);
  b.ellipsoid([-.08,.03,0],[.23,.39,.14],{material:M.GOLD,rotation:-.22,u:32,v:38});
  b.tube(t=>[-.08+.17*Math.sin(t*Math.PI*.9),-.04-t*.53,0],t=>.13-.045*t,{material:M.GOLD,u:38,v:18,shade:(u,v)=>.76+.24*Math.cos(u*Math.PI*12)**2});
  b.ellipsoid([.15,-.54,.005],[.18,.15,.115],{material:M.GOLD,rotation:.28,u:24,v:30});
  b.tube(t=>[.22+t*.30,-.51+t*.07,.01],t=>.052-.016*t,{material:M.GOLD,u:25,v:13});
  lateralEyes(b,[.20,-.565,.107],.033,{iris:M.SAND});
  for(let k=0;k<5;k++) b.fin([-.04+k*.04,-.61,0],[.01+k*.04,-.62,0],[-.055+k*.045,-.79+.035*k,0],{material:M.GOLD,u:12,v:8});
  const joint=b.joint({pivot:[-.16,.27,0],axis:[0,0,1],amplitude:.07,speed:.75});
  b.tube(t=>{const a=t*6.2,r=.36*(1-t*.73);return[-.12-r*Math.sin(a),.39+t*.21+r*(1-Math.cos(a))*.5,0];},t=>.075*(1-t)+.007,{u:72,v:14,material:M.GOLD,joint,shade:(u,v)=>.70+.30*Math.cos(u*Math.PI*24)**2});
  for(let k=0;k<11;k++){
    const y=-.28+k*.052,r=.19*Math.sqrt(Math.max(.12,1-Math.pow((y-.03)/.39,2)));
    b.tube(t=>[-.08+r*Math.cos(t*Math.PI),y,.14*Math.sin(t*Math.PI)],.009,{material:M.BROWN,u:22,v:5});
  }
  const fin=b.joint({pivot:[-.27,-.04,0],axis:[0,1,0],amplitude:.22,speed:5});
  b.fin([-.25,-.18,0],[-.26,.15,0],[-.43,-.05,.01],{material:M.IVORY,joint:fin,u:23,v:16,shade:(u,v)=>.66+.34*Math.cos(v*Math.PI*8)**2});
  for(const side of [-1,1])etch(b,t=>{const y=-.24+t*.52;return[-.08+side*.12,y,.14*Math.sqrt(Math.max(.08,1-((y-.03)/.39)**2))+.007];},{u:65,material:M.SAND,shade:.9});
  return b.finish();
}

function nautilus(seed,quality) {
  const b=new ModelBuilder(quality);
  b.surface((u,v)=>{
    const a=u*TAU*1.75,rad=.065*Math.exp(a*.19),tube=rad*.48,q=v*TAU;
    return[(rad+tube*Math.cos(q))*Math.cos(a)-.13,(rad+tube*Math.cos(q))*Math.sin(a)-.07,tube*Math.sin(q)];
  },{u:115,v:40,material:(u,v)=>Math.sin(u*TAU*32+Math.sin(v*TAU)*.6)>.45?M.RUST:M.IVORY,twoSided:true,shade:(u,v)=>.85+.15*Math.cos(u*TAU*94+v*3)**2});
  for(const offset of [-.6,0,.6])etch(b,t=>{const a=t*TAU*1.75,rad=.065*Math.exp(a*.19),tube=rad*.48,q=Math.PI*.5+offset;return[(rad+tube*Math.cos(q))*Math.cos(a)-.13,(rad+tube*Math.cos(q))*Math.sin(a)-.07,tube*Math.sin(q)+.008];},{u:230,material:offset?M.SAND:M.IVORY,shade:.96});
  const end=TAU*1.75,rad=.065*Math.exp(end*.19),x=rad*Math.cos(end)-.13,y=rad*Math.sin(end)-.07;
  b.ellipsoid([x+.17,y+.11,.025],[.24,.16,.17],{material:M.CORAL,u:24,v:30});
  lateralEyes(b,[x+.26,y+.08,.17],.04,{iris:M.SAND});
  etch(b,t=>{const a=t*TAU;return[x+Math.cos(end)*rad*.48*Math.cos(a),y+Math.sin(end)*rad*.48*Math.cos(a),rad*.48*Math.sin(a)];},{u:78,material:M.SAND});
  b.surface((u,v)=>[x-.08+u*.39,y-.05-.08*Math.sin(u*Math.PI),(v-.5)*.33*(1-u*.3)],{u:23,v:15,material:M.RUST,twoSided:true});
  for(let k=0;k<18;k++){
    const a=k*TAU/18,joint=b.joint({pivot:[x+.28,y+.12,0],axis:[0,1,0],amplitude:.12,speed:1.0,phase:k*.6});
    b.tube(t=>[x+.27+t*.43,y+.12+Math.cos(a)*(.08+t*.23)+.07*Math.sin(t*7+k)*t,Math.sin(a)*(.08+t*.20)],t=>.012*(1-t)+.002,{u:29,v:5,material:M.IVORY,joint});
  }
  return b.finish();
}

export const OCEAN_MODELS=[
  {id:'green-sea-turtle',name:'Green sea turtle',category:'Ocean',orientation:[-.18,.18,.42],build:(s,q=1)=>turtle(s,q)},
  {id:'leatherback-turtle',name:'Leatherback turtle',category:'Ocean',orientation:[-.21,-.22,-.38],build:(s,q=1)=>turtle(s,q,true)},
  {id:'moon-jellyfish',name:'Moon jellyfish',category:'Ocean',orientation:[-.35,.12,.08],build:(s,q=1)=>jelly(s,q)},
  {id:'sea-nettle',name:'Sea nettle',category:'Ocean',orientation:[-.12,.18,-.08],build:(s,q=1)=>jelly(s,q,true)},
  {id:'great-white-shark',name:'Great white shark',category:'Ocean',orientation:[-.14,-.28,-.08],build:(s,q=1)=>shark(s,q)},
  {id:'hammerhead-shark',name:'Hammerhead shark',category:'Ocean',orientation:[-.40,-.22,-.11],build:(s,q=1)=>shark(s,q,true)},
  {id:'manta-ray',name:'Manta ray',category:'Ocean',orientation:[-.25,-.1,-.30],build:manta},
  {id:'bottlenose-dolphin',name:'Bottlenose dolphin',category:'Ocean',orientation:[-.14,-.25,-.15],build:(s,q=1)=>cetacean(s,q)},
  {id:'humpback-whale',name:'Humpback whale',category:'Ocean',orientation:[-.28,-.28,-.08],build:(s,q=1)=>cetacean(s,q,true)},
  {id:'octopus',name:'Octopus',category:'Ocean',orientation:[-.18,.15,.04],build:octopus},
  {id:'seahorse',name:'Seahorse',category:'Ocean',orientation:[-.08,-.18,.05],build:seahorse},
  {id:'nautilus',name:'Nautilus',category:'Ocean',orientation:[.10,.20,.08],build:nautilus},
];
