import {ModelBuilder, MAT, TAU, rng} from './geometry.mjs';

function bloom(seed,quality){
  const b=new ModelBuilder(quality),random=rng(seed),petals=7+Math.floor(random()*3);
  for(let layer=0;layer<3;layer++)for(let petal=0;petal<petals-layer;petal++){
    const angle=petal*TAU/(petals-layer)+layer*.39,s=1-layer*.25;
    b.surface((u,v)=>{
      const along=.08+u*.95,across=(v-.5)*.77*Math.pow(Math.max(0,Math.sin(u*Math.PI)),.7);
      return [s*(along*Math.cos(angle)-across*Math.sin(angle)),s*(along*Math.sin(angle)+across*Math.cos(angle)),s*(.48*u*u-.2*Math.sin(u*Math.PI)+.16*(2*v-1)**2*Math.sin(u*Math.PI))+layer*.14];
    },{u:21,v:13,material:MAT.CORAL,twoSided:true});
  }
  for(let i=0;i<220;i++){const r=.13*Math.sqrt(i/220),a=i*2.39996;b.point([r*Math.cos(a),r*Math.sin(a),.46-r],[0,0,1],MAT.GOLD);}
  return b.finish();
}
function shell(seed,quality){
  const b=new ModelBuilder(quality),turns=TAU*1.9;
  b.surface((u,v)=>{const a=u*turns,r=.07+.68*u*u,tube=(.035+.23*u)*(1+.035*Math.cos(a*24));return[(r+tube*Math.cos(v*TAU))*Math.cos(a),(r+tube*Math.cos(v*TAU))*Math.sin(a),tube*Math.sin(v*TAU)+.35*u];},{u:140,v:25,material:MAT.GOLD,twoSided:true});
  return b.finish();
}
function ribbon(seed,quality){
  const b=new ModelBuilder(quality),random=rng(seed),lobes=2+Math.floor(random()*2);
  b.surface((u,v)=>{const a=u*TAU,w=(v-.5)*.40,r=.7+.18*Math.cos(lobes*a);return[(r+w*Math.cos(a*1.5))*Math.cos(a),(r+w*Math.cos(a*1.5))*Math.sin(a),.34*Math.sin(lobes*a)+w*Math.sin(a*1.5)];},{u:128,v:17,material:MAT.CYAN,twoSided:true});
  return b.finish();
}
function lantern(seed,quality){
  const b=new ModelBuilder(quality);
  b.surface((u,v)=>{const a=v*TAU,t=u*Math.PI,r=Math.pow(Math.max(0,Math.sin(t)),.8)*(.65+.10*Math.cos(a*11));return[r*Math.cos(a),.88*Math.cos(t),r*Math.sin(a)];},{u:38,v:62,material:MAT.GREEN,twoSided:true});
  return b.finish();
}
export const SCULPTURES=[
  {id:'bloom',name:'Sculptural bloom',orientation:[.35,.2,0],abstract:true,build:bloom},
  {id:'spiral-shell',name:'Spiral shell',orientation:[.35,-.3,0],abstract:true,build:shell},
  {id:'silk-ribbon',name:'Folded ribbon',orientation:[.3,.2,0],abstract:true,build:ribbon},
  {id:'seed-lantern',name:'Seed lantern',orientation:[.6,0,.3],abstract:true,build:lantern}
];
