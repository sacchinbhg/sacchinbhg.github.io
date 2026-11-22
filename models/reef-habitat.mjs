import { ModelBuilder, MAT, TAU, rng } from './geometry.mjs';

// Original rooted reef studies: all attachment points sit at positive y.
// Tops grow toward negative y. Thin fronds are explicitly double sided.
const E=(b,c,r,o={})=>b.ellipsoid(c,r,{u:18,v:26,...o});
const T=(b,path,r,o={})=>b.tube(path,r,{u:24,v:9,...o});
const mix=(a,c,t)=>a.map((n,i)=>n+(c[i]-n)*t);
const bez=(a,c,d,e)=>t=>a.map((n,i)=>(1-t)**3*n+3*(1-t)**2*t*c[i]+3*(1-t)*t*t*d[i]+t**3*e[i]);
const sin=t=>Math.max(0,Math.sin(t*Math.PI));
const fract=n=>n-Math.floor(n);
// Staggered corallite mouths follow the surface coordinates, not a screen-space
// noise texture. Their chalky rims remain readable after rainbow recolouring.
const polyp=(u,v,rows,columns)=>((fract(u*rows)-.5)/.24)**2+((fract(v*columns+(Math.floor(u*rows)%2)*.5)-.5)/.30)**2;
const corallites=(rows,columns)=>({
  material:(u,v)=>{const p=polyp(u,v,rows,columns);return p<.22?MAT.BROWN:p<1.1?MAT.IVORY:MAT.CORAL;},
  shade:(u,v)=>{const p=polyp(u,v,rows,columns);return p<.22?.62:p<1.1?.98:.78+.12*Math.cos(u*TAU*rows*.5)**2;}
});
const sway=(b,seed,pivot,amplitude=.025,axis=[0,0,1])=>{
  const random=rng(seed);return b.joint({pivot,axis,amplitude,speed:.45+random()*.2,phase:random()*TAU});
};
function base(b,width=.20,depth=.18){E(b,[0,.80,0],[width,.075,depth],{material:MAT.BROWN,u:12,v:20});}

function branchingCoral(seed,quality=1){
  const b=new ModelBuilder(quality),random=rng(seed);base(b,.27,.23);
  T(b,bez([0,.82,0],[.04,.37,0],[-.07,-.12,0],[.02,-.68,.02]),t=>.105*(1-.69*t),{...corallites(17,7),u:34,v:14});
  // Alternate forks grow in depth as well as sideways, like a staghorn colony.
  for(let tier=0;tier<4;tier++)for(const side of [-1,1]){
    const y=.51-tier*.27,z=(tier%2?-.09:.07),endX=side*(.52-tier*.055),endY=y-.38;
    const path=bez([0,y,0],[side*.19,y-.06,z],[endX,y-.17,z*1.4],[endX,endY,z*1.5]);
    T(b,path,t=>.064*(1-.72*t),{...corallites(11,5),u:25,v:10});
    for(let j=1;j<=2;j++){
      const p=path(j/3),tip=[p[0]+side*(.10+random()*.05),p[1]-.18-random()*.09,p[2]+(j%2?-.12:.13)];
      T(b,bez(p,[p[0]+side*.04,p[1]-.07,p[2]],mix(p,tip,.72),tip),t=>.032*(1-.68*t),{...corallites(7,4),u:14,v:8});
      E(b,tip,[.012,.018,.012],{pattern:(u)=>u<.24?MAT.BROWN:u<.42?MAT.WHITE:MAT.IVORY,shade:u=>u<.24?.64:1,u:6,v:8});
    }
  }
  for(let i=0;i<3;i++)T(b,bez([.02,-.40,.02],[.02+(i-1)*.10,-.50,.03],[.02+(i-1)*.12,-.66,.04],[.02+(i-1)*.13,-.84,.03]),t=>.033*(1-.68*t),{...corallites(9,4),u:18,v:8});
  return b.finish();
}

function seaFan(seed,quality=1){
  const b=new ModelBuilder(quality),joint=sway(b,seed,[0,.72,0],.020);base(b,.18,.15);
  T(b,t=>[0,.80-.72*t,0],t=>.052*(1-.35*t),{material:MAT.BROWN,shade:(u,v)=>.65+.25*Math.cos(v*TAU*5)**2,joint,u:24,v:11});
  // A broad, lacy planar network. Sparse crossbars leave real openings.
  const branches=[];
  for(let i=0;i<13;i++){
    const a=-1.26+i/12*2.52,tip=[Math.sin(a)*.76,-.20-Math.cos(a)*.65,.06*Math.sin(a*3)];
    const path=bez([0,.18,0],[Math.sin(a)*.18,-.03,.02],[tip[0]*.8,tip[1]+.20,tip[2]],tip);branches.push(path);
    T(b,path,t=>.032*(1-.72*t),{material:(u,v)=>Math.cos(u*TAU*11+v*TAU)>.72?MAT.IVORY:MAT.RUST,shade:(u,v)=>.76+.22*Math.cos(v*TAU*3)**2,joint,u:22,v:6});
    for(let fork=0;fork<2;fork++){
      const p=path(.48+fork*.23),side=i<6?-1:1,tip2=[p[0]+side*.105,p[1]-.21,p[2]+.025];
      T(b,bez(p,mix(p,tip2,.3),mix(p,tip2,.7),tip2),t=>.014*(1-.60*t),{material:u=>Math.cos(u*TAU*5)>.6?MAT.IVORY:MAT.CORAL,shade:u=>.78+.20*Math.cos(u*TAU*5)**2,joint,u:10,v:5});
    }
  }
  for(let level=1;level<=4;level++)for(let i=0;i<12;i++){
    const a=branches[i](.17+level*.17),c=branches[i+1](.17+level*.17);
    T(b,t=>mix(a,c,t).map((n,k)=>n+(k===1?-.025*Math.sin(t*Math.PI):k===2?.014*Math.sin(t*Math.PI):0)),.008,{material:MAT.CORAL,shade:t=>.72+.25*sin(t),joint,u:7,v:4});
    if(level<4&&(i+level)%2===0){
      const upper=branches[i+1](.17+(level+1)*.17);
      T(b,t=>mix(a,upper,t).map((n,k)=>n+(k===2?.010*sin(t):0)),.0045,{material:MAT.IVORY,shade:.86,joint,u:6,v:4});
    }
  }
  return b.finish();
}

function tubeSponge(seed,quality=1){
  const b=new ModelBuilder(quality),random=rng(seed);base(b,.42,.30);
  const tubes=[[-.25,.10,1.25,.11],[.02,-.12,1.60,.135],[.27,.10,1.14,.12],[-.10,.23,.87,.125],[.21,-.16,1.39,.095]];
  for(const [x,z,height,r]of tubes){
    const lean=(random()-.5)*.15,path=t=>[x+lean*t*t,.78-height*t,z+.035*Math.sin(t*Math.PI)];
    b.surface((u,v)=>{const p=path(u),a=v*TAU,rr=r*(1+.06*Math.sin(u*TAU*3)+.035*Math.cos(a*9));return[p[0]+rr*Math.cos(a),p[1],p[2]+rr*Math.sin(a)];},{material:(u,v)=>{const p=polyp(u,v,13,9);return p<.30?MAT.INK:p<1?MAT.SAND:MAT.GOLD;},shade:(u,v)=>polyp(u,v,13,9)<.30?.62:.76+.20*Math.cos(v*TAU*9)**2,u:26,v:20,twoSided:true});
    // The visible inner wall and thick rim make a tube, not a solid finger.
    b.surface((u,v)=>{const p=path(1-u*.20),a=v*TAU,rr=r*.72;return[p[0]+rr*Math.cos(a),p[1],p[2]+rr*Math.sin(a)];},{material:u=>u>.42?MAT.INK:MAT.BROWN,shade:u=>.62+.20*(1-u),u:8,v:18,twoSided:true});
    const top=path(1);b.surface((u,v)=>{const a=v*TAU,rr=r*(.72+.28*u);return[top[0]+rr*Math.cos(a),top[1]-.015*Math.sin(u*Math.PI),top[2]+rr*Math.sin(a)];},{material:u=>u<.20?MAT.BROWN:u<.80?MAT.IVORY:MAT.SAND,shade:(u,v)=>.80+.20*sin(u)*(Math.cos(v*TAU*10)**2),u:6,v:20,twoSided:true});
    const throat=path(.80);b.surface((u,v)=>{const a=v*TAU,rr=r*.72*u;return[throat[0]+rr*Math.cos(a),throat[1]+.012*(1-u*u),throat[2]+rr*Math.sin(a)];},{material:MAT.INK,shade:.62,u:6,v:18,twoSided:true});
    for(let i=0;i<6;i++){const t=.12+i*.13,a=i*2.39996,p=path(t);E(b,[p[0]+r*Math.cos(a),p[1],p[2]+r*Math.sin(a)],[.012,.018,.012],{pattern:u=>u>.32&&u<.66?MAT.INK:MAT.SAND,shade:.78,u:6,v:8});}
  }
  return b.finish();
}

function seaAnemone(seed,quality=1){
  const b=new ModelBuilder(quality),random=rng(seed);base(b,.29,.26);
  T(b,t=>[0,.80-t*.48,0],t=>.22-.055*t,{material:(u,v)=>Math.cos(v*TAU*12)>.30?MAT.CORAL:MAT.RUST,shade:(u,v)=>.68+.28*Math.cos(v*TAU*12)**2,u:22,v:24});
  E(b,[0,.29,0],[.27,.065,.25],{pattern:(u,v)=>Math.cos(v*TAU*26)>.30?MAT.IVORY:MAT.RUST,shade:(u,v)=>.74+.24*Math.cos(v*TAU*26)**2,u:14,v:28});
  E(b,[0,.225,0],[.070,.018,.060],{material:MAT.INK,shade:.65,u:10,v:16});
  for(let i=0;i<13;i++){
    const a=i*TAU/13;
    T(b,t=>{const r=.073+t*.15;return[r*Math.cos(a),.29-.065*Math.sqrt(1-(r/.27)**2)-.002,r*Math.sin(a)*.93];},.0045,{material:MAT.GOLD,shade:.94,u:10,v:4});
  }
  for(let ring=0;ring<2;ring++)for(let i=0;i<13;i++){
    const a=(i+ring*.47)*TAU/13,r0=.13+ring*.09,length=.78+random()*.28,spread=ring?.34:.17;
    const root=[Math.cos(a)*r0,.28,Math.sin(a)*r0],tip=[Math.cos(a)*(r0+spread),.28-length,Math.sin(a)*(r0+spread)];
    const joint=sway(b,seed+i+ring*19,root,.045,[Math.sin(a),0,-Math.cos(a)]);
    T(b,bez(root,[Math.cos(a)*(r0+.13),.03,Math.sin(a)*(r0+.13)],[tip[0]-.09*Math.sin(a),tip[1]+.12,tip[2]+.09*Math.cos(a)],tip),t=>.031*(1-.62*t),{material:(u,v)=>u>.66&&polyp(u,v,9,4)<.65?MAT.IVORY:ring?MAT.CORAL:MAT.GOLD,shade:(u,v)=>.74+.24*Math.cos(u*TAU*4+v*TAU*.5)**2,joint,u:18,v:7});
    E(b,tip,[.020,.026,.020],{pattern:(u,v)=>polyp(u,v,3,4)<.45?MAT.CORAL:MAT.IVORY,shade:(u,v)=>polyp(u,v,3,4)<.45?.72:1,joint,u:6,v:8});
  }
  return b.finish();
}

function kelp(seed,quality=1){
  const b=new ModelBuilder(quality),random=rng(seed);base(b,.22,.19);
  for(let stalk=0;stalk<3;stalk++){
    const offset=(stalk-1)*.13,height=1.40+(stalk===1?.22:0),joint=sway(b,seed+stalk,[offset,.77,0],.035);
    const path=t=>[offset+Math.sin(t*3+stalk)*.10*t,.79-height*t,(stalk-1)*.075+.045*Math.sin(t*4)];
    T(b,path,t=>.018*(1-.45*t),{material:MAT.BROWN,shade:(u,v)=>.72+.24*Math.cos(v*TAU*3)**2,joint,u:36,v:7});
    for(let i=1;i<=6;i++){
      const t=i/7,p=path(t),side=(i+stalk)%2?1:-1,length=.29+.08*random(),tip=[p[0]+side*length,p[1]-.21,p[2]+.06*Math.sin(i)];
      E(b,[p[0]+side*.025,p[1]-.015,p[2]],[.028,.040,.028],{pattern:u=>u<.15||u>.85?MAT.BROWN:MAT.GOLD,shade:u=>.74+.24*sin(u),joint,u:6,v:8});
      b.surface((u,v)=>{const c=mix(p,tip,u),w=(2*v-1)*.072*sin(u)**.7;return[c[0]-w*.45,c[1]+w,c[2]+.055*Math.sin(u*TAU*1.5)*sin(u)+.025*(2*v-1)**2];},{material:(u,v)=>v<.10||v>.90?MAT.BROWN:Math.abs(Math.sin((u*7+Math.abs(v-.5)*1.7)*TAU))>.95?MAT.IVORY:MAT.GREEN,shade:(u,v)=>.66+.28*Math.cos((v-.5)*Math.PI*3)**2+.05*Math.sin(u*TAU*2)**2,joint,u:16,v:8,twoSided:true});
      T(b,u=>mix(p,tip,u).map((n,k)=>n+(k===2?.055*Math.sin(u*TAU*1.5)*sin(u):0)),.005,{material:MAT.GOLD,shade:.96,joint,u:12,v:4});
    }
  }
  // Tangled, short holdfast roots anchor the colony visibly to the aquarium floor.
  for(let i=0;i<7;i++){const a=i*TAU/7;T(b,bez([0,.70,0],[.10*Math.cos(a),.74,.10*Math.sin(a)],[.20*Math.cos(a),.80,.20*Math.sin(a)],[.24*Math.cos(a),.81,.24*Math.sin(a)]),t=>.018*(1-.65*t),{material:MAT.BROWN,u:13,v:6});}
  return b.finish();
}

function eelgrass(seed,quality=1){
  const b=new ModelBuilder(quality),random=rng(seed);base(b,.22,.18);
  for(let i=0;i<14;i++){
    const a=i*2.39996,r=.13*Math.sqrt(i/14),root=[r*Math.cos(a),.81,r*Math.sin(a)],height=.95+random()*.75,lean=(random()-.5)*.53;
    const joint=sway(b,seed+i,root,.035,[Math.cos(a),0,Math.sin(a)]);
    b.surface((u,v)=>{const w=(2*v-1)*(.023+.013*Math.sin(u*Math.PI))*(1-u*.83);return[root[0]+lean*u*u+w*Math.cos(a),root[1]-height*u,root[2]+.13*Math.sin(u*Math.PI)*Math.sin(a)+w*Math.sin(a)];},{material:(u,v)=>v<.09||v>.91?MAT.BROWN:Math.abs(v-.5)<.07?MAT.IVORY:i%3?MAT.GREEN:MAT.GOLD,shade:(u,v)=>.67+.28*Math.cos(v*Math.PI*4)**2+.04*u,joint,u:32,v:8,twoSided:true});
    T(b,u=>{const t=.015+.97*u;return[root[0]+lean*t*t,root[1]-height*t,root[2]+.13*Math.sin(t*Math.PI)*Math.sin(a)+.0015];},u=>.0025*(1-.65*u),{material:MAT.GOLD,shade:.93,joint,u:20,v:4});
  }
  for(let i=0;i<7;i++){const a=i*TAU/7;T(b,t=>[Math.cos(a)*.20*t,.81+.025*Math.sin(t*Math.PI),Math.sin(a)*.16*t],.009,{material:MAT.BROWN,u:10,v:5});}
  return b.finish();
}

function brainCoral(seed,quality=1){
  const b=new ModelBuilder(quality);base(b,.65,.55);
  // A dense stone dome with raised, sinuous septal walls in every quadrant.
  b.surface((u,v)=>{const theta=u*Math.PI/2,a=v*TAU,r=Math.sin(theta);return[.73*r*Math.cos(a),.77-1.25*Math.cos(theta),.62*r*Math.sin(a)];},{material:(u,v)=>Math.cos(u*TAU*18+Math.sin(v*TAU*7))>.6?MAT.NAVY:MAT.BROWN,shade:(u,v)=>.62+.16*Math.cos(u*TAU*18+Math.sin(v*TAU*7))**2,u:30,v:52,twoSided:true});
  for(let band=0;band<12;band++){
    const theta=.11+band*.119;
    T(b,t=>{const a=t*TAU,warp=.037*Math.sin(a*7+band*.9)+.025*Math.sin(a*11-band*.7),th=theta+warp,r=Math.sin(th);return[.739*r*Math.cos(a),.77-1.262*Math.cos(th),.629*r*Math.sin(a)];},.019,{material:(u,v)=>Math.cos(u*TAU*38+v*TAU)>.45?MAT.IVORY:MAT.GOLD,shade:(u,v)=>.76+.23*Math.cos(u*TAU*38+v*TAU)**2,u:46,v:6});
    T(b,t=>{const a=t*TAU,th=theta+.034+.037*Math.sin(a*7+band*.9)+.025*Math.sin(a*11-band*.7),r=Math.sin(th);return[.735*r*Math.cos(a),.77-1.255*Math.cos(th),.625*r*Math.sin(a)];},.006,{material:MAT.NAVY,shade:.62,u:32,v:4});
  }
  for(let i=0;i<12;i++){
    const a=i*TAU/12,theta=.22+(i%5)*.22;
    T(b,t=>{const th=theta+t*.11,r=Math.sin(th);return[.739*r*Math.cos(a),.77-1.262*Math.cos(th),.629*r*Math.sin(a)];},.019,{material:MAT.GOLD,u:8,v:5});
  }
  return b.finish();
}

function clam(seed,quality=1){
  const b=new ModelBuilder(quality);base(b,.34,.30);
  // Two ribbed valves share a rear hinge. The upper fan stands open, the lower
  // valve cups forward, so the silhouette remains a clam from oblique angles.
  const upper=(u,v,inner=false)=>{
    const a=(v-.5)*Math.PI*.96,r=u*(.77+.022*Math.cos(a*14)),rib=.020*Math.cos(a*14)*Math.sin(u*Math.PI);
    return[Math.sin(a)*r,.68-Math.cos(a)*r*1.63,-.13+.12*sin(u)+rib+(inner?.018:0)];
  };
  const lower=(u,v)=>{const a=(v-.5)*Math.PI*1.25,r=u*(.76+.020*Math.cos(a*14));return[Math.sin(a)*r,.70-.18*sin(u)+.014*Math.cos(a*14)*u,-.13+Math.cos(a)*r];};
  b.surface(upper,{material:(u,v)=>Math.cos(u*TAU*18)>.80?MAT.BROWN:Math.cos((v-.5)*Math.PI*.96*14)<-.4?MAT.SAND:MAT.IVORY,shade:(u,v)=>.68+.20*Math.cos((v-.5)*Math.PI*.96*14)**2+.11*Math.cos(u*TAU*18)**2,u:30,v:42,twoSided:true});
  b.surface(lower,{material:(u,v)=>Math.cos(u*TAU*16)>.88?MAT.SAND:MAT.IVORY,shade:(u,v)=>.76+.18*Math.cos(u*TAU*16)**2+.05*Math.sin(v*TAU*3)**2,u:26,v:40,twoSided:true});
  for(let i=0;i<15;i++){
    const v=i/14;T(b,t=>upper(t,v).map((n,k)=>n+(k===2?.012:0)),t=>.008+.006*t,{material:MAT.GOLD,shade:t=>.78+.20*Math.cos(t*TAU*14)**2,u:14,v:4});
    T(b,t=>lower(t,v).map((n,k)=>n-(k===1?.012:0)),t=>.008+.005*t,{material:MAT.GOLD,shade:t=>.80+.18*Math.cos(t*TAU*12)**2,u:14,v:4});
  }
  T(b,t=>upper(1,t),.020,{material:MAT.BROWN,u:42,v:8});T(b,t=>lower(1,t),.020,{material:MAT.BROWN,u:42,v:8});
  // Ruffled mantle stays inside the valve rim, leaving its familiar outline.
  b.surface((u,v)=>{const p=lower(.79+u*.14,v);return[p[0],p[1]-.018-.017*Math.sin(v*TAU*14)*sin(u),p[2]];},{material:(u,v)=>Math.cos(v*TAU*14)>.55?MAT.IVORY:MAT.CORAL,shade:(u,v)=>.73+.26*Math.cos(v*TAU*14)**2,u:6,v:56,twoSided:true});
  E(b,[0,.52,.28],[.13,.13,.13],{material:MAT.IVORY,u:20,v:28});
  E(b,[0,.64,.10],[.21,.055,.19],{pattern:(u,v)=>Math.cos(v*TAU*10)>.4?MAT.CORAL:MAT.RUST,shade:(u,v)=>.72+.25*Math.cos(v*TAU*10)**2,u:13,v:20});
  return b.finish();
}

const entry=(id,name,build,orientation=[-.12,-.25,0],minSize=.17)=>({id,name,category:'Habitat',orientation,minSize,build});
export const HABITAT_MODELS=[
  entry('branching-coral','Branching coral',branchingCoral,[-.05,-.23,0],.18),
  entry('sea-fan','Sea fan',seaFan,[-.04,-.16,0],.18),
  entry('tube-sponge','Tube sponge',tubeSponge,[-.20,-.28,0],.16),
  entry('sea-anemone','Sea anemone',seaAnemone,[-.19,-.25,0],.18),
  entry('kelp','Kelp',kelp,[-.04,-.17,0],.17),
  entry('eelgrass','Eelgrass',eelgrass,[-.04,-.22,0],.16),
  entry('brain-coral','Brain coral',brainCoral,[-.24,-.23,0],.17),
  entry('clam','Clam',clam,[-.17,-.25,0],.17)
];
